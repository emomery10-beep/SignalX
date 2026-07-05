// ============================================================
// POS Role Permissions Matrix — single source of truth
// All route-level role checks should use hasPermission()
// rather than hardcoded role string comparisons.
// ============================================================

import type { PosRole } from './pos-auth'

// ── All permissions ──────────────────────────────────────────
export type PosPermission =
  // Sales
  | 'sales.create'          // process a sale / checkout
  | 'sales.view'            // read transaction history
  | 'sales.view_all'        // read all staff transactions (not just own)
  // Refunds & amendments
  | 'refund.approve'        // issue a refund
  | 'amend.approve'         // amend a completed transaction
  // Inventory
  | 'inventory.view'        // read stock levels
  | 'inventory.manage'      // add / edit / restock inventory
  // Service jobs (repair sector)
  | 'service.view'          // read service jobs
  | 'service.manage'        // create & update service jobs (repair role)
  | 'service.execute'       // update own assigned jobs (engineer role)
  | 'service.parts'         // add/remove parts on a job
  | 'service.scan_device'   // scan device into a job
  | 'service.upload_photo'  // attach photo to a job
  // Shifts
  | 'shift.open'            // open a shift
  | 'shift.close'           // close a shift
  | 'shift.view'            // view shift summary/reports
  // Staff management
  | 'staff.manage'          // add / edit / deactivate staff (owner only)
  // Factory camera capture
  | 'camera.intake'         // photograph goods intake
  | 'camera.output'         // photograph production output
  | 'camera.wastage'        // photograph defects / wastage
  | 'camera.dispatch'       // photograph outbound dispatch
  // Approvals (supervisor+)
  | 'capture.approve'       // approve pending camera captures
  // Reports
  | 'reports.view'          // view shift + production reports
  | 'reports.financial'     // view financial reports (revenue, margins)
  // Purchase orders / supplier orders
  | 'purchase_order.view'   // read purchase orders & suppliers
  | 'purchase_order.create' // create/edit POs & suppliers
  | 'purchase_order.send'   // send a PO to the supplier (WhatsApp)
  | 'purchase_order.receive'// receive stock against a PO

// ── Role → permissions map ───────────────────────────────────
const ROLE_PERMISSIONS: Record<PosRole, PosPermission[]> = {
  owner: [
    // Owner has everything
    'sales.create', 'sales.view', 'sales.view_all',
    'refund.approve', 'amend.approve',
    'inventory.view', 'inventory.manage',
    'service.view', 'service.manage', 'service.execute', 'service.parts', 'service.scan_device', 'service.upload_photo',
    'shift.open', 'shift.close', 'shift.view',
    'staff.manage',
    'camera.intake', 'camera.output', 'camera.wastage', 'camera.dispatch',
    'capture.approve',
    'reports.view', 'reports.financial',
    'purchase_order.view', 'purchase_order.create', 'purchase_order.send', 'purchase_order.receive',
  ],
  manager: [
    'sales.view', 'sales.view_all',
    'refund.approve', 'amend.approve',
    'inventory.view', 'inventory.manage',
    'service.view', 'service.manage', 'service.parts',
    'shift.open', 'shift.close', 'shift.view',
    'camera.intake', 'camera.output', 'camera.wastage', 'camera.dispatch',
    'capture.approve',
    'reports.view', 'reports.financial',
    'purchase_order.view', 'purchase_order.create', 'purchase_order.send', 'purchase_order.receive',
  ],
  supervisor: [
    'sales.view',
    'inventory.view',
    'service.view',
    'shift.view',
    'camera.intake', 'camera.output', 'camera.wastage', 'camera.dispatch',
    'capture.approve',
    'reports.view',
    'purchase_order.view',
  ],
  repair: [
    'sales.view',
    'inventory.view',
    'service.view', 'service.manage', 'service.parts', 'service.scan_device', 'service.upload_photo',
    'shift.view',
  ],
  engineer: [
    'service.view', 'service.execute', 'service.parts',
  ],
  inventory: [
    'inventory.view', 'inventory.manage',
    'sales.view',
    'camera.intake',
    'purchase_order.view', 'purchase_order.create', 'purchase_order.receive',
  ],
  cashier: [
    'sales.create', 'sales.view',
  ],
  branch_manager: [
    'sales.view', 'sales.view_all',
    'inventory.view',
    'shift.view',
    'capture.approve',
    'reports.view', 'reports.financial',
    'purchase_order.view',
  ],
  dispatcher: [
    'sales.view',
    'inventory.view',
    'reports.view',
  ],
  handler: [
    'sales.create', 'sales.view',
    'inventory.view',
    'camera.intake', 'camera.dispatch',
    'shift.open', 'shift.close',
  ],
  driver: [
    'sales.view',
    'camera.dispatch',
  ],
}

// ── Template role → legacy role mapping ─────────────────────
function templateToLegacyRole(role: string): PosRole | null {
  const match = role.match(/^(factory|restaurant|repair|salon|retail|logistics)-(.+)$/)
  if (!match) return null
  const suffix = match[2]
  if (suffix.includes('manager') || suffix.includes('supervisor') || suffix.includes('head') || suffix === 'operations-manager') return 'manager'
  if (suffix.includes('inventory') || suffix.includes('inspector') || suffix.includes('quality')) return 'inventory'
  if (suffix.includes('technician') || suffix.includes('specialist') || suffix.includes('intake')) return 'repair'
  if (suffix === 'handler' || suffix === 'driver') return 'driver'
  if (suffix === 'dispatcher' || suffix === 'branch-manager') return 'dispatcher'
  return 'cashier'
}

// ── Public helpers ───────────────────────────────────────────

/**
 * Check if a role has a specific permission.
 * Handles both legacy PosRole values and template roles (e.g. retail-inventory-manager).
 */
export function hasPermission(role: string | null | undefined, permission: PosPermission): boolean {
  if (!role) return false
  const effectiveRole = ROLE_PERMISSIONS[role as PosRole] ? (role as PosRole) : templateToLegacyRole(role)
  if (!effectiveRole) return false
  return ROLE_PERMISSIONS[effectiveRole]?.includes(permission) ?? false
}

/**
 * Get all permissions for a role (useful for client-side UI gating).
 * Handles both legacy PosRole values and template roles.
 */
export function getPermissions(role: string | null | undefined): PosPermission[] {
  if (!role) return []
  const effectiveRole = ROLE_PERMISSIONS[role as PosRole] ? (role as PosRole) : templateToLegacyRole(role)
  if (!effectiveRole) return []
  return ROLE_PERMISSIONS[effectiveRole] || []
}
