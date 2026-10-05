import { useState, useMemo } from 'react';
import {
  Building,
  ShieldCheck,
  Globe,
  Sparkles,
  ArrowRight,
  Users,
  Star,
  MessageSquare,
  MapPin,
  CheckCircle2,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  Trash2,
  Phone,
  Download,
  Code,
  IndianRupee,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { API_BASE } from '../config/api';

interface PropertyTypeOption {
  id: string;
  uuid: string;
  label: string;
  icon: typeof Building;
  desc: string;
}

const PROPERTY_TYPES: PropertyTypeOption[] = [
  {
    id: 'coliving',
    uuid: '123e4567-e89b-12d3-a456-426614174000',
    label: 'Unisex Coliving',
    icon: Users,
    desc: 'Modern community living for young professionals & students',
  },
  {
    id: 'boys-pg',
    uuid: '123e4567-e89b-12d3-a456-426614174001',
    label: 'Boys PG',
    icon: Building,
    desc: 'Dedicated accommodation for male students & executives',
  },
  {
    id: 'girls-pg',
    uuid: '123e4567-e89b-12d3-a456-426614174002',
    label: 'Girls PG',
    icon: ShieldCheck,
    desc: 'Secure female accommodation with 24/7 biometric & warden',
  },
  {
    id: 'hostel',
    uuid: '123e4567-e89b-12d3-a456-426614174003',
    label: 'Student Hostel',
    icon: Globe,
    desc: 'Campus cluster dorms & student residential buildings',
  },
];

interface CityOption {
  name: string;
  cityId: string;
  lat: number;
  lng: number;
}

const POPULAR_CITIES: CityOption[] = [
  { name: 'Bengaluru', cityId: 'e1234567-e89b-12d3-a456-426614174001', lat: 12.9716, lng: 77.5946 },
  { name: 'Noida', cityId: 'e1234567-e89b-12d3-a456-426614174002', lat: 28.5355, lng: 77.3910 },
  { name: 'Gurugram', cityId: 'e1234567-e89b-12d3-a456-426614174003', lat: 28.4595, lng: 77.0266 },
  { name: 'Delhi', cityId: 'e1234567-e89b-12d3-a456-426614174004', lat: 28.7041, lng: 77.1025 },
  { name: 'Pune', cityId: 'e1234567-e89b-12d3-a456-426614174005', lat: 18.5204, lng: 73.8567 },
  { name: 'Hyderabad', cityId: 'e1234567-e89b-12d3-a456-426614174006', lat: 17.3850, lng: 78.4867 },
  { name: 'Mumbai', cityId: 'e1234567-e89b-12d3-a456-426614174007', lat: 19.0760, lng: 72.8777 },
  { name: 'Chennai', cityId: 'e1234567-e89b-12d3-a456-426614174008', lat: 13.0827, lng: 80.2707 },
  { name: 'Kota', cityId: 'e1234567-e89b-12d3-a456-426614174009', lat: 25.2138, lng: 75.8648 },
];

const DEFAULT_AMENITIES = [
  'WiFi',
  'Power Backup',
  'Geyser',
  'AC',
  'RO Water',
  'Washing Machine',
  'CCTV Security',
  'Daily Housekeeping',
  'Lift',
  'Gym',
  'Refrigerator',
  'Food & Meals',
];

const DEFAULT_RESTRICTIONS = [
  'No smoking inside rooms',
  'Gate closes at 11 PM',
  'No loud music after 10 PM',
  'Guests not allowed in rooms after 9 PM',
  'Alcohol strictly prohibited',
  'Veg only dining',
];

const DEFAULT_FACILITIES = [
  'Attached Washroom',
  'Wooden Cupboard',
  'Study Table & Chair',
  'Balcony',
  'Spring Mattress',
  'Smart TV',
];

const DEFAULT_LANDMARKS = [
  'Metro Station',
  'City Mall',
  'Tech Park',
  'Bus Stand',
  'Railway Station',
  'Hospital',
];

const DEFAULT_NEARBY_PLACES = [
  'Supermarket',
  'Hospital',
  'Food Street',
  'Pharmacy',
  'Gym',
  'Coffee Shop',
];

const SPOKEN_LANGUAGES_OPTIONS = [
  'English',
  'Hindi',
  'Kannada',
  'Telugu',
  'Tamil',
  'Marathi',
  'Bengali',
  'Malayalam',
];

export default function ListYourProperty() {
  // Step navigation (1: Basic, 2: Address, 3: Capacity & Pricing, 4: Amenities & Rules, 5: Contact & Photos)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // 1. Basic Info
  const [name, setName] = useState('Urban Stay Luxury PG');
  const [displayNameEn, setDisplayNameEn] = useState('Urban Stay Luxury PG');
  const [displayNameHi, setDisplayNameHi] = useState('अर्बन स्टे लग्जरी पीजी');
  const [propertyTypeId, setPropertyTypeId] = useState('123e4567-e89b-12d3-a456-426614174000');
  const [propertyOwnerId, setPropertyOwnerId] = useState('38732886-744c-4e5f-bd16-872b436494a3');
  const [descriptionEn, setDescriptionEn] = useState(
    'Premium living experience with high-speed WiFi, 3-time dining, daily cleaning, and biometric security.'
  );
  const [yearOfConstruction, setYearOfConstruction] = useState<number>(2022);
  const [languagesSpoken, setLanguagesSpoken] = useState<string[]>(['English', 'Hindi', 'Kannada']);

  // 2. Address & Location
  const [street, setStreet] = useState('12th Main Road');
  const [area, setArea] = useState('HSR Layout');
  const [city, setCity] = useState('Bengaluru');
  const [pincode, setPincode] = useState('560102');
  const [cityId, setCityId] = useState('e1234567-e89b-12d3-a456-426614174001');
  const [latitude, setLatitude] = useState<number>(12.9121);
  const [longitude, setLongitude] = useState<number>(77.6446);
  const [locationPin, setLocationPin] = useState('https://maps.google.com/?q=12.9121,77.6446');
  const [nearbyLandmarks, setNearbyLandmarks] = useState<string[]>(['Metro Station', 'City Mall']);
  const [nearbyPlaces, setNearbyPlaces] = useState<string[]>(['Supermarket', 'Hospital']);
  const [customLandmarkInput, setCustomLandmarkInput] = useState('');
  const [customNearbyInput, setCustomNearbyInput] = useState('');

  // 3. Room Capacity & Pricing
  const [totalRooms, setTotalRooms] = useState<number>(24);
  const [totalBeds, setTotalBeds] = useState<number>(48);
  const [bedRange, setBedRange] = useState('1-3 Beds');
  const [singleSharingPrice, setSingleSharingPrice] = useState<number>(12000);
  const [doubleSharingPrice, setDoubleSharingPrice] = useState<number>(8500);
  const [tripleSharingPrice, setTripleSharingPrice] = useState<number>(6500);
  const [fourSharingPrice, setFourSharingPrice] = useState<number>(5000);
  const [securityDepositCycle, setSecurityDepositCycle] = useState<number>(30);

  // 4. Amenities, Facilities & Restrictions
  const [amenities, setAmenities] = useState<string[]>(['WiFi', 'Power Backup', 'Geyser', 'AC', 'Washing Machine']);
  const [restrictions, setRestrictions] = useState<string[]>([
    'No smoking inside rooms',
    'Gate closes at 11 PM',
  ]);
  const [facilities, setFacilities] = useState<string[]>([
    'Attached Washroom',
    'Wooden Cupboard',
    'Study Table & Chair',
  ]);
  const [customAmenityInput, setCustomAmenityInput] = useState('');
  const [customRestrictionInput, setCustomRestrictionInput] = useState('');
  const [customFacilityInput, setCustomFacilityInput] = useState('');

  // 5. Contact, Photos & Submission
  const [mobileContactNumber, setMobileContactNumber] = useState('9876543210');
  const [countryCode, setCountryCode] = useState('+91');
  const [email, setEmail] = useState('contact@urbanstaypg.com');
  const [website, setWebsite] = useState('https://urbanstaypg.com');
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
  ]);
  const [isPublishedListing, setIsPublishedListing] = useState<boolean>(true);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [showRawJsonModal, setShowRawJsonModal] = useState(false);

  // City selection helper
  const handleCityChange = (cityName: string) => {
    setCity(cityName);
    const matched = POPULAR_CITIES.find((c) => c.name.toLowerCase() === cityName.toLowerCase());
    if (matched) {
      setCityId(matched.cityId);
      setLatitude(matched.lat);
      setLongitude(matched.lng);
      setLocationPin(`https://maps.google.com/?q=${matched.lat},${matched.lng}`);
    }
  };

  // Tag helper toggles
  const toggleTag = (list: string[], setList: (v: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const addCustomItem = (
    value: string,
    setValue: (v: string) => void,
    list: string[],
    setList: (v: string[]) => void
  ) => {
    const trimmed = value.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
      setValue('');
    }
  };

  // Compile final structured payload matching the exact JSON requested
  const compiledPayload = useMemo(() => {
    return {
      propertyTypeId,
      propertyOwnerId,
      name,
      displayNameI18n: {
        en: displayNameEn || name,
        hi: displayNameHi || name,
      },
      address: {
        street,
        area,
        city,
        pincode,
      },
      geoLocation: `${latitude},${longitude}`,
      latitude: Number(latitude) || 12.9121,
      longitude: Number(longitude) || 77.6446,
      locationPin: locationPin || `https://maps.google.com/?q=${latitude},${longitude}`,
      mobileContactNumber,
      countryCode,
      cityId,
      email,
      website,
      descriptionI18n: {
        en: descriptionEn,
      },
      languagesSpoken,
      status: 'active',
      active: true,
      isPublishedListing,
      yearOfConstruction: Number(yearOfConstruction) || 2022,
      photos,
      pricing: {},
      amenities,
      restrictions,
      nearbyLandmarks,
      facilities,
      nearbyPlaces,
      totalRooms: Number(totalRooms) || 24,
      totalBeds: Number(totalBeds) || 48,
      bedRange,
      singleSharingPrice: singleSharingPrice ? Number(singleSharingPrice) : 12000,
      doubleSharingPrice: doubleSharingPrice ? Number(doubleSharingPrice) : 8500,
      tripleSharingPrice: tripleSharingPrice ? Number(tripleSharingPrice) : 6500,
      fourSharingPrice: fourSharingPrice ? Number(fourSharingPrice) : 5000,
      securityDepositCycle: Number(securityDepositCycle) || 30,
    };
  }, [
    propertyTypeId,
    propertyOwnerId,
    name,
    displayNameEn,
    displayNameHi,
    street,
    area,
    city,
    pincode,
    latitude,
    longitude,
    locationPin,
    mobileContactNumber,
    cityId,
    email,
    website,
    descriptionEn,
    languagesSpoken,
    isPublishedListing,
    yearOfConstruction,
    photos,
    amenities,
    restrictions,
    nearbyLandmarks,
    facilities,
    nearbyPlaces,
    totalRooms,
    totalBeds,
    bedRange,
    singleSharingPrice,
    doubleSharingPrice,
    tripleSharingPrice,
    fourSharingPrice,
    securityDepositCycle,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send payload to backend properties endpoint
      await fetch(`${API_BASE}/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(compiledPayload),
      }).catch(() => {
        // Silently capture if running in demo or offline mode
      });
    } catch {
      // Handled
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const copyPayloadToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(compiledPayload, null, 2));
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2500);
  };

  const downloadPayloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(compiledPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-listing.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const minStartingPrice = Math.min(
    ...[singleSharingPrice, doubleSharingPrice, tripleSharingPrice, fourSharingPrice].filter(
      (p) => typeof p === 'number' && p > 0
    )
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      <Navbar onBookDemo={() => {}} />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#005555] via-[#004848] to-[#003636] text-white pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-teal-200 text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            Direct Property Owner Listing Portal
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
            List Your Property on <span className="text-[#5eead4]">PG Ease</span>
          </h1>
          <p className="text-teal-100/90 text-sm sm:text-base mt-3 max-w-2xl mx-auto leading-relaxed font-normal">
            Configure your property details, bed sharing prices, GPS location, amenities and submit directly to our
            verified marketplace.
          </p>

          {/* Stepper Tabs Bar */}
          {!isSubmitted ? (
            <div className="flex items-center justify-center gap-2 sm:gap-3 mt-8 max-w-4xl mx-auto overflow-x-auto pb-2 scrollbar-none">
              {[
                { step: 1, label: 'Property Details', icon: Building },
                { step: 2, label: 'Address & GPS', icon: MapPin },
                { step: 3, label: 'Rooms & Pricing', icon: IndianRupee },
                { step: 4, label: 'Amenities & Rules', icon: Sparkles },
                { step: 5, label: 'Contact & Submit', icon: Phone },
              ].map((s) => {
                const Icon = s.icon;
                const isCurrent = currentStep === s.step;
                const isDone = currentStep > s.step;
                return (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => setCurrentStep(s.step)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      isCurrent
                        ? 'bg-white text-[#006666] shadow-lg shadow-black/20 ring-2 ring-white/50 scale-105'
                        : isDone
                        ? 'bg-teal-800/80 text-teal-200 hover:bg-teal-700/80 border border-teal-600/40'
                        : 'bg-white/10 text-teal-100/70 hover:bg-white/15 border border-white/10'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                        isCurrent
                          ? 'bg-[#008080] text-white'
                          : isDone
                          ? 'bg-teal-400 text-teal-950'
                          : 'bg-white/20 text-white'
                      }`}
                    >
                      {isDone ? '✓' : s.step}
                    </div>
                    <Icon className="w-3.5 h-3.5" />
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {isSubmitted ? (
          /* Confirmation & JSON Payload Screen */
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-10 text-center animate-in fade-in duration-300">
            <div className="w-20 h-20 bg-teal-50 border-4 border-teal-100 text-[#008080] rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs font-black text-[#008080] bg-teal-50 border border-teal-200 px-3 py-1 rounded-full uppercase tracking-wider">
              Ready for Verification & Live Sync
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 mb-2">
              Property Listing Payload Generated Successfully!
            </h2>
            <p className="text-slate-600 text-sm max-w-xl mx-auto leading-relaxed mb-6">
              Your property <strong className="text-slate-900">{name}</strong> ({area}, {city}) has been configured
              with all required schemas. You can fast-track onboarding on WhatsApp or copy the payload JSON.
            </p>

            {/* Quick Summary Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-left max-w-2xl mx-auto mb-6">
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Capacity</span>
                <p className="text-sm font-extrabold text-slate-800 mt-0.5">{totalBeds} Beds ({totalRooms} Rooms)</p>
                <p className="text-[10px] text-slate-500">{bedRange}</p>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Starting Price</span>
                <p className="text-sm font-extrabold text-emerald-600 mt-0.5">₹{minStartingPrice.toLocaleString('en-IN')}/mo</p>
                <p className="text-[10px] text-slate-500">Security Deposit: {securityDepositCycle}d</p>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Location GPS</span>
                <p className="text-sm font-extrabold text-slate-800 mt-0.5">{latitude}, {longitude}</p>
                <p className="text-[10px] text-slate-500">{city} - {pincode}</p>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Owner Contact</span>
                <p className="text-sm font-extrabold text-slate-800 mt-0.5">{countryCode} {mobileContactNumber}</p>
                <p className="text-[10px] text-slate-500 truncate">{email}</p>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              <a
                href={`https://wa.me/917701953356?text=${encodeURIComponent(
                  `Hi PG Ease Team! I have configured my property listing:\n\n*Name:* ${name}\n*City:* ${city} (${area})\n*Capacity:* ${totalBeds} Beds\n*Starting Price:* ₹${minStartingPrice}/mo\n*Owner Phone:* ${countryCode} ${mobileContactNumber}\n\nPlease review and publish on PG Ease.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                Fast-Track on WhatsApp
              </a>

              <button
                type="button"
                onClick={copyPayloadToClipboard}
                className="px-5 py-3 bg-[#008080] hover:bg-[#006b6b] text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                {copiedPayload ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                {copiedPayload ? 'Payload JSON Copied!' : 'Copy Payload JSON'}
              </button>

              <button
                type="button"
                onClick={downloadPayloadJson}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download JSON
              </button>

              <button
                type="button"
                onClick={() => setShowRawJsonModal((v) => !v)}
                className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Code className="w-4 h-4 text-teal-400" />
                {showRawJsonModal ? 'Hide Raw JSON' : 'View Payload Schema'}
              </button>
            </div>

            {/* Collapsible Raw JSON Viewer */}
            {showRawJsonModal ? (
              <div className="text-left bg-slate-950 text-slate-100 p-5 rounded-2xl border border-slate-800 max-h-[360px] overflow-y-auto mb-6 text-xs font-mono shadow-inner">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-slate-400">
                  <span className="font-bold text-teal-300">Payload matching schema:</span>
                  <button
                    type="button"
                    onClick={copyPayloadToClipboard}
                    className="text-[11px] text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                </div>
                <pre className="whitespace-pre-wrap">{JSON.stringify(compiledPayload, null, 2)}</pre>
              </div>
            ) : null}

            <div>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline transition-colors cursor-pointer"
              >
                ← Edit details or register another property
              </button>
            </div>
          </div>
        ) : (
          /* Multi-Step Form with Live Preview Column */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Column (7 Cols) */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              <form onSubmit={handleSubmit} className="divide-y divide-slate-100">
                {/* STEP 1: Basic Property Info */}
                {currentStep === 1 && (
                  <div className="p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#008080] bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-md">
                        Step 1 of 5
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                        Property Identity & Names
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500">
                        Specify the property name, display translations, category, and construction year.
                      </p>
                    </div>

                    {/* Property Type Grid */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Property Category / Type *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {PROPERTY_TYPES.map((pt) => {
                          const Icon = pt.icon;
                          const isSelected = propertyTypeId === pt.uuid;
                          return (
                            <button
                              type="button"
                              key={pt.id}
                              onClick={() => setPropertyTypeId(pt.uuid)}
                              className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                                isSelected
                                  ? 'border-[#008080] bg-teal-50/70 ring-2 ring-[#008080]/30 shadow-xs'
                                  : 'border-slate-200 hover:border-slate-300 bg-white'
                              }`}
                            >
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                  isSelected ? 'bg-[#008080] text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                <Icon className="w-5 h-5" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-900">{pt.label}</p>
                                <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{pt.desc}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Property Name */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Official Property Name (`name`) *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (!displayNameEn) setDisplayNameEn(e.target.value);
                        }}
                        placeholder="e.g. Urban Stay Luxury PG"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-[#008080] focus:ring-2 focus:ring-[#008080]/20 outline-none transition-all"
                      />
                    </div>

                    {/* i18n Display Names */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Display Name (English) *
                        </label>
                        <input
                          type="text"
                          required
                          value={displayNameEn}
                          onChange={(e) => setDisplayNameEn(e.target.value)}
                          placeholder="e.g. Urban Stay Luxury PG"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#008080] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Display Name (Hindi) *
                        </label>
                        <input
                          type="text"
                          value={displayNameHi}
                          onChange={(e) => setDisplayNameHi(e.target.value)}
                          placeholder="e.g. अर्बन स्टे लग्जरी पीजी"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#008080] outline-none"
                        />
                      </div>
                    </div>

                    {/* Construction Year & Languages */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Year of Construction (`yearOfConstruction`)
                        </label>
                        <input
                          type="number"
                          min={1990}
                          max={2030}
                          value={yearOfConstruction}
                          onChange={(e) => setYearOfConstruction(Number(e.target.value))}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#008080] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Owner / Manager UUID (`propertyOwnerId`)
                        </label>
                        <input
                          type="text"
                          value={propertyOwnerId}
                          onChange={(e) => setPropertyOwnerId(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-600 focus:bg-white focus:border-[#008080] outline-none"
                        />
                      </div>
                    </div>

                    {/* Languages Spoken Chips */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Languages Spoken by Staff (`languagesSpoken`)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {SPOKEN_LANGUAGES_OPTIONS.map((lang) => {
                          const isSelected = languagesSpoken.includes(lang);
                          return (
                            <button
                              type="button"
                              key={lang}
                              onClick={() => toggleTag(languagesSpoken, setLanguagesSpoken, lang)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#008080] text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              {isSelected ? '✓ ' : '+ '}
                              {lang}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Property Description (`descriptionI18n.en`) *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={descriptionEn}
                        onChange={(e) => setDescriptionEn(e.target.value)}
                        placeholder="Highlight rooms, food, vibe, WiFi, security..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#008080] outline-none resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 2: Address & Geolocation */}
                {currentStep === 2 && (
                  <div className="p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#008080] bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-md">
                        Step 2 of 5
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                        Address & GPS Geolocation
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500">
                        Exact physical street address, pincode, GPS coordinates, and Google Maps pin.
                      </p>
                    </div>

                    {/* Street & Area */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Street / Road (`address.street`) *
                        </label>
                        <input
                          type="text"
                          required
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          placeholder="e.g. 12th Main Road, 5th Cross"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#008080] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Locality / Sector (`address.area`) *
                        </label>
                        <input
                          type="text"
                          required
                          value={area}
                          onChange={(e) => setArea(e.target.value)}
                          placeholder="e.g. HSR Layout, Sector 62"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#008080] outline-none"
                        />
                      </div>
                    </div>

                    {/* City & Pincode */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          City (`address.city`) *
                        </label>
                        <select
                          value={city}
                          onChange={(e) => handleCityChange(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-[#008080] outline-none text-slate-800"
                        >
                          {POPULAR_CITIES.map((c) => (
                            <option key={c.cityId} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Pincode (`address.pincode`) *
                        </label>
                        <input
                          type="text"
                          required
                          pattern="[0-9]{6}"
                          maxLength={6}
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                          placeholder="6-digit postal code"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#008080] outline-none"
                        />
                      </div>
                    </div>

                    {/* Coordinates & Location Pin */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Latitude (`latitude`)
                        </label>
                        <input
                          type="number"
                          step="0.0001"
                          value={latitude}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setLatitude(val);
                            setLocationPin(`https://maps.google.com/?q=${val},${longitude}`);
                          }}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#008080] outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Longitude (`longitude`)
                        </label>
                        <input
                          type="number"
                          step="0.0001"
                          value={longitude}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setLongitude(val);
                            setLocationPin(`https://maps.google.com/?q=${latitude},${val}`);
                          }}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#008080] outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          City ID (`cityId`)
                        </label>
                        <input
                          type="text"
                          value={cityId}
                          onChange={(e) => setCityId(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-500 focus:bg-white outline-none"
                        />
                      </div>
                    </div>

                    {/* Location Pin URL */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Google Maps Location Pin (`locationPin`)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={locationPin}
                          onChange={(e) => setLocationPin(e.target.value)}
                          placeholder="https://maps.google.com/?q=12.9121,77.6446"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:border-[#008080] outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (navigator.geolocation) {
                              navigator.geolocation.getCurrentPosition((pos) => {
                                const lat = Number(pos.coords.latitude.toFixed(4));
                                const lng = Number(pos.coords.longitude.toFixed(4));
                                setLatitude(lat);
                                setLongitude(lng);
                                setLocationPin(`https://maps.google.com/?q=${lat},${lng}`);
                              });
                            }
                          }}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl whitespace-nowrap cursor-pointer transition-colors"
                        >
                          📍 Detect My GPS
                        </button>
                      </div>
                    </div>

                    {/* Nearby Landmarks & Places */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                          Nearby Landmarks (`nearbyLandmarks`)
                        </label>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {nearbyLandmarks.map((item) => (
                            <span
                              key={item}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-[#008080] text-xs font-semibold"
                            >
                              {item}
                              <button
                                type="button"
                                onClick={() => setNearbyLandmarks(nearbyLandmarks.filter((x) => x !== item))}
                                className="text-slate-400 hover:text-rose-600"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            value={customLandmarkInput}
                            onChange={(e) => setCustomLandmarkInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addCustomItem(customLandmarkInput, setCustomLandmarkInput, nearbyLandmarks, setNearbyLandmarks);
                              }
                            }}
                            placeholder="Add landmark (e.g. Metro)"
                            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              addCustomItem(customLandmarkInput, setCustomLandmarkInput, nearbyLandmarks, setNearbyLandmarks)
                            }
                            className="px-3 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <span className="text-[10px] text-slate-400 self-center">Popular:</span>
                          {DEFAULT_LANDMARKS.filter((item) => !nearbyLandmarks.includes(item)).slice(0, 4).map((item) => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => setNearbyLandmarks([...nearbyLandmarks, item])}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-700 transition-colors cursor-pointer"
                            >
                              + {item}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                          Nearby Places (`nearbyPlaces`)
                        </label>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {nearbyPlaces.map((item) => (
                            <span
                              key={item}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-[#008080] text-xs font-semibold"
                            >
                              {item}
                              <button
                                type="button"
                                onClick={() => setNearbyPlaces(nearbyPlaces.filter((x) => x !== item))}
                                className="text-slate-400 hover:text-rose-600"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            value={customNearbyInput}
                            onChange={(e) => setCustomNearbyInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addCustomItem(customNearbyInput, setCustomNearbyInput, nearbyPlaces, setNearbyPlaces);
                              }
                            }}
                            placeholder="Add nearby place (e.g. Mall)"
                            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              addCustomItem(customNearbyInput, setCustomNearbyInput, nearbyPlaces, setNearbyPlaces)
                            }
                            className="px-3 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <span className="text-[10px] text-slate-400 self-center">Popular:</span>
                          {DEFAULT_NEARBY_PLACES.filter((item) => !nearbyPlaces.includes(item)).slice(0, 4).map((item) => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => setNearbyPlaces([...nearbyPlaces, item])}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-700 transition-colors cursor-pointer"
                            >
                              + {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Rooms Capacity & Sharing Pricing */}
                {currentStep === 3 && (
                  <div className="p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#008080] bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-md">
                        Step 3 of 5
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                        Rooms Capacity & Monthly Rent
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500">
                        Monthly rents per sharing bed, deposit cycle, and total inventory count.
                      </p>
                    </div>

                    {/* Rooms, Beds & Bed Range */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Total Rooms (`totalRooms`) *
                        </label>
                        <input
                          type="number"
                          min={1}
                          required
                          value={totalRooms}
                          onChange={(e) => setTotalRooms(Number(e.target.value))}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white focus:border-[#008080] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Total Beds (`totalBeds`) *
                        </label>
                        <input
                          type="number"
                          min={1}
                          required
                          value={totalBeds}
                          onChange={(e) => setTotalBeds(Number(e.target.value))}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white focus:border-[#008080] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Bed Sharing Range (`bedRange`) *
                        </label>
                        <select
                          value={bedRange}
                          onChange={(e) => setBedRange(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white focus:border-[#008080] outline-none text-slate-800"
                        >
                          <option value="1-2 Beds">1-2 Beds Sharing</option>
                          <option value="1-3 Beds">1-3 Beds Sharing</option>
                          <option value="1-4 Beds">1-4 Beds Sharing</option>
                          <option value="2-4 Beds">2-4 Beds Sharing</option>
                        </select>
                      </div>
                    </div>

                    {/* 4 Sharing Pricing Cards */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Monthly Rent per Bed (in INR ₹) *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-[#008080] focus-within:ring-2 focus-within:ring-[#008080]/20 transition-all">
                          <span className="text-[11px] font-bold text-slate-500 uppercase">Single Sharing</span>
                          <p className="text-xs text-slate-400 mt-0.5">Private Room</p>
                          <div className="flex items-center gap-1 mt-2">
                            <span className="text-sm font-bold text-slate-400">₹</span>
                            <input
                              type="number"
                              value={singleSharingPrice}
                              onChange={(e) => setSingleSharingPrice(Number(e.target.value))}
                              placeholder="12000"
                              className="w-full bg-transparent text-lg font-black text-slate-900 outline-none"
                            />
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-[#008080] focus-within:ring-2 focus-within:ring-[#008080]/20 transition-all">
                          <span className="text-[11px] font-bold text-slate-500 uppercase">Double Sharing</span>
                          <p className="text-xs text-slate-400 mt-0.5">2 Beds per Room</p>
                          <div className="flex items-center gap-1 mt-2">
                            <span className="text-sm font-bold text-slate-400">₹</span>
                            <input
                              type="number"
                              value={doubleSharingPrice}
                              onChange={(e) => setDoubleSharingPrice(Number(e.target.value))}
                              placeholder="8500"
                              className="w-full bg-transparent text-lg font-black text-slate-900 outline-none"
                            />
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-[#008080] focus-within:ring-2 focus-within:ring-[#008080]/20 transition-all">
                          <span className="text-[11px] font-bold text-slate-500 uppercase">Triple Sharing</span>
                          <p className="text-xs text-slate-400 mt-0.5">3 Beds per Room</p>
                          <div className="flex items-center gap-1 mt-2">
                            <span className="text-sm font-bold text-slate-400">₹</span>
                            <input
                              type="number"
                              value={tripleSharingPrice}
                              onChange={(e) => setTripleSharingPrice(Number(e.target.value))}
                              placeholder="6500"
                              className="w-full bg-transparent text-lg font-black text-slate-900 outline-none"
                            />
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-[#008080] focus-within:ring-2 focus-within:ring-[#008080]/20 transition-all">
                          <span className="text-[11px] font-bold text-slate-500 uppercase">Four Sharing</span>
                          <p className="text-xs text-slate-400 mt-0.5">4 Beds per Room</p>
                          <div className="flex items-center gap-1 mt-2">
                            <span className="text-sm font-bold text-slate-400">₹</span>
                            <input
                              type="number"
                              value={fourSharingPrice}
                              onChange={(e) => setFourSharingPrice(Number(e.target.value))}
                              placeholder="5000"
                              className="w-full bg-transparent text-lg font-black text-slate-900 outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Security Deposit Refund Cycle */}
                    <div className="max-w-xs">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Security Deposit Return Cycle (Days)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          max={90}
                          value={securityDepositCycle}
                          onChange={(e) => setSecurityDepositCycle(Number(e.target.value))}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white focus:border-[#008080] outline-none"
                        />
                        <span className="text-xs font-bold text-slate-500">Days</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: Amenities, Facilities & Restrictions */}
                {currentStep === 4 && (
                  <div className="p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#008080] bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-md">
                        Step 4 of 5
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                        Amenities, In-Room Facilities & Rules
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500">
                        Choose amenities provided at the building, in-room features, and property house rules.
                      </p>
                    </div>

                    {/* Amenities Tag Selector */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Building Amenities (`amenities`)
                      </label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {DEFAULT_AMENITIES.map((am) => {
                          const isSelected = amenities.includes(am);
                          return (
                            <button
                              type="button"
                              key={am}
                              onClick={() => toggleTag(amenities, setAmenities, am)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                isSelected
                                  ? 'bg-[#008080] text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              {isSelected ? '✓' : '+'} {am}
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex gap-2 max-w-sm">
                        <input
                          type="text"
                          value={customAmenityInput}
                          onChange={(e) => setCustomAmenityInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addCustomItem(customAmenityInput, setCustomAmenityInput, amenities, setAmenities);
                            }
                          }}
                          placeholder="Add custom amenity..."
                          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            addCustomItem(customAmenityInput, setCustomAmenityInput, amenities, setAmenities)
                          }
                          className="px-3.5 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* In-Room Facilities */}
                    <div className="pt-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        In-Room Facilities (`facilities`)
                      </label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {DEFAULT_FACILITIES.map((fc) => {
                          const isSelected = facilities.includes(fc);
                          return (
                            <button
                              type="button"
                              key={fc}
                              onClick={() => toggleTag(facilities, setFacilities, fc)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                isSelected
                                  ? 'bg-[#008080] text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              {isSelected ? '✓' : '+'} {fc}
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex gap-2 max-w-sm">
                        <input
                          type="text"
                          value={customFacilityInput}
                          onChange={(e) => setCustomFacilityInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addCustomItem(customFacilityInput, setCustomFacilityInput, facilities, setFacilities);
                            }
                          }}
                          placeholder="Add in-room facility..."
                          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            addCustomItem(customFacilityInput, setCustomFacilityInput, facilities, setFacilities)
                          }
                          className="px-3.5 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* House Rules & Restrictions */}
                    <div className="pt-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        House Rules & Restrictions (`restrictions`)
                      </label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {DEFAULT_RESTRICTIONS.map((re) => {
                          const isSelected = restrictions.includes(re);
                          return (
                            <button
                              type="button"
                              key={re}
                              onClick={() => toggleTag(restrictions, setRestrictions, re)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                isSelected
                                  ? 'bg-amber-700 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              {isSelected ? '✓' : '+'} {re}
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex gap-2 max-w-sm">
                        <input
                          type="text"
                          value={customRestrictionInput}
                          onChange={(e) => setCustomRestrictionInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addCustomItem(customRestrictionInput, setCustomRestrictionInput, restrictions, setRestrictions);
                            }
                          }}
                          placeholder="Add house rule..."
                          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            addCustomItem(customRestrictionInput, setCustomRestrictionInput, restrictions, setRestrictions)
                          }
                          className="px-3.5 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: Contact, Photos & Review */}
                {currentStep === 5 && (
                  <div className="p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#008080] bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-md">
                        Step 5 of 5
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                        Contact Info, Photos & Publication
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500">
                        Official contact channels for tenant queries and property gallery photo URLs.
                      </p>
                    </div>

                    {/* WhatsApp Mobile & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          WhatsApp / Contact Number (`mobileContactNumber`) *
                        </label>
                        <div className="flex">
                          <select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            className="inline-flex items-center px-2.5 text-xs font-bold text-slate-700 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl outline-none cursor-pointer"
                          >
                            <option value="+91">+91 (IN)</option>
                            <option value="+1">+1 (US)</option>
                            <option value="+44">+44 (UK)</option>
                            <option value="+971">+971 (UAE)</option>
                          </select>
                          <input
                            type="tel"
                            required
                            pattern="[0-9]{10}"
                            maxLength={10}
                            value={mobileContactNumber}
                            onChange={(e) => setMobileContactNumber(e.target.value.replace(/\D/g, ''))}
                            placeholder="10-digit mobile number"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-r-xl text-sm font-semibold focus:bg-white focus:border-[#008080] outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Official Email (`email`) *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="owner@urbanstaypg.com"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#008080] outline-none"
                        />
                      </div>
                    </div>

                    {/* Website */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Property Website URL (`website`)
                      </label>
                      <input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://urbanstaypg.com"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#008080] outline-none"
                      />
                    </div>

                    {/* Photos URLs */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Gallery Photo URLs (`photos`)
                      </label>
                      <div className="space-y-2 mb-3">
                        {photos.map((p, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                            <img src={p} alt="Thumbnail" className="w-10 h-10 rounded-lg object-cover" />
                            <span className="text-xs text-slate-600 truncate flex-1 font-mono">{p}</span>
                            <button
                              type="button"
                              onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
                              className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={photoUrlInput}
                          onChange={(e) => setPhotoUrlInput(e.target.value)}
                          placeholder="Paste image URL (https://...)"
                          className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (photoUrlInput.trim()) {
                              setPhotos([...photos, photoUrlInput.trim()]);
                              setPhotoUrlInput('');
                            }
                          }}
                          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                        >
                          + Add Photo
                        </button>
                      </div>
                    </div>

                    {/* Marketplace Publishing Checkbox */}
                    <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/80">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isPublishedListing}
                          onChange={(e) => setIsPublishedListing(e.target.checked)}
                          className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#008080] focus:ring-[#008080]"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            Publish on PG Ease Marketplace (`isPublishedListing: true`)
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                            Showcase in city search results and receive direct zero-brokerage booking inquiries.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Form Footer Navigation Controls */}
                <div className="p-6 bg-slate-50/80 flex items-center justify-between">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                      className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 5 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep((s) => Math.min(5, s + 1))}
                      className="px-6 py-2.5 bg-[#008080] hover:bg-[#006e6e] text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      Next Step <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-7 py-3 bg-gradient-to-r from-[#008080] to-teal-600 hover:from-[#006e6e] hover:to-teal-700 text-white font-black text-sm rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Submitting Payload...
                        </>
                      ) : (
                        <>
                          Submit Property Listing
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Right Column: Live Property Preview Card (4 Cols) */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Live Marketplace Preview
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Auto-Updates
                  </span>
                </div>

                {/* PG Card Component */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden group">
                  <div className="relative h-48 w-full bg-slate-800">
                    <img
                      src={
                        photos[0] ||
                        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80'
                      }
                      alt={name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold border border-white/20">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      4.9 (New)
                    </div>
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#008080] text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                      Verified PG
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 truncate">
                        {name || 'Your PG Name'}
                      </h3>
                      {displayNameHi ? (
                        <p className="text-xs text-slate-400 truncate mt-0.5">{displayNameHi}</p>
                      ) : null}
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#008080] shrink-0" />
                        {area || 'Locality'}, {city} • {pincode}
                      </p>
                    </div>

                    {/* Bed options pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {singleSharingPrice ? (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                          1 Bed ₹{singleSharingPrice.toLocaleString('en-IN')}
                        </span>
                      ) : null}
                      {doubleSharingPrice ? (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                          2 Bed ₹{doubleSharingPrice.toLocaleString('en-IN')}
                        </span>
                      ) : null}
                      {tripleSharingPrice ? (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                          3 Bed ₹{tripleSharingPrice.toLocaleString('en-IN')}
                        </span>
                      ) : null}
                      {fourSharingPrice ? (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                          4 Bed ₹{fourSharingPrice.toLocaleString('en-IN')}
                        </span>
                      ) : null}
                    </div>

                    {/* Top Amenities */}
                    <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-100">
                      {amenities.slice(0, 4).map((am) => (
                        <span
                          key={am}
                          className="px-2 py-0.5 rounded-md bg-teal-50 text-[#008080] text-[10px] font-semibold"
                        >
                          ✓ {am}
                        </span>
                      ))}
                      {amenities.length > 4 ? (
                        <span className="text-[10px] text-slate-400 self-center">
                          +{amenities.length - 4} more
                        </span>
                      ) : null}
                    </div>

                    {/* Pricing summary */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Monthly Starting</span>
                        <span className="text-base font-black text-slate-900">
                          ₹{minStartingPrice.toLocaleString('en-IN')}{' '}
                          <span className="text-xs font-normal text-slate-500">/ mo</span>
                        </span>
                      </div>
                      <span className="px-3 py-1.5 rounded-xl bg-teal-50 text-[#008080] font-bold text-xs">
                        {totalBeds} Total Beds
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payload Quick Copy Box */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5" /> API Payload Ready
                  </span>
                  <button
                    type="button"
                    onClick={copyPayloadToClipboard}
                    className="text-[11px] font-bold text-teal-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedPayload ? 'Copied!' : 'Copy JSON'}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Payload contains all required keys: <code className="text-teal-300">propertyTypeId</code>,{' '}
                  <code className="text-teal-300">displayNameI18n</code>, <code className="text-teal-300">address</code>,{' '}
                  <code className="text-teal-300">geoLocation</code>, <code className="text-teal-300">sharing prices</code>.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
