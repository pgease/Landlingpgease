import { Smartphone, TrendingUp, Home } from 'lucide-react';

const highlights = [
  {
    icon: Smartphone,
    title: 'Manage tenants from your phone',
    description: 'Add, view, and manage tenants on the go',
  },
  {
    icon: TrendingUp,
    title: 'Track rent instantly',
    description: 'See who paid and who hasn\'t in real time',
  },
  {
    icon: Home,
    title: 'Monitor room occupancy',
    description: 'Know exactly which beds are available',
  },
];

function PhoneMockup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="phone-mockup w-[200px] sm:w-[220px]" role="img" aria-label={title}>
      <div className="phone-mockup-inner aspect-[9/19.5] flex flex-col">
        <div className="flex items-center justify-between px-4 pt-2.5 pb-1.5">
          <span className="text-[9px] font-semibold text-slate-700">9:41</span>
          <div className="flex gap-0.5">
            <div className="w-3 h-1.5 bg-slate-700 rounded-sm" />
          </div>
        </div>
        <div className="px-3 py-2 border-b border-slate-100">
          <p className="text-[11px] font-bold text-slate-900">{title}</p>
        </div>
        <div className="flex-1 px-3 py-2 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function MobileApp() {
  return (
    <section className="py-20 md:py-28 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-brand-600 font-semibold text-sm uppercase tracking-wider mb-3">
            Mobile App
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 text-balance">
            Your PG in Your Pocket
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Manage your entire PG from anywhere with the PG Ease mobile app.
            Available on Android and iOS.
          </p>
        </div>

        {/* Phone Mockups */}
        <div className="flex justify-center gap-4 sm:gap-6 lg:gap-8 mb-16 overflow-x-auto pb-4">
          {/* Screen 1: Tenant List */}
          <PhoneMockup title="Tenant List">
            {['Amit Kumar', 'Priya Singh', 'Rahul Verma', 'Neha Gupta', 'Vikash Yadav'].map((name, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5 border-b border-slate-50 last:border-0">
                <div className="w-6 h-6 rounded-full bg-brand-50 flex items-center justify-center flex-shrink-0">
                  <span className="text-[8px] font-bold text-brand-700">{name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-slate-800 truncate">{name}</p>
                  <p className="text-[8px] text-slate-400">Room {101 + i}</p>
                </div>
                <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                  i < 3 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {i < 3 ? 'Active' : 'Notice'}
                </span>
              </div>
            ))}
          </PhoneMockup>

          {/* Screen 2: Rent Dashboard */}
          <PhoneMockup title="Rent Dashboard">
            <div className="space-y-2">
              <div className="bg-brand-50 rounded-lg p-2">
                <p className="text-[8px] text-brand-600 font-medium">Total Collected</p>
                <p className="text-base font-extrabold text-brand-800">₹2,45,000</p>
                <div className="w-full bg-brand-200 rounded-full h-1 mt-1.5">
                  <div className="bg-brand-600 h-1 rounded-full" style={{ width: '78%' }} />
                </div>
                <p className="text-[7px] text-brand-500 mt-0.5">78% collected</p>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <div className="bg-emerald-50 rounded-lg p-2">
                  <p className="text-[7px] text-emerald-600 font-medium">Paid</p>
                  <p className="text-sm font-bold text-emerald-800">38</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-2">
                  <p className="text-[7px] text-amber-600 font-medium">Pending</p>
                  <p className="text-sm font-bold text-amber-800">10</p>
                </div>
              </div>
              {['Amit K.', 'Neha G.', 'Vikash Y.'].map((name, i) => (
                <div key={i} className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-[9px] font-medium text-slate-700">{name}</span>
                  <span className={`text-[8px] font-bold ${i < 1 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {i < 1 ? '₹8,000 Paid' : `₹${(i + 1) * 4},000 Due`}
                  </span>
                </div>
              ))}
            </div>
          </PhoneMockup>

          {/* Screen 3: Room Management */}
          <PhoneMockup title="Rooms & Beds">
            <div className="space-y-2">
              {[
                { room: '101', beds: 3, occupied: 3 },
                { room: '102', beds: 4, occupied: 2 },
                { room: '103', beds: 2, occupied: 2 },
                { room: '104', beds: 3, occupied: 1 },
              ].map((room, i) => (
                <div key={i} className="bg-white border border-slate-100 rounded-lg p-2">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] font-bold text-slate-800">Room {room.room}</p>
                    <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded-full ${
                      room.occupied === room.beds ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {room.occupied === room.beds ? 'Full' : `${room.beds - room.occupied} vacant`}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: room.beds }).map((_, j) => (
                      <div
                        key={j}
                        className={`h-2 flex-1 rounded-sm ${
                          j < room.occupied ? 'bg-brand-400' : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </PhoneMockup>
        </div>

        {/* Feature highlights */}
        <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {highlights.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="h-6 w-6 text-brand-700" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-xs text-slate-500">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
