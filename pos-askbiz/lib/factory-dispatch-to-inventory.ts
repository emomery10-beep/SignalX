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

import { createServiceClient } from './supabase-service'

export interface DispatchSyncResult {
  success: boolean
  inventory_id?: string | null
  error?: string
}

export async function syncDispatchToInventory(
  ownerId: string,
  dispatchId: string,
  productName: string | null,
  quantity: number | null
): Promise<DispatchSyncResult> {
  // Dispatch without product or qty can't sync
  if (!productName?.trim() || !quantity || quantity <= 0) {
    return { success: true, inventory_id: null }
  }

  try {
    const service = createServiceClient()
    const trimmedName = productName.trim()

    // Find existing inventory by product name (case-insensitive)
    // Prefer items tagged sector='factory', but sync to any matching name
    const { data: existing, error: findError } = await service
      .from('inventory')
      .select('id, stock_qty')
      .eq('owner_id', ownerId)
      .ilike('name', trimmedName)
      .or(`sector.eq.factory,sector.is.null`, { foreignTable: 'inventory' })
      .order('sector desc nulls last')
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
          cost_price: 0,
          sale_price: 0,
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
