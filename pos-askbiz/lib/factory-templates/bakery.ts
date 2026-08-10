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

// See lib/factory-templates/index.ts for the canonical version of this
// interface — redeclared locally here (same convention every template file
// in this directory already follows) so this file type-checks standalone.
export interface FactoryIngredientRatio {
  name: string
  unit: string
  // Relative to a ratioQty of 1 for the recipe's own input_product_name —
  // e.g. flour=1 (implicit), water=0.6 means "0.6kg water per 1kg flour".
  ratioQty: number
}

// The mirror image of FactoryHoldRule (see soap.ts/water.ts/dairy.ts/
// concrete_blocks.ts for that) — "not sellable AFTER N hours" instead of
// "not sellable UNTIL N days". Bakery is the one template in this set that
// needs this, per its own sourceNote below.
export interface FactoryDecayRule {
  label: string
  hoursUntilExpiry: number
}

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
    // Reference data only — nothing reads pos_factory_recipes today (see
    // that migration's own comment), so this doesn't change any live
    // capture flow or deduct real inventory. It exists so the actual
    // multi-ingredient formulation this template's own mix/knead hint
    // already says matters "far more than tracking sequential stages" is
    // captured somewhere, instead of staying folded into one dominant
    // input's name string. Real per-SKU capture-time logging and
    // inventory depletion from this data is a separate, larger project —
    // this only fixes the "the ratio isn't recorded anywhere" gap.
    ingredients?: FactoryIngredientRatio[]
    decayRule?: FactoryDecayRule
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
      notes: 'No reliable flour-to-bread yield ratio was found in research, so this row does not invent an ingredient-level number. It reflects a rough dough-to-finished-loaf WEIGHT ratio only, based on documented 10-25% weight loss during proofing, baking and cooling — moisture evaporating, not product being wasted. Use this row to sanity-check that a batch\'s finished weight is in a plausible range against what went into the mixer; use the ingredients list below for the actual dough formulation.',
      // A standard lean white-bread baker's-percentage formula (all
      // relative to flour=1): ~60% hydration, ~2% salt, ~1.5% instant
      // yeast — a common starting ratio, not this specific bakery's
      // measured recipe. Real formulations vary by product (enriched
      // dough, whole wheat, etc.) — treat as a starting point to edit,
      // same spirit as every yield range elsewhere in this template set.
      ingredients: [
        { name: 'Flour', unit: 'kg', ratioQty: 1 },
        { name: 'Water', unit: 'litres', ratioQty: 0.6 },
        { name: 'Yeast', unit: 'kg', ratioQty: 0.015 },
        { name: 'Salt', unit: 'kg', ratioQty: 0.02 },
      ],
      // 24 hours matches this template's own sourceNote below. Applies to
      // "Baked bread" specifically — a factory type with more than one
      // shelf-life-sensitive product would set this per relevant recipe
      // row, same as holdRule already does for dairy's cheese-only case.
      decayRule: { label: 'Sell by', hoursUntilExpiry: 24 },
    },
  ],
  sourceNote: 'Unsold bakery stock typically ages out within about 24 hours, so freshness and shelf-life tracking matters more here than in most other factory templates in this set — plan alerts and markdowns around a same-day sell-through window rather than a multi-day one.',
}

export default bakeryTemplate
