/**
 * Factory Type Template — Coconut Oil Pressing
 *
 * Per-factory-type starter content once a business picks factory_type = 'coconut_oil'.
 *
 * Each oil crop is pressed differently (moisture, conditioning, yield,
 * co-products), so coconut is its own factory type. The raw material is copra
 * (dried kernel); a factory that buys whole nuts and sun-dries them logs the
 * nuts at intake and the dried copra as what is fed to the press.
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
  id: 'coconut_oil',
  label: 'Coconut Oil Pressing',
  icon: '🥥',
  stageGuidance: [
    {
      stage: 'Nut / copra intake',
      hint: 'Weigh copra (or whole nuts) as it arrives. If you buy whole nuts, count them and note the price per nut — a nut gives roughly 200-250 g of dry copra, so the nut price decides your real cost per kilo.',
    },
    {
      stage: 'Husking, splitting & drying',
      hint: 'Dehusk, split and sun-dry the kernel to about 4-6% moisture. Weigh the dry copra before pressing. Damp copra gives poor yield and rancid oil, and mouldy copra must never be pressed (aflatoxin risk).',
    },
    {
      stage: 'Pressing / expelling',
      hint: 'Log the oil AND the coconut cake. The cake is a sellable co-product (animal feed), not wastage — do not log it under wastage.',
    },
    {
      stage: 'Filtering & bleaching',
      hint: 'Filter and, if you sell it clear, bleach with clay. Capture the clean, settled oil once it is ready to pack — this is the output figure yield tracking compares against intake. Expect to lose a few percent in filtering.',
    },
    {
      stage: 'Packing & dispatch',
      hint: 'Log finished packaged units (jerrycans or bottles) at the packaging step, not bulk litres. Photograph the outgoing batch and waybill before it leaves the premises.',
    },
  ],
  suggestedRecipes: [
    {
      input_product_name: 'Copra',
      input_unit: 'kg',
      output_product_name: 'Coconut oil',
      output_unit: 'litres',
      expected_yield_pct: 55,
      yield_min_pct: 45,
      yield_max_pct: 62,
      notes: 'Oil as a share of dry-copra weight. Copra holds roughly 63-65% oil; a screw press recovers about 85-95% of it (a true cold press less), leaving 5-7% in the cake — so around 55% by weight. Check against your own batches and edit.',
    },
  ],
  sourceNote: 'Yield ranges are drawn from published copra-processing references and small-scale screw-press data — actual results vary with copra moisture, press settings and whether the copra is warmed before pressing. Confirm against your own batches.',
}

export default template
