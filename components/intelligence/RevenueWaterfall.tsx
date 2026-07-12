'use client'
import { useState, useEffect } from 'react'
import { detectGeoFromTimezone } from '@/lib/geo'
import { useLang } from '@/components/LanguageProvider'

interface WaterfallBar {
  label: string
  value: number
  type: 'positive' | 'negative' | 'total'
  detail?: string
  key: string
}

interface RevenueWaterfallProps {
  health: {
    components?: Array<{ name: string; score: number; label: string; detail?: string }>
    summary?: string
  } | null
  onAsk: (prompt: string) => void
  onDrillChange?: (drillKey: string | null) => void
}

interface PosMetrics {
  totalRevenue: number
  totalCost: number
  grossProfit: number
  grossMargin: number
  avgSale: number
  txnCount: number
  topItems: Array<{ name: string; revenue: number; cost: number; qty: number }>
  inventoryValue: number
  sym: string
}

const COLORS = {
  positive: '#22C55E',
  negative: '#EF4444',
  total:    '#6366F1',
}

function buildDrillPrompts(tc: (key: string) => string): Record<string, string> {
  return {
    Revenue: tc('intel_revwaterfall.drillPromptRevenue'),
    COGS: tc('intel_revwaterfall.drillPromptCogs'),
    'Gross Profit': tc('intel_revwaterfall.drillPromptGrossProfit'),
    Operating: tc('intel_revwaterfall.drillPromptOperating'),
    'Stock Cost': tc('intel_revwaterfall.drillPromptStockCost'),
    'Net Margin': tc('intel_revwaterfall.drillPromptNetMargin'),
  }
}

export default function RevenueWaterfall({ health, onAsk, onDrillChange }: RevenueWaterfallProps) {
  const { tc } = useLang()
  const [expanded, setExpanded] = useState(false)
  const [hovered, setHovered] = useState<number | null>(null)
  const [drillItem, setDrillItem] = useState<string | null>(null)
  const [posMetrics, setPosMetrics] = useState<PosMetrics | null>(null)
  const [loadingMetrics, setLoadingMetrics] = useState(false)

  const DRILL_PROMPTS = buildDrillPrompts(tc)

  // Notify parent of drill state changes
  useEffect(() => {
    onDrillChange?.(expanded ? drillItem : null)
  }, [drillItem, expanded])

  // Fetch real POS data when expanded
  useEffect(() => {
    if (!expanded || posMetrics) return
    setLoadingMetrics(true)
    const geo = detectGeoFromTimezone()
    const now = new Date()
    const from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30).toISOString()

    Promise.all([
      fetch(`/api/pos/transactions?from=${from}&limit=1000`).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('/api/pos/inventory').then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([txData, invData]) => {
      const txns = txData?.transactions || (Array.isArray(txData) ? txData : [])
      const inv = invData?.inventory || (Array.isArray(invData) ? invData : [])

      const itemMap: Record<string, { revenue: number; cost: number; qty: number }> = {}
      let totalRev = 0, totalCost = 0

      for (const tx of txns) {
        if (tx.status === 'refunded') continue
        const items = tx.pos_items || tx.items || []
        for (const it of items) {
          const qty = Number(it.qty) || 0
          const price = Number(it.unit_price) || 0
          const cost = Number(it.cost_price) || 0
          const name = it.name || 'Unknown'
          totalRev += qty * price
          totalCost += qty * cost
          if (!itemMap[name]) itemMap[name] = { revenue: 0, cost: 0, qty: 0 }
          itemMap[name].revenue += qty * price
          itemMap[name].cost += qty * cost
          itemMap[name].qty += qty
        }
      }

      const topItems = Object.entries(itemMap)
        .map(([name, d]) => ({ name, ...d }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 8)

      const inventoryValue = inv.reduce((s: number, p: any) => s + (Number(p.cost_price) || 0) * (Number(p.stock_qty) || 0), 0)

      setPosMetrics({
        totalRevenue: totalRev,
        totalCost,
        grossProfit: totalRev - totalCost,
        grossMargin: totalRev > 0 ? ((totalRev - totalCost) / totalRev) * 100 : 0,
        avgSale: txns.length > 0 ? totalRev / txns.length : 0,
        txnCount: txns.length,
        topItems,
        inventoryValue,
        sym: geo.symbol,
      })
    }).finally(() => setLoadingMetrics(false))
  }, [expanded, posMetrics])

  const components = health?.components || []
  const profitability = components.find(c => c.name?.toLowerCase().includes('profit'))
  const liquidity     = components.find(c => c.name?.toLowerCase().includes('liquid') || c.name?.toLowerCase().includes('cash'))
  const growth        = components.find(c => c.name?.toLowerCase().includes('growth'))
  const inventory     = components.find(c => c.name?.toLowerCase().includes('inventor'))
  const risk          = components.find(c => c.name?.toLowerCase().includes('risk'))

  const hasData = components.length > 0

  const bars: WaterfallBar[] = hasData ? [
    { label: tc('intel_revwaterfall.barLabelRevenue'), value: 100, type: 'positive', detail: growth ? tc('intel_revwaterfall.barDetailGrowthSignal').replace('{label}', growth.label) : tc('intel_revwaterfall.barDetailGrossRevenueBaseline'), key: 'Revenue' },
    { label: tc('intel_revwaterfall.barLabelCogs'), value: profitability ? -(100 - profitability.score * 5) / 2 : -40, type: 'negative', detail: profitability ? tc('intel_revwaterfall.barDetailMarginSignal').replace('{label}', profitability.label) : tc('intel_revwaterfall.barDetailCostOfGoods'), key: 'COGS' },
    { label: tc('intel_revwaterfall.barLabelGrossProfit'), value: profitability ? profitability.score * 5 : 60, type: 'total', detail: tc('intel_revwaterfall.barDetailGrossMarginPct').replace('{pct}', profitability ? (profitability.score * 5).toFixed(0) : '60'), key: 'Gross Profit' },
    { label: tc('intel_revwaterfall.barLabelOperating'), value: risk ? -(risk.score < 10 ? 25 : 15) : -20, type: 'negative', detail: risk ? tc('intel_revwaterfall.barDetailRiskSignal').replace('{label}', risk.label) : tc('intel_revwaterfall.barDetailOperatingExpenses'), key: 'Operating' },
    { label: tc('intel_revwaterfall.barLabelStockCost'), value: inventory ? -(20 - inventory.score) * 1.2 : -10, type: 'negative', detail: inventory ? tc('intel_revwaterfall.barDetailInventorySignal').replace('{label}', inventory.label) : tc('intel_revwaterfall.barDetailInventoryHolding'), key: 'Stock Cost' },
    { label: tc('intel_revwaterfall.barLabelNetMargin'), value: liquidity ? liquidity.score * 3 : 30, type: 'total', detail: liquidity ? tc('intel_revwaterfall.barDetailCashSignal').replace('{label}', liquidity.label) : tc('intel_revwaterfall.barDetailNetMarginEstimate'), key: 'Net Margin' },
  ] : []

  const maxAbs = bars.length > 0 ? Math.max(...bars.map(b => Math.abs(b.value))) : 100
  const netMargin = bars.find(b => b.key === 'Net Margin')
  const grossProfit = bars.find(b => b.key === 'Gross Profit')
  const netMarginVal = netMargin ? netMargin.value.toFixed(0) : '--'
  const grossProfitVal = grossProfit ? grossProfit.value.toFixed(0) : '--'

  const fmt = (v: number) => posMetrics ? `${posMetrics.sym}${v.toLocaleString('en', { maximumFractionDigits: 0 })}` : `${v.toFixed(0)}`

  function renderDrillDown(barKey: string) {
    if (!posMetrics) return loadingMetrics ? (
      <div style={{ padding: 16, textAlign: 'center', fontSize: 10, color: 'var(--tx3)' }}>{tc('intel_revwaterfall.loadingPos')}</div>
    ) : null

    const m = posMetrics
    const cardStyle: React.CSSProperties = { padding: '10px 14px', borderRadius: 10, background: 'var(--ev)', fontSize: 10 }
    const labelStyle: React.CSSProperties = { fontSize: 9, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4, fontWeight: 700 }
    const valStyle: React.CSSProperties = { fontSize: 16, fontWeight: 800, fontFamily: 'var(--font-sora, inherit)' }

    if (barKey === 'Revenue') return (
      <div style={{ animation: 'fadeIn 200ms ease' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
          <div style={cardStyle}><div style={labelStyle}>{tc('intel_revwaterfall.drillRevenueTotalRevenue')}</div><div style={{ ...valStyle, color: '#22C55E' }}>{fmt(m.totalRevenue)}</div></div>
          <div style={cardStyle}><div style={labelStyle}>{tc('intel_revwaterfall.drillRevenueTransactions')}</div><div style={{ ...valStyle, color: 'var(--tx)' }}>{m.txnCount}</div></div>
          <div style={cardStyle}><div style={labelStyle}>{tc('intel_revwaterfall.drillRevenueAvgSale')}</div><div style={{ ...valStyle, color: '#6366F1' }}>{fmt(m.avgSale)}</div></div>
        </div>
        <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>{tc('intel_revwaterfall.drillRevenueTopProducts')}</div>
        {m.topItems.slice(0, 5).map((it, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', borderBottom: '1px solid var(--b)' }}>
            <span style={{ width: 14, fontSize: 9, fontWeight: 700, color: i < 3 ? '#22C55E' : 'var(--tx3)', textAlign: 'right' }}>{i + 1}</span>
            <span style={{ flex: 1, fontSize: 9, color: 'var(--tx2)' }}>{it.name}</span>
            <span style={{ fontSize: 9, fontWeight: 600, color: '#22C55E' }}>{fmt(it.revenue)}</span>
          </div>
        ))}
      </div>
    )

    if (barKey === 'COGS') return (
      <div style={{ animation: 'fadeIn 200ms ease' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
          <div style={cardStyle}><div style={labelStyle}>{tc('intel_revwaterfall.drillCogsTotalCogs')}</div><div style={{ ...valStyle, color: '#EF4444' }}>{fmt(m.totalCost)}</div></div>
          <div style={cardStyle}><div style={labelStyle}>{tc('intel_revwaterfall.drillCogsCostRatio')}</div><div style={{ ...valStyle, color: m.totalRevenue > 0 ? (m.totalCost / m.totalRevenue > 0.5 ? '#EF4444' : '#F59E0B') : 'var(--tx)' }}>{m.totalRevenue > 0 ? (m.totalCost / m.totalRevenue * 100).toFixed(0) : 0}%</div></div>
          <div style={cardStyle}><div style={labelStyle}>{tc('intel_revwaterfall.drillCogsAvgCostPerSale')}</div><div style={{ ...valStyle, color: 'var(--tx)' }}>{fmt(m.txnCount > 0 ? m.totalCost / m.txnCount : 0)}</div></div>
        </div>
        <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>{tc('intel_revwaterfall.drillCogsHighestCost')}</div>
        {m.topItems.sort((a, b) => b.cost - a.cost).slice(0, 5).map((it, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', borderBottom: '1px solid var(--b)' }}>
            <span style={{ width: 14, fontSize: 9, fontWeight: 700, color: i < 3 ? '#EF4444' : 'var(--tx3)', textAlign: 'right' }}>{i + 1}</span>
            <span style={{ flex: 1, fontSize: 9, color: 'var(--tx2)' }}>{it.name}</span>
            <span style={{ fontSize: 9, fontWeight: 600, color: '#EF4444' }}>{fmt(it.cost)}</span>
            <span style={{ fontSize: 9, color: 'var(--tx3)' }}>{it.revenue > 0 ? (it.cost / it.revenue * 100).toFixed(0) : 0}{tc('intel_revwaterfall.drillCogsRatioSuffix')}</span>
          </div>
        ))}
      </div>
    )

    if (barKey === 'Gross Profit') return (
      <div style={{ animation: 'fadeIn 200ms ease' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
          <div style={cardStyle}><div style={labelStyle}>{tc('intel_revwaterfall.drillGrossProfitGrossProfit')}</div><div style={{ ...valStyle, color: '#22C55E' }}>{fmt(m.grossProfit)}</div></div>
          <div style={cardStyle}><div style={labelStyle}>{tc('intel_revwaterfall.drillGrossProfitGrossMargin')}</div><div style={{ ...valStyle, color: m.grossMargin >= 40 ? '#22C55E' : m.grossMargin >= 20 ? '#F59E0B' : '#EF4444' }}>{m.grossMargin.toFixed(1)}%</div></div>
          <div style={cardStyle}><div style={labelStyle}>{tc('intel_revwaterfall.drillGrossProfitRevenue')}</div><div style={{ ...valStyle, color: 'var(--tx)' }}>{fmt(m.totalRevenue)}</div></div>
        </div>
        <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>{tc('intel_revwaterfall.drillGrossProfitMarginByProduct')}</div>
        {[...m.topItems].sort((a, b) => {
          const mA = a.revenue > 0 ? (a.revenue - a.cost) / a.revenue : 0
          const mB = b.revenue > 0 ? (b.revenue - b.cost) / b.revenue : 0
          return mB - mA
        }).slice(0, 5).map((it, i) => {
          const margin = it.revenue > 0 ? ((it.revenue - it.cost) / it.revenue * 100) : 0
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', borderBottom: '1px solid var(--b)' }}>
              <span style={{ flex: 1, fontSize: 9, color: 'var(--tx2)' }}>{it.name}</span>
              <div style={{ width: 60, height: 6, background: 'var(--ev)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min(margin, 100)}%`, background: margin >= 40 ? '#22C55E' : margin >= 20 ? '#F59E0B' : '#EF4444', borderRadius: 3 }} />
              </div>
              <span style={{ fontSize: 9, fontWeight: 600, color: margin >= 40 ? '#22C55E' : margin >= 20 ? '#F59E0B' : '#EF4444', width: 35, textAlign: 'right' }}>{margin.toFixed(0)}%</span>
            </div>
          )
        })}
      </div>
    )

    if (barKey === 'Stock Cost') return (
      <div style={{ animation: 'fadeIn 200ms ease' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 12 }}>
          <div style={cardStyle}><div style={labelStyle}>{tc('intel_revwaterfall.drillStockInventoryValue')}</div><div style={{ ...valStyle, color: '#F59E0B' }}>{fmt(m.inventoryValue)}</div></div>
          <div style={cardStyle}><div style={labelStyle}>{tc('intel_revwaterfall.drillStockStockToRevenue')}</div><div style={{ ...valStyle, color: m.totalRevenue > 0 && m.inventoryValue / m.totalRevenue > 0.5 ? '#EF4444' : '#22C55E' }}>{m.totalRevenue > 0 ? (m.inventoryValue / m.totalRevenue * 100).toFixed(0) : 0}%</div></div>
        </div>
        <div style={{ fontSize: 9, color: 'var(--tx3)', lineHeight: 1.5 }}>
          {tc('intel_revwaterfall.drillStockHoldingNote')}
        </div>
      </div>
    )

    // Operating & Net Margin - show summary
    return (
      <div style={{ animation: 'fadeIn 200ms ease' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
          <div style={cardStyle}><div style={labelStyle}>{tc('intel_revwaterfall.drillSummaryRevenue')}</div><div style={{ ...valStyle, color: '#22C55E' }}>{fmt(m.totalRevenue)}</div></div>
          <div style={cardStyle}><div style={labelStyle}>{tc('intel_revwaterfall.drillSummaryTotalCosts')}</div><div style={{ ...valStyle, color: '#EF4444' }}>{fmt(m.totalCost)}</div></div>
          <div style={cardStyle}><div style={labelStyle}>{tc('intel_revwaterfall.drillSummaryNetProfit')}</div><div style={{ ...valStyle, color: m.grossProfit >= 0 ? '#6366F1' : '#EF4444' }}>{fmt(m.grossProfit)}</div></div>
        </div>
        <div style={{ fontSize: 9, color: 'var(--tx3)', lineHeight: 1.5 }}>
          {barKey === 'Operating' ? tc('intel_revwaterfall.drillOperatingNote') : tc('intel_revwaterfall.drillNetMarginNote').replace('{margin}', m.grossMargin.toFixed(0))}
        </div>
      </div>
    )
  }

  if (!hasData) {
    return (
      <div style={{ padding: '16px 18px', borderRadius: 16, border: '1px solid var(--b)', background: 'linear-gradient(180deg, var(--sf) 0%, rgba(99,102,241,.02) 100%)', fontSize: 11, color: 'var(--tx3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>{tc('intel_revwaterfall.uploadPrompt')}</span>
        <button onClick={() => onAsk(tc('intel_revwaterfall.askAskBizPrompt'))} style={{ fontSize: 10, color: '#6366F1', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>{tc('intel_revwaterfall.askAskBiz')}</button>
      </div>
    )
  }

  return (
    <>
      {/* Mini card */}
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
          <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em' }}>{tc('intel_revwaterfall.miniCardTitle')}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {[['#22C55E', tc('intel_revwaterfall.legendRev')], ['#EF4444', tc('intel_revwaterfall.legendCost')], ['#6366F1', tc('intel_revwaterfall.legendMargin')]].map(([c, l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 9, color: 'var(--tx3)' }}>
                <div style={{ width: 6, height: 6, borderRadius: 1, background: c }} />{l}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
          <div>
            <span style={{ fontSize: 20, fontWeight: 800, color: '#22C55E', fontFamily: 'var(--font-sora, inherit)', lineHeight: 1 }}>{grossProfitVal}%</span>
            <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 2 }}>{tc('intel_revwaterfall.grossMarginLabel')}</div>
          </div>
          <div style={{ width: 1, background: 'var(--b)' }} />
          <div>
            <span style={{ fontSize: 20, fontWeight: 800, color: '#6366F1', fontFamily: 'var(--font-sora, inherit)', lineHeight: 1 }}>{netMarginVal}%</span>
            <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 2 }}>{tc('intel_revwaterfall.netMarginLabel')}</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {bars.map((bar, i) => {
            const pct = Math.abs(bar.value) / maxAbs
            const c = COLORS[bar.type]
            const isTotal = bar.type === 'total'
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 52, fontSize: 9, fontWeight: isTotal ? 700 : 500, color: isTotal ? 'var(--tx)' : 'var(--tx3)', textAlign: 'right', flexShrink: 0 }}>{bar.label}</div>
                <div style={{ flex: 1, height: isTotal ? 14 : 10, background: 'var(--ev)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct * 100}%`, background: `linear-gradient(90deg, ${c} 0%, ${c}99 100%)`, borderRadius: 3, boxShadow: isTotal ? `0 0 6px ${c}30` : 'none' }} />
                </div>
                <div style={{ width: 32, fontSize: 9, fontWeight: isTotal ? 700 : 500, color: c, textAlign: 'right', flexShrink: 0 }}>{bar.value.toFixed(0)}%</div>
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--b)' }}>
          <span style={{ fontSize: 9, color: 'var(--tx3)', opacity: 0.7 }}>{tc('intel_revwaterfall.basedOnHealth')}</span>
          <span style={{ fontSize: 9, color: '#6366F1', fontWeight: 600 }}>{tc('intel_revwaterfall.tapToExpand')}</span>
        </div>
      </div>

      {/* Expanded modal with drill-down */}
      {expanded && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={() => { setExpanded(false); setDrillItem(null) }}
        >
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--sf)', borderRadius: 20, padding: '24px 28px', width: '100%', maxWidth: 640, maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-sora)', fontSize: 13, fontWeight: 700 }}>{tc('intel_revwaterfall.modalTitle')}</div>
                <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 2 }}>{tc('intel_revwaterfall.modalSubtitle').replace('{dataSource}', posMetrics ? tc('intel_revwaterfall.dataSourcePos') : tc('intel_revwaterfall.dataSourceHealth'))}</div>
              </div>
              <button onClick={() => { setExpanded(false); setDrillItem(null) }} style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid var(--b)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tx3)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* KPI row */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
              {[
                { label: tc('intel_revwaterfall.kpiGrossMargin'), value: posMetrics ? `${posMetrics.grossMargin.toFixed(0)}%` : `${grossProfitVal}%`, color: '#22C55E', sub: posMetrics ? fmt(posMetrics.grossProfit) : undefined },
                { label: tc('intel_revwaterfall.kpiNetMargin'), value: `${netMarginVal}%`, color: '#6366F1', sub: posMetrics ? fmt(posMetrics.totalRevenue) + tc('intel_revwaterfall.kpiRevSuffix') : undefined },
              ].map(k => (
                <div key={k.label} style={{ flex: 1, padding: '12px 14px', borderRadius: 12, background: `${k.color}08`, border: `1px solid ${k.color}20` }}>
                  <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>{k.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: k.color, fontFamily: 'var(--font-sora, inherit)' }}>{k.value}</div>
                  {k.sub && <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 2 }}>{k.sub}</div>}
                </div>
              ))}
            </div>

            {/* Clickable waterfall bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {bars.map((bar, i) => {
                const pct = Math.abs(bar.value) / maxAbs
                const isHov = hovered === i
                const isDrill = drillItem === bar.key
                const c = COLORS[bar.type]
                return (
                  <div key={i}>
                    <div
                      onClick={() => setDrillItem(isDrill ? null : bar.key)}
                      onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: '4px 0', borderRadius: 6, transition: 'background 100ms', background: isDrill ? `${c}08` : 'transparent' }}
                    >
                      <div style={{ width: 90, fontSize: 10, fontWeight: bar.type === 'total' ? 700 : 400, color: isDrill ? c : 'var(--tx2)', textAlign: 'right', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                        {bar.label}
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={isDrill ? c : 'var(--tx3)'} strokeWidth="2" strokeLinecap="round" style={{ transition: 'transform 200ms', transform: isDrill ? 'rotate(90deg)' : 'rotate(0deg)', opacity: 0.5 }}><polyline points="9 18 15 12 9 6"/></svg>
                      </div>
                      <div style={{ flex: 1, height: bar.type === 'total' ? 24 : 18, background: 'var(--ev)', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                        <div style={{
                          height: '100%', width: `${pct * 100}%`,
                          background: isHov || isDrill ? `linear-gradient(90deg, ${c} 0%, ${c} 100%)` : `linear-gradient(90deg, ${c}cc 0%, ${c}88 100%)`,
                          borderRadius: 6, transition: 'width 400ms ease, background 100ms',
                          boxShadow: isHov || isDrill ? `0 0 10px ${c}30` : 'none',
                        }} />
                        {bar.type === 'total' && <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 9, fontWeight: 700, color: 'var(--tx3)' }}>{bar.value > 0 ? '+' : ''}{bar.value.toFixed(0)}%</span>}
                      </div>
                      <div style={{ width: 55, fontSize: 10, fontWeight: bar.type === 'total' ? 700 : 400, color: c, textAlign: 'right', flexShrink: 0 }}>{bar.value > 0 ? '+' : ''}{bar.value.toFixed(0)}%</div>
                    </div>

                    {/* Drill-down panel */}
                    {isDrill && (
                      <div style={{ marginLeft: 102, marginTop: 8, marginBottom: 12, padding: 14, borderRadius: 12, border: `1px solid ${c}20`, background: `${c}04` }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: c }}>{tc('intel_revwaterfall.barBreakdownLabel').replace('{label}', bar.label)}</div>
                          <button onClick={(e) => { e.stopPropagation(); onAsk(DRILL_PROMPTS[bar.key] || tc('intel_revwaterfall.drillPromptFallback').replace('{label}', bar.label.toLowerCase())) }}
                            style={{ fontSize: 9, color: c, fontWeight: 600, background: `${c}10`, border: `1px solid ${c}20`, borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontFamily: 'inherit' }}>
                            {tc('intel_revwaterfall.askAi')}
                          </button>
                        </div>
                        {renderDrillDown(bar.key)}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Detail tooltip */}
            {hovered !== null && bars[hovered] && !drillItem && (
              <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 10, background: 'var(--ev)', fontSize: 10, color: 'var(--tx2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 4, height: 28, borderRadius: 2, background: COLORS[bars[hovered].type], flexShrink: 0 }} />
                <div><strong>{bars[hovered].label}:</strong> {bars[hovered].detail}</div>
              </div>
            )}

            <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--b)', fontSize: 9, color: 'var(--tx3)' }}>
              {posMetrics ? tc('intel_revwaterfall.detailFooterPos').replace('{count}', String(posMetrics.txnCount)) : tc('intel_revwaterfall.detailFooterHealth')}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
