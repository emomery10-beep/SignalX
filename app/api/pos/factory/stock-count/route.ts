import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import {
  computeFactoryStock, KIND_NAME, FACTORY_COUNT_REASON,
  JERRYCAN_PRODUCTION_COST, WASTE_COST_PER_KG, type StockKind,
} from '@/lib/factory-stock'

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
    const { data: caps, error: capErr } = await service
      .from('pos_factory_captures')
      .select('type, product_name, quantity, param_label, param_value, created_at')
      .eq('owner_id', auth.ownerId)
      .eq('status', 'approved')
    if (capErr) return json({ error: capErr.message }, 500)

    const { data: counts } = await service
      .from('pos_stock_adjustments')
      .select('product_name, counted_qty, created_at')
      .eq('owner_id', auth.ownerId)
      .eq('reason', FACTORY_COUNT_REASON)

    const stock = computeFactoryStock((caps || []) as any[], Date.now(), (counts || []) as any[])

    let at = new Date().toISOString()
    if (body.before_last_delivery) {
      if (kind !== 'seed' || !stock.lastArrival) return json({ error: 'No delivery to anchor to' }, 400)
      at = new Date(new Date(stock.lastArrival.at).getTime() - 1000).toISOString()
    }

    // system_qty = what the books said at the moment of the count
    const asOf = computeFactoryStock(((caps || []) as any[]).filter(c => new Date(c.created_at).getTime() <= new Date(at).getTime()), new Date(at).getTime(), (counts || []) as any[])
    const systemQty = kind === 'seed' ? asOf.seedKg : kind === 'cans' ? asOf.cans : asOf.wasteKg
    const unitCost = kind === 'seed' ? stock.seedCostPerKg : kind === 'cans' ? JERRYCAN_PRODUCTION_COST : WASTE_COST_PER_KG
    const variance = counted - systemQty

    const { error } = await service.from('pos_stock_adjustments').insert({
      owner_id: auth.ownerId,
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
