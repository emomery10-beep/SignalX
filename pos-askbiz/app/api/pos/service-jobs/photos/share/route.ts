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

// POST — send everything not yet shared for a job as ONE WhatsApp message
// (technician-triggered, never automatic — see service_progress_photos in
// notifications/send's buildMessage()). Only marks photos shared_at once
// the send actually went through (whatsapp or email), so a hard failure
// leaves them picked up again on the next attempt; an explicit customer
// opt-out also leaves them unshared (retrying just re-reports the opt-out,
// no harm, and avoids silently claiming something was delivered when it
// wasn't).
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  if (!hasPermission(auth.role, 'service.upload_photo')) {
    return json({ error: 'Only repair staff, engineer, manager, or owner can share photos' }, 403)
  }

  const { job_id } = await req.json()
  if (!job_id) return json({ error: 'job_id required' }, 400)

  const service = createServiceClient()

  const { data: job } = await service
    .from('pos_service_jobs')
    .select('id, ticket_number, device_model, customer_name, customer_phone, assigned_to, customer:pos_customers!customer_id(phone)')
    .eq('id', job_id)
    .eq('owner_id', auth.ownerId)
    .maybeSingle()
  if (!job) return json({ error: 'Job not found' }, 404)
  if (isTechnicianRole(auth.role) && auth.staffId && job.assigned_to !== auth.staffId) {
    return json({ error: 'Engineers can only share photos on their assigned jobs' }, 403)
  }

  const phone = job.customer_phone || (job as any).customer?.phone
  if (!phone) return json({ sent: false, reason: 'no_customer_phone' })

  const { data: photos, error: photosErr } = await service
    .from('pos_service_job_photos')
    .select('id, photo_url, stage')
    .eq('job_id', job_id)
    .is('shared_at', null)
    .order('created_at', { ascending: true })

  if (photosErr) return json({ error: photosErr.message }, 500)
  if (!photos || photos.length === 0) return json({ sent: false, reason: 'nothing_new' })

  // The link travels as the template's URL BUTTON dynamic suffix (job_id),
  // not embedded in body text — Meta rejects a raw URL substituted into a
  // body parameter (error 132018, confirmed live 08-09). See
  // lib/whatsapp.ts's sendPhotoUpdate.
  const notifRes = await fetch(new URL('/api/pos/notifications/send', req.url).toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-staff-id': auth.staffId || '', 'x-owner-id': auth.ownerId },
    body: JSON.stringify({
      notification_type: 'service_photo_update',
      recipient_phone: phone,
      message_template: 'service_photo_update',
      data: {
        job_id: job.id,
        ticket_number: job.ticket_number,
        device_model: job.device_model || 'your device',
        customer_name: job.customer_name || 'Customer',
      },
    }),
  })
  const notifData = await notifRes.json().catch(() => ({}))

  const delivered = notifRes.ok && !notifData.skipped &&
    (notifData.status === 'sent_whatsapp' || notifData.status === 'sent_email' || notifData.status === 'sent_both')

  if (delivered) {
    await service
      .from('pos_service_job_photos')
      .update({ shared_at: new Date().toISOString() })
      .in('id', photos.map(p => p.id))
  }

  return json({ sent: delivered, photos_shared: delivered ? photos.length : 0, detail: notifData })
}
