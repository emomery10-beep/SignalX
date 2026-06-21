// Catalogue-backed translation lookup with guaranteed graceful fallback.
//
//   t('es', 'common.save')                    → "Guardar"
//   t('de', 'common.save_changes')            → "Änderungen speichern"
//   t('fr', 'common.greeting', { name: 'Lee' })→ interpolates {name}
//
// Fallback chain (this is the "never break another language" guarantee):
//   requested locale → English → the key itself
// A missing translation shows English, never a crash or a blank. The self-audit
// (catalogue-parity gate) reports which keys are still falling back so they can
// be filled in, but the app keeps working in the meantime.
//
// Keys are "<namespace>.<path>", where namespace maps to locales/<loc>/<ns>.json.
// To add a namespace: create the JSON in every locale folder and register it
// in CATALOG below. The audit then enforces parity automatically.

import type { Lang } from './i18n'

import enCommon from '@/locales/en/common.json'
import esCommon from '@/locales/es/common.json'
import frCommon from '@/locales/fr/common.json'
import deCommon from '@/locales/de/common.json'
import nlCommon from '@/locales/nl/common.json'
import arCommon from '@/locales/ar/common.json'
import enNav from '@/locales/en/nav.json'
import esNav from '@/locales/es/nav.json'
import frNav from '@/locales/fr/nav.json'
import deNav from '@/locales/de/nav.json'
import nlNav from '@/locales/nl/nav.json'
import arNav from '@/locales/ar/nav.json'
import enErrors from '@/locales/en/errors.json'
import esErrors from '@/locales/es/errors.json'
import frErrors from '@/locales/fr/errors.json'
import deErrors from '@/locales/de/errors.json'
import nlErrors from '@/locales/nl/errors.json'
import arErrors from '@/locales/ar/errors.json'
import enAppnav from '@/locales/en/appnav.json'
import esAppnav from '@/locales/es/appnav.json'
import frAppnav from '@/locales/fr/appnav.json'
import deAppnav from '@/locales/de/appnav.json'
import nlAppnav from '@/locales/nl/appnav.json'
import arAppnav from '@/locales/ar/appnav.json'
import enAuth from '@/locales/en/auth.json'
import esAuth from '@/locales/es/auth.json'
import frAuth from '@/locales/fr/auth.json'
import deAuth from '@/locales/de/auth.json'
import nlAuth from '@/locales/nl/auth.json'
import arAuth from '@/locales/ar/auth.json'
import enPricing from '@/locales/en/pricing.json'
import esPricing from '@/locales/es/pricing.json'
import frPricing from '@/locales/fr/pricing.json'
import dePricing from '@/locales/de/pricing.json'
import nlPricing from '@/locales/nl/pricing.json'
import arPricing from '@/locales/ar/pricing.json'
import enCookies from '@/locales/en/cookies.json'
import esCookies from '@/locales/es/cookies.json'
import frCookies from '@/locales/fr/cookies.json'
import deCookies from '@/locales/de/cookies.json'
import nlCookies from '@/locales/nl/cookies.json'
import arCookies from '@/locales/ar/cookies.json'

type Dict = Record<string, unknown>

const CATALOG: Record<string, Record<string, Dict>> = {
  en: { common: enCommon, nav: enNav, errors: enErrors, appnav: enAppnav, auth: enAuth, pricing: enPricing, cookies: enCookies },
  es: { common: esCommon, nav: esNav, errors: esErrors, appnav: esAppnav, auth: esAuth, pricing: esPricing, cookies: esCookies },
  fr: { common: frCommon, nav: frNav, errors: frErrors, appnav: frAppnav, auth: frAuth, pricing: frPricing, cookies: frCookies },
  de: { common: deCommon, nav: deNav, errors: deErrors, appnav: deAppnav, auth: deAuth, pricing: dePricing, cookies: deCookies },
  nl: { common: nlCommon, nav: nlNav, errors: nlErrors, appnav: nlAppnav, auth: nlAuth, pricing: nlPricing, cookies: nlCookies },
  ar: { common: arCommon, nav: arNav, errors: arErrors, appnav: arAppnav, auth: arAuth, pricing: arPricing, cookies: arCookies },
}

const BASE = 'en'

function resolve(locale: string, key: string): string | undefined {
  const dot = key.indexOf('.')
  if (dot === -1) return undefined
  const ns = key.slice(0, dot)
  const path = key.slice(dot + 1)
  const dict = CATALOG[locale]?.[ns]
  if (!dict) return undefined
  // walk the remaining dotted path for nested namespaces
  let node: unknown = dict
  for (const seg of path.split('.')) {
    if (node && typeof node === 'object' && seg in (node as Dict)) node = (node as Dict)[seg]
    else return undefined
  }
  return typeof node === 'string' ? node : undefined
}

export function t(locale: string, key: string, vars?: Record<string, string | number>): string {
  let s = resolve(locale, key) ?? resolve(BASE, key) ?? key
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v))
  return s
}

// Returns true when a key is genuinely translated in the locale (not falling back).
export function hasTranslation(locale: string, key: string): boolean {
  return locale === BASE || resolve(locale, key) !== undefined
}

export type { Lang }
