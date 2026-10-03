import React, { useState } from 'react';
import { 
  Flame, 
  ShoppingBag, 
  Plus, 
  Utensils, 
  Layers, 
  Search, 
  Upload, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  Phone, 
  MapPin, 
  Printer, 
  LogOut, 
  ExternalLink, 
  Database, 
  RefreshCw, 
  AlertCircle, 
  Sparkles, 
  ChevronRight, 
  FileText, 
  ArrowLeft,
  X,
  CreditCard,
  Banknote,
  ImageIcon,
  Lock,
  UserCheck,
  Tag,
  ToggleLeft,
  ToggleRight,
  Check,
  Calendar,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { uploadToCloudinary } from '../services/cloudinary';
import { MenuItem, MenuCategory, Order, OrderStatus, TiffinBooking, TiffinBookingStatus, TiffinPlan } from '../types';

export const AdminPage: React.FC = () => {
  const { 
    products, 
    orders, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    seedProducts, 
    updateOrderStatus, 
    deleteOrder,
    tiffinBookings,
    updateTiffinStatus,
    deleteTiffinBooking,
    tiffinPlans,
    updateTiffinPlan,
    addTiffinPlan,
    deleteTiffinPlan,
    seedTiffinPlans,
    categories,
    addCategory,
    deleteCategory,
    seedCategories,
    localities,
    addLocality,
    updateLocality,
    deleteLocality,
    seedLocalities,
    navigateTo 
  } = useCart();

  const { currentUser, login, signup, logout, error, clearError } = useAuth();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'add' | 'categories' | 'localities' | 'analytics' | 'tools' | 'tiffins'>('orders');

  // Auth Form State
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('admin@darikanakitchen.com');
  const [password, setPassword] = useState('darikana2026');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Tiffin Filter & Search State
  const [tiffinFilter, setTiffinFilter] = useState<'ALL' | TiffinBookingStatus>('ALL');
  const [tiffinSearch, setTiffinSearch] = useState('');
  const [tiffinSubTab, setTiffinSubTab] = useState<'bookings' | 'plans'>('bookings');

  // Tiffin Plan Form / Editing State
  const [editingPlan, setEditingPlan] = useState<TiffinPlan | null>(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isSubmittingPlan, setIsSubmittingPlan] = useState(false);
  const [isSeedingPlans, setIsSeedingPlans] = useState(false);
  const [planFormData, setPlanFormData] = useState({
    name: '',
    planKey: '',
    badgeTag: '',
    daysCount: 6,
    vegPrice: 750,
    nonVegPrice: 980,
    description: '',
    vegIncludes: '',
    nonVegIncludes: '',
    perks: '',
    displayOrder: 1,
    isActive: true
  });

  // Orders Filter & Search
  const [orderFilter, setOrderFilter] = useState<'ALL' | OrderStatus>('ALL');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedKOTOrder, setSelectedKOTOrder] = useState<Order | null>(null);

  // Products Search & Filter
  const [productSearch, setProductSearch] = useState('');
  const [dishFilter, setDishFilter] = useState<'ALL' | 'TASTE_OF_ASSAM' | 'VEG' | 'NON_VEG'>('ALL');
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);

  // Add Product Form State
  const [formData, setFormData] = useState({
    name: '',
    assameseName: '',
    category: 'ASSAMESE TRADITIONAL THALI' as MenuCategory,
    price: '',
    originalPrice: '',
    description: '',
    longDescription: '',
    image: '',
    isVeg: true,
    isBestseller: false,
    isSignature: false,
    isTasteOfAssam: false,
    spiceLevel: 'Medium' as 'Mild' | 'Medium' | 'Traditional Spicy',
    firewoodSpecial: true,
    prepTime: '25-35 mins',
    thaliIncludesText: ''
  });

  // Cloudinary image upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [isSubmittingDish, setIsSubmittingDish] = useState<boolean>(false);
  const [isSeeding, setIsSeeding] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Dynamic Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatLabel, setNewCatLabel] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('🍲');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [isSubmittingCat, setIsSubmittingCat] = useState(false);

  // Dynamic Locality Form State
  const [newLocName, setNewLocName] = useState('');
  const [newLocTime, setNewLocTime] = useState('30-45 mins');
  const [newLocFee, setNewLocFee] = useState('0');
  const [isSubmittingLoc, setIsSubmittingLoc] = useState(false);

  // Handle Add Category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setIsSubmittingCat(true);
    try {
      await addCategory({
        name: newCatName.trim().toUpperCase(),
        label: newCatLabel.trim() || newCatName.trim(),
        icon: newCatIcon || '🍲',
        description: newCatDesc.trim(),
        displayOrder: categories.length + 1
      });
      setNotification({ type: 'success', text: `Category "${newCatLabel || newCatName}" added to live menu!` });
      setNewCatName('');
      setNewCatLabel('');
      setNewCatDesc('');
    } catch (err: any) {
      setNotification({ type: 'error', text: err.message || 'Failed to add category' });
    } finally {
      setIsSubmittingCat(false);
    }
  };

  // Handle Add Locality
  const handleAddLocality = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocName.trim()) return;
    setIsSubmittingLoc(true);
    try {
      await addLocality({
        name: newLocName.trim(),
        deliveryTime: newLocTime.trim() || '30-45 mins',
        deliveryFee: Number(newLocFee) || 0,
        isActive: true
      });
      setNotification({ type: 'success', text: `Locality "${newLocName}" added to Guwahati delivery zones!` });
      setNewLocName('');
      setNewLocFee('0');
    } catch (err: any) {
      setNotification({ type: 'error', text: err.message || 'Failed to add locality' });
    } finally {
      setIsSubmittingLoc(false);
    }
  };

  // Handle Authentication
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    setNotification(null);
    try {
      if (authMode === 'login') {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      setNotification({ type: 'success', text: 'Welcome back, Kitchen Admin!' });
    } catch {
      // error handled by AuthContext
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Tiffin Plan Handlers
  const handleOpenEditPlan = (plan: TiffinPlan) => {
    setEditingPlan(plan);
    setPlanFormData({
      name: plan.name,
      planKey: plan.planKey,
      badgeTag: plan.badgeTag || '',
      daysCount: plan.daysCount || 1,
      vegPrice: plan.vegPrice,
      nonVegPrice: plan.nonVegPrice,
      description: plan.description || '',
      vegIncludes: Array.isArray(plan.vegIncludes) ? plan.vegIncludes.join(', ') : (plan.vegIncludes || ''),
      nonVegIncludes: Array.isArray(plan.nonVegIncludes) ? plan.nonVegIncludes.join(', ') : (plan.nonVegIncludes || ''),
      perks: (plan.perks || []).join(', '),
      displayOrder: plan.displayOrder || 1,
      isActive: plan.isActive !== false
    });
    setIsPlanModalOpen(true);
  };

  const handleOpenAddPlan = () => {
    setEditingPlan(null);
    setPlanFormData({
      name: '',
      planKey: `PLAN_${Date.now()}`,
      badgeTag: '',
      daysCount: 6,
      vegPrice: 750,
      nonVegPrice: 980,
      description: 'Fresh mud-chulha lunch box delivered to your office desk daily.',
      vegIncludes: 'Aromatic Joha Rice, Yellow/Mati Dal, Seasonal Sabji (Labra), Aloo or Khar Pitika, Paneer or Bilahi Tok, Fresh Salad & Assam Lemon.',
      nonVegIncludes: 'Joha Rice, Dal, Mud-Chulha Local Fish Curry (Rohu/Borali) or Local Chicken Curry + Seasonal Sabji, Pitika & Salad.',
      perks: 'Mud-Chulha Firewood Taste, Priority Desk Delivery, Microwave-Safe Containers',
      displayOrder: tiffinPlans.length + 1,
      isActive: true
    });
    setIsPlanModalOpen(true);
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planFormData.name.trim()) {
      alert('Please enter a plan name.');
      return;
    }
    const days = Math.max(1, Number(planFormData.daysCount) || 1);
    const veg = Math.max(0, Number(planFormData.vegPrice) || 0);
    const nonVeg = Math.max(0, Number(planFormData.nonVegPrice) || 0);

    const perksArray = planFormData.perks
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const vegIncludesArray = planFormData.vegIncludes
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const nonVegIncludesArray = planFormData.nonVegIncludes
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    setIsSubmittingPlan(true);
    try {
      if (editingPlan) {
        await updateTiffinPlan(editingPlan.id, {
          name: planFormData.name.trim(),
          planKey: planFormData.planKey.trim() || editingPlan.planKey,
          badgeTag: planFormData.badgeTag.trim(),
          daysCount: days,
          vegPrice: veg,
          nonVegPrice: nonVeg,
          description: planFormData.description.trim(),
          vegIncludes: vegIncludesArray,
          nonVegIncludes: nonVegIncludesArray,
          perks: perksArray,
          displayOrder: Number(planFormData.displayOrder) || 1,
          isActive: planFormData.isActive
        });
        setNotification({ type: 'success', text: `Tiffin plan "${planFormData.name}" updated successfully!` });
      } else {
        await addTiffinPlan({
          name: planFormData.name.trim(),
          planKey: planFormData.planKey.trim() || `PLAN_${Date.now()}`,
          badgeTag: planFormData.badgeTag.trim(),
          daysCount: days,
          vegPrice: veg,
          nonVegPrice: nonVeg,
          description: planFormData.description.trim(),
          vegIncludes: vegIncludesArray,
          nonVegIncludes: nonVegIncludesArray,
          perks: perksArray,
          displayOrder: Number(planFormData.displayOrder) || tiffinPlans.length + 1,
          isActive: planFormData.isActive
        });
        setNotification({ type: 'success', text: `New tiffin plan "${planFormData.name}" created successfully!` });
      }
      setIsPlanModalOpen(false);
      setEditingPlan(null);
    } catch (err: any) {
      setNotification({ type: 'error', text: err.message || 'Failed to save tiffin plan' });
    } finally {
      setIsSubmittingPlan(false);
    }
  };

  const handleResetTiffinPlans = async () => {
    if (window.confirm('Reset tiffin plans to Darikana Kitchen default pricing (Trial ₹130/₹170, Weekly ₹750/₹980, Monthly ₹3190/₹4150)?')) {
      setIsSeedingPlans(true);
      try {
        await seedTiffinPlans();
        setNotification({ type: 'success', text: 'Default tiffin plans restored and synced to website!' });
      } catch (err: any) {
        setNotification({ type: 'error', text: err.message || 'Failed to reset tiffin plans' });
      } finally {
        setIsSeedingPlans(false);
      }
    }
  };

  // Handle file picker
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Cloudinary upload helper
  const handleCloudinaryUpload = async (): Promise<string> => {
    if (!selectedFile) {
      if (formData.image) return formData.image;
      throw new Error('Please select an image file or provide an image URL.');
    }
    setIsUploadingImage(true);
    setUploadProgress(15);
    try {
      const res = await uploadToCloudinary(selectedFile, 'darikana-kitchen-dishes', (percent) => {
        setUploadProgress(percent);
      });
      setIsUploadingImage(false);
      return res.secure_url;
    } catch (err: any) {
      setIsUploadingImage(false);
      throw new Error(err.message || 'Image upload failed.');
    }
  };

  // Submit New Dish
  const handleAddDish = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    if (!formData.name.trim()) {
      setNotification({ type: 'error', text: 'Dish name is required.' });
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setNotification({ type: 'error', text: 'Please enter a valid price.' });
      return;
    }

    setIsSubmittingDish(true);
    try {
      let finalImageUrl = formData.image;
      if (selectedFile) {
        finalImageUrl = await handleCloudinaryUpload();
      } else if (!finalImageUrl) {
        finalImageUrl = '/images/assamese-thali.jpg';
      }

      const thaliIncludes = formData.thaliIncludesText
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);

      const newDish: Omit<MenuItem, 'id'> = {
        name: formData.name.trim(),
        assameseName: formData.assameseName.trim(),
        category: formData.category,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        description: formData.description.trim(),
        longDescription: formData.longDescription.trim(),
        image: finalImageUrl,
        isVeg: formData.isVeg,
        isBestseller: formData.isBestseller,
        isSignature: formData.isSignature,
        isTasteOfAssam: formData.isTasteOfAssam,
        spiceLevel: formData.spiceLevel,
        firewoodSpecial: formData.firewoodSpecial,
        prepTime: formData.prepTime || '25-35 mins',
        thaliIncludes: thaliIncludes.length > 0 ? thaliIncludes : undefined
      };

      await addProduct(newDish);

      setNotification({
        type: 'success',
        text: `Dish "${formData.name}" published to Cloudinary & Firestore successfully!`
      });

      // Reset
      setFormData({
        name: '',
        assameseName: '',
        category: 'ASSAMESE TRADITIONAL THALI',
        price: '',
        originalPrice: '',
        description: '',
        longDescription: '',
        image: '',
        isVeg: true,
        isBestseller: false,
        isSignature: false,
        isTasteOfAssam: false,
        spiceLevel: 'Medium',
        firewoodSpecial: true,
        prepTime: '25-35 mins',
        thaliIncludesText: ''
      });
      setSelectedFile(null);
      setImagePreview('');
      setUploadProgress(0);
      setActiveTab('products');
    } catch (err: any) {
      setNotification({ type: 'error', text: err.message || 'Error saving dish.' });
    } finally {
      setIsSubmittingDish(false);
    }
  };

  // Seed Menu
  const handleSeed = async () => {
    if (!window.confirm('Seed all 20+ default Assamese Bor-Thalis and dishes to Firebase Firestore?')) return;
    setIsSeeding(true);
    try {
      const count = await seedProducts();
      setNotification({ type: 'success', text: `Synchronized ${count} dishes to Firestore!` });
    } catch (err: any) {
      setNotification({ type: 'error', text: err.message || 'Seed failed.' });
    } finally {
      setIsSeeding(false);
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    if (orderFilter !== 'ALL' && o.status !== orderFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      const matchName = o.customer.name.toLowerCase().includes(q);
      const matchPhone = o.customer.phone.includes(q);
      const matchId = o.orderNumber.toLowerCase().includes(q);
      const matchLoc = o.customer.deliveryArea.toLowerCase().includes(q);
      return matchName || matchPhone || matchId || matchLoc;
    }
    return true;
  });

  const pendingCount = orders.filter(o => o.status === 'NEW' || o.status === 'COOKING').length;
  const totalRevenue = orders.reduce((sum, o) => o.status !== 'CANCELLED' ? sum + o.grandTotal : sum, 0);

  // Filtered Tiffins
  const filteredTiffins = tiffinBookings.filter(t => {
    if (tiffinFilter !== 'ALL' && t.status !== tiffinFilter) return false;
    if (tiffinSearch.trim()) {
      const q = tiffinSearch.toLowerCase();
      const matchName = t.customerName.toLowerCase().includes(q);
      const matchPhone = t.contactNumber.includes(q);
      const matchId = t.bookingNumber.toLowerCase().includes(q);
      const matchLoc = t.deliveryArea.toLowerCase().includes(q);
      const matchOffice = (t.officeName || '').toLowerCase().includes(q);
      return matchName || matchPhone || matchId || matchLoc || matchOffice;
    }
    return true;
  });

  const newTiffinCount = tiffinBookings.filter(t => t.status === 'NEW').length;
  const activeTiffinCount = tiffinBookings.filter(t => t.status === 'ACTIVE' || t.status === 'CONFIRMED').length;
  const vegTiffinCount = tiffinBookings.filter(t => t.isVegetarian).length;
  const nonVegTiffinCount = tiffinBookings.filter(t => !t.isVegetarian).length;

  // If Not Authenticated, show Dedicated Login Screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-forest-950 text-white flex flex-col justify-between p-4 sm:p-8">
        {/* Top bar */}
        <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
          <button
            onClick={() => navigateTo('home')}
            className="inline-flex items-center gap-2 text-riceCream-300 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg bg-forest-900 border border-brass-600/30 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-brass-400" />
            <span>Back to Darikana Kitchen Store</span>
          </button>
          <span className="text-xs text-brass-400 font-medium">Firebase Auth & Cloud Firestore</span>
        </div>

        {/* Center Login Box */}
        <div className="max-w-md w-full mx-auto my-12 bg-white text-forest-950 rounded-3xl p-8 sm:p-10 shadow-2xl border border-brass-500/40">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-forest-950 text-brass-400 flex items-center justify-center mx-auto mb-4 ring-2 ring-brass-500 shadow-lg">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-forest-950">
              Kitchen Command Center
            </h2>
            <p className="text-xs text-forest-900/60 mt-1">
              Darikana Kitchen • Founder Dipali Barman
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@darikanakitchen.com"
                className="w-full px-4 py-2.5 bg-riceCream-50 border border-bamboo-300 rounded-xl text-xs text-forest-950 focus:outline-none focus:border-forest-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-riceCream-50 border border-bamboo-300 rounded-xl text-xs text-forest-950 focus:outline-none focus:border-forest-900"
              />
            </div>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full bg-gradient-to-r from-brass-600 to-brass-500 hover:from-brass-500 hover:to-brass-400 text-forest-950 font-extrabold py-3.5 rounded-xl shadow-brass text-sm transition-all flex items-center justify-center gap-2"
            >
              {isAuthLoading ? (
                <span>Verifying with Firebase...</span>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>{authMode === 'login' ? 'Sign In to Operations Dashboard' : 'Register Administrator'}</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-bamboo-200 text-center">
            <button
              type="button"
              onClick={() => {
                clearError();
                setAuthMode(authMode === 'login' ? 'signup' : 'login');
              }}
              className="text-xs text-forest-900/70 hover:text-assamRed-700 font-semibold underline"
            >
              {authMode === 'login' ? 'First time setup? Register Admin Account' : 'Existing admin? Sign in here'}
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-riceCream-300/60 pb-4">
          © 2026 Darikana Kitchen Cloud Kitchen Management
        </div>
      </div>
    );
  }

  // LOGGED IN DEDICATED ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-riceCream-100 text-forest-950 flex flex-col font-sans">
      
      {/* Top Banner & Header */}
      <header className="bg-forest-950 text-white border-b border-brass-600/30 px-4 sm:px-8 py-3.5 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="p-0.5 rounded-full ring-2 ring-brass-500 bg-white">
              <img
                src="/images/darikana-logo.jpg"
                alt="Darikana Kitchen"
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-base sm:text-lg text-white">
                  Darikana Kitchen Admin
                </h1>
                <span className="text-[10px] bg-assamRed-700 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-2.5 h-2.5 fill-current" /> Live Operations
                </span>
              </div>
              <p className="text-[11px] text-brass-400">
                Cloud Kitchen Dispatch • Dipali Barman
              </p>
            </div>
            <div className="sm:hidden flex items-center gap-1.5">
              <span className="text-[10px] bg-assamRed-700 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-2.5 h-2.5 fill-current" /> Admin
              </span>
            </div>
          </div>

          {/* Quick Actions & Storefront Link */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigateTo('home')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest-900 hover:bg-forest-850 text-brass-300 border border-brass-600/40 text-xs font-semibold transition-colors"
            >
              <span>View Customer Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={logout}
              className="p-2 rounded-xl text-riceCream-300 hover:text-white hover:bg-forest-900 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Admin Body Layout with Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 flex flex-col lg:flex-row gap-6">
        
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 space-y-4">
          
          {/* User Profile Card */}
          <div className="bg-white rounded-2xl p-4 border border-bamboo-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-forest-950 text-brass-400 flex items-center justify-center font-bold text-sm">
              {currentUser.email?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <span className="text-[11px] text-forest-900/60 block uppercase font-bold">Admin In-Charge</span>
              <p className="text-xs font-bold text-forest-950 truncate" title={currentUser.email || ''}>
                {currentUser.email}
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <div className="bg-white rounded-2xl p-2 border border-bamboo-200 shadow-sm space-y-1">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'orders'
                  ? 'bg-forest-950 text-white shadow'
                  : 'text-forest-900 hover:bg-riceCream-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 text-brass-400" />
                <span>Receive Live Orders</span>
              </div>
              {pendingCount > 0 && (
                <span className="bg-assamRed-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                  {pendingCount}
                </span>
              )}
            </button>

            {/* Office Tiffins Nav Button */}
            <button
              onClick={() => setActiveTab('tiffins')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'tiffins'
                  ? 'bg-forest-950 text-white shadow'
                  : 'text-forest-900 hover:bg-riceCream-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-sm">🍱</span>
                <span>Office Tiffins</span>
              </div>
              {newTiffinCount > 0 ? (
                <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                  {newTiffinCount}
                </span>
              ) : (
                <span className="text-[10px] text-forest-700/60 font-semibold">
                  {tiffinBookings.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'products'
                  ? 'bg-forest-950 text-white shadow'
                  : 'text-forest-900 hover:bg-riceCream-100'
              }`}
            >
              <Utensils className="w-4 h-4 text-brass-400" />
              <span>Menu Dishes ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('add')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'add'
                  ? 'bg-forest-950 text-white shadow'
                  : 'text-forest-900 hover:bg-riceCream-100'
              }`}
            >
              <Plus className="w-4 h-4 text-brass-400" />
              <span>Upload New Dish</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'categories'
                  ? 'bg-forest-950 text-white shadow'
                  : 'text-forest-900 hover:bg-riceCream-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Tag className="w-4 h-4 text-brass-400" />
                <span>Dish Categories</span>
              </div>
              <span className="text-[10px] bg-riceCream-200 text-forest-900 font-bold px-2 py-0.5 rounded-full">
                {categories.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('localities')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'localities'
                  ? 'bg-forest-950 text-white shadow'
                  : 'text-forest-900 hover:bg-riceCream-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-brass-400" />
                <span>Guwahati Localities</span>
              </div>
              <span className="text-[10px] bg-riceCream-200 text-forest-900 font-bold px-2 py-0.5 rounded-full">
                {localities.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-forest-950 text-white shadow'
                  : 'text-forest-900 hover:bg-riceCream-100'
              }`}
            >
              <Layers className="w-4 h-4 text-brass-400" />
              <span>Revenue & Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('tools')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'tools'
                  ? 'bg-forest-950 text-white shadow'
                  : 'text-forest-900 hover:bg-riceCream-100'
              }`}
            >
              <Database className="w-4 h-4 text-brass-400" />
              <span>Cloud & Database Tools</span>
            </button>
          </div>

          {/* Quick Stats Widget */}
          <div className="bg-forest-900 text-white rounded-2xl p-4 border border-brass-600/30 text-xs space-y-2">
            <span className="text-[10px] text-brass-400 font-extrabold uppercase tracking-wider block">
              Kitchen Hearth Status
            </span>
            <div className="flex justify-between">
              <span className="text-riceCream-300">Total Orders Placed:</span>
              <span className="font-bold text-white">{orders.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-riceCream-300">Kitchen Active Revenue:</span>
              <span className="font-bold text-brass-300">₹{totalRevenue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-riceCream-300">Active Firewood Dishes:</span>
              <span className="font-bold text-white">
                {products.filter(p => p.firewoodSpecial).length}
              </span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          
          {/* Notification Alert Banner */}
          {notification && (
            <div className={`p-4 rounded-2xl text-xs font-semibold mb-6 flex items-center justify-between shadow-sm animate-fadeIn ${
              notification.type === 'success'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-red-100 text-red-900 border border-red-300'
            }`}>
              <div className="flex items-center gap-2">
                {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
                <span>{notification.text}</span>
              </div>
              <button onClick={() => setNotification(null)} className="text-forest-900/60 hover:text-forest-950">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 1. RECEIVE LIVE ORDERS VIEW */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              
              {/* Header & Filter Controls */}
              <div className="bg-white rounded-2xl p-5 border border-bamboo-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif font-bold text-xl text-forest-950 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-assamRed-700" />
                    <span>Incoming Customer Orders</span>
                  </h3>
                  <p className="text-xs text-forest-900/60 mt-0.5">
                    Real-time orders received from Guwahati households via Firebase Firestore
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-forest-900/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search order ID, phone, or name..."
                    className="w-full pl-9 pr-4 py-2 bg-riceCream-50 border border-bamboo-300 rounded-xl text-xs text-forest-950 focus:outline-none focus:border-forest-900"
                  />
                </div>
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
                {[
                  { id: 'ALL', label: `All (${orders.length})` },
                  { id: 'NEW', label: `🔥 New (${orders.filter(o => o.status === 'NEW').length})` },
                  { id: 'COOKING', label: `🍲 Cooking (${orders.filter(o => o.status === 'COOKING').length})` },
                  { id: 'OUT_FOR_DELIVERY', label: `🚚 Out for Delivery (${orders.filter(o => o.status === 'OUT_FOR_DELIVERY').length})` },
                  { id: 'DELIVERED', label: `✅ Delivered (${orders.filter(o => o.status === 'DELIVERED').length})` },
                  { id: 'CANCELLED', label: `Cancelled (${orders.filter(o => o.status === 'CANCELLED').length})` }
                ].map((pill) => (
                  <button
                    key={pill.id}
                    onClick={() => setOrderFilter(pill.id as any)}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl border transition-all ${
                      orderFilter === pill.id
                        ? 'bg-forest-950 text-brass-300 border-forest-950 shadow-sm'
                        : 'bg-white text-forest-900 border-bamboo-300 hover:bg-riceCream-50'
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>

              {/* Orders List */}
              {filteredOrders.length > 0 ? (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-3xl p-5 sm:p-6 border border-bamboo-200 shadow-sm hover:shadow-md transition-shadow relative"
                    >
                      {/* Top Row: Order ID, Timestamp, Status & Action */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-bamboo-100">
                        <div className="flex items-center gap-3">
                          <span className="font-serif font-black text-lg text-forest-950">
                            #{order.orderNumber}
                          </span>
                          <span className="text-xs text-forest-900/60 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {order.placedTimeStr || 'Recent'}
                          </span>
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                            order.paymentMethod === 'COD'
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          }`}>
                            {order.paymentMethod === 'COD' ? '💵 Cash on Delivery' : '⚡ UPI Paid'}
                          </span>
                        </div>

                        {/* Status Select & KOT Print */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedKOTOrder(order)}
                            className="p-2 rounded-xl bg-riceCream-100 hover:bg-riceCream-200 text-forest-950 border border-bamboo-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                            title="Print KOT Cooking Slip"
                          >
                            <Printer className="w-3.5 h-3.5 text-brass-700" />
                            <span>KOT Slip</span>
                          </button>

                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className={`text-xs font-bold py-1.5 px-3 rounded-xl border focus:outline-none cursor-pointer ${
                              order.status === 'NEW'
                                ? 'bg-assamRed-700 text-white border-assamRed-800'
                                : order.status === 'COOKING'
                                ? 'bg-amber-600 text-white border-amber-700'
                                : order.status === 'OUT_FOR_DELIVERY'
                                ? 'bg-blue-700 text-white border-blue-800'
                                : order.status === 'DELIVERED'
                                ? 'bg-emerald-700 text-white border-emerald-800'
                                : 'bg-gray-700 text-white border-gray-800'
                            }`}
                          >
                            <option value="NEW">🔥 Just Placed (New)</option>
                            <option value="COOKING">🍲 Simmering on Chulha</option>
                            <option value="OUT_FOR_DELIVERY">🚚 Out for Delivery</option>
                            <option value="DELIVERED">✅ Delivered to Customer</option>
                            <option value="CANCELLED">❌ Cancelled</option>
                          </select>

                          <button
                            onClick={async () => {
                              if (window.confirm(`Delete order #${order.orderNumber}?`)) {
                                await deleteOrder(order.id);
                              }
                            }}
                            className="p-2 text-forest-900/40 hover:text-red-600 rounded-xl"
                            title="Delete Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Middle: Customer Details & Ordered Dishes Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-4">
                        
                        {/* Customer Info (Col 5) */}
                        <div className="lg:col-span-5 space-y-2 text-xs">
                          <div>
                            <span className="font-bold text-forest-950 text-sm block">
                              {order.customer.name}
                            </span>
                            <a
                              href={`tel:${order.customer.phone}`}
                              className="text-brass-800 font-semibold hover:underline flex items-center gap-1 mt-0.5"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>{order.customer.phone}</span>
                            </a>
                          </div>

                          <div className="flex items-start gap-1.5 text-forest-900/80">
                            <MapPin className="w-3.5 h-3.5 text-assamRed-700 shrink-0 mt-0.5" />
                            <span>
                              {order.customer.address}, <strong>{order.customer.deliveryArea}</strong>
                              {order.customer.landmark && ` (Near ${order.customer.landmark})`}
                            </span>
                          </div>

                          {order.customer.instructions && (
                            <div className="p-2.5 rounded-xl bg-riceCream-100 text-forest-900/90 border border-bamboo-200 text-[11px] italic">
                              “{order.customer.instructions}”
                            </div>
                          )}
                        </div>

                        {/* Dishes Ordered List (Col 7) */}
                        <div className="lg:col-span-7 bg-riceCream-50/80 rounded-2xl p-4 border border-bamboo-200">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-forest-900/60 block mb-2">
                            Dishes to Prepare on Chulha:
                          </span>
                          <div className="space-y-2 divide-y divide-bamboo-100 text-xs">
                            {order.items.map((cartItem, idx) => (
                              <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="w-6 h-6 rounded-lg bg-forest-950 text-brass-300 font-bold flex items-center justify-center text-xs">
                                    {cartItem.quantity}×
                                  </span>
                                  <div>
                                    <span className="font-bold text-forest-950">
                                      {cartItem.item.name}
                                    </span>
                                    {cartItem.item.firewoodSpecial && (
                                      <span className="ml-1 text-[10px] text-assamRed-700 font-bold">🔥</span>
                                    )}
                                  </div>
                                </div>
                                <span className="font-semibold text-forest-900">
                                  ₹{cartItem.item.price * cartItem.quantity}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Order Total Row */}
                          <div className="mt-3 pt-2 border-t border-bamboo-200 flex justify-between font-serif font-black text-sm text-forest-950">
                            <span>Total Payable:</span>
                            <span className="text-assamRed-700">₹{order.grandTotal}</span>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-bamboo-200">
                  <div className="w-16 h-16 rounded-full bg-riceCream-200 text-forest-900 flex items-center justify-center mx-auto mb-3 text-3xl">
                    🍱
                  </div>
                  <h4 className="font-serif text-lg font-bold text-forest-950 mb-1">
                    No Orders in this View
                  </h4>
                  <p className="text-xs text-forest-900/60 max-w-sm mx-auto mb-4">
                    {orderFilter === 'ALL' 
                      ? 'Customer orders placed from the website will appear here in real-time.' 
                      : `No orders currently match status "${orderFilter}".`}
                  </p>
                </div>
              )}

            </div>
          )}

          {/* 2. DISHES & PRODUCTS MANAGEMENT VIEW */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              
              {/* Header and Search */}
              <div className="bg-white rounded-2xl p-5 border border-bamboo-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif font-bold text-xl text-forest-950 flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-brass-700" />
                    <span>Kitchen Menu Dishes ({products.length})</span>
                  </h3>
                  <p className="text-xs text-forest-900/60 mt-0.5">
                    Directly synced with Firebase Firestore database
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 text-forest-900/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Search dish by name..."
                      className="w-full pl-9 pr-4 py-2 bg-riceCream-50 border border-bamboo-300 rounded-xl text-xs text-forest-950 focus:outline-none focus:border-forest-900"
                    />
                  </div>

                  <button
                    onClick={() => setActiveTab('add')}
                    className="bg-forest-950 hover:bg-forest-900 text-brass-300 font-bold text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Dish</span>
                  </button>
                </div>
              </div>

              {/* Quick Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDishFilter('ALL')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    dishFilter === 'ALL'
                      ? 'bg-forest-950 text-white border-forest-950 shadow-sm'
                      : 'bg-white text-forest-900 border-bamboo-200 hover:bg-riceCream-100'
                  }`}
                >
                  All Dishes ({products.length})
                </button>

                <button
                  type="button"
                  onClick={() => setDishFilter('TASTE_OF_ASSAM')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                    dishFilter === 'TASTE_OF_ASSAM'
                      ? 'bg-brass-500 text-forest-950 border-brass-600 shadow-sm font-extrabold'
                      : 'bg-white text-forest-900 border-bamboo-200 hover:bg-riceCream-100'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-brass-700" />
                  <span>The Taste of Assam ({products.filter(p => p.isTasteOfAssam).length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDishFilter('VEG')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    dishFilter === 'VEG'
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                      : 'bg-white text-forest-900 border-bamboo-200 hover:bg-riceCream-100'
                  }`}
                >
                  🌿 Veg ({products.filter(p => p.isVeg).length})
                </button>

                <button
                  type="button"
                  onClick={() => setDishFilter('NON_VEG')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    dishFilter === 'NON_VEG'
                      ? 'bg-red-800 text-white border-red-800 shadow-sm'
                      : 'bg-white text-forest-900 border-bamboo-200 hover:bg-riceCream-100'
                  }`}
                >
                  🍗 Non-Veg ({products.filter(p => !p.isVeg).length})
                </button>
              </div>

              {/* Dishes Table */}
              <div className="bg-white rounded-3xl border border-bamboo-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-forest-950 text-white uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-4">Dish</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Chulha</th>
                        <th className="p-4">The Taste of Assam</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-bamboo-100">
                      {products
                        .filter(p => {
                          if (dishFilter === 'TASTE_OF_ASSAM' && !p.isTasteOfAssam) return false;
                          if (dishFilter === 'VEG' && !p.isVeg) return false;
                          if (dishFilter === 'NON_VEG' && p.isVeg) return false;
                          if (!productSearch) return true;
                          const q = productSearch.toLowerCase();
                          return p.name.toLowerCase().includes(q) || p.assameseName.includes(q) || p.category.toLowerCase().includes(q);
                        })
                        .map((p) => (
                          <tr key={p.id} className="hover:bg-riceCream-50 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="w-12 h-12 rounded-xl object-cover border border-bamboo-200 shrink-0"
                                />
                                <div>
                                  <h5 className="font-serif font-bold text-sm text-forest-950 flex items-center gap-1.5">
                                    <span>{p.name}</span>
                                    {p.isTasteOfAssam && (
                                      <span className="text-[10px] bg-brass-100 text-brass-800 border border-brass-300 px-1.5 py-0.2 rounded font-extrabold">
                                        ★ Showcase
                                      </span>
                                    )}
                                  </h5>
                                  <p className="font-accent text-[11px] text-brass-800">
                                    {p.assameseName}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="bg-riceCream-200 text-forest-950 px-2.5 py-0.5 rounded-md font-semibold text-[10px]">
                                {p.category}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="font-serif font-bold text-sm text-forest-950">
                                ₹{p.price}
                              </span>
                              {p.originalPrice && (
                                <span className="text-[10px] text-forest-900/40 line-through ml-1">
                                  ₹{p.originalPrice}
                                </span>
                              )}
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                p.isVeg ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${p.isVeg ? 'bg-emerald-600' : 'bg-red-600'}`}></span>
                                {p.isVeg ? 'Veg' : 'Non-Veg'}
                              </span>
                            </td>
                            <td className="p-4">
                              {p.firewoodSpecial ? (
                                <span className="text-[10px] font-extrabold text-assamRed-700 bg-assamRed-50 px-2 py-0.5 rounded-full border border-assamRed-200 inline-flex items-center gap-1">
                                  <Flame className="w-3 h-3 fill-current" /> Firewood
                                </span>
                              ) : (
                                <span className="text-[10px] text-forest-900/50">Standard</span>
                              )}
                            </td>
                            <td className="p-4">
                              <button
                                type="button"
                                onClick={async () => {
                                  const updated = !p.isTasteOfAssam;
                                  await updateProduct(p.id, { isTasteOfAssam: updated });
                                  setNotification({
                                    type: 'success',
                                    text: `"${p.name}" is now ${updated ? 'FEATURED' : 'REMOVED'} in The Taste of Assam section!`
                                  });
                                }}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                                  p.isTasteOfAssam
                                    ? 'bg-brass-500 text-forest-950 font-extrabold shadow-sm border border-brass-600 scale-105'
                                    : 'bg-riceCream-100 text-forest-900/60 hover:bg-riceCream-200 border border-bamboo-300'
                                }`}
                                title="Click to feature or unfeature this dish in The Taste of Assam section"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-current" />
                                <span>{p.isTasteOfAssam ? 'Showcased ★' : '+ Feature'}</span>
                              </button>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setEditingDish(p)}
                                  className="p-1.5 text-forest-900/70 hover:text-forest-950 hover:bg-riceCream-200 rounded-lg transition-colors"
                                  title="Edit Dish"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={async () => {
                                    if (window.confirm(`Delete dish "${p.name}"?`)) {
                                      await deleteProduct(p.id);
                                      setNotification({ type: 'success', text: `Deleted "${p.name}".` });
                                    }
                                  }}
                                  className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete Dish"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* 3. UPLOAD NEW DISH (CLOUDINARY + FIRESTORE) */}
          {activeTab === 'add' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-bamboo-200 shadow-sm max-w-3xl">
              <div className="mb-6 pb-4 border-b border-bamboo-200">
                <h3 className="font-serif text-2xl font-bold text-forest-950 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-brass-700" />
                  <span>Upload Product to Cloudinary & Firestore</span>
                </h3>
                <p className="text-xs text-forest-900/70 mt-1">
                  Upload food photography directly to Cloudinary and publish new dishes to the live menu.
                </p>
              </div>

              <form onSubmit={handleAddDish} className="space-y-6">
                
                {/* Cloudinary Image Picker */}
                <div>
                  <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-brass-700" />
                    <span>Dish Photograph (Cloudinary Upload) *</span>
                  </label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    <div className="sm:col-span-4 h-36 rounded-2xl overflow-hidden bg-riceCream-100 border-2 border-dashed border-bamboo-300 flex items-center justify-center relative">
                      {imagePreview || formData.image ? (
                        <img
                          src={imagePreview || formData.image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-3 text-forest-900/40">
                          <Upload className="w-6 h-6 mx-auto mb-1" />
                          <span className="text-[11px] font-semibold block">Select Image File</span>
                        </div>
                      )}
                    </div>

                    <div className="sm:col-span-8 space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-xs text-forest-900 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-forest-950 file:text-brass-300 hover:file:bg-forest-900 cursor-pointer"
                      />
                      
                      <div className="text-[11px] text-forest-900/50">
                        — OR paste an existing image URL: —
                      </div>

                      <input
                        type="url"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="https://res.cloudinary.com/... or /images/..."
                        className="w-full px-3 py-2 bg-riceCream-50 border border-bamboo-300 rounded-xl text-xs text-forest-950 focus:outline-none focus:border-forest-900"
                      />

                      {isUploadingImage && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-brass-800">
                            <span>Uploading to Cloudinary...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="w-full bg-riceCream-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-brass-500 h-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dish Names */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1">
                      Dish Name (English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Axomiya Borali Fish Thali"
                      className="w-full px-3.5 py-2.5 bg-riceCream-50 border border-bamboo-300 rounded-xl text-xs text-forest-950 focus:outline-none focus:border-forest-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1">
                      Assamese Script Name (অসমীয়া নাম)
                    </label>
                    <input
                      type="text"
                      value={formData.assameseName}
                      onChange={(e) => setFormData({ ...formData, assameseName: e.target.value })}
                      placeholder="e.g. অসমীয়া বৰালী মাছৰ কাঁহী"
                      className="w-full px-3.5 py-2.5 bg-riceCream-50 border border-bamboo-300 rounded-xl text-xs text-forest-950 focus:outline-none focus:border-forest-900"
                    />
                  </div>
                </div>

                {/* Category & Price */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider">
                        Category *
                      </label>
                      <button
                        type="button"
                        onClick={() => setActiveTab('categories')}
                        className="text-[10px] text-brass-700 hover:text-brass-900 font-bold underline"
                      >
                        + Manage Categories
                      </button>
                    </div>
                    {categories.filter(c => c.name !== 'ALL').length > 0 ? (
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as MenuCategory })}
                        className="w-full px-3.5 py-2.5 bg-riceCream-50 border border-bamboo-300 rounded-xl text-xs text-forest-950 focus:outline-none focus:border-forest-900"
                      >
                        <option value="">-- Choose Category --</option>
                        {categories.filter(c => c.name !== 'ALL').map(cat => (
                          <option key={cat.id} value={cat.name}>
                            {cat.icon ? `${cat.icon} ` : ''}{cat.label || cat.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as MenuCategory })}
                        placeholder="e.g. THALI, FISH, DUCK, SIDES"
                        className="w-full px-3.5 py-2.5 bg-riceCream-50 border border-bamboo-300 rounded-xl text-xs text-forest-950 focus:outline-none focus:border-forest-900"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1">
                      Selling Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="e.g. 349"
                      className="w-full px-3.5 py-2.5 bg-riceCream-50 border border-bamboo-300 rounded-xl text-xs text-forest-950 focus:outline-none focus:border-forest-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1">
                      Original Price (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      placeholder="e.g. 399"
                      className="w-full px-3.5 py-2.5 bg-riceCream-50 border border-bamboo-300 rounded-xl text-xs text-forest-950 focus:outline-none focus:border-forest-900"
                    />
                  </div>
                </div>

                {/* Attributes */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-riceCream-50 border border-bamboo-200">
                  <div>
                    <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1">
                      Food Type
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, isVeg: true })}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                          formData.isVeg ? 'bg-emerald-700 text-white border-emerald-800' : 'bg-white text-forest-900 border-bamboo-300'
                        }`}
                      >
                        Veg
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, isVeg: false })}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                          !formData.isVeg ? 'bg-red-700 text-white border-red-800' : 'bg-white text-forest-900 border-bamboo-300'
                        }`}
                      >
                        Non-Veg
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1">
                      Cooking Style
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, firewoodSpecial: !formData.firewoodSpecial })}
                      className={`w-full py-1.5 text-xs font-bold rounded-lg border flex items-center justify-center gap-1.5 transition-all ${
                        formData.firewoodSpecial 
                          ? 'bg-assamRed-800 text-white border-assamRed-900' 
                          : 'bg-white text-forest-900 border-bamboo-300'
                      }`}
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>{formData.firewoodSpecial ? '🔥 Firewood' : 'Standard'}</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1">
                      Taste of Assam
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isTasteOfAssam: !formData.isTasteOfAssam })}
                      className={`w-full py-1.5 text-xs font-bold rounded-lg border flex items-center justify-center gap-1.5 transition-all ${
                        formData.isTasteOfAssam 
                          ? 'bg-brass-500 text-forest-950 border-brass-600 font-extrabold shadow-sm' 
                          : 'bg-white text-forest-900 border-bamboo-300'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-current" />
                      <span>{formData.isTasteOfAssam ? 'Showcased ★' : 'No'}</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1">
                      Spice Level
                    </label>
                    <select
                      value={formData.spiceLevel}
                      onChange={(e) => setFormData({ ...formData, spiceLevel: e.target.value as any })}
                      className="w-full px-3 py-1.5 bg-white border border-bamboo-300 rounded-lg text-xs text-forest-950"
                    >
                      <option value="Mild">Mild</option>
                      <option value="Medium">Medium</option>
                      <option value="Traditional Spicy">Traditional Spicy</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1">
                    Short Description *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Short appetizing description for menu card..."
                    className="w-full px-3.5 py-2 bg-riceCream-50 border border-bamboo-300 rounded-xl text-xs text-forest-950 focus:outline-none focus:border-forest-900"
                  />
                </div>

                {/* Thali Components */}
                <div>
                  <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1">
                    Thali Components / Recipe Breakdown (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.thaliIncludesText}
                    onChange={(e) => setFormData({ ...formData, thaliIncludesText: e.target.value })}
                    placeholder="Steamed Joha Rice&#10;Mati Mahor Dali&#10;River Fish Masor Tenga&#10;Smoked Alu Pitika with Mustard Oil"
                    className="w-full px-3.5 py-2 bg-riceCream-50 border border-bamboo-300 rounded-xl text-xs text-forest-950 focus:outline-none focus:border-forest-900 font-mono text-[11px]"
                  />
                </div>

                {/* Publish Button */}
                <button
                  type="submit"
                  disabled={isSubmittingDish || isUploadingImage}
                  className="w-full bg-gradient-to-r from-brass-600 via-brass-500 to-brass-600 hover:from-brass-500 hover:to-brass-400 text-forest-950 font-bold py-3.5 rounded-2xl shadow-brass text-sm flex items-center justify-center gap-2 transition-all"
                >
                  {isSubmittingDish ? (
                    <span>Uploading Image & Syncing to Firestore...</span>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>PUBLISH TO LIVE KITCHEN MENU</span>
                    </>
                  )}
                </button>

              </form>
            </div>
          )}

          {/* 3.5. MANAGE DISH CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-bamboo-200 shadow-sm">
                <div className="pb-4 border-b border-bamboo-200 mb-6">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-forest-950 flex items-center gap-2">
                      <Tag className="w-6 h-6 text-brass-700" />
                      <span>Manage Item Categories</span>
                    </h3>
                    <p className="text-xs text-forest-900/70 mt-1">
                      Add and configure menu categories. New categories instantly show up on the customer menu and dish upload form.
                    </p>
                  </div>
                </div>

                {/* Add Category Form */}
                <form onSubmit={handleAddCategory} className="bg-riceCream-50 p-5 rounded-2xl border border-bamboo-300/80 mb-8 space-y-4">
                  <h4 className="font-serif font-bold text-sm text-forest-950 flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-brass-700" />
                    <span>Add New Category</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-forest-900 uppercase tracking-wider mb-1">
                        Category Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        placeholder="e.g. PITHA & SNACKS"
                        className="w-full px-3 py-2 bg-white border border-bamboo-300 rounded-xl text-xs text-forest-950 uppercase focus:outline-none focus:border-forest-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-forest-900 uppercase tracking-wider mb-1">
                        Display Label *
                      </label>
                      <input
                        type="text"
                        required
                        value={newCatLabel}
                        onChange={(e) => setNewCatLabel(e.target.value)}
                        placeholder="e.g. Traditional Pitha & Snacks"
                        className="w-full px-3 py-2 bg-white border border-bamboo-300 rounded-xl text-xs text-forest-950 focus:outline-none focus:border-forest-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-forest-900 uppercase tracking-wider mb-1">
                        Icon / Emoji
                      </label>
                      <input
                        type="text"
                        value={newCatIcon}
                        onChange={(e) => setNewCatIcon(e.target.value)}
                        placeholder="e.g. 🫓 or 🍲"
                        className="w-full px-3 py-2 bg-white border border-bamboo-300 rounded-xl text-xs text-forest-950 focus:outline-none focus:border-forest-900"
                      />
                    </div>
                  </div>

                  {/* Quick emoji suggestions */}
                  <div className="flex items-center gap-1.5 flex-wrap text-xs pt-1">
                    <span className="text-[11px] text-forest-900/60 font-semibold">Suggested Icons:</span>
                    {['🍲', '👑', '🐟', '🍚', '🌿', '🍗', '🌶️', '🍯', '🍵', '🔥', '🫓', '🫖', '🎋', '✨'].map((emoji) => (
                      <button
                        type="button"
                        key={emoji}
                        onClick={() => setNewCatIcon(emoji)}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm border transition-all ${
                          newCatIcon === emoji
                            ? 'bg-forest-950 text-white border-brass-500 scale-110 shadow'
                            : 'bg-white hover:bg-riceCream-100 border-bamboo-200'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-forest-900 uppercase tracking-wider mb-1">
                      Category Description (Optional)
                    </label>
                    <input
                      type="text"
                      value={newCatDesc}
                      onChange={(e) => setNewCatDesc(e.target.value)}
                      placeholder="Brief culinary note about this section..."
                      className="w-full px-3 py-2 bg-white border border-bamboo-300 rounded-xl text-xs text-forest-950 focus:outline-none focus:border-forest-900"
                    />
                  </div>

                  <div className="pt-1 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmittingCat || !newCatName.trim()}
                      className="px-5 py-2.5 bg-forest-950 hover:bg-forest-900 text-brass-300 font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isSubmittingCat ? 'Adding...' : 'Add Category'}</span>
                    </button>
                  </div>
                </form>

                {/* Categories Table / Cards */}
                <div>
                  <h4 className="font-serif font-bold text-base text-forest-950 mb-3 flex items-center justify-between">
                    <span>Active Categories ({categories.length})</span>
                    <span className="text-xs font-normal text-forest-900/60">Real-time sync to customer menu</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categories.map((cat) => {
                      const count = products.filter(p => p.category === cat.name).length;
                      return (
                        <div
                          key={cat.id}
                          className="bg-white p-4 rounded-2xl border border-bamboo-200 shadow-sm flex items-center justify-between group hover:border-brass-500/50 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl p-2 rounded-xl bg-riceCream-100 border border-bamboo-200">
                              {cat.icon || '🍲'}
                            </span>
                            <div>
                              <h5 className="font-serif font-bold text-sm text-forest-950">
                                {cat.label || cat.name}
                              </h5>
                              <span className="text-[10px] text-forest-900/50 block font-mono">
                                {cat.name}
                              </span>
                              <span className="text-[10px] font-semibold text-brass-800 bg-brass-100/70 px-2 py-0.5 rounded-full inline-block mt-1">
                                {count} {count === 1 ? 'dish' : 'dishes'}
                              </span>
                            </div>
                          </div>

                          {cat.name !== 'ALL' && (
                            <button
                              onClick={async () => {
                                if (window.confirm(`Delete category "${cat.label || cat.name}"?`)) {
                                  await deleteCategory(cat.id);
                                  setNotification({ type: 'success', text: `Deleted category "${cat.name}".` });
                                }
                              }}
                              className="p-1.5 text-forest-900/40 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Category"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* 3.6. MANAGE GUWAHATI LOCALITIES */}
          {activeTab === 'localities' && (
            <div className="space-y-6">
              
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-bamboo-200 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-bamboo-200 mb-6">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-forest-950 flex items-center gap-2">
                      <MapPin className="w-6 h-6 text-assamRed-600" />
                      <span>Guwahati Serviceable Localities</span>
                    </h3>
                    <p className="text-xs text-forest-900/70 mt-1">
                      Configure delivery coverage zones. These options appear in customer checkout and delivery availability checks.
                    </p>
                  </div>

                  <button
                    onClick={async () => {
                      if (window.confirm('Restore standard 14 Guwahati delivery zones to Firestore?')) {
                        await seedLocalities();
                        setNotification({ type: 'success', text: '14 Guwahati delivery zones synchronized!' });
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-riceCream-100 hover:bg-riceCream-200 text-forest-900 text-xs font-bold border border-bamboo-300 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Default 14 Zones</span>
                  </button>
                </div>

                {/* Add Locality Form */}
                <form onSubmit={handleAddLocality} className="bg-riceCream-50 p-5 rounded-2xl border border-bamboo-300/80 mb-8 space-y-4">
                  <h4 className="font-serif font-bold text-sm text-forest-950 flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-brass-700" />
                    <span>Add Delivery Zone / Locality</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-forest-900 uppercase tracking-wider mb-1">
                        Locality Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={newLocName}
                        onChange={(e) => setNewLocName(e.target.value)}
                        placeholder="e.g. Kahilipara, Lokhra, Maligaon"
                        className="w-full px-3 py-2 bg-white border border-bamboo-300 rounded-xl text-xs text-forest-950 focus:outline-none focus:border-forest-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-forest-900 uppercase tracking-wider mb-1">
                        Estimated Delivery Time
                      </label>
                      <input
                        type="text"
                        value={newLocTime}
                        onChange={(e) => setNewLocTime(e.target.value)}
                        placeholder="e.g. 35-45 mins"
                        className="w-full px-3 py-2 bg-white border border-bamboo-300 rounded-xl text-xs text-forest-950 focus:outline-none focus:border-forest-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-forest-900 uppercase tracking-wider mb-1">
                        Delivery Fee (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newLocFee}
                        onChange={(e) => setNewLocFee(e.target.value)}
                        placeholder="0 for free / standard"
                        className="w-full px-3 py-2 bg-white border border-bamboo-300 rounded-xl text-xs text-forest-950 focus:outline-none focus:border-forest-900"
                      />
                    </div>
                  </div>

                  <div className="pt-1 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmittingLoc || !newLocName.trim()}
                      className="px-5 py-2.5 bg-forest-950 hover:bg-forest-900 text-brass-300 font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isSubmittingLoc ? 'Adding...' : 'Add Locality'}</span>
                    </button>
                  </div>
                </form>

                {/* Localities Table */}
                <div>
                  <h4 className="font-serif font-bold text-base text-forest-950 mb-3 flex items-center justify-between">
                    <span>Guwahati Serviceable Areas ({localities.length})</span>
                    <span className="text-xs font-normal text-forest-900/60">
                      {localities.filter(l => l.isActive).length} active for immediate dispatch
                    </span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {localities.map((loc) => (
                      <div
                        key={loc.id}
                        className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                          loc.isActive
                            ? 'bg-white border-bamboo-200 shadow-sm'
                            : 'bg-riceCream-100/60 border-gray-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            loc.isActive ? 'bg-forest-950 text-brass-400' : 'bg-gray-200 text-gray-500'
                          }`}>
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div>
                            <h5 className="font-bold text-sm text-forest-950">
                              {loc.name}
                            </h5>
                            <span className="text-[10px] text-forest-900/60 block">
                              ⏱ {loc.deliveryTime || '35-45 mins'} • {loc.deliveryFee ? `₹${loc.deliveryFee} fee` : 'Standard'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={async () => {
                              await updateLocality(loc.id, { isActive: !loc.isActive });
                              setNotification({
                                type: 'success',
                                text: `${loc.name} is now ${!loc.isActive ? 'ACTIVE' : 'INACTIVE'} for delivery.`
                              });
                            }}
                            className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                              loc.isActive
                                ? 'text-emerald-700 hover:bg-emerald-50'
                                : 'text-gray-400 hover:bg-gray-100'
                            }`}
                            title={loc.isActive ? 'Active (Click to disable)' : 'Disabled (Click to activate)'}
                          >
                            {loc.isActive ? (
                              <ToggleRight className="w-6 h-6 text-emerald-600" />
                            ) : (
                              <ToggleLeft className="w-6 h-6 text-gray-400" />
                            )}
                          </button>

                          <button
                            onClick={async () => {
                              if (window.confirm(`Delete locality "${loc.name}"?`)) {
                                await deleteLocality(loc.id);
                                setNotification({ type: 'success', text: `Removed "${loc.name}".` });
                              }
                            }}
                            className="p-1.5 text-forest-900/40 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Locality"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* 4. REVENUE & ANALYTICS VIEW */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              
              <div className="bg-white rounded-2xl p-5 border border-bamboo-200 shadow-sm">
                <h3 className="font-serif font-bold text-xl text-forest-950">
                  Kitchen Performance & Analytics
                </h3>
                <p className="text-xs text-forest-900/60 mt-0.5">
                  Order volumes, customer loyalty, and popular dishes prepared on chulha
                </p>
              </div>

              {/* 4 Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-bamboo-200 shadow-sm">
                  <span className="text-[10px] text-forest-900/60 font-bold uppercase tracking-wider block">
                    Total Gross Revenue
                  </span>
                  <span className="font-serif text-3xl font-black text-forest-950 mt-1 block">
                    ₹{totalRevenue}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
                    ↑ From active orders
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-bamboo-200 shadow-sm">
                  <span className="text-[10px] text-forest-900/60 font-bold uppercase tracking-wider block">
                    Orders Received
                  </span>
                  <span className="font-serif text-3xl font-black text-forest-950 mt-1 block">
                    {orders.length}
                  </span>
                  <span className="text-[11px] text-brass-700 font-semibold block mt-1">
                    {pendingCount} in queue
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-bamboo-200 shadow-sm">
                  <span className="text-[10px] text-forest-900/60 font-bold uppercase tracking-wider block">
                    Live Menu Dishes
                  </span>
                  <span className="font-serif text-3xl font-black text-forest-950 mt-1 block">
                    {products.length}
                  </span>
                  <span className="text-[11px] text-forest-900/70 font-semibold block mt-1">
                    8 authentic categories
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-bamboo-200 shadow-sm">
                  <span className="text-[10px] text-forest-900/60 font-bold uppercase tracking-wider block">
                    Average Order Value
                  </span>
                  <span className="font-serif text-3xl font-black text-forest-950 mt-1 block">
                    ₹{orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
                    High thali conversion
                  </span>
                </div>
              </div>

              {/* Delivery Localities Breakdown */}
              <div className="bg-white rounded-3xl p-6 border border-bamboo-200 shadow-sm">
                <h4 className="font-serif font-bold text-base text-forest-950 mb-3">
                  Top Guwahati Delivery Zones
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {['Dispur', 'Beltola', 'Zoo Road', 'Uzan Bazar'].map((loc, i) => (
                    <div key={i} className="p-3 rounded-xl bg-riceCream-50 border border-bamboo-200">
                      <span className="font-bold text-forest-950 block">{loc}</span>
                      <span className="text-[11px] text-brass-700">35-45 mins average dispatch</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* 5. DATABASE TOOLS VIEW */}
          {activeTab === 'tools' && (
            <div className="space-y-6">
              
              <div className="bg-white rounded-2xl p-5 border border-bamboo-200 shadow-sm">
                <h3 className="font-serif font-bold text-xl text-forest-950 flex items-center gap-2">
                  <Database className="w-5 h-5 text-brass-700" />
                  <span>Cloud Database & Storage Diagnostics</span>
                </h3>
                <p className="text-xs text-forest-900/60 mt-0.5">
                  Connected to your Firebase Project (`darikana-kitchen`) and Cloudinary (`bpi3s64e`)
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Firebase Status */}
                <div className="bg-white rounded-3xl p-6 border border-bamboo-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-base text-forest-950">Firebase Status</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                      Connected
                    </span>
                  </div>
                  <div className="text-xs space-y-1.5 text-forest-900/80">
                    <p>• Auth: <strong>Email / Password</strong></p>
                    <p>• Firestore Database: <strong>darikana-kitchen</strong></p>
                    <p>• Products Collection: <strong>products ({products.length} records)</strong></p>
                    <p>• Orders Collection: <strong>orders ({orders.length} records)</strong></p>
                  </div>
                </div>

                {/* Cloudinary Status */}
                <div className="bg-white rounded-3xl p-6 border border-bamboo-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-base text-forest-950">Cloudinary Media</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                      Active
                    </span>
                  </div>
                  <div className="text-xs space-y-1.5 text-forest-900/80">
                    <p>• Cloud Name: <strong>bpi3s64e</strong></p>
                    <p>• API Key: <strong>223898674186319</strong></p>
                    <p>• Signing Algorithm: <strong>SHA-1 via Web Crypto API</strong></p>
                    <p>• Direct Upload Endpoint: <strong>api.cloudinary.com/v1_1/bpi3s64e</strong></p>
                  </div>
                  <div className="pt-3 border-t border-bamboo-200 text-[11px] text-forest-900/70">
                    Images uploaded via the "Upload New Dish" form are automatically delivered via Cloudinary's global CDN.
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* 6. OFFICE TIFFIN BOOKINGS & SUBSCRIPTIONS VIEW */}
          {activeTab === 'tiffins' && (
            <div className="space-y-6">
              
              {/* Top Subtab Bar: Customer Bookings vs Plans & Dynamic Pricing */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-bamboo-200 shadow-sm">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTiffinSubTab('bookings')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                      tiffinSubTab === 'bookings'
                        ? 'bg-forest-950 text-brass-300 shadow'
                        : 'bg-riceCream-50 text-forest-900 hover:bg-riceCream-100 border border-bamboo-200'
                    }`}
                  >
                    <span className="text-sm">🍱</span>
                    <span>Customer Bookings</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                      tiffinSubTab === 'bookings' ? 'bg-forest-900 text-brass-300' : 'bg-bamboo-200 text-forest-950'
                    }`}>
                      {tiffinBookings.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTiffinSubTab('plans')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                      tiffinSubTab === 'plans'
                        ? 'bg-forest-950 text-brass-300 shadow'
                        : 'bg-riceCream-50 text-forest-900 hover:bg-riceCream-100 border border-bamboo-200'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5 text-brass-400" />
                    <span>Tiffin Plans & Dynamic Pricing</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                      tiffinSubTab === 'plans' ? 'bg-forest-900 text-brass-300' : 'bg-bamboo-200 text-forest-950'
                    }`}>
                      {tiffinPlans.length} plans
                    </span>
                  </button>
                </div>

                {tiffinSubTab === 'plans' && (
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={handleResetTiffinPlans}
                      disabled={isSeedingPlans}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-forest-900/70 hover:text-assamRed-700 hover:bg-riceCream-100 border border-bamboo-300 transition-colors"
                      title="Reset to default plans and pricing"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSeedingPlans ? 'animate-spin' : ''}`} />
                      <span>Reset Defaults</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleOpenAddPlan}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-forest-950 hover:bg-forest-900 text-brass-300 shadow transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Tiffin Plan</span>
                    </button>
                  </div>
                )}
              </div>

              {/* A. CUSTOMER BOOKINGS SUB-TAB */}
              {tiffinSubTab === 'bookings' && (
                <div className="space-y-6">
              
              {/* Header & Search */}
              <div className="bg-white rounded-2xl p-5 border border-bamboo-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif font-bold text-xl text-forest-950 flex items-center gap-2">
                    <span className="text-2xl">🍱</span>
                    <span>Daily Office Tiffin Bookings</span>
                  </h3>
                  <p className="text-xs text-forest-900/60 mt-0.5">
                    Manage office customer registrations, lunch delivery times, dietary choices & schedules
                  </p>
                </div>

                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    placeholder="Search by customer, phone, office..."
                    value={tiffinSearch}
                    onChange={(e) => setTiffinSearch(e.target.value)}
                    className="w-full bg-riceCream-50 border border-bamboo-300 rounded-xl px-3.5 py-2 text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-brass-500 pl-9"
                  />
                  <Search className="w-4 h-4 text-forest-900/40 absolute left-3 top-2.5" />
                  {tiffinSearch && (
                    <button
                      onClick={() => setTiffinSearch('')}
                      className="absolute right-3 top-2.5 text-forest-900/40 hover:text-forest-950"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Tiffin Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                <div className="bg-white p-4 rounded-2xl border border-bamboo-200 shadow-sm">
                  <span className="text-[10px] text-forest-900/60 font-bold uppercase tracking-wider block">
                    Total Bookings
                  </span>
                  <span className="font-serif text-2xl font-black text-forest-950 mt-1 block">
                    {tiffinBookings.length}
                  </span>
                  <span className="text-[10px] text-brass-700 font-semibold">All registrations</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-bamboo-200 shadow-sm">
                  <span className="text-[10px] text-forest-900/60 font-bold uppercase tracking-wider block">
                    New / Action Req.
                  </span>
                  <span className="font-serif text-2xl font-black text-assamRed-700 mt-1 block">
                    {newTiffinCount}
                  </span>
                  <span className="text-[10px] text-assamRed-700 font-bold">Needs dispatch call</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-bamboo-200 shadow-sm">
                  <span className="text-[10px] text-forest-900/60 font-bold uppercase tracking-wider block">
                    Active Subscriptions
                  </span>
                  <span className="font-serif text-2xl font-black text-emerald-700 mt-1 block">
                    {activeTiffinCount}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold">Active tiffins</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-bamboo-200 shadow-sm">
                  <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block flex items-center gap-1">
                    <span>🌱 Veg (নিয়ামিষ)</span>
                  </span>
                  <span className="font-serif text-2xl font-black text-forest-950 mt-1 block">
                    {vegTiffinCount}
                  </span>
                  <span className="text-[10px] text-forest-900/60 font-semibold">Vegetarian customers</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-bamboo-200 shadow-sm col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-assamRed-800 font-bold uppercase tracking-wider block flex items-center gap-1">
                    <span>🍗 Non-Veg (আমিষ)</span>
                  </span>
                  <span className="font-serif text-2xl font-black text-forest-950 mt-1 block">
                    {nonVegTiffinCount}
                  </span>
                  <span className="text-[10px] text-forest-900/60 font-semibold">Fish / Chicken lovers</span>
                </div>
              </div>

              {/* Status Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {(['ALL', 'NEW', 'CONFIRMED', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setTiffinFilter(st)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                      tiffinFilter === st
                        ? 'bg-forest-950 text-brass-300 shadow-sm'
                        : 'bg-white text-forest-900 border border-bamboo-200 hover:bg-riceCream-100'
                    }`}
                  >
                    {st === 'ALL' ? `All (${tiffinBookings.length})` : st}
                  </button>
                ))}
              </div>

              {/* Bookings List */}
              {filteredTiffins.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-bamboo-200 shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-riceCream-200 text-forest-900 flex items-center justify-center mx-auto mb-3 text-2xl">
                    🍱
                  </div>
                  <h4 className="font-serif font-bold text-lg text-forest-950 mb-1">
                    No Office Tiffin Bookings Found
                  </h4>
                  <p className="text-xs text-forest-900/60 max-w-sm mx-auto">
                    {tiffinSearch || tiffinFilter !== 'ALL'
                      ? 'No bookings match your current search or status filter.'
                      : 'Office lunch registrations placed on the customer website will appear here instantly via Firebase Firestore.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTiffins.map((booking) => {
                    const statusColors = {
                      NEW: 'bg-amber-100 text-amber-800 border-amber-300',
                      CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-300',
                      ACTIVE: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                      PAUSED: 'bg-purple-100 text-purple-800 border-purple-300',
                      COMPLETED: 'bg-slate-100 text-slate-800 border-slate-300',
                      CANCELLED: 'bg-red-100 text-red-800 border-red-300'
                    };

                    return (
                      <div
                        key={booking.id}
                        className="bg-white rounded-2xl p-5 border border-bamboo-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                      >
                        {/* Booking Top Info */}
                        <div>
                          <div className="flex items-center justify-between gap-2 pb-3 border-b border-bamboo-200 mb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-serif font-black text-sm text-forest-950">
                                #{booking.bookingNumber}
                              </span>
                              <span className="text-[10px] text-forest-700/60">
                                {booking.placedTimeStr || 'Recent'}
                              </span>
                            </div>

                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                              statusColors[booking.status] || 'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.status}
                            </span>
                          </div>

                          {/* Customer & Dietary Tag */}
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div>
                              <h4 className="font-bold text-base text-forest-950">
                                {booking.customerName}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-forest-900/80 mt-0.5">
                                <Phone className="w-3.5 h-3.5 text-brass-700" />
                                <span className="font-medium">{booking.contactNumber}</span>
                              </div>
                            </div>

                            {/* Dietary badge */}
                            <div className={`px-2.5 py-1 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${
                              booking.isVegetarian
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'bg-assamRed-50 text-assamRed-800 border-assamRed-300'
                            }`}>
                              <span>{booking.isVegetarian ? '🌱 Pure Veg' : '🍗 Non-Veg'}</span>
                              <span className="text-[10px] opacity-80">
                                ({booking.isVegetarian ? 'নিয়ামিষ' : 'আমিষ'})
                              </span>
                            </div>
                          </div>

                          {/* Lunch Delivery Time & Plan */}
                          <div className="bg-riceCream-50 rounded-xl p-3 border border-bamboo-200 space-y-1.5 text-xs mb-3">
                            <div className="flex justify-between items-center">
                              <span className="text-forest-900/70 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-brass-700" />
                                Lunch Delivery Time:
                              </span>
                              <span className="font-bold text-forest-950 bg-white px-2 py-0.5 rounded border border-bamboo-300">
                                {booking.lunchTime} Daily
                              </span>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="text-forest-900/70 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-forest-700" />
                                Plan:
                              </span>
                              <span className="font-bold text-forest-950">
                                {booking.planType === 'TRIAL_1_DAY' && '1-Day Trial (1 Meal)'}
                                {booking.planType === 'WEEKLY_6_DAYS' && 'Weekly Pass (6 Meals)'}
                                {booking.planType === 'MONTHLY_26_DAYS' && 'Monthly Pass (26 Meals)'}
                                {booking.totalPrice ? ` • ₹${booking.totalPrice}` : ''}
                              </span>
                            </div>

                            {booking.startDate && (
                              <div className="flex justify-between items-center text-[11px]">
                                <span className="text-forest-900/60">Starts From:</span>
                                <span className="font-medium text-forest-950">{booking.startDate}</span>
                              </div>
                            )}
                          </div>

                          {/* Office Location */}
                          <div className="text-xs space-y-1 text-forest-900/80 mb-2">
                            <div className="flex items-start gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-assamRed-600 shrink-0 mt-0.5" />
                              <div>
                                {booking.officeName && (
                                  <span className="font-bold text-forest-950 block">{booking.officeName}</span>
                                )}
                                <span>{booking.deliveryAddress}</span>
                                <span className="text-brass-700 font-bold block mt-0.5">
                                  Locality: {booking.deliveryArea}
                                </span>
                              </div>
                            </div>

                            {booking.specialDietNotes && (
                              <div className="mt-2 p-2 rounded-lg bg-yellow-50 border border-yellow-200 text-[11px] text-yellow-900 font-medium">
                                <strong>Customer Note:</strong> {booking.specialDietNotes}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons: WhatsApp, Call, Status Change & Delete */}
                        <div className="pt-3 border-t border-bamboo-200 space-y-2">
                          <div className="flex items-center gap-2">
                            {/* WhatsApp Customer */}
                            <a
                              href={`https://wa.me/91${booking.contactNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
                                `Hello ${booking.customerName}! This is Darikana Kitchen regarding your Daily Office Tiffin booking #${booking.bookingNumber}. We are preparing your ${booking.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'} lunch for delivery at ${booking.lunchTime}.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-xl text-xs transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>

                            {/* Direct Call */}
                            <a
                              href={`tel:${booking.contactNumber}`}
                              className="inline-flex items-center justify-center gap-1.5 bg-riceCream-200 hover:bg-riceCream-300 text-forest-950 font-bold py-2 px-3 rounded-xl text-xs transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5 text-forest-900" />
                              <span>Call</span>
                            </a>

                            {/* Delete Booking */}
                            <button
                              onClick={async () => {
                                if (window.confirm(`Delete tiffin booking #${booking.bookingNumber} for ${booking.customerName}?`)) {
                                  await deleteTiffinBooking(booking.id);
                                  setNotification({ type: 'success', text: `Tiffin booking #${booking.bookingNumber} deleted.` });
                                }
                              }}
                              className="p-2 rounded-xl text-forest-900/40 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete Booking"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Status Dropdown */}
                          <div className="flex items-center justify-between gap-2 pt-1">
                            <span className="text-[11px] font-bold text-forest-900/70">Update Status:</span>
                            <select
                              value={booking.status}
                              onChange={async (e) => {
                                const newSt = e.target.value as TiffinBookingStatus;
                                await updateTiffinStatus(booking.id, newSt);
                                setNotification({ type: 'success', text: `Tiffin #${booking.bookingNumber} marked as ${newSt}.` });
                              }}
                              className="bg-riceCream-100 border border-bamboo-300 text-forest-950 font-bold text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-brass-500"
                            >
                              <option value="NEW">NEW</option>
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="ACTIVE">ACTIVE</option>
                              <option value="PAUSED">PAUSED</option>
                              <option value="COMPLETED">COMPLETED</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

              {/* B. DYNAMIC TIFFIN PLANS & PRICING SUB-TAB */}
              {tiffinSubTab === 'plans' && (
                <div className="space-y-6">
                  {/* Banner Info */}
                  <div className="bg-gradient-to-r from-brass-100 via-riceCream-100 to-brass-100 p-4 rounded-2xl border border-brass-400/40 flex items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-forest-950 text-brass-300 flex items-center justify-center shrink-0 text-lg shadow-sm">
                        ⚙️
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-base text-forest-950">
                          Dynamic Office Tiffin Plans & Pricing
                        </h4>
                        <p className="text-xs text-forest-900/70 mt-0.5">
                          Admin changes made here update the live homepage office tiffin cards, pure veg / non-veg prices, per-meal rates, and booking modal in real-time.
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold bg-white text-forest-950 border border-brass-400 px-3 py-1.5 rounded-full shrink-0 shadow-sm hidden sm:inline-block">
                      ⚡ Live Firestore Sync
                    </span>
                  </div>

                  {/* Plans Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {tiffinPlans.map((plan) => {
                      const vegPerMeal = Math.round(plan.vegPrice / (plan.daysCount || 1));
                      const nonVegPerMeal = Math.round(plan.nonVegPrice / (plan.daysCount || 1));

                      return (
                        <div
                          key={plan.id}
                          className={`bg-white rounded-3xl p-5 sm:p-6 border-2 transition-all flex flex-col justify-between relative shadow-sm hover:shadow-md ${
                            plan.isActive
                              ? 'border-bamboo-200'
                              : 'border-dashed border-gray-300 bg-gray-50/70 opacity-75'
                          }`}
                        >
                          {/* Top Row: Badge & Active Switch */}
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <div className="flex items-center gap-2">
                                {plan.badgeTag ? (
                                  <span className="bg-brass-500 text-forest-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                                    {plan.badgeTag}
                                  </span>
                                ) : (
                                  <span className="bg-riceCream-200 text-forest-900 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                    Standard Plan
                                  </span>
                                )}
                                <span className="text-[11px] font-bold text-forest-700">
                                  {plan.daysCount} {plan.daysCount === 1 ? 'Day' : 'Days'} ({plan.daysCount} Meals)
                                </span>
                              </div>

                              {/* Active Toggle Button */}
                              <button
                                type="button"
                                onClick={async () => {
                                  await updateTiffinPlan(plan.id, { isActive: !plan.isActive });
                                  setNotification({
                                    type: 'success',
                                    text: `Plan "${plan.name}" is now ${!plan.isActive ? 'VISIBLE on website' : 'HIDDEN from website'}.`
                                  });
                                }}
                                className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                                  plan.isActive
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                                    : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                                }`}
                                title="Click to toggle visibility on website"
                              >
                                {plan.isActive ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Active</span>
                                  </>
                                ) : (
                                  <>
                                    <X className="w-3.5 h-3.5 text-gray-500" />
                                    <span>Hidden</span>
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Plan Name & Teaser */}
                            <h4 className="font-serif font-black text-lg text-forest-950 mb-1">
                              {plan.name}
                            </h4>
                            <p className="text-xs text-forest-900/70 mb-4 line-clamp-2">
                              {plan.description}
                            </p>

                            {/* Pricing Box (Veg & Non-Veg) */}
                            <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-riceCream-50 border border-bamboo-200 mb-4">
                              {/* Veg Price */}
                              <div className="bg-white p-2.5 rounded-xl border border-emerald-200 shadow-2xs">
                                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-0.5">
                                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                                  <span>Pure Veg (নিয়ামিষ)</span>
                                </div>
                                <div className="text-lg font-serif font-black text-forest-950">
                                  ₹{plan.vegPrice.toLocaleString('en-IN')}
                                </div>
                                {plan.daysCount > 1 && (
                                  <div className="text-[10px] text-emerald-700 font-semibold">
                                    ₹{vegPerMeal} / meal
                                  </div>
                                )}
                              </div>

                              {/* Non-Veg Price */}
                              <div className="bg-white p-2.5 rounded-xl border border-assamRed-200 shadow-2xs">
                                <div className="flex items-center gap-1 text-[10px] font-bold text-assamRed-800 uppercase tracking-wider mb-0.5">
                                  <span className="w-2 h-2 rounded-full bg-assamRed-600 inline-block"></span>
                                  <span>Non-Veg (আমিষ)</span>
                                </div>
                                <div className="text-lg font-serif font-black text-forest-950">
                                  ₹{plan.nonVegPrice.toLocaleString('en-IN')}
                                </div>
                                {plan.daysCount > 1 && (
                                  <div className="text-[10px] text-assamRed-700 font-semibold">
                                    ₹{nonVegPerMeal} / meal
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Inclusions summary */}
                            <div className="space-y-2 text-xs mb-4">
                              <div className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
                                <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block mb-0.5">
                                  🌱 Veg Meal Inclusions:
                                </span>
                                <p className="text-[11px] text-forest-900/80 leading-relaxed line-clamp-2">
                                  {Array.isArray(plan.vegIncludes) ? plan.vegIncludes.join(', ') : (plan.vegIncludes || 'Joha Rice, Dal, Seasonal Sabji, Pitika & Salad')}
                                </p>
                              </div>

                              <div className="p-2.5 rounded-xl bg-assamRed-50/50 border border-assamRed-100">
                                <span className="text-[10px] font-bold text-assamRed-900 uppercase tracking-wider block mb-0.5">
                                  🍗 Non-Veg Inclusions:
                                </span>
                                <p className="text-[11px] text-forest-900/80 leading-relaxed line-clamp-2">
                                  {Array.isArray(plan.nonVegIncludes) ? plan.nonVegIncludes.join(', ') : (plan.nonVegIncludes || 'Joha Rice, Dal, Fish/Chicken Curry, Pitika & Salad')}
                                </p>
                              </div>

                              {plan.perks && plan.perks.length > 0 && (
                                <div className="text-[11px] text-brass-800 font-medium flex flex-wrap gap-1 pt-1">
                                  {plan.perks.map((perk, pi) => (
                                    <span key={pi} className="bg-riceCream-100 px-2 py-0.5 rounded-md border border-bamboo-200">
                                      ✓ {perk}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Row */}
                          <div className="pt-3 border-t border-bamboo-100 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEditPlan(plan)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-forest-950 hover:bg-forest-900 text-brass-300 font-bold text-xs shadow transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit Pricing & Details</span>
                            </button>

                            <button
                              type="button"
                              onClick={async () => {
                                if (window.confirm(`Are you sure you want to delete tiffin plan "${plan.name}"?`)) {
                                  await deleteTiffinPlan(plan.id);
                                  setNotification({ type: 'success', text: `Plan "${plan.name}" removed.` });
                                }
                              }}
                              className="p-2 rounded-xl text-forest-900/40 hover:text-red-600 hover:bg-red-50 border border-bamboo-200 transition-colors"
                              title="Delete Plan"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TIFFIN PLAN EDIT / ADD MODAL */}
          {isPlanModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white text-forest-950 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-bamboo-300 my-8">
                {/* Modal Header */}
                <div className="flex items-center justify-between pb-4 border-b border-bamboo-200 mb-5">
                  <div>
                    <h3 className="font-serif font-black text-xl text-forest-950 flex items-center gap-2">
                      <span className="text-xl">🍱</span>
                      <span>{editingPlan ? 'Edit Tiffin Plan & Pricing' : 'Add New Tiffin Plan'}</span>
                    </h3>
                    <p className="text-xs text-forest-900/60 mt-0.5">
                      Configure dynamic prices, days, and traditional Assamese menu details
                    </p>
                  </div>
                  <button
                    onClick={() => setIsPlanModalOpen(false)}
                    className="w-8 h-8 rounded-full bg-riceCream-100 hover:bg-riceCream-200 flex items-center justify-center text-forest-950 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSavePlan} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
                  
                  {/* Name & Badge */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1">
                        Plan Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={planFormData.name}
                        onChange={(e) => setPlanFormData({ ...planFormData, name: e.target.value })}
                        placeholder="e.g. Weekly Office Pass (6 Days)"
                        className="w-full bg-riceCream-50 border border-bamboo-300 rounded-xl px-3.5 py-2.5 text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-brass-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1">
                        Badge Tag (Optional)
                      </label>
                      <input
                        type="text"
                        value={planFormData.badgeTag}
                        onChange={(e) => setPlanFormData({ ...planFormData, badgeTag: e.target.value })}
                        placeholder="e.g. Most Popular / Best Value / Trial"
                        className="w-full bg-riceCream-50 border border-bamboo-300 rounded-xl px-3.5 py-2.5 text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-brass-500"
                      />
                    </div>
                  </div>

                  {/* Days count, Veg Price, Non-Veg Price */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 bg-riceCream-50 p-4 rounded-2xl border border-bamboo-200">
                    <div>
                      <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1">
                        Days (Meals Count) *
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={planFormData.daysCount}
                        onChange={(e) => setPlanFormData({ ...planFormData, daysCount: Number(e.target.value) })}
                        className="w-full bg-white border border-bamboo-300 rounded-xl px-3.5 py-2 text-xs text-forest-950 font-bold focus:outline-none focus:ring-2 focus:ring-brass-500"
                      />
                      <span className="text-[10px] text-forest-700/60 mt-0.5 block">e.g. 1, 6, 26</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                        🌱 Veg Total Price (₹) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={planFormData.vegPrice}
                        onChange={(e) => setPlanFormData({ ...planFormData, vegPrice: Number(e.target.value) })}
                        className="w-full bg-white border border-emerald-300 rounded-xl px-3.5 py-2 text-xs text-forest-950 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <span className="text-[10px] text-emerald-700 font-bold mt-0.5 block">
                        ₹{Math.round(planFormData.vegPrice / (planFormData.daysCount || 1))} / meal
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-assamRed-800 uppercase tracking-wider mb-1">
                        🍗 Non-Veg Price (₹) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={planFormData.nonVegPrice}
                        onChange={(e) => setPlanFormData({ ...planFormData, nonVegPrice: Number(e.target.value) })}
                        className="w-full bg-white border border-assamRed-300 rounded-xl px-3.5 py-2 text-xs text-forest-950 font-bold focus:outline-none focus:ring-2 focus:ring-assamRed-500"
                      />
                      <span className="text-[10px] text-assamRed-700 font-bold mt-0.5 block">
                        ₹{Math.round(planFormData.nonVegPrice / (planFormData.daysCount || 1))} / meal
                      </span>
                    </div>
                  </div>

                  {/* Short Description */}
                  <div>
                    <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1">
                      Short Description *
                    </label>
                    <input
                      type="text"
                      required
                      value={planFormData.description}
                      onChange={(e) => setPlanFormData({ ...planFormData, description: e.target.value })}
                      placeholder="e.g. Monday to Saturday fresh office lunch with daily variety and priority desk delivery."
                      className="w-full bg-riceCream-50 border border-bamboo-300 rounded-xl px-3.5 py-2.5 text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-brass-500"
                    />
                  </div>

                  {/* Veg Menu Inclusions */}
                  <div>
                    <label className="block text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1">
                      🌱 Pure Veg Inclusions Details
                    </label>
                    <textarea
                      rows={2}
                      value={planFormData.vegIncludes}
                      onChange={(e) => setPlanFormData({ ...planFormData, vegIncludes: e.target.value })}
                      placeholder="Aromatic Joha Rice, Yellow/Mati Dal, Seasonal Sabji (Labra), Aloo or Khar Pitika, Paneer or Bilahi Tok, Fresh Salad & Assam Lemon."
                      className="w-full bg-riceCream-50 border border-bamboo-300 rounded-xl px-3.5 py-2 text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Non-Veg Menu Inclusions */}
                  <div>
                    <label className="block text-xs font-bold text-assamRed-900 uppercase tracking-wider mb-1">
                      🍗 Non-Veg Inclusions Details
                    </label>
                    <textarea
                      rows={2}
                      value={planFormData.nonVegIncludes}
                      onChange={(e) => setPlanFormData({ ...planFormData, nonVegIncludes: e.target.value })}
                      placeholder="Joha Rice, Dal, Mud-Chulha Local Fish Curry (Rohu/Borali) or Local Chicken Curry (rotating menu) + Seasonal Sabji, Pitika & Salad."
                      className="w-full bg-riceCream-50 border border-bamboo-300 rounded-xl px-3.5 py-2 text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-assamRed-500"
                    />
                  </div>

                  {/* Perks */}
                  <div>
                    <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1">
                      Perks & Features (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={planFormData.perks}
                      onChange={(e) => setPlanFormData({ ...planFormData, perks: e.target.value })}
                      placeholder="Free Friday Sweet, Mud-Chulha Taste, Priority Desk Delivery"
                      className="w-full bg-riceCream-50 border border-bamboo-300 rounded-xl px-3.5 py-2.5 text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-brass-500"
                    />
                  </div>

                  {/* Display order & Active Toggle */}
                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={planFormData.isActive}
                        onChange={(e) => setPlanFormData({ ...planFormData, isActive: e.target.checked })}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300"
                      />
                      <span className="text-xs font-bold text-forest-950">Active on Live Website</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-forest-900">Order:</label>
                      <input
                        type="number"
                        value={planFormData.displayOrder}
                        onChange={(e) => setPlanFormData({ ...planFormData, displayOrder: Number(e.target.value) })}
                        className="w-16 bg-riceCream-50 border border-bamboo-300 rounded-lg px-2 py-1 text-xs text-center font-bold text-forest-950"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-bamboo-200">
                    <button
                      type="button"
                      onClick={() => setIsPlanModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl border border-bamboo-300 text-xs font-bold text-forest-900 hover:bg-riceCream-100 transition-colors"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmittingPlan}
                      className="px-6 py-2.5 rounded-xl bg-forest-950 hover:bg-forest-900 text-brass-300 font-bold text-xs shadow transition-all disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {isSubmittingPlan ? (
                        <span>Saving to Firestore...</span>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Save Tiffin Plan</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* KOT (KITCHEN ORDER TICKET) PRINT SLIP MODAL */}
      {selectedKOTOrder && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-forest-950 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-bamboo-300 font-mono text-xs">
            <div className="text-center pb-3 border-b-2 border-dashed border-gray-400">
              <h4 className="font-serif font-bold text-base">DARIKANA KITCHEN</h4>
              <p className="text-[10px] text-gray-600">KITCHEN ORDER TICKET (KOT) • +91 8133958961</p>
              <p className="text-[11px] font-bold mt-1">ORDER #{selectedKOTOrder.orderNumber}</p>
              <p className="text-[10px] text-gray-500">{selectedKOTOrder.placedTimeStr || 'Recent'}</p>
            </div>

            <div className="py-3 border-b-2 border-dashed border-gray-400 space-y-1 text-[11px]">
              <p><strong>Customer:</strong> {selectedKOTOrder.customer.name}</p>
              <p><strong>Phone:</strong> {selectedKOTOrder.customer.phone}</p>
              <p><strong>Area:</strong> {selectedKOTOrder.customer.deliveryArea}</p>
              <p><strong>Address:</strong> {selectedKOTOrder.customer.address}</p>
              {selectedKOTOrder.customer.instructions && (
                <p className="text-red-700 font-bold mt-1">
                  Note: {selectedKOTOrder.customer.instructions}
                </p>
              )}
            </div>

            <div className="py-3 border-b-2 border-dashed border-gray-400 space-y-2">
              <div className="flex justify-between font-bold">
                <span>ITEM</span>
                <span>QTY</span>
              </div>
              {selectedKOTOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{item.item.name}</span>
                  <span className="font-bold">{item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="py-2 text-right font-bold text-sm">
              <span>Total: ₹{selectedKOTOrder.grandTotal}</span>
              <p className="text-[10px] font-normal text-gray-500">
                Payment: {selectedKOTOrder.paymentMethod}
              </p>
            </div>

            <div className="flex gap-2 pt-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 bg-forest-950 text-brass-300 font-bold rounded-xl"
              >
                Print Slip
              </button>
              <button
                onClick={() => setSelectedKOTOrder(null)}
                className="py-2 px-4 bg-gray-200 font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT DISH MODAL */}
      {editingDish && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-bamboo-300">
            <div className="flex items-center justify-between pb-3 border-b border-bamboo-200 mb-4">
              <h4 className="font-serif font-bold text-lg text-forest-950">
                Edit Dish: {editingDish.name}
              </h4>
              <button onClick={() => setEditingDish(null)} className="p-1 text-forest-900/50 hover:text-forest-950">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                await updateProduct(editingDish.id, editingDish);
                setNotification({ type: 'success', text: `Updated "${editingDish.name}".` });
                setEditingDish(null);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold mb-1">Dish Name</label>
                <input
                  type="text"
                  value={editingDish.name}
                  onChange={(e) => setEditingDish({ ...editingDish, name: e.target.value })}
                  className="w-full px-3 py-2 bg-riceCream-50 border border-bamboo-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Category</label>
                {categories.filter(c => c.name !== 'ALL').length > 0 ? (
                  <select
                    value={editingDish.category}
                    onChange={(e) => setEditingDish({ ...editingDish, category: e.target.value as MenuCategory })}
                    className="w-full px-3 py-2 bg-riceCream-50 border border-bamboo-300 rounded-xl"
                  >
                    {categories.filter(c => c.name !== 'ALL').map(cat => (
                      <option key={cat.id} value={cat.name}>
                        {cat.icon ? `${cat.icon} ` : ''}{cat.label || cat.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    value={editingDish.category}
                    onChange={(e) => setEditingDish({ ...editingDish, category: e.target.value as MenuCategory })}
                    className="w-full px-3 py-2 bg-riceCream-50 border border-bamboo-300 rounded-xl"
                  />
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 py-1">
                <label className="flex items-center gap-2.5 cursor-pointer bg-riceCream-100 px-3 py-2 rounded-xl border border-bamboo-300 w-full sm:w-1/2">
                  <input
                    type="checkbox"
                    checked={Boolean(editingDish.isTasteOfAssam)}
                    onChange={(e) => setEditingDish({ ...editingDish, isTasteOfAssam: e.target.checked })}
                    className="w-4 h-4 text-forest-900 rounded"
                  />
                  <div className="text-[11px]">
                    <span className="font-bold text-forest-950 block flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-brass-700" />
                      <span>The Taste of Assam</span>
                    </span>
                    <span className="text-forest-900/60 block text-[10px]">Show in cultural showcase</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer bg-riceCream-100 px-3 py-2 rounded-xl border border-bamboo-300 w-full sm:w-1/2">
                  <input
                    type="checkbox"
                    checked={Boolean(editingDish.firewoodSpecial)}
                    onChange={(e) => setEditingDish({ ...editingDish, firewoodSpecial: e.target.checked })}
                    className="w-4 h-4 text-forest-900 rounded"
                  />
                  <div className="text-[11px]">
                    <span className="font-bold text-forest-950 block flex items-center gap-1">
                      <Flame className="w-3 h-3 text-assamRed-600" />
                      <span>Firewood Chulha</span>
                    </span>
                    <span className="text-forest-900/60 block text-[10px]">Slow wood-fire cooked</span>
                  </div>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={editingDish.price}
                    onChange={(e) => setEditingDish({ ...editingDish, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-riceCream-50 border border-bamboo-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={editingDish.originalPrice || ''}
                    onChange={(e) => setEditingDish({ ...editingDish, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3 py-2 bg-riceCream-50 border border-bamboo-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={editingDish.description}
                  onChange={(e) => setEditingDish({ ...editingDish, description: e.target.value })}
                  className="w-full px-3 py-2 bg-riceCream-50 border border-bamboo-300 rounded-xl"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingDish(null)}
                  className="flex-1 py-2.5 bg-riceCream-200 font-bold rounded-xl text-forest-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-forest-950 text-brass-300 font-bold rounded-xl shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
