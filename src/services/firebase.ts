import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User 
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp,
  writeBatch
} from "firebase/firestore";
import { MenuItem, Order, OrderStatus, CategoryItem, DeliveryLocality } from "../types";
import { DEFAULT_CATEGORIES, DEFAULT_LOCALITIES } from "../data/menuData";

// Firebase credentials provided by user
const firebaseConfig = {
  apiKey: "AIzaSyCfqr5bugCCAz-t894oB2solVapTRXNhiA",
  authDomain: "darikana-kitchen.firebaseapp.com",
  projectId: "darikana-kitchen",
  storageBucket: "darikana-kitchen.firebasestorage.app",
  messagingSenderId: "497529828438",
  appId: "1:497529828438:web:39b2b5a80f924abf9477f7",
  measurementId: "G-2C4Z256JQP"
};

// Initialize Firebase safely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Authentication Helpers
export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
};
export type { User };

// Firestore Collections
const PRODUCTS_COLLECTION = "products";
const ORDERS_COLLECTION = "orders";
const CATEGORIES_COLLECTION = "categories";
const LOCALITIES_COLLECTION = "localities";

/**
 * Remove undefined values to prevent Firestore 'Unsupported field value: undefined' errors
 */
export function cleanFirestoreData<T extends Record<string, any>>(data: T): Partial<T> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result as Partial<T>;
}

/**
 * Real-time subscription to products collection in Firestore.
 * Subscribes to the live collection so ANY product added or modified in Firebase shows directly.
 */
export function subscribeToProducts(
  onUpdate: (products: MenuItem[]) => void,
  onError?: (error: Error) => void
) {
  const colRef = collection(db, PRODUCTS_COLLECTION);
  
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: MenuItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          name: data.name || "Untitled Dish",
          assameseName: data.assameseName || "",
          category: data.category || "ASSAMESE TRADITIONAL THALI",
          price: Number(data.price) || 0,
          originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
          description: data.description || "",
          longDescription: data.longDescription || "",
          image: data.image || "/images/assamese-thali.jpg",
          isVeg: Boolean(data.isVeg),
          isBestseller: Boolean(data.isBestseller),
          isSignature: Boolean(data.isSignature),
          isTasteOfAssam: Boolean(data.isTasteOfAssam),
          spiceLevel: data.spiceLevel || "Medium",
          firewoodSpecial: Boolean(data.firewoodSpecial),
          prepTime: data.prepTime || "25-35 mins",
          thaliIncludes: Array.isArray(data.thaliIncludes) ? data.thaliIncludes : [],
          _createdAt: data.createdAt
        } as MenuItem & { _createdAt?: any });
      });

      // Sort: Newest created dishes first, then alphabetical fallback
      items.sort((a: any, b: any) => {
        const timeA = a._createdAt?.toMillis ? a._createdAt.toMillis() : (a._createdAt ? new Date(a._createdAt).getTime() : 0);
        const timeB = b._createdAt?.toMillis ? b._createdAt.toMillis() : (b._createdAt ? new Date(b._createdAt).getTime() : 0);
        if (timeB !== timeA) return timeB - timeA;
        return a.name.localeCompare(b.name);
      });

      onUpdate(items);
    },
    (err) => {
      console.warn("Firestore onSnapshot warning/error:", err.message);
      if (onError) onError(err);
    }
  );
}

/**
 * Add a new product to Firestore
 */
export async function addProductToFirestore(item: Omit<MenuItem, "id">): Promise<string> {
  const cleaned = cleanFirestoreData(item);
  const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
    ...cleaned,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
}

/**
 * Update an existing product in Firestore
 */
export async function updateProductInFirestore(id: string, updates: Partial<MenuItem>): Promise<void> {
  const cleaned = cleanFirestoreData(updates);
  delete (cleaned as any).id;
  delete (cleaned as any)._createdAt;
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  await updateDoc(docRef, {
    ...cleaned,
    updatedAt: serverTimestamp()
  });
}

/**
 * Delete a product from Firestore
 */
export async function deleteProductFromFirestore(id: string): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  await deleteDoc(docRef);
}

/**
 * Seed initial menu items to Firestore in batches
 */
export async function seedInitialProducts(defaultItems: MenuItem[]): Promise<number> {
  let count = 0;
  // Write individually or in small batches with clean data to avoid undefined errors
  for (const item of defaultItems) {
    const docRef = doc(collection(db, PRODUCTS_COLLECTION));
    const cleaned = cleanFirestoreData(item);
    delete (cleaned as any).id;
    await setDoc(docRef, {
      ...cleaned,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    count++;
  }
  return count;
}

/* =========================================================================
   ORDERS MANAGEMENT (Receive and Manage Live Orders)
========================================================================= */

/**
 * Add a customer order to Firestore
 */
export async function addOrderToFirestore(orderData: Omit<Order, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
    ...orderData,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

/**
 * Real-time subscription to incoming orders in Firestore
 */
export function subscribeToOrders(
  onUpdate: (orders: Order[]) => void,
  onError?: (error: Error) => void
) {
  const q = query(collection(db, ORDERS_COLLECTION), orderBy("createdAt", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const ordersList: Order[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        ordersList.push({
          id: docSnap.id,
          orderNumber: data.orderNumber || docSnap.id.slice(0, 7).toUpperCase(),
          customer: data.customer,
          items: data.items || [],
          subtotal: Number(data.subtotal) || 0,
          deliveryCharge: Number(data.deliveryCharge) || 0,
          packagingFee: Number(data.packagingFee) || 0,
          grandTotal: Number(data.grandTotal) || 0,
          status: (data.status as OrderStatus) || "NEW",
          paymentMethod: data.paymentMethod || "UPI",
          paymentStatus: data.paymentStatus || (data.paymentMethod === "COD" ? "PENDING_COD" : "PAID"),
          createdAt: data.createdAt,
          placedTimeStr: data.placedTimeStr || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        });
      });
      onUpdate(ordersList);
    },
    (err) => {
      console.warn("Firestore orders onSnapshot warning:", err.message);
      if (onError) onError(err);
    }
  );
}

/**
 * Update order status (NEW -> COOKING -> OUT_FOR_DELIVERY -> DELIVERED)
 */
export async function updateOrderStatusInFirestore(orderId: string, status: OrderStatus): Promise<void> {
  const docRef = doc(db, ORDERS_COLLECTION, orderId);
  await updateDoc(docRef, {
    status,
    updatedAt: serverTimestamp()
  });
}

/**
 * Delete / Archive order from Firestore
 */
export async function deleteOrderFromFirestore(orderId: string): Promise<void> {
  const docRef = doc(db, ORDERS_COLLECTION, orderId);
  await deleteDoc(docRef);
}

/* =========================================================================
   DYNAMIC CATEGORIES MANAGEMENT (Admin can add/remove categories)
========================================================================= */

/**
 * Real-time subscription to categories in Firestore
 */
export function subscribeToCategories(
  onUpdate: (categories: CategoryItem[]) => void,
  onError?: (error: Error) => void
) {
  const q = query(collection(db, CATEGORIES_COLLECTION), orderBy("displayOrder", "asc"));

  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        // Return default categories if none exists in Firestore yet
        onUpdate(DEFAULT_CATEGORIES);
        return;
      }
      const catList: CategoryItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        catList.push({
          id: docSnap.id,
          name: data.name || docSnap.id,
          label: data.label || data.name || docSnap.id,
          icon: data.icon || "🍲",
          description: data.description || "",
          displayOrder: typeof data.displayOrder === "number" ? data.displayOrder : 99,
          createdAt: data.createdAt
        });
      });
      onUpdate(catList);
    },
    (err) => {
      console.warn("Firestore categories onSnapshot warning:", err.message);
      onUpdate(DEFAULT_CATEGORIES);
      if (onError) onError(err);
    }
  );
}

/**
 * Add a new product category to Firestore
 */
export async function addCategoryToFirestore(category: Omit<CategoryItem, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), {
    name: category.name.trim().toUpperCase(),
    label: category.label.trim(),
    icon: category.icon || "🍲",
    description: category.description || "",
    displayOrder: typeof category.displayOrder === "number" ? category.displayOrder : 99,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

/**
 * Delete a category from Firestore
 */
export async function deleteCategoryFromFirestore(categoryId: string): Promise<void> {
  const docRef = doc(db, CATEGORIES_COLLECTION, categoryId);
  await deleteDoc(docRef);
}

/**
 * Seed default categories into Firestore
 */
export async function seedDefaultCategories(): Promise<void> {
  const batch = writeBatch(db);
  for (const cat of DEFAULT_CATEGORIES) {
    const docRef = doc(db, CATEGORIES_COLLECTION, cat.id);
    batch.set(docRef, {
      name: cat.name,
      label: cat.label,
      icon: cat.icon,
      displayOrder: cat.displayOrder ?? 99,
      createdAt: serverTimestamp()
    });
  }
  await batch.commit();
}

/* =========================================================================
   DYNAMIC GUWAHATI LOCALITIES (Admin can add/remove delivery areas)
========================================================================= */

/**
 * Real-time subscription to Guwahati delivery localities
 */
export function subscribeToLocalities(
  onUpdate: (localities: DeliveryLocality[]) => void,
  onError?: (error: Error) => void
) {
  const q = query(collection(db, LOCALITIES_COLLECTION), orderBy("name", "asc"));

  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        // Return default localities if none exists in Firestore yet
        onUpdate(DEFAULT_LOCALITIES);
        return;
      }
      const locList: DeliveryLocality[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        locList.push({
          id: docSnap.id,
          name: data.name || docSnap.id,
          deliveryTime: data.deliveryTime || "35-45 mins",
          deliveryFee: typeof data.deliveryFee === "number" ? data.deliveryFee : 0,
          isActive: data.isActive !== false,
          createdAt: data.createdAt
        });
      });
      onUpdate(locList);
    },
    (err) => {
      console.warn("Firestore localities onSnapshot warning:", err.message);
      onUpdate(DEFAULT_LOCALITIES);
      if (onError) onError(err);
    }
  );
}

/**
 * Add a new delivery locality to Firestore
 */
export async function addLocalityToFirestore(locality: Omit<DeliveryLocality, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, LOCALITIES_COLLECTION), {
    name: locality.name.trim(),
    deliveryTime: locality.deliveryTime || "35-45 mins",
    deliveryFee: typeof locality.deliveryFee === "number" ? locality.deliveryFee : 0,
    isActive: locality.isActive ?? true,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

/**
 * Update a locality (e.g. toggle active, update delivery time or fee)
 */
export async function updateLocalityInFirestore(localityId: string, updates: Partial<DeliveryLocality>): Promise<void> {
  const docRef = doc(db, LOCALITIES_COLLECTION, localityId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
}

/**
 * Delete a locality from Firestore
 */
export async function deleteLocalityFromFirestore(localityId: string): Promise<void> {
  const docRef = doc(db, LOCALITIES_COLLECTION, localityId);
  await deleteDoc(docRef);
}

/**
 * Seed default Guwahati localities into Firestore
 */
export async function seedDefaultLocalities(): Promise<void> {
  const batch = writeBatch(db);
  for (const loc of DEFAULT_LOCALITIES) {
    const docRef = doc(db, LOCALITIES_COLLECTION, loc.id);
    batch.set(docRef, {
      name: loc.name,
      deliveryTime: loc.deliveryTime || "35-45 mins",
      deliveryFee: loc.deliveryFee || 0,
      isActive: loc.isActive,
      createdAt: serverTimestamp()
    });
  }
  await batch.commit();
}

