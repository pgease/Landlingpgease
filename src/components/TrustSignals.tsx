import { Building2, BedDouble, IndianRupee } from 'lucide-react';

const stats = [
  {
    icon: Building2,
    value: '500+',
    label: 'PG Owners',
    description: 'Growing across India',
  },
  {
    icon: BedDouble,
    value: '10,000+',
    label: 'Beds Managed',
    description: 'Tracked in real time',
  },
  {
    icon: IndianRupee,
    value: '₹1Cr+',
    label: 'Rent Tracked',
    description: 'Monthly on platform',
  },
];

export default function TrustSignals() {
  return (
    <section className="py-12 md:py-16 bg-white border-y border-slate-100" aria-label="Platform statistics">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-3">
                  <Icon className="h-6 w-6 text-brand-600" />
                </div>
                <p className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {stat.value}
                </p>
                <p className="text-base font-semibold text-slate-700 mt-1">
                  {stat.label}
                </p>
                <p className="text-sm text-slate-500 mt-0.5">{stat.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
