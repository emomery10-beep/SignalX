// Shared session-lock helpers for the root app's POS staff pages (/sell, /inventory).
// Staff log in with a phone/email + PIN and the session is kept in
// localStorage['pos_staff'] — unlike the main Supabase Auth session, it never
// expired. This adds a 24h lock: after that long, the PIN must be re-entered
// (not a full sign-out) to keep using the till without losing cart/session state.

export const POS_STAFF_LOCK_MS = 24 * 60 * 60 * 1000

export type PosStaffIdentifier = { email: string } | { phone: string; dial: string }

const SESSION_KEY = 'pos_staff'
const IDENTIFIER_KEY = 'pos_staff_identifier'
const UNLOCKED_AT_KEY = 'pos_staff_unlocked_at'

export function savePosStaffSession(staff: unknown, identifier: PosStaffIdentifier) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(staff))
  localStorage.setItem(IDENTIFIER_KEY, JSON.stringify(identifier))
  localStorage.setItem(UNLOCKED_AT_KEY, String(Date.now()))
}

export function clearPosStaffSession() {
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem(IDENTIFIER_KEY)
  localStorage.removeItem(UNLOCKED_AT_KEY)
}

// No recorded unlock time (e.g. a session created before this feature shipped)
// is treated as locked — the PIN gets re-confirmed once, then a fresh 24h clock starts.
export function isPosStaffLocked(): boolean {
  const unlockedAt = localStorage.getItem(UNLOCKED_AT_KEY)
  if (!unlockedAt) return true
  return Date.now() - Number(unlockedAt) > POS_STAFF_LOCK_MS
}

export function markPosStaffUnlocked() {
  localStorage.setItem(UNLOCKED_AT_KEY, String(Date.now()))
}

export function getPosStaffIdentifier(): PosStaffIdentifier | null {
  const raw = localStorage.getItem(IDENTIFIER_KEY)
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}
