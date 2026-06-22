'use client'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { Lang } from '@/lib/i18n'
import { LANG_NAMES, LANG_FLAGS, RTL_LANGS } from '@/lib/i18n'
import { t as catalogT } from '@/lib/i18n-catalog'
import { formatCurrency, formatNumber, formatPercent, formatDate, formatDateTime } from '@/lib/i18n-format'

interface LangContextType {
  lang: Lang
  setLang: (l: Lang) => void
  /** Catalogue lookup, namespaced keys e.g. tc('common.save'). Falls back to English. */
  tc: (key: string, vars?: Record<string, string | number>) => string
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
  tc: (key) => catalogT('en', key),
  fmtCurrency: (n, c) => formatCurrency('en', n, c),
  fmtNumber: (n) => formatNumber('en', n),
  fmtPercent: (f) => formatPercent('en', f),
  fmtDate: (d) => formatDate('en', d),
  fmtDateTime: (d) => formatDateTime('en', d),
  isRTL: false,
  langNames: LANG_NAMES,
  langFlags: LANG_FLAGS,
})

export function LanguageProvider({ children, initialLang = 'en' }: { children: React.ReactNode; initialLang?: Lang | string }) {
  const [lang, setLangState] = useState<Lang>((initialLang as Lang) || 'en')

  // POS app is a separate deployment with no profile endpoint — locale lives in
  // the askbiz_lang cookie only.
  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    document.cookie = 'askbiz_lang=' + l + ';path=/;max-age=' + (60 * 60 * 24 * 30) + ';SameSite=Lax'
    document.documentElement.dir = RTL_LANGS.includes(l) ? 'rtl' : 'ltr'
    document.documentElement.lang = l
  }, [])

  useEffect(() => {
    document.documentElement.dir = RTL_LANGS.includes(lang) ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang])

  const tc = useCallback((key: string, vars?: Record<string, string | number>) => catalogT(lang, key, vars), [lang])
  const fmtCurrency = useCallback((n: number, currency?: string, opts?: Intl.NumberFormatOptions) => formatCurrency(lang, n, currency, opts), [lang])
  const fmtNumber = useCallback((n: number, opts?: Intl.NumberFormatOptions) => formatNumber(lang, n, opts), [lang])
  const fmtPercent = useCallback((f: number, opts?: Intl.NumberFormatOptions) => formatPercent(lang, f, opts), [lang])
  const fmtDate = useCallback((d: Date | string | number, opts?: Intl.DateTimeFormatOptions) => formatDate(lang, d, opts), [lang])
  const fmtDateTime = useCallback((d: Date | string | number) => formatDateTime(lang, d), [lang])

  return (
    <LangContext.Provider value={{
      lang, setLang, tc, fmtCurrency, fmtNumber, fmtPercent, fmtDate, fmtDateTime,
      isRTL: RTL_LANGS.includes(lang), langNames: LANG_NAMES, langFlags: LANG_FLAGS,
    }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() { return useContext(LangContext) }
