// ── Meta WhatsApp Cloud API helper ──────────────────────────────────────────
// Docs: https://developers.facebook.com/docs/whatsapp/cloud-api/messages
//
// Required env vars:
//   META_WHATSAPP_TOKEN      — permanent System User access token
//   META_PHONE_NUMBER_ID     — the phone number ID (not the number itself)
//
// Template env vars (configure names to match what you created in Meta Business Manager):
//   META_OTP_TEMPLATE        — default: "askbiz_otp"
//   META_RECEIPT_TEMPLATE    — default: "askbiz_receipt"
//   META_TEMPLATE_LANG       — default: "en_GB"

const BASE = 'https://graph.facebook.com/v19.0'

function headers() {
  return {
    'Authorization': `Bearer ${process.env.META_WHATSAPP_TOKEN}`,
    'Content-Type':  'application/json',
  }
}

function phoneId() {
  return process.env.META_PHONE_NUMBER_ID
}

// Strip all non-digits and ensure international format (no +)
function normalisePhone(phone: string): string {
  return phone.replace(/\D/g, '')
}

// ── Send OTP via authentication template ────────────────────────────────────
// Template "askbiz_otp" should be:
//   Category: Authentication (or Utility)
//   Body:     "{{1}} is your AskBiz POS login code. Valid for 10 minutes."
//
// Create it at: business.facebook.com → WhatsApp Manager → Message Templates
export async function sendOTP(phone: string, code: string): Promise<{ ok: boolean; error?: string }> {
  const token   = process.env.META_WHATSAPP_TOKEN
  const numId   = phoneId()
  if (!token || !numId) return { ok: false, error: 'Meta WhatsApp not configured (META_WHATSAPP_TOKEN / META_PHONE_NUMBER_ID missing)' }

  const template  = process.env.META_OTP_TEMPLATE  || 'askbiz_otp'
  const lang      = process.env.META_TEMPLATE_LANG || 'en_GB'

  const res = await fetch(`${BASE}/${numId}/messages`, {
    method:  'POST',
    headers: headers(),
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to:   normalisePhone(phone),
      type: 'template',
      template: {
        name:     template,
        language: { code: lang },
        components: [{
          type:       'body',
          parameters: [{ type: 'text', text: code }],
        }],
      },
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const msg = err?.error?.message || `Meta API error ${res.status}`
    console.error('[whatsapp] sendOTP failed:', msg)
    return { ok: false, error: msg }
  }

  return { ok: true }
}

// ── Send receipt via utility template ───────────────────────────────────────
// Template "askbiz_receipt" should be:
//   Category: Utility
//   Body:     "{{1}}"   ← single variable containing the full receipt text
//
// Meta allows long body variables so the full receipt fits in one parameter.
export async function sendReceipt(phone: string, receiptText: string): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.META_WHATSAPP_TOKEN
  const numId = phoneId()
  if (!token || !numId) return { ok: false, error: 'Meta WhatsApp not configured' }

  const template = process.env.META_RECEIPT_TEMPLATE || 'askbiz_receipt'
  const lang     = process.env.META_TEMPLATE_LANG    || 'en_GB'

  const res = await fetch(`${BASE}/${numId}/messages`, {
    method:  'POST',
    headers: headers(),
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to:   normalisePhone(phone),
      type: 'template',
      template: {
        name:     template,
        language: { code: lang },
        components: [{
          type:       'body',
          parameters: [{ type: 'text', text: receiptText }],
        }],
      },
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const msg = err?.error?.message || `Meta API error ${res.status}`
    console.error('[whatsapp] sendReceipt failed:', msg)
    return { ok: false, error: msg }
  }

  return { ok: true }
}

// ── Send a free-form text message (only works within 24h of customer messaging you) ──
// Useful for replies within an existing conversation.
export async function sendText(phone: string, text: string): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.META_WHATSAPP_TOKEN
  const numId = phoneId()
  if (!token || !numId) return { ok: false, error: 'Meta WhatsApp not configured' }

  const res = await fetch(`${BASE}/${numId}/messages`, {
    method:  'POST',
    headers: headers(),
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to:   normalisePhone(phone),
      type: 'text',
      text: { body: text },
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return { ok: false, error: err?.error?.message || `Meta API error ${res.status}` }
  }

  return { ok: true }
}
