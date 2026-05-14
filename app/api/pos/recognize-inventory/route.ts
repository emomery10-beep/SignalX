import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'
import { resolvePosAuth } from '@/lib/pos-auth'

// CORS handled globally by next.config.js
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

// Escape ILIKE special chars to prevent injection
function escapeLike(s: string) {
  return s.replace(/[%_\\]/g, c => `\\${c}`)
}

export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req, 'inventory')
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  try {
    const { image } = await req.json()
    if (!image) return NextResponse.json({ error: 'image required' }, { status: 400 })

    const service = createServiceClient()

    // Fetch this owner's inventory to use as context for AI
    const { data: inventoryList } = await service
      .from('inventory')
      .select('id, name, sale_price, cost_price, stock_qty, unit')
      .eq('owner_id', auth.ownerId)
      .eq('active', true)
      .order('name')

    const catalogueText = (inventoryList || [])
      .slice(0, 200) // Limit to 200 products to stay within token limits
      .map(p => `- ${p.name}${p.stock_qty > 0 ? ` (${p.stock_qty} in stock)` : ' (OUT OF STOCK)'}`)
      .join('\n')

    const anthropic = new Anthropic()
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: 'image/jpeg', data: image },
          },
          {
            type: 'text',
            text: `You are a retail inventory assistant. Look at this image and identify the product.

THIS STORE'S INVENTORY (what products actually exist):
${catalogueText || '(Empty inventory)'}

TASK:
1. Identify what product is shown in the image
2. If it matches something in the store's inventory above, give its EXACT name from the list
3. If the product is NOT in the inventory list, say you cannot match it
4. Only return products that exist in the store

Reply with ONLY valid JSON:
{"name":"exact product name from inventory or null if no match","confidence":90}

If unsure or product not in inventory, set confidence below 50.`,
          },
        ],
      }],
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      return NextResponse.json({ products: [] })
    }

    const jsonMatch = content.text.trim().match(/\{[\s\S]*?\}/)
    if (!jsonMatch) {
      return NextResponse.json({ products: [] })
    }

    let parsed: { name?: string; confidence?: number }
    try {
      parsed = JSON.parse(jsonMatch[0])
    } catch {
      return NextResponse.json({ products: [] })
    }

    const productName = (parsed.name || '').trim()
    const confidence = typeof parsed.confidence === 'number' ? parsed.confidence : 0

    // If confidence is too low or no name, return empty
    if (!productName || confidence < 50) {
      return NextResponse.json({ products: [] })
    }

    // Try exact match first
    let match = inventoryList?.find(p => p.name.toLowerCase() === productName.toLowerCase())

    // If no exact match, use fuzzy matching (split name into words and score)
    if (!match && inventoryList && inventoryList.length > 0) {
      const words = productName.split(/\s+/).slice(0, 4).map(escapeLike).filter(Boolean)
      const scored = inventoryList.map(item => {
        const nameLower = item.name.toLowerCase()
        const score = words.filter(w => nameLower.includes(w.toLowerCase())).length
        return { item, score }
      }).sort((a, b) => b.score - a.score)

      if (scored[0].score > 0) {
        match = scored[0].item
      }
    }

    // Only return if we found a match
    if (!match) {
      return NextResponse.json({ products: [] })
    }

    return NextResponse.json({
      products: [
        {
          id: match.id,
          name: match.name,
          sale_price: match.sale_price,
          cost_price: match.cost_price,
          stock_qty: match.stock_qty,
          unit: match.unit || 'item',
          confidence,
          quantity: 1,
        },
      ],
    })
  } catch (err: any) {
    console.error('recognize-inventory error:', err)
    return NextResponse.json({ error: err.message || 'Recognition failed' }, { status: 500 })
  }
}
