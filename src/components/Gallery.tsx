import React from 'react';
import { ExternalLink } from 'lucide-react';

const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={`${className} fill-current`} viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const GALLERY_PHOTOS = [
  {
    image: '/images/assamese-thali.jpg',
    title: 'Grand Axomiya Bor-Thali',
    caption: 'Arranged on polished Kanh bell-metal plates over organic banana leaf.'
  },
  {
    image: '/images/firewood-chulha.jpg',
    title: 'The Firewood Chulha',
    caption: 'Seasoned sal wood logs slow-cooking our ancestral duck curry.'
  },
  {
    image: '/images/dipali-barman.jpg',
    title: 'Dipali Barman, Founder',
    caption: 'Transforming a lifelong love for firewood cooking into an authentic culinary movement.'
  },
  {
    image: '/images/masor-tenga.jpg',
    title: 'River Rohu Masor Tenga',
    caption: 'Tangy river fish simmering with local tomatoes and elephant apple.'
  },
  {
    image: '/images/bengali-thali.jpg',
    title: 'Bengali Heritage Feast',
    caption: 'Fragrant Gobindobhog rice, luchi and slow-cooked mutton kosha.'
  },
  {
    image: '/images/assamese-culture.jpg',
    title: 'Assamese Heritage Symbols',
    caption: 'Jaapi, Phulam Gamocha, and the golden fragrance of Joha paddy.'
  }
];

export const Gallery: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-riceCream-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-900 text-brass-300 text-xs font-bold uppercase tracking-wider mb-3">
            <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
            <span>@darikanakitchen</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-forest-950 tracking-tight mb-3">
            Glimpses From Our Hearth
          </h2>
          <p className="text-sm sm:text-base text-forest-900/70">
            A visual documentation of daily rituals, honest firewood smoke, and authentic Assamese gastronomy.
          </p>
        </div>

        {/* Masonry-Style Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {GALLERY_PHOTOS.map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-rich transition-all duration-500 bg-forest-950 h-72 sm:h-80"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-90 group-hover:opacity-95 transition-opacity"></div>

              {/* Caption Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end transform translate-y-2 group-hover:translate-y-0 transition-transform">
                <span className="text-[10px] text-brass-400 font-extrabold uppercase tracking-widest block mb-1">
                  Behind the Chulha
                </span>
                <h4 className="font-serif text-lg font-bold text-white mb-1.5">
                  {item.title}
                </h4>
                <p className="text-xs text-riceCream-300 leading-relaxed line-clamp-2">
                  {item.caption}
                </p>
              </div>

              {/* Instagram Icon on hover in top right */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <InstagramIcon className="w-4 h-4 text-pink-300" />
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <a
            href="https://www.instagram.com/darikana_kitchen?stkn=MTN3NnBxano1NjN0eQ=="
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-forest-900 hover:bg-forest-800 text-brass-300 font-bold text-xs sm:text-sm px-7 py-3.5 rounded-full border border-brass-600/40 shadow-md hover:shadow-lg transition-all"
          >
            <InstagramIcon className="w-4 h-4 text-pink-400" />
            <span>FOLLOW OUR FOOD JOURNEY</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
          </a>
        </div>

      </div>
    </section>
  );
};
