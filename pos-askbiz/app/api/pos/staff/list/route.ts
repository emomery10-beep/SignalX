import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

// GET — list this owner's logistics staff for assignment dropdowns.
// Filterable by ?role= (e.g. driver, handler). pin_hash is always stripped.
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const role = searchParams.get('role')

  const { data, error } = await service
    .from('pos_staff')
    .select('id, name, role, phone, email, active, location_id')
    .eq('owner_id', auth.ownerId)
    .eq('active', true)
    .order('name', { ascending: true })

  if (error) return json({ error: error.message }, 500)

  let staff = data || []

  if (role) {
    // Match exact legacy role OR a template role whose suffix is the requested role
    // e.g. role=driver matches 'driver' and 'logistics-driver'
    staff = staff.filter(s => {
      if (s.role === role) return true
      const m = String(s.role).match(/^[a-z]+-(.+)$/)
      return m ? m[1] === role : false
    })
  }

  return json({ staff })
}
