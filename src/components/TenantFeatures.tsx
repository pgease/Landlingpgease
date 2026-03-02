import { Search, CreditCard, AlertCircle, Info, UserPlus, Bell, ShieldCheck, UtensilsCrossed, History, Star, Gift } from 'lucide-react';

const features = [
  { icon: Search, title: 'Search PGs by Location', description: 'Find PGs near you like OYO' },
  { icon: CreditCard, title: 'Pay Rent via UPI', description: 'Quick and secure online payments' },
  { icon: AlertCircle, title: 'Raise Food & Room Complaints', description: 'Report issues instantly' },
  { icon: Info, title: 'View PG Details', description: 'WiFi, menu, contacts, and more' },
  { icon: UserPlus, title: 'Guest Night Stay Entry', description: 'Register guests easily' },
  { icon: Bell, title: 'Notice Period Submission', description: 'Submit notice to vacate' },
  { icon: ShieldCheck, title: 'Security Deposit Tracking', description: 'Track your deposit status' },
  { icon: UtensilsCrossed, title: 'Food Opt-in / Opt-out', description: 'Manage meal preferences' },
  { icon: History, title: 'Payment History', description: 'View all past transactions' },
  { icon: Star, title: 'PG Reviews & Ratings', description: 'Rate and review your PG' },
  { icon: Gift, title: 'Referral Discounts', description: 'Earn rewards by referring friends' },
];

export default function TenantFeatures() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            A Better Living Experience for Tenants
          </h2>
          <p className="text-lg text-gray-600">
            Everything tenants need for a comfortable PG stay
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-[#008080]/30"
              >
                <div className="bg-gradient-to-br from-[#008080] to-[#00a0a0] rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-white" />
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
