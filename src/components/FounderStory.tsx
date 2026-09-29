import React from 'react';
import { Heart, Sparkles, Quote, Award } from 'lucide-react';

export const FounderStory: React.FC = () => {
  return (
    <section id="our-story" className="py-20 sm:py-28 bg-riceCream-50 relative overflow-hidden">
      {/* Decorative Traditional Gamocha red motif top border */}
      <div className="gamocha-strip w-full absolute top-0 left-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Founder Portrait with Handcrafted Frame */}
          <div className="lg:col-span-5 relative">
            {/* Traditional Assamese Woven Border Frame Accent */}
            <div className="relative mx-auto max-w-md">
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-assamRed-700 via-brass-500 to-forest-800 opacity-30 blur-sm transform -rotate-1"></div>
              
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-riceCream-200">
                <img
                  src="/images/dipali-barman.jpg"
                  alt="Dipali Barman - Founder of Darikana Kitchen"
                  className="w-full h-[500px] sm:h-[580px] object-cover object-[center_15%] hover:scale-103 transition-transform duration-700"
                />
                
                {/* Gradient Shadow */}
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent"></div>

                {/* Founder Name Card Overlay */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-forest-950/90 backdrop-blur-md border border-brass-500/40 text-white shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-xl font-bold text-white">Dipali Barman</h4>
                      <p className="text-xs text-brass-400 font-medium">Founder & Head Chef, Darikana Kitchen</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-brass-600/30 border border-brass-500/60 flex items-center justify-center text-brass-300">
                      <Heart className="w-5 h-5 fill-current text-assamRed-500" />
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-forest-800 text-[11px] text-riceCream-300 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-brass-400" />
                    <span>Women-Led Traditional Cloud Kitchen</span>
                  </div>
                </div>
              </div>

              {/* Decorative Floating Jaapi Badge in top right */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-2.5 shadow-xl border border-bamboo-300 hidden sm:block">
                <div className="text-center">
                  <span className="text-xl">🎋</span>
                  <span className="block text-[9px] font-black uppercase text-forest-950 tracking-tighter">100% Traditional</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Editorial Narrative Story */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-assamRed-100 text-assamRed-800 text-xs font-bold uppercase tracking-wider mb-4 border border-assamRed-200 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-assamRed-600" />
              <span>The Founder's Journey</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-forest-950 tracking-tight leading-tight mb-2">
              From Passion
            </h2>
            <h2 className="font-serif text-3xl sm:text-5xl font-extrabold brass-gradient-text tracking-tight leading-tight mb-6">
              To Your Plate.
            </h2>

            <div className="phulam-divider max-w-xs mb-8">
              <span className="text-assamRed-700 text-sm font-serif">✦ ❖ ✦</span>
            </div>

            {/* Narrative text exactly honoring user prompt */}
            <div className="space-y-4 text-forest-900/85 text-base sm:text-lg leading-relaxed font-normal">
              <p className="font-medium text-forest-950 text-xl font-serif">
                Darikana Kitchen began with a simple love for cooking.
              </p>
              
              <p>
                For <strong className="text-forest-950 font-semibold">Dipali Barman</strong>, cooking was never just a daily chore or routine activity. It was a lifelong passion — an intimate, sacred way to bring family and guests together through the honest warmth of authentic Assamese food.
              </p>

              <p>
                Growing up in the lush riverine lands of Assam, she learned the ancient nuances of open-hearth firewood cooking from her elders: how seasoned sal wood smoke lends a velvety depth to slow-simmered fish and duck curry, how freshly crushed mustard seeds bloom in clay pots, and how medicinal herbs like <em>Dhekia</em> and <em>Khar</em> restore vitality.
              </p>

              <p>
                That passion blossomed into <strong className="text-forest-950 font-semibold">Darikana Kitchen</strong> — a women-led culinary kitchen dedicated to preserving authentic cultural recipes in an era of industrial fast-food clones.
              </p>

              {/* Highlighted Quote Box */}
              <div className="relative bg-riceCream-200/80 rounded-2xl p-6 border-l-4 border-assamRed-700 mt-6 shadow-sm">
                <Quote className="w-8 h-8 text-assamRed-600/30 absolute top-4 right-4" />
                <p className="text-sm sm:text-base font-serif italic text-forest-950 leading-relaxed">
                  “Today, every meal we dispatch carries my love for traditional cooking, heirloom Assamese flavours, and the pure, unhurried joy of sharing good food with others.”
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="h-0.5 w-6 bg-assamRed-700"></span>
                  <span className="text-xs font-bold text-forest-900 uppercase tracking-wider">Dipali Barman</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
