import React, { useState } from 'react';
import { Flame, Sparkles, Heart, UtensilsCrossed, CheckCircle2, ShieldAlert } from 'lucide-react';

export const FirewoodStory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'firewood' | 'commercial'>('firewood');

  return (
    <section id="why-firewood" className="py-20 sm:py-28 bg-riceCream-100 relative overflow-hidden">
      {/* Decorative Traditional Gamocha red motif pattern along side */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-assamRed-100 text-assamRed-800 text-xs font-bold uppercase tracking-wider mb-4 border border-assamRed-200">
            <Flame className="w-3.5 h-3.5 fill-assamRed-600 text-assamRed-600" />
            <span>The Heart of Our Kitchen</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-forest-950 tracking-tight leading-tight mb-4">
            Why Darikana Tastes Different
          </h2>
          <p className="font-serif italic text-xl sm:text-2xl text-assamRed-700 font-semibold mb-6">
            “Not Gas. Not Factory Cooking. Just Traditional Firewood.”
          </p>
          <div className="phulam-divider max-w-xs mx-auto mb-6">
            <span className="text-brass-600 text-sm font-serif">✦ ❖ ✦</span>
          </div>
          <p className="text-forest-900/80 text-base sm:text-lg leading-relaxed font-normal">
            At Darikana Kitchen, we believe food should carry the aroma, warmth, and soul of traditional cooking. Our dishes are prepared using natural firewood on earthen mud chulhas instead of commercial LPG gas, bringing an authentic smoky aroma and deep, slow-cooked caramelization to every single bite.
          </p>
        </div>

        {/* Interactive Firewood vs Commercial Gas Cooking Card Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-6 sm:p-10 shadow-rich border border-bamboo-200/80">
          
          {/* Left Column: Visual of Burning Hearth */}
          <div className="lg:col-span-6 relative rounded-2xl overflow-hidden shadow-2xl group">
            <img
              src="/images/firewood-chulha.jpg"
              alt="Traditional Chulha with burning firewood and earthen handi"
              className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            {/* Live Heat Overlay Badge */}
            <div className="absolute top-4 left-4 bg-forest-950/80 backdrop-blur-md border border-brass-500/50 px-3.5 py-1.5 rounded-full flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-assamRed-500 animate-ping"></span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">Slow Woodfire Cooking</span>
            </div>

            {/* Quote Pill */}
            <div className="absolute bottom-4 left-4 right-4 bg-forest-950/90 backdrop-blur-md border border-brass-600/30 p-4 rounded-xl text-left">
              <p className="text-xs sm:text-sm text-riceCream-100 italic">
                “When you cook duck or fish over slow-burning sal wood in clay pots, the spices infuse deeply into the bone. You cannot fake this on a high-pressure gas stove.”
              </p>
              <span className="block text-right text-[11px] text-brass-400 font-bold mt-1.5">— Dipali Barman</span>
            </div>
          </div>

          {/* Right Column: Comparative Feature Highlights */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <div className="flex rounded-xl bg-riceCream-200/70 p-1.5 max-w-sm">
              <button
                onClick={() => setActiveTab('firewood')}
                className={`flex-1 py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                  activeTab === 'firewood'
                    ? 'bg-forest-900 text-white shadow-md'
                    : 'text-forest-800 hover:text-forest-950'
                }`}
              >
                🔥 Traditional Firewood
              </button>
              <button
                onClick={() => setActiveTab('commercial')}
                className={`flex-1 py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                  activeTab === 'commercial'
                    ? 'bg-assamRed-800 text-white shadow-md'
                    : 'text-forest-800 hover:text-forest-950'
                }`}
              >
                ⚡ Commercial LPG Cooking
              </button>
            </div>

            {activeTab === 'firewood' ? (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-l-4 border-brass-500 pl-4 py-1">
                  <h4 className="font-serif font-bold text-lg text-forest-950 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-assamRed-600 fill-assamRed-600" />
                    Natural Firewood & Clay Chulha
                  </h4>
                  <p className="text-sm text-forest-800/80 mt-1">
                    Seasoned natural wood logs burn steadily, producing a subtle, unforgettable natural wood smoke that permeates the lentils, fish, and duck curry.
                  </p>
                </div>

                <div className="border-l-4 border-brass-500 pl-4 py-1">
                  <h4 className="font-serif font-bold text-lg text-forest-950 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-brass-600" />
                    Patience & Slow Traditional Cooking
                  </h4>
                  <p className="text-sm text-forest-800/80 mt-1">
                    Unlike rushing on high flame burners, our curries simmer unhurriedly in heavy earthen handis and thick brass kadai for up to 3 hours.
                  </p>
                </div>

                <div className="border-l-4 border-brass-500 pl-4 py-1">
                  <h4 className="font-serif font-bold text-lg text-forest-950 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-assamRed-600" />
                    True Homemade Taste & Pure Ingredients
                  </h4>
                  <p className="text-sm text-forest-800/80 mt-1">
                    Hand-ground spices on stone sil-nora, virgin mustard oil, fresh river fish, and wild greens collected fresh every morning.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap gap-2 text-xs font-bold">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-900 border border-forest-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" /> Zero Industrial Additives
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-900 border border-forest-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" /> Pure Cold-Pressed Mustard Oil
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-900 border border-forest-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" /> Earthen & Brass Vessels
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-l-4 border-assamRed-400 pl-4 py-1 bg-assamRed-50/50 rounded-r-xl pr-3">
                  <h4 className="font-serif font-bold text-lg text-forest-950 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-assamRed-600" />
                    Commercial High-Pressure Burners
                  </h4>
                  <p className="text-sm text-forest-800/80 mt-1">
                    Fast food and industrial cloud kitchens rely on blast burners to flash-cook curries in under 5 minutes, leaving ingredients without depth of soul.
                  </p>
                </div>

                <div className="border-l-4 border-assamRed-400 pl-4 py-1 bg-assamRed-50/50 rounded-r-xl pr-3">
                  <h4 className="font-serif font-bold text-lg text-forest-950 flex items-center gap-2">
                    <UtensilsCrossed className="w-5 h-5 text-assamRed-600" />
                    Pre-Made Base Gravies & Frozen Stock
                  </h4>
                  <p className="text-sm text-forest-800/80 mt-1">
                    Commercial kitchens often store onion-tomato gravy bases in freezers for days. At Darikana, Dipali Barman starts fresh every single dawn.
                  </p>
                </div>

                <p className="text-xs text-forest-800/70 italic pt-2">
                  * That is why Darikana Kitchen will never be an industrial fast-food chain. We are an authentic home kitchen preserving sacred culinary heritage.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
