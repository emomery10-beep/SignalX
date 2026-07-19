'use client'
import { useState, useEffect } from 'react'

// ── Multi-Language Proof ──────────────────────────────────────────────────────
// Proves real localisation (8 active locales incl. RTL Arabic). A phone screen
// whose UI cycles through languages on a loop, flipping to right-to-left for
// Arabic. Section chrome from landing.ml_* keys; the in-screen greetings are the
// actual languages being demonstrated (literal, not tc). Always animates.

type Tc = (k: string, vars?: Record<string, string | number>) => string

const M = { bg: '#FDFBF7', tx: '#1A1410', tx2: '#4A4038', tx3: '#6b6560', acc: '#C97A44', accSoft: 'rgba(201,122,68,0.10)', bd: '#e4e0d8' }
const P = { bg: '#f9f8f6', surface: '#fff', border: '#e5e2dc', ink: '#1a1916', muted: '#6b6760', acc: '#d08a59', accPale: 'rgba(208,138,89,0.12)' }

const LANGS = [
  { code: 'en', name: 'English',   flag: '🇬🇧', rtl: false, hi: 'Good morning', today: "Today's sales", cta: 'New sale' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪', rtl: false, hi: 'Habari ya asubuhi', today: 'Mauzo ya leo', cta: 'Uuzaji mpya' },
  { code: 'so', name: 'Soomaali',  flag: '🇸🇴', rtl: false, hi: 'Subax wanaagsan', today: 'Iibka maanta', cta: 'Iib cusub' },
  { code: 'ar', name: 'العربية',   flag: '🇸🇦', rtl: true,  hi: 'صباح الخير', today: 'مبيعات اليوم', cta: 'بيع جديد' },
  { code: 'fr', name: 'Français',  flag: '🇫🇷', rtl: false, hi: 'Bonjour', today: 'Ventes du jour', cta: 'Nouvelle vente' },
]

export default function MultiLangProof({ tc }: { tc: Tc }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const iv = setInterval(() => setI(v => (v + 1) % LANGS.length), 2400)
    return () => clearInterval(iv)
  }, [])
  const L = LANGS[i]

  return (
    <section style={{ padding: 'clamp(64px,9vw,112px) clamp(16px,4vw,40px)', background: M.bg }}>
      <div style={{ maxWidth: 1040, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 'clamp(32px,5vw,56px)', alignItems: 'center' }} className="ml-grid">

        {/* Header */}
        <div data-reveal>
          <div style={{ display: 'inline-block', padding: '6px 14px', borderRadius: 9999, background: M.accSoft, color: M.acc, fontSize: 11, fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 20 }}>
            {tc('landing.ml_eyebrow')}
          </div>
          <h2 style={{ fontFamily: 'var(--font-instrument)', fontSize: 'clamp(28px,4.4vw,50px)', fontWeight: 400, lineHeight: 1.06, letterSpacing: '-.02em', color: M.tx, margin: '0 0 18px' }}>
            {tc('landing.ml_title')} <em style={{ color: M.acc, fontStyle: 'italic' }}>{tc('landing.ml_title_accent')}</em>
          </h2>
          <p style={{ fontSize: 'clamp(15px,1.7vw,18px)', color: M.tx2, lineHeight: 1.65, maxWidth: 460, marginBottom: 22 }}>
            {tc('landing.ml_sub')}
          </p>
          {/* language chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {LANGS.map((l, z) => {
              const on = z === i
              return (
                <span key={l.code} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 13px', borderRadius: 9999, fontSize: 13, fontWeight: 600,
                  background: on ? M.acc : M.accSoft, color: on ? '#fff' : M.acc, transition: 'background .4s ease, color .4s ease' }}>
                  <span style={{ fontSize: 14 }}>{l.flag}</span>{l.name}
                </span>
              )
            })}
          </div>
        </div>

        {/* Phone — cycles language, flips RTL for Arabic */}
        <div style={{ justifySelf: 'center', width: '100%', maxWidth: 268 }} data-reveal data-reveal-delay="1">
          <div style={{ padding: 10, borderRadius: 42, background: 'linear-gradient(160deg,#2a2622,#0f0d0b)', boxShadow: '0 30px 60px -20px rgba(80,45,15,.32), inset 0 1px 1px rgba(255,255,255,.14)' }}>
            <div dir={L.rtl ? 'rtl' : 'ltr'} style={{ borderRadius: 33, overflow: 'hidden', background: P.bg, aspectRatio: '9 / 18.5', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>

              <div style={{ padding: '18px 16px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 30, height: 30, borderRadius: '50%', background: P.accPale, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>{L.flag}</span>
                <span key={'hi' + i} style={{ fontSize: 13, fontWeight: 700, color: P.ink, animation: 'ml-fade .5s ease' }}>{L.hi}</span>
              </div>

              <div style={{ padding: '6px 18px 12px' }}>
                <div key={'t' + i} style={{ fontSize: 11, color: P.muted, fontWeight: 600, animation: 'ml-fade .5s ease' }}>{L.today}</div>
                <div style={{ fontSize: 27, fontWeight: 900, color: P.ink, letterSpacing: '-.02em' }}>KSh 4,820</div>
              </div>

              <div style={{ padding: '0 14px', flex: 1 }}>
                {[0, 1].map(r => (
                  <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 10, background: P.surface, border: `1px solid ${P.border}`, borderRadius: 11, padding: '10px 12px', marginBottom: 8 }}>
                    <span style={{ width: 26, height: 26, borderRadius: 7, background: P.accPale, flexShrink: 0 }} />
                    <span style={{ flex: 1, height: 8, borderRadius: 4, background: '#eceae6' }} />
                    <span style={{ width: 34, height: 10, borderRadius: 4, background: '#eceae6' }} />
                  </div>
                ))}
              </div>

              <div style={{ padding: '0 14px 16px' }}>
                <div key={'c' + i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px', borderRadius: 14, background: P.acc, color: '#fff', fontSize: 14, fontWeight: 700, animation: 'ml-fade .5s ease' }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.2"/></svg>
                  {L.cta}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ml-fade{0%{opacity:0;transform:translateY(4px)}100%{opacity:1;transform:translateY(0)}}
        @media(min-width:880px){ .ml-grid{ grid-template-columns:1fr 268px !important; } }
      `}</style>
    </section>
  )
}
