import { Mail, Instagram, Linkedin, Twitter } from 'lucide-react';

const quickLinks = [
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#faq', label: 'FAQ' },
];

export default function Footer() {
  return (
    <footer id="contact" className="bg-slate-900 text-white pt-16 pb-8 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              {/* <img
                src="/pg-ease-logo.png"
                alt="PG Ease logo"
                className="h-8 md:h-10 w-auto brightness-0 invert opacity-90"
              /> */}
              <span className="text-sm md:text-base font-semibold tracking-tight">
                PG Ease
              </span>
            </div>
            <p className="text-slate-400 mb-4 max-w-sm">
              PG Ease – India's Growing PG Network. The best PG management system for owners, co-living operators and hostel owners.
            </p>
            <a
              href="mailto:support@pgeease.in"
              className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 font-medium transition-colors"
            >
              <Mail className="h-5 w-5" />
              support@pgeease.in
            </a>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="/privacy" className="text-slate-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-slate-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>

            <h3 className="font-semibold text-white mt-6 mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/pgease.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} PG Ease. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
