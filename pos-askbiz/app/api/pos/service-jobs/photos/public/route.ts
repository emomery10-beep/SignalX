import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// GET — public, unauthenticated: what a customer sees after tapping the
// "View Photos" button in the askbiz_photo_update WhatsApp message. Scoped
// to shared_at IS NOT NULL only — a job's not-yet-shared progress photos
// (still being worked on) are never exposed here, only what the shop
// actually chose to share. No price, no customer PII beyond the job's own
// device/ticket info (which the customer already knows, having received
// this link themselves), no staff notes.
export async function GET(req: NextRequest) {
  const jobId = new URL(req.url).searchParams.get('job')
  if (!jobId) return NextResponse.json({ error: 'job required' }, { status: 400 })

  const service = createServiceClient()

  const { data: job } = await service
    .from('pos_service_jobs')
    .select('ticket_number, device_model, status')
    .eq('id', jobId)
    .maybeSingle()
  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data: photos } = await service
    .from('pos_service_job_photos')
    .select('photo_url, stage, created_at')
    .eq('job_id', jobId)
    .not('shared_at', 'is', null)
    .order('created_at', { ascending: true })

  return NextResponse.json({
    ticket_number: job.ticket_number,
    device_model: job.device_model,
    status: job.status,
    photos: photos || [],
  })
}
