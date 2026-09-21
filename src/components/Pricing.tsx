import { useState, useEffect } from 'react';
import { Check, ArrowRight, Loader2 } from 'lucide-react';
import { plansApi, SubscriptionPlan, FALLBACK_PLANS } from '../services/plansApi';

export default function Pricing() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(FALLBACK_PLANS);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    plansApi.getPlans()
      .then((fetchedPlans) => {
        if (isMounted && fetchedPlans && fetchedPlans.length > 0) {
          // Sort by displayOrder
          const sorted = [...fetchedPlans].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
          setPlans(sorted);
        }
      })
      .catch((err) => {
        console.warn('Could not load dynamic plans, using fallback:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const getPlanFeatures = (plan: SubscriptionPlan): string[] => {
    const isPro = plan.name?.toLowerCase().includes('pro') || (plan.trialDays && plan.trialDays > 0);
    
    if (isPro) {
      return [
        'Includes everything in Lite, plus:',
        'Automated payment gateway collections',
        'Automated Settlement (T+2 direct bank transfer)',
        'Dedicated PG Website (pgname.pgease.in)',
        'Dedicated Account Manager included',
        'Digital rental agreement eSign',
        'Automated WhatsApp rent reminders & notices',
        'Granular staff roles & permissions',
      ];
    }

    return [
      'Direct UPI intent collection (0% fee)',
      'Manual payment verification (Approve / Reject)',
      'Dedicated Account Manager included',
      'Unlimited properties, rooms & tenants',
      'DigiLocker Aadhaar KYC verification',
      'Electricity meter billing calculation',
      'Real-time vacancy & occupancy dashboard',
      'Notice period & dues tracking',
    ];
  };

  const getBadge = (plan: SubscriptionPlan): { text: string; colorClass: string } | null => {
    if (plan.trialDays && plan.trialDays > 0) {
      return {
        text: `${plan.trialDays}-DAY FREE PRO TRIAL`,
        colorClass: 'bg-brand-600',
      };
    }
    if (plan.isPopular) {
      return {
        text: 'RECOMMENDED',
        colorClass: 'bg-brand-600',
      };
    }
    return {
      text: '0% GATEWAY FEE',
      colorClass: 'bg-emerald-600',
    };
  };

  const getCta = (plan: SubscriptionPlan): string => {
    if (plan.trialDays && plan.trialDays > 0) {
      return `Claim ${plan.trialDays}-Day Free Trial`;
    }
    return `Get Started with ${plan.displayName || 'Lite'}`;
  };

  const hasTrial = plans.some((p) => (p.trialDays || 0) > 0);
  const trialPlan = plans.find((p) => (p.trialDays || 0) > 0);
  const trialDays = trialPlan?.trialDays || 45;

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
            Choose between Lite and Pro. Enjoy a {trialDays}-day free trial on Pro with zero commitment.
          </p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-4 mb-4">
            <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
            <span className="ml-2 text-sm text-slate-500 font-medium">Syncing live pricing...</span>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, i) => {
            const isPopular = plan.isPopular || (plan.trialDays && plan.trialDays > 0);
            const badge = getBadge(plan);
            const features = getPlanFeatures(plan);
            const price = `₹${plan.pricePerBed || plan.price || (plan.name?.toLowerCase().includes('pro') ? 49 : 29)}`;
            const period = plan.billingInterval === 'yearly' ? 'per bed / year' : 'per bed / month';

            return (
              <article
                key={plan.id || i}
                className={`relative rounded-3xl p-8 sm:p-10 transition-all flex flex-col justify-between ${
                  isPopular
                    ? 'bg-gradient-to-b from-brand-50/60 to-white border-2 border-brand-500 shadow-xl shadow-brand-500/10'
                    : 'bg-white border-2 border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                {badge && (
                  <div
                    className={`absolute -top-3.5 left-1/2 -translate-x-1/2 text-white text-[11px] font-extrabold tracking-wider px-4 py-1 rounded-full shadow-sm ${
                      badge.colorClass
                    }`}
                  >
                    {badge.text}
                  </div>
                )}

                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">{plan.displayName || plan.name}</h3>
                  <div className="flex items-baseline gap-1.5 mb-2 mt-2">
                    <span className="text-4xl sm:text-5xl font-extrabold text-slate-900">{price}</span>
                    <span className="text-slate-500 text-sm font-medium">{period}</span>
                  </div>
                  <p className="text-slate-600 text-sm mb-6 min-h-[40px]">{plan.description}</p>

                  <ul className="space-y-3 mb-8 border-t border-slate-100 pt-6">
                    {features.map((f, j) => (
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
                  className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all ${
                    isPopular
                      ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-600/20'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {getCta(plan)}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </article>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm font-medium text-slate-500">
            {hasTrial
              ? `⏰ All new PG owners receive an instant ${trialDays}-day free trial of Pro Plan upon registration. No credit card required.`
              : '⏰ Direct setup with zero onboarding fees. No credit card required.'}
          </p>
        </div>
      </div>
    </section>
  );
}
