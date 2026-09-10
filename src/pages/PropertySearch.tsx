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
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import InquiryModal from '../components/InquiryModal';
import { mockProperties } from '../data/mockProperties';
import { Property, RoomSharingType, ResidentType } from '../types/property';
import { useWishlist } from '../context/WishlistContext';

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

  // UI states
  const [activeImageIndex, setActiveImageIndex] = useState<{ [key: string]: number }>({});
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [inquiryProperty, setInquiryProperty] = useState<Property | null>(null);
  const [visibleCount, setVisibleCount] = useState(8);

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
  };

  // Filtered properties
  const filteredProperties = useMemo(() => {
    return mockProperties.filter((property) => {
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
  }, [selectedCity, selectedSharing, selectedGender, selectedResidents, maxBudget, selectedDeposits, searchQuery]);

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
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {filteredProperties.length} verified stays in {selectedCity === 'All' ? 'Delhi NCR' : selectedCity === 'Gurgaon' ? 'Gurugram' : selectedCity}
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
          {[
            { id: 'All', label: '🏢 All Delhi NCR' },
            { id: 'Noida', label: '📍 Noida' },
            { id: 'Gurgaon', label: '📍 Gurugram' },
            { id: 'Delhi', label: '📍 Delhi' },
          ].map((cityItem) => {
            const isSelected =
              cityItem.id === 'All'
                ? selectedCity === 'All'
                : selectedCity.toLowerCase() === cityItem.id.toLowerCase();

            return (
              <button
                key={cityItem.id}
                type="button"
                onClick={() => {
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
