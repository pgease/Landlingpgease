import { FileSpreadsheet, AlertCircle, Users, MessageSquare } from 'lucide-react';

const problems = [
  {
    icon: FileSpreadsheet,
    title: 'Manual rent tracking',
    description: 'Excel sheets and paper ledgers lead to errors and lost payments.',
  },
  {
    icon: AlertCircle,
    title: 'Excel sheets chaos',
    description: 'Scattered data across multiple files makes reporting and insights impossible.',
  },
  {
    icon: MessageSquare,
    title: 'Complaint mismanagement',
    description: 'Tenant complaints get lost in WhatsApp or notebooks with no follow-up.',
  },
  {
    icon: Users,
    title: 'Staff confusion',
    description: 'No clear roles or permissions—everyone does everything with no accountability.',
  },
];

export default function ProblemSection() {
  return (
    <section id="problems" className="py-20 bg-slate-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            PG Management Without the Right Tools Is Painful
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            If you run a PG or co-living space, you know these struggles too well.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:border-teal-200 hover:shadow-md transition-all"
              >
                <div className="bg-red-50 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
