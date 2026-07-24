/**
 * Factory Type Template — Fish Smoking / Processing
 *
 * Per-factory-type starter content for the factory onboarding flow and
 * admin settings, once a business picks profiles.factory_type =
 * 'fish_smoking' (see supabase/migrations/20260724000009_profiles_factory_type.sql).
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
 * Unlike the other templates in this family, no reliable overall
 * %-weight-loss figure for fish smoking was found in research — sourced
 * ranges were inconsistent (20-80%). The single recipe row below is
 * deliberately marked as a low-confidence placeholder rather than a
 * validated figure — see sourceNote.
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
  // Not applicable to fish smoking — there is no mandatory wait between
  // output and sellable product the way there is for concrete blocks,
  // so this field is simply left unset.
  curePeriodDays?: number
}

const fishSmokingTemplate: FactoryTypeTemplate = {
  id: 'fish_smoking',
  label: 'Fish Smoking / Processing',
  icon: '🐟',
  stageGuidance: [
    {
      stage: 'Fresh fish intake',
      hint: 'Weigh fresh fish as it arrives — this is the baseline the smoked-product yield below is measured against.',
    },
    {
      stage: 'Sort / grade',
      hint: 'Sort and grade fish by size and species before processing.',
    },
    {
      stage: 'Clean / gut',
      hint: 'Clean and gut the fish.',
    },
    {
      stage: 'Salt / brine (optional)',
      hint: 'Salt or brine the fish if your process uses it — optional, skip this stage if you smoke unsalted.',
    },
    {
      stage: 'Arrange on kiln',
      hint: 'Arrange cleaned (and optionally salted/brined) fish on the kiln.',
    },
    {
      stage: 'Smoke (hours to days)',
      hint: 'Smoke for anywhere from a few hours to a few days depending on product and kiln. This is what drives most of the moisture loss and the resulting shelf life — fresh fish moisture typically drops from roughly 70-77% down to 10-15% after 2-3 days of smoking, giving 6-9 months shelf life.',
    },
    {
      stage: 'Cool',
      hint: 'Cool the smoked fish before grading and packing.',
    },
    {
      stage: 'Grade',
      hint: 'Grade the cooled, smoked product.',
    },
    {
      stage: 'Package',
      hint: 'Package the finished product.',
    },
    {
      stage: 'Dispatch',
      hint: 'Record dispatch of packaged smoked product.',
    },
  ],
  suggestedRecipes: [
    {
      input_product_name: 'Fresh fish',
      input_unit: 'kg',
      output_product_name: 'Smoked fish product',
      output_unit: 'kg',
      expected_yield_pct: 50,
      yield_min_pct: 20,
      yield_max_pct: 80,
      notes: 'This range is wide and unconfirmed in research — sourced overall weight-loss figures were inconsistent (20-80%), so don\'t treat this default as reliable. What is well-established: fresh fish moisture drops from roughly 70-77% down to 10-15% after 2-3 days of smoking, giving 6-9 months shelf life — but that moisture figure doesn\'t translate cleanly into a single overall %-weight-loss number. Track your own actual input-to-output ratio over a few batches and update expected_yield_pct/yield_min_pct/yield_max_pct with your real figures as soon as you have them.',
    },
  ],
  sourceNote: 'This template\'s yield figure is the least confident of all 12 factory types in this template family — encourage the owner to treat it as a placeholder to replace with their own measured average after a few production runs, not as a benchmark to chase.',
}

export default fishSmokingTemplate
