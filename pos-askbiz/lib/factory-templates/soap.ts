/**
 * Factory Type Template — Soap / Detergent Making
 *
 * Per-factory-type starter content for the factory onboarding flow and
 * admin settings, once a business picks profiles.factory_type =
 * 'soap' (see supabase/migrations/20260724000009_profiles_factory_type.sql).
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
 * Soap is the standout case for a hold rule (the other is dairy.ts's
 * cheese path): a batch is genuinely not a finished, sellable product
 * until several weeks of curing complete after unmoulding. That's exactly
 * what suggestedRecipes[].holdRule (see pos_factory_capture_holds /
 * lib/factory-holds.ts) exists to represent — see the cure stage hint and
 * sourceNote below.
 */

// See lib/factory-templates/index.ts for the canonical version of this
// interface — redeclared locally here (same convention every template file
// in this directory already follows) so this file type-checks standalone.
export interface FactoryHoldRule {
  label: string
  durationDays?: number
  secondaryLabel?: string
  secondaryDurationDays?: number
  isRegulatory?: boolean
}

// See lib/factory-templates/index.ts for the canonical version of this
// interface — redeclared locally here (same convention every template file
// in this directory already follows) so this file type-checks standalone.
export interface FactoryIngredientRatio {
  name: string
  unit: string
  ratioQty: number
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
    holdRule?: FactoryHoldRule
    // Reference data only — see bakery.ts's identical field for why
    // (nothing reads pos_factory_recipes today; this doesn't touch any
    // live capture flow or inventory).
    ingredients?: FactoryIngredientRatio[]
  }[]
  sourceNote: string
}

const soapTemplate: FactoryTypeTemplate = {
  id: 'soap',
  label: 'Soap / Detergent Making',
  icon: '🧼',
  stageGuidance: [
    {
      stage: 'Raw materials intake',
      hint: 'Weigh incoming oils/fats and caustic soda as they arrive. The ratio between them is a genuine multi-ingredient recipe/formulation, not just a sequence of stages — get the ratio right before starting a batch.',
    },
    {
      stage: 'Prepare lye',
      hint: 'Dissolve caustic soda in water to make lye. Handle with full protective equipment — this step is caustic and hazardous until it reacts with the oil.',
    },
    {
      stage: 'Melt oils',
      hint: 'Melt and combine the batch\'s oils/fats to the target formulation.',
    },
    {
      stage: 'Combine to "trace"',
      hint: 'Mix the lye into the melted oils until the batch thickens to "trace" — the point where oils and lye have emulsified into raw soap batter.',
    },
    {
      stage: 'Pour into moulds',
      hint: 'Pour the traced batch into moulds while it\'s still workable.',
    },
    {
      stage: 'Initial set (24-48 hours)',
      hint: 'Saponification (the chemical reaction that turns oil + lye into soap) continues in the mould for 24-48 hours. The batch is still caustic and not safe to handle bare-skin at this point.',
    },
    {
      stage: 'Unmould / cut',
      hint: 'Unmould the set batch and cut it into bars once it\'s firm enough to hold its shape.',
    },
    {
      stage: 'Cure',
      hint: 'This batch is NOT a finished, sellable product yet. Curing genuinely takes several weeks — this is what the suggestedRecipes holdRule below (defaulted to 35 days, roughly the middle of a typical 4-6 week range) represents. Adjust it based on the owner\'s exact formulation; a harder, longer-cure formulation needs more time than a fast-curing one. Keep curing stock visibly separate from finished, sellable stock until this period completes.',
    },
    {
      stage: 'Package',
      hint: 'Package only once the cure period is complete and the batch has actually been confirmed ready.',
    },
    {
      stage: 'Dispatch',
      hint: 'Dispatch packaged, fully-cured stock.',
    },
  ],
  suggestedRecipes: [
    {
      input_product_name: 'Oil (e.g. palm kernel oil)',
      input_unit: 'litres',
      output_product_name: 'Soap',
      output_unit: 'kg',
      expected_yield_pct: 100,
      yield_min_pct: 90,
      yield_max_pct: 110,
      notes: 'Based on a real Ugandan cottage-producer datapoint: 20 litres of palm kernel oil yielded roughly 180 bars, about 21.6kg — close to a 1:1 kg-of-soap-per-litre-of-oil ratio, which is where the ~100% figure comes from. This is a practical cross-material mass ratio, not a same-substance conservation-of-mass calculation, so treat it as a rule of thumb rather than a precise formula. A separate Kenyan source states a standard bar is roughly 54.75% oils by weight, which is a useful cross-check when validating a formulation. No batch-defect-rate figure specific to African small-scale soap-making was found in research, so this template does not invent one — track defects/rejects separately as they\'re actually observed in the owner\'s own batches.',
      // 35 days sits roughly in the middle of the typical 4-6 week
      // cottage-soap cure range — the owner should adjust this based on
      // their exact formulation (oil blend, superfat level, bar size all
      // shift it), via the Settings hold-days override.
      holdRule: { label: 'Curing', durationDays: 35 },
      // Typical cold-process ratio for a standard oil blend at ~5%
      // superfat: roughly 13-14% caustic soda (NaOH) and ~35% water,
      // both relative to oil weight — varies by the exact oils used
      // (each has its own saponification value) and by superfat target,
      // so this is a starting point, not this owner's actual lye-calc
      // output. ratioQty units mix litres (oil) and kg (NaOH/water) —
      // treating 1 litre of oil as ~1kg for this rough ratio, since
      // most soap-making oils sit close to that density.
      ingredients: [
        { name: 'Oil (e.g. palm kernel oil)', unit: 'litres', ratioQty: 1 },
        { name: 'Caustic soda (NaOH)', unit: 'kg', ratioQty: 0.135 },
        { name: 'Water (for lye)', unit: 'litres', ratioQty: 0.35 },
      ],
    },
  ],
  sourceNote: 'This is the clearest example in the whole factory-template set of why a distinct "not ready yet" status matters: a batch sitting in cure for weeks has to be visibly different from a finished, sellable batch, or staff risk shipping soap before saponification and hardening have actually finished.',
}

export default soapTemplate
