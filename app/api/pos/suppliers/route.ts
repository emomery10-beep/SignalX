import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { hasPermission } from '@/lib/pos-permissions'

// CORS handled globally by next.config.js
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

// GET — list this owner's suppliers (for the Create PO picker)
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  if (!hasPermission(auth.role, 'purchase_order.view')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const includeInactive = searchParams.get('all') === '1'

  let query = service
    .from('pos_suppliers')
    .select('*')
    .eq('owner_id', auth.ownerId)
    .order('name', { ascending: true })

  if (!includeInactive) query = query.eq('active', true)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ suppliers: data })
}

// POST — create a supplier
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  if (!hasPermission(auth.role, 'purchase_order.create')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const service = createServiceClient()
  const body = await req.json()
  const { name, phone, email, lead_time_days, notes } = body

  if (!name?.trim()) return NextResponse.json({ error: 'name required' }, { status: 400 })

  const { data, error } = await service
    .from('pos_suppliers')
    .insert({
      owner_id:       auth.ownerId,
      name:           name.trim(),
      phone:          phone?.trim() || null,
      email:          email?.trim() || null,
      lead_time_days: Number.isFinite(Number(lead_time_days)) ? Math.max(0, parseInt(lead_time_days)) : null,
      notes:          notes?.trim() || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ supplier: data })
}
