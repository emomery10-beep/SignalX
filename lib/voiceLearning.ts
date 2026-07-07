// Shared normalization for the voice-nav learning cache. Both the fast-path
// lookup (app/api/voice-nav/route.ts) and the confirm-write path
// (app/api/voice-nav/confirm/route.ts) MUST use this exact function so the
// same spoken phrase always produces the same lookup/storage key.
//
// Input is always the ALREADY-SANITIZED transcript (post sanitizeTranscript()
// in the calling route) -- this function only does further normalization for
// cache-key purposes, not the security-relevant character stripping that
// sanitizeTranscript already performs.

const MAX_PHRASE_KEY_LENGTH = 200 // matches the transcript length cap enforced in app/api/voice-nav/route.ts

export function normalizePhrase(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')          // collapse internal whitespace runs to a single space
    .replace(/[.,!?'"-]+$/g, '')   // strip trailing punctuation (repeated, e.g. "...", "?!")
    .trim()                        // re-trim in case punctuation-stripping exposed trailing space
    .slice(0, MAX_PHRASE_KEY_LENGTH)
}
