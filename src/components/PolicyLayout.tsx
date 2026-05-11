import { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import Footer from '../components/Footer';

interface Section {
  title: string;
  content: ReactNode;
}

interface PolicyLayoutProps {
  title: string;
  lastUpdated: string;
  intro: ReactNode;
  sections: Section[];
}

export default function PolicyLayout({ title, lastUpdated, intro, sections }: PolicyLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 antialiased">
      {/* Minimal header */}
      <header className="bg-white border-b border-slate-200/60 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center" aria-label="PG Ease Home">
            <img
              src="/assets/logo.png"
              alt="PG Ease"
              className="h-9 w-auto"
            />
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </a>
        </div>
      </header>

      <main className="py-12 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="mb-10">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-xs font-semibold uppercase tracking-wide mb-4">
              Legal
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">{title}</h1>
            <p className="text-sm text-slate-500">Last Updated: {lastUpdated}</p>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-200 mb-10" />

          {/* Intro */}
          <div className="prose-intro text-slate-600 leading-relaxed space-y-3 mb-12 text-[15px]">
            {intro}
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.title} className="scroll-mt-24">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                  {section.title}
                </h2>
                <div className="text-slate-600 leading-relaxed text-[15px] space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_p]:leading-relaxed">
                  {section.content}
                </div>
              </section>
            ))}
          </div>

          {/* Bottom contact card */}
          <div className="mt-16 p-6 rounded-2xl bg-gradient-to-br from-brand-600 to-teal-500 text-white">
            <h3 className="text-lg font-semibold mb-1">Questions about this policy?</h3>
            <p className="text-teal-100 text-sm mb-4">
              Reach out and we'll be happy to help clarify anything.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:support@pgeease.in"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white text-brand-700 font-semibold text-sm hover:bg-teal-50 transition-colors shadow-sm"
              >
                support@pgeease.in
              </a>
              <a
                href="tel:+917701953356"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white/20 text-white font-semibold text-sm hover:bg-white/30 transition-colors border border-white/30"
              >
                +91 77019 53356
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
