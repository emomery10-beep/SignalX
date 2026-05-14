import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { searchParams } = new URL(request.url)
  const bizType = searchParams.get('biz_type')

  let query = supabase.from('templates').select('*').eq('is_active', true)
  if (bizType) query = query.eq('biz_type', bizType)

  const { data, error } = await query.order('name')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data || [])
}
