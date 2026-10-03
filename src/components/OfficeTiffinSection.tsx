import React, { useState } from 'react';
import { 
  Flame, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Leaf, 
  ShieldCheck, 
  ArrowRight, 
  MessageCircle, 
  Building2, 
  Calendar,
  UtensilsCrossed,
  HeartHandshake
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const OfficeTiffinSection: React.FC = () => {
  const { openTiffinBookingModal, tiffinPlans } = useCart();
  const [activePlanTab, setActivePlanTab] = useState<'veg' | 'nonveg'>('veg');

  return (
    <section id="office-tiffin" className="relative py-20 lg:py-28 bg-gradient-to-b from-riceCream-100 via-riceCream-200 to-riceCream-100 overflow-hidden">
      {/* Subtle traditional Assamese Gamusa woven motif strip */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-assamRed-700 via-brass-500 to-assamRed-700 opacity-60"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-900 text-brass-300 border border-brass-500/40 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-4 shadow-brass">
            <span className="text-base">🍱</span>
            <span>Daily Office Tiffin Services in Guwahati</span>
            <span className="w-1.5 h-1.5 rounded-full bg-assamRed-500 animate-pulse"></span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-black text-forest-950 tracking-tight leading-tight mb-4">
            Miss Mother’s Cooking at Work? <br />
            <span className="brass-gradient-text drop-shadow-sm">We Deliver Hot Tiffin to Your Office.</span>
          </h2>

          <p className="text-forest-900/80 text-sm sm:text-base leading-relaxed font-light">
            Say goodbye to oily restaurant canteen food and heavy afternoon lethargy. Dipali Barman prepares authentic, light, mud-chulha cooked Assamese home meals, packed hot in hygienic containers and delivered directly to your office desk daily across Guwahati.
          </p>
        </div>

        {/* Feature Grid: Hero Visual + Core USPs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16">
          
          {/* Left: Showcase Image with Rich Accents */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-brass-500/30 group">
              <img
                src="/images/office-tiffin.jpg"
                alt="Fresh Mud-Chulha Cooked Daily Office Tiffin Box Delivery in Guwahati"
                className="w-full h-[380px] sm:h-[460px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-black/20"></div>

              {/* Firewood Chulha Badge on Image */}
              <div className="absolute bottom-4 left-4 right-4 bg-forest-950/90 backdrop-blur-md p-4 rounded-2xl border border-brass-500/40 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-assamRed-700/80 border border-assamRed-500 flex items-center justify-center text-white shrink-0">
                    <Flame className="w-5 h-5 text-brass-300 fill-brass-300" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">100% Mud-Chulha Firewood Cooked</h4>
                    <p className="text-[11px] text-brass-300/80">Authentic smoky flavour & easy to digest</p>
                  </div>
                </div>

                <span className="hidden sm:inline-block bg-brass-500 text-forest-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                  Guwahati
                </span>
              </div>
            </div>

            {/* Floating Decorative Review Card */}
            <div className="absolute -top-4 -right-4 sm:-right-6 bg-white p-3.5 rounded-2xl shadow-xl border border-bamboo-300 max-w-[210px] hidden sm:block">
              <div className="flex items-center gap-1 text-brass-500 mb-1">
                {'★★★★★'}
              </div>
              <p className="text-[11px] text-forest-950 font-medium leading-snug">
                "Game changer for Dispur Secretariat staff. Pure Joha rice & light fish curry!"
              </p>
              <span className="text-[10px] text-forest-800/60 block mt-1 font-semibold">
                — Nabajit S., GS Road
              </span>
            </div>
          </div>

          {/* Right: Key Value Propositions */}
          <div className="lg:col-span-6 space-y-5">
            
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-bamboo-300 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-forest-800" />
              </div>
              <div>
                <h3 className="font-bold text-base text-forest-950 mb-1">
                  You Choose Your Exact Lunch Slot (12:30 PM - 2:00 PM)
                </h3>
                <p className="text-xs text-forest-900/70 leading-relaxed">
                  Never wait hungry. Select your office lunch hour and our dedicated delivery captains hand-deliver steaming hot tiffin directly to your office floor or reception.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-bamboo-300 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Leaf className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h3 className="font-bold text-base text-forest-950 mb-1">
                  Vegetarian & Non-Vegetarian Daily Options
                </h3>
                <p className="text-xs text-forest-900/70 leading-relaxed">
                  Choose between pure Satvik/Niramish veg tiffin (Yellow dal, seasonal Khar/Labra, Paneer, Pitika) or Non-veg tiffin (Firewood cooked local fish curry, chicken, or duck on rotating days).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-bamboo-300 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-brass-100 text-brass-800 flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6 text-brass-700" />
              </div>
              <div>
                <h3 className="font-bold text-base text-forest-950 mb-1">
                  Serving All Key Guwahati Office Hubs
                </h3>
                <p className="text-xs text-forest-900/70 leading-relaxed">
                  Daily active routes covering Dispur, Assam Secretariat, GS Road, Ganeshguri, Paltan Bazaar, Six Mile, Panbazar, Zoo Road, Khanapara, Bhangagarh, and Jalukbari.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-bamboo-300 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-assamRed-100 text-assamRed-800 flex items-center justify-center shrink-0">
                <HeartHandshake className="w-6 h-6 text-assamRed-700" />
              </div>
              <div>
                <h3 className="font-bold text-base text-forest-950 mb-1">
                  Zero Lock-in: 1-Day Trial, Weekly & Monthly Passes
                </h3>
                <p className="text-xs text-forest-900/70 leading-relaxed">
                  Start with a 1-day trial box to taste the quality first. Traveling on leave? Simply send a WhatsApp text to pause or resume your deliveries anytime.
                </p>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => openTiffinBookingModal({ planType: 'WEEKLY_6_DAYS' })}
                className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-brass-500 via-brass-400 to-brass-500 hover:from-brass-400 hover:to-brass-300 text-forest-950 font-extrabold px-8 py-4 rounded-full text-sm shadow-xl shadow-brass/30 transform hover:-translate-y-0.5 transition-all"
              >
                <span>BOOK TIFFIN SERVICE NOW</span>
                <ArrowRight className="w-4 h-4 text-forest-950" />
              </button>

              <a
                href={`https://wa.me/918133958961?text=${encodeURIComponent('Hello Dipali Barman & Darikana Kitchen team! I am interested in booking your Daily Office Tiffin Service in Guwahati. Please share more details.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-forest-950 hover:bg-forest-900 text-white font-semibold px-6 py-4 rounded-full text-sm border border-brass-500/40 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Enquire on WhatsApp</span>
              </a>
            </div>

          </div>

        </div>

        {/* Interactive Pricing & Plan Showcase Cards */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-bamboo-300 shadow-xl">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-bamboo-200">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-brass-700 block mb-1">
                Transparent Pricing • No Hidden Delivery Charges
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
                Choose Your Office Meal Plan
              </h3>
            </div>

            {/* Veg / Non-Veg Switcher */}
            <div className="inline-flex p-1 bg-riceCream-200 rounded-full border border-bamboo-300">
              <button
                onClick={() => setActivePlanTab('veg')}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activePlanTab === 'veg'
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'text-forest-900 hover:text-emerald-700'
                }`}
              >
                <Leaf className="w-3.5 h-3.5" />
                <span>Pure Vegetarian</span>
              </button>
              <button
                onClick={() => setActivePlanTab('nonveg')}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activePlanTab === 'nonveg'
                    ? 'bg-assamRed-700 text-white shadow-md'
                    : 'text-forest-900 hover:text-assamRed-700'
                }`}
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>Non-Vegetarian</span>
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid (Dynamic from Firestore / Admin) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiffinPlans.filter(p => p.isActive).map((plan) => {
              const currentPrice = activePlanTab === 'veg' ? plan.vegPrice : plan.nonVegPrice;
              const perMealPrice = plan.daysCount > 0 ? Math.round(currentPrice / plan.daysCount) : currentPrice;
              const inclusions = activePlanTab === 'veg' ? plan.vegIncludes : plan.nonVegIncludes;
              const isFeatured = plan.badgeTag?.toLowerCase().includes('popular') || plan.planKey === 'WEEKLY_6_DAYS';

              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl border-2 p-6 flex flex-col justify-between transition-all hover:shadow-xl relative ${
                    isFeatured
                      ? 'border-brass-500 bg-gradient-to-b from-brass-50/80 to-white shadow-lg ring-2 ring-brass-500/20'
                      : 'border-bamboo-200 hover:border-brass-400 bg-riceCream-50/50'
                  }`}
                >
                  {plan.badgeTag && (
                    <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-brass-600 to-assamRed-700 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      {plan.badgeTag}
                    </div>
                  )}

                  <div>
                    <div className="inline-block px-3 py-1 rounded-full bg-forest-900/10 text-forest-900 text-[11px] font-bold uppercase tracking-wider mb-3">
                      {plan.daysCount} {plan.daysCount === 1 ? 'Meal' : 'Meals'} ({plan.daysCount} Days)
                    </div>

                    <h4 className="font-serif text-xl font-bold text-forest-950 mb-1">
                      {plan.name}
                    </h4>

                    <p className="text-xs text-forest-900/70 mb-4 leading-relaxed">
                      {plan.description}
                    </p>

                    <div className="mb-6 pb-4 border-b border-bamboo-200">
                      <div className="flex items-baseline gap-1.5">
                        <span className={`font-serif text-3xl font-black ${isFeatured ? 'text-assamRed-700' : 'text-forest-950'}`}>
                          ₹{currentPrice}
                        </span>
                        <span className="text-xs text-forest-700/60 font-medium">
                          / {plan.daysCount} {plan.daysCount === 1 ? 'meal' : 'meals'}
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-700 font-bold block mt-1">
                        ~₹{perMealPrice} per meal • Free desk delivery
                      </span>
                    </div>

                    {/* Meal Inclusions List */}
                    <div className="mb-6">
                      <span className="text-[10px] uppercase font-bold text-forest-900/60 tracking-wider block mb-2">
                        {activePlanTab === 'veg' ? '🌱 Vegetarian Thali Contains:' : '🍗 Non-Vegetarian Thali Contains:'}
                      </span>
                      <ul className="space-y-2 text-xs text-forest-950/80">
                        {inclusions && inclusions.map((inc, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Additional Perks */}
                    {plan.perks && plan.perks.length > 0 && (
                      <div className="mb-6 pt-3 border-t border-bamboo-200">
                        <span className="text-[10px] uppercase font-bold text-forest-900/60 tracking-wider block mb-1.5">
                          Subscription Perks:
                        </span>
                        <ul className="space-y-1.5 text-[11px] text-forest-900/70">
                          {plan.perks.map((perk, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <Sparkles className="w-3 h-3 text-brass-600 shrink-0" />
                              <span>{perk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => openTiffinBookingModal({ planType: plan.planKey, isVeg: activePlanTab === 'veg' })}
                    className={`w-full font-bold py-3.5 rounded-xl text-xs transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-md ${
                      isFeatured
                        ? 'bg-gradient-to-r from-brass-500 to-brass-400 hover:from-brass-400 hover:to-brass-300 text-forest-950 font-extrabold'
                        : 'bg-forest-950 hover:bg-forest-900 text-brass-300'
                    }`}
                  >
                    Book {plan.name} (₹{currentPrice})
                  </button>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
