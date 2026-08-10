/**
 * Factory Type Template — Dairy Processing (Yoghurt / Cheese / Ghee)
 *
 * Per-factory-type starter content for the factory onboarding flow and
 * admin settings, once a business picks profiles.factory_type =
 * 'dairy' (see supabase/migrations/20260724000009_profiles_factory_type.sql).
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
 * Dairy is the other branching factory type alongside cassava.ts: after a
 * shared intake/pasteurize/cool prep, the same cooled milk splits into
 * three genuinely different finishing paths — yoghurt, cheese, and
 * ghee/butter — each with a different timeline. Yoghurt and ghee/butter
 * are same-day sellable once packaged; cheese is not, which is why the
 * Cheese suggestedRecipes row below (only that row, not Ghee/butter) is
 * one of only two holdRule-carrying recipes in the whole set (soap.ts is
 * the other) — this is exactly why a hold rule has to live on the recipe,
 * not the template: the same factory type has one output that needs it
 * and two that don't.
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

export interface FactoryTypeTemplate {
  id: string
  label: string
  icon: string
  // `path` tags a stage as belonging to one specific branch (yoghurt/
  // cheese/ghee_butter) rather than the shared intake/pasteurize/cool
  // prep every batch goes through — undefined means "applies to every
  // path". No live UI reads stageGuidance yet, so this only shapes the
  // data correctly for whenever that UI exists.
  stageGuidance: { stage: string; hint: string; path?: string }[]
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
  }[]
  sourceNote: string
}

const dairyTemplate: FactoryTypeTemplate = {
  id: 'dairy',
  label: 'Dairy Processing (Yoghurt / Cheese / Ghee)',
  icon: '🥛',
  stageGuidance: [
    // Shared prep — every end-product below starts here.
    {
      stage: 'Raw milk intake',
      hint: 'Measure incoming raw milk in litres as it arrives — this is the baseline every downstream yield in this template is measured against.',
    },
    {
      stage: 'Filter / strain',
      hint: 'Filter or strain out any visible debris before the milk moves further down the line.',
    },
    {
      stage: 'Standardize',
      hint: 'Adjust fat/solids to the target for whichever product this batch is heading toward — yoghurt, cheese and ghee/butter often want different fat levels going in.',
    },
    {
      stage: 'Pasteurize',
      hint: 'Heat to at least 63°C and hold for 30 minutes (standard batch/vat pasteurization) before cooling. This is the single most important food-safety control point in the whole process — worth recording the actual temperature/time reached, not just "done".',
    },
    {
      stage: 'Cool',
      hint: 'Cool the pasteurized milk, then choose which of the three product paths below this batch is going down — pick the path before logging the next capture.',
    },
    // Branch (a) — yoghurt.
    {
      stage: 'Yoghurt path — inoculate',
      hint: 'Add the yoghurt culture to the cooled milk.',
      path: 'yoghurt',
    },
    {
      stage: 'Yoghurt path — incubate',
      hint: 'Hold the inoculated milk at incubation temperature until it sets.',
      path: 'yoghurt',
    },
    {
      stage: 'Yoghurt path — cool',
      hint: 'Cool the set yoghurt before packaging.',
      path: 'yoghurt',
    },
    {
      stage: 'Yoghurt path — package',
      hint: 'Yoghurt is normally sellable the same day once cooled and packaged — no cure/wait period applies on this path.',
      path: 'yoghurt',
    },
    // Branch (b) — cheese.
    {
      stage: 'Cheese path — inoculate + add rennet',
      hint: 'Add starter culture and rennet to the cooled milk.',
      path: 'cheese',
    },
    {
      stage: 'Cheese path — coagulate',
      hint: 'Let the milk set into a firm curd.',
      path: 'cheese',
    },
    {
      stage: 'Cheese path — cut curd',
      hint: 'Cut the curd to the size that suits the cheese style — finer cuts release more whey, coarser cuts hold more moisture.',
      path: 'cheese',
    },
    {
      stage: 'Cheese path — drain whey',
      hint: 'Whey is a genuine, separately-sellable co-product here, not waste — weigh and log it as its own output rather than writing it off as a loss.',
      path: 'cheese',
    },
    {
      stage: 'Cheese path — salt',
      hint: 'Salt the drained curd (dry-salted or brined, depending on style).',
      path: 'cheese',
    },
    {
      stage: 'Cheese path — mould / press',
      hint: 'Mould and press the salted curd into its final shape.',
      path: 'cheese',
    },
    {
      stage: 'Cheese path — ripen',
      hint: 'Ripening genuinely takes days to weeks depending on the cheese style — this is what the Cheese recipe\'s holdRule below (defaulted to 14 days as a starting point) represents. Adjust it to match the actual style being made; a soft fresh cheese needs far less time than an aged hard cheese, and the batch is not a finished, sellable product until ripening is done.',
      path: 'cheese',
    },
    {
      stage: 'Cheese path — package',
      hint: 'Package only once ripening is complete.',
      path: 'cheese',
    },
    // Branch (c) — ghee / butter.
    {
      stage: 'Ghee/butter path — churn',
      hint: 'Churn cream (separated out from the cooled milk) until it breaks into butter grains and buttermilk.',
      path: 'ghee_butter',
    },
    {
      stage: 'Ghee/butter path — separate',
      hint: 'Drain off the buttermilk and work the butter grains together.',
      path: 'ghee_butter',
    },
    {
      stage: 'Ghee/butter path — simmer / clarify',
      hint: 'Simmer the butter to evaporate remaining water and separate out milk solids, leaving clarified ghee — skip this step if the batch is finishing as butter rather than ghee.',
      path: 'ghee_butter',
    },
    {
      stage: 'Ghee/butter path — package',
      hint: 'Both butter and ghee are normally sellable the same day once packaged — no cure/wait period applies on this path.',
      path: 'ghee_butter',
    },
  ],
  suggestedRecipes: [
    {
      input_product_name: 'Raw milk',
      input_unit: 'litres',
      output_product_name: 'Cheese',
      output_unit: 'kg',
      expected_yield_pct: 9,
      yield_min_pct: 7.7,
      yield_max_pct: 11.1,
      notes: 'Expressed as a weight/volume yield percentage for schema consistency, but read it as a ratio rather than a normal process efficiency: roughly 9-13 litres of milk are needed per kg of finished cheese, which is why this figure looks unusually low next to a typical >50% yield. Commercial cheddar-style processing recovers roughly 93% of milk fat and 95% of casein once you account for that ratio — the small percentage here reflects milk being mostly water, not a wasteful process. Treat this ratio, and the 14-day holdRule default below, as starting points only; adjust both for the owner\'s actual cheese style.',
      // Cheese-path only — deliberately absent from the Ghee/butter row
      // below, which is same-day sellable and needs no hold at all.
      holdRule: { label: 'Ripening', durationDays: 14 },
    },
    {
      input_product_name: 'Raw milk',
      input_unit: 'litres',
      output_product_name: 'Ghee / butter',
      output_unit: 'kg',
      expected_yield_pct: 81,
      yield_min_pct: 80,
      yield_max_pct: 82,
      notes: 'Covers only the churned-butterfat stage: butter is typically about 80-82% milkfat once churned from cream, which is where this figure comes from. No reliable published figure was found for the full milk-to-ghee yield chain (raw milk → cream separation → churning → clarifying to ghee), so this template does not invent one for that whole chain — treat this row as a butter-stage check only, and expect to calibrate a realistic milk-to-ghee figure once the owner has logged a few real batches.',
    },
  ],
  sourceNote: 'Farm-level milk losses — spoilage, spillage, rejected milk before it ever reaches the pasteurizer — run roughly 1.3-6.4% across Kenya, Tanzania, Uganda and Ethiopia, and are worth tracking separately from the processing yields above since they happen upstream of every stage in this template. This template is especially relevant to pastoralist and Somali dairy markets, where processing raw milk into yoghurt, cheese or ghee is a common formalization step for herding-based businesses.',
}

export default dairyTemplate
