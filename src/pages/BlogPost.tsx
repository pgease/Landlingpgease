import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Share2,
  Check,
  ShieldCheck,
  ChevronRight,
  AlertTriangle,
  Building,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { mockBlogs } from '../data/mockBlogs';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [copied, setCopied] = useState(false);

  const blog = mockBlogs.find((b) => b.slug === slug);

  if (!blog) {
    return <Navigate to="/blog" replace />;
  }

  const relatedBlogs = mockBlogs
    .filter((b) => b.id !== blog.id)
    .slice(0, 3);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col">
      <Navbar onBookDemo={() => {}} />

      {/* Article Header & Breadcrumbs */}
      <div className="pt-24 lg:pt-32 pb-8 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <Link to="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <Link to="/blog" className="hover:text-slate-900 transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-700 font-medium truncate max-w-[240px]">
              {blog.category}
            </span>
          </nav>

          {/* Category Pill */}
          <span className="inline-block px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            {blog.category}
          </span>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.18] mb-6">
            {blog.title}
          </h1>

          {/* Author & Meta Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <img
                src={blog.author.avatar}
                alt={blog.author.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-brand-200"
              />
              <div>
                <p className="text-sm font-bold text-slate-900">{blog.author.name}</p>
                <p className="text-xs text-slate-500">{blog.author.role || 'Compliance Researcher'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                {blog.publishDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                {blog.readTime}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-2 mb-10 w-full">
        <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[16/9] border border-slate-200">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-2">
            <Building className="w-4 h-4 text-brand-300" />
            <span>Case Analysis • Ground Zero Report</span>
          </div>
        </div>
      </div>

      {/* Article Body & Sidebar */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 mb-16 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Article Content */}
          <article className="lg:col-span-12 prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600">
            {/* Excerpt callout */}
            <div className="bg-amber-50/60 border-l-4 border-amber-500 p-5 rounded-r-2xl mb-8 not-prose">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-900 font-medium leading-relaxed m-0">
                  {blog.excerpt}
                </p>
              </div>
            </div>

            {/* Markdown rendered sections */}
            <div
              className="space-y-6 text-slate-700 text-base leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: blog.content
                  .replace(/## (.*)/g, '<h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">$1</h2>')
                  .replace(/### (.*)/g, '<h3 class="text-xl font-bold text-slate-800 mt-6 mb-3">$1</h3>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
                  .replace(/\n\n/g, '<p class="my-4 text-slate-600 leading-relaxed">')
                  .replace(/- (.*)/g, '<li class="ml-6 list-disc text-slate-600 my-1">$1</li>'),
              }}
            />

            {/* Compliance Callout Card */}
            <div className="mt-12 not-prose bg-gradient-to-br from-brand-600 to-teal-800 text-white rounded-3xl p-8 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-7 h-7 text-teal-300" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Are Your Properties 100% Audit-Ready?
                  </h3>
                  <p className="text-teal-100 text-sm leading-relaxed mb-5">
                    PG Ease helps property owners digitize police verifications, track floor structural limits, and keep building NOCs updated. Avoid heavy municipal fines and secure your tenants today.
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      to="/list-your-property"
                      className="px-5 py-2.5 bg-white text-brand-800 hover:bg-teal-50 font-bold text-sm rounded-xl transition-colors shadow-sm"
                    >
                      Get PG Ease Software
                    </Link>
                    <a
                      href="https://wa.me/917701953356"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-teal-700/50 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl border border-white/20 transition-colors"
                    >
                      Chat with Safety Expert
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Share & Copy Link */}
            <div className="mt-10 pt-6 border-t border-slate-200 not-prose flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Share2 className="w-4 h-4 text-brand-600" />
                Share this article:
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Copied!
                    </>
                  ) : (
                    'Copy Link'
                  )}
                </button>

                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(blog.title + ' ' + window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                >
                  WhatsApp
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-sky-50 hover:bg-sky-100 text-sky-700 transition-colors"
                >
                  Twitter
                </a>

                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </article>
        </div>

        {/* Related Articles Section */}
        <section className="mt-16 pt-12 border-t border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Recommended Reading</h2>
            <Link
              to="/blog"
              className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              View all blogs <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedBlogs.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/80 hover:border-brand-300 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col"
              >
                <Link to={`/blog/${item.slug}`} className="block relative aspect-[16/10] overflow-hidden">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-white/95 text-slate-800 text-xs font-semibold px-2 py-0.5 rounded-md">
                    {item.category}
                  </span>
                </Link>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-slate-900 text-sm hover:text-brand-600 transition-colors line-clamp-2 mb-2">
                    <Link to={`/blog/${item.slug}`}>{item.title}</Link>
                  </h3>
                  <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>{item.author.name}</span>
                    <span>{item.publishDate}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
