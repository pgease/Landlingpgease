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
  Navigation,
  Loader2,
  Search,
  MapPin,
  Sparkles,
  Utensils,
  Wind,
  ShieldCheck,
  SlidersHorizontal,
  ArrowUpDown,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import InquiryModal from '../components/InquiryModal';
import { mockProperties } from '../data/mockProperties';
import { Property, RoomSharingType, ResidentType } from '../types/property';
import { useWishlist } from '../context/WishlistContext';

import { API_BASE } from '../config/api';

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
  const [minBudget, setMinBudget] = useState<number>(0);
  const [maxBudget, setMaxBudget] = useState<number>(50000);
  const [selectedDeposits, setSelectedDeposits] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Extended Geo-Search & Sorting Filter States
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isNearMeActive, setIsNearMeActive] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [searchRadius, setSearchRadius] = useState<number>(50); // radius in km
  const [foodAvailable, setFoodAvailable] = useState<boolean>(false);
  const [acAvailable, setAcAvailable] = useState<boolean>(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('relevance');

  // API State
  const [apiProperties, setApiProperties] = useState<Property[]>([]);
  const [isLoadingApi, setIsLoadingApi] = useState(false);

  // UI states
  const [activeImageIndex, setActiveImageIndex] = useState<{ [key: string]: number }>({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [inquiryProperty, setInquiryProperty] = useState<Property | null>(null);

  // Near Me Location Trigger
  const toggleNearMe = () => {
    if (isNearMeActive) {
      setIsNearMeActive(false);
      setUserLocation(null);
      if (sortBy === 'distance') setSortBy('relevance');
      return;
    }

    if ('geolocation' in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          setIsNearMeActive(true);
          setIsLocating(false);
          setSortBy('distance');
        },
        (err) => {
          console.warn('Geolocation error or denied', err);
          setIsLocating(false);
          alert('Could not access current location. Please check your browser location permissions.');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Fetch from backend API /api/properties/public/search
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
          params.append('query', searchQuery.trim());
        }
        if (minBudget > 0) {
          params.append('minRent', String(minBudget));
        }
        if (maxBudget < 50000) {
          params.append('maxRent', String(maxBudget));
        }
        if (selectedGender && selectedGender !== 'Any') {
          const g = selectedGender.toLowerCase();
          params.append('gender', g === 'male' || g === 'boys' ? 'boys' : g === 'female' || g === 'girls' ? 'girls' : 'co-ed');
        }
        if (selectedSharing.length > 0) {
          const sharingMap: Record<string, string> = {
            'Single': 'single',
            'Double': 'double',
            'Triple': 'triple',
            'Triple+': 'four_plus',
          };
          const sharingVals = selectedSharing.map((s) => sharingMap[s] || s.toLowerCase());
          params.append('sharingType', sharingVals[0]); // Send primary filter
        }
        if (foodAvailable) {
          params.append('foodAvailable', 'true');
        }
        if (acAvailable) {
          params.append('acAvailable', 'true');
        }
        if (selectedAmenities.length > 0) {
          params.append('amenities', selectedAmenities.join(','));
        }
        if (userLocation) {
          params.append('latitude', String(userLocation.latitude));
          params.append('longitude', String(userLocation.longitude));
          params.append('distance', String(searchRadius));
        }
        if (sortBy && sortBy !== 'relevance') {
          params.append('sortBy', sortBy);
        } else if (userLocation) {
          params.append('sortBy', 'distance');
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
                item.pricing?.singleSharing ||
                item.pricing?.doubleSharing ||
                item.pricing?.tripleSharing ||
                item.pricing?.fourSharing ||
                7000
            );

            return {
              id: item.id,
              slug: item.slug || item.id,
              name: item.name,
              verified: Boolean(item.isVerified ?? true),
              distanceKm: item.distanceKm !== undefined && item.distanceKm !== null ? Number(item.distanceKm) : undefined,
              address: item.address || `${item.cityName || 'Delhi NCR'}, India`,
              city: item.cityName || 'Delhi NCR',
              area: item.area || item.cityName || 'Central',
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
              gender:
                (item.propertyTypeName || '').toLowerCase().includes('girl') || item.gender === 'girls'
                  ? 'Female'
                  : (item.propertyTypeName || '').toLowerCase().includes('boy') || item.gender === 'boys'
                  ? 'Male'
                  : 'Any',
              genderLabel:
                (item.propertyTypeName || '').toLowerCase().includes('girl') || item.gender === 'girls'
                  ? 'Girls PG'
                  : (item.propertyTypeName || '').toLowerCase().includes('boy') || item.gender === 'boys'
                  ? 'Boys PG'
                  : 'Co-ed / Unisex PG',
              residentType: 'All',
              residentTypeLabel: 'Students & Professionals',
              securityDepositPeriod: '1 Month',
              about: item.description || `${item.name} is a verified PG stay with hygienic meals, high-speed WiFi, and 24x7 security.`,
              rentingTerms: {
                rent: `₹${minRent.toLocaleString('en-IN')} / month`,
                securityDeposit: '1 Month Rent',
                lockinPeriod: '1 Month',
                noticePeriod: '30 Days',
              },
              amenities: Array.isArray(item.amenities)
                ? item.amenities.map((a: string, i: number) => ({ id: `am-${i}`, name: a, category: 'Common' }))
                : [
                    { id: '1', name: 'High-speed WiFi', category: 'Common' },
                    { id: '2', name: 'Power Backup', category: 'Common' },
                    { id: '3', name: 'Hygienic Meals', category: 'Food' },
                    { id: '4', name: '24x7 Security', category: 'Services' },
                  ],
              rentPackages: [],
              rules: ['Gate closes at 11:00 PM', 'Keep common areas clean'],
              locationDetails: {
                latitude: Number(item.latitude || 28.6139),
                longitude: Number(item.longitude || 77.2090),
                googleMapUrl: item.googleMapUrl,
                landmark: item.landmark,
              },
              nearbyPlaces: Array.isArray(item.nearbyPlaces)
                ? item.nearbyPlaces.map((p: string) => ({ name: p, distance: 'Nearby', category: 'Utilities' }))
                : [],
              owner: {
                name: 'PG Ease Verified Host',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                bio: 'Verified host on PG Ease network.',
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
        console.error('Failed to load public PGs from API', err);
        if (isMounted) setApiProperties([]);
      } finally {
        if (isMounted) setIsLoadingApi(false);
      }
    }

    fetchPublicPgs();

    return () => {
      isMounted = false;
    };
  }, [
    selectedCity,
    searchQuery,
    minBudget,
    maxBudget,
    selectedGender,
    selectedSharing,
    foodAvailable,
    acAvailable,
    selectedAmenities,
    userLocation,
    searchRadius,
    sortBy,
  ]);

  // Image navigation
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
    setMinBudget(0);
    setMaxBudget(50000);
    setSelectedDeposits([]);
    setSearchQuery('');
    setFoodAvailable(false);
    setAcAvailable(false);
    setSelectedAmenities([]);
    setUserLocation(null);
    setIsNearMeActive(false);
    setSortBy('relevance');
  };

  // Combined Properties list
  const filteredProperties = useMemo(() => {
    const combined = [
      ...apiProperties,
      ...mockProperties.filter((mp) => !apiProperties.some((ap) => ap.id === mp.id)),
    ];

    let result = combined.filter((property) => {
      // City filter
      if (selectedCity && selectedCity !== 'All') {
        const queryCity = selectedCity.toLowerCase();
        const propCity = property.city.toLowerCase();
        const propAddress = property.address.toLowerCase();
        if (!propCity.includes(queryCity) && !propAddress.includes(queryCity)) {
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

      // Budget filter
      if (property.startingPrice < minBudget || property.startingPrice > maxBudget) {
        return false;
      }

      // Food filter
      if (foodAvailable) {
        const hasFood = property.amenities.some((a) => a.name.toLowerCase().includes('food') || a.name.toLowerCase().includes('meal'));
        if (!hasFood && apiProperties.length === 0) return false;
      }

      // AC filter
      if (acAvailable) {
        const hasAc = property.amenities.some((a) => a.name.toLowerCase().includes('ac') || a.name.toLowerCase().includes('air'));
        if (!hasAc && apiProperties.length === 0) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = property.name.toLowerCase().includes(q);
        const matchesAddress = property.address.toLowerCase().includes(q);
        const matchesCity = property.city.toLowerCase().includes(q);
        if (!matchesName && !matchesAddress && !matchesCity) return false;
      }

      return true;
    });

    // Client-side sorting fallback if required
    if (sortBy === 'distance' && userLocation) {
      result = [...result].sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
    } else if (sortBy === 'price_asc') {
      result = [...result].sort((a, b) => a.startingPrice - b.startingPrice);
    } else if (sortBy === 'price_desc') {
      result = [...result].sort((a, b) => b.startingPrice - a.startingPrice);
    }

    return result;
  }, [apiProperties, selectedCity, selectedSharing, selectedGender, minBudget, maxBudget, foodAvailable, acAvailable, searchQuery, sortBy, userLocation]);

  const toggleAmenity = (name: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  const toggleSharing = (sharing: RoomSharingType) => {
    setSelectedSharing((prev) =>
      prev.includes(sharing) ? prev.filter((s) => s !== sharing) : [...prev, sharing]
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar onBookDemo={() => {}} />

      <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        {/* HEADER & SEARCH BAR */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>Verified Stays Directory</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Find Your Ideal PG Stay
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Zero brokerage, verified amenities, and direct host booking across Delhi NCR & top cities.
              </p>
            </div>

            {/* NEAR ME TRIGGER BUTTON */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleNearMe}
                disabled={isLocating}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border shadow-sm ${
                  isNearMeActive
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-900/20'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                {isLocating ? (
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                ) : (
                  <Navigation className={`w-4 h-4 ${isNearMeActive ? 'text-white animate-pulse' : 'text-emerald-600'}`} />
                )}
                <span>{isNearMeActive ? 'Near Me Active' : 'Near Me (GPS)'}</span>
              </button>

              {/* Mobile Filter Toggle */}
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="lg:hidden p-2.5 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-700 font-bold text-xs flex items-center gap-1.5"
              >
                <Filter className="w-4 h-4" /> Filters
              </button>
            </div>
          </div>

          {/* INPUT CONTROLS RIBBON */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            {/* 1. Location / Query input */}
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="PG Name, Locality or Landmark..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-brand-500 transition-colors"
              />
            </div>

            {/* 2. City Filter */}
            <div className="relative flex items-center">
              <MapPin className="w-4 h-4 text-teal-600 absolute left-3.5 pointer-events-none" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none cursor-pointer focus:border-brand-500 transition-colors appearance-none"
              >
                <option value="All">All Cities (Delhi NCR)</option>
                <option value="Delhi">Delhi NCR</option>
                <option value="Noida">Noida</option>
                <option value="Gurgaon">Gurugram</option>
                <option value="Greater Noida">Greater Noida</option>
                <option value="Ghaziabad">Ghaziabad</option>
              </select>
            </div>

            {/* 3. Radius Selector (if Near Me Active) */}
            <div className="relative flex items-center">
              <Navigation className="w-4 h-4 text-emerald-600 absolute left-3.5 pointer-events-none" />
              <select
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none cursor-pointer focus:border-brand-500 transition-colors appearance-none"
              >
                <option value={5}>Within 5 km radius</option>
                <option value={10}>Within 10 km radius</option>
                <option value={20}>Within 20 km radius</option>
                <option value={50}>Within 50 km radius</option>
              </select>
            </div>

            {/* 4. Sort By Selector */}
            <div className="relative flex items-center">
              <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none cursor-pointer focus:border-brand-500 transition-colors appearance-none"
              >
                <option value="relevance">Sort by: Relevance</option>
                {userLocation && <option value="distance">Distance: Nearest First</option>}
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest Stays</option>
              </select>
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT: FILTERS SIDEBAR + PROPERTY LIST GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* DESKTOP FILTERS SIDEBAR */}
          <div className="hidden lg:block space-y-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm h-fit">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-600" />
                <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Filters</h2>
              </div>
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
              >
                Reset All
              </button>
            </div>

            {/* Gender Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Gender</label>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl">
                {['Any', 'Boys', 'Girls'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setSelectedGender(g)}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                      selectedGender === g
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Sharing Type Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Room Sharing</label>
              <div className="space-y-2">
                {(['Single', 'Double', 'Triple', 'Triple+'] as RoomSharingType[]).map((sharing) => (
                  <label
                    key={sharing}
                    className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer hover:text-slate-900"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSharing.includes(sharing)}
                      onChange={() => toggleSharing(sharing)}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 h-4 w-4"
                    />
                    <span>{sharing === 'Triple+' ? '4+ Sharing' : `${sharing} Sharing`}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Budget Range Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Max Rent Budget</label>
                <span className="text-xs font-black text-brand-600">₹{maxBudget.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="3000"
                max="50000"
                step="1000"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>

            {/* Quick Toggle Facilities */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Must-Have Amenities</label>
              
              <label className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl cursor-pointer transition-colors">
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-slate-800">Food Included</span>
                </div>
                <input
                  type="checkbox"
                  checked={foodAvailable}
                  onChange={(e) => setFoodAvailable(e.target.checked)}
                  className="rounded text-brand-600 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl cursor-pointer transition-colors">
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-bold text-slate-800">Air Conditioned (AC)</span>
                </div>
                <input
                  type="checkbox"
                  checked={acAvailable}
                  onChange={(e) => setAcAvailable(e.target.checked)}
                  className="rounded text-brand-600 h-4 w-4"
                />
              </label>
            </div>

            {/* Additional Amenities */}
            <div className="space-y-2 pt-2">
              {['WiFi', 'Power Backup', 'Laundry', 'CCTV'].map((amenity) => (
                <label key={amenity} className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                    className="rounded border-slate-300 text-brand-600 h-4 w-4"
                  />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* RESULTS GRID */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-500">
                Showing <span className="text-slate-900 font-extrabold">{filteredProperties.length}</span> Verified Stays
                {isNearMeActive && <span className="ml-2 text-emerald-600 font-semibold">• Sorted by distance</span>}
              </p>
            </div>

            {isLoadingApi ? (
              <div className="py-24 text-center space-y-3 bg-white rounded-3xl border border-slate-200">
                <Loader2 className="w-8 h-8 animate-spin text-brand-600 mx-auto" />
                <p className="text-xs font-bold text-slate-500">Searching properties near you...</p>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="py-16 text-center space-y-4 bg-white rounded-3xl border border-slate-200 p-8">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Building className="w-6 h-6" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">No properties matched your search</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your budget, expanding search radius, or clearing specific filters.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {filteredProperties.map((property) => {
                  const currentImgIdx = activeImageIndex[property.id] || 0;
                  const isWishlisted = isInWishlist(property.id);

                  return (
                    <div
                      key={property.id}
                      className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
                    >
                      {/* Image Container */}
                      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                        <img
                          src={property.images[currentImgIdx] || property.images[0]}
                          alt={property.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                          <div className="flex items-center gap-1.5">
                            {property.verified && (
                              <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-teal-700 text-[10px] font-extrabold border border-teal-200 shadow-sm flex items-center gap-1 pointer-events-auto">
                                <ShieldCheck className="w-3 h-3 text-teal-600" /> Verified
                              </span>
                            )}
                            {property.distanceKm !== undefined && (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold shadow-sm flex items-center gap-1 pointer-events-auto">
                                <Navigation className="w-3 h-3 text-white" /> {property.distanceKm} km away
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleWishlist(property.id);
                            }}
                            className="p-2 rounded-full bg-white/80 hover:bg-white text-slate-700 hover:text-rose-600 shadow-md backdrop-blur-md pointer-events-auto transition-colors"
                          >
                            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                          </button>
                        </div>

                        {/* Image Nav Arrows */}
                        {property.images.length > 1 && (
                          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={(e) => prevImage(property.id, property.images.length, e)}
                              className="p-1 rounded-full bg-black/40 hover:bg-black/60 text-white pointer-events-auto"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => nextImage(property.id, property.images.length, e)}
                              className="p-1 rounded-full bg-black/40 hover:bg-black/60 text-white pointer-events-auto"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              {property.genderLabel}
                            </span>
                            <span className="text-[11px] font-bold text-slate-500">
                              {property.city}
                            </span>
                          </div>

                          <Link
                            to={`/properties/${property.id}`}
                            className="text-base font-extrabold text-slate-900 hover:text-brand-600 transition-colors block line-clamp-1"
                          >
                            {property.name}
                          </Link>

                          <p className="text-xs text-slate-500 flex items-center gap-1 line-clamp-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            {property.address}
                          </p>
                        </div>

                        {/* Rent & Action */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <div>
                            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Rent Starts</span>
                            <span className="text-base font-black text-slate-900">
                              ₹{property.startingPrice.toLocaleString('en-IN')}
                              <span className="text-xs text-slate-500 font-normal">/mo</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setInquiryProperty(property)}
                              className="px-3 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-xl text-xs font-bold transition-colors"
                            >
                              Inquire
                            </button>
                            <Link
                              to={`/properties/${property.id}`}
                              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />

      {/* Inquiry Modal */}
      {inquiryProperty && (
        <InquiryModal
          isOpen={Boolean(inquiryProperty)}
          onClose={() => setInquiryProperty(null)}
          property={inquiryProperty}
        />
      )}
    </div>
  );
}
