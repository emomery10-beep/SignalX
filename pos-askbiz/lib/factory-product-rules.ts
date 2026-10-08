/**
 * Which product names a factory capture may use.
 *
 * Staff pick from a fixed list — they cannot type a new product line. The list
 * is the built-in defaults for the factory's type and capture step, plus any
 * product the owner/manager has added to that factory's inventory (sector
 * 'factory'). Adding a product line = adding it in Inventory; that is the only
 * way a new name can enter the dropdown. Shared by the capture screen and the
 * capture API so the two can never disagree.
 */
import { getFactoryLocationType } from './factory-location-types'

export type FactoryCaptureStep =
  'intake' | 'intake_arrival' | 'intake_feed' | 'output' | 'wastage' | 'dispatch' | 'packaging'

const SEED = 'Sesame seed'
const OIL = 'Sesame oil'
const WASTE = 'Sesame waste'
const CAN = 'Sesame oil - Jerrycan Matungi (20L)'

const SESAME_BY_STEP: Record<FactoryCaptureStep, string[]> = {
  intake_arrival: [SEED],
  intake_feed: [SEED],
  intake: [SEED],
  output: [OIL, WASTE],
  packaging: [CAN],
  dispatch: [OIL, WASTE, CAN],
  wastage: [SEED, OIL, WASTE],
}

/** Built-in suggestions for a factory type + step. Unknown type → none. */
export function defaultFactoryProducts(factoryType: string | null | undefined, step: FactoryCaptureStep | null): string[] {
  const t = getFactoryLocationType(factoryType)
  if (!t || !t.products.length) return []
  if (t.id === 'sesame_oil' && step) return SESAME_BY_STEP[step] || []
  return t.products
}

/** Sesame arrival/feed is seed only; admin-added inventory must not pad it. */
export function isSeedOnlyStep(factoryType: string | null | undefined, step: FactoryCaptureStep | null): boolean {
  return getFactoryLocationType(factoryType)?.id === 'sesame_oil' &&
    (step === 'intake' || step === 'intake_arrival' || step === 'intake_feed')
}

export function allowedFactoryProducts(
  factoryType: string | null | undefined,
  step: FactoryCaptureStep | null,
  inventoryNames: string[],
): string[] {
  const defaults = defaultFactoryProducts(factoryType, step)
  if (isSeedOnlyStep(factoryType, step)) return defaults
  const seen = new Set<string>()
  return [...defaults, ...inventoryNames].filter(n => {
    const k = n.trim().toLowerCase()
    if (!k || seen.has(k)) return false
    seen.add(k)
    return true
  })
}
