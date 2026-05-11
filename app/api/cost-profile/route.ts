// ============================================================
// /api/cost-profile
// Aggregates unified_data into a cost intelligence profile
// Used to pre-fill FX Risk, Landed Cost, Supplier Scorecard
// and inject into chat context for learned responses
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export interface ProductLineProfile {
  sku:              string
  product_name:     string
  category:         string
  supplier:         string
  channel:          string
  currency:         string
  avg_cost_price:   number
  avg_sell_price:   number
  avg_gross_margin: number  // percentage
  avg_shipping:     number
  avg_marketplace_fee: number
  monthly_units:    number
  monthly_revenue:  number
  monthly_spend:    number  // cost_price * units
  data_points:      number  // number of records averaged
}

export interface SupplierProfile {
  supplier:         string
  monthly_spend:    number
  currencies:       string[]
  product_count:    number
  avg_margin:       number
}

export interface CostProfile {
  // Summary
  total_monthly_spend:    number
  total_monthly_revenue:  number
  avg_gross_margin:       number
  primary_currency:       string
  import_currencies:      string[]
  connected_sources:      string[]
  data_from_days:         number
  last_updated:           string

  // Product lines — for Landed Cost pre-fill
  product_lines:          ProductLineProfile[]

  // Suppliers — for FX Risk and Supplier Scorecard pre-fill
  suppliers:              SupplierProfile[]

  // FX Risk pre-fill
  fx_risk: {
    primary_import_currency:  string
    monthly_import_spend:     number
    top_currency_exposures:   Array<{ currency: string; monthly_spend: number; pct: number }>
  }

  // Manual overrides applied on top of connected data
  overrides:              Record<string, unknown>

  // Data quality
  has_cost_data:          boolean  // whether cost_price is populated
  has_margin_data:        boolean  // whether gross_margin is populated
  source_count:           number
}

// ── GET /api/cost-profile ─────────────────────────────────────
export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const days = 90
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

  // 1. Pull unified data for last 90 days
  const { data: records, error } = await supabase
    .from('unified_data')
    .select(`
      sku, product_name, category, supplier, channel, currency,
      cost_price, selling_price, gross_margin, net_margin,
      shipping_cost, marketplace_fee, units_sold,
      gross_revenue, net_revenue, total_cost, source_type, record_date
    `)
    .eq('user_id', user.id)
    .gte('record_date', since.split('T')[0])
    .order('record_date', { ascending: false })
    .limit(2000)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 2. Pull connected sources
  const { data: sources } = await supabase
    .from('data_sources')
    .select('source_type, status')
    .eq('user_id', user.id)
    .eq('status', 'active')

  // 3. Pull manual overrides
  const { data: overridesRow } = await supabase
    .from('cost_profile_overrides')
    .select('overrides')
    .eq('user_id', user.id)
    .single()

  const overrides = (overridesRow?.overrides as Record<string, unknown>) || {}
  const connectedSources = sources?.map(s => s.source_type) || []

  if (!records || records.length === 0) {
    // No unified data yet — return empty profile with source info
    return NextResponse.json({
      total_monthly_spend: 0,
      total_monthly_revenue: 0,
      avg_gross_margin: 0,
      primary_currency: 'GBP',
      import_currencies: [],
      connected_sources: connectedSources,
      data_from_days: days,
      last_updated: new Date().toISOString(),
      product_lines: [],
      suppliers: [],
      fx_risk: { primary_import_currency: 'USD', monthly_import_spend: 0, top_currency_exposures: [] },
      overrides,
      has_cost_data: false,
      has_margin_data: false,
      source_count: connectedSources.length,
    } as CostProfile)
  }

  // 4. Aggregate by SKU → product lines
  const skuMap = new Map<string, {
    product_name: string; category: string; supplier: string
    channel: string; currency: string
    costs: number[]; prices: number[]; margins: number[]
    shipping: number[]; fees: number[]
    units: number; revenue: number; spend: number
  }>()

  for (const r of records) {
    const key = r.sku || r.product_name || 'Unknown'
    if (!skuMap.has(key)) {
      skuMap.set(key, {
        product_name: r.product_name || key,
        category:     r.category || '',
        supplier:     r.supplier  || '',
        channel:      r.channel   || '',
        currency:     r.currency  || 'GBP',
        costs: [], prices: [], margins: [], shipping: [], fees: [],
        units: 0, revenue: 0, spend: 0,
      })
    }
    const s = skuMap.get(key)!
    if (r.cost_price > 0)     s.costs.push(r.cost_price)
    if (r.selling_price > 0)  s.prices.push(r.selling_price)
    if (r.gross_margin !== 0) s.margins.push(r.gross_margin)
    if (r.shipping_cost > 0)  s.shipping.push(r.shipping_cost)
    if (r.marketplace_fee > 0)s.fees.push(r.marketplace_fee)
    s.units   += r.units_sold || 0
    s.revenue += r.gross_revenue || 0
    s.spend   += (r.cost_price || 0) * (r.units_sold || 0)
  }

  const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0

  const product_lines: ProductLineProfile[] = Array.from(skuMap.entries())
    .map(([sku, d]) => ({
      sku,
      product_name:        d.product_name,
      category:            d.category,
      supplier:            d.supplier,
      channel:             d.channel,
      currency:            d.currency,
      avg_cost_price:      Math.round(avg(d.costs) * 100) / 100,
      avg_sell_price:      Math.round(avg(d.prices) * 100) / 100,
      avg_gross_margin:    Math.round(avg(d.margins) * 10) / 10,
      avg_shipping:        Math.round(avg(d.shipping) * 100) / 100,
      avg_marketplace_fee: Math.round(avg(d.fees) * 100) / 100,
      monthly_units:       Math.round(d.units / (days / 30)),
      monthly_revenue:     Math.round(d.revenue / (days / 30)),
      monthly_spend:       Math.round(d.spend / (days / 30)),
      data_points:         d.costs.length || d.prices.length,
    }))
    .filter(p => p.avg_cost_price > 0 || p.avg_sell_price > 0)
    .sort((a, b) => b.monthly_revenue - a.monthly_revenue)
    .slice(0, 20)  // top 20 by revenue

  // 5. Aggregate by supplier
  const supplierMap = new Map<string, { spend: number; currencies: Set<string>; skus: Set<string>; margins: number[] }>()
  for (const r of records) {
    const key = r.supplier || 'Unknown'
    if (!supplierMap.has(key)) supplierMap.set(key, { spend: 0, currencies: new Set(), skus: new Set(), margins: [] })
    const s = supplierMap.get(key)!
    s.spend += (r.cost_price || 0) * (r.units_sold || 0)
    if (r.currency) s.currencies.add(r.currency)
    if (r.sku) s.skus.add(r.sku)
    if (r.gross_margin) s.margins.push(r.gross_margin)
  }

  const suppliers: SupplierProfile[] = Array.from(supplierMap.entries())
    .map(([supplier, d]) => ({
      supplier,
      monthly_spend:  Math.round(d.spend / (days / 30)),
      currencies:     Array.from(d.currencies),
      product_count:  d.skus.size,
      avg_margin:     Math.round(avg(d.margins) * 10) / 10,
    }))
    .filter(s => s.monthly_spend > 0)
    .sort((a, b) => b.monthly_spend - a.monthly_spend)

  // 6. FX Risk aggregation — group spend by currency
  const currencySpend = new Map<string, number>()
  let totalSpend = 0
  for (const r of records) {
    const cur = r.currency || 'GBP'
    const spend = (r.cost_price || 0) * (r.units_sold || 0)
    currencySpend.set(cur, (currencySpend.get(cur) || 0) + spend)
    totalSpend += spend
  }

  const monthlyTotalSpend = totalSpend / (days / 30)
  const importCurrencies = Array.from(currencySpend.keys()).filter(c => c !== 'GBP')
  const primaryImportCurrency = importCurrencies.length > 0
    ? Array.from(currencySpend.entries())
        .filter(([c]) => c !== 'GBP')
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'USD'
    : 'USD'

  const topCurrencyExposures = Array.from(currencySpend.entries())
    .filter(([c]) => c !== 'GBP')
    .map(([currency, spend]) => ({
      currency,
      monthly_spend: Math.round(spend / (days / 30)),
      pct: totalSpend > 0 ? Math.round((spend / totalSpend) * 100) : 0,
    }))
    .sort((a, b) => b.monthly_spend - a.monthly_spend)

  // 7. Overall stats
  const totalRevenue = records.reduce((s, r) => s + (r.gross_revenue || 0), 0)
  const allMargins = records.filter(r => r.gross_margin !== 0).map(r => r.gross_margin)
  const avgMargin = Math.round(avg(allMargins) * 10) / 10
  const primaryCurrency = records.find(r => r.currency)?.currency || 'GBP'
  const hasCostData = records.some(r => r.cost_price > 0)
  const hasMarginData = records.some(r => r.gross_margin !== 0)

  const profile: CostProfile = {
    total_monthly_spend:   Math.round(monthlyTotalSpend),
    total_monthly_revenue: Math.round(totalRevenue / (days / 30)),
    avg_gross_margin:      avgMargin,
    primary_currency:      primaryCurrency,
    import_currencies:     importCurrencies,
    connected_sources:     connectedSources,
    data_from_days:        days,
    last_updated:          new Date().toISOString(),
    product_lines,
    suppliers,
    fx_risk: {
      primary_import_currency:  primaryImportCurrency,
      monthly_import_spend:     Math.round(monthlyTotalSpend),
      top_currency_exposures:   topCurrencyExposures,
    },
    overrides,
    has_cost_data:  hasCostData,
    has_margin_data: hasMarginData,
    source_count:   connectedSources.length,
  }

  return NextResponse.json(profile)
}

// ── POST /api/cost-profile — save manual overrides ────────────
export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { overrides } = body

  if (!overrides || typeof overrides !== 'object') {
    return NextResponse.json({ error: 'Invalid overrides' }, { status: 400 })
  }

  // Merge with existing overrides
  const { data: existing } = await supabase
    .from('cost_profile_overrides')
    .select('overrides')
    .eq('user_id', user.id)
    .single()

  const merged = { ...(existing?.overrides || {}), ...overrides }

  await supabase
    .from('cost_profile_overrides')
    .upsert({ user_id: user.id, overrides: merged, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })

  return NextResponse.json({ success: true, overrides: merged })
}
