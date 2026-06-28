import type { SupabaseClient } from '@supabase/supabase-js'

export type CallerRole = 'owner' | 'admin' | 'analyst' | 'accountant' | 'buyer' | 'viewer'

export interface CallerContext {
  orgId: string
  role: CallerRole
  isOwner: boolean
}

const PERM_MATRIX: Record<string, CallerRole[]> = {
  invite:       ['owner', 'admin'],
  manage_team:  ['owner', 'admin'],
  billing:      ['owner', 'analyst'],
  sources:      ['owner', 'admin'],
  settings:     ['owner', 'admin'],
}

export function can(role: CallerRole, action: keyof typeof PERM_MATRIX): boolean {
  return PERM_MATRIX[action]?.includes(role) ?? false
}

// Resolves the org context for any authenticated user.
// Team members get the owner's orgId so data queries work correctly.
// Solo users (no team records) are treated as owner of their own org.
export async function getCallerContext(
  userId: string,
  supabase: SupabaseClient
): Promise<CallerContext> {
  const { data: membership } = await supabase
    .from('team_members')
    .select('org_id, role')
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle()

  if (membership) {
    return {
      orgId: membership.org_id as string,
      role: membership.role as CallerRole,
      isOwner: false,
    }
  }

  return { orgId: userId, role: 'owner', isOwner: true }
}
