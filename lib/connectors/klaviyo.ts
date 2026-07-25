// Klaviyo — private API key validation. Klaviyo has no partner OAuth app
// model for this use case; each merchant generates their own private key
// (Klaviyo → Settings → API Keys) and pastes it in, same connect pattern as
// Jumia/Walmart's credential-paste flow via /api/sources.
const KLAVIYO_API_BASE = 'https://a.klaviyo.com/api'
const KLAVIYO_REVISION = '2024-10-15'

export async function validateKlaviyoCredentials(
  apiKey: string
): Promise<{ valid: boolean; error?: string }> {
  try {
    const res = await fetch(`${KLAVIYO_API_BASE}/accounts/`, {
      headers: {
        Authorization: `Klaviyo-API-Key ${apiKey}`,
        revision: KLAVIYO_REVISION,
        Accept: 'application/json',
      },
    })

    if (res.status === 401 || res.status === 403) {
      return { valid: false, error: 'Invalid Klaviyo API key — check it in Klaviyo → Settings → API Keys' }
    }
    if (!res.ok) {
      return { valid: false, error: `Klaviyo returned an unexpected error (${res.status})` }
    }

    return { valid: true }
  } catch {
    return { valid: false, error: 'Could not reach Klaviyo — try again in a moment' }
  }
}
