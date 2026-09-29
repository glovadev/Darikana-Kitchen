import React, { useState } from 'react';
import { X, CheckCircle2, Flame, MapPin, Phone, User, FileText, ShieldCheck, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { CustomerDetails } from '../types';
import { SERVICEABLE_AREAS } from '../data/menuData';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    subtotal,
    deliveryCharge,
    packagingFee,
    grandTotal,
    clearCart,
    setOrderSuccess,
    orderSuccess,
    submitCustomerOrder,
    localities,
    serviceableAreaNames
  } = useCart();

  const [formData, setFormData] = useState<CustomerDetails>({
    name: '',
    phone: '',
    email: '',
    address: '',
    landmark: '',
    deliveryArea: serviceableAreaNames[0] || 'Dispur',
    deliverySlot: 'Immediate (40-50 mins)',
    paymentMethod: 'UPI',
    instructions: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen && !orderSuccess) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      alert('Please fill out your Name, Phone Number, and Delivery Address.');
      return;
    }

    setIsSubmitting(true);

    try {
      await submitCustomerOrder(formData);

      // Trigger Confetti Celebration
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#c99b22', '#b31f1f', '#143823', '#e0b034']
      });
    } catch (err: any) {
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setOrderSuccess(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      <div className="min-h-screen px-4 text-center flex items-center justify-center py-8">
        <div className="inline-block w-full max-w-2xl bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all border border-bamboo-300 relative z-10">
          
          {/* Header */}
          <div className="p-5 sm:p-6 bg-forest-950 text-white flex items-center justify-between border-b border-forest-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-forest-900 border border-brass-500/50 flex items-center justify-center text-brass-400">
                <Flame className="w-5 h-5 text-assamRed-500 fill-assamRed-500" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-white">
                  {orderSuccess ? 'Order Confirmed!' : 'Complete Your Order'}
                </h3>
                <p className="text-xs text-brass-400">
                  {orderSuccess ? 'Dispatched directly from Dipali Barman\'s Chulha' : 'Darikana Kitchen Cloud Delivery'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1 rounded-full text-riceCream-300 hover:text-white hover:bg-forest-900"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Success State */}
          {orderSuccess ? (
            <div className="p-6 sm:p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-300">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <span className="text-xs uppercase font-extrabold tracking-widest text-brass-700 block mb-1">
                Order Placed Successfully
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950 mb-2">
                Thank You, {orderSuccess.customer.name}!
              </h3>
              <p className="text-xs sm:text-sm text-forest-900/70 max-w-md mx-auto mb-6">
                Your order <strong className="text-forest-950 font-bold">#{orderSuccess.orderId}</strong> is received. Dipali Barman has fired up the mud chulha to prepare your fresh meals.
              </p>

              {/* Order Details Card */}
              <div className="bg-riceCream-100/80 rounded-2xl p-5 border border-bamboo-200 text-left max-w-lg mx-auto mb-6 space-y-3">
                <div className="flex justify-between text-xs pb-2 border-b border-bamboo-200">
                  <span className="text-forest-900/70">Estimated Delivery:</span>
                  <span className="font-bold text-forest-950">40 - 50 Minutes</span>
                </div>
                <div className="flex justify-between text-xs pb-2 border-b border-bamboo-200">
                  <span className="text-forest-900/70">Delivery Address:</span>
                  <span className="font-medium text-forest-950 text-right max-w-xs truncate">
                    {orderSuccess.customer.address}, {orderSuccess.customer.deliveryArea}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-serif font-black pt-1">
                  <span>Amount to Pay:</span>
                  <span className="text-assamRed-700 text-base">₹{orderSuccess.grandTotal}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/918133958961?text=${encodeURIComponent(`Hello Dipali Barman & Darikana Kitchen team! I just placed order #${orderSuccess.orderId} for ₹${orderSuccess.grandTotal}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-full text-xs transition-all shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat / Track on WhatsApp</span>
                </a>
                <button
                  onClick={handleClose}
                  className="w-full sm:w-auto bg-forest-900 hover:bg-forest-800 text-brass-300 font-bold px-8 py-3 rounded-full text-xs transition-all"
                >
                  Back to Home
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 space-y-5">
              
              {/* Customer Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-brass-700" />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rupak Sarma"
                    className="w-full px-3.5 py-2.5 bg-riceCream-50 border border-bamboo-300 rounded-xl text-xs text-forest-950 focus:outline-none focus:border-forest-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-brass-700" />
                    <span>Phone Number *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98640 XXXXX"
                    className="w-full px-3.5 py-2.5 bg-riceCream-50 border border-bamboo-300 rounded-xl text-xs text-forest-950 focus:outline-none focus:border-forest-800"
                  />
                </div>
              </div>

              {/* Address Details */}
              <div>
                <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brass-700" />
                  <span>Delivery Address (House / Flat / Street) *</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="House No, Apartment name, Road or Bylane"
                  className="w-full px-3.5 py-2 bg-riceCream-50 border border-bamboo-300 rounded-xl text-xs text-forest-950 focus:outline-none focus:border-forest-800"
                ></textarea>
              </div>

              {/* Area & Landmark */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1">
                    Guwahati Locality *
                  </label>
                  <select
                    value={formData.deliveryArea}
                    onChange={(e) => setFormData({ ...formData, deliveryArea: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-riceCream-50 border border-bamboo-300 rounded-xl text-xs text-forest-950 focus:outline-none focus:border-forest-800"
                  >
                    {localities.filter(l => l.isActive).map(loc => (
                      <option key={loc.id} value={loc.name}>
                        {loc.name} {loc.deliveryTime ? `(${loc.deliveryTime})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1">
                    Nearby Landmark
                  </label>
                  <input
                    type="text"
                    value={formData.landmark}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    placeholder="e.g. Near Ganesh Mandir, Opposite SBI"
                    className="w-full px-3.5 py-2.5 bg-riceCream-50 border border-bamboo-300 rounded-xl text-xs text-forest-950 focus:outline-none focus:border-forest-800"
                  />
                </div>
              </div>

              {/* Delivery Timing Slot */}
              <div>
                <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1">
                  Preferred Delivery Slot
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    'Immediate (40-50 mins)',
                    'Lunch (12:30 PM - 2:00 PM)',
                    'Dinner (7:30 PM - 9:30 PM)'
                  ].map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setFormData({ ...formData, deliverySlot: slot as any })}
                      className={`py-2 px-2 text-[11px] font-bold rounded-xl border text-center transition-all ${
                        formData.deliverySlot === slot
                          ? 'bg-forest-900 text-white border-forest-900 shadow-sm'
                          : 'bg-white text-forest-900 border-bamboo-300 hover:bg-riceCream-100'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-brass-700" />
                  <span>Cooking / Delivery Note</span>
                </label>
                <input
                  type="text"
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  placeholder="e.g. Please send extra Kaji Nemu lime slice; less spicy"
                  className="w-full px-3.5 py-2 bg-riceCream-50 border border-bamboo-300 rounded-xl text-xs text-forest-950 focus:outline-none focus:border-forest-800"
                />
              </div>

              {/* Bill Details */}
              <div className="bg-riceCream-100 rounded-xl p-4 border border-bamboo-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-forest-900/70">Subtotal ({cart.length} dishes):</span>
                  <span className="font-semibold text-forest-950">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-forest-900/70">Home Delivery Charge:</span>
                  <span className="font-semibold text-forest-950">
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-forest-900/70">Clay & Banana Leaf Packaging:</span>
                  <span className="font-semibold text-forest-950">₹{packagingFee}</span>
                </div>
                <div className="pt-2 border-t border-bamboo-300 flex justify-between font-serif font-black text-sm">
                  <span>Total Payable:</span>
                  <span className="text-assamRed-700 text-base">₹{grandTotal}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="w-full bg-gradient-to-r from-brass-600 via-brass-500 to-brass-600 hover:from-brass-500 hover:to-brass-400 text-forest-950 font-bold py-3.5 rounded-2xl shadow-brass text-sm flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {isSubmitting ? (
                  <span>Dispatching to Chulha...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-forest-950" />
                    <span>CONFIRM ORDER (₹{grandTotal})</span>
                  </>
                )}
              </button>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};
