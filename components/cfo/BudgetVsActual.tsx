'use client'
import { useState, useEffect } from 'react'

interface Totals {
  revenue: number; cogs: number; gross_profit: number; fixed_costs: number; net_profit: number
  gross_margin_pct: number; net_margin_pct: number
}

interface MonthlyRow {
  month: string; revenue: number; cogs: number; fixed: number; net: number
  gross_margin_pct: number; net_margin_pct: number
}

interface Budget {
  revenue: number; cogs: number; fixed_costs: number; net_profit: number
}

const STORAGE_KEY = 'cfo_budget_v2'
const DEFAULT_BUDGET: Budget = { revenue: 0, cogs: 0, fixed_costs: 0, net_profit: 0 }

interface Props {
  totals: Totals
  pnlMonthly?: MonthlyRow[]
  currencySymbol: string
  period: string
  onAsk?: (prompt: string) => void
}

function fmt(n: number, sym: string): string {
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `${n < 0 ? '-' : ''}${sym}${(abs / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `${n < 0 ? '-' : ''}${sym}${(abs / 1_000).toFixed(1)}K`
  return `${n < 0 ? '-' : ''}${sym}${Math.round(abs).toLocaleString()}`
}

function varColor(actual: number, budget: number, isNegative = false) {
  if (budget === 0) return 'var(--tx3)'
  const diff = actual - budget
  if (isNegative) return diff <= 0 ? '#22C55E' : '#EF4444'
  return diff >= 0 ? '#22C55E' : '#EF4444'
}

export default function BudgetVsActual({ totals, pnlMonthly, currencySymbol: sym, period, onAsk }: Props) {
  const [budget, setBudget] = useState<Budget>(DEFAULT_BUDGET)
  const [editing, setEditing] = useState<keyof Budget | null>(null)
  const [editValue, setEditValue] = useState('')
  const [drillMonth, setDrillMonth] = useState<string | null>(null)
  const [hasBudget, setHasBudget] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setBudget(parsed)
        setHasBudget(Object.values(parsed).some((v: any) => Number(v) > 0))
      }
    } catch {}
  }, [])

  const saveBudget = (b: Budget) => {
    setBudget(b)
    setHasBudget(Object.values(b).some(v => Number(v) > 0))
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(b)) } catch {}
  }

  const startEdit = (field: keyof Budget, current: number) => {
    setEditing(field)
    setEditValue(String(current > 0 ? current : ''))
  }

  const commitEdit = () => {
    if (!editing) return
    const val = parseFloat(editValue) || 0
    const updated = { ...budget, [editing]: val }
    // Auto-compute net if revenue/cogs/fixed are set
    if (editing !== 'net_profit') {
      updated.net_profit = updated.revenue - updated.cogs - updated.fixed_costs
    }
    saveBudget(updated)
    setEditing(null)
  }

  const importFromActuals = () => {
    const b: Budget = {
      revenue: totals.revenue,
      cogs: totals.cogs,
      fixed_costs: totals.fixed_costs,
      net_profit: totals.net_profit,
    }
    saveBudget(b)
  }

  const lines: Array<{
    key: keyof Budget; label: string; actual: number; negative?: boolean; isSub?: boolean; isSummary?: boolean
  }> = [
    { key: 'revenue', label: 'Revenue', actual: totals.revenue },
    { key: 'cogs', label: 'Cost of Goods Sold', actual: totals.cogs, negative: true, isSub: true },
    { key: 'net_profit', label: 'Gross Profit', actual: totals.gross_profit, isSummary: true },
    { key: 'fixed_costs', label: 'Operating Expenses', actual: totals.fixed_costs, negative: true, isSub: true },
    { key: 'net_profit', label: 'Net Profit', actual: totals.net_profit, isSummary: true },
  ]

  // Deduplicate keys for rendering
  const uniqueLines = [
    { key: 'revenue' as keyof Budget, label: 'Revenue', actual: totals.revenue, isNeg: false },
    { key: 'cogs' as keyof Budget, label: 'COGS', actual: totals.cogs, isNeg: true },
    { key: 'fixed_costs' as keyof Budget, label: 'Expenses', actual: totals.fixed_costs, isNeg: true },
    { key: 'net_profit' as keyof Budget, label: 'Net Profit', actual: totals.net_profit, isNeg: false },
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
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>Budget vs Actual</span>
            {!hasBudget && (
              <span style={{ fontSize: 10, color: '#F59E0B', background: 'rgba(245,158,11,.1)', borderRadius: 6, padding: '1px 6px', fontWeight: 600 }}>No budget set</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {!hasBudget && (
              <button
                onClick={importFromActuals}
                style={{ fontSize: 10, color: '#F59E0B', background: 'rgba(245,158,11,.08)', border: '1px solid rgba(245,158,11,.3)', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
              >
                Use actuals as budget
              </button>
            )}
            {onAsk && hasBudget && (
              <button
                onClick={() => {
                  const revVar = budget.revenue > 0 ? Math.round(((totals.revenue - budget.revenue) / budget.revenue) * 100) : 0
                  const profVar = budget.net_profit !== 0 ? Math.round(((totals.net_profit - budget.net_profit) / Math.abs(budget.net_profit)) * 100) : 0
                  onAsk(`My budget vs actual for this period: Revenue actual ${fmt(totals.revenue, sym)} vs budget ${fmt(budget.revenue, sym)} (${revVar > 0 ? '+' : ''}${revVar}%). Net profit actual ${fmt(totals.net_profit, sym)} vs budget ${fmt(budget.net_profit, sym)} (${profVar > 0 ? '+' : ''}${profVar}%). What's causing the variances and what should I focus on?`)
                }}
                style={{ fontSize: 10, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
              >Ask AI</button>
            )}
          </div>
        </div>

        {/* Main comparison table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--b)' }}>
                <th style={{ textAlign: 'left', padding: '8px 18px', color: 'var(--tx3)', fontWeight: 600, fontSize: 10 }}>Line Item</th>
                <th style={{ textAlign: 'right', padding: '8px 14px', color: 'var(--tx3)', fontWeight: 600, fontSize: 10 }}>Budget</th>
                <th style={{ textAlign: 'right', padding: '8px 14px', color: 'var(--tx3)', fontWeight: 600, fontSize: 10 }}>Actual</th>
                <th style={{ textAlign: 'right', padding: '8px 14px', color: 'var(--tx3)', fontWeight: 600, fontSize: 10 }}>Variance</th>
                <th style={{ textAlign: 'right', padding: '8px 18px', color: 'var(--tx3)', fontWeight: 600, fontSize: 10 }}>% Var</th>
              </tr>
            </thead>
            <tbody>
              {/* Revenue */}
              <BudgetRow
                label="Revenue" actual={totals.revenue} budget={budget.revenue}
                sym={sym} editing={editing === 'revenue'} isNeg={false}
                onEdit={() => startEdit('revenue', budget.revenue)}
                onInput={v => setEditValue(v)}
                onCommit={commitEdit}
                editValue={editValue}
              />
              {/* COGS */}
              <BudgetRow
                label="Cost of Goods" actual={totals.cogs} budget={budget.cogs}
                sym={sym} editing={editing === 'cogs'} isNeg={true}
                onEdit={() => startEdit('cogs', budget.cogs)}
                onInput={v => setEditValue(v)}
                onCommit={commitEdit}
                editValue={editValue}
              />
              {/* Gross Profit (computed) */}
              <tr style={{ background: 'rgba(34,197,94,.02)', borderTop: '2px solid var(--b)' }}>
                <td style={{ padding: '9px 18px', fontWeight: 700, color: 'var(--tx)', fontSize: 12 }}>Gross Profit</td>
                <td style={{ padding: '9px 14px', textAlign: 'right', fontWeight: 700, color: 'var(--tx)', fontVariantNumeric: 'tabular-nums' }}>{fmt(budgetGrossProfit, sym)}</td>
                <td style={{ padding: '9px 14px', textAlign: 'right', fontWeight: 700, color: 'var(--tx)', fontVariantNumeric: 'tabular-nums' }}>{fmt(grossProfit, sym)}</td>
                <VarCells actual={grossProfit} budget={budgetGrossProfit} isNeg={false} sym={sym} />
              </tr>
              {/* Operating Expenses */}
              <BudgetRow
                label="Operating Expenses" actual={totals.fixed_costs} budget={budget.fixed_costs}
                sym={sym} editing={editing === 'fixed_costs'} isNeg={true}
                onEdit={() => startEdit('fixed_costs', budget.fixed_costs)}
                onInput={v => setEditValue(v)}
                onCommit={commitEdit}
                editValue={editValue}
              />
              {/* Net Profit (computed) */}
              <tr style={{ background: totals.net_profit >= 0 ? 'rgba(99,102,241,.03)' : 'rgba(239,68,68,.03)', borderTop: '2px solid var(--b)' }}>
                <td style={{ padding: '11px 18px', fontWeight: 800, color: 'var(--tx)', fontSize: 13 }}>Net Profit</td>
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
            Click any <strong>Budget</strong> cell above to set your targets, or click "Use actuals as budget" to start from this period's numbers.
          </div>
        )}
      </div>

      {/* Visual progress bars */}
      {hasBudget && (
        <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--b)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx)' }}>Budget Attainment</div>
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
                    <span style={{ fontSize: 11, fontWeight: 600, color }}>{rawPct.toFixed(0)}% of budget</span>
                  </div>
                  <div style={{ height: 10, borderRadius: 5, background: 'var(--ev, #f3f2ef)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${Math.min(pct, 100)}%`,
                      background: color, borderRadius: 5, transition: 'width 400ms',
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3, fontSize: 10, color: 'var(--tx3)' }}>
                    <span>{fmt(line.actual, sym)} actual</span>
                    <span>{fmt(b, sym)} budget</span>
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
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx)' }}>Monthly Trend vs Budget</span>
            <span style={{ fontSize: 10, color: 'var(--tx3)' }}>Click a month to drill in</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--b)' }}>
                  <th style={{ textAlign: 'left', padding: '7px 18px', color: 'var(--tx3)', fontWeight: 600, fontSize: 10 }}>Month</th>
                  <th style={{ textAlign: 'right', padding: '7px 12px', color: 'var(--tx3)', fontWeight: 600, fontSize: 10 }}>Revenue</th>
                  <th style={{ textAlign: 'right', padding: '7px 12px', color: 'var(--tx3)', fontWeight: 600, fontSize: 10 }}>Bgt Rev</th>
                  <th style={{ textAlign: 'right', padding: '7px 12px', color: 'var(--tx3)', fontWeight: 600, fontSize: 10 }}>GM%</th>
                  <th style={{ textAlign: 'right', padding: '7px 12px', color: 'var(--tx3)', fontWeight: 600, fontSize: 10 }}>Net</th>
                  <th style={{ textAlign: 'right', padding: '7px 18px', color: 'var(--tx3)', fontWeight: 600, fontSize: 10 }}>Bgt Net</th>
                </tr>
              </thead>
              <tbody>
                {pnlMonthly.map((m, i) => {
                  const revVar = budget.revenue > 0 ? ((m.revenue - budget.revenue) / budget.revenue) * 100 : 0
                  const netVar = budget.net_profit !== 0 ? ((m.net - budget.net_profit) / Math.abs(budget.net_profit)) * 100 : 0
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
                        {fmt(budget.revenue, sym)}
                        {budget.revenue > 0 && <span style={{ fontSize: 9, marginLeft: 4, color: revVar >= 0 ? '#22C55E' : '#EF4444', fontWeight: 600 }}>{revVar > 0 ? '+' : ''}{revVar.toFixed(0)}%</span>}
                      </td>
                      <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 600, color: m.gross_margin_pct >= 35 ? '#22C55E' : m.gross_margin_pct >= 20 ? '#F59E0B' : '#EF4444' }}>
                        {m.gross_margin_pct.toFixed(1)}%
                      </td>
                      <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 600, color: m.net >= 0 ? '#22C55E' : '#EF4444', fontVariantNumeric: 'tabular-nums' }}>{fmt(m.net, sym)}</td>
                      <td style={{ padding: '9px 18px', textAlign: 'right', color: 'var(--tx3)', fontVariantNumeric: 'tabular-nums' }}>
                        {fmt(budget.net_profit, sym)}
                        {budget.net_profit !== 0 && <span style={{ fontSize: 9, marginLeft: 4, color: netVar >= 0 ? '#22C55E' : '#EF4444', fontWeight: 600 }}>{netVar > 0 ? '+' : ''}{netVar.toFixed(0)}%</span>}
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
            const revVar = budget.revenue > 0 ? ((m.revenue - budget.revenue) / budget.revenue) * 100 : 0
            const netVar = budget.net_profit !== 0 ? ((m.net - budget.net_profit) / Math.abs(budget.net_profit)) * 100 : 0
            return (
              <div style={{ padding: '14px 18px', borderTop: '1px solid var(--b)', background: 'rgba(99,102,241,.02)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', marginBottom: 10 }}>
                  {new Date(m.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} — Detail
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                  {[
                    { label: 'Revenue', actual: m.revenue, budget: budget.revenue, isNeg: false },
                    { label: 'COGS', actual: m.cogs, budget: budget.cogs, isNeg: true },
                    { label: 'Gross Profit', actual: m.revenue - m.cogs, budget: budget.revenue - budget.cogs, isNeg: false },
                    { label: 'Fixed Costs', actual: m.fixed, budget: budget.fixed_costs, isNeg: true },
                    { label: 'Net Profit', actual: m.net, budget: budget.net_profit, isNeg: false },
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
                        {item.budget !== 0 && <div style={{ fontSize: 9, color: 'var(--tx3)' }}>budget: {fmt(item.budget, sym)}</div>}
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

function BudgetRow({ label, actual, budget, sym, editing, isNeg, onEdit, onInput, onCommit, editValue }: {
  label: string; actual: number; budget: number; sym: string; editing: boolean
  isNeg: boolean; onEdit: () => void; onInput: (v: string) => void
  onCommit: () => void; editValue: string
}) {
  const variance = actual - budget
  const variancePct = budget !== 0 ? (variance / Math.abs(budget)) * 100 : null
  const col = isNeg
    ? (variance <= 0 ? '#22C55E' : '#EF4444')
    : (variance >= 0 ? '#22C55E' : '#EF4444')

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
            {budget > 0 ? fmt(budget, sym) : <span style={{ fontSize: 10, color: '#6366F1' }}>+ Set</span>}
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
