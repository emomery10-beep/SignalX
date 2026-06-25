'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, notFound } from 'next/navigation'
import { POS_FEATURES } from '@/lib/pos-features'
import PosScreenMockup from '@/components/pos/PosScreenMockup'

const C = {
  bg: '#f9f8f6', sf: '#ffffff', ev: '#f3f2ef',
  tx: '#1a1916', tx2: '#6b6760', tx3: '#a39e97',
  b: 'rgba(0,0,0,.08)', b2: 'rgba(0,0,0,.14)',
  acc: '#d08a59',
}

export default function FeaturePageClient() {
  const params = useParams()
  const slug = typeof params.slug === 'string' ? params.slug : ''
  const feature = POS_FEATURES.find(f => f.slug === slug)

  const [pricing, setPricing] = useState<{ growth: string; pos: string } | null>(null)
  useEffect(() => {
    fetch('/api/geo').then(r => r.json()).then(d => {
      if (d.pricing) setPricing(d.pricing)
    }).catch(() => {})
  }, [])

  const posPrice = pricing?.pos || '£5'
  const growthPrice = pricing?.growth || '£19'

  if (!feature) {
    notFound()
  }

  const otherFeatures = POS_FEATURES.filter(f => f.slug !== slug).slice(0, 6)

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        .fade-up { animation: fadeUp .5s ease both }
        .card-hover { transition: transform 160ms ease, box-shadow 160ms ease }
        .card-hover:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,.06) }
        @media (max-width:767px) {
          .feature-hero-grid { grid-template-columns: 1fr !important }
          .details-grid { grid-template-columns: 1fr !important }
          .use-cases-grid { grid-template-columns: 1fr !important }
          .other-features-grid { grid-template-columns: 1fr 1fr !important }
        }
        @media (min-width:768px) and (max-width:1023px) {
          .details-grid { grid-template-columns: 1fr 1fr !important }
        }
      `}</style>

      {/* Nav */}
      <nav style={{ background: C.sf, borderBottom: `1px solid ${C.b}`, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 52 }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: C.acc, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="11" height="11" viewBox="0 0 32 32" fill="none"><rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.5"/><rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.75"/><rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/></svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 14, color: C.tx }}>AskBiz</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/point-of-sale#features" style={{ fontSize: 12, color: C.tx2, textDecoration: 'none' }}>← All features</Link>
          <a href="https://pos.askbiz.co" target="_blank" rel="noopener noreferrer" style={{ padding: '6px 14px', background: feature.color, color: '#fff', borderRadius: 7, fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
            Try free
          </a>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div style={{ background: C.sf, borderBottom: `1px solid ${C.b}`, padding: '8px 24px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: C.tx3 }}>
        <Link href="/" style={{ color: C.tx3, textDecoration: 'none' }}>Home</Link>
        <span>›</span>
        <Link href="/point-of-sale" style={{ color: C.tx3, textDecoration: 'none' }}>Point of Sale</Link>
        <span>›</span>
        <Link href="/point-of-sale#features" style={{ color: C.tx3, textDecoration: 'none' }}>Features</Link>
        <span>›</span>
        <span style={{ color: C.tx, fontWeight: 500 }}>{feature.title}</span>
      </div>

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${feature.color}08 0%, ${feature.color}03 100%)`, borderBottom: `1px solid ${feature.color}15`, padding: '48px 24px 56px' }}>
        <div style={{ maxWidth: 1020, margin: '0 auto' }}>
          <div className="fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: `${feature.color}12`, border: `1px solid ${feature.color}30`, borderRadius: 20, padding: '4px 12px', marginBottom: 14 }}>
            <span style={{ fontSize: 14 }}>{feature.icon}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: feature.color, textTransform: 'uppercase', letterSpacing: '.05em' }}>{feature.tag}</span>
          </div>
          <div className="feature-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              <h1 className="fade-up" style={{ fontSize: 'clamp(24px,4vw,38px)', fontWeight: 800, color: C.tx, lineHeight: 1.2, margin: '0 0 14px', letterSpacing: '-0.02em' }}>{feature.title}</h1>
              <p className="fade-up" style={{ fontSize: 16, color: C.tx2, lineHeight: 1.7, margin: '0 0 28px' }}>{feature.hero}</p>
              <div className="fade-up" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <a href="https://pos.askbiz.co" target="_blank" rel="noopener noreferrer" style={{ padding: '11px 24px', background: feature.color, color: '#fff', borderRadius: 9, fontSize: 14, fontWeight: 700, textDecoration: 'none', boxShadow: `0 4px 12px ${feature.color}35` }}>
                  Start free — {posPrice}/seat/mo
                </a>
                <Link href="/point-of-sale#features" style={{ padding: '11px 20px', background: C.sf, border: `1.5px solid ${C.b2}`, color: C.tx, borderRadius: 9, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
                  All features
                </Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 20 }}>
                {feature.benefits.map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: C.tx2 }}>
                    <span style={{ color: '#22c55e', fontWeight: 700 }}>✓</span> {b}
                  </div>
                ))}
              </div>
            </div>
            {/* Screen mockup */}
            <div className="fade-up" style={{ display: 'flex', justifyContent: 'center' }}>
              <PosScreenMockup screen={feature.screen} />
            </div>
          </div>
        </div>
      </section>

      {/* Details grid */}
      <section style={{ padding: '56px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: feature.color, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>{feature.tag} Feature</div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: C.tx, margin: '0 0 10px', letterSpacing: '-0.02em' }}>What's included</h2>
            <p style={{ fontSize: 14, color: C.tx2, maxWidth: 460, margin: '0 auto' }}>{feature.desc}</p>
          </div>
          <div className="details-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
            {feature.details.map((d, i) => (
              <div key={i} className="card-hover" style={{ background: C.sf, border: `1px solid ${C.b}`, borderRadius: 12, padding: '20px 18px' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{d.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.tx, marginBottom: 6 }}>{d.title}</div>
                <div style={{ fontSize: 12, color: C.tx2, lineHeight: 1.65 }}>{d.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section style={{ background: C.sf, borderTop: `1px solid ${C.b}`, borderBottom: `1px solid ${C.b}`, padding: '56px 24px' }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: C.tx, margin: 0, letterSpacing: '-0.02em' }}>Who uses this</h2>
          </div>
          <div className="use-cases-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {feature.useCases.map((uc, i) => (
              <div key={i} className="card-hover" style={{ background: `color-mix(in srgb, ${feature.color} 6%, ${C.bg})`, border: `1px solid ${C.b}`, borderRadius: 12, padding: '20px 20px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.tx, marginBottom: 8 }}>{uc.title}</div>
                <div style={{ fontSize: 12, color: C.tx2, lineHeight: 1.65 }}>{uc.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section style={{ padding: '56px 24px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', background: `linear-gradient(135deg, ${feature.color}10, ${feature.color}05)`, border: `1px solid ${feature.color}20`, borderRadius: 16, padding: '40px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>{feature.icon}</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: C.tx, margin: '0 0 10px', letterSpacing: '-0.02em' }}>Get {feature.title} today</h2>
          <p style={{ fontSize: 14, color: C.tx2, lineHeight: 1.65, margin: '0 0 24px' }}>
            Add the full Point of Sale to any AskBiz plan. <strong>{posPrice}/seat/month</strong> — works on any device. No hardware needed.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://pos.askbiz.co" target="_blank" rel="noopener noreferrer" style={{ padding: '12px 28px', background: feature.color, color: '#fff', borderRadius: 9, fontSize: 14, fontWeight: 700, textDecoration: 'none', boxShadow: `0 4px 12px ${feature.color}30` }}>
              Start free →
            </a>
            <Link href="/point-of-sale" style={{ padding: '12px 22px', background: C.sf, border: `1.5px solid ${C.b2}`, color: C.tx, borderRadius: 9, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
              See all plans
            </Link>
          </div>
          <p style={{ fontSize: 10, color: C.tx3, marginTop: 12 }}>Included from {growthPrice}/mo · No credit card to start</p>
        </div>
      </section>

      {/* Other features */}
      <section style={{ padding: '0 24px 72px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: C.tx, margin: '0 0 4px' }}>More features</h3>
            <p style={{ fontSize: 13, color: C.tx2, margin: 0 }}>Everything included in AskBiz PoS</p>
          </div>
          <div className="other-features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {otherFeatures.map(f => (
              <Link key={f.slug} href={`/point-of-sale/feature/${f.slug}`} style={{ textDecoration: 'none' }}>
                <div className="card-hover" style={{ background: C.sf, border: `1px solid ${C.b}`, borderRadius: 10, padding: '14px 16px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{f.icon}</span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.tx }}>{f.title}</span>
                      <span style={{ fontSize: 8, fontWeight: 700, color: f.color, background: `${f.color}12`, border: `1px solid ${f.color}25`, borderRadius: 3, padding: '1px 5px', textTransform: 'uppercase' }}>{f.tag}</span>
                    </div>
                    <div style={{ fontSize: 11, color: C.tx3, lineHeight: 1.5 }}>{f.desc.substring(0, 75)}…</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Link href="/point-of-sale#features" style={{ fontSize: 13, color: C.acc, textDecoration: 'none', fontWeight: 600 }}>View all 12 features →</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: C.sf, borderTop: `1px solid ${C.b}`, padding: '24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginBottom: 8 }}>
          <div style={{ width: 20, height: 20, borderRadius: 5, background: C.acc, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="8" height="8" viewBox="0 0 32 32" fill="none"><rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.5"/><rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.75"/><rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/></svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 13, color: C.tx }}>AskBiz</span>
        </div>
        <p style={{ fontSize: 11, color: C.tx3, margin: 0 }}>
          AI-powered business intelligence + Point of Sale · <Link href="/" style={{ color: C.tx3 }}>askbiz.co</Link>
        </p>
      </footer>
    </div>
  )
}
