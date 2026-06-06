'use client'
import { useState, useEffect } from 'react'

interface WeekRow {
  label: string
  weekStart: string
  inflow: number
  outflow: number
  net: number
  endCash: number
  isActual: boolean
  knownAR: number
  knownAP: number
  items: Array<{ name: string; amount: number; type: 'ar' | 'ap' }>
}

interface Props {
  dailyCashflow?: Array<{ date: string; inflow: number; outflow: number; net: number }>
  cashBalance: number
  monthlyFixed: number
  currencySymbol: string
  onAsk?: (prompt: string) => void
}

function getMonday(d: Date): Date {
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const m = new Date(d)
  m.setDate(diff)
  m.setHours(0, 0, 0, 0)
  return m
}

function addWeeks(d: Date, n: number): Date {
  const r = new Date(d)
  r.setDate(r.getDate() + n * 7)
  return r
}

function weekKey(d: Date): string {
  return d.toISOString().split('T')[0]
}

function fmtLbl(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function RollingCashForecast({ dailyCashflow, cashBalance, monthlyFixed, currencySymbol: sym, onAsk }: Props) {
  const [receivables, setReceivables] = useState<any[]>([])
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/cfo/receivables')
      .then(r => r.ok ? r.json() : null)
      .then(d => setReceivables(d?.items || []))
      .catch(() => {})
  }, [])

  const fmt = (n: number, short = false) => {
    const abs = Math.abs(n)
    if (abs >= 1_000_000) return `${n < 0 ? '-' : ''}${sym}${(abs / 1_000_000).toFixed(1)}M`
    if (abs >= 1_000) return `${n < 0 ? '-' : ''}${sym}${(abs / 1_000).toFixed(short ? 0 : 1)}K`
    return `${n < 0 ? '-' : ''}${sym}${Math.round(abs).toLocaleString()}`
  }

  if (!dailyCashflow || dailyCashflow.length === 0) return null

  // Group actual daily data into weeks
  const weeklyActual = new Map<string, { inflow: number; outflow: number }>()
  for (const d of dailyCashflow) {
    if (!d.date) continue
    const date = new Date(d.date + 'T00:00:00')
    if (isNaN(date.getTime())) continue
    const key = weekKey(getMonday(date))
    if (!weeklyActual.has(key)) weeklyActual.set(key, { inflow: 0, outflow: 0 })
    const w = weeklyActual.get(key)!
    w.inflow += d.inflow
    w.outflow += d.outflow
  }

  // Compute trailing average weekly flows
  const actualValues = Array.from(weeklyActual.values())
  const avgInflow = actualValues.length > 0 ? actualValues.reduce((s, w) => s + w.inflow, 0) / actualValues.length : 0
  const avgOutflow = actualValues.length > 0 ? actualValues.reduce((s, w) => s + w.outflow, 0) / actualValues.length : 0

  // Group receivables/payables by due week
  const arByWeek = new Map<string, Array<{ name: string; amount: number }>>()
  const apByWeek = new Map<string, Array<{ name: string; amount: number }>>()

  for (const item of receivables) {
    if (!item.due_date || item.status === 'paid') continue
    const due = new Date(item.due_date + 'T00:00:00')
    if (isNaN(due.getTime())) continue
    const key = weekKey(getMonday(due))
    const entry = { name: item.counterparty || 'Unknown', amount: item.amount || 0 }
    if (item.type === 'receivable') {
      if (!arByWeek.has(key)) arByWeek.set(key, [])
      arByWeek.get(key)!.push(entry)
    } else if (item.type === 'payable') {
      if (!apByWeek.has(key)) apByWeek.set(key, [])
      apByWeek.get(key)!.push(entry)
    }
  }

  // Build 13 weeks: 4 actual + 9 forecast
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const thisMonday = getMonday(today)
  const weeks: WeekRow[] = []

  for (let i = -3; i <= 9; i++) {
    const wStart = addWeeks(thisMonday, i)
    const key = weekKey(wStart)
    const actual = weeklyActual.get(key)
    const arItems = arByWeek.get(key) || []
    const apItems = apByWeek.get(key) || []
    const knownAR = arItems.reduce((s, x) => s + x.amount, 0)
    const knownAP = apItems.reduce((s, x) => s + x.amount, 0)
    const isActual = actual != null || i < 0

    const baseInflow = actual ? actual.inflow : avgInflow
    const baseOutflow = actual ? actual.outflow : avgOutflow
    const totalInflow = baseInflow + (i >= 0 ? knownAR : 0)
    const totalOutflow = baseOutflow + (i >= 0 ? knownAP : 0)

    weeks.push({
      label: fmtLbl(wStart),
      weekStart: key,
      inflow: totalInflow,
      outflow: totalOutflow,
      net: totalInflow - totalOutflow,
      endCash: 0,
      isActual,
      knownAR,
      knownAP,
      items: [
        ...arItems.map(x => ({ name: x.name, amount: x.amount, type: 'ar' as const })),
        ...apItems.map(x => ({ name: x.name, amount: x.amount, type: 'ap' as const })),
      ],
    })
  }

  // Compute running cash position (cashBalance is "now" = end of current week index 3)
  // Back-calculate starting cash
  let start = cashBalance
  for (let i = 3; i >= 0; i--) start -= weeks[i].net
  let running = start
  for (let i = 0; i < weeks.length; i++) {
    running += weeks[i].net
    weeks[i].endCash = running
  }

  const minCash = Math.min(...weeks.map(w => w.endCash))
  const maxFlow = Math.max(...weeks.map(w => Math.max(w.inflow, w.outflow)), 1)
  const maxCash = Math.max(...weeks.map(w => w.endCash), cashBalance)
  const cashRange = Math.max(maxCash - Math.min(minCash, 0), 1)

  const BAR_H = 80
  const CASH_H = 50
  const W = 560
  const padL = 4
  const barW = Math.max(6, (W - padL) / weeks.length - 4)
  const gap = (W - padL - barW * weeks.length) / (weeks.length + 1)

  const cashColor = (c: number) => c <= 0 ? '#EF4444' : c < (monthlyFixed || cashBalance * 0.2) ? '#F59E0B' : '#22C55E'

  const selectedWeekData = selectedWeek ? weeks.find(w => w.weekStart === selectedWeek) : null

  return (
    <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#6366F1' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>13-Week Cash Forecast</span>
          <span style={{ fontSize: 10, color: 'var(--tx3)' }}>4 actual · 9 projected</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 10, fontSize: 10, color: 'var(--tx3)' }}>
            <span><span style={{ color: '#22C55E' }}>■</span> Inflow</span>
            <span><span style={{ color: '#EF4444' }}>■</span> Outflow</span>
            <span><span style={{ color: '#6366F1' }}>—</span> Cash</span>
          </div>
          {onAsk && (
            <button
              onClick={() => {
                const lowestWeek = weeks.reduce((m, w) => w.endCash < m.endCash ? w : m)
                onAsk(`My 13-week cash forecast shows: current balance ${fmt(cashBalance)}, lowest projected cash ${fmt(lowestWeek.endCash)} (week of ${lowestWeek.label}). Avg weekly inflow ${fmt(avgInflow)}, avg outflow ${fmt(avgOutflow)}. What should I do to improve my cash runway?`)
              }}
              style={{ fontSize: 10, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
            >Ask AI</button>
          )}
        </div>
      </div>

      {/* Chart */}
      <div style={{ padding: '16px 18px', overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${W} ${BAR_H + CASH_H + 28}`} width="100%" style={{ display: 'block', minWidth: 400 }}>
          {/* Bar chart */}
          {weeks.map((w, i) => {
            const x = padL + gap + i * (barW + gap)
            const inflowH = (w.inflow / maxFlow) * BAR_H
            const outflowH = (w.outflow / maxFlow) * BAR_H
            const isSelected = selectedWeek === w.weekStart
            return (
              <g key={i} onClick={() => setSelectedWeek(selectedWeek === w.weekStart ? null : w.weekStart)} style={{ cursor: 'pointer' }}>
                {/* Highlight selected */}
                {isSelected && (
                  <rect x={x - 2} y={0} width={barW + 4} height={BAR_H + CASH_H + 20}
                    fill="rgba(99,102,241,.06)" rx={3} />
                )}
                {/* Actual/forecast divider */}
                {i === 3 && (
                  <line x1={x + barW + gap / 2} y1={0} x2={x + barW + gap / 2} y2={BAR_H + CASH_H}
                    stroke="var(--b)" strokeWidth={1} strokeDasharray="3,2" />
                )}
                {/* Inflow bar */}
                <rect
                  x={x} y={BAR_H - inflowH} width={barW / 2 - 1} height={Math.max(inflowH, 1)}
                  fill={w.isActual ? '#22C55E' : '#22C55E'} opacity={w.isActual ? 0.9 : 0.5} rx={1}
                />
                {/* Outflow bar */}
                <rect
                  x={x + barW / 2 + 1} y={BAR_H - outflowH} width={barW / 2 - 1} height={Math.max(outflowH, 1)}
                  fill={w.isActual ? '#EF4444' : '#EF4444'} opacity={w.isActual ? 0.9 : 0.5} rx={1}
                />
                {/* Week label */}
                {i % 2 === 0 && (
                  <text x={x + barW / 2} y={BAR_H + CASH_H + 26} textAnchor="middle" fontSize={8} fill="var(--tx3)">{w.label}</text>
                )}
              </g>
            )
          })}

          {/* Cash position line */}
          {(() => {
            const points = weeks.map((w, i) => {
              const x = padL + gap + i * (barW + gap) + barW / 2
              const y = BAR_H + 8 + CASH_H - ((w.endCash - Math.min(minCash, 0)) / cashRange) * CASH_H
              return `${x},${y}`
            }).join(' ')
            const lastPt = points.split(' ').pop()!
            const [lx, ly] = lastPt.split(',').map(Number)
            const firstPt = points.split(' ')[0]
            const [fx, fy] = firstPt.split(',').map(Number)
            return (
              <g>
                <polyline points={points} fill="none" stroke="#6366F1" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
                <circle cx={lx} cy={ly} r={3} fill="#6366F1" />
                {/* Cash dots at each week */}
                {weeks.map((w, i) => {
                  const x = padL + gap + i * (barW + gap) + barW / 2
                  const y = BAR_H + 8 + CASH_H - ((w.endCash - Math.min(minCash, 0)) / cashRange) * CASH_H
                  return (
                    <circle key={i} cx={x} cy={y} r={2} fill={cashColor(w.endCash)} />
                  )
                })}
                {/* Zero cash line */}
                {minCash < 0 && (
                  <line
                    x1={padL} y1={BAR_H + 8 + CASH_H - ((0 - Math.min(minCash, 0)) / cashRange) * CASH_H}
                    x2={W} y2={BAR_H + 8 + CASH_H - ((0 - Math.min(minCash, 0)) / cashRange) * CASH_H}
                    stroke="#EF4444" strokeWidth={0.5} strokeDasharray="3,2" opacity={0.5}
                  />
                )}
                {/* Axis labels: first and last cash */}
                <text x={fx - 2} y={fy - 3} textAnchor="middle" fontSize={7} fill="#6366F1">{fmt(weeks[0].endCash, true)}</text>
                <text x={lx + 2} y={ly - 3} textAnchor="end" fontSize={7} fill={cashColor(weeks[weeks.length - 1].endCash)}>{fmt(weeks[weeks.length - 1].endCash, true)}</text>
              </g>
            )
          })()}

          {/* Labels: Actual / Forecast */}
          <text x={padL + gap + 1.5 * (barW + gap)} y={8} textAnchor="middle" fontSize={7} fill="var(--tx3)" fontStyle="italic">← Actual</text>
          <text x={padL + gap + 6 * (barW + gap)} y={8} textAnchor="middle" fontSize={7} fill="var(--tx3)" fontStyle="italic">Forecast →</text>
        </svg>
      </div>

      {/* Week detail panel */}
      {selectedWeekData && (
        <div style={{ margin: '0 18px 16px', padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(99,102,241,.2)', background: 'rgba(99,102,241,.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)' }}>Week of {selectedWeekData.label}</span>
            <button onClick={() => setSelectedWeek(null)} style={{ fontSize: 11, color: 'var(--tx3)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>✕</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: selectedWeekData.items.length > 0 ? 10 : 0 }}>
            <MiniMetric label="Inflow" value={fmt(selectedWeekData.inflow)} color="#22C55E" />
            <MiniMetric label="Outflow" value={fmt(selectedWeekData.outflow)} color="#EF4444" />
            <MiniMetric label="Net" value={fmt(selectedWeekData.net)} color={selectedWeekData.net >= 0 ? '#22C55E' : '#EF4444'} />
            <MiniMetric label="Cash End" value={fmt(selectedWeekData.endCash)} color={cashColor(selectedWeekData.endCash)} />
          </div>
          {selectedWeekData.items.length > 0 && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 6 }}>Known Cash Flows</div>
              {selectedWeekData.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '4px 0', borderBottom: i < selectedWeekData.items.length - 1 ? '1px solid var(--b)' : undefined }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: item.type === 'ar' ? '#22C55E' : '#EF4444', display: 'inline-block', flexShrink: 0 }} />
                    <span style={{ color: 'var(--tx)' }}>{item.name}</span>
                    <span style={{ fontSize: 9, color: 'var(--tx3)', background: 'var(--ev)', borderRadius: 4, padding: '1px 4px' }}>{item.type === 'ar' ? 'Receivable' : 'Payable'}</span>
                  </div>
                  <span style={{ fontWeight: 600, color: item.type === 'ar' ? '#22C55E' : '#EF4444' }}>{item.type === 'ar' ? '+' : '-'}{fmt(item.amount)}</span>
                </div>
              ))}
            </div>
          )}
          {!selectedWeekData.isActual && selectedWeekData.items.length === 0 && (
            <div style={{ fontSize: 10, color: 'var(--tx3)', fontStyle: 'italic' }}>Forecast based on trailing weekly average. Add receivables/payables to include known flows.</div>
          )}
        </div>
      )}

      {/* Summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--b)' }}>
        <SummaryCell label="Current Cash" value={fmt(cashBalance)} color="#22C55E" />
        <SummaryCell label="Avg Weekly In" value={fmt(avgInflow)} color="#22C55E" />
        <SummaryCell label="Avg Weekly Out" value={fmt(avgOutflow)} color="#EF4444" />
        <SummaryCell label="13-Wk Projection" value={fmt(weeks[weeks.length - 1].endCash)} color={cashColor(weeks[weeks.length - 1].endCash)} />
      </div>

      {/* Low cash warnings */}
      {weeks.some(w => !w.isActual && w.endCash <= 0) && (
        <div style={{ padding: '10px 18px', borderTop: '1px solid var(--b)', background: 'rgba(239,68,68,.03)', fontSize: 11, color: '#EF4444', fontWeight: 500 }}>
          ⚠ Cash goes negative in week of {weeks.find(w => !w.isActual && w.endCash <= 0)!.label} — action required
        </div>
      )}
    </div>
  )
}

function MiniMetric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 9, color: 'var(--tx3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color }}>{value}</div>
    </div>
  )
}

function SummaryCell({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ padding: '10px 12px', background: 'var(--sf)', textAlign: 'center' }}>
      <div style={{ fontSize: 9, color: 'var(--tx3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    </div>
  )
}
