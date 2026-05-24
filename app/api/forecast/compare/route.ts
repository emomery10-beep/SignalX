import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { compareMethodsFromDataset } from '@/lib/forecast'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { uploadId, targetColumn, horizonDays = 14 } = await request.json()
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
    const results = compareMethodsFromDataset(rows, targetColumn, horizonDays)
    return NextResponse.json(results)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Comparison failed'
    return NextResponse.json({ error: message }, { status: 422 })
  }
}
