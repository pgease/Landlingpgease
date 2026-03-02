import { Building2, CheckCircle2 } from 'lucide-react';

export default function TrustSignals() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 text-gray-700 mb-8">
            <Building2 className="h-6 w-6 text-[#008080]" />
            <p className="text-lg font-medium">
              Trusted by PG owners across Pune, Bangalore & Hyderabad
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-[#008080] to-[#00a0a0] rounded-2xl p-8 text-white shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Owner App Features</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>Complete tenant management</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>Automated rent collection via UPI</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>WhatsApp rent reminders</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>Multi-PG support</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl p-8 text-white shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Tenant App Features</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>Search PGs by location</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>Pay rent online instantly</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>Raise complaints easily</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>View PG details & amenities</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
