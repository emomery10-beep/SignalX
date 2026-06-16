// Client-side role helpers for page-level routing in pos-askbiz.
// Mirrors server-side templateRoleLevel() in pos-auth.ts — keep in sync.

function templateRoleSuffix(role: string): string | null {
  const m = role.match(/^(factory|restaurant|repair|salon|retail|logistics)-(.+)$/)
  return m ? m[2] : null
}

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

export function isLogisticsDispatchLevel(role: string): boolean {
  return role === 'dispatcher' || /^logistics-dispatcher$/.test(role)
}

export function isLogisticsBranchLevel(role: string): boolean {
  return role === 'branch_manager' || /^logistics-branch-manager$/.test(role)
}

export function isLogisticsHandlerLevel(role: string): boolean {
  return role === 'handler' || role === 'driver' || /^logistics-(handler|driver)$/.test(role)
}

/** Returns the correct home route for a given role */
export function getRoleHomeRoute(role: string): string {
  if (!role) return '/sell'
  if (isManagerOrAboveLevel(role)) return '/dashboard'
  if (isInventoryLevel(role)) return '/inventory'
  if (isLogisticsBranchLevel(role)) return '/logistics/dashboard'
  if (isLogisticsDispatchLevel(role)) return '/logistics/dispatch'
  if (isLogisticsHandlerLevel(role)) return '/logistics'
  return '/sell'
}
