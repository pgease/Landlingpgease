import { Mail, Instagram, Linkedin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={props.className}
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.66.986 3.284 1.48 4.961 1.482 5.485 0 9.948-4.461 9.951-9.94.001-2.653-1.02-5.148-2.877-7.005C16.868 1.833 14.379.81 11.722.81c-5.486 0-9.948 4.463-9.952 9.943-.001 1.902.501 3.753 1.456 5.375L2.2 22.2l6.108-1.603z" />
    <path d="M17.962 14.397c-.327-.164-1.936-.957-2.235-1.066-.299-.108-.517-.164-.735.164-.218.327-.844 1.066-1.035 1.284-.19.218-.38.245-.707.081-.327-.164-1.381-.508-2.63-1.622-.972-.867-1.628-1.938-1.819-2.265-.19-.327-.02-.504.143-.666.147-.146.327-.382.49-.573.163-.19.218-.327.327-.546.109-.218.055-.409-.027-.573-.082-.164-.735-1.771-1.007-2.428-.266-.641-.53-.553-.735-.563-.19-.01-.409-.012-.627-.012-.218 0-.572.082-.871.409-.3.327-1.145 1.118-1.145 2.727s1.173 3.164 1.336 3.382c.164.218 2.307 3.524 5.59 4.943.78.337 1.39.539 1.864.69.784.249 1.497.214 2.061.129.629-.094 1.936-.791 2.208-1.518.272-.727.272-1.353.19-1.48-.082-.127-.299-.218-.626-.382z" />
  </svg>
);

const footerLinks = {
  Company: [
    { label: 'About', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Demo', href: '/demo' },
    { label: 'Owner Login', href: 'https://app.pgease.in/' },
    { label: 'Contact', href: 'mailto:support@pgease.in' },
  ],
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Mobile App', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Refund Policy', href: '/refund-policy' },
  ],
};

const socialLinks = [
  {
    icon: Instagram,
    href: 'https://instagram.com/pgease.in',
    label: 'Instagram',
  },
  {
    icon: Linkedin,
    href: 'https://www.linkedin.com/company/pg-ease-solutions/',
    label: 'LinkedIn',
  },
  {
    icon: WhatsAppIcon,
    href: 'https://wa.me/917701953356',
    label: 'WhatsApp Us',
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="col-span-2">
            <div className="flex items-center mb-4">
              <img
                src="/assets/logo-transparent.png"
                alt="PG Ease"
                className="h-10 w-auto"
              />
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-5 max-w-sm">
              The all-in-one digital platform for PG owners to manage tenants,
              beds, rent collection, and daily operations.
            </p>

            {/* Contact Info */}
            <div className="flex flex-col gap-3">
              <a
                href="mailto:support@pgease.in"
                className="inline-flex items-center gap-2 text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors"
              >
                <Mail className="h-4 w-4" />
                support@pgease.in
              </a>

              <a
                href="tel:+917701953356"
                className="inline-flex items-center gap-2 text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors"
              >
                <Phone className="h-4 w-4" />
                +91 77019 53356
              </a>

              <a
                href="https://wa.me/917701953356"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors"
              >
                <WhatsAppIcon className="h-4 w-4" />
                +91 77019 53356
              </a>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-5">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-all"
                    aria-label={social.label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-white text-sm mb-4">
                {title}
              </h3>

              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('/') ? (
                      <Link
                        to={link.href}
                        className="text-slate-400 hover:text-white text-sm transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-slate-400 hover:text-white text-sm transition-colors"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
          <p>
            &copy; {2025} PG Ease Solutions. All rights
            reserved.
          </p>

          <p>Made specially for Indian PG & Hostel owners.</p>
        </div>
      </div>
    </footer>
  );
}
