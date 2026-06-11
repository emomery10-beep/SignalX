'use client'

import { useState, useEffect, useRef } from 'react'
import { getRegionConfig } from '@/lib/region-config'

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

const INDUSTRIES = [
  { id: 'ecommerce',       label: 'E-commerce / DTC',             ebitdaLow: 3,   ebitdaHigh: 5,   sdeLow: 2,   sdeHigh: 4   },
  { id: 'retail',          label: 'Retail / Shop',                 ebitdaLow: 3,   ebitdaHigh: 5,   sdeLow: 2,   sdeHigh: 3.5 },
  { id: 'saas',            label: 'SaaS / Software',               ebitdaLow: 8,   ebitdaHigh: 15,  sdeLow: 4,   sdeHigh: 8   },
  { id: 'food',            label: 'Food & Beverage',               ebitdaLow: 4,   ebitdaHigh: 6,   sdeLow: 2.5, sdeHigh: 4   },
  { id: 'healthcare',      label: 'Healthcare Services',           ebitdaLow: 5,   ebitdaHigh: 9,   sdeLow: 3,   sdeHigh: 5   },
  { id: 'professional',    label: 'Professional Services',         ebitdaLow: 4,   ebitdaHigh: 7,   sdeLow: 2.5, sdeHigh: 4.5 },
  { id: 'manufacturing',   label: 'Manufacturing',                 ebitdaLow: 5,   ebitdaHigh: 7,   sdeLow: 3,   sdeHigh: 5   },
  { id: 'construction',    label: 'Construction / Trades',         ebitdaLow: 3,   ebitdaHigh: 5,   sdeLow: 2,   sdeHigh: 3.5 },
  { id: 'homeservices',    label: 'Home Services (HVAC, Plumbing)', ebitdaLow: 4,  ebitdaHigh: 6,   sdeLow: 2.5, sdeHigh: 4   },
  { id: 'techservices',    label: 'Technology Services / MSP',     ebitdaLow: 6,   ebitdaHigh: 8,   sdeLow: 3.5, sdeHigh: 5   },
  { id: 'transport',       label: 'Transport & Logistics',         ebitdaLow: 5,   ebitdaHigh: 7,   sdeLow: 3,   sdeHigh: 4.5 },
  { id: 'beauty',          label: 'Beauty & Personal Care',        ebitdaLow: 3,   ebitdaHigh: 5,   sdeLow: 2,   sdeHigh: 3.5 },
  { id: 'education',       label: 'Education & Training',          ebitdaLow: 4,   ebitdaHigh: 7,   sdeLow: 2.5, sdeHigh: 4   },
  { id: 'agriculture',     label: 'Agriculture / Agribusiness',    ebitdaLow: 3,   ebitdaHigh: 5,   sdeLow: 2,   sdeHigh: 3.5 },
  { id: 'other',           label: 'Other / General',               ebitdaLow: 3,   ebitdaHigh: 6,   sdeLow: 2,   sdeHigh: 4   },
]

/* ================================================================== */
/*  Adjusted EBITDA add-back categories                                */
/* ================================================================== */

interface AddBack { id: string; label: string; description: string; accepted: boolean; amount: number }

const ADD_BACK_TEMPLATES: Omit<AddBack, 'amount'>[] = [
  // Accepted by buyers/investors
  { id: 'owner_comp',       label: 'Excess Owner Compensation',    description: 'Your salary above market-rate replacement cost',   accepted: true },
  { id: 'owner_perks',      label: 'Owner Perks',                  description: 'Personal car, phone, travel charged to business', accepted: true },
  { id: 'family_wages',     label: 'Above-Market Family Wages',    description: 'Family members paid above market rate',           accepted: true },
  { id: 'onetime_fees',     label: 'One-Time Professional Fees',   description: 'Legal, consulting, audit costs not recurring',    accepted: true },
  { id: 'rent_adjust',      label: 'Above-Market Related Rent',    description: 'Rent paid to yourself above market rate',         accepted: true },
  { id: 'severance',        label: 'Severance / One-Time HR',      description: 'Redundancy payments, restructuring costs',        accepted: true },
  { id: 'litigation',       label: 'Litigation / Settlements',     description: 'One-time legal settlements or judgements',        accepted: true },
  { id: 'writedowns',       label: 'Asset Write-Downs',            description: 'One-time inventory or asset impairments',         accepted: true },
  { id: 'discontinued',     label: 'Discontinued Operations',      description: 'Costs from a product line you shut down',        accepted: true },
  { id: 'accel_deprec',     label: 'Accelerated Depreciation',     description: 'Tax depreciation exceeding actual wear',         accepted: true },
  // Rejected by buyers — shown as warnings
  { id: 'recurring_capex',  label: 'Recurring Capex',              description: 'Ongoing capital expenditure — buyers reject this', accepted: false },
  { id: 'marketing',        label: 'Marketing / CAC',              description: 'Regular marketing spend — buyers reject this',    accepted: false },
  { id: 'commissions',      label: 'Sales Commissions',            description: 'Ongoing sales costs — buyers reject this',        accepted: false },
  { id: 'bonuses',          label: 'Employee Bonuses',             description: 'Regular bonus structure — buyers reject this',    accepted: false },
]

/* ================================================================== */
/*  Quality score factors                                              */
/* ================================================================== */

interface QualityFactor { id: string; label: string; description: string; score: number }

const QUALITY_FACTORS: Omit<QualityFactor, 'score'>[] = [
  { id: 'recurring',      label: 'Recurring Revenue',       description: 'Subscriptions, contracts, repeat customers' },
  { id: 'concentration',  label: 'Low Customer Concentration', description: 'No single customer > 15% of revenue' },
  { id: 'owner_indep',    label: 'Owner Independence',      description: 'Business runs without you day-to-day' },
  { id: 'growth',         label: 'Above-Market Growth',     description: 'Growing faster than your industry average' },
  { id: 'barriers',       label: 'Barriers to Entry',       description: 'Proprietary tech, licenses, brand moat' },
  { id: 'diversified',    label: 'Diversified Revenue',     description: 'Multiple products, channels, or markets' },
]

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

function EditableValue({ value, autoValue, sym, isOverridden, onSave, onReset, add }: {
  value: number; autoValue: number; sym: string; isOverridden: boolean
  onSave: (v: number) => void; onReset: () => void; add?: boolean
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
          <span style={{ fontSize: 11, color: 'var(--tx3)' }}>{sym}</span>
          <input ref={inputRef} type="number" min={0} defaultValue={Math.round(value)}
            onBlur={handleSave}
            onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false) }}
            style={{ width: 90, padding: '4px 6px', borderRadius: 5, border: `1.5px solid ${INDIGO}`, fontSize: 12, fontFamily: 'inherit', fontVariantNumeric: 'tabular-nums', background: 'var(--sf)', color: 'var(--tx)', outline: 'none', textAlign: 'right' }}
          />
        </div>
      </td>
    )
  }

  return (
    <td onClick={() => setEditing(true)}
      title={isOverridden ? `Auto: ${fmtFull(autoValue, sym)} · Click to edit · Right-click to reset` : 'Click to edit'}
      onContextMenu={e => { if (isOverridden) { e.preventDefault(); onReset() } }}
      style={{ padding: '6px 0', textAlign: 'right', cursor: 'pointer', fontVariantNumeric: 'tabular-nums', fontSize: 12, color: add && value > 0 ? INDIGO : value < 0 ? RED : 'var(--tx)' }}>
      <span style={{ borderBottom: `1px dashed ${isOverridden ? INDIGO : 'var(--tx3)'}`, paddingBottom: 1 }}>
        {add && value > 0 ? '+' : ''}{fmtFull(value, sym)}
      </span>
      {isOverridden && <span style={{ fontSize: 8, color: INDIGO, marginLeft: 4, verticalAlign: 'super' }}>edited</span>}
    </td>
  )
}

/* ================================================================== */
/*  Inline editable amount (for add-backs, owner comp)                 */
/* ================================================================== */

function InlineAmount({ value, sym, onChange, placeholder }: {
  value: number; sym: string; onChange: (v: number) => void; placeholder?: string
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
        <span style={{ fontSize: 11, color: 'var(--tx3)' }}>{sym}</span>
        <input ref={inputRef} type="number" min={0} defaultValue={value || ''}
          placeholder={placeholder || '0'}
          onBlur={save}
          onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false) }}
          style={{ width: 80, padding: '3px 6px', borderRadius: 5, border: `1.5px solid ${INDIGO}`, fontSize: 11, fontFamily: 'inherit', fontVariantNumeric: 'tabular-nums', background: 'var(--sf)', color: 'var(--tx)', outline: 'none', textAlign: 'right' }}
        />
      </div>
    )
  }

  return (
    <span onClick={() => setEditing(true)}
      style={{ cursor: 'pointer', borderBottom: '1px dashed var(--tx3)', paddingBottom: 1, fontSize: 11, fontVariantNumeric: 'tabular-nums', color: value > 0 ? GREEN : 'var(--tx3)' }}>
      {value > 0 ? `+${fmtFull(value, sym)}` : 'Click to set'}
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
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)' }}>{label}</span>
        {badge && (
          <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: 'rgba(99,102,241,.08)', color: INDIGO }}>{badge}</span>
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
  const usesSde = metricMode === 'sde' || (metricMode === 'both' && sde > 0 && annualizedValue(sde) < 5_000_000)
  const primaryMetric = usesSde ? sde : adjustedEbitda > ebitda ? adjustedEbitda : ebitda
  const primaryLabel = usesSde ? 'SDE' : adjustedEbitda > ebitda ? 'Adj. EBITDA' : 'EBITDA'

  function annualizedValue(periodVal: number) {
    if (pnlMonthly && pnlMonthly.length > 0) {
      const months = pnlMonthly.length
      const addBackPerMonth = (interest + tax + depreciation + amortization + totalAcceptedAddBacks + (usesSde ? ownerComp : 0)) / months
      const total = pnlMonthly.reduce((s, m) => s + m.net + addBackPerMonth, 0)
      return (total / months) * 12
    }
    return periodVal * 12
  }

  const annualized = annualizedValue(primaryMetric)
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
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)' }}>EBITDA & Valuation</span>
            {ebitda > 0 && (
              <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                background: ebitdaMargin >= 20 ? 'rgba(34,197,94,.1)' : ebitdaMargin >= 10 ? 'rgba(245,158,11,.1)' : 'rgba(239,68,68,.1)',
                color: ebitdaMargin >= 20 ? GREEN : ebitdaMargin >= 10 ? AMBER : RED }}>
                {ebitdaMargin.toFixed(1)}% margin
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
                  {m === 'both' ? 'Both' : m}
                </button>
              ))}
            </div>
            {hasAnyOverride && (
              <button onClick={() => { setOverrides({}); save({ overrides: {} }) }}
                style={{ fontSize: 10, color: 'var(--tx3)', background: 'rgba(0,0,0,.04)', border: 'none', borderRadius: 5, padding: '3px 8px', cursor: 'pointer', fontWeight: 500, fontFamily: 'inherit' }}>
                Reset
              </button>
            )}
            <button onClick={() => onAsk(`My EBITDA is ${fmt(ebitda, sym)} (${ebitdaMargin.toFixed(1)}% margin), Adjusted EBITDA: ${fmt(adjustedEbitda, sym)}, SDE: ${fmt(sde, sym)}. Revenue: ${fmt(totals.revenue, sym)}. Industry: ${ind.label}. Quality score: ${Math.round(qualityPct)}%. At ${multiple}x, valuation is ${fmt(valuation, sym)}. Analyze my EBITDA health and suggest improvements.`)}
              style={{ fontSize: 10, color: INDIGO, background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}>
              Ask AI
            </button>
          </div>
        </div>

        {/* KPI Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: metricMode === 'both' ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)', gap: 1, background: 'var(--b)' }}>
          <div style={{ padding: '14px 12px', background: 'var(--sf)', textAlign: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx2)', marginBottom: 4 }}>EBITDA</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: ebitda >= 0 ? GREEN : RED, fontVariantNumeric: 'tabular-nums' }}>{fmt(ebitda, sym)}</div>
            {ebitdaChange != null && (
              <div style={{ fontSize: 10, fontWeight: 600, color: ebitdaChange > 0 ? GREEN : ebitdaChange < 0 ? RED : 'var(--tx3)', marginTop: 2 }}>
                {ebitdaChange > 0 ? '▲' : ebitdaChange < 0 ? '▼' : '–'} {Math.abs(ebitdaChange).toFixed(1)}%
              </div>
            )}
          </div>
          {(metricMode === 'sde' || metricMode === 'both') && (
            <div style={{ padding: '14px 12px', background: 'var(--sf)', textAlign: 'center' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx2)', marginBottom: 4 }}>SDE</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: sde >= 0 ? CYAN : RED, fontVariantNumeric: 'tabular-nums' }}>{fmt(sde, sym)}</div>
              <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 2 }}>+ owner comp</div>
            </div>
          )}
          <div style={{ padding: '14px 12px', background: 'var(--sf)', textAlign: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx2)', marginBottom: 4 }}>Margin</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: ebitdaMargin >= 20 ? GREEN : ebitdaMargin >= 10 ? AMBER : RED, fontVariantNumeric: 'tabular-nums' }}>{ebitdaMargin.toFixed(1)}%</div>
            <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 2 }}>{ebitdaMargin >= 20 ? 'Healthy' : ebitdaMargin >= 10 ? 'Moderate' : 'Needs attention'}</div>
          </div>
          <div style={{ padding: '14px 12px', background: 'var(--sf)', textAlign: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx2)', marginBottom: 4 }}>Valuation ({multiple}x)</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: INDIGO, fontVariantNumeric: 'tabular-nums' }}>{fmt(valuation, sym)}</div>
            <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 2 }}>{primaryLabel} × {multiple}</div>
          </div>
        </div>

        {/* EBITDA Breakdown */}
        <div style={{ padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx2)' }}>EBITDA Breakdown</div>
            <div style={{ fontSize: 9, color: 'var(--tx3)', fontStyle: 'italic' }}>Click any value to edit</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <tbody>
              <tr>
                <td style={{ padding: '6px 0', fontWeight: 700, color: 'var(--tx)', fontSize: 12 }}>Net Profit</td>
                <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 700, color: totals.net_profit >= 0 ? 'var(--tx)' : RED, fontVariantNumeric: 'tabular-nums', fontSize: 12 }}>{fmtFull(totals.net_profit, sym)}</td>
              </tr>
              {([['interest', '+ Interest', interest, auto.interest] as const,
                ['tax', '+ Taxes', tax, auto.tax] as const,
                ['depreciation', '+ Depreciation', depreciation, auto.depreciation] as const,
                ['amortization', '+ Amortization', amortization, auto.amortization] as const,
              ]).map(([key, label, val, autoVal]) => (
                <tr key={key}>
                  <td style={{ padding: '6px 0', color: INDIGO, fontSize: 12 }}>
                    {label}
                    {overrides[key] == null && <span style={{ fontSize: 8, color: 'var(--tx3)', marginLeft: 4 }}>est.</span>}
                  </td>
                  <EditableValue value={val} autoValue={autoVal} sym={sym} isOverridden={overrides[key] != null}
                    onSave={v => setOverride(key, v)} onReset={() => resetOverride(key)} add />
                </tr>
              ))}
              <tr style={{ borderTop: '2px solid var(--b)' }}>
                <td style={{ padding: '8px 0', fontWeight: 700, fontSize: 13, color: 'var(--tx)' }}>= EBITDA</td>
                <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700, fontSize: 13, color: ebitda >= 0 ? GREEN : RED, fontVariantNumeric: 'tabular-nums' }}>{fmtFull(ebitda, sym)}</td>
              </tr>
            </tbody>
          </table>
          <div style={{ marginTop: 8, padding: '6px 10px', borderRadius: 6, background: 'rgba(99,102,241,.04)', fontSize: 10, color: 'var(--tx3)', lineHeight: 1.5 }}>
            Values marked <span style={{ fontSize: 8, background: 'var(--sf)', padding: '1px 4px', borderRadius: 3, border: '1px solid var(--b)' }}>est.</span> are auto-estimated. Click to override. Right-click to reset.
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  3. ADJUSTED EBITDA + ADD-BACKS                               */}
      {/* ============================================================ */}
      <div style={CARD}>
        <SectionHeader color={GREEN} label="Adjusted EBITDA"
          badge={totalAcceptedAddBacks > 0 ? `+${fmt(totalAcceptedAddBacks, sym)} add-backs` : undefined}
          right={
            <button onClick={() => setShowAddBacks(v => !v)}
              style={{ fontSize: 10, color: INDIGO, background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}>
              {showAddBacks ? 'Collapse' : 'Expand'} Add-Backs
            </button>
          }
        />
        <div style={{ padding: '16px 18px' }}>
          {/* Summary row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
            <div style={{ padding: 10, borderRadius: 8, border: '1px solid var(--b)', textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: 3 }}>EBITDA</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: ebitda >= 0 ? GREEN : RED, fontVariantNumeric: 'tabular-nums' }}>{fmt(ebitda, sym)}</div>
            </div>
            <div style={{ padding: 10, borderRadius: 8, border: '1px solid var(--b)', textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: 3 }}>+ Add-Backs</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: totalAcceptedAddBacks > 0 ? GREEN : 'var(--tx3)', fontVariantNumeric: 'tabular-nums' }}>{fmt(totalAcceptedAddBacks, sym)}</div>
            </div>
            <div style={{ padding: 10, borderRadius: 8, border: `1px solid ${GREEN}`, background: 'rgba(34,197,94,.04)', textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontWeight: 600, color: GREEN, textTransform: 'uppercase', marginBottom: 3 }}>Adj. EBITDA</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: GREEN, fontVariantNumeric: 'tabular-nums' }}>{fmt(adjustedEbitda, sym)}</div>
            </div>
          </div>

          {showAddBacks && (
            <>
              {/* Accepted add-backs */}
              <div style={{ fontSize: 10, fontWeight: 600, color: GREEN, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                Accepted Add-Backs (investors will accept these)
              </div>
              {ADD_BACK_TEMPLATES.filter(t => t.accepted).map(t => (
                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--b)' }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--tx)' }}>{t.label}</div>
                    <div style={{ fontSize: 10, color: 'var(--tx3)' }}>{t.description}</div>
                  </div>
                  <InlineAmount value={addBacks[t.id] || 0} sym={sym} onChange={v => saveAddBack(t.id, v)} />
                </div>
              ))}

              {/* Rejected add-backs */}
              <div style={{ fontSize: 10, fontWeight: 600, color: RED, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 16, marginBottom: 8 }}>
                Typically Rejected (buyers will challenge these)
              </div>
              {ADD_BACK_TEMPLATES.filter(t => !t.accepted).map(t => (
                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--b)', opacity: 0.7 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--tx)' }}>{t.label}</div>
                    <div style={{ fontSize: 10, color: RED }}>{t.description}</div>
                  </div>
                  <InlineAmount value={addBacks[t.id] || 0} sym={sym} onChange={v => saveAddBack(t.id, v)} />
                </div>
              ))}
              {totalRejectedAddBacks > 0 && (
                <div style={{ marginTop: 8, padding: '6px 10px', borderRadius: 6, background: 'rgba(239,68,68,.06)', fontSize: 10, color: RED, lineHeight: 1.5 }}>
                  Warning: {fmt(totalRejectedAddBacks, sym)} in rejected add-backs. Buyers will likely challenge these during due diligence.
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
          <SectionHeader color={CYAN} label="Seller's Discretionary Earnings (SDE)"
            badge={sde > 0 ? fmt(sde, sym) : undefined}
          />
          <div style={{ padding: '16px 18px' }}>
            <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 12, lineHeight: 1.6 }}>
              SDE = Adjusted EBITDA + Owner&apos;s Total Compensation. Used for businesses under ~{sym}5M valuation where the owner is actively involved. Buyers replace you and add your full comp back.
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <tbody>
                <tr>
                  <td style={{ padding: '6px 0', fontWeight: 600 }}>Adjusted EBITDA</td>
                  <td style={{ padding: '6px 0', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{fmtFull(adjustedEbitda, sym)}</td>
                </tr>
                <tr>
                  <td style={{ padding: '6px 0', color: CYAN }}>+ Owner&apos;s Total Compensation</td>
                  <td style={{ padding: '6px 0', textAlign: 'right' }}>
                    <InlineAmount value={ownerComp} sym={sym} onChange={saveOwnerComp} placeholder="Your total comp" />
                  </td>
                </tr>
                <tr style={{ borderTop: '2px solid var(--b)' }}>
                  <td style={{ padding: '8px 0', fontWeight: 700, fontSize: 13 }}>= SDE</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700, fontSize: 13, color: sde >= 0 ? CYAN : RED, fontVariantNumeric: 'tabular-nums' }}>{fmtFull(sde, sym)}</td>
                </tr>
              </tbody>
            </table>
            <div style={{ marginTop: 10, padding: '6px 10px', borderRadius: 6, background: 'rgba(6,182,212,.05)', fontSize: 10, color: 'var(--tx3)', lineHeight: 1.5 }}>
              Include your full salary, dividends, personal expenses through the business, pension contributions, and any benefits.
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  5. INDUSTRY MULTIPLES                                        */}
      {/* ============================================================ */}
      <div style={CARD}>
        <SectionHeader color={AMBER} label="Industry Multiples" badge={`${ind.ebitdaLow}x–${ind.ebitdaHigh}x range`} />
        <div style={{ padding: '16px 18px' }}>
          {/* Industry selector */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', marginBottom: 6 }}>Your Industry</div>
            <select value={industry} onChange={e => saveIndustry(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--b)', fontSize: 12, fontFamily: 'inherit', background: 'var(--sf)', color: 'var(--tx)', cursor: 'pointer', outline: 'none' }}>
              {INDUSTRIES.map(i => <option key={i.id} value={i.id}>{i.label}</option>)}
            </select>
          </div>

          {/* Multiple range visual */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx)' }}>EBITDA Multiple</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: INDIGO, fontVariantNumeric: 'tabular-nums' }}>{multiple}x</div>
            </div>
            <input type="range" min={1} max={15} step={0.5} value={multiple} onChange={e => saveMultiple(Number(e.target.value))}
              style={{ width: '100%', accentColor: INDIGO, cursor: 'pointer' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--tx3)', marginTop: 2 }}>
              <span>1x</span>
              <span style={{ fontSize: 10, color: INDIGO, fontWeight: 500 }}>
                {ind.label}: {ind.ebitdaLow}x–{ind.ebitdaHigh}x
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
            {multiple < ind.ebitdaLow && <div style={{ fontSize: 10, color: RED, marginTop: 4 }}>Below industry range</div>}
            {multiple > ind.ebitdaHigh && <div style={{ fontSize: 10, color: GREEN, marginTop: 4 }}>Above industry range — requires strong quality factors</div>}
          </div>

          {/* Valuation Results */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ padding: 14, borderRadius: 10, border: '1px solid var(--b)', background: 'var(--sf)', textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: 4 }}>Period Valuation</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: INDIGO, fontVariantNumeric: 'tabular-nums' }}>{fmt(valuation, sym)}</div>
              <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 2 }}>{primaryLabel} × {multiple}</div>
            </div>
            <div style={{ padding: 14, borderRadius: 10, border: '1px solid var(--b)', background: 'var(--sf)', textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: 4 }}>Annualized</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: INDIGO, fontVariantNumeric: 'tabular-nums' }}>{fmt(annualizedValuation, sym)}</div>
              <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 2 }}>{fmt(annualized, sym)}/yr × {multiple}</div>
            </div>
          </div>

          {/* Quick multiples comparison */}
          <div style={{ marginTop: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, background: 'var(--b)', borderRadius: 8, overflow: 'hidden' }}>
              {[ind.ebitdaLow, Math.round((ind.ebitdaLow + ind.ebitdaHigh) / 2), ind.ebitdaHigh, 10, 12].map(m => (
                <div key={m} onClick={() => saveMultiple(m)}
                  style={{ padding: '8px 4px', background: m === multiple ? 'rgba(99,102,241,.08)' : 'var(--sf)', textAlign: 'center', cursor: 'pointer' }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: m === multiple ? INDIGO : 'var(--tx3)' }}>{m}x</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: m === multiple ? INDIGO : 'var(--tx)', fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>{fmt(annualized * m, sym)}</div>
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
        <SectionHeader color={CYAN} label="Valuation Quality Score"
          badge={`${Math.round(qualityPct)}% · Suggests ${suggestedMultiple}x`}
        />
        <div style={{ padding: '16px 18px' }}>
          <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 14, lineHeight: 1.5 }}>
            Rate each factor 0–3 to see where your business sits within the industry multiple range. Higher scores push your multiple toward the top of the {ind.ebitdaLow}x–{ind.ebitdaHigh}x band.
          </div>

          {QUALITY_FACTORS.map(f => {
            const score = qualityScores[f.id] || 0
            return (
              <div key={f.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--b)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--tx)' }}>{f.label}</div>
                  <div style={{ fontSize: 10, color: 'var(--tx3)' }}>{f.description}</div>
                </div>
                <div style={{ display: 'flex', gap: 4, marginLeft: 12 }}>
                  {[0, 1, 2, 3].map(s => (
                    <button key={s} onClick={() => saveQuality(f.id, s)}
                      style={{
                        width: 28, height: 28, borderRadius: 6, border: `1px solid ${score === s ? INDIGO : 'var(--b)'}`,
                        background: score === s ? INDIGO : score >= s ? 'rgba(99,102,241,.1)' : 'var(--sf)',
                        color: score === s ? '#fff' : 'var(--tx3)', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
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
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)' }}>Quality Score: {Math.round(qualityPct)}%</div>
                <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 2 }}>
                  Suggested multiple: <strong style={{ color: INDIGO }}>{suggestedMultiple}x</strong> (within {ind.label} range)
                </div>
              </div>
              <button onClick={() => saveMultiple(suggestedMultiple)}
                style={{ fontSize: 10, color: INDIGO, background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}>
                Apply {suggestedMultiple}x
              </button>
            </div>
            {/* Visual bar */}
            <div style={{ position: 'relative', height: 8, background: 'var(--ev, #f3f2ef)', borderRadius: 4, marginTop: 10 }}>
              <div style={{ width: `${qualityPct}%`, height: '100%', borderRadius: 4, background: `linear-gradient(90deg, ${RED}, ${AMBER}, ${GREEN})`, transition: 'width 300ms' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--tx3)', marginTop: 4 }}>
              <span>Weak</span><span>Average</span><span>Strong</span><span>Premium</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  7. SCENARIO MODELLER                                         */}
      {/* ============================================================ */}
      <div style={CARD}>
        <SectionHeader color={INDIGO} label="Scenario Modeller" badge="What-If" />
        <div style={{ padding: '16px 18px' }}>
          <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 12, lineHeight: 1.5 }}>
            Drag the slider to see how changes to your {primaryLabel} affect your business valuation.
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx)' }}>{primaryLabel} Change</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: scenarioDelta >= 0 ? GREEN : RED, fontVariantNumeric: 'tabular-nums' }}>
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
              <span>Decrease</span><span>No change</span><span>Increase</span>
            </div>
          </div>

          {/* Scenario results */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 10, alignItems: 'center' }}>
            <div style={{ padding: 12, borderRadius: 10, border: '1px solid var(--b)', textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: 3 }}>Current</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx)', fontVariantNumeric: 'tabular-nums' }}>{fmt(primaryMetric, sym)}</div>
              <div style={{ fontSize: 10, color: 'var(--tx3)' }}>Val: {fmt(primaryMetric * multiple, sym)}</div>
            </div>
            <div style={{ fontSize: 18, color: 'var(--tx3)' }}>→</div>
            <div style={{ padding: 12, borderRadius: 10, border: `1px solid ${scenarioDelta >= 0 ? GREEN : RED}`, background: scenarioDelta >= 0 ? 'rgba(34,197,94,.04)' : 'rgba(239,68,68,.04)', textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontWeight: 600, color: scenarioDelta >= 0 ? GREEN : RED, textTransform: 'uppercase', marginBottom: 3 }}>Scenario</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: scenarioDelta >= 0 ? GREEN : RED, fontVariantNumeric: 'tabular-nums' }}>{fmt(scenarioEbitda, sym)}</div>
              <div style={{ fontSize: 10, color: 'var(--tx3)' }}>Val: {fmt(scenarioValuation, sym)}</div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 8, fontSize: 11, fontWeight: 600, color: scenarioDelta >= 0 ? GREEN : RED }}>
            Valuation {scenarioDelta >= 0 ? 'increases' : 'decreases'} by {fmt(Math.abs(scenarioValuation - primaryMetric * multiple), sym)}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  8. EXPORT / INVESTOR SUMMARY                                 */}
      {/* ============================================================ */}
      <div style={CARD}>
        <SectionHeader color={INDIGO} label="Investor-Ready Summary"
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
              style={{ fontSize: 10, color: INDIGO, background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              Export PNG
            </button>
          }
        />
        <div style={{ padding: '16px 18px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <tbody>
              {([
                ['Revenue', fmt(totals.revenue, sym)],
                ['Gross Profit', fmt(totals.gross_profit, sym)],
                ['Net Profit', fmt(totals.net_profit, sym)],
                ['EBITDA', fmt(ebitda, sym)],
                ['EBITDA Margin', `${ebitdaMargin.toFixed(1)}%`],
                ...(totalAcceptedAddBacks > 0 ? [['Adjusted EBITDA', fmt(adjustedEbitda, sym)]] : []),
                ...(metricMode !== 'ebitda' && ownerComp > 0 ? [['SDE', fmt(sde, sym)]] : []),
                ['Industry', ind.label],
                ['Industry Multiple Range', `${ind.ebitdaLow}x – ${ind.ebitdaHigh}x`],
                ['Applied Multiple', `${multiple}x`],
                ['Quality Score', `${Math.round(qualityPct)}%`],
                ['Period Valuation', fmt(valuation, sym)],
                ['Annualized Valuation', fmt(annualizedValuation, sym)],
              ] as [string, string][]).map(([label, value], i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--b)' }}>
                  <td style={{ padding: '7px 0', color: 'var(--tx3)', fontSize: 11 }}>{label}</td>
                  <td style={{ padding: '7px 0', textAlign: 'right', fontWeight: 600, color: 'var(--tx)', fontVariantNumeric: 'tabular-nums' }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 8, background: 'rgba(245,158,11,.06)', border: '1px solid rgba(245,158,11,.15)', fontSize: 10, color: 'var(--tx3)', lineHeight: 1.6 }}>
            <strong style={{ color: AMBER }}>Disclaimer:</strong> This is an indicative estimate based on industry benchmarks and self-reported data. It is not a formal business valuation. Consult a qualified valuation professional for investment, sale, or financing decisions.
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  Monthly EBITDA Trend                                         */}
      {/* ============================================================ */}
      {monthlyEbitda.length > 1 && (
        <div style={CARD}>
          <SectionHeader color={GREEN} label="Monthly EBITDA Trend" />
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
