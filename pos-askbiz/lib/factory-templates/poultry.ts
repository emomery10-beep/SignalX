/**
 * Factory Type Template — Poultry Processing / Abattoir
 *
 * Per-factory-type starter content for the factory onboarding flow and
 * admin settings, once a business picks profiles.factory_type =
 * 'poultry' (see supabase/migrations/20260724000009_profiles_factory_type.sql).
 *
 * Two things a template provides:
 * - stageGuidance: hints for the stages this factory type's production
 *   run typically moves through, shown alongside the generic
 *   intake/output/wastage/dispatch capture types (app/factory/production/page.tsx).
 * - suggestedRecipes: starter rows for pos_factory_recipes (see
 *   supabase/migrations/20260724000002_factory_recipes.sql) so an owner
 *   isn't starting from a blank yield table — they can accept these
 *   as-is or edit them once real batches show a different ratio.
 *
 * This is a sibling concept to lib/staff-templates.ts (role/permission
 * templates for staffing a location) — not a replacement for it. Nothing
 * imports this file yet; it is additive groundwork for the factory-type
 * onboarding/settings UI.
 *
 * Broiler dressing percentage is the primary, best-documented recipe in
 * this template. Turkey, duck and goose are included as supplementary
 * rows for businesses that process them, but are less precise ranges
 * than the broiler figure — see sourceNote.
 */

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
  // Not applicable to poultry processing — there is no mandatory wait
  // between output and sellable product the way there is for concrete
  // blocks, so this field is simply left unset.
  curePeriodDays?: number
}

const poultryTemplate: FactoryTypeTemplate = {
  id: 'poultry',
  label: 'Poultry Processing / Abattoir',
  icon: '🐔',
  stageGuidance: [
    {
      stage: 'Live bird intake',
      hint: 'Weigh live birds as they arrive — dressing percentage is measured against this live weight, so an accurate intake weight matters more here than at most other stages.',
    },
    {
      stage: 'Stun / slaughter / bleed',
      hint: 'Stun, slaughter and bleed the bird. Bleeding alone removes roughly 3% of live weight — worth logging as its own checkpoint if you want finer-grained tracking through the process.',
    },
    {
      stage: 'Scald',
      hint: 'Scald in hot water to loosen feathers before defeathering.',
    },
    {
      stage: 'Defeather',
      hint: 'Remove feathers. A headless, defeathered bird typically sits around 88% of live weight.',
    },
    {
      stage: 'Eviscerate',
      hint: 'Remove internal organs. A fully eviscerated carcass typically comes out around 74.5% of live weight — close to, but not the same checkpoint as, the final dressed-carcass figure below.',
    },
    {
      stage: 'Chill',
      hint: 'Chill the carcass before cutting/portioning.',
    },
    {
      stage: 'Cut / portion',
      hint: 'Portion the chilled carcass into cuts, or keep it whole depending on what you sell.',
    },
    {
      stage: 'Grade / package',
      hint: 'Grade and package finished cuts or whole carcasses.',
    },
    {
      stage: 'Dispatch',
      hint: 'Record dispatch of graded, packaged product.',
    },
  ],
  suggestedRecipes: [
    {
      input_product_name: 'Live broiler',
      input_unit: 'kg',
      output_product_name: 'Dressed broiler carcass',
      output_unit: 'kg',
      expected_yield_pct: 72,
      yield_min_pct: 70,
      yield_max_pct: 75,
      notes: 'Broiler dressing percentage (dressed carcass ÷ live weight) is a standard, well-documented industry figure. If you want finer-grained tracking, these intermediate checkpoints can be logged as separate captures along the same production run: bleeding alone removes roughly 3% of live weight, a headless defeathered bird is around 88%, and a fully eviscerated carcass is around 74.5% — before you reach the final dressed-carcass figure above.',
    },
    {
      input_product_name: 'Live turkey',
      input_unit: 'kg',
      output_product_name: 'Dressed turkey carcass',
      output_unit: 'kg',
      expected_yield_pct: 79,
      yield_min_pct: 77,
      yield_max_pct: 81,
      notes: 'Turkey dressing percentage typically runs 77-81% — a less precise range than the broiler figure above, so treat it as a starting estimate rather than a benchmark.',
    },
    {
      input_product_name: 'Live duck',
      input_unit: 'kg',
      output_product_name: 'Dressed duck carcass',
      output_unit: 'kg',
      expected_yield_pct: 70.5,
      yield_min_pct: 66,
      yield_max_pct: 75,
      notes: 'Duck dressing percentage typically runs 66-75% — a less precise range than the broiler figure above, so treat it as a starting estimate rather than a benchmark.',
    },
    {
      input_product_name: 'Live goose',
      input_unit: 'kg',
      output_product_name: 'Dressed goose carcass',
      output_unit: 'kg',
      expected_yield_pct: 68,
      yield_min_pct: 64,
      yield_max_pct: 72,
      notes: 'Goose dressing percentage typically runs 64-72% — a less precise range than the broiler figure above, so treat it as a starting estimate rather than a benchmark.',
    },
  ],
  sourceNote: 'Broiler dressing percentage is the best-documented, most standardized yield figure of any factory type researched here — a real opportunity for an owner to benchmark their own dressing percentage against a credible published number. The turkey, duck and goose rows are included for businesses that process them, but are less precise ranges than the broiler figure and should be treated as rougher starting points.',
}

export default poultryTemplate
