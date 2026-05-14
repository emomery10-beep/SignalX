import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { resolvePosOwner } from '@/lib/pos-auth'

// CORS handled globally by next.config.js
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

export async function POST(req: NextRequest) {
  // Inventory-role only — fix #10
  const ownerId = await resolvePosOwner(req, 'inventory')
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  try {
    const { image } = await req.json()
    if (!image) return NextResponse.json({ error: 'image required' }, { status: 400 })

    const anthropic = new Anthropic()
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: 'image/jpeg', data: image },
          },
          {
            type: 'text',
            // Fix #13 — stricter prompt: only retail products, confidence threshold guidance
            text: `You are a retail inventory assistant. Look at this image and identify:
1. Clearly visible retail products (items with labels, brand names, or packaging)
2. Any visible barcodes (EAN/UPC codes)
3. Price tags or cost information if visible

BARCODE DETECTION:
- If you see a barcode (EAN-13, EAN-8, UPC-A, Code128, or similar), extract the full barcode number
- Describe what the barcode looks like to confirm you can see it clearly
- A barcode is a pattern of vertical lines with numbers underneath, typically on product packaging

PRODUCT INFORMATION:
- Extract product name, quantity visible, category
- If a price tag is visible, note the sale price
- If cost/wholesale price is visible, note it
- If a barcode is visible, extract its full number
- Set confidence 90-100 if you can read product name/barcode clearly
- Set confidence 70-89 if you recognise the product but some details are unclear
- Set confidence below 70 if you are guessing

Use short, specific product names: "Coca-Cola 500ml", "Heinz Baked Beans 415g", "Blue Cotton T-Shirt"

Reply ONLY with valid JSON, no markdown, no extra text:
{"products":[{"name":"product name","sku":"barcode number or empty string","quantity":1,"category":"category","sale_price":null,"cost_price":null,"confidence":90,"barcode_detected":false,"barcode_number":""}]}

If you cannot see any clear retail products, reply: {"products":[]}`,
          },
        ],
      }],
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      return NextResponse.json({ error: 'Unexpected AI response' }, { status: 500 })
    }

    const jsonMatch = content.text.trim().match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ products: [] })
    }

    let recognized: { products: {
      name: string;
      quantity: number;
      category: string;
      confidence: number;
      sku?: string;
      sale_price?: number | null;
      cost_price?: number | null;
      barcode_detected?: boolean;
      barcode_number?: string;
    }[] }
    try {
      recognized = JSON.parse(jsonMatch[0])
    } catch {
      return NextResponse.json({ products: [] })
    }

    const products = (recognized.products || []).filter(
      p => p.name && typeof p.confidence === 'number'
    ).map(p => ({
      name: p.name,
      quantity: p.quantity || 1,
      category: p.category || 'General',
      confidence: p.confidence,
      sku: p.sku || p.barcode_number || '',
      sale_price: p.sale_price || null,
      cost_price: p.cost_price || null,
      barcode_detected: p.barcode_detected || false,
      barcode_number: p.barcode_number || '',
    }))

    return NextResponse.json({ products })
  } catch (err: any) {
    console.error('recognize-inventory error:', err)
    return NextResponse.json({ error: err.message || 'Recognition failed' }, { status: 500 })
  }
}
