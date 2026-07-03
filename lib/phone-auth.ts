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

export const PHONE_PIN_MAX_ATTEMPTS = 5
export const PHONE_PIN_LOCKOUT_MS = 15 * 60 * 1000
