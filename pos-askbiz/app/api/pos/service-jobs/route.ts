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

// GET — list service jobs (filterable by status, assignee, location, customer)
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const assigned_to = searchParams.get('assigned_to')
  const location_id = searchParams.get('location_id') || auth.locationId
  const search = searchParams.get('search') || ''
  const page = Math.max(0, parseInt(searchParams.get('page') || '0'))
  const limit = Math.min(100, parseInt(searchParams.get('limit') || '50'))

  let query = service
    .from('pos_service_jobs')
    .select(`
      *,
      checked_in_staff:pos_staff!checked_in_by(id, name, role),
      assigned_staff:pos_staff!assigned_to(id, name, role),
      checked_out_staff:pos_staff!checked_out_by(id, name, role),
      customer:pos_customers!customer_id(id, phone, name),
      location:pos_locations!location_id(id, name),
      preset:pos_service_presets!preset_id(id, name, category),
      transaction:pos_transactions!paid_by_transaction(id, total, payment_type, status)
    `, { count: 'exact' })
    .eq('owner_id', auth.ownerId)
    .order('created_at', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)

  if (status) query = query.eq('status', status)
  if (assigned_to) query = query.eq('assigned_to', assigned_to)
  if (location_id) query = query.eq('location_id', location_id)

  // Engineer view: only see own jobs
  if (auth.role === 'engineer' && auth.staffId) {
    query = query.eq('assigned_to', auth.staffId)
  }

  if (search) {
    query = query.or(`ticket_number.ilike.%${search}%,customer_name.ilike.%${search}%,device_model.ilike.%${search}%,device_serial.ilike.%${search}%`)
  }

  const { data, error, count } = await query
  if (error) return json({ error: error.message }, 500)

  return json({ jobs: data, total: count })
}

// POST — create a new service job (intake)
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  // Repair, manager, or owner can create jobs
  if (!hasPermission(auth.role, 'service.manage')) {
    return json({ error: 'Only repair staff, manager, or owner can create service jobs' }, 403)
  }

  const service = createServiceClient()
  const body = await req.json()
  const {
    customer_phone, customer_name, device_model, device_serial,
    device_description, fault_description, intake_photo_url,
    preset_id, quoted_price, location_id, intake_lat, intake_lng,
    estimated_minutes, warranty_job_id,
  } = body

  if (!fault_description?.trim()) {
    return json({ error: 'fault_description required' }, 400)
  }

  // Link or create customer by phone
  let customer_id: string | null = null
  if (customer_phone) {
    const { data: existing } = await service
      .from('pos_customers')
      .select('id')
      .eq('owner_id', auth.ownerId)
      .eq('phone', customer_phone)
      .maybeSingle()

    if (existing) {
      customer_id = existing.id
    } else {
      const { data: newCustomer } = await service
        .from('pos_customers')
        .insert({ owner_id: auth.ownerId, phone: customer_phone, name: customer_name || null })
        .select('id')
        .single()
      if (newCustomer) customer_id = newCustomer.id
    }
  }

  // Check if this is a warranty return
  let isWarrantyReturn = false
  if (warranty_job_id) {
    const { data: warrantyCheck } = await service
      .from('pos_service_warranties')
      .select('id, expires_at, claimed')
      .eq('original_job_id', warranty_job_id)
      .eq('claimed', false)
      .maybeSingle()

    if (warrantyCheck && new Date(warrantyCheck.expires_at) > new Date()) {
      isWarrantyReturn = true
    }
  }

  const jobLocationId = location_id || auth.locationId || null

  // Determine initial status & price
  const initialStatus = quoted_price ? 'quoted' : 'intake'
  const originalQuotedPrice = quoted_price || null

  const { data: job, error } = await service
    .from('pos_service_jobs')
    .insert({
      owner_id: auth.ownerId,
      ticket_number: '',  // trigger auto-generates
      status: initialStatus,
      customer_id,
      customer_phone: customer_phone || null,
      customer_name: customer_name || null,
      device_model: device_model || null,
      device_serial: device_serial || null,
      device_description: device_description || null,
      fault_description: fault_description.trim(),
      intake_photo_url: intake_photo_url || null,
      preset_id: preset_id || null,
      original_quoted_price: originalQuotedPrice,
      quoted_price: originalQuotedPrice,
      checked_in_by: auth.staffId || null,
      location_id: jobLocationId,
      intake_lat: intake_lat || null,
      intake_lng: intake_lng || null,
      estimated_minutes: estimated_minutes || null,
      warranty_job_id: isWarrantyReturn ? warranty_job_id : null,
    })
    .select(`
      *,
      checked_in_staff:pos_staff!checked_in_by(id, name),
      location:pos_locations!location_id(id, name)
    `)
    .single()

  if (error) return json({ error: error.message }, 500)

  // Log the initial status in history
  await service.from('pos_service_job_history').insert({
    job_id: job.id,
    from_status: null,
    to_status: initialStatus,
    changed_by: auth.staffId || null,
    notes: isWarrantyReturn ? 'Warranty return' : 'Job created',
  })

  logPosAudit({
    auth, event: 'job.created', entityType: 'service_job', entityId: job.id,
    toValue: initialStatus,
    metadata: { ticket_number: job.ticket_number, device_model, warranty_return: isWarrantyReturn },
  })

  // If warranty return, mark the warranty as claimed
  if (isWarrantyReturn && warranty_job_id) {
    await service.from('pos_service_warranties')
      .update({ claimed: true, claimed_at: new Date().toISOString(), claim_reason: fault_description.trim(), warranty_job_id: job.id })
      .eq('original_job_id', warranty_job_id)
      .eq('claimed', false)
  }

  // Send intake confirmation SMS to customer
  if (customer_phone) {
    const { data: profile } = await service
      .from('profiles')
      .select('business_name, currency_symbol')
      .eq('id', auth.ownerId)
      .single()

    const businessName = profile?.business_name || 'Repair Centre'
    const currency = profile?.currency_symbol || '£'

    fetch(new URL('/api/pos/notifications/send', req.url).toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-staff-id': auth.staffId || '', 'x-owner-id': auth.ownerId },
      body: JSON.stringify({
        notification_type: 'service_intake',
        recipient_phone: customer_phone,
        message_template: 'service_intake',
        data: {
          business_name: businessName,
          ticket_number: job.ticket_number,
          device_model: device_model || 'your device',
          fault_description: fault_description.trim(),
          customer_name: customer_name || 'Customer',
          quoted_price: originalQuotedPrice ? `${currency}${Number(originalQuotedPrice).toFixed(2)}` : 'TBC',
          estimated_time: estimated_minutes ? `~${estimated_minutes} min` : 'TBC',
        },
      }),
    }).catch(err => console.error('Intake notification failed:', err))
  }

  return json({ job }, 201)
}

// PATCH — update a service job (status transitions, assignment, notes, photos, pricing)
export async function PATCH(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  const service = createServiceClient()
  const body = await req.json()
  const { id, ...fields } = body

  if (!id) return json({ error: 'id required' }, 400)

  // Fetch current job
  const { data: current, error: fetchErr } = await service
    .from('pos_service_jobs')
    .select('*')
    .eq('id', id)
    .eq('owner_id', auth.ownerId)
    .single()

  if (fetchErr || !current) return json({ error: 'Job not found' }, 404)

  // Build allowed updates based on role
  const updates: Record<string, unknown> = {}
  const allowedFields = [
    'status', 'quoted_price', 'assigned_to', 'engineer_notes',
    'additional_issues', 'checkout_photo_url', 'checked_out_by',
    'paid_by_transaction', 'cancel_reason', 'due_by', 'estimated_minutes',
    'fault_description', 'device_model', 'device_serial', 'device_description',
    'customer_phone', 'customer_name', 'preset_id', 'intake_photo_url',
  ]

  for (const key of allowedFields) {
    if (fields[key] !== undefined) updates[key] = fields[key]
  }

  // Status transition validation
  if (fields.status) {
    const validTransitions: Record<string, string[]> = {
      intake: ['quoted', 'cancelled'],
      quoted: ['accepted', 'cancelled', 'quoted'],  // re-quote allowed
      accepted: ['in_progress', 'cancelled'],
      in_progress: ['completed', 'quoted'],  // engineer can re-quote if more issues found
      completed: ['collected', 'in_progress'],  // can re-open if customer reports issue at pickup
      collected: [],
      cancelled: ['intake'],  // can re-open cancelled job
    }

    const allowed = validTransitions[current.status] || []
    if (!allowed.includes(fields.status)) {
      return json({ error: `Cannot transition from '${current.status}' to '${fields.status}'` }, 400)
    }

    // Track original price when re-quoting
    if (fields.status === 'quoted' && current.status !== 'intake' && fields.quoted_price) {
      if (!current.original_quoted_price) {
        updates.original_quoted_price = current.quoted_price
      }
    }

    // Set checked_out_by on collection
    if (fields.status === 'collected' && auth.staffId) {
      updates.checked_out_by = auth.staffId
    }
  }

  // Engineer can only update their assigned jobs
  if (auth.role === 'engineer' && auth.staffId && current.assigned_to !== auth.staffId) {
    return json({ error: 'Engineers can only update their assigned jobs' }, 403)
  }

  if (Object.keys(updates).length === 0) {
    return json({ error: 'No valid fields to update' }, 400)
  }

  const { data: updated, error: updateErr } = await service
    .from('pos_service_jobs')
    .update(updates)
    .eq('id', id)
    .eq('owner_id', auth.ownerId)
    .select(`
      *,
      checked_in_staff:pos_staff!checked_in_by(id, name, role),
      assigned_staff:pos_staff!assigned_to(id, name, role),
      checked_out_staff:pos_staff!checked_out_by(id, name, role),
      customer:pos_customers!customer_id(id, phone, name),
      location:pos_locations!location_id(id, name)
    `)
    .single()

  if (updateErr) return json({ error: updateErr.message }, 500)

  // Send notification on completion
  if (fields.status === 'completed' && current.status !== 'completed') {
    const phone = updated.customer_phone || (updated as any).customer?.phone
    if (phone) {
      await fetch(new URL('/api/pos/notifications/send', req.url).toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-staff-id': auth.staffId || '',
          'x-owner-id': auth.ownerId,
        },
        body: JSON.stringify({
          notification_type: 'service_ready',
          recipient_phone: phone,
          message_template: 'service_ready',
          data: {
            ticket_number: updated.ticket_number,
            device_model: updated.device_model || 'your device',
            customer_name: updated.customer_name || 'Customer',
          },
        }),
      }).catch(err => console.error('Failed to send service notification:', err))
    }
  }

  // Send collection receipt + warranty info
  if (fields.status === 'collected' && current.status !== 'collected') {
    const phone = updated.customer_phone || (updated as any).customer?.phone
    if (phone) {
      const { data: profile } = await service
        .from('profiles')
        .select('business_name, currency_symbol')
        .eq('id', auth.ownerId)
        .single()

      const currency = profile?.currency_symbol || '£'
      const businessName = profile?.business_name || 'Repair Centre'

      // Collection receipt
      fetch(new URL('/api/pos/notifications/send', req.url).toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-staff-id': auth.staffId || '', 'x-owner-id': auth.ownerId },
        body: JSON.stringify({
          notification_type: 'service_collected',
          recipient_phone: phone,
          message_template: 'service_collected',
          data: {
            ticket_number: updated.ticket_number,
            device_model: updated.device_model || 'your device',
            customer_name: updated.customer_name || 'Customer',
            total_paid: updated.quoted_price ? `${currency}${Number(updated.quoted_price).toFixed(2)}` : 'N/A',
            business_name: businessName,
          },
        }),
      }).catch(err => console.error('Collection notification failed:', err))

      // Warranty info (sent separately)
      fetch(new URL('/api/pos/notifications/send', req.url).toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-staff-id': auth.staffId || '', 'x-owner-id': auth.ownerId },
        body: JSON.stringify({
          notification_type: 'service_warranty',
          recipient_phone: phone,
          message_template: 'service_warranty',
          data: {
            ticket_number: updated.ticket_number,
            device_model: updated.device_model || 'your device',
            customer_name: updated.customer_name || 'Customer',
            warranty_days: 90,
            warranty_expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            business_name: businessName,
          },
        }),
      }).catch(err => console.error('Warranty notification failed:', err))
    }
  }

  // Log manual history entry if notes provided
  if (fields.history_note) {
    await service.from('pos_service_job_history').insert({
      job_id: id,
      from_status: current.status,
      to_status: updated.status,
      changed_by: auth.staffId || null,
      notes: fields.history_note,
    })
  }

  // Audit log — record status changes and significant field updates
  if (fields.status && fields.status !== current.status) {
    logPosAudit({
      auth, event: 'job.status_change', entityType: 'service_job', entityId: id,
      fromValue: current.status, toValue: fields.status,
      metadata: { ticket_number: updated.ticket_number, device_model: updated.device_model },
    })
  } else if (Object.keys(updates).length > 0) {
    logPosAudit({
      auth, event: 'job.updated', entityType: 'service_job', entityId: id,
      metadata: { fields_updated: Object.keys(updates), ticket_number: updated.ticket_number },
    })
  }

  return json({ job: updated })
}
