import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Changelog | AskBiz',
  description: 'See what\'s new in AskBiz — product updates, improvements, and fixes.',
  alternates: { canonical: 'https://askbiz.co/changelog' },
}

const ACC  = '#d08a59'
const TX   = '#1a1916'
const TX2  = '#6b6760'
const TX3  = '#a39e97'
const BD   = '#e8e6e1'
const BG   = '#f9f8f6'
const SF   = '#ffffff'

type ChangeType = 'new' | 'improved' | 'fixed' | 'removed'

interface Change {
  type: ChangeType
  text: string
}

interface Release {
  version: string
  date: string
  summary: string
  changes: Change[]
}

const TYPE_STYLE: Record<ChangeType, { label: string; bg: string; color: string; border: string }> = {
  new:      { label: 'New',      bg: '#e8f5e9', color: '#2e7d32', border: '#a5d6a7' },
  improved: { label: 'Improved', bg: '#e3f2fd', color: '#1565c0', border: '#90caf9' },
  fixed:    { label: 'Fixed',    bg: '#fff8e1', color: '#e65100', border: '#ffcc80' },
  removed:  { label: 'Removed',  bg: '#fce4ec', color: '#880e4f', border: '#f48fb1' },
}

const RELEASES: Release[] = [
  {
    version: '2.10.0',
    date: '2026-05-16',
    summary: 'New free tools, case studies, industry benchmarks, geo-aware CTAs, and POS seat pricing on the landing page.',
    changes: [
      { type: 'new',      text: 'VAT Calculator — supports 30+ countries with auto-filled VAT rates and reverse VAT calculation' },
      { type: 'new',      text: 'Break-Even Calculator — 12 currencies, interactive chart, and what-if price scenarios' },
      { type: 'new',      text: 'Case Studies section — 6 real-world stories showing how SMEs use AskBiz across sectors' },
      { type: 'new',      text: 'SME Industry Benchmarks — compare margins, growth, AOV, and KPIs across 8 sectors (updated quarterly)' },
      { type: 'new',      text: 'Geo-aware CTAs — landing page adapts headline and promo for visitors from Singapore, Australia, Nigeria, and more' },
      { type: 'new',      text: 'African market promo banner — auto-surfaces ASKBIZ-AFRICA discount code for eligible countries' },
      { type: 'improved', text: 'Pricing section now shows explicit POS seat pricing (£5/seat/month add-on) on Growth and Business tiers' },
      { type: 'improved', text: 'Navigation mega-menu updated with Resources dropdown linking to all new sections' },
      { type: 'improved', text: 'Footer updated with Case Studies and Benchmarks links' },
      { type: 'improved', text: 'Sitemap expanded with all new routes for improved SEO coverage' },
    ],
  },
  {
    version: '2.9.0',
    date: '2026-05-12',
    summary: 'Introducing AskBiz POS — a fully integrated point of sale system with camera scanning, inventory management, staff roles, and real-time BI.',
    changes: [
      { type: 'new',      text: 'AskBiz POS — built-in point of sale system accessible from any smartphone or tablet' },
      { type: 'new',      text: 'Camera-based barcode and price tag scanning using your phone camera — no extra hardware needed' },
      { type: 'new',      text: 'Full checkout flow: scan, cart, payment (cash or card), and receipt in under 60 seconds' },
      { type: 'new',      text: 'WhatsApp receipt delivery — customers get digital proof of purchase instantly' },
      { type: 'new',      text: 'Staff management with role-based access (cashier and inventory roles) and magic link login' },
      { type: 'new',      text: 'Real-time inventory management with low-stock and out-of-stock alerts' },
      { type: 'new',      text: 'Full and partial refund handling with reason tracking and audit trail' },
      { type: 'new',      text: 'Transaction amendments and corrections with complete audit logging' },
      { type: 'new',      text: 'VAT calculation on every transaction with MTD-compatible digital record-keeping' },
      { type: 'new',      text: '30-day transaction export for accountants (CSV format)' },
      { type: 'new',      text: 'POS data feeds directly into dashboards, Daily Brief, Business Pulse, and AI chat' },
      { type: 'new',      text: 'Multi-location POS support with per-location staff, inventory, and reporting' },
      { type: 'new',      text: 'Offline mode — continue processing cash sales during brief internet outages' },
      { type: 'new',      text: '25 new Academy articles on POS and retail intelligence' },
      { type: 'new',      text: '22 new Help Centre articles including compliance guides (HMRC, GDPR, receipt law)' },
      { type: 'new',      text: '"Retail POS Mastery" learning path — from first sale to full intelligence' },
      { type: 'improved', text: 'Help Centre POS integration reference updated (previously CSV-only for Zettle/Square)' },
    ],
  },
  {
    version: '2.8.0',
    date: '2026-05-09',
    summary: 'Major help centre overhaul with contextual search, smart escalation, and an in-app help widget.',
    changes: [
      { type: 'new',      text: 'In-app floating help widget — contextual article suggestions based on current page' },
      { type: 'new',      text: 'Live search autocomplete with article title and topic suggestions' },
      { type: 'new',      text: 'Sidebar topic filter on the Help Centre' },
      { type: 'new',      text: 'CMD+K shortcut to focus the help search from anywhere' },
      { type: 'new',      text: '"New" badge on articles updated within the last 45 days' },
      { type: 'new',      text: 'Smart escalation after low-rating feedback — email, call booking, FAQ' },
      { type: 'new',      text: '"Not helpful" reason categories: Inaccurate, Outdated, Too technical, Missing info' },
      { type: 'new',      text: 'Article "last verified" badge showing review month and year' },
      { type: 'new',      text: 'Community section on help home: forum, support call, email, FAQ' },
      { type: 'new',      text: 'Status banner for incident announcements across all help pages' },
      { type: 'improved', text: 'Article reading progress bar and back-to-top button' },
      { type: 'improved', text: 'Click-to-copy on inline code snippets in articles' },
      { type: 'improved', text: 'Video embed support for articles with a video guide' },
      { type: 'improved', text: 'Print/PDF view hides navigation and sidebar for clean output' },
    ],
  },
  {
    version: '2.7.2',
    date: '2026-04-22',
    summary: 'Dashboard performance improvements and Shopify sync reliability fixes.',
    changes: [
      { type: 'improved', text: 'Dashboard load time reduced by ~40% for accounts with 3+ connected sources' },
      { type: 'improved', text: 'Shopify order sync now retries automatically on rate-limit errors' },
      { type: 'fixed',    text: 'Fixed a bug where revenue figures could show as $0 for the current day' },
      { type: 'fixed',    text: 'Resolved an issue with date filters not persisting across page refreshes' },
    ],
  },
  {
    version: '2.7.1',
    date: '2026-04-10',
    summary: 'Forecasting accuracy improvements and minor UI polish.',
    changes: [
      { type: 'improved', text: 'Forecasting model now incorporates seasonal trends for more accurate projections' },
      { type: 'improved', text: 'Ask AI now remembers context across follow-up questions in the same session' },
      { type: 'fixed',    text: 'Fixed export button not working on Firefox 124' },
      { type: 'fixed',    text: 'Resolved sidebar overlap on screens narrower than 375px' },
    ],
  },
  {
    version: '2.7.0',
    date: '2026-03-28',
    summary: 'Launched Business Tools v2 with new integrations and a redesigned tools sidebar.',
    changes: [
      { type: 'new',      text: 'Business Tools v2 — redesigned sidebar with search and favourites' },
      { type: 'new',      text: 'Xero integration now supports multi-currency accounts' },
      { type: 'new',      text: 'New "Profit Pulse" widget on the home dashboard' },
      { type: 'improved', text: 'Google Analytics integration now pulls session and conversion data' },
      { type: 'removed',  text: 'Removed legacy CSV importer — replaced by the new Data Import wizard' },
    ],
  },
  {
    version: '2.6.5',
    date: '2026-03-08',
    summary: 'Security updates and bug fixes.',
    changes: [
      { type: 'improved', text: 'Upgraded authentication library to address two low-severity CVEs' },
      { type: 'fixed',    text: 'Fixed chart tooltips disappearing on touch devices' },
      { type: 'fixed',    text: 'Resolved an issue where invited users could land on a blank screen after sign-up' },
    ],
  },
]

function TypeBadge({ type }: { type: ChangeType }) {
  const s = TYPE_STYLE[type]
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em',
      padding: '3px 10px', borderRadius: 6,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      flexShrink: 0, lineHeight: 1, display: 'inline-block', whiteSpace: 'nowrap',
    }}>
      {s.label}
    </span>
  )
}

export default function ChangelogPage() {
  return (
    <div style={{ fontFamily: 'DM Sans, system-ui', background: BG, minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{ borderBottom: `1px solid ${BD}`, background: SF, padding: '0 clamp(16px,4vw,24px)', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: TX }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: ACC, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="12" height="12" viewBox="0 0 32 32" fill="none">
              <rect x="3"  y="22" width="5" height="7"  rx="1.5" fill="white" opacity="0.5"/>
              <rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.75"/>
              <rect x="19" y="9"  width="5" height="20" rx="1.5" fill="white"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'Sora, system-ui', fontSize: 15, fontWeight: 700, letterSpacing: '-.025em' }}>AskBiz</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link href="/help" style={{ fontSize: 13, color: TX2, textDecoration: 'none', fontWeight: 500 }}>Help Centre</Link>
          <Link href="/signin" style={{ fontSize: 13, fontWeight: 600, color: SF, background: ACC, borderRadius: 9999, padding: '7px 18px', textDecoration: 'none' }}>Try free →</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: SF, borderBottom: `1px solid ${BD}`, padding: 'clamp(40px,6vw,72px) clamp(16px,6vw,80px)' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: ACC, textTransform: 'uppercase', letterSpacing: '.1em', margin: '0 0 12px' }}>Product updates</p>
          <h1 style={{ fontFamily: 'Sora, system-ui', fontSize: 'clamp(28px,4.5vw,42px)', fontWeight: 700, color: TX, margin: '0 0 14px', letterSpacing: '-.03em', lineHeight: 1.1 }}>
            Changelog
          </h1>
          <p style={{ fontSize: 16, color: TX2, margin: '0 0 24px', lineHeight: 1.7, maxWidth: 520 }}>
            New features, improvements, and fixes — updated with every release.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="mailto:hello@askbiz.co?subject=Changelog feedback" style={{ fontSize: 13, color: TX2, textDecoration: 'none', border: `1px solid ${BD}`, borderRadius: 8, padding: '8px 18px', fontWeight: 500, transition: 'border-color .15s' }}>
              Send feedback →
            </a>
            <Link href="/help" style={{ fontSize: 13, color: ACC, textDecoration: 'none', border: `1px solid ${ACC}`, borderRadius: 8, padding: '8px 18px', fontWeight: 600 }}>
              Help Centre →
            </Link>
          </div>
        </div>
      </div>

      {/* Releases */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: 'clamp(36px,5vw,64px) clamp(16px,4vw,24px)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {RELEASES.map((rel, i) => (
            <article key={rel.version} style={{
              background: SF,
              border: `1px solid ${i === 0 ? ACC : BD}`,
              borderRadius: 14,
              padding: 'clamp(20px,3vw,28px)',
              boxShadow: i === 0 ? `0 0 0 1px ${ACC}22, 0 4px 20px rgba(0,0,0,.06)` : '0 1px 4px rgba(0,0,0,.04)',
              position: 'relative',
            }}>
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
                <span style={{
                  fontFamily: 'Sora, system-ui', fontSize: 15, fontWeight: 700, color: TX, letterSpacing: '-.01em',
                }}>
                  v{rel.version}
                </span>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: TX3, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: TX3, fontWeight: 500 }}>
                  {new Date(rel.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                {i === 0 && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: SF, background: ACC,
                    padding: '3px 10px', borderRadius: 9999, letterSpacing: '.06em', textTransform: 'uppercase',
                    marginLeft: 'auto',
                  }}>
                    Latest
                  </span>
                )}
              </div>

              {/* Summary */}
              <p style={{ fontSize: 14, color: TX2, margin: '0 0 18px', lineHeight: 1.6 }}>
                {rel.summary}
              </p>

              {/* Changes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {rel.changes.map((c, j) => (
                  <div key={j} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    padding: '8px 12px',
                    background: BG,
                    borderRadius: 8,
                  }}>
                    <div style={{ paddingTop: 2, flexShrink: 0 }}>
                      <TypeBadge type={c.type} />
                    </div>
                    <span style={{ fontSize: 13, color: TX, lineHeight: 1.55, flex: 1 }}>{c.text}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 48, paddingTop: 28, borderTop: `1px solid ${BD}`, textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: TX3, margin: '0 0 12px' }}>
            Looking for older releases? <a href="mailto:hello@askbiz.co" style={{ color: ACC, textDecoration: 'none', fontWeight: 600 }}>Contact support</a>.
          </p>
          <Link href="/help" style={{ fontSize: 13, color: TX2, textDecoration: 'none' }}>← Back to Help Centre</Link>
        </div>
      </div>
    </div>
  )
}
