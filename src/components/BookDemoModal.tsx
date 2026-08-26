import React, { useState } from 'react';
import { X, MapPin, Loader2 } from 'lucide-react';

interface BookDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookDemoModal({ isOpen, onClose }: BookDemoModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pgName, setPgName] = useState('');
  const [location, setLocation] = useState('');
  const [detecting, setDetecting] = useState(false);

  if (!isOpen) return null;

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
          );
          const data = await res.json();
          
          if (data && data.address) {
            const addr = data.address;
            const parts = [
              addr.suburb || addr.neighbourhood || addr.road,
              addr.city || addr.town || addr.village,
              addr.state
            ].filter(Boolean);
            setLocation(parts.join(', ') || data.display_name);
          } else if (data && data.display_name) {
            setLocation(data.display_name);
          } else {
            setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
        } catch (error) {
          console.error(error);
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        } finally {
          setDetecting(false);
        }
      },
      (error) => {
        console.error(error);
        alert("Unable to retrieve location. Please type it manually.");
        setDetecting(false);
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !pgName || !location) {
      alert("Please fill in all fields.");
      return;
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10 || !/^[6-9]/.test(phoneDigits)) {
      alert("Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.");
      return;
    }

    const message = `Hello PG Ease Team! I would like to book a demo.\n\nHere are my details:\n• Name: ${name}\n• Phone: ${phone}\n• PG Name: ${pgName}\n• Location: ${location}`;
    const waUrl = `https://wa.me/917701953356?text=${encodeURIComponent(message)}`;
    
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row animate-scale-in">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-slate-900/50 hover:bg-slate-900/80 text-white p-2 rounded-full transition-colors md:bg-white/80 md:hover:bg-white md:text-slate-700 shadow-md"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left: Marketing Image */}
        <div className="hidden md:block md:w-1/2 relative bg-slate-900 min-h-[480px]">
          <img 
            src="/assets/book-demo.jpg" 
            alt="Book a Demo Now!" 
            className="absolute inset-0 h-full w-full object-cover opacity-95"
          />
        </div>

        {/* Right: Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-center overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Book a Free Demo</h2>
            <p className="text-slate-500 text-sm mt-1">
              Fill in your details to connect with us on WhatsApp.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="modal-name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Your Name
              </label>
              <input 
                id="modal-name"
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Saksham Sharma"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm transition-shadow shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="modal-phone" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Mobile Number
              </label>
              <input 
                id="modal-phone"
                type="tel" 
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="e.g. 9988776655"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm transition-shadow shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="modal-pgname" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                PG / Hostel Name
              </label>
              <input 
                id="modal-pgname"
                type="text" 
                required
                value={pgName}
                onChange={(e) => setPgName(e.target.value)}
                placeholder="e.g. Royal PG"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm transition-shadow shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="modal-location" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                PG Location
              </label>
              <div className="relative">
                <input 
                  id="modal-location"
                  type="text" 
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Sector 62, Noida"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm transition-shadow shadow-sm"
                />
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={detecting}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-600 transition-colors"
                  title="Auto detect location"
                >
                  {detecting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <MapPin className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 text-sm"
            >
              Get Demo on WhatsApp
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
