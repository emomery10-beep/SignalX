// Role → prefetch-resource-types mapping, so each offline-enabled screen
// doesn't need to hardcode "always sync parcels" / "always sync captures"
// itself. Adding a Tier 2 sector later means adding an entry here, not new
// per-screen prefetch logic.
'use client'
import { isAnyLogisticsRole, getSector } from '@/lib/pos-role-client'

export interface OfflineResourceEntry {
  resourceType: string
  endpoint: string
  listKey: string
}

export function getOfflineResourceTypesForRole(role: string): OfflineResourceEntry[] {
  if (!role) return []

  if (isAnyLogisticsRole(role)) {
    return [
      { resourceType: 'parcels', endpoint: '/api/pos/parcels', listKey: 'parcels' },
      { resourceType: 'routes', endpoint: '/api/pos/routes', listKey: 'routes' },
    ]
  }

  if (getSector(role) === 'factory') {
    return [
      { resourceType: 'factory_captures', endpoint: '/api/pos/factory/capture', listKey: 'captures' },
    ]
  }

  return []
}
