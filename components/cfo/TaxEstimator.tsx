'use client'
import { useState } from 'react'

interface TaxEstimate {
  vat: { amount: number; rate: number; due: string; daysUntil: number }
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
  onAsk?: (prompt: string) => void
}

function fmt(n: number, sym: string): string {
  if (Math.abs(n) >= 1_000_000) return `${sym}${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `${sym}${(n / 1_000).toFixed(0)}K`
  return `${sym}${Math.round(n).toLocaleString()}`
}

function getNextVatDue(): { due: string; daysUntil: number } {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()
  // VAT due by 20th of following month
  const dueDate = new Date(y, m + 1, 20)
  const daysUntil = Math.ceil((dueDate.getTime() - now.getTime()) / 86400000)
  return { due: dueDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }), daysUntil }
}

function getNextIncomeTaxDue(): { due: string; daysUntil: number } {
  const now = new Date()
  const y = now.getFullYear()
  // Income tax installments: 20th of 4th, 6th, 8th, 12th month of fiscal year
  // Simplify: next quarter end + 20 days
  const quarters = [
    new Date(y, 3, 20),  // April 20
    new Date(y, 5, 20),  // June 20
    new Date(y, 8, 20),  // September 20
    new Date(y, 11, 20), // December 20
  ]
  const next = quarters.find(d => d > now) || new Date(y + 1, 3, 20)
  const daysUntil = Math.ceil((next.getTime() - now.getTime()) / 86400000)
  return { due: next.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }), daysUntil }
}

function computeTax(revenue: number, netProfit: number): TaxEstimate {
  const sym = 'KSh'
  const annualRevenue = revenue * 12
  const annualProfit = netProfit * 12

  // VAT: 16% on taxable supplies (simplified — assume all revenue is taxable)
  const vatRate = 0.16
  const vatAmount = Math.round(revenue * vatRate)
  const vatDue = getNextVatDue()

  // Turnover Tax: 1.5% of gross if annual revenue KSh 1M-25M
  const turnoverApplicable = annualRevenue >= 1_000_000 && annualRevenue <= 25_000_000
  const turnoverTax = turnoverApplicable ? Math.round(revenue * 0.015) : 0

  // Income Tax (simplified corporate rate 30%, or individual brackets)
  // For SMBs, use 30% corporate rate on net profit
  let incomeTaxAmount = 0
  let bracket = ''
  if (annualProfit > 0) {
    if (annualRevenue > 25_000_000) {
      incomeTaxAmount = Math.round((netProfit * 0.30))
      bracket = '30% corporate rate'
    } else if (turnoverApplicable) {
      incomeTaxAmount = 0 // Turnover tax replaces income tax
      bracket = 'Covered by turnover tax'
    } else {
      incomeTaxAmount = Math.round(netProfit * 0.15)
      bracket = '15% (below KSh 1M threshold)'
    }
  }
  const incomeTaxDue = getNextIncomeTaxDue()

  const totalSetAside = vatAmount + incomeTaxAmount + turnoverTax
  const pctOfRevenue = revenue > 0 ? (totalSetAside / revenue) * 100 : 0

  return {
    vat: { amount: vatAmount, rate: 16, ...vatDue },
    incomeTax: { amount: incomeTaxAmount, bracket, ...incomeTaxDue },
    turnoverTax: { amount: turnoverTax, rate: 1.5, applicable: turnoverApplicable },
    totalSetAside,
    pctOfRevenue,
  }
}

export default function TaxEstimator({ revenue, grossProfit, netProfit, currencySymbol: sym, onAsk }: Props) {
  const [expanded, setExpanded] = useState(false)
  const tax = computeTax(revenue, netProfit)

  if (revenue === 0) return null

  const deadlineColor = (days: number) => days <= 7 ? '#EF4444' : days <= 14 ? '#F59E0B' : '#22C55E'

  return (
    <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#F59E0B' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>Tax & Compliance</span>
          <span style={{ fontSize: 10, color: 'var(--tx3)' }}>Kenya (KRA)</span>
        </div>
        {onAsk && (
          <button
            onClick={() => onAsk(`My monthly revenue is ${fmt(revenue, sym)}, net profit ${fmt(netProfit, sym)}. Estimated tax set-aside is ${fmt(tax.totalSetAside, sym)} (${Math.round(tax.pctOfRevenue)}% of revenue). Am I setting aside enough? What tax optimizations are available for Kenyan SMBs?`)}
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
          label="VAT (16%)"
          amount={tax.vat.amount}
          sym={sym}
          dueDate={tax.vat.due}
          daysUntil={tax.vat.daysUntil}
          deadlineColor={deadlineColor(tax.vat.daysUntil)}
          detail="16% on taxable supplies"
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
            label="Turnover Tax (1.5%)"
            amount={tax.turnoverTax.amount}
            sym={sym}
            dueDate={tax.vat.due}
            daysUntil={tax.vat.daysUntil}
            deadlineColor={deadlineColor(tax.vat.daysUntil)}
            detail="1.5% of gross turnover (KSh 1M-25M annual)"
          />
        )}
      </div>

      {/* eTIMS Compliance section */}
      <div style={{ padding: '14px 18px', borderTop: '1px solid var(--b)', background: 'rgba(99,102,241,.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx)' }}>eTIMS Compliance</div>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{ fontSize: 10, color: '#6366F1', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}
          >
            {expanded ? 'Hide details' : 'Learn more'}
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: expanded ? 10 : 0 }}>
          <span style={{ fontSize: 12 }}>⚠️</span>
          <span style={{ fontSize: 11, color: 'var(--tx2)', lineHeight: 1.5 }}>
            From Jan 2026, KRA auto-rejects expenses without valid eTIMS receipts. 25% penalty + 1% monthly interest on non-compliance.
          </span>
        </div>

        {expanded && (
          <div style={{ fontSize: 11, color: 'var(--tx3)', lineHeight: 1.6, paddingTop: 8, borderTop: '1px solid var(--b)' }}>
            <div style={{ marginBottom: 8 }}>
              <strong style={{ color: 'var(--tx2)' }}>What you need:</strong>
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li>Register on eTIMS (free via KRA portal)</li>
              <li>Issue electronic invoices for ALL sales — transmitted to KRA in real-time</li>
              <li>Every invoice must include: KRA PIN, QR code, item details, buyer PIN (for VAT claims)</li>
              <li>Keep eTIMS receipts for ALL business expenses (otherwise KRA rejects them)</li>
              <li>File monthly VAT returns by the 20th of the following month</li>
            </ul>
            <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 8, background: 'rgba(34,197,94,.06)', border: '1px solid rgba(34,197,94,.15)' }}>
              <span style={{ fontSize: 10, color: '#22C55E', fontWeight: 600 }}>
                Tip: Maintaining clean digital records improves your credit readiness score — lenders like Fuliza Biashara and KCB use transaction data to assess loans up to KES 3M+.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Filing calendar */}
      <div style={{ padding: '12px 18px', borderTop: '1px solid var(--b)' }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Upcoming Deadlines</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <DeadlineChip label="VAT Return" date={tax.vat.due} days={tax.vat.daysUntil} />
          <DeadlineChip label="Income Tax" date={tax.incomeTax.due} days={tax.incomeTax.daysUntil} />
          <DeadlineChip label="Annual Return" date={`30 Jun ${new Date().getFullYear()}`} days={Math.ceil((new Date(new Date().getFullYear(), 5, 30).getTime() - Date.now()) / 86400000)} />
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
