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

export async function speakResponse(
  rawText: string,
  options: { rate?: number; pitch?: number; volume?: number; voice?: string } = {}
): Promise<void> {
  if (typeof window === 'undefined') return
  if (!window.speechSynthesis) return

  // Cancel any ongoing speech
  window.speechSynthesis.cancel()

  const { text } = parseEmphasisTags(rawText)

  // Truncate to first 2 sentences for concise voice responses
  const sentences = text.match(/[^.!?]+[.!?]*/g) || [text]
  const voiceText = sentences.slice(0, 3).join(' ').trim()

  const utterance = new SpeechSynthesisUtterance(voiceText)
  utterance.rate = options.rate ?? 0.95
  utterance.pitch = options.pitch ?? 1.05
  utterance.volume = options.volume ?? 0.9
  utterance.lang = 'en-GB'

  // Try to get a natural UK English voice
  const voices = window.speechSynthesis.getVoices()
  const preferred = voices.find(v =>
    v.lang === 'en-GB' && (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google'))
  ) || voices.find(v => v.lang.startsWith('en'))
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
