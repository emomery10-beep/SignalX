'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const ADMIN_EMAILS = ['emomery10@gmail.com', 'emomery10@googlemail.com']
const PRESETS = [
  { id:'sme_pain',         label:'SME Pain Points',    desc:'Founders talking about business problems' },
  { id:'shopify_problems', label:'Shopify Problems',    desc:'Shopify sellers with margin issues' },
  { id:'amazon_sellers',   label:'Amazon Seller Pain',  desc:'FBA sellers frustrated with fees' },
  { id:'ecommerce_data',   label:'eCommerce Data Qs',   desc:'Sellers asking data questions' },
  { id:'ai_business',      label:'AI for Business',     desc:'People exploring AI for business' },
  { id:'uk_retail',        label:'UK Retail Pain',      desc:'UK retailers struggling' },
]

export default function XAgentPage() {
  const router = useRouter()
  const supabase = createClient()
  const [authorized, setAuthorized] = useState(false)
  const [connected, setConnected]   = useState<boolean|null>(null)
  const [username, setUsername]      = useState('')
  const [connError, setConnError]    = useState('')
  const [tab, setTab]                = useState('search')
  const [preset, setPreset]          = useState('sme_pain')
  const [custom, setCustom]          = useState('')
  const [useCustom, setUseCustom]    = useState(false)
  const [maxResults, setMaxResults]  = useState(10)
  const [searching, setSearching]    = useState(false)
  const [results, setResults]        = useState([])
  const [queue, setQueue]            = useState([])
  const [history, setHistory]        = useState([])
  const [editId, setEditId]          = useState(null)
  const [editText, setEditText]      = useState('')
  const [posting, setPosting]        = useState(null)
  const [toast, setToast]            = useState(null)

  const showToast = (msg, ok=true) => { setToast({msg,ok}); setTimeout(()=>setToast(null),3500) }

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !ADMIN_EMAILS.includes(user.email||'')) { router.push('/'); return }
      setAuthorized(true)
      const res = await fetch('/api/xagent?action=validate')
      const d = await res.json()
      setConnected(d.valid)
      if (d.username) setUsername('@'+d.username)
      if (d.error) setConnError(d.error)
    }
    init()
  }, [])

  const loadQueue = async () => {
    const res = await fetch('/api/xagent')
    const d = await res.json()
    const all = d.recent || []
    setQueue(all.filter(i => i.status==='pending'))
    setHistory(all.filter(i => i.status!=='pending'))
  }

  useEffect(() => { if (authorized) loadQueue() }, [authorized, tab])

  const handleSearch = async () => {
    setSearching(true); setResults([])
    try {
      const body = { action:'search', maxResults, ...(useCustom?{customQuery:custom}:{presetId:preset}) }
      const res = await fetch('/api/xagent', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error||'Search failed')
      setResults(d.tweets||[])
      showToast('Found '+(d.tweets?.length||0)+' tweets')
      loadQueue()
    } catch(e) { showToast(e.message, false) }
    finally { setSearching(false) }
  }

  const handlePost = async (item, isResult=false) => {
    const reply = editId===(isResult?item.tweet?.id:item.id) ? editText : (isResult?item.reply:item.generated_reply)
    const tweetId = isResult?item.tweet?.id:item.tweet_id
    const activityId = isResult?null:item.id
    setPosting(isResult?item.tweet?.id:item.id)
    try {
      const res = await fetch('/api/xagent', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ action:'post_reply', activityId, tweetId, replyText:reply }) })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error||'Post failed')
      showToast('Reply posted to X!')
      setEditId(null); loadQueue()
    } catch(e) { showToast(e.message, false) }
    finally { setPosting(null) }
  }

  const handleReject = async (id) => {
    await fetch('/api/xagent', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({action:'reject',activityId:id}) })
    showToast('Rejected'); loadQueue()
  }

  const handleRegen = async (item, isResult=false) => {
    setPosting('regen-'+(isResult?item.tweet?.id:item.id))
    try {
      const res = await fetch('/api/xagent', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({action:'regenerate',tweetText:isResult?item.tweet?.text:item.tweet_text,tweetAuthor:isResult?item.tweet?.author:item.tweet_author}) })
      const d = await res.json()
      setEditText(d.reply); setEditId(isResult?item.tweet?.id:item.id)
    } catch(e) { showToast(e.message, false) }
    finally { setPosting(null) }
  }

  if (!authorized) return null

  const s = { card:{ padding:16, borderRadius:14, border:'1px solid var(--b)', background:'var(--sf)', marginBottom:12 } }

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',padding:'clamp(16px,3vw,28px)'}}>
      {toast&&<div style={{position:'fixed',top:20,right:20,zIndex:999,padding:'10px 18px',borderRadius:10,background:toast.ok?'#16a34a':'#dc2626',color:'#fff',fontSize:13,fontWeight:600}}>{toast.msg}</div>}
      <div style={{maxWidth:900,margin:'0 auto'}}>

        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24,flexWrap:'wrap',gap:12}}>
          <div>
            <h1 style={{fontFamily:'var(--font-sora)',fontSize:22,fontWeight:700,marginBottom:4}}>X Growth Agent</h1>
            <p style={{fontSize:13,color:'var(--tx3)',margin:0}}>Search keywords · Generate AI replies · Post to X</p>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            {connected===null&&<span style={{fontSize:12,color:'var(--tx3)'}}>Checking...</span>}
            {connected===true&&<div style={{padding:'5px 12px',borderRadius:9999,background:'rgba(34,197,94,.1)',border:'1px solid rgba(34,197,94,.3)',fontSize:12,fontWeight:600,color:'#16a34a'}}>✓ Connected {username}</div>}
            {connected===false&&<div style={{padding:'5px 12px',borderRadius:9999,background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.3)',fontSize:12,fontWeight:600,color:'#dc2626'}} title={connError}>X not connected</div>}
            <button onClick={()=>router.push('/admin/agent')} style={{padding:'7px 14px',borderRadius:9,border:'1px solid var(--b)',background:'var(--sf)',fontSize:12,cursor:'pointer',fontFamily:'inherit',color:'var(--tx2)'}}>← Back</button>
          </div>
        </div>

        {connected===false&&connError&&(
          <div style={{padding:'12px 16px',borderRadius:12,background:'rgba(239,68,68,.06)',border:'1px solid rgba(239,68,68,.2)',marginBottom:16,fontSize:12,color:'#dc2626',fontFamily:'monospace'}}>{connError}</div>
        )}

        <div style={{display:'flex',borderBottom:'1px solid var(--b)',marginBottom:20}}>
          {['search','queue','history'].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:'10px 18px',border:'none',background:'transparent',fontSize:13,fontWeight:tab===t?600:400,color:tab===t?'#6366F1':'var(--tx3)',borderBottom:tab===t?'2px solid #6366F1':'2px solid transparent',cursor:'pointer',fontFamily:'inherit',textTransform:'capitalize'}}>
              {t}{t==='queue'&&queue.length>0?' ('+queue.length+')':''}
            </button>
          ))}
        </div>

        {tab==='search'&&(
          <div>
            <div style={{...s.card,marginBottom:16}}>
              <div style={{fontSize:12,fontWeight:700,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:12}}>Keyword strategy</div>
              <div style={{display:'flex',gap:8,marginBottom:14}}>
                {['preset','custom'].map(m=>(
                  <button key={m} onClick={()=>setUseCustom(m==='custom')} style={{padding:'6px 14px',borderRadius:9999,border:'1px solid '+(useCustom===(m==='custom')?'#6366F1':'var(--b)'),background:useCustom===(m==='custom')?'rgba(99,102,241,.08)':'transparent',color:useCustom===(m==='custom')?'#6366F1':'var(--tx3)',fontSize:12,cursor:'pointer',fontFamily:'inherit',fontWeight:useCustom===(m==='custom')?600:400}}>
                    {m==='preset'?'Use preset':'Custom query'}
                  </button>
                ))}
              </div>
              {!useCustom?(
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:8,marginBottom:14}}>
                  {PRESETS.map(p=>(
                    <button key={p.id} onClick={()=>setPreset(p.id)} style={{padding:'10px 12px',borderRadius:10,border:'1px solid '+(preset===p.id?'#6366F1':'var(--b)'),background:preset===p.id?'rgba(99,102,241,.06)':'var(--bg)',textAlign:'left',cursor:'pointer',fontFamily:'inherit'}}>
                      <div style={{fontSize:13,fontWeight:600,color:preset===p.id?'#6366F1':'var(--tx)',marginBottom:2}}>{p.label}</div>
                      <div style={{fontSize:11,color:'var(--tx3)'}}>{p.desc}</div>
                    </button>
                  ))}
                </div>
              ):(
                <textarea value={custom} onChange={e=>setCustom(e.target.value)} rows={3} placeholder="small business struggling margins -is:retweet" style={{width:'100%',padding:'10px 12px',borderRadius:10,border:'1px solid var(--b)',background:'var(--bg)',fontSize:13,fontFamily:'inherit',color:'var(--tx)',resize:'vertical',outline:'none',boxSizing:'border-box',marginBottom:14}}/>
              )}
              <div style={{display:'flex',gap:12,alignItems:'center',flexWrap:'wrap'}}>
                <label style={{fontSize:12,color:'var(--tx2)',display:'flex',alignItems:'center',gap:6}}>
                  Results: <select value={maxResults} onChange={e=>setMaxResults(Number(e.target.value))} style={{padding:'4px 8px',borderRadius:7,border:'1px solid var(--b)',background:'var(--bg)',fontSize:12,fontFamily:'inherit'}}>{[5,10,20].map(n=><option key={n}>{n}</option>)}</select>
                </label>
                <button onClick={handleSearch} disabled={searching} style={{padding:'9px 20px',borderRadius:9999,border:'none',background:searching?'var(--b)':'#6366F1',color:searching?'var(--tx3)':'#fff',fontSize:13,fontWeight:600,cursor:searching?'not-allowed':'pointer',fontFamily:'inherit'}}>
                  {searching?'Searching...':'Search & Generate Replies'}
                </button>
              </div>
            </div>

            {results.map((item,i)=>(
              <div key={i} style={s.card}>
                <div style={{marginBottom:10}}>
                  <span style={{fontSize:12,fontWeight:600,color:'var(--tx2)'}}>@{item.tweet?.author}</span>
                  <p style={{fontSize:13,color:'var(--tx)',margin:'6px 0 0',lineHeight:1.6}}>{item.tweet?.text}</p>
                </div>
                <div style={{padding:'10px 12px',borderRadius:10,background:'rgba(99,102,241,.05)',border:'1px solid rgba(99,102,241,.15)',marginBottom:10}}>
                  <div style={{fontSize:10,fontWeight:700,color:'#6366F1',marginBottom:4}}>AI REPLY</div>
                  {editId===item.tweet?.id?<textarea value={editText} onChange={e=>setEditText(e.target.value)} rows={2} style={{width:'100%',padding:8,borderRadius:8,border:'1px solid var(--b)',background:'var(--bg)',fontSize:13,fontFamily:'inherit',outline:'none',boxSizing:'border-box'}}/>:<p style={{fontSize:13,margin:0,lineHeight:1.6,color:'var(--tx)'}}>{item.reply}</p>}
                  <div style={{fontSize:10,color:'var(--tx3)',marginTop:4}}>{(editId===item.tweet?.id?editText:item.reply)?.length||0}/255</div>
                </div>
                <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                  <button onClick={()=>handlePost(item,true)} disabled={posting===item.tweet?.id} style={{padding:'7px 16px',borderRadius:9999,border:'none',background:'#1d9bf0',color:'#fff',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{posting===item.tweet?.id?'Posting...':'Post Reply'}</button>
                  <button onClick={()=>{setEditId(item.tweet?.id);setEditText(item.reply)}} style={{padding:'7px 14px',borderRadius:9999,border:'1px solid var(--b)',background:'transparent',color:'var(--tx2)',fontSize:12,cursor:'pointer',fontFamily:'inherit'}}>Edit</button>
                  <button onClick={()=>handleRegen(item,true)} style={{padding:'7px 14px',borderRadius:9999,border:'1px solid var(--b)',background:'transparent',color:'var(--tx2)',fontSize:12,cursor:'pointer',fontFamily:'inherit'}}>Regenerate</button>
                  <a href={'https://x.com/i/web/status/'+item.tweet?.id} target="_blank" rel="noopener noreferrer" style={{padding:'7px 14px',borderRadius:9999,border:'1px solid var(--b)',background:'transparent',color:'var(--tx3)',fontSize:12,textDecoration:'none'}}>View</a>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab==='queue'&&(
          queue.length===0?<div style={{textAlign:'center',padding:'40px 0',color:'var(--tx3)'}}>No pending replies. Run a search first.</div>:
          queue.map(item=>(
            <div key={item.id} style={s.card}>
              <div style={{marginBottom:10}}>
                <span style={{fontSize:12,fontWeight:600,color:'var(--tx2)'}}>@{item.tweet_author}</span>
                <p style={{fontSize:13,color:'var(--tx)',margin:'6px 0 0',lineHeight:1.6}}>{item.tweet_text}</p>
              </div>
              <div style={{padding:'10px 12px',borderRadius:10,background:'rgba(99,102,241,.05)',border:'1px solid rgba(99,102,241,.15)',marginBottom:10}}>
                <div style={{fontSize:10,fontWeight:700,color:'#6366F1',marginBottom:4}}>AI REPLY</div>
                {editId===item.id?<textarea value={editText} onChange={e=>setEditText(e.target.value)} rows={2} style={{width:'100%',padding:8,borderRadius:8,border:'1px solid var(--b)',background:'var(--bg)',fontSize:13,fontFamily:'inherit',outline:'none',boxSizing:'border-box'}}/>:<p style={{fontSize:13,margin:0,lineHeight:1.6,color:'var(--tx)'}}>{item.generated_reply}</p>}
                <div style={{fontSize:10,color:'var(--tx3)',marginTop:4}}>{(editId===item.id?editText:item.generated_reply)?.length||0}/255</div>
              </div>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                <button onClick={()=>handlePost(item)} disabled={posting===item.id} style={{padding:'7px 16px',borderRadius:9999,border:'none',background:'#1d9bf0',color:'#fff',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{posting===item.id?'Posting...':'Post Reply'}</button>
                <button onClick={()=>{setEditId(item.id);setEditText(item.generated_reply)}} style={{padding:'7px 14px',borderRadius:9999,border:'1px solid var(--b)',background:'transparent',color:'var(--tx2)',fontSize:12,cursor:'pointer',fontFamily:'inherit'}}>Edit</button>
                <button onClick={()=>handleRegen(item)} style={{padding:'7px 14px',borderRadius:9999,border:'1px solid var(--b)',background:'transparent',color:'var(--tx2)',fontSize:12,cursor:'pointer',fontFamily:'inherit'}}>Regenerate</button>
                <button onClick={()=>handleReject(item.id)} style={{padding:'7px 14px',borderRadius:9999,border:'1px solid rgba(239,68,68,.3)',background:'transparent',color:'#dc2626',fontSize:12,cursor:'pointer',fontFamily:'inherit'}}>Reject</button>
                <a href={'https://x.com/i/web/status/'+item.tweet_id} target="_blank" rel="noopener noreferrer" style={{padding:'7px 14px',borderRadius:9999,border:'1px solid var(--b)',background:'transparent',color:'var(--tx3)',fontSize:12,textDecoration:'none'}}>View</a>
              </div>
            </div>
          ))
        )}

        {tab==='history'&&(
          history.length===0?<div style={{textAlign:'center',padding:'40px 0',color:'var(--tx3)'}}>No history yet.</div>:
          history.map(item=>(
            <div key={item.id} style={{...s.card,opacity:0.8}}>
              <div style={{display:'flex',gap:8,marginBottom:8}}>
                <span style={{fontSize:11,fontWeight:600,padding:'2px 8px',borderRadius:9999,background:item.status==='posted'?'rgba(34,197,94,.1)':'rgba(239,68,68,.1)',color:item.status==='posted'?'#16a34a':'#dc2626'}}>{item.status==='posted'?'Posted':'Rejected'}</span>
                <span style={{fontSize:11,color:'var(--tx3)'}}>@{item.tweet_author} · {new Date(item.created_at).toLocaleDateString()}</span>
              </div>
              <p style={{fontSize:12,color:'var(--tx2)',margin:'0 0 6px',lineHeight:1.5}}>{item.tweet_text}</p>
              <p style={{fontSize:12,color:'#6366F1',margin:0,lineHeight:1.5,borderLeft:'2px solid #6366F1',paddingLeft:8}}>{item.generated_reply}</p>
            </div>
          ))
        )}

      </div>
    </div>
  )
}
