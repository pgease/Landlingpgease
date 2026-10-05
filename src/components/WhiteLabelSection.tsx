import { useState } from 'react';
import {
  Smartphone,
  Globe,
  Sparkles,
  ShieldCheck,
  Building2,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  FileText,
  Palette,
  ExternalLink,
} from 'lucide-react';

interface WhiteLabelSectionProps {
  onBookDemo?: () => void;
}

export default function WhiteLabelSection({ onBookDemo }: WhiteLabelSectionProps) {
  const [activeTab, setActiveTab] = useState<'app' | 'domain' | 'receipts'>('app');

  const features = [
    {
      icon: Smartphone,
      title: 'Your Branded Mobile Apps',
      description:
        'Published on Google Play Store & Apple App Store with your hostel name, icon, splash screen, and brand colors.',
    },
    {
      icon: Globe,
      title: 'Custom Web Domain',
      description:
        'Direct your tenants and staff to your own domain (e.g., portal.yourbrandpg.com or app.yourhostel.in) with SSL encryption.',
    },
    {
      icon: MessageSquare,
      title: 'Official WhatsApp Sender ID',
      description:
        'Automated rent reminders, OTPs, and payment confirmations delivered from your verified WhatsApp business profile.',
    },
    {
      icon: FileText,
      title: 'Branded Invoices & Agreements',
      description:
        'Professional rent receipts, electricity bills, and e-signed tenancy agreements with your logo and GST details.',
    },
    {
      icon: Building2,
      title: 'Multi-Branch Enterprise Suite',
      description:
        'Unified dashboard for managing 2 to 50+ properties with role-based access for area managers, wardens, and accountants.',
    },
    {
      icon: Palette,
      title: 'Custom Theme & Visuals',
      description:
        'Tailored dashboard color scheme, tenant portal styling, and customized room booking flow matching your corporate identity.',
    },
  ];

  return (
    <section id="whitelabel" className="py-20 md:py-28 bg-slate-950 text-white relative overflow-hidden scroll-mt-20">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            ENTERPRISE & CHAIN SOLUTION
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-5 text-balance">
            White-Label Software Available for Your PG / Hostel
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed text-balance">
            Run your accommodation chain under <strong className="text-white font-semibold">your own brand identity</strong>. 
            Give tenants, parents, and staff a fully branded experience from app store download to digital rent payments.
          </p>
        </div>

        {/* Interactive Feature Showcase Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-center mb-16">
          {/* Left Column: Feature Highlights */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-brand-500/40 transition-all hover:bg-slate-900 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1.5">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{feat.description}</p>
                </div>
              );
            })}
          </div>

          {/* Right Column: Visual Preview Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl relative">
              <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                <div>
                  <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">
                    Interactive Preview
                  </span>
                  <h4 className="text-lg font-bold text-white mt-0.5">Your Brand in Action</h4>
                </div>
                <div className="flex gap-1 bg-slate-800/60 p-1 rounded-lg">
                  <button
                    onClick={() => setActiveTab('app')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                      activeTab === 'app' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Mobile App
                  </button>
                  <button
                    onClick={() => setActiveTab('domain')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                      activeTab === 'domain' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Custom Domain
                  </button>
                  <button
                    onClick={() => setActiveTab('receipts')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                      activeTab === 'receipts' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Receipts
                  </button>
                </div>
              </div>

              {/* Dynamic Preview Content */}
              <div className="py-6">
                {activeTab === 'app' && (
                  <div className="space-y-4">
                    <div className="rounded-2xl bg-slate-800/60 border border-slate-700/60 p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-black text-xl text-white shadow-md">
                          YH
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">Your Hostel Tenant App</div>
                          <div className="text-xs text-emerald-400 flex items-center gap-1 mt-0.5">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Published under your Developer Account
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                        <span className="text-slate-400">Play Store & App Store ID:</span>
                        <span className="font-mono text-white">com.yourhostel.app</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                        <span className="text-slate-400">App Name on Tenant Phone:</span>
                        <span className="font-semibold text-white">Your Hostel Living</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                        <span className="text-slate-400">Branded Push Alerts:</span>
                        <span className="text-brand-400 font-medium">From "Your Hostel"</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'domain' && (
                  <div className="space-y-4">
                    <div className="rounded-2xl bg-slate-800/60 border border-slate-700/60 p-4">
                      <div className="text-xs text-slate-400 mb-1">Web Browser Address Bar:</div>
                      <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-700 font-mono text-xs text-emerald-400">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                        <span>https://portal.yourbrandpg.com</span>
                      </div>
                    </div>

                    <ul className="space-y-2.5 text-xs text-slate-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span>Fully SSL secured with custom domain masking</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span>Zero third-party watermarks or branding</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span>Tenant login portal and owner command center</span>
                      </li>
                    </ul>
                  </div>
                )}

                {activeTab === 'receipts' && (
                  <div className="space-y-4">
                    <div className="rounded-2xl bg-slate-800/60 border border-slate-700/60 p-4">
                      <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-3">
                        <div className="text-sm font-bold text-white">TAX INVOICE & RENT RECEIPT</div>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded">
                          PAID
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 space-y-1">
                        <div><strong>Billed By:</strong> Your Hostel Pvt. Ltd.</div>
                        <div><strong>GSTIN:</strong> 07AAAAA0000A1Z5</div>
                        <div><strong>Tenant:</strong> Rahul Sharma (Room 204)</div>
                        <div className="text-brand-400 font-bold pt-1">Amount: ₹12,500 (Verified)</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={onBookDemo}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 font-bold text-sm text-white transition-all shadow-lg shadow-brand-600/30"
                >
                  Request White-Label Demo
                  <ArrowRight className="h-4 w-4" />
                </button>

                <a
                  href="https://wa.me/917701953356?text=Hi%20PG%20Ease%20team,%20I%20am%20interested%20in%20a%20White-Label%20solution%20for%20my%20PG/Hostel."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-all border border-slate-700"
                >
                  WhatsApp Us
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Enterprise Guarantee Banner */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h5 className="text-base font-bold text-white">Full IP Protection & Turnkey Deployment</h5>
              <p className="text-xs sm:text-sm text-slate-400">
                Setup completed within 7 to 10 working days including Google Play Store & iOS App Store publication.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-slate-400">Starting from 50+ beds</span>
            <button
              onClick={onBookDemo}
              className="text-xs font-bold text-brand-400 hover:text-brand-300 underline underline-offset-4"
            >
              Get Custom Quotation →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
