import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') || 'pending'

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  if (searchParams.has('counts')) {
    const [pending, published, rejected] = await Promise.all([
      supabase.from('agent_content').select('id', { count: 'exact', head: true }).eq('type', 'blog_ea').eq('status', 'pending'),
      supabase.from('agent_content').select('id', { count: 'exact', head: true }).eq('type', 'blog_ea').eq('status', 'published'),
      supabase.from('agent_content').select('id', { count: 'exact', head: true }).eq('type', 'blog_ea').eq('status', 'rejected'),
    ])
    return NextResponse.json({
      pending:   pending.count   || 0,
      published: published.count || 0,
      rejected:  rejected.count  || 0,
      total:     (pending.count || 0) + (published.count || 0) + (rejected.count || 0),
    })
  }

  const query = status === 'all'
    ? supabase.from('agent_content').select('*').eq('type', 'blog_ea').order('created_at', { ascending: false }).limit(100)
    : supabase.from('agent_content').select('*').eq('type', 'blog_ea').eq('status', status).order('created_at', { ascending: false }).limit(100)

  const { data, error } = await query

  if (error) return NextResponse.json({ items: [], error: error.message }, { status: 500 })
  return NextResponse.json({ items: data || [] })
}
