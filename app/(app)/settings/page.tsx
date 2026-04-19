'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface ConsentState {
  data_consent: boolean
  training_consent: boolean
  data_consent_at: string | null
  training_consent_at: string | null
}

function Toggle({ value, onChange, color = '#d08a59' }: { value: boolean; onChange: ()=>void; color?: string }) {
  return (
    <div onClick={onChange} style={{ width:44, height:26, borderRadius:13, background: value ? color : 'var(--b2)', cursor:'pointer', position:'relative', transition:'background 200ms', flexShrink:0 }}>
      <div style={{ width:22, height:22, borderRadius:'50%', background:'#fff', position:'absolute', top:2, left: value ? 20 : 2, transition:'left 200ms', boxShadow:'0 1px 4px rgba(0,0,0,.2)' }}/>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom:28 }}>
      <div style={{ fontSize:11, fontWeight:700, color:'var(--tx3)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:14, paddingBottom:8, borderBottom:'1px solid var(--b)' }}>{title}</div>
      {children}
    </div>
  )
}

function Row({ label, description, right }: { label: string; description?: string; right: React.ReactNode }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, marginBottom:16 }}>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:14, fontWeight:500, color:'var(--tx)', marginBottom: description ? 2 : 0 }}>{label}</div>
        {description && <div style={{ fontSize:12, color:'var(--tx3)', lineHeight:1.5 }}>{description}</div>}
      </div>
      {right}
    </div>
  )
}

export default function SettingsPage() {
  const router = useRouter()
  const [consent, setConsent] = useState<ConsentState>({ data_consent: true, training_consent: true, data_consent_at: null, training_consent_at: null })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [lang, setLang] = useState('en')
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeKpis, setIncludeKpis] = useState(true)
  const [includeFollowUps, setIncludeFollowUps] = useState(true)

  useEffect(() => {
    fetch('/api/consent').then(r => r.json()).then(d => {
      if (d.consent) setConsent({ ...d.consent, data_consent: d.consent.data_consent ?? true, training_consent: d.consent.training_consent ?? true })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const saveConsent = async (dc: boolean, tc: boolean) => {
    setSaving(true)
    await fetch('/api/consent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data_consent: dc, training_consent: tc }),
    })
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const toggleConsent = (type: 'data' | 'training') => {
    if (type === 'data') {
      const n = !consent.data_consent
      setConsent(c => ({ ...c, data_consent: n }))
      saveConsent(n, consent.training_consent)
    } else {
      const n = !consent.training_consent
      setConsent(c => ({ ...c, training_consent: n }))
      saveConsent(consent.data_consent, n)
    }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      {/* Header */}
      <div className="page-shell-header">
        <button onClick={() => router.back()} style={{ width:30, height:30, borderRadius:7, border:'1px solid var(--b)', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--tx2)" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div>
          <div style={{ fontFamily:'var(--font-sora)', fontSize:18, fontWeight:700 }}>Settings</div>
          <div style={{ fontSize:13, color:'var(--tx2)', marginTop:2 }}>Manage your preferences and privacy</div>
        </div>
        {saved && <div style={{ marginLeft:'auto', fontSize:13, color:'#22c55e', fontWeight:500, display:'flex', alignItems:'center', gap:6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
          Saved
        </div>}
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'24px 28px', maxWidth:640 }}>

        {/* Preferences */}
        <Section title="Preferences">
          <Row label="Language" description="Language for the AskBiz interface"
            right={
              <select value={lang} onChange={e=>setLang(e.target.value)} style={{ fontSize:13, color:'var(--tx)', background:'var(--ev)', border:'1px solid var(--b)', borderRadius:8, padding:'6px 10px', outline:'none', fontFamily:'inherit', cursor:'pointer' }}>
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
                <option value="ar">العربية</option>
                <option value="sw">Kiswahili</option>
                <option value="yo">Yorùbá</option>
                <option value="ha">Hausa</option>
                <option value="zh">中文</option>
                <option value="hi">हिन्दी</option>
                <option value="pt">Português</option>
              </select>
            }/>
        </Section>

        {/* AI Settings */}
        <Section title="AI Response Settings">
          <Row label="Include charts" description="Show charts when numeric data is available in your answers"
            right={<Toggle value={includeCharts} onChange={()=>setIncludeCharts(v=>!v)}/>}/>
          <Row label="Show KPI cards" description="Display key metrics as cards at the top of each answer"
            right={<Toggle value={includeKpis} onChange={()=>setIncludeKpis(v=>!v)}/>}/>
          <Row label="Follow-up suggestions" description="Show suggested follow-up questions after each answer"
            right={<Toggle value={includeFollowUps} onChange={()=>setIncludeFollowUps(v=>!v)}/>}/>
        </Section>

        {/* Privacy & Data */}
        <Section title="Privacy & Data">
          {loading ? (
            <div style={{ height:100, borderRadius:12, background:'var(--ev)' }}/>
          ) : (
            <>
              <Row
                label="Financial data personalisation"
                description="Store aggregated financial metrics from your uploads to personalise AI answers. No customer data or individual transactions stored."
                right={<Toggle value={consent.data_consent} onChange={()=>toggleConsent('data')} color="#d08a59"/>}
              />
              {consent.data_consent_at && (
                <div style={{ fontSize:11, color:'var(--tx3)', marginTop:-10, marginBottom:16 }}>
                  Consented {new Date(consent.data_consent_at).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })}
                </div>
              )}

              <Row
                label="Help improve AskBiz AI"
                description="Use fully anonymised data from your uploads to improve AI accuracy. Your business is never identifiable. Only used in groups of 5+ businesses."
                right={<Toggle value={consent.training_consent} onChange={()=>toggleConsent('training')} color="#8c6fe0"/>}
              />
              {consent.training_consent_at && (
                <div style={{ fontSize:11, color:'var(--tx3)', marginTop:-10, marginBottom:16 }}>
                  Consented {new Date(consent.training_consent_at).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })}
                </div>
              )}

              <div style={{ padding:'12px 14px', borderRadius:10, background:'var(--ev)', border:'1px solid var(--b)', fontSize:12, color:'var(--tx3)', lineHeight:1.65 }}>
                Both settings are optional. You can change them at any time. Read our full{' '}
                <a href="/privacy" style={{ color:'var(--acc)', textDecoration:'none' }}>Privacy Policy</a>{' '}
                for details on what is and isn't stored.
              </div>
            </>
          )}
        </Section>

        {/* Account */}
        <Section title="Account">
          <Row label="Authentication" description="Google and email sign-in enabled"
            right={
              <div style={{ display:'flex', gap:6 }}>
                <span style={{ fontSize:12, padding:'4px 10px', borderRadius:9999, background:'var(--ev)', border:'1px solid var(--b)', color:'var(--tx2)' }}>Google</span>
                <span style={{ fontSize:12, padding:'4px 10px', borderRadius:9999, background:'var(--ev)', border:'1px solid var(--b)', color:'var(--tx2)' }}>Email</span>
              </div>
            }/>

          <div style={{ display:'flex', gap:10, marginTop:8 }}>
            <a href="/billing" style={{ flex:1, padding:'10px', borderRadius:10, background:'#000', color:'#fff', textDecoration:'none', fontSize:13, fontWeight:600, fontFamily:'var(--font-sora)', textAlign:'center' as const }}>
              Manage billing →
            </a>
            <a href="/privacy" style={{ flex:1, padding:'10px', borderRadius:10, border:'1px solid var(--b)', color:'var(--tx2)', textDecoration:'none', fontSize:13, fontFamily:'inherit', textAlign:'center' as const }}>
              Delete account
            </a>
          </div>
        </Section>

      </div>
    </div>
  )
}
