'use client'
import { useState, useEffect, useRef } from 'react'
import AnimatedNumber from '@/components/ui/AnimatedNumber'

// ── Forecast Proof ────────────────────────────────────────────────────────────
// Surfaces the built-in Forecasts (components/cfo/CfoForecasts.tsx) — real, and a
// Business-plan feature (stated honestly). Horizon tabs, a projected line with a
// best/worst confidence band, and a next-month + runway callout. The line draws
// itself in on scroll (static under reduced-motion). Copy from landing.fc_* keys.

type Tc = (k: string, vars?: Record<string, string | number>) => string

const M = { bg: '#FDFBF7', tx: '#1A1410', tx2: '#4A4038', tx3: '#6b6560', acc: '#C97A44', accSoft: 'rgba(201,122,68,0.10)', bd: '#e4e0d8', card: '#fff' }
const A = { ink: '#1a1916', muted: '#6b6760', surface: '#fff', border: '#e5e2dc', bg: '#f9f8f6', acc: '#d08a59', best: '#16a34a', worst: '#dc2626', grid: '#ece8e1' }

// normalized heights (0 bottom .. 1 top)
const HIST = [0.34, 0.44, 0.39, 0.56, 0.64]
const PROJ = [0.64, 0.75, 0.88]   // first point = last hist (continuous)
const BAND = 0.13

const W = 320, H = 150, PADX = 18, PADT = 16, PADB = 22
const N = HIST.length + PROJ.length - 1  // total x slots
const px = (i: number) => PADX + (i * (W - PADX * 2)) / (N - 1)
const py = (v: number) => PADT + (1 - v) * (H - PADT - PADB)
const line = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')

export default function ForecastProof({ tc }: { tc: Tc }) {
  const [drawn, setDrawn] = useState(false)
  const [reduced, setReduced] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Draws in when scrolled into view (the draw-in motion is the point).
  // Under prefers-reduced-motion, skips the wait and the transition — the chart
  // just appears already-drawn, statically, on first paint.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true)
      setDrawn(true)
      return
    }
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { setDrawn(true); io.disconnect() } }, { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const histPts = HIST.map((v, i) => [px(i), py(v)] as [number, number])
  const projPts = PROJ.map((v, i) => [px(HIST.length - 1 + i), py(v)] as [number, number])
  const upper = PROJ.map((v, i) => [px(HIST.length - 1 + i), py(Math.min(1, v + BAND))] as [number, number])
  const lower = PROJ.map((v, i) => [px(HIST.length - 1 + i), py(Math.max(0, v - BAND))] as [number, number])
  const bandPath = line([...upper, ...lower.slice().reverse()]) + ' Z'

  const tabs = ['fc_h_1m', 'fc_h_3m', 'fc_h_6m', 'fc_h_12m']

  return (
    <section style={{ padding: 'clamp(64px,9vw,112px) clamp(16px,4vw,40px)', background: M.bg }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 'clamp(32px,5vw,56px)', alignItems: 'center' }} className="fc-grid">

        {/* Header */}
        <div data-reveal>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            <span style={{ padding: '6px 14px', borderRadius: 9999, background: M.accSoft, color: M.acc, fontSize: 11, fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase' }}>{tc('landing.fc_eyebrow')}</span>
            <span style={{ padding: '6px 12px', borderRadius: 9999, background: M.accSoft, color: M.acc, fontSize: 11, fontWeight: 700 }}>{tc('landing.fc_plan')}</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-instrument)', fontSize: 'clamp(28px,4.4vw,50px)', fontWeight: 400, lineHeight: 1.06, letterSpacing: '-.02em', color: M.tx, margin: '0 0 18px' }}>
            {tc('landing.fc_title')} <em style={{ color: M.acc, fontStyle: 'italic' }}>{tc('landing.fc_title_accent')}</em>
          </h2>
          <p style={{ fontSize: 'clamp(15px,1.7vw,18px)', color: M.tx2, lineHeight: 1.65, maxWidth: 460 }}>
            {tc('landing.fc_sub')}
          </p>
        </div>

        {/* Forecast card */}
        <div ref={ref} style={{ justifySelf: 'center', width: '100%', maxWidth: 400 }} data-reveal data-reveal-delay="1">
          <div style={{ padding: 7, borderRadius: 24, background: M.accSoft, border: `1px solid ${M.bd}` }}>
            <div style={{ borderRadius: 18, background: A.surface, border: `1px solid ${A.border}`, boxShadow: '0 24px 60px -28px rgba(80,45,15,.26)', padding: 16, fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>

              {/* header + horizon tabs */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: A.ink }}>{tc('landing.fc_card_title')}</span>
                <div style={{ display: 'flex', gap: 3, background: A.bg, borderRadius: 8, padding: 3 }}>
                  {tabs.map((k, z) => (
                    <span key={z} style={{ padding: '3px 8px', borderRadius: 6, fontSize: 10.5, fontWeight: 700, background: z === 1 ? A.surface : 'transparent', color: z === 1 ? A.ink : A.muted, boxShadow: z === 1 ? '0 1px 3px rgba(0,0,0,.08)' : 'none' }}>{tc(`landing.${k}`)}</span>
                  ))}
                </div>
              </div>

              {/* chart */}
              <svg viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', width: '100%', height: 'auto' }}>
                {[0.25, 0.5, 0.75].map((g, z) => (
                  <line key={z} x1={PADX} x2={W - PADX} y1={py(g)} y2={py(g)} stroke={A.grid} strokeWidth="1" />
                ))}
                {/* confidence band */}
                <path d={bandPath} fill={A.acc} opacity={drawn ? 0.1 : 0} style={{ transition: reduced ? 'none' : 'opacity .6s cubic-bezier(0.22,1,0.36,1) .5s' }} />
                <path d={line(upper)} fill="none" stroke={A.best} strokeWidth="1.4" strokeDasharray="3 3" opacity={drawn ? 0.6 : 0} style={{ transition: reduced ? 'none' : 'opacity .5s cubic-bezier(0.22,1,0.36,1) .6s' }} />
                <path d={line(lower)} fill="none" stroke={A.worst} strokeWidth="1.4" strokeDasharray="3 3" opacity={drawn ? 0.55 : 0} style={{ transition: reduced ? 'none' : 'opacity .5s cubic-bezier(0.22,1,0.36,1) .6s' }} />
                {/* projected (dashed) then historical (solid), drawn via dashoffset */}
                <path d={line(projPts)} fill="none" stroke={A.acc} strokeWidth="2.4" strokeDasharray="6 4"
                  style={{ opacity: drawn ? 1 : 0, transition: reduced ? 'none' : 'opacity .3s cubic-bezier(0.22,1,0.36,1) .55s' }} />
                <path d={line(histPts)} fill="none" stroke={A.acc} strokeWidth="2.6" strokeLinecap="round"
                  pathLength={1} strokeDasharray={1} strokeDashoffset={drawn ? 0 : 1}
                  style={{ transition: reduced ? 'none' : 'stroke-dashoffset .9s cubic-bezier(0.22,1,0.36,1)' }} />
                {/* markers */}
                {histPts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.6" fill={A.acc} opacity={drawn ? 1 : 0} style={{ transition: reduced ? 'none' : `opacity .3s cubic-bezier(0.22,1,0.36,1) ${0.3 + i * 0.08}s` }} />)}
                <circle cx={projPts[projPts.length - 1][0]} cy={projPts[projPts.length - 1][1]} r="4" fill={A.acc} opacity={drawn ? 1 : 0} style={{ transition: reduced ? 'none' : 'opacity .3s cubic-bezier(0.22,1,0.36,1) 1.1s' }} />
              </svg>

              {/* callout */}
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <div style={{ flex: 1, background: A.bg, borderRadius: 12, padding: '10px 12px' }}>
                  <div style={{ fontSize: 10.5, color: A.muted, fontWeight: 600 }}>{tc('landing.fc_next_label')}</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: A.acc }}><AnimatedNumber value="KSh 142,000" /></div>
                </div>
                <div style={{ flex: 1, background: A.bg, borderRadius: 12, padding: '10px 12px' }}>
                  <div style={{ fontSize: 10.5, color: A.muted, fontWeight: 600 }}>{tc('landing.fc_runway_label')}</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: A.ink }}>{tc('landing.fc_runway_val')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`@media(min-width:880px){ .fc-grid{ grid-template-columns:1fr 400px !important; } }`}</style>
    </section>
  )
}
