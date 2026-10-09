/**
 * Factory Type Template — Palm Oil Processing
 *
 * Per-factory-type starter content once a business picks factory_type = 'palm_oil'.
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
  id: 'palm_oil',
  label: 'Palm Oil Processing',
  icon: '🌴',
  stageGuidance: [
    {
      stage: 'Fruit bunch intake',
      hint: 'Weigh fresh fruit bunches (FFB) as they arrive and process them quickly — free fatty acids climb the longer fruit waits after harvest, which hurts oil quality.',
    },
    {
      stage: 'Sterilising, stripping & digesting',
      hint: 'Steam or boil the bunches, strip the fruit from the bunch, then digest (mash) it. Log the empty bunches and fibre as by-products, not wastage.',
    },
    {
      stage: 'Pressing & clarifying',
      hint: 'Press the digested fruit, then clarify (settle and skim) the crude oil. Log the clarified oil as the output. Palm kernel is a separate product pressed from the nut — track it on its own.',
    },
    {
      stage: 'Packing',
      hint: 'Log finished packaged units (jerrycans or bottles) at the packaging step, not bulk litres.',
    },
    {
      stage: 'Dispatch',
      hint: 'Photograph the outgoing batch and waybill before it leaves the premises.',
    },
  ],
  suggestedRecipes: [
    {
      input_product_name: 'Palm fruit',
      input_unit: 'kg',
      output_product_name: 'Palm oil',
      output_unit: 'litres',
      expected_yield_pct: 18,
      yield_min_pct: 12,
      yield_max_pct: 24,
      notes: 'First-pressing yield as a percentage of fresh-fruit-bunch weight; overall extraction efficiency ranges 55-90% depending on press type. Palm-kernel oil, pressed from the nut inside the fruit, is a second product — track it on its own row rather than folding it into this one.',
    },
  ],
  sourceNote: 'Yield ranges are drawn from small-scale palm-oil processing field data and published FAO/academic references — actual results vary with fruit ripeness, delay after harvest and press type.',
}

export default template
