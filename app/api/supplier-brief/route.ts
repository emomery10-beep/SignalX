import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCurrencySymbol } from '@/lib/get-currency'
import Anthropic from '@anthropic-ai/sdk'
import { logUsage } from '@/lib/log-usage'

export const runtime = 'nodejs'
export const maxDuration = 30

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// In-process cache: prevents repeat Claude calls when users tab-switch or refresh.
// Per-user, 2h TTL. Supplier data doesn't change that fast.
const CACHE = new Map<string, { data: unknown; at: number }>()
const CACHE_TTL_MS = 2 * 60 * 60 * 1000

export async function GET(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const supplierName = searchParams.get('supplier')
  const cacheKey = `${user.id}:${supplierName || ''}`
  const cached = CACHE.get(cacheKey)
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return NextResponse.json(cached.data)
  }

  const sym = await getCurrencySymbol(supabase, user.id)

  const days = 90
  const since = new Date(Date.now() - days * 86400000).toISOString().split('T')[0]
  const prevSince = new Date(Date.now() - days * 2 * 86400000).toISOString().split('T')[0]

  // Get all supplier data
  const [{ data: current }, { data: previous }] = await Promise.all([
    supabase
      .from('unified_data')
      .select('supplier, product_name, cost_price, selling_price, gross_margin, units_sold, gross_revenue, total_cost, currency, shipping_cost, record_date')
      .eq('user_id', user.id)
      .gte('record_date', since)
      .limit(3000),
    supabase
      .from('unified_data')
      .select('supplier, cost_price, units_sold, total_cost')
      .eq('user_id', user.id)
      .gte('record_date', prevSince)
      .lt('record_date', since)
      .limit(3000),
  ])

  // Aggregate by supplier
  const supplierMap: Record<string, {
    products: Set<string>; totalSpend: number; totalRevenue: number; totalUnits: number
    totalShipping: number; currencies: Set<string>
    costPrices: number[]; margins: number[]
    prevSpend: number; prevUnits: number
  }> = {}

  for (const r of current || []) {
    const s = r.supplier || 'Unknown'
    if (!supplierMap[s]) {
      supplierMap[s] = { products: new Set(), totalSpend: 0, totalRevenue: 0, totalUnits: 0, totalShipping: 0, currencies: new Set(), costPrices: [], margins: [], prevSpend: 0, prevUnits: 0 }
    }
    const d = supplierMap[s]
    if (r.product_name) d.products.add(r.product_name)
    d.totalSpend += (r.cost_price || 0) * (r.units_sold || 0)
    d.totalRevenue += r.gross_revenue || 0
    d.totalUnits += r.units_sold || 0
    d.totalShipping += r.shipping_cost || 0
    if (r.currency) d.currencies.add(r.currency)
    if (r.cost_price > 0) d.costPrices.push(r.cost_price)
    if (r.gross_margin) d.margins.push(r.gross_margin)
  }

  for (const r of previous || []) {
    const s = r.supplier || 'Unknown'
    if (supplierMap[s]) {
      supplierMap[s].prevSpend += (r.cost_price || 0) * (r.units_sold || 0)
      supplierMap[s].prevUnits += r.units_sold || 0
    }
  }

  const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0

  const suppliers = Object.entries(supplierMap)
    .filter(([name]) => !supplierName || name.toLowerCase().includes(supplierName.toLowerCase()))
    .map(([name, d]) => {
      const monthlySpend = d.totalSpend / (days / 30)
      const prevMonthlySpend = d.prevSpend / (days / 30)
      const spendTrend = prevMonthlySpend > 0 ? ((monthlySpend - prevMonthlySpend) / prevMonthlySpend) * 100 : 0
      const avgCost = avg(d.costPrices)
      const avgMargin = avg(d.margins)

      return {
        name,
        product_count: d.products.size,
        products: Array.from(d.products).slice(0, 10),
        monthly_spend: Math.round(monthlySpend),
        total_spend_90d: Math.round(d.totalSpend),
        total_revenue_90d: Math.round(d.totalRevenue),
        total_units_90d: d.totalUnits,
        avg_cost_price: Math.round(avgCost * 100) / 100,
        avg_margin: Math.round(avgMargin * 10) / 10,
        shipping_90d: Math.round(d.totalShipping),
        currencies: Array.from(d.currencies),
        spend_trend_pct: Math.round(spendTrend),
        dependency_pct: 0,
      }
    })
    .filter(s => s.monthly_spend > 0)
    .sort((a, b) => b.monthly_spend - a.monthly_spend)

  // Calculate dependency
  const totalSpend = suppliers.reduce((s, sup) => s + sup.monthly_spend, 0)
  for (const s of suppliers) {
    s.dependency_pct = totalSpend > 0 ? Math.round((s.monthly_spend / totalSpend) * 100) : 0
  }

  // Generate AI brief for specific supplier or top supplier
  const targetSupplier = supplierName
    ? suppliers.find(s => s.name.toLowerCase().includes(supplierName.toLowerCase()))
    : suppliers[0]

  let brief: string | null = null
  if (targetSupplier) {
    const signals = [
      `SUPPLIER: ${targetSupplier.name}`,
      `Monthly spend: ${sym}${targetSupplier.monthly_spend} (${targetSupplier.spend_trend_pct > 0 ? '+' : ''}${targetSupplier.spend_trend_pct}% vs prev quarter)`,
      `Products: ${targetSupplier.products.join(', ')}`,
      `Avg cost price: ${sym}${targetSupplier.avg_cost_price}`,
      `Your margin on their products: ${targetSupplier.avg_margin}%`,
      `90-day volume: ${targetSupplier.total_units_90d} units`,
      `Shipping costs: ${sym}${targetSupplier.shipping_90d}`,
      `Dependency: ${targetSupplier.dependency_pct}% of total spend`,
      `Currencies: ${targetSupplier.currencies.join(', ')}`,
      targetSupplier.spend_trend_pct > 10 ? `⚠ Spend rising fast — costs may be increasing` : '',
      targetSupplier.dependency_pct > 40 ? `⚠ High dependency on this supplier — diversification risk` : '',
      targetSupplier.avg_margin < 30 ? `⚠ Below-average margin on this supplier's products` : '',
    ].filter(Boolean).join('\n')

    try {
      const response = await anthropic.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 600,
        messages: [{ role: 'user', content: `You are a procurement strategist. Generate a concise negotiation brief for renegotiating terms with this supplier.

${signals}

Format as JSON: {"leverage_points": ["point1", "point2", "point3"], "risks": ["risk1", "risk2"], "recommended_ask": "what to ask for", "talking_points": ["point1", "point2", "point3"], "timing": "when to negotiate"}
Return ONLY valid JSON.` }],
      })
      logUsage({ route: 'supplier-brief', model: 'claude-haiku-4-5', usage: response.usage, userId: user.id })

      const text = (response.content[0] as { type: string; text: string }).text
      brief = text
    } catch {
      brief = null
    }
  }

  const result = {
    suppliers: suppliers.slice(0, 15),
    total_monthly_spend: totalSpend,
    brief: brief ? tryParse(brief) : null,
    brief_supplier: targetSupplier?.name || null,
    currency_symbol: sym,
  }
  CACHE.set(cacheKey, { data: result, at: Date.now() })
  return NextResponse.json(result)
}

function tryParse(text: string) {
  try {
    const match = text.match(/\{[\s\S]*\}/)
    return match ? JSON.parse(match[0]) : { raw: text }
  } catch {
    return { raw: text }
  }
}
