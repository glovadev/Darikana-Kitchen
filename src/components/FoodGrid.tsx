import React, { useState, useMemo } from 'react';
import { CategoryNavigation } from './CategoryNavigation';
import { FoodCard } from './FoodCard';
import { useCart } from '../context/CartContext';
import { Search, Sparkles, X } from 'lucide-react';

export const FoodGrid: React.FC = () => {
  const { products, activeCategory, searchQuery, setSearchQuery } = useCart();
  const [vegFilter, setVegFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [firewoodOnly, setFirewoodOnly] = useState(false);

  const filteredItems = useMemo(() => {
    return products.filter((item) => {
      // Category match
      if (activeCategory !== 'ALL' && item.category !== activeCategory) {
        return false;
      }
      // Veg / Non-veg filter
      if (vegFilter === 'veg' && !item.isVeg) return false;
      if (vegFilter === 'non-veg' && item.isVeg) return false;
      // Firewood filter
      if (firewoodOnly && !item.firewoodSpecial) return false;
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesAssamese = item.assameseName.includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesIncludes = item.thaliIncludes?.some(inc => inc.toLowerCase().includes(q));
        if (!matchesName && !matchesAssamese && !matchesDesc && !matchesIncludes) {
          return false;
        }
      }
      return true;
    });
  }, [activeCategory, vegFilter, firewoodOnly, searchQuery]);

  return (
    <section id="menu" className="py-20 sm:py-28 bg-riceCream-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-900 text-brass-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Handcrafted Cloud Kitchen Menu</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-forest-950 tracking-tight mb-3">
            Authentic Assam, Delivered Home.
          </h2>
          <p className="text-sm sm:text-base text-forest-900/70">
            Slow-cooked over natural firewood with indigenous cold-pressed mustard oil, local river fish, and farm-fresh greens.
          </p>
        </div>

        {/* Category Navigation Bar */}
        <CategoryNavigation />

        {/* Filters and Live Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur-md rounded-2xl p-4 mb-8 border border-bamboo-200 shadow-sm">
          
          {/* Veg / Non-Veg Toggle Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center bg-riceCream-200/80 p-1 rounded-xl">
              <button
                onClick={() => setVegFilter('all')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  vegFilter === 'all'
                    ? 'bg-forest-900 text-white shadow'
                    : 'text-forest-900/80 hover:text-forest-950'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setVegFilter('veg')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
                  vegFilter === 'veg'
                    ? 'bg-emerald-700 text-white shadow'
                    : 'text-forest-900/80 hover:text-forest-950'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Pure Veg</span>
              </button>
              <button
                onClick={() => setVegFilter('non-veg')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
                  vegFilter === 'non-veg'
                    ? 'bg-assamRed-700 text-white shadow'
                    : 'text-forest-900/80 hover:text-forest-950'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-assamRed-400"></span>
                <span>Non-Veg</span>
              </button>
            </div>

            {/* Firewood Only Toggle */}
            <button
              onClick={() => setFirewoodOnly(!firewoodOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                firewoodOnly
                  ? 'bg-assamRed-800 text-white border-assamRed-900 shadow'
                  : 'bg-white text-forest-900 border-bamboo-300 hover:border-assamRed-600'
              }`}
            >
              <span>🔥 Chulha Only</span>
            </button>
          </div>

          {/* Search bar & Item Count */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-forest-800/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-riceCream-100/70 border border-bamboo-300 rounded-xl text-xs text-forest-950 placeholder-forest-900/50 focus:outline-none focus:border-brass-600 focus:bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-forest-900/50 hover:text-forest-950"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <span className="text-xs font-semibold text-forest-900/70 whitespace-nowrap">
              {filteredItems.length} dishes
            </span>
          </div>

        </div>

        {/* Food Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredItems.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-bamboo-200 p-8 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-brass-100 text-brass-700 flex items-center justify-center mx-auto mb-4 text-2xl">
              🍲
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest-950 mb-2">
              Fresh Menu Being Prepared
            </h3>
            <p className="text-xs sm:text-sm text-forest-900/70 mb-6 max-w-md mx-auto">
              Our cloud kitchen dishes are being updated. Connect directly with Dipali Barman & the team on WhatsApp for today's special firewood preparations.
            </p>
            <a
              href="https://wa.me/918133958961"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3 rounded-full transition-all shadow-md"
            >
              <span>Order via WhatsApp (+91 8133958961)</span>
            </a>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-bamboo-200 p-8 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-riceCream-200 text-forest-900 flex items-center justify-center mx-auto mb-4 text-2xl">
              🍲
            </div>
            <h3 className="font-serif text-xl font-bold text-forest-950 mb-2">
              No Dishes Found
            </h3>
            <p className="text-sm text-forest-900/70 mb-6 max-w-md mx-auto">
              We couldn't find any dishes matching "{searchQuery}". Try searching for something else or clear filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setVegFilter('all');
                setFirewoodOnly(false);
              }}
              className="bg-forest-900 text-brass-300 font-bold text-xs px-5 py-2.5 rounded-full hover:bg-forest-800 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
