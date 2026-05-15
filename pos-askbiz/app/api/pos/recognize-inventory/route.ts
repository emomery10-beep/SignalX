export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'
import { resolvePosAuth } from '@/lib/pos-auth'

export const dynamic = 'force-dynamic'

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
1. Look at the image carefully and determine WHAT FORM the product is in:
   - Is it LOOSE/BULK (unpackaged raw ingredients like seeds, grains, spices in a bag or container)?
   - Is it a BRANDED/PACKAGED product (bottle, box, jar with a label)?
2. Match ONLY to inventory items that match BOTH the product AND its form. For example:
   - Loose sesame seeds must match "Loose Sesame Seeds per Kilo", NOT "Sesame Oil 250ml"
   - A bottle of oil must match the oil product, NOT loose seeds
   - "per Kilo" or "Loose" items are raw bulk ingredients, NOT packaged goods
3. If you find a match, return the EXACT name from the inventory list
4. If no match in inventory, identify the product as best you can
5. The "FREQUENTLY RECOGNIZED" list is for reference only — still match based on what you actually SEE
6. Set HIGH confidence (80-100) if you can clearly identify it
7. Set MEDIUM confidence (50-79) if you recognize the product type but are unsure of exact match
8. Set LOW confidence (below 50) if it's too blurry or unidentifiable

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

    console.log('🔍 RECOGNITION:', { productName, confidence, inventoryCount: inventoryList?.length })

    // If confidence is too low or no name, return empty
    if (!productName || confidence < 50) {
      console.log('❌ LOW CONFIDENCE - REJECTED:', { productName, confidence })
      return NextResponse.json({ products: [] })
    }

    // Try exact match first
    let match = inventoryList?.find(p => p.name.toLowerCase() === productName.toLowerCase())
    if (match) console.log('✓ EXACT MATCH:', match.name)

    // If no exact match, use smart fuzzy matching - require ALL major words to be present
    // and also check that the inventory item's major words are mostly covered (bidirectional)
    if (!match && inventoryList && inventoryList.length > 0) {
      const stopWords = new Set(['the','a','an','of','per','and','in','for','with'])
      const words = productName.split(/\s+/).map(w => w.toLowerCase()).filter(w => w && !stopWords.has(w))
      const scored = inventoryList.map(item => {
        const itemWords = item.name.toLowerCase().split(/\s+/).filter(w => !stopWords.has(w))
        const forwardMatch = words.filter(w => itemWords.some(iw => iw.includes(w) || w.includes(iw))).length
        const reverseMatch = itemWords.filter(iw => words.some(w => iw.includes(w) || w.includes(iw))).length
        const forwardRatio = words.length > 0 ? forwardMatch / words.length : 0
        const reverseRatio = itemWords.length > 0 ? reverseMatch / itemWords.length : 0
        return { item, forwardMatch, reverseMatch, forwardRatio, reverseRatio, totalWords: words.length, itemWordCount: itemWords.length }
      }).sort((a, b) => (b.forwardRatio + b.reverseRatio) - (a.forwardRatio + a.reverseRatio))

      console.log('🔎 FUZZY ATTEMPT:', { words, topMatch: scored[0]?.item?.name, forward: scored[0]?.forwardRatio, reverse: scored[0]?.reverseRatio })

      // Require all recognized words match AND at least 50% of inventory item words match back
      if (scored[0].forwardRatio === 1 && scored[0].reverseRatio >= 0.5 && scored[0].totalWords > 0) {
        match = scored[0].item
        console.log('✓ FUZZY MATCH:', match.name)
      } else if (scored[0]?.totalWords > 0) {
        console.log('❌ FUZZY FAILED:', { reason: `forward=${scored[0].forwardRatio}, reverse=${scored[0].reverseRatio}` })
      }
    }

    // If we found a match in inventory, return it with the ID
    if (match) {
      // Skip logging for now - focus on camera working first

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
