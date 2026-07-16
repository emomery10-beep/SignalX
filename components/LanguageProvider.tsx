'use client'
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import type { Lang, TranslationKey } from '@/lib/i18n'
import { TRANSLATIONS, LANG_NAMES, LANG_FLAGS, RTL_LANGS, t as tFn } from '@/lib/i18n'
import { tFrom, type LocaleDict } from '@/lib/i18n-catalog-core'
import { primeLocale, getCachedLocale, loadLocale } from '@/lib/catalog-client'
import { formatCurrency, formatNumber, formatDate, formatDateTime, formatPercent } from '@/lib/i18n-format'
import { PREFIXED_LOCALES } from '@/lib/i18n-locale'

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
  // No catalog available outside a provider — return the key unchanged.
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

export function LanguageProvider({
  children,
  initialLang = 'en',
  initialCatalog,
  enCatalog,
}: {
  children: React.ReactNode
  initialLang?: Lang | string
  /** Active locale's catalog, delivered by the server for zero-fetch first paint. */
  initialCatalog?: LocaleDict
  /** English catalog for fallback (only sent when initialLang !== 'en'). */
  enCatalog?: LocaleDict
}) {
  const [lang, setLangState] = useState<Lang>((initialLang as Lang) || 'en')
  // Bumped whenever a locale chunk finishes loading, to re-run tc/tList callbacks.
  const [tick, setTick] = useState(0)
  const pathname = usePathname()

  // Prime the client cache from the server-rendered props. Runs on both the
  // server render and client hydration with identical data, so tc() produces
  // identical output on both sides (no hydration mismatch). Idempotent.
  primeLocale((initialLang as string) || 'en', initialCatalog)
  primeLocale('en', enCatalog ?? ((initialLang as string) === 'en' ? initialCatalog : undefined))

  // Sync lang from URL prefix on every client-side navigation.
  // Without this, soft-navigating from /glossary (en) to /ar/glossary keeps lang='en'
  // because the root layout doesn't re-mount across navigations.
  useEffect(() => {
    const seg = pathname.split('/')[1]
    if ((PREFIXED_LOCALES as readonly string[]).includes(seg) && seg !== lang) {
      setLangState(seg as Lang)
    }
  }, [pathname])

  // When the active locale isn't cached yet (e.g. after a client-side switch or
  // geo auto-detect), lazy-load its chunk and re-render. Until it lands, tc()
  // falls back to English — never a blank or a raw key.
  useEffect(() => {
    let cancelled = false
    const needed: string[] = []
    if (!getCachedLocale(lang)) needed.push(lang)
    if (!getCachedLocale('en')) needed.push('en')
    if (needed.length === 0) return
    Promise.all(needed.map(loadLocale)).then(() => { if (!cancelled) setTick((t) => t + 1) })
    return () => { cancelled = true }
  }, [lang])

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
  // tc resolves against the (cached) active locale then English. `tick` is a
  // dependency so the callback refreshes once a lazily-loaded chunk arrives.
  const tc = useCallback(
    (key: string, vars?: Record<string, string | number>) => tFrom(getCachedLocale(lang), getCachedLocale('en'), key, vars),
    [lang, tick],
  )
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
 *  the LangContext for its subtree, so the surrounding page keeps its own lang.
 *
 *  The server parent passes the resolved `dict` (and `enDict` for fallback) so
 *  the widget renders correctly during SSR without shipping every locale. */
export function ScopedLangProvider({
  lang,
  dict,
  enDict,
  children,
}: {
  lang: Lang
  dict?: LocaleDict
  enDict?: LocaleDict
  children: React.ReactNode
}) {
  const [tick, setTick] = useState(0)

  // Prime from props so tc resolves on both server and client.
  primeLocale(lang, dict)
  primeLocale('en', enDict)

  // Defensive: if a caller didn't pass dicts, lazy-load them on the client.
  useEffect(() => {
    let cancelled = false
    const needed: string[] = []
    if (!getCachedLocale(lang)) needed.push(lang)
    if (!getCachedLocale('en')) needed.push('en')
    if (needed.length === 0) return
    Promise.all(needed.map(loadLocale)).then(() => { if (!cancelled) setTick((t) => t + 1) })
    return () => { cancelled = true }
  }, [lang])

  const value = useMemo<LangContextType>(() => ({
    lang,
    setLang: () => {},
    t: (key, vars) => tFn(lang, key, vars),
    tc: (key, vars) => tFrom(getCachedLocale(lang) ?? dict, getCachedLocale('en') ?? enDict, key, vars),
    fmtCurrency: (n, currency, opts) => formatCurrency(lang, n, currency, opts),
    fmtNumber: (n, opts) => formatNumber(lang, n, opts),
    fmtPercent: (f, opts) => formatPercent(lang, f, opts),
    fmtDate: (d, opts) => formatDate(lang, d, opts),
    fmtDateTime: (d) => formatDateTime(lang, d),
    isRTL: RTL_LANGS.includes(lang),
    langNames: LANG_NAMES,
    langFlags: LANG_FLAGS,
  }), [lang, dict, enDict, tick])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}
