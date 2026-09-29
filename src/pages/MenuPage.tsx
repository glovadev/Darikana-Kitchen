import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  Flame, 
  Utensils, 
  ArrowLeft, 
  ShoppingBag, 
  Phone, 
  MessageCircle, 
  SlidersHorizontal, 
  X, 
  Eye, 
  Plus, 
  Check, 
  Clock, 
  Heart,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Star
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { MenuItem, MenuCategory } from '../types';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { CheckoutModal } from '../components/CheckoutModal';
import { ThaliModal } from '../components/ThaliModal';
import { MobileBottomBar } from '../components/MobileBottomBar';

export const MenuPage: React.FC = () => {
  const { 
    products, 
    categories, 
    cart, 
    addToCart, 
    updateQuantity, 
    totalItems, 
    grandTotal, 
    setIsCartOpen, 
    setIsCheckoutOpen,
    setSelectedThaliModal,
    navigateTo 
  } = useCart();

  // Search & Filter States
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [firewoodOnly, setFirewoodOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'popular'>('default');
  const [addedItemAnimationId, setAddedItemAnimationId] = useState<string | null>(null);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let result = products.filter((item) => {
      // Category match
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }
      // Diet match
      if (dietFilter === 'veg' && !item.isVeg) return false;
      if (dietFilter === 'non-veg' && item.isVeg) return false;
      // Firewood match
      if (firewoodOnly && !item.firewoodSpecial) return false;
      // Search match
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchAssam = item.assameseName.includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        const matchIncludes = item.thaliIncludes?.some(inc => inc.toLowerCase().includes(q));
        if (!matchName && !matchAssam && !matchDesc && !matchCat && !matchIncludes) {
          return false;
        }
      }
      return true;
    });

    // Sorting
    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'popular') {
      result = [...result].sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    }

    return result;
  }, [products, selectedCategory, dietFilter, firewoodOnly, search, sortBy]);

  // Grouped products by category for "ALL" view
  const categoriesWithProducts = useMemo(() => {
    if (selectedCategory !== 'ALL') return [];
    
    // Get unique categories from current filtered results
    const catMap = new Map<string, MenuItem[]>();
    filteredProducts.forEach(item => {
      const list = catMap.get(item.category) || [];
      list.push(item);
      catMap.set(item.category, list);
    });

    return Array.from(catMap.entries()).map(([catName, items]) => {
      const catMeta = categories.find(c => c.name === catName);
      return {
        name: catName,
        label: catMeta?.label || catName,
        icon: catMeta?.icon || '🍲',
        description: catMeta?.description || '',
        items
      };
    });
  }, [filteredProducts, selectedCategory, categories]);

  // Add to cart helper
  const handleAddToCart = (item: MenuItem) => {
    addToCart(item, 1);
    setAddedItemAnimationId(item.id);
    setTimeout(() => setAddedItemAnimationId(null), 1200);
  };

  return (
    <div className="min-h-screen bg-riceCream-50 text-forest-950 font-sans selection:bg-assamRed-700 selection:text-white flex flex-col pb-20 lg:pb-0">
      
      {/* 1. TOP STICKY NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-forest-950/95 backdrop-blur-md border-b border-brass-600/30 text-white shadow-xl">
        <div className="gamocha-strip w-full absolute top-0 left-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          
          {/* Left: Back to Home + Brand */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => navigateTo('home')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-riceCream-300 hover:text-white bg-forest-900 hover:bg-forest-850 px-3 py-1.5 rounded-full border border-brass-500/30 transition-all group"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-brass-400 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Home</span>
            </button>

            <div 
              onClick={() => navigateTo('home')} 
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <img
                src="/images/darikana-logo.jpg"
                alt="Darikana Kitchen"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full ring-2 ring-brass-500/60 object-cover"
              />
              <div className="hidden sm:block">
                <span className="font-serif font-bold text-sm text-white tracking-tight block leading-none">
                  Darikana Kitchen
                </span>
                <span className="text-[10px] text-brass-400 font-accent">
                  Traditional Assamese Thali
                </span>
              </div>
            </div>
          </div>

          {/* Right: Hotline + Cart */}
          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href="tel:+918133958961"
              className="hidden md:inline-flex items-center gap-1.5 text-xs text-riceCream-200 hover:text-brass-300 bg-forest-900/80 px-3 py-1.5 rounded-full border border-brass-500/20 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-brass-400" />
              <span>+91 8133958961</span>
            </a>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative inline-flex items-center gap-2 bg-gradient-to-r from-brass-600 via-brass-500 to-brass-600 hover:from-brass-500 hover:to-brass-400 text-forest-950 font-extrabold px-4 py-2 rounded-full text-xs sm:text-sm shadow-brass transition-transform hover:scale-105"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>CART</span>
              {totalItems > 0 && (
                <span className="bg-assamRed-700 text-white text-[11px] font-black rounded-full px-1.5 py-0.2 leading-tight">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* 2. DEDICATED MENU PAGE HERO BANNER */}
      <section className="relative bg-forest-950 text-white pt-10 pb-16 sm:pt-14 sm:pb-20 overflow-hidden border-b border-brass-600/30">
        {/* Hearth background textures */}
        <div className="absolute inset-0 dark-hearth-pattern opacity-70"></div>
        <div className="absolute -top-24 right-0 w-96 h-96 bg-brass-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-assamRed-700/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="max-w-3xl">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brass-900/80 text-brass-300 border border-brass-500/40 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-brass-400" />
              <span>Live Cloud Kitchen Menu • Direct from Mud Chulha</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-4">
              The Grand Assamese Feast
            </h1>
            
            <p className="font-accent text-lg sm:text-xl text-brass-300 mb-3">
              অসমৰ পৰম্পৰাগত সোৱাদ — মাটিৰ চহকী সুবাস আৰু কাঠৰ জুহালৰ ৰন্ধন
            </p>

            <p className="text-sm sm:text-base text-riceCream-200/90 leading-relaxed mb-6 max-w-2xl font-light">
              Slow-cooked in earthen handis over open sal firewood by Dipali Barman. Featuring indigenous aromatic Joha rice, fresh Brahmaputra fish, heritage duck curry, and authentic alkaline Khar.
            </p>

            {/* Quick Feature Badges */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs">
              <span className="bg-forest-900/90 text-brass-300 border border-brass-600/40 px-3 py-1.5 rounded-full flex items-center gap-1.5 font-semibold">
                <Flame className="w-3.5 h-3.5 text-assamRed-500" />
                <span>100% Firewood Chulha</span>
              </span>
              <span className="bg-forest-900/90 text-riceCream-200 border border-brass-600/40 px-3 py-1.5 rounded-full flex items-center gap-1.5 font-semibold">
                <span>🌿</span>
                <span>Pure Mustard Oil & Bell-Metal Kanh</span>
              </span>
              <span className="bg-forest-900/90 text-riceCream-200 border border-brass-600/40 px-3 py-1.5 rounded-full flex items-center gap-1.5 font-semibold">
                <Clock className="w-3.5 h-3.5 text-brass-400" />
                <span>Hot Delivery in 30-45 Mins</span>
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* 3. STICKY FILTER & SEARCH TOOLBAR */}
      <section className="sticky top-[57px] z-30 bg-white/95 backdrop-blur-md border-b border-bamboo-200 shadow-md py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Live Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-forest-900/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes, thalis, duck curry, fish tenga..."
              className="w-full pl-10 pr-9 py-2.5 bg-riceCream-50 border border-bamboo-300 rounded-full text-xs sm:text-sm text-forest-950 placeholder-forest-900/50 focus:outline-none focus:border-forest-900 focus:bg-white transition-all shadow-inner"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-forest-900/40 hover:text-forest-900 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filters Row */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Diet Toggle */}
            <div className="flex items-center bg-riceCream-200 p-1 rounded-full text-xs font-bold">
              <button
                onClick={() => setDietFilter('all')}
                className={`px-3 py-1 rounded-full transition-all ${
                  dietFilter === 'all'
                    ? 'bg-forest-950 text-white shadow'
                    : 'text-forest-900/70 hover:text-forest-950'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setDietFilter('veg')}
                className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 ${
                  dietFilter === 'veg'
                    ? 'bg-emerald-700 text-white shadow'
                    : 'text-forest-900/70 hover:text-emerald-800'
                }`}
              >
                <span>🌿</span>
                <span>Veg</span>
              </button>
              <button
                onClick={() => setDietFilter('non-veg')}
                className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 ${
                  dietFilter === 'non-veg'
                    ? 'bg-assamRed-700 text-white shadow'
                    : 'text-forest-900/70 hover:text-assamRed-800'
                }`}
              >
                <span>🍗</span>
                <span>Non-Veg</span>
              </button>
            </div>

            {/* Firewood Toggle */}
            <button
              onClick={() => setFirewoodOnly(!firewoodOnly)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 ${
                firewoodOnly
                  ? 'bg-assamRed-700 text-white border-assamRed-600 shadow'
                  : 'bg-white text-forest-900 border-bamboo-300 hover:border-forest-900'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${firewoodOnly ? 'fill-white' : 'text-assamRed-600'}`} />
              <span>Chulha Specials</span>
            </button>

            {/* Category Dropdown (Mobile View - Styled just like Sort: Recommended) */}
            <div className="sm:hidden relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 bg-white border border-bamboo-300 rounded-full text-xs font-bold text-forest-900 focus:outline-none focus:border-forest-900 shadow-sm appearance-none pr-7 cursor-pointer"
              >
                <option value="ALL">Category: All ({products.length})</option>
                {categories.filter(c => c.name !== 'ALL').map((cat) => {
                  const count = products.filter(p => p.category === cat.name).length;
                  return (
                    <option key={cat.id} value={cat.name}>
                      {cat.icon || '🍲'} {cat.label || cat.name} ({count})
                    </option>
                  );
                })}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-brass-700">
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 bg-white border border-bamboo-300 rounded-full text-xs font-bold text-forest-900 focus:outline-none focus:border-forest-900 shadow-sm"
            >
              <option value="default">Sort: Recommended</option>
              <option value="popular">Bestsellers First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>

          </div>

        </div>

        {/* Desktop View: Full Category Selector Pills */}
        <div className="hidden sm:flex max-w-7xl mx-auto mt-3 pt-2.5 border-t border-bamboo-200/60 flex-wrap items-center gap-2 pb-1">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedCategory === 'ALL'
                ? 'bg-forest-950 text-brass-300 shadow-sm ring-1 ring-brass-500'
                : 'bg-riceCream-100 hover:bg-riceCream-200 text-forest-900/80 border border-bamboo-300'
            }`}
          >
            <span>🍽️</span>
            <span>All Dishes ({products.length})</span>
          </button>

          {categories.filter(c => c.name !== 'ALL').map((cat) => {
            const count = products.filter(p => p.category === cat.name).length;
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-forest-950 text-brass-300 shadow-sm ring-1 ring-brass-500'
                    : 'bg-riceCream-100 hover:bg-riceCream-200 text-forest-900/80 border border-bamboo-300'
                }`}
              >
                <span>{cat.icon || '🍲'}</span>
                <span>{cat.label || cat.name}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-brass-500/30 text-brass-200' : 'bg-bamboo-200 text-forest-900'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. MAIN MENU CONTENT CATALOG */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        {/* Results Count Banner */}
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-bamboo-200">
          <div>
            <h2 className="font-serif font-extrabold text-xl sm:text-2xl text-forest-950 flex items-center gap-2">
              <span>{selectedCategory === 'ALL' ? 'Complete Live Menu' : selectedCategory}</span>
              <span className="text-xs sm:text-sm font-sans font-normal text-forest-900/60">
                ({filteredProducts.length} items found)
              </span>
            </h2>
          </div>

          {(search || selectedCategory !== 'ALL' || dietFilter !== 'all' || firewoodOnly) && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('ALL');
                setDietFilter('all');
                setFirewoodOnly(false);
                setSortBy('default');
              }}
              className="text-xs text-assamRed-700 hover:text-assamRed-800 font-bold underline"
            >
              Reset All Filters
            </button>
          )}
        </div>

        {/* If no dishes match filters */}
        {filteredProducts.length === 0 ? (
          products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-bamboo-200 p-8 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-brass-100 text-brass-700 flex items-center justify-center mx-auto mb-4 text-2xl">
                🍲
              </div>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-forest-950 mb-2">
                Live Kitchen Menu Updating
              </h3>
              <p className="text-xs sm:text-sm text-forest-900/60 max-w-md mx-auto mb-6">
                Our fresh firewood preparations are being updated. You can order directly by chatting with Dipali Barman & the team on WhatsApp.
              </p>
              <a
                href="https://wa.me/918133958961"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-full text-xs shadow-md transition-all"
              >
                <span>Order via WhatsApp (+91 8133958961)</span>
              </a>
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-bamboo-200 p-8 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-riceCream-100 text-brass-700 flex items-center justify-center mx-auto mb-4 text-2xl">
                🍲
              </div>
              <h3 className="font-serif font-bold text-xl text-forest-950 mb-2">
                No matching dishes found
              </h3>
              <p className="text-xs sm:text-sm text-forest-900/60 max-w-md mx-auto mb-6">
                We couldn't find any dishes matching your current filter criteria. Try searching for something else or clear the filters.
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('ALL');
                  setDietFilter('all');
                  setFirewoodOnly(false);
                }}
                className="bg-forest-950 text-brass-300 font-bold px-6 py-2.5 rounded-full text-xs shadow hover:bg-forest-900 transition-colors"
              >
                Show All Dishes
              </button>
            </div>
          )
        ) : (
          /* Render by Category Sections when ALL is selected and no search, or render direct grid */
          selectedCategory === 'ALL' && !search && dietFilter === 'all' && !firewoodOnly ? (
            <div className="space-y-14">
              {categoriesWithProducts.map((section) => (
                <div key={section.name} className="scroll-mt-40" id={`section-${section.name}`}>
                  
                  {/* Category Section Header */}
                  <div className="flex items-center justify-between pb-3 mb-6 border-b-2 border-bamboo-300">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-2 rounded-2xl bg-white shadow-sm border border-bamboo-200">
                        {section.icon}
                      </span>
                      <div>
                        <h3 className="font-serif font-black text-xl sm:text-2xl text-forest-950">
                          {section.label}
                        </h3>
                        {section.description && (
                          <p className="text-xs text-forest-900/60 font-light mt-0.5">
                            {section.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-brass-800 bg-brass-100 px-3 py-1 rounded-full">
                      {section.items.length} dishes
                    </span>
                  </div>

                  {/* Grid of Dishes for this section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {section.items.map((dish) => (
                      <MenuDishCard
                        key={dish.id}
                        dish={dish}
                        cart={cart}
                        onAddToCart={handleAddToCart}
                        onUpdateQuantity={updateQuantity}
                        onOpenModal={setSelectedThaliModal}
                        isAdded={addedItemAnimationId === dish.id}
                      />
                    ))}
                  </div>

                </div>
              ))}
            </div>
          ) : (
            /* Flat Filtered Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map((dish) => (
                <MenuDishCard
                  key={dish.id}
                  dish={dish}
                  cart={cart}
                  onAddToCart={handleAddToCart}
                  onUpdateQuantity={updateQuantity}
                  onOpenModal={setSelectedThaliModal}
                  isAdded={addedItemAnimationId === dish.id}
                />
              ))}
            </div>
          )
        )}

        {/* Guwahati Delivery Banner */}
        <div className="mt-16 bg-gradient-to-r from-forest-950 to-forest-900 text-white rounded-3xl p-6 sm:p-10 border border-brass-600/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-brass-400 block">
              Guwahati Cloud Kitchen Dispatch
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-white">
              Direct from Dipali Barman's Chulha
            </h3>
            <p className="text-xs sm:text-sm text-riceCream-300 max-w-xl font-light">
              Prepared fresh to order in traditional clay cookware and delivered hot in eco-friendly banana leaf packaging across Dispur, Beltola, Zoo Road, Uzan Bazar, and neighboring Guwahati areas.
            </p>
          </div>
          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <a
              href="tel:+918133958961"
              className="inline-flex items-center justify-center gap-2 bg-forest-900 hover:bg-forest-850 text-brass-300 border border-brass-500/40 px-6 py-3 rounded-full text-xs font-bold shadow transition-all"
            >
              <Phone className="w-4 h-4 text-brass-400" />
              <span>Call +91 8133958961</span>
            </a>
            <button
              onClick={() => setIsCheckoutOpen(true)}
              disabled={cart.length === 0}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brass-600 to-brass-400 hover:from-brass-500 hover:to-brass-300 text-forest-950 px-6 py-3 rounded-full text-xs font-black shadow-brass transition-all disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Checkout Now ({cart.length})</span>
            </button>
          </div>
        </div>

      </main>

      {/* 5. FOOTER */}
      <Footer />

      {/* Drawers, Modals & Mobile Bottom Bar (Home, Menu, Cart, Order) */}
      <CartDrawer />
      <CheckoutModal />
      <ThaliModal />
      <MobileBottomBar />
    </div>
  );
};

// =========================================================================
// MENU DISH CARD COMPONENT (Rich Card with Firewood badge & Thali pills)
// =========================================================================
interface MenuDishCardProps {
  dish: MenuItem;
  cart: { item: MenuItem; quantity: number }[];
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (id: string, qty: number) => void;
  onOpenModal: (dish: MenuItem) => void;
  isAdded: boolean;
}

const MenuDishCard: React.FC<MenuDishCardProps> = ({
  dish,
  cart,
  onAddToCart,
  onUpdateQuantity,
  onOpenModal,
  isAdded
}) => {
  const cartItem = cart.find(c => c.item.id === dish.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-bamboo-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1">
      
      {/* Image & Badges Container */}
      <div className="relative h-52 sm:h-56 overflow-hidden bg-forest-900">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {/* Veg/Non-Veg */}
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border backdrop-blur-md ${
            dish.isVeg 
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50' 
              : 'bg-assamRed-950/80 text-assamRed-300 border-assamRed-500/50'
          }`}>
            {dish.isVeg ? '● PURE VEG' : '▲ NON-VEG'}
          </span>

          {dish.firewoodSpecial && (
            <span className="bg-assamRed-700/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
              <Flame className="w-3 h-3 fill-current" />
              <span>CHULHA</span>
            </span>
          )}
        </div>

        {/* Right Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
          {dish.isBestseller && (
            <span className="bg-brass-500 text-forest-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow">
              ★ BESTSELLER
            </span>
          )}
          {dish.isTasteOfAssam && (
            <span className="bg-forest-950/90 text-brass-300 border border-brass-500/40 text-[9px] font-bold px-2 py-0.5 rounded-full">
              TASTE OF ASSAM
            </span>
          )}
        </div>

        {/* Quick View Button on Image */}
        <button
          onClick={() => onOpenModal(dish)}
          className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-forest-950 text-[11px] font-bold px-3 py-1.5 rounded-full shadow flex items-center gap-1.5 transition-transform hover:scale-105"
        >
          <Eye className="w-3.5 h-3.5 text-forest-900" />
          <span>Quick View</span>
        </button>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-[11px] text-forest-900/60 mb-1">
            <span className="uppercase tracking-wider font-semibold text-brass-800">
              {dish.category}
            </span>
            {dish.prepTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{dish.prepTime}</span>
              </span>
            )}
          </div>

          <h4 
            onClick={() => onOpenModal(dish)}
            className="font-serif font-bold text-lg text-forest-950 group-hover:text-brass-800 transition-colors cursor-pointer leading-tight mb-1"
          >
            {dish.name}
          </h4>

          {dish.assameseName && (
            <p className="font-accent text-xs text-forest-900/70 mb-2">
              {dish.assameseName}
            </p>
          )}

          <p className="text-xs text-forest-900/80 leading-relaxed line-clamp-2 font-light mb-3">
            {dish.description}
          </p>

          {/* Included Items preview for thalis */}
          {dish.thaliIncludes && dish.thaliIncludes.length > 0 && (
            <div className="bg-riceCream-100 rounded-xl p-2.5 border border-bamboo-200/80 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-forest-950 block mb-1">
                Includes {dish.thaliIncludes.length} Items:
              </span>
              <p className="text-[11px] text-forest-900/80 line-clamp-2 font-light">
                {dish.thaliIncludes.join(' • ')}
              </p>
            </div>
          )}
        </div>

        {/* Pricing and Add to Cart Section */}
        <div className="pt-3 border-t border-bamboo-200 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-2xl font-black text-forest-950">
                ₹{dish.price}
              </span>
              {dish.originalPrice && (
                <span className="text-xs text-forest-900/50 line-through">
                  ₹{dish.originalPrice}
                </span>
              )}
            </div>
            {dish.originalPrice && (
              <span className="text-[10px] font-bold text-emerald-700 block">
                Save ₹{dish.originalPrice - dish.price}
              </span>
            )}
          </div>

          {/* Counter or Add Button */}
          {quantity > 0 ? (
            <div className="flex items-center bg-forest-950 text-white rounded-full p-1 shadow-md">
              <button
                onClick={() => onUpdateQuantity(dish.id, quantity - 1)}
                className="w-7 h-7 rounded-full bg-forest-900 hover:bg-forest-800 flex items-center justify-center font-bold text-sm text-riceCream-200"
              >
                -
              </button>
              <span className="px-3 font-bold text-xs text-brass-300">
                {quantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(dish.id, quantity + 1)}
                className="w-7 h-7 rounded-full bg-brass-500 hover:bg-brass-400 text-forest-950 flex items-center justify-center font-bold text-sm"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() => onAddToCart(dish)}
              disabled={isAdded}
              className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-brass-600 to-brass-500 hover:from-brass-500 hover:to-brass-400 text-forest-950 shadow-brass hover:scale-105 active:scale-95'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>ADDED</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>ADD TO CART</span>
                </>
              )}
            </button>
          )}

        </div>

      </div>

    </div>
  );
};
