import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { forecastFromDataset } from '@/lib/forecast'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { uploadId, targetColumn, horizonDays = 14, method = 'linear', name } = await request.json()
  if (!uploadId || !targetColumn) return NextResponse.json({ error: 'uploadId and targetColumn required' }, { status: 400 })

  // Load the parsed dataset
  const { data: upload } = await supabase
    .from('uploads')
    .select('parsed_sample, filename')
    .eq('id', uploadId)
    .eq('user_id', user.id)
    .single()

  if (!upload?.parsed_sample) return NextResponse.json({ error: 'Dataset not found or not yet parsed' }, { status: 404 })

  try {
    const rows = upload.parsed_sample as Record<string, unknown>[]
    const result = forecastFromDataset(rows, targetColumn, horizonDays, method)

    // Save forecast to DB
    const { data: saved } = await supabase.from('forecasts').insert({
      user_id: user.id,
      upload_id: uploadId,
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
