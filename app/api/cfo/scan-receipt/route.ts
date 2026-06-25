import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logUsage } from '@/lib/log-usage'

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

const GROQ_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct'
const GROQ_URL   = 'https://api.groq.com/openai/v1/chat/completions'

// POST — scan receipt image via Groq vision, extract expense fields
export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return json({ error: 'Unauthorised' }, 401)

  let body: { image: string; mediaType?: string }
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  const { image, mediaType = 'image/jpeg' } = body
  if (!image) return json({ error: 'image required' }, 400)

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  const safeMediaType = allowedTypes.includes(mediaType) ? mediaType : 'image/jpeg'

  try {
    const groqRes = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:${safeMediaType};base64,${image}`,
              },
            },
            {
              type: 'text',
              text: `You are a receipt scanning assistant for a business expense tracker. Analyse this receipt image and extract all expense information.

TASK: Extract the following from the receipt:
1. Vendor / merchant name (the business that issued the receipt)
2. Date of the transaction (format as YYYY-MM-DD, use today if not visible)
3. Total amount paid (numbers only, no currency symbol)
4. Best expense category from this list: "Supplier / Stock Purchase", "Rent / Lease", "Payroll", "Utilities", "Software / SaaS", "Marketing & Ads", "Supplies", "Travel", "Meals & Entertainment", "Shipping", "Professional Services", "Equipment", "Insurance", "Taxes & Fees", "Other"
5. Brief notes (one line summary of what was purchased, or empty string if unclear)
6. Confidence score 0-100 (how well you could read the receipt)

Reply ONLY with valid JSON, nothing else:
{"vendor":"name","date":"YYYY-MM-DD","amount":0.00,"category":"Other","notes":"","confidence":75}

Rules:
- If the receipt is unclear or not a receipt, set confidence below 50
- amount must be a number (not a string)
- date must be YYYY-MM-DD format
- category must exactly match one of the options listed`,
            },
          ],
        }],
      }),
    })

    if (!groqRes.ok) {
      const err = await groqRes.text()
      console.error('[cfo/scan-receipt] Groq error:', err)
      return json({ error: 'Receipt scan failed' }, 500)
    }

    const groqData = await groqRes.json()
    const text = (groqData.choices?.[0]?.message?.content || '').trim()

    logUsage({
      route: 'cfo/scan-receipt',
      model: GROQ_MODEL,
      usage: {
        input_tokens: groqData.usage?.prompt_tokens || 0,
        output_tokens: groqData.usage?.completion_tokens || 0,
      },
      userId: user.id,
    })

    const jsonMatch = text.match(/\{[\s\S]*?\}/)
    if (!jsonMatch) return json({ error: 'Could not read receipt' }, 422)

    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(jsonMatch[0])
    } catch {
      return json({ error: 'Could not parse AI response' }, 422)
    }

    return json({
      vendor: String(parsed.vendor || ''),
      date: String(parsed.date || new Date().toISOString().split('T')[0]),
      amount: Number(parsed.amount) || 0,
      category: String(parsed.category || 'Other'),
      notes: String(parsed.notes || ''),
      confidence: typeof parsed.confidence === 'number' ? Math.round(parsed.confidence) : 0,
    })
  } catch (err: any) {
    console.error('Receipt scan error:', err)
    return json({ error: 'Receipt scan failed' }, 500)
  }
}
