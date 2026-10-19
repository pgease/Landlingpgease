import { API_BASE } from '../config/api';

export interface PlanCycle {
  cycle: 'monthly' | 'yearly';
  label: string;
  pricePerBed: number;
  strikePerBed: number | null;
  period: string;
  note?: string;
}

export interface ProPlanCatalog {
  name: string;
  gstPercent: number;
  offer: { enabled: boolean; badge: string | null };
  features: string[];
  cycles: PlanCycle[];
}

export const STATIC_PRO_PLAN: ProPlanCatalog = {
  name: 'PG Ease Pro',
  gstPercent: 18,
  offer: {
    enabled: true,
    badge: '🪔 Diwali Offer – Grab it soon!',
  },
  features: [
    'Unlimited tenants, rooms, beds',
    'Rent tracking, dues, auto receipts',
    'Payment collection: Manual UPI OR Automatic payment gateway',
    'Complaints & tenant app',
    'Expenses & reports',
    'PG website (pgname.pgease.com)',
    'WhatsApp notifications (free)',
    'Paid add-ons (credits): Aadhaar KYC, rent e-agreement',
  ],
  cycles: [
    {
      cycle: 'monthly',
      label: 'Monthly',
      pricePerBed: 29,
      strikePerBed: 49,
      period: 'per bed / month',
    },
    {
      cycle: 'yearly',
      label: 'Yearly',
      pricePerBed: 290,
      strikePerBed: 490,
      period: 'per bed / year',
      note: '2 months free',
    },
  ],
};

export const plansApi = {
  getCatalog: async (): Promise<ProPlanCatalog> => {
    const urls = [`${API_BASE}/public/plans`, `${API_BASE}/plans`];
    for (const url of urls) {
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        const json = await res.json();
        if (json?.catalog?.cycles?.length) {
          return json.catalog as ProPlanCatalog;
        }
      } catch {
        // API is not live yet. The static plan below is shown instead.
      }
    }
    return STATIC_PRO_PLAN;
  },
};
