// Per-endpoint credit pricing for the pay-per-use wallet (see the Phase 0
// design notes in supabase/migrations/20260708000001_api_credit_wallet.sql).
// Priced by cost-to-serve, not flat-rate — a Groq vision call costs more
// than a template WhatsApp send. Revisit once real usage data exists.
export const API_PRICE_CENTS = {
  '/api/v1/scan': 3,             // Groq Llama-4-Scout multimodal call
  '/api/v1/whatsapp/send': 2,    // Meta per-conversation fee + margin
} as const
