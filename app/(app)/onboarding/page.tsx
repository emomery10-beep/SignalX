'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLang } from '@/components/LanguageProvider'

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
const STEPS = ['welcome', 'business', 'location', 'sector', 'export', 'connect', 'done'] as const
type Step = typeof STEPS[number]

const buildBizTypes = (tc: TC) => [
  { id: 'ecommerce',    label: tc('onboarding.biz_ecommerce_label'),    icon: '🛒', desc: tc('onboarding.biz_ecommerce_desc') },
  { id: 'retail',       label: tc('onboarding.biz_retail_label'),       icon: '🏪', desc: tc('onboarding.biz_retail_desc') },
  { id: 'distributor',  label: tc('onboarding.biz_distributor_label'),  icon: '🚚', desc: tc('onboarding.biz_distributor_desc') },
  { id: 'manufacturer', label: tc('onboarding.biz_manufacturer_label'), icon: '🏭', desc: tc('onboarding.biz_manufacturer_desc') },
  { id: 'importer',     label: tc('onboarding.biz_importer_label'),     icon: '📦', desc: tc('onboarding.biz_importer_desc') },
  { id: 'exporter',     label: tc('onboarding.biz_exporter_label'),     icon: '🌍', desc: tc('onboarding.biz_exporter_desc') },
  { id: 'services',     label: tc('onboarding.biz_services_label'),     icon: '💼', desc: tc('onboarding.biz_services_desc') },
  { id: 'food_bev',     label: tc('onboarding.biz_food_bev_label'),     icon: '🍽️', desc: tc('onboarding.biz_food_bev_desc') },
]

const SECTOR_IDS = [
  'Fashion & Apparel', 'Beauty & Personal Care', 'Health & Wellness',
  'Food & Beverage', 'Home & Garden', 'Electronics & Tech',
  'Sports & Outdoor', 'Luxury & Premium', 'Kids & Toys',
  'Pet Products', 'Arts & Crafts', 'Automotive', 'B2B / Industrial', 'Other',
]

const buildSectors = (tc: TC) =>
  SECTOR_IDS.map((id, i) => ({ id, label: tc('onboarding.sector_' + i) }))

const buildCurrencies = (tc: TC) => [
  { code: 'GBP', symbol: '£', label: tc('onboarding.currency_gbp_label') },
  { code: 'USD', symbol: '$', label: tc('onboarding.currency_usd_label') },
  { code: 'EUR', symbol: '€', label: tc('onboarding.currency_eur_label') },
  { code: 'KES', symbol: 'KSh', label: tc('onboarding.currency_kes_label') },
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
  GBP: '£', USD: '$', EUR: '€', KES: 'KSh', NGN: '₦', GHS: '₵',
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

const inp: React.CSSProperties = {
  width: '100%', padding: '10px 13px', fontSize: 14,
  background: EV, border: `1.5px solid ${B2}`, borderRadius: 10,
  color: TX, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
}

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const { tc } = useLang()

  const BIZ_TYPES = buildBizTypes(tc)
  const SECTORS = buildSectors(tc)
  const CURRENCIES = buildCurrencies(tc)
  const EXPORT_MARKETS = buildExportMarkets(tc)

  const [step,         setStep]         = useState<Step>('welcome')
  const [saving,       setSaving]       = useState(false)
  const [firstName,    setFirstName]    = useState('')
  const [businessName, setBusinessName] = useState('')
  const [bizType,      setBizType]      = useState('')
  const [currency,     setCurrency]     = useState('GBP')
  const [region,       setRegion]       = useState('')
  const [sectors,      setSectors]      = useState<string[]>([])
  const [exportMkts,   setExportMkts]   = useState<string[]>([])
  const [wantsExport,  setWantsExport]  = useState<boolean | null>(null)

  const stepIndex = STEPS.indexOf(step)
  const progress  = (stepIndex / (STEPS.length - 1)) * 100

  const toggleSector = (s: string) =>
    setSectors(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  const toggleExport = (id: string) =>
    setExportMkts(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const next = () => {
    const idx = STEPS.indexOf(step)
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1])
  }

  const back = () => {
    const idx = STEPS.indexOf(step)
    if (idx > 0) setStep(STEPS[idx - 1])
  }

  const skip = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      await supabase.from('profiles').update({ onboarding_complete: true, onboarded: true }).eq('id', user.id)
      router.push('/home')
    } catch (e) { console.error(e) } finally { setSaving(false) }
  }

  const finish = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      await supabase.from('profiles').update({
        first_name:          firstName,
        business_name:       businessName,
        business_type:       bizType,
        currency:            currency,
        currency_symbol:     CURRENCY_SYMBOLS[currency] || '£',
        region:              region,
        sector_hints:        sectors.join(', '),
        export_markets:      exportMkts.join(','),
        wants_export:        wantsExport,
        onboarding_complete: true,
        onboarded:           true,
      }).eq('id', user.id)

      router.push('/home')
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const canNext: Record<Step, boolean> = {
    welcome:  true,
    business: !!bizType,
    location: !!currency,
    sector:   sectors.length > 0,
    export:   wantsExport !== null,
    connect:  true,
    done:     true,
  }

  const btn: React.CSSProperties = {
    padding: '12px 28px', borderRadius: 10, border: 'none',
    background: ACC, color: '#fff', fontSize: 15, fontWeight: 600,
    cursor: 'pointer', fontFamily: 'inherit',
    boxShadow: '0 2px 12px rgba(208,138,89,.3)',
  }

  const chipBase: React.CSSProperties = {
    padding: '9px 14px', borderRadius: 10, border: `1.5px solid ${B2}`,
    background: 'transparent', cursor: 'pointer', fontFamily: 'inherit',
    fontSize: 13, color: TX2, transition: 'all 150ms', textAlign: 'left',
  }

  const chipActive: React.CSSProperties = {
    ...chipBase,
    background: 'rgba(208,138,89,.1)', borderColor: ACC, color: ACC, fontWeight: 600,
  }

  return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', flexDirection: 'column', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Progress bar */}
      <div style={{ height: 3, background: B, position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
        <div style={{ height: '100%', width: `${progress}%`, background: ACC, transition: 'width 400ms ease' }}/>
      </div>

      {/* Logo */}
      <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: ACC, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="12" height="12" viewBox="0 0 32 32" fill="none">
            <rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.5"/>
            <rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.75"/>
            <rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/>
          </svg>
        </div>
        <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 700, color: TX }}>AskBiz</span>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: TX3 }}>{tc('onboarding.step_counter', { current: stepIndex + 1, total: STEPS.length })}</span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 16px 40px' }}>
        <div style={{ width: '100%', maxWidth: 560 }}>

          {/* ── Welcome ── */}
          {step === 'welcome' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>👋</div>
              <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(26px,5vw,36px)', fontWeight: 700, color: TX, letterSpacing: '-.03em', marginBottom: 12 }}>
                {tc('onboarding.welcome_title')}
              </h1>
              <p style={{ fontSize: 16, color: TX2, lineHeight: 1.7, marginBottom: 28, maxWidth: 420, margin: '0 auto 28px' }}>
                {tc('onboarding.welcome_subtitle')}
              </p>
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: TX2, display: 'block', marginBottom: 6, textAlign: 'left' }}>
                  {tc('onboarding.welcome_first_name_label')}
                </label>
                <input
                  style={inp}
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder={tc('onboarding.welcome_first_name_placeholder')}
                  autoFocus
                />
              </div>
              <div style={{ marginBottom: 28 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: TX2, display: 'block', marginBottom: 6, textAlign: 'left' }}>
                  {tc('onboarding.welcome_business_name_label')}
                </label>
                <input
                  style={inp}
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  placeholder={tc('onboarding.welcome_business_name_placeholder')}
                />
              </div>
              <button style={btn} onClick={next} disabled={!firstName}>
                {tc('onboarding.welcome_cta')}
              </button>
            </div>
          )}

          {/* ── Business type ── */}
          {step === 'business' && (
            <div>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(22px,4vw,30px)', fontWeight: 700, color: TX, marginBottom: 8 }}>
                {firstName ? tc('onboarding.business_title_named', { name: firstName }) : tc('onboarding.business_title')}
              </h2>
              <p style={{ fontSize: 14, color: TX2, marginBottom: 24, lineHeight: 1.6 }}>
                {tc('onboarding.business_subtitle')}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10, marginBottom: 28 }}>
                {BIZ_TYPES.map(bt => (
                  <button
                    key={bt.id}
                    onClick={() => setBizType(bt.id)}
                    style={{
                      ...(bizType === bt.id ? chipActive : chipBase),
                      display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px',
                    }}
                  >
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{bt.icon}</span>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: bizType === bt.id ? ACC : TX }}>{bt.label}</div>
                      <div style={{ fontSize: 12, color: TX3, marginTop: 2 }}>{bt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button style={{ ...btn, background: EV, color: TX2, boxShadow: 'none' }} onClick={back}>{tc('onboarding.back')}</button>
                <button style={{ ...btn, opacity: canNext.business ? 1 : .5 }} onClick={next} disabled={!canNext.business}>{tc('onboarding.continue')}</button>
              </div>
              <button style={{ background: 'none', border: 'none', color: TX3, fontSize: 13, cursor: 'pointer', padding: '8px 0', fontFamily: 'inherit' }} onClick={skip}>
                {tc('onboarding.skip')}
              </button>
            </div>
          )}

          {/* ── Location / Currency ── */}
          {step === 'location' && (
            <div>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(22px,4vw,30px)', fontWeight: 700, color: TX, marginBottom: 8 }}>
                {tc('onboarding.location_title')}
              </h2>
              <p style={{ fontSize: 14, color: TX2, marginBottom: 24, lineHeight: 1.6 }}>
                {tc('onboarding.location_subtitle')}
              </p>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: TX2, display: 'block', marginBottom: 6 }}>{tc('onboarding.location_region_label')}</label>
                <input style={inp} value={region} onChange={e => setRegion(e.target.value)} placeholder={tc('onboarding.location_region_placeholder')}/>
              </div>
              <div style={{ marginBottom: 28 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: TX2, display: 'block', marginBottom: 10 }}>{tc('onboarding.location_currency_label')}</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 8 }}>
                  {CURRENCIES.map(c => (
                    <button
                      key={c.code}
                      onClick={() => setCurrency(c.code)}
                      style={currency === c.code ? chipActive : chipBase}
                    >
                      <span style={{ fontWeight: 600 }}>{c.symbol}</span> {c.code} — {c.label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button style={{ ...btn, background: EV, color: TX2, boxShadow: 'none' }} onClick={back}>{tc('onboarding.back')}</button>
                <button style={btn} onClick={next}>{tc('onboarding.continue')}</button>
              </div>
            </div>
          )}

          {/* ── Sector ── */}
          {step === 'sector' && (
            <div>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(22px,4vw,30px)', fontWeight: 700, color: TX, marginBottom: 8 }}>
                {tc('onboarding.sector_title')}
              </h2>
              <p style={{ fontSize: 14, color: TX2, marginBottom: 24, lineHeight: 1.6 }}>
                {tc('onboarding.sector_subtitle')}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
                {SECTORS.map(s => (
                  <button
                    key={s.id}
                    onClick={() => toggleSector(s.id)}
                    style={sectors.includes(s.id) ? { ...chipActive, padding: '7px 14px' } : { ...chipBase, padding: '7px 14px' }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button style={{ ...btn, background: EV, color: TX2, boxShadow: 'none' }} onClick={back}>{tc('onboarding.back')}</button>
                <button style={{ ...btn, opacity: canNext.sector ? 1 : .5 }} onClick={next} disabled={!canNext.sector}>{tc('onboarding.continue')}</button>
              </div>
              <button style={{ background: 'none', border: 'none', color: TX3, fontSize: 13, cursor: 'pointer', padding: '8px 0', fontFamily: 'inherit' }} onClick={skip}>
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
              <p style={{ fontSize: 14, color: TX2, marginBottom: 20, lineHeight: 1.6 }}>
                {tc('onboarding.export_subtitle')}
              </p>

              <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                {[
                  { val: true,  label: tc('onboarding.export_opt_yes'), icon: '🌍' },
                  { val: false, label: tc('onboarding.export_opt_no'), icon: '🏠' },
                ].map(opt => (
                  <button
                    key={String(opt.val)}
                    onClick={() => setWantsExport(opt.val)}
                    style={{ flex: 1, padding: '14px', borderRadius: 12, border: `1.5px solid ${wantsExport === opt.val ? ACC : B2}`, background: wantsExport === opt.val ? 'rgba(208,138,89,.08)' : 'transparent', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: wantsExport === opt.val ? 600 : 400, color: wantsExport === opt.val ? ACC : TX2 }}
                  >
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{opt.icon}</div>
                    {opt.label}
                  </button>
                ))}
              </div>

              {wantsExport && (
                <>
                  <p style={{ fontSize: 13, color: TX3, marginBottom: 12 }}>{tc('onboarding.export_markets_prompt')}</p>
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
                <button style={{ ...btn, background: EV, color: TX2, boxShadow: 'none' }} onClick={back}>{tc('onboarding.back')}</button>
                <button style={{ ...btn, opacity: canNext.export ? 1 : .5 }} onClick={next} disabled={!canNext.export}>{tc('onboarding.continue')}</button>
              </div>
              <button style={{ background: 'none', border: 'none', color: TX3, fontSize: 13, cursor: 'pointer', padding: '8px 0', fontFamily: 'inherit' }} onClick={skip}>
                {tc('onboarding.skip')}
              </button>
            </div>
          )}

          {/* ── Connect data ── */}
          {step === 'connect' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 44, marginBottom: 16 }}>🔌</div>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(22px,4vw,30px)', fontWeight: 700, color: TX, marginBottom: 12 }}>
                {tc('onboarding.connect_title')}
              </h2>
              <p style={{ fontSize: 14, color: TX2, lineHeight: 1.7, marginBottom: 28, maxWidth: 420, margin: '0 auto 28px' }}>
                {tc('onboarding.connect_subtitle')}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 28 }}>
                {[
                  { icon: '🛍️', label: tc('onboarding.connect_source_shopify') },
                  { icon: '📦', label: tc('onboarding.connect_source_amazon') },
                  { icon: '📒', label: tc('onboarding.connect_source_quickbooks') },
                  { icon: '💳', label: tc('onboarding.connect_source_stripe') },
                  { icon: '📊', label: tc('onboarding.connect_source_sheets') },
                  { icon: '🎵', label: tc('onboarding.connect_source_tiktok') },
                ].map(s => (
                  <div key={s.label} style={{ padding: '14px 10px', borderRadius: 12, border: `1px solid ${B}`, background: SF, textAlign: 'center' }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
                    <div style={{ fontSize: 12, color: TX2, fontWeight: 500 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button style={btn} onClick={() => { finish(); setTimeout(() => router.push('/sources'), 500) }}>
                  {tc('onboarding.connect_cta')}
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
              <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(24px,4vw,34px)', fontWeight: 700, color: TX, marginBottom: 12, letterSpacing: '-.03em' }}>
                {firstName ? tc('onboarding.done_title_named', { name: firstName }) : tc('onboarding.done_title')}
              </h2>
              <p style={{ fontSize: 14, color: TX2, lineHeight: 1.7, marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
                {tc('onboarding.done_subtitle')}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 320, margin: '0 auto' }}>
                <button style={btn} onClick={finish} disabled={saving}>
                  {saving ? tc('onboarding.done_saving') : tc('onboarding.done_cta')}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
