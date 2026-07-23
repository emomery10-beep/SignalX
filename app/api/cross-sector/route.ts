import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCurrencySymbol } from '@/lib/get-currency'
import { normalizeSector, businessSize } from '@/lib/market-benchmarks'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('business_type, sector_hints, region, plan, plan_id, pos_seat_count')
    .eq('id', user.id)
    .single()

  const sym = await getCurrencySymbol(supabase, user.id)
  const userSector = normalizeSector(profile?.sector_hints?.split(',')[0]?.trim() || profile?.business_type)
  const userRegion = profile?.region || ''
  const userSize = businessSize(profile?.pos_seat_count || 0, profile?.plan_id || profile?.plan || 'free')

  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]

  // Parallel: user's own metrics + sector benchmarks
  const [
    { data: userUnified },
    { data: userPosTx },
    { data: benchmarks },
  ] = await Promise.all([
    supabase
      .from('unified_data')
      .select('gross_revenue, total_cost, gross_margin, units_sold, refund_amount')
      .eq('user_id', user.id)
      .gte('record_date', thirtyDaysAgo)
      .limit(2000),

    supabase
      .from('pos_transactions')
      .select('total, status, discount_amount')
      .eq('owner_id', user.id)
      .eq('status', 'completed')
      .gte('created_at', new Date(Date.now() - 30 * 86400000).toISOString())
      .limit(2000),

    supabase
      .from('market_benchmarks')
      .select('sector, metric, value, sample_size, region, business_size, period')
      .gte('sample_size', 3)
      .order('period', { ascending: false })
      .limit(500),
  ])

  // Calculate user metrics
  const ecomRevenue = (userUnified || []).reduce((s, r) => s + (r.gross_revenue || 0), 0)
  const ecomCost = (userUnified || []).reduce((s, r) => s + (r.total_cost || 0), 0)
  const ecomUnits = (userUnified || []).reduce((s, r) => s + (r.units_sold || 0), 0)
  const ecomRefunds = (userUnified || []).reduce((s, r) => s + (r.refund_amount || 0), 0)

  const posRevenue = (userPosTx || []).reduce((s, t) => s + (t.total || 0), 0)
  const posTxCount = (userPosTx || []).length

  const totalRevenue = ecomRevenue + posRevenue
  const totalCost = ecomCost
  const avgMargin = totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0
  const avgBasket = posTxCount > 0 ? posRevenue / posTxCount : (ecomUnits > 0 ? ecomRevenue / ecomUnits : 0)
  const dailyRevenue = totalRevenue / 30
  const refundRate = totalRevenue > 0 ? (ecomRefunds / totalRevenue) * 100 : 0

  // Organize benchmarks by sector -> metric. Prefer rows that match the
  // user's own region + business size over rows that just have a bigger
  // sample — otherwise "your sector average" can silently mix in a
  // different country/scale than the user's own.
  const sectorBenchmarks: Record<string, Record<string, { value: number; sample_size: number; matched: boolean }>> = {}
  for (const b of benchmarks || []) {
    if (!sectorBenchmarks[b.sector]) sectorBenchmarks[b.sector] = {}
    const existing = sectorBenchmarks[b.sector][b.metric]
    const isMatch = !!userRegion && b.region === userRegion && b.business_size === userSize
    const shouldReplace = !existing
      || (isMatch && !existing.matched)
      || (isMatch === existing.matched && b.sample_size > existing.sample_size)
    if (shouldReplace) {
      sectorBenchmarks[b.sector][b.metric] = { value: b.value, sample_size: b.sample_size, matched: isMatch }
    }
  }

  // Build comparison data
  const userMetrics = [
    { key: 'avg_margin', label: 'Gross Margin', value: Math.round(avgMargin * 10) / 10, unit: '%' },
    { key: 'avg_basket', label: 'Avg Basket', value: Math.round(avgBasket * 100) / 100, unit: '£' },
    { key: 'avg_daily_revenue', label: 'Daily Revenue', value: Math.round(dailyRevenue * 100) / 100, unit: '£' },
    { key: 'refund_rate', label: 'Refund Rate', value: Math.round(refundRate * 10) / 10, unit: '%' },
  ]

  // Compare user to their sector and all other sectors
  const allSectors = Object.keys(sectorBenchmarks)
  const sectorComparisons = allSectors.map(sector => {
    const metrics = sectorBenchmarks[sector]
    return {
      sector,
      is_user_sector: sector === userSector,
      metrics: userMetrics.map(um => {
        const benchmark = metrics[um.key]
        return {
          key: um.key,
          label: um.label,
          user_value: um.value,
          benchmark_value: benchmark?.value ?? null,
          sample_size: benchmark?.sample_size || 0,
          matched: benchmark?.matched ?? false,
          unit: um.unit,
          diff_pct: benchmark?.value
            ? Math.round(((um.value - benchmark.value) / benchmark.value) * 100)
            : null,
        }
      }),
    }
  })

  // Rank user against sectors. When nobody else has published a benchmark
  // for a metric yet, `has_cohort` is false and percentile is null — the
  // frontend should show "not enough data" rather than treating a lone
  // data point as a real #1 rank.
  const rankings = userMetrics.map(um => {
    const allValues = allSectors
      .map(s => sectorBenchmarks[s]?.[um.key]?.value)
      .filter((v): v is number => v != null)
    const hasCohort = allValues.length > 0
    allValues.push(um.value)
    allValues.sort((a, b) => um.key === 'refund_rate' ? a - b : b - a) // lower is better for refund rate
    const rank = allValues.indexOf(um.value) + 1
    return {
      ...um,
      rank,
      total: allValues.length,
      percentile: hasCohort ? Math.round(((allValues.length - rank) / (allValues.length - 1)) * 100) : null,
      has_cohort: hasCohort,
    }
  })

  return NextResponse.json({
    user_sector: userSector,
    user_region: userRegion,
    user_metrics: userMetrics,
    rankings,
    sector_comparisons: sectorComparisons.sort((a, b) => (a.is_user_sector ? -1 : b.is_user_sector ? 1 : a.sector.localeCompare(b.sector))),
    data_quality: {
      has_ecommerce: (userUnified?.length || 0) > 0,
      has_pos: (userPosTx?.length || 0) > 0,
      sectors_available: allSectors.length,
    },
    currency_symbol: sym,
  })
}
