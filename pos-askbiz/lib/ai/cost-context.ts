// ============================================================
// Cost Intelligence Context
// Detects cost/margin/landed cost intent and injects
// the user's cost profile into the chat system prompt
// ============================================================

import type { CostProfile } from '@/app/api/cost-profile/route'

// ── Intent detection ──────────────────────────────────────────
const COST_PATTERNS = [
  /landed cost/i,
  /true cost/i,
  /cost per unit/i,
  /import cost/i,
  /duty/i,
  /tariff/i,
  /freight cost/i,
  /shipping cost/i,
  /my margin/i,
  /gross margin/i,
  /net margin/i,
  /margin on/i,
  /profit margin/i,
  /fx risk/i,
  /currency risk/i,
  /exchange rate/i,
  /sterling.*fall/i,
  /pound.*drop/i,
  /supplier cost/i,
  /cost of goods/i,
  /cogs/i,
  /markup/i,
  /am i profitable/i,
  /losing money/i,
  /making money/i,
  /cost structure/i,
  /import spend/i,
  /buying price/i,
  /how much.*cost/i,
  /what.*margin/i,
]

export function detectCostIntent(text: string): boolean {
  return COST_PATTERNS.some(p => p.test(text))
}

// ── Build context string for system prompt injection ──────────
export function buildCostContext(profile: CostProfile): string {
  if (!profile || (!profile.has_cost_data && !profile.has_margin_data)) {
    return ''
  }

  const lines: string[] = []

  lines.push('--- USER COST INTELLIGENCE PROFILE ---')
  lines.push(`Data source: ${profile.connected_sources.length > 0 ? profile.connected_sources.join(', ') : 'uploaded files'} (last ${profile.data_from_days} days)`)
  lines.push(`Monthly import spend: £${profile.total_monthly_spend.toLocaleString()}`)
  lines.push(`Monthly revenue: £${profile.total_monthly_revenue.toLocaleString()}`)
  lines.push(`Average gross margin: ${profile.avg_gross_margin}%`)
  lines.push(`Primary currency: ${profile.primary_currency}`)

  if (profile.import_currencies.length > 0) {
    lines.push(`Import currencies: ${profile.import_currencies.join(', ')}`)
  }

  if (profile.fx_risk.top_currency_exposures.length > 0) {
    lines.push('\nCurrency exposure:')
    profile.fx_risk.top_currency_exposures.slice(0, 3).forEach(e => {
      lines.push(`  ${e.currency}: £${e.monthly_spend.toLocaleString()}/mo (${e.pct}% of spend)`)
    })
  }

  if (profile.product_lines.length > 0) {
    lines.push('\nTop product lines by revenue:')
    profile.product_lines.slice(0, 5).forEach(p => {
      const name = p.product_name || p.sku
      const margin = p.avg_gross_margin > 0 ? `${p.avg_gross_margin}% margin` : 'margin unknown'
      const cost = p.avg_cost_price > 0 ? `cost £${p.avg_cost_price}` : ''
      const sell = p.avg_sell_price > 0 ? `sell £${p.avg_sell_price}` : ''
      const parts = [name, margin, cost, sell].filter(Boolean)
      lines.push(`  ${parts.join(' · ')}`)
    })
  }

  if (profile.suppliers.length > 0) {
    lines.push('\nSuppliers by spend:')
    profile.suppliers.slice(0, 4).forEach(s => {
      lines.push(`  ${s.supplier}: £${s.monthly_spend.toLocaleString()}/mo · ${s.product_count} products · ${s.avg_margin}% avg margin`)
    })
  }

  // Apply any manual overrides the user has set
  if (Object.keys(profile.overrides).length > 0) {
    lines.push('\nUser-confirmed values (use these over calculated values):')
    Object.entries(profile.overrides).forEach(([k, v]) => {
      lines.push(`  ${k}: ${v}`)
    })
  }

  lines.push('\nIMPORTANT: Use these real numbers in your answer. Do not use generic examples. Reference the user\'s actual products, margins, and costs by name.')
  lines.push('--- END COST PROFILE ---')

  return lines.join('\n')
}

// ── Fetch profile server-side for chat injection ──────────────
export async function fetchCostProfile(
  supabase: ReturnType<typeof import('@/lib/supabase/server').createClient>,
  userId: string
): Promise<CostProfile | null> {
  try {
    const days = 90
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

    const { data: records } = await supabase
      .from('unified_data')
      .select(`
        sku, product_name, category, supplier, channel, currency,
        cost_price, selling_price, gross_margin, shipping_cost,
        marketplace_fee, units_sold, gross_revenue, source_type
      `)
      .eq('user_id', userId)
      .gte('record_date', since.split('T')[0])
      .limit(500)

    if (!records || records.length === 0) return null

    const { data: overridesRow } = await supabase
      .from('cost_profile_overrides')
      .select('overrides')
      .eq('user_id', userId)
      .single()

    const { data: sources } = await supabase
      .from('connected_sources')
      .select('source_type')
      .eq('user_id', userId)
      .eq('status', 'active')

    const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0

    const allMargins = records.filter(r => r.gross_margin !== 0).map(r => r.gross_margin)
    const totalRevenue = records.reduce((s, r) => s + (r.gross_revenue || 0), 0)
    const totalSpend = records.reduce((s, r) => s + (r.cost_price || 0) * (r.units_sold || 0), 0)

    // Quick product line summary
    const skuMap = new Map<string, { name: string; costs: number[]; prices: number[]; margins: number[]; revenue: number }>()
    for (const r of records) {
      const key = r.sku || r.product_name || 'Unknown'
      if (!skuMap.has(key)) skuMap.set(key, { name: r.product_name || key, costs: [], prices: [], margins: [], revenue: 0 })
      const s = skuMap.get(key)!
      if (r.cost_price > 0) s.costs.push(r.cost_price)
      if (r.selling_price > 0) s.prices.push(r.selling_price)
      if (r.gross_margin) s.margins.push(r.gross_margin)
      s.revenue += r.gross_revenue || 0
    }

    const product_lines = Array.from(skuMap.entries())
      .map(([sku, d]) => ({
        sku,
        product_name: d.name,
        category: '',
        supplier: '',
        channel: '',
        currency: 'GBP',
        avg_cost_price: Math.round(avg(d.costs) * 100) / 100,
        avg_sell_price: Math.round(avg(d.prices) * 100) / 100,
        avg_gross_margin: Math.round(avg(d.margins) * 10) / 10,
        avg_shipping: 0,
        avg_marketplace_fee: 0,
        monthly_units: 0,
        monthly_revenue: Math.round(d.revenue / (days / 30)),
        monthly_spend: 0,
        data_points: d.costs.length,
      }))
      .filter(p => p.avg_cost_price > 0 || p.avg_sell_price > 0)
      .sort((a, b) => b.monthly_revenue - a.monthly_revenue)
      .slice(0, 8)

    // Supplier summary
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

    const suppliers = Array.from(supplierMap.entries())
      .map(([supplier, d]) => ({
        supplier,
        monthly_spend: Math.round(d.spend / (days / 30)),
        currencies: Array.from(d.currencies),
        product_count: d.skus.size,
        avg_margin: Math.round(avg(d.margins) * 10) / 10,
      }))
      .filter(s => s.monthly_spend > 0 && s.supplier !== 'Unknown')
      .sort((a, b) => b.monthly_spend - a.monthly_spend)
      .slice(0, 6)

    const importCurrencies = [...new Set(records.map(r => r.currency).filter(c => c && c !== 'GBP'))]
    const primaryCurrency = records.find(r => r.currency)?.currency || 'GBP'

    return {
      total_monthly_spend: Math.round(totalSpend / (days / 30)),
      total_monthly_revenue: Math.round(totalRevenue / (days / 30)),
      avg_gross_margin: Math.round(avg(allMargins) * 10) / 10,
      primary_currency: primaryCurrency,
      import_currencies: importCurrencies,
      connected_sources: sources?.map(s => s.source_type) || [],
      data_from_days: days,
      last_updated: new Date().toISOString(),
      product_lines,
      suppliers,
      fx_risk: {
        primary_import_currency: importCurrencies[0] || 'USD',
        monthly_import_spend: Math.round(totalSpend / (days / 30)),
        top_currency_exposures: [],
      },
      overrides: (overridesRow?.overrides as Record<string, unknown>) || {},
      has_cost_data: records.some(r => r.cost_price > 0),
      has_margin_data: records.some(r => r.gross_margin !== 0),
      source_count: sources?.length || 0,
    }
  } catch {
    return null
  }
}
