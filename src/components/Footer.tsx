import React from 'react';
import { Flame, MapPin, Phone, Mail, MessageCircle, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Footer: React.FC = () => {
  const { setActiveCategory, navigateTo, openTiffinBookingModal } = useCart();

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    navigateTo('menu');
  };

  return (
    <footer id="contact" className="bg-forest-950 text-white border-t border-brass-600/30 relative overflow-hidden">
      {/* Top Traditional Assamese Gamocha Pattern Border Strip */}
      <div className="gamocha-strip w-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-14">
          
          {/* Brand Column (Col 1-5) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-0.5 rounded-full ring-2 ring-brass-500 bg-riceCream-100 shadow-lg">
                <img
                  src="/images/darikana-logo.jpg"
                  alt="Darikana Kitchen"
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold tracking-tight text-white">
                  Darikana Kitchen
                </h3>
                <p className="text-xs text-brass-400 font-medium">
                  Traditional Assamese Thali • Firewood Chulha
                </p>
              </div>
            </div>

            <p className="text-sm font-serif italic text-brass-300">
              “Authentic food. Traditional soul.”
            </p>

            <p className="text-xs text-riceCream-300/80 leading-relaxed font-light">
              Founded by Dipali Barman, Darikana Kitchen is an authentic women-led home delivery kitchen dedicated to reviving traditional Assamese culinary methods, slow-cooked in earthen handis over open woodfire.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://www.instagram.com/darikana_kitchen?stkn=MTN3NnBxano1NjN0eQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-forest-900 border border-brass-500/40 flex items-center justify-center text-riceCream-200 hover:text-white hover:bg-brass-600 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.441-1.44z"/>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61594886156567"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-forest-900 border border-brass-500/40 flex items-center justify-center text-riceCream-200 hover:text-white hover:bg-brass-600 transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.597 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>
              <a
                href="https://wa.me/918133958961?text=Hello%20Darikana%20Kitchen!%20I%20would%20like%20to%20order%20authentic%20traditional%20food."
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-forest-900 border border-brass-500/40 flex items-center justify-center text-riceCream-200 hover:text-white hover:bg-emerald-600 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links (Col 5-7) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif font-bold text-sm tracking-wider uppercase text-brass-400">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-riceCream-300/90 font-medium">
              <li>
                <button onClick={() => navigateTo('home')} className="hover:text-brass-300 transition-colors text-left">Home</button>
              </li>
              <li>
                <button onClick={() => navigateTo('menu')} className="hover:text-brass-300 transition-colors text-left font-bold text-brass-300">Explore Full Menu →</button>
              </li>
              <li>
                <button onClick={() => openTiffinBookingModal()} className="hover:text-brass-300 transition-colors text-left font-bold text-emerald-400 flex items-center gap-1.5">
                  <span>🍱 Daily Office Tiffin</span>
                  <span className="text-[9px] bg-emerald-700 text-white px-1.5 py-0.2 rounded-full uppercase">Book</span>
                </button>
              </li>
              <li>
                <a href="#office-tiffin" onClick={() => navigateTo('home')} className="hover:text-brass-300 transition-colors">Tiffin Pricing Plans</a>
              </li>
              <li>
                <a href="#thalis" onClick={() => navigateTo('home')} className="hover:text-brass-300 transition-colors">Featured Thalis</a>
              </li>
              <li>
                <a href="#why-firewood" className="hover:text-brass-300 transition-colors">Why Firewood</a>
              </li>
              <li>
                <a href="#our-story" className="hover:text-brass-300 transition-colors">Our Founder's Story</a>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('admin')}
                  className="text-brass-400 hover:text-brass-200 transition-colors font-bold text-left flex items-center gap-1"
                >
                  <span>🔐 Dedicated Admin Page</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Categories (Col 7-9) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif font-bold text-sm tracking-wider uppercase text-brass-400">
              Kitchen Specialties
            </h4>
            <ul className="space-y-2 text-xs text-riceCream-300/90 font-medium">
              <li>
                <button
                  onClick={() => handleCategoryClick('ASSAMESE TRADITIONAL THALI')}
                  className="hover:text-brass-300 transition-colors text-left"
                >
                  Axomiya Bor-Thali & Ghorua Thali
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('BENGALI THALI')}
                  className="hover:text-brass-300 transition-colors text-left"
                >
                  Bangali Shorshe Ilish Thali
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('RICE & CURRY')}
                  className="hover:text-brass-300 transition-colors text-left"
                >
                  River Fish Masor Tenga & Duck Curry
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('VEGETARIAN')}
                  className="hover:text-brass-300 transition-colors text-left"
                >
                  Omita Khar & Dhekia Xaak
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('DESSERTS')}
                  className="hover:text-brass-300 transition-colors text-left"
                >
                  Axomiya Joha Chawlor Payox
                </button>
              </li>
            </ul>
          </div>

          {/* Kitchen Dispatch & Founder (Col 10-12) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif font-bold text-sm tracking-wider uppercase text-brass-400">
              Cloud Kitchen Dispatch
            </h4>
            
            <div className="space-y-2.5 text-xs text-riceCream-300/90">
              <div className="flex items-start gap-2.5">
                <Flame className="w-4 h-4 text-assamRed-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Founder & Master Chef</span>
                  <span>Dipali Barman</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brass-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Cloud Kitchen Hub</span>
                  <span>Dispur / Beltola Central Kitchen, Guwahati, Assam 781006</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-brass-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Direct Ordering Line</span>
                  <a 
                    href="tel:+918133958961" 
                    className="hover:text-brass-300 transition-colors font-medium text-white hover:underline"
                  >
                    +91 8133958961
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-brass-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Inquiries</span>
                  <span>order@darikanakitchen.com</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-forest-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-riceCream-300/60">
          <p>© 2026 Darikana Kitchen. All Rights Reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-assamRed-500 fill-assamRed-500" /> for the authentic culinary soul of Assam.
          </p>
        </div>
      </div>
    </footer>
  );
};
