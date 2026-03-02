import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img
              src="/3477_201225_pg_ease_bs-png-01.png"
              alt="PG Ease Logo"
              style={{ height: '10rem', width: 'auto' }}
            />
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-[#008080] transition-colors">Features</a>
            <a href="#pricing" className="text-gray-700 hover:text-[#008080] transition-colors">Pricing</a>
            <a href="#testimonials" className="text-gray-700 hover:text-[#008080] transition-colors">Testimonials</a>
            <a href="#contact" className="text-gray-700 hover:text-[#008080] transition-colors">Contact</a>
            <button className="bg-[#008080] text-white px-6 py-2 rounded-lg hover:bg-[#006666] transition-colors">
              Get Started Free
            </button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 pt-2 pb-4 space-y-3">
            <a href="#features" className="block py-2 text-gray-700 hover:text-[#008080]">Features</a>
            <a href="#pricing" className="block py-2 text-gray-700 hover:text-[#008080]">Pricing</a>
            <a href="#testimonials" className="block py-2 text-gray-700 hover:text-[#008080]">Testimonials</a>
            <a href="#contact" className="block py-2 text-gray-700 hover:text-[#008080]">Contact</a>
            <button className="w-full bg-[#008080] text-white px-6 py-2 rounded-lg hover:bg-[#006666] transition-colors">
              Get Started Free
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
