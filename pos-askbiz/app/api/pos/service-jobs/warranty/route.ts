import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

// GET — check warranty status for a job or device serial
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  const { searchParams } = new URL(req.url)
  const job_id = searchParams.get('job_id')
  const serial = searchParams.get('serial')

  const service = createServiceClient()

  if (job_id) {
    const { data, error } = await service
      .from('pos_service_warranties')
      .select(`
        *,
        original_job:pos_service_jobs!original_job_id(id, ticket_number, device_model, fault_description, quoted_price),
        warranty_claim_job:pos_service_jobs!warranty_job_id(id, ticket_number, status)
      `)
      .eq('original_job_id', job_id)
      .eq('owner_id', auth.ownerId)
      .maybeSingle()

    if (error) return json({ error: error.message }, 500)

    if (!data) return json({ warranty: null, message: 'No warranty found for this job' })

    const expiresAt = new Date(data.expires_at)
    return json({
      warranty: {
        ...data,
        is_active: !data.claimed && expiresAt > new Date(),
        days_remaining: Math.max(0, Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))),
      },
    })
  }

  if (serial) {
    // Find warranties by device serial
    const { data: jobs } = await service
      .from('pos_service_jobs')
      .select('id')
      .eq('owner_id', auth.ownerId)
      .eq('device_serial', serial)
      .eq('status', 'collected')

    if (!jobs || jobs.length === 0) return json({ warranties: [] })

    const jobIds = jobs.map((j: any) => j.id)
    const { data, error } = await service
      .from('pos_service_warranties')
      .select(`
        *,
        original_job:pos_service_jobs!original_job_id(id, ticket_number, device_model, fault_description, quoted_price, created_at)
      `)
      .eq('owner_id', auth.ownerId)
      .in('original_job_id', jobIds)
      .order('expires_at', { ascending: false })

    if (error) return json({ error: error.message }, 500)

    const warranties = (data || []).map((w: any) => {
      const expiresAt = new Date(w.expires_at)
      return {
        ...w,
        is_active: !w.claimed && expiresAt > new Date(),
        days_remaining: Math.max(0, Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))),
      }
    })

    return json({ warranties })
  }

  return json({ error: 'job_id or serial required' }, 400)
}
