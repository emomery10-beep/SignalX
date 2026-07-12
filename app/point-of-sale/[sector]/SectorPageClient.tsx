'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, notFound } from 'next/navigation'
import { SECTORS } from '@/lib/pos-sectors'
import PosScreenMockup from '@/components/pos/PosScreenMockup'

type SectorScreen = 'retail' | 'restaurant' | 'repair' | 'salon' | 'factory' | 'logistics'
const SECTOR_SCREENS: Record<string, SectorScreen> = {
  retail: 'retail', restaurant: 'restaurant', repair: 'repair',
  salon: 'salon', factory: 'factory', logistics: 'logistics',
}

const C = {
  bg: '#f9f8f6', sf: '#ffffff', ev: '#f3f2ef',
  tx: '#1a1916', tx2: '#6b6760', tx3: '#a39e97',
  b: 'rgba(0,0,0,.08)', b2: 'rgba(0,0,0,.14)',
  acc: '#d08a59', accBg: 'rgba(208,138,89,.08)', accBdr: 'rgba(208,138,89,.25)',
}

export default function SectorPageClient() {
  const params = useParams()
  const sectorId = typeof params.sector === 'string' ? params.sector : ''
  const sector = SECTORS.find(s => s.id === sectorId)

  // Live pricing from /api/geo
  const [pricing, setPricing] = useState<{ growth: string; business: string; pos: string } | null>(null)
  useEffect(() => {
    fetch('/api/geo').then(r => r.json()).then(d => {
      if (d.pricing) setPricing(d.pricing)
    }).catch(() => {})
  }, [])

  const posPrice = pricing?.pos || '£5'
  const growthPrice = pricing?.growth || '£19'

  if (!sector) {
    notFound()
  }

  const otherSectors = SECTORS.filter(s => s.id !== sector.id)

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px) } to { opacity:1; transform:translateY(0) } }
        .fade-up { animation: fadeUp .5s ease both }
        .card-hover { transition: transform 180ms ease, box-shadow 180ms ease }
        .card-hover:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,.07) }
        .sector-link { transition: background 140ms ease, transform 120ms ease }
        .sector-link:hover { transform: translateY(-2px) }
        @media (max-width:767px) {
          .features-grid { grid-template-columns: 1fr !important }
          .workflow-grid { grid-template-columns: 1fr !important }
          .use-cases-grid { grid-template-columns: 1fr !important }
          .stats-grid { grid-template-columns: 1fr 1fr !important }
          .sectors-grid { grid-template-columns: 1fr 1fr !important }
          .hero-section { padding: 32px 20px 40px !important }
          .hero-title { font-size: 28px !important }
        }
        @media (min-width:768px) and (max-width:1023px) {
          .features-grid { grid-template-columns: 1fr 1fr !important }
          .use-cases-grid { grid-template-columns: 1fr 1fr !important }
          .sectors-grid { grid-template-columns: repeat(3, 1fr) !important }
        }
      `}</style>

      {/* Nav */}
      <nav style={{ background: C.sf, borderBottom: `1px solid ${C.b}`, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: C.acc, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 32 32" fill="none"><rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.5"/><rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.75"/><rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/></svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 13, color: C.tx }}>AskBiz</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/point-of-sale" style={{ fontSize: 11, color: C.tx2, textDecoration: 'none' }}>← All sectors</Link>
          <a href="https://pos.askbiz.co" target="_blank" rel="noopener noreferrer" style={{ padding: '6px 16px', background: sector.color, color: '#fff', borderRadius: 8, fontSize: 11, fontWeight: 600, textDecoration: 'none' }}>
            Try free
          </a>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div style={{ background: C.sf, borderBottom: `1px solid ${C.b}`, padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: C.tx3 }}>
        <Link href="/" style={{ color: C.tx3, textDecoration: 'none' }}>Home</Link>
        <span>›</span>
        <Link href="/point-of-sale" style={{ color: C.tx3, textDecoration: 'none' }}>Point of Sale</Link>
        <span>›</span>
        <span style={{ color: C.tx, fontWeight: 500 }}>{sector.label}</span>
      </div>

      {/* Hero */}
      <section className="hero-section" style={{ background: `linear-gradient(135deg, ${sector.color}08 0%, ${sector.color}04 100%)`, borderBottom: `1px solid ${sector.color}20`, padding: '56px 24px 64px', textAlign: 'center' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div className="fade-up" style={{ fontSize: 54, marginBottom: 12 }}>{sector.icon}</div>
          <div className="fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${sector.color}12`, border: `1px solid ${sector.color}30`, borderRadius: 20, padding: '4px 14px', marginBottom: 16 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: sector.color, display: 'inline-block' }}></span>
            <span style={{ fontSize: 10, fontWeight: 600, color: sector.color }}>AskBiz PoS — {sector.label}</span>
          </div>
          <h1 className="fade-up hero-title" style={{ fontSize: 34, fontWeight: 800, color: C.tx, lineHeight: 1.2, margin: '0 0 16px', letterSpacing: '-0.02em' }}>{sector.tagline}</h1>
          <p className="fade-up" style={{ fontSize: 15, color: C.tx2, lineHeight: 1.65, margin: '0 0 32px' }}>{sector.hero}</p>
          <div className="fade-up" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://pos.askbiz.co" target="_blank" rel="noopener noreferrer" style={{ padding: '12px 28px', background: sector.color, color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none', boxShadow: `0 4px 14px ${sector.color}40` }}>
              Start free — {posPrice}/seat/mo
            </a>
            <Link href="/point-of-sale#features" style={{ padding: '12px 24px', background: C.sf, border: `1.5px solid ${C.b2}`, color: C.tx, borderRadius: 10, fontSize: 12, fontWeight: 500, textDecoration: 'none' }}>
              See all features
            </Link>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section style={{ background: sector.color, padding: '24px 24px' }}>
        <div className="stats-grid" style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
          {sector.stats.map((stat, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '12px 8px', borderRight: i < sector.stats.length - 1 ? '1px solid rgba(255,255,255,.2)' : 'none' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{stat.value}</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,.75)', marginTop: 3 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '64px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: sector.color, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>Built for {sector.label}</div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: C.tx, margin: '0 0 12px', letterSpacing: '-0.02em' }}>Every feature your {sector.label.toLowerCase()} needs</h2>
            <p style={{ fontSize: 13, color: C.tx2, maxWidth: 520, margin: '0 auto' }}>{sector.desc}</p>
          </div>
          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {sector.features.map((f, i) => (
              <div key={i} className="card-hover" style={{ background: C.sf, border: `1px solid ${C.b}`, borderRadius: 12, padding: '20px 22px' }}>
                <div style={{ fontSize: 22, marginBottom: 10 }}>{f.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.tx, marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 11, color: C.tx2, lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screen mockup — "See it in action" */}
      {SECTOR_SCREENS[sector.id] && (
        <section style={{ background: '#1a1916', padding: '64px 24px' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: C.acc, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>Live preview</div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.02em' }}>See {sector.label} PoS in action</h2>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', maxWidth: 440, margin: '0 auto' }}>
                This is the real AskBiz PoS admin — {sector.label.toLowerCase()} operations at a glance.
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <PosScreenMockup screen={SECTOR_SCREENS[sector.id]} />
            </div>
            <div style={{ textAlign: 'center', marginTop: 28 }}>
              <a href="https://askbiz.co/pos" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', background: C.acc, color: '#fff', borderRadius: 9, fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>
                Open the live admin →
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Workflow */}
      <section style={{ background: C.sf, borderTop: `1px solid ${C.b}`, borderBottom: `1px solid ${C.b}`, padding: '64px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: sector.color, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>Workflow</div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: C.tx, margin: '0 0 12px', letterSpacing: '-0.02em' }}>How it works</h2>
          </div>
          <div className="workflow-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {sector.workflow.map((step, i) => (
              <div key={i} style={{ position: 'relative' }}>
                {i < sector.workflow.length - 1 && (
                  <div style={{ display: 'none' /* hidden on mobile */ }} />
                )}
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${sector.color}15`, border: `2px solid ${sector.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: sector.color }}>{step.step}</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.tx, marginBottom: 6 }}>{step.title}</div>
                <div style={{ fontSize: 11, color: C.tx2, lineHeight: 1.6 }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section style={{ padding: '64px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: C.tx, margin: '0 0 12px', letterSpacing: '-0.02em' }}>Who uses AskBiz for {sector.label.toLowerCase()}?</h2>
          </div>
          <div className="use-cases-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {sector.useCases.map((uc, i) => (
              <div key={i} className="card-hover" style={{ background: `color-mix(in srgb, ${sector.color} 6%, ${C.sf})`, border: `1px solid ${C.b}`, borderRadius: 12, padding: '22px 24px' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.tx, marginBottom: 8 }}>{uc.title}</div>
                <div style={{ fontSize: 11, color: C.tx2, lineHeight: 1.65 }}>{uc.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section style={{ background: `linear-gradient(135deg, ${sector.color}10, ${sector.color}05)`, border: `1px solid ${sector.color}20`, margin: '0 24px 64px', borderRadius: 16, padding: '48px 32px', maxWidth: 900, marginLeft: 'auto', marginRight: 'auto' }}>
        <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
          <div style={{ fontSize: 34, marginBottom: 12 }}>{sector.icon}</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: C.tx, margin: '0 0 12px', letterSpacing: '-0.02em' }}>Start your {sector.label.toLowerCase()} PoS today</h2>
          <p style={{ fontSize: 13, color: C.tx2, lineHeight: 1.65, margin: '0 0 28px' }}>
            Add the full Point of Sale to any AskBiz plan. <strong>{posPrice}/seat/month</strong> — works on any tablet, phone, or desktop. No proprietary hardware. Cancel anytime.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://pos.askbiz.co" target="_blank" rel="noopener noreferrer" style={{ padding: '13px 30px', background: sector.color, color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none', boxShadow: `0 4px 14px ${sector.color}35` }}>
              Start free →
            </a>
            <Link href="/point-of-sale" style={{ padding: '13px 24px', background: C.sf, border: `1.5px solid ${C.b2}`, color: C.tx, borderRadius: 10, fontSize: 12, fontWeight: 500, textDecoration: 'none' }}>
              Compare all plans
            </Link>
          </div>
          <p style={{ fontSize: 9, color: C.tx3, marginTop: 14 }}>Included in every plan from {growthPrice}/mo · No credit card required to start</p>
        </div>
      </section>

      {/* Other Sectors */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.tx2, marginBottom: 6 }}>More sectors</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: C.tx, margin: 0 }}>AskBiz PoS works for every type of business</h3>
          </div>
          <div className="sectors-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
            {otherSectors.map(s => (
              <Link key={s.id} href={`/point-of-sale/${s.id}`} style={{ textDecoration: 'none' }}>
                <div className="card-hover sector-link" style={{ background: C.sf, border: `1px solid ${C.b}`, borderRadius: 12, padding: '16px 14px', textAlign: 'center' }}>
                  <div style={{ fontSize: 26, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.tx, marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 9, color: C.tx3, lineHeight: 1.5 }}>{s.tagline}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: C.sf, borderTop: `1px solid ${C.b}`, padding: '28px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: C.acc, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="9" height="9" viewBox="0 0 32 32" fill="none"><rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.5"/><rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.75"/><rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/></svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 12, color: C.tx }}>AskBiz</span>
        </div>
        <p style={{ fontSize: 10, color: C.tx3, margin: 0 }}>
          Camera-first Point of Sale + daily business tracker for African market stalls and small shops · <Link href="/" style={{ color: C.tx3 }}>askbiz.co</Link>
        </p>
      </footer>
    </div>
  )
}
