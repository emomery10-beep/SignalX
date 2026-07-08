import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { authenticateApiKey, recordRequest, debitCredits, insufficientCreditsResponse, CORS } from '@/lib/api-v1-auth'
import { API_PRICE_CENTS } from '@/lib/api-pricing'
import { sendReceipt, sendPurchaseOrder } from '@/lib/whatsapp'

export const runtime = 'nodejs'
export const maxDuration = 15

// Public WhatsApp send endpoint, wrapping the same Meta Business API
// templates the internal receipt/PO flows already use (lib/whatsapp.ts).
//
// Deliberately restricted to:
//  - mode: 'account' keys only. This sends through AskBiz's own shared Meta
//    Business phone number — a 'generic' key (no tie to a real AskBiz
//    account/catalog) would make this an open message-blasting gateway.
//  - the 'receipt' and 'purchase_order' utility templates only. The 'otp'
//    template is reserved for AskBiz's own login flow — exposing it here
//    would let a caller send arbitrary "verification code" messages to any
//    phone number under the AskBiz name, a phishing-adjacent abuse vector.
const ALLOWED_TEMPLATES = ['receipt', 'purchase_order'] as const
type AllowedTemplate = typeof ALLOWED_TEMPLATES[number]

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function POST(request: NextRequest) {
  const start = Date.now()
  const auth = await authenticateApiKey(request)
  if (!auth.ok) return auth.response
  const { key, supabase } = auth

  if (key.mode !== 'account') {
    return NextResponse.json(
      { error: 'WhatsApp send requires an "account" mode key, tied to a real AskBiz business — see https://developers.askbiz.co' },
      { status: 403, headers: CORS }
    )
  }

  const price = API_PRICE_CENTS['/api/v1/whatsapp/send']
  if (key.credit_balance_cents < price) return insufficientCreditsResponse(price)

  let body: { phone?: string; template?: AllowedTemplate; text?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400, headers: CORS })
  }

  const { phone, template, text } = body
  if (!phone || !/^\+?\d{8,15}$/.test(phone)) {
    return NextResponse.json({ error: '"phone" must be in international format, e.g. +254712345678' }, { status: 400, headers: CORS })
  }
  if (!template || !ALLOWED_TEMPLATES.includes(template)) {
    return NextResponse.json({ error: `"template" must be one of: ${ALLOWED_TEMPLATES.join(', ')}` }, { status: 400, headers: CORS })
  }
  if (!text || typeof text !== 'string' || text.length > 1024) {
    return NextResponse.json({ error: '"text" is required and must be under 1024 characters' }, { status: 400, headers: CORS })
  }

  const result = template === 'receipt'
    ? await sendReceipt(phone, text)
    : await sendPurchaseOrder(phone, text)

  if (!result.ok) {
    return NextResponse.json({ error: result.error || 'WhatsApp send failed' }, { status: 502, headers: CORS })
  }

  const requestId = randomUUID()
  const debited = await debitCredits(supabase, key.id, price, '/api/v1/whatsapp/send', requestId)
  if (!debited) {
    // The message already sent — Meta doesn't support unsend. Log the
    // shortfall for manual reconciliation rather than pretending it failed.
    console.error(`[api/v1/whatsapp/send] key ${key.id} went negative-balance after a successful send (request ${requestId})`)
  }

  await recordRequest(supabase, key, '/api/v1/whatsapp/send', 200, Date.now() - start)

  return NextResponse.json({ success: true }, { headers: CORS })
}
