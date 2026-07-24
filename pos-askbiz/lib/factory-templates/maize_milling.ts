/**
 * Factory Type Template — Maize Milling (Posho/Flour Mill)
 *
 * Per-factory-type starter content for the factory onboarding flow and
 * admin settings, once a business picks profiles.factory_type =
 * 'maize_milling' (see supabase/migrations/20260724000009_profiles_factory_type.sql).
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
}

const maizeMillingTemplate: FactoryTypeTemplate = {
  id: 'maize_milling',
  label: 'Maize Milling (Posho/Flour Mill)',
  icon: '🌽',
  stageGuidance: [
    {
      stage: 'Grain intake & cleaning',
      hint: 'Weigh incoming maize grain and screen out stones, chaff and foreign matter before it reaches the mill.',
    },
    {
      stage: 'Conditioning / tempering (optional)',
      hint: 'Some mills add water and rest the grain briefly to toughen the bran before grinding — skip this stage if your mill doesn\'t condition.',
    },
    {
      stage: 'Degermination / dehulling (optional, roller mills only)',
      hint: 'Roller mills strip the bran and germ off before grinding. Hammer mills (common for whole meal) skip straight to grinding instead.',
    },
    {
      stage: 'Grinding',
      hint: 'The grain is ground down to meal. How fine it\'s ground, and whether bran was already removed, determines which grade comes out.',
    },
    {
      stage: 'Sifting',
      hint: 'Sifting splits the ground meal into flour and bran/germ. One milling run produces TWO sellable products at once — flour and bran/germ — not one product plus waste. Today\'s capture system logs each as a separate, unrelated capture rather than linked co-products, so log both explicitly instead of only logging the flour.',
    },
    {
      stage: 'Packaging',
      hint: 'Bag both the flour and the bran/germ by-product separately — they\'re sold to different buyers at very different prices.',
    },
    {
      stage: 'Dispatch',
      hint: 'Record dispatch for each packaged product separately so batch traceability and sales both tie back to the right grade.',
    },
  ],
  suggestedRecipes: [
    {
      input_product_name: 'Maize grain',
      input_unit: 'kg',
      output_product_name: 'Whole meal flour',
      output_unit: 'kg',
      expected_yield_pct: 98,
      yield_min_pct: 97,
      yield_max_pct: 99,
      notes: 'Near-total extraction — minimal bran is removed at this grade, so almost the whole grain ends up in the flour.',
    },
    {
      input_product_name: 'Maize grain',
      input_unit: 'kg',
      output_product_name: 'Bolted/sifted meal',
      output_unit: 'kg',
      expected_yield_pct: 88,
      yield_min_pct: 80,
      yield_max_pct: 96,
      notes: 'Mid-grade meal with some bran sifted out. Wider band than whole meal because how much bran is removed varies more by mill and buyer preference.',
    },
    {
      input_product_name: 'Maize grain',
      input_unit: 'kg',
      output_product_name: 'Refined "super" meal',
      output_unit: 'kg',
      expected_yield_pct: 68,
      yield_min_pct: 60,
      yield_max_pct: 75,
      notes: 'Up to 40% of the grain is diverted to bran/germ co-product at this grade — that\'s expected, not a processing failure. The Food Fortification Initiative uses 67.5% as its African planning-average figure across all three grades, which is why this "super" grade figure sits close to it.',
    },
  ],
  sourceNote: 'Real yield depends heavily on which of the three grades above is being milled — whole meal, bolted/sifted and "super" meal are genuinely different processes with genuinely different expected yields, not one process with variable quality. Whichever grade is run, the bran/germ removed at sifting is a sellable co-product worth tracking on its own recipe row, not waste to be ignored.',
}

export default maizeMillingTemplate
