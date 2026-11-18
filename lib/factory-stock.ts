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

import { PACKAGED_NAME } from './factory-costing-profiles'

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
// 'jerrycan' alone also matches another crop's cans ("Coconut oil - Jerrycan (20L)") — those are not sesame stock.
const OTHER_CROP = /coconut|copra|groundnut|peanut|sunflower|palm|shea|soy/
export const isCan = (c: { product_name?: string | null }) => { const p = name(c); return (p.includes('jerrycan') || p.includes('mtungi')) && !OTHER_CROP.test(p) }
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
// Generic (non-sesame) factories — e.g. coconut. Stock per product, by a
// canonical product name so one product logged under two names is ONE ledger
// ("Copra" and "Coconut copra"). Direction by capture type:
//   intake_arrival / intake → in      intake_feed → out
//   output / packaging      → in      dispatch    → out
//   wastage → in when the product is itself a by-product (waste/husk/shell/
//   cake…), otherwise out (loss of that product).
// Packs: a packaging capture (or a priced dispatch) logged against the BULK oil
// ("Coconut oil") is a count of jerrycans, so it moves the jerrycan row — not a
// separate kg row that no screen shows.
// ─────────────────────────────────────────────────────────────────────────
export interface GenericStockParts { received: number; produced: number; byproductMade: number; fed: number; wasted: number; dispatched: number; /** Whole nuts dried into copra since the last count (nuts per kg of copra × own-dried copra kg). */ dried?: number }
export interface GenericStockRow {
  name: string; unit?: string | null; onHand: number; in: number; out: number; lastDispatchPrice: number
  /** How the balance is built: received + produced (+ by-product made) − fed − lost − dispatched. */
  parts: GenericStockParts
  /** Logged usage beyond what was logged coming in (a delivery or production entry is missing). 0 when the ledger is consistent. */
  shortfall: number
  counted?: { qty: number; at: string } | null
  /** Whole coconut only: nuts needed per kg of copra, worked out from the owner's counts. */
  nutsPerKgCopra?: number | null
  /** Stable key for matching costs and counts to this row. */
  key: string
}

const BYPRODUCT_NAME = /waste|husk|shell|cake|fibre|fiber|kernel|chaff|bran/

/** One key per real product: lower-case, single spaces, and "<crop> copra" is just "copra". */
export function canonProductKey(raw?: string | null): string {
  let k = (raw || '').toLowerCase().replace(/\s+/g, ' ').trim()
  k = k.replace(/^(dry |dried |coconut |fresh )?copra$/, 'copra')
  return k
}

/**
 * A starting guess for what a kg of an UNPRICED raw material costs, so stock is never valued at another
 * product's price (whole coconut at the copra price was the case that mattered). Only where it is known:
 * Kenyan whole coconut ≈ KSh 23/kg. The approver can always enter the real price on the delivery.
 */
export function guessRawPricePerKg(name?: string | null, currencyOrSymbol?: string | null): number {
  const n = (name || '').toLowerCase()
  const cur = (currencyOrSymbol || '').toUpperCase()
  const isKes = cur === 'KES' || cur.startsWith('KSH')
  if (isKes && /coconut|nut/.test(n) && !/copra|oil|cake|waste|husk|shell/.test(n)) return 23
  return 0
}

type GenericCapture = StockCapture & { dispatch_price?: number | string | null; unit?: string | null }

const isPackName = (nm: string) => PACKAGED_NAME.test(nm)
const isByName = (key: string) => BYPRODUCT_NAME.test(key)
const isBulkOilName = (nm: string) => /\boil\b/i.test(nm) && !isPackName(nm) && !isByName(canonProductKey(nm))

/**
 * Packs logged against the BULK oil ("Coconut oil") are jerrycans: a packaging capture always, and a dispatch when
 * it is priced like a pack. Returns the captures with those product names replaced by the factory's pack name
 * ("Coconut oil - Jerrycan (20L)"), so every screen, the stock ledger and the CFO count the same jerrycans.
 */
export function foldPackCaptures<T extends GenericCapture>(captures: T[]): T[] {
  const packNames = new Map<string, number>()
  const packPrices: number[] = []
  for (const c of captures) {
    const nm = (c.product_name || '').trim()
    if (!nm || !isPackName(nm) || isByName(canonProductKey(nm))) continue
    packNames.set(nm, (packNames.get(nm) || 0) + 1)
    if (c.type === 'dispatch' && n(c.dispatch_price) > 0) packPrices.push(n(c.dispatch_price))
  }
  if (packNames.size === 0) return captures
  packPrices.sort((x, y) => x - y)
  const median = packPrices.length ? packPrices[Math.floor(packPrices.length / 2)] : 0
  const packFor = (bulk: string): string | null => {
    const b = bulk.toLowerCase().trim()
    let best: string | null = null, bestN = 0
    for (const [nm, cnt] of packNames) if (nm.toLowerCase().startsWith(b) && cnt > bestN) { best = nm; bestN = cnt }
    return best
  }
  return captures.map(c => {
    const raw = (c.product_name || '').trim()
    if (!raw || !isBulkOilName(raw)) return c
    const pack = packFor(raw)
    if (!pack) return c
    if (c.type === 'packaging') return { ...c, product_name: pack }
    if (c.type === 'dispatch' && median > 0 && n(c.dispatch_price) >= median * 0.5 && n(c.dispatch_price) <= median * 2) return { ...c, product_name: pack }
    return c
  })
}

// ─────────────────────────────────────────────────────────────────────────
// Coconut chain: whole nuts (counted in pieces) → dried into copra → fed to the press.
// The owner dries the nuts and feeds the copra straight to the machine, so nothing logs how many nuts a kg of copra
// took. It is WORKED OUT instead, from physical counts of the nuts:
//
//   nuts used in a window = count at the start + nuts delivered − nuts logged as fed/lost − count at the end
//   nuts per kg of copra  = nuts used ÷ own-dried copra in that window
//
// "Own-dried copra" = copra that came into stock WITHOUT a purchase price (an unpriced copra arrival, or copra logged
// as output); copra bought at a price is not made from the owner's nuts. With the ratio known, every kg of own-dried
// copra takes that many nuts off the nut stock, and costs that many nuts × the nut price.
// ─────────────────────────────────────────────────────────────────────────
const NUT_EXCLUDE = /copra|oil|cake|waste|husk|shell|groundnut|peanut|palm/
export const isWholeNutName = (nm?: string | null) => { const l = (nm || '').toLowerCase(); return /coconut|\bnuts?\b/.test(l) && !NUT_EXCLUDE.test(l) }

export interface CoconutChain {
  nutKey: string
  ratio: number | null            // nuts per kg of own-dried copra; null until a count lets it be worked out
  ownCopraKgTotal: number         // own-dried copra, all time
  ownCopraKgSinceCount: number    // …since the latest nut count (all of it when never counted)
  boughtCopraKg: number
  boughtCopraCost: number         // total paid for bought copra
}

export function coconutChain(captures: GenericCapture[], counts: StockCount[] = []): CoconutChain | null {
  const nutKey = (() => { for (const c of captures) if (c.type === 'intake_arrival' && isWholeNutName(c.product_name)) return canonProductKey(c.product_name); return null })()
  if (!nutKey) return null
  if (!captures.some(c => canonProductKey(c.product_name) === 'copra')) return null
  const isOwnCopra = (c: GenericCapture) => canonProductKey(c.product_name) === 'copra' && n(c.quantity) > 0 &&
    ((c.type === 'intake_arrival' && !(c.param_label === 'intake_price_per_kg' && n(c.param_value) > 0)) || c.type === 'output')
  let boughtKg = 0, boughtCost = 0, ownTotal = 0
  for (const c of captures) {
    if (isOwnCopra(c)) ownTotal += n(c.quantity)
    else if (canonProductKey(c.product_name) === 'copra' && c.type === 'intake_arrival' && c.param_label === 'intake_price_per_kg' && n(c.param_value) > 0) { boughtKg += n(c.quantity); boughtCost += n(c.quantity) * n(c.param_value) }
  }
  const nutCounts = counts.filter(c => canonProductKey(c.product_name) === nutKey && c.created_at)
    .map(c => ({ qty: Math.max(0, n(c.counted_qty)), at: ts(c.created_at) })).sort((a, b) => a.at - b.at)
  const inWin = (c: GenericCapture, from: number, to: number) => { const t = ts(c.created_at); return t > from && t <= to }
  let usedSum = 0, ownSum = 0
  let prevQty = 0, prevAt = -Infinity
  for (const cnt of nutCounts) {
    let arrivals = 0, logged = 0, own = 0
    for (const c of captures) {
      if (!inWin(c, prevAt, cnt.at)) continue
      const q = n(c.quantity); if (q <= 0) continue
      if (canonProductKey(c.product_name) === nutKey) {
        if (c.type === 'intake_arrival' || c.type === 'intake') arrivals += q
        else if (c.type === 'intake_feed' || c.type === 'wastage') logged += q
      }
      if (isOwnCopra(c)) own += q
    }
    const used = prevQty + arrivals - logged - cnt.qty
    if (own > 0 && used > 0) { usedSum += used; ownSum += own }
    prevQty = cnt.qty; prevAt = cnt.at
  }
  const raw = ownSum > 0 ? usedSum / ownSum : null
  const ratio = raw !== null && raw >= 1 && raw <= 20 ? Math.round(raw * 100) / 100 : null
  const lastAt = nutCounts.length ? nutCounts[nutCounts.length - 1].at : -Infinity
  const sinceKg = captures.filter(c => isOwnCopra(c) && ts(c.created_at) > lastAt).reduce((t, c) => t + n(c.quantity), 0)
  return { nutKey, ratio, ownCopraKgTotal: ownTotal, ownCopraKgSinceCount: sinceKg, boughtCopraKg: boughtKg, boughtCopraCost: boughtCost }
}

/** Cost per kg of copra pooled from what was bought (its price) and what was dried from nuts (nuts per kg × nut price). */
export function copraCostPerKg(chain: CoconutChain | null, nutPrice: number): number | null {
  if (!chain || !(nutPrice > 0)) return null
  const ownCost = chain.ratio ? chain.ratio * nutPrice * chain.ownCopraKgTotal : 0
  const kg = chain.boughtCopraKg + (chain.ratio ? chain.ownCopraKgTotal : 0)
  return kg > 0 ? (chain.boughtCopraCost + ownCost) / kg : null
}


export function computeGenericStock(rawCaptures: GenericCapture[], counts: StockCount[] = []): GenericStockRow[] {
  const round = (v: number) => Math.round(v * 100) / 100
  const isBy = isByName
  const captures = foldPackCaptures(rawCaptures)
  const chain = coconutChain(captures, counts)

  // Latest physical count per product (re-anchors that product's balance).
  const latestCount = new Map<string, { qty: number; at: string }>()
  for (const c of [...counts].sort((a, b) => ts(b.created_at) - ts(a.created_at))) {
    const k = canonProductKey(c.product_name)
    if (k && !latestCount.has(k) && c.created_at) latestCount.set(k, { qty: Math.max(0, n(c.counted_qty)), at: c.created_at })
  }

  type Acc = GenericStockRow & { priceAt: number; nameVotes: Map<string, number> }
  const acc = new Map<string, Acc>()
  for (const c of captures) {
    const raw = (c.product_name || '').trim()
    const qty = n(c.quantity)
    if (!raw || !c.type || qty <= 0) continue
    const key = canonProductKey(raw)
    let part: keyof GenericStockParts | null = null
    if (c.type === 'intake_arrival' || c.type === 'intake') part = 'received'
    else if (c.type === 'output' || c.type === 'packaging') part = 'produced'
    else if (c.type === 'intake_feed') part = 'fed'
    else if (c.type === 'dispatch') part = 'dispatched'
    else if (c.type === 'wastage') part = isBy(key) ? 'byproductMade' : 'wasted'
    if (!part) continue
    const cnt = latestCount.get(key)
    const row = acc.get(key) || { key, name: raw, unit: c.unit ?? null, onHand: 0, in: 0, out: 0, lastDispatchPrice: 0, priceAt: 0, nameVotes: new Map(),
      parts: { received: 0, produced: 0, byproductMade: 0, fed: 0, wasted: 0, dispatched: 0 }, shortfall: 0, counted: cnt ? { qty: round(cnt.qty), at: cnt.at } : null } as Acc
    row.nameVotes.set(raw, (row.nameVotes.get(raw) || 0) + 1)
    // Movements before the latest physical count are already inside the counted figure.
    if (!cnt || ts(c.created_at) > ts(cnt.at)) row.parts[part] += qty
    if (c.type === 'dispatch' && n(c.dispatch_price) > 0 && ts(c.created_at) >= row.priceAt) { row.lastDispatchPrice = n(c.dispatch_price); row.priceAt = ts(c.created_at) }
    acc.set(key, row)
  }
  // A count for a product with no captures after it still has a balance.
  for (const [key, cnt] of latestCount) if (!acc.has(key) && [...captures].some(c => canonProductKey(c.product_name) === key)) {
    acc.set(key, { key, name: key, unit: null, onHand: 0, in: 0, out: 0, lastDispatchPrice: 0, priceAt: 0, nameVotes: new Map(),
      parts: { received: 0, produced: 0, byproductMade: 0, fed: 0, wasted: 0, dispatched: 0 }, shortfall: 0, counted: { qty: round(cnt.qty), at: cnt.at } })
  }
  return [...acc.values()].map(r => {
    const p = r.parts
    const base = r.counted ? r.counted.qty : 0
    const inn = p.received + p.produced + p.byproductMade
    // Nuts dried into copra since the last count (the ratio is worked out from the owner's own counts).
    const dried = chain && chain.ratio && r.key === chain.nutKey ? Math.round(chain.ratio * chain.ownCopraKgSinceCount * 100) / 100 : 0
    const out = p.fed + p.wasted + p.dispatched + dried
    const name = [...r.nameVotes.entries()].sort((a, b) => b[1] - a[1] || a[0].length - b[0].length)[0]?.[0] || r.name
    return {
      key: r.key, name, unit: r.unit, counted: r.counted, lastDispatchPrice: r.lastDispatchPrice,
      parts: { received: round(p.received), produced: round(p.produced), byproductMade: round(p.byproductMade), fed: round(p.fed), wasted: round(p.wasted), dispatched: round(p.dispatched), ...(dried > 0 ? { dried } : {}) },
      ...(chain && r.key === chain.nutKey ? { unit: 'pcs', nutsPerKgCopra: chain.ratio } : {}),
      in: round(inn), out: round(out), onHand: round(Math.max(0, base + inn - out)), shortfall: round(Math.max(0, out - (base + inn))),
    }
  })
}
