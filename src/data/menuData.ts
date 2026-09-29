import { MenuItem, Testimonial, CategoryItem, DeliveryLocality } from '../types';

// Real live dishes are managed dynamically via Firebase Firestore in Admin Panel
export const MENU_ITEMS: MenuItem[] = [];

export const TESTIMONIALS: Testimonial[] = [];

// Real live categories are managed dynamically via Firebase Firestore in Admin Panel
export const DEFAULT_CATEGORIES: CategoryItem[] = [];

export const DEFAULT_LOCALITIES: DeliveryLocality[] = [
  { id: 'loc-dispur', name: 'Dispur', deliveryTime: '30-40 mins', deliveryFee: 0, isActive: true },
  { id: 'loc-beltola', name: 'Beltola', deliveryTime: '30-45 mins', deliveryFee: 0, isActive: true },
  { id: 'loc-hatigaon', name: 'Hatigaon', deliveryTime: '35-45 mins', deliveryFee: 0, isActive: true },
  { id: 'loc-sixmile', name: 'Six Mile', deliveryTime: '35-45 mins', deliveryFee: 0, isActive: true },
  { id: 'loc-khanapara', name: 'Khanapara', deliveryTime: '40-50 mins', deliveryFee: 0, isActive: true },
  { id: 'loc-zooroad', name: 'Zoo Road', deliveryTime: '35-45 mins', deliveryFee: 0, isActive: true },
  { id: 'loc-uzanbazar', name: 'Uzan Bazar', deliveryTime: '40-50 mins', deliveryFee: 0, isActive: true },
  { id: 'loc-panbazar', name: 'Pan Bazar', deliveryTime: '40-50 mins', deliveryFee: 0, isActive: true },
  { id: 'loc-paltanbazar', name: 'Paltan Bazar', deliveryTime: '40-50 mins', deliveryFee: 0, isActive: true },
  { id: 'loc-chandmari', name: 'Chandmari', deliveryTime: '35-45 mins', deliveryFee: 0, isActive: true },
  { id: 'loc-ganeshguri', name: 'Ganeshguri', deliveryTime: '30-40 mins', deliveryFee: 0, isActive: true },
  { id: 'loc-christianbasti', name: 'Christian Basti', deliveryTime: '35-45 mins', deliveryFee: 0, isActive: true },
  { id: 'loc-jalukbari', name: 'Jalukbari', deliveryTime: '45-60 mins', deliveryFee: 40, isActive: true },
  { id: 'loc-bhangagarh', name: 'Bhangagarh', deliveryTime: '35-45 mins', deliveryFee: 0, isActive: true },
];

export const SERVICEABLE_AREAS = DEFAULT_LOCALITIES.map(l => l.name);
