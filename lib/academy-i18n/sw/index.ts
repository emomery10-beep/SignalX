// Academy article translations — Kiswahili (sw).
//
// Empty for now: zero Academy articles have been translated into this
// locale yet. lib/academy-i18n-loader.ts falls back to the English article
// for every slug/field until entries are added below.
//
// Translation-wave sessions: see lib/academy-i18n/README.md for the full
// contract. In short, add real `slug -> TranslatableFields` entries directly
// to (or merged into) the `translations` export below — do NOT create a new
// per-article file. If a batch is large enough to warrant its own file
// (e.g. `./batch-001-pos.ts` exporting its own `Record<string,
// Partial<TranslatableFields>>`), merge it in here, e.g.:
//
//   import { batch001 } from './batch-001-pos'
//   export const translations: LocaleTranslations = { ...batch001 }
//
// with later batches spread in the same way as they land.

import type { LocaleTranslations } from '../../academy-i18n-loader'

export const translations: LocaleTranslations = {}
