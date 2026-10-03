import React from 'react';
import { Home, Utensils, ShoppingBag, Flame } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const MobileBottomBar: React.FC = () => {
  const { totalItems, setIsCartOpen, setIsCheckoutOpen, currentRoute, navigateTo, openTiffinBookingModal } = useCart();

  const handleOrder = () => {
    if (totalItems > 0) {
      setIsCheckoutOpen(true);
    } else {
      navigateTo('menu');
    }
  };

  const handleHomeClick = () => {
    if (currentRoute !== 'home') {
      navigateTo('home');
    } else {
      const el = document.getElementById('hero');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-forest-950/95 backdrop-blur-md border-t border-brass-600/30 px-4 py-2 shadow-2xl">
      <div className="flex items-center justify-around">
        
        {/* Home */}
        <button
          onClick={handleHomeClick}
          className={`flex flex-col items-center gap-1 py-1 transition-colors ${
            currentRoute === 'home' ? 'text-brass-300 font-bold' : 'text-riceCream-300 hover:text-brass-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-wider">Home</span>
        </button>

        {/* Dedicated Menu */}
        <button
          onClick={() => navigateTo('menu')}
          className={`flex flex-col items-center gap-1 py-1 transition-colors ${
            currentRoute === 'menu' ? 'text-brass-300 font-bold' : 'text-riceCream-300 hover:text-brass-400'
          }`}
        >
          <Utensils className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-wider">Menu</span>
        </button>

        {/* Office Tiffin Quick Trigger */}
        <button
          onClick={() => openTiffinBookingModal()}
          className="flex flex-col items-center gap-0.5 py-1 text-brass-400 hover:text-brass-300 transition-colors"
        >
          <span className="text-base leading-none">🍱</span>
          <span className="text-[9px] font-bold uppercase tracking-wider">Tiffin</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-1 text-riceCream-300 hover:text-brass-400 py-1"
        >
          <ShoppingBag className="w-5 h-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 right-2 bg-assamRed-600 text-white font-black text-[10px] rounded-full w-4 h-4 flex items-center justify-center border border-forest-950 animate-bounce">
              {totalItems}
            </span>
          )}
          <span className="text-[10px] font-bold uppercase tracking-wider">Cart</span>
        </button>

        {/* Order Now */}
        <button
          onClick={handleOrder}
          className="flex items-center gap-1.5 bg-gradient-to-r from-brass-500 to-brass-400 text-forest-950 font-bold px-4 py-2 rounded-full shadow-brass text-xs"
        >
          <Flame className="w-4 h-4 text-assamRed-700 fill-assamRed-700" />
          <span>ORDER</span>
        </button>

      </div>
    </div>
  );
};
