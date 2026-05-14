// Shared POS authentication helper — #21 extract duplicated resolveOwnerId
import { NextRequest } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export interface PosAuthResult {
  ownerId: string
  locationId: string | null
  staffId: string | null
  role: string | null
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
  if (requiredRole && staff.role !== requiredRole) return null

  return {
    ownerId,
    locationId: staff.location_id || null,
    staffId,
    role: staff.role,
  }
}
