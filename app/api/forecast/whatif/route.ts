import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { whatIfFromDataset } from '@/lib/forecast'

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
  const method = ((body.method as string | undefined) ?? 'linear') as 'linear' | 'moving_avg' | 'seasonal' | 'exponential'
  const adjustments = body.adjustments as { startPeriod: number; endPeriod: number; changePct: number }
  const confidence = (body.confidence as number | undefined) ?? 1.5
  if (!targetColumn || !adjustments) return NextResponse.json({ error: 'targetColumn and adjustments required' }, { status: 400 })

  let rows: Record<string, unknown>[]

  if (sourceRows && Array.isArray(sourceRows)) {
    rows = sourceRows
  } else if (uploadId) {
    const { data: upload } = await supabase
      .from('uploads').select('parsed_sample')
      .eq('id', uploadId).eq('user_id', user.id).single()
    if (!upload?.parsed_sample) return NextResponse.json({ error: 'Dataset not found' }, { status: 404 })
    rows = upload.parsed_sample as Record<string, unknown>[]
  } else {
    return NextResponse.json({ error: 'No data source provided' }, { status: 400 })
  }

  try {
    const result = whatIfFromDataset(rows, targetColumn, horizonDays, method, adjustments, confidence)
    return NextResponse.json(result)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'What-if simulation failed'
    return NextResponse.json({ error: message }, { status: 422 })
  }
}
