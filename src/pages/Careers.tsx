import { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowDown,
  Target,
  Zap,
  Rocket,
  TrendingUp,
  HeartHandshake,
  CheckCircle2,
  MapPin,
  Building2,
  Users,
  BookOpen,
  Briefcase,
  Compass,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookDemoModal from '../components/BookDemoModal';

const COMPANY_STATS = [
  {
    icon: MapPin,
    label: 'Location',
    value: 'Noida / Delhi NCR, India',
  },
  {
    icon: Building2,
    label: 'Industry',
    value: 'PropTech SaaS',
  },
  {
    icon: Rocket,
    label: 'Company Stage',
    value: 'Early-stage startup',
  },
  {
    icon: Users,
    label: 'Work Environment',
    value: 'Fast-moving & Collaborative',
  },
];

const WHY_POINTS = [
  {
    icon: Target,
    title: 'Real-world impact',
    description:
      'Build products that solve problems for real businesses and their customers across India.',
  },
  {
    icon: Zap,
    title: 'Ownership',
    description:
      'Take responsibility for your work and see your ideas turn into working products.',
  },
  {
    icon: BookOpen,
    title: 'Learn by doing',
    description:
      'Get hands-on exposure to product, technology, sales, operations and startup building.',
  },
  {
    icon: Users,
    title: 'Work closely with the founders',
    description:
      'Contribute directly to important decisions, product roadmaps, and key initiatives.',
  },
  {
    icon: TrendingUp,
    title: 'Grow with us',
    description:
      'As PG Ease expands to more cities, there will be opportunities to take on greater responsibility.',
  },
];

const CORE_VALUES = [
  'Ownership',
  'Speed',
  'Customer Understanding',
  'Continuous Learning',
];

export default function Careers() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  // Dynamic SEO title & meta description management
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Careers at PG Ease | Join Our Team';

    let metaDesc = document.querySelector('meta[name="description"]');
    const originalDesc = metaDesc ? metaDesc.getAttribute('content') : '';

    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Explore career opportunities at PG Ease and join our team building simple technology for PG owners and tenants across India.'
      );
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      metaDesc.setAttribute(
        'content',
        'Explore career opportunities at PG Ease and join our team building simple technology for PG owners and tenants across India.'
      );
      document.head.appendChild(metaDesc);
    }

    return () => {
      document.title = originalTitle;
      if (metaDesc && originalDesc) {
        metaDesc.setAttribute('content', originalDesc);
      }
    };
  }, []);

  const scrollToPositions = () => {
    const element = document.getElementById('open-positions');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col antialiased">
      {/* Top Navigation */}
      <Navbar onBookDemo={() => setIsDemoOpen(true)} />

      <main className="flex-1">
        {/* 1. HERO SECTION */}
        <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-20 bg-white border-b border-slate-100 overflow-hidden">
          {/* Subtle background glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-brand-50/70 rounded-full blur-3xl pointer-events-none -z-0"
            aria-hidden="true"
          />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              CAREERS AT PG EASE
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6 text-balance">
              Build the future of PG management with us.
            </h1>

            {/* Subheading */}
            <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8 text-balance">
              We're building simple, practical technology that helps PG owners and tenants manage everyday PG operations with ease. Join us and help build a product used by real businesses across India.
            </p>

            {/* Primary CTA */}
            <div className="flex justify-center mb-12">
              <button
                type="button"
                onClick={scrollToPositions}
                className="inline-flex items-center gap-2 bg-brand-600 text-white px-7 py-3.5 rounded-xl text-base font-semibold hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/20 hover:shadow-xl hover:shadow-brand-600/30 active:scale-[0.99] cursor-pointer"
              >
                View Open Positions
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </button>
            </div>

            {/* Company Overview Quick Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
              {COMPANY_STATS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="p-3.5 sm:p-4 bg-slate-50/80 rounded-xl border border-slate-200/70 flex items-center gap-3"
                  >
                    <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">
                        {item.label}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-800 truncate block">
                        {item.value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 2. ABOUT PG EASE (Company Description) */}
        <section className="py-16 sm:py-20 bg-slate-50/60 border-b border-slate-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8 sm:p-12 relative overflow-hidden">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider mb-4">
                  <Compass className="w-3.5 h-3.5 text-brand-600" />
                  Our Mission
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
                  Making PG &amp; rental operations effortless
                </h2>
                <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-4">
                  PG Ease is building simple, practical technology for India’s PG and rental accommodation ecosystem.
                </p>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
                  We help PG owners and operators manage their day-to-day operations more easily — from tenants, rooms and beds to rent tracking, payments, KYC, complaints, staff, communication and more. At the same time, we’re building tools that make everyday living and communication simpler for tenants.
                </p>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  We’re an early-stage startup focused on solving real problems faced by PG owners and tenants. Our approach is simple: understand the problem, build useful technology, listen to our customers, and keep improving.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. WHY JOIN PG EASE */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Why join PG Ease?
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2">
              A high-ownership startup environment where your contribution directly shapes the product.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_POINTS.map((point) => {
              const Icon = point.icon;
              return (
                <div
                  key={point.title}
                  className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:border-brand-300 hover:shadow-md transition-all flex flex-col"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-5 shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 mb-2">
                    {point.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {point.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. LIFE AT PG EASE & CULTURE */}
        <section className="py-16 bg-white border-y border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 mb-3">
              <HeartHandshake className="w-4 h-4 text-brand-600" />
              Our Culture &amp; Values
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Life at PG Ease
            </h2>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6 max-w-3xl mx-auto">
              "At PG Ease, we value ownership, speed, customer understanding, and continuous learning. We're a growing team working closely together to build practical technology for India's PG ecosystem."
            </p>

            <div className="flex flex-wrap justify-center gap-2.5 mb-8">
              {CORE_VALUES.map((val) => (
                <div
                  key={val}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100/90 text-slate-700 text-xs font-semibold"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />
                  {val}
                </div>
              ))}
            </div>

            {/* User Closing Callout Note */}
            <div className="p-4 sm:p-5 rounded-2xl bg-brand-50/60 border border-brand-200/60 text-brand-900 text-sm max-w-2xl mx-auto font-medium">
              If you want to build practical technology, solve real customer problems and grow alongside an ambitious early-stage company, we’d love to hear from you.
            </div>
          </div>
        </section>

        {/* 5. OPEN POSITIONS / DOVER ATS SECTION */}
        {/* Single clean header to eliminate redundant "opportunity / open positions" text */}
        <section
          id="open-positions"
          className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full scroll-mt-24"
        >
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-wider mb-3">
              <Briefcase className="w-3.5 h-3.5 text-brand-600" />
              Live Openings
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Open Positions
            </h2>
          </div>

          {/* Dover ATS Responsive Iframe Container */}
          <div className="w-full max-w-5xl mx-auto">
            <div className="w-full overflow-hidden">
              <iframe
                src="https://app.dover.com/jobs/pgease?embed=1"
                title="PG Ease Open Positions"
                frameBorder="0"
                width="100%"
                height="700"
                className="w-full border-0 min-h-[700px]"
                style={{ width: '100%', minHeight: '700px' }}
              />
            </div>
          </div>
        </section>

        {/* 6. GENERAL APPLICATION */}
        <section className="py-12 bg-white border-t border-slate-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
              Don't see the right role?
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              We're always interested in meeting talented people who want to build with us. If you think you can contribute to PG Ease, keep an eye on this page for future openings.
            </p>
          </div>
        </section>
      </main>


      {/* Footer */}
      <Footer />

      {/* Book Demo Modal */}
      <BookDemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </div>
  );
}


