// ============================================================
// /api/social — Social Commerce Intelligence API
// GET: fetch aggregated social signals for the user
// (Syncing itself happens in lib/sync/engine.ts runSync — the sole sync path
// for all connected sources, triggered on connect and via the sync cron.)
// ============================================================
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// ── GET — fetch social intelligence summary ───────────────────
export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  // Fetch social signals for last 30 days
  const { data: signals } = await supabase
    .from('social_signals')
    .select('*')
    .eq('user_id', user.id)
    .gte('record_date', since)
    .order('saves', { ascending: false })

  // Fetch connected social sources
  const { data: sources } = await supabase
    .from('connected_sources')
    .select('source_type, name, status, last_synced_at')
    .eq('user_id', user.id)
    .in('source_type', ['tiktok_shop', 'instagram', 'pinterest'])

  if (!signals || signals.length === 0) {
    return NextResponse.json({
      connected_sources: sources || [],
      has_data: false,
      summary: null,
      top_content: [],
      demand_signals: [],
      platform_breakdown: [],
    })
  }

  // ── Aggregate by platform ─────────────────────────────────────
  const platformMap = new Map<string, {
    views: number; saves: number; clicks: number
    orders: number; revenue: number; posts: number
    engagement: number[]
  }>()

  for (const s of signals) {
    const p = s.platform
    if (!platformMap.has(p)) platformMap.set(p, { views: 0, saves: 0, clicks: 0, orders: 0, revenue: 0, posts: 0, engagement: [] })
    const pm = platformMap.get(p)!
    pm.views   += s.views || 0
    pm.saves   += s.saves || 0
    pm.clicks  += s.clicks || 0
    pm.orders  += s.orders || 0
    pm.revenue += s.gross_revenue || 0
    pm.posts   += 1
    if (s.engagement_rate > 0) pm.engagement.push(s.engagement_rate)
  }

  const platform_breakdown = Array.from(platformMap.entries()).map(([platform, d]) => ({
    platform,
    views:           d.views,
    saves:           d.saves,
    clicks:          d.clicks,
    orders:          d.orders,
    revenue:         Math.round(d.revenue * 100) / 100,
    posts:           d.posts,
    avg_engagement:  d.engagement.length > 0
      ? Math.round(d.engagement.reduce((a, b) => a + b, 0) / d.engagement.length * 1000) / 10
      : 0,
    conversion_rate: d.clicks > 0 ? Math.round((d.orders / d.clicks) * 1000) / 10 : 0,
  }))

  // ── Overall summary ────────────────────────────────────────────
  const totalViews   = signals.reduce((s, r) => s + (r.views || 0), 0)
  const totalSaves   = signals.reduce((s, r) => s + (r.saves || 0), 0)
  const totalOrders  = signals.reduce((s, r) => s + (r.orders || 0), 0)
  const totalRevenue = signals.reduce((s, r) => s + (r.gross_revenue || 0), 0)
  const totalClicks  = signals.reduce((s, r) => s + (r.clicks || 0), 0)

  const summary = {
    total_views:      totalViews,
    total_saves:      totalSaves,
    total_orders:     totalOrders,
    total_revenue:    Math.round(totalRevenue * 100) / 100,
    total_clicks:     totalClicks,
    overall_conversion_rate: totalClicks > 0 ? Math.round((totalOrders / totalClicks) * 1000) / 10 : 0,
    avg_save_rate:    totalViews > 0 ? Math.round((totalSaves / totalViews) * 1000) / 10 : 0,
    period_days:      30,
  }

  // ── Top performing content ─────────────────────────────────────
  const top_content = signals
    .sort((a, b) => (b.gross_revenue || 0) - (a.gross_revenue || 0) || (b.saves || 0) - (a.saves || 0))
    .slice(0, 10)
    .map(s => ({
      content_id:      s.content_id,
      content_type:    s.content_type,
      platform:        s.platform,
      product_name:    s.product_name,
      sku:             s.sku,
      views:           s.views,
      saves:           s.saves,
      orders:          s.orders,
      revenue:         s.gross_revenue,
      conversion_rate: s.conversion_rate,
      save_rate:       s.save_rate,
      viral_score:     s.viral_score,
      record_date:     s.record_date,
    }))

  // ── Demand signals — high saves, low orders (future purchase intent) ───────
  const demand_signals = signals
    .filter(s => (s.saves || 0) > 20 && (s.orders || 0) === 0)
    .sort((a, b) => (b.saves || 0) - (a.saves || 0))
    .slice(0, 5)
    .map(s => ({
      platform:     s.platform,
      product_name: s.product_name || 'Unknown product',
      saves:        s.saves,
      views:        s.views,
      save_rate:    s.save_rate,
      signal:       `${s.saves} saves but 0 orders — strong future purchase intent. Check stock levels.`,
      record_date:  s.record_date,
    }))

  return NextResponse.json({
    connected_sources: sources || [],
    has_data: true,
    summary,
    top_content,
    demand_signals,
    platform_breakdown,
  })
}
