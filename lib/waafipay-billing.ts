/**
 * WaafiPay Integration — AskBiz's OWN subscription billing (Somalia)
 *
 * Distinct from pos-askbiz/lib/waafipay.ts: that lib lets individual POS
 * merchants collect payments from THEIR customers using THEIR OWN WaafiPay
 * credentials (stored per-merchant in merchant_payment_config). This lib
 * uses AskBiz's OWN, single, platform-level WaafiPay merchant account to
 * collect AskBiz's subscription fee FROM a Somali business owner — the
 * same relationship PESAPAL_CONSUMER_KEY/SECRET has to Kenyan billing.
 *
 * Root app and pos-askbiz are separate deployed Next.js apps (tsconfig.json
 * excludes pos-askbiz) so this intentionally duplicates the /asm envelope
 * shape rather than importing across apps.
 *
 * TODO(waafipay-verify): field names/shape written from public docs
 * (docs.waafipay.com) and community EVC Plus SDKs, not a live sandbox call.
 */
import crypto from 'crypto'

// TODO(waafipay-verify): confirm exact sandbox/production URL once WaafiPay credentials + docs access are obtained
const API_URL = process.env.WAAFIPAY_API_URL || 'https://api.waafipay.net/asm'

function getCredentials() {
  const merchantUid = process.env.WAAFIPAY_ASKBIZ_MERCHANT_UID
  const apiUserId = process.env.WAAFIPAY_ASKBIZ_API_USER_ID
  const apiKey = process.env.WAAFIPAY_ASKBIZ_API_KEY
  if (!merchantUid || !apiUserId || !apiKey) {
    throw new Error('WAAFIPAY_ASKBIZ_MERCHANT_UID/API_USER_ID/API_KEY not configured')
  }
  return { merchantUid, apiUserId, apiKey }
}

interface PurchaseParams {
  accountNo: string // full international phone, no '+', no leading zero
  referenceId: string
  invoiceId: string
  amount: string // 2 decimals
  currency: 'SOS' | 'USD'
  description?: string
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
 * Initiate a mobile-wallet purchase against AskBiz's own WaafiPay account.
 * The payer is the business owner paying their AskBiz subscription, not a
 * POS merchant's customer — same push-prompt mechanism as the merchant-facing
 * flow (customer/owner gets a PIN prompt on their phone), no hosted checkout.
 */
export async function initiateWaafiBillingPurchase(params: PurchaseParams) {
  const { merchantUid, apiUserId, apiKey } = getCredentials()

  const result = await request('API_PURCHASE', {
    merchantUid,
    apiUserId,
    apiKey,
    paymentMethod: 'MWALLET_ACCOUNT',
    payerInfo: {
      accountNo: params.accountNo,
    },
    transactionInfo: {
      referenceId: params.referenceId,
      invoiceId: params.invoiceId,
      amount: params.amount,
      currency: params.currency,
      description: params.description || 'AskBiz subscription',
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
 * Register AskBiz's own webhook callback URL. Not callable without real
 * credentials — kept as a drop-in for the one-time setup call, analogous
 * to pos-askbiz/lib/waafipay.ts's registerWaafiWebhook().
 */
export async function registerWaafiBillingWebhook(callbackUrl: string) {
  const { merchantUid, apiUserId, apiKey } = getCredentials()

  const result = await request('WEBHOOK_REGISTER', {
    merchantUid,
    apiUserId,
    apiKey,
    callbackUrl,
  })

  return {
    webhookSecret: result?.params?.secret || result?.params?.webhookSecret,
    rawResponse: result,
  }
}

/**
 * Verify an incoming webhook's HMAC-SHA256 signature against AskBiz's own
 * single platform-level secret (no per-merchant lookup needed — there is
 * only ever one AskBiz WaafiPay account).
 * TODO(waafipay-verify): confirm hard-reject vs soft-warn on stale timestamps.
 */
export function verifyWaafiBillingWebhookSignature(
  rawBody: string,
  timestamp: string,
  eventId: string,
  signatureHeader: string
): boolean {
  const signingSecret = process.env.WAAFIPAY_ASKBIZ_WEBHOOK_SECRET
  if (!signingSecret) return false

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
