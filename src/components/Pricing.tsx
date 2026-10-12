import { useState, useEffect } from 'react';
import { Check, ArrowRight, Loader2 } from 'lucide-react';
import { plansApi, ProPlanCatalog } from '../services/plansApi';

interface PricingProps {
  onBookDemo?: () => void;
}

const SIGNUP_URL = 'https://app.pgease.in/signup';

export default function Pricing({ onBookDemo }: PricingProps = {}) {
  const [catalog, setCatalog] = useState<ProPlanCatalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cycle, setCycle] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    let mounted = true;
    plansApi
      .getCatalog()
      .then((next) => {
        if (mounted) setCatalog(next);
      })
      .catch((err: Error) => {
        if (mounted) setError(err.message || 'Pricing is unavailable');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const selected = catalog?.cycles.find((item) => item.cycle === cycle) || catalog?.cycles[0];

  return (
    <section id="pricing" className="py-20 md:py-28 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-brand-600 font-semibold text-sm uppercase tracking-wider mb-3">Pricing</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">One plan. Two ways to pay.</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {catalog?.name || 'PG Ease Pro'} is priced per bed. GST is added at checkout.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1">
            {(['monthly', 'yearly'] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setCycle(key)}
                className={`px-5 py-2 rounded-full text-sm font-semibold ${
                  cycle === key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                {key === 'monthly' ? 'Monthly' : 'Yearly'}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
            <span className="ml-2 text-sm text-slate-500">Loading pricing…</span>
          </div>
        )}

        {error && !catalog && (
          <p className="text-center text-sm text-red-600 mb-8">{error}</p>
        )}

        {selected && catalog && (
          <article className="relative max-w-xl mx-auto rounded-3xl border-2 border-brand-500 bg-white p-8 sm:p-10 shadow-xl">
            {catalog.offer.badge && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-[11px] font-extrabold px-4 py-1 rounded-full">
                {catalog.offer.badge}
              </div>
            )}
            <h3 className="text-2xl font-bold text-slate-900">{catalog.name}</h3>
            <div className="mt-3 flex items-baseline gap-3">
              {selected.strikePerBed != null && (
                <span className="text-2xl text-slate-400 line-through">₹{selected.strikePerBed}</span>
              )}
              <span className="text-5xl font-extrabold text-slate-900">₹{selected.pricePerBed}</span>
              <span className="text-sm text-slate-500">{selected.period}</span>
            </div>
            {selected.note && <p className="mt-2 text-sm font-semibold text-brand-700">{selected.note}</p>}
            <p className="mt-2 text-sm text-slate-500">+ {catalog.gstPercent}% GST at checkout</p>
            <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6">
              {catalog.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-slate-700">
                  <Check className="h-4 w-4 text-brand-700 mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <a
              href={SIGNUP_URL}
              className="mt-8 flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </a>
          </article>
        )}

        <div className="mt-12 max-w-4xl mx-auto rounded-3xl border-2 border-brand-500/20 bg-slate-900 p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h4 className="text-xl font-bold">Want your own branded PG & hostel app?</h4>
            <p className="text-sm text-slate-300 max-w-xl mt-1">
              White-label apps and private domains are available for hostel chains.
            </p>
          </div>
          {onBookDemo ? (
            <button type="button" onClick={onBookDemo} className="shrink-0 px-6 py-3.5 rounded-xl bg-white text-slate-950 font-bold text-sm">
              Enquire white-label
            </button>
          ) : (
            <a
              href="https://wa.me/917905804172?text=Hi%2C%20I%20am%20interested%20in%20a%20white-label%20app"
              className="shrink-0 px-6 py-3.5 rounded-xl bg-white text-slate-950 font-bold text-sm"
            >
              Enquire white-label
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
