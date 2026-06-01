'use client'
import { useState } from 'react'

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
  period: string
}

function fmt(n: number, sym: string): string {
  if (Math.abs(n) >= 1_000_000) return `${sym}${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `${sym}${(n / 1_000).toFixed(0)}K`
  return `${sym}${Math.round(n).toLocaleString()}`
}

function pctChange(curr: number, prev: number): string {
  if (prev === 0) return '—'
  const pct = Math.round(((curr - prev) / Math.abs(prev)) * 100)
  return pct > 0 ? `+${pct}%` : `${pct}%`
}

const PERIOD_LABELS: Record<string, string> = {
  today: 'Today',
  this_week: 'This Week',
  this_month: 'This Month',
  last_month: 'Last Month',
  this_quarter: 'This Quarter',
  ytd: 'Year to Date',
  last_90: 'Last 90 Days',
}

export default function CfoReportExport({ data, currencySymbol: sym, period }: Props) {
  const [exporting, setExporting] = useState(false)
  const t = data.totals
  const c = data.comparison

  const criticalAlerts = data.alerts.filter(a => a.severity === 'critical')
  const warningAlerts = data.alerts.filter(a => a.severity === 'warning')

  const exportPdf = async () => {
    setExporting(true)
    try {
      const el = document.getElementById('cfo-full-report')
      if (!el) return

      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        windowWidth: 800,
      })

      const imgData = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `cfo-report-${PERIOD_LABELS[period]?.replace(/\s/g, '-').toLowerCase() || period}-${new Date().toISOString().split('T')[0]}.png`
      link.href = imgData
      link.click()
    } catch {
      window.print()
    } finally {
      setExporting(false)
    }
  }

  const overallStatus = criticalAlerts.length > 0 ? 'NEEDS ATTENTION' :
    warningAlerts.length > 0 ? 'MONITOR' :
    t.net_profit >= 0 ? 'ON TRACK' : 'REVIEW REQUIRED'

  const statusColor = criticalAlerts.length > 0 ? '#EF4444' :
    warningAlerts.length > 0 ? '#F59E0B' :
    t.net_profit >= 0 ? '#22C55E' : '#F97316'

  return (
    <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
      {/* Header with export button */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#6366F1' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>Full CFO Report</span>
          <span style={{ fontSize: 10, color: 'var(--tx3)' }}>{PERIOD_LABELS[period] || period}</span>
        </div>
        <button
          onClick={exportPdf}
          disabled={exporting}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 11, color: '#fff', background: '#6366F1',
            border: 'none', borderRadius: 8, padding: '8px 16px',
            cursor: exporting ? 'wait' : 'pointer', fontWeight: 600, fontFamily: 'inherit',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          {exporting ? 'Generating...' : 'Download Report'}
        </button>
      </div>

      {/* Full report content — exported as image */}
      <div id="cfo-full-report" style={{ padding: 32, background: '#fff', color: '#1a1a1a', maxWidth: 800 }}>
        {/* Report title */}
        <div style={{ borderBottom: '3px solid #6366F1', paddingBottom: 16, marginBottom: 24 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a' }}>CFO Financial Report</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
            <div style={{ fontSize: 13, color: '#666' }}>
              Period: {PERIOD_LABELS[period] || period} · Generated {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: statusColor, padding: '4px 12px', borderRadius: 6, background: `${statusColor}15`, border: `1px solid ${statusColor}30` }}>
              {overallStatus}
            </div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <ReportSection number={1} title="Executive Summary">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
            <MetricBox label="Revenue" value={fmt(t.revenue, sym)} change={pctChange(t.revenue, c.revenue)} positive={t.revenue >= c.revenue} />
            <MetricBox label="Gross Profit" value={fmt(t.gross_profit, sym)} change={`${t.gross_margin_pct}% margin`} positive={t.gross_margin_pct >= 30} />
            <MetricBox label="Net Profit" value={fmt(t.net_profit, sym)} change={`${t.net_margin_pct}% margin`} positive={t.net_profit >= 0} />
          </div>
          <div style={{ fontSize: 12, color: '#555', lineHeight: 1.7 }}>
            {t.net_profit >= 0
              ? `The business generated ${fmt(t.revenue, sym)} in revenue with a net profit of ${fmt(t.net_profit, sym)} (${t.net_margin_pct}% margin). ${t.revenue >= c.revenue ? 'Revenue is up' : 'Revenue declined'} ${pctChange(t.revenue, c.revenue)} compared to the prior period.`
              : `The business generated ${fmt(t.revenue, sym)} in revenue but is operating at a net loss of ${fmt(Math.abs(t.net_profit), sym)}. Cost structure needs immediate review.`
            }
          </div>
        </ReportSection>

        {/* Section 2: Profit & Loss */}
        <ReportSection number={2} title="Profit & Loss Statement">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e5e5' }}>
                <th style={{ textAlign: 'left', padding: '8px 0', fontSize: 11, color: '#888', fontWeight: 600 }}></th>
                <th style={{ textAlign: 'right', padding: '8px 0', fontSize: 11, color: '#888', fontWeight: 600 }}>Amount</th>
                <th style={{ textAlign: 'right', padding: '8px 0', fontSize: 11, color: '#888', fontWeight: 600 }}>% of Revenue</th>
                <th style={{ textAlign: 'right', padding: '8px 0', fontSize: 11, color: '#888', fontWeight: 600 }}>vs Prior</th>
              </tr>
            </thead>
            <tbody>
              <PnlLine label="Revenue" amount={t.revenue} pctRev={100} change={pctChange(t.revenue, c.revenue)} sym={sym} bold />
              <PnlLine label="Cost of Goods Sold" amount={-t.cogs} pctRev={t.revenue > 0 ? (t.cogs / t.revenue) * 100 : 0} sym={sym} />
              <PnlLine label="Gross Profit" amount={t.gross_profit} pctRev={t.gross_margin_pct} change={pctChange(t.gross_profit, c.gross_profit)} sym={sym} bold border highlight={t.gross_profit > 0} />
              <PnlLine label="Operating Expenses" amount={-t.fixed_costs} pctRev={t.revenue > 0 ? (t.fixed_costs / t.revenue) * 100 : 0} sym={sym} />
              <PnlLine label="Net Profit / (Loss)" amount={t.net_profit} pctRev={t.net_margin_pct} change={pctChange(t.net_profit, c.net_profit)} sym={sym} bold border highlight={t.net_profit >= 0} />
            </tbody>
          </table>
        </ReportSection>

        {/* Section 3: Cash Position */}
        <ReportSection number={3} title="Cash Position">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <MetricBox label="Cash Balance" value={data.cash.balance > 0 ? fmt(data.cash.balance, sym) : 'Not set'} positive={data.cash.balance > 0} />
            <MetricBox label="Monthly Burn" value={fmt(Math.abs(data.cash.daily_net_burn * 30), sym)} positive={data.cash.daily_net_burn >= 0} change={data.cash.daily_net_burn >= 0 ? 'Cash positive' : 'Negative burn'} />
            <MetricBox label="Cash Runway" value={data.cash.runway_months != null ? `${data.cash.runway_months} months` : data.cash.daily_net_burn >= 0 ? 'Cash +ve' : '—'} positive={data.cash.runway_months == null || data.cash.runway_months >= 3} />
          </div>
        </ReportSection>

        {/* Section 4: Inventory */}
        <ReportSection number={4} title="Inventory Status">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
            <SmallMetric label="Total Products" value={`${data.inventory.total_products}`} />
            <SmallMetric label="Stock Value" value={fmt(data.inventory.value_at_cost, sym)} />
            <SmallMetric label="Low / OOS" value={`${data.inventory.low_or_oos}`} alert={data.inventory.low_or_oos > 0} />
            <SmallMetric label="Stockout Rate" value={`${data.inventory.stockout_rate}%`} alert={data.inventory.stockout_rate > 30} />
          </div>
        </ReportSection>

        {/* Section 5: Risks & Alerts */}
        {(criticalAlerts.length > 0 || warningAlerts.length > 0) && (
          <ReportSection number={5} title="Key Risks & Issues">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {criticalAlerts.map((a, i) => (
                <div key={`c${i}`} style={{ fontSize: 12, color: '#333', padding: '8px 12px', borderRadius: 6, background: '#fef2f2', borderLeft: '3px solid #EF4444' }}>
                  <strong style={{ color: '#EF4444' }}>Critical:</strong> {a.message}
                </div>
              ))}
              {warningAlerts.map((a, i) => (
                <div key={`w${i}`} style={{ fontSize: 12, color: '#333', padding: '8px 12px', borderRadius: 6, background: '#fffbeb', borderLeft: '3px solid #F59E0B' }}>
                  <strong style={{ color: '#F59E0B' }}>Warning:</strong> {a.message}
                </div>
              ))}
            </div>
          </ReportSection>
        )}

        {/* Section 6: KPI Summary */}
        {data.kpis && data.kpis.length > 0 && (
          <ReportSection number={criticalAlerts.length > 0 || warningAlerts.length > 0 ? 6 : 5} title="KPI Summary">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {data.kpis.map((kpi: any) => (
                <div key={kpi.key} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e5e5', textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: '#888', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{kpi.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#333', marginTop: 4 }}>{kpi.valueLabel || (kpi.value != null ? `${kpi.value}` : '—')}</div>
                  {kpi.change != null && (
                    <div style={{ fontSize: 10, color: kpi.change > 0 ? '#22C55E' : kpi.change < 0 ? '#EF4444' : '#888', fontWeight: 600, marginTop: 2 }}>
                      {kpi.change > 0 ? '▲' : kpi.change < 0 ? '▼' : '–'} {Math.abs(kpi.change)}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ReportSection>
        )}

        {/* Footer */}
        <div style={{ borderTop: '2px solid #e5e5e5', paddingTop: 14, marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 10, color: '#aaa' }}>
            Generated by AskBiz CFO · {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} · Confidential
          </div>
          <div style={{ fontSize: 10, color: '#aaa' }}>
            Page 1 of 1
          </div>
        </div>
      </div>
    </div>
  )
}

function ReportSection({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#6366F1', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{number}</span>
        {title}
      </div>
      {children}
    </div>
  )
}

function MetricBox({ label, value, change, positive }: { label: string; value: string; change?: string; positive?: boolean }) {
  return (
    <div style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid #e5e5e5', background: '#fafafa' }}>
      <div style={{ fontSize: 10, color: '#888', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#1a1a1a' }}>{value}</div>
      {change && <div style={{ fontSize: 11, color: positive ? '#22C55E' : '#EF4444', fontWeight: 600, marginTop: 2 }}>{change}</div>}
    </div>
  )
}

function SmallMetric({ label, value, alert }: { label: string; value: string; alert?: boolean }) {
  return (
    <div style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e5e5', textAlign: 'center', background: alert ? '#fef2f2' : '#fafafa' }}>
      <div style={{ fontSize: 9, color: '#888', fontWeight: 500, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: alert ? '#EF4444' : '#333', marginTop: 2 }}>{value}</div>
    </div>
  )
}

function PnlLine({ label, amount, pctRev, change, sym, bold, border, highlight }: {
  label: string; amount: number; pctRev: number; change?: string; sym: string; bold?: boolean; border?: boolean; highlight?: boolean
}) {
  const fmtAmt = (n: number) => {
    const abs = Math.abs(n)
    if (abs >= 1_000_000) return `${n < 0 ? '(' : ''}${sym}${(abs / 1_000_000).toFixed(1)}M${n < 0 ? ')' : ''}`
    return `${n < 0 ? '(' : ''}${sym}${Math.round(abs).toLocaleString()}${n < 0 ? ')' : ''}`
  }

  return (
    <tr style={{ borderTop: border ? '2px solid #e5e5e5' : undefined, background: highlight ? (amount >= 0 ? '#f0fdf4' : '#fef2f2') : undefined }}>
      <td style={{ padding: '8px 0', fontWeight: bold ? 700 : 400, color: '#333', fontSize: 13 }}>{label}</td>
      <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: bold ? 700 : 400, color: amount < 0 ? '#dc2626' : '#333' }}>{fmtAmt(amount)}</td>
      <td style={{ padding: '8px 0', textAlign: 'right', color: '#888' }}>{pctRev > 0 ? `${Math.round(pctRev)}%` : ''}</td>
      <td style={{ padding: '8px 0', textAlign: 'right', fontSize: 12, color: change?.startsWith('+') ? '#22C55E' : change?.startsWith('-') ? '#dc2626' : '#888' }}>{change || ''}</td>
    </tr>
  )
}
