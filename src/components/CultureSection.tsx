import React from 'react';
import { Sparkles } from 'lucide-react';

const CULTURE_CARDS = [
  {
    title: 'GAMOCHA',
    assamese: 'গামোচা',
    subtitle: 'An unmistakable symbol of Assamese culture.',
    description: 'Woven with pristine white cotton and vibrant red floral Phulam borders, the Gamocha represents reverence, hospitality, and pride presented to every honored guest before meals.',
    icon: '🧣'
  },
  {
    title: 'JAAPI',
    assamese: 'জাপি',
    subtitle: 'A timeless symbol of Assam.',
    description: 'Handcrafted with tightly woven bamboo, cane, and large dried palm leaves (tokow paat), the Jaapi sheltered farmers in lush paddy fields and stands today as a crown of dignity.',
    icon: '🎋'
  },
  {
    title: 'BAMBOO',
    assamese: 'বাঁহ',
    subtitle: 'Nature woven into everyday Assamese life.',
    description: 'From kitchen tools, steamers (chunga), and thatched rooftops to tender edible shoots (khorisa), bamboo is woven inextricably into our food and architecture.',
    icon: '🎍'
  },
  {
    title: 'BELL-METAL (KANH)',
    assamese: 'কাঁহৰ বাচন',
    subtitle: 'Heirloom plates that elevate dining into ritual.',
    description: 'Cast in the historic artisan town of Sarthebari, traditional Kanh bell-metal plates and brass katoris naturally temper the food and maintain radiant warmth.',
    icon: '✨'
  },
  {
    title: 'JOHA RICE',
    assamese: 'জোহা চাউল',
    subtitle: 'Nature\'s aromatic heirloom grain.',
    description: 'Celebrated for its distinct sweet popcorn-like natural aroma and delicate short grains, Joha rice grown along the Brahmaputra floodplain is the crown jewel of our thali.',
    icon: '🌾'
  },
  {
    title: 'FOOD & HEARTH',
    assamese: 'পৰম্পৰাগত ৰন্ধনশৈলী',
    subtitle: 'Recipes passed through generations.',
    description: 'Cooking on clay chulhas using earthen handis, cold-pressed virgin mustard oil, and wholesome river fish — food that rejuvenates the body and soothes the spirit.',
    icon: '🍲'
  }
];

export const CultureSection: React.FC = () => {
  return (
    <section id="culture" className="py-20 sm:py-28 bg-forest-950 text-white relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 dark-hearth-pattern opacity-40 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-900 border border-brass-500/40 text-brass-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brass-400" />
            <span>Living Traditions</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
            A Taste of Assam
          </h2>
          <p className="text-sm sm:text-base text-riceCream-300 max-w-xl mx-auto">
            Beyond sustenance, every plate at Darikana Kitchen is an ode to the living heritage, craftsmanship, and rich fertile terroir of the Brahmaputra Valley.
          </p>
        </div>

        {/* Featured Cultural Still-Life Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-12 shadow-2xl border border-brass-600/30 group">
          <img
            src="/images/assamese-culture.jpg"
            alt="Traditional Assamese Jaapi, Gamocha, Bell-metal Xorai and golden Joha rice paddy sheaves"
            className="w-full h-64 sm:h-96 object-cover object-center group-hover:scale-103 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/40 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-brass-400 block mb-1">
                Authentic Materiality
              </span>
              <h3 className="font-serif text-xl sm:text-3xl font-extrabold text-white">
                Jaapi, Gamocha, Sarthebari Bell-Metal & Joha Rice
              </h3>
            </div>
            <span className="bg-forest-900/80 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-semibold text-riceCream-200 border border-brass-500/40">
              Heritage Culinary Philosophy
            </span>
          </div>
        </div>

        {/* Horizontal Card Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CULTURE_CARDS.map((card, idx) => (
            <div
              key={idx}
              className="bg-forest-900/70 border border-brass-600/20 rounded-2xl p-6 hover:border-brass-500/60 hover:bg-forest-900 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl p-2 bg-forest-950/60 rounded-xl border border-brass-600/20 group-hover:scale-110 transition-transform">
                    {card.icon}
                  </span>
                  <span className="font-accent text-xs text-brass-400 font-semibold">
                    {card.assamese}
                  </span>
                </div>

                <h4 className="font-serif text-lg font-bold text-white group-hover:text-brass-300 transition-colors mb-1">
                  {card.title}
                </h4>
                <p className="text-xs text-brass-400/90 font-medium italic mb-2.5">
                  "{card.subtitle}"
                </p>
                <p className="text-xs text-riceCream-300 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-forest-800 flex items-center justify-between text-[11px] text-riceCream-400">
                <span>Darikana Heritage</span>
                <span className="text-brass-400 font-bold">✦</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
