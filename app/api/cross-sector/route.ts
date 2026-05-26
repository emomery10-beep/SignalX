import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('business_type, sector_hints, region')
    .eq('id', user.id)
    .single()

  const userSector = profile?.sector_hints?.split(',')[0]?.trim() || profile?.business_type || 'retail'
  const userRegion = profile?.region || 'UK'

  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]
  const currentPeriod = new Date().toISOString().slice(0, 7)

  // Parallel: user's own metrics + sector benchmarks + market benchmarks
  const [
    { data: userUnified },
    { data: userPosTx },
    { data: benchmarks },
    { data: productBenchmarks },
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
      .select('sector, metric, value, sample_size, period')
      .gte('sample_size', 3)
      .order('period', { ascending: false })
      .limit(500),

    supabase
      .from('global_product_catalogue')
      .select('category, avg_selling_price, avg_gross_margin, merchant_count')
      .gte('merchant_count', 3)
      .eq('period', currentPeriod)
      .limit(200),
  ])

  // Calculate user metrics
  const ecomRevenue = (userUnified || []).reduce((s, r) => s + (r.gross_revenue || 0), 0)
  const ecomCost = (userUnified || []).reduce((s, r) => s + (r.total_cost || 0), 0)
  const ecomUnits = (userUnified || []).reduce((s, r) => s + (r.units_sold || 0), 0)
  const ecomRefunds = (userUnified || []).reduce((s, r) => s + (r.refund_amount || 0), 0)

  const posRevenue = (userPosTx || []).reduce((s, t) => s + (t.total || 0), 0)
  const posDiscounts = (userPosTx || []).reduce((s, t) => s + (t.discount_amount || 0), 0)
  const posTxCount = (userPosTx || []).length

  const totalRevenue = ecomRevenue + posRevenue
  const totalCost = ecomCost
  const avgMargin = totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0
  const avgBasket = posTxCount > 0 ? posRevenue / posTxCount : (ecomUnits > 0 ? ecomRevenue / ecomUnits : 0)
  const dailyRevenue = totalRevenue / 30
  const refundRate = totalRevenue > 0 ? (ecomRefunds / totalRevenue) * 100 : 0

  // Organize benchmarks by sector -> metric
  const sectorBenchmarks: Record<string, Record<string, { value: number; sample_size: number }>> = {}
  for (const b of benchmarks || []) {
    if (!sectorBenchmarks[b.sector]) sectorBenchmarks[b.sector] = {}
    const existing = sectorBenchmarks[b.sector][b.metric]
    if (!existing || b.sample_size > existing.sample_size) {
      sectorBenchmarks[b.sector][b.metric] = { value: b.value, sample_size: b.sample_size }
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
          benchmark_value: benchmark?.value || null,
          sample_size: benchmark?.sample_size || 0,
          unit: um.unit,
          diff_pct: benchmark?.value
            ? Math.round(((um.value - benchmark.value) / benchmark.value) * 100)
            : null,
        }
      }),
    }
  })

  // Category price intelligence from product catalogue
  const categoryPrices: Record<string, { avg_price: number; avg_margin: number; merchants: number }> = {}
  for (const p of productBenchmarks || []) {
    const cat = p.category || 'Other'
    if (!categoryPrices[cat]) categoryPrices[cat] = { avg_price: 0, avg_margin: 0, merchants: 0 }
    categoryPrices[cat].avg_price = p.avg_selling_price || 0
    categoryPrices[cat].avg_margin = p.avg_gross_margin || 0
    categoryPrices[cat].merchants = p.merchant_count || 0
  }

  // Rank user against sectors
  const rankings = userMetrics.map(um => {
    const allValues = allSectors
      .map(s => sectorBenchmarks[s]?.[um.key]?.value)
      .filter((v): v is number => v != null)
    allValues.push(um.value)
    allValues.sort((a, b) => um.key === 'refund_rate' ? a - b : b - a) // lower is better for refund rate
    const rank = allValues.indexOf(um.value) + 1
    return {
      ...um,
      rank,
      total: allValues.length,
      percentile: Math.round(((allValues.length - rank) / (allValues.length - 1)) * 100) || 50,
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
  })
}
