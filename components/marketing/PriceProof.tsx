'use client'
import AnimatedNumber from '@/components/ui/AnimatedNumber'

// ── Price Proof ───────────────────────────────────────────────────────────────
// A bold, single-price callout so the KSh 500/seat point of sale is impossible to
// miss (it was buried in the pricing table before). Links to the full pricing
// section rather than duplicating it. Warm coral-editorial language to match the
// rest of the marketing page. All copy from landing.price2_* keys.

type Tc = (k: string, vars?: Record<string, string | number>) => string

const C = {
  bg:   '#ffffff',
  card: '#FFFFFF',
  tx:   '#1A1410',
  tx2:  '#4A4038',
  tx3:  '#6b6560',
  bd:   '#e4e0d8',
  acc:  '#C97A44',
  accSoft: 'rgba(201,122,68,0.10)',
}

function Check() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.acc} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
}

export default function PriceProof({ tc }: { tc: Tc }) {
  const inc = ['price2_inc_0', 'price2_inc_1', 'price2_inc_2', 'price2_inc_3', 'price2_inc_4']
  return (
    <section style={{ padding: 'clamp(64px,9vw,112px) clamp(16px,4vw,40px)', background: C.bg }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }} data-reveal>
          <div style={{ display: 'inline-block', padding: '6px 14px', borderRadius: 9999, background: C.accSoft, color: C.acc, fontSize: 11, fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 20 }}>
            {tc('landing.price2_eyebrow')}
          </div>
          <h2 style={{ fontFamily: 'var(--font-instrument)', fontSize: 'clamp(30px,5vw,54px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-.02em', color: C.tx, margin: '0 0 18px' }}>
            {tc('landing.price2_title')} <em style={{ color: C.acc, fontStyle: 'italic' }}>{tc('landing.price2_title_accent')}</em>
          </h2>
          <p style={{ fontSize: 'clamp(16px,1.8vw,19px)', color: C.tx2, lineHeight: 1.65, maxWidth: 560, margin: '0 auto' }}>
            {tc('landing.price2_sub')}
          </p>
        </div>

        {/* Double-bezel price card */}
        <div style={{ marginTop: 'clamp(36px,5vw,56px)', maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }} data-reveal data-reveal-delay="1">
          <div style={{ padding: 8, borderRadius: 28, background: C.accSoft, border: `1px solid ${C.bd}` }}>
            <div style={{ borderRadius: 22, background: C.card, border: `1px solid ${C.bd}`, boxShadow: '0 24px 60px -28px rgba(80,45,15,.28)', padding: 'clamp(28px,4vw,40px)', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-instrument)', fontSize: 'clamp(44px,7vw,72px)', fontWeight: 400, letterSpacing: '-.02em', color: C.tx, lineHeight: 1 }}><AnimatedNumber value={tc('landing.price2_amount')} /></span>
                <span style={{ fontSize: 16, fontWeight: 600, color: C.tx3 }}>{tc('landing.price2_per')}</span>
              </div>
              <div style={{ fontSize: 13, color: C.tx3, marginTop: 8 }}>{tc('landing.price2_approx')}</div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '10px 18px', margin: '26px 0 24px', textAlign: 'left' }}>
                {inc.map((k, z) => (
                  <div key={z} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: 7, background: C.accSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check /></span>
                    <span style={{ fontSize: 14, color: C.tx2, fontWeight: 500 }}>{tc(`landing.${k}`)}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 9999, background: C.accSoft, color: C.acc, fontSize: 13.5, fontWeight: 700 }}>
                {tc('landing.price2_free')}
              </div>
              <div style={{ marginTop: 18 }}>
                <a href="#pricing" className="price-link" style={{ fontSize: 14, fontWeight: 700, color: C.acc, textDecoration: 'none' }}>{tc('landing.price2_link')} →</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .price-link{transition:filter 150ms cubic-bezier(0.22,1,0.36,1);border-radius:4px}
        .price-link:hover{filter:brightness(.82);text-decoration:underline}
        .price-link:focus-visible{filter:brightness(.82);text-decoration:underline;outline:2px solid ${C.acc};outline-offset:3px}
      `}</style>
    </section>
  )
}
