'use client'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const NAV = [
  { href: '/dashboard', label: 'Keys' },
  { href: '/dashboard/usage', label: 'Usage' },
  { href: '/dashboard/webhooks', label: 'Webhooks' },
  { href: '/dashboard/charges', label: 'Charges' },
  { href: '/dashboard/connections', label: 'Connections' },
  { href: '/dashboard/docs', label: 'Docs' },
]

const focusRing = 'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-500'

// Shared authenticated shell for every /dashboard/* page — the single auth
// guard now lives here instead of duplicated per-page (the original
// dashboard/page.tsx had its own inline check; every new page under this
// layout no longer needs to repeat it).
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    let cancelled = false
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (cancelled) return
      if (!user) { router.push(`/signin?next=${encodeURIComponent(pathname)}`); return }
      setChecked(true)
    })
    return () => { cancelled = true }
  }, [pathname, router, supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/signin')
  }

  if (!checked) {
    return <div className="min-h-screen flex items-center justify-center text-ink-300 text-sm">Loading…</div>
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-ink-700 bg-ink-900">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
          <Link href="/dashboard" className="flex items-center gap-2 no-underline text-ink-50">
            <div className="w-6 h-6 rounded-md bg-signal-500 flex items-center justify-center text-ink-950 font-bold text-xs">A</div>
            <span className="font-display font-bold text-sm tracking-tight">AskBiz Developers</span>
          </Link>
          <nav aria-label="Dashboard sections" className="flex items-center gap-1 flex-wrap">
            {NAV.map(item => {
              const active = pathname === item.href
              return (
                <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined}
                  className={`px-3 py-3 rounded-md text-xs font-medium transition-colors ${focusRing} ${active ? 'bg-ink-700 text-ink-50' : 'text-ink-300 hover:text-ink-50 hover:bg-ink-800'}`}>
                  {item.label}
                </Link>
              )
            })}
            <button onClick={handleSignOut}
              className={`ml-2 px-3 py-3 rounded-md text-xs font-medium text-ink-300 hover:text-ink-50 hover:bg-ink-800 transition-colors ${focusRing}`}>
              Sign out
            </button>
          </nav>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
