import Link from 'next/link'
import { t as catalogT } from '@/lib/i18n-catalog'
import { DEFAULT_LOCALE, localePath } from '@/lib/i18n-locale'

const ACC = '#d08a59'
const BG  = '#f9f8f6'
const SF  = '#ffffff'
const TX  = '#1a1916'
const TX2 = '#6b6760'
const TX3 = '#a39e97'
const BD  = '#e8e6e1'

const QUICK_LINKS = [
  { href: '/help',          key: 'help_centre',   icon: '❓' },
  { href: '/academy',       key: 'academy',       icon: '🎓' },
  { href: '/blog',          key: 'blog',          icon: '📝' },
  { href: '/integrations',  key: 'integrations',  icon: '🔌' },
  { href: '/pricing',       key: 'pricing',       icon: '💳' },
  { href: '/free-tools',    key: 'free_tools',    icon: '🛠️' },
]

export default function NotFound() {
  // Next.js renders the root not-found.tsx eagerly on EVERY request (it's the
  // NotFoundBoundary's fallback prop, ready in case a deeper notFound() ever
  // fires) — not just on actual 404s. So a headers()/cookies() call here
  // (getLocale()/getT() used to wrap headers()) marks EVERY route in the app
  // as having used a dynamic API. That's invisible for fully static/prerendered
  // routes, but for a route using on-demand ISR fallback (dynamicParams=true
  // with generateStaticParams() not covering every path — e.g. blog/[slug])
  // it contradicts that route's build-time static classification and Next
  // hard-crashes with "Page changed from static to dynamic at runtime, reason:
  // headers" on every request that isn't already cached. Locale is hardcoded
  // for the same reason app/layout.tsx hardcodes it (see that file's comment).
  const locale = DEFAULT_LOCALE
  const t = (key: string, vars?: Record<string, string | number>) => catalogT(locale, key, vars)
  return (
    <div style={{ fontFamily: 'DM Sans, system-ui', background: BG, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ borderBottom: `1px solid ${BD}`, background: SF, padding: '0 clamp(16px,4vw,24px)', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: TX }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: ACC, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 32 32" fill="none"><g fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 11 V5 H11"/><path d="M21 5 H27 V11"/><path d="M5 21 V27 H11"/><path d="M27 21 V27 H21"/></g><circle cx="16" cy="16" r="2.6" fill="white"/></svg>
          </div>
          <span style={{ fontFamily: 'Sora, system-ui', fontSize: 13, fontWeight: 700, letterSpacing: '-.025em' }}>AskBiz</span>
        </Link>
        <Link href={localePath('/signin', locale)} style={{ fontSize: 11, fontWeight: 600, color: SF, background: ACC, borderRadius: 9999, padding: '7px 18px', textDecoration: 'none' }}>{t('nav.try_free')} →</Link>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(40px,6vw,80px) clamp(16px,4vw,32px)' }}>
        <div style={{ textAlign: 'center', maxWidth: 560 }}>
          <div style={{ fontFamily: 'Sora, system-ui', fontSize: 'clamp(64px,10vw,120px)', fontWeight: 700, color: BD, lineHeight: 1, marginBottom: 16 }}>404</div>
          <h1 style={{ fontFamily: 'Sora, system-ui', fontSize: 'clamp(20px,3vw,28px)', fontWeight: 700, color: TX, letterSpacing: '-.025em', marginBottom: 12 }}>
            {t('errors.not_found_title')}
          </h1>
          <p style={{ fontSize: 13, color: TX2, lineHeight: 1.7, marginBottom: 36 }}>
            {t('errors.not_found_body')}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12, marginBottom: 36 }}>
            {QUICK_LINKS.map(link => (
              <Link
                key={link.href}
                href={localePath(link.href, locale)}
                style={{ background: SF, border: `1px solid ${BD}`, borderRadius: 12, padding: '16px 14px', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: TX, transition: 'border-color 150ms' }}
              >
                <span style={{ fontSize: 22 }}>{link.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: TX2 }}>{t('nav.' + link.key)}</span>
              </Link>
            ))}
          </div>

          <Link href={localePath('/', locale)} style={{ fontSize: 12, fontWeight: 700, color: SF, background: ACC, borderRadius: 10, padding: '12px 28px', textDecoration: 'none', display: 'inline-block' }}>
            ← {t('errors.back_home')}
          </Link>
        </div>
      </div>

      <footer style={{ borderTop: `1px solid ${BD}`, padding: '16px clamp(16px,4vw,32px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, background: SF }}>
        <span style={{ fontSize: 10, color: TX3 }}>© 2026 AskBiz Ltd.</span>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {([['/', 'home'], ['/help', 'help'], ['/privacy', 'privacy']] as [string, string][]).map(([href, key]) => (
            <Link key={href} href={localePath(href, locale)} style={{ fontSize: 10, color: TX3, textDecoration: 'none' }}>{t('nav.' + key)}</Link>
          ))}
        </div>
      </footer>
    </div>
  )
}
