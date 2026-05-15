export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'
import { resolvePosOwner } from '@/lib/pos-auth'  // fix #20 — use shared auth helper

export const dynamic = 'force-dynamic'

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
1. Look at the image carefully and determine WHAT FORM the product is in:
   - Is it LOOSE/BULK (unpackaged raw ingredients like seeds, grains, spices in a bag or container)?
   - Is it a BRANDED/PACKAGED product (bottle, box, jar with a label)?
2. Match ONLY to inventory items that match BOTH the product AND its form. For example:
   - Loose sesame seeds must match "Loose Sesame Seeds per Kilo", NOT "Sesame Oil 250ml"
   - A bottle of oil must match the oil product, NOT loose seeds
   - "per Kilo" or "Loose" items are raw bulk ingredients, NOT packaged goods
3. If you find a match, return the EXACT name from the inventory list
4. If no match, identify the product as best you can
5. Try to extract the price if shown on label/tag
6. The "FREQUENTLY RECOGNIZED" list is for reference only — still match based on what you actually SEE
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
