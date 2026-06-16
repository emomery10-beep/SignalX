import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

/**
 * POST /api/pos/ai/supplier-recommendations
 *
 * Get Claude AI recommendations for suppliers based on low stock items
 * Considers: business type, location, item categories, urgency
 *
 * Body:
 *   owner_id: string
 *   owner_email: string
 *   low_stock_items: array of items with id, name, qty, reorder_qty
 */
export async function POST(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const body = await req.json()
  const { low_stock_items } = body

  if (!low_stock_items || low_stock_items.length === 0) {
    return NextResponse.json({ error: 'No items provided' }, { status: 400 })
  }

  try {
    // Get owner profile info (location, business type)
    const { data: owner } = await service
      .from('profiles')
      .select('business_type, location, country, currency_symbol')
      .eq('id', ownerId)
      .single()

    // Format items for Claude
    const itemsText = low_stock_items
      .map(
        (item: any) =>
          `- ${item.name}: ${item.qty} units left, need ${item.reorder_qty || 10} units (deficit: ${Math.max(0, (item.reorder_qty || 10) - item.qty)})`
      )
      .join('\n')

    const businessContext = owner
      ? `Business Type: ${owner.business_type || 'General Retail'}\nLocation: ${owner.location || 'Not specified'}, ${owner.country || 'UK'}`
      : 'Location: UK (default)'

    const urgencyIndicators = low_stock_items.filter((i: any) => (i.qty || 0) === 0).length

    const prompt = `You are a supply chain expert helping a small business owner urgently reorder low-stock items.

${businessContext}
Currency: ${owner?.currency_symbol || '£'}

**CRITICAL: Low Stock Items Requiring Immediate Reorder:**
${itemsText}

${urgencyIndicators > 0 ? `⚠️ URGENT: ${urgencyIndicators} item(s) are OUT OF STOCK - risk of lost sales!` : 'Items are low but not yet out of stock.'}

**Your task:**
1. Assess the urgency level (CRITICAL/HIGH/MEDIUM)
2. For each item, recommend:
   - Quantity to order
   - Top 3 LOCAL suppliers/distributors (by business type/location relevance)
   - Estimated lead time
   - Cost considerations
3. Suggest ordering methods (B2B wholesale platforms, local distributors, manufacturers)
4. Provide a priority ranking (what to order first)

**Format your response as:**
- Start with a brief urgency assessment
- List each item with specific supplier recommendations
- End with a quick action plan

Keep it practical and actionable. Include real supplier types (e.g., "Beauty wholesale distributors", "FMCG suppliers", "Direct from manufacturers").`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const response = message.content[0].type === 'text' ? message.content[0].text : 'Unable to generate recommendations'

    return NextResponse.json({
      response,
      items_analyzed: low_stock_items.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Supplier recommendation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
}
