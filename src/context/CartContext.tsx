import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { MenuItem, CartItem, CustomerDetails, Order, OrderStatus, CategoryItem, DeliveryLocality, TiffinBooking, TiffinBookingStatus, TiffinPlanType, TiffinPlan } from '../types';
import { MENU_ITEMS, DEFAULT_CATEGORIES, DEFAULT_LOCALITIES, SERVICEABLE_AREAS, DEFAULT_TIFFIN_PLANS } from '../data/menuData';
import { 
  subscribeToProducts, 
  addProductToFirestore, 
  updateProductInFirestore, 
  deleteProductFromFirestore,
  seedInitialProducts,
  subscribeToOrders,
  addOrderToFirestore,
  updateOrderStatusInFirestore,
  deleteOrderFromFirestore,
  subscribeToCategories,
  addCategoryToFirestore,
  deleteCategoryFromFirestore,
  seedDefaultCategories,
  subscribeToLocalities,
  addLocalityToFirestore,
  updateLocalityInFirestore,
  deleteLocalityFromFirestore,
  seedDefaultLocalities,
  subscribeToTiffinBookings,
  addTiffinBookingToFirestore,
  updateTiffinBookingStatusInFirestore,
  deleteTiffinBookingFromFirestore,
  subscribeToTiffinPlans,
  updateTiffinPlanInFirestore,
  addTiffinPlanToFirestore,
  deleteTiffinPlanFromFirestore,
  seedDefaultTiffinPlans,
  seedTiffinPlansWithData
} from '../services/firebase';

interface OrderSuccessData {
  orderId: string;
  customer: CustomerDetails;
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  packagingFee: number;
  grandTotal: number;
  placedAt: string;
}

interface CartContextType {
  products: MenuItem[];
  isLoadingProducts: boolean;
  orders: Order[];
  isLoadingOrders: boolean;
  categories: CategoryItem[];
  isLoadingCategories: boolean;
  localities: DeliveryLocality[];
  isLoadingLocalities: boolean;
  serviceableAreaNames: string[];
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  deliveryCharge: number;
  packagingFee: number;
  grandTotal: number;
  freeDeliveryThreshold: number;
  freeDeliveryRemaining: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isTiffinModalOpen: boolean;
  setIsTiffinModalOpen: (open: boolean) => void;
  selectedTiffinPlanPreset: { planType?: TiffinPlanType; isVeg?: boolean } | null;
  openTiffinBookingModal: (preset?: { planType?: TiffinPlanType; isVeg?: boolean }) => void;
  tiffinSuccess: TiffinBooking | null;
  setTiffinSuccess: (booking: TiffinBooking | null) => void;
  tiffinBookings: TiffinBooking[];
  isLoadingTiffinBookings: boolean;
  tiffinPlans: TiffinPlan[];
  isLoadingTiffinPlans: boolean;
  updateTiffinPlan: (planId: string, updates: Partial<TiffinPlan>) => Promise<void>;
  addTiffinPlan: (plan: Omit<TiffinPlan, 'id'>) => Promise<string>;
  deleteTiffinPlan: (planId: string) => Promise<void>;
  seedTiffinPlans: () => Promise<void>;
  selectedThaliModal: MenuItem | null;
  setSelectedThaliModal: (item: MenuItem | null) => void;
  orderSuccess: OrderSuccessData | null;
  setOrderSuccess: (data: OrderSuccessData | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  deliveryCheck: { checked: boolean; serviceable: boolean; area: string; message: string };
  checkDeliveryArea: (query: string) => void;
  currentRoute: 'home' | 'admin' | 'menu';
  navigateTo: (route: 'home' | 'admin' | 'menu') => void;
  addProduct: (item: Omit<MenuItem, 'id'>) => Promise<string>;
  updateProduct: (id: string, updates: Partial<MenuItem>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  seedProducts: () => Promise<number>;
  submitCustomerOrder: (customer: CustomerDetails) => Promise<string>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  submitTiffinBooking: (booking: Omit<TiffinBooking, 'id' | 'bookingNumber' | 'status' | 'createdAt' | 'placedTimeStr'>) => Promise<string>;
  updateTiffinStatus: (bookingId: string, status: TiffinBookingStatus) => Promise<void>;
  deleteTiffinBooking: (bookingId: string) => Promise<void>;
  addCategory: (category: Omit<CategoryItem, 'id'>) => Promise<string>;
  deleteCategory: (categoryId: string) => Promise<void>;
  seedCategories: () => Promise<void>;
  addLocality: (locality: Omit<DeliveryLocality, 'id'>) => Promise<string>;
  updateLocality: (localityId: string, updates: Partial<DeliveryLocality>) => Promise<void>;
  deleteLocality: (localityId: string) => Promise<void>;
  seedLocalities: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Routing state ('home', 'admin', or 'menu')
  const [currentRoute, setCurrentRoute] = useState<'home' | 'admin' | 'menu'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || hash === '#admin') return 'admin';
      if (path === '/menu' || hash === '#menu-page') return 'menu';
    }
    return 'home';
  });

  const navigateTo = (route: 'home' | 'admin' | 'menu') => {
    setCurrentRoute(route);
    if (route === 'admin') {
      window.history.pushState(null, '', '/admin');
    } else if (route === 'menu') {
      window.history.pushState(null, '', '/menu');
    } else {
      window.history.pushState(null, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync route on popstate (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || hash === '#admin') {
        setCurrentRoute('admin');
      } else if (path === '/menu' || hash === '#menu-page') {
        setCurrentRoute('menu');
      } else {
        setCurrentRoute('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Purge any legacy dummy cached products/categories
  useEffect(() => {
    try {
      const cached = localStorage.getItem('darikana_cached_products');
      if (cached && (cached.includes('Axomiya Ghorua Thali') || cached.includes('Bangali Niramish Thali'))) {
        localStorage.removeItem('darikana_cached_products');
        localStorage.removeItem('darikana_cached_categories');
      }
    } catch {}
  }, []);

  const [products, setProducts] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem('darikana_cached_products');
      if (saved && !saved.includes('Axomiya Ghorua Thali')) {
        return JSON.parse(saved);
      }
      return [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('darikana_cached_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  // Dynamic Categories from Firestore
  const [rawCategories, setRawCategories] = useState<CategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('darikana_cached_categories');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Resolved dynamic categories: uses explicit Firestore categories, or derives them from actual products
  const categories = useMemo(() => {
    if (rawCategories.length > 0) {
      return rawCategories;
    }
    // If no explicit categories exist, automatically derive from whatever real products exist in Firestore
    const uniqueCats = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
    return uniqueCats.map((cat, idx) => ({
      id: cat,
      name: cat,
      label: cat,
      icon: '🍲',
      displayOrder: idx + 1
    }));
  }, [rawCategories, products]);

  // Dynamic Localities (Guwahati delivery zones) from Firestore
  const [localities, setLocalities] = useState<DeliveryLocality[]>(() => {
    try {
      const saved = localStorage.getItem('darikana_cached_localities');
      return saved ? JSON.parse(saved) : DEFAULT_LOCALITIES;
    } catch {
      return DEFAULT_LOCALITIES;
    }
  });
  const [isLoadingLocalities, setIsLoadingLocalities] = useState(true);

  // Memoized dynamic list of active serviceable areas for checkout & delivery checker
  const serviceableAreaNames = useMemo(() => {
    const active = localities.filter(l => l.isActive).map(l => l.name);
    return active.length > 0 ? active : SERVICEABLE_AREAS;
  }, [localities]);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('darikana_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTiffinModalOpen, setIsTiffinModalOpen] = useState(false);
  const [selectedTiffinPlanPreset, setSelectedTiffinPlanPreset] = useState<{ planType?: TiffinPlanType; isVeg?: boolean } | null>(null);
  const [tiffinSuccess, setTiffinSuccess] = useState<TiffinBooking | null>(null);
  const [tiffinBookings, setTiffinBookings] = useState<TiffinBooking[]>(() => {
    try {
      const saved = localStorage.getItem('darikana_cached_tiffin');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isLoadingTiffinBookings, setIsLoadingTiffinBookings] = useState(true);

  // Dynamic Tiffin Plans (Pricing & Details editable by Admin)
  const [tiffinPlans, setTiffinPlans] = useState<TiffinPlan[]>(() => {
    try {
      const saved = localStorage.getItem('darikana_cached_tiffin_plans');
      return saved ? JSON.parse(saved) : DEFAULT_TIFFIN_PLANS;
    } catch {
      return DEFAULT_TIFFIN_PLANS;
    }
  });
  const [isLoadingTiffinPlans, setIsLoadingTiffinPlans] = useState(true);

  const openTiffinBookingModal = (preset?: { planType?: TiffinPlanType; isVeg?: boolean }) => {
    if (preset) {
      setSelectedTiffinPlanPreset(preset);
    } else {
      setSelectedTiffinPlanPreset(null);
    }
    setTiffinSuccess(null);
    setIsTiffinModalOpen(true);
  };

  const [selectedThaliModal, setSelectedThaliModal] = useState<MenuItem | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<OrderSuccessData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [deliveryCheck, setDeliveryCheck] = useState<{ checked: boolean; serviceable: boolean; area: string; message: string }>({
    checked: false,
    serviceable: false,
    area: '',
    message: ''
  });

  // Real-time Firestore Products sync
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = subscribeToProducts(
      (firestoreItems) => {
        if (!isMounted) return;
        setIsLoadingProducts(false);
        setProducts(firestoreItems || []);
        try {
          localStorage.setItem('darikana_cached_products', JSON.stringify(firestoreItems || []));
        } catch {}
      },
      (err) => {
        console.warn("Firestore products warning:", err.message);
        if (isMounted) setIsLoadingProducts(false);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Real-time Firestore Orders sync
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = subscribeToOrders(
      (firestoreOrders) => {
        if (!isMounted) return;
        setIsLoadingOrders(false);
        setOrders(firestoreOrders);
        try {
          localStorage.setItem('darikana_cached_orders', JSON.stringify(firestoreOrders));
        } catch {}
      },
      (err) => {
        console.warn("Orders listener warning:", err.message);
        if (isMounted) setIsLoadingOrders(false);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Real-time Firestore Categories sync
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = subscribeToCategories(
      (firestoreCategories) => {
        if (!isMounted) return;
        setIsLoadingCategories(false);
        setRawCategories(firestoreCategories || []);
        try {
          localStorage.setItem('darikana_cached_categories', JSON.stringify(firestoreCategories || []));
        } catch {}
      },
      (err) => {
        console.warn("Categories listener warning:", err.message);
        if (isMounted) setIsLoadingCategories(false);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Real-time Firestore Localities sync
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = subscribeToLocalities(
      (firestoreLocalities) => {
        if (!isMounted) return;
        setIsLoadingLocalities(false);
        if (firestoreLocalities && firestoreLocalities.length > 0) {
          setLocalities(firestoreLocalities);
          try {
            localStorage.setItem('darikana_cached_localities', JSON.stringify(firestoreLocalities));
          } catch {}
        } else {
          setLocalities(DEFAULT_LOCALITIES);
        }
      },
      (err) => {
        console.warn("Localities listener warning:", err.message);
        if (isMounted) setIsLoadingLocalities(false);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Real-time Firestore Tiffin Bookings sync
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = subscribeToTiffinBookings(
      (firestoreBookings) => {
        if (!isMounted) return;
        setIsLoadingTiffinBookings(false);
        setTiffinBookings(firestoreBookings || []);
        try {
          localStorage.setItem('darikana_cached_tiffin', JSON.stringify(firestoreBookings || []));
        } catch {}
      },
      (err) => {
        console.warn("Tiffin bookings listener warning:", err.message);
        if (isMounted) setIsLoadingTiffinBookings(false);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Real-time Firestore Tiffin Plans sync
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = subscribeToTiffinPlans(
      (firestorePlans) => {
        if (!isMounted) return;
        setIsLoadingTiffinPlans(false);
        if (firestorePlans && firestorePlans.length > 0) {
          setTiffinPlans(firestorePlans);
          try {
            localStorage.setItem('darikana_cached_tiffin_plans', JSON.stringify(firestorePlans));
          } catch {}
        } else {
          // If Firestore is empty or not seeded yet, check if user had previously customized plans
          try {
            const saved = localStorage.getItem('darikana_cached_tiffin_plans');
            if (saved) {
              const parsed = JSON.parse(saved);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setTiffinPlans(parsed);
                // Also write these plans to Firestore so Firestore now has them
                seedTiffinPlansWithData(parsed).catch(() => {});
                return;
              }
            }
          } catch {}
          setTiffinPlans(DEFAULT_TIFFIN_PLANS);
          seedTiffinPlansWithData(DEFAULT_TIFFIN_PLANS).catch(() => {});
        }
      },
      (err) => {
        console.warn("Tiffin plans listener warning:", err.message);
        if (isMounted) {
          setIsLoadingTiffinPlans(false);
          // Preserve localStorage on error/offline
          try {
            const saved = localStorage.getItem('darikana_cached_tiffin_plans');
            if (saved) {
              const parsed = JSON.parse(saved);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setTiffinPlans(parsed);
              }
            }
          } catch {}
        }
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('darikana_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  const addToCart = (item: MenuItem, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(ci => ci.item.id === item.id);
      if (existing) {
        return prev.map(ci =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + quantity } : ci
        );
      }
      return [...prev, { item, quantity }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(ci => ci.item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev =>
      prev.map(ci => (ci.item.id === itemId ? { ...ci, quantity } : ci))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Add Product to Firestore
  const addProduct = async (item: Omit<MenuItem, 'id'>): Promise<string> => {
    try {
      const id = await addProductToFirestore(item);
      const newDish: MenuItem = { id, ...item };
      setProducts(prev => {
        if (prev.some(p => p.id === id)) return prev;
        return [newDish, ...prev];
      });
      return id;
    } catch (err: any) {
      console.error("Firestore addProduct error:", err);
      throw new Error(err.message || "Failed to store product in Firebase Firestore.");
    }
  };

  // Update Product in Firestore
  const updateProduct = async (id: string, updates: Partial<MenuItem>): Promise<void> => {
    try {
      await updateProductInFirestore(id, updates);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    } catch (err: any) {
      console.error("Firestore updateProduct error:", err);
      throw new Error(err.message || "Failed to update product in Firebase Firestore.");
    }
  };

  // Delete Product from Firestore
  const deleteProduct = async (id: string): Promise<void> => {
    try {
      await deleteProductFromFirestore(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      removeFromCart(id);
    } catch (err: any) {
      console.error("Firestore deleteProduct error:", err);
      throw new Error(err.message || "Failed to delete product from Firebase Firestore.");
    }
  };

  // Seed default menu to Firestore
  const seedProducts = async (): Promise<number> => {
    const count = await seedInitialProducts(MENU_ITEMS);
    return count;
  };

  // Pricing calculations
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);
  const freeDeliveryThreshold = 499;
  const freeDeliveryRemaining = Math.max(0, freeDeliveryThreshold - subtotal);
  const deliveryCharge = subtotal === 0 ? 0 : subtotal >= freeDeliveryThreshold ? 0 : 40;
  const packagingFee = subtotal === 0 ? 0 : 25;
  const grandTotal = subtotal + deliveryCharge + packagingFee;

  // Submit Customer Order (Writes to Firestore Collection 'orders')
  const submitCustomerOrder = async (customer: CustomerDetails): Promise<string> => {
    const orderNumber = `DK-${Math.floor(100000 + Math.random() * 900000)}`;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrderData: Omit<Order, 'id'> = {
      orderNumber,
      customer,
      items: [...cart],
      subtotal,
      deliveryCharge,
      packagingFee,
      grandTotal,
      status: 'NEW',
      paymentMethod: customer.paymentMethod,
      paymentStatus: customer.paymentMethod === 'COD' ? 'PENDING_COD' : 'PAID',
      placedTimeStr: timeStr
    };

    let savedId = orderNumber;
    try {
      savedId = await addOrderToFirestore(newOrderData);
    } catch (err: any) {
      console.warn("Firestore order write failed, using local tracking:", err.message);
    }

    const localOrder: Order = { id: savedId, ...newOrderData };
    setOrders(prev => [localOrder, ...prev]);

    setOrderSuccess({
      orderId: orderNumber,
      customer,
      items: [...cart],
      subtotal,
      deliveryCharge,
      packagingFee,
      grandTotal,
      placedAt: timeStr
    });

    clearCart();
    return orderNumber;
  };

  // Update Order Status in Firestore
  const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> => {
    try {
      await updateOrderStatusInFirestore(orderId, status);
    } catch (err: any) {
      console.warn("Firestore update order status warning:", err.message);
    }
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  // Delete Order in Firestore
  const deleteOrder = async (orderId: string): Promise<void> => {
    try {
      await deleteOrderFromFirestore(orderId);
    } catch (err: any) {
      console.warn("Firestore delete order warning:", err.message);
    }
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  // Submit Office Tiffin Booking
  const submitTiffinBooking = async (bookingData: Omit<TiffinBooking, 'id' | 'bookingNumber' | 'status' | 'createdAt' | 'placedTimeStr'>): Promise<string> => {
    const bookingNumber = 'TIF-' + Math.floor(100000 + Math.random() * 900000);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newBooking: Omit<TiffinBooking, 'id'> = {
      ...bookingData,
      bookingNumber,
      status: 'NEW',
      placedTimeStr: timeStr
    };

    let savedId = bookingNumber;
    try {
      savedId = await addTiffinBookingToFirestore(newBooking);
    } catch (err: any) {
      console.warn("Firestore tiffin booking write error, fallback to local:", err.message);
    }

    const createdBooking: TiffinBooking = { id: savedId, ...newBooking };
    setTiffinBookings(prev => [createdBooking, ...prev]);
    setTiffinSuccess(createdBooking);

    return bookingNumber;
  };

  // Update Tiffin Status in Firestore
  const updateTiffinStatus = async (bookingId: string, status: TiffinBookingStatus): Promise<void> => {
    try {
      await updateTiffinBookingStatusInFirestore(bookingId, status);
    } catch (err: any) {
      console.warn("Firestore update tiffin status warning:", err.message);
    }
    setTiffinBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
  };

  // Delete Tiffin Booking in Firestore
  const deleteTiffinBooking = async (bookingId: string): Promise<void> => {
    try {
      await deleteTiffinBookingFromFirestore(bookingId);
    } catch (err: any) {
      console.warn("Firestore delete tiffin booking warning:", err.message);
    }
    setTiffinBookings(prev => prev.filter(b => b.id !== bookingId));
  };

  // Tiffin Plans Actions (Editable by Admin)
  const updateTiffinPlan = async (planId: string, updates: Partial<TiffinPlan>): Promise<void> => {
    const existing = tiffinPlans.find(p => p.id === planId) || DEFAULT_TIFFIN_PLANS.find(p => p.id === planId);
    const mergedPlan: TiffinPlan = {
      id: planId,
      name: updates.name ?? existing?.name ?? 'Tiffin Plan',
      planKey: updates.planKey ?? existing?.planKey ?? planId,
      badgeTag: updates.badgeTag ?? existing?.badgeTag ?? '',
      daysCount: updates.daysCount ?? existing?.daysCount ?? 1,
      vegPrice: typeof updates.vegPrice === 'number' ? updates.vegPrice : (existing?.vegPrice ?? 0),
      nonVegPrice: typeof updates.nonVegPrice === 'number' ? updates.nonVegPrice : (existing?.nonVegPrice ?? 0),
      description: updates.description ?? existing?.description ?? '',
      vegIncludes: updates.vegIncludes ?? existing?.vegIncludes ?? [],
      nonVegIncludes: updates.nonVegIncludes ?? existing?.nonVegIncludes ?? [],
      perks: updates.perks ?? existing?.perks ?? [],
      displayOrder: updates.displayOrder ?? existing?.displayOrder ?? 1,
      isActive: updates.isActive ?? existing?.isActive ?? true
    };

    // 1. Update React state & localStorage immediately so page reload retains new price
    setTiffinPlans(prev => {
      const exists = prev.some(p => p.id === planId);
      const next = exists 
        ? prev.map(p => p.id === planId ? { ...p, ...updates } : p)
        : [...prev, mergedPlan];
      try {
        localStorage.setItem('darikana_cached_tiffin_plans', JSON.stringify(next));
      } catch (e) {
        console.error("Failed to save tiffin plans to localStorage:", e);
      }
      return next;
    });

    // 2. Persist to Firestore with setDoc merge
    try {
      await updateTiffinPlanInFirestore(planId, mergedPlan);
    } catch (err: any) {
      console.warn("Firestore update tiffin plan error:", err.message);
    }
  };

  const addTiffinPlan = async (plan: Omit<TiffinPlan, 'id'>): Promise<string> => {
    let savedId = 'plan-' + Date.now();
    try {
      savedId = await addTiffinPlanToFirestore(plan);
    } catch (err: any) {
      console.warn("Firestore add tiffin plan error:", err.message);
    }
    const newPlan: TiffinPlan = { id: savedId, ...plan };
    setTiffinPlans(prev => {
      const next = [...prev, newPlan];
      try {
        localStorage.setItem('darikana_cached_tiffin_plans', JSON.stringify(next));
      } catch {}
      return next;
    });
    return savedId;
  };

  const deleteTiffinPlan = async (planId: string): Promise<void> => {
    try {
      await deleteTiffinPlanFromFirestore(planId);
    } catch (err: any) {
      console.warn("Firestore delete tiffin plan error:", err.message);
    }
    setTiffinPlans(prev => {
      const next = prev.filter(p => p.id !== planId);
      try {
        localStorage.setItem('darikana_cached_tiffin_plans', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const seedTiffinPlans = async (): Promise<void> => {
    try {
      await seedDefaultTiffinPlans();
    } catch (err: any) {
      console.warn("Firestore seed default tiffin plans error:", err.message);
    }
    setTiffinPlans(DEFAULT_TIFFIN_PLANS);
    try {
      localStorage.setItem('darikana_cached_tiffin_plans', JSON.stringify(DEFAULT_TIFFIN_PLANS));
    } catch {}
  };

  // Category Actions
  const addCategory = async (category: Omit<CategoryItem, 'id'>): Promise<string> => {
    let savedId = 'cat-' + Date.now();
    try {
      savedId = await addCategoryToFirestore(category);
    } catch (err: any) {
      console.warn("Firestore addCategory warning:", err.message);
    }
    const newCat: CategoryItem = { id: savedId, ...category };
    setRawCategories(prev => [...prev, newCat]);
    return savedId;
  };

  const deleteCategory = async (categoryId: string): Promise<void> => {
    try {
      await deleteCategoryFromFirestore(categoryId);
    } catch (err: any) {
      console.warn("Firestore deleteCategory warning:", err.message);
    }
    setRawCategories(prev => prev.filter(c => c.id !== categoryId));
  };

  const seedCategories = async (): Promise<void> => {
    try {
      await seedDefaultCategories();
    } catch (err: any) {
      console.warn("Firestore seedDefaultCategories warning:", err.message);
    }
  };

  // Locality Actions
  const addLocality = async (locality: Omit<DeliveryLocality, 'id'>): Promise<string> => {
    let savedId = 'loc-' + Date.now();
    try {
      savedId = await addLocalityToFirestore(locality);
    } catch (err: any) {
      console.warn("Firestore addLocality warning:", err.message);
    }
    const newLoc: DeliveryLocality = { id: savedId, ...locality };
    setLocalities(prev => [...prev, newLoc]);
    return savedId;
  };

  const updateLocality = async (localityId: string, updates: Partial<DeliveryLocality>): Promise<void> => {
    try {
      await updateLocalityInFirestore(localityId, updates);
    } catch (err: any) {
      console.warn("Firestore updateLocality warning:", err.message);
    }
    setLocalities(prev => prev.map(l => l.id === localityId ? { ...l, ...updates } : l));
  };

  const deleteLocality = async (localityId: string): Promise<void> => {
    try {
      await deleteLocalityFromFirestore(localityId);
    } catch (err: any) {
      console.warn("Firestore deleteLocality warning:", err.message);
    }
    setLocalities(prev => prev.filter(l => l.id !== localityId));
  };

  const seedLocalities = async (): Promise<void> => {
    try {
      await seedDefaultLocalities();
    } catch (err: any) {
      console.warn("Firestore seedDefaultLocalities warning:", err.message);
    }
  };

  const checkDeliveryArea = (query: string) => {
    if (!query.trim()) {
      setDeliveryCheck({
        checked: true,
        serviceable: false,
        area: '',
        message: 'Please enter your locality or pin code.'
      });
      return;
    }
    const clean = query.trim().toLowerCase();
    const matched = serviceableAreaNames.some(area => area.toLowerCase().includes(clean) || clean.includes(area.toLowerCase()));
    
    if (matched || clean.includes('7810') || clean.includes('guwahati')) {
      setDeliveryCheck({
        checked: true,
        serviceable: true,
        area: query,
        message: 'Great news! We deliver hot firewood meals to your area within 35-45 minutes.'
      });
    } else {
      setDeliveryCheck({
        checked: true,
        serviceable: false,
        area: query,
        message: `Currently we deliver across major Guwahati zones (${serviceableAreaNames.slice(0, 4).join(', ')}, etc.). We're expanding soon!`
      });
    }
  };

  return (
    <CartContext.Provider
      value={{
        products,
        isLoadingProducts,
        orders,
        isLoadingOrders,
        categories,
        isLoadingCategories,
        localities,
        isLoadingLocalities,
        serviceableAreaNames,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        deliveryCharge,
        packagingFee,
        grandTotal,
        freeDeliveryThreshold,
        freeDeliveryRemaining,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isTiffinModalOpen,
        setIsTiffinModalOpen,
        selectedTiffinPlanPreset,
        openTiffinBookingModal,
        tiffinSuccess,
        setTiffinSuccess,
        tiffinBookings,
        isLoadingTiffinBookings,
        tiffinPlans,
        isLoadingTiffinPlans,
        updateTiffinPlan,
        addTiffinPlan,
        deleteTiffinPlan,
        seedTiffinPlans,
        selectedThaliModal,
        setSelectedThaliModal,
        orderSuccess,
        setOrderSuccess,
        searchQuery,
        setSearchQuery,
        activeCategory,
        setActiveCategory,
        deliveryCheck,
        checkDeliveryArea,
        currentRoute,
        navigateTo,
        addProduct,
        updateProduct,
        deleteProduct,
        seedProducts,
        submitCustomerOrder,
        updateOrderStatus,
        deleteOrder,
        submitTiffinBooking,
        updateTiffinStatus,
        deleteTiffinBooking,
        addCategory,
        deleteCategory,
        seedCategories,
        addLocality,
        updateLocality,
        deleteLocality,
        seedLocalities
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
