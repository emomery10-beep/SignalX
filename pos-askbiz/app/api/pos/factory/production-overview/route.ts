import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { hasPermission } from '@/lib/pos-permissions'
import { computeGenericStock } from '@/lib/factory-stock'
import { loadCycleUnitCost } from '@/lib/factory-unit-cost'
import { getCostingProfile, isByproductName, isPackagedName, unitNaming } from '@/lib/factory-costing-profiles'
import { getFactoryTypeTemplate } from '@/lib/factory-templates'
import { normalizeCaptureUnits } from '@/lib/factory-units'
import { GET as sesameGet } from '@/lib/factory-sesame-production'

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
        unitNotes: r.unitNotes || { converted: 0, excluded: [] },
      })
    }

    // Every other type: derive everything from this factory's approved captures.
    let q = service.from('pos_factory_captures').select('*').eq('owner_id', auth.ownerId).eq('status', 'approved')
    if (auth.locationId) q = q.eq('location_id', auth.locationId)
    const { data } = await q
    // Every quantity into one unit before anything is added up (g/tonnes/oil litres → kg; counts left out and reported).
    // With the whole account in view each capture is read against its own factory's type.
    let typeByLoc = new Map<string, string | null>()
    if (!auth.locationId) {
      const { data: facs } = await service.from('pos_locations').select('id, factory_type').eq('owner_id', auth.ownerId).eq('kind', 'factory')
      typeByLoc = new Map(((facs || []) as any[]).map(f => [f.id as string, (f.factory_type as string) || null]))
    }
    const units = normalizeCaptureUnits((data || []) as any[], (c: any) => (c.location_id && typeByLoc.has(c.location_id) ? typeByLoc.get(c.location_id) : factoryType))
    const caps = units.captures

    // Everything below is read from the capture TYPE (arrival / feed / output / wastage / packaging / dispatch), not from
    // product names: staff pick names from a dropdown and real accounts mis-file them (a coconut press logging its oil
    // output as "Copra"), so the type is the only reliable signal. Names only decide what counts as a packaged unit.
    const qtyOf = (pred: (c: any) => boolean) => caps.filter(pred).reduce((s, c) => s + n(c.quantity), 0)
    const nm = (c: any) => (c.product_name || '').trim()
    const isByp = (c: any) => isByproductName(P, nm(c))
    const isPack = (c: any) => isPackagedName(P, nm(c)) && !isByp(c)

    const rawArrived = qtyOf(c => c.type === 'intake_arrival')
    const rawUsed = qtyOf(c => c.type === 'intake_feed' || c.type === 'intake')
    // Raw on hand = arrived − fed − sold as-is, over all raw products together (the same rule the CFO figures use), because
    // arrivals and feeds are often filed under different names for the same material ("Coconut copra" in, "Copra" fed).
    const rawNames = new Set(caps.filter(c => ['intake_arrival', 'intake_feed', 'intake'].includes(c.type)).map(c => nm(c).toLowerCase()))
    const rawSoldAsIs = qtyOf(c => c.type === 'dispatch' && rawNames.has(nm(c).toLowerCase()) && !isPack(c))
    const rawRemaining = Math.max(0, rawArrived - rawUsed - rawSoldAsIs)
    const rawRate = cycleCost?.rawCostPerKg || 0
    const feedCost = rawUsed * rawRate
    const rawUnit = 'kg'
    const rawNameList = Array.from(new Set(caps.filter(c => c.type === 'intake_arrival').map(nm).filter(Boolean)))

    // Count-type factories (bakery, soap, blocks…) make finished units directly at "output"; process factories (oil,
    // water) produce a bulk product at "output" and pack it into units at "packaging".
    const countKind = P.kind === 'count'
    const bulkProduced = countKind ? 0 : qtyOf(c => c.type === 'output' && !isByp(c))
    const byproductKg = qtyOf(c => c.type === 'wastage' && (isByp(c) || !countKind))
    const unitsProduced = countKind ? qtyOf(c => c.type === 'output' && !isByp(c)) + qtyOf(c => c.type === 'packaging') : qtyOf(c => c.type === 'packaging' && !isByp(c))
    const rawDispatchNames = rawNames
    const unitsDispatched = qtyOf(c => c.type === 'dispatch' && !isByp(c) && (countKind ? !rawDispatchNames.has(nm(c).toLowerCase()) : isPack(c)))
    const unitsInStock = Math.max(0, unitsProduced - unitsDispatched)
    const yieldPct = bulkProduced > 0 && rawUsed > 0 ? (bulkProduced / rawUsed) * 100 : null
    const outputNames = Array.from(new Set(caps.filter(c => c.type === 'output' && !isByp(c)).map(nm).filter(Boolean)))

    const unitCost = cycleCost?.unitCost || 0
    const byproductCostPerKg = cycleCost?.wasteCostPerKg || 0
    const byproductSold = qtyOf(c => c.type === 'dispatch' && isByp(c))
    const byproductOnHand = Math.max(0, byproductKg - byproductSold)

    const revenue = caps.filter(c => c.type === 'dispatch').reduce((s, c) => {
      const price = n(c.dispatch_price) > 0 ? n(c.dispatch_price) : n(c.sale_price) > 0 ? n(c.sale_price) : 0
      return s + price * n(c.quantity)
    }, 0)
    const byproductSoldCost = Math.round(byproductSold * byproductCostPerKg)
    const cogs = feedCost + unitsDispatched * unitCost + byproductSoldCost
    const rawValue = rawRemaining * rawRate
    const finishedValue = unitsInStock * unitCost
    const byproductValue = byproductOnHand * byproductCostPerKg

    // Product table: the stock ledger per product, exactly as recorded, with a role so it reads sensibly.
    const roleOf = (name: string): Role => {
      const k = name.trim().toLowerCase()
      if (rawNames.has(k)) return 'raw'
      if (isByproductName(P, name) && (!countKind || caps.some(c => nm(c).toLowerCase() === k && c.type === 'wastage'))) return 'byproduct'
      if (isPackagedName(P, name) || countKind) return 'finished'
      return 'bulk'
    }
    const rows = computeGenericStock(caps).map(r => ({ ...r, role: roleOf(r.name) }))

    return json({
      ...base,
      raw: { arrived: round(rawArrived), used: round(rawUsed), remaining: round(rawRemaining), ratePerUnit: rawRate, cost: feedCost, unit: rawUnit, names: rawNameList },
      output: {
        main: round(bulkProduced), mainUnit: 'kg',
        mainLabel: outputNames.length ? `${outputNames.slice(0, 2).join(' / ')} produced` : null,
        byproduct: round(byproductKg), byproductUnit: 'kg', yield: yieldPct,
      },
      units: { produced: round(unitsProduced), dispatched: round(unitsDispatched), inStock: round(unitsInStock), unitCost },
      value: { raw: rawValue, finished: finishedValue, byproduct: byproductValue, total: rawValue + finishedValue + byproductValue },
      money: {
        revenue: canSeePrices ? revenue : 0, cogs, margin: canSeePrices ? revenue - cogs : 0,
        soldUnits: round(unitsDispatched), byproductSoldCost,
      },
      products: (canSeePrices ? rows : rows.map(r => ({ ...r, lastDispatchPrice: 0 })))
        // Captures carry no unit column, so name the unit from the product's role.
        .map(r => ({ ...r, unit: r.unit || (r.role === 'finished' ? unit.plural : 'kg') })),
      unitNotes: { converted: units.converted, excluded: units.excluded },
    })
  } catch (error) {
    console.error('Production overview error:', error)
    return json({ error: 'Server error' }, 500)
  }
}
