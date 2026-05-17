// ============================================================
// PesaPal v3 API — Kenya payment gateway
// Supports M-Pesa, Airtel Money, cards, and more
// Docs: https://developer.pesapal.com/how-to-integrate/e-commerce/api-30-json/api-reference
// ============================================================

const SANDBOX_URL = 'https://cybqa.pesapal.com/pesapalv3'
const PROD_URL = 'https://pay.pesapal.com/v3'

const BASE_URL = process.env.PESAPAL_ENV === 'production' ? PROD_URL : SANDBOX_URL

const CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY!
const CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET!
const CALLBACK_URL = process.env.PESAPAL_CALLBACK_URL || `${process.env.NEXT_PUBLIC_APP_URL}/api/pesapal/callback`

let cachedToken: { token: string; expiresAt: number } | null = null

export async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) return cachedToken.token

  const res = await fetch(`${BASE_URL}/api/Auth/RequestToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      consumer_key: CONSUMER_KEY,
      consumer_secret: CONSUMER_SECRET,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`PesaPal auth failed (${res.status}): ${text}`)
  }

  const data = await res.json()
  cachedToken = {
    token: data.token,
    expiresAt: Date.now() + (parseInt(data.expiryDate ? '240' : '240', 10)) * 60 * 1000,
  }
  return cachedToken.token
}

// ── Register IPN URL ─────────────────────────────────────────
let cachedIpnId: string | null = null

export async function registerIPN(): Promise<string> {
  if (cachedIpnId) return cachedIpnId

  const token = await getAccessToken()
  const res = await fetch(`${BASE_URL}/api/URLSetup/RegisterIPN`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      url: CALLBACK_URL,
      ipn_notification_type: 'GET',
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`PesaPal IPN registration failed (${res.status}): ${text}`)
  }

  const data = await res.json()
  cachedIpnId = data.ipn_id
  return data.ipn_id
}

// ── Submit Order ─────────────────────────────────────────────
export interface PesaPalOrderParams {
  orderId: string
  amount: number
  currency: string
  description: string
  email: string
  phone?: string
  firstName?: string
  lastName?: string
  callbackUrl?: string
}

export interface PesaPalOrderResponse {
  order_tracking_id: string
  merchant_reference: string
  redirect_url: string
  error: string | null
  status: string
}

export async function submitOrder(params: PesaPalOrderParams): Promise<PesaPalOrderResponse> {
  const token = await getAccessToken()
  const ipnId = await registerIPN()

  const res = await fetch(`${BASE_URL}/api/Transactions/SubmitOrderRequest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id: params.orderId,
      currency: params.currency,
      amount: params.amount,
      description: params.description,
      callback_url: params.callbackUrl || CALLBACK_URL,
      notification_id: ipnId,
      billing_address: {
        email_address: params.email,
        phone_number: params.phone || '',
        first_name: params.firstName || '',
        last_name: params.lastName || '',
        country_code: 'KE',
      },
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`PesaPal order submission failed (${res.status}): ${text}`)
  }

  return await res.json()
}

// ── Get Transaction Status ───────────────────────────────────
export interface PesaPalTransactionStatus {
  payment_method: string
  amount: number
  created_date: string
  confirmation_code: string
  payment_status_description: string
  description: string
  message: string
  payment_account: string
  call_back_url: string
  status_code: number
  merchant_reference: string
  currency: string
  error: { error_type: string; code: string; message: string } | null
}

export async function getTransactionStatus(orderTrackingId: string): Promise<PesaPalTransactionStatus> {
  const token = await getAccessToken()

  const res = await fetch(
    `${BASE_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`PesaPal status query failed (${res.status}): ${text}`)
  }

  return await res.json()
}

// Status codes: 0 = INVALID, 1 = COMPLETED, 2 = FAILED, 3 = REVERSED
export function isPaymentComplete(status: PesaPalTransactionStatus): boolean {
  return status.status_code === 1
}

export function isPaymentFailed(status: PesaPalTransactionStatus): boolean {
  return status.status_code === 2 || status.status_code === 0
}
