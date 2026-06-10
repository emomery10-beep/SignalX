'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface KPI { label: string; value: string; sub: string; trend: 'up'|'down'|'flat'; color: string; icon: string; bg: string }
interface Insight { id: string; type: 'alert'|'trend'|'tip'|'win'; message: string; action: string; urgency: 'high'|'medium'|'low' }

interface Widget {
  id: string
  title: string
  subtitle: string
  icon: string
  accent: string
  accentBg: string
  type: 'revenue' | 'margins' | 'stock' | 'products' | 'insights' | 'actions'
}

const WIDGETS: Widget[] = [
  { id: 'revenue',  title: 'Revenue Trend',     subtitle: 'Track sales over time',         icon: '📈', accent: '#d08a59', accentBg: 'rgba(208,138,89,.1)',  type: 'revenue'  },
  { id: 'margins',  title: 'Margin Health',      subtitle: 'Margin distribution breakdown', icon: '📊', accent: '#22c55e', accentBg: 'rgba(34,197,94,.1)',   type: 'margins'  },
  { id: 'stock',    title: 'Stock Monitor',      subtitle: 'Low stock & reorder alerts',    icon: '📦', accent: '#f48080', accentBg: 'rgba(244,128,128,.1)', type: 'stock'    },
  { id: 'products', title: 'Top Products',       subtitle: 'Best performers by revenue',    icon: '🏆', accent: '#8c6fe0', accentBg: 'rgba(140,111,224,.1)', type: 'products' },
  { id: 'insights', title: 'Business Insights',  subtitle: 'AI-detected patterns & alerts', icon: '💡', accent: '#f5c55a', accentBg: 'rgba(245,197,90,.1)',  type: 'insights' },
  { id: 'actions',  title: 'Quick Actions',      subtitle: 'Jump to common tasks',          icon: '⚡', accent: '#47e2da', accentBg: 'rgba(71,226,218,.1)',  type: 'actions'  },
]

const DASH_TABS = [
  { key: 'overview',   label: '📋 Overview' },
  { key: 'revenue',    label: '💰 Revenue' },
  { key: 'inventory',  label: '📦 Inventory' },
]

type DashTab = 'overview' | 'revenue' | 'inventory'

const URGENCY_COLOR  = { high:'#f48080', medium:'#f5c55a', low:'var(--acc)' }
const URGENCY_BG     = { high:'rgba(244,128,128,.07)', medium:'rgba(245,197,90,.07)', low:'rgba(208,138,89,.07)' }
const URGENCY_BORDER = { high:'rgba(244,128,128,.2)', medium:'rgba(245,197,90,.2)', low:'rgba(208,138,89,.2)' }

// ── Tiny SVG sparkline ────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (!data.length) return null
  const w = 120, h = 44
  const min = Math.min(...data), max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (w - 4) + 2
    const y = h - ((v - min) / range) * (h - 8) - 4
    return `${x},${y}`
  }).join(' ')
  const fill = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (w - 4) + 2
    const y = h - ((v - min) / range) * (h - 8) - 4
    return `${x},${y}`
  })
  const fillPath = `M${fill[0]} L${fill.slice(1).join(' L')} L${w - 2},${h} L2,${h} Z`
  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={fillPath} fill={`url(#sg-${color.replace('#','')})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={fill[fill.length-1].split(',')[0]} cy={fill[fill.length-1].split(',')[1]} r="3" fill={color}/>
    </svg>
  )
}

// ── Tiny SVG mini bars ─────────────────────────────────────────
function MiniBars({ data, accent }: { data: number[]; accent: string }) {
  const max = Math.max(...data, 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 44 }}>
      {data.map((v, i) => {
        const h = Math.max(4, (v / max) * 40)
        return (
          <div key={i} style={{ flex: 1, height: h, borderRadius: '3px 3px 0 0',
            background: i === data.length - 1 ? accent : `${accent}55`,
            transition: 'height 600ms cubic-bezier(.34,1.56,.64,1)' }} />
        )
      })}
    </div>
  )
}

// ── Tiny donut SVG ─────────────────────────────────────────────
function MiniDonut({ pct, color }: { pct: number; color: string }) {
  const r = 18, circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg width={44} height={44} viewBox="0 0 44 44">
      <circle cx={22} cy={22} r={r} fill="none" stroke="var(--ev)" strokeWidth={5}/>
      <circle cx={22} cy={22} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform="rotate(-90 22 22)"/>
      <text x={22} y={26} textAnchor="middle" fontSize={9} fontWeight={700} fill={color}>{pct}%</text>
    </svg>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState<DashTab>('overview')
  const [openWidget, setOpenWidget] = useState<Widget | null>(null)
  const [cardOrigin, setCardOrigin] = useState({ x: '50vw', y: '50vh' })
  const [kpis, setKpis] = useState<KPI[]>([])
  const [insights, setInsights] = useState<Insight[]>([])
  const [uploads, setUploads] = useState<{ id: string; filename: string; row_count: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('there')
  const [currency, setCurrency] = useState('£')

  // Chart data
  const [revTrend, setRevTrend] = useState<number[]>([42, 55, 48, 67, 72, 80, 88])
  const [products, setProducts] = useState<{ name: string; value: number }[]>([])
  const [stockItems, setStockItems] = useState<{ name: string; qty: number; low: boolean }[]>([])
  const [avgMargin, setAvgMargin] = useState(23)
  const [highMargin, setHighMargin] = useState(4)
  const [midMargin, setMidMargin] = useState(5)
  const [lowMargin, setLowMargin] = useState(3)

  // Modal chart refs
  const chartRef  = useRef<HTMLCanvasElement>(null)
  const chart2Ref = useRef<HTMLCanvasElement>(null)
  const ci1 = useRef<unknown>(null)
  const ci2 = useRef<unknown>(null)

  useEffect(() => {
    loadData()
  }, [])

  // Build canvas charts when modal opens
  useEffect(() => {
    if (!openWidget) return
    setTimeout(() => {
      if (typeof window === 'undefined') return
      if (openWidget.type === 'revenue' || openWidget.type === 'products' || openWidget.type === 'margins' || openWidget.type === 'stock') {
        import('chart.js/auto').then(({ default: Chart }) => {
          const font = { family: 'DM Sans, sans-serif', size: 11 }
          const grid = { color: 'rgba(0,0,0,.06)' }
          const ticks = { color: '#a39e97', font }
          const tooltip = { backgroundColor: '#fff', titleColor: '#1a1916', bodyColor: '#6b6760', borderColor: 'rgba(0,0,0,.1)', borderWidth: 1, padding: 10, cornerRadius: 8 }

          if (openWidget.type === 'revenue' && chartRef.current) {
            if (ci1.current) (ci1.current as { destroy: () => void }).destroy()
            const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            ci1.current = new Chart(chartRef.current.getContext('2d')!, {
              type: 'line',
              data: {
                labels,
                datasets: [{
                  data: revTrend,
                  borderColor: '#d08a59',
                  backgroundColor: 'rgba(208,138,89,.1)',
                  tension: 0.4,
                  fill: true,
                  pointRadius: 4,
                  pointBackgroundColor: '#d08a59',
                }]
              },
              options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip },
                scales: {
                  x: { grid: { display: false }, ticks },
                  y: { grid, ticks: { ...ticks, callback: (v: unknown) => `${currency} ${Number(v).toLocaleString()}` }, beginAtZero: true }
                }
              }
            })
          }

          if (openWidget.type === 'margins' && chart2Ref.current) {
            if (ci2.current) (ci2.current as { destroy: () => void }).destroy()
            ci2.current = new Chart(chart2Ref.current.getContext('2d')!, {
              type: 'doughnut',
              data: {
                labels: ['High >25%', 'Mid 15–25%', 'Low <15%'],
                datasets: [{ data: [highMargin, midMargin, lowMargin], backgroundColor: ['rgba(34,197,94,.75)', 'rgba(208,138,89,.75)', 'rgba(244,128,128,.7)'], borderWidth: 0, hoverOffset: 6 }]
              },
              options: {
                responsive: true, maintainAspectRatio: false, cutout: '70%',
                plugins: {
                  legend: { position: 'bottom', labels: { color: '#6b6760', font, boxWidth: 10, padding: 10 } },
                  tooltip
                }
              }
            })
          }

          if (openWidget.type === 'products' && chartRef.current) {
            if (ci1.current) (ci1.current as { destroy: () => void }).destroy()
            ci1.current = new Chart(chartRef.current.getContext('2d')!, {
              type: 'bar',
              data: {
                labels: products.slice(0, 6).map(p => p.name.length > 14 ? p.name.slice(0, 14) + '…' : p.name),
                datasets: [{
                  data: products.slice(0, 6).map(p => p.value),
                  backgroundColor: products.slice(0, 6).map((_, i) => i < 3 ? 'rgba(208,138,89,.8)' : 'rgba(140,111,224,.7)'),
                  borderRadius: 8,
                  borderSkipped: false,
                }]
              },
              options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip },
                scales: {
                  x: { grid: { display: false }, ticks },
                  y: { grid, ticks: { ...ticks, callback: (v: unknown) => `${currency} ${Number(v).toLocaleString()}` }, beginAtZero: true }
                }
              }
            })
          }
        })
      }
    }, 80)

    return () => {
      if (ci1.current) { (ci1.current as { destroy: () => void }).destroy(); ci1.current = null }
      if (ci2.current) { (ci2.current as { destroy: () => void }).destroy(); ci2.current = null }
    }
  }, [openWidget])

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenWidget(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }
    const [{ data: profile }, { data: ups }] = await Promise.all([
      supabase.from('profiles').select('full_name, currency_symbol').eq('id', user.id).single(),
      supabase.from('uploads').select('id, filename, row_count, parsed_sample, column_names').eq('user_id', user.id).eq('status', 'parsed').order('created_at', { ascending: false }).limit(5),
    ])
    const name = profile?.full_name?.split(' ')[0] || 'there'
    const sym  = profile?.currency_symbol || '£'
    setUserName(name); setCurrency(sym); setUploads(ups || [])

    const latest = ups?.[0]
    if (latest?.parsed_sample) {
      const rows = latest.parsed_sample as Record<string, unknown>[]
      const cols = (latest.column_names as string[]) || []
      const priceCol  = cols.find(c => /price|revenue|sales|amount/i.test(c))
      const stockCol  = cols.find(c => /stock|qty|quantity|inventory/i.test(c))
      const marginCol = cols.find(c => /margin/i.test(c))

      // Revenue spread across 7 buckets for sparkline
      if (priceCol) {
        const chunk = Math.ceil(rows.length / 7)
        const trend = Array.from({ length: 7 }, (_, i) =>
          rows.slice(i * chunk, (i + 1) * chunk).reduce((s, r) => s + Number(r[priceCol] || 0), 0)
        )
        setRevTrend(trend)
      }

      // Products
      if (priceCol) {
        const sorted = [...rows].sort((a, b) => Number(b[priceCol] || 0) - Number(a[priceCol] || 0)).slice(0, 8)
        setProducts(sorted.map(r => ({ name: String(r[cols[0]] || ''), value: Math.round(Number(r[priceCol] || 0)) })))
      }

      // Stock
      if (stockCol) {
        const sorted = [...rows].sort((a, b) => Number(a[stockCol] || 0) - Number(b[stockCol] || 0)).slice(0, 6)
        setStockItems(sorted.map(r => ({ name: String(r[cols[0]] || ''), qty: Number(r[stockCol] || 0), low: Number(r[stockCol] || 0) < 10 })))
      }

      // Margins
      if (marginCol) {
        let h = 0, m = 0, l = 0
        rows.forEach(r => { const v = Number(r[marginCol] || 0); if (v > 25) h++; else if (v > 15) m++; else l++ })
        setHighMargin(h || 4); setMidMargin(m || 5); setLowMargin(l || 3)
        const avg = rows.reduce((s, r) => s + Number(r[marginCol] || 0), 0) / rows.length
        setAvgMargin(Math.round(avg))
      }

      // KPIs
      const totalRev  = priceCol ? rows.reduce((s, r) => s + Number(r[priceCol] || 0), 0) : 0
      const avgM      = marginCol ? rows.reduce((s, r) => s + Number(r[marginCol] || 0), 0) / rows.length : 0
      const lowStock  = stockCol ? rows.filter(r => Number(r[stockCol]) < 10).length : 0
      const bestItem  = priceCol ? [...rows].sort((a, b) => Number(b[priceCol] || 0) - Number(a[priceCol] || 0))[0] : null
      const bestName  = bestItem ? String(bestItem[cols[0]] || 'Top item') : '—'
      setKpis([
        { label: 'Total revenue',   value: totalRev > 0 ? `${sym} ${Math.round(totalRev).toLocaleString()}` : 'Upload data', sub: 'From latest file', trend: 'up',   color: '#d08a59', bg: 'rgba(208,138,89,.08)', icon: '💰' },
        { label: 'Avg margin',      value: avgM > 0 ? `${avgM.toFixed(1)}%` : '—',  sub: 'Across products',  trend: avgM > 20 ? 'up' : 'down', color: avgM > 20 ? '#22c55e' : '#f48080', bg: avgM > 20 ? 'rgba(34,197,94,.08)' : 'rgba(244,128,128,.08)', icon: '📊' },
        { label: 'Low stock items', value: lowStock > 0 ? `${lowStock} items` : '✓ Good', sub: 'Need restocking', trend: lowStock > 0 ? 'down' : 'up', color: lowStock > 0 ? '#f48080' : '#22c55e', bg: lowStock > 0 ? 'rgba(244,128,128,.08)' : 'rgba(34,197,94,.08)', icon: '📦' },
        { label: 'Top product',     value: bestName.length > 18 ? bestName.slice(0, 18) + '…' : bestName, sub: 'Highest revenue', trend: 'up', color: '#8c6fe0', bg: 'rgba(140,111,224,.08)', icon: '🏆' },
      ])

      // Insights
      const ins: Insight[] = []
      if (stockCol) {
        const crit = rows.filter(r => Number(r[stockCol]) < 5)
        if (crit.length > 0) {
          const names = crit.slice(0, 3).map(r => String(r[cols[0]])).join(', ')
          ins.push({ id: '1', type: 'alert', message: `${crit.length} item${crit.length > 1 ? 's' : ''} critically low — ${names}`, action: 'See alerts', urgency: 'high' })
        }
      }
      if (marginCol) {
        const low = rows.filter(r => Number(r[marginCol]) < 15)
        if (low.length > 0) ins.push({ id: '2', type: 'trend', message: `${low.length} products have margins below 15% — review pricing`, action: 'Ask AskBiz', urgency: 'medium' })
      }
      if (ins.length === 0) {
        ins.push({ id: '3', type: 'win', message: 'All metrics look healthy — no critical issues detected', action: 'Ask AskBiz', urgency: 'low' })
        ins.push({ id: '4', type: 'tip', message: 'Try asking "What should I restock this week?" in chat', action: 'Ask now', urgency: 'low' })
      }
      setInsights(ins)
    } else {
      setKpis([
        { label: 'Total revenue',   value: 'Upload data', sub: 'No file yet', trend: 'flat', color: 'var(--tx3)', bg: 'var(--ev)', icon: '💰' },
        { label: 'Avg margin',      value: '—', sub: 'No data yet',  trend: 'flat', color: 'var(--tx3)', bg: 'var(--ev)', icon: '📊' },
        { label: 'Low stock items', value: '—', sub: 'No data yet',  trend: 'flat', color: 'var(--tx3)', bg: 'var(--ev)', icon: '📦' },
        { label: 'Top product',     value: '—', sub: 'No data yet',  trend: 'flat', color: 'var(--tx3)', bg: 'var(--ev)', icon: '🏆' },
      ])
      setInsights([
        { id: '1', type: 'tip', message: 'Upload a CSV or Excel file to populate your dashboards', action: 'Upload now', urgency: 'low' },
        { id: '2', type: 'tip', message: 'Connect Shopify or Stripe to get live data automatically', action: 'Connect', urgency: 'low' },
      ])
    }
    setLoading(false)
  }

  const openExpand = useCallback((widget: Widget, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    setCardOrigin({ x: `${cx}px`, y: `${cy}px` })
    setOpenWidget(widget)
  }, [])

  const handleInsightAction = (action: string) => {
    if (action === 'Upload now') router.push('/files')
    else if (action === 'Connect') router.push('/sources')
    else if (action === 'See alerts') router.push('/alerts')
    else router.push('/ask')
  }

  // Filter widgets by active tab
  const visibleWidgets = WIDGETS.filter(w => {
    if (activeTab === 'overview') return true
    if (activeTab === 'revenue') return ['revenue', 'products', 'margins', 'insights'].includes(w.id)
    if (activeTab === 'inventory') return ['stock', 'products', 'insights', 'actions'].includes(w.id)
    return true
  })

  const quickActions = [
    { label: 'Ask a question', icon: '💬', href: '/ask' },
    { label: 'Upload a file',  icon: '📂', href: '/files' },
    { label: 'Set an alert',   icon: '🔔', href: '/alerts' },
    { label: 'Run forecast',   icon: '📈', href: '/forecasts' },
    { label: 'View tools',     icon: '🔧', href: '/tools' },
    { label: 'Sources',        icon: '🔗', href: '/sources' },
  ]

  return (
    <>
      <style>{`
        @keyframes balloon {
          0%   { opacity: 0; transform: translate(-50%,-50%) scale(0.12); }
          65%  { opacity: 1; transform: translate(-50%,-50%) scale(1.04); }
          100% { transform: translate(-50%,-50%) scale(1); }
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.45} }
        .dash-widget { cursor:pointer; transition:transform 200ms, border-color 200ms; }
        .dash-widget:hover { transform:translateY(-2px); border-color:rgba(208,138,89,.3) !important; }
        .dash-tab { padding:7px 16px; border-radius:9999px; border:1px solid var(--b2); background:transparent; color:var(--tx2); font-family:inherit; font-size:13px; cursor:pointer; transition:all 150ms; }
        .dash-tab.active { border-color:rgba(208,138,89,.4); background:rgba(208,138,89,.1); color:var(--acc); font-weight:600; }
      `}</style>

      <div className="page-shell">

        {/* ── HEADER ──────────────────────────────────────────── */}
        <div style={{ padding: 'clamp(14px,4vw,22px) clamp(14px,3vw,24px) 14px', flexShrink: 0, borderBottom: '1px solid var(--b)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-sora)', fontSize: 20, fontWeight: 700, letterSpacing: '-.025em', marginBottom: 3 }}>
                Dashboards
              </div>
              <div style={{ fontSize: 13, color: 'var(--tx2)' }}>
                Live metrics for {loading ? '…' : userName} — click any widget to expand
              </div>
            </div>
            <button onClick={() => router.push('/ask')}
              style={{ padding: '9px 18px', borderRadius: 9999, border: 'none', background: 'var(--acc)', color: '#fff', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Ask AskBiz
            </button>
          </div>

          {/* KPI row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 10, marginBottom: 16 }}>
            {(loading ? Array(4).fill({ label: '…', value: '…', sub: '', trend: 'flat', color: 'var(--tx3)', bg: 'var(--ev)', icon: '💰' }) as KPI[] : kpis).map((k, i) => (
              <div key={i} style={{ padding: '14px 16px', borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{k.icon}</div>
                  <span style={{ fontSize: 15, color: k.trend === 'up' ? '#22c55e' : k.trend === 'down' ? '#f48080' : 'transparent' }}>
                    {k.trend === 'up' ? '↑' : k.trend === 'down' ? '↓' : ''}
                  </span>
                </div>
                <div style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 700, color: k.color, marginBottom: 2, lineHeight: 1.2 }}>{k.value}</div>
                <div style={{ fontSize: 11, color: 'var(--tx2)', fontWeight: 500 }}>{k.label}</div>
              </div>
            ))}
          </div>

          {/* Tab bar */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {DASH_TABS.map(t => (
              <button key={t.key} className={`dash-tab${activeTab === t.key ? ' active' : ''}`} onClick={() => setActiveTab(t.key as DashTab)}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── WIDGET GRID ─────────────────────────────────────── */}
        <div className="page-shell-body" style={{ padding: 'clamp(14px,3vw,20px) clamp(14px,3vw,24px)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 14 }}>
            {visibleWidgets.map(widget => (
              <div
                key={widget.id}
                className="dash-widget"
                onClick={e => openExpand(widget, e)}
                style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 12, padding: 20, position: 'relative', overflow: 'hidden' }}
              >
                {/* Accent glow */}
                <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: widget.accentBg, filter: 'blur(24px)', pointerEvents: 'none' }}/>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 12, background: widget.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                    {widget.icon}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--tx3)', background: 'var(--ev)', borderRadius: 9999, padding: '3px 9px', fontWeight: 500 }}>
                    Click to expand
                  </div>
                </div>

                <div style={{ fontFamily: 'var(--font-sora)', fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{widget.title}</div>
                <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 14 }}>{widget.subtitle}</div>

                {/* Mini preview */}
                {widget.type === 'revenue' && (
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-sora)', color: '#d08a59', marginBottom: 6 }}>
                      {kpis[0]?.value || '—'}
                    </div>
                    <Sparkline data={revTrend} color="#d08a59"/>
                  </div>
                )}
                {widget.type === 'margins' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <MiniDonut pct={avgMargin} color="#22c55e"/>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>Distribution</div>
                      {[{ label: 'High >25%', c: '#22c55e', v: highMargin }, { label: 'Mid', c: '#d08a59', v: midMargin }, { label: 'Low <15%', c: '#f48080', v: lowMargin }].map((m, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                          <div style={{ width: 7, height: 7, borderRadius: '50%', background: m.c, flexShrink: 0 }}/>
                          <div style={{ fontSize: 10, color: 'var(--tx2)', flex: 1 }}>{m.label}</div>
                          <div style={{ fontSize: 10, fontWeight: 600, color: m.c }}>{m.v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {widget.type === 'stock' && (
                  <div>
                    {stockItems.length > 0 ? stockItems.slice(0, 3).map((s, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.low ? '#f48080' : '#22c55e', flexShrink: 0 }}/>
                        <div style={{ flex: 1, fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--tx)' }}>
                          {s.name.length > 16 ? s.name.slice(0, 16) + '…' : s.name}
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: s.low ? '#f48080' : '#22c55e', flexShrink: 0 }}>{s.qty} left</div>
                      </div>
                    )) : (
                      <div style={{ fontSize: 12, color: 'var(--tx3)' }}>Upload data to monitor stock</div>
                    )}
                    {stockItems.filter(s => s.low).length > 0 && (
                      <div style={{ marginTop: 6, fontSize: 11, color: '#f48080', fontWeight: 600 }}>
                        ⚠ {stockItems.filter(s => s.low).length} items need restocking
                      </div>
                    )}
                  </div>
                )}
                {widget.type === 'products' && (
                  <div>
                    <MiniBars data={products.slice(0, 7).map(p => p.value)} accent="#8c6fe0"/>
                    <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 6 }}>
                      {products.length > 0 ? `Top: ${products[0].name.slice(0, 16)}` : 'Upload data to see products'}
                    </div>
                  </div>
                )}
                {widget.type === 'insights' && (
                  <div>
                    {insights.slice(0, 2).map((ins, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, marginBottom: 8 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: URGENCY_COLOR[ins.urgency], marginTop: 5, flexShrink: 0 }}/>
                        <div style={{ fontSize: 11, color: 'var(--tx2)', lineHeight: 1.5 }}>
                          {ins.message.length > 65 ? ins.message.slice(0, 65) + '…' : ins.message}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {widget.type === 'actions' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    {quickActions.slice(0, 4).map((a, i) => (
                      <div key={i} style={{ padding: '7px 9px', borderRadius: 10, background: 'var(--ev)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5, color: 'var(--tx2)' }}>
                        <span>{a.icon}</span> {a.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom connect CTA */}
          {uploads.length === 0 && !loading && (
            <div style={{ marginTop: 20, padding: '16px 20px', borderRadius: 14, border: '1px solid rgba(208,138,89,.25)', background: 'rgba(208,138,89,.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-sora)', fontSize: 14, fontWeight: 600, marginBottom: 3 }}>Power up your dashboards</div>
                <div style={{ fontSize: 13, color: 'var(--tx2)' }}>Upload a CSV or connect Shopify to see live metrics across all widgets.</div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button onClick={() => router.push('/files')} style={{ padding: '8px 16px', borderRadius: 9999, border: 'none', background: 'var(--acc)', color: '#fff', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  Upload file →
                </button>
                <button onClick={() => router.push('/sources')} style={{ padding: '8px 16px', borderRadius: 9999, border: '1px solid var(--b2)', background: 'transparent', color: 'var(--tx2)', fontFamily: 'inherit', fontSize: 13, cursor: 'pointer' }}>
                  Connect source
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── BALLOON WIDGET MODAL ─────────────────────────────── */}
      {openWidget && (
        <div
          onClick={() => setOpenWidget(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: '50%', left: '50%',
              width: 'min(780px, 94vw)',
              maxHeight: '86vh',
              background: 'var(--sf)',
              borderRadius: 14,
              boxShadow: '0 8px 32px rgba(0,0,0,.18)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              animation: 'balloon 380ms cubic-bezier(.34,1.56,.64,1) forwards',
              transformOrigin: `calc(${cardOrigin.x} - 50vw) calc(${cardOrigin.y} - 50vh)`,
            }}
          >
            {/* Modal header */}
            <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: openWidget.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                  {openWidget.icon}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-sora)', fontSize: 17, fontWeight: 700 }}>{openWidget.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--tx3)' }}>{openWidget.subtitle}</div>
                </div>
              </div>
              <button onClick={() => setOpenWidget(null)} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--b2)', background: 'var(--ev)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: 'var(--tx2)' }}>
                ×
              </button>
            </div>

            {/* Modal body */}
            <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>

              {/* Revenue */}
              {openWidget.type === 'revenue' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 12, marginBottom: 24 }}>
                    {[{ label: 'Total revenue', value: kpis[0]?.value || '—', color: '#d08a59' }, { label: '7-day trend', value: revTrend[revTrend.length-1] > revTrend[0] ? '↑ Growing' : '↓ Falling', color: revTrend[revTrend.length-1] > revTrend[0] ? '#22c55e' : '#f48080' }, { label: 'Peak day', value: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][revTrend.indexOf(Math.max(...revTrend))], color: 'var(--acc)' }].map((s, i) => (
                      <div key={i} style={{ padding: '16px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--bg)' }}>
                        <div style={{ fontFamily: 'var(--font-sora)', fontSize: 20, fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.value}</div>
                        <div style={{ fontSize: 12, color: 'var(--tx3)' }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ position: 'relative', height: 220 }}>
                    {uploads.length === 0
                      ? <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}>
                          <div style={{ fontSize: 32 }}>📊</div>
                          <div style={{ fontSize: 14, color: 'var(--tx3)' }}>Upload data to see your revenue chart</div>
                          <button onClick={() => { setOpenWidget(null); router.push('/files') }} style={{ padding: '8px 16px', borderRadius: 9999, border: '1px solid var(--b2)', background: 'transparent', color: 'var(--acc)', fontFamily: 'inherit', fontSize: 13, cursor: 'pointer' }}>Upload CSV →</button>
                        </div>
                      : <canvas ref={chartRef}/>
                    }
                  </div>
                </div>
              )}

              {/* Margins */}
              {openWidget.type === 'margins' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 12, marginBottom: 24 }}>
                    {[{ label: 'Avg margin', value: `${avgMargin}%`, color: avgMargin > 20 ? '#22c55e' : '#f48080' }, { label: 'High margin (>25%)', value: highMargin, color: '#22c55e' }, { label: 'Low margin (<15%)', value: lowMargin, color: '#f48080' }].map((s, i) => (
                      <div key={i} style={{ padding: '16px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--bg)' }}>
                        <div style={{ fontFamily: 'var(--font-sora)', fontSize: 22, fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.value}</div>
                        <div style={{ fontSize: 12, color: 'var(--tx3)' }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ position: 'relative', height: 220 }}>
                    {uploads.length === 0
                      ? <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'var(--tx3)' }}>Upload data to see margin distribution</div>
                      : <canvas ref={chart2Ref}/>
                    }
                  </div>
                  {avgMargin < 20 && (
                    <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 12, background: 'rgba(244,128,128,.07)', border: '1px solid rgba(244,128,128,.2)', fontSize: 13, color: 'var(--tx)' }}>
                      ⚠ Average margin below 20% — consider reviewing pricing or supplier costs.
                    </div>
                  )}
                </div>
              )}

              {/* Stock */}
              {openWidget.type === 'stock' && (
                <div>
                  <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                    {[{ label: 'Critical (< 5)',  value: stockItems.filter(s => s.qty < 5).length,  color: '#f48080' }, { label: 'Low (< 10)',    value: stockItems.filter(s => s.low).length,      color: '#f5c55a' }, { label: 'OK',          value: stockItems.filter(s => !s.low).length,     color: '#22c55e' }].map((s, i) => (
                      <div key={i} style={{ flex: 1, minWidth: 100, padding: '14px 16px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--bg)', textAlign: 'center' }}>
                        <div style={{ fontFamily: 'var(--font-sora)', fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 3 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                  {stockItems.length > 0 ? (
                    <div>
                      {stockItems.map((s, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 12, border: `1px solid ${s.low ? 'rgba(244,128,128,.2)' : 'var(--b)'}`, background: s.low ? 'rgba(244,128,128,.04)' : 'var(--bg)', marginBottom: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.qty < 5 ? '#f48080' : s.low ? '#f5c55a' : '#22c55e', flexShrink: 0 }}/>
                          <div style={{ flex: 1, fontSize: 13 }}>{s.name}</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: s.qty < 5 ? '#f48080' : s.low ? '#f5c55a' : '#22c55e' }}>{s.qty} units</div>
                          {s.low && <div style={{ fontSize: 11, color: '#f48080', fontWeight: 500 }}>Restock soon</div>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--tx3)', fontSize: 14 }}>
                      Upload a file with stock/quantity columns to monitor inventory
                    </div>
                  )}
                </div>
              )}

              {/* Products */}
              {openWidget.type === 'products' && (
                <div>
                  <div style={{ position: 'relative', height: 220, marginBottom: 20 }}>
                    {uploads.length === 0
                      ? <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'var(--tx3)' }}>Upload data to see top products</div>
                      : <canvas ref={chartRef}/>
                    }
                  </div>
                  {products.slice(0, 6).map((p, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 5 ? '1px solid var(--b)' : 'none' }}>
                      <div style={{ width: 24, height: 24, borderRadius: 8, background: i === 0 ? 'var(--acc)' : 'var(--ev)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: i === 0 ? '#fff' : 'var(--tx2)', flexShrink: 0 }}>
                        {i + 1}
                      </div>
                      <div style={{ flex: 1, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#8c6fe0' }}>{currency} {p.value.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Insights */}
              {openWidget.type === 'insights' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, fontSize: 12, color: '#22c55e' }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 2s infinite' }}/>
                    AskBiz is watching your data live
                  </div>
                  {insights.map(ins => (
                    <div key={ins.id} onClick={() => handleInsightAction(ins.action)}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 14, border: `1px solid ${URGENCY_BORDER[ins.urgency]}`, background: URGENCY_BG[ins.urgency], marginBottom: 10, cursor: 'pointer', transition: 'transform 150ms' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateX(3px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                      <div style={{ fontSize: 22 }}>{ins.type === 'alert' ? '⚠️' : ins.type === 'win' ? '🎯' : ins.type === 'trend' ? '📈' : '💡'}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, color: 'var(--tx)', lineHeight: 1.5 }}>{ins.message}</div>
                      </div>
                      <div style={{ fontSize: 12, color: URGENCY_COLOR[ins.urgency], fontWeight: 600, flexShrink: 0, whiteSpace: 'nowrap' }}>{ins.action} →</div>
                    </div>
                  ))}
                  <button onClick={() => router.push('/ask')} style={{ width: '100%', marginTop: 8, padding: '12px', borderRadius: 12, border: 'none', background: 'var(--acc)', color: '#fff', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                    Ask AskBiz a question →
                  </button>
                </div>
              )}

              {/* Quick Actions */}
              {openWidget.type === 'actions' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 10 }}>
                    {quickActions.map((a, i) => (
                      <button key={i} onClick={() => { setOpenWidget(null); router.push(a.href) }}
                        style={{ padding: '16px 18px', borderRadius: 14, border: '1px solid var(--b)', background: 'var(--bg)', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 150ms', textAlign: 'left' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(208,138,89,.35)'; e.currentTarget.style.background = 'rgba(208,138,89,.04)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--b)'; e.currentTarget.style.background = 'var(--bg)' }}>
                        <span style={{ fontSize: 22 }}>{a.icon}</span>
                        <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--tx)' }}>{a.label}</span>
                        <span style={{ marginLeft: 'auto', color: 'var(--tx3)', fontSize: 13 }}>→</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  )
}
