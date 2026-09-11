import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth-server'

const json = (data: any, status = 200) => NextResponse.json(data, { status })

export async function GET(req: NextRequest) {
  try {
    const auth = await resolvePosAuth(req)
    if (!auth) return json({ error: 'Unauthorised' }, 401)

    const service = createServiceClient()

    // Fetch all sesame captures (approved only)
    const { data: captures } = await supabase
      .from('pos_factory_captures')
      .select('*')
      .eq('owner_id', profile.owner_id)
      .eq('status', 'approved')
      .in('product_name', ['Sesame seed', 'Sesame oil', 'Sesame waste'])

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

    const output = captures
      .filter(c => c.type === 'output' && c.product_name === 'Sesame oil')
      .reduce((sum, c) => sum + (c.quantity || 0), 0)

    const packaging = captures
      .filter(c => c.type === 'packaging' && c.product_name === 'Sesame oil')
      .reduce((sum, c) => sum + (c.quantity || 0), 0)

    const dispatch = captures
      .filter(c => c.type === 'dispatch' && c.product_name === 'Sesame oil')
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
      } else if (c.type === 'packaging' && c.product_name === 'Sesame oil') {
        batchMap[date].packaging += c.quantity || 0
      } else if (c.type === 'dispatch' && c.product_name === 'Sesame oil') {
        batchMap[date].dispatch += c.quantity || 0
      }
    }

    const batches = Object.entries(batchMap)
      .sort(([d1], [d2]) => d2.localeCompare(d1))
      .map(([date, batch]) => ({
        id: date,
        date,
        intake: batch.intake,
        output: batch.output,
        packaging: batch.packaging,
        dispatch: batch.dispatch,
        status: batch.packaging === (batch.dispatch + (batch.packaging - batch.dispatch)) ? 'balanced' as const : 'incomplete' as const
      }))

    // POS sync status (check if dispatch is synced to inventory)
    const { data: inventory } = await service
      .from('pos_inventory')
      .select('*')
      .eq('owner_id', auth.ownerId)
      .ilike('name', '%sesame%oil%')

    const syncedDispatch = inventory?.reduce((sum, i) => sum + (i.quantity || 0), 0) || 0
    const pendingDispatch = Math.max(0, dispatch - syncedDispatch)

    return NextResponse.json({
      stages: [
        { name: '📥 Intake', quantity: intake, unit: 'kg', captures: captures.filter(c => (c.type === 'intake' || c.type === 'intake_arrival' || c.type === 'intake_feed') && c.product_name === 'Sesame seed').length, lastDate: captures.filter(c => (c.type === 'intake' || c.type === 'intake_arrival' || c.type === 'intake_feed') && c.product_name === 'Sesame seed').sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]?.created_at || new Date().toISOString() },
        { name: '⚙️ Output', quantity: output, unit: 'kg', captures: captures.filter(c => c.type === 'output' && c.product_name === 'Sesame oil').length, lastDate: captures.filter(c => c.type === 'output' && c.product_name === 'Sesame oil').sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]?.created_at || new Date().toISOString() },
        { name: '📦 Packaging', quantity: packaging, unit: 'cans', captures: captures.filter(c => c.type === 'packaging' && c.product_name === 'Sesame oil').length, lastDate: captures.filter(c => c.type === 'packaging' && c.product_name === 'Sesame oil').sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]?.created_at || new Date().toISOString() },
        { name: '🚚 Dispatch', quantity: dispatch, unit: 'cans', captures: captures.filter(c => c.type === 'dispatch' && c.product_name === 'Sesame oil').length, lastDate: captures.filter(c => c.type === 'dispatch' && c.product_name === 'Sesame oil').sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]?.created_at || new Date().toISOString() },
        { name: '📊 Stock', quantity: stock, unit: 'cans', captures: 0, lastDate: new Date().toISOString() }
      ],
      flow: { intake, output, packaging, dispatch, stock, balanced, mismatches },
      batches,
      posSync: { pendingDispatch, syncedDispatch, lastSync: null }
    })
  } catch (error) {
    console.error('Reconciliation error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await resolvePosAuth(req)
    if (!auth) return json({ error: 'Unauthorised' }, 401)

    const service = createServiceClient()
    const body = await req.json()

    if (body.action === 'sync_to_pos') {
      // Get all dispatched sesame oil captures
      const { data: dispatches } = await service
        .from('pos_factory_captures')
        .select('*')
        .eq('owner_id', auth.ownerId)
        .eq('status', 'approved')
        .eq('type', 'dispatch')
        .eq('product_name', 'Sesame oil')

      if (!dispatches) {
        return json({ synced: 0 })
      }

      const totalDispatched = dispatches.reduce((sum, d) => sum + (d.quantity || 0), 0)

      // Update or create inventory entry
      const { data: existing } = await service
        .from('pos_inventory')
        .select('id')
        .eq('owner_id', auth.ownerId)
        .ilike('name', '%sesame oil%')
        .single()

      if (existing) {
        await service
          .from('pos_inventory')
          .update({ quantity: totalDispatched, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
      } else {
        await service
          .from('pos_inventory')
          .insert({
            owner_id: auth.ownerId,
            name: 'Sesame Oil (20L)',
            quantity: totalDispatched,
            unit: 'cans',
            cost: 0
          })
      }

      return json({ synced: totalDispatched, message: 'Synced to POS inventory' })
    }

    return json({ error: 'Unknown action' }, 400)
  } catch (error) {
    console.error('Sync error:', error)
    return json({ error: 'Server error' }, 500)
  }
}
