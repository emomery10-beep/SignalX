/**
 * Factory Type Template — Sunflower Oil Pressing
 *
 * Per-factory-type starter content once a business picks factory_type = 'sunflower_oil'.
 *
 * Split out of the old combined "Cooking Oil Pressing" template: each oil
 * crop is pressed differently (moisture, conditioning, yield, co-products), so
 * each is its own factory type with its own stages and yield row.
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

const template: FactoryTypeTemplate = {
  id: 'sunflower_oil',
  label: 'Sunflower Oil Pressing',
  icon: '🌻',
  stageGuidance: [
    {
      stage: 'Seed intake',
      hint: 'Weigh sunflower seed as it arrives and check moisture — seed stored above about 9-10% moisture loses yield and spoils. Clean out stalk, stones and chaff.',
    },
    {
      stage: 'Dehulling (optional) & conditioning',
      hint: 'Dehulling raises oil quality and lowers wax but cuts weight; note whether this batch was dehulled before comparing against the recipe. Light warming before pressing improves recovery.',
    },
    {
      stage: 'Pressing / expelling',
      hint: 'Log the oil AND the sunflower cake and husk. Both are sellable co-products (animal feed, fuel), not wastage.',
    },
    {
      stage: 'Filtering, settling & bottling',
      hint: 'Capture the filtered oil once it is clear. Many sunflower producers sell in small bottles — log packaged units at the packaging step, not the bulk litres.',
    },
    {
      stage: 'Dispatch',
      hint: 'Photograph the outgoing batch and waybill before it leaves the premises.',
    },
  ],
  suggestedRecipes: [
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
  ],
  sourceNote: 'Yield ranges are drawn from small-scale oil-pressing field data and published FAO/academic references — actual results vary by seed quality, moisture, equipment and technique.',
}

export default template
