import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'

export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const role = searchParams.get('role')
  const sector = searchParams.get('sector')
  const active = searchParams.get('active') !== 'false'

  let query = service
    .from('pos_staff')
    .select('id, name, role, sector, location_id, active')
    .eq('owner_id', auth.ownerId)
    .order('name')

  if (active) query = query.eq('active', true)
  if (role) query = query.eq('role', role)
  if (sector) query = query.eq('sector', sector)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ staff: data || [] })
}
