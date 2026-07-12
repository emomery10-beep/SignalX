// Full session expiry for POS staff (pos.askbiz.co). Unlike the root app's
// PIN-relock, this is a hard sign-out — one shift's worth of time (10h),
// then the staff member has to log in again from scratch.

export const POS_SESSION_MAX_AGE_MS = 10 * 60 * 60 * 1000

const SESSION_KEY = 'pos_staff'
const STARTED_KEY = 'pos_staff_session_started'
// A PIN staff session lives only in localStorage, which the edge middleware
// can't see. This lightweight cookie mirrors "a session exists" so the gate
// can redirect people with NO session to the login. It is NOT a security
// boundary — every /api/pos/* route still validates the real session — just a
// firm front door. Value is meaningless (anyone could forge it and still get
// 401s from the API); presence is all the gate checks.
export const POS_SESSION_COOKIE = 'pos_session'

export function ensurePosSessionCookie() {
  if (typeof document === 'undefined') return
  document.cookie = `${POS_SESSION_COOKIE}=1; path=/; max-age=${POS_SESSION_MAX_AGE_MS / 1000}; SameSite=Lax`
}

function clearPosSessionCookie() {
  if (typeof document === 'undefined') return
  document.cookie = `${POS_SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`
}

export function markPosSessionStarted() {
  localStorage.setItem(STARTED_KEY, String(Date.now()))
  ensurePosSessionCookie()
}

export function clearPosSession() {
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem(STARTED_KEY)
  clearPosSessionCookie()
}

// No recorded start time (e.g. a session created before this feature shipped)
// is treated as starting now, not as already expired — avoids mass-logging
// out everyone mid-shift the moment this ships.
export function isPosSessionExpired(): boolean {
  const startedAt = localStorage.getItem(STARTED_KEY)
  if (!startedAt) {
    markPosSessionStarted()
    return false
  }
  return Date.now() - Number(startedAt) > POS_SESSION_MAX_AGE_MS
}
