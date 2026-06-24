import { NextRequest, NextResponse } from 'next/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import Anthropic from '@anthropic-ai/sdk'
import { logUsage } from '@/lib/log-usage'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { image } = await req.json()
  if (!image) return NextResponse.json({ error: 'image (base64) required' }, { status: 400 })

  const base64 = image.replace(/^data:image\/\w+;base64,/, '')
  const mediaType = image.startsWith('data:image/png') ? 'image/png' : 'image/jpeg'

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: [
        {
          type: 'image',
          source: { type: 'base64', media_type: mediaType, data: base64 },
        },
        {
          type: 'text',
          text: `You are a logistics document reader for a Kenyan parcel courier company.

Classify this photo as exactly one of: "waybill", "invoice", or "receipt".
Then extract all relevant fields.

Return ONLY valid JSON with this structure:

For waybill:
{"document_type":"waybill","confidence":0.95,"data":{"sender_name":"","sender_phone":"","receiver_name":"","receiver_phone":"","destination_city":"","description":"","weight_kg":null,"tracking_number":"","items":[]}}

For invoice:
{"document_type":"invoice","confidence":0.95,"data":{"vendor_name":"","invoice_number":"","items":[{"description":"","quantity":1,"unit_price":0}],"total_amount":0,"currency":"KES","date":"","category":null}}

For receipt:
{"document_type":"receipt","confidence":0.95,"data":{"amount":0,"currency":"KES","payment_method":"","receipt_number":"","payer_name":"","payee_name":"","date":""}}

If the photo is unclear or not a document, return:
{"document_type":"unknown","confidence":0,"data":{},"message":"Could not identify document"}

Extract phone numbers in Kenyan format (07XX or +254). Use KES as default currency. Leave fields empty string if not visible.`,
        },
      ],
    }],
  })
  logUsage({ route: 'pos/parcels/scan', model: 'claude-haiku-4-5-20251001', usage: response.usage, userId: auth.ownerId })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    return NextResponse.json({ error: 'Failed to parse document', raw: text }, { status: 422 })
  }

  try {
    const result = JSON.parse(jsonMatch[0])
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON from AI', raw: text }, { status: 422 })
  }
}
