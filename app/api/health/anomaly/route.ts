import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, seen } = await request.json()

  await supabase.from('anomalies').update({ seen }).eq('id', id).eq('user_id', user.id)

  return NextResponse.json({ success: true })
}
