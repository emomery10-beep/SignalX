// Full session expiry for POS staff (pos.askbiz.co). Unlike the root app's
// PIN-relock, this is a hard sign-out — one shift's worth of time (10h),
// then the staff member has to log in again from scratch.

export const POS_SESSION_MAX_AGE_MS = 10 * 60 * 60 * 1000

const SESSION_KEY = 'pos_staff'
const STARTED_KEY = 'pos_staff_session_started'

export function markPosSessionStarted() {
  localStorage.setItem(STARTED_KEY, String(Date.now()))
}

export function clearPosSession() {
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem(STARTED_KEY)
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
