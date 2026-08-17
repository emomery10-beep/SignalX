// Untrusted-text helpers. Two separate jobs — don't mix them up:
//
//   escapeHtml / formatInlineHtml  → OUTPUT side. Use at every
//     dangerouslySetInnerHTML sink that carries anything a user or the model
//     produced. This is the layer that actually stops XSS.
//   sanitizeText / sanitizeName    → INPUT side. Keeps markup out of stored
//     names so they can't be smuggled into a sink we add later (or into a
//     downstream consumer we don't control, e.g. an email client or a CSV).
//
// Written after a blind-XSS probe (2026-08-15, jake@0x01.pk) signed up with
// `<img src onerror=import("//…")>` in every name field it could reach. React's
// JSX escaping meant nothing executed in the admin panel, but the audit that
// followed found /api/share accepted arbitrary HTML from the client and the
// public /insight/[id] page rendered it raw — a real stored-XSS path.

const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

/** Escape the five HTML-significant characters. Ampersand first, always. */
export function escapeHtml(input: unknown): string {
  return String(input ?? '').replace(/[&<>"']/g, c => HTML_ENTITIES[c])
}

/**
 * Render model/user prose as HTML: escape everything first, THEN apply the
 * small formatting vocabulary we support (**bold**, newlines). Order matters —
 * escaping after the replace would destroy our own tags, and escaping the
 * whole thing but skipping the replace loses the formatting we intend.
 *
 * `boldColor` matches the per-surface accent the sinks already used.
 */
export function formatInlineHtml(input: unknown, boldColor = '#47e2da', boldWeight = 500): string {
  return escapeHtml(input)
    .replace(/\*\*(.*?)\*\*/g, `<strong style="color:${boldColor};font-weight:${boldWeight}">$1</strong>`)
    .replace(/\n/g, '<br/>')
}

/**
 * Cap a prose value and drop the invisible characters a payload can hide
 * inside. Deliberately KEEPS angle brackets: prose legitimately contains them
 * ("products selling < 10 units/week"), and prose is rendered as escaped JSX
 * text, so escaping \u2014 not stripping \u2014 is what makes it safe. Use this for
 * anything a human wrote as a sentence.
 */
export function capText(input: unknown, maxLen = 2_000): string {
  return String(input ?? '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\u200B-\u200F\u2028\u2029\uFEFF]/g, '')
    .trim()
    .slice(0, maxLen)
}

/**
 * Normalise a stored *name-like* value: drop control characters (they let a
 * payload hide from an eyeball review), drop the characters that start markup,
 * collapse whitespace, and cap the length.
 *
 * Only for fields where markup is never legitimate \u2014 a person's name, a
 * business name, a town. For sentences use capText, which keeps the content
 * intact and relies on escaping at the render site.
 *
 * Deliberately strips rather than rejects: failing a signup on a character the
 * user cannot even see is worse than quietly dropping it.
 */
export function sanitizeText(input: unknown, maxLen = 300): string {
  return String(input ?? '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F\x7F-\x9F\u200B-\u200F\u2028\u2029\uFEFF]/g, '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen)
}

/** A person's or business's name. Same rules, tighter cap. */
export function sanitizeName(input: unknown, maxLen = 120): string {
  return sanitizeText(input, maxLen)
}

/**
 * A user-supplied URL that will end up in an href or src. Returns null unless
 * it parses and is http(s) — which is what keeps `javascript:` and `data:`
 * out of the admin panel's outbound links.
 */
export function safeExternalUrl(input: unknown): string | null {
  const raw = String(input ?? '').trim()
  if (!raw) return null
  try {
    const url = new URL(raw)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : null
  } catch {
    return null
  }
}

/**
 * Neutralise spreadsheet formula injection: Excel/Sheets execute a cell that
 * starts with = + - @ (or tab/CR, which they treat as leading whitespace).
 * Prefix with an apostrophe so the value stays visible but inert.
 */
export function sanitizeCsvCell(input: unknown): string {
  const value = String(input ?? '')
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value
}
