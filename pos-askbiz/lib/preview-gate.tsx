'use client'
// ─────────────────────────────────────────────────────────────────────────────
// Safety gate for /preview/** demo routes. pos-askbiz's build IS the real
// staff-facing production artifact (unlike the root app's app/pos-preview,
// which can just be deleted before deploy), so this is the load-bearing check
// that keeps the demo out of a real production deploy.
//
// NEVER set NEXT_PUBLIC_ENABLE_STAFF_PREVIEW in the real production Vercel
// project's env vars — it exists only to let a *staging* deploy intentionally
// expose the preview (e.g. to demo to a client without running `next dev`).
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, type ReactNode } from 'react'
import { useLang } from '@/components/LanguageProvider'
import { isActiveLocale } from '@/lib/i18n-locale'
import type { Lang } from '@/lib/i18n'

export const PREVIEW_ENABLED =
  process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_ENABLE_STAFF_PREVIEW === '1'

// When the preview is embedded as an iframe (e.g. the askbiz.co landing hero),
// the host passes ?lang=<locale> so the demo renders in the visitor's language —
// the shared askbiz_lang cookie is unreliable inside a cross-origin iframe.
function PreviewLocaleSync() {
  const { lang, setLang } = useLang()
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('lang')
    if (q && q !== lang && isActiveLocale(q)) setLang(q as Lang)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}

export function PreviewGate({ children }: { children: ReactNode }) {
  if (!PREVIEW_ENABLED) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif', color: '#666', textAlign: 'center', padding: 24,
      }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: '#1a1916' }}>Preview not available</div>
          <div style={{ fontSize: 13 }}>This demo route is disabled in production.</div>
        </div>
      </div>
    )
  }
  return <><PreviewLocaleSync />{children}</>
}

/** Matches the PREVIEW MODE banner style used by the root app's app/pos-preview/page.tsx. */
export function PreviewBanner({ label }: { label: string }) {
  return (
    <div style={{ background: '#1a1916', color: '#fff', padding: '8px 16px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 10, position: 'sticky', top: 0, zIndex: 50 }}>
      <strong>PREVIEW MODE</strong>
      <span style={{ opacity: 0.7 }}>Mock data · fetches intercepted · does not touch production · {label}</span>
    </div>
  )
}
