import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'

const json = (data: any, status = 200) => NextResponse.json(data, { status })

export async function GET(req: NextRequest) {
  try {
    const auth = await resolvePosAuth(req)
    if (!auth) return json({ error: 'Unauthorised' }, 401)

    const service = createServiceClient()

    // Fetch all sesame captures (approved only) - case-insensitive product matching
    const { data: allCaptures } = await service
      .from('pos_factory_captures')
      .select('*')
      .eq('owner_id', auth.ownerId)
      .eq('status', 'approved')

    // Filter captures with case-insensitive product name matching
    const captures = allCaptures?.filter(c => {
      const productLower = (c.product_name || '').toLowerCase()
      return productLower.includes('sesame seed') ||
             productLower.includes('sesame oil') ||
             productLower.includes('sesame waste') ||
             productLower.includes('jerrycan') ||
             productLower.includes('mtungi')
    }) || []

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
        rawMaterialsCost: 0,
        finishedGoodsValue: 0,
        totalStockValue: 0,
      })
    }

    // Calculate metrics
    // Total intake = all intake types combined (arrival + feed) - case-insensitive
    const totalIntake = captures
      .filter(c => (c.type === 'intake' || c.type === 'intake_arrival' || c.type === 'intake_feed') && (c.product_name || '').toLowerCase().includes('sesame seed'))
      .reduce((sum, c) => sum + (c.quantity || 0), 0)

    // For the dashboard: show arrival separately if exists, otherwise total intake
    const intakeArrival = captures
      .filter(c => c.type === 'intake_arrival' && (c.product_name || '').toLowerCase().includes('sesame seed'))
      .reduce((sum, c) => sum + (c.quantity || 0), 0)

    const intakeFeed = captures
      .filter(c => (c.type === 'intake' || c.type === 'intake_feed') && (c.product_name || '').toLowerCase().includes('sesame seed'))
      .reduce((sum, c) => sum + (c.quantity || 0), 0)

    // Remaining = arrival that hasn't been used for pressing yet
    // Only calculate if both are in compatible units (kg)
    const remainingArrival = Math.max(0, intakeArrival - intakeFeed)

    const oilProducedKg = captures
      .filter(c => c.type === 'output' && (c.product_name || '').toLowerCase().includes('sesame oil'))
      .reduce((sum, c) => sum + (c.quantity || 0), 0)

    // Convert oil from kg to liters (1 kg = 1.09 L for sesame oil at density 0.916 kg/L)
    const oilProduced = oilProducedKg * 1.09

    const wastage = captures
      .filter(c => c.type === 'wastage' && (c.product_name || '').toLowerCase().includes('sesame waste'))
      .reduce((sum, c) => sum + (c.quantity || 0), 0)

    const yield_ = intakeFeed > 0 ? (oilProducedKg / intakeFeed) * 100 : 0

    // Calculate actual seed cost from intake_arrival purchases
    // This is the actual cost paid to purchase the sesame seed
    let seedCost = 0
    let costPerKg = 0

    const arrivalCaptures = captures.filter(c => c.type === 'intake_arrival' && (c.product_name || '').toLowerCase().includes('sesame seed'))
    if (arrivalCaptures.length > 0) {
      // Look for intake_price_per_kg from intake_arrival captures
      const purchasePricesPerKg: number[] = []
      for (const capture of arrivalCaptures) {
        if (capture.param_label === 'intake_price_per_kg' && capture.param_value) {
          purchasePricesPerKg.push(capture.param_value)
        }
      }
      // Average purchase price if available, otherwise default to 30 KSh/kg
      costPerKg = purchasePricesPerKg.length > 0 ? purchasePricesPerKg.reduce((a, b) => a + b, 0) / purchasePricesPerKg.length : 30
    }

    // Calculate seed cost based on feed used (quantity fed to pressing × purchase price per kg)
    const feedCost = intakeFeed * costPerKg

    // Get actual packaging captures (20L jerrycans) - case-insensitive, handles variations
    const jerrycansProduced = captures
      .filter(c => c.type === 'packaging' && (c.product_name || '').toLowerCase().includes('jerrycan'))
      .reduce((sum, c) => sum + (c.quantity || 0), 0)

    // Get actual dispatch captures (Sesame oil jerrycans) - includes Mtungi/Jerrycan variations
    const jerrycansDispatched = captures
      .filter(c => c.type === 'dispatch' && ((c.product_name || '').toLowerCase().includes('jerrycan') || (c.product_name || '').toLowerCase().includes('mtungi')))
      .reduce((sum, c) => sum + (c.quantity || 0), 0)

    const jerrycansInStock = jerrycansProduced - jerrycansDispatched

    // Sesame waste cost calculation
    // Only count waste that was SOLD in COGS (not waste in stock)
    const wasteDispatched = captures
      .filter(c => c.type === 'dispatch' && (c.product_name || '').toLowerCase().includes('sesame waste'))
      .reduce((sum, c) => sum + (c.quantity || 0), 0)

    const wasteCostPerKg = 30 // Same as sesame seed cost
    const wasteProductionCost = wastage * wasteCostPerKg
    const wasteSoldCost = wasteDispatched * wasteCostPerKg
    const wasteStockValue = wasteProductionCost - wasteSoldCost // Waste in stock is inventory value, not COGS

    // Revenue from dispatch sales (oil + waste)
    const productRevenue = captures
      .filter(c => c.type === 'dispatch' && c.sale_price && (c.product_name === 'Sesame oil' || c.product_name === 'Sesame waste'))
      .reduce((sum, c) => sum + ((c.sale_price || 0) * (c.quantity || 1)), 0)

    // Jerrycan revenue (8000 KSh per can sold)
    const jerrycanSalePrice = 8000 // KSh per can
    const jerrycanRevenue = jerrycansDispatched * jerrycanSalePrice

    const totalRevenue = productRevenue + jerrycanRevenue

    // Cost of goods SOLD = seed cost + jerrycan SOLD cost + waste SOLD cost (only what was actually sold)
    const jerrycanProductionCost = 6000 // KSh per can
    const jerrycansSold = Math.max(0, jerrycansProduced - jerrycansInStock) // Only count sold/dispatched, not in-stock
    const costOfGoods = feedCost + (jerrycansSold * jerrycanProductionCost) + wasteSoldCost

    const grossMargin = totalRevenue - costOfGoods

    // Inventory valuation
    const rawMaterialsCost = remainingArrival * costPerKg // Sesame seed remaining in stock
    const finishedGoodsValue = jerrycansInStock * jerrycanProductionCost // Jerrycans in stock at production cost
    const totalStockValue = rawMaterialsCost + finishedGoodsValue + wasteStockValue

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
      rawMaterialsCost,
      finishedGoodsValue,
      totalStockValue,
    })
  } catch (error) {
    console.error('Sesame production error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
