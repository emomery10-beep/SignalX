'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { isPosSessionExpired, clearPosSession } from '@/lib/pos-session'

// Renders nothing — just polls for a shift-length (10h) session expiry
// across every POS page and forces a full sign-out + redirect to login
// when it's exceeded. Runs on mount, on an interval, and when the tab
// regains focus (catches a shift that ran long while the device was idle).
export default function PosSessionGuard() {
  const router = useRouter()
  const pathname = usePathname()

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
