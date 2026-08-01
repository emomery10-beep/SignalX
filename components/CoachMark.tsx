'use client'
import { useEffect, useState } from 'react'
import { speak, stopSpeaking } from '@/lib/speak'
import { trackFunnelEvent } from '@/lib/funnel-track'

const SEEN_PREFIX = 'askbiz_coach_seen_'

function hasSeen(id: string): boolean {
  try { return localStorage.getItem(SEEN_PREFIX + id) === '1' } catch { return true } // storage blocked — fail quiet, not nagging
}
function markSeen(id: string) {
  try { localStorage.setItem(SEEN_PREFIX + id, '1') } catch { /* best-effort */ }
}

// First-time voice + visual guidance, wrapping whatever it should point at.
// Mounting IS the trigger — the caller already only renders this when the
// relevant screen/step/button is showing, so no separate "active" prop is
// needed. Speaks once per user per id (localStorage), dismisses on the first
// tap anywhere, and never blocks the wrapped control from working normally.
export default function CoachMark({
  id, text, lang, variant = 'ring', children,
}: {
  id: string
  text: string
  lang: string
  variant?: 'ring' | 'none'
  children: React.ReactNode
}) {
  const [show, setShow] = useState(() => !hasSeen(id))

  useEffect(() => {
    if (!show) return
    markSeen(id)
    trackFunnelEvent('coach_mark_shown', { metadata: { id } })
    speak(text, lang)
    const dismiss = () => setShow(false)
    window.addEventListener('pointerdown', dismiss, { once: true })
    return () => {
      window.removeEventListener('pointerdown', dismiss)
      stopSpeaking()
    }
    // Only ever fires once per mount — id/text/lang are fixed for a given
    // coach mark instance in practice.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!show) return <>{children}</>

  return (
    <div style={{ position: 'relative' }}>
      {variant === 'ring' && (
        <div aria-hidden style={{ position: 'absolute', inset: -6, borderRadius: 18, border: '2px solid #d08a59', opacity: .55, pointerEvents: 'none', animation: 'coachRing 1.6s ease-out infinite' }} />
      )}
      {children}
      <style>{`@keyframes coachRing { 0% { transform: scale(1); opacity: .55; } 100% { transform: scale(1.05); opacity: 0; } }`}</style>
    </div>
  )
}
