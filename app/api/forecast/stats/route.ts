import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { statsFromDataset } from '@/lib/forecast'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { uploadId, targetColumn } = await request.json()
  if (!uploadId || !targetColumn) return NextResponse.json({ error: 'uploadId and targetColumn required' }, { status: 400 })

  const { data: upload } = await supabase
    .from('uploads')
    .select('parsed_sample')
    .eq('id', uploadId)
    .eq('user_id', user.id)
    .single()

  if (!upload?.parsed_sample) return NextResponse.json({ error: 'Dataset not found' }, { status: 404 })

  try {
    const rows = upload.parsed_sample as Record<string, unknown>[]
    const result = statsFromDataset(rows, targetColumn)
    if (!result) return NextResponse.json({ error: 'No numeric data found' }, { status: 422 })
    return NextResponse.json(result)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Stats failed'
    return NextResponse.json({ error: message }, { status: 422 })
  }
}
