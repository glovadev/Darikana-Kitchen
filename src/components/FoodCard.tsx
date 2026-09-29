import React, { useState } from 'react';
import { MenuItem } from '../types';
import { useCart } from '../context/CartContext';
import { Flame, Plus, Minus, Check, Info } from 'lucide-react';

interface FoodCardProps {
  item: MenuItem;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item }) => {
  const { addToCart, setSelectedThaliModal } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity(prev => Math.min(10, prev + 1));
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(item, quantity);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      setQuantity(1);
    }, 1200);
  };

  return (
    <div
      onClick={() => setSelectedThaliModal(item)}
      className="group relative bg-white rounded-3xl overflow-hidden border border-bamboo-200/80 shadow-md hover:shadow-rich transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer"
    >
      {/* Top Traditional Gamocha Micro Accent Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-assamRed-600/40 to-transparent group-hover:via-brass-500 transition-all duration-500"></div>

      <div>
        {/* Food Image Container */}
        <div className="relative h-56 sm:h-64 overflow-hidden bg-forest-950">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          {/* Badges on Top */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {/* Veg / Non-Veg Indicator Icon */}
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center p-0.5 bg-white/95 backdrop-blur-sm shadow border ${
                item.isVeg ? 'border-emerald-600' : 'border-assamRed-600'
              }`}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  item.isVeg ? 'bg-emerald-600' : 'bg-assamRed-600'
                }`}
              ></div>
            </div>

            {/* Firewood Special Tag */}
            {item.firewoodSpecial && (
              <span className="bg-forest-950/90 border border-brass-500/50 text-brass-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm backdrop-blur-sm">
                <Flame className="w-3 h-3 text-assamRed-500 fill-assamRed-500" />
                <span>CHULHA</span>
              </span>
            )}

            {/* Bestseller Badge */}
            {item.isBestseller && (
              <span className="bg-assamRed-700 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">
                BESTSELLER
              </span>
            )}
          </div>

          {/* Prep time or spice level pill */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-riceCream-200">
            <span className="bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full font-medium">
              ⏱ {item.prepTime || '20-30 mins'}
            </span>
            {item.spiceLevel && (
              <span className="bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full font-medium text-brass-300">
                🌶 {item.spiceLevel}
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-forest-950 group-hover:text-assamRed-800 transition-colors leading-snug">
              {item.name}
            </h3>
          </div>

          {/* Assamese Name */}
          <p className="font-accent text-xs text-brass-700 font-semibold mb-2.5">
            {item.assameseName}
          </p>

          {/* Description */}
          <p className="text-xs sm:text-sm text-forest-900/70 line-clamp-2 leading-relaxed mb-4">
            {item.description}
          </p>
        </div>
      </div>

      {/* Card Footer: Price & Add Actions */}
      <div className="p-5 sm:p-6 pt-0 border-t border-bamboo-100 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-black text-forest-950">
              ₹{item.price}
            </span>
            {item.originalPrice && (
              <span className="text-xs text-forest-900/50 line-through">
                ₹{item.originalPrice}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedThaliModal(item);
            }}
            className="text-[11px] font-semibold text-brass-800 hover:text-assamRed-700 flex items-center gap-1 underline underline-offset-2"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Recipe Details</span>
          </button>
        </div>

        {/* Quantity Controls & Add to Cart */}
        <div className="flex items-center gap-2">
          {/* Quantity Selector */}
          <div className="flex items-center bg-riceCream-200/80 rounded-xl p-1 border border-bamboo-300/60">
            <button
              onClick={handleDecrement}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-forest-950 font-bold transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-7 text-center font-bold text-xs text-forest-950">
              {quantity}
            </span>
            <button
              onClick={handleIncrement}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-forest-950 font-bold transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={justAdded}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all shadow-sm ${
              justAdded
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-forest-900 hover:bg-forest-800 text-brass-300 hover:text-brass-200 active:scale-98'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>ADDED!</span>
              </>
            ) : (
              <>
                <span>ADD TO CART</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
