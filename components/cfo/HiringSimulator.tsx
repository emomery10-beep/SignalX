'use client'

import { useState, useEffect } from 'react'
import { useLang } from '@/components/LanguageProvider'

interface Props {
  monthlyBaseline: { revenue: number; cogs: number; fixed: number }
  cash: { balance: number; monthly_fixed: number; runway_months: number | null; daily_net_burn: number }
  currencySymbol: string
  onAsk: (prompt: string) => void
}

interface HireRow { id: string; role: string; salary: number; count: number; startMonth: number }

const CARD: React.CSSProperties = { borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }
const GREEN = '#22C55E', RED = '#EF4444', INDIGO = '#6366F1', AMBER = '#F59E0B'

function fmt(n: number, sym: string): string {
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `${n < 0 ? '(' : ''}${sym}${(abs / 1_000_000).toFixed(1)}M${n < 0 ? ')' : ''}`
  if (abs >= 1_000) return `${n < 0 ? '(' : ''}${sym}${(abs / 1_000).toFixed(1)}K${n < 0 ? ')' : ''}`
  return `${n < 0 ? '(' : ''}${sym}${Math.round(abs).toLocaleString()}${n < 0 ? ')' : ''}`
}

function loadHires(): HireRow[] {
  try { const s = localStorage.getItem('cfo_hiring_sim'); return s ? JSON.parse(s) : [] } catch { return [] }
}
function saveHires(h: HireRow[]) {
  try { localStorage.setItem('cfo_hiring_sim', JSON.stringify(h)) } catch {}
}

export default function HiringSimulator({ monthlyBaseline, cash, currencySymbol: sym, onAsk }: Props) {
  const { tc } = useLang()
  const [hires, setHires] = useState<HireRow[]>([])
  const [burdenRate, setBurdenRate] = useState(1.3) // 30% on top for benefits/tax

  useEffect(() => {
    const saved = loadHires()
    if (saved.length > 0) setHires(saved)
    try { const br = localStorage.getItem('cfo_burden_rate'); if (br) setBurdenRate(Number(br) || 1.3) } catch {}
  }, [])

  const update = (updated: HireRow[]) => { setHires(updated); saveHires(updated) }
  const saveBurden = (v: number) => { setBurdenRate(v); try { localStorage.setItem('cfo_burden_rate', String(v)) } catch {} }

  const addHire = () => {
    update([...hires, { id: Date.now().toString(), role: '', salary: 0, count: 1, startMonth: 1 }])
  }
  const removeHire = (id: string) => update(hires.filter(h => h.id !== id))
  const updateHire = (id: string, field: keyof HireRow, value: string | number) => {
    update(hires.map(h => h.id === id ? { ...h, [field]: value } : h))
  }

  // Calculations
  const totalMonthlyCost = hires.reduce((s, h) => s + (h.salary * h.count * burdenRate), 0)
  const totalAnnualCost = totalMonthlyCost * 12
  const totalHeadcount = hires.reduce((s, h) => s + h.count, 0)

  const currentFixedCosts = monthlyBaseline.fixed
  const newFixedCosts = currentFixedCosts + totalMonthlyCost
  const currentNetProfit = monthlyBaseline.revenue - monthlyBaseline.cogs - monthlyBaseline.fixed
  const newNetProfit = currentNetProfit - totalMonthlyCost
  const currentMargin = monthlyBaseline.revenue > 0 ? (currentNetProfit / monthlyBaseline.revenue) * 100 : 0
  const newMargin = monthlyBaseline.revenue > 0 ? (newNetProfit / monthlyBaseline.revenue) * 100 : 0

  const currentRunway = cash.runway_months
  const monthlyBurn = cash.monthly_fixed + totalMonthlyCost
  const newRunway = monthlyBurn > 0 ? Math.round((cash.balance / monthlyBurn) * 10) / 10 : null

  // Revenue needed to maintain current margin
  const revenueNeeded = currentMargin > 0 ? totalMonthlyCost / (currentMargin / 100) : 0

  // Break-even on each hire (how much revenue per hire to cover cost)
  const revenuePerHire = totalHeadcount > 0 && currentMargin > 0
    ? (totalMonthlyCost / totalHeadcount) / (currentMargin / 100)
    : 0

  return (
    <div style={CARD}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: INDIGO }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_hiring.title')}</span>
          {totalHeadcount > 0 && (
            <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: 'rgba(99,102,241,.08)', color: INDIGO }}>
              +{totalHeadcount} {tc('cfo_hiring.hireBadge', { n: totalHeadcount })} · {fmt(totalMonthlyCost, sym)}/mo
            </span>
          )}
        </div>
        <button onClick={() => onAsk(tc('cfo_hiring.askAiPrompt', { headcount: totalHeadcount, monthlyCost: fmt(totalMonthlyCost, sym), annualCost: fmt(totalAnnualCost, sym), netProfit: fmt(currentNetProfit, sym), runway: String(currentRunway ?? '∞'), newNetProfit: fmt(newNetProfit, sym), newRunway: String(newRunway ?? '∞'), revenueNeeded: fmt(revenueNeeded, sym) }))}
          style={{ fontSize: 10, color: INDIGO, background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}>
          {tc('cfo_hiring.askAiBtn')}
        </button>
      </div>

      <div style={{ padding: '16px 18px' }}>
        <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 14, lineHeight: 1.5 }}>
          {tc('cfo_hiring.subtitle')}
        </div>

        {/* Burden rate */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, padding: '8px 12px', borderRadius: 8, background: 'var(--ev, #f9f9f8)' }}>
          <span style={{ fontSize: 10, color: 'var(--tx3)', fontWeight: 600 }}>{tc('cfo_hiring.burdenRateLabel')}</span>
          <select value={burdenRate} onChange={e => saveBurden(Number(e.target.value))}
            style={{ fontSize: 11, padding: '3px 6px', borderRadius: 5, border: '1px solid var(--b)', background: 'var(--sf)', fontFamily: 'inherit', color: 'var(--tx)' }}>
            <option value={1.15}>{tc('cfo_hiring.burdenMinimal')}</option>
            <option value={1.3}>{tc('cfo_hiring.burdenStandard')}</option>
            <option value={1.4}>{tc('cfo_hiring.burdenFullBenefits')}</option>
            <option value={1.5}>{tc('cfo_hiring.burdenPremium')}</option>
          </select>
          <span style={{ fontSize: 9, color: 'var(--tx3)' }}>{tc('cfo_hiring.burdenNote')}</span>
        </div>

        {/* Hire rows */}
        {hires.map(h => (
          <div key={h.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 60px 40px', gap: 8, marginBottom: 8, alignItems: 'center' }}>
            <input value={h.role} placeholder={tc('cfo_hiring.rolePlaceholder')}
              onChange={e => updateHire(h.id, 'role', e.target.value)}
              style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--b)', fontSize: 11, fontFamily: 'inherit', background: 'var(--sf)', color: 'var(--tx)', outline: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <span style={{ fontSize: 10, color: 'var(--tx3)' }}>{sym}</span>
              <input type="number" value={h.salary || ''} placeholder={tc('cfo_hiring.salaryPlaceholder')}
                onChange={e => updateHire(h.id, 'salary', Number(e.target.value) || 0)}
                style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid var(--b)', fontSize: 11, fontFamily: 'inherit', fontVariantNumeric: 'tabular-nums', background: 'var(--sf)', color: 'var(--tx)', outline: 'none', textAlign: 'right' }} />
            </div>
            <select value={h.count} onChange={e => updateHire(h.id, 'count', Number(e.target.value))}
              style={{ padding: '6px 4px', borderRadius: 6, border: '1px solid var(--b)', fontSize: 11, fontFamily: 'inherit', background: 'var(--sf)', color: 'var(--tx)' }}>
              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}x</option>)}
            </select>
            <button onClick={() => removeHire(h.id)}
              style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--b)', background: 'var(--sf)', color: RED, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}>
              ×
            </button>
          </div>
        ))}

        <button onClick={addHire}
          style={{ width: '100%', padding: '8px', borderRadius: 8, border: '1px dashed var(--b)', background: 'transparent', color: INDIGO, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 16 }}>
          {tc('cfo_hiring.addRoleBtn')}
        </button>

        {/* Impact analysis */}
        {totalHeadcount > 0 && (
          <>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>{tc('cfo_hiring.financialImpactHeading')}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, background: 'var(--b)', borderRadius: 8, overflow: 'hidden', marginBottom: 14 }}>
              {([
                [tc('cfo_hiring.monthlyCostLabel'), fmt(totalMonthlyCost, sym), INDIGO],
                [tc('cfo_hiring.annualCostLabel'), fmt(totalAnnualCost, sym), INDIGO],
                [tc('cfo_hiring.fullyBurdenedLabel'), `${burdenRate}x`, 'var(--tx3)'],
              ] as const).map(([label, value, color]) => (
                <div key={label} style={{ padding: '10px 8px', background: 'var(--sf)', textAlign: 'center' }}>
                  <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Before vs After */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--b)' }}>
                  <th style={{ textAlign: 'left', padding: '6px 0', fontSize: 10, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase' }}></th>
                  <th style={{ textAlign: 'right', padding: '6px 0', fontSize: 10, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase' }}>{tc('cfo_hiring.colNow')}</th>
                  <th style={{ textAlign: 'right', padding: '6px 0', fontSize: 10, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase' }}>{tc('cfo_hiring.colAfterHiring')}</th>
                  <th style={{ textAlign: 'right', padding: '6px 0', fontSize: 10, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase' }}>{tc('cfo_hiring.colChange')}</th>
                </tr>
              </thead>
              <tbody>
                <ImpactRow label={tc('cfo_hiring.rowFixedCosts')} before={currentFixedCosts} after={newFixedCosts} sym={sym} negative />
                <ImpactRow label={tc('cfo_hiring.rowNetProfit')} before={currentNetProfit} after={newNetProfit} sym={sym} />
                <ImpactRow label={tc('cfo_hiring.rowNetMargin')} before={currentMargin} after={newMargin} sym={sym} pct />
                <ImpactRow label={tc('cfo_hiring.rowCashRunway')} before={currentRunway} after={newRunway} sym={sym} months />
              </tbody>
            </table>

            {/* Key insights */}
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <InsightRow color={AMBER} label={tc('cfo_hiring.insightRevenueNeeded')} value={`${fmt(revenueNeeded, sym)}/mo`} />
              <InsightRow color={AMBER} label={tc('cfo_hiring.insightRevenuePerHire')} value={`${fmt(revenuePerHire, sym)}/mo`} />
              {newNetProfit < 0 && <InsightRow color={RED} label={tc('cfo_hiring.warningLabel')} value={tc('cfo_hiring.warningLoss')} />}
              {newRunway != null && newRunway < 6 && <InsightRow color={RED} label={tc('cfo_hiring.runwayAlertLabel')} value={tc('cfo_hiring.runwayAlertValue', { n: newRunway })} />}
              {newRunway != null && newRunway >= 12 && <InsightRow color={GREEN} label={tc('cfo_hiring.healthyRunwayLabel')} value={tc('cfo_hiring.healthyRunwayValue', { n: newRunway })} />}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function ImpactRow({ label, before, after, sym, negative, pct, months }: {
  label: string; before: number | null; after: number | null; sym: string; negative?: boolean; pct?: boolean; months?: boolean
}) {
  const fmtVal = (v: number | null) => {
    if (v == null) return '—'
    if (pct) return `${v.toFixed(1)}%`
    if (months) return `${v} mo`
    return fmt(v, sym)
  }
  const diff = before != null && after != null ? after - before : null
  const diffColor = diff == null ? 'var(--tx3)' : negative ? (diff > 0 ? RED : GREEN) : (diff >= 0 ? GREEN : RED)

  return (
    <tr style={{ borderBottom: '1px solid var(--b)' }}>
      <td style={{ padding: '7px 0', fontSize: 12, color: 'var(--tx)' }}>{label}</td>
      <td style={{ padding: '7px 0', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--tx)' }}>{fmtVal(before)}</td>
      <td style={{ padding: '7px 0', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: after != null && after < 0 ? RED : 'var(--tx)' }}>{fmtVal(after)}</td>
      <td style={{ padding: '7px 0', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontSize: 11, fontWeight: 600, color: diffColor }}>
        {diff != null ? `${diff >= 0 ? '+' : ''}${pct ? diff.toFixed(1) + '%' : months ? diff.toFixed(1) + ' mo' : fmt(diff, sym)}` : '—'}
      </td>
    </tr>
  )
}

function InsightRow({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${color}20`, background: `${color}08`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--tx)' }}>{label}</span>
      <span style={{ fontSize: 11, fontWeight: 700, color, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </div>
  )
}
