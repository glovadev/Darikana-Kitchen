import React from 'react';
import { Star, Quote, CheckCircle2, Heart } from 'lucide-react';
import { TESTIMONIALS } from '../data/menuData';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-riceCream-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-900 text-brass-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Heart className="w-3.5 h-3.5 fill-current text-assamRed-500" />
            <span>Community Love</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-forest-950 tracking-tight mb-3">
            “Food that feels like home.”
          </h2>
          <p className="text-sm sm:text-base text-forest-900/70">
            Real stories and heartfelt impressions from patrons across Guwahati savoring traditional firewood cooking.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-7 sm:p-8 border border-bamboo-200 shadow-md hover:shadow-rich transition-all duration-300 relative flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Stars and Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-brass-500 fill-brass-500" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-brass-500/30" />
                </div>

                {/* Comment Text */}
                <p className="text-forest-950/85 text-sm sm:text-base leading-relaxed mb-6 font-normal italic">
                  "{item.comment}"
                </p>
              </div>

              {/* Author & Dish Ordered Info */}
              <div className="pt-4 border-t border-bamboo-100 flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-sm sm:text-base text-forest-950 flex items-center gap-1.5">
                    {item.name}
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                  </h4>
                  <span className="text-xs text-forest-900/60 block">{item.location}</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-brass-700 font-extrabold uppercase tracking-wide block">Ordered</span>
                  <span className="text-xs font-semibold text-forest-900 bg-riceCream-100 px-2 py-0.5 rounded-md border border-bamboo-200">
                    {item.dishOrdered}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
