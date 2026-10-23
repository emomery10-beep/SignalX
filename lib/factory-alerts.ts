// What a factory owner should hear about each morning, in a few plain lines: approvals stuck waiting, money
// that is late, and a quiet factory. Built from the same records the Factory screens and the CFO use. Added to
// the daily WhatsApp brief (app/api/cron/daily-brief) — it sends nothing for an owner with no factory, and
// nothing when there is nothing to say, so the message stays worth reading.
import { computeMoney, type MoneyReport } from '@/lib/factory-money'
import { dayOfInZone, factoryTimeZone } from '@/lib/factory-time'

export interface AlertInput {
  symbol: string
  pending: { type: string | null; created_at: string }[]
  /** Entries logged per factory day over the last week (key = YYYY-MM-DD), approved or pending. */
  activityByDay: Record<string, number>
  yesterday: string
  today: string
  money: MoneyReport | null
  now: number
}

const fmt = (symbol: string, n: number) => `${symbol}${Math.round(n).toLocaleString('en-US')}`

export function buildFactoryLines(i: AlertInput): string[] {
  const lines: string[] = []

  const old = i.pending.filter(p => i.now - Date.parse(p.created_at) > 24 * 3600 * 1000)
  if (i.pending.length > 0) {
    const dispatches = i.pending.filter(p => p.type === 'dispatch').length
    lines.push(
      `⏳ ${i.pending.length} capture${i.pending.length === 1 ? '' : 's'} waiting for approval` +
      (old.length > 0 ? ` (${old.length} for over a day)` : '') +
      (dispatches > 0 ? `, ${dispatches} of them dispatch${dispatches === 1 ? '' : 'es'} that need a price` : '') + '.',
    )
  }

  const m = i.money
  if (m && m.arOverdue > 0) {
    const late = m.receivables.filter(r => r.days_overdue > 0)
    const byParty = new Map<string, { name: string; amt: number; days: number }>()
    for (const r of late) {
      const k = r.party_id || r.capture_id
      const e = byParty.get(k) || { name: r.party_name || 'a customer', amt: 0, days: 0 }
      e.amt += r.outstanding; e.days = Math.max(e.days, r.days_overdue)
      byParty.set(k, e)
    }
    const top = [...byParty.values()].sort((a, b) => b.amt - a.amt)[0]
    lines.push(`💰 Customers owe you ${fmt(i.symbol, m.arTotal)}, ${fmt(i.symbol, m.arOverdue)} of it late. Biggest: ${top.name} ${fmt(i.symbol, top.amt)} (${top.days} days late).`)
  }
  if (m && m.apOverdue > 0) lines.push(`🧾 You owe suppliers ${fmt(i.symbol, m.apTotal)}, ${fmt(i.symbol, m.apOverdue)} of it overdue.`)

  // A quiet factory: nothing logged yesterday although the previous days were busy. Skip the weekly rest day.
  const before = Object.entries(i.activityByDay).filter(([d]) => d < i.yesterday)
  const busyDays = before.filter(([, n]) => n > 0)
  const yesterdayIsSunday = new Date(i.yesterday + 'T00:00:00Z').getUTCDay() === 0
  if (busyDays.length >= 3 && (i.activityByDay[i.yesterday] || 0) === 0 && !yesterdayIsSunday) {
    const avg = Math.round(busyDays.reduce((s, [, n]) => s + n, 0) / busyDays.length)
    lines.push(`⚠️ Nothing was logged at the factory yesterday (a usual day has about ${avg} entries).`)
  }
  return lines
}

/** Fetches what the lines need for one owner and builds them. [] when the owner has no factory or nothing to report. */
export async function factoryBriefLines(svc: any, ownerId: string, symbol: string, countryCode: string | null, now: number = Date.now()): Promise<string[]> {
  try {
    const { data: locs } = await svc.from('pos_locations').select('id').eq('owner_id', ownerId).eq('kind', 'factory').eq('is_active', true)
    if (!locs || locs.length === 0) return []
    const ids = (locs as any[]).map(l => l.id)
    const tz = factoryTimeZone(countryCode)
    const today = dayOfInZone(now, tz)
    const yesterday = dayOfInZone(now - 24 * 3600 * 1000, tz)
    const weekAgo = new Date(now - 8 * 24 * 3600 * 1000).toISOString()

    const [pendingQ, recentQ, moneyCapQ, payQ, partyQ] = await Promise.all([
      svc.from('pos_factory_captures').select('type, created_at').eq('owner_id', ownerId).eq('status', 'pending').in('location_id', ids).limit(2000),
      svc.from('pos_factory_captures').select('created_at').eq('owner_id', ownerId).in('location_id', ids).gte('created_at', weekAgo).neq('status', 'rejected').limit(5000),
      svc.from('pos_factory_captures')
        .select('id, type, status, location_id, party_id, product_name, quantity, dispatch_price, param_label, param_value, due_date, created_at, approved_at')
        .eq('owner_id', ownerId).eq('status', 'approved').in('type', ['dispatch', 'intake_arrival']).in('location_id', ids).limit(20000),
      svc.from('pos_factory_payments').select('capture_id, direction, amount, paid_at').eq('owner_id', ownerId).limit(50000),
      svc.from('pos_factory_parties').select('id, name, phone').eq('owner_id', ownerId),
    ])
    const activityByDay: Record<string, number> = {}
    for (const r of (recentQ.data || []) as any[]) {
      const d = dayOfInZone(Date.parse(r.created_at), tz)
      activityByDay[d] = (activityByDay[d] || 0) + 1
    }
    // The money tables exist only after migration 20261024000001; without them skip the money lines.
    const money = !moneyCapQ.error && !payQ.error
      ? computeMoney((moneyCapQ.data || []) as any[], (payQ.data || []) as any[], (partyQ.data || []) as any[], now, tz)
      : null
    return buildFactoryLines({ symbol, pending: (pendingQ.data || []) as any[], activityByDay, yesterday, today, money, now })
  } catch (e) {
    console.error('[factory-alerts] failed for', ownerId, e)
    return []
  }
}
