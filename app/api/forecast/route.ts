import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { forecastFromDataset } from '@/lib/forecast'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: Record<string, unknown>
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }) }
  const uploadId = body.uploadId as string | undefined
  const sourceDatasetId = body.sourceDatasetId as string | undefined
  const sourceRows = body.sourceRows as Record<string, unknown>[] | undefined
  const targetColumn = body.targetColumn as string | undefined
  const horizonDays = (body.horizonDays as number | undefined) ?? 14
  const method = ((body.method as string | undefined) ?? 'linear') as 'linear' | 'moving_avg' | 'seasonal' | 'exponential' | 'auto'
  const name = body.name as string | undefined
  const confidence = (body.confidence as number | undefined) ?? 1.5
  if (!targetColumn) return NextResponse.json({ error: 'targetColumn required' }, { status: 400 })
  if (!uploadId && !sourceDatasetId && !sourceRows) return NextResponse.json({ error: 'uploadId or sourceDatasetId required' }, { status: 400 })

  let rows: Record<string, unknown>[]
  let datasetLabel = ''

  if (sourceRows && Array.isArray(sourceRows)) {
    // Pre-fetched source data passed directly
    rows = sourceRows
    datasetLabel = sourceDatasetId || 'source'
  } else if (uploadId) {
    // Load from uploads table
    const { data: upload } = await supabase
      .from('uploads')
      .select('parsed_sample, filename')
      .eq('id', uploadId)
      .eq('user_id', user.id)
      .single()
    if (!upload?.parsed_sample) return NextResponse.json({ error: 'Dataset not found or not yet parsed' }, { status: 404 })
    rows = upload.parsed_sample as Record<string, unknown>[]
    datasetLabel = upload.filename || uploadId
  } else {
    return NextResponse.json({ error: 'No data source provided' }, { status: 400 })
  }

  try {
    const result = forecastFromDataset(rows, targetColumn, horizonDays, method, confidence)

    // Save forecast to DB
    const { data: saved } = await supabase.from('forecasts').insert({
      user_id: user.id,
      upload_id: uploadId || null,
      name: name || `${targetColumn} forecast`,
      target_column: targetColumn,
      method,
      horizon_days: horizonDays,
      result,
      accuracy: result.accuracy,
    }).select().single()

    await supabase.from('audit_log').insert({
      user_id: user.id,
      event: 'forecast_generated',
      metadata: { upload_id: uploadId, column: targetColumn, method, accuracy: result.accuracy },
    })

    return NextResponse.json({ id: saved?.id, ...result })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Forecast failed'
    return NextResponse.json({ error: message }, { status: 422 })
  }
}

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabase
    .from('forecasts')
    .select('id, name, target_column, method, accuracy, created_at, horizon_days')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  return NextResponse.json(data || [])
}
