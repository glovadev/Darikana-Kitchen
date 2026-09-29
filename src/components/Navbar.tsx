import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X, Flame, MapPin, Shield, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Navbar: React.FC = () => {
  const { totalItems, setIsCartOpen, setIsCheckoutOpen, searchQuery, setSearchQuery, navigateTo, currentRoute } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero', isMenu: false },
    { name: 'Menu', href: '/menu', isMenu: true },
    { name: 'Why Firewood', href: '#why-firewood', isMenu: false },
    { name: 'Our Story', href: '#our-story', isMenu: false },
    { name: 'Assam Heritage', href: '#culture', isMenu: false },
    { name: 'Contact', href: '#contact', isMenu: false },
  ];

  const handleNavLinkClick = (e: React.MouseEvent, link: typeof navLinks[0]) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (link.isMenu) {
      navigateTo('menu');
      return;
    }
    if (currentRoute !== 'home') {
      navigateTo('home');
      setTimeout(() => {
        const id = link.href.replace('#', '');
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    const id = link.href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOrderNow = () => {
    navigateTo('menu');
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-forest-950/95 backdrop-blur-md shadow-2xl py-2.5 border-b border-brass-600/30 text-white'
            : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-4 text-white'
        }`}
      >
        {/* Top traditional Assamese gamocha red woven accent border */}
        <div className="gamocha-strip w-full absolute top-0 left-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo - EXACT Logo Asset */}
          <a href="#hero" className="flex items-center gap-3 group">
            <div className="relative overflow-hidden rounded-full ring-2 ring-brass-500/70 p-0.5 bg-riceCream-100 shadow-md group-hover:scale-105 transition-transform duration-300">
              <img
                src="/images/darikana-logo.jpg"
                alt="Darikana Kitchen Logo"
                className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-full"
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Darikana Kitchen
                <span className="inline-block w-2 h-2 rounded-full bg-assamRed-500 animate-pulse"></span>
              </span>
              <span className="text-[10px] sm:text-xs tracking-widest text-brass-400 uppercase font-medium">
                Traditional Assamese Thali • Chulha Cooked
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = (link.isMenu && currentRoute === 'menu') || (link.name === 'Home' && currentRoute === 'home');
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavLinkClick(e, link)}
                  className={`text-sm tracking-wide transition-colors relative py-1 ${
                    isActive 
                      ? 'text-brass-300 font-bold after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-brass-400' 
                      : 'font-medium text-riceCream-200 hover:text-brass-400 after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-brass-500 hover:after:w-full after:transition-all after:duration-300'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Right Action Icons & CTA */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Live Search Toggle */}
            <div className="relative flex items-center">
              {showSearchInput ? (
                <div className="flex items-center bg-forest-900/90 border border-brass-600/50 rounded-full px-3 py-1 shadow-inner animate-fadeIn">
                  <Search className="w-4 h-4 text-brass-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search thali, duck, fish..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="bg-transparent text-xs text-white placeholder-riceCream-300/60 focus:outline-none w-32 sm:w-44"
                  />
                  <button
                    onClick={() => {
                      setShowSearchInput(false);
                      setSearchQuery('');
                    }}
                    className="text-riceCream-300 hover:text-white ml-1 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSearchInput(true)}
                  className="p-2 rounded-full hover:bg-white/10 text-riceCream-200 hover:text-brass-400 transition-colors"
                  aria-label="Search food"
                  title="Search dishes"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Cart Button with Count Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full hover:bg-white/10 text-riceCream-200 hover:text-brass-400 transition-colors"
              aria-label="Open Cart"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-assamRed-600 text-white font-bold text-xs rounded-full w-5 h-5 flex items-center justify-center border-2 border-forest-950 animate-bounce">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Admin Portal Button */}
            <button
              onClick={() => navigateTo('admin')}
              className="p-2 rounded-full hover:bg-white/10 text-riceCream-300 hover:text-brass-300 transition-colors flex items-center gap-1.5"
              title="Dedicated Kitchen Admin Page (Firebase & Cloudinary)"
            >
              <Shield className="w-5 h-5 text-brass-400" />
              <span className="hidden xl:inline text-xs font-semibold text-brass-300">Admin</span>
            </button>

            {/* Primary Order Now Button */}
            <button
              onClick={handleOrderNow}
              className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-brass-600 via-brass-500 to-brass-600 hover:from-brass-500 hover:to-brass-400 text-forest-950 font-bold text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-brass hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Flame className="w-4 h-4 text-assamRed-700 fill-assamRed-700" />
              <span>ORDER NOW</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-riceCream-200 hover:text-brass-400 hover:bg-white/10 focus:outline-none"
              aria-label="Open menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 w-4/5 max-w-sm h-full bg-forest-950 border-l border-brass-600/30 text-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-6 border-b border-forest-800">
                <div className="flex items-center gap-3">
                  <img
                    src="/images/darikana-logo.jpg"
                    alt="Darikana Kitchen"
                    className="w-10 h-10 rounded-full ring-2 ring-brass-500 object-cover"
                  />
                  <div>
                    <h3 className="font-serif font-bold text-base text-white">Darikana Kitchen</h3>
                    <p className="text-[10px] text-brass-400">Traditional Assamese Thali</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-full text-riceCream-300 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Links */}
              <div className="flex flex-col gap-4 mt-6">
                {navLinks.map((link) => {
                  const isActive = (link.isMenu && currentRoute === 'menu') || (link.name === 'Home' && currentRoute === 'home');
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleNavLinkClick(e, link)}
                      className={`text-base py-2 border-b border-forest-900/60 flex items-center justify-between transition-colors ${
                        isActive 
                          ? 'text-brass-300 font-bold' 
                          : 'font-medium text-riceCream-200 hover:text-brass-400'
                      }`}
                    >
                      <span>{link.name}</span>
                      <span className="text-xs text-brass-500/60">→</span>
                    </a>
                  );
                })}
              </div>

              {/* Location Badge */}
              <div className="mt-6 p-3 rounded-lg bg-forest-900/80 border border-brass-600/20 text-xs text-riceCream-300 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-assamRed-500 shrink-0" />
                <span>Delivering across Guwahati (Dispur, Beltola, Zoo Rd, Uzan Bazar)</span>
              </div>

              {/* Direct Call & WhatsApp Contact */}
              <div className="mt-4 p-3 rounded-xl bg-forest-900/60 border border-brass-600/30 text-xs">
                <span className="text-[10px] text-brass-400 font-bold uppercase tracking-wider block mb-2">Direct Kitchen Hotline</span>
                <div className="flex items-center justify-between gap-2">
                  <a
                    href="tel:+918133958961"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-forest-800 hover:bg-forest-750 text-white font-bold py-2 px-3 rounded-lg border border-brass-500/30 text-[11px]"
                  >
                    <Phone className="w-3.5 h-3.5 text-brass-400" />
                    <span>+91 8133958961</span>
                  </a>
                  <a
                    href="https://wa.me/918133958961?text=Hello%20Darikana%20Kitchen!%20I%20would%20like%20to%20place%20an%20order."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-2 px-3 rounded-lg text-[11px]"
                  >
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Mobile Drawer Bottom CTA */}
            <div className="pt-6 border-t border-forest-800 space-y-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigateTo('admin');
                }}
                className="w-full flex items-center justify-center gap-2 bg-forest-900 hover:bg-forest-850 text-brass-300 font-bold py-2.5 rounded-xl border border-brass-500/40 text-xs"
              >
                <Shield className="w-4 h-4 text-brass-400" />
                <span>KITCHEN ADMIN PORTAL</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleOrderNow();
                }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brass-600 to-brass-500 text-forest-950 font-bold py-3 rounded-xl shadow-brass"
              >
                <Flame className="w-5 h-5 text-assamRed-700 fill-assamRed-700" />
                <span>ORDER NOW</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
