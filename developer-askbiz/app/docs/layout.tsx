import Link from 'next/link'
import JsonLd from '@/components/docs/JsonLd'
import PublicHeader from '@/components/PublicHeader'
import PublicFooter from '@/components/PublicFooter'
import GlowField from '@/components/ui/GlowField'
import { organizationAndWebsite } from '@/lib/schema'

const DOCS_NAV = [
  { href: '/docs', label: 'Overview' },
  { href: '/docs/quickstart', label: 'Quickstart' },
  { href: '/docs/authentication', label: 'Authentication' },
  { href: '/docs/api-reference', label: 'API Reference' },
  { href: '/docs/starters', label: 'Starters' },
  { href: '/docs/guides', label: 'Guides' },
  { href: '/docs/faq', label: 'FAQ' },
  { href: '/docs/changelog', label: 'Changelog' },
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
    <div className="min-h-screen flex flex-col bg-ink-950 relative">
      <GlowField />
      <PublicHeader current="/docs" />

      <nav aria-label="Documentation" className="relative z-10 border-b border-white/[0.06] bg-ink-950/60">
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex items-center gap-1 overflow-x-auto py-2.5">
          {DOCS_NAV.map(item => (
            <Link key={item.href} href={item.href}
              className={`px-3 py-1.5 rounded-full text-xs font-medium text-ink-300 hover:text-ink-50 hover:bg-white/[0.05] transition-colors whitespace-nowrap flex-shrink-0 ${focusRing}`}>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <main className="flex-1 relative z-10">{children}</main>

      <PublicFooter variant="docs" />

      <JsonLd data={organizationAndWebsite()} />
    </div>
  )
}
