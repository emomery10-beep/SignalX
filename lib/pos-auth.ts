// Shared POS authentication helper — #21 extract duplicated resolveOwnerId
import { NextRequest } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

/**
 * Resolves the owner_id for a POS request.
 * Accepts either a Supabase session (owner dashboard) or x-staff-id + x-owner-id headers (PIN staff).
 *
 * @param req              The incoming request
 * @param requiredRole     If provided, PIN-auth staff must have this role (e.g. 'inventory') — fix #10
 */
export async function resolvePosOwner(
  req: NextRequest,
  requiredRole?: string,
): Promise<string | null> {
  // Owner dashboard: authenticated via Supabase session
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) return user.id

  // PIN-auth staff: headers x-staff-id + x-owner-id
  const staffId = req.headers.get('x-staff-id')
  const ownerId = req.headers.get('x-owner-id')
  if (!staffId || !ownerId) return null

  const service = createServiceClient()
  const { data: staff } = await service
    .from('pos_staff')
    .select('id, role')
    .eq('id', staffId)
    .eq('owner_id', ownerId)
    .eq('active', true)
    .maybeSingle()

  if (!staff) return null
  // Role guard — if a specific role is required, reject staff without it
  if (requiredRole && staff.role !== requiredRole) return null

  return ownerId
}
