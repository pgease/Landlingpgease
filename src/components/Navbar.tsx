import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { href: '/find-properties', label: 'Find Properties', isInternal: true },
  { href: '/blog', label: 'Blog', isInternal: true },
  { href: '/list-your-property', label: 'List Property', isInternal: true },
  { href: '/#features', label: 'Features', isInternal: false },
  { href: '/#pricing', label: 'Pricing', isInternal: false },
];

interface NavbarProps {
  onBookDemo?: () => void;
}

export default function Navbar({ onBookDemo }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white border-b border-slate-200/80 shadow-sm'
          : 'bg-white border-b border-slate-100'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center" aria-label="PG Ease Home">
            <img
              src="/assets/logo-transparent.png"
              alt="PG Ease – Modern PG Management Platform"
              className="h-8 sm:h-9 lg:h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.isInternal &&
                (location.pathname === link.href ||
                  (link.href === '/blog' && location.pathname.startsWith('/blog')) ||
                  (link.href === '/find-properties' &&
                    (location.pathname.startsWith('/find-properties') ||
                      location.pathname.startsWith('/properties'))));

              if (link.isInternal) {
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`px-3.5 py-2 text-sm rounded-lg transition-colors ${
                      isActive
                        ? 'text-brand-700 bg-brand-50/70 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              }

              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Careers Pill */}
            <Link
              to="/careers"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              We're hiring
            </Link>

            {/* Owner Login Link */}
            <a
              href="https://app.pgease.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
            >
              Login
            </a>

            {/* Book Demo Button */}
            {onBookDemo && (
              <button
                onClick={onBookDemo}
                className="px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
              >
                Book Demo
              </button>
            )}

            {/* List PG Free Button */}
            <Link
              to="/list-your-property"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors shadow-sm"
            >
              List PG Free
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
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

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              if (link.isInternal) {
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="block px-4 py-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg font-medium text-sm transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              }
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg font-medium text-sm transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              );
            })}

            <Link
              to="/careers"
              className="flex items-center gap-2 px-4 py-2.5 text-blue-700 hover:bg-blue-50 rounded-lg font-semibold text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              We're hiring
            </Link>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <a
                href="https://app.pgease.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2.5 text-center text-slate-700 font-semibold rounded-lg border border-slate-200 text-sm hover:bg-slate-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </a>
              {onBookDemo && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onBookDemo();
                  }}
                  className="block w-full px-4 py-2.5 text-center text-slate-700 font-semibold rounded-lg border border-slate-200 text-sm hover:bg-slate-50"
                >
                  Book Demo
                </button>
              )}
              <Link
                to="/list-your-property"
                className="block px-4 py-2.5 text-center text-white bg-brand-600 hover:bg-brand-700 rounded-lg font-semibold text-sm shadow-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                List PG Free
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
