// POST — ensure the signed-in owner has a till login; returns the PIN only
// on the single call that creates it. See lib/pos-owner-pin.ts.
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ensureOwnerPin } from '@/lib/pos-owner-pin'

export const dynamic = 'force-dynamic'

export async function POST() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const pin = await ensureOwnerPin(user.id, user.email)
  return NextResponse.json({ owner_pin: pin })
}
