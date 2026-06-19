import { NextRequest, NextResponse } from 'next/server'
import { resolvePosAuth, roleCanAccess } from '@/lib/pos-auth'
import Anthropic from '@anthropic-ai/sdk'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

function parseDataUrl(input: string): { data: string; mediaType: string } {
  const match = input.match(/^data:(image\/[a-zA-Z+.-]+);base64,([\s\S]*)$/)
  if (match) return { mediaType: match[1], data: match[2] }
  return { mediaType: 'image/jpeg', data: input }
}

// POST — read an ID document photo and extract the ID number + name.
// Body: { image: dataURL|base64 }
// The photo is NOT stored — it is used only to extract text, then discarded.
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)
  if (!roleCanAccess(auth.role || '', 'handler')) {
    return json({ error: 'Not permitted' }, 403)
  }

  let body: { image?: string }
  try { body = await req.json() } catch { return json({ error: 'Invalid JSON body' }, 400) }
  if (!body.image) return json({ error: 'image required' }, 400)

  const { data: imageData, mediaType } = parseDataUrl(body.image)

  try {
    const anthropic = new Anthropic()
    const ai = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType as any, data: imageData } },
          {
            type: 'text',
            text: `You are reading a government-issued identity document (national ID card, passport, or driver's licence).
Extract ONLY what is clearly printed. Do not guess or invent.

Reply with valid JSON only, no prose:
{
  "id_number": string | null,   // the document/ID/passport number exactly as printed
  "full_name": string | null,   // the holder's full name
  "doc_type": "national_id" | "passport" | "drivers_licence" | "unknown",
  "confidence": 0.0-1.0
}
If the image is not an ID document or is unreadable, return all nulls with doc_type "unknown" and confidence 0.`,
          },
        ],
      }],
    })

    const text = ai.content[0].type === 'text' ? ai.content[0].text.trim() : ''
    const m = text.match(/\{[\s\S]*\}/)
    if (!m) return json({ id_number: null, full_name: null, doc_type: 'unknown', confidence: 0, message: 'Could not read ID' })

    let parsed: { id_number?: string | null; full_name?: string | null; doc_type?: string; confidence?: number }
    try { parsed = JSON.parse(m[0]) } catch { return json({ id_number: null, full_name: null, doc_type: 'unknown', confidence: 0, message: 'Could not parse ID' }) }

    return json({
      id_number: parsed.id_number ? String(parsed.id_number).trim().slice(0, 40) : null,
      full_name: parsed.full_name ? String(parsed.full_name).trim().slice(0, 120) : null,
      doc_type: ['national_id', 'passport', 'drivers_licence'].includes(parsed.doc_type || '') ? parsed.doc_type : 'unknown',
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0,
    })
  } catch (err: any) {
    console.error('ID scan error:', err)
    const billing = err?.status === 400 && /credit balance/i.test(String(err?.message || ''))
    return json({
      id_number: null, full_name: null, doc_type: 'unknown', confidence: 0,
      message: billing ? 'AI scanning is paused — top up Anthropic API credits. Type the ID in for now.' : 'Scan failed — type the ID in manually.',
    }, billing ? 503 : 500)
  }
}
