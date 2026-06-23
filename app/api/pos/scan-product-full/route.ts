import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { resolvePosAuth } from '@/lib/pos-auth'

// Allow larger body for image uploads
export const maxDuration = 60

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

/**
 * POST /api/pos/scan-product-full
 *
 * Accepts front + optional back photo of a product (base64 JPEG).
 * Sends both images to Claude Vision in a single call.
 * Returns a complete product profile ready to pre-fill the add-product form.
 *
 * Body: { front: string, back?: string }
 * Response: { product: { name, brand, supplier, category, sku, unit, expiry_date,
 *                         batch_number, sale_price, cost_price, description } }
 */
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req, 'inventory')
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { front, back } = await req.json()
  if (!front) return NextResponse.json({ error: 'front image required' }, { status: 400 })

  const anthropic = new Anthropic()

  // Build the content blocks — always include front, optionally include back
  const imageBlocks: Anthropic.ImageBlockParam[] = [
    {
      type: 'image',
      source: { type: 'base64', media_type: 'image/jpeg', data: front },
    },
  ]
  if (back) {
    imageBlocks.push({
      type: 'image',
      source: { type: 'base64', media_type: 'image/jpeg', data: back },
    })
  }

  const prompt = back
    ? `You are a retail inventory assistant. You have been given TWO photos of the same product:
- Image 1 = FRONT of the product (brand, name, size, price if visible)
- Image 2 = BACK of the product (ingredients, batch number, expiry date, barcode, supplier, country of origin, nutritional info)

Extract every detail you can see from BOTH images and return a complete product profile.`
    : `You are a retail inventory assistant. You have been given the FRONT of a product.
Extract every detail you can see and return a complete product profile.`

  const instructions = `
EXTRACT (leave null if not visible, do not guess):
- name: full product name including brand, variant and size (e.g. "Dove Men+ Care Body Wash 400ml")
- brand: brand name only (e.g. "Dove")
- supplier: supplier / manufacturer / distributor if shown on label
- category: best-fit category (e.g. "Personal Care", "Beverages", "Snacks", "Cleaning", "Hair Care", "Oils", "Dairy", "Frozen", "Electronics", "Clothing")
- sku: barcode number or SKU code if visible (digits only, no spaces)
- unit: "item", "kg", "litre", "pack", or "box"
- expiry_date: expiry or best-before date in YYYY-MM-DD format (e.g. "2026-08-31"). Look for: "Best Before", "BB", "Use By", "Expiry", "EXP", "BBE". Only return a date if you can clearly read it — do NOT guess.
- batch_number: batch, lot or production code if visible
- sale_price: suggested retail price if printed on label (number only, no currency symbol)
- cost_price: null (we don't know the cost from the label)
- description: one sentence about what the product is

Reply with ONLY valid JSON, no markdown, no other text:
{
  "name": "...",
  "brand": "...",
  "supplier": null,
  "category": "...",
  "sku": null,
  "unit": "item",
  "expiry_date": null,
  "batch_number": null,
  "sale_price": null,
  "cost_price": null,
  "description": "..."
}`

  try {
    console.log('[scan-product-full] front image size:', Math.round(front.length / 1024), 'KB', back ? ', back size: ' + Math.round(back.length / 1024) + ' KB' : '(no back)')
    console.log('[scan-product-full] front hash (first 20 chars):', front.substring(0, 20))

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      messages: [{
        role: 'user',
        content: [
          ...imageBlocks,
          { type: 'text', text: prompt + '\n\n' + instructions },
        ],
      }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text.trim() : ''
    console.log('[scan-product-full] Claude raw response:', text)

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('[scan-product-full] No JSON found in response')
      return NextResponse.json({ error: 'Could not read product from image' }, { status: 422 })
    }

    const product = JSON.parse(jsonMatch[0])
    console.log('[scan-product-full] Parsed product:', JSON.stringify(product))
    return NextResponse.json({ product })
  } catch (err: any) {
    console.error('scan-product-full error:', err)
    return NextResponse.json({ error: err.message || 'Scan failed' }, { status: 500 })
  }
}
