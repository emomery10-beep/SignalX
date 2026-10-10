import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import {
  computeFactoryStock, computeGenericStock, isWaste, FACTORY_COUNT_REASON,
} from '@/lib/factory-stock'
import { loadCycleUnitCost, stockRoleOf } from '@/lib/factory-unit-cost'

const json = (data: any, status = 200) => NextResponse.json(data, { status })

export async function GET(req: NextRequest) {
  try {
    const auth = await resolvePosAuth(req)
    if (!auth) return json({ error: 'Unauthorised' }, 401)

    const service = createServiceClient()

    // Approved captures only. Stock figures come from lib/factory-stock so this
    // endpoint, the Factory Analytics Inventory tab and the synced `inventory`
    // rows can never disagree.
    // Scoped to the selected factory (owner: ?location_id=, staff: their own
    // branch) so one factory's stock never bleeds into another's. No branch =
    // whole account, as before.
    let capQuery = service
      .from('pos_factory_captures')
      .select('*')
      .eq('owner_id', auth.ownerId)
      .eq('status', 'approved')
    if (auth.locationId) capQuery = capQuery.eq('location_id', auth.locationId)
    const { data: allCaptures } = await capQuery

    const captures = ((allCaptures || []) as any[]).filter((c: any) => {
      const p = (c.product_name || '').toLowerCase()
      // 'jerrycan' alone also matches another crop's cans ("Coconut oil - Jerrycan (20L)"): those are not sesame stock.
      const otherCrop = /coconut|copra|groundnut|peanut|sunflower|palm|shea|soy/.test(p)
      return p.includes('sesame seed') || p.includes('sesame oil') || p.includes('sesame waste') || ((p.includes('jerrycan') || p.includes('mtungi')) && !otherCrop)
    })

    // Physical stock counts re-anchor the balance (see lib/factory-stock.ts).
    let countQuery = service
      .from('pos_stock_adjustments')
      .select('product_name, counted_qty, created_at')
      .eq('owner_id', auth.ownerId)
      .eq('reason', FACTORY_COUNT_REASON)
    if (auth.locationId) countQuery = countQuery.eq('location_id', auth.locationId)
    const { data: counts } = await countQuery

    const stock = computeFactoryStock(captures, Date.now(), (counts || []) as any[])
    const sum = (pred: (c: any) => boolean) => captures.filter(pred).reduce((s: number, c: any) => s + (Number(c.quantity) || 0), 0)

    const intakeArrival = stock.seedArrived
    const intakeFeed = stock.seedFed
    const costPerKg = stock.seedCostPerKg
    const remainingArrival = stock.seedKg

    const oilProducedKg = sum(c => c.type === 'output' && (c.product_name || '').toLowerCase().includes('sesame oil'))
    // 1 kg = 1.09 L for sesame oil (density 0.916 kg/L)
    const oilProduced = oilProducedKg * 1.09
    const wastage = sum(c => c.type === 'wastage' && isWaste(c))
    const yield_ = intakeFeed > 0 ? (oilProducedKg / intakeFeed) * 100 : 0
    const feedCost = intakeFeed * costPerKg

    const jerrycansProduced = stock.cansProduced
    const jerrycansDispatched = stock.cansDispatched
    const jerrycansInStock = stock.cans

    // What a finished unit and a kg of by-product cost comes from this factory's own production over its
    // cost cycle (lib/factory-unit-cost) — never a fixed price. Nothing produced yet = 0, shown as "—".
    const cycleCost = await loadCycleUnitCost(service, auth.ownerId, auth.locationId)
    const JERRYCAN_PRODUCTION_COST = cycleCost?.unitCost ?? 0
    const WASTE_COST_PER_KG = cycleCost?.wasteCostPerKg ?? 0

    // Per-product stock for factories that are not the sesame press (coconut, groundnut, water, …), each product
    // tagged with its role so the Inventory tab can cost it: raw material, finished unit or by-product.
    const genericStock = computeGenericStock(((allCaptures || []) as any[]).filter((c: any) => c.status === 'approved' || c.status == null))
      .map(r => ({ ...r, role: stockRoleOf(cycleCost?.factoryType, r.name) }))

    // Waste sold is COGS; waste still in stock is inventory value
    const wasteSoldCost = stock.wasteDispatched * WASTE_COST_PER_KG
    const wasteStockValue = stock.wasteKg * WASTE_COST_PER_KG

    const productRevenue = captures
      .filter(c => c.type === 'dispatch' && c.sale_price && (c.product_name === 'Sesame oil' || c.product_name === 'Sesame waste'))
      .reduce((s: number, c: any) => s + ((c.sale_price || 0) * (c.quantity || 1)), 0)
    const jerrycanSalePrice = 8000 // KSh per can
    const totalRevenue = productRevenue + jerrycansDispatched * jerrycanSalePrice

    const costOfGoods = feedCost + jerrycansDispatched * JERRYCAN_PRODUCTION_COST + wasteSoldCost
    const grossMargin = totalRevenue - costOfGoods

    const rawMaterialsCost = remainingArrival * costPerKg
    const finishedGoodsValue = jerrycansInStock * JERRYCAN_PRODUCTION_COST
    const totalStockValue = rawMaterialsCost + finishedGoodsValue + wasteStockValue

    return NextResponse.json({
      totalArrival: intakeArrival,
      totalFeedUsed: intakeFeed,
      seedWasted: stock.seedWasted,
      remainingArrival,
      feedCost,
      costPerKg,
      oilProduced,
      wastage,
      yield: yield_,
      jerrycansProduced,
      jerrycansDispatched,
      jerrycansInStock,
      wasteInStock: stock.wasteKg,
      wasteCostPerKg: WASTE_COST_PER_KG,
      jerrycanCost: JERRYCAN_PRODUCTION_COST,
      seedFedLast30: stock.seedFedLast30,
      jerrycansDispatchedLast30: stock.cansDispatchedLast30,
      wasteDispatchedLast30: stock.wasteDispatchedLast30,
      totalRevenue,
      costOfGoods,
      grossMargin,
      rawMaterialsCost,
      finishedGoodsValue,
      wasteStockValue,
      totalStockValue,
      genericStock,
      cycleCost, // unit cost over the factory's cost cycle, with the full breakdown behind it
      stock, // per-product balance breakdown, latest delivery check and recent movements
    })
  } catch (error) {
    console.error('Sesame production error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
