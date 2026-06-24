#!/usr/bin/env node
// Machine-translate catalogue namespaces from English into the active locales.
// This is the "build in English, auto-propagate" engine: extract strings into
// locales/en/<ns>.json, run this, review the output.
//
//   node scripts/i18n-translate.mjs common           # one namespace, fills gaps only
//   node scripts/i18n-translate.mjs                   # all namespaces
//   node scripts/i18n-translate.mjs nav --force       # retranslate every key
//
// Fills only MISSING keys by default so reviewed translations are never clobbered.
// Requires ANTHROPIC_API_KEY (read from env or .env.local). Brand names and
// {placeholders} are preserved. Review machine output before shipping — the
// self-audit's catalogue-parity gate tracks coverage, not quality.

import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
// `--app=pos` translates the separate pos-askbiz app's catalogues instead of the
// main app's. Language display names are shared, so ROOT/lib stays the source.
const POS = process.argv.slice(2).includes('--app=pos')
const LOCALES_DIR = POS ? join(ROOT, 'pos-askbiz', 'locales') : join(ROOT, 'locales')
const BASE = 'en'
const MODEL = 'claude-sonnet-4-6'

// Target locales = the locale folders that exist (minus the English base).
// English names come from the shared single source lib/i18n-languages.json,
// which lib/i18n.ts also exports (LANG_ENGLISH_NAMES) — no hand-synced copy.
const ENGLISH_NAMES = JSON.parse(readFileSync(join(ROOT, 'lib/i18n-languages.json'), 'utf8'))
const TARGETS = Object.fromEntries(
  readdirSync(LOCALES_DIR)
    .filter(d => d !== BASE && statSync(join(LOCALES_DIR, d)).isDirectory())
    .map(loc => [loc, ENGLISH_NAMES[loc] || loc]),
)

const args = process.argv.slice(2)
const FORCE = args.includes('--force')
const onlyNs = args.find(a => !a.startsWith('--'))

// ── API key from env or .env.local ──────────────────────────────────────────
function apiKey() {
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY
  const envFile = join(ROOT, '.env.local')
  if (existsSync(envFile)) {
    const m = readFileSync(envFile, 'utf8').match(/^\s*ANTHROPIC_API_KEY\s*=\s*(.+)\s*$/m)
    if (m) return m[1].trim().replace(/^["']|["']$/g, '')
  }
  return null
}

const key = apiKey()
if (!key) {
  console.error('ANTHROPIC_API_KEY not found in env or .env.local')
  process.exit(1)
}
const anthropic = new Anthropic({ apiKey: key })

const readJson = p => (existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : {})
const writeJson = (p, o) => writeFileSync(p, JSON.stringify(o, null, 2) + '\n')

async function translate(lang, langName, ns, entries, attempt = 1) {
  const prompt = `Translate these UI strings for AskBiz — a business-intelligence and point-of-sale app for small-business owners — from English into ${langName}.
Rules:
- Return ONLY a single valid JSON object with the SAME keys; translate the values.
- Escape any double-quote inside a value as \\" so the JSON stays valid.
- Keep placeholders like {name}, {count}, {sym} EXACTLY as-is.
- Keep brand/product names unchanged: AskBiz, Stripe, Shopify, eBay, Amazon, POS.
- Use natural, concise wording a native ${langName} speaker expects in a software UI.
${lang === 'ar' ? '- Use Western (Latin) digits for any numbers.\n' : ''}- No markdown fences, no commentary — just the JSON.

${JSON.stringify(entries, null, 2)}`

  const res = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 8192,
    messages: [{ role: 'user', content: prompt }],
  })
  let text = res.content.find(c => c.type === 'text')?.text?.trim() || '{}'
  text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
  try {
    return JSON.parse(text)
  } catch (e) {
    // A flaky/malformed response shouldn't abort the run — retry once, then give up on this one.
    if (attempt < 2) return translate(lang, langName, ns, entries, attempt + 1)
    throw new Error(`invalid JSON after ${attempt} attempts (${e.message})`)
  }
}

// Legal pages get HUMAN legal translation per jurisdiction — NEVER machine
// translate them. Skipped unless explicitly named (node …mjs terms --force).
// Includes the pos-askbiz app's legal namespaces (pos_* prefix).
const HUMAN_ONLY = new Set(['terms', 'privacy', 'dpa', 'pos_terms', 'pos_privacy', 'pos_cookies'])

async function run() {
  const namespaces = onlyNs
    ? [onlyNs]
    : [...new Set(readdirSync(join(LOCALES_DIR, BASE)).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5)))]
       .filter(ns => !HUMAN_ONLY.has(ns))

  const failures = []
  for (const ns of namespaces) {
    const enDict = readJson(join(LOCALES_DIR, BASE, `${ns}.json`))
    if (!Object.keys(enDict).length) { console.log(`skip ${ns} (empty/missing in en)`); continue }

    for (const [lang, langName] of Object.entries(TARGETS)) {
      const targetPath = join(LOCALES_DIR, lang, `${ns}.json`)
      const existing = readJson(targetPath)
      const missing = FORCE ? enDict : Object.fromEntries(Object.entries(enDict).filter(([k]) => !(k in existing)))

      if (!Object.keys(missing).length) { console.log(`  ${lang}/${ns}: complete`); continue }

      const missingKeys = Object.keys(missing)
      process.stdout.write(`  ${lang}/${ns}: translating ${missingKeys.length} key(s)… `)
      // Translate in small batches so one un-parseable value only sinks its own
      // batch, not the whole namespace. Failed batches leave their keys missing —
      // they fall back to English at runtime and get retried on the next run.
      const CHUNK = 10
      const translated = {}
      let failedKeys = 0
      for (let i = 0; i < missingKeys.length; i += CHUNK) {
        const slice = Object.fromEntries(missingKeys.slice(i, i + CHUNK).map(k => [k, missing[k]]))
        try { Object.assign(translated, await translate(lang, langName, ns, slice)) }
        catch { failedKeys += Object.keys(slice).length }
      }
      // Write en-key order; omit any key with no translation (don't bake English in).
      const merged = {}
      for (const k of Object.keys(enDict)) {
        const v = FORCE ? (translated[k] ?? existing[k]) : (existing[k] ?? translated[k])
        if (v !== undefined) merged[k] = v
      }
      writeJson(targetPath, merged)
      if (failedKeys) { console.log(`partial — ${failedKeys} key(s) left for retry`); failures.push(`${lang}/${ns}`) }
      else console.log('done')
    }
  }
  if (failures.length) {
    console.log(`\n${failures.length} failed (re-run the command to retry just these — completed keys are skipped): ${failures.join(', ')}`)
    process.exit(1)
  }
  console.log('\nTranslation pass complete. Review output, then run the audit.')
}

run().catch(e => { console.error('\nFailed:', e.message); process.exit(1) })
