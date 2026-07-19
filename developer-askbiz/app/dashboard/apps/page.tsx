'use client'
import { useEffect, useState } from 'react'

type App = {
  id: string
  name: string
  logo_url: string | null
  redirect_uri: string | null
  created_at: string
}

type ApiKey = { id: string; name: string; app_id: string | null }

const focusRing = 'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-500'
const inputCls = `w-full px-3 py-3 rounded-lg border border-ink-600 bg-ink-950 text-ink-50 text-sm transition-colors ${focusRing}`
const labelCls = 'block mb-1.5 text-xs font-medium text-ink-200'
const primaryBtnCls = `py-3 px-5 rounded-lg bg-signal-500 text-ink-950 text-sm font-semibold hover:bg-signal-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${focusRing}`
const ghostBtnCls = `py-2 px-3 rounded-md border border-ink-600 text-ink-300 text-xs font-medium hover:bg-ink-800 transition-colors disabled:opacity-50 ${focusRing}`

// Apps are an opt-in grouping layer on top of raw API keys (see
// 20260717000005_developer_apps.sql) — a named, brandable integration a
// merchant sees on the /connect consent screen ("App XYZ wants..."), instead
// of a bare key reference. Keys keep working exactly as before whether or
// not they're assigned to an app.
export default function AppsPage() {
  const [apps, setApps] = useState<App[] | null>(null)
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [error, setError] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [redirectUri, setRedirectUri] = useState('')
  const [creating, setCreating] = useState(false)

  const load = async () => {
    try {
      const [appsRes, dataRes] = await Promise.all([
        fetch('/api/dashboard-apps'),
        fetch('/api/dashboard-data'),
      ])
      const appsData = await appsRes.json()
      const data = await dataRes.json()
      if (!appsRes.ok) throw new Error(appsData.error || 'Could not load apps')
      setApps(appsData.apps); setError('')
      if (data.keys) setKeys(data.keys)
    } catch (e: any) {
      setApps([])
      setError(e.message || 'Could not load apps')
    }
  }

  useEffect(() => { load() }, [])

  const handleCreate = async () => {
    if (!name.trim()) { setError('App name is required'); return }
    setCreating(true); setError('')
    try {
      const res = await fetch('/api/dashboard-apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, logo_url: logoUrl || undefined, redirect_uri: redirectUri || undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not create app')
      setName(''); setLogoUrl(''); setRedirectUri(''); setShowCreate(false)
      await load()
    } catch (e: any) {
      setError(e.message || 'Could not create app')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this app? Keys and connections grouped under it keep working — they just become ungrouped.')) return
    setError('')
    const res = await fetch('/api/dashboard-apps', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (!res.ok) { const d = await res.json(); setError(d.error || 'Could not delete app'); return }
    await load()
  }

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">Apps</h1>
          <p className="text-ink-300 text-sm max-w-lg">
            Group your keys under a named, brandable integration — merchants see this name (not a bare key) when
            approving a connection. Optional — a key works fine with no app assigned.{' '}
            <a href="/docs/guides/organize-keys-with-apps" className="text-signal-300 underline underline-offset-2">Full guide →</a>
          </p>
        </div>
        <button onClick={() => setShowCreate(s => !s)} className={primaryBtnCls}>
          {showCreate ? 'Cancel' : 'New app'}
        </button>
      </div>

      {showCreate && (
        <div className="border border-ink-700 rounded-xl p-5 mb-6 bg-ink-900">
          <div className="space-y-3 max-w-sm">
            <div>
              <label htmlFor="app-name" className={labelCls}>App name</label>
              <input id="app-name" type="text" placeholder="My Integration" value={name} onChange={e => setName(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label htmlFor="app-logo" className={labelCls}>Logo URL (optional)</label>
              <input id="app-logo" type="url" placeholder="https://your-app.com/logo.png" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label htmlFor="app-redirect" className={labelCls}>Redirect URI (optional)</label>
              <input id="app-redirect" type="url" placeholder="https://your-app.com/callback" value={redirectUri} onChange={e => setRedirectUri(e.target.value)} className={inputCls} />
            </div>
            <button onClick={handleCreate} disabled={creating} className={primaryBtnCls}>
              {creating ? 'Creating…' : 'Create app'}
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {!apps && !error && <p className="text-ink-300 text-sm">Loading…</p>}

      {apps && apps.length === 0 && (
        <div className="border border-ink-700 rounded-xl p-6 text-center">
          <p className="text-ink-300 text-sm">No apps yet — your keys work fine without one. Create an app if you want merchants to see a named integration instead of a bare key.</p>
        </div>
      )}

      {apps && apps.length > 0 && (
        <div className="space-y-3">
          {apps.map(a => {
            const keyCount = keys.filter(k => k.app_id === a.id).length
            return (
              <div key={a.id} className="border border-ink-700 rounded-xl p-4 bg-ink-900">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    {a.logo_url
                      ? <img src={a.logo_url} alt="" className="w-6 h-6 rounded object-cover flex-shrink-0" />
                      : <div className="w-6 h-6 rounded bg-ink-700 flex-shrink-0" />}
                    <span className="font-medium text-sm">{a.name}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-ink-800 text-ink-300">
                    {keyCount} key{keyCount === 1 ? '' : 's'}
                  </span>
                </div>
                {a.redirect_uri && <code className="text-xs text-ink-400 block mb-3">{a.redirect_uri}</code>}
                <div className="flex gap-2">
                  <button onClick={() => handleDelete(a.id)} className={ghostBtnCls}>Delete</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
