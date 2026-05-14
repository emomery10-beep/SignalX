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
    const { data: inventoryList, error: invErr } = await service
      .from('inventory')
      .select('id, name, sale_price, cost_price, stock_qty, unit')
      .eq('owner_id', auth.ownerId)
      .eq('active', true)
      .order('name')

    if (invErr) {
      console.error('Inventory fetch error:', invErr)
      return NextResponse.json({ error: 'Failed to fetch inventory: ' + invErr.message }, { status: 500 })
    }

    // Fetch hot list (frequently recognized products) to boost accuracy
    const { data: hotList } = await service
      .from('product_hot_list')
      .select('recognized_name, recognition_count')
      .eq('owner_id', auth.ownerId)
      .order('recognition_count', { ascending: false })
      .limit(20)

    const catalogueText = (inventoryList || [])
      .slice(0, 200) // Limit to 200 products to stay within token limits
      .map(p => `- ${p.name}${p.stock_qty > 0 ? ` (${p.stock_qty} in stock)` : ' (OUT OF STOCK)'}`)
      .join('\n')

    const hotListText = (hotList || []).length > 0
      ? `\n\nFREQUENTLY RECOGNIZED (prioritize these):\n${hotList.map(h => `- ${h.recognized_name}`).join('\n')}`
      : ''

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

THIS STORE'S INVENTORY (reference list):
${catalogueText || '(Empty inventory)'}${hotListText}

TASK:
1. Identify what product is shown in the image - be specific with brand, size, type
2. PRIORITIZE products in the "FREQUENTLY RECOGNIZED" list - these are the store's most common items
3. If it matches something in the store's inventory list, give its EXACT name from the list
4. If the product is NOT in the inventory list, give your best product identification anyway
5. Set HIGH confidence (80-100) if you can clearly see and read product branding/label with certainty
6. Set MEDIUM confidence (50-79) if you can visually identify the product type (e.g., can see it's milk, bread, rice) even if no brand is visible
7. Set LOW confidence (below 50) if it's too blurry, obscured, or truly unidentifiable

Reply with ONLY valid JSON, no other text:
{"name":"product name","confidence":70}`,
          },
        ],
      }],
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      console.error('Unexpected response type:', content.type)
      return NextResponse.json({ products: [] })
    }

    console.log('Claude response:', content.text)
    const jsonMatch = content.text.trim().match(/\{[\s\S]*?\}/)
    if (!jsonMatch) {
      console.error('No JSON found in response:', content.text)
      return NextResponse.json({ products: [] })
    }

    let parsed: { name?: string; confidence?: number }
    try {
      parsed = JSON.parse(jsonMatch[0])
    } catch (e) {
      console.error('JSON parse error:', e, 'raw:', jsonMatch[0])
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

      // Require at least 60% of words to match (works for all product name lengths)
      const minMatches = Math.max(1, Math.ceil(words.length * 0.6))
      if (scored[0].score >= minMatches) {
        match = scored[0].item
      }
    }

    // If we found a match in inventory, return it with the ID
    if (match) {
      // Log successful recognition
      await service
        .from('recognition_history')
        .insert({
          owner_id: auth.ownerId,
          inventory_id: match.id,
          recognized_name: productName,
          confidence,
          is_match: true,
          confirmed: true,
          source: 'inventory'
        })
        .catch(err => console.error('Failed to log recognition:', err))

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
            matched: true, // Flag: this is an existing product
          },
        ],
      })
    }

    // No inventory match found, but Claude identified something
    // Return the raw recognition so user can add it as new product
    // (This allows recognizing new products not yet in inventory)
    if (productName && confidence >= 50) {
      return NextResponse.json({
        products: [
          {
            name: productName,
            confidence,
            quantity: 1,
            matched: false, // Flag: this is a new unmatched product
            sale_price: null,
            cost_price: null,
            stock_qty: null,
          },
        ],
      })
    }

    // Very low confidence or no product identified
    return NextResponse.json({ products: [] })
  } catch (err: any) {
    console.error('recognize-inventory error:', err, err.stack)
    return NextResponse.json({ error: err.message || 'Recognition failed', details: String(err) }, { status: 500 })
  }
}
