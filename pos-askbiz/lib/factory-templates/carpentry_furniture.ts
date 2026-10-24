/**
 * Factory Type Template — Carpentry / Furniture Workshop
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
  id: 'carpentry_furniture',
  label: 'Carpentry / Furniture Workshop',
  icon: '🪑',
  yieldNotApplicable: true,
  products: {
    inputs: ["Timber", "Plywood / boards", "Nails, hinges & fittings", "Varnish / paint"],
    outputs: ["Bed", "Table", "Chair", "Door", "Wardrobe", "Other furniture"],
  },
  stageGuidance: [
    { stage: "Materials in", hint: "Record timber, boards and fittings as they arrive, with what you paid." },
    { stage: "Cutting & joining", hint: "Log what goes into each job when you start it." },
    { stage: "Finishing", hint: "Sanding, varnish or paint before the piece counts as finished." },
    { stage: "Finished piece", hint: "Photograph each finished piece and log it as output." },
    { stage: "Dispatch", hint: "Log the delivery with the customer name and where it went." }
  ],
  suggestedRecipes: [],
  sourceNote: 'Count-based workshop: no yield benchmark applies. Starter product names are generic — rename or add your own in Inventory so the capture screen matches what you really make.',
}

export default template
