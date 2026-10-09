// What one investment has earned, owed and returned — pure maths, no I/O.
//
// Each investment type has its own rule; the caller supplies the business
// figures for the investment's scope (all / retail / factory) from
// invested_at to today. Nothing here ever sees another investor's deal.
export type InvestmentType = 'equity' | 'loan' | 'revenue_share' | 'profit_share' | 'fixed_return'

export interface InvestmentInput {
  type: InvestmentType
  amount: number
  invested_at: string // YYYY-MM-DD
  terms: Record<string, any>
}
export interface BusinessFigures {
  revenue: number      // since invested_at, for the investment's scope
  netProfit: number
  complete: boolean    // false when cost inputs are missing → profit may be overstated
}
export interface PaymentInput { paid_at: string; amount: number }

export type LineKind = 'money' | 'pct' | 'text' | 'count'
export interface ReturnLine { label: string; value: number | string; kind: LineKind }
export interface InvestorReturn {
  type: InvestmentType
  invested: number
  received: number          // actually paid to the investor so far
  earned: number            // accrued to the investor so far (may be negative for equity in a loss)
  owing: number             // earned but not yet paid (never negative)
  returnPct: number | null  // earned ÷ invested
  paidBackPct: number       // received ÷ invested
  lines: ReturnLine[]
  notes: string[]
}

const num = (v: unknown) => { const n = Number(v); return Number.isFinite(n) ? n : 0 }
const round2 = (n: number) => Math.round(n * 100) / 100

/** Whole calendar months from `from` to `to` (0 if `to` is earlier). */
export function monthsBetween(from: string, to: string): number {
  const a = new Date(from + 'T00:00:00Z'), b = new Date(to + 'T00:00:00Z')
  let m = (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + (b.getUTCMonth() - a.getUTCMonth())
  if (b.getUTCDate() < a.getUTCDate()) m -= 1
  return Math.max(0, m)
}

export function computeInvestorReturn(
  inv: InvestmentInput, biz: BusinessFigures, payments: PaymentInput[], today: string,
): InvestorReturn {
  const amount = num(inv.amount)
  const received = round2(payments.reduce((s, p) => s + num(p.amount), 0))
  const t = inv.terms || {}
  const notes: string[] = []
  const lines: ReturnLine[] = []
  let earned = 0
  let owing = 0

  if (!biz.complete) notes.push('Business cost rates are not fully set, so profit figures may be overstated.')

  switch (inv.type) {
    case 'equity': {
      const typed = num(t.equity_pct)
      const valuation = num(t.post_money_valuation)
      const pct = typed > 0 ? typed : valuation > 0 ? (amount / valuation) * 100 : 0
      if (pct <= 0) notes.push('Ownership is not set yet.')
      earned = round2((pct / 100) * biz.netProfit) // a loss share is shown as negative
      owing = round2(Math.max(0, earned - received))
      lines.push({ label: 'Ownership', value: round2(pct), kind: 'pct' })
      lines.push({ label: 'Your share of profit since you invested', value: earned, kind: 'money' })
      lines.push({ label: 'Paid out to you', value: received, kind: 'money' })
      lines.push({ label: 'Profit share not yet paid out', value: owing, kind: 'money' })
      if (earned < 0) notes.push('The business has made a loss since you invested, so your share is negative.')
      break
    }
    case 'loan': {
      const rate = num(t.rate_pct) / 100 / 12
      const n = Math.max(1, Math.round(num(t.term_months)))
      const pmt = rate > 0 ? (amount * rate) / (1 - Math.pow(1 + rate, -n)) : amount / n
      const k = Math.min(n, monthsBetween(inv.invested_at, today))
      const due = pmt * k
      const balance = rate > 0
        ? amount * Math.pow(1 + rate, k) - pmt * ((Math.pow(1 + rate, k) - 1) / rate)
        : amount - pmt * k
      const interestToDate = due - (amount - Math.max(0, balance))
      earned = round2(interestToDate)
      owing = round2(Math.max(0, due - received))
      lines.push({ label: 'Monthly repayment', value: round2(pmt), kind: 'money' })
      lines.push({ label: 'Repayments due so far', value: round2(due), kind: 'money' })
      lines.push({ label: 'Received', value: received, kind: 'money' })
      lines.push({ label: 'Overdue', value: owing, kind: 'money' })
      lines.push({ label: 'Balance on schedule', value: round2(Math.max(0, balance)), kind: 'money' })
      lines.push({ label: 'Interest earned to date', value: earned, kind: 'money' })
      lines.push({ label: 'Total interest over the term', value: round2(pmt * n - amount), kind: 'money' })
      if (owing > 0) notes.push('Repayments received are behind the schedule.')
      break
    }
    case 'revenue_share':
    case 'profit_share': {
      const pct = num(t.share_pct)
      const base = inv.type === 'revenue_share' ? Math.max(0, biz.revenue) : Math.max(0, biz.netProfit)
      const cap = num(t.cap_multiple) > 0 ? num(t.cap_multiple) * amount : null
      let accrued = (pct / 100) * base
      if (cap != null) accrued = Math.min(accrued, cap)
      earned = round2(accrued)
      owing = round2(Math.max(0, earned - received))
      lines.push({ label: inv.type === 'revenue_share' ? 'Share of revenue' : 'Share of profit', value: pct, kind: 'pct' })
      lines.push({ label: 'Earned since you invested', value: earned, kind: 'money' })
      lines.push({ label: 'Received', value: received, kind: 'money' })
      lines.push({ label: 'Owing to you', value: owing, kind: 'money' })
      if (cap != null) {
        lines.push({ label: 'Cap on total return', value: round2(cap), kind: 'money' })
        lines.push({ label: 'Progress to cap', value: round2(Math.min(100, (received / cap) * 100)), kind: 'pct' })
        if (earned >= cap) notes.push('The cap on your total return has been reached.')
      }
      if (pct <= 0) notes.push('Share is not set yet.')
      break
    }
    case 'fixed_return': {
      const every = t.every === 'year' ? 12 : t.every === 'quarter' ? 3 : 1
      const payout = num(t.payout) > 0 ? num(t.payout) : (num(t.annual_rate_pct) / 100) * amount * (every / 12)
      const periods = Math.floor(monthsBetween(inv.invested_at, today) / every)
      earned = round2(payout * periods)
      owing = round2(Math.max(0, earned - received))
      lines.push({ label: `Payout every ${t.every === 'year' ? 'year' : t.every === 'quarter' ? 'quarter' : 'month'}`, value: round2(payout), kind: 'money' })
      lines.push({ label: 'Payouts due so far', value: periods, kind: 'count' })
      lines.push({ label: 'Due to date', value: earned, kind: 'money' })
      lines.push({ label: 'Received', value: received, kind: 'money' })
      lines.push({ label: 'Owing to you', value: owing, kind: 'money' })
      if (payout <= 0) notes.push('Payout is not set yet.')
      break
    }
  }

  return {
    type: inv.type,
    invested: amount,
    received,
    earned,
    owing,
    returnPct: amount > 0 ? round2((earned / amount) * 100) : null,
    paidBackPct: amount > 0 ? round2((received / amount) * 100) : 0,
    lines,
    notes,
  }
}
