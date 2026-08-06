'use client'
import { useState, useEffect } from 'react'

// Structurally compatible with PosAuthSession (which has `.headers` plus
// other fields this hook doesn't need) — loosened so pages with their own
// hand-rolled staff-header state (e.g. retail/*) can pass a plain
// `{ headers }` object instead of a full PosAuthSession.
export interface PosConfigSession {
  headers: Record<string, string>
}

export interface PosConfig {
  currency_symbol: string | null
  business_type: string | null
  business_name: string | null
  staff_sector: string | null
}

const CACHE_KEY = 'pos_config_v1'

/**
 * Shared /api/pos/config fetch for sector pages.
 *
 * Two problems this fixes vs. every page fetching config itself with its
 * own `useState('£')`:
 *  1. Wrong currency: '£' is not a sensible universal default for a mostly
 *     African user base. /api/pos/config now derives+backfills a real
 *     currency from the signup phone when a profile has none, so the only
 *     remaining gap is the brief moment before the first fetch resolves —
 *     handled by (2).
 *  2. Flicker: each sector page (/restaurant, /restaurant/menu, ...) is a
 *     separate route that fully remounts on navigation, so a per-page
 *     useState reset to '£' and re-fetched every time, flashing the wrong
 *     value on every navigation. Caching the last-known config in
 *     sessionStorage and hydrating from it synchronously on mount means
 *     only the very first load of a session shows a blank symbol while it
 *     resolves — every navigation after that is correct on first paint.
 */
export function usePosConfig(session: PosConfigSession | null, ready: boolean): { config: PosConfig | null; sym: string } {
  const [config, setConfig] = useState<PosConfig | null>(() => {
    if (typeof window === 'undefined') return null
    try {
      const raw = sessionStorage.getItem(CACHE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })

  // Keyed on a stringified snapshot of the headers, not the session object's
  // reference — some callers (e.g. retail/* pages using a hand-rolled
  // `{ headers: staffHeaders }`) pass a literal that's recreated every
  // render, which would otherwise re-fire this effect (and re-hit the
  // backfill write in /api/pos/config) on every unrelated re-render.
  const headersKey = session ? JSON.stringify(session.headers) : ''

  useEffect(() => {
    if (!ready || !session) return
    fetch('/api/pos/config', { headers: session.headers })
      .then(r => r.json())
      .then((c: PosConfig) => {
        setConfig(c)
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(c)) } catch {}
      })
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, headersKey])

  return { config, sym: config?.currency_symbol || '' }
}
