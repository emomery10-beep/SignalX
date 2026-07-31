import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'

// Lightweight "I'm still here" ping the app shell calls every few minutes so the
// admin Users tab can show a real online/offline indicator (see migration
// 20260731000001_profiles_last_active_at.sql). Errors are swallowed — a missed
// heartbeat should never surface to the user or break the app.
export async function POST() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ ok: false }, { status: 401 })

  const { error } = await supabase
    .from('profiles')
    .update({ last_active_at: new Date().toISOString() })
    .eq('id', user.id)

  if (error) console.error('Heartbeat update error:', error)
  return NextResponse.json({ ok: !error })
}
