import React from 'react';
import { Flame, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const SpecialFirewoodVisual: React.FC = () => {
  const { setActiveCategory } = useCart();

  const handleFirewoodOrder = () => {
    setActiveCategory('ALL');
    const menu = document.getElementById('menu');
    if (menu) menu.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative py-28 sm:py-36 bg-black text-white overflow-hidden flex items-center justify-center">
      {/* Background Firewood Photography */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/firewood-chulha.jpg"
          alt="Glowing firewood chulha with leaping golden flames and embers"
          className="w-full h-full object-cover object-center brightness-75 scale-105 animate-[pulse-slow_6s_ease-in-out_infinite]"
        />
        {/* Dark Vignette & Fiery Radial Gradient */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/60 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-black/40 to-forest-950"></div>
      </div>

      {/* Floating Animated Fire Embers / Particles */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        <div className="absolute bottom-10 left-1/4 w-2 h-2 rounded-full bg-amber-400 animate-spark"></div>
        <div className="absolute bottom-16 left-1/3 w-1.5 h-1.5 rounded-full bg-red-500 animate-spark delay-300"></div>
        <div className="absolute bottom-12 right-1/3 w-2.5 h-2.5 rounded-full bg-orange-400 animate-spark delay-700"></div>
        <div className="absolute bottom-8 right-1/4 w-1.5 h-1.5 rounded-full bg-yellow-300 animate-spark delay-500"></div>
        <div className="absolute bottom-20 left-1/2 w-2 h-2 rounded-full bg-orange-500 animate-spark delay-200"></div>
      </div>

      {/* Center Cinematic Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
        
        {/* Fire Icon Flame Badge */}
        <div className="w-14 h-14 rounded-full bg-assamRed-900/80 border-2 border-assamRed-500 flex items-center justify-center mb-6 shadow-hearth animate-pulse">
          <Flame className="w-8 h-8 text-amber-300 fill-amber-400" />
        </div>

        {/* Large Text */}
        <h2 className="font-serif text-3xl sm:text-6xl md:text-7xl font-black tracking-tight leading-tight mb-4 text-white drop-shadow-2xl">
          COOKED WITH FIRE.
          <span className="block brass-gradient-text">SERVED WITH LOVE.</span>
        </h2>

        {/* Subtext */}
        <p className="font-serif italic text-lg sm:text-2xl text-riceCream-200 font-light mb-8 max-w-xl mx-auto drop-shadow-md">
          “Every flame tells a story. Every dish carries the warmth of tradition.”
        </p>

        {/* CTA */}
        <button
          onClick={handleFirewoodOrder}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-assamRed-600 via-assamRed-500 to-assamRed-600 hover:from-assamRed-500 hover:to-assamRed-400 text-white font-extrabold text-sm sm:text-base px-8 py-4 rounded-full shadow-2xl shadow-assamRed-700/50 transform hover:scale-105 transition-all duration-300 active:scale-95"
        >
          <Flame className="w-5 h-5 fill-amber-300 text-amber-300" />
          <span>ORDER TRADITIONAL FIREWOOD THALI</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </section>
  );
};
