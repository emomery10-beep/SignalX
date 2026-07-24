/**
 * Factory Type Template — Packaged Drinking Water (Sachet / Bottled)
 *
 * Per-factory-type starter content for the factory onboarding flow and
 * admin settings, once a business picks profiles.factory_type =
 * 'water' (see supabase/migrations/20260724000009_profiles_factory_type.sql).
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
 * Packaged water has a stage the other factory templates do not: a
 * quality hold where a batch lab test is a real regulatory gate, not an
 * optional QA nicety — NAFDAC in Nigeria, Ghana FDA, or KEBS in Kenya
 * (or the local equivalent) must clear a batch before it can be sold at
 * all. That is called out explicitly below rather than folded into
 * "packaging" or "dispatch".
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

const waterTemplate: FactoryTypeTemplate = {
  id: 'water',
  label: 'Packaged Drinking Water (Sachet / Bottled)',
  icon: '💧',
  stageGuidance: [
    {
      stage: 'Raw water intake',
      hint: 'Log the raw water volume as it enters from the borehole or municipal supply — this is the baseline the treatment recipe below is measured against.',
    },
    {
      stage: 'Treatment',
      hint: 'Sediment/carbon/micron filtration, softening, and disinfection (reverse osmosis and/or UV/ozone) all happen here — log the treated water volume once it has passed every step your setup actually runs.',
    },
    {
      stage: 'Packaging',
      hint: 'Sachet form-fill-seal, or bottle blow-mold/rinse/fill/cap/label — log finished packaged units here, not raw treated-water volume.',
    },
    {
      stage: 'Quality hold',
      hint: 'A required regulatory checkpoint, not an optional step — a batch lab test (NAFDAC, Ghana FDA, KEBS, or your local equivalent) must clear before this batch can be released for sale.',
    },
    {
      stage: 'Dispatch',
      hint: 'Photograph the outgoing batch and waybill once the quality hold has cleared.',
    },
  ],
  suggestedRecipes: [
    {
      input_product_name: 'Raw water',
      input_unit: 'litres',
      output_product_name: 'Treated water',
      output_unit: 'litres',
      expected_yield_pct: 90,
      yield_min_pct: 50,
      yield_max_pct: 98,
      notes: 'Two different loss mechanisms drive this wide range, and are worth tracking separately: simple sediment/carbon filtration backwash typically loses only about 2-10% of production, while a reverse-osmosis (RO) system rejects roughly 15-50% of feed water as reject/concentrate depending on setup. Narrow this range once you know which treatment method your factory actually runs — an RO-based setup will genuinely sit lower than a simple-filtration one, and that is not a fault.',
    },
  ],
  sourceNote: 'Treated-water batches must clear a regulatory lab test (NAFDAC, Ghana FDA, KEBS, or your local equivalent) before dispatch — the quality-hold stage above is a real compliance gate, not optional. Treatment-loss figures vary heavily by method, so treat this recipe as a starting point: simple filtration alone will sit near the top of the range, while an RO-based setup will sit lower.',
}

export default waterTemplate
