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
  | 'camera.packaging'      // photograph bulk output packaged into sized containers
  // Approvals (supervisor+)
  | 'capture.approve'       // approve pending camera captures
  | 'hold.clear'            // clear a not-yet-releasable batch hold (curing/regulatory)
  // Reports
  | 'reports.view'          // view shift + production reports
  | 'reports.financial'     // view financial reports (revenue, margins)
  // Purchase orders / supplier orders
  | 'purchase_order.view'   // read purchase orders & suppliers
  | 'purchase_order.create' // create/edit POs & suppliers
  | 'purchase_order.send'   // send a PO to the supplier (WhatsApp)
  | 'purchase_order.receive'// receive stock against a PO
  | 'purchase_order.pay'    // mark a received PO as paid to the supplier
  // Factory: batch traceability (app/factory/batch)
  | 'batch.log'             // log a checkpoint scan against a batch
  | 'batch.view'            // view the batch hub / batch history
  // Factory: quality checks (app/factory/quality)
  | 'quality.check'         // log a quality check (pass or fail)
  | 'quality.view'          // view quality check history
  // Factory: downtime (app/factory/downtime)
  | 'downtime.report'       // report a new downtime event
  | 'downtime.close'        // close/resolve an existing downtime event
  | 'downtime.view'         // view active/historical downtime events
  // Factory: production shifts (app/factory/shift) — distinct from the
  // cash-register shift.open/shift.close above
  | 'shift.production_open'  // start a factory production shift
  | 'shift.production_close' // end a factory production shift
  | 'shift.production_view'  // view the production shift hub / history
  // Factory: waybills (app/factory/waybill)
  | 'waybill.log'           // log a new dispatch/waybill
  | 'waybill.view'          // view the waybill hub / on-time stats
  // Factory: admin-level configuration
  | 'factory.machines_manage' // create/edit the machine registry
  | 'factory.recipes_manage'  // create/edit recipes / expected yields

// Two factory-floor roles have no clean fit among the legacy buckets
// below (see templateToLegacyRole) — line-operator needs all 4 camera
// actions with no approval/financial rights, and quality-inspector
// needs intake+wastage but not the unrelated inventory/PO permissions
// that come bundled with the shared 'inventory' bucket.
type FactoryOnlyRole = 'factory_operator' | 'factory_inspector'

// ── Role → permissions map ───────────────────────────────────
const ROLE_PERMISSIONS: Record<PosRole | FactoryOnlyRole, PosPermission[]> = {
  owner: [
    // Owner has everything
    'sales.create', 'sales.view', 'sales.view_all',
    'refund.approve', 'amend.approve',
    'inventory.view', 'inventory.manage',
    'service.view', 'service.manage', 'service.execute', 'service.parts', 'service.scan_device', 'service.upload_photo',
    'shift.open', 'shift.close', 'shift.view',
    'staff.manage',
    'camera.intake', 'camera.output', 'camera.wastage', 'camera.dispatch', 'camera.packaging',
    'capture.approve', 'hold.clear',
    'reports.view', 'reports.financial',
    'purchase_order.view', 'purchase_order.create', 'purchase_order.send', 'purchase_order.receive', 'purchase_order.pay',
    'batch.log', 'batch.view',
    'quality.check', 'quality.view',
    'downtime.report', 'downtime.close', 'downtime.view',
    'shift.production_open', 'shift.production_close', 'shift.production_view',
    'waybill.log', 'waybill.view',
    'factory.machines_manage', 'factory.recipes_manage',
  ],
  manager: [
    // 'sales.create' was missing here — a manager (incl. template roles like
    // salon-manager) already holds refund.approve/amend.approve, both
    // strictly higher-privilege actions than creating a sale, so excluding
    // sales.create was an oversight, not intentional restriction. Confirmed
    // live bug: it silently 403'd salon-manager attempts to create a client
    // or booking on /salon/bookings (POST /api/pos/salon/clients and
    // /api/pos/salon/appointments both gate on sales.create), and the
    // calling UI didn't surface the error — the form just cleared as if it
    // had succeeded.
    'sales.create',
    'sales.view', 'sales.view_all',
    'refund.approve', 'amend.approve',
    'inventory.view', 'inventory.manage',
    // Same class of gap as sales.create above, found 08-09: manager was
    // missing service.scan_device/service.upload_photo even though the
    // lower-privileged 'repair' role already has both — a manager (or a
    // "tech repair manager" doing intake themselves) hit "you don't have
    // right to upload images" on device-scan/photo-upload during repair
    // intake, from an account that otherwise owns service.manage.
    'service.view', 'service.manage', 'service.parts', 'service.scan_device', 'service.upload_photo',
    'shift.open', 'shift.close', 'shift.view',
    // Same class of gap as sales.create above: managers are the ones the
    // in-app "Add Staff" screens are shown to (e.g. app/factory/staff), but
    // only 'owner' carried staff.manage, so every one of those screens 401'd
    // for any PIN-authenticated manager and only ever worked for the owner's
    // own Supabase-cookie session on the separate owner dashboard.
    'staff.manage',
    'camera.intake', 'camera.output', 'camera.wastage', 'camera.dispatch', 'camera.packaging',
    'capture.approve', 'hold.clear',
    'reports.view', 'reports.financial',
    'purchase_order.view', 'purchase_order.create', 'purchase_order.send', 'purchase_order.receive', 'purchase_order.pay',
    'batch.log', 'batch.view',
    'quality.check', 'quality.view',
    'downtime.report', 'downtime.close', 'downtime.view',
    'shift.production_open', 'shift.production_close', 'shift.production_view',
    'waybill.log', 'waybill.view',
    'factory.machines_manage', 'factory.recipes_manage',
  ],
  supervisor: [
    'sales.view',
    'inventory.view',
    'service.view',
    'shift.view',
    'camera.intake', 'camera.output', 'camera.wastage', 'camera.dispatch', 'camera.packaging',
    'capture.approve', 'hold.clear',
    'reports.view',
    'purchase_order.view',
    'batch.log', 'batch.view',
    'quality.check', 'quality.view',
    'downtime.report', 'downtime.close', 'downtime.view',
    'shift.production_open', 'shift.production_close', 'shift.production_view',
    'waybill.log', 'waybill.view',
  ],
  repair: [
    'sales.view',
    'inventory.view',
    'service.view', 'service.manage', 'service.parts', 'service.scan_device', 'service.upload_photo',
    'shift.view',
  ],
  engineer: [
    // service.upload_photo added alongside the "Mark Ready" photo-capture
    // step (repair/tickets' completed transition) — without it, engineers
    // (the role that actually marks jobs ready) got a silent 403 from
    // upload-photo while every other action on the same screen worked,
    // since job status PATCHes aren't permission-gated the same way.
    'service.view', 'service.execute', 'service.parts', 'service.upload_photo',
  ],
  inventory: [
    'inventory.view', 'inventory.manage',
    'sales.view',
    'camera.intake',
    'purchase_order.view', 'purchase_order.create', 'purchase_order.receive', 'purchase_order.pay',
    'batch.view', 'downtime.view', 'waybill.view',
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
  factory_operator: [
    'camera.intake', 'camera.output', 'camera.wastage', 'camera.dispatch', 'camera.packaging',
    'batch.log', 'batch.view',
    'downtime.report', 'downtime.close', 'downtime.view',
    'shift.production_open', 'shift.production_close', 'shift.production_view',
    'waybill.log', 'waybill.view',
  ],
  factory_inspector: [
    'camera.intake', 'camera.wastage',
    'quality.check', 'quality.view',
    'batch.view', 'downtime.view', 'waybill.view',
  ],
}

// Five factory template roles get exact, dedicated mappings rather than
// falling through the generic keyword cascade below. That cascade sent
// line-operator to 'cashier' (zero camera permissions — the role meant
// to actually stand at the press and log intake/output/wastage/dispatch
// could not submit a single capture), and it collapsed shift-supervisor,
// production-manager, and inventory-manager onto the identical 'manager'
// bucket despite being three distinct jobs. This only affects the five
// exact factory-* strings below — every other sector's roles still run
// through the unchanged cascade beneath it.
const FACTORY_ROLE_MAP: Record<string, PosRole | FactoryOnlyRole> = {
  'factory-line-operator':      'factory_operator',
  'factory-quality-inspector':  'factory_inspector',
  'factory-shift-supervisor':   'supervisor',
  'factory-production-manager': 'manager',
  'factory-inventory-manager':  'inventory',
}

// ── Template role → legacy role mapping ─────────────────────
function templateToLegacyRole(role: string): PosRole | FactoryOnlyRole | null {
  if (role in FACTORY_ROLE_MAP) return FACTORY_ROLE_MAP[role]

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
  const effectiveRole = ROLE_PERMISSIONS[role as PosRole | FactoryOnlyRole] ? (role as PosRole | FactoryOnlyRole) : templateToLegacyRole(role)
  if (!effectiveRole) return false
  return ROLE_PERMISSIONS[effectiveRole]?.includes(permission) ?? false
}

/**
 * Is this the hands-on repair technician persona — the raw legacy 'engineer'
 * role, or any templated role ending in "technician" (currently just
 * repair-technician, but written to cover any future sector's equivalent)?
 * Distinct from hasPermission's templateToLegacyRole mapping, which
 * deliberately collapses repair-technician/repair-intake-specialist/
 * repair-manager all down to the same base 'repair' role for coarse
 * permission checks — too coarse for anything that needs to single out
 * just the technician (e.g. "only see/act on your own assigned jobs",
 * "don't show this persona the price"). Mirrors the inline check
 * app/repair/page.tsx already used for its own dashboard-scoping — added
 * here as the shared, single-source-of-truth version after the same
 * mistake (checking role === 'engineer' alone) got made independently in
 * four other places (service-jobs' GET/PATCH assigned-job scoping, its
 * price redaction, and the photos routes) — confirmed live 08-09.
 */
export function isTechnicianRole(role: string | null | undefined): boolean {
  return role === 'engineer' || (role || '').includes('technician')
}

/**
 * Get all permissions for a role (useful for client-side UI gating).
 * Handles both legacy PosRole values and template roles.
 */
export function getPermissions(role: string | null | undefined): PosPermission[] {
  if (!role) return []
  const effectiveRole = ROLE_PERMISSIONS[role as PosRole | FactoryOnlyRole] ? (role as PosRole | FactoryOnlyRole) : templateToLegacyRole(role)
  if (!effectiveRole) return []
  return ROLE_PERMISSIONS[effectiveRole] || []
}
