'use client'

import { useState } from 'react'
import { useLang } from '@/components/LanguageProvider'

interface Props {
  totals: { revenue: number; cogs: number; gross_profit: number; fixed_costs: number; net_profit: number; gross_margin_pct: number; net_margin_pct: number }
  cash: { balance: number; monthly_fixed: number; runway_months: number | null; daily_net_burn: number }
  receivablesSummary?: { total_receivables: number; total_payables: number; overdue_receivables: number }
  currencySymbol: string
  onAsk: (prompt: string) => void
}

const CARD: React.CSSProperties = { borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }
const GREEN = '#22C55E', RED = '#EF4444', INDIGO = '#6366F1', AMBER = '#F59E0B'

function fmt(n: number, sym: string): string {
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `${n < 0 ? '(' : ''}${sym}${(abs / 1_000_000).toFixed(1)}M${n < 0 ? ')' : ''}`
  if (abs >= 1_000) return `${n < 0 ? '(' : ''}${sym}${(abs / 1_000).toFixed(1)}K${n < 0 ? ')' : ''}`
  return `${n < 0 ? '(' : ''}${sym}${Math.round(abs).toLocaleString()}${n < 0 ? ')' : ''}`
}

interface FinancingOption {
  type: string
  description: string
  typicalRate: string
  typicalTerm: string
  bestFor: string
  requirements: string[]
  eligible: boolean
  estimatedAmount: number
  monthlyPayment: number
}

const buildOptions = (
  tc: (k: string, v?: Record<string, string | number>) => string,
  totals: Props['totals'],
  annualRevenue: number,
  maxDebtFromRevenue: number,
  maxInvoiceFinance: number,
  maxDebtFromIncome: number,
  receivables: number,
): FinancingOption[] => [
  {
    type: tc('cfo_financing.optionRevenueBasedType'),
    description: tc('cfo_financing.optionRevenueBasedDesc'),
    typicalRate: tc('cfo_financing.optionRevenueBasedRate'),
    typicalTerm: tc('cfo_financing.optionRevenueBasedTerm'),
    bestFor: tc('cfo_financing.optionRevenueBasedBestFor'),
    requirements: [
      tc('cfo_financing.reqRevenueBasedTrading'),
      tc('cfo_financing.reqRevenueBasedConsistent'),
      tc('cfo_financing.reqRevenueBasedDigital'),
    ],
    eligible: totals.revenue > 0 && annualRevenue > 50000,
    estimatedAmount: Math.round(maxDebtFromRevenue),
    monthlyPayment: Math.round(maxDebtFromRevenue * 0.12 / 12),
  },
  {
    type: tc('cfo_financing.optionInvoiceType'),
    description: tc('cfo_financing.optionInvoiceDesc'),
    typicalRate: tc('cfo_financing.optionInvoiceRate'),
    typicalTerm: tc('cfo_financing.optionInvoiceTerm'),
    bestFor: tc('cfo_financing.optionInvoiceBestFor'),
    requirements: [
      tc('cfo_financing.reqInvoiceOutstanding'),
      tc('cfo_financing.reqInvoiceCreditworthy'),
      tc('cfo_financing.reqInvoiceRecords'),
    ],
    eligible: receivables > 1000,
    estimatedAmount: Math.round(maxInvoiceFinance),
    monthlyPayment: Math.round(maxInvoiceFinance * 0.03),
  },
  {
    type: tc('cfo_financing.optionTermLoanType'),
    description: tc('cfo_financing.optionTermLoanDesc'),
    typicalRate: tc('cfo_financing.optionTermLoanRate'),
    typicalTerm: tc('cfo_financing.optionTermLoanTerm'),
    bestFor: tc('cfo_financing.optionTermLoanBestFor'),
    requirements: [
      tc('cfo_financing.reqTermLoanTrading'),
      tc('cfo_financing.reqTermLoanProfit'),
      tc('cfo_financing.reqTermLoanPlan'),
    ],
    eligible: totals.net_profit > 0 && annualRevenue > 100000,
    estimatedAmount: Math.round(maxDebtFromIncome),
    monthlyPayment: maxDebtFromIncome > 0 ? Math.round((maxDebtFromIncome * 0.01) * (Math.pow(1.01, 36)) / (Math.pow(1.01, 36) - 1)) : 0,
  },
  {
    type: tc('cfo_financing.optionOverdraftType'),
    description: tc('cfo_financing.optionOverdraftDesc'),
    typicalRate: tc('cfo_financing.optionOverdraftRate'),
    typicalTerm: tc('cfo_financing.optionOverdraftTerm'),
    bestFor: tc('cfo_financing.optionOverdraftBestFor'),
    requirements: [
      tc('cfo_financing.reqOverdraftAccount'),
      tc('cfo_financing.reqOverdraftDeposits'),
      tc('cfo_financing.reqOverdraftHistory'),
    ],
    eligible: totals.revenue > 0,
    estimatedAmount: Math.round(totals.revenue * 2),
    monthlyPayment: Math.round(totals.revenue * 2 * 0.015),
  },
  {
    type: tc('cfo_financing.optionAssetType'),
    description: tc('cfo_financing.optionAssetDesc'),
    typicalRate: tc('cfo_financing.optionAssetRate'),
    typicalTerm: tc('cfo_financing.optionAssetTerm'),
    bestFor: tc('cfo_financing.optionAssetBestFor'),
    requirements: [
      tc('cfo_financing.reqAssetQuote'),
      tc('cfo_financing.reqAssetHistory'),
      tc('cfo_financing.reqAssetDeposit'),
    ],
    eligible: totals.revenue > 0,
    estimatedAmount: Math.round(annualRevenue * 0.2),
    monthlyPayment: Math.round(annualRevenue * 0.2 * 0.085 / 12),
  },
]

export default function FinancingReadiness({ totals, cash, receivablesSummary, currencySymbol: sym, onAsk }: Props) {
  const { tc } = useLang()
  const [loanAmount, setLoanAmount] = useState<number | null>(null)
  const [termMonths, setTermMonths] = useState(24)

  const annualRevenue = totals.revenue * 12
  const annualNetProfit = totals.net_profit * 12
  const receivables = receivablesSummary?.total_receivables || 0
  const overdueReceivables = receivablesSummary?.overdue_receivables || 0

  // Borrowing capacity estimates
  const maxDebtFromIncome = Math.max(annualNetProfit * 0.4 * 3, 0) // 40% of net income x 3yr
  const maxDebtFromRevenue = annualRevenue * 0.15 // revenue-based: typically 15% annual revenue
  const maxInvoiceFinance = Math.max(receivables - overdueReceivables, 0) * 0.85 // 85% of non-overdue

  const amount = loanAmount || Math.round(Math.max(maxDebtFromIncome, maxDebtFromRevenue) / 1000) * 1000

  const options = buildOptions(tc, totals, annualRevenue, maxDebtFromRevenue, maxInvoiceFinance, maxDebtFromIncome, receivables)

  // Loan calculator
  const calcRate = 0.12 / 12 // 12% APR monthly
  const calcPayment = amount > 0 && termMonths > 0
    ? amount * calcRate * Math.pow(1 + calcRate, termMonths) / (Math.pow(1 + calcRate, termMonths) - 1)
    : 0
  const totalCost = calcPayment * termMonths
  const totalInterest = totalCost - amount
  const affordability = totals.net_profit > 0 ? (calcPayment / totals.net_profit) * 100 : 999

  return (
    <div style={CARD}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: INDIGO }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_financing.title')}</span>
        </div>
        <button onClick={() => onAsk(tc('cfo_financing.askAiPrompt', { revenue: fmt(totals.revenue, sym), netProfit: fmt(totals.net_profit, sym), cash: fmt(cash.balance, sym), receivables: fmt(receivables, sym), maxBorrow: fmt(Math.max(maxDebtFromIncome, maxDebtFromRevenue), sym) }))}
          style={{ fontSize: 9, color: INDIGO, background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}>
          {tc('cfo_financing.askAi')}
        </button>
      </div>

      <div style={{ padding: '16px 18px' }}>
        {/* Borrowing capacity */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--b)', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ padding: '10px 8px', background: 'var(--sf)', textAlign: 'center' }}>
            <div style={{ fontSize: 8, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: 3 }}>{tc('cfo_financing.capacityIncomeBased')}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: maxDebtFromIncome > 0 ? INDIGO : 'var(--tx3)', fontVariantNumeric: 'tabular-nums' }}>{fmt(maxDebtFromIncome, sym)}</div>
            <div style={{ fontSize: 8, color: 'var(--tx3)' }}>{tc('cfo_financing.capacityIncomeNote')}</div>
          </div>
          <div style={{ padding: '10px 8px', background: 'var(--sf)', textAlign: 'center' }}>
            <div style={{ fontSize: 8, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: 3 }}>{tc('cfo_financing.capacityRevenueBased')}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: INDIGO, fontVariantNumeric: 'tabular-nums' }}>{fmt(maxDebtFromRevenue, sym)}</div>
            <div style={{ fontSize: 8, color: 'var(--tx3)' }}>{tc('cfo_financing.capacityRevenueNote')}</div>
          </div>
          <div style={{ padding: '10px 8px', background: 'var(--sf)', textAlign: 'center' }}>
            <div style={{ fontSize: 8, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: 3 }}>{tc('cfo_financing.capacityInvoiceFinance')}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: maxInvoiceFinance > 0 ? INDIGO : 'var(--tx3)', fontVariantNumeric: 'tabular-nums' }}>{fmt(maxInvoiceFinance, sym)}</div>
            <div style={{ fontSize: 8, color: 'var(--tx3)' }}>{tc('cfo_financing.capacityInvoiceNote')}</div>
          </div>
        </div>

        {/* Quick loan calculator */}
        <div style={{ padding: 12, borderRadius: 8, border: '1px solid var(--b)', background: 'var(--ev, #f9f9f8)', marginBottom: 16 }}>
          <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx)', marginBottom: 10 }}>{tc('cfo_financing.calcTitle')}</div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: 'var(--tx3)', marginBottom: 3 }}>{tc('cfo_financing.calcAmountLabel', { sym })}</div>
              <input type="number" value={loanAmount || ''} placeholder={String(amount)}
                onChange={e => setLoanAmount(Number(e.target.value) || null)}
                style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid var(--b)', fontSize: 10, fontFamily: 'inherit', background: 'var(--sf)', color: 'var(--tx)', outline: 'none' }}
              />
            </div>
            <div>
              <div style={{ fontSize: 9, color: 'var(--tx3)', marginBottom: 3 }}>{tc('cfo_financing.calcTermLabel')}</div>
              <select value={termMonths} onChange={e => setTermMonths(Number(e.target.value))}
                style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid var(--b)', fontSize: 10, fontFamily: 'inherit', background: 'var(--sf)', color: 'var(--tx)' }}>
                {[6, 12, 24, 36, 48, 60].map(m => <option key={m} value={m}>{tc('cfo_financing.calcMonths', { n: m })}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: INDIGO, fontVariantNumeric: 'tabular-nums' }}>{fmt(calcPayment, sym)}</div>
              <div style={{ fontSize: 9, color: 'var(--tx3)' }}>{tc('cfo_financing.calcMonthlyPayment')}</div>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: AMBER, fontVariantNumeric: 'tabular-nums' }}>{fmt(totalInterest, sym)}</div>
              <div style={{ fontSize: 9, color: 'var(--tx3)' }}>{tc('cfo_financing.calcTotalInterest')}</div>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: affordability <= 30 ? GREEN : affordability <= 50 ? AMBER : RED, fontVariantNumeric: 'tabular-nums' }}>
                {affordability < 999 ? `${affordability.toFixed(0)}%` : '—'}
              </div>
              <div style={{ fontSize: 9, color: 'var(--tx3)' }}>{tc('cfo_financing.calcOfNetProfit')}</div>
            </div>
          </div>
          {affordability > 40 && affordability < 999 && (
            <div style={{ marginTop: 8, fontSize: 9, color: RED, fontWeight: 500, textAlign: 'center' }}>
              {tc('cfo_financing.calcAffordabilityWarning')}
            </div>
          )}
        </div>

        {/* Financing options */}
        <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{tc('cfo_financing.availableOptionsLabel')}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {options.map(opt => (
            <FinancingOptionCard key={opt.type} option={opt} sym={sym} />
          ))}
        </div>
      </div>
    </div>
  )
}

function FinancingOptionCard({ option: opt, sym }: { option: FinancingOption; sym: string }) {
  const { tc } = useLang()
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={{ borderRadius: 8, border: `1px solid ${opt.eligible ? 'var(--b)' : `${RED}20`}`, overflow: 'hidden', opacity: opt.eligible ? 1 : 0.6 }}>
      <button onClick={() => setExpanded(!expanded)}
        style={{ width: '100%', padding: '10px 12px', background: opt.eligible ? 'transparent' : `${RED}04`, border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx)' }}>{opt.type}</span>
            <span style={{ fontSize: 9, fontWeight: 600, padding: '1px 6px', borderRadius: 4,
              background: opt.eligible ? `${GREEN}10` : `${RED}10`,
              color: opt.eligible ? GREEN : RED }}>
              {opt.eligible ? tc('cfo_financing.eligible') : tc('cfo_financing.notEligible')}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {opt.eligible && (
              <span style={{ fontSize: 9, fontWeight: 700, color: INDIGO, fontVariantNumeric: 'tabular-nums' }}>
                {tc('cfo_financing.upTo')} {fmt(opt.estimatedAmount, sym)}
              </span>
            )}
            <span style={{ fontSize: 9, color: 'var(--tx3)', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}>▼</span>
          </div>
        </div>
      </button>
      {expanded && (
        <div style={{ padding: '0 12px 12px' }}>
          <div style={{ fontSize: 9, color: 'var(--tx3)', lineHeight: 1.5, marginBottom: 8 }}>{opt.description}</div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
            <div style={{ fontSize: 9 }}><span style={{ color: 'var(--tx3)' }}>{tc('cfo_financing.detailRate')}</span> <strong>{opt.typicalRate}</strong></div>
            <div style={{ fontSize: 9 }}><span style={{ color: 'var(--tx3)' }}>{tc('cfo_financing.detailTerm')}</span> <strong>{opt.typicalTerm}</strong></div>
            <div style={{ fontSize: 9 }}><span style={{ color: 'var(--tx3)' }}>{tc('cfo_financing.detailBestFor')}</span> <strong>{opt.bestFor}</strong></div>
          </div>
          <div style={{ fontSize: 9, color: 'var(--tx3)', marginBottom: 4 }}>{tc('cfo_financing.requirements')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {opt.requirements.map((r, i) => (
              <div key={i} style={{ fontSize: 9, color: 'var(--tx2)', paddingLeft: 8 }}>• {r}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
