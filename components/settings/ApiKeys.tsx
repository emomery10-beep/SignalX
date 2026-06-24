'use client'
import { useState, useEffect } from 'react'
import { useLang } from '@/components/LanguageProvider'

interface ApiKey {
  id: string
  name: string
  key: string
  mode: 'account' | 'generic'
  plan: string
  is_active: boolean
  requests_month: number
  request_limit_month: number
  last_used_at: string | null
  created_at: string
}

const PLAN_COLOURS: Record<string, { colour: string; bg: string }> = {
  free:       { colour: '#a39e97', bg: 'var(--ev)' },
  starter:    { colour: '#d08a59', bg: 'rgba(208,138,89,.1)' },
  growth:     { colour: '#16a34a', bg: 'rgba(34,197,94,.1)' },
  enterprise: { colour: '#8c6fe0', bg: 'rgba(140,111,224,.1)' },
}

function buildPlanLabels(tc: (key: string) => string): Record<string, { label: string; colour: string; bg: string }> {
  return {
    free:       { label: tc('settings_apikeys.planFree'),       ...PLAN_COLOURS.free },
    starter:    { label: tc('settings_apikeys.planStarter'),    ...PLAN_COLOURS.starter },
    growth:     { label: tc('settings_apikeys.planGrowth'),     ...PLAN_COLOURS.growth },
    enterprise: { label: tc('settings_apikeys.planEnterprise'), ...PLAN_COLOURS.enterprise },
  }
}

function CopyButton({ text }: { text: string }) {
  const { tc } = useLang()
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      style={{ fontSize: 11, fontWeight: 600, color: copied ? '#16a34a' : 'var(--acc)', background: 'transparent', border: `1px solid ${copied ? 'rgba(34,197,94,.3)' : 'rgba(208,138,89,.3)'}`, borderRadius: 'var(--r-md)', padding: '4px 10px', cursor: 'pointer', fontFamily: 'inherit', minHeight: 28, transition: 'all 150ms' }}
    >
      {copied ? tc('settings_apikeys.copied') : tc('settings_apikeys.copy')}
    </button>
  )
}

export default function ApiKeys() {
  const { tc } = useLang()
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyMode, setNewKeyMode] = useState<'generic' | 'account'>('generic')
  const [justCreated, setJustCreated] = useState<{ key: string; name: string } | null>(null)
  const [error, setError] = useState('')

  const PLAN_LABELS = buildPlanLabels(tc)

  useEffect(() => { loadKeys() }, [])

  const loadKeys = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/v1/keys')
      const data = await res.json()
      setKeys(data.keys || [])
    } catch { setError(tc('settings_apikeys.errorLoadKeys')) }
    finally { setLoading(false) }
  }

  const createKey = async () => {
    if (!newKeyName.trim()) return
    setCreating(true)
    setError('')
    try {
      const res = await fetch('/api/v1/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName.trim(), mode: newKeyMode, plan: 'free' }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setJustCreated({ key: data.key.key, name: data.key.name })
      setShowForm(false)
      setNewKeyName('')
      await loadKeys()
    } catch { setError(tc('settings_apikeys.errorCreateKey')) }
    finally { setCreating(false) }
  }

  const toggleKey = async (id: string, is_active: boolean) => {
    await fetch('/api/v1/keys', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_active: !is_active }),
    })
    await loadKeys()
  }

  const deleteKey = async (id: string) => {
    if (!confirm(tc('settings_apikeys.deleteConfirm'))) return
    await fetch('/api/v1/keys', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    await loadKeys()
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 11px', fontSize: 13,
    background: 'var(--bg)', border: '1px solid var(--b2)',
    borderRadius: 'var(--r-md)', color: 'var(--tx)',
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  }

  return (
    <div>
      {/* Just created — show full key once */}
      {justCreated && (
        <div style={{ background: 'rgba(34,197,94,.06)', border: '1px solid rgba(34,197,94,.2)', borderRadius: 'var(--r-lg)', padding: '14px 16px', marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#16a34a', marginBottom: 6 }}>
            {tc('settings_apikeys.keyCreatedNotice')}
          </div>
          <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 8 }}>{justCreated.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--ev)', borderRadius: 'var(--r-md)', padding: '8px 11px' }}>
            <code style={{ flex: 1, fontSize: 12, color: 'var(--tx)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>
              {justCreated.key}
            </code>
            <CopyButton text={justCreated.key}/>
          </div>
          <button onClick={() => setJustCreated(null)} style={{ marginTop: 10, fontSize: 12, color: 'var(--tx3)', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', minHeight: 'unset' }}>
            {tc('settings_apikeys.dismissSaved')}
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ fontSize: 12, color: '#dc2626', background: 'rgba(220,38,38,.05)', border: '1px solid rgba(220,38,38,.15)', borderRadius: 'var(--r-md)', padding: '9px 12px', marginBottom: 12 }}>
          {error}
        </div>
      )}

      {/* Keys list */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1, 2].map(i => <div key={i} className="skeleton" style={{ height: 72, borderRadius: 'var(--r-lg)' }}/>)}
        </div>
      ) : keys.length === 0 ? (
        <div style={{ padding: '24px', textAlign: 'center', background: 'var(--ev)', borderRadius: 'var(--r-lg)', marginBottom: 12 }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>🔑</div>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--tx)', marginBottom: 4 }}>{tc('settings_apikeys.noKeysTitle')}</div>
          <div style={{ fontSize: 13, color: 'var(--tx3)' }}>{tc('settings_apikeys.noKeysSubtitle')}</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
          {keys.map(k => {
            const plan = PLAN_LABELS[k.plan] || PLAN_LABELS.free
            const usePct = k.request_limit_month > 0
              ? Math.min((k.requests_month / k.request_limit_month) * 100, 100)
              : 0
            return (
              <div key={k.id} style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 'var(--r-lg)', padding: '14px 16px', opacity: k.is_active ? 1 : 0.6 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)' }}>{k.name}</span>
                      <span style={{ fontSize: 10, padding: '1px 7px', borderRadius: 'var(--rf)', background: plan.bg, color: plan.colour, fontWeight: 600 }}>
                        {plan.label}
                      </span>
                      <span style={{ fontSize: 10, padding: '1px 7px', borderRadius: 'var(--rf)', background: 'var(--ev)', color: 'var(--tx3)', fontWeight: 500 }}>
                        {k.mode}
                      </span>
                      {!k.is_active && (
                        <span style={{ fontSize: 10, padding: '1px 7px', borderRadius: 'var(--rf)', background: 'rgba(220,38,38,.08)', color: '#dc2626', fontWeight: 600 }}>
                          {tc('settings_apikeys.disabled')}
                        </span>
                      )}
                    </div>
                    <code style={{ fontSize: 11, color: 'var(--tx3)', fontFamily: 'var(--font-mono)' }}>{k.key}</code>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button
                      onClick={() => toggleKey(k.id, k.is_active)}
                      style={{ fontSize: 11, color: k.is_active ? '#d97706' : '#16a34a', background: 'transparent', border: `1px solid ${k.is_active ? 'rgba(245,158,11,.3)' : 'rgba(34,197,94,.3)'}`, borderRadius: 'var(--r-md)', padding: '4px 9px', cursor: 'pointer', fontFamily: 'inherit', minHeight: 28 }}
                    >
                      {k.is_active ? tc('settings_apikeys.disable') : tc('settings_apikeys.enable')}
                    </button>
                    <button
                      onClick={() => deleteKey(k.id)}
                      style={{ fontSize: 11, color: '#dc2626', background: 'transparent', border: '1px solid rgba(220,38,38,.25)', borderRadius: 'var(--r-md)', padding: '4px 9px', cursor: 'pointer', fontFamily: 'inherit', minHeight: 28 }}
                    >
                      {tc('settings_apikeys.delete')}
                    </button>
                  </div>
                </div>

                {/* Usage bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, height: 4, background: 'var(--ev)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${usePct}%`, background: usePct > 80 ? '#d97706' : 'var(--acc)', borderRadius: 2, transition: 'width 400ms var(--ease)' }}/>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--tx3)', whiteSpace: 'nowrap' }}>
                    {tc('settings_apikeys.usageThisMonth').replace('{requests}', k.requests_month.toLocaleString()).replace('{limit}', k.request_limit_month.toLocaleString())}
                  </span>
                </div>

                {k.last_used_at && (
                  <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 6 }}>
                    {tc('settings_apikeys.lastUsed').replace('{date}', new Date(k.last_used_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Create form */}
      {showForm ? (
        <div style={{ background: 'var(--ev)', border: '1px solid var(--b2)', borderRadius: 'var(--r-lg)', padding: '14px 16px', marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)', marginBottom: 12 }}>{tc('settings_apikeys.newApiKeyTitle')}</div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, color: 'var(--tx3)', marginBottom: 4 }}>{tc('settings_apikeys.keyNameLabel')}</div>
            <input
              style={inputStyle}
              value={newKeyName}
              onChange={e => setNewKeyName(e.target.value)}
              placeholder={tc('settings_apikeys.keyNamePlaceholder')}
              onKeyDown={e => e.key === 'Enter' && createKey()}
              autoFocus
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: 'var(--tx3)', marginBottom: 6 }}>{tc('settings_apikeys.modeLabel')}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['generic', 'account'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setNewKeyMode(m)}
                  style={{
                    flex: 1, padding: '9px', fontSize: 12, fontWeight: 500,
                    borderRadius: 'var(--r-md)', cursor: 'pointer', fontFamily: 'inherit',
                    border: newKeyMode === m ? `1.5px solid var(--acc)` : '1px solid var(--b2)',
                    background: newKeyMode === m ? 'rgba(208,138,89,.08)' : 'var(--sf)',
                    color: newKeyMode === m ? 'var(--acc)' : 'var(--tx2)',
                    textAlign: 'left' as const,
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 2, textTransform: 'capitalize' }}>{m}</div>
                  <div style={{ fontSize: 11, color: 'var(--tx3)', fontWeight: 400 }}>
                    {tc('settings_apikeys.' + (m === 'generic' ? 'modeGenericDescription' : 'modeAccountDescription'))}
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={createKey}
              disabled={creating || !newKeyName.trim()}
              style={{ flex: 1, padding: '10px', fontSize: 13, fontWeight: 600, background: 'var(--acc)', color: '#fff', border: 'none', borderRadius: 'var(--r-md)', cursor: creating ? 'wait' : 'pointer', fontFamily: 'inherit', opacity: creating ? .7 : 1, boxShadow: '0 2px 8px rgba(208,138,89,.25)' }}
            >
              {creating ? tc('settings_apikeys.creating') : tc('settings_apikeys.createKey')}
            </button>
            <button
              onClick={() => { setShowForm(false); setNewKeyName(''); setError('') }}
              style={{ padding: '10px 16px', fontSize: 13, color: 'var(--tx3)', background: 'transparent', border: '1px solid var(--b2)', borderRadius: 'var(--r-md)', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              {tc('settings_apikeys.cancel')}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          style={{ width: '100%', padding: '10px', fontSize: 13, fontWeight: 600, background: 'transparent', border: `1px dashed rgba(208,138,89,.4)`, borderRadius: 'var(--r-lg)', color: 'var(--acc)', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          {tc('settings_apikeys.createNewApiKey')}
        </button>
      )}

      {/* Docs link */}
      <div style={{ marginTop: 14, padding: '10px 13px', background: 'var(--ev)', borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ fontSize: 12, color: 'var(--tx3)' }}>
          {tc('settings_apikeys.docsPrompt')}
        </div>
        <a
          href="/developers"
          target="_blank"
          style={{ fontSize: 12, fontWeight: 600, color: 'var(--acc)', textDecoration: 'none', whiteSpace: 'nowrap' }}
        >
          {tc('settings_apikeys.viewDocs')}
        </a>
      </div>
    </div>
  )
}
