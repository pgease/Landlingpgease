import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, BookOpen, Tag } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { mockBlogs } from '../data/mockBlogs';
import { BlogCategory } from '../types/blog';

const CATEGORIES: BlogCategory[] = [
  'All categories',
  'Case Study',
  'Cost of Living',
  'Growth',
  'Legal',
  'Market Trends',
  'PG Ownership',
  'Property Management',
  'Property Tax',
  'Tech',
];

export default function BlogList() {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>('All categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const filteredBlogs = useMemo(() => {
    return mockBlogs.filter((blog) => {
      const matchesCategory =
        selectedCategory === 'All categories' || blog.category === selectedCategory;
      const matchesSearch =
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / postsPerPage));
  const displayedBlogs = filteredBlogs.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col">
      <Navbar onBookDemo={() => {}} />

      {/* Ultra-Premium Hero Header with Realistic Architectural Cityscape */}
      <div className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-slate-950 text-white">
        {/* Background Image with Cinematic Dark Gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/blog_hero_bg.jpg"
            alt="Modern living architecture"
            className="w-full h-full object-cover opacity-35 scale-105 transform motion-safe:animate-subtle-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/50" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-500/15 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider mb-5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            PG Ease Intelligence & Research
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4 leading-tight">
            Rental Know-Hows & <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-300 to-teal-100">Operator Insights</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Legal guidelines, compliance playbooks, and industry market analysis built for modern Indian property owners, wardens, and discerning tenants.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Category Sidebar */}
          <aside className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Tag className="w-4 h-4 text-brand-600" />
              Category
            </h2>

            <nav className="space-y-1" aria-label="Blog categories">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentPage(1);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 font-semibold border-l-4 border-brand-600 pl-3'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isActive ? 'bg-brand-600 ring-4 ring-brand-100' : 'bg-slate-300'
                        }`}
                      />
                      {cat}
                    </span>
                    {cat === 'All categories' && (
                      <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-normal">
                        {mockBlogs.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Newsletter Mini Card */}
            <div className="mt-8 pt-6 border-t border-slate-100 bg-gradient-to-br from-brand-50/50 to-teal-50/30 -mx-2 p-4 rounded-xl border border-brand-100">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
                Landlord Weekly
              </span>
              <p className="text-xs text-slate-600 mt-1 mb-3">
                Get regulatory updates and compliance alerts delivered directly to your inbox.
              </p>
              <div className="flex gap-1.5">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-500 bg-white"
                />
                <button className="px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shrink-0">
                  Join
                </button>
              </div>
            </div>
          </aside>

          {/* Right Main Grid */}
          <div className="lg:col-span-9 space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search blogs by title, author, or category"
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200/80 rounded-2xl text-sm placeholder-slate-400 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 px-2 py-1 rounded-md"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Blogs Counter & Active Filter Badge */}
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>
                Showing <strong>{displayedBlogs.length}</strong> of <strong>{filteredBlogs.length}</strong> articles
              </span>
              {selectedCategory !== 'All categories' && (
                <span className="flex items-center gap-1 bg-brand-50 text-brand-700 font-medium px-2.5 py-1 rounded-full">
                  Category: {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory('All categories')}
                    className="ml-1 hover:text-brand-900"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>

            {/* Blog Cards Grid */}
            {displayedBlogs.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-700">No blogs found</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Try adjusting your search query or switching to another category.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All categories');
                  }}
                  className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayedBlogs.map((blog) => (
                  <article
                    key={blog.id}
                    className="group bg-white rounded-2xl border border-slate-200/80 hover:border-brand-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                  >
                    <Link to={`/blog/${blog.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                      <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm">
                        {blog.category}
                      </span>
                    </Link>

                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug mb-2">
                        <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                      </h3>

                      <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed mb-4 flex-1">
                        {blog.excerpt}
                      </p>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <img
                            src={blog.author.avatar}
                            alt={blog.author.name}
                            className="w-6 h-6 rounded-full object-cover border border-slate-200"
                          />
                          <span className="font-medium text-slate-700 truncate max-w-[100px]">
                            {blog.author.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <span>{blog.publishDate}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-8 flex justify-center items-center gap-2" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                      currentPage === page
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {totalPages > 5 && <span className="text-slate-400">...</span>}
                {totalPages > 5 && (
                  <button
                    onClick={() => setCurrentPage(48)}
                    className="w-9 h-9 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-sm font-semibold"
                  >
                    48
                  </button>
                )}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
