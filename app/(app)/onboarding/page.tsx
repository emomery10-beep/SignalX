'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

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

const BIZ_TYPES = [
  { id: 'ecommerce',    label: 'Ecommerce',       icon: '🛒', desc: 'Sell online via Shopify, Amazon, etc.' },
  { id: 'retail',       label: 'Retail',           icon: '🏪', desc: 'Physical shop or market stall' },
  { id: 'distributor',  label: 'Distributor',      icon: '🚚', desc: 'Wholesale and distribution' },
  { id: 'manufacturer', label: 'Manufacturer',     icon: '🏭', desc: 'Make and sell products' },
  { id: 'importer',     label: 'Importer',         icon: '📦', desc: 'Import and resell goods' },
  { id: 'exporter',     label: 'Exporter',         icon: '🌍', desc: 'Export UK goods internationally' },
  { id: 'services',     label: 'Services',         icon: '💼', desc: 'Professional or digital services' },
  { id: 'food_bev',     label: 'Food & Beverage',  icon: '🍽️', desc: 'Food production, restaurant, café' },
]

const SECTORS = [
  'Fashion & Apparel', 'Beauty & Personal Care', 'Health & Wellness',
  'Food & Beverage', 'Home & Garden', 'Electronics & Tech',
  'Sports & Outdoor', 'Luxury & Premium', 'Kids & Toys',
  'Pet Products', 'Arts & Crafts', 'Automotive', 'B2B / Industrial', 'Other',
]

const CURRENCIES = [
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'KES', symbol: 'KSh', label: 'Kenyan Shilling' },
  { code: 'NGN', symbol: '₦', label: 'Nigerian Naira' },
  { code: 'GHS', symbol: '₵', label: 'Ghanaian Cedi' },
  { code: 'ZAR', symbol: 'R', label: 'South African Rand' },
  { code: 'AED', symbol: 'د.إ', label: 'UAE Dirham' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar' },
  { code: 'SGD', symbol: 'S$', label: 'Singapore Dollar' },
]

const EXPORT_MARKETS = [
  { id: 'us', label: '🇺🇸 United States' },
  { id: 'de', label: '🇩🇪 Germany' },
  { id: 'fr', label: '🇫🇷 France' },
  { id: 'au', label: '🇦🇺 Australia' },
  { id: 'ca', label: '🇨🇦 Canada' },
  { id: 'ae', label: '🇦🇪 UAE' },
  { id: 'ng', label: '🇳🇬 Nigeria' },
  { id: 'ke', label: '🇰🇪 Kenya' },
  { id: 'za', label: '🇿🇦 South Africa' },
  { id: 'in', label: '🇮🇳 India' },
  { id: 'sg', label: '🇸🇬 Singapore' },
  { id: 'jp', label: '🇯🇵 Japan' },
]

const inp: React.CSSProperties = {
  width: '100%', padding: '10px 13px', fontSize: 14,
  background: EV, border: `1.5px solid ${B2}`, borderRadius: 10,
  color: TX, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
}

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()

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

      const currencyObj = CURRENCIES.find(c => c.code === currency)

      await supabase.from('profiles').update({
        first_name:          firstName,
        business_name:       businessName,
        business_type:       bizType,
        currency:            currency,
        currency_symbol:     currencyObj?.symbol || '£',
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
        <span style={{ marginLeft: 'auto', fontSize: 12, color: TX3 }}>Step {stepIndex + 1} of {STEPS.length}</span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 16px 40px' }}>
        <div style={{ width: '100%', maxWidth: 560 }}>

          {/* ── Welcome ── */}
          {step === 'welcome' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>👋</div>
              <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(26px,5vw,36px)', fontWeight: 700, color: TX, letterSpacing: '-.03em', marginBottom: 12 }}>
                Welcome to AskBiz
              </h1>
              <p style={{ fontSize: 16, color: TX2, lineHeight: 1.7, marginBottom: 28, maxWidth: 420, margin: '0 auto 28px' }}>
                Let's set up your business profile so AskBiz gives you answers based on your actual data — not generic advice.
              </p>
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: TX2, display: 'block', marginBottom: 6, textAlign: 'left' }}>
                  Your first name
                </label>
                <input
                  style={inp}
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="e.g. Sarah"
                  autoFocus
                />
              </div>
              <div style={{ marginBottom: 28 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: TX2, display: 'block', marginBottom: 6, textAlign: 'left' }}>
                  Business name
                </label>
                <input
                  style={inp}
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  placeholder="e.g. Bloom & Co"
                />
              </div>
              <button style={btn} onClick={next} disabled={!firstName}>
                Let's go →
              </button>
            </div>
          )}

          {/* ── Business type ── */}
          {step === 'business' && (
            <div>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(22px,4vw,30px)', fontWeight: 700, color: TX, marginBottom: 8 }}>
                What kind of business{firstName ? `, ${firstName}` : ''}?
              </h2>
              <p style={{ fontSize: 14, color: TX2, marginBottom: 24, lineHeight: 1.6 }}>
                This helps AskBiz use the right language and focus on what matters for your business model.
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
                <button style={{ ...btn, background: EV, color: TX2, boxShadow: 'none' }} onClick={back}>← Back</button>
                <button style={{ ...btn, opacity: canNext.business ? 1 : .5 }} onClick={next} disabled={!canNext.business}>Continue →</button>
              </div>
              <button style={{ background: 'none', border: 'none', color: TX3, fontSize: 13, cursor: 'pointer', padding: '8px 0', fontFamily: 'inherit' }} onClick={skip}>
                Skip setup — go straight to AskBiz
              </button>
            </div>
          )}

          {/* ── Location / Currency ── */}
          {step === 'location' && (
            <div>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(22px,4vw,30px)', fontWeight: 700, color: TX, marginBottom: 8 }}>
                Where are you based?
              </h2>
              <p style={{ fontSize: 14, color: TX2, marginBottom: 24, lineHeight: 1.6 }}>
                AskBiz uses your location to set your currency, calculate duty rates, and personalise export market recommendations.
              </p>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: TX2, display: 'block', marginBottom: 6 }}>Country / Region</label>
                <input style={inp} value={region} onChange={e => setRegion(e.target.value)} placeholder="e.g. United Kingdom, Kenya, Nigeria…"/>
              </div>
              <div style={{ marginBottom: 28 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: TX2, display: 'block', marginBottom: 10 }}>Your primary currency</label>
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
                <button style={{ ...btn, background: EV, color: TX2, boxShadow: 'none' }} onClick={back}>← Back</button>
                <button style={btn} onClick={next}>Continue →</button>
              </div>
            </div>
          )}

          {/* ── Sector ── */}
          {step === 'sector' && (
            <div>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(22px,4vw,30px)', fontWeight: 700, color: TX, marginBottom: 8 }}>
                What do you sell?
              </h2>
              <p style={{ fontSize: 14, color: TX2, marginBottom: 24, lineHeight: 1.6 }}>
                Select all that apply. AskBiz uses this to match export market opportunities, duty rates, and competitor intelligence to your specific products.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
                {SECTORS.map(s => (
                  <button
                    key={s}
                    onClick={() => toggleSector(s)}
                    style={sectors.includes(s) ? { ...chipActive, padding: '7px 14px' } : { ...chipBase, padding: '7px 14px' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button style={{ ...btn, background: EV, color: TX2, boxShadow: 'none' }} onClick={back}>← Back</button>
                <button style={{ ...btn, opacity: canNext.sector ? 1 : .5 }} onClick={next} disabled={!canNext.sector}>Continue →</button>
              </div>
              <button style={{ background: 'none', border: 'none', color: TX3, fontSize: 13, cursor: 'pointer', padding: '8px 0', fontFamily: 'inherit' }} onClick={skip}>
                Skip setup — go straight to AskBiz
              </button>
            </div>
          )}

          {/* ── Export markets ── */}
          {step === 'export' && (
            <div>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(22px,4vw,30px)', fontWeight: 700, color: TX, marginBottom: 8 }}>
                Are you selling internationally?
              </h2>
              <p style={{ fontSize: 14, color: TX2, marginBottom: 20, lineHeight: 1.6 }}>
                AskBiz will prioritise export market scoring, duty intelligence, and FX risk alerts for the markets you care about.
              </p>

              <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                {[
                  { val: true,  label: 'Yes — I export or want to', icon: '🌍' },
                  { val: false, label: 'No — UK / home market only', icon: '🏠' },
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
                  <p style={{ fontSize: 13, color: TX3, marginBottom: 12 }}>Which markets are you targeting? (Select all that apply)</p>
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
                <button style={{ ...btn, background: EV, color: TX2, boxShadow: 'none' }} onClick={back}>← Back</button>
                <button style={{ ...btn, opacity: canNext.export ? 1 : .5 }} onClick={next} disabled={!canNext.export}>Continue →</button>
              </div>
              <button style={{ background: 'none', border: 'none', color: TX3, fontSize: 13, cursor: 'pointer', padding: '8px 0', fontFamily: 'inherit' }} onClick={skip}>
                Skip setup — go straight to AskBiz
              </button>
            </div>
          )}

          {/* ── Connect data ── */}
          {step === 'connect' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 44, marginBottom: 16 }}>🔌</div>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(22px,4vw,30px)', fontWeight: 700, color: TX, marginBottom: 12 }}>
                Connect your data
              </h2>
              <p style={{ fontSize: 14, color: TX2, lineHeight: 1.7, marginBottom: 28, maxWidth: 420, margin: '0 auto 28px' }}>
                AskBiz gets smarter when connected to your real data. You can connect Shopify, Amazon, QuickBooks and more — or skip and upload a CSV file later.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 28 }}>
                {[
                  { icon: '🛍️', label: 'Shopify' },
                  { icon: '📦', label: 'Amazon FBA' },
                  { icon: '📒', label: 'QuickBooks' },
                  { icon: '💳', label: 'Stripe' },
                  { icon: '📊', label: 'Google Sheets' },
                  { icon: '🎵', label: 'TikTok Shop' },
                ].map(s => (
                  <div key={s.label} style={{ padding: '14px 10px', borderRadius: 12, border: `1px solid ${B}`, background: SF, textAlign: 'center' }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
                    <div style={{ fontSize: 12, color: TX2, fontWeight: 500 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button style={btn} onClick={() => { finish(); setTimeout(() => router.push('/sources'), 500) }}>
                  Connect my data →
                </button>
                <button style={{ ...btn, background: 'transparent', color: TX3, boxShadow: 'none', border: `1px solid ${B}` }} onClick={next}>
                  Skip — I'll upload a CSV
                </button>
              </div>
            </div>
          )}

          {/* ── Done ── */}
          {step === 'done' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(24px,4vw,34px)', fontWeight: 700, color: TX, marginBottom: 12, letterSpacing: '-.03em' }}>
                {firstName ? `You're all set, ${firstName}!` : "You're all set!"}
              </h2>
              <p style={{ fontSize: 14, color: TX2, lineHeight: 1.7, marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
                AskBiz is ready. Ask it anything about your business — upload a file, connect a source, or just start typing.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 320, margin: '0 auto' }}>
                <button style={btn} onClick={finish} disabled={saving}>
                  {saving ? 'Setting up…' : 'Go to AskBiz →'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
