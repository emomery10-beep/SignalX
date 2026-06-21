# i18n Self-Audit — run after every milestone build

The audit is the gate that **enforces** the i18n guarantees instead of trusting
discipline. It runs after every milestone (Foundation F1–F8, then each language's
8 stages) and fails the build if a milestone *adds* i18n debt or breaks a locale.

Active locales: `es, fr, de, nl, ar` · base `en` · RTL `ar`
Sequence: Spanish → French → German → Dutch → Arabic.

## How to run

```bash
node scripts/i18n-audit.mjs            # main app
node scripts/i18n-audit.mjs --app pos  # pos-askbiz
node scripts/i18n-audit.mjs --update   # lower the ratchet after intentionally burning debt down
```

Exit 0 = clean, 1 = a gate regressed. Wire into CI as a required check.

## The ratchet principle

`audit-baseline.json` holds the current debt floor. **Counts may only go down.**
A milestone may leave old hardcoded strings alone, but the moment new code adds
one the gate fails. As each milestone converts strings, run `--update` to lower
the floor so the debt can never creep back. This is what lets you keep building
in English safely: new work falls back to English, but it can't bypass `t()`.

## Standing gate — runs after EVERY milestone

| Gate | Fails when | Why |
|------|-----------|-----|
| `no-new-hardcoded-locale` | new `toLocale…('en-GB')` appears | dates must use the locale formatter |
| `no-new-hardcoded-currency` | new `£`/`$` literal in markup | money must use `formatCurrency(locale, n)` |
| `catalogue-parity` | (warn) untranslated keys per locale | tracks fallback coverage; never blocks |
| `typecheck` | `tsc --noEmit` error count **exceeds the ratchet** | catches NEW type errors |

> **IMPORTANT:** `next.config.js` has `typescript.ignoreBuildErrors: true`, so
> `next build` does **NOT** catch type errors. The audit's `typecheck` gate is the
> only thing that does — run the audit WITHOUT `--skip-typecheck` (i.e. plain
> `node scripts/i18n-audit.mjs`) before committing. It's ratcheted: there are
> pre-existing errors in generated `lib/academy-cfo-saas-batch*` content files we
> don't own, so the gate tolerates that baseline count and fails only on new errors.

Milestone-0 baseline (2026-06-20): 123 locale literals, 575 currency literals,
0 `t()` adoption, 0 catalogue files.

## Per-milestone assertions (added on top of the standing gate)

### Foundation
- **F1 routing** — every route resolves under each `/{locale}/…` prefix; a bare
  URL redirects via middleware; localized 404. Assert: no route 404s under any locale.
- **F2 persistence / switcher** — switching writes URL + cookie + `profiles.preferred_locale`;
  choice survives reload and a simulated second device; switcher lists exactly
  `en + es,fr,de,nl,ar` (add Nederlands, drop out-of-scope entries).
- **F3 extraction** — `t()` adoption count rises; ratchet lowered via `--update`.
- **F4 formatters** — date/number/currency render per-locale in a snapshot test;
  zero new `en-GB` literals.
- **F5 RTL** — converted set has no remaining physical props (`paddingLeft`/`marginRight`/
  `textAlign:'left'`); `dir="rtl"` flips layout; visual-regression diff reviewed.
- **F6 content + SEO infra** — content tables have `locale` column; hreflang cluster
  emitted; sitemap lists alternates; canonical per locale.
- **F7 agent + AI** — system prompt is ONE shared base + thin per-language wrapper
  (assert no per-language prompt forks); chat output language matches requested locale.
- **F8 tooling** — locale catalogues exist (parity gate activates); missing-key
  detector + CI guard live.

### Per-language (each of stages 1–8, per locale)
1. **UI catalogue** — parity gate shows 0 missing for this locale's UI namespaces.
2. **Locale config** — formatter snapshot correct; TTS voice ≠ en-GB; number-input parses local format.
3. **Transactional** — receipt/menu resolves the **customer's** locale (not merchant's);
   Stripe session gets `locale` + correct currency; CSV headers localized.
4. **Static content** — declared depth tier met (Tier 1 full / Tier 2 top-N reviewed);
   localized slugs + search indexing present.
5. **Legal** — privacy/terms carry a human sign-off record for this jurisdiction
   (de and nl are separate). No machine-translated legal text shipped.
6. **SEO** — hreflang includes this locale across the cluster; sitemap updated.
7. **AI** — chat answers in-locale and passes output-language validation; agent
   generates this locale's posts.
8. **QA & launch** — native-review sign-off; visual (+ RTL for `ar`) regression clean;
   language enabled in switcher only after all above pass.

## Reporting

After each milestone, record: gate output, ratchet delta (debt burned), per-locale
parity %, and any waivers. A milestone is "done" only when the standing gate is
green and its specific assertions above are checked.
