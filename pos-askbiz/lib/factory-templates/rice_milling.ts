/**
 * Factory Type Template — Rice Milling / Parboiling
 *
 * Per-factory-type starter content for the factory onboarding flow and
 * admin settings, once a business picks profiles.factory_type =
 * 'rice_milling' (see supabase/migrations/20260724000009_profiles_factory_type.sql).
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

const riceMillingTemplate: FactoryTypeTemplate = {
  id: 'rice_milling',
  label: 'Rice Milling / Parboiling',
  icon: '🌾',
  stageGuidance: [
    {
      stage: 'Paddy intake',
      hint: 'Weigh incoming paddy (unmilled rice) as it arrives. This is the baseline for both recipes below.',
    },
    {
      stage: 'Pre-clean',
      hint: 'Screen out stones, chaff and immature grains before deciding whether this batch gets parboiled.',
    },
    {
      stage: 'Parboiling (optional)',
      hint: 'Soak the paddy to 24-30% moisture, steam it, then dry it back down to 12-14% moisture. Parboiled paddy is itself a real, separately-valued intermediate product — some mills sell it as-is without milling it further, so consider logging and pricing it as its own output, not just as a step toward milled rice.',
    },
    {
      stage: 'Husk',
      hint: 'Remove the husk. This produces brown rice, whether or not the paddy was parboiled first.',
    },
    {
      stage: 'Whiten',
      hint: 'Remove the bran layer from the brown rice.',
    },
    {
      stage: 'Polish',
      hint: 'Polish the whitened rice to its final finish.',
    },
    {
      stage: 'Grade / sort',
      hint: 'Sort milled rice by grain size and breakage — this is where parboiling\'s effect on head-rice yield actually shows up.',
    },
    {
      stage: 'Package',
      hint: 'Package the graded rice for sale.',
    },
    {
      stage: 'Dispatch',
      hint: 'Record dispatch for each packaged grade.',
    },
  ],
  suggestedRecipes: [
    {
      input_product_name: 'Paddy',
      input_unit: 'kg',
      output_product_name: 'Milled rice (no parboil)',
      output_unit: 'kg',
      expected_yield_pct: 66,
      yield_min_pct: 53,
      yield_max_pct: 70,
      notes: 'FAO\'s technical conversion factor for paddy-to-milled-rice is 66%. The fuller FAO range is wide because mill quality matters a lot here: 70% is the theoretical maximum, 67% is typical of well-run mills, 60% is typical of poor-quality paddy, and yields as low as 53% have been recorded on old Engleberg mills.',
    },
    {
      input_product_name: 'Paddy',
      input_unit: 'kg',
      output_product_name: 'Parboiled milled rice',
      output_unit: 'kg',
      expected_yield_pct: 90,
      yield_min_pct: 85,
      yield_max_pct: 95,
      notes: 'Parboiling is documented to cut milling breakage from 20-40% down to just 2-5%, pushing head-rice yield above 90% in an Ethiopian field study. This figure is specifically about breakage/head-rice yield after parboiling, not a like-for-like replacement for the raw paddy-to-milled-rice ratio in the recipe above — the two numbers are measuring different things.',
    },
  ],
  sourceNote: 'Whether or not paddy is parboiled first is the single biggest yield/quality decision in this business — bigger than any equipment choice. Ask which recipe applies to a given batch before comparing its actual output against expected yield.',
}

export default riceMillingTemplate
