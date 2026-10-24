// Provider notes (verified live 2026-10-24):
// - 'gemini-flash-latest' now resolves to gemini-3.8-flash, which is under heavy demand:
//   requests hang for 30s+ or return 503, and it ignores thinkingBudget (thinking tokens
//   eat the whole maxOutputTokens, leaving empty text). Nothing in the app timed out, so
//   scans just sat there and then failed. 'gemini-3.1-flash-lite' answers in ~2s with no
//   thinking tokens, so it is primary and the alias is only a fallback.
// - Dated models like 'gemini-2.5-flash' 404 ("no longer available to new users") on this key.
// - Groq's 'qwen/qwen3.6-27b' vision model no longer exists (404 model_not_found), so the
//   Groq fallback was removed rather than burning a round-trip on every failover.
// - The Anthropic key currently returns "credit balance is too low", so Haiku is a
//   fallback in name only until the account is topped up.
const GEMINI_MODELS     = ['gemini-3.1-flash-lite', 'gemini-flash-latest']
const HAIKU_MODEL       = 'claude-haiku-4-5-20251001'
const PROVIDER_TIMEOUT_MS = 12_000

export interface VisionResult {
  text:  string
  model: string
  usage: { input_tokens: number; output_tokens: number }
}

/**
 * Runs a vision prompt against an image.
 * Tries each Gemini model in GEMINI_MODELS, then Claude Haiku. Every call has a hard
 * timeout so a hung provider fails over instead of leaving the cashier waiting.
 */
export async function visionAI(
  image: string,
  prompt: string,
  maxTokens = 300,
): Promise<VisionResult> {
  const failures: string[] = []

  for (const model of GEMINI_MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
          body: JSON.stringify({
            contents: [{
              parts: [
                { inline_data: { mime_type: 'image/jpeg', data: image } },
                { text: prompt },
              ],
            }],
            // Thinking tokens count against maxOutputTokens; budget 1 is the closest to
            // "off" the API accepts (0 is rejected). Lite models don't think, so skip it.
            generationConfig: {
              maxOutputTokens: maxTokens,
              ...(model.includes('lite') ? {} : { thinkingConfig: { thinkingBudget: 1 } }),
            },
          }),
        },
      )
      if (!res.ok) {
        const body = await res.text().catch(() => '<unreadable body>')
        console.error(`[vision-ai] ${model} failed: ${res.status} — ${body.slice(0, 300)}`)
        failures.push(`${model} ${res.status}`)
        continue
      }
      const data = await res.json()
      const text = (data.candidates?.[0]?.content?.parts || [])
        .filter((p: any) => !p.thought && typeof p.text === 'string')
        .map((p: any) => p.text)
        .join('')
      if (text) {
        return {
          text,
          model,
          usage: {
            input_tokens:  data.usageMetadata?.promptTokenCount ?? 0,
            output_tokens: data.usageMetadata?.candidatesTokenCount ?? 0,
          },
        }
      }
      // 2xx with no text: cut off by thinking tokens or safety-filtered.
      console.error(`[vision-ai] ${model} returned empty text:`, JSON.stringify(data).slice(0, 500))
      failures.push(`${model} empty`)
    } catch (err: any) {
      console.error(`[vision-ai] ${model} threw:`, err?.name, err?.message)
      failures.push(`${model} ${err?.name === 'TimeoutError' ? 'timeout' : 'error'}`)
    }
  }

  // Last resort: Claude Haiku
  try {
    const haikuRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
      body: JSON.stringify({
        model: HAIKU_MODEL,
        max_tokens: maxTokens,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: image } },
            { type: 'text', text: prompt },
          ],
        }],
      }),
    })
    const haikuData = await haikuRes.json()
    if (haikuRes.ok) {
      return {
        text:  haikuData.content?.[0]?.text || '',
        model: HAIKU_MODEL,
        usage: { input_tokens: haikuData.usage?.input_tokens ?? 0, output_tokens: haikuData.usage?.output_tokens ?? 0 },
      }
    }
    console.error(`[vision-ai] Claude Haiku fallback failed: ${haikuRes.status} —`, JSON.stringify(haikuData))
    failures.push(`haiku ${haikuRes.status}`)
  } catch (err: any) {
    console.error('[vision-ai] Claude Haiku threw:', err?.name, err?.message)
    failures.push('haiku error')
  }

  // Surface a real error so routes return a proper 5xx instead of "could not identify".
  throw new Error(`Vision providers unavailable (${failures.join(', ')})`)
}
