'use client'
import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { usePathname } from 'next/navigation'
import type { Lang, TranslationKey } from '@/lib/i18n'
import { TRANSLATIONS, LANG_NAMES, LANG_FLAGS, RTL_LANGS, t as tFn } from '@/lib/i18n'
import { loadLocaleCatalog, tFromCatalogs, type LocaleCatalog } from '@/lib/i18n-catalog-loader'
import { formatCurrency, formatNumber, formatDate, formatDateTime, formatPercent } from '@/lib/i18n-format'

// Non-default locale prefixes that appear in the URL
const URL_PREFIXED_LOCALES = ['es', 'fr', 'de', 'nl', 'ar'] as const

export type Catalogs = Partial<Record<string, LocaleCatalog>>

interface LangContextType {
  lang: Lang
  setLang: (l: Lang) => void
  /** Landing-page typed keys (legacy). */
  t: (key: TranslationKey, vars?: Record<string, string>) => string
  /** App-wide catalogue lookup, namespaced keys e.g. tc('common.save'). Falls back to English. */
  tc: (key: string, vars?: Record<string, string | number>) => string
  /** Locale-aware formatters bound to the current language. */
  fmtCurrency: (n: number, currency?: string, opts?: Intl.NumberFormatOptions) => string
  fmtNumber: (n: number, opts?: Intl.NumberFormatOptions) => string
  fmtPercent: (fraction: number, opts?: Intl.NumberFormatOptions) => string
  fmtDate: (d: Date | string | number, opts?: Intl.DateTimeFormatOptions) => string
  fmtDateTime: (d: Date | string | number) => string
  isRTL: boolean
  langNames: typeof LANG_NAMES
  langFlags: typeof LANG_FLAGS
}

const LangContext = createContext<LangContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key) => TRANSLATIONS['en'][key] ?? key,
  tc: (key) => key,
  fmtCurrency: (n, c) => formatCurrency('en', n, c),
  fmtNumber: (n) => formatNumber('en', n),
  fmtPercent: (f) => formatPercent('en', f),
  fmtDate: (d) => formatDate('en', d),
  fmtDateTime: (d) => formatDateTime('en', d),
  isRTL: false,
  langNames: LANG_NAMES,
  langFlags: LANG_FLAGS,
})

// Loads the catalog(s) needed to render `lang` (English fallback + the active
// locale) that aren't already present, and merges them into state once ready.
// Shared by LanguageProvider and ScopedLangProvider so both lazy-load the same way.
function useCatalogs(lang: Lang, initialCatalogs?: Catalogs) {
  const [catalogs, setCatalogs] = useState<Catalogs>(initialCatalogs ?? {})
  const catalogsRef = useRef(catalogs)
  catalogsRef.current = catalogs

  useEffect(() => {
    let cancelled = false
    const need = (lang === 'en' ? ['en'] : ['en', lang]).filter(l => !catalogsRef.current[l])
    if (need.length === 0) return
    Promise.all(need.map(loadLocaleCatalog)).then(loaded => {
      if (cancelled) return
      setCatalogs(prev => {
        const next = { ...prev }
        need.forEach((l, i) => { next[l] = loaded[i] })
        return next
      })
    })
    return () => { cancelled = true }
  }, [lang])

  return catalogs
}

export function LanguageProvider({ children, initialLang = 'en', initialCatalogs }: { children: React.ReactNode; initialLang?: Lang | string; initialCatalogs?: Catalogs }) {
  const [lang, setLangState] = useState<Lang>((initialLang as Lang) || 'en')
  const catalogs = useCatalogs(lang, initialCatalogs)
  const pathname = usePathname()

  // Sync lang from URL prefix on every client-side navigation.
  // Without this, soft-navigating from /glossary (en) to /ar/glossary keeps lang='en'
  // because the root layout doesn't re-mount across navigations.
  useEffect(() => {
    const seg = pathname.split('/')[1]
    if ((URL_PREFIXED_LOCALES as readonly string[]).includes(seg) && seg !== lang) {
      setLangState(seg as Lang)
    }
  }, [pathname])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    document.cookie = 'askbiz_lang=' + l + ';path=/;max-age=' + (60 * 60 * 24 * 30) + ';SameSite=Lax'
    document.documentElement.dir = RTL_LANGS.includes(l) ? 'rtl' : 'ltr'
    document.documentElement.lang = l
    // Persist to the signed-in user's profile so the choice follows them across
    // devices. Fire-and-forget; ignored (401) for guests, who rely on the cookie.
    fetch('/api/locale', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale: l }),
      credentials: 'include',
    }).catch(() => {})
  }, [])

  useEffect(() => {
    document.documentElement.dir = RTL_LANGS.includes(lang) ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang])

  const t = useCallback((key: TranslationKey, vars?: Record<string, string>) => tFn(lang, key, vars), [lang])
  const tc = useCallback((key: string, vars?: Record<string, string | number>) => tFromCatalogs(catalogs, lang, key, vars), [lang, catalogs])
  const fmtCurrency = useCallback((n: number, currency?: string, opts?: Intl.NumberFormatOptions) => formatCurrency(lang, n, currency, opts), [lang])
  const fmtNumber = useCallback((n: number, opts?: Intl.NumberFormatOptions) => formatNumber(lang, n, opts), [lang])
  const fmtPercent = useCallback((f: number, opts?: Intl.NumberFormatOptions) => formatPercent(lang, f, opts), [lang])
  const fmtDate = useCallback((d: Date | string | number, opts?: Intl.DateTimeFormatOptions) => formatDate(lang, d, opts), [lang])
  const fmtDateTime = useCallback((d: Date | string | number) => formatDateTime(lang, d), [lang])

  return (
    <LangContext.Provider value={{
      lang, setLang, t, tc,
      fmtCurrency, fmtNumber, fmtPercent, fmtDate, fmtDateTime,
      isRTL: RTL_LANGS.includes(lang), langNames: LANG_NAMES, langFlags: LANG_FLAGS,
    }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() { return useContext(LangContext) }

/** Side-effect-free language scope for embedded widgets (e.g. the per-country
 *  live demo) that must render in a fixed language WITHOUT touching the
 *  visitor's askbiz_lang cookie, document.lang, or direction. It only overrides
 *  the LangContext for its subtree, so the surrounding page keeps its own lang. */
export function ScopedLangProvider({ lang, children, initialCatalogs }: { lang: Lang; children: React.ReactNode; initialCatalogs?: Catalogs }) {
  const catalogs = useCatalogs(lang, initialCatalogs)
  const value = useMemo<LangContextType>(() => ({
    lang,
    setLang: () => {},
    t: (key, vars) => tFn(lang, key, vars),
    tc: (key, vars) => tFromCatalogs(catalogs, lang, key, vars),
    fmtCurrency: (n, currency, opts) => formatCurrency(lang, n, currency, opts),
    fmtNumber: (n, opts) => formatNumber(lang, n, opts),
    fmtPercent: (f, opts) => formatPercent(lang, f, opts),
    fmtDate: (d, opts) => formatDate(lang, d, opts),
    fmtDateTime: (d) => formatDateTime(lang, d),
    isRTL: RTL_LANGS.includes(lang),
    langNames: LANG_NAMES,
    langFlags: LANG_FLAGS,
  }), [lang, catalogs])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}
