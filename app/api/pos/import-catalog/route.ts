import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { logUsage } from '@/lib/log-usage'

// ============================================================
// /api/pos/import-catalog — bulk catalogue migration
//
// The camera-first way for a vendor who already has a list — a wall/notebook
// price list, a competitor POS "items" screen, or an Instagram/TikTok grid —
// to bring the WHOLE list in from ONE photo, instead of adding items one by
// one. Two actions on one endpoint:
//
//   action:'extract'  { image }         → many {name, sale_price} for review
//   action:'commit'   { items }         → dedup vs existing inventory + insert
//
// Extraction is best-effort — the caller MUST show a review screen so the
// vendor confirms/edits every line before commit (real-world inputs are
// handwritten, glare-covered, in local languages). Commit is the safe part:
// it de-duplicates against the owner's current inventory so importing after
// already adding a few items (or importing twice) never doubles the catalogue
// — the plain bulk-insert path does NOT dedup, which is why this exists.
// ============================================================

export const maxDuration = 60

// CORS handled globally by next.config.js
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

const GROQ_VISION_URL   = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_VISION_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct'

// Cap what one photo can produce — a defensive bound, not a real-list size.
const MAX_ITEMS = 100

type ExtractedItem = { name: string; sale_price: number }

// Pull the item list out of a model reply. The model is asked for
// {"items":[…]} but llama-4-scout often returns a BARE array [{…}] instead,
// and may wrap either in prose or ``` fences — so accept both shapes. Trying
// the array match first covers both: for {"items":[…]} it grabs the inner
// array; for a bare […] it grabs the whole thing.
function parseModelItems(raw: string): unknown[] {
  const arr = raw.match(/\[[\s\S]*\]/)
  if (arr) { try { const p = JSON.parse(arr[0]); if (Array.isArray(p)) return p } catch { /* fall through */ } }
  const obj = raw.match(/\{[\s\S]*\}/)
  if (obj) { try { const p = JSON.parse(obj[0]); if (Array.isArray(p?.items)) return p.items } catch { /* fall through */ } }
  return []
}

// "KSh 1,500" / "1.500,-" / "12k" → number. Best-effort; unreadable → 0.
function parsePrice(v: unknown): number {
  if (typeof v === 'number' && isFinite(v)) return Math.max(0, v)
  if (typeof v !== 'string') return 0
  let s = v.trim().toLowerCase().replace(/[^\d.,k]/g, '')
  const hasK = s.endsWith('k')
  s = s.replace(/k/g, '').replace(/,/g, '')
  const n = parseFloat(s)
  if (!isFinite(n)) return 0
  return Math.max(0, hasK ? n * 1000 : n)
}

async function handleExtract(image: string, ownerId: string) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: 'Extraction unavailable' }, { status: 503 })
  }

  const groqRes = await fetch(GROQ_VISION_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
    body: JSON.stringify({
      model: GROQ_VISION_MODEL,
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${image}` } },
          {
            type: 'text',
            text: `You are helping a small shop owner move their product list into a new app.

This image is their EXISTING list of things they sell — it may be a handwritten
notebook or wall list, a printed menu, another point-of-sale app's item screen,
or a screenshot of an online shop (Instagram/TikTok/Facebook). It may be in
English, Swahili, or another language, and prices may use local currency.

TASK: read every distinct product/item you can see and its price.
- One entry per item. Keep the item's own wording; do not translate names.
- If a price is shown, read it as a plain number (drop currency symbols and
  thousands separators; "1,500" -> 1500, "12k" -> 12000). If no price is
  visible for an item, use 0.
- Skip headings, totals, dates, phone numbers, and anything that is not a
  sellable item. Do not invent items you cannot actually read.

Reply with ONLY valid JSON, no other text:
{"items":[{"name":"item name","price":0}]}`,
          },
        ],
      }],
    }),
  })

  const groqData = await groqRes.json().catch(() => ({}))
  logUsage({
    route: 'pos/import-catalog',
    model: GROQ_VISION_MODEL,
    usage: { input_tokens: groqData.usage?.prompt_tokens || 0, output_tokens: groqData.usage?.completion_tokens || 0 },
    userId: ownerId,
  })

  const raw = (groqData.choices?.[0]?.message?.content || '').trim()
  const rawItems: unknown[] = parseModelItems(raw)

  // Normalise + dedup within the photo itself (a list often repeats a header).
  const seen = new Set<string>()
  const items: ExtractedItem[] = []
  for (const r of rawItems) {
    const name = String((r as any)?.name || '').trim().replace(/\s+/g, ' ')
    if (!name) continue
    const key = name.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    items.push({ name, sale_price: parsePrice((r as any)?.price) })
    if (items.length >= MAX_ITEMS) break
  }

  return NextResponse.json({ items })
}

async function handleCommit(rawItems: unknown, ownerId: string, locationId: string | null) {
  const list = Array.isArray(rawItems) ? rawItems : []
  if (list.length === 0) return NextResponse.json({ error: 'items array required' }, { status: 400 })

  const service = createServiceClient()

  // Existing active names → lowercase set, so a re-import or an import after a
  // few manual adds skips duplicates instead of stacking a second copy.
  const { data: existing, error: exErr } = await service
    .from('inventory')
    .select('name')
    .eq('owner_id', ownerId)
    .eq('active', true)
  if (exErr) return NextResponse.json({ error: exErr.message }, { status: 500 })

  const known = new Set((existing || []).map((r: any) => String(r.name).trim().toLowerCase()))

  const rows: Array<Record<string, unknown>> = []
  let skipped = 0
  for (const raw of list) {
    const name = String((raw as any)?.name || '').trim().replace(/\s+/g, ' ')
    if (!name) { skipped++; continue }
    const key = name.toLowerCase()
    if (known.has(key)) { skipped++; continue }  // dedup vs existing + within batch
    known.add(key)
    rows.push({
      owner_id:            ownerId,
      location_id:         locationId,
      name,
      sale_price:          Number((raw as any)?.sale_price) || 0,
      cost_price:          Number((raw as any)?.cost_price) || 0,
      // stock_qty is numeric(10,3) (20250520_decimal_qty) — keep fractional
      // quantities for weight-sold goods (e.g. 0.5 kg oil) instead of rounding.
      stock_qty:           Math.max(0, Number((raw as any)?.stock_qty) || 0),
      low_stock_threshold: 5,
      unit:                (raw as any)?.unit || 'item',
      category:            (raw as any)?.category ? String((raw as any).category).trim() : null,
      sku:                 (raw as any)?.sku ? String((raw as any).sku).trim() : null,
    })
  }

  if (rows.length === 0) {
    return NextResponse.json({ added: 0, skipped, products: [] })
  }

  const { data, error } = await service.from('inventory').insert(rows).select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ added: data?.length || 0, skipped, products: data })
}

export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req, 'inventory')
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }) }

  const action = body?.action
  if (action === 'extract') {
    const image = typeof body.image === 'string' ? body.image.replace(/^data:image\/\w+;base64,/, '') : ''
    if (!image) return NextResponse.json({ error: 'image required' }, { status: 400 })
    try {
      return await handleExtract(image, auth.ownerId)
    } catch (e) {
      console.error('[import-catalog] extract failed:', e)
      // Never hard-fail the vendor — an empty list falls back to manual add.
      return NextResponse.json({ items: [] })
    }
  }

  if (action === 'commit') {
    const locationId = auth.locationId || body.location_id || null
    return await handleCommit(body.items, auth.ownerId, locationId)
  }

  return NextResponse.json({ error: 'unknown action' }, { status: 400 })
}
