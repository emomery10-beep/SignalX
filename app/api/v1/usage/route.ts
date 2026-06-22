import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Last 30 days of usage grouped by day
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const { data: usage } = await supabase
    .from('api_usage')
    .select('created_at, status, latency_ms, key_id, question')
    .eq('user_id', user.id)
    .gte('created_at', thirtyDaysAgo)
    .order('created_at', { ascending: false })
    .limit(500)

  const { data: keys } = await supabase
    .from('api_keys')
    .select('id, name, requests_month, request_limit_month, plan')
    .eq('user_id', user.id)

  // Group by day for chart
  const byDay: Record<string, number> = {}
  ;(usage || []).forEach(row => {
    const day = row.created_at?.slice(0, 10)
    if (!day) return
    byDay[day] = (byDay[day] || 0) + 1
  })

  const avgLatency = usage?.length
    ? Math.round((usage || []).reduce((s, r) => s + (r.latency_ms || 0), 0) / usage.length)
    : 0

  const errorRate = usage?.length
    ? Math.round(((usage || []).filter(r => (r.status ?? 0) >= 400).length / usage.length) * 100)
    : 0

  return NextResponse.json({
    summary: {
      total_requests_month: (keys || []).reduce((s, k) => s + k.requests_month, 0),
      avg_latency_ms:       avgLatency,
      error_rate_pct:       errorRate,
      active_keys:          (keys || []).filter(k => true).length,
    },
    by_day:   byDay,
    keys:     keys || [],
    recent:   (usage || []).slice(0, 20),
  })
}
