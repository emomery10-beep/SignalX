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
            text: `Identify the product in this image. Give a short clear product name (e.g. "Milk 1L", "Blue T-Shirt", "Paracetamol 500mg").
Also extract the price if clearly shown on a label/tag.

Reply ONLY with valid JSON, nothing else:
{"name":"product name","price":0.00}

Use null for price if not visible.`,
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

    if (!productName) return json({ error: 'Could not identify product' }, 422)

    const service = createServiceClient()

    // fix #19 — search each word independently rather than joining with % (order-dependent)
    // Also escape special ILIKE chars to prevent injection
    const words = productName.split(/\s+/).slice(0, 4).map(escapeLike).filter(Boolean)

    // Build OR filter: name ilike %word1% OR name ilike %word2% ...
    const ilikeFilter = words.map(w => `name.ilike.%${w}%`).join(',')

    const { data: items } = await service
      .from('inventory')
      .select('id, name, sale_price, cost_price, stock_qty, unit')
      .eq('owner_id', ownerId)
      .eq('active', true)
      .or(ilikeFilter)
      .order('name')
      .limit(8)

    if (!items || items.length === 0) {
      return json({ found: false, inventory_id: null, name: productName, price: tagPrice, stock_qty: null, unit: null })
    }

    // Score matches: count how many words appear in the item name
    const scored = items.map(item => {
      const nameLower = item.name.toLowerCase()
      const score = words.filter(w => nameLower.includes(w.toLowerCase())).length
      return { item, score }
    }).sort((a, b) => b.score - a.score)

    const match = scored[0].item

    return json({
      found:        true,
      inventory_id: match.id,
      name:         match.name,
      price:        match.sale_price,
      cost_price:   match.cost_price,
      stock_qty:    match.stock_qty,
      unit:         match.unit,
    })

  } catch (err) {
    console.error('Scan error:', err)
    return json({ error: 'Scan failed' }, 500)
  }
}
