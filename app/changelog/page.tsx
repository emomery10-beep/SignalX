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
      fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em',
      padding: '2px 8px', borderRadius: 9999,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      flexShrink: 0,
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
      <div style={{ background: SF, borderBottom: `1px solid ${BD}`, padding: 'clamp(32px,5vw,56px) clamp(16px,6vw,80px)' }}>
        <div style={{ maxWidth: 720 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: ACC, textTransform: 'uppercase', letterSpacing: '.1em', margin: '0 0 10px' }}>Product updates</p>
          <h1 style={{ fontFamily: 'Sora, system-ui', fontSize: 'clamp(26px,4vw,38px)', fontWeight: 700, color: TX, margin: '0 0 12px', letterSpacing: '-.025em', lineHeight: 1.15 }}>
            Changelog
          </h1>
          <p style={{ fontSize: 15, color: TX2, margin: '0 0 20px', lineHeight: 1.65, maxWidth: 560 }}>
            New features, improvements, and fixes — updated with every release.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="mailto:hello@askbiz.co?subject=Changelog feedback" style={{ fontSize: 13, color: TX2, textDecoration: 'none', border: `1px solid ${BD}`, borderRadius: 8, padding: '7px 16px', fontWeight: 500 }}>
              Send feedback →
            </a>
            <Link href="/help" style={{ fontSize: 13, color: ACC, textDecoration: 'none', border: `1px solid ${ACC}`, borderRadius: 8, padding: '7px 16px', fontWeight: 600 }}>
              Help Centre →
            </Link>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 'clamp(32px,5vw,56px) clamp(16px,4vw,24px)' }}>
        {RELEASES.map((rel, i) => (
          <div key={rel.version} style={{ display: 'flex', gap: 28, marginBottom: i < RELEASES.length - 1 ? 52 : 0 }}>
            {/* Date column */}
            <div style={{ width: 100, flexShrink: 0, paddingTop: 4, textAlign: 'right' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: TX, fontFamily: 'Sora, system-ui' }}>
                {new Date(rel.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
              <div style={{ fontSize: 11, color: TX3, marginTop: 2 }}>v{rel.version}</div>
            </div>

            {/* Timeline line + dot */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24, flexShrink: 0 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: i === 0 ? ACC : BD, border: `2px solid ${i === 0 ? ACC : TX3}`, flexShrink: 0, marginTop: 4 }} />
              {i < RELEASES.length - 1 && (
                <div style={{ width: 2, flex: 1, background: BD, marginTop: 6 }} />
              )}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0, paddingBottom: 8 }}>
              <div style={{ background: SF, border: `1px solid ${BD}`, borderRadius: 12, padding: '20px 22px', boxShadow: i === 0 ? '0 2px 12px rgba(0,0,0,.06)' : 'none' }}>
                {i === 0 && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: SF, background: ACC, padding: '2px 9px', borderRadius: 9999, letterSpacing: '.06em', textTransform: 'uppercase', display: 'inline-block', marginBottom: 10 }}>
                    Latest
                  </span>
                )}
                <p style={{ fontSize: 14, color: TX2, margin: '0 0 16px', lineHeight: 1.55 }}>{rel.summary}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {rel.changes.map((c, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <TypeBadge type={c.type} />
                      <span style={{ fontSize: 14, color: TX, lineHeight: 1.5, flex: 1 }}>{c.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Footer note */}
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: `1px solid ${BD}`, textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: TX3, margin: '0 0 12px' }}>
            Looking for older releases? <a href="mailto:hello@askbiz.co" style={{ color: ACC, textDecoration: 'none', fontWeight: 600 }}>Contact support</a>.
          </p>
          <Link href="/help" style={{ fontSize: 13, color: TX2, textDecoration: 'none' }}>← Back to Help Centre</Link>
        </div>
      </div>
    </div>
  )
}
