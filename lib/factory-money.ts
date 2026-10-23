// Who owes the factory, and whom the factory owes — worked out from approved captures and recorded payments.
//
//   receivable = an approved dispatch with a price  : quantity × dispatch_price − payments received ('in')
//   payable    = an approved raw-material delivery with a purchase price (intake_price_per_kg)
//                                                    : quantity × price − payments made ('out')
//
// An item with no agreed due date falls due DEFAULT_TERMS_DAYS after approval. Aging uses the same four
// buckets as the CFO's receivables tracker so the two read the same.
//
// NOTE: identical copy lives in pos-askbiz/lib/factory-money.ts. Change both together.
import { DEFAULT_FACTORY_TZ, dayOfInZone } from '@/lib/factory-time'

export const DEFAULT_TERMS_DAYS = 14

export interface MoneyCapture {
  id: string
  type?: string | null
  status?: string | null
  location_id?: string | null
  party_id?: string | null
  product_name?: string | null
  quantity?: number | string | null
  dispatch_price?: number | string | null
  param_label?: string | null
  param_value?: number | string | null
  due_date?: string | null
  created_at?: string | null
  approved_at?: string | null
}
export interface MoneyPayment { capture_id: string; direction: string; amount: number | string; paid_at?: string | null }
export interface MoneyParty { id: string; name: string; phone?: string | null }

export type AgeBucket = 'current' | 'overdue_30' | 'overdue_60' | 'overdue_90'
export interface OpenItem {
  capture_id: string
  location_id: string | null
  party_id: string | null
  party_name: string
  product_name: string
  quantity: number
  value: number
  paid: number
  outstanding: number
  due_date: string
  days_overdue: number
  bucket: AgeBucket
}
export interface MoneyReport {
  receivables: OpenItem[]
  payables: OpenItem[]
  arTotal: number
  apTotal: number
  arOverdue: number
  apOverdue: number
  aging: Record<AgeBucket, number>
}

const num = (v: unknown) => Number(v) || 0
const r2 = (v: number) => Math.round(v * 100) / 100
const dayDiff = (a: string, b: string) => Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / 86_400_000)
const addDays = (day: string, n: number) => new Date(Date.parse(day + 'T00:00:00Z') + n * 86_400_000).toISOString().slice(0, 10)

export function bucketOf(daysOverdue: number): AgeBucket {
  if (daysOverdue <= 0) return 'current'
  if (daysOverdue <= 30) return 'overdue_30'
  if (daysOverdue <= 60) return 'overdue_60'
  return 'overdue_90'
}

export function computeMoney(
  captures: MoneyCapture[],
  payments: MoneyPayment[],
  parties: MoneyParty[],
  now: number = Date.now(),
  tz: string = DEFAULT_FACTORY_TZ,
): MoneyReport {
  const today = dayOfInZone(now, tz)
  const paidBy = new Map<string, number>()
  for (const p of payments) {
    const k = `${p.capture_id}|${p.direction}`
    paidBy.set(k, (paidBy.get(k) || 0) + num(p.amount))
  }
  const nameOf = new Map(parties.map(p => [p.id, p.name]))
  const receivables: OpenItem[] = []
  const payables: OpenItem[] = []

  for (const c of captures) {
    if (c.status !== 'approved') continue
    const qty = num(c.quantity)
    if (qty <= 0) continue
    let direction: 'in' | 'out' | null = null
    let unitPrice = 0
    if (c.type === 'dispatch') { direction = 'in'; unitPrice = num(c.dispatch_price) }
    else if (c.type === 'intake_arrival' && c.param_label === 'intake_price_per_kg') { direction = 'out'; unitPrice = num(c.param_value) }
    if (!direction || unitPrice <= 0) continue

    const value = qty * unitPrice
    const paid = paidBy.get(`${c.id}|${direction}`) || 0
    const outstanding = value - paid
    if (outstanding <= 0.005) continue

    const approvedDay = dayOfInZone(Date.parse(c.approved_at || c.created_at || new Date(now).toISOString()), tz)
    const due = c.due_date || addDays(approvedDay, DEFAULT_TERMS_DAYS)
    const daysOverdue = Math.max(0, dayDiff(due, today))
    const item: OpenItem = {
      capture_id: c.id, location_id: c.location_id || null, party_id: c.party_id || null,
      party_name: (c.party_id && nameOf.get(c.party_id)) || '',
      product_name: c.product_name || '', quantity: qty,
      value: r2(value), paid: r2(paid), outstanding: r2(outstanding),
      due_date: due, days_overdue: daysOverdue, bucket: bucketOf(daysOverdue),
    }
    ;(direction === 'in' ? receivables : payables).push(item)
  }

  const byDue = (a: OpenItem, b: OpenItem) => a.due_date.localeCompare(b.due_date)
  receivables.sort(byDue); payables.sort(byDue)
  const sum = (l: OpenItem[], f: (i: OpenItem) => boolean = () => true) => r2(l.filter(f).reduce((s, i) => s + i.outstanding, 0))
  const aging: Record<AgeBucket, number> = { current: 0, overdue_30: 0, overdue_60: 0, overdue_90: 0 }
  for (const i of receivables) aging[i.bucket] = r2(aging[i.bucket] + i.outstanding)
  return {
    receivables, payables,
    arTotal: sum(receivables), apTotal: sum(payables),
    arOverdue: sum(receivables, i => i.days_overdue > 0), apOverdue: sum(payables, i => i.days_overdue > 0),
    aging,
  }
}
