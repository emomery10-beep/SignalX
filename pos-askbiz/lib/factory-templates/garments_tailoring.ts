/**
 * Factory Type Template — Garments / Tailoring
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
  id: 'garments_tailoring',
  label: 'Garments / Tailoring',
  icon: '🧵',
  yieldNotApplicable: true,
  products: {
    inputs: ["Fabric", "Thread, buttons & zips"],
    outputs: ["School uniform", "Shirt", "Dress", "Trousers", "Other garment"],
  },
  stageGuidance: [
    { stage: "Materials in", hint: "Record fabric and trims as they arrive, with what you paid." },
    { stage: "Cutting & sewing", hint: "Log the fabric used when a batch or order starts." },
    { stage: "Finishing", hint: "Pressing and checking before a garment counts as finished." },
    { stage: "Finished garments", hint: "Photograph the batch and log the count as output." },
    { stage: "Dispatch", hint: "Log delivery or collection with the customer name." }
  ],
  suggestedRecipes: [],
  sourceNote: 'Count-based workshop: no yield benchmark applies. Starter product names are generic — rename or add your own in Inventory so the capture screen matches what you really make.',
}

export default template
