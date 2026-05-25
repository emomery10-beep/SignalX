'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import LanguageToggle from '@/components/LanguageToggle'
import { LanguageProvider, useLang } from '@/components/LanguageProvider'
import type { Lang } from '@/lib/i18n'
import { COUNTRY_TO_LANG } from '@/lib/i18n'

const C = {
  bg:     '#F9F8F6',
  sf:     '#FFFFFF',
  ev:     '#F3F2EF',
  tx:     '#1A1916',
  tx2:    '#6B6760',
  tx3:    '#A39E97',
  b:      'rgba(0,0,0,.08)',
  b2:     'rgba(0,0,0,.14)',
  acc:    '#D08A59',
  accBg:  'rgba(208,138,89,.10)',
  accBdr: 'rgba(208,138,89,.30)',
}

interface Geo {
  country: string; countryCode: string; city: string
  currency: string; currencySymbol: string; currencyName: string; flag: string
  pricing: { growth: string; business: string; sym: string; pos: string }
}

const INTEGRATIONS = [
  { name: 'Shopify', icon: '🛍️' }, { name: 'Amazon FBA', icon: '📦' },
  { name: 'TikTok Shop', icon: '🎵' }, { name: 'Instagram', icon: '📸' },
  { name: 'Stripe', icon: '💳' }, { name: 'QuickBooks', icon: '📒' },
  { name: 'Google Sheets', icon: '📊' }, { name: 'Pinterest', icon: '📌' },
  { name: 'Square', icon: '⬛' }, { name: 'CSV / Excel', icon: '📁' },
]

const DEMOS = [
  {
    tag: 'Margin',
    emoji: '💰',
    q: 'What is my best margin product right now?',
    a: 'Wireless Earbuds — 34.2% gross margin, £8.22 profit per unit. At 143 units/month that\'s £1,175 in monthly profit from one SKU. Your second-best is Screen Protectors at 28.1%, but velocity is falling 23% month-on-month. Focus on Earbuds.',
    kpis: [
      { label: 'Best margin', value: '34.2%', good: true },
      { label: 'Monthly profit', value: '£1,175', good: true },
      { label: 'Velocity trend', value: '+12%', good: true },
    ],
  },
  {
    tag: 'Churn risk',
    emoji: '👥',
    q: 'Which customers are about to stop buying from me?',
    a: '3 customers are at risk. Sarah Johnson — last order 89 days ago, usually buys every 23 days, lifetime value £1,840. She\'s 66 days overdue. David Chen and Aisha Okafor are also flagged. Combined LTV at risk: £4,200.',
    kpis: [
      { label: 'At risk', value: '3 customers', good: false },
      { label: 'LTV at risk', value: '£4,200', good: false },
      { label: 'Most urgent', value: '89 days', good: false },
    ],
  },
  {
    tag: 'Landed cost',
    emoji: '🧮',
    q: 'What is my true landed cost on my China imports?',
    a: 'Your landed cost is £11.84/unit — not the £8.50 on the invoice. Freight adds £1.20, import duty (12%) adds £1.02, port handling £0.62, 2% FX buffer £0.50. Your real gross margin is 18.4% — not the 34% you assumed. On 500 units that\'s a £3,870 margin gap.',
    kpis: [
      { label: 'True landed cost', value: '£11.84', good: false },
      { label: 'Real margin', value: '18.4%', good: false },
      { label: 'Margin gap', value: '£3,870', good: false },
    ],
  },
  {
    tag: 'Export markets',
    emoji: '🌍',
    q: 'Which export market should I enter first?',
    a: 'UAE scores 78/100 for your business. Your Beauty and Homeware lines match the top demand categories, duty is a flat 5%, and UK brands command a 18% premium there. Germany is second at 71 — but post-Brexit customs add 8-10 days to lead times.',
    kpis: [
      { label: 'Top market', value: 'UAE 78/100', good: true },
      { label: 'UK premium', value: '+18%', good: true },
      { label: 'Import duty', value: '5% flat', good: true },
    ],
  },
  {
    tag: 'Demand signal',
    emoji: '📱',
    q: 'Any products going viral on social that I should know about?',
    a: 'Your Bamboo Travel Set has 847 saves on Pinterest this week — a 340% spike — but zero orders. You have 12 units left at current reorder lead time of 18 days. You need to reorder today or you\'ll miss the demand peak.',
    kpis: [
      { label: 'Pinterest saves', value: '847 ↑340%', good: true },
      { label: 'Stock left', value: '12 units', good: false },
      { label: 'Lead time', value: '18 days', good: false },
    ],
  },
]

const TOOLS = [
  { icon: '💱', label: 'FX Risk Modeller', desc: 'Model sterling falling 5%, 10%, 15% against your import currency. See exactly which product lines go below your minimum margin before it happens.' },
  { icon: '🏭', label: 'Supplier Scorecard', desc: 'Every supplier graded A–F from your shipment history. On-time rate, average delay days, customs holds, and financial impact — all in one view.' },
  { icon: '🧮', label: 'Landed Cost Calculator', desc: 'True cost per unit: supplier price + freight + duty + VAT + FX buffer. Reveals the margin gap between what you assumed and what you\'re actually making.' },
  { icon: '🌍', label: 'Export Market Scoring', desc: '20 markets scored by ecommerce growth, logistics, UK brand premium, duty environment, and your specific product-category match.' },
  { icon: '📱', label: 'Social Commerce', desc: 'TikTok Shop, Instagram, and Pinterest connected. Conversion rates, demand signals, and viral product alerts before you run out of stock.' },
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

// ── Product Demo (Google "What's New" style) ──────────────────────────────────

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

function DemoScreen({ screen }: { screen: string }) {
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
        <div style={{ padding:'8px 12px', borderRadius:14, borderBottomRightRadius:3, background:C.ev, border:`1px solid ${C.b}`, fontSize:12, color:C.tx, maxWidth:'85%' }}>What is my best margin product?</div>
      </div>
      <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
        <div style={{ width:24, height:24, borderRadius:7, background:C.acc, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2 }}>
          <svg width="10" height="10" viewBox="0 0 32 32" fill="none"><rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.5"/><rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.75"/><rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/></svg>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ padding:'8px 12px', borderRadius:14, borderBottomLeftRadius:3, background:C.sf, border:`1px solid ${C.b}`, fontSize:11, lineHeight:1.65, color:C.tx, marginBottom:8 }}>
            <strong>Wireless Earbuds</strong> — 34.2% gross margin, £8.22 profit per unit. At 143 units/month that&apos;s <strong>£1,175</strong> in monthly profit.
          </div>
          <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
            <span className="kpi-chip" style={{ background:'rgba(34,197,94,.06)', color:'#16a34a', borderColor:'rgba(34,197,94,.2)', fontSize:10, padding:'3px 8px' }}><span style={{ opacity:.7 }}>Margin</span> <strong>34.2%</strong></span>
            <span className="kpi-chip" style={{ background:'rgba(34,197,94,.06)', color:'#16a34a', borderColor:'rgba(34,197,94,.2)', fontSize:10, padding:'3px 8px' }}><span style={{ opacity:.7 }}>Profit</span> <strong>£1,175/mo</strong></span>
          </div>
        </div>
      </div>
    </div>
  )
  if (screen === 'supplier') return (
    <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', gap:8 }}>
      <div style={{ fontSize:12, fontWeight:700, color:C.tx, marginBottom:2 }}>Supplier Scorecard <span style={{ fontSize:10, fontWeight:400, color:C.tx3 }}>— Last 6 months</span></div>
      {[
        { name:'Guangzhou Tech Co.', grade:'A', color:'#16a34a', onTime:'96%', delay:'0.4d', impact:'+£2,100' },
        { name:'Shenzhen Goods Ltd', grade:'B', color:C.acc, onTime:'81%', delay:'2.1d', impact:'-£380' },
        { name:'Alibaba Exports Co.', grade:'D', color:'#dc2626', onTime:'62%', delay:'6.8d', impact:'-£1,940' },
      ].map((s,i) => (
        <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', background:C.bg, borderRadius:8, border:`1px solid ${C.b}` }}>
          <div style={{ width:28, height:28, borderRadius:6, background:`${s.color}12`, border:`1px solid ${s.color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-sora)', fontWeight:800, fontSize:14, color:s.color }}>{s.grade}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:11, fontWeight:600, color:C.tx }}>{s.name}</div>
            <div style={{ fontSize:9, color:C.tx3 }}>On-time: {s.onTime} · Avg delay: {s.delay}</div>
          </div>
          <div style={{ fontSize:11, fontWeight:700, color:s.impact.startsWith('+') ? '#16a34a' : '#dc2626' }}>{s.impact}/mo</div>
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
          <div><div style={{ fontSize:11, fontWeight:600, color:C.tx }}>{p.pair}</div><span style={{ fontSize:8, fontWeight:700, color:p.risk==='high'?'#dc2626':p.risk==='medium'?C.acc:'#16a34a', background:p.risk==='high'?'rgba(239,68,68,.08)':p.risk==='medium'?C.accBg:'rgba(34,197,94,.08)', padding:'1px 5px', borderRadius:3 }}>{p.risk}</span></div>
          <div style={{ fontSize:11, color:'#d08a59', fontWeight:600 }}>{p.d5}</div>
          <div style={{ fontSize:11, color:'#dc2626', fontWeight:600 }}>{p.d10}</div>
          <div style={{ fontSize:11, color:'#991b1b', fontWeight:700 }}>{p.d15}</div>
        </div>
      ))}
      <div style={{ padding:'8px 10px', borderRadius:6, background:'rgba(239,68,68,.05)', border:'1px solid rgba(239,68,68,.12)', fontSize:10, color:'#dc2626', lineHeight:1.5 }}>
        ⚠️ If GBP/CNY drops 10%, China imports lose <strong>£1,840</strong> this month.
      </div>
    </div>
  )
  return (
    <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', gap:8 }}>
      <div style={{ fontSize:12, fontWeight:700, color:C.tx, marginBottom:2 }}>Export Market Scoring <span style={{ fontSize:10, fontWeight:400, color:C.tx3 }}>— Your product mix</span></div>
      {[
        { flag:'🇦🇪', name:'UAE', score:78, channel:'Noon.com', duty:'5% flat', premium:'+18%', tagColor:'#16a34a' },
        { flag:'🇩🇪', name:'Germany', score:71, channel:'Amazon.de', duty:'6.5%', premium:'+12%', tagColor:C.acc },
        { flag:'🇺🇸', name:'United States', score:64, channel:'Amazon US', duty:'3.5%', premium:'+9%', tagColor:C.tx3 },
      ].map((m,i) => (
        <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', background:C.bg, borderRadius:8, border:`1px solid ${C.b}` }}>
          <span style={{ fontSize:20 }}>{m.flag}</span>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:11, fontWeight:600, color:C.tx }}>{m.name} <span style={{ fontSize:9, color:C.tx3 }}>via {m.channel}</span></div>
            <div style={{ fontSize:9, color:C.tx3 }}>Duty: {m.duty} · UK premium: <span style={{ color:'#16a34a' }}>{m.premium}</span></div>
          </div>
          <div style={{ fontFamily:'var(--font-sora)', fontSize:18, fontWeight:800, color:m.tagColor }}>{m.score}<span style={{ fontSize:9, color:C.tx3, fontWeight:400 }}>/100</span></div>
        </div>
      ))}
    </div>
  )
}

function InteractiveDemo() {
  const [active, setActive] = useState(0)
  const tickRef = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let id: ReturnType<typeof window.setInterval> | null = null

    const start = () => {
      if (id) return
      id = window.setInterval(() => {
        tickRef.current += 1
        if (tickRef.current % 30 === 0) {
          setActive(a => (a + 1) % DEMO_SLIDES.length)
        }
      }, 200)
    }

    const stop = () => {
      if (id) { window.clearInterval(id); id = null }
    }

    const observer = new IntersectionObserver(
      ([entry]) => { entry.isIntersecting ? start() : stop() },
      { threshold: 0.2 }
    )

    if (containerRef.current) observer.observe(containerRef.current)
    return () => { stop(); observer.disconnect() }
  }, [])

  const slide = DEMO_SLIDES[active]

  const go = useCallback((i: number) => {
    tickRef.current = 0
    setActive(i)
  }, [])

  const next = useCallback(() => {
    tickRef.current = 0
    setActive(a => (a + 1) % DEMO_SLIDES.length)
  }, [])

  return (
    <div id="demo" ref={containerRef} style={{ maxWidth:1100, margin:'0 auto', padding:'0 clamp(16px,4vw,40px) clamp(40px,6vw,64px)' }}>

      {/* Main area: left text + right screen */}
      <div className="demo-layout" style={{ display:'grid', gridTemplateColumns:'1fr 1.3fr', gap:'clamp(24px,4vw,56px)', alignItems:'center', marginBottom:32 }}>

        {/* Left — description */}
        <div>
          <h2 style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(22px,3vw,32px)', fontWeight:700, lineHeight:1.2, letterSpacing:'-.02em', marginBottom:16, color:C.tx }}>{slide.title}</h2>
          <p style={{ fontSize:14, color:C.tx2, lineHeight:1.7, marginBottom:24 }}>{slide.desc}</p>
          <ol style={{ listStyle:'none', padding:0, margin:'0 0 28px', display:'flex', flexDirection:'column', gap:12 }}>
            {slide.steps.map((step, i) => (
              <li key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', fontSize:13, color:C.tx, lineHeight:1.55 }}>
                <span style={{ width:22, height:22, borderRadius:'50%', background:C.accBg, border:`1px solid ${C.accBdr}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:C.acc, flexShrink:0 }}>{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
          <button onClick={next} style={{ padding:'10px 24px', borderRadius:9999, border:`1px solid ${C.b2}`, background:C.sf, color:C.tx, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit', transition:'all 150ms' }} className="card-hover">
            Next →
          </button>
        </div>

        {/* Right — mock screen */}
        <div style={{ background:C.ev, borderRadius:16, border:`1px solid ${C.b}`, overflow:'hidden', boxShadow:'0 8px 32px rgba(0,0,0,.07)', position:'relative' }}>
          {/* Window chrome */}
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px', background:'rgba(0,0,0,.03)', borderBottom:`1px solid ${C.b}` }}>
            <div style={{ display:'flex', gap:5 }}>
              <span style={{ width:9, height:9, borderRadius:'50%', background:'#ff5f57' }} />
              <span style={{ width:9, height:9, borderRadius:'50%', background:'#febc2e' }} />
              <span style={{ width:9, height:9, borderRadius:'50%', background:'#28c840' }} />
            </div>
            <div style={{ flex:1, textAlign:'center', fontSize:10, color:C.tx3 }}>askbiz.co/dashboard</div>
          </div>
          {/* Progress bar */}
          <div style={{ height:2, background:C.ev, position:'relative', overflow:'hidden' }}>
            <div key={active} style={{ position:'absolute', top:0, left:0, height:'100%', background:C.acc, animation:'progress 6s linear forwards' }} />
          </div>
          {/* Screen content */}
          <div style={{ background:C.sf, minHeight:260 }}>
            <DemoScreen screen={slide.screen} />
          </div>
        </div>
      </div>

      {/* Bottom carousel */}
      <div style={{ display:'flex', gap:12, alignItems:'center' }}>
        <div className="demo-cards" style={{ display:'flex', gap:10, flex:1, overflowX:'auto', paddingBottom:4 }}>
          {DEMO_SLIDES.map((s, i) => (
            <button key={s.id} onClick={() => go(i)} style={{
              flex:'1 0 0', minWidth:140, padding:'14px 12px', borderRadius:12,
              border: i === active ? `2px solid ${C.acc}` : `1px solid ${C.b}`,
              background: i === active ? C.accBg : C.sf,
              cursor:'pointer', textAlign:'left', fontFamily:'inherit', transition:'all 180ms',
              display:'flex', alignItems:'center', gap:10,
            }}>
              <span style={{ fontSize:22 }}>{s.thumb}</span>
              <span style={{ fontSize:12, fontWeight: i === active ? 700 : 500, color: i === active ? C.acc : C.tx2, lineHeight:1.3 }}>{s.label}</span>
            </button>
          ))}
        </div>
        <div style={{ display:'flex', gap:6, flexShrink:0 }}>
          <button onClick={() => go((active - 1 + DEMO_SLIDES.length) % DEMO_SLIDES.length)} style={{ width:32, height:32, borderRadius:'50%', border:`1px solid ${C.b}`, background:C.sf, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, color:C.tx3 }}>‹</button>
          <button onClick={next} style={{ width:32, height:32, borderRadius:'50%', border:`1px solid ${C.b}`, background:C.sf, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, color:C.tx3 }}>›</button>
        </div>
      </div>
    </div>
  )
}

// ── Mini Calculator Widget (compact, hero-inline) ──────────────────────────

const CURRENCIES = [
  { code:'GBP', symbol:'£' }, { code:'USD', symbol:'$' }, { code:'EUR', symbol:'€' },
  { code:'KES', symbol:'KSh' }, { code:'NGN', symbol:'₦' }, { code:'ZAR', symbol:'R' },
  { code:'AED', symbol:'د.إ' }, { code:'INR', symbol:'₹' }, { code:'AUD', symbol:'A$' },
  { code:'CAD', symbol:'C$' }, { code:'JPY', symbol:'¥' }, { code:'CHF', symbol:'Fr' },
] as const

function MiniCalcWidget() {
  const [tab, setTab] = useState<'margin' | 'cogs'>('margin')
  const [cur, setCur] = useState(0) // index into CURRENCIES
  const [showCur, setShowCur] = useState(false)
  const sym = CURRENCIES[cur].symbol
  const [mc, setMc] = useState({ cost: '', revenue: '', units: '' })
  const [cg, setCg] = useState({ materials: '', labour: '', shipping: '', packaging: '', salePrice: '', units: '' })

  // Margin calc
  const mCost = parseFloat(mc.cost) || 0
  const mRev = parseFloat(mc.revenue) || 0
  const mUnits = parseInt(mc.units) || 0
  const mProfit = mRev - mCost
  const mMargin = mRev > 0 ? (mProfit / mRev) * 100 : 0
  const mMarkup = mCost > 0 ? (mProfit / mCost) * 100 : 0
  const mHasResult = mCost > 0 && mRev > 0

  // COGS calc
  const cMat = parseFloat(cg.materials) || 0
  const cLab = parseFloat(cg.labour) || 0
  const cShp = parseFloat(cg.shipping) || 0
  const cPkg = parseFloat(cg.packaging) || 0
  const cSp  = parseFloat(cg.salePrice) || 0
  const cUnits = parseInt(cg.units) || 0
  const cCogs = cMat + cLab + cShp + cPkg
  const cGross = cSp - cCogs
  const cMargin = cSp > 0 ? (cGross / cSp) * 100 : 0
  const cRatio = cSp > 0 ? (cCogs / cSp) * 100 : 0
  const cHasResult = cCogs > 0

  const marginColor = (m: number) => m >= 30 ? '#22c55e' : m >= 15 ? '#e67e22' : '#e74c3c'
  const inp: React.CSSProperties = { width:'100%', padding:'8px 10px', fontSize:13, border:`1px solid ${C.b2}`, borderRadius:8, background:C.bg, color:C.tx, fontFamily:'inherit', outline:'none', boxSizing:'border-box', transition:'border-color 150ms' }
  const lbl: React.CSSProperties = { display:'block', fontSize:10, color:C.tx3, fontWeight:600, marginBottom:3, textTransform:'uppercase', letterSpacing:'.02em' }

  return (
    <div className="fade-up mini-calc" style={{ maxWidth:480, width:'100%', background:C.sf, border:`1px solid ${C.b}`, borderRadius:16, overflow:'hidden', boxShadow:'0 4px 24px rgba(0,0,0,.07)' }}>

      {/* Tabs + currency selector row */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'12px 16px 0', gap:10 }}>
        <div style={{ display:'inline-flex', borderRadius:9999, border:`1px solid ${C.b2}`, overflow:'hidden', background:C.ev }}>
          {(['margin','cogs'] as const).map(id => (
            <button key={id} onClick={() => setTab(id)}
              style={{ padding:'7px 22px', fontSize:12, fontWeight:700, fontFamily:'var(--font-sora)', background:tab===id?C.acc:'transparent', color:tab===id?'#fff':C.tx3, border:'none', cursor:'pointer', transition:'all 150ms', letterSpacing:'-.01em', whiteSpace:'nowrap' }}>
              {id==='margin'?'Profit Margin':'Cost of Goods'}
            </button>
          ))}
        </div>
        {/* Currency picker */}
        <div style={{ position:'relative' }}>
          <button onClick={() => setShowCur(!showCur)}
            style={{ padding:'5px 8px', fontSize:11, fontWeight:600, fontFamily:'inherit', background:C.ev, border:`1px solid ${C.b2}`, borderRadius:6, cursor:'pointer', color:C.tx2, display:'flex', alignItems:'center', gap:3, whiteSpace:'nowrap' }}>
            {sym} <span style={{ fontSize:8, opacity:.6 }}>▼</span>
          </button>
          {showCur && (
            <div style={{ position:'absolute', top:'100%', right:0, marginTop:4, background:C.sf, border:`1px solid ${C.b}`, borderRadius:10, boxShadow:'0 8px 24px rgba(0,0,0,.12)', zIndex:10, padding:6, display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:2, minWidth:160 }}>
              {CURRENCIES.map((c, i) => (
                <button key={c.code} onClick={() => { setCur(i); setShowCur(false) }}
                  style={{ padding:'5px 8px', fontSize:10, fontWeight:cur===i?700:500, fontFamily:'inherit', background:cur===i?C.acc:'transparent', color:cur===i?'#fff':C.tx2, border:'none', borderRadius:6, cursor:'pointer', textAlign:'center', whiteSpace:'nowrap' }}>
                  {c.symbol} {c.code}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ padding:'14px 18px 16px' }}>
        {tab === 'margin' ? (
          <>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
              <div><label style={lbl}>Cost ({sym})</label><input type="number" min="0" step="0.01" placeholder="4.50" style={inp} value={mc.cost} onChange={e => setMc(p => ({ ...p, cost: e.target.value }))} /></div>
              <div><label style={lbl}>Sale price ({sym})</label><input type="number" min="0" step="0.01" placeholder="9.99" style={inp} value={mc.revenue} onChange={e => setMc(p => ({ ...p, revenue: e.target.value }))} /></div>
              <div><label style={lbl}>Units sold</label><input type="number" min="0" step="1" placeholder="100" style={inp} value={mc.units} onChange={e => setMc(p => ({ ...p, units: e.target.value }))} /></div>
            </div>

            {mHasResult && (
              <div style={{ marginTop:12 }}>
                {/* Visual margin bar */}
                <div style={{ position:'relative', height:6, borderRadius:3, background:C.ev, overflow:'hidden', marginBottom:10 }}>
                  <div style={{ position:'absolute', left:0, top:0, height:'100%', width:`${Math.min(mMargin, 100)}%`, borderRadius:3, background: `linear-gradient(90deg, ${marginColor(mMargin)}, ${marginColor(mMargin)}cc)`, transition:'width 300ms ease' }} />
                </div>
                <div style={{ display:'grid', gridTemplateColumns: mUnits > 0 ? '1fr 1fr 1fr 1fr' : '1fr 1fr 1fr', gap:6 }}>
                  <div style={{ textAlign:'center', padding:'8px 4px', background:C.ev, borderRadius:10 }}>
                    <div style={{ fontFamily:'var(--font-sora)', fontSize:18, fontWeight:700, color:marginColor(mMargin) }}>{mMargin.toFixed(1)}%</div>
                    <div style={{ fontSize:9, color:C.tx3, fontWeight:600, marginTop:2 }}>MARGIN</div>
                  </div>
                  <div style={{ textAlign:'center', padding:'8px 4px', background:C.ev, borderRadius:10 }}>
                    <div style={{ fontFamily:'var(--font-sora)', fontSize:18, fontWeight:700, color:C.tx }}>{sym}{mProfit.toFixed(2)}</div>
                    <div style={{ fontSize:9, color:C.tx3, fontWeight:600, marginTop:2 }}>PROFIT</div>
                  </div>
                  <div style={{ textAlign:'center', padding:'8px 4px', background:C.ev, borderRadius:10 }}>
                    <div style={{ fontFamily:'var(--font-sora)', fontSize:18, fontWeight:700, color:C.tx2 }}>{mMarkup.toFixed(0)}%</div>
                    <div style={{ fontSize:9, color:C.tx3, fontWeight:600, marginTop:2 }}>MARKUP</div>
                  </div>
                  {mUnits > 0 && (
                    <div style={{ textAlign:'center', padding:'8px 4px', background:C.ev, borderRadius:10 }}>
                      <div style={{ fontFamily:'var(--font-sora)', fontSize:18, fontWeight:700, color:'#22c55e' }}>{sym}{(mProfit * mUnits).toLocaleString('en-GB', { minimumFractionDigits:0, maximumFractionDigits:0 })}</div>
                      <div style={{ fontSize:9, color:C.tx3, fontWeight:600, marginTop:2 }}>TOTAL PROFIT</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:8 }}>
              <div><label style={lbl}>Materials ({sym})</label><input type="number" min="0" step="0.01" placeholder="3.00" style={inp} value={cg.materials} onChange={e => setCg(p => ({ ...p, materials: e.target.value }))} /></div>
              <div><label style={lbl}>Labour ({sym})</label><input type="number" min="0" step="0.01" placeholder="2.50" style={inp} value={cg.labour} onChange={e => setCg(p => ({ ...p, labour: e.target.value }))} /></div>
              <div><label style={lbl}>Shipping ({sym})</label><input type="number" min="0" step="0.01" placeholder="1.20" style={inp} value={cg.shipping} onChange={e => setCg(p => ({ ...p, shipping: e.target.value }))} /></div>
              <div><label style={lbl}>Packaging ({sym})</label><input type="number" min="0" step="0.01" placeholder="0.80" style={inp} value={cg.packaging} onChange={e => setCg(p => ({ ...p, packaging: e.target.value }))} /></div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <div><label style={lbl}>Sale price ({sym})</label><input type="number" min="0" step="0.01" placeholder="12.99" style={inp} value={cg.salePrice} onChange={e => setCg(p => ({ ...p, salePrice: e.target.value }))} /></div>
              <div><label style={lbl}>Units sold</label><input type="number" min="0" step="1" placeholder="100" style={inp} value={cg.units} onChange={e => setCg(p => ({ ...p, units: e.target.value }))} /></div>
            </div>

            {cHasResult && (
              <div style={{ marginTop:12 }}>
                {/* Visual cost breakdown bar */}
                {cSp > 0 && (
                  <div style={{ position:'relative', height:6, borderRadius:3, background:C.ev, overflow:'hidden', marginBottom:10, display:'flex' }}>
                    <div style={{ height:'100%', width:`${Math.min(cRatio, 100)}%`, background:'#e74c3c', borderRadius:'3px 0 0 3px', transition:'width 300ms ease' }} />
                    <div style={{ height:'100%', flex:1, background:'#22c55e', borderRadius:'0 3px 3px 0', transition:'width 300ms ease' }} />
                  </div>
                )}
                <div style={{ display:'grid', gridTemplateColumns: cUnits > 0 && cSp > 0 ? '1fr 1fr 1fr 1fr' : cSp > 0 ? '1fr 1fr 1fr' : '1fr', gap:6 }}>
                  <div style={{ textAlign:'center', padding:'8px 4px', background:C.ev, borderRadius:10 }}>
                    <div style={{ fontFamily:'var(--font-sora)', fontSize:18, fontWeight:700, color:'#e74c3c' }}>{sym}{cCogs.toFixed(2)}</div>
                    <div style={{ fontSize:9, color:C.tx3, fontWeight:600, marginTop:2 }}>COGS/UNIT</div>
                  </div>
                  {cSp > 0 && <>
                    <div style={{ textAlign:'center', padding:'8px 4px', background:C.ev, borderRadius:10 }}>
                      <div style={{ fontFamily:'var(--font-sora)', fontSize:18, fontWeight:700, color:cGross>=0?'#22c55e':'#e74c3c' }}>{sym}{cGross.toFixed(2)}</div>
                      <div style={{ fontSize:9, color:C.tx3, fontWeight:600, marginTop:2 }}>GROSS PROFIT</div>
                    </div>
                    <div style={{ textAlign:'center', padding:'8px 4px', background:C.ev, borderRadius:10 }}>
                      <div style={{ fontFamily:'var(--font-sora)', fontSize:18, fontWeight:700, color:marginColor(cMargin) }}>{cMargin.toFixed(1)}%</div>
                      <div style={{ fontSize:9, color:C.tx3, fontWeight:600, marginTop:2 }}>MARGIN</div>
                    </div>
                  </>}
                  {cUnits > 0 && cSp > 0 && (
                    <div style={{ textAlign:'center', padding:'8px 4px', background:C.ev, borderRadius:10 }}>
                      <div style={{ fontFamily:'var(--font-sora)', fontSize:18, fontWeight:700, color:'#22c55e' }}>{sym}{(cGross * cUnits).toLocaleString('en-GB', { minimumFractionDigits:0, maximumFractionDigits:0 })}</div>
                      <div style={{ fontSize:9, color:C.tx3, fontWeight:600, marginTop:2 }}>TOTAL PROFIT</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
        <div style={{ marginTop:10, textAlign:'center' }}>
          <Link href={tab==='margin'?'/free-tools/profit-margin-calculator':'/free-tools/cogs-calculator'}
            style={{ fontSize:11, color:C.acc, fontWeight:600, textDecoration:'none' }}>
            Open full {tab==='margin'?'Profit Margin':'COGS'} calculator →
          </Link>
        </div>
      </div>
    </div>
  )
}

// ── LandingInner ─────────────────────────────────────────────────────────────

function LandingInner({ geo }: { geo: Geo | null }) {
  const { t, lang, setLang } = useLang()
  const [annual, setAnnual] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  // Live geo — updated client-side on mount from /api/geo to override any CDN-cached server value
  const [liveGeo, setLiveGeo] = useState<Geo | null>(geo)

  const sym           = liveGeo?.pricing?.sym      || '£'
  const growthPrice   = liveGeo?.pricing?.growth   || '£19'
  const businessPrice = liveGeo?.pricing?.business || '£49'
  const posPrice      = liveGeo?.pricing?.pos      || '£5'
  const country       = liveGeo?.country           || geo?.country    || ''
  const countryCode   = liveGeo?.countryCode       || geo?.countryCode || ''
  const flag          = liveGeo?.flag              || geo?.flag        || ''
  const isRTL = lang === 'ar'

  const geoCtaText = 'Start free — no card needed'
  const geoSubText = country
    ? `No credit card · Prices from ${growthPrice}/mo · 2 minutes to set up`
    : 'No credit card · Takes 2 minutes to set up'

  useEffect(() => {
    // Skip client-side geo fetch when server already provided geo via props
    if (geo) return
    fetch('/api/geo').then(r => r.json()).then(d => {
      if (d.pricing) {
        setLiveGeo({
          country: d.country || '',
          countryCode: d.countryCode || '',
          city: d.city || '',
          currency: d.currency || 'USD',
          currencySymbol: d.currencySymbol || '$',
          currencyName: d.currencyName || 'US Dollar',
          flag: d.flag || '',
          pricing: d.pricing,
        })
      }
      // Language detection
      const saved = document.cookie.split(';').find(c => c.trim().startsWith('askbiz_lang='))
      if (!saved) {
        const browserLang = navigator.language?.split('-')[0]?.toLowerCase()
        const BMAP: Record<string, Lang> = { en:'en', fr:'fr', de:'de', es:'es', ar:'ar', sw:'sw', pt:'pt', nl:'nl', it:'it', pl:'pl' }
        if (browserLang && browserLang !== 'en' && BMAP[browserLang]) { setLang(BMAP[browserLang] as Lang) }
        else {
          const detected = (COUNTRY_TO_LANG as Record<string, Lang>)[d.countryCode] || 'en'
          setLang(detected)
        }
      }
    }).catch(() => {})
  }, [])

  // Annual pricing — strips commas before parsing so KSh 1,900 → 1900 → discounted → reformatted
  function annualPrice(price: string): string {
    const match = price.match(/([\d,]+)/)
    if (!match) return price
    const num = parseInt(match[1].replace(/,/g, ''), 10)
    const discounted = Math.round(num * 10 / 12)
    // Re-add commas if original had them (e.g. 1,900 → 1,583)
    const formatted = match[1].includes(',')
      ? discounted.toLocaleString('en-US')
      : String(discounted)
    return price.replace(/[\d,]+/, formatted)
  }
  const growthMonthly = annual ? annualPrice(growthPrice) : growthPrice
  const bizMonthly    = annual ? annualPrice(businessPrice) : businessPrice

  const FAQS = [
    { q: 'What is AskBiz?', a: 'AskBiz is a business intelligence tool for SME founders. You connect your Shopify, Amazon, or other platforms, then ask questions in plain English and get answers with your actual numbers.' },
    { q: 'How does it work without a data team?', a: 'You connect your store or upload a CSV. AskBiz handles everything — no SQL, no dashboards, no data engineering. You just ask.' },
    { q: 'What\'s included in the free plan?', a: '10 questions per month, CSV upload, Business Pulse score, connect Shopify and Amazon, API access, and access to the FX Risk, Landed Cost, and Export Market tools with manual input. No credit card needed.' },
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
        .fade-up { animation: fadeUp 500ms ease both }
        .tdot { display:inline-block; width:6px; height:6px; border-radius:50%; background:#6B7280; animation:tdot 1.2s infinite }
        .card-hover:hover { border-color:rgba(208,138,89,.3) !important; transform:translateY(-2px); transition:all 180ms ease }
        .btn-primary { transition:all 150ms ease; transform:translateY(0); position:relative }
        .btn-primary:hover { transform:translateY(-2px) }
        .btn-primary:active { transform:translateY(0) }
        .nav-link:hover { color:#1A1916 !important }
        .faq-item:hover { background:#F3F2EF }
        .kpi-chip { display:inline-flex; align-items:center; gap:6px; padding:4px 10px; border-radius:9999px; font-size:12px; font-weight:600; border:1px solid }
        .nav-desktop { display:flex }
        .nav-hamburger { display:none }
        .mobile-menu { display:none }
        @media (max-width:767px) {
          .nav-desktop { display:none !important }
          .nav-hamburger { display:flex !important }
          .mobile-menu.open { display:flex !important }
          .demo-layout { grid-template-columns:1fr !important }
          .demo-cards { flex-wrap:wrap }
          .problem-grid { grid-template-columns:1fr !important }
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
          .pos-callout-mock { display:none !important }
        }
        @media (max-width:480px) {
          .pos-grid-4 { grid-template-columns:1fr !important }
          .stats-grid { grid-template-columns:1fr !important }
        }
      `}</style>

      {/* ── NAV ───────────────────────────────────────────────── */}
      <nav style={{ position:'sticky', top:0, zIndex:50, background:'rgba(249,248,246,.96)', backdropFilter:'blur(16px)', borderBottom:`1px solid ${C.b}`, padding:'0 clamp(16px,4vw,32px)', height:56, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none', color:C.tx }}>
          <div style={{ width:26, height:26, borderRadius:7, background:C.acc, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="12" height="12" viewBox="0 0 32 32" fill="none"><rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.5"/><rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.75"/><rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/></svg>
          </div>
          <span style={{ fontFamily:'var(--font-sora)', fontSize:15, fontWeight:700, letterSpacing:'-.02em' }}>AskBiz</span>
        </Link>

        {/* Desktop nav */}
        <div className="nav-desktop" style={{ display:'flex', alignItems:'center', gap:10 }}>
          <LanguageToggle/>
          <a href="#pricing" className="nav-link" style={{ fontSize:13, color:C.tx2, textDecoration:'none', padding:'0 8px' }}>Pricing</a>
          <div className="nav-mega-wrap" style={{ position:'relative' }} onMouseEnter={(e)=>{const d=e.currentTarget.querySelector('.nav-mega') as HTMLElement;if(d)d.style.display='block'}} onMouseLeave={(e)=>{const d=e.currentTarget.querySelector('.nav-mega') as HTMLElement;if(d)d.style.display='none'}}>
            <span className="nav-link" style={{ fontSize:13, color:C.tx2, padding:'0 8px', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:3 }}>Resources <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2.5 4L5 6.5L7.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg></span>
            <div className="nav-mega" style={{ display:'none', position:'absolute', top:'100%', right:0, paddingTop:8, zIndex:60 }}>
              <div style={{ background:C.sf, border:`1px solid ${C.b}`, borderRadius:14, boxShadow:'0 8px 32px rgba(0,0,0,.12)', padding:20, width:480, display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                {[
                  { href:'/blog', icon:'📝', title:'Blog', desc:'201 articles on AI, commerce & growth' },
                  { href:'/academy', icon:'🎓', title:'Academy', desc:'420+ structured learning articles' },
                  { href:'/free-tools', icon:'🧮', title:'Free Tools', desc:'VAT, landed cost, FX & break-even' },
                  { href:'/case-studies', icon:'📊', title:'Case Studies', desc:'Real results from real businesses' },
                  { href:'/benchmarks', icon:'📈', title:'Benchmarks', desc:'Industry KPIs across 8 sectors' },
                  { href:'/help', icon:'💡', title:'Help Center', desc:'Guides, FAQ & troubleshooting' },
                  { href:'/glossary', icon:'📖', title:'Glossary', desc:'Business & analytics terms explained' },
                  { href:'/integrations', icon:'🔗', title:'Integrations', desc:'Shopify, Amazon, Xero & more' },
                ].map(item=>(
                  <Link key={item.href} href={item.href} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'10px 12px', borderRadius:10, textDecoration:'none', color:C.tx, transition:'background .12s' }} onMouseEnter={e=>{e.currentTarget.style.background=C.ev}} onMouseLeave={e=>{e.currentTarget.style.background='transparent'}}>
                    <span style={{ fontSize:18, lineHeight:1, flexShrink:0, marginTop:1 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:C.tx, lineHeight:1.2 }}>{item.title}</div>
                      <div style={{ fontSize:11, color:C.tx3, marginTop:2, lineHeight:1.4 }}>{item.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link href="/signin" style={{ padding:'7px 14px', borderRadius:9999, border:`1px solid ${C.b2}`, background:'transparent', color:C.tx, fontSize:13, fontWeight:500, textDecoration:'none' }}>Sign in</Link>
          <Link href="/signin?mode=signup" style={{ padding: '8px 18px', borderRadius: 9999, background: '#d08a59', color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none', fontFamily: 'var(--font-sora)' }}>
            Get started free →
          </Link>
        </div>

        {/* Mobile nav — hamburger + CTA */}
        <div className="nav-hamburger" style={{ display:'none', alignItems:'center', gap:10 }}>
          <Link href="/signin?mode=signup" className="btn-primary" style={{ padding:'7px 16px', borderRadius:9999, border:'none', background:C.acc, color:'#fff', fontSize:13, fontWeight:700, textDecoration:'none', boxShadow:`0 2px 12px ${C.acc}35` }}>Try free</Link>
          <button onClick={() => setMenuOpen(o => !o)} aria-label="Menu" style={{ width:40, height:40, borderRadius:10, border:`1px solid ${C.b}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', padding:0 }}>
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.tx} strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.tx} strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} style={{ display:'none', flexDirection:'column', gap:0, position:'fixed', top:56, left:0, right:0, bottom:0, background:C.bg, zIndex:49, overflowY:'auto', padding:'16px 20px 32px' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
          {[
            { href:'#pricing', label:'Pricing' },
            { href:'/point-of-sale', label:'Point of Sale' },
            { href:'/blog', label:'Blog' },
            { href:'/academy', label:'Academy' },
            { href:'/free-tools', label:'Free Tools' },
            { href:'/help', label:'Help Center' },
            { href:'/integrations', label:'Integrations' },
          ].map(item => (
            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} style={{ display:'block', padding:'14px 12px', borderRadius:10, fontSize:15, fontWeight:600, color:C.tx, textDecoration:'none', borderBottom:`1px solid ${C.b}` }}>{item.label}</a>
          ))}
        </div>
        <div style={{ marginTop:24, display:'flex', flexDirection:'column', gap:10 }}>
          <Link href="/signin?mode=signup" onClick={() => setMenuOpen(false)} className="btn-primary" style={{ display:'block', padding:'14px', borderRadius:9999, background:C.acc, color:'#fff', fontSize:15, fontWeight:700, textDecoration:'none', textAlign:'center' }}>Start free</Link>
          <Link href="/signin" onClick={() => setMenuOpen(false)} style={{ display:'block', padding:'14px', borderRadius:9999, border:`1px solid ${C.b2}`, background:'transparent', color:C.tx2, fontSize:14, fontWeight:500, textDecoration:'none', textAlign:'center' }}>Sign in</Link>
        </div>
        <div style={{ marginTop:20, display:'flex', justifyContent:'center' }}><LanguageToggle/></div>
      </div>

      {/* Geo promo banner removed */}

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{ maxWidth:1080, margin:'0 auto', padding:'clamp(28px,4vw,42px) clamp(16px,4vw,40px) clamp(32px,4vw,48px)', textAlign:'center' }}>

        {/* Dual-product badge */}
        <div className="fade-up" style={{ display:'inline-flex', alignItems:'center', gap:0, borderRadius:9999, border:`1px solid ${C.b2}`, background:C.sf, fontSize:12, fontWeight:700, marginBottom:28, overflow:'hidden' }}>
          <span style={{ padding:'5px 14px', color:C.acc, borderRight:`1px solid ${C.b2}`, display:'flex', alignItems:'center', gap:5 }}>
            <svg width="11" height="11" viewBox="0 0 32 32" fill="none"><rect x="3" y="22" width="5" height="7" rx="1.5" fill={C.acc} opacity="0.5"/><rect x="11" y="16" width="5" height="13" rx="1.5" fill={C.acc} opacity="0.75"/><rect x="19" y="9" width="5" height="20" rx="1.5" fill={C.acc}/></svg>
            Business Intelligence
          </span>
          <span style={{ padding:'5px 14px', color:C.tx2, display:'flex', alignItems:'center', gap:5 }}>
            🧾 Point of Sale
          </span>
        </div>

        {/* H1 */}
        <h1 className="fade-up" style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(30px,5.5vw,60px)', fontWeight:700, lineHeight:1.07, letterSpacing:'-.04em', marginBottom:22, color:C.tx }}>
          Ask your business data anything.<br/>
          <span style={{ color:C.acc }}>Get clear answers in seconds.</span>
        </h1>

        <p className="fade-up" style={{ fontSize:'clamp(15px,1.8vw,18px)', color:C.tx2, lineHeight:1.7, maxWidth:540, margin:'0 auto 10px' }}>
          Every sale your register takes feeds directly into your AI. Ask questions, spot problems, act fast — from one place.
        </p>
        <p className="fade-up" style={{ fontSize:13, color:C.tx3, marginBottom:32 }}>
          Connect Shopify, Amazon, QuickBooks or run the built-in PoS. Free to start — no card needed.
        </p>

        {/* CTAs */}
        <div className="fade-up hero-ctas" style={{ display:'flex', gap:10, flexWrap:'wrap', justifyContent:'center', marginBottom:12 }}>
          <Link href="/signin?mode=signup" className="btn-primary" style={{ padding:'13px 26px', borderRadius:9999, border:'none', background:C.acc, color:'#fff', fontSize:15, fontWeight:700, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:8, boxShadow:`0 2px 14px ${C.acc}40`, letterSpacing:'-.01em' }}>
            {geoCtaText}
          </Link>
          <Link href="/point-of-sale" style={{ padding:'13px 20px', borderRadius:9999, border:`1px solid ${C.b2}`, background:'transparent', color:C.tx2, fontSize:14, fontWeight:500, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:6 }}>
            🧾 See the PoS
          </Link>
        </div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center', marginTop: 16, fontSize: 12, color: 'var(--tx3)' }}>
          <span>🔒 Encrypted in transit & at rest</span>
          <span>🇬🇧 UK data residency</span>
          <span>✓ GDPR compliant</span>
          <span>🆓 Free plan, no card needed</span>
        </div>
        <p className="fade-up" style={{ fontSize:12, color:C.tx3, marginBottom:28, marginTop:8 }}>
          {country ? `${flag} ${geoSubText}` : geoSubText} · PoS from {posPrice}/seat/mo
        </p>

        {/* ── Mini calculator widget ── */}
        <div className="fade-up" style={{ marginBottom:40, display:'flex', flexDirection:'column', alignItems:'center' }}>
          <MiniCalcWidget />
        </div>

        {/* ── Dual product preview cards ── */}
        <div className="fade-up hero-preview-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, textAlign:'left', maxWidth:900, margin:'0 auto' }}>

          {/* Intelligence card */}
          <div style={{ background:C.sf, border:`1px solid ${C.b}`, borderRadius:18, overflow:'hidden', boxShadow:'0 4px 24px rgba(0,0,0,.06)' }}>
            <div style={{ padding:'10px 14px', background:C.ev, borderBottom:`1px solid ${C.b}`, display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:22, height:22, borderRadius:6, background:C.acc, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg width="10" height="10" viewBox="0 0 32 32" fill="none"><rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.5"/><rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.75"/><rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/></svg>
              </div>
              <span style={{ fontSize:12, fontWeight:700, color:C.tx }}>Business Intelligence</span>
              <span style={{ marginLeft:'auto', fontSize:10, color:'#22c55e', display:'flex', alignItems:'center', gap:3 }}><span style={{ width:5, height:5, borderRadius:'50%', background:'#22c55e', display:'inline-block' }}/>Live</span>
            </div>
            <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', gap:10 }}>
              <div style={{ display:'flex', justifyContent:'flex-end' }}>
                <div style={{ padding:'8px 12px', borderRadius:14, borderBottomRightRadius:3, background:C.ev, border:`1px solid ${C.b}`, fontSize:12, color:C.tx, maxWidth:'85%' }}>
                  Why did revenue drop this week?
                </div>
              </div>
              <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
                <div style={{ width:22, height:22, borderRadius:6, background:C.acc, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2 }}>
                  <svg width="10" height="10" viewBox="0 0 32 32" fill="none"><rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.5"/><rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.75"/><rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/></svg>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ padding:'8px 12px', borderRadius:14, borderBottomLeftRadius:3, background:C.sf, border:`1px solid ${C.b}`, fontSize:11, lineHeight:1.65, color:C.tx, marginBottom:8 }}>
                    Tuesday PoS revenue was <strong>£340 below</strong> the 4-week average. Your lunch shift had 6 fewer transactions — check if the till was open late.
                  </div>
                  <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                    <span className="kpi-chip" style={{ background:'rgba(239,68,68,.06)', color:'#dc2626', borderColor:'rgba(239,68,68,.2)', fontSize:10, padding:'3px 8px' }}><span style={{ opacity:.7 }}>Drop</span> <strong>−£340</strong></span>
                    <span className="kpi-chip" style={{ background:'rgba(208,138,89,.08)', color:C.acc, borderColor:C.accBdr, fontSize:10, padding:'3px 8px' }}><span style={{ opacity:.7 }}>Shift gap</span> <strong>6 txns</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PoS card */}
          <div style={{ background:C.sf, border:`1px solid ${C.b}`, borderRadius:18, overflow:'hidden', boxShadow:'0 4px 24px rgba(0,0,0,.06)' }}>
            <div style={{ padding:'10px 14px', background:C.ev, borderBottom:`1px solid ${C.b}`, display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:15 }}>🧾</span>
              <span style={{ fontSize:12, fontWeight:700, color:C.tx }}>Point of Sale</span>
              <span style={{ marginLeft:'auto', fontSize:10, color:'#22c55e', display:'flex', alignItems:'center', gap:3 }}><span style={{ width:5, height:5, borderRadius:'50%', background:'#22c55e', display:'inline-block' }}/>Shift open</span>
            </div>
            <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', gap:0 }}>
              {[
                { n:'Wireless Earbuds', qty:1, p:'£59.98' },
                { n:'Phone Case × 2', qty:2, p:'£25.00' },
                { n:'USB-C Cable', qty:1, p:'£12.99' },
              ].map((r,i,arr)=>(
                <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:i<arr.length-1?`1px solid ${C.ev}`:'none', fontSize:12, color:C.tx2, alignItems:'center' }}>
                  <span style={{ color:C.tx }}>{r.n}</span>
                  <span style={{ fontWeight:600, color:C.tx }}>{r.p}</span>
                </div>
              ))}
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:10, paddingTop:10, borderTop:`1px solid ${C.b}`, fontWeight:800, color:C.tx, fontSize:14, fontFamily:'var(--font-sora)' }}>
                <span>Total</span><span>£97.97</span>
              </div>
              <div style={{ marginTop:10, padding:'9px', borderRadius:10, background:C.acc, color:'#fff', fontSize:12, fontWeight:700, textAlign:'center', letterSpacing:'-.01em' }}>
                Take payment →
              </div>
              <div style={{ marginTop:8, display:'flex', alignItems:'center', gap:5, fontSize:10, color:C.tx3, justifyContent:'center' }}>
                <svg width="9" height="9" viewBox="0 0 32 32" fill="none"><rect x="3" y="22" width="5" height="7" rx="1.5" fill={C.tx3} opacity="0.5"/><rect x="11" y="16" width="5" height="13" rx="1.5" fill={C.tx3} opacity="0.75"/><rect x="19" y="9" width="5" height="20" rx="1.5" fill={C.tx3}/></svg>
                Sale syncs to intelligence instantly
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── PRODUCT DEMO ──────────────────────────────────────── */}
      <InteractiveDemo />

      {/* ── INTEGRATIONS TICKER ──────────────────────────────── */}
      <div style={{ borderTop:`1px solid ${C.b}`, borderBottom:`1px solid ${C.b}`, background:C.sf, padding:'16px 0', overflow:'hidden' }}>
        <p style={{ textAlign:'center', fontSize:11, fontWeight:700, color:C.tx3, textTransform:'uppercase', letterSpacing:'.1em', marginBottom:14 }}>
          Connects to your platforms
        </p>
        <div style={{ display:'flex', gap:0, animation:'ticker 20s linear infinite', width:'max-content' }}>
          {[...INTEGRATIONS, ...INTEGRATIONS].map((int, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:7, padding:'6px 20px', borderRight:`1px solid ${C.b}`, fontSize:13, fontWeight:500, color:C.tx2, whiteSpace:'nowrap' }}>
              <span>{int.icon}</span> {int.name}
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW THEY WORK TOGETHER ───────────────────────────── */}
      <section style={{ maxWidth:1060, margin:'0 auto', padding:'clamp(52px,7vw,80px) clamp(16px,4vw,40px)' }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.acc, textTransform:'uppercase', letterSpacing:'.12em', marginBottom:12 }}>One platform. Two powers.</div>
          <h2 style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(22px,3.5vw,38px)', fontWeight:700, lineHeight:1.15, letterSpacing:'-.03em', color:C.tx, marginBottom:14 }}>
            Your PoS and your intelligence<br/>finally talk to each other.
          </h2>
          <p style={{ fontSize:15, color:C.tx2, lineHeight:1.7, maxWidth:520, margin:'0 auto' }}>
            Most businesses run their register and their analytics in two separate worlds. AskBiz connects them — every sale, shift, and stock movement feeds your intelligence layer automatically.
          </p>
        </div>

        <div className="pos-grid-3" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {[
            {
              icon:'🧾', title:'Ring up sales',
              desc:'Full register with barcode scanning, multi-item baskets, discounts, refunds, and digital receipts. Works on any browser — no hardware needed.',
              link:'/point-of-sale', cta:'See the PoS →',
            },
            {
              icon:'🧠', title:'Intelligence analyses every sale',
              desc:'Ask which products drive your margin. Spot slow-moving stock before it becomes a problem. Get alerted when a cashier shift has an unusual variance.',
              link:'/signin', cta:'Try it free →',
            },
            {
              icon:'👥', title:'Staff, inventory & branches',
              desc:'Multi-branch PoS with per-location stock, staff OTP login, shift tracking, factory captures, service jobs, and role-based permissions.',
              link:'/point-of-sale', cta:'Learn more →',
            },
          ].map((card,i)=>(
            <Link key={i} href={card.link} className="card-hover" style={{ padding:'24px 22px', borderRadius:16, border:`1px solid ${C.b}`, background:C.sf, textDecoration:'none', display:'flex', flexDirection:'column', gap:12, transition:'all 180ms' }}>
              <span style={{ fontSize:28 }}>{card.icon}</span>
              <div style={{ fontFamily:'var(--font-sora)', fontSize:16, fontWeight:700, color:C.tx, lineHeight:1.25 }}>{card.title}</div>
              <p style={{ fontSize:13, color:C.tx2, lineHeight:1.65, margin:0, flex:1 }}>{card.desc}</p>
              <span style={{ fontSize:13, fontWeight:600, color:C.acc }}>{card.cta}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── THE PROBLEM ──────────────────────────────────────── */}
      <section style={{ maxWidth:760, margin:'0 auto', padding:'clamp(56px,8vw,96px) clamp(16px,4vw,40px)', textAlign:'center' }}>
        <div style={{ fontSize:11, fontWeight:700, color:C.acc, textTransform:'uppercase', letterSpacing:'.12em', marginBottom:20 }}>
          The problem
        </div>
        <h2 style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(24px,4vw,42px)', fontWeight:700, lineHeight:1.15, letterSpacing:'-.03em', color:C.tx, marginBottom:24 }}>
          Your business generates data every day.<br/>
          <span style={{ color:C.tx3 }}>Almost none of it reaches a decision.</span>
        </h2>
        <p style={{ fontSize:'clamp(14px,1.6vw,17px)', color:C.tx2, lineHeight:1.75, maxWidth:560, margin:'0 auto 40px' }}>
          Most founders run on instinct — not because they want to, but because getting to the data takes too long. By the time you've pulled the reports, the moment has passed.
        </p>
        <div className="problem-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1, borderRadius:16, overflow:'hidden', border:`1px solid ${C.b}` }}>
          {[
            { before:'2 hours to pull Monday numbers', after:'4 minutes with AskBiz' },
            { before:'Margin looked like 34%', after:'Actually 18.4% once you include freight, duty, and FX' },
            { before:'Found out customer churned', after:'Flagged 89 days before they left' },
          ].map((item, i) => (
            <div key={i} style={{ padding:'24px 20px', background:C.sf, borderRight:i<2?`1px solid ${C.b}`:'none' }}>
              <div style={{ fontSize:13, color:C.tx3, lineHeight:1.6, marginBottom:12, textDecoration:'line-through', opacity:.6 }}>
                {item.before}
              </div>
              <div style={{ fontSize:13, color:C.acc, fontWeight:600, lineHeight:1.6 }}>
                ↓ {item.after}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BUSINESS TOOLS ───────────────────────────────────── */}
      <section style={{ background:C.sf, borderTop:`1px solid ${C.b}`, borderBottom:`1px solid ${C.b}`, padding:'clamp(52px,7vw,84px) clamp(16px,4vw,40px)' }}>
        <div style={{ maxWidth:960, margin:'0 auto' }}>
          <div className="tools-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(40px,6vw,80px)', alignItems:'start' }}>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:C.acc, textTransform:'uppercase', letterSpacing:'.12em', marginBottom:16 }}>Business Tools</div>
              <h2 style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(22px,3.5vw,36px)', fontWeight:700, lineHeight:1.15, letterSpacing:'-.03em', marginBottom:16, color:C.tx }}>
                Five tools that pay for themselves the first time you use them.
              </h2>
              <p style={{ fontSize:15, color:C.tx2, lineHeight:1.7, marginBottom:28 }}>
                Pre-filled from your connected data. Review, adjust, calculate. No spreadsheets.
              </p>
              <Link href="/signin?mode=signup" className="btn-primary" style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'11px 22px', borderRadius:9999, background:C.acc, color:'#fff', fontSize:14, fontWeight:600, textDecoration:'none', boxShadow:`0 2px 12px ${C.acc}35` }}>
                Open the tools →
              </Link>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
              {TOOLS.map((tool, i) => (
                <div key={i} className="card-hover" style={{ padding:'16px 18px', borderBottom:i<TOOLS.length-1?`1px solid ${C.b}`:'none', cursor:'default', borderRadius:i===0?'14px 14px 0 0':i===TOOLS.length-1?'0 0 14px 14px':'0', border:`1px solid ${C.b}`, marginBottom:i<TOOLS.length-1?-1:0, background:C.bg, transition:'all 180ms' }}>
                  <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                    <span style={{ fontSize:20, flexShrink:0, lineHeight:1.4 }}>{tool.icon}</span>
                    <div>
                      <div style={{ fontSize:14, fontWeight:700, color:C.tx, marginBottom:4, fontFamily:'var(--font-sora)' }}>{tool.label}</div>
                      <div style={{ fontSize:13, color:C.tx2, lineHeight:1.6 }}>{tool.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── POINT OF SALE ──────────────────────────────────────── */}
      <section id="pos" style={{ maxWidth:1060, margin:'0 auto', padding:'clamp(52px,7vw,84px) clamp(16px,4vw,40px)' }}>
        <div style={{ fontSize:11, fontWeight:700, color:C.acc, textTransform:'uppercase', letterSpacing:'.12em', marginBottom:16, textAlign:'center' }}>Point of Sale</div>
        <h2 style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(22px,3.5vw,36px)', fontWeight:700, textAlign:'center', marginBottom:12, letterSpacing:'-.03em', color:C.tx }}>
          A full PoS system — built into your intelligence platform.
        </h2>
        <p style={{ fontSize:'clamp(14px,1.6vw,17px)', color:C.tx2, lineHeight:1.7, maxWidth:600, margin:'0 auto 44px', textAlign:'center' }}>
          Ring up sales, manage inventory across branches, track staff shifts, and stay tax-compliant — all while your AI learns from every transaction.
        </p>

        <div className="pos-grid-4" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
          {[
            { icon:'🧾', title:'Register & Checkout', desc:'Fast checkout with barcode scanning, split payments, refunds, and digital receipts. Works on tablet or desktop.', tag:'Core' },
            { icon:'📦', title:'Inventory & Stock', desc:'Real-time stock levels, low-stock alerts, stock transfers between branches, and AI reorder recommendations.', tag:'Smart' },
            { icon:'🏪', title:'Multi-Branch', desc:'Manage multiple locations from one dashboard. Per-branch reporting, staff, inventory, and tax settings.', tag:'Scale' },
            { icon:'👥', title:'Staff & Shifts', desc:'Role-based access for cashiers and managers. Shift open/close, OTP login, and per-cashier performance tracking.', tag:'Team' },
          ].map((f, i) => (
            <div key={i} className="card-hover" style={{ padding:'22px 18px', borderRadius:16, border:`1px solid ${C.b}`, background:C.sf, display:'flex', flexDirection:'column', gap:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:24 }}>{f.icon}</span>
                <span style={{ fontSize:10, fontWeight:700, color:C.acc, background:C.accBg, border:`1px solid ${C.accBdr}`, padding:'2px 8px', borderRadius:9999, textTransform:'uppercase', letterSpacing:'.05em' }}>{f.tag}</span>
              </div>
              <div style={{ fontFamily:'var(--font-sora)', fontSize:15, fontWeight:700, color:C.tx }}>{f.title}</div>
              <p style={{ fontSize:13, color:C.tx2, lineHeight:1.65, margin:0 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="pos-grid-3" style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14, marginTop:14 }}>
          {[
            { icon:'🧮', title:'Tax & Compliance', desc:'Multi-jurisdiction VAT, consolidated tax reports, and filing previews. Xero and QuickBooks sync built in.' },
            { icon:'🔒', title:'GDPR Ready', desc:'Customer data export, deletion, consent logging, and data retention reports — all one click.' },
            { icon:'🤖', title:'AI Intelligence', desc:'Anomaly detection on transactions, AI supplier recommendations, and sales pattern insights from your PoS data.' },
          ].map((f, i) => (
            <div key={i} className="card-hover" style={{ padding:'18px 16px', borderRadius:14, border:`1px solid ${C.b}`, background:C.bg }}>
              <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                <span style={{ fontSize:20, flexShrink:0 }}>{f.icon}</span>
                <div>
                  <div style={{ fontFamily:'var(--font-sora)', fontSize:14, fontWeight:700, color:C.tx, marginBottom:4 }}>{f.title}</div>
                  <div style={{ fontSize:12, color:C.tx2, lineHeight:1.6 }}>{f.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign:'center', marginTop:36 }}>
          <Link href="/signin?mode=signup" className="btn-primary" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'12px 24px', borderRadius:9999, background:C.acc, color:'#fff', fontSize:14, fontWeight:700, textDecoration:'none', boxShadow:`0 3px 16px ${C.acc}40` }}>
            Try the PoS free →
          </Link>
          <p style={{ fontSize:12, color:C.tx3, marginTop:10 }}>{posPrice} per seat/month · Works on tablet or desktop</p>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section style={{ maxWidth:860, margin:'0 auto', padding:'clamp(52px,7vw,84px) clamp(16px,4vw,40px)' }}>
        <div style={{ fontSize:11, fontWeight:700, color:C.acc, textTransform:'uppercase', letterSpacing:'.12em', marginBottom:16, textAlign:'center' }}>How it works</div>
        <h2 style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(22px,3.5vw,34px)', fontWeight:700, textAlign:'center', marginBottom:52, letterSpacing:'-.03em', color:C.tx }}>
          Up and running in under 5 minutes
        </h2>
        <div className="steps-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:0, position:'relative' }}>
          <div className="steps-line" style={{ position:'absolute', top:28, left:'16.6%', right:'16.6%', height:1, background:`linear-gradient(90deg, ${C.acc}, ${C.accBdr})`, zIndex:0 }}/>
          {[
            { num:'1', icon:'🔌', title:'Connect your data', body:'Shopify, Amazon, QuickBooks, TikTok Shop — or drop a CSV. Takes 2 minutes.' },
            { num:'2', icon:'💬', title:'Ask in plain English', body:'"What is my best margin product?" "Which customers are about to churn?" No SQL, no dashboards.' },
            { num:'3', icon:'✅', title:'Get specific answers', body:'Real numbers from your actual data. Recommended actions. Every time.' },
          ].map((step, i) => (
            <div key={i} style={{ padding:'0 clamp(12px,2vw,28px)', textAlign:'center', position:'relative', zIndex:1 }}>
              <div style={{ width:56, height:56, borderRadius:14, background:i===0?C.acc:i===1?C.ev:C.sf, border:`2px solid ${i===0?C.acc:C.b}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, margin:'0 auto 16px', boxShadow:i===0?`0 4px 16px ${C.acc}40`:'none' }}>
                {step.icon}
              </div>
              <div style={{ fontSize:11, fontWeight:700, color:C.acc, marginBottom:8, letterSpacing:'.06em' }}>Step {step.num}</div>
              <h3 style={{ fontFamily:'var(--font-sora)', fontSize:15, fontWeight:700, color:C.tx, marginBottom:8 }}>{step.title}</h3>
              <p style={{ fontSize:13, color:C.tx2, lineHeight:1.65, margin:0 }}>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section style={{ background:C.sf, borderTop:`1px solid ${C.b}`, borderBottom:`1px solid ${C.b}`, padding:'clamp(52px,7vw,84px) clamp(16px,4vw,40px)' }}>
        <div style={{ maxWidth:960, margin:'0 auto' }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.acc, textTransform:'uppercase', letterSpacing:'.12em', marginBottom:16, textAlign:'center' }}>What founders say</div>
          <blockquote style={{ margin:'0 auto 40px', maxWidth:600, textAlign:'center' }}>
            <p style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(18px,2.8vw,26px)', fontWeight:600, lineHeight:1.4, color:C.tx, marginBottom:20, letterSpacing:'-.02em' }}>
              "Connected my Amazon store and it found a margin problem I had been missing for 4 months. Fixed it the same day. Added £400/month to my bottom line."
            </p>
            <cite style={{ fontSize:13, color:C.tx3, fontStyle:'normal', display:'flex', alignItems:'center', gap:8, justifyContent:'center' }}>
              <div style={{ width:32, height:32, borderRadius:'50%', background:C.acc, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#fff' }}>DO</div>
              <span><strong style={{ color:C.tx2 }}>David O.</strong> · Amazon FBA seller · Lagos</span>
            </cite>
          </blockquote>
          <div className="testimonials-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            {TESTIMONIALS.slice(1).map((tm, i) => (
              <figure key={i} style={{ margin:0, padding:'20px', borderRadius:14, border:`1px solid ${C.b}`, background:C.bg }}>
                <div style={{ display:'flex', gap:2, marginBottom:10 }}>
                  {Array.from({length:5}).map((_,j) => <span key={j} style={{ color:'#F59E0B', fontSize:13 }}>★</span>)}
                </div>
                <blockquote style={{ margin:'0 0 14px', padding:0 }}>
                  <p style={{ fontSize:13, lineHeight:1.7, color:C.tx, margin:0 }}>"{tm.text}"</p>
                </blockquote>
                <figcaption style={{ display:'flex', alignItems:'center', gap:9 }}>
                  <div style={{ width:32, height:32, borderRadius:'50%', background:C.ev, border:`1px solid ${C.b}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:C.tx2, flexShrink:0 }}>{tm.avatar}</div>
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

      {/* ── STATS ────────────────────────────────────────────── */}
      <section style={{ maxWidth:760, margin:'0 auto', padding:'clamp(40px,6vw,64px) clamp(16px,4vw,40px)' }}>
        <div className="stats-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:1, border:`1px solid ${C.b}`, borderRadius:16, overflow:'hidden' }}>
          {[
            { num:'2 min', label:'Average setup time' },
            { num:'£400+', label:'Avg monthly saving found' },
            { num:'20', label:'Export markets scored' },
            { num:'Free', label:'To start — no card needed' },
          ].map((s, i) => (
            <div key={i} style={{ padding:'24px 16px', background:C.sf, borderRight:i<3?`1px solid ${C.b}`:'none', textAlign:'center' }}>
              <div style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(22px,3vw,30px)', fontWeight:800, color:C.acc, marginBottom:6, letterSpacing:'-.03em' }}>{s.num}</div>
              <div style={{ fontSize:12, color:C.tx2, lineHeight:1.4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────── */}
      <section id="pricing" style={{ background:C.sf, borderTop:`1px solid ${C.b}`, borderBottom:`1px solid ${C.b}`, padding:'clamp(52px,7vw,84px) clamp(16px,4vw,40px)' }}>
        <div style={{ maxWidth:960, margin:'0 auto' }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.acc, textTransform:'uppercase', letterSpacing:'.12em', marginBottom:16, textAlign:'center' }}>Pricing</div>
          <h2 style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(22px,3.5vw,34px)', fontWeight:700, textAlign:'center', marginBottom:8, letterSpacing:'-.03em', color:C.tx }}>
            Simple, honest pricing
          </h2>
          <p style={{ textAlign:'center', fontSize:14, color:C.tx2, marginBottom:36 }}>All plans include API access. Cancel anytime.</p>

          {/* ── PoS card — shown first ── */}
          <div style={{ borderRadius:20, border:`2px solid ${C.acc}`, background:`linear-gradient(135deg, rgba(208,138,89,.06) 0%, rgba(208,138,89,.02) 100%)`, padding:'clamp(20px,3vw,28px) clamp(20px,3vw,32px)', marginBottom:28, position:'relative', overflow:'hidden' }}>
            {/* background glow */}
            <div style={{ position:'absolute', top:-40, right:-40, width:200, height:200, background:`radial-gradient(circle, ${C.acc}18 0%, transparent 70%)`, pointerEvents:'none' }} />
            <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:20 }}>
              {/* Left: name + price */}
              <div style={{ minWidth:200 }}>
                <div style={{ display:'inline-flex', alignItems:'center', gap:8, marginBottom:10 }}>
                  <span style={{ fontSize:22 }}>🧾</span>
                  <span style={{ fontFamily:'var(--font-sora)', fontSize:20, fontWeight:800, color:C.acc }}>Point of Sale</span>
                  <span style={{ fontSize:10, fontWeight:700, color:'#fff', background:C.acc, padding:'2px 9px', borderRadius:9999, textTransform:'uppercase', letterSpacing:'.06em' }}>Add-on</span>
                </div>
                <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:6 }}>
                  <span style={{ fontFamily:'var(--font-sora)', fontSize:36, fontWeight:800, color:C.tx, letterSpacing:'-.03em' }}>{posPrice}</span>
                  <span style={{ fontSize:13, color:C.tx3 }}>/seat/month</span>
                </div>
                <p style={{ fontSize:12, color:C.tx3, margin:0, lineHeight:1.5 }}>Add to any Growth or Business plan.<br/>Each seat is one register or device.</p>
                <div style={{ display:'flex', gap:10, marginTop:18, flexWrap:'wrap' }}>
                  <Link href="/signin?mode=signup" style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'10px 22px', borderRadius:9999, background:C.acc, color:'#fff', fontSize:13, fontWeight:700, textDecoration:'none', boxShadow:`0 3px 16px ${C.acc}40` }}>
                    Add to my plan →
                  </Link>
                  <Link href="/point-of-sale" style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'10px 18px', borderRadius:9999, border:`1px solid ${C.accBdr}`, background:'transparent', color:C.acc, fontSize:13, fontWeight:600, textDecoration:'none' }}>
                    See all features
                  </Link>
                </div>
              </div>
              {/* Right: feature pills */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:8, maxWidth:520 }}>
                {[
                  '🧾 Register & checkout','📦 Inventory management','👥 Staff & shifts',
                  '🏪 Multi-branch','🧮 Tax & VAT (Xero/QB)','📷 Barcode scanning',
                  '🤖 AI anomaly alerts','📱 Tablet, phone, desktop',
                ].map((f, i) => (
                  <div key={i} style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'6px 12px', borderRadius:9999, background:C.accBg, border:`1px solid ${C.accBdr}`, fontSize:12, color:C.tx2, fontWeight:500 }}>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Intelligence tier toggle ── */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:20 }}>
            <span style={{ fontSize:12, color:C.tx3, fontWeight:500 }}>Intelligence platform:</span>
            <span style={{ fontSize:13, color:annual?C.tx3:C.tx, fontWeight:annual?400:600 }}>Monthly</span>
            <button onClick={() => setAnnual(v=>!v)} style={{ width:42, height:22, borderRadius:11, background:annual?C.acc:C.b2, border:'none', cursor:'pointer', position:'relative', transition:'background 200ms' }}>
              <div style={{ width:16, height:16, borderRadius:'50%', background:'#fff', position:'absolute', top:3, left:annual?23:3, transition:'left 200ms', boxShadow:'0 1px 4px rgba(0,0,0,.2)' }}/>
            </button>
            <span style={{ fontSize:13, color:annual?C.tx:C.tx3, fontWeight:annual?600:400 }}>
              Annual <span style={{ fontSize:11, fontWeight:700, color:'#16a34a', background:'rgba(34,197,94,.1)', borderRadius:9999, padding:'1px 7px', marginLeft:4 }}>2 months free</span>
            </span>
          </div>

          {/* ── Intelligence tier cards ── */}
          <div className="pricing-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
            {[
              { id:'free', name:'Free', colour:'#6b6760', price:'£0', sub:'10 questions/month', popular:false,
                features:['10 questions per month','Upload CSV & Excel','Business Pulse score','Connect Shopify, Amazon & more','FX Risk, Landed Cost, Export tools','API access','No credit card needed'] },
              { id:'growth', name:'Growth', colour:C.acc, price:growthMonthly, sub:'per month', popular:true,
                features:['Unlimited questions','All tools pre-filled from your data','Daily Brief — AI morning intelligence',`Point of Sale — ${posPrice}/seat/month add-on`,'Social Commerce — TikTok, Instagram, Pinterest','Churn Intelligence — monthly scan','Anomaly alerts'] },
              { id:'business', name:'Business', colour:'#7c3aed', price:bizMonthly, sub:'per month', popular:false,
                features:['Everything in Growth','Team seats — up to 5',`Multi-branch PoS — ${posPrice}/seat/month add-on`,'Decision Memory','Competitor Watch','CFO Mode reports','Priority support'] },
            ].map((plan, i) => (
              <div key={i} style={{ borderRadius:18, border:plan.popular?`2px solid ${C.acc}`:`1px solid ${C.b}`, background:plan.popular?`rgba(208,138,89,.02)`:C.bg, padding:'22px 20px', position:'relative', display:'flex', flexDirection:'column' }}>
                {plan.popular && (
                  <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', padding:'3px 14px', borderRadius:9999, background:C.acc, color:'#fff', fontSize:10, fontWeight:700, whiteSpace:'nowrap', textTransform:'uppercase', letterSpacing:'.06em', boxShadow:`0 2px 8px ${C.acc}40` }}>
                    Most popular
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
                    <div key={j} style={{ display:'flex', gap:8, alignItems:'flex-start', fontSize:13, color:C.tx2, marginBottom:7 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={plan.colour} strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink:0, marginTop:2 }}><path d="M20 6L9 17l-5-5"/></svg>
                      {f}
                    </div>
                  ))}
                </div>
                <Link href="/signin?mode=signup" className="btn-primary" style={{ display:'block', padding:'11px', borderRadius:10, border:plan.popular?'none':`1px solid ${C.b2}`, background:plan.popular?C.acc:'transparent', color:plan.popular?'#fff':C.tx2, fontSize:14, fontWeight:600, textDecoration:'none', textAlign:'center', boxShadow:plan.popular?`0 2px 12px ${C.acc}35`:'none' }}>
                  {plan.id==='free'?'Start for free':'Upgrade →'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section style={{ maxWidth:640, margin:'0 auto', padding:'clamp(52px,7vw,80px) clamp(16px,4vw,40px)' }}>
        <div style={{ fontSize:11, fontWeight:700, color:C.acc, textTransform:'uppercase', letterSpacing:'.12em', marginBottom:16, textAlign:'center' }}>FAQ</div>
        <h2 style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(22px,3.5vw,32px)', fontWeight:700, textAlign:'center', marginBottom:36, letterSpacing:'-.03em', color:C.tx }}>Common questions</h2>
        <div>
          {FAQS.map((faq, i) => (
            <div key={i} className="faq-item" style={{ borderBottom:`1px solid ${C.b}`, cursor:'pointer', borderRadius:i===0?'8px 8px 0 0':i===FAQS.length-1?'0 0 8px 8px':'0', transition:'background 150ms', padding:'0 4px' }} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <div style={{ padding:'16px 12px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                <h3 style={{ fontFamily:'var(--font-sora)', fontSize:14, fontWeight:600, color:C.tx, margin:0 }}>{faq.q}</h3>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.tx3} strokeWidth="2" strokeLinecap="round" style={{ flexShrink:0, transform:openFaq===i?'rotate(180deg)':'none', transition:'transform 200ms' }}>
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>
              {openFaq === i && (
                <p style={{ fontSize:13, color:C.tx3, lineHeight:1.7, margin:0, padding:'0 12px 16px' }}>{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── LEARN — ACADEMY + BLOG ─────────────────────────── */}
      <section style={{ maxWidth:1060, margin:'0 auto', padding:'clamp(52px,7vw,84px) clamp(16px,4vw,40px)' }}>
        <div className="learn-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(32px,5vw,64px)', alignItems:'start' }}>

          {/* Academy */}
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:C.acc, textTransform:'uppercase', letterSpacing:'.12em', marginBottom:14 }}>Academy</div>
            <h2 style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(20px,3vw,30px)', fontWeight:700, lineHeight:1.15, letterSpacing:'-.03em', marginBottom:10, color:C.tx }}>
              420+ free guides.<br/>No jargon. No paywall.
            </h2>
            <p style={{ fontSize:14, color:C.tx2, lineHeight:1.7, marginBottom:22 }}>
              Business metrics, KPIs, financial intelligence, eCommerce analytics, FX risk, and AI — explained for founders, not analysts.
            </p>
            <div className="academy-topics" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:20 }}>
              {[
                { icon:'📊', label:'Financial Intelligence', count:'40+' },
                { icon:'🛒', label:'eCommerce Analytics', count:'35+' },
                { icon:'💱', label:'FX & Trade', count:'30+' },
                { icon:'📦', label:'Inventory & Supply Chain', count:'25+' },
                { icon:'🤖', label:'AI for Business', count:'30+' },
                { icon:'📈', label:'Growth & Strategy', count:'45+' },
              ].map((topic, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 10px', borderRadius:8, border:`1px solid ${C.b}`, background:C.sf, fontSize:12, color:C.tx2 }}>
                  <span style={{ fontSize:16 }}>{topic.icon}</span>
                  <span style={{ flex:1 }}>{topic.label}</span>
                  <span style={{ fontSize:10, fontWeight:700, color:C.acc }}>{topic.count}</span>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
              <Link href="/academy" className="btn-primary" style={{ padding:'10px 20px', borderRadius:9999, background:C.acc, color:'#fff', fontSize:13, fontWeight:600, textDecoration:'none', boxShadow:`0 2px 10px ${C.acc}35` }}>
                Browse the Academy →
              </Link>
              <Link href="/academy/learning-paths" style={{ fontSize:13, color:C.tx2, textDecoration:'none', fontWeight:500 }}>
                Learning paths
              </Link>
            </div>
          </div>

          {/* Blog */}
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:C.acc, textTransform:'uppercase', letterSpacing:'.12em', marginBottom:14 }}>From the Blog</div>
            <h2 style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(20px,3vw,30px)', fontWeight:700, lineHeight:1.15, letterSpacing:'-.03em', marginBottom:10, color:C.tx }}>
              Intelligence Hub
            </h2>
            <p style={{ fontSize:14, color:C.tx2, lineHeight:1.7, marginBottom:22 }}>
              Deep dives on AI, eCommerce, finance, and SME strategy from the AskBiz team.
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
              {[
                { tag:'AI Chief of Staff', title:'How AI Is Replacing the COO for Solo Founders', time:'6 min', tagColor:'#9268f8' },
                { tag:'Financial Intelligence', title:'The Cash Flow Metrics Every SME Founder Should Track Weekly', time:'5 min', tagColor:'#16a34a' },
                { tag:'eCommerce', title:'TikTok Shop vs Shopify: Where Should You Sell First?', time:'7 min', tagColor:'#0284c7' },
              ].map((post, i) => (
                <div key={i} style={{ padding:'14px 12px', borderBottom:i<2?`1px solid ${C.b}`:'none' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:5 }}>
                    <span style={{ fontSize:10, fontWeight:700, color:post.tagColor, background:`${post.tagColor}14`, border:`1px solid ${post.tagColor}33`, padding:'2px 7px', borderRadius:9999 }}>{post.tag}</span>
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
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section style={{ background:C.tx, padding:'clamp(56px,8vw,96px) clamp(16px,4vw,40px)', textAlign:'center' }}>
        <div style={{ maxWidth:560, margin:'0 auto' }}>
          <div style={{ width:48, height:48, borderRadius:13, background:C.acc, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px' }}>
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none"><rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.5"/><rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.75"/><rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/></svg>
          </div>
          <h2 style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(24px,4vw,40px)', fontWeight:700, color:'#fff', marginBottom:16, letterSpacing:'-.03em', lineHeight:1.15 }}>
            Your data already has<br/>the answers.
          </h2>
          <p style={{ fontSize:16, color:'rgba(255,255,255,.65)', lineHeight:1.7, marginBottom:32 }}>
            Most founders are one question away from a decision that changes their month. Ask AskBiz.
          </p>
          <Link href="/signin?mode=signup" className="btn-primary" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'14px 30px', borderRadius:9999, border:'none', background:C.acc, color:'#fff', fontSize:16, fontWeight:700, textDecoration:'none', boxShadow:`0 4px 24px ${C.acc}50`, letterSpacing:'-.01em' }}>
            {geoCtaText}
          </Link>
          <p style={{ fontSize:12, color:'rgba(255,255,255,.35)', marginTop:14 }}>No credit card · 2 minutes to set up · Cancel anytime</p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{ borderTop:`1px solid ${C.b}`, background:C.sf, padding:'clamp(20px,3vw,28px) clamp(16px,4vw,40px)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:7 }}>
          <div style={{ width:22, height:22, borderRadius:6, background:C.acc, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="10" height="10" viewBox="0 0 32 32" fill="none"><rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.5"/><rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.75"/><rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/></svg>
          </div>
          <span style={{ fontFamily:'var(--font-sora)', fontSize:13, fontWeight:700, color:C.tx }}>AskBiz</span>
          <span style={{ fontSize:12, color:C.tx3 }}>© 2026</span>
        </div>
        <nav className="footer-nav" style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
          {[['/', 'Home'], ['/blog', 'Blog'], ['/academy', 'Academy'], ['/case-studies', 'Case Studies'], ['/benchmarks', 'Benchmarks'], ['/integrations', 'Integrations'], ['/free-tools', 'Free Tools'], ['/developers', 'API'], ['/help', 'Help'], ['/pricing', 'Pricing'], ['/changelog', 'Changelog'], ['/rules', 'Rules & Policies'], ['/transparency', 'Transparency'], ['/privacy', 'Privacy'], ['/terms', 'Terms'], ['mailto:hello@askbiz.co', 'Contact']].map(([href, label]) => (
            <a key={href} href={href} className="nav-link" style={{ fontSize:12, color:C.tx3, textDecoration:'none' }}>{label}</a>
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
