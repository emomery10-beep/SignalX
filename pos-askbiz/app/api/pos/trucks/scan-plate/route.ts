import { NextRequest, NextResponse } from 'next/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { logUsage } from '@/lib/log-usage'

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

// POST — read a vehicle's number plate (and make/model if visible) from a photo.
// Body: { image }  →  { registration, make_model, confidence }
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  const body = await req.json()
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
              text: `You are reading a photo of a delivery truck or van for a fleet management system.
Identify:
1. The number plate / licence registration (exactly as printed, including spaces — e.g. "KDA 123A").
2. The make and model if visible or identifiable (e.g. "Isuzu FRR", "Toyota Hiace"). Null if unclear.

Respond with ONLY a JSON object, no other text:
{"registration": "<plate or null>", "make_model": "<make model or null>", "confidence": "<high|medium|low>"}

If no plate is readable, set registration to null and confidence to "low".`,
            },
          ],
        }],
      }),
    })
    const _groqData = await _groqRes.json()
    const text = _groqData.choices?.[0]?.message?.content || ''
    logUsage({ route: 'pos/trucks/scan-plate', model: 'meta-llama/llama-4-scout-17b-16e-instruct', usage: { input_tokens: _groqData.usage?.prompt_tokens ?? 0, output_tokens: _groqData.usage?.completion_tokens ?? 0 }, userId: auth.ownerId })
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) return json({ registration: null, make_model: null, confidence: 'low' })

    const parsed = JSON.parse(match[0])
    return json({
      registration: parsed.registration || null,
      make_model:   parsed.make_model || null,
      confidence:   parsed.confidence || 'low',
    })
  } catch (err: any) {
    return json({ error: err?.message || 'Plate scan failed' }, 500)
  }
}
