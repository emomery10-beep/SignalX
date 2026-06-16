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

// POST — send a quote approval link to the customer via SMS/WhatsApp
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  if (!hasPermission(auth.role, 'service.manage')) {
    return json({ error: 'Only repair staff or above can send quote links' }, 403)
  }

  const service = createServiceClient()
  const { job_id } = await req.json()

  if (!job_id) return json({ error: 'job_id required' }, 400)

  const { data: job } = await service
    .from('pos_service_jobs')
    .select('*')
    .eq('id', job_id)
    .eq('owner_id', auth.ownerId)
    .maybeSingle()

  if (!job) return json({ error: 'Job not found' }, 404)
  if (job.status !== 'quoted') return json({ error: 'Job must be in quoted status' }, 400)
  if (!job.customer_phone) return json({ error: 'No customer phone on this job' }, 400)

  // Get business name from profile
  const { data: profile } = await service
    .from('profiles')
    .select('business_name, currency_symbol')
    .eq('id', auth.ownerId)
    .single()

  const businessName = profile?.business_name || 'Your repair shop'
  const currency = profile?.currency_symbol || '£'

  // Send quote notification via existing notification system
  const notifyResult = await fetch(new URL('/api/pos/notifications/send', req.url).toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-staff-id': auth.staffId || '',
      'x-owner-id': auth.ownerId,
    },
    body: JSON.stringify({
      notification_type: 'service_quote',
      recipient_phone: job.customer_phone,
      message_template: 'service_quote',
      data: {
        business_name: businessName,
        ticket_number: job.ticket_number,
        device_model: job.device_model || 'your device',
        fault_description: job.fault_description,
        quoted_price: `${currency}${Number(job.quoted_price).toFixed(2)}`,
        customer_name: job.customer_name || 'Customer',
      },
    }),
  }).catch(err => {
    console.error('Quote notification failed:', err)
    return null
  })

  // Log in history
  await service.from('pos_service_job_history').insert({
    job_id,
    from_status: job.status,
    to_status: job.status,
    changed_by: auth.staffId || null,
    notes: `Quote sent to customer via SMS/WhatsApp: ${currency}${Number(job.quoted_price).toFixed(2)}`,
  })

  return json({
    sent: true,
    message: `Quote of ${currency}${Number(job.quoted_price).toFixed(2)} sent to ${job.customer_phone}`,
  })
}
