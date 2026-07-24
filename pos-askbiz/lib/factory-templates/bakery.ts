/**
 * Factory Type Template — Bakery / Bread Production
 *
 * Per-factory-type starter content for the factory onboarding flow and
 * admin settings, once a business picks profiles.factory_type =
 * 'bakery' (see supabase/migrations/20260724000009_profiles_factory_type.sql).
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
 * Bakery is the clearest case in the whole template set where a real,
 * multi-ingredient RECIPE (flour/water/yeast/salt ratios) matters more
 * than the sequential stages below — see the mix/knead stage hint. The
 * single suggestedRecipes row here is only a rough dough-to-finished-loaf
 * weight check, not an attempt to model that ingredient-level recipe.
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

const bakeryTemplate: FactoryTypeTemplate = {
  id: 'bakery',
  label: 'Bakery / Bread Production',
  icon: '🍞',
  stageGuidance: [
    {
      stage: 'Ingredient intake',
      hint: 'Weigh incoming flour and other ingredients as they arrive — this is the baseline the suggestedRecipes row below is measured against.',
    },
    {
      stage: 'Sift',
      hint: 'Sift flour to remove lumps and any foreign matter before mixing.',
    },
    {
      stage: 'Mix / knead',
      hint: 'This is the step where a real recipe — the flour/water/yeast/salt ratios that make up the actual dough — matters far more than tracking sequential stages does. This template does not attempt to model that ingredient-level recipe; it only tracks the mixed dough batch as a single input further down the line.',
    },
    {
      stage: 'Bulk ferment',
      hint: 'Let the mixed dough bulk-ferment before dividing.',
    },
    {
      stage: 'Divide / shape',
      hint: 'Divide the fermented dough into individual loaves and shape them.',
    },
    {
      stage: 'Proof',
      hint: 'Proof the shaped loaves before baking — one of the stages where the dough loses moisture weight, not product.',
    },
    {
      stage: 'Bake',
      hint: 'Bake the proofed loaves. Most of the weight loss this template\'s suggestedRecipes row accounts for happens here and at proofing/cooling, as moisture evaporates — it is not wasted product.',
    },
    {
      stage: 'Cool',
      hint: 'Cool baked loaves before slicing and packaging.',
    },
    {
      stage: 'Slice',
      hint: 'Slice cooled loaves if the product is sold sliced.',
    },
    {
      stage: 'Package',
      hint: 'Package the finished bread.',
    },
    {
      stage: 'Dispatch',
      hint: 'Same-day turnaround is typical for bakery product — dispatch promptly given how quickly unsold stock ages out (see sourceNote).',
    },
  ],
  suggestedRecipes: [
    {
      input_product_name: 'Flour+ingredients (dough batch)',
      input_unit: 'kg',
      output_product_name: 'Baked bread',
      output_unit: 'kg',
      expected_yield_pct: 85,
      yield_min_pct: 75,
      yield_max_pct: 90,
      notes: 'No reliable flour-to-bread yield ratio was found in research, so this row does not invent an ingredient-level number. It reflects a rough dough-to-finished-loaf WEIGHT ratio only, based on documented 10-25% weight loss during proofing, baking and cooling — moisture evaporating, not product being wasted. A real bakery\'s ingredient recipe (the flour/water/yeast/salt ratios that make up the dough itself) is a separate concern this template doesn\'t attempt to model; use this row only to sanity-check that a batch\'s finished weight is in a plausible range against what went into the mixer.',
    },
  ],
  sourceNote: 'Unsold bakery stock typically ages out within about 24 hours, so freshness and shelf-life tracking matters more here than in most other factory templates in this set — plan alerts and markdowns around a same-day sell-through window rather than a multi-day one.',
}

export default bakeryTemplate
