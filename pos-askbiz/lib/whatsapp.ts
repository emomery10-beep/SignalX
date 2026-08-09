// ── Meta WhatsApp Cloud API helper ──────────────────────────────────────────
// Docs: https://developers.facebook.com/docs/whatsapp/cloud-api/messages
//
// Required env vars:
//   META_WHATSAPP_TOKEN      — permanent System User access token
//   META_PHONE_NUMBER_ID     — the phone number ID (not the number itself)
//
// Template env vars (configure names to match what you created in Meta Business Manager):
//   META_OTP_TEMPLATE            — default: "askbiz_otp"
//   META_RECEIPT_TEMPLATE        — default: "askbiz_receipt"
//   META_RECEIPT_TEMPLATE_VERSION — set to "2" once askbiz_receipt_v2 is approved
//                                    (see docs/whatsapp-receipt-template.md) to send
//                                    the richer 6-param body instead of the legacy 4.
//   META_TEMPLATE_LANG           — default: "en_GB"

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

// ── Send receipt: text-only (image template disabled — see below) ──────────
// Template "askbiz_receipt_image" (Utility) was meant to send a branded,
// itemized receipt image as the template header, falling back to the plain
// text template "askbiz_receipt" if Meta's API rejected the send (e.g. while
// the image template was still pending review). That fallback logic only
// triggers on an explicit API error — but once Meta approved the image
// template (on/around 2026-07-27), it started returning 200 OK for the send
// while the message never actually reached the recipient. Confirmed live,
// same day: disabling the image attempt and going straight to the text
// template restored real delivery. Root cause on Meta's side not diagnosed
// (something about the dynamic image header, most likely) — investigate via
// Meta Business Manager's WhatsApp Manager message log before re-enabling
// sendReceiptImage below.
//
// Superseded 2026-08-09: rather than re-fighting the image-header bug, the
// v2 text template (see sendReceipt below) links to the same itemised image
// as a plain URL in the body instead of attaching it as media — a link is
// far more reliable than an inline media header and needs no Meta-side
// investigation. sendReceiptImage is left here only as dead code / a record
// of what didn't work; there's no plan to re-enable it.
export interface ReceiptSummary {
  total: string
  businessName: string
  date: string
  paymentType: string
  imageUrl: string
  receiptNo: string
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

// v2 adds a receipt number and a link to the full itemised receipt image
// (see app/api/pos/receipt/[id]/image/route.tsx — the zigzag-edge, VAT,
// barcode design) directly in the body text, since a plain URL substituted
// into a body parameter still renders as a tappable link — no template
// button component needed. It does NOT add any promotional or third-party
// ad content: Meta's WhatsApp Business Messaging Policy requires Utility
// templates to be "non-promotional, not containing any promotional or
// persuasive intent" (order-management/account-alert templates specifically
// "should not promote, recommend, upsell, or cross-sell products; include
// offers"), and since April 2025 Meta auto-reclassifies any utility template
// that trips this as Marketing — pricier, requires separate marketing
// opt-in, and every merchant on this platform sends through the ONE shared
// META_PHONE_NUMBER_ID, so a policy strike here risks messaging quality for
// every shop, not just one. See docs/whatsapp-receipt-template.md.
//
// This is opt-in via env flag so a deploy can't silently break production:
// askbiz_receipt (v1, live) expects exactly 4 body params. Sending 6 params
// against a 4-placeholder template fails the whole send. Only flip
// META_RECEIPT_TEMPLATE_VERSION=2 (alongside META_RECEIPT_TEMPLATE pointing
// at the new template's name) once the v2 template is approved in WhatsApp
// Manager — see the doc for the exact template text to submit.
export async function sendReceipt(phone: string, receipt: ReceiptSummary, dialHint?: string): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.META_WHATSAPP_TOKEN
  const numId = phoneId()
  if (!token || !numId) return { ok: false, error: 'Meta WhatsApp not configured' }

  const lang = process.env.META_TEMPLATE_LANG || 'en_GB'
  const template = process.env.META_RECEIPT_TEMPLATE || 'askbiz_receipt'
  const useV2 = process.env.META_RECEIPT_TEMPLATE_VERSION === '2'

  // Capitalization is applied here, scoped to the v2 branch only — v1's
  // parameters below are untouched, byte-for-byte identical to before this
  // whole feature existed, so the currently-live template can't be affected
  // by a v2-only formatting choice. (Previously this was applied at the
  // call site in receipt/route.ts, shared by both branches — that leaked
  // "cash" -> "Cash" into the live v1 receipt before any template was even
  // approved, breaking the "ships inert" guarantee. Fixed 2026-08-09.)
  const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

  const parameters = useV2
    ? [
        { type: 'text', text: receipt.businessName },
        { type: 'text', text: receipt.receiptNo },
        { type: 'text', text: receipt.date },
        { type: 'text', text: receipt.total },
        { type: 'text', text: titleCase(receipt.paymentType) },
        { type: 'text', text: receipt.imageUrl },
      ]
    : [
        { type: 'text', text: receipt.total },
        { type: 'text', text: receipt.businessName },
        { type: 'text', text: receipt.date },
        { type: 'text', text: receipt.paymentType },
      ]

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
        components: [{ type: 'body', parameters }],
      },
    }),
  })

  const body = await res.json().catch(() => ({}))

  if (!res.ok) {
    const msg = body?.error?.message || `Meta API error ${res.status}`
    console.error('[whatsapp] sendReceipt failed:', msg)
    return { ok: false, error: msg }
  }

  // Meta's 200 OK only means the message was accepted for delivery, not that
  // it arrived (see normalisePhone above + 2026-07-27/29 non-delivery
  // incidents). Log the message id and status so a delivery report can be
  // cross-referenced in Meta Business Manager's WhatsApp Manager message log,
  // since there's no delivery-status webhook wired up yet.
  console.log('[whatsapp] sendReceipt accepted:', JSON.stringify({
    to: normalisePhone(phone, dialHint),
    messageId: body?.messages?.[0]?.id,
    messageStatus: body?.messages?.[0]?.message_status,
    contactWaId: body?.contacts?.[0]?.wa_id,
  }))

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

// ── Send a generic notification (repair status, inventory/cash/tax alerts) ──
// Template "askbiz_notification" should be:
//   Category: Utility
//   Body:     "{{1}}"   ← single variable containing the full composed message
//
// Mirrors sendPurchaseOrder's single-variable-body pattern: notification copy
// varies a lot by type (service_intake, service_ready, service_quote,
// service_collected, service_warranty, inventory_alert, etc — see
// buildMessage() in app/api/pos/notifications/send/route.ts) so one utility
// template with a single free-text body covers all of them without needing a
// separate Meta-approved template per notification type. Until this template
// is approved in Meta Business Manager, sends will fail with a clear Meta API
// error (no silent fallback here — callers fall back to email where the
// notification settings allow it).
export async function sendNotification(phone: string, message: string, dialHint?: string): Promise<{ ok: boolean; error?: string; messageId?: string }> {
  const token = process.env.META_WHATSAPP_TOKEN
  const numId = phoneId()
  if (!token || !numId) return { ok: false, error: 'Meta WhatsApp not configured (META_WHATSAPP_TOKEN / META_PHONE_NUMBER_ID missing)' }

  const template = process.env.META_NOTIFICATION_TEMPLATE || 'askbiz_notification'
  const lang     = process.env.META_TEMPLATE_LANG || 'en_GB'

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
          parameters: [{ type: 'text', text: message }],
        }],
      },
    }),
  })

  const body = await res.json().catch(() => ({}))

  if (!res.ok) {
    const msg = body?.error?.message || `Meta API error ${res.status}`
    console.error('[whatsapp] sendNotification failed:', msg)
    return { ok: false, error: msg }
  }

  // Same accept-vs-delivered caveat as sendReceipt: a 200 here only means
  // Meta accepted the message, not that it arrived. Log the id/status so it
  // can be cross-referenced in WhatsApp Manager's message log.
  console.log('[whatsapp] sendNotification accepted:', JSON.stringify({
    to: normalisePhone(phone, dialHint),
    messageId: body?.messages?.[0]?.id,
    messageStatus: body?.messages?.[0]?.message_status,
    contactWaId: body?.contacts?.[0]?.wa_id,
  }))

  return { ok: true, messageId: body?.messages?.[0]?.id }
}

// ── Send a repair photo update, link via a URL BUTTON not body text ────────
// Template "askbiz_photo_update" should be:
//   Category: Utility
//   Body:     "Hi {{1}}, here's a photo update on your repair (ticket {{2}})."
//   Button:   URL type, base "https://pos.askbiz.co/repair/photos/",
//             dynamic suffix {{1}} (the job id)
//
// Confirmed live 2026-08-09: a raw URL substituted into a body TEXT
// parameter is rejected by Meta ("(#132018) There's an issue with the
// parameters in your template") — Meta explicitly disallows full URLs in
// body placeholders for anti-phishing/quality reasons (this is why
// sendReceipt's v2 body-param link, above, is also expected to fail once
// that template is actually submitted/used — flagged, not fixed here,
// that's a different in-flight change). A URL BUTTON component's dynamic
// suffix parameter is the Meta-sanctioned mechanism for a per-send dynamic
// link — same pattern sendOTP already uses for its "Copy code" button.
export async function sendPhotoUpdate(phone: string, customerName: string, ticketNumber: string, jobId: string, dialHint?: string): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.META_WHATSAPP_TOKEN
  const numId = phoneId()
  if (!token || !numId) return { ok: false, error: 'Meta WhatsApp not configured' }

  const template = process.env.META_PHOTO_UPDATE_TEMPLATE || 'askbiz_photo_update'
  const lang     = process.env.META_TEMPLATE_LANG || 'en_GB'

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
          { type: 'body', parameters: [{ type: 'text', text: customerName }, { type: 'text', text: ticketNumber }] },
          { type: 'button', sub_type: 'url', index: '0', parameters: [{ type: 'text', text: jobId }] },
        ],
      },
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const msg = err?.error?.message || `Meta API error ${res.status}`
    console.error('[whatsapp] sendPhotoUpdate failed:', msg)
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
