import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'
import { CURRENCY_META, COUNTRY_CURRENCY, DEFAULT_CURRENCY } from '@/lib/preview-currency'

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
    .select('currency_symbol, currency, country_code, business_type, business_name')
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

  // Africa-first currency: the vendor's set symbol, else derived from their
  // currency/country, else KSh. Never a silent London-centric £ default.
  const code = (profile?.currency || COUNTRY_CURRENCY[(profile?.country_code || '').toUpperCase()] || DEFAULT_CURRENCY) as string
  const currency_symbol = profile?.currency_symbol || CURRENCY_META[code]?.sym || CURRENCY_META[DEFAULT_CURRENCY].sym

  return NextResponse.json({
    currency_symbol,
    business_type:   profile?.business_type   || 'retail',
    business_name:   profile?.business_name   || null,
    staff_sector:    staffSector,
  })
}
