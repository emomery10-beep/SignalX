// Validation for investment terms. Returns cleaned terms or an error message —
// never trust the raw JSON from the client.
import type { InvestmentType } from '@/lib/investor-returns'

export const INVESTMENT_TYPES: InvestmentType[] = ['equity', 'loan', 'revenue_share', 'profit_share', 'fixed_return']

const n = (v: unknown) => { const x = Number(v); return Number.isFinite(x) ? x : NaN }
type Result = { ok: true; terms: Record<string, number | string> } | { ok: false; error: string }

export function validateTerms(type: string, raw: any): Result {
  const t = raw && typeof raw === 'object' ? raw : {}
  switch (type) {
    case 'equity': {
      const pct = t.equity_pct === undefined || t.equity_pct === '' || t.equity_pct === null ? 0 : n(t.equity_pct)
      const val = t.post_money_valuation === undefined || t.post_money_valuation === '' || t.post_money_valuation === null ? 0 : n(t.post_money_valuation)
      if (!(pct >= 0 && pct <= 100) || !(val >= 0)) return { ok: false, error: 'Enter a valid ownership % (0–100) or valuation' }
      if (pct === 0 && val === 0) return { ok: false, error: 'Enter either the ownership % or the company valuation' }
      return { ok: true, terms: pct > 0 ? (val > 0 ? { equity_pct: pct, post_money_valuation: val } : { equity_pct: pct }) : { post_money_valuation: val } }
    }
    case 'loan': {
      const rate = n(t.rate_pct), term = n(t.term_months)
      if (!(rate >= 0 && rate <= 100)) return { ok: false, error: 'Interest rate must be between 0 and 100%' }
      if (!(term >= 1 && term <= 600)) return { ok: false, error: 'Term must be 1–600 months' }
      return { ok: true, terms: { rate_pct: rate, term_months: Math.round(term) } }
    }
    case 'revenue_share':
    case 'profit_share': {
      const pct = n(t.share_pct)
      if (!(pct > 0 && pct <= 100)) return { ok: false, error: 'Share must be above 0 and at most 100%' }
      const out: Record<string, number> = { share_pct: pct }
      if (t.cap_multiple !== undefined && t.cap_multiple !== '' && t.cap_multiple !== null) {
        const cap = n(t.cap_multiple)
        if (!(cap > 0 && cap <= 100)) return { ok: false, error: 'Cap must be a multiple of the amount, e.g. 1.5' }
        out.cap_multiple = cap
      }
      return { ok: true, terms: out }
    }
    case 'fixed_return': {
      const every = t.every
      if (!['month', 'quarter', 'year'].includes(every)) return { ok: false, error: 'Choose month, quarter or year' }
      const payout = t.payout === undefined || t.payout === '' || t.payout === null ? 0 : n(t.payout)
      const rate = t.annual_rate_pct === undefined || t.annual_rate_pct === '' || t.annual_rate_pct === null ? 0 : n(t.annual_rate_pct)
      if (!(payout >= 0) || !(rate >= 0 && rate <= 1000) || (payout === 0 && rate === 0)) return { ok: false, error: 'Enter a payout amount or an annual rate' }
      return { ok: true, terms: payout > 0 ? { every, payout } : { every, annual_rate_pct: rate } }
    }
    default:
      return { ok: false, error: 'Unknown investment type' }
  }
}
