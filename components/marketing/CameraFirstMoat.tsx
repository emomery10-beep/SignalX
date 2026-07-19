'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import CameraCheckoutDemo from '@/components/marketing/CameraCheckoutDemo'
import FlowScanDemo from '@/components/marketing/FlowScanDemo'

// ── Camera-First Moat ─────────────────────────────────────────────────────────
// The single most important section on the page: proves that AskBiz's camera is
// the primary input for the WHOLE business, not just checkout. A tap-to-switch
// filmstrip of real product screens (sell, stock, expenses, repair, deliveries),
// each captioned with what the camera actually does there. Gentle auto-advance,
// pausable, reduced-motion aware. All copy comes from `landing.moat_*` keys so it
// ships in the server HTML (crawler-visible) and localises into every locale.
//
// Design language matches DayInTheLife: warm coral editorial, Instrument Serif
// headings, inline styles. Device frame uses the nested "double-bezel" pattern
// (outer tray + inner screen) so the screenshot reads as physical hardware.

type Tc = (k: string, vars?: Record<string, string | number>) => string

const C = {
  bg:   '#FDFBF7',
  card: '#FFFFFF',
  tx:   '#1A1410',
  tx2:  '#4A4038',
  tx3:  '#6b6560',
  bd:   '#e4e0d8',
  acc:  '#C97A44',
  accSoft: 'rgba(201,122,68,0.10)',
}

type IconName = 'sell' | 'stock' | 'expense' | 'repair' | 'parcel' | 'lens'

function Icon({ name, size = 20, stroke = 1.6 }: { name: IconName; size?: number; stroke?: number }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (name) {
    case 'sell':    return <svg {...p}><path d="M3 3h2l2.4 12.3a1.5 1.5 0 0 0 1.5 1.2h8.2a1.5 1.5 0 0 0 1.5-1.2L21 7H6"/><circle cx="9.5" cy="20" r="1.3"/><circle cx="18" cy="20" r="1.3"/></svg>
    case 'stock':   return <svg {...p}><path d="M3 8l9-4 9 4-9 4-9-4z"/><path d="M3 8v8l9 4 9-4V8"/><path d="M12 12v8"/></svg>
    case 'expense': return <svg {...p}><path d="M6 3h12v18l-2.2-1.5L13.6 21 12 19.5 10.4 21 8.2 19.5 6 21V3z"/><path d="M9 8h6M9 12h6"/></svg>
    case 'repair':  return <svg {...p}><path d="M14.5 6.5a3.5 3.5 0 0 0-4.6 4.6L3 18l3 3 6.9-6.9a3.5 3.5 0 0 0 4.6-4.6l-2.3 2.3-2-2 2.3-2.3z"/></svg>
    case 'parcel':  return <svg {...p}><path d="M3 8l9-4 9 4v8l-9 4-9-4V8z"/><path d="M3 8l9 4 9-4M12 12v8"/><path d="M7.5 6l9 4"/></svg>
    case 'lens':    return <svg {...p}><path d="M4 7h3l1.5-2h7L18 7h2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.4"/></svg>
  }
}

// Each flow: a distinct place the camera IS the input. img resolves to
// /images/moat/{img}.webp; captions/labels live in landing.moat_flow{n}_* keys.
// `plan` (optional) surfaces a Business-plan tag honestly on gated flows.
type Flow = { key: string; icon: IconName; img: string; plan?: boolean }
const FLOWS: Flow[] = [
  { key: 'sell',    icon: 'sell',    img: 'sell' },
  { key: 'stock',   icon: 'stock',   img: 'stock' },
  { key: 'expense', icon: 'expense', img: 'expense', plan: true },
  { key: 'repair',  icon: 'repair',  img: 'repair' },
  { key: 'parcel',  icon: 'parcel',  img: 'parcel' },
]
const N = FLOWS.length

function DeviceScreen({ flow, tc, active }: { flow: Flow; tc: Tc; active: boolean }) {
  const [broken, setBroken] = useState(false)
  return (
    <div
      aria-hidden={!active}
      style={{
        position: 'absolute', inset: 0,
        opacity: active ? 1 : 0,
        transition: 'opacity .5s cubic-bezier(0.22,1,0.36,1)',
        pointerEvents: active ? 'auto' : 'none',
      }}
    >
      {/* Placeholder backdrop — an intentional device screen even before the
          real screenshot asset is dropped in, so nothing ever looks broken. */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(160deg, #fff 0%, ${C.accSoft} 100%)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14,
        color: C.acc, textAlign: 'center', padding: 24,
      }}>
        <Icon name={flow.icon} size={40} stroke={1.4} />
        <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: C.tx3 }}>
          {tc(`landing.moat_flow_${flow.key}_label`)}
        </div>
      </div>
      {!broken && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/images/moat/${flow.img}.webp`}
          alt={tc(`landing.moat_flow_${flow.key}_alt`)}
          onError={() => setBroken(true)}
          loading="lazy"
          decoding="async"
          style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      )}
    </div>
  )
}

export default function CameraFirstMoat({ tc }: { tc: Tc }) {
  // Defaults to Sell (index 0) so the checkout demo plays first. No auto-advance —
  // the demo needs a full ~9s loop to land, and the flows are tap-to-explore.
  const [i, setI] = useState(0)
  const [visible, setVisible] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  // Start the Sell demo only once the section is scrolled into view.
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(es => {
      if (es.some(e => e.isIntersecting)) { setVisible(true); io.disconnect() }
    }, { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const pick = useCallback((n: number) => { setI((n + N) % N) }, [])

  return (
    <section style={{ padding: 'clamp(72px,10vw,128px) clamp(16px,4vw,40px)', background: C.bg, position: 'relative', overflow: 'hidden' }}>
      <div ref={rootRef} style={{ maxWidth: 1080, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }} data-reveal>
          <div style={{ display: 'inline-block', padding: '6px 14px', borderRadius: 9999, background: C.accSoft, color: C.acc, fontSize: 11, fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 20 }}>
            {tc('landing.moat_eyebrow')}
          </div>
          <h2 style={{ fontFamily: 'var(--font-instrument)', fontSize: 'clamp(30px,5vw,56px)', fontWeight: 400, lineHeight: 1.04, letterSpacing: '-.02em', color: C.tx, margin: '0 0 18px' }}>
            {tc('landing.moat_title')} <em style={{ color: C.acc, fontStyle: 'italic' }}>{tc('landing.moat_title_accent')}</em>
          </h2>
          <p style={{ fontSize: 'clamp(16px,1.8vw,19px)', color: C.tx2, lineHeight: 1.65, maxWidth: 560, margin: '0 auto' }}>
            {tc('landing.moat_intro')}
          </p>
        </div>

        {/* Stage: device frame + flow switcher */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 'clamp(28px,4vw,48px)', alignItems: 'center', marginTop: 'clamp(40px,6vw,72px)' }} className="moat-stage" data-reveal data-reveal-delay="1">

          {/* Double-bezel phone frame */}
          <div style={{ justifySelf: 'center', width: '100%', maxWidth: 300 }}>
            <div style={{
              padding: 10, borderRadius: 44,
              background: 'linear-gradient(160deg,#2a2622,#0f0d0b)',
              boxShadow: '0 30px 60px -20px rgba(80,45,15,.32), inset 0 1px 1px rgba(255,255,255,.14)',
            }}>
              <div style={{
                position: 'relative', borderRadius: 34, overflow: 'hidden',
                background: C.card, aspectRatio: '9 / 19',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,.4)',
              }}>
                {FLOWS.map((f, k) => (
                  <div key={f.key} aria-hidden={k !== i} style={{ position: 'absolute', inset: 0, opacity: k === i ? 1 : 0, transition: 'opacity .5s cubic-bezier(0.22,1,0.36,1)', pointerEvents: k === i ? 'auto' : 'none' }}>
                    {f.key === 'sell'
                      ? <CameraCheckoutDemo tc={tc} active={k === i && visible} />
                      : <FlowScanDemo tc={tc} flowKey={f.key as 'stock' | 'expense' | 'repair' | 'parcel'} active={k === i && visible} />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Flow list — tap to switch. Active state is weight + rail + colour, not colour alone. */}
          <div role="tablist" aria-label={tc('landing.moat_eyebrow')} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 460, width: '100%', justifySelf: 'center' }}>
            {FLOWS.map((f, k) => {
              const on = k === i
              return (
                <button
                  key={f.key}
                  role="tab"
                  aria-selected={on}
                  onClick={() => pick(k)}
                  className="moat-flow"
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 14, textAlign: 'left',
                    padding: '16px 18px', borderRadius: 16, cursor: 'pointer',
                    border: `1px solid ${on ? 'rgba(201,122,68,.32)' : 'transparent'}`,
                    background: on ? C.card : 'transparent',
                    boxShadow: on ? '0 10px 30px -14px rgba(80,45,15,.28)' : 'none',
                    transition: 'background .3s cubic-bezier(0.22,1,0.36,1), border-color .3s, box-shadow .3s',
                    minHeight: 44,
                  }}
                >
                  <span style={{
                    flexShrink: 0, width: 40, height: 40, borderRadius: 11,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: on ? C.acc : C.accSoft, color: on ? '#fff' : C.acc,
                    transition: 'background .3s, color .3s',
                  }}>
                    <Icon name={f.icon} size={20} />
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 16, fontWeight: on ? 700 : 600, color: C.tx }}>
                        {tc(`landing.moat_flow_${f.key}_title`)}
                      </span>
                      {f.plan && (
                        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: C.acc, background: C.accSoft, padding: '2px 7px', borderRadius: 9999 }}>
                          {tc('landing.moat_plan_business')}
                        </span>
                      )}
                    </span>
                    <span style={{
                      display: 'block', fontSize: 14, lineHeight: 1.5, color: C.tx2, marginTop: 3,
                      maxHeight: on ? 60 : 0, opacity: on ? 1 : 0, overflow: 'hidden',
                      transition: 'max-height .4s cubic-bezier(0.22,1,0.36,1), opacity .3s, margin-top .3s',
                    }}>
                      {tc(`landing.moat_flow_${f.key}_body`)}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <style>{`
        .moat-flow:hover{background:${C.card};border-color:rgba(201,122,68,.18)}
        @media(min-width:880px){
          .moat-stage{grid-template-columns:300px 1fr !important;align-items:center}
        }
      `}</style>
    </section>
  )
}
