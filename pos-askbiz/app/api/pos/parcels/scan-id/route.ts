import { NextRequest, NextResponse } from 'next/server'
import { resolvePosAuth, roleCanAccess } from '@/lib/pos-auth'
import { logUsage } from '@/lib/log-usage'

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
    const _groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: `data:${mediaType};base64,${imageData}` } },
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
      }),
    })
    const _groqData = await _groqRes.json()
    const text = _groqData.choices?.[0]?.message?.content || ''
    logUsage({ route: 'pos/parcels/scan-id', model: 'meta-llama/llama-4-scout-17b-16e-instruct', usage: { input_tokens: _groqData.usage?.prompt_tokens ?? 0, output_tokens: _groqData.usage?.completion_tokens ?? 0 }, userId: auth.ownerId })
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
    return json({
      id_number: null, full_name: null, doc_type: 'unknown', confidence: 0,
      message: 'AI recognition is temporarily unavailable. Type the ID in manually.',
    }, 500)
  }
}
