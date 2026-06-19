import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth, roleCanAccess } from '@/lib/pos-auth'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

const BUCKET = 'parcel-photos'
const MAX_BYTES = 10 * 1024 * 1024 // 10 MB — must match the bucket limit
const SIGNED_TTL = 60 * 60 * 24 * 365 // 1 year
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']

// POST — upload a parcel intake photo to the PRIVATE parcel-photos bucket.
// Proof-of-intake; may contain personal data, so it is never public.
// Body: { image: dataURL|base64, tracking_number?: string }
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  // counter-clerk (handler level) and above may capture intake photos
  if (!roleCanAccess(auth.role || '', 'handler')) {
    return json({ error: 'Not permitted to upload parcel photos' }, 403)
  }

  let body: { image?: string; tracking_number?: string }
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  const { image, tracking_number } = body
  if (!image || typeof image !== 'string') return json({ error: 'image required' }, 400)

  // Derive mime from the data URL prefix when present
  const mimeMatch = image.match(/^data:(image\/[\w.+-]+);base64,/)
  const contentType = mimeMatch ? mimeMatch[1].toLowerCase() : 'image/jpeg'
  if (!ALLOWED.includes(contentType)) {
    return json({ error: `Unsupported image type. Allowed: ${ALLOWED.join(', ')}` }, 415)
  }

  const base64Data = image.replace(/^data:image\/[\w.+-]+;base64,/, '')
  let buffer: Buffer
  try {
    buffer = Buffer.from(base64Data, 'base64')
  } catch {
    return json({ error: 'Malformed image data' }, 400)
  }
  if (buffer.length === 0) return json({ error: 'Empty image' }, 400)
  if (buffer.length > MAX_BYTES) {
    return json({ error: 'Image too large (max 10 MB)' }, 413)
  }

  const service = createServiceClient()
  const ext = contentType.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg'
  const safeTrack = (tracking_number || 'parcel').replace(/[^A-Za-z0-9_-]/g, '')
  // Path is namespaced by owner so deletion/erasure can target an owner prefix.
  const path = `${auth.ownerId}/${safeTrack}_${Date.now()}.${ext}`

  const { error: uploadErr } = await service.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType, upsert: false })

  if (uploadErr) {
    console.error('Parcel photo upload failed:', uploadErr.message)
    return json({ error: 'Upload failed' }, 500)
  }

  // Private bucket → signed URL (public URLs would 403 and would leak PII if they didn't)
  const { data: signed, error: signErr } = await service.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_TTL)

  if (signErr) {
    console.error('Signed URL failed:', signErr.message)
    // Upload succeeded; caller can re-sign from the path later
    return json({ path, url: null }, 201)
  }

  return json({ path, url: signed.signedUrl }, 201)
}
