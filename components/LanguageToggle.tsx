'use client'
import { useState, useRef, useEffect } from 'react'
import { useLang } from '@/components/LanguageProvider'
import type { Lang } from '@/lib/i18n'

const LANGS: Lang[] = ['en', 'fr', 'de', 'es', 'ar', 'sw', 'pt', 'nl', 'it', 'pl']

export default function LanguageToggle() {
  const { lang, setLang, langNames, langFlags } = useLang()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

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
        onClick={() => setOpen(o => !o)}
        title="Change language"
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '5px 10px', borderRadius: 9999,
          border: '1px solid var(--b2, rgba(255,255,255,.12))',
          background: 'transparent',
          color: 'var(--tx2, rgba(255,255,255,.7))',
          fontSize: 12, fontWeight: 500,
          cursor: 'pointer', fontFamily: 'inherit',
          transition: 'all 150ms',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--b, rgba(255,255,255,.25))')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--b2, rgba(255,255,255,.12))')}
      >
        <span style={{ fontSize: 14 }}>{langFlags[lang]}</span>
        <span>{lang.toUpperCase()}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0,
          background: 'var(--sf, #1a1a2e)', border: '1px solid var(--b, rgba(255,255,255,.12))',
          borderRadius: 12, padding: 6, minWidth: 160,
          boxShadow: '0 8px 32px rgba(0,0,0,.4)',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2,
        }}>
          {LANGS.map(l => (
            <button
              key={l}
              onClick={() => { setLang(l); setOpen(false) }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 10px', borderRadius: 8, border: 'none',
                background: lang === l ? 'rgba(99,102,241,.15)' : 'transparent',
                color: lang === l ? '#6366F1' : 'var(--tx, #fff)',
                fontSize: 12, fontWeight: lang === l ? 600 : 400,
                cursor: 'pointer', fontFamily: 'inherit',
                textAlign: 'left', whiteSpace: 'nowrap',
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
