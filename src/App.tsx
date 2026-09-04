import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import { useState } from 'react';
import BookDemoModal from './components/BookDemoModal';

function Home() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 antialiased">
      <Navbar onBookDemo={() => setIsDemoOpen(true)} />
      <main>
        <Hero onBookDemo={() => setIsDemoOpen(true)} />
        <TrustSignals />
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demo" element={<DemoDeck />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        {/* Dynamic Tenant Routes */}
        <Route path="/rent-collection/:id" element={<RentCollection />} />
        <Route path="/onboarding/:id" element={<TenantOnboarding />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
