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

export const plansApi = {
  getCatalog: async (): Promise<ProPlanCatalog> => {
    const urls = [`${API_BASE}/public/plans`, `${API_BASE}/plans`];
    let lastError: Error | null = null;
    for (const url of urls) {
      try {
        const res = await fetch(url);
        if (!res.ok) {
          lastError = new Error(`Plans API returned ${res.status}`);
          continue;
        }
        const json = await res.json();
        if (json?.catalog?.cycles?.length) {
          return json.catalog as ProPlanCatalog;
        }
        lastError = new Error('Plans API did not include a catalog');
      } catch (err) {
        lastError = err instanceof Error ? err : new Error('Plans API failed');
      }
    }
    throw lastError || new Error('Plans API failed');
  },
};
