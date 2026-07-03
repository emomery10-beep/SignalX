// Generic network-first, cache-fallback read path — extends pos-inventory-fetch.ts's
// fetchInventory pattern to arbitrary resources (parcels, routes, ...).
// pos-inventory-fetch.ts / fetchInventory are left untouched: /sell's
// full-catalog-sync model is a deliberately different (and still correct)
// caching strategy for a large, exhaustively-paged product list.
'use client'
import { queryLocalResources, upsertResourcePage } from '@/lib/pos-resource-cache'

const API = process.env.NEXT_PUBLIC_API_URL || ''
const NETWORK_TIMEOUT_MS = 3500

export interface FetchResourceOpts {
  endpoint: string
  resourceType: string
  listKey?: string // defaults to resourceType — key holding the array in the API response
  ownerId: string
  staffId: string
  params?: Record<string, string>
  filterFn?: (data: any) => boolean // applied to the cache-fallback path only
  timeoutMs?: number
}

export interface FetchResourceResult {
  data: any[]
  total?: number
  source: 'network' | 'cache'
}

export async function fetchResource(opts: FetchResourceOpts): Promise<FetchResourceResult> {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return fallbackToCache(opts)
  }

  try {
    const params = new URLSearchParams(opts.params || {})
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? NETWORK_TIMEOUT_MS)
    const res = await fetch(`${API}${opts.endpoint}?${params}`, {
      headers: { 'x-owner-id': opts.ownerId, 'x-staff-id': opts.staffId },
      signal: controller.signal,
    })
    clearTimeout(timer)
    if (!res.ok) return fallbackToCache(opts)

    const json = await res.json()
    const listKey = opts.listKey ?? opts.resourceType
    const items: any[] = json[listKey] || []

    // Write-through: keep the offline fallback fresh from live reads,
    // rather than relying solely on a separate periodic full sync — a
    // better fit for lists that are viewed far more often than paged
    // exhaustively (parcels/captures lists vs. the full product catalog).
    upsertResourcePage(opts.resourceType, opts.ownerId, items).catch(() => {})

    return { data: items, total: typeof json.total === 'number' ? json.total : undefined, source: 'network' }
  } catch {
    return fallbackToCache(opts)
  }
}

async function fallbackToCache(opts: FetchResourceOpts): Promise<FetchResourceResult> {
  try {
    const data = await queryLocalResources(opts.resourceType, opts.ownerId, opts.filterFn)
    return { data, total: data.length, source: 'cache' }
  } catch {
    return { data: [], total: 0, source: 'cache' }
  }
}
