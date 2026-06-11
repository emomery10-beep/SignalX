import type { Metadata } from 'next'
import Link from 'next/link'
import { INTEGRATIONS, INTEGRATION_CATEGORIES } from '@/lib/integrations-content'

export const metadata: Metadata = {
  title: 'Integrations — Connect Your Business Tools | AskBiz',
  description: 'AskBiz connects to Shopify, Amazon, Xero, QuickBooks, Stripe, Meta Ads, Google Ads, and more. See all integrations and connect your tools in minutes.',
  alternates: { canonical: 'https://askbiz.co/integrations' },
}

const ACC = '#d08a59'
const BG  = '#f9f8f6'
const SF  = '#ffffff'
const TX  = '#1a1916'
const TX2 = '#6b6760'
const TX3 = '#a39e97'
const BD  = '#e8e6e1'

export default function IntegrationsPage() {
  return (
    <div style={{ fontFamily: 'DM Sans, system-ui', background: BG, minHeight: '100vh' }}>
      <style>{`
        .int-card { transition: transform 140ms, box-shadow 140ms; }
        .int-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.09) !important; }
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

      {/* Hero — left-aligned, no pills */}
      <section style={{ background: SF, borderBottom: `1px solid ${BD}`, padding: 'clamp(40px,5vw,64px) clamp(16px,4vw,32px)' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: ACC, letterSpacing: '.16em', textTransform: 'uppercase', marginBottom: 14 }}>Integrations</p>
          <h1 style={{ fontFamily: 'Sora, system-ui', fontSize: 'clamp(26px,3.5vw,42px)', fontWeight: 700, color: TX, letterSpacing: '-.03em', marginBottom: 14, maxWidth: 560 }}>
            Your data, already connected.
          </h1>
          <p style={{ fontSize: 15, color: TX2, maxWidth: 480, lineHeight: 1.7, marginBottom: 0 }}>
            {INTEGRATIONS.length}+ integrations — eCommerce, accounting, ad networks, and payment processors. Connects in under 10 minutes. New platforms added every month.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 1060, margin: '0 auto', padding: 'clamp(40px,5vw,56px) clamp(16px,4vw,32px)' }}>

        {/* Popular */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 20, fontWeight: 700, color: TX, marginBottom: 20, letterSpacing: '-.02em' }}>Popular integrations</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {INTEGRATIONS.filter(i => i.popular).map(int => (
              <Link key={int.slug} href={`/integrations/${int.slug}`} className="int-card" style={{ background: SF, border: `1px solid ${BD}`, borderRadius: 14, padding: '22px 20px', textDecoration: 'none', display: 'block' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: int.color + '15', border: `1px solid ${int.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{int.icon}</div>
                  <div>
                    <div style={{ fontFamily: 'Sora, system-ui', fontSize: 15, fontWeight: 700, color: TX }}>{int.name}</div>
                    <div style={{ fontSize: 11, color: TX3, marginTop: 1 }}>{int.category}</div>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: TX2, lineHeight: 1.55, marginBottom: 12 }}>{int.description}</p>
                <span style={{ fontSize: 12, color: ACC, fontWeight: 600 }}>Learn more →</span>
              </Link>
            ))}
          </div>
        </div>

        {/* By category */}
        {INTEGRATION_CATEGORIES.map(cat => {
          const catIntegrations = INTEGRATIONS.filter(i => i.category.toLowerCase().replace(/ /g, '-') === cat.slug || i.category === cat.label)
          if (catIntegrations.length === 0) return null
          return (
            <div key={cat.slug} style={{ marginBottom: 48 }}>
              <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 17, fontWeight: 700, color: TX, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                {cat.icon} {cat.label}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
                {catIntegrations.map(int => (
                  <Link key={int.slug} href={`/integrations/${int.slug}`} className="int-card" style={{ background: SF, border: `1px solid ${BD}`, borderRadius: 12, padding: '18px 18px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 9, background: int.color + '15', border: `1px solid ${int.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{int.icon}</div>
                    <div>
                      <div style={{ fontFamily: 'Sora, system-ui', fontSize: 14, fontWeight: 700, color: TX, marginBottom: 3 }}>{int.name}</div>
                      <div style={{ fontSize: 12, color: TX3 }}>{int.metrics.slice(0, 2).join(' · ')}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}

        {/* Request */}
        <div style={{ background: SF, border: `1px solid ${BD}`, borderRadius: 16, padding: '32px', textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>🔌</div>
          <h3 style={{ fontFamily: 'Sora, system-ui', fontSize: 18, fontWeight: 700, color: TX, marginBottom: 8 }}>Don&apos;t see your tool?</h3>
          <p style={{ fontSize: 14, color: TX2, marginBottom: 20, maxWidth: 380, margin: '0 auto 20px' }}>We add new integrations every month. Request your tool and we&apos;ll prioritise based on demand.</p>
          <Link href="/help" style={{ fontSize: 13, fontWeight: 600, color: SF, background: ACC, borderRadius: 8, padding: '10px 22px', textDecoration: 'none', display: 'inline-block' }}>Request an integration</Link>
        </div>
      </div>

      <footer style={{ borderTop: `1px solid ${BD}`, padding: '20px clamp(16px,4vw,32px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, background: SF }}>
        <span style={{ fontSize: 12, color: TX3 }}>© 2026 AskBiz Ltd.</span>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          {([['/', 'Home'], ['/academy', 'Academy'], ['/help', 'Help'], ['/developers', 'API'], ['/privacy', 'Privacy']] as [string, string][]).map(([href, label]) => (
            <Link key={href} href={href} style={{ fontSize: 12, color: TX3, textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
      </footer>
    </div>
  )
}
