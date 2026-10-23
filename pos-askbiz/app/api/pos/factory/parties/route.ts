import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { hasPermission } from '@/lib/pos-permissions'
import { moneySchemaReady } from '@/lib/factory-parties'

// GET /api/pos/factory/parties?kind=customer|supplier — names (and phones) for the capture form's pick-list.
// Names only: no balances (those are on /payments, which is permission-gated).
export const dynamic = 'force-dynamic'
export async function OPTIONS() { return new NextResponse(null, { status: 204 }) }

export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const kind = new URL(req.url).searchParams.get('kind')
  if (kind !== 'customer' && kind !== 'supplier') return NextResponse.json({ error: 'kind must be customer or supplier' }, { status: 400 })
  const allowed = kind === 'customer'
    ? hasPermission(auth.role, 'camera.dispatch') || hasPermission(auth.role, 'capture.approve_dispatch')
    : hasPermission(auth.role, 'camera.intake') || hasPermission(auth.role, 'capture.approve')
  if (!allowed) return NextResponse.json({ error: 'Access denied' }, { status: 403 })
  const service = createServiceClient()
  if (!(await moneySchemaReady(service))) return NextResponse.json({ parties: [] })
  const { data } = await service.from('pos_factory_parties').select('id, name, phone').eq('owner_id', auth.ownerId).eq('kind', kind).order('name').limit(500)
  return NextResponse.json({ parties: data || [] })
}
