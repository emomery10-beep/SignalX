/**
 * Factory Type Template — Juice / Beverage Bottling
 *
 * No yield benchmark is built in for this type: recipes and input quality vary too much for one number, and none has
 * been invented here. Efficiency is not scored (yieldNotApplicable); the factory's own captured numbers show its
 * real yield.
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
  id: 'juice_beverages',
  label: 'Juice / Beverage Bottling',
  icon: '🧃',
  yieldNotApplicable: true,
  products: {
    inputs: ["Fruit", "Sugar", "Bottles, caps & labels", "Water"],
    outputs: ["Juice 500ml", "Juice 1L", "Other beverage"],
  },
  stageGuidance: [
    { stage: "Raw materials in", hint: "Record fruit, sugar and packaging as they arrive, with what you paid." },
    { stage: "Pressing & mixing", hint: "Log the fruit used in each batch." },
    { stage: "Bottling", hint: "Fill, cap and label; log the bottles as output." },
    { stage: "Dispatch", hint: "Log each sale or delivery with the customer name." }
  ],
  suggestedRecipes: [],
  sourceNote: 'No yield benchmark is set for this type. Starter product names are generic — rename or add your own in Inventory so the capture screen matches what you really make.',
}

export default template
