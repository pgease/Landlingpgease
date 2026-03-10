import { FileSpreadsheet, Users, CreditCard, MessageSquare } from 'lucide-react';

const problems = [
  {
    icon: FileSpreadsheet,
    title: 'Manual Rent Tracking',
    description:
      'Paper ledgers and Excel sheets lead to missed payments, calculation errors, and endless reconciliation headaches every month.',
    color: 'bg-red-50 text-red-500',
  },
  {
    icon: Users,
    title: 'Tenant Record Chaos',
    description:
      'Tenant details scattered across notebooks, WhatsApp chats, and memory. No single source of truth for who is in which room.',
    color: 'bg-orange-50 text-orange-500',
  },
  {
    icon: CreditCard,
    title: 'Payment Confusion',
    description:
      'Cash payments with no receipts. "Did they pay?" arguments. Zero visibility into pending dues and payment history.',
    color: 'bg-amber-50 text-amber-500',
  },
  {
    icon: MessageSquare,
    title: 'Communication Issues',
    description:
      'Important updates lost in WhatsApp groups. No structured way to send rent reminders, notices, or announcements.',
    color: 'bg-rose-50 text-rose-500',
  },
];

export default function ProblemSection() {
  return (
    <section className="py-20 md:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-brand-600 font-semibold text-sm uppercase tracking-wider mb-3">
            The Problem
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 text-balance">
            Managing a PG Shouldn't Feel Like a Second Job
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            PG owners across India face the same operational nightmares every day.
            Sound familiar?
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {problems.map((item, index) => {
            const Icon = item.icon;
            return (
              <article
                key={index}
                className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100 hover:border-brand-200 transition-all group"
              >
                <div className={`rounded-xl w-12 h-12 flex items-center justify-center mb-5 ${item.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
