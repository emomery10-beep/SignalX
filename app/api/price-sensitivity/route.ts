import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const ninetyDaysAgo = new Date(Date.now() - 90 * 86400000).toISOString().split('T')[0]
  const fortyFiveDaysAgo = new Date(Date.now() - 45 * 86400000).toISOString().split('T')[0]

  const { data: records } = await supabase
    .from('unified_data')
    .select('product_name, sku, selling_price, cost_price, units_sold, gross_revenue, gross_margin, record_date, channel')
    .eq('user_id', user.id)
    .gte('record_date', ninetyDaysAgo)
    .order('record_date', { ascending: true })
    .limit(5000)

  if (!records?.length) {
    return NextResponse.json({ products: [], insights: [] })
  }

  // Group by product, split into two 45-day periods
  const productMap: Record<string, {
    name: string; channel: string
    p1: { prices: number[]; units: number; revenue: number; costPrices: number[] }
    p2: { prices: number[]; units: number; revenue: number; costPrices: number[] }
  }> = {}

  for (const r of records) {
    const key = r.sku || r.product_name || 'Unknown'
    if (!productMap[key]) {
      productMap[key] = {
        name: r.product_name || key,
        channel: r.channel || '',
        p1: { prices: [], units: 0, revenue: 0, costPrices: [] },
        p2: { prices: [], units: 0, revenue: 0, costPrices: [] },
      }
    }
    const d = productMap[key]
    const period = r.record_date < fortyFiveDaysAgo ? 'p1' : 'p2'
    if (r.selling_price > 0) d[period].prices.push(r.selling_price)
    if (r.cost_price > 0) d[period].costPrices.push(r.cost_price)
    d[period].units += r.units_sold || 0
    d[period].revenue += r.gross_revenue || 0
  }

  const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0

  const products = Object.entries(productMap)
    .filter(([_, d]) => d.p1.prices.length > 0 && d.p2.prices.length > 0 && d.p1.units > 0)
    .map(([sku, d]) => {
      const avgP1 = avg(d.p1.prices)
      const avgP2 = avg(d.p2.prices)
      const priceChangePct = avgP1 > 0 ? ((avgP2 - avgP1) / avgP1) * 100 : 0
      const volumeChangePct = d.p1.units > 0 ? ((d.p2.units - d.p1.units) / d.p1.units) * 100 : 0

      // Price elasticity = % change in quantity / % change in price
      const elasticity = priceChangePct !== 0 ? volumeChangePct / priceChangePct : 0

      const currentPrice = avgP2
      const currentCost = avg(d.p2.costPrices) || avg(d.p1.costPrices)
      const currentMargin = currentPrice > 0 ? ((currentPrice - currentCost) / currentPrice) * 100 : 0

      const revenueP1 = d.p1.revenue || avgP1 * d.p1.units
      const revenueP2 = d.p2.revenue || avgP2 * d.p2.units
      const revenueChangePct = revenueP1 > 0 ? ((revenueP2 - revenueP1) / revenueP1) * 100 : 0

      // Sensitivity classification
      let sensitivity: 'elastic' | 'inelastic' | 'unit_elastic' | 'inverse' | 'stable'
      if (Math.abs(priceChangePct) < 2) sensitivity = 'stable'
      else if (elasticity < -1.5) sensitivity = 'elastic' // big volume drop when price rises
      else if (elasticity > 0.5 && priceChangePct > 0) sensitivity = 'inverse' // volume UP when price UP
      else if (Math.abs(elasticity) < 0.5) sensitivity = 'inelastic'
      else sensitivity = 'unit_elastic'

      // Pricing opportunity
      let opportunity: string | null = null
      if (sensitivity === 'inelastic' && currentMargin < 40) {
        opportunity = 'Price increase safe — demand barely affected'
      } else if (sensitivity === 'elastic' && priceChangePct > 0) {
        opportunity = 'Consider reverting price increase — significant volume loss'
      } else if (sensitivity === 'inverse') {
        opportunity = 'Premium positioning works — higher price drives more demand'
      } else if (sensitivity === 'stable' && currentMargin < 25) {
        opportunity = 'Low margin with stable demand — test a small price increase'
      }

      return {
        sku,
        name: d.name,
        channel: d.channel,
        current_price: Math.round(avgP2 * 100) / 100,
        prev_price: Math.round(avgP1 * 100) / 100,
        price_change_pct: Math.round(priceChangePct * 10) / 10,
        volume_change_pct: Math.round(volumeChangePct * 10) / 10,
        revenue_change_pct: Math.round(revenueChangePct * 10) / 10,
        elasticity: Math.round(elasticity * 100) / 100,
        margin_pct: Math.round(currentMargin * 10) / 10,
        sensitivity,
        opportunity,
        monthly_units: Math.round(d.p2.units / 1.5),
        monthly_revenue: Math.round(d.p2.revenue / 1.5),
      }
    })
    .sort((a, b) => Math.abs(b.elasticity) - Math.abs(a.elasticity))

  // Generate insights
  const insights: string[] = []
  const elastic = products.filter(p => p.sensitivity === 'elastic')
  const inelastic = products.filter(p => p.sensitivity === 'inelastic')
  const inverse = products.filter(p => p.sensitivity === 'inverse')

  if (elastic.length > 0) {
    insights.push(`${elastic.length} product${elastic.length > 1 ? 's are' : ' is'} price-sensitive — small price changes significantly impact sales volume.`)
  }
  if (inelastic.length > 0) {
    insights.push(`${inelastic.length} product${inelastic.length > 1 ? 's show' : ' shows'} price resilience — safe candidates for margin improvement.`)
  }
  if (inverse.length > 0) {
    insights.push(`${inverse.length} product${inverse.length > 1 ? 's perform' : ' performs'} better at higher prices — potential premium positioning.`)
  }

  const lowMarginInelastic = inelastic.filter(p => p.margin_pct < 30)
  if (lowMarginInelastic.length > 0) {
    const potentialGain = lowMarginInelastic.reduce((s, p) => s + p.monthly_revenue * 0.05, 0)
    insights.push(`${lowMarginInelastic.length} inelastic product${lowMarginInelastic.length > 1 ? 's have' : ' has'} margins under 30% — a 5% price increase could add ~£${Math.round(potentialGain)}/mo.`)
  }

  return NextResponse.json({
    products: products.slice(0, 25),
    insights,
    summary: {
      total_analysed: products.length,
      elastic: elastic.length,
      inelastic: inelastic.length,
      inverse: inverse.length,
      stable: products.filter(p => p.sensitivity === 'stable').length,
    },
  })
}
