#!/usr/bin/env node
// Generates lib/voiceRoutes.ts by statically discovering static pages under
// SCAN_ROOTS (app/(app), app/free-tools, app/onboarding, app/search,
// app/inventory) — mirrors the original hand-built whitelist's scope exactly
// (marketing/SEO pages under app/ are intentionally never voice-navigable; a
// user mid-session in the app has no reason to voice-navigate to a blog post,
// and pulling ~70 marketing routes into the classifier's prompt would dilute
// matching quality for the routes that matter).
//
// THIS IS STAGE 1 of the voice-nav codegen system (see lib/voiceDiscovery.ts
// for the sub-route self-declaration convention). Stage 1 covers:
//   1. Static-page discovery (done).
//   2. The VOICE_SUBROUTES convention type (lib/voiceDiscovery.ts, done).
//   3. Groq-powered translation of English descriptions into fr/es/nl/de/sw,
//      with a committed hash-keyed cache (lib/voiceRoutes.translations.cache.json)
//      so re-runs with no new/changed English text make ZERO API calls. If a
//      translation call fails (or GROQ_API_KEY is missing), this NEVER fails the
//      build — it falls back to English for that language for that run only and
//      logs a warning, matching how the rest of this app's i18n system already
//      falls back to English for missing keys.
//   4. Grepping the two proven adopting components (CfoDashboard.tsx and the
//      intelligence page's own top-level tabs) for VOICE_SUBROUTES exports and
//      folding them into the generated whitelist (SUBROUTE_SOURCE_FILES below).
//
// STAGE 2 (future, separate effort, not done here): audit the rest of the app
// for other tabbed components and retrofit those too using the same
// convention — just add each new file's path to SUBROUTE_SOURCE_FILES below.
//
// Usage:
//   node scripts/generate-voice-routes.mjs             # normal run, writes lib/voiceRoutes.ts
//   node scripts/generate-voice-routes.mjs --check      # exit 1 if output would differ (CI drift check)
//
// Exit codes: 0 = wrote (or, with --check, matched) successfully, 1 = a hard
// problem (never a partial/corrupt write). Translation API failures are NOT a
// hard problem — see translateAll() below.

import { readdirSync, statSync, readFileSync, existsSync, writeFileSync } from 'node:fs'
import { join, relative, sep, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import Groq from 'groq-sdk'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const CHECK = args.includes('--check')

// ── Scope decision ──────────────────────────────────────────────────────────
// The current hand-maintained VALID_ROUTES is NOT "every page under app/" — it
// is deliberately scoped to the logged-in app shell: everything under
// app/(app)/* (minus /admin* and dynamic [id] routes), plus app/free-tools/*,
// plus the top-level singles app/onboarding, app/search, app/inventory.
// Discovery mirrors this exactly via an explicit allow-list of scan roots, so
// extending scope later (a future audit of other areas) is a one-line change
// here, not a rewrite.
const SCAN_ROOTS = [
  'app/(app)', // logged-in app shell — the bulk of the whitelist
  'app/free-tools',
  'app/onboarding',
  'app/search',
  'app/inventory',
]

// Absolute path segments that must NEVER be voice-navigable, regardless of
// discovery. /admin is a deliberate security decision made earlier in this
// feature's history after a prompt-injection test specifically tried to reach
// it — do not remove it. /signin and /signup are excluded because navigating
// an already-logged-in user's voice command to an auth page makes no sense.
const EXCLUDE_PATH_PREFIXES = ['/admin', '/signin', '/signup']

// Individual routes that are technically in-scope by directory but aren't
// sensible voice-nav destinations (e.g. redirect/gate pages, not content).
const EXCLUDE_EXACT_PATHS = ['/pos/activate']

// Components that self-declare sub-routes via VOICE_SUBROUTES (see
// lib/voiceDiscovery.ts). Stage 1 proves the convention with these two files;
// Stage 2 (a later, separate effort) will grow this list as more tabbed
// components across the app are retrofitted to the same convention.
const SUBROUTE_SOURCE_FILES = [
  'components/cfo/CfoDashboard.tsx',
  // NOTE: the intelligence page's VOICE_SUBROUTES lives in a sibling file,
  // NOT app/(app)/intelligence/page.tsx itself — Next.js's App Router
  // restricts page.tsx to a fixed set of named exports (default, metadata,
  // etc.) and fails `tsc --noEmit` on any other named export. See
  // app/(app)/intelligence/voiceSubroutes.ts for the full rationale.
  'app/(app)/intelligence/voiceSubroutes.ts',
]

const SUPPORTED_LANGUAGES = ['en', 'fr', 'es', 'nl', 'de', 'sw']
const TARGET_LANGS = { fr: 'French', es: 'Spanish', nl: 'Dutch', de: 'German', sw: 'Swahili' }
const TRANSLATION_CACHE_PATH = join(ROOT, 'lib/voiceRoutes.translations.cache.json')

// ── Static-page walk ─────────────────────────────────────────────────────────
// Mirrors `find app -name page.tsx | grep -v '\['`, done in Node so it can be
// combined with the exclude rules and metadata extraction below.

function findPageFiles(root) {
  const abs = join(ROOT, root)
  if (!existsSync(abs)) return []
  const out = []
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const p = join(dir, entry)
      const st = statSync(p)
      if (st.isDirectory()) walk(p)
      else if (entry === 'page.tsx') out.push(p)
    }
  }
  walk(abs)
  return out
}

// Dynamic [param] segments are excluded — voice-nav can't sensibly target a
// route needing an ID (which product? which shipment?).
function isDynamicRoute(pageFilePath) {
  return pageFilePath.includes('[')
}

// (app)/(auth)/etc. route-group segments are stripped when building the URL —
// they don't appear in the actual browser path.
function pageFileToUrlPath(pageFilePath) {
  const rel = relative(join(ROOT, 'app'), pageFilePath) // e.g. "(app)/pos/setup/page.tsx"
  const segments = rel
    .split(sep)
    .slice(0, -1) // drop "page.tsx"
    .filter((seg) => !(seg.startsWith('(') && seg.endsWith(')'))) // drop route groups
  return '/' + segments.join('/')
}

function isExcluded(urlPath) {
  if (EXCLUDE_EXACT_PATHS.includes(urlPath)) return true
  return EXCLUDE_PATH_PREFIXES.some((prefix) => urlPath === prefix || urlPath.startsWith(prefix + '/'))
}

// ── Label/description derivation ────────────────────────────────────────────
// Prefer the page's exported Next.js metadata (title/description) if present,
// falling back to a reasonable derivation from the route path segments if not.
// This is deliberately permissive regex-based extraction — static analysis at
// build time, not a runtime import — so it must not require the page to be
// valid standalone ESM (many are 'use client' pages that import heavy
// client-only deps like leaflet). We only need the literal string values.

function extractMetadata(source) {
  const block = /export const metadata[^=]*=\s*{([\s\S]*?)\n}/.exec(source)
  if (!block) return null
  const title = /title:\s*(['"`])([\s\S]*?)\1/.exec(block[1])
  const description = /description:\s*(['"`])([\s\S]*?)\1/.exec(block[1])
  return {
    title: title?.[2]?.split(' — ')[0]?.split(' | ')[0], // strip " — AskBiz" site-name suffixes
    description: description?.[2],
  }
}

// Segments that are acronyms/proper nouns and should not be naively
// Title-Cased word-by-word (kebab-case-to-Title-Case would turn "pos" into
// "Pos", which loses meaning). Keyed by lowercase segment.
const SEGMENT_OVERRIDES = {
  pos: 'POS',
  fx: 'FX',
  vat: 'VAT',
  cogs: 'COGS',
}

function titleCaseSegment(segment) {
  if (SEGMENT_OVERRIDES[segment.toLowerCase()]) return SEGMENT_OVERRIDES[segment.toLowerCase()]
  return segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

// Falls back to deriving a label from ALL path segments (not just the last
// one) so nested routes keep their parent's context, e.g. '/pos/setup' reads
// as "POS Setup" rather than the ambiguous "Setup" — matching how the
// original hand-built whitelist labelled nested routes.
function titleCaseFromPath(urlPath) {
  const segments = urlPath.split('/').filter(Boolean)
  if (segments.length === 0) return 'Home'
  return segments.map(titleCaseSegment).join(' ')
}

function deriveRoute(urlPath, pageFilePath) {
  const source = readFileSync(pageFilePath, 'utf8')
  const meta = extractMetadata(source)
  const label = meta?.title || titleCaseFromPath(urlPath)
  const description = meta?.description || `Go to the ${label} page` // graceful fallback, never throws
  return { path: urlPath, label, description }
}

// ── Sub-route extraction (Step 1 convention, wired up once components adopt it) ──
// Statically greps a source file for `export const VOICE_SUBROUTES = [...]` and
// sandbox-evaluates JUST the array literal (no imports, no side effects — safe
// because it's our own committed source, not user input). Per the
// lib/voiceDiscovery.ts convention, this MUST be a literal array (not derived
// via .map() over some other module-scope const), or this extraction silently
// returns nothing for that file.
function extractVoiceSubroutes(filePath) {
  const abs = join(ROOT, filePath)
  if (!existsSync(abs)) return []
  const source = readFileSync(abs, 'utf8')
  const m = /export const VOICE_SUBROUTES[^=]*=\s*(\[[\s\S]*?\n\])/.exec(source)
  if (!m) return []
  try {
    // eslint-disable-next-line no-new-func
    const arr = new Function(`"use strict"; return (${m[1]})`)()
    return Array.isArray(arr) ? arr : []
  } catch (e) {
    console.warn(`⚠ voice-routes: could not parse VOICE_SUBROUTES in ${filePath}: ${e.message} — skipping`)
    return []
  }
}

// ── Translation automation (Step 3) ─────────────────────────────────────────
// Every English description is translated into fr/es/nl/de/sw via Groq, and
// results are cached keyed by sha256(english text) — so re-running this script
// with no new/changed English text makes ZERO API calls. The cache is
// committed to git (like docs/i18n/audit-baseline.json), so CI never needs
// network access unless text actually changed.
//
// Safety guarantees (must hold for CI/build environments where Groq might be
// rate-limited or briefly unavailable):
//   - No GROQ_API_KEY set               -> fall back to English, warn, continue.
//   - Any translation call throws       -> fall back to English for THAT entry
//                                          only, for THIS run only, warn, continue.
//   - Cache file missing or corrupt     -> treated as empty cache, never throws.
//   - The cache is only rewritten when at least one real translation
//     succeeded, so a fully-offline run never clobbers a good cache with
//     English-only placeholders.
// None of these paths ever call process.exit() or throw past translateAll().

const hashOf = (text) => createHash('sha256').update(text).digest('hex')

function loadTranslationCache() {
  if (!existsSync(TRANSLATION_CACHE_PATH)) return { entries: {} }
  try {
    const parsed = JSON.parse(readFileSync(TRANSLATION_CACHE_PATH, 'utf8'))
    if (parsed && typeof parsed === 'object' && parsed.entries && typeof parsed.entries === 'object') return parsed
    return { entries: {} }
  } catch {
    // Corrupt cache never blocks the build — just re-translate everything.
    console.warn('⚠ voice-routes: lib/voiceRoutes.translations.cache.json is not valid JSON — ignoring cache for this run')
    return { entries: {} }
  }
}

function englishOnlyTranslations(english) {
  const out = { en: english }
  for (const lang of Object.keys(TARGET_LANGS)) out[lang] = english
  return out
}

async function translateOne(groq, text) {
  const prompt =
    `Translate this short UI navigation description into French, Spanish, Dutch, German, and Swahili. ` +
    `Return ONLY a JSON object with keys fr, es, nl, de, sw. Keep it short and natural for a voice-navigation ` +
    `confirmation message. Text: "${text}"`
  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0,
    max_tokens: 400,
    response_format: { type: 'json_object' },
  })
  return JSON.parse(completion.choices[0]?.message?.content || '{}')
}

// Translates every entry's English description, using/populating the
// hash-keyed cache. Returns entries unchanged except `description` becomes
// the full { en, fr, es, nl, de, sw } object every generated route needs.
async function translateAll(entries) {
  const cache = loadTranslationCache()
  const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null

  let cacheHits = 0
  let apiCalls = 0
  let fallbacks = 0
  let cacheDirty = false

  const results = []
  for (const entry of entries) {
    const hash = hashOf(entry.description)
    let translations = cache.entries[hash]

    if (translations) {
      cacheHits++
    } else if (groq) {
      try {
        const t = await translateOne(groq, entry.description)
        translations = { en: entry.description }
        for (const lang of Object.keys(TARGET_LANGS)) {
          // Fall back to English for any language the model dropped/malformed.
          translations[lang] = typeof t[lang] === 'string' && t[lang].trim() ? t[lang] : entry.description
        }
        cache.entries[hash] = translations
        cacheDirty = true
        apiCalls++
      } catch (err) {
        // Never fail the build over a translation API hiccup.
        console.warn(
          `⚠ voice-routes: translation failed for "${entry.description.slice(0, 40)}…" — falling back to English for this run: ${err instanceof Error ? err.message : err}`,
        )
        translations = englishOnlyTranslations(entry.description)
        fallbacks++
      }
    } else {
      console.warn(
        `⚠ voice-routes: GROQ_API_KEY not set — "${entry.description.slice(0, 40)}…" falls back to English for all languages this run`,
      )
      translations = englishOnlyTranslations(entry.description)
      fallbacks++
    }

    results.push({ ...entry, description: translations })
  }

  if (cacheDirty) {
    writeFileSync(
      TRANSLATION_CACHE_PATH,
      JSON.stringify(
        {
          _comment:
            'Cache of voice-route description translations, keyed by sha256(english text). Committed to git so CI never needs network access unless text actually changed. Regenerate via scripts/generate-voice-routes.mjs.',
          entries: cache.entries,
        },
        null,
        2,
      ) + '\n',
    )
  }

  console.log(
    `voice-routes: ${entries.length} route(s) — ${cacheHits} cache hit(s), ${apiCalls} translated, ${fallbacks} English-only fallback`,
  )
  return results
}

// ── Assembly ─────────────────────────────────────────────────────────────────

function collectStaticEntries() {
  const entries = []
  const seenPaths = new Set()
  for (const root of SCAN_ROOTS) {
    for (const pageFile of findPageFiles(root)) {
      if (isDynamicRoute(pageFile)) continue
      const urlPath = pageFileToUrlPath(pageFile)
      if (isExcluded(urlPath)) continue
      if (seenPaths.has(urlPath)) continue
      seenPaths.add(urlPath)
      entries.push(deriveRoute(urlPath, pageFile))
    }
  }
  return entries
}

function collectSubrouteEntries() {
  return SUBROUTE_SOURCE_FILES.flatMap((file) => extractVoiceSubroutes(file))
}

// `entries` here have already been through translateAll(), so `r.description`
// is the full { en, fr, es, nl, de, sw } object, not a plain string.
function buildGeneratedSource(entries) {
  const sorted = [...entries].sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0))

  const routeLiterals = sorted
    .map((r) => {
      const descLines = SUPPORTED_LANGUAGES.map((lang) => `      ${lang}: ${JSON.stringify(r.description[lang])},`).join('\n')
      const lockedLine = r.locked ? `\n    locked: true,` : ''
      return `  {
    path: ${JSON.stringify(r.path)},
    label: ${JSON.stringify(r.label)},
    description: {
${descLines}
    },${lockedLine}
  },`
    })
    .join('\n')

  return `// ⚠ GENERATED FILE — DO NOT EDIT BY HAND.
// Produced by scripts/generate-voice-routes.mjs from:
//   - static page discovery under app/(app), app/free-tools, app/onboarding, app/search, app/inventory
//   - VOICE_SUBROUTES exports in: ${SUBROUTE_SOURCE_FILES.length ? SUBROUTE_SOURCE_FILES.join(', ') : '(none registered yet)'}
// Regenerate: node scripts/generate-voice-routes.mjs
// Translations cached in lib/voiceRoutes.translations.cache.json (keyed by
// sha256 of the English text). Missing/failed translations fall back to
// English for that run — see translateAll() in the generator script.
//
// NOTE on 'locked': carried through only as an informational hint for future
// UI consumers (e.g. HelpWidget could show a lock icon next to a paywalled
// suggestion). It has NO effect on whitelist validation — voice-nav's job is
// intent classification/navigation, not authorization, so locked routes are
// classified and navigated exactly like any other route; the destination
// page's own FeatureGate/paywall UI takes over from there, identically to a
// mouse click. Do not add locked-based filtering to app/api/voice-nav/route.ts.

export interface VoiceRoute {
  path: string
  label: string
  description: {
    en: string
    fr: string
    es: string
    nl: string
    de: string
    sw: string
  }
  locked?: boolean
}

export const VALID_ROUTES: VoiceRoute[] = [
${routeLiterals}
]

export function findRouteByPath(path: string): VoiceRoute | undefined {
  return VALID_ROUTES.find((route) => route.path === path)
}

export const VALID_ROUTE_PATHS: string[] = VALID_ROUTES.map((route) => route.path)
`
}

async function main() {
  const staticEntries = collectStaticEntries()
  const subEntries = collectSubrouteEntries()
  const allEntries = [...staticEntries, ...subEntries]

  if (allEntries.length === 0) {
    console.error('generate-voice-routes: discovered zero routes — refusing to write an empty whitelist')
    process.exit(1)
  }

  const translatedEntries = await translateAll(allEntries)

  const output = buildGeneratedSource(translatedEntries)
  const targetPath = join(ROOT, 'lib/voiceRoutes.ts')

  if (CHECK) {
    const current = existsSync(targetPath) ? readFileSync(targetPath, 'utf8') : ''
    if (current !== output) {
      console.error('generate-voice-routes --check: lib/voiceRoutes.ts is out of date. Run `node scripts/generate-voice-routes.mjs` and commit the result.')
      process.exit(1)
    }
    console.log(`generate-voice-routes --check: up to date (${allEntries.length} route(s)).`)
    process.exit(0)
  }

  writeFileSync(targetPath, output)
  console.log(`voice-routes: wrote ${allEntries.length} route(s) (${staticEntries.length} static page(s), ${subEntries.length} sub-route(s)) to lib/voiceRoutes.ts`)
}

main().catch((err) => {
  console.error('generate-voice-routes: fatal error', err)
  process.exit(1)
})
