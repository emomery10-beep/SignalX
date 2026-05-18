import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { runHealthCheckFromUpload, runHealthCheckFromPOSData } from '@/lib/signal-engine'
import type { Signal } from '@/lib/signal-engine'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Try POS data first (live), then fall back to CSV uploads
  let signals: Signal[] = await runPOSSignals(user.id)

  if (signals.length === 0) {
    signals = await runHealthCheckFromUpload(user.id, supabase)
  }

  return NextResponse.json({ signals }, {
    headers: { 'Cache-Control': 'no-store' }
  })
}

async function runPOSSignals(userId: string): Promise<Signal[]> {
  try {
    const service = createServiceClient()

    const now = new Date()
    const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0)
    const sevenDaysAgo = new Date(now); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); sevenDaysAgo.setHours(0, 0, 0, 0)

    const [invRes, recentTxRes, todayTxRes] = await Promise.all([
      service.from('inventory')
        .select('name,stock_qty,low_stock_threshold,sale_price,cost_price')
        .eq('owner_id', userId).eq('active', true)
        .order('stock_qty', { ascending: true }).limit(100),
      service.from('pos_transactions')
        .select('total,status,created_at,pos_items(name,qty,unit_price,cost_price)')
        .eq('owner_id', userId).eq('status', 'completed')
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false }).limit(500),
      service.from('pos_transactions')
        .select('total')
        .eq('owner_id', userId).eq('status', 'completed')
        .gte('created_at', todayStart.toISOString()),
    ])

    const inventory = invRes.data || []
    const recentTx = recentTxRes.data || []
    const todayTx = todayTxRes.data || []

    if (inventory.length === 0 && recentTx.length === 0) return []

    // Flatten line items from last 7 days
    const recentSales: { name: string; qty: number; unit_price: number; cost_price: number }[] = []
    for (const tx of recentTx) {
      for (const item of (tx.pos_items || [])) {
        recentSales.push({
          name: item.name,
          qty: item.qty,
          unit_price: item.unit_price,
          cost_price: item.cost_price || 0,
        })
      }
    }

    // Calculate daily averages (exclude today)
    const pastTx = recentTx.filter((t: any) => new Date(t.created_at) < todayStart)
    const daysWithSales = new Set(pastTx.map((t: any) => t.created_at.slice(0, 10))).size || 1
    const pastRevenue = pastTx.reduce((s: number, t: any) => s + t.total, 0)
    const avgDailyRevenue = pastRevenue / daysWithSales

    const todayRevenue = todayTx.reduce((s: number, t: any) => s + t.total, 0)

    return runHealthCheckFromPOSData({
      inventory,
      recentSales,
      todayRevenue,
      avgDailyRevenue,
    })
  } catch (err) {
    console.error('POS signal check error:', err)
    return []
  }
}
