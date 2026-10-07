'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Retired destination. The pre-payment setup wizard (and its free-trial claim)
// was replaced by first-run setup on /pos itself — see app/(app)/pos/page.tsx.
// This stub only exists so old bookmarks, emails and the voice-navigation
// route (lib/voiceRoutes.ts) land on /pos instead of a 404.
export default function PosSetupRedirect() {
  const router = useRouter()
  useEffect(() => { router.replace('/pos') }, [router])
  return null
}
