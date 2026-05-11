import type { Metadata } from 'next'
import Link from 'next/link'
import { COMPARISONS } from '@/lib/comparisons-content'

export const metadata: Metadata = {
  title: 'AskBiz vs Competitors — Compare Business Intelligence Tools',
  description: 'See how AskBiz compares to Google Looker Studio, Power BI, Tableau, Metabase, Databox, and more — feature by feature, for SME founders.',
  alternates: { canonical: 'https://askbiz.co/vs' },
}

const ACC = '#d08a59'
const BG  = '#f9f8f6'
const SF  = '#ffffff'
const TX  = '#1a1916'
const TX2 = '#6b6760'
const TX3 = '#a39e97'
const BD  = '#e8e6e1'

export default function VsIndexPage() {
  return (
    <div style={{ fontFamily: 'DM Sans, system-ui', background: BG, minHeight: '100vh' }}>
      <style>{`
        .vs-card { transition: transform 140ms, box-shadow 140ms; text-decoration: none; }
        .vs-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.09) !important; }
      `}</style>

      <nav style={{ borderBottom: `1px solid ${BD}`, background: SF, padding: '0 clamp(16px,4vw,24px)', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: TX }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: ACC, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 32 32" fill="none">
              <rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.5"/>
              <rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.75"/>
              <rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'Sora, system-ui', fontSize: 15, fontWeight: 700, letterSpacing: '-.025em' }}>AskBiz</span>
        </Link>
        <Link href="/signin" style={{ fontSize: 13, fontWeight: 600, color: SF, background: ACC, borderRadius: 9999, padding: '7px 18px', textDecoration: 'none' }}>Try free →</Link>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(40px,5vw,72px) clamp(16px,4vw,32px)' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h1 style={{ fontFamily: 'Sora, system-ui', fontSize: 'clamp(26px,4vw,40px)', fontWeight: 700, color: TX, letterSpacing: '-.03em', marginBottom: 14 }}>
            AskBiz vs the alternatives
          </h1>
          <p style={{ fontSize: 16, color: TX2, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            See how AskBiz compares to the most popular business intelligence and dashboard tools — feature by feature, for SME founders.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 }}>
          {COMPARISONS.map(c => (
            <Link
              key={c.slug}
              href={`/vs/${c.slug}`}
              className="vs-card"
              style={{ background: SF, border: `1px solid ${BD}`, borderRadius: 14, padding: '24px 22px', display: 'block' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: ACC + '18', border: `1px solid ${ACC}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: ACC, fontFamily: 'Sora, system-ui' }}>A</div>
                <span style={{ fontSize: 16, color: TX3 }}>vs</span>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: c.theirColor + '18', border: `1px solid ${c.theirColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: c.theirColor, fontFamily: 'Sora, system-ui' }}>{c.competitor[0]}</div>
              </div>
              <div style={{ fontFamily: 'Sora, system-ui', fontSize: 15, fontWeight: 700, color: TX, marginBottom: 6 }}>AskBiz vs {c.competitor}</div>
              <p style={{ fontSize: 13, color: TX2, lineHeight: 1.55, marginBottom: 14 }}>{c.description.slice(0, 100)}…</p>
              <span style={{ fontSize: 12, color: ACC, fontWeight: 600 }}>See comparison →</span>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 64, padding: '32px', background: SF, border: `1px solid ${BD}`, borderRadius: 16, textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 22, fontWeight: 700, color: TX, marginBottom: 10 }}>Ready to see for yourself?</h2>
          <p style={{ fontSize: 14, color: TX2, marginBottom: 20 }}>Connect your first data source in under 10 minutes. No credit card required.</p>
          <Link href="/signin" style={{ fontSize: 14, fontWeight: 700, color: SF, background: ACC, borderRadius: 10, padding: '12px 28px', textDecoration: 'none', display: 'inline-block' }}>Start free trial →</Link>
        </div>
      </div>

      <footer style={{ borderTop: `1px solid ${BD}`, padding: '20px clamp(16px,4vw,32px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, background: SF }}>
        <span style={{ fontSize: 12, color: TX3 }}>© 2026 AskBiz Ltd. All rights reserved.</span>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          {([['/', 'Home'], ['/academy', 'Academy'], ['/help', 'Help'], ['/privacy', 'Privacy']] as [string, string][]).map(([href, label]) => (
            <Link key={href} href={href} style={{ fontSize: 12, color: TX3, textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
      </footer>
    </div>
  )
}
