'use client'

import { useState, useEffect, useRef } from 'react'
import { getRegionConfig } from '@/lib/region-config'
import { useLang } from '@/components/LanguageProvider'

type TC = (k: string, vars?: Record<string, string | number>) => string

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

interface Props {
  totals: {
    revenue: number
    cogs: number
    gross_profit: number
    fixed_costs: number
    net_profit: number
    gross_margin_pct: number
    net_margin_pct: number
  }
  comparison: {
    revenue: number
    cogs: number
    gross_profit: number
    net_profit: number
    gross_margin_pct: number
  }
  pnlMonthly?: Array<{
    month: string
    revenue: number
    cogs: number
    fixed: number
    net: number
    gross_margin_pct: number
    net_margin_pct: number
  }>
  currencySymbol: string
  countryCode?: string | null
  onAsk: (prompt: string) => void
}

/* ================================================================== */
/*  Constants                                                          */
/* ================================================================== */

const CARD: React.CSSProperties = { borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }
const GREEN = '#22C55E'
const RED = '#EF4444'
const INDIGO = '#6366F1'
const AMBER = '#F59E0B'
const CYAN = '#06B6D4'

/* ================================================================== */
/*  Industry multiples data (2026 benchmarks)                          */
/* ================================================================== */

const INDUSTRY_DATA = [
  { id: 'ecommerce',       labelKey: 'ind_ecommerce',     ebitdaLow: 3,   ebitdaHigh: 5,   sdeLow: 2,   sdeHigh: 4   },
  { id: 'retail',          labelKey: 'ind_retail',        ebitdaLow: 3,   ebitdaHigh: 5,   sdeLow: 2,   sdeHigh: 3.5 },
  { id: 'saas',            labelKey: 'ind_saas',          ebitdaLow: 8,   ebitdaHigh: 15,  sdeLow: 4,   sdeHigh: 8   },
  { id: 'food',            labelKey: 'ind_food',          ebitdaLow: 4,   ebitdaHigh: 6,   sdeLow: 2.5, sdeHigh: 4   },
  { id: 'healthcare',      labelKey: 'ind_healthcare',    ebitdaLow: 5,   ebitdaHigh: 9,   sdeLow: 3,   sdeHigh: 5   },
  { id: 'professional',    labelKey: 'ind_professional',  ebitdaLow: 4,   ebitdaHigh: 7,   sdeLow: 2.5, sdeHigh: 4.5 },
  { id: 'manufacturing',   labelKey: 'ind_manufacturing', ebitdaLow: 5,   ebitdaHigh: 7,   sdeLow: 3,   sdeHigh: 5   },
  { id: 'construction',    labelKey: 'ind_construction',  ebitdaLow: 3,   ebitdaHigh: 5,   sdeLow: 2,   sdeHigh: 3.5 },
  { id: 'homeservices',    labelKey: 'ind_homeservices',  ebitdaLow: 4,   ebitdaHigh: 6,   sdeLow: 2.5, sdeHigh: 4   },
  { id: 'techservices',    labelKey: 'ind_techservices',  ebitdaLow: 6,   ebitdaHigh: 8,   sdeLow: 3.5, sdeHigh: 5   },
  { id: 'transport',       labelKey: 'ind_transport',     ebitdaLow: 5,   ebitdaHigh: 7,   sdeLow: 3,   sdeHigh: 4.5 },
  { id: 'beauty',          labelKey: 'ind_beauty',        ebitdaLow: 3,   ebitdaHigh: 5,   sdeLow: 2,   sdeHigh: 3.5 },
  { id: 'education',       labelKey: 'ind_education',      ebitdaLow: 4,   ebitdaHigh: 7,   sdeLow: 2.5, sdeHigh: 4   },
  { id: 'agriculture',     labelKey: 'ind_agriculture',   ebitdaLow: 3,   ebitdaHigh: 5,   sdeLow: 2,   sdeHigh: 3.5 },
  { id: 'other',           labelKey: 'ind_other',         ebitdaLow: 3,   ebitdaHigh: 6,   sdeLow: 2,   sdeHigh: 4   },
]

const buildIndustries = (tc: TC) =>
  INDUSTRY_DATA.map(i => ({ ...i, label: tc('cfo_ebitda.' + i.labelKey) }))

/* ================================================================== */
/*  Adjusted EBITDA add-back categories                                */
/* ================================================================== */

interface AddBack { id: string; label: string; description: string; accepted: boolean; amount: number }

const ADD_BACK_DATA: { id: string; labelKey: string; descKey: string; accepted: boolean }[] = [
  // Accepted by buyers/investors
  { id: 'owner_comp',       labelKey: 'ab_owner_comp',      descKey: 'ab_owner_comp_desc',      accepted: true },
  { id: 'owner_perks',      labelKey: 'ab_owner_perks',     descKey: 'ab_owner_perks_desc',     accepted: true },
  { id: 'family_wages',     labelKey: 'ab_family_wages',    descKey: 'ab_family_wages_desc',    accepted: true },
  { id: 'onetime_fees',     labelKey: 'ab_onetime_fees',    descKey: 'ab_onetime_fees_desc',    accepted: true },
  { id: 'rent_adjust',      labelKey: 'ab_rent_adjust',     descKey: 'ab_rent_adjust_desc',     accepted: true },
  { id: 'severance',        labelKey: 'ab_severance',       descKey: 'ab_severance_desc',       accepted: true },
  { id: 'litigation',       labelKey: 'ab_litigation',      descKey: 'ab_litigation_desc',      accepted: true },
  { id: 'writedowns',       labelKey: 'ab_writedowns',      descKey: 'ab_writedowns_desc',      accepted: true },
  { id: 'discontinued',     labelKey: 'ab_discontinued',    descKey: 'ab_discontinued_desc',    accepted: true },
  { id: 'accel_deprec',     labelKey: 'ab_accel_deprec',    descKey: 'ab_accel_deprec_desc',    accepted: true },
  // Rejected by buyers — shown as warnings
  { id: 'recurring_capex',  labelKey: 'ab_recurring_capex', descKey: 'ab_recurring_capex_desc', accepted: false },
  { id: 'marketing',        labelKey: 'ab_marketing',       descKey: 'ab_marketing_desc',       accepted: false },
  { id: 'commissions',      labelKey: 'ab_commissions',     descKey: 'ab_commissions_desc',      accepted: false },
  { id: 'bonuses',          labelKey: 'ab_bonuses',         descKey: 'ab_bonuses_desc',         accepted: false },
]

const buildAddBackTemplates = (tc: TC): Omit<AddBack, 'amount'>[] =>
  ADD_BACK_DATA.map(t => ({ id: t.id, accepted: t.accepted, label: tc('cfo_ebitda.' + t.labelKey), description: tc('cfo_ebitda.' + t.descKey) }))

/* ================================================================== */
/*  Quality score factors                                              */
/* ================================================================== */

interface QualityFactor { id: string; label: string; description: string; score: number }

const QUALITY_FACTOR_DATA: { id: string; labelKey: string; descKey: string }[] = [
  { id: 'recurring',      labelKey: 'qf_recurring',      descKey: 'qf_recurring_desc' },
  { id: 'concentration',  labelKey: 'qf_concentration',  descKey: 'qf_concentration_desc' },
  { id: 'owner_indep',    labelKey: 'qf_owner_indep',    descKey: 'qf_owner_indep_desc' },
  { id: 'growth',         labelKey: 'qf_growth',         descKey: 'qf_growth_desc' },
  { id: 'barriers',       labelKey: 'qf_barriers',       descKey: 'qf_barriers_desc' },
  { id: 'diversified',    labelKey: 'qf_diversified',    descKey: 'qf_diversified_desc' },
]

const buildQualityFactors = (tc: TC): Omit<QualityFactor, 'score'>[] =>
  QUALITY_FACTOR_DATA.map(f => ({ id: f.id, label: tc('cfo_ebitda.' + f.labelKey), description: tc('cfo_ebitda.' + f.descKey) }))

/* ================================================================== */
/*  Formatters                                                         */
/* ================================================================== */

function fmt(n: number, sym: string): string {
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `${n < 0 ? '(' : ''}${sym}${(abs / 1_000_000).toFixed(1)}M${n < 0 ? ')' : ''}`
  if (abs >= 1_000) return `${n < 0 ? '(' : ''}${sym}${(abs / 1_000).toFixed(1)}K${n < 0 ? ')' : ''}`
  return `${n < 0 ? '(' : ''}${sym}${Math.round(abs).toLocaleString()}${n < 0 ? ')' : ''}`
}

function fmtFull(n: number, sym: string): string {
  const abs = Math.abs(n)
  return `${n < 0 ? '(' : ''}${sym}${Math.round(abs).toLocaleString()}${n < 0 ? ')' : ''}`
}

/* ================================================================== */
/*  Auto-estimate I·T·D·A                                              */
/* ================================================================== */

function autoEstimate(
  totals: Props['totals'],
  countryCode?: string | null,
): { interest: number; tax: number; depreciation: number; amortization: number } {
  const { revenue, net_profit, fixed_costs } = totals

  let tax = 0
  try {
    const region = getRegionConfig(countryCode)
    const tc = region.taxConfig
    const annualRevenue = revenue * 12
    if (net_profit > 0) {
      if (tc.turnoverTax) {
        const turnoverApplicable = annualRevenue >= tc.turnoverTax.minRevenue && annualRevenue <= tc.turnoverTax.maxRevenue
        if (turnoverApplicable) {
          tax = Math.round(revenue * tc.turnoverTax.rate)
        } else if (annualRevenue > (tc.turnoverTax.maxRevenue || tc.smbThreshold || 0)) {
          tax = Math.round(net_profit * tc.corporateRate)
        } else {
          tax = Math.round(net_profit * tc.smbRate)
        }
      } else {
        if (annualRevenue > (tc.smbThreshold || 1_500_000)) {
          tax = Math.round(net_profit * tc.corporateRate)
        } else {
          tax = Math.round(net_profit * tc.smbRate)
        }
      }
    }
  } catch {
    tax = net_profit > 0 ? Math.round(net_profit * 0.25) : 0
  }

  const interest = Math.round(revenue * 0.02)
  const depreciation = Math.round(fixed_costs * 0.05)
  const amortization = Math.round(fixed_costs * 0.03)

  return { interest, tax, depreciation, amortization }
}

/* ================================================================== */
/*  localStorage helpers                                               */
/* ================================================================== */

interface Overrides { interest?: number | null; tax?: number | null; depreciation?: number | null; amortization?: number | null }
interface SavedState {
  overrides: Overrides
  multiple: number
  industry: string
  ownerComp: number
  addBacks: Record<string, number>
  qualityScores: Record<string, number>
  metricMode: 'ebitda' | 'sde' | 'both'
}

function loadState(): Partial<SavedState> {
  try {
    const s = localStorage.getItem('cfo_ebitda_state')
    return s ? JSON.parse(s) : {}
  } catch { return {} }
}

function persistState(s: Partial<SavedState>) {
  try {
    const existing = loadState()
    localStorage.setItem('cfo_ebitda_state', JSON.stringify({ ...existing, ...s }))
  } catch {}
}

/* ================================================================== */
/*  Click-to-edit cell                                                 */
/* ================================================================== */

function EditableValue({ value, autoValue, sym, isOverridden, onSave, onReset, add, tc }: {
  value: number; autoValue: number; sym: string; isOverridden: boolean
  onSave: (v: number) => void; onReset: () => void; add?: boolean
  tc: TC
}) {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing && inputRef.current) { inputRef.current.focus(); inputRef.current.select() }
  }, [editing])

  const handleSave = () => {
    const num = Number(inputRef.current?.value)
    if (!isNaN(num) && num >= 0) onSave(num)
    setEditing(false)
  }

  if (editing) {
    return (
      <td style={{ padding: '4px 0', textAlign: 'right' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 9, color: 'var(--tx3)' }}>{sym}</span>
          <input ref={inputRef} type="number" min={0} defaultValue={Math.round(value)}
            onBlur={handleSave}
            onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false) }}
            style={{ width: 90, padding: '4px 6px', borderRadius: 5, border: `1.5px solid ${INDIGO}`, fontSize: 10, fontFamily: 'inherit', fontVariantNumeric: 'tabular-nums', background: 'var(--sf)', color: 'var(--tx)', outline: 'none', textAlign: 'right' }}
          />
        </div>
      </td>
    )
  }

  return (
    <td onClick={() => setEditing(true)}
      title={isOverridden ? tc('cfo_ebitda.editable_auto_tooltip', { value: fmtFull(autoValue, sym) }) : tc('cfo_ebitda.editable_tooltip')}
      onContextMenu={e => { if (isOverridden) { e.preventDefault(); onReset() } }}
      style={{ padding: '6px 0', textAlign: 'right', cursor: 'pointer', fontVariantNumeric: 'tabular-nums', fontSize: 10, color: add && value > 0 ? INDIGO : value < 0 ? RED : 'var(--tx)' }}>
      <span style={{ borderBottom: `1px dashed ${isOverridden ? INDIGO : 'var(--tx3)'}`, paddingBottom: 1 }}>
        {add && value > 0 ? '+' : ''}{fmtFull(value, sym)}
      </span>
      {isOverridden && <span style={{ fontSize: 8, color: INDIGO, marginLeft: 4, verticalAlign: 'super' }}>{tc('cfo_ebitda.edited')}</span>}
    </td>
  )
}

/* ================================================================== */
/*  Inline editable amount (for add-backs, owner comp)                 */
/* ================================================================== */

function InlineAmount({ value, sym, onChange, placeholder, tc }: {
  value: number; sym: string; onChange: (v: number) => void; placeholder?: string
  tc: TC
}) {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing && inputRef.current) { inputRef.current.focus(); inputRef.current.select() }
  }, [editing])

  const save = () => {
    const num = Number(inputRef.current?.value)
    if (!isNaN(num) && num >= 0) onChange(num)
    setEditing(false)
  }

  if (editing) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
        <span style={{ fontSize: 9, color: 'var(--tx3)' }}>{sym}</span>
        <input ref={inputRef} type="number" min={0} defaultValue={value || ''}
          placeholder={placeholder || '0'}
          onBlur={save}
          onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false) }}
          style={{ width: 80, padding: '3px 6px', borderRadius: 5, border: `1.5px solid ${INDIGO}`, fontSize: 9, fontFamily: 'inherit', fontVariantNumeric: 'tabular-nums', background: 'var(--sf)', color: 'var(--tx)', outline: 'none', textAlign: 'right' }}
        />
      </div>
    )
  }

  return (
    <span onClick={() => setEditing(true)}
      style={{ cursor: 'pointer', borderBottom: '1px dashed var(--tx3)', paddingBottom: 1, fontSize: 9, fontVariantNumeric: 'tabular-nums', color: value > 0 ? GREEN : 'var(--tx3)' }}>
      {value > 0 ? `+${fmtFull(value, sym)}` : tc('cfo_ebitda.click_to_set')}
    </span>
  )
}

/* ================================================================== */
/*  Section header                                                     */
/* ================================================================== */

function SectionHeader({ color, label, badge, right }: { color: string; label: string; badge?: string; right?: React.ReactNode }) {
  return (
    <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 3, height: 14, borderRadius: 2, background: color }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx)' }}>{label}</span>
        {badge && (
          <span style={{ fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: 'rgba(99,102,241,.08)', color: INDIGO }}>{badge}</span>
        )}
      </div>
      {right}
    </div>
  )
}

/* ================================================================== */
/*  MAIN COMPONENT                                                     */
/* ================================================================== */

export default function EbitdaValuation({ totals, comparison, pnlMonthly, currencySymbol: sym, countryCode, onAsk }: Props) {
  const { tc } = useLang()
  const INDUSTRIES = buildIndustries(tc)
  const ADD_BACK_TEMPLATES = buildAddBackTemplates(tc)
  const QUALITY_FACTORS = buildQualityFactors(tc)
  const [overrides, setOverrides] = useState<Overrides>({})
  const [multiple, setMultiple] = useState(5)
  const [industry, setIndustry] = useState('other')
  const [ownerComp, setOwnerComp] = useState(0)
  const [addBacks, setAddBacks] = useState<Record<string, number>>({})
  const [qualityScores, setQualityScores] = useState<Record<string, number>>({})
  const [metricMode, setMetricMode] = useState<'ebitda' | 'sde' | 'both'>('both')
  const [showAddBacks, setShowAddBacks] = useState(false)
  const [scenarioDelta, setScenarioDelta] = useState(0)
  const exportRef = useRef<HTMLDivElement>(null)

  // Load saved state
  useEffect(() => {
    const s = loadState()
    if (s.overrides) setOverrides(s.overrides)
    if (s.multiple) setMultiple(s.multiple)
    if (s.industry) setIndustry(s.industry)
    if (s.ownerComp) setOwnerComp(s.ownerComp)
    if (s.addBacks) setAddBacks(s.addBacks)
    if (s.qualityScores) setQualityScores(s.qualityScores)
    if (s.metricMode) setMetricMode(s.metricMode)
  }, [])

  const save = (partial: Partial<SavedState>) => persistState(partial)

  const setOverride = (key: keyof Overrides, val: number) => {
    const updated = { ...overrides, [key]: val }
    setOverrides(updated); save({ overrides: updated })
  }
  const resetOverride = (key: keyof Overrides) => {
    const updated = { ...overrides }; delete updated[key]
    setOverrides(updated); save({ overrides: updated })
  }
  const saveMultiple = (v: number) => { setMultiple(v); save({ multiple: v }) }
  const saveIndustry = (v: string) => {
    setIndustry(v); save({ industry: v })
    const ind = INDUSTRIES.find(i => i.id === v)
    if (ind) { const mid = Math.round((ind.ebitdaLow + ind.ebitdaHigh) / 2 * 2) / 2; setMultiple(mid); save({ industry: v, multiple: mid }) }
  }
  const saveOwnerComp = (v: number) => { setOwnerComp(v); save({ ownerComp: v }) }
  const saveAddBack = (id: string, v: number) => { const u = { ...addBacks, [id]: v }; setAddBacks(u); save({ addBacks: u }) }
  const saveQuality = (id: string, v: number) => { const u = { ...qualityScores, [id]: v }; setQualityScores(u); save({ qualityScores: u }) }
  const saveMetricMode = (v: 'ebitda' | 'sde' | 'both') => { setMetricMode(v); save({ metricMode: v }) }

  // ── Auto-estimate I·T·D·A ──
  const auto = autoEstimate(totals, countryCode)
  const interest = overrides.interest != null ? overrides.interest : auto.interest
  const tax = overrides.tax != null ? overrides.tax : auto.tax
  const depreciation = overrides.depreciation != null ? overrides.depreciation : auto.depreciation
  const amortization = overrides.amortization != null ? overrides.amortization : auto.amortization

  // ── Core EBITDA ──
  const ebitda = totals.net_profit + interest + tax + depreciation + amortization
  const ebitdaMargin = totals.revenue > 0 ? (ebitda / totals.revenue) * 100 : 0

  // ── Adjusted EBITDA ──
  const totalAcceptedAddBacks = ADD_BACK_TEMPLATES.filter(t => t.accepted).reduce((s, t) => s + (addBacks[t.id] || 0), 0)
  const totalRejectedAddBacks = ADD_BACK_TEMPLATES.filter(t => !t.accepted).reduce((s, t) => s + (addBacks[t.id] || 0), 0)
  const adjustedEbitda = ebitda + totalAcceptedAddBacks

  // ── SDE = Adjusted EBITDA + Owner Compensation ──
  const sde = adjustedEbitda + ownerComp

  // ── Which metric to value with ──
  // annualizedValue takes an explicit includeOwnerComp flag to avoid a TDZ:
  // usesSde calls annualizedValue during its own const initialisation, so
  // the function must NOT close over usesSde – it would access it in the
  // Temporal Dead Zone and throw "Cannot access 'usesSde' before init".
  function annualizedValue(periodVal: number, includeOwnerComp = false) {
    if (pnlMonthly && pnlMonthly.length > 0) {
      const months = pnlMonthly.length
      const addBackPerMonth = (interest + tax + depreciation + amortization + totalAcceptedAddBacks + (includeOwnerComp ? ownerComp : 0)) / months
      const total = pnlMonthly.reduce((s, m) => s + m.net + addBackPerMonth, 0)
      return (total / months) * 12
    }
    return periodVal * 12
  }

  // When checking the SDE threshold we're evaluating the SDE value (which already
  // includes ownerComp), so pass includeOwnerComp=true for that call only.
  const usesSde = metricMode === 'sde' || (metricMode === 'both' && sde > 0 && annualizedValue(sde, true) < 5_000_000)
  const primaryMetric = usesSde ? sde : adjustedEbitda > ebitda ? adjustedEbitda : ebitda
  const primaryLabel = usesSde ? tc('cfo_ebitda.label_sde') : adjustedEbitda > ebitda ? tc('cfo_ebitda.label_adj_ebitda') : tc('cfo_ebitda.label_ebitda')

  const annualized = annualizedValue(primaryMetric, usesSde)
  const valuation = primaryMetric * multiple
  const annualizedValuation = annualized * multiple

  // ── Prior period ──
  const priorEbitda = comparison.net_profit + interest + tax + depreciation + amortization
  const ebitdaChange = priorEbitda !== 0 ? ((ebitda - priorEbitda) / Math.abs(priorEbitda)) * 100 : ebitda !== 0 ? null : 0

  // ── Industry data ──
  const ind = INDUSTRIES.find(i => i.id === industry) || INDUSTRIES[INDUSTRIES.length - 1]

  // ── Quality score ──
  const qualityTotal = QUALITY_FACTORS.reduce((s, f) => s + (qualityScores[f.id] || 0), 0)
  const qualityMax = QUALITY_FACTORS.length * 3
  const qualityPct = qualityMax > 0 ? (qualityTotal / qualityMax) * 100 : 0
  const qualityMultiplierBoost = (qualityPct / 100) * (ind.ebitdaHigh - ind.ebitdaLow)
  const suggestedMultiple = Math.round((ind.ebitdaLow + qualityMultiplierBoost) * 2) / 2

  // ── Scenario ──
  const scenarioEbitda = primaryMetric + scenarioDelta
  const scenarioValuation = scenarioEbitda * multiple

  // ── Monthly trend ──
  const monthlyAddBack = (interest + tax + depreciation + amortization) / Math.max(pnlMonthly?.length || 1, 1)
  const monthlyEbitda = pnlMonthly?.map(m => m.net + monthlyAddBack) ?? []

  const hasAnyOverride = overrides.interest != null || overrides.tax != null || overrides.depreciation != null || overrides.amortization != null

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  return (
    <div ref={exportRef} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ============================================================ */}
      {/*  1. EBITDA / SDE SUMMARY CARD                                 */}
      {/* ============================================================ */}
      <div style={CARD}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 3, height: 14, borderRadius: 2, background: INDIGO }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_ebitda.summary_title')}</span>
            {ebitda > 0 && (
              <span style={{ fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                background: ebitdaMargin >= 20 ? 'rgba(34,197,94,.1)' : ebitdaMargin >= 10 ? 'rgba(245,158,11,.1)' : 'rgba(239,68,68,.1)',
                color: ebitdaMargin >= 20 ? GREEN : ebitdaMargin >= 10 ? AMBER : RED }}>
                {tc('cfo_ebitda.margin_badge', { n: ebitdaMargin.toFixed(1) })}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* Metric mode toggle */}
            <div style={{ display: 'flex', borderRadius: 6, overflow: 'hidden', border: '1px solid var(--b)' }}>
              {(['ebitda', 'sde', 'both'] as const).map(m => (
                <button key={m} onClick={() => saveMetricMode(m)}
                  style={{ padding: '3px 8px', fontSize: 9, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                    background: metricMode === m ? INDIGO : 'var(--sf)', color: metricMode === m ? '#fff' : 'var(--tx3)',
                    textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {m === 'both' ? tc('cfo_ebitda.mode_both') : m}
                </button>
              ))}
            </div>
            {hasAnyOverride && (
              <button onClick={() => { setOverrides({}); save({ overrides: {} }) }}
                style={{ fontSize: 9, color: 'var(--tx3)', background: 'rgba(0,0,0,.04)', border: 'none', borderRadius: 5, padding: '3px 8px', cursor: 'pointer', fontWeight: 500, fontFamily: 'inherit' }}>
                {tc('cfo_ebitda.reset')}
              </button>
            )}
            <button onClick={() => onAsk(tc('cfo_ebitda.ask_ai_prompt', { ebitda: fmt(ebitda, sym), margin: ebitdaMargin.toFixed(1), adjusted: fmt(adjustedEbitda, sym), sde: fmt(sde, sym), revenue: fmt(totals.revenue, sym), industry: ind.label, quality: Math.round(qualityPct), multiple, valuation: fmt(valuation, sym) }))}
              style={{ fontSize: 9, color: INDIGO, background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}>
              {tc('cfo_ebitda.ask_ai')}
            </button>
          </div>
        </div>

        {/* KPI Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: metricMode === 'both' ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)', gap: 1, background: 'var(--b)' }}>
          <div style={{ padding: '14px 12px', background: 'var(--sf)', textAlign: 'center' }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx2)', marginBottom: 4 }}>{tc('cfo_ebitda.kpi_ebitda')}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: ebitda >= 0 ? GREEN : RED, fontVariantNumeric: 'tabular-nums' }}>{fmt(ebitda, sym)}</div>
            {ebitdaChange != null && (
              <div style={{ fontSize: 9, fontWeight: 600, color: ebitdaChange > 0 ? GREEN : ebitdaChange < 0 ? RED : 'var(--tx3)', marginTop: 2 }}>
                {ebitdaChange > 0 ? '▲' : ebitdaChange < 0 ? '▼' : '–'} {Math.abs(ebitdaChange).toFixed(1)}%
              </div>
            )}
          </div>
          {(metricMode === 'sde' || metricMode === 'both') && (
            <div style={{ padding: '14px 12px', background: 'var(--sf)', textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx2)', marginBottom: 4 }}>{tc('cfo_ebitda.kpi_sde')}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: sde >= 0 ? CYAN : RED, fontVariantNumeric: 'tabular-nums' }}>{fmt(sde, sym)}</div>
              <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 2 }}>{tc('cfo_ebitda.kpi_sde_sub')}</div>
            </div>
          )}
          <div style={{ padding: '14px 12px', background: 'var(--sf)', textAlign: 'center' }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx2)', marginBottom: 4 }}>{tc('cfo_ebitda.kpi_margin')}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: ebitdaMargin >= 20 ? GREEN : ebitdaMargin >= 10 ? AMBER : RED, fontVariantNumeric: 'tabular-nums' }}>{ebitdaMargin.toFixed(1)}%</div>
            <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 2 }}>{ebitdaMargin >= 20 ? tc('cfo_ebitda.margin_healthy') : ebitdaMargin >= 10 ? tc('cfo_ebitda.margin_moderate') : tc('cfo_ebitda.margin_needs_attention')}</div>
          </div>
          <div style={{ padding: '14px 12px', background: 'var(--sf)', textAlign: 'center' }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx2)', marginBottom: 4 }}>{tc('cfo_ebitda.kpi_valuation', { n: multiple })}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: INDIGO, fontVariantNumeric: 'tabular-nums' }}>{fmt(valuation, sym)}</div>
            <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 2 }}>{tc('cfo_ebitda.valuation_sub', { label: primaryLabel, n: multiple })}</div>
          </div>
        </div>

        {/* EBITDA Breakdown */}
        <div style={{ padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx2)' }}>{tc('cfo_ebitda.breakdown_title')}</div>
            <div style={{ fontSize: 9, color: 'var(--tx3)', fontStyle: 'italic' }}>{tc('cfo_ebitda.breakdown_hint')}</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10 }}>
            <tbody>
              <tr>
                <td style={{ padding: '6px 0', fontWeight: 700, color: 'var(--tx)', fontSize: 10 }}>{tc('cfo_ebitda.row_net_profit')}</td>
                <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 700, color: totals.net_profit >= 0 ? 'var(--tx)' : RED, fontVariantNumeric: 'tabular-nums', fontSize: 10 }}>{fmtFull(totals.net_profit, sym)}</td>
              </tr>
              {([['interest', tc('cfo_ebitda.row_interest'), interest, auto.interest] as const,
                ['tax', tc('cfo_ebitda.row_taxes'), tax, auto.tax] as const,
                ['depreciation', tc('cfo_ebitda.row_depreciation'), depreciation, auto.depreciation] as const,
                ['amortization', tc('cfo_ebitda.row_amortization'), amortization, auto.amortization] as const,
              ]).map(([key, label, val, autoVal]) => (
                <tr key={key}>
                  <td style={{ padding: '6px 0', color: INDIGO, fontSize: 10 }}>
                    {label}
                    {overrides[key] == null && <span style={{ fontSize: 8, color: 'var(--tx3)', marginLeft: 4 }}>{tc('cfo_ebitda.est')}</span>}
                  </td>
                  <EditableValue value={val} autoValue={autoVal} sym={sym} isOverridden={overrides[key] != null}
                    onSave={v => setOverride(key, v)} onReset={() => resetOverride(key)} add tc={tc} />
                </tr>
              ))}
              <tr style={{ borderTop: '2px solid var(--b)' }}>
                <td style={{ padding: '8px 0', fontWeight: 700, fontSize: 11, color: 'var(--tx)' }}>{tc('cfo_ebitda.row_ebitda_total')}</td>
                <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700, fontSize: 11, color: ebitda >= 0 ? GREEN : RED, fontVariantNumeric: 'tabular-nums' }}>{fmtFull(ebitda, sym)}</td>
              </tr>
            </tbody>
          </table>
          <div style={{ marginTop: 8, padding: '6px 10px', borderRadius: 6, background: 'rgba(99,102,241,.04)', fontSize: 9, color: 'var(--tx3)', lineHeight: 1.5 }}>
            {tc('cfo_ebitda.breakdown_note_prefix')} <span style={{ fontSize: 8, background: 'var(--sf)', padding: '1px 4px', borderRadius: 3, border: '1px solid var(--b)' }}>{tc('cfo_ebitda.est')}</span> {tc('cfo_ebitda.breakdown_note_suffix')}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  3. ADJUSTED EBITDA + ADD-BACKS                               */}
      {/* ============================================================ */}
      <div style={CARD}>
        <SectionHeader color={GREEN} label={tc('cfo_ebitda.adjusted_ebitda')}
          badge={totalAcceptedAddBacks > 0 ? tc('cfo_ebitda.addbacks_badge', { n: fmt(totalAcceptedAddBacks, sym) }) : undefined}
          right={
            <button onClick={() => setShowAddBacks(v => !v)}
              style={{ fontSize: 9, color: INDIGO, background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}>
              {showAddBacks ? tc('cfo_ebitda.collapse_addbacks') : tc('cfo_ebitda.expand_addbacks')}
            </button>
          }
        />
        <div style={{ padding: '16px 18px' }}>
          {/* Summary row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
            <div style={{ padding: 10, borderRadius: 8, border: '1px solid var(--b)', textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: 3 }}>{tc('cfo_ebitda.summary_ebitda')}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: ebitda >= 0 ? GREEN : RED, fontVariantNumeric: 'tabular-nums' }}>{fmt(ebitda, sym)}</div>
            </div>
            <div style={{ padding: 10, borderRadius: 8, border: '1px solid var(--b)', textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: 3 }}>{tc('cfo_ebitda.summary_addbacks')}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: totalAcceptedAddBacks > 0 ? GREEN : 'var(--tx3)', fontVariantNumeric: 'tabular-nums' }}>{fmt(totalAcceptedAddBacks, sym)}</div>
            </div>
            <div style={{ padding: 10, borderRadius: 8, border: `1px solid ${GREEN}`, background: 'rgba(34,197,94,.04)', textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontWeight: 600, color: GREEN, textTransform: 'uppercase', marginBottom: 3 }}>{tc('cfo_ebitda.summary_adj_ebitda')}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: GREEN, fontVariantNumeric: 'tabular-nums' }}>{fmt(adjustedEbitda, sym)}</div>
            </div>
          </div>

          {showAddBacks && (
            <>
              {/* Accepted add-backs */}
              <div style={{ fontSize: 9, fontWeight: 600, color: GREEN, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                {tc('cfo_ebitda.accepted_addbacks_heading')}
              </div>
              {ADD_BACK_TEMPLATES.filter(t => t.accepted).map(t => (
                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--b)' }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--tx)' }}>{t.label}</div>
                    <div style={{ fontSize: 9, color: 'var(--tx3)' }}>{t.description}</div>
                  </div>
                  <InlineAmount value={addBacks[t.id] || 0} sym={sym} onChange={v => saveAddBack(t.id, v)} tc={tc} />
                </div>
              ))}

              {/* Rejected add-backs */}
              <div style={{ fontSize: 9, fontWeight: 600, color: RED, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 16, marginBottom: 8 }}>
                {tc('cfo_ebitda.rejected_addbacks_heading')}
              </div>
              {ADD_BACK_TEMPLATES.filter(t => !t.accepted).map(t => (
                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--b)', opacity: 0.7 }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--tx)' }}>{t.label}</div>
                    <div style={{ fontSize: 9, color: RED }}>{t.description}</div>
                  </div>
                  <InlineAmount value={addBacks[t.id] || 0} sym={sym} onChange={v => saveAddBack(t.id, v)} tc={tc} />
                </div>
              ))}
              {totalRejectedAddBacks > 0 && (
                <div style={{ marginTop: 8, padding: '6px 10px', borderRadius: 6, background: 'rgba(239,68,68,.06)', fontSize: 9, color: RED, lineHeight: 1.5 }}>
                  {tc('cfo_ebitda.rejected_warning', { n: fmt(totalRejectedAddBacks, sym) })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/*  4. SDE (Seller's Discretionary Earnings)                     */}
      {/* ============================================================ */}
      {(metricMode === 'sde' || metricMode === 'both') && (
        <div style={CARD}>
          <SectionHeader color={CYAN} label={tc('cfo_ebitda.sde_section_title')}
            badge={sde > 0 ? fmt(sde, sym) : undefined}
          />
          <div style={{ padding: '16px 18px' }}>
            <div style={{ fontSize: 9, color: 'var(--tx3)', marginBottom: 12, lineHeight: 1.6 }}>
              {tc('cfo_ebitda.sde_intro', { sym })}
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10 }}>
              <tbody>
                <tr>
                  <td style={{ padding: '6px 0', fontWeight: 600 }}>{tc('cfo_ebitda.sde_row_adj_ebitda')}</td>
                  <td style={{ padding: '6px 0', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{fmtFull(adjustedEbitda, sym)}</td>
                </tr>
                <tr>
                  <td style={{ padding: '6px 0', color: CYAN }}>{tc('cfo_ebitda.sde_row_owner_comp')}</td>
                  <td style={{ padding: '6px 0', textAlign: 'right' }}>
                    <InlineAmount value={ownerComp} sym={sym} onChange={saveOwnerComp} placeholder={tc('cfo_ebitda.sde_owner_comp_placeholder')} tc={tc} />
                  </td>
                </tr>
                <tr style={{ borderTop: '2px solid var(--b)' }}>
                  <td style={{ padding: '8px 0', fontWeight: 700, fontSize: 11 }}>{tc('cfo_ebitda.sde_row_total')}</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700, fontSize: 11, color: sde >= 0 ? CYAN : RED, fontVariantNumeric: 'tabular-nums' }}>{fmtFull(sde, sym)}</td>
                </tr>
              </tbody>
            </table>
            <div style={{ marginTop: 10, padding: '6px 10px', borderRadius: 6, background: 'rgba(6,182,212,.05)', fontSize: 9, color: 'var(--tx3)', lineHeight: 1.5 }}>
              {tc('cfo_ebitda.sde_note')}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  5. INDUSTRY MULTIPLES                                        */}
      {/* ============================================================ */}
      <div style={CARD}>
        <SectionHeader color={AMBER} label={tc('cfo_ebitda.industry_section_title')} badge={tc('cfo_ebitda.industry_range_badge', { low: ind.ebitdaLow, high: ind.ebitdaHigh })} />
        <div style={{ padding: '16px 18px' }}>
          {/* Industry selector */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', marginBottom: 6 }}>{tc('cfo_ebitda.your_industry')}</div>
            <select value={industry} onChange={e => saveIndustry(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--b)', fontSize: 10, fontFamily: 'inherit', background: 'var(--sf)', color: 'var(--tx)', cursor: 'pointer', outline: 'none' }}>
              {INDUSTRIES.map(i => <option key={i.id} value={i.id}>{i.label}</option>)}
            </select>
          </div>

          {/* Multiple range visual */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx)' }}>{tc('cfo_ebitda.ebitda_multiple')}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: INDIGO, fontVariantNumeric: 'tabular-nums' }}>{multiple}x</div>
            </div>
            <input type="range" min={1} max={15} step={0.5} value={multiple} onChange={e => saveMultiple(Number(e.target.value))}
              style={{ width: '100%', accentColor: INDIGO, cursor: 'pointer' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--tx3)', marginTop: 2 }}>
              <span>1x</span>
              <span style={{ fontSize: 9, color: INDIGO, fontWeight: 500 }}>
                {tc('cfo_ebitda.industry_range_inline', { label: ind.label, low: ind.ebitdaLow, high: ind.ebitdaHigh })}
              </span>
              <span>15x</span>
            </div>
            {/* Range indicator */}
            <div style={{ position: 'relative', height: 6, background: 'var(--ev, #f3f2ef)', borderRadius: 3, marginTop: 6 }}>
              <div style={{
                position: 'absolute', height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${AMBER}, ${GREEN})`,
                left: `${(ind.ebitdaLow / 15) * 100}%`, width: `${((ind.ebitdaHigh - ind.ebitdaLow) / 15) * 100}%`, opacity: 0.5,
              }} />
              <div style={{
                position: 'absolute', width: 8, height: 8, borderRadius: '50%', background: INDIGO, top: -1,
                left: `calc(${(multiple / 15) * 100}% - 4px)`, border: '2px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,.2)',
              }} />
            </div>
            {multiple < ind.ebitdaLow && <div style={{ fontSize: 9, color: RED, marginTop: 4 }}>{tc('cfo_ebitda.below_industry_range')}</div>}
            {multiple > ind.ebitdaHigh && <div style={{ fontSize: 9, color: GREEN, marginTop: 4 }}>{tc('cfo_ebitda.above_industry_range')}</div>}
          </div>

          {/* Valuation Results */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ padding: 14, borderRadius: 10, border: '1px solid var(--b)', background: 'var(--sf)', textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: 4 }}>{tc('cfo_ebitda.period_valuation')}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: INDIGO, fontVariantNumeric: 'tabular-nums' }}>{fmt(valuation, sym)}</div>
              <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 2 }}>{tc('cfo_ebitda.valuation_sub', { label: primaryLabel, n: multiple })}</div>
            </div>
            <div style={{ padding: 14, borderRadius: 10, border: '1px solid var(--b)', background: 'var(--sf)', textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: 4 }}>{tc('cfo_ebitda.annualized')}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: INDIGO, fontVariantNumeric: 'tabular-nums' }}>{fmt(annualizedValuation, sym)}</div>
              <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 2 }}>{tc('cfo_ebitda.annualized_sub', { value: fmt(annualized, sym), n: multiple })}</div>
            </div>
          </div>

          {/* Quick multiples comparison */}
          <div style={{ marginTop: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, background: 'var(--b)', borderRadius: 8, overflow: 'hidden' }}>
              {[ind.ebitdaLow, Math.round((ind.ebitdaLow + ind.ebitdaHigh) / 2), ind.ebitdaHigh, 10, 12].map(m => (
                <div key={m} onClick={() => saveMultiple(m)}
                  style={{ padding: '8px 4px', background: m === multiple ? 'rgba(99,102,241,.08)' : 'var(--sf)', textAlign: 'center', cursor: 'pointer' }}>
                  <div style={{ fontSize: 9, fontWeight: 600, color: m === multiple ? INDIGO : 'var(--tx3)' }}>{m}x</div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: m === multiple ? INDIGO : 'var(--tx)', fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>{fmt(annualized * m, sym)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  6. QUALITY SCORE                                             */}
      {/* ============================================================ */}
      <div style={CARD}>
        <SectionHeader color={CYAN} label={tc('cfo_ebitda.quality_section_title')}
          badge={tc('cfo_ebitda.quality_badge', { pct: Math.round(qualityPct), multiple: suggestedMultiple })}
        />
        <div style={{ padding: '16px 18px' }}>
          <div style={{ fontSize: 9, color: 'var(--tx3)', marginBottom: 14, lineHeight: 1.5 }}>
            {tc('cfo_ebitda.quality_intro', { low: ind.ebitdaLow, high: ind.ebitdaHigh })}
          </div>

          {QUALITY_FACTORS.map(f => {
            const score = qualityScores[f.id] || 0
            return (
              <div key={f.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--b)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--tx)' }}>{f.label}</div>
                  <div style={{ fontSize: 9, color: 'var(--tx3)' }}>{f.description}</div>
                </div>
                <div style={{ display: 'flex', gap: 4, marginLeft: 12 }}>
                  {[0, 1, 2, 3].map(s => (
                    <button key={s} onClick={() => saveQuality(f.id, s)}
                      style={{
                        width: 28, height: 28, borderRadius: 6, border: `1px solid ${score === s ? INDIGO : 'var(--b)'}`,
                        background: score === s ? INDIGO : score >= s ? 'rgba(99,102,241,.1)' : 'var(--sf)',
                        color: score === s ? '#fff' : 'var(--tx3)', fontSize: 9, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                      }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}

          {/* Score summary */}
          <div style={{ marginTop: 14, padding: 12, borderRadius: 10, background: 'rgba(6,182,212,.05)', border: '1px solid rgba(6,182,212,.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx)' }}>{tc('cfo_ebitda.quality_score_label', { n: Math.round(qualityPct) })}</div>
                <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 2 }}>
                  {tc('cfo_ebitda.suggested_multiple')} <strong style={{ color: INDIGO }}>{suggestedMultiple}x</strong> {tc('cfo_ebitda.suggested_multiple_range', { label: ind.label })}
                </div>
              </div>
              <button onClick={() => saveMultiple(suggestedMultiple)}
                style={{ fontSize: 9, color: INDIGO, background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}>
                {tc('cfo_ebitda.apply_multiple', { n: suggestedMultiple })}
              </button>
            </div>
            {/* Visual bar */}
            <div style={{ position: 'relative', height: 8, background: 'var(--ev, #f3f2ef)', borderRadius: 4, marginTop: 10 }}>
              <div style={{ width: `${qualityPct}%`, height: '100%', borderRadius: 4, background: `linear-gradient(90deg, ${RED}, ${AMBER}, ${GREEN})`, transition: 'width 300ms' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--tx3)', marginTop: 4 }}>
              <span>{tc('cfo_ebitda.quality_weak')}</span><span>{tc('cfo_ebitda.quality_average')}</span><span>{tc('cfo_ebitda.quality_strong')}</span><span>{tc('cfo_ebitda.quality_premium')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  7. SCENARIO MODELLER                                         */}
      {/* ============================================================ */}
      <div style={CARD}>
        <SectionHeader color={INDIGO} label={tc('cfo_ebitda.scenario_section_title')} badge={tc('cfo_ebitda.scenario_badge')} />
        <div style={{ padding: '16px 18px' }}>
          <div style={{ fontSize: 9, color: 'var(--tx3)', marginBottom: 12, lineHeight: 1.5 }}>
            {tc('cfo_ebitda.scenario_intro', { label: primaryLabel })}
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx)' }}>{tc('cfo_ebitda.scenario_change', { label: primaryLabel })}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: scenarioDelta >= 0 ? GREEN : RED, fontVariantNumeric: 'tabular-nums' }}>
                {scenarioDelta >= 0 ? '+' : ''}{fmtFull(scenarioDelta, sym)}
              </div>
            </div>
            <input type="range"
              min={-Math.max(primaryMetric, 10000)} max={Math.max(primaryMetric * 2, 10000)}
              step={Math.max(Math.round(primaryMetric / 20), 100)}
              value={scenarioDelta}
              onChange={e => setScenarioDelta(Number(e.target.value))}
              style={{ width: '100%', accentColor: INDIGO, cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--tx3)', marginTop: 2 }}>
              <span>{tc('cfo_ebitda.scenario_decrease')}</span><span>{tc('cfo_ebitda.scenario_no_change')}</span><span>{tc('cfo_ebitda.scenario_increase')}</span>
            </div>
          </div>

          {/* Scenario results */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 10, alignItems: 'center' }}>
            <div style={{ padding: 12, borderRadius: 10, border: '1px solid var(--b)', textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: 3 }}>{tc('cfo_ebitda.scenario_current')}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', fontVariantNumeric: 'tabular-nums' }}>{fmt(primaryMetric, sym)}</div>
              <div style={{ fontSize: 9, color: 'var(--tx3)' }}>{tc('cfo_ebitda.scenario_val', { value: fmt(primaryMetric * multiple, sym) })}</div>
            </div>
            <div style={{ fontSize: 16, color: 'var(--tx3)' }}>→</div>
            <div style={{ padding: 12, borderRadius: 10, border: `1px solid ${scenarioDelta >= 0 ? GREEN : RED}`, background: scenarioDelta >= 0 ? 'rgba(34,197,94,.04)' : 'rgba(239,68,68,.04)', textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontWeight: 600, color: scenarioDelta >= 0 ? GREEN : RED, textTransform: 'uppercase', marginBottom: 3 }}>{tc('cfo_ebitda.scenario_scenario')}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: scenarioDelta >= 0 ? GREEN : RED, fontVariantNumeric: 'tabular-nums' }}>{fmt(scenarioEbitda, sym)}</div>
              <div style={{ fontSize: 9, color: 'var(--tx3)' }}>{tc('cfo_ebitda.scenario_val', { value: fmt(scenarioValuation, sym) })}</div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 8, fontSize: 9, fontWeight: 600, color: scenarioDelta >= 0 ? GREEN : RED }}>
            {scenarioDelta >= 0 ? tc('cfo_ebitda.scenario_result_increase', { value: fmt(Math.abs(scenarioValuation - primaryMetric * multiple), sym) }) : tc('cfo_ebitda.scenario_result_decrease', { value: fmt(Math.abs(scenarioValuation - primaryMetric * multiple), sym) })}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  8. EXPORT / INVESTOR SUMMARY                                 */}
      {/* ============================================================ */}
      <div style={CARD}>
        <SectionHeader color={INDIGO} label={tc('cfo_ebitda.summary_section_title')}
          right={
            <button onClick={async () => {
              if (!exportRef.current) return
              try {
                const html2canvas = (await import('html2canvas')).default
                const canvas = await html2canvas(exportRef.current, { backgroundColor: null, scale: 2, useCORS: true })
                const link = document.createElement('a')
                link.href = canvas.toDataURL('image/png')
                link.download = `ebitda-valuation-${new Date().toISOString().split('T')[0]}.png`
                link.click()
              } catch {}
            }}
              style={{ fontSize: 9, color: INDIGO, background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              {tc('cfo_ebitda.export_png')}
            </button>
          }
        />
        <div style={{ padding: '16px 18px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10 }}>
            <tbody>
              {([
                [tc('cfo_ebitda.row_revenue'), fmt(totals.revenue, sym)],
                [tc('cfo_ebitda.row_gross_profit'), fmt(totals.gross_profit, sym)],
                [tc('cfo_ebitda.row_net_profit'), fmt(totals.net_profit, sym)],
                [tc('cfo_ebitda.row_ebitda'), fmt(ebitda, sym)],
                [tc('cfo_ebitda.row_ebitda_margin'), `${ebitdaMargin.toFixed(1)}%`],
                ...(totalAcceptedAddBacks > 0 ? [[tc('cfo_ebitda.adjusted_ebitda'), fmt(adjustedEbitda, sym)]] : []),
                ...(metricMode !== 'ebitda' && ownerComp > 0 ? [[tc('cfo_ebitda.row_sde'), fmt(sde, sym)]] : []),
                [tc('cfo_ebitda.row_industry'), ind.label],
                [tc('cfo_ebitda.row_industry_multiple_range'), `${ind.ebitdaLow}x – ${ind.ebitdaHigh}x`],
                [tc('cfo_ebitda.row_applied_multiple'), `${multiple}x`],
                [tc('cfo_ebitda.row_quality_score'), `${Math.round(qualityPct)}%`],
                [tc('cfo_ebitda.row_period_valuation'), fmt(valuation, sym)],
                [tc('cfo_ebitda.row_annualized_valuation'), fmt(annualizedValuation, sym)],
              ] as [string, string][]).map(([label, value], i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--b)' }}>
                  <td style={{ padding: '7px 0', color: 'var(--tx3)', fontSize: 9 }}>{label}</td>
                  <td style={{ padding: '7px 0', textAlign: 'right', fontWeight: 600, color: 'var(--tx)', fontVariantNumeric: 'tabular-nums' }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 8, background: 'rgba(245,158,11,.06)', border: '1px solid rgba(245,158,11,.15)', fontSize: 9, color: 'var(--tx3)', lineHeight: 1.6 }}>
            <strong style={{ color: AMBER }}>{tc('cfo_ebitda.disclaimer_label')}</strong> {tc('cfo_ebitda.disclaimer_body')}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  Monthly EBITDA Trend                                         */}
      {/* ============================================================ */}
      {monthlyEbitda.length > 1 && (
        <div style={CARD}>
          <SectionHeader color={GREEN} label={tc('cfo_ebitda.monthly_trend_title')} />
          <div style={{ padding: '16px 18px' }}>
            <EbitdaBarChart data={monthlyEbitda} months={pnlMonthly!.map(m => m.month)} sym={sym} />
          </div>
        </div>
      )}
    </div>
  )
}


/* ================================================================== */
/*  Bar chart                                                          */
/* ================================================================== */

function EbitdaBarChart({ data, months }: { data: number[]; months: string[]; sym: string }) {
  const max = Math.max(...data.map(Math.abs), 1)
  const barAreaH = 80
  const hasNeg = data.some(v => v < 0)
  const zeroY = hasNeg ? barAreaH * 0.6 : barAreaH

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: barAreaH + 20 }}>
      {data.map((val, i) => {
        const h = (Math.abs(val) / max) * (hasNeg ? barAreaH * 0.55 : barAreaH * 0.9)
        const isPositive = val >= 0
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', height: '100%' }}>
            <div style={{
              position: 'absolute',
              bottom: isPositive ? (barAreaH - zeroY + 20) : undefined,
              top: !isPositive ? (zeroY + 2) : undefined,
              width: '80%', height: Math.max(h, 2), borderRadius: 3,
              background: isPositive ? GREEN : RED, opacity: 0.8, transition: 'height 300ms ease',
            }} />
            <div style={{ position: 'absolute', bottom: 0, fontSize: 8, color: 'var(--tx3)', whiteSpace: 'nowrap' }}>{months[i]}</div>
          </div>
        )
      })}
    </div>
  )
}
