import {
  Users,
  BedDouble,
  Bell,
  FileText,
  LayoutDashboard,
} from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Tenant Management',
    description:
      'Add, edit, and track all tenants from one place. Full profiles with ID proof, check-in dates, and contact details.',
  },
  {
    icon: BedDouble,
    title: 'Bed & Room Tracking',
    description:
      'Real-time visibility into room occupancy, vacant beds, and allocation. Never double-book a bed again.',
  },
  {
    icon: Bell,
    title: 'Rent Reminders',
    description:
      'Automated rent reminders via WhatsApp and SMS. Tenants pay on time. You stop chasing payments.',
  },
  {
    icon: FileText,
    title: 'Digital Records',
    description:
      'Every tenant, every payment, every room change — recorded digitally. Searchable, exportable, and always accessible.',
  },
  {
    icon: LayoutDashboard,
    title: 'Owner Dashboard',
    description:
      'See occupancy, revenue, dues, and trends at a glance. Make informed decisions with real-time data.',
  },
];

export default function SolutionSection() {
  return (
    <section id="features" className="py-20 md:py-28 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-brand-600 font-semibold text-sm uppercase tracking-wider mb-3">
            The Solution
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 text-balance">
            One Platform to Run Your Entire PG
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            PG Ease replaces your notebooks, spreadsheets, and WhatsApp groups
            with a single, purpose-built platform.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <article
                key={index}
                className="bg-slate-50/70 rounded-2xl p-6 border border-slate-100 hover:border-brand-200 hover:bg-brand-50/30 transition-all group"
              >
                <div className="bg-brand-100 rounded-xl w-12 h-12 flex items-center justify-center mb-5 group-hover:bg-brand-200/70 transition-colors">
                  <Icon className="h-6 w-6 text-brand-700" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
