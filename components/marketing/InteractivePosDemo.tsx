'use client'
import { useState, useEffect, useRef } from 'react'

// ── Interactive PoS Demo (hero) ───────────────────────────────────────────────
// Self-contained, genuinely CLICKABLE till that replaces the old cashier <iframe>.
// Each sector has its OWN simple screen the visitor clicks into:
//   retail / restaurant / salon → a sell till (tap items → cart → charge → M-Pesa)
//   repair    → a job ticket (pick device + fault → quote → start job)
//   factory   → a production tally (log units → output → dispatch)
//   logistics → a parcel run (tap to deliver → progress)
// Pure React + CSS/SVG: no iframe, paints instantly (LCP win), crawlable. Chrome
// copy from landing.* keys; item/data values are illustrative.

type Tc = (k: string, vars?: Record<string, string | number>) => string
const money = (n: number) => 'KSh ' + n.toLocaleString('en-US')

const P = {
  bg: '#f9f8f6', surface: '#fff', border: '#e5e2dc', ink: '#1a1916', muted: '#6b6760',
  acc: '#d08a59', accPale: 'rgba(208,138,89,0.12)', success: '#16a34a',
}

type SellItem = { n: string; p: number }
const SELL: Record<string, { items: SellItem[]; action: string }> = {
  retail: { action: 'till_a_charge', items: [
    { n: 'Coca-Cola 500ml', p: 80 }, { n: 'White bread', p: 65 }, { n: 'Sugar 1kg', p: 160 },
    { n: 'Cooking oil 1L', p: 320 }, { n: 'Blue Band', p: 190 }, { n: 'Bar soap', p: 45 } ] },
  restaurant: { action: 'till_a_order', items: [
    { n: 'Pilau', p: 250 }, { n: 'Nyama choma', p: 400 }, { n: 'Chapati', p: 30 },
    { n: 'Soda', p: 80 }, { n: 'Chai', p: 50 }, { n: 'Chips', p: 150 } ] },
  salon: { action: 'till_a_charge', items: [
    { n: 'Haircut', p: 300 }, { n: 'Braiding', p: 800 }, { n: 'Shave', p: 100 },
    { n: 'Blow-dry', p: 500 }, { n: 'Manicure', p: 400 }, { n: 'Hair dye', p: 1200 } ] },
}
const REP_DEVICES = ['iPhone 12', 'Samsung A14', 'Tecno Spark', 'HP Laptop']
const REP_FAULTS = [{ n: 'Screen', p: 3500 }, { n: 'Battery', p: 1800 }, { n: 'Water damage', p: 2500 }, { n: 'Software', p: 800 }]
const FAC_ITEMS = [{ n: 'Bread crate', p: 1200 }, { n: 'Soap carton', p: 900 }, { n: 'Water 24-pack', p: 480 }, { n: 'Juice ×12', p: 720 }]
const LOG_PARCELS = [
  { id: 'KE-4471', to: 'Nairobi CBD', cod: 1200 }, { id: 'KE-4482', to: 'Westlands', cod: 800 },
  { id: 'KE-4490', to: 'Gikomba', cod: 350 }, { id: 'KE-4501', to: 'Karen', cod: 150 } ]

const SECTORS = [
  { id: 'retail', nameKey: 'vert_retail_name', emoji: '🛍️', kind: 'sell' },
  { id: 'restaurant', nameKey: 'vert_restaurant_name', emoji: '🍴', kind: 'sell' },
  { id: 'salon', nameKey: 'vert_salon_name', emoji: '💇', kind: 'sell' },
  { id: 'repair', nameKey: 'vert_repair_name', emoji: '🔧', kind: 'repair' },
  { id: 'factory', nameKey: 'vert_factory_name', emoji: '🏭', kind: 'factory' },
  { id: 'logistics', nameKey: 'vert_logistics_name', emoji: '📦', kind: 'logistics' },
] as const

const card = { background: P.surface, border: `1px solid ${P.border}`, borderRadius: 16 }
const doneBtn = (on: boolean): React.CSSProperties => ({ width: '100%', padding: 12, borderRadius: 12, border: 'none', cursor: on ? 'pointer' : 'default', background: on ? P.acc : P.border, color: '#fff', fontSize: 14.5, fontWeight: 700, fontFamily: 'inherit' })

function Done({ tc, sub }: { tc: Tc; sub: string }) {
  return (
    <div style={{ ...card, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 22, textAlign: 'center' }}>
      <span style={{ width: 60, height: 60, borderRadius: '50%', background: P.success, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, animation: 'ipos-pop .5s cubic-bezier(0.22,1.6,0.4,1)' }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
      </span>
      <div style={{ fontSize: 15, fontWeight: 800, color: P.ink }}>{tc('landing.moat_demo_success')}</div>
      <div style={{ fontSize: 12.5, color: P.muted, marginTop: 4 }}>{sub}</div>
    </div>
  )
}

// ── Sell till (retail / restaurant / salon) ──────────────────────────────────
function SellScreen({ tc, sectorId }: { tc: Tc; sectorId: string }) {
  const cfg = SELL[sectorId]
  const [cart, setCart] = useState<Record<number, number>>({})
  const [stage, setStage] = useState<'shop' | 'pay' | 'done'>('shop')
  const t = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => { setCart({}); setStage('shop') }, [sectorId])
  useEffect(() => { if (stage === 'done') { const x = setTimeout(() => { setCart({}); setStage('shop') }, 2200); return () => clearTimeout(x) } }, [stage])
  const lines = Object.entries(cart).map(([i, q]) => ({ it: cfg.items[+i], q, i: +i })).filter(l => l.it)
  const total = lines.reduce((s, l) => s + l.it.p * l.q, 0)
  const count = lines.reduce((s, l) => s + l.q, 0)
  const add = (i: number) => { setStage('shop'); setCart(c => ({ ...c, [i]: (c[i] || 0) + 1 })) }
  const dec = (i: number) => setCart(c => { const q = (c[i] || 0) - 1; const n = { ...c }; if (q <= 0) delete n[i]; else n[i] = q; return n })
  const charge = () => { if (!count) return; setStage('pay'); t.current = setTimeout(() => setStage('done'), 1400) }
  return (
    <div className="ipos-main" style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 'clamp(12px,2vw,18px)', minHeight: 0 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))', gridAutoRows: 'min-content', gap: 10, alignContent: 'start', overflow: 'auto', maxHeight: 388 }}>
        {cfg.items.map((it, i) => (
          <button key={i} onClick={() => add(i)} className="ipos-tap" style={{ textAlign: 'left', cursor: 'pointer', ...card, padding: '13px 13px', display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'inherit' }}>
            <span style={{ width: 28, height: 28, borderRadius: 8, background: P.accPale, color: P.acc, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            </span>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: P.ink, lineHeight: 1.25 }}>{it.n}</span>
            <span style={{ fontSize: 12.5, fontWeight: 800, color: P.acc }}>{money(it.p)}</span>
          </button>
        ))}
      </div>
      {stage === 'done' ? <Done tc={tc} sub={tc('landing.hero_till_saved')} /> : (
        <div style={{ ...card, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 340 }}>
          <div style={{ padding: '12px 14px', borderBottom: `1px solid ${P.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 13, fontWeight: 800 }}>{tc('landing.moat_demo_cart')}</span>
            <span style={{ fontSize: 11.5, color: P.muted }}>{tc('landing.moat_demo_items', { n: count })}</span>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: '8px 10px', minHeight: 84 }}>
            {lines.length === 0 ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: P.muted, fontSize: 12.5, padding: 12 }}>{tc('landing.hero_till_hint')}</div>
            ) : lines.map(l => (
              <div key={l.i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 4px', animation: 'ipos-in .35s ease' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.it.n}</div>
                  <div style={{ fontSize: 10.5, color: P.muted }}>{money(l.it.p)}</div>
                </div>
                <button onClick={() => dec(l.i)} className="ipos-qty">−</button>
                <span style={{ fontSize: 12.5, fontWeight: 700, minWidth: 14, textAlign: 'center' }}>{l.q}</span>
                <button onClick={() => add(l.i)} className="ipos-qty">+</button>
                <span style={{ fontSize: 12.5, fontWeight: 800, minWidth: 50, textAlign: 'right' }}>{money(l.it.p * l.q)}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: '12px 14px 14px', borderTop: `1px solid ${P.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: P.muted }}>{tc('landing.moat_demo_total')}</span>
              <span style={{ fontSize: 19, fontWeight: 900 }}>{money(total)}</span>
            </div>
            <button onClick={charge} disabled={!count} style={{ ...doneBtn(!!count), display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {stage === 'pay' ? <><span className="ipos-dots"><i/><i/><i/></span>{tc('landing.moat_demo_pay_mpesa')}</> : <>{tc(`landing.${cfg.action}`)}{count ? ` · ${money(total)}` : ''}</>}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Repair job ticket ────────────────────────────────────────────────────────
function RepairScreen({ tc, sectorId }: { tc: Tc; sectorId: string }) {
  const [dev, setDev] = useState<number | null>(null)
  const [flt, setFlt] = useState<number | null>(null)
  const [done, setDone] = useState(false)
  useEffect(() => { setDev(null); setFlt(null); setDone(false) }, [sectorId])
  useEffect(() => { if (done) { const x = setTimeout(() => { setDev(null); setFlt(null); setDone(false) }, 2400); return () => clearTimeout(x) } }, [done])
  const quote = flt !== null ? REP_FAULTS[flt].p : 0
  const Row = ({ label, opts, sel, on }: { label: string; opts: string[]; sel: number | null; on: (i: number) => void }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: P.muted, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {opts.map((o, i) => { const on2 = sel === i; return (
          <button key={i} onClick={() => on(i)} className="ipos-tap" style={{ cursor: 'pointer', padding: '9px 14px', borderRadius: 10, border: `1px solid ${on2 ? 'transparent' : P.border}`, background: on2 ? P.acc : P.surface, color: on2 ? '#fff' : P.ink, fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>{o}</button>
        )})}
      </div>
    </div>
  )
  return (
    <div style={{ ...card, flex: 1, padding: 'clamp(16px,2.5vw,22px)', display: 'flex', flexDirection: 'column', minHeight: 340 }}>
      {done ? <Done tc={tc} sub={tc('landing.till_rep_created')} /> : (<>
        <Row label={tc('landing.till_rep_device')} opts={REP_DEVICES} sel={dev} on={setDev} />
        <Row label={tc('landing.till_rep_fault')} opts={REP_FAULTS.map(f => f.n)} sel={flt} on={setFlt} />
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '12px 14px', background: P.bg, borderRadius: 12, marginBottom: 12, opacity: flt !== null ? 1 : .5 }}>
          <span style={{ fontSize: 12.5, color: P.muted, fontWeight: 600 }}>{tc('landing.till_rep_quote')}{dev !== null ? ` · ${REP_DEVICES[dev]}` : ''}</span>
          <span style={{ fontSize: 18, fontWeight: 900, color: P.acc }}>{money(quote)}</span>
        </div>
        <button onClick={() => dev !== null && flt !== null && setDone(true)} disabled={dev === null || flt === null} style={doneBtn(dev !== null && flt !== null)}>{tc('landing.till_rep_start')}</button>
      </>)}
    </div>
  )
}

// ── Factory production tally ──────────────────────────────────────────────────
function FactoryScreen({ tc, sectorId }: { tc: Tc; sectorId: string }) {
  const [q, setQ] = useState<Record<number, number>>({})
  const [done, setDone] = useState(false)
  useEffect(() => { setQ({}); setDone(false) }, [sectorId])
  useEffect(() => { if (done) { const x = setTimeout(() => { setQ({}); setDone(false) }, 2200); return () => clearTimeout(x) } }, [done])
  const units = Object.values(q).reduce((s, n) => s + n, 0)
  const value = FAC_ITEMS.reduce((s, it, i) => s + it.p * (q[i] || 0), 0)
  const set = (i: number, d: number) => setQ(c => { const n = Math.max(0, (c[i] || 0) + d); const o = { ...c }; if (n === 0) delete o[i]; else o[i] = n; return o })
  return (
    <div style={{ ...card, flex: 1, padding: 'clamp(14px,2.4vw,20px)', display: 'flex', flexDirection: 'column', minHeight: 340 }}>
      {done ? <Done tc={tc} sub={tc('landing.till_fac_dispatched')} /> : (<>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9, overflow: 'auto' }}>
          {FAC_ITEMS.map((it, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px', background: P.bg, borderRadius: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{it.n}</div>
                <div style={{ fontSize: 10.5, color: P.muted }}>{money(it.p)}</div>
              </div>
              <button onClick={() => set(i, -1)} className="ipos-qty">−</button>
              <span style={{ fontSize: 14, fontWeight: 800, minWidth: 20, textAlign: 'center' }}>{q[i] || 0}</span>
              <button onClick={() => set(i, 1)} className="ipos-qty">+</button>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '12px 4px 12px' }}>
          <span style={{ fontSize: 12.5, color: P.muted, fontWeight: 600 }}>{tc('landing.till_fac_output')}</span>
          <span style={{ fontSize: 15, fontWeight: 800 }}>{units} {tc('landing.till_fac_units')} · <span style={{ color: P.acc }}>{money(value)}</span></span>
        </div>
        <button onClick={() => units > 0 && setDone(true)} disabled={units === 0} style={doneBtn(units > 0)}>{tc('landing.till_fac_dispatch')}</button>
      </>)}
    </div>
  )
}

// ── Logistics parcel run ──────────────────────────────────────────────────────
function LogisticsScreen({ tc, sectorId }: { tc: Tc; sectorId: string }) {
  const [del, setDel] = useState<Record<number, boolean>>({})
  useEffect(() => { setDel({}) }, [sectorId])
  const done = Object.values(del).filter(Boolean).length
  return (
    <div style={{ ...card, flex: 1, padding: 'clamp(14px,2.4vw,20px)', display: 'flex', flexDirection: 'column', minHeight: 340 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 800 }}>{tc('landing.vert_logistics_name')}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: done === LOG_PARCELS.length ? P.success : P.muted }}>{tc('landing.till_log_progress', { done, total: LOG_PARCELS.length })}</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9, overflow: 'auto' }}>
        {LOG_PARCELS.map((p, i) => { const d = !!del[i]; return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px', background: d ? 'rgba(22,163,74,.07)' : P.bg, borderRadius: 12, transition: 'background .3s' }}>
            <span style={{ width: 30, height: 30, borderRadius: 8, background: d ? P.success : P.accPale, color: d ? '#fff' : P.acc, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{d ? <path d="M20 6L9 17l-5-5"/> : <><path d="M3 8l9-4 9 4v8l-9 4-9-4V8z"/><path d="M3 8l9 4 9-4"/></>}</svg>
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700 }}>{p.id} · {p.to}</div>
              <div style={{ fontSize: 10.5, color: P.muted }}>COD {money(p.cod)}</div>
            </div>
            <button onClick={() => setDel(c => ({ ...c, [i]: !c[i] }))} className="ipos-tap" style={{ cursor: 'pointer', padding: '7px 13px', borderRadius: 9, border: `1px solid ${d ? 'transparent' : P.border}`, background: d ? P.success : P.surface, color: d ? '#fff' : P.ink, fontSize: 12.5, fontWeight: 700, fontFamily: 'inherit', flexShrink: 0 }}>
              {d ? tc('landing.till_log_done') : tc('landing.till_log_deliver')}
            </button>
          </div>
        )})}
      </div>
    </div>
  )
}

export default function InteractivePosDemo({ tc, lang }: { tc: Tc; lang?: string }) {
  const [sector, setSector] = useState(0)
  const S = SECTORS[sector]
  return (
    <div style={{ padding: 'clamp(14px,2.4vw,22px)', minHeight: 574, display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 13px', borderRadius: 9999, background: P.accPale, color: P.acc, fontSize: 12, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', flexShrink: 0 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.2"/></svg>
          {tc('landing.hero_pos_label')}
        </span>
        <span style={{ fontSize: 11.5, color: P.muted, fontWeight: 700 }}>{tc('landing.hero_pos_tag')}</span>
      </div>
      <div style={{ display: 'flex', gap: 7, marginBottom: 16, overflowX: 'auto', paddingBottom: 2 }}>
        {SECTORS.map((s, z) => { const on = z === sector; return (
          <button key={s.id} onClick={() => setSector(z)} style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 9999, cursor: 'pointer', border: `1px solid ${on ? 'transparent' : P.border}`, background: on ? P.acc : P.surface, color: on ? '#fff' : P.ink, fontSize: 13.5, fontWeight: 700, fontFamily: 'inherit', transition: 'background .25s, color .25s' }}>
            <span style={{ fontSize: 14 }}>{s.emoji}</span>{tc(`landing.${s.nameKey}`)}
          </button>
        )})}
      </div>

      {S.kind === 'sell' && <SellScreen tc={tc} sectorId={S.id} />}
      {S.kind === 'repair' && <RepairScreen tc={tc} sectorId={S.id} />}
      {S.kind === 'factory' && <FactoryScreen tc={tc} sectorId={S.id} />}
      {S.kind === 'logistics' && <LogisticsScreen tc={tc} sectorId={S.id} />}

      <div style={{ textAlign: 'center', marginTop: 'clamp(12px,2vw,18px)' }}>
        <p style={{ fontSize: 12.5, color: P.muted, lineHeight: 1.55, maxWidth: 640, margin: '0 auto 12px' }}>{tc('landing.hero_pos_caption')}</p>
        <a href={`https://pos.askbiz.co/preview${lang ? `?lang=${lang}` : ''}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 9999, background: P.acc, color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none', boxShadow: '0 10px 24px -10px rgba(208,138,89,.7)' }}>
          {tc('landing.hero_pos_try')}
          <span style={{ width: 21, height: 21, borderRadius: '50%', background: 'rgba(255,255,255,.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg>
          </span>
        </a>
      </div>

      <style>{`
        .ipos-qty{width:22px;height:22px;border-radius:6px;border:1px solid ${P.border};background:${P.bg};cursor:pointer;font-size:13px;font-weight:700;color:${P.muted}}
        .ipos-tap{transition:transform .12s ease}.ipos-tap:active{transform:scale(.95)}
        @keyframes ipos-in{0%{opacity:0;transform:translateX(10px)}100%{opacity:1;transform:translateX(0)}}
        @keyframes ipos-pop{0%{transform:scale(.4);opacity:0}100%{transform:scale(1);opacity:1}}
        .ipos-dots{display:inline-flex;gap:3px}.ipos-dots i{width:5px;height:5px;border-radius:50%;background:#fff;animation:ipos-blink 1s ease-in-out infinite}
        .ipos-dots i:nth-child(2){animation-delay:.15s}.ipos-dots i:nth-child(3){animation-delay:.3s}
        @keyframes ipos-blink{0%,100%{opacity:.4}50%{opacity:1}}
        @media(max-width:760px){ .ipos-main{ grid-template-columns:1fr !important } }
      `}</style>
    </div>
  )
}
