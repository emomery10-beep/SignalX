import { createServiceClient } from '@/lib/supabase/server'

const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  haiku:        { input: 0.80,  output: 4.0   },
  sonnet:       { input: 3.0,   output: 15.0  },
  // Groq models
  'llama-3.3-70b-versatile':                     { input: 0.59, output: 0.79 },
  'meta-llama/llama-4-scout-17b-16e-instruct':   { input: 0.11, output: 0.34 },
}

function costUsd(model: string, inputTokens: number, outputTokens: number): number {
  if (MODEL_PRICING[model]) {
    const p = MODEL_PRICING[model]
    return (inputTokens * p.input + outputTokens * p.output) / 1_000_000
  }
  const tier = model.includes('haiku') ? 'haiku' : 'sonnet'
  const p = MODEL_PRICING[tier]
  return (inputTokens * p.input + outputTokens * p.output) / 1_000_000
}

export function logUsage(opts: {
  route: string
  model: string
  usage: { input_tokens: number; output_tokens: number }
  userId?: string | null
}) {
  Promise.resolve().then(async () => {
    try {
      const supabase = createServiceClient()
      await supabase.from('api_usage').insert({
        route: `pos-app/${opts.route}`,
        model: opts.model,
        user_id: opts.userId ?? null,
        input_tokens: opts.usage.input_tokens,
        output_tokens: opts.usage.output_tokens,
        cost_usd: costUsd(opts.model, opts.usage.input_tokens, opts.usage.output_tokens),
      })
    } catch {
      // Never throw
    }
  })
}
