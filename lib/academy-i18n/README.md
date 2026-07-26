# lib/academy-i18n — Academy content translations

This directory holds translated prose for Academy articles (`lib/academy-*.ts`,
shape defined in `lib/academy-types.ts`). It is read by the loader at
`lib/academy-i18n-loader.ts`, which overlays these translations onto the
canonical English article at render time. See that file for the exact
runtime contract (`getLocalizedArticle`, `preloadLocaleTranslations`,
`getLocalizedListFields`).

Nothing in this directory is wired into rendering yet — that's a separate
step. Right now every locale folder exports an empty translation table.

## Folder / file convention

```
lib/academy-i18n/
  <locale>/
    index.ts     // exports `translations: LocaleTranslations`
```

One folder per non-English active locale: `es`, `fr`, `de`, `nl`, `ar`,
`sw`, `so`. (English is the canonical source in `lib/academy-*.ts` itself
and has no folder here — `getLocalizedArticle` short-circuits for `en` /
`DEFAULT_LOCALE` without ever importing from this directory.)

Each `<locale>/index.ts` is loaded via a **dynamic** `import()` — one chunk
per locale, only for the locale actually being rendered — never a static
top-of-file import. This matters at scale: ~1,673 articles x 7 locales must
not all end up in every page's JS bundle. Keep that dynamic-import shape
when touching `academy-i18n-loader.ts`; do not switch it to eagerly
importing all locales.

## The `TranslatableFields` contract

Defined once, in `lib/academy-i18n-loader.ts`:

```ts
export type TranslatableFields = Pick<
  AcademyArticle,
  'title' | 'description' | 'keywords' | 'content' | 'keyTakeaways' | 'faq'
>

export type LocaleTranslations = Record<string, Partial<TranslatableFields>>
```

- **Keyed by `slug`** — the same `slug` the English article uses in
  `lib/academy-*.ts`. Do not invent new slugs here.
- **Only these six fields are ever translated**: `title`, `description`,
  `keywords`, `content` (the full array of `{ heading, body, image? }`
  sections — translate `heading`/`body`, leave `image` paths as-is),
  `keyTakeaways`, `faq`.
- **Every other `AcademyArticle` field stays canonical/English** and must
  never appear in a translation entry: `slug`, `category`, `categorySlug`,
  `difficulty`, `readTime`, `relatedSlugs`, `videoUrl`. These are
  identifiers/metadata, not prose — the loader doesn't touch them.
- **Partial per slug is expected and fine.** A translation entry can supply
  only some of the six fields (e.g. just `title` + `description` while
  `content` is still being translated). Omit fields you don't have a
  translation for yet — never set a field to `undefined` or `""` as a
  placeholder.

## English-fallback guarantee

The loader (`getLocalizedArticle` / `getLocalizedListFields`) guarantees a
visitor never sees a blank field:

- If a locale's `index.ts` has no entry for a given `slug` at all, every
  field of that article falls back to English.
- If an entry exists but omits some fields, exactly those omitted fields
  fall back to English — present fields still get translated.
- If a locale has zero translated content yet (an empty `translations`
  object, or even a locale folder whose dynamic import fails for any
  reason), the entire locale silently behaves as English for Academy
  content. Nothing crashes and nothing renders blank.

This means translation coverage can be built up incrementally, article by
article and field by field, without ever blocking or breaking a locale that
isn't done yet.

## Adding a real batch of translations (for future translation-wave sessions)

When a translation-wave session translates a batch of articles into a
locale, it should **extend that locale's existing `index.ts` (or a file it
imports and merges), not create a new file per article**. The pattern
mirrors how English batches are merged in `lib/academy-content.ts`: many
source files, one merged export.

Concretely, for a batch of Spanish translations covering the POS category:
add real entries to `lib/academy-i18n/es/index.ts`'s `translations` object
(keyed by the English article's `slug`, values being whichever
`TranslatableFields` were translated for that batch), or — once the map
would get unwieldy in a single file — split the batch into its own file
under `lib/academy-i18n/es/` (e.g. `batch-001-pos.ts`, exporting a
`Record<string, Partial<TranslatableFields>>` of just that batch's slugs)
and spread it into `index.ts`'s `translations` export alongside any other
batches already merged there
(`export const translations: LocaleTranslations = { ...batch001, ...batch002 }`).
Either way, `index.ts` remains the single per-locale entry point the loader
dynamically imports — don't add new per-locale entry points, and don't
design a more elaborate merge/registry mechanism than that until real
translated content actually exists and a session needs it.
