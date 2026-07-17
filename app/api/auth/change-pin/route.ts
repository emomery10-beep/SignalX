import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { isValidPin } from '@/lib/phone-auth'

// Lets a signed-in user (typically one who just logged in with an
// admin-issued temp PIN — see app/api/admin/route.ts action=reset_pin)
// set a real replacement. Runs as the user's own session for the auth
// check, then uses the service role only to write the new password and
// clear the must_change_pin flag (mirrors the phone-pin login route).
export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const pin = body?.pin
  if (!isValidPin(pin || '')) return NextResponse.json({ error: 'PIN must be 4 digits' }, { status: 400 })

  const admin = createServiceClient()
  const { error: authError } = await admin.auth.admin.updateUserById(user.id, { password: pin })
  if (authError) return NextResponse.json({ error: authError.message }, { status: 400 })

  await admin.from('profiles').update({ must_change_pin: false }).eq('id', user.id)

  return NextResponse.json({ ok: true })
}
