/**
 * Factory Type Template — Concrete Block / Brick Making
 *
 * Per-factory-type starter content for the factory onboarding flow and
 * admin settings, once a business picks profiles.factory_type =
 * 'concrete_blocks' (see supabase/migrations/20260724000009_profiles_factory_type.sql).
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
 * Concrete block making is the one factory type in this set with a real,
 * mandatory curing period before the product is at full strength — see
 * curePeriodDays below and the cure stage in stageGuidance.
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
  /**
   * Days of mandatory curing before blocks are at a practical minimum
   * strength and safe to sell/use — not the 28 days needed for full
   * design strength (see the cure stage hint and recipe notes below).
   * Optional because most other factory types have no equivalent
   * mandatory wait between output and sellable product.
   */
  curePeriodDays?: number
}

const concreteBlocksTemplate: FactoryTypeTemplate = {
  id: 'concrete_blocks',
  label: 'Concrete Block / Brick Making',
  icon: '🧱',
  stageGuidance: [
    {
      stage: 'Materials intake',
      hint: 'Weigh in cement, sand, aggregate and water — this is a real multi-ingredient recipe, not a single input. A common mix ratio is 1:6 to 1:8 cement:sand.',
    },
    {
      stage: 'Mix',
      hint: 'Mix cement, sand, aggregate and water to a uniform consistency before molding.',
    },
    {
      stage: 'Mold / vibrate / compact',
      hint: 'Pack the mix into molds and vibrate/compact it to remove air pockets and give the block its shape.',
    },
    {
      stage: 'De-mold ("green" blocks)',
      hint: 'Blocks come out of the mold "green" — uncured and not yet sellable. Handle them as little as possible from here until curing is underway.',
    },
    {
      stage: 'Cure',
      hint: 'Cure 1 day shaded, then keep sun/water-cured for at least ~7 more days before treating blocks as sellable — full design strength isn\'t reached until 28 days, so consider tracking both a "minimum cure" date and a "full strength" date on the same batch. Extending cure time before handling/stacking is one of the few levers an owner controls directly: one Kenyan producer documented cutting rejects from 15% down to 3% by doing exactly that.',
    },
    {
      stage: 'Stack / store',
      hint: 'Stack cured blocks for storage, keeping batches identifiable for traceability.',
    },
    {
      stage: 'Dispatch',
      hint: 'Record dispatch once blocks have cleared at least the minimum cure period above.',
    },
  ],
  suggestedRecipes: [
    {
      input_product_name: 'Cement (50kg bag, with sand/aggregate/water)',
      input_unit: 'bags',
      output_product_name: 'Standard 9-inch hollow blocks',
      output_unit: 'blocks',
      expected_yield_pct: 100,
      yield_min_pct: 86,
      yield_max_pct: 100,
      notes: 'Roughly 30-40 standard 9-inch hollow blocks per 50kg cement bag at a 1:6 mix — track your actual blocks-per-bag count directly, this percentage is just a way to fit that count into the same yield-tracking system as other factory types. Expected (100%) is pegged to a 35-block nominal target and the low end (86%) to 30 blocks; the real-world high end (~40 blocks, which would be 114% of that target) is capped at 100% here because pos_factory_recipes constrains yield_max_pct to at most 100 — so a capture at or above the 35-block target will show as "at target," not distinctly flagged as exceptional. If the upside matters to you, log your literal blocks-per-bag count alongside this percentage. Separately: one Kenyan producer documented cutting rejects from 15% down to 3% simply by extending cure time before handling/stacking — a lever entirely within the owner\'s control (see the cure stage above).',
    },
  ],
  sourceNote: 'This is the simplest, most directly-measurable ratio of any factory type researched — an owner can verify their own blocks-per-bag number within a single day\'s production run, unlike processes that need days or weeks to complete before a real yield is known.',
  curePeriodDays: 7,
}

export default concreteBlocksTemplate
