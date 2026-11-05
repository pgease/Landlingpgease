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

/** The API sends cycles as { monthly, yearly } or as an array. */
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

  return {
    name: source.name || '',
    gstPercent: Number(source.gstPercent ?? 0),
    offer: {
      enabled: Boolean(source.offer?.enabled),
      badge: source.offer?.enabled ? source.offer?.badge || null : null,
    },
    features: Array.isArray(source.features) ? source.features : [],
    cycles,
  };
}

export const plansApi = {
  getCatalog: async (): Promise<ProPlanCatalog | null> => {
    let catalog: ProPlanCatalog | null = null;
    const urls = [`${API_BASE}/public/plans`, `${API_BASE}/plans`];

    for (const url of urls) {
      try {
        const res = await fetch(url, { headers: { Accept: 'application/json' } });
        if (!res.ok) continue;
        const json = await res.json();
        catalog = normalizeCatalog(json);
        if (catalog) break;
      } catch {
        // continue to next endpoint
      }
    }

    if (!catalog) return null;

    // Check if there is an active offer override from /plans/offer
    const offerUrls = [`${API_BASE}/plans/offer`, `${API_BASE}/public/plans/offer`];
    for (const offerUrl of offerUrls) {
      try {
        const res = await fetch(offerUrl, { headers: { Accept: 'application/json' } });
        if (!res.ok) continue;
        const json = await res.json();
        const offer = json?.offer;
        if (offer && typeof offer === 'object') {
          const isEnabled =
            offer.offerEnabled !== undefined
              ? Boolean(offer.offerEnabled)
              : Boolean(offer.enabled);

          const updatedCycles: PlanCycle[] = catalog.cycles.map((c: PlanCycle): PlanCycle => {
            if (c.cycle === 'monthly') {
              return {
                ...c,
                pricePerBed:
                  offer.offerPricePerBedMonthly != null
                    ? Number(offer.offerPricePerBedMonthly)
                    : c.pricePerBed,
                strikePerBed:
                  isEnabled && offer.strikePricePerBedMonthly != null
                    ? Number(offer.strikePricePerBedMonthly)
                    : null,
              };
            }
            if (c.cycle === 'yearly') {
              return {
                ...c,
                pricePerBed:
                  offer.offerPricePerBedYearly != null
                    ? Number(offer.offerPricePerBedYearly)
                    : c.pricePerBed,
                strikePerBed:
                  isEnabled && offer.strikePricePerBedYearly != null
                    ? Number(offer.strikePricePerBedYearly)
                    : null,
              };
            }
            return c;
          });

          catalog = {
            ...catalog,
            offer: {
              enabled: isEnabled,
              badge: isEnabled ? offer.badge || catalog.offer.badge : null,
            },
            cycles: updatedCycles,
          };
          break;
        }
      } catch {
        // continue
      }
    }

    return catalog;
  },
};
