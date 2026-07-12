'use client'
import { useState, useRef, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useLang } from '@/components/LanguageProvider'

interface HealthComponent {
  name: string
  score: number
  label: string
  status: 'good' | 'warning' | 'critical'
  detail: string
}

interface HistoryPoint {
  score: number
  recorded_at?: string
  created_at?: string
  label?: string
  color?: string
  components?: HealthComponent[]
  summary?: string
}

interface MiniTrendChartProps {
  history: HistoryPoint[]
  label?: string
  height?: number
  onAsk?: (prompt: string) => void
  forceExpanded?: boolean
  onClose?: () => void
}

/* ── Sector-aware component name mapping ── */
type Sector = 'retail' | 'kitchen' | 'repair' | 'salon' | 'factory' | 'logistics' | 'ecommerce' | 'default'

function detectSectorType(bt: string): Sector {
  const t = (bt || '').toLowerCase()
  if (['restaurant','cafe','café','bar','pub','takeaway','food','catering','bistro','diner','bakery','kitchen'].some(k => t.includes(k))) return 'kitchen'
  if (['repair','phone','mobile','electronic','watch','laptop','computer'].some(k => t.includes(k))) return 'repair'
  if (['salon','barber','barbershop','spa','beauty','clinic','nail'].some(k => t.includes(k))) return 'salon'
  if (['factory','manufactur','production','warehouse','processing','packaging'].some(k => t.includes(k))) return 'factory'
  if (['logistics','courier','delivery','shipping','transport','freight'].some(k => t.includes(k))) return 'logistics'
  if (['ecommerce','e-commerce','online','shopify','woocommerce','amazon','etsy','dropship'].some(k => t.includes(k))) return 'ecommerce'
  if (['retail','shop','store','supermarket','boutique','pharmacy','hardware'].some(k => t.includes(k))) return 'retail'
  return 'default'
}

const SECTOR_NAMES: Record<Sector, Record<string, { name: string; icon: string; drillPrompt: string }>> = {
  retail: {
    'Margin Health': { name: 'Product Margins', icon: '💰', drillPrompt: 'Analyse my retail product margins — which categories have the best and worst margins? What pricing changes would improve profitability?' },
    'Revenue Trend': { name: 'Sales Trend', icon: '📈', drillPrompt: 'Break down my retail sales trend — which days, categories and products are driving growth or decline?' },
    'Stock Position': { name: 'Shelf Stock', icon: '📦', drillPrompt: 'Analyse my shelf stock levels — which products are overstocked, understocked, or have dead stock? What should I reorder?' },
    'Cash Flow': { name: 'Cash Position', icon: '🏦', drillPrompt: 'Analyse my retail cash flow — am I collecting fast enough? What is my cash conversion cycle?' },
    'Product Mix': { name: 'Category Mix', icon: '🏷️', drillPrompt: 'Analyse my product category mix — am I too dependent on one category? What should I diversify into?' },
  },
  kitchen: {
    'Margin Health': { name: 'Food Cost', icon: '🍽️', drillPrompt: 'Analyse my food costs — which menu items have the best and worst margins? What should I reprice or remove?' },
    'Revenue Trend': { name: 'Covers Trend', icon: '📈', drillPrompt: 'Analyse my covers and revenue trend — which days and meal periods are performing best? Where are we losing customers?' },
    'Stock Position': { name: 'Pantry Stock', icon: '🥫', drillPrompt: 'Analyse my kitchen stock — what ingredients are running low? What food waste am I seeing? What should I order?' },
    'Cash Flow': { name: 'Cash Flow', icon: '💵', drillPrompt: 'Analyse my restaurant cash flow — how is daily cash collection? Am I covering fixed costs each week?' },
    'Product Mix': { name: 'Menu Mix', icon: '📋', drillPrompt: 'Analyse my menu mix — which items are stars (high profit, high volume)? Which are dogs? What should I promote or cut?' },
  },
  repair: {
    'Margin Health': { name: 'Repair Margins', icon: '🔧', drillPrompt: 'Analyse my repair service margins — which repair types are most profitable? Where am I undercharging?' },
    'Revenue Trend': { name: 'Jobs Trend', icon: '📈', drillPrompt: 'Analyse my repair job trends — are bookings increasing or decreasing? What repair types are growing?' },
    'Stock Position': { name: 'Parts Stock', icon: '⚙️', drillPrompt: 'Analyse my parts inventory — which parts am I running low on? What parts have slow turnover?' },
    'Cash Flow': { name: 'Cash Position', icon: '💵', drillPrompt: 'Analyse my repair shop cash flow — are customers paying on time? How is my receivables position?' },
    'Product Mix': { name: 'Service Mix', icon: '🛠️', drillPrompt: 'Analyse my repair service mix — am I too dependent on one repair type? What services should I add?' },
  },
  salon: {
    'Margin Health': { name: 'Service Margins', icon: '💅', drillPrompt: 'Analyse my salon service margins — which services are most profitable per hour? Where should I adjust pricing?' },
    'Revenue Trend': { name: 'Bookings Trend', icon: '📈', drillPrompt: 'Analyse my salon booking trends — which days are busiest? Are repeat bookings increasing?' },
    'Stock Position': { name: 'Product Stock', icon: '🧴', drillPrompt: 'Analyse my salon product stock — which products are running low? What retail items should I reorder?' },
    'Cash Flow': { name: 'Cash Position', icon: '💵', drillPrompt: 'Analyse my salon cash flow — how are daily takings? Am I covering chair rent and overheads?' },
    'Product Mix': { name: 'Service Mix', icon: '✂️', drillPrompt: 'Analyse my service mix — am I too dependent on cuts vs colour vs treatments? What should I promote?' },
  },
  factory: {
    'Margin Health': { name: 'Unit Margins', icon: '🏭', drillPrompt: 'Analyse my manufacturing margins — which product lines have the best and worst unit economics?' },
    'Revenue Trend': { name: 'Output Trend', icon: '📈', drillPrompt: 'Analyse my production output trend — is throughput increasing? Where are bottlenecks?' },
    'Stock Position': { name: 'Raw Materials', icon: '📦', drillPrompt: 'Analyse my raw material stock — what materials need reordering? What is sitting idle?' },
    'Cash Flow': { name: 'Cash Cycle', icon: '💵', drillPrompt: 'Analyse my manufacturing cash cycle — how long from raw material purchase to customer payment?' },
    'Product Mix': { name: 'Product Lines', icon: '🔩', drillPrompt: 'Analyse my product line mix — which lines are most profitable? Should I consolidate or diversify?' },
  },
  logistics: {
    'Margin Health': { name: 'Route Margins', icon: '🚛', drillPrompt: 'Analyse my delivery route margins — which routes are profitable and which are loss-making?' },
    'Revenue Trend': { name: 'Delivery Volume', icon: '📈', drillPrompt: 'Analyse my delivery volume trend — are shipments increasing? What customer segments are growing?' },
    'Stock Position': { name: 'Fleet Status', icon: '🚐', drillPrompt: 'Analyse my fleet utilization — which vehicles are underutilized? What is my maintenance schedule?' },
    'Cash Flow': { name: 'Cash Position', icon: '💵', drillPrompt: 'Analyse my logistics cash flow — are clients paying on time? What is my fuel cost trend?' },
    'Product Mix': { name: 'Service Mix', icon: '📋', drillPrompt: 'Analyse my service type mix — express vs standard vs bulk. Which is most profitable per km?' },
  },
  ecommerce: {
    'Margin Health': { name: 'Gross Margins', icon: '🛒', drillPrompt: 'Analyse my ecommerce margins — which products have the best margins after shipping and fees?' },
    'Revenue Trend': { name: 'Orders Trend', icon: '📈', drillPrompt: 'Analyse my order trends — which channels (Shopify, Amazon, etc.) are growing? What is my conversion rate trend?' },
    'Stock Position': { name: 'Inventory Levels', icon: '📦', drillPrompt: 'Analyse my ecommerce inventory — what is running low? What slow-moving stock should I discount?' },
    'Cash Flow': { name: 'Cash Position', icon: '💵', drillPrompt: 'Analyse my ecommerce cash flow — how long until platform payouts? Am I cash positive after ad spend?' },
    'Product Mix': { name: 'SKU Mix', icon: '🏷️', drillPrompt: 'Analyse my SKU mix — am I too dependent on hero products? What should I add to my catalogue?' },
  },
  default: {
    'Margin Health': { name: 'Margin Health', icon: '💰', drillPrompt: 'Analyse my profit margins in detail — what is driving margin up or down? How can I improve?' },
    'Revenue Trend': { name: 'Revenue Trend', icon: '📈', drillPrompt: 'Break down my revenue trend — what is driving growth or decline? What should I focus on?' },
    'Stock Position': { name: 'Stock Position', icon: '📦', drillPrompt: 'Analyse my stock levels — what needs reordering? What has slow turnover?' },
    'Cash Flow': { name: 'Cash Flow', icon: '💵', drillPrompt: 'Analyse my cash flow — am I cash positive? Where is cash getting stuck?' },
    'Product Mix': { name: 'Product Mix', icon: '🏷️', drillPrompt: 'Analyse my product/service mix — am I too concentrated? What should I diversify into?' },
  },
}

function barColor(score: number) {
  if (score >= 65) return '#22C55E'
  if (score >= 45) return '#F59E0B'
  return '#EF4444'
}

function statusDot(status: string) {
  if (status === 'good') return '#22C55E'
  if (status === 'warning') return '#F59E0B'
  return '#EF4444'
}

function formatDate(h: HistoryPoint) {
  const d = h.recorded_at || h.created_at
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function formatDateLong(h: HistoryPoint) {
  const d = h.recorded_at || h.created_at
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

/* ── Component drill-down details ── */
function getComponentAnalysis(comp: HealthComponent, sector: Sector): { tips: string[]; benchmark: string; action: string } {
  const s = comp.score
  const name = comp.name

  if (name === 'Margin Health') {
    if (s >= 16) return { tips: ['Margins are strong — protect pricing power', 'Look for premium upsell opportunities', 'Monitor supplier costs for any increases'], benchmark: 'Top 20% of businesses in your category', action: 'Focus on maintaining margins while growing volume' }
    if (s >= 10) return { tips: ['Margins are stable but could improve', 'Review your top 5 cost items for savings', 'Consider bundling low-margin items with high-margin ones'], benchmark: 'Average for your category', action: 'Target 3-5% margin improvement this quarter' }
    return { tips: ['Margins need urgent attention', 'Audit all supplier contracts for better rates', 'Consider discontinuing items with negative margin', 'Review pricing — are you matching competitors too aggressively?'], benchmark: 'Below average — action needed', action: 'Immediate pricing and cost review' }
  }
  if (name === 'Revenue Trend') {
    if (s >= 16) return { tips: ['Revenue is growing strongly', 'Double down on what is working', 'Consider expanding capacity or range'], benchmark: 'Top quartile growth', action: 'Prepare for scaling — check stock and staffing capacity' }
    if (s >= 10) return { tips: ['Revenue is stable or growing modestly', 'Look for untapped customer segments', 'Consider promotions to drive volume'], benchmark: 'Stable, room to grow', action: 'Launch a targeted promotion this week' }
    return { tips: ['Revenue is declining — needs attention', 'Check if a competitor has entered your market', 'Survey recent customers to understand drop-off', 'Review your marketing and visibility'], benchmark: 'Below target — act now', action: 'Urgently diagnose the cause and test a fix this week' }
  }
  if (name === 'Stock Position') {
    if (s >= 16) return { tips: ['Stock levels are well-balanced', 'Good turnover rate — minimal waste', 'Continue monitoring reorder points'], benchmark: 'Well-managed inventory', action: 'Optimise further with demand forecasting' }
    if (s >= 10) return { tips: ['Some stock items need attention', 'Review items approaching low thresholds', 'Check for slow-moving items tying up cash'], benchmark: 'Adequate but needs monitoring', action: 'Reorder critical items and review slow movers' }
    return { tips: ['Stock is a serious concern', 'Out-of-stock items mean lost sales', 'Overstocked items are wasting cash', 'Set up automated reorder alerts'], benchmark: 'Stock management needs overhaul', action: 'Emergency stock audit and reorder critical items today' }
  }
  if (name === 'Cash Flow') {
    if (s >= 16) return { tips: ['Cash position is healthy', 'Good cash reserves for opportunities', 'Consider investing surplus wisely'], benchmark: 'Strong liquidity position', action: 'Explore growth investments with surplus cash' }
    if (s >= 10) return { tips: ['Cash flow is adequate but tight', 'Accelerate receivables collection', 'Negotiate longer payment terms with suppliers'], benchmark: 'Manageable but watch closely', action: 'Chase any overdue payments this week' }
    return { tips: ['Cash flow is critical', 'Risk of not meeting obligations', 'Immediately chase all outstanding payments', 'Defer non-essential purchases'], benchmark: 'Danger zone — act immediately', action: 'Emergency cash conservation — collect receivables NOW' }
  }
  // Product Mix
  if (s >= 16) return { tips: ['Well-diversified product/service mix', 'No single item dominates dangerously', 'Healthy spread of revenue sources'], benchmark: 'Low concentration risk', action: 'Continue growing new product lines' }
  if (s >= 10) return { tips: ['Moderate concentration in a few items', 'Consider adding complementary products', 'Test new offerings with low risk'], benchmark: 'Some concentration risk', action: 'Add 2-3 new products this month to diversify' }
  return { tips: ['Very concentrated — high risk', 'Too dependent on 1-2 items', 'If a key item fails, revenue collapses', 'Urgently diversify your offering'], benchmark: 'High concentration risk', action: 'Diversify urgently — single point of failure' }
}

export default function MiniTrendChart({ history, label = 'Health Trend', height = 120, onAsk, forceExpanded, onClose }: MiniTrendChartProps) {
  const { tc } = useLang()
  const [expanded, setExpanded] = useState(false)

  // Allow parent to force-open the modal
  useEffect(() => {
    if (forceExpanded) setExpanded(true)
  }, [forceExpanded])
  const [hovered, setHovered] = useState<number | null>(null)
  const [selectedBar, setSelectedBar] = useState<number | null>(null)
  const [drilledComponent, setDrilledComponent] = useState<string | null>(null)
  const [sector, setSector] = useState<Sector>('default')
  const svgRef = useRef<SVGSVGElement>(null)

  // Detect sector from profile
  useEffect(() => {
    const sb = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    sb.auth.getUser().then(({ data }) => {
      if (!data.user) return
      sb.from('profiles').select('business_type').eq('id', data.user.id).single()
        .then(({ data: profile }) => {
          if (profile?.business_type) {
            setSector(detectSectorType(profile.business_type))
          }
        })
    })
  }, [])

  const items = history.slice(-30)
  if (items.length < 2) return null

  const scores = items.map(h => Number(h.score) || 0)
  const firstScore = scores[0]
  const lastScore = scores[scores.length - 1]
  const delta = lastScore - firstScore
  const deltaLabel = `${delta >= 0 ? '+' : ''}${delta.toFixed(0)} pts`
  const deltaColor = delta >= 0 ? '#22C55E' : '#EF4444'

  const W = 300, H = 100, padL = 0, padR = 0, padT = 6, padB = 2
  const chartW = W - padL - padR, chartH = H - padT - padB

  function toX(i: number) { return padL + (i / (items.length - 1)) * chartW }
  function toY(v: number) { return padT + chartH - ((v / 100)) * chartH }

  const linePts = items.map((_, i) => `${toX(i).toFixed(1)},${toY(scores[i]).toFixed(1)}`).join(' ')
  const areaPath = `M${toX(0)},${toY(scores[0])} ` +
    items.map((_, i) => `L${toX(i)},${toY(scores[i])}`).join(' ') +
    ` L${toX(items.length - 1)},${H} L${toX(0)},${H} Z`

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * W
    const idx = Math.round(((x - padL) / chartW) * (items.length - 1))
    setHovered(Math.max(0, Math.min(items.length - 1, idx)))
  }

  const selectedItem = selectedBar !== null ? items[selectedBar] : null
  const selectedScore = selectedBar !== null ? scores[selectedBar] : 0
  const prevScore = selectedBar !== null && selectedBar > 0 ? scores[selectedBar - 1] : null
  const dayDelta = prevScore !== null ? selectedScore - prevScore : null

  function getSectorName(compName: string) {
    return SECTOR_NAMES[sector]?.[compName] || SECTOR_NAMES['default'][compName] || { name: compName, icon: '📊', drillPrompt: `Analyse my ${compName.toLowerCase()} in detail` }
  }

  function getComponentChanges(current: HealthComponent[], prevIdx: number) {
    const prevItem = prevIdx >= 0 ? items[prevIdx] : null
    const prevComps = prevItem?.components || []
    return current.map(c => {
      const prev = prevComps.find(p => p.name === c.name)
      return { name: c.name, current: c.score, prev: prev?.score ?? c.score, change: prev ? c.score - prev.score : 0 }
    })
  }

  return (
    <>
      <div
        onClick={() => setExpanded(true)}
        style={{
          padding: '16px 18px 14px', borderRadius: 16, border: '1px solid var(--b)',
          background: 'linear-gradient(180deg, var(--sf) 0%, rgba(99,102,241,.02) 100%)',
          cursor: 'pointer', transition: 'box-shadow 200ms, border-color 200ms', userSelect: 'none',
        }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#6366F130' }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--b)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em' }}>{label}</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: deltaColor, background: delta >= 0 ? 'rgba(34,197,94,.1)' : 'rgba(239,68,68,.1)', borderRadius: 6, padding: '2px 7px' }}>
            {delta >= 0 ? '↑' : '↓'} {deltaLabel}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: barColor(lastScore), fontFamily: 'var(--font-sora, inherit)', lineHeight: 1 }}>{lastScore}</span>
          <span style={{ fontSize: 9, color: 'var(--tx3)' }}>{tc('intel_minitrend.perHundred')}</span>
        </div>
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', height: 'auto', maxHeight: height, overflow: 'visible' }} onMouseMove={handleMouseMove} onMouseLeave={() => setHovered(null)}>
          <rect x={padL} y={toY(100)} width={chartW} height={toY(65) - toY(100)} fill="rgba(34,197,94,.04)" />
          <rect x={padL} y={toY(65)} width={chartW} height={toY(45) - toY(65)} fill="rgba(245,158,11,.04)" />
          <rect x={padL} y={toY(45)} width={chartW} height={toY(0) - toY(45)} fill="rgba(239,68,68,.04)" />
          {[25, 50, 75].map(v => (<g key={v}><line x1={padL} y1={toY(v)} x2={W - padR} y2={toY(v)} stroke="var(--b)" strokeWidth="0.5" strokeDasharray="3,3" /><text x={padL + 2} y={toY(v) - 3} fontSize="7" fill="var(--tx3)" opacity="0.6">{v}</text></g>))}
          <defs><linearGradient id="trendAreaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={barColor(lastScore)} stopOpacity="0.20" /><stop offset="100%" stopColor={barColor(lastScore)} stopOpacity="0.02" /></linearGradient></defs>
          <path d={areaPath} fill="url(#trendAreaGrad)" />
          <polyline points={linePts} fill="none" stroke={barColor(lastScore)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {items.map((h, i) => {
            const show = i === items.length - 1 || i === 0 || hovered === i
            if (!show) return null
            const sc = scores[i]
            return (<g key={i}><circle cx={toX(i)} cy={toY(sc)} r={hovered === i ? 4 : 3} fill={barColor(sc)} stroke="var(--sf)" strokeWidth="1.5" />{hovered === i && (<g><line x1={toX(i)} y1={padT} x2={toX(i)} y2={H - padB} stroke={barColor(sc)} strokeWidth="0.5" strokeDasharray="2,2" opacity="0.4" /><rect x={toX(i) - 22} y={toY(sc) - 20} width="44" height="16" rx="4" fill="var(--tx)" /><text x={toX(i)} y={toY(sc) - 9} textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--sf)">{sc}</text></g>)}</g>)
          })}
          <circle cx={toX(items.length - 1)} cy={toY(lastScore)} r="6" fill={barColor(lastScore)} opacity="0.15" />
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 9, color: 'var(--tx3)', opacity: 0.7 }}><span>{tc('intel_minitrend.thirtyDaysAgo')}</span><span>{tc('intel_minitrend.today')}</span></div>
        <div style={{ display: 'flex', gap: 10, marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--b)' }}>
          {([['#22C55E', tc('intel_minitrend.legendHealthy')], ['#F59E0B', tc('intel_minitrend.legendWatch')], ['#EF4444', tc('intel_minitrend.legendRisk')]] as [string, string][]).map(([c, l]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 9, color: 'var(--tx3)' }}><div style={{ width: 6, height: 6, borderRadius: 1, background: c }} />{l}</div>
          ))}
        </div>
      </div>

      {/* ── Expanded modal ── */}
      {expanded && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={() => { setExpanded(false); setSelectedBar(null); setDrilledComponent(null); onClose?.() }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--sf)', borderRadius: 20, padding: '24px 28px', width: '100%', maxWidth: 700, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-sora)', fontSize: 13, fontWeight: 700, color: 'var(--tx)' }}>{label}</div>
                <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 2 }}>
                  {tc('intel_minitrend.scoreLabel')} <strong style={{ color: barColor(lastScore) }}>{lastScore}{tc('intel_minitrend.perHundred')}</strong> · <span style={{ color: deltaColor }}>{deltaLabel} {tc('intel_minitrend.vsThirtyDays')}</span>
                </div>
              </div>
              <button onClick={() => { setExpanded(false); setSelectedBar(null); setDrilledComponent(null); onClose?.() }} style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid var(--b)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tx3)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {selectedBar === null && (
              <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(99,102,241,.06)', border: '1px solid rgba(99,102,241,.12)', marginBottom: 14, fontSize: 9, color: '#6366F1', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                {tc('intel_minitrend.clickBarHint')}
              </div>
            )}

            {/* Bar chart */}
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 140 }}>
                {items.map((h, i) => {
                  const sc = Number(h.score) || 0
                  const pct = sc / 100
                  const ht = Math.max(8, pct * 132 + 8)
                  const isHov = hovered === i
                  const isSel = selectedBar === i
                  return (
                    <div key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
                      onClick={() => { setSelectedBar(selectedBar === i ? null : i); setDrilledComponent(null) }}
                      style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', cursor: 'pointer' }}>
                      {isHov && !isSel && (
                        <div style={{ position: 'absolute', bottom: ht + 8, left: '50%', transform: 'translateX(-50%)', background: 'var(--tx)', color: 'var(--sf)', borderRadius: 6, padding: '4px 8px', fontSize: 9, fontWeight: 600, whiteSpace: 'nowrap', zIndex: 10 }}>
                          {formatDate(h) && <span style={{ opacity: 0.65, marginRight: 4 }}>{formatDate(h)}</span>}{sc}
                        </div>
                      )}
                      {isSel && (
                        <div style={{ position: 'absolute', bottom: ht + 8, left: '50%', transform: 'translateX(-50%)', background: '#6366F1', color: '#fff', borderRadius: 6, padding: '4px 8px', fontSize: 9, fontWeight: 600, whiteSpace: 'nowrap', zIndex: 10 }}>
                          {formatDate(h)} · {sc}
                        </div>
                      )}
                      <div style={{
                        width: '100%', height: ht,
                        background: isSel ? 'linear-gradient(180deg, #6366F1 0%, #6366F1aa 100%)' : `linear-gradient(180deg, ${barColor(sc)} 0%, ${barColor(sc)}88 100%)`,
                        borderRadius: '3px 3px 0 0', opacity: isSel ? 1 : isHov ? 1 : 0.75, transition: 'opacity 100ms, background 150ms',
                        minWidth: 4, boxShadow: isSel ? '0 0 12px rgba(99,102,241,0.4)' : isHov ? `0 0 8px ${barColor(sc)}40` : 'none',
                        border: isSel ? '2px solid #6366F1' : 'none', boxSizing: 'border-box',
                      }} />
                    </div>
                  )
                })}
              </div>
              {[25, 50, 75].map(y => (
                <div key={y} style={{ position: 'absolute', left: 0, right: 0, bottom: (y / 100) * 140, borderTop: '1px dashed var(--b)', pointerEvents: 'none' }}>
                  <span style={{ position: 'absolute', right: '100%', paddingRight: 6, fontSize: 9, color: 'var(--tx3)', lineHeight: 1, marginTop: -5 }}>{y}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 9, color: 'var(--tx3)' }}><span>{tc('intel_minitrend.thirtyDaysAgo')}</span><span>{tc('intel_minitrend.today')}</span></div>

            {/* ── Selected day deep-dive ── */}
            {selectedItem && (
              <div style={{ marginTop: 16, animation: 'fadeIn 200ms ease' }}>
                <div style={{ padding: '16px', borderRadius: 14, border: '1px solid #6366F120', background: 'linear-gradient(180deg, rgba(99,102,241,.04) 0%, var(--sf) 100%)' }}>
                  {/* Day header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: barColor(selectedScore) }} />
                        {formatDateLong(selectedItem)}
                      </div>
                      {selectedItem.summary && <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 4, lineHeight: 1.5 }}>{selectedItem.summary}</div>}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: barColor(selectedScore), fontFamily: 'var(--font-sora, inherit)', lineHeight: 1 }}>{selectedScore}</div>
                      <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 2 }}>{tc('intel_minitrend.perHundred')}</div>
                    </div>
                  </div>

                  {dayDelta !== null && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, padding: '8px 12px', borderRadius: 8, background: dayDelta > 0 ? 'rgba(34,197,94,.06)' : dayDelta < 0 ? 'rgba(239,68,68,.06)' : 'var(--ev)' }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: dayDelta > 0 ? '#22C55E' : dayDelta < 0 ? '#EF4444' : 'var(--tx3)' }}>
                        {dayDelta > 0 ? '↑' : dayDelta < 0 ? '↓' : '→'} {dayDelta > 0 ? '+' : ''}{dayDelta} pts
                      </span>
                      <span style={{ fontSize: 9, color: 'var(--tx3)' }}>{tc('intel_minitrend.vsPreviousDay')} ({prevScore})</span>
                    </div>
                  )}

                  {/* Clickable component cards */}
                  {selectedItem.components && selectedItem.components.length > 0 ? (
                    <div>
                      <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>
                        {tc('intel_minitrend.clickComponentHint')}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {(() => {
                          const changes = getComponentChanges(selectedItem.components!, selectedBar! - 1)
                          return changes.map((comp, ci) => {
                            const orig = selectedItem.components![ci]
                            const sn = getSectorName(orig.name)
                            const isDrilled = drilledComponent === orig.name
                            const analysis = getComponentAnalysis(orig, sector)
                            return (
                              <div key={ci}>
                                <div
                                  onClick={() => setDrilledComponent(isDrilled ? null : orig.name)}
                                  style={{
                                    padding: '10px 12px', borderRadius: 10,
                                    border: isDrilled ? `1px solid ${statusDot(orig.status)}30` : '1px solid var(--b)',
                                    background: isDrilled ? `${statusDot(orig.status)}06` : 'var(--sf)',
                                    cursor: 'pointer', transition: 'all 150ms',
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                      <span style={{ fontSize: 14 }}>{sn.icon}</span>
                                      <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--tx)' }}>{sn.name}</span>
                                      <span style={{ fontSize: 9, color: 'var(--tx3)', background: 'var(--ev)', borderRadius: 4, padding: '1px 6px' }}>{orig.label}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                      <span style={{ fontSize: 14, fontWeight: 800, color: statusDot(orig.status) }}>{orig.score}</span>
                                      <span style={{ fontSize: 9, color: 'var(--tx3)' }}>{tc('intel_minitrend.perTwenty')}</span>
                                      {comp.change !== 0 && (
                                        <span style={{ fontSize: 9, fontWeight: 700, color: comp.change > 0 ? '#22C55E' : '#EF4444', background: comp.change > 0 ? 'rgba(34,197,94,.1)' : 'rgba(239,68,68,.1)', borderRadius: 4, padding: '1px 5px' }}>
                                          {comp.change > 0 ? '+' : ''}{comp.change}
                                        </span>
                                      )}
                                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2" strokeLinecap="round" style={{ transition: 'transform 200ms', transform: isDrilled ? 'rotate(90deg)' : 'rotate(0deg)', opacity: 0.5 }}><polyline points="9 18 15 12 9 6"/></svg>
                                    </div>
                                  </div>
                                  <div style={{ height: 6, background: 'var(--ev)', borderRadius: 3, overflow: 'hidden', marginBottom: 4 }}>
                                    <div style={{ height: '100%', width: `${(orig.score / 20) * 100}%`, background: `linear-gradient(90deg, ${statusDot(orig.status)}, ${statusDot(orig.status)}88)`, borderRadius: 3, transition: 'width 400ms ease' }} />
                                  </div>
                                  <div style={{ fontSize: 9, color: 'var(--tx3)', lineHeight: 1.4 }}>{orig.detail}</div>
                                </div>

                                {/* ── Component deep-dive panel ── */}
                                {isDrilled && (
                                  <div style={{ marginTop: 4, padding: '14px', borderRadius: 10, border: `1px solid ${statusDot(orig.status)}20`, background: `${statusDot(orig.status)}04`, animation: 'fadeIn 200ms ease' }}>
                                    {/* Benchmark */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, padding: '8px 10px', borderRadius: 8, background: 'var(--ev)' }}>
                                      <span style={{ fontSize: 12 }}>🎯</span>
                                      <div>
                                        <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{tc('intel_minitrend.benchmarkLabel')}</div>
                                        <div style={{ fontSize: 10, fontWeight: 600, color: statusDot(orig.status) }}>{analysis.benchmark}</div>
                                      </div>
                                    </div>

                                    {/* Score breakdown visual */}
                                    <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
                                      {Array.from({ length: 20 }).map((_, bi) => (
                                        <div key={bi} style={{
                                          flex: 1, height: 12, borderRadius: 2,
                                          background: bi < orig.score ? statusDot(orig.status) : 'var(--ev)',
                                          opacity: bi < orig.score ? (0.5 + (bi / 20) * 0.5) : 0.3,
                                          transition: 'all 300ms ease',
                                        }} />
                                      ))}
                                    </div>

                                    {/* Analysis tips */}
                                    <div style={{ marginBottom: 12 }}>
                                      <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>{tc('intel_minitrend.analysisLabel')}</div>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        {analysis.tips.map((tip, ti) => (
                                          <div key={ti} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 10, color: 'var(--tx2)', lineHeight: 1.5 }}>
                                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: statusDot(orig.status), flexShrink: 0, marginTop: 6 }} />
                                            {tip}
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Recommended action */}
                                    <div style={{ padding: '10px 12px', borderRadius: 8, background: `${statusDot(orig.status)}10`, border: `1px dashed ${statusDot(orig.status)}30`, marginBottom: 12 }}>
                                      <div style={{ fontSize: 9, fontWeight: 700, color: statusDot(orig.status), textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>{tc('intel_minitrend.recommendedAction')}</div>
                                      <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx)', lineHeight: 1.4 }}>{analysis.action}</div>
                                    </div>

                                    {/* Ask AI button */}
                                    {onAsk && (
                                      <button
                                        onClick={(e) => { e.stopPropagation(); onAsk(sn.drillPrompt) }}
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${statusDot(orig.status)}30`, background: `${statusDot(orig.status)}08`, color: statusDot(orig.status), fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                                      >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                        {tc('intel_minitrend.askAiButton', { name: sn.name.toLowerCase() })}
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            )
                          })
                        })()}
                      </div>

                      <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 8, background: 'var(--ev)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)' }}>{tc('intel_minitrend.totalComponentScore')}</span>
                        <span style={{ fontSize: 12, fontWeight: 800, color: barColor(selectedScore) }}>{selectedItem.components.reduce((s, c) => s + c.score, 0)}/100</span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: '20px 16px', borderRadius: 10, background: 'var(--ev)', textAlign: 'center' }}>
                      <div style={{ fontSize: 18, marginBottom: 6 }}>📊</div>
                      <div style={{ fontSize: 10, color: 'var(--tx3)', lineHeight: 1.5 }}>{tc('intel_minitrend.noBreakdownTitle')}<br/>{tc('intel_minitrend.noBreakdownBody')}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 16, marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--b)' }}>
              {([['#22C55E', tc('intel_minitrend.modalLegendHealthy')], ['#F59E0B', tc('intel_minitrend.modalLegendWatch')], ['#EF4444', tc('intel_minitrend.modalLegendAtRisk')]] as [string, string][]).map(([col, lbl]) => (
                <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, color: 'var(--tx3)' }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: col }} />{lbl}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </>
  )
}
