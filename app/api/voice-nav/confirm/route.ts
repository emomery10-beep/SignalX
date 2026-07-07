import { NextRequest, NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { VALID_ROUTE_PATHS } from '@/lib/voiceRoutes'
import { normalizePhrase } from '@/lib/voiceLearning'
import { createServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const SUPPORTED_LANGUAGES = ['en', 'fr', 'es', 'nl', 'de', 'sw'] as const

// Separate rate-limit bucket from /api/voice-nav's 'voice-nav' prefix. This
// matters: a client probing/abusing the classify endpoint shouldn't be able
// to spend its confirm-endpoint budget on classify calls or vice versa --
// classify costs Groq tokens, confirm costs the SHARED cache's integrity,
// and they should exhaust independently.
const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: new Redis({
          url: process.env.UPSTASH_REDIS_REST_URL,
          token: process.env.UPSTASH_REDIS_REST_TOKEN,
        }),
        limiter: Ratelimit.slidingWindow(10, '1 m'),
        prefix: 'voice-nav-confirm',
      })
    : null

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'unknown'
}

function sanitizeTranscript(raw: string): string {
  return raw.replace(/[^\p{L}\p{N}\s.,!?'-]/gu, '').trim()
}

export async function POST(request: NextRequest) {
  if (process.env.VOICE_NAV_ENABLED !== 'true') {
    return NextResponse.json({ error: 'Voice navigation is disabled' }, { status: 503 })
  }

  const ip = getClientIp(request)
  if (ratelimit) {
    const { success } = await ratelimit.limit(ip)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { transcript, route, language } = (body ?? {}) as {
    transcript?: unknown
    route?: unknown
    language?: unknown
  }

  if (typeof transcript !== 'string' || transcript.trim().length === 0 || transcript.length > 200) {
    return NextResponse.json({ error: 'transcript is required' }, { status: 400 })
  }
  // Defense in depth: never trust the client's claimed route blindly.
  if (typeof route !== 'string' || !VALID_ROUTE_PATHS.includes(route)) {
    return NextResponse.json({ error: 'Route not recognized' }, { status: 400 })
  }
  if (typeof language !== 'string' || !SUPPORTED_LANGUAGES.includes(language as (typeof SUPPORTED_LANGUAGES)[number])) {
    return NextResponse.json({ error: 'Language not recognized' }, { status: 400 })
  }

  const cleanTranscript = sanitizeTranscript(transcript)
  if (!cleanTranscript) {
    return NextResponse.json({ error: 'transcript invalid' }, { status: 400 })
  }
  const phraseKey = normalizePhrase(cleanTranscript)
  if (!phraseKey) {
    return NextResponse.json({ error: 'transcript invalid' }, { status: 400 })
  }

  try {
    const supabase = createServiceClient()
    const { error } = await supabase.rpc('upsert_voice_nav_learned_phrase', {
      p_phrase_key: phraseKey,
      p_language: language,
      p_route: route,
    })
    if (error) throw error
  } catch (err) {
    console.error('voice-nav-confirm: upsert failed', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Unable to record confirmation' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
