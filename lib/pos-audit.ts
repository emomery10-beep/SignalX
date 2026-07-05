// ============================================================
// POS Audit Logger — call logPosAudit() from any API route
// after a meaningful action completes.
// Uses the service client so it always succeeds regardless
// of the caller's auth context.
// ============================================================

import { createServiceClient } from '@/lib/supabase/server'
import type { PosAuthResult } from '@/lib/pos-auth'

export type PosAuditEvent =
  // Service jobs
  | 'job.created'
  | 'job.status_change'
  | 'job.updated'
  | 'job.part_added'
  | 'job.part_removed'
  | 'job.photo_uploaded'
  | 'job.device_scanned'
  // Factory captures
  | 'capture.submitted'
  | 'capture.approved'
  | 'capture.rejected'
  // Transactions
  | 'transaction.refund'
  | 'transaction.amended'
  // Staff
  | 'staff.created'
  | 'staff.updated'
  | 'staff.deactivated'
  | 'staff.pin_changed'
  // Shifts
  | 'shift.opened'
  | 'shift.closed'
  // Inventory
  | 'inventory.restocked'
  | 'inventory.adjusted'
  // Purchase orders
  | 'purchase_order.created'
  | 'purchase_order.sent'
  | 'purchase_order.received'
  | 'purchase_order.cancelled'

export interface PosAuditPayload {
  auth:        PosAuthResult
  event:       PosAuditEvent
  entityType?: string
  entityId?:   string
  fromValue?:  string
  toValue?:    string
  metadata?:   Record<string, unknown>
  staffName?:  string   // pass if already known, avoids extra DB lookup
}

/**
 * Append a record to pos_audit_log.
 * Fire-and-forget — never await this in the hot path if you don't need to.
 */
export async function logPosAudit(payload: PosAuditPayload): Promise<void> {
  try {
    const service = createServiceClient()

    // Resolve staff name if not provided
    let staffName = payload.staffName || null
    if (!staffName && payload.auth.staffId) {
      const { data: staff } = await service
        .from('pos_staff')
        .select('name')
        .eq('id', payload.auth.staffId)
        .maybeSingle()
      staffName = staff?.name || null
    }

    await service.from('pos_audit_log').insert({
      owner_id:    payload.auth.ownerId,
      staff_id:    payload.auth.staffId   || null,
      staff_role:  payload.auth.role      || null,
      staff_name:  staffName,
      event:       payload.event,
      entity_type: payload.entityType     || null,
      entity_id:   payload.entityId       || null,
      from_value:  payload.fromValue      || null,
      to_value:    payload.toValue        || null,
      metadata:    payload.metadata       || {},
    })
  } catch (err) {
    // Never let audit failures break the main request
    console.error('[pos-audit] Failed to log:', err)
  }
}
