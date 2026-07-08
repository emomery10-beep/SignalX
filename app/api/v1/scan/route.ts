import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { authenticateApiKey, recordRequest, debitCredits, insufficientCreditsResponse, CORS } from '@/lib/api-v1-auth'
import { API_PRICE_CENTS } from '@/lib/api-pricing'

export const runtime = 'nodejs'
export const maxDuration = 30

// Public vision endpoint — same Groq Llama-4-Scout pipeline as the internal
// POS cashier scanner (app/api/pos/scan/route.ts), gated by API key instead
// of an owner session, and billed from the credit wallet instead of free.
//
// mode: 'account' keys get inventory-matched results (same behaviour as the
// internal scanner — matches against the caller's own AskBiz catalog).
// mode: 'generic' keys get raw identification only (no catalog to match
// against), which is still useful as a standalone vision API.
//
// Phase 4: an optional merchant_id lets a key act on behalf of a CONNECTED
// merchant (developer_connections, status='active') instead of only its own
// owner — this is the multi-tenant read path referenced in that migration's
// header. Every request with merchant_id re-validates the connection; there
// is no cached/standing trust beyond what's in that table right now.

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

function escapeLike(s: string) {
  return s.replace(/[%_\\]/g, c => `\\${c}`)
}

export async function POST(request: NextRequest) {
  const start = Date.now()
  const auth = await authenticateApiKey(request)
  if (!auth.ok) return auth.response
  const { key, supabase } = auth

  const price = API_PRICE_CENTS['/api/v1/scan']
  if (key.credit_balance_cents < price) return insufficientCreditsResponse(price)

  let body: { image?: string; merchant_id?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400, headers: CORS })
  }
  if (!body.image) {
    return NextResponse.json({ error: '"image" (base64 JPEG) is required' }, { status: 400, headers: CORS })
  }

  // Resolve which account's catalog (if any) to scope this scan to:
  // an explicit connected merchant takes priority over the key's own
  // account-mode owner, so a multi-tenant app always says who it means.
  let effectiveOwnerId: string | null = null
  if (body.merchant_id) {
    const { data: connection } = await supabase
      .from('developer_connections')
      .select('id')
      .eq('key_id', key.id)
      .eq('merchant_user_id', body.merchant_id)
      .eq('status', 'active')
      .maybeSingle()
    if (!connection) {
      return NextResponse.json({ error: 'No active connection to this merchant_id — see /api/v1/connections' }, { status: 403, headers: CORS })
    }
    effectiveOwnerId = body.merchant_id
  } else if (key.mode === 'account') {
    effectiveOwnerId = key.user_id
  }

  let inventoryList: { id: string; name: string; sale_price: number; cost_price: number; stock_qty: number; unit: string }[] = []
  let hotList: { recognized_name: string }[] = []
  if (effectiveOwnerId) {
    const { data } = await supabase
      .from('inventory')
      .select('id, name, sale_price, cost_price, stock_qty, unit')
      .eq('owner_id', effectiveOwnerId)
      .eq('active', true)
      .order('name')
    inventoryList = data || []

    const { data: hot } = await supabase
      .from('product_hot_list')
      .select('recognized_name')
      .eq('owner_id', effectiveOwnerId)
      .order('recognition_count', { ascending: false })
      .limit(20)
    hotList = hot || []
  }

  const catalogueText = inventoryList
    .slice(0, 200)
    .map(p => `- ${p.name}${p.stock_qty > 0 ? ` (${p.stock_qty} in stock)` : ' (OUT OF STOCK)'}`)
    .join('\n')
  const hotListText = hotList.length > 0
    ? `\n\nFREQUENTLY RECOGNIZED (prioritize these):\n${hotList.map(h => `- ${h.recognized_name}`).join('\n')}`
    : ''

  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
    body: JSON.stringify({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${body.image}` } },
          {
            type: 'text',
            text: `Identify the product in this image — brand, size, type if visible.
${catalogueText ? `\nSTORE INVENTORY:\n${catalogueText}${hotListText}\n\nIf it matches an item above, use the EXACT name from the list.` : ''}
Reply ONLY with valid JSON: {"name":"product name","price":null}`,
          },
        ],
      }],
    }),
  })

  if (!groqRes.ok) {
    return NextResponse.json({ error: 'Vision recognition failed — please retry' }, { status: 502, headers: CORS })
  }

  const groqData = await groqRes.json()
  const text = (groqData.choices?.[0]?.message?.content || '').trim()
  const jsonMatch = text.match(/\{[\s\S]*?\}/)
  if (!jsonMatch) {
    return NextResponse.json({ error: 'Could not identify product' }, { status: 422, headers: CORS })
  }

  let parsed: { name?: string; price?: number | null }
  try {
    parsed = JSON.parse(jsonMatch[0])
  } catch {
    return NextResponse.json({ error: 'Could not parse recognition result' }, { status: 422, headers: CORS })
  }

  const productName = (parsed.name || '').trim()
  const tagPrice = typeof parsed.price === 'number' ? parsed.price : null
  if (!productName) {
    return NextResponse.json({ error: 'Could not identify product' }, { status: 422, headers: CORS })
  }

  let match = inventoryList.find(p => p.name.toLowerCase() === productName.toLowerCase())
  if (!match && inventoryList.length > 0) {
    const words = productName.split(/\s+/).slice(0, 4).map(escapeLike).filter(Boolean)
    const scored = inventoryList
      .map(item => ({ item, score: words.filter(w => item.name.toLowerCase().includes(w.toLowerCase())).length }))
      .sort((a, b) => b.score - a.score)
    const minMatches = Math.max(1, Math.ceil(words.length * 0.6))
    if (scored[0]?.score >= minMatches) match = scored[0].item
  }

  const requestId = randomUUID()
  // Debit only now that recognition succeeded (debit-on-success — a failed
  // Groq call or unparseable result costs the caller nothing). The upstream
  // Groq call itself is still spent either way; the balance check above is a
  // fast-fail optimization, not the real guard — debit_api_credits' atomic
  // UPDATE...WHERE is the actual enforcement against concurrent overdraw.
  const debited = await debitCredits(supabase, key.id, price, '/api/v1/scan', requestId)
  if (!debited) return insufficientCreditsResponse(price)

  await recordRequest(supabase, key, '/api/v1/scan', 200, Date.now() - start)

  if (match) {
    // effectiveOwnerId is non-null whenever match is possible — inventoryList
    // (and therefore any match) is only ever populated when it was set, per
    // the block above — but fall back to key.user_id defensively rather than
    // writing a null owner_id if that invariant is ever violated by a future edit.
    supabase.from('recognition_history').insert({
      owner_id: effectiveOwnerId || key.user_id, inventory_id: match.id, recognized_name: productName,
      is_match: true, confirmed: true, source: 'api',
    }).then(({ error }: { error: unknown }) => { if (error) console.error('[api/v1/scan] recognition log failed:', error) })

    return NextResponse.json({
      found: true, inventory_id: match.id, name: match.name, price: match.sale_price,
      cost_price: match.cost_price, stock_qty: match.stock_qty, unit: match.unit,
    }, { headers: CORS })
  }

  return NextResponse.json({
    found: false, inventory_id: null, name: productName, price: tagPrice, stock_qty: null, unit: null,
  }, { headers: CORS })
}
