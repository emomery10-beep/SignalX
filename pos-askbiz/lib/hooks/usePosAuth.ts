'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ensurePosSessionCookie } from '@/lib/pos-session'

export interface PosAuthSession {
  ownerId: string
  staffId?: string
  role: string
  name?: string
  isPin: boolean
  /** Pass these on every fetch to /api/pos/* when isPin=true */
  headers: Record<string, string>
}

/**
 * Unified auth hook for sector pages.
 * Accepts both PIN staff (localStorage) and Supabase owner sessions.
 * PIN staff takes priority so sector hub pages work for both staff and owner.
 */
export function usePosAuth(redirectTo = '/'): { session: PosAuthSession | null; ready: boolean } {
  const router = useRouter()
  const [session, setSession] = useState<PosAuthSession | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // 1. Try PIN staff session from localStorage
    try {
      const raw = localStorage.getItem('pos_staff')
      if (raw) {
        const s = JSON.parse(raw)
        if (s?.owner_id && s?.id) {
          ensurePosSessionCookie() // keep the edge-gate cookie alive while active
          setSession({
            ownerId: s.owner_id,
            staffId: s.id,
            role: s.role || 'cashier',
            name: s.name,
            isPin: true,
            headers: { 'x-owner-id': s.owner_id, 'x-staff-id': s.id },
          })
          setReady(true)
          return
        }
      }
    } catch {}

    // 2. Fall back to Supabase owner auth
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push(redirectTo); return }
      setSession({ ownerId: user.id, role: 'owner', isPin: false, headers: {} })
      setReady(true)
    })
  }, [])

  return { session, ready }
}
