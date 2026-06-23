'use client'
import { useState } from 'react'
import { useLang } from '@/components/LanguageProvider'

type Tc = (k: string, vars?: Record<string, string | number>) => string

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

const buildPeriodLabels = (tc: Tc): Record<string, string> => ({
  today: tc('cfo_report.period_today'),
  this_week: tc('cfo_report.period_this_week'),
  this_month: tc('cfo_report.period_this_month'),
  last_month: tc('cfo_report.period_last_month'),
  this_quarter: tc('cfo_report.period_this_quarter'),
  ytd: tc('cfo_report.period_ytd'),
  last_90: tc('cfo_report.period_last_90'),
})

export default function CfoReportExport({ data, currencySymbol: sym, period }: Props) {
  const { tc } = useLang()
  const PERIOD_LABELS = buildPeriodLabels(tc)
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

  const overallStatus = criticalAlerts.length > 0 ? tc('cfo_report.status_needs_attention') :
    warningAlerts.length > 0 ? tc('cfo_report.status_monitor') :
    t.net_profit >= 0 ? tc('cfo_report.status_on_track') : tc('cfo_report.status_review_required')

  const statusColor = criticalAlerts.length > 0 ? '#EF4444' :
    warningAlerts.length > 0 ? '#F59E0B' :
    t.net_profit >= 0 ? '#22C55E' : '#F97316'

  return (
    <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
      {/* Header with export button */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#6366F1' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_report.header_title')}</span>
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
          {exporting ? tc('cfo_report.btn_generating') : tc('cfo_report.btn_download')}
        </button>
      </div>

      {/* Full report content — exported as image */}
      <div id="cfo-full-report" style={{ padding: 32, background: '#fff', color: '#1a1a1a', maxWidth: 800 }}>
        {/* Report title */}
        <div style={{ borderBottom: '3px solid #6366F1', paddingBottom: 16, marginBottom: 24 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a' }}>{tc('cfo_report.report_title')}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
            <div style={{ fontSize: 13, color: '#666' }}>
              {tc('cfo_report.report_meta', { period: PERIOD_LABELS[period] || period, date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) })}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: statusColor, padding: '4px 12px', borderRadius: 6, background: `${statusColor}15`, border: `1px solid ${statusColor}30` }}>
              {overallStatus}
            </div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <ReportSection number={1} title={tc('cfo_report.section_executive_summary')}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
            <MetricBox label={tc('cfo_report.metric_revenue')} value={fmt(t.revenue, sym)} change={pctChange(t.revenue, c.revenue)} positive={t.revenue >= c.revenue} />
            <MetricBox label={tc('cfo_report.metric_gross_profit')} value={fmt(t.gross_profit, sym)} change={tc('cfo_report.margin_suffix', { pct: t.gross_margin_pct })} positive={t.gross_margin_pct >= 30} />
            <MetricBox label={tc('cfo_report.metric_net_profit')} value={fmt(t.net_profit, sym)} change={tc('cfo_report.margin_suffix', { pct: t.net_margin_pct })} positive={t.net_profit >= 0} />
          </div>
          <div style={{ fontSize: 12, color: '#555', lineHeight: 1.7 }}>
            {t.net_profit >= 0
              ? tc('cfo_report.summary_profit', { revenue: fmt(t.revenue, sym), net: fmt(t.net_profit, sym), margin: t.net_margin_pct, trend: t.revenue >= c.revenue ? tc('cfo_report.revenue_up') : tc('cfo_report.revenue_declined'), change: pctChange(t.revenue, c.revenue) })
              : tc('cfo_report.summary_loss', { revenue: fmt(t.revenue, sym), loss: fmt(Math.abs(t.net_profit), sym) })
            }
          </div>
        </ReportSection>

        {/* Section 2: Profit & Loss */}
        <ReportSection number={2} title={tc('cfo_report.section_pnl')}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e5e5' }}>
                <th style={{ textAlign: 'left', padding: '8px 0', fontSize: 11, color: '#888', fontWeight: 600 }}></th>
                <th style={{ textAlign: 'right', padding: '8px 0', fontSize: 11, color: '#888', fontWeight: 600 }}>{tc('cfo_report.col_amount')}</th>
                <th style={{ textAlign: 'right', padding: '8px 0', fontSize: 11, color: '#888', fontWeight: 600 }}>{tc('cfo_report.col_pct_revenue')}</th>
                <th style={{ textAlign: 'right', padding: '8px 0', fontSize: 11, color: '#888', fontWeight: 600 }}>{tc('cfo_report.col_vs_prior')}</th>
              </tr>
            </thead>
            <tbody>
              <PnlLine label={tc('cfo_report.pnl_revenue')} amount={t.revenue} pctRev={100} change={pctChange(t.revenue, c.revenue)} sym={sym} bold />
              <PnlLine label={tc('cfo_report.pnl_cogs')} amount={-t.cogs} pctRev={t.revenue > 0 ? (t.cogs / t.revenue) * 100 : 0} sym={sym} />
              <PnlLine label={tc('cfo_report.pnl_gross_profit')} amount={t.gross_profit} pctRev={t.gross_margin_pct} change={pctChange(t.gross_profit, c.gross_profit)} sym={sym} bold border highlight={t.gross_profit > 0} />
              <PnlLine label={tc('cfo_report.pnl_opex')} amount={-t.fixed_costs} pctRev={t.revenue > 0 ? (t.fixed_costs / t.revenue) * 100 : 0} sym={sym} />
              <PnlLine label={tc('cfo_report.pnl_net_profit')} amount={t.net_profit} pctRev={t.net_margin_pct} change={pctChange(t.net_profit, c.net_profit)} sym={sym} bold border highlight={t.net_profit >= 0} />
            </tbody>
          </table>
        </ReportSection>

        {/* Section 3: Cash Position */}
        <ReportSection number={3} title={tc('cfo_report.section_cash')}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <MetricBox label={tc('cfo_report.metric_cash_balance')} value={data.cash.balance > 0 ? fmt(data.cash.balance, sym) : tc('cfo_report.not_set')} positive={data.cash.balance > 0} />
            <MetricBox label={tc('cfo_report.metric_monthly_burn')} value={fmt(Math.abs(data.cash.daily_net_burn * 30), sym)} positive={data.cash.daily_net_burn >= 0} change={data.cash.daily_net_burn >= 0 ? tc('cfo_report.cash_positive') : tc('cfo_report.negative_burn')} />
            <MetricBox label={tc('cfo_report.metric_cash_runway')} value={data.cash.runway_months != null ? tc('cfo_report.months_value', { n: data.cash.runway_months }) : data.cash.daily_net_burn >= 0 ? tc('cfo_report.cash_positive_short') : '—'} positive={data.cash.runway_months == null || data.cash.runway_months >= 3} />
          </div>
        </ReportSection>

        {/* Section 4: Inventory */}
        <ReportSection number={4} title={tc('cfo_report.section_inventory')}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
            <SmallMetric label={tc('cfo_report.inv_total_products')} value={`${data.inventory.total_products}`} />
            <SmallMetric label={tc('cfo_report.inv_stock_value')} value={fmt(data.inventory.value_at_cost, sym)} />
            <SmallMetric label={tc('cfo_report.inv_low_oos')} value={`${data.inventory.low_or_oos}`} alert={data.inventory.low_or_oos > 0} />
            <SmallMetric label={tc('cfo_report.inv_stockout_rate')} value={`${data.inventory.stockout_rate}%`} alert={data.inventory.stockout_rate > 30} />
          </div>
        </ReportSection>

        {/* Section 5: Risks & Alerts */}
        {(criticalAlerts.length > 0 || warningAlerts.length > 0) && (
          <ReportSection number={5} title={tc('cfo_report.section_risks')}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {criticalAlerts.map((a, i) => (
                <div key={`c${i}`} style={{ fontSize: 12, color: '#333', padding: '8px 12px', borderRadius: 6, background: '#fef2f2', borderLeft: '3px solid #EF4444' }}>
                  <strong style={{ color: '#EF4444' }}>{tc('cfo_report.label_critical')}</strong> {a.message}
                </div>
              ))}
              {warningAlerts.map((a, i) => (
                <div key={`w${i}`} style={{ fontSize: 12, color: '#333', padding: '8px 12px', borderRadius: 6, background: '#fffbeb', borderLeft: '3px solid #F59E0B' }}>
                  <strong style={{ color: '#F59E0B' }}>{tc('cfo_report.label_warning')}</strong> {a.message}
                </div>
              ))}
            </div>
          </ReportSection>
        )}

        {/* Section 6: KPI Summary */}
        {data.kpis && data.kpis.length > 0 && (
          <ReportSection number={criticalAlerts.length > 0 || warningAlerts.length > 0 ? 6 : 5} title={tc('cfo_report.section_kpi')}>
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
            {tc('cfo_report.footer_generated', { date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) })}
          </div>
          <div style={{ fontSize: 10, color: '#aaa' }}>
            {tc('cfo_report.footer_page', { current: 1, total: 1 })}
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
