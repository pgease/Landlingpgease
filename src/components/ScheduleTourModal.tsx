import React, { useState } from 'react';
import { X, Video, MapPin, PhoneCall, CheckCircle2 } from 'lucide-react';
import { Property } from '../types/property';
import { showTourBookedAlert } from '../utils/alerts';

export type TourType = 'video' | 'visit' | 'call';

interface ScheduleTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  initialType?: TourType;
}

export default function ScheduleTourModal({
  isOpen,
  onClose,
  property,
  initialType = 'visit',
}: ScheduleTourModalProps) {
  const [selectedType, setSelectedType] = useState<TourType>(initialType);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('11:00 AM - 12:00 PM');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !property) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      showTourBookedAlert(property.name, date, timeSlot, selectedType);
    }, 600);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setName('');
    setPhone('');
    onClose();
  };

  const timeSlots = [
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '02:00 PM - 03:00 PM',
    '04:00 PM - 05:00 PM',
    '06:00 PM - 07:00 PM',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-teal-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {selectedType === 'video'
                ? 'Video Tour Scheduled!'
                : selectedType === 'visit'
                ? 'In-Person Visit Confirmed!'
                : 'Callback Scheduled!'}
            </h3>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              We have reserved your slot with the manager of{' '}
              <strong className="text-slate-800">{property.name}</strong> on{' '}
              <strong className="text-slate-800">{date}</strong> during{' '}
              <strong className="text-slate-800">{timeSlot}</strong>.
            </p>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-left text-xs text-slate-600 space-y-1.5 mb-6">
              <div className="flex justify-between">
                <span>Type:</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {selectedType === 'video' ? 'Live Video Tour (WhatsApp/Meet)' : selectedType === 'visit' ? 'In-Person Visit' : 'Manager Phone Call'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tenant Name:</span>
                <span className="font-semibold text-slate-800">{name}</span>
              </div>
              <div className="flex justify-between">
                <span>Phone:</span>
                <span className="font-semibold text-slate-800">+91 {phone}</span>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="p-6 sm:p-8">
            <div className="mb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
                Real time or Reel time; you choose
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">Schedule Tour / Call</h3>
              <p className="text-xs text-slate-500 mt-0.5">{property.name} • {property.address}</p>
            </div>

            {/* Tour Type Selector */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              <button
                type="button"
                onClick={() => setSelectedType('video')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  selectedType === 'video'
                    ? 'border-brand-600 bg-brand-50/70 text-brand-700 font-semibold shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Video className="w-5 h-5 mb-1 text-brand-600" />
                <span className="text-xs">Live Video</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType('visit')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  selectedType === 'visit'
                    ? 'border-brand-600 bg-brand-50/70 text-brand-700 font-semibold shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <MapPin className="w-5 h-5 mb-1 text-brand-600" />
                <span className="text-xs">Visit Property</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType('call')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  selectedType === 'call'
                    ? 'border-brand-600 bg-brand-50/70 text-brand-700 font-semibold shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <PhoneCall className="w-5 h-5 mb-1 text-brand-600" />
                <span className="text-xs">Phone Call</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Mobile *</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm text-slate-500 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit number"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-r-xl focus:bg-white focus:border-brand-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Select Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Slot</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-2 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-all shadow-md mt-4 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Confirm Appointment'
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
