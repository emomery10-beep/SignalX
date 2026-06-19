import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import Anthropic from '@anthropic-ai/sdk'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

// Strip a data: URL prefix and return raw base64 + media type
function parseDataUrl(input: string): { data: string; mediaType: string } {
  const match = input.match(/^data:(image\/[a-zA-Z+]+);base64,([\s\S]*)$/)
  if (match) return { mediaType: match[1], data: match[2] }
  return { mediaType: 'image/jpeg', data: input }
}

// POST — scan a waybill / invoice / receipt photo OR look up by tracking number.
// Frontend (camera) posts { image }. Driver/handler barcode lookup posts { tracking_number }.
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  const service = createServiceClient()
  const body = await req.json()

  // ── Mode A: barcode / tracking-number lookup ──────────────
  if (body.tracking_number || body.barcode) {
    const tn = String(body.tracking_number || body.barcode).trim()
    const { data: parcel, error } = await service
      .from('pos_parcels')
      .select(`
        *,
        truck:pos_trucks!assigned_truck_id(id, plate_number),
        driver:pos_staff!assigned_driver_id(id, name)
      `)
      .eq('owner_id', auth.ownerId)
      .eq('tracking_number', tn)
      .maybeSingle()

    if (error) return json({ error: error.message }, 500)
    if (!parcel) return json({ error: 'Parcel not found', parcel: null }, 404)
    return json({ parcel })
  }

  // ── Mode B: AI document scan (waybill / invoice / receipt) ─
  if (!body.image) return json({ error: 'image or tracking_number required' }, 400)

  const { data: imageData, mediaType } = parseDataUrl(body.image)

  try {
    const anthropic = new Anthropic()
    const aiResponse = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 700,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType as any, data: imageData },
          },
          {
            type: 'text',
            text: `You are a logistics document reader. Look at this photo and classify it as one of:
- "waybill" (a parcel/shipment consignment note with sender + receiver details)
- "invoice" (a vendor bill for fuel, maintenance, tolls, loading, etc.)
- "receipt" (a payment receipt)
- "unknown" (cannot tell)

Then extract the relevant fields.

Reply ONLY with valid JSON, no prose:
{
  "document_type": "waybill" | "invoice" | "receipt" | "unknown",
  "confidence": 0.0-1.0,
  "data": {
    // for waybill: sender_name, sender_phone, receiver_name, receiver_phone, destination_city, description, weight_kg, tracking_number
    // for invoice: vendor_name, invoice_number, total_amount, currency, date, category, items
    // for receipt: amount, currency, payment_method, receipt_number, payer_name, payee_name, date
  }
}
Use null for any field you cannot read. Do not invent values.`,
          },
        ],
      }],
    })

    const text = aiResponse.content[0].type === 'text' ? aiResponse.content[0].text.trim() : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return json({ document_type: 'unknown', confidence: 0, data: {}, message: 'Could not read document' })
    }

    let parsed: { document_type?: string; confidence?: number; data?: Record<string, unknown> }
    try { parsed = JSON.parse(jsonMatch[0]) } catch {
      return json({ document_type: 'unknown', confidence: 0, data: {}, message: 'Could not parse document' })
    }

    const dt = ['waybill', 'invoice', 'receipt'].includes(parsed.document_type || '')
      ? parsed.document_type
      : 'unknown'

    return json({
      document_type: dt,
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.5,
      data: parsed.data || {},
      ...(dt === 'unknown' ? { message: 'Could not identify document. Try again.' } : {}),
    })
  } catch (err: any) {
    console.error('Parcel scan error:', err)
    const billing = err?.status === 400 && /credit balance/i.test(String(err?.message || ''))
    return json({ document_type: 'unknown', confidence: 0, data: {}, message: billing ? 'AI scanning is paused — top up Anthropic API credits. Enter details manually for now.' : 'Scan failed. Check your connection.' }, billing ? 503 : 500)
  }
}
