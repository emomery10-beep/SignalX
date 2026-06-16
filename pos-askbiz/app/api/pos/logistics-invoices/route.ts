import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth, roleCanAccess } from '@/lib/pos-auth'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

function toNum(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

const VALID_CATEGORY = ['fuel', 'maintenance', 'toll', 'loading', 'other']

// GET — list logistics invoices for the owner
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const truck_id = searchParams.get('truck_id')
  const limit = Math.min(200, parseInt(searchParams.get('limit') || '100'))

  let query = service
    .from('pos_logistics_invoices')
    .select('*')
    .eq('owner_id', auth.ownerId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (category) query = query.eq('category', category)
  if (truck_id) query = query.eq('truck_id', truck_id)

  const { data, error } = await query
  if (error) return json({ error: error.message }, 500)

  return json({ invoices: data || [] })
}

// POST — create a logistics invoice (handler+ — captured via camera)
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)
  if (!roleCanAccess(auth.role || '', 'handler')) {
    return json({ error: 'Not permitted to record invoices' }, 403)
  }

  const service = createServiceClient()
  const body = await req.json()

  const category = VALID_CATEGORY.includes(body.category) ? body.category : null

  const { data, error } = await service
    .from('pos_logistics_invoices')
    .insert({
      owner_id: auth.ownerId,
      photo_id: body.photo_id || null,
      branch_id: body.branch_id || auth.locationId || null,
      truck_id: body.truck_id || null,
      vendor_name: body.vendor_name || null,
      invoice_number: body.invoice_number || null,
      items: Array.isArray(body.items) ? body.items : [],
      total_amount: toNum(body.total_amount) ?? 0,
      currency: body.currency || 'KES',
      invoice_date: body.invoice_date || null,
      category,
      notes: body.notes || null,
      captured_by: auth.staffId || null,
    })
    .select('*')
    .single()

  if (error) return json({ error: error.message }, 500)

  return json({ invoice: data }, 201)
}
