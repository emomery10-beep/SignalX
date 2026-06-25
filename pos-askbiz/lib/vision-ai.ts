const GROQ_VISION_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct'
const HAIKU_MODEL       = 'claude-haiku-4-5-20251001'

export interface VisionResult {
  text:  string
  model: string
  usage: { input_tokens: number; output_tokens: number }
}

/**
 * Runs a vision prompt against an image.
 * Primary: Groq llama-4-scout.
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
  return {
    text:  haikuData.content?.[0]?.text || '',
    model: HAIKU_MODEL,
    usage: { input_tokens: haikuData.usage?.input_tokens ?? 0, output_tokens: haikuData.usage?.output_tokens ?? 0 },
  }
}
