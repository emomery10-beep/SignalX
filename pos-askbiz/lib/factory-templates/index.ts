/**
 * Factory Type Template Registry
 *
 * Combines the 12 per-type template files in this directory into one
 * registry, keyed by the exact `profiles.factory_type` value each
 * represents (supabase/migrations/20260724000009_profiles_factory_type.sql).
 * This is what the onboarding factory-type step and the admin settings
 * factory-type picker both import — neither should import the individual
 * template files directly, so the set of available types stays in one
 * place.
 *
 * Order below matches how commonly-relevant each type was ranked during
 * research (sesame oil and water first, as the two real businesses this
 * was researched against) — consumers that render a list should preserve
 * this order rather than re-sorting alphabetically.
 */

import sesameOil from './sesame_oil'
import water from './water'
import maizeMilling from './maize_milling'
import cassava from './cassava'
import riceMilling from './rice_milling'
import dairy from './dairy'
import bakery from './bakery'
import soap from './soap'
import concreteBlocks from './concrete_blocks'
import poultry from './poultry'
import coffee from './coffee'
import fishSmoking from './fish_smoking'

// A recipe-level (not template-level) not-yet-releasable gate. Recipe-level
// because dairy proves a template-wide flag isn't precise enough — cheese
// needs one, yoghurt/ghee from the exact same factory type don't. Supersedes
// the old template-level `curePeriodDays` field (dead code — nothing ever
// read it) now that the real feature (pos_factory_capture_holds,
// lib/factory-holds.ts) exists to consume this.
export interface FactoryHoldRule {
  label: string             // "Curing", "Quality hold"
  durationDays?: number     // primary/blocking threshold, if duration-based
  secondaryLabel?: string   // e.g. "Full strength" — concrete's later, informational-only milestone
  secondaryDurationDays?: number
  isRegulatory?: boolean    // true = needs manual clearance regardless of duration (e.g. a lab test)
}

// A recipe's real multi-ingredient formulation (bakery's flour/water/yeast/
// salt, soap's oil/caustic-soda/water, concrete's cement/sand/aggregate/
// water) — reference data only, since nothing reads pos_factory_recipes
// today (see 20260724000002_factory_recipes.sql's own comment). Doesn't
// change any live capture flow or deduct real inventory; that would be a
// separate, larger project (a repeatable-ingredient-rows capture screen +
// per-SKU stock depletion), not attempted here.
export interface FactoryIngredientRatio {
  name: string
  unit: string
  // Relative to a ratioQty of 1 for the recipe's own input_product_name.
  ratioQty: number
}

// The mirror image of FactoryHoldRule: instead of "not sellable until N
// hours/days pass" (a hold), this is "not sellable AFTER N hours pass" —
// bakery's own sourceNote: "Unsold bakery stock typically ages out within
// about 24 hours." Hours, not days, since this window is much shorter than
// any hold period in the template set. Single deadline only (unlike
// FactoryHoldRule's optional secondary milestone) — nothing researched
// needs a second decay checkpoint the way concrete needs a second cure one.
export interface FactoryDecayRule {
  label: string           // "Sell by"
  hoursUntilExpiry: number
}

export interface FactoryTypeTemplate {
  id: string
  label: string
  icon: string
  // `path` tags a stage as belonging to one specific branch of a
  // multi-path factory type (cassava's garri/fufu/starch, dairy's
  // yoghurt/cheese/ghee_butter) rather than the shared prep every batch
  // goes through — undefined means "applies to every path". Purely
  // additive data shaping: stageGuidance has no live UI consumer today
  // (see app/factory/production/page.tsx's comment referencing it, which
  // is the closest thing to a reader and doesn't actually render it), so
  // this only makes the data correct for whenever that UI exists.
  stageGuidance: { stage: string; hint: string; path?: string }[]
  suggestedRecipes: {
    input_product_name: string
    input_unit: string
    output_product_name: string
    output_unit: string
    expected_yield_pct: number
    yield_min_pct: number
    yield_max_pct: number
    notes: string
    holdRule?: FactoryHoldRule
    ingredients?: FactoryIngredientRatio[]
    decayRule?: FactoryDecayRule
  }[]
  sourceNote: string
}

// Order intentional — see header comment. Keep in sync with the CHECK
// constraint in 20260724000009_profiles_factory_type.sql plus 'other'.
export const FACTORY_TYPE_TEMPLATES: FactoryTypeTemplate[] = [
  sesameOil,
  water,
  maizeMilling,
  cassava,
  riceMilling,
  dairy,
  bakery,
  soap,
  concreteBlocks,
  poultry,
  coffee,
  fishSmoking,
]

export const FACTORY_TYPE_TEMPLATES_BY_ID: Record<string, FactoryTypeTemplate> =
  Object.fromEntries(FACTORY_TYPE_TEMPLATES.map(t => [t.id, t]))

// 'other' has no dedicated template — a factory owner running something
// not in the list above picks this and gets the generic capture flow
// with no stage guidance or suggested recipes.
export const FACTORY_TYPE_OTHER = 'other'

export function getFactoryTypeTemplate(factoryType: string | null | undefined): FactoryTypeTemplate | null {
  if (!factoryType || factoryType === FACTORY_TYPE_OTHER) return null
  return FACTORY_TYPE_TEMPLATES_BY_ID[factoryType] ?? null
}
