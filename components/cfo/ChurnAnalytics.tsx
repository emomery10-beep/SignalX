'use client'

import { useState } from 'react'
import { useLang } from '@/components/LanguageProvider'

interface Props {
  totals: { revenue: number; cogs: number; gross_profit: number; fixed_costs: number; net_profit: number; gross_margin_pct: number; net_margin_pct: number }
  pnlMonthly?: Array<{ month: string; revenue: number; cogs: number; fixed: number; net: number; gross_margin_pct: number; net_margin_pct: number }>
  marginByChannel?: Array<{ source: string; label: string; revenue: number; cogs: number; gross_profit: number; margin_pct: number; orders: number; pct_of_total: number }>
  currencySymbol: string
  onAsk: (prompt: string) => void
}

const CARD: React.CSSProperties = { borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }
const GREEN = '#22C55E', RED = '#EF4444', INDIGO = '#6366F1', AMBER = '#F59E0B'

function fmt(n: number, sym: string): string {
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `${n < 0 ? '(' : ''}${sym}${(abs / 1_000_000).toFixed(1)}M${n < 0 ? ')' : ''}`
  if (abs >= 1_000) return `${n < 0 ? '(' : ''}${sym}${(abs / 1_000).toFixed(1)}K${n < 0 ? ')' : ''}`
  return `${n < 0 ? '(' : ''}${sym}${Math.round(abs).toLocaleString()}${n < 0 ? ')' : ''}`
}

interface CohortData {
  month: string
  startingRevenue: number
  currentRevenue: number
  retentionPct: number
  churnPct: number
  expansionPct: number
  netRetentionPct: number
}

function estimateCohorts(pnlMonthly: NonNullable<Props['pnlMonthly']>): CohortData[] {
  if (pnlMonthly.length < 2) return []
  return pnlMonthly.slice(1).map((m, i) => {
    const prev = pnlMonthly[i]
    const delta = m.revenue - prev.revenue
    const churnEstimate = Math.max(-delta * 0.6, 0) // estimate: 60% of negative delta is churn
    const expansionEstimate = Math.max(delta * 0.4, 0) // estimate: 40% of positive delta is expansion
    const retainedRevenue = prev.revenue - churnEstimate
    return {
      month: m.month,
      startingRevenue: prev.revenue,
      currentRevenue: m.revenue,
      retentionPct: prev.revenue > 0 ? (retainedRevenue / prev.revenue) * 100 : 100,
      churnPct: prev.revenue > 0 ? (churnEstimate / prev.revenue) * 100 : 0,
      expansionPct: prev.revenue > 0 ? (expansionEstimate / prev.revenue) * 100 : 0,
      netRetentionPct: prev.revenue > 0 ? (m.revenue / prev.revenue) * 100 : 100,
    }
  })
}

export default function ChurnAnalytics({ totals, pnlMonthly, marginByChannel, currencySymbol: sym, onAsk }: Props) {
  const { tc } = useLang()
  const [view, setView] = useState<'overview' | 'cohort' | 'channel'>('overview')

  const cohorts = pnlMonthly ? estimateCohorts(pnlMonthly) : []
  const hasCohorts = cohorts.length > 0

  // Aggregate metrics
  const avgRetention = hasCohorts ? cohorts.reduce((s, c) => s + c.retentionPct, 0) / cohorts.length : 0
  const avgChurn = hasCohorts ? cohorts.reduce((s, c) => s + c.churnPct, 0) / cohorts.length : 0
  const avgNetRetention = hasCohorts ? cohorts.reduce((s, c) => s + c.netRetentionPct, 0) / cohorts.length : 0
  const latestChurn = hasCohorts ? cohorts[cohorts.length - 1].churnPct : 0
  const latestNetRetention = hasCohorts ? cohorts[cohorts.length - 1].netRetentionPct : 0

  // Revenue at risk (estimated monthly churn revenue)
  const monthlyChurnRevenue = totals.revenue * (avgChurn / 100)
  const annualChurnRevenue = monthlyChurnRevenue * 12

  // Churn trend
  const churnTrend = hasCohorts && cohorts.length >= 3
    ? cohorts[cohorts.length - 1].churnPct - cohorts[cohorts.length - 3].churnPct
    : 0

  const churnColor = avgChurn <= 3 ? GREEN : avgChurn <= 8 ? AMBER : RED
  const nrrColor = avgNetRetention >= 110 ? GREEN : avgNetRetention >= 95 ? AMBER : RED

  // Channel retention (estimate from revenue share stability)
  const channels = marginByChannel || []

  if (!hasCohorts && channels.length === 0) return null

  return (
    <div style={CARD}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: RED }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_churn.title')}</span>
          {hasCohorts && (
            <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
              background: `${nrrColor}15`, color: nrrColor }}>
              NRR {avgNetRetention.toFixed(0)}%
            </span>
          )}
        </div>
        <button onClick={() => onAsk(tc('cfo_churn.ask_prompt', { retention: avgRetention.toFixed(1), churn: avgChurn.toFixed(1), nrr: avgNetRetention.toFixed(1), atRisk: fmt(monthlyChurnRevenue, sym), trend: churnTrend > 0 ? tc('cfo_churn.trend_worsening') : tc('cfo_churn.trend_improving') }))}
          style={{ fontSize: 10, color: INDIGO, background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}>
          {tc('cfo_churn.ask_ai')}
        </button>
      </div>

      <div style={{ padding: '16px 18px' }}>
        {/* View tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
          {(['overview', 'cohort', 'channel'] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              style={{ fontSize: 10, padding: '4px 10px', borderRadius: 6,
                background: view === v ? 'rgba(99,102,241,.1)' : 'transparent',
                color: view === v ? INDIGO : 'var(--tx3)', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}>
              {tc('cfo_churn.tab_' + v)}
            </button>
          ))}
        </div>

        {/* Overview */}
        {view === 'overview' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--b)', borderRadius: 8, overflow: 'hidden', marginBottom: 14 }}>
              <div style={{ padding: '10px 8px', background: 'var(--sf)', textAlign: 'center' }}>
                <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: 3 }}>{tc('cfo_churn.gross_retention')}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: avgRetention >= 90 ? GREEN : AMBER, fontVariantNumeric: 'tabular-nums' }}>{avgRetention.toFixed(1)}%</div>
              </div>
              <div style={{ padding: '10px 8px', background: 'var(--sf)', textAlign: 'center' }}>
                <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: 3 }}>{tc('cfo_churn.monthly_churn')}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: churnColor, fontVariantNumeric: 'tabular-nums' }}>{avgChurn.toFixed(1)}%</div>
              </div>
              <div style={{ padding: '10px 8px', background: 'var(--sf)', textAlign: 'center' }}>
                <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: 3 }}>{tc('cfo_churn.net_retention')}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: nrrColor, fontVariantNumeric: 'tabular-nums' }}>{avgNetRetention.toFixed(1)}%</div>
              </div>
            </div>

            {/* Revenue at risk */}
            <div style={{ padding: 12, borderRadius: 8, border: `1px solid ${RED}20`, background: `${RED}06`, marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx)' }}>{tc('cfo_churn.revenue_at_risk')}</div>
                  <div style={{ fontSize: 10, color: 'var(--tx3)' }}>{tc('cfo_churn.revenue_at_risk_desc')}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: RED, fontVariantNumeric: 'tabular-nums' }}>{fmt(monthlyChurnRevenue, sym)}{tc('cfo_churn.per_month_suffix')}</div>
                  <div style={{ fontSize: 10, color: 'var(--tx3)' }}>{fmt(annualChurnRevenue, sym)}{tc('cfo_churn.per_year_suffix')}</div>
                </div>
              </div>
            </div>

            {/* Churn trend mini chart */}
            {hasCohorts && (
              <>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                  {tc('cfo_churn.churn_trend')}
                  {churnTrend !== 0 && (
                    <span style={{ marginLeft: 6, color: churnTrend > 0 ? RED : GREEN, fontWeight: 700 }}>
                      {churnTrend > 0 ? tc('cfo_churn.trend_up_worsening') : tc('cfo_churn.trend_down_improving')}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 50, marginBottom: 4 }}>
                  {cohorts.map((c, i) => {
                    const maxChurn = Math.max(...cohorts.map(x => x.churnPct), 1)
                    const h = (c.churnPct / maxChurn) * 42
                    const color = c.churnPct <= 3 ? GREEN : c.churnPct <= 8 ? AMBER : RED
                    return (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <div style={{ fontSize: 8, fontWeight: 600, color }}>{c.churnPct.toFixed(1)}%</div>
                        <div style={{ width: '70%', height: Math.max(h, 2), borderRadius: 3, background: color, opacity: 0.7 }} />
                        <div style={{ fontSize: 7, color: 'var(--tx3)' }}>{c.month}</div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}

            {/* Retention strategies */}
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 14, marginBottom: 8 }}>
              {tc('cfo_churn.retention_strategies')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {avgChurn > 5 && (
                <InsightRow color={RED} label={tc('cfo_churn.high_churn_alert')} value={tc('cfo_churn.high_churn_value', { churn: avgChurn.toFixed(1), atRisk: fmt(monthlyChurnRevenue, sym) })} />
              )}
              {latestNetRetention < 100 && (
                <InsightRow color={AMBER} label={tc('cfo_churn.net_shrinking')} value={tc('cfo_churn.net_shrinking_value')} />
              )}
              {latestNetRetention >= 110 && (
                <InsightRow color={GREEN} label={tc('cfo_churn.strong_expansion')} value={tc('cfo_churn.strong_expansion_value', { nrr: latestNetRetention.toFixed(0) })} />
              )}
              <InsightRow color={INDIGO} label={tc('cfo_churn.reduce_churn')} value={tc('cfo_churn.reduce_churn_value', { monthly: fmt(totals.revenue * 0.01, sym), yearly: fmt(totals.revenue * 0.01 * 12, sym) })} />
            </div>
          </>
        )}

        {/* Cohort view */}
        {view === 'cohort' && hasCohorts && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--b)' }}>
                  <th style={{ textAlign: 'left', padding: '5px 0', fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase' }}>{tc('cfo_churn.col_month')}</th>
                  <th style={{ textAlign: 'right', padding: '5px 0', fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase' }}>{tc('cfo_churn.col_revenue')}</th>
                  <th style={{ textAlign: 'right', padding: '5px 0', fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase' }}>{tc('cfo_churn.col_retention')}</th>
                  <th style={{ textAlign: 'right', padding: '5px 0', fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase' }}>{tc('cfo_churn.col_churn')}</th>
                  <th style={{ textAlign: 'right', padding: '5px 0', fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase' }}>{tc('cfo_churn.col_nrr')}</th>
                </tr>
              </thead>
              <tbody>
                {cohorts.map(c => (
                  <tr key={c.month} style={{ borderBottom: '1px solid var(--b)' }}>
                    <td style={{ padding: '6px 0', color: 'var(--tx)' }}>{c.month}</td>
                    <td style={{ padding: '6px 0', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmt(c.currentRevenue, sym)}</td>
                    <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 600, color: c.retentionPct >= 90 ? GREEN : AMBER }}>{c.retentionPct.toFixed(1)}%</td>
                    <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 600, color: c.churnPct <= 3 ? GREEN : c.churnPct <= 8 ? AMBER : RED }}>{c.churnPct.toFixed(1)}%</td>
                    <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 700, color: c.netRetentionPct >= 100 ? GREEN : RED }}>{c.netRetentionPct.toFixed(0)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Channel view */}
        {view === 'channel' && channels.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {channels.map(ch => {
              const share = ch.pct_of_total
              const riskLevel = share > 60 ? 'high' : share > 30 ? 'medium' : 'low'
              const riskColor = riskLevel === 'high' ? RED : riskLevel === 'medium' ? AMBER : GREEN
              return (
                <div key={ch.source} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid var(--b)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)' }}>{ch.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx)', fontVariantNumeric: 'tabular-nums' }}>{fmt(ch.revenue, sym)}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 10, fontSize: 10, color: 'var(--tx3)' }}>
                    <span>{tc('cfo_churn.orders', { n: ch.orders })}</span>
                    <span>{tc('cfo_churn.margin', { n: ch.margin_pct })}</span>
                    <span style={{ color: riskColor, fontWeight: 600 }}>{tc('cfo_churn.pct_of_revenue', { n: share.toFixed(0) })}</span>
                  </div>
                  {share > 50 && (
                    <div style={{ fontSize: 10, color: RED, fontWeight: 500, marginTop: 4 }}>
                      {tc('cfo_churn.concentration_risk', { n: share.toFixed(0) })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function InsightRow({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${color}20`, background: `${color}08`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--tx)' }}>{label}</span>
      <span style={{ fontSize: 10, fontWeight: 600, color, fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>{value}</span>
    </div>
  )
}
