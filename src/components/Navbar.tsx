import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <a href="#" className="flex items-center gap-3" aria-label="PG Ease Home">
            <img
              src="/pg-ease-logo.png"
              alt="PG Ease – India's Growing PG Network"
              className="h-8 md:h-10 w-auto"
            />
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-slate-600 hover:text-teal-600 font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#pricing"
              className="bg-teal-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
            >
              Start Free Trial
            </a>
            <a
              href="mailto:support@pgeease.in?subject=Book%20a%20Demo"
              className="text-teal-600 font-semibold hover:text-teal-700 transition-colors"
            >
              Book Demo
            </a>
          </div>

          <button
            type="button"
            className="md:hidden p-2 text-slate-600 hover:text-slate-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block py-3 text-slate-600 hover:text-teal-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#pricing"
              className="block py-3 text-center bg-teal-600 text-white rounded-lg font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              Start Free Trial
            </a>
            <a
              href="mailto:support@pgeease.in?subject=Book%20a%20Demo"
              className="block py-3 text-center text-teal-600 font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              Book Demo
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
