// ============================================================
// SignalX File Parser
// Handles CSV and XLSX — returns clean structured data
// ============================================================

export interface ParsedFile {
  headers: string[]
  rows: Record<string, unknown>[]
  rowCount: number
  fileSize: number
  summary: string          // for AI context
  sample: Record<string, unknown>[]  // first 200 rows for AI
  columnTypes: Record<string, 'number' | 'string' | 'date'>
  numericColumns: string[]
  dateColumns: string[]
}

// ── Detect column types ───────────────────────────────────────
function detectColumnType(values: unknown[]): 'number' | 'string' | 'date' {
  const nonEmpty = values.filter(v => v !== null && v !== undefined && v !== '')
  if (!nonEmpty.length) return 'string'

  const numCount = nonEmpty.filter(v => !isNaN(Number(v))).length
  if (numCount / nonEmpty.length > 0.8) return 'number'

  const dateCount = nonEmpty.filter(v => {
    const s = String(v)
    return /^\d{4}-\d{2}-\d{2}/.test(s) || /^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(s)
  }).length
  if (dateCount / nonEmpty.length > 0.7) return 'date'

  return 'string'
}

// ── Build AI-friendly summary ─────────────────────────────────
function buildSummary(headers: string[], rows: Record<string, unknown>[], types: Record<string, string>): string {
  const numCols = headers.filter(h => types[h] === 'number')
  const summaryParts: string[] = [`${rows.length} rows, ${headers.length} columns.`]

  // Column overview
  summaryParts.push(`Columns: ${headers.join(', ')}.`)

  // Numeric stats
  for (const col of numCols.slice(0, 6)) {
    const vals = rows.map(r => Number(r[col])).filter(n => !isNaN(n))
    if (!vals.length) continue
    const min = Math.min(...vals)
    const max = Math.max(...vals)
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length
    summaryParts.push(`${col}: min=${Math.round(min)}, max=${Math.round(max)}, avg=${Math.round(avg)}`)
  }

  return summaryParts.join(' ')
}

// ── CSV Parser ────────────────────────────────────────────────
export async function parseCSV(buffer: ArrayBuffer, filename: string): Promise<ParsedFile> {
  const { default: Papa } = await import('papaparse')
  const text = new TextDecoder().decode(buffer)

  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, unknown>>(text, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (result) => {
        const rows = result.data
        const headers = result.meta.fields || []
        const columnTypes: Record<string, 'number' | 'string' | 'date'> = {}

        for (const h of headers) {
          columnTypes[h] = detectColumnType(rows.map(r => r[h]))
        }

        resolve({
          headers,
          rows,
          rowCount: rows.length,
          fileSize: buffer.byteLength,
          summary: buildSummary(headers, rows, columnTypes),
          sample: rows.slice(0, 200),
          columnTypes,
          numericColumns: headers.filter(h => columnTypes[h] === 'number'),
          dateColumns: headers.filter(h => columnTypes[h] === 'date'),
        })
      },
      error: reject,
    })
  })
}

// ── XLSX Parser ───────────────────────────────────────────────
export async function parseXLSX(buffer: ArrayBuffer, filename: string): Promise<ParsedFile> {
  const XLSX = await import('xlsx')
  const wb = XLSX.read(buffer, { type: 'array', cellDates: true })

  // Use the first sheet
  const sheetName = wb.SheetNames[0]
  const ws = wb.Sheets[sheetName]
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: '' })
  const headers = rows.length > 0 ? Object.keys(rows[0]) : []

  const columnTypes: Record<string, 'number' | 'string' | 'date'> = {}
  for (const h of headers) {
    columnTypes[h] = detectColumnType(rows.map(r => r[h]))
  }

  return {
    headers,
    rows,
    rowCount: rows.length,
    fileSize: buffer.byteLength,
    summary: buildSummary(headers, rows, columnTypes),
    sample: rows.slice(0, 200),
    columnTypes,
    numericColumns: headers.filter(h => columnTypes[h] === 'number'),
    dateColumns: headers.filter(h => columnTypes[h] === 'date'),
  }
}

// ── Main entry point ──────────────────────────────────────────
export async function parseFile(file: File): Promise<ParsedFile> {
  const buffer = await file.arrayBuffer()
  const name = file.name.toLowerCase()

  if (name.endsWith('.csv')) return parseCSV(buffer, file.name)
  if (name.endsWith('.xlsx') || name.endsWith('.xls')) return parseXLSX(buffer, file.name)

  throw new Error(`Unsupported file type: ${file.name}. Please upload a CSV or XLSX file.`)
}

// ── Export helpers ─────────────────────────────────────────────
export function rowsToCSV(headers: string[], rows: string[][]): string {
  return [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n')
}
