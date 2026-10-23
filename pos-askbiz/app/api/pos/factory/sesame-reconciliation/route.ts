import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { hasPermission } from '@/lib/pos-permissions'

const json = (data: any, status = 200) => NextResponse.json(data, { status })

export async function GET(req: NextRequest) {
  try {
    const auth = await resolvePosAuth(req)
    if (!auth) return json({ error: 'Unauthorised' }, 401)
    // Reconciliation shows whole-factory totals: approvers only, not every floor role.
    if (!hasPermission(auth.role, 'capture.approve')) return json({ error: 'Access denied' }, 403)

    const service = createServiceClient()

    // Fetch all sesame captures (approved only)
    const { data: captures } = await service
      .from('pos_factory_captures')
      .select('*')
      .eq('owner_id', auth.ownerId)
      .eq('status', 'approved')
      .in('product_name', ['Sesame seed', 'Sesame oil', 'Sesame waste', 'Sesame oil - Jerrycan Matungi (20L)'])

    if (!captures) {
      return NextResponse.json({
        stages: [],
        flow: { intake: 0, output: 0, packaging: 0, dispatch: 0, stock: 0, balanced: true, mismatches: [] },
        batches: [],
        posSync: { pendingDispatch: 0, syncedDispatch: 0, lastSync: null }
      })
    }

    // Calculate stages
    const intake = captures
      .filter(c => (c.type === 'intake' || c.type === 'intake_arrival' || c.type === 'intake_feed') && c.product_name === 'Sesame seed')
      .reduce((sum, c) => sum + (c.quantity || 0), 0)

    const outputKg = captures
      .filter(c => c.type === 'output' && c.product_name === 'Sesame oil')
      .reduce((sum, c) => sum + (c.quantity || 0), 0)
    // Convert oil from kg to liters (1 kg = 1.09 L for sesame oil at density 0.916 kg/L)
    const output = outputKg * 1.09

    const packaging = captures
      .filter(c => c.type === 'packaging' && c.product_name === 'Sesame oil - Jerrycan Matungi (20L)')
      .reduce((sum, c) => sum + (c.quantity || 0), 0)

    const dispatch = captures
      .filter(c => c.type === 'dispatch' && c.product_name === 'Sesame oil - Jerrycan Matungi (20L)')
      .reduce((sum, c) => sum + (c.quantity || 0), 0)

    const stock = packaging - dispatch

    // Check balance
    const balanced = packaging === (dispatch + stock)
    const mismatches: string[] = []
    if (!balanced) {
      if (packaging < dispatch) mismatches.push(`Dispatch (${dispatch}) exceeds packaging (${packaging})`)
      if (packaging > dispatch + stock) mismatches.push(`Unaccounted jerrycans: ${packaging - dispatch - stock} missing`)
    }

    // Get batches by date
    const batchMap: Record<string, { intake: number; output: number; packaging: number; dispatch: number }> = {}
    for (const c of captures) {
      const date = c.created_at.split('T')[0]
      if (!batchMap[date]) batchMap[date] = { intake: 0, output: 0, packaging: 0, dispatch: 0 }

      if (c.type === 'intake' || c.type === 'intake_arrival' || c.type === 'intake_feed') {
        if (c.product_name === 'Sesame seed') batchMap[date].intake += c.quantity || 0
      } else if (c.type === 'output' && c.product_name === 'Sesame oil') {
        batchMap[date].output += c.quantity || 0
      } else if (c.type === 'packaging' && (c.product_name === 'Sesame oil - Jerrycan Matungi (20L)' || c.product_name === 'Matungi' || c.product_name?.toLowerCase().includes('jareace') || c.product_name?.toLowerCase().includes('jerrycan'))) {
        batchMap[date].packaging += c.quantity || 0
      } else if (c.type === 'dispatch' && (c.product_name === 'Sesame oil - Jerrycan Matungi (20L)' || c.product_name === 'Matungi' || c.product_name?.toLowerCase().includes('jareace') || c.product_name?.toLowerCase().includes('jerrycan'))) {
        batchMap[date].dispatch += c.quantity || 0
      }
    }

    const batches = Object.entries(batchMap)
      .sort(([d1], [d2]) => d2.localeCompare(d1))
      .map(([date, batch]) => ({
        id: date,
        date,
        intake: batch.intake,
        output: batch.output * 1.09, // Convert kg to L
        packaging: batch.packaging,
        dispatch: batch.dispatch,
        status: batch.packaging === (batch.dispatch + (batch.packaging - batch.dispatch)) ? 'balanced' as const : 'incomplete' as const
      }))

    // Stock reaches POS inventory automatically on approval; the old manual-sync status read a table that
    // does not exist, so it always reported dispatches as pending.
    return NextResponse.json({
      stages: [
        { name: '📥 Intake', quantity: intake, unit: 'kg', captures: captures.filter(c => (c.type === 'intake' || c.type === 'intake_arrival' || c.type === 'intake_feed') && c.product_name === 'Sesame seed').length, lastDate: captures.filter(c => (c.type === 'intake' || c.type === 'intake_arrival' || c.type === 'intake_feed') && c.product_name === 'Sesame seed').sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]?.created_at || new Date().toISOString() },
        { name: '⚙️ Output', quantity: output, unit: 'L', captures: captures.filter(c => c.type === 'output' && c.product_name === 'Sesame oil').length, lastDate: captures.filter(c => c.type === 'output' && c.product_name === 'Sesame oil').sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]?.created_at || new Date().toISOString() },
        { name: '📦 Packaging', quantity: packaging, unit: 'cans', captures: captures.filter(c => c.type === 'packaging' && (c.product_name === 'Sesame oil - Jerrycan Matungi (20L)' || c.product_name === 'Matungi' || c.product_name?.toLowerCase().includes('jareace') || c.product_name?.toLowerCase().includes('jerrycan'))).length, lastDate: captures.filter(c => c.type === 'packaging' && (c.product_name === 'Sesame oil - Jerrycan Matungi (20L)' || c.product_name === 'Matungi' || c.product_name?.toLowerCase().includes('jareace') || c.product_name?.toLowerCase().includes('jerrycan'))).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]?.created_at || new Date().toISOString() },
        { name: '🚚 Dispatch', quantity: dispatch, unit: 'cans', captures: captures.filter(c => c.type === 'dispatch' && (c.product_name === 'Sesame oil - Jerrycan Matungi (20L)' || c.product_name === 'Matungi' || c.product_name?.toLowerCase().includes('jareace') || c.product_name?.toLowerCase().includes('jerrycan'))).length, lastDate: captures.filter(c => c.type === 'dispatch' && (c.product_name === 'Sesame oil - Jerrycan Matungi (20L)' || c.product_name === 'Matungi' || c.product_name?.toLowerCase().includes('jareace') || c.product_name?.toLowerCase().includes('jerrycan'))).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]?.created_at || new Date().toISOString() },
        { name: '📊 Stock', quantity: stock, unit: 'cans', captures: 0, lastDate: new Date().toISOString() }
      ],
      flow: { intake, output, packaging, dispatch, stock, balanced, mismatches },
      batches,
      posSync: { pendingDispatch: 0, syncedDispatch: 0, lastSync: null }
    })
  } catch (error) {
    console.error('Reconciliation error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// The old POST wrote totals into a `pos_inventory` table that does not exist, and had no permission check.
// Factory stock is recomputed from approved captures (lib/factory-dispatch-to-inventory) — nothing to sync by hand.
export async function POST() {
  return json({ error: 'Removed: factory stock syncs automatically when captures are approved.' }, 410)
}
