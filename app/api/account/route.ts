import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Check for existing deletion request
  const { data } = await supabase
    .from('deletion_requests')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .single()

  return NextResponse.json({ deletionRequest: data || null })
}

export async function POST(request: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { action, reason } = await request.json()

  if (action === 'request_deletion') {
    const { data } = await supabase.rpc('request_account_deletion', {
      p_user_id: user.id,
      p_reason: reason || null,
    })
    return NextResponse.json(data)
  }

  if (action === 'cancel_deletion') {
    const { data } = await supabase.rpc('cancel_account_deletion', {
      p_user_id: user.id,
    })
    return NextResponse.json(data)
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
