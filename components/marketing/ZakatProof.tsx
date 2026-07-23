'use client'
import AnimatedNumber from '@/components/ui/AnimatedNumber'

// ── Zakat Proof ───────────────────────────────────────────────────────────────
// Surfaces the built-in Zakat calculator — a genuine differentiator no competitor
// has, and currently invisible on the homepage. Faithful to the real component
// (components/intelligence/ZakatCalculator.tsx): title + status badge, amount due,
// Inventory / Cash / Receivables / Payables tiles, nisab, charity link. It's free
// on every plan (no gate), stated honestly. Uses the real green accent. Copy from
// landing.zk_* keys.

type Tc = (k: string, vars?: Record<string, string | number>) => string

const M = { bg: '#ffffff', tx: '#1A1410', tx2: '#4A4038', tx3: '#6b6560', acc: '#C97A44', accSoft: 'rgba(201,122,68,0.10)', bd: '#e4e0d8', card: '#fff' }
const A = { ink: '#1a1916', muted: '#6b6760', surface: '#fff', border: '#e5e2dc', bg: '#f9f8f6', green: '#16a34a', greenPale: 'rgba(22,163,74,0.10)', neg: '#dc2626' }

const TILES = [
  { k: 'zk_inv',  v: 'KSh 98,000' },
  { k: 'zk_cash', v: 'KSh 32,000' },
  { k: 'zk_recv', v: 'KSh 8,000' },
  { k: 'zk_pay',  v: '− KSh 12,000', neg: true },
]

export default function ZakatProof({ tc }: { tc: Tc }) {
  return (
    <section style={{ padding: 'clamp(64px,9vw,112px) clamp(16px,4vw,40px)', background: M.bg }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 'clamp(32px,5vw,56px)', alignItems: 'center' }} className="zk-grid">

        {/* Header */}
        <div data-reveal>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            <span style={{ padding: '6px 14px', borderRadius: 9999, background: M.accSoft, color: M.acc, fontSize: 11, fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase' }}>{tc('landing.zk_eyebrow')}</span>
            <span style={{ padding: '6px 12px', borderRadius: 9999, background: A.greenPale, color: A.green, fontSize: 11, fontWeight: 700 }}>{tc('landing.zk_free')}</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-instrument)', fontSize: 'clamp(28px,4.4vw,50px)', fontWeight: 400, lineHeight: 1.06, letterSpacing: '-.02em', color: M.tx, margin: '0 0 18px' }}>
            {tc('landing.zk_title')} <em style={{ color: M.acc, fontStyle: 'italic' }}>{tc('landing.zk_title_accent')}</em>
          </h2>
          <p style={{ fontSize: 'clamp(15px,1.7vw,18px)', color: M.tx2, lineHeight: 1.65, maxWidth: 460, marginBottom: 18 }}>
            {tc('landing.zk_sub')}
          </p>
          <p style={{ fontSize: 14, color: M.tx3, maxWidth: 440 }}>{tc('landing.zk_foot')}</p>
        </div>

        {/* Calculator card (double-bezel) */}
        <div style={{ justifySelf: 'center', width: '100%', maxWidth: 380 }} data-reveal data-reveal-delay="1">
          <div style={{ padding: 7, borderRadius: 26, background: M.accSoft, border: `1px solid ${M.bd}` }}>
            <div style={{ borderRadius: 20, background: A.surface, border: `1px solid ${A.border}`, boxShadow: '0 24px 60px -28px rgba(80,45,15,.26)', padding: 18, fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: A.ink }}>{tc('landing.zk_card_title')}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: A.green, background: A.greenPale, padding: '4px 10px', borderRadius: 9999 }}>{tc('landing.zk_status')}</span>
              </div>

              <div style={{ background: A.greenPale, borderRadius: 14, padding: '16px 18px', marginBottom: 16 }}>
                <div style={{ fontSize: 11.5, color: A.muted, marginBottom: 3 }}>{tc('landing.zk_due_label')}</div>
                <div style={{ fontSize: 30, fontWeight: 900, color: A.green, letterSpacing: '-.02em' }}><AnimatedNumber value="KSh 3,150" /></div>
                <div style={{ fontSize: 11.5, color: A.muted, marginTop: 3 }}>{tc('landing.zk_pct')}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 14 }}>
                {TILES.map((t, z) => (
                  <div key={z} style={{ background: A.bg, border: `1px solid ${A.border}`, borderRadius: 12, padding: '10px 12px' }}>
                    <div style={{ fontSize: 10.5, color: A.muted, fontWeight: 600, marginBottom: 2 }}>{tc(`landing.${t.k}`)}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: t.neg ? A.neg : A.ink }}>{t.v}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: `1px solid ${A.border}` }}>
                <span style={{ fontSize: 11.5, color: A.muted }}>{tc('landing.zk_nisab')}</span>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: A.green }}>{tc('landing.zk_charity')} →</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`@media(min-width:880px){ .zk-grid{ grid-template-columns:1fr 380px !important; } }`}</style>
    </section>
  )
}
