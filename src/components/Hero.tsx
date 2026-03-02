export default function Hero() {
  return (
    <section className="pt-28 pb-20 md:pt-32 md:pb-24 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <p className="text-slate-600 font-medium mb-4">
            PG Ease – India's Growing PG Network
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
            India's Most Trusted PG Management System
          </h1>

          <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            Automate rent tracking, tenant management and complaints—all in one place. Stop juggling Excel sheets and WhatsApp. Run your PG like a pro.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <a
              href="#pricing"
              className="inline-flex justify-center items-center bg-teal-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-teal-700 transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              Start Free Trial
            </a>
            <a
              href="mailto:support@pgeease.in?subject=Book%20a%20Demo%20-%20PG%20Ease"
              className="inline-flex justify-center items-center bg-white text-teal-600 px-8 py-4 rounded-xl text-lg font-semibold border-2 border-teal-600 hover:bg-teal-50 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              Book Demo
            </a>
          </div>

          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            Trusted by 100+ PG Owners
          </div>
        </div>
      </div>
    </section>
  );
}
