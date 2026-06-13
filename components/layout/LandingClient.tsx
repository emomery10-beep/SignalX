'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { LanguageProvider, useLang } from '@/components/LanguageProvider'
import type { Lang } from '@/lib/i18n'
import { COUNTRY_TO_LANG } from '@/lib/i18n'

// ── Palettes — light default, dark for prefers-color-scheme: dark ────────────
type Palette = typeof LIGHT
const LIGHT = {
  bg:         '#ffffff',
  sf:         '#f5f5f5',
  ev:         '#eeecea',
  ev2:        '#e4e2de',
  tx:         '#1a1916',
  tx2:        '#4e4a46',
  tx3:        '#767270', // darkened from #908c87 — 4.79:1 on white (was 3.35:1, failed WCAG AA)
  b:          'rgba(0,0,0,.08)',
  b2:         'rgba(0,0,0,.14)',
  acc:        '#c97a44',
  accBg:      'rgba(201,122,68,.10)',
  accBdr:     'rgba(201,122,68,.30)',
  nav:        'rgba(255,255,255,.92)',
  navBorder:  'rgba(0,0,0,.08)',
  heroGlow:   'rgba(201,122,68,.08)',
}
const DARK = {
  bg:         '#0e0d0c',
  sf:         '#141210',
  ev:         '#1c1a17',
  ev2:        '#242018',
  tx:         '#f0ede8',
  tx2:        '#a09a92',
  tx3:        '#807c77', // lightened from #5a5550 — 4.74:1 on dark bg (was 2.66:1, failed WCAG AA)
  b:          'rgba(255,255,255,.07)',
  b2:         'rgba(255,255,255,.12)',
  acc:        '#d08a59',
  accBg:      'rgba(208,138,89,.12)',
  accBdr:     'rgba(208,138,89,.28)',
  nav:        'rgba(14,13,12,.88)',
  navBorder:  'rgba(255,255,255,.07)',
  heroGlow:   'rgba(208,138,89,.14)',
}
// C is set per-component instance based on system preference — see usePalette()
const C = LIGHT // fallback for module-level usage (DemoScreen, etc.)

interface Geo {
  country: string; countryCode: string; city: string
  currency: string; currencySymbol: string; currencyName: string; flag: string
  pricing: { growth: string; business: string; sym: string; pos: string }
}

const INTEGRATIONS = [
  'Shopify', 'Amazon FBA', 'TikTok Shop', 'Instagram', 'Stripe',
  'QuickBooks', 'Google Sheets', 'Pinterest', 'Square', 'CSV / Excel',
]

const TOOLS = [
  { label: 'FX Risk Modeller', desc: 'Model sterling falling 5%, 10%, 15% against your import currency. See exactly which product lines go below your minimum margin before it happens.' },
  { label: 'Supplier Scorecard', desc: 'Every supplier graded A–F from your shipment history. On-time rate, average delay days, customs holds, and financial impact — all in one view.' },
  { label: 'Landed Cost Calculator', desc: 'True cost per unit: supplier price + freight + duty + VAT + FX buffer. Reveals the margin gap between what you assumed and what you\'re actually making.' },
  { label: 'Export Market Scoring', desc: '20 markets scored by ecommerce growth, logistics, UK brand premium, duty environment, and your specific product-category match.' },
  { label: 'Social Commerce', desc: 'TikTok Shop, Instagram, and Pinterest connected. Conversion rates, demand signals, and viral product alerts before you run out of stock.' },
]

const TESTIMONIALS = [
  {
    name: 'David O.', role: 'Amazon FBA', location: 'Lagos',
    text: 'Connected my Amazon store and it found a margin problem I had been missing for 4 months. Fixed it the same day. Added £400/month to my bottom line without changing anything else.',
    avatar: 'DO',
  },
  {
    name: 'Sarah M.', role: 'Shopify seller', location: 'London',
    text: 'The Business Pulse score changed how I start every morning. Within 10 seconds I know whether I need to act on something or can get on with my day.',
    avatar: 'SM',
  },
  {
    name: 'James K.', role: 'Retail shop owner', location: 'Nairobi',
    text: 'I used to spend 2 hours every Monday pulling reports. Now I ask three questions and I\'m done in 4 minutes. The time saving alone is worth the subscription.',
    avatar: 'JK',
  },
]

const DEMO_SLIDES = [
  {
    id: 'ai-chat',
    title: 'Ask questions in plain English',
    desc: 'Type a question about your business — revenue, margins, stock levels, customer trends — and get specific answers with your actual numbers.',
    steps: ['Connect your store or upload a CSV', 'Type a question in the chat', 'Get insights with real numbers instantly'],
    label: 'AI Answers',
    thumb: '💬',
    screen: 'chat',
  },
  {
    id: 'supplier',
    title: 'Grade every supplier A–F',
    desc: 'Your supplier scorecard is built automatically from shipment data. See on-time rates, delay averages, customs holds, and the P&L impact of each supplier.',
    steps: ['Connect your logistics or upload shipment data', 'View automatic grades for every supplier', 'Spot underperformers costing you money'],
    label: 'Supplier Scorecard',
    thumb: '🏭',
    screen: 'supplier',
  },
  {
    id: 'fx',
    title: 'Model currency risk before it hits',
    desc: 'See what happens to your margins if sterling drops 5%, 10%, or 15% against your import currencies. Know exactly which product lines go below your minimum margin.',
    steps: ['Select your import currencies', 'Set drop scenarios (5%, 10%, 15%)', 'See which SKUs lose margin first'],
    label: 'FX Risk Monitor',
    thumb: '💱',
    screen: 'fx',
  },
  {
    id: 'export',
    title: 'Find your best export market',
    desc: '20 markets scored by ecommerce growth, logistics quality, UK brand premium, duty environment, and your specific product category match.',
    steps: ['Your product mix is analysed automatically', 'Markets scored 0–100 for your categories', 'See duty rates, premiums, and top channels'],
    label: 'Export Markets',
    thumb: '🌍',
    screen: 'export',
  },
]

function DemoScreen({ screen, C }: { screen: string; C: Palette }) {
  if (screen === 'chat') return (
    <div style={{ display:'flex', flexDirection:'column', gap:10, padding:'14px 16px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
        <div style={{ width:24, height:24, borderRadius:7, background:C.acc, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="10" height="10" viewBox="0 0 32 32" fill="none"><rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.5"/><rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.75"/><rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/></svg>
        </div>
        <span style={{ fontSize:12, fontWeight:700, color:C.tx }}>AskBiz AI</span>
        <span style={{ fontSize:9, color:'#22c55e', display:'flex', alignItems:'center', gap:3 }}>
          <span style={{ width:4, height:4, borderRadius:'50%', background:'#22c55e', display:'inline-block' }}/>Online
        </span>
      </div>
      <div style={{ display:'flex', justifyContent:'flex-end' }}>
        <div style={{ padding:'8px 12px', borderRadius:14, borderBottomRightRadius:3, background:C.ev2, border:`1px solid ${C.b}`, fontSize:12, color:C.tx, maxWidth:'85%' }}>What is my best margin product?</div>
      </div>
      <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
        <div style={{ width:24, height:24, borderRadius:7, background:C.acc, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2 }}>
          <svg width="10" height="10" viewBox="0 0 32 32" fill="none"><rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.5"/><rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.75"/><rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/></svg>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ padding:'8px 12px', borderRadius:14, borderBottomLeftRadius:3, background:C.ev, border:`1px solid ${C.b}`, fontSize:11, lineHeight:1.65, color:C.tx, marginBottom:8 }}>
            <strong>Wireless Earbuds</strong> — 34.2% gross margin, £8.22 profit per unit. At 143 units/month that&apos;s <strong>£1,175</strong> in monthly profit.
          </div>
          <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
            <span className="kpi-chip" style={{ background:'rgba(34,197,94,.08)', color:'#4ade80', borderColor:'rgba(34,197,94,.2)', fontSize:10, padding:'3px 8px' }}><span style={{ opacity:.7 }}>Margin</span> <strong>34.2%</strong></span>
            <span className="kpi-chip" style={{ background:'rgba(34,197,94,.08)', color:'#4ade80', borderColor:'rgba(34,197,94,.2)', fontSize:10, padding:'3px 8px' }}><span style={{ opacity:.7 }}>Profit</span> <strong>£1,175/mo</strong></span>
          </div>
        </div>
      </div>
    </div>
  )
  if (screen === 'supplier') return (
    <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', gap:8 }}>
      <div style={{ fontSize:12, fontWeight:700, color:C.tx, marginBottom:2 }}>Supplier Scorecard <span style={{ fontSize:10, fontWeight:400, color:C.tx3 }}>— Last 6 months</span></div>
      {[
        { name:'Guangzhou Tech Co.', grade:'A', color:'#4ade80', onTime:'96%', delay:'0.4d', impact:'+£2,100' },
        { name:'Shenzhen Goods Ltd', grade:'B', color:C.acc, onTime:'81%', delay:'2.1d', impact:'-£380' },
        { name:'Alibaba Exports Co.', grade:'D', color:'#f87171', onTime:'62%', delay:'6.8d', impact:'-£1,940' },
      ].map((s,i) => (
        <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', background:C.ev, borderRadius:8, border:`1px solid ${C.b}` }}>
          <div style={{ width:28, height:28, borderRadius:6, background:`${s.color}18`, border:`1px solid ${s.color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-sora)', fontWeight:800, fontSize:14, color:s.color }}>{s.grade}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:11, fontWeight:600, color:C.tx }}>{s.name}</div>
            <div style={{ fontSize:9, color:C.tx3 }}>On-time: {s.onTime} · Avg delay: {s.delay}</div>
          </div>
          <div style={{ fontSize:11, fontWeight:700, color:s.impact.startsWith('+') ? '#4ade80' : '#f87171' }}>{s.impact}/mo</div>
        </div>
      ))}
    </div>
  )
  if (screen === 'fx') return (
    <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', gap:8 }}>
      <div style={{ fontSize:12, fontWeight:700, color:C.tx, marginBottom:2 }}>FX Risk Monitor <span style={{ fontSize:10, fontWeight:400, color:C.tx3 }}>— Sterling drop scenario</span></div>
      <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr 1fr 1fr', gap:4, padding:'4px 0' }}>
        {['Pair','−5%','−10%','−15%'].map(h => <div key={h} style={{ fontSize:9, fontWeight:700, color:C.tx3, textTransform:'uppercase' }}>{h}</div>)}
      </div>
      {[
        { pair:'GBP / CNY', d5:'-£920', d10:'-£1,840', d15:'-£2,760', risk:'high' },
        { pair:'GBP / USD', d5:'-£310', d10:'-£620', d15:'-£930', risk:'medium' },
        { pair:'GBP / AED', d5:'-£155', d10:'-£310', d15:'-£465', risk:'low' },
      ].map((p,i) => (
        <div key={i} style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr 1fr 1fr', gap:4, padding:'8px 0', borderTop:`1px solid ${C.b}`, alignItems:'center' }}>
          <div><div style={{ fontSize:11, fontWeight:600, color:C.tx }}>{p.pair}</div><span style={{ fontSize:8, fontWeight:700, color:p.risk==='high'?'#f87171':p.risk==='medium'?C.acc:'#4ade80', background:p.risk==='high'?'rgba(248,113,113,.1)':p.risk==='medium'?C.accBg:'rgba(74,222,128,.08)', padding:'1px 5px', borderRadius:3 }}>{p.risk}</span></div>
          <div style={{ fontSize:11, color:C.acc, fontWeight:600 }}>{p.d5}</div>
          <div style={{ fontSize:11, color:'#f87171', fontWeight:600 }}>{p.d10}</div>
          <div style={{ fontSize:11, color:'#ef4444', fontWeight:700 }}>{p.d15}</div>
        </div>
      ))}
    </div>
  )
  return (
    <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', gap:8 }}>
      <div style={{ fontSize:12, fontWeight:700, color:C.tx, marginBottom:2 }}>Export Market Scoring <span style={{ fontSize:10, fontWeight:400, color:C.tx3 }}>— Your product mix</span></div>
      {[
        { flag:'🇦🇪', name:'UAE', score:78, channel:'Noon.com', duty:'5% flat', premium:'+18%', tagColor:'#4ade80' },
        { flag:'🇩🇪', name:'Germany', score:71, channel:'Amazon.de', duty:'6.5%', premium:'+12%', tagColor:C.acc },
        { flag:'🇺🇸', name:'United States', score:64, channel:'Amazon US', duty:'3.5%', premium:'+9%', tagColor:C.tx3 },
      ].map((m,i) => (
        <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', background:C.ev, borderRadius:8, border:`1px solid ${C.b}` }}>
          <span style={{ fontSize:20 }}>{m.flag}</span>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:11, fontWeight:600, color:C.tx }}>{m.name} <span style={{ fontSize:9, color:C.tx3 }}>via {m.channel}</span></div>
            <div style={{ fontSize:9, color:C.tx3 }}>Duty: {m.duty} · UK premium: <span style={{ color:'#4ade80' }}>{m.premium}</span></div>
          </div>
          <div style={{ fontFamily:'var(--font-sora)', fontSize:18, fontWeight:800, color:m.tagColor }}>{m.score}<span style={{ fontSize:9, color:C.tx3, fontWeight:400 }}>/100</span></div>
        </div>
      ))}
    </div>
  )
}

function InteractiveDemo({ C }: { C: Palette }) {
  const [active, setActive] = useState(0)
  const tickRef = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Auto-rotation removed — carousel is now manual only
  }, [])

  const slide = DEMO_SLIDES[active]
  const go = useCallback((i: number) => { tickRef.current = 0; setActive(i) }, [])
  const next = useCallback(() => { tickRef.current = 0; setActive(a => (a + 1) % DEMO_SLIDES.length) }, [])

  return (
    <div id="demo" ref={containerRef} style={{ maxWidth:1100, margin:'0 auto', padding:'0 clamp(16px,4vw,40px) clamp(40px,6vw,64px)' }}>
      <div className="demo-layout" style={{ display:'grid', gridTemplateColumns:'1fr 1.3fr', gap:'clamp(24px,4vw,56px)', alignItems:'center', marginBottom:32 }}>
        <div>
          <h2 style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(22px,3vw,32px)', fontWeight:700, lineHeight:1.2, letterSpacing:'-.02em', marginBottom:16, color:C.tx }}>{slide.title}</h2>
          <p style={{ fontSize:14, color:C.tx2, lineHeight:1.7, marginBottom:24 }}>{slide.desc}</p>
          <ol style={{ listStyle:'none', padding:0, margin:'0 0 28px', display:'flex', flexDirection:'column', gap:12 }}>
            {slide.steps.map((step, i) => (
              <li key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', fontSize:13, color:C.tx2, lineHeight:1.55 }}>
                <span style={{ width:22, height:22, borderRadius:'50%', background:C.accBg, border:`1px solid ${C.accBdr}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:C.acc, flexShrink:0 }}>{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
          <button onClick={next} style={{ padding:'10px 24px', borderRadius:9999, border:`1px solid ${C.b2}`, background:'transparent', color:C.tx2, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }} className="card-hover">
            Next →
          </button>
        </div>
        <div style={{ background:C.sf, borderRadius:16, border:`1px solid ${C.b}`, overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px', background:C.ev, borderBottom:`1px solid ${C.b}` }}>
            <div style={{ display:'flex', gap:5 }}>
              <span style={{ width:9, height:9, borderRadius:'50%', background:'#ff5f57' }} />
              <span style={{ width:9, height:9, borderRadius:'50%', background:'#febc2e' }} />
              <span style={{ width:9, height:9, borderRadius:'50%', background:'#28c840' }} />
            </div>
            <div style={{ flex:1, textAlign:'center', fontSize:10, color:C.tx3 }}>askbiz.co/dashboard</div>
          </div>
          <div style={{ height:2, background:C.ev, position:'relative', overflow:'hidden' }}>
            <div key={active} style={{ position:'absolute', top:0, left:0, height:'100%', background:C.acc, animation:'progress 6s linear forwards' }} />
          </div>
          <div style={{ background:C.sf, minHeight:260 }}>
            <DemoScreen screen={slide.screen} C={C} />
          </div>
        </div>
      </div>
      <div style={{ display:'flex', gap:12, alignItems:'center' }}>
        <div className="demo-cards" style={{ display:'flex', gap:10, flex:1, overflowX:'auto', paddingBottom:4 }}>
          {DEMO_SLIDES.map((s, i) => (
            <button key={s.id} onClick={() => go(i)} style={{
              flex:'1 0 0', minWidth:120, padding:'12px 14px', borderRadius:12,
              border: i === active ? `1px solid ${C.acc}` : `1px solid ${C.b}`,
              background: i === active ? C.accBg : C.ev,
              cursor:'pointer', textAlign:'left', fontFamily:'inherit', transition:'all 180ms',
            }}>
              <span style={{ fontSize:12, fontWeight: i === active ? 700 : 500, color: i === active ? C.acc : C.tx2, lineHeight:1.3, display:'block' }}>{s.label}</span>
            </button>
          ))}
        </div>
        <div style={{ display:'flex', gap:6, flexShrink:0 }}>
          <button onClick={() => go((active - 1 + DEMO_SLIDES.length) % DEMO_SLIDES.length)} style={{ width:32, height:32, borderRadius:'50%', border:`1px solid ${C.b}`, background:C.ev, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, color:C.tx3 }}>‹</button>
          <button onClick={next} style={{ width:32, height:32, borderRadius:'50%', border:`1px solid ${C.b}`, background:C.ev, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, color:C.tx3 }}>›</button>
        </div>
      </div>
    </div>
  )
}

// ── Mini Calculator ───────────────────────────────────────────────────────────
const CURRENCIES = [
  { code:'GBP', symbol:'£' }, { code:'USD', symbol:'$' }, { code:'EUR', symbol:'€' },
  { code:'KES', symbol:'KSh' }, { code:'NGN', symbol:'₦' }, { code:'ZAR', symbol:'R' },
  { code:'AED', symbol:'د.إ' }, { code:'INR', symbol:'₹' }, { code:'AUD', symbol:'A$' },
  { code:'CAD', symbol:'C$' }, { code:'JPY', symbol:'¥' }, { code:'CHF', symbol:'Fr' },
] as const

type BizType = 'retail' | 'factory' | 'restaurant' | 'cargo' | 'repair'
const BIZ_TYPES: { id: BizType; icon: string; label: string; fields: { key: string; label: string; ph: string }[]; priceLabel: string; pricePh: string; unitLabel: string; resultLabel: string }[] = [
  { id:'retail', icon:'🛒', label:'Retail / Ecom', priceLabel:'Sale price', pricePh:'12.99', unitLabel:'Units sold', resultLabel:'COGS/UNIT',
    fields: [{ key:'a', label:'Materials', ph:'3.00' },{ key:'b', label:'Labour', ph:'2.50' },{ key:'c', label:'Shipping', ph:'1.20' },{ key:'d', label:'Packaging', ph:'0.80' }] },
  { id:'factory', icon:'🏭', label:'Factory', priceLabel:'Unit sale price', pricePh:'24.00', unitLabel:'Batch size', resultLabel:'COST/UNIT',
    fields: [{ key:'a', label:'Raw materials', ph:'6.00' },{ key:'b', label:'Direct labour', ph:'4.50' },{ key:'c', label:'Machine time', ph:'2.00' },{ key:'d', label:'Overhead/unit', ph:'1.50' }] },
  { id:'restaurant', icon:'🍽️', label:'Restaurant', priceLabel:'Menu price', pricePh:'16.50', unitLabel:'Covers/day', resultLabel:'FOOD COST',
    fields: [{ key:'a', label:'Ingredients', ph:'4.20' },{ key:'b', label:'Prep labour', ph:'2.00' },{ key:'c', label:'Packaging', ph:'0.50' },{ key:'d', label:'Waste %', ph:'8' }] },
  { id:'cargo', icon:'🚛', label:'Cargo', priceLabel:'Revenue/trip', pricePh:'850', unitLabel:'Trips/month', resultLabel:'COST/TRIP',
    fields: [{ key:'a', label:'Fuel', ph:'180' },{ key:'b', label:'Driver wages', ph:'120' },{ key:'c', label:'Tolls & fees', ph:'45' },{ key:'d', label:'Insurance', ph:'30' }] },
  { id:'repair', icon:'🔧', label:'Repair Shop', priceLabel:'Charge to customer', pricePh:'89.99', unitLabel:'Jobs/week', resultLabel:'PARTS+LABOUR',
    fields: [{ key:'a', label:'Parts cost', ph:'25.00' },{ key:'b', label:'Labour (hrs)', ph:'1.5' },{ key:'c', label:'Labour rate/hr', ph:'20' },{ key:'d', label:'Diagnostic fee', ph:'0' }] },
]

function MiniCalcWidget({ C }: { C: Palette }) {
  const [mode, setMode] = useState<'margin' | 'industry'>('margin')
  const [biz, setBiz] = useState<BizType>('retail')
  const [cur, setCur] = useState(0)
  const [showCur, setShowCur] = useState(false)
  const sym = CURRENCIES[cur].symbol
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showCur) return
    const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setShowCur(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [showCur])

  const [mc, setMc] = useState({ cost: '', revenue: '', units: '' })
  const mCost = parseFloat(mc.cost) || 0
  const mRev = parseFloat(mc.revenue) || 0
  const mUnits = parseInt(mc.units) || 0
  const mProfit = mRev - mCost
  const mMargin = mRev > 0 ? (mProfit / mRev) * 100 : 0
  const mMarkup = mCost > 0 ? (mProfit / mCost) * 100 : 0
  const mHasResult = mCost > 0 && mRev > 0

  const [iv, setIv] = useState({ a:'', b:'', c:'', d:'', price:'', units:'' })
  const bt = BIZ_TYPES.find(b => b.id === biz)!
  const iA = parseFloat(iv.a) || 0, iB = parseFloat(iv.b) || 0, iC = parseFloat(iv.c) || 0, iD = parseFloat(iv.d) || 0
  const iPrice = parseFloat(iv.price) || 0, iUnits = parseInt(iv.units) || 0
  let iCost = iA + iB + iC + iD
  if (biz === 'repair') iCost = iA + (iB * iC) + iD
  if (biz === 'restaurant') iCost = (iA + iB + iC) * (1 + iD / 100)
  const iGross = iPrice - iCost
  const iMargin = iPrice > 0 ? (iGross / iPrice) * 100 : 0
  const iHasResult = iCost > 0

  const mc_ = (m: number) => m >= 30 ? '#4ade80' : m >= 15 ? '#fb923c' : '#f87171'
  const switchBiz = (b: BizType) => { setBiz(b); setIv({ a:'', b:'', c:'', d:'', price:'', units:'' }) }

  const I = (props: { placeholder: string; value: string; onChange: (v: string) => void; step?: string }) => (
    <input type="number" min="0" step={props.step || '0.01'} placeholder={props.placeholder}
      style={{ width:'100%', height:36, padding:'0 10px', fontSize:13, border:`1px solid ${C.b2}`, borderRadius:8, background:C.ev, color:C.tx, fontFamily:'inherit', outline:'none', boxSizing:'border-box' as const }}
      value={props.value} onChange={e => props.onChange(e.target.value)} />
  )

  const R = (props: { value: string; label: string; color: string }) => (
    <div style={{ textAlign:'center', padding:'6px 2px', background:C.ev2, borderRadius:8 }}>
      <div style={{ fontFamily:'var(--font-sora)', fontSize:16, fontWeight:700, color:props.color, lineHeight:1.2 }}>{props.value}</div>
      <div style={{ fontSize:8, color:C.tx3, fontWeight:700, marginTop:2, textTransform:'uppercase', letterSpacing:'.03em' }}>{props.label}</div>
    </div>
  )

  return (
    <div ref={ref} className="fade-up mini-calc" style={{ maxWidth:480, width:'100%', background:C.sf, border:`1px solid ${C.b}`, borderRadius:16, overflow:'hidden' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'10px 14px 0', gap:8 }}>
        <div style={{ display:'inline-flex', borderRadius:9999, border:`1px solid ${C.b2}`, overflow:'hidden', background:C.ev }}>
          {([['margin','Profit Margin'],['industry','Cost of Goods']] as const).map(([id, label]) => (
            <button key={id} onClick={() => setMode(id as 'margin'|'industry')}
              style={{ padding:'6px 18px', fontSize:11, fontWeight:700, fontFamily:'var(--font-sora)', background:mode===id?C.acc:'transparent', color:mode===id?'#fff':C.tx3, border:'none', cursor:'pointer', transition:'all 150ms' }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ position:'relative' }}>
          <button onClick={() => setShowCur(!showCur)}
            style={{ padding:'4px 7px', fontSize:10, fontWeight:600, fontFamily:'inherit', background:C.ev, border:`1px solid ${C.b2}`, borderRadius:6, cursor:'pointer', color:C.tx2, display:'flex', alignItems:'center', gap:2 }}>
            {sym} <span style={{ fontSize:7, opacity:.5 }}>▼</span>
          </button>
          {showCur && (
            <div style={{ position:'absolute', top:'100%', right:0, marginTop:4, background:C.sf, borderRadius:8, boxShadow:'0 4px 16px rgba(0,0,0,.12)', zIndex:50, padding:6, display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:2, minWidth:156 }}>
              {CURRENCIES.map((c, i) => (
                <button key={c.code} onClick={() => { setCur(i); setShowCur(false) }}
                  style={{ padding:'4px 6px', fontSize:10, fontWeight:cur===i?700:500, fontFamily:'inherit', background:cur===i?C.acc:'transparent', color:cur===i?'#fff':C.tx2, border:'none', borderRadius:6, cursor:'pointer', textAlign:'center' }}>
                  {c.symbol} {c.code}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {mode === 'industry' && (
        <div style={{ display:'flex', justifyContent:'center', gap:4, padding:'8px 12px 0', flexWrap:'wrap' }}>
          {BIZ_TYPES.map(b => (
            <button key={b.id} onClick={() => switchBiz(b.id)}
              style={{ padding:'3px 8px', fontSize:10, fontWeight:biz===b.id?700:500, fontFamily:'inherit', background:biz===b.id?C.accBg:'transparent', color:biz===b.id?C.acc:C.tx3, border:`1px solid ${biz===b.id?C.accBdr:C.b}`, borderRadius:9999, cursor:'pointer', transition:'all 150ms', display:'flex', alignItems:'center', gap:3 }}>
              <span style={{ fontSize:10 }}>{b.icon}</span> {b.label}
            </button>
          ))}
        </div>
      )}
      <div style={{ padding:'8px 14px 12px' }}>
        {mode === 'margin' ? (
          <>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:6 }}>
              <I placeholder={`Cost (${sym})`} value={mc.cost} onChange={v => setMc(p => ({ ...p, cost: v }))} />
              <I placeholder={`Sale price (${sym})`} value={mc.revenue} onChange={v => setMc(p => ({ ...p, revenue: v }))} />
              <I placeholder="Units sold" value={mc.units} onChange={v => setMc(p => ({ ...p, units: v }))} step="1" />
            </div>
            {mHasResult && (
              <div style={{ marginTop:8 }}>
                <div style={{ height:4, borderRadius:2, background:C.ev2, overflow:'hidden', marginBottom:6 }}>
                  <div style={{ height:'100%', width:'100%', borderRadius:2, background:mc_(mMargin), transform:`scaleX(${Math.min(mMargin, 100) / 100})`, transformOrigin:'left center', transition:'transform 300ms cubic-bezier(0.16,1,0.3,1)' }} />
                </div>
                <div style={{ display:'grid', gridTemplateColumns: mUnits > 0 ? '1fr 1fr 1fr 1fr' : '1fr 1fr 1fr', gap:4 }}>
                  <R value={`${mMargin.toFixed(1)}%`} label="Margin" color={mc_(mMargin)} />
                  <R value={`${sym}${mProfit.toFixed(2)}`} label="Profit" color={C.tx} />
                  <R value={`${mMarkup.toFixed(0)}%`} label="Markup" color={C.tx2} />
                  {mUnits > 0 && <R value={`${sym}${(mProfit * mUnits).toLocaleString('en-GB', { maximumFractionDigits:0 })}`} label="Total profit" color="#4ade80" />}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:6 }}>
              {bt.fields.map(f => (
                <I key={f.key} placeholder={`${f.label}${f.label.includes('%') ? '' : ` (${sym})`}`} value={(iv as Record<string,string>)[f.key]} onChange={v => setIv(p => ({ ...p, [f.key]: v }))} />
              ))}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
              <I placeholder={`${bt.priceLabel} (${sym})`} value={iv.price} onChange={v => setIv(p => ({ ...p, price: v }))} />
              <I placeholder={bt.unitLabel} value={iv.units} onChange={v => setIv(p => ({ ...p, units: v }))} step="1" />
            </div>
            {iHasResult && (
              <div style={{ marginTop:8 }}>
                {iPrice > 0 && (
                  <div style={{ height:4, borderRadius:2, background:C.ev2, overflow:'hidden', marginBottom:6 }}>
                    <div style={{ height:'100%', width:'100%', background:`linear-gradient(90deg, #f87171 ${Math.min((iCost/iPrice)*100, 100)}%, #4ade80 ${Math.min((iCost/iPrice)*100, 100)}%)`, borderRadius:2 }} />
                  </div>
                )}
                <div style={{ display:'grid', gridTemplateColumns: iUnits > 0 && iPrice > 0 ? '1fr 1fr 1fr 1fr' : iPrice > 0 ? '1fr 1fr 1fr' : '1fr', gap:4 }}>
                  <R value={`${sym}${iCost.toFixed(2)}`} label={bt.resultLabel} color="#f87171" />
                  {iPrice > 0 && <>
                    <R value={`${sym}${iGross.toFixed(2)}`} label="Gross profit" color={iGross >= 0 ? '#4ade80' : '#f87171'} />
                    <R value={`${iMargin.toFixed(1)}%`} label="Margin" color={mc_(iMargin)} />
                  </>}
                  {iUnits > 0 && iPrice > 0 && <R value={`${sym}${(iGross * iUnits).toLocaleString('en-GB', { maximumFractionDigits:0 })}`} label="Total profit" color="#4ade80" />}
                </div>
              </div>
            )}
          </>
        )}
        <div style={{ marginTop:6, textAlign:'center' }}>
          <Link href={mode==='margin' ? '/free-tools/profit-margin-calculator' : '/free-tools/cogs-calculator'}
            style={{ fontSize:10, color:C.acc, fontWeight:600, textDecoration:'none' }}>
            Open full {mode==='margin' ? 'Profit Margin' : 'COGS'} calculator →
          </Link>
        </div>
      </div>
    </div>
  )
}

// ── AskBiz bar logo SVG ───────────────────────────────────────────────────────
function Logo({ size = 12, opacity = 1 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ opacity }}>
      <rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.5"/>
      <rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.75"/>
      <rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/>
    </svg>
  )
}

// ── LandingInner ─────────────────────────────────────────────────────────────
function LandingInner({ geo }: { geo: Geo | null }) {
  const { t, lang, setLang } = useLang()
  const [annual, setAnnual] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [liveGeo, setLiveGeo] = useState<Geo | null>(geo)
  const tiltRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const isDark = false
  const C: Palette = isDark ? DARK : LIGHT

  const sym           = liveGeo?.pricing?.sym      || '£'
  const growthPrice   = liveGeo?.pricing?.growth   || '£19'
  const businessPrice = liveGeo?.pricing?.business || '£39'
  const posPrice      = liveGeo?.pricing?.pos      || '£5'
  const country       = liveGeo?.country           || geo?.country    || ''
  const countryCode   = liveGeo?.countryCode       || geo?.countryCode || ''
  const flag          = liveGeo?.flag              || geo?.flag        || ''
  const isRTL = lang === 'ar'

  const geoCtaText = 'Start 3-month free trial'
  const geoSubText = country
    ? `No credit card · 3 months free then from ${growthPrice}/mo · 2 minutes to set up`
    : 'No credit card · 3 months free · Takes 2 minutes to set up'

  // Sync body bg to current palette
  useEffect(() => {
    document.body.style.background = C.bg
    document.documentElement.style.background = C.bg
    return () => {
      document.body.style.background = ''
      document.documentElement.style.background = ''
    }
  }, [isDark]) // eslint-disable-line react-hooks/exhaustive-deps

  // 3D tilt effect removed — reduces AI template feel

  // Cursor glow listener removed

  // ── Scroll-reveal via IntersectionObserver ────────────────────────────────
  // Fallback ensures content is NEVER permanently hidden (hidden tab, no-JS, SSR)
  useEffect(() => {
    const els = document.querySelectorAll('[data-motion]')
    if (!els.length) return
    // Safety net: make everything visible after 2.5s regardless of observer
    const fallback = setTimeout(() => els.forEach(el => el.classList.add('is-visible')), 2500)
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target) }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
    )
    els.forEach(el => io.observe(el))
    return () => { clearTimeout(fallback); io.disconnect() }
  }, [])

  useEffect(() => {
    if (geo) return
    fetch('/api/geo').then(r => r.json()).then(d => {
      if (d.pricing) {
        setLiveGeo({ country: d.country || '', countryCode: d.countryCode || '', city: d.city || '', currency: d.currency || 'USD', currencySymbol: d.currencySymbol || '$', currencyName: d.currencyName || 'US Dollar', flag: d.flag || '', pricing: d.pricing })
      }
      const saved = document.cookie.split(';').find(c => c.trim().startsWith('askbiz_lang='))
      if (!saved) {
        const browserLang = navigator.language?.split('-')[0]?.toLowerCase()
        const BMAP: Record<string, Lang> = { en:'en', fr:'fr', de:'de', es:'es', ar:'ar', sw:'sw', pt:'pt', nl:'nl', it:'it', pl:'pl' }
        if (browserLang && browserLang !== 'en' && BMAP[browserLang]) setLang(BMAP[browserLang] as Lang)
        else {
          const detected = (COUNTRY_TO_LANG as Record<string, Lang>)[d.countryCode] || 'en'
          setLang(detected)
        }
      }
    }).catch(() => {})
  }, [])

  function annualPrice(price: string): string {
    const match = price.match(/([\d,]+)/)
    if (!match) return price
    const num = parseInt(match[1].replace(/,/g, ''), 10)
    const discounted = Math.round(num * 10 / 12)
    const formatted = match[1].includes(',') ? discounted.toLocaleString('en-US') : String(discounted)
    return price.replace(/[\d,]+/, formatted)
  }
  const growthMonthly = annual ? annualPrice(growthPrice) : growthPrice
  const bizMonthly    = annual ? annualPrice(businessPrice) : businessPrice

  const FAQS = [
    { q: 'What is AskBiz?', a: 'AskBiz is a business intelligence tool for SME founders. You connect your Shopify, Amazon, or other platforms, then ask questions in plain English and get answers with your actual numbers.' },
    { q: 'How does it work without a data team?', a: 'You connect your store or upload a CSV. AskBiz handles everything — no SQL, no dashboards, no data engineering. You just ask.' },
    { q: 'What\'s included in the free plan?', a: '10 questions per month, CSV upload, Business Pulse score, connect Shopify and Amazon, API access, and access to the FX Risk, Landed Cost, and Export Market tools with manual input. No credit card needed. You can also try Growth and PoS free for 3 months — no card required.' },
    { q: 'What does "pre-filled from data" mean on Growth?', a: 'On Growth, the FX Risk, Landed Cost, and other tools automatically pull your real product costs, margins, and supplier data from your connected sources. You review and calculate — not re-enter.' },
    { q: 'Can I cancel anytime?', a: 'Yes — cancel in one click. You keep access until the end of your billing period.' },
    { q: 'How does the social commerce integration work?', a: 'Connect TikTok Shop, Instagram Shopping, or Pinterest from the Sources page. AskBiz tracks conversion rates, saves (demand signals), and alerts you when a product has high saves but no orders — before you sell out.' },
    { q: 'What does the Point of Sale system include?', a: `The PoS includes a full register with barcode scanning, inventory management, staff shift tracking, digital receipts, refunds, multi-branch support, tax compliance (VAT, GST, multi-jurisdiction), GDPR tools, and integrations with Xero and QuickBooks. It costs ${posPrice} per seat per month — each seat is one register or device.` },
    { q: 'Is my business data safe?', a: 'Your data is encrypted at rest and in transit. We never use your business data to train AI models.' },
  ]

  return (
    <div style={{ background: C.bg, color: C.tx, fontFamily: 'var(--font-dm, DM Sans, system-ui)', overflowX: 'hidden', direction: isRTL ? 'rtl' : 'ltr' }}>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes tdot { 0%,80%,100%{opacity:.3;transform:scale(.8)} 40%{opacity:1;transform:scale(1)} }
        @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes progress { from{width:0%} to{width:100%} }
        @keyframes heroGlow { 0%,100%{opacity:.55} 50%{opacity:.8} }
        @keyframes charIn { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes cursorGlowPulse { 0%,100%{opacity:.18} 50%{opacity:.28} }
        .fade-up { animation: fadeUp 600ms cubic-bezier(0.22,1,0.36,1) forwards }
        .hero-3d {
          transform: perspective(1100px) rotateX(2deg);
          transform-style: preserve-3d;
          will-change: transform;
        }
        .hero-card-depth-1 { transform: translateZ(0px); }
        .hero-card-depth-2 { transform: translateZ(20px); }
        .tdot { display:inline-block; width:6px; height:6px; border-radius:50%; background:#6B7280; animation:tdot 1.2s infinite }
        .card-hover:hover { border-color:rgba(208,138,89,.3) !important; transition:border-color 180ms ease }
        .btn-primary { transition:transform 105ms cubic-bezier(0.22,1,0.36,1), opacity 105ms ease, box-shadow 200ms ease }
        .btn-primary:hover { filter:brightness(1.08); box-shadow:0 8px 32px rgba(201,122,68,.35) !important }
        .btn-primary:active { transform:scale(0.97); opacity:0.92 }
        .nav-link:hover { color:${C.tx} !important }
        .faq-item:hover { background:${C.ev} }
        .kpi-chip { display:inline-flex; align-items:center; gap:6px; padding:4px 10px; border-radius:9999px; font-size:12px; font-weight:600; border:1px solid }
        .nav-desktop { display:flex }
        .nav-hamburger { display:none }
        .mobile-menu { display:none }
        @media (prefers-reduced-motion:reduce) {
          .hero-3d { animation:none; transform:none; }
          .charIn-span { animation:none !important; opacity:1 !important; transform:none !important; }
          .fade-up { animation:none !important; opacity:1 !important; transform:none !important; }
          .ticker-strip { animation:none !important; }
          [data-motion] { transition:none !important; }
        }
        @media (max-width:767px) {
          .nav-desktop { display:none !important }
          .nav-hamburger { display:flex !important }
          .mobile-menu.open { display:flex !important }
          .demo-layout { grid-template-columns:1fr !important }
          .demo-cards { flex-wrap:wrap }
          .tools-grid { grid-template-columns:1fr !important }
          .pos-grid-4 { grid-template-columns:1fr 1fr !important }
          .pos-grid-3 { grid-template-columns:1fr !important }
          .steps-grid { grid-template-columns:1fr !important; gap:32px !important }
          .steps-line { display:none !important }
          .testimonials-grid { grid-template-columns:1fr !important }
          .stats-grid { grid-template-columns:1fr 1fr !important }
          .pricing-grid { grid-template-columns:1fr !important }
          .learn-grid { grid-template-columns:1fr !important }
          .academy-topics { grid-template-columns:1fr !important }
          .footer-nav { justify-content:center }
          .nav-mega-wrap { display:none !important }
          .hero-ctas { flex-direction:column !important }
          .hero-ctas a { width:100% !important; text-align:center !important; justify-content:center !important }
          .mini-calc { max-width:100% !important }
          .hero-preview-grid { grid-template-columns:1fr !important }
        }
        @media (max-width:480px) {
          .pos-grid-4 { grid-template-columns:1fr !important }
          .stats-grid { grid-template-columns:1fr !important }
        }
        /* ── Kill dot grid on landing (it's an AI template tell) */
        body::before { display:none !important }
        /* ── Hero split — collapse to single column on mobile */
        @media (max-width:860px) {
          .hero-split { grid-template-columns:1fr !important }
          .hero-right-col { display:none !important }
        }
        input::placeholder { color: ${C.tx3} }
      `}</style>

      {/* Cursor glow removed — reduces AI template feel */}

      {/* ── NAV ───────────────────────────────────────────────────────────── */}
      <nav style={{ position:'sticky', top:0, zIndex:50, background:C.nav, backdropFilter:'blur(20px)', borderBottom:`1px solid ${C.navBorder}`, padding:'0 clamp(16px,4vw,32px)', height:56, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none', color:C.tx }}>
          <div style={{ width:26, height:26, borderRadius:7, background:C.acc, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <Logo size={12} />
          </div>
          <span style={{ fontFamily:'var(--font-sora)', fontSize:15, fontWeight:700, letterSpacing:'-.02em' }}>AskBiz</span>
        </Link>

        <div className="nav-desktop" style={{ display:'flex', alignItems:'center', gap:10 }}>
          <a href="#pricing" className="nav-link" style={{ fontSize:13, color:C.tx2, textDecoration:'none', padding:'0 8px', transition:'color 150ms' }}>Pricing</a>
          <div className="nav-mega-wrap" style={{ position:'relative' }} onMouseEnter={(e)=>{const d=e.currentTarget.querySelector('.nav-mega') as HTMLElement;if(d)d.style.display='block'}} onMouseLeave={(e)=>{const d=e.currentTarget.querySelector('.nav-mega') as HTMLElement;if(d)d.style.display='none'}}>
            <span className="nav-link" style={{ fontSize:13, color:C.tx2, padding:'0 8px', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:3, transition:'color 150ms' }}>Resources <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2.5 4L5 6.5L7.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg></span>
            <div className="nav-mega" style={{ display:'none', position:'absolute', top:'100%', right:0, paddingTop:8, zIndex:60 }}>
              <div style={{ background:C.sf, borderRadius:12, boxShadow:'0 8px 24px rgba(0,0,0,.12)', padding:20, width:480, display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                {[
                  { href:'/blog', title:'Blog', desc:'201 articles on AI, commerce & growth' },
                  { href:'/academy', title:'Academy', desc:'420+ structured learning articles' },
                  { href:'/free-tools', title:'Free Tools', desc:'VAT, landed cost, FX & break-even' },
                  { href:'/case-studies', title:'Case Studies', desc:'Real results from real businesses' },
                  { href:'/benchmarks', title:'Benchmarks', desc:'Industry KPIs across 8 sectors' },
                  { href:'/help', title:'Help Center', desc:'Guides, FAQ & troubleshooting' },
                  { href:'/glossary', title:'Glossary', desc:'Business & analytics terms explained' },
                  { href:'/integrations', title:'Integrations', desc:'Shopify, Amazon, Xero & more' },
                ].map(item=>(
                  <Link key={item.href} href={item.href} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'10px 12px', borderRadius:10, textDecoration:'none', color:C.tx, transition:'background .12s' }} onMouseEnter={e=>{e.currentTarget.style.background=C.ev}} onMouseLeave={e=>{e.currentTarget.style.background='transparent'}}>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:C.tx, lineHeight:1.2 }}>{item.title}</div>
                      <div style={{ fontSize:11, color:C.tx3, marginTop:2, lineHeight:1.4 }}>{item.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link href="/signin" style={{ padding:'7px 14px', borderRadius:9999, border:`1px solid ${C.b2}`, background:'transparent', color:C.tx2, fontSize:13, fontWeight:500, textDecoration:'none' }}>Sign in</Link>
          <Link href="/signin?mode=signup" className="btn-primary" style={{ padding:'8px 18px', borderRadius:9999, background:C.acc, color:'#fff', fontSize:13, fontWeight:700, textDecoration:'none', fontFamily:'var(--font-sora)' }}>
            Get started free →
          </Link>
        </div>

        <div className="nav-hamburger" style={{ display:'none', alignItems:'center', gap:10 }}>
          <Link href="/signin?mode=signup" className="btn-primary" style={{ padding:'7px 16px', borderRadius:9999, border:'none', background:C.acc, color:'#fff', fontSize:13, fontWeight:700, textDecoration:'none' }}>Try free</Link>
          <button onClick={() => setMenuOpen(o => !o)} aria-label="Menu" style={{ width:40, height:40, borderRadius:10, border:`1px solid ${C.b}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', padding:0 }}>
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.tx} strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.tx} strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} style={{ display:'none', flexDirection:'column', gap:0, position:'fixed', top:56, left:0, right:0, bottom:0, background:C.bg, zIndex:49, overflowY:'auto', padding:'16px 20px 32px' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
          {[{ href:'#pricing', label:'Pricing' },{ href:'/point-of-sale', label:'Point of Sale' },{ href:'/blog', label:'Blog' },{ href:'/academy', label:'Academy' },{ href:'/free-tools', label:'Free Tools' },{ href:'/help', label:'Help Center' },{ href:'/integrations', label:'Integrations' }].map(item => (
            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} style={{ display:'block', padding:'14px 12px', borderRadius:10, fontSize:15, fontWeight:600, color:C.tx, textDecoration:'none', borderBottom:`1px solid ${C.b}` }}>{item.label}</a>
          ))}
        </div>
        <div style={{ marginTop:24, display:'flex', flexDirection:'column', gap:10 }}>
          <Link href="/signin?mode=signup" onClick={() => setMenuOpen(false)} className="btn-primary" style={{ display:'block', padding:'14px', borderRadius:9999, background:C.acc, color:'#fff', fontSize:15, fontWeight:700, textDecoration:'none', textAlign:'center' }}>Start free</Link>
          <Link href="/signin" onClick={() => setMenuOpen(false)} style={{ display:'block', padding:'14px', borderRadius:9999, border:`1px solid ${C.b2}`, background:'transparent', color:C.tx2, fontSize:14, fontWeight:500, textDecoration:'none', textAlign:'center' }}>Sign in</Link>
        </div>
      </div>

      {/* ── HERO — split layout, product UI bleeds right ──────────────────── */}
      <section style={{ position:'relative', overflow:'hidden' }}>
        {/* Right-half colour field — the diptych split */}
        <div aria-hidden style={{ position:'absolute', right:0, top:0, bottom:0, width:'52%', background:C.sf, zIndex:0 }} />

        <div className="hero-split" style={{ maxWidth:1280, margin:'0 auto', width:'100%', padding:'0 clamp(16px,4vw,48px)', display:'grid', gridTemplateColumns:'1fr 1.2fr', alignItems:'stretch', position:'relative', zIndex:1 }}>

          {/* ── Left: copy ─────────────────────────────────────────────────── */}
          <div style={{ padding:'clamp(56px,8vw,108px) clamp(0px,2vw,20px) clamp(56px,8vw,108px) 0', display:'flex', flexDirection:'column', justifyContent:'center' }}>

            {/* Category marker — intentional, not a pill badge */}
            <p style={{ fontSize:11, fontWeight:700, color:C.acc, letterSpacing:'.16em', textTransform:'uppercase', marginBottom:28 }}>
              Business intelligence · Point of Sale
            </p>

            {/* H1 — direct, no animations */}
            <h1 style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(36px,4vw,56px)', fontWeight:700, lineHeight:1.05, letterSpacing:'-.03em', marginBottom:22, color:C.tx }}>
              Ask your business data <span style={{ color:C.acc }}>anything</span>.
            </h1>

            <p style={{ fontSize:'clamp(14px,1.4vw,16px)', color:C.tx2, lineHeight:1.75, marginBottom:48, maxWidth:380 }}>
              Every sale your register takes feeds directly into your AI. Ask questions in plain English, spot problems, act fast.
            </p>

            {/* CTAs */}
            <div className="hero-ctas" style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:28 }}>
              <Link href="/signin?mode=signup" className="btn-primary" style={{ padding:'13px 26px', borderRadius:9999, border:'none', background:C.acc, color:'#fff', fontSize:14, fontWeight:700, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:8, letterSpacing:'-.01em' }}>
                {geoCtaText}
              </Link>
              <Link href="/point-of-sale" style={{ padding:'13px 20px', borderRadius:9999, border:`1px solid ${C.b2}`, background:'transparent', color:C.tx2, fontSize:14, fontWeight:500, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:6 }}>
                See the PoS →
              </Link>
            </div>

            {/* Trust */}
            <div style={{ display:'flex', gap:14, flexWrap:'wrap', fontSize:12, color:C.tx3 }}>
              <span>✓ 3 months free · no card</span>
              <span>✓ GDPR compliant</span>
              <span>✓ UK data residency</span>
            </div>
            <p style={{ fontSize:12, color:C.tx3, marginTop:6 }}>
              {country ? `${flag} ` : ''}{geoSubText} · PoS from {posPrice}/seat/mo
            </p>
          </div>

          {/* ── Right: product UI bleeding to viewport edge ─────────────────── */}
          <div className="hero-right-col" style={{ display:'flex', alignItems:'stretch', paddingLeft:'clamp(20px,3vw,40px)', paddingTop:'clamp(24px,4vw,40px)', paddingBottom:'clamp(24px,4vw,40px)', marginRight:'calc(-1 * clamp(16px,4vw,48px))' }}>
            <div style={{ width:'100%', background:C.bg, borderRadius:'12px 0 0 12px', border:`1px solid ${C.b}`, borderRight:'none', overflow:'hidden', display:'flex', flexDirection:'column' }}>

              {/* Browser chrome */}
              <div style={{ padding:'10px 16px', background:C.ev, borderBottom:`1px solid ${C.b}`, display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ display:'flex', gap:5 }}>
                  {(['#ff5f57','#febc2e','#28c840'] as const).map(c => (
                    <div key={c} style={{ width:10, height:10, borderRadius:'50%', background:c }} />
                  ))}
                </div>
                <div style={{ flex:1, background:C.sf, borderRadius:5, height:22, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:C.tx3 }}>
                  app.askbiz.co/intelligence
                </div>
              </div>

              {/* App shell */}
              <div style={{ display:'grid', gridTemplateColumns:'172px 1fr', flex:1, minHeight:380, overflow:'hidden' }}>

                {/* Sidebar */}
                <div style={{ borderRight:`1px solid ${C.b}`, padding:'14px 10px', display:'flex', flexDirection:'column', gap:2, background:C.sf }}>
                  <div style={{ fontSize:9, fontWeight:700, color:C.tx3, letterSpacing:'.1em', textTransform:'uppercase', padding:'2px 8px', marginBottom:6 }}>Conversations</div>
                  {[
                    { q:'Best margin product?', active:true },
                    { q:'Churn risk this month', active:false },
                    { q:'Tuesday revenue drop', active:false },
                    { q:'FX impact on margins', active:false },
                  ].map((item, i) => (
                    <div key={i} style={{ padding:'7px 10px', borderRadius:7, background:item.active ? C.accBg : 'transparent', color:item.active ? C.acc : C.tx2, fontSize:11, fontWeight:item.active ? 600 : 400 }}>
                      {item.q}
                    </div>
                  ))}
                  <div style={{ marginTop:'auto', paddingTop:12, borderTop:`1px solid ${C.b}` }}>
                    <div style={{ fontSize:9, fontWeight:700, color:C.tx3, letterSpacing:'.1em', textTransform:'uppercase', padding:'2px 8px', marginBottom:6 }}>Tools</div>
                    {['FX Risk Monitor','Supplier Scorecard','Landed Cost'].map((t, i) => (
                      <div key={i} style={{ padding:'6px 10px', borderRadius:7, color:C.tx2, fontSize:11 }}>{t}</div>
                    ))}
                  </div>
                </div>

                {/* Chat */}
                <div style={{ padding:'18px 20px', display:'flex', flexDirection:'column', gap:12, overflow:'hidden' }}>
                  <div style={{ display:'flex', justifyContent:'flex-end' }}>
                    <div style={{ padding:'9px 14px', borderRadius:'14px 14px 3px 14px', background:C.ev2, border:`1px solid ${C.b}`, fontSize:12, color:C.tx }}>
                      What is my best margin product?
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                    <div style={{ width:26, height:26, borderRadius:8, background:C.acc, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Logo size={11} />
                    </div>
                    <div>
                      <div style={{ padding:'10px 14px', borderRadius:'3px 14px 14px 14px', background:C.ev, border:`1px solid ${C.b}`, fontSize:12, lineHeight:1.7, color:C.tx, marginBottom:8, maxWidth:340 }}>
                        <strong>Wireless Earbuds</strong> — 34.2% gross margin, £8.22 profit per unit. At 143 units/month that&apos;s <strong>£1,175</strong> in monthly profit from one SKU.
                      </div>
                      <div style={{ display:'flex', gap:5 }}>
                        <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 9px', borderRadius:9999, fontSize:10, fontWeight:600, background:'rgba(34,197,94,.08)', color:'#16a34a', border:'1px solid rgba(34,197,94,.2)' }}>Margin 34.2%</span>
                        <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 9px', borderRadius:9999, fontSize:10, fontWeight:600, background:'rgba(34,197,94,.08)', color:'#16a34a', border:'1px solid rgba(34,197,94,.2)' }}>£1,175/mo</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display:'flex', justifyContent:'flex-end' }}>
                    <div style={{ padding:'9px 14px', borderRadius:'14px 14px 3px 14px', background:C.ev2, border:`1px solid ${C.b}`, fontSize:12, color:C.tx }}>
                      Why did revenue drop Tuesday?
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                    <div style={{ width:26, height:26, borderRadius:8, background:C.acc, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Logo size={11} />
                    </div>
                    <div style={{ padding:'10px 14px', borderRadius:'3px 14px 14px 14px', background:C.ev, border:`1px solid ${C.b}`, fontSize:12, lineHeight:1.7, color:C.tx, maxWidth:340 }}>
                      Tuesday PoS revenue was <strong>£340 below</strong> the 4-week average. Lunch shift had 6 fewer transactions — check if the till opened late.
                    </div>
                  </div>
                  {/* Typing indicator */}
                  <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                    <div style={{ width:26, height:26, borderRadius:8, background:C.acc, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Logo size={11} />
                    </div>
                    <div style={{ display:'flex', gap:4, padding:'10px 14px', background:C.ev, border:`1px solid ${C.b}`, borderRadius:'3px 14px 14px 14px' }}>
                      <span className="tdot" style={{ animationDelay:'0ms' }} />
                      <span className="tdot" style={{ animationDelay:'160ms' }} />
                      <span className="tdot" style={{ animationDelay:'320ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCT DEMO ──────────────────────────────────────────────────── */}
      <InteractiveDemo C={C} />

      {/* ── INTEGRATION TICKER ────────────────────────────────────────────── */}
      <div style={{ borderTop:`1px solid ${C.b}`, borderBottom:`1px solid ${C.b}`, background:C.sf, padding:'14px 0', overflow:'hidden' }}>
        <p style={{ textAlign:'center', fontSize:11, fontWeight:600, color:C.tx3, letterSpacing:'.08em', marginBottom:12, textTransform:'uppercase' }}>
          Connects to your platforms
        </p>
        <div className="ticker-strip" style={{ display:'flex', gap:0, animation:'ticker 20s linear infinite', width:'max-content' }}>
          {[...INTEGRATIONS, ...INTEGRATIONS].map((name, i) => (
            <div key={i} style={{ padding:'6px 28px', borderRight:`1px solid ${C.b}`, fontSize:13, fontWeight:500, color:C.tx2, whiteSpace:'nowrap' }}>
              {name}
            </div>
          ))}
        </div>
      </div>

      {/* ── PROFIT CALCULATOR ─────────────────────────────────────────────── */}
      <section style={{ maxWidth:760, margin:'0 auto', padding:'clamp(48px,6vw,72px) clamp(16px,4vw,40px)' }}>
        <div data-motion style={{ marginBottom:28 }}>
          <h2 style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(22px,3vw,34px)', fontWeight:700, lineHeight:1.1, letterSpacing:'-.03em', color:C.tx, marginBottom:12 }}>
            How much are you actually making?
          </h2>
          <p style={{ fontSize:15, color:C.tx2, lineHeight:1.7, maxWidth:480 }}>
            Drop in a product price, cost, and margin target. AskBiz shows you this in real time for every SKU.
          </p>
        </div>
        <div data-motion>
          <MiniCalcWidget C={C} />
        </div>
      </section>

      {/* ── YOUR PoS + INTELLIGENCE ────────────────────────────────────────── */}
      <section style={{ maxWidth:1060, margin:'0 auto', padding:'clamp(64px,8vw,100px) clamp(16px,4vw,40px)' }}>

        {/* Section headline — no eyebrow */}
        <div data-motion style={{ maxWidth:640, marginBottom:52 }}>
          <h2 style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(26px,4vw,46px)', fontWeight:700, lineHeight:1.1, letterSpacing:'-.03em', color:C.tx, marginBottom:16, textWrap:'balance' as any }}>
            Your register and your intelligence.<br/>
            <span style={{ color:C.tx2 }}>Finally in one place.</span>
          </h2>
          <p style={{ fontSize:16, color:C.tx2, lineHeight:1.7, maxWidth:480 }}>
            Most businesses run their register and analytics in two separate worlds. AskBiz connects them — every sale, shift, and stock movement feeds your intelligence layer automatically.
          </p>
        </div>

        {/* Editorial layout: 1 large + 2 smaller */}
        <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:14 }}>

          {/* Large feature */}
          <div style={{ background:C.sf, border:`1px solid ${C.b}`, borderRadius:20, padding:'32px 28px', display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ width:40, height:40, borderRadius:11, background:C.accBg, border:`1px solid ${C.accBdr}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="18" height="18" viewBox="0 0 32 32" fill="none"><rect x="3" y="22" width="5" height="7" rx="1.5" fill={C.acc} opacity="0.5"/><rect x="11" y="16" width="5" height="13" rx="1.5" fill={C.acc} opacity="0.75"/><rect x="19" y="9" width="5" height="20" rx="1.5" fill={C.acc}/></svg>
            </div>
            <div>
              <div style={{ fontFamily:'var(--font-sora)', fontSize:20, fontWeight:700, color:C.tx, marginBottom:10 }}>Intelligence analyses every sale</div>
              <p style={{ fontSize:14, color:C.tx2, lineHeight:1.7, margin:0 }}>Ask which products drive your margin. Spot slow-moving stock before it becomes a problem. Get alerted when a cashier shift has an unusual variance.</p>
            </div>
            <Link href="/signin" style={{ marginTop:'auto', display:'inline-flex', alignItems:'center', gap:6, fontSize:14, fontWeight:600, color:C.acc, textDecoration:'none' }}>
              Try it free →
            </Link>
          </div>

          {/* 2 smaller stacked */}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ background:C.sf, border:`1px solid ${C.b}`, borderRadius:20, padding:'24px 22px', flex:1 }}>
              <div style={{ fontFamily:'var(--font-sora)', fontSize:16, fontWeight:700, color:C.tx, marginBottom:10 }}>Ring up sales</div>
              <p style={{ fontSize:13, color:C.tx2, lineHeight:1.65, margin:'0 0 14px' }}>Full register with barcode scanning, multi-item baskets, discounts, refunds, and digital receipts. Works on any browser — no hardware needed.</p>
              <Link href="/point-of-sale" style={{ fontSize:13, fontWeight:600, color:C.acc, textDecoration:'none' }}>See the PoS →</Link>
            </div>
            <div style={{ background:C.sf, border:`1px solid ${C.b}`, borderRadius:20, padding:'24px 22px', flex:1 }}>
              <div style={{ fontFamily:'var(--font-sora)', fontSize:16, fontWeight:700, color:C.tx, marginBottom:10 }}>Staff, inventory & branches</div>
              <p style={{ fontSize:13, color:C.tx2, lineHeight:1.65, margin:'0 0 14px' }}>Multi-branch PoS with per-location stock, staff OTP login, shift tracking, factory captures, service jobs, and role-based permissions.</p>
              <Link href="/point-of-sale" style={{ fontSize:13, fontWeight:600, color:C.acc, textDecoration:'none' }}>Learn more →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE PROBLEM — atmospheric dark section ───────────────────────── */}
      <section style={{ background:C.sf, borderTop:`1px solid ${C.b}`, borderBottom:`1px solid ${C.b}` }}>
        <div style={{ maxWidth:900, margin:'0 auto', padding:'clamp(64px,8vw,100px) clamp(16px,4vw,40px)' }}>
          <h2 data-motion style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(26px,4vw,46px)', fontWeight:700, lineHeight:1.1, letterSpacing:'-.03em', color:C.tx, marginBottom:16, maxWidth:640, textWrap:'balance' as any }}>
            Your business generates data every day.
            <br/><span style={{ color:C.tx3 }}>Almost none of it reaches a decision.</span>
          </h2>
          <p style={{ fontSize:'clamp(14px,1.6vw,17px)', color:C.tx2, lineHeight:1.75, maxWidth:520, marginBottom:48 }}>
            Most founders run on instinct — not because they want to, but because getting to the data takes too long. By the time you&apos;ve pulled the reports, the moment has passed.
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1, borderRadius:16, overflow:'hidden', border:`1px solid ${C.b}` }} className="pos-grid-3">
            {[
              { before:'2 hours to pull Monday numbers', after:'4 minutes with AskBiz' },
              { before:'Margin looked like 34%', after:'Actually 18.4% once you include freight, duty, and FX' },
              { before:'Found out customer churned', after:'Flagged 89 days before they left' },
            ].map((item, i) => (
              <div key={i} style={{ padding:'28px 22px', background:C.ev, borderRight:i<2?`1px solid ${C.b}`:'none' }}>
                <div style={{ fontSize:13, color:C.tx3, lineHeight:1.6, marginBottom:14, textDecoration:'line-through', opacity:.5 }}>
                  {item.before}
                </div>
                <div style={{ fontSize:14, color:C.acc, fontWeight:600, lineHeight:1.6 }}>
                  ↓ {item.after}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BUSINESS TOOLS ────────────────────────────────────────────────── */}
      <section style={{ maxWidth:960, margin:'0 auto', padding:'clamp(64px,8vw,100px) clamp(16px,4vw,40px)' }}>
        <div className="tools-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(40px,6vw,80px)', alignItems:'start' }}>
          <div data-motion>
            <h2 style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(24px,3.5vw,38px)', fontWeight:700, lineHeight:1.12, letterSpacing:'-.03em', marginBottom:16, color:C.tx, textWrap:'balance' as any }}>
              Five tools that pay for themselves the first time you use them.
            </h2>
            <p style={{ fontSize:15, color:C.tx2, lineHeight:1.7, marginBottom:28 }}>
              Pre-filled from your connected data. Review, adjust, calculate. No spreadsheets.
            </p>
            <Link href="/signin?mode=signup" className="btn-primary" style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'12px 22px', borderRadius:9999, background:C.acc, color:'#fff', fontSize:14, fontWeight:600, textDecoration:'none', boxShadow:`0 0 24px rgba(208,138,89,.25)` }}>
              Open the tools →
            </Link>
          </div>
          <div style={{ display:'flex', flexDirection:'column', border:`1px solid ${C.b}`, borderRadius:16, overflow:'hidden' }}>
            {TOOLS.map((tool, i) => (
              <div key={i} className="card-hover" style={{ padding:'18px 20px', borderBottom:i<TOOLS.length-1?`1px solid ${C.b}`:'none', background:C.sf, transition:'background 150ms' }} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=C.ev}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=C.sf}}>
                <div style={{ fontSize:14, fontWeight:700, color:C.tx, marginBottom:4, fontFamily:'var(--font-sora)' }}>{tool.label}</div>
                <div style={{ fontSize:13, color:C.tx2, lineHeight:1.6 }}>{tool.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POINT OF SALE ─────────────────────────────────────────────────── */}
      <section id="pos" style={{ background:C.sf, borderTop:`1px solid ${C.b}`, borderBottom:`1px solid ${C.b}` }}>
        <div style={{ maxWidth:1060, margin:'0 auto', padding:'clamp(64px,8vw,100px) clamp(16px,4vw,40px)' }}>
          <div style={{ maxWidth:600, marginBottom:44 }}>
            <h2 style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(26px,4vw,44px)', fontWeight:700, lineHeight:1.1, letterSpacing:'-.03em', color:C.tx, marginBottom:14, textWrap:'balance' as any }}>
              A full PoS system — built into your intelligence platform.
            </h2>
            <p style={{ fontSize:'clamp(14px,1.6vw,16px)', color:C.tx2, lineHeight:1.7, margin:0 }}>
              Ring up sales, manage inventory across branches, track staff shifts, and stay tax-compliant — all while your AI learns from every transaction.
            </p>
          </div>

          <div className="pos-grid-4" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:12 }}>
            {[
              { title:'Register & Checkout', desc:'Fast checkout with barcode scanning, split payments, refunds, and digital receipts. Works on tablet or desktop.', tag:'Core' },
              { title:'Inventory & Stock', desc:'Real-time stock levels, low-stock alerts, stock transfers between branches, and AI reorder recommendations.', tag:'Smart' },
              { title:'Multi-Branch', desc:'Manage multiple locations from one dashboard. Per-branch reporting, staff, inventory, and tax settings.', tag:'Scale' },
              { title:'Staff & Shifts', desc:'Role-based access for cashiers and managers. Shift open/close, OTP login, and per-cashier performance tracking.', tag:'Team' },
            ].map((f, i) => (
              <div key={i} style={{ padding:'22px 18px', borderRadius:16, border:`1px solid ${C.b}`, background:C.ev, display:'flex', flexDirection:'column', gap:10 }}>
                <span style={{ fontSize:10, fontWeight:700, color:C.acc, background:C.accBg, border:`1px solid ${C.accBdr}`, padding:'2px 8px', borderRadius:9999, textTransform:'uppercase', letterSpacing:'.05em', alignSelf:'flex-start' }}>{f.tag}</span>
                <div style={{ fontFamily:'var(--font-sora)', fontSize:14, fontWeight:700, color:C.tx }}>{f.title}</div>
                <p style={{ fontSize:12, color:C.tx2, lineHeight:1.65, margin:0 }}>{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="pos-grid-3" style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
            {[
              { title:'Tax & Compliance', desc:'Multi-jurisdiction VAT, consolidated tax reports, and filing previews. Xero and QuickBooks sync built in.' },
              { title:'GDPR Ready', desc:'Customer data export, deletion, consent logging, and data retention reports — all one click.' },
              { title:'AI Intelligence', desc:'Anomaly detection on transactions, AI supplier recommendations, and sales pattern insights from your PoS data.' },
            ].map((f, i) => (
              <div key={i} style={{ padding:'18px 16px', borderRadius:14, border:`1px solid ${C.b}`, background:C.ev }}>
                <div style={{ fontFamily:'var(--font-sora)', fontSize:14, fontWeight:700, color:C.tx, marginBottom:6 }}>{f.title}</div>
                <div style={{ fontSize:12, color:C.tx2, lineHeight:1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop:36 }}>
            <Link href="/signin?mode=signup" className="btn-primary" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'12px 24px', borderRadius:9999, background:C.acc, color:'#fff', fontSize:14, fontWeight:700, textDecoration:'none', boxShadow:`0 0 24px rgba(208,138,89,.25)` }}>
              Try the PoS free →
            </Link>
            <span style={{ fontSize:12, color:C.tx3, marginLeft:16 }}>{posPrice} per seat/month · Works on tablet or desktop</span>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section style={{ maxWidth:860, margin:'0 auto', padding:'clamp(64px,8vw,100px) clamp(16px,4vw,40px)' }}>
        <h2 data-motion style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(24px,3.5vw,38px)', fontWeight:700, textAlign:'center', marginBottom:56, letterSpacing:'-.03em', color:C.tx }}>
          Up and running in under 5 minutes
        </h2>
        <div className="steps-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:0, position:'relative' }}>
          <div className="steps-line" style={{ position:'absolute', top:28, left:'16.6%', right:'16.6%', height:1, background:`linear-gradient(90deg, ${C.acc}, rgba(208,138,89,.2))`, zIndex:0 }}/>
          {[
            { num:'1', title:'Connect your data', body:'Shopify, Amazon, QuickBooks, TikTok Shop — or drop a CSV. Takes 2 minutes.' },
            { num:'2', title:'Ask in plain English', body:'"What is my best margin product?" "Which customers are about to churn?" No SQL, no dashboards.' },
            { num:'3', title:'Get specific answers', body:'Real numbers from your actual data. Recommended actions. Every time.' },
          ].map((step, i) => (
            <div key={i} style={{ padding:'0 clamp(12px,2vw,28px)', textAlign:'center', position:'relative', zIndex:1 }}>
              <div style={{ width:56, height:56, borderRadius:14, background:i===0?C.acc:C.ev, border:`1px solid ${i===0?'transparent':C.b}`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', boxShadow:i===0?`0 0 24px rgba(208,138,89,.35)`:'none' }}>
                <span style={{ fontFamily:'var(--font-sora)', fontWeight:800, fontSize:20, color:i===0?'#fff':C.tx3 }}>{step.num}</span>
              </div>
              <h3 style={{ fontFamily:'var(--font-sora)', fontSize:15, fontWeight:700, color:C.tx, marginBottom:8 }}>{step.title}</h3>
              <p style={{ fontSize:13, color:C.tx2, lineHeight:1.65, margin:0 }}>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section style={{ background:C.sf, borderTop:`1px solid ${C.b}`, borderBottom:`1px solid ${C.b}`, padding:'clamp(64px,8vw,100px) clamp(16px,4vw,40px)' }}>
        <div style={{ maxWidth:960, margin:'0 auto' }}>
          <blockquote data-motion style={{ margin:'0 auto 48px', maxWidth:640, textAlign:'center' }}>
            <p style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(18px,2.8vw,28px)', fontWeight:600, lineHeight:1.35, color:C.tx, marginBottom:24, letterSpacing:'-.02em' }}>
              &ldquo;Connected my Amazon store and it found a margin problem I had been missing for 4 months. Fixed it the same day. Added £400/month to my bottom line.&rdquo;
            </p>
            <cite style={{ fontSize:13, color:C.tx3, fontStyle:'normal', display:'flex', alignItems:'center', gap:8, justifyContent:'center' }}>
              <div style={{ width:32, height:32, borderRadius:'50%', background:C.acc, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#fff' }}>DO</div>
              <span><strong style={{ color:C.tx2 }}>David O.</strong> · Amazon FBA seller · Lagos</span>
            </cite>
          </blockquote>
          <div className="testimonials-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            {TESTIMONIALS.slice(1).map((tm, i) => (
              <figure key={i} style={{ margin:0, padding:'22px', borderRadius:16, border:`1px solid ${C.b}`, background:C.ev }}>
                <blockquote style={{ margin:'0 0 16px', padding:0 }}>
                  <p style={{ fontSize:14, lineHeight:1.7, color:C.tx, margin:0 }}>&ldquo;{tm.text}&rdquo;</p>
                </blockquote>
                <figcaption style={{ display:'flex', alignItems:'center', gap:9 }}>
                  <div style={{ width:32, height:32, borderRadius:'50%', background:C.ev2, border:`1px solid ${C.b}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:C.tx2, flexShrink:0 }}>{tm.avatar}</div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:C.tx }}>{tm.name}</div>
                    <div style={{ fontSize:11, color:C.tx3 }}>{tm.role} · {tm.location}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMPACT STORIES ────────────────────────────────────────────────── */}
      <section style={{ maxWidth:960, margin:'0 auto', padding:'clamp(48px,6vw,72px) clamp(16px,4vw,40px)' }}>
        <div className="stats-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
          {[
            { quote:'Found a margin gap he\'d been missing for 4 months. Fixed it the same day.', name:'David O.', detail:'Amazon FBA · Lagos' },
            { quote:'Replaced 2 hours of Monday reports with 4 minutes of answers.', name:'James K.', detail:'Retail shop owner · Nairobi' },
            { quote:'Flagged 3 customers at risk — 89 days before they stopped buying.', name:'Sarah M.', detail:'Shopify seller · London' },
          ].map((s, i) => (
            <div key={i} style={{ padding:'28px 24px', background:C.sf, border:`1px solid ${C.b}`, borderRadius:16, display:'flex', flexDirection:'column', gap:20 }}>
              <p style={{ fontSize:15, lineHeight:1.7, color:C.tx, margin:0, fontStyle:'italic' }}>&ldquo;{s.quote}&rdquo;</p>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:'auto' }}>
                <div style={{ width:32, height:32, borderRadius:'50%', background:C.accBg, border:`1px solid ${C.accBdr}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:C.acc, flexShrink:0 }}>{s.name.split(' ').map((n: string) => n[0]).join('')}</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:C.tx }}>{s.name}</div>
                  <div style={{ fontSize:11, color:C.tx3 }}>{s.detail}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────────────── */}
      <section id="pricing" style={{ background:C.sf, borderTop:`1px solid ${C.b}`, borderBottom:`1px solid ${C.b}`, padding:'clamp(64px,8vw,100px) clamp(16px,4vw,40px)' }}>
        <div style={{ maxWidth:960, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:36 }}>
            <h2 style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(26px,4vw,42px)', fontWeight:700, marginBottom:8, letterSpacing:'-.03em', color:C.tx }}>
              Simple, honest pricing
            </h2>
            <p style={{ fontSize:14, color:C.tx2 }}>All plans include API access. Cancel anytime.</p>
          </div>

          {/* PoS card */}
          <div style={{ borderRadius:20, border:`1px solid ${C.accBdr}`, background:`rgba(208,138,89,.05)`, padding:'clamp(20px,3vw,28px) clamp(20px,3vw,32px)', marginBottom:28, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:-60, right:-60, width:240, height:240, background:`radial-gradient(circle, ${C.accBg} 0%, transparent 70%)`, pointerEvents:'none' }} />
            <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:20 }}>
              <div style={{ minWidth:200 }}>
                <div style={{ display:'inline-flex', alignItems:'center', gap:8, marginBottom:10 }}>
                  <span style={{ fontFamily:'var(--font-sora)', fontSize:20, fontWeight:800, color:C.acc }}>Point of Sale</span>
                  <span style={{ fontSize:10, fontWeight:700, color:'#fff', background:C.acc, padding:'2px 9px', borderRadius:9999, textTransform:'uppercase', letterSpacing:'.06em' }}>Add-on</span>
                </div>
                <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:6 }}>
                  <span style={{ fontFamily:'var(--font-sora)', fontSize:36, fontWeight:800, color:C.tx, letterSpacing:'-.03em' }}>{posPrice}</span>
                  <span style={{ fontSize:13, color:C.tx3 }}>/seat/month</span>
                </div>
                <p style={{ fontSize:12, color:C.tx3, margin:0, lineHeight:1.5 }}>Add to any Growth or Business plan.<br/>Each seat is one register or device.</p>
                <div style={{ display:'flex', gap:10, marginTop:18, flexWrap:'wrap' }}>
                  <Link href="/signin?mode=signup" className="btn-primary" style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'10px 22px', borderRadius:9999, background:C.acc, color:'#fff', fontSize:13, fontWeight:700, textDecoration:'none' }}>
                    Add to my plan →
                  </Link>
                  <Link href="/point-of-sale" style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'10px 18px', borderRadius:9999, border:`1px solid ${C.accBdr}`, background:'transparent', color:C.acc, fontSize:13, fontWeight:600, textDecoration:'none' }}>
                    See all features
                  </Link>
                </div>
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8, maxWidth:520 }}>
                {['Register & checkout','Inventory management','Staff & shifts','Multi-branch','Tax & VAT (Xero/QB)','Barcode scanning','AI anomaly alerts','Tablet, phone, desktop'].map((f, i) => (
                  <div key={i} style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'6px 12px', borderRadius:9999, background:C.accBg, border:`1px solid ${C.accBdr}`, fontSize:12, color:C.tx2, fontWeight:500 }}>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Annual toggle */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:20 }}>
            <span style={{ fontSize:12, color:C.tx3, fontWeight:500 }}>Intelligence platform:</span>
            <span style={{ fontSize:13, color:annual?C.tx3:C.tx, fontWeight:annual?400:600 }}>Monthly</span>
            <button role="switch" aria-checked={annual} aria-label="Annual billing" onClick={() => setAnnual(v=>!v)} style={{ width:42, height:22, borderRadius:11, background:annual?C.acc:C.ev2, border:`1px solid ${C.b2}`, cursor:'pointer', position:'relative', transition:'background 200ms' }}>
              <div style={{ width:16, height:16, borderRadius:'50%', background:'#fff', position:'absolute', top:3, left:annual?23:3, transition:'left 200ms', boxShadow:'0 1px 4px rgba(0,0,0,.4)' }}/>
            </button>
            <span style={{ fontSize:13, color:annual?C.tx:C.tx3, fontWeight:annual?600:400 }}>
              Annual <span style={{ fontSize:11, fontWeight:700, color:'#4ade80', background:'rgba(74,222,128,.1)', borderRadius:9999, padding:'1px 7px', marginLeft:4 }}>2 months free</span>
            </span>
          </div>

          {/* Tier cards */}
          <div className="pricing-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
            {[
              { id:'free', name:'Free', colour:'#6b6760', price:'£0', sub:'10 questions/month', popular:false,
                features:['10 questions per month','Upload CSV & Excel','Business Pulse score','Connect Shopify, Amazon & more','FX Risk, Landed Cost, Export tools','API access','No credit card needed'] },
              { id:'growth', name:'Growth', colour:C.acc, price:growthMonthly, sub:'per month', popular:true,
                features:['Unlimited questions','All tools pre-filled from your data','Daily Brief — AI morning intelligence',`Point of Sale — ${posPrice}/seat/month add-on`,'Social Commerce — TikTok, Instagram, Pinterest','Churn Intelligence — monthly scan','Anomaly alerts'] },
              { id:'business', name:'Business', colour:'#a78bfa', price:bizMonthly, sub:'per month', popular:false,
                features:['Everything in Growth','Team seats — up to 5',`Multi-branch PoS — ${posPrice}/seat/month add-on`,'Decision Memory','Competitor Watch','CFO Mode reports','Priority support'] },
            ].map((plan, i) => (
              <div key={i} style={{ borderRadius:18, border:plan.popular?`1px solid ${C.accBdr}`:`1px solid ${C.b}`, background:plan.popular?`rgba(208,138,89,.04)`:C.ev, padding:'24px 20px', position:'relative', display:'flex', flexDirection:'column' }}>
                {plan.popular && (
                  <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', padding:'3px 14px', borderRadius:9999, background:C.acc, color:'#fff', fontSize:10, fontWeight:700, whiteSpace:'nowrap', textTransform:'uppercase', letterSpacing:'.06em' }}>
                    3 months free trial
                  </div>
                )}
                <div style={{ marginBottom:14 }}>
                  <div style={{ fontFamily:'var(--font-sora)', fontSize:16, fontWeight:700, color:plan.colour, marginBottom:10 }}>{plan.name}</div>
                  <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:4 }}>
                    <span style={{ fontFamily:'var(--font-sora)', fontSize:28, fontWeight:800, color:C.tx, letterSpacing:'-.03em' }}>{plan.price}</span>
                    {plan.id !== 'free' && <span style={{ fontSize:13, color:C.tx3 }}>{plan.sub}{annual?' · billed annually':''}</span>}
                  </div>
                  <p style={{ fontSize:12, color:C.tx3, lineHeight:1.5, margin:0 }}>{plan.sub}</p>
                </div>
                <div style={{ flex:1, marginBottom:18 }}>
                  {plan.features.map((f, j) => (
                    <div key={j} style={{ display:'flex', gap:8, alignItems:'flex-start', fontSize:13, color:C.tx2, marginBottom:8 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={plan.colour} strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink:0, marginTop:2 }}><path d="M20 6L9 17l-5-5"/></svg>
                      {f}
                    </div>
                  ))}
                </div>
                <Link href="/signin?mode=signup" className="btn-primary" style={{ display:'block', padding:'11px', borderRadius:10, border:plan.popular?'none':`1px solid ${C.b2}`, background:plan.popular?C.acc:'transparent', color:plan.popular?'#fff':C.tx2, fontSize:14, fontWeight:600, textDecoration:'none', textAlign:'center' }}>
                  {plan.id==='free'?'Start for free':plan.id==='growth'?'Start free trial →':'Upgrade →'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section style={{ maxWidth:640, margin:'0 auto', padding:'clamp(64px,8vw,100px) clamp(16px,4vw,40px)' }}>
        <h2 data-motion style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(24px,3.5vw,36px)', fontWeight:700, textAlign:'center', marginBottom:40, letterSpacing:'-.03em', color:C.tx }}>Common questions</h2>
        <div>
          {FAQS.map((faq, i) => (
            <div key={i} className="faq-item" role="button" tabIndex={0} aria-expanded={openFaq === i} style={{ borderBottom:`1px solid ${C.b}`, cursor:'pointer', transition:'background 150ms', borderRadius:8, padding:'0 4px' }} onClick={() => setOpenFaq(openFaq === i ? null : i)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenFaq(openFaq === i ? null : i) } }}>
              <div style={{ padding:'16px 12px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                <h3 style={{ fontFamily:'var(--font-sora)', fontSize:14, fontWeight:600, color:C.tx, margin:0 }}>{faq.q}</h3>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.tx3} strokeWidth="2" strokeLinecap="round" style={{ flexShrink:0, transform:openFaq===i?'rotate(180deg)':'none', transition:'transform 200ms' }}>
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>
              {openFaq === i && (
                <p style={{ fontSize:13, color:C.tx2, lineHeight:1.7, margin:0, padding:'0 12px 16px' }}>{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── ACADEMY + BLOG ────────────────────────────────────────────────── */}
      <section style={{ background:C.sf, borderTop:`1px solid ${C.b}`, borderBottom:`1px solid ${C.b}`, padding:'clamp(64px,8vw,100px) clamp(16px,4vw,40px)' }}>
        <div style={{ maxWidth:1060, margin:'0 auto' }}>
          <div className="learn-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(32px,5vw,64px)', alignItems:'start' }}>

            <div>
              <h2 style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(22px,3vw,32px)', fontWeight:700, lineHeight:1.12, letterSpacing:'-.03em', marginBottom:10, color:C.tx }}>
                420+ free guides.<br/>No jargon. No paywall.
              </h2>
              <p style={{ fontSize:14, color:C.tx2, lineHeight:1.7, marginBottom:24 }}>
                Business metrics, KPIs, financial intelligence, eCommerce analytics, FX risk, and AI — explained for founders, not analysts.
              </p>
              <div className="academy-topics" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:20 }}>
                {[
                  { label:'Financial Intelligence', count:'40+' },
                  { label:'eCommerce Analytics', count:'35+' },
                  { label:'FX & Trade', count:'30+' },
                  { label:'Inventory & Supply Chain', count:'25+' },
                  { label:'AI for Business', count:'30+' },
                  { label:'Growth & Strategy', count:'45+' },
                ].map((topic, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 10px', borderRadius:8, border:`1px solid ${C.b}`, background:C.ev, fontSize:12, color:C.tx2 }}>
                    <span style={{ flex:1 }}>{topic.label}</span>
                    <span style={{ fontSize:10, fontWeight:700, color:C.acc }}>{topic.count}</span>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                <Link href="/academy" className="btn-primary" style={{ padding:'10px 20px', borderRadius:9999, background:C.acc, color:'#fff', fontSize:13, fontWeight:600, textDecoration:'none' }}>
                  Browse the Academy →
                </Link>
                <Link href="/academy/learning-paths" style={{ fontSize:13, color:C.tx2, textDecoration:'none', fontWeight:500 }}>
                  Learning paths
                </Link>
              </div>
            </div>

            <div>
              <h2 style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(22px,3vw,32px)', fontWeight:700, lineHeight:1.12, letterSpacing:'-.03em', marginBottom:10, color:C.tx }}>
                Intelligence Hub
              </h2>
              <p style={{ fontSize:14, color:C.tx2, lineHeight:1.7, marginBottom:22 }}>
                Deep dives on AI, eCommerce, finance, and SME strategy from the AskBiz team.
              </p>
              <div style={{ display:'flex', flexDirection:'column', border:`1px solid ${C.b}`, borderRadius:12, overflow:'hidden' }}>
                {[
                  { tag:'AI Chief of Staff', title:'How AI Is Replacing the COO for Solo Founders', time:'6 min', tagColor:'#c4b5fd' },
                  { tag:'Financial Intelligence', title:'The Cash Flow Metrics Every SME Founder Should Track Weekly', time:'5 min', tagColor:'#4ade80' },
                  { tag:'eCommerce', title:'TikTok Shop vs Shopify: Where Should You Sell First?', time:'7 min', tagColor:'#7dd3fc' },
                ].map((post, i) => (
                  <div key={i} style={{ padding:'16px 14px', borderBottom:i<2?`1px solid ${C.b}`:'none', background:C.ev }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
                      <span style={{ fontSize:10, fontWeight:700, color:post.tagColor, background:`rgba(255,255,255,.05)`, border:`1px solid rgba(255,255,255,.1)`, padding:'2px 7px', borderRadius:9999 }}>{post.tag}</span>
                      <span style={{ fontSize:10, color:C.tx3 }}>{post.time} read</span>
                    </div>
                    <div style={{ fontFamily:'var(--font-sora)', fontSize:14, fontWeight:600, color:C.tx, lineHeight:1.4 }}>{post.title}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:16 }}>
                <Link href="/blog" className="btn-primary" style={{ padding:'10px 20px', borderRadius:9999, border:`1px solid ${C.b2}`, background:'transparent', color:C.tx2, fontSize:13, fontWeight:600, textDecoration:'none' }}>
                  Read all articles →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section style={{ position:'relative', overflow:'hidden', padding:'clamp(80px,10vw,120px) clamp(16px,4vw,40px)', textAlign:'center' }}>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'60%', maxWidth:700, height:400, background:`radial-gradient(ellipse at center, ${C.accBg} 0%, transparent 68%)`, pointerEvents:'none' }} />
        <div data-motion style={{ maxWidth:560, margin:'0 auto', position:'relative' }}>
          <div style={{ width:52, height:52, borderRadius:14, background:C.acc, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 28px' }}>
            <Logo size={24} />
          </div>
          <h2 style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(28px,4.5vw,48px)', fontWeight:700, color:C.tx, marginBottom:16, letterSpacing:'-.03em', lineHeight:1.1, textWrap:'balance' as any }}>
            Your data already has<br/>the answers.
          </h2>
          <p style={{ fontSize:17, color:C.tx2, lineHeight:1.7, marginBottom:36 }}>
            Most founders are one question away from a decision that changes their month. Ask AskBiz.
          </p>
          <Link href="/signin?mode=signup" className="btn-primary" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'16px 32px', borderRadius:9999, border:'none', background:C.acc, color:'#fff', fontSize:16, fontWeight:700, textDecoration:'none', boxShadow:`0 0 48px rgba(208,138,89,.3)`, letterSpacing:'-.01em' }}>
            {geoCtaText}
          </Link>
          <p style={{ fontSize:12, color:C.tx3, marginTop:14 }}>No credit card · 2 minutes to set up · Cancel anytime</p>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer style={{ borderTop:`1px solid ${C.b}`, background:C.sf, padding:'clamp(20px,3vw,28px) clamp(16px,4vw,40px)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:7 }}>
          <div style={{ width:22, height:22, borderRadius:6, background:C.acc, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Logo size={10} />
          </div>
          <span style={{ fontFamily:'var(--font-sora)', fontSize:13, fontWeight:700, color:C.tx }}>AskBiz</span>
          <span style={{ fontSize:12, color:C.tx3 }}>© 2026</span>
        </div>
        <nav className="footer-nav" style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
          {[['/', 'Home'], ['/blog', 'Blog'], ['/academy', 'Academy'], ['/case-studies', 'Case Studies'], ['/benchmarks', 'Benchmarks'], ['/integrations', 'Integrations'], ['/free-tools', 'Free Tools'], ['/developers', 'API'], ['/help', 'Help'], ['/pricing', 'Pricing'], ['/changelog', 'Changelog'], ['/rules', 'Rules & Policies'], ['/transparency', 'Transparency'], ['/privacy', 'Privacy'], ['/terms', 'Terms'], ['mailto:hello@askbiz.co', 'Contact']].map(([href, label]) => (
            <a key={href} href={href} className="nav-link" style={{ fontSize:12, color:C.tx3, textDecoration:'none', transition:'color 150ms' }}>{label}</a>
          ))}
        </nav>
      </footer>

    </div>
  )
}

export default function LandingClient({ geo, lang = 'en' }: { geo: Geo | null; lang?: string }) {
  return (
    <LanguageProvider initialLang={lang as Lang}>
      <LandingInner geo={geo}/>
    </LanguageProvider>
  )
}
