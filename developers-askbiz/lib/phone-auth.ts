// Mirrors lib/phone-auth.ts in the main app — same synthetic-email scheme,
// so a phone+PIN session created here is a real Supabase session against
// the same auth.users row as askbiz.co.
const PHONE_AUTH_EMAIL_DOMAIN = 'phone.askbiz.internal'

export function phoneToSyntheticEmail(e164: string): string {
  return `${e164.replace(/^\+/, '')}@${PHONE_AUTH_EMAIL_DOMAIN}`
}

export function isValidPin(pin: string): boolean {
  return /^\d{4}$/.test(pin)
}
