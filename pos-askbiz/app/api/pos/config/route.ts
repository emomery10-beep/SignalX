import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'
import { currencyFromPhone } from '@/lib/geo'

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
    .select('currency, currency_symbol, business_type, business_name, factory_type')
    .eq('id', ownerId)
    .single()

  if (error) console.error('Config profile fetch error:', error)

  let currencySymbol = profile?.currency_symbol || null

  // Accounts that never finished onboarding (the only place currency is
  // normally written) have no currency_symbol at all — rather than let the
  // client fall back to a hardcoded default that's wrong for most of our
  // users, derive it from their signup phone (same signal onboarding uses)
  // and backfill the profile so this only needs to happen once.
  if (!currencySymbol) {
    const { data: authUser } = await supabase.auth.admin.getUserById(ownerId)
    const signupPhone = authUser?.user?.user_metadata?.phone || authUser?.user?.phone || null
    const derived = currencyFromPhone(signupPhone)
    if (derived) {
      currencySymbol = derived.symbol
      const { error: backfillError } = await supabase
        .from('profiles')
        .update({ currency: derived.currency, currency_symbol: derived.symbol })
        .eq('id', ownerId)
      if (backfillError) console.error('Config currency backfill error:', backfillError)
    }
  }

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
    currency_symbol: currencySymbol,
    business_type:   profile?.business_type || 'retail',
    business_name:   profile?.business_name || null,
    staff_sector:    staffSector,
    // Which of the 12 factory-type templates (lib/factory-templates) this
    // owner picked at onboarding/settings, if any — null for every non-
    // manufacturer business and for manufacturers who picked 'other' or
    // skipped the step. Consumed by the factory Hub + Production log to
    // show type-specific yield ranges instead of a flat 90%/70% threshold.
    factory_type:    profile?.factory_type || null,
  })
}
