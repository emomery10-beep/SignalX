// Generic IndexedDB read-cache — extends the /sell-only inventory cache
// pattern (pos-inventory-cache.ts) to arbitrary resource types (parcels,
// routes, factory captures, ...) without forcing every resource into a
// shared typed schema. `data` is kept opaque per resource type.
//
// This module owns the single `openDB()` call against `askbiz_pos_cache` —
// pos-inventory-cache.ts imports openPosCacheDB() from here rather than
// maintaining its own. Two independent openDB calls against the same
// database name/version is the real bug risk (racing upgrade callbacks),
// not a hypothetical.
'use client'
import { openDB, type IDBPDatabase } from 'idb'

const API = process.env.NEXT_PUBLIC_API_URL || ''
export const DB_NAME = 'askbiz_pos_cache'
export const DB_VERSION = 3

let dbPromise: Promise<IDBPDatabase> | null = null

export function openPosCacheDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        // v1 had a [owner_id, location_id] compound index, which throws at
        // query time whenever location_id is null (the common unbranched-
        // merchant case) — drop and recreate with a single-field index.
        if (oldVersion < 2 && db.objectStoreNames.contains('inventory')) {
          db.deleteObjectStore('inventory')
        }
        if (!db.objectStoreNames.contains('inventory')) {
          const inventory = db.createObjectStore('inventory', { keyPath: 'id' })
          inventory.createIndex('by_owner', 'owner_id')
          inventory.createIndex('by_sector', 'sector')
        }
        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta', { keyPath: 'key' })
        }
        // v3: generic multi-resource store. Single-field indexes only —
        // same null-compound-index bug applies to any resource whose
        // scoping field (e.g. location_id) can be null.
        if (!db.objectStoreNames.contains('resources')) {
          const resources = db.createObjectStore('resources', { keyPath: '_local_key' })
          resources.createIndex('by_owner', 'owner_id')
          resources.createIndex('by_type', 'resourceType')
        }
      },
    })
  }
  return dbPromise
}

export interface CachedResource {
  _local_key: string // `${resourceType}:${id}`
  resourceType: string
  id: string
  owner_id: string
  data: any
  _cached_at: string
}

interface ResourceSyncMeta {
  key: string
  last_full_sync_at: string
  total_at_last_sync: number
}

function syncMetaKey(resourceType: string, ownerId: string) {
  return `sync_state_${resourceType}_${ownerId}`
}

export async function getResourceSyncMeta(resourceType: string, ownerId: string): Promise<ResourceSyncMeta | undefined> {
  const db = await openPosCacheDB()
  return db.get('meta', syncMetaKey(resourceType, ownerId))
}

export async function isResourceCacheStale(resourceType: string, ownerId: string, maxAgeMs: number): Promise<boolean> {
  const meta = await getResourceSyncMeta(resourceType, ownerId)
  if (!meta) return true
  return Date.now() - new Date(meta.last_full_sync_at).getTime() > maxAgeMs
}

function toCachedResource(resourceType: string, ownerId: string, item: any): CachedResource {
  return {
    _local_key: `${resourceType}:${item.id}`,
    resourceType,
    id: item.id,
    owner_id: ownerId,
    data: item,
    _cached_at: new Date().toISOString(),
  }
}

// Pages through `GET {endpoint}` (which must return `{ [listKey]: item[], total? }`
// the same way /api/pos/inventory and /api/pos/parcels do) and mirrors the
// results locally. `listKey` defaults to the resourceType itself.
export async function bulkUpsertResourceFromApi(
  resourceType: string,
  endpoint: string,
  ownerId: string,
  staffId: string,
  opts?: { listKey?: string; limit?: number; extraParams?: Record<string, string> },
): Promise<{ total: number; cached: number }> {
  const db = await openPosCacheDB()
  const headers = { 'x-owner-id': ownerId, 'x-staff-id': staffId }
  const limit = opts?.limit ?? 200
  const listKey = opts?.listKey ?? resourceType
  let page = 0
  let total = 0
  let cached = 0

  while (true) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit), ...(opts?.extraParams || {}) })
    const res = await fetch(`${API}${endpoint}?${params}`, { headers })
    if (!res.ok) break
    const data = await res.json()
    const items: any[] = data[listKey] || []
    total = typeof data.total === 'number' ? data.total : (page === 0 ? items.length : total)

    const tx = db.transaction('resources', 'readwrite')
    for (const item of items) {
      if (!item?.id) continue
      await tx.store.put(toCachedResource(resourceType, ownerId, item))
    }
    await tx.done
    cached += items.length

    page += 1
    if (items.length < limit || (typeof data.total === 'number' && page * limit >= total)) break
  }

  await db.put('meta', {
    key: syncMetaKey(resourceType, ownerId),
    last_full_sync_at: new Date().toISOString(),
    total_at_last_sync: total,
  } as ResourceSyncMeta)

  return { total, cached }
}

// Upserts a single page of already-fetched results — used by the
// write-through-on-read path in pos-resource-fetch.ts, so a live read
// keeps the offline fallback fresh without waiting for a full sync.
export async function upsertResourcePage(resourceType: string, ownerId: string, items: any[]): Promise<void> {
  if (!items.length) return
  const db = await openPosCacheDB()
  const tx = db.transaction('resources', 'readwrite')
  for (const item of items) {
    if (!item?.id) continue
    await tx.store.put(toCachedResource(resourceType, ownerId, item))
  }
  await tx.done
}

export async function queryLocalResources(
  resourceType: string,
  ownerId: string,
  filterFn?: (data: any) => boolean,
): Promise<any[]> {
  const db = await openPosCacheDB()
  const all: CachedResource[] = await db.getAllFromIndex('resources', 'by_owner', ownerId)
  let results = all.filter(r => r.resourceType === resourceType).map(r => r.data)
  if (filterFn) results = results.filter(filterFn)
  return results
}

export async function getLocalResource(resourceType: string, id: string): Promise<any | undefined> {
  const db = await openPosCacheDB()
  const row: CachedResource | undefined = await db.get('resources', `${resourceType}:${id}`)
  return row?.data
}
