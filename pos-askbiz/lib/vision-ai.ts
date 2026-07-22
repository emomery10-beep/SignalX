// NOTE: Groq decommissioned 'meta-llama/llama-4-scout-17b-16e-instruct' (announced
// 2026-06-17); it no longer appears in Groq's supported-models list at all, so every
// request against it now fails outright. 'qwen/qwen3.6-27b' is Groq's current
// vision-capable model (image + text input, JSON mode) as of 2026-07, but it's a
// preview model with a tight 8K-tokens-per-minute cap — a single realistic product
// photo call costs ~1.8-2K tokens, so back-to-back scans routinely 429. Gemini is
// the primary provider now; Groq and Haiku are fallbacks.
//
// 'gemini-2.5-flash' (and other dated Gemini models) return 404 "no longer available
// to new users" on this project's key — use the 'gemini-flash-latest' alias instead,
// which Google keeps pointed at a live model (currently resolves to gemini-3.6-flash)
// so it doesn't go stale the way a pinned dated model can.
const GEMINI_MODEL      = 'gemini-flash-latest'
const GROQ_VISION_MODEL = 'qwen/qwen3.6-27b'
const HAIKU_MODEL       = 'claude-haiku-4-5-20251001'

export interface VisionResult {
  text:  string
  model: string
  usage: { input_tokens: number; output_tokens: number }
}

/**
 * Runs a vision prompt against an image.
 * Primary: Gemini (gemini-flash-latest).
 * Fallback 1: Groq qwen3.6-27b, on any non-2xx response (inc. 429 rate-limit).
 * Fallback 2: Claude Haiku, if Groq also fails.
 */
export async function visionAI(
  image: string,
  prompt: string,
  maxTokens = 300,
): Promise<VisionResult> {
  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inline_data: { mime_type: 'image/jpeg', data: image } },
            { text: prompt },
          ],
        }],
        // thinkingBudget: 0 is rejected as invalid by this model; 1 is the effective
        // "off" — without it, extended thinking silently eats most of maxOutputTokens
        // (measured: 285 of a 300 cap) and truncates the JSON answer mid-string.
        generationConfig: { maxOutputTokens: maxTokens, thinkingConfig: { thinkingBudget: 1 } },
      }),
    }
  )

  if (geminiRes.ok) {
    const data = await geminiRes.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    if (text) {
      return {
        text,
        model: GEMINI_MODEL,
        usage: {
          input_tokens:  data.usageMetadata?.promptTokenCount ?? 0,
          output_tokens: data.usageMetadata?.candidatesTokenCount ?? 0,
        },
      }
    }
    // 2xx with no text usually means the response was cut off or safety-filtered —
    // log it and fall through to Groq rather than return an empty result.
    console.error('[vision-ai] Gemini returned empty text:', JSON.stringify(data).slice(0, 500))
  } else {
    const geminiErrBody = await geminiRes.text().catch(() => '<unreadable body>')
    console.error(`[vision-ai] Gemini vision call failed: ${geminiRes.status} ${geminiRes.statusText} — ${geminiErrBody}`)
  }

  // Fallback 1: Groq qwen3.6-27b
  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
    body: JSON.stringify({
      model: GROQ_VISION_MODEL,
      max_tokens: maxTokens,
      messages: [{
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${image}` } },
          { type: 'text', text: prompt },
        ],
      }],
    }),
  })

  if (groqRes.ok) {
    const data = await groqRes.json()
    return {
      text:  data.choices?.[0]?.message?.content || '',
      model: GROQ_VISION_MODEL,
      usage: { input_tokens: data.usage?.prompt_tokens ?? 0, output_tokens: data.usage?.completion_tokens ?? 0 },
    }
  }

  // Groq failed too — log the real reason server-side before falling back further,
  // so this is debuggable next time instead of just surfacing as a generic
  // "could not identify" to the cashier.
  const groqErrBody = await groqRes.text().catch(() => '<unreadable body>')
  console.error(`[vision-ai] Groq vision call failed: ${groqRes.status} ${groqRes.statusText} — ${groqErrBody}`)

  // Fallback 2: Claude Haiku
  const haikuRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
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

  if (!haikuRes.ok) {
    // Previously this fell through silently — .content?.[0]?.text on an error body
    // is always undefined, so it returned an empty string as if recognition simply
    // found nothing, masking auth/rate-limit/model errors as "could not identify
    // product". Log the real error and let the caller's catch block handle it
    // (routes already return a proper 5xx with a "temporarily unavailable" message).
    console.error(`[vision-ai] Claude Haiku fallback also failed: ${haikuRes.status} ${haikuRes.statusText} —`, JSON.stringify(haikuData))
    throw new Error(`Vision providers unavailable (gemini ${geminiRes.status}, groq ${groqRes.status}, haiku ${haikuRes.status})`)
  }

  return {
    text:  haikuData.content?.[0]?.text || '',
    model: HAIKU_MODEL,
    usage: { input_tokens: haikuData.usage?.input_tokens ?? 0, output_tokens: haikuData.usage?.output_tokens ?? 0 },
  }
}
