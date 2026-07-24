/**
 * Factory Type Template — Cooking Oil Pressing (Sesame / Groundnut / Sunflower / Palm)
 *
 * Per-factory-type starter content for the factory onboarding flow and
 * admin settings, once a business picks profiles.factory_type =
 * 'sesame_oil' (see supabase/migrations/20260724000009_profiles_factory_type.sql).
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
 * One factory_type value, one shared pressing process, four different
 * oilseeds: sesame, groundnut, sunflower and palm each get their own
 * recipe row below because their yields differ enormously (18-76%), but
 * stageGuidance is shared since intake → clean/roast → press →
 * filter/bottle → dispatch is the same shape whichever seed is running.
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

const sesameOilTemplate: FactoryTypeTemplate = {
  id: 'sesame_oil',
  label: 'Cooking Oil Pressing (Sesame / Groundnut / Sunflower / Palm)',
  icon: '🫒',
  stageGuidance: [
    {
      stage: 'Seed / fruit intake',
      hint: 'Weigh the raw seed or fruit as it arrives, then clean and winnow out debris, stones and damaged seed before it goes further.',
    },
    {
      stage: 'Cleaning & roasting (optional)',
      hint: 'Roasting is optional but changes yield a lot — roasted sesame seed can press out well above 60% oil vs. around 33% unroasted, so note whether this batch was roasted before comparing it against the recipe below.',
    },
    {
      stage: 'Pressing / expelling',
      hint: 'Log both outputs here: the oil AND the press-cake. Press-cake is a real, sellable co-product (animal feed, etc.), not wastage — do not log it under wastage.',
    },
    {
      stage: 'Filtering, settling & bottling',
      hint: 'Capture the filtered/settled oil once it is clear and ready to bottle — this is usually the final sellable output figure that yield tracking compares against intake.',
    },
    {
      stage: 'Dispatch',
      hint: 'Photograph the outgoing batch and waybill before it leaves the premises.',
    },
  ],
  suggestedRecipes: [
    {
      input_product_name: 'Sesame seed',
      input_unit: 'kg',
      output_product_name: 'Sesame oil',
      output_unit: 'litres',
      expected_yield_pct: 36,
      yield_min_pct: 33,
      yield_max_pct: 63,
      notes: 'Field-verified small-expeller result is around 36% for unroasted seed; roasting the seed first can push this up to roughly 63%. Both figures are genuine data points for the same seed, not a typo — check whether your batch was roasted before deciding whether actual output looks healthy or low.',
    },
    {
      input_product_name: 'Groundnut',
      input_unit: 'kg',
      output_product_name: 'Groundnut oil',
      output_unit: 'litres',
      expected_yield_pct: 76,
      yield_min_pct: 68,
      yield_max_pct: 80,
      notes: 'Screw-press oil recovery from shelled kernel typically runs 73-80%, improving toward the top end with proper seed conditioning before pressing. That figure is measured from shelled kernel, not whole nut in shell — shelling itself only recovers roughly 68-72% kernel weight from the whole nut, so the 68% floor here really reflects a different, earlier step than the 80% ceiling. Track shelling loss and pressing loss separately if you can, rather than reading this as one continuous measurement.',
    },
    {
      input_product_name: 'Sunflower seed',
      input_unit: 'kg',
      output_product_name: 'Sunflower oil',
      output_unit: 'litres',
      expected_yield_pct: 25,
      yield_min_pct: 20,
      yield_max_pct: 30,
      notes: 'Based on ram-press field data from small-scale Tanzanian oil presses; screw presses or better-conditioned seed may recover somewhat more.',
    },
    {
      input_product_name: 'Palm fruit',
      input_unit: 'kg',
      output_product_name: 'Palm oil',
      output_unit: 'litres',
      expected_yield_pct: 18,
      yield_min_pct: 12,
      yield_max_pct: 24,
      notes: 'This is first-pressing yield as a percentage of fresh-fruit-bunch weight; overall extraction efficiency (how much of the oil actually present in the fruit gets recovered) ranges 55-90% depending on press type. Palm fruit also yields a second, separate product — palm-kernel oil, pressed from the nut inside the fruit — track that on its own recipe row and its own timeline rather than folding it into this one.',
    },
  ],
  sourceNote: 'Yield ranges are drawn from small-scale oil-pressing field data and published FAO/academic references — actual results will vary by seed quality, equipment and technique. The four oilseeds above are different enough in yield (18-76%) that mixing them up when logging a recipe would produce a meaningless comparison, so pick the row that matches the seed actually being pressed.',
}

export default sesameOilTemplate
