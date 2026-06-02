import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { hasPermission } from '@/lib/pos-permissions'

// CORS handled globally by next.config.js
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

// ─────────────────────────────────────────────────────────────
// GET — list recent stock adjustments (optionally by session)
// ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)
  if (!hasPermission(auth.role, 'inventory.view')) return json({ error: 'Access denied' }, 403)

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const session = searchParams.get('session_ref')
  const limit = Math.min(200, parseInt(searchParams.get('limit') || '100'))

  let query = service
    .from('pos_stock_adjustments')
    .select('*, adjusted_by_staff:pos_staff!adjusted_by(id, name)')
    .eq('owner_id', auth.ownerId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (session) query = query.eq('session_ref', session)

  const { data, error } = await query
  if (error) return json({ error: error.message }, 500)
  return json({ adjustments: data })
}

// ─────────────────────────────────────────────────────────────
// POST — submit a stocktake: set counted quantities, log variance
// Body: { counts: [{ id, counted_qty, reason? }], session_ref? }
// For each item: fetch system stock, compute variance, set stock_qty
// to the counted value, and write a pos_stock_adjustments row.
// ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)
  if (!hasPermission(auth.role, 'inventory.manage')) {
    return json({ error: 'Your role cannot adjust stock' }, 403)
  }

  const body = await req.json()
  const counts = body?.counts
  if (!Array.isArray(counts) || counts.length === 0) {
    return json({ error: 'counts array required' }, 400)
  }

  const service = createServiceClient()
  const sessionRef = body.session_ref || `stk_${Date.now()}`

  const results: Array<{ id: string; product_name: string; system_qty: number; counted_qty: number; variance: number; variance_value: number; ok: boolean; error?: string }> = []
  const adjustmentRows: Record<string, unknown>[] = []

  for (const c of counts) {
    const id = c?.id
    const countedQty = Number(c?.counted_qty)
    if (!id || isNaN(countedQty) || countedQty < 0) {
      results.push({ id: id || '?', product_name: '', system_qty: 0, counted_qty: 0, variance: 0, variance_value: 0, ok: false, error: 'invalid id or counted_qty' })
      continue
    }

    // Fetch current system stock + cost (owner-scoped)
    const { data: item, error: fetchErr } = await service
      .from('inventory')
      .select('id, name, stock_qty, cost_price')
      .eq('id', id)
      .eq('owner_id', auth.ownerId)
      .single()

    if (fetchErr || !item) {
      results.push({ id, product_name: '', system_qty: 0, counted_qty: countedQty, variance: 0, variance_value: 0, ok: false, error: 'product not found' })
      continue
    }

    const systemQty = Number(item.stock_qty) || 0
    const unitCost = Number(item.cost_price) || 0
    const variance = countedQty - systemQty
    const varianceValue = variance * unitCost

    // Set stock to the physically counted value
    const { error: updateErr } = await service
      .from('inventory')
      .update({ stock_qty: countedQty })
      .eq('id', id)
      .eq('owner_id', auth.ownerId)

    if (updateErr) {
      results.push({ id, product_name: item.name, system_qty: systemQty, counted_qty: countedQty, variance, variance_value: varianceValue, ok: false, error: updateErr.message })
      continue
    }

    adjustmentRows.push({
      owner_id:       auth.ownerId,
      location_id:    auth.locationId || null,
      inventory_id:   id,
      adjusted_by:    auth.staffId || null,
      product_name:   item.name,
      system_qty:     systemQty,
      counted_qty:    countedQty,
      variance,
      unit_cost:      unitCost,
      variance_value: varianceValue,
      reason:         c?.reason || null,
      session_ref:    sessionRef,
    })

    results.push({ id, product_name: item.name, system_qty: systemQty, counted_qty: countedQty, variance, variance_value: varianceValue, ok: true })
  }

  // Write the variance trail (best-effort — stock is already updated)
  if (adjustmentRows.length > 0) {
    await service.from('pos_stock_adjustments').insert(adjustmentRows)
  }

  const totalVarianceValue = results.filter(r => r.ok).reduce((s, r) => s + r.variance_value, 0)
  const adjusted = results.filter(r => r.ok).length

  return json({
    session_ref: sessionRef,
    adjusted,
    total: counts.length,
    total_variance_value: totalVarianceValue,
    results,
  })
}
