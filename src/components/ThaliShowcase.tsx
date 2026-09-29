import React, { useState } from 'react';
import { Sparkles, Flame, Plus, Check, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ThaliShowcase: React.FC = () => {
  const { products, addToCart, setSelectedThaliModal } = useCart();
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Dynamic products featured in "The Taste of Assam" by the Admin
  const featuredTasteOfAssamItems = React.useMemo(() => {
    return products.filter(item => item.isTasteOfAssam);
  }, [products]);

  const [selectedThaliId, setSelectedThaliId] = useState<string>('');

  // Keep selected thali in sync with the featured list
  const currentThali = React.useMemo(() => {
    return featuredTasteOfAssamItems.find(item => item.id === selectedThaliId) || 
      featuredTasteOfAssamItems[0] || 
      null;
  }, [featuredTasteOfAssamItems, selectedThaliId]);

  if (!currentThali || featuredTasteOfAssamItems.length === 0) {
    return null;
  }

  const handleAdd = () => {
    addToCart(currentThali, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <section id="thalis" className="py-20 sm:py-28 bg-forest-950 text-white relative overflow-hidden">
      {/* Background Subtle Textures */}
      <div className="absolute inset-0 dark-hearth-pattern opacity-60"></div>
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-brass-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-assamRed-700/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brass-900/60 text-brass-300 border border-brass-500/40 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brass-400" />
            <span>Grand Cultural Experience</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
            The Taste of Assam
          </h2>
          <p className="text-sm sm:text-base text-riceCream-300 max-w-xl mx-auto">
            Served on polished bell-metal <em className="text-brass-300 font-serif not-italic">Kanh</em> plates and natural banana leaves — a celebration of indigenous harvests and heirloom culinary artistry.
          </p>
        </div>

        {/* Thali Selector Pills (Dynamic from Admin) */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {featuredTasteOfAssamItems.map((item) => {
            const isSelected = item.id === currentThali.id;
            const icon = item.isVeg ? '🌿' : (item.name.toLowerCase().includes('fish') || item.name.toLowerCase().includes('borali') || item.name.toLowerCase().includes('ilish') ? '🐟' : '👑');
            return (
              <button
                key={item.id}
                onClick={() => setSelectedThaliId(item.id)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all border flex items-center gap-2 ${
                  isSelected
                    ? 'bg-brass-500 text-forest-950 border-brass-400 shadow-brass scale-105'
                    : 'bg-forest-900/80 text-riceCream-200 border-forest-800 hover:border-brass-600/40 hover:text-white'
                }`}
              >
                <span>{icon}</span>
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* Featured Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-forest-900/60 rounded-3xl p-6 sm:p-10 border border-brass-600/30 backdrop-blur-md shadow-2xl">
          
          {/* Left: Large Horizontal/Square Food Photography */}
          <div className="lg:col-span-7 relative group">
            <div className="relative rounded-2xl overflow-hidden ring-1 ring-brass-500/40 shadow-2xl">
              <img
                src={currentThali.image}
                alt={currentThali.name}
                className="w-full h-80 sm:h-[480px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-black/30"></div>

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="bg-assamRed-700 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 fill-current" /> FIREWOOD CHULHA
                </span>
                <span className="bg-forest-950/90 text-brass-400 border border-brass-500/50 text-xs font-bold px-3 py-1 rounded-full">
                  ★ SIGNATURE MASTERPIECE
                </span>
              </div>

              {/* Quick View Button over Image */}
              <button
                onClick={() => setSelectedThaliModal(currentThali)}
                className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-forest-950 text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
              >
                <Eye className="w-4 h-4 text-forest-900" />
                <span>EXPLORE THALI</span>
              </button>
            </div>
          </div>

          {/* Right: Thali Details & Included Items */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold tracking-widest text-brass-400 uppercase">
                  {currentThali.category}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  currentThali.isVeg 
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-950/50' 
                    : 'border-assamRed-500 text-assamRed-400 bg-assamRed-950/50'
                }`}>
                  {currentThali.isVeg ? '● 100% PURE VEG' : '▲ AUTHENTIC NON-VEG'}
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-4xl font-extrabold text-white leading-tight mb-1">
                {currentThali.name}
              </h3>
              <p className="font-accent text-sm text-brass-300/80 mb-3">
                {currentThali.assameseName}
              </p>

              <p className="text-sm text-riceCream-200/90 leading-relaxed mb-5">
                {currentThali.description}
              </p>

              {/* Interactive Thali Breakdown List */}
              <div className="bg-forest-950/80 rounded-xl p-4 border border-brass-600/20 mb-6">
                <div className="text-xs font-bold uppercase tracking-wider text-brass-400 mb-2.5 flex items-center gap-1.5">
                  <span>What's In Your Bell-Metal Thali:</span>
                </div>
                <ul className="space-y-1.5 text-xs text-riceCream-200">
                  {currentThali.thaliIncludes?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-brass-400 font-bold shrink-0">✦</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Price & Action Button */}
            <div className="pt-4 border-t border-forest-800 flex items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-riceCream-300 block uppercase tracking-wide">Direct Cloud Kitchen Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-3xl font-black text-brass-400">
                    ₹{currentThali.price}
                  </span>
                  {currentThali.originalPrice && (
                    <span className="text-sm text-riceCream-400/60 line-through">
                      ₹{currentThali.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedThaliModal(currentThali)}
                  className="px-4 py-3 rounded-full border border-brass-500/40 text-xs font-semibold text-brass-300 hover:bg-forest-800 transition-colors"
                >
                  Details
                </button>
                <button
                  onClick={handleAdd}
                  disabled={addedAnimation}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-xs sm:text-sm tracking-wide transition-all shadow-brass ${
                    addedAnimation
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-r from-brass-500 to-brass-400 hover:from-brass-400 hover:to-brass-300 text-forest-950 transform hover:scale-105 active:scale-95'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>ADDED!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>ADD TO CART</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
