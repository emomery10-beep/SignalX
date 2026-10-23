import { NextRequest, NextResponse } from 'next/server'
import { resolvePosAuth } from '@/lib/pos-auth'

export const dynamic = 'force-dynamic'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

// Is this staff/owner session still valid? Lets the client tell "my login is dead" (bad/expired token,
// deactivated staff, changed PIN) apart from an ordinary 401 on a route the role isn't allowed to use.
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ valid: false }, { status: 401 })
  return NextResponse.json({ valid: true, role: auth.role })
}
