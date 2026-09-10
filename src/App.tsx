import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustSignals from './components/TrustSignals';
import ProblemSection from './components/ProblemSection';
import SolutionSection from './components/SolutionSection';
import MobileApp from './components/MobileApp';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import PrivacyPolicy from './components/PrivacyPolicy';
import Terms from './components/Terms';
import RefundPolicy from './components/RefundPolicy';
import RentCollection from './components/RentCollection';
import TenantOnboarding from './components/TenantOnboarding';
import DemoDeck from './components/DemoDeck';
import BookDemoModal from './components/BookDemoModal';

import FeaturedPropertiesSection from './components/FeaturedPropertiesSection';

// New Pages
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import PropertySearch from './pages/PropertySearch';
import PropertyDetails from './pages/PropertyDetails';
import ListYourProperty from './pages/ListYourProperty';
import Careers from './pages/Careers';

// Helper component to scroll to top on route navigation
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function Home() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 antialiased">
      <Navbar onBookDemo={() => setIsDemoOpen(true)} />
      <main>
        <Hero onBookDemo={() => setIsDemoOpen(true)} />
        <TrustSignals />
        <FeaturedPropertiesSection />
        <ProblemSection />
        <SolutionSection />
        <MobileApp />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <FinalCTA onBookDemo={() => setIsDemoOpen(true)} />
      </main>
      <Footer />
      <BookDemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </div>
  );
}

import { WishlistProvider } from './context/WishlistContext';

function App() {
  return (
    <BrowserRouter>
      <WishlistProvider>
        <ScrollToTop />
        <Routes>
        {/* Main Landing */}
        <Route path="/" element={<Home />} />

        {/* Blog System */}
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />

        {/* PG Search App & Property Details */}
        <Route path="/find-properties" element={<PropertySearch />} />
        <Route path="/properties" element={<PropertySearch />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />

        {/* Property Onboarding Form */}
        <Route path="/list-your-property" element={<ListYourProperty />} />

        {/* Careers / Hiring */}
        <Route path="/careers" element={<Careers />} />
        <Route path="/hiring" element={<Careers />} />

        {/* Static & Legal */}
        <Route path="/demo" element={<DemoDeck />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />

        {/* Dynamic Tenant Routes */}
        <Route path="/rent-collection/:id" element={<RentCollection />} />
        <Route path="/onboarding/:id" element={<TenantOnboarding />} />
      </Routes>
      </WishlistProvider>
    </BrowserRouter>
  );
}

export default App;
