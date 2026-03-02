import {
  Users,
  CreditCard,
  MessageSquare,
  UserCog,
  LayoutDashboard,
  BedDouble,
} from 'lucide-react';

const modules = [
  { icon: Users, title: 'Tenant Management', description: 'Add, track and manage all tenants in one place.' },
  { icon: CreditCard, title: 'Rent & Payment Tracking', description: 'Automated rent collection and payment history.' },
  { icon: MessageSquare, title: 'Complaint Management', description: 'Track and resolve complaints with clear status.' },
  { icon: UserCog, title: 'Staff Role Permissions', description: 'Assign roles so staff know exactly what they can do.' },
  { icon: LayoutDashboard, title: 'Real-time Dashboard', description: 'See occupancy, dues and activity at a glance.' },
  { icon: BedDouble, title: 'Room & Bed Management', description: 'Manage rooms, beds and vacancy in real time.' },
];

export default function SolutionSection() {
  return (
    <section id="solution" className="py-20 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            One Complete PG Management System—PG Ease
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            PG Ease brings automation to your PG operations. Stop juggling spreadsheets and WhatsApp—manage tenants, rent, complaints and staff from a single platform.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-slate-50 rounded-xl p-6 border border-slate-100 hover:border-teal-200 hover:bg-teal-50/30 transition-all"
              >
                <div className="bg-teal-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
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
