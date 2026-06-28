import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCallerContext } from '@/lib/team-auth'

export const runtime = 'nodejs'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const ctx = await getCallerContext(user.id, supabase)
  return NextResponse.json(ctx)
}
