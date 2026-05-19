import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'

export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const branch_id = searchParams.get('branch_id') || auth.locationId
  const category = searchParams.get('category')
  const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200)

  let query = service
    .from('pos_logistics_invoices')
    .select('*, branch:pos_locations!branch_id(id, name), truck:pos_trucks!truck_id(id, plate_number), captured_staff:pos_staff!captured_by(id, name)')
    .eq('owner_id', auth.ownerId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (branch_id) query = query.eq('branch_id', branch_id)
  if (category) query = query.eq('category', category)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ invoices: data || [] })
}

export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const body = await req.json()

  const { data, error } = await service
    .from('pos_logistics_invoices')
    .insert({
      owner_id: auth.ownerId,
      photo_id: body.photo_id || null,
      branch_id: body.branch_id || auth.locationId || null,
      truck_id: body.truck_id || null,
      vendor_name: body.vendor_name || null,
      invoice_number: body.invoice_number || null,
      items: body.items || [],
      total_amount: body.total_amount || 0,
      currency: body.currency || 'KES',
      invoice_date: body.invoice_date || null,
      category: body.category || null,
      notes: body.notes || null,
      captured_by: auth.staffId || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ invoice: data })
}
