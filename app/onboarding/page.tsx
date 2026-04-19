'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const GOALS = [
  { id: 'expand', icon: '🚀', title: 'Expand my product line', desc: 'Find new products that fit my customers and improve margin' },
  { id: 'margins', icon: '💰', title: 'Understand my margins', desc: 'See exactly what each product earns after all costs' },
  { id: 'stock', icon: '📦', title: 'Fix my stock levels', desc: 'Know what to restock, when, and how much to order' },
  { id: 'pricing', icon: '🏷️', title: 'Improve my pricing', desc: 'Find out which prices I can raise without losing customers' },
  { id: 'decisions', icon: '🧠', title: 'Make faster decisions', desc: 'Ask any business question and get a clear answer instantly' },
]

const BIZ_TYPES = [
  { id: 'retail', icon: '🏪', label: 'Retail shop' },
  { id: 'ecommerce', icon: '🛒', label: 'Ecommerce' },
  { id: 'distributor', icon: '🚚', label: 'Distributor' },
  { id: 'exporter', icon: '✈️', label: 'Exporter / importer' },
]

const STEPS = ['Welcome', 'Business type', 'Your goal', 'Connect data']

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(0)
  const [bizType, setBizType] = useState('')
  const [goal, setGoal] = useState('')
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  const next = () => setStep(s => s + 1)
  const back = () => setStep(s => s - 1)
  const progress = (step / (STEPS.length - 1)) * 100

  const finish = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').update({
        full_name: name || undefined,
        biz_type: bizType || undefined,
      }).eq('id', user.id)
    }
    router.push(goal === 'expand' ? '/expansion' : goal === 'stock' ? '/dashboards' : '/chat')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'var(--font-dm, DM Sans, sans-serif)' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 32 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#d08a59,#8c6fe0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="13" height="13" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round"><polyline points="2,14 6,8 10,11 14,4"/></svg>
        </div>
        <span style={{ fontFamily: 'var(--font-sora)', fontSize: 16, fontWeight: 700 }}>AskBiz</span>
      </div>

      <div style={{ width: '100%', maxWidth: 'min(520px, 100vw - 32px)', marginBottom: 16 }}>
        <div style={{ height: 4, borderRadius: 9999, background: 'var(--ev)', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 9999, background: 'var(--acc)', width: `${progress}%`, transition: 'width 400ms ease' }}/>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ fontSize: 11, color: i <= step ? 'var(--acc)' : 'var(--tx3)', fontWeight: i === step ? 600 : 400 }}>{s}</div>
          ))}
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: 'min(520px, 100vw - 32px)', background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 20, padding: 32, boxShadow: '0 8px 32px rgba(0,0,0,.08)' }}>

        {step === 0 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>👋</div>
            <h1 style={{ fontFamily: 'var(--font-sora)', fontSize: 24, fontWeight: 700, marginBottom: 10 }}>Welcome to AskBiz</h1>
            <p style={{ fontSize: 15, color: 'var(--tx2)', lineHeight: 1.65, marginBottom: 28 }}>
              Let's set you up in 2 minutes. Tell us your name and we'll personalise everything.
            </p>
            <div style={{ marginBottom: 20, textAlign: 'left' }}>
              <label style={{ fontSize: 13, color: 'var(--tx2)', display: 'block', marginBottom: 6 }}>Your name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. James Kimani"
                style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid var(--b2)', background: 'var(--ev)', color: 'var(--tx)', fontFamily: 'inherit', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}/>
            </div>
            <button onClick={next} disabled={!name.trim()}
              style={{ width: '100%', padding: 13, borderRadius: 9999, border: 'none', background: 'var(--acc)', color: '#fff', fontFamily: 'inherit', fontSize: 15, fontWeight: 600, cursor: name.trim() ? 'pointer' : 'not-allowed', opacity: name.trim() ? 1 : .5 }}>
              Let's go →
            </button>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: 20, fontWeight: 700, marginBottom: 6 }}>What type of business do you run, {name.split(' ')[0]}?</h2>
            <p style={{ fontSize: 14, color: 'var(--tx2)', marginBottom: 20 }}>We'll tailor insights to your business type.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 10, marginBottom: 24 }}>
              {BIZ_TYPES.map(b => (
                <button key={b.id} onClick={() => setBizType(b.id)}
                  style={{ padding: 16, borderRadius: 14, border: `2px solid ${bizType === b.id ? 'var(--acc)' : 'var(--b)'}`, background: bizType === b.id ? 'rgba(208,138,89,.08)' : 'var(--bg)', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'all 150ms' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{b.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--tx)' }}>{b.label}</div>
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={back} style={{ flex: 1, padding: 11, borderRadius: 9999, border: '1px solid var(--b2)', background: 'transparent', color: 'var(--tx2)', fontFamily: 'inherit', fontSize: 14, cursor: 'pointer' }}>← Back</button>
              <button onClick={next} disabled={!bizType} style={{ flex: 2, padding: 11, borderRadius: 9999, border: 'none', background: 'var(--acc)', color: '#fff', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: bizType ? 'pointer' : 'not-allowed', opacity: bizType ? 1 : .5 }}>Next →</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: 20, fontWeight: 700, marginBottom: 6 }}>What do you most want to achieve?</h2>
            <p style={{ fontSize: 14, color: 'var(--tx2)', marginBottom: 20 }}>Pick the one that matters most right now.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
              {GOALS.map(g => (
                <button key={g.id} onClick={() => setGoal(g.id)}
                  style={{ padding: '12px 14px', borderRadius: 14, border: `2px solid ${goal === g.id ? 'var(--acc)' : 'var(--b)'}`, background: goal === g.id ? 'rgba(208,138,89,.08)' : 'var(--bg)', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 12, transition: 'all 150ms' }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{g.icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--tx)' }}>{g.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--tx2)', marginTop: 2 }}>{g.desc}</div>
                  </div>
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={back} style={{ flex: 1, padding: 11, borderRadius: 9999, border: '1px solid var(--b2)', background: 'transparent', color: 'var(--tx2)', fontFamily: 'inherit', fontSize: 14, cursor: 'pointer' }}>← Back</button>
              <button onClick={next} disabled={!goal} style={{ flex: 2, padding: 11, borderRadius: 9999, border: 'none', background: 'var(--acc)', color: '#fff', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: goal ? 'pointer' : 'not-allowed', opacity: goal ? 1 : .5 }}>Next →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Connect your data</h2>
            <p style={{ fontSize: 14, color: 'var(--tx2)', marginBottom: 20 }}>Connect a source or skip and upload a file manually. You can always add more later.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {[
                { icon: '🛍️', label: 'Connect Shopify', desc: 'Products, orders, inventory, customers', href: '/sources' },
                { icon: '💳', label: 'Connect Stripe', desc: 'Payments, revenue, refunds', href: '/sources' },
                { icon: '📊', label: 'Upload a CSV or Excel file', desc: 'Your sales data, inventory, or P&L', href: '/files' },
              ].map((s, i) => (
                <a key={i} href={s.href}
                  style={{ padding: '14px 16px', borderRadius: 14, border: '1px solid var(--b)', background: 'var(--bg)', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'inherit', transition: 'all 150ms' }}
                  onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(208,138,89,.3)'}
                  onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--b)'}>
                  <span style={{ fontSize: 22 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{s.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--tx2)', marginTop: 2 }}>{s.desc}</div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2" strokeLinecap="round" style={{ marginLeft: 'auto', flexShrink: 0 }}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </a>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={back} style={{ flex: 1, padding: 11, borderRadius: 9999, border: '1px solid var(--b2)', background: 'transparent', color: 'var(--tx2)', fontFamily: 'inherit', fontSize: 14, cursor: 'pointer' }}>← Back</button>
              <button onClick={finish} disabled={saving} style={{ flex: 2, padding: 11, borderRadius: 9999, border: 'none', background: 'var(--acc)', color: '#fff', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                {saving ? 'Setting up…' : 'Skip — go to dashboard →'}
              </button>
            </div>
          </div>
        )}

      </div>

      <p style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 20 }}>
        Encrypted. Never shared. <a href="/privacy" style={{ color: 'var(--acc)', textDecoration: 'none' }}>Privacy policy</a>
      </p>
    </div>
  )
}
