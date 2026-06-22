#!/usr/bin/env node
// i18n self-audit — run after every milestone build.
//
//   node scripts/i18n-audit.mjs            # audit the main app
//   node scripts/i18n-audit.mjs --app pos  # audit pos-askbiz
//   node scripts/i18n-audit.mjs --update   # rewrite the ratchet to current counts (only when intentionally burning debt down)
//
// Exit code 0 = pass, 1 = a gate regressed. Wire into CI so a milestone can't
// merge while it ADDS i18n debt. Existing debt is allowed (the ratchet); new
// debt is not. Checks that depend on the locale catalogues skip cleanly until
// Foundation F8 creates them, then activate automatically.

import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const APP = args.includes('--app') ? args[args.indexOf('--app') + 1] : 'main'
const UPDATE = args.includes('--update')
const SKIP_TYPECHECK = args.includes('--skip-typecheck')

const base = JSON.parse(readFileSync(join(ROOT, 'docs/i18n/audit-baseline.json'), 'utf8'))
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
    const flat = (o, pre = '') => Object.entries(o).flatMap(([k, v]) =>
      v && typeof v === 'object' ? flat(v, `${pre}${k}.`) : [`${pre}${k}`])
    return new Set(flat(JSON.parse(readFileSync(p, 'utf8'))))
  }
  let totalMissing = 0
  const report = []
  for (const loc of base.activeLocales) {
    let missing = 0
    for (const file of ns) {
      const en = keysOf(base.baseLocale, file)
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
