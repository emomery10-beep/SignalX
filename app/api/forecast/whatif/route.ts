import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { whatIfFromDataset } from '@/lib/forecast'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { uploadId, sourceRows, targetColumn, horizonDays = 14, method = 'linear', adjustments, confidence = 1.5 } = await request.json()
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
