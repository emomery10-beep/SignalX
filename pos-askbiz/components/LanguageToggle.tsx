'use client'
import { useState, useRef, useEffect } from 'react'
import { useLang } from '@/components/LanguageProvider'
import { ACTIVE_LOCALES } from '@/lib/i18n-locale'
import type { Lang } from '@/lib/i18n'

// Compact language switcher for the POS app. The POS app is cookie-driven
// (no URL prefix), so switching just calls setLang (cookie + re-render).
export default function LanguageToggle() {
  const { lang, setLang, langNames, langFlags } = useLang()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} style={{ position: 'fixed', top: 10, right: 12, zIndex: 1000 }}>
      <button
        onClick={() => setOpen(o => !o)}
        title="Change language"
        style={{
          display: 'flex', alignItems: 'center', gap: 5, padding: '5px 9px',
          borderRadius: 9999, border: '1px solid rgba(0,0,0,.12)',
          background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(8px)',
          color: '#1a1916', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          fontFamily: 'inherit', boxShadow: '0 1px 4px rgba(0,0,0,.08)',
        }}
      >
        <span style={{ fontSize: 14 }}>{langFlags[lang as Lang]}</span>
        <span>{(lang as string).toUpperCase()}</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0,
          background: '#fff', border: '1px solid rgba(0,0,0,.1)', borderRadius: 12,
          padding: 6, minWidth: 150, boxShadow: '0 8px 28px rgba(0,0,0,.18)',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2,
        }}>
          {(ACTIVE_LOCALES as Lang[]).map(l => (
            <button
              key={l}
              onClick={() => { setLang(l); setOpen(false) }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px',
                borderRadius: 8, border: 'none', cursor: 'pointer', textAlign: 'left',
                background: l === lang ? 'rgba(208,138,89,.12)' : 'transparent',
                color: '#1a1916', fontSize: 13, fontWeight: l === lang ? 700 : 500,
                fontFamily: 'inherit',
              }}
            >
              <span>{langFlags[l]}</span>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{langNames[l]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
