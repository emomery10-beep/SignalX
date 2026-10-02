/**
 * Single source of truth for factory stock on hand, derived from APPROVED
 * pos_factory_captures. Every surface that shows factory stock (root
 * Factory Analytics → Inventory tab, /api/pos/factory/sesame-production,
 * pos-askbiz sesame dashboard, the synced `inventory` rows) must go through
 * this so they cannot disagree.
 *
 * NOTE: identical copy lives in lib/factory-stock.ts (root app) — the two apps
 * are deployed separately. Change both together.
 *
 * Stock = received/produced − consumed/dispatched:
 *   seed  = arrivals − feed − seed wastage
 *   cans  = packaging + jerrycan output − dispatched
 *   waste = waste produced (wastage + output) − dispatched − fed back
 */

export interface StockCapture {
  type?: string | null
  product_name?: string | null
  quantity?: number | string | null
  param_label?: string | null
  param_value?: number | string | null
  created_at?: string | null
}

export const JERRYCAN_PRODUCTION_COST = 6000 // KSh per 20L jerrycan
export const WASTE_COST_PER_KG = 30 // KSh per kg of byproduct waste
export const DEFAULT_SEED_COST_PER_KG = 30 // only when no purchase price was ever recorded

const DAY_MS = 86_400_000

const n = (v: unknown) => Number(v) || 0
const name = (c: StockCapture) => (c.product_name || '').toLowerCase()

export const isSeed = (c: StockCapture) => { const p = name(c); return p.includes('sesame seed') && !p.includes('oil') && !p.includes('waste') }
export const isCan = (c: StockCapture) => { const p = name(c); return p.includes('jerrycan') || p.includes('mtungi') }
export const isWaste = (c: StockCapture) => name(c).includes('sesame waste')

export interface FactoryStock {
  seedArrived: number
  seedFed: number
  seedWasted: number
  seedKg: number
  seedCostPerKg: number
  cansProduced: number
  cansDispatched: number
  cans: number
  wasteProduced: number
  wasteDispatched: number
  wasteFedBack: number
  wasteKg: number
  // last-30-day usage, for days-of-stock
  seedFedLast30: number
  cansDispatchedLast30: number
  wasteDispatchedLast30: number
}

export function computeFactoryStock(captures: StockCapture[], now: number = Date.now()): FactoryStock {
  const sum = (pred: (c: StockCapture) => boolean) =>
    captures.filter(pred).reduce((s, c) => s + n(c.quantity), 0)
  const recent = (c: StockCapture) => !!c.created_at && now - new Date(c.created_at).getTime() <= 30 * DAY_MS

  // Legacy `intake` type pre-dates the arrival/feed split: before the first
  // intake_feed was ever recorded it meant stock RECEIVED (e.g. the 2,000 kg
  // and 490 kg July/August deliveries); from then on it meant feed.
  const firstFeed = captures
    .filter(c => c.type === 'intake_feed' && isSeed(c) && c.created_at)
    .map(c => new Date(c.created_at as string).getTime())
    .reduce((a, b) => Math.min(a, b), Infinity)
  const legacyIsArrival = (c: StockCapture) =>
    c.type === 'intake' && isSeed(c) && (!c.created_at || new Date(c.created_at).getTime() < firstFeed)
  const legacyIsFeed = (c: StockCapture) =>
    c.type === 'intake' && isSeed(c) && !legacyIsArrival(c)

  const isArrival = (c: StockCapture) => (c.type === 'intake_arrival' && isSeed(c)) || legacyIsArrival(c)
  const isFeed = (c: StockCapture) => (c.type === 'intake_feed' && isSeed(c)) || legacyIsFeed(c)

  const seedArrived = sum(isArrival)
  const seedFed = sum(isFeed)
  const seedWasted = sum(c => c.type === 'wastage' && isSeed(c))

  // Quantity-weighted purchase price across all priced arrivals.
  let priced = 0, pricedKg = 0
  for (const c of captures) {
    if (c.type === 'intake_arrival' && isSeed(c) && c.param_label === 'intake_price_per_kg' && n(c.param_value) > 0) {
      priced += n(c.param_value) * n(c.quantity)
      pricedKg += n(c.quantity)
    }
  }
  const seedCostPerKg = pricedKg > 0 ? priced / pricedKg : DEFAULT_SEED_COST_PER_KG

  const cansProduced = sum(c => (c.type === 'packaging' || c.type === 'output') && isCan(c))
  const cansDispatched = sum(c => c.type === 'dispatch' && isCan(c))

  const wasteProduced = sum(c => (c.type === 'wastage' || c.type === 'output') && isWaste(c))
  const wasteDispatched = sum(c => c.type === 'dispatch' && isWaste(c))
  const wasteFedBack = sum(c => (c.type === 'intake_feed' || c.type === 'intake') && isWaste(c))

  const round = (v: number) => Math.round(v * 100) / 100
  return {
    seedArrived: round(seedArrived),
    seedFed: round(seedFed),
    seedWasted: round(seedWasted),
    seedKg: round(Math.max(0, seedArrived - seedFed - seedWasted)),
    seedCostPerKg: round(seedCostPerKg),
    cansProduced,
    cansDispatched,
    cans: Math.max(0, cansProduced - cansDispatched),
    wasteProduced: round(wasteProduced),
    wasteDispatched: round(wasteDispatched),
    wasteFedBack: round(wasteFedBack),
    wasteKg: round(Math.max(0, wasteProduced - wasteDispatched - wasteFedBack)),
    seedFedLast30: round(sum(c => isFeed(c) && recent(c))),
    cansDispatchedLast30: sum(c => c.type === 'dispatch' && isCan(c) && recent(c)),
    wasteDispatchedLast30: round(sum(c => c.type === 'dispatch' && isWaste(c) && recent(c))),
  }
}
