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

  // Exclude other agents' run_id prefixes so their posts don't bleed into Alice's view
  // Carolyne = blog_ea_*  |  Ben = blog_us_*  |  Victor = blog_mktg_africa_*  |  Maya = blog_mktg_uk_*

  // If requesting counts, return separate count queries for accuracy
  if (searchParams.has('counts')) {
    const [pending, published, rejected] = await Promise.all([
      supabase.from('agent_content').select('id', { count: 'exact', head: true })
        .eq('type', 'blog').eq('status', 'pending')
        .not('run_id', 'like', 'blog_ea_%').not('run_id', 'like', 'blog_us_%').not('run_id', 'like', 'blog_mktg_africa_%').not('run_id', 'like', 'blog_mktg_uk_%'),
      supabase.from('agent_content').select('id', { count: 'exact', head: true })
        .eq('type', 'blog').eq('status', 'published')
        .not('run_id', 'like', 'blog_ea_%').not('run_id', 'like', 'blog_us_%').not('run_id', 'like', 'blog_mktg_africa_%').not('run_id', 'like', 'blog_mktg_uk_%'),
      supabase.from('agent_content').select('id', { count: 'exact', head: true })
        .eq('type', 'blog').eq('status', 'rejected')
        .not('run_id', 'like', 'blog_ea_%').not('run_id', 'like', 'blog_us_%').not('run_id', 'like', 'blog_mktg_africa_%').not('run_id', 'like', 'blog_mktg_uk_%'),
    ])
    return NextResponse.json({
      pending: pending.count || 0,
      published: published.count || 0,
      rejected: rejected.count || 0,
      total: (pending.count || 0) + (published.count || 0) + (rejected.count || 0),
    })
  }

  // Build query fresh each time — don't reuse builder to avoid stale state
  const aliceBase = supabase
    .from('agent_content')
    .select('*')
    .eq('type', 'blog')
    .not('run_id', 'like', 'blog_ea_%')
    .not('run_id', 'like', 'blog_us_%')
    .not('run_id', 'like', 'blog_mktg_africa_%')
    .not('run_id', 'like', 'blog_mktg_uk_%')

  let query
  if (status === 'all') {
    query = aliceBase.order('created_at', { ascending: false }).limit(100)
  } else {
    query = aliceBase.eq('status', status).order('created_at', { ascending: false }).limit(100)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ items: [], error: error.message }, { status: 500 })
  }

  return NextResponse.json({ items: data || [] })
}
