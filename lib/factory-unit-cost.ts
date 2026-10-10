/**
 * Cost of one finished unit (e.g. a 20L jerrycan) over a COST CYCLE.
 *
 * One calculation for every screen — Factory Inventory, stock counts, the
 * inventory rows synced from captures, and the Costing tab — so they cannot
 * disagree. The numbers come from what the factory logged plus the rates its
 * owner saved for THAT factory; nothing here is a fixed per-product price.
 *
 *   material  = raw material fed to the press in the cycle × its purchase price per kg
 *   less cake = by-product (cake/husk/shell) made in the cycle × the price it really sold at
 *   labour / electricity / overhead = the factory's own daily rates × days in the cycle
 *   unit cost = (material − cake + labour + electricity + overhead) ÷ finished units made in the cycle
 *
 * The cycle is the last 28 days by default; the owner can change the number of
 * days or give an exact date range (saved in pos_factory_cost_settings.electricity_basis.cycle).
 * Days before the factory's first production are not charged, so a factory that
 * started last week is not billed 28 days of wages.
 *
 * NOTE: identical copy lives in pos-askbiz/lib/factory-unit-cost.ts — the two
 * apps are deployed separately. Change both together.
 */
import { getCostingProfile, isPackagedName, isByproductName, isRawIntakeName } from '@/lib/factory-costing-profiles'
import { factoryCostDefaultsFor } from '@/lib/factory-cost-defaults'

export const DEFAULT_CYCLE_DAYS = 28
export const MAX_CYCLE_DAYS = 366

export type FactoryCycle =
  | { mode: 'days'; days: number }
  | { mode: 'range'; from: string; to: string }

export interface UnitCostCapture {
  type?: string | null
  product_name?: string | null
  quantity?: number | string | null
  param_label?: string | null
  param_value?: number | string | null
  dispatch_price?: number | string | null
  created_at?: string | null
}

export interface UnitCostSettings {
  configured: boolean
  staffPerDay: number
  electricityPerDay: number
  overhead: number // per MONTH
}

export interface CycleUnitCost {
  factoryType: string | null // the type the costing used (saved type, else inferred from what was logged)
  from: string
  to: string
  cycleDays: number        // days in the chosen cycle
  chargedDays: number      // days actually charged (cycle clipped to the factory's first production)
  basis: 'cycle' | 'all_time' // 'all_time' = nothing was produced in the cycle, so the whole history is used
  rawKgFed: number
  rawCostPerKg: number
  material: number
  cakeKg: number
  cakePricePerKg: number
  cakeCredit: number
  labour: number
  electricity: number
  overhead: number
  pool: number
  unitsProduced: number
  unitCost: number
  /** Cost per unit WITHOUT the cake credit — what the CFO uses, because cake sales are already counted as revenue there. */
  unitCostBeforeCake: number
  sources: { labour: 'estimate' | 'actual' | 'mixed'; electricity: 'estimate' | 'actual' | 'mixed'; overhead: 'estimate' | 'actual' | 'mixed' }
  wasteCostPerKg: number   // what a kg of by-product is worth (its real sale price; 0 if it never sold)
  complete: boolean
  missing: string[]
}

const num = (v: unknown) => Number(v) || 0
const NAIROBI_MS = 3 * 3_600_000
export const nairobiDayOf = (ms: number) => new Date(ms + NAIROBI_MS).toISOString().slice(0, 10)
const dayDiff = (a: string, b: string) => Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / 86_400_000)
const shiftDay = (day: string, delta: number) => new Date(Date.parse(day + 'T00:00:00Z') + delta * 86_400_000).toISOString().slice(0, 10)
const isDay = (s: unknown): s is string => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s + 'T00:00:00Z'))

/** Reads the saved cycle out of electricity_basis; anything missing or invalid = the 28-day default. */
export function parseCycle(basis: unknown): FactoryCycle {
  const c = (basis && typeof basis === 'object' ? (basis as any).cycle : null) as any
  if (c && c.mode === 'range' && isDay(c.from) && isDay(c.to) && c.from <= c.to && dayDiff(c.from, c.to) < MAX_CYCLE_DAYS) {
    return { mode: 'range', from: c.from, to: c.to }
  }
  const d = Math.floor(Number(c?.days))
  if (c && c.mode === 'days' && Number.isFinite(d) && d >= 1 && d <= MAX_CYCLE_DAYS) return { mode: 'days', days: d }
  return { mode: 'days', days: DEFAULT_CYCLE_DAYS }
}

/** The calendar window (Nairobi days, inclusive) a cycle covers. */
export function cycleWindow(cycle: FactoryCycle, now: number = Date.now()): { from: string; to: string; days: number } {
  if (cycle.mode === 'range') return { from: cycle.from, to: cycle.to, days: dayDiff(cycle.from, cycle.to) + 1 }
  const to = nairobiDayOf(now)
  return { from: shiftDay(to, -(cycle.days - 1)), to, days: cycle.days }
}

const PRODUCTION_TYPES = new Set(['intake_feed', 'intake', 'output', 'packaging', 'wastage'])

// An account with no factory type on record is typed from what it has actually logged
// (sesame, coconut/copra, groundnut, sunflower, palm); with no such clue it gets the generic profile.
const TYPE_CLUES: [RegExp, string][] = [
  [/sesame/i, 'sesame_oil'], [/coconut|copra/i, 'coconut_oil'], [/groundnut|peanut/i, 'groundnut_oil'],
  [/sunflower/i, 'sunflower_oil'], [/palm/i, 'palm_oil'],
]
function effectiveType(factoryType: string | null | undefined, captures: UnitCostCapture[]): string | null {
  if (factoryType && factoryType !== 'other') return factoryType
  for (const [re, t] of TYPE_CLUES) if (captures.some(c => re.test(c.product_name || ''))) return t
  return factoryType || null
}

/** Money actually spent (expenses tagged to this factory), by month 'YYYY-MM'. A month with an actual amount
 *  replaces the per-day estimate for that category, pro-rated to the cycle's days in that month. */
export interface UnitCostActuals {
  labour?: Record<string, number>
  electricity?: Record<string, number>
  overhead?: Record<string, number>
}

const daysInMonthOf = (ym: string) => { const [y, m] = ym.split('-').map(Number); return new Date(Date.UTC(y, m, 0)).getUTCDate() }

export function computeCycleUnitCost(
  captures: UnitCostCapture[],
  settings: UnitCostSettings,
  cycle: FactoryCycle,
  factoryType: string | null | undefined,
  now: number = Date.now(),
  actuals?: UnitCostActuals,
): CycleUnitCost {
  const type = effectiveType(factoryType, captures)
  const P = getCostingProfile(type)
  const dayOfCap = (c: UnitCostCapture) => (c.created_at ? nairobiDayOf(new Date(c.created_at).getTime()) : '')
  const name = (c: UnitCostCapture) => (c.product_name || '').trim()
  const isRaw = (c: UnitCostCapture) => isRawIntakeName(P, name(c))
  const isBy = (c: UnitCostCapture) => isByproductName(P, name(c))
  const isUnit = (c: UnitCostCapture) => (isPackagedName(P, name(c)) && !isBy(c)) || (c.type === 'packaging' && !isBy(c))

  // Purchase price per kg of each raw product (quantity-weighted over ALL history) and overall.
  const byName = new Map<string, { cost: number; kg: number }>()
  let allCost = 0, allKg = 0
  for (const c of captures) {
    if (c.type === 'intake_arrival' && c.param_label === 'intake_price_per_kg' && num(c.param_value) > 0 && num(c.quantity) > 0 && isRaw(c)) {
      const k = name(c).toLowerCase()
      const e = byName.get(k) || { cost: 0, kg: 0 }
      e.cost += num(c.param_value) * num(c.quantity); e.kg += num(c.quantity)
      byName.set(k, e)
      allCost += num(c.param_value) * num(c.quantity); allKg += num(c.quantity)
    }
  }
  const overallPrice = allKg > 0 ? allCost / allKg : 0
  const priceOf = (c: UnitCostCapture) => { const e = byName.get(name(c).toLowerCase()); return e && e.kg > 0 ? e.cost / e.kg : overallPrice }

  // What by-product really sells for (all history). Sesame keeps its long-standing KSh 30/kg
  // fallback; any other factory gets no guessed price — 0 until it actually sells some.
  let byRev = 0, byQty = 0
  for (const c of captures) {
    if (c.type === 'dispatch' && isBy(c) && num(c.dispatch_price) > 0 && num(c.quantity) > 0) { byRev += num(c.quantity) * num(c.dispatch_price); byQty += num(c.quantity) }
  }
  const cakePrice = byQty > 0 ? byRev / byQty : (type === 'sesame_oil' ? 30 : 0)

  // The factory's first day of production: days before it are never charged.
  let firstProd = ''
  for (const c of captures) {
    if (c.type && PRODUCTION_TYPES.has(c.type)) {
      const d = dayOfCap(c)
      if (d && (!firstProd || d < firstProd)) firstProd = d
    }
  }

  const firstFeed = captures
    .filter(c => c.type === 'intake_feed' && c.created_at)
    .reduce((m, c) => Math.min(m, new Date(c.created_at!).getTime()), Infinity)

  const build = (from: string, to: string, cycleDays: number, basis: CycleUnitCost['basis']): CycleUnitCost => {
    let fedKg = 0, material = 0, canPackOut = 0, canDispatched = 0, cakeKg = 0
    for (const c of captures) {
      const d = dayOfCap(c)
      if (!d || d < from || d > to) continue
      const q = num(c.quantity)
      if (q <= 0) continue
      const legacyFeed = c.type === 'intake' && !!c.created_at && new Date(c.created_at).getTime() >= firstFeed
      if ((c.type === 'intake_feed' || legacyFeed) && isRaw(c)) { fedKg += q; material += q * priceOf(c) }
      if (isUnit(c)) {
        if (c.type === 'packaging' || c.type === 'output') canPackOut += q
        else if (c.type === 'dispatch') canDispatched += q
      }
      if ((c.type === 'wastage' || c.type === 'output') && isBy(c)) cakeKg += q
    }
    const units = canPackOut > 0 ? canPackOut : canDispatched
    const start = firstProd && firstProd > from ? firstProd : from
    const charged = units > 0 || fedKg > 0 ? Math.max(1, dayDiff(start, to) + 1) : 0
    // Per category: months with real tagged spend use it (pro-rated to the charged days in that month);
    // every other month uses the factory's saved per-day estimate.
    const blend = (perDay: number, actual?: Record<string, number>): { total: number; source: 'estimate' | 'actual' | 'mixed' } => {
      if (charged === 0) return { total: 0, source: 'estimate' }
      const perMonth = new Map<string, number>()
      for (let i = 0; i < charged; i++) { const ym = shiftDay(to, -i).slice(0, 7); perMonth.set(ym, (perMonth.get(ym) || 0) + 1) }
      let total = 0, withActual = 0
      for (const [ym, days] of perMonth) {
        const a = actual?.[ym] || 0
        if (a > 0) { total += a * (days / daysInMonthOf(ym)); withActual++ } else total += days * perDay
      }
      return { total, source: withActual === 0 ? 'estimate' : withActual === perMonth.size ? 'actual' : 'mixed' }
    }
    const lB = blend(settings.staffPerDay, actuals?.labour)
    const eB = blend(settings.electricityPerDay, actuals?.electricity)
    const oB = blend(settings.overhead / 26, actuals?.overhead)
    const labour = lB.total
    const electricity = eB.total
    const overhead = oB.total
    const cakeCredit = Math.min(material, cakeKg * cakePrice)
    const pool = Math.max(0, material - cakeCredit) + labour + electricity + overhead
    const poolBeforeCake = material + labour + electricity + overhead
    const missing: string[] = []
    if (!(overallPrice > 0)) missing.push('raw_material_price')
    if (!(units > 0)) missing.push('finished_goods_output')
    if (!settings.configured && !(lB.source === 'actual' && eB.source === 'actual')) missing.push('labour_electricity_rates')
    return {
      factoryType: type, from, to, cycleDays, chargedDays: charged, basis,
      rawKgFed: Math.round(fedKg * 100) / 100, rawCostPerKg: Math.round(overallPrice * 100) / 100,
      material: Math.round(material), cakeKg: Math.round(cakeKg * 100) / 100, cakePricePerKg: Math.round(cakePrice * 100) / 100,
      cakeCredit: Math.round(cakeCredit), labour: Math.round(labour), electricity: Math.round(electricity), overhead: Math.round(overhead),
      pool: Math.round(pool), unitsProduced: units, unitCost: units > 0 ? Math.round(pool / units) : 0,
      unitCostBeforeCake: units > 0 ? Math.round(poolBeforeCake / units) : 0,
      sources: { labour: lB.source, electricity: eB.source, overhead: oB.source },
      wasteCostPerKg: Math.round(cakePrice * 100) / 100,
      complete: missing.length === 0, missing,
    }
  }

  const w = cycleWindow(cycle, now)
  const inCycle = build(w.from, w.to, w.days, 'cycle')
  if (inCycle.unitsProduced > 0 || !firstProd) return inCycle
  // Nothing was finished in this cycle (a quiet month): value stock on the whole history instead of showing 0.
  const today = nairobiDayOf(now)
  const all = build(firstProd, today, dayDiff(firstProd, today) + 1, 'all_time')
  return all.unitsProduced > 0 ? all : inCycle
}

/** What a stocked product is to this factory: raw material, finished unit, by-product, bulk intermediate (pressed oil before packing) or other. */
export type StockRole = 'raw' | 'finished' | 'byproduct' | 'bulk' | 'other'
export function stockRoleOf(factoryType: string | null | undefined, productName: string | null | undefined): StockRole {
  const P = getCostingProfile(factoryType)
  const n = productName || ''
  if (isByproductName(P, n)) return 'byproduct'
  if (P.kind !== 'count' && isPackagedName(P, n)) return 'finished'
  if (P.kind === 'count') return 'finished'
  if (isRawIntakeName(P, n)) return 'raw'
  if (P.product && P.product.test(n)) return 'bulk'
  return 'other'
}

// ── Server side: load a factory's captures, saved rates and cycle, and cost it ─────────────

async function fetchAllCaptures(service: any, ownerId: string, locationId: string | null): Promise<UnitCostCapture[]> {
  const out: UnitCostCapture[] = []
  for (let from = 0; from < 50_000; from += 1000) {
    let q = service.from('pos_factory_captures')
      .select('type, product_name, quantity, param_label, param_value, dispatch_price, created_at')
      .eq('owner_id', ownerId).eq('status', 'approved')
    if (locationId) q = q.eq('location_id', locationId)
    const { data, error } = await q.order('created_at', { ascending: true }).range(from, from + 999)
    if (error || !data) break
    out.push(...(data as UnitCostCapture[]))
    if (data.length < 1000) break
  }
  return out
}

async function ownerCountry(service: any, ownerId: string): Promise<{ country: string | null; profileType: string | null }> {
  const { data } = await service.from('profiles').select('country_code, currency, factory_type').eq('id', ownerId).maybeSingle()
  const currency = (data as any)?.currency || null
  return { country: (data as any)?.country_code || (currency === 'KES' ? 'KE' : null), profileType: (data as any)?.factory_type || null }
}

/**
 * Unit cost for one factory (locationId) or, with no location, for the owner's factories combined
 * (a single factory = that factory; several = total pool ÷ total units). null if there is nothing to cost.
 */
export async function loadCycleUnitCost(service: any, ownerId: string, locationId: string | null, now: number = Date.now()): Promise<CycleUnitCost | null> {
  try {
    const { country, profileType } = await ownerCountry(service, ownerId)
    let factories: { id: string | null; type: string | null }[] = []
    if (locationId) {
      const { data } = await service.from('pos_locations').select('id, kind, factory_type').eq('id', locationId).eq('owner_id', ownerId).maybeSingle()
      if (data && data.kind === 'factory') factories = [{ id: data.id, type: data.factory_type || null }]
    } else {
      const { data } = await service.from('pos_locations').select('id, kind, factory_type').eq('owner_id', ownerId).eq('kind', 'factory')
      factories = ((data || []) as any[]).map(l => ({ id: l.id as string, type: (l.factory_type as string) || null }))
    }
    if (factories.length === 0) factories = [{ id: null, type: null }] // legacy account with no factory branch rows
    const results: CycleUnitCost[] = []
    for (const f of factories) {
      const type = f.type && f.type !== 'other' ? f.type : (profileType && profileType !== 'other' ? profileType : null)
      const caps = await fetchAllCaptures(service, ownerId, f.id)
      if (caps.length === 0) continue
      let settings: UnitCostSettings = factoryCostDefaultsFor(country, type)
      let basis: unknown = null
      if (f.id) {
        const { data: row } = await service.from('pos_factory_cost_settings').select('staff_per_day, electricity_per_day, overhead, electricity_basis').eq('location_id', f.id).maybeSingle()
        if (row) {
          settings = { configured: true, staffPerDay: num(row.staff_per_day), electricityPerDay: num(row.electricity_per_day), overhead: num(row.overhead) }
          basis = row.electricity_basis
        }
      }
      results.push(computeCycleUnitCost(caps, settings, parseCycle(basis), type, now))
    }
    if (results.length === 0) return null
    if (results.length === 1) return results[0]
    const sum = (k: 'material' | 'cakeCredit' | 'labour' | 'electricity' | 'overhead' | 'pool' | 'unitsProduced' | 'rawKgFed') => results.reduce((s, r) => s + r[k], 0)
    const units = sum('unitsProduced')
    const first = results[0]
    return {
      ...first, material: sum('material'), cakeCredit: sum('cakeCredit'), labour: sum('labour'), electricity: sum('electricity'),
      overhead: sum('overhead'), pool: sum('pool'), unitsProduced: units, rawKgFed: sum('rawKgFed'),
      unitCost: units > 0 ? Math.round(sum('pool') / units) : 0,
      unitCostBeforeCake: units > 0 ? Math.round((sum('pool') + sum('cakeCredit')) / units) : 0,
      complete: results.every(r => r.complete), missing: Array.from(new Set(results.flatMap(r => r.missing))),
    }
  } catch (e) {
    console.error('loadCycleUnitCost failed:', e)
    return null
  }
}
