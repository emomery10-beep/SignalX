import { NextRequest, NextResponse } from 'next/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { logUsage } from '@/lib/log-usage'
import { visionAI } from '@/lib/vision-ai'

// CORS handled globally by next.config.js
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

interface ExtractedItem {
  name: string
  price: number | null
  description: string | null
  confidence: number
}

// Parse a price that may arrive as a number, or a string like "KSh 150", "150/=", "150.00"
function coercePrice(raw: unknown): number | null {
  if (typeof raw === 'number' && isFinite(raw) && raw >= 0) return raw
  if (typeof raw === 'string') {
    const digits = raw.replace(/[^\d.]/g, '')
    if (!digits) return null
    const n = parseFloat(digits)
    return isFinite(n) && n >= 0 ? n : null
  }
  return null
}

/**
 * Menu-from-photos: a vendor photographs their menu board / printed menu / price
 * list, and we extract the dishes and prices. Returns structured items only —
 * this endpoint does NOT persist anything (the wizard confirms then saves).
 */
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  try {
    const { image } = await req.json()
    if (!image) return NextResponse.json({ error: 'image required' }, { status: 400 })

    // visionAI adds its own data-URL wrapper, so strip any prefix the client sent.
    const raw = typeof image === 'string' ? image.replace(/^data:.*?;base64,/, '') : image

    const { text, model, usage } = await visionAI(raw, `You are reading a food vendor's menu from a photo. The photo may be a handwritten menu board, a printed menu, a price list, or a chalkboard at a street food stall in Kenya. Prices are usually in Kenyan Shillings (KSh / KES).

TASK:
1. Extract EVERY distinct food or drink item you can see.
2. For each item, read its price. Return the price as a plain number only (strip "KSh", "KES", "/=", commas). If a price is not visible for an item, set price to null.
3. If a short description is visible, include it; otherwise null.
4. Set confidence 80-100 if the item and price are clearly legible, 50-79 if the item is legible but the price is unclear or missing, below 50 if you are guessing.
5. Do NOT invent items or prices. Only report what you can actually see. If the photo has no menu, return an empty list.

Reply with ONLY valid JSON, no other text:
{"items":[{"name":"Pilau","price":150,"description":null,"confidence":90}]}`, 1500)

    logUsage({ route: 'pos/restaurant/menu/from-photo', model, usage, userId: auth.ownerId })

    const jsonMatch = text.trim().match(/\{[\s\S]*\}/)
    if (!jsonMatch) return NextResponse.json({ items: [] })

    let parsed: { items?: unknown }
    try {
      parsed = JSON.parse(jsonMatch[0])
    } catch {
      return NextResponse.json({ items: [] })
    }

    const rawItems = Array.isArray(parsed.items) ? parsed.items : []
    const items: ExtractedItem[] = rawItems
      .map((raw: any): ExtractedItem | null => {
        const name = (raw?.name ?? '').toString().trim()
        if (!name) return null
        const confidence = typeof raw?.confidence === 'number' ? raw.confidence : 0
        if (confidence < 50) return null
        const description = raw?.description ? raw.description.toString().trim() : null
        return { name, price: coercePrice(raw?.price), description, confidence }
      })
      .filter((x): x is ExtractedItem => x !== null)

    return NextResponse.json({ items })
  } catch (err: any) {
    console.error('menu/from-photo error:', err)
    return NextResponse.json({ error: err.message || 'Extraction failed' }, { status: 500 })
  }
}
