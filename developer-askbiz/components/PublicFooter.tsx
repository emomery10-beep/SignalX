import Link from 'next/link'

export default function PublicFooter({ variant = 'default' }: { variant?: 'default' | 'docs' }) {
  return (
    <footer className="relative z-10 border-t border-white/[0.06] mt-16">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 flex flex-wrap items-center justify-between gap-4 text-xs text-ink-400">
        <span>&copy; {new Date().getFullYear()} AskBiz Ltd.</span>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <a href="https://askbiz.co" className="hover:text-signal-300 transition-colors">askbiz.co</a>
          <Link href="/docs" className="hover:text-signal-300 transition-colors">Docs</Link>
          <Link href="/academy" className="hover:text-signal-300 transition-colors">Academy</Link>
          <Link href="/help" className="hover:text-signal-300 transition-colors">Help</Link>
          <Link href="/docs/changelog" className="hover:text-signal-300 transition-colors">Changelog</Link>
          <Link href="/docs/sitemap" className="hover:text-signal-300 transition-colors">Sitemap</Link>
          {variant === 'docs' && (
            <>
              <a href="https://askbiz.co/rules/acceptable-use-policy" className="hover:text-signal-300 transition-colors">Acceptable use</a>
              <a href="https://askbiz.co/rules/prohibited-activities" className="hover:text-signal-300 transition-colors">Prohibited activities</a>
              <a href="https://askbiz.co/api/v1/openapi.json" className="hover:text-signal-300 transition-colors">openapi.json</a>
            </>
          )}
          <Link href="/docs/terms" className="hover:text-signal-300 transition-colors">Terms</Link>
          <Link href="/docs/privacy" className="hover:text-signal-300 transition-colors">Privacy</Link>
          <a href="mailto:hello@askbiz.co" className="hover:text-signal-300 transition-colors">hello@askbiz.co</a>
        </div>
      </div>
    </footer>
  )
}
