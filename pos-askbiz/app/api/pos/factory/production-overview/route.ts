import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { hasPermission } from '@/lib/pos-permissions'
import { computeGenericStock } from '@/lib/factory-stock'
import { loadCycleUnitCost } from '@/lib/factory-unit-cost'
import { getCostingProfile, isByproductName, unitNaming } from '@/lib/factory-costing-profiles'
import { getFactoryTypeTemplate } from '@/lib/factory-templates'
import { GET as sesameGet } from '../sesame-production/route'

/**
 * Production overview for ANY factory type.
 *
 * What a factory is (sesame press, coconut press, water bottler, bakery…) comes from the type chosen at
 * registration, falling back to what has actually been logged. Which product is raw material, finished unit
 * or by-product comes from how it was captured (intake / output / packaging / wastage), never from a
 * hard-coded product name — so a coconut factory sees coconut figures and a new type needs no new code.
 *
 * Sesame keeps its audited stock maths (counts, delivery checks) by reusing the sesame endpoint's numbers.
 */

const json = (data: any, status = 200) => NextResponse.json(data, { status })
const n = (v: unknown) => Number(v) || 0
const round = (v: number) => Math.round(v * 100) / 100

type Role = 'raw' | 'bulk' | 'finished' | 'byproduct' | 'other'

export async function GET(req: NextRequest) {
  try {
    const auth = await resolvePosAuth(req)
    if (!auth) return json({ error: 'Unauthorised' }, 401)
    const service = createServiceClient()

    const cycleCost = await loadCycleUnitCost(service, auth.ownerId, auth.locationId)
    // An owner looking at the whole account (no factory picked) with factories of different types has no single
    // "type": show neutral wording and derive everything from the captures instead of the first factory's type.
    let mixed = false
    if (!auth.locationId) {
      const { data: facs } = await service.from('pos_locations').select('factory_type').eq('owner_id', auth.ownerId).eq('kind', 'factory')
      mixed = new Set(((facs || []) as any[]).map(f => f.factory_type).filter((t: string | null) => t && t !== 'other')).size > 1
    }
    const factoryType = mixed ? null : (cycleCost?.factoryType || null)
    const template = getFactoryTypeTemplate(factoryType)
    const P = getCostingProfile(factoryType)
    const canSeePrices = hasPermission(auth.role, 'capture.approve_dispatch')
    const unit = unitNaming(P, P.defaultUnitLitres)
    const recipe = template?.suggestedRecipes?.[0]
    const base = {
      factoryType,
      label: template?.label || 'Production overview',
      icon: template?.icon || '🏭',
      rawLabel: P.rawLabel,
      byproductNoun: P.byproductNoun,
      unitNoun: unit.noun, unitPlural: unit.plural, unitTitle: unit.title,
      yieldMin: recipe?.yield_min_pct ?? null, yieldMax: recipe?.yield_max_pct ?? null,
      pricesHidden: !canSeePrices,
    }

    // Sesame: reuse the audited endpoint so the numbers are identical to what owners already trust.
    if (factoryType === 'sesame_oil') {
      const r: any = await (await sesameGet(req)).json()
      if (r?.error) return json(r, 500)
      return json({
        ...base,
        raw: { arrived: r.totalArrival, used: r.totalFeedUsed, remaining: r.remainingArrival, ratePerUnit: r.costPerKg, cost: r.feedCost, unit: 'kg', names: ['Sesame seed'] },
        output: { main: r.oilProduced, mainUnit: 'L', mainLabel: 'Oil produced', byproduct: r.wastage, byproductUnit: 'kg', yield: r.totalFeedUsed > 0 ? r.yield : null },
        units: { produced: r.jerrycansProduced, dispatched: r.jerrycansDispatched, inStock: r.jerrycansInStock, unitCost: r.jerrycanCost },
        value: { raw: r.rawMaterialsCost, finished: r.finishedGoodsValue, byproduct: r.wasteStockValue, total: r.totalStockValue },
        money: { revenue: r.totalRevenue, cogs: r.costOfGoods, margin: r.grossMargin, soldUnits: (r.jerrycansProduced || 0) - (r.jerrycansInStock || 0), byproductSoldCost: Math.round((r.stock?.wasteDispatched || 0) * (r.wasteCostPerKg || 0)) },
        products: (r.genericStock || []).length ? r.genericStock : [],
      })
    }

    // Every other type: derive everything from this factory's approved captures.
    let q = service.from('pos_factory_captures').select('*').eq('owner_id', auth.ownerId).eq('status', 'approved')
    if (auth.locationId) q = q.eq('location_id', auth.locationId)
    const { data } = await q
    const caps = (data || []) as any[]

    // Classify each product by how it was captured.
    const seen = new Map<string, { in: boolean; out: boolean; pack: boolean; feed: boolean; waste: boolean }>()
    for (const c of caps) {
      const k = (c.product_name || '').trim().toLowerCase()
      if (!k) continue
      const f = seen.get(k) || { in: false, out: false, pack: false, feed: false, waste: false }
      if (c.type === 'intake_arrival' || c.type === 'intake') f.in = true
      if (c.type === 'intake_feed') f.feed = true
      if (c.type === 'output') f.out = true
      if (c.type === 'packaging') f.pack = true
      if (c.type === 'wastage') f.waste = true
      seen.set(k, f)
    }
    const roleOf = (name: string): Role => {
      const f = seen.get(name.trim().toLowerCase())
      if (!f) return 'other'
      // Count-type factories (bakery, soap…) share one broad by-product pattern ("cake", "bran"…) that also names real
      // products — a bakery's cake is what it sells — so there only items logged as wastage are by-products.
      if (isByproductName(P, name) && (P.kind !== 'count' || f.waste)) return 'byproduct'
      if (f.pack) return 'finished'
      if (f.out) return P.kind !== 'count' && P.product?.test(name) && !/jerry|can|bottle|pack|\b\d+\s*l\b/i.test(name) ? 'bulk' : 'finished'
      if (f.in || f.feed) return 'raw'
      return 'finished'
    }

    // The generic stock helper only knows waste/husk/shell as by-products, so e.g. coconut or groundnut cake
    // would read as stock leaving. A by-product arrives when it is produced (output / wastage) and leaves when dispatched.
    const rows = computeGenericStock(caps).map(r => {
      const role = roleOf(r.name)
      if (role !== 'byproduct') return { ...r, role }
      const mine = caps.filter(c => (c.product_name || '').trim().toLowerCase() === r.name.trim().toLowerCase())
      const inQ = mine.filter(c => c.type === 'wastage' || c.type === 'output' || c.type === 'packaging').reduce((s, c) => s + n(c.quantity), 0)
      const outQ = mine.filter(c => c.type === 'dispatch' || c.type === 'intake_feed').reduce((s, c) => s + n(c.quantity), 0)
      return { ...r, role, in: round(inQ), out: round(outQ), onHand: round(Math.max(0, inQ - outQ)) }
    })
    const sumRows = (role: Role, k: 'in' | 'out' | 'onHand') => rows.filter(r => r.role === role).reduce((s, r) => s + r[k], 0)

    const rawArrived = sumRows('raw', 'in')
    const rawUsed = sumRows('raw', 'out')
    const rawRemaining = sumRows('raw', 'onHand')
    const rawRate = cycleCost?.rawCostPerKg || 0
    const feedCost = rawUsed * rawRate

    const bulkProduced = sumRows('bulk', 'in')
    const byproductKg = caps.filter(c => c.type === 'wastage' && isByproductName(P, c.product_name)).reduce((s, c) => s + n(c.quantity), 0)
    const rawUnit = rows.find(r => r.role === 'raw')?.unit || 'kg'
    const bulkUnit = rows.find(r => r.role === 'bulk')?.unit || null
    const unitsComparable = !bulkUnit || bulkUnit === rawUnit || /^kg/i.test(bulkUnit) === /^kg/i.test(rawUnit)
    const yieldPct = bulkProduced > 0 && rawUsed > 0 && unitsComparable ? (bulkProduced / rawUsed) * 100 : null

    const finishedProduced = sumRows('finished', 'in')
    const finishedDispatched = sumRows('finished', 'out')
    const finishedInStock = sumRows('finished', 'onHand')
    const unitCost = cycleCost?.unitCost || 0
    const byproductCostPerKg = cycleCost?.wasteCostPerKg || 0
    const byproductSold = rows.filter(r => r.role === 'byproduct').reduce((s, r) => s + r.out, 0)
    const byproductOnHand = sumRows('byproduct', 'onHand')

    const revenue = caps.filter(c => c.type === 'dispatch').reduce((s, c) => {
      const price = n(c.dispatch_price) > 0 ? n(c.dispatch_price) : n(c.sale_price) > 0 ? n(c.sale_price) : 0
      return s + price * n(c.quantity)
    }, 0)
    const byproductSoldCost = Math.round(byproductSold * byproductCostPerKg)
    const cogs = feedCost + finishedDispatched * unitCost + byproductSoldCost
    const rawValue = rawRemaining * rawRate
    const finishedValue = finishedInStock * unitCost
    const byproductValue = byproductOnHand * byproductCostPerKg

    return json({
      ...base,
      raw: { arrived: round(rawArrived), used: round(rawUsed), remaining: round(rawRemaining), ratePerUnit: rawRate, cost: feedCost, unit: rawUnit, names: rows.filter(r => r.role === 'raw').map(r => r.name) },
      output: {
        main: round(bulkProduced), mainUnit: bulkUnit || rawUnit,
        mainLabel: rows.find(r => r.role === 'bulk') ? `${rows.find(r => r.role === 'bulk')!.name} produced` : null,
        byproduct: round(byproductKg), byproductUnit: 'kg', yield: yieldPct,
      },
      units: { produced: round(finishedProduced), dispatched: round(finishedDispatched), inStock: round(finishedInStock), unitCost },
      value: { raw: rawValue, finished: finishedValue, byproduct: byproductValue, total: rawValue + finishedValue + byproductValue },
      money: {
        revenue: canSeePrices ? revenue : 0, cogs, margin: canSeePrices ? revenue - cogs : 0,
        soldUnits: round(finishedDispatched), byproductSoldCost,
      },
      products: (canSeePrices ? rows : rows.map(r => ({ ...r, lastDispatchPrice: 0 })))
        // Captures carry no unit column, so name the unit from the product's role.
        .map(r => ({ ...r, unit: r.unit || (r.role === 'finished' ? unit.plural : 'kg') })),
    })
  } catch (error) {
    console.error('Production overview error:', error)
    return json({ error: 'Server error' }, 500)
  }
}
