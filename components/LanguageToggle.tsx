'use client'
import { useState, useRef, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useLang } from '@/components/LanguageProvider'
import type { Lang } from '@/lib/i18n'
import { ACTIVE_LOCALES, localePath, isAppPath, type Locale } from '@/lib/i18n-locale'

// The launch set only — en, es, fr, de, nl, ar. Single source of truth in
// lib/i18n-locale, so adding a language updates the switcher automatically.
const LANGS: Lang[] = ACTIVE_LOCALES as Lang[]

export default function LanguageToggle({ compact }: { compact?: boolean }) {
  const { lang, setLang, langNames, langFlags, tc } = useLang()
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [dropUp, setDropUp] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Flip the menu upward when the button sits near the bottom of the viewport
  // (e.g. the sidebar footer) so it never opens off-screen.
  const toggleOpen = () => {
    setOpen(o => {
      if (!o && ref.current) {
        const spaceBelow = window.innerHeight - ref.current.getBoundingClientRect().bottom
        setDropUp(spaceBelow < 220)
      }
      return !o
    })
  }

  // Switching updates provider state + cookie + profile. App routes are
  // cookie-driven, so we just refresh to re-render the server tree in the new
  // language (URL stays unprefixed). Public routes are URL-driven, so we navigate
  // to the locale-prefixed URL, preserving the live query + hash.
  const choose = (l: Lang) => {
    setLang(l)
    setOpen(false)
    if (isAppPath(pathname || '/')) {
      router.refresh()
    } else {
      const full = (pathname || '/') + (typeof window !== 'undefined' ? window.location.search + window.location.hash : '')
      router.push(localePath(full, l as Locale))
    }
  }

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative', zIndex: 50 }}>
      {/* Toggle button */}
      <button
        onClick={toggleOpen}
        aria-label={tc('lang_toggle.changeLanguage')}
        title={tc('lang_toggle.changeLanguage')}
        style={compact ? {
          width: 30, height: 30, borderRadius: 7,
          border: 'none', background: 'transparent',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, lineHeight: 1, padding: 0,
          transition: 'background 150ms',
        } : {
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '5px 10px', borderRadius: 9999,
          border: '1px solid var(--b2, rgba(255,255,255,.12))',
          background: 'transparent',
          color: 'var(--tx2, rgba(255,255,255,.7))',
          fontSize: 14, fontWeight: 500,
          cursor: 'pointer', fontFamily: 'inherit',
          transition: 'all 150ms',
        }}
        onMouseEnter={e => {
          if (compact) e.currentTarget.style.background = 'var(--ev)'
          else e.currentTarget.style.borderColor = 'var(--b, rgba(255,255,255,.25))'
        }}
        onMouseLeave={e => {
          if (compact) e.currentTarget.style.background = 'transparent'
          else e.currentTarget.style.borderColor = 'var(--b2, rgba(255,255,255,.12))'
        }}
      >
        <span style={{ fontSize: compact ? 16 : 14 }}>{langFlags[lang]}</span>
        {!compact && <span>{lang.toUpperCase()}</span>}
        {!compact && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }}>
            <path d="M6 9l6 6 6-6"/>
          </svg>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute',
          ...(dropUp ? { bottom: 'calc(100% + 6px)' } : { top: 'calc(100% + 6px)' }),
          ...(lang === 'ar' ? { left: 0 } : { right: 0 }),
          background: 'var(--sf, #1a1a2e)', border: '1px solid var(--b, rgba(255,255,255,.12))',
          borderRadius: 12, padding: 6,
          // Single column, not a 2-up grid: the long names (Kiswahili,
          // Soomaali) forced each cell wider than minWidth under
          // whiteSpace:nowrap, which is what was pushing the whole menu past
          // the viewport edge near the button. A vertical list has no such
          // per-row width negotiation, and the maxWidth clamp below is a
          // hard backstop regardless of content length.
          width: 'max-content', minWidth: 150, maxWidth: 'min(220px, calc(100vw - 24px))',
          boxShadow: '0 8px 32px rgba(0,0,0,.4)',
          display: 'flex', flexDirection: 'column', gap: 2,
          maxHeight: 'min(60vh, 340px)', overflowY: 'auto', overflowX: 'hidden',
        }}>
          {LANGS.map(l => (
            <button
              key={l}
              onClick={() => choose(l)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 10px', borderRadius: 8, border: 'none',
                background: lang === l ? 'rgba(99,102,241,.15)' : 'transparent',
                color: lang === l ? '#6366F1' : 'var(--tx, #fff)',
                fontSize: 14, fontWeight: lang === l ? 600 : 400,
                cursor: 'pointer', fontFamily: 'inherit',
                justifyContent: 'flex-start', textAlign: 'left', whiteSpace: 'nowrap',
                transition: 'background 120ms',
              }}
              onMouseEnter={e => { if (lang !== l) e.currentTarget.style.background = 'rgba(255,255,255,.06)' }}
              onMouseLeave={e => { if (lang !== l) e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{ fontSize: 14 }}>{langFlags[l]}</span>
              <span>{langNames[l]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
