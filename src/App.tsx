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

function App() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 antialiased">
      <Navbar />
      <main>
        <Hero />
        <TrustSignals />
        <ProblemSection />
        <SolutionSection />
        <MobileApp />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
