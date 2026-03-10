import { Building, BedDouble, Users } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: Building,
    title: 'Register Your PG',
    description:
      'Sign up and add your PG details — name, address, and contact info. Takes less than 2 minutes.',
  },
  {
    step: '02',
    icon: BedDouble,
    title: 'Add Rooms & Beds',
    description:
      'Configure your rooms, bed count, and pricing. Set up your PG structure exactly as it is.',
  },
  {
    step: '03',
    icon: Users,
    title: 'Start Managing Tenants',
    description:
      'Add tenants, track rent, send reminders, and run your PG digitally from day one.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-brand-600 font-semibold text-sm uppercase tracking-wider mb-3">
            How It Works
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 text-balance">
            Get Started in 3 Simple Steps
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Go from paper-based chaos to digital management in minutes.
            No technical skills required.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="relative text-center group">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-px bg-slate-200" aria-hidden="true" />
                )}

                <div className="relative mx-auto mb-5">
                  <div className="w-24 h-24 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto border border-brand-100 group-hover:bg-brand-100 transition-colors">
                    <Icon className="h-10 w-10 text-brand-600" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed max-w-xs mx-auto">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
