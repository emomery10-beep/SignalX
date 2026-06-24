import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { logUsage } from '@/lib/log-usage'
import {
  getQuotes,
  createShipment,
  getPaymentLink,
  testConnection,
  getPlaceholderRecipient,
  PMQuoteParams,
  PMAddress,
} from '@/lib/parcel-monkey'

export const runtime = 'nodejs'
export const maxDuration = 30

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const PARSE_SYSTEM_PROMPT = `You extract parcel shipping details from natural language.
Return ONLY valid JSON, no markdown, no explanation, no extra text.

JSON shape:
{
  "origin": "GB",
  "destination": "US",
  "weight_kg": 2.5,
  "length_cm": 30,
  "width_cm": 20,
  "height_cm": 15,
  "goods_value": 50,
  "goods_description": "clothing",
  "missing": []
}

Rules:
- origin and destination must be ISO 2-letter country codes.
- Infer from city names: London=GB, Manchester=GB, New York=US, Paris=FR, Dubai=AE, Lagos=NG, Nairobi=KE, Berlin=DE, Amsterdam=NL, Sydney=AU, Toronto=CA, Mumbai=IN, Shanghai=CN.
- Convert lbs to kg if needed (1 lb = 0.453592 kg). Round to 2 decimal places.
- If dimensions not mentioned: set to null, add field name to missing array.
- If goods_value not mentioned: set to null, add "goods_value" to missing.
- If goods_description not mentioned: set to null, add "goods_description" to missing.
- Never guess dimensions. Only include if user stated them.
- missing array contains only field names the user did not provide.`

// Pull the user's business address from their profile — no defaults, no fallbacks
async function getUserSender(supabase: ReturnType<typeof createClient>, userId: string): Promise<
  { sender: PMAddress; error: null } |
  { sender: null; error: { message: string; profile_missing: string[] } }
> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('business_name, full_name, phone, address, town, county, postcode')
    .eq('id', userId)
    .single()

  const profileMissing: string[] = []
  if (!profile?.address) profileMissing.push('address')
  if (!profile?.town) profileMissing.push('town')
  if (!profile?.postcode) profileMissing.push('postcode')

  if (profileMissing.length > 0) {
    return {
      sender: null,
      error: {
        message: `Your profile is missing: ${profileMissing.join(', ')}. Go to Settings and add your business address before getting a quote.`,
        profile_missing: profileMissing,
      },
    }
  }

  return {
    sender: {
      name: profile!.business_name || profile!.full_name || 'Sender',
      phone: profile!.phone || undefined,
      address1: profile!.address,
      town: profile!.town,
      county: profile!.county || profile!.town, // PM requires county — fall back to town only
      postcode: profile!.postcode,
    },
    error: null,
  }
}

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { action } = body

    // ── TEST CONNECTION ──────────────────────────────────────────
    if (action === 'test') {
      const ok = await testConnection()
      return NextResponse.json({ success: ok })
    }

    // ── PARSE NATURAL LANGUAGE ───────────────────────────────────
    if (action === 'parse') {
      const { text } = body
      if (!text || typeof text !== 'string') {
        return NextResponse.json({ error: 'text is required' }, { status: 400 })
      }

      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        system: PARSE_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: text }],
      })
      logUsage({ route: 'quote', model: 'claude-sonnet-4-6', usage: response.usage, userId: user.id })

      const raw = response.content[0].type === 'text' ? response.content[0].text : ''

      let parsed
      try {
        parsed = JSON.parse(raw.replace(/```json|```/g, '').trim())
      } catch {
        return NextResponse.json({ error: 'Failed to parse response', raw }, { status: 500 })
      }

      return NextResponse.json({ success: true, parsed })
    }

    // ── GET QUOTES ───────────────────────────────────────────────
    if (action === 'get_quotes') {
      const {
        origin, destination,
        weight_kg, length_cm, width_cm, height_cm,
        goods_value, recipient,
      } = body

      // Validate parcel fields
      const missing: string[] = []
      if (!origin) missing.push('origin')
      if (!destination) missing.push('destination')
      if (!weight_kg) missing.push('weight_kg')
      if (!length_cm) missing.push('length_cm')
      if (!width_cm) missing.push('width_cm')
      if (!height_cm) missing.push('height_cm')
      if (!goods_value) missing.push('goods_value')

      if (missing.length > 0) {
        return NextResponse.json({ error: 'Missing required fields', missing }, { status: 400 })
      }

      // Require user's own profile address — no defaults
      const { sender, error: senderError } = await getUserSender(supabase, user.id)
      if (senderError) {
        return NextResponse.json({ error: 'profile_incomplete', ...senderError }, { status: 422 })
      }

      const params: PMQuoteParams = {
        origin,
        destination,
        boxes: [{
          length: Number(length_cm),
          width: Number(width_cm),
          height: Number(height_cm),
          weight: Number(weight_kg),
        }],
        goods_value: Number(goods_value),
        sender: sender!,
        // For quote only, recipient placeholder is fine — doesn't affect pricing
        // Real recipient required only at CreateShipment stage
        recipient: recipient || getPlaceholderRecipient(destination),
      }

      const quotes = await getQuotes(params)

      await supabase.from('audit_log').insert({
        user_id: user.id,
        event: 'parcel_quote',
        metadata: { origin, destination, weight_kg, quotes_returned: quotes.length },
      })

      return NextResponse.json({ success: true, quotes, params })
    }

    // ── CREATE SHIPMENT ──────────────────────────────────────────
    if (action === 'create_shipment') {
      const {
        service, origin, destination,
        weight_kg, length_cm, width_cm, height_cm,
        goods_value, goods_description,
        collection_date, recipient, customs,
      } = body

      if (!service || !origin || !destination || !recipient) {
        return NextResponse.json({ error: 'Missing required shipment fields' }, { status: 400 })
      }

      // Require user's own profile address — no defaults
      const { sender, error: senderError } = await getUserSender(supabase, user.id)
      if (senderError) {
        return NextResponse.json({ error: 'profile_incomplete', ...senderError }, { status: 422 })
      }

      const shipment = await createShipment({
        service,
        origin,
        destination,
        boxes: [{
          length: Number(length_cm),
          width: Number(width_cm),
          height: Number(height_cm),
          weight: Number(weight_kg),
        }],
        goods_value: Number(goods_value),
        goods_description,
        collection_date,
        sender: sender!,
        recipient,
        customs,
      })

      // Save to shipments table — same shape as existing shipments
      await supabase.from('shipments').insert({
        user_id: user.id,
        tracking_number: String(shipment.ShipmentId),
        track_status: 'Booked',
        shipment_type: 'outbound',
        supplier_name: `${origin} → ${destination}`,
        label_url: shipment.label_url,
        tracking_url: shipment.tracking_url,
      })

      await supabase.from('audit_log').insert({
        user_id: user.id,
        event: 'parcel_booked',
        metadata: { shipment_id: shipment.ShipmentId, service, origin, destination },
      })

      return NextResponse.json({ success: true, shipment })
    }

    // ── PAYMENT LINK ─────────────────────────────────────────────
    if (action === 'payment_link') {
      const { shipment_ids } = body
      if (!Array.isArray(shipment_ids) || shipment_ids.length === 0) {
        return NextResponse.json({ error: 'shipment_ids array required' }, { status: 400 })
      }
      const url = await getPaymentLink(shipment_ids)
      return NextResponse.json({ success: true, url })
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[/api/quote]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
