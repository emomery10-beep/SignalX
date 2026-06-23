'use client'
import { useState } from 'react'
import { getRegionConfig } from '@/lib/region-config'
import { useLang } from '@/components/LanguageProvider'

type TcFn = (k: string, vars?: Record<string, string | number>) => string

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

function computeTax(revenue: number, netProfit: number, tc: TcFn, countryCode?: string | null): TaxEstimate {
  const region = getRegionConfig(countryCode)
  const cfg = region.taxConfig
  const annualRevenue = revenue * 12
  const annualProfit = netProfit * 12

  const vatRate = cfg.vatRate
  const vatAmount = Math.round(revenue * vatRate)
  const vatDue = getNextVatDue(cfg.vatDueDay)

  let turnoverApplicable = false
  let turnoverTax = 0
  if (cfg.turnoverTax) {
    turnoverApplicable = annualRevenue >= cfg.turnoverTax.minRevenue && annualRevenue <= cfg.turnoverTax.maxRevenue
    turnoverTax = turnoverApplicable ? Math.round(revenue * cfg.turnoverTax.rate) : 0
  }

  let incomeTaxAmount = 0
  let bracket = ''
  if (annualProfit > 0) {
    if (cfg.turnoverTax && turnoverApplicable) {
      incomeTaxAmount = 0
      bracket = tc('cfo_tax.bracket_covered_by_turnover')
    } else if (annualRevenue > (cfg.turnoverTax?.maxRevenue || cfg.smbThreshold || 0)) {
      incomeTaxAmount = Math.round(netProfit * cfg.corporateRate)
      bracket = tc('cfo_tax.bracket_corporate_rate', { rate: Math.round(cfg.corporateRate * 100) })
    } else {
      incomeTaxAmount = Math.round(netProfit * cfg.smbRate)
      bracket = tc('cfo_tax.bracket_smb_rate', { rate: Math.round(cfg.smbRate * 100) })
    }
  }
  const incomeTaxDue = getNextIncomeTaxDue(cfg.incomeTaxQuarters)

  const totalSetAside = vatAmount + incomeTaxAmount + turnoverTax
  const pctOfRevenue = revenue > 0 ? (totalSetAside / revenue) * 100 : 0

  return {
    vat: { amount: vatAmount, rate: Math.round(vatRate * 100), ...vatDue, name: cfg.vatName },
    incomeTax: { amount: incomeTaxAmount, bracket, ...incomeTaxDue },
    turnoverTax: { amount: turnoverTax, rate: cfg.turnoverTax?.rate ? cfg.turnoverTax.rate * 100 : 0, applicable: turnoverApplicable },
    totalSetAside,
    pctOfRevenue,
  }
}

export default function TaxEstimator({ revenue, grossProfit, netProfit, currencySymbol: sym, countryCode, onAsk }: Props) {
  const { tc } = useLang()
  const [expanded, setExpanded] = useState(false)
  const tax = computeTax(revenue, netProfit, tc, countryCode)
  const region = getRegionConfig(countryCode)
  const cfg = region.taxConfig

  if (revenue === 0) return null

  const deadlineColor = (days: number) => days <= 7 ? '#EF4444' : days <= 14 ? '#F59E0B' : '#22C55E'

  return (
    <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#F59E0B' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_tax.header_title')}</span>
          <span style={{ fontSize: 10, color: 'var(--tx3)' }}>{region.countryName} ({cfg.taxAuthorityShort})</span>
        </div>
        {onAsk && (
          <button
            onClick={() => onAsk(tc('cfo_tax.ask_prompt', { revenue: fmt(revenue, sym), netProfit: fmt(netProfit, sym), setAside: fmt(tax.totalSetAside, sym), pct: Math.round(tax.pctOfRevenue), smbLabel: region.smbLabel }))}
            style={{ fontSize: 10, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
          >
            {tc('cfo_tax.ask_ai')}
          </button>
        )}
      </div>

      {/* Set-aside hero */}
      <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--b)', background: 'rgba(245,158,11,.03)' }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
          {tc('cfo_tax.set_aside_this_month')}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 24, fontWeight: 700, color: '#F59E0B', fontFamily: 'var(--font-sora, inherit)' }}>
            {fmt(tax.totalSetAside, sym)}
          </span>
          <span style={{ fontSize: 12, color: 'var(--tx3)' }}>
            {tc('cfo_tax.pct_of_revenue', { pct: Math.round(tax.pctOfRevenue) })}
          </span>
        </div>
      </div>

      {/* Tax obligations table */}
      <div style={{ padding: '0' }}>
        <TaxRow
          label={tc('cfo_tax.vat_with_rate', { name: tax.vat.name, rate: tax.vat.rate })}
          amount={tax.vat.amount}
          sym={sym}
          dueDate={tax.vat.due}
          daysUntil={tax.vat.daysUntil}
          deadlineColor={deadlineColor(tax.vat.daysUntil)}
          detail={tc('cfo_tax.vat_detail', { rate: tax.vat.rate })}
          tc={tc}
        />
        <TaxRow
          label={tc('cfo_tax.income_tax')}
          amount={tax.incomeTax.amount}
          sym={sym}
          dueDate={tax.incomeTax.due}
          daysUntil={tax.incomeTax.daysUntil}
          deadlineColor={deadlineColor(tax.incomeTax.daysUntil)}
          detail={tax.incomeTax.bracket}
          tc={tc}
        />
        {tax.turnoverTax.applicable && (
          <TaxRow
            label={tc('cfo_tax.turnover_tax', { rate: tax.turnoverTax.rate })}
            amount={tax.turnoverTax.amount}
            sym={sym}
            dueDate={tax.vat.due}
            daysUntil={tax.vat.daysUntil}
            deadlineColor={deadlineColor(tax.vat.daysUntil)}
            detail={tc('cfo_tax.turnover_detail', { rate: tax.turnoverTax.rate })}
            tc={tc}
          />
        )}
      </div>

      {/* Compliance section */}
      {cfg.complianceSystem && (
        <div style={{ padding: '14px 18px', borderTop: '1px solid var(--b)', background: 'rgba(99,102,241,.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_tax.compliance_title', { system: cfg.complianceSystem })}</div>
            <button
              onClick={() => setExpanded(!expanded)}
              style={{ fontSize: 10, color: '#6366F1', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}
            >
              {expanded ? tc('cfo_tax.hide_details') : tc('cfo_tax.learn_more')}
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: expanded ? 10 : 0 }}>
            <span style={{ fontSize: 12 }}>&#9888;&#65039;</span>
            <span style={{ fontSize: 11, color: 'var(--tx2)', lineHeight: 1.5 }}>
              {cfg.compliancePenalty}
            </span>
          </div>

          {expanded && cfg.complianceItems && (
            <div style={{ fontSize: 11, color: 'var(--tx3)', lineHeight: 1.6, paddingTop: 8, borderTop: '1px solid var(--b)' }}>
              <div style={{ marginBottom: 8 }}>
                <strong style={{ color: 'var(--tx2)' }}>{tc('cfo_tax.what_you_need')}</strong>
              </div>
              <ul style={{ margin: 0, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {cfg.complianceItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 8, background: 'rgba(34,197,94,.06)', border: '1px solid rgba(34,197,94,.15)' }}>
                <span style={{ fontSize: 10, color: '#22C55E', fontWeight: 600 }}>
                  {tc('cfo_tax.tip_prefix', { tip: region.complianceTip })}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Proactive tax-saving suggestions */}
      <div style={{ padding: '14px 18px', borderTop: '1px solid var(--b)' }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{tc('cfo_tax.opportunities_title')}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {netProfit > 0 && tax.incomeTax.amount > 0 && (
            <TaxSavingTip
              title={tc('cfo_tax.tip_pension_title')}
              saving={fmt(Math.min(netProfit * 0.15, tax.incomeTax.amount * 0.3), sym)}
              description={tc('cfo_tax.tip_pension_desc', { pension: cfg.pensionName || tc('cfo_tax.default_pension_scheme'), pct: cfg.pensionMaxPct || 15 })}
              color="#22C55E"
              tc={tc}
            />
          )}
          {revenue > 50000 && !cfg.turnoverTax?.applicable && (
            <TaxSavingTip
              title={tc('cfo_tax.tip_capital_title')}
              saving={fmt(Math.round(revenue * 0.02 * (cfg.smbRate || 0.19)), sym)}
              description={tc('cfo_tax.tip_capital_desc')}
              color="#22C55E"
              tc={tc}
            />
          )}
          {grossProfit > 0 && cfg.vatRate > 0 && (
            <TaxSavingTip
              title={tc('cfo_tax.tip_input_credits_title', { name: cfg.vatName })}
              saving={fmt(Math.round(grossProfit * 0.03 * cfg.vatRate), sym)}
              description={tc('cfo_tax.tip_input_credits_desc', { name: cfg.vatName })}
              color="#6366F1"
              tc={tc}
            />
          )}
          {tax.turnoverTax.applicable && netProfit > revenue * 0.1 && (
            <TaxSavingTip
              title={tc('cfo_tax.tip_opt_income_title')}
              saving={fmt(Math.max(0, tax.turnoverTax.amount - Math.round(netProfit * cfg.smbRate)), sym)}
              description={tc('cfo_tax.tip_opt_income_desc', { margin: Math.round((netProfit / revenue) * 100), rate: tax.turnoverTax.rate })}
              color="#F59E0B"
              tc={tc}
            />
          )}
          {netProfit > 0 && (
            <TaxSavingTip
              title={tc('cfo_tax.tip_timing_title')}
              saving={fmt(Math.round(netProfit * 0.05 * (cfg.smbRate || 0.19)), sym)}
              description={tc('cfo_tax.tip_timing_desc')}
              color="#6366F1"
              tc={tc}
            />
          )}
        </div>
      </div>

      {/* Filing calendar */}
      <div style={{ padding: '12px 18px', borderTop: '1px solid var(--b)' }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{tc('cfo_tax.upcoming_deadlines')}</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <DeadlineChip label={tc('cfo_tax.vat_return', { name: tax.vat.name })} date={tax.vat.due} days={tax.vat.daysUntil} tc={tc} />
          <DeadlineChip label={tc('cfo_tax.income_tax')} date={tax.incomeTax.due} days={tax.incomeTax.daysUntil} tc={tc} />
          <DeadlineChip label={tc('cfo_tax.annual_return')} date={`${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][cfg.annualReturnMonth]} ${new Date().getFullYear()}`} days={Math.ceil((new Date(new Date().getFullYear(), cfg.annualReturnMonth, 30).getTime() - Date.now()) / 86400000)} tc={tc} />
        </div>
      </div>
    </div>
  )
}

function TaxRow({ label, amount, sym, dueDate, daysUntil, deadlineColor, detail, tc }: {
  label: string; amount: number; sym: string; dueDate: string; daysUntil: number; deadlineColor: string; detail: string; tc: TcFn
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
        <div style={{ fontSize: 10, color: 'var(--tx3)' }}>{tc('cfo_tax.due_date', { date: dueDate })}</div>
        <div style={{ fontSize: 10, fontWeight: 600, color: deadlineColor }}>
          {daysUntil <= 0 ? tc('cfo_tax.overdue') : tc('cfo_tax.days_until', { days: daysUntil })}
        </div>
      </div>
    </div>
  )
}

function DeadlineChip({ label, date, days, tc }: { label: string; date: string; days: number; tc: TcFn }) {
  const color = days <= 7 ? '#EF4444' : days <= 14 ? '#F59E0B' : '#22C55E'
  const bg = days <= 7 ? 'rgba(239,68,68,.06)' : days <= 14 ? 'rgba(245,158,11,.06)' : 'rgba(34,197,94,.06)'
  const border = days <= 7 ? 'rgba(239,68,68,.15)' : days <= 14 ? 'rgba(245,158,11,.15)' : 'rgba(34,197,94,.15)'

  return (
    <div style={{ flex: 1, padding: '8px 10px', borderRadius: 8, background: bg, border: `1px solid ${border}`, textAlign: 'center' }}>
      <div style={{ fontSize: 10, fontWeight: 600, color }}>{label}</div>
      <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 2 }}>{date}</div>
      <div style={{ fontSize: 11, fontWeight: 700, color, marginTop: 2 }}>
        {days <= 0 ? tc('cfo_tax.overdue') : tc('cfo_tax.days_short', { days })}
      </div>
    </div>
  )
}

function TaxSavingTip({ title, saving, description, color, tc }: { title: string; saving: string; description: string; color: string; tc: TcFn }) {
  return (
    <div style={{ padding: '10px 12px', borderRadius: 8, border: `1px solid ${color}20`, background: `${color}06` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx)' }}>{title}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color, fontVariantNumeric: 'tabular-nums' }}>{tc('cfo_tax.save_approx', { amount: saving })}</span>
      </div>
      <div style={{ fontSize: 10, color: 'var(--tx3)', lineHeight: 1.4 }}>{description}</div>
    </div>
  )
}
