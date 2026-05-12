import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'

async function resolveOwnerId(req: NextRequest): Promise<string | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) return user.id

  // Staff PIN auth fallback
  const staffId = req.headers.get('x-staff-id')
  const ownerId = req.headers.get('x-owner-id')
  if (!staffId || !ownerId) return null

  const service = createServiceClient()
  const { data: staff } = await service
    .from('pos_staff')
    .select('id')
    .eq('id', staffId)
    .eq('owner_id', ownerId)
    .eq('active', true)
    .maybeSingle()

  return staff ? ownerId : null
}

export async function POST(req: NextRequest) {
  const ownerId = await resolveOwnerId(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()

  try {
    const formData = await req.formData()
    const image = formData.get('image') as File
    if (!image) return NextResponse.json({ error: 'Image required' }, { status: 400 })

    // Convert image to base64
    const buffer = await image.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    const mediaType = image.type as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'

    // Call Claude with vision to recognize products
    const client = new Anthropic()
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64,
              },
            },
            {
              type: 'text',
              text: `Analyze this product image for inventory. Extract:
              1. Product name(s) visible
              2. Approximate quantity if visible
              3. Product type/category

              Respond in JSON: { products: [{ name: string, quantity: number, category: string, confidence: 0-100 }] }
              Be concise and practical for a retail inventory system.`,
            },
          ],
        },
      ],
    })

    // Parse Claude's response
    const content = response.content[0]
    if (content.type !== 'text') {
      return NextResponse.json({ error: 'Unexpected response type' }, { status: 500 })
    }

    let recognized
    try {
      // Extract JSON from response (might have markdown code blocks)
      const jsonMatch = content.text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON found')
      recognized = JSON.parse(jsonMatch[0])
    } catch (parseErr) {
      return NextResponse.json({ error: 'Failed to parse image analysis', raw: content.text }, { status: 400 })
    }

    // Store recognition data for analytics
    const { error: storageErr } = await service
      .from('pos_image_recognition')
      .insert({
        owner_id: ownerId,
        products: recognized.products,
        image_size: image.size,
        created_at: new Date().toISOString(),
      })

    if (storageErr) console.warn('Failed to store recognition:', storageErr)

    return NextResponse.json({ products: recognized.products })
  } catch (err: any) {
    console.error('Image recognition error:', err)
    return NextResponse.json({ error: err.message || 'Image recognition failed' }, { status: 500 })
  }
}
