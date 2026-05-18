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

// GET — list parts used on a job
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  const { searchParams } = new URL(req.url)
  const job_id = searchParams.get('job_id')
  if (!job_id) return json({ error: 'job_id required' }, 400)

  const service = createServiceClient()

  const { data: job } = await service
    .from('pos_service_jobs')
    .select('id')
    .eq('id', job_id)
    .eq('owner_id', auth.ownerId)
    .maybeSingle()

  if (!job) return json({ error: 'Job not found' }, 404)

  const { data, error } = await service
    .from('pos_service_parts')
    .select('*, inventory:inventory!inventory_id(id, name, stock_qty)')
    .eq('job_id', job_id)
    .order('created_at')

  if (error) return json({ error: error.message }, 500)
  return json({ parts: data })
}

// POST — add a part to a job (deducts from inventory via trigger)
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  if (!hasPermission(auth.role, 'service.parts')) {
    return json({ error: 'Only repair/engineer staff, manager, or owner can add parts' }, 403)
  }

  const service = createServiceClient()
  const { job_id, inventory_id, name, qty, unit_cost } = await req.json()

  if (!job_id || !name?.trim()) {
    return json({ error: 'job_id and name required' }, 400)
  }

  // Verify job belongs to owner and is in a workable state
  const { data: job } = await service
    .from('pos_service_jobs')
    .select('id, status, owner_id')
    .eq('id', job_id)
    .eq('owner_id', auth.ownerId)
    .maybeSingle()

  if (!job) return json({ error: 'Job not found' }, 404)
  if (!['accepted', 'in_progress'].includes(job.status)) {
    return json({ error: 'Parts can only be added to accepted or in-progress jobs' }, 400)
  }

  // If inventory_id provided, get cost from inventory
  let partCost = Number(unit_cost) || 0
  if (inventory_id && !unit_cost) {
    const { data: inv } = await service
      .from('inventory')
      .select('cost_price')
      .eq('id', inventory_id)
      .eq('owner_id', auth.ownerId)
      .maybeSingle()
    if (inv) partCost = inv.cost_price || 0
  }

  const partQty = Math.max(1, parseInt(qty) || 1)
  const lineTotal = partCost * partQty

  const { data, error } = await service
    .from('pos_service_parts')
    .insert({
      job_id,
      inventory_id: inventory_id || null,
      name: name.trim(),
      qty: partQty,
      unit_cost: partCost,
      line_total: lineTotal,
    })
    .select('*, inventory:inventory!inventory_id(id, name, stock_qty)')
    .single()

  if (error) return json({ error: error.message }, 500)

  // Log in history
  await service.from('pos_service_job_history').insert({
    job_id,
    from_status: job.status,
    to_status: job.status,
    changed_by: auth.staffId || null,
    notes: `Part added: ${name.trim()} x${partQty}`,
    metadata: { part_id: data.id, inventory_id, qty: partQty },
  })

  logPosAudit({
    auth, event: 'job.part_added', entityType: 'service_job', entityId: job_id,
    metadata: { part_id: data.id, name: name.trim(), qty: partQty, unit_cost: partCost },
  })

  return json({ part: data }, 201)
}
