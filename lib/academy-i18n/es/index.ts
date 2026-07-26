// Academy article translations — Español (es).
//
// Wave A (POS + product cluster pilot, 38 articles) is wired in below via
// batch files. lib/academy-i18n-loader.ts falls back to the English article
// for every slug/field not yet covered.
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
import { wavea3Translations } from './wave-a-batch3'
import { wavea3Part2Translations } from './wave-a-batch3-part2'
import { wavea3Part3Translations } from './wave-a-batch3-part3'
import { waveABatch4NewArticlesTranslations } from './wave-a-batch4-new-articles'

export const translations: LocaleTranslations = {
  ...waveABatch1Translations,
  ...waveABatch2Translations,
  ...wavea3Translations,
  ...wavea3Part2Translations,
  ...wavea3Part3Translations,
  ...waveABatch4NewArticlesTranslations,
}
