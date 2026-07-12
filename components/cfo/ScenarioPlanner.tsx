'use client'
import { useState } from 'react'
import { useLang } from '@/components/LanguageProvider'

interface Props {
  baseRevenue: number
  baseCogs: number
  baseFixed: number
  cashBalance: number
  currencySymbol: string
}

interface Scenario {
  revenueChange: number
  cogsChange: number
  newMonthlyExpense: number
  oneTimeExpense: number
  priceChange: number
}

const buildPresets = (tc: (k: string, v?: Record<string, string | number>) => string) => [
  { label: tc('cfo_scenario.presetLose20Revenue'), icon: '📉', scenario: { revenueChange: -20 } },
  { label: tc('cfo_scenario.presetHireEmployee'), icon: '👤', scenario: { newMonthlyExpense: 35000 } },
  { label: tc('cfo_scenario.presetSupplierCosts'), icon: '📦', scenario: { cogsChange: 15 } },
  { label: tc('cfo_scenario.presetOpen2ndLocation'), icon: '🏪', scenario: { newMonthlyExpense: 80000 } },
  { label: tc('cfo_scenario.presetRaisePrices'), icon: '💰', scenario: { priceChange: 10, revenueChange: 5 } },
  { label: tc('cfo_scenario.presetSeasonalDip'), icon: '🌧️', scenario: { revenueChange: -30 } },
]

const DEFAULT: Scenario = { revenueChange: 0, cogsChange: 0, newMonthlyExpense: 0, oneTimeExpense: 0, priceChange: 0 }

function fmt(n: number, sym: string): string {
  if (Math.abs(n) >= 1_000_000) return `${sym}${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `${sym}${(n / 1_000).toFixed(0)}K`
  return `${sym}${Math.round(n).toLocaleString()}`
}

export default function ScenarioPlanner({ baseRevenue, baseCogs, baseFixed, cashBalance, currencySymbol: sym }: Props) {
  const { tc } = useLang()
  const [s, setS] = useState<Scenario>({ ...DEFAULT })
  const [activePreset, setActivePreset] = useState<string | null>(null)

  const PRESETS = buildPresets(tc)

  const applyPreset = (label: string, scenario: Partial<Scenario>) => {
    if (activePreset === label) {
      setS({ ...DEFAULT })
      setActivePreset(null)
    } else {
      setS({ ...DEFAULT, ...scenario })
      setActivePreset(label)
    }
  }

  const update = (key: keyof Scenario, val: number) => {
    setS(prev => ({ ...prev, [key]: val }))
    setActivePreset(null)
  }

  // Compute projected monthly figures
  const projRevenue = baseRevenue * (1 + s.revenueChange / 100)
  const projCogs = baseCogs * (1 + s.cogsChange / 100)
  const projFixed = baseFixed + s.newMonthlyExpense
  const projNet = projRevenue - projCogs - projFixed - (s.oneTimeExpense / 12)
  const projMargin = projRevenue > 0 ? (projNet / projRevenue) * 100 : 0

  // Current baseline
  const baseNet = baseRevenue - baseCogs - baseFixed
  const baseMargin = baseRevenue > 0 ? (baseNet / baseRevenue) * 100 : 0

  // Cash runway
  const dailyBurn = projNet / 30
  let runwayMonths: number | null = null
  let runwayLabel: string
  if (cashBalance > 0 && dailyBurn < 0) {
    runwayMonths = Math.round((cashBalance / Math.abs(dailyBurn) / 30) * 10) / 10
    runwayLabel = tc('cfo_scenario.runwayMonths', { n: runwayMonths })
  } else if (dailyBurn >= 0) {
    runwayLabel = tc('cfo_scenario.runwayCashPositive')
  } else {
    runwayLabel = tc('cfo_scenario.runwaySetBalance')
  }

  const baseRunway = cashBalance > 0 && baseNet < 0 ? Math.round((cashBalance / Math.abs(baseNet / 30) / 30) * 10) / 10 : null

  // Break-even
  const breakEvenRevenue = projCogs + projFixed + (s.oneTimeExpense / 12)
  const revenueGap = projRevenue - breakEvenRevenue

  return (
    <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_scenario.title')}</div>
        <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 2 }}>{tc('cfo_scenario.subtitle')}</div>
      </div>

      {/* Presets */}
      <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--b)' }}>
        <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{tc('cfo_scenario.quickScenariosLabel')}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {PRESETS.map(p => (
            <button
              key={p.label}
              onClick={() => applyPreset(p.label, p.scenario)}
              style={{
                padding: '6px 10px', borderRadius: 8, fontSize: 9, fontWeight: 500,
                border: activePreset === p.label ? '1px solid #6366F1' : '1px solid var(--b)',
                background: activePreset === p.label ? 'rgba(99,102,241,.08)' : 'transparent',
                color: activePreset === p.label ? '#6366F1' : 'var(--tx2)',
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 120ms',
              }}
            >
              {p.icon} {p.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
        {/* Left: Sliders */}
        <div style={{ padding: '16px 18px', borderRight: '1px solid var(--b)' }}>
          <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>{tc('cfo_scenario.adjustAssumptionsLabel')}</div>

          <SliderControl label={tc('cfo_scenario.sliderRevenue')} value={s.revenueChange} min={-50} max={50} step={5} unit="%" onChange={v => update('revenueChange', v)} />
          <SliderControl label={tc('cfo_scenario.sliderCogs')} value={s.cogsChange} min={-30} max={30} step={5} unit="%" onChange={v => update('cogsChange', v)} />
          <SliderControl label={tc('cfo_scenario.sliderNewMonthly')} value={s.newMonthlyExpense} min={0} max={200000} step={5000} unit={sym} onChange={v => update('newMonthlyExpense', v)} />
          <SliderControl label={tc('cfo_scenario.sliderOneTime')} value={s.oneTimeExpense} min={0} max={1000000} step={10000} unit={sym} onChange={v => update('oneTimeExpense', v)} />
        </div>

        {/* Right: Results */}
        <div style={{ padding: '16px 18px' }}>
          <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>{tc('cfo_scenario.projectedMonthlyLabel')}</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <ResultRow label={tc('cfo_scenario.rowRevenue')} base={baseRevenue} projected={projRevenue} sym={sym} />
            <ResultRow label={tc('cfo_scenario.rowCogs')} base={baseCogs} projected={projCogs} sym={sym} negative />
            <ResultRow label={tc('cfo_scenario.rowFixedCosts')} base={baseFixed} projected={projFixed} sym={sym} negative />
            <div style={{ borderTop: '2px solid var(--b)', paddingTop: 8 }}>
              <ResultRow label={tc('cfo_scenario.rowNetProfit')} base={baseNet} projected={projNet} sym={sym} bold />
            </div>
            <ResultRow label={tc('cfo_scenario.rowNetMargin')} base={baseMargin} projected={projMargin} sym="" unit="%" isPercent />

            <div style={{ borderTop: '1px solid var(--b)', paddingTop: 8, marginTop: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 9, color: 'var(--tx3)' }}>{tc('cfo_scenario.cashRunwayLabel')}</span>
                <span style={{
                  fontSize: 12, fontWeight: 700,
                  color: runwayMonths != null && runwayMonths < 3 ? '#EF4444' : runwayMonths != null && runwayMonths < 6 ? '#F59E0B' : '#22C55E',
                }}>
                  {runwayLabel}
                </span>
              </div>
              {baseRunway != null && runwayMonths != null && (
                <div style={{ fontSize: 9, color: 'var(--tx3)' }}>
                  {tc('cfo_scenario.runwayComparison', { base: baseRunway, scenario: runwayMonths })}
                  <span style={{ marginLeft: 4, color: runwayMonths > baseRunway ? '#22C55E' : '#EF4444', fontWeight: 600 }}>
                    ({runwayMonths > baseRunway ? '+' : ''}{tc('cfo_scenario.runwayChangeSuffix', { delta: (runwayMonths - baseRunway).toFixed(1) })})
                  </span>
                </div>
              )}
            </div>

            {/* Break-even indicator */}
            <div style={{
              marginTop: 4, padding: '8px 12px', borderRadius: 8,
              background: revenueGap >= 0 ? 'rgba(34,197,94,.06)' : 'rgba(239,68,68,.06)',
              border: `1px solid ${revenueGap >= 0 ? 'rgba(34,197,94,.15)' : 'rgba(239,68,68,.15)'}`,
            }}>
              {revenueGap >= 0 ? (
                <div style={{ fontSize: 9, color: '#22C55E', fontWeight: 500 }}>
                  {tc('cfo_scenario.aboveBreakEven', { amount: fmt(revenueGap, sym) })}
                </div>
              ) : (
                <div style={{ fontSize: 9, color: '#EF4444', fontWeight: 500 }}>
                  {tc('cfo_scenario.belowBreakEven', { amount: fmt(Math.abs(revenueGap), sym) })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SliderControl({ label, value, min, max, step, unit, onChange }: {
  label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (v: number) => void
}) {
  const pct = ((value - min) / (max - min)) * 100
  const displayVal = unit === '%' ? `${value > 0 ? '+' : ''}${value}%` : `${unit}${value.toLocaleString()}`

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 9, color: 'var(--tx2)' }}>{label}</span>
        <span style={{ fontSize: 9, fontWeight: 600, color: value !== 0 ? '#6366F1' : 'var(--tx3)', fontVariantNumeric: 'tabular-nums' }}>{displayVal}</span>
      </div>
      <div style={{ position: 'relative', height: 20, display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', width: '100%', height: 4, borderRadius: 2, background: 'var(--ev, #e5e5e5)' }} />
        <div style={{ position: 'absolute', width: `${pct}%`, height: 4, borderRadius: 2, background: '#6366F1' }} />
        <input
          type="range"
          min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{
            position: 'absolute', width: '100%', height: 20, opacity: 0, cursor: 'pointer', margin: 0,
          }}
        />
        <div style={{
          position: 'absolute', left: `calc(${pct}% - 7px)`,
          width: 14, height: 14, borderRadius: '50%',
          background: '#6366F1', border: '2px solid #fff',
          boxShadow: '0 1px 4px rgba(0,0,0,.15)',
          pointerEvents: 'none',
        }} />
      </div>
    </div>
  )
}

function ResultRow({ label, base, projected, sym, negative, bold, unit, isPercent }: {
  label: string; base: number; projected: number; sym: string; negative?: boolean; bold?: boolean; unit?: string; isPercent?: boolean
}) {
  const fmtVal = (n: number) => {
    if (isPercent) return `${n.toFixed(1)}%`
    const abs = Math.abs(n)
    if (abs >= 1_000_000) return `${n < 0 ? '-' : ''}${sym}${(abs / 1_000_000).toFixed(1)}M`
    if (abs >= 1_000) return `${n < 0 ? '-' : ''}${sym}${Math.round(abs).toLocaleString()}`
    return `${n < 0 ? '-' : ''}${sym}${Math.round(abs)}`
  }

  const diff = projected - base
  const diffPct = base !== 0 ? ((diff / Math.abs(base)) * 100) : 0

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 9, color: 'var(--tx3)', fontWeight: bold ? 600 : 400 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          fontSize: bold ? 15 : 13, fontWeight: bold ? 700 : 500,
          color: bold ? (projected >= 0 ? '#22C55E' : '#EF4444') : negative ? '#EF4444' : 'var(--tx)',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {fmtVal(projected)}
        </span>
        {Math.abs(diff) > 0.5 && (
          <span style={{
            fontSize: 9, fontWeight: 600,
            color: (bold ? diff >= 0 : negative ? diff <= 0 : diff >= 0) ? '#22C55E' : '#EF4444',
          }}>
            {diff > 0 ? '+' : ''}{isPercent ? `${diff.toFixed(1)}pp` : fmtVal(diff)}
          </span>
        )}
      </div>
    </div>
  )
}
