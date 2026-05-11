// ============================================================
// /api/social — Social Commerce Intelligence API
// GET: fetch aggregated social signals for the user
// POST: trigger a manual sync of social data
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  fetchTikTokShopOrders, fetchTikTokShopAnalytics,
  fetchInstagramInsights, fetchInstagramShoppingOrders,
  fetchPinterestPinAnalytics,
} from '@/lib/connectors/social'
import {
  normaliseTikTokOrders, normaliseTikTokAnalytics,
  normaliseInstagramOrders, normaliseInstagramInsights,
  normalisePinterestAnalytics,
  type SocialSignalRecord,
} from '@/lib/sync/social-normaliser'

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

// ── POST — trigger social data sync ──────────────────────────
export async function POST() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Get connected social sources
  const { data: sources } = await supabase
    .from('connected_sources')
    .select('*')
    .eq('user_id', user.id)
    .in('source_type', ['tiktok_shop', 'instagram', 'pinterest'])
    .eq('status', 'active')

  if (!sources?.length) {
    return NextResponse.json({ success: false, message: 'No social sources connected' })
  }

  const results: { source: string; records: number; error?: string }[] = []

  for (const source of sources) {
    const creds  = source.credentials as Record<string, string> || {}
    const config = source.config as Record<string, string> || {}
    const signals: SocialSignalRecord[] = []
    const unifiedRecords: any[] = []

    try {
      if (source.source_type === 'tiktok_shop') {
        const token  = creds.access_token
        const shopId = config.shop_id || ''
        const [orders, analytics] = await Promise.all([
          fetchTikTokShopOrders(token, shopId),
          fetchTikTokShopAnalytics(token),
        ])
        unifiedRecords.push(...normaliseTikTokOrders(orders))
        signals.push(...normaliseTikTokAnalytics(analytics))
      }

      if (source.source_type === 'instagram') {
        const token    = creds.access_token
        const igUserId = config.ig_user_id || ''
        const catalogId = config.catalog_id || ''
        const [posts, orders] = await Promise.all([
          fetchInstagramInsights(token, igUserId),
          fetchInstagramShoppingOrders(token, catalogId),
        ])
        unifiedRecords.push(...normaliseInstagramOrders(orders))
        signals.push(...normaliseInstagramInsights(posts))
      }

      if (source.source_type === 'pinterest') {
        const token = creds.access_token
        const pins  = await fetchPinterestPinAnalytics(token)
        signals.push(...normalisePinterestAnalytics(pins))
      }

      // Upsert social signals
      if (signals.length > 0) {
        const signalRows = signals.map(s => ({
          ...s,
          user_id:    user.id,
          updated_at: new Date().toISOString(),
        }))

        for (let i = 0; i < signalRows.length; i += 50) {
          await supabase.from('social_signals').upsert(
            signalRows.slice(i, i + 50),
            { onConflict: 'user_id,source_type,content_id,record_date' }
          )
        }
      }

      // Upsert unified records (sales data)
      if (unifiedRecords.length > 0) {
        const rows = unifiedRecords.map(r => ({
          ...r,
          user_id:    user.id,
          source_id:  source.id,
          updated_at: new Date().toISOString(),
        }))
        for (let i = 0; i < rows.length; i += 100) {
          await supabase.from('unified_data').upsert(
            rows.slice(i, i + 100),
            { onConflict: 'user_id,source_type,source_record_id' }
          )
        }
      }

      // Check for demand signal alerts — products with high saves, no orders
      const highSaveSignals = signals.filter(s => (s.saves || 0) > 50 && s.orders === 0)
      if (highSaveSignals.length > 0) {
        const top = highSaveSignals[0]
        await supabase.from('alerts').upsert({
          user_id:   user.id,
          type:      'social_demand_signal',
          title:     `${top.saves} saves on ${top.platform} — demand signal detected`,
          message:   `"${top.product_name || 'A product'}" has ${top.saves} saves but no orders. This is strong purchase intent. Check your stock level and ensure it\'s easy to buy.`,
          is_active: true,
          metadata:  { platform: top.platform, saves: top.saves, product: top.product_name },
        }, { onConflict: 'user_id,type' })
      }

      // Update last synced
      await supabase.from('connected_sources').update({
        last_synced_at: new Date().toISOString(),
        status: 'active',
        error_message: null,
      }).eq('id', source.id)

      results.push({ source: source.source_type, records: signals.length + unifiedRecords.length })

    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Sync failed'
      await supabase.from('connected_sources').update({
        status: 'error',
        error_message: msg,
      }).eq('id', source.id)
      results.push({ source: source.source_type, records: 0, error: msg })
    }
  }

  return NextResponse.json({ success: true, results })
}
