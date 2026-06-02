import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserLocale } from '@/lib/get-currency'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { currencySymbol: sym } = await getUserLocale(supabase, user.id)

  // Fetch from both sources in parallel
  const [{ data: posProducts }, { data: unifiedProducts }] = await Promise.all([
    // POS products catalog (direct inventory)
    supabase
      .from('pos_products')
      .select('id, name, category, price, cost_price, stock_quantity, low_stock_threshold, sku, supplier, active')
      .eq('owner_id', user.id)
      .limit(500),

    // Ecommerce products from unified_data — get latest stock info per product
    // We group by product_name to get aggregate data
    supabase
      .from('unified_data')
      .select('product_name, category, source_type, sku, selling_price, cost_price, units_sold, stock_level, stock_movement, low_stock_flag')
      .eq('user_id', user.id)
      .order('record_date', { ascending: false })
      .limit(5000),
  ])

  // --- Process POS products ---
  interface ProductItem {
    name: string
    category: string
    source: string
    price: number
    cost_price: number
    stock_quantity: number
    low_stock_threshold: number
    margin_pct: number
    value_at_cost: number
    value_at_retail: number
    status: 'healthy' | 'low' | 'out'
    units_sold: number
    sku: string
  }

  const products: ProductItem[] = []
  const seenProducts = new Set<string>()

  // Add POS products
  for (const p of posProducts || []) {
    const price = p.price || 0
    const cost = p.cost_price || 0
    const qty = p.stock_quantity ?? 0
    const threshold = p.low_stock_threshold || 5
    const marginPct = price > 0 ? ((price - cost) / price) * 100 : 0
    const status: ProductItem['status'] = qty === 0 ? 'out' : qty <= threshold ? 'low' : 'healthy'
    const key = `pos:${p.name?.toLowerCase()}`
    seenProducts.add(key)

    products.push({
      name: p.name || 'Unknown',
      category: p.category || 'Uncategorized',
      source: 'POS',
      price,
      cost_price: cost,
      stock_quantity: qty,
      low_stock_threshold: threshold,
      margin_pct: Math.round(marginPct),
      value_at_cost: cost * qty,
      value_at_retail: price * qty,
      status,
      units_sold: 0,
      sku: p.sku || '',
    })
  }

  // --- Aggregate ecommerce products from unified_data ---
  // Group by product_title + source_type to get per-product metrics
  const ecomMap = new Map<string, {
    name: string; category: string; source: string; sku: string
    totalRevenue: number; totalCost: number; totalUnits: number
    latestPrice: number; latestCostPrice: number
    latestStockLevel: number; lowStockFlag: boolean
    rowCount: number
  }>()

  for (const r of unifiedProducts || []) {
    const name = r.product_name || 'Unknown'
    const source = r.source_type || 'unknown'
    const key = `${source}:${name.toLowerCase()}`

    if (!ecomMap.has(key)) {
      ecomMap.set(key, {
        name,
        category: r.category || 'Uncategorized',
        source: formatSource(source),
        sku: r.sku || '',
        totalRevenue: 0,
        totalCost: 0,
        totalUnits: 0,
        latestPrice: r.selling_price || 0,
        latestCostPrice: r.cost_price || 0,
        latestStockLevel: r.stock_level || 0,
        lowStockFlag: r.low_stock_flag || false,
        rowCount: 0,
      })
    }

    const item = ecomMap.get(key)!
    item.totalRevenue += (r.selling_price || 0) * (r.units_sold || 0)
    item.totalCost += (r.cost_price || 0) * (r.units_sold || 0)
    item.totalUnits += r.units_sold || 0
    // First row is most recent (ordered desc) — only set price/stock from first row
    if (item.rowCount === 0) {
      item.latestPrice = r.selling_price || 0
      item.latestCostPrice = r.cost_price || 0
      item.latestStockLevel = r.stock_level || 0
      item.lowStockFlag = r.low_stock_flag || false
    }
    item.rowCount++
  }

  for (const [key, item] of ecomMap) {
    // Skip if already added from POS with same name
    const posKey = `pos:${item.name.toLowerCase()}`
    if (seenProducts.has(posKey)) continue

    const price = item.latestPrice
    const cost = item.latestCostPrice
    const qty = item.latestStockLevel
    const threshold = 5
    const marginPct = price > 0 ? ((price - cost) / price) * 100 : 0
    const status: ProductItem['status'] = qty === 0 ? 'out' : qty <= threshold ? 'low' : 'healthy'

    products.push({
      name: item.name,
      category: item.category,
      source: item.source,
      price,
      cost_price: cost,
      stock_quantity: qty,
      low_stock_threshold: threshold,
      margin_pct: Math.round(marginPct),
      value_at_cost: cost * qty,
      value_at_retail: price * qty,
      status,
      units_sold: item.totalUnits,
      sku: item.sku,
    })
  }

  // --- Compute summary ---
  const outOfStock = products.filter(p => p.status === 'out').length
  const lowStock = products.filter(p => p.status === 'low').length
  const totalCost = products.reduce((s, p) => s + p.value_at_cost, 0)
  const totalRetail = products.reduce((s, p) => s + p.value_at_retail, 0)

  // Source breakdown for inventory
  const sourceMap = new Map<string, { count: number; value: number; lowOrOos: number }>()
  for (const p of products) {
    if (!sourceMap.has(p.source)) sourceMap.set(p.source, { count: 0, value: 0, lowOrOos: 0 })
    const s = sourceMap.get(p.source)!
    s.count++
    s.value += p.value_at_cost
    if (p.status !== 'healthy') s.lowOrOos++
  }

  const bySource = Array.from(sourceMap.entries())
    .map(([source, d]) => ({ source, ...d }))
    .sort((a, b) => b.value - a.value)

  // Category breakdown
  const catMap = new Map<string, { count: number; value: number; avgMargin: number; totalMargin: number }>()
  for (const p of products) {
    if (!catMap.has(p.category)) catMap.set(p.category, { count: 0, value: 0, avgMargin: 0, totalMargin: 0 })
    const c = catMap.get(p.category)!
    c.count++
    c.value += p.value_at_cost
    c.totalMargin += p.margin_pct
  }
  const byCategory = Array.from(catMap.entries())
    .map(([category, d]) => ({ category, count: d.count, value: Math.round(d.value), avg_margin: d.count > 0 ? Math.round(d.totalMargin / d.count) : 0 }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 20)

  return NextResponse.json({
    products: products.sort((a, b) => b.value_at_cost - a.value_at_cost),
    summary: {
      total_products: products.length,
      total_value_cost: Math.round(totalCost),
      total_value_retail: Math.round(totalRetail),
      potential_profit: Math.round(totalRetail - totalCost),
      out_of_stock: outOfStock,
      low_stock: lowStock,
      healthy_stock: products.length - outOfStock - lowStock,
      stockout_rate: products.length > 0 ? Math.round(((outOfStock + lowStock) / products.length) * 100) : 0,
    },
    by_source: bySource,
    by_category: byCategory,
    currency_symbol: sym,
  })
}

function formatSource(s: string): string {
  const map: Record<string, string> = {
    shopify: 'Shopify', amazon_fba: 'Amazon', ebay: 'eBay', etsy: 'Etsy',
    pos: 'POS', stripe: 'Stripe', google_sheets: 'Sheets', manual_csv: 'CSV',
    woocommerce: 'WooCommerce', square: 'Square', tiktok_shop: 'TikTok',
    jumia: 'Jumia', takealot: 'Takealot',
  }
  return map[s] || s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ')
}
