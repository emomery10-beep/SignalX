import Link from 'next/link'
import Logo from './Logo'

const focusRing = 'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-500'

const NAV = [
  { href: '/docs', label: 'Docs' },
  { href: '/docs/api-reference', label: 'API Reference' },
  { href: '/academy', label: 'Academy' },
  { href: '/help', label: 'Help' },
  { href: '/pricing', label: 'Pricing' },
]

// Shared top bar for every public surface (home, docs, help, academy) — one
// definition so nav links and header styling can't drift between sections.
export default function PublicHeader({ current }: { current?: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-ink-950/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 no-underline text-ink-50 flex-shrink-0">
          <Logo size={26} />
          <span className="font-display font-bold text-sm tracking-tight whitespace-nowrap">AskBiz Developers</span>
        </Link>
        <nav aria-label="Primary" className="hidden md:flex items-center gap-1 overflow-x-auto">
          {NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={current === item.href ? 'page' : undefined}
              className={`px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-300 ${focusRing} ${
                current === item.href ? 'text-ink-50 bg-white/[0.06]' : 'text-ink-300 hover:text-ink-50 hover:bg-white/[0.04]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/signin"
          className={`flex-shrink-0 px-4 py-2 rounded-full bg-signal-500 text-ink-950 text-sm font-semibold hover:bg-signal-400 transition-colors duration-300 ${focusRing}`}
        >
          Sign in
        </Link>
      </div>
      <nav aria-label="Primary" className="md:hidden flex items-center gap-1 overflow-x-auto px-4 pb-3 -mt-1">
        {NAV.map(item => (
          <Link key={item.href} href={item.href}
            className={`px-3 py-1.5 rounded-full text-xs font-medium text-ink-300 hover:text-ink-50 hover:bg-white/[0.05] transition-colors whitespace-nowrap flex-shrink-0 ${focusRing}`}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
