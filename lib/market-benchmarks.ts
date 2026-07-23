// Shared bucketing logic for cross-sector benchmarking (app/api/cross-sector,
// app/api/cron/benchmarks). Kept in one place so the cron that WRITES
// market_benchmarks rows and the API that READS them always agree on what a
// "sector" and a "business size" are — a prior version let these drift,
// which meant two businesses in the same real trade (e.g. one stored as
// `food_bev`, another as `Food & Beverage`) never got bucketed together.

// Every alias a profile's business_type or sector_hints can realistically
// hold today (see app/onboarding/page.tsx buildBizTypes/SECTOR_IDS), mapped
// to the canonical keys in components/intelligence/CrossSectorIntel.tsx's
// SECTOR_KEY_MAP. Keys are matched case-insensitively after trimming.
const SECTOR_ALIASES: Record<string, string> = {
  // business_type ids
  market_stall: 'market-stall',
  food_bev: 'food-bev',
  retail: 'retail',
  salon: 'salon',
  courier: 'courier',
  ecommerce: 'ecommerce',
  services: 'services',
  distributor: 'distributor',
  manufacturer: 'manufacturer',
  importer: 'import-export',
  exporter: 'import-export',
  // sectors (product category) ids — normalized to lowercase
  'fashion & apparel': 'fashion',
  'beauty & personal care': 'health-beauty',
  'health & wellness': 'health-beauty',
  'food & beverage': 'food-bev',
  'home & garden': 'home-garden',
  'electronics & tech': 'electronics-tech',
  'sports & outdoor': 'sports-outdoor',
  'luxury & premium': 'luxury-premium',
  'kids & toys': 'kids-toys',
  'pet products': 'pet-products',
  'arts & crafts': 'arts-crafts',
  automotive: 'automotive',
  'b2b / industrial': 'b2b-industrial',
  other: 'other',
}

/** Collapses any known business_type/sector_hints spelling to one canonical
 *  sector key. Unrecognized values (legacy free text, admin-entered, etc.)
 *  pass through unchanged — still displayable, just not translatable. */
export function normalizeSector(raw?: string | null): string {
  const trimmed = (raw || '').trim()
  if (!trimmed) return 'retail'
  return SECTOR_ALIASES[trimmed.toLowerCase()] || trimmed
}

export type BusinessSize = 'micro' | 'small' | 'medium'

export function businessSize(seatCount: number, plan: string): BusinessSize {
  if (plan === 'business' || seatCount >= 5) return 'medium'
  if (plan === 'growth' || seatCount >= 2) return 'small'
  return 'micro'
}
