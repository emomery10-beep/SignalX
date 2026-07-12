'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { useLang } from '@/components/LanguageProvider'

const INDIGO = '#6366F1'
const RED = '#EF4444'
const GREEN = '#22C55E'

export interface CostLine { id: string; label: string; amount: number }
export interface CostConfig {
  cashBalance: number
  fixedCosts: CostLine[]
  variableCosts: CostLine[]
}

const buildDefaultFixed = (tc: (k: string, v?: Record<string, string | number>) => string): CostLine[] => [
  { id: 'rent', label: tc('cfo_costconfig.fixedRent'), amount: 0 },
  { id: 'salaries', label: tc('cfo_costconfig.fixedSalaries'), amount: 0 },
  { id: 'insurance', label: tc('cfo_costconfig.fixedHealthInsurance'), amount: 0 },
  { id: 'biz_insurance', label: tc('cfo_costconfig.fixedBizInsurance'), amount: 0 },
  { id: 'software', label: tc('cfo_costconfig.fixedSoftware'), amount: 0 },
  { id: 'equipment', label: tc('cfo_costconfig.fixedEquipment'), amount: 0 },
  { id: 'loans', label: tc('cfo_costconfig.fixedLoans'), amount: 0 },
  { id: 'phone', label: tc('cfo_costconfig.fixedPhone'), amount: 0 },
  { id: 'accounting', label: tc('cfo_costconfig.fixedAccounting'), amount: 0 },
]

const buildDefaultVariable = (tc: (k: string, v?: Record<string, string | number>) => string): CostLine[] => [
  { id: 'commissions', label: tc('cfo_costconfig.varCommissions'), amount: 0 },
  { id: 'shipping', label: tc('cfo_costconfig.varShipping'), amount: 0 },
  { id: 'ad_spend', label: tc('cfo_costconfig.varAdSpend'), amount: 0 },
  { id: 'processing', label: tc('cfo_costconfig.varProcessing'), amount: 0 },
  { id: 'packaging', label: tc('cfo_costconfig.varPackaging'), amount: 0 },
  { id: 'contract', label: tc('cfo_costconfig.varContract'), amount: 0 },
]

// Static defaults for non-component contexts (loadCostConfig, etc.)
const DEFAULT_FIXED: CostLine[] = [
  { id: 'rent', label: 'Rent / Lease', amount: 0 },
  { id: 'salaries', label: 'Salaries & Wages', amount: 0 },
  { id: 'insurance', label: 'Health Insurance', amount: 0 },
  { id: 'biz_insurance', label: 'Business Insurance', amount: 0 },
  { id: 'software', label: 'Software Subscriptions', amount: 0 },
  { id: 'equipment', label: 'Equipment Leases', amount: 0 },
  { id: 'loans', label: 'Loan / Debt Payments', amount: 0 },
  { id: 'phone', label: 'Phone & Internet', amount: 0 },
  { id: 'accounting', label: 'Accounting / Legal', amount: 0 },
]

const DEFAULT_VARIABLE: CostLine[] = [
  { id: 'commissions', label: 'Sales Commissions', amount: 0 },
  { id: 'shipping', label: 'Shipping & Fulfillment', amount: 0 },
  { id: 'ad_spend', label: 'Paid Marketing / Ad Spend', amount: 0 },
  { id: 'processing', label: 'Payment Processing Fees', amount: 0 },
  { id: 'packaging', label: 'Packaging', amount: 0 },
  { id: 'contract', label: 'Contract Labour', amount: 0 },
]

export const COST_CONFIG_KEY = 'cfo_cost_config'

export function loadCostConfig(): CostConfig {
  if (typeof window === 'undefined') return { cashBalance: 0, fixedCosts: DEFAULT_FIXED, variableCosts: DEFAULT_VARIABLE }
  try {
    const stored = localStorage.getItem(COST_CONFIG_KEY)
    if (stored) {
      const p = JSON.parse(stored)
      return {
        cashBalance: p.cashBalance || 0,
        fixedCosts: p.fixedCosts?.length ? p.fixedCosts : DEFAULT_FIXED,
        variableCosts: p.variableCosts?.length ? p.variableCosts : DEFAULT_VARIABLE,
      }
    }
  } catch {}
  return { cashBalance: 0, fixedCosts: DEFAULT_FIXED, variableCosts: DEFAULT_VARIABLE }
}

export function sumFixed(config: CostConfig) { return config.fixedCosts.reduce((s, c) => s + (Number(c.amount) || 0), 0) }
export function sumVariable(config: CostConfig) { return config.variableCosts.reduce((s, c) => s + (Number(c.amount) || 0), 0) }

const INPUT_STYLE: React.CSSProperties = {
  fontSize: 10, color: 'var(--tx)', background: 'var(--ev)',
  border: '1px solid var(--b)', borderRadius: 6, padding: '6px 8px',
  fontFamily: 'inherit', outline: 'none', width: '100%', boxSizing: 'border-box',
}

interface CostTableProps {
  lines: CostLine[]
  setter: React.Dispatch<React.SetStateAction<CostLine[]>>
  total: number
  accent: string
  sym: string
  fmt: (n: number) => string
  labelPlaceholder: string
  addRowLabel: string
  categoryHeader: string
  monthlyHeader: string
  monthlyTotalLabel: string
}

function CostTable({ lines, setter, total, accent, sym, fmt, labelPlaceholder, addRowLabel, categoryHeader, monthlyHeader, monthlyTotalLabel }: CostTableProps) {
  const updateLine = useCallback((id: string, field: 'label' | 'amount', value: string) =>
    setter(prev => prev.map(c => c.id === id ? { ...c, [field]: field === 'amount' ? (value === '' ? 0 : Number(value)) : value } : c))
  , [setter])

  const addLine = useCallback(() =>
    setter(prev => [...prev, { id: `custom_${Date.now()}`, label: '', amount: 0 }])
  , [setter])

  const removeLine = useCallback((id: string) =>
    setter(prev => prev.filter(c => c.id !== id))
  , [setter])

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px 28px', gap: 6, paddingBottom: 6, borderBottom: '1px solid var(--b)', marginBottom: 8 }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{categoryHeader}</span>
        <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', textAlign: 'right', paddingRight: 8 }}>{monthlyHeader}</span>
        <span />
      </div>
      {lines.map(line => (
        <div key={line.id} style={{ display: 'grid', gridTemplateColumns: '1fr 130px 28px', gap: 6, alignItems: 'center', marginBottom: 6 }}>
          <input
            value={line.label}
            onChange={e => updateLine(line.id, 'label', e.target.value)}
            placeholder={labelPlaceholder}
            style={INPUT_STYLE}
          />
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 9, color: 'var(--tx3)', pointerEvents: 'none' }}>{sym}</span>
            <input
              type="text"
              inputMode="decimal"
              value={line.amount || ''}
              onChange={e => updateLine(line.id, 'amount', e.target.value.replace(/[^0-9.]/g, ''))}
              placeholder="0"
              style={{ ...INPUT_STYLE, paddingLeft: 20, textAlign: 'right' }}
            />
          </div>
          <button
            onClick={() => removeLine(line.id)}
            style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx3)', cursor: 'pointer', fontSize: 12, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >×</button>
        </div>
      ))}
      <button
        onClick={addLine}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, width: '100%', padding: '6px 0', borderRadius: 7, border: `1px dashed ${accent}50`, background: 'transparent', color: accent, fontSize: 9, cursor: 'pointer', fontFamily: 'inherit', marginTop: 4 }}
      >{addRowLabel}</button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0 0', borderTop: '2px solid var(--b)', marginTop: 12 }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{monthlyTotalLabel}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: accent }}>{fmt(total)}</span>
      </div>
    </div>
  )
}

interface Props {
  open: boolean
  initialSection?: 'balance' | 'fixed' | 'variable'
  onClose: () => void
  onSaved: (config: CostConfig) => void
  currencySymbol: string
}

export default function CostConfigDrawer({ open, initialSection = 'balance', onClose, onSaved, currencySymbol: sym }: Props) {
  const { tc } = useLang()
  const [cashBalance, setCashBalance] = useState('')
  const [fixed, setFixed] = useState<CostLine[]>(DEFAULT_FIXED)
  const [variable, setVariable] = useState<CostLine[]>(DEFAULT_VARIABLE)
  const [section, setSection] = useState<'balance' | 'fixed' | 'variable'>(initialSection)

  const defaultFixed = buildDefaultFixed(tc)
  const defaultVariable = buildDefaultVariable(tc)

  useEffect(() => {
    if (!open) return
    const cfg = loadCostConfig()
    setCashBalance(cfg.cashBalance > 0 ? String(cfg.cashBalance) : '')
    setFixed(cfg.fixedCosts.length ? cfg.fixedCosts : defaultFixed)
    setVariable(cfg.variableCosts.length ? cfg.variableCosts : defaultVariable)
    setSection(initialSection)
  }, [open, initialSection])

  const fixedTotal = fixed.reduce((s, c) => s + (Number(c.amount) || 0), 0)
  const variableTotal = variable.reduce((s, c) => s + (Number(c.amount) || 0), 0)

  const fmt = (n: number) => {
    if (n >= 1_000_000) return `${sym}${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `${sym}${(n / 1_000).toFixed(1)}K`
    return `${sym}${Math.round(n).toLocaleString()}`
  }

  const handleSave = () => {
    const cfg: CostConfig = {
      cashBalance: Number(cashBalance) || 0,
      fixedCosts: fixed.map(c => ({ ...c, amount: Number(c.amount) || 0 })),
      variableCosts: variable.map(c => ({ ...c, amount: Number(c.amount) || 0 })),
    }
    try { localStorage.setItem(COST_CONFIG_KEY, JSON.stringify(cfg)) } catch {}
    onSaved(cfg)
    onClose()
  }


  if (!open) return null

  const tabs: Array<{ id: 'balance' | 'fixed' | 'variable'; label: string; badge?: string }> = [
    { id: 'balance', label: tc('cfo_costconfig.tabCashBalance'), badge: Number(cashBalance) > 0 ? fmt(Number(cashBalance)) : undefined },
    { id: 'fixed', label: tc('cfo_costconfig.tabFixedCosts'), badge: fixedTotal > 0 ? fmt(fixedTotal) : undefined },
    { id: 'variable', label: tc('cfo_costconfig.tabVariableCosts'), badge: variableTotal > 0 ? fmt(variableTotal) : undefined },
  ]

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 999, backdropFilter: 'blur(2px)' }} />
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 460, background: 'var(--bg)', zIndex: 1000, display: 'flex', flexDirection: 'column', boxShadow: '-6px 0 40px rgba(0,0,0,.2)', animation: 'drawerIn 180ms ease-out' }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_costconfig.drawerTitle')}</div>
            <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 2 }}>{tc('cfo_costconfig.drawerSubtitle')}</div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx3)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', padding: '10px 20px', gap: 6, borderBottom: '1px solid var(--b)', flexShrink: 0 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setSection(t.id)} style={{ padding: '5px 10px', borderRadius: 7, border: 'none', fontFamily: 'inherit', background: section === t.id ? `${INDIGO}14` : 'transparent', color: section === t.id ? INDIGO : 'var(--tx3)', fontSize: 9, fontWeight: section === t.id ? 600 : 400, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              {t.label}
              {t.badge && <span style={{ fontSize: 9, background: section === t.id ? `${INDIGO}20` : 'var(--ev)', color: section === t.id ? INDIGO : 'var(--tx3)', borderRadius: 4, padding: '1px 5px' }}>{t.badge}</span>}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px' }}>
          {section === 'balance' && (
            <div>
              <p style={{ fontSize: 10, color: 'var(--tx3)', marginBottom: 18, lineHeight: 1.6, margin: '0 0 18px' }}>
                {tc('cfo_costconfig.balanceDescription')}
              </p>
              <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>{tc('cfo_costconfig.balanceLabel')}</label>
              <div style={{ position: 'relative', marginBottom: 14 }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: 'var(--tx3)', pointerEvents: 'none' }}>{sym}</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={cashBalance}
                  onChange={e => setCashBalance(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder={tc('cfo_costconfig.balancePlaceholder')}
                  style={{ width: '100%', fontSize: 22, fontWeight: 700, color: 'var(--tx)', background: 'var(--ev)', border: `2px solid ${INDIGO}40`, borderRadius: 10, padding: '12px 14px 12px 36px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => { e.currentTarget.style.borderColor = INDIGO }}
                  onBlur={e => { e.currentTarget.style.borderColor = `${INDIGO}40` }}
                />
              </div>
              {Number(cashBalance) > 0 && (
                <div style={{ padding: '10px 14px', borderRadius: 10, background: `${GREEN}08`, border: `1px solid ${GREEN}20`, fontSize: 10, color: 'var(--tx)', lineHeight: 1.5 }}>
                  💰 {tc('cfo_costconfig.balanceSetMessage')} <strong>{fmt(Number(cashBalance))}</strong>. {tc('cfo_costconfig.balanceSetRunway')}
                </div>
              )}
            </div>
          )}
          {section === 'fixed' && (
            <div>
              <p style={{ fontSize: 10, color: 'var(--tx3)', marginBottom: 18, lineHeight: 1.6, margin: '0 0 18px' }}>
                {tc('cfo_costconfig.fixedDescription')}
              </p>
              <CostTable lines={fixed} setter={setFixed} total={fixedTotal} accent={RED} sym={sym} fmt={fmt} labelPlaceholder={tc('cfo_costconfig.categoryNamePlaceholder')} addRowLabel={tc('cfo_costconfig.addRow')} categoryHeader={tc('cfo_costconfig.tableHeaderCategory')} monthlyHeader={tc('cfo_costconfig.tableHeaderMonthly')} monthlyTotalLabel={tc('cfo_costconfig.monthlyTotal')} />
            </div>
          )}
          {section === 'variable' && (
            <div>
              <p style={{ fontSize: 10, color: 'var(--tx3)', marginBottom: 18, lineHeight: 1.6, margin: '0 0 18px' }}>
                {tc('cfo_costconfig.variableDescription')}
              </p>
              <CostTable lines={variable} setter={setVariable} total={variableTotal} accent={INDIGO} sym={sym} fmt={fmt} labelPlaceholder={tc('cfo_costconfig.categoryNamePlaceholder')} addRowLabel={tc('cfo_costconfig.addRow')} categoryHeader={tc('cfo_costconfig.tableHeaderCategory')} monthlyHeader={tc('cfo_costconfig.tableHeaderMonthly')} monthlyTotalLabel={tc('cfo_costconfig.monthlyTotal')} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--b)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, background: 'var(--bg)' }}>
          <div style={{ flex: 1, fontSize: 9, color: 'var(--tx3)', lineHeight: 1.4 }}>
            {tc('cfo_costconfig.footerFixed')} <strong style={{ color: RED }}>{fmt(fixedTotal)}</strong>/mo · {tc('cfo_costconfig.footerVariable')} <strong style={{ color: INDIGO }}>{fmt(variableTotal)}</strong>/mo
          </div>
          <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx3)', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit' }}>{tc('cfo_costconfig.btnCancel')}</button>
          <button onClick={handleSave} style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: INDIGO, color: '#fff', fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{tc('cfo_costconfig.btnSave')}</button>
        </div>
      </div>
      <style>{`@keyframes drawerIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
    </>
  )
}
