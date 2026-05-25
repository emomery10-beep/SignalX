'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const ADMIN_EMAILS = ['emomery10@gmail.com', 'emomery10@googlemail.com']

const PRESETS = [
  { id: 'sme_pain',         label: 'SME Pain Points',    query: 'small business struggling cash flow margins' },
  { id: 'shopify_problems', label: 'Shopify Problems',    query: 'shopify margins profit not making money' },
  { id: 'amazon_sellers',   label: 'Amazon Seller Pain',  query: 'amazon fba fees margins profit' },
  { id: 'ecommerce_data',   label: 'eCommerce Data Qs',   query: 'ecommerce analytics best selling product track sales' },
  { id: 'ai_business',      label: 'AI for Business',     query: 'AI small business analytics data insights founder' },
  { id: 'uk_retail',        label: 'UK Retail Pain',      query: 'UK retail shop inflation costs margins' },
]

interface AgentItem {
  id: string; run_id: string; type: 'blog' | 'thread' | 'smart_reply'
  status: 'pending' | 'published' | 'rejected'
  content: Record<string, unknown>; source_title: string; source_url: string
  source_query: string; verdict: string; verdict_sentence: string
  scenario: string; pulse_signal: string; key_insight: string; created_at: string
}

const VERDICT_STYLE = {
  act:     { bg: 'rgba(34,197,94,.1)',  border: 'rgba(34,197,94,.3)',  color: '#16a34a', label: '🟢 ACT NOW' },
  watch:   { bg: 'rgba(245,158,11,.1)', border: 'rgba(245,158,11,.3)', color: '#d97706', label: '🟡 WATCH' },
  problem: { bg: 'rgba(239,68,68,.1)',  border: 'rgba(239,68,68,.3)',  color: '#dc2626', label: '🔴 ACTION NEEDED' },
}

export default function AgentAdminPage() {
  const router = useRouter()
  const supabase = createClient()
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading]       = useState(true)
  const [mainTab, setMainTab]       = useState<'agent'|'x'>('agent')

  // Agent state
  const [items, setItems]           = useState<AgentItem[]>([])
  const [filter, setFilter]         = useState<'pending'|'published'|'rejected'|'all'>('pending')
  const [running, setRunning]       = useState(false)
  const [runLog, setRunLog]         = useState<string[]>([])
  const [actionLoading, setActionLoading] = useState<string|null>(null)
  const [expandedId, setExpandedId] = useState<string|null>(null)

  // X agent state
  const [xConnected, setXConnected] = useState<boolean|null>(null)
  const [xUsername, setXUsername]   = useState('')
  const [xTab, setXTab]             = useState<'search'|'queue'|'history'|'results'>('search')
  const [preset, setPreset]         = useState('sme_pain')
  const [customQuery, setCustomQuery] = useState('')
  const [useCustom, setUseCustom]   = useState(false)
  const [maxResults, setMaxResults] = useState(10)
  const [searching, setSearching]   = useState(false)
  const [xResults, setXResults]     = useState<any[]>([])
  const [xQueue, setXQueue]         = useState<any[]>([])
  const [xHistory, setXHistory]     = useState<any[]>([])
  const [editId, setEditId]         = useState<string|null>(null)
  const [editText, setEditText]     = useState('')
  const [posting, setPosting]       = useState<string|null>(null)

  const [toast, setToast] = useState<{msg:string;ok:boolean}|null>(null)
  const showToast = (msg: string, ok = true) => { setToast({msg,ok}); setTimeout(()=>setToast(null), 3500) }

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !ADMIN_EMAILS.includes(user.email || '')) { router.push('/'); return }
      setAuthorized(true); setLoading(false)
      setXResults([]) // Clear stale results
      // Check X connection
      const res = await fetch('/api/xagent?action=validate')
      const d = await res.json()
      setXConnected(d.valid)
      if (d.username) setXUsername('@' + d.username)
    }
    check()
  }, [])

  const loadItems = useCallback(async () => {
    const q = supabase.from('agent_content').select('*').order('created_at', { ascending: false })
    if (filter !== 'all') q.eq('status', filter)
    const { data } = await q.limit(50)
    setItems((data || []) as AgentItem[])
  }, [filter])

  useEffect(() => { if (authorized) loadItems() }, [authorized, loadItems])

  const loadXQueue = async () => {
    const res = await fetch('/api/xagent')
    const d = await res.json()
    const all = d.recent || []
    setXQueue(all.filter((i: any) => i.status === 'pending'))
    setXHistory(all.filter((i: any) => i.status !== 'pending'))
  }

  useEffect(() => { if (authorized && mainTab === 'x' && xTab === 'queue') loadXQueue() }, [authorized, mainTab, xTab])

  const runAgent = async () => {
    setRunning(true); setRunLog(['Starting agent...'])
    try {
      const res = await fetch('/api/agent?secret=dev-test')
      const data = await res.json()
      setRunLog(data.log || [String(data.error || 'Unknown error')])
      if (data.success) { showToast(`Agent complete — ${data.itemsSaved} items saved`); loadItems() }
      else showToast('Agent failed — check log', false)
    } catch (e) { setRunLog([`Error: ${String(e)}`]); showToast('Agent failed', false) }
    finally { setRunning(false) }
  }

  const handleAction = async (id: string, action: 'approve'|'reject') => {
    setActionLoading(id)
    try {
      const res = await fetch('/api/agent/approve', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({id, action}) })
      const data = await res.json()
      if (data.success) { showToast(action === 'approve' ? '✅ Approved' : '🗑 Rejected'); loadItems() }
      else showToast(data.error || 'Failed', false)
    } catch (e) { showToast(String(e), false) }
    finally { setActionLoading(null) }
  }

  const handleXSearch = async () => {
    setSearching(true); setXResults([])
    try {
      const body = { action:'search', maxResults, ...(useCustom ? {customQuery} : {presetId:preset}) }
      const res = await fetch('/api/xagent', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || 'Search failed')
      setXResults(d.tweets || [])
      setXTab('results')
      showToast(`Generated ${d.tweets?.length || 0} original posts`)
      loadXQueue()
    } catch (e: any) { showToast(e.message, false) }
    finally { setSearching(false) }
  }

  const handleXPost = async (item: any, isResult = false) => {
    // Get the reply text — for results use item.reply, for queue use item.generated_reply
    const replyText = isResult ? item.reply : item.generated_reply
    if (!replyText || replyText.trim().length === 0) {
      showToast('No reply text to post', false)
      return
    }
    const tweetId = isResult ? null : (item.tweet_id || null)
    const activityId = isResult ? null : item.id
    const postKey = item.id || item.reply?.slice(0,20) || 'posting'
    setPosting(postKey)
    try {
      const res = await fetch('/api/xagent', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({action:'post_reply', activityId, tweetId, replyText})
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || 'Post failed')
      const postedId = d.postedId
      showToast('Posted to X! 🐦')
      setEditId(null)
      if (isResult) {
        // Update item with posted ID so View link appears
        setXResults(prev => prev.map(r => r.reply === replyText ? {...r, postedId} : r))
      } else loadXQueue()
    } catch (e: any) { showToast(e.message, false) }
    finally { setPosting(null) }
  }

  const handleXReject = async (id: string) => {
    await fetch('/api/xagent', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({action:'reject', activityId:id}) })
    showToast('Rejected'); loadXQueue()
  }

  const handleXRegen = async (item: any, isResult = false) => {
    const key = 'regen-' + (isResult ? item.tweet?.id : item.id)
    setPosting(key)
    try {
      const res = await fetch('/api/xagent', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({action:'regenerate', tweetText:isResult?item.tweet?.text:item.tweet_text, tweetAuthor:isResult?item.tweet?.author:item.tweet_author}) })
      const d = await res.json()
      setEditText(d.reply); setEditId(isResult ? item.tweet?.id : item.id)
    } catch (e: any) { showToast(e.message, false) }
    finally { setPosting(null) }
  }

  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',color:'var(--tx3)',fontSize:14}}>Checking access…</div>
  if (!authorized) return null

  const runs = items.reduce<Record<string, AgentItem[]>>((acc, item) => {
    if (!acc[item.run_id]) acc[item.run_id] = []
    acc[item.run_id].push(item)
    return acc
  }, {})

  const cs = { padding:'10px 12px', borderRadius:10, background:'rgba(99,102,241,.05)', border:'1px solid rgba(99,102,241,.15)', marginBottom:10 } as const
  const card = { padding:16, borderRadius:14, border:'1px solid var(--b)', background:'var(--sf)', marginBottom:12 } as const

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',padding:'24px',fontFamily:'var(--font-dm,DM Sans,sans-serif)'}}>
      {toast && <div style={{position:'fixed',top:16,right:16,zIndex:999,padding:'10px 16px',borderRadius:10,background:toast.ok?'rgba(34,197,94,.15)':'rgba(239,68,68,.15)',border:`1px solid ${toast.ok?'rgba(34,197,94,.3)':'rgba(239,68,68,.3)'}`,color:toast.ok?'#16a34a':'#dc2626',fontSize:13,fontWeight:500}}>{toast.msg}</div>}

      <div style={{maxWidth:900,margin:'0 auto'}}>
        {/* Header */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24,flexWrap:'wrap',gap:12}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:4}}>
              <h1 style={{fontSize:20,fontWeight:700,fontFamily:'var(--font-sora)',margin:0}}>Growth Agent</h1>
              <span style={{fontSize:11,padding:'2px 8px',borderRadius:9999,background:'rgba(99,102,241,.1)',color:'#6366F1',fontWeight:600}}>Admin Only</span>
            </div>
            <p style={{fontSize:13,color:'var(--tx3)',margin:0}}>Runs daily at 6am UTC · Scout → Analyse → Write → Review</p>
          </div>
          <button onClick={runAgent} disabled={running} style={{display:'flex',alignItems:'center',gap:7,padding:'10px 18px',borderRadius:9999,border:'none',background:running?'var(--b)':'#6366F1',color:running?'var(--tx3)':'#fff',fontSize:13,fontWeight:600,cursor:running?'wait':'pointer',fontFamily:'inherit'}}>
            {running ? 'Running…' : 'Run Agent Now'}
          </button>
        </div>

        {/* Main tabs */}
        <div className="tab-strip" style={{borderBottom:'1px solid var(--b)',marginBottom:24}}>
          {(['agent','x'] as const).map(t => (
            <button key={t} onClick={()=>setMainTab(t)} style={{padding:'10px 20px',border:'none',background:'transparent',fontSize:13,fontWeight:mainTab===t?600:400,color:mainTab===t?'#6366F1':'var(--tx3)',borderBottom:mainTab===t?'2px solid #6366F1':'2px solid transparent',cursor:'pointer',fontFamily:'inherit',flexShrink:0,whiteSpace:'nowrap'}}>
              {t === 'agent' ? '📊 Content Agent' : '𝕏 X Agent' + (xConnected===true?' ✓':'')}
            </button>
          ))}
        </div>

        {/* ── AGENT TAB ── */}
        {mainTab === 'agent' && (
          <>
            {runLog.length > 0 && <div style={{marginBottom:20,padding:'14px 16px',borderRadius:12,background:'var(--ev)',border:'1px solid var(--b)',fontSize:12,fontFamily:'monospace',color:'var(--tx2)',maxHeight:200,overflowY:'auto'}}>{runLog.map((l,i)=><div key={i}>{l}</div>)}</div>}
            <div style={{display:'flex',gap:8,marginBottom:20}}>
              {(['pending','published','rejected','all'] as const).map(f => (
                <button key={f} onClick={()=>setFilter(f)} style={{padding:'6px 14px',borderRadius:9999,border:`1px solid ${filter===f?'#6366F1':'var(--b2)'}`,background:filter===f?'rgba(99,102,241,.1)':'transparent',color:filter===f?'#6366F1':'var(--tx3)',fontSize:12,fontWeight:filter===f?600:400,cursor:'pointer',fontFamily:'inherit',textTransform:'capitalize'}}>{f}</button>
              ))}
            </div>
            {Object.keys(runs).length === 0 && <div style={{textAlign:'center',padding:'60px 0',color:'var(--tx3)',fontSize:14}}>No content yet — run the agent to generate your first batch.</div>}
            {Object.entries(runs).map(([runId, runItems]) => {
              const fi = runItems[0]
              const vs = fi.verdict ? VERDICT_STYLE[fi.verdict as keyof typeof VERDICT_STYLE] : null
              return (
                <div key={runId} style={{marginBottom:24,borderRadius:16,border:'1px solid var(--b)',overflow:'hidden',background:'var(--sf)'}}>
                  <div style={{padding:'14px 16px',borderBottom:'1px solid var(--b)',background:'var(--ev)'}}>
                    <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:600,color:'var(--tx)',marginBottom:4,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{fi.source_title||'Agent Run'}</div>
                        <div style={{fontSize:11,color:'var(--tx3)'}}>{new Date(fi.created_at).toLocaleString('en-GB')} · Query: "{fi.source_query}"</div>
                      </div>
                      {vs && <span style={{fontSize:11,fontWeight:600,color:vs.color,background:vs.bg,border:`1px solid ${vs.border}`,padding:'3px 10px',borderRadius:9999,flexShrink:0}}>{vs.label}</span>}
                    </div>
                    {fi.verdict_sentence && <div style={{marginTop:8,fontSize:12,color:'var(--tx2)',fontStyle:'italic'}}>"{fi.verdict_sentence}"</div>}
                  </div>
                  {runItems.map(item => (
                    <div key={item.id} style={{borderBottom:'1px solid var(--b)'}}>
                      <div onClick={()=>setExpandedId(expandedId===item.id?null:item.id)} style={{padding:'12px 16px',display:'flex',alignItems:'center',gap:10,cursor:'pointer',userSelect:'none'}} onMouseEnter={e=>e.currentTarget.style.background='var(--ev)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                        <span style={{fontSize:11,fontWeight:600,padding:'2px 8px',borderRadius:6,background:item.type==='blog'?'rgba(99,102,241,.1)':item.type==='thread'?'rgba(34,197,94,.1)':'rgba(245,158,11,.1)',color:item.type==='blog'?'#6366F1':item.type==='thread'?'#16a34a':'#d97706',textTransform:'uppercase',letterSpacing:'.06em'}}>
                          {item.type==='blog'?'📝 Blog':item.type==='thread'?'🧵 Thread':'💬 Replies'}
                        </span>
                        <span style={{fontSize:11,color:item.status==='pending'?'#d97706':item.status==='published'?'#16a34a':'#94a3b8',fontWeight:500}}>
                          {item.status==='pending'?'⏳ Pending':item.status==='published'?'✅ Published':'🗑 Rejected'}
                        </span>
                        <span style={{fontSize:12,color:'var(--tx3)',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                          {item.type==='blog'?(item.content as any).title||'Blog post':item.type==='thread'?`${(item.content as any).tweets?.[0]?.text?.slice(0,60)||'Thread'}…`:`${(item.content as any).replies?.length||0} smart replies`}
                        </span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2" strokeLinecap="round" style={{transform:expandedId===item.id?'rotate(180deg)':'none',transition:'transform 150ms'}}><path d="M6 9l6 6 6-6"/></svg>
                      </div>
                      {expandedId === item.id && (
                        <div style={{padding:'0 16px 16px'}}>
                          <div style={{padding:12,borderRadius:10,background:'var(--bg)',border:'1px solid var(--b)',fontSize:12,color:'var(--tx2)',lineHeight:1.6,maxHeight:320,overflowY:'auto',fontFamily:'monospace',marginBottom:12,whiteSpace:'pre-wrap',wordBreak:'break-word'}}>{JSON.stringify(item.content,null,2)}</div>
                          {item.status==='pending' && (
                            <div style={{display:'flex',gap:8}}>
                              <button onClick={()=>handleAction(item.id,'approve')} disabled={actionLoading===item.id} style={{flex:1,padding:'9px',borderRadius:9,border:'none',background:'#6366F1',color:'#fff',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{actionLoading===item.id?'Processing…':item.type==='blog'?'✅ Approve & Add to Blog':'✅ Approve'}</button>
                              <button onClick={()=>handleAction(item.id,'reject')} disabled={actionLoading===item.id} style={{padding:'9px 16px',borderRadius:9,border:'1px solid var(--b2)',background:'transparent',color:'var(--tx3)',fontSize:13,cursor:'pointer',fontFamily:'inherit'}}>Reject</button>
                              {item.source_url && <a href={item.source_url} target="_blank" rel="noopener noreferrer" style={{padding:'9px 14px',borderRadius:9,border:'1px solid var(--b2)',background:'transparent',color:'var(--tx3)',fontSize:12,textDecoration:'none',display:'flex',alignItems:'center'}}>Source ↗</a>}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            })}
          </>
        )}

        {/* ── X AGENT TAB ── */}
        {mainTab === 'x' && (
          <>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20,flexWrap:'wrap'}}>
              {xConnected===null && <span style={{fontSize:12,color:'var(--tx3)'}}>Checking X connection...</span>}
              {xConnected===true && <div style={{padding:'5px 12px',borderRadius:9999,background:'rgba(34,197,94,.1)',border:'1px solid rgba(34,197,94,.3)',fontSize:12,fontWeight:600,color:'#16a34a'}}>✓ Connected {xUsername}</div>}
              {xConnected===false && <div style={{padding:'5px 12px',borderRadius:9999,background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.3)',fontSize:12,fontWeight:600,color:'#dc2626'}}>X not connected v2</div>}
            </div>

            <div className="tab-strip" style={{borderBottom:'1px solid var(--b)',marginBottom:20}}>
              {(['search','results','queue','history'] as const).map(t => (
                <button key={t} onClick={()=>setXTab(t)} style={{padding:'8px 16px',border:'none',background:'transparent',fontSize:12,fontWeight:xTab===t?600:400,color:xTab===t?'#6366F1':'var(--tx3)',borderBottom:xTab===t?'2px solid #6366F1':'2px solid transparent',cursor:'pointer',fontFamily:'inherit',textTransform:'capitalize',flexShrink:0,whiteSpace:'nowrap'}}>
                  {t}{t==='queue'&&xQueue.length>0?` (${xQueue.length})`:''}
                </button>
              ))}
            </div>

            {xTab === 'search' && (
              <>
                <div style={{...card,marginBottom:16}}>
                  <div style={{fontSize:12,fontWeight:700,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:12}}>Keyword strategy</div>
                  <div style={{display:'flex',gap:8,marginBottom:14}}>
                    {['preset','custom'].map(m => (
                      <button key={m} onClick={()=>setUseCustom(m==='custom')} style={{padding:'5px 12px',borderRadius:9999,border:`1px solid ${useCustom===(m==='custom')?'#6366F1':'var(--b)'}`,background:useCustom===(m==='custom')?'rgba(99,102,241,.08)':'transparent',color:useCustom===(m==='custom')?'#6366F1':'var(--tx3)',fontSize:12,cursor:'pointer',fontFamily:'inherit'}}>
                        {m==='preset'?'Use preset':'Custom query'}
                      </button>
                    ))}
                  </div>
                  {!useCustom ? (
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:8,marginBottom:14}}>
                      {PRESETS.map(p => (
                        <button key={p.id} onClick={()=>setPreset(p.id)} style={{padding:'8px 10px',borderRadius:9,border:`1px solid ${preset===p.id?'#6366F1':'var(--b)'}`,background:preset===p.id?'rgba(99,102,241,.06)':'var(--bg)',textAlign:'left',cursor:'pointer',fontFamily:'inherit',fontSize:12,fontWeight:preset===p.id?600:400,color:preset===p.id?'#6366F1':'var(--tx)'}}>
                          {p.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <textarea value={customQuery} onChange={e=>setCustomQuery(e.target.value)} rows={2} placeholder="small business struggling margins" style={{width:'100%',padding:'8px 10px',borderRadius:9,border:'1px solid var(--b)',background:'var(--bg)',fontSize:13,fontFamily:'inherit',color:'var(--tx)',resize:'vertical',outline:'none',boxSizing:'border-box',marginBottom:14}}/>
                  )}
                  <div style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap'}}>
                    <label style={{fontSize:12,color:'var(--tx2)',display:'flex',alignItems:'center',gap:6}}>
                      Results: <select value={maxResults} onChange={e=>setMaxResults(Number(e.target.value))} style={{padding:'3px 6px',borderRadius:6,border:'1px solid var(--b)',background:'var(--bg)',fontSize:12,fontFamily:'inherit'}}>{[5,10,20].map(n=><option key={n}>{n}</option>)}</select>
                    </label>
                    <button onClick={handleXSearch} disabled={searching} style={{padding:'8px 18px',borderRadius:9999,border:'none',background:searching?'var(--b)':'#6366F1',color:searching?'var(--tx3)':'#fff',fontSize:13,fontWeight:600,cursor:searching?'not-allowed':'pointer',fontFamily:'inherit'}}>
                      {searching?'Searching...':'Search & Generate Replies'}
                    </button>
                  </div>
                </div>
                {xResults.filter((item: any) => item.reply && item.reply.trim().length > 0).map((item: any, i: number) => (
                  <div key={i} style={card}>
                    <div style={{marginBottom:10}}>
                      <span style={{fontSize:12,fontWeight:600,color:'var(--tx2)'}}>@{item.tweet?.author}</span>
                      <p style={{fontSize:13,color:'var(--tx)',margin:'6px 0 0',lineHeight:1.6}}>{item.tweet?.text}</p>
                    </div>
                    <div style={cs}>
                      <div style={{fontSize:10,fontWeight:700,color:'#6366F1',marginBottom:4}}>AI REPLY</div>
                      {editId===item.tweet?.id ? <textarea value={editText} onChange={e=>setEditText(e.target.value)} rows={2} style={{width:'100%',padding:8,borderRadius:8,border:'1px solid var(--b)',background:'var(--bg)',fontSize:13,fontFamily:'inherit',outline:'none',boxSizing:'border-box'}}/> : <p style={{fontSize:13,margin:0,lineHeight:1.6,color:'var(--tx)'}}>{item.reply}</p>}
                      <div style={{fontSize:10,color:'var(--tx3)',marginTop:4}}>{(editId===item.tweet?.id?editText:item.reply)?.length||0}/255</div>
                    </div>
                    <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                      <button onClick={()=>handleXPost(item,true)} disabled={posting===item.tweet?.id} style={{padding:'6px 14px',borderRadius:9999,border:'none',background:'#1d9bf0',color:'#fff',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{posting===item.tweet?.id?'Posting...':'Post Reply'}</button>
                      <button onClick={()=>{setEditId(item.tweet?.id);setEditText(item.reply)}} style={{padding:'6px 12px',borderRadius:9999,border:'1px solid var(--b)',background:'transparent',color:'var(--tx2)',fontSize:12,cursor:'pointer',fontFamily:'inherit'}}>Edit</button>
                      <button onClick={()=>handleXRegen(item,true)} style={{padding:'6px 12px',borderRadius:9999,border:'1px solid var(--b)',background:'transparent',color:'var(--tx2)',fontSize:12,cursor:'pointer',fontFamily:'inherit'}}>Regenerate</button>
                      {item.tweet?.id && item.tweet.id !== 'null' && <a href={'https://x.com/i/web/status/'+item.tweet.id} target="_blank" rel="noopener noreferrer" style={{padding:'6px 12px',borderRadius:9999,border:'1px solid var(--b)',background:'transparent',color:'var(--tx3)',fontSize:12,textDecoration:'none'}}>View</a>}
                    </div>
                  </div>
                ))}
              </>
            )}

            {xTab === 'results' && (
              xResults.length === 0
                ? <div style={{textAlign:'center',padding:'40px 0',color:'var(--tx3)'}}>No results yet. Run a search to generate posts.</div>
                : xResults.map((item, i) => (
                  <div key={i} style={{padding:16,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)',marginBottom:12}}>
                    <div style={{marginBottom:8}}>
                      <span style={{fontSize:11,fontWeight:600,color:'#6366F1',background:'rgba(99,102,241,.08)',padding:'2px 8px',borderRadius:9999}}>Original post</span>
                      <p style={{fontSize:13,color:'var(--tx)',margin:'8px 0 0',lineHeight:1.6}}>{item.reply}</p>
                    </div>
                    <div style={{fontSize:10,color:'var(--tx3)',marginBottom:10}}>{item.reply?.length||0}/255 characters</div>
                    <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                      <button onClick={()=>handleXPost(item,true)} disabled={posting===item.tweet?.id} style={{padding:'6px 14px',borderRadius:9999,border:'none',background:'#1d9bf0',color:'#fff',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>
                        {posting===item.tweet?.id?'Posting...':'Post to X'}
                      </button>
                      <button onClick={()=>{setEditId(item.tweet?.id);setEditText(item.reply)}} style={{padding:'6px 12px',borderRadius:9999,border:'1px solid var(--b)',background:'transparent',color:'var(--tx2)',fontSize:12,cursor:'pointer',fontFamily:'inherit'}}>Edit</button>
                      <button onClick={()=>handleXRegen(item,true)} style={{padding:'6px 12px',borderRadius:9999,border:'1px solid var(--b)',background:'transparent',color:'var(--tx2)',fontSize:12,cursor:'pointer',fontFamily:'inherit'}}>Regenerate</button>
                      {item.postedId && <a href={'https://x.com/i/web/status/'+item.postedId} target="_blank" rel="noopener noreferrer" style={{padding:'6px 12px',borderRadius:9999,border:'1px solid var(--b)',background:'transparent',color:'#1d9bf0',fontSize:12,fontWeight:600,textDecoration:'none'}}>✓ View on X ↗</a>}
                    </div>
                  </div>
                ))
            )}

            {xTab === 'queue' && (
              xQueue.length===0 ? <div style={{textAlign:'center',padding:'40px 0',color:'var(--tx3)'}}>No pending posts. Run a search to generate new ones.</div> :
              <>
              <div style={{display:'flex',justifyContent:'flex-end',marginBottom:10}}>
                <button onClick={async()=>{
                  if(!confirm('Clear all pending posts from queue?')) return
                  await fetch('/api/xagent',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'clear_queue'})})
                  setXQueue([])
                  showToast('Queue cleared')
                }} style={{padding:'6px 14px',borderRadius:9999,border:'1px solid rgba(239,68,68,.3)',background:'transparent',color:'#dc2626',fontSize:12,cursor:'pointer',fontFamily:'inherit'}}>
                  🗑 Clear queue
                </button>
              </div>
              {xQueue.map(item => (
                <div key={item.id} style={card}>
                  <div style={{marginBottom:10}}>
                    <span style={{fontSize:12,fontWeight:600,color:'var(--tx2)'}}>@{item.tweet_author}</span>
                    <p style={{fontSize:13,color:'var(--tx)',margin:'6px 0 0',lineHeight:1.6}}>{item.tweet_text}</p>
                  </div>
                  <div style={cs}>
                    <div style={{fontSize:10,fontWeight:700,color:'#6366F1',marginBottom:4}}>AI REPLY</div>
                    {editId===item.id ? <textarea value={editText} onChange={e=>setEditText(e.target.value)} rows={2} style={{width:'100%',padding:8,borderRadius:8,border:'1px solid var(--b)',background:'var(--bg)',fontSize:13,fontFamily:'inherit',outline:'none',boxSizing:'border-box'}}/> : <p style={{fontSize:13,margin:0,lineHeight:1.6,color:'var(--tx)'}}>{item.generated_reply}</p>}
                    <div style={{fontSize:10,color:'var(--tx3)',marginTop:4}}>{(editId===item.id?editText:item.generated_reply)?.length||0}/255</div>
                  </div>
                  <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                    <button onClick={()=>handleXPost(item)} disabled={posting===item.id} style={{padding:'6px 14px',borderRadius:9999,border:'none',background:'#1d9bf0',color:'#fff',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{posting===item.id?'Posting...':'Post Reply'}</button>
                    <button onClick={()=>{setEditId(item.id);setEditText(item.generated_reply)}} style={{padding:'6px 12px',borderRadius:9999,border:'1px solid var(--b)',background:'transparent',color:'var(--tx2)',fontSize:12,cursor:'pointer',fontFamily:'inherit'}}>Edit</button>
                    <button onClick={()=>handleXRegen(item)} style={{padding:'6px 12px',borderRadius:9999,border:'1px solid var(--b)',background:'transparent',color:'var(--tx2)',fontSize:12,cursor:'pointer',fontFamily:'inherit'}}>Regenerate</button>
                    <button onClick={()=>handleXReject(item.id)} style={{padding:'6px 12px',borderRadius:9999,border:'1px solid rgba(239,68,68,.3)',background:'transparent',color:'#dc2626',fontSize:12,cursor:'pointer',fontFamily:'inherit'}}>Reject</button>
                    {item.tweet_id && item.tweet_id !== 'null' && <a href={'https://x.com/i/web/status/'+item.tweet_id} target="_blank" rel="noopener noreferrer" style={{padding:'6px 12px',borderRadius:9999,border:'1px solid var(--b)',background:'transparent',color:'var(--tx3)',fontSize:12,textDecoration:'none'}}>View on X</a>}
                  </div>
                </div>
              ))}
              </>
            )}

            {xTab === 'history' && (
              xHistory.length===0 ? <div style={{textAlign:'center',padding:'40px 0',color:'var(--tx3)'}}>No history yet.</div> :
              xHistory.map(item => (
                <div key={item.id} style={{...card,opacity:0.8}}>
                  <div style={{display:'flex',gap:8,marginBottom:8}}>
                    <span style={{fontSize:11,fontWeight:600,padding:'2px 8px',borderRadius:9999,background:item.status==='posted'?'rgba(34,197,94,.1)':'rgba(239,68,68,.1)',color:item.status==='posted'?'#16a34a':'#dc2626'}}>{item.status==='posted'?'Posted':'Rejected'}</span>
                    <span style={{fontSize:11,color:'var(--tx3)'}}>@{item.tweet_author} · {new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                  <p style={{fontSize:12,color:'var(--tx2)',margin:'0 0 6px',lineHeight:1.5}}>{item.tweet_text}</p>
                  <p style={{fontSize:12,color:'#6366F1',margin:0,lineHeight:1.5,borderLeft:'2px solid #6366F1',paddingLeft:8}}>{item.generated_reply}</p>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  )
}
