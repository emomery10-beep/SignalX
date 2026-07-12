'use client'
import { useState, useEffect } from 'react'
import { useLang } from '@/components/LanguageProvider'
import CostConfigDrawer, { loadCostConfig, type CostConfig } from './CostConfigDrawer'

interface Props {
  totals: { revenue: number; cogs: number; gross_profit: number; fixed_costs: number; net_profit: number }
  cash: { balance: number; monthly_fixed: number; monthly_fixed_total?: number; runway_months: number | null; runway_status: string; daily_net_burn: number }
  dailyCashflow?: Array<{ date: string; inflow: number; outflow: number; net: number }>
  receivablesAging?: { current: number; overdue_30: number; overdue_60: number; overdue_90: number }
  receivablesSummary?: { total_receivables: number; total_payables: number; overdue_receivables: number }
  sourceBreakdown?: Array<{ source: string; label: string; revenue: number; cogs: number; pct_of_total: number }>
  currencySymbol: string
  onAsk: (prompt: string) => void
  onConfigSaved?: () => void
}

const GREEN = '#22C55E'
const ORANGE = '#F97316'
const RED = '#EF4444'
const INDIGO = '#6366F1'
const YELLOW = '#F59E0B'

type ActiveCard = 'burn' | 'runway' | null
type ChartRange = '7d' | '30d' | '90d'

export default function CashFlowStatement({
  totals,
  cash: cashProp,
  dailyCashflow,
  receivablesAging,
  receivablesSummary,
  sourceBreakdown,
  currencySymbol: sym,
  onAsk,
  onConfigSaved,
}: Props) {
  const { tc } = useLang()
  // ── Cost config from localStorage ──
  const [costConfig, setCostConfig] = useState<CostConfig | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerSection, setDrawerSection] = useState<'balance' | 'fixed' | 'variable'>('balance')
  const [activeCard, setActiveCard] = useState<ActiveCard>(null)
  const [chartRange, setChartRange] = useState<ChartRange>('30d')
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [showRollup, setShowRollup] = useState(false)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; d: { date: string; inflow: number; outflow: number; net: number } } | null>(null)

  useEffect(() => {
    const cfg = loadCostConfig()
    if (cfg.cashBalance > 0 || cfg.fixedCosts.some(c => c.amount > 0)) {
      setCostConfig(cfg)
    }
  }, [])

  // Override API values with localStorage if set
  const userBalance = costConfig?.cashBalance && costConfig.cashBalance > 0 ? costConfig.cashBalance : cashProp.balance
  const autoMonthlyFixed = cashProp.monthly_fixed_total ?? cashProp.monthly_fixed
  const userMonthlyFixed = costConfig ? costConfig.fixedCosts.reduce((s, c) => s + (c.amount || 0), 0) : autoMonthlyFixed
  const effectiveMonthlyFixed = userMonthlyFixed || autoMonthlyFixed

  // Recompute daily burn if we have overrides
  const periodDays = dailyCashflow?.length || 30
  const avgDailyRevenue = totals.revenue / periodDays
  const avgDailyCogs = totals.cogs / periodDays
  const effectiveDailyBurn = avgDailyRevenue - avgDailyCogs - (effectiveMonthlyFixed / 30)
  const isCashPositive = effectiveDailyBurn >= 0
  const effectiveRunwayDays = userBalance > 0 && !isCashPositive ? userBalance / Math.abs(effectiveDailyBurn) : null
  const effectiveRunwayMonths = effectiveRunwayDays ? Math.round((effectiveRunwayDays / 30) * 10) / 10 : (!isCashPositive ? cashProp.runway_months : null)

  const runwayStatus = (() => {
    if (isCashPositive) return 'strong'
    const r = effectiveRunwayMonths
    if (r === null) return cashProp.runway_status
    if (r <= 1) return 'critical'
    if (r <= 3) return 'warning'
    if (r <= 6) return 'healthy'
    return 'strong'
  })()

  const fmt = (n: number, short = false) => {
    const abs = Math.abs(n)
    if (abs >= 1_000_000) return `${n < 0 ? '(' : ''}${sym}${(abs / 1_000_000).toFixed(1)}M${n < 0 ? ')' : ''}`
    if (abs >= 1_000) return `${n < 0 ? '(' : ''}${sym}${(abs / 1_000).toFixed(short ? 0 : 1)}K${n < 0 ? ')' : ''}`
    return `${n < 0 ? '(' : ''}${sym}${Math.round(abs).toLocaleString()}${n < 0 ? ')' : ''}`
  }

  const runwayColor = (status: string) => {
    if (status === 'critical') return RED
    if (status === 'warning') return YELLOW
    return GREEN
  }

  const statusLabel = (status: string) => {
    if (status === 'critical') return tc('cfo_cashflow.status_critical')
    if (status === 'warning') return tc('cfo_cashflow.status_warning')
    if (status === 'healthy') return tc('cfo_cashflow.status_healthy')
    if (status === 'strong') return tc('cfo_cashflow.status_strong')
    return tc('cfo_cashflow.status_unknown')
  }

  // ── Chart data filtered by range ──
  const allDaily = dailyCashflow?.filter(d => d.date) ?? []
  const rangeMap: Record<ChartRange, number> = { '7d': 7, '30d': 30, '90d': 90 }
  const rangeN = rangeMap[chartRange]
  const filteredDaily = allDaily.length > rangeN ? allDaily.slice(-rangeN) : allDaily

  const chartData = (() => {
    if (filteredDaily.length === 0) return null
    if (filteredDaily.length <= 30) return filteredDaily
    const weeks: Array<{ date: string; inflow: number; outflow: number; net: number }> = []
    for (let i = 0; i < filteredDaily.length; i += 7) {
      const chunk = filteredDaily.slice(i, i + 7)
      weeks.push({
        date: chunk[0].date,
        inflow: chunk.reduce((s, d) => s + d.inflow, 0),
        outflow: chunk.reduce((s, d) => s + d.outflow, 0),
        net: chunk.reduce((s, d) => s + d.net, 0),
      })
    }
    return weeks
  })()

  // ── Statement math ──
  const netOperating = totals.revenue - totals.cogs - totals.fixed_costs
  const netFinancing = (receivablesSummary?.total_receivables ?? 0) - (receivablesSummary?.total_payables ?? 0)
  const netCashPosition = netOperating + netFinancing

  const hasAging = receivablesAging && (
    receivablesAging.current > 0 || receivablesAging.overdue_30 > 0 ||
    receivablesAging.overdue_60 > 0 || receivablesAging.overdue_90 > 0
  )
  const agingTotal = hasAging
    ? receivablesAging!.current + receivablesAging!.overdue_30 + receivablesAging!.overdue_60 + receivablesAging!.overdue_90
    : 0
  const atRisk = hasAging
    ? receivablesAging!.overdue_30 + receivablesAging!.overdue_60 + receivablesAging!.overdue_90
    : 0

  // ── Daily stats for drill-downs ──
  const dailyNets = allDaily.map(d => d.net)
  const bestDay = allDaily.length ? allDaily.reduce((m, d) => d.net > m.net ? d : m) : null
  const worstDay = allDaily.length ? allDaily.reduce((m, d) => d.net < m.net ? d : m) : null
  const avgNet = dailyNets.length ? dailyNets.reduce((a, b) => a + b, 0) / dailyNets.length : 0
  const positiveDays = dailyNets.filter(n => n >= 0).length
  const negativeDays = dailyNets.filter(n => n < 0).length

  // ── Runway scenarios ──
  const runwayScenarios = [
    { label: tc('cfo_cashflow.runway_scenario_current'), revMult: 1, costMult: 1 },
    { label: tc('cfo_cashflow.runway_scenario_rev_up'), revMult: 1.2, costMult: 1 },
    { label: tc('cfo_cashflow.runway_scenario_rev_down'), revMult: 0.8, costMult: 1 },
    { label: tc('cfo_cashflow.runway_scenario_fixed_down'), revMult: 1, costMult: 0.85 },
  ].map(s => {
    const dailyRev = avgDailyRevenue * s.revMult
    const dailyCost = avgDailyCogs + (effectiveMonthlyFixed * s.costMult / 30)
    const dn = dailyRev - dailyCost
    const rwDays = userBalance > 0 && dn < 0 ? userBalance / Math.abs(dn) : null
    const rwMonths = rwDays ? Math.round((rwDays / 30) * 10) / 10 : null
    return { ...s, dailyNet: dn, runwayMonths: rwMonths }
  })

  // What would it take to reach 12-month runway?
  const targetRunwayDays = 365
  const targetDailyBurn = userBalance > 0 ? -(userBalance / targetRunwayDays) : null
  const revenueNeeded = targetDailyBurn !== null
    ? avgDailyCogs + (effectiveMonthlyFixed / 30) + targetDailyBurn
    : null
  const revenueGap = revenueNeeded !== null ? revenueNeeded - avgDailyRevenue : null

  // 12-month cash projection
  const projMonths = Array.from({ length: 13 }, (_, i) => {
    const bal = userBalance + effectiveDailyBurn * 30 * i
    return { month: i, balance: bal }
  })

  // ── Selected day data ──
  const selectedDayData = selectedDay ? allDaily.find(d => d.date === selectedDay) : null

  // ── Row helper ──
  const Row = ({ label, value, bold, italic, color, note, borderTop, onClick }: {
    label: string; value?: string; bold?: boolean; italic?: boolean; color?: string; note?: string; borderTop?: boolean; onClick?: () => void
  }) => (
    <div
      onClick={onClick}
      style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '7px 0',
        borderTop: borderTop ? '1px solid var(--b)' : undefined,
        fontWeight: bold ? 700 : 400,
        fontStyle: italic ? 'italic' : 'normal',
        fontSize: bold ? 13 : 12,
        cursor: onClick ? 'pointer' : undefined,
      }}
    >
      <span style={{ color: italic ? 'var(--tx3)' : 'var(--tx)' }}>{label}</span>
      <span style={{ color: color || 'var(--tx)', fontFamily: 'var(--font-sora, inherit)' }}>
        {value ?? ''}
        {note && <span style={{ fontSize: 9, color: 'var(--tx3)', fontStyle: 'italic', marginLeft: 6 }}>{note}</span>}
      </span>
    </div>
  )

  const SectionHeader = ({ title }: { title: string }) => (
    <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', padding: '10px 0 4px', marginTop: 8, borderBottom: '2px solid var(--b)' }}>
      {title}
    </div>
  )

  // ── Position card ──
  const PositionCard = ({ id, label, value, color, notSet, subLabel, clickable }: {
    id: ActiveCard | 'balance' | 'fixed'; label: string; value: string; color: string; notSet?: boolean; subLabel?: string; clickable?: boolean
  }) => {
    const isActive = activeCard === id
    const canClick = notSet || clickable || id === 'burn' || id === 'runway'
    return (
      <div
        onClick={() => {
          if (id === 'balance') { setDrawerSection('balance'); setDrawerOpen(true) }
          else if (id === 'fixed') { setDrawerSection('fixed'); setDrawerOpen(true) }
          else if (id === 'burn' || id === 'runway') { setActiveCard(isActive ? null : id as ActiveCard) }
        }}
        style={{
          padding: '12px 14px', borderRadius: 12, border: isActive ? `1px solid ${INDIGO}` : '1px solid var(--b)',
          background: isActive ? `${INDIGO}06` : 'var(--sf)',
          position: 'relative', overflow: 'hidden', cursor: canClick ? 'pointer' : 'default',
          transition: 'border-color 150ms, box-shadow 150ms',
          boxShadow: isActive ? `0 0 0 2px ${INDIGO}20` : undefined,
        }}
        onMouseEnter={canClick ? e => { e.currentTarget.style.borderColor = INDIGO; e.currentTarget.style.boxShadow = `0 2px 8px rgba(99,102,241,.12)` } : undefined}
        onMouseLeave={canClick ? e => { e.currentTarget.style.borderColor = isActive ? INDIGO : 'var(--b)'; e.currentTarget.style.boxShadow = isActive ? `0 0 0 2px ${INDIGO}20` : 'none' } : undefined}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: notSet ? 'var(--tx3)' : color, borderRadius: '12px 0 0 12px' }} />
        <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {label}
          {canClick && <span style={{ fontSize: 9, color: INDIGO, opacity: 0.7 }}>{isActive ? '▲' : id === 'balance' || id === 'fixed' ? '✎' : '▼'}</span>}
        </div>
        {notSet ? (
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx3)' }}>Not set</div>
            <div style={{ fontSize: 9, color: INDIGO, marginTop: 2 }}>Click to set</div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 18, fontWeight: 700, color, fontFamily: 'var(--font-sora, inherit)', letterSpacing: '-0.02em' }}>{value}</div>
            {subLabel && <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 2 }}>{subLabel}</div>}
          </>
        )}
      </div>
    )
  }

  // ── Daily Burn drill-down panel ──
  const renderBurnPanel = () => (
    <div style={{ gridColumn: '1 / -1', borderRadius: 12, border: `1px solid ${INDIGO}30`, background: `${INDIGO}04`, padding: '14px 16px', marginTop: 4 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--tx)', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{tc('cfo_cashflow.burn_title')}</span>
        <button onClick={() => { onAsk(tc('cfo_cashflow.burn_ask_prompt', { net: fmt(effectiveDailyBurn), revenue: fmt(avgDailyRevenue), cogs: fmt(avgDailyCogs), fixed: fmt(effectiveMonthlyFixed / 30), bestDate: bestDay?.date || '', bestNet: fmt(bestDay?.net || 0), worstDate: worstDay?.date || '', worstNet: fmt(worstDay?.net || 0), positive: positiveDays, negative: negativeDays })) }} style={{ fontSize: 9, color: INDIGO, background: `${INDIGO}14`, border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>{tc('cfo_cashflow.ask_ai')}</button>
      </div>

      {/* Formula */}
      <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--ev)', marginBottom: 12, fontSize: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', color: 'var(--tx3)' }}>
          <span style={{ color: GREEN, fontWeight: 600 }}>{fmt(avgDailyRevenue)}/day</span>
          <span>{tc('cfo_cashflow.burn_revenue')}</span>
          <span>−</span>
          <span style={{ color: ORANGE, fontWeight: 600 }}>{fmt(avgDailyCogs)}/day</span>
          <span>{tc('cfo_cashflow.burn_cogs')}</span>
          <span>−</span>
          <span style={{ color: RED, fontWeight: 600 }}>{fmt(effectiveMonthlyFixed / 30)}/day</span>
          <span>{tc('cfo_cashflow.burn_fixed')}</span>
          <span>=</span>
          <span style={{ color: effectiveDailyBurn >= 0 ? GREEN : RED, fontWeight: 700 }}>{fmt(effectiveDailyBurn)}/day</span>
        </div>
        {effectiveMonthlyFixed === 0 && (
          <div style={{ fontSize: 9, color: YELLOW, marginTop: 6 }}>{tc('cfo_cashflow.burn_fixed_warning')}</div>
        )}
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 12 }}>
        {[
          { label: tc('cfo_cashflow.burn_best_day'), value: bestDay ? fmt(bestDay.net) : '—', sub: bestDay?.date.slice(5) || '', color: GREEN },
          { label: tc('cfo_cashflow.burn_worst_day'), value: worstDay ? fmt(worstDay.net) : '—', sub: worstDay?.date.slice(5) || '', color: RED },
          { label: tc('cfo_cashflow.burn_positive_days'), value: `${positiveDays}`, sub: tc('cfo_cashflow.burn_of_total', { n: allDaily.length }), color: GREEN },
          { label: tc('cfo_cashflow.burn_avg_daily_net'), value: fmt(avgNet), sub: tc('cfo_cashflow.burn_this_period'), color: avgNet >= 0 ? GREEN : RED },
        ].map(m => (
          <div key={m.label} style={{ textAlign: 'center', padding: '8px', borderRadius: 8, background: 'var(--sf)', border: '1px solid var(--b)' }}>
            <div style={{ fontSize: 9, color: 'var(--tx3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: m.color }}>{m.value}</div>
            <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 2 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Sensitivity */}
      <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>{tc('cfo_cashflow.burn_sensitivity')}</div>
      <div style={{ borderRadius: 8, border: '1px solid var(--b)', overflow: 'hidden' }}>
        {[
          { label: tc('cfo_cashflow.burn_revenue_up_10'), dn: avgDailyRevenue * 1.1 - avgDailyCogs - effectiveMonthlyFixed / 30 },
          { label: tc('cfo_cashflow.burn_revenue_down_10'), dn: avgDailyRevenue * 0.9 - avgDailyCogs - effectiveMonthlyFixed / 30 },
          { label: tc('cfo_cashflow.burn_revenue_down_20'), dn: avgDailyRevenue * 0.8 - avgDailyCogs - effectiveMonthlyFixed / 30 },
          { label: tc('cfo_cashflow.burn_costs_up_10'), dn: avgDailyRevenue - avgDailyCogs * 1.1 - effectiveMonthlyFixed * 1.1 / 30 },
        ].map((s, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', borderTop: i > 0 ? '1px solid var(--b)' : undefined, fontSize: 9 }}>
            <span style={{ color: 'var(--tx3)' }}>{s.label}</span>
            <span style={{ fontWeight: 600, color: s.dn >= 0 ? GREEN : RED }}>{fmt(s.dn)}/day</span>
          </div>
        ))}
      </div>

      {/* Channel breakdown */}
      {sourceBreakdown && sourceBreakdown.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>{tc('cfo_cashflow.burn_by_channel')}</div>
          {sourceBreakdown.map((s, i) => {
            const dailyRev = s.revenue / periodDays
            const dailyGP = (s.revenue - s.cogs) / periodDays
            return (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderTop: i > 0 ? '1px solid var(--b)' : undefined, fontSize: 9 }}>
                <span style={{ color: 'var(--tx)' }}>{s.label}</span>
                <div style={{ display: 'flex', gap: 10, fontSize: 9 }}>
                  <span style={{ color: GREEN }}>{tc('cfo_cashflow.burn_per_day_rev', { value: fmt(dailyRev) })}</span>
                  <span style={{ color: dailyGP >= 0 ? GREEN : RED, fontWeight: 600 }}>{tc('cfo_cashflow.burn_per_day_gp', { value: fmt(dailyGP) })}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )

  // ── Runway drill-down panel ──
  const renderRunwayPanel = () => {
    const rwMonths = effectiveRunwayMonths
    const rwDays = rwMonths ? Math.round(rwMonths * 30) : null

    return (
      <div style={{ gridColumn: '1 / -1', borderRadius: 12, border: `1px solid ${INDIGO}30`, background: `${INDIGO}04`, padding: '14px 16px', marginTop: 4 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--tx)', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{tc('cfo_cashflow.runway_title')}</span>
          <button onClick={() => onAsk(isCashPositive ? tc('cfo_cashflow.runway_ask_positive', { net: fmt(effectiveDailyBurn) }) : tc('cfo_cashflow.runway_ask_negative', { balance: fmt(userBalance), burn: fmt(Math.abs(effectiveDailyBurn)), runway: rwMonths ? tc('cfo_cashflow.runway_ask_runway_months', { n: rwMonths }) : tc('cfo_cashflow.runway_ask_runway_unknown') }))} style={{ fontSize: 9, color: INDIGO, background: `${INDIGO}14`, border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>{tc('cfo_cashflow.ask_ai')}</button>
        </div>

        {/* Status + formula */}
        <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--ev)', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 9, fontWeight: 700, background: `${runwayColor(runwayStatus)}20`, color: runwayColor(runwayStatus) }}>
              {statusLabel(runwayStatus).toUpperCase()}
            </span>
            <span style={{ fontSize: 9, color: 'var(--tx3)' }}>
              {isCashPositive ? tc('cfo_cashflow.runway_desc_positive') : runwayStatus === 'critical' ? tc('cfo_cashflow.runway_desc_critical') : runwayStatus === 'warning' ? tc('cfo_cashflow.runway_desc_warning') : runwayStatus === 'healthy' ? tc('cfo_cashflow.runway_desc_healthy') : tc('cfo_cashflow.runway_desc_strong')}
            </span>
          </div>
          {userBalance > 0 && effectiveDailyBurn < 0 ? (
            <div style={{ fontSize: 10, color: 'var(--tx3)', display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
              <span style={{ color: GREEN, fontWeight: 600 }}>{fmt(userBalance)}</span>
              <span>{tc('cfo_cashflow.runway_formula_cash_div')}</span>
              <span style={{ color: RED, fontWeight: 600 }}>{tc('cfo_cashflow.runway_formula_burn', { value: fmt(Math.abs(effectiveDailyBurn)) })}</span>
              <span>{tc('cfo_cashflow.runway_formula_burn_eq')}</span>
              <span style={{ fontWeight: 700, color: runwayColor(runwayStatus) }}>{tc('cfo_cashflow.runway_formula_result', { days: rwDays ?? 0, months: rwMonths ?? 0 })}</span>
            </div>
          ) : effectiveDailyBurn >= 0 ? (
            <div style={{ fontSize: 10, color: GREEN, fontWeight: 600 }}>{tc('cfo_cashflow.runway_cash_positive_line')}</div>
          ) : (
            <div style={{ fontSize: 10, color: 'var(--tx3)' }}>{tc('cfo_cashflow.runway_set_balance_line')}</div>
          )}
        </div>

        {/* Scenarios */}
        <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>{tc('cfo_cashflow.runway_scenarios')}</div>
        <div style={{ borderRadius: 8, border: '1px solid var(--b)', overflow: 'hidden', marginBottom: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 90px', background: 'var(--ev)', borderBottom: '1px solid var(--b)' }}>
            {[tc('cfo_cashflow.runway_col_scenario'), tc('cfo_cashflow.runway_col_daily_net'), tc('cfo_cashflow.runway_col_runway')].map(h => (
              <div key={h} style={{ padding: '6px 10px', fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.04em' }}>{h}</div>
            ))}
          </div>
          {runwayScenarios.map((s, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 90px', borderTop: i > 0 ? '1px solid var(--b)' : undefined }}>
              <div style={{ padding: '8px 10px', fontSize: 9, color: 'var(--tx)', fontWeight: i === 0 ? 600 : 400 }}>{s.label}</div>
              <div style={{ padding: '8px 10px', fontSize: 9, fontWeight: 600, color: s.dailyNet >= 0 ? GREEN : RED }}>{fmt(s.dailyNet)}/day</div>
              <div style={{ padding: '8px 10px', fontSize: 9, fontWeight: 600, color: s.runwayMonths === null ? GREEN : runwayColor(s.runwayMonths <= 1 ? 'critical' : s.runwayMonths <= 3 ? 'warning' : 'healthy') }}>
                {s.runwayMonths === null ? (s.dailyNet >= 0 ? tc('cfo_cashflow.runway_cash_positive_short') : '—') : tc('cfo_cashflow.runway_months_short', { n: s.runwayMonths })}
              </div>
            </div>
          ))}
        </div>

        {/* 12-month projection mini-chart */}
        <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>{tc('cfo_cashflow.runway_projection_title')}</div>
        <div style={{ borderRadius: 8, background: 'var(--ev)', padding: '10px', position: 'relative', height: 70, overflow: 'hidden' }}>
          <svg viewBox="0 0 400 60" width="100%" height="60" style={{ display: 'block' }}>
            {(() => {
              const vals = projMonths.map(m => m.balance)
              const minV = Math.min(...vals, 0)
              const maxV = Math.max(...vals, 1)
              const range = maxV - minV || 1
              const pts = projMonths.map((m, i) => {
                const x = (i / (projMonths.length - 1)) * 390 + 5
                const y = 55 - ((m.balance - minV) / range) * 50
                return `${x},${y}`
              }).join(' ')
              const zeroY = 55 - ((0 - minV) / range) * 50
              const lineColor = projMonths[projMonths.length - 1].balance >= 0 ? GREEN : RED
              return (
                <>
                  {minV < 0 && <line x1={0} y1={zeroY} x2={400} y2={zeroY} stroke={RED} strokeWidth={0.5} strokeDasharray="3,2" opacity={0.5} />}
                  <polyline points={pts} fill="none" stroke={lineColor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  {projMonths.map((m, i) => {
                    const x = (i / (projMonths.length - 1)) * 390 + 5
                    const y = 55 - ((m.balance - minV) / range) * 50
                    return <circle key={i} cx={x} cy={y} r={2} fill={m.balance >= 0 ? GREEN : RED} />
                  })}
                </>
              )
            })()}
          </svg>
          <div style={{ position: 'absolute', bottom: 4, left: 10, fontSize: 9, color: 'var(--tx3)' }}>{tc('cfo_cashflow.runway_now')}</div>
          <div style={{ position: 'absolute', bottom: 4, right: 10, fontSize: 9, color: 'var(--tx3)' }}>{tc('cfo_cashflow.runway_12mo')}</div>
          <div style={{ position: 'absolute', top: 4, right: 10, fontSize: 9, fontWeight: 600, color: projMonths[projMonths.length - 1].balance >= 0 ? GREEN : RED }}>{fmt(projMonths[projMonths.length - 1].balance)}</div>
        </div>

        {/* Target calculation */}
        {revenueGap !== null && effectiveDailyBurn < 0 && (
          <div style={{ marginTop: 10, padding: '10px 14px', borderRadius: 10, background: `${YELLOW}08`, border: `1px solid ${YELLOW}30`, fontSize: 9, color: 'var(--tx)', lineHeight: 1.6 }}>
            {tc('cfo_cashflow.runway_target_prefix')} <strong>{tc('cfo_cashflow.runway_target_12month')}</strong>: {tc('cfo_cashflow.runway_target_need')} <strong style={{ color: GREEN }}>{fmt(revenueNeeded || 0)}</strong>
            {revenueGap > 0
              ? tc('cfo_cashflow.runway_target_more', { gap: fmt(revenueGap), pct: Math.round((revenueGap / avgDailyRevenue) * 100) })
              : tc('cfo_cashflow.runway_target_on_track')}
          </div>
        )}
      </div>
    )
  }

  // ── Interactive chart ──
  const renderChart = () => {
    if (!chartData || chartData.length === 0) return null

    const W = 600, H = 200
    const padL = 56, padR = 16, padT = 20, padB = 36
    const chartW = W - padL - padR
    const chartH = H - padT - padB

    const maxVal = Math.max(...chartData.map(d => Math.max(d.inflow, d.outflow)), 1)
    let cum = 0
    const cumPoints = chartData.map(d => { cum += d.net; return cum })
    const cumMin = Math.min(...cumPoints, 0)
    const cumMax = Math.max(...cumPoints, 1)
    const cumRange = cumMax - cumMin || 1

    const barGroupW = chartW / chartData.length
    const barW = Math.max(2, barGroupW * 0.3)
    const gap = 2
    const zeroY = padT + chartH / 2
    const scaleBar = (v: number) => (v / maxVal) * (chartH / 2)
    const labelInterval = chartData.length <= 10 ? 1 : chartData.length <= 20 ? 3 : 5
    const yTicks = [maxVal, maxVal / 2, 0, -maxVal / 2, -maxVal]
    const yScale = (v: number) => zeroY - scaleBar(v)
    const cumLinePoints = cumPoints.map((v, i) => {
      const x = padL + barGroupW * i + barGroupW / 2
      const y = padT + chartH - ((v - cumMin) / cumRange) * chartH
      return `${x},${y}`
    }).join(' ')

    return (
      <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', padding: '16px', marginTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx)', display: 'flex', alignItems: 'center', gap: 6 }}>
            {tc('cfo_cashflow.chart_title')}
            {selectedDay && <span style={{ fontSize: 9, color: INDIGO, fontWeight: 400 }}>{tc('cfo_cashflow.chart_selected', { date: selectedDay.slice(5) })}</span>}
          </div>
          {/* Range filter */}
          <div style={{ display: 'flex', gap: 3 }}>
            {(['7d', '30d', '90d'] as ChartRange[]).map(r => (
              <button key={r} onClick={() => { setChartRange(r); setSelectedDay(null) }} style={{ padding: '3px 8px', borderRadius: 6, border: 'none', background: chartRange === r ? INDIGO : 'transparent', color: chartRange === r ? '#fff' : 'var(--tx3)', fontSize: 9, fontWeight: chartRange === r ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit' }}>
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ display: 'block', overflow: 'visible', cursor: 'crosshair' }}
          onMouseLeave={() => setTooltip(null)}
        >
          <line x1={padL} y1={zeroY} x2={W - padR} y2={zeroY} stroke="var(--b)" strokeWidth={1} />
          {yTicks.map((v, i) => (
            <g key={i}>
              <line x1={padL - 4} y1={yScale(v)} x2={padL} y2={yScale(v)} stroke="var(--tx3)" strokeWidth={0.5} />
              <text x={padL - 8} y={yScale(v) + 3} textAnchor="end" fontSize={9} fill="var(--tx3)">{fmt(v, true)}</text>
            </g>
          ))}

          {chartData.map((d, i) => {
            const x = padL + barGroupW * i + (barGroupW - barW * 2 - gap) / 2
            const inflowH = scaleBar(d.inflow)
            const outflowH = scaleBar(d.outflow)
            const isSelected = selectedDay === d.date
            return (
              <g
                key={i}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedDay(selectedDay === d.date ? null : d.date)}
                onMouseMove={e => {
                  const svg = e.currentTarget.closest('svg')!
                  const rect = svg.getBoundingClientRect()
                  setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, d })
                }}
                onMouseLeave={() => setTooltip(null)}
              >
                {isSelected && <rect x={x - 2} y={padT} width={barW * 2 + gap + 4} height={chartH} fill={`${INDIGO}12`} rx={2} />}
                <rect x={x} y={zeroY - inflowH} width={barW} height={Math.max(inflowH, 1)} fill={GREEN} rx={1} opacity={isSelected ? 1 : 0.8} />
                <rect x={x + barW + gap} y={zeroY} width={barW} height={Math.max(outflowH, 1)} fill={RED} rx={1} opacity={isSelected ? 1 : 0.8} />
                {i % labelInterval === 0 && (
                  <text x={padL + barGroupW * i + barGroupW / 2} y={H - 4} textAnchor="middle" fontSize={9} fill="var(--tx3)">{d.date.slice(5)}</text>
                )}
              </g>
            )
          })}

          <polyline points={cumLinePoints} fill="none" stroke={INDIGO} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
          {cumPoints.length > 0 && (
            <circle
              cx={parseFloat(cumLinePoints.split(' ').pop()!.split(',')[0])}
              cy={parseFloat(cumLinePoints.split(' ').pop()!.split(',')[1])}
              r={3} fill={INDIGO}
            />
          )}

          {/* Tooltip */}
          {tooltip && (
            <g>
              <rect x={Math.min(tooltip.x + 8, W - 120)} y={tooltip.y - 36} width={110} height={52} rx={6} fill="var(--bg)" stroke="var(--b)" strokeWidth={1} />
              <text x={Math.min(tooltip.x + 14, W - 114)} y={tooltip.y - 22} fontSize={9} fill={GREEN} fontWeight={700}>▲ {fmt(tooltip.d.inflow)}</text>
              <text x={Math.min(tooltip.x + 14, W - 114)} y={tooltip.y - 10} fontSize={9} fill={RED} fontWeight={700}>▼ {fmt(tooltip.d.outflow)}</text>
              <text x={Math.min(tooltip.x + 14, W - 114)} y={tooltip.y + 4} fontSize={9} fill={tooltip.d.net >= 0 ? GREEN : RED} fontWeight={700}>{tc('cfo_cashflow.chart_tooltip_net')} {fmt(tooltip.d.net)}</text>
              <text x={Math.min(tooltip.x + 14, W - 114)} y={tooltip.y + 16} fontSize={8} fill="var(--tx3)">{tooltip.d.date}</text>
            </g>
          )}
        </svg>

        <div style={{ display: 'flex', gap: 16, marginTop: 8, justifyContent: 'center' }}>
          {[{ label: tc('cfo_cashflow.chart_legend_inflow'), color: GREEN }, { label: tc('cfo_cashflow.chart_legend_outflow'), color: RED }, { label: tc('cfo_cashflow.chart_legend_cumulative'), color: INDIGO }].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, color: 'var(--tx3)' }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: l.color, display: 'inline-block' }} />
              {l.label}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── Day detail panel ──
  const renderDayDetail = () => {
    if (!selectedDayData) return null
    const idx = allDaily.findIndex(d => d.date === selectedDay)
    const recentSlice = allDaily.slice(Math.max(0, idx - 6), idx + 1)
    const recentAvgNet = recentSlice.reduce((s, d) => s + d.net, 0) / (recentSlice.length || 1)
    const vsPeriodAvg = selectedDayData.net - avgNet
    const vsWeekAvg = selectedDayData.net - recentAvgNet

    return (
      <div style={{ borderRadius: 12, border: `1px solid ${INDIGO}30`, background: `${INDIGO}04`, padding: '14px 16px', marginTop: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_cashflow.day_detail_title', { date: selectedDay ?? '' })}</div>
          <button onClick={() => setSelectedDay(null)} style={{ fontSize: 9, color: 'var(--tx3)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>{tc('cfo_cashflow.day_detail_close')}</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 10 }}>
          {[
            { label: tc('cfo_cashflow.day_detail_inflow'), value: fmt(selectedDayData.inflow), color: GREEN },
            { label: tc('cfo_cashflow.day_detail_outflow'), value: fmt(selectedDayData.outflow), color: RED },
            { label: tc('cfo_cashflow.day_detail_net'), value: fmt(selectedDayData.net), color: selectedDayData.net >= 0 ? GREEN : RED },
          ].map(m => (
            <div key={m.label} style={{ textAlign: 'center', padding: '8px', borderRadius: 8, background: 'var(--sf)', border: '1px solid var(--b)' }}>
              <div style={{ fontSize: 9, color: 'var(--tx3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 9 }}>
          <div style={{ padding: '8px 10px', borderRadius: 8, background: 'var(--ev)', border: '1px solid var(--b)' }}>
            <span style={{ color: 'var(--tx3)' }}>{tc('cfo_cashflow.day_detail_vs_period')}</span>
            <strong style={{ color: vsPeriodAvg >= 0 ? GREEN : RED }}>{vsPeriodAvg >= 0 ? '+' : ''}{fmt(vsPeriodAvg)}</strong>
          </div>
          <div style={{ padding: '8px 10px', borderRadius: 8, background: 'var(--ev)', border: '1px solid var(--b)' }}>
            <span style={{ color: 'var(--tx3)' }}>{tc('cfo_cashflow.day_detail_vs_week')}</span>
            <strong style={{ color: vsWeekAvg >= 0 ? GREEN : RED }}>{vsWeekAvg >= 0 ? '+' : ''}{fmt(vsWeekAvg)}</strong>
          </div>
        </div>
        {sourceBreakdown && sourceBreakdown.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 9, color: 'var(--tx3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 6 }}>{tc('cfo_cashflow.day_detail_revenue_by_channel')}</div>
            {sourceBreakdown.map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderTop: i > 0 ? '1px solid var(--b)' : undefined, fontSize: 9 }}>
                <span style={{ color: 'var(--tx)' }}>{s.label}</span>
                <span style={{ color: GREEN, fontWeight: 600 }}>{tc('cfo_cashflow.day_detail_per_day', { value: fmt(s.revenue / periodDays) })}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ── Rollup table ──
  const renderRollupTable = () => {
    if (!showRollup || allDaily.length === 0) return null
    return (
      <div style={{ borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)', marginTop: 8, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderBottom: '1px solid var(--b)' }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_cashflow.rollup_title')}</span>
          <button onClick={() => setShowRollup(false)} style={{ fontSize: 9, color: 'var(--tx3)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>✕</button>
        </div>
        <div style={{ maxHeight: 300, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 9 }}>
            <thead>
              <tr style={{ background: 'var(--ev)', position: 'sticky', top: 0 }}>
                {[
                  { key: 'date', label: tc('cfo_cashflow.rollup_col_date') },
                  { key: 'inflow', label: tc('cfo_cashflow.rollup_col_inflow') },
                  { key: 'outflow', label: tc('cfo_cashflow.rollup_col_outflow') },
                  { key: 'net', label: tc('cfo_cashflow.rollup_col_net') },
                ].map(h => (
                  <th key={h.key} style={{ padding: '7px 12px', textAlign: h.key === 'date' ? 'left' : 'right', fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.04em' }}>{h.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...allDaily].reverse().map((d, i) => (
                <tr key={i} style={{ borderTop: '1px solid var(--b)', cursor: 'pointer', background: selectedDay === d.date ? `${INDIGO}08` : undefined }}
                  onClick={() => setSelectedDay(selectedDay === d.date ? null : d.date)}>
                  <td style={{ padding: '6px 12px', color: 'var(--tx)' }}>{d.date}</td>
                  <td style={{ padding: '6px 12px', textAlign: 'right', color: GREEN, fontWeight: 500 }}>{fmt(d.inflow)}</td>
                  <td style={{ padding: '6px 12px', textAlign: 'right', color: RED, fontWeight: 500 }}>{fmt(d.outflow)}</td>
                  <td style={{ padding: '6px 12px', textAlign: 'right', color: d.net >= 0 ? GREEN : RED, fontWeight: 600 }}>{fmt(d.net)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // ── Projection cards ──
  const renderProjection = () => {
    if (userBalance <= 0) return null
    const dailyNet = effectiveDailyBurn
    const monthlyExpenses = effectiveMonthlyFixed || totals.fixed_costs + totals.cogs
    const lowThreshold = monthlyExpenses > 0 ? monthlyExpenses : userBalance * 0.1
    const projColor = (bal: number) => bal < 0 ? RED : bal < lowThreshold ? YELLOW : GREEN
    return (
      <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', padding: '16px', marginTop: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)', marginBottom: 12 }}>{tc('cfo_cashflow.projection_title')}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[30, 60, 90].map(days => {
            const bal = userBalance + dailyNet * days
            const c = projColor(bal)
            return (
              <div key={days} style={{ padding: '12px 14px', borderRadius: 12, border: `1px solid ${c}22`, background: `${c}08`, textAlign: 'center' }}>
                <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{tc('cfo_cashflow.projection_days', { n: days })}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: c, fontFamily: 'var(--font-sora, inherit)', letterSpacing: '-0.02em' }}>{fmt(bal)}</div>
              </div>
            )
          })}
        </div>
        <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 8, textAlign: 'center' }}>
          {effectiveMonthlyFixed > 0 ? tc('cfo_cashflow.projection_basis_with_fixed', { value: fmt(effectiveDailyBurn) }) : tc('cfo_cashflow.projection_basis', { value: fmt(effectiveDailyBurn) })}
        </div>
      </div>
    )
  }

  // ── Receivables aging ──
  const renderAging = () => {
    if (!hasAging) return null
    const buckets = [
      { key: 'current', label: tc('cfo_cashflow.aging_current'), value: receivablesAging!.current, color: GREEN },
      { key: '30', label: tc('cfo_cashflow.aging_30'), value: receivablesAging!.overdue_30, color: YELLOW },
      { key: '60', label: tc('cfo_cashflow.aging_60'), value: receivablesAging!.overdue_60, color: ORANGE },
      { key: '90', label: tc('cfo_cashflow.aging_90'), value: receivablesAging!.overdue_90, color: RED },
    ]
    return (
      <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', padding: '16px', marginTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)' }}>{tc('cfo_cashflow.aging_title')}</div>
          <div style={{ fontSize: 9, color: RED, fontWeight: 600 }}>{tc('cfo_cashflow.aging_at_risk', { value: fmt(atRisk) })}</div>
        </div>
        <div style={{ display: 'flex', height: 20, borderRadius: 10, overflow: 'hidden', marginBottom: 14 }}>
          {buckets.map(b => { const pct = agingTotal > 0 ? (b.value / agingTotal) * 100 : 0; return pct === 0 ? null : <div key={b.key} style={{ width: `${pct}%`, background: b.color, minWidth: 2 }} /> })}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {buckets.map(b => {
            const pct = agingTotal > 0 ? ((b.value / agingTotal) * 100).toFixed(1) : '0.0'
            return (
              <div key={b.key} style={{ padding: '10px 12px', borderRadius: 10, border: `1px solid ${b.color}22`, background: `${b.color}08`, textAlign: 'center' }}>
                <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{b.label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: b.color, fontFamily: 'var(--font-sora, inherit)' }}>{fmt(b.value)}</div>
                <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 2 }}>{pct}%</div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 4, height: 20, borderRadius: 4, background: INDIGO }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_cashflow.title')}</span>
        </div>
        <button onClick={() => onAsk(tc('cfo_cashflow.ask_prompt_main'))} style={{ padding: '5px 12px', borderRadius: 8, fontSize: 9, fontWeight: 600, background: `${INDIGO}14`, color: INDIGO, border: `1px solid ${INDIGO}30`, cursor: 'pointer', transition: 'background 150ms' }} onMouseEnter={e => (e.currentTarget.style.background = `${INDIGO}24`)} onMouseLeave={e => (e.currentTarget.style.background = `${INDIGO}14`)}>
          {tc('cfo_cashflow.ask_ai')}
        </button>
      </div>

      {/* ── 4 Position Cards (grid so drill-down panels can span full width) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 4 }}>
        <PositionCard
          id="balance"
          label={tc('cfo_cashflow.card_cash_balance')}
          value={fmt(userBalance)}
          color={GREEN}
          notSet={userBalance === 0}
          subLabel={costConfig?.cashBalance ? tc('cfo_cashflow.card_manual') : undefined}
          clickable
        />
        <PositionCard
          id="fixed"
          label={tc('cfo_cashflow.card_monthly_fixed')}
          value={fmt(effectiveMonthlyFixed)}
          color={RED}
          notSet={effectiveMonthlyFixed === 0}
          subLabel={costConfig && costConfig.fixedCosts.some(c => c.amount > 0) ? tc('cfo_cashflow.card_manual') : autoMonthlyFixed > 0 ? tc('cfo_cashflow.card_from_expenses') : undefined}
          clickable
        />
        <PositionCard
          id="burn"
          label={effectiveDailyBurn >= 0 ? tc('cfo_cashflow.card_daily_net_gain') : tc('cfo_cashflow.card_daily_net_burn')}
          value={tc('cfo_cashflow.card_per_day_suffix', { value: fmt(Math.abs(effectiveDailyBurn)) })}
          color={effectiveDailyBurn >= 0 ? GREEN : RED}
          clickable
        />
        <PositionCard
          id="runway"
          label={tc('cfo_cashflow.card_cash_runway')}
          value={isCashPositive ? tc('cfo_cashflow.card_cash_positive_short') : effectiveRunwayMonths != null ? tc('cfo_cashflow.card_months_short', { n: effectiveRunwayMonths.toFixed(1) }) : tc('cfo_cashflow.card_set_balance')}
          color={isCashPositive ? GREEN : runwayColor(runwayStatus)}
          subLabel={runwayStatus !== 'unknown' ? statusLabel(runwayStatus) : undefined}
          clickable
        />

        {/* Drill-down panels — span full grid width */}
        {activeCard === 'burn' && renderBurnPanel()}
        {activeCard === 'runway' && renderRunwayPanel()}
      </div>

      {/* ── Chart ── */}
      {renderChart()}
      {renderDayDetail()}

      {/* Rollup table toggle */}
      {allDaily.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <button onClick={() => setShowRollup(v => !v)} style={{ fontSize: 9, color: INDIGO, background: 'transparent', border: `1px solid ${INDIGO}30`, borderRadius: 7, padding: '4px 12px', cursor: 'pointer', fontFamily: 'inherit' }}>
            {showRollup ? tc('cfo_cashflow.rollup_toggle_hide', { n: allDaily.length }) : tc('cfo_cashflow.rollup_toggle_show', { n: allDaily.length })}
          </button>
        </div>
      )}
      {renderRollupTable()}

      {/* ── Statement Table ── */}
      <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', padding: '16px', marginTop: 12 }}>
        <SectionHeader title="Operating Activities" />
        <Row label="Cash from Sales" value={fmt(totals.revenue)} color={GREEN} onClick={() => setShowRollup(true)} />
        <Row label="Cost of Goods Paid" value={fmt(-totals.cogs)} color={RED} />
        <Row label="Operating Expenses" value={fmt(-totals.fixed_costs)} color={RED} />
        <Row label="Net Operating Cash Flow" value={fmt(netOperating)} bold borderTop color={netOperating >= 0 ? GREEN : RED} />

        <SectionHeader title="Investing Activities" />
        <Row label="Inventory Purchases" italic note="Tracked via Inventory tab" />
        <Row label="Net Investing Cash Flow" value={fmt(0)} bold borderTop note="See Inventory" />

        <SectionHeader title="Financing & Receivables" />
        {receivablesSummary ? (
          <>
            <Row label="Accounts Receivable" value={fmt(receivablesSummary.total_receivables)} color={GREEN} />
            <Row label="Accounts Payable" value={fmt(-receivablesSummary.total_payables)} color={RED} />
            <Row label="Net Financing" value={fmt(netFinancing)} bold borderTop color={netFinancing >= 0 ? GREEN : RED} />
          </>
        ) : <Row label="No receivables data" italic />}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0 4px', marginTop: 12, borderTop: '2px solid var(--b)' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>NET CASH POSITION</span>
          <span style={{ fontSize: 18, fontWeight: 700, color: netCashPosition >= 0 ? GREEN : RED, fontFamily: 'var(--font-sora, inherit)', letterSpacing: '-0.02em', padding: '2px 10px', borderRadius: 8, background: netCashPosition >= 0 ? `${GREEN}10` : `${RED}10` }}>
            {fmt(netCashPosition)}
          </span>
        </div>
      </div>

      {/* ── Projection ── */}
      {renderProjection()}

      {/* ── Aging ── */}
      {renderAging()}

      {/* ── Cost Config Drawer ── */}
      <CostConfigDrawer
        open={drawerOpen}
        initialSection={drawerSection}
        onClose={() => setDrawerOpen(false)}
        onSaved={cfg => { setCostConfig(cfg); onConfigSaved?.() }}
        currencySymbol={sym}
      />
    </div>
  )
}
