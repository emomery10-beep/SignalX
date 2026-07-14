/**
 * WaafiPay Integration Library
 * Single gateway aggregating EVC Plus, WAAFI, Zaad, and Sahal mobile wallets (Somalia)
 *
 * Credentials (merchantUid/apiUserId/apiKey) are per-merchant, not platform-wide —
 * unlike Paystack/Stripe, WaafiPay has no self-serve merchant provisioning API, so
 * every call here takes credentials as parameters rather than reading a global secret.
 *
 * TODO(waafipay-verify): every field name/shape below was written from public docs
 * (docs.waafipay.com) and community EVC Plus SDKs, not a live sandbox call — confirm
 * once real credentials are obtained.
 */
import crypto from 'crypto'

// TODO(waafipay-verify): confirm exact sandbox/production URL once WaafiPay credentials + docs access are obtained
const API_URL = process.env.WAAFIPAY_API_URL || 'https://api.waafipay.net/asm'

interface WaafiCredentials {
  merchantUid: string
  apiUserId: string
  apiKey: string
}

interface PurchaseParams extends WaafiCredentials {
  accountNo: string // full international phone, no '+', no leading zero
  referenceId: string
  invoiceId: string
  amount: string // 2 decimals
  currency: 'SOS' | 'USD'
  description?: string
}

interface WebhookRegisterParams extends WaafiCredentials {
  storeId?: string
  hppKey?: string
  callbackUrl: string
}

async function request(serviceName: string, serviceParams: Record<string, unknown>) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      schemaVersion: '1.0',
      requestId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      channelName: 'WEB',
      serviceName,
      serviceParams,
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    const error = (data as any)?.responseMsg || (data as any)?.message || `HTTP ${res.status}`
    throw new Error(`WaafiPay error: ${error}`)
  }

  return data
}

/**
 * Initiate a mobile-wallet purchase (EVC Plus / WAAFI / Zaad / Sahal).
 * Prompts the customer on their phone (USSD/app) to enter their wallet PIN,
 * functionally equivalent to M-Pesa's STK push.
 */
export async function initiateWaafiPurchase(params: PurchaseParams) {
  const result = await request('API_PURCHASE', {
    merchantUid: params.merchantUid,
    apiUserId: params.apiUserId,
    apiKey: params.apiKey,
    paymentMethod: 'MWALLET_ACCOUNT',
    payerInfo: {
      accountNo: params.accountNo,
    },
    transactionInfo: {
      referenceId: params.referenceId,
      invoiceId: params.invoiceId,
      amount: params.amount,
      currency: params.currency,
      description: params.description || 'AskBiz POS sale',
    },
  })

  const state = result?.params?.state
  const responseCode = result?.responseCode
  const success = responseCode === 'RCS_SUCCESS' || responseCode === '2001' || state === 'APPROVED'

  if (!success) {
    throw new Error(`WaafiPay error: ${result?.responseMsg || result?.params?.state || 'purchase not approved'}`)
  }

  return {
    success,
    transactionId: result?.params?.transactionId,
    issuerTransactionId: result?.params?.issuerTransactionId,
    state,
    responseCode,
    responseMsg: result?.responseMsg,
    rawResponse: result,
  }
}

/**
 * Register a webhook callback URL for payment confirmations.
 * Not callable without real credentials — kept as a drop-in for a future
 * onboarding flow, analogous to createSubAccount/createConnectedAccount.
 */
export async function registerWaafiWebhook(params: WebhookRegisterParams) {
  const result = await request('WEBHOOK_REGISTER', {
    merchantUid: params.merchantUid,
    apiUserId: params.apiUserId,
    apiKey: params.apiKey,
    storeId: params.storeId,
    hppKey: params.hppKey,
    callbackUrl: params.callbackUrl,
  })

  return {
    webhookSecret: result?.params?.secret || result?.params?.webhookSecret,
    rawResponse: result,
  }
}

/**
 * Verify an incoming webhook's HMAC-SHA256 signature.
 * Signing string: `${timestamp}.${eventId}.${rawBody}`.
 * Rejects payloads outside a 5-minute replay window per docs.
 * TODO(waafipay-verify): confirm hard-reject vs soft-warn on stale timestamps.
 */
export function verifyWaafiWebhookSignature(
  rawBody: string,
  timestamp: string,
  eventId: string,
  signatureHeader: string,
  signingSecret: string
): boolean {
  const now = Math.floor(Date.now() / 1000)
  const ts = parseInt(timestamp, 10)
  if (!Number.isFinite(ts) || Math.abs(now - ts) > 300) return false

  const signingString = `${timestamp}.${eventId}.${rawBody}`
  const expected = crypto.createHmac('sha256', signingSecret).update(signingString).digest('hex')

  const a = Buffer.from(expected)
  const b = Buffer.from(signatureHeader || '')
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}
