import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { type, headers, rows, title, conversationId } = await request.json()

  if (!type || !rows) return NextResponse.json({ error: 'type and rows required' }, { status: 400 })

  let content = ''
  let contentType = ''
  let filename = `signalx-export-${Date.now()}`

  if (type === 'csv') {
    const csvHeaders = headers?.join(',') || Object.keys(rows[0] || {}).join(',')
    const csvRows = rows.map((r: unknown[]) =>
      (Array.isArray(r) ? r : Object.values(r as object))
        .map((c: unknown) => `"${String(c).replace(/"/g, '""')}"`)
        .join(',')
    )
    content = [csvHeaders, ...csvRows].join('\n')
    contentType = 'text/csv'
    filename += '.csv'
  } else if (type === 'json') {
    content = JSON.stringify(rows, null, 2)
    contentType = 'application/json'
    filename += '.json'
  } else if (type === 'html') {
    // Simple HTML table export
    const thHtml = (headers || Object.keys(rows[0] || {})).map((h: string) => `<th>${h}</th>`).join('')
    const trHtml = rows.map((r: unknown[]) =>
      '<tr>' + (Array.isArray(r) ? r : Object.values(r as object)).map((c: unknown) => `<td>${c}</td>`).join('') + '</tr>'
    ).join('\n')
    content = `<!DOCTYPE html><html><head><title>${title || 'SignalX Export'}</title>
<style>body{font-family:sans-serif;padding:20px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f2f2f2}</style>
</head><body><h2>${title || 'SignalX Export'}</h2><table><thead><tr>${thHtml}</tr></thead><tbody>${trHtml}</tbody></table></body></html>`
    contentType = 'text/html'
    filename += '.html'
  }

  // Log export
  await supabase.from('exports').insert({
    user_id: user.id, export_type: type,
    source: conversationId ? `conversation:${conversationId}` : 'manual',
  })
  await supabase.from('audit_log').insert({
    user_id: user.id, event: 'export_generated',
    metadata: { type, rows: rows.length, title },
  })

  return new NextResponse(content, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
