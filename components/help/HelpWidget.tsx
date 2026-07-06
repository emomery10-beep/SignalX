'use client'
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { HELP_ARTICLES, HELP_TOPICS, searchArticles, getPopularArticles, type HelpArticle } from '@/lib/help-content'
import { useLang } from '@/components/LanguageProvider'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { findRouteByPath } from '@/lib/voiceRoutes'

const ACC  = '#d08a59'
const SF   = '#ffffff'
const TX   = '#1a1916'
const TX2  = '#6b6760'
const TX3  = '#a39e97'
const BD   = '#e8e6e1'
const BG   = '#f9f8f6'

// ── Voice-nav (merged into this FAB; see components/help/HelpWidget.tsx spec) ──
const VOICE_NAV_CLIENT_ENABLED = process.env.NEXT_PUBLIC_VOICE_NAV_ENABLED === 'true'
const LONG_PRESS_MS = 300 // was 450 — lower accidental-long-press latency on mobile
const REVERT_MS = 1500
const MAX_LISTEN_MS = 12000 // safety net: force out of 'listening' if recognition never resolves
const FETCH_TIMEOUT_MS = 15000 // safety net: force out of 'processing' if the API call hangs
const CONFIRM_TIMEOUT_MS = 7000 // safety net: auto-cancel a pending low-confidence confirmation
const RECENT_COMMANDS_MAX = 3

type VoiceUIState = 'idle' | 'listening' | 'processing' | 'success' | 'error' | 'confirm'

// Session-only display record of a completed voice navigation. Never persisted
// to any storage — plain useState, reset on full page reload (see §8 privacy audit).
interface RecentCommand {
  route: string
  label: string
}

// Session-only payload for a low-confidence result awaiting explicit user confirmation.
// Never persisted to any storage.
interface PendingConfirm {
  route: string
  language: string
  confirmation: string
  label: string
}

const LANG_TO_BCP47: Record<string, string> = {
  en: 'en-US', fr: 'fr-FR', es: 'es-ES', nl: 'nl-NL', de: 'de-DE', sw: 'sw-KE',
}

// Never interpolate transcript content into any of these strings.
const ERROR_SPEECH: Record<string, string> = {
  en: "Sorry, I didn't catch that",
  fr: "Désolé, je n'ai pas compris",
  es: 'Lo siento, no entendí eso',
  nl: 'Sorry, dat heb ik niet verstaan',
  de: 'Entschuldigung, das habe ich nicht verstanden',
  sw: 'Samahani, sikuelewa hilo',
}

// TTS-only "did you mean" prompt, keyed by the detected SPEECH language (one of the
// 6 voice-nav-supported codes) — mirrors ERROR_SPEECH's precedent exactly. This is a
// different axis than the site UI locale (tc()/useLang, 7 locales including ar), so
// it deliberately stays a module constant rather than going through tc(). Only ever
// interpolates a route's static, pre-defined label from lib/voiceRoutes.ts — never
// the raw transcript.
const CONFIRM_SPEECH: Record<string, (label: string) => string> = {
  en: label => `Did you mean ${label}?`,
  fr: label => `Vouliez-vous dire ${label} ?`,
  es: label => `¿Quisiste decir ${label}?`,
  nl: label => `Bedoelde je ${label}?`,
  de: label => `Meintest du ${label}?`,
  sw: label => `Ulimaanisha ${label}?`,
}

function browserLangFallback(): string {
  const two = (typeof navigator !== 'undefined' ? navigator.language : 'en').slice(0, 2).toLowerCase()
  return ERROR_SPEECH[two] ? two : 'en'
}

function voiceBg(state: VoiceUIState, open: boolean): string {
  switch (state) {
    case 'listening': return '#dc2626'
    case 'processing': return TX2
    case 'success': return '#16a34a'
    case 'error': return '#dc2626'
    case 'confirm': return ACC   // terracotta — a question, distinct from error(red)/success(green)
    default: return open ? TX2 : ACC
  }
}

function MicIcon() {
  return (
    <svg aria-hidden width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={SF} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="8" y1="22" x2="16" y2="22" />
    </svg>
  )
}

function renderGlyph(state: VoiceUIState, open: boolean, voiceNavActive: boolean) {
  switch (state) {
    case 'listening':
      return <span aria-hidden style={{ width: 10, height: 10, borderRadius: '50%', background: SF }} />
    case 'processing':
      return <span aria-hidden style={{
        width: 16, height: 16, borderRadius: '50%',
        border: '2px solid rgba(255,255,255,.35)', borderTopColor: SF,
        animation: 'voiceSpin .7s linear infinite',
      }} />
    case 'success':
      return (
        <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={SF} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      )
    case 'error':
      return (
        <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={SF} strokeWidth="3" strokeLinecap="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      )
    case 'confirm':
      return <span aria-hidden style={{ fontSize: 16, fontWeight: 700, lineHeight: 1 }}>?</span>
    default:
      // Long-press (or held Space/Enter) now opens the help panel instead of the
      // old tap-to-open — so the idle glyph is the mic whenever voice is capable,
      // and only falls back to '?' when there's no voice capability to represent
      // (voiceNavActive false: this button is byte-identical to the original plain
      // Help FAB, including its glyph).
      if (open) return '×'
      return voiceNavActive ? <MicIcon /> : '?'
  }
}

function pickVoice(bcp47: string, langCode: string): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return undefined
  return (
    voices.find(v => v.lang.toLowerCase() === bcp47.toLowerCase()) ||
    voices.find(v => v.lang.toLowerCase().startsWith(langCode)) ||
    voices.find(v => v.lang.toLowerCase().startsWith('en'))
  )
}

// Returns a cancel function for the pending voiceschanged-fallback timer (if one was
// scheduled), so callers can tie it to a ref and clear it on unmount. Returns undefined
// when speech synthesis fired synchronously (or wasn't available) — nothing to cancel.
function speakText(text: string, langCode: string): (() => void) | undefined {
  if (typeof window === 'undefined' || !window.speechSynthesis || !text) return undefined
  const bcp47 = LANG_TO_BCP47[langCode] || 'en-US'
  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = bcp47

  const speakNow = () => {
    const match = pickVoice(bcp47, langCode)
    if (match) utter.voice = match
    window.speechSynthesis.cancel()   // clear any queued utterance before speaking
    window.speechSynthesis.speak(utter)
  }

  if (window.speechSynthesis.getVoices().length > 0) {
    speakNow()
    return undefined
  } else {
    // Chrome loads voices asynchronously; wait once for voiceschanged, with a safety timeout.
    const onVoicesChanged = () => {
      window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged)
      speakNow()
    }
    window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged)
    const timerId = setTimeout(() => {
      window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged)
      speakNow()
    }, 500)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged)
      clearTimeout(timerId)
    }
  }
}

// Map app sections to relevant help topic slugs (must match HELP_TOPICS slugs)
const SECTION_MAP: [string, string][] = [
  ['/intelligence', 'intelligence-alerts'],
  ['/dashboards',   'data-analysis-reporting'],
  ['/ask',          'ask-askbiz'],
  ['/sources',      'connecting-data'],
  ['/settings',     'settings-preferences'],
  ['/billing',      'account-billing'],
  ['/tools',        'business-tools'],
  ['/forecasts',    'forecasting-planning'],
  ['/home',         'getting-started'],
  ['/files',        'files-uploads'],
  ['/templates',    'templates'],
  ['/sell',         'point-of-sale'],
  ['/pos',          'mobile-money'],
  ['/cfo',          'advanced-intelligence'],
]

function buildQuickLinks(tc: (k: string) => string) {
  return [
    { label: tc('help_helpwidget.gettingStarted'), href: '/help/topic/getting-started' },
    { label: tc('help_helpwidget.faq'),            href: '/help/faq' },
    { label: tc('help_helpwidget.glossary'),       href: '/help/glossary' },
  ]
}

export default function HelpWidget() {
  const { tc } = useLang()
  const [open,    setOpen]    = useState(false)
  const [query,   setQuery]   = useState('')
  const [results, setResults] = useState<HelpArticle[]>([])
  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const pathname = usePathname()

  const router = useRouter()
  const { startListening, stopListening, transcript, isListening, isSupported, error: speechError } =
    useSpeechRecognition()

  const [voiceState, setVoiceState] = useState<VoiceUIState>('idle')
  const [showTooltip, setShowTooltip] = useState(false)

  // Session-only, in-memory only — never persisted to any storage (see §8 privacy audit).
  const [recentCommands, setRecentCommands] = useState<RecentCommand[]>([])
  const [pendingConfirm, setPendingConfirm] = useState<PendingConfirm | null>(null)

  const voiceNavActive = VOICE_NAV_CLIENT_ENABLED && isSupported

  const revertTimerRef       = useRef<ReturnType<typeof setTimeout> | null>(null)  // success/error auto-revert
  const maxListenTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null)  // safety net if recognition hangs
  const confirmTimerRef      = useRef<ReturnType<typeof setTimeout> | null>(null)  // safety net if a confirm is never answered
  const suppressNextClickRef = useRef(false)                                       // swallow the click after a long-press-for-help fires
  const activePointerIdRef   = useRef<number | null>(null)                         // which pointer started the press
  const abortRef             = useRef<AbortController | null>(null)                // in-flight fetch
  const voiceStateRef        = useRef<VoiceUIState>('idle')                        // fresh-state mirror for async closures
  const submitPendingRef     = useRef(false)                                       // gates the transcript-submit effect
  const speakCancelRef       = useRef<(() => void) | null>(null)                   // cancels speakText's pending voiceschanged-fallback timer
  const isMountedRef         = useRef(true)                                        // guards async fetch continuations against post-unmount state/speech side effects
  const confirmYesRef        = useRef<HTMLButtonElement>(null)                     // focus target when the confirm alertdialog appears

  // Long-press (pointer) / held-Space-Enter (keyboard) now open the Help panel —
  // a single tap is the primary voice start/stop action, so opening Help moved to
  // the secondary gesture. Separate timer refs per input modality (no shared-owner
  // arbitration needed): worst case on a hybrid device is a redundant/skipped Help
  // panel open, not a corrupted voice session, so the extra complexity isn't worth it.
  const helpPressTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null)  // pointer long-press-for-help timer
  const helpKeyPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)  // keyboard held-Space/Enter-for-help timer
  const helpKeyHeldRef       = useRef(false)                                       // ignore OS key-repeat while Space/Enter is held

  voiceStateRef.current = voiceState

  const QUICK_LINKS = buildQuickLinks(tc)

  // Move keyboard focus into the confirm alertdialog as soon as it appears, so a
  // keyboard-only user has an immediate path to Yes/No instead of having to tab there
  // from wherever focus previously was before the CONFIRM_TIMEOUT_MS window auto-cancels it.
  useEffect(() => {
    if (voiceState === 'confirm' && pendingConfirm) confirmYesRef.current?.focus()
  }, [voiceState, pendingConfirm])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const fn = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('mousedown', fn)
    return () => window.removeEventListener('mousedown', fn)
  }, [open])

  // Focus input when panel opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80)
  }, [open])

  // Live search
  useEffect(() => {
    if (query.trim().length <= 1) { setResults([]); return }
    setResults(searchArticles(query).slice(0, 5))
  }, [query])

  // Contextual articles based on current path
  const contextArticles = useMemo(() => {
    const match = SECTION_MAP.find(([p]) => pathname?.startsWith(p))
    if (match) {
      const topicSlug = match[1]
      const topic = HELP_TOPICS.find(t => t.slug === topicSlug)
      if (topic) {
        return HELP_ARTICLES.filter(a => a.topicSlug === topicSlug).slice(0, 3)
      }
    }
    return getPopularArticles().slice(0, 3)
  }, [pathname])

  const contextLabel = useMemo(() => {
    const match = SECTION_MAP.find(([p]) => pathname?.startsWith(p))
    if (match) {
      const topic = HELP_TOPICS.find(t => t.slug === match[1])
      return topic ? tc('help_helpwidget.helpFor') + topic.title : tc('help_helpwidget.suggestedArticles')
    }
    return tc('help_helpwidget.popularArticles')
  }, [pathname, tc])

  // ── Voice-nav: gesture handlers, TTS, submit + keyboard-shortcut effects ──

  const clearHelpPressTimer = useCallback(() => {
    if (helpPressTimerRef.current) { clearTimeout(helpPressTimerRef.current); helpPressTimerRef.current = null }
  }, [])

  const clearHelpKeyPressTimer = useCallback(() => {
    if (helpKeyPressTimerRef.current) { clearTimeout(helpKeyPressTimerRef.current); helpKeyPressTimerRef.current = null }
  }, [])

  const clearMaxListenTimer = useCallback(() => {
    if (maxListenTimerRef.current) { clearTimeout(maxListenTimerRef.current); maxListenTimerRef.current = null }
  }, [])

  const clearConfirmTimer = useCallback(() => {
    if (confirmTimerRef.current) { clearTimeout(confirmTimerRef.current); confirmTimerRef.current = null }
  }, [])

  // Records a completed navigation into the session-only recent-commands list.
  // Dedupes by route (re-navigating to an already-listed page moves it to the
  // front instead of showing a duplicate chip). Never touches any storage API.
  const recordRecentCommand = useCallback((route: string) => {
    const label = findRouteByPath(route)?.label
    if (!label) return   // defensive; VALID_ROUTE_PATHS whitelist already guarantees this in practice
    setRecentCommands(prev => [{ route, label }, ...prev.filter(c => c.route !== route)].slice(0, RECENT_COMMANDS_MAX))
  }, [])

  // Chip click: instant re-nav, no fetch, no TTS (a repeated, on-demand TTS replay
  // on every chip click was judged unrequested/spammy — the spec only requires
  // visual acknowledgement). Reuses the existing 'success' visual + auto-revert.
  const runRecentCommand = useCallback((route: string) => {
    if (voiceStateRef.current !== 'idle') return   // don't stomp an in-flight gesture/confirm
    setShowTooltip(false)
    setOpen(false)
    setVoiceState('success')
    voiceStateRef.current = 'success'
    router.push(route)
    if (revertTimerRef.current) clearTimeout(revertTimerRef.current)
    revertTimerRef.current = setTimeout(() => setVoiceState('idle'), REVERT_MS)
    // Deliberately does not call recordRecentCommand here — re-clicking an existing
    // chip shouldn't reorder the list out from under a popover the user is looking at.
    // Deliberately does not touch suppressNextClickRef — this click originates on a
    // chip inside the popover, never on the FAB itself, so no native FAB click is
    // produced that needs suppressing.
  }, [router])

  // Tracks speakText's pending voiceschanged-fallback timer (if any) in speakCancelRef so
  // the unmount cleanup effect can cancel it — otherwise a queued speakNow() can still fire
  // window.speechSynthesis.speak() after the component (and its cancel() on unmount) is gone.
  const runSpeak = useCallback((text: string, langCode: string) => {
    speakCancelRef.current?.()
    speakCancelRef.current = speakText(text, langCode) ?? null
  }, [])
  const speakConfirmation = useCallback((text: string, langCode: string) => runSpeak(text, langCode), [runSpeak])
  const speakError = useCallback(() => {
    const lang = browserLangFallback()
    runSpeak(ERROR_SPEECH[lang], lang)
  }, [runSpeak])
  const speakConfirmPrompt = useCallback((language: string, label: string) => {
    const fn = CONFIRM_SPEECH[language] || CONFIRM_SPEECH.en
    runSpeak(fn(label), CONFIRM_SPEECH[language] ? language : 'en')
  }, [runSpeak])

  // Consumes the in-flight capture and shows the error state. Used both when the
  // hook reports a real error (e.g. mic permission denied) and when the safety
  // timeout below fires because recognition never resolved at all.
  const enterErrorState = useCallback(() => {
    clearMaxListenTimer()
    abortRef.current?.abort()
    submitPendingRef.current = false
    setVoiceState('error')
    voiceStateRef.current = 'error'   // mirror immediately; do not wait for the next render
    speakError()
    if (revertTimerRef.current) clearTimeout(revertTimerRef.current)
    revertTimerRef.current = setTimeout(() => setVoiceState('idle'), REVERT_MS)
  }, [clearMaxListenTimer, speakError])

  // Entry point for a low-confidence voice-nav result. Mirrors the MAX_LISTEN_MS /
  // enterErrorState watchdog pattern exactly: schedule a setTimeout, guard the
  // eventual action on voiceStateRef.current, let any explicit exit path clear the
  // timer first.
  //
  // Deliberately does NOT touch suppressNextClickRef: this is invoked from the fetch
  // success handler, never from a pointer/keyboard long-press gesture, so — exactly
  // like enterErrorState — it must leave that flag alone. Only handlePointerDown's and
  // handleToggleKeyDown's long-press timers may ever set it true.
  const enterConfirmState = useCallback((route: string, language: string, confirmation: string) => {
    const label = findRouteByPath(route)?.label ?? confirmation
    setPendingConfirm({ route, language, confirmation, label })
    setVoiceState('confirm')
    voiceStateRef.current = 'confirm'   // mirror immediately; do not wait for the next render
    speakConfirmPrompt(language, label)

    clearConfirmTimer()
    confirmTimerRef.current = setTimeout(() => {
      if (voiceStateRef.current !== 'confirm') return   // already resolved by explicit Yes/No
      setPendingConfirm(null)
      setVoiceState('idle')
      voiceStateRef.current = 'idle'
    }, CONFIRM_TIMEOUT_MS)
  }, [clearConfirmTimer, speakConfirmPrompt])

  // "Yes" — the ONLY path that navigates for a low-confidence result.
  const confirmPendingNav = useCallback(() => {
    if (voiceStateRef.current !== 'confirm' || !pendingConfirm) return
    clearConfirmTimer()
    const { route, language, confirmation } = pendingConfirm
    setPendingConfirm(null)
    setVoiceState('success')
    voiceStateRef.current = 'success'
    router.push(route)
    speakConfirmation(confirmation, language)
    recordRecentCommand(route)
    if (revertTimerRef.current) clearTimeout(revertTimerRef.current)
    revertTimerRef.current = setTimeout(() => setVoiceState('idle'), REVERT_MS)
  }, [pendingConfirm, clearConfirmTimer, router, speakConfirmation, recordRecentCommand])

  // "No" — explicit reject, clean return to idle, no navigation.
  const rejectPendingNav = useCallback(() => {
    if (voiceStateRef.current !== 'confirm') return
    clearConfirmTimer()
    setPendingConfirm(null)
    setVoiceState('idle')
    voiceStateRef.current = 'idle'
  }, [clearConfirmTimer])

  const beginVoiceCapture = useCallback(() => {
    if (voiceStateRef.current !== 'idle') return   // ignore if a capture/processing/result cycle is already in flight
    if (revertTimerRef.current) { clearTimeout(revertTimerRef.current); revertTimerRef.current = null }
    setOpen(false)      // starting to listen always wins; force-close the help panel if open
    setVoiceState('listening')
    voiceStateRef.current = 'listening'   // mirror immediately; do not wait for the next render
    // Mark intent to submit whenever listening ends, however it ends: the browser's
    // own silence detection finishing the recognition "by itself" (continuous=false),
    // or the user tapping/pressing the shortcut again to stop it early. Either way
    // isListening flips false and the submit effect below picks up the transcript.
    submitPendingRef.current = true
    startListening()
    clearMaxListenTimer()
    maxListenTimerRef.current = setTimeout(() => {
      if (voiceStateRef.current === 'listening') enterErrorState()
    }, MAX_LISTEN_MS)
  }, [startListening, clearMaxListenTimer, enterErrorState])

  const openHelpPanel = useCallback(() => {
    // Don't pop the help panel open at the same position as the confirm popover
    // (the exact collision handleToggleClick already guards against below).
    if (voiceStateRef.current === 'confirm') return
    setOpen(true)
  }, [])

  // Long-press opens the Help panel — the secondary gesture now that a single tap
  // is the primary voice start/stop action.
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return   // ignore right/middle click
    // Do NOT preventDefault() here — we don't yet know this will become a long-press,
    // and doing so unconditionally suppresses the touch compatibility click (and can
    // suppress mouse focus-follows-click), breaking short taps that should just toggle
    // voice via the native onClick. Suppression for the long-press case is instead
    // handled by suppressNextClickRef, set only once a long-press actually fires.
    activePointerIdRef.current = e.pointerId
    clearHelpPressTimer()
    helpPressTimerRef.current = setTimeout(() => {
      suppressNextClickRef.current = true   // long-press confirmed: swallow the click/tap that follows on release
      openHelpPanel()
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(100)
    }, LONG_PRESS_MS)
  }, [openHelpPanel, clearHelpPressTimer])

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    if (activePointerIdRef.current !== e.pointerId) return
    activePointerIdRef.current = null
    clearHelpPressTimer()
    // If the long-press already fired, the help panel is already open — nothing
    // further to do here. If it hadn't fired (short tap), the native onClick
    // (untouched) handles the voice toggle.
  }, [clearHelpPressTimer])

  const handlePointerCancelOrLeave = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    if (activePointerIdRef.current !== e.pointerId) return
    activePointerIdRef.current = null
    clearHelpPressTimer()
    // No voice-state cleanup needed here (unlike the old long-press-for-voice
    // design) — a cancelled long-press-for-help just means the timer never fired,
    // or the panel is already open and simply stays open. suppressNextClickRef is
    // left as-is: if the timer already fired it's correctly true awaiting the
    // click that follows release; if it never fired it's correctly untouched.
  }, [clearHelpPressTimer])

  const handleToggleClick = useCallback(() => {
    if (suppressNextClickRef.current) { suppressNextClickRef.current = false; return }
    // A tap always closes an already-open help panel (opened via long-press),
    // regardless of voice capability — closing shouldn't have the side effect of
    // also kicking off a live listening session.
    if (open) { setOpen(false); return }
    if (!voiceNavActive) { setOpen(true); return }   // no voice capability: exactly the original plain Help button
    // Voice-capable, panel closed: a tap is now the primary start/stop action.
    // Extra taps while a capture is already resolving (processing/success/error),
    // or while a low-confidence confirmation is pending, are ignored — Yes/No are
    // the only way to resolve 'confirm', matching the collision guard used elsewhere.
    if (voiceStateRef.current === 'idle') { beginVoiceCapture(); return }
    if (voiceStateRef.current === 'listening') { stopListening(); return }
  }, [open, voiceNavActive, beginVoiceCapture, stopListening])

  // Keyboard equivalent of the pointer long-press: holding Space/Enter on the
  // focused button opens the Help panel the same way holding it with a pointer does.
  const handleToggleKeyDown = useCallback((e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!voiceNavActive) return
    if (e.key !== ' ' && e.key !== 'Enter') return
    if (e.repeat || helpKeyHeldRef.current) return   // ignore OS key-repeat while held
    helpKeyHeldRef.current = true
    clearHelpKeyPressTimer()
    helpKeyPressTimerRef.current = setTimeout(() => {
      suppressNextClickRef.current = true   // long-press confirmed: swallow the keyup-triggered click
      openHelpPanel()
    }, LONG_PRESS_MS)
  }, [voiceNavActive, openHelpPanel, clearHelpKeyPressTimer])

  const handleToggleKeyUp = useCallback((e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!voiceNavActive) return
    if (e.key !== ' ' && e.key !== 'Enter') return
    if (!helpKeyHeldRef.current) return
    helpKeyHeldRef.current = false
    clearHelpKeyPressTimer()
    // else: short press. Native click (fired on Space/Enter keyup) handles the voice toggle.
  }, [voiceNavActive, clearHelpKeyPressTimer])

  // Transcript submission: fires once isListening transitions to false while a submit is pending.
  useEffect(() => {
    if (!voiceNavActive) return
    if (!submitPendingRef.current) return
    if (isListening) return  // still finalizing — recognition.onend hasn't fired yet
    submitPendingRef.current = false
    clearMaxListenTimer()   // recognition resolved on its own; the safety net is no longer needed

    const finalTranscript = transcript.trim()
    if (!finalTranscript) { setVoiceState('idle'); return }

    setVoiceState('processing')
    const controller = new AbortController()
    abortRef.current = controller
    const fetchTimeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

    fetch('/api/voice-nav', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript: finalTranscript }),
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('voice nav request failed')
        return res.json() as Promise<{ route: string; language: string; confirmation: string; confidence: 'high' | 'low' }>
      })
      .then(({ route, language, confirmation, confidence }) => {
        if (!isMountedRef.current) return   // unmounted mid-request: skip state + speech side effects
        if (confidence === 'low') {
          enterConfirmState(route, language, confirmation)
          return
        }
        setVoiceState('success')
        router.push(route)
        speakConfirmation(confirmation, language)
        recordRecentCommand(route)
      })
      .catch(() => {
        if (!isMountedRef.current) return   // unmounted mid-request (incl. the unmount-triggered abort): no user to show error to
        // Covers both a real failure and the FETCH_TIMEOUT_MS watchdog aborting a
        // hung request (observed in practice: the Groq API can occasionally take
        // 15+ minutes to respond). An unmount also aborts via this same signal, but
        // HelpWidget lives in the persistent app shell and effectively never
        // unmounts mid-request, so treating every abort as a user-facing error is
        // the right default rather than special-casing an abort reason.
        console.error('voice nav failed')          // generic literal only — never log err/transcript
        setVoiceState('error')
        speakError()
      })
      .finally(() => {
        clearTimeout(fetchTimeout)
        abortRef.current = null
        if (!isMountedRef.current) return
        // Do not clobber a just-entered 'confirm' state with the normal auto-revert —
        // enterConfirmState schedules its own CONFIRM_TIMEOUT_MS watchdog instead, and
        // it has already mirrored voiceStateRef.current synchronously (same microtask
        // chain as this .finally()), so this check is safe without waiting on a render.
        if (voiceStateRef.current !== 'confirm') {
          revertTimerRef.current = setTimeout(() => setVoiceState('idle'), REVERT_MS)
        }
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, voiceNavActive])

  // Recognition-level errors (e.g. mic permission denied, no-speech-detected-as-error
  // on some browsers) surface via the hook's `error` field, not as a fetch failure —
  // this is the only place that watches it and turns it into user-visible feedback.
  useEffect(() => {
    if (!voiceNavActive) return
    if (!speechError) return
    if (voiceStateRef.current !== 'listening') return
    enterErrorState()
  }, [speechError, voiceNavActive, enterErrorState])

  // Global keyboard shortcut: Ctrl+Shift+V
  useEffect(() => {
    if (!voiceNavActive) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'v') {
        e.preventDefault()
        if (voiceStateRef.current === 'idle') {
          beginVoiceCapture()   // submitPendingRef is set here; listening then ends either on its own or via a second press
        } else if (voiceStateRef.current === 'listening') {
          stopListening()      // manual early stop — submitPendingRef is already true
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [voiceNavActive, beginVoiceCapture, stopListening])

  // Cleanup on unmount
  useEffect(() => {
    // Reset true on every (re)mount — React 18 Strict Mode's dev-only
    // mount->cleanup->remount cycle would otherwise leave this stuck false
    // forever after the first cycle, silently no-op'ing every state transition
    // gated on isMountedRef for the rest of the component's real lifetime.
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      if (helpPressTimerRef.current) clearTimeout(helpPressTimerRef.current)
      if (helpKeyPressTimerRef.current) clearTimeout(helpKeyPressTimerRef.current)
      if (maxListenTimerRef.current) clearTimeout(maxListenTimerRef.current)
      if (revertTimerRef.current) clearTimeout(revertTimerRef.current)
      if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current)
      abortRef.current?.abort()
      speakCancelRef.current?.()   // cancel any pending voiceschanged-fallback timer from speakText
      speakCancelRef.current = null
      if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel()
      stopListening()
      // The Ctrl+Shift+V window keydown listener is removed by its own effect's cleanup above.
      // The outside-click and focus effects (pre-existing) are untouched and clean up themselves.
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const tooltipText = !VOICE_NAV_CLIENT_ENABLED
    ? undefined
    : !isSupported
      ? tc('help_helpwidget.voiceNotSupported')
      : tc('help_helpwidget.voiceShortcutHint')

  const ARIA_LABEL_FOR_STATE: Record<VoiceUIState, string | null> = {
    idle: null, // falls back to the existing open/close label
    listening: tc('help_helpwidget.voiceListening'),
    processing: tc('help_helpwidget.voiceProcessing'),
    success: tc('help_helpwidget.voiceSuccess'),
    error: tc('help_helpwidget.voiceError'),
    confirm: pendingConfirm ? tc('help_helpwidget.voiceConfirmYesAria', { label: pendingConfirm.label }) : tc('help_helpwidget.voiceConfirmYes'),
  }
  const ARIA_LIVE_TEXT: Record<VoiceUIState, string> = {
    idle: '',
    listening: tc('help_helpwidget.voiceListening'),
    processing: tc('help_helpwidget.voiceProcessing'),
    success: tc('help_helpwidget.voiceSuccess'),
    error: tc('help_helpwidget.voiceError'),
    confirm: pendingConfirm ? tc('help_helpwidget.voiceConfirmPrompt', { label: pendingConfirm.label }) : '',
  }

  return (
    <div ref={panelRef} className="help-widget-fab" style={{ fontFamily: 'DM Sans, system-ui' }}>

      {/* ── Panel ── */}
      {open && (
        <div style={{
          position: 'absolute', bottom: 56, right: 0, width: 320,
          background: SF, border: `1px solid ${BD}`, borderRadius: 14,
          boxShadow: '0 12px 40px rgba(0,0,0,.15)', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', maxHeight: 520,
        }}>
          {/* Header */}
          <div style={{ padding: '14px 16px 12px', borderBottom: `1px solid ${BD}`, background: ACC }}>
            <p style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 700, color: SF, fontFamily: 'Sora, system-ui' }}>
              {tc('help_helpwidget.panelTitle')}
            </p>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input ref={inputRef} type="text" placeholder={tc('help_helpwidget.searchPlaceholder')}
                value={query} onChange={e => setQuery(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px 8px 30px', fontSize: 13, background: 'rgba(255,255,255,.2)', border: '1.5px solid rgba(255,255,255,.3)', borderRadius: 8, color: SF, outline: 'none', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          {/* Body */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {results.length > 0 ? (
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: TX3, textTransform: 'uppercase', letterSpacing: '.08em', padding: '10px 14px 4px', margin: 0 }}>
                  {tc('help_helpwidget.searchResults')}
                </p>
                {results.map(a => (
                  <Link key={a.slug} href={`/help/${a.slug}`} onClick={() => { setOpen(false); setQuery('') }}
                    style={{ display: 'block', padding: '9px 14px', textDecoration: 'none', borderBottom: `1px solid ${BD}`, transition: 'background 100ms' }}
                    onMouseEnter={e => (e.currentTarget.style.background = BG)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: ACC, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 2 }}>{a.topic}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: TX, lineHeight: 1.35 }}>{a.title}</div>
                  </Link>
                ))}
              </div>
            ) : (
              <>
                {/* Contextual articles */}
                <p style={{ fontSize: 10, fontWeight: 700, color: TX3, textTransform: 'uppercase', letterSpacing: '.08em', padding: '10px 14px 4px', margin: 0 }}>
                  {contextLabel}
                </p>
                {contextArticles.map(a => (
                  <Link key={a.slug} href={`/help/${a.slug}`} onClick={() => setOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', textDecoration: 'none', borderBottom: `1px solid ${BD}`, transition: 'background 100ms' }}
                    onMouseEnter={e => (e.currentTarget.style.background = BG)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: TX, lineHeight: 1.35, marginBottom: 2 }}>{a.title}</div>
                      <div style={{ fontSize: 11, color: TX3 }}>{tc('help_helpwidget.minRead', { min: a.readTime })}</div>
                    </div>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={TX3} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                ))}

                {/* Quick links */}
                <p style={{ fontSize: 10, fontWeight: 700, color: TX3, textTransform: 'uppercase', letterSpacing: '.08em', padding: '10px 14px 4px', margin: 0 }}>
                  {tc('help_helpwidget.quickLinks')}
                </p>
                {QUICK_LINKS.map(l => (
                  <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 14px', textDecoration: 'none', borderBottom: `1px solid ${BD}`, fontSize: 13, color: TX2, transition: 'background 100ms' }}
                    onMouseEnter={e => (e.currentTarget.style.background = BG)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    {l.label}
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={TX3} strokeWidth="2" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                ))}
              </>
            )}
          </div>

          {/* Footer */}
          <div style={{ padding: '10px 14px', borderTop: `1px solid ${BD}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/help" onClick={() => setOpen(false)}
              style={{ fontSize: 12, color: ACC, fontWeight: 600, textDecoration: 'none' }}>
              {tc('help_helpwidget.fullHelpCentre')}
            </Link>
            <a href="mailto:hello@askbiz.co"
              style={{ fontSize: 12, color: TX3, textDecoration: 'none' }}>
              {tc('help_helpwidget.emailSupport')}
            </a>
          </div>
        </div>
      )}

      {/* ── Toggle button ── */}
      <button
        onClick={handleToggleClick}
        {...(voiceNavActive ? {
          onPointerDown: handlePointerDown,
          onPointerUp: handlePointerUp,
          onPointerCancel: handlePointerCancelOrLeave,
          onPointerLeave: handlePointerCancelOrLeave,
          onKeyDown: handleToggleKeyDown,
          onKeyUp: handleToggleKeyUp,
        } : {})}
        aria-label={ARIA_LABEL_FOR_STATE[voiceState] ?? (open ? tc('help_helpwidget.closeHelp') : (voiceNavActive ? tc('help_helpwidget.voiceStartAria') : tc('help_helpwidget.openHelp')))}
        aria-keyshortcuts={voiceNavActive ? 'Control+Shift+V' : undefined}
        aria-describedby={voiceNavActive && tooltipText ? 'help-widget-voice-hint' : undefined}
        style={{
          width: 44, height: 44, borderRadius: '50%',
          background: voiceBg(voiceState, open),
          border: 'none',
          color: SF, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: voiceState === 'listening' ? '0 0 0 0 rgba(220,38,38,.55)' : '0 4px 16px rgba(208,138,89,.4)',
          fontSize: open ? 20 : 18, fontWeight: 700,
          transition: 'background .2s, transform .15s, opacity .15s',
          fontFamily: 'inherit',
          animation: voiceState === 'listening' ? 'voiceListenPulse 1.4s ease-out infinite' : 'none',
          touchAction: voiceNavActive ? 'none' : 'auto',
          // Semi-transparent at rest so it reads as a lightweight floating aid rather
          // than competing with page content; full opacity whenever it's actually in
          // use (hover/focus, the help panel is open, or any non-idle voice state).
          opacity: (showTooltip || open || voiceState !== 'idle') ? 1 : 0.6,
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; setShowTooltip(true) }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; setShowTooltip(false) }}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
      >
        {renderGlyph(voiceState, open, voiceNavActive)}
      </button>
      {/* ── Confirm popover (force-visible; supersedes tooltip/recent-commands) ── */}
      {voiceState === 'confirm' && pendingConfirm && (
        <div
          role="alertdialog"
          aria-label={tc('help_helpwidget.voiceConfirmPrompt', { label: pendingConfirm.label })}
          style={{
            position: 'absolute', bottom: 56, right: 0, minWidth: 200, maxWidth: 260,
            background: SF, border: `1px solid ${BD}`, borderRadius: 12,
            boxShadow: '0 8px 28px rgba(0,0,0,.18)', padding: '10px 12px',
            fontFamily: 'Sora, system-ui', zIndex: 20,
          }}
        >
          <p style={{ margin: '0 0 8px', color: TX, fontSize: 12.5, lineHeight: 1.4 }}>
            {tc('help_helpwidget.voiceConfirmPrompt', { label: pendingConfirm.label })}
          </p>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              ref={confirmYesRef}
              onClick={confirmPendingNav}
              aria-label={tc('help_helpwidget.voiceConfirmYesAria', { label: pendingConfirm.label })}
              style={{
                flex: 1, padding: '6px 10px', borderRadius: 8, border: 'none',
                background: ACC, color: SF, fontWeight: 700, fontSize: 12,
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              {tc('help_helpwidget.voiceConfirmYes')}
            </button>
            <button
              onClick={rejectPendingNav}
              aria-label={tc('help_helpwidget.voiceConfirmNoAria', { label: pendingConfirm.label })}
              style={{
                flex: 1, padding: '6px 10px', borderRadius: 8, border: `1px solid ${BD}`,
                background: SF, color: TX2, fontWeight: 600, fontSize: 12,
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              {tc('help_helpwidget.voiceConfirmNo')}
            </button>
          </div>
        </div>
      )}

      {/* ── Tooltip / recent-commands (hover/focus-gated; hidden while confirm is showing) ──
          One shared popover container: recent-commands chips (only when non-empty) stacked
          above the existing plain tooltip text (only when present), separated by a hairline
          divider when both are shown. When recentCommands is empty this renders byte-identical
          to the original tooltip-only box. Force-hidden while voiceState === 'confirm' so the
          two hover-triggered UI pieces never collide with the always-visible confirm popover. */}
      {voiceState !== 'confirm' && (tooltipText || recentCommands.length > 0) && (() => {
        const tooltipVisible = showTooltip && voiceState === 'idle'
        return (
        <div
          id="help-widget-voice-hint"
          // role="tooltip" content must be non-interactive per WAI-ARIA authoring practices;
          // the recent-command chips below are real <button>s, so this container can only use
          // role="tooltip" when it's rendering the plain-text hint alone. With chips present,
          // fall back to role="group" so assistive tech still exposes and lets users reach them.
          role={recentCommands.length > 0 ? 'group' : 'tooltip'}
          aria-label={recentCommands.length > 0 ? tc('help_helpwidget.voiceRecentLabel') : undefined}
          style={{
            position: 'absolute', bottom: 56, right: 0, minWidth: recentCommands.length > 0 ? 170 : undefined,
            background: TX, color: SF, fontFamily: 'Sora, system-ui',
            borderRadius: 10, boxShadow: '0 4px 12px rgba(0,0,0,.2)', overflow: 'hidden',
            ...(tooltipVisible ? null : {
              position: 'absolute', width: 1, height: 1, padding: 0, margin: -1,
              overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0,
              background: 'transparent', color: 'transparent', boxShadow: 'none',
            }),
          }}
        >
          {recentCommands.length > 0 && (
            <div style={{ padding: '8px 8px 6px', display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 10, fontWeight: 700, opacity: .6, textTransform: 'uppercase', letterSpacing: '.06em', padding: '0 2px' }}>
                {tc('help_helpwidget.voiceRecentLabel')}
              </span>
              {recentCommands.map(c => (
                <button
                  key={c.route}
                  onClick={() => runRecentCommand(c.route)}
                  // Removed from the tab order while the container is visually clipped to
                  // 1x1px (not hovered/focused) — otherwise keyboard focus can land on an
                  // invisible chip with no visible focus indicator on screen.
                  tabIndex={tooltipVisible ? 0 : -1}
                  style={{
                    textAlign: 'left', background: 'rgba(255,255,255,.12)', border: 'none',
                    borderRadius: 999, padding: '5px 10px', color: SF, fontSize: 12,
                    fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
          {tooltipText && (
            <div style={{
              padding: '6px 10px', fontSize: 11, whiteSpace: 'nowrap',
              borderTop: recentCommands.length > 0 ? '1px solid rgba(255,255,255,.15)' : 'none',
            }}>
              {tooltipText}
            </div>
          )}
        </div>
        )
      })()}
      <span role="status" aria-live="polite" style={{
        position: 'absolute', width: 1, height: 1, padding: 0, margin: -1,
        overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0,
      }}>
        {ARIA_LIVE_TEXT[voiceState]}
      </span>
    </div>
  )
}
