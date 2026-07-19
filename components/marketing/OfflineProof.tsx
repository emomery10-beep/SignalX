'use client'
import { useState, useEffect, useRef } from 'react'

// ── Offline Proof ─────────────────────────────────────────────────────────────
// Shows the real offline behaviour: keep selling with no signal, sales queue on
// the phone, then sync the moment the network returns. Phone content uses the POS
// tokens; section chrome uses the warm coral-editorial language. Copy from
// landing.off_* keys. Toggles offline → synced on a loop; static under
// reduced-motion.

type Tc = (k: string, vars?: Record<string, string | number>) => string

const M = { bg: '#FDFBF7', tx: '#1A1410', tx2: '#4A4038', tx3: '#6b6560', acc: '#C97A44', accSoft: 'rgba(201,122,68,0.10)', bd: '#e4e0d8' }
const P = { bg: '#f9f8f6', surface: '#fff', border: '#e5e2dc', ink: '#1a1916', muted: '#6b6760', acc: '#d08a59', warning: '#f97316', warnPale: 'rgba(249,115,22,0.12)', success: '#16a34a', okPale: 'rgba(22,163,74,0.12)' }

const SALES = [
  { t: '13:04', a: 'KSh 260.00' },
  { t: '12:51', a: 'KSh 90.00' },
  { t: '12:38', a: 'KSh 540.00' },
]

function CloudOff({ c }: { c: string }) {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a5 5 0 0 1-1-9.9M15 9a5 5 0 0 0-9 1"/><path d="M2 2l20 20"/></svg>
}
function Check({ c }: { c: string }) {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
}

export default function OfflineProof({ tc }: { tc: Tc }) {
  const [online, setOnline] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  // Always animates once scrolled into view — toggles offline ↔ synced on a loop.
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    let iv: ReturnType<typeof setInterval> | null = null
    const io = new IntersectionObserver(es => {
      if (es.some(e => e.isIntersecting)) {
        io.disconnect()
        iv = setInterval(() => setOnline(o => !o), 2800)
      }
    }, { threshold: 0.4 })
    io.observe(el)
    return () => { io.disconnect(); if (iv) clearInterval(iv) }
  }, [])

  return (
    <section style={{ padding: 'clamp(64px,9vw,112px) clamp(16px,4vw,40px)', background: M.bg }}>
      <div ref={rootRef} style={{ maxWidth: 1040, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 'clamp(32px,5vw,56px)', alignItems: 'center' }} className="off-grid">

        {/* Header */}
        <div data-reveal>
          <div style={{ display: 'inline-block', padding: '6px 14px', borderRadius: 9999, background: M.accSoft, color: M.acc, fontSize: 11, fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 20 }}>
            {tc('landing.off_eyebrow')}
          </div>
          <h2 style={{ fontFamily: 'var(--font-instrument)', fontSize: 'clamp(28px,4.4vw,50px)', fontWeight: 400, lineHeight: 1.06, letterSpacing: '-.02em', color: M.tx, margin: '0 0 18px' }}>
            {tc('landing.off_title')} <em style={{ color: M.acc, fontStyle: 'italic' }}>{tc('landing.off_title_accent')}</em>
          </h2>
          <p style={{ fontSize: 'clamp(15px,1.7vw,18px)', color: M.tx2, lineHeight: 1.65, maxWidth: 460, marginBottom: 20 }}>
            {tc('landing.off_sub')}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['off_pt_0', 'off_pt_1', 'off_pt_2'].map((k, z) => (
              <div key={z} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: 7, background: M.accSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check c={M.acc} /></span>
                <span style={{ fontSize: 14.5, color: M.tx2 }}>{tc(`landing.${k}`)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Phone */}
        <div style={{ justifySelf: 'center', width: '100%', maxWidth: 288 }} data-reveal data-reveal-delay="1">
          <div style={{ padding: 10, borderRadius: 44, background: 'linear-gradient(160deg,#2a2622,#0f0d0b)', boxShadow: '0 30px 60px -20px rgba(80,45,15,.32), inset 0 1px 1px rgba(255,255,255,.14)' }}>
            <div style={{ borderRadius: 34, overflow: 'hidden', background: P.bg, aspectRatio: '9 / 19', display: 'flex', flexDirection: 'column' }}>

              {/* status bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px 6px', fontSize: 11, fontWeight: 700, color: P.ink }}>
                <span>13:05</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: online ? P.success : P.muted }}>
                  {online
                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={P.success} strokeWidth="2" strokeLinecap="round"><path d="M5 13a10 10 0 0 1 14 0M8.5 16.5a5 5 0 0 1 7 0M12 20h.01"/></svg>
                    : <CloudOff c={P.muted} />}
                </span>
              </div>

              {/* connection banner */}
              <div style={{ margin: '4px 12px', padding: '9px 12px', borderRadius: 11, display: 'flex', alignItems: 'center', gap: 8,
                background: online ? P.okPale : P.warnPale, transition: 'background .4s ease' }}>
                {online ? <Check c={P.success} /> : <CloudOff c={P.warning} />}
                <span style={{ fontSize: 11.5, fontWeight: 600, color: online ? P.success : P.warning, lineHeight: 1.3 }}>
                  {online ? tc('landing.off_banner_online') : tc('landing.off_banner_offline')}
                </span>
              </div>

              {/* today total */}
              <div style={{ padding: '10px 16px 6px' }}>
                <div style={{ fontSize: 10.5, color: P.muted, fontWeight: 600 }}>{tc('landing.off_today')}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: P.ink, letterSpacing: '-.01em' }}>KSh 890.00</div>
              </div>

              {/* queued sales */}
              <div style={{ flex: 1, padding: '4px 12px' }}>
                {SALES.map((s, k) => (
                  <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, background: P.surface, border: `1px solid ${P.border}`, borderRadius: 11, padding: '9px 12px', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: P.ink, minWidth: 34 }}>{s.t}</span>
                    <span style={{ flex: 1, fontSize: 12.5, fontWeight: 700, color: P.ink }}>{s.a}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 600, color: online ? P.success : P.muted, transition: 'color .4s ease' }}>
                      {online ? <Check c={P.success} /> : <CloudOff c={P.muted} />}
                      {online ? tc('landing.off_synced') : tc('landing.off_pending')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media(min-width:880px){ .off-grid{ grid-template-columns:1fr 288px !important; } }
      `}</style>
    </section>
  )
}
