import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'
import { resolvePosAuth } from '@/lib/pos-auth'

export const dynamic = 'force-dynamic'

const STOP_WORDS = new Set(['the','a','an','of','per','and','in','for','with','ml','l','g','kg','fresh','frozen','organic','dried','sliced','diced','whole'])

function fuzzyMatch(
  queryName: string,
  candidates: { id: string; name: string; food_cost: number; base_price: number }[]
): { id: string; name: string; food_cost: number; base_price: number } | null {
  const words = queryName.toLowerCase().split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w))
  if (words.length === 0) return null
  const scored = candidates.map(item => {
    const itemWords = item.name.toLowerCase().split(/\s+/).filter(w => !STOP_WORDS.has(w))
    const fwd = words.filter(w => itemWords.some(iw => iw.includes(w) || w.includes(iw))).length
    const rev = itemWords.filter(iw => words.some(w => iw.includes(w) || w.includes(iw))).length
    const fwdRatio = words.length > 0 ? fwd / words.length : 0
    const revRatio = itemWords.length > 0 ? rev / itemWords.length : 0
    return { item, score: fwdRatio + revRatio * 0.5 }
  }).sort((a, b) => b.score - a.score)
  const top = scored[0]
  return top && top.score >= 1.0 ? top.item : null
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

interface ExtractedLineItem {
  name: string
  qty: number
  unit: string
  unit_price: number
  line_total: number
  category: string
}

interface ExtractionResult {
  supplier_name: string
  invoice_date: string | null
  invoice_ref: string | null
  currency: string
  items: ExtractedLineItem[]
  confidence: number
  raw_notes: string
}

export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req, 'inventory')
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  try {
    const { image, media_type = 'image/jpeg' } = await req.json()
    if (!image) return NextResponse.json({ error: 'image required' }, { status: 400 })

    const service = createServiceClient()
    const anthropic = new Anthropic()

    // STEP 1: Extract all line items from the delivery note / invoice image
    const extractResp = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: media_type as any, data: image },
          },
          {
            type: 'text',
            text: `You are reading a restaurant supplier delivery note or invoice.

Extract every line item you can see. For each item include:
- name: the ingredient or product name, cleaned up (e.g. "Chicken Breast", "Olive Oil 5L", "Tenderstem Broccoli")
- qty: numeric quantity delivered
- unit: the unit (kg, g, L, ml, case, box, each, dozen, tray, bag, portion — use the one on the invoice, default to "each" if unclear)
- unit_price: price per unit (0 if not visible)
- line_total: total for that line (qty × unit_price, 0 if not visible)
- category: one of: meat, fish, dairy, produce, dry_goods, beverages, cleaning, packaging, other

Also extract:
- supplier_name: the supplier / vendor name from the header
- invoice_date: in ISO format YYYY-MM-DD (null if not visible)
- invoice_ref: the invoice or delivery note number (null if not visible)
- currency: 3-letter ISO code (GBP, USD, EUR, KES, ZAR, etc — infer from £/$/€ symbols, default GBP)
- confidence: 0-100 how confident you are in the overall extraction (80+ = clear document, 50-79 = partial, <50 = too blurry)
- raw_notes: any important notes from the document (allergens, storage instructions, rejected items, etc)

Reply ONLY with valid JSON matching this shape — no markdown, no explanation:
{
  "supplier_name": "Fresh Direct Ltd",
  "invoice_date": "2025-05-17",
  "invoice_ref": "DN-20481",
  "currency": "GBP",
  "confidence": 88,
  "raw_notes": "",
  "items": [
    {"name":"Chicken Breast","qty":10,"unit":"kg","unit_price":5.40,"line_total":54.00,"category":"meat"},
    {"name":"Plum Tomatoes","qty":3,"unit":"case","unit_price":12.50,"line_total":37.50,"category":"produce"}
  ]
}`,
          },
        ],
      }],
    })

    const extractContent = extractResp.content[0]
    if (extractContent.type !== 'text') {
      return NextResponse.json({ error: 'No text response from vision' }, { status: 500 })
    }

    console.log('📄 INVOICE RAW:', extractContent.text.slice(0, 500))

    // Parse JSON — strip any markdown fences
    const jsonMatch = extractContent.text.trim().match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Could not parse invoice data', raw: extractContent.text }, { status: 422 })
    }

    let extracted: ExtractionResult
    try {
      extracted = JSON.parse(jsonMatch[0])
    } catch {
      return NextResponse.json({ error: 'Invalid JSON from vision model', raw: extractContent.text }, { status: 422 })
    }

    if (!extracted.items || extracted.items.length === 0) {
      return NextResponse.json({ extraction: extracted, matches: [], message: 'No line items found' })
    }

    // STEP 2: Match each extracted item against restaurant_menu_items to find food_cost update candidates
    const { data: menuItems } = await service
      .from('restaurant_menu_items')
      .select('id, name, food_cost, base_price')
      .eq('owner_id', auth.ownerId)
      .eq('active', true)
      .order('name')

    const matches = extracted.items.map(lineItem => {
      const menuMatch = menuItems ? fuzzyMatch(lineItem.name, menuItems) : null
      return {
        ...lineItem,
        menu_item_id:   menuMatch?.id   ?? null,
        menu_item_name: menuMatch?.name ?? null,
        current_food_cost: menuMatch?.food_cost ?? null,
        menu_base_price:   menuMatch?.base_price ?? null,
        suggested_food_cost: lineItem.unit_price > 0 ? lineItem.unit_price : null,
        matched: !!menuMatch,
      }
    })

    // STEP 3: Write anonymised price intelligence to ingredient_price_intel
    // Only items with a real unit_price get written — zero means not extracted
    // No PII: supplier name omitted, only type is stored

    // Resolve region from owner profile for geographic intelligence
    const { data: ownerProfile } = await service
      .from('profiles')
      .select('country')
      .eq('id', auth.ownerId)
      .single()
    const region = (ownerProfile as any)?.country || null

    const intelligenceRows = extracted.items
      .filter(item => item.unit_price > 0 && item.name)
      .map(item => ({
        owner_id:      auth.ownerId,
        ingredient:    item.name.toLowerCase().trim(),
        category:      item.category || 'other',
        unit:          item.unit || 'each',
        unit_price:    item.unit_price,
        currency:      extracted.currency || 'GBP',
        region:        region,
        supplier_type: extracted.supplier_name ? 'named_supplier' : 'unknown',
        delivery_date: extracted.invoice_date || new Date().toISOString().slice(0, 10),
      }))

    if (intelligenceRows.length > 0) {
      await service.from('ingredient_price_intel').insert(intelligenceRows)
        .then(() => { console.log(`📊 Wrote ${intelligenceRows.length} price intelligence rows`) })
        .catch((err: any) => {
          // Non-fatal — collective intelligence is best-effort
          console.warn('ingredient_price_intel write failed (non-fatal):', err.message)
        })
    }

    return NextResponse.json({
      extraction: {
        supplier_name: extracted.supplier_name,
        invoice_date:  extracted.invoice_date,
        invoice_ref:   extracted.invoice_ref,
        currency:      extracted.currency,
        confidence:    extracted.confidence,
        raw_notes:     extracted.raw_notes,
        total_items:   extracted.items.length,
      },
      matches,
    })
  } catch (err: any) {
    console.error('invoice-recognize error:', err)
    return NextResponse.json({ error: err.message || 'Recognition failed' }, { status: 500 })
  }
}

// PATCH: confirm food cost updates for selected menu items
export async function PATCH(req: NextRequest) {
  const auth = await resolvePosAuth(req, 'inventory')
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  try {
    const { updates, delivery_record } = await req.json()
    // updates: [{ menu_item_id, food_cost }]
    // delivery_record: { supplier_name, invoice_ref, invoice_date, total_value, currency }

    if (!updates || !Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ error: 'updates array required' }, { status: 400 })
    }

    const service = createServiceClient()

    // Update food_cost on each confirmed menu item
    const updateResults = await Promise.allSettled(
      updates
        .filter((u: any) => u.menu_item_id && typeof u.food_cost === 'number')
        .map((u: any) =>
          service
            .from('restaurant_menu_items')
            .update({ food_cost: u.food_cost, updated_at: new Date().toISOString() })
            .eq('id', u.menu_item_id)
            .eq('owner_id', auth.ownerId)
        )
    )

    const succeeded = updateResults.filter(r => r.status === 'fulfilled').length
    const failed    = updateResults.filter(r => r.status === 'rejected').length

    // Log the delivery to restaurant_deliveries
    if (delivery_record) {
      await service.from('restaurant_deliveries').insert({
        owner_id:            auth.ownerId,
        location_id:         auth.locationId || null,
        supplier_name:       delivery_record.supplier_name || null,
        invoice_ref:         delivery_record.invoice_ref  || null,
        delivery_date:       delivery_record.invoice_date || null,
        currency:            delivery_record.currency || 'GBP',
        total_value:         delivery_record.total_value || null,
        food_costs_updated:  succeeded,
        notes:               `${succeeded} food cost${succeeded !== 1 ? 's' : ''} updated`,
      }).catch((err: any) => console.warn('restaurant_deliveries write failed:', err.message))
    }

    return NextResponse.json({ updated: succeeded, failed, message: `${succeeded} menu item${succeeded !== 1 ? 's' : ''} updated` })
  } catch (err: any) {
    console.error('invoice PATCH error:', err)
    return NextResponse.json({ error: err.message || 'Update failed' }, { status: 500 })
  }
}
