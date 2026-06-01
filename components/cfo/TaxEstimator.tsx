'use client'
import { useState } from 'react'
import { getRegionConfig } from '@/lib/region-config'

interface TaxEstimate {
  vat: { amount: number; rate: number; due: string; daysUntil: number; name: string }
  incomeTax: { amount: number; bracket: string; due: string; daysUntil: number }
  turnoverTax: { amount: number; rate: number; applicable: boolean }
  totalSetAside: number
  pctOfRevenue: number
}

interface Props {
  revenue: number
  grossProfit: number
  netProfit: number
  currencySymbol: string
  countryCode?: string | null
  onAsk?: (prompt: string) => void
}

function fmt(n: number, sym: string): string {
  if (Math.abs(n) >= 1_000_000) return `${sym}${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `${sym}${(n / 1_000).toFixed(0)}K`
  return `${sym}${Math.round(n).toLocaleString()}`
}

function getNextVatDue(dueDay: number): { due: string; daysUntil: number } {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()
  const dueDate = new Date(y, m + 1, dueDay)
  const daysUntil = Math.ceil((dueDate.getTime() - now.getTime()) / 86400000)
  return { due: dueDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }), daysUntil }
}

function getNextIncomeTaxDue(quarters: number[]): { due: string; daysUntil: number } {
  const now = new Date()
  const y = now.getFullYear()
  const dates = quarters.map(m => new Date(y, m, 20))
  const next = dates.find(d => d > now) || new Date(y + 1, quarters[0], 20)
  const daysUntil = Math.ceil((next.getTime() - now.getTime()) / 86400000)
  return { due: next.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }), daysUntil }
}

function computeTax(revenue: number, netProfit: number, countryCode?: string | null): TaxEstimate {
  const region = getRegionConfig(countryCode)
  const tc = region.taxConfig
  const annualRevenue = revenue * 12
  const annualProfit = netProfit * 12

  const vatRate = tc.vatRate
  const vatAmount = Math.round(revenue * vatRate)
  const vatDue = getNextVatDue(tc.vatDueDay)

  let turnoverApplicable = false
  let turnoverTax = 0
  if (tc.turnoverTax) {
    turnoverApplicable = annualRevenue >= tc.turnoverTax.minRevenue && annualRevenue <= tc.turnoverTax.maxRevenue
    turnoverTax = turnoverApplicable ? Math.round(revenue * tc.turnoverTax.rate) : 0
  }

  let incomeTaxAmount = 0
  let bracket = ''
  if (annualProfit > 0) {
    if (tc.turnoverTax && turnoverApplicable) {
      incomeTaxAmount = 0
      bracket = 'Covered by turnover tax'
    } else if (annualRevenue > (tc.turnoverTax?.maxRevenue || tc.smbThreshold || 0)) {
      incomeTaxAmount = Math.round(netProfit * tc.corporateRate)
      bracket = `${Math.round(tc.corporateRate * 100)}% corporate rate`
    } else {
      incomeTaxAmount = Math.round(netProfit * tc.smbRate)
      bracket = `${Math.round(tc.smbRate * 100)}% SMB rate`
    }
  }
  const incomeTaxDue = getNextIncomeTaxDue(tc.incomeTaxQuarters)

  const totalSetAside = vatAmount + incomeTaxAmount + turnoverTax
  const pctOfRevenue = revenue > 0 ? (totalSetAside / revenue) * 100 : 0

  return {
    vat: { amount: vatAmount, rate: Math.round(vatRate * 100), ...vatDue, name: tc.vatName },
    incomeTax: { amount: incomeTaxAmount, bracket, ...incomeTaxDue },
    turnoverTax: { amount: turnoverTax, rate: tc.turnoverTax?.rate ? tc.turnoverTax.rate * 100 : 0, applicable: turnoverApplicable },
    totalSetAside,
    pctOfRevenue,
  }
}

export default function TaxEstimator({ revenue, grossProfit, netProfit, currencySymbol: sym, countryCode, onAsk }: Props) {
  const [expanded, setExpanded] = useState(false)
  const tax = computeTax(revenue, netProfit, countryCode)
  const region = getRegionConfig(countryCode)
  const tc = region.taxConfig

  if (revenue === 0) return null

  const deadlineColor = (days: number) => days <= 7 ? '#EF4444' : days <= 14 ? '#F59E0B' : '#22C55E'

  return (
    <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#F59E0B' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>Tax & Compliance</span>
          <span style={{ fontSize: 10, color: 'var(--tx3)' }}>{region.countryName} ({tc.taxAuthorityShort})</span>
        </div>
        {onAsk && (
          <button
            onClick={() => onAsk(`My monthly revenue is ${fmt(revenue, sym)}, net profit ${fmt(netProfit, sym)}. Estimated tax set-aside is ${fmt(tax.totalSetAside, sym)} (${Math.round(tax.pctOfRevenue)}% of revenue). Am I setting aside enough? What tax optimizations are available for ${region.smbLabel}s?`)}
            style={{ fontSize: 10, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
          >
            Ask AI
          </button>
        )}
      </div>

      {/* Set-aside hero */}
      <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--b)', background: 'rgba(245,158,11,.03)' }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
          Set Aside This Month
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 24, fontWeight: 700, color: '#F59E0B', fontFamily: 'var(--font-sora, inherit)' }}>
            {fmt(tax.totalSetAside, sym)}
          </span>
          <span style={{ fontSize: 12, color: 'var(--tx3)' }}>
            ({Math.round(tax.pctOfRevenue)}% of revenue)
          </span>
        </div>
      </div>

      {/* Tax obligations table */}
      <div style={{ padding: '0' }}>
        <TaxRow
          label={`${tax.vat.name} (${tax.vat.rate}%)`}
          amount={tax.vat.amount}
          sym={sym}
          dueDate={tax.vat.due}
          daysUntil={tax.vat.daysUntil}
          deadlineColor={deadlineColor(tax.vat.daysUntil)}
          detail={`${tax.vat.rate}% on taxable supplies`}
        />
        <TaxRow
          label="Income Tax"
          amount={tax.incomeTax.amount}
          sym={sym}
          dueDate={tax.incomeTax.due}
          daysUntil={tax.incomeTax.daysUntil}
          deadlineColor={deadlineColor(tax.incomeTax.daysUntil)}
          detail={tax.incomeTax.bracket}
        />
        {tax.turnoverTax.applicable && (
          <TaxRow
            label={`Turnover Tax (${tax.turnoverTax.rate}%)`}
            amount={tax.turnoverTax.amount}
            sym={sym}
            dueDate={tax.vat.due}
            daysUntil={tax.vat.daysUntil}
            deadlineColor={deadlineColor(tax.vat.daysUntil)}
            detail={`${tax.turnoverTax.rate}% of gross turnover`}
          />
        )}
      </div>

      {/* Compliance section */}
      {tc.complianceSystem && (
        <div style={{ padding: '14px 18px', borderTop: '1px solid var(--b)', background: 'rgba(99,102,241,.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx)' }}>{tc.complianceSystem} Compliance</div>
            <button
              onClick={() => setExpanded(!expanded)}
              style={{ fontSize: 10, color: '#6366F1', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}
            >
              {expanded ? 'Hide details' : 'Learn more'}
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: expanded ? 10 : 0 }}>
            <span style={{ fontSize: 12 }}>&#9888;&#65039;</span>
            <span style={{ fontSize: 11, color: 'var(--tx2)', lineHeight: 1.5 }}>
              {tc.compliancePenalty}
            </span>
          </div>

          {expanded && tc.complianceItems && (
            <div style={{ fontSize: 11, color: 'var(--tx3)', lineHeight: 1.6, paddingTop: 8, borderTop: '1px solid var(--b)' }}>
              <div style={{ marginBottom: 8 }}>
                <strong style={{ color: 'var(--tx2)' }}>What you need:</strong>
              </div>
              <ul style={{ margin: 0, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {tc.complianceItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 8, background: 'rgba(34,197,94,.06)', border: '1px solid rgba(34,197,94,.15)' }}>
                <span style={{ fontSize: 10, color: '#22C55E', fontWeight: 600 }}>
                  Tip: {region.complianceTip}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filing calendar */}
      <div style={{ padding: '12px 18px', borderTop: '1px solid var(--b)' }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Upcoming Deadlines</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <DeadlineChip label={`${tax.vat.name} Return`} date={tax.vat.due} days={tax.vat.daysUntil} />
          <DeadlineChip label="Income Tax" date={tax.incomeTax.due} days={tax.incomeTax.daysUntil} />
          <DeadlineChip label="Annual Return" date={`${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][tc.annualReturnMonth]} ${new Date().getFullYear()}`} days={Math.ceil((new Date(new Date().getFullYear(), tc.annualReturnMonth, 30).getTime() - Date.now()) / 86400000)} />
        </div>
      </div>
    </div>
  )
}

function TaxRow({ label, amount, sym, dueDate, daysUntil, deadlineColor, detail }: {
  label: string; amount: number; sym: string; dueDate: string; daysUntil: number; deadlineColor: string; detail: string
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '12px 18px', borderBottom: '1px solid var(--b)' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)' }}>{label}</div>
        <div style={{ fontSize: 10, color: 'var(--tx3)' }}>{detail}</div>
      </div>
      <div style={{ textAlign: 'right', marginRight: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx)', fontVariantNumeric: 'tabular-nums' }}>{fmt(amount, sym)}</div>
      </div>
      <div style={{ textAlign: 'right', minWidth: 80 }}>
        <div style={{ fontSize: 10, color: 'var(--tx3)' }}>Due {dueDate}</div>
        <div style={{ fontSize: 10, fontWeight: 600, color: deadlineColor }}>
          {daysUntil <= 0 ? 'OVERDUE' : `${daysUntil} days`}
        </div>
      </div>
    </div>
  )
}

function DeadlineChip({ label, date, days }: { label: string; date: string; days: number }) {
  const color = days <= 7 ? '#EF4444' : days <= 14 ? '#F59E0B' : '#22C55E'
  const bg = days <= 7 ? 'rgba(239,68,68,.06)' : days <= 14 ? 'rgba(245,158,11,.06)' : 'rgba(34,197,94,.06)'
  const border = days <= 7 ? 'rgba(239,68,68,.15)' : days <= 14 ? 'rgba(245,158,11,.15)' : 'rgba(34,197,94,.15)'

  return (
    <div style={{ flex: 1, padding: '8px 10px', borderRadius: 8, background: bg, border: `1px solid ${border}`, textAlign: 'center' }}>
      <div style={{ fontSize: 10, fontWeight: 600, color }}>{label}</div>
      <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 2 }}>{date}</div>
      <div style={{ fontSize: 11, fontWeight: 700, color, marginTop: 2 }}>
        {days <= 0 ? 'OVERDUE' : `${days}d`}
      </div>
    </div>
  )
}
