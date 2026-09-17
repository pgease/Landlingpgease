import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Building,
  Check,
  Filter,
  X,
  MapPin,
  Navigation,
  Loader2,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import InquiryModal from '../components/InquiryModal';
import { mockProperties } from '../data/mockProperties';
import { Property, RoomSharingType, ResidentType } from '../types/property';
import { useWishlist } from '../context/WishlistContext';

const API_BASE = import.meta.env.VITE_API_URL || 'https://pg-ease-nest.vercel.app/api';

export default function PropertySearch() {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [searchParams, setSearchParams] = useSearchParams();

  // City filter state
  const [selectedCity, setSelectedCity] = useState<string>(
    searchParams.get('city') || 'All'
  );

  useEffect(() => {
    const cityParam = searchParams.get('city');
    if (cityParam) {
      setSelectedCity(cityParam);
    }
  }, [searchParams]);

  // Filter states
  const [selectedSharing, setSelectedSharing] = useState<RoomSharingType[]>([]);
  const [selectedGender, setSelectedGender] = useState<string>('Any');
  const [selectedResidents, setSelectedResidents] = useState<ResidentType[]>([]);
  const [maxBudget, setMaxBudget] = useState<number>(30000);
  const [selectedDeposits, setSelectedDeposits] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Geolocation & API States
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isNearMeActive, setIsNearMeActive] = useState(false);
  const [apiProperties, setApiProperties] = useState<Property[]>([]);
  const [isLoadingApi, setIsLoadingApi] = useState(false);

  // UI states
  const [activeImageIndex, setActiveImageIndex] = useState<{ [key: string]: number }>({});
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [inquiryProperty, setInquiryProperty] = useState<Property | null>(null);
  const [visibleCount, setVisibleCount] = useState(8);

  // Geolocation Near Me handler
  const handleNearMeClick = () => {
    if (isNearMeActive) {
      setIsNearMeActive(false);
      setUserLocation(null);
      return;
    }
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          setIsNearMeActive(true);
          setSelectedCity('All');
        },
        (err) => {
          console.warn('Geolocation error or denied', err);
          alert('Could not access current location. Please allow location access in your browser.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Fetch from /properties/public/search backend API
  useEffect(() => {
    let isMounted = true;
    async function fetchPublicPgs() {
      setIsLoadingApi(true);
      try {
        const params = new URLSearchParams();
        if (selectedCity && selectedCity !== 'All') {
          params.append('location', selectedCity);
        }
        if (searchQuery.trim()) {
          params.append('name', searchQuery.trim());
        }
        if (maxBudget) {
          params.append('maxRent', String(maxBudget));
        }
        if (selectedGender && selectedGender !== 'Any') {
          const g = selectedGender.toLowerCase();
          params.append('gender', g === 'male' ? 'boys' : g === 'female' ? 'girls' : 'co-ed');
        }
        if (userLocation) {
          params.append('latitude', String(userLocation.latitude));
          params.append('longitude', String(userLocation.longitude));
        }
        params.append('limit', '50');

        const res = await fetch(`${API_BASE}/properties/public/search?${params.toString()}`);
        if (!res.ok) throw new Error(`Search error: ${res.status}`);
        const json = await res.json();
        const items = json?.data?.items || json?.items || [];

        if (isMounted && Array.isArray(items) && items.length > 0) {
          const mapped: Property[] = items.map((item: any) => {
            const minRent = Number(
              item.startingRent ||
                item.pricing?.fourSharing ||
                item.pricing?.triple ||
                item.pricing?.double ||
                item.pricing?.single ||
                7000
            );
            return {
              id: item.id,
              slug: item.slug || item.id,
              name: item.name,
              verified: Boolean(item.isVerified ?? true),
              address: item.address || `${item.city || 'Bengaluru'}, ${item.state || 'Karnataka'}`,
              city: item.city || 'Delhi NCR',
              area: item.area || item.city || 'Central',
              startingPrice: minRent,
              displayPrice: `Starts from ₹${minRent.toLocaleString('en-IN')}`,
              images:
                Array.isArray(item.photos) && item.photos.length > 0
                  ? item.photos
                  : [
                      item.coverPhotoUrl ||
                        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80',
                    ],
              sharingTypes: (['Single', 'Double', 'Triple', 'Triple+'] as RoomSharingType[]),
              gender: item.gender === 'boys' ? 'Male' : item.gender === 'girls' ? 'Female' : 'Any',
              genderLabel: item.gender === 'boys' ? 'Boys' : item.gender === 'girls' ? 'Girls' : 'Co-ed / All',
              residentType: 'All',
              residentTypeLabel: 'Students & Working Professionals',
              securityDepositPeriod: '1 Month',
              about: item.description || `${item.name} is a verified PG stay with hygienic meals, high speed internet and 24x7 security.`,
              rentingTerms: {
                rent: `₹${minRent.toLocaleString('en-IN')} / month`,
                securityDeposit: `${item.securityDepositMonths || 1} Month Rent`,
                lockinPeriod: '1 Month',
                noticePeriod: `${item.noticePeriodDays || 30} Days`,
              },
              amenities: Array.isArray(item.amenities)
                ? item.amenities.map((a: string, i: number) => ({ id: `am-${i}`, name: a, category: 'Common' }))
                : [
                    { id: '1', name: 'High-speed WiFi', category: 'Common' },
                    { id: '2', name: 'Power Backup', category: 'Common' },
                    { id: '3', name: '3 Times Food', category: 'Food' },
                    { id: '4', name: 'Daily Cleaning', category: 'Services' },
                  ],
              rentPackages: [],
              rules: Array.isArray(item.houseRules) ? item.houseRules : ['Gate closes at 11:00 PM', 'Keep common areas clean'],
              locationDetails: {
                latitude: Number(item.latitude || 12.9279),
                longitude: Number(item.longitude || 77.6271),
                googleMapUrl: item.googleMapUrl,
                landmark: item.landmark,
              },
              nearbyPlaces: [],
              owner: {
                name: item.ownerName || 'PG Ease Verified Host',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                bio: 'Experienced PG manager with verified listings.',
              },
              availableRooms: [],
              faqs: [],
            };
          });
          setApiProperties(mapped);
        } else if (isMounted) {
          setApiProperties([]);
        }
      } catch (err) {
        console.warn('Backend search API unreachable, falling back to catalog:', err);
        if (isMounted) setApiProperties([]);
      } finally {
        if (isMounted) setIsLoadingApi(false);
      }
    }

    fetchPublicPgs();
    return () => {
      isMounted = false;
    };
  }, [selectedCity, searchQuery, maxBudget, selectedGender, userLocation]);

  // Image slider navigation
  const nextImage = (propertyId: string, totalImages: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveImageIndex((prev) => ({
      ...prev,
      [propertyId]: ((prev[propertyId] || 0) + 1) % totalImages,
    }));
  };

  const prevImage = (propertyId: string, totalImages: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveImageIndex((prev) => ({
      ...prev,
      [propertyId]: ((prev[propertyId] || 0) - 1 + totalImages) % totalImages,
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCity('All');
    setSearchParams({});
    setSelectedSharing([]);
    setSelectedGender('Any');
    setSelectedResidents([]);
    setMaxBudget(50000);
    setSelectedDeposits([]);
    setSearchQuery('');
    setUserLocation(null);
    setIsNearMeActive(false);
  };

  // Filtered properties combining API results and mock dataset
  const filteredProperties = useMemo(() => {
    const combined = [
      ...apiProperties,
      ...mockProperties.filter((mp) => !apiProperties.some((ap) => ap.id === mp.id)),
    ];

    return combined.filter((property) => {
      // City filter
      if (selectedCity && selectedCity !== 'All') {
        const queryCity = selectedCity.toLowerCase();
        const propCity = property.city.toLowerCase();
        if (queryCity === 'gurgaon' || queryCity === 'gurugram') {
          if (propCity !== 'gurgaon' && propCity !== 'gurugram') return false;
        } else if (!propCity.includes(queryCity)) {
          return false;
        }
      }

      // Sharing filter
      if (
        selectedSharing.length > 0 &&
        !property.sharingTypes.some((t) => selectedSharing.includes(t))
      ) {
        return false;
      }

      // Gender filter
      if (selectedGender !== 'Any' && property.gender !== 'Any' && property.gender !== selectedGender) {
        return false;
      }

      // Resident type filter
      if (
        selectedResidents.length > 0 &&
        property.residentType !== 'All' &&
        !selectedResidents.includes(property.residentType)
      ) {
        return false;
      }

      // Budget filter
      if (property.startingPrice > maxBudget) {
        return false;
      }

      // Security deposit filter
      if (
        selectedDeposits.length > 0 &&
        !selectedDeposits.includes(property.securityDepositPeriod)
      ) {
        return false;
      }

      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = property.name.toLowerCase().includes(query);
        const matchesAddress = property.address.toLowerCase().includes(query);
        const matchesCity = property.city.toLowerCase().includes(query);
        if (!matchesName && !matchesAddress && !matchesCity) return false;
      }

      return true;
    });
  }, [apiProperties, selectedCity, selectedSharing, selectedGender, selectedResidents, maxBudget, selectedDeposits, searchQuery]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col">
      <Navbar onBookDemo={() => {}} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-16 w-full">
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-200">
          <div>
            <nav className="text-xs text-slate-500 mb-1">
              <Link to="/" className="hover:text-slate-900">
                Home
              </Link>{' '}
              / <span className="text-slate-800 font-medium">Find Properties</span>
            </nav>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span>
                {filteredProperties.length} verified stays in{' '}
                {isNearMeActive
                  ? 'Nearby Area'
                  : selectedCity === 'All'
                  ? 'Delhi NCR'
                  : selectedCity === 'Gurgaon'
                  ? 'Gurugram'
                  : selectedCity}
              </span>
              {isLoadingApi && <Loader2 className="w-4 h-4 animate-spin text-brand-600" />}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 shadow-sm"
            >
              <Filter className="w-4 h-4 text-brand-600" />
              Filter
            </button>
          </div>
        </div>

        {/* City Quick Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar">
          {/* Geolocation Near Me Pill */}
          <button
            type="button"
            onClick={handleNearMeClick}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 shrink-0 flex items-center gap-1.5 shadow-2xs ${
              isNearMeActive
                ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/50'
                : 'bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <Navigation className={`w-3.5 h-3.5 ${isNearMeActive ? 'text-white' : 'text-emerald-600'}`} />
            <span>{isNearMeActive ? '📍 Near Me (Active)' : '🎯 Near Me'}</span>
          </button>

          {[
            { id: 'All', label: '🏢 All Delhi NCR' },
            { id: 'Noida', label: '📍 Noida' },
            { id: 'Gurgaon', label: '📍 Gurugram' },
            { id: 'Delhi', label: '📍 Delhi' },
          ].map((cityItem) => {
            const isSelected =
              !isNearMeActive &&
              (cityItem.id === 'All'
                ? selectedCity === 'All'
                : selectedCity.toLowerCase() === cityItem.id.toLowerCase());

            return (
              <button
                key={cityItem.id}
                type="button"
                onClick={() => {
                  setIsNearMeActive(false);
                  setUserLocation(null);
                  setSelectedCity(cityItem.id);
                  if (cityItem.id === 'All') {
                    setSearchParams({});
                  } else {
                    setSearchParams({ city: cityItem.id });
                  }
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 shrink-0 flex items-center gap-1.5 shadow-2xs ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white border border-slate-200/90 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span>{cityItem.label}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Filters Sidebar (Desktop) */}
          <aside
            className={`lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 ${
              isMobileFilterOpen
                ? 'fixed inset-0 z-50 overflow-y-auto m-0 rounded-none'
                : 'hidden lg:block sticky top-24'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Filters</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline"
                >
                  Clear All
                </button>
                {isMobileFilterOpen && (
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 lg:hidden"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* City Selection */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                City / Region
              </h3>
              <div className="grid grid-cols-2 gap-1.5">
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
                      type="button"
                      onClick={() => {
                        setSelectedCity(c.id);
                        if (c.id === 'All') {
                          setSearchParams({});
                        } else {
                          setSearchParams({ city: c.id });
                        }
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all text-center ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Room Sharing Type */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                Select room sharing type
              </h3>
              <div className="space-y-2">
                {(['Single', 'Double', 'Triple', 'Triple+'] as RoomSharingType[]).map((type) => {
                  const checked = selectedSharing.includes(type);
                  return (
                    <label
                      key={type}
                      className="flex items-center gap-2.5 text-sm text-slate-600 cursor-pointer hover:text-slate-900"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setSelectedSharing((prev) =>
                            checked ? prev.filter((t) => t !== type) : [...prev, type]
                          );
                        }}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>{type}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Gender */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                Select your gender
              </h3>
              <div className="space-y-2">
                {['Male', 'Female', 'Any'].map((g) => (
                  <label
                    key={g}
                    className="flex items-center gap-2.5 text-sm text-slate-600 cursor-pointer hover:text-slate-900"
                  >
                    <input
                      type="radio"
                      name="gender"
                      checked={selectedGender === g}
                      onChange={() => setSelectedGender(g)}
                      className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                    />
                    <span>{g}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Type of Residents */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                Type of residents
              </h3>
              <div className="space-y-2">
                {(['Working professional', 'Students'] as ResidentType[]).map((r) => {
                  const checked = selectedResidents.includes(r);
                  return (
                    <label
                      key={r}
                      className="flex items-center gap-2.5 text-sm text-slate-600 cursor-pointer hover:text-slate-900"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setSelectedResidents((prev) =>
                            checked ? prev.filter((item) => item !== r) : [...prev, r]
                          );
                        }}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>{r}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Budget Slider */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Select your budget
                </h3>
                <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                  Up to ₹{maxBudget.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={50000}
                step={2000}
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 px-0.5">
                <span>Rs 0</span>
                <span>10k</span>
                <span>20k</span>
                <span>30k</span>
                <span>40k</span>
                <span>Rs 50,000+</span>
              </div>
            </div>

            {/* Security Deposit */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                Security Deposit
              </h3>
              <div className="space-y-2">
                {['15 days', '1 Month', '2 Month', '3 Month'].map((deposit) => {
                  const checked = selectedDeposits.includes(deposit);
                  return (
                    <label
                      key={deposit}
                      className="flex items-center gap-2.5 text-sm text-slate-600 cursor-pointer hover:text-slate-900"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setSelectedDeposits((prev) =>
                            checked ? prev.filter((d) => d !== deposit) : [...prev, deposit]
                          );
                        }}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>{deposit}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {isMobileFilterOpen && (
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm"
              >
                Apply Filters
              </button>
            )}
          </aside>

          {/* Right Property Cards List */}
          <div className="lg:col-span-9 space-y-4">
            {filteredProperties.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <Building className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800">No properties match your filter</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Try adjusting the budget slider or clearing sharing filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              filteredProperties.slice(0, visibleCount).map((property) => {
                const currentImgIdx = activeImageIndex[property.id] || 0;
                const isWishlisted = isInWishlist(property.id);

                return (
                  <div
                    key={property.id}
                    className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col sm:flex-row relative group"
                  >
                    {/* Left Image Carousel */}
                    <div className="sm:w-80 h-56 sm:h-auto relative bg-slate-100 shrink-0 overflow-hidden">
                      <img
                        src={property.images[currentImgIdx] || property.images[0]}
                        alt={property.name}
                        className="w-full h-full object-cover"
                      />

                      {/* Verified Badge */}
                      {property.verified && (
                        <div className="absolute top-3 left-3 bg-emerald-500/95 text-white text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm backdrop-blur-sm z-10">
                          <Check className="w-3 h-3 stroke-[3]" />
                          Verified
                        </div>
                      )}

                      {/* Slider Prev / Next Controls */}
                      {property.images.length > 1 && (
                        <>
                          <button
                            onClick={(e) => prevImage(property.id, property.images.length, e)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-900/60 hover:bg-slate-900/80 text-white flex items-center justify-center transition-colors"
                            aria-label="Previous image"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => nextImage(property.id, property.images.length, e)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-900/60 hover:bg-slate-900/80 text-white flex items-center justify-center transition-colors"
                            aria-label="Next image"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {/* Dot indicators */}
                      {property.images.length > 1 && (
                        <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1">
                          {property.images.map((_, i) => (
                            <span
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full ${
                                i === currentImgIdx ? 'bg-white' : 'bg-white/40'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right Property Details */}
                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                      {/* Top row: Title + Wishlist */}
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <Link
                            to={`/properties/${property.id}`}
                            className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors"
                          >
                            {property.name}
                          </Link>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              toggleWishlist(property.id);
                            }}
                            className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                            aria-label="Toggle wishlist"
                          >
                            <Heart
                              className={`w-5 h-5 ${
                                isWishlisted ? 'fill-rose-500 text-rose-500' : ''
                              }`}
                            />
                          </button>
                        </div>

                        <p className="text-xs text-slate-500 mb-4">{property.address}</p>

                        {/* Room Sharing, Gender, Resident Type Icons */}
                        <div className="space-y-1.5 text-xs text-slate-600 mb-5">
                          <div className="flex items-center gap-2">
                            <span className="w-4 text-center">🛏️</span>
                            <span>{property.sharingTypes.join(', ')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-4 text-center">👤</span>
                            <span>{property.genderLabel}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-4 text-center">🎓</span>
                            <span>{property.residentTypeLabel}</span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row: Price + I'm Interested CTA */}
                      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <span className="text-sm sm:text-base font-bold text-emerald-600">
                            {property.displayPrice}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            to={`/properties/${property.id}`}
                            className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                          >
                            View Details
                          </Link>
                          <button
                            onClick={() => setInquiryProperty(property)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-sm"
                          >
                            I'm interested
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Load More Properties button */}
            {visibleCount < filteredProperties.length && (
              <div className="text-center pt-6">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 5)}
                  className="px-6 py-2.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold rounded-xl shadow-sm transition-all hover:bg-slate-50"
                >
                  Load More Properties
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Popular Searches Section (From PDF 1, Page 3) */}
        <section className="mt-20 pt-12 border-t border-slate-200">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-slate-900">Popular searches</h2>
            <p className="text-xs text-slate-500 mt-1">
              Your gateway to best properties, compatible roommates & best deals
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-xs text-slate-600 text-center">
            {['Gurgaon', 'Delhi', 'Mumbai', 'Pune', 'Bangalore', 'Chennai'].map((city) => (
              <div key={city} className="space-y-2">
                <Link
                  to={`/find-properties?city=${city}`}
                  className="block font-medium text-slate-700 hover:text-blue-600 hover:underline"
                >
                  PGs in {city}
                </Link>
                <Link
                  to={`/find-properties?city=${city}`}
                  className="block text-slate-500 hover:text-blue-600"
                >
                  Hostels in {city}
                </Link>
                <Link
                  to={`/find-properties?city=${city}`}
                  className="block text-slate-500 hover:text-blue-600"
                >
                  Co-living {city}
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      {/* Quick Inquiry Modal */}
      <InquiryModal
        isOpen={!!inquiryProperty}
        onClose={() => setInquiryProperty(null)}
        property={inquiryProperty}
      />
    </div>
  );
}
