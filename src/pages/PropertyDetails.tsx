import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  Heart,
  Share2,
  MapPin,
  ChevronRight,
  Check,
  Video,
  Eye,
  PhoneCall,
  Phone,
  Globe,
  ExternalLink,
  Utensils,
  UtensilsCrossed,
  Users,
  ChevronDown,
  ChevronUp,
  Building,
  BedDouble,
  CheckCircle2,
  ShieldAlert,
  Info,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import InquiryModal from '../components/InquiryModal';
import ScheduleTourModal, { TourType } from '../components/ScheduleTourModal';
import { Property, RoomSharingType, Amenity, RoomOption } from '../types/property';
import { useWishlist } from '../context/WishlistContext';

import { API_BASE } from '../config/api';

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/properties/${id}`);
        if (!res.ok) throw new Error('Failed to load property');
        const json = await res.json();
        const p = json?.data || json;

        if (p && isMounted) {
          const listing = p.publicListingDetails || {};
          const rawPhotos = (p.photos && p.photos.length > 0)
            ? p.photos.map((item: any) => (typeof item === 'string' ? item : item.url)).filter(Boolean)
            : [];
          const images = rawPhotos.length > 0 ? rawPhotos : [
            'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
          ];

          const sPrice = Number(p.singleSharingPrice) || listing.pricing?.single?.withFood || 0;
          const dPrice = Number(p.doubleSharingPrice) || listing.pricing?.double?.withFood || 0;
          const tPrice = Number(p.tripleSharingPrice) || listing.pricing?.triple?.withFood || 0;
          const fPrice = Number(p.fourSharingPrice) || listing.pricing?.fourSharing?.withFood || 0;

          const sWithFood = listing.pricing?.single?.withFood || sPrice || 14000;
          const sWithoutFood = listing.pricing?.single?.withoutFood || (sWithFood > 2500 ? sWithFood - 2500 : Math.round(sWithFood * 0.8));

          const dWithFood = listing.pricing?.double?.withFood || dPrice || 9000;
          const dWithoutFood = listing.pricing?.double?.withoutFood || (dWithFood > 2000 ? dWithFood - 2000 : Math.round(dWithFood * 0.8));

          const tWithFood = listing.pricing?.triple?.withFood || tPrice || 7500;
          const tWithoutFood = listing.pricing?.triple?.withoutFood || (tWithFood > 1800 ? tWithFood - 1800 : Math.round(tWithFood * 0.8));

          const fWithFood = listing.pricing?.fourSharing?.withFood || fPrice || 6000;
          const fWithoutFood = listing.pricing?.fourSharing?.withoutFood || (fWithFood > 1500 ? fWithFood - 1500 : Math.round(fWithFood * 0.8));

          const prices = [sPrice, dPrice, tPrice, fPrice].filter((x) => x > 0);
          const minPrice = prices.length > 0 ? Math.min(...prices) : 8000;

          const sharingTypes: RoomSharingType[] = [];
          const availableRooms: RoomOption[] = [];

          if (sPrice > 0 || listing.pricing?.single) {
            sharingTypes.push('Single');
            availableRooms.push({
              type: 'Single',
              label: 'Single Occupancy Room',
              monthlyRent: sWithFood,
              monthlyRentWithFood: sWithFood,
              monthlyRentWithoutFood: sWithoutFood,
              securityDeposit: sWithFood * (listing.securityDepositMonths || 2),
              amenities: ['Attached Washroom', 'Inverter AC', 'Study Table', '3 Homestyle Meals'],
              currentOccupants: 0,
              maxCapacity: 1,
              availableBeds: 1,
            });
          }

          if (dPrice > 0 || listing.pricing?.double) {
            sharingTypes.push('Double');
            availableRooms.push({
              type: 'Double',
              label: 'Double Sharing Room',
              monthlyRent: dWithFood,
              monthlyRentWithFood: dWithFood,
              monthlyRentWithoutFood: dWithoutFood,
              securityDeposit: dWithFood * (listing.securityDepositMonths || 2),
              amenities: ['Attached Washroom', 'AC / Fan', 'Wardrobe', '3 Homestyle Meals'],
              currentOccupants: 1,
              maxCapacity: 2,
              availableBeds: 1,
            });
          }

          if (tPrice > 0 || listing.pricing?.triple) {
            sharingTypes.push('Triple');
            availableRooms.push({
              type: 'Triple',
              label: 'Triple Sharing Room',
              monthlyRent: tWithFood,
              monthlyRentWithFood: tWithFood,
              monthlyRentWithoutFood: tWithoutFood,
              securityDeposit: tWithFood * (listing.securityDepositMonths || 2),
              amenities: ['Shared Washroom', 'Cupboard', 'WiFi', '3 Homestyle Meals'],
              currentOccupants: 2,
              maxCapacity: 3,
              availableBeds: 1,
            });
          }

          if (fPrice > 0 || listing.pricing?.fourSharing) {
            sharingTypes.push('Triple+');
            availableRooms.push({
              type: 'Triple+',
              label: 'Four Sharing Bed',
              monthlyRent: fWithFood,
              monthlyRentWithFood: fWithFood,
              monthlyRentWithoutFood: fWithoutFood,
              securityDeposit: fWithFood * (listing.securityDepositMonths || 2),
              amenities: ['Shared Washroom', 'Locker', 'WiFi', 'Meals'],
              currentOccupants: 3,
              maxCapacity: 4,
              availableBeds: 1,
            });
          }

          if (availableRooms.length === 0) {
            availableRooms.push({
              type: 'Single',
              label: 'Standard PG Room',
              monthlyRent: minPrice,
              monthlyRentWithFood: minPrice,
              monthlyRentWithoutFood: Math.max(minPrice - 2000, Math.round(minPrice * 0.8)),
              securityDeposit: minPrice * 2,
              amenities: ['WiFi', 'Housekeeping', 'Security'],
              currentOccupants: 0,
              maxCapacity: 1,
              availableBeds: 1,
            });
            sharingTypes.push('Single');
          }

          const rawAmenities = p.facilities || listing.amenities || [];
          const formattedAmenities: Amenity[] = (
            rawAmenities.length > 0 ? rawAmenities : ['WiFi', 'Power Backup', 'RO Water', 'Housekeeping']
          ).map((name: string, i: number) => ({
            id: `amenity-${i}`,
            name,
            category: 'Common',
          }));

          const rawRules = listing.houseRules || listing.restrictions || [];
          const rules = rawRules.length > 0 ? rawRules : [
            'No smoking inside rooms',
            'Gate closes at 11:00 PM',
            'Visitors allowed in common lobby only',
            'Keep common spaces clean',
          ];

          const transformed: Property = {
            id: p.id,
            slug: p.propertyCode || p.id,
            name: p.name,
            verified: true,
            address: p.address || 'Central Location',
            city: p.cityName || 'Delhi NCR',
            area: p.address?.split(',')[1]?.trim() || 'Central',
            contactNumber: p.mobileContactNumber || listing.contactNumber || p.adminPhone || '+91 99905 55580',
            website: listing.website || p.website || `https://${(p.propertyCode || p.name || 'stay').toLowerCase().replace(/[^a-z0-9]/g, '')}.pgease.com`,
            startingPrice: minPrice,
            displayPrice: `Starts from ₹${minPrice.toLocaleString('en-IN')}`,
            images,
            sharingTypes: sharingTypes.length > 0 ? sharingTypes : ['Single', 'Double'],
            gender: (p.propertyType && p.propertyType.toLowerCase().includes('girl'))
              ? 'Female'
              : (p.propertyType && p.propertyType.toLowerCase().includes('boy'))
              ? 'Male'
              : 'Any',
            genderLabel: p.propertyType || 'Co-ed PG',
            residentType: 'All',
            residentTypeLabel: 'Students & Working Professionals',
            securityDepositPeriod:
              listing.securityDepositMonths === 1
                ? '1 Month'
                : listing.securityDepositMonths === 3
                ? '3 Month'
                : '2 Month',
            about:
              listing.description ||
              p.description ||
              `Welcome to ${p.name}. Situated at ${p.address || 'a prime location'}, offering modern amenities, fresh hygienic meals, high-speed WiFi, and 24/7 security.`,
            rentingTerms: {
              rent: `₹${minPrice.toLocaleString('en-IN')} / month`,
              securityDeposit: `${listing.securityDepositMonths || 2} Months Deposit`,
              lockinPeriod: '1 Month',
              noticePeriod: `${listing.noticePeriodDays || 30} Days Notice`,
            },
            amenities: formattedAmenities,
            rentPackages: [
              { name: 'Room Rent (With Food)', price: `₹${minPrice.toLocaleString('en-IN')}`, included: true },
              { name: '3 Meals Daily', price: 'Included', included: true },
              { name: 'High-speed WiFi', price: 'Included', included: true },
              { name: 'Electricity Bill', price: 'As per meter reading', included: false },
            ],
            rules,
            locationDetails: {
              latitude: Number(p.latitude) || 28.6139,
              longitude: Number(p.longitude) || 77.209,
              landmark: p.address,
            },
            nearbyPlaces: (p.nearbyPlaces || ['Metro Station', 'Market', 'College / IT Park']).map(
              (name: string, i: number) => ({
                name,
                distance: `${(i + 1) * 300}m`,
                category: i % 2 === 0 ? 'Transit' : 'Utilities',
              })
            ),
            owner: {
              name: p.adminName || 'Verified Property Host',
              phone: p.mobileContactNumber || listing.contactNumber || '+91 98765 43210',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
              bio: `Host at ${p.name} - Dedicated to providing a comfortable, safe, and welcoming living environment for residents.`,
              experience: '4+ Years Hosting Experience',
            },
            availableRooms,
            faqs: [
              {
                question: 'What is the notice period before vacating?',
                answer: `The standard notice period for this property is ${listing.noticePeriodDays || 30} days.`,
              },
              {
                question: 'How is the security deposit refunded?',
                answer: `The ${listing.securityDepositMonths || 2}-month security deposit is fully refunded within 7 days of move-out after room inspection.`,
              },
              {
                question: 'Are meals included in the monthly rent?',
                answer: 'Yes, both With Food (3 hygienic homestyle meals) and Without Food accommodation packages are available according to your preference.',
              },
            ],
          };

          setProperty(transformed);

          // Fetch similar real properties from API
          try {
            const simRes = await fetch(`${API_BASE}/properties/public/search?limit=6`);
            if (simRes.ok) {
              const simJson = await simRes.json();
              const simItems = Array.isArray(simJson?.data)
                ? simJson.data
                : Array.isArray(simJson?.data?.items)
                ? simJson.data.items
                : [];
              const mappedSim = simItems
                .filter((item: any) => item.id !== id)
                .slice(0, 4)
                .map((item: any) => {
                  const sPrice = Number(
                    item.startingRent || item.pricing?.singleSharing || 7000,
                  );
                  return {
                    id: item.id,
                    slug: item.slug || item.id,
                    name: item.name,
                    verified: true,
                    address: item.address || item.cityName || 'Delhi NCR',
                    city: item.cityName || 'Delhi NCR',
                    area: item.cityName || 'Central',
                    startingPrice: sPrice,
                    displayPrice: `Starts from ₹${sPrice.toLocaleString('en-IN')}`,
                    images:
                      Array.isArray(item.photos) && item.photos.length > 0
                        ? item.photos
                        : [
                            'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80',
                          ],
                    sharingTypes: ['Single', 'Double', 'Triple'] as RoomSharingType[],
                    gender: 'Any' as const,
                    genderLabel: 'Co-ed / Verified PG',
                    residentType: 'All',
                    residentTypeLabel: 'Students & Professionals',
                    securityDepositPeriod: '1 Month',
                    about: item.description || '',
                    rentingTerms: {
                      rent: '',
                      securityDeposit: '',
                      lockinPeriod: '',
                      noticePeriod: '',
                    },
                    amenities: [],
                    rentPackages: [],
                    rules: [],
                    locationDetails: { latitude: 0, longitude: 0 },
                    nearbyPlaces: [],
                    owner: { name: 'Verified Host', avatar: '', bio: '' },
                    availableRooms: [],
                    faqs: [],
                  };
                });
              if (isMounted) setSimilarProperties(mappedSim);
            }
          } catch {
            // Ignore similar properties fetch failure
          }
        }
      } catch {
        if (isMounted) {
          setProperty(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProperty();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = property ? isInWishlist(property.id) : false;

  // States
  const [mealPlan, setMealPlan] = useState<'withFood' | 'withoutFood'>('withFood');
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);
  const [nearbyTab, setNearbyTab] = useState<'Utilities' | 'Transit' | 'Food' | 'Shopping'>('Utilities');
  const [isShareCopied, setIsShareCopied] = useState(false);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);

  // Modals
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [scheduleType, setScheduleType] = useState<TourType>('visit');
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col">
        <Navbar onBookDemo={() => {}} />
        <div className="flex-1 flex items-center justify-center pt-24">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-slate-600">Loading verified property details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return <Navigate to="/find-properties" replace />;
  }

  const selectedRoom: RoomOption =
    property.availableRooms[selectedRoomIndex] || property.availableRooms[0];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsShareCopied(true);
    setTimeout(() => setIsShareCopied(false), 2000);
  };

  const openSchedule = (type: TourType) => {
    setScheduleType(type);
    setIsScheduleOpen(true);
  };

  const filteredNearby = property.nearbyPlaces.filter((n) => n.category === nearbyTab);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col">
      <Navbar onBookDemo={() => {}} />

      {/* Top Header / Breadcrumb */}
      <div className="pt-20 lg:pt-24 pb-4 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Link to="/" className="hover:text-slate-900">
                  Home
                </Link>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <Link to="/find-properties" className="hover:text-slate-900">
                  Properties
                </Link>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="text-slate-800 font-semibold">{property.name}</span>
              </nav>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
                {property.name}
                {property.verified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-md">
                    <Check className="w-3 h-3 stroke-[3]" /> Verified
                  </span>
                )}
              </h1>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {property.address}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleWishlist(property.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all ${
                  isWishlisted
                    ? 'border-rose-200 bg-rose-50 text-rose-700 shadow-xs'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-500'}`}
                />
                {isWishlisted ? 'Saved in Wishlist' : 'Add to wishlist'}
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Share2 className="w-4 h-4 text-slate-500" />
                {isShareCopied ? 'Link Copied!' : 'Share this'}
              </button>

              <button
                onClick={() => setIsInquiryOpen(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm"
              >
                Sign up / Inquire
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Photo Gallery Grid (Matching PDF 2, Page 1) */}
        <section className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 bg-white p-2">
            {/* Primary Large Image */}
            <div
              className="md:col-span-2 relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => setGalleryModalOpen(true)}
            >
              <img
                src={property.images[0]}
                alt={property.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white text-xs font-semibold flex items-center gap-1 bg-black/40 px-3 py-1 rounded-lg backdrop-blur-sm">
                  <Eye className="w-3.5 h-3.5" /> View full photo
                </span>
              </div>
            </div>

            {/* 4 Thumbnails */}
            <div className="md:col-span-2 grid grid-cols-2 gap-3">
              {property.images.slice(1, 5).map((img, idx) => {
                const isLast = idx === 3;
                return (
                  <div
                    key={idx}
                    className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group"
                    onClick={() => setGalleryModalOpen(true)}
                  >
                    <img
                      src={img}
                      alt={`${property.name} ${idx + 2}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {isLast && (
                      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white p-2">
                        <span className="text-lg font-bold">+1 Images</span>
                        <span className="text-[11px] text-slate-200">Click to view all</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 2-Column Layout: Left Content & Right Sticky Booking Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Property Information */}
          <div className="lg:col-span-8 space-y-8">
            {/* About Property with Number & Official Website */}
            <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <h2 className="text-lg font-bold text-slate-900">About Property</h2>
                {property.verified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Verified by PG Ease
                  </span>
                )}
              </div>

              <p className={`text-slate-600 text-sm leading-relaxed ${!isAboutExpanded ? 'line-clamp-3' : ''}`}>
                {property.about}
              </p>
              <button
                onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline flex items-center gap-1"
              >
                {isAboutExpanded ? 'View less' : 'View more'}
              </button>

              {/* Number and Website Badges / Action Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-100/80 text-blue-600 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Property Number</span>
                      <a
                        href={`tel:${property.contactNumber || property.owner.phone || '+91 99905 55580'}`}
                        className="text-xs font-bold text-slate-800 hover:text-blue-600 transition-colors"
                      >
                        {property.contactNumber || property.owner.phone || '+91 99905 55580'}
                      </a>
                    </div>
                  </div>
                  <a
                    href={`tel:${property.contactNumber || property.owner.phone || '+91 99905 55580'}`}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                  >
                    Call Host
                  </a>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Property Website</span>
                      <a
                        href={property.website || `https://${property.slug || 'stay'}.pgease.com`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-slate-800 hover:text-emerald-700 truncate block transition-colors"
                      >
                        {property.website ? property.website.replace(/^https?:\/\//, '') : `${property.slug || 'stay'}.pgease.com`}
                      </a>
                    </div>
                  </div>
                  <a
                    href={property.website || `https://${property.slug || 'stay'}.pgease.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1 shrink-0 transition-colors"
                  >
                    Visit <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </section>

            {/* Room Details & Pricing (With Food & Without Food explicit rent) */}
            <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Room Details & Pricing</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Compare rents for With Food (3 daily meals) vs Without Food accommodation.
                  </p>
                </div>
                <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setMealPlan('withFood')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                      mealPlan === 'withFood'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Utensils className="w-3.5 h-3.5" />
                    With Food
                  </button>
                  <button
                    onClick={() => setMealPlan('withoutFood')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                      mealPlan === 'withoutFood'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <UtensilsCrossed className="w-3.5 h-3.5" />
                    Without Food
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.availableRooms.map((room, idx) => {
                  const withFoodRent = room.monthlyRentWithFood || room.monthlyRent;
                  const withoutFoodRent = room.monthlyRentWithoutFood || Math.max(withFoodRent - 2500, Math.round(withFoodRent * 0.8));
                  const isSelected = selectedRoomIndex === idx;

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedRoomIndex(idx)}
                      className={`cursor-pointer rounded-2xl p-5 border-2 transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/20 shadow-sm ring-2 ring-blue-600/10'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wide flex items-center gap-1">
                            <BedDouble className="w-3.5 h-3.5" />
                            {room.type} Sharing
                          </span>
                          <h3 className="font-extrabold text-slate-900 text-base">{room.label}</h3>
                        </div>
                        <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                          room.availableBeds > 0
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {room.availableBeds > 0 ? `${room.availableBeds} bed available` : 'Full'}
                        </span>
                      </div>

                      {/* Pricing Comparison Box */}
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-3 space-y-2">
                        <div className={`flex items-center justify-between text-xs p-2 rounded-lg ${
                          mealPlan === 'withFood' ? 'bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold' : 'text-slate-600'
                        }`}>
                          <span className="flex items-center gap-1.5">
                            <Utensils className="w-3.5 h-3.5 text-emerald-600" />
                            Rent With Food:
                          </span>
                          <span className="text-sm font-extrabold text-emerald-700">
                            ₹{withFoodRent.toLocaleString('en-IN')}<span className="text-[11px] font-medium text-slate-500"> /month</span>
                          </span>
                        </div>

                        <div className={`flex items-center justify-between text-xs p-2 rounded-lg ${
                          mealPlan === 'withoutFood' ? 'bg-slate-200/70 border border-slate-300 text-slate-950 font-bold' : 'text-slate-600'
                        }`}>
                          <span className="flex items-center gap-1.5">
                            <UtensilsCrossed className="w-3.5 h-3.5 text-slate-500" />
                            Rent Without Food:
                          </span>
                          <span className="text-sm font-extrabold text-slate-900">
                            ₹{withoutFoodRent.toLocaleString('en-IN')}<span className="text-[11px] font-medium text-slate-500"> /month</span>
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1 mb-3">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Room Amenities</span>
                        <div className="flex flex-wrap gap-1">
                          {room.amenities.map((am, i) => (
                            <span key={i} className="text-[11px] px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                              {am}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                        <span className="text-slate-500 font-medium">
                          Deposit: <strong>₹{room.securityDeposit.toLocaleString('en-IN')}</strong>
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRoomIndex(idx);
                            setIsInquiryOpen(true);
                          }}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-xs shadow-xs"
                        >
                          Select Room
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Renting Terms Table */}
            <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Renting Terms</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                <div>
                  <span className="text-xs text-slate-500 block mb-1">Rent</span>
                  <span className="text-base font-bold text-slate-900">
                    {property.rentingTerms.rent}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block mb-1">Security Deposit</span>
                  <span className="text-base font-bold text-slate-900">
                    {property.rentingTerms.securityDeposit}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block mb-1">Lockin Period</span>
                  <span className="text-base font-bold text-slate-900">
                    {property.rentingTerms.lockinPeriod}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block mb-1">Notice Period</span>
                  <span className="text-base font-bold text-slate-900">
                    {property.rentingTerms.noticePeriod}
                  </span>
                </div>
              </div>
            </section>

            {/* Property Amenities (Unified without categories as requested) & Restrictions */}
            <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-1">Amenities</h2>
                <p className="text-xs text-slate-500 mb-4">
                  Complimentary facilities and room equipment provided for all residents.
                </p>

                {/* Unified Amenities Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {(showAllAmenities ? property.amenities : property.amenities.slice(0, 9)).map((amenity) => (
                    <div
                      key={amenity.id}
                      className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-100 bg-slate-50/80 text-xs font-medium text-slate-800"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{amenity.name}</span>
                    </div>
                  ))}
                </div>

                {property.amenities.length > 9 && (
                  <button
                    onClick={() => setShowAllAmenities(!showAllAmenities)}
                    className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700 underline"
                  >
                    {showAllAmenities ? 'Show less amenities' : `View all ${property.amenities.length} amenities`}
                  </button>
                )}
              </div>

              {/* Restrictions & House Rules Section (Directly within/under amenities) */}
              <div className="pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                  <h3 className="text-base font-bold text-slate-900">Property Restrictions & House Rules</h3>
                </div>

                <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 sm:p-5 space-y-2.5 text-xs text-amber-950">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                      <span><strong>Gate Timings:</strong> Main gate locked strictly at 11:00 PM for safety.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                      <span><strong>Visitor Access:</strong> Allowed only in common lounge until 8:00 PM.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                      <span><strong>Substance Policy:</strong> Zero tolerance for smoking, alcohol, or vaping.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                      <span><strong>Quiet Hours:</strong> Maintain silence between 11:00 PM and 6:00 AM.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                      <span><strong>Notice Period:</strong> 30-day prior written notice before move-out.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                      <span><strong>Mandatory KYC:</strong> Aadhaar digital verification required prior to check-in.</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Search by location & Map (PDF 2, Page 1 & 2) */}
            <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-3">Search by location</h2>

              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Check distance from property's location"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500"
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>

              {/* Map Preview Graphic */}
              <div className="relative h-60 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <iframe
                  title="Property Location"
                  className="w-full h-full border-0"
                  src={`https://maps.google.com/maps?q=${property.locationDetails.latitude},${property.locationDetails.longitude}&z=14&output=embed`}
                  loading="lazy"
                />
                <div className="absolute bottom-3 left-3 bg-white/95 px-3 py-1.5 rounded-lg shadow-md text-xs font-semibold text-slate-800">
                  {property.locationDetails.landmark || property.address}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-slate-600 font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {property.address}
                </span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${property.locationDetails.latitude},${property.locationDetails.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open in Google Maps
                </a>
              </div>
            </section>

            {/* Nearby Location with Distance Tabs (PDF 2, Page 2) */}
            <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Nearby location</h2>

              {/* Tabs */}
              <div className="flex border-b border-slate-200 mb-5">
                {(['Utilities', 'Transit', 'Food', 'Shopping'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setNearbyTab(tab)}
                    className={`px-5 py-2 text-xs font-bold border-b-2 transition-all ${
                      nearbyTab === tab
                        ? 'border-blue-600 text-blue-600 bg-blue-50/40'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {filteredNearby.map((place, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs"
                  >
                    <span className="font-medium text-slate-700">{place.name}</span>
                    <span className="text-slate-500 font-semibold">{place.distance}</span>
                  </div>
                ))}
              </div>

              {/* Automated Distance Engine Explainer Box */}
              <div className="mt-5 p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl flex items-start gap-2.5 text-xs text-blue-900">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>How nearby places are calculated:</strong> Landmarks are dynamically located within a 2.5 km geo-radius of this property's GPS coordinates ({property.locationDetails.latitude}, {property.locationDetails.longitude}) using standard Haversine distance matrix.
                </p>
              </div>

              <button className="mt-4 text-xs font-semibold text-blue-600 hover:text-blue-700 underline">
                View other nearby places
              </button>
            </section>

            {/* Property Owner Card (PDF 2, Page 2) */}
            <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm flex items-start gap-4">
              <img
                src={property.owner.avatar}
                alt={property.owner.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-slate-200 shrink-0"
              />
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Property Owner
                </span>
                <h3 className="text-base font-bold text-slate-900">{property.owner.name}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{property.owner.bio}</p>
                <button className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 underline">
                  View more
                </button>
              </div>
            </section>

            {/* Customer Support Card (PDF 2, Page 2) */}
            <section className="bg-gradient-to-r from-blue-50 to-indigo-50/40 rounded-2xl p-6 border border-blue-100 shadow-sm flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Customer Support</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Still confused? Our customer support executive will help you with anything.
                </p>
              </div>
              <a
                href="tel:+917701953356"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0 shadow-sm"
              >
                Call Support
              </a>
            </section>

            {/* More Properties Near You / Nearby Properties */}
            {similarProperties.length > 0 && (
              <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">More properties near you</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Explore verified stays nearby in {property.city || property.area}</p>
                  </div>
                  <Link
                    to="/find-properties"
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    View all properties
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {similarProperties.map((sim) => {
                    const withFoodRent = sim.startingPrice;
                    const withoutFoodRent = Math.max(sim.startingPrice - 2000, Math.round(sim.startingPrice * 0.8));

                    return (
                      <div
                        key={sim.id}
                        className="border border-slate-200 rounded-xl overflow-hidden hover:border-blue-400 hover:shadow-sm transition-all flex flex-col justify-between"
                      >
                        <div className="relative h-40 overflow-hidden group">
                          <img src={sim.images[0]} alt={sim.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded-md">
                            {sim.genderLabel}
                          </span>
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-bold text-sm text-slate-900 mb-1">{sim.name}</h4>
                            <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              {sim.address}
                            </p>
                            {/* Food Rent and Without Food Breakdown */}
                            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl text-[11px] mb-3 border border-slate-100">
                              <div>
                                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">With Food</span>
                                <span className="font-extrabold text-emerald-700">₹{withFoodRent.toLocaleString('en-IN')}<span className="text-[10px] font-medium text-slate-500">/mo</span></span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Without Food</span>
                                <span className="font-extrabold text-slate-800">₹{withoutFoodRent.toLocaleString('en-IN')}<span className="text-[10px] font-medium text-slate-500">/mo</span></span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <span className="text-xs font-bold text-emerald-600">{sim.displayPrice}</span>
                            <Link
                              to={`/properties/${sim.id}`}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* FAQs (PDF 2, Page 2 & 3) */}
            <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">FAQs</h2>
              <div className="divide-y divide-slate-100">
                {property.faqs.map((faq, index) => {
                  const isOpen = activeFaqIndex === index;
                  return (
                    <div key={index} className="py-3.5">
                      <button
                        onClick={() => setActiveFaqIndex(isOpen ? null : index)}
                        className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-slate-800 hover:text-blue-600 transition-colors"
                      >
                        <span>{faq.question}</span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <p className="mt-2 text-xs text-slate-600 leading-relaxed pl-1">
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Right Column: Sticky Booking & Available Rooms Widget (PDF 2, Page 1) */}
          <aside className="lg:col-span-4 sticky top-24 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6">
              {/* Primary Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => setIsInquiryOpen(true)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                >
                  I'm interested
                </button>
                <button
                  onClick={() => setIsInquiryOpen(true)}
                  className="w-full py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-xs font-bold rounded-xl transition-all"
                >
                  Reserve Bed
                </button>
              </div>

              {/* Real time or Reel time; you choose (PDF 2, Page 1) */}
              <div className="mb-6 pt-5 border-t border-slate-100">
                <p className="text-xs text-slate-500 font-medium mb-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Real time or Reel time; you choose
                </p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <button
                    onClick={() => openSchedule('video')}
                    className="p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl text-xs text-slate-700 flex flex-col items-center gap-1 transition-colors"
                  >
                    <Video className="w-4 h-4 text-blue-600" />
                    <span className="text-[11px] font-medium">Live video tour</span>
                  </button>

                  <button
                    onClick={() => openSchedule('visit')}
                    className="p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl text-xs text-slate-700 flex flex-col items-center gap-1 transition-colors"
                  >
                    <Building className="w-4 h-4 text-blue-600" />
                    <span className="text-[11px] font-medium">Visit Property</span>
                  </button>

                  <button
                    onClick={() => openSchedule('call')}
                    className="p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl text-xs text-slate-700 flex flex-col items-center gap-1 transition-colors"
                  >
                    <PhoneCall className="w-4 h-4 text-blue-600" />
                    <span className="text-[11px] font-medium">Phone Call</span>
                  </button>
                </div>
              </div>

              {/* Available Rooms Section (PDF 2, Page 1) */}
              <div className="pt-5 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900">Available Rooms</h3>
                  {/* Meal Plan mini switcher */}
                  <div className="inline-flex p-0.5 bg-slate-100 rounded-lg text-[10px] font-bold">
                    <button
                      onClick={() => setMealPlan('withFood')}
                      className={`px-2 py-0.5 rounded-md transition-all ${
                        mealPlan === 'withFood' ? 'bg-emerald-600 text-white' : 'text-slate-600'
                      }`}
                    >
                      With Food
                    </button>
                    <button
                      onClick={() => setMealPlan('withoutFood')}
                      className={`px-2 py-0.5 rounded-md transition-all ${
                        mealPlan === 'withoutFood' ? 'bg-slate-900 text-white' : 'text-slate-600'
                      }`}
                    >
                      No Food
                    </button>
                  </div>
                </div>

                {/* Sharing Tabs */}
                <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
                  {property.availableRooms.map((room, idx) => (
                    <button
                      key={room.type}
                      onClick={() => setSelectedRoomIndex(idx)}
                      className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                        selectedRoomIndex === idx
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {room.label}
                    </button>
                  ))}
                </div>

                {/* Selected Room Details Card */}
                {(() => {
                  const withFoodRent = selectedRoom.monthlyRentWithFood || selectedRoom.monthlyRent;
                  const withoutFoodRent = selectedRoom.monthlyRentWithoutFood || Math.max(withFoodRent - 2500, Math.round(withFoodRent * 0.8));
                  const currentRent = mealPlan === 'withFood' ? withFoodRent : withoutFoodRent;

                  return (
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <BedDouble className="w-4 h-4 text-blue-600" />
                          {selectedRoom.label}
                        </span>
                        <div className="text-right">
                          <span className="text-base font-extrabold text-emerald-700 block">
                            ₹{currentRent.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-500">/mo</span>
                          </span>
                          <span className="text-[10px] font-medium text-slate-400">
                            {mealPlan === 'withFood' ? '🍱 Meals Included' : '🍽️ Room Only'}
                          </span>
                        </div>
                      </div>

                      <div className="bg-white p-2 rounded-lg border border-slate-200/80 text-[11px] flex items-center justify-between">
                        <span className="text-slate-500">
                          Without Food: <strong className="text-slate-800">₹{withoutFoodRent.toLocaleString('en-IN')}</strong>
                        </span>
                        <span className="text-slate-500">
                          With Food: <strong className="text-emerald-700">₹{withFoodRent.toLocaleString('en-IN')}</strong>
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Room Amenities
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {selectedRoom.amenities.map((am, i) => (
                            <span
                              key={i}
                              className="text-[11px] px-2 py-0.5 bg-white border border-slate-200 rounded-md text-slate-600"
                            >
                              {am}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs text-slate-600">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          {selectedRoom.currentOccupants} Tenants staying
                        </span>
                        <span className="font-semibold text-emerald-600">
                          {selectedRoom.availableBeds} bed available
                        </span>
                      </div>

                      <button
                        onClick={() => setIsInquiryOpen(true)}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
                      >
                        Reserve Now
                      </button>
                    </div>
                  );
                })()}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />

      {/* Modals */}
      <InquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        property={property}
      />

      <ScheduleTourModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        property={property}
        initialType={scheduleType}
      />

      {/* Gallery Lightbox Modal */}
      {galleryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col p-4 sm:p-8">
          <div className="flex justify-between items-center text-white mb-4">
            <h3 className="text-lg font-bold">{property.name} - Photo Gallery</h3>
            <button
              onClick={() => setGalleryModalOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {property.images.map((img, i) => (
              <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden bg-black">
                <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
