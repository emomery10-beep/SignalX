import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'

// GET — list transfers (optionally filtered by location or status)
export async function GET(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const locationId = searchParams.get('location_id')

  let query = service
    .from('pos_stock_transfers')
    .select('*, from_location:pos_locations!from_location_id(name), to_location:pos_locations!to_location_id(name)')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (status) query = query.eq('status', status)
  if (locationId) query = query.or(`from_location_id.eq.${locationId},to_location_id.eq.${locationId}`)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ transfers: data || [] })
}

// POST — initiate a stock transfer between branches
export async function POST(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { from_location_id, to_location_id, inventory_id, qty, notes } = await req.json()

  if (!from_location_id || !to_location_id) return NextResponse.json({ error: 'Both locations required' }, { status: 400 })
  if (from_location_id === to_location_id) return NextResponse.json({ error: 'Cannot transfer to same location' }, { status: 400 })
  if (!inventory_id) return NextResponse.json({ error: 'Product required' }, { status: 400 })
  if (!qty || qty <= 0) return NextResponse.json({ error: 'Quantity must be positive' }, { status: 400 })

  // Verify the source inventory has enough stock
  const { data: sourceItem } = await service
    .from('inventory')
    .select('id, name, stock_qty')
    .eq('id', inventory_id)
    .eq('owner_id', ownerId)
    .eq('location_id', from_location_id)
    .single()

  if (!sourceItem) return NextResponse.json({ error: 'Product not found at source location' }, { status: 404 })
  if (sourceItem.stock_qty < qty) return NextResponse.json({ error: `Only ${sourceItem.stock_qty} units available at source` }, { status: 400 })

  // Deduct from source immediately
  await service
    .from('inventory')
    .update({ stock_qty: sourceItem.stock_qty - qty })
    .eq('id', inventory_id)
    .eq('owner_id', ownerId)

  // Create transfer record
  const { data: transfer, error } = await service
    .from('pos_stock_transfers')
    .insert({
      owner_id: ownerId,
      from_location_id,
      to_location_id,
      inventory_id,
      product_name: sourceItem.name,
      qty,
      status: 'in_transit',
      notes: notes || null,
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ transfer_id: transfer.id, message: `${qty} units of ${sourceItem.name} in transit` }, { status: 201 })
}

// PATCH — receive or cancel a transfer
export async function PATCH(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { transfer_id, action } = await req.json()

  if (!transfer_id) return NextResponse.json({ error: 'Transfer ID required' }, { status: 400 })
  if (!['receive', 'cancel'].includes(action)) return NextResponse.json({ error: 'Action must be receive or cancel' }, { status: 400 })

  const { data: transfer } = await service
    .from('pos_stock_transfers')
    .select('*')
    .eq('id', transfer_id)
    .eq('owner_id', ownerId)
    .eq('status', 'in_transit')
    .single()

  if (!transfer) return NextResponse.json({ error: 'Transfer not found or already processed' }, { status: 404 })

  if (action === 'receive') {
    // Find or create the product at the destination location
    const { data: destItem } = await service
      .from('inventory')
      .select('id, stock_qty')
      .eq('owner_id', ownerId)
      .eq('location_id', transfer.to_location_id)
      .eq('name', transfer.product_name)
      .maybeSingle()

    if (destItem) {
      await service.from('inventory')
        .update({ stock_qty: destItem.stock_qty + transfer.qty })
        .eq('id', destItem.id)
    } else {
      // Copy product details from source inventory item
      const { data: sourceProduct } = await service
        .from('inventory')
        .select('name, sku, cost_price, sale_price, low_stock_threshold, unit, active')
        .eq('id', transfer.inventory_id)
        .single()

      if (sourceProduct) {
        await service.from('inventory').insert({
          owner_id: ownerId,
          location_id: transfer.to_location_id,
          ...sourceProduct,
          stock_qty: transfer.qty,
        })
      }
    }

    await service.from('pos_stock_transfers')
      .update({ status: 'received', completed_at: new Date().toISOString() })
      .eq('id', transfer_id)

    return NextResponse.json({ success: true, message: `${transfer.qty} units received at destination` })
  }

  if (action === 'cancel') {
    // Return stock to source
    const { data: sourceItem } = await service
      .from('inventory')
      .select('id, stock_qty')
      .eq('id', transfer.inventory_id)
      .eq('owner_id', ownerId)
      .single()

    if (sourceItem) {
      await service.from('inventory')
        .update({ stock_qty: sourceItem.stock_qty + transfer.qty })
        .eq('id', sourceItem.id)
    }

    await service.from('pos_stock_transfers')
      .update({ status: 'cancelled', completed_at: new Date().toISOString() })
      .eq('id', transfer_id)

    return NextResponse.json({ success: true, message: 'Transfer cancelled, stock returned to source' })
  }
}
