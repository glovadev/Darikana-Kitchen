import React from 'react';
import { Sparkles, Utensils, Sliders, Flame, Truck } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'CHOOSE YOUR FOOD',
    description: 'Explore signature Axomiya Bor-Thalis, delicate river fish Masor Tenga, or traditional duck curry.',
    icon: Utensils,
    tag: 'Authentic Menu'
  },
  {
    step: '02',
    title: 'CUSTOMIZE YOUR ORDER',
    description: 'Personalize your spice preference, add extra pitika, joha rice, or sweet clay-pot Mishti Doi.',
    icon: Sliders,
    tag: 'Your Preference'
  },
  {
    step: '03',
    title: 'WE COOK FRESH',
    description: 'Dipali Barman prepares each dish on natural firewood clay chulhas with stone-ground spices.',
    icon: Flame,
    tag: 'Firewood Chulha'
  },
  {
    step: '04',
    title: 'DELIVER TO YOUR DOOR',
    description: 'Lined in fresh banana leaves and sealed in food-grade eco containers, delivered steaming hot.',
    icon: Truck,
    tag: 'Eco-Insulated Delivery'
  }
];

export const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-riceCream-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-900 text-brass-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brass-400" />
            <span>Hassle-Free Cloud Kitchen</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-forest-950 tracking-tight mb-3">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-forest-900/70">
            From our village-style hearth to your dining table in four seamless steps.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-bamboo-200/80 shadow-md hover:shadow-rich transition-all duration-300 relative group flex flex-col justify-between"
              >
                {/* Step Number Watermark */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif text-4xl sm:text-5xl font-black text-forest-950/15 group-hover:text-assamRed-700/20 transition-colors">
                    {item.step}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-forest-950 text-brass-300 flex items-center justify-center shadow group-hover:scale-110 group-hover:bg-assamRed-700 group-hover:text-white transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-brass-700 block mb-1">
                    {item.tag}
                  </span>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-forest-950 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-forest-900/70 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom decorative bar */}
                <div className="mt-6 pt-3 border-t border-bamboo-100 flex items-center justify-between text-[11px] text-forest-900/50">
                  <span>Step {idx + 1} of 4</span>
                  <span className="text-brass-600 font-bold">→</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
