// NOTE: Groq decommissioned 'meta-llama/llama-4-scout-17b-16e-instruct' (announced
// 2026-06-17); it no longer appears in Groq's supported-models list at all, so every
// request against it now fails outright. 'qwen/qwen3.6-27b' is Groq's current
// vision-capable model (image + text input, JSON mode) as of 2026-07.
const GROQ_VISION_MODEL = 'qwen/qwen3.6-27b'
const HAIKU_MODEL       = 'claude-haiku-4-5-20251001'

export interface VisionResult {
  text:  string
  model: string
  usage: { input_tokens: number; output_tokens: number }
}

/**
 * Runs a vision prompt against an image.
 * Primary: Groq qwen3.6-27b.
 * Fallback: Claude Haiku on any non-2xx response (inc. 429 rate-limit).
 */
export async function visionAI(
  image: string,
  prompt: string,
  maxTokens = 300,
): Promise<VisionResult> {
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

  // Groq failed — log the real reason server-side (never exposed to the end user)
  // before silently falling back, so this is debuggable next time instead of just
  // surfacing as a generic "could not identify" to the cashier.
  const groqErrBody = await groqRes.text().catch(() => '<unreadable body>')
  console.error(`[vision-ai] Groq vision call failed: ${groqRes.status} ${groqRes.statusText} — ${groqErrBody}`)

  // Fallback to Claude Haiku
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
    throw new Error(`Vision providers unavailable (groq ${groqRes.status}, haiku ${haikuRes.status})`)
  }

  return {
    text:  haikuData.content?.[0]?.text || '',
    model: HAIKU_MODEL,
    usage: { input_tokens: haikuData.usage?.input_tokens ?? 0, output_tokens: haikuData.usage?.output_tokens ?? 0 },
  }
}
