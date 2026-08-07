// Shared POS authentication helper — #21 extract duplicated resolveOwnerId
import { NextRequest } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getCallerContext } from '@/lib/team-auth'

// All valid POS staff roles in hierarchy order (highest → lowest).
// accountant/auditor are delegated web-session roles (never PIN-authenticate)
// added for resolvePosAuditAccess() below — see the ROLE_LEVEL note.
export type PosRole = 'owner' | 'manager' | 'supervisor' | 'repair' | 'engineer' | 'inventory' | 'cashier' | 'branch_manager' | 'dispatcher' | 'handler' | 'driver' | 'accountant' | 'auditor'

export const POS_ROLES: PosRole[] = ['owner', 'manager', 'supervisor', 'repair', 'engineer', 'inventory', 'cashier', 'branch_manager', 'dispatcher', 'handler', 'driver']

// Role hierarchy: a role can access anything its level or below
// e.g. manager can access supervisor-gated and cashier-gated routes
const ROLE_LEVEL: Record<PosRole, number> = {
  owner:          100,
  manager:        80,
  branch_manager: 75,
  supervisor:     60,
  dispatcher:     55,
  repair:         50,
  engineer:       40,
  inventory:      30,
  handler:        25,
  driver:         25,
  cashier:        20,
  // Delegated web-session roles — never PIN-authenticate, so this level is
  // never actually consulted for them, but Record<PosRole, number> needs
  // every key filled in. 0 = satisfies no operational role requirement.
  accountant:     0,
  auditor:        0,
}

// Map template role prefix to equivalent legacy role level
function templateRoleLevel(role: string): number | null {
  const match = role.match(/^(factory|restaurant|repair|salon|retail|logistics)-(.+)$/)
  if (!match) return null
  const suffix = match[2]
  // Manager-level suffixes
  if (suffix.includes('manager') || suffix.includes('supervisor') || suffix.includes('head') || suffix === 'operations-manager') return ROLE_LEVEL['manager']
  // Inventory-level suffixes
  if (suffix.includes('inventory') || suffix.includes('inspector') || suffix.includes('quality')) return ROLE_LEVEL['inventory']
  // Repair/tech suffixes
  if (suffix.includes('technician') || suffix.includes('specialist') || suffix.includes('intake')) return ROLE_LEVEL['repair']
  // Handler/driver/dispatch suffixes (logistics)
  if (suffix === 'handler' || suffix === 'driver') return ROLE_LEVEL['handler']
  if (suffix === 'dispatcher' || suffix === 'branch-manager') return ROLE_LEVEL['dispatcher']
  // Default: cashier level (server, host, line-cook, receptionist, stylist, floor-staff, etc.)
  return ROLE_LEVEL['cashier']
}

export function roleCanAccess(userRole: string, requiredRole: string): boolean {
  const userLevel   = ROLE_LEVEL[userRole as PosRole] ?? templateRoleLevel(userRole) ?? 0
  const neededLevel = ROLE_LEVEL[requiredRole as PosRole] ?? 0
  return userLevel >= neededLevel
}

export interface PosAuthResult {
  ownerId: string
  locationId: string | null
  staffId: string | null
  role: PosRole | null
  // Set for delegated web-session callers (business partner/admin/accountant/
  // auditor acting on the owner's account) so audit entries attribute
  // correctly instead of showing a blank actor.
  actorLabel?: string
}

/**
 * Resolves the owner_id (and optionally location_id) for a POS request.
 * Accepts either a Supabase session (owner dashboard) or x-staff-id + x-owner-id headers (PIN staff).
 */
export async function resolvePosOwner(
  req: NextRequest,
  requiredRole?: string,
): Promise<string | null> {
  const result = await resolvePosAuth(req, requiredRole)
  return result?.ownerId || null
}

/**
 * Whether this owner's POS is active (paid subscription or live trial).
 * Reads profiles.pos_enabled — the same flag the billing webhooks
 * (Stripe / M-Pesa / PesaPal) and trial logic maintain.
 *
 * Used to gate SELLING actions (recording transactions, charging cards).
 * Setup actions (inventory, locations) intentionally stay open pre-payment
 * so a new vendor can build their stall before paying.
 *
 * Fails closed: if the profile can't be read, selling is blocked.
 */
export async function posEntitled(ownerId: string): Promise<boolean> {
  const service = createServiceClient()
  const { data } = await service
    .from('profiles')
    .select('pos_enabled')
    .eq('id', ownerId)
    .maybeSingle()
  return !!data?.pos_enabled
}

async function resolveDelegateLabel(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  teamRole: string,
): Promise<string> {
  const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', userId).maybeSingle()
  const name = (profile?.full_name as string | undefined) || 'Team member'
  return `${name} (${teamRole.replace('_', ' ')})`
}

export async function resolvePosAuth(
  req: NextRequest,
  requiredRole?: string,
): Promise<PosAuthResult | null> {
  // Owner dashboard: authenticated via Supabase session
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const locationId = req.headers.get('x-location-id') || new URL(req.url).searchParams.get('location_id') || null

    // A logged-in user isn't necessarily the account owner — they may be an
    // *active* team_members row on someone else's account (see
    // lib/team-auth.ts), e.g. a "business partner" invited to run the whole
    // POS on the owner's behalf. Only roles with full POS parity resolve
    // here; narrower delegated roles (accountant/auditor) deliberately do
    // NOT — see resolvePosAuditAccess below — so a missing permission check
    // on some other /api/pos/* route can never accidentally expose them
    // beyond the Audit tab.
    const ctx = await getCallerContext(user.id, supabase)
    if (ctx.isOwner) {
      return { ownerId: user.id, locationId, staffId: null, role: 'owner' }
    }
    if (ctx.role === 'admin' || ctx.role === 'business_partner') {
      const actorLabel = await resolveDelegateLabel(supabase, user.id, ctx.role)
      return { ownerId: ctx.orgId, locationId, staffId: null, role: 'owner', actorLabel }
    }
    return null
  }

  // PIN-auth staff: headers x-staff-id + x-owner-id
  const staffId = req.headers.get('x-staff-id')
  const ownerId = req.headers.get('x-owner-id')
  if (!staffId || !ownerId) return null

  const service = createServiceClient()
  const { data: staff } = await service
    .from('pos_staff')
    .select('id, role, location_id')
    .eq('id', staffId)
    .eq('owner_id', ownerId)
    .eq('active', true)
    .maybeSingle()

  if (!staff) return null
  // Use hierarchy: manager/supervisor can access routes requiring lower roles
  if (requiredRole && !roleCanAccess(staff.role, requiredRole)) return null

  return {
    ownerId,
    locationId: staff.location_id || null,
    staffId,
    role: staff.role as PosRole,
  }
}

/**
 * Narrow, additive companion to resolvePosAuth() — unlocks read access to the
 * Audit Log ONLY for delegated 'accountant' / 'auditor' team members, without
 * widening what they can reach anywhere else in the POS. Every other
 * /api/pos/* route should keep calling resolvePosAuth() directly; only the
 * audit-log route should use this.
 */
export async function resolvePosAuditAccess(req: NextRequest): Promise<PosAuthResult | null> {
  const direct = await resolvePosAuth(req)
  if (direct) return direct   // owner / admin / business_partner / PIN manager+ already covered

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const ctx = await getCallerContext(user.id, supabase)
  if (ctx.isOwner) return null   // already handled above; defensive only
  if (ctx.role !== 'accountant' && ctx.role !== 'auditor') return null

  const actorLabel = await resolveDelegateLabel(supabase, user.id, ctx.role)
  return { ownerId: ctx.orgId, locationId: null, staffId: null, role: ctx.role, actorLabel }
}
