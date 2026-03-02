import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustSignals from './components/TrustSignals';
import ProblemSection from './components/ProblemSection';
import SolutionSection from './components/SolutionSection';
import FeatureGrid from './components/FeatureGrid';
import OwnerFeatures from './components/OwnerFeatures';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import AppDownload from './components/AppDownload';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">
      <Navbar />
      <main>
        <Hero />
        <TrustSignals />
        <ProblemSection />
        <SolutionSection />
        <FeatureGrid />
        <OwnerFeatures />
        <Testimonials />
        <Pricing />
        <FAQ />
        <AppDownload />
        <Footer />
      </main>
    </div>
  );
}

export default App;
