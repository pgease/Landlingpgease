import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#testimonials', label: 'Testimonials' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white border-b border-slate-200/60 shadow-sm'
          : 'bg-white'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex justify-between items-center h-16 lg:h-20">
          <a href="#" className="flex items-center" aria-label="PG Ease Home">
            <img
              src="/assets/logo.png"
              alt="PG Ease – PG Management Platform"
              className="h-9 lg:h-10 w-auto"
            />
          </a>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <a
              href="mailto:support@pgeease.in?subject=Book%20a%20Demo"
              className="px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
            >
              Book Demo
            </a>
            <a
              href="#pricing"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors shadow-sm"
            >
              Start Free
            </a>
          </div>

          <button
            type="button"
            className="lg:hidden p-2 -mr-2 text-slate-600 hover:text-slate-900 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <a
                href="mailto:support@pgeease.in?subject=Book%20a%20Demo"
                className="block px-4 py-3 text-center text-slate-700 font-semibold rounded-lg border border-slate-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Book Demo
              </a>
              <a
                href="#pricing"
                className="block px-4 py-3 text-center text-white bg-brand-600 rounded-lg font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                Start Free
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
