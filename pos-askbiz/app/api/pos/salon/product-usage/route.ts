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

// ─────────────────────────────────────────────────────────────
// GET — list backbar product usage (filter by appointment / client)
// ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)
  if (!hasPermission(auth.role, 'sales.view')) return json({ error: 'Access denied' }, 403)

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const appointment_id = searchParams.get('appointment_id')
  const client_id      = searchParams.get('client_id')

  let query = service
    .from('salon_product_usage')
    .select('*')
    .eq('owner_id', auth.ownerId)
    .order('created_at', { ascending: false })

  if (appointment_id) query = query.eq('appointment_id', appointment_id)
  if (client_id)      query = query.eq('client_id', client_id)

  const { data, error } = await query
  if (error) return json({ error: error.message }, 500)

  return json({ usage: data })
}

// ─────────────────────────────────────────────────────────────
// POST — log backbar product usage
// Body: { appointment_id?, client_id?, inventory_id?, product_name,
//         amount_used, unit?, cost?, service_name? }
// ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)
  if (!hasPermission(auth.role, 'sales.create')) return json({ error: 'Access denied' }, 403)

  const body = await req.json()
  const { appointment_id, client_id, inventory_id, product_name, amount_used, unit, cost, service_name } = body

  if (!product_name || !String(product_name).trim()) return json({ error: 'product_name required' }, 400)

  const service = createServiceClient()
  const { data: usage, error } = await service
    .from('salon_product_usage')
    .insert({
      owner_id:       auth.ownerId,
      appointment_id: appointment_id || null,
      client_id:      client_id      || null,
      inventory_id:   inventory_id   || null,
      product_name:   String(product_name).trim(),
      amount_used:    amount_used ?? 0,
      unit:           unit || 'g',
      cost:           cost ?? 0,
      service_name:   service_name || null,
    })
    .select('*')
    .single()

  if (error) return json({ error: error.message }, 500)

  return json({ usage }, 201)
}
