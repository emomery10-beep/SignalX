// Text-to-speech — reads UI text aloud so a vendor who can't read can still
// use the app, and so a helper can have the screen read to them. Audio is the
// single strongest-evidence accessibility lever in the HCI4D literature for
// low-literacy users (Medhi/Toyama; Nielsen NN/g).
//
// Best-effort: uses the browser SpeechSynthesis API, silently no-ops where it
// (or a matching voice) is unavailable. Swahili voices are patchy in browsers
// today — when none is found it falls back to the default voice, so the words
// are still spoken (imperfect pronunciation). A hosted TTS service is the
// natural upgrade.

let cachedVoices: SpeechSynthesisVoice[] = []

function voices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return []
  if (!cachedVoices.length) cachedVoices = window.speechSynthesis.getVoices()
  return cachedVoices
}

// Keep the voice list fresh (it loads async in some browsers).
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => { cachedVoices = window.speechSynthesis.getVoices() }
}

export function speechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function speak(text: string, lang = 'en'): void {
  try {
    if (!speechSupported() || !text?.trim()) return
    const synth = window.speechSynthesis
    synth.cancel() // stop anything already speaking
    const u = new SpeechSynthesisUtterance(text)
    u.lang = lang
    const match = voices().find(v => v.lang.toLowerCase().startsWith(lang.toLowerCase()))
    if (match) u.voice = match
    u.rate = 0.92 // a touch slower — clearer for first-time listeners
    synth.speak(u)
  } catch { /* no-op */ }
}

export function stopSpeaking(): void {
  try { if (speechSupported()) window.speechSynthesis.cancel() } catch { /* no-op */ }
}
