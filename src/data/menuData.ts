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

export const DEFAULT_TIFFIN_PLANS: import('../types').TiffinPlan[] = [
  {
    id: 'plan-trial',
    planKey: 'TRIAL_1_DAY',
    name: '1-Day Trial Tiffin',
    badgeTag: 'Taste First',
    daysCount: 1,
    vegPrice: 130,
    nonVegPrice: 170,
    description: 'Taste our authentic mud-chulha cooked lunch box once at your office desk with zero commitment.',
    vegIncludes: [
      'Joha Rice + Mati/Yellow Dal',
      'Seasonal Labra / Paneer Dish',
      'Assamese Aloo or Khar Pitika',
      'Fresh Salad, Green Chilli & Kaji Nemu'
    ],
    nonVegIncludes: [
      'Joha Rice + Mati/Yellow Dal',
      'Local Chulha Fish Curry or Chicken',
      'Assamese Aloo or Khar Pitika',
      'Fresh Salad, Green Chilli & Kaji Nemu'
    ],
    perks: [
      'Free desk delivery to your office floor',
      'Hot insulated packaging',
      'Zero lock-in or subscription requirement'
    ],
    displayOrder: 1,
    isActive: true
  },
  {
    id: 'plan-weekly',
    planKey: 'WEEKLY_6_DAYS',
    name: 'Weekly Office Pass',
    badgeTag: 'Most Popular',
    daysCount: 6,
    vegPrice: 750,
    nonVegPrice: 980,
    description: 'Monday to Saturday fresh office lunch with daily variety and priority desk delivery across Guwahati.',
    vegIncludes: [
      'Daily Rotational Menu (Different Sabji & Dal daily)',
      'Paneer, Bilahi Tok, Mati Dal & Khar variety',
      'Aromatic Joha Rice & Traditional Pitika',
      'Fresh Salad & Assam Lemon daily'
    ],
    nonVegIncludes: [
      'Daily Rotational Menu (Local Fish, Chicken & Duck)',
      'Authentic Mud-Chulha Fish Curry & Chicken alternate days',
      'Joha Rice & Traditional Assamese Dal',
      'Seasonal Sabji, Pitika & Salad'
    ],
    perks: [
      'Priority Desk Delivery at your fixed lunch hour',
      'Flexible Pause/Resume anytime on WhatsApp',
      'Savings compared to daily ordering'
    ],
    displayOrder: 2,
    isActive: true
  },
  {
    id: 'plan-monthly',
    planKey: 'MONTHLY_26_DAYS',
    name: 'Monthly Corporate Pass',
    badgeTag: 'Best Value',
    daysCount: 26,
    vegPrice: 3190,
    nonVegPrice: 4150,
    description: 'Highest savings for working professionals & corporate teams. Includes complimentary Friday sweet!',
    vegIncludes: [
      '26 Days Complete Wholesome Assamese Meals',
      'Every Friday: Complimentary Assamese Payox (Kheer)',
      'Pure Mustard Oil & Stomach-friendly spices',
      'Wide rotational ethnic menu throughout the month'
    ],
    nonVegIncludes: [
      '26 Days Complete Wholesome Assamese Non-Veg Meals',
      'Every Friday: Complimentary Assamese Payox (Kheer)',
      'Fish, Chicken & Duck curry rotation',
      'Pure Mustard Oil & Authentic Chulha Aroma'
    ],
    perks: [
      'Maximum savings (~₹122/veg meal, ~₹159/non-veg meal)',
      'Free Friday Payox/Kheer sweet included',
      'Carry forward unused meals on official leave',
      'Dedicated WhatsApp Account Manager'
    ],
    displayOrder: 3,
    isActive: true
  }
];
