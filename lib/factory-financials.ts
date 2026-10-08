// Factory revenue / COGS / stock value for the CFO section.
//
// Factory sales are approved `dispatch` captures priced by an approver
// (`dispatch_price`, per unit) — they never pass through pos_transactions, so
// the CFO snapshot cannot see them without this.
//
// Cost model — weighted-average cost of goods SOLD, with a byproduct credit:
//
//   pool        = raw material fed × weighted purchase price per kg
//               + electricity (per working day)
//               + labour      (per working day)
//               + overhead    (manual, default 0)
//   unit cost   = pool ÷ finished cans produced
//   COGS        = cans dispatched in the period × unit cost
//
// Worked example: 1,000 kg copra @170 → 35 cans @6,000. Pool 170,000 + 1,355
// power + 2,400 labour = 173,755 → 4,964/can → profit 36,245 (17.3%).
// Byproduct (cake/waste) sales are revenue with zero cost — they are the
// "credit": selling cake raises profit by exactly what it earns. They must NOT
// also be netted off the cost per can, or they would help twice. Seed fed but
// not yet sold stays in stock value, not COGS. Works for any factory type —
// products are recognised by role (raw / finished jerrycan / byproduct), not
// by sesame-specific names.
//
// Unit cost is one average over all history up to today, applied to every
// period, so a past month's COGS can move slightly as new production lands.
//
// Dispatches without a dispatch_price yet are NOT valued — they are counted in
// `unpricedDispatches` so the UI can say revenue is awaiting approver pricing
// rather than inventing a figure.
import { computeFactoryStock, type StockCapture, type StockCount } from '@/lib/factory-stock'

export interface FactoryCapture extends StockCapture {
  location_id?: string | null
  dispatch_price?: number | string | null
}

export interface FactoryWindow {
  start: string        // YYYY-MM-DD inclusive
  end: string
  compStart: string
  compEnd: string
  monthlyFrom: string  // 6-month P&L window
  monthlyTo: string
}

// Editable per-factory assumptions. Starting values are country-specific and
// live in lib/factory-cost-defaults.ts (only Kenya is pre-filled). `configured`
// false = labour/electricity not entered yet, so they are excluded from cost
// and the result is flagged incomplete rather than silently using another
// country's rates.
export interface FactoryCostSettings {
  configured: boolean
  staffPerDay: number
  electricityPerDay: number
  overhead: number
}
const NO_SETTINGS: FactoryCostSettings = { configured: false, staffPerDay: 0, electricityPerDay: 0, overhead: 0 }

interface Bucket { revenue: number; cogs: number }

export interface FactoryCostBreakdown {
  rawKgFed: number
  rawCostPerKg: number
  material: number
  workingDays: number
  electricity: number
  labour: number
  overhead: number
  byproductCredit: number   // byproduct (waste/cake) sales to date — informational, already counted as revenue
  pool: number
  cansProduced: number
  unitCost: number          // per finished can = pool ÷ cans produced (byproduct sales are revenue, not netted here)
  complete: boolean         // false when raw price, cans, or labour/electricity settings are missing → COGS understated
  missing: string[]         // which inputs are missing, e.g. ['labour_electricity_rates']
  assumptions: FactoryCostSettings
}

export interface FactoryFinancials {
  daily: Map<string, Bucket>
  monthly: Map<string, Bucket>
  products: Map<string, { revenue: number; cogs: number; units: number }>
  revenue: number
  cogs: number
  compRevenue: number
  compCogs: number
  dispatches: number
  unpricedDispatches: number
  unpricedQty: number
  stockValue: number
  cost: FactoryCostBreakdown
}

const num = (v: unknown) => Number(v) || 0
const dayOf = (iso?: string | null) => (iso || '').split('T')[0]
const within = (d: string, from: string, to: string) => d !== '' && d >= from && d <= to
const lower = (c: StockCapture) => (c.product_name || '').toLowerCase()

const isCan = (c: StockCapture) => /jerry\s?can|mtungi|matungi/.test(lower(c))
const isByproduct = (c: StockCapture) => /waste|cake|husk|shell|chaff/.test(lower(c))
const PRODUCTION_TYPES = new Set(['intake_feed', 'intake', 'output', 'packaging', 'wastage'])

// Factory-day key in Nairobi time (UTC+3) — same basis the Factory tab uses.
const nairobiDay = (iso: string) => new Date(new Date(iso).getTime() + 3 * 3_600_000).toISOString().slice(0, 10)
const isSunday = (day: string) => new Date(day + 'T00:00:00Z').getUTCDay() === 0

function add(map: Map<string, Bucket>, key: string, revenue: number, cogs: number) {
  const b = map.get(key) || { revenue: 0, cogs: 0 }
  b.revenue += revenue
  b.cogs += cogs
  map.set(key, b)
}

const emptyCost = (a: FactoryCostSettings): FactoryCostBreakdown => ({
  rawKgFed: 0, rawCostPerKg: 0, material: 0, workingDays: 0, electricity: 0, labour: 0, overhead: 0,
  byproductCredit: 0, pool: 0, cansProduced: 0, unitCost: 0, complete: true, missing: [], assumptions: a, // no activity → nothing to cost, nothing to warn about
})

export function computeFactoryFinancials(
  captures: FactoryCapture[],
  counts: StockCount[],
  w: FactoryWindow,
  now: number = Date.now(),
  settings: FactoryCostSettings = NO_SETTINGS,
): FactoryFinancials {
  const out: FactoryFinancials = {
    daily: new Map(), monthly: new Map(), products: new Map(),
    revenue: 0, cogs: 0, compRevenue: 0, compCogs: 0,
    dispatches: 0, unpricedDispatches: 0, unpricedQty: 0, stockValue: 0,
    cost: emptyCost(settings),
  }
  if (captures.length === 0) return out

  // ── Raw material fed + weighted purchase price ────────────────────────────
  // Legacy `intake` (pre-dates the arrival/feed split) means a delivery until
  // the first intake_feed was ever recorded, then feed — same rule as lib/factory-stock.
  const firstFeed = captures
    .filter(c => c.type === 'intake_feed' && c.created_at)
    .reduce((m, c) => Math.min(m, new Date(c.created_at!).getTime()), Infinity)
  let pricedCost = 0, pricedKg = 0, fedKg = 0
  for (const c of captures) {
    const q = num(c.quantity)
    if (q <= 0) continue
    if (c.type === 'intake_arrival' && c.param_label === 'intake_price_per_kg' && num(c.param_value) > 0) {
      pricedCost += num(c.param_value) * q
      pricedKg += q
    }
    const legacyFeed = c.type === 'intake' && c.created_at && new Date(c.created_at).getTime() >= firstFeed
    if (c.type === 'intake_feed' || legacyFeed) fedKg += q
  }
  const rawCostPerKg = pricedKg > 0 ? pricedCost / pricedKg : 0

  // ── Working days (Nairobi, Sundays excluded) ──────────────────────────────
  const activeDays = new Set<string>()
  for (const c of captures) {
    if (c.created_at && c.type && PRODUCTION_TYPES.has(c.type)) {
      const d = nairobiDay(c.created_at)
      if (!isSunday(d)) activeDays.add(d)
    }
  }

  // ── Finished cans produced: packaged + output entries of can products ─────
  // Same rule as lib/factory-stock. Dispatches are NOT counted as production:
  // a lump 'output' entry is how a catch-up is logged when dispatches ran ahead
  // of packaging, and also counting those dispatches would count each can twice
  // (the Factory tab's per-day fallback did exactly that: 313 vs the real 239).
  // Only a factory that never logs packaging/output at all falls back to dispatched.
  let canPackOut = 0, canDispatched = 0
  for (const c of captures) {
    if (!isCan(c)) continue
    if (c.type === 'packaging' || c.type === 'output') canPackOut += num(c.quantity)
    else if (c.type === 'dispatch') canDispatched += num(c.quantity)
  }
  const cansProduced = canPackOut > 0 ? canPackOut : canDispatched

  // ── Byproduct sales (priced dispatches of waste/cake/husk) ────────────────
  let byproductCredit = 0
  for (const c of captures) {
    if (c.type === 'dispatch' && isByproduct(c) && num(c.dispatch_price) > 0) byproductCredit += num(c.quantity) * num(c.dispatch_price)
  }

  const material = fedKg * rawCostPerKg
  const electricity = activeDays.size * settings.electricityPerDay
  const labour = activeDays.size * settings.staffPerDay
  const pool = material + electricity + labour + settings.overhead
  const unitCost = cansProduced > 0 ? pool / cansProduced : 0
  const missing: string[] = []
  if (!(rawCostPerKg > 0)) missing.push('raw_material_price')
  if (!(cansProduced > 0)) missing.push('finished_goods_output')
  if (!settings.configured) missing.push('labour_electricity_rates')
  out.cost = {
    rawKgFed: Math.round(fedKg), rawCostPerKg: Math.round(rawCostPerKg * 100) / 100,
    material: Math.round(material), workingDays: activeDays.size,
    electricity: Math.round(electricity), labour: Math.round(labour), overhead: settings.overhead,
    byproductCredit: Math.round(byproductCredit), pool: Math.round(pool),
    cansProduced: Math.round(cansProduced), unitCost: Math.round(unitCost),
    complete: missing.length === 0, missing, assumptions: settings,
  }

  // ── Stock value: raw on hand + cans on hand at unit cost ──────────────────
  // Sesame uses the count-anchored balance from lib/factory-stock; other
  // factories fall back to received − fed / produced − dispatched.
  const sesame = computeFactoryStock(captures, now, counts)
  let arrivedKg = 0, cansDispatched = 0
  for (const c of captures) {
    const q = num(c.quantity)
    if (c.type === 'intake_arrival') arrivedKg += q
    if (c.type === 'dispatch' && isCan(c)) cansDispatched += q
  }
  const rawOnHand = sesame.seedArrived > 0 ? sesame.seedKg : Math.max(0, arrivedKg - fedKg)
  const cansOnHand = sesame.cansProduced > 0 ? sesame.cans : Math.max(0, cansProduced - cansDispatched)
  out.stockValue = rawOnHand * rawCostPerKg + cansOnHand * unitCost

  // Book one event into whichever windows its date falls in.
  const book = (date: string, revenue: number, cogs: number, product: string, units: number) => {
    if (within(date, w.start, w.end)) {
      out.revenue += revenue
      out.cogs += cogs
      add(out.daily, date, revenue, cogs)
      const p = out.products.get(product) || { revenue: 0, cogs: 0, units: 0 }
      p.revenue += revenue; p.cogs += cogs; p.units += units
      out.products.set(product, p)
    }
    if (within(date, w.compStart, w.compEnd)) {
      out.compRevenue += revenue
      out.compCogs += cogs
    }
    if (within(date, w.monthlyFrom, w.monthlyTo)) add(out.monthly, date.slice(0, 7), revenue, cogs)
  }

  // Revenue (priced dispatches only) and COGS (cans dispatched × unit cost).
  for (const c of captures) {
    if (c.type !== 'dispatch') continue
    const date = dayOf(c.created_at)
    const qty = num(c.quantity)
    if (qty <= 0 || !date) continue
    const price = num(c.dispatch_price)
    if (within(date, w.start, w.end)) {
      out.dispatches++
      if (price <= 0) { out.unpricedDispatches++; out.unpricedQty += qty }
    }
    // Unpriced dispatches carry neither revenue nor cost until an approver prices them (keeps margin matched).
    if (price > 0) book(date, qty * price, isCan(c) ? qty * unitCost : 0, (c.product_name || 'Unknown').trim(), qty)
  }

  return out
}

// Sum several factories (each costed with its own settings) into one result.
export function mergeFactoryFinancials(list: FactoryFinancials[]): FactoryFinancials {
  const out = computeFactoryFinancials([], [], { start: '', end: '', compStart: '', compEnd: '', monthlyFrom: '', monthlyTo: '' })
  const mergeBucket = (into: Map<string, Bucket>, from: Map<string, Bucket>) => {
    for (const [k, v] of from) add(into, k, v.revenue, v.cogs)
  }
  for (const f of list) {
    mergeBucket(out.daily, f.daily)
    mergeBucket(out.monthly, f.monthly)
    for (const [k, v] of f.products) {
      const p = out.products.get(k) || { revenue: 0, cogs: 0, units: 0 }
      p.revenue += v.revenue; p.cogs += v.cogs; p.units += v.units
      out.products.set(k, p)
    }
    out.revenue += f.revenue; out.cogs += f.cogs
    out.compRevenue += f.compRevenue; out.compCogs += f.compCogs
    out.dispatches += f.dispatches; out.unpricedDispatches += f.unpricedDispatches; out.unpricedQty += f.unpricedQty
    out.stockValue += f.stockValue
  }
  return out
}
