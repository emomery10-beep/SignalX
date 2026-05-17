import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'

export const dynamic = 'force-dynamic'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

export async function GET(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const supabase = createServiceClient()
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('currency_symbol, business_type')
    .eq('id', ownerId)
    .single()

  if (error) console.error('Config profile fetch error:', error)

  return NextResponse.json({
    currency_symbol: profile?.currency_symbol || null,
    business_type:   profile?.business_type   || 'retail',
  })
}
