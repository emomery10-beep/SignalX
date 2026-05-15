'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import LanguageToggle from '@/components/LanguageToggle'
import { LanguageProvider, useLang } from '@/components/LanguageProvider'
import type { Lang } from '@/lib/i18n'
import { COUNTRY_TO_LANG } from '@/lib/i18n'

const C = {
  bg:     '#f9f8f6',
  sf:     '#ffffff',
  ev:     '#f3f2ef',
  tx:     '#1a1916',
  tx2:    '#6b6760',
  tx3:    '#a39e97',
  b:      'rgba(0,0,0,.08)',
  b2:     'rgba(0,0,0,.14)',
  acc:    '#d08a59',
  accBg:  'rgba(208,138,89,.08)',
  accBdr: 'rgba(208,138,89,.25)',
}

interface Geo {
  country: string; countryCode: string; city: string
  currency: string; currencySymbol: string; currencyName: string; flag: string
  pricing: { growth: string; business: string; sym: string }
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

// ── Feature tab panels ────────────────────────────────────────────────────────

function PanelRevenue({ activeDemo, setActiveDemo, phase }: { activeDemo: number; setActiveDemo: (i: number) => void; phase: 'typing' | 'answer' }) {
  const demo = DEMOS[activeDemo]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Chat header */}
      <div style={{ padding: '10px 14px', borderBottom: `1px solid ${C.b}`, display: 'flex', alignItems: 'center', gap: 10, background: C.ev }}>
        <div style={{ width: 26, height: 26, borderRadius: 7, background: C.acc, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="11" height="11" viewBox="0 0 32 32" fill="none"><rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.5"/><rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.75"/><rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/></svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.tx }}>AskBiz AI</div>
          <div style={{ fontSize: 10, color: '#22c55e', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
            Connected to your data
          </div>
        </div>
        <div style={{ padding: '2px 8px', borderRadius: 9999, background: C.accBg, border: `1px solid ${C.accBdr}`, fontSize: 10, color: C.acc, fontWeight: 600 }}>
          {demo.emoji} {demo.tag}
        </div>
      </div>
      {/* Chat body */}
      <div style={{ padding: '14px 14px 10px', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
          <div style={{ padding: '9px 13px', borderRadius: 13, borderBottomRightRadius: 3, background: C.ev, border: `1px solid ${C.b}`, fontSize: 12, lineHeight: 1.55, maxWidth: '88%', color: C.tx }}>
            {demo.q}
          </div>
        </div>
        {phase === 'typing' && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: C.acc, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="11" height="11" viewBox="0 0 32 32" fill="none"><rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.5"/><rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.75"/><rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/></svg>
            </div>
            <div style={{ padding: '10px 13px', borderRadius: 13, borderBottomLeftRadius: 3, background: C.sf, border: `1px solid ${C.b}`, display: 'flex', gap: 4, alignItems: 'center' }}>
              <span className="tdot" style={{ animationDelay: '0ms' }} /><span className="tdot" style={{ animationDelay: '150ms' }} /><span className="tdot" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        {phase === 'answer' && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: C.acc, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
              <svg width="11" height="11" viewBox="0 0 32 32" fill="none"><rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.5"/><rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.75"/><rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ padding: '10px 13px', borderRadius: 13, borderBottomLeftRadius: 3, background: C.sf, border: `1px solid ${C.b}`, fontSize: 12, lineHeight: 1.7, color: C.tx, marginBottom: 8 }}>{demo.a}</div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {demo.kpis.map((kpi, i) => (
                  <div key={i} className="kpi-chip" style={{ background: kpi.good ? 'rgba(34,197,94,.06)' : 'rgba(239,68,68,.06)', color: kpi.good ? '#16a34a' : '#dc2626', borderColor: kpi.good ? 'rgba(34,197,94,.2)' : 'rgba(239,68,68,.2)' }}>
                    <span style={{ opacity: .7 }}>{kpi.label}</span><strong>{kpi.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Demo tabs */}
      <div style={{ padding: '8px 12px', borderTop: `1px solid ${C.b}`, background: C.ev, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {DEMOS.map((d, i) => (
          <button key={i} onClick={() => setActiveDemo(i)}
            style={{ padding: '3px 9px', borderRadius: 9999, border: `1px solid ${i === activeDemo ? C.accBdr : C.b}`, background: i === activeDemo ? C.accBg : 'transparent', color: i === activeDemo ? C.acc : C.tx3, fontSize: 10, cursor: 'pointer', fontFamily: 'inherit', fontWeight: i === activeDemo ? 600 : 400, transition: 'all 150ms' }}>
            {d.emoji} {d.tag}
          </button>
        ))}
      </div>
    </div>
  )
}

function PanelSupplier() {
  const suppliers = [
    { name: 'Guangzhou Tech Co.', grade: 'A', gradeColor: '#16a34a', onTime: '96%', avgDelay: '0.4 days', customs: '0 holds', impact: '+£2,100/mo', items: 'Electronics, Accessories' },
    { name: 'Shenzhen Goods Ltd', grade: 'B', gradeColor: '#d08a59', onTime: '81%', avgDelay: '2.1 days', customs: '1 hold', impact: '-£380/mo', items: 'Homeware, Textiles' },
    { name: 'Alibaba Exports Co.', grade: 'D', gradeColor: '#dc2626', onTime: '62%', avgDelay: '6.8 days', customs: '3 holds', impact: '-£1,940/mo', items: 'Mixed goods' },
  ]
  return (
    <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: C.tx }}>Supplier Scorecard</span>
        <span style={{ fontSize: 10, color: C.tx3 }}>Last 6 months · 3 suppliers</span>
      </div>
      {suppliers.map((s, i) => (
        <div key={i} style={{ background: C.bg, borderRadius: 10, border: `1px solid ${C.b}`, padding: '12px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.tx, marginBottom: 2 }}>{s.name}</div>
              <div style={{ fontSize: 10, color: C.tx3 }}>{s.items}</div>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `${s.gradeColor}15`, border: `1px solid ${s.gradeColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: 16, color: s.gradeColor }}>
              {s.grade}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6 }}>
            {[
              { label: 'On-time', value: s.onTime, good: parseFloat(s.onTime) > 85 },
              { label: 'Avg delay', value: s.avgDelay, good: parseFloat(s.avgDelay) < 1 },
              { label: 'Customs', value: s.customs, good: s.customs === '0 holds' },
              { label: 'P&L impact', value: s.impact, good: s.impact.startsWith('+') },
            ].map((m, j) => (
              <div key={j} style={{ textAlign: 'center', padding: '6px 4px', borderRadius: 6, background: m.good ? 'rgba(34,197,94,.06)' : 'rgba(239,68,68,.06)', border: `1px solid ${m.good ? 'rgba(34,197,94,.15)' : 'rgba(239,68,68,.15)'}` }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: m.good ? '#16a34a' : '#dc2626' }}>{m.value}</div>
                <div style={{ fontSize: 9, color: C.tx3, marginTop: 2 }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function PanelFX() {
  const pairs = [
    { pair: 'GBP / CNY', rate: '9.12', exposure: '£18,400', drop5: '-£920', drop10: '-£1,840', drop15: '-£2,760', risk: 'high' },
    { pair: 'GBP / USD', rate: '1.27', exposure: '£6,200', drop5: '-£310', drop10: '-£620', drop15: '-£930', risk: 'medium' },
    { pair: 'GBP / AED', rate: '4.67', exposure: '£3,100', drop5: '-£155', drop10: '-£310', drop15: '-£465', risk: 'low' },
  ]
  const riskColor = (r: string) => r === 'high' ? '#dc2626' : r === 'medium' ? '#d08a59' : '#16a34a'
  return (
    <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: C.tx }}>FX Risk Monitor</span>
        <span style={{ fontSize: 10, color: C.tx3 }}>Sterling drop scenario</span>
      </div>
      {/* Header row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr 0.8fr 0.9fr 0.9fr 0.9fr', gap: 4, padding: '4px 8px' }}>
        {['Pair', 'Rate', 'Exposure', '-5%', '-10%', '-15%'].map(h => (
          <div key={h} style={{ fontSize: 9, fontWeight: 700, color: C.tx3, textTransform: 'uppercase', letterSpacing: '.05em' }}>{h}</div>
        ))}
      </div>
      {pairs.map((p, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr 0.8fr 0.9fr 0.9fr 0.9fr', gap: 4, padding: '10px 8px', background: C.bg, borderRadius: 8, border: `1px solid ${C.b}`, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.tx }}>{p.pair}</div>
            <div style={{ display: 'inline-block', marginTop: 3, fontSize: 9, fontWeight: 700, color: riskColor(p.risk), background: `${riskColor(p.risk)}12`, padding: '1px 6px', borderRadius: 4 }}>{p.risk} risk</div>
          </div>
          <div style={{ fontSize: 12, color: C.tx2 }}>{p.rate}</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.tx }}>{p.exposure}</div>
          <div style={{ fontSize: 12, color: '#d08a59', fontWeight: 600 }}>{p.drop5}</div>
          <div style={{ fontSize: 12, color: '#dc2626', fontWeight: 600 }}>{p.drop10}</div>
          <div style={{ fontSize: 12, color: '#991b1b', fontWeight: 700 }}>{p.drop15}</div>
        </div>
      ))}
      <div style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(239,68,68,.05)', border: '1px solid rgba(239,68,68,.15)', fontSize: 11, color: '#dc2626', lineHeight: 1.5 }}>
        ⚠️ If GBP/CNY drops 10%, your China imports lose <strong>£1,840</strong> in margin this month. Reorder before mid-month to lock current rates.
      </div>
    </div>
  )
}

function PanelExport() {
  const markets = [
    { flag: '🇦🇪', name: 'UAE', score: 78, duty: '5% flat', premium: '+18%', channel: 'Noon.com', tag: 'Top match', tagColor: '#16a34a', bars: [90, 85, 70, 95, 72] },
    { flag: '🇩🇪', name: 'Germany', score: 71, duty: '6.5% avg', premium: '+12%', channel: 'Amazon.de', tag: 'Strong', tagColor: '#d08a59', bars: [80, 75, 88, 65, 68] },
    { flag: '🇺🇸', name: 'United States', score: 64, duty: '3.5% avg', premium: '+9%', channel: 'Amazon US', tag: 'Moderate', tagColor: '#6b6760', bars: [95, 60, 55, 70, 58] },
  ]
  const barLabels = ['eComm', 'Logistics', 'UK prem.', 'Duty env.', 'Category']
  return (
    <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: C.tx }}>Export Market Scoring</span>
        <span style={{ fontSize: 10, color: C.tx3 }}>20 markets · Your product mix</span>
      </div>
      {markets.map((m, i) => (
        <div key={i} style={{ background: C.bg, borderRadius: 10, border: `1px solid ${C.b}`, padding: '12px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>{m.flag}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.tx }}>{m.name}</div>
                <div style={{ fontSize: 10, color: C.tx3 }}>{m.channel}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: m.tagColor, background: `${m.tagColor}12`, padding: '2px 7px', borderRadius: 4 }}>{m.tag}</span>
              <div style={{ fontFamily: 'var(--font-sora)', fontSize: 20, fontWeight: 800, color: m.tagColor }}>{m.score}<span style={{ fontSize: 10, color: C.tx3, fontWeight: 400 }}>/100</span></div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 4 }}>
            {m.bars.map((val, j) => (
              <div key={j} style={{ textAlign: 'center' }}>
                <div style={{ height: 32, background: C.ev, borderRadius: 4, position: 'relative', overflow: 'hidden', marginBottom: 3 }}>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${val}%`, background: i === 0 ? '#16a34a' : i === 1 ? C.acc : C.tx3, opacity: .7, borderRadius: 4, transition: 'height 600ms ease' }} />
                </div>
                <div style={{ fontSize: 8, color: C.tx3 }}>{barLabels[j]}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <div style={{ fontSize: 10, color: C.tx2 }}>Duty: <strong>{m.duty}</strong></div>
            <div style={{ fontSize: 10, color: C.tx2 }}>UK premium: <strong style={{ color: '#16a34a' }}>{m.premium}</strong></div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Main feature tabs ─────────────────────────────────────────────────────────

const FEATURE_TABS = [
  { id: 'revenue', icon: '💬', label: 'AI Answers' },
  { id: 'supplier', icon: '🏭', label: 'Supplier Scorecard' },
  { id: 'fx', icon: '💱', label: 'FX Risk Monitor' },
  { id: 'export', icon: '🌍', label: 'Export Markets' },
]

function FeatureShowcase() {
  const [activeTab, setActiveTab] = useState(0)
  const [activeDemo, setActiveDemo] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'answer'>('typing')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cycleRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Auto-cycle tabs every 5 seconds
  useEffect(() => {
    cycleRef.current = setTimeout(() => {
      setActiveTab(t => (t + 1) % FEATURE_TABS.length)
    }, 5000)
    return () => { if (cycleRef.current) clearTimeout(cycleRef.current) }
  }, [activeTab])

  // Demo cycling inside revenue tab
  useEffect(() => {
    if (FEATURE_TABS[activeTab].id !== 'revenue') return
    setPhase('typing')
    timerRef.current = setTimeout(() => setPhase('answer'), 1100)
    const next = setTimeout(() => {
      setActiveDemo(i => (i + 1) % DEMOS.length)
    }, 5800)
    return () => { clearTimeout(timerRef.current!); clearTimeout(next) }
  }, [activeDemo, activeTab])

  // Reset demo when switching to revenue tab
  useEffect(() => {
    if (FEATURE_TABS[activeTab].id === 'revenue') {
      setPhase('typing')
      setTimeout(() => setPhase('answer'), 1100)
    }
  }, [activeTab])

  const handleTabClick = (i: number) => {
    if (cycleRef.current) clearTimeout(cycleRef.current)
    setActiveTab(i)
  }

  return (
    <div style={{ background: C.sf, border: `1px solid ${C.b}`, borderRadius: 20, overflow: 'hidden', boxShadow: '0 12px 48px rgba(0,0,0,.1)', minHeight: 420 }}>

      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${C.b}`, background: C.ev, overflowX: 'auto' }}>
        {FEATURE_TABS.map((tab, i) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(i)}
            style={{
              flex: 1,
              padding: '12px 8px',
              border: 'none',
              borderBottom: i === activeTab ? `2px solid ${C.acc}` : '2px solid transparent',
              background: i === activeTab ? C.sf : 'transparent',
              color: i === activeTab ? C.acc : C.tx3,
              fontSize: 11,
              fontWeight: i === activeTab ? 700 : 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
              transition: 'all 180ms',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <span style={{ fontSize: 16 }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Progress bar — auto-cycle indicator */}
      <div style={{ height: 2, background: C.ev, position: 'relative', overflow: 'hidden' }}>
        <div
          key={activeTab}
          style={{
            position: 'absolute',
            top: 0, left: 0,
            height: '100%',
            background: C.acc,
            animation: 'progress 5s linear forwards',
          }}
        />
      </div>

      {/* Panel content */}
      <div style={{ minHeight: 360, overflow: 'hidden' }}>
        {FEATURE_TABS[activeTab].id === 'revenue' && (
          <PanelRevenue activeDemo={activeDemo} setActiveDemo={setActiveDemo} phase={phase} />
        )}
        {FEATURE_TABS[activeTab].id === 'supplier' && <PanelSupplier />}
        {FEATURE_TABS[activeTab].id === 'fx' && <PanelFX />}
        {FEATURE_TABS[activeTab].id === 'export' && <PanelExport />}
      </div>

      {/* Footer label */}
      <div style={{ padding: '8px 14px', borderTop: `1px solid ${C.b}`, background: C.ev, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 10, color: C.tx3 }}>
          {activeTab + 1} of {FEATURE_TABS.length} features · auto-cycling
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          {FEATURE_TABS.map((_, i) => (
            <button key={i} onClick={() => handleTabClick(i)} style={{ width: i === activeTab ? 16 : 6, height: 6, borderRadius: 3, border: 'none', background: i === activeTab ? C.acc : C.b2, cursor: 'pointer', transition: 'all 250ms', padding: 0 }} />
          ))}
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

  const sym = geo?.pricing?.sym || '£'
  const growthPrice = geo?.pricing?.growth || '£19'
  const businessPrice = geo?.pricing?.business || '£49'
  const country = geo?.country || ''
  const flag = geo?.flag || ''
  const isRTL = lang === 'ar'

  useEffect(() => {
    const saved = document.cookie.split(';').find(c => c.trim().startsWith('askbiz_lang='))
    if (saved) return
    const browserLang = navigator.language?.split('-')[0]?.toLowerCase()
    const BMAP: Record<string, Lang> = { en:'en', fr:'fr', de:'de', es:'es', ar:'ar', sw:'sw', pt:'pt', nl:'nl', it:'it', pl:'pl' }
    if (browserLang && browserLang !== 'en' && BMAP[browserLang]) { setLang(BMAP[browserLang] as Lang); return }
    fetch('/api/geo').then(r => r.json()).then(d => {
      const detected = (COUNTRY_TO_LANG as Record<string, Lang>)[d.countryCode] || 'en'
      setLang(detected)
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
    { q: 'What does the Point of Sale system include?', a: 'The PoS includes a full register with barcode scanning, inventory management, staff shift tracking, digital receipts, refunds, multi-branch support, tax compliance (VAT, multi-jurisdiction), GDPR tools, and integrations with Xero and QuickBooks. It costs £5 per seat per month.' },
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
        .tdot { display:inline-block; width:6px; height:6px; border-radius:50%; background:#a39e97; animation:tdot 1.2s infinite }
        .card-hover:hover { border-color:rgba(208,138,89,.25) !important; transform:translateY(-2px); transition:all 180ms ease }
        .btn-primary:hover { opacity:.88; transform:translateY(-1px) }
        .btn-primary { transition:all 150ms ease }
        .nav-link:hover { color:#1a1916 !important }
        .faq-item:hover { background:#f3f2ef }
        .kpi-chip { display:inline-flex; align-items:center; gap:6px; padding:4px 10px; border-radius:9999px; font-size:12px; font-weight:600; border:1px solid }
      `}</style>

      {/* ── NAV ───────────────────────────────────────────────── */}
      <nav style={{ position:'sticky', top:0, zIndex:50, background:'rgba(249,248,246,.96)', backdropFilter:'blur(16px)', borderBottom:`1px solid ${C.b}`, padding:'0 clamp(16px,4vw,32px)', height:54, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none', color:C.tx }}>
          <div style={{ width:26, height:26, borderRadius:7, background:C.acc, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="12" height="12" viewBox="0 0 32 32" fill="none"><rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.5"/><rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.75"/><rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/></svg>
          </div>
          <span style={{ fontFamily:'var(--font-sora)', fontSize:15, fontWeight:700, letterSpacing:'-.02em' }}>AskBiz</span>
        </Link>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <LanguageToggle/>
          <a href="#pos" className="nav-link" style={{ fontSize:13, color:C.tx2, textDecoration:'none', padding:'0 8px' }}>Point of Sale</a>
          <a href="#pricing" className="nav-link" style={{ fontSize:13, color:C.tx2, textDecoration:'none', padding:'0 8px' }}>Pricing</a>
          <Link href="/blog" className="nav-link" style={{ fontSize:13, color:C.tx2, textDecoration:'none', padding:'0 8px' }}>Blog</Link>
          <Link href="/academy" className="nav-link" style={{ fontSize:13, color:C.tx2, textDecoration:'none', padding:'0 8px' }}>Academy</Link>
          <Link href="/signin" style={{ padding:'7px 14px', borderRadius:9999, border:`1px solid ${C.b2}`, background:'transparent', color:C.tx, fontSize:13, fontWeight:500, textDecoration:'none' }}>Sign in</Link>
          <Link href="/signin" className="btn-primary" style={{ padding:'7px 16px', borderRadius:9999, border:'none', background:C.acc, color:'#fff', fontSize:13, fontWeight:600, textDecoration:'none', boxShadow:`0 2px 10px ${C.acc}40` }}>Try free →</Link>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{ maxWidth:1100, margin:'0 auto', padding:'clamp(52px,8vw,96px) clamp(16px,4vw,40px) clamp(40px,6vw,72px)', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(32px,5vw,64px)', alignItems:'center' }}>

        {/* Left — copy */}
        <div>
          {country && (
            <div className="fade-up" style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'4px 12px', borderRadius:9999, background:C.accBg, border:`1px solid ${C.accBdr}`, fontSize:12, color:C.acc, fontWeight:600, marginBottom:24, letterSpacing:'.02em' }}>
              {flag} Prices shown in {sym} for {country}
            </div>
          )}
          <h1 className="fade-up" style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(32px,5vw,54px)', fontWeight:700, lineHeight:1.1, letterSpacing:'-.035em', marginBottom:22, color:C.tx }}>
            Your business data,<br/>
            <span style={{ color:C.acc }}>answering back.</span>
          </h1>
          <p className="fade-up" style={{ fontSize:'clamp(15px,1.8vw,18px)', color:C.tx2, lineHeight:1.7, marginBottom:14, maxWidth:440 }}>
            Ask questions about your business in plain English. Get specific answers — with your actual numbers, not generic advice.
          </p>
          <p className="fade-up" style={{ fontSize:13, color:C.tx3, marginBottom:36, lineHeight:1.6 }}>
            Connect Shopify, Amazon, TikTok Shop, QuickBooks — or upload a CSV. Free to start, no card needed.
          </p>
          <div className="fade-up" style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:20 }}>
            <Link href="/signin" className="btn-primary" style={{ padding:'13px 26px', borderRadius:9999, border:'none', background:C.acc, color:'#fff', fontSize:15, fontWeight:700, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:8, boxShadow:`0 4px 20px ${C.acc}40`, letterSpacing:'-.01em' }}>
              Start for free →
            </Link>
            <a href="#demo" style={{ padding:'13px 20px', borderRadius:9999, border:`1px solid ${C.b2}`, background:'transparent', color:C.tx2, fontSize:14, fontWeight:500, textDecoration:'none', display:'inline-flex', alignItems:'center' }}>
              See it in action
            </a>
          </div>
          <p style={{ fontSize:12, color:C.tx3 }}>No credit card · Takes 2 minutes to set up</p>
        </div>

        {/* Right — feature showcase */}
        <div id="demo">
          <FeatureShowcase />
        </div>
      </section>

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
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1, borderRadius:16, overflow:'hidden', border:`1px solid ${C.b}` }}>
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
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(40px,6vw,80px)', alignItems:'start' }}>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:C.acc, textTransform:'uppercase', letterSpacing:'.12em', marginBottom:16 }}>Business Tools</div>
              <h2 style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(22px,3.5vw,36px)', fontWeight:700, lineHeight:1.15, letterSpacing:'-.03em', marginBottom:16, color:C.tx }}>
                Five tools that pay for themselves the first time you use them.
              </h2>
              <p style={{ fontSize:15, color:C.tx2, lineHeight:1.7, marginBottom:28 }}>
                Pre-filled from your connected data. Review, adjust, calculate. No spreadsheets.
              </p>
              <Link href="/signin" className="btn-primary" style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'11px 22px', borderRadius:9999, background:C.acc, color:'#fff', fontSize:14, fontWeight:600, textDecoration:'none', boxShadow:`0 2px 12px ${C.acc}35` }}>
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

        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
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

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14, marginTop:14 }}>
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
          <Link href="/signin" className="btn-primary" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'12px 24px', borderRadius:9999, background:C.acc, color:'#fff', fontSize:14, fontWeight:700, textDecoration:'none', boxShadow:`0 3px 16px ${C.acc}40` }}>
            Try the PoS free →
          </Link>
          <p style={{ fontSize:12, color:C.tx3, marginTop:10 }}>£5 per seat/month · Works on tablet or desktop</p>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section style={{ maxWidth:860, margin:'0 auto', padding:'clamp(52px,7vw,84px) clamp(16px,4vw,40px)' }}>
        <div style={{ fontSize:11, fontWeight:700, color:C.acc, textTransform:'uppercase', letterSpacing:'.12em', marginBottom:16, textAlign:'center' }}>How it works</div>
        <h2 style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(22px,3.5vw,34px)', fontWeight:700, textAlign:'center', marginBottom:52, letterSpacing:'-.03em', color:C.tx }}>
          Up and running in under 5 minutes
        </h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:0, position:'relative' }}>
          <div style={{ position:'absolute', top:28, left:'16.6%', right:'16.6%', height:1, background:`linear-gradient(90deg, ${C.acc}, ${C.accBdr})`, zIndex:0 }}/>
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
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
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
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:1, border:`1px solid ${C.b}`, borderRadius:16, overflow:'hidden' }}>
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
        <div style={{ maxWidth:820, margin:'0 auto' }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.acc, textTransform:'uppercase', letterSpacing:'.12em', marginBottom:16, textAlign:'center' }}>Pricing</div>
          <h2 style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(22px,3.5vw,34px)', fontWeight:700, textAlign:'center', marginBottom:8, letterSpacing:'-.03em', color:C.tx }}>
            Simple, honest pricing
          </h2>
          {country && <p style={{ textAlign:'center', fontSize:12, color:C.acc, marginBottom:8, fontWeight:500 }}>{flag} Prices in {sym} for {country}</p>}
          <p style={{ textAlign:'center', fontSize:14, color:C.tx2, marginBottom:28 }}>All plans include API access. Cancel anytime.</p>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:32 }}>
            <span style={{ fontSize:13, color:annual?C.tx3:C.tx, fontWeight:annual?400:600 }}>Monthly</span>
            <button onClick={() => setAnnual(v=>!v)} style={{ width:42, height:22, borderRadius:11, background:annual?C.acc:C.b2, border:'none', cursor:'pointer', position:'relative', transition:'background 200ms' }}>
              <div style={{ width:16, height:16, borderRadius:'50%', background:'#fff', position:'absolute', top:3, left:annual?23:3, transition:'left 200ms', boxShadow:'0 1px 4px rgba(0,0,0,.2)' }}/>
            </button>
            <span style={{ fontSize:13, color:annual?C.tx:C.tx3, fontWeight:annual?600:400 }}>
              Annual <span style={{ fontSize:11, fontWeight:700, color:'#16a34a', background:'rgba(34,197,94,.1)', borderRadius:9999, padding:'1px 7px', marginLeft:4 }}>2 months free</span>
            </span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
            {[
              { id:'free', name:'Free', colour:'#6b6760', price:`${sym}0`, sub:'10 questions/month', popular:false,
                features:['10 questions per month','Upload CSV & Excel','Business Pulse score','Connect Shopify, Amazon & more','FX Risk, Landed Cost, Export tools','API access','No credit card needed'] },
              { id:'growth', name:'Growth', colour:C.acc, price:growthMonthly, sub:'per month', popular:true,
                features:['Unlimited questions','All tools pre-filled from your data','Daily Brief — AI morning intelligence','Point of Sale — £5/seat add-on','Social Commerce — TikTok, Instagram, Pinterest','Churn Intelligence — monthly scan','Anomaly alerts'] },
              { id:'business', name:'Business', colour:'#7c3aed', price:bizMonthly, sub:'per month', popular:false,
                features:['Everything in Growth','Team seats — up to 5','Multi-branch PoS — £5/seat add-on','Decision Memory','Competitor Watch','CFO Mode reports','Priority support'] },
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
                <Link href="/signin" className="btn-primary" style={{ display:'block', padding:'11px', borderRadius:10, border:plan.popular?'none':`1px solid ${C.b2}`, background:plan.popular?C.acc:'transparent', color:plan.popular?'#fff':C.tx2, fontSize:14, fontWeight:600, textDecoration:'none', textAlign:'center', boxShadow:plan.popular?`0 2px 12px ${C.acc}35`:'none' }}>
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
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(32px,5vw,64px)', alignItems:'start' }}>

          {/* Academy */}
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:C.acc, textTransform:'uppercase', letterSpacing:'.12em', marginBottom:14 }}>Academy</div>
            <h2 style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(20px,3vw,30px)', fontWeight:700, lineHeight:1.15, letterSpacing:'-.03em', marginBottom:10, color:C.tx }}>
              420+ free guides.<br/>No jargon. No paywall.
            </h2>
            <p style={{ fontSize:14, color:C.tx2, lineHeight:1.7, marginBottom:22 }}>
              Business metrics, KPIs, financial intelligence, eCommerce analytics, FX risk, and AI — explained for founders, not analysts.
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:20 }}>
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
          <Link href="/signin" className="btn-primary" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'14px 30px', borderRadius:9999, border:'none', background:C.acc, color:'#fff', fontSize:16, fontWeight:700, textDecoration:'none', boxShadow:`0 4px 24px ${C.acc}50`, letterSpacing:'-.01em' }}>
            Start for free →
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
        <nav style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
          {[['/', 'Home'], ['/blog', 'Blog'], ['/academy', 'Academy'], ['/integrations', 'Integrations'], ['/free-tools', 'Free Tools'], ['/developers', 'API'], ['/help', 'Help'], ['/pricing', 'Pricing'], ['/changelog', 'Changelog'], ['/rules', 'Rules & Policies'], ['/transparency', 'Transparency'], ['/privacy', 'Privacy'], ['/terms', 'Terms'], ['mailto:hello@askbiz.co', 'Contact']].map(([href, label]) => (
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
