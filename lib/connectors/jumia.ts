// Jumia Vendor Center — Self Authorization credential validation.
// Each merchant generates their own Client ID + long-lived Refresh Token
// inside their own Vendor Center account (Settings › Applications), so
// unlike Amazon/Shopify there's no AskBiz-owned client_secret involved here.
const JUMIA_API_BASE = 'https://vendor-api.jumia.com'

export async function validateJumiaCredentials(
  clientId: string,
  refreshToken: string
): Promise<{ valid: boolean; error?: string }> {
  try {
    const tokenRes = await fetch(`${JUMIA_API_BASE}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId,
      }),
    })

    if (!tokenRes.ok) {
      return { valid: false, error: 'Could not authenticate with Jumia — check the Client ID and Refresh Token from Vendor Center › Settings › Applications' }
    }

    const { access_token } = await tokenRes.json()
    if (!access_token) return { valid: false, error: 'Jumia did not return an access token — check your Refresh Token' }

    const shopsRes = await fetch(`${JUMIA_API_BASE}/shops`, {
      headers: { Authorization: `Bearer ${access_token}` },
    })
    if (!shopsRes.ok) {
      return { valid: false, error: 'Connected to Jumia but could not read your shops — check the application has an Order/Product role in Vendor Center' }
    }

    return { valid: true }
  } catch {
    return { valid: false, error: 'Could not reach Jumia — try again in a moment' }
  }
}
