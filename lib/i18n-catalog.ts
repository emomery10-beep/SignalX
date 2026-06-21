// Catalogue-backed translation lookup with guaranteed graceful fallback.
//
//   t('es', 'common.save')                    → "Guardar"
//   t('de', 'common.save_changes')            → "Änderungen speichern"
//   t('fr', 'common.greeting', { name: 'Lee' })→ interpolates {name}
//
// Fallback chain (this is the "never break another language" guarantee):
//   requested locale → English → the key itself
// A missing translation shows English, never a crash or a blank. The self-audit
// (catalogue-parity gate) reports which keys are still falling back so they can
// be filled in, but the app keeps working in the meantime.
//
// Keys are "<namespace>.<path>", where namespace maps to locales/<loc>/<ns>.json.
// To add a namespace: create the JSON in every locale folder and register it
// in CATALOG below. The audit then enforces parity automatically.

import type { Lang } from './i18n'

import enCommon from '@/locales/en/common.json'
import esCommon from '@/locales/es/common.json'
import frCommon from '@/locales/fr/common.json'
import deCommon from '@/locales/de/common.json'
import nlCommon from '@/locales/nl/common.json'
import arCommon from '@/locales/ar/common.json'
import enNav from '@/locales/en/nav.json'
import esNav from '@/locales/es/nav.json'
import frNav from '@/locales/fr/nav.json'
import deNav from '@/locales/de/nav.json'
import nlNav from '@/locales/nl/nav.json'
import arNav from '@/locales/ar/nav.json'
import enErrors from '@/locales/en/errors.json'
import esErrors from '@/locales/es/errors.json'
import frErrors from '@/locales/fr/errors.json'
import deErrors from '@/locales/de/errors.json'
import nlErrors from '@/locales/nl/errors.json'
import arErrors from '@/locales/ar/errors.json'
import enAppnav from '@/locales/en/appnav.json'
import esAppnav from '@/locales/es/appnav.json'
import frAppnav from '@/locales/fr/appnav.json'
import deAppnav from '@/locales/de/appnav.json'
import nlAppnav from '@/locales/nl/appnav.json'
import arAppnav from '@/locales/ar/appnav.json'
import enAuth from '@/locales/en/auth.json'
import esAuth from '@/locales/es/auth.json'
import frAuth from '@/locales/fr/auth.json'
import deAuth from '@/locales/de/auth.json'
import nlAuth from '@/locales/nl/auth.json'
import arAuth from '@/locales/ar/auth.json'
import enPricing from '@/locales/en/pricing.json'
import esPricing from '@/locales/es/pricing.json'
import frPricing from '@/locales/fr/pricing.json'
import dePricing from '@/locales/de/pricing.json'
import nlPricing from '@/locales/nl/pricing.json'
import arPricing from '@/locales/ar/pricing.json'
import enCookies from '@/locales/en/cookies.json'
import esCookies from '@/locales/es/cookies.json'
import frCookies from '@/locales/fr/cookies.json'
import deCookies from '@/locales/de/cookies.json'
import nlCookies from '@/locales/nl/cookies.json'
import arCookies from '@/locales/ar/cookies.json'
import enSettings from '@/locales/en/settings.json'
import esSettings from '@/locales/es/settings.json'
import frSettings from '@/locales/fr/settings.json'
import deSettings from '@/locales/de/settings.json'
import nlSettings from '@/locales/nl/settings.json'
import arSettings from '@/locales/ar/settings.json'
import enCompare from '@/locales/en/compare.json'
import esCompare from '@/locales/es/compare.json'
import frCompare from '@/locales/fr/compare.json'
import deCompare from '@/locales/de/compare.json'
import nlCompare from '@/locales/nl/compare.json'
import arCompare from '@/locales/ar/compare.json'
import enIntegrationsPage from '@/locales/en/integrations_page.json'
import esIntegrationsPage from '@/locales/es/integrations_page.json'
import frIntegrationsPage from '@/locales/fr/integrations_page.json'
import deIntegrationsPage from '@/locales/de/integrations_page.json'
import nlIntegrationsPage from '@/locales/nl/integrations_page.json'
import arIntegrationsPage from '@/locales/ar/integrations_page.json'
import enPosMarketing from '@/locales/en/pos_marketing.json'
import esPosMarketing from '@/locales/es/pos_marketing.json'
import frPosMarketing from '@/locales/fr/pos_marketing.json'
import dePosMarketing from '@/locales/de/pos_marketing.json'
import nlPosMarketing from '@/locales/nl/pos_marketing.json'
import arPosMarketing from '@/locales/ar/pos_marketing.json'
import enFreetools from '@/locales/en/freetools.json'
import esFreetools from '@/locales/es/freetools.json'
import frFreetools from '@/locales/fr/freetools.json'
import deFreetools from '@/locales/de/freetools.json'
import nlFreetools from '@/locales/nl/freetools.json'
import arFreetools from '@/locales/ar/freetools.json'
// English-only for now — translations pending API credits. The resolver falls
// back to English for locales that lack a namespace, so these render correctly
// in every locale until the non-English files are generated + registered.
import enLanding from '@/locales/en/landing.json'
import enAcademy from '@/locales/en/academy.json'
import enHelp from '@/locales/en/help.json'
import enBlogIndex from '@/locales/en/blog_index.json'
import enChangelog from '@/locales/en/changelog.json'
import enTransparency from '@/locales/en/transparency.json'
import enBilling from '@/locales/en/billing.json'
import enAlerts from '@/locales/en/alerts.json'
import enShipments from '@/locales/en/shipments.json'
import enTemplates from '@/locales/en/templates.json'
import enSources from '@/locales/en/sources.json'
import enAsk from '@/locales/en/ask.json'
import enExpansion from '@/locales/en/expansion.json'
import enFiles from '@/locales/en/files.json'
import enIntelligence from '@/locales/en/intelligence.json'
import enForecasts from '@/locales/en/forecasts.json'
import enOnboarding from '@/locales/en/onboarding.json'
import enChat from '@/locales/en/chat.json'

type Dict = Record<string, unknown>

const CATALOG: Record<string, Record<string, Dict>> = {
  en: { common: enCommon, nav: enNav, errors: enErrors, appnav: enAppnav, auth: enAuth, pricing: enPricing, cookies: enCookies, settings: enSettings, compare: enCompare, integrations_page: enIntegrationsPage, pos_marketing: enPosMarketing, freetools: enFreetools, landing: enLanding, academy: enAcademy, help: enHelp, blog_index: enBlogIndex, changelog: enChangelog, transparency: enTransparency, billing: enBilling, alerts: enAlerts, shipments: enShipments, templates: enTemplates, sources: enSources, ask: enAsk, expansion: enExpansion, files: enFiles, intelligence: enIntelligence, forecasts: enForecasts, onboarding: enOnboarding, chat: enChat },
  es: { common: esCommon, nav: esNav, errors: esErrors, appnav: esAppnav, auth: esAuth, pricing: esPricing, cookies: esCookies, settings: esSettings, compare: esCompare, integrations_page: esIntegrationsPage, pos_marketing: esPosMarketing, freetools: esFreetools },
  fr: { common: frCommon, nav: frNav, errors: frErrors, appnav: frAppnav, auth: frAuth, pricing: frPricing, cookies: frCookies, settings: frSettings, compare: frCompare, integrations_page: frIntegrationsPage, pos_marketing: frPosMarketing, freetools: frFreetools },
  de: { common: deCommon, nav: deNav, errors: deErrors, appnav: deAppnav, auth: deAuth, pricing: dePricing, cookies: deCookies, settings: deSettings, compare: deCompare, integrations_page: deIntegrationsPage, pos_marketing: dePosMarketing, freetools: deFreetools },
  nl: { common: nlCommon, nav: nlNav, errors: nlErrors, appnav: nlAppnav, auth: nlAuth, pricing: nlPricing, cookies: nlCookies, settings: nlSettings, compare: nlCompare, integrations_page: nlIntegrationsPage, pos_marketing: nlPosMarketing, freetools: nlFreetools },
  ar: { common: arCommon, nav: arNav, errors: arErrors, appnav: arAppnav, auth: arAuth, pricing: arPricing, cookies: arCookies, settings: arSettings, compare: arCompare, integrations_page: arIntegrationsPage, pos_marketing: arPosMarketing, freetools: arFreetools },
}

const BASE = 'en'

function resolve(locale: string, key: string): string | undefined {
  const dot = key.indexOf('.')
  if (dot === -1) return undefined
  const ns = key.slice(0, dot)
  const path = key.slice(dot + 1)
  const dict = CATALOG[locale]?.[ns]
  if (!dict) return undefined
  // walk the remaining dotted path for nested namespaces
  let node: unknown = dict
  for (const seg of path.split('.')) {
    if (node && typeof node === 'object' && seg in (node as Dict)) node = (node as Dict)[seg]
    else return undefined
  }
  return typeof node === 'string' ? node : undefined
}

export function t(locale: string, key: string, vars?: Record<string, string | number>): string {
  let s = resolve(locale, key) ?? resolve(BASE, key) ?? key
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v))
  return s
}

// Returns true when a key is genuinely translated in the locale (not falling back).
export function hasTranslation(locale: string, key: string): boolean {
  return locale === BASE || resolve(locale, key) !== undefined
}

export type { Lang }
