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

// Convert to Meta's expected international format (digits only, no +, no
// leading 0). Bare digit-stripping alone silently ships a local-format
// number like Kenyan "0712345678" straight to the Graph API — Meta accepts
// it with a 200 OK (no synchronous validation that it maps to a real
// WhatsApp account) but the message never delivers. dialHint is the
// merchant's own dial code (from profiles.country_code via COUNTRY_DIAL)
// used to fill in the country prefix when the caller typed a local number.
function normalisePhone(phone: string, dialHint?: string): string {
  const trimmed = phone.trim()
  if (trimmed.startsWith('+')) return trimmed.replace(/\D/g, '')
  const digits = trimmed.replace(/\D/g, '')
  if (dialHint && digits.startsWith('0')) return dialHint.replace(/\D/g, '') + digits.slice(1)
  return digits
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
        components: [
          { type: 'body', parameters: [{ type: 'text', text: code }] },
          // The template's "Copy code" button (see askbiz_otp in WhatsApp
          // Manager) is itself a templated URL — it needs the code passed
          // as a button parameter too, separate from the body parameter,
          // or Meta rejects the send with "Button ... requires a parameter".
          { type: 'button', sub_type: 'url', index: '0', parameters: [{ type: 'text', text: code }] },
        ],
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

// ── Send receipt: image first, text-summary fallback ───────────────────────
// Template "askbiz_receipt_image" (Utility, pending review as of 2026-07-24):
//   Header: IMAGE — a link to app/api/pos/receipt/[id]/image, so it always
//           reflects the actual transaction, never a stale uploaded file.
//   Body:   "Here's your receipt from {{1}}. Thank you for your business!"
//   Footer: "Powered by AskBiz" (static)
// This is what actually looks like a store receipt (itemized, branded) —
// text templates can't do that (Meta rejects a body that's mostly one big
// free-text variable, tried several variants, all came back
// REJECTED/INVALID_FORMAT).
//
// Falls back to "askbiz_receipt" (Utility, approved 2026-07-24 — a short
// payment-confirmation with amount/business/date/payment-method as four
// small parameters) if the image template send fails for any reason —
// most likely because it's still in Meta's review queue. Once approved,
// sends succeed on the image attempt automatically, no code change needed.
export interface ReceiptSummary {
  total: string
  businessName: string
  date: string
  paymentType: string
  imageUrl: string
}

async function sendReceiptImage(phone: string, receipt: ReceiptSummary, lang: string, dialHint?: string): Promise<{ ok: boolean; error?: string }> {
  const numId = phoneId()
  const template = process.env.META_RECEIPT_IMAGE_TEMPLATE || 'askbiz_receipt_image'

  const res = await fetch(`${BASE}/${numId}/messages`, {
    method:  'POST',
    headers: headers(),
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to:   normalisePhone(phone, dialHint),
      type: 'template',
      template: {
        name:     template,
        language: { code: lang },
        components: [
          { type: 'header', parameters: [{ type: 'image', image: { link: receipt.imageUrl } }] },
          { type: 'body',   parameters: [{ type: 'text', text: receipt.businessName }] },
        ],
      },
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return { ok: false, error: err?.error?.message || `Meta API error ${res.status}` }
  }
  return { ok: true }
}

export async function sendReceipt(phone: string, receipt: ReceiptSummary, dialHint?: string): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.META_WHATSAPP_TOKEN
  const numId = phoneId()
  if (!token || !numId) return { ok: false, error: 'Meta WhatsApp not configured' }

  const lang = process.env.META_TEMPLATE_LANG || 'en_GB'

  // TEMPORARY DIAGNOSTIC (2026-07-27): skip the image-template attempt and go
  // straight to the plain-text template. The image template just started
  // getting accepted by Meta on the first try (previously it was rejected as
  // "pending review", silently falling back to text every time) — testing
  // whether the image template is actually failing to *deliver* after
  // Meta accepts it, vs. the text template which reportedly was delivering
  // fine before. Revert once confirmed either way.
  const skipImageTemplate = true
  const imageResult = skipImageTemplate
    ? { ok: false, error: 'skipped for diagnostic' }
    : await sendReceiptImage(phone, receipt, lang, dialHint)
  if (imageResult.ok) return imageResult
  if (!skipImageTemplate) console.error('[whatsapp] sendReceipt image template failed, falling back to text summary:', imageResult.error)

  const template = process.env.META_RECEIPT_TEMPLATE || 'askbiz_receipt'

  const res = await fetch(`${BASE}/${numId}/messages`, {
    method:  'POST',
    headers: headers(),
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to:   normalisePhone(phone, dialHint),
      type: 'template',
      template: {
        name:     template,
        language: { code: lang },
        components: [{
          type:       'body',
          parameters: [
            { type: 'text', text: receipt.total },
            { type: 'text', text: receipt.businessName },
            { type: 'text', text: receipt.date },
            { type: 'text', text: receipt.paymentType },
          ],
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

// ── Send a purchase order to a supplier via utility template ────────────────
// Template "askbiz_purchase_order" should be:
//   Category: Utility
//   Body:     "{{1}}"   ← single variable containing the full PO text
//
// Until this template is approved in Meta Business Manager, callers fall back
// to a wa.me link (see /api/pos/purchase-orders/[id]/send).
export async function sendPurchaseOrder(phone: string, poText: string): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.META_WHATSAPP_TOKEN
  const numId = phoneId()
  if (!token || !numId) return { ok: false, error: 'Meta WhatsApp not configured' }

  const template = process.env.META_PO_TEMPLATE   || 'askbiz_purchase_order'
  const lang     = process.env.META_TEMPLATE_LANG || 'en_GB'

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
          parameters: [{ type: 'text', text: poText }],
        }],
      },
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const msg = err?.error?.message || `Meta API error ${res.status}`
    console.error('[whatsapp] sendPurchaseOrder failed:', msg)
    return { ok: false, error: msg }
  }

  return { ok: true }
}

// Build a click-to-chat wa.me link with prefilled text — the fallback that
// works with no approved template and no prior conversation with the supplier.
export function waLink(phone: string, text: string): string {
  return `https://wa.me/${normalisePhone(phone)}?text=${encodeURIComponent(text)}`
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
