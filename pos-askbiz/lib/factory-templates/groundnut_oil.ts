/**
 * Factory Type Template — Groundnut Oil Pressing
 *
 * Per-factory-type starter content once a business picks factory_type = 'groundnut_oil'.
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
  id: 'groundnut_oil',
  label: 'Groundnut Oil Pressing',
  icon: '🥜',
  stageGuidance: [
    {
      stage: 'Nut intake',
      hint: 'Weigh groundnuts as they arrive, in shell or shelled — note which, because shelling alone loses roughly 28-32% of the weight.',
    },
    {
      stage: 'Shelling, sorting & roasting',
      hint: 'Shell, then sort out mouldy or damaged kernels (aflatoxin risk — never press them). Light roasting and cooling to a low moisture before pressing raises yield and flavour.',
    },
    {
      stage: 'Pressing / expelling',
      hint: 'Log the oil AND the groundnut cake. The cake is a sellable co-product (feed / snack base), not wastage — do not log it under wastage.',
    },
    {
      stage: 'Filtering, settling & bottling',
      hint: 'Capture the filtered, settled oil once it is clear and ready to pack in jerrycans or bottles — this is the output figure yield tracking compares against intake.',
    },
    {
      stage: 'Dispatch',
      hint: 'Photograph the outgoing batch and waybill before it leaves the premises.',
    },
  ],
  suggestedRecipes: [
    {
      input_product_name: 'Groundnut',
      input_unit: 'kg',
      output_product_name: 'Groundnut oil',
      output_unit: 'litres',
      expected_yield_pct: 38,
      yield_min_pct: 30,
      yield_max_pct: 45,
      notes: 'Oil as a share of shelled-kernel weight: kernels hold roughly 45-50% oil and a small screw press recovers about 75-80% of it, so around 35-40% by weight. This replaces the earlier 76% figure, which was the recovery efficiency of the oil in the kernel, not oil as a share of input. Measured from shelled kernel, not nut in shell. Check against your own batches and edit.',
    },
  ],
  sourceNote: 'Yield ranges are drawn from small-scale oil-pressing field data and published FAO/academic references — actual results vary by seed quality, moisture, equipment and technique. Confirm against your own batches.',
}

export default template
