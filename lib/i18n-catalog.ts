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

import enAcademy from '@/locales/en/academy.json'
import enAdmin from '@/locales/en/admin.json'
import enAlerts from '@/locales/en/alerts.json'
import enAppnav from '@/locales/en/appnav.json'
import enAsk from '@/locales/en/ask.json'
import enAuth from '@/locales/en/auth.json'
import enBilling from '@/locales/en/billing.json'
import enBlogIndex from '@/locales/en/blog_index.json'
import enChangelog from '@/locales/en/changelog.json'
import enChat from '@/locales/en/chat.json'
import enCommon from '@/locales/en/common.json'
import enCompare from '@/locales/en/compare.json'
import enCookies from '@/locales/en/cookies.json'
import enDpa from '@/locales/en/dpa.json'
import enErrors from '@/locales/en/errors.json'
import enExpansion from '@/locales/en/expansion.json'
import enFiles from '@/locales/en/files.json'
import enForecasts from '@/locales/en/forecasts.json'
import enFreetools from '@/locales/en/freetools.json'
import enHelp from '@/locales/en/help.json'
import enIntegrationsPage from '@/locales/en/integrations_page.json'
import enIntelligence from '@/locales/en/intelligence.json'
import enInvite from '@/locales/en/invite.json'
import enLanding from '@/locales/en/landing.json'
import enNav from '@/locales/en/nav.json'
import enOnboarding from '@/locales/en/onboarding.json'
import enPosApp from '@/locales/en/pos_app.json'
import enPosMarketing from '@/locales/en/pos_marketing.json'
import enPricing from '@/locales/en/pricing.json'
import enPrivacy from '@/locales/en/privacy.json'
import enSettings from '@/locales/en/settings.json'
import enShipments from '@/locales/en/shipments.json'
import enSources from '@/locales/en/sources.json'
import enStaffSetup from '@/locales/en/staff_setup.json'
import enTemplates from '@/locales/en/templates.json'
import enTerms from '@/locales/en/terms.json'
import enTransparency from '@/locales/en/transparency.json'
import esAcademy from '@/locales/es/academy.json'
import esAdmin from '@/locales/es/admin.json'
import esAlerts from '@/locales/es/alerts.json'
import esAppnav from '@/locales/es/appnav.json'
import esAsk from '@/locales/es/ask.json'
import esAuth from '@/locales/es/auth.json'
import esBilling from '@/locales/es/billing.json'
import esBlogIndex from '@/locales/es/blog_index.json'
import esChangelog from '@/locales/es/changelog.json'
import esChat from '@/locales/es/chat.json'
import esCommon from '@/locales/es/common.json'
import esCompare from '@/locales/es/compare.json'
import esCookies from '@/locales/es/cookies.json'
import esErrors from '@/locales/es/errors.json'
import esExpansion from '@/locales/es/expansion.json'
import esFiles from '@/locales/es/files.json'
import esForecasts from '@/locales/es/forecasts.json'
import esFreetools from '@/locales/es/freetools.json'
import esHelp from '@/locales/es/help.json'
import esIntegrationsPage from '@/locales/es/integrations_page.json'
import esIntelligence from '@/locales/es/intelligence.json'
import esInvite from '@/locales/es/invite.json'
import esLanding from '@/locales/es/landing.json'
import esNav from '@/locales/es/nav.json'
import esOnboarding from '@/locales/es/onboarding.json'
import esPosApp from '@/locales/es/pos_app.json'
import esPosMarketing from '@/locales/es/pos_marketing.json'
import esPricing from '@/locales/es/pricing.json'
import esSettings from '@/locales/es/settings.json'
import esShipments from '@/locales/es/shipments.json'
import esSources from '@/locales/es/sources.json'
import esStaffSetup from '@/locales/es/staff_setup.json'
import esTemplates from '@/locales/es/templates.json'
import esTransparency from '@/locales/es/transparency.json'
import frAcademy from '@/locales/fr/academy.json'
import frAdmin from '@/locales/fr/admin.json'
import frAlerts from '@/locales/fr/alerts.json'
import frAppnav from '@/locales/fr/appnav.json'
import frAsk from '@/locales/fr/ask.json'
import frAuth from '@/locales/fr/auth.json'
import frBilling from '@/locales/fr/billing.json'
import frBlogIndex from '@/locales/fr/blog_index.json'
import frChangelog from '@/locales/fr/changelog.json'
import frChat from '@/locales/fr/chat.json'
import frCommon from '@/locales/fr/common.json'
import frCompare from '@/locales/fr/compare.json'
import frCookies from '@/locales/fr/cookies.json'
import frErrors from '@/locales/fr/errors.json'
import frExpansion from '@/locales/fr/expansion.json'
import frFiles from '@/locales/fr/files.json'
import frForecasts from '@/locales/fr/forecasts.json'
import frFreetools from '@/locales/fr/freetools.json'
import frHelp from '@/locales/fr/help.json'
import frIntegrationsPage from '@/locales/fr/integrations_page.json'
import frIntelligence from '@/locales/fr/intelligence.json'
import frInvite from '@/locales/fr/invite.json'
import frLanding from '@/locales/fr/landing.json'
import frNav from '@/locales/fr/nav.json'
import frOnboarding from '@/locales/fr/onboarding.json'
import frPosApp from '@/locales/fr/pos_app.json'
import frPosMarketing from '@/locales/fr/pos_marketing.json'
import frPricing from '@/locales/fr/pricing.json'
import frSettings from '@/locales/fr/settings.json'
import frShipments from '@/locales/fr/shipments.json'
import frSources from '@/locales/fr/sources.json'
import frStaffSetup from '@/locales/fr/staff_setup.json'
import frTemplates from '@/locales/fr/templates.json'
import frTransparency from '@/locales/fr/transparency.json'
import deAcademy from '@/locales/de/academy.json'
import deAdmin from '@/locales/de/admin.json'
import deAlerts from '@/locales/de/alerts.json'
import deAppnav from '@/locales/de/appnav.json'
import deAsk from '@/locales/de/ask.json'
import deAuth from '@/locales/de/auth.json'
import deBilling from '@/locales/de/billing.json'
import deBlogIndex from '@/locales/de/blog_index.json'
import deChangelog from '@/locales/de/changelog.json'
import deChat from '@/locales/de/chat.json'
import deCommon from '@/locales/de/common.json'
import deCompare from '@/locales/de/compare.json'
import deCookies from '@/locales/de/cookies.json'
import deErrors from '@/locales/de/errors.json'
import deExpansion from '@/locales/de/expansion.json'
import deFiles from '@/locales/de/files.json'
import deForecasts from '@/locales/de/forecasts.json'
import deFreetools from '@/locales/de/freetools.json'
import deHelp from '@/locales/de/help.json'
import deIntegrationsPage from '@/locales/de/integrations_page.json'
import deIntelligence from '@/locales/de/intelligence.json'
import deInvite from '@/locales/de/invite.json'
import deLanding from '@/locales/de/landing.json'
import deNav from '@/locales/de/nav.json'
import deOnboarding from '@/locales/de/onboarding.json'
import dePosApp from '@/locales/de/pos_app.json'
import dePosMarketing from '@/locales/de/pos_marketing.json'
import dePricing from '@/locales/de/pricing.json'
import deSettings from '@/locales/de/settings.json'
import deShipments from '@/locales/de/shipments.json'
import deSources from '@/locales/de/sources.json'
import deStaffSetup from '@/locales/de/staff_setup.json'
import deTemplates from '@/locales/de/templates.json'
import deTransparency from '@/locales/de/transparency.json'
import nlAcademy from '@/locales/nl/academy.json'
import nlAdmin from '@/locales/nl/admin.json'
import nlAlerts from '@/locales/nl/alerts.json'
import nlAppnav from '@/locales/nl/appnav.json'
import nlAsk from '@/locales/nl/ask.json'
import nlAuth from '@/locales/nl/auth.json'
import nlBilling from '@/locales/nl/billing.json'
import nlBlogIndex from '@/locales/nl/blog_index.json'
import nlChangelog from '@/locales/nl/changelog.json'
import nlChat from '@/locales/nl/chat.json'
import nlCommon from '@/locales/nl/common.json'
import nlCompare from '@/locales/nl/compare.json'
import nlCookies from '@/locales/nl/cookies.json'
import nlErrors from '@/locales/nl/errors.json'
import nlExpansion from '@/locales/nl/expansion.json'
import nlFiles from '@/locales/nl/files.json'
import nlForecasts from '@/locales/nl/forecasts.json'
import nlFreetools from '@/locales/nl/freetools.json'
import nlHelp from '@/locales/nl/help.json'
import nlIntegrationsPage from '@/locales/nl/integrations_page.json'
import nlIntelligence from '@/locales/nl/intelligence.json'
import nlInvite from '@/locales/nl/invite.json'
import nlLanding from '@/locales/nl/landing.json'
import nlNav from '@/locales/nl/nav.json'
import nlOnboarding from '@/locales/nl/onboarding.json'
import nlPosApp from '@/locales/nl/pos_app.json'
import nlPosMarketing from '@/locales/nl/pos_marketing.json'
import nlPricing from '@/locales/nl/pricing.json'
import nlSettings from '@/locales/nl/settings.json'
import nlShipments from '@/locales/nl/shipments.json'
import nlSources from '@/locales/nl/sources.json'
import nlStaffSetup from '@/locales/nl/staff_setup.json'
import nlTemplates from '@/locales/nl/templates.json'
import nlTransparency from '@/locales/nl/transparency.json'
import arAcademy from '@/locales/ar/academy.json'
import arAdmin from '@/locales/ar/admin.json'
import arAlerts from '@/locales/ar/alerts.json'
import arAppnav from '@/locales/ar/appnav.json'
import arAsk from '@/locales/ar/ask.json'
import arAuth from '@/locales/ar/auth.json'
import arBilling from '@/locales/ar/billing.json'
import arBlogIndex from '@/locales/ar/blog_index.json'
import arChangelog from '@/locales/ar/changelog.json'
import arChat from '@/locales/ar/chat.json'
import arCommon from '@/locales/ar/common.json'
import arCompare from '@/locales/ar/compare.json'
import arCookies from '@/locales/ar/cookies.json'
import arErrors from '@/locales/ar/errors.json'
import arExpansion from '@/locales/ar/expansion.json'
import arFiles from '@/locales/ar/files.json'
import arForecasts from '@/locales/ar/forecasts.json'
import arFreetools from '@/locales/ar/freetools.json'
import arHelp from '@/locales/ar/help.json'
import arIntegrationsPage from '@/locales/ar/integrations_page.json'
import arIntelligence from '@/locales/ar/intelligence.json'
import arInvite from '@/locales/ar/invite.json'
import arLanding from '@/locales/ar/landing.json'
import arNav from '@/locales/ar/nav.json'
import arOnboarding from '@/locales/ar/onboarding.json'
import arPosApp from '@/locales/ar/pos_app.json'
import arPosMarketing from '@/locales/ar/pos_marketing.json'
import arPricing from '@/locales/ar/pricing.json'
import arSettings from '@/locales/ar/settings.json'
import arShipments from '@/locales/ar/shipments.json'
import arSources from '@/locales/ar/sources.json'
import arStaffSetup from '@/locales/ar/staff_setup.json'
import arTemplates from '@/locales/ar/templates.json'
import arTransparency from '@/locales/ar/transparency.json'

type Dict = Record<string, unknown>

const CATALOG: Record<string, Record<string, Dict>> = {
  en: { academy: enAcademy, admin: enAdmin, alerts: enAlerts, appnav: enAppnav, ask: enAsk, auth: enAuth, billing: enBilling, blog_index: enBlogIndex, changelog: enChangelog, chat: enChat, common: enCommon, compare: enCompare, cookies: enCookies, dpa: enDpa, errors: enErrors, expansion: enExpansion, files: enFiles, forecasts: enForecasts, freetools: enFreetools, help: enHelp, integrations_page: enIntegrationsPage, intelligence: enIntelligence, invite: enInvite, landing: enLanding, nav: enNav, onboarding: enOnboarding, pos_app: enPosApp, pos_marketing: enPosMarketing, pricing: enPricing, privacy: enPrivacy, settings: enSettings, shipments: enShipments, sources: enSources, staff_setup: enStaffSetup, templates: enTemplates, terms: enTerms, transparency: enTransparency },
  es: { academy: esAcademy, admin: esAdmin, alerts: esAlerts, appnav: esAppnav, ask: esAsk, auth: esAuth, billing: esBilling, blog_index: esBlogIndex, changelog: esChangelog, chat: esChat, common: esCommon, compare: esCompare, cookies: esCookies, errors: esErrors, expansion: esExpansion, files: esFiles, forecasts: esForecasts, freetools: esFreetools, help: esHelp, integrations_page: esIntegrationsPage, intelligence: esIntelligence, invite: esInvite, landing: esLanding, nav: esNav, onboarding: esOnboarding, pos_app: esPosApp, pos_marketing: esPosMarketing, pricing: esPricing, settings: esSettings, shipments: esShipments, sources: esSources, staff_setup: esStaffSetup, templates: esTemplates, transparency: esTransparency },
  fr: { academy: frAcademy, admin: frAdmin, alerts: frAlerts, appnav: frAppnav, ask: frAsk, auth: frAuth, billing: frBilling, blog_index: frBlogIndex, changelog: frChangelog, chat: frChat, common: frCommon, compare: frCompare, cookies: frCookies, errors: frErrors, expansion: frExpansion, files: frFiles, forecasts: frForecasts, freetools: frFreetools, help: frHelp, integrations_page: frIntegrationsPage, intelligence: frIntelligence, invite: frInvite, landing: frLanding, nav: frNav, onboarding: frOnboarding, pos_app: frPosApp, pos_marketing: frPosMarketing, pricing: frPricing, settings: frSettings, shipments: frShipments, sources: frSources, staff_setup: frStaffSetup, templates: frTemplates, transparency: frTransparency },
  de: { academy: deAcademy, admin: deAdmin, alerts: deAlerts, appnav: deAppnav, ask: deAsk, auth: deAuth, billing: deBilling, blog_index: deBlogIndex, changelog: deChangelog, chat: deChat, common: deCommon, compare: deCompare, cookies: deCookies, errors: deErrors, expansion: deExpansion, files: deFiles, forecasts: deForecasts, freetools: deFreetools, help: deHelp, integrations_page: deIntegrationsPage, intelligence: deIntelligence, invite: deInvite, landing: deLanding, nav: deNav, onboarding: deOnboarding, pos_app: dePosApp, pos_marketing: dePosMarketing, pricing: dePricing, settings: deSettings, shipments: deShipments, sources: deSources, staff_setup: deStaffSetup, templates: deTemplates, transparency: deTransparency },
  nl: { academy: nlAcademy, admin: nlAdmin, alerts: nlAlerts, appnav: nlAppnav, ask: nlAsk, auth: nlAuth, billing: nlBilling, blog_index: nlBlogIndex, changelog: nlChangelog, chat: nlChat, common: nlCommon, compare: nlCompare, cookies: nlCookies, errors: nlErrors, expansion: nlExpansion, files: nlFiles, forecasts: nlForecasts, freetools: nlFreetools, help: nlHelp, integrations_page: nlIntegrationsPage, intelligence: nlIntelligence, invite: nlInvite, landing: nlLanding, nav: nlNav, onboarding: nlOnboarding, pos_app: nlPosApp, pos_marketing: nlPosMarketing, pricing: nlPricing, settings: nlSettings, shipments: nlShipments, sources: nlSources, staff_setup: nlStaffSetup, templates: nlTemplates, transparency: nlTransparency },
  ar: { academy: arAcademy, admin: arAdmin, alerts: arAlerts, appnav: arAppnav, ask: arAsk, auth: arAuth, billing: arBilling, blog_index: arBlogIndex, changelog: arChangelog, chat: arChat, common: arCommon, compare: arCompare, cookies: arCookies, errors: arErrors, expansion: arExpansion, files: arFiles, forecasts: arForecasts, freetools: arFreetools, help: arHelp, integrations_page: arIntegrationsPage, intelligence: arIntelligence, invite: arInvite, landing: arLanding, nav: arNav, onboarding: arOnboarding, pos_app: arPosApp, pos_marketing: arPosMarketing, pricing: arPricing, settings: arSettings, shipments: arShipments, sources: arSources, staff_setup: arStaffSetup, templates: arTemplates, transparency: arTransparency },
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
