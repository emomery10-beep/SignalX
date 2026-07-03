// Generic offline write outbox — extends /sell's cash-sale localStorage
// queue pattern to any endpoint/payload shape, including photo-bearing
// writes (parcels intake, factory captures) that don't fit in localStorage's
// ~5-10MB string-only ceiling.
//
// Deliberately a SEPARATE IndexedDB database from `askbiz_pos_cache`
// (pos-resource-cache.ts): the cache is disposable and always rebuildable
// from the network, but the outbox holds unsynced user data that must
// never be touched by a cache-store schema migration. Keeping them apart
// means a cache upgrade bug can never risk losing a queued write.
//
// Idempotency convention for every route this queue talks to: a
// client_tx_id collision is ALWAYS returned as 200 with `{ ..., deduped:
// true }`, never 409. That keeps this module resource-agnostic — it only
// needs to know "400 = permanently invalid, drop it" / "5xx or network
// error = retry later," and never has to learn which 409s are safe to drop
// vs. a real business conflict. Don't "fix" a stuck-outbox-item bug by
// teaching this module about 409 — fix the route to emit 400/200 instead.
'use client'
import { openDB, type IDBPDatabase } from 'idb'

const API = process.env.NEXT_PUBLIC_API_URL || ''
const DB_NAME = 'askbiz_pos_outbox'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase> | null = null

function openOutboxDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const outbox = db.createObjectStore('outbox', { keyPath: 'client_tx_id' })
        outbox.createIndex('by_owner', 'owner_id')
      },
    })
  }
  return dbPromise
}

export interface OutboxItem {
  client_tx_id: string
  owner_id: string
  staff_id: string
  endpoint: string
  method: 'POST' | 'PATCH'
  body: Record<string, any>
  created_at: string
  attempts: number
  last_error?: string
}

export function generateClientTxId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export class OfflineQueueQuotaError extends Error {
  constructor() {
    super('Offline storage is full — this write was NOT saved. Free up space or get a connection before continuing.')
    this.name = 'OfflineQueueQuotaError'
  }
}

// Throws OfflineQueueQuotaError on IndexedDB quota exhaustion — callers
// MUST surface this to the user as a blocking error, not swallow it. A
// silent failure here means a clerk believes an offline intake was saved
// when it wasn't — a real data-loss risk, not just a UX rough edge.
export async function enqueueOfflineWrite(item: Omit<OutboxItem, 'attempts'>): Promise<void> {
  const db = await openOutboxDB()
  try {
    await db.put('outbox', { ...item, attempts: 0 } satisfies OutboxItem)
  } catch (err: any) {
    if (err?.name === 'QuotaExceededError') throw new OfflineQueueQuotaError()
    throw err
  }
}

export async function getOutboxCount(ownerId: string): Promise<number> {
  const db = await openOutboxDB()
  const items = await db.getAllFromIndex('outbox', 'by_owner', ownerId)
  return items.length
}

export async function clearOutboxItem(clientTxId: string): Promise<void> {
  const db = await openOutboxDB()
  await db.delete('outbox', clientTxId)
}

export interface ReplayResult {
  succeeded: number
  remaining: number
  // One entry per item dropped this replay (200 success OR 400 permanent
  // rejection) — callers use this to reconcile any "pending sync" UI state
  // keyed by client_tx_id, including reading server-generated fields
  // (tracking number, ticket number, order id) out of `body` for the
  // success case. For a 400 drop, `body` is whatever error the server
  // returned — still useful so the caller can stop showing "pending" and
  // surface the failure instead of leaving it stuck forever.
  succeededResponses: { client_tx_id: string; body: any }[]
}

// Replays queued writes in creation order, one at a time. Stops on the
// first network/5xx failure (preserves ordering, avoids hammering a
// backend that's still down) — matches /sell's existing queue semantics.
// Drops an item on 400 (permanently invalid) same as /sell.
export async function replayOfflineQueue(ownerId: string, staffId: string): Promise<ReplayResult> {
  const db = await openOutboxDB()
  const items: OutboxItem[] = (await db.getAllFromIndex('outbox', 'by_owner', ownerId))
    .sort((a, b) => a.created_at.localeCompare(b.created_at))

  let succeeded = 0
  const succeededResponses: { client_tx_id: string; body: any }[] = []
  for (const item of items) {
    try {
      const res = await fetch(`${API}${item.endpoint}`, {
        method: item.method,
        headers: { 'Content-Type': 'application/json', 'x-owner-id': ownerId, 'x-staff-id': staffId },
        body: JSON.stringify(item.body),
      })
      if (res.ok || res.status === 400) {
        const body = await res.json().catch(() => null)
        succeededResponses.push({ client_tx_id: item.client_tx_id, body })
        await db.delete('outbox', item.client_tx_id)
        succeeded++
        continue
      }
      // 5xx — keep the item, bump attempts, stop (ordering + avoid hammering)
      await db.put('outbox', { ...item, attempts: item.attempts + 1, last_error: `HTTP ${res.status}` })
      break
    } catch (err: any) {
      await db.put('outbox', { ...item, attempts: item.attempts + 1, last_error: String(err?.message || err) })
      break
    }
  }

  const remaining = await getOutboxCount(ownerId)
  return { succeeded, remaining, succeededResponses }
}
