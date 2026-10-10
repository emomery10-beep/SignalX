import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import {
  computeFactoryStock, KIND_NAME, FACTORY_COUNT_REASON, type StockKind,
} from '@/lib/factory-stock'
import { loadCycleUnitCost } from '@/lib/factory-unit-cost'

const json = (data: any, status = 200) => NextResponse.json(data, { status })

// Record a physical stock count for a factory product. The count re-anchors
// that product's balance: stock = counted qty + movements captured after it.
// Body: { kind: 'seed'|'cans'|'waste', counted_qty: number, before_last_delivery?: boolean }
// before_last_delivery (seed only) records the count as taken just BEFORE the
// latest delivery — i.e. "the old stock is used up, only the new delivery is left".
export async function POST(req: NextRequest) {
  try {
    const auth = await resolvePosAuth(req, 'manager')
    if (!auth) return json({ error: 'Unauthorised' }, 401)

    const body = await req.json().catch(() => ({}))
    const kind = body.kind as StockKind
    if (!['seed', 'cans', 'waste'].includes(kind)) return json({ error: 'Invalid product' }, 400)
    const counted = Number(body.counted_qty)
    if (!Number.isFinite(counted) || counted < 0 || counted > 10_000_000) return json({ error: 'Enter a valid quantity' }, 400)

    const service = createServiceClient()
    // A count belongs to one factory: owner passes ?location_id=, staff use their own branch.
    const locationId = auth.locationId || null
    let capQuery = service
      .from('pos_factory_captures')
      .select('type, product_name, quantity, param_label, param_value, created_at')
      .eq('owner_id', auth.ownerId)
      .eq('status', 'approved')
    if (locationId) capQuery = capQuery.eq('location_id', locationId)
    const { data: caps, error: capErr } = await capQuery
    if (capErr) return json({ error: capErr.message }, 500)

    let countQuery = service
      .from('pos_stock_adjustments')
      .select('product_name, counted_qty, created_at')
      .eq('owner_id', auth.ownerId)
      .eq('reason', FACTORY_COUNT_REASON)
    if (locationId) countQuery = countQuery.eq('location_id', locationId)
    const { data: counts } = await countQuery

    const stock = computeFactoryStock((caps || []) as any[], Date.now(), (counts || []) as any[])

    let at = new Date().toISOString()
    if (body.before_last_delivery) {
      if (kind !== 'seed' || !stock.lastArrival) return json({ error: 'No delivery to anchor to' }, 400)
      at = new Date(new Date(stock.lastArrival.at).getTime() - 1000).toISOString()
    }

    // system_qty = what the books said at the moment of the count
    const asOf = computeFactoryStock(((caps || []) as any[]).filter(c => new Date(c.created_at).getTime() <= new Date(at).getTime()), new Date(at).getTime(), (counts || []) as any[])
    const systemQty = kind === 'seed' ? asOf.seedKg : kind === 'cans' ? asOf.cans : asOf.wasteKg
    // Cans and waste are valued at this factory's own cost over its cost cycle, not a fixed price.
    const cycleCost = kind === 'seed' ? null : await loadCycleUnitCost(service, auth.ownerId, locationId)
    const unitCost = kind === 'seed' ? stock.seedCostPerKg : kind === 'cans' ? (cycleCost?.unitCost ?? 0) : (cycleCost?.wasteCostPerKg ?? 0)
    const variance = counted - systemQty

    const { error } = await service.from('pos_stock_adjustments').insert({
      owner_id: auth.ownerId,
      location_id: locationId,
      adjusted_by: auth.staffId || null,
      product_name: KIND_NAME[kind],
      system_qty: systemQty,
      counted_qty: counted,
      variance,
      unit_cost: unitCost,
      variance_value: variance * unitCost,
      reason: FACTORY_COUNT_REASON,
      session_ref: body.before_last_delivery ? 'old-stock-used-up' : 'factory-count',
      created_at: at,
    })
    if (error) return json({ error: error.message }, 500)

    return json({ ok: true, system_qty: systemQty, counted_qty: counted, variance })
  } catch (e) {
    console.error('Factory stock count error:', e)
    return json({ error: 'Server error' }, 500)
  }
}
