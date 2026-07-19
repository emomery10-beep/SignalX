'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Logo from '@/components/Logo'

const focusRing = 'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-500'

// This layout's checks are a UX convenience only — the real authorization
// boundary is server-side, in the root app's app/api/admin/developers
// route (see lib/admin-auth.ts there). A non-admin who reaches this layout
// still gets a 401 from every fetch it makes; this just redirects them
// away cleanly instead of showing a broken, empty admin page.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const supabase = createClient()
  const [state, setState] = useState<'checking' | 'allowed' | 'denied'>('checking')

  useEffect(() => {
    let cancelled = false
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (cancelled) return
      if (!user) { router.push('/signin?next=/admin'); return }
      const res = await fetch('/api/admin/keys')
      if (cancelled) return
      setState(res.status === 401 ? 'denied' : 'allowed')
    })
    return () => { cancelled = true }
  }, [router, supabase])

  if (state === 'checking') {
    return <div className="min-h-screen flex items-center justify-center text-ink-300 text-sm">Checking access…</div>
  }

  if (state === 'denied') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-center px-4">
        <p className="text-ink-100 text-sm">This section isn&rsquo;t available on your account.</p>
        <Link href="/dashboard" className={`text-signal-300 text-sm underline underline-offset-2 ${focusRing}`}>Back to dashboard</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-ink-950">
      <header className="border-b border-ink-800">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo size={26} />
            <span className="font-display font-bold text-sm tracking-tight">AskBiz Developers — Admin</span>
          </div>
          <Link href="/dashboard" className={`px-3 py-2 rounded-md text-sm font-medium text-ink-300 hover:text-ink-50 hover:bg-ink-800 transition-colors ${focusRing}`}>
            ← Dashboard
          </Link>
        </div>
      </header>
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-6 py-8">{children}</main>
    </div>
  )
}
