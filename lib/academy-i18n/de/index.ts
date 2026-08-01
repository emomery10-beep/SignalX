// Academy article translations — Deutsch (de).
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
import { waveABatch1Translations } from './wave-a-batch1'
import { waveABatch2Translations } from './wave-a-batch2'
import { waveABatch3Translations } from './wave-a-batch3'
import { waveABatch4NewArticlesTranslations } from './wave-a-batch4-new-articles'
import { waveB1Translations } from './wave-b-batch1'
import { waveB2Translations } from './wave-b-batch2'
import { waveB3Translations } from './wave-b-batch3'
import { waveB4Translations } from './wave-b-batch4'
import { waveB5Translations } from './wave-b-batch5'
import { waveB6Translations } from './wave-b-batch6'
import { waveC2Translations } from './wave-c-batch2'
import { waveC3Translations } from './wave-c-batch3'
import { waveC5Translations } from './wave-c-batch5'
import { waveC6Translations } from './wave-c-batch6'

export const translations: LocaleTranslations = {
  ...waveABatch1Translations,
  ...waveABatch2Translations,
  ...waveABatch3Translations,
  ...waveABatch4NewArticlesTranslations,
  ...waveB1Translations,
  ...waveB2Translations,
  ...waveB3Translations,
  ...waveB4Translations,
  ...waveB5Translations,
  ...waveB6Translations,
  ...waveC2Translations,
  ...waveC3Translations,
  ...waveC5Translations,
  ...waveC6Translations,
}
