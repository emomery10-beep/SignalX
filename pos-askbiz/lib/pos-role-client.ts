// Client-side role helpers for page-level routing in pos-askbiz.
// Mirrors server-side templateRoleLevel() in pos-auth.ts — keep in sync.

function getSector(role: string): string | null {
  const m = role.match(/^(factory|restaurant|repair|salon|retail|logistics)-/)
  return m ? m[1] : null
}

function templateRoleSuffix(role: string): string | null {
  const m = role.match(/^(factory|restaurant|repair|salon|retail|logistics)-(.+)$/)
  return m ? m[2] : null
}

// ── Level checks ─────────────────────────────────────────────

export function isCashierLevel(role: string): boolean {
  if (!role) return false
  if (role === 'cashier') return true
  const s = templateRoleSuffix(role)
  if (!s) return false
  return !s.includes('manager') && !s.includes('supervisor') && !s.includes('head') &&
    !s.includes('inventory') && !s.includes('inspector') && !s.includes('quality') &&
    !s.includes('technician') && !s.includes('specialist') && !s.includes('intake') &&
    s !== 'handler' && s !== 'driver' && s !== 'dispatcher' && s !== 'branch-manager'
}

export function isInventoryLevel(role: string): boolean {
  if (!role) return false
  if (role === 'inventory') return true
  const s = templateRoleSuffix(role)
  if (!s) return false
  return (s.includes('inventory') || s.includes('inspector') || s.includes('quality')) &&
    !s.includes('manager') && !s.includes('supervisor')
}

export function isManagerOrAboveLevel(role: string): boolean {
  if (!role) return false
  if (['manager', 'supervisor', 'repair', 'engineer'].includes(role)) return true
  const s = templateRoleSuffix(role)
  if (!s) return false
  return s.includes('manager') || s.includes('supervisor') || s.includes('head') ||
    s.includes('technician') || s.includes('specialist') || s.includes('intake') ||
    s === 'operations-manager'
}

export function isLogisticsHandlerLevel(role: string): boolean {
  return role === 'handler' || role === 'driver' ||
    role === 'logistics-handler' || role === 'logistics-driver'
}

export function isLogisticsDispatchLevel(role: string): boolean {
  return role === 'dispatcher' || role === 'logistics-dispatcher'
}

export function isLogisticsBranchLevel(role: string): boolean {
  return role === 'branch_manager' || role === 'logistics-branch-manager'
}

export function isAnyLogisticsRole(role: string): boolean {
  return isLogisticsHandlerLevel(role) || isLogisticsDispatchLevel(role) ||
    isLogisticsBranchLevel(role) || /^logistics-/.test(role)
}

// ── Home route ───────────────────────────────────────────────

/** Returns the correct home route for any role (legacy or template) */
export function getRoleHomeRoute(role: string): string {
  if (!role) return '/sell'

  // Logistics roles → their specific logistics page
  if (isLogisticsBranchLevel(role)) return '/logistics/dashboard'
  if (isLogisticsDispatchLevel(role)) return '/logistics/dispatch'
  if (isLogisticsHandlerLevel(role)) return '/logistics'

  // Sector-specific template roles → their sector hub
  const sector = getSector(role)
  if (sector === 'restaurant') return '/restaurant'
  if (sector === 'factory')    return '/factory'
  if (sector === 'repair')     return '/repair'
  if (sector === 'salon')      return '/salon'

  // Retail and legacy roles → by level
  if (isManagerOrAboveLevel(role)) return '/dashboard'
  if (isInventoryLevel(role))      return '/inventory'

  return '/sell'
}
