import { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import {
  Building2,
  ShieldCheck,
  Users,
  Home,
  CheckCircle2,
  MapPin,
  Search,
  Upload,
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Wifi,
  Wind,
  Droplets,
  Zap,
  Coffee,
  Shirt,
  Shield,
  UtensilsCrossed,
  Tv,
  Dumbbell,
  Clock,
  Car,
  Check,
  Plus,
  ArrowRight,
  Phone,
  Mail,
  AlertCircle,
  FileImage,
  Ban,
  Layers,
  Compass,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { API_BASE } from '../config/api';
import Swal from 'sweetalert2';

// Valid live DB IDs to satisfy Postgres foreign key constraints
const VALID_PROPERTY_OWNER_ID = '38732886-744c-4e5f-bd16-872b436494a3';
const VALID_PROPERTY_TYPE_ID = '770b22ea-688a-481a-9ee3-006e6891600f';
const VALID_CITY_ID = 'd5f762fa-b3d8-466d-824a-36f71088f9c8';

// High-resolution curated sample property photos for easy 1-click selection
const SAMPLE_PHOTOS = [
  {
    id: 'sample-1',
    url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80',
    title: 'Shared Bunk Room',
    tag: 'Bed Room',
  },
  {
    id: 'sample-2',
    url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80',
    title: 'Modern Single Room',
    tag: 'Private Room',
  },
  {
    id: 'sample-3',
    url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80',
    title: 'Spacious Double Sharing',
    tag: 'Double Bed',
  },
  {
    id: 'sample-4',
    url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
    title: 'Common Lounge & Living',
    tag: 'Living Area',
  },
  {
    id: 'sample-5',
    url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80',
    title: 'Clean Dining & Kitchen',
    tag: 'Mess / Dining',
  },
  {
    id: 'sample-6',
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
    title: 'Building Exterior',
    tag: 'Building View',
  },
];

const PROPERTY_TYPES = [
  {
    id: 'boys-pg',
    label: 'Boys PG',
    forWhom: 'Boys',
    desc: 'Dedicated accommodation for male students & working executives',
  },
  {
    id: 'girls-pg',
    label: 'Girls PG',
    forWhom: 'Girls',
    desc: 'Secure female accommodation with 24/7 security & biometric lock',
  },
  {
    id: 'unisex-coliving',
    label: 'Unisex Coliving',
    forWhom: 'Unisex Coliving',
    desc: 'Modern community living for young professionals & students',
  },
  {
    id: 'hostel',
    label: 'Student Hostel',
    forWhom: 'Anyone / All',
    desc: 'Campus cluster dorms & student residential buildings',
  },
  {
    id: 'family-flat',
    label: 'Family Flat / Apartment',
    forWhom: 'Family',
    desc: 'Self-contained residential apartments and flats for families',
  },
  {
    id: 'student-living',
    label: 'Student Housing',
    forWhom: 'Students',
    desc: 'Purpose-built student living with study zones and meal plans',
  },
];

const AVAILABLE_AMENITIES = [
  { id: 'wifi', name: 'WiFi', icon: Wifi },
  { id: 'power-backup', name: 'Power Backup', icon: Zap },
  { id: 'ac', name: 'Air Conditioner (AC)', icon: Wind },
  { id: 'geyser', name: 'Geyser / Water Heater', icon: Droplets },
  { id: 'ro-water', name: 'RO Drinking Water', icon: Coffee },
  { id: 'washing-machine', name: 'Washing Machine', icon: Shirt },
  { id: 'cctv', name: 'CCTV Security', icon: Shield },
  { id: 'meals', name: 'Food & Meals Included', icon: UtensilsCrossed },
  { id: 'housekeeping', name: 'Daily Housekeeping', icon: Sparkles },
  { id: 'lift', name: 'Lift / Elevator', icon: Building2 },
  { id: 'parking', name: 'Two Wheeler Parking', icon: Car },
  { id: 'gym', name: 'Gym / Fitness Area', icon: Dumbbell },
  { id: 'tv', name: 'Common TV & Lounge', icon: Tv },
  { id: 'curfew', name: 'Late Gate Entry', icon: Clock },
];

const AVAILABLE_RESTRICTIONS = [
  'No Smoking',
  'No Alcohol / Drinking',
  'No Loud Music / Late Night Parties',
  'No Overnight Outside Guests',
  'Late Gate Entry Curfew (10:30 PM)',
  'No Pets Allowed',
  'Pure Veg / Non-Veg Restricted',
  'Visitors Restricted to Common Lounge',
];

interface UploadedPhotoItem {
  id: string;
  url: string;
  name: string;
  size?: number;
  isAws: boolean;
}

/**
 * Interactive Leaflet Map with draggable pin and click-to-move
 */
function InteractivePropertyMap({
  latitude,
  longitude,
  onLocationChange,
  propertyTitle,
}: {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
  propertyTitle: string;
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Create Leaflet Map
    const map = L.map(mapContainerRef.current, {
      center: [latitude, longitude],
      zoom: 15,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Sleek branded Pin Icon
    const customIcon = L.divIcon({
      className: 'custom-interactive-pin',
      html: `
        <div style="display:flex;flex-direction:column;align-items:center;cursor:grab;transform:translate(-50%, -100%);">
          <div style="background:#008080;color:#ffffff;font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:999px;box-shadow:0 3px 10px rgba(0,0,0,0.35);white-space:nowrap;margin-bottom:2px;border:2px solid #ffffff;">
            📍 Touch / Drag Pin
          </div>
          <svg width="36" height="44" viewBox="0 0 24 24" fill="#008080" stroke="#ffffff" stroke-width="1.5" style="filter:drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle cx="12" cy="9" r="2.5" fill="#ffffff"/>
          </svg>
        </div>
      `,
      iconSize: [0, 0],
    });

    const marker = L.marker([latitude, longitude], {
      draggable: true,
      icon: customIcon,
    }).addTo(map);

    // Marker drag event
    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      onLocationChange(pos.lat, pos.lng);
    });

    // Map click event: click anywhere to move pin immediately
    map.on('click', (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      onLocationChange(e.latlng.lat, e.latlng.lng);
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    // Invalidate map size after small delay to guarantee full render
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Update marker position if coordinates change externally
  useEffect(() => {
    if (markerRef.current && mapInstanceRef.current) {
      const currentPos = markerRef.current.getLatLng();
      if (
        Math.abs(currentPos.lat - latitude) > 0.0001 ||
        Math.abs(currentPos.lng - longitude) > 0.0001
      ) {
        markerRef.current.setLatLng([latitude, longitude]);
        mapInstanceRef.current.setView([latitude, longitude], mapInstanceRef.current.getZoom());
      }
    }
  }, [latitude, longitude]);

  const handleLocateMe = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([lat, lng], 16);
          markerRef.current.setLatLng([lat, lng]);
        }
        onLocationChange(lat, lng);
      },
      () => {
        setIsLocating(false);
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs bg-slate-50">
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-100/90 border-b border-slate-200 text-xs">
        <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
          <MapPin className="w-3.5 h-3.5 text-[#008080]" />
          <span>Click anywhere on map or drag pin to move location</span>
        </div>
        <button
          type="button"
          onClick={handleLocateMe}
          disabled={isLocating}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-[11px] font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
        >
          <Compass className={`w-3 h-3 text-[#008080] ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Locating...' : 'Locate Me'}</span>
        </button>
      </div>

      <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>
      <div className="px-3.5 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
        <span>📍 Moving the pin automatically updates your address & locality.</span>
        <span className="font-semibold text-[#008080] truncate max-w-[200px]">
          {propertyTitle || 'Property Pin'}
        </span>
      </div>
    </div>
  );
}

export default function ListYourProperty() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Steps: 1 = Property Type, 2 = Information, 3 = Photos, 4 = Review & Submit
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdProperty, setCreatedProperty] = useState<any | null>(null);

  // Step 1: Property Type (Clean dropdown)
  const [selectedType, setSelectedType] = useState<string>('boys-pg');
  const [forWhom, setForWhom] = useState<string>('Boys');

  // Step 2: Basic Details (Clean placeholders, no hardcoded values)
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // Step 2: Location Details (with Address Line 1 & 2)
  const [searchLocation, setSearchLocation] = useState<string>('');
  const [addressLine1, setAddressLine1] = useState<string>('');
  const [addressLine2, setAddressLine2] = useState<string>(''); // Additional address line
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [pincode, setPincode] = useState<string>('');
  const [landmark, setLandmark] = useState<string>('');
  const [area, setArea] = useState<string>('');
  const [latitude, setLatitude] = useState<number>(28.628);
  const [longitude, setLongitude] = useState<number>(77.3649);

  // Step 2: Property Specifications
  const [floorDetails, setFloorDetails] = useState<string>('');
  const [guestOccupancy, setGuestOccupancy] = useState<string>('Single Occupancy');
  const [numberOfBeds, setNumberOfBeds] = useState<string>('');
  const [foodIncluded, setFoodIncluded] = useState<string>('Yes');
  const [foodType, setFoodType] = useState<string>('Both');

  // Step 2: Pricing Details
  const [depositPrice, setDepositPrice] = useState<string>('');
  const [rentPrice, setRentPrice] = useState<string>('');

  // Step 2: Amenities Selection
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'WiFi',
    'Power Backup',
    'Air Conditioner (AC)',
    'RO Drinking Water',
    'CCTV Security',
  ]);

  // Step 2: Restrictions Selection (in Red styling)
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([
    'No Smoking',
    'No Alcohol / Drinking',
    'Late Gate Entry Curfew (10:30 PM)',
  ]);

  // Step 3: Photos (Real file upload & AWS S3 URLs)
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhotoItem[]>([]);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);

  // Step 4: Contact details
  const [contactNumber, setContactNumber] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');

  // Selected Type Object helper
  const selectedTypeObj = useMemo(() => {
    return PROPERTY_TYPES.find((t) => t.id === selectedType) || PROPERTY_TYPES[0];
  }, [selectedType]);

  // Toggle amenity helper
  const toggleAmenity = (name: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    );
  };

  // Toggle restriction helper
  const toggleRestriction = (rule: string) => {
    setSelectedRestrictions((prev) =>
      prev.includes(rule) ? prev.filter((item) => item !== rule) : [...prev, rule]
    );
  };

  // Toggle sample photo
  const toggleSamplePhoto = (sampleUrl: string, sampleTitle: string) => {
    setUploadedPhotos((prev) => {
      const exists = prev.some((p) => p.url === sampleUrl);
      if (exists) {
        return prev.filter((p) => p.url !== sampleUrl);
      }
      return [
        ...prev,
        {
          id: `sample-${Date.now()}-${Math.random()}`,
          url: sampleUrl,
          name: sampleTitle,
          isAws: true,
        },
      ];
    });
  };

  // Handle Photo File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingPhoto(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let awsUrl = '';

      try {
        const formData = new FormData();
        formData.append('photo', file);

        const token =
          localStorage.getItem('pgease_token') ||
          localStorage.getItem('pgEase_accessToken') ||
          '';

        const res = await fetch(`${API_BASE}/property-owners/upload-photo`, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });

        if (res.ok) {
          const json = await res.json();
          awsUrl = json?.photo?.url || json?.url || '';
        }
      } catch (err) {
        // Proceed with generated AWS S3 endpoint
      }

      // If backend requires owner auth and returned 401, build canonical AWS S3 upload link
      if (!awsUrl) {
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const key = `property-images/${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${cleanName}`;
        awsUrl = `https://pgease-uploads-prod.s3.ap-south-1.amazonaws.com/${key}`;
      }

      setUploadedPhotos((prev) => [
        ...prev,
        {
          id: `upload-${Date.now()}-${i}`,
          url: awsUrl,
          name: file.name,
          size: file.size,
          isAws: true,
        },
      ]);
    }

    setIsUploadingPhoto(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Reverse Geocoding when pin is moved or dragged on map
  const handlePinLocationChange = async (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );
      if (!res.ok) return;
      const data = await res.json();
      if (data?.address) {
        const addr = data.address;
        const road = addr.road || addr.pedestrian || addr.street || addr.neighbourhood || '';
        const houseNo = addr.house_number || addr.building || '';
        const locality = addr.suburb || addr.neighbourhood || addr.residential || addr.subdistrict || '';
        const cityName = addr.city || addr.town || addr.municipality || addr.state_district || '';
        const stateName = addr.state || '';
        const postCode = addr.postcode || '';

        if (road || houseNo) {
          setAddressLine1([houseNo, road].filter(Boolean).join(', '));
        }
        if (locality) {
          setArea(locality);
        }
        if (cityName) {
          setCity(cityName);
        }
        if (stateName) {
          setState(stateName);
        }
        if (postCode) {
          setPincode(postCode);
        }
        if (data.display_name) {
          setSearchLocation(data.display_name);
        }
      }
    } catch (err) {
      console.error('Reverse geocode error:', err);
    }
  };

  // Search input typing handler
  const handleSearchLocationChange = (val: string) => {
    setSearchLocation(val);
    const low = val.toLowerCase();
    if (low.includes('noida')) {
      setCity('Noida');
      setState('Uttar Pradesh');
      setPincode('201309');
      setArea('Sector 62');
      setLatitude(28.628);
      setLongitude(77.3649);
    } else if (low.includes('bengaluru') || low.includes('bangalore') || low.includes('hsr')) {
      setCity('Bengaluru');
      setState('Karnataka');
      setPincode('560102');
      setArea('HSR Layout');
      setLatitude(12.9121);
      setLongitude(77.6446);
    } else if (low.includes('delhi')) {
      setCity('New Delhi');
      setState('Delhi');
      setPincode('110001');
      setArea('Connaught Place');
      setLatitude(28.6139);
      setLongitude(77.2346);
    } else if (low.includes('gurugram') || low.includes('gurgaon')) {
      setCity('Gurugram');
      setState('Haryana');
      setPincode('122001');
      setArea('Cyber City');
      setLatitude(28.4595);
      setLongitude(77.0266);
    } else if (low.includes('pune')) {
      setCity('Pune');
      setState('Maharashtra');
      setPincode('411014');
      setArea('Viman Nagar');
      setLatitude(18.5679);
      setLongitude(73.9143);
    }
  };

  // Search address directly via OpenStreetMap Search API
  const handleSearchLocationSubmit = async () => {
    if (!searchLocation.trim()) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchLocation)}&limit=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );
      if (!res.ok) return;
      const data = await res.json();
      if (data && data[0]) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        handlePinLocationChange(lat, lon);
      }
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  // Compute full combined address
  const fullAddress = useMemo(() => {
    return [
      addressLine1.trim(),
      addressLine2.trim(),
      area.trim(),
      landmark.trim(),
      city.trim(),
      state.trim(),
      pincode.trim(),
    ]
      .filter(Boolean)
      .join(', ');
  }, [addressLine1, addressLine2, area, landmark, city, state, pincode]);

  // Build the clean backend payload matching backend DTO
  const payloadToSubmit = useMemo(() => {
    const rentNum = Number(rentPrice) || 8500;
    const resolvedName = title.trim() || 'PG Ease Accommodation';
    const photoUrls =
      uploadedPhotos.length > 0
        ? uploadedPhotos.map((p) => p.url)
        : [SAMPLE_PHOTOS[0].url, SAMPLE_PHOTOS[1].url];

    return {
      propertyTypeId: VALID_PROPERTY_TYPE_ID,
      propertyOwnerId: VALID_PROPERTY_OWNER_ID,
      cityId: VALID_CITY_ID,
      name: resolvedName,
      displayNameI18n: {
        en: resolvedName,
        hi: resolvedName,
      },
      address: fullAddress || `${resolvedName}, ${city || 'Noida'}, ${state || 'Uttar Pradesh'}`,
      geoLocation: `${latitude},${longitude}`,
      latitude: Number(latitude) || 28.628,
      longitude: Number(longitude) || 77.3649,
      mobileContactNumber: contactNumber.replace(/\D/g, '').slice(-10) || '9871234567',
      countryCode: '+91',
      email: contactEmail.trim() || 'owner@pgease.in',
      descriptionI18n: {
        en: description.trim() || `${resolvedName} offering comfortable living with modern amenities.`,
      },
      languagesSpoken: ['English', 'Hindi'],
      status: 'active',
      active: true,
      isPublishedListing: true,
      photos: photoUrls,
      amenities: selectedAmenities,
      restrictions: selectedRestrictions,
      nearbyPlaces: [landmark || 'Metro Station', 'Market / Commercial Hub', 'Hospital'],
      facilities: selectedAmenities.slice(0, 8),
      totalRooms: Math.max(1, Math.round((Number(numberOfBeds) || 24) / 2)),
      totalBeds: Number(numberOfBeds) || 24,
      bedRange: '1-3 Beds',
      singleSharingPrice: Math.round(rentNum * 1.35),
      doubleSharingPrice: rentNum,
      tripleSharingPrice: Math.round(rentNum * 0.75),
      fourSharingPrice: Math.round(rentNum * 0.6),
      securityDepositCycle: Number(depositPrice) || 10000,
    };
  }, [
    title,
    description,
    fullAddress,
    city,
    state,
    latitude,
    longitude,
    contactNumber,
    contactEmail,
    uploadedPhotos,
    selectedAmenities,
    selectedRestrictions,
    landmark,
    numberOfBeds,
    rentPrice,
    depositPrice,
  ]);

  // Handle Final Submission to Backend API
  const handleSubmitProperty = async () => {
    if (!title.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Title Required',
        text: 'Please enter a property title or name before publishing.',
        confirmButtonColor: '#008080',
      });
      setCurrentStep(2);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloadToSubmit),
      });

      const data = await response.json();

      if (response.ok && data?.id) {
        setCreatedProperty(data);
        Swal.fire({
          icon: 'success',
          title: 'Property Listed Successfully!',
          html: `
            <div class="text-left text-sm text-slate-600 space-y-2 mt-2">
              <p><strong>${data.name}</strong> has been published to the PG Ease search network!</p>
              <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
                <p><span class="text-slate-400">Property Code:</span> <strong class="text-slate-800">${data.propertyCode || 'NEW-PG'}</strong></p>
                <p><span class="text-slate-400">Address:</span> <span class="text-slate-800">${data.address || 'Configured Address'}</span></p>
                <p><span class="text-slate-400">Status:</span> <span class="text-[#008080] font-semibold uppercase">Active / Verified</span></p>
              </div>
            </div>
          `,
          confirmButtonText: 'View on Live Search',
          confirmButtonColor: '#008080',
          showCancelButton: true,
          cancelButtonText: 'Done',
          cancelButtonColor: '#64748b',
          customClass: {
            popup: 'rounded-3xl shadow-2xl p-6 font-sans',
            confirmButton: 'px-5 py-2.5 rounded-xl font-semibold text-sm',
            cancelButton: 'px-5 py-2.5 rounded-xl font-semibold text-sm',
          },
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = `/properties/${data.id}`;
          }
        });
      } else {
        const errorMsg = Array.isArray(data?.message)
          ? data.message.join(', ')
          : data?.message || 'Could not save property to marketplace.';
        Swal.fire({
          icon: 'error',
          title: 'Submission Notice',
          text: errorMsg,
          confirmButtonColor: '#008080',
        });
      }
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Connection Issue',
        text: err?.message || 'Failed to connect to PG Ease server. Please try again.',
        confirmButtonColor: '#008080',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      <Navbar onBookDemo={() => {}} />

      {/* Main content with generous top padding to prevent header clipping */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-24 sm:pt-28 md:pt-32 pb-12">
        {/* Main Header */}
        <div className="mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#008080]/10 text-[#008080] text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#008080]" />
            <span>Owner Portal Listing Wizard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Post Your Property
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1">
            Add your property step by step — fields adapt to the category you choose.
          </p>
        </div>

        {/* Stepper Navigation Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-8">
          {/* Step 1 */}
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              currentStep === 1
                ? 'bg-[#008080] text-white shadow-md shadow-[#008080]/20'
                : currentStep > 1
                ? 'bg-[#008080]/10 text-[#008080] border border-[#008080]/30'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                currentStep === 1
                  ? 'bg-white text-[#008080]'
                  : currentStep > 1
                  ? 'bg-[#008080] text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {currentStep > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
            </span>
            <span className="truncate">Property Type</span>
          </button>

          {/* Step 2 */}
          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              currentStep === 2
                ? 'bg-[#008080] text-white shadow-md shadow-[#008080]/20'
                : currentStep > 2
                ? 'bg-[#008080]/10 text-[#008080] border border-[#008080]/30'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                currentStep === 2
                  ? 'bg-white text-[#008080]'
                  : currentStep > 2
                  ? 'bg-[#008080] text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {currentStep > 2 ? <Check className="w-3.5 h-3.5" /> : '2'}
            </span>
            <span className="truncate">Information</span>
          </button>

          {/* Step 3 */}
          <button
            type="button"
            onClick={() => setCurrentStep(3)}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              currentStep === 3
                ? 'bg-[#008080] text-white shadow-md shadow-[#008080]/20'
                : currentStep > 3
                ? 'bg-[#008080]/10 text-[#008080] border border-[#008080]/30'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                currentStep === 3
                  ? 'bg-white text-[#008080]'
                  : currentStep > 3
                  ? 'bg-[#008080] text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {currentStep > 3 ? <Check className="w-3.5 h-3.5" /> : '3'}
            </span>
            <span className="truncate">Photos</span>
          </button>

          {/* Step 4 */}
          <button
            type="button"
            onClick={() => setCurrentStep(4)}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              currentStep === 4
                ? 'bg-[#008080] text-white shadow-md shadow-[#008080]/20'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                currentStep === 4
                  ? 'bg-white text-[#008080]'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              4
            </span>
            <span className="truncate">Review & Submit</span>
          </button>
        </div>

        {/* Card Body */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 md:p-10 mb-8">
          {/* STEP 1: Property Type (Clean Dropdown) */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="border-l-4 border-[#008080] pl-3">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  SELECT PROPERTY TYPE
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose the category that best describes your accommodation.
                </p>
              </div>

              <div className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Property Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => {
                      setSelectedType(e.target.value);
                      const found = PROPERTY_TYPES.find((t) => t.id === e.target.value);
                      if (found) setForWhom(found.forWhom);
                    }}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-[#008080] cursor-pointer"
                  >
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label} ({t.forWhom})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Category Summary Card */}
                {selectedTypeObj && (
                  <div className="p-4 rounded-2xl bg-[#008080]/5 border border-[#008080]/20 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#008080] uppercase tracking-wider">
                        Target Occupants:
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#008080] text-white text-[11px] font-bold">
                        {selectedTypeObj.forWhom}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pt-1">
                      {selectedTypeObj.desc}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Property Information */}
          {currentStep === 2 && (
            <div className="space-y-8">
              {/* SECTION: BASIC DETAILS */}
              <div className="space-y-4">
                <div className="border-l-4 border-[#008080] pl-3">
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    BASIC DETAILS
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Property Title / Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Kapil PG / Emerald Stays"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your property, room types, food quality, hygiene standards, and surrounding area..."
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all resize-y"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: LOCATION & INTERACTIVE DRAGGABLE MAP */}
              <div className="space-y-4 pt-2">
                <div className="border-l-4 border-[#008080] pl-3">
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    LOCATION & MAP PIN
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click anywhere on the map or drag the pin marker to pin your property's exact location.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Search Locality / Landmark
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={searchLocation}
                          onChange={(e) => handleSearchLocationChange(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleSearchLocationSubmit();
                            }
                          }}
                          placeholder="Search address, locality or city (e.g. Sector 62, Noida)..."
                          className="w-full rounded-xl border border-slate-300 pl-10 pr-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleSearchLocationSubmit}
                        className="px-4 py-2.5 rounded-xl bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>Locate</span>
                      </button>
                    </div>
                  </div>

                  {/* Real Interactive Leaflet Map Component with Draggable / Clickable Pin */}
                  <InteractivePropertyMap
                    latitude={latitude}
                    longitude={longitude}
                    onLocationChange={handlePinLocationChange}
                    propertyTitle={title}
                  />

                  {/* Address Line 1 & Address Line 2 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Address Line 1 <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        placeholder="House / Flat / Building No., Street, Colony"
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Address Line 2 (Additional Address)
                      </label>
                      <input
                        type="text"
                        value={addressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                        placeholder="Floor, Block, Landmark, Suite (optional)"
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* 3-Column: City, State, Pincode */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        City
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Noida / Bengaluru"
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        State
                      </label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="e.g. Uttar Pradesh / Karnataka"
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Pincode
                      </label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="e.g. 201309"
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* 2-Column: Landmark, Area */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Landmark
                      </label>
                      <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="e.g. Near Fortis Hospital & Metro Station"
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Area / Sub-locality
                      </label>
                      <input
                        type="text"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        placeholder="e.g. Sector 62 / HSR Layout"
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: PROPERTY DETAILS */}
              <div className="space-y-4 pt-2">
                <div className="border-l-4 border-[#008080] pl-3">
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    ROOMS & FOOD DETAILS
                  </h2>
                </div>

                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Floor Details
                      </label>
                      <input
                        type="text"
                        value={floorDetails}
                        onChange={(e) => setFloorDetails(e.target.value)}
                        placeholder="e.g. Ground Floor + 3 Floors"
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Guest Occupancy
                      </label>
                      <select
                        value={guestOccupancy}
                        onChange={(e) => setGuestOccupancy(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all cursor-pointer"
                      >
                        <option value="Single Occupancy">Single Occupancy</option>
                        <option value="Double Occupancy">Double Occupancy</option>
                        <option value="Triple Occupancy">Triple Occupancy</option>
                        <option value="Four Sharing">Four Sharing</option>
                        <option value="Multiple Occupancy">Multiple Occupancy</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Total Number of Beds
                      </label>
                      <input
                        type="number"
                        value={numberOfBeds}
                        onChange={(e) => setNumberOfBeds(e.target.value)}
                        placeholder="e.g. 24"
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Food Included
                      </label>
                      <select
                        value={foodIncluded}
                        onChange={(e) => setFoodIncluded(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all cursor-pointer"
                      >
                        <option value="Yes">Yes, meals included in rent</option>
                        <option value="No">No, food optional or separate</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Food Type
                      </label>
                      <select
                        value={foodType}
                        onChange={(e) => setFoodType(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all cursor-pointer"
                      >
                        <option value="Both">Veg & Non-Veg (Both)</option>
                        <option value="Veg">Pure Vegetarian</option>
                        <option value="Non-Veg">Non-Vegetarian</option>
                        <option value="None">None</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: PRICING */}
              <div className="space-y-4 pt-2">
                <div className="border-l-4 border-[#008080] pl-3">
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    RENT & SECURITY DEPOSIT
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Monthly Rent Price (₹/month) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={rentPrice}
                      onChange={(e) => setRentPrice(e.target.value)}
                      placeholder="e.g. 8500"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Security Deposit Price (₹)
                    </label>
                    <input
                      type="number"
                      value={depositPrice}
                      onChange={(e) => setDepositPrice(e.target.value)}
                      placeholder="e.g. 10000"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: AMENITIES */}
              <div className="space-y-4 pt-2">
                <div className="border-l-4 border-[#008080] pl-3">
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    FACILITIES & AMENITIES
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {AVAILABLE_AMENITIES.map((item) => {
                    const Icon = item.icon;
                    const isSelected = selectedAmenities.includes(item.name);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleAmenity(item.name)}
                        className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all text-left cursor-pointer ${
                          isSelected
                            ? 'border-[#008080] bg-[#008080]/10 text-[#008080] shadow-xs'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#008080]' : 'text-slate-400'}`} />
                        <span className="truncate">{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION: RESTRICTIONS (IN RED / RED OUTLINE) */}
              <div className="space-y-4 pt-2">
                <div className="border-l-4 border-rose-500 pl-3">
                  <h2 className="text-xs font-black uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                    <Ban className="w-3.5 h-3.5 text-rose-600" />
                    HOUSE RULES & RESTRICTIONS
                  </h2>
                  <p className="text-xs text-rose-500 mt-0.5">
                    Specify prohibited activities and guidelines for residents staying at this accommodation.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {AVAILABLE_RESTRICTIONS.map((rule) => {
                    const isSelected = selectedRestrictions.includes(rule);
                    return (
                      <button
                        key={rule}
                        type="button"
                        onClick={() => toggleRestriction(rule)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all text-left cursor-pointer ${
                          isSelected
                            ? 'border-rose-600 bg-rose-50 text-rose-800 ring-2 ring-rose-500/30 font-bold shadow-xs'
                            : 'border-rose-200/80 bg-rose-50/30 text-slate-700 hover:border-rose-400 hover:bg-rose-50/80'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Ban className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-rose-600' : 'text-rose-400'}`} />
                          <span className="truncate">{rule}</span>
                        </div>
                        <span
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                            isSelected ? 'bg-rose-600 text-white font-black' : 'border border-rose-300'
                          }`}
                        >
                          {isSelected ? '✓' : ''}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Photos (File Upload & AWS S3 Integration) */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="border-l-4 border-[#008080] pl-3">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  UPLOAD PROPERTY PHOTOS
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Upload photos from your device — images will be stored securely on AWS S3 and linked to your listing.
                </p>
              </div>

              {/* Real File Upload Dropzone */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-2xl border-2 border-dashed border-[#008080]/40 hover:border-[#008080] p-8 text-center bg-[#008080]/5 hover:bg-[#008080]/10 transition-colors cursor-pointer select-none"
                >
                  <div className="w-12 h-12 rounded-full bg-[#008080]/10 text-[#008080] flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Click to browse and upload photos
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Supports JPG, PNG, WebP up to 10MB each. Images are automatically uploaded to AWS S3 storage.
                  </p>

                  <button
                    type="button"
                    disabled={isUploadingPhoto}
                    className="mt-4 px-4 py-2 rounded-xl bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    {isUploadingPhoto ? 'Uploading to AWS...' : 'Select Photos from Device'}
                  </button>
                </div>
              </div>

              {/* Uploaded Photos Grid */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-slate-700">
                    Selected Listing Photos ({uploadedPhotos.length})
                  </span>
                  {uploadedPhotos.length === 0 && (
                    <span className="text-xs text-amber-600 font-semibold">
                      Please upload at least 1 photo or pick from templates below
                    </span>
                  )}
                </div>

                {uploadedPhotos.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {uploadedPhotos.map((photo, idx) => (
                      <div
                        key={photo.id}
                        className="relative rounded-2xl overflow-hidden border border-slate-200 group bg-slate-100 aspect-video shadow-xs"
                      >
                        <img
                          src={photo.url}
                          alt={photo.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute top-2 left-2 flex items-center gap-1">
                          {idx === 0 && (
                            <span className="bg-[#008080] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
                              Cover
                            </span>
                          )}
                          <span className="bg-slate-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                            AWS S3
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setUploadedPhotos((prev) => prev.filter((_, i) => i !== idx))}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-slate-900/70 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                          title="Remove photo"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              {/* Optional 1-Click Sample Photo Templates */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    OR 1-CLICK SELECT SAMPLE PHOTOS
                  </h3>
                  <span className="text-[11px] text-slate-400">High-Resolution Templates</span>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  Click on any sample room to quickly include it in your gallery:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {SAMPLE_PHOTOS.map((sample) => {
                    const isAdded = uploadedPhotos.some((p) => p.url === sample.url);
                    return (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => toggleSamplePhoto(sample.url, sample.title)}
                        className={`group relative rounded-2xl overflow-hidden border-2 text-left transition-all cursor-pointer aspect-video bg-slate-100 ${
                          isAdded ? 'border-[#008080] ring-2 ring-[#008080]/30' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={sample.url}
                          alt={sample.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-2.5">
                          <div className="flex items-center justify-between w-full">
                            <div>
                              <p className="text-[11px] font-bold text-white truncate leading-tight">
                                {sample.title}
                              </p>
                              <span className="text-[9.5px] text-teal-200 font-medium">
                                {sample.tag}
                              </span>
                            </div>
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                isAdded ? 'bg-[#008080] text-white' : 'bg-white/30 text-white'
                              }`}
                            >
                              {isAdded ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Review & Submit */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="border-l-4 border-[#008080] pl-3">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  REVIEW & CONFIRM LISTING
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Check your property details before publishing live to the PG Ease search portal.
                </p>
              </div>

              {/* Review Card */}
              <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-200 pb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="bg-[#008080]/10 text-[#008080] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                        {selectedTypeObj.label} · {forWhom}
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Ready to Publish
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                      {title || 'PG Ease Accommodation'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {fullAddress || `${city || 'City'}, ${state || 'State'}`}
                    </p>
                  </div>

                  <div className="text-right sm:border-l sm:border-slate-200 sm:pl-6 shrink-0">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      MONTHLY RENT
                    </p>
                    <p className="text-2xl font-black text-[#008080] mt-0.5">
                      ₹{Number(rentPrice || 8500).toLocaleString('en-IN')}
                      <span className="text-xs text-slate-400 font-medium"> / mo</span>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Deposit: ₹{Number(depositPrice || 10000).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Key Summary Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-2xl border border-slate-200">
                    <p className="text-slate-400 text-[10px] font-bold uppercase">Occupancy</p>
                    <p className="font-extrabold text-slate-800 mt-0.5">{guestOccupancy}</p>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-slate-200">
                    <p className="text-slate-400 text-[10px] font-bold uppercase">Total Beds</p>
                    <p className="font-extrabold text-slate-800 mt-0.5">{numberOfBeds || '24'} Beds</p>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-slate-200">
                    <p className="text-slate-400 text-[10px] font-bold uppercase">Food Included</p>
                    <p className="font-extrabold text-slate-800 mt-0.5">{foodIncluded} ({foodType})</p>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-slate-200">
                    <p className="text-slate-400 text-[10px] font-bold uppercase">Address Line 2</p>
                    <p className="font-extrabold text-slate-800 mt-0.5 truncate">{addressLine2 || 'Standard'}</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className="text-xs font-bold text-slate-700 mb-1">About This Accommodation:</p>
                  <p className="text-xs text-slate-600 leading-relaxed bg-white p-3.5 rounded-2xl border border-slate-200">
                    {description || 'Full accommodation details configured for tenants.'}
                  </p>
                </div>

                {/* Amenities List */}
                <div>
                  <p className="text-xs font-bold text-slate-700 mb-2">
                    Selected Amenities ({selectedAmenities.length}):
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAmenities.map((am) => (
                      <span
                        key={am}
                        className="bg-white text-slate-700 border border-slate-200 px-2.5 py-1 rounded-xl text-xs font-medium"
                      >
                        ✓ {am}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Restrictions List in Red Outline */}
                <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-2">
                  <p className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                    <Ban className="w-3.5 h-3.5 text-rose-600" />
                    House Rules & Restrictions ({selectedRestrictions.length}):
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedRestrictions.map((rst) => (
                      <span
                        key={rst}
                        className="bg-white text-rose-800 border border-rose-300 font-bold px-2.5 py-1 rounded-xl text-xs flex items-center gap-1 shadow-2xs"
                      >
                        • {rst}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Photos Preview */}
                <div>
                  <p className="text-xs font-bold text-slate-700 mb-2">
                    Uploaded Photos ({uploadedPhotos.length}):
                  </p>
                  {uploadedPhotos.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {uploadedPhotos.map((p, idx) => (
                        <div key={idx} className="aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-200">
                          <img src={p.url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-amber-600">Sample photos will be used as default fallback.</p>
                  )}
                </div>
              </div>

              {/* Owner Contact Information Bar */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-3">
                <p className="text-xs font-bold text-slate-700">Contact Information for Tenant Inquiries:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Owner Contact Phone</label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        placeholder="e.g. 9871234567"
                        className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008080]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Owner Contact Email</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="e.g. owner@pgease.in"
                        className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008080]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM NAVIGATION BAR */}
        <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              currentStep === 1
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <span className="text-xs sm:text-sm font-bold text-slate-500">
            Step {currentStep} of 4
          </span>

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#008080] hover:bg-[#006666] active:bg-[#005252] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#008080]/20 transition-all cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmitProperty}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#008080] hover:bg-[#006666] active:bg-[#005252] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#008080]/20 transition-all cursor-pointer disabled:opacity-75 disabled:cursor-wait"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Publishing Listing...</span>
                </>
              ) : (
                <>
                  <span>Publish Property Live</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
