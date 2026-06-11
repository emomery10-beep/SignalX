import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

const ADMIN_EMAILS = ['emomery10@gmail.com', 'emomery10@googlemail.com']

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { id, action, content } = await request.json()
  if (!id || !action) {
    return NextResponse.json({ error: 'id and action required' }, { status: 400 })
  }

  if (!['approve', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'action must be approve or reject' }, { status: 400 })
  }

  const { data: item, error: fetchError } = await supabase
    .from('agent_content')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !item) {
    return NextResponse.json({ error: 'Content not found' }, { status: 404 })
  }

  if (item.status !== 'pending') {
    return NextResponse.json({ error: 'Content already reviewed' }, { status: 409 })
  }

  if (action === 'reject') {
    await supabase.from('agent_content').update({
      status: 'rejected',
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.email,
    }).eq('id', id)

    return NextResponse.json({ success: true, action: 'rejected' })
  }

  // Approve — update content if edits were provided, then publish
  const updates: Record<string, unknown> = {
    status: 'published',
    published_at: new Date().toISOString(),
    reviewed_at: new Date().toISOString(),
    reviewed_by: user.email,
  }

  if (content && item.type === 'blog') {
    updates.content = content
  }

  await supabase.from('agent_content').update(updates).eq('id', id)

  return NextResponse.json({ success: true, action: 'approved', type: item.type })
}
