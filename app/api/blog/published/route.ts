import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  if (slug) {
    const { data, error } = await supabase
      .from('agent_content')
      .select('content, published_at')
      .eq('type', 'blog')
      .eq('status', 'published')
      .filter('content->>slug', 'eq', slug)
      .single()

    if (error || !data) {
      return NextResponse.json({ post: null })
    }

    return NextResponse.json({
      post: { ...data.content, publishDate: data.published_at?.slice(0, 10) || data.content.publishDate },
    })
  }

  const { data, error } = await supabase
    .from('agent_content')
    .select('content, published_at')
    .eq('type', 'blog')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(200)

  if (error) {
    return NextResponse.json({ posts: [], error: error.message }, { status: 500 })
  }

  const posts = (data || []).map(row => ({
    ...row.content,
    publishDate: row.published_at?.slice(0, 10) || row.content.publishDate,
  }))

  return NextResponse.json(
    { posts },
    { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } }
  )
}
