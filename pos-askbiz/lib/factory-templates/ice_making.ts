/**
 * Factory Type Template — Ice Making
 *
 * A count-based workshop type: what comes out is whole pieces (or bags), not a share of what went in, so a
 * "yield %" would be meaningless and none is shown (yieldNotApplicable). No yield figures are invented here.
 * What the template gives the owner is the starter product list for the capture screen (they can add their
 * own in Inventory) and plain stage hints. Costing uses the generic per-unit profile: the shared cost of
 * the workshop is split across the pieces by their selling price (lib/factory-unit-cost).
 */
export interface FactoryTypeTemplate {
  id: string
  label: string
  icon: string
  yieldNotApplicable?: boolean
  products?: { inputs: string[]; outputs: string[] }
  stageGuidance: { stage: string; hint: string }[]
  suggestedRecipes: never[]
  sourceNote: string
}

const template: FactoryTypeTemplate = {
  id: 'ice_making',
  label: 'Ice Making',
  icon: '🧊',
  yieldNotApplicable: true,
  products: {
    inputs: ["Water"],
    outputs: ["Ice blocks", "Packed ice (bags)"],
  },
  stageGuidance: [
    { stage: "Water in", hint: "Log the water or power used for a freezing cycle if you track it." },
    { stage: "Freezing", hint: "Freezing takes a set time; log the batch when it is ready." },
    { stage: "Ice ready", hint: "Photograph and log the blocks or bags as output." },
    { stage: "Dispatch", hint: "Log each sale or delivery with the customer name." }
  ],
  suggestedRecipes: [],
  sourceNote: 'Count-based workshop: no yield benchmark applies. Starter product names are generic — rename or add your own in Inventory so the capture screen matches what you really make.',
}

export default template
