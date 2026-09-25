const API_BASE = import.meta.env.VITE_API_URL || 'https://am4eey3lmk.execute-api.ap-south-1.amazonaws.com/api';

export interface PlanFeature {
  featureId?: string;
  featureKey?: string;
  name: string;
  description?: string;
  category?: string;
  limit?: number | null;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  displayName: string;
  description: string;
  price: number;
  pricePerBed: number;
  minBeds: number;
  maxBeds: number | null;
  billingInterval: string;
  trialDays: number;
  maxProperties?: number | null;
  maxTenants?: number | null;
  isPopular: boolean;
  displayOrder: number;
  features: PlanFeature[];
}

export interface PlansApiResponse {
  success: boolean;
  plans: SubscriptionPlan[];
  totalCount: number;
}

// Fallback plans based on backend database schema in case network is unreachable
export const FALLBACK_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan-lite-fallback',
    name: 'lite',
    displayName: 'Lite Plan',
    description: 'Direct UPI payments with 0% gateway fee, manual verification & full operations.',
    price: 0,
    pricePerBed: 29,
    minBeds: 1,
    maxBeds: null,
    billingInterval: 'monthly',
    trialDays: 0,
    maxProperties: 10,
    maxTenants: null,
    isPopular: false,
    displayOrder: 1,
    features: [
      { name: 'Direct UPI intent collection (0% fee)' },
      { name: 'Manual payment verification (Approve / Reject)' },
      { name: 'Dedicated Account Manager included' },
      { name: 'Unlimited properties, rooms & tenants' },
      { name: 'DigiLocker Aadhaar KYC verification' },
      { name: 'Electricity meter billing calculation' },
      { name: 'Real-time vacancy & occupancy dashboard' },
    ],
  },
  {
    id: 'plan-pro-fallback',
    name: 'pro',
    displayName: 'Pro Plan',
    description: 'Complete automation with payment gateway, T+2 settlement & dedicated PG website.',
    price: 0,
    pricePerBed: 49,
    minBeds: 1,
    maxBeds: null,
    billingInterval: 'monthly',
    trialDays: 45,
    maxProperties: null,
    maxTenants: null,
    isPopular: true,
    displayOrder: 2,
    features: [
      { name: 'Includes everything in Lite, plus:' },
      { name: 'Private PG Group Chat (Owner + Staff + Tenants)' },
      { name: 'Automated payment gateway collections' },
      { name: 'Automated Settlement (T+2 direct bank transfer)' },
      { name: 'Dedicated PG Website (pgname.pgease.in)' },
      { name: 'Dedicated Account Manager included' },
      { name: 'Digital rental agreement eSign' },
      { name: 'Automated WhatsApp rent reminders & notices' },
      { name: 'Granular staff roles & permissions' },
    ],
  },
];

export const plansApi = {
  getPlans: async (): Promise<SubscriptionPlan[]> => {
    try {
      // Try /public/plans first, fallback to /property-owners/plans
      let res = await fetch(`${API_BASE}/public/plans`);
      if (!res.ok) {
        res = await fetch(`${API_BASE}/property-owners/plans`);
      }
      if (!res.ok) {
        throw new Error(`Plans API returned status: ${res.status}`);
      }
      const json: PlansApiResponse = await res.json();
      if (json.success && Array.isArray(json.plans) && json.plans.length > 0) {
        return json.plans;
      }
      return FALLBACK_PLANS;
    } catch (err) {
      console.warn('Unable to load dynamic plans from API, using fallback plans:', err);
      return FALLBACK_PLANS;
    }
  },
};
