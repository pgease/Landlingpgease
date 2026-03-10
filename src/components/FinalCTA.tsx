import { ArrowRight } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-[0.03]" aria-hidden="true">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" aria-hidden="true" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight text-balance">
          Stop Managing Your PG on{' '}
          <span className="text-brand-400">WhatsApp and Notebooks.</span>
        </h2>

        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
          Join 500+ PG owners who switched to PG Ease and saved hours every week.
          Start managing your PG digitally — for free.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#pricing"
            className="inline-flex justify-center items-center gap-2 bg-brand-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-brand-500 transition-all shadow-lg shadow-brand-600/30"
          >
            Start Free
            <ArrowRight className="h-5 w-5" />
          </a>
          <a
            href="mailto:support@pgeease.in?subject=Book%20a%20Demo%20-%20PG%20Ease"
            className="inline-flex justify-center items-center gap-2 bg-white/10 text-white px-8 py-4 rounded-xl text-lg font-semibold border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm"
          >
            Book a Demo
          </a>
        </div>
      </div>
    </section>
  );
}
