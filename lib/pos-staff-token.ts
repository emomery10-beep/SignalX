// Signed session token for PIN-authenticated POS staff.
//
// Before this, a staff "session" was two bare UUIDs (x-staff-id + x-owner-id): anyone who learned a
// colleague's id (the staff list and every capture's approved_by_staff return them) could call the API
// as that colleague. The token is issued only after a correct PIN and is checked on every request.
//
// Format: v1.<base64url payload>.<base64url HMAC-SHA256>. The payload carries ids and an expiry only —
// role, active status and location are always re-read from the database, so a deactivated or demoted
// staff member loses access on their next request. `pv` is a short stamp of the staff member's current
// pin_hash, so changing a PIN revokes every token issued under the old one (no extra column needed).
//
// Secret: POS_STAFF_TOKEN_SECRET, the SAME value in both Vercel projects. Without it no token is issued
// and none can be verified, which leaves the legacy header behaviour untouched.
//
// NOTE: identical copy lives in lib/pos-staff-token.ts (root app) — the two apps are deployed
// separately. Change both together.
import { createHash, createHmac, timingSafeEqual } from 'crypto'

export const STAFF_TOKEN_HEADER = 'x-staff-token'
export const STAFF_TOKEN_TTL_MS = 14 * 24 * 3600 * 1000 // 14 days: offline factory floors replay queued writes late

export interface StaffTokenClaims { staffId: string; ownerId: string; pv: string; exp: number }

const b64u = (b: Buffer) => b.toString('base64url')

function secret(): string | null {
  const s = process.env.POS_STAFF_TOKEN_SECRET
  return s && s.length >= 32 ? s : null
}

/** True once the secret is configured, i.e. tokens can be issued and verified. */
export function staffTokensEnabled(): boolean { return secret() !== null }

/** When set to '1' (and the secret exists), bare x-staff-id/x-owner-id headers stop being accepted. */
export function staffTokenRequired(): boolean {
  return process.env.POS_REQUIRE_STAFF_TOKEN === '1' && staffTokensEnabled()
}

/** Short stamp of the current PIN hash; changes whenever the PIN changes. */
export function pinStamp(pinHash: string | null | undefined): string {
  return createHash('sha256').update(String(pinHash || '')).digest('hex').slice(0, 16)
}

function sign(body: string, key: string): string {
  return b64u(createHmac('sha256', key).update(body).digest())
}

export function signStaffToken(
  p: { staffId: string; ownerId: string; pinHash: string | null | undefined },
  now: number = Date.now(),
): string | null {
  const key = secret()
  if (!key) return null
  const claims: StaffTokenClaims = { staffId: p.staffId, ownerId: p.ownerId, pv: pinStamp(p.pinHash), exp: now + STAFF_TOKEN_TTL_MS }
  const body = b64u(Buffer.from(JSON.stringify(claims)))
  return `v1.${body}.${sign(body, key)}`
}

/** Returns the claims for a genuine, unexpired token, else null. Never throws. */
export function verifyStaffToken(token: string | null | undefined, now: number = Date.now()): StaffTokenClaims | null {
  const key = secret()
  if (!key || !token) return null
  const parts = token.split('.')
  if (parts.length !== 3 || parts[0] !== 'v1') return null
  try {
    const expected = Buffer.from(sign(parts[1], key))
    const given = Buffer.from(parts[2])
    if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null
    const c = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8')) as Partial<StaffTokenClaims>
    if (typeof c.staffId !== 'string' || typeof c.ownerId !== 'string' || typeof c.pv !== 'string' || typeof c.exp !== 'number') return null
    if (c.exp <= now) return null
    return c as StaffTokenClaims
  } catch {
    return null
  }
}
