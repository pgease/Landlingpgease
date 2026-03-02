import { Check } from 'lucide-react';

const plans = [
  {
    name: 'FREE',
    price: '₹0',
    period: '/ month',
    description: 'For small PGs starting digital management',
    features: [
      'Add tenants (Excel / Invite / Manual)',
      'Multi-PG / Multi-Building',
      'Notice period tracker',
      'Vacancy dashboard',
      'Manual rent & receipt upload',
      'Complaint logging',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'PREMIUM',
    price: '₹19',
    period: '/ bed / month',
    description: 'Best for most PG owners',
    features: [
      'Everything in Free',
      'Automatic rent collection (UPI)',
      'WhatsApp rent reminders',
      'Aadhaar verification',
      'Auto rent receipts',
      'Guest tracking',
      'Automated late fees',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'PRO',
    price: '₹39',
    period: '/ bed / month',
    description: 'For professional PGs & co-living',
    features: [
      'Everything in Premium',
      'Staff roles & permissions',
      'Expense & bill tracking',
      'Complaint threading & assignment',
      'PG website (pgname.pgease.in)',
      'Group notifications',
      'Advanced reports (PDF / Excel)',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            No hidden charges. Start free and upgrade when you need more.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-2xl p-8 border-2 transition-all ${
                plan.popular
                  ? 'bg-teal-50 border-teal-500 shadow-lg shadow-teal-500/10 scale-[1.02]'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                  RECOMMENDED
                </div>
              )}

              <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
              <div className="mb-2">
                <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
                <span className="text-slate-600 text-sm">{plan.period}</span>
              </div>
              <p className="text-slate-600 text-sm mb-6">{plan.description}</p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <Check className="h-5 w-5 flex-shrink-0 text-teal-600 mt-0.5" />
                    <span className="text-slate-700 text-sm">{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="mailto:support@pgeease.in?subject=Start%20Free%20Trial%20-%20PG%20Ease"
                className={`block w-full py-3 rounded-xl font-semibold text-center transition-colors ${
                  plan.popular
                    ? 'bg-teal-600 text-white hover:bg-teal-700'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
