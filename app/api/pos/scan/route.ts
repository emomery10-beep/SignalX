import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const { image } = await req.json()
  if (!image) return NextResponse.json({ error: 'image required' }, { status: 400 })

  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: 'image/jpeg', data: image },
          },
          {
            type: 'text',
            text: `Look at this image of a product or price tag. Extract:
1. The product name (short, clear name — e.g. "Blue Shirt", "Soap Bar", "Widget A")
2. The price as a number (e.g. 45.00)

If you cannot see a clear price, return price as null.
If you cannot determine a product name, use a short description of what you see.

Reply ONLY with valid JSON in this exact format, nothing else:
{"name":"product name","price":0.00}`,
          },
        ],
      }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text.trim() : ''

    // Parse JSON from Claude's response
    const match = text.match(/\{[^}]+\}/)
    if (!match) return NextResponse.json({ error: 'Could not parse response' }, { status: 422 })

    const result = JSON.parse(match[0])
    if (!result.name || result.price === null || result.price === undefined) {
      return NextResponse.json({ error: 'Price not found in image' }, { status: 422 })
    }

    return NextResponse.json({ name: result.name, price: parseFloat(result.price) })
  } catch (err) {
    console.error('Scan error:', err)
    return NextResponse.json({ error: 'Scan failed' }, { status: 500 })
  }
}
