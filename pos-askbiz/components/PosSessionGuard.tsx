'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { isPosSessionExpired, clearPosSession, TOKEN_KEY } from '@/lib/pos-session'

const API = process.env.NEXT_PUBLIC_API_URL || ''
const STAFF_TOKEN_HEADER = 'x-staff-token'

// Adds the signed staff token to every request that already carries x-staff-id (about 40 screens build
// those headers by hand), and, when such a request comes back 401, asks /api/pos/session whether the
// login itself is dead so the staff member is sent back to the PIN screen instead of seeing silent
// failures. A plain role-based 401 leaves the session alone. The token is only ever attached to requests
// that already identify a POS staff member, never to third-party calls.
function installStaffTokenFetch(onDead: () => void) {
  const w = window as any
  if (w.__posStaffTokenFetch) return
  w.__posStaffTokenFetch = true
  const orig = window.fetch.bind(window)
  let lastCheck = 0
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    let sentStaffId = false
    let token: string | null = null
    try {
      token = localStorage.getItem(TOKEN_KEY)
      const h = new Headers(init?.headers || (input instanceof Request ? input.headers : undefined))
      sentStaffId = h.has('x-staff-id')
      if (sentStaffId && token && !h.has(STAFF_TOKEN_HEADER)) {
        h.set(STAFF_TOKEN_HEADER, token)
        if (input instanceof Request) input = new Request(input, { headers: h })
        else init = { ...init, headers: h }
      }
    } catch { /* never block a request on this */ }
    const res = await orig(input, init)
    if (res.status === 401 && sentStaffId && Date.now() - lastCheck > 30_000) {
      lastCheck = Date.now()
      try {
        const h: Record<string, string> = {}
        const raw = JSON.parse(localStorage.getItem('pos_staff') || 'null')
        if (raw?.id && raw?.owner_id) { h['x-staff-id'] = raw.id; h['x-owner-id'] = raw.owner_id }
        if (token) h[STAFF_TOKEN_HEADER] = token
        const check = await orig(`${API}/api/pos/session`, { headers: h })
        if (check.status === 401) onDead()
      } catch { /* offline: leave the session alone */ }
    }
    return res
  }
}

// Renders nothing — just polls for a shift-length (10h) session expiry
// across every POS page and forces a full sign-out + redirect to login
// when it's exceeded. Runs on mount, on an interval, and when the tab
// regains focus (catches a shift that ran long while the device was idle).
export default function PosSessionGuard() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    installStaffTokenFetch(() => {
      if (!localStorage.getItem('pos_staff')) return
      clearPosSession()
      if (window.location.pathname !== '/') router.replace('/')
    })
  }, [router])

  useEffect(() => {
    const check = () => {
      if (!localStorage.getItem('pos_staff')) return
      if (isPosSessionExpired()) {
        clearPosSession()
        if (pathname !== '/') router.replace('/')
      }
    }
    check()
    const interval = setInterval(check, 60_000)
    document.addEventListener('visibilitychange', check)
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', check)
    }
  }, [pathname, router])

  return null
}
