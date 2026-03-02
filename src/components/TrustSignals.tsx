import { Building2 } from 'lucide-react';

export default function TrustSignals() {
  return (
    <section className="py-10 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-4 text-slate-600">
          <Building2 className="h-5 w-5 text-teal-600 flex-shrink-0" />
          <p className="text-sm md:text-base font-medium">
            Trusted by PG owners across Pune, Bangalore & Noida
          </p>
          <span className="hidden sm:inline text-slate-300">•</span>
          <p className="text-sm md:text-base font-medium text-teal-600">
            Most Trusted PG Management App
          </p>
        </div>
      </div>
    </section>
  );
}
