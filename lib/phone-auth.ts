// Phone + PIN login rides on Supabase's real password auth: a phone number
// is mapped to a synthetic, never-emailed address, and the PIN is the
// password. This gives us real sessions/refresh tokens for free instead of
// building a parallel session system (see pos_staff's localStorage-blob
// model, which is fine for a shared cashier terminal but not for the main
// account holder).
const PHONE_AUTH_EMAIL_DOMAIN = 'phone.askbiz.internal'

export function phoneToSyntheticEmail(e164: string): string {
  return `${e164.replace(/^\+/, '')}@${PHONE_AUTH_EMAIL_DOMAIN}`
}

export function isValidPin(pin: string): boolean {
  return /^\d{4}$/.test(pin)
}

// Supabase Auth enforces a hard minimum password length of 6 characters —
// confirmed via the dashboard, which refuses to save anything lower — but
// this app's whole design is a 4-digit PIN as the password. This pads the
// PIN to a fixed 8-character string before it's ever sent to Supabase,
// applied identically at every place a PIN is set or checked, so the user
// only ever sees/types the raw 4-digit PIN. Accounts created before this
// existed still have the RAW pin as their actual stored password — see the
// signin fallback in app/api/auth/phone-pin/route.ts, which tries this
// padded form first and falls back to the raw pin so old accounts keep
// working without a migration that (being one-way hashed) isn't possible.
export function pinToPassword(pin: string): string {
  return `pin-${pin}`
}

export const PHONE_PIN_MAX_ATTEMPTS = 5
export const PHONE_PIN_LOCKOUT_MS = 15 * 60 * 1000
