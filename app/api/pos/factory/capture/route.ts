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

type CaptureType = 'intake' | 'output' | 'wastage' | 'dispatch'

// Permission map: capture type → required permission
const CAPTURE_PERMISSION: Record<CaptureType, Parameters<typeof hasPermission>[1]> = {
  intake:   'camera.intake',
  output:   'camera.output',
  wastage:  'camera.wastage',
  dispatch: 'camera.dispatch',
}

// ─────────────────────────────────────────────────────────────
// GET — list captures (filterable by type / status / date / shift)
// ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  // Any role with at least one camera permission (or supervisor+) can list
  const canView =
    hasPermission(auth.role, 'camera.intake') ||
    hasPermission(auth.role, 'camera.output') ||
    hasPermission(auth.role, 'camera.wastage') ||
    hasPermission(auth.role, 'camera.dispatch') ||
    hasPermission(auth.role, 'capture.approve')

  if (!canView) return json({ error: 'Access denied' }, 403)

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const type      = searchParams.get('type')
  const status    = searchParams.get('status')
  const shift_id  = searchParams.get('shift_id')
  const date      = searchParams.get('date')  // YYYY-MM-DD
  const page      = Math.max(0, parseInt(searchParams.get('page')  || '0'))
  const limit     = Math.min(100, parseInt(searchParams.get('limit') || '50'))

  let query = service
    .from('pos_factory_captures')
    .select(`
      *,
      captured_by_staff:pos_staff!captured_by(id, name, role),
      approved_by_staff:pos_staff!approved_by(id, name, role),
      location:pos_locations!location_id(id, name)
    `, { count: 'exact' })
    .eq('owner_id', auth.ownerId)
    .order('created_at', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)

  if (type)     query = query.eq('type', type)
  if (status)   query = query.eq('status', status)
  if (shift_id) query = query.eq('shift_id', shift_id)
  if (date) {
    query = query
      .gte('created_at', `${date}T00:00:00.000Z`)
      .lt('created_at',  `${date}T23:59:59.999Z`)
  }

  // Non-approvers (floor workers) only see their own captures
  if (!hasPermission(auth.role, 'capture.approve') && auth.staffId) {
    query = query.eq('captured_by', auth.staffId)
  }

  const { data, error, count } = await query
  if (error) return json({ error: error.message }, 500)

  return json({ captures: data, total: count })
}

// ─────────────────────────────────────────────────────────────
// POST — submit a new capture
// Body: { type, image (base64), shift_id?, product_name?, batch_ref?, quantity?, notes? }
// ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  const body = await req.json()
  const { type, image, shift_id, product_name, batch_ref, quantity, notes, location_id } = body

  if (!type || !image) return json({ error: 'type and image required' }, 400)
  if (!['intake', 'output', 'wastage', 'dispatch'].includes(type)) {
    return json({ error: 'type must be intake, output, wastage, or dispatch' }, 400)
  }

  const captureType = type as CaptureType
  if (!hasPermission(auth.role, CAPTURE_PERMISSION[captureType])) {
    return json({ error: `Your role does not have permission to submit ${type} captures` }, 403)
  }

  const service = createServiceClient()

  // Upload photo to Supabase Storage
  let photoUrl = ''
  let storageMode: 'supabase' | 'fallback' = 'supabase'

  try {
    const base64Data = (image as string).replace(/^data:image\/\w+;base64,/, '')
    const buffer     = Buffer.from(base64Data, 'base64')
    const filename   = `${auth.ownerId}/${type}_${Date.now()}.jpg`

    const { error: uploadErr } = await service.storage
      .from('factory-captures')
      .upload(filename, buffer, { contentType: 'image/jpeg', upsert: false })

    if (uploadErr) {
      // Bucket may not exist yet — fall back to data URL
      console.error('factory-captures storage upload failed:', uploadErr.message)
      photoUrl    = `data:image/jpeg;base64,${base64Data}`
      storageMode = 'fallback'
    } else {
      const { data: urlData } = service.storage
        .from('factory-captures')
        .getPublicUrl(filename)
      photoUrl = urlData.publicUrl
    }
  } catch (err) {
    console.error('Factory capture upload error:', err)
    return json({ error: 'Image upload failed' }, 500)
  }

  const { data: capture, error } = await service
    .from('pos_factory_captures')
    .insert({
      owner_id:     auth.ownerId,
      location_id:  location_id || auth.locationId || null,
      shift_id:     shift_id || null,
      captured_by:  auth.staffId || null,
      type:         captureType,
      status:       'pending',
      photo_url:    photoUrl,
      storage:      storageMode,
      product_name: product_name || null,
      batch_ref:    batch_ref    || null,
      quantity:     quantity     ?? null,
      notes:        notes        || null,
    })
    .select(`
      *,
      captured_by_staff:pos_staff!captured_by(id, name, role),
      location:pos_locations!location_id(id, name)
    `)
    .single()

  if (error) return json({ error: error.message }, 500)

  logPosAudit({
    auth, event: 'capture.submitted', entityType: 'factory_capture', entityId: capture.id,
    toValue: captureType,
    metadata: { product_name: product_name || null, batch_ref: batch_ref || null, quantity: quantity ?? null, storage: storageMode },
  })

  return json({ capture }, 201)
}

// ─────────────────────────────────────────────────────────────
// PATCH — approve or reject a capture (supervisor+ only)
// Body: { id, status: 'approved' | 'rejected', rejection_reason? }
// ─────────────────────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  if (!hasPermission(auth.role, 'capture.approve')) {
    return json({ error: 'Only supervisor, manager, or owner can approve captures' }, 403)
  }

  const { id, status, rejection_reason } = await req.json()

  if (!id || !status) return json({ error: 'id and status required' }, 400)
  if (!['approved', 'rejected'].includes(status)) {
    return json({ error: 'status must be approved or rejected' }, 400)
  }
  if (status === 'rejected' && !rejection_reason?.trim()) {
    return json({ error: 'rejection_reason required when rejecting a capture' }, 400)
  }

  const service = createServiceClient()

  // Confirm capture belongs to this owner and is still pending
  const { data: existing } = await service
    .from('pos_factory_captures')
    .select('id, status')
    .eq('id', id)
    .eq('owner_id', auth.ownerId)
    .maybeSingle()

  if (!existing) return json({ error: 'Capture not found' }, 404)
  if (existing.status !== 'pending') {
    return json({ error: `Capture is already ${existing.status}` }, 400)
  }

  const { data: updated, error } = await service
    .from('pos_factory_captures')
    .update({
      status,
      approved_by:      auth.staffId || null,
      approved_at:      status === 'approved' ? new Date().toISOString() : null,
      rejection_reason: status === 'rejected' ? rejection_reason.trim() : null,
    })
    .eq('id', id)
    .eq('owner_id', auth.ownerId)
    .select(`
      *,
      captured_by_staff:pos_staff!captured_by(id, name, role),
      approved_by_staff:pos_staff!approved_by(id, name, role),
      location:pos_locations!location_id(id, name)
    `)
    .single()

  if (error) return json({ error: error.message }, 500)

  logPosAudit({
    auth,
    event: status === 'approved' ? 'capture.approved' : 'capture.rejected',
    entityType: 'factory_capture', entityId: id,
    toValue: status,
    metadata: status === 'rejected' ? { rejection_reason: rejection_reason.trim() } : {},
  })

  return json({ capture: updated })
}
