export type MenuCategory = 
  | 'ALL'
  | 'ASSAMESE TRADITIONAL THALI'
  | 'BENGALI THALI'
  | 'RICE & CURRY'
  | 'VEGETARIAN'
  | 'NON-VEGETARIAN'
  | 'SIDES'
  | 'DESSERTS'
  | 'BEVERAGES'
  | (string & {});

export interface CategoryItem {
  id: string;
  name: string;
  label: string;
  icon: string;
  description?: string;
  displayOrder?: number;
  createdAt?: any;
}

export interface DeliveryLocality {
  id: string;
  name: string;
  deliveryTime?: string;
  deliveryFee?: number;
  isActive: boolean;
  createdAt?: any;
}

export interface MenuItem {
  id: string;
  name: string;
  assameseName: string;
  category: MenuCategory;
  price: number;
  originalPrice?: number;
  description: string;
  longDescription?: string;
  image: string;
  isVeg: boolean;
  isBestseller?: boolean;
  isSignature?: boolean;
  isTasteOfAssam?: boolean;
  spiceLevel?: 'Mild' | 'Medium' | 'Traditional Spicy';
  firewoodSpecial?: boolean;
  thaliIncludes?: string[];
  prepTime?: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  specialNotes?: string;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  email?: string;
  address: string;
  landmark: string;
  deliveryArea: string;
  deliverySlot: 'Immediate (40-50 mins)' | 'Lunch (12:30 PM - 2:00 PM)' | 'Dinner (7:30 PM - 9:30 PM)';
  paymentMethod: 'UPI' | 'Card' | 'COD';
  instructions?: string;
}

export type OrderStatus = 'NEW' | 'COOKING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerDetails;
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  packagingFee: number;
  grandTotal: number;
  status: OrderStatus;
  paymentMethod: 'UPI' | 'Card' | 'COD';
  paymentStatus: 'PAID' | 'PENDING_COD';
  createdAt?: any;
  placedTimeStr?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  dishOrdered: string;
  date: string;
}
