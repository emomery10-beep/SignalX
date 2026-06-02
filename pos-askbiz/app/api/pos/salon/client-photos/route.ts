import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { hasPermission } from '@/lib/pos-permissions'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

// ─────────────────────────────────────────────────────────────
// GET — list client before/after photos (filter by client)
// ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)
  if (!hasPermission(auth.role, 'sales.view')) return json({ error: 'Access denied' }, 403)

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const client_id = searchParams.get('client_id')

  let query = service
    .from('salon_client_photos')
    .select('*')
    .eq('owner_id', auth.ownerId)
    .order('created_at', { ascending: false })

  if (client_id) query = query.eq('client_id', client_id)

  const { data, error } = await query
  if (error) return json({ error: error.message }, 500)

  return json({ photos: data })
}

// ─────────────────────────────────────────────────────────────
// POST — upload a before/after photo
// Body: { client_id, appointment_id?, image (base64), kind ('before'|'after'),
//         service_type?, notes? }
// ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)
  if (!hasPermission(auth.role, 'sales.create')) return json({ error: 'Access denied' }, 403)

  const body = await req.json()
  const { client_id, appointment_id, image, kind, service_type, notes } = body

  if (!client_id) return json({ error: 'client_id required' }, 400)
  if (!image)     return json({ error: 'image required' }, 400)
  const photoKind = kind === 'after' ? 'after' : 'before'

  const service = createServiceClient()

  // Upload photo to Supabase Storage (salon-photos bucket)
  let photoUrl = ''
  let storageMode: 'supabase' | 'fallback' = 'supabase'

  try {
    const base64Data = (image as string).replace(/^data:image\/\w+;base64,/, '')
    const buffer     = Buffer.from(base64Data, 'base64')
    const filename   = `${auth.ownerId}/photo_${Date.now()}.jpg`

    const { error: uploadErr } = await service.storage
      .from('salon-photos')
      .upload(filename, buffer, { contentType: 'image/jpeg', upsert: false })

    if (uploadErr) {
      // Bucket may not exist yet — fall back to data URL
      console.error('salon-photos storage upload failed:', uploadErr.message)
      photoUrl    = `data:image/jpeg;base64,${base64Data}`
      storageMode = 'fallback'
    } else {
      const { data: urlData } = service.storage
        .from('salon-photos')
        .getPublicUrl(filename)
      photoUrl = urlData.publicUrl
    }
  } catch (err) {
    console.error('Salon photo upload error:', err)
    return json({ error: 'Image upload failed' }, 500)
  }

  const { data: photo, error } = await service
    .from('salon_client_photos')
    .insert({
      owner_id:       auth.ownerId,
      client_id,
      appointment_id: appointment_id || null,
      stylist_id:     auth.staffId   || null,
      photo_url:      photoUrl,
      storage:        storageMode,
      kind:           photoKind,
      service_type:   service_type || null,
      notes:          notes        || null,
    })
    .select('*')
    .single()

  if (error) return json({ error: error.message }, 500)

  return json({ photo }, 201)
}
