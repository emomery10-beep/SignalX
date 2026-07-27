// Academy article translations — Soomaali (so).
//
// Wave A (POS + product cluster pilot, 39 articles) is wired in below via
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
import { waveBatch3Translations } from './wave-a-batch3'
import { waveB1Translations } from './wave-b-batch1'
import { waveB2Translations } from './wave-b-batch2'
import { waveB3Translations } from './wave-b-batch3'
import { waveB4Translations } from './wave-b-batch4'
import { waveB5Translations } from './wave-b-batch5'
import { waveB6Translations } from './wave-b-batch6'

export const translations: LocaleTranslations = {
  ...waveABatch1Translations,
  ...waveABatch2Translations,
  ...waveBatch3Translations,
  ...waveB1Translations,
  ...waveB2Translations,
  ...waveB3Translations,
  ...waveB4Translations,
  ...waveB5Translations,
  ...waveB6Translations,
}
