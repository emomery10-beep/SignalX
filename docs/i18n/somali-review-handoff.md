# Somali (so) — native-speaker review handoff

Status: Somali locale is **built, verified, and live-ready in code** across both apps
(main + pos-askbiz) and the bespoke `/so` Somalia landing page. All UI strings were
translated by Claude against a locked glossary and pass programmatic parity checks
(keys, order, `{placeholder}` tokens, no empty values).

**Before flipping Somali live to real users, a native Somali speaker should review the
items below.** Everything else can ship as-is; these are the accuracy-critical surfaces.

---

## 1. Legal namespaces — REQUIRED, legal-grade review (highest priority)
These were translated for completeness but legal wording must be verified per jurisdiction
(Somalia / Djibouti). Do not rely on them in production until reviewed by someone
qualified.

**Main app** (`locales/so/`):
- `terms.json` — Terms of Service
- `privacy.json` — Privacy Policy
- `dpa.json` — Data Processing Agreement
- `cookies.json` — Cookie notice

**POS app** (`pos-askbiz/locales/so/`):
- `pos_terms.json`
- `pos_privacy.json`
- `pos_cookies.json`

## 2. Finance / CFO namespaces — accuracy review (medium priority)
Financial terminology (margin, cashflow, EBITDA, receivables, break-even, etc.) is where
Somali business vocabulary is least standardised. Skim for terms that read wrong to a
Somali accountant/trader.
- `locales/so/cfo_*.json` (40 files) — the CFO/finance suite
- Locked glossary used: `faa'iido`=profit, `dakhli`=revenue, `kayd`=stock,
  `kharashaad`=expenses, `deyn`=debt/credit, `hadhaaga/baaqi`=balance,
  `saadaal`=forecast, `canshuur`=tax.

## 3. Bespoke Somalia landing page copy — marketing review (medium priority)
The customer-facing hero/marketing copy on `/so` should sound natural to a Somali reader.
- `components/layout/SomaliaLanding.tsx` — hero, pain points, features, FAQ (all inline Somali)
- `locales/so/landing.json` — the translated generic-homepage strings (fallback content)
- Somalia market facts baked in (verify correctness): mobile-money rails **EVC Plus, Zaad,
  eDahab**; QR standard **SOMQR**; currency **Shilin Soomaali (SOS) / USD**; stat "70%+ of
  Somali adults use mobile money."

---

## What does NOT need review
- The ~200 non-legal UI namespaces — reviewed programmatically, English fallback guarantees
  nothing breaks even if a string is imperfect.
- help/blog/academy **article content** — deliberately left in English (hardcoded, no locale
  layer), same decision as Swahili.

## How to make an edit
Edit the value in the relevant `locales/so/<ns>.json` (keys/placeholders must stay
identical to `locales/en/<ns>.json`), then run:
`node /path/to/verify-so.mjs` (parity check) or the project `scripts/i18n-audit.mjs`.

## Wiring reference (already done)
- Locale active in both apps: `lib/i18n-locale.ts` + `pos-askbiz/lib/i18n-locale.ts`
- Geo: Somalia (SO) + Djibouti (DJ) → `so` in `COUNTRY_TO_LANG`
- SEO: hreflang (`so`/`so-SO`/`so-DJ`) in `app/layout.tsx` + `app/page.tsx`; `/so` in
  `app/sitemap.ts`; Somalia/Djibouti/Mogadishu in the Organization schema
- AEO: Somali `FAQPage` schema on `/so`; AI crawlers already allowed via `robots.ts` + `llms.txt`
