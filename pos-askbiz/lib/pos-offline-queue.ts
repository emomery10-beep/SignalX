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
const DB_VERSION = 2

// After this many consecutive 5xx/network failures on the SAME item, stop
// letting it block every item queued behind it — move it to a dead-letter
// store instead. This isn't the module guessing at status-code semantics
// (still only ever treats 5xx/network as retryable, 400 as a drop, per the
// convention above) — it's a circuit breaker for the case that convention
// doesn't cover: a route bug that returns 5xx for a payload that will NEVER
// succeed no matter how many times it's retried, which would otherwise jam
// this owner's entire outbox forever (every later-queued write silently
// stuck behind it, no visibility).
const MAX_ATTEMPTS = 10

let dbPromise: Promise<IDBPDatabase> | null = null

function openOutboxDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        let outbox
        if (oldVersion < 1) {
          outbox = db.createObjectStore('outbox', { keyPath: 'client_tx_id' })
          outbox.createIndex('by_owner', 'owner_id')
        }
        if (oldVersion < 2) {
          const deadLetter = db.createObjectStore('dead_letter', { keyPath: 'client_tx_id' })
          deadLetter.createIndex('by_owner', 'owner_id')
        }
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

// Dead-lettered items (see MAX_ATTEMPTS above) — a permanently-failing write
// that would otherwise block this owner's whole outbox forever. Surfaced
// separately so a UI can show "N writes need attention" distinctly from the
// normal "syncing…" pending count, instead of both looking identical.
export async function getDeadLetterItems(ownerId: string): Promise<OutboxItem[]> {
  const db = await openOutboxDB()
  return db.getAllFromIndex('dead_letter', 'by_owner', ownerId)
}

export async function getDeadLetterCount(ownerId: string): Promise<number> {
  const items = await getDeadLetterItems(ownerId)
  return items.length
}

// Moves an item back into the active outbox for one more attempt (e.g. after
// a staff member is told "this keeps failing" and a fix has since shipped).
// Resets attempts so it gets the full MAX_ATTEMPTS budget again.
export async function retryDeadLetterItem(clientTxId: string): Promise<void> {
  const db = await openOutboxDB()
  const item = await db.get('dead_letter', clientTxId)
  if (!item) return
  await db.put('outbox', { ...item, attempts: 0, last_error: undefined })
  await db.delete('dead_letter', clientTxId)
}

// Permanently discards a dead-lettered write (e.g. staff confirms it was a
// duplicate or is no longer needed) — never done automatically.
export async function discardDeadLetterItem(clientTxId: string): Promise<void> {
  const db = await openOutboxDB()
  await db.delete('dead_letter', clientTxId)
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
  // client_tx_ids moved to the dead-letter store this replay (hit
  // MAX_ATTEMPTS) — callers should surface these distinctly, not just fold
  // them into "remaining".
  deadLettered: string[]
}

// Replays queued writes in creation order, one at a time. Stops on the
// first network/5xx failure (preserves ordering, avoids hammering a
// backend that's still down) — matches /sell's existing queue semantics.
// Drops an item on 400 (permanently invalid) same as /sell. The one
// exception to "stop on first failure": an item that has now failed
// MAX_ATTEMPTS times is dead-lettered instead, and replay continues with
// the rest of the queue — otherwise a single permanently-broken item would
// block every later-queued write for this owner forever.
export async function replayOfflineQueue(ownerId: string, staffId: string): Promise<ReplayResult> {
  const db = await openOutboxDB()
  const items: OutboxItem[] = (await db.getAllFromIndex('outbox', 'by_owner', ownerId))
    .sort((a, b) => a.created_at.localeCompare(b.created_at))

  let succeeded = 0
  const succeededResponses: { client_tx_id: string; body: any }[] = []
  const deadLettered: string[] = []
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
      // 5xx — keep the item, bump attempts
      const attempts = item.attempts + 1
      const lastError = `HTTP ${res.status}`
      if (attempts >= MAX_ATTEMPTS) {
        await db.delete('outbox', item.client_tx_id)
        await db.put('dead_letter', { ...item, attempts, last_error: lastError })
        deadLettered.push(item.client_tx_id)
        continue // don't let this one block the rest of the queue
      }
      await db.put('outbox', { ...item, attempts, last_error: lastError })
      break // preserve ordering + avoid hammering a backend that's still down
    } catch (err: any) {
      const attempts = item.attempts + 1
      const lastError = String(err?.message || err)
      if (attempts >= MAX_ATTEMPTS) {
        await db.delete('outbox', item.client_tx_id)
        await db.put('dead_letter', { ...item, attempts, last_error: lastError })
        deadLettered.push(item.client_tx_id)
        continue
      }
      await db.put('outbox', { ...item, attempts, last_error: lastError })
      break
    }
  }

  const remaining = await getOutboxCount(ownerId)
  return { succeeded, remaining, succeededResponses, deadLettered }
}
