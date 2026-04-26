'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const ADMIN_EMAILS = ['emomery10@gmail.com', 'emomery10@googlemail.com']

const PRESETS = [
  { id: 'sme_pain',         label: 'SME Pain Points',         desc: 'Founders talking about business problems' },
  { id: 'shopify_problems', label: 'Shopify Problems',         desc: 'Shopify sellers with margin/stock issues' },
  { id: 'amazon_sellers',   label: 'Amazon Seller Pain',       desc: 'FBA sellers frustrated with fees' },
  { id: 'ecommerce_data',   label: 'eCommerce Data Questions', desc: 'Sellers asking data questions' },
  { id: 'ai_business',      label: 'AI for Business',          desc: 'People exploring AI for their business' },
  { id: 'uk_retail',        label: 'UK Retail Pain',           desc: 'UK retailers struggling with costs' },
]

export default function XAgentPage() {
  const router = useRouter()
  const supabase = createClient()
  const [authorized, setAuthorized] = useState(false)
  const [xConnected, setXConnected] = useState(null)
  const [xUsername, setXUsername]   = useState('')
  const [xError, setXError]         = useState('')
  const [tab, setTab]               = useState('search')
  const [preset, setPreset]         = useState('sme_pain')
  const [customQ, setCustomQ]       = useState('')
  const [useCustom, setUseCustom]   = useState(false)
  const [maxResults, setMaxResults] = useState(10)
  const [searching, setSearching]   = useState(false)
  const [results, setResults]       = useState([])
  const [queue, setQueue]           = useState([])
  const [history, setHistory]       = useState([])
  const [editId, setEditId]         = useState(null)
  const [editText, setEditText]     = useState('')
  const [posting, setPosting]       = useState(null)
  const [toast, setToast]           = useState(null)

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 4000)
  }

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !ADMIN_EMAILS.includes(user.email || '')) { router.push('/'); return }
      setAuthorized(true)
      const res = await fetch('/api/agent/x?action=validate')
      const data = await res.json()
      setXConnected(data.valid)
      if (data.username) setXUsername('@' + data.username)
      if (data.error) setXError(data.error)
    }
    init()
  }, [])

  const loadQueue = async () => {
    const res = await fetch('/api/agent/x')
    const data = await res.json()
    const all = data.recent || []
    setQueue(all.filter(i => i.status === 'pending'))
    setHistory(all.filter(i => i.status !== 'pending'))
  }

  useEffect(() => { if (authorized) loadQueue() }, [authorized, tab])

  const handleSearch = async () => {
    setSearching(true); setResults([])
    try {
      const body = { action: 'search', maxResults, ...(useCustom ? { customQuery: customQ } : { presetId: preset }) }
      const res = await fetch('/api/agent/x', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Search failed')
      setResults(data.tweets || [])
      showToast('Found ' + (data.tweets?.length || 0) + ' tweets with AI replies generated')
      loadQueue()
    } catch (e) { showToast(e.message, false) }
    finally { setSearching(false) }
  }

  const handlePost = async (item, isResult = false) => {
    const replyText = editId === (item.id || item.tweet?.id) ? editText : (isResult ? item.reply : item.generated_reply)
    const tweetId   = isResult ? item.tweet?.id : item.tweet_id
    const key       = item.id || item.tweet?.id
    setPosting(key)
    try {
      const res = await fetch('/api/agent/x', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'post_reply', activityId: item.id, tweetId, replyText }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Post failed')
      showToast('Reply posted to X!')
      setEditId(null); loadQueue()
    } catch (e) { showToast(e.message, false) }
    finally { setPosting(null) }
  }

  const handleReject = async (id) => {
    await fetch('/api/agent/x', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'reject', activityId: id }) })
    showToast('Rejected'); loadQueue()
  }

  const handleRegenerate = async (item, isResult = false) => {
    const key = 'regen-' + (item.id || item.tweet?.id)
    setPosting(key)
    try {
      const res = await fetch('/api/agent/x', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'regenerate', tweetText: isResult ? item.tweet?.text : item.tweet_text, tweetAuthor: isResult ? item.tweet?.author : item.tweet_author }),
      })
      const data = await res.json()
      setEditText(data.reply); setEditId(item.id || item.tweet?.id)
    } catch (e) { showToast(e.message, false) }
    finally { setPosting(null) }
  }

  if (!authorized) return null

  const card = { padding: 16, borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', marginBottom: 12 }

  const TweetCard = ({ item, isResult = false }) => {
    const tweet  = isResult ? item.tweet : { id: item.tweet_id, text: item.tweet_text, author: item.tweet_author }
    const reply  = isResult ? item.reply : item.generated_reply
    const key    = item.id || item.tweet?.id
    const isEdit = editId === key
    const chars  = (isEdit ? editText : reply)?.length || 0

    return (
      <div style={card}>
        <div style={{ marginBottom: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#1d9bf0' }}>
            @{tweet?.author || tweet?.author?.username || 'unknown'}
          </span>
          <p style={{ fontSize: 13, color: 'var(--tx)', margin: '6px 0 0', lineHeight: 1.6 }}>{tweet?.text}</p>
        </div>
        <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(99,102,241,.05)', border: '1px solid rgba(99,102,241,.15)', marginBottom: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#6366F1', marginBottom: 5 }}>ASKBIZ REPLY</div>
          {isEdit
            ? <textarea value={editText} onChange={e => setEditText(e.target.value)} rows={3} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--b)', background: 'var(--bg)', fontSize: 13, fontFamily: 'inherit', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}/>
            : <p style={{ fontSize: 13, margin: 0, lineHeight: 1.6, color: 'var(--tx)' }}>{reply}</p>
          }
          <div style={{ fontSize: 10, color: chars > 240 ? '#dc2626' : 'var(--tx3)', marginTop: 4 }}>{chars}/240 chars</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => handlePost(item, isResult)} disabled={posting === key}
            style={{ padding: '7px 16px', borderRadius: 9999, border: 'none', background: posting === key ? 'var(--b)' : '#1d9bf0', color: '#fff', fontSize: 12, fontWeight: 600, cursor: posting === key ? 'wait' : 'pointer', fontFamily: 'inherit' }}>
            {posting === key ? 'Posting...' : 'Post to X'}
          </button>
          {isEdit
            ? <button onClick={() => setEditId(null)} style={{ padding: '7px 14px', borderRadius: 9999, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx3)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
            : <button onClick={() => { setEditId(key); setEditText(reply) }} style={{ padding: '7px 14px', borderRadius: 9999, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx2)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Edit</button>
          }
          <button onClick={() => handleRegenerate(item, isResult)} disabled={posting === 'regen-' + key}
            style={{ padding: '7px 14px', borderRadius: 9999, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx2)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
            {posting === 'regen-' + key ? 'Generating...' : 'Regenerate'}
          </button>
          {!isResult && (
            <button onClick={() => handleReject(item.id)} style={{ padding: '7px 14px', borderRadius: 9999, border: '1px solid rgba(239,68,68,.3)', background: 'transparent', color: '#dc2626', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Reject</button>
          )}
          <a href={'https://x.com/i/web/status/' + tweet?.id} target="_blank" rel="noopener noreferrer"
            style={{ padding: '7px 14px', borderRadius: 9999, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx3)', fontSize: 12, textDecoration: 'none' }}>
            View tweet
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: 'clamp(16px,3vw,28px)' }}>

      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, padding: '10px 18px', borderRadius: 10, background: toast.ok ? '#16a34a' : '#dc2626', color: '#fff', fontSize: 13, fontWeight: 600, boxShadow: '0 4px 20px rgba(0,0,0,.2)' }}>
          {toast.msg}
        </div>
      )}

      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-sora)', fontSize: 22, fontWeight: 700, marginBottom: 4 }}>X Growth Agent</h1>
            <p style={{ fontSize: 13, color: 'var(--tx3)', margin: 0 }}>Search keywords · Generate AI replies that drive to askbiz.co · Post to X</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {xConnected === true && (
              <div style={{ padding: '5px 12px', borderRadius: 9999, background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.3)', fontSize: 12, fontWeight: 600, color: '#16a34a' }}>
                Connected {xUsername}
              </div>
            )}
            {xConnected === false && (
              <div style={{ padding: '5px 12px', borderRadius: 9999, background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', fontSize: 12, fontWeight: 600, color: '#dc2626' }}>
                X not connected
              </div>
            )}
            <button onClick={() => router.push('/admin/agent')} style={{ padding: '7px 14px', borderRadius: 9, border: '1px solid var(--b)', background: 'var(--sf)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--tx2)' }}>
              Back to Agent
            </button>
          </div>
        </div>

        {xConnected === false && (
          <div style={{ padding: '16px 18px', borderRadius: 12, background: 'rgba(239,68,68,.06)', border: '1px solid rgba(239,68,68,.2)', marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#dc2626', marginBottom: 8 }}>X connection failed</div>
            {xError && (
              <div style={{ fontSize: 12, color: '#dc2626', background: 'rgba(239,68,68,.08)', padding: '8px 12px', borderRadius: 8, marginBottom: 10, fontFamily: 'monospace', wordBreak: 'break-all' }}>
                {xError}
              </div>
            )}
            <div style={{ fontSize: 12, color: 'var(--tx2)', marginBottom: 8 }}>
              Make sure these 4 variables are in Vercel Environment Variables:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <code style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6, background: 'var(--ev)', color: 'var(--tx2)', display: 'block' }}>X_API_KEY</code>
              <code style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6, background: 'var(--ev)', color: 'var(--tx2)', display: 'block' }}>X_API_SECRET</code>
              <code style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6, background: 'var(--ev)', color: 'var(--tx2)', display: 'block' }}>X_ACCESS_TOKEN</code>
              <code style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6, background: 'var(--ev)', color: 'var(--tx2)', display: 'block' }}>X_ACCESS_TOKEN_SECRET</code>
            </div>
            <p style={{ fontSize: 12, color: 'var(--tx3)', margin: '10px 0 0' }}>
              After adding, go to Vercel Deployments and click Redeploy, then refresh this page.
            </p>
          </div>
        )}

        <div style={{ display: 'flex', borderBottom: '1px solid var(--b)', marginBottom: 20 }}>
          {['search', 'queue', 'history'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: '10px 18px', border: 'none', background: 'transparent', fontSize: 13, fontWeight: tab === t ? 600 : 400, color: tab === t ? '#6366F1' : 'var(--tx3)', borderBottom: tab === t ? '2px solid #6366F1' : '2px solid transparent', cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize' }}>
              {t}{t === 'queue' && queue.length > 0 ? ' (' + queue.length + ')' : ''}
            </button>
          ))}
        </div>

        {tab === 'search' && (
          <div>
            <div style={{ ...card, marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>Find tweets to reply to</div>

              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                <button onClick={() => setUseCustom(false)}
                  style={{ padding: '6px 14px', borderRadius: 9999, border: '1px solid ' + (!useCustom ? '#6366F1' : 'var(--b)'), background: !useCustom ? 'rgba(99,102,241,.08)' : 'transparent', color: !useCustom ? '#6366F1' : 'var(--tx3)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: !useCustom ? 600 : 400 }}>
                  Preset keywords
                </button>
                <button onClick={() => setUseCustom(true)}
                  style={{ padding: '6px 14px', borderRadius: 9999, border: '1px solid ' + (useCustom ? '#6366F1' : 'var(--b)'), background: useCustom ? 'rgba(99,102,241,.08)' : 'transparent', color: useCustom ? '#6366F1' : 'var(--tx3)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: useCustom ? 600 : 400 }}>
                  Custom search
                </button>
              </div>

              {!useCustom ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8, marginBottom: 14 }}>
                  {PRESETS.map(p => (
                    <button key={p.id} onClick={() => setPreset(p.id)}
                      style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid ' + (preset === p.id ? '#6366F1' : 'var(--b)'), background: preset === p.id ? 'rgba(99,102,241,.06)' : 'var(--bg)', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: preset === p.id ? '#6366F1' : 'var(--tx)', marginBottom: 2 }}>{p.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{p.desc}</div>
                    </button>
                  ))}
                </div>
              ) : (
                <textarea value={customQ} onChange={e => setCustomQ(e.target.value)} rows={2}
                  placeholder="e.g. small business cash flow struggling margins"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--b2)', background: 'var(--bg)', fontSize: 13, fontFamily: 'inherit', color: 'var(--tx)', resize: 'none', outline: 'none', boxSizing: 'border-box', marginBottom: 14 }}/>
              )}

              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <label style={{ fontSize: 12, color: 'var(--tx2)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  Results:
                  <select value={maxResults} onChange={e => setMaxResults(Number(e.target.value))}
                    style={{ padding: '4px 8px', borderRadius: 7, border: '1px solid var(--b)', background: 'var(--bg)', fontSize: 12, fontFamily: 'inherit' }}>
                    {[5, 10, 20].map(n => <option key={n}>{n}</option>)}
                  </select>
                </label>
                <button onClick={handleSearch} disabled={searching}
                  style={{ padding: '9px 20px', borderRadius: 9999, border: 'none', background: searching ? 'var(--b)' : '#6366F1', color: searching ? 'var(--tx3)' : '#fff', fontSize: 13, fontWeight: 600, cursor: searching ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                  {searching ? 'Searching...' : 'Search & Generate Replies'}
                </button>
              </div>
            </div>

            {results.length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>
                  {results.length} results — review and post
                </div>
                {results.map((item, i) => <TweetCard key={i} item={item} isResult={true}/>)}
              </div>
            )}
          </div>
        )}

        {tab === 'queue' && (
          queue.length === 0
            ? <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--tx3)' }}>No pending replies. Run a search first.</div>
            : queue.map(item => <TweetCard key={item.id} item={item}/>)
        )}

        {tab === 'history' && (
          history.length === 0
            ? <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--tx3)' }}>No history yet.</div>
            : history.map(item => (
              <div key={item.id} style={{ ...card, opacity: 0.75 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 9999, background: item.status === 'posted' ? 'rgba(34,197,94,.1)' : 'rgba(239,68,68,.1)', color: item.status === 'posted' ? '#16a34a' : '#dc2626' }}>
                    {item.status === 'posted' ? 'Posted' : 'Rejected'}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--tx3)' }}>@{item.tweet_author} · {new Date(item.created_at).toLocaleDateString()}</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--tx2)', margin: '0 0 6px', lineHeight: 1.5 }}>{item.tweet_text}</p>
                <p style={{ fontSize: 12, color: '#6366F1', margin: 0, lineHeight: 1.5, borderLeft: '2px solid #6366F1', paddingLeft: 8 }}>{item.generated_reply}</p>
              </div>
            ))
        )}

      </div>
    </div>
  )
}
