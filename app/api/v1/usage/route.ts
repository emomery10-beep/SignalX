import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // api_usage only grants RLS SELECT to service_role (20260613_api_usage_log.sql
  // never added a user-facing policy) — the session client below would
  // silently return an empty set for every real user. Reads here use the
  // service client instead, explicitly scoped by user_id/key_id, same
  // trusted-server-side pattern already used in lib/api-v1-auth.ts.
  const service = createServiceClient()

  // Last 30 days of usage grouped by day
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const { data: usage } = await service
    .from('api_usage')
    .select('created_at, status, latency_ms, key_id, question')
    .eq('user_id', user.id)
    .gte('created_at', thirtyDaysAgo)
    .order('created_at', { ascending: false })
    .limit(500)

  const { data: keys } = await service
    .from('api_keys')
    .select('id, name, requests_month, request_limit_month, plan, credit_balance_cents, low_balance_threshold_cents')
    .eq('user_id', user.id)

  type KeyRow = { id: string; name: string; requests_month: number; request_limit_month: number; plan: string; credit_balance_cents: number; low_balance_threshold_cents: number }
  type UsageRow = { created_at: string; status: number | null; latency_ms: number | null; key_id: string; question?: string }
  type TransactionRow = { type: string; amount_cents: number; endpoint: string | null; created_at: string }

  const keyRows = (keys || []) as KeyRow[]
  const usageRows = (usage || []) as UsageRow[]

  const keyIds = keyRows.map((k: KeyRow) => k.id)
  const { data: transactionsData } = keyIds.length
    ? await service
        .from('api_credit_transactions')
        .select('type, amount_cents, endpoint, created_at')
        .in('key_id', keyIds)
        .gte('created_at', thirtyDaysAgo)
        .order('created_at', { ascending: false })
        .limit(200)
    : { data: [] as TransactionRow[] }
  const transactions = (transactionsData || []) as TransactionRow[]

  const totalSpentCents = transactions
    .filter((t: TransactionRow) => t.type === 'debit')
    .reduce((sum: number, t: TransactionRow) => sum + Math.abs(t.amount_cents), 0)

  const spendByEndpoint: Record<string, number> = {}
  transactions.forEach((t: TransactionRow) => {
    if (t.type !== 'debit' || !t.endpoint) return
    spendByEndpoint[t.endpoint] = (spendByEndpoint[t.endpoint] || 0) + Math.abs(t.amount_cents)
  })

  // Group by day for chart
  const byDay: Record<string, number> = {}
  usageRows.forEach((row: UsageRow) => {
    const day = row.created_at?.slice(0, 10)
    if (!day) return
    byDay[day] = (byDay[day] || 0) + 1
  })

  const avgLatency = usageRows.length
    ? Math.round(usageRows.reduce((s: number, r: UsageRow) => s + (r.latency_ms || 0), 0) / usageRows.length)
    : 0

  const errorRate = usageRows.length
    ? Math.round((usageRows.filter((r: UsageRow) => (r.status ?? 0) >= 400).length / usageRows.length) * 100)
    : 0

  return NextResponse.json({
    summary: {
      total_requests_month: keyRows.reduce((s: number, k: KeyRow) => s + k.requests_month, 0),
      avg_latency_ms:       avgLatency,
      error_rate_pct:       errorRate,
      active_keys:          keyRows.length,
      total_spent_cents:    totalSpentCents,
    },
    by_day:            byDay,
    spend_by_endpoint: spendByEndpoint,
    keys:              keyRows,
    recent:            usageRows.slice(0, 20),
    recent_transactions: transactions,
  })
}
