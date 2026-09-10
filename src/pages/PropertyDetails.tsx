import { useState } from 'react';
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
import { mockProperties } from '../data/mockProperties';
import { RoomOption } from '../types/property';
import { useWishlist } from '../context/WishlistContext';

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const property = mockProperties.find((p) => p.id === id) || mockProperties[0];

  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(property.id);

  // States
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);
  const [nearbyTab, setNearbyTab] = useState<'Utilities' | 'Transit' | 'Food' | 'Shopping'>('Utilities');
  const [isShareCopied, setIsShareCopied] = useState(false);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

  // Modals
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [scheduleType, setScheduleType] = useState<TourType>('visit');
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);

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
  const similarProperties = mockProperties.filter((p) => p.id !== property.id).slice(0, 2);

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
            {/* About Property */}
            <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-3">About Property</h2>
              <p className={`text-slate-600 text-sm leading-relaxed ${!isAboutExpanded ? 'line-clamp-3' : ''}`}>
                {property.about}
              </p>
              <button
                onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 underline flex items-center gap-1"
              >
                {isAboutExpanded ? 'View less' : 'View more'}
              </button>
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
              <div className="relative h-56 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
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

            {/* Similar Properties (PDF 2, Page 2) */}
            <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-slate-900">Similar properties</h2>
                <Link
                  to="/find-properties"
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  View other similar properties
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {similarProperties.map((sim) => (
                  <div
                    key={sim.id}
                    className="border border-slate-200 rounded-xl overflow-hidden hover:border-blue-400 transition-all"
                  >
                    <img src={sim.images[0]} alt={sim.name} className="w-full h-36 object-cover" />
                    <div className="p-4">
                      <h4 className="font-bold text-sm text-slate-900 mb-1">{sim.name}</h4>
                      <p className="text-xs text-slate-500 mb-2">{sim.address}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="text-xs font-bold text-emerald-600">{sim.displayPrice}</span>
                        <Link
                          to={`/properties/${sim.id}`}
                          className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg"
                        >
                          I'm interested
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

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
                <h3 className="text-sm font-bold text-slate-900 mb-3">Available Rooms</h3>

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
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <BedDouble className="w-4 h-4 text-blue-600" />
                      {selectedRoom.label}
                    </span>
                    <span className="text-sm font-bold text-emerald-600">
                      ₹{selectedRoom.monthlyRent.toLocaleString('en-IN')}/mo
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
