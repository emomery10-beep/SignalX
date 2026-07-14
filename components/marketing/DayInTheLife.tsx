'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

// ── A day in the life ─────────────────────────────────────────────────────────
// A stacked deck of scene cards. Each scene folds down onto the pile one at a
// time (auto-advancing, with controls) — a narrative counterpart to the hero's
// live dashboard. Humanises the product through one shopkeeper's day.
// All copy comes from the `landing.day_*` translation keys.

type Tc = (k: string, vars?: Record<string, string | number>) => string

const C = {
  bg:   '#f2f3f5',
  card: '#FFFFFF',
  tx:   '#1A1410',
  tx2:  '#4A4038',
  tx3:  '#6b6560',
  bd:   '#dde0e4',
  acc:  '#C97A44',
}

type IconName =
  | 'camera' | 'store' | 'flame' | 'bell' | 'book' | 'moon'
  | 'sparkles' | 'arrow' | 'whatsapp' | 'checks'

function Icon({ name, size = 22, stroke = 1.5 }: { name: IconName; size?: number; stroke?: number }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (name) {
    case 'camera':   return <svg {...p}><path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.2"/></svg>
    case 'store':    return <svg {...p}><path d="M4 9V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3"/><path d="M3 9h18l-1 3a3 3 0 0 1-6 0 3 3 0 0 1-6 0L3 9z"/><path d="M5 12v8h14v-8"/><path d="M10 20v-4h4v4"/></svg>
    case 'flame':    return <svg {...p}><path d="M12 3s5 4 5 9a5 5 0 0 1-10 0c0-1.5.6-2.7 1.3-3.6C9 10 10 9 10 7c1.5.8 2 2.2 2 3 .9-.8 1-2.4 0-4z"/></svg>
    case 'bell':     return <svg {...p}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9z"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>
    case 'book':     return <svg {...p}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v14H6.5A2.5 2.5 0 0 0 4 19.5z"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20v4H6.5A2.5 2.5 0 0 1 4 19.5z"/></svg>
    case 'moon':     return <svg {...p}><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>
    case 'sparkles': return <svg {...p}><path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z"/><path d="M18 4v3M19.5 5.5h-3"/></svg>
    case 'arrow':    return <svg {...p}><path d="M7 17L17 7M9 7h8v8"/></svg>
    case 'whatsapp': return <svg {...p}><path d="M12 21a9 9 0 1 0-8-4.9L3 21l4.9-1a9 9 0 0 0 4.1 1z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5.5 0 1-.4 1-1 0-.3-.2-.6-.5-.8l-1.2-.5-.9.9c-1-.5-1.9-1.4-2.4-2.4l.9-.9-.5-1.2c-.2-.3-.5-.5-.8-.5-.6 0-1 .5-1 1z"/></svg>
    case 'checks':   return <svg {...p}><path d="M2 12l5 5L16 6"/><path d="M12 15l1.5 1.5L22 8"/></svg>
  }
}

// Visual config per scene; all text lives in landing.day_s{n}_* keys.
const SCENES = [
  { icon: 'camera',   chipIcon: 'sparkles', ac: '#C97A44', rev: 0,    cust: 0  },
  { icon: 'store',    chipIcon: 'arrow',    ac: '#D98A3F', rev: 340,  cust: 4  },
  { icon: 'flame',    chipIcon: 'flame',    ac: '#2F9E44', rev: 6900, cust: 58 },
  { icon: 'bell',     chipIcon: 'whatsapp', ac: '#8C6FE0', rev: 8250, cust: 74 },
  { icon: 'book',     chipIcon: 'checks',   ac: '#7B5FD0', rev: 9480, cust: 83 },
  { icon: 'moon',     chipIcon: 'moon',     ac: '#E6B17F', rev: 9480, cust: 83, dark: true },
] as const

const KSH = (n: number) => 'KSh ' + Math.round(n).toLocaleString('en-US')
const N = SCENES.length
const DURATION = 4800

function hexA(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
}

export default function DayInTheLife({ tc }: { tc: Tc }) {
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [visible, setVisible] = useState(false)
  const [revShown, setRevShown] = useState(0)
  const [custShown, setCustShown] = useState(0)
  const reduce = useRef(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    reduce.current = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  // Start only when scrolled into view.
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(es => {
      if (es.some(e => e.isIntersecting)) { setVisible(true); io.disconnect() }
    }, { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Auto-advance the deck.
  useEffect(() => {
    if (!visible || !playing) return
    timer.current = setTimeout(() => setI(v => (v + 1) % N), DURATION)
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [i, visible, playing])

  // Count the running tally up to the current scene's totals.
  useEffect(() => {
    if (!visible) return
    const s = SCENES[i]
    if (reduce.current) { setRevShown(s.rev); setCustShown(s.cust); return }
    const r0 = revShown, c0 = custShown, t0 = performance.now(), dur = 800
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3)
      setRevShown(r0 + (s.rev - r0) * e)
      setCustShown(c0 + (s.cust - c0) * e)
      if (p < 1) raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, visible])

  const go = useCallback((n: number) => { setI((n + N) % N) }, [])

  const cardStyle = (k: number): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'absolute', top: 0, left: 0, right: 0,
      transformOrigin: 'top center',
      transition: reduce.current ? 'none' : 'transform .62s cubic-bezier(.16,1,.3,1), opacity .45s ease',
      backfaceVisibility: 'hidden',
    }
    if (k === i) return { ...base, transform: 'translateY(0) scale(1) rotateX(0deg)', opacity: 1, zIndex: 60 }
    if (k < i) {
      const d = i - k
      return { ...base, transform: `translateY(${9 * d}px) scale(${1 - 0.038 * d}) rotateX(0deg)`, opacity: d <= 3 ? 1 : 0, zIndex: 60 - d }
    }
    return { ...base, transform: 'translateY(0) scale(1) rotateX(-92deg)', opacity: 0, zIndex: 1 }
  }

  return (
    <section style={{ padding: 'clamp(56px,7vw,88px) clamp(16px,4vw,40px)', background: C.bg }}>
      <div ref={rootRef} style={{ maxWidth: 720, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 32 }} data-reveal>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: C.acc, marginBottom: 14 }}>{tc('landing.day_eyebrow')}</div>
          <h2 style={{ fontFamily: 'var(--font-instrument)', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 400, lineHeight: 1.06, letterSpacing: '-.02em', color: C.tx, marginBottom: 14 }}>
            {tc('landing.day_title')} <em style={{ color: C.acc, fontStyle: 'italic' }}>{tc('landing.day_title_accent')}</em>
          </h2>
          <p style={{ fontSize: 16, color: C.tx2, lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
            {tc('landing.day_intro')}
          </p>
        </div>

        {/* Progress rail */}
        <div style={{ height: 3, background: 'rgba(0,0,0,.07)', borderRadius: 2, overflow: 'hidden', marginBottom: 18 }}>
          <div key={i + (playing ? '-p' : '-s')} style={{
            height: '100%', background: SCENES[i].ac, borderRadius: 2,
            transformOrigin: 'left', transform: visible && playing && !reduce.current ? 'scaleX(1)' : 'scaleX(0.001)',
            transition: visible && playing && !reduce.current ? `transform ${DURATION}ms linear` : 'none',
          }} />
        </div>

        {/* Fold-card deck */}
        <div style={{ position: 'relative', height: 'clamp(322px,54vw,344px)', perspective: 1500 }}>
          {SCENES.map((s, k) => (
            <article key={k} style={cardStyle(k)} aria-hidden={k !== i}>
              <div style={{
                borderRadius: 18, border: `1px solid ${s.dark ? '#2a2320' : C.bd}`,
                background: s.dark ? C.tx : C.card,
                boxShadow: k === i ? '0 24px 60px rgba(0,0,0,.13)' : '0 8px 24px rgba(0,0,0,.06)',
                padding: 'clamp(24px,4vw,34px)', minHeight: 'clamp(322px,54vw,344px)',
                display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative',
              }}>
                {s.dark && [[24, 40], [54, '82%'], [40, '68%'], ['70%', 60]].map((pos, z) => (
                  <span key={z} style={{ position: 'absolute', top: pos[0], left: pos[1], width: 3, height: 3, borderRadius: '50%', background: '#fff', opacity: .5 }} />
                ))}

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'auto' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: hexA(s.ac, s.dark ? .2 : .13), color: s.ac, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name={s.icon} size={23} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: s.ac }}>{tc(`landing.day_s${k}_tod`)}</div>
                    <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: '.05em', textTransform: 'uppercase', color: s.dark ? '#8b8178' : C.tx3 }}>{tc(`landing.day_s${k}_tag`)}</div>
                  </div>
                </div>

                <h3 style={{ fontFamily: 'var(--font-instrument)', fontSize: 'clamp(25px,3.4vw,36px)', fontWeight: 400, lineHeight: 1.12, letterSpacing: '-.02em', color: s.dark ? '#F5F0EA' : C.tx, margin: '20px 0 12px' }}>
                  {tc(`landing.day_s${k}_head`)}
                </h3>
                <p style={{ fontSize: 15, lineHeight: 1.62, color: s.dark ? '#C7BEB4' : C.tx2, margin: 0 }}>
                  {tc(`landing.day_s${k}_body`)}
                </p>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, alignSelf: 'flex-start', marginTop: 18, padding: '7px 14px', borderRadius: 9999, background: hexA(s.ac, s.dark ? .18 : .12), color: s.ac, fontSize: 14, fontWeight: 600 }}>
                  <Icon name={s.chipIcon} size={15} stroke={1.8} />{tc(`landing.day_s${k}_chip`)}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Controls + running tally */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 20, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 20 }}>
            <div>
              <div style={{ fontSize: 14, color: C.tx3 }}>{tc('landing.day_tally_sales')}</div>
              <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-.01em', color: C.tx }}>{KSH(revShown)}</div>
            </div>
            <div>
              <div style={{ fontSize: 14, color: C.tx3 }}>{tc('landing.day_tally_customers')}</div>
              <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-.01em', color: C.tx }}>{Math.round(custShown)}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6, marginLeft: 'auto', alignItems: 'center' }}>
            {SCENES.map((_, k) => (
              <button key={k} onClick={() => go(k)} aria-label={`${k + 1}`} style={{
                width: k === i ? 22 : 8, height: 8, borderRadius: 9999, border: 'none', padding: 0, cursor: 'pointer',
                background: k === i ? C.acc : 'rgba(0,0,0,.16)', transition: 'width .3s, background .3s',
              }} />
            ))}
          </div>

          <div style={{ display: 'flex', gap: 7 }}>
            <button onClick={() => go(i - 1)} aria-label={tc('landing.day_prev')} className="dil-btn" style={btn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
            </button>
            <button onClick={() => setPlaying(p => !p)} aria-label={playing ? tc('landing.day_pause') : tc('landing.day_play')} className="dil-btn" style={btn}>
              {playing
                ? <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
                : <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5l12 7-12 7z"/></svg>}
            </button>
            <button onClick={() => go(i + 1)} aria-label={tc('landing.day_next')} className="dil-btn" style={btn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"/></svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .dil-btn{transition:background .15s,border-color .15s}
        .dil-btn:hover{background:#e8eaed}
      `}</style>
    </section>
  )
}

const btn: React.CSSProperties = {
  minWidth: 44, minHeight: 44, borderRadius: 10, border: `1px solid ${C.bd}`,
  background: C.card, color: C.tx, cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
}
