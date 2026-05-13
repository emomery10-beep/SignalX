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
            text: `You are a retail inventory assistant. Look at this image and identify clearly visible retail products — items with a readable label, brand name, or product packaging.

Rules:
- ONLY include items that are clearly identifiable retail products with visible text or recognisable branding
- Do NOT include generic objects (shelves, boxes without labels, bags, hands, background items)
- Set confidence 90-100 if you can read the product name/brand clearly
- Set confidence 70-89 if you recognise the product type but can't read all details
- Set confidence below 70 if you are guessing — these will be flagged for user review
- Use short, specific product names: "Coca-Cola 500ml", "Heinz Baked Beans 415g", "Blue Cotton T-Shirt"
- quantity = how many units of that product are visible in the image (default 1)

Reply ONLY with valid JSON, no markdown, no extra text:
{"products":[{"name":"product name","quantity":1,"category":"category","confidence":90}]}

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

    let recognized: { products: { name: string; quantity: number; category: string; confidence: number }[] }
    try {
      recognized = JSON.parse(jsonMatch[0])
    } catch {
      return NextResponse.json({ products: [] })
    }

    const products = (recognized.products || []).filter(
      p => p.name && typeof p.confidence === 'number'
    )

    return NextResponse.json({ products })
  } catch (err: any) {
    console.error('recognize-inventory error:', err)
    return NextResponse.json({ error: err.message || 'Recognition failed' }, { status: 500 })
  }
}
