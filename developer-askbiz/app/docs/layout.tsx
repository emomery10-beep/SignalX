import Link from 'next/link'
import JsonLd from '@/components/docs/JsonLd'
import Logo from '@/components/Logo'
import { organizationAndWebsite } from '@/lib/schema'

const NAV = [
  { href: '/docs', label: 'Overview' },
  { href: '/docs/quickstart', label: 'Quickstart' },
  { href: '/docs/authentication', label: 'Authentication' },
  { href: '/docs/api-reference', label: 'API Reference' },
  { href: '/docs/starters', label: 'Starters' },
  { href: '/docs/guides', label: 'Guides' },
  { href: '/docs/faq', label: 'FAQ' },
  { href: '/docs/changelog', label: 'Changelog' },
  { href: '/pricing', label: 'Pricing' },
]

const focusRing = 'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-500'

// Public, unauthenticated shell for every /docs/* page — deliberately
// separate from app/dashboard/layout.tsx (which auth-gates and redirects to
// /signin). Evaluation-stage developers and search/AI crawlers must be able
// to read the full API reference without an account — see the DX research
// behind this: "no sandbox / can't evaluate without signing up" was a named
// adoption blocker.
export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-ink-950">
      <header className="border-b border-ink-800 sticky top-0 z-20 bg-ink-950/95 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/docs" className="flex items-center gap-2 no-underline text-ink-50">
            <Logo size={28} />
            <span className="font-display font-bold text-sm tracking-tight whitespace-nowrap">AskBiz Developers</span>
          </Link>
          <nav aria-label="Documentation" className="hidden md:flex items-center gap-1 overflow-x-auto">
            {NAV.map(item => (
              <Link key={item.href} href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium text-ink-300 hover:text-ink-50 hover:bg-ink-800 transition-colors whitespace-nowrap ${focusRing}`}>
                {item.label}
              </Link>
            ))}
          </nav>
          <Link href="/dashboard"
            className={`flex-shrink-0 px-4 py-2 rounded-md bg-signal-500 text-ink-950 text-sm font-semibold hover:bg-signal-400 transition-colors ${focusRing}`}>
            Dashboard
          </Link>
        </div>
        <nav aria-label="Documentation" className="md:hidden flex items-center gap-1 overflow-x-auto px-4 pb-3 -mt-1">
          {NAV.map(item => (
            <Link key={item.href} href={item.href}
              className={`px-3 py-1.5 rounded-md text-xs font-medium text-ink-300 hover:text-ink-50 hover:bg-ink-800 transition-colors whitespace-nowrap flex-shrink-0 ${focusRing}`}>
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-ink-800 mt-16">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 flex flex-wrap items-center justify-between gap-4 text-xs text-ink-400">
          <span>&copy; {new Date().getFullYear()} AskBiz Ltd.</span>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a href="https://askbiz.co" className="hover:text-signal-300 transition-colors">askbiz.co</a>
            <Link href="/docs/sitemap" className="hover:text-signal-300 transition-colors">Sitemap</Link>
            <a href="https://askbiz.co/rules/acceptable-use-policy" className="hover:text-signal-300 transition-colors">Acceptable use</a>
            <a href="https://askbiz.co/rules/prohibited-activities" className="hover:text-signal-300 transition-colors">Prohibited activities</a>
            <Link href="/docs/terms" className="hover:text-signal-300 transition-colors">Terms</Link>
            <Link href="/docs/privacy" className="hover:text-signal-300 transition-colors">Privacy</Link>
            <a href="https://askbiz.co/api/v1/openapi.json" className="hover:text-signal-300 transition-colors">openapi.json</a>
            <a href="mailto:hello@askbiz.co" className="hover:text-signal-300 transition-colors">Support: hello@askbiz.co</a>
          </div>
        </div>
      </footer>

      <JsonLd data={organizationAndWebsite()} />
    </div>
  )
}
