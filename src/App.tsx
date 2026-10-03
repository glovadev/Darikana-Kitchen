import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FirewoodStory } from './components/FirewoodStory';
import { ThaliShowcase } from './components/ThaliShowcase';
import { FoodGrid } from './components/FoodGrid';
import { FounderStory } from './components/FounderStory';
import { CultureSection } from './components/CultureSection';
import { SpecialFirewoodVisual } from './components/SpecialFirewoodVisual';
import { OfficeTiffinSection } from './components/OfficeTiffinSection';
import { TiffinBookingModal } from './components/TiffinBookingModal';
import { HowItWorks } from './components/HowItWorks';
import { DeliveryExperience } from './components/DeliveryExperience';
import { Gallery } from './components/Gallery';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ThaliModal } from './components/ThaliModal';
import { MobileBottomBar } from './components/MobileBottomBar';
import { AdminPage } from './pages/AdminPage';
import { MenuPage } from './pages/MenuPage';
import { useCart } from './context/CartContext';

function MainAppContent() {
  const { currentRoute } = useCart();

  if (currentRoute === 'admin') {
    return <AdminPage />;
  }

  if (currentRoute === 'menu') {
    return (
      <>
        <MenuPage />
        <TiffinBookingModal />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-riceCream-100 text-forest-950 font-sans selection:bg-assamRed-700 selection:text-white flex flex-col pb-14 lg:pb-0">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <FirewoodStory />
        <OfficeTiffinSection />
        <ThaliShowcase />
        <FoodGrid />
        <FounderStory />
        <CultureSection />
        <SpecialFirewoodVisual />
        <HowItWorks />
        <DeliveryExperience />
        <Gallery />
      </main>
      <Footer />
      
      {/* Drawers and Modals */}
      <CartDrawer />
      <CheckoutModal />
      <ThaliModal />
      <TiffinBookingModal />
      <MobileBottomBar />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainAppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
