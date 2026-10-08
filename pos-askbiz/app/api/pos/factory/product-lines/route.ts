import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { hasPermission } from '@/lib/pos-permissions'

// POST — add a product line to the caller's own factory.
// Only roles that can manage inventory (owner, factory/production/inventory
// managers) may do this; floor staff can only pick from the resulting list
// (enforced in the capture POST). The line is stored as a factory-sector
// inventory row scoped to the caller's location, so it never appears in
// another factory's dropdown.
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  if (!hasPermission(auth.role, 'inventory.manage')) {
    return NextResponse.json({ error: 'Only a manager can add a product line' }, { status: 403 })
  }

  const body = await req.json().catch(() => ({}))
  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 120) : ''
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 })
  const unit = typeof body.unit === 'string' && body.unit.trim() ? body.unit.trim().slice(0, 20) : 'kg'
  const locationId = auth.locationId || (typeof body.location_id === 'string' ? body.location_id : null)

  const service = createServiceClient()
  let existingQ = service.from('inventory').select('id, name, unit').eq('owner_id', auth.ownerId).eq('sector', 'factory').ilike('name', name)
  if (locationId) existingQ = existingQ.eq('location_id', locationId)
  const { data: existing } = await existingQ.limit(1)
  if (existing && existing.length) return NextResponse.json({ product: existing[0], existed: true })

  const { data, error } = await service
    .from('inventory')
    .insert({
      owner_id: auth.ownerId,
      location_id: locationId,
      name,
      cost_price: 0,
      sale_price: 0,
      stock_qty: 0,
      low_stock_threshold: 5,
      unit,
      sector: 'factory',
    })
    .select('id, name, unit')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ product: data })
}
