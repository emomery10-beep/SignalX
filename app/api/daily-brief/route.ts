import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'
import { logUsage } from '@/lib/log-usage'

export const runtime = 'nodejs'
export const maxDuration = 60

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return generateBrief(user.id, supabase)
}

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const today = new Date().toISOString().slice(0, 10)

  const { data: brief } = await supabase
    .from('daily_briefs')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', today)
    .single()

  if (brief) {
    await supabase.from('daily_briefs')
      .update({ opened_at: new Date().toISOString() })
      .eq('id', brief.id)
    return NextResponse.json({ brief, fresh: false })
  }

  return generateBrief(user.id, supabase)
}

async function generateBrief(userId: string, supabase: ReturnType<typeof createClient>) {
  const today = new Date().toISOString().slice(0, 10)

  // ── Pull all context in parallel ──────────────────────────────
  const [
    { data: health },
    { data: anomalies },
    { data: decisions },
    { data: recentData },
    { data: sources },
    { data: churnAlerts },
    { data: socialSignals },
  ] = await Promise.all([
    supabase.from('health_scores').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(1).single(),
    supabase.from('anomalies').select('title,body,severity').eq('user_id', userId).eq('seen', false).order('created_at', { ascending: false }).limit(5),
    supabase.from('decisions').select('title,review_at').eq('user_id', userId).eq('reviewed', false).lte('review_at', new Date(Date.now() + 7 * 86400000).toISOString()).order('review_at', { ascending: true }).limit(3),
    // Last 7 days of unified data for revenue/margin trend
    supabase.from('unified_data').select('gross_revenue,gross_margin,record_date,channel').eq('user_id', userId).gte('record_date', new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10)).order('record_date', { ascending: false }).limit(200),
    supabase.from('connected_sources').select('source_type,name,status,last_synced_at').eq('user_id', userId).eq('status', 'active'),
    supabase.from('alerts').select('title,message,type').eq('user_id', userId).eq('is_active', true).limit(3),
    supabase.from('social_signals').select('platform,saves,product_name').eq('user_id', userId).gt('saves', 20).eq('orders', 0).order('saves', { ascending: false }).limit(2),
  ])

  // ── POS context for brief ─────────────────────────────────
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0)
  const [{ data: posTx }, { data: lowStockItems }] = await Promise.all([
    supabase.from('pos_transactions').select('total,status,pos_staff(name)').eq('owner_id', userId).gte('created_at', todayStart.toISOString()),
    supabase.from('inventory').select('name,stock_qty,low_stock_threshold').eq('owner_id', userId).eq('active', true).filter('stock_qty', 'lte', 'low_stock_threshold'),
  ])
  const posRevToday  = (posTx || []).filter((t: { status: string }) => t.status === 'completed').reduce((s: number, t: { total: number }) => s + t.total, 0)
  const posSalesToday = (posTx || []).filter((t: { status: string }) => t.status === 'completed').length
  const posRefunds   = (posTx || []).filter((t: { status: string }) => t.status.includes('refund')).length
  const posContext   = posSalesToday > 0 || (lowStockItems?.length ?? 0) > 0
    ? `POS today: ${posSalesToday} sales, £${posRevToday.toFixed(2)} revenue${posRefunds > 0 ? `, ${posRefunds} refund${posRefunds > 1 ? 's' : ''}` : ''}.${(lowStockItems?.length ?? 0) > 0 ? ` Low/out of stock: ${(lowStockItems || []).slice(0, 3).map((i: { name: string }) => i.name).join(', ')}.` : ''}`
    : ''

  // ── Logistics context for brief ─────────────────────────────
  let logisticsContext = ''
  try {
    const { data: todayParcels } = await supabase
      .from('pos_parcels')
      .select('status, fee_charged, payment_status')
      .eq('owner_id', userId)
      .gte('created_at', todayStart.toISOString())
    const { data: allActiveParcels } = await supabase
      .from('pos_parcels')
      .select('status')
      .eq('owner_id', userId)
      .in('status', ['received', 'at_branch', 'assigned', 'loaded', 'in_transit', 'out_for_delivery', 'failed_delivery'])

    if (todayParcels && todayParcels.length > 0) {
      const todayIn = todayParcels.length
      const todayRev = todayParcels.reduce((s: number, p: any) => s + (p.fee_charged || 0), 0)
      const inTransit = (allActiveParcels || []).filter((p: any) => ['in_transit', 'out_for_delivery'].includes(p.status)).length
      const atBranch = (allActiveParcels || []).filter((p: any) => ['received', 'at_branch', 'assigned', 'loaded'].includes(p.status)).length
      const failedToday = todayParcels.filter((p: any) => p.status === 'failed_delivery').length
      logisticsContext = `Logistics today: ${todayIn} parcels received, revenue ${todayRev.toLocaleString()}. ${inTransit} in transit, ${atBranch} at branch.${failedToday > 0 ? ` ${failedToday} failed deliveries.` : ''}`
    }
  } catch {}

  // ── Build rich context ────────────────────────────────────────
  const healthContext = health
    ? `Business health: ${health.score}/100 (${health.label}). ${health.summary || ''}`
    : 'No health score yet.'

  const anomalyContext = anomalies?.length
    ? `Active alerts: ${anomalies.map(a => `${a.title}`).join('; ')}`
    : 'No active alerts.'

  const decisionContext = decisions?.length
    ? `Decisions due for review: ${decisions.map(d => d.title).join('; ')}`
    : ''

  // Revenue trend
  let revenueContext = ''
  if (recentData?.length) {
    const totalRevenue = recentData.reduce((s, r) => s + (r.gross_revenue || 0), 0)
    const avgMargin = recentData.filter(r => r.gross_margin).reduce((s, r) => s + r.gross_margin, 0) / Math.max(recentData.filter(r => r.gross_margin).length, 1)
    const channels = [...new Set(recentData.map(r => r.channel).filter(Boolean))]
    revenueContext = `Last 7 days: £${Math.round(totalRevenue).toLocaleString()} revenue, ${Math.round(avgMargin)}% avg margin. Channels: ${channels.join(', ')}.`
  }

  const sourcesContext = sources?.length
    ? `Connected: ${sources.map(s => s.name).join(', ')}`
    : 'No data sources connected yet.'

  const churnContext = churnAlerts?.length
    ? `Retention alert: ${churnAlerts[0]?.title || 'customers at risk of churning'}`
    : ''

  const socialContext = socialSignals?.length
    ? `Demand signal: "${socialSignals[0].product_name}" has ${socialSignals[0].saves} saves on ${socialSignals[0].platform} with no orders — potential stock opportunity`
    : ''

  // ── Build brief with Claude ───────────────────────────────────
  let brief = {
    improved:     'Your business data is being monitored continuously.',
    worsened:     'No critical issues detected today.',
    action:       'Ask AskBiz about your current performance to get personalised insights.',
    health_score: health?.score || 0,
    revenue_7d:   recentData?.reduce((s, r) => s + (r.gross_revenue || 0), 0) || 0,
    sources_count: sources?.length || 0,
  }

  try {
    const contextParts = [
      healthContext,
      revenueContext,
      posContext,
      logisticsContext,
      anomalyContext,
      decisionContext,
      churnContext,
      socialContext,
      sourcesContext,
    ].filter(Boolean).join('\n')

    const res = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      messages: [{
        role: 'user',
        content: `You are AskBiz — a plain-English business intelligence advisor. Write a concise morning brief for a business owner. Be specific and direct. No jargon. Return ONLY valid JSON.

Business data:
${contextParts}

Return exactly:
{
  "improved": "One specific thing that improved or is going well. One sentence, max 20 words. Be specific — use numbers if available.",
  "worsened": "One specific thing that needs attention. One sentence, max 20 words. Be specific.",
  "action": "The single most important action for today. One sentence, max 25 words. Start with a strong verb."
}`,
      }],
    })
    logUsage({ route: 'daily-brief', model: 'claude-sonnet-4-6', usage: res.usage, userId })

    const raw = res.content[0].type === 'text' ? res.content[0].text : ''
    const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim())
    brief = {
      ...brief,
      improved: parsed.improved || brief.improved,
      worsened: parsed.worsened || brief.worsened,
      action:   parsed.action   || brief.action,
    }
  } catch (e) {
    console.error('[daily-brief] Claude error:', e)
  }

  // ── Save ──────────────────────────────────────────────────────
  const { data: saved } = await supabase
    .from('daily_briefs')
    .upsert({
      user_id:      userId,
      date:         today,
      improved:     brief.improved,
      worsened:     brief.worsened,
      action:       brief.action,
      health_score: brief.health_score,
      sent_at:      new Date().toISOString(),
      opened_at:    new Date().toISOString(),
    }, { onConflict: 'user_id,date' })
    .select()
    .single()

  return NextResponse.json({ brief: saved || brief, fresh: true })
}
