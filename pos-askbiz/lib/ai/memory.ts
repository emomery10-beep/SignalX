// ── Business Memory ─────────────────────────────────────────────────────────
// Extracts business facts from conversations and persists them.
// Injected into every AI prompt so the AI knows the user's business deeply.

import { createServiceClient } from '@/lib/supabase/server'
import { logUsage } from '@/lib/log-usage'

interface MemoryFact {
  category: 'finance' | 'product' | 'operations' | 'market' | 'goal' | 'challenge' | 'context'
  key: string
  value: string
  confidence: 'high' | 'medium' | 'low'
}

// ── Extract facts from a conversation turn ────────────────────
export async function extractAndSaveMemory(
  userId: string,
  userMessage: string,
  aiAnswer: string,
): Promise<void> {
  try {
    const _systemPrompt = `You extract concrete business facts from a conversation between a business owner and an AI advisor.

Only extract facts that are specific, numerical, or clearly stated — not vague inferences.
Return a JSON array of facts. Each fact: { category, key, value, confidence }

Categories:
- finance: margins, revenue, costs, profit, cashflow, pricing
- product: what they sell, SKUs, inventory levels, suppliers
- operations: team size, locations, platforms, tools used
- market: target customers, regions, competitors, channels
- goal: what they want to achieve, growth targets
- challenge: problems they face, pain points
- context: business type, years trading, sector, size

Rules:
- key must be snake_case, specific: "gross_margin_pct", "main_product", "monthly_revenue_gbp"
- value must be a concrete string: "23%", "leather wallets", "£45,000"
- Do NOT extract generic advice or hypotheticals
- Do NOT extract things already known from their profile (sector, country)
- confidence: high = stated explicitly, medium = clearly implied, low = inferred
- Return [] if nothing concrete is extractable
- Maximum 5 facts per call`

    const _groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 512,
        messages: [
          { role: 'system', content: _systemPrompt },
          {
            role: 'user',
            content: `User said: "${userMessage}"\n\nAI answered: "${aiAnswer.slice(0, 600)}"\n\nExtract business facts as JSON array:`,
          },
        ],
      }),
    })
    const _groqData = await _groqRes.json()
    const text = _groqData.choices?.[0]?.message?.content || ''
    logUsage({ route: 'memory/extract', model: 'llama-3.3-70b-versatile', usage: { input_tokens: _groqData.usage?.prompt_tokens ?? 0, output_tokens: _groqData.usage?.completion_tokens ?? 0 }, userId })
    const match = text.match(/\[[\s\S]*\]/)
    if (!match) return

    const facts: MemoryFact[] = JSON.parse(match[0])
    if (!facts.length) return

    const supabase = createServiceClient()
    const now = new Date().toISOString()

    // Upsert facts — newer data wins, but don't downgrade confidence
    for (const fact of facts) {
      if (!fact.key || !fact.value || !fact.category) continue
      await supabase.from('business_memory').upsert({
        user_id: userId,
        category: fact.category,
        key: fact.key.toLowerCase().replace(/\s+/g, '_'),
        value: String(fact.value),
        confidence: fact.confidence || 'medium',
        source: 'conversation',
        updated_at: now,
      }, { onConflict: 'user_id,key' })
    }
  } catch {
    // Memory extraction is best-effort — never block the main response
  }
}

// ── Load memory for a user and format for the system prompt ──
export async function loadMemoryContext(userId: string): Promise<string> {
  try {
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('business_memory')
      .select('category, key, value, confidence, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(40)

    if (!data?.length) return ''

    // Group by category
    const grouped: Record<string, typeof data> = {}
    for (const fact of data) {
      if (!grouped[fact.category]) grouped[fact.category] = []
      grouped[fact.category].push(fact)
    }

    const lines: string[] = ['WHAT I KNOW ABOUT THIS BUSINESS (from past conversations):']
    const catLabels: Record<string, string> = {
      finance: 'Financials',
      product: 'Products',
      operations: 'Operations',
      market: 'Market',
      goal: 'Goals',
      challenge: 'Challenges',
      context: 'Context',
    }

    for (const [cat, facts] of Object.entries(grouped)) {
      lines.push(`${catLabels[cat] || cat}:`)
      for (const f of facts) {
        lines.push(`  - ${f.key.replace(/_/g, ' ')}: ${f.value}`)
      }
    }

    lines.push('Use these facts to give answers specific to their actual business — never say "I don\'t know your margins" if the margin is listed above.')
    return lines.join('\n')
  } catch {
    return ''
  }
}
