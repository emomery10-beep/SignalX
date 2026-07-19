'use client'
import { useState, useEffect } from 'react'

// ── Verticals Proof ───────────────────────────────────────────────────────────
// Surfaces the 6 real business-vertical pages (lib/pos-sectors.ts): retail,
// restaurant, repair, salon, factory, logistics — currently only linked in the
// footer. A grid of sector tiles with a spotlight that continuously cycles
// through them (always-on motion). Each links to its real /point-of-sale/[slug]
// page. Copy from landing.vert_* keys.

type Tc = (k: string, vars?: Record<string, string | number>) => string

const M = { bg: '#ffffff', tx: '#1A1410', tx2: '#4A4038', tx3: '#6b6560', acc: '#C97A44', accSoft: 'rgba(201,122,68,0.10)', bd: '#e4e0d8', card: '#fff' }

type Icon = 'retail' | 'restaurant' | 'repair' | 'salon' | 'factory' | 'logistics'
function SectorIcon({ name, c }: { name: Icon; c: string }) {
  const p = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: c, strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (name) {
    case 'retail':     return <svg {...p}><path d="M4 8h16l-1 12H5L4 8z"/><path d="M8 8a4 4 0 0 1 8 0"/></svg>
    case 'restaurant': return <svg {...p}><path d="M5 3v8a2 2 0 0 0 4 0V3M7 11v10"/><path d="M17 3c-1.5 1-2.5 3-2.5 5S15 12 17 12v9"/></svg>
    case 'repair':     return <svg {...p}><path d="M14.5 6.5a3.5 3.5 0 0 0-4.6 4.6L3 18l3 3 6.9-6.9a3.5 3.5 0 0 0 4.6-4.6l-2.3 2.3-2-2 2.3-2.3z"/></svg>
    case 'salon':      return <svg {...p}><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.5 8L20 19M8.5 16L20 5"/></svg>
    case 'factory':    return <svg {...p}><path d="M3 21V9l6 4V9l6 4V5l6 3v13H3z"/><path d="M8 21v-4M14 21v-4"/></svg>
    case 'logistics':  return <svg {...p}><path d="M3 6h11v9H3z"/><path d="M14 9h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/></svg>
  }
}

const SECTORS: { slug: string; icon: Icon; k: string }[] = [
  { slug: 'retail',     icon: 'retail',     k: 'retail' },
  { slug: 'restaurant', icon: 'restaurant', k: 'restaurant' },
  { slug: 'repair',     icon: 'repair',     k: 'repair' },
  { slug: 'salon',      icon: 'salon',      k: 'salon' },
  { slug: 'factory',    icon: 'factory',    k: 'factory' },
  { slug: 'logistics',  icon: 'logistics',  k: 'logistics' },
]

export default function VerticalsProof({ tc }: { tc: Tc }) {
  const [spot, setSpot] = useState(0)
  useEffect(() => {
    const iv = setInterval(() => setSpot(s => (s + 1) % SECTORS.length), 1500)
    return () => clearInterval(iv)
  }, [])

  return (
    <section style={{ padding: 'clamp(64px,9vw,112px) clamp(16px,4vw,40px)', background: M.bg }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }} data-reveal>
          <div style={{ display: 'inline-block', padding: '6px 14px', borderRadius: 9999, background: M.accSoft, color: M.acc, fontSize: 11, fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 20 }}>
            {tc('landing.vert_eyebrow')}
          </div>
          <h2 style={{ fontFamily: 'var(--font-instrument)', fontSize: 'clamp(28px,4.6vw,52px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-.02em', color: M.tx, margin: '0 0 18px' }}>
            {tc('landing.vert_title')} <em style={{ color: M.acc, fontStyle: 'italic' }}>{tc('landing.vert_title_accent')}</em>
          </h2>
          <p style={{ fontSize: 'clamp(16px,1.8vw,19px)', color: M.tx2, lineHeight: 1.65, maxWidth: 540, margin: '0 auto' }}>
            {tc('landing.vert_sub')}
          </p>
        </div>

        <div style={{ marginTop: 'clamp(36px,5vw,56px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 'clamp(12px,2vw,18px)' }} data-reveal data-reveal-delay="1">
          {SECTORS.map((s, z) => {
            const on = z === spot
            return (
              <a key={s.slug} href={`/point-of-sale/${s.slug}`} style={{
                display: 'block', textDecoration: 'none', borderRadius: 18, padding: 'clamp(16px,2.5vw,22px)',
                background: on ? M.card : '#fbf9f6', border: `1px solid ${on ? 'rgba(201,122,68,.32)' : M.bd}`,
                boxShadow: on ? '0 18px 40px -20px rgba(80,45,15,.3)' : 'none',
                transform: on ? 'translateY(-4px)' : 'translateY(0)',
                transition: 'transform .5s cubic-bezier(0.22,1,0.36,1), box-shadow .5s ease, background .5s ease, border-color .5s ease',
              }}>
                <span style={{ display: 'inline-flex', width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12,
                  background: on ? M.acc : M.accSoft, transition: 'background .5s ease' }}>
                  <SectorIcon name={s.icon} c={on ? '#fff' : M.acc} />
                </span>
                <div style={{ fontSize: 16, fontWeight: 700, color: M.tx, marginBottom: 4 }}>{tc(`landing.vert_${s.k}_name`)}</div>
                <div style={{ fontSize: 13, color: M.tx2, lineHeight: 1.5 }}>{tc(`landing.vert_${s.k}_desc`)}</div>
                <div style={{ marginTop: 12, fontSize: 12.5, fontWeight: 700, color: M.acc, opacity: on ? 1 : 0, transform: on ? 'translateX(0)' : 'translateX(-4px)', transition: 'opacity .4s ease, transform .4s ease' }}>
                  {tc('landing.vert_see')} →
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
