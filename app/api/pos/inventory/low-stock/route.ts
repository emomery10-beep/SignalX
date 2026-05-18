import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'

/**
 * GET /api/pos/inventory/low-stock
 *
 * Get all low stock items for a POS owner
 * Optional query param: owner_id (for dashboard, otherwise resolved from auth)
 */
export async function GET(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()

  try {
    // Fetch items with low stock
    const { data: items } = await service
      .from('pos_items')
      .select('id, name, qty, cost_price, unit_price, reorder_qty, supplier_name')
      .eq('owner_id', ownerId)
      .lte('qty', 5) // Items with qty <= 5
      .order('qty', { ascending: true })

    // Fetch owner info for context
    const { data: owner } = await service
      .from('auth.users')
      .select('email')
      .eq('id', ownerId)
      .single()

    // Calculate reorder details
    const enrichedItems = (items || []).map((item: any) => ({
      ...item,
      qty_deficit: Math.max(0, (item.reorder_qty || 10) - (item.qty || 0)),
      urgency: (item.qty || 0) === 0 ? 'critical' : (item.qty || 0) <= 2 ? 'high' : 'medium',
    }))

    return NextResponse.json({
      items: enrichedItems,
      total_low_stock_items: enrichedItems.length,
      owner_email: owner?.email,
    })
  } catch (error: any) {
    console.error('Low stock fetch error:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch low stock items' }, { status: 500 })
  }
}
