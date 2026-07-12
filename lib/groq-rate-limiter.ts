// Shared token-bucket limiter for Groq's per-minute token cap.
// Module-level state persists for the lifetime of one serverless
// invocation, which is exactly the scope we need: several agent
// requests fire concurrently within a single blog-scout run and must
// coordinate against the same rolling 60s window rather than each
// guessing an independent fixed delay.

const usageLog: { ts: number; tokens: number }[] = []

const WINDOW_MS = 60_000

/**
 * Blocks until issuing a call for `estimatedTokens` would keep the
 * trailing-60s total at or under `limit`, then records the usage.
 * Call this immediately before every Groq request (initial + retries).
 *
 * Default matches this account's actual TPM cap for llama-3.1-8b-instant
 * on the on-demand tier (Groq reports "Limit 6000" in 413 bodies) minus a
 * safety margin — the previous 11_000 default was a stale guess from a
 * higher-tier account and let every call fire uncapped, since a single
 * oversized request can't be fixed by pacing alone.
 */
// Bounds a single call's total wait so a busy budget fails fast with a
// clear error instead of stalling past the route's maxDuration (800s) and
// getting killed by the platform with no response ever reaching the
// client — that silent kill is what left the admin UI frozen on "scanning"
// forever. 150s leaves room for several calls to each wait once and still
// fit inside the function's time budget.
const MAX_WAIT_MS = 150_000

export async function waitForGroqBudget(estimatedTokens: number, limit = 5_500): Promise<void> {
  const start = Date.now()
  for (;;) {
    const now = Date.now()
    // Drop entries outside the rolling window
    while (usageLog.length && now - usageLog[0].ts > WINDOW_MS) usageLog.shift()

    const used = usageLog.reduce((sum, e) => sum + e.tokens, 0)
    if (used + estimatedTokens <= limit || usageLog.length === 0) {
      usageLog.push({ ts: now, tokens: estimatedTokens })
      return
    }

    if (now - start >= MAX_WAIT_MS) {
      throw new Error(`Groq rate-limit budget still full after ${Math.round(MAX_WAIT_MS / 1000)}s — giving up instead of stalling past the function timeout`)
    }

    // Wait until the oldest entry falls out of the window, capped so we
    // never overshoot MAX_WAIT_MS on the final iteration.
    const waitMs = Math.max(1000, Math.min(WINDOW_MS - (now - usageLog[0].ts) + 500, MAX_WAIT_MS - (now - start)))
    await new Promise(res => setTimeout(res, waitMs))
  }
}

/**
 * Parses Groq's 429 body for its suggested retry-after seconds
 * (e.g. "Please try again in 41.75s") so a retry can honour it
 * instead of guessing.
 */
export function parseGroqRetryAfterMs(message: string): number | null {
  const m = message.match(/try again in ([\d.]+)s/i)
  if (!m) return null
  return Math.ceil(parseFloat(m[1]) * 1000) + 500
}
