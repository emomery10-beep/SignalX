/**
 * Factory Type Template — Cassava Processing (Garri / Fufu / Starch)
 *
 * Per-factory-type starter content for the factory onboarding flow and
 * admin settings, once a business picks profiles.factory_type =
 * 'cassava' (see supabase/migrations/20260724000009_profiles_factory_type.sql).
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
 * Cassava is the odd one out among the factory templates: it doesn't
 * end in one product. The same fresh tuber, after shared peel/wash/grate
 * prep, branches into three genuinely different end-products (garri,
 * fufu, starch) with three different processes and three different
 * yields — see stageGuidance and sourceNote below.
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

const cassavaTemplate: FactoryTypeTemplate = {
  id: 'cassava',
  label: 'Cassava Processing (Garri / Fufu / Starch)',
  icon: '🥔',
  stageGuidance: [
    // Shared prep — every end-product below starts here.
    {
      stage: 'Fresh tuber intake',
      hint: 'Weigh fresh cassava tubers as they arrive. This is the baseline every downstream yield is measured against.',
    },
    {
      stage: 'Peel',
      hint: 'Remove the outer peel. This is the single biggest weight loss in the whole process, before any product-specific step happens.',
    },
    {
      stage: 'Wash',
      hint: 'Wash peeled tubers clean before grating.',
    },
    {
      stage: 'Grate / rasp',
      hint: 'Grate or rasp the washed tubers into a mash. This is the last shared step — from here the process branches into one of three finishing paths below, so pick which one you\'re running before logging further.',
    },
    // Branch (a) — garri.
    {
      stage: 'Garri path — ferment & press (1-4 days)',
      hint: 'Ferment the grated mash and press it to remove liquid over 1-4 days.',
    },
    {
      stage: 'Garri path — sieve',
      hint: 'Sieve the pressed, fermented mash to an even texture.',
    },
    {
      stage: 'Garri path — fry to ~8% moisture',
      hint: 'Fry the sieved mash down to roughly 8% moisture. This is the finished, shelf-stable garri.',
    },
    // Branch (b) — fufu.
    {
      stage: 'Fufu path — wet ferment (2-5 days)',
      hint: 'A longer wet fermentation than garri\'s — 2-5 days — is what defines fufu\'s flavour and texture.',
    },
    {
      stage: 'Fufu path — dewater',
      hint: 'Dewater the fermented mash.',
    },
    {
      stage: 'Fufu path — dry',
      hint: 'Dry the dewatered mash.',
    },
    {
      stage: 'Fufu path — mill & sieve',
      hint: 'Mill and sieve the dried product into finished fufu flour.',
    },
    // Branch (c) — starch.
    {
      stage: 'Starch path — fine rasp',
      hint: 'A finer rasp than the shared grating step above, aimed at freeing starch rather than producing a fermentable mash.',
    },
    {
      stage: 'Starch path — screen extraction',
      hint: 'Screen the fine rasp to extract the starch slurry from the fibrous pulp.',
    },
    {
      stage: 'Starch path — settle (≥6 hours)',
      hint: 'Let the starch slurry settle for at least 6 hours so starch separates out.',
    },
    {
      stage: 'Starch path — centrifuge',
      hint: 'Centrifuge the settled starch to concentrate it further.',
    },
    {
      stage: 'Starch path — flash-dry',
      hint: 'Flash-dry the concentrated starch. This is the finished cassava starch product.',
    },
  ],
  suggestedRecipes: [
    {
      input_product_name: 'Fresh cassava tuber',
      input_unit: 'kg',
      output_product_name: 'Garri',
      output_unit: 'kg',
      expected_yield_pct: 22,
      yield_min_pct: 17.5,
      yield_max_pct: 35,
      notes: 'FAO\'s documented mass balance for garri: 100kg fresh roots in → 22kg finished garri out, with losses of 27kg at peeling, 3kg at grating, 30kg as pressing/fermentation liquid, 1kg at sieving and 17kg as moisture fried off — that\'s 78kg of losses plus 22kg of product, accounting for the full 100kg. A separate Nigerian variety study found 17.5-35% recovery depending on which cassava variety was used, which is why the min/max band here is wider than the single 22% headline figure would suggest.',
    },
    {
      input_product_name: 'Fresh cassava tuber',
      input_unit: 'kg',
      output_product_name: 'Fufu',
      output_unit: 'kg',
      expected_yield_pct: 25,
      yield_min_pct: 15,
      yield_max_pct: 40,
      notes: 'Add your own once you\'ve run a few batches. No reliable published yield figure for fufu was found during research — unlike the garri and starch rows in this template, the numbers here are a rough, low-confidence placeholder only, deliberately left wide rather than presented as validated data. Please overwrite expected_yield_pct/yield_min_pct/yield_max_pct with figures from your own batches as soon as you have them.',
    },
    {
      input_product_name: 'Fresh cassava tuber',
      input_unit: 'kg',
      output_product_name: 'Cassava starch',
      output_unit: 'kg',
      expected_yield_pct: 20,
      yield_min_pct: 15,
      yield_max_pct: 25,
      notes: 'Rasping frees roughly 70-90% of the available starch in one pass, with a further 5-10% lost at settling. No reliable overall tuber-to-starch mass ratio beyond this was found in research, so treat this figure as approximate rather than as precisely documented as the garri row above.',
    },
  ],
  sourceNote: 'The branch into three distinct end-products — garri, fufu and starch — from the same shared peel/wash/grate prep is the key thing this factory type needs that a flat, single-recipe model can\'t represent; pick the right recipe row for whichever path this batch is actually running. No reliable fufu yield figure was found in research, so that recipe is deliberately marked "add your own once you\'ve run a few batches" rather than the gap being silently hidden behind a made-up number — a future engineer or the owner should be able to tell at a glance that figure was left unconfirmed on purpose.',
}

export default cassavaTemplate
