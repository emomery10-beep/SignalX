/**
 * Factory Type Template — Peanut / Nut Butter Making
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
  id: 'peanut_butter',
  label: 'Peanut / Nut Butter Making',
  icon: '🥜',
  yieldNotApplicable: true,
  products: {
    inputs: ["Groundnuts", "Salt & sugar", "Jars, lids & labels"],
    outputs: ["Peanut butter 250g", "Peanut butter 500g", "Peanut butter 1kg"],
  },
  stageGuidance: [
    { stage: "Raw materials in", hint: "Record nuts and packaging as they arrive, with what you paid." },
    { stage: "Roasting & grinding", hint: "Log the nuts used in each batch." },
    { stage: "Jarring", hint: "Fill, seal and label; log the jars as output." },
    { stage: "Dispatch", hint: "Log each sale or delivery with the customer name." }
  ],
  suggestedRecipes: [],
  sourceNote: 'No yield benchmark is set for this type. Starter product names are generic — rename or add your own in Inventory so the capture screen matches what you really make.',
}

export default template
