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
    'Unlimited Beds & Rooms Management',
    'Automated Rent Reminders (WhatsApp & SMS)',
    'Digital Tenant KYC Verification',
    'Online Rent Collection (Manual UPI & Gateway)',
    'Expense, Deposit & Profit Tracking',
    'Staff & Property Manager Access',
    'Digital Rental Agreements',
    '24/7 Priority Support',
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

function cycleFromApi(key: 'monthly' | 'yearly', raw: any): PlanCycle | null {
  if (!raw || typeof raw !== 'object' || raw.pricePerBed == null) return null;
  return {
    cycle: key,
    label: raw.name || raw.label || (key === 'monthly' ? 'Monthly' : 'Yearly'),
    pricePerBed: Number(raw.pricePerBed),
    strikePerBed: raw.strikePerBed == null ? null : Number(raw.strikePerBed),
    period: raw.unit || raw.period || (key === 'monthly' ? 'per bed / month' : 'per bed / year'),
    note: raw.description || raw.note,
  };
}

/** The API sends cycles as { monthly, yearly }. Older responses used an array. */
export function normalizeCatalog(json: any): ProPlanCatalog | null {
  const source = json?.catalog?.name || json?.catalog?.cycles ? json.catalog : json;
  if (!source) return null;
  let cycles: PlanCycle[] = [];
  if (Array.isArray(source.cycles)) {
    cycles = source.cycles
      .map((item: any) => cycleFromApi(item.cycle === 'yearly' ? 'yearly' : 'monthly', item))
      .filter(Boolean) as PlanCycle[];
  } else if (source.cycles && typeof source.cycles === 'object') {
    const monthly = cycleFromApi('monthly', source.cycles.monthly);
    const yearly = cycleFromApi('yearly', source.cycles.yearly);
    cycles = [monthly, yearly].filter(Boolean) as PlanCycle[];
  }
  if (!cycles.length) return null;
  const enabled = Boolean(source.offer?.enabled);
  return {
    name: source.name || 'PG Ease Pro',
    gstPercent: Number(source.gstPercent ?? 18),
    offer: {
      enabled,
      badge: enabled ? source.offer?.badge || null : null,
    },
    features: Array.isArray(source.features) ? source.features : STATIC_PRO_PLAN.features,
    cycles,
  };
}

export const plansApi = {
  getCatalog: async (): Promise<ProPlanCatalog> => {
    const urls = [`${API_BASE}/public/plans`, `${API_BASE}/plans`];
    for (const url of urls) {
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        const json = await res.json();
        const catalog = normalizeCatalog(json);
        if (catalog) return catalog;
      } catch {
        // API is not live yet. The static plan below is shown instead.
      }
    }
    return STATIC_PRO_PLAN;
  },
};
