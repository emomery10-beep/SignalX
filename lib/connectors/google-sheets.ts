// ── GOOGLE SHEETS CONNECTOR ───────────────────────────────────
// OAuth 2.0 via Google Identity
// Scope: https://www.googleapis.com/auth/spreadsheets.readonly

export function getGoogleSheetsAuthUrl(state: string): string {
  const clientId = process.env.GOOGLE_CLIENT_ID!
  const redirectUri = `${process.env.NEXT_PUBLIC_URL}/api/auth/google/callback`
  const scope = 'https://www.googleapis.com/auth/spreadsheets.readonly https://www.googleapis.com/auth/drive.readonly'
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent&state=${state}`
}

export async function exchangeGoogleCode(code: string): Promise<{ access_token: string; refresh_token: string }> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${process.env.NEXT_PUBLIC_URL}/api/auth/google/callback`,
      grant_type: 'authorization_code',
    }),
  })
  if (!res.ok) throw new Error(`Google token exchange failed: ${res.status}`)
  return res.json()
}

export async function refreshGoogleToken(refreshToken: string): Promise<string> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      grant_type: 'refresh_token',
    }),
  })
  if (!res.ok) throw new Error(`Google token refresh failed: ${res.status}`)
  const data = await res.json()
  return data.access_token
}

export async function fetchSheetData(accessToken: string, spreadsheetId: string, range = 'Sheet1') {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueRenderOption=UNFORMATTED_VALUE&dateTimeRenderOption=FORMATTED_STRING`,
    { headers: { 'Authorization': `Bearer ${accessToken}` } }
  )
  if (!res.ok) throw new Error(`Google Sheets fetch failed: ${res.status}`)
  const data = await res.json()
  const rows: string[][] = data.values || []
  if (rows.length < 2) return { headers: [], rows: [] }
  const headers = rows[0].map(String)
  const dataRows = rows.slice(1).map(row =>
    Object.fromEntries(headers.map((h, i) => [h, row[i] ?? '']))
  )
  return { headers, rows: dataRows }
}

export async function listSheets(accessToken: string, spreadsheetId: string) {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties.title`,
    { headers: { 'Authorization': `Bearer ${accessToken}` } }
  )
  if (!res.ok) throw new Error(`Google Sheets list failed: ${res.status}`)
  const data = await res.json()
  return (data.sheets || []).map((s: { properties: { title: string } }) => s.properties.title)
}
