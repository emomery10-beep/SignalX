'use client'
import { useState, useEffect, useRef } from 'react'

// ── Camera Checkout Demo ──────────────────────────────────────────────────────
// A self-presenting montage of the REAL AskBiz cashier (pos.askbiz.co), rebuilt
// faithfully from pos-askbiz/app/sell/page.tsx. It ALWAYS animates through a clear
// 3-step flow — ① Scan → ② Cart → ③ Pay — with slow, deliberate entries, on a
// loop. Pure CSS/SVG (no iframe/images), crawler-safe. Motion is intentional here
// (hero demo): we keep it GPU-cheap (transform/opacity) but do not freeze it,
// since the movement is the whole point of the section.

type Tc = (k: string, vars?: Record<string, string | number>) => string

const P = {
  bg: '#f9f8f6', surface: '#ffffff', border: '#e5e2dc', ink: '#1a1916',
  muted: '#6b6760', acc: '#d08a59', accPale: 'rgba(208,138,89,0.12)',
  success: '#16a34a', camera: '#141110',
}

const ITEMS = [
  { name: 'Coca-Cola 500ml', price: 80 },
  { name: 'Blue Band 250g',  price: 190 },
]
const TOTAL = ITEMS.reduce((s, x) => s + x.price, 0)
const money = (n: number) => 'KSh ' + n.toFixed(2)

// Beat timeline — deliberately slow so each step reads. ph = phase, p = product,
// m = mode. Loops forever.
const BEATS: { ph: 'scan' | 'cart' | 'pay'; p?: number; m?: string; n?: number }[] = [
  { ph: 'scan', p: 0, m: 'aim' },
  { ph: 'scan', p: 0, m: 'scan' },
  { ph: 'scan', p: 0, m: 'found' },
  { ph: 'scan', p: 1, m: 'aim' },
  { ph: 'scan', p: 1, m: 'scan' },
  { ph: 'scan', p: 1, m: 'found' },
  { ph: 'cart', n: 2 },
  { ph: 'pay',  m: 'req' },
  { ph: 'pay',  m: 'done' },
]
const DUR = [1200, 1100, 1600, 1100, 1100, 1600, 2800, 2000, 2200]

const STEPS = [
  { k: 'moat_step_scan', ph: 'scan' },
  { k: 'moat_step_cart', ph: 'cart' },
  { k: 'moat_step_pay',  ph: 'pay' },
]

function Bottle({ color, size = 1 }: { color: string; size?: number }) {
  return (
    <svg width={52 * size} height={92 * size} viewBox="0 0 52 92" fill="none">
      <rect x="20" y="2" width="12" height="9" rx="2" fill={color} opacity="0.9" />
      <path d="M19 11h14c0 6 5 8 5 15v55a7 7 0 0 1-7 7H21a7 7 0 0 1-7-7V26c0-7 5-9 5-15z" fill={color} />
      <rect x="14" y="46" width="24" height="22" rx="3" fill="#fff" opacity="0.92" />
      <rect x="18" y="52" width="16" height="2.4" rx="1.2" fill={color} opacity="0.7" />
    </svg>
  )
}
function Tub({ color, size = 1 }: { color: string; size?: number }) {
  return (
    <svg width={66 * size} height={70 * size} viewBox="0 0 66 70" fill="none">
      <rect x="6" y="16" width="54" height="10" rx="3" fill={color} opacity="0.92" />
      <path d="M10 26h46l-4 38a5 5 0 0 1-5 4H19a5 5 0 0 1-5-4l-4-38z" fill={color} />
      <rect x="18" y="38" width="30" height="20" rx="3" fill="#fff" opacity="0.92" />
    </svg>
  )
}
const Product = ({ i, ...p }: { i: number; color: string; size?: number }) =>
  i === 1 ? <Tub {...p} /> : <Bottle {...p} />

export default function CameraCheckoutDemo({ tc, active }: { tc: Tc; active: boolean }) {
  const [beat, setBeat] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!active) return
    setBeat(0)
    const run = (b: number) => {
      timer.current = setTimeout(() => { const n = (b + 1) % BEATS.length; setBeat(n); run(n) }, DUR[b])
    }
    run(0)
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [active])

  const B = BEATS[beat]
  const phase = B.ph
  const prod = B.p ?? 0
  const scanning = B.m === 'scan'
  const found = B.m === 'found'
  const activeStep = phase === 'scan' ? 0 : phase === 'cart' ? 1 : 2

  const Screen = ({ show, bg, children }: { show: boolean; bg: string; children: React.ReactNode }) => (
    <div style={{ position: 'absolute', inset: 0, background: bg, opacity: show ? 1 : 0,
      transform: show ? 'scale(1)' : 'scale(1.02)', transition: 'opacity .55s ease, transform .55s cubic-bezier(0.22,1,0.36,1)',
      pointerEvents: show ? 'auto' : 'none', display: 'flex', flexDirection: 'column' }}>
      {children}
    </div>
  )

  return (
    <div style={{ position: 'absolute', inset: 0, background: P.bg, overflow: 'hidden',
      fontFamily: 'var(--font-jakarta), system-ui, sans-serif', color: P.ink, display: 'flex', flexDirection: 'column' }}>

      {/* ── STEP INDICATOR ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 6, padding: '10px 12px 8px', background: P.surface, borderBottom: `1px solid ${P.border}`, position: 'relative', zIndex: 5 }}>
        {STEPS.map((s, z) => {
          const on = z === activeStep, done = z < activeStep
          return (
            <div key={z} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 17, height: 17, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9.5, fontWeight: 800, background: on || done ? P.acc : P.accPale, color: on || done ? '#fff' : P.acc,
                transition: 'background .4s ease, color .4s ease' }}>
                {done ? '✓' : z + 1}
              </span>
              <span style={{ fontSize: 9.5, fontWeight: on ? 800 : 600, color: on ? P.ink : P.muted, transition: 'color .4s ease', whiteSpace: 'nowrap' }}>{tc(`landing.${s.k}`)}</span>
            </div>
          )
        })}
      </div>

      <div style={{ position: 'relative', flex: 1 }}>

        {/* ── ① SCAN ─────────────────────────────────────────────── */}
        <Screen show={phase === 'scan'} bg={P.camera}>
          <div style={{ position: 'relative', flex: 1, margin: 14, borderRadius: 16, overflow: 'hidden' }}>
            {[['t','l'],['t','r'],['b','l'],['b','r']].map(([v,h],z)=>(
              <span key={z} style={{ position:'absolute', top:v==='t'?0:undefined, bottom:v==='b'?0:undefined, left:h==='l'?0:undefined, right:h==='r'?0:undefined, width:22, height:22,
                borderTop:v==='t'?`2px solid ${P.acc}`:undefined, borderBottom:v==='b'?`2px solid ${P.acc}`:undefined, borderLeft:h==='l'?`2px solid ${P.acc}`:undefined, borderRight:h==='r'?`2px solid ${P.acc}`:undefined,
                borderTopLeftRadius:v==='t'&&h==='l'?7:0, borderTopRightRadius:v==='t'&&h==='r'?7:0, borderBottomLeftRadius:v==='b'&&h==='l'?7:0, borderBottomRightRadius:v==='b'&&h==='r'?7:0 }} />
            ))}
            {/* product slowly enters */}
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
              transform: found ? 'scale(.86) translateY(-6px)' : scanning ? 'scale(1)' : 'scale(.8) translateY(10px)',
              opacity: 1, transition:'transform .7s cubic-bezier(0.22,1,0.36,1)' }}>
              <Product i={prod} color={prod===1?'#E4A950':'#D64545'} size={1.2} />
            </div>
            {/* scan sweep */}
            <div aria-hidden style={{ position:'absolute', left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${P.acc},transparent)`, boxShadow:`0 0 12px ${P.acc}`,
              opacity: scanning?1:0, animation: scanning?'moat-scan 1.1s ease-in-out infinite':'none' }} />
            {/* status */}
            <div style={{ position:'absolute', top:10, left:'50%', transform:'translateX(-50%)', display:'flex', alignItems:'center', gap:6, fontSize:10.5, fontWeight:600, color:'rgba(255,255,255,.85)', whiteSpace:'nowrap' }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:P.acc, animation: scanning?'moat-pulse 1s ease-in-out infinite':'none' }} />
              {scanning ? tc('landing.moat_demo_scanning') : tc('landing.moat_demo_pointlabel')}
            </div>
            {/* recognised chip slides up */}
            <div style={{ position:'absolute', left:'50%', bottom:14, transform:`translateX(-50%) translateY(${found?'0':'16px'})`, opacity: found?1:0,
              transition:'opacity .5s ease, transform .6s cubic-bezier(0.22,1,0.36,1)',
              display:'flex', alignItems:'center', gap:8, background:'#fff', borderRadius:9999, padding:'7px 13px 7px 9px', boxShadow:'0 8px 20px rgba(0,0,0,.28)', whiteSpace:'nowrap' }}>
              <span style={{ width:18, height:18, borderRadius:'50%', background:P.success, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              </span>
              <span style={{ fontSize:11.5, fontWeight:700, color:P.ink }}>{ITEMS[prod].name}</span>
              <span style={{ fontSize:11.5, fontWeight:700, color:P.acc }}>{money(ITEMS[prod].price)}</span>
            </div>
          </div>
        </Screen>

        {/* ── ② CART ─────────────────────────────────────────────── */}
        <Screen show={phase === 'cart'} bg={P.bg}>
          <div style={{ padding:'12px 14px 4px', display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
            <span style={{ fontSize:14, fontWeight:800 }}>{tc('landing.moat_demo_cart')}</span>
            <span style={{ fontSize:11.5, color:P.muted }}>{tc('landing.moat_demo_items', { n: 2 })}</span>
          </div>
          <div style={{ flex:1, padding:'6px 12px' }}>
            {ITEMS.map((it,k)=>(
              <div key={k} style={{ background:P.surface, borderRadius:13, border:`1px solid ${P.border}`, padding:'11px 12px', marginBottom:9,
                display:'flex', alignItems:'center', gap:10,
                opacity: phase==='cart'?1:0, transform: phase==='cart'?'translateY(0)':'translateY(14px)',
                transition:`opacity .6s ease ${0.15 + k*0.35}s, transform .6s cubic-bezier(0.22,1,0.36,1) ${0.15 + k*0.35}s` }}>
                <span style={{ width:34, height:34, borderRadius:9, background:P.accPale, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Product i={k} color={P.acc} size={0.42} />
                </span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12.5, fontWeight:600, lineHeight:1.2, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{it.name}</div>
                  <div style={{ fontSize:10.5, color:P.muted, marginTop:1 }}>{money(it.price)} {tc('landing.moat_demo_each')}</div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:3, flexShrink:0 }}>
                  <span style={{ width:21, height:21, borderRadius:6, border:`1px solid ${P.border}`, background:P.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:P.muted }}>−</span>
                  <span style={{ fontSize:12.5, fontWeight:700, minWidth:11, textAlign:'center' }}>1</span>
                  <span style={{ width:21, height:21, borderRadius:6, border:`1px solid ${P.border}`, background:P.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:P.muted }}>+</span>
                </div>
                <div style={{ fontSize:12.5, fontWeight:800, minWidth:44, textAlign:'right', flexShrink:0 }}>{money(it.price)}</div>
              </div>
            ))}
          </div>
          <div style={{ padding:'12px 16px 16px', background:P.surface, borderTop:`1px solid ${P.border}`,
            opacity: phase==='cart'?1:0, transform: phase==='cart'?'translateY(0)':'translateY(12px)', transition:'opacity .6s ease .9s, transform .6s cubic-bezier(0.22,1,0.36,1) .9s' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:11 }}>
              <span style={{ fontSize:14, fontWeight:600, color:P.muted }}>{tc('landing.moat_demo_total')}</span>
              <span style={{ fontSize:20, fontWeight:900 }}>{money(TOTAL)}</span>
            </div>
            <div style={{ padding:'12px', borderRadius:12, background:P.acc, color:'#fff', fontSize:15, fontWeight:700, textAlign:'center' }}>{tc('landing.moat_demo_checkout')} →</div>
          </div>
        </Screen>

        {/* ── ③ PAY ──────────────────────────────────────────────── */}
        <Screen show={phase === 'pay'} bg={P.bg}>
          <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, textAlign:'center' }}>
            {B.m === 'done' ? (
              <>
                <span style={{ width:66, height:66, borderRadius:'50%', background:P.success, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16, animation:'moat-pop .5s cubic-bezier(0.22,1.6,0.4,1)' }}>
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                </span>
                <div style={{ fontSize:17, fontWeight:800, marginBottom:5 }}>{tc('landing.moat_demo_success')}</div>
                <div style={{ fontSize:20, fontWeight:900, color:P.acc, marginBottom:8 }}>{money(TOTAL)}</div>
                <div style={{ fontSize:12.5, color:P.muted }}>{tc('landing.moat_demo_success_sub')}</div>
              </>
            ) : (
              <>
                <span style={{ width:60, height:60, borderRadius:16, background:P.success, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="3"/><path d="M11 18h2"/></svg>
                </span>
                <div style={{ fontSize:13, fontWeight:700, color:P.success, marginBottom:6 }}>{tc('landing.moat_demo_pay_mpesa')}</div>
                <div style={{ fontSize:22, fontWeight:900, marginBottom:8 }}>{money(TOTAL)}</div>
                <div style={{ fontSize:12.5, color:P.muted, lineHeight:1.5, maxWidth:200 }}>{tc('landing.moat_demo_pay_prompt')}</div>
                <div style={{ marginTop:16, display:'flex', gap:5 }}>
                  {[0,1,2].map(d=>(<span key={d} style={{ width:7, height:7, borderRadius:'50%', background:P.success, animation:`moat-pulse 1.2s ease-in-out ${d*0.2}s infinite` }} />))}
                </div>
              </>
            )}
          </div>
        </Screen>
      </div>

      <style>{`
        @keyframes moat-scan{0%{top:8%}50%{top:88%}100%{top:8%}}
        @keyframes moat-pulse{0%,100%{opacity:.35}50%{opacity:1}}
        @keyframes moat-pop{0%{transform:scale(.4);opacity:0}100%{transform:scale(1);opacity:1}}
      `}</style>
    </div>
  )
}
