'use client'
import { useState, useEffect } from 'react'
import { useLang } from '@/components/LanguageProvider'

type TC = (k: string, vars?: Record<string, string | number>) => string

interface Totals {
  revenue: number; cogs: number; gross_profit: number; fixed_costs: number; net_profit: number
  gross_margin_pct: number; net_margin_pct: number
}

interface MonthlyRow {
  month: string; revenue: number; cogs: number; fixed: number; net: number
  gross_margin_pct: number; net_margin_pct: number
}

interface PeriodRange {
  start: string; end: string; key: string
}

interface Budget {
  revenue: number; cogs: number; fixed_costs: number; net_profit: number
}

// v3: stored values are always a MONTHLY figure (see `factor` below) — bumped
// from v2, which stored whatever period happened to be on screen when the user
// last edited, so Variance silently broke on every other period tab.
const STORAGE_KEY = 'cfo_budget_v3'
const DEFAULT_BUDGET: Budget = { revenue: 0, cogs: 0, fixed_costs: 0, net_profit: 0 }

// Mirrors the day-count math app/api/cfo/snapshot/route.ts already uses to scale
// monthly_fixed_costs to the selected period, so Budget and Actual stay consistent.
function daysBetween(a: string, b: string): number {
  return Math.ceil((new Date(b).getTime() - new Date(a).getTime()) / 86400000) + 1
}

const PERIOD_LABEL_KEY: Record<string, string> = {
  today: 'today', this_week: 'thisWeek', this_month: 'thisMonth', last_month: 'lastMonth',
  this_quarter: 'thisQuarter', ytd: 'ytd', last_90: 'last90Days',
}

interface Props {
  totals: Totals
  pnlMonthly?: MonthlyRow[]
  currencySymbol: string
  periodRange: PeriodRange
  onAsk?: (prompt: string) => void
}

function fmt(n: number, sym: string): string {
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `${n < 0 ? '-' : ''}${sym}${(abs / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `${n < 0 ? '-' : ''}${sym}${(abs / 1_000).toFixed(1)}K`
  return `${n < 0 ? '-' : ''}${sym}${Math.round(abs).toLocaleString()}`
}

export default function BudgetVsActual({ totals, pnlMonthly, currencySymbol: sym, periodRange, onAsk }: Props) {
  const { tc } = useLang()
  // Canonical storage unit: always "per 30 days", regardless of which period tab was active when it was set.
  const [monthlyBudget, setMonthlyBudget] = useState<Budget>(DEFAULT_BUDGET)
  const [editing, setEditing] = useState<keyof Budget | null>(null)
  const [editValue, setEditValue] = useState('')
  const [drillMonth, setDrillMonth] = useState<string | null>(null)
  const [hasBudget, setHasBudget] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setMonthlyBudget(parsed)
        setHasBudget(Object.values(parsed).some((v: any) => Number(v) > 0))
      }
    } catch {}
  }, [])

  const saveBudget = (b: Budget) => {
    setMonthlyBudget(b)
    setHasBudget(Object.values(b).some(v => Number(v) > 0))
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(b)) } catch {}
  }

  // How many "budget months" the active period tab represents — e.g. ~0.03 for Today,
  // 1 for This Month, ~3 for This Quarter. The budget is entered/stored as a monthly
  // figure and scaled by this factor so Variance is meaningful on every tab.
  const periodDays = Math.max(daysBetween(periodRange.start, periodRange.end), 1)
  const factor = periodDays / 30

  const budget: Budget = {
    revenue: monthlyBudget.revenue * factor,
    cogs: monthlyBudget.cogs * factor,
    fixed_costs: monthlyBudget.fixed_costs * factor,
    net_profit: monthlyBudget.net_profit * factor,
  }

  const startEdit = (field: keyof Budget, current: number) => {
    setEditing(field)
    setEditValue(String(current > 0 ? current : ''))
  }

  const commitEdit = () => {
    if (!editing) return
    // The typed value reflects the period being viewed — normalize back to the monthly canonical unit before storing.
    const val = (parseFloat(editValue) || 0) / factor
    const updated = { ...monthlyBudget, [editing]: val }
    // Auto-compute net if revenue/cogs/fixed are set
    if (editing !== 'net_profit') {
      updated.net_profit = updated.revenue - updated.cogs - updated.fixed_costs
    }
    saveBudget(updated)
    setEditing(null)
  }

  const importFromActuals = () => {
    const b: Budget = {
      revenue: totals.revenue / factor,
      cogs: totals.cogs / factor,
      fixed_costs: totals.fixed_costs / factor,
      net_profit: totals.net_profit / factor,
    }
    saveBudget(b)
  }

  const uniqueLines = [
    { key: 'revenue' as keyof Budget, label: tc('cfo_budget.row_revenue'), actual: totals.revenue, isNeg: false },
    { key: 'cogs' as keyof Budget, label: tc('cfo_budget.detail_cogs'), actual: totals.cogs, isNeg: true },
    { key: 'fixed_costs' as keyof Budget, label: tc('cfo_budget.row_operating_expenses'), actual: totals.fixed_costs, isNeg: true },
    { key: 'net_profit' as keyof Budget, label: tc('cfo_budget.row_net_profit'), actual: totals.net_profit, isNeg: false },
  ]

  const grossProfit = totals.revenue - totals.cogs
  const budgetGrossProfit = budget.revenue - budget.cogs

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Header card */}
      <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 3, height: 14, borderRadius: 2, background: '#F59E0B' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_budget.card_title')}</span>
            {!hasBudget && (
              <span style={{ fontSize: 10, color: '#F59E0B', background: 'rgba(245,158,11,.1)', borderRadius: 6, padding: '1px 6px', fontWeight: 600 }}>{tc('cfo_budget.no_budget_badge')}</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {!hasBudget && (
              <button
                onClick={importFromActuals}
                style={{ fontSize: 10, color: '#F59E0B', background: 'rgba(245,158,11,.08)', border: '1px solid rgba(245,158,11,.3)', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
              >
                {tc('cfo_budget.use_actuals_btn')}
              </button>
            )}
            {onAsk && hasBudget && (
              <button
                onClick={() => {
                  const revVar = budget.revenue > 0 ? Math.round(((totals.revenue - budget.revenue) / budget.revenue) * 100) : 0
                  const profVar = budget.net_profit !== 0 ? Math.round(((totals.net_profit - budget.net_profit) / Math.abs(budget.net_profit)) * 100) : 0
                  onAsk(tc('cfo_budget.ask_prompt', {
                    revActual: fmt(totals.revenue, sym),
                    revBudget: fmt(budget.revenue, sym),
                    revVar: (revVar > 0 ? '+' : '') + revVar + '%',
                    netActual: fmt(totals.net_profit, sym),
                    netBudget: fmt(budget.net_profit, sym),
                    netVar: (profVar > 0 ? '+' : '') + profVar + '%',
                  }))
                }}
                style={{ fontSize: 10, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
              >{tc('cfo_budget.ask_ai')}</button>
            )}
          </div>
        </div>

        {/* Main comparison table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--b)' }}>
                <th style={{ textAlign: 'left', padding: '8px 18px', color: 'var(--tx3)', fontWeight: 600, fontSize: 10 }}>{tc('cfo_budget.col_line_item')}</th>
                <th style={{ textAlign: 'right', padding: '8px 14px', color: 'var(--tx3)', fontWeight: 600, fontSize: 10 }}>{tc('cfo_budget.col_budget')}</th>
                <th style={{ textAlign: 'right', padding: '8px 14px', color: 'var(--tx3)', fontWeight: 600, fontSize: 10 }}>{tc('cfo_budget.col_actual')}</th>
                <th style={{ textAlign: 'right', padding: '8px 14px', color: 'var(--tx3)', fontWeight: 600, fontSize: 10 }}>{tc('cfo_budget.col_variance')}</th>
                <th style={{ textAlign: 'right', padding: '8px 18px', color: 'var(--tx3)', fontWeight: 600, fontSize: 10 }}>{tc('cfo_budget.col_pct_var')}</th>
              </tr>
            </thead>
            <tbody>
              {/* Revenue */}
              <BudgetRow
                label={tc('cfo_budget.row_revenue')} actual={totals.revenue} budget={budget.revenue}
                sym={sym} editing={editing === 'revenue'} isNeg={false}
                onEdit={() => startEdit('revenue', budget.revenue)}
                onInput={v => setEditValue(v)}
                onCommit={commitEdit}
                editValue={editValue}
                tc={tc}
              />
              {/* COGS */}
              <BudgetRow
                label={tc('cfo_budget.row_cogs')} actual={totals.cogs} budget={budget.cogs}
                sym={sym} editing={editing === 'cogs'} isNeg={true}
                onEdit={() => startEdit('cogs', budget.cogs)}
                onInput={v => setEditValue(v)}
                onCommit={commitEdit}
                editValue={editValue}
                tc={tc}
              />
              {/* Gross Profit (computed) */}
              <tr style={{ background: 'rgba(34,197,94,.02)', borderTop: '2px solid var(--b)' }}>
                <td style={{ padding: '9px 18px', fontWeight: 700, color: 'var(--tx)', fontSize: 12 }}>{tc('cfo_budget.row_gross_profit')}</td>
                <td style={{ padding: '9px 14px', textAlign: 'right', fontWeight: 700, color: 'var(--tx)', fontVariantNumeric: 'tabular-nums' }}>{fmt(budgetGrossProfit, sym)}</td>
                <td style={{ padding: '9px 14px', textAlign: 'right', fontWeight: 700, color: 'var(--tx)', fontVariantNumeric: 'tabular-nums' }}>{fmt(grossProfit, sym)}</td>
                <VarCells actual={grossProfit} budget={budgetGrossProfit} isNeg={false} sym={sym} />
              </tr>
              {/* Operating Expenses */}
              <BudgetRow
                label={tc('cfo_budget.row_operating_expenses')} actual={totals.fixed_costs} budget={budget.fixed_costs}
                sym={sym} editing={editing === 'fixed_costs'} isNeg={true}
                onEdit={() => startEdit('fixed_costs', budget.fixed_costs)}
                onInput={v => setEditValue(v)}
                onCommit={commitEdit}
                editValue={editValue}
                tc={tc}
              />
              {/* Net Profit (computed) */}
              <tr style={{ background: totals.net_profit >= 0 ? 'rgba(99,102,241,.03)' : 'rgba(239,68,68,.03)', borderTop: '2px solid var(--b)' }}>
                <td style={{ padding: '11px 18px', fontWeight: 800, color: 'var(--tx)', fontSize: 13 }}>{tc('cfo_budget.row_net_profit')}</td>
                <td style={{ padding: '11px 14px', textAlign: 'right', fontWeight: 800, color: budget.net_profit >= 0 ? '#22C55E' : '#EF4444', fontVariantNumeric: 'tabular-nums', fontSize: 13 }}>{fmt(budget.net_profit, sym)}</td>
                <td style={{ padding: '11px 14px', textAlign: 'right', fontWeight: 800, color: totals.net_profit >= 0 ? '#22C55E' : '#EF4444', fontVariantNumeric: 'tabular-nums', fontSize: 13 }}>{fmt(totals.net_profit, sym)}</td>
                <VarCells actual={totals.net_profit} budget={budget.net_profit} isNeg={false} sym={sym} large />
              </tr>
            </tbody>
          </table>
        </div>

        {/* Budget setting hint */}
        {!hasBudget && (
          <div style={{ padding: '12px 18px', borderTop: '1px solid var(--b)', fontSize: 11, color: 'var(--tx3)', background: 'rgba(245,158,11,.02)', lineHeight: 1.5 }}>
            {tc('cfo_budget.set_budget_hint')}
          </div>
        )}
        {hasBudget && (
          <div style={{ padding: '10px 18px', borderTop: '1px solid var(--b)', fontSize: 11, color: 'var(--tx3)' }}>
            {tc('cfo_budget.monthly_target_note', { period: tc(`cfo_period.${PERIOD_LABEL_KEY[periodRange.key] || 'thisMonth'}`) })}
          </div>
        )}
      </div>

      {/* Visual progress bars */}
      {hasBudget && (
        <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--b)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_budget.attainment_title')}</div>
          </div>
          <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {uniqueLines.filter(l => l.key !== 'net_profit').map(line => {
              const b = budget[line.key]
              if (b === 0) return null
              const rawPct = b > 0 ? (line.actual / b) * 100 : 0
              const pct = Math.min(rawPct, 100)
              const color = line.isNeg
                ? (line.actual <= b ? '#22C55E' : '#EF4444')
                : (line.actual >= b ? '#22C55E' : '#EF4444')
              return (
                <div key={line.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--tx)' }}>{line.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color }}>{tc('cfo_budget.pct_of_budget', { n: rawPct.toFixed(0) })}</span>
                  </div>
                  <div style={{ height: 10, borderRadius: 5, background: 'var(--ev, #f3f2ef)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${Math.min(pct, 100)}%`,
                      background: color, borderRadius: 5, transition: 'width 400ms',
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3, fontSize: 10, color: 'var(--tx3)' }}>
                    <span>{tc('cfo_budget.actual_suffix', { v: fmt(line.actual, sym) })}</span>
                    <span>{tc('cfo_budget.budget_suffix', { v: fmt(b, sym) })}</span>
                  </div>
                </div>
              )
            }).filter(Boolean)}
          </div>
        </div>
      )}

      {/* Monthly drill-down */}
      {pnlMonthly && pnlMonthly.length > 1 && hasBudget && (
        <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_budget.monthly_trend_title')}</span>
            <span style={{ fontSize: 10, color: 'var(--tx3)' }}>{tc('cfo_budget.click_month_hint')}</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--b)' }}>
                  <th style={{ textAlign: 'left', padding: '7px 18px', color: 'var(--tx3)', fontWeight: 600, fontSize: 10 }}>{tc('cfo_budget.col_month')}</th>
                  <th style={{ textAlign: 'right', padding: '7px 12px', color: 'var(--tx3)', fontWeight: 600, fontSize: 10 }}>{tc('cfo_budget.row_revenue')}</th>
                  <th style={{ textAlign: 'right', padding: '7px 12px', color: 'var(--tx3)', fontWeight: 600, fontSize: 10 }}>{tc('cfo_budget.col_bgt_rev')}</th>
                  <th style={{ textAlign: 'right', padding: '7px 12px', color: 'var(--tx3)', fontWeight: 600, fontSize: 10 }}>{tc('cfo_budget.col_gm')}</th>
                  <th style={{ textAlign: 'right', padding: '7px 12px', color: 'var(--tx3)', fontWeight: 600, fontSize: 10 }}>{tc('cfo_budget.col_net')}</th>
                  <th style={{ textAlign: 'right', padding: '7px 18px', color: 'var(--tx3)', fontWeight: 600, fontSize: 10 }}>{tc('cfo_budget.col_bgt_net')}</th>
                </tr>
              </thead>
              <tbody>
                {pnlMonthly.map((m, i) => {
                  const revVar = monthlyBudget.revenue > 0 ? ((m.revenue - monthlyBudget.revenue) / monthlyBudget.revenue) * 100 : 0
                  const netVar = monthlyBudget.net_profit !== 0 ? ((m.net - monthlyBudget.net_profit) / Math.abs(monthlyBudget.net_profit)) * 100 : 0
                  const isSelected = drillMonth === m.month
                  return (
                    <tr
                      key={i}
                      onClick={() => setDrillMonth(isSelected ? null : m.month)}
                      style={{
                        borderTop: '1px solid var(--b)', cursor: 'pointer',
                        background: isSelected ? 'rgba(99,102,241,.04)' : undefined,
                      }}
                    >
                      <td style={{ padding: '9px 18px', fontWeight: 500, color: 'var(--tx)' }}>
                        {new Date(m.month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                      </td>
                      <td style={{ padding: '9px 12px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmt(m.revenue, sym)}</td>
                      <td style={{ padding: '9px 12px', textAlign: 'right', color: 'var(--tx3)', fontVariantNumeric: 'tabular-nums' }}>
                        {fmt(monthlyBudget.revenue, sym)}
                        {monthlyBudget.revenue > 0 && <span style={{ fontSize: 9, marginLeft: 4, color: revVar >= 0 ? '#22C55E' : '#EF4444', fontWeight: 600 }}>{revVar > 0 ? '+' : ''}{revVar.toFixed(0)}%</span>}
                      </td>
                      <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 600, color: m.gross_margin_pct >= 35 ? '#22C55E' : m.gross_margin_pct >= 20 ? '#F59E0B' : '#EF4444' }}>
                        {m.gross_margin_pct.toFixed(1)}%
                      </td>
                      <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 600, color: m.net >= 0 ? '#22C55E' : '#EF4444', fontVariantNumeric: 'tabular-nums' }}>{fmt(m.net, sym)}</td>
                      <td style={{ padding: '9px 18px', textAlign: 'right', color: 'var(--tx3)', fontVariantNumeric: 'tabular-nums' }}>
                        {fmt(monthlyBudget.net_profit, sym)}
                        {monthlyBudget.net_profit !== 0 && <span style={{ fontSize: 9, marginLeft: 4, color: netVar >= 0 ? '#22C55E' : '#EF4444', fontWeight: 600 }}>{netVar > 0 ? '+' : ''}{netVar.toFixed(0)}%</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Drill-in detail */}
          {drillMonth && (() => {
            const m = pnlMonthly.find(x => x.month === drillMonth)!
            const revVar = monthlyBudget.revenue > 0 ? ((m.revenue - monthlyBudget.revenue) / monthlyBudget.revenue) * 100 : 0
            const netVar = monthlyBudget.net_profit !== 0 ? ((m.net - monthlyBudget.net_profit) / Math.abs(monthlyBudget.net_profit)) * 100 : 0
            return (
              <div style={{ padding: '14px 18px', borderTop: '1px solid var(--b)', background: 'rgba(99,102,241,.02)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', marginBottom: 10 }}>
                  {new Date(m.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} — {tc('cfo_budget.detail_suffix')}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                  {[
                    { label: tc('cfo_budget.detail_revenue'), actual: m.revenue, budget: monthlyBudget.revenue, isNeg: false },
                    { label: tc('cfo_budget.detail_cogs'), actual: m.cogs, budget: monthlyBudget.cogs, isNeg: true },
                    { label: tc('cfo_budget.detail_gross_profit'), actual: m.revenue - m.cogs, budget: monthlyBudget.revenue - monthlyBudget.cogs, isNeg: false },
                    { label: tc('cfo_budget.detail_fixed_costs'), actual: m.fixed, budget: monthlyBudget.fixed_costs, isNeg: true },
                    { label: tc('cfo_budget.detail_net_profit'), actual: m.net, budget: monthlyBudget.net_profit, isNeg: false },
                  ].map((item, i) => {
                    const var_ = item.budget !== 0 ? ((item.actual - item.budget) / Math.abs(item.budget)) * 100 : 0
                    const col = item.isNeg ? (item.actual <= item.budget ? '#22C55E' : '#EF4444') : (item.actual >= item.budget ? '#22C55E' : '#EF4444')
                    return (
                      <div key={i} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--b)', background: 'var(--sf)' }}>
                        <div style={{ fontSize: 10, color: 'var(--tx3)', fontWeight: 500, marginBottom: 4 }}>{item.label}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--tx)' }}>{fmt(item.actual, sym)}</span>
                          {item.budget !== 0 && <span style={{ fontSize: 10, fontWeight: 600, color: col }}>{var_ > 0 ? '+' : ''}{var_.toFixed(1)}%</span>}
                        </div>
                        {item.budget !== 0 && <div style={{ fontSize: 9, color: 'var(--tx3)' }}>{tc('cfo_budget.budget_inline', { v: fmt(item.budget, sym) })}</div>}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}

function BudgetRow({ label, actual, budget, sym, editing, isNeg, onEdit, onInput, onCommit, editValue, tc }: {
  label: string; actual: number; budget: number; sym: string; editing: boolean
  isNeg: boolean; onEdit: () => void; onInput: (v: string) => void
  onCommit: () => void; editValue: string; tc: TC
}) {
  return (
    <tr style={{ borderTop: '1px solid var(--b)' }}>
      <td style={{ padding: '9px 18px', color: 'var(--tx3)', fontSize: 12 }}>{label}</td>
      <td style={{ padding: '9px 14px', textAlign: 'right', cursor: 'pointer' }} onClick={onEdit}>
        {editing ? (
          <input
            autoFocus
            type="number"
            value={editValue}
            onChange={e => onInput(e.target.value)}
            onBlur={onCommit}
            onKeyDown={e => e.key === 'Enter' && onCommit()}
            onClick={e => e.stopPropagation()}
            style={{ width: 80, padding: '2px 6px', borderRadius: 4, border: '1px solid #6366F1', fontSize: 11, fontFamily: 'inherit', textAlign: 'right', outline: 'none' }}
          />
        ) : (
          <span style={{ fontSize: 12, color: budget > 0 ? 'var(--tx)' : 'var(--tx3)', fontVariantNumeric: 'tabular-nums' }}>
            {budget > 0 ? fmt(budget, sym) : <span style={{ fontSize: 10, color: '#6366F1' }}>{tc('cfo_budget.set_label')}</span>}
          </span>
        )}
      </td>
      <td style={{ padding: '9px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmt(actual, sym)}</td>
      <VarCells actual={actual} budget={budget} isNeg={isNeg} sym={sym} />
    </tr>
  )
}

function VarCells({ actual, budget, isNeg, sym, large }: {
  actual: number; budget: number; isNeg: boolean; sym: string; large?: boolean
}) {
  const variance = actual - budget
  const variancePct = budget !== 0 ? (variance / Math.abs(budget)) * 100 : null
  const col = budget === 0 ? 'var(--tx3)' : isNeg
    ? (variance <= 0 ? '#22C55E' : '#EF4444')
    : (variance >= 0 ? '#22C55E' : '#EF4444')

  return (
    <>
      <td style={{ padding: '9px 14px', textAlign: 'right', color: budget === 0 ? 'var(--tx3)' : col, fontWeight: 600, fontVariantNumeric: 'tabular-nums', fontSize: large ? 13 : undefined }}>
        {budget === 0 ? '—' : `${variance >= 0 ? '+' : ''}${fmt(variance, sym)}`}
      </td>
      <td style={{ padding: '9px 18px', textAlign: 'right', color: budget === 0 ? 'var(--tx3)' : col, fontWeight: 600, fontSize: large ? 13 : undefined }}>
        {variancePct != null ? `${variancePct > 0 ? '+' : ''}${variancePct.toFixed(1)}%` : '—'}
      </td>
    </>
  )
}
