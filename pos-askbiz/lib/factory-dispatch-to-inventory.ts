/**
 * Sync approved factory dispatch captures to POS inventory.
 *
 * When a dispatch capture is approved, automatically:
 * 1. Find or create a matching inventory item by product name
 * 2. Increment its stock_qty with the dispatched quantity
 * 3. Link the inventory to the dispatch via factory_dispatch_id
 *
 * Non-fatal: sync failures don't block the approval. Logged for debugging.
 */

import { createServiceClient } from '@/lib/supabase/server'

export interface DispatchSyncResult {
  success: boolean
  inventory_id?: string | null
  error?: string
}

export async function syncDispatchToInventory(
  ownerId: string,
  dispatchId: string,
  productName: string | null,
  quantity: number | null,
  costPerUnit: number = 0,
  salePrice: number = 0
): Promise<DispatchSyncResult> {
  // Dispatch without product or qty can't sync
  if (!productName?.trim() || !quantity || quantity <= 0) {
    return { success: true, inventory_id: null }
  }

  try {
    const service = createServiceClient()
    const trimmedName = productName.trim()

    // Find existing inventory by product name (case-insensitive)
    // Prefer items tagged sector='factory', but sync to any matching name.
    // NOTE: this query was broken from the day it was written — `{ foreignTable:
    // 'inventory' }` on .or() only applies to an *embedded* resource, but this
    // query selects from 'inventory' directly (PGRST108: "'inventory' is not an
    // embedded resource"), and .order('sector desc nulls last') passed a raw SQL
    // fragment where postgrest-js expects a bare column name (42703: column
    // "sector desc nulls last" does not exist). Every call errored and was
    // silently swallowed by the catch block below (sync is deliberately
    // non-fatal), so no dispatch has ever actually synced to inventory.
    // Confirmed live 2026-09-22 by reproducing this exact query.
    const { data: existing, error: findError } = await service
      .from('inventory')
      .select('id, stock_qty')
      .eq('owner_id', ownerId)
      .ilike('name', trimmedName)
      .or(`sector.eq.factory,sector.is.null`)
      .order('sector', { ascending: false, nullsFirst: false })
      .limit(1)
      .maybeSingle()

    if (findError) throw findError

    let inventoryId: string | null = null

    if (existing) {
      // Increment existing stock
      const { data: updated, error: updateError } = await service
        .from('inventory')
        .update({
          stock_qty: (existing.stock_qty || 0) + quantity,
          factory_dispatch_id: dispatchId,
          source_type: 'factory_dispatch',
          cost_price: costPerUnit > 0 ? costPerUnit : existing.cost_price,
          sale_price: salePrice > 0 ? salePrice : existing.sale_price,
        })
        .eq('id', existing.id)
        .select('id')
        .single()

      if (updateError) throw updateError
      inventoryId = updated?.id || null
    } else {
      // Create new inventory entry for this factory dispatch
      const { data: created, error: createError } = await service
        .from('inventory')
        .insert({
          owner_id: ownerId,
          name: trimmedName,
          stock_qty: quantity,
          sector: 'factory',
          factory_dispatch_id: dispatchId,
          source_type: 'factory_dispatch',
          cost_price: costPerUnit > 0 ? costPerUnit : null,
          sale_price: salePrice > 0 ? salePrice : null,
        })
        .select('id')
        .single()

      if (createError) throw createError
      inventoryId = created?.id || null
    }

    return { success: true, inventory_id: inventoryId }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Factory dispatch sync failed:', message)
    // Non-fatal — don't let sync failures block the approval
    return { success: false, error: message }
  }
}
