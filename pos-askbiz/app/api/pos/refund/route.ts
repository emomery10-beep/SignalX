import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { hasPermission } from '@/lib/pos-permissions'
import { logPosAudit } from '@/lib/pos-audit'

export async function POST(req: NextRequest) {
  // Accept either POS staff auth (manager/owner) or owner session
  let ownerId: string
  let staffId: string | null = null

  const posAuth = await resolvePosAuth(req)
  if (posAuth) {
    if (!hasPermission(posAuth.role, 'refund.approve')) {
      return NextResponse.json({ error: 'Only manager or owner can issue refunds' }, { status: 403 })
    }
    ownerId = posAuth.ownerId
    staffId = posAuth.staffId ?? null
  } else {
    // Fall back to owner web session
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    ownerId = user.id
  }

  const service = createServiceClient()
  const { transaction_id, item_ids, reason, full_refund } = await req.json()
  if (!transaction_id) return NextResponse.json({ error: 'transaction_id required' }, { status: 400 })
  if (!reason)         return NextResponse.json({ error: 'reason required' }, { status: 400 })

  // Verify transaction belongs to this owner
  const { data: tx, error: txErr } = await service
    .from('pos_transactions')
    .select('*, pos_items(*)')
    .eq('id', transaction_id)
    .eq('owner_id', ownerId)
    .single()

  if (txErr || !tx) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
  if (tx.status === 'refunded') return NextResponse.json({ error: 'Already fully refunded' }, { status: 400 })

  const now = new Date().toISOString()

  // Helper: restore stock for refunded items
  const restoreStock = async (items: { inventory_id?: string; qty: number }[]) => {
    for (const item of items) {
      if (!item.inventory_id) continue
      const { error: rpcErr } = await service.rpc('decrement_inventory_stock', {
        p_id: item.inventory_id, p_owner_id: ownerId, p_qty: -(item.qty),
      })
      if (rpcErr) {
        const { data: inv } = await service.from('inventory')
          .select('stock_qty').eq('id', item.inventory_id).eq('owner_id', ownerId).single()
        if (inv) {
          await service.from('inventory')
            .update({ stock_qty: (inv.stock_qty || 0) + item.qty })
            .eq('id', item.inventory_id).eq('owner_id', ownerId)
        }
      }
    }
  }

  if (full_refund || !item_ids?.length) {
    // Full refund — mark all items and transaction
    const allItems = tx.pos_items as { id: string; inventory_id?: string; qty: number }[]
    const itemIds = allItems.map((i) => i.id)
    await service
      .from('pos_items')
      .update({ refunded: true, refunded_at: now, refund_reason: reason })
      .in('id', itemIds)

    await service
      .from('pos_transactions')
      .update({ status: 'refunded' })
      .eq('id', transaction_id)

    // Restore stock for all items
    await restoreStock(allItems)

    // Reverse the unified_data entry
    await service.from('unified_data').insert({
      user_id:       ownerId,
      channel:       'pos',
      gross_revenue: -(tx.total),
      gross_margin:  0,
      record_date:   new Date().toISOString().split('T')[0],
    })
  } else {
    // Partial refund — mark specific items
    await service
      .from('pos_items')
      .update({ refunded: true, refunded_at: now, refund_reason: reason })
      .in('id', item_ids)
      .eq('transaction_id', transaction_id)

    await service
      .from('pos_transactions')
      .update({ status: 'partially_refunded' })
      .eq('id', transaction_id)

    // Restore stock for refunded items only
    const refundedItems = (tx.pos_items as { id: string; inventory_id?: string; qty: number; line_total: number }[])
      .filter((i) => item_ids.includes(i.id))
    await restoreStock(refundedItems)

    const refundAmount = refundedItems.reduce((s, i) => s + i.line_total, 0)

    await service.from('unified_data').insert({
      user_id:       ownerId,
      channel:       'pos',
      gross_revenue: -refundAmount,
      gross_margin:  0,
      record_date:   new Date().toISOString().split('T')[0],
    })
  }

  // Legacy audit_log entry
  await service.from('audit_log').insert({
    user_id:  ownerId,
    event:    'pos_refund',
    metadata: { transaction_id, full_refund: full_refund || false, item_ids, reason, approved_by_staff: staffId },
  })

  // POS audit log
  if (posAuth) {
    logPosAudit({
      auth: posAuth, event: 'transaction.refund', entityType: 'transaction', entityId: transaction_id,
      metadata: { full_refund: full_refund || false, reason, item_count: item_ids?.length || 'all' },
    })
  }

  return NextResponse.json({ success: true })
}
