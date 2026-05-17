'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export type TeamRole = 'owner' | 'admin' | 'analyst' | 'accountant' | 'buyer' | 'viewer' | null

interface RolePermissions {
  canWrite: boolean
  canInvite: boolean
  canSeeFinancials: boolean
  canSeeInventory: boolean
  canSeeMarketing: boolean
  canAccessAdmin: boolean
  canUseCFOMode: boolean
  isOwner: boolean
}

const PERMISSIONS: Record<string, RolePermissions> = {
  owner:      { canWrite: true,  canInvite: true,  canSeeFinancials: true,  canSeeInventory: true,  canSeeMarketing: true,  canAccessAdmin: true,  canUseCFOMode: true,  isOwner: true  },
  admin:      { canWrite: true,  canInvite: true,  canSeeFinancials: true,  canSeeInventory: true,  canSeeMarketing: true,  canAccessAdmin: false, canUseCFOMode: true,  isOwner: false },
  analyst:    { canWrite: true,  canInvite: false, canSeeFinancials: true,  canSeeInventory: true,  canSeeMarketing: true,  canAccessAdmin: false, canUseCFOMode: false, isOwner: false },
  accountant: { canWrite: false, canInvite: false, canSeeFinancials: true,  canSeeInventory: false, canSeeMarketing: false, canAccessAdmin: false, canUseCFOMode: true,  isOwner: false },
  buyer:      { canWrite: false, canInvite: false, canSeeFinancials: false, canSeeInventory: true,  canSeeMarketing: false, canAccessAdmin: false, canUseCFOMode: false, isOwner: false },
  viewer:     { canWrite: false, canInvite: false, canSeeFinancials: true,  canSeeInventory: true,  canSeeMarketing: true,  canAccessAdmin: false, canUseCFOMode: false, isOwner: false },
}

const DEFAULT_PERMISSIONS = PERMISSIONS.owner  // default to owner (for workspace owners)

export function useTeamRole() {
  const [role, setRole] = useState<TeamRole>(null)
  const [orgId, setOrgId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      // Check if this user is a team member of someone else's org
      const { data: membership } = await supabase
        .from('team_members')
        .select('role, org_id, status')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single()

      if (membership) {
        setRole(membership.role as TeamRole)
        setOrgId(membership.org_id)
      } else {
        // They are an org owner
        setRole('owner')
        setOrgId(user.id)
      }

      setLoading(false)
    }
    load()
  }, [])

  const permissions = role ? (PERMISSIONS[role] || DEFAULT_PERMISSIONS) : DEFAULT_PERMISSIONS

  return {
    role,
    orgId,
    loading,
    ...permissions,
    // Convenience: get the user_id to use for data queries
    // (if team member, use org_id; if owner, use own id)
    dataUserId: orgId,
  }
}

// Helper component for conditional rendering based on role
interface RoleGateProps {
  allow: TeamRole[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function RoleGate({ allow, children, fallback = null }: RoleGateProps) {
  const { role, loading } = useTeamRole()
  if (loading) return null
  if (!role || !allow.includes(role)) return <>{fallback}</>
  return <>{children}</>
}
