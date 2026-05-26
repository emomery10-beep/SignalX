import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'nodejs'
export const maxDuration = 15

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { screen, cart, customer_phone, question } = await req.json()

  const service = createServiceClient()
  const now = new Date()
  const todayStart = new Date(now)
  todayStart.setHours(0, 0, 0, 0)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000).toISOString()

  // Step 1: fetch recent transaction IDs + today's stats + low stock + customer in parallel
  const [
    { data: recentTxIds },
    { data: todayTx },
    { data: lowStock },
    { data: customer },
  ] = await Promise.all([
    service
      .from('pos_transactions')
      .select('id')
      .eq('owner_id', auth.ownerId)
      .eq('status', 'completed')
      .gte('created_at', sevenDaysAgo)
      .limit(200),

    service
      .from('pos_transactions')
      .select('total')
      .eq('owner_id', auth.ownerId)
      .eq('status', 'completed')
      .gte('created_at', todayStart.toISOString())
      .limit(200),

    service
      .from('inventory')
      .select('name, stock_qty, low_stock_threshold')
      .eq('owner_id', auth.ownerId)
      .eq('active', true)
      .or('stock_qty.lte.low_stock_threshold')
      .order('stock_qty', { ascending: true })
      .limit(5),

    customer_phone
      ? service
          .from('pos_customers')
          .select('name, total_spent, visit_count, last_seen_at')
          .eq('owner_id', auth.ownerId)
          .eq('phone', customer_phone)
          .single()
      : Promise.resolve({ data: null }),
  ])

  // Step 2: fetch items from recent transactions
  const txIds = (recentTxIds || []).map(t => t.id)
  let topItems: string[] = []
  if (txIds.length > 0) {
    const { data: recentItems } = await service
      .from('pos_items')
      .select('name, qty, unit_price, cost_price')
      .in('transaction_id', txIds)
      .limit(500)

    const itemCounts: Record<string, { qty: number; revenue: number }> = {}
    for (const item of recentItems || []) {
      if (!itemCounts[item.name]) itemCounts[item.name] = { qty: 0, revenue: 0 }
      itemCounts[item.name].qty += item.qty || 1
      itemCounts[item.name].revenue += (item.unit_price || 0) * (item.qty || 1)
    }
    topItems = Object.entries(itemCounts)
      .sort((a, b) => b[1].qty - a[1].qty)
      .slice(0, 8)
      .map(([name, d]) => `${name} (${d.qty} sold, £${d.revenue.toFixed(0)})`)
  }

  const todayRevenue = (todayTx || []).reduce((s, t) => s + (t.total || 0), 0)
  const todaySales = (todayTx || []).length

  const cartTotal = (cart || []).reduce((s: number, i: any) => s + (i.unit_price || 0) * (i.qty || 1), 0)
  const cartCost = (cart || []).reduce((s: number, i: any) => s + (i.cost_price || 0) * (i.qty || 1), 0)
  const cartMargin = cartTotal > 0 ? Math.round(((cartTotal - cartCost) / cartTotal) * 100) : 0

  const context = [
    `SCREEN: ${screen || 'home'}`,
    `TODAY: ${todaySales} sales, £${todayRevenue.toFixed(2)} revenue`,
    topItems.length ? `TOP SELLERS (7 days): ${topItems.join('; ')}` : '',
    lowStock?.length ? `LOW STOCK: ${lowStock.map(i => `${i.name} (${i.stock_qty} left)`).join(', ')}` : '',
    cart?.length ? `CART (${cart.length} items, £${cartTotal.toFixed(2)}, margin ${cartMargin}%): ${cart.map((i: any) => `${i.name} x${i.qty}`).join(', ')}` : 'CART: empty',
    customer?.data ? `CUSTOMER: ${customer.data.name || 'Unknown'}, spent £${customer.data.total_spent || 0} over ${customer.data.visit_count || 0} visits` : '',
  ].filter(Boolean).join('\n')

  const userMessage = question || 'Give me a quick, helpful tip for this moment in the sale.'

  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [{ role: 'user', content: `You are a smart POS cashier copilot. Give brief, actionable tips (1-2 sentences max). Be specific — use actual product names, numbers, customer details. No fluff.

${context}

${userMessage}` }],
    })

    const text = (response.content[0] as { type: string; text: string }).text
    return NextResponse.json({ tip: text })
  } catch {
    let tip = ''
    if (lowStock?.length) {
      tip = `Heads up: ${lowStock[0].name} is running low (${lowStock[0].stock_qty} left). Consider reordering.`
    } else if (cart?.length && cartMargin < 20) {
      tip = `This cart's margin is ${cartMargin}% — below the 20% target. Consider suggesting a higher-margin add-on.`
    } else if (todaySales === 0) {
      tip = `No sales yet today. Your top seller this week is ${topItems[0] || 'N/A'}.`
    } else {
      tip = `${todaySales} sales today (£${todayRevenue.toFixed(0)}). Keep it up!`
    }
    return NextResponse.json({ tip })
  }
}
