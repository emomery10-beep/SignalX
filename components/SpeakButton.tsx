'use client'
import { useState } from 'react'
import { speak, stopSpeaking, speechSupported } from '@/lib/speak'
import { useLang } from '@/components/LanguageProvider'

// A one-tap "read this aloud" control. Place it on any screen and pass the
// text that should be spoken (heading + main instruction is usually right).
// Speaks in the user's current language; toggles off on second tap.
export default function SpeakButton({ text, size = 46 }: { text: string; size?: number }) {
  const { lang, tc } = useLang()
  const [on, setOn] = useState(false)

  // Hide entirely where the browser can't speak — no dead control.
  if (typeof window !== 'undefined' && !speechSupported()) return null

  const toggle = () => {
    if (on) { stopSpeaking(); setOn(false); return }
    speak(text, lang)
    setOn(true)
    // Reset the visual state when speech finishes.
    try {
      window.speechSynthesis.addEventListener('end', () => setOn(false), { once: true })
    } catch { /* no-op */ }
  }

  return (
    <button
      onClick={toggle}
      aria-label={tc('common.read_aloud')}
      style={{
        width: size, height: size, flexShrink: 0, borderRadius: '50%',
        border: '1.5px solid rgba(0,0,0,.14)', background: on ? '#d08a59' : '#fff',
        color: on ? '#fff' : '#6b6760', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: on ? '0 2px 10px rgba(208,138,89,.35)' : '0 1px 4px rgba(0,0,0,.08)',
        transition: 'background .15s, color .15s',
      }}
    >
      <svg width={size * 0.46} height={size * 0.46} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 5 6 9H2v6h4l5 4V5z"/>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
      </svg>
    </button>
  )
}
