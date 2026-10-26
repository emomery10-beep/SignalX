/**
 * Factory Type Template — Animal Feed Milling / Mixing
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
  id: 'animal_feed',
  label: 'Animal Feed Milling / Mixing',
  icon: '🌾',
  yieldNotApplicable: true,
  products: {
    inputs: ["Maize / maize germ", "Maize bran", "Soya meal", "Fishmeal (omena)", "Premix & minerals"],
    outputs: ["Dairy meal", "Layers mash", "Chick mash", "Pig feed", "Other feed"],
  },
  stageGuidance: [
    { stage: "Raw materials in", hint: "Record each grain, meal and supplement as it arrives, with what you paid." },
    { stage: "Milling & mixing", hint: "Log what goes into each mix. The recipe matters more than any benchmark." },
    { stage: "Bagging", hint: "Bag and weigh; log the bags as output." },
    { stage: "Dispatch", hint: "Log each sale or delivery with the customer name." }
  ],
  suggestedRecipes: [],
  sourceNote: 'No yield benchmark is set for this type. Starter product names are generic — rename or add your own in Inventory so the capture screen matches what you really make.',
}

export default template
