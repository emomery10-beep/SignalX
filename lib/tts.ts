// ── TEXT TO SPEECH — AskBiz Live ─────────────────────────────────────────────
// Uses Web Speech API (free) with emphasis parsing
// Upgrade path: ElevenLabs / Google TTS API when ready

export function parseEmphasisTags(text: string): { text: string; emphasized: string[] } {
  const emphasized: string[] = []
  // Find <emphasis>...</emphasis> tags
  const cleaned = text.replace(/<emphasis>(.*?)<\/emphasis>/gi, (_, word) => {
    emphasized.push(word)
    return word.toUpperCase() // Caps for Web Speech emphasis
  })
  // Also strip any other tags
  const plain = cleaned.replace(/<[^>]+>/g, '')
  return { text: plain, emphasized }
}

// BCP-47 voice tag per locale. Keep in step with lib/i18n-format LOCALE_TAG.
const VOICE_TAG: Record<string, string> = {
  en: 'en-GB', es: 'es-ES', fr: 'fr-FR', de: 'de-DE', nl: 'nl-NL', ar: 'ar-SA',
}

export async function speakResponse(
  rawText: string,
  options: { rate?: number; pitch?: number; volume?: number; voice?: string; locale?: string } = {}
): Promise<void> {
  if (typeof window === 'undefined') return
  if (!window.speechSynthesis) return

  // Cancel any ongoing speech
  window.speechSynthesis.cancel()

  const { text } = parseEmphasisTags(rawText)

  // Truncate to first 2 sentences for concise voice responses
  const sentences = text.match(/[^.!?]+[.!?]*/g) || [text]
  const voiceText = sentences.slice(0, 3).join(' ').trim()

  // Speak in the user's language, not always English.
  const locale = options.locale || 'en'
  const langTag = VOICE_TAG[locale] || 'en-GB'

  const utterance = new SpeechSynthesisUtterance(voiceText)
  utterance.rate = options.rate ?? 0.95
  utterance.pitch = options.pitch ?? 1.05
  utterance.volume = options.volume ?? 0.9
  utterance.lang = langTag

  // Pick the best voice for this locale, falling back to same base language.
  const baseLang = langTag.split('-')[0]
  const voices = window.speechSynthesis.getVoices()
  const preferred =
    voices.find(v => v.lang === langTag && (v.name.includes('Female') || v.name.includes('Google'))) ||
    voices.find(v => v.lang === langTag) ||
    voices.find(v => v.lang.startsWith(baseLang))
  if (preferred) utterance.voice = preferred

  return new Promise((resolve) => {
    utterance.onend = () => resolve()
    utterance.onerror = () => resolve()
    // Small delay for voice loading
    setTimeout(() => window.speechSynthesis.speak(utterance), 100)
  })
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
}

// Build a voice-optimised response from AI answer
// Adds emphasis tags around key actions
export function buildVoiceResponse(answerText: string): string {
  // Detect action phrases and wrap in emphasis
  const actionPatterns = [
    /(should|must|need to|recommend|suggest|consider)\s+([a-z]+\s+[a-z]+)/gi,
    /(increase|decrease|reduce|raise|lower|cut|boost)\s+(?:your\s+)?([a-z]+)/gi,
    /(urgent|immediately|now|today|this week)/gi,
  ]

  let voiced = answerText
  actionPatterns.forEach(pattern => {
    voiced = voiced.replace(pattern, (match) => `<emphasis>${match}</emphasis>`)
  })

  return voiced
}
