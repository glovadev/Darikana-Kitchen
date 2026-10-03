import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Flame, 
  MapPin, 
  Phone, 
  User, 
  Clock, 
  Calendar, 
  Building2, 
  Sparkles, 
  MessageCircle, 
  ShieldCheck, 
  Leaf, 
  UtensilsCrossed, 
  ChevronRight,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { TiffinPlanType, TiffinDietary } from '../types';

export const TiffinBookingModal: React.FC = () => {
  const {
    isTiffinModalOpen,
    setIsTiffinModalOpen,
    selectedTiffinPlanPreset,
    submitTiffinBooking,
    tiffinSuccess,
    setTiffinSuccess,
    localities,
    serviceableAreaNames,
    tiffinPlans
  } = useCart();

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [isVegetarian, setIsVegetarian] = useState(true);
  const [lunchTime, setLunchTime] = useState('1:00 PM');
  const [customTime, setCustomTime] = useState('');
  const [isCustomTimeActive, setIsCustomTimeActive] = useState(false);
  const [officeName, setOfficeName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [deliveryArea, setDeliveryArea] = useState(serviceableAreaNames[0] || 'Dispur');
  const [planType, setPlanType] = useState<string>('WEEKLY_6_DAYS');
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    // Default to tomorrow if past 11:30 AM
    if (today.getHours() >= 12) {
      today.setDate(today.getDate() + 1);
    }
    return today.toISOString().split('T')[0];
  });
  const [specialDietNotes, setSpecialDietNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync presets if opened with a specific plan
  useEffect(() => {
    if (selectedTiffinPlanPreset) {
      if (selectedTiffinPlanPreset.planType) setPlanType(selectedTiffinPlanPreset.planType);
      if (typeof selectedTiffinPlanPreset.isVeg === 'boolean') setIsVegetarian(selectedTiffinPlanPreset.isVeg);
    }
  }, [selectedTiffinPlanPreset]);

  // Set default delivery area if not selected
  useEffect(() => {
    if (!deliveryArea && serviceableAreaNames.length > 0) {
      setDeliveryArea(serviceableAreaNames[0]);
    }
  }, [serviceableAreaNames, deliveryArea]);

  if (!isTiffinModalOpen && !tiffinSuccess) return null;

  // Active tiffin plans filter
  const activeTiffinPlans = tiffinPlans.filter(p => p.isActive !== false);

  // Dynamic plan pricing lookup
  const selectedPlan = tiffinPlans.find(p => p.planKey === planType || p.id === planType) || activeTiffinPlans[0] || tiffinPlans[0];

  const planInfo = selectedPlan ? {
    name: selectedPlan.name,
    days: selectedPlan.daysCount || 1,
    vegPrice: selectedPlan.vegPrice,
    nonVegPrice: selectedPlan.nonVegPrice,
    desc: selectedPlan.description,
    vegIncludes: selectedPlan.vegIncludes,
    nonVegIncludes: selectedPlan.nonVegIncludes,
    plan: selectedPlan
  } : {
    name: 'Weekly Office Pass (6 Days)',
    days: 6,
    vegPrice: 750,
    nonVegPrice: 980,
    desc: 'Monday to Saturday fresh office lunch with daily variety and priority desk delivery.',
    vegIncludes: 'Aromatic Joha Rice, Yellow/Mati Dal, Seasonal Sabji (Labra), Aloo or Khar Pitika, Paneer or Bilahi Tok, Fresh Salad & Assam Lemon.',
    nonVegIncludes: 'Joha Rice, Dal, Mud-Chulha Local Fish Curry (Rohu/Borali) or Local Chicken Curry (rotating menu) + Seasonal Sabji, Pitika & Salad.',
    plan: null
  };

  const totalPrice = isVegetarian ? planInfo.vegPrice : planInfo.nonVegPrice;
  const pricePerMeal = Math.round(totalPrice / planInfo.days);

  const timeOptions = [
    { label: '12:30 PM', hint: 'Early Lunch' },
    { label: '1:00 PM', hint: 'Most Popular' },
    { label: '1:30 PM', hint: 'Standard Lunch' },
    { label: '2:00 PM', hint: 'Late Lunch' }
  ];

  const handleTimeSelect = (val: string) => {
    setIsCustomTimeActive(false);
    setLunchTime(val);
  };

  const handleCustomTimeInput = (val: string) => {
    setIsCustomTimeActive(true);
    setCustomTime(val);
    setLunchTime(val);
  };

  const handleClose = () => {
    setIsTiffinModalOpen(false);
    setTiffinSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      alert('Please enter your full name.');
      return;
    }

    const cleanPhone = contactNumber.trim().replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      alert('Please enter a valid 10-digit mobile / WhatsApp number.');
      return;
    }

    if (!deliveryAddress.trim()) {
      alert('Please enter your office address or building name and floor.');
      return;
    }

    const finalLunchTime = isCustomTimeActive ? (customTime.trim() || '1:00 PM') : lunchTime;

    setIsSubmitting(true);

    try {
      const bookingNumber = await submitTiffinBooking({
        customerName: customerName.trim(),
        contactNumber: contactNumber.trim(),
        isVegetarian,
        dietaryPreference: isVegetarian ? 'VEG' : 'NON_VEG',
        lunchTime: finalLunchTime,
        officeName: officeName.trim(),
        deliveryAddress: deliveryAddress.trim(),
        landmark: landmark.trim(),
        deliveryArea: deliveryArea || 'Dispur',
        planType,
        startDate,
        numberOfMeals: planInfo.days,
        totalPrice,
        specialDietNotes: specialDietNotes.trim()
      });

      // Confetti celebration
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#e0b034', '#b31f1f', '#25633e', '#ecc65c']
      });

      // Automatically launch WhatsApp with complete tiffin registration
      const waTiffinMsg = 
        `🍱 *DAILY OFFICE TIFFIN BOOKING - DARIKANA KITCHEN*\n` +
        `Dipali Barman's Mud-Chulha Kitchen\n` +
        `----------------------------------------\n` +
        `📋 *Booking No:* #${bookingNumber}\n` +
        `👤 *Customer Name:* ${customerName.trim()}\n` +
        `📞 *Phone / WhatsApp:* ${contactNumber.trim()}\n` +
        `🥗 *Dietary Choice:* ${isVegetarian ? 'Pure Vegetarian (নিয়ামিষ)' : 'Non-Vegetarian (আমিষ)'}\n` +
        `⏰ *Lunch Delivery Time:* ${finalLunchTime} Daily\n` +
        `📅 *Selected Plan:* ${planInfo.name} (${planInfo.days} Meals)\n` +
        `🗓️ *Start Date:* ${startDate || 'Tomorrow'}\n` +
        `🏢 *Office / Address:* ${officeName ? officeName.trim() + ', ' : ''}${deliveryAddress.trim()}\n` +
        `🏙️ *Area:* ${deliveryArea || 'Dispur'}\n` +
        (landmark.trim() ? `📌 *Landmark:* ${landmark.trim()}\n` : '') +
        `💵 *Plan Price:* ₹${totalPrice} (~₹${pricePerMeal}/meal)\n` +
        (specialDietNotes.trim() ? `📝 *Special Diet Notes:* ${specialDietNotes.trim()}\n` : '') +
        `----------------------------------------\n` +
        `Please confirm my office tiffin schedule! 🙏`;

      const waTiffinUrl = `https://wa.me/918133958961?text=${encodeURIComponent(waTiffinMsg)}`;

      try {
        window.open(waTiffinUrl, '_blank');
      } catch {
        // Handled by confirmation screen button
      }
    } catch (err: any) {
      alert('Failed to submit tiffin booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      <div className="min-h-screen px-3 sm:px-4 text-center flex items-center justify-center py-6 sm:py-10">
        <div className="inline-block w-full max-w-2xl bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all border border-brass-600/30 relative z-10">
          
          {/* Top Traditional Assamese Gamocha Accent Border */}
          <div className="h-2 w-full bg-gradient-to-r from-assamRed-700 via-white to-assamRed-700"></div>

          {/* Modal Header */}
          <div className="p-5 sm:p-6 bg-forest-950 text-white flex items-center justify-between border-b border-forest-800">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brass-500 to-brass-700 p-0.5 shadow-lg flex items-center justify-center text-forest-950">
                <span className="text-2xl">🍱</span>
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brass-500/20 text-brass-300 border border-brass-500/40 text-[10px] uppercase font-bold tracking-wider mb-0.5">
                  <Sparkles className="w-3 h-3 text-brass-400" />
                  <span>Guwahati Daily Office Service</span>
                </div>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-white">
                  {tiffinSuccess ? 'Tiffin Booking Confirmed!' : 'Book Office Tiffin Service'}
                </h3>
                <p className="text-xs text-riceCream-300/80">
                  {tiffinSuccess 
                    ? 'Dipali Barman\'s kitchen team has received your lunch request'
                    : 'Smoky mud-chulha home cooked meals delivered right to your office desk'}
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-2 rounded-full text-riceCream-300 hover:text-white hover:bg-forest-900 transition-colors"
              aria-label="Close Modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Success State */}
          {tiffinSuccess ? (
            <div className="p-6 sm:p-8 text-center bg-gradient-to-b from-riceCream-50 to-white">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-300 shadow-md animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <span className="text-xs uppercase font-extrabold tracking-widest text-brass-700 block mb-1">
                Booking Reference #{tiffinSuccess.bookingNumber}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950 mb-2">
                Swagatam, {tiffinSuccess.customerName}!
              </h3>
              <p className="text-xs sm:text-sm text-forest-900/80 max-w-md mx-auto mb-4">
                Your office tiffin service booking is registered. Fresh, wholesome hot food cooked on firewood will arrive at your desk daily on time.
              </p>

              {/* WhatsApp Notice Banner */}
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3.5 max-w-lg mx-auto mb-5 flex items-center gap-3 text-left shadow-xs">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <MessageCircle className="w-5 h-5 fill-white" />
                </div>
                <div className="text-xs text-emerald-950">
                  <span className="font-bold block">WhatsApp Tiffin Dispatch</span>
                  <span>If WhatsApp did not open automatically, tap the button below to send your schedule.</span>
                </div>
              </div>

              {/* Booking Summary Box */}
              <div className="bg-riceCream-100/90 rounded-2xl p-5 border border-bamboo-300 text-left max-w-lg mx-auto mb-6 space-y-2.5 shadow-inner">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-bamboo-200">
                  <span className="text-forest-900/70 flex items-center gap-1.5 font-medium">
                    <Leaf className={`w-3.5 h-3.5 ${tiffinSuccess.isVegetarian ? 'text-emerald-600' : 'text-assamRed-600'}`} />
                    Dietary Choice:
                  </span>
                  <span className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                    tiffinSuccess.isVegetarian 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : 'bg-assamRed-100 text-assamRed-800 border border-assamRed-300'
                  }`}>
                    {tiffinSuccess.isVegetarian ? 'Pure Vegetarian (নিয়ামিষ)' : 'Non-Vegetarian (আমিষ)'}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs pb-2 border-b border-bamboo-200">
                  <span className="text-forest-900/70 flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-brass-700" />
                    Delivery Time:
                  </span>
                  <span className="font-bold text-forest-950 bg-white px-2.5 py-0.5 rounded-md border border-bamboo-300">
                    {tiffinSuccess.lunchTime} Daily
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs pb-2 border-b border-bamboo-200">
                  <span className="text-forest-900/70 flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-forest-700" />
                    Plan Selected:
                  </span>
                  <span className="font-bold text-forest-950">
                    {tiffinPlans.find(p => p.planKey === tiffinSuccess.planType || p.id === tiffinSuccess.planType)?.name || (
                      tiffinSuccess.planType === 'TRIAL_1_DAY' ? '1-Day Trial (1 Meal)' :
                      tiffinSuccess.planType === 'WEEKLY_6_DAYS' ? 'Weekly Pass (6 Meals)' :
                      tiffinSuccess.planType === 'MONTHLY_26_DAYS' ? 'Monthly Pass (26 Meals)' :
                      tiffinSuccess.planType
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-start text-xs pb-2 border-b border-bamboo-200">
                  <span className="text-forest-900/70 flex items-center gap-1.5 font-medium shrink-0">
                    <Building2 className="w-3.5 h-3.5 text-forest-700" />
                    Office Delivery:
                  </span>
                  <span className="font-medium text-forest-950 text-right max-w-xs truncate">
                    {tiffinSuccess.officeName ? `${tiffinSuccess.officeName}, ` : ''}{tiffinSuccess.deliveryAddress}, {tiffinSuccess.deliveryArea}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm font-serif font-black pt-1">
                  <span className="text-forest-950">Estimated Total:</span>
                  <span className="text-assamRed-700 text-lg font-bold">₹{tiffinSuccess.totalPrice}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/918133958961?text=${encodeURIComponent(
                    `Hello Dipali Barman & Darikana Kitchen team! I have booked the Daily Office Tiffin Service.\n\n` +
                    `📋 *Booking No:* ${tiffinSuccess.bookingNumber}\n` +
                    `👤 *Customer Name:* ${tiffinSuccess.customerName}\n` +
                    `📞 *Phone:* ${tiffinSuccess.contactNumber}\n` +
                    `🥗 *Dietary:* ${tiffinSuccess.isVegetarian ? 'Pure Vegetarian (Veg)' : 'Non-Vegetarian (Non-Veg)'}\n` +
                    `⏰ *Lunch Delivery Time:* ${tiffinSuccess.lunchTime}\n` +
                    `🏢 *Office Address:* ${tiffinSuccess.officeName ? tiffinSuccess.officeName + ', ' : ''}${tiffinSuccess.deliveryAddress} (${tiffinSuccess.deliveryArea})\n` +
                    `📅 *Plan:* ${tiffinSuccess.planType} (₹${tiffinSuccess.totalPrice})\n` +
                    `🗓️ *Start Date:* ${tiffinSuccess.startDate || 'Tomorrow'}\n` +
                    (tiffinSuccess.specialDietNotes ? `📝 *Notes:* ${tiffinSuccess.specialDietNotes}\n` : '') +
                    `\nPlease confirm my office tiffin schedule!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3.5 rounded-full text-xs transition-all shadow-md transform hover:-translate-y-0.5"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Instant WhatsApp Confirmation</span>
                </a>

                <button
                  onClick={handleClose}
                  className="w-full sm:w-auto bg-forest-900 hover:bg-forest-800 text-brass-300 font-bold px-7 py-3.5 rounded-full text-xs transition-all"
                >
                  Done / Back to Home
                </button>
              </div>

              <p className="text-[11px] text-forest-800/60 mt-4 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero hassle guarantee. Pause or cancel your tiffin anytime with a quick message.</span>
              </p>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-6 max-h-[80vh] overflow-y-auto">
              
              {/* Highlight Banner */}
              <div className="bg-gradient-to-r from-brass-100 via-riceCream-100 to-brass-100 p-3.5 rounded-2xl border border-brass-400/40 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brass-500 text-forest-950 flex items-center justify-center shrink-0 font-bold text-xs shadow-sm">
                  🔥
                </div>
                <p className="text-xs text-forest-950 leading-relaxed">
                  <strong className="text-assamRed-800 font-bold">Dipali Barman's Mud-Chulha Kitchen</strong> prepares healthy, light, homestyle office tiffins with pure mustard oil & local Assamese vegetables. No heavy restaurant grease.
                </p>
              </div>

              {/* 1. Customer Name & Contact Number */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-forest-950 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-brass-600" />
                  <span>1. Your Contact Details</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-forest-900 mb-1">
                      Customer Full Name <span className="text-assamRed-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Partha Sarathi Bora"
                        className="w-full bg-riceCream-50 border border-bamboo-300 rounded-xl px-3.5 py-2.5 text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-brass-500 focus:bg-white pl-9 transition-all"
                      />
                      <User className="w-4 h-4 text-bamboo-700 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-forest-900 mb-1">
                      Phone / WhatsApp Number <span className="text-assamRed-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        placeholder="10-digit mobile number"
                        className="w-full bg-riceCream-50 border border-bamboo-300 rounded-xl px-3.5 py-2.5 text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-brass-500 focus:bg-white pl-9 transition-all"
                      />
                      <Phone className="w-4 h-4 text-bamboo-700 absolute left-3 top-3" />
                    </div>
                    <p className="text-[10px] text-forest-700/60 mt-0.5">Used for delivery updates & daily menu sharing</p>
                  </div>
                </div>
              </div>

              {/* 2. Ask is Customer Vegetarian? */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-forest-950 flex items-center gap-2">
                    <UtensilsCrossed className="w-4 h-4 text-brass-600" />
                    <span>2. Dietary Preference (Are You Vegetarian?) <span className="text-assamRed-600">*</span></span>
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Vegetarian Card */}
                  <div
                    onClick={() => setIsVegetarian(true)}
                    className={`cursor-pointer rounded-2xl p-4 border-2 transition-all relative ${
                      isVegetarian
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-md ring-2 ring-emerald-500/20'
                        : 'border-bamboo-200 bg-white hover:border-bamboo-400 opacity-80'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md border-2 border-emerald-600 flex items-center justify-center p-0.5 bg-white">
                          <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
                        </div>
                        <span className="font-bold text-sm text-forest-950">Pure Vegetarian</span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        নিয়ামিষ
                      </span>
                    </div>
                    <p className="text-[11px] text-forest-900/80 leading-relaxed mb-2">
                      {Array.isArray(planInfo.vegIncludes) ? planInfo.vegIncludes.join(', ') : (planInfo.vegIncludes || 'Aromatic Joha Rice, Yellow/Mati Dal, Seasonal Sabji (Labra), Aloo or Khar Pitika, Paneer or Bilahi Tok, Fresh Salad & Assam Lemon.')}
                    </p>
                    <div className="text-[11px] font-bold text-emerald-700">
                      ₹{planInfo.vegPrice.toLocaleString('en-IN')} {planInfo.days > 1 ? `(₹${Math.round(planInfo.vegPrice / planInfo.days)}/meal)` : ''}
                    </div>
                  </div>

                  {/* Non-Vegetarian Card */}
                  <div
                    onClick={() => setIsVegetarian(false)}
                    className={`cursor-pointer rounded-2xl p-4 border-2 transition-all relative ${
                      !isVegetarian
                        ? 'border-assamRed-600 bg-assamRed-50/70 shadow-md ring-2 ring-assamRed-500/20'
                        : 'border-bamboo-200 bg-white hover:border-bamboo-400 opacity-80'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md border-2 border-assamRed-600 flex items-center justify-center p-0.5 bg-white">
                          <div className="w-3 h-3 rounded-full bg-assamRed-600"></div>
                        </div>
                        <span className="font-bold text-sm text-forest-950">Non-Vegetarian</span>
                      </div>
                      <span className="text-[11px] font-bold text-assamRed-800 bg-assamRed-100 px-2 py-0.5 rounded-full">
                        আমিষ
                      </span>
                    </div>
                    <p className="text-[11px] text-forest-900/80 leading-relaxed mb-2">
                      {Array.isArray(planInfo.nonVegIncludes) ? planInfo.nonVegIncludes.join(', ') : (planInfo.nonVegIncludes || 'Joha Rice, Dal, Mud-Chulha Local Fish Curry (Rohu/Borali) or Local Chicken Curry (rotating menu) + Seasonal Sabji, Pitika & Salad.')}
                    </p>
                    <div className="text-[11px] font-bold text-assamRed-700">
                      ₹{planInfo.nonVegPrice.toLocaleString('en-IN')} {planInfo.days > 1 ? `(₹${Math.round(planInfo.nonVegPrice / planInfo.days)}/meal)` : ''}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. When Need Lunch (Take Time) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-forest-950 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brass-600" />
                    <span>3. When Do You Need Lunch? (Select Time) <span className="text-assamRed-600">*</span></span>
                  </h4>
                  <span className="text-[10px] text-brass-700 font-semibold bg-brass-100 px-2 py-0.5 rounded-full">
                    Guaranteed Hot Delivery
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2.5">
                  {timeOptions.map((opt) => {
                    const isSelected = !isCustomTimeActive && lunchTime === opt.label;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => handleTimeSelect(opt.label)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'bg-forest-950 text-brass-300 border-forest-950 shadow-md font-bold'
                            : 'bg-riceCream-50 text-forest-900 border-bamboo-300 hover:bg-riceCream-100 font-medium'
                        }`}
                      >
                        <div className="text-xs sm:text-sm">{opt.label}</div>
                        <div className={`text-[10px] ${isSelected ? 'text-riceCream-300' : 'text-forest-700/60'}`}>
                          {opt.hint}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Time Selector */}
                <div className="flex items-center gap-2 bg-riceCream-50 p-2.5 rounded-xl border border-bamboo-200">
                  <label className="text-[11px] font-semibold text-forest-900 shrink-0">
                    Need different time?
                  </label>
                  <input
                    type="text"
                    value={customTime}
                    onChange={(e) => handleCustomTimeInput(e.target.value)}
                    placeholder="e.g. 12:45 PM or 2:15 PM"
                    className="flex-grow bg-white border border-bamboo-300 rounded-lg px-2.5 py-1 text-xs text-forest-950 focus:outline-none focus:ring-1 focus:ring-brass-500"
                  />
                  {isCustomTimeActive && customTime && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      Selected: {customTime}
                    </span>
                  )}
                </div>
              </div>

              {/* 4. Choose Subscription Plan */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-forest-950 mb-2.5 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brass-600" />
                  <span>4. Choose Subscription Plan</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {activeTiffinPlans.map((plan) => {
                    const isSelected = planType === plan.planKey || planType === plan.id;
                    const planPrice = isVegetarian ? plan.vegPrice : plan.nonVegPrice;
                    const perMeal = Math.round(planPrice / (plan.daysCount || 1));
                    return (
                      <div
                        key={plan.id}
                        onClick={() => setPlanType(plan.planKey || plan.id)}
                        className={`cursor-pointer rounded-2xl p-3 border-2 transition-all relative ${
                          isSelected
                            ? 'border-brass-600 bg-brass-50/60 shadow-md ring-2 ring-brass-500/20'
                            : 'border-bamboo-200 bg-white hover:border-bamboo-300'
                        }`}
                      >
                        {plan.badgeTag && (
                          <span className="absolute -top-2 right-2 bg-brass-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                            {plan.badgeTag}
                          </span>
                        )}
                        <div className="text-xs font-bold text-forest-950">{plan.name}</div>
                        <div className="text-[10px] text-forest-700/70 mb-2">
                          {plan.daysCount} Days {plan.daysCount > 1 ? `(${plan.daysCount} Meals)` : '(1 Meal)'}
                        </div>
                        <div className="text-base font-serif font-black text-assamRed-700">
                          ₹{planPrice.toLocaleString('en-IN')}
                        </div>
                        {plan.daysCount > 1 && (
                          <div className="text-[10px] text-emerald-700 font-semibold">
                            ₹{perMeal} / meal
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 5. Office Address & Locality */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-forest-950 mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-brass-600" />
                  <span>5. Office Location in Guwahati</span>
                </h4>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-forest-900 mb-1">
                        Office / Company Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={officeName}
                        onChange={(e) => setOfficeName(e.target.value)}
                        placeholder="e.g. SBI Regional Office / Assam Secretariat"
                        className="w-full bg-riceCream-50 border border-bamboo-300 rounded-xl px-3 py-2.5 text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-brass-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-forest-900 mb-1">
                        Guwahati Locality / Zone <span className="text-assamRed-600">*</span>
                      </label>
                      <select
                        value={deliveryArea}
                        onChange={(e) => setDeliveryArea(e.target.value)}
                        className="w-full bg-riceCream-50 border border-bamboo-300 rounded-xl px-3 py-2.5 text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-brass-500 focus:bg-white font-medium"
                      >
                        {serviceableAreaNames.map((area) => (
                          <option key={area} value={area}>
                            {area} (Serviceable)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-forest-900 mb-1">
                      Office Desk / Floor / Building Address <span className="text-assamRed-600">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="e.g. 3rd Floor, Cabin 304, Star Towers, GS Road, opposite Pantaloons"
                      className="w-full bg-riceCream-50 border border-bamboo-300 rounded-xl p-3 text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-brass-500 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-forest-900 mb-1">
                        Start From Date
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-riceCream-50 border border-bamboo-300 rounded-xl px-3 py-2 text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-brass-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-forest-900 mb-1">
                        Dietary Notes / Requests (Optional)
                      </label>
                      <input
                        type="text"
                        value={specialDietNotes}
                        onChange={(e) => setSpecialDietNotes(e.target.value)}
                        placeholder="e.g. Mild spice, no onion on Tue, extra lime"
                        className="w-full bg-riceCream-50 border border-bamboo-300 rounded-xl px-3 py-2 text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-brass-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Summary Bar */}
              <div className="p-4 rounded-2xl bg-forest-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-brass-500/40 shadow-xl">
                <div>
                  <div className="text-[11px] text-brass-400 font-semibold uppercase tracking-wider">
                    {planInfo.name} • {isVegetarian ? 'Pure Veg 🌱' : 'Non-Veg 🍗'}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-2xl font-bold text-white">₹{totalPrice}</span>
                    <span className="text-xs text-riceCream-300/70">
                      ({planInfo.days} {planInfo.days === 1 ? 'Meal' : 'Meals'} @ ~₹{pricePerMeal}/meal)
                    </span>
                  </div>
                  <div className="text-[10px] text-riceCream-300/80 mt-0.5">
                    Lunch delivered daily at <strong className="text-brass-300">{isCustomTimeActive ? (customTime || '1:00 PM') : lunchTime}</strong>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-8 py-3.5 rounded-full text-xs shadow-lg shadow-emerald-700/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Opening WhatsApp & Registering...</span>
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>CONFIRM & SEND ON WHATSAPP</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-forest-800/70 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  No long-term lock-in • Pause anytime
                </span>
                <span>Direct WhatsApp Support: <strong>+91 8133958961</strong></span>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};
