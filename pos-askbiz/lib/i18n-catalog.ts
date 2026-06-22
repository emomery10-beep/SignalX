// Catalogue-backed translation lookup for the POS app, with graceful fallback:
//   requested locale → English → the key itself.
// Keys are "<namespace>.<path>" mapping to locales/<loc>/<ns>.json.
// Add a namespace: create its JSON per locale + register it in CATALOG below.
import type { Lang } from './i18n'

import enCommon from '@/locales/en/common.json'

type Dict = Record<string, unknown>

const CATALOG: Record<string, Record<string, Dict>> = {
  en: { common: enCommon },
}

const BASE = 'en'

function resolve(locale: string, key: string): string | undefined {
  const dot = key.indexOf('.')
  if (dot === -1) return undefined
  const ns = key.slice(0, dot)
  const path = key.slice(dot + 1)
  const dict = CATALOG[locale]?.[ns]
  if (!dict) return undefined
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

export type { Lang }
