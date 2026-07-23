'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useLang } from '@/components/LanguageProvider'
import { countryFromPhone, COUNTRY_CURRENCY, COUNTRY_NAMES, CURRENCIES as CURRENCY_TABLE } from '@/lib/geo'
import SpeakButton from '@/components/SpeakButton'
import PasskeyNudge from '@/components/PasskeyNudge'

type TC = (key: string, vars?: Record<string, string | number>) => string

const ACC  = '#d08a59'
const TX   = '#1a1916'
const TX2  = '#6b6760'
const TX3  = '#a39e97'
const B    = 'rgba(0,0,0,.08)'
const B2   = 'rgba(0,0,0,.14)'
const SF   = '#ffffff'
const EV   = '#f3f2ef'
const BG   = '#f9f8f6'

// ── Step definitions ──────────────────────────────────────────
// 'welcome' was removed: first/last name is already known from signup
// (email or phone+PIN both collect it), so onboarding never re-asks for it.
const STEPS = ['business', 'location', 'sector', 'export', 'connect', 'done'] as const
type Step = typeof STEPS[number]

// Business types that need a sector (product category) step
const NEEDS_SECTOR = new Set(['ecommerce', 'distributor', 'manufacturer', 'importer', 'exporter'])
// Business types that should see the export markets step
const NEEDS_EXPORT = new Set(['exporter', 'ecommerce', 'importer'])
// Business types that run a till day-to-day — land them straight in the POS.
// These are also the "simple setup" persona: no business-name typing, no
// Connect Data Sources step — straight from business type to done.
const POS_LANDING_TYPES = new Set(['retail', 'market_stall', 'food_bev', 'salon'])

// Consistent stroke-based icon set (no emoji as functional icons — emoji
// render inconsistently across devices/fonts and can't be themed/sized).
// market_stall and food_bev are listed first below: the primary target
// persona for the simplified flow taps one of the first two tiles.
const bizIcon = (id: string) => {
  const p = { width: 30, height: 30, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (id) {
    case 'market_stall': return <svg {...p}><path d="m5 11 4-7"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.6-7.4"/><path d="M4.5 15.5h15"/></svg>
    case 'food_bev': return <svg {...p}><path d="M3 2v7a2 2 0 0 0 2 2 2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6a2 2 0 0 0 2 2h3Zm0 0v7"/></svg>
    case 'retail': return <svg {...p}><path d="M3 9 4.8 4h14.4L21 9"/><path d="M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9"/><path d="M9 21v-8h6v8"/></svg>
    case 'salon': return <svg {...p}><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.12 15.88"/><path d="m14.47 14.48 5.53 5.52"/><path d="M8.12 8.12 12 12"/></svg>
    case 'courier': return <svg {...p}><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>
    case 'ecommerce': return <svg {...p}><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 3h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57L22 8H6"/></svg>
    case 'services': return <svg {...p}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
    case 'distributor': return <svg {...p}><path d="M14 18V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h1"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.36A1 1 0 0 0 17.52 8H14v10"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
    case 'manufacturer': return <svg {...p}><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-6 4V8l-6 4V8l-6 4Z"/><path d="M7 18v-2"/><path d="M12 18v-2"/><path d="M17 18v-2"/></svg>
    case 'importer': return <svg {...p}><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
    case 'exporter': return <svg {...p}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
    default: return <svg {...p}><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
  }
}

// Sector icon set — same stroke style as bizIcon. One simple recognizable
// glyph per product category; ids match the literal SECTOR_IDS strings below
// (stored as-is in profiles.sector_hints, so they stay language-independent).
const sectorIcon = (id: string) => {
  const p = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (id) {
    case 'Fashion & Apparel': return <svg {...p}><circle cx="12" cy="5" r="1.4"/><path d="M12 6.4v2"/><path d="M3 18.5 12 12l9 6.5"/><path d="M3 18.5h18"/></svg>
    case 'Beauty & Personal Care': return <svg {...p}><path d="M12 2.5 13.6 8.4 20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6Z"/></svg>
    case 'Health & Wellness': return <svg {...p}><path d="M12 20s-7-4.4-9.3-8.8A5.2 5.2 0 0 1 12 5.4a5.2 5.2 0 0 1 9.3 5.8C18.9 15.6 12 20 12 20Z"/><path d="M4 12h3l1.6-3 2 4.5 1.4-2.5h4.9"/></svg>
    case 'Food & Beverage': return <svg {...p}><path d="M6.5 3v5.5a1.8 1.8 0 0 0 3.6 0V3"/><path d="M8.3 8.5V21"/><path d="M15 3c-1.4 0-2.5 1.6-2.5 3.6S13.6 10 15 10s2.5-1.4 2.5-3.4S16.4 3 15 3Z"/><path d="M15 10v11"/></svg>
    case 'Home & Garden': return <svg {...p}><path d="M3 11 12 4l9 7"/><path d="M5.5 10v9a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-9"/><path d="M12 20v-5a2 2 0 0 1 4 0"/></svg>
    case 'Electronics & Tech': return <svg {...p}><rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/></svg>
    case 'Sports & Outdoor': return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18"/><path d="M3 12h18"/><path d="M5.8 5.8c3.4 3.4 9 3.4 12.4 0M5.8 18.2c3.4-3.4 9-3.4 12.4 0"/></svg>
    case 'Luxury & Premium': return <svg {...p}><path d="M3 8.5 9 3h6l6 5.5-9 12.5Z"/><path d="M3 8.5h18M9 3 7 8.5l5 12.5 5-12.5-2-5.5"/></svg>
    case 'Kids & Toys': return <svg {...p}><rect x="3.5" y="10.5" width="7" height="7" rx="1.2"/><rect x="13.5" y="10.5" width="7" height="7" rx="1.2"/><rect x="8.5" y="3.5" width="7" height="7" rx="1.2"/></svg>
    case 'Pet Products': return <svg {...p}><circle cx="12" cy="15.2" r="3.3"/><circle cx="5.8" cy="9" r="1.8"/><circle cx="10.4" cy="5.6" r="1.8"/><circle cx="13.6" cy="5.6" r="1.8"/><circle cx="18.2" cy="9" r="1.8"/></svg>
    case 'Arts & Crafts': return <svg {...p}><path d="m18 2 4 4-9.5 9.5-4.3 1.1 1.1-4.3Z"/><path d="M3.2 20.8c-.3-2 1-4 3-4s3.2 1.1 3.2 3-2.1 2.2-3.2 2.2-2.7-.4-3-1.2Z"/></svg>
    case 'Automotive': return <svg {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.2"/><path d="M12 5.3v4.5"/><path d="M6.5 15.5 10.3 13"/><path d="M17.5 15.5 13.7 13"/></svg>
    case 'B2B / Industrial': return <svg {...p}><rect x="2.5" y="7" width="19" height="13" rx="2"/><path d="M8.5 7V5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2"/><path d="M2.5 13h19"/></svg>
    default: return <svg {...p}><circle cx="7" cy="7" r="1.3"/><circle cx="12" cy="7" r="1.3"/><circle cx="17" cy="7" r="1.3"/><circle cx="7" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="17" cy="12" r="1.3"/><circle cx="7" cy="17" r="1.3"/><circle cx="12" cy="17" r="1.3"/><circle cx="17" cy="17" r="1.3"/></svg>
  }
}

const buildBizTypes = (tc: TC) => [
  { id: 'market_stall', label: tc('onboarding.biz_market_stall_label'), desc: tc('onboarding.biz_market_stall_desc') },
  { id: 'food_bev',     label: tc('onboarding.biz_food_bev_label'),     desc: tc('onboarding.biz_food_bev_desc') },
  { id: 'retail',       label: tc('onboarding.biz_retail_label'),       desc: tc('onboarding.biz_retail_desc') },
  { id: 'salon',        label: tc('onboarding.biz_salon_label'),        desc: tc('onboarding.biz_salon_desc') },
  { id: 'courier',      label: tc('onboarding.biz_courier_label'),      desc: tc('onboarding.biz_courier_desc') },
  { id: 'ecommerce',    label: tc('onboarding.biz_ecommerce_label'),    desc: tc('onboarding.biz_ecommerce_desc') },
  { id: 'services',     label: tc('onboarding.biz_services_label'),     desc: tc('onboarding.biz_services_desc') },
  { id: 'distributor',  label: tc('onboarding.biz_distributor_label'),  desc: tc('onboarding.biz_distributor_desc') },
  { id: 'manufacturer', label: tc('onboarding.biz_manufacturer_label'), desc: tc('onboarding.biz_manufacturer_desc') },
  { id: 'importer',     label: tc('onboarding.biz_importer_label'),     desc: tc('onboarding.biz_importer_desc') },
  { id: 'exporter',     label: tc('onboarding.biz_exporter_label'),     desc: tc('onboarding.biz_exporter_desc') },
]

const SECTOR_IDS = [
  'Fashion & Apparel', 'Beauty & Personal Care', 'Health & Wellness',
  'Food & Beverage', 'Home & Garden', 'Electronics & Tech',
  'Sports & Outdoor', 'Luxury & Premium', 'Kids & Toys',
  'Pet Products', 'Arts & Crafts', 'Automotive', 'B2B / Industrial', 'Other',
]

const buildSectors = (tc: TC) =>
  SECTOR_IDS.map((id, i) => ({ id, label: tc('onboarding.sector_' + i) }))

// Connect-step tiles — deep link straight into that connector's own flow on
// /sources (same emoji + source ids as the SOURCES array in
// app/(app)/sources/page.tsx, so the icon the user taps here is the same
// icon they land on).
// Shopify deliberately excluded — /sources itself shows a "Coming Soon" badge
// for it instead of a working Connect button (not launched yet), so this deep
// link must not offer a shortcut around that gate.
const CONNECT_SOURCES: { id: string; sourceId: string; icon: string; labelKey: string }[] = [
  { id: 'quickbooks', sourceId: 'quickbooks',    icon: '📒', labelKey: 'connect_source_quickbooks' },
  { id: 'stripe',     sourceId: 'stripe',        icon: '💳', labelKey: 'connect_source_stripe' },
  { id: 'amazon',     sourceId: 'amazon_fba',    icon: '📦', labelKey: 'connect_source_amazon' },
  { id: 'sheets',     sourceId: 'google_sheets', icon: '📊', labelKey: 'connect_source_sheets' },
  { id: 'tiktok',     sourceId: 'tiktok_shop',   icon: '🎵', labelKey: 'connect_source_tiktok' },
]

const buildCurrencies = (tc: TC) => [
  { code: 'GBP', symbol: '£', label: tc('onboarding.currency_gbp_label') },
  { code: 'USD', symbol: '$', label: tc('onboarding.currency_usd_label') },
  { code: 'EUR', symbol: '€', label: tc('onboarding.currency_eur_label') },
  { code: 'KES', symbol: 'KSh', label: tc('onboarding.currency_kes_label') },
  { code: 'DJF', symbol: 'Fdj', label: tc('onboarding.currency_djf_label') },
  { code: 'NGN', symbol: '₦', label: tc('onboarding.currency_ngn_label') },
  { code: 'GHS', symbol: '₵', label: tc('onboarding.currency_ghs_label') },
  { code: 'ZAR', symbol: 'R', label: tc('onboarding.currency_zar_label') },
  { code: 'AED', symbol: 'د.إ', label: tc('onboarding.currency_aed_label') },
  { code: 'INR', symbol: '₹', label: tc('onboarding.currency_inr_label') },
  { code: 'AUD', symbol: 'A$', label: tc('onboarding.currency_aud_label') },
  { code: 'CAD', symbol: 'C$', label: tc('onboarding.currency_cad_label') },
  { code: 'SGD', symbol: 'S$', label: tc('onboarding.currency_sgd_label') },
]

const CURRENCY_SYMBOLS: Record<string, string> = {
  GBP: '£', USD: '$', EUR: '€', KES: 'KSh', SOS: 'Sh', DJF: 'Fdj', NGN: '₦', GHS: '₵',
  ZAR: 'R', AED: 'د.إ', INR: '₹', AUD: 'A$', CAD: 'C$', SGD: 'S$',
}

const buildExportMarkets = (tc: TC) => [
  { id: 'us', label: tc('onboarding.market_us_label') },
  { id: 'de', label: tc('onboarding.market_de_label') },
  { id: 'fr', label: tc('onboarding.market_fr_label') },
  { id: 'au', label: tc('onboarding.market_au_label') },
  { id: 'ca', label: tc('onboarding.market_ca_label') },
  { id: 'ae', label: tc('onboarding.market_ae_label') },
  { id: 'ng', label: tc('onboarding.market_ng_label') },
  { id: 'ke', label: tc('onboarding.market_ke_label') },
  { id: 'za', label: tc('onboarding.market_za_label') },
  { id: 'in', label: tc('onboarding.market_in_label') },
  { id: 'sg', label: tc('onboarding.market_sg_label') },
  { id: 'jp', label: tc('onboarding.market_jp_label') },
]

type Geo = { countryCode: string; country: string; currency: string; currencySymbol: string; region: string; flag: string }

const COUNTRY_LIST = Object.entries(COUNTRY_NAMES).map(([code, name]) => ({ code, name }))

// Somali country names for the supported markets — Chrome's Intl has no 'so'
// region data (returns English), so the primary audience needs these by hand.
const SO_REGION: Record<string, string> = {
  SO: 'Soomaaliya', DJ: 'Jabuuti', KE: 'Kenya', ET: 'Itoobiya', UG: 'Uganda',
  TZ: 'Tansaaniya', GH: 'Gaana', ZA: 'Koonfur Afrika', NG: 'Nayjeeriya', RW: 'Ruwanda',
  ZM: 'Sambiya', ZW: 'Simbaabwe', MW: 'Malaawi', MZ: 'Musambiig',
  US: 'Maraykanka', CA: 'Kanada', GB: 'Boqortooyada Midowday', IE: 'Ayrlaan',
  DE: 'Jarmalka', FR: 'Faransiiska', ES: 'Isbaanishka', IT: 'Talyaaniga', NL: 'Nederland',
  BE: 'Beljiyam', PT: 'Bortuqaal', AT: 'Awstoriya', FI: 'Finland',
  AE: 'Imaaraadka Carabta', IN: 'Hindiya', SG: 'Singabuur', AU: 'Awstaraaliya',
  MX: 'Meksiko', BR: 'Braasiil',
}

const inp: React.CSSProperties = {
  width: '100%', padding: '10px 13px', fontSize: 12,
  background: EV, border: `1.5px solid ${B2}`, borderRadius: 10,
  color: TX, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
}

export default function OnboardingPage() {
  const supabase = createClient()
  const { tc, lang } = useLang()

  const BIZ_TYPES = buildBizTypes(tc)
  const SECTORS = buildSectors(tc)
  const BASE_CURRENCIES = buildCurrencies(tc)
  const EXPORT_MARKETS = buildExportMarkets(tc)

  const [step,         setStep]         = useState<Step>('business')
  const [saving,       setSaving]       = useState(false)
  const [saveError,    setSaveError]    = useState('')
  // Signup passkey nudge — shown once after onboarding actually completes
  // (finish() or the top-level skip()), not before it starts. Setting this
  // swaps the whole step content for <PasskeyNudge>, which itself decides
  // whether to show the nudge or navigate straight to the destination.
  const [pendingNudge, setPendingNudge] = useState<string | null>(null)
  const [firstName,    setFirstName]    = useState('')
  const [businessName, setBusinessName] = useState('')
  const [bizType,      setBizType]      = useState('')
  const [currency,     setCurrency]     = useState('GBP')

  // Uniform for every country: the picker always includes the detected/selected
  // currency, sourced from the comprehensive lib/geo table when it isn't in the
  // curated shortlist — so a phone-detected UGX/TZS/ETB/etc. shows and saves
  // correctly instead of silently falling back to £.
  // Curated currencies keep their hand-localised tc labels — the ONLY reliable
  // localisation for Somali (Chrome's Intl has no 'so' currency data and returns
  // English). A detected currency outside the shortlist gets an Intl-localised
  // name where the browser supports the locale, English-named where it doesn't.
  const ccyNames = (() => { try { return new Intl.DisplayNames([lang], { type: 'currency' }) } catch { return null } })()
  const localiseCcy = (code: string, fb: string) => { try { const n = ccyNames?.of(code); return (n && n !== code) ? n : fb } catch { return fb } }
  const CURRENCIES = BASE_CURRENCIES.some(c => c.code === currency)
    ? BASE_CURRENCIES
    : [{ code: currency, symbol: CURRENCY_TABLE[currency]?.sym || currency, label: localiseCcy(currency, CURRENCY_TABLE[currency]?.name || currency) }, ...BASE_CURRENCIES]

  // Localise COUNTRY names into the user's language too (so: "Soomaaliya",
  // ar: "الصومال"). Used for the detected-location display and the manual
  // country picker so a Somali/Swahili/etc. speaker sees + can search their
  // country in their own language.
  const regionDisp = (() => { try { return new Intl.DisplayNames([lang], { type: 'region' }) } catch { return null } })()
  const regionName = (code: string, fallback: string) => {
    if (lang === 'so' && SO_REGION[code]) return SO_REGION[code]
    try { const n = regionDisp?.of(code); return n && n !== code ? n : fallback } catch { return fallback }
  }
  const COUNTRIES = COUNTRY_LIST.map(c => ({ ...c, localName: regionName(c.code, c.name) }))
  const [region,       setRegion]       = useState('')
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false)
  const [countryActiveIdx, setCountryActiveIdx] = useState(0)
  const [sectors,      setSectors]      = useState<string[]>([])
  const [exportMkts,   setExportMkts]   = useState<string[]>([])
  const [wantsExport,  setWantsExport]  = useState<boolean | null>(null)

  // Location auto-detect — mirrors the pattern already used on the sign-in
  // page. Confirmed with one tap instead of a 12-item dropdown; manual
  // pickers stay available as a fallback if detection fails or is wrong.
  const [geo,            setGeo]            = useState<Geo | null>(null)
  const [geoLoading,     setGeoLoading]     = useState(true)
  const [manualLocation, setManualLocation] = useState(false)
  const [countryCode,    setCountryCode]    = useState('')

  // One pass on mount: pull the first name from signup, then set the default
  // location. Location prefers the SIGNUP PHONE's country — reliable for
  // mobile-money vendors, since African carrier IPs frequently geolocate to
  // the wrong country. IP geo (/api/geo) is only the fallback (e.g. email
  // signups with no phone). The manual picker remains available either way.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle()
        const fn = (profile?.full_name || '').trim().split(/\s+/)[0] || ''
        if (!cancelled && fn) setFirstName(fn)
      }

      // 1) Phone-first: derive country → currency from the signup number.
      const phone = (user?.user_metadata as { phone?: string } | undefined)?.phone || user?.phone || ''
      const cc = countryFromPhone(phone)
      if (cc && COUNTRY_CURRENCY[cc]) {
        const currency: string = COUNTRY_CURRENCY[cc]!
        const name = COUNTRY_NAMES[cc] || cc
        // ISO country code → flag emoji (regional indicator symbols).
        const flag = cc.replace(/[A-Za-z]/g, c => String.fromCodePoint(127397 + c.toUpperCase().charCodeAt(0)))
        if (!cancelled) {
          setGeo({ countryCode: cc, country: name, currency, currencySymbol: (CURRENCY_SYMBOLS[currency] || CURRENCY_TABLE[currency]?.sym || '£'), region: name, flag })
          setCurrency(currency)
          setRegion(name)
          setGeoLoading(false)
        }
        return
      }

      // 2) Fallback: IP geolocation.
      try {
        const r = await fetch('/api/geo')
        if (!r.ok) throw new Error('geo unavailable')
        const d = await r.json()
        if (cancelled) return
        setGeo({ countryCode: d.countryCode, country: d.country, currency: d.currency, currencySymbol: d.currencySymbol, region: d.region || d.country, flag: d.flag })
        setCurrency(d.currency)
        setRegion(d.region || d.country)
      } catch {
        if (!cancelled) setManualLocation(true)
      } finally {
        if (!cancelled) setGeoLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const stepIndex = STEPS.indexOf(step)
  const progress  = (stepIndex / (STEPS.length - 1)) * 100
  const isPosPersona = POS_LANDING_TYPES.has(bizType)

  // Text the read-aloud button speaks for the current step (heading + guidance).
  const spokenText = (() => {
    switch (step) {
      case 'business': return `${firstName ? tc('onboarding.business_title_named', { name: firstName }) : tc('onboarding.business_title')}. ${tc('onboarding.business_subtitle')}`
      case 'location': return `${tc('onboarding.location_title')}. ${tc('onboarding.location_subtitle')}`
      case 'sector':   return `${tc('onboarding.sector_title')}. ${tc('onboarding.sector_subtitle')}`
      case 'export':   return `${tc('onboarding.export_title')}. ${tc('onboarding.export_subtitle')}`
      case 'connect':  return `${tc('onboarding.connect_title')}. ${tc('onboarding.connect_subtitle')}`
      case 'done':     return isPosPersona ? `${firstName ? tc('onboarding.done_title_pos_named', { name: firstName }) : tc('onboarding.done_title')}. ${tc('onboarding.done_subtitle_pos')}` : `${tc('onboarding.done_title')}. ${tc('onboarding.done_subtitle')}`
      default:         return ''
    }
  })()

  const toggleSector = (s: string) =>
    setSectors(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  const toggleExport = (id: string) =>
    setExportMkts(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const next = () => {
    // Simple-setup persona: business type -> location -> done. No business
    // name to type, no Connect Data Sources step (M-Pesa/Shopify/QuickBooks
    // concepts don't apply to a solo food-stall/veg-seller).
    if (step === 'location' && POS_LANDING_TYPES.has(bizType)) { setStep('done'); return }
    // Skip sector for informal business types (shops, salons, couriers, food stalls, etc.)
    if (step === 'location' && !NEEDS_SECTOR.has(bizType)) { setStep('connect'); return }
    // Skip export markets for non-exporters
    if (step === 'sector' && !NEEDS_EXPORT.has(bizType)) { setStep('connect'); return }
    const idx = STEPS.indexOf(step)
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1])
  }

  const back = () => {
    if (step === 'done' && POS_LANDING_TYPES.has(bizType)) { setStep('location'); return }
    // Reverse the same skips
    if (step === 'connect' && !NEEDS_SECTOR.has(bizType)) { setStep('location'); return }
    if (step === 'connect' && NEEDS_SECTOR.has(bizType) && !NEEDS_EXPORT.has(bizType)) { setStep('sector'); return }
    const idx = STEPS.indexOf(step)
    if (idx > 0) setStep(STEPS[idx - 1])
  }

  const skip = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      await supabase.from('profiles').update({ onboarded: true }).eq('id', user.id)
      setPendingNudge(POS_LANDING_TYPES.has(bizType) ? '/pos/setup' : '/home')
    } catch (e) { console.error(e) } finally { setSaving(false) }
  }

  // A solo food-stall/veg-seller never types a business name — this fills
  // in a sensible default silently. Renameable later from settings.
  const resolvedBusinessName = () => {
    if (businessName.trim()) return businessName.trim()
    const label = BIZ_TYPES.find(b => b.id === bizType)?.label || ''
    return firstName ? `${firstName}'s ${label}` : (label || 'My Business')
  }

  // Accepts an optional destination override (used by the connect-step tiles,
  // which need to land on a specific /sources?open=... URL instead of the
  // usual post-onboarding destination). Returns whether the save succeeded —
  // callers must check this before navigating themselves; pendingNudge is the
  // only thing that navigates on success, so a save failure never leaves a
  // caller free to force-navigate anyway (that previously bounced the user to
  // a blank onboarding with everything they'd entered silently discarded).
  const finish = async (dest?: string): Promise<boolean> => {
    setSaving(true)
    setSaveError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return false

      const { error } = await supabase.from('profiles').update({
        first_name:          firstName,
        business_name:       resolvedBusinessName(),
        business_type:       bizType,
        currency:            currency,
        currency_symbol:     (CURRENCY_SYMBOLS[currency] || CURRENCY_TABLE[currency]?.sym || '£'),
        region:              region,
        country_code:        countryCode || null,
        sector_hints:        sectors.join(', '),
        export_markets:      exportMkts.join(','),
        wants_export:        wantsExport,
        onboarded:           true,
      }).eq('id', user.id)

      // Surface save failures instead of navigating anyway — a silent
      // failure here previously meant an update was dropped (e.g. a check
      // constraint violation) while the user was bounced back to
      // onboarding on their next visit with no explanation.
      if (error) { setSaveError(error.message); return false }

      // POS personas go to the pre-payment setup flow (build the stall, then
      // pay), not straight to the paywalled dashboard. Show the passkey nudge
      // once here, now that onboarding is actually done, instead of before
      // signup even started.
      setPendingNudge(dest ?? (POS_LANDING_TYPES.has(bizType) ? '/pos/setup' : '/home'))
      return true
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Something went wrong — please try again.')
      return false
    } finally {
      setSaving(false)
    }
  }

  const canNext: Record<Step, boolean> = {
    business: !!bizType,
    location: !!currency,
    sector:   sectors.length > 0,
    export:   wantsExport !== null,
    connect:  true,
    done:     true,
  }

  const btn: React.CSSProperties = {
    padding: '12px 28px', borderRadius: 10, border: 'none',
    background: ACC, color: '#fff', fontSize: 13, fontWeight: 600,
    cursor: 'pointer', fontFamily: 'inherit',
    boxShadow: '0 2px 12px rgba(208,138,89,.3)',
  }

  const ghostBtn: React.CSSProperties = {
    padding: '12px 28px', borderRadius: 10, border: `1.5px solid ${B2}`,
    background: 'transparent', color: TX2, fontSize: 13, fontWeight: 600,
    cursor: 'pointer', fontFamily: 'inherit',
  }

  const chipBase: React.CSSProperties = {
    padding: '9px 14px', borderRadius: 10, border: `1.5px solid ${B2}`,
    background: 'transparent', cursor: 'pointer', fontFamily: 'inherit',
    fontSize: 11, color: TX2, transition: 'all 150ms', textAlign: 'left',
  }

  const chipActive: React.CSSProperties = {
    ...chipBase,
    background: 'rgba(208,138,89,.1)', borderColor: ACC, color: ACC, fontWeight: 600,
  }

  return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', flexDirection: 'column', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Read-aloud — audio channel for vendors who can't read the screen */}
      {spokenText && (
        <div style={{ position: 'fixed', right: 16, bottom: 20, zIndex: 90 }}>
          <SpeakButton text={spokenText} size={52} />
        </div>
      )}
      {/* Progress bar */}
      <div style={{ height: 3, background: B, position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
        <div style={{ height: '100%', width: `${progress}%`, background: ACC, transition: 'width 400ms ease' }}/>
      </div>

      {/* Logo */}
      <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: ACC, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="12" height="12" viewBox="0 0 32 32" fill="none"><g fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 11 V5 H11"/><path d="M21 5 H27 V11"/><path d="M5 21 V27 H11"/><path d="M27 21 V27 H21"/></g><circle cx="16" cy="16" r="2.6" fill="white"/></svg>
        </div>
        <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 700, color: TX }}>AskBiz</span>
        {!POS_LANDING_TYPES.has(bizType) && (
          <span style={{ marginLeft: 'auto', fontSize: 10, color: TX3 }}>{tc('onboarding.step_counter', { current: stepIndex + 1, total: STEPS.length })}</span>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 16px 40px' }}>
        <div style={{ width: '100%', maxWidth: 560 }}>
        {pendingNudge !== null ? (
          <PasskeyNudge destination={pendingNudge} />
        ) : (<>

          {/* ── Business type (first step — one tap) ── */}
          {step === 'business' && (
            <div>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(22px,4vw,30px)', fontWeight: 700, color: TX, marginBottom: 8 }}>
                {firstName ? tc('onboarding.business_title_named', { name: firstName }) : tc('onboarding.business_title')}
              </h2>
              <p style={{ fontSize: 12, color: TX2, marginBottom: 14, lineHeight: 1.6 }}>
                {tc('onboarding.business_subtitle')}
              </p>
              {/* Helper-mode: acknowledge a helper/family member is often present
                  (the real driver of M-Pesa-style adoption for low-literacy users). */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: 'rgba(208,138,89,.08)', marginBottom: 24 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={ACC} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                <span style={{ fontSize: 10.5, color: TX2, lineHeight: 1.5 }}>{tc('onboarding.helper_hint')}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10, marginBottom: 28 }}>
                {BIZ_TYPES.map(bt => (
                  <button
                    key={bt.id}
                    onClick={() => setBizType(bt.id)}
                    style={{
                      ...(bizType === bt.id ? chipActive : chipBase),
                      display: 'flex', alignItems: 'center', gap: 14, padding: '14px',
                      minHeight: 72,
                    }}
                  >
                    {/* Larger, filled-tint icon block — more concrete/prominent
                        than a bare thin glyph (research: concrete > abstract).
                        Real photo/illustration assets + vendor validation next. */}
                    <span style={{ flexShrink: 0, width: 52, height: 52, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', background: bizType === bt.id ? ACC : EV, color: bizType === bt.id ? '#fff' : TX }}>{bizIcon(bt.id)}</span>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: bizType === bt.id ? ACC : TX }}>{bt.label}</div>
                      <div style={{ fontSize: 10, color: TX3, marginTop: 2 }}>{bt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button style={{ ...btn, opacity: canNext.business ? 1 : .5 }} onClick={next} disabled={!canNext.business}>{tc('onboarding.continue')}</button>
              </div>
              <button style={{ background: 'none', border: 'none', color: TX3, fontSize: 11, cursor: 'pointer', padding: '8px 0', fontFamily: 'inherit' }} onClick={skip}>
                {tc('onboarding.skip')}
              </button>
            </div>
          )}

          {/* ── Location / Currency (one tap when auto-detected) ── */}
          {step === 'location' && (
            <div>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(22px,4vw,30px)', fontWeight: 700, color: TX, marginBottom: 8 }}>
                {tc('onboarding.location_title')}
              </h2>
              <p style={{ fontSize: 12, color: TX2, marginBottom: 24, lineHeight: 1.6 }}>
                {tc('onboarding.location_subtitle')}
              </p>

              {geoLoading && (
                <div style={{ padding: '32px 0', textAlign: 'center', color: TX3, fontSize: 12 }}>
                  {tc('onboarding.location_detecting')}
                </div>
              )}

              {!geoLoading && geo && !manualLocation && (
                <div>
                  <div style={{ padding: '24px', borderRadius: 16, border: `1.5px solid ${B2}`, background: SF, textAlign: 'center', marginBottom: 20 }}>
                    <div style={{ fontSize: 38, marginBottom: 10 }} aria-hidden>{geo.flag}</div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: TX, marginBottom: 4 }}>{regionName(geo.countryCode, geo.country)}</div>
                    <div style={{ fontSize: 12, color: TX2 }}>{geo.currencySymbol} · {geo.currency}</div>
                    <div style={{ fontSize: 11, color: TX3, marginTop: 10 }}>{tc('onboarding.location_confirm_question')}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button style={btn} onClick={() => { setCurrency(geo.currency); setRegion(geo.region); setCountryCode(geo.countryCode); next() }}>
                      {tc('onboarding.location_confirm_yes')}
                    </button>
                    <button style={ghostBtn} onClick={() => setManualLocation(true)}>
                      {tc('onboarding.location_confirm_change')}
                    </button>
                  </div>
                </div>
              )}

              {!geoLoading && manualLocation && (
                <>
                  {geo && (
                    <button
                      onClick={() => setManualLocation(false)}
                      style={{ background: 'none', border: 'none', color: ACC, fontSize: 11, fontWeight: 600, cursor: 'pointer', padding: '0 0 14px', fontFamily: 'inherit' }}
                    >
                      ← {tc('onboarding.location_use_detected')}
                    </button>
                  )}
                  <div style={{ marginBottom: 16, position: 'relative' }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: TX2, display: 'block', marginBottom: 6 }}>{tc('onboarding.location_region_label')}</label>
                    {(() => {
                      const q = region.trim().toLowerCase()
                      const matches = q ? COUNTRIES.filter(c => c.name.toLowerCase().includes(q) || c.localName.toLowerCase().includes(q)).slice(0, 8) : []
                      const selectCountry = (c: { code: string; name: string; localName: string }) => {
                        setRegion(c.localName)
                        if (COUNTRY_CURRENCY[c.code]) setCurrency(COUNTRY_CURRENCY[c.code]!)
                        setCountryCode(c.code)
                        setShowCountrySuggestions(false)
                      }
                      return (
                        <>
                          <input
                            style={inp}
                            value={region}
                            onChange={e => { setRegion(e.target.value); setShowCountrySuggestions(true); setCountryActiveIdx(0) }}
                            onFocus={() => setShowCountrySuggestions(true)}
                            onBlur={() => setTimeout(() => setShowCountrySuggestions(false), 150)}
                            onKeyDown={e => {
                              if (!showCountrySuggestions || !matches.length) return
                              if (e.key === 'ArrowDown') { e.preventDefault(); setCountryActiveIdx(i => (i + 1) % matches.length) }
                              else if (e.key === 'ArrowUp') { e.preventDefault(); setCountryActiveIdx(i => (i - 1 + matches.length) % matches.length) }
                              else if (e.key === 'Enter') { e.preventDefault(); selectCountry(matches[countryActiveIdx]) }
                              else if (e.key === 'Escape') { setShowCountrySuggestions(false) }
                            }}
                            placeholder={tc('onboarding.location_region_placeholder')}
                            autoComplete="off"
                            role="combobox"
                            aria-expanded={showCountrySuggestions && matches.length > 0}
                            aria-autocomplete="list"
                          />
                          {showCountrySuggestions && matches.length > 0 && (
                            <div role="listbox" style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, background: SF, border: `1.5px solid ${B2}`, borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,.1)', zIndex: 10, maxHeight: 220, overflowY: 'auto' }}>
                              {matches.map((c, i) => (
                                <button
                                  key={c.code}
                                  type="button"
                                  role="option"
                                  aria-selected={i === countryActiveIdx}
                                  onMouseEnter={() => setCountryActiveIdx(i)}
                                  onMouseDown={() => selectCountry(c)}
                                  style={{ display: 'flex', width: '100%', textAlign: 'left', padding: '9px 13px', background: i === countryActiveIdx ? EV : 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, color: TX }}
                                >
                                  {c.localName}
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      )
                    })()}
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: TX2, display: 'block', marginBottom: 10 }}>{tc('onboarding.location_currency_label')}</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 8 }}>
                      {CURRENCIES.map(c => (
                        <button
                          key={c.code}
                          onClick={() => setCurrency(c.code)}
                          style={{ ...(currency === c.code ? chipActive : chipBase), alignItems: 'flex-start' }}
                        >
                          <span><span style={{ fontWeight: 600 }}>{c.symbol}</span> {c.code} — {c.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  {!POS_LANDING_TYPES.has(bizType) && (
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ fontSize: 11, fontWeight: 600, color: TX2, display: 'block', marginBottom: 6 }}>{tc('onboarding.business_name_label')}</label>
                      <input style={inp} value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder={resolvedBusinessName()}/>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button style={ghostBtn} onClick={back}>{tc('onboarding.back')}</button>
                    <button style={btn} onClick={next}>{tc('onboarding.continue')}</button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── Sector ── */}
          {step === 'sector' && (
            <div>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(22px,4vw,30px)', fontWeight: 700, color: TX, marginBottom: 8 }}>
                {tc('onboarding.sector_title')}
              </h2>
              <p style={{ fontSize: 12, color: TX2, marginBottom: 24, lineHeight: 1.6 }}>
                {tc('onboarding.sector_subtitle')}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))', gap: 8, marginBottom: 28 }}>
                {SECTORS.map(s => (
                  <button
                    key={s.id}
                    onClick={() => toggleSector(s.id)}
                    style={{
                      ...(sectors.includes(s.id) ? chipActive : chipBase),
                      display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
                      minHeight: 56,
                    }}
                  >
                    <span style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: sectors.includes(s.id) ? ACC : EV, color: sectors.includes(s.id) ? '#fff' : TX }}>{sectorIcon(s.id)}</span>
                    <span style={{ fontWeight: 700, fontSize: 12, color: sectors.includes(s.id) ? ACC : TX, textAlign: 'left' }}>{s.label}</span>
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button style={ghostBtn} onClick={back}>{tc('onboarding.back')}</button>
                <button style={{ ...btn, opacity: canNext.sector ? 1 : .5 }} onClick={next} disabled={!canNext.sector}>{tc('onboarding.continue')}</button>
              </div>
              <button style={{ background: 'none', border: 'none', color: TX3, fontSize: 11, cursor: 'pointer', padding: '8px 0', fontFamily: 'inherit' }} onClick={skip}>
                {tc('onboarding.skip')}
              </button>
            </div>
          )}

          {/* ── Export markets ── */}
          {step === 'export' && (
            <div>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(22px,4vw,30px)', fontWeight: 700, color: TX, marginBottom: 8 }}>
                {tc('onboarding.export_title')}
              </h2>
              <p style={{ fontSize: 12, color: TX2, marginBottom: 20, lineHeight: 1.6 }}>
                {tc('onboarding.export_subtitle')}
              </p>

              <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                {[
                  { val: true,  label: tc('onboarding.export_opt_yes') },
                  { val: false, label: tc('onboarding.export_opt_no') },
                ].map(opt => (
                  <button
                    key={String(opt.val)}
                    onClick={() => setWantsExport(opt.val)}
                    style={{ flex: 1, padding: '14px', borderRadius: 12, border: `1.5px solid ${wantsExport === opt.val ? ACC : B2}`, background: wantsExport === opt.val ? 'rgba(208,138,89,.08)' : 'transparent', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: wantsExport === opt.val ? 600 : 400, color: wantsExport === opt.val ? ACC : TX2 }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {wantsExport && (
                <>
                  <p style={{ fontSize: 11, color: TX3, marginBottom: 12 }}>{tc('onboarding.export_markets_prompt')}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 20 }}>
                    {EXPORT_MARKETS.map(m => (
                      <button
                        key={m.id}
                        onClick={() => toggleExport(m.id)}
                        style={exportMkts.includes(m.id) ? { ...chipActive, padding: '6px 13px' } : { ...chipBase, padding: '6px 13px' }}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <div style={{ display: 'flex', gap: 10 }}>
                <button style={ghostBtn} onClick={back}>{tc('onboarding.back')}</button>
                <button style={{ ...btn, opacity: canNext.export ? 1 : .5 }} onClick={next} disabled={!canNext.export}>{tc('onboarding.continue')}</button>
              </div>
              <button style={{ background: 'none', border: 'none', color: TX3, fontSize: 11, cursor: 'pointer', padding: '8px 0', fontFamily: 'inherit' }} onClick={skip}>
                {tc('onboarding.skip')}
              </button>
            </div>
          )}

          {/* ── Connect data ── */}
          {step === 'connect' && (
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(22px,4vw,30px)', fontWeight: 700, color: TX, marginBottom: 12 }}>
                {tc('onboarding.connect_title')}
              </h2>
              <p style={{ fontSize: 12, color: TX2, lineHeight: 1.7, marginBottom: 28, maxWidth: 420, margin: '0 auto 28px' }}>
                {tc('onboarding.connect_subtitle')}
              </p>
              {/* Real, individually-tappable connectors — each deep-links straight
                  into that source's own connect flow on /sources instead of the
                  generic list. The bottom buttons stay as a fallback/escape hatch.
                  Navigation only happens once finish() actually succeeds — a save
                  failure keeps the user on this screen with the error visible
                  instead of silently bouncing them away with nothing saved. */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 28 }}>
                {CONNECT_SOURCES.map(s => (
                  <button
                    key={s.id}
                    onClick={() => finish('/sources?open=' + s.sourceId)}
                    disabled={saving}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '16px 8px', borderRadius: 12, border: `1.5px solid ${B2}`, background: SF, cursor: saving ? 'wait' : 'pointer', opacity: saving ? .7 : 1, fontFamily: 'inherit', transition: 'all 150ms' }}
                  >
                    <span style={{ width: 40, height: 40, borderRadius: 11, background: EV, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }} aria-hidden>{s.icon}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: TX }}>{tc('onboarding.' + s.labelKey)}</span>
                  </button>
                ))}
              </div>
              {saveError && (
                <div role="alert" style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(220,38,38,.08)', border: '1px solid rgba(220,38,38,.25)', color: '#b91c1c', fontSize: 11, marginBottom: 16, maxWidth: 400, margin: '0 auto 16px' }}>
                  {saveError}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button style={{ ...btn, opacity: saving ? .7 : 1 }} onClick={() => finish('/sources')} disabled={saving}>
                  {saving ? tc('onboarding.done_saving') : tc('onboarding.connect_cta')}
                </button>
                <button style={{ ...btn, background: 'transparent', color: TX3, boxShadow: 'none', border: `1px solid ${B}` }} onClick={next}>
                  {tc('onboarding.connect_skip')}
                </button>
              </div>
            </div>
          )}

          {/* ── Done ── */}
          {step === 'done' && (
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(24px,4vw,34px)', fontWeight: 700, color: TX, marginBottom: 12, letterSpacing: '-.03em' }}>
                {isPosPersona
                  ? (firstName ? tc('onboarding.done_title_pos_named', { name: firstName }) : tc('onboarding.done_title'))
                  : (firstName ? tc('onboarding.done_title_named', { name: firstName }) : tc('onboarding.done_title'))}
              </h2>
              <p style={{ fontSize: 12, color: TX2, lineHeight: 1.7, marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
                {isPosPersona ? tc('onboarding.done_subtitle_pos') : tc('onboarding.done_subtitle')}
              </p>
              {isPosPersona && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', maxWidth: 340, margin: '0 auto 20px', padding: '14px 16px', borderRadius: 14, background: 'rgba(208,138,89,.08)', border: '1px solid rgba(208,138,89,.25)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(208,138,89,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={ACC} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: TX, marginBottom: 2 }}>{tc('onboarding.done_pos_trial_title')}</div>
                    <div style={{ fontSize: 12, color: TX2, lineHeight: 1.5 }}>{tc('onboarding.done_pos_trial_body')}</div>
                  </div>
                </div>
              )}
              {saveError && (
                <div role="alert" style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(220,38,38,.08)', border: '1px solid rgba(220,38,38,.25)', color: '#b91c1c', fontSize: 11, marginBottom: 16, maxWidth: 400, margin: '0 auto 16px' }}>
                  {saveError}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 320, margin: '0 auto' }}>
                <button style={btn} onClick={() => finish()} disabled={saving}>
                  {saving ? tc('onboarding.done_saving') : (isPosPersona ? tc('onboarding.done_cta_pos') : tc('onboarding.done_cta'))}
                </button>
              </div>
            </div>
          )}

        </>)}
        </div>
      </div>
    </div>
  )
}
