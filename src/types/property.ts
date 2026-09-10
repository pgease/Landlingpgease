export type RoomSharingType = 'Single' | 'Double' | 'Triple' | 'Triple+';
export type GenderType = 'Male' | 'Female' | 'Any';
export type ResidentType = 'Working professional' | 'Students' | 'All';

export interface Amenity {
  id: string;
  name: string;
  category: 'Common' | 'Room' | 'Services' | 'Food';
  iconName?: string;
}

export interface RentPackage {
  name: string;
  price: string;
  included: boolean;
}

export interface NearbyPlace {
  name: string;
  distance: string;
  category: 'Utilities' | 'Transit' | 'Food' | 'Shopping';
  type?: string;
}

export interface RoomOption {
  type: RoomSharingType;
  label: string; // e.g. "Single sharing"
  monthlyRent: number;
  securityDeposit: number;
  amenities: string[];
  currentOccupants: number;
  maxCapacity: number;
  availableBeds: number;
}

export interface PropertyOwner {
  name: string;
  avatar: string;
  bio: string;
  phone?: string;
  experience?: string;
}

export interface PropertyFAQ {
  question: string;
  answer: string;
}

export interface Property {
  id: string;
  slug: string;
  name: string;
  verified: boolean;
  address: string;
  city: string;
  area: string;
  startingPrice: number; // numeric for filtering
  displayPrice: string; // e.g. "Starts from ₹8,000" or "For rent, contact management"
  images: string[];
  sharingTypes: RoomSharingType[];
  gender: GenderType;
  genderLabel: string; // "Boys / Girls", "Male", "Female", "All"
  residentType: ResidentType;
  residentTypeLabel: string; // "Students / Working Professionals", etc.
  securityDepositPeriod: '15 days' | '1 Month' | '2 Month' | '3 Month';
  about: string;
  rentingTerms: {
    rent: string;
    securityDeposit: string;
    lockinPeriod: string;
    noticePeriod: string;
  };
  amenities: Amenity[];
  rentPackages: RentPackage[];
  rules: string[];
  locationDetails: {
    latitude: number;
    longitude: number;
    googleMapUrl?: string;
    landmark?: string;
  };
  nearbyPlaces: NearbyPlace[];
  owner: PropertyOwner;
  availableRooms: RoomOption[];
  faqs: PropertyFAQ[];
}

export interface PropertyFilters {
  sharingTypes: RoomSharingType[];
  gender: GenderType | 'All';
  residentType: ResidentType | 'All';
  maxBudget: number;
  securityDeposit: string[];
  searchQuery: string;
}
