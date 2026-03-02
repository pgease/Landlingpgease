import { Check } from 'lucide-react';

const plans = [
  {
    name: 'FREE',
    price: '₹0',
    description: 'For small PGs starting digital management',
    features: [
      'Add tenants (Excel / Invite / Manual)',
      'Multi-PG / Multi-Building',
      'Notice period tracker',
      'Vacancy dashboard',
      'Manual rent add',
      'Manual receipt upload',
      'Complaint logging',
    ],
    cta: 'Start Free',
    popular: false,
  },
  {
    name: 'PREMIUM',
    price: '₹19',
    period: '/ bed / month',
    description: 'Most Popular',
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
    cta: 'Upgrade Now',
    popular: true,
  },
  {
    name: 'PRO',
    price: '₹39',
    period: '/ bed / month',
    description: 'For professional PGs',
    features: [
      'Everything in Premium',
      'Staff roles & permissions',
      'Expense & bill tracking',
      'Complaint threading & assignment',
      'PG website (pgname.pgease.in)',
      'Group notifications / broadcast',
      'Advanced reports (PDF / Excel)',
    ],
    cta: 'Upgrade Now',
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple Pricing. No Hidden Charges.
          </h2>
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-[#008080] to-[#00a0a0] text-white font-semibold text-lg shadow-lg mt-4">
            🎉 50% OFF for First Month — Limited Time
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-2xl p-8 ${
                plan.popular
                  ? 'bg-gradient-to-b from-[#008080] to-[#006666] text-white shadow-2xl scale-105 border-4 border-[#00a0a0]'
                  : 'bg-white text-gray-900 shadow-lg border border-gray-200'
              } transition-transform hover:scale-105`}
            >
              {plan.popular && (
                <div className="bg-white text-[#008080] text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                  MOST POPULAR
                </div>
              )}

              <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                {plan.name}
              </h3>

              <div className="mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className={`text-sm ${plan.popular ? 'text-white/80' : 'text-gray-600'}`}>
                    {plan.period}
                  </span>
                )}
              </div>

              <p className={`mb-6 ${plan.popular ? 'text-white/90' : 'text-gray-600'}`}>
                {plan.description}
              </p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                      plan.popular ? 'text-white' : 'text-[#008080]'
                    }`} />
                    <span className={`text-sm ${plan.popular ? 'text-white' : 'text-gray-700'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  plan.popular
                    ? 'bg-white text-[#008080] hover:bg-gray-100'
                    : 'bg-[#008080] text-white hover:bg-[#006666]'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
