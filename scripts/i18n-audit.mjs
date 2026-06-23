#!/usr/bin/env node
// i18n self-audit — run after every milestone build.
//
//   node scripts/i18n-audit.mjs            # audit the main app
//   node scripts/i18n-audit.mjs --app pos  # audit pos-askbiz
//   node scripts/i18n-audit.mjs --update   # rewrite the ratchet to current counts (only when intentionally burning debt down)
//   node scripts/i18n-audit.mjs --fix      # auto-heal smart-quoted ("“ ”") locale JSON, then audit
//
// Exit code 0 = pass, 1 = a gate regressed, 2 = a config/baseline file is itself
// unreadable. Wire into CI so a milestone can't merge while it ADDS i18n debt.
// Existing debt is allowed (the ratchet); new debt is not. Checks that depend on
// the locale catalogues skip cleanly until Foundation F8 creates them, then
// activate automatically.

import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const APP = args.includes('--app') ? args[args.indexOf('--app') + 1] : 'main'
const UPDATE = args.includes('--update')
const SKIP_TYPECHECK = args.includes('--skip-typecheck')
const FIX = args.includes('--fix')

// ── JSON resilience helpers ──────────────────────────────────────────────────
// Locale files get corrupted by editors / translation tools that "smart-quote"
// the JSON (“ ” instead of "). That used to crash the whole audit — and the
// prebuild — with a raw stack trace. Now we parse defensively, pinpoint the
// breakage (file:line:col), and can auto-heal smart-quote damage with --fix.

// Pull a line:col out of a V8 JSON error ("...at position N (line L column C)").
function locateJsonError(src, err) {
  const lc = /line (\d+) column (\d+)/.exec(err.message)
  if (lc) return { line: +lc[1], col: +lc[2] }
  const pm = /position (\d+)/.exec(err.message)
  if (pm) {
    const pos = +pm[1]
    const upto = src.slice(0, pos)
    return { line: upto.split('\n').length, col: pos - upto.lastIndexOf('\n') }
  }
  return { line: 0, col: 0 }
}

// Smart double-quotes → straight quotes. Smart apostrophes (’) are valid inside
// JSON strings, so they're left untouched. Only ever applied to files that FAIL
// to parse, so legitimately-curly-but-valid files (terms, privacy…) are safe.
const healSmartQuotes = (src) => src.replace(/[“”]/g, '"')

function readJsonSafe(path) {
  const src = readFileSync(path, 'utf8')
  try { return { ok: true, data: JSON.parse(src), src } }
  catch (err) {
    return { ok: false, err, src, loc: locateJsonError(src, err), hasSmart: /[“”]/.test(src) }
  }
}

const baseRead = readJsonSafe(join(ROOT, 'docs/i18n/audit-baseline.json'))
if (!baseRead.ok) {
  console.error(`\n✗ docs/i18n/audit-baseline.json is not valid JSON (line ${baseRead.loc.line}, column ${baseRead.loc.col}): ${baseRead.err.message}\n`)
  process.exit(2)
}
const base = baseRead.data
const SCAN_DIRS = APP === 'pos' ? ['pos-askbiz/app', 'pos-askbiz/components', 'pos-askbiz/lib'] : ['app', 'components', 'lib']
const LOCALE_ROOT = APP === 'pos' ? 'pos-askbiz/locales' : 'locales'
const ratchet = base.ratchet[APP === 'pos' ? 'pos' : 'main']

const results = []
const fail = (name, detail) => results.push({ name, ok: false, detail })
const pass = (name, detail) => results.push({ name, ok: true, detail })

// grep helper — returns match count, tolerant of "no matches" (grep exit 1)
function count(pattern) {
  const dirs = SCAN_DIRS.filter(d => existsSync(join(ROOT, d)))
  if (!dirs.length) return 0
  try {
    const out = execSync(`grep -rEn ${JSON.stringify(pattern)} ${dirs.join(' ')} 2>/dev/null | wc -l`, { cwd: ROOT })
    return parseInt(out.toString().trim(), 10) || 0
  } catch { return 0 }
}

// ── GATE 0: every locale file is valid JSON (with optional auto-heal) ────────
// One smart-quoted file breaks `next build` (prebuild runs this) AND tc() at
// runtime. Catch it here with a precise location instead of a stack trace; with
// --fix, repair smart-quote corruption in place and re-validate.
{
  const localeRootAbs = join(ROOT, LOCALE_ROOT)
  const broken = []
  let healed = 0
  if (existsSync(localeRootAbs)) {
    for (const loc of readdirSync(localeRootAbs)) {
      const locDir = join(localeRootAbs, loc)
      let files
      try { files = readdirSync(locDir).filter(f => f.endsWith('.json')) } catch { continue }
      for (const file of files) {
        const p = join(locDir, file)
        let r = readJsonSafe(p)
        if (!r.ok && FIX && r.hasSmart) {
          const fixed = healSmartQuotes(r.src)
          try { JSON.parse(fixed); writeFileSync(p, fixed); healed++; r = { ok: true } }
          catch { /* still broken after heal — fall through to report */ }
        }
        if (!r.ok) broken.push({ rel: `${LOCALE_ROOT}/${loc}/${file}`, line: r.loc.line, col: r.loc.col, hasSmart: r.hasSmart })
      }
    }
  }
  if (healed) console.log(`\n  ⚙ auto-healed ${healed} smart-quoted locale file(s)`)
  if (broken.length) {
    const lines = broken.map(b =>
      `\n      ${b.rel}:${b.line}:${b.col}${b.hasSmart ? '  ← smart quotes “ ” — run: node scripts/i18n-audit.mjs --fix' : ''}`).join('')
    fail('valid-json', `${broken.length} invalid locale file(s):${lines}`)
  } else {
    pass('valid-json', healed ? `all locale JSON valid (auto-healed ${healed})` : 'all locale JSON parses')
  }
}

// ── GATE 1: no NEW hardcoded locale literals (toLocale...('en-GB')) ──────────
const localeLit = count("toLocale[A-Za-z]*\\([^)]*['\\\"]en-GB['\\\"]")
const localeFloor = ratchet.hardcodedLocaleLiterals
if (localeLit > localeFloor) fail('no-new-hardcoded-locale', `${localeLit} found, ratchet allows ${localeFloor} — new code added ${localeLit - localeFloor}`)
else pass('no-new-hardcoded-locale', `${localeLit}/${localeFloor} (use the locale-aware formatter, not 'en-GB')`)

// ── GATE 2: no NEW hardcoded currency symbols in markup ─────────────────────
const curLit = count(">[^<]*[£$][0-9{]")
const curFloor = ratchet.hardcodedCurrencyInMarkup
if (curLit > curFloor) fail('no-new-hardcoded-currency', `${curLit} found, ratchet allows ${curFloor} — new code added ${curLit - curFloor}`)
else pass('no-new-hardcoded-currency', `${curLit}/${curFloor} (use formatCurrency(locale, n))`)

// ── GATE 3: locale catalogue key parity (skips until F8 creates catalogues) ─
const catRoot = join(ROOT, LOCALE_ROOT)
if (existsSync(catRoot) && existsSync(join(catRoot, base.baseLocale))) {
  const ns = readdirSync(join(catRoot, base.baseLocale)).filter(f => f.endsWith('.json'))
  const keysOf = (loc, file) => {
    const p = join(catRoot, loc, file)
    if (!existsSync(p)) return null
    const r = readJsonSafe(p)
    if (!r.ok) return null   // invalid JSON already surfaced by GATE 0 — don't crash here
    const flat = (o, pre = '') => Object.entries(o).flatMap(([k, v]) =>
      v && typeof v === 'object' ? flat(v, `${pre}${k}.`) : [`${pre}${k}`])
    return new Set(flat(r.data))
  }
  let totalMissing = 0
  const report = []
  for (const loc of base.activeLocales) {
    let missing = 0
    for (const file of ns) {
      const en = keysOf(base.baseLocale, file)
      if (en === null) continue   // base file unreadable — already failed by GATE 0
      const tr = keysOf(loc, file)
      if (tr === null) { missing += en.size; continue }
      for (const k of en) if (!tr.has(k)) missing++
    }
    if (missing) report.push(`${loc}:${missing}`)
    totalMissing += missing
  }
  // Missing keys are a WARNING not a failure — they fall back to English (by design).
  pass('catalogue-parity', totalMissing === 0
    ? `all ${base.activeLocales.length} locales complete vs ${base.baseLocale}`
    : `untranslated keys (fall back to English): ${report.join(', ')}`)
} else {
  pass('catalogue-parity', 'SKIP — locale catalogues not created yet (Foundation F8)')
}

// ── GATE 4: typecheck — RATCHETED. next.config has ignoreBuildErrors:true, so
// `next build` does NOT catch type errors; this gate does. There are pre-existing
// errors in generated content files (academy-cfo-saas-batch*) we don't own, so we
// ratchet: tolerate the baseline count, fail only if NEW errors appear.
if (SKIP_TYPECHECK) {
  pass('typecheck', 'SKIP (--skip-typecheck)')
} else {
  // This codebase has a large pre-existing type-error backlog tolerated by
  // ignoreBuildErrors — in generated content (academy/trade-news/etc. batches,
  // ~3000 errors) and in app code (~337). We count only HAND-WRITTEN app/lib code
  // (excluding generated content, .next, node_modules) and ratchet against it, so
  // the gate catches NEW app-code type errors without drowning in the backlog.
  const IGNORE = /academy-cfo-saas-batch|trade-news-batch|integration-blogs-batch|sector-posts|pseo-batch|africa-|new-blogs|-content\.ts|\.next\/|node_modules/
  // Typecheck the app being audited — pos-askbiz is a separate Next app/tsconfig.
  const TSC_CWD = APP === 'pos' ? join(ROOT, 'pos-askbiz') : ROOT
  let count = 0
  try { execSync('npx tsc --noEmit', { cwd: TSC_CWD, stdio: 'pipe' }) }
  catch (e) {
    const out = (e.stdout?.toString() || '') + (e.stderr?.toString() || '')
    count = out.split('\n').filter(l => l.includes('error TS') && !IGNORE.test(l)).length
  }
  const floor = ratchet.typescriptErrors ?? 0
  if (count > floor) fail('typecheck', `${count} app-code TS errors, ratchet allows ${floor} — new code added ${count - floor} (run: npx tsc --noEmit)`)
  else pass('typecheck', `${count}/${floor} app-code errors (pre-existing only — no new type errors)`)
}

// ── report ──────────────────────────────────────────────────────────────────
if (UPDATE) {
  ratchet.hardcodedLocaleLiterals = localeLit
  ratchet.hardcodedCurrencyInMarkup = curLit
  writeFileSync(join(ROOT, 'docs/i18n/audit-baseline.json'), JSON.stringify(base, null, 2) + '\n')
  console.log(`Ratchet updated for ${APP} → locale:${localeLit} currency:${curLit}`)
  process.exit(0)
}

console.log(`\ni18n self-audit · app=${APP} · locales=[${base.activeLocales.join(',')}]\n`)
for (const r of results) console.log(`  ${r.ok ? '✓' : '✗'} ${r.name.padEnd(26)} ${r.detail}`)
const failed = results.filter(r => !r.ok)
console.log(failed.length ? `\n${failed.length} gate(s) regressed — milestone is not clean.\n` : `\nAll gates pass.\n`)
process.exit(failed.length ? 1 : 0)
