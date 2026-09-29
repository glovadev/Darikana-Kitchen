import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CategoryNavigation: React.FC = () => {
  const { activeCategory, setActiveCategory, categories } = useCart();

  // If no categories or products exist yet, hide the navigation bar
  if (categories.length === 0) {
    return null;
  }

  // Ensure "ALL" category is always present at the start
  const displayCategories = React.useMemo(() => {
    const list = [...categories];
    if (!list.some(c => c.name === 'ALL')) {
      list.unshift({ id: 'ALL', name: 'ALL', label: 'All Offerings', icon: '🍲', displayOrder: 0 });
    }
    return list;
  }, [categories]);

  return (
    <div className="w-full relative z-20 py-4 mb-8">
      {/* Red Gamocha inspired top subtle border */}
      <div className="gamocha-strip w-full mb-4 opacity-70"></div>

      {/* Mobile View: Category Dropdown Button (styled like Sort: Recommended) */}
      <div className="sm:hidden px-1 mb-2">
        <div className="relative">
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border-2 border-brass-500/70 rounded-full text-xs font-bold text-forest-950 shadow-sm focus:outline-none focus:border-forest-900 appearance-none pr-10 cursor-pointer"
          >
            {displayCategories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.icon || '🍲'} Category: {cat.label || cat.name}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-brass-700">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Desktop / Tablet View: Full Category Pills */}
      <div className="hidden sm:flex flex-wrap items-center justify-start gap-2 sm:gap-2.5 pb-2 px-1">
        {displayCategories.map((cat) => {
          const isActive = activeCategory === cat.name;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-1.5 sm:gap-2 border relative shadow-sm ${
                isActive
                  ? 'bg-forest-900 text-white border-brass-500 shadow-brass -translate-y-0.5 ring-1 ring-brass-400'
                  : 'bg-white text-forest-900/80 border-bamboo-300/80 hover:border-brass-500/50 hover:bg-riceCream-50'
              }`}
            >
              <span className="text-sm sm:text-base">{cat.icon || '🍲'}</span>
              <span className="tracking-wide">{cat.label || cat.name}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-assamRed-500 animate-pulse ml-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
