'use client'
// ─────────────────────────────────────────────────────────────────────────────
// PREVIEW ONLY — renders real staff-facing pages (sell/inventory/dashboard/
// logistics) with a fake session and every /api/pos/* fetch intercepted, so
// clicking through the demo never reads or writes production Supabase data.
//
// Used exclusively by pos-askbiz/app/preview/**. Not imported by any real
// (non-preview) route.
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react'
import {
  type Sector, mulberry32, makeConfig, makeInventory, makeTransactions,
  makeServiceJobs, makeFactoryCaptures, makeParcels, makeTrucks, makeRoutes,
  makeBranches, makeTruckLocations, FIRST, LAST,
} from './preview-fixtures'

export interface PreviewStaffSession {
  id: string
  name: string
  role: string
  owner_id: string
  location_id: string
  currency_symbol: string
  business_type: Sector
}

const PREVIEW_OWNER_ID = 'owner-preview'
const PREVIEW_LOCATION_ID = 'loc-preview'

export function buildMockSession(role: string, sector: Sector = 'retail', name = 'Preview Staff'): PreviewStaffSession {
  return {
    id: `staff-preview-${role}`,
    name,
    role,
    owner_id: PREVIEW_OWNER_ID,
    location_id: PREVIEW_LOCATION_ID,
    currency_symbol: makeConfig(sector).currency_symbol,
    business_type: sector,
  }
}

/** Same identity key usePreviewHarness re-seeds on. Pass as `key={...}` on the
 *  dynamically-imported real page so it only remounts once the reseed lands. */
export function previewSessionKey(session: PreviewStaffSession): string {
  return `${session.role}:${session.business_type}`
}

function seedPosStaff(session: PreviewStaffSession) {
  localStorage.setItem('pos_staff', JSON.stringify(session))
}

function clearPreviewLocalStorage(session: PreviewStaffSession) {
  localStorage.removeItem('pos_staff')
  localStorage.removeItem(`pos_practice_done_${session.id}`)
  localStorage.removeItem(`pos_shift_${session.owner_id}_${session.id}`)
  localStorage.removeItem('pos_logistics_shift')
}

// ── Handler registry ── keyed "METHOD /api/pos/path" (path only, no query) ──
type Handler = (url: URL, init?: RequestInit) => any

function buildPreviewHandlers(session: PreviewStaffSession): Record<string, Handler> {
  const seed = mulberry32(1)() * 100000 | 0
  const inventory = makeInventory(session.business_type, seed)
  const transactions = makeTransactions(session.business_type, seed, session.id, session.name)
  const serviceJobs = makeServiceJobs(seed)
  const factoryCaptures = makeFactoryCaptures(seed)
  const branches = makeBranches(seed)
  const trucks = makeTrucks(seed)
  const routes = makeRoutes(seed, branches)
  const parcels = makeParcels(seed)
  const truckLocations = makeTruckLocations(seed, trucks)

  const config = makeConfig(session.business_type)

  return {
    'GET /api/pos/config': () => config,

    'GET /api/pos/inventory': () => ({ inventory, total: inventory.length }),
    'POST /api/pos/inventory': (_u, init) => {
      const body = init?.body ? JSON.parse(String(init.body)) : {}
      return { product: { id: `new-${Date.now() % 100000}`, stock_qty: 0, active: true, sector: session.business_type, ...body } }
    },
    'PATCH /api/pos/inventory': (_u, init) => {
      const body = init?.body ? JSON.parse(String(init.body)) : {}
      return { product: { ...inventory[0], ...body } }
    },

    'GET /api/pos/transactions': () => ({ transactions }),
    'POST /api/pos/transactions': () => ({ transaction_id: `txn-preview-${Date.now() % 100000}`, total: 0 }),

    'POST /api/pos/shift/open': () => ({
      success: true, shift_id: `shift-${Date.now() % 100000}`, cashier_id: session.id,
      opened_at: new Date().toISOString(), opening_balance: 0, status: 'open',
    }),
    'POST /api/pos/shift/close': () => ({
      success: true, shift_id: `shift-${Date.now() % 100000}`, closed_at: new Date().toISOString(),
      reconciliation: {
        opening_balance: 0, cash_sales: 0, expected_balance: 0, physical_count: 0,
        variance: 0, variance_percent: '0.0', status: 'balanced', variance_reason: null,
      },
      alerts: [],
    }),

    'GET /api/pos/service-jobs': () => ({ jobs: serviceJobs, total: serviceJobs.length }),
    'POST /api/pos/service-jobs': (_u, init) => {
      const body = init?.body ? JSON.parse(String(init.body)) : {}
      return { job: { id: `job-preview-${Date.now() % 100000}`, ticket_number: 'RPR-PREVIEW', status: 'intake', ...body } }
    },
    'PATCH /api/pos/service-jobs': (_u, init) => {
      const body = init?.body ? JSON.parse(String(init.body)) : {}
      return { job: { ...serviceJobs[0], ...body } }
    },

    'GET /api/pos/factory/capture': () => ({ captures: factoryCaptures, total: factoryCaptures.length }),
    'POST /api/pos/factory/capture': (_u, init) => {
      const body = init?.body ? JSON.parse(String(init.body)) : {}
      return { capture: { id: `cap-preview-${Date.now() % 100000}`, status: 'pending', ...body } }
    },
    'PATCH /api/pos/factory/capture': (_u, init) => {
      const body = init?.body ? JSON.parse(String(init.body)) : {}
      return { capture: { ...factoryCaptures[0], ...body } }
    },

    'GET /api/pos/parcels': () => ({ parcels }),
    'GET /api/pos/trucks': () => ({ trucks }),
    'GET /api/pos/routes': () => ({ routes }),
    'GET /api/pos/locations': () => ({ locations: branches }),
    'GET /api/pos/truck-locations': () => ({ locations: truckLocations }),
    'POST /api/pos/truck-locations': () => ({ location: truckLocations[0] }),
    'GET /api/pos/staff/list': () => ({
      staff: Array.from({ length: 4 }, (_, i) => ({ id: `driver-${i}`, name: `${FIRST[i]} ${LAST[i]}`, role: 'driver' })),
    }),
  }
}

// ── Fetch interception ─────────────────────────────────────────────────────
function normalizeUrl(input: RequestInfo | URL): string {
  if (typeof input === 'string') return input
  if (input instanceof URL) return input.toString()
  return (input as Request).url
}

function installFetchMock(handlers: Record<string, Handler>) {
  const original = window.fetch.bind(window)
  window.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const raw = normalizeUrl(input)
    if (!raw.includes('/api/pos/')) return original(input as any, init)

    let url: URL
    try { url = new URL(raw, window.location.origin) } catch { url = new URL(window.location.origin) }
    // Normalise absolute (http://localhost:3000/api/pos/x) and relative
    // (/api/pos/x) fetches to the same path key.
    const path = url.pathname.slice(url.pathname.indexOf('/api/pos'))
    const method = (init?.method || 'GET').toUpperCase()
    const handler = handlers[`${method} ${path}`]

    // Small realistic latency so loading states are visible in the demo.
    await new Promise(r => setTimeout(r, 120 + Math.random() * 180))

    const body = handler ? handler(url, init) : { success: true }
    return new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } })
  }) as typeof window.fetch

  return () => { window.fetch = original }
}

// ── Two-phase mount gate ── seeds localStorage + installs the fetch patch in
// an effect, then the wrapped real page is only ever mounted (via
// next/dynamic) once `ready` is true — guaranteeing its own mount-time
// auth-check effect runs in a LATER commit, after the seed is guaranteed to
// exist (child effects fire before parent effects in the same commit).
//
// `ready` is DERIVED (seededKey === sessionKey), not stored as its own
// boolean. This matters when the caller switches role/sector after the
// initial mount: an already-mounted real page never re-reads localStorage on
// its own (its auth-check effect only runs once, on mount), so simply
// reseeding storage wouldn't update it, and remounting it via a changing
// `key` prop would re-introduce the exact same ordering race — the new
// instance's effect could fire before the harness's re-seed effect, since
// child mount-effects run before parent effects in the same commit. Deriving
// `ready` this way makes it flip to `false` in the SAME render where
// session identity changes (no effect round-trip needed), so callers should
// pair it with `key={sessionKey}` on the wrapped component to force a clean
// remount only once the reseed has actually landed.
export function usePreviewHarness(session: PreviewStaffSession): boolean {
  const sessionKey = previewSessionKey(session)
  const [seededKey, setSeededKey] = useState<string | null>(null)

  useEffect(() => {
    seedPosStaff(session)
    const restore = installFetchMock(buildPreviewHandlers(session))
    setSeededKey(sessionKey)
    return () => { restore(); clearPreviewLocalStorage(session) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionKey])

  return seededKey === sessionKey
}
