import React from 'react';
import { Flame, Home, Truck, ChevronRight, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Hero: React.FC = () => {
  const { setIsCartOpen } = useCart();

  const handleOrderClick = () => {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreThalis = () => {
    const thaliSection = document.getElementById('thalis');
    if (thaliSection) {
      thaliSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Cinematic Background Image with Slow Zoom Effect */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/Hero-Chulha.png"
          alt="Traditional Assamese Chulha Cooking by Dipali Barman"
          className="w-full h-full object-cover object-center scale-105 animate-[pulse-slow_8s_ease-in-out_infinite]"
        />
        {/* Layered cinematic overlays: dark vignetting + warm fire glow + deep forest green tint */}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/70 to-black/60"></div>
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-forest-950/40 to-forest-950/90"></div>
        
        {/* Firewood Amber Glow Overlay in Bottom Left */}
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-assamRed-700/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-brass-500/15 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* Decorative Traditional Gamocha Top Header Border Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-assamRed-700 via-white to-assamRed-700 z-10 opacity-80"></div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center flex flex-col items-center">
        
        {/* Cultural Brand Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-900/80 border border-brass-500/50 backdrop-blur-md mb-6 shadow-brass">
          <Sparkles className="w-3.5 h-3.5 text-brass-400" />
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-riceCream-100 uppercase">
            Authentic Assamese Food • Cloud Kitchen
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-assamRed-500"></span>
        </div>

        {/* Large Editorial Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
          <span className="block text-riceCream-200">From Our Chulha</span>
          <span className="block brass-gradient-text drop-shadow-lg">To Your Home.</span>
        </h1>

        {/* Subtext highlighting founder Dipali Barman & firewood USP */}
        <p className="max-w-2xl text-base sm:text-xl text-riceCream-200/90 font-light leading-relaxed mb-8">
          Traditional recipes, authentic ethnic ingredients, and the unmistakable aroma of <strong className="text-brass-300 font-semibold">traditional firewood cooking</strong> — lovingly prepared in small batches by <span className="text-white font-medium underline decoration-assamRed-600 underline-offset-4">Dipali Barman</span>.
        </p>

        {/* CTA Button Group */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-12">
          <button
            onClick={handleOrderClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-brass-500 via-brass-400 to-brass-500 hover:from-brass-400 hover:to-brass-300 text-forest-950 font-extrabold text-base px-8 py-4 rounded-full shadow-2xl shadow-brass/30 transform hover:-translate-y-1 transition-all duration-300 active:translate-y-0"
          >
            <Flame className="w-5 h-5 text-assamRed-700 fill-assamRed-700" />
            <span>ORDER NOW</span>
            <ChevronRight className="w-4 h-4 text-forest-950" />
          </button>

          <button
            onClick={handleExploreThalis}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-forest-900/80 hover:bg-forest-800/90 text-white font-semibold text-base px-7 py-4 rounded-full border border-brass-500/40 hover:border-brass-400 backdrop-blur-md transition-all duration-300"
          >
            <span>EXPLORE MENU</span>
          </button>
        </div>

        {/* Core USP Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 w-full max-w-3xl pt-6 border-t border-brass-600/30">
          <div className="flex items-center justify-center gap-3 bg-forest-950/70 border border-brass-500/30 rounded-xl px-4 py-3 backdrop-blur-md">
            <div className="w-9 h-9 rounded-full bg-assamRed-900/70 border border-assamRed-500/50 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 text-assamRed-500 fill-assamRed-500" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-white tracking-wide uppercase">Cooked on Firewood</h4>
              <p className="text-[11px] text-riceCream-300/80">Authentic smoky clay chulha flavor</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 bg-forest-950/70 border border-brass-500/30 rounded-xl px-4 py-3 backdrop-blur-md">
            <div className="w-9 h-9 rounded-full bg-forest-800/70 border border-forest-500/50 flex items-center justify-center shrink-0">
              <Home className="w-5 h-5 text-brass-400" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-white tracking-wide uppercase">Homemade Style</h4>
              <p className="text-[11px] text-riceCream-300/80">Crafted with mother's devotion</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 bg-forest-950/70 border border-brass-500/30 rounded-xl px-4 py-3 backdrop-blur-md">
            <div className="w-9 h-9 rounded-full bg-brass-900/70 border border-brass-500/50 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-brass-300" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-white tracking-wide uppercase">Hot Home Delivery</h4>
              <p className="text-[11px] text-riceCream-300/80">Packed in eco-friendly banana leaves</p>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Assamese Curved Wave Transition */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-8 sm:h-14 text-riceCream-100 preserve-3d"
          preserveAspectRatio="none"
        >
          <path
            d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,42.7C840,32,960,32,1080,42.7C1200,53,1320,75,1380,85.3L1440,96L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
    </section>
  );
};
