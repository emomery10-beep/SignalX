/**
 * Factory Type Template — Coffee Processing (Wet/Washed)
 *
 * Per-factory-type starter content for the factory onboarding flow and
 * admin settings, once a business picks profiles.factory_type =
 * 'coffee' (see supabase/migrations/20260724000009_profiles_factory_type.sql).
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
 * Wet/washed processing is covered here (float-sort, pulp, ferment, wash,
 * dry). Dried parchment coffee is called out explicitly in stageGuidance
 * as a real, separately-sold stopping point, not just a step toward
 * green beans — see sourceNote for why that matters more than the single
 * cherry-to-green-bean recipe row below.
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
  // Not applicable to coffee processing — there is no mandatory wait
  // between output and sellable product the way there is for concrete
  // blocks, so this field is simply left unset.
  curePeriodDays?: number
}

const coffeeTemplate: FactoryTypeTemplate = {
  id: 'coffee',
  label: 'Coffee Processing (Wet/Washed)',
  icon: '☕',
  stageGuidance: [
    {
      stage: 'Ripe cherry intake',
      hint: 'Weigh ripe cherry as it arrives — this is the baseline the cherry-to-green-bean yield below is measured against.',
    },
    {
      stage: 'Float-sort',
      hint: 'Float cherries in water to remove underripe and defective ones before pulping.',
    },
    {
      stage: 'Pulp',
      hint: 'Pulp the cherries to remove the outer skin and most of the fruit flesh.',
    },
    {
      stage: 'Ferment (12-72 hours)',
      hint: 'Ferment the pulped cherry for 12-72 hours to break down the remaining mucilage.',
    },
    {
      stage: 'Wash',
      hint: 'Wash off the fermented mucilage.',
    },
    {
      stage: 'Dry to ~12% moisture',
      hint: 'Dry the washed coffee down to roughly 12% moisture.',
    },
    {
      stage: 'Dried parchment coffee',
      hint: 'This is dried parchment coffee — a real, separately-sold product in its own right, not just an intermediate step. Many small producers sell at this stage rather than continuing to hull/mill. Of every stage across this whole template family, this is the strongest example of a mid-process product with genuine standalone commercial value — consider logging and pricing it as its own output.',
    },
    {
      stage: 'Hull / mill',
      hint: 'Hull/mill the dried parchment to remove the parchment layer (and any remaining silverskin) and reveal the green bean.',
    },
    {
      stage: 'Grade',
      hint: 'Grade the green beans by size and quality.',
    },
    {
      stage: 'Green beans',
      hint: 'Green beans are the finished export-grade product.',
    },
    {
      stage: 'Dispatch',
      hint: 'Record dispatch of graded green beans.',
    },
  ],
  suggestedRecipes: [
    {
      input_product_name: 'Ripe cherry',
      input_unit: 'kg',
      output_product_name: 'Green coffee beans',
      output_unit: 'kg',
      expected_yield_pct: 18,
      yield_min_pct: 15,
      yield_max_pct: 20,
      notes: 'Industry "golden rule" of roughly 5-6kg cherry per 1kg green bean, corroborated by ICO conversion standards. Actual yields typically run 5-10% below this theoretical ratio because of sorting and moisture variance — treat the top of this range as optimistic rather than typical.',
    },
  ],
  sourceNote: 'Letting an owner log and price dried parchment coffee as its own sellable intermediate output — not just a step toward green beans — is probably the single most valuable feature this template needs beyond what the generic capture flow already offers. No recipe row is included here for cherry-to-parchment specifically, since no reliable figure for that intermediate ratio was found in research; add one from your own batches if you sell at the parchment stage.',
}

export default coffeeTemplate
