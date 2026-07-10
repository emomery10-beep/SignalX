import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'

export const dynamic = 'force-dynamic'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

export async function GET(req: NextRequest) {
  const staffId = req.headers.get('x-staff-id')
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const supabase = createServiceClient()
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('currency_symbol, business_type, business_name')
    .eq('id', ownerId)
    .single()

  if (error) console.error('Config profile fetch error:', error)

  // For staff sessions, return their assigned sector so the POS locks to it
  let staffSector: string | null = null
  if (staffId) {
    const { data: staffRow } = await supabase
      .from('pos_staff')
      .select('sector')
      .eq('id', staffId)
      .eq('owner_id', ownerId)
      .single()
    staffSector = staffRow?.sector || null
  }

  return NextResponse.json({
    currency_symbol: profile?.currency_symbol || null,
    business_type:   profile?.business_type   || 'retail',
    business_name:   profile?.business_name   || null,
    staff_sector:    staffSector,
  })
}
