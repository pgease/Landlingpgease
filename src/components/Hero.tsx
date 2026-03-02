import { Instagram } from 'lucide-react';

export default function Hero() {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-[#008080] to-[#00a0a0] text-white shadow-lg">
              50% OFF for 1st Month
            </span>
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-700 border border-gray-200">
              Available on Play Store & App Store
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            India's Smartest PG Management App — Built for Owners & Tenants
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
            Manage tenants, rent, complaints & payments effortlessly. Tenants can search PGs like OYO, pay rent, and raise complaints — all in one app.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button className="bg-[#008080] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#006666] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Get Started Free
            </button>
            <button className="bg-white text-[#008080] px-8 py-4 rounded-lg text-lg font-semibold border-2 border-[#008080] hover:bg-gray-50 transition-all">
              View Pricing
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Instagram className="h-5 w-5 text-[#008080]" />
            <span>Follow us on Instagram:</span>
            <a
              href="https://instagram.com/pgease.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#008080] font-semibold hover:underline"
            >
              @pgease.in
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
