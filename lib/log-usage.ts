import { createServiceClient } from '@/lib/supabase/server'

const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  haiku:  { input: 0.80,  output: 4.0  },  // per 1M tokens
  sonnet: { input: 3.0,   output: 15.0 },
  opus:   { input: 15.0,  output: 75.0 },
}

function costUsd(model: string, inputTokens: number, outputTokens: number): number {
  const tier = model.includes('haiku') ? 'haiku' : model.includes('opus') ? 'opus' : 'sonnet'
  const p = MODEL_PRICING[tier]
  return (inputTokens * p.input + outputTokens * p.output) / 1_000_000
}

export function logUsage(opts: {
  route: string
  model: string
  usage: { input_tokens: number; output_tokens: number }
  userId?: string | null
}) {
  // Fire-and-forget — never await this in a hot path
  Promise.resolve().then(async () => {
    try {
      const supabase = createServiceClient()
      await supabase.from('api_usage').insert({
        route: opts.route,
        model: opts.model,
        user_id: opts.userId ?? null,
        input_tokens: opts.usage.input_tokens,
        output_tokens: opts.usage.output_tokens,
        cost_usd: costUsd(opts.model, opts.usage.input_tokens, opts.usage.output_tokens),
      })
    } catch {
      // Never throw — logging must not break the caller
    }
  })
}
