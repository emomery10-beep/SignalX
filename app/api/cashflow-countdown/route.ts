import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCurrencySymbol } from '@/lib/get-currency'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sym = await getCurrencySymbol(supabase, user.id)

  const now = new Date()
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 86400000).toISOString().split('T')[0]
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000).toISOString().split('T')[0]
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 86400000).toISOString().split('T')[0]

  const [
    { data: unified90 },
    { data: posTx90 },
    { data: overridesRow },
    { data: latestHealth },
  ] = await Promise.all([
    supabase
      .from('unified_data')
      .select('record_date, gross_revenue, total_cost, gross_margin, cost_price, units_sold')
      .eq('user_id', user.id)
      .gte('record_date', ninetyDaysAgo)
      .order('record_date', { ascending: true })
      .limit(3000),

    supabase
      .from('pos_transactions')
      .select('total, created_at, status')
      .eq('owner_id', user.id)
      .eq('status', 'completed')
      .gte('created_at', new Date(now.getTime() - 90 * 86400000).toISOString())
      .order('created_at', { ascending: true })
      .limit(5000),

    supabase
      .from('cost_profile_overrides')
      .select('overrides')
      .eq('user_id', user.id)
      .single(),

    supabase
      .from('health_scores')
      .select('components')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single(),
  ])

  const overrides = (overridesRow?.overrides || {}) as Record<string, any>
  const monthlyFixedCosts = overrides.monthly_fixed_costs || overrides.monthlyFixedCosts || 0

  // Extract cash balance from health score components if available
  const healthComponents = latestHealth?.components as Record<string, any> || {}
  const cashBalance = overrides.cash_balance || overrides.cashBalance || healthComponents?.cash_flow?.cash_balance || 0

  // Aggregate daily revenue + costs from unified_data
  const dailyMap = new Map<string, { revenue: number; cost: number }>()

  for (const r of unified90 || []) {
    const date = r.record_date
    if (!dailyMap.has(date)) dailyMap.set(date, { revenue: 0, cost: 0 })
    const d = dailyMap.get(date)!
    d.revenue += r.gross_revenue || 0
    d.cost += r.total_cost || (r.cost_price || 0) * (r.units_sold || 0)
  }

  // Add POS revenue by date
  for (const tx of posTx90 || []) {
    const date = tx.created_at.split('T')[0]
    if (!dailyMap.has(date)) dailyMap.set(date, { revenue: 0, cost: 0 })
    dailyMap.get(date)!.revenue += tx.total || 0
  }

  const allDays = Array.from(dailyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({ date, ...v }))

  // Split into periods for trend detection
  const last30 = allDays.filter(d => d.date >= thirtyDaysAgo)
  const prev30 = allDays.filter(d => d.date >= sixtyDaysAgo && d.date < thirtyDaysAgo)

  const sumRevenue = (arr: typeof allDays) => arr.reduce((s, d) => s + d.revenue, 0)
  const sumCost = (arr: typeof allDays) => arr.reduce((s, d) => s + d.cost, 0)

  const rev30 = sumRevenue(last30)
  const cost30 = sumCost(last30)
  const rev30prev = sumRevenue(prev30)
  const cost30prev = sumCost(prev30)

  const daysInLast30 = Math.max(last30.length, 1)
  const dailyRevenue = rev30 / daysInLast30
  const dailyCogs = cost30 / daysInLast30
  const dailyFixed = monthlyFixedCosts / 30
  const dailyNetBurn = dailyRevenue - dailyCogs - dailyFixed
  const dailyGrossBurn = dailyRevenue - dailyCogs

  // Previous period for trend
  const daysInPrev30 = Math.max(prev30.length, 1)
  const prevDailyNet = (rev30prev / daysInPrev30) - (cost30prev / daysInPrev30) - dailyFixed

  // Runway calculation
  let runwayDays: number | null = null
  let runwayLabel: string
  let runwayStatus: 'critical' | 'warning' | 'healthy' | 'strong' | 'unknown'

  if (cashBalance > 0 && dailyNetBurn < 0) {
    runwayDays = Math.round(cashBalance / Math.abs(dailyNetBurn))
    if (runwayDays <= 30) { runwayStatus = 'critical'; runwayLabel = `${runwayDays} days left` }
    else if (runwayDays <= 90) { runwayStatus = 'warning'; runwayLabel = `${Math.round(runwayDays / 30)} months left` }
    else if (runwayDays <= 180) { runwayStatus = 'healthy'; runwayLabel = `${Math.round(runwayDays / 30)} months left` }
    else { runwayStatus = 'strong'; runwayLabel = `${Math.round(runwayDays / 30)}+ months` }
  } else if (dailyNetBurn >= 0) {
    runwayStatus = 'strong'
    runwayLabel = 'Cash positive'
  } else {
    runwayStatus = 'unknown'
    runwayLabel = 'Set cash balance to calculate'
  }

  // Weekly net cash flow for sparkline (last 12 weeks)
  const weeklyFlow: { week: string; net: number }[] = []
  for (let w = 11; w >= 0; w--) {
    const weekStart = new Date(now.getTime() - (w + 1) * 7 * 86400000)
    const weekEnd = new Date(now.getTime() - w * 7 * 86400000)
    const ws = weekStart.toISOString().split('T')[0]
    const we = weekEnd.toISOString().split('T')[0]
    const weekDays = allDays.filter(d => d.date >= ws && d.date < we)
    const net = weekDays.reduce((s, d) => s + d.revenue - d.cost, 0) - (monthlyFixedCosts / 4.33)
    weeklyFlow.push({ week: ws, net: Math.round(net) })
  }

  // Revenue trend
  const revTrend = rev30prev > 0
    ? Math.round(((rev30 - rev30prev) / rev30prev) * 100)
    : 0

  // Breakeven point
  const dailyBreakeven = dailyCogs + dailyFixed
  const breakevenGap = dailyRevenue - dailyBreakeven

  return NextResponse.json({
    runway: {
      days: runwayDays,
      label: runwayLabel,
      status: runwayStatus,
    },
    cash: {
      balance: cashBalance,
      has_balance: cashBalance > 0,
    },
    daily: {
      revenue: Math.round(dailyRevenue * 100) / 100,
      cogs: Math.round(dailyCogs * 100) / 100,
      fixed: Math.round(dailyFixed * 100) / 100,
      net_burn: Math.round(dailyNetBurn * 100) / 100,
      gross_profit: Math.round(dailyGrossBurn * 100) / 100,
      breakeven: Math.round(dailyBreakeven * 100) / 100,
      breakeven_gap: Math.round(breakevenGap * 100) / 100,
    },
    monthly: {
      revenue: Math.round(rev30),
      cogs: Math.round(cost30),
      fixed_costs: monthlyFixedCosts,
      net: Math.round(rev30 - cost30 - monthlyFixedCosts),
      has_fixed_costs: monthlyFixedCosts > 0,
    },
    trend: {
      revenue_pct: revTrend,
      burn_improving: dailyNetBurn > prevDailyNet,
    },
    weekly_flow: weeklyFlow,
    data_quality: {
      days_with_data: allDays.length,
      has_ecommerce: (unified90?.length || 0) > 0,
      has_pos: (posTx90?.length || 0) > 0,
    },
    currency_symbol: sym,
  })
}
