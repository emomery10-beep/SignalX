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
  }
  currencySymbol: string
  onAsk?: (prompt: string) => void
}

function fmt(n: number, sym: string): string {
  if (Math.abs(n) >= 1_000_000) return `${sym}${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `${sym}${(n / 1_000).toFixed(0)}K`
  return `${sym}${Math.round(n).toLocaleString()}`
}

function pctDiff(curr: number, prev: number): { pct: number; dir: 'up' | 'down' | 'flat' } {
  if (prev === 0) return { pct: 0, dir: 'flat' }
  const pct = Math.round(((curr - prev) / Math.abs(prev)) * 100)
  return { pct: Math.abs(pct), dir: pct > 0 ? 'up' : pct < 0 ? 'down' : 'flat' }
}

function getWeekRange(): string {
  const now = new Date()
  const start = new Date(now)
  start.setDate(start.getDate() - start.getDay() + 1)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  const fmtd = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  return `${fmtd(start)} – ${fmtd(end)}, ${now.getFullYear()}`
}

export default function WeeklyCfoDigest({ data, currencySymbol: sym, onAsk }: Props) {
  const { tc } = useLang()
  const [emailSent, setEmailSent] = useState(false)
  const t = data.totals
  const c = data.comparison

  const revChange = pctDiff(t.revenue, c.revenue)
  const profitChange = pctDiff(t.net_profit, c.net_profit)
  const criticalAlerts = data.alerts.filter(a => a.severity === 'critical')
  const warningAlerts = data.alerts.filter(a => a.severity === 'warning')

  const overallStatus = criticalAlerts.length > 0 ? 'critical' :
    warningAlerts.length > 0 ? 'warning' :
    t.net_profit >= 0 ? 'healthy' : 'concern'

  const statusConfig = {
    critical: { icon: '🔴', label: tc('cfo_weekly.statusNeedsAttention'), color: '#EF4444', bg: 'rgba(239,68,68,.04)' },
    warning:  { icon: '🟡', label: tc('cfo_weekly.statusMonitor'),         color: '#F59E0B', bg: 'rgba(245,158,11,.04)' },
    healthy:  { icon: '🟢', label: tc('cfo_weekly.statusOnTrack'),         color: '#22C55E', bg: 'rgba(34,197,94,.04)'  },
    concern:  { icon: '🟠', label: tc('cfo_weekly.statusReview'),          color: '#F97316', bg: 'rgba(249,115,22,.04)' },
  }[overallStatus]

  const wins: string[] = []
  const concerns: string[] = []

  if (revChange.dir === 'up' && revChange.pct > 5) wins.push(tc('cfo_weekly.winRevenueUp', { pct: revChange.pct }))
  if (t.gross_margin_pct >= 35) wins.push(tc('cfo_weekly.winHealthyMargin', { pct: t.gross_margin_pct }))
  if (t.net_profit > 0 && profitChange.dir === 'up') wins.push(tc('cfo_weekly.winNetProfitGrowing', { amount: fmt(t.net_profit, sym) }))
  if (data.inventory.stockout_rate < 15) wins.push(tc('cfo_weekly.winLowStockout', { pct: data.inventory.stockout_rate }))
  if (data.cash.runway_status === 'strong') wins.push(tc('cfo_weekly.winStrongRunway', { months: data.cash.runway_months ?? 0 }))

  if (revChange.dir === 'down' && revChange.pct > 10) concerns.push(tc('cfo_weekly.concernRevenueDown', { pct: revChange.pct }))
  if (t.gross_margin_pct < 20) concerns.push(tc('cfo_weekly.concernLowMargin', { pct: t.gross_margin_pct }))
  if (t.net_profit < 0) concerns.push(tc('cfo_weekly.concernNetLoss', { amount: fmt(t.net_profit, sym) }))
  if (data.inventory.stockout_rate > 40) concerns.push(tc('cfo_weekly.concernHighStockout', { pct: data.inventory.stockout_rate }))
  if (data.cash.runway_months != null && data.cash.runway_months < 3) concerns.push(tc('cfo_weekly.concernLowRunway', { months: data.cash.runway_months }))

  criticalAlerts.forEach(a => concerns.push(a.message))

  const copyDigest = () => {
    const text = [
      tc('cfo_weekly.copyTitle', { range: getWeekRange() }),
      tc('cfo_weekly.copyStatus', { label: statusConfig.label }),
      '',
      tc('cfo_weekly.copySectionFinancials'),
      tc('cfo_weekly.copyRevenue', { value: fmt(t.revenue, sym), sign: revChange.dir === 'up' ? '+' : revChange.dir === 'down' ? '-' : '', pct: revChange.pct }),
      tc('cfo_weekly.copyGrossProfit', { value: fmt(t.gross_profit, sym), margin: t.gross_margin_pct }),
      tc('cfo_weekly.copyNetProfit', { value: fmt(t.net_profit, sym), margin: t.net_margin_pct }),
      '',
      tc('cfo_weekly.copySectionCash'),
      tc('cfo_weekly.copyCashBalance', { value: data.cash.balance > 0 ? fmt(data.cash.balance, sym) : tc('cfo_weekly.notSet') }),
      tc('cfo_weekly.copyRunway', { value: data.cash.runway_months != null ? tc('cfo_weekly.runwayMonths', { n: data.cash.runway_months }) : tc('cfo_weekly.notAvailable') }),
      '',
      tc('cfo_weekly.copySectionInventory'),
      tc('cfo_weekly.copyInventorySummary', { products: data.inventory.total_products, lowOos: data.inventory.low_or_oos, stockout: data.inventory.stockout_rate }),
      '',
      wins.length > 0 ? tc('cfo_weekly.copyWinsSection') + '\n' + wins.map(w => `+ ${w}`).join('\n') : '',
      concerns.length > 0 ? '\n' + tc('cfo_weekly.copyConcernsSection') + '\n' + concerns.map(c => `! ${c}`).join('\n') : '',
      '',
      tc('cfo_weekly.copyFooter'),
    ].filter(Boolean).join('\n')

    navigator.clipboard.writeText(text).then(() => {
      setEmailSent(true)
      setTimeout(() => setEmailSent(false), 3000)
    })
  }

  return (
    <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#6366F1' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_weekly.headerTitle')}</span>
          <span style={{ fontSize: 10, color: 'var(--tx3)' }}>{getWeekRange()}</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {onAsk && (
            <button
              onClick={() => onAsk(tc('cfo_weekly.aiNarrativePrompt', {
                revenue: fmt(t.revenue, sym),
                grossProfit: fmt(t.gross_profit, sym),
                grossMargin: t.gross_margin_pct,
                netProfit: fmt(t.net_profit, sym),
                netMargin: t.net_margin_pct,
                concerns: concerns.length > 0 ? tc('cfo_weekly.aiNarrativeKeyConcerns', { list: concerns.join('; ') }) : tc('cfo_weekly.aiNarrativeNoConcerns'),
                wins: wins.length > 0 ? tc('cfo_weekly.aiNarrativeWins', { list: wins.join('; ') }) : '',
              }))}
              style={{ fontSize: 10, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
            >
              {tc('cfo_weekly.btnAiNarrative')}
            </button>
          )}
          <button
            onClick={copyDigest}
            style={{ fontSize: 10, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
          >
            {emailSent ? tc('cfo_weekly.btnCopied') : tc('cfo_weekly.btnCopyDigest')}
          </button>
        </div>
      </div>

      {/* Status banner */}
      <div style={{ padding: '12px 18px', background: statusConfig.bg, borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 18 }}>{statusConfig.icon}</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: statusConfig.color }}>{statusConfig.label}</div>
          <div style={{ fontSize: 11, color: 'var(--tx3)' }}>
            {overallStatus === 'critical' ? tc('cfo_weekly.bannerCritical', { n: criticalAlerts.length }) :
             overallStatus === 'warning'  ? tc('cfo_weekly.bannerWarning',  { n: warningAlerts.length }) :
             overallStatus === 'healthy'  ? tc('cfo_weekly.bannerHealthy') :
             tc('cfo_weekly.bannerConcern')}
          </div>
        </div>
      </div>

      {/* Key metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, background: 'var(--b)' }}>
        <DigestMetric label={tc('cfo_weekly.metricRevenue')}    value={fmt(t.revenue, sym)}     change={revChange}                              />
        <DigestMetric label={tc('cfo_weekly.metricGrossProfit')} value={fmt(t.gross_profit, sym)} change={pctDiff(t.gross_profit, c.gross_profit)} sub={tc('cfo_weekly.marginSub', { pct: t.gross_margin_pct })} />
        <DigestMetric label={tc('cfo_weekly.metricNetProfit')}  value={fmt(t.net_profit, sym)}   change={profitChange}                           sub={tc('cfo_weekly.marginSub', { pct: t.net_margin_pct })} highlight={t.net_profit < 0} />
      </div>

      {/* Wins */}
      {wins.length > 0 && (
        <div style={{ padding: '12px 18px', borderTop: '1px solid var(--b)' }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#22C55E', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{tc('cfo_weekly.sectionWins')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {wins.map((w, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, fontSize: 11, color: 'var(--tx2)' }}>
                <span style={{ color: '#22C55E', flexShrink: 0 }}>+</span>
                <span>{w}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Concerns */}
      {concerns.length > 0 && (
        <div style={{ padding: '12px 18px', borderTop: '1px solid var(--b)', background: 'rgba(239,68,68,.02)' }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{tc('cfo_weekly.sectionActionItems')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {concerns.map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, fontSize: 11, color: 'var(--tx2)' }}>
                <span style={{ color: '#EF4444', flexShrink: 0 }}>!</span>
                <span>{c}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick stats footer */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 1, background: 'var(--b)', borderTop: '1px solid var(--b)' }}>
        <MiniStat label={tc('cfo_weekly.statCash')}     value={data.cash.balance > 0 ? fmt(data.cash.balance, sym) : '—'} />
        <MiniStat label={tc('cfo_weekly.statRunway')}   value={data.cash.runway_months != null ? `${data.cash.runway_months}mo` : '—'} />
        <MiniStat label={tc('cfo_weekly.statProducts')} value={`${data.inventory.total_products}`} />
        <MiniStat label={tc('cfo_weekly.statStockout')} value={`${data.inventory.stockout_rate}%`} />
      </div>

      <div style={{ padding: '8px 18px', fontSize: 9, color: 'var(--tx3)', textAlign: 'center', borderTop: '1px solid var(--b)' }}>
        {tc('cfo_weekly.autoGeneratedFooter')} · {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
      </div>
    </div>
  )
}

function DigestMetric({ label, value, change, sub, highlight }: {
  label: string; value: string; change: { pct: number; dir: 'up' | 'down' | 'flat' }; sub?: string; highlight?: boolean
}) {
  return (
    <div style={{ padding: '12px 14px', background: highlight ? 'rgba(239,68,68,.03)' : 'var(--sf)', textAlign: 'center' }}>
      <div style={{ fontSize: 9, color: 'var(--tx3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: highlight ? '#EF4444' : 'var(--tx)', fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>{value}</div>
      <div style={{ fontSize: 10, marginTop: 2 }}>
        <span style={{
          fontWeight: 600,
          color: change.dir === 'up' ? '#22C55E' : change.dir === 'down' ? '#EF4444' : 'var(--tx3)',
        }}>
          {change.dir === 'up' ? '▲' : change.dir === 'down' ? '▼' : '–'} {change.pct}%
        </span>
        {sub && <span style={{ color: 'var(--tx3)', marginLeft: 4 }}>{sub}</span>}
      </div>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: '8px 10px', background: 'var(--sf)', textAlign: 'center' }}>
      <div style={{ fontSize: 8, color: 'var(--tx3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    </div>
  )
}
