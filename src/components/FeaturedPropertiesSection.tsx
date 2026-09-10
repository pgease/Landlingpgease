import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  MapPin,
  Check,
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar,
} from 'lucide-react';
import { mockProperties } from '../data/mockProperties';
import { useWishlist } from '../context/WishlistContext';
import InquiryModal from './InquiryModal';
import ScheduleTourModal from './ScheduleTourModal';
import { Property } from '../types/property';

export default function FeaturedPropertiesSection() {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [inquiryProperty, setInquiryProperty] = useState<Property | null>(null);
  const [tourProperty, setTourProperty] = useState<Property | null>(null);

  // Filter 3-4 top verified properties
  const featuredList = mockProperties
    .filter((p) => {
      if (selectedCity === 'All') return true;
      const q = selectedCity.toLowerCase();
      const pc = p.city.toLowerCase();
      if (q === 'gurgaon' || q === 'gurugram') {
        return pc === 'gurgaon' || pc === 'gurugram';
      }
      return pc.includes(q);
    })
    .slice(0, 3);

  return (
    <section className="py-20 bg-gradient-to-b from-white via-slate-50/50 to-white relative overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200/60 text-teal-800 text-xs font-bold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              Verified Accommodations & Hostels
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Explore Verified PGs in <span className="text-teal-600">Delhi NCR</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
              Transparent rent, zero brokerage, verified structural safety, and direct owner WhatsApp connectivity. 
              Find your ideal student or corporate stay today.
            </p>
          </div>

          {/* City Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60 self-start md:self-end">
            {[
              { id: 'All', label: 'All NCR' },
              { id: 'Noida', label: 'Noida' },
              { id: 'Gurgaon', label: 'Gurugram' },
              { id: 'Delhi', label: 'Delhi' },
            ].map((c) => {
              const isSelected =
                c.id === 'All'
                  ? selectedCity === 'All'
                  : selectedCity.toLowerCase() === c.id.toLowerCase();
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCity(c.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3 Featured Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredList.map((property) => {
            const isWishlisted = isInWishlist(property.id);

            return (
              <div
                key={property.id}
                className="bg-white rounded-3xl border border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
              >
                {/* Image Container with Floating Heart & Verified Badge */}
                <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                  <img
                    src={property.images[0]}
                    alt={property.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

                  {/* Verified Badge */}
                  {property.verified && (
                    <div className="absolute top-4 left-4 bg-emerald-500/95 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md backdrop-blur-sm">
                      <Check className="w-3 h-3 stroke-[3]" />
                      Verified
                    </div>
                  )}

                  {/* Floating Heart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      toggleWishlist(property.id);
                    }}
                    className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 z-10 shadow-md ${
                      isWishlisted
                        ? 'bg-rose-500 text-white shadow-rose-500/40 scale-105'
                        : 'bg-white/90 text-slate-700 hover:text-rose-500 hover:bg-white hover:scale-110'
                    }`}
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                    title={isWishlisted ? 'Saved in Wishlist' : 'Save to Wishlist'}
                  >
                    <Heart
                      className={`w-4 h-4 transition-transform ${
                        isWishlisted ? 'fill-white stroke-white' : ''
                      }`}
                    />
                  </button>

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-3 left-4 text-white">
                    <span className="text-xs font-medium text-slate-200 block">Starting from</span>
                    <span className="text-xl font-extrabold text-white drop-shadow-sm">
                      ₹{property.startingPrice.toLocaleString('en-IN')}{' '}
                      <span className="text-xs font-normal text-slate-300">/ mo</span>
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <Link
                        to={`/properties/${property.id}`}
                        className="text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-1"
                      >
                        {property.name}
                      </Link>
                    </div>

                    <div className="flex items-center gap-1 text-slate-500 text-xs mb-3">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{property.address}</span>
                    </div>

                    {/* Features / Sharing badges */}
                    <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold text-slate-600">
                      <span className="bg-slate-100 px-2.5 py-1 rounded-md">
                        🛏️ {property.sharingTypes.join(' / ')}
                      </span>
                      <span className="bg-slate-100 px-2.5 py-1 rounded-md">
                        👤 {property.genderLabel}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                    <Link
                      to={`/properties/${property.id}`}
                      className="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white text-center rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => setTourProperty(property)}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:text-teal-600 text-slate-600 transition-colors text-xs font-semibold flex items-center justify-center"
                      title="Schedule Visit"
                      aria-label="Schedule Visit"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Dual-CTA Banner */}
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-xl">
            <h3 className="text-xl sm:text-2xl font-bold">
              Looking for PGs in other sectors or campuses?
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1.5 leading-relaxed">
              Search by budget, sharing type, student/professional category, and proximity to Delhi NCR metro stations.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/find-properties"
              className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center gap-2"
            >
              <span>Explore All Verified PGs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/list-your-property"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-all border border-slate-700 flex items-center gap-2"
            >
              <Building2 className="w-4 h-4 text-teal-400" />
              <span>List Your PG Free</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Modals */}
      <InquiryModal
        isOpen={!!inquiryProperty}
        onClose={() => setInquiryProperty(null)}
        property={inquiryProperty}
      />
      <ScheduleTourModal
        isOpen={!!tourProperty}
        onClose={() => setTourProperty(null)}
        property={tourProperty}
      />
    </section>
  );
}
