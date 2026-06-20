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

type Dict = Record<string, unknown>

const CATALOG: Record<string, Record<string, Dict>> = {
  en: { common: enCommon },
  es: { common: esCommon },
  fr: { common: frCommon },
  de: { common: deCommon },
  nl: { common: nlCommon },
  ar: { common: arCommon },
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
