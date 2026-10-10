/**
 * Per-factory-type costing profiles.
 *
 * The Costing tab and the CFO both need to know, for the factory in front of
 * them: what counts as raw material, what is the sellable unit, how pressed or
 * treated output converts into units, and which outputs are by-products that
 * earn a credit instead of a cost. That used to be hard-wired to sesame oil
 * and 20L jerrycans; it now comes from the factory's type, so a water bottler
 * or a sunflower-into-bottles factory only ever sees its own wording and maths.
 *
 * Unknown / 'other' types get the generic "per unit produced" profile — no
 * sesame wording, no machine list, no guessed rates.
 */

export type CostingKind = 'oil' | 'liquid' | 'count'

export interface FactoryCostingProfile {
  id: string
  kind: CostingKind
  /** Heading for the raw-material card, e.g. "Seeds (Material)". */
  rawLabel: string
  /** Intake names that are raw material. null = every intake. */
  raw: RegExp | null
  /** Intakes that are re-fed intermediates (already costed) — never material. */
  rawExclude: RegExp | null
  /** Main bulk product (pressed oil / treated water). null for count types. */
  product: RegExp | null
  /** By-product that earns a credit (cake, husk, fibre…). null = none. */
  byproduct: RegExp | null
  /** Human name for the by-product card copy. */
  byproductNoun: string
  /** Default pack size in litres for the sellable unit (editable per factory). null = count. */
  defaultUnitLitres: number | null
  /** Label of the packaged SKU used for sell-price matching when none is dispatched yet. */
  defaultPackagedLabel: string
}

// A packaged-unit name: jerrycan / mtungi / can / bottle / sachet / pack, or a
// size such as "20L", "500ml", "1.5 ltr". Packaged cans are logged under
// inconsistent names, so one strict word match silently drops real units.
export const PACKAGED_NAME = /jerry|mtungi|matungi|\bcans?\b|bottle|sachet|pouch|\bpacks?\b|packet|\b\d+(\.\d+)?\s*(ml|l|ltr|ltrs|litre|litres|liter|liters)\b/i

const OIL_REUSED = /oil|waste|cake|husk|kernel|fibre|fiber/i
const OIL_BYPRODUCT = /waste|cake|husk|shell|fibre|fiber|kernel/i

function oilProfile(id: string, rawLabel: string, raw: RegExp, oilName: string, byproductNoun: string): FactoryCostingProfile {
  return {
    id, kind: 'oil', rawLabel, raw, rawExclude: OIL_REUSED, product: /oil/i,
    byproduct: OIL_BYPRODUCT, byproductNoun, defaultUnitLitres: 20,
    defaultPackagedLabel: `${oilName} - Jerrycan (20L)`,
  }
}

const PROFILES: Record<string, FactoryCostingProfile> = {
  sesame_oil: {
    ...oilProfile('sesame_oil', 'Seeds (Material)', /sesame|seed/i, 'Sesame oil', 'press cake'),
    defaultPackagedLabel: 'Sesame oil - Jerrycan Matungi (20L)',
  },
  groundnut_oil: oilProfile('groundnut_oil', 'Groundnut (Material)', /groundnut|peanut|nut/i, 'Groundnut oil', 'groundnut cake'),
  sunflower_oil: oilProfile('sunflower_oil', 'Seeds (Material)', /sunflower|seed/i, 'Sunflower oil', 'sunflower cake and husk'),
  palm_oil: oilProfile('palm_oil', 'Palm fruit (Material)', /palm|fruit|ffb|bunch/i, 'Palm oil', 'kernel and fibre'),
  coconut_oil: oilProfile('coconut_oil', 'Coconut / copra (Material)', /coconut|copra/i, 'Coconut oil', 'coconut cake'),
  water: {
    id: 'water', kind: 'liquid', rawLabel: 'Inputs (Material)', raw: null, rawExclude: null,
    product: /water/i, byproduct: null, byproductNoun: 'by-product', defaultUnitLitres: 0.5,
    defaultPackagedLabel: 'Bottled water',
  },
}

const GENERIC: FactoryCostingProfile = {
  id: 'other', kind: 'count', rawLabel: 'Raw materials', raw: null, rawExclude: null, product: null,
  byproduct: /waste|husk|shell|chaff|bran|cake|whey|offcut|scrap/i, byproductNoun: 'by-product',
  defaultUnitLitres: null, defaultPackagedLabel: 'Finished product',
}

export function getCostingProfile(factoryType: string | null | undefined): FactoryCostingProfile {
  return (factoryType && PROFILES[factoryType]) || { ...GENERIC, id: factoryType || 'other' }
}

/** A branch's own type wins; 'other' / unset falls through to the owner's profile type. */
export function resolveEffectiveFactoryType(locationType: string | null | undefined, profileType: string | null | undefined): string | null {
  if (locationType && locationType !== 'other') return locationType
  if (profileType && profileType !== 'other') return profileType
  return null
}

/** Only the owner's own confirmed sesame press line gets machine-based electricity pre-filled. */
export const hasDefaultMachines = (factoryType: string | null | undefined) => factoryType === 'sesame_oil'

export interface UnitNaming { noun: string; plural: string; title: string }

/** Wording for the sellable unit: "20L Jerrycan", "0.5L Bottle", or a plain "Unit". */
export function unitNaming(p: FactoryCostingProfile, unitLitres: number | null): UnitNaming {
  if (p.kind === 'count' || !unitLitres) return { noun: 'unit', plural: 'units', title: 'Unit' }
  const size = `${Number.isInteger(unitLitres) ? unitLitres : Number(unitLitres.toFixed(2))}L`
  if (unitLitres >= 5) return p.kind === 'oil'
    ? { noun: 'jerrycan', plural: 'jerrycans', title: `${size} Jerrycan` }
    : { noun: 'container', plural: 'containers', title: `${size} Container` }
  return { noun: 'bottle', plural: 'bottles', title: `${size} Bottle` }
}

export const isPackagedName = (p: FactoryCostingProfile, name?: string | null) =>
  p.kind === 'count' ? !(p.byproduct && p.byproduct.test(name || '')) : PACKAGED_NAME.test(name || '')
export const isByproductName = (p: FactoryCostingProfile, name?: string | null) => !!p.byproduct && p.byproduct.test(name || '')
export const isRawIntakeName = (p: FactoryCostingProfile, name?: string | null) => {
  const n = name || ''
  if (p.rawExclude && p.rawExclude.test(n)) return false
  return p.raw ? p.raw.test(n) : true
}

/** Kg of one oil pack: litres × density (the app-wide 1 kg ≈ 1.09 L). */
export const oilKgPerUnit = (unitLitres: number) => unitLitres / 1.09
