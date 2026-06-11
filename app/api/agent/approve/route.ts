import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

const ADMIN_EMAILS = ['emomery10@gmail.com', 'emomery10@googlemail.com']

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: NextRequest) {
  const db = getServiceClient()

  // Auth: try Authorization header first, then fall back to cookies
  let userEmail: string | null = null
  const authHeader = request.headers.get('authorization')

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    const { data: { user }, error } = await db.auth.getUser(token)
    if (!error && user?.email) userEmail = user.email
  }

  // Fallback: try cookie-based auth
  if (!userEmail) {
    try {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) userEmail = user.email
    } catch {}
  }

  if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { id, action, content } = await request.json()
  if (!id || !action) {
    return NextResponse.json({ error: 'id and action required' }, { status: 400 })
  }

  if (!['approve', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'action must be approve or reject' }, { status: 400 })
  }

  const { data: item, error: fetchError } = await db
    .from('agent_content')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !item) {
    return NextResponse.json({ error: `Content not found: ${fetchError?.message || 'no item'}` }, { status: 404 })
  }

  if (item.status !== 'pending') {
    return NextResponse.json({ error: 'Content already reviewed' }, { status: 409 })
  }

  if (action === 'reject') {
    const { error: updateError } = await db.from('agent_content').update({
      status: 'rejected',
      reviewed_at: new Date().toISOString(),
      reviewed_by: userEmail,
    }).eq('id', id)

    if (updateError) {
      return NextResponse.json({ error: `DB update failed: ${updateError.message}` }, { status: 500 })
    }

    return NextResponse.json({ success: true, action: 'rejected' })
  }

  // Approve — update content if edits were provided, then publish
  const updates: Record<string, unknown> = {
    status: 'published',
    published_at: new Date().toISOString(),
    reviewed_at: new Date().toISOString(),
    reviewed_by: userEmail,
  }

  if (content && item.type === 'blog') {
    updates.content = content
  }

  const { error: updateError } = await db.from('agent_content').update(updates).eq('id', id)

  if (updateError) {
    return NextResponse.json({ error: `DB update failed: ${updateError.message}` }, { status: 500 })
  }

  // Return the slug so the UI can show the blog URL
  const slug = (content?.slug) || item.content?.slug

  return NextResponse.json({ success: true, action: 'approved', type: item.type, slug })
}
