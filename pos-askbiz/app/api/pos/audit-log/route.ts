import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { hasPermission } from '@/lib/pos-permissions'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

// GET — read audit log (manager/owner only)
// ?staff_id=  &event=  &entity_type=  &entity_id=  &date=YYYY-MM-DD  &page=  &limit=
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  // Only manager and owner can read the full audit log
  if (!hasPermission(auth.role, 'reports.view')) {
    return json({ error: 'Only manager or owner can view the audit log' }, 403)
  }

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)

  const staff_id   = searchParams.get('staff_id')
  const event      = searchParams.get('event')
  const entityType = searchParams.get('entity_type')
  const entityId   = searchParams.get('entity_id')
  const date       = searchParams.get('date')   // YYYY-MM-DD
  const page       = Math.max(0, parseInt(searchParams.get('page')  || '0'))
  const limit      = Math.min(100, parseInt(searchParams.get('limit') || '50'))

  let query = service
    .from('pos_audit_log')
    .select('*', { count: 'exact' })
    .eq('owner_id', auth.ownerId)
    .order('created_at', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)

  if (staff_id)   query = query.eq('staff_id', staff_id)
  if (event)      query = query.eq('event', event)
  if (entityType) query = query.eq('entity_type', entityType)
  if (entityId)   query = query.eq('entity_id', entityId)
  if (date) {
    query = query
      .gte('created_at', `${date}T00:00:00.000Z`)
      .lt('created_at',  `${date}T23:59:59.999Z`)
  }

  const { data, error, count } = await query
  if (error) return json({ error: error.message }, 500)

  return json({ logs: data, total: count })
}
