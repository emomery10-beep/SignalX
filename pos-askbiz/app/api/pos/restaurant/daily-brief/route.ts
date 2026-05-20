import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const today = new Date().toISOString().slice(0, 10)

  const { data: brief } = await service
    .from('daily_briefs')
    .select('*')
    .eq('user_id', auth.ownerId)
    .eq('date', today)
    .single()

  if (brief) {
    return NextResponse.json({ brief })
  }

  // No brief for today — trigger generation on demand
  try {
    const { data: profile } = await service
      .from('profiles')
      .select('id, business_name, business_type, sector_hints, currency_symbol, region')
      .eq('id', auth.ownerId)
      .single()

    if (!profile) return NextResponse.json({ brief: null })

    const generatedBrief = await generateBriefForUser(service, profile)
    return NextResponse.json({ brief: generatedBrief })
  } catch (err) {
    console.error('On-demand brief generation failed:', err)
    return NextResponse.json({ brief: null })
  }
}

// POST — force regenerate today's brief
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const today = new Date().toISOString().slice(0, 10)

  // Delete existing brief to force regeneration
  await service.from('daily_briefs').delete().eq('user_id', auth.ownerId).eq('date', today)

  const { data: profile } = await service
    .from('profiles')
    .select('id, business_name, business_type, sector_hints, currency_symbol, region')
    .eq('id', auth.ownerId)
    .single()

  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const brief = await generateBriefForUser(service, profile)
  return NextResponse.json({ brief })
}

async function generateBriefForUser(service: ReturnType<typeof createServiceClient>, profile: any) {
  const userId = profile.id
  const sym    = profile.currency_symbol || '£'
  const today  = new Date().toISOString().slice(0, 10)

  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0)
  const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); sevenDaysAgo.setHours(0, 0, 0, 0)

  const [ordersRes, laborRes, wasteRes, prevOrdersRes] = await Promise.all([
    service.from('restaurant_orders')
      .select('id, total, covers, order_type, status, seated_at, paid_at, prep_minutes')
      .eq('owner_id', userId).eq('status', 'paid')
      .gte('created_at', todayStart.toISOString()),
    service.from('restaurant_labor_shifts')
      .select('total_hours, total_cost, hourly_rate')
      .eq('owner_id', userId)
      .gte('clock_in', todayStart.toISOString()),
    service.from('restaurant_waste_log')
      .select('estimated_cost, qty, reason')
      .eq('owner_id', userId)
      .gte('logged_at', todayStart.toISOString()),
    service.from('restaurant_orders')
      .select('total, created_at')
      .eq('owner_id', userId).eq('status', 'paid')
      .gte('created_at', sevenDaysAgo.toISOString())
      .lt('created_at', todayStart.toISOString()),
  ])

  const orders    = ordersRes.data || []
  const labor     = laborRes.data || []
  const waste     = wasteRes.data || []
  const prevOrders = prevOrdersRes.data || []

  const totalRevenue  = orders.reduce((s: number, o: any) => s + (o.total || 0), 0)
  const totalCovers   = orders.reduce((s: number, o: any) => s + (o.covers || 1), 0)
  const totalLabour   = labor.reduce((s: number, l: any) => s + (l.total_cost || 0), 0)
  const totalWasteCost = waste.reduce((s: number, w: any) => s + (w.estimated_cost || 0), 0)

  const prevByDay: Record<string, number> = {}
  for (const o of prevOrders) {
    const d = o.created_at.slice(0, 10)
    prevByDay[d] = (prevByDay[d] || 0) + (o.total || 0)
  }
  const prevDays   = Object.values(prevByDay)
  const avgPrevRev = prevDays.length > 0 ? prevDays.reduce((s, v) => s + v, 0) / prevDays.length : 0

  const foodCostPct  = totalRevenue > 0 ? (totalWasteCost / totalRevenue) * 100 : 0
  const labourPct    = totalRevenue > 0 ? (totalLabour / totalRevenue) * 100 : 0
  const primeCostPct = foodCostPct + labourPct
  const revVsPrev    = avgPrevRev > 0 ? ((totalRevenue - avgPrevRev) / avgPrevRev) * 100 : 0

  // Attempt Claude Haiku for brief
  let improved = '', worsened = '', action = '', health_score = 70

  try {
    const Anthropic = (await import('@anthropic-ai/sdk')).default
    const anthropic = new Anthropic()

    const prompt = `You are a restaurant operations advisor. Write a concise daily brief.

Today's data:
- Revenue: ${sym}${totalRevenue.toFixed(2)} (${revVsPrev > 0 ? '+' : ''}${revVsPrev.toFixed(0)}% vs 7-day avg)
- Covers: ${totalCovers}
- Labour %: ${labourPct.toFixed(1)}%
- Prime cost %: ${primeCostPct.toFixed(1)}%
- Waste cost: ${sym}${totalWasteCost.toFixed(2)}

Respond with ONLY valid JSON: {"improved":"one thing going well (max 12 words)","worsened":"one thing to watch (max 12 words)","action":"one specific action for today (max 15 words)","health_score":number 0-100}`

    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = (msg.content[0] as any).text?.trim() || ''
    const match = raw.match(/\{[\s\S]*\}/)
    if (match) {
      const parsed = JSON.parse(match[0])
      improved = parsed.improved || ''
      worsened = parsed.worsened || ''
      action   = parsed.action   || ''
      health_score = Math.min(100, Math.max(0, parsed.health_score || 70))
    }
  } catch {
    // Rule-based fallback
    if (revVsPrev > 10) improved = `Revenue up ${revVsPrev.toFixed(0)}% vs last week`
    else if (labourPct < 30) improved = `Labour cost on track at ${labourPct.toFixed(1)}%`
    else improved = `${orders.length} covers served today`

    if (primeCostPct > 70) worsened = `Prime cost at ${primeCostPct.toFixed(1)}% — above 65% target`
    else if (labourPct > 38) worsened = `Labour at ${labourPct.toFixed(1)}% — monitor hours`
    else if (revVsPrev < -20) worsened = `Revenue down ${Math.abs(revVsPrev).toFixed(0)}% vs avg`
    else worsened = 'No major issues detected'

    if (primeCostPct > 65) action = 'Review labour schedule for rest of week'
    else if (totalWasteCost > totalRevenue * 0.05) action = 'Audit waste log with kitchen team'
    else action = 'Keep up the pace — check prep times at service'

    health_score = Math.max(20, Math.min(95,
      70
      + (revVsPrev > 0 ? Math.min(15, revVsPrev / 3) : Math.max(-20, revVsPrev / 3))
      - (primeCostPct > 65 ? 15 : 0)
      - (primeCostPct > 70 ? 10 : 0)
    ))
  }

  // Upsert into daily_briefs
  const { data: brief } = await service
    .from('daily_briefs')
    .upsert({ user_id: userId, date: today, improved, worsened, action, health_score }, { onConflict: 'user_id,date' })
    .select()
    .single()

  return brief || { improved, worsened, action, health_score, date: today }
}
