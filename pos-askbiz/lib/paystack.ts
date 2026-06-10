/**
 * Paystack Integration Library
 * Handles M-Pesa STK Push, card payments, sub-account management
 */

const API_URL = 'https://api.paystack.co'

function getSecretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY
  if (!key) throw new Error('PAYSTACK_SECRET_KEY not configured')
  return key
}

interface SubAccountParams {
  business_name: string
  settlement_bank: string // Bank code (e.g., '033' for GTBank)
  account_number: string
  contact_email: string
  contact_phone: string
  percentage_charge: number // Fee percentage AskBiz takes (e.g., 2)
}

interface ChargeParams {
  email: string
  amount: number // In kobo (multiply by 100 from customer view)
  authorization_code?: string
  metadata?: Record<string, unknown>
}

interface InitiateStkParams {
  email: string
  amount: number // In kobo
  phone: string
  subaccount?: string // Paystack subaccount code — routes funds to merchant
  metadata?: Record<string, unknown>
}

interface PaymentLinkParams {
  amount: number // In kobo
  currency?: string // Default 'KES'
  description?: string
  subaccount?: string // Paystack subaccount code — routes funds to merchant
  metadata?: Record<string, unknown>
}

async function request(method: string, path: string, body?: unknown) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${getSecretKey()}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json()

  if (!res.ok) {
    const error = (data as any).message || `HTTP ${res.status}`
    throw new Error(`Paystack error: ${error}`)
  }

  return data
}

export async function createSubAccount(params: SubAccountParams) {
  const result = await request('POST', '/subaccount', {
    business_name: params.business_name,
    settlement_bank: params.settlement_bank,
    account_number: params.account_number,
    contact_email: params.contact_email,
    contact_phone: params.contact_phone,
    percentage_charge: params.percentage_charge,
    is_verified: false, // Start unverified
  })

  return {
    subaccountCode: result.data.subaccount_code,
    businessName: result.data.business_name,
    email: result.data.contact_email,
  }
}

export async function initiateCharge(params: ChargeParams) {
  const result = await request('POST', '/charge', {
    email: params.email,
    amount: params.amount,
    authorization_code: params.authorization_code,
    metadata: params.metadata,
  })

  return {
    authorizationUrl: result.data.authorization_url,
    accessCode: result.data.access_code,
    reference: result.data.reference,
  }
}

/**
 * Initiate STK Push for M-Pesa
 * Prompts customer on their phone to complete payment
 */
export async function initiateStkPush(params: InitiateStkParams) {
  const result = await request('POST', '/charge', {
    email: params.email,
    amount: params.amount,
    currency: 'KES',
    mobile_money: {
      phone: params.phone,
      provider: 'mpesa',
    },
    // Route funds to merchant's subaccount with AskBiz taking platform %
    ...(params.subaccount ? {
      subaccount: params.subaccount,
      bearer: 'subaccount', // Merchant bears Paystack fee; AskBiz keeps full platform cut
    } : {}),
    metadata: {
      ...params.metadata,
      channel: 'pos_stk_push',
    },
  })

  return {
    reference: result.data.reference,
    status: result.data.status,
    message: result.data.message,
  }
}

/**
 * Create a payment link (for QR code payments)
 * Customer scans QR, pays via Paystack checkout
 */
export async function createPaymentLink(params: PaymentLinkParams) {
  const result = await request('POST', '/transaction/initialize', {
    email: (params.metadata?.email as string) || 'customer@askbiz.co',
    amount: params.amount,
    currency: params.currency || 'KES',
    channels: ['card', 'mobile_money', 'bank_transfer'],
    // Route funds to merchant's subaccount with AskBiz taking platform %
    ...(params.subaccount ? {
      subaccount: params.subaccount,
      bearer: 'subaccount', // Merchant bears Paystack fee; AskBiz keeps full platform cut
    } : {}),
    metadata: params.metadata,
  })

  return {
    checkoutUrl: result.data.authorization_url,
    reference: result.data.reference,
    qrCode: null, // Generated from the URL on our side
  }
}

/**
 * Verify a transaction was successful
 */
export async function verifyTransaction(reference: string) {
  const result = await request('GET', `/transaction/verify/${reference}`)

  return {
    reference: result.data.reference,
    status: result.data.status,
    amount: result.data.amount,
    currency: result.data.currency,
    customer: result.data.customer,
    authorization: result.data.authorization,
    metadata: result.data.metadata,
  }
}

/**
 * List sub-accounts (for debugging/verification)
 */
export async function listSubAccounts() {
  const result = await request('GET', '/subaccount')
  return result.data
}
