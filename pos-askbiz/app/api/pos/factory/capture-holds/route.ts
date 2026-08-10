import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { hasPermission } from '@/lib/pos-permissions'
import { logPosAudit } from '@/lib/pos-audit'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

// A hold is "open" if it hasn't been manually cleared AND (it has no fixed
// duration — regulatory, can only resolve via manual clearance — OR its
// releasable_at hasn't passed yet). Computed here rather than via a cron
// flipping a status column, so it's always correct with zero background job.
function isOpen(hold: { cleared_at: string | null; releasable_at: string | null }): boolean {
  if (hold.cleared_at) return false
  if (!hold.releasable_at) return true
  return new Date(hold.releasable_at).getTime() > Date.now()
}

// ─────────────────────────────────────────────────────────────
// GET — list capture holds (filterable by status)
// Query: ?status=open|cleared (default: all)
// ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  // Same visibility as the capture list itself — anyone who can see
  // captures at all should be able to see whether one is held.
  const canView =
    hasPermission(auth.role, 'camera.intake') ||
    hasPermission(auth.role, 'camera.output') ||
    hasPermission(auth.role, 'camera.wastage') ||
    hasPermission(auth.role, 'camera.dispatch') ||
    hasPermission(auth.role, 'camera.packaging') ||
    hasPermission(auth.role, 'capture.approve')
  if (!canView) return json({ error: 'Access denied' }, 403)

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') // 'open' | 'cleared'
  const captureId = searchParams.get('capture_id')

  let query = service
    .from('pos_factory_capture_holds')
    .select(`
      *,
      capture:pos_factory_captures!capture_id(id, product_name, photo_url, type, quantity, batch_ref),
      cleared_by_staff:pos_staff!cleared_by(id, name)
    `)
    .eq('owner_id', auth.ownerId)
    .order('created_at', { ascending: false })
    .limit(200)

  if (captureId) query = query.eq('capture_id', captureId)

  const { data, error } = await query
  if (error) return json({ error: error.message }, 500)

  const holds = (data || []).map(h => ({ ...h, is_open: isOpen(h) }))
  const filtered = status ? holds.filter(h => (status === 'open' ? h.is_open : !h.is_open)) : holds

  return json({ holds: filtered, openCount: holds.filter(h => h.is_open).length })
}

// ─────────────────────────────────────────────────────────────
// PATCH — clear a hold (camera-first: a photo is required)
// Body: { id, image (base64) }
// ─────────────────────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)
  if (!hasPermission(auth.role, 'hold.clear')) {
    return json({ error: 'Your role does not have permission to clear a hold' }, 403)
  }

  const { id, image } = await req.json()
  if (!id || !image) return json({ error: 'id and image required' }, 400)

  const service = createServiceClient()

  const { data: existing } = await service
    .from('pos_factory_capture_holds')
    .select('id, cleared_at')
    .eq('id', id)
    .eq('owner_id', auth.ownerId)
    .maybeSingle()

  if (!existing) return json({ error: 'Hold not found' }, 404)
  if (existing.cleared_at) return json({ error: 'This hold is already cleared' }, 400)

  // Upload the clearance photo — same bucket/pattern as pos_factory_captures.
  let photoUrl = ''
  try {
    const base64Data = (image as string).replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')
    const filename = `${auth.ownerId}/hold-clear_${Date.now()}.jpg`

    const { error: uploadErr } = await service.storage
      .from('factory-captures')
      .upload(filename, buffer, { contentType: 'image/jpeg', upsert: false })

    if (uploadErr) {
      photoUrl = `data:image/jpeg;base64,${base64Data}`
    } else {
      const { data: signedData, error: signErr } = await service.storage
        .from('factory-captures')
        .createSignedUrl(filename, 60 * 60 * 24 * 365 * 10)
      photoUrl = !signErr && signedData?.signedUrl ? signedData.signedUrl : `data:image/jpeg;base64,${base64Data}`
    }
  } catch (err) {
    console.error('Hold clearance photo upload error:', err)
    return json({ error: 'Image upload failed' }, 500)
  }

  const { data: updated, error } = await service
    .from('pos_factory_capture_holds')
    .update({
      cleared_at: new Date().toISOString(),
      cleared_by: auth.staffId || null,
      clearance_photo_url: photoUrl,
    })
    .eq('id', id)
    .eq('owner_id', auth.ownerId)
    .select('*, capture:pos_factory_captures!capture_id(id, product_name, photo_url)')
    .single()

  if (error) return json({ error: error.message }, 500)

  logPosAudit({
    auth, event: 'hold.cleared', entityType: 'factory_capture_hold', entityId: id,
    metadata: { label: updated.label },
  })

  return json({ hold: updated })
}
