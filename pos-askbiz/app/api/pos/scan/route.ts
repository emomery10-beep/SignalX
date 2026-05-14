import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'
import { resolvePosOwner } from '@/lib/pos-auth'  // fix #20 — use shared auth helper

// CORS handled globally by next.config.js
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

// fix #19 — escape ILIKE special chars to prevent injection
function escapeLike(s: string) {
  return s.replace(/[%_\\]/g, c => `\\${c}`)
}

export async function POST(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)  // fix #20
  if (!ownerId) return json({ error: 'Unauthorised' }, 401)

  const { image } = await req.json()
  if (!image) return json({ error: 'image required' }, 400)

  try {
    const service = createServiceClient()

    // Fetch inventory to use as context for AI
    const { data: inventoryList, error: invErr } = await service
      .from('inventory')
      .select('id, name, sale_price, cost_price, stock_qty, unit')
      .eq('owner_id', ownerId)
      .eq('active', true)
      .order('name')

    if (invErr) {
      console.error('Inventory fetch error:', invErr)
      return json({ error: 'Failed to fetch inventory' }, 500)
    }

    // Fetch hot list (frequently recognized products) to boost accuracy
    const { data: hotList } = await service
      .from('product_hot_list')
      .select('recognized_name, recognition_count')
      .eq('owner_id', ownerId)
      .order('recognition_count', { ascending: false })
      .limit(20)

    const catalogueText = (inventoryList || [])
      .slice(0, 200)
      .map(p => `- ${p.name}${p.stock_qty > 0 ? ` (${p.stock_qty} in stock)` : ' (OUT OF STOCK)'}`)
      .join('\n')

    const hotListText = (hotList || []).length > 0
      ? `\n\nFREQUENTLY RECOGNIZED (prioritize these):\n${hotList.map(h => `- ${h.recognized_name}`).join('\n')}`
      : ''

    // fix #26 — use generic alias rather than date-pinned checkpoint
    const anthropic = new Anthropic()
    const aiResponse = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: 'image/jpeg', data: image },
          },
          {
            type: 'text',
            text: `You are a POS cashier assistant. Look at this product image and identify it.

YOUR STORE'S INVENTORY:
${catalogueText || '(Empty inventory)'}${hotListText}

TASK:
1. Look at the image and the inventory list above
2. FIRST: Check if this matches anything in the inventory list (even if worded differently - e.g., "Cumin Seeds" matches "Loose Cumin Seeds per Kilo")
3. If you find a match, return the EXACT name from the inventory list
4. If no match, identify the product as best you can
5. Try to extract the price if shown on label/tag
6. PRIORITIZE products in the "FREQUENTLY RECOGNIZED" list
7. Identify anything you can visually see clearly, even generic items without brand labels

Reply ONLY with valid JSON, nothing else:
{"name":"product name","price":null}`,
          },
        ],
      }],
    })

    const text = aiResponse.content[0].type === 'text' ? aiResponse.content[0].text.trim() : ''
    const jsonMatch = text.match(/\{[\s\S]*?\}/)
    if (!jsonMatch) return json({ error: 'Could not identify product' }, 422)

    let parsed: { name?: string; price?: number | null }
    try { parsed = JSON.parse(jsonMatch[0]) } catch {
      return json({ error: 'Could not parse AI response' }, 422)
    }

    const productName = (parsed.name || '').trim()
    const tagPrice    = typeof parsed.price === 'number' ? parsed.price : null

    console.log('🔍 SCAN RECOGNITION:', { productName, price: tagPrice, inventoryCount: inventoryList?.length })

    if (!productName) return json({ error: 'Could not identify product' }, 422)

    // Try exact match first
    let match = inventoryList?.find(p => p.name.toLowerCase() === productName.toLowerCase())
    if (match) console.log('✓ EXACT MATCH:', match.name)

    // If no exact match, use smart fuzzy matching - require ALL major words to be present
    if (!match && inventoryList && inventoryList.length > 0) {
      const words = productName.split(/\s+/).map(w => w.toLowerCase()).filter(Boolean)
      const scored = inventoryList.map(item => {
        const itemWords = item.name.toLowerCase().split(/\s+/)
        const matchCount = words.filter(w => itemWords.some(iw => iw.includes(w) || w.includes(iw))).length
        return { item, score: matchCount, totalWords: words.length }
      }).sort((a, b) => b.score - a.score)

      console.log('🔎 FUZZY ATTEMPT:', { words, topMatch: scored[0]?.item?.name, matchScore: scored[0]?.score, needAllWords: scored[0]?.totalWords })

      if (scored[0].score === scored[0].totalWords && scored[0].totalWords > 0) {
        match = scored[0].item
        console.log('✓ FUZZY MATCH:', match.name)
      } else if (scored[0]?.totalWords > 0) {
        console.log('❌ FUZZY FAILED:', { reason: `Need ${scored[0].totalWords} words, got ${scored[0].score} matches` })
      }
    }

    if (match) {
      // Log successful recognition (optional - table may not exist yet)
      try {
        await service
          .from('recognition_history')
          .insert({
            owner_id: ownerId,
            inventory_id: match.id,
            recognized_name: productName,
            is_match: true,
            confirmed: true,
            source: 'cashier'
          })
      } catch (logErr) {
        console.error('Recognition logging unavailable:', logErr)
      }

      return json({
        found:        true,
        inventory_id: match.id,
        name:         match.name,
        price:        match.sale_price,
        cost_price:   match.cost_price,
        stock_qty:    match.stock_qty,
        unit:         match.unit,
      })
    }

    // No match found, return with identified name for manual entry
    return json({
      found: false,
      inventory_id: null,
      name: productName,
      price: tagPrice,
      stock_qty: null,
      unit: null
    })

  } catch (err) {
    console.error('Scan error:', err)
    return json({ error: 'Scan failed' }, 500)
  }
}
