'use client'
import { useState, useEffect } from 'react'

const INDIGO = '#6366F1'
const RED = '#EF4444'
const GREEN = '#22C55E'

export interface CostLine { id: string; label: string; amount: number }
export interface CostConfig {
  cashBalance: number
  fixedCosts: CostLine[]
  variableCosts: CostLine[]
}

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

interface Props {
  open: boolean
  initialSection?: 'balance' | 'fixed' | 'variable'
  onClose: () => void
  onSaved: (config: CostConfig) => void
  currencySymbol: string
}

export default function CostConfigDrawer({ open, initialSection = 'balance', onClose, onSaved, currencySymbol: sym }: Props) {
  const [cashBalance, setCashBalance] = useState('')
  const [fixed, setFixed] = useState<CostLine[]>(DEFAULT_FIXED)
  const [variable, setVariable] = useState<CostLine[]>(DEFAULT_VARIABLE)
  const [section, setSection] = useState<'balance' | 'fixed' | 'variable'>(initialSection)

  useEffect(() => {
    if (!open) return
    const cfg = loadCostConfig()
    setCashBalance(cfg.cashBalance > 0 ? String(cfg.cashBalance) : '')
    setFixed(cfg.fixedCosts.length ? cfg.fixedCosts : DEFAULT_FIXED)
    setVariable(cfg.variableCosts.length ? cfg.variableCosts : DEFAULT_VARIABLE)
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

  const updateLine = (
    setter: React.Dispatch<React.SetStateAction<CostLine[]>>,
    id: string, field: 'label' | 'amount', value: string
  ) => setter(prev => prev.map(c => c.id === id ? { ...c, [field]: field === 'amount' ? (value === '' ? 0 : Number(value)) : value } : c))

  const addLine = (setter: React.Dispatch<React.SetStateAction<CostLine[]>>) =>
    setter(prev => [...prev, { id: `custom_${Date.now()}`, label: '', amount: 0 }])

  const removeLine = (setter: React.Dispatch<React.SetStateAction<CostLine[]>>, id: string) =>
    setter(prev => prev.filter(c => c.id !== id))

  const inputStyle: React.CSSProperties = {
    fontSize: 12, color: 'var(--tx)', background: 'var(--ev)',
    border: '1px solid var(--b)', borderRadius: 6, padding: '6px 8px',
    fontFamily: 'inherit', outline: 'none', width: '100%', boxSizing: 'border-box',
  }

  const CostTable = ({ lines, setter, total, accent }: {
    lines: CostLine[]; setter: React.Dispatch<React.SetStateAction<CostLine[]>>; total: number; accent: string
  }) => (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px 28px', gap: 6, paddingBottom: 6, borderBottom: '1px solid var(--b)', marginBottom: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Category</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', textAlign: 'right', paddingRight: 8 }}>Monthly</span>
        <span />
      </div>
      {lines.map(line => (
        <div key={line.id} style={{ display: 'grid', gridTemplateColumns: '1fr 130px 28px', gap: 6, alignItems: 'center', marginBottom: 6 }}>
          <input
            value={line.label}
            onChange={e => updateLine(setter, line.id, 'label', e.target.value)}
            placeholder="Category name"
            style={inputStyle}
          />
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: 'var(--tx3)', pointerEvents: 'none' }}>{sym}</span>
            <input
              type="text"
              inputMode="decimal"
              value={line.amount || ''}
              onChange={e => updateLine(setter, line.id, 'amount', e.target.value.replace(/[^0-9.]/g, ''))}
              placeholder="0"
              style={{ ...inputStyle, paddingLeft: 20, textAlign: 'right' }}
            />
          </div>
          <button
            onClick={() => removeLine(setter, line.id)}
            style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx3)', cursor: 'pointer', fontSize: 14, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >×</button>
        </div>
      ))}
      <button
        onClick={() => addLine(setter)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, width: '100%', padding: '6px 0', borderRadius: 7, border: `1px dashed ${accent}50`, background: 'transparent', color: accent, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', marginTop: 4 }}
      >+ Add row</button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0 0', borderTop: '2px solid var(--b)', marginTop: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Monthly Total</span>
        <span style={{ fontSize: 16, fontWeight: 700, color: accent }}>{fmt(total)}</span>
      </div>
    </div>
  )

  if (!open) return null

  const tabs: Array<{ id: 'balance' | 'fixed' | 'variable'; label: string; badge?: string }> = [
    { id: 'balance', label: 'Cash Balance', badge: Number(cashBalance) > 0 ? fmt(Number(cashBalance)) : undefined },
    { id: 'fixed', label: 'Fixed Costs', badge: fixedTotal > 0 ? fmt(fixedTotal) : undefined },
    { id: 'variable', label: 'Variable Costs', badge: variableTotal > 0 ? fmt(variableTotal) : undefined },
  ]

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 999, backdropFilter: 'blur(2px)' }} />
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 460, background: 'var(--bg)', zIndex: 1000, display: 'flex', flexDirection: 'column', boxShadow: '-6px 0 40px rgba(0,0,0,.2)', animation: 'drawerIn 180ms ease-out' }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx)' }}>Cost Configuration</div>
            <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 2 }}>Set once · Updates runway & burn calculations</div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx3)', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', padding: '10px 20px', gap: 6, borderBottom: '1px solid var(--b)', flexShrink: 0 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setSection(t.id)} style={{ padding: '5px 10px', borderRadius: 7, border: 'none', fontFamily: 'inherit', background: section === t.id ? `${INDIGO}14` : 'transparent', color: section === t.id ? INDIGO : 'var(--tx3)', fontSize: 11, fontWeight: section === t.id ? 600 : 400, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              {t.label}
              {t.badge && <span style={{ fontSize: 9, background: section === t.id ? `${INDIGO}20` : 'var(--ev)', color: section === t.id ? INDIGO : 'var(--tx3)', borderRadius: 4, padding: '1px 5px' }}>{t.badge}</span>}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px' }}>
          {section === 'balance' && (
            <div>
              <p style={{ fontSize: 12, color: 'var(--tx3)', marginBottom: 18, lineHeight: 1.6, margin: '0 0 18px' }}>
                Your cash on hand right now — checking accounts, savings, petty cash. This drives your runway calculation.
              </p>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Current Cash Balance</label>
              <div style={{ position: 'relative', marginBottom: 14 }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: 'var(--tx3)', pointerEvents: 'none' }}>{sym}</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={cashBalance}
                  onChange={e => setCashBalance(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="e.g. 50000"
                  style={{ width: '100%', fontSize: 24, fontWeight: 700, color: 'var(--tx)', background: 'var(--ev)', border: `2px solid ${INDIGO}40`, borderRadius: 10, padding: '12px 14px 12px 36px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => { e.currentTarget.style.borderColor = INDIGO }}
                  onBlur={e => { e.currentTarget.style.borderColor = `${INDIGO}40` }}
                />
              </div>
              {Number(cashBalance) > 0 && (
                <div style={{ padding: '10px 14px', borderRadius: 10, background: `${GREEN}08`, border: `1px solid ${GREEN}20`, fontSize: 12, color: 'var(--tx)', lineHeight: 1.5 }}>
                  💰 Balance set to <strong>{fmt(Number(cashBalance))}</strong>. Your runway will be recalculated using this value.
                </div>
              )}
            </div>
          )}
          {section === 'fixed' && (
            <div>
              <p style={{ fontSize: 12, color: 'var(--tx3)', marginBottom: 18, lineHeight: 1.6, margin: '0 0 18px' }}>
                Costs that stay the same every month regardless of revenue. These are subtracted from gross profit to calculate net profit and daily burn rate.
              </p>
              <CostTable lines={fixed} setter={setFixed} total={fixedTotal} accent={RED} />
            </div>
          )}
          {section === 'variable' && (
            <div>
              <p style={{ fontSize: 12, color: 'var(--tx3)', marginBottom: 18, lineHeight: 1.6, margin: '0 0 18px' }}>
                Costs that scale with your volume — commissions, shipping, ad spend. These are used in contribution margin analysis.
              </p>
              <CostTable lines={variable} setter={setVariable} total={variableTotal} accent={INDIGO} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--b)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, background: 'var(--bg)' }}>
          <div style={{ flex: 1, fontSize: 11, color: 'var(--tx3)', lineHeight: 1.4 }}>
            Fixed <strong style={{ color: RED }}>{fmt(fixedTotal)}</strong>/mo · Variable <strong style={{ color: INDIGO }}>{fmt(variableTotal)}</strong>/mo
          </div>
          <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx3)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
          <button onClick={handleSave} style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: INDIGO, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Save</button>
        </div>
      </div>
      <style>{`@keyframes drawerIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
    </>
  )
}
