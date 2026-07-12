'use client'
import { useState } from 'react'
import { useLang } from '@/components/LanguageProvider'

interface Props {
  data: {
    totals: { revenue: number; cogs: number; gross_profit: number; fixed_costs: number; net_profit: number; gross_margin_pct: number; net_margin_pct: number }
    comparison: { revenue: number; gross_profit: number; net_profit: number; gross_margin_pct: number }
    inventory: { total_products: number; low_or_oos: number; stockout_rate: number; value_at_cost: number }
    cash: { balance: number; runway_months: number | null; runway_status: string; daily_net_burn: number }
    alerts: Array<{ type: string; severity: string; message: string }>
    kpis: any[]
  }
  currencySymbol: string
  onAsk?: (prompt: string) => void
}

function fmt(n: number, sym: string): string {
  if (Math.abs(n) >= 1_000_000) return `${sym}${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `${sym}${(n / 1_000).toFixed(0)}K`
  return `${sym}${Math.round(n).toLocaleString()}`
}

function pctChange(curr: number, prev: number): string {
  if (prev === 0) return '—'
  const pct = Math.round(((curr - prev) / Math.abs(prev)) * 100)
  return pct > 0 ? `▲ +${pct}%` : pct < 0 ? `▼ ${pct}%` : '— 0%'
}

function statusDot(condition: boolean, warning?: boolean): string {
  if (condition) return '🟢'
  if (warning) return '🟡'
  return '🔴'
}

export default function BoardPack({ data, currencySymbol: sym, onAsk }: Props) {
  const { tc } = useLang()
  const [exporting, setExporting] = useState(false)
  const t = data.totals
  const c = data.comparison

  const exportPdf = async () => {
    setExporting(true)
    try {
      const el = document.getElementById('board-pack-content')
      if (!el) return

      // Dynamic import to avoid loading html2canvas unless needed
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#ffffff', logging: false })
      const imgData = canvas.toDataURL('image/png')

      const link = document.createElement('a')
      link.download = `board-report-${new Date().toISOString().split('T')[0]}.png`
      link.href = imgData
      link.click()
    } catch {
      // Fallback: print
      window.print()
    } finally {
      setExporting(false)
    }
  }

  const criticalAlerts = data.alerts.filter(a => a.severity === 'critical')
  const warningAlerts = data.alerts.filter(a => a.severity === 'warning')

  const hasRisks = criticalAlerts.length > 0 || warningAlerts.length > 0
  const inventorySectionNum = hasRisks ? 5 : 4

  const cashRunwayValue =
    data.cash.runway_months != null
      ? tc('cfo_boardpack.months', { n: data.cash.runway_months })
      : data.cash.daily_net_burn >= 0
      ? tc('cfo_boardpack.cashPositive')
      : tc('cfo_boardpack.notCalculated')

  const grossMarginTrend =
    t.gross_margin_pct >= c.gross_margin_pct
      ? tc('cfo_boardpack.improving')
      : tc('cfo_boardpack.declining')

  return (
    <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#6366F1' }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_boardpack.boardReportTitle')}</span>
          <span style={{ fontSize: 9, color: 'var(--tx3)' }}>
            {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {onAsk && (
            <button
              onClick={() => onAsk('Generate a detailed board-ready executive summary of my business performance this period. Use percentage-first language and highlight the most critical issues and wins.')}
              style={{ fontSize: 9, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
            >
              {tc('cfo_boardpack.aiNarrativeBtn')}
            </button>
          )}
          <button
            onClick={exportPdf}
            disabled={exporting}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 9, color: '#6366F1', background: 'rgba(99,102,241,.08)',
              border: 'none', borderRadius: 6, padding: '4px 10px',
              cursor: exporting ? 'wait' : 'pointer', fontWeight: 600, fontFamily: 'inherit',
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            {exporting ? tc('cfo_boardpack.exportingBtn') : tc('cfo_boardpack.exportBtn')}
          </button>
        </div>
      </div>

      {/* Board pack content */}
      <div id="board-pack-content" style={{ padding: '18px', background: '#fff' }}>
        {/* Section 1: Executive Summary */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
            {tc('cfo_boardpack.section1Title')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <SummaryLine
              icon={statusDot(t.revenue >= c.revenue)}
              text={tc('cfo_boardpack.summaryRevenue', { val: fmt(t.revenue, sym), change: pctChange(t.revenue, c.revenue) })}
            />
            <SummaryLine
              icon={statusDot(t.gross_margin_pct >= 35, t.gross_margin_pct >= 20)}
              text={tc('cfo_boardpack.summaryGrossMargin', { pct: t.gross_margin_pct, trend: grossMarginTrend })}
            />
            <SummaryLine
              icon={statusDot(t.net_profit >= 0)}
              text={tc('cfo_boardpack.summaryNetProfit', { val: fmt(t.net_profit, sym), margin: t.net_margin_pct, change: pctChange(t.net_profit, c.net_profit) })}
            />
            <SummaryLine
              icon={statusDot(data.cash.runway_status === 'strong' || data.cash.runway_status === 'healthy', data.cash.runway_status === 'warning')}
              text={tc('cfo_boardpack.summaryCashRunway', { val: cashRunwayValue })}
            />
            <SummaryLine
              icon={statusDot(data.inventory.stockout_rate < 30, data.inventory.stockout_rate < 50)}
              text={tc('cfo_boardpack.summaryInventory', { rate: data.inventory.stockout_rate, low: data.inventory.low_or_oos, total: data.inventory.total_products })}
            />
          </div>
        </div>

        {/* Section 2: Financial Summary */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
            {tc('cfo_boardpack.section2Title')}
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e5e5' }}>
                <th style={{ textAlign: 'left', padding: '6px 0', fontSize: 9, color: '#666', fontWeight: 600 }}></th>
                <th style={{ textAlign: 'right', padding: '6px 0', fontSize: 9, color: '#666', fontWeight: 600 }}>{tc('cfo_boardpack.thCurrent')}</th>
                <th style={{ textAlign: 'right', padding: '6px 0', fontSize: 9, color: '#666', fontWeight: 600 }}>{tc('cfo_boardpack.thPctRev')}</th>
                <th style={{ textAlign: 'right', padding: '6px 0', fontSize: 9, color: '#666', fontWeight: 600 }}>{tc('cfo_boardpack.thChange')}</th>
              </tr>
            </thead>
            <tbody>
              <BoardRow label={tc('cfo_boardpack.rowRevenue')} val={t.revenue} pct={100} change={pctChange(t.revenue, c.revenue)} sym={sym} bold />
              <BoardRow label={tc('cfo_boardpack.rowCogs')} val={-t.cogs} pct={t.revenue > 0 ? (t.cogs / t.revenue) * 100 : 0} sym={sym} />
              <BoardRow label={tc('cfo_boardpack.rowGrossProfit')} val={t.gross_profit} pct={t.gross_margin_pct} change={pctChange(t.gross_profit, c.gross_profit)} sym={sym} bold border />
              <BoardRow label={tc('cfo_boardpack.rowOpex')} val={-t.fixed_costs} pct={t.revenue > 0 ? (t.fixed_costs / t.revenue) * 100 : 0} sym={sym} />
              <BoardRow label={tc('cfo_boardpack.rowNetProfit')} val={t.net_profit} pct={t.net_margin_pct} change={pctChange(t.net_profit, c.net_profit)} sym={sym} bold border highlight />
            </tbody>
          </table>
        </div>

        {/* Section 3: Cash Position */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
            {tc('cfo_boardpack.section3Title')}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <MiniMetric label={tc('cfo_boardpack.metricCashBalance')} value={data.cash.balance > 0 ? fmt(data.cash.balance, sym) : tc('cfo_boardpack.notSet')} />
            <MiniMetric label={tc('cfo_boardpack.metricMonthlyBurn')} value={fmt(Math.abs(data.cash.daily_net_burn * 30), sym)} />
            <MiniMetric label={tc('cfo_boardpack.metricRunway')} value={data.cash.runway_months != null ? tc('cfo_boardpack.months', { n: data.cash.runway_months }) : data.cash.daily_net_burn >= 0 ? tc('cfo_boardpack.cashPositiveShort') : '—'} />
          </div>
        </div>

        {/* Section 4: Key Risks */}
        {hasRisks && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              {tc('cfo_boardpack.section4Title')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {criticalAlerts.map((a, i) => (
                <div key={i} style={{ fontSize: 10, color: '#333', padding: '6px 0', borderBottom: '1px solid #f0f0f0' }}>
                  🔴 <strong>{tc('cfo_boardpack.criticalLabel')}</strong> {a.message}
                </div>
              ))}
              {warningAlerts.map((a, i) => (
                <div key={i} style={{ fontSize: 10, color: '#333', padding: '6px 0', borderBottom: '1px solid #f0f0f0' }}>
                  🟡 <strong>{tc('cfo_boardpack.warningLabel')}</strong> {a.message}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4 or 5: Inventory */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
            {tc('cfo_boardpack.sectionInventoryTitle', { n: inventorySectionNum })}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
            <MiniMetric label={tc('cfo_boardpack.metricProducts')} value={`${data.inventory.total_products}`} />
            <MiniMetric label={tc('cfo_boardpack.metricStockValue')} value={fmt(data.inventory.value_at_cost, sym)} />
            <MiniMetric label={tc('cfo_boardpack.metricLowOos')} value={`${data.inventory.low_or_oos}`} />
            <MiniMetric label={tc('cfo_boardpack.metricStockoutRate')} value={`${data.inventory.stockout_rate}%`} />
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: 10, fontSize: 9, color: '#999', textAlign: 'center' }}>
          {tc('cfo_boardpack.footerText', { date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) })}
        </div>
      </div>
    </div>
  )
}

function SummaryLine({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, color: '#333' }}>
      <span>{icon}</span>
      <span>{text}</span>
    </div>
  )
}

function BoardRow({ label, val, pct, change, sym, bold, border, highlight }: {
  label: string; val: number; pct: number; change?: string; sym: string; bold?: boolean; border?: boolean; highlight?: boolean
}) {
  const fmtAmt = (n: number) => {
    const abs = Math.abs(n)
    if (abs >= 1_000_000) return `${n < 0 ? '(' : ''}${sym}${(abs / 1_000_000).toFixed(1)}M${n < 0 ? ')' : ''}`
    return `${n < 0 ? '(' : ''}${sym}${Math.round(abs).toLocaleString()}${n < 0 ? ')' : ''}`
  }

  return (
    <tr style={{ borderTop: border ? '2px solid #e5e5e5' : undefined, background: highlight ? '#f8f7ff' : undefined }}>
      <td style={{ padding: '7px 0', fontWeight: bold ? 700 : 400, color: '#333', fontSize: 10 }}>{label}</td>
      <td style={{ padding: '7px 0', textAlign: 'right', fontWeight: bold ? 700 : 400, color: val < 0 ? '#dc2626' : '#333', fontVariantNumeric: 'tabular-nums' }}>{fmtAmt(val)}</td>
      <td style={{ padding: '7px 0', textAlign: 'right', color: '#999', fontVariantNumeric: 'tabular-nums' }}>{pct > 0 ? `${Math.round(pct)}%` : ''}</td>
      <td style={{ padding: '7px 0', textAlign: 'right', fontSize: 9, color: change?.includes('▲') ? '#16a34a' : change?.includes('▼') ? '#dc2626' : '#999' }}>{change || ''}</td>
    </tr>
  )
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #e5e5e5', textAlign: 'center' }}>
      <div style={{ fontSize: 9, color: '#999', marginBottom: 2, fontWeight: 500, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#333' }}>{value}</div>
    </div>
  )
}
