'use client'
import { useState } from 'react'
import { CORE_ENDPOINTS } from '@/lib/endpoints'

const focusRing = 'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-500'
const inputCls = `w-full px-3 py-3 rounded-lg border border-ink-600 bg-ink-950 text-ink-50 text-sm transition-colors font-mono ${focusRing}`
const labelCls = 'block mb-1.5 text-xs font-medium text-ink-200'
const primaryBtnCls = `py-3 px-5 rounded-lg bg-signal-500 text-ink-950 text-sm font-semibold hover:bg-signal-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${focusRing}`

// Everything callable directly with an x-api-key — excludes /api/v1/pricing
// (public, no key needed) and account-management endpoints like webhooks
// (session-only, never called with a key from a third-party server).
const CONSOLE_ENDPOINTS = CORE_ENDPOINTS.filter(e => e.authType === 'api_key')

const EXAMPLE_BODIES: Record<string, string> = {
  '/api/v1/ask': JSON.stringify({ question: 'Which product has the worst margin this month?' }, null, 2),
  '/api/v1/scan': JSON.stringify({ image: '<base64-encoded JPEG>' }, null, 2),
  '/api/v1/whatsapp/send': JSON.stringify({ phone: '+254712345678', template: 'receipt', text: 'Thank you for your purchase!' }, null, 2),
  '/api/v1/connections': JSON.stringify({ merchant_email: 'merchant@example.com', scopes: ['read_inventory'] }, null, 2),
  '/api/v1/charges': JSON.stringify({ merchant_email: 'merchant@example.com', amount_cents: 5000, currency: 'gbp', description: 'Monthly subscription' }, null, 2),
}

type Result = { status: number; latency_ms: number; rate_limit_remaining: string | null; response: unknown }

export default function ConsolePage() {
  const [path, setPath] = useState(CONSOLE_ENDPOINTS[0].path)
  const [apiKey, setApiKey] = useState('')
  const [requestBody, setRequestBody] = useState(EXAMPLE_BODIES[CONSOLE_ENDPOINTS[0].path] || '')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState('')

  const endpoint = CONSOLE_ENDPOINTS.find(e => e.path === path)!

  // Detected purely from the prefix the moment it's pasted — the console
  // never stores the key, so this is the only signal available client-side.
  // null (unrecognized prefix) intentionally renders no banner rather than
  // guessing.
  const keyEnv: 'live' | 'test' | null =
    apiKey.startsWith('abz_test_') ? 'test' : apiKey.startsWith('abz_live_') ? 'live' : null

  // What sending this endpoint for real actually does — used to tailor the
  // live-key warning below. Only the endpoints with a real external or
  // financial effect get one; /api/v1/ask is free and read-only in both
  // modes, so it's deliberately excluded (see /docs/guides/sandbox-keys).
  const realEffect: Record<string, string> = {
    '/api/v1/scan': 'call the vision model and debit your wallet',
    '/api/v1/whatsapp/send': 'send a real WhatsApp message',
    '/api/v1/charges': 'create a real charge a real merchant can pay',
  }

  const handleEndpointChange = (newPath: string) => {
    setPath(newPath)
    setRequestBody(EXAMPLE_BODIES[newPath] || '')
    setResult(null)
  }

  const handleSend = async () => {
    if (!apiKey.trim()) { setError('Paste an API key to send a real request'); return }
    setSending(true); setError(''); setResult(null)
    try {
      const res = await fetch('/api/dashboard-console', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey.trim(), path, method: endpoint.method, requestBody }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Request failed')
      setResult(data)
    } catch (e: any) {
      setError(e.message || 'Could not send request')
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1">Console</h1>
      <p className="text-ink-300 text-sm mb-2 max-w-lg">
        Fire a real request at askbiz.co using one of your own keys — see the actual response before writing any code.
      </p>
      <p className="text-ink-400 text-xs mb-8 max-w-lg">
        Your key is only ever sent from this browser to askbiz.co for this one request — we never store, log, or
        re-display it, same as every key and webhook secret in this product. Paste it fresh each time.{' '}
        <a href="/docs/guides/use-the-api-console" className="text-signal-300 underline underline-offset-2">Full guide →</a>
      </p>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="console-endpoint" className={labelCls}>Endpoint</label>
            <select id="console-endpoint" value={path} onChange={e => handleEndpointChange(e.target.value)} className={inputCls}>
              {CONSOLE_ENDPOINTS.map(e => (
                <option key={e.path} value={e.path}>{e.method} {e.path}</option>
              ))}
            </select>
            <p className="text-ink-400 text-xs mt-1.5">{endpoint.summary}</p>
          </div>

          <div>
            <label htmlFor="console-key" className={labelCls}>API key</label>
            <input id="console-key" type="password" placeholder="abz_test_... or abz_live_..." value={apiKey} onChange={e => setApiKey(e.target.value)}
              autoComplete="off" className={inputCls} />
          </div>

          {keyEnv === 'test' && path === '/api/v1/connections' && (
            <div className="rounded-lg border border-pulse-500 bg-pulse-700/20 px-3 py-2 text-xs font-semibold text-pulse-200">
              Sandbox connections aren’t available yet — this will fail with a 403. Paste a live key to try this endpoint.
            </div>
          )}
          {keyEnv === 'test' && path !== '/api/v1/connections' && (
            <div className="rounded-lg border border-pulse-500 bg-pulse-700/20 px-3 py-2 text-xs font-semibold text-pulse-200">
              Sandbox key — no real money moves and no real messages sent, on any endpoint.
            </div>
          )}
          {keyEnv === 'live' && realEffect[path] && (
            <div className="rounded-lg border border-amber-500 bg-amber-600/10 px-3 py-2 text-xs font-semibold text-amber-300">
              Live key — sending this will {realEffect[path]}.
            </div>
          )}

          {endpoint.method !== 'GET' && (
            <div>
              <label htmlFor="console-body" className={labelCls}>Request body (JSON)</label>
              <textarea id="console-body" rows={8} value={requestBody} onChange={e => setRequestBody(e.target.value)}
                className={`${inputCls} resize-y`} spellCheck={false} />
            </div>
          )}

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button onClick={handleSend} disabled={sending} className={primaryBtnCls}>
            {sending ? 'Sending…' : 'Send request'}
          </button>
        </div>

        <div>
          <p className={labelCls}>Response</p>
          {!result && (
            <div className="border border-ink-700 rounded-xl p-6 text-center bg-ink-900">
              <p className="text-ink-400 text-sm">Send a request to see the real response here.</p>
            </div>
          )}
          {result && (
            <div className="border border-ink-700 rounded-xl overflow-hidden bg-ink-950">
              <div className="px-4 py-2.5 border-b border-ink-700 bg-ink-900 flex items-center gap-3 flex-wrap">
                <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${result.status < 300 ? 'bg-signal-600/20 text-signal-300' : result.status < 500 ? 'bg-amber-600/20 text-amber-300' : 'bg-red-600/20 text-red-300'}`}>
                  {result.status}
                </span>
                <span className="text-ink-400 text-xs">{result.latency_ms}ms</span>
                {result.rate_limit_remaining !== null && (
                  <span className="text-ink-400 text-xs">{result.rate_limit_remaining} requests left this minute</span>
                )}
              </div>
              <pre className="p-4 overflow-x-auto text-xs leading-relaxed text-ink-100">
                <code>{JSON.stringify(result.response, null, 2)}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
