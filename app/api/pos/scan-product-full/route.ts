import { NextRequest, NextResponse } from 'next/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { logUsage } from '@/lib/log-usage'

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

  const GROQ_VISION_URL   = 'https://api.groq.com/openai/v1/chat/completions'
  const GROQ_VISION_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct'

  // Build the image content blocks — always include front, optionally include back
  const imageBlocks = [
    { type: 'image_url' as const, image_url: { url: `data:image/jpeg;base64,${front}` } },
    ...(back ? [{ type: 'image_url' as const, image_url: { url: `data:image/jpeg;base64,${back}` } }] : []),
  ]

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

    const response = await fetch(GROQ_VISION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: GROQ_VISION_MODEL,
        max_tokens: 600,
        messages: [{
          role: 'user',
          content: [
            ...imageBlocks,
            { type: 'text', text: prompt + '\n\n' + instructions },
          ],
        }],
      }),
    })
    const groqData = await response.json()
    logUsage({ route: 'pos/scan-product-full', model: GROQ_VISION_MODEL, usage: { input_tokens: groqData.usage?.prompt_tokens || 0, output_tokens: groqData.usage?.completion_tokens || 0 }, userId: auth.ownerId })

    const text = (groqData.choices?.[0]?.message?.content || '').trim()
    console.log('[scan-product-full] Groq raw response:', text)

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
