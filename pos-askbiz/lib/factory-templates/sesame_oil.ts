/**
 * Factory Type Template — Sesame Oil Pressing
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
 * Sesame only — groundnut, sunflower and palm each have their own
 * template now, because moisture, conditioning and yield differ by crop.
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
  label: 'Sesame Oil Pressing',
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
  ],
  sourceNote: 'Yield ranges are drawn from small-scale oil-pressing field data and published FAO/academic references — actual results will vary by seed quality, equipment and technique. ',
}

export default sesameOilTemplate
