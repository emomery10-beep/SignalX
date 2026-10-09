/**
 * Per-factory (per-branch) type. One owner can run several factories — e.g.
 * sesame, groundnut, sunflower, palm, coconut, water… — each stored as a pos_locations row with kind='factory'
 * and its own factory_type (profiles.factory_type is per-owner and cannot
 * describe two different factories).
 *
 * NOTE: identical copy lives in pos-askbiz/lib/factory-location-types.ts — the
 * two apps are deployed separately. Change both together.
 */

export interface FactoryLocationType {
  id: string
  label: string
  icon: string
  /** Product-name suggestions on the capture screen for this factory. */
  products: string[]
  /** Oil-pressing crops: the exact names used at each capture step. */
  oil?: { seed: string; oil: string; waste: string[]; can: string[] }
}

export const FACTORY_LOCATION_TYPES: FactoryLocationType[] = [
  {
    id: 'sesame_oil', label: 'Sesame oil', icon: '🫒',
    products: ['Sesame seed', 'Sesame oil', 'Sesame waste', 'Sesame oil - Jerrycan Matungi (20L)', 'Matungi',
      'Sunflower oil', 'Palm oil', 'Shea butter', 'Soybean oil', 'Groundnut oil'],
    oil: { seed: 'Sesame seed', oil: 'Sesame oil', waste: ['Sesame waste'], can: ['Sesame oil - Jerrycan Matungi (20L)'] },
  },
  {
    id: 'groundnut_oil', label: 'Groundnut oil', icon: '🥜',
    products: ['Groundnut', 'Groundnut oil', 'Groundnut cake', 'Groundnut oil - Jerrycan (20L)', 'Groundnut oil - Bottle (1L)'],
    oil: { seed: 'Groundnut', oil: 'Groundnut oil', waste: ['Groundnut cake'], can: ['Groundnut oil - Jerrycan (20L)', 'Groundnut oil - Bottle (1L)'] },
  },
  {
    id: 'sunflower_oil', label: 'Sunflower oil', icon: '🌻',
    products: ['Sunflower seed', 'Sunflower oil', 'Sunflower cake', 'Sunflower husk', 'Sunflower oil - Jerrycan (20L)', 'Sunflower oil - Bottle (1L)'],
    oil: { seed: 'Sunflower seed', oil: 'Sunflower oil', waste: ['Sunflower cake', 'Sunflower husk'], can: ['Sunflower oil - Jerrycan (20L)', 'Sunflower oil - Bottle (1L)'] },
  },
  {
    id: 'palm_oil', label: 'Palm oil', icon: '🌴',
    products: ['Palm fruit', 'Palm oil', 'Palm kernel', 'Palm fibre', 'Palm oil - Jerrycan (20L)', 'Palm oil - Bottle (1L)'],
    oil: { seed: 'Palm fruit', oil: 'Palm oil', waste: ['Palm kernel', 'Palm fibre'], can: ['Palm oil - Jerrycan (20L)', 'Palm oil - Bottle (1L)'] },
  },
  {
    id: 'coconut_oil', label: 'Coconut', icon: '🥥',
    products: ['Coconut (whole)', 'Copra', 'Coconut oil', 'Coconut oil - Jerrycan (20L)', 'Coconut cake', 'Coconut waste (shell & husk)'],
  },
  // Every other registered factory type. Products come from its template's
  // recipes (pos-askbiz/lib/factory-templates), so none are listed here.
  { id: 'water', label: 'Packaged drinking water', icon: '💧', products: [] },
  { id: 'maize_milling', label: 'Maize milling', icon: '🌽', products: [] },
  { id: 'cassava', label: 'Cassava processing', icon: '🥔', products: [] },
  { id: 'rice_milling', label: 'Rice milling', icon: '🌾', products: [] },
  { id: 'dairy', label: 'Dairy processing', icon: '🥛', products: [] },
  { id: 'bakery', label: 'Bakery / bread', icon: '🍞', products: [] },
  { id: 'soap', label: 'Soap / detergent', icon: '🧼', products: [] },
  { id: 'concrete_blocks', label: 'Concrete blocks / bricks', icon: '🧱', products: [] },
  { id: 'poultry', label: 'Poultry processing', icon: '🐔', products: [] },
  { id: 'coffee', label: 'Coffee processing', icon: '☕', products: [] },
  { id: 'fish_smoking', label: 'Fish smoking', icon: '🐟', products: [] },
  { id: 'other', label: 'Other factory', icon: '🏭', products: [] },
]

export const getFactoryLocationType = (id?: string | null) =>
  FACTORY_LOCATION_TYPES.find(t => t.id === id) || null
