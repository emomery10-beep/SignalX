'use client'
import { useState, useEffect, useRef } from 'react'

// ── Flow Scan Demo ────────────────────────────────────────────────────────────
// The secondary moat flows (stock / expense / repair / parcel) all work the same
// way in the real product: photograph something → AI extracts fields → confirm.
// This presents that faithfully with the real POS tokens: a camera scan of the
// relevant object, then a "Recognised" card listing the exact fields each feature
// extracts (verified against the pos-askbiz scan APIs). Pure CSS/SVG, crawler-safe.
// Runs only while `active`; shows the recognised card statically under reduced-motion.

type Tc = (k: string, vars?: Record<string, string | number>) => string
type FlowKey = 'stock' | 'expense' | 'repair' | 'parcel'

const P = {
  bg: '#f9f8f6', surface: '#ffffff', border: '#e5e2dc', ink: '#1a1916',
  muted: '#6b6760', acc: '#d08a59', accPale: 'rgba(208,138,89,0.12)',
  success: '#16a34a', camera: '#141110',
}

function Obj({ kind, color, size = 1 }: { kind: FlowKey; color: string; size?: number }) {
  const s = (n: number) => n * size
  switch (kind) {
    case 'stock': // carton/box
      return <svg width={s(72)} height={s(72)} viewBox="0 0 72 72" fill="none"><path d="M36 6 8 18v36l28 12 28-12V18z" fill={color} opacity=".9"/><path d="M8 18l28 12 28-12M36 30v36" stroke="#fff" strokeWidth="2" opacity=".6"/><rect x="26" y="20" width="20" height="10" rx="2" fill="#fff" opacity=".85"/></svg>
    case 'expense': // receipt
      return <svg width={s(56)} height={s(76)} viewBox="0 0 56 76" fill="none"><path d="M8 4h40v64l-6-4-6 4-6-4-6 4-6-4-4 3z" fill={color}/><rect x="16" y="18" width="24" height="3" rx="1.5" fill="#fff" opacity=".9"/><rect x="16" y="27" width="24" height="3" rx="1.5" fill="#fff" opacity=".7"/><rect x="16" y="36" width="16" height="3" rx="1.5" fill="#fff" opacity=".6"/><rect x="16" y="49" width="24" height="4" rx="2" fill="#fff" opacity=".95"/></svg>
    case 'repair': // phone
      return <svg width={s(48)} height={s(76)} viewBox="0 0 48 76" fill="none"><rect x="6" y="4" width="36" height="68" rx="8" fill={color}/><rect x="11" y="12" width="26" height="48" rx="3" fill="#fff" opacity=".9"/><circle cx="24" cy="66" r="2.4" fill="#fff" opacity=".8"/></svg>
    case 'parcel': // parcel with label
      return <svg width={s(72)} height={s(64)} viewBox="0 0 72 64" fill="none"><rect x="8" y="14" width="56" height="44" rx="4" fill={color}/><path d="M8 26h56" stroke="#fff" strokeWidth="2" opacity=".5"/><rect x="42" y="22" width="16" height="12" rx="2" fill="#fff" opacity=".92"/><path d="M45 25h10M45 28h10M45 31h6" stroke={color} strokeWidth="1.4" opacity=".8"/></svg>
  }
}

const CFG: Record<FlowKey, { business?: boolean }> = {
  stock: {}, expense: { business: true }, repair: {}, parcel: {},
}

export default function FlowScanDemo({ tc, flowKey, active }: { tc: Tc; flowKey: FlowKey; active: boolean }) {
  const [step, setStep] = useState(0)   // 0 = scanning, 1 = recognised
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Always animates (hero demo — the motion is the point). Loops camera → card.
  useEffect(() => {
    if (!active) return
    setStep(0)
    const dur = [1600, 2800]
    const run = (s: number) => { timer.current = setTimeout(() => { const n = (s + 1) % 2; setStep(n); run(n) }, dur[s]) }
    run(0)
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [active, flowKey])

  const scanning = step === 0
  const cfg = CFG[flowKey]

  return (
    <div style={{ position: 'absolute', inset: 0, background: P.camera, overflow: 'hidden',
      fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>

      {/* camera top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 12px 0' }}>
        <span style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(255,255,255,.15)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>←</span>
        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,.12)', borderRadius: 9, padding: 3 }}>
          <span style={{ padding: '4px 12px', borderRadius: 7, background: '#fff', color: P.ink, fontSize: 11, fontWeight: 700 }}>{tc('landing.moat_demo_tab_camera')}</span>
          <span style={{ padding: '4px 12px', borderRadius: 7, color: 'rgba(255,255,255,.7)', fontSize: 11, fontWeight: 600 }}>{tc('landing.moat_demo_tab_search')}</span>
        </div>
      </div>

      {/* viewfinder */}
      <div style={{ position: 'relative', height: '46%', margin: '14px 16px 0', borderRadius: 16, overflow: 'hidden' }}>
        {[['t','l'],['t','r'],['b','l'],['b','r']].map(([v,h],z)=>(
          <span key={z} style={{ position:'absolute', top:v==='t'?0:undefined, bottom:v==='b'?0:undefined, left:h==='l'?0:undefined, right:h==='r'?0:undefined, width:22, height:22,
            borderTop:v==='t'?`2px solid ${P.acc}`:undefined, borderBottom:v==='b'?`2px solid ${P.acc}`:undefined, borderLeft:h==='l'?`2px solid ${P.acc}`:undefined, borderRight:h==='r'?`2px solid ${P.acc}`:undefined,
            borderTopLeftRadius:v==='t'&&h==='l'?7:0, borderTopRightRadius:v==='t'&&h==='r'?7:0, borderBottomLeftRadius:v==='b'&&h==='l'?7:0, borderBottomRightRadius:v==='b'&&h==='r'?7:0 }} />
        ))}
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', transform: scanning?'scale(1)':'scale(.92)', opacity: scanning?1:.55, transition:'transform .4s cubic-bezier(0.22,1,0.36,1), opacity .4s ease' }}>
          <Obj kind={flowKey} color={flowKey==='expense'?'#Ece7df':P.acc==='#d08a59'?'#c98a5e':P.acc} size={1} />
        </div>
        <div aria-hidden style={{ position:'absolute', left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${P.acc},transparent)`, boxShadow:`0 0 12px ${P.acc}`,
          opacity: scanning?1:0, animation: scanning?'moat-scan 1.1s ease-in-out infinite':'none' }} />
        <div style={{ position:'absolute', top:10, left:'50%', transform:'translateX(-50%)', display:'flex', alignItems:'center', gap:6, fontSize:10.5, fontWeight:600, color:'rgba(255,255,255,.85)', whiteSpace:'nowrap' }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:P.acc, animation: scanning?'moat-pulse 1s ease-in-out infinite':'none' }} />
          {scanning ? tc('landing.moat_demo_scanning') : tc('landing.moat_scan_point')}
        </div>
      </div>

      {/* recognised card */}
      <div style={{ position:'absolute', left:0, right:0, bottom:0, background:P.surface, borderTopLeftRadius:22, borderTopRightRadius:22, padding:'18px 18px 20px',
        transform: scanning?'translateY(101%)':'translateY(0)', transition:'transform .4s cubic-bezier(0.22,1,0.36,1)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, fontWeight:700, color:P.success, marginBottom:10 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={P.success} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
          {tc('landing.moat_demo_recognised')}
          {cfg.business && <span style={{ marginLeft:'auto', fontSize:9.5, fontWeight:600, letterSpacing:'.05em', textTransform:'uppercase', color:P.acc, background:P.accPale, padding:'2px 7px', borderRadius:9999 }}>{tc('landing.moat_plan_business')}</span>}
        </div>
        <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:14 }}>
          <span style={{ width:44, height:44, borderRadius:11, background:P.accPale, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <Obj kind={flowKey} color={P.acc} size={0.5} />
          </span>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:15.5, fontWeight:800, color:P.ink, lineHeight:1.2, marginBottom:4 }}>{tc(`landing.moat_scan_${flowKey}_title`)}</div>
            <div style={{ fontSize:12, color:P.muted, lineHeight:1.5 }}>{tc(`landing.moat_scan_${flowKey}_sub`)}</div>
          </div>
        </div>
        <div style={{ padding:'13px', borderRadius:12, background:P.acc, color:'#fff', fontSize:14.5, fontWeight:700, textAlign:'center' }}>
          {tc(`landing.moat_scan_${flowKey}_action`)}
        </div>
      </div>

      <style>{`
        @keyframes moat-scan{0%{top:8%}50%{top:84%}100%{top:8%}}
        @keyframes moat-pulse{0%,100%{opacity:.35}50%{opacity:1}}
      `}</style>
    </div>
  )
}
