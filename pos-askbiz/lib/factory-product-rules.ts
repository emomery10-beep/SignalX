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
import { getFactoryTypeTemplate } from './factory-templates'

export type FactoryCaptureStep =
  'intake' | 'intake_arrival' | 'intake_feed' | 'output' | 'wastage' | 'dispatch' | 'packaging'

/** Per-step product names for an oil-pressing crop (sesame, groundnut, sunflower, palm). */
function oilByStep(o: NonNullable<ReturnType<typeof getFactoryLocationType>>['oil']): Record<FactoryCaptureStep, string[]> {
  const { seed, oil, waste, can } = o!
  return {
    intake_arrival: [seed],
    intake_feed: [seed],
    intake: [seed],
    output: [oil, ...waste],
    packaging: [...can],
    dispatch: [oil, ...waste, ...can],
    wastage: [seed, oil, ...waste],
  }
}

/**
 * Which factory type governs the dropdown. A branch's own type wins, but
 * 'other' / unset must fall through to the account's profile type — otherwise
 * a dairy or cassava owner whose branch says 'other' would get no defaults.
 */
export function resolveFactoryType(locationType: string | null | undefined, profileType: string | null | undefined): string | null {
  if (locationType && locationType !== 'other') return locationType
  if (profileType && profileType !== 'other') return profileType
  return null
}

const uniq = (names: string[]) => Array.from(new Set(names.map(n => n.trim()).filter(Boolean)))

/** Built-in suggestions for a factory type + step. Unknown type → none. */
export function defaultFactoryProducts(factoryType: string | null | undefined, step: FactoryCaptureStep | null): string[] {
  const t = getFactoryLocationType(factoryType)
  if (t && t.products.length) {
    if (t.oil && step) return oilByStep(t.oil)[step] || []
    return t.products
  }
  // Every other registered factory type (dairy, cassava, maize, rice, bakery,
  // soap, coffee, poultry, fish, water, blocks…): derive from its template's
  // recipes — inputs for intake steps, outputs for output/pack/dispatch.
  const tpl = getFactoryTypeTemplate(factoryType)
  if (!tpl) return []
  const inputs = uniq(tpl.suggestedRecipes.map(r => r.input_product_name))
  const outputs = uniq(tpl.suggestedRecipes.map(r => r.output_product_name))
  if (step === 'intake' || step === 'intake_arrival' || step === 'intake_feed') return inputs
  if (step === 'output' || step === 'packaging' || step === 'dispatch') return outputs
  return uniq([...inputs, ...outputs])
}

/** Oil-crop arrival/feed is raw seed/fruit only; admin-added inventory must not pad it. */
export function isSeedOnlyStep(factoryType: string | null | undefined, step: FactoryCaptureStep | null): boolean {
  return !!getFactoryLocationType(factoryType)?.oil &&
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
