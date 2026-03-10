import { Check, ArrowRight } from 'lucide-react';

const plans = [
  {
    name: 'Basic',
    price: '₹19',
    period: 'per bed / month',
    description: 'For small PGs getting started with digital management',
    features: [
      'Unlimited tenants',
      'Tenant records & profiles',
      'Rent tracking',
      'Room & bed management',
      'Rent reminders',
      'Payment history',
      'Basic reports',
    ],
    cta: 'Start Free',
    popular: false,
  },
  {
    name: 'Pro',
    price: '₹39',
    period: 'per bed / month',
    description: 'For growing PGs that need full automation',
    features: [
      'Everything in Basic',
      'Analytics dashboard',
      'Staff roles & permissions',
      'Auto rent receipts',
      'WhatsApp notifications',
      'Multi-property support',
      'Expense tracking',
      'Advanced reports (PDF/Excel)',
      'Priority support',
    ],
    cta: 'Start Free',
    popular: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-28 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-brand-600 font-semibold text-sm uppercase tracking-wider mb-3">
            Pricing
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 text-balance">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Pay only for what you use. No hidden charges. No long-term contracts.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <article
              key={i}
              className={`relative rounded-2xl p-8 transition-all ${
                plan.popular
                  ? 'bg-gradient-to-b from-brand-50 to-white border-2 border-brand-500 shadow-card'
                  : 'bg-white border-2 border-slate-200 hover:border-slate-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-sm">
                  RECOMMENDED
                </div>
              )}

              <h3 className="text-2xl font-bold text-slate-900 mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                <span className="text-slate-500 text-sm font-medium">{plan.period}</span>
              </div>
              <p className="text-slate-600 text-sm mb-6">{plan.description}</p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-brand-700" />
                    </div>
                    <span className="text-slate-700 text-sm">{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="mailto:support@pgeease.in?subject=Start%20Free%20-%20PG%20Ease"
                className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-base transition-all ${
                  plan.popular
                    ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-600/20'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {plan.cta}
                <ArrowRight className="h-4 w-4" />
              </a>
            </article>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-sm text-slate-500">
            All plans include a free trial. No credit card required to get started.
          </p>
        </div>
      </div>
    </section>
  );
}
