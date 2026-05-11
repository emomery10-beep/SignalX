'use client'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { Lang, TranslationKey } from '@/lib/i18n'
import { TRANSLATIONS, LANG_NAMES, LANG_FLAGS, RTL_LANGS, t as tFn } from '@/lib/i18n'

interface LangContextType {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: TranslationKey, vars?: Record<string,string>) => string
  isRTL: boolean
  langNames: typeof LANG_NAMES
  langFlags: typeof LANG_FLAGS
}

const LangContext = createContext<LangContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key) => TRANSLATIONS['en'][key] ?? key,
  isRTL: false,
  langNames: LANG_NAMES,
  langFlags: LANG_FLAGS,
})

export function LanguageProvider({ children, initialLang = 'en' }: { children: React.ReactNode; initialLang?: Lang | string }) {
  const [lang, setLangState] = useState<Lang>((initialLang as Lang) || 'en')

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

  const t = useCallback((key: TranslationKey, vars?: Record<string,string>) => tFn(lang, key, vars), [lang])

  return (
    <LangContext.Provider value={{ lang, setLang, t, isRTL: RTL_LANGS.includes(lang), langNames: LANG_NAMES, langFlags: LANG_FLAGS }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() { return useContext(LangContext) }
