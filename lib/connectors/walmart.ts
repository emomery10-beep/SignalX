// ── WALMART CONNECTOR ─────────────────────────────────────────
// OAuth2 client_credentials auth (Client ID + Client Secret)
// Validates by exchanging for a token then hitting a lightweight endpoint

export async function validateWalmartCredentials(
  clientId: string,
  clientSecret: string,
): Promise<{ valid: boolean; error?: string }> {
  try {
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    const correlationId = `askbiz-validate-${Date.now()}`

    const tokenRes = await fetch('https://marketplace.walmartapis.com/v3/token', {
      method: 'POST',
      headers: {
        Authorization:           `Basic ${basicAuth}`,
        'WM_SVC.NAME':           'Walmart Marketplace',
        'WM_QOS.CORRELATION_ID': correlationId,
        'Content-Type':          'application/x-www-form-urlencoded',
        Accept:                  'application/json',
      },
      body: 'grant_type=client_credentials',
    })

    if (!tokenRes.ok) {
      const body = await tokenRes.json().catch(() => ({})) as Record<string, unknown>
      const msg  = (body.error_description || body.error || `HTTP ${tokenRes.status}`) as string
      return { valid: false, error: `Invalid Walmart credentials — ${msg}` }
    }

    const { access_token } = await tokenRes.json() as { access_token?: string }
    if (!access_token) {
      return { valid: false, error: 'Walmart returned no access token — check your Client ID and Secret' }
    }

    // Lightweight probe: fetch one order to confirm marketplace access
    const probeRes = await fetch(
      'https://marketplace.walmartapis.com/v3/orders?limit=1',
      {
        headers: {
          Authorization:           `Bearer ${access_token}`,
          'WM_SVC.NAME':           'Walmart Marketplace',
          'WM_QOS.CORRELATION_ID': `${correlationId}-probe`,
          Accept:                  'application/json',
        },
      }
    )

    if (!probeRes.ok && probeRes.status !== 404) {
      return {
        valid: false,
        error: `Walmart credentials authenticated but marketplace access failed (${probeRes.status}) — make sure this app has Orders read permission in Seller Center`,
      }
    }

    return { valid: true }
  } catch (e: unknown) {
    return {
      valid: false,
      error: e instanceof Error ? e.message : 'Could not reach Walmart API — check your network',
    }
  }
}
