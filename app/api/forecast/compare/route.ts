import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { compareMethodsFromDataset } from '@/lib/forecast'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: Record<string, unknown>
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }) }
  const uploadId = body.uploadId as string | undefined
  const sourceRows = body.sourceRows as Record<string, unknown>[] | undefined
  const targetColumn = body.targetColumn as string | undefined
  const horizonDays = (body.horizonDays as number | undefined) ?? 14
  if (!targetColumn) return NextResponse.json({ error: 'targetColumn required' }, { status: 400 })

  let rows: Record<string, unknown>[]

  if (sourceRows && Array.isArray(sourceRows)) {
    rows = sourceRows
  } else if (uploadId) {
    const { data: upload } = await supabase
      .from('uploads')
      .select('parsed_sample')
      .eq('id', uploadId)
      .eq('user_id', user.id)
      .single()
    if (!upload?.parsed_sample) return NextResponse.json({ error: 'Dataset not found' }, { status: 404 })
    rows = upload.parsed_sample as Record<string, unknown>[]
  } else {
    return NextResponse.json({ error: 'No data source provided' }, { status: 400 })
  }

  try {
    const results = compareMethodsFromDataset(rows, targetColumn, horizonDays)
    return NextResponse.json(results)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Comparison failed'
    return NextResponse.json({ error: message }, { status: 422 })
  }
}
