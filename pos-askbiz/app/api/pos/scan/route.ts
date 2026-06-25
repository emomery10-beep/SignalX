import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'  // fix #20 — use shared auth helper
import { logUsage } from '@/lib/log-usage'
import { visionAI } from '@/lib/vision-ai'

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
      .map((p: any) => `- ${p.name}${p.stock_qty > 0 ? ` (${p.stock_qty} in stock)` : ' (OUT OF STOCK)'}`)
      .join('\n')

    const hotListText = (hotList || []).length > 0
      ? `\n\nFREQUENTLY RECOGNIZED (prioritize these):\n${hotList.map((h: any) => `- ${h.recognized_name}`).join('\n')}`
      : ''

    const { text, model, usage } = await visionAI(image, `You are a POS cashier assistant. Look at this product image and identify it.

YOUR STORE'S INVENTORY:
${catalogueText || '(Empty inventory)'}${hotListText}

TASK:
1. Identify the product in the image - be specific with brand, size, type
2. PRIORITIZE products in the "FREQUENTLY RECOGNIZED" list - these are the store's most common items
3. If it matches something in the inventory list above, use the EXACT name from the list
4. If NOT in the inventory list, give your best identification anyway
5. Try to extract the price if shown on label/tag
6. Identify anything you can visually see clearly, even generic items without brand labels (e.g., rice, flour, eggs)

Reply ONLY with valid JSON, nothing else:
{"name":"product name","price":null}`, 300)
    logUsage({ route: 'pos/scan', model, usage, userId: ownerId })

    let parsed: { name?: string; price?: number | null } | null = null
    // Try direct parse, then strip markdown fences, then greedy brace extraction
    for (const candidate of [
      text.trim(),
      (text.match(/```(?:json)?\s*([\s\S]*?)```/)?.[1] ?? '').trim(),
      (text.match(/\{[\s\S]*\}/)?.[0] ?? ''),
    ]) {
      try { parsed = JSON.parse(candidate); break } catch { /* try next */ }
    }
    if (!parsed) {
      console.error('[pos/scan] unparseable AI response:', text)
      return json({ error: 'Could not identify product' }, 422)
    }

    const productName = (parsed.name || '').trim()
    const tagPrice    = typeof parsed.price === 'number' ? parsed.price : null

    if (!productName) return json({ error: 'Could not identify product' }, 422)

    // Try exact match first
    let match = inventoryList?.find((p: any) => p.name.toLowerCase() === productName.toLowerCase())

    // If no exact match, use fuzzy matching
    if (!match && inventoryList && inventoryList.length > 0) {
      const words = productName.split(/\s+/).slice(0, 4).map(escapeLike).filter(Boolean)
      const scored = inventoryList.map((item: any) => {
        const nameLower = item.name.toLowerCase()
        const score = words.filter(w => nameLower.includes(w.toLowerCase())).length
        return { item, score }
      }).sort((a: any, b: any) => b.score - a.score)

      // Require at least 60% of words to match (works for all product name lengths)
      const minMatches = Math.max(1, Math.ceil(words.length * 0.6))
      if (scored[0].score >= minMatches) {
        match = scored[0].item
      }
    }

    if (match) {
      // Log successful recognition (fire-and-forget)
      service
        .from('recognition_history')
        .insert({
          owner_id: ownerId,
          inventory_id: match.id,
          recognized_name: productName,
          is_match: true,
          confirmed: true,
          source: 'cashier'
        })
        .then(({ error }) => { if (error) console.error('Failed to log recognition:', error) })

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

  } catch (err: any) {
    console.error('Scan error:', err)
    return json({ error: 'AI recognition is temporarily unavailable. Use Search to add items for now.' }, 500)
  }
}
