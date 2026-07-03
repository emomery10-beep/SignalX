// IndexedDB mirror of the inventory catalog — lets the cashier screen search
// and sell products with no network connection. Populated by bulkUpsertFromApi
// (see sync triggers in app/sell/page.tsx), read by pos-inventory-fetch.ts.
'use client'
import { openPosCacheDB } from '@/lib/pos-resource-cache'

const API = process.env.NEXT_PUBLIC_API_URL || ''

export interface CachedInventoryItem {
  id: string
  owner_id: string
  location_id: string | null
  name: string
  sku?: string | null
  sale_price: number
  cost_price: number
  stock_qty: number
  low_stock_threshold?: number
  unit?: string
  active: boolean
  sector?: string | null
  expiry_date?: string | null
  created_at?: string
  location?: { id: string; name: string } | null
  name_lower: string
  sku_lower: string
  _cached_at: string
  _local_stock_delta: number
}

// Kept as a thin alias so the rest of this file (and its exports' call
// sites) don't need to change — schema ownership now lives in
// pos-resource-cache.ts, which this module no longer duplicates.
const openInventoryDB = openPosCacheDB

interface SyncMeta {
  key: string
  last_full_sync_at: string
  total_at_last_sync: number
}

function syncMetaKey(ownerId: string) {
  return `sync_state_${ownerId}`
}

export async function getSyncMeta(ownerId: string): Promise<SyncMeta | undefined> {
  const db = await openInventoryDB()
  return db.get('meta', syncMetaKey(ownerId))
}

export async function isCacheStale(ownerId: string, maxAgeMs: number): Promise<boolean> {
  const meta = await getSyncMeta(ownerId)
  if (!meta) return true
  return Date.now() - new Date(meta.last_full_sync_at).getTime() > maxAgeMs
}

function toCachedItem(raw: any): CachedInventoryItem {
  return {
    ...raw,
    name_lower: (raw.name || '').toLowerCase(),
    sku_lower: (raw.sku || '').toLowerCase(),
    _cached_at: new Date().toISOString(),
    _local_stock_delta: 0,
  }
}

// Pages through the live inventory API until the full catalog is mirrored locally.
export async function bulkUpsertFromApi(
  ownerId: string,
  staffId: string,
  locationId?: string | null,
): Promise<{ total: number; cached: number }> {
  const db = await openInventoryDB()
  const headers = { 'x-owner-id': ownerId, 'x-staff-id': staffId }
  const limit = 200
  let page = 0
  let total = 0
  let cached = 0

  while (true) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (locationId) params.set('location_id', locationId)
    const res = await fetch(`${API}/api/pos/inventory?${params}`, { headers })
    if (!res.ok) break
    const data = await res.json()
    const items: any[] = data.inventory || []
    total = typeof data.total === 'number' ? data.total : total

    const tx = db.transaction('inventory', 'readwrite')
    for (const item of items) {
      await tx.store.put(toCachedItem(item))
    }
    await tx.done
    cached += items.length

    page += 1
    if (items.length < limit || page * limit >= total) break
  }

  await db.put('meta', {
    key: syncMetaKey(ownerId),
    last_full_sync_at: new Date().toISOString(),
    total_at_last_sync: total,
  } as SyncMeta)

  return { total, cached }
}

export interface QueryInventoryOpts {
  ownerId: string
  locationId?: string | null
  sector?: string | null
  search?: string
  limit?: number
}

// Mirrors the /api/pos/inventory filter semantics against the local mirror.
export async function queryLocalInventory(
  opts: QueryInventoryOpts,
): Promise<{ inventory: CachedInventoryItem[]; total: number }> {
  const db = await openInventoryDB()
  const all: CachedInventoryItem[] = await db.getAllFromIndex('inventory', 'by_owner', opts.ownerId)

  let results = all.filter(i => i.active !== false)
  if (opts.locationId) results = results.filter(i => i.location_id === opts.locationId)
  if (opts.sector) results = results.filter(i => i.sector === opts.sector)
  if (opts.search?.trim()) {
    const q = opts.search.trim().toLowerCase()
    results = results.filter(i => i.name_lower.includes(q) || i.sku_lower.includes(q))
  }
  results.sort((a, b) => a.name.localeCompare(b.name))

  const total = results.length
  if (opts.limit) results = results.slice(0, opts.limit)
  return { inventory: results, total }
}

export async function getLocalInventoryItem(id: string): Promise<CachedInventoryItem | undefined> {
  const db = await openInventoryDB()
  return db.get('inventory', id)
}

// Same-device optimistic decrement so a second offline sale sees accurate
// low-stock state. Cross-device drift is NOT reconciled here — the next
// bulkUpsertFromApi sync simply overwrites the local row with server truth.
// Wrapped in a single readwrite transaction (read + write together) so two
// tabs on the same device can't both read the same "before" stock_qty.
export async function decrementLocalStock(
  items: { inventory_id?: string; qty: number }[],
): Promise<void> {
  const db = await openInventoryDB()
  const tx = db.transaction('inventory', 'readwrite')
  for (const line of items) {
    if (!line.inventory_id) continue
    const current = await tx.store.get(line.inventory_id)
    if (!current) continue
    current.stock_qty = Math.max(0, current.stock_qty - line.qty)
    current._local_stock_delta = (current._local_stock_delta || 0) - line.qty
    await tx.store.put(current)
  }
  await tx.done
}
