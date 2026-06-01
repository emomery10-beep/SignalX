import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'
import { getRegionConfig } from '@/lib/region-config'

export const runtime = 'nodejs'
export const maxDuration = 30

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { totals, comparison, inventory, cash, alerts, logistics, sourceBreakdown, countryCode } = body
  const region = getRegionConfig(countryCode)

  const signals: string[] = []

  if (totals) {
    signals.push(`CURRENT PERIOD:`)
    signals.push(`Revenue: ${totals.revenue}, COGS: ${totals.cogs}, Gross Profit: ${totals.gross_profit} (${totals.gross_margin_pct}%)`)
    signals.push(`Fixed Costs: ${totals.fixed_costs}, Net Profit: ${totals.net_profit} (${totals.net_margin_pct}%)`)
  }

  if (comparison) {
    signals.push(`PRIOR PERIOD:`)
    signals.push(`Revenue: ${comparison.revenue}, Gross Profit: ${comparison.gross_profit} (${comparison.gross_margin_pct}%)`)
    const revChange = comparison.revenue > 0 ? Math.round(((totals.revenue - comparison.revenue) / comparison.revenue) * 100) : 0
    signals.push(`Revenue change: ${revChange > 0 ? '+' : ''}${revChange}%`)
  }

  if (inventory) {
    signals.push(`INVENTORY: ${inventory.total_products} products, ${inventory.low_or_oos} low/OOS (${inventory.stockout_rate}% stockout rate)`)
    signals.push(`Value at cost: ${inventory.value_at_cost}, at retail: ${inventory.value_at_retail}`)
  }

  if (cash) {
    signals.push(`CASH: Balance ${cash.balance}, Monthly fixed ${cash.monthly_fixed}, Runway: ${cash.runway_months ?? 'unknown'} months (${cash.runway_status})`)
  }

  if (logistics) {
    signals.push(`LOGISTICS: ${logistics.in_transit_count} shipments in transit, value ${logistics.in_transit_value}, avg delivery ${logistics.avg_delivery_days}d`)
    if (logistics.delayed_count > 0) signals.push(`${logistics.delayed_count} delayed shipments (${logistics.delayed_value} at risk)`)
  }

  if (sourceBreakdown && sourceBreakdown.length > 0) {
    signals.push(`REVENUE BY SOURCE:`)
    for (const s of sourceBreakdown) {
      signals.push(`  ${s.source}: revenue ${s.revenue}, COGS ${s.cogs}, margin ${s.margin_pct}%`)
    }
  }

  if (alerts && alerts.length > 0) {
    signals.push(`ACTIVE ALERTS: ${alerts.map((a: any) => `[${a.severity}] ${a.message}`).join('; ')}`)
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      messages: [{
        role: 'user',
        content: `You are a CFO advisor for a small/medium business in ${region.countryName}. Analyze these financial metrics and provide exactly 3 actionable insights. Be specific with numbers. Reference local context where relevant (${region.currencyCode}, local market conditions). No fluff.

${signals.join('\n')}

Format as JSON: {"insights": [{"title": "short title", "body": "1-2 sentence insight with specific numbers and action", "type": "opportunity|risk|action"}]}
Return ONLY valid JSON.`
      }],
    })

    const text = (response.content[0] as { type: string; text: string }).text
    const match = text.match(/\{[\s\S]*\}/)
    const parsed = match ? JSON.parse(match[0]) : { insights: [] }

    return NextResponse.json(parsed)
  } catch {
    return NextResponse.json({ insights: [] })
  }
}
