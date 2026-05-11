import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { parseCSV, parseXLSX } from '@/lib/file/parser'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const conversationId = formData.get('conversationId') as string | null

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  // Validate file type
  const name = file.name.toLowerCase()
  if (!name.endsWith('.csv') && !name.endsWith('.xlsx') && !name.endsWith('.xls')) {
    return NextResponse.json({ error: 'Only CSV and XLSX files are supported' }, { status: 400 })
  }

  // Validate file size (50 MB)
  if (file.size > 50 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large. Max 50 MB.' }, { status: 400 })
  }

  try {
    const buffer = await file.arrayBuffer()

    // Parse the file
    const parsed = name.endsWith('.csv')
      ? await parseCSV(buffer, file.name)
      : await parseXLSX(buffer, file.name)

    // Upload to Supabase storage
    const storagePath = `${user.id}/${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(storagePath, buffer, { contentType: file.type || 'application/octet-stream' })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      // Continue even if storage fails — we have the parsed data
    }

    // Save metadata to DB
    const { data: uploadRecord } = await supabase
      .from('uploads')
      .insert({
        user_id: user.id,
        conversation_id: conversationId,
        filename: file.name,
        storage_path: storagePath,
        file_size: file.size,
        row_count: parsed.rowCount,
        column_names: parsed.headers,
        parsed_sample: parsed.sample as unknown as Record<string, unknown>,
        status: 'parsed',
      })
      .select()
      .single()

    // Audit log
    await supabase.from('audit_log').insert({
      user_id: user.id,
      event: 'file_uploaded',
      metadata: {
        filename: file.name,
        rows: parsed.rowCount,
        columns: parsed.headers.length,
        upload_id: uploadRecord?.id,
      },
    })

    return NextResponse.json({
      id: uploadRecord?.id,
      filename: file.name,
      rowCount: parsed.rowCount,
      headers: parsed.headers,
      columnTypes: parsed.columnTypes,
      numericColumns: parsed.numericColumns,
      dateColumns: parsed.dateColumns,
      summary: parsed.summary,
      // Return sample for client-side AI context (first 100 rows)
      sample: parsed.sample.slice(0, 100),
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Parse failed'
    console.error('File parse error:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
