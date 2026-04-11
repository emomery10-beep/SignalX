'use client'
import { usePlan } from '@/lib/hooks/usePlan'
import FeatureGate from '@/components/gates/FeatureGate'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store'

interface Template { id:string; name:string; description:string; biz_type:string; questions:string[]; icon:string }

const BIZ_FILTERS = [
  { value:'', label:'All types' },
  { value:'retail', label:'🏪 Retail' },
  { value:'ecommerce', label:'🛒 Ecommerce' },
  { value:'distributor', label:'🚚 Distributor' },
  { value:'exporter', label:'🌍 Exporter' },
]

export default function TemplatesPage() {
  const { planId, loading: planLoading } = usePlan()
  const router = useRouter()
  const { settings } = useStore()
  const [templates, setTemplates] = useState<Template[]>([])
  const [filter, setFilter] = useState<'retail'|'ecommerce'|'distributor'|'exporter'|''>('')
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string|null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const url = filter ? `/api/templates?biz_type=${filter}` : '/api/templates'
      const res = await fetch(url)
      const data = await res.json()
      setTemplates(data || [])
      setLoading(false)
    }
    load()
  }, [filter])

  const useTemplate = (q: string) => {
    // Store question in session storage, redirect to chat
    sessionStorage.setItem('signalx-prefill', q)
    router.push('/chat')
  }

  if (!planLoading && planId === 'free') return <FeatureGate planId={planId} feature='templates' featureName='Industry Templates' planNeeded='growth'><></></FeatureGate>

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      <div style={{ padding:'20px 24px 16px', borderBottom:'1px solid var(--b)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <div>
          <div style={{ fontFamily:'var(--font-sora)', fontSize:18, fontWeight:600 }}>Industry Templates</div>
          <div style={{ fontSize:13, color:'var(--tx2)', marginTop:3 }}>Pre-built question sets for your business type</div>
        </div>
        <div style={{ display:'flex', gap:6 }}>
          {BIZ_FILTERS.map(f => (
            <button key={f.value} onClick={() => setFilter(f.value)}
              style={{ padding:'6px 13px', borderRadius:9999, border:`1px solid ${filter===f.value?'rgba(30,212,202,.35)':'var(--b2)'}`, background:filter===f.value?'rgba(30,212,202,.09)':'transparent', color:filter===f.value?'#47e2da':'var(--tx2)', fontFamily:'inherit', fontSize:12, cursor:'pointer' }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'20px 24px' }}>
        {loading ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
            {[1,2,3,4].map(i => <div key={i} style={{ height:200, borderRadius:14, background:'var(--ev)', animation:'shimmer 1.4s infinite', backgroundSize:'200% 100%' }}/>)}
          </div>
        ) : templates.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--tx3)' }}>No templates found for this business type.</div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:16 }}>
            {templates.map(t => (
              <div key={t.id} style={{ background:'var(--sf)', border:'1px solid var(--b)', borderRadius:14, overflow:'hidden', transition:'border-color 200ms' }}
                onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.borderColor='var(--b2)'}
                onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.borderColor='var(--b)'}>
                <div style={{ padding:'18px 18px 14px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                    <div style={{ fontSize:24 }}>{t.icon}</div>
                    <div>
                      <div style={{ fontFamily:'var(--font-sora)', fontSize:14, fontWeight:600 }}>{t.name}</div>
                      <div style={{ fontSize:11, color:'var(--tx3)' }}>{t.biz_type}</div>
                    </div>
                  </div>
                  <div style={{ fontSize:13, color:'var(--tx2)', lineHeight:1.6, marginBottom:12 }}>{t.description}</div>
                  <button onClick={() => setExpanded(expanded===t.id?null:t.id)}
                    style={{ fontSize:12, color:'var(--acc)', background:'none', border:'none', cursor:'pointer', padding:0, fontFamily:'inherit' }}>
                    {expanded===t.id ? '↑ Hide questions' : `↓ ${t.questions.length} questions`}
                  </button>
                </div>

                {expanded === t.id && (
                  <div style={{ borderTop:'1px solid var(--b)', padding:'12px 18px' }}>
                    {t.questions.map((q, i) => (
                      <div key={i} onClick={() => useTemplate(q)}
                        style={{ display:'flex', alignItems:'center', gap:9, padding:'8px 10px', borderRadius:9, cursor:'pointer', marginBottom:4, transition:'background 140ms' }}
                        onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background='var(--ev)'}
                        onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='transparent'}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1ed4ca" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        <span style={{ fontSize:12, color:'var(--tx)' }}>{q}</span>
                      </div>
                    ))}
                    <button onClick={() => useTemplate(t.questions[0])}
                      style={{ width:'100%', marginTop:8, padding:'9px', borderRadius:9999, border:'none', background:'#1ed4ca', color:'#04080f', fontFamily:'inherit', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                      Use this template in chat →
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
