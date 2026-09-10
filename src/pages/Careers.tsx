import { useState, useMemo } from 'react';
import {
  MapPin,
  Sparkles,
  Zap,
  Heart,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ApplyJobModal from '../components/ApplyJobModal';
import { mockJobs } from '../data/mockJobs';
import { Department, JobListing } from '../types/career';

const DEPARTMENTS: Department[] = [
  'All',
  'Engineering',
  'Product & Design',
  'Sales & Operations',
  'Growth & Marketing',
];

export default function Careers() {
  const [selectedDept, setSelectedDept] = useState<Department>('All');
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  const filteredJobs = useMemo(() => {
    if (selectedDept === 'All') return mockJobs;
    return mockJobs.filter((j) => j.department === selectedDept);
  }, [selectedDept]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col">
      <Navbar onBookDemo={() => {}} />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 bg-white border-b border-slate-100 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            We Are Hiring Top Talent
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
            Build the Operating System for <span className="text-brand-600">Urban Living</span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            Over 50 million students and young professionals move away from home every year in India.
            We are building the intelligent software infrastructure that transforms how PGs, hostels,
            and rental properties operate.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-2xl sm:text-3xl font-extrabold text-brand-600 block">500+</span>
              <span className="text-xs text-slate-500 font-medium">PG Owners Empowered</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-2xl sm:text-3xl font-extrabold text-brand-600 block">25,000+</span>
              <span className="text-xs text-slate-500 font-medium">Beds Managed</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-2xl sm:text-3xl font-extrabold text-brand-600 block">₹100 Cr+</span>
              <span className="text-xs text-slate-500 font-medium">Rent Processed</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-2xl sm:text-3xl font-extrabold text-brand-600 block">10x</span>
              <span className="text-xs text-slate-500 font-medium">Year-on-Year Growth</span>
            </div>
          </div>
        </div>
      </section>

      {/* Perks / Culture Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Why Build with PG Ease?</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            A team culture designed for rapid learning, true autonomy, and meaningful impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-2">High Ownership & Autonomy</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We despise red tape. Own your roadmap, ship features into production daily, and see the
              direct impact on real business owners.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-2">Competitive Pay & ESOPs</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Top-tier compensation matching market benchmarks, coupled with meaningful startup equity so
              everyone wins when the company wins.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-2">Wellness & Health Coverage</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Comprehensive medical insurance for you and your dependents, flexible time-off policies,
              and modern remote-first ergonomics.
            </p>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-12 bg-white border-t border-slate-200/80 flex-1 w-full" id="openings">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Current Openings</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Explore open roles across Engineering, Product, Design, and City Operations.
              </p>
            </div>

            {/* Department Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-xl">
              {DEPARTMENTS.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    selectedDept === dept
                      ? 'bg-white text-brand-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Job Listings List */}
          <div className="space-y-4">
            {filteredJobs.map((job) => {
              const isExpanded = expandedJobId === job.id;
              return (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-brand-300 shadow-sm hover:shadow-md transition-all p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs font-semibold px-2.5 py-0.5 bg-brand-50 text-brand-700 rounded-md">
                          {job.department}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500 font-medium">{job.type}</span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500 font-medium">{job.experience}</span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {job.location}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-emerald-600">{job.salary}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                        className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                      >
                        {isExpanded ? 'Hide Details' : 'View Details'}
                      </button>
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                      >
                        Apply Now <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Collapsible Details */}
                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
                      <div>
                        <h4 className="font-bold text-slate-900 mb-2">What you will do:</h4>
                        <ul className="space-y-1.5 list-disc pl-4">
                          {job.responsibilities.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-2">What we are looking for:</h4>
                        <ul className="space-y-1.5 list-disc pl-4">
                          {job.requirements.map((req, i) => (
                            <li key={i}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />

      {/* Interactive Application Modal */}
      <ApplyJobModal
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        job={selectedJob}
      />
    </div>
  );
}
