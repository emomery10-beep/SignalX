'use client'

// ── Any-Phone Proof ───────────────────────────────────────────────────────────
// Proves "works on any phone, no hardware" by showing the SAME AskBiz home screen
// running inside a chunky budget Android and a sleek iPhone, side by side. Pure
// CSS/SVG. Section chrome uses the warm coral-editorial language; the screen uses
// POS tokens. Copy from landing.any_* keys.

type Tc = (k: string, vars?: Record<string, string | number>) => string

const M = { bg: '#ffffff', tx: '#1A1410', tx2: '#4A4038', tx3: '#6b6560', acc: '#C97A44', accSoft: 'rgba(201,122,68,0.10)', bd: '#e4e0d8' }
const P = { bg: '#f9f8f6', surface: '#fff', border: '#e5e2dc', ink: '#1a1916', muted: '#6b6760', acc: '#d08a59', accPale: 'rgba(208,138,89,0.12)' }

// The shared AskBiz home screen — identical in both frames (that's the point).
function MiniHome({ tc }: { tc: Tc }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: P.bg, display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
      <div style={{ padding: '28px 14px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 30, height: 30, borderRadius: '50%', background: P.accPale, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🇰🇪</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: P.ink }}>{tc('landing.any_home_greeting')}</span>
      </div>
      <div style={{ padding: '4px 16px 10px' }}>
        <div style={{ fontSize: 10.5, color: P.muted, fontWeight: 600 }}>{tc('landing.any_home_today')}</div>
        <div style={{ fontSize: 26, fontWeight: 900, color: P.ink, letterSpacing: '-.02em' }}>KSh 4,820</div>
      </div>
      <div style={{ display: 'flex', gap: 8, padding: '0 12px 12px' }}>
        {[['any_home_sales', '34'], ['any_home_top', 'Soda']].map(([k, v], z) => (
          <div key={z} style={{ flex: 1, background: P.surface, border: `1px solid ${P.border}`, borderRadius: 12, padding: '10px 12px' }}>
            <div style={{ fontSize: 9.5, color: P.muted, fontWeight: 600 }}>{tc(`landing.${k}`)}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: P.ink }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 'auto', padding: '0 12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px', borderRadius: 14, background: P.acc, color: '#fff', fontSize: 14, fontWeight: 700 }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.2"/></svg>
          {tc('landing.any_home_newsale')}
        </div>
      </div>
    </div>
  )
}

export default function AnyPhoneProof({ tc }: { tc: Tc }) {
  return (
    <section style={{ padding: 'clamp(64px,9vw,112px) clamp(16px,4vw,40px)', background: M.bg }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }} data-reveal>
          <div style={{ display: 'inline-block', padding: '6px 14px', borderRadius: 9999, background: M.accSoft, color: M.acc, fontSize: 11, fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 20 }}>
            {tc('landing.any_eyebrow')}
          </div>
          <h2 style={{ fontFamily: 'var(--font-instrument)', fontSize: 'clamp(28px,4.6vw,52px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-.02em', color: M.tx, margin: '0 0 18px' }}>
            {tc('landing.any_title')} <em style={{ color: M.acc, fontStyle: 'italic' }}>{tc('landing.any_title_accent')}</em>
          </h2>
          <p style={{ fontSize: 'clamp(16px,1.8vw,19px)', color: M.tx2, lineHeight: 1.65, maxWidth: 540, margin: '0 auto' }}>
            {tc('landing.any_sub')}
          </p>
        </div>

        {/* Two phones */}
        <div style={{ marginTop: 'clamp(40px,6vw,64px)', display: 'flex', gap: 'clamp(20px,5vw,64px)', alignItems: 'flex-end', justifyContent: 'center', flexWrap: 'wrap' }} data-reveal data-reveal-delay="1">

          {/* Budget Android — chunkier bezel, squarer, hole-punch camera */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 'clamp(150px,40vw,190px)', margin: '0 auto', padding: 7, borderRadius: 28, background: 'linear-gradient(160deg,#3a3a3d,#161617)', boxShadow: '0 24px 50px -22px rgba(0,0,0,.4)' }}>
              <div style={{ position: 'relative', borderRadius: 22, overflow: 'hidden', background: P.bg, aspectRatio: '9 / 18' }}>
                <span style={{ position: 'absolute', top: 7, left: '50%', transform: 'translateX(-50%)', width: 7, height: 7, borderRadius: '50%', background: '#000', zIndex: 2 }} />
                <MiniHome tc={tc} />
              </div>
            </div>
            <div style={{ marginTop: 14, fontSize: 13, fontWeight: 600, color: M.tx3 }}>{tc('landing.any_cap_android')}</div>
          </div>

          {/* iPhone — sleeker, rounder, dynamic-island pill */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 'clamp(160px,42vw,210px)', margin: '0 auto', padding: 9, borderRadius: 40, background: 'linear-gradient(160deg,#2a2622,#0f0d0b)', boxShadow: '0 30px 60px -22px rgba(80,45,15,.32), inset 0 1px 1px rgba(255,255,255,.14)' }}>
              <div style={{ position: 'relative', borderRadius: 31, overflow: 'hidden', background: P.bg, aspectRatio: '9 / 19' }}>
                <span style={{ position: 'absolute', top: 9, left: '50%', transform: 'translateX(-50%)', width: 46, height: 15, borderRadius: 9999, background: '#000', zIndex: 2 }} />
                <MiniHome tc={tc} />
              </div>
            </div>
            <div style={{ marginTop: 14, fontSize: 13, fontWeight: 600, color: M.tx3 }}>{tc('landing.any_cap_iphone')}</div>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 'clamp(28px,4vw,40px)', fontSize: 15, color: M.tx2, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }} data-reveal>
          {tc('landing.any_foot')}
        </p>
      </div>
    </section>
  )
}
