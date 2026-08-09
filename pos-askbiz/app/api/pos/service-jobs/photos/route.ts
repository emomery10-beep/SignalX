import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { hasPermission, isTechnicianRole } from '@/lib/pos-permissions'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

const PHOTO_BUCKET = 'service-photos'
const PHOTO_ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']
const STAGES = ['in_progress', 'completed']

// GET — list a job's progress-photo gallery (newest first)
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  const jobId = new URL(req.url).searchParams.get('job_id')
  if (!jobId) return json({ error: 'job_id required' }, 400)

  const service = createServiceClient()

  // Engineers only see photos on their own assigned jobs — mirrors the
  // GET /api/pos/service-jobs list scoping.
  let jobQuery = service.from('pos_service_jobs').select('id, assigned_to').eq('id', jobId).eq('owner_id', auth.ownerId)
  const { data: job } = await jobQuery.maybeSingle()
  if (!job) return json({ error: 'Job not found' }, 404)
  if (isTechnicianRole(auth.role) && auth.staffId && job.assigned_to !== auth.staffId) {
    return json({ error: 'Engineers can only view photos on their assigned jobs' }, 403)
  }

  const { data: photos, error } = await service
    .from('pos_service_job_photos')
    .select('id, photo_url, stage, caption, created_at, shared_at, staff:pos_staff!created_by(id, name)')
    .eq('job_id', jobId)
    .order('created_at', { ascending: false })

  if (error) return json({ error: error.message }, 500)
  return json({ photos })
}

// POST — add a progress photo to a job's gallery.
// Body: { job_id, image: base64, stage: 'in_progress' | 'completed', caption?: string }
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  if (!hasPermission(auth.role, 'service.upload_photo')) {
    return json({ error: 'Only repair staff, engineer, manager, or owner can add photos' }, 403)
  }

  const { job_id, image, stage, caption } = await req.json()
  if (!job_id || !image || !stage) return json({ error: 'job_id, image, and stage required' }, 400)
  if (!STAGES.includes(stage)) return json({ error: `stage must be one of: ${STAGES.join(', ')}` }, 400)

  const service = createServiceClient()

  const { data: job } = await service
    .from('pos_service_jobs')
    .select('id, ticket_number, assigned_to')
    .eq('id', job_id)
    .eq('owner_id', auth.ownerId)
    .maybeSingle()
  if (!job) return json({ error: 'Job not found' }, 404)
  if (isTechnicianRole(auth.role) && auth.staffId && job.assigned_to !== auth.staffId) {
    return json({ error: 'Engineers can only add photos to their assigned jobs' }, 403)
  }

  try {
    const mimeMatch = image.match(/^data:(image\/[\w.+-]+);base64,/)
    const contentType = mimeMatch ? mimeMatch[1].toLowerCase() : 'image/jpeg'
    if (!PHOTO_ALLOWED.includes(contentType)) return json({ error: 'Unsupported image type' }, 400)

    const base64Data = image.replace(/^data:image\/[\w.+-]+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')
    if (buffer.length === 0) return json({ error: 'Empty image' }, 400)

    const ext = contentType.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg'
    const path = `${auth.ownerId}/${job.ticket_number}_progress_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.${ext}`

    let photoUrl: string
    const { error: uploadErr } = await service.storage.from(PHOTO_BUCKET).upload(path, buffer, { contentType, upsert: false })
    if (uploadErr) {
      console.error('Progress photo upload failed, falling back to inline data URL:', uploadErr.message)
      photoUrl = image
    } else {
      photoUrl = service.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl
    }

    const { data: photo, error: insertErr } = await service
      .from('pos_service_job_photos')
      .insert({
        job_id, owner_id: auth.ownerId, photo_url: photoUrl, stage,
        caption: caption || null, created_by: auth.staffId || null,
      })
      .select('id, photo_url, stage, caption, created_at, shared_at')
      .single()

    if (insertErr) return json({ error: insertErr.message }, 500)
    return json({ photo }, 201)
  } catch (err: any) {
    console.error('Progress photo error:', err)
    return json({ error: 'Upload failed' }, 500)
  }
}
