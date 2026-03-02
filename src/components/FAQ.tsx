import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What is the best PG management system in India?',
    answer: 'PG Ease is among the best PG management systems in India. It offers tenant management, automated rent collection, complaint tracking, staff roles, real-time dashboard and multi-property support—all in one app. Trusted by 100+ PG owners across Pune, Bangalore and Hyderabad.',
  },
  {
    question: 'How to manage PG rent digitally?',
    answer: 'With PG Ease you can manage PG rent digitally by collecting payments via UPI, sending WhatsApp rent reminders, tracking dues in the dashboard and auto-generating rent receipts. No more Excel or cash—everything is recorded and visible in one place.',
  },
  {
    question: 'Is PG Ease suitable for small PG owners?',
    answer: 'Yes. PG Ease has a Free plan for small PGs to start digital management at no cost. You can add tenants, track vacancy, log complaints and manage notice periods. When you scale, you can upgrade to Premium or Pro for automation and advanced features.',
  },
  {
    question: 'How does PG Ease help automate PG operations?',
    answer: 'PG Ease automates rent collection (UPI), rent reminders (WhatsApp), late fee calculation, rent receipts, complaint assignment to staff, and reporting. You get a real-time dashboard for occupancy and dues, reducing manual work and errors.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 bg-white scroll-mt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-600">
            Common questions about PG Ease and PG management
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left font-semibold text-slate-900 hover:bg-slate-100/50 transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 flex-shrink-0 text-teal-600 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 pt-0">
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
