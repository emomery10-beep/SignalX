// Network-first, cache-fallback read path for the inventory catalog.
// Callers get the same { inventory, total } shape either way — only the
// implementation switches between the live API and the IndexedDB mirror.
'use client'
import { queryLocalInventory } from '@/lib/pos-inventory-cache'

const API = process.env.NEXT_PUBLIC_API_URL || ''
const NETWORK_TIMEOUT_MS = 3500

export interface FetchInventoryOpts {
  ownerId: string
  staffId: string
  locationId?: string | null
  sector?: string | null
  search?: string
  page?: number
  limit?: number
}

export interface FetchInventoryResult {
  inventory: any[]
  total: number
  source: 'network' | 'cache'
}

export async function fetchInventory(opts: FetchInventoryOpts): Promise<FetchInventoryResult> {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return fallbackToCache(opts)
  }

  try {
    const params = new URLSearchParams()
    if (opts.search) params.set('search', opts.search)
    if (opts.sector) params.set('sector', opts.sector)
    if (opts.locationId) params.set('location_id', opts.locationId)
    if (opts.page != null) params.set('page', String(opts.page))
    if (opts.limit != null) params.set('limit', String(opts.limit))

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), NETWORK_TIMEOUT_MS)
    const res = await fetch(`${API}/api/pos/inventory?${params}`, {
      headers: { 'x-owner-id': opts.ownerId, 'x-staff-id': opts.staffId },
      signal: controller.signal,
    })
    clearTimeout(timer)
    if (!res.ok) return fallbackToCache(opts)

    const data = await res.json()
    return { inventory: data.inventory || [], total: data.total ?? 0, source: 'network' }
  } catch {
    return fallbackToCache(opts)
  }
}

async function fallbackToCache(opts: FetchInventoryOpts): Promise<FetchInventoryResult> {
  try {
    const { inventory, total } = await queryLocalInventory({
      ownerId: opts.ownerId,
      locationId: opts.locationId,
      sector: opts.sector,
      search: opts.search,
      limit: opts.limit,
    })
    return { inventory, total, source: 'cache' }
  } catch {
    return { inventory: [], total: 0, source: 'cache' }
  }
}
