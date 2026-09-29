import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Flame, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryCharge,
    packagingFee,
    grandTotal,
    freeDeliveryThreshold,
    freeDeliveryRemaining,
    setIsCheckoutOpen
  } = useCart();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const progressPercent = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-bamboo-300">
          
          {/* Header */}
          <div className="p-5 sm:p-6 bg-forest-950 text-white border-b border-forest-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-forest-900 border border-brass-500/50 flex items-center justify-center text-brass-400">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">Your Food Basket</h3>
                  <p className="text-xs text-brass-400">{cart.length} unique dishes selected</p>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 rounded-full text-riceCream-300 hover:text-white hover:bg-forest-900"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Free Delivery Progress Bar */}
            <div className="mt-4 pt-3 border-t border-forest-900">
              <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                {freeDeliveryRemaining > 0 ? (
                  <span className="text-riceCream-200">
                    Add <strong className="text-brass-300 font-bold">₹{freeDeliveryRemaining}</strong> more for Free Delivery!
                  </span>
                ) : (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Congratulations! You unlocked Free Home Delivery!
                  </span>
                )}
                <span className="text-brass-400 font-bold">{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full bg-forest-900 rounded-full h-2 overflow-hidden border border-forest-800">
                <div
                  className="bg-gradient-to-r from-brass-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 divide-y divide-bamboo-100 space-y-4">
            {cart.length > 0 ? (
              cart.map(({ item, quantity }) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-4 items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-bamboo-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-serif font-bold text-sm text-forest-950 truncate">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-forest-800/40 hover:text-assamRed-600 p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-brass-800 font-semibold mb-2">
                      ₹{item.price} each
                    </p>

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-riceCream-200 rounded-lg p-0.5 border border-bamboo-300">
                        <button
                          onClick={() => updateQuantity(item.id, quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center rounded hover:bg-white text-forest-950 font-bold"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-bold text-xs text-forest-950">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center rounded hover:bg-white text-forest-950 font-bold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-serif font-bold text-sm text-forest-950">
                        ₹{item.price * quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-riceCream-200 text-forest-900 flex items-center justify-center mx-auto mb-4 text-3xl">
                  🍱
                </div>
                <h4 className="font-serif text-lg font-bold text-forest-950 mb-1">
                  Your Basket is Empty
                </h4>
                <p className="text-xs text-forest-900/60 mb-6 max-w-xs mx-auto">
                  Add signature firewood thalis, tender duck curry, or fresh river fish to begin.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-forest-900 text-brass-300 font-bold text-xs px-5 py-2.5 rounded-full hover:bg-forest-800 transition-colors"
                >
                  Explore Menu
                </button>
              </div>
            )}
          </div>

          {/* Footer & Bill Summary */}
          {cart.length > 0 && (
            <div className="p-5 sm:p-6 bg-riceCream-50 border-t border-bamboo-200">
              <div className="space-y-2 text-xs text-forest-900/80 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-forest-950">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    Delivery Partner Fee
                    {subtotal >= freeDeliveryThreshold && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-bold">
                        FREE
                      </span>
                    )}
                  </span>
                  <span className="font-semibold text-forest-950">
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    Eco Banana Leaf & Clay Packaging
                  </span>
                  <span className="font-semibold text-forest-950">₹{packagingFee}</span>
                </div>
                <div className="pt-2 border-t border-bamboo-200 flex justify-between text-base font-serif font-black text-forest-950">
                  <span>Grand Total</span>
                  <span className="text-assamRed-700 text-lg">₹{grandTotal}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brass-600 via-brass-500 to-brass-600 hover:from-brass-500 hover:to-brass-400 text-forest-950 font-bold py-3.5 rounded-2xl shadow-brass text-sm transition-all transform hover:-translate-y-0.5"
              >
                <Flame className="w-4 h-4 text-assamRed-700 fill-assamRed-700" />
                <span>PROCEED TO CHECKOUT (₹{grandTotal})</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
