import { useState } from 'react';
import {
  CheckCircle2,
  Building,
  ShieldCheck,
  Globe,
  Sparkles,
  ArrowRight,
  CreditCard,
  Users,
  Star,
  MessageSquare,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PROPERTY_TYPES = [
  { id: 'pg', label: 'Paying Guest (PG)', icon: Building, desc: 'Boys, Girls, or Unisex PGs' },
  { id: 'co-living', label: 'Co-living Space', icon: Users, desc: 'Modern shared living spaces' },
  { id: 'hostel', label: 'Student Hostel', icon: Globe, desc: 'Campus & education cluster dorms' },
  { id: 'flat', label: 'Apartments / Flats', icon: Sparkles, desc: 'Furnished rental apartments' },
];

const MAJOR_CITIES = [
  'Noida',
  'Gurugram',
  'Delhi (North Campus)',
  'Delhi (South Campus)',
  'Bengaluru (HSR / Koramangala)',
  'Pune',
  'Mumbai',
  'Hyderabad',
  'Other City',
];

export default function ListYourProperty() {
  const [propertyName, setPropertyName] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [city, setCity] = useState('Noida');
  const [managerName, setManagerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [selectedType, setSelectedType] = useState('pg');
  const [numberOfBeds, setNumberOfBeds] = useState('40');
  const [email, setEmail] = useState('');
  const [needsPhotography, setNeedsPhotography] = useState(false);
  const [wantsDemo, setWantsDemo] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col">
      <Navbar onBookDemo={() => {}} />

      {/* Main Split Layout */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-32 pb-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Value Proposition & Trust Signals */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                Partner with PG Ease
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Scale Your PG. <br />
                <span className="text-brand-600">Automate Operations.</span>
              </h1>

              <p className="text-slate-600 text-sm sm:text-base mt-4 leading-relaxed">
                Join 500+ verified property owners across India. Get a dedicated website for your PG, 
                automated UPI rent collections, and digital tenant KYC within 24 hours.
              </p>
            </div>

            {/* 4 Pillars */}
            <div className="space-y-4">
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-brand-600 flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Your Own Branded Property Website</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Showcase rooms, amenities, 360 photos, and accept direct tenant bookings without brokerage.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">100% Automated Rent Collection</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Automated WhatsApp reminders, instant UPI QR links, and real-time ledger accounting.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Paperless Police & Aadhaar KYC</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Government Digio verification in under 2 minutes. Stay 100% legally compliant without paperwork.
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md">
              <div className="flex items-center gap-1 text-amber-400 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-200 leading-relaxed italic mb-4">
                "PG Ease completely eliminated payment delays in my 120-bed property in Sector 62. On-time rent collection jumped from 82% to 99%, and tenants love the smart app."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-500 text-white font-bold text-xs flex items-center justify-center">
                  VS
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Vikas Singh</p>
                  <p className="text-[11px] text-slate-400">Owner, Stays Elite PG • Noida</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: High-Converting Card Form */}
          <div className="lg:col-span-7">
            {isSubmitted ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center shadow-xl">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 animate-bounce">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                  Registration Received
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 mb-3">
                  Welcome to the PG Ease Family!
                </h2>
                <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed mb-6">
                  Thank you, <strong className="text-slate-900">{managerName}</strong>. Our city onboarding specialist for{' '}
                  <strong className="text-slate-900">{city}</strong> has been notified and will call you at{' '}
                  <strong className="text-slate-900">+91 {contactNumber}</strong> within 15 minutes to set up your free website and app.
                </p>

                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-left text-xs text-slate-700 max-w-md mx-auto mb-8 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Property Name:</span>
                    <span className="font-bold text-slate-900">{propertyName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span className="font-semibold text-slate-900">{propertyAddress}, {city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Capacity:</span>
                    <span className="font-semibold text-slate-900">{numberOfBeds} Beds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Registered Email:</span>
                    <span className="font-semibold text-slate-900">{email}</span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                  <a
                    href={`https://wa.me/917701953356?text=${encodeURIComponent(`Hi PG Ease team, I just submitted property registration for ${propertyName} with ${numberOfBeds} beds in ${city}. Please fast-track my setup.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Fast-Track on WhatsApp
                  </a>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-3 bg-white border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Register Another Property
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                {/* Form Header */}
                <div className="bg-gradient-to-r from-brand-600 to-teal-700 p-6 sm:p-8 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black">Get Your Property Website & App</h2>
                      <p className="text-teal-100 text-xs sm:text-sm mt-1">
                        Free onboarding • Zero upfront charges • Setup in 24 hours
                      </p>
                    </div>
                    <div className="hidden sm:block">
                      <span className="text-[11px] font-bold bg-white/15 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/20">
                        ⚡ 2-Min Setup
                      </span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                  {/* Property Type Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                      1. Select Property Type *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {PROPERTY_TYPES.map((pt) => {
                        const Icon = pt.icon;
                        const isSelected = selectedType === pt.id;
                        return (
                          <button
                            type="button"
                            key={pt.id}
                            onClick={() => setSelectedType(pt.id)}
                            className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                              isSelected
                                ? 'border-brand-600 bg-brand-50/60 ring-2 ring-brand-500/20'
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900">{pt.label}</p>
                              <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{pt.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Property Name & City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Property Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={propertyName}
                        onChange={(e) => setPropertyName(e.target.value)}
                        placeholder="e.g. Royal Residency or Madhav PG"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        City / Location Cluster *
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-brand-500 outline-none text-slate-800"
                      >
                        {MAJOR_CITIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Complete Property Address */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Complete Property Address & Landmark *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={propertyAddress}
                      onChange={(e) => setPropertyAddress(e.target.value)}
                      placeholder="Plot No., Sector, Road Name, Nearest Metro or landmark"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Capacity & Manager Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Total Beds Capacity *
                      </label>
                      <input
                        type="number"
                        min={1}
                        required
                        value={numberOfBeds}
                        onChange={(e) => setNumberOfBeds(e.target.value)}
                        placeholder="e.g. 50"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-brand-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Owner / Manager Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={managerName}
                        onChange={(e) => setManagerName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-brand-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Contact Number & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        WhatsApp Contact Number *
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3.5 text-sm font-semibold text-slate-500 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          pattern="[0-9]{10}"
                          maxLength={10}
                          value={contactNumber}
                          onChange={(e) => setContactNumber(e.target.value.replace(/\D/g, ''))}
                          placeholder="10-digit number"
                          className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-r-xl text-sm focus:bg-white focus:border-brand-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="owner@gmail.com"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-brand-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Additional Assistance Options */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <label className="flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={wantsDemo}
                        onChange={(e) => setWantsDemo(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                      />
                      <span>Send software walkthrough demo and pricing deck on WhatsApp</span>
                    </label>

                    <label className="flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={needsPhotography}
                        onChange={(e) => setNeedsPhotography(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                      />
                      <span>I need professional photography assistance for my property website</span>
                    </label>
                  </div>

                  {/* Submit CTA */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Submitting Property Details...
                        </>
                      ) : (
                        <>
                          Submit & Get Free Property Website
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Your contact details are 100% private. No spam guarantee.</span>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
