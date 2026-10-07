/**
 * Per-factory (per-branch) type. One owner can run several factories — e.g.
 * sesame and coconut — each stored as a pos_locations row with kind='factory'
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
}

export const FACTORY_LOCATION_TYPES: FactoryLocationType[] = [
  {
    id: 'sesame_oil', label: 'Sesame / cooking oil', icon: '🫒',
    products: ['Sesame seed', 'Sesame oil', 'Sesame waste', 'Sesame oil - Jerrycan Matungi (20L)', 'Matungi',
      'Sunflower oil', 'Palm oil', 'Shea butter', 'Soybean oil', 'Groundnut oil'],
  },
  {
    id: 'coconut_oil', label: 'Coconut', icon: '🥥',
    products: ['Coconut (whole)', 'Copra', 'Coconut oil', 'Coconut oil - Jerrycan (20L)', 'Coconut cake', 'Coconut waste (shell & husk)'],
  },
  { id: 'other', label: 'Other factory', icon: '🏭', products: [] },
]

export const getFactoryLocationType = (id?: string | null) =>
  FACTORY_LOCATION_TYPES.find(t => t.id === id) || null
