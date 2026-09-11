import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'

const json = (data: any, status = 200) => NextResponse.json(data, { status })

export async function GET(req: NextRequest) {
  try {
    const auth = await resolvePosAuth(req)
    if (!auth) return json({ error: 'Unauthorised' }, 401)

    const service = createServiceClient()

    // Fetch all sesame captures (approved only)
    const { data: captures } = await service
      .from('pos_factory_captures')
      .select('*')
      .eq('owner_id', auth.ownerId)
      .eq('status', 'approved')
      .in('product_name', ['Sesame seed', 'Sesame oil', 'Sesame waste'])

    if (!captures) {
      return NextResponse.json({
        totalArrival: 0,
        totalFeedUsed: 0,
        remainingArrival: 0,
        feedCost: 0,
        costPerKg: 0,
        oilProduced: 0,
        wastage: 0,
        yield: 0,
        jerrycansProduced: 0,
        jerrycansDispatched: 0,
        jerrycansInStock: 0,
        totalRevenue: 0,
        costOfGoods: 0,
        grossMargin: 0,
      })
    }

    // Calculate metrics
    // Total intake = all intake types combined (arrival + feed)
    const totalIntake = captures
      .filter(c => (c.type === 'intake' || c.type === 'intake_arrival' || c.type === 'intake_feed') && c.product_name === 'Sesame seed')
      .reduce((sum, c) => sum + (c.quantity || 0), 0)

    // For the dashboard: show arrival separately if exists, otherwise total intake
    const intakeArrival = captures
      .filter(c => c.type === 'intake_arrival' && c.product_name === 'Sesame seed')
      .reduce((sum, c) => sum + (c.quantity || 0), 0)

    const intakeFeed = captures
      .filter(c => (c.type === 'intake' || c.type === 'intake_feed') && c.product_name === 'Sesame seed')
      .reduce((sum, c) => sum + (c.quantity || 0), 0)

    // Remaining = arrival that hasn't been used for pressing yet
    // Only calculate if both are in compatible units (kg)
    const remainingArrival = Math.max(0, intakeArrival - intakeFeed)

    const oilProducedKg = captures
      .filter(c => c.type === 'output' && c.product_name === 'Sesame oil')
      .reduce((sum, c) => sum + (c.quantity || 0), 0)

    // Convert oil from kg to liters (1 kg = 1.09 L for sesame oil at density 0.916 kg/L)
    const oilProduced = oilProducedKg * 1.09

    const wastage = captures
      .filter(c => c.type === 'wastage' && c.product_name === 'Sesame waste')
      .reduce((sum, c) => sum + (c.quantity || 0), 0)

    const yield_ = intakeFeed > 0 ? (oilProducedKg / intakeFeed) * 100 : 0

    // Calculate actual feed cost from capture records
    let feedCost = 0
    let costPerKg = 0
    const feedCaptures = captures.filter(c => (c.type === 'intake' || c.type === 'intake_feed') && c.product_name === 'Sesame seed')

    if (feedCaptures.length > 0) {
      // Look for cost per kg in param_label/param_value or use recorded costs
      const costsPerKg: number[] = []
      for (const capture of feedCaptures) {
        if (capture.param_label === 'feed_cost_per_kg' && capture.param_value) {
          costsPerKg.push(capture.param_value)
        }
      }
      // Average cost per kg if available, otherwise default to 30 KSh/kg
      costPerKg = costsPerKg.length > 0 ? costsPerKg.reduce((a, b) => a + b, 0) / costsPerKg.length : 30
      feedCost = intakeFeed * costPerKg
    }

    // Get actual packaging captures (20L jerrycans)
    const jerrycansProduced = captures
      .filter(c => c.type === 'packaging' && c.product_name === 'Sesame oil')
      .reduce((sum, c) => sum + (c.quantity || 0), 0)

    // Get actual dispatch captures (Sesame oil jerrycans)
    const jerrycansDispatched = captures
      .filter(c => c.type === 'dispatch' && c.product_name === 'Sesame oil')
      .reduce((sum, c) => sum + (c.quantity || 0), 0)

    const jerrycansInStock = jerrycansProduced - jerrycansDispatched

    // Sesame waste cost calculation
    // Cost = (waste produced - waste sold) × 30 KSh/kg
    const wasteDispatched = captures
      .filter(c => c.type === 'dispatch' && c.product_name === 'Sesame waste')
      .reduce((sum, c) => sum + (c.quantity || 0), 0)

    const wasteCostPerKg = 30 // Same as sesame seed cost
    const wasteProductionCost = wastage * wasteCostPerKg
    const wasteSoldCost = wasteDispatched * wasteCostPerKg
    const wasteStockCost = wasteProductionCost - wasteSoldCost

    // Revenue from dispatch sales
    const totalRevenue = captures
      .filter(c => c.type === 'dispatch' && c.sale_price)
      .reduce((sum, c) => sum + ((c.sale_price || 0) * (c.quantity || 1)), 0)

    // Cost of goods = seed cost + jerrycan cost (80 KSh per can) + waste stock cost
    const jerrycanCost = 80 // KSh per can
    const costOfGoods = feedCost + (jerrycansProduced * jerrycanCost) + wasteStockCost

    const grossMargin = totalRevenue - costOfGoods

    return NextResponse.json({
      totalArrival: intakeArrival > 0 ? intakeArrival : totalIntake,
      totalFeedUsed: intakeFeed,
      remainingArrival: Math.max(0, intakeArrival - intakeFeed),
      feedCost,
      costPerKg,
      oilProduced,
      wastage,
      yield: yield_,
      jerrycansProduced,
      jerrycansDispatched,
      jerrycansInStock,
      totalRevenue,
      costOfGoods,
      grossMargin,
    })
  } catch (error) {
    console.error('Sesame production error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
