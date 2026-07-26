// Shared i18n loader for Academy article content.
//
// Academy articles (lib/academy-*.ts, shape in lib/academy-types.ts) are
// authored in English. This module overlays per-locale translations onto
// the canonical English article at render time. Translation content itself
// lives in lib/academy-i18n/<locale>/index.ts — see lib/academy-i18n/README.md
// for the on-disk convention that translation-wave sessions must follow.
//
// Design note: with ~1,673 articles x 7 non-English locales eventually, this
// module deliberately does NOT statically import all locale content up top.
// Every locale's translation table is loaded via a per-locale dynamic
// import(), so a page rendering (say) the French locale never pulls Spanish/
// German/Dutch/Arabic/Swahili/Somali content into its bundle.

import type { AcademyArticle } from './academy-types'
import { type Locale, DEFAULT_LOCALE } from './i18n-locale'

/**
 * The prose subset of AcademyArticle that gets translated per locale:
 * title, description, keywords, content (section headings/bodies),
 * keyTakeaways, faq.
 *
 * Deliberately EXCLUDES slug, category, categorySlug, difficulty, readTime,
 * relatedSlugs, videoUrl, and the `image` paths nested inside content
 * sections — those are canonical identifiers/metadata (routing keys,
 * taxonomy, asset paths), not prose, and stay the same across every locale.
 */
export type TranslatableFields = Pick<
  AcademyArticle,
  'title' | 'description' | 'keywords' | 'content' | 'keyTakeaways' | 'faq'
>

/**
 * One locale's translation table: article slug -> whatever translated
 * fields exist for that article. Coverage is allowed to be partial at all
 * times — a slug can be absent, and a present slug can supply only some of
 * TranslatableFields. Both cases fall back to English for the missing part
 * (see getLocalizedArticle / getLocalizedListFields below).
 */
export type LocaleTranslations = Record<string, Partial<TranslatableFields>>

// Module-level cache: one in-flight/resolved promise per locale, so a page
// that localizes many articles (a full list view, or several detail-page
// helpers in the same request) doesn't trigger a fresh dynamic import of the
// same locale module for every article. Persists for the lifetime of the
// server module instance (fine — translation content is static per deploy).
//
// The cached promise NEVER rejects: preloadLocaleTranslations wraps the
// import in a catch so a locale with no translations module yet (or one
// that fails to load for any reason) resolves to {} instead of throwing.
const localeModuleCache = new Map<Locale, Promise<LocaleTranslations>>()

/**
 * Loads (and memoizes) the translation table for one non-English locale via
 * a dynamic import of `./academy-i18n/<locale>/index`. Returns `{}` for
 * DEFAULT_LOCALE without importing anything.
 *
 * Exported directly (not just used internally by getLocalizedArticle) so
 * LIST views can preload a locale's table ONCE per page and then localize
 * every card synchronously with getLocalizedListFields — see that
 * function's docs for why that matters.
 */
export async function preloadLocaleTranslations(locale: Locale): Promise<LocaleTranslations> {
  if (locale === DEFAULT_LOCALE) return {}

  let cached = localeModuleCache.get(locale)
  if (!cached) {
    cached = import(`./academy-i18n/${locale}/index`)
      .then((mod: { translations?: LocaleTranslations }) => mod?.translations ?? {})
      .catch(() => ({} as LocaleTranslations))
    localeModuleCache.set(locale, cached)
  }
  return cached
}

// Overlays only the fields actually present (and not `undefined`) on
// `overlay` onto `base`. A translation entry that only sets e.g. `title`
// must never blank out `description`/`content`/etc — those stay the
// English value. Written field-by-field (rather than a generic loop) so
// this stays fully type-checked with no casts: TS can't soundly verify a
// `result[key] = overlay[key]` assignment across a union of differently
// typed keys, and a cast there would silently defeat the one guarantee
// this function exists to enforce.
function applyOverlay(base: AcademyArticle, overlay: Partial<TranslatableFields> | undefined): AcademyArticle {
  if (!overlay) return base
  return {
    ...base,
    ...(overlay.title !== undefined ? { title: overlay.title } : null),
    ...(overlay.description !== undefined ? { description: overlay.description } : null),
    ...(overlay.keywords !== undefined ? { keywords: overlay.keywords } : null),
    ...(overlay.content !== undefined ? { content: overlay.content } : null),
    ...(overlay.keyTakeaways !== undefined ? { keyTakeaways: overlay.keyTakeaways } : null),
    ...(overlay.faq !== undefined ? { faq: overlay.faq } : null),
  }
}

/**
 * Returns `article` with its translatable prose fields (title, description,
 * keywords, content, keyTakeaways, faq) overlaid from `locale`'s
 * translation table. Every other field (slug, category, categorySlug,
 * difficulty, readTime, relatedSlugs, videoUrl) is returned unchanged.
 *
 * - locale === DEFAULT_LOCALE ('en'): returns `article` unchanged, no import
 *   performed.
 * - any other ACTIVE_LOCALES member: dynamically imports that locale's
 *   translation module (memoized, see preloadLocaleTranslations), looks up
 *   translations[article.slug], and overlays whatever fields are present.
 * - ENGLISH-FALLBACK GUARANTEE: a missing slug, a missing individual field,
 *   or a locale with no translations module at all (0 articles translated
 *   so far) all fall back to the English value for that field. This
 *   function never returns a blank/undefined prose field.
 *
 * Use this for detail/single-article views (one article per call site). For
 * list/card views rendering many articles at once, prefer
 * preloadLocaleTranslations + getLocalizedListFields instead — see below.
 */
export async function getLocalizedArticle(
  article: AcademyArticle,
  locale: Locale
): Promise<AcademyArticle> {
  if (locale === DEFAULT_LOCALE) return article

  const translations = await preloadLocaleTranslations(locale)
  return applyOverlay(article, translations[article.slug])
}

/**
 * Sync-safe localization of just the list-card fields (title + description)
 * for LIST views — category pages, search results, related-article rails,
 * anywhere rendering many article cards in one page.
 *
 * DESIGN CHOICE (documented per spec): getLocalizedArticle is async because
 * it dynamic-imports the locale's translation module on demand — cheap for
 * a single detail page, wasteful for a list of N cards (N awaits of an
 * already-resolved promise, plus N unnecessary overlay allocations of full
 * content/faq/keyTakeaways that a card never renders). Instead, list views
 * should:
 *
 *   1. `const translations = await preloadLocaleTranslations(locale)` ONCE
 *      for the whole list/page (this is the only async step).
 *   2. Call this synchronous helper per article using that already-resolved
 *      table — no per-card await, no per-card import.
 *
 * Same English-fallback guarantee as getLocalizedArticle: a missing slug or
 * a missing title/description field on a present slug falls back to the
 * English value. Never returns a blank field.
 */
export function getLocalizedListFields(
  article: Pick<AcademyArticle, 'slug' | 'title' | 'description'>,
  locale: Locale,
  translations: LocaleTranslations
): Pick<AcademyArticle, 'title' | 'description'> {
  if (locale === DEFAULT_LOCALE) {
    return { title: article.title, description: article.description }
  }

  const overlay = translations[article.slug]
  return {
    title: overlay?.title ?? article.title,
    description: overlay?.description ?? article.description,
  }
}
