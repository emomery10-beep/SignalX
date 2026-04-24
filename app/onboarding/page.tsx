'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { parseFile } from '@/lib/file/parser'

const BIZ_TYPES = [
  { id: 'retail',      emoji: '🏪', label: 'Retail shop',             desc: 'Physical or online retail store' },
  { id: 'ecommerce',   emoji: '📦', label: 'Ecommerce',               desc: 'Amazon, Shopify, eBay, or your own website' },
  { id: 'distributor', emoji: '🚚', label: 'Wholesale / Distribution', desc: 'Selling products to other businesses' },
  { id: 'exporter',    emoji: '🌍', label: 'Import / Export',          desc: 'Cross-border trade business' },
]

const FIRST_QUESTIONS: Record<string, string> = {
  retail:      'Which of my products is making me the most money right now?',
  ecommerce:   'What are my best selling products this month?',
  distributor: 'Which customers are most profitable?',
  exporter:    'How is currency affecting my margins right now?',
}

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState(1)
  const [bizType, setBizType] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<{ name: string; rows: number } | null>(null)
  const [saving, setSaving] = useState(false)
  const [score] = useState(Math.floor(Math.random() * 20 + 60)) // demo score 60-80

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    try {
      const parsed = await parseFile(file)
      setUploadedFile({ name: file.name, rows: parsed.rowCount })
    } catch (e) {
      console.error('Upload failed:', e)
    } finally {
      setUploading(false)
    }
  }

  const finish = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('profiles').update({
          business_type: bizType,
          onboarding_complete: true,
        }).eq('id', user.id)
      }
      router.push('/home')
    } finally {
      setSaving(false)
    }
  }

  const progress = (step / 3) * 100

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'var(--font-dm, system-ui)' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>

        {/* Progress bar */}
        <div style={{ height: 4, background: 'var(--ev)', borderRadius: 2, marginBottom: 32, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: '#6366F1', borderRadius: 2, width: progress + '%', transition: 'width 400ms var(--ease)' }}></div>
        </div>

        {/* STEP 1 — Business type */}
        {step === 1 && (
          <div className="animate-scale-in">
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                  <rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.45"/>
                  <rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.7"/>
                  <rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/>
                </svg>
              </div>
              <h1 style={{ fontFamily: 'var(--font-sora)', fontSize: 24, fontWeight: 700, letterSpacing: '-.025em', marginBottom: 8 }}>
                Welcome to AskBiz
              </h1>
              <p style={{ fontSize: 15, color: 'var(--tx3)', margin: 0, lineHeight: 1.6 }}>
                Your AI business intelligence advisor — in plain English.
                <br/>First, what type of business do you run?
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {BIZ_TYPES.map(b => (
                <button key={b.id} onClick={() => setBizType(b.id)}
                  style={{
                    padding: '16px 18px', borderRadius: 14,
                    border: bizType === b.id ? '2px solid #6366F1' : '1px solid var(--b)',
                    background: bizType === b.id ? 'rgba(99,102,241,.06)' : 'var(--sf)',
                    textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', gap: 14,
                    transition: 'all 150ms',
                  }}>
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{b.emoji}</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: bizType === b.id ? '#6366F1' : 'var(--tx)', marginBottom: 2 }}>{b.label}</div>
                    <div style={{ fontSize: 13, color: 'var(--tx3)' }}>{b.desc}</div>
                  </div>
                  {bizType === b.id && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" style={{ marginLeft: 'auto', flexShrink: 0 }}>
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>

            <button onClick={() => setStep(2)} disabled={!bizType}
              style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: bizType ? '#6366F1' : 'var(--ev)', color: bizType ? '#fff' : 'var(--tx3)', fontSize: 15, fontWeight: 600, cursor: bizType ? 'pointer' : 'not-allowed', fontFamily: 'inherit', transition: 'all 150ms' }}>
              Continue →
            </button>
          </div>
        )}

        {/* STEP 2 — Connect data */}
        {step === 2 && (
          <div className="animate-scale-in">
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: 22, fontWeight: 700, letterSpacing: '-.02em', marginBottom: 8 }}>
                Now, connect your data
              </h2>
              <p style={{ fontSize: 14, color: 'var(--tx3)', margin: 0, lineHeight: 1.6 }}>
                AskBiz is most powerful when it knows your actual numbers.
                Upload a sales file or connect your shop — it takes under a minute.
              </p>
            </div>

            <label style={{ display: 'block', padding: '24px', borderRadius: 16, border: uploadedFile ? '2px solid #22C55E' : '2px dashed var(--b2)', background: uploadedFile ? 'rgba(34,197,94,.04)' : 'var(--sf)', textAlign: 'center', cursor: 'pointer', marginBottom: 12, transition: 'all 150ms' }}>
              <input type="file" accept=".csv,.xlsx,.xls" style={{ display: 'none' }}
                onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])}/>
              {uploading ? (
                <div>
                  <div style={{ width: 32, height: 32, border: '3px solid rgba(99,102,241,.2)', borderTopColor: '#6366F1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 8px' }}></div>
                  <div style={{ fontSize: 14, color: 'var(--tx3)' }}>Reading your data...</div>
                </div>
              ) : uploadedFile ? (
                <div>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>✅</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#16a34a', marginBottom: 2 }}>{uploadedFile.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--tx3)' }}>{uploadedFile.rows.toLocaleString()} rows loaded</div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📁</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--tx)', marginBottom: 4 }}>Upload your sales data</div>
                  <div style={{ fontSize: 13, color: 'var(--tx3)' }}>CSV or Excel file · Your data stays private</div>
                </div>
              )}
            </label>

            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              {[
                { icon: '🛍️', label: 'Shopify', href: '/sources' },
                { icon: '📦', label: 'Amazon', href: '/sources' },
                { icon: '🏪', label: 'eBay', href: '/sources' },
              ].map((s, i) => (
                <button key={i} onClick={() => router.push(s.href)}
                  style={{ flex: 1, padding: '10px 8px', borderRadius: 10, border: '1px solid var(--b)', background: 'var(--sf)', fontSize: 12, fontWeight: 500, color: 'var(--tx2)', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 18 }}>{s.icon}</span>
                  {s.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button onClick={() => setStep(3)}
                style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: '#6366F1', color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                {uploadedFile ? 'See my business health →' : 'Skip for now, use sample data →'}
              </button>
              <button onClick={() => setStep(1)}
                style={{ width: '100%', padding: '10px', borderRadius: 12, border: 'none', background: 'transparent', color: 'var(--tx3)', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
                ← Back
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Magic moment: first Health Score */}
        {step === 3 && (
          <div className="animate-scale-in">
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: 22, fontWeight: 700, letterSpacing: '-.02em', marginBottom: 8 }}>
                Your business health score
              </h2>
              <p style={{ fontSize: 14, color: 'var(--tx3)', margin: 0, lineHeight: 1.6 }}>
                {uploadedFile ? `Based on your ${uploadedFile.name} data` : 'Based on sample data — connect your real data for your true score'}
              </p>
            </div>

            {/* Animated score */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ position: 'relative', width: 160, height: 160, marginBottom: 16 }}>
                <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="80" cy="80" r="68" fill="none" stroke="var(--ev)" strokeWidth="12"/>
                  <circle cx="80" cy="80" r="68" fill="none"
                    stroke={score >= 65 ? '#22C55E' : score >= 45 ? '#F59E0B' : '#EF4444'}
                    strokeWidth="12"
                    strokeDasharray={2 * Math.PI * 68}
                    strokeDashoffset={2 * Math.PI * 68 * (1 - score / 100)}
                    strokeLinecap="round"
                    style={{ animation: 'drawScore 1.4s cubic-bezier(.16,1,.3,1) both', filter: 'drop-shadow(0 0 10px rgba(34,197,94,.3))' }}
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 42, fontWeight: 800, color: score >= 65 ? '#16a34a' : score >= 45 ? '#d97706' : '#dc2626', letterSpacing: '-.04em', lineHeight: 1 }}>{score}</span>
                  <span style={{ fontSize: 14, color: 'var(--tx3)', marginTop: 2 }}>/ 100</span>
                </div>
              </div>

              <div style={{ fontSize: 18, fontWeight: 700, color: score >= 65 ? '#16a34a' : '#d97706', marginBottom: 6 }}>
                {score >= 65 ? 'Looking healthy' : 'A few things to watch'}
              </div>
              <p style={{ fontSize: 14, color: 'var(--tx2)', textAlign: 'center', lineHeight: 1.6, maxWidth: 360, margin: '0 0 20px' }}>
                {uploadedFile
                  ? 'AskBiz has analysed your data and calculated your Business Pulse score. Head to your dashboard to see what it found.'
                  : 'Connect your real data to get your true Business Pulse score — personalised to your products, margins, and sales patterns.'}
              </p>
            </div>

            {/* First question */}
            <div style={{ padding: '16px', borderRadius: 14, border: '1px solid rgba(99,102,241,.15)', background: 'rgba(99,102,241,.04)', marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Your first question</div>
              <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--tx)', margin: 0, lineHeight: 1.5 }}>
                {FIRST_QUESTIONS[bizType] || 'What should I focus on in my business today?'}
              </p>
            </div>

            <button onClick={finish} disabled={saving}
              style={{ width: '100%', padding: '15px', borderRadius: 12, border: 'none', background: saving ? 'var(--ev)' : '#6366F1', color: saving ? 'var(--tx3)' : '#fff', fontSize: 15, fontWeight: 600, cursor: saving ? 'wait' : 'pointer', fontFamily: 'inherit', marginBottom: 8 }}>
              {saving ? 'Getting things ready...' : 'Open AskBiz →'}
            </button>

            <style>{`
              @keyframes drawScore {
                from { stroke-dashoffset: ${2 * Math.PI * 68}px; }
                to { stroke-dashoffset: ${2 * Math.PI * 68 * (1 - score / 100)}px; }
              }
              @keyframes spin { to { transform: rotate(360deg) } }
            `}</style>
          </div>
        )}

      </div>
    </div>
  )
}
