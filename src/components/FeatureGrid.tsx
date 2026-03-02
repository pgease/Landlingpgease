import { Building2, MessageSquare, CreditCard, LayoutDashboard } from 'lucide-react';

const features = [
  {
    icon: Building2,
    heading: 'Best PG Management Software for Owners',
    description: 'Complete PG management system designed for PG owners, co-living operators and hostel owners. Manage tenants, rooms, rent and complaints from one dashboard.',
  },
  {
    icon: MessageSquare,
    heading: 'Smart Complaint Tracking System',
    description: 'Track tenant complaints from raise to resolution. Assign to staff, set priorities and never lose a complaint in WhatsApp or paper again.',
  },
  {
    icon: CreditCard,
    heading: 'Automated Rent Collection System',
    description: 'Collect rent digitally with UPI, send WhatsApp reminders and auto-generate receipts. Late fees and payment history in one place.',
  },
  {
    icon: LayoutDashboard,
    heading: 'Multi-Property Management Dashboard',
    description: 'Manage multiple PGs and buildings from a single dashboard. Real-time occupancy, dues and reports across all properties.',
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="py-20 bg-slate-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Why PG Ease Is the Best PG Management System in India
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Built for modern PG owners who want automation, clarity and control.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md hover:border-teal-100 transition-all"
              >
                <div className="bg-teal-100 rounded-xl w-14 h-14 flex items-center justify-center mb-6">
                  <Icon className="h-7 w-7 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {item.heading}
                </h3>
                <p className="text-slate-600 leading-relaxed">
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
