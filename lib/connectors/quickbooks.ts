// ── QUICKBOOKS CONNECTOR ──────────────────────────────────────
// OAuth 2.0 via Intuit OAuth
// Scopes: com.intuit.quickbooks.accounting

export function getQuickBooksAuthUrl(state: string): string {
  const clientId = process.env.QUICKBOOKS_CLIENT_ID!
  const redirectUri = `${process.env.NEXT_PUBLIC_URL}/api/auth/quickbooks/callback`
  const scope = 'com.intuit.quickbooks.accounting'
  return `https://appcenter.intuit.com/connect/oauth2?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&state=${state}`
}

export async function exchangeQuickBooksCode(code: string): Promise<{ access_token: string; refresh_token: string; realmId: string }> {
  const redirectUri = `${process.env.NEXT_PUBLIC_URL}/api/auth/quickbooks/callback`
  const credentials = Buffer.from(`${process.env.QUICKBOOKS_CLIENT_ID}:${process.env.QUICKBOOKS_CLIENT_SECRET}`).toString('base64')

  const res = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: redirectUri }),
  })
  if (!res.ok) throw new Error(`QuickBooks token exchange failed: ${res.status}`)
  return res.json()
}

export async function refreshQuickBooksToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string }> {
  const credentials = Buffer.from(`${process.env.QUICKBOOKS_CLIENT_ID}:${process.env.QUICKBOOKS_CLIENT_SECRET}`).toString('base64')
  const res = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
    method: 'POST',
    headers: { 'Authorization': `Basic ${credentials}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken }),
  })
  if (!res.ok) throw new Error(`QuickBooks token refresh failed: ${res.status}`)
  return res.json()
}

export async function fetchQuickBooksReport(accessToken: string, realmId: string, reportType: 'ProfitAndLoss' | 'BalanceSheet' | 'CashFlow') {
  const base = process.env.QUICKBOOKS_SANDBOX === 'true'
    ? 'https://sandbox-quickbooks.api.intuit.com'
    : 'https://quickbooks.api.intuit.com'
  const res = await fetch(
    `${base}/v3/company/${realmId}/reports/${reportType}?minorversion=65`,
    { headers: { 'Authorization': `Bearer ${accessToken}`, 'Accept': 'application/json' } }
  )
  if (!res.ok) throw new Error(`QuickBooks ${reportType} failed: ${res.status}`)
  return res.json()
}

export async function fetchQuickBooksInvoices(accessToken: string, realmId: string) {
  const base = process.env.QUICKBOOKS_SANDBOX === 'true'
    ? 'https://sandbox-quickbooks.api.intuit.com'
    : 'https://quickbooks.api.intuit.com'
  const res = await fetch(
    `${base}/v3/company/${realmId}/query?query=SELECT * FROM Invoice ORDERBY MetaData.CreateTime DESC MAXRESULTS 100&minorversion=65`,
    { headers: { 'Authorization': `Bearer ${accessToken}`, 'Accept': 'application/json' } }
  )
  if (!res.ok) throw new Error(`QuickBooks invoices failed: ${res.status}`)
  const data = await res.json()
  return data.QueryResponse?.Invoice || []
}
