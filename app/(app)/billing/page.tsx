'use client'
import { useState, useEffect } from 'react'

interface Plan {
  id: string; name: string; tagline: string; price_monthly: number
  question_limit: number; upload_limit: number; team_member_limit: number
  features: string[]; early_adoption: boolean; sort_order: number
}
interface BillingData {
  subscription: { plan_id: string; status: string; current_period_end: string; cancel_at_period_end: boolean }
  usage: { questions: number; uploads: number; period: string }
  limits: { questions: number; uploads: number }
  remaining: { questions: number; uploads: number }
  softWarning: boolean; limitReached: boolean; usagePct: number
  isUnlimited: boolean; plans: Plan[]
}

const PLAN_COLORS: Record<string, string> = {
  free: 'rgba(82,128,204,.15)',
  growth: 'rgba(208,138,89,.12)',
  business: 'rgba(146,104,248,.12)',
  enterprise: 'rgba(245,166,35,.12)',
}
const PLAN_ACCENT: Record<string, string> = {
  free: '#8aa4cc', growth: 'var(--acc)', business: '#9268f8', enterprise: '#f5a623',
}

export default function BillingPage() {
  const [data, setData] = useState<BillingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [cancelled, setCancelled] = useState(false)

  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    if (p.get('success') === 'true') setSuccess(true)
    if (p.get('cancelled') === 'true') setCancelled(true)
    fetch('/api/billing').then(r => r.json()).then(d => { setData(d); setLoading(false) })
  }, [])

  const upgrade = async (plan: string) => {
    if (plan === 'enterprise') {
      await fetch('/api/billing', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action:'enterprise' }) })
      window.location.href = 'mailto:hello@askbiz.co?subject=Enterprise enquiry from AskBiz'
      return
    }
    setUpgrading(plan)
    const res = await fetch('/api/billing', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action:'checkout', plan }) })
    const { url } = await res.json()
    if (url) window.location.href = url
    setUpgrading(null)
  }

  const openPortal = async () => {
    const res = await fetch('/api/billing', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action:'portal' }) })
    const { url } = await res.json()
    if (url) window.location.href = url
  }

  const currentPlan = data?.subscription?.plan_id || 'free'
  const qUsed = data?.usage.questions || 0
  const qLimit = data?.limits.questions || 10
  const usagePct = data?.usagePct || 0

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      <div style={{ padding:'20px 24px 16px', borderBottom:'1px solid var(--b)', flexShrink:0 }}>
        <div style={{ fontFamily:'var(--font-sora)', fontSize:18, fontWeight:600 }}>Billing & Plan</div>
        <div style={{ fontSize:13, color:'var(--tx2)', marginTop:3 }}>Manage your subscription and track usage</div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'20px 24px' }}>

        {/* Banners */}
        {success && (
          <div style={{ padding:'14px 18px', borderRadius:12, marginBottom:20, background:'rgba(34,197,94,.1)', border:'1px solid rgba(34,197,94,.3)', fontSize:14, color:'#22c55e', fontWeight:500 }}>
            🎉 You're on {currentPlan === 'growth' ? 'Growth' : 'Business'} — your access is now active.
          </div>
        )}
        {cancelled && (
          <div style={{ padding:'14px 18px', borderRadius:12, marginBottom:20, background:'rgba(82,128,204,.08)', border:'1px solid var(--b2)', fontSize:13, color:'var(--tx2)' }}>
            No problem — you're still on your current plan. Upgrade whenever you're ready.
          </div>
        )}

        {loading ? (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            {[1,2].map(i => <div key={i} style={{ height:140, borderRadius:14, background:'var(--ev)', animation:'shimmer 1.4s infinite' }}/>)}
          </div>
        ) : (
          <>
            {/* Current plan + usage row */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:28 }}>

              {/* Plan card */}
              <div style={{ padding:22, borderRadius:16, border:`1px solid ${PLAN_ACCENT[currentPlan]}44`, background:PLAN_COLORS[currentPlan] }}>
                <div style={{ fontSize:11, fontWeight:600, color:PLAN_ACCENT[currentPlan], textTransform:'uppercase', letterSpacing:'.07em', marginBottom:10 }}>Your plan</div>
                <div style={{ fontFamily:'var(--font-sora)', fontSize:26, fontWeight:700, marginBottom:4 }}>
                  {data?.plans?.find(p => p.id === currentPlan)?.name || 'Free'}
                </div>
                <div style={{ fontSize:13, color:'var(--tx2)', marginBottom:14, lineHeight:1.5 }}>
                  {data?.plans?.find(p => p.id === currentPlan)?.tagline}
                </div>
                {data?.subscription?.current_period_end && currentPlan !== 'free' && (
                  <div style={{ fontSize:11, color:'var(--tx3)', marginBottom:12 }}>
                    {data.subscription.cancel_at_period_end ? '⚠️ Cancels' : 'Renews'}{' '}
                    {new Date(data.subscription.current_period_end).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })}
                  </div>
                )}
                {currentPlan !== 'free' && currentPlan !== 'enterprise' && (
                  <button onClick={openPortal} style={{ padding:'7px 14px', borderRadius:9999, border:'1px solid var(--b2)', background:'transparent', color:'var(--tx2)', fontFamily:'inherit', fontSize:12, cursor:'pointer' }}>
                    Manage subscription →
                  </button>
                )}
              </div>

              {/* Usage card */}
              <div style={{ padding:22, borderRadius:16, border:'1px solid var(--b)', background:'var(--sf)' }}>
                <div style={{ fontSize:11, fontWeight:600, color:'var(--tx3)', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:14 }}>
                  Usage this month
                </div>

                {/* Questions */}
                <div style={{ marginBottom:14 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:6 }}>
                    <span style={{ color:'var(--tx2)' }}>AI questions</span>
                    <span style={{ fontWeight:600, color: usagePct >= 80 ? '#f5c55a' : 'var(--tx)' }}>
                      {qUsed}{data?.isUnlimited ? '' : ` / ${qLimit}`}
                      {data?.isUnlimited && <span style={{ color:'var(--acc)', fontSize:11, marginLeft:6 }}>No limit</span>}
                    </span>
                  </div>
                  {!data?.isUnlimited && (
                    <div style={{ height:7, borderRadius:9999, background:'var(--ev)', overflow:'hidden' }}>
                      <div style={{ height:'100%', borderRadius:9999, width:`${Math.min(100, usagePct)}%`,
                        background: usagePct >= 100 ? '#f48080' : usagePct >= 80 ? '#f5c55a' : 'var(--acc)',
                        transition:'width 700ms ease' }}/>
                    </div>
                  )}
                  {data?.softWarning && !data?.limitReached && (
                    <div style={{ marginTop:8, fontSize:12, color:'#f5c55a' }}>
                      You're at {usagePct}% of your monthly questions — consider upgrading to avoid any interruption.
                    </div>
                  )}
                  {data?.limitReached && (
                    <div style={{ marginTop:8, fontSize:12, color:'#f48080' }}>
                      You've reached your limit for this month. Upgrade to keep going.
                    </div>
                  )}
                </div>

                {/* Uploads */}
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
                  <span style={{ color:'var(--tx2)' }}>File uploads</span>
                  <span style={{ fontWeight:600 }}>
                    {data?.usage.uploads || 0}
                    {data?.limits.uploads !== -1 ? ` / ${data?.limits.uploads}` : ''}
                    {data?.limits.uploads === -1 && <span style={{ color:'var(--acc)', fontSize:11, marginLeft:6 }}>No limit</span>}
                  </span>
                </div>
              </div>
            </div>

            {/* Plans */}
            <div style={{ fontSize:14, fontWeight:600, color:'var(--tx)', marginBottom:16 }}>
              {currentPlan === 'free' ? 'Choose your plan' : 'All plans'}
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
              {(data?.plans || []).map(plan => {
                const isCurrent = plan.id === currentPlan
                const accent = PLAN_ACCENT[plan.id] || '#8aa4cc'
                const isUpgrade = plan.sort_order > (data?.plans?.find(p => p.id === currentPlan)?.sort_order || 0)

                return (
                  <div key={plan.id} style={{ padding:20, borderRadius:16, border:`1px solid ${isCurrent ? accent + '55' : 'var(--b)'}`, background: isCurrent ? PLAN_COLORS[plan.id] : 'var(--sf)', display:'flex', flexDirection:'column', position:'relative' }}>

                    {plan.id === 'growth' && !isCurrent && (
                      <div style={{ position:'absolute', top:-10, left:'50%', transform:'translateX(-50%)', padding:'3px 12px', borderRadius:9999, background:accent, color:'#04080f', fontSize:10, fontWeight:700, whiteSpace:'nowrap' }}>
                        MOST POPULAR
                      </div>
                    )}

                    {plan.early_adoption && !isCurrent && (
                      <div style={{ position:'absolute', top:10, right:10, padding:'2px 8px', borderRadius:9999, background:'rgba(245,166,35,.15)', border:'1px solid rgba(245,166,35,.3)', fontSize:9, fontWeight:600, color:'#f5a623', whiteSpace:'nowrap' }}>
                        EARLY PRICE
                      </div>
                    )}

                    <div style={{ fontFamily:'var(--font-sora)', fontSize:15, fontWeight:700, color:accent, marginBottom:3 }}>{plan.name}</div>
                    <div style={{ fontSize:11, color:'var(--tx3)', marginBottom:12, lineHeight:1.5 }}>{plan.tagline}</div>

                    <div style={{ marginBottom:14 }}>
                      {plan.price_monthly === 0 ? (
                        <span style={{ fontFamily:'var(--font-sora)', fontSize:24, fontWeight:700 }}>Free</span>
                      ) : plan.price_monthly === -1 ? (
                        <span style={{ fontFamily:'var(--font-sora)', fontSize:18, fontWeight:700 }}>Contact us</span>
                      ) : (
                        <>
                          <span style={{ fontFamily:'var(--font-sora)', fontSize:24, fontWeight:700 }}>£{plan.price_monthly}</span>
                          <span style={{ fontSize:12, color:'var(--tx3)' }}>/month</span>
                        </>
                      )}
                    </div>

                    <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:16, flex:1 }}>
                      {plan.features.map((f, i) => (
                        <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:7, fontSize:12, color: isCurrent ? 'var(--tx2)' : 'var(--tx2)', lineHeight:1.5 }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink:0, marginTop:2 }}><polyline points="20 6 9 17 4 12"/></svg>
                          {f}
                        </div>
                      ))}
                    </div>

                    {isCurrent ? (
                      <div style={{ padding:'9px', borderRadius:9999, border:`1px solid ${accent}44`, color:accent, fontSize:12, fontWeight:500, textAlign:'center' }}>
                        ✓ Current plan
                      </div>
                    ) : isUpgrade ? (
                      <button onClick={() => upgrade(plan.id)} disabled={!!upgrading}
                        style={{ padding:'10px', borderRadius:9999, border:'none', background: accent, color: plan.id === 'enterprise' ? '#04080f' : '#04080f', fontFamily:'inherit', fontSize:13, fontWeight:600, cursor:'pointer', opacity: upgrading ? .6 : 1 }}>
                        {upgrading === plan.id ? 'Opening…' :
                          plan.id === 'enterprise' ? 'Contact sales →' :
                          `Upgrade to ${plan.name} →`}
                      </button>
                    ) : (
                      <div style={{ padding:'9px', borderRadius:9999, border:'1px solid var(--b)', color:'var(--tx3)', fontSize:12, textAlign:'center' }}>
                        Downgrade
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Value anchor */}
            <div style={{ marginTop:22, padding:'14px 18px', borderRadius:12, border:'1px solid var(--b)', background:'var(--sf)', fontSize:13, color:'var(--tx2)', lineHeight:1.7, textAlign:'center' }}>
              💡 <strong style={{ color:'var(--tx)' }}>One good decision pays for years of AskBiz.</strong> One bad restock costs more than your entire annual subscription.
              <br/>7-day free trial on first upgrade · Cancel anytime · No hidden fees
            </div>
          </>
        )}
      </div>
    </div>
  )
}
