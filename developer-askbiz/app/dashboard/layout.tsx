'use client'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const NAV = [
  { href: '/dashboard', label: 'Keys', icon: KeyIcon },
  { href: '/dashboard/apps', label: 'Apps', icon: AppIcon },
  { href: '/dashboard/usage', label: 'Usage', icon: ChartIcon },
  { href: '/dashboard/webhooks', label: 'Webhooks', icon: BoltIcon },
  { href: '/dashboard/charges', label: 'Charges', icon: CardIcon },
  { href: '/dashboard/connections', label: 'Connections', icon: LinkIcon },
  { href: '/dashboard/console', label: 'Console', icon: ConsoleIcon },
  { href: '/dashboard/docs', label: 'Docs', icon: DocIcon },
]

const focusRing = 'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-500'
const SIDEBAR_WIDTH = 240 // matches the main app's own sidebar spec (DESIGN.md) — same convention, dark-mode values

// Shared authenticated shell for every /dashboard/* page — Vercel-style
// left sidebar (per direct feedback on the original top-nav layout), same
// auth guard as before, now just laid out differently.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [checked, setChecked] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (cancelled) return
      if (!user) { router.push(`/signin?next=${encodeURIComponent(pathname)}`); return }
      setChecked(true)
    })
    return () => { cancelled = true }
  }, [pathname, router, supabase])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/signin')
  }

  if (!checked) {
    return <div className="min-h-screen flex items-center justify-center text-ink-300 text-sm">Loading…</div>
  }

  const navList = (
    <nav aria-label="Dashboard sections" className="flex-1 flex flex-col gap-1 px-3">
      {NAV.map(item => {
        const active = pathname === item.href
        const Icon = item.icon
        return (
          <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined}
            className={`flex items-center gap-2.5 px-3 py-3 rounded-md text-sm font-medium transition-colors ${focusRing} ${active ? 'bg-ink-700 text-ink-50' : 'text-ink-300 hover:text-ink-50 hover:bg-ink-800'}`}>
            <Icon className="w-4 h-4 flex-shrink-0" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="min-h-screen flex">
      {/* Mobile top bar — sidebar collapses behind a menu button below the
          sidebar's own breakpoint, per the product register's structural
          (not fluid) responsive guidance. */}
      <div className="md:hidden fixed top-0 inset-x-0 z-30 h-14 border-b border-ink-700 bg-ink-900 flex items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2 no-underline text-ink-50">
          <div className="w-6 h-6 rounded-md bg-signal-500 flex items-center justify-center text-ink-950 font-bold text-xs">A</div>
          <span className="font-display font-bold text-sm tracking-tight">AskBiz Developers</span>
        </Link>
        <button onClick={() => setMobileOpen(o => !o)} aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen}
          className={`p-2.5 rounded-md text-ink-200 hover:bg-ink-800 transition-colors ${focusRing}`}>
          {mobileOpen ? <CloseIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <button aria-label="Close menu" onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 z-20 bg-black/60" />
      )}

      <aside
        className={`fixed md:sticky top-0 md:top-0 h-dvh z-30 md:z-auto flex flex-col border-r border-ink-700 bg-ink-900 transition-transform md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: SIDEBAR_WIDTH }}>
        <div className="h-14 flex items-center px-4 border-b border-ink-700 flex-shrink-0 md:flex hidden">
          <Link href="/dashboard" className="flex items-center gap-2 no-underline text-ink-50">
            <div className="w-6 h-6 rounded-md bg-signal-500 flex items-center justify-center text-ink-950 font-bold text-xs">A</div>
            <span className="font-display font-bold text-sm tracking-tight">AskBiz Developers</span>
          </Link>
        </div>
        <div className="h-14 flex-shrink-0 md:hidden" aria-hidden="true" />
        <div className="flex-1 flex flex-col py-4 overflow-y-auto">
          {navList}
        </div>
        <div className="border-t border-ink-700 p-3 flex-shrink-0">
          <button onClick={handleSignOut}
            className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-md text-sm font-medium text-ink-300 hover:text-ink-50 hover:bg-ink-800 transition-colors ${focusRing}`}>
            <SignOutIcon className="w-4 h-4 flex-shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 px-4 md:px-8 py-8 pt-20 md:pt-8 max-w-4xl">
        {children}
      </main>
    </div>
  )
}

// Inline SVG icon set — no icon library dependency for six icons; stroke
// width/size kept consistent across all of them per the design system's
// icon-consistency rule.
function iconProps(className?: string) {
  return { className, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.75, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
}
function KeyIcon({ className }: { className?: string }) {
  return <svg {...iconProps(className)}><circle cx="8" cy="15" r="4" /><path d="M10.5 12.5L20 3M17 6l3 3M14 9l2 2" /></svg>
}
function AppIcon({ className }: { className?: string }) {
  return <svg {...iconProps(className)}><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></svg>
}
function ConsoleIcon({ className }: { className?: string }) {
  return <svg {...iconProps(className)}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 9l3 3-3 3M13 15h4" /></svg>
}
function ChartIcon({ className }: { className?: string }) {
  return <svg {...iconProps(className)}><path d="M4 20V10M12 20V4M20 20v-7" /></svg>
}
function BoltIcon({ className }: { className?: string }) {
  return <svg {...iconProps(className)}><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" /></svg>
}
function CardIcon({ className }: { className?: string }) {
  return <svg {...iconProps(className)}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18" /></svg>
}
function LinkIcon({ className }: { className?: string }) {
  return <svg {...iconProps(className)}><path d="M9 15l6-6M10 6l1-1a4 4 0 015.5 5.5l-1 1M14 18l-1 1A4 4 0 017.5 13.5l1-1" /></svg>
}
function DocIcon({ className }: { className?: string }) {
  return <svg {...iconProps(className)}><path d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></svg>
}
function SignOutIcon({ className }: { className?: string }) {
  return <svg {...iconProps(className)}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>
}
function MenuIcon({ className }: { className?: string }) {
  return <svg {...iconProps(className)}><path d="M4 6h16M4 12h16M4 18h16" /></svg>
}
function CloseIcon({ className }: { className?: string }) {
  return <svg {...iconProps(className)}><path d="M18 6L6 18M6 6l12 12" /></svg>
}
