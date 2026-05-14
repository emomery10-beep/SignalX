import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

export const runtime = 'nodejs'

const ADMIN_EMAILS = ['emomery10@gmail.com', 'emomery10@googlemail.com']

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { id, action } = await request.json()
  if (!id || !action) {
    return NextResponse.json({ error: 'id and action required' }, { status: 400 })
  }

  if (!['approve', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'action must be approve or reject' }, { status: 400 })
  }

  // Fetch the content item
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

  // ── APPROVE: write to blog-content.ts if it's a blog post ────────────────
  if (action === 'approve' && item.type === 'blog') {
    try {
      const blogPostData = item.content

      // Validate it has required fields
      if (!blogPostData.slug || !blogPostData.title || !blogPostData.sections) {
        return NextResponse.json({ error: 'Invalid blog post structure' }, { status: 400 })
      }

      // Read current blog-content.ts
      const filePath = join(process.cwd(), 'lib', 'blog-content.ts')
      let fileContent = readFileSync(filePath, 'utf-8')

      // Find the closing of the array
      const arrayCloseIdx = fileContent.lastIndexOf('\n]\n\nexport')

      if (arrayCloseIdx === -1) {
        return NextResponse.json({ error: 'Could not find blog array end' }, { status: 500 })
      }

      // Serialise the new post
      const newPostJson = JSON.stringify(blogPostData, null, 2)

      // Insert before the closing bracket
      fileContent = fileContent.slice(0, arrayCloseIdx) +
        ',\n  ' + newPostJson +
        fileContent.slice(arrayCloseIdx)

      // Write back
      writeFileSync(filePath, fileContent, 'utf-8')

    } catch (writeError) {
      console.error('[agent/approve] write error:', writeError)
      return NextResponse.json({
        error: 'Failed to write to blog-content.ts',
        detail: String(writeError)
      }, { status: 500 })
    }
  }

  // Mark as published in DB
  await supabase.from('agent_content').update({
    status: 'published',
    reviewed_at: new Date().toISOString(),
    reviewed_by: user.email,
  }).eq('id', id)

  // Also mark sibling items from same run as published if approving
  if (item.run_id) {
    await supabase.from('agent_content').update({
      status: 'published',
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.email,
    }).eq('run_id', item.run_id).eq('status', 'pending')
  }

  return NextResponse.json({ success: true, action: 'approved', type: item.type })
}
