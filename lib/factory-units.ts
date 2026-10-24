/**
 * Units on factory captures.
 *
 * A capture stores its unit as free text in `batch_ref` ("kg", "litres", "pcs", "200g"…), but every stock, yield
 * and cost figure used to add `quantity` up as if it were kg. A press that logged one batch of oil in litres and
 * the next in kg, or a coconut intake counted in pieces beside one weighed in kg, silently produced wrong totals.
 *
 * normalizeCaptureUnits() is the one place that fixes this, run right after captures are loaded:
 *   - weight units (g, tonnes…) become kg exactly;
 *   - litres of an oil become kg (the app-wide 1 kg ≈ 1.09 L) so oil yield compares like with like;
 *   - a COUNT unit (pcs, bags, boxes…) on a raw-material / bulk-product flow of an oil or liquid factory cannot be
 *     turned into kg without knowing a weight, so it is left OUT of the kg totals and reported, never added blindly;
 *   - blank / "item" / unrecognised units are left exactly as recorded (older captures and the old default).
 * Dispatches and packaged units (jerrycans, bottles) are never touched.
 *
 * NOTE: identical copy lives in lib/factory-units.ts (root app) — the two apps deploy separately. Change both.
 */
import { getCostingProfile, isPackagedName } from './factory-costing-profiles'

export const LITRES_PER_KG_OIL = 1.09

const FLOW_TYPES = new Set(['intake_arrival', 'intake_feed', 'intake', 'output', 'wastage'])

const MASS_TO_KG: Record<string, number> = {
  kg: 1, kgs: 1, kilo: 1, kilos: 1, kilogram: 1, kilograms: 1,
  g: 0.001, gm: 0.001, gram: 0.001, grams: 0.001,
  t: 1000, ton: 1000, tons: 1000, tonne: 1000, tonnes: 1000, mt: 1000,
}
const VOLUME_TO_L: Record<string, number> = {
  l: 1, lt: 1, ltr: 1, ltrs: 1, litre: 1, litres: 1, liter: 1, liters: 1, ml: 0.001,
}
const COUNT_UNITS = new Set([
  'pcs', 'pc', 'piece', 'pieces', 'bag', 'bags', 'sack', 'sacks', 'box', 'boxes', 'pack', 'packs',
  'pallet', 'pallets', 'block', 'blocks', 'bunch', 'bunches', 'crate', 'crates', 'nut', 'nuts',
  'unit', 'units', 'no', 'nos',
])

export type UnitDim = 'mass' | 'volume' | 'count' | 'unspecified'

export function classifyUnit(raw: string | null | undefined): { dim: UnitDim; factor: number; unit: string } {
  const u = (raw || '').trim().toLowerCase().replace(/\.$/, '')
  if (u in MASS_TO_KG) return { dim: 'mass', factor: MASS_TO_KG[u], unit: u }
  if (u in VOLUME_TO_L) return { dim: 'volume', factor: VOLUME_TO_L[u], unit: u }
  if (COUNT_UNITS.has(u)) return { dim: 'count', factor: 1, unit: u }
  return { dim: 'unspecified', factor: 1, unit: u }
}

export interface UnitCapture {
  type?: string | null
  product_name?: string | null
  quantity?: number | string | null
  batch_ref?: string | null
  location_id?: string | null
}

export interface ExcludedUnits { product: string; unit: string; quantity: number; captures: number }

export interface NormalizedCaptures<T> {
  captures: T[]
  /** Raw-material / product captures counted in pieces (etc.) that could not be added to the kg totals. */
  excluded: ExcludedUnits[]
  /** How many captures were converted from another unit (g, tonnes, litres of oil). */
  converted: number
}

/** `factoryType` is one type for all captures, or a function giving each capture's own factory type. */
export function normalizeCaptureUnits<T extends UnitCapture>(
  caps: T[],
  factoryType: string | null | undefined | ((c: T) => string | null | undefined),
): NormalizedCaptures<T> {
  const out: T[] = []
  const excl = new Map<string, ExcludedUnits>()
  let converted = 0
  for (const c of caps) {
    if (!FLOW_TYPES.has(c.type || '')) { out.push(c); continue }
    const P = getCostingProfile(typeof factoryType === 'function' ? factoryType(c) : factoryType)
    // Finished packs (jerrycans, bottles) are counted in units by design.
    if (isPackagedName(P, c.product_name) && P.kind !== 'count') { out.push(c); continue }
    const { dim, factor, unit } = classifyUnit(c.batch_ref)
    const qty = Number(c.quantity) || 0
    if (dim === 'mass') {
      if (factor === 1) { out.push(c); continue }
      converted++
      out.push({ ...c, quantity: qty * factor, batch_ref: 'kg' })
    } else if (dim === 'volume' && P.kind === 'oil') {
      converted++
      out.push({ ...c, quantity: (qty * factor) / LITRES_PER_KG_OIL, batch_ref: 'kg' })
    } else if (dim === 'count' && P.kind !== 'count') {
      const key = `${(c.product_name || '').trim().toLowerCase()}|${unit}`
      const e = excl.get(key) || { product: (c.product_name || '').trim(), unit, quantity: 0, captures: 0 }
      e.quantity += qty; e.captures += 1
      excl.set(key, e)
    } else {
      out.push(c)
    }
  }
  return { captures: out, excluded: Array.from(excl.values()), converted }
}

/** Units a person may pick when logging this kind of capture, so new mixing cannot start at the till. */
export function allowedUnitsFor(factoryType: string | null | undefined, captureType: string): string[] | null {
  if (!FLOW_TYPES.has(captureType)) return null
  const P = getCostingProfile(factoryType)
  if (P.kind === 'count') return null
  if (captureType === 'output' && P.kind === 'oil') return ['kg', 'litres']
  if (captureType === 'output' && P.kind === 'liquid') return ['litres', 'kg']
  return ['kg', 'tonnes', 'g']
}
