import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

// POST — upload a service job photo to Supabase Storage
// Body: { image: base64, job_id: string, type: 'intake' | 'checkout' }
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  if (auth.role !== 'owner' && auth.role !== 'repair') {
    return json({ error: 'Only repair staff or owner can upload photos' }, 403)
  }

  const { image, job_id, type } = await req.json()
  if (!image || !job_id || !type) return json({ error: 'image, job_id, and type required' }, 400)
  if (!['intake', 'checkout'].includes(type)) return json({ error: 'type must be intake or checkout' }, 400)

  const service = createServiceClient()

  // Verify job belongs to owner
  const { data: job } = await service
    .from('pos_service_jobs')
    .select('id, ticket_number')
    .eq('id', job_id)
    .eq('owner_id', auth.ownerId)
    .maybeSingle()

  if (!job) return json({ error: 'Job not found' }, 404)

  try {
    // Decode base64
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')

    const filename = `${auth.ownerId}/${job.ticket_number}_${type}_${Date.now()}.jpg`

    // Upload to Supabase Storage (bucket: service-photos)
    const { data: uploadData, error: uploadErr } = await service.storage
      .from('service-photos')
      .upload(filename, buffer, {
        contentType: 'image/jpeg',
        upsert: true,
      })

    if (uploadErr) {
      // If bucket doesn't exist yet, fall back to storing as base64 URL
      console.error('Storage upload failed (bucket may not exist):', uploadErr.message)
      // Store as data URL fallback
      const dataUrl = `data:image/jpeg;base64,${base64Data}`
      const field = type === 'intake' ? 'intake_photo_url' : 'checkout_photo_url'
      await service.from('pos_service_jobs').update({ [field]: dataUrl }).eq('id', job_id)
      return json({ url: dataUrl, storage: 'fallback' })
    }

    // Get public URL
    const { data: urlData } = service.storage
      .from('service-photos')
      .getPublicUrl(filename)

    const publicUrl = urlData.publicUrl

    // Update the job record
    const field = type === 'intake' ? 'intake_photo_url' : 'checkout_photo_url'
    await service.from('pos_service_jobs').update({ [field]: publicUrl }).eq('id', job_id)

    return json({ url: publicUrl, storage: 'supabase' })
  } catch (err: any) {
    console.error('Photo upload error:', err)
    return json({ error: 'Upload failed' }, 500)
  }
}
