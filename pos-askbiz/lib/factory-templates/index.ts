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

export interface FactoryTypeTemplate {
  id: string
  label: string
  icon: string
  stageGuidance: { stage: string; hint: string }[]
  suggestedRecipes: {
    input_product_name: string
    input_unit: string
    output_product_name: string
    output_unit: string
    expected_yield_pct: number
    yield_min_pct: number
    yield_max_pct: number
    notes: string
  }[]
  sourceNote: string
  curePeriodDays?: number
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
