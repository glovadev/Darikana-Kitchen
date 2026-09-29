import React, { useState } from 'react';
import { X, Flame, Check, Plus, Minus, Sparkles, Utensils } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ThaliModal: React.FC = () => {
  const { selectedThaliModal, setSelectedThaliModal, addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!selectedThaliModal) return null;

  const item = selectedThaliModal;

  const handleAdd = () => {
    addToCart(item, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setSelectedThaliModal(null);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setSelectedThaliModal(null)}
      />

      <div className="min-h-screen px-4 text-center flex items-center justify-center py-8">
        <div className="inline-block w-full max-w-2xl bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all border border-bamboo-300 relative z-10">
          
          {/* Modal Header & Hero Image */}
          <div className="relative h-64 sm:h-80 bg-forest-950">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedThaliModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className={`text-[11px] font-bold px-3 py-1 rounded-full border shadow-sm backdrop-blur-md ${
                item.isVeg
                  ? 'border-emerald-500 bg-emerald-950/80 text-emerald-300'
                  : 'border-assamRed-500 bg-assamRed-950/80 text-assamRed-300'
              }`}>
                {item.isVeg ? '● 100% PURE VEG' : '▲ AUTHENTIC NON-VEG'}
              </span>

              {item.firewoodSpecial && (
                <span className="bg-forest-950/90 border border-brass-500/50 text-brass-300 text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm backdrop-blur-sm">
                  <Flame className="w-3.5 h-3.5 text-assamRed-500 fill-assamRed-500" />
                  <span>TRADITIONAL CHULHA</span>
                </span>
              )}
            </div>

            {/* Title on Bottom of Image */}
            <div className="absolute bottom-4 left-6 right-6">
              <span className="text-xs uppercase font-extrabold tracking-widest text-brass-400 block mb-1">
                {item.category}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {item.name}
              </h3>
              <p className="font-accent text-sm text-brass-300">
                {item.assameseName}
              </p>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Long Description */}
            <div className="text-sm text-forest-900/80 leading-relaxed">
              <p>{item.longDescription || item.description}</p>
            </div>

            {/* Thali Components List (if applicable) */}
            {item.thaliIncludes && item.thaliIncludes.length > 0 && (
              <div className="bg-riceCream-100 rounded-2xl p-5 border border-bamboo-200">
                <h4 className="font-serif font-bold text-sm text-forest-950 mb-3 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-brass-700" />
                  <span>Served on Kanh Bell-Metal Plate & Banana Leaf:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-forest-900/90">
                  {item.thaliIncludes.map((comp, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-brass-600 font-bold">✦</span>
                      <span>{comp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features Bar */}
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-forest-900/70 border-t border-b border-bamboo-200 py-3">
              <span>⏱ Preparation Time: <strong>{item.prepTime || '25-35 mins'}</strong></span>
              {item.spiceLevel && <span>🌶 Spice Level: <strong>{item.spiceLevel}</strong></span>}
              <span>🌿 Cooking Medium: <strong>Virgin Mustard Oil & Chulha Fire</strong></span>
            </div>

            {/* Price and Add to Cart Action */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <div>
                <span className="text-[11px] text-forest-900/60 block uppercase">Price per plate</span>
                <span className="font-serif text-3xl font-black text-forest-950">
                  ₹{item.price}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Quantity Controls */}
                <div className="flex items-center bg-riceCream-200 rounded-xl p-1 border border-bamboo-300">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded hover:bg-white text-forest-950 font-bold"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-bold text-sm text-forest-950">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded hover:bg-white text-forest-950 font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add Button */}
                <button
                  onClick={handleAdd}
                  disabled={added}
                  className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md ${
                    added
                      ? 'bg-emerald-600 text-white'
                      : 'bg-forest-900 hover:bg-forest-800 text-brass-300 hover:text-white'
                  }`}
                >
                  {added ? (
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-white" />
                      ADDED TO CART!
                    </span>
                  ) : (
                    <span>ADD TO CART (₹{item.price * quantity})</span>
                  )}
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
