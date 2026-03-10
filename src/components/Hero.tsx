import { ArrowRight, Play } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 hero-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Copy */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-6 tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              PG Management Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-6 text-balance">
              Run Your PG Like a Business.{' '}
              <span className="gradient-text">Not a Headache.</span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
              PG Ease helps PG owners manage tenants, beds, rent and operations
              in one simple platform. No spreadsheets. No WhatsApp chaos.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <a
                href="#pricing"
                className="inline-flex justify-center items-center gap-2 bg-brand-600 text-white px-7 py-3.5 rounded-xl text-base font-semibold hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/20 hover:shadow-xl hover:shadow-brand-600/30"
              >
                Start Free
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="mailto:support@pgeease.in?subject=Book%20a%20Demo%20-%20PG%20Ease"
                className="inline-flex justify-center items-center gap-2 bg-white text-slate-700 px-7 py-3.5 rounded-xl text-base font-semibold border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
              >
                <Play className="h-4 w-4 text-brand-600" />
                Book Demo
              </a>
            </div>

            <p className="text-sm text-slate-500">
              Free forever for up to 10 beds. No credit card required.
            </p>
          </div>

          {/* Right — Phone Mockup */}
          <div className="relative flex justify-center lg:justify-end" aria-hidden="true">
            {/* Background decoration */}
            <div className="absolute -top-8 -right-8 w-72 h-72 bg-brand-100/50 rounded-full blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-56 h-56 bg-brand-50 rounded-full blur-2xl" />

            {/* Phone mockup */}
            <div className="relative z-10">
              <div className="phone-mockup w-[260px] sm:w-[280px]">
                <div className="phone-mockup-inner aspect-[9/19.5] flex flex-col">
                  {/* Status bar */}
                  <div className="flex items-center justify-between px-5 pt-3 pb-2">
                    <span className="text-[10px] font-semibold text-slate-700">9:41</span>
                    <div className="flex gap-1">
                      <div className="w-3.5 h-2 bg-slate-700 rounded-sm" />
                      <div className="w-1.5 h-2 bg-slate-400 rounded-sm" />
                    </div>
                  </div>

                  {/* App header */}
                  <div className="px-4 py-3 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-500">Welcome back</p>
                        <p className="text-sm font-bold text-slate-900">My PG Dashboard</p>
                      </div>
                      <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                        <span className="text-[10px] font-bold text-brand-700">RS</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="px-4 py-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-brand-50 rounded-xl p-2.5">
                        <p className="text-[9px] text-brand-700 font-medium">Active Tenants</p>
                        <p className="text-lg font-bold text-brand-800">48</p>
                      </div>
                      <div className="bg-emerald-50 rounded-xl p-2.5">
                        <p className="text-[9px] text-emerald-700 font-medium">Rent Collected</p>
                        <p className="text-lg font-bold text-emerald-800">₹2.4L</p>
                      </div>
                      <div className="bg-amber-50 rounded-xl p-2.5">
                        <p className="text-[9px] text-amber-700 font-medium">Vacant Beds</p>
                        <p className="text-lg font-bold text-amber-800">6</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-2.5">
                        <p className="text-[9px] text-slate-600 font-medium">Pending Dues</p>
                        <p className="text-lg font-bold text-slate-800">₹18K</p>
                      </div>
                    </div>
                  </div>

                  {/* Tenant list preview */}
                  <div className="px-4 py-2 flex-1">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Recent Tenants</p>
                    {['Amit Kumar', 'Priya Singh', 'Rahul Verma'].map((name, i) => (
                      <div key={i} className="flex items-center gap-2.5 py-2 border-b border-slate-50 last:border-0">
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
                          <span className="text-[9px] font-bold text-slate-600">{name.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-[11px] font-semibold text-slate-800">{name}</p>
                          <p className="text-[9px] text-slate-400">Room {101 + i} · Bed {(i % 3) + 1}</p>
                        </div>
                        <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-full ${
                          i === 0 ? 'bg-emerald-50 text-emerald-600' : i === 1 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {i < 2 ? 'Paid' : 'Due'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
