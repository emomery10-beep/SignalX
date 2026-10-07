/**
 * Single source of truth for factory stock on hand, derived from APPROVED
 * pos_factory_captures plus any physical stock counts. Every surface that shows
 * factory stock (root Factory Analytics → Inventory tab, /api/pos/factory/
 * sesame-production, pos-askbiz sesame dashboard, the synced `inventory` rows)
 * goes through this so they cannot disagree.
 *
 * NOTE: identical copy lives in pos-askbiz/lib/factory-stock.ts — the two apps
 * are deployed separately. Change both together.
 *
 *   seed  = arrivals − feed − seed wastage
 *   cans  = packaging + jerrycan output − dispatched
 *   waste = logged wastage − dispatched − fed back (only captures typed 'wastage')
 *
 * A physical count (pos_stock_adjustments, reason 'factory_stock_count')
 * resets a product's balance: stock = counted qty + movements recorded after
 * the count. Captures only ever see what was typed in, so counts are how the
 * ledger is re-anchored to reality.
 */

export interface StockCapture {
  type?: string | null
  product_name?: string | null
  quantity?: number | string | null
  param_label?: string | null
  param_value?: number | string | null
  created_at?: string | null
}

export interface StockCount {
  product_name?: string | null
  counted_qty?: number | string | null
  created_at?: string | null
}

export const FACTORY_COUNT_REASON = 'factory_stock_count'
export const JERRYCAN_PRODUCTION_COST = 6000 // KSh per 20L jerrycan
export const WASTE_COST_PER_KG = 30 // KSh per kg of byproduct waste
export const DEFAULT_SEED_COST_PER_KG = 30 // only when no purchase price was ever recorded
// Seed deliveries arrive in 80 kg bags and are priced. An unpriced arrival
// under this size is a bag count typed as kg (e.g. "28" beside a 2,240 kg =
// 28 bag delivery), not stock received.
export const MIN_UNPRICED_ARRIVAL_KG = 500

export type StockKind = 'seed' | 'cans' | 'waste'
export const KIND_NAME: Record<StockKind, string> = {
  seed: 'Sesame seed',
  cans: 'Sesame oil - Jerrycan Matungi (20L)',
  waste: 'Sesame waste',
}

const DAY_MS = 86_400_000
const n = (v: unknown) => Number(v) || 0
const name = (c: { product_name?: string | null }) => (c.product_name || '').toLowerCase()
const ts = (v?: string | null) => (v ? new Date(v).getTime() : 0)

export const isSeed = (c: { product_name?: string | null }) => { const p = name(c); return p.includes('sesame seed') && !p.includes('oil') && !p.includes('waste') }
export const isCan = (c: { product_name?: string | null }) => { const p = name(c); return p.includes('jerrycan') || p.includes('mtungi') }
export const isWaste = (c: { product_name?: string | null }) => name(c).includes('sesame waste')

export function kindOf(c: { product_name?: string | null }): StockKind | null {
  if (isWaste(c)) return 'waste'
  if (isCan(c)) return 'cans'
  if (isSeed(c)) return 'seed'
  return null
}

export interface Movement {
  at: string
  type: string
  kind: StockKind
  dir: 'in' | 'out' | 'ignored'
  label: string
  qty: number // always positive; direction in `dir`
  counted: boolean // false = recorded before the latest physical count, so not in the balance
}

export interface KindStock {
  base: number // counted qty, or 0 when never counted
  countedAt: string | null
  in: number // movements in the balance window
  out: number
  onHand: number
}

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
  seedFedLast30: number
  cansDispatchedLast30: number
  wasteDispatchedLast30: number
  byKind: Record<StockKind, KindStock>
  lastArrival: { at: string; qty: number; fedSince: number; expected: number } | null
  movements: Record<StockKind, Movement[]>
}

const LABELS: Record<string, string> = {
  intake_arrival: 'Delivery received', intake: 'Intake (legacy)', intake_feed: 'Fed to machine',
  wastage: 'Wastage', output: 'Produced', packaging: 'Packaged', dispatch: 'Dispatched',
}

export function classify(captures: StockCapture[]): Movement[] {
  // Legacy `intake` type pre-dates the arrival/feed split: before the first
  // intake_feed was ever recorded it meant stock RECEIVED (e.g. the 2,000 kg
  // and 490 kg July/August deliveries); from then on it meant feed.
  const firstFeed = captures
    .filter(c => c.type === 'intake_feed' && isSeed(c) && c.created_at)
    .map(c => ts(c.created_at))
    .reduce((a, b) => Math.min(a, b), Infinity)

  const out: Movement[] = []
  for (const c of captures) {
    const kind = kindOf(c)
    if (!kind || !c.type || !c.created_at) continue
    const qty = n(c.quantity)
    if (qty <= 0) continue
    let dir: Movement['dir'] | null = null
    let label = LABELS[c.type] || c.type

    if (kind === 'seed') {
      if (c.type === 'intake_arrival') {
        const priced = c.param_label === 'intake_price_per_kg' && n(c.param_value) > 0
        if (!priced && qty < MIN_UNPRICED_ARRIVAL_KG) { dir = 'ignored'; label = 'Ignored — looks like a bag count typed as kg' }
        else dir = 'in'
      } else if (c.type === 'intake') {
        if (ts(c.created_at) < firstFeed) { dir = 'in'; label = 'Delivery received' } else { dir = 'out'; label = 'Fed to machine' }
      } else if (c.type === 'intake_feed') dir = 'out'
      else if (c.type === 'wastage') { dir = 'out'; label = 'Seed wastage' }
    } else if (kind === 'cans') {
      if (c.type === 'packaging' || c.type === 'output') dir = 'in'
      else if (c.type === 'dispatch') dir = 'out'
    } else {
      if (c.type === 'wastage') { dir = 'in'; label = 'Waste logged as wastage' }
      else if (c.type === 'dispatch') dir = 'out'
      else if (c.type === 'intake_feed' || c.type === 'intake') { dir = 'out'; label = 'Fed back to machine' }
    }
    if (!dir) continue
    out.push({ at: c.created_at, type: c.type, kind, dir, label, qty, counted: true })
  }
  return out.sort((a, b) => ts(b.at) - ts(a.at))
}

export function computeFactoryStock(captures: StockCapture[], now: number = Date.now(), counts: StockCount[] = []): FactoryStock {
  const round = (v: number) => Math.round(v * 100) / 100
  const moves = classify(captures)

  // Latest physical count per product kind.
  const latest: Partial<Record<StockKind, { qty: number; at: string }>> = {}
  for (const c of [...counts].sort((a, b) => ts(b.created_at) - ts(a.created_at))) {
    const k = kindOf(c)
    if (k && !latest[k] && c.created_at) latest[k] = { qty: Math.max(0, n(c.counted_qty)), at: c.created_at }
  }
  for (const m of moves) { const l = latest[m.kind]; m.counted = !l || ts(m.at) > ts(l.at) }

  const sumAll = (kind: StockKind, type: string, dir: Movement['dir'], recentOnly = false) =>
    moves.filter(m => m.kind === kind && m.type === type && m.dir === dir && (!recentOnly || now - ts(m.at) <= 30 * DAY_MS)).reduce((s, m) => s + m.qty, 0)
  const sumDir = (kind: StockKind, dir: 'in' | 'out', recentOnly = false) =>
    moves.filter(m => m.kind === kind && m.dir === dir && (!recentOnly || now - ts(m.at) <= 30 * DAY_MS)).reduce((s, m) => s + m.qty, 0)

  const byKind = {} as Record<StockKind, KindStock>
  for (const k of ['seed', 'cans', 'waste'] as StockKind[]) {
    const l = latest[k]
    const win = moves.filter(m => m.kind === k && m.counted)
    const inn = win.filter(m => m.dir === 'in').reduce((s, m) => s + m.qty, 0)
    const outt = win.filter(m => m.dir === 'out').reduce((s, m) => s + m.qty, 0)
    const base = l ? l.qty : 0
    byKind[k] = { base: round(base), countedAt: l ? l.at : null, in: round(inn), out: round(outt), onHand: round(Math.max(0, base + inn - outt)) }
  }

  // Quantity-weighted purchase price across all priced arrivals.
  let priced = 0, pricedKg = 0
  for (const c of captures) {
    if (c.type === 'intake_arrival' && isSeed(c) && c.param_label === 'intake_price_per_kg' && n(c.param_value) > 0) {
      priced += n(c.param_value) * n(c.quantity)
      pricedKg += n(c.quantity)
    }
  }
  const seedCostPerKg = pricedKg > 0 ? priced / pricedKg : DEFAULT_SEED_COST_PER_KG

  // Latest priced delivery vs what the machine has been fed since — a quick
  // sanity check on the balance when old stock is known to be used up.
  const arrivals = moves.filter(m => m.kind === 'seed' && m.type === 'intake_arrival' && m.dir === 'in')
  let lastArrival: FactoryStock['lastArrival'] = null
  if (arrivals.length) {
    const a = arrivals[0]
    const after = moves.filter(m => m.kind === 'seed' && m.dir === 'out' && ts(m.at) > ts(a.at)).reduce((s, m) => s + m.qty, 0)
    lastArrival = { at: a.at, qty: a.qty, fedSince: round(after), expected: round(a.qty - after) }
  }

  const movements = {
    seed: moves.filter(m => m.kind === 'seed').slice(0, 40),
    cans: moves.filter(m => m.kind === 'cans').slice(0, 40),
    waste: moves.filter(m => m.kind === 'waste').slice(0, 40),
  }

  return {
    seedArrived: round(sumDir('seed', 'in')),
    seedFed: round(sumAll('seed', 'intake_feed', 'out') + sumAll('seed', 'intake', 'out')),
    seedWasted: round(sumAll('seed', 'wastage', 'out')),
    seedKg: byKind.seed.onHand,
    seedCostPerKg: round(seedCostPerKg),
    cansProduced: sumDir('cans', 'in'),
    cansDispatched: sumDir('cans', 'out'),
    cans: byKind.cans.onHand,
    wasteProduced: round(sumDir('waste', 'in')),
    wasteDispatched: round(sumAll('waste', 'dispatch', 'out')),
    wasteFedBack: round(sumAll('waste', 'intake_feed', 'out') + sumAll('waste', 'intake', 'out')),
    wasteKg: byKind.waste.onHand,
    seedFedLast30: round(sumAll('seed', 'intake_feed', 'out', true) + sumAll('seed', 'intake', 'out', true)),
    cansDispatchedLast30: sumDir('cans', 'out', true),
    wasteDispatchedLast30: round(sumAll('waste', 'dispatch', 'out', true)),
    byKind, lastArrival, movements,
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Generic (non-sesame) factories — e.g. coconut. Stock per product name, no
// sesame-specific naming. Direction by capture type:
//   intake_arrival / intake → in      intake_feed → out
//   output / packaging      → in      dispatch    → out
//   wastage → in when the product is itself a by-product (name has waste/
//   husk/shell), otherwise out (shrinkage of that product).
// ─────────────────────────────────────────────────────────────────────────
export interface GenericStockRow { name: string; unit?: string | null; onHand: number; in: number; out: number; lastDispatchPrice: number }

const isByproductName = (p: string) => /waste|husk|shell/.test(p)

export function computeGenericStock(captures: (StockCapture & { dispatch_price?: number | string | null; unit?: string | null })[]): GenericStockRow[] {
  const round = (v: number) => Math.round(v * 100) / 100
  const acc = new Map<string, GenericStockRow & { priceAt: number }>()
  for (const c of captures) {
    const raw = (c.product_name || '').trim()
    const qty = n(c.quantity)
    if (!raw || !c.type || qty <= 0) continue
    const key = raw.toLowerCase()
    let dir: 'in' | 'out' | null = null
    if (c.type === 'intake_arrival' || c.type === 'intake' || c.type === 'output' || c.type === 'packaging') dir = 'in'
    else if (c.type === 'intake_feed' || c.type === 'dispatch') dir = 'out'
    else if (c.type === 'wastage') dir = isByproductName(key) ? 'in' : 'out'
    if (!dir) continue
    const row = acc.get(key) || { name: raw, unit: c.unit ?? null, onHand: 0, in: 0, out: 0, lastDispatchPrice: 0, priceAt: 0 }
    if (dir === 'in') row.in += qty; else row.out += qty
    if (c.type === 'dispatch' && n(c.dispatch_price) > 0 && ts(c.created_at) >= row.priceAt) { row.lastDispatchPrice = n(c.dispatch_price); row.priceAt = ts(c.created_at) }
    acc.set(key, row)
  }
  return [...acc.values()].map(r => ({ name: r.name, unit: r.unit, in: round(r.in), out: round(r.out), onHand: round(Math.max(0, r.in - r.out)), lastDispatchPrice: r.lastDispatchPrice }))
}
