import { Users, Home, DollarSign, MessageSquare, Shield, Wrench, UserCog, Receipt, UsersRound, FileText, Clock, Globe, Building, BarChart } from 'lucide-react';

const features = [
  { icon: Users, title: 'Add Tenants', description: 'Excel upload, invite links, or manual entry' },
  { icon: Home, title: 'Vacancy & Room Tracking', description: 'Real-time occupancy dashboard' },
  { icon: DollarSign, title: 'Rent Tracking & UPI Collection', description: 'Automated rent collection with UPI integration' },
  { icon: MessageSquare, title: 'WhatsApp Rent Reminders', description: 'Automatic reminders sent via WhatsApp' },
  { icon: Shield, title: 'Aadhaar Verification', description: 'Secure tenant identity verification' },
  { icon: Wrench, title: 'Complaint Management', description: 'Track and resolve tenant complaints' },
  { icon: UserCog, title: 'Staff Roles & Permissions', description: 'Assign roles to staff members' },
  { icon: Receipt, title: 'Expense & Bill Tracking', description: 'Keep track of all expenses and bills' },
  { icon: UsersRound, title: 'Guest & Visitor Logs', description: 'Log guest night stays and visitors' },
  { icon: FileText, title: 'Auto Rent Receipts', description: 'Generate receipts automatically' },
  { icon: Clock, title: 'Late Fee Automation', description: 'Automatic late fee calculation' },
  { icon: Globe, title: 'PG Website', description: 'Get your own pgname.pgease.in website' },
  { icon: Building, title: 'Multi-PG / Multi-Building', description: 'Manage multiple properties easily' },
  { icon: BarChart, title: 'Reports (PDF / Excel)', description: 'Download detailed reports' },
];

export default function OwnerFeatures() {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything a PG Owner Needs — In One App
          </h2>
          <p className="text-lg text-gray-600">
            Comprehensive tools to manage your PG business efficiently
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="bg-[#008080]/10 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-[#008080]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
