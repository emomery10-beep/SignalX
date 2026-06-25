import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'
import { logUsage } from '@/lib/log-usage'

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

    const _groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    const _groqData = await _groqRes.json()
    const response = _groqData.choices?.[0]?.message?.content || 'Unable to generate recommendations'
    logUsage({ route: 'pos/supplier-recommendations', model: 'llama-3.3-70b-versatile', usage: { input_tokens: _groqData.usage?.prompt_tokens ?? 0, output_tokens: _groqData.usage?.completion_tokens ?? 0 }, userId: ownerId })

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
