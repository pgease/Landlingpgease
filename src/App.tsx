import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustSignals from './components/TrustSignals';
import OwnerFeatures from './components/OwnerFeatures';
import TenantFeatures from './components/TenantFeatures';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import AppDownload from './components/AppDownload';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <TrustSignals />
      <OwnerFeatures />
      <TenantFeatures />
      <Pricing />
      <Testimonials />
      <AppDownload />
      <Footer />
    </div>
  );
}

export default App;
