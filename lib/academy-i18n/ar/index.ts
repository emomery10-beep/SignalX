// Academy article translations — العربية (ar, RTL).
//
// Translation-wave sessions: see lib/academy-i18n/README.md for the full
// contract. In short, add real `slug -> TranslatableFields` entries directly
// to (or merged into) the `translations` export below — do NOT create a new
// per-article file. Large batches live in their own file (e.g.
// `./wave-a-batch1.ts`) and are merged in here.

import type { LocaleTranslations } from '../../academy-i18n-loader'
import { waveABatch1Translations } from './wave-a-batch1'
import { waveABatch2Translations } from './wave-a-batch2'
import { waveABatch3Translations } from './wave-a-batch3'
import { waveABatch4NewArticlesTranslations } from './wave-a-batch4-new-articles'

export const translations: LocaleTranslations = {
  ...waveABatch1Translations,
  ...waveABatch2Translations,
  ...waveABatch3Translations,
  ...waveABatch4NewArticlesTranslations,
}
