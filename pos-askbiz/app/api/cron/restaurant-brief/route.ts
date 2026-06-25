// ── Restaurant Intelligence Cron ──────────────────────────────────────────────
// Runs nightly at 23:30 via Vercel cron.
// For every restaurant-type business: detect anomalies, write daily brief,
// fire in-app notifications and (if opted-in) WhatsApp / email.
//
// Add to vercel.json crons:
//   { "path": "/api/cron/restaurant-brief", "schedule": "30 23 * * *" }

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { logUsage } from '@/lib/log-usage'

export const runtime = 'nodejs'
export const maxDuration = 300

const RESTAURANT_TYPES = /restaurant|cafe|café|bar|pub|takeaway|takeout|food.?stall|catering|bistro|canteen|diner|eatery|food.?truck|brasserie|pizzeria|burger|sushi|kebab|chicken|fish.?chips/i

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const service = createServiceClient()

  // Get all restaurant-sector users with pos_enabled
  const { data: profiles } = await service
    .from('profiles')
    .select('id, business_name, business_type, sector_hints, currency_symbol, region, notify_whatsapp, whatsapp_number, notify_email_alerts')
    .eq('pos_enabled', true)

  const restaurantUsers = (profiles || []).filter((p: any) =>
    RESTAURANT_TYPES.test((p.business_type || '') + ' ' + (p.sector_hints || ''))
  )

  if (!restaurantUsers.length) {
    return NextResponse.json({ message: 'No restaurant users', processed: 0 })
  }

  let processed = 0; let briefed = 0

  for (const profile of restaurantUsers) {
    try {
      await processUser(service, profile)
      briefed++
    } catch (err: any) {
      console.error(`Restaurant brief failed for ${profile.id}:`, err.message)
    }
    processed++
  }

  return NextResponse.json({ processed, briefed })
}

// Allow manual trigger by restaurant owner (POST with auth)
export async function POST(req: NextRequest) {
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const service = createServiceClient()
  const { data: profile } = await service
    .from('profiles')
    .select('id, business_name, business_type, sector_hints, currency_symbol, region')
    .eq('id', user.id)
    .single()

  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const result = await processUser(service, profile)
  return NextResponse.json(result)
}

async function processUser(service: ReturnType<typeof createServiceClient>, profile: any) {
  const userId = profile.id
  const sym    = profile.currency_symbol || '£'
  const today  = new Date().toISOString().slice(0, 10)

  // Don't regenerate if already done today
  const { data: existing } = await service
    .from('daily_briefs')
    .select('id')
    .eq('user_id', userId)
    .eq('date', today)
    .single()

  if (existing) return { skipped: true, reason: 'already_generated' }

  // ── Gather today's restaurant data ───────────────────────────
  const todayStart = new Date(); todayStart.setHours(0,0,0,0)
  const prevStart  = new Date(todayStart); prevStart.setDate(prevStart.getDate() - 7)

  const [ordersRes, laborRes, wasteRes, prev7Res, menuRes] = await Promise.all([
    // Today's orders
    service.from('restaurant_orders')
      .select('id,status,covers,total,order_type,seated_at,paid_at,created_at,order_items:restaurant_order_items(name,unit_price,food_cost,qty)')
      .eq('owner_id', userId)
      .gte('created_at', todayStart.toISOString())
      .not('status', 'eq', 'void'),
    // Today's labour
    service.from('restaurant_labor_shifts')
      .select('role,hourly_rate,total_hours,total_cost,status,clock_in')
      .eq('owner_id', userId)
      .gte('clock_in', todayStart.toISOString()),
    // Today's waste
    service.from('restaurant_waste_log')
      .select('item_name,qty,total_cost,reason')
      .eq('owner_id', userId)
      .gte('created_at', todayStart.toISOString()),
    // Last 7 days revenue (for comparison)
    service.from('restaurant_orders')
      .select('total,created_at,covers,order_items:restaurant_order_items(food_cost,qty)')
      .eq('owner_id', userId)
      .eq('status', 'paid')
      .gte('created_at', prevStart.toISOString())
      .lt('created_at', todayStart.toISOString()),
    // Menu items for margin analysis
    service.from('restaurant_menu_items')
      .select('name,base_price,food_cost,eighty_sixed')
      .eq('owner_id', userId)
      .eq('active', true)
      .limit(50),
  ])

  const todayOrders  = (ordersRes.data  || [])
  const todayLabour  = (laborRes.data   || [])
  const todayWaste   = (wasteRes.data   || [])
  const prev7Orders  = (prev7Res.data   || [])
  const menuItems    = (menuRes.data    || [])

  const paidToday    = todayOrders.filter((o: any) => o.status === 'paid')
  const revToday     = paidToday.reduce((s: number, o: any) => s + (o.total || 0), 0)
  const coversToday  = paidToday.reduce((s: number, o: any) => s + (o.covers || 1), 0)

  // Food cost today
  let foodCostToday = 0
  const dishCounts: Record<string, { qty: number; rev: number; cost: number }> = {}
  for (const order of paidToday) {
    for (const item of (order.order_items || [])) {
      foodCostToday += (item.food_cost || 0) * item.qty
      if (!dishCounts[item.name]) dishCounts[item.name] = { qty: 0, rev: 0, cost: 0 }
      dishCounts[item.name].qty += item.qty
      dishCounts[item.name].rev += item.unit_price * item.qty
      dishCounts[item.name].cost += (item.food_cost || 0) * item.qty
    }
  }

  const foodCostPct  = revToday > 0 ? (foodCostToday / revToday) * 100 : 0
  const labourCost   = todayLabour.reduce((s: number, sh: any) => s + (sh.total_cost || 0), 0)
  const labourPct    = revToday > 0 ? (labourCost / revToday) * 100 : 0
  const primePct     = foodCostPct + labourPct
  const wasteCost    = todayWaste.reduce((s: number, w: any) => s + (w.total_cost || 0), 0)

  // 7-day average revenue per day
  const days7Rev = prev7Orders.reduce((s: number, o: any) => s + (o.total || 0), 0)
  const avg7DayRev = days7Rev / 7

  // Best and worst dish by margin
  const dishes = Object.entries(dishCounts)
    .map(([name, d]) => ({ name, qty: d.qty, margin: d.rev > 0 ? ((d.rev - d.cost) / d.rev) * 100 : 0 }))
    .sort((a, b) => b.margin - a.margin)

  // Dwell time
  const dineIn = paidToday.filter((o: any) => o.order_type === 'dine_in' && o.seated_at && o.paid_at)
  const avgDwell = dineIn.length > 0
    ? dineIn.reduce((s: number, o: any) => s + (new Date(o.paid_at).getTime() - new Date(o.seated_at).getTime()) / 60000, 0) / dineIn.length
    : 0

  // ── Detect anomalies ──────────────────────────────────────────
  const anomalies: { type: string; severity: string; title: string; body: string; metric: string; value: number; threshold: number; prompt: string }[] = []

  if (foodCostPct > 42 && revToday > 0) {
    anomalies.push({
      type: 'cost_increase', severity: 'critical',
      title: `Food cost at ${foodCostPct.toFixed(1)}% — critical`,
      body: `Today's food cost is ${foodCostPct.toFixed(1)}% of revenue. Target is below 35%. This wipes ${sym}${((foodCostPct - 35) / 100 * revToday).toFixed(2)} of profit.`,
      metric: 'food_cost_pct', value: foodCostPct, threshold: 35,
      prompt: `My food cost is ${foodCostPct.toFixed(1)}% today. What are the most likely causes and what should I check first?`,
    })
  } else if (foodCostPct > 35 && foodCostPct <= 42 && revToday > 0) {
    anomalies.push({
      type: 'cost_increase', severity: 'warning',
      title: `Food cost at ${foodCostPct.toFixed(1)}% — above target`,
      body: `Food cost is slightly above the 35% target. Worth checking portion sizes and any new ingredients delivered today.`,
      metric: 'food_cost_pct', value: foodCostPct, threshold: 35,
      prompt: `Food cost is ${foodCostPct.toFixed(1)}% today. What quick checks can I do to bring it back under 35%?`,
    })
  }

  if (primePct > 70 && revToday > 0) {
    anomalies.push({
      type: 'margin_drop', severity: 'critical',
      title: `Prime cost at ${primePct.toFixed(1)}% — dangerous`,
      body: `Combined food + labour cost is ${primePct.toFixed(1)}%. Anything above 65% erodes profitability. Above 70% is unsustainable.`,
      metric: 'prime_cost_pct', value: primePct, threshold: 65,
      prompt: `My prime cost is ${primePct.toFixed(1)}% today. Break down what's driving this and give me 3 concrete actions.`,
    })
  }

  if (labourPct > 38 && revToday > 0) {
    anomalies.push({
      type: 'cost_increase', severity: 'warning',
      title: `Labour at ${labourPct.toFixed(1)}% of revenue`,
      body: `Labour cost is ${labourPct.toFixed(1)}% of today's revenue. Target is below 30%. Consider whether shifts match covers.`,
      metric: 'labour_pct', value: labourPct, threshold: 30,
      prompt: `Labour cost is ${labourPct.toFixed(1)}% of revenue today. How can I optimise my staffing levels?`,
    })
  }

  if (revToday < avg7DayRev * 0.6 && avg7DayRev > 50) {
    const dropPct = ((avg7DayRev - revToday) / avg7DayRev * 100).toFixed(0)
    anomalies.push({
      type: 'revenue_anomaly', severity: 'warning',
      title: `Revenue down ${dropPct}% vs 7-day average`,
      body: `Today's revenue (${sym}${revToday.toFixed(2)}) is ${dropPct}% below the 7-day average (${sym}${avg7DayRev.toFixed(2)}). Is it a day-of-week pattern or something to investigate?`,
      metric: 'daily_revenue', value: revToday, threshold: avg7DayRev,
      prompt: `Revenue today is ${sym}${revToday.toFixed(2)}, which is ${dropPct}% below my 7-day average. What could explain this drop?`,
    })
  }

  if (wasteCost > revToday * 0.05 && revToday > 0) {
    anomalies.push({
      type: 'cost_increase', severity: 'warning',
      title: `Waste at ${sym}${wasteCost.toFixed(2)} today`,
      body: `Waste cost is ${(wasteCost / revToday * 100).toFixed(1)}% of revenue. Review the waste log to identify the highest contributors.`,
      metric: 'waste_cost', value: wasteCost, threshold: revToday * 0.03,
      prompt: `Waste cost is ${sym}${wasteCost.toFixed(2)} today. What are the most common waste reduction strategies for restaurants?`,
    })
  }

  if (avgDwell > 95 && dineIn.length >= 3) {
    anomalies.push({
      type: 'velocity_spike', severity: 'info',
      title: `Average dwell time ${avgDwell.toFixed(0)} mins`,
      body: `Tables are staying for an average of ${avgDwell.toFixed(0)} minutes. Long dwell limits covers and revenue per seat.`,
      metric: 'avg_dwell_mins', value: avgDwell, threshold: 90,
      prompt: `My average table dwell time is ${avgDwell.toFixed(0)} minutes. What are effective ways to improve table turns without rushing guests?`,
    })
  }

  const worstDish = dishes.length > 0 ? dishes[dishes.length - 1] : null
  if (worstDish && worstDish.margin < 45 && worstDish.qty >= 3) {
    anomalies.push({
      type: 'margin_drop', severity: 'info',
      title: `${worstDish.name} margin only ${worstDish.margin.toFixed(0)}%`,
      body: `"${worstDish.name}" is your lowest-margin dish today (${worstDish.margin.toFixed(0)}%). Consider reviewing its food cost or price.`,
      metric: 'dish_margin', value: worstDish.margin, threshold: 60,
      prompt: `"${worstDish.name}" has a ${worstDish.margin.toFixed(0)}% margin. Should I reprice it, reduce portion size, or swap an ingredient?`,
    })
  }

  // Write anomalies to DB
  if (anomalies.length > 0) {
    // Deduplicate: don't re-insert same type from same day
    const { data: existingAnomalies } = await service
      .from('anomalies')
      .select('metric')
      .eq('user_id', userId)
      .gte('created_at', todayStart.toISOString())

    const existingMetrics = new Set((existingAnomalies || []).map((a: any) => a.metric))
    const newAnomalies = anomalies.filter(a => !existingMetrics.has(a.metric))

    if (newAnomalies.length > 0) {
      await service.from('anomalies').insert(
        newAnomalies.map(a => ({ user_id: userId, ...a, seen: false }))
      )
    }
  }

  // ── Generate daily brief with Claude ─────────────────────────
  const topDish  = dishes[0]
  const briefData = {
    date:          today,
    revenue:       revToday.toFixed(2),
    covers:        coversToday,
    avg7DayRev:    avg7DayRev.toFixed(2),
    food_cost_pct: foodCostPct.toFixed(1),
    labour_pct:    labourPct.toFixed(1),
    prime_pct:     primePct.toFixed(1),
    waste_cost:    wasteCost.toFixed(2),
    avg_dwell:     avgDwell.toFixed(0),
    top_dish:      topDish?.name || null,
    top_dish_margin: topDish?.margin.toFixed(0) || null,
    worst_dish:    worstDish?.name || null,
    anomaly_count: anomalies.length,
    currency:      sym,
  }

  let brief = { improved: '', worsened: '', action: '', health_score: 70 }

  try {
    const _groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 256,
        messages: [{
          role: 'user',
          content: `You are a restaurant intelligence system. Based on today's data, generate a daily brief.

DATA: ${JSON.stringify(briefData)}

RULES:
- improved: ONE thing that went well today (max 12 words, specific metric or observation)
- worsened: ONE thing that needs attention (max 12 words, specific)
- action: THE single most important action for tomorrow (max 15 words, actionable verb first)
- health_score: 0-100 overall restaurant health today (70 = average day, 90+ = excellent, <50 = problem day)

Reply ONLY with JSON: {"improved":"...","worsened":"...","action":"...","health_score":75}`,
        }],
      }),
    })
    const _groqData = await _groqRes.json()
    logUsage({ route: 'cron/restaurant-brief', model: 'llama-3.3-70b-versatile', usage: { input_tokens: _groqData.usage?.prompt_tokens ?? 0, output_tokens: _groqData.usage?.completion_tokens ?? 0 }, userId })
    const _groqText = _groqData.choices?.[0]?.message?.content || ''
    const match = _groqText.match(/\{[^{}]+\}/)
    if (match) brief = { ...brief, ...JSON.parse(match[0]) }
  } catch {
    // Fallback brief without Claude
    brief.improved = revToday > avg7DayRev ? `Revenue ${sym}${revToday.toFixed(0)} beat 7-day avg` : topDish ? `${topDish.name} was top performer` : 'Operations ran smoothly'
    brief.worsened = anomalies[0]?.title || (foodCostPct > 35 ? `Food cost at ${foodCostPct.toFixed(1)}%` : 'Nothing major to report')
    brief.action   = anomalies[0] ? anomalies[0].body.split('.')[0] : 'Review waste log for reduction opportunities'
    brief.health_score = primePct < 60 && anomalies.length === 0 ? 82 : primePct > 70 ? 45 : 65
  }

  // Write daily brief
  await service.from('daily_briefs').upsert({
    user_id:      userId,
    date:         today,
    improved:     brief.improved,
    worsened:     brief.worsened,
    action:       brief.action,
    health_score: brief.health_score,
    sent_at:      new Date().toISOString(),
  }, { onConflict: 'user_id,date' })

  return { userId, anomalies: anomalies.length, brief, revenue: revToday }
}
