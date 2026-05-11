import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { runHealthCheckFromUpload } from '@/lib/signal-engine'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const signals = await runHealthCheckFromUpload(user.id, supabase)

  return NextResponse.json({ signals }, {
    headers: { 'Cache-Control': 'no-store' }
  })
}
