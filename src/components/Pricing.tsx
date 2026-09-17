import { Check, ArrowRight } from 'lucide-react';

const plans = [
  {
    name: 'Lite Plan',
    price: '₹29',
    period: 'per bed / month',
    badge: '45-DAY FREE TRIAL',
    description: 'Direct UPI payments with 0% gateway fee, manual verification & full operations.',
    features: [
      '45-Day Free Trial on signup',
      'Direct UPI intent collection (0% fee)',
      'Manual payment verification (Approve / Reject)',
      'Dedicated Account Manager included',
      'Unlimited properties, rooms & tenants',
      'DigiLocker Aadhaar KYC verification',
      'Electricity meter billing calculation',
      'Real-time vacancy & occupancy dashboard',
    ],
    cta: 'Claim 45-Day Free Trial',
    popular: false,
  },
  {
    name: 'Pro Plan',
    price: '₹49',
    period: 'per bed / month',
    badge: 'RECOMMENDED',
    description: 'Complete automation with payment gateway, T+2 settlement & dedicated PG website.',
    features: [
      'Includes everything in Lite, plus:',
      'Automated payment gateway collections',
      'Automated Settlement (T+2 direct bank transfer)',
      'Dedicated PG Website (pgname.pgease.in)',
      'Dedicated Account Manager included',
      'Digital rental agreement eSign',
      'Automated WhatsApp rent reminders & notices',
      'Granular staff roles & permissions',
    ],
    cta: 'Upgrade to Pro Plan',
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
            Choose between Lite and Pro. Enjoy a 45-day free trial on Lite with zero commitment.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <article
              key={i}
              className={`relative rounded-3xl p-8 sm:p-10 transition-all flex flex-col justify-between ${plan.popular
                ? 'bg-gradient-to-b from-brand-50/60 to-white border-2 border-brand-500 shadow-xl shadow-brand-500/10'
                : 'bg-white border-2 border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
            >
              {plan.badge && (
                <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 text-white text-[11px] font-extrabold tracking-wider px-4 py-1 rounded-full shadow-sm ${
                  plan.popular ? 'bg-brand-600' : 'bg-amber-500'
                }`}>
                  {plan.badge}
                </div>
              )}

              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1.5 mb-2 mt-2">
                  <span className="text-4xl sm:text-5xl font-extrabold text-slate-900">{plan.price}</span>
                  <span className="text-slate-500 text-sm font-medium">{plan.period}</span>
                </div>
                <p className="text-slate-600 text-sm mb-6 min-h-[40px]">{plan.description}</p>

                <ul className="space-y-3 mb-8 border-t border-slate-100 pt-6">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-brand-700" />
                      </div>
                      <span className="text-slate-700 text-sm font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="https://owner.pgease.in"
                className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all ${plan.popular
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

        <div className="text-center mt-12">
          <p className="text-sm font-medium text-slate-500">
            ⏰ All new PG owners receive an instant 45-day free trial of Lite Plan upon registration. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
}
