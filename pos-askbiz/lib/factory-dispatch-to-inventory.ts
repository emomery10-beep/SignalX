/**
 * Keep the factory rows of the POS `inventory` table equal to the real stock
 * on hand, recomputed from approved captures (see lib/factory-stock.ts — the
 * same calculation every factory screen uses).
 *
 * This used to ADD each dispatched quantity to stock_qty. A dispatch means
 * goods LEFT the factory, so the rows ended up holding cumulative dispatched
 * totals (174 "in stock" cans that were all sold). Now any approved capture
 * that can change stock triggers a full recompute instead of an increment, so
 * the value is always derived and can't drift.
 *
 * Non-fatal: failures don't block the approval; they're logged.
 */

import { createServiceClient } from '@/lib/supabase/server'
import { computeFactoryStock, JERRYCAN_PRODUCTION_COST, WASTE_COST_PER_KG, isCan, isWaste } from '@/lib/factory-stock'

export interface DispatchSyncResult {
  success: boolean
  error?: string
}

// Capture types that move factory stock.
export const STOCK_AFFECTING_TYPES = ['intake', 'intake_arrival', 'intake_feed', 'output', 'packaging', 'wastage', 'dispatch']

const CAN_NAME = 'Sesame oil - Jerrycan Matungi (20L)'
const WASTE_NAME = 'Sesame waste'

export async function syncFactoryStockToInventory(ownerId: string): Promise<DispatchSyncResult> {
  try {
    const service = createServiceClient()

    const { data: caps, error: capErr } = await service
      .from('pos_factory_captures')
      .select('type, product_name, quantity, param_label, param_value, created_at, dispatch_price')
      .eq('owner_id', ownerId)
      .eq('status', 'approved')
    if (capErr) throw capErr

    const captures = (caps || []) as any[]
    const stock = computeFactoryStock(captures)

    // Latest approved dispatch price per product, so sale_price tracks what the
    // approver last charged (unchanged behaviour from the old sync).
    const lastPrice = (pred: (c: any) => boolean): number => {
      const rows = captures
        .filter(c => c.type === 'dispatch' && pred(c) && Number(c.dispatch_price) > 0)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      return rows.length ? Number(rows[0].dispatch_price) : 0
    }

    const targets = [
      { name: CAN_NAME, qty: stock.cans, unit: 'item', cost: JERRYCAN_PRODUCTION_COST, sale: lastPrice(isCan), has: stock.cansProduced + stock.cansDispatched > 0 },
      { name: WASTE_NAME, qty: stock.wasteKg, unit: 'kg', cost: WASTE_COST_PER_KG, sale: lastPrice(isWaste), has: stock.wasteProduced + stock.wasteDispatched > 0 },
    ]

    const { data: rows, error: rowsErr } = await service
      .from('inventory')
      .select('id, name, stock_qty, cost_price, sale_price, source_type')
      .eq('owner_id', ownerId)
      .eq('sector', 'factory')
    if (rowsErr) throw rowsErr

    const canonical = new Set(targets.map(t => t.name.toLowerCase()))

    for (const t of targets) {
      if (!t.has) continue
      const existing = (rows || []).find(r => (r.name || '').toLowerCase() === t.name.toLowerCase())
      if (existing) {
        const { error } = await service.from('inventory').update({
          stock_qty: t.qty,
          unit: t.unit,
          source_type: 'factory_dispatch',
          cost_price: t.cost,
          sale_price: t.sale > 0 ? t.sale : existing.sale_price,
        }).eq('id', existing.id)
        if (error) throw error
      } else {
        // sale_price is NOT NULL on this table.
        const { error } = await service.from('inventory').insert({
          owner_id: ownerId, name: t.name, sector: 'factory', stock_qty: t.qty, unit: t.unit,
          source_type: 'factory_dispatch', cost_price: t.cost, sale_price: t.sale > 0 ? t.sale : 0,
        })
        if (error) throw error
      }
    }

    // Legacy dispatch-derived rows under non-canonical names (old product
    // aliases such as "Mtungi 20 L", customer names typed as a product) were
    // cumulative dispatch totals — they are not stock. Zero them.
    for (const r of rows || []) {
      if (r.source_type === 'factory_dispatch' && !canonical.has((r.name || '').toLowerCase()) && Number(r.stock_qty) !== 0) {
        const { error } = await service.from('inventory').update({ stock_qty: 0 }).eq('id', r.id)
        if (error) throw error
      }
    }

    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : (err && typeof err === 'object' && 'message' in err ? String((err as { message: unknown }).message) : String(err))
    console.error('Factory stock sync failed:', message)
    return { success: false, error: message }
  }
}
