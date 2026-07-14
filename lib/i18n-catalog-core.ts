// Pure, dict-based translation resolution shared by the SERVER catalog API
// (lib/i18n-catalog.ts) and the CLIENT provider (components/LanguageProvider).
//
// No locale data is imported here — callers pass in the already-loaded dict(s).
// This is what makes code-splitting possible: the resolution logic is separate
// from the (large) catalog data, so a page can ship only its active locale.
//
// Fallback chain matches the original catalog exactly:
//   active locale → English → the key itself.

export type Dict = Record<string, unknown>
/** namespace -> nested translation object, e.g. { landing: {...}, common: {...} } */
export type LocaleDict = Record<string, Dict>

const BASE = 'en'
export { BASE }

function resolve(dict: LocaleDict | undefined, key: string): string | undefined {
  if (!dict) return undefined
  const dot = key.indexOf('.')
  if (dot === -1) return undefined
  const ns = key.slice(0, dot)
  const path = key.slice(dot + 1)
  let node: unknown = dict[ns]
  if (node === undefined) return undefined
  for (const seg of path.split('.')) {
    if (node && typeof node === 'object' && seg in (node as Dict)) node = (node as Dict)[seg]
    else return undefined
  }
  return typeof node === 'string' ? node : undefined
}

function resolveList(dict: LocaleDict | undefined, key: string): string[] | undefined {
  if (!dict) return undefined
  const dot = key.indexOf('.')
  if (dot === -1) return undefined
  const ns = key.slice(0, dot)
  const path = key.slice(dot + 1)
  let node: unknown = dict[ns]
  if (node === undefined) return undefined
  for (const seg of path.split('.')) {
    if (node && typeof node === 'object' && seg in (node as Dict)) node = (node as Dict)[seg]
    else return undefined
  }
  return Array.isArray(node) ? (node as string[]) : undefined
}

function interpolate(s: string, vars?: Record<string, string | number>): string {
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v))
  return s
}

/** String lookup with active→English→key fallback and {var} interpolation. */
export function tFrom(active: LocaleDict | undefined, en: LocaleDict | undefined, key: string, vars?: Record<string, string | number>): string {
  const s = resolve(active, key) ?? resolve(en, key) ?? key
  return interpolate(s, vars)
}

/** Array-shaped lookup (e.g. a plan's feature list), active→English→[]. */
export function tListFrom(active: LocaleDict | undefined, en: LocaleDict | undefined, key: string): string[] {
  return resolveList(active, key) ?? resolveList(en, key) ?? []
}

/** True when the key is genuinely translated in `active` (not falling back to English). */
export function isTranslatedIn(active: LocaleDict | undefined, key: string): boolean {
  return resolve(active, key) !== undefined
}
