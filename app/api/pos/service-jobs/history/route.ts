import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

// GET — fetch history for a specific job
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  const { searchParams } = new URL(req.url)
  const job_id = searchParams.get('job_id')
  if (!job_id) return json({ error: 'job_id required' }, 400)

  const service = createServiceClient()

  // Verify job belongs to owner
  const { data: job } = await service
    .from('pos_service_jobs')
    .select('id')
    .eq('id', job_id)
    .eq('owner_id', auth.ownerId)
    .maybeSingle()

  if (!job) return json({ error: 'Job not found' }, 404)

  const { data, error } = await service
    .from('pos_service_job_history')
    .select('*, staff:pos_staff!changed_by(id, name, role)')
    .eq('job_id', job_id)
    .order('created_at', { ascending: true })

  if (error) return json({ error: error.message }, 500)
  return json({ history: data })
}

// POST — add a manual history note
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  const service = createServiceClient()
  const { job_id, notes } = await req.json()

  if (!job_id || !notes?.trim()) {
    return json({ error: 'job_id and notes required' }, 400)
  }

  // Verify job belongs to owner
  const { data: job } = await service
    .from('pos_service_jobs')
    .select('id, status')
    .eq('id', job_id)
    .eq('owner_id', auth.ownerId)
    .maybeSingle()

  if (!job) return json({ error: 'Job not found' }, 404)

  const { data, error } = await service
    .from('pos_service_job_history')
    .insert({
      job_id,
      from_status: job.status,
      to_status: job.status,
      changed_by: auth.staffId || null,
      notes: notes.trim(),
    })
    .select('*, staff:pos_staff!changed_by(id, name, role)')
    .single()

  if (error) return json({ error: error.message }, 500)
  return json({ entry: data }, 201)
}
