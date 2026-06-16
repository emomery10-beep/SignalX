// Shared POS authentication helper — #21 extract duplicated resolveOwnerId
import { NextRequest } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

// All valid POS staff roles in hierarchy order (highest → lowest)
export type PosRole = 'owner' | 'manager' | 'supervisor' | 'repair' | 'engineer' | 'inventory' | 'cashier' | 'branch_manager' | 'dispatcher' | 'handler' | 'driver'

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
}

// Map template role prefix to equivalent legacy role level
function templateRoleLevel(role: string): number | null {
  const match = role.match(/^(factory|restaurant|repair|salon|retail|logistics)-(.+)$/)
  if (!match) return null
  const suffix = match[2]
  if (suffix.includes('manager') || suffix.includes('supervisor') || suffix.includes('head') || suffix === 'operations-manager') return ROLE_LEVEL['manager']
  if (suffix.includes('inventory') || suffix.includes('inspector') || suffix.includes('quality')) return ROLE_LEVEL['inventory']
  if (suffix.includes('technician') || suffix.includes('specialist') || suffix.includes('intake')) return ROLE_LEVEL['repair']
  if (suffix === 'handler' || suffix === 'driver') return ROLE_LEVEL['handler']
  if (suffix === 'dispatcher' || suffix === 'branch-manager') return ROLE_LEVEL['dispatcher']
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

export async function resolvePosAuth(
  req: NextRequest,
  requiredRole?: string,
): Promise<PosAuthResult | null> {
  // Owner dashboard: authenticated via Supabase session
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const locationId = req.headers.get('x-location-id') || new URL(req.url).searchParams.get('location_id') || null
    return { ownerId: user.id, locationId, staffId: null, role: 'owner' }
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
