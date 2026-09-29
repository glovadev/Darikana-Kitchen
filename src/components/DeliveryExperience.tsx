import React, { useState } from 'react';
import { Truck, Flame, Box, Heart, MapPin, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { SERVICEABLE_AREAS } from '../data/menuData';

export const DeliveryExperience: React.FC = () => {
  const { deliveryCheck, checkDeliveryArea, serviceableAreaNames } = useCart();
  const [inputVal, setInputVal] = useState('');

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    checkDeliveryArea(inputVal);
  };

  return (
    <section className="py-20 sm:py-28 bg-forest-950 text-white relative overflow-hidden">
      {/* Background Subtle Ambience */}
      <div className="absolute inset-0 dark-hearth-pattern opacity-40"></div>
      <div className="absolute top-10 left-10 w-96 h-96 bg-brass-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-900 border border-brass-500/40 text-brass-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Truck className="w-3.5 h-3.5 text-brass-400" />
            <span>Guwahati Cloud Kitchen Logistics</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
            Hot, Fresh & Delivered Home
          </h2>
          <p className="text-sm sm:text-base text-riceCream-300 max-w-xl mx-auto">
            Packed with banana leaves in thermal insulated carriers to preserve the rustic firewood warmth right to your dining room.
          </p>
        </div>

        {/* 4 Feature Columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          
          <div className="bg-forest-900/60 border border-brass-600/20 rounded-2xl p-5 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-forest-950 border border-brass-500/40 flex items-center justify-center text-brass-300 mb-3">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-sm sm:text-base text-white mb-1">Home Delivery</h4>
            <p className="text-xs text-riceCream-300">Fast 35-50 min dispatch across Guwahati</p>
          </div>

          <div className="bg-forest-900/60 border border-brass-600/20 rounded-2xl p-5 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-forest-950 border border-assamRed-500/40 flex items-center justify-center text-assamRed-400 mb-3">
              <Flame className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-sm sm:text-base text-white mb-1">Freshly Cooked</h4>
            <p className="text-xs text-riceCream-300">Never pre-cooked; made on wood fire per order</p>
          </div>

          <div className="bg-forest-900/60 border border-brass-600/20 rounded-2xl p-5 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-forest-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-3">
              <Box className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-sm sm:text-base text-white mb-1">Carefully Packed</h4>
            <p className="text-xs text-riceCream-300">Natural banana leaf liners & spill-proof seals</p>
          </div>

          <div className="bg-forest-900/60 border border-brass-600/20 rounded-2xl p-5 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-forest-950 border border-assamRed-500/40 flex items-center justify-center text-assamRed-400 mb-3">
              <Heart className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-sm sm:text-base text-white mb-1">Made With Passion</h4>
            <p className="text-xs text-riceCream-300">Under the watchful care of Dipali Barman</p>
          </div>

        </div>

        {/* Delivery Checker Box */}
        <div className="max-w-2xl mx-auto bg-forest-900/80 border border-brass-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
          <div className="text-center mb-5">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-1">
              Check Delivery Availability
            </h3>
            <p className="text-xs text-riceCream-300">
              Enter your Guwahati locality (e.g. Dispur, Beltola, Zoo Road, Pan Bazar) or Pin Code
            </p>
          </div>

          <form onSubmit={handleCheck} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <MapPin className="w-5 h-5 text-brass-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Enter your delivery location..."
                className="w-full pl-10 pr-4 py-3 bg-forest-950 border border-brass-600/50 rounded-xl text-sm text-white placeholder-riceCream-300/50 focus:outline-none focus:border-brass-400"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-brass-500 to-brass-400 hover:from-brass-400 hover:to-brass-300 text-forest-950 font-bold px-6 py-3 rounded-xl shadow-brass transition-all duration-300 shrink-0 text-sm"
            >
              CHECK DELIVERY
            </button>
          </form>

          {/* Delivery Response Status */}
          {deliveryCheck.checked && (
            <div
              className={`mt-4 p-4 rounded-xl text-xs sm:text-sm flex items-start gap-3 animate-fadeIn ${
                deliveryCheck.serviceable
                  ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200'
                  : 'bg-amber-950/80 border border-amber-500/50 text-amber-200'
              }`}
            >
              {deliveryCheck.serviceable ? (
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-semibold">{deliveryCheck.message}</p>
                {deliveryCheck.serviceable && (
                  <p className="text-[11px] text-emerald-300/80 mt-1">
                    Free home delivery on all orders above ₹499!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Popular Localities Chips */}
          <div className="mt-5 pt-4 border-t border-forest-800/80">
            <span className="text-[11px] text-riceCream-300/70 block mb-2 font-medium">
              Popular Serviceable Localities:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {serviceableAreaNames.slice(0, 10).map((area, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setInputVal(area);
                    checkDeliveryArea(area);
                  }}
                  className="text-[11px] bg-forest-950/60 hover:bg-forest-950 text-riceCream-200 hover:text-brass-300 px-2.5 py-1 rounded-lg border border-brass-600/20 transition-colors"
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
