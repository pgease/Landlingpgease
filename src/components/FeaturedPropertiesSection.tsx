import { useState, useEffect } from 'react';
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
import { useWishlist } from '../context/WishlistContext';
import InquiryModal from './InquiryModal';
import ScheduleTourModal from './ScheduleTourModal';
import { Property, RoomSharingType } from '../types/property';
import { API_BASE } from '../config/api';

export default function FeaturedPropertiesSection() {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [inquiryProperty, setInquiryProperty] = useState<Property | null>(null);
  const [tourProperty, setTourProperty] = useState<Property | null>(null);

  // Live dynamic properties state (strictly no hardcoded mock PGs)
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function loadFeatured() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/properties/public/search?limit=20`);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const json = await res.json();
        const items = Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json?.data?.items)
          ? json.data.items
          : Array.isArray(json?.items)
          ? json.items
          : Array.isArray(json)
          ? json
          : [];

        if (isMounted && Array.isArray(items)) {
          const mapped: Property[] = items.map((item: any) => {
            const rents = [
              item.startingRent,
              item.pricing?.fourSharing,
              item.pricing?.tripleSharing,
              item.pricing?.doubleSharing,
              item.pricing?.singleSharing,
              item.fourSharingPrice,
              item.tripleSharingPrice,
              item.doubleSharingPrice,
              item.singleSharingPrice,
            ]
              .map(Number)
              .filter((n) => Number.isFinite(n) && n > 0);
            const minRent = rents.length > 0 ? Math.min(...rents) : 7500;

            const availableSharing: RoomSharingType[] = [];
            if (item.pricing?.singleSharing || item.singleSharingPrice) availableSharing.push('Single');
            if (item.pricing?.doubleSharing || item.doubleSharingPrice) availableSharing.push('Double');
            if (item.pricing?.tripleSharing || item.tripleSharingPrice) availableSharing.push('Triple');
            if (item.pricing?.fourSharing || item.fourSharingPrice) availableSharing.push('Triple+');
            const sharingTypes =
              availableSharing.length > 0
                ? availableSharing
                : (['Single', 'Double', 'Triple'] as RoomSharingType[]);

            const propType = (item.propertyType || item.propertyTypeName || '').toLowerCase();
            const itemGender = (item.gender || '').toLowerCase();
            const isGirls =
              propType.includes('girl') ||
              propType.includes('female') ||
              itemGender === 'girls' ||
              itemGender === 'female';
            const isBoys =
              propType.includes('boy') ||
              propType.includes('male') ||
              itemGender === 'boys' ||
              itemGender === 'male';
            const gender: 'Male' | 'Female' | 'Any' = isGirls ? 'Female' : isBoys ? 'Male' : 'Any';
            const genderLabel = isGirls ? 'Girls PG' : isBoys ? 'Boys PG' : 'Boys / Girls';

            const cityName =
              item.cityName ||
              item.city?.name ||
              item.city ||
              (item.address?.toLowerCase().includes('noida')
                ? 'Noida'
                : item.address?.toLowerCase().includes('delhi')
                ? 'Delhi'
                : item.address?.toLowerCase().includes('gurgaon') ||
                  item.address?.toLowerCase().includes('gurugram')
                ? 'Gurugram'
                : 'Delhi NCR');

            const photos =
              Array.isArray(item.photos) && item.photos.length > 0
                ? item.photos.map((p: any) => (typeof p === 'string' ? p : p?.url)).filter(Boolean)
                : [
                    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
                  ];

            const depositPeriod: '15 days' | '1 Month' | '2 Month' | '3 Month' =
              item.securityDepositMonths === 2
                ? '2 Month'
                : item.securityDepositMonths === 3
                ? '3 Month'
                : '1 Month';

            return {
              id: item.id,
              slug: item.propertyCode || item.id,
              name: item.name || 'Verified PG Accommodation',
              verified: item.isPublished ?? item.isPublishedListing ?? item.active ?? true,
              address: item.address || 'Delhi NCR',
              city: cityName,
              area: item.area || '',
              contactNumber: item.contactNumber || '',
              startingPrice: minRent,
              displayPrice: `Starts from ₹${minRent.toLocaleString('en-IN')}`,
              images: photos,
              sharingTypes,
              gender,
              genderLabel,
              residentType: 'All',
              residentTypeLabel: 'Students / Working Professionals',
              securityDepositPeriod: depositPeriod,
              about: item.description || '',
              rentingTerms: {
                rent: `₹${minRent.toLocaleString('en-IN')} / month`,
                securityDeposit: `${item.securityDepositMonths || 1} Month`,
                lockinPeriod: '0 months',
                noticePeriod: `${item.noticePeriodDays || 30} days`,
              },
              amenities: Array.isArray(item.amenities)
                ? item.amenities.map((a: any, i: number) => ({
                    id: `a-${i}`,
                    name: typeof a === 'string' ? a : a?.name || 'Amenity',
                    category: 'Common',
                    iconName: 'Sparkles',
                  }))
                : [],
              rentPackages: [],
              rules: Array.isArray(item.houseRules)
                ? item.houseRules
                : Array.isArray(item.restrictions)
                ? item.restrictions
                : ['Gate closes at 11:00 PM', 'Keep common areas clean'],
              locationDetails: {
                latitude: Number(item.latitude || 28.6139),
                longitude: Number(item.longitude || 77.209),
                googleMapUrl: item.googleMapUrl,
                landmark: item.landmark,
              },
              nearbyPlaces: Array.isArray(item.nearbyPlaces)
                ? item.nearbyPlaces.map((p: any) => ({
                    name: typeof p === 'string' ? p : p?.name || 'Nearby',
                    distance: 'Nearby',
                    category: 'Utilities',
                  }))
                : [],
              owner: {
                name: item.adminName || 'PG Ease Verified Host',
                avatar:
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                bio: 'Verified host on PG Ease network.',
              },
              availableRooms: [],
              faqs: [],
            };
          });

          setProperties(mapped);
        }
      } catch (err) {
        console.error('Failed to load live featured properties:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadFeatured();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter properties by city
  const filteredList = properties
    .filter((p) => {
      if (selectedCity === 'All') return true;
      const q = selectedCity.toLowerCase();
      const pc = (p.city || '').toLowerCase();
      if (q === 'gurgaon' || q === 'gurugram') {
        return pc.includes('gurgaon') || pc.includes('gurugram');
      }
      return pc.includes(q);
    })
    .slice(0, 6);

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
              { id: 'Delhi', label: 'Delhi' },
              { id: 'Noida', label: 'Noida' },
              { id: 'Gurgaon', label: 'Gurugram' },
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

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-3xl border border-slate-200/90 p-0 overflow-hidden animate-pulse flex flex-col"
              >
                <div className="h-60 w-full bg-slate-200" />
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="h-5 w-3/4 bg-slate-200 rounded-md" />
                    <div className="h-4 w-1/2 bg-slate-100 rounded-md" />
                    <div className="flex gap-2 pt-2">
                      <div className="h-6 w-20 bg-slate-100 rounded-md" />
                      <div className="h-6 w-24 bg-slate-100 rounded-md" />
                    </div>
                  </div>
                  <div className="h-10 bg-slate-100 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredList.length === 0 ? (
          /* Empty State when no live PGs exist for selected city */
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white/80 p-12 text-center max-w-2xl mx-auto my-8 space-y-4 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto shadow-xs">
              <Building2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {selectedCity === 'All'
                ? 'No Verified Properties Live Right Now'
                : `No Verified PGs Listed in ${selectedCity} Yet`}
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Properties go live as soon as owner KYC and inventory checks are verified. You can browse all registered properties or list your PG on PG Ease.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/find-properties"
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>Browse All Available PGs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/list-your-property"
                className="px-5 py-2.5 rounded-xl border border-slate-300 hover:border-teal-500 hover:text-teal-600 text-slate-700 text-xs font-bold transition-all"
              >
                List Your PG Free
              </Link>
            </div>
          </div>
        ) : (
          /* Live Dynamic Featured Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredList.map((property) => {
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
                      loading="lazy"
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
        )}

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
