'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import DiscoveryAgentCard from '@/components/admin/DiscoveryAgentCard'

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
  const [mainTab, setMainTab]       = useState<'alice'|'carolyne'|'ben'|'agent'|'x'|'security'|'automation'>('alice')

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

  // Alice blog scout state
  const [aliceItems, setAliceItems] = useState<any[]>([])
  const [aliceCounts, setAliceCounts] = useState<{pending:number;published:number;rejected:number;total:number}>({pending:0,published:0,rejected:0,total:0})
  const [aliceFilter, setAliceFilter] = useState<'pending'|'published'|'rejected'|'all'>('pending')
  const [aliceRunning, setAliceRunning] = useState(false)
  const [aliceRunLog, setAliceRunLog] = useState<string[]>([])
  const [alicePreview, setAlicePreview] = useState<any>(null)
  const [aliceActing, setAliceActing] = useState<string|null>(null)
  const [aliceEditTitle, setAliceEditTitle] = useState('')
  const [aliceEditSections, setAliceEditSections] = useState<{heading:string;level:2|3;body:string}[]>([])

  // Carolyne Kigathi — East Africa blog scout state
  const [carolyneItems, setCarolyneItems] = useState<any[]>([])
  const [carolyneCounts, setCarolyneCounts] = useState<{pending:number;published:number;rejected:number;total:number}>({pending:0,published:0,rejected:0,total:0})
  const [carolyneFilter, setCarolyneFilter] = useState<'pending'|'published'|'rejected'|'all'>('pending')
  const [carolyneRunning, setCarolyneRunning] = useState(false)
  const [carolyneRunLog, setCarolyneRunLog] = useState<string[]>([])
  const [carolynePreview, setCarolynePreview] = useState<any>(null)
  const [carolyneActing, setCarolyneActing] = useState<string|null>(null)
  const [carolyneEditTitle, setCarolyneEditTitle] = useState('')
  const [carolyneEditSections, setCarolyneEditSections] = useState<{heading:string;level:2|3;body:string}[]>([])

  // Ben Carlson — US market blog scout state
  const [benItems, setBenItems]           = useState<any[]>([])
  const [benCounts, setBenCounts]         = useState<{pending:number;published:number;rejected:number;total:number}>({pending:0,published:0,rejected:0,total:0})
  const [benFilter, setBenFilter]         = useState<'pending'|'published'|'rejected'|'all'>('pending')
  const [benRunning, setBenRunning]       = useState(false)
  const [benRunLog, setBenRunLog]         = useState<string[]>([])
  const [benPreview, setBenPreview]       = useState<any>(null)
  const [benActing, setBenActing]         = useState<string|null>(null)
  const [benEditTitle, setBenEditTitle]   = useState('')
  const [benEditSections, setBenEditSections] = useState<{heading:string;level:2|3;body:string}[]>([])

  // Loading states — prevent misleading 0s on initial render
  const [aliceLoading, setAliceLoading]       = useState(true)
  const [carolyneLoading, setCarolyneLoading] = useState(true)
  const [benLoading, setBenLoading]           = useState(true)

  // Automation state
  const [autoJobs, setAutoJobs] = useState<Record<string, {running:boolean;result:any;lastRun:string|null}>>({
    'source-sync': {running:false,result:null,lastRun:null},
    'daily-brief': {running:false,result:null,lastRun:null},
    'stale-content': {running:false,result:null,lastRun:null},
    'token-refresh': {running:false,result:null,lastRun:null},
    'seo-monitor': {running:false,result:null,lastRun:null},
    'stock-replenishment': {running:false,result:null,lastRun:null},
  })

  // AI Discovery Agent — now a standalone component (DiscoveryAgentCard)

  const runAutoJob = async (jobId: string) => {
    setAutoJobs(prev => ({...prev, [jobId]: {...prev[jobId], running: true, result: null}}))
    try {
      const res = await fetch(`/api/cron/${jobId}?secret=dev-test`)
      const data = await res.json()
      setAutoJobs(prev => ({...prev, [jobId]: {running: false, result: data, lastRun: new Date().toISOString()}}))
      showToast(data.success ? `${jobId} completed` : (data.error || 'Failed'), !!data.success)
    } catch (e) {
      setAutoJobs(prev => ({...prev, [jobId]: {running: false, result: {error: String(e)}, lastRun: null}}))
      showToast(String(e), false)
    }
  }

  // Security agent state
  const [secRunning, setSecRunning] = useState(false)
  const [secReport, setSecReport] = useState<any>(null)
  const [secHistory, setSecHistory] = useState<any[]>([])
  const [secExpanded, setSecExpanded] = useState<string|null>(null)
  const [secExporting, setSecExporting] = useState(false)

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

  const loadSecHistory = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/admin/security-audit?action=history', {
        headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {},
      })
      const d = await res.json()
      setSecHistory(d.audits || [])
      if (d.audits?.length > 0 && !secReport) setSecReport(d.audits[0].report)
    } catch {}
  }

  useEffect(() => { if (authorized && mainTab === 'security') loadSecHistory() }, [authorized, mainTab])

  const loadAliceCounts = useCallback(async () => {
    try {
      const res = await fetch(`/api/agent/blog-scout/list?counts=1&t=${Date.now()}`, { cache: 'no-store' })
      const d = await res.json()
      setAliceCounts({
        pending: d.pending || 0,
        published: d.published || 0,
        rejected: d.rejected || 0,
        total: d.total || 0,
      })
    } catch {}
  }, [])

  const loadAliceItems = useCallback(async () => {
    try {
      const res = await fetch(`/api/agent/blog-scout/list?status=${aliceFilter}&t=${Date.now()}`, { cache: 'no-store' })
      const d = await res.json()
      setAliceItems(d.items || [])
    } catch { setAliceItems([]) }
    finally { setAliceLoading(false) }
  }, [aliceFilter])

  useEffect(() => {
    if (authorized && mainTab === 'alice') {
      loadAliceItems()
      loadAliceCounts()
    }
  }, [authorized, mainTab, loadAliceItems, loadAliceCounts])

  // ── Carolyne load functions ──
  const loadCarolyneCounts = useCallback(async () => {
    try {
      const res = await fetch(`/api/agent/carolyne-scout/list?counts=1&t=${Date.now()}`, { cache: 'no-store' })
      const d   = await res.json()
      setCarolyneCounts({ pending: d.pending || 0, published: d.published || 0, rejected: d.rejected || 0, total: d.total || 0 })
    } catch {}
  }, [])

  const loadCarolyneItems = useCallback(async () => {
    try {
      const res = await fetch(`/api/agent/carolyne-scout/list?status=${carolyneFilter}&t=${Date.now()}`, { cache: 'no-store' })
      const d   = await res.json()
      setCarolyneItems(d.items || [])
    } catch { setCarolyneItems([]) }
    finally { setCarolyneLoading(false) }
  }, [carolyneFilter])

  useEffect(() => {
    if (authorized && mainTab === 'carolyne') {
      loadCarolyneItems()
      loadCarolyneCounts()
    }
  }, [authorized, mainTab, loadCarolyneItems, loadCarolyneCounts])

  // ── Ben Carlson load functions ──
  const loadBenCounts = useCallback(async () => {
    try {
      const res = await fetch(`/api/agent/ben-scout/list?counts=1&t=${Date.now()}`, { cache: 'no-store' })
      const d   = await res.json()
      setBenCounts({ pending: d.pending || 0, published: d.published || 0, rejected: d.rejected || 0, total: d.total || 0 })
    } catch {}
  }, [])

  const loadBenItems = useCallback(async () => {
    try {
      const res = await fetch(`/api/agent/ben-scout/list?status=${benFilter}&t=${Date.now()}`, { cache: 'no-store' })
      const d   = await res.json()
      setBenItems(d.items || [])
    } catch { setBenItems([]) }
    finally { setBenLoading(false) }
  }, [benFilter])

  useEffect(() => {
    if (authorized && mainTab === 'ben') {
      loadBenItems()
      loadBenCounts()
    }
  }, [authorized, mainTab, loadBenItems, loadBenCounts])

  const runAliceScout = async () => {
    setAliceRunning(true); setAliceRunLog(['Alice is scanning for today\'s stories...'])
    try {
      const res = await fetch('/api/agent/blog-scout?secret=dev-test')
      const data = await res.json()
      setAliceRunLog(data.log || [String(data.error || 'Unknown error')])
      if (data.success) { showToast(`Alice drafted ${data.blogsGenerated} blog posts`); loadAliceItems(); loadAliceCounts() }
      else showToast('Scout failed — check log', false)
    } catch (e) { setAliceRunLog([`Error: ${String(e)}`]); showToast('Scout failed', false) }
    finally { setAliceRunning(false) }
  }

  const runCarolyneScout = async () => {
    setCarolyneRunning(true); setCarolyneRunLog(['Carolyne is scanning East African markets...'])
    try {
      const res  = await fetch('/api/agent/carolyne-scout?secret=dev-test')
      const data = await res.json()
      setCarolyneRunLog(data.log || [String(data.error || 'Unknown error')])
      if (data.success) { showToast(`Carolyne drafted ${data.blogsGenerated} posts`); loadCarolyneItems(); loadCarolyneCounts() }
      else showToast('Scout failed — check log', false)
    } catch (e) { setCarolyneRunLog([`Error: ${String(e)}`]); showToast('Scout failed', false) }
    finally { setCarolyneRunning(false) }
  }

  const openAlicePreview = (item: any) => {
    setAlicePreview(item)
    setAliceEditTitle(item.content?.title || '')
    setAliceEditSections(item.content?.sections ? JSON.parse(JSON.stringify(item.content.sections)) : [])
  }

  const openCarolynePreview = (item: any) => {
    setCarolynePreview(item)
    setCarolyneEditTitle(item.content?.title || '')
    setCarolyneEditSections(item.content?.sections ? JSON.parse(JSON.stringify(item.content.sections)) : [])
  }

  const handleAliceAction = async (id: string, action: 'approve'|'reject') => {
    setAliceActing(id)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const body: any = { id, action }
      if (action === 'approve' && alicePreview) {
        body.content = { ...alicePreview.content, title: aliceEditTitle, sections: aliceEditSections }
      }
      const res = await fetch('/api/agent/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}) },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        showToast(data.error || `Failed (${res.status})`, false)
        return
      }
      if (action === 'approve' && data.slug) {
        showToast(`Published → askbiz.co/blog/${data.slug}`)
      } else {
        showToast(action === 'approve' ? 'Published to blog' : 'Rejected')
      }
      setAlicePreview(null)
      // Optimistically remove from local list and update counts
      setAliceItems(prev => prev.filter(item => item.id !== id))
      setAliceCounts(prev => ({
        ...prev,
        pending: prev.pending - 1,
        published: action === 'approve' ? prev.published + 1 : prev.published,
        rejected: action === 'reject' ? prev.rejected + 1 : prev.rejected,
      }))
    } catch (e) { showToast(String(e), false) }
    finally { setAliceActing(null) }
  }

  const handleCarolyneAction = async (id: string, action: 'approve'|'reject') => {
    setCarolyneActing(id)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const body: any = { id, action }
      if (action === 'approve' && carolynePreview) {
        body.content = { ...carolynePreview.content, title: carolyneEditTitle, sections: carolyneEditSections }
      }
      const res = await fetch('/api/agent/approve', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}) },
        body:    JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok || !data.success) { showToast(data.error || `Failed (${res.status})`, false); return }
      showToast(action === 'approve' ? 'Authorised & published' : 'Rejected')
      setCarolynePreview(null)
      setCarolyneItems(prev => prev.filter(item => item.id !== id))
      setCarolyneCounts(prev => ({
        ...prev,
        pending:   prev.pending - 1,
        published: action === 'approve' ? prev.published + 1 : prev.published,
        rejected:  action === 'reject'  ? prev.rejected  + 1 : prev.rejected,
      }))
    } catch (e) { showToast(String(e), false) }
    finally { setCarolyneActing(null) }
  }

  const runSecurityAudit = async () => {
    setSecRunning(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/admin/security-audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ action: 'run' }),
      })
      const d = await res.json()
      if (d.success) {
        setSecReport(d.report)
        showToast(`Audit complete — ${d.report.passed}/${d.report.total_checks} passed`)
        loadSecHistory()
      } else showToast(d.error || 'Audit failed', false)
    } catch (e: any) { showToast(e.message, false) }
    finally { setSecRunning(false) }
  }

  const exportSecurityCsv = async (runId?: string) => {
    setSecExporting(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const params = new URLSearchParams({ action: 'export' })
      if (runId) params.set('runId', runId)
      const res = await fetch(`/api/admin/security-audit?${params}`, {
        headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {},
      })
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `askbiz-security-audit-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
      showToast('CSV exported')
    } catch (e: any) { showToast(e.message, false) }
    finally { setSecExporting(false) }
  }

  const SEC_STATUS = {
    pass: { bg: 'rgba(34,197,94,.1)', border: 'rgba(34,197,94,.3)', color: '#16a34a', label: 'PASS', icon: '✓' },
    warn: { bg: 'rgba(245,158,11,.1)', border: 'rgba(245,158,11,.3)', color: '#d97706', label: 'WARNING', icon: '⚠' },
    fail: { bg: 'rgba(239,68,68,.1)', border: 'rgba(239,68,68,.3)', color: '#dc2626', label: 'FAIL', icon: '✗' },
  }

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
              <button onClick={()=>router.push('/admin')} style={{padding:'4px 10px',borderRadius:9999,border:'1px solid var(--b)',background:'transparent',color:'var(--tx3)',fontSize:12,cursor:'pointer',fontFamily:'inherit'}}>← Back</button>
              <h1 style={{fontSize:20,fontWeight:700,fontFamily:'var(--font-sora)',margin:0}}>Agents</h1>
              <span style={{fontSize:11,padding:'2px 8px',borderRadius:9999,background:'rgba(99,102,241,.1)',color:'#6366F1',fontWeight:600}}>Admin Only</span>
            </div>
            <p style={{fontSize:13,color:'var(--tx3)',margin:0}}>
              {mainTab === 'alice'      ? 'Runs daily at 4am UTC · Scan → Draft → Review → Publish' :
               mainTab === 'carolyne'  ? 'Runs daily at 4:30am UTC · East Africa · Scan → Draft → Review → Publish' :
               mainTab === 'automation'? 'Background jobs that keep AskBiz data fresh and indexes current' :
               mainTab === 'security'  ? 'Automated compliance checks · Weekly audit on Mondays at 6am' :
               'Runs daily at 6am UTC · Scout → Analyse → Write → Review'}
            </p>
          </div>
          <button onClick={runAgent} disabled={running} style={{display:'flex',alignItems:'center',gap:7,padding:'10px 18px',borderRadius:9999,border:'none',background:running?'var(--b)':'#6366F1',color:running?'var(--tx3)':'#fff',fontSize:13,fontWeight:600,cursor:running?'wait':'pointer',fontFamily:'inherit'}}>
            {running ? 'Running…' : 'Run Agent Now'}
          </button>
        </div>

        {/* Main tabs */}
        <div className="tab-strip" style={{borderBottom:'1px solid var(--b)',marginBottom:24,display:'flex',gap:0,overflowX:'auto'}}>
          {([['alice','Alice Watson — Blog Scout'],['carolyne','Carolyne Kigathi — East Africa'],['automation','Automation'],['security','Security & GDPR']] as const).map(([t,label]) => {
            const tabColor = t === 'carolyne' ? '#16a34a' : '#6366F1'
            const active = mainTab === t
            return (
              <button key={t} onClick={()=>setMainTab(t as any)} style={{padding:'10px 20px',border:'none',background:'transparent',fontSize:13,fontWeight:active?600:400,color:active?tabColor:'var(--tx3)',borderBottom:active?`2px solid ${tabColor}`:'2px solid transparent',cursor:'pointer',fontFamily:'inherit',flexShrink:0,whiteSpace:'nowrap',transition:'color 150ms'}}>
                {label}
              </button>
            )
          })}
        </div>

        {/* ── ALICE WATSON — BLOG SCOUT ── */}
        {mainTab === 'alice' && (
          <>
            {/* Alice profile card */}
            <div style={{display:'flex',alignItems:'center',gap:16,padding:20,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)',marginBottom:20}}>
              <div style={{width:56,height:56,borderRadius:'50%',background:'linear-gradient(135deg, #6366F1 0%, #818cf8 100%)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:20,fontWeight:700,color:'#fff',fontFamily:'var(--font-sora)'}}>AW</div>
              <div style={{flex:1}}>
                <div style={{fontSize:16,fontWeight:700,fontFamily:'var(--font-sora)',color:'var(--tx)'}}>Alice Watson</div>
                <div style={{fontSize:12,color:'#6366F1',fontWeight:600,marginBottom:4}}>Head of Market Intelligence</div>
                <div style={{fontSize:12,color:'var(--tx3)',lineHeight:1.5}}>Scans live news daily via Tavily, drafts 10 blog posts targeting AskBiz&apos;s core value areas. Posts go live on the blog once you authorise them.</div>
              </div>
              <button onClick={runAliceScout} disabled={aliceRunning} style={{padding:'10px 20px',borderRadius:9999,border:'none',background:aliceRunning?'var(--b)':'#6366F1',color:aliceRunning?'var(--tx3)':'#fff',fontSize:13,fontWeight:600,cursor:aliceRunning?'wait':'pointer',fontFamily:'inherit',flexShrink:0,transition:'background 200ms, color 200ms, opacity 200ms'}}>
                {aliceRunning ? 'Writing...' : 'Run Alice Now'}
              </button>
            </div>

            {/* Run log */}
            {aliceRunLog.length > 0 && (
              <div style={{marginBottom:20,padding:'14px 16px',borderRadius:12,background:'var(--ev)',border:'1px solid var(--b)',fontSize:12,fontFamily:'monospace',color:'var(--tx2)',maxHeight:200,overflowY:'auto'}}>
                {aliceRunLog.map((l,i) => <div key={i}>{l}</div>)}
              </div>
            )}

            {/* Stats */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:10,marginBottom:20}}>
              {aliceLoading ? [0,1,2,3].map(i => (
                <div key={i} style={{padding:14,borderRadius:12,border:'1px solid var(--b)',background:'var(--sf)',minHeight:66}}>
                  <div style={{height:9,borderRadius:5,background:'var(--ev)',marginBottom:10,width:'65%'}}/>
                  <div style={{height:22,borderRadius:6,background:'var(--ev)',width:'35%'}}/>
                </div>
              )) : [
                {label:'Pending Review',value:aliceCounts.pending,color:'#f59e0b'},
                {label:'Published',value:aliceCounts.published,color:'#10b981'},
                {label:'Rejected',value:aliceCounts.rejected,color:'#94a3b8'},
                {label:'Total Drafts',value:aliceCounts.total,color:'var(--tx)'},
              ].map(({label,value,color}) => (
                <div key={label} style={{padding:14,borderRadius:12,border:'1px solid var(--b)',background:'var(--sf)'}}>
                  <div style={{fontSize:10,fontWeight:600,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:6}}>{label}</div>
                  <div style={{fontSize:22,fontWeight:700,fontFamily:'var(--font-sora)',color}}>{value}</div>
                </div>
              ))}
            </div>

            {/* Filter */}
            <div style={{display:'flex',gap:8,marginBottom:16}}>
              {(['pending','published','rejected','all'] as const).map(f => (
                <button key={f} onClick={() => { setAliceLoading(true); setAliceFilter(f) }} style={{padding:'6px 14px',borderRadius:9999,border:`1px solid ${aliceFilter===f?'#6366F1':'var(--b)'}`,background:aliceFilter===f?'rgba(99,102,241,.08)':'transparent',color:aliceFilter===f?'#6366F1':'var(--tx3)',fontSize:12,fontWeight:aliceFilter===f?600:400,cursor:'pointer',fontFamily:'inherit',textTransform:'capitalize',transition:'background 150ms, color 150ms, border-color 150ms'}}>{f}</button>
              ))}
            </div>

            {/* Blog list */}
            {aliceItems.length === 0 ? (
              <div style={{textAlign:'center',padding:'60px 0',color:'var(--tx3)'}}>
                <div style={{width:56,height:56,borderRadius:'50%',background:'linear-gradient(135deg,#6366F1,#818cf8)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:700,color:'#fff',fontFamily:'var(--font-sora)',margin:'0 auto 16px',opacity:.7}}>AW</div>
                <div style={{fontSize:14,fontWeight:500,marginBottom:6,color:'var(--tx)'}}>No drafts yet</div>
                <div style={{fontSize:12,maxWidth:280,margin:'0 auto',lineHeight:1.6}}>Hit &quot;Run Alice Now&quot; to have her scan today&apos;s news and draft 10 blog posts ready for review.</div>
              </div>
            ) : (
              <div style={{borderRadius:14,border:'1px solid var(--b)',overflow:'hidden',background:'var(--sf)'}}>
                {aliceItems.map(item => {
                  const blog = item.content || {}
                  return (
                    <div key={item.id} style={{padding:'14px 16px',borderBottom:'1px solid var(--b)',display:'flex',alignItems:'center',gap:10,flexWrap:'wrap',cursor:'pointer',transition:'background 120ms'}} onClick={() => openAlicePreview(item)} onMouseEnter={e=>e.currentTarget.style.background='var(--ev)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <span style={{fontSize:11,fontWeight:600,padding:'2px 8px',borderRadius:6,background:item.status==='pending'?'rgba(245,158,11,.1)':item.status==='published'?'rgba(16,185,129,.1)':'rgba(148,163,184,.1)',color:item.status==='pending'?'#f59e0b':item.status==='published'?'#10b981':'#94a3b8'}}>{item.status}</span>
                      <span style={{fontSize:11,padding:'2px 8px',borderRadius:6,background:'rgba(99,102,241,.08)',color:'#6366F1',fontWeight:500}}>{blog.cluster || '—'}</span>
                      <span style={{fontSize:13,color:'var(--tx)',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontWeight:500}}>{blog.title || 'Untitled'}</span>
                      {blog.qualityScore != null && <span style={{fontSize:10,fontWeight:600,padding:'2px 6px',borderRadius:4,background:blog.qualityScore>=80?'rgba(16,185,129,.1)':'rgba(245,158,11,.1)',color:blog.qualityScore>=80?'#10b981':'#f59e0b'}}>{blog.qualityScore}</span>}
                      <span style={{fontSize:11,color:'var(--tx3)'}}>{blog.readTime ? `${blog.readTime} min` : ''}</span>
                      <span style={{fontSize:11,color:'var(--tx3)'}}>{new Date(item.created_at).toLocaleDateString('en-GB')}</span>
                      {item.status === 'pending' && (
                        <div style={{display:'flex',gap:6}} onClick={e => e.stopPropagation()}>
                          <button onClick={() => handleAliceAction(item.id, 'approve')} disabled={aliceActing===item.id} style={{padding:'4px 12px',borderRadius:6,border:'none',background:'#10b981',color:'#fff',fontSize:11,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>Authorise</button>
                          <button onClick={() => handleAliceAction(item.id, 'reject')} disabled={aliceActing===item.id} style={{padding:'4px 12px',borderRadius:6,border:'1px solid var(--b)',background:'transparent',color:'#f87171',fontSize:11,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>Reject</button>
                        </div>
                      )}
                      {item.status === 'published' && blog.slug && (
                        <a href={`/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{padding:'4px 12px',borderRadius:6,border:'1px solid rgba(16,185,129,.3)',background:'rgba(16,185,129,.08)',color:'#10b981',fontSize:11,fontWeight:600,textDecoration:'none',fontFamily:'inherit'}}>View on Blog ↗</a>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Preview modal */}
            {alicePreview && (
              <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',padding:20}} onClick={() => setAlicePreview(null)}>
                <div style={{background:'var(--sf)',borderRadius:16,maxWidth:800,width:'100%',maxHeight:'90vh',overflow:'auto',padding:0}} onClick={e => e.stopPropagation()}>
                  {/* Modal header */}
                  <div style={{padding:'16px 24px',borderBottom:'1px solid var(--b)',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,background:'var(--sf)',zIndex:1,borderRadius:'16px 16px 0 0'}}>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg, #6366F1, #818cf8)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#fff'}}>AW</div>
                      <div>
                        <div style={{fontSize:13,fontWeight:600,color:'var(--tx)'}}>Alice Watson</div>
                        <div style={{fontSize:11,color:'var(--tx3)'}}>{alicePreview.content?.cluster} · {new Date(alicePreview.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}</div>
                      </div>
                    </div>
                    <div style={{display:'flex',gap:8}}>
                      {alicePreview.status === 'pending' && <>
                        <button onClick={() => handleAliceAction(alicePreview.id, 'approve')} disabled={aliceActing===alicePreview.id} style={{padding:'6px 16px',borderRadius:8,border:'none',background:'#10b981',color:'#fff',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>Authorise & Publish</button>
                        <button onClick={() => handleAliceAction(alicePreview.id, 'reject')} disabled={aliceActing===alicePreview.id} style={{padding:'6px 16px',borderRadius:8,border:'1px solid var(--b)',background:'transparent',color:'#f87171',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>Reject</button>
                      </>}
                      <button onClick={() => setAlicePreview(null)} aria-label="Close preview" style={{padding:'6px 10px',borderRadius:8,border:'1px solid var(--b)',background:'transparent',color:'var(--tx3)',fontSize:14,cursor:'pointer',fontFamily:'inherit',lineHeight:1}}>×</button>
                    </div>
                  </div>

                  {/* Modal body */}
                  <div style={{padding:24}}>
                    {/* Byline */}
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16,fontSize:12,color:'var(--tx3)'}}>
                      <span style={{fontWeight:600,color:'var(--tx)'}}>Written by Alice Watson</span>
                      <span>·</span>
                      <span>{alicePreview.content?.publishDate}</span>
                      <span>·</span>
                      <span>{alicePreview.content?.readTime} min read</span>
                      {alicePreview.source_url && <>
                        <span>·</span>
                        <a href={alicePreview.source_url} target="_blank" rel="noopener noreferrer" style={{color:'#6366F1',textDecoration:'none'}}>Source →</a>
                      </>}
                    </div>

                    {/* Title */}
                    {alicePreview.status === 'pending' ? (
                      <input value={aliceEditTitle} onChange={e => setAliceEditTitle(e.target.value)} placeholder="Article title" style={{fontSize:22,fontWeight:700,fontFamily:'var(--font-sora)',color:'var(--tx)',border:'1px solid var(--b)',borderRadius:8,padding:'8px 12px',width:'100%',marginBottom:16,background:'transparent',boxSizing:'border-box'}} />
                    ) : (
                      <h1 style={{fontSize:22,fontWeight:700,fontFamily:'var(--font-sora)',color:'var(--tx)',marginBottom:16,marginTop:0}}>{alicePreview.content?.title}</h1>
                    )}

                    {/* TLDR */}
                    {alicePreview.content?.tldr && (
                      <div style={{padding:'12px 16px',borderRadius:10,background:'rgba(99,102,241,.05)',border:'1px solid rgba(99,102,241,.15)',marginBottom:24,fontSize:13,color:'var(--tx2)',lineHeight:1.6}}>
                        <strong style={{color:'#6366F1',fontSize:11,textTransform:'uppercase',letterSpacing:'.06em'}}>TL;DR</strong><br/>{alicePreview.content.tldr}
                      </div>
                    )}

                    {/* Sections */}
                    {(alicePreview.status === 'pending' ? aliceEditSections : alicePreview.content?.sections || []).map((sec: any, i: number) => (
                      <div key={i} style={{marginBottom:24}}>
                        {alicePreview.status === 'pending' ? (
                          <>
                            <input value={sec.heading} onChange={e => { const s = [...aliceEditSections]; s[i] = {...s[i], heading: e.target.value}; setAliceEditSections(s) }} placeholder="Section heading" style={{fontSize:16,fontWeight:600,fontFamily:'var(--font-sora)',color:'var(--tx)',border:'1px solid var(--b)',borderRadius:6,padding:'6px 10px',width:'100%',marginBottom:8,background:'transparent',boxSizing:'border-box'}} />
                            <textarea value={sec.body} onChange={e => { const s = [...aliceEditSections]; s[i] = {...s[i], body: e.target.value}; setAliceEditSections(s) }} rows={5} placeholder="Write section content…" style={{fontSize:13,lineHeight:1.7,color:'var(--tx2)',border:'1px solid var(--b)',borderRadius:6,padding:'8px 10px',width:'100%',resize:'vertical',fontFamily:'inherit',background:'transparent',boxSizing:'border-box'}} />
                          </>
                        ) : (
                          <>
                            <h2 style={{fontSize:16,fontWeight:600,fontFamily:'var(--font-sora)',color:'var(--tx)',marginBottom:8,marginTop:0}}>{sec.heading}</h2>
                            <p style={{fontSize:13,lineHeight:1.7,color:'var(--tx2)',margin:0}}>{sec.body}</p>
                          </>
                        )}
                      </div>
                    ))}

                    {/* PAA */}
                    {alicePreview.content?.paa?.length > 0 && (
                      <div style={{marginTop:24,padding:16,borderRadius:10,border:'1px solid var(--b)',background:'rgba(0,0,0,.02)'}}>
                        <h3 style={{fontSize:13,fontWeight:600,color:'var(--tx)',marginBottom:12,marginTop:0}}>People Also Ask</h3>
                        {alicePreview.content.paa.map((qa: any, i: number) => (
                          <div key={i} style={{marginBottom:12}}>
                            <div style={{fontSize:13,fontWeight:600,color:'var(--tx)',marginBottom:4}}>{qa.q}</div>
                            <div style={{fontSize:12,color:'var(--tx2)',lineHeight:1.6}}>{qa.a}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* CTA */}
                    {alicePreview.content?.cta && (
                      <div style={{marginTop:24,padding:16,borderRadius:10,background:'rgba(99,102,241,.06)',border:'1px solid rgba(99,102,241,.15)'}}>
                        <div style={{fontSize:14,fontWeight:600,color:'#6366F1',marginBottom:4}}>{alicePreview.content.cta.heading}</div>
                        <div style={{fontSize:12,color:'var(--tx2)'}}>{alicePreview.content.cta.body}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── CAROLYNE KIGATHI — EAST AFRICA ── */}
        {mainTab === 'carolyne' && (
          <>
            {/* Carolyne profile card */}
            <div style={{display:'flex',alignItems:'center',gap:16,padding:20,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)',marginBottom:20}}>
              <div style={{width:56,height:56,borderRadius:'50%',background:'linear-gradient(135deg, #16a34a 0%, #4ade80 100%)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:18,fontWeight:700,color:'#fff',fontFamily:'var(--font-sora)'}}>CK</div>
              <div style={{flex:1}}>
                <div style={{fontSize:16,fontWeight:700,fontFamily:'var(--font-sora)',color:'var(--tx)'}}>Carolyne Kigathi</div>
                <div style={{fontSize:12,color:'#16a34a',fontWeight:600,marginBottom:4}}>Head of Strategic Partnerships, East Africa</div>
                <div style={{fontSize:12,color:'var(--tx3)',lineHeight:1.5}}>Tracks regulatory shifts, mobile money trends, and SME growth signals across Kenya, Uganda, Tanzania, and Rwanda — drafts 10 East Africa-focused posts daily ready for your review.</div>
              </div>
              <button onClick={runCarolyneScout} disabled={carolyneRunning} style={{padding:'10px 20px',borderRadius:9999,border:'none',background:carolyneRunning?'var(--b)':'#16a34a',color:carolyneRunning?'var(--tx3)':'#fff',fontSize:13,fontWeight:600,cursor:carolyneRunning?'wait':'pointer',fontFamily:'inherit',flexShrink:0,transition:'background 200ms, color 200ms, opacity 200ms'}}>
                {carolyneRunning ? 'Writing...' : 'Run Carolyne Now'}
              </button>
            </div>

            {/* Run log */}
            {carolyneRunLog.length > 0 && (
              <div style={{marginBottom:20,padding:'14px 16px',borderRadius:12,background:'var(--ev)',border:'1px solid var(--b)',fontSize:12,fontFamily:'monospace',color:'var(--tx2)',maxHeight:200,overflowY:'auto'}}>
                {carolyneRunLog.map((l,i) => <div key={i}>{l}</div>)}
              </div>
            )}

            {/* Stats */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:10,marginBottom:20}}>
              {carolyneLoading ? [0,1,2,3].map(i => (
                <div key={i} style={{padding:14,borderRadius:12,border:'1px solid var(--b)',background:'var(--sf)',minHeight:66}}>
                  <div style={{height:9,borderRadius:5,background:'var(--ev)',marginBottom:10,width:'65%'}}/>
                  <div style={{height:22,borderRadius:6,background:'var(--ev)',width:'35%'}}/>
                </div>
              )) : [
                {label:'Pending Review', value:carolyneCounts.pending,   color:'#f59e0b'},
                {label:'Published',      value:carolyneCounts.published,  color:'#10b981'},
                {label:'Rejected',       value:carolyneCounts.rejected,   color:'#94a3b8'},
                {label:'Total Drafts',   value:carolyneCounts.total,      color:'var(--tx)'},
              ].map(({label,value,color}) => (
                <div key={label} style={{padding:14,borderRadius:12,border:'1px solid var(--b)',background:'var(--sf)'}}>
                  <div style={{fontSize:10,fontWeight:600,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:6}}>{label}</div>
                  <div style={{fontSize:22,fontWeight:700,fontFamily:'var(--font-sora)',color}}>{value}</div>
                </div>
              ))}
            </div>

            {/* Filter */}
            <div style={{display:'flex',gap:8,marginBottom:16}}>
              {(['pending','published','rejected','all'] as const).map(f => (
                <button key={f} onClick={() => { setCarolyneLoading(true); setCarolyneFilter(f) }} style={{padding:'6px 14px',borderRadius:9999,border:`1px solid ${carolyneFilter===f?'#16a34a':'var(--b)'}`,background:carolyneFilter===f?'rgba(22,163,74,.08)':'transparent',color:carolyneFilter===f?'#16a34a':'var(--tx3)',fontSize:12,fontWeight:carolyneFilter===f?600:400,cursor:'pointer',fontFamily:'inherit',textTransform:'capitalize',transition:'background 150ms, color 150ms, border-color 150ms'}}>{f}</button>
              ))}
            </div>

            {/* Posts list */}
            {carolyneItems.length === 0 ? (
              <div style={{textAlign:'center',padding:'60px 0',color:'var(--tx3)'}}>
                <div style={{fontSize:32,marginBottom:12}}>🌍</div>
                <div style={{fontSize:14,fontWeight:500,marginBottom:4}}>No drafts yet</div>
                <div style={{fontSize:12}}>Hit &quot;Run Carolyne Now&quot; to have her scan East African markets and draft 10 posts.</div>
              </div>
            ) : (
              <div style={{borderRadius:14,border:'1px solid var(--b)',overflow:'hidden',background:'var(--sf)'}}>
                {carolyneItems.map(item => {
                  const blog = item.content || {}
                  return (
                    <div key={item.id} style={{padding:'14px 16px',borderBottom:'1px solid var(--b)',display:'flex',alignItems:'center',gap:10,flexWrap:'wrap',cursor:'pointer',transition:'background 120ms'}} onClick={() => openCarolynePreview(item)} onMouseEnter={e=>e.currentTarget.style.background='var(--ev)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <span style={{fontSize:11,fontWeight:600,padding:'2px 8px',borderRadius:6,background:item.status==='pending'?'rgba(245,158,11,.1)':item.status==='published'?'rgba(16,185,129,.1)':'rgba(148,163,184,.1)',color:item.status==='pending'?'#f59e0b':item.status==='published'?'#10b981':'#94a3b8'}}>{item.status}</span>
                      <span style={{fontSize:11,padding:'2px 8px',borderRadius:6,background:'rgba(22,163,74,.08)',color:'#16a34a',fontWeight:500}}>{blog.cluster || '—'}</span>
                      <span style={{fontSize:13,color:'var(--tx)',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontWeight:500}}>{blog.title || 'Untitled'}</span>
                      {blog.qualityScore != null && <span style={{fontSize:10,fontWeight:600,padding:'2px 6px',borderRadius:4,background:blog.qualityScore>=80?'rgba(16,185,129,.1)':'rgba(245,158,11,.1)',color:blog.qualityScore>=80?'#10b981':'#f59e0b'}}>{blog.qualityScore}</span>}
                      <span style={{fontSize:11,color:'var(--tx3)'}}>{blog.readTime ? `${blog.readTime} min` : ''}</span>
                      <span style={{fontSize:11,color:'var(--tx3)'}}>{new Date(item.created_at).toLocaleDateString('en-GB')}</span>
                      {item.status === 'pending' && (
                        <div style={{display:'flex',gap:6}} onClick={e => e.stopPropagation()}>
                          <button onClick={() => handleCarolyneAction(item.id, 'approve')} disabled={carolyneActing===item.id} style={{padding:'4px 12px',borderRadius:6,border:'none',background:'#16a34a',color:'#fff',fontSize:11,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>Authorise</button>
                          <button onClick={() => handleCarolyneAction(item.id, 'reject')} disabled={carolyneActing===item.id} style={{padding:'4px 12px',borderRadius:6,border:'1px solid var(--b)',background:'transparent',color:'#f87171',fontSize:11,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>Reject</button>
                        </div>
                      )}
                      {item.status === 'published' && blog.slug && (
                        <a href={`/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{padding:'4px 12px',borderRadius:6,border:'1px solid rgba(22,163,74,.3)',background:'rgba(22,163,74,.08)',color:'#16a34a',fontSize:11,fontWeight:600,textDecoration:'none',fontFamily:'inherit'}}>View on Blog ↗</a>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Preview modal */}
            {carolynePreview && (
              <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',padding:20}} onClick={() => setCarolynePreview(null)}>
                <div style={{background:'var(--sf)',borderRadius:16,maxWidth:800,width:'100%',maxHeight:'90vh',overflow:'auto',padding:0}} onClick={e => e.stopPropagation()}>
                  {/* Modal header */}
                  <div style={{padding:'16px 24px',borderBottom:'1px solid var(--b)',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,background:'var(--sf)',zIndex:1,borderRadius:'16px 16px 0 0'}}>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg, #16a34a, #4ade80)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#fff'}}>CK</div>
                      <div>
                        <div style={{fontSize:13,fontWeight:600,color:'var(--tx)'}}>Carolyne Kigathi</div>
                        <div style={{fontSize:11,color:'var(--tx3)'}}>{carolynePreview.content?.cluster} · {new Date(carolynePreview.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}</div>
                      </div>
                    </div>
                    <div style={{display:'flex',gap:8}}>
                      {carolynePreview.status === 'pending' && <>
                        <button onClick={() => handleCarolyneAction(carolynePreview.id, 'approve')} disabled={carolyneActing===carolynePreview.id} style={{padding:'6px 16px',borderRadius:8,border:'none',background:'#16a34a',color:'#fff',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>Authorise & Publish</button>
                        <button onClick={() => handleCarolyneAction(carolynePreview.id, 'reject')} disabled={carolyneActing===carolynePreview.id} style={{padding:'6px 16px',borderRadius:8,border:'1px solid var(--b)',background:'transparent',color:'#f87171',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>Reject</button>
                      </>}
                      <button onClick={() => setCarolynePreview(null)} aria-label="Close preview" style={{padding:'6px 10px',borderRadius:8,border:'1px solid var(--b)',background:'transparent',color:'var(--tx3)',fontSize:14,cursor:'pointer',fontFamily:'inherit',lineHeight:1}}>×</button>
                    </div>
                  </div>

                  {/* Modal body */}
                  <div style={{padding:24}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16,fontSize:12,color:'var(--tx3)'}}>
                      <span style={{fontWeight:600,color:'var(--tx)'}}>Written by Carolyne Kigathi</span>
                      <span>·</span><span>{carolynePreview.content?.publishDate}</span>
                      <span>·</span><span>{carolynePreview.content?.readTime} min read</span>
                      {carolynePreview.source_url && <><span>·</span><a href={carolynePreview.source_url} target="_blank" rel="noopener noreferrer" style={{color:'#16a34a',textDecoration:'none'}}>Source →</a></>}
                    </div>

                    {carolynePreview.status === 'pending' ? (
                      <input value={carolyneEditTitle} onChange={e => setCarolyneEditTitle(e.target.value)} placeholder="Article title" style={{fontSize:22,fontWeight:700,fontFamily:'var(--font-sora)',color:'var(--tx)',border:'1px solid var(--b)',borderRadius:8,padding:'8px 12px',width:'100%',marginBottom:16,background:'transparent',boxSizing:'border-box'}} />
                    ) : (
                      <h1 style={{fontSize:22,fontWeight:700,fontFamily:'var(--font-sora)',color:'var(--tx)',marginBottom:16,marginTop:0}}>{carolynePreview.content?.title}</h1>
                    )}

                    {carolynePreview.content?.tldr && (
                      <div style={{padding:'12px 16px',borderRadius:10,background:'rgba(22,163,74,.05)',border:'1px solid rgba(22,163,74,.15)',marginBottom:24,fontSize:13,color:'var(--tx2)',lineHeight:1.6}}>
                        <strong style={{color:'#16a34a',fontSize:11,textTransform:'uppercase',letterSpacing:'.06em'}}>TL;DR</strong><br/>{carolynePreview.content.tldr}
                      </div>
                    )}

                    {(carolynePreview.status === 'pending' ? carolyneEditSections : carolynePreview.content?.sections || []).map((sec: any, i: number) => (
                      <div key={i} style={{marginBottom:24}}>
                        {carolynePreview.status === 'pending' ? (
                          <>
                            <input value={sec.heading} onChange={e => { const s = [...carolyneEditSections]; s[i] = {...s[i], heading: e.target.value}; setCarolyneEditSections(s) }} placeholder="Section heading" style={{fontSize:16,fontWeight:600,fontFamily:'var(--font-sora)',color:'var(--tx)',border:'1px solid var(--b)',borderRadius:6,padding:'6px 10px',width:'100%',marginBottom:8,background:'transparent',boxSizing:'border-box'}} />
                            <textarea value={sec.body} onChange={e => { const s = [...carolyneEditSections]; s[i] = {...s[i], body: e.target.value}; setCarolyneEditSections(s) }} rows={5} placeholder="Write section content…" style={{fontSize:13,lineHeight:1.7,color:'var(--tx2)',border:'1px solid var(--b)',borderRadius:6,padding:'8px 10px',width:'100%',resize:'vertical',fontFamily:'inherit',background:'transparent',boxSizing:'border-box'}} />
                          </>
                        ) : (
                          <>
                            <h2 style={{fontSize:16,fontWeight:600,fontFamily:'var(--font-sora)',color:'var(--tx)',marginBottom:8,marginTop:0}}>{sec.heading}</h2>
                            <p style={{fontSize:13,lineHeight:1.7,color:'var(--tx2)',margin:0}}>{sec.body}</p>
                          </>
                        )}
                      </div>
                    ))}

                    {carolynePreview.content?.paa?.length > 0 && (
                      <div style={{marginTop:24,padding:16,borderRadius:10,border:'1px solid var(--b)',background:'rgba(0,0,0,.02)'}}>
                        <h3 style={{fontSize:13,fontWeight:600,color:'var(--tx)',marginBottom:12,marginTop:0}}>People Also Ask</h3>
                        {carolynePreview.content.paa.map((qa: any, i: number) => (
                          <div key={i} style={{marginBottom:12}}>
                            <div style={{fontSize:13,fontWeight:600,color:'var(--tx)',marginBottom:4}}>{qa.q}</div>
                            <div style={{fontSize:12,color:'var(--tx2)',lineHeight:1.6}}>{qa.a}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {carolynePreview.content?.cta && (
                      <div style={{marginTop:24,padding:16,borderRadius:10,background:'rgba(22,163,74,.06)',border:'1px solid rgba(22,163,74,.15)'}}>
                        <div style={{fontSize:14,fontWeight:600,color:'#16a34a',marginBottom:4}}>{carolynePreview.content.cta.heading}</div>
                        <div style={{fontSize:12,color:'var(--tx2)'}}>{carolynePreview.content.cta.body}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

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

        {/* ── AUTOMATION TAB ── */}
        {mainTab === 'automation' && (
          <>
            <div style={{marginBottom:20}}>
              <div style={{fontSize:14,fontWeight:600,color:'var(--tx)'}}>Automated Jobs</div>
              <div style={{fontSize:12,color:'var(--tx3)',marginTop:2}}>Cron jobs that run automatically on schedule. You can also trigger them manually.</div>
            </div>

            {([
              {id:'source-sync',   icon:'🔄', name:'Source Data Sync',     desc:'Refreshes all connected Shopify, Stripe, Xero, Amazon data.',         schedule:'Daily at 5am'},
              {id:'daily-brief',   icon:'📋', name:'Daily Brief Generator', desc:'Pre-generates AI morning briefs for all users + emails them.',        schedule:'Daily at 7am'},
              {id:'token-refresh', icon:'🔑', name:'OAuth Token Refresh',   desc:'Pre-emptively refreshes tokens for all integrations before expiry.',  schedule:'Daily at 1am'},
              {id:'stale-content', icon:'🧹', name:'Stale Content Cleanup', desc:'Deletes rejected + stale pending content older than 30 days.',        schedule:'Weekly Sunday 5am'},
              {id:'seo-monitor',   icon:'📊', name:'SEO Monitor',           desc:'Checks Google Search Console for traffic drops + broken pages.',      schedule:'Weekly Monday 9am'},
              {id:'stock-replenishment', icon:'📦', name:'Stock Replenishment', desc:'Analyses POS sales velocity, predicts stockouts, generates reorder suggestions for all users.', schedule:'Daily at 6am'},
            ] as const).map(job => {
              const state = autoJobs[job.id]
              return (
                <div key={job.id} style={{padding:20,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)',marginBottom:12}}>
                  <div style={{display:'flex',alignItems:'center',gap:14}}>
                    <div style={{width:44,height:44,borderRadius:12,background:'rgba(99,102,241,.08)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>{job.icon}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:2}}>
                        <span style={{fontSize:14,fontWeight:600,color:'var(--tx)'}}>{job.name}</span>
                        <span style={{fontSize:10,padding:'2px 8px',borderRadius:9999,background:'rgba(99,102,241,.08)',color:'#6366F1',fontWeight:600}}>{job.schedule}</span>
                      </div>
                      <div style={{fontSize:12,color:'var(--tx3)',lineHeight:1.5}}>{job.desc}</div>
                    </div>
                    <button onClick={() => runAutoJob(job.id)} disabled={state?.running} style={{padding:'10px 20px',borderRadius:9999,border:'none',background:state?.running?'var(--b)':'#6366F1',color:state?.running?'var(--tx3)':'#fff',fontSize:13,fontWeight:600,cursor:state?.running?'wait':'pointer',fontFamily:'inherit',flexShrink:0}}>
                      {state?.running ? 'Running...' : 'Run Now'}
                    </button>
                  </div>

                  {state?.lastRun && (
                    <div style={{marginTop:12,fontSize:11,color:'var(--tx3)'}}>
                      Last run: {new Date(state.lastRun).toLocaleString('en-GB')}
                    </div>
                  )}

                  {state?.result && (
                    <div style={{marginTop:12,padding:'12px 14px',borderRadius:10,background:'var(--ev)',border:'1px solid var(--b)',fontSize:12,fontFamily:'monospace',color:'var(--tx2)',maxHeight:180,overflowY:'auto',whiteSpace:'pre-wrap',wordBreak:'break-word'}}>
                      {JSON.stringify(state.result, null, 2)}
                    </div>
                  )}
                </div>
              )
            })}

            {/* ── AI DISCOVERY REGISTRATION AGENT ── */}
            <DiscoveryAgentCard />

            {/* Blog auto-publish info */}
            <div style={{padding:20,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)',marginBottom:12}}>
              <div style={{display:'flex',alignItems:'center',gap:14}}>
                <div style={{width:44,height:44,borderRadius:12,background:'rgba(16,185,129,.08)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>✨</div>
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:2}}>
                    <span style={{fontSize:14,fontWeight:600,color:'var(--tx)'}}>Blog Auto-Publish</span>
                    <span style={{fontSize:10,padding:'2px 8px',borderRadius:9999,background:'rgba(16,185,129,.1)',color:'#10b981',fontWeight:600}}>Active</span>
                  </div>
                  <div style={{fontSize:12,color:'var(--tx3)',lineHeight:1.5}}>High-quality blog posts (score 80+) are auto-published by Alice Watson. Lower-scoring posts go to Pending Review. Google & Bing are pinged on every publish.</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── SECURITY & GDPR TAB ── */}
        {mainTab === 'security' && (
          <>
            {/* Header row */}
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20,flexWrap:'wrap',gap:10}}>
              <div>
                <div style={{fontSize:14,fontWeight:600,color:'var(--tx)'}}>Security & GDPR Audit</div>
                <div style={{fontSize:12,color:'var(--tx3)',marginTop:2}}>Automated weekly on Mondays · 8 check categories · Reports stored for compliance evidence</div>
              </div>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                <button onClick={()=>exportSecurityCsv()} disabled={secExporting || secHistory.length===0} style={{padding:'8px 14px',borderRadius:9999,border:'1px solid var(--b)',background:'transparent',color:'var(--tx2)',fontSize:12,fontWeight:500,cursor:secHistory.length===0?'not-allowed':'pointer',fontFamily:'inherit',opacity:secHistory.length===0?0.5:1}}>
                  {secExporting?'Exporting...':'📥 Export All CSV'}
                </button>
                <button onClick={runSecurityAudit} disabled={secRunning} style={{padding:'8px 16px',borderRadius:9999,border:'none',background:secRunning?'var(--b)':'#6366F1',color:secRunning?'var(--tx3)':'#fff',fontSize:12,fontWeight:600,cursor:secRunning?'wait':'pointer',fontFamily:'inherit'}}>
                  {secRunning?'Running Audit...':'Run Audit Now'}
                </button>
              </div>
            </div>

            {/* Current report */}
            {secReport && (
              <>
                {/* Summary cards */}
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:10,marginBottom:20}}>
                  {[
                    {label:'Overall',value:SEC_STATUS[secReport.overall_status as keyof typeof SEC_STATUS]?.label||'—',color:SEC_STATUS[secReport.overall_status as keyof typeof SEC_STATUS]?.color||'var(--tx)'},
                    {label:'Total Checks',value:secReport.total_checks,color:'var(--tx)'},
                    {label:'Passed',value:secReport.passed,color:'#16a34a'},
                    {label:'Warnings',value:secReport.warnings,color:'#d97706'},
                    {label:'Failures',value:secReport.failures,color:'#dc2626'},
                    {label:'Duration',value:secReport.duration_ms+'ms',color:'var(--tx3)'},
                  ].map(({label,value,color})=>(
                    <div key={label} style={{padding:14,borderRadius:12,border:'1px solid var(--b)',background:'var(--sf)'}}>
                      <div style={{fontSize:10,fontWeight:600,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:6}}>{label}</div>
                      <div style={{fontSize:20,fontWeight:700,fontFamily:'var(--font-sora)',color}}>{value}</div>
                    </div>
                  ))}
                </div>

                {/* Category breakdown */}
                {secReport.categories?.map((cat: any) => {
                  const st = SEC_STATUS[cat.status as keyof typeof SEC_STATUS]
                  const isExpanded = secExpanded === cat.category
                  return (
                    <div key={cat.category} style={{marginBottom:10,borderRadius:12,border:`1px solid ${st?.border||'var(--b)'}`,overflow:'hidden',background:'var(--sf)'}}>
                      <div
                        onClick={()=>setSecExpanded(isExpanded?null:cat.category)}
                        style={{padding:'12px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',cursor:'pointer',background:st?.bg||'transparent'}}
                        onMouseEnter={e=>e.currentTarget.style.opacity='0.85'}
                        onMouseLeave={e=>e.currentTarget.style.opacity='1'}
                      >
                        <div style={{display:'flex',alignItems:'center',gap:10}}>
                          <span style={{fontSize:14,fontWeight:700,color:st?.color}}>{st?.icon}</span>
                          <span style={{fontSize:13,fontWeight:600,color:'var(--tx)'}}>{cat.category}</span>
                          <span style={{fontSize:11,color:'var(--tx3)'}}>{cat.checks.length} checks</span>
                        </div>
                        <div style={{display:'flex',alignItems:'center',gap:8}}>
                          <span style={{fontSize:11,fontWeight:600,color:st?.color,background:st?.bg,border:`1px solid ${st?.border}`,padding:'2px 10px',borderRadius:9999}}>{st?.label}</span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2" strokeLinecap="round" style={{transform:isExpanded?'rotate(180deg)':'none',transition:'transform 150ms'}}><path d="M6 9l6 6 6-6"/></svg>
                        </div>
                      </div>
                      {isExpanded && (
                        <div style={{borderTop:`1px solid ${st?.border||'var(--b)'}`}}>
                          {cat.checks.map((check: any, i: number) => {
                            const cst = SEC_STATUS[check.status as keyof typeof SEC_STATUS]
                            return (
                              <div key={i} style={{padding:'10px 16px',borderBottom:i<cat.checks.length-1?'1px solid var(--b)':'none',display:'flex',alignItems:'flex-start',gap:10}}>
                                <span style={{fontSize:12,fontWeight:700,color:cst?.color,flexShrink:0,marginTop:1}}>{cst?.icon}</span>
                                <div style={{flex:1,minWidth:0}}>
                                  <div style={{fontSize:12,fontWeight:500,color:'var(--tx)',marginBottom:2}}>{check.name}</div>
                                  <div style={{fontSize:11,color:'var(--tx3)',lineHeight:1.5}}>{check.detail}</div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}

                {/* Sub-processors */}
                {secReport.sub_processors && (
                  <div style={{marginTop:16,padding:16,borderRadius:12,border:'1px solid var(--b)',background:'var(--sf)'}}>
                    <div style={{fontSize:12,fontWeight:700,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:10}}>GDPR Sub-Processors</div>
                    <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                      {secReport.sub_processors.map((sp: string) => (
                        <span key={sp} style={{padding:'4px 10px',borderRadius:9999,background:'rgba(99,102,241,.06)',border:'1px solid rgba(99,102,241,.15)',fontSize:11,color:'#6366F1',fontWeight:500}}>{sp}</span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {!secReport && !secRunning && (
              <div style={{textAlign:'center',padding:'60px 0',color:'var(--tx3)'}}>
                <div style={{fontSize:32,marginBottom:12}}>🛡</div>
                <div style={{fontSize:14,fontWeight:500,marginBottom:4}}>No audit reports yet</div>
                <div style={{fontSize:12}}>Run your first security & GDPR audit to generate a report.</div>
              </div>
            )}

            {/* Audit history */}
            {secHistory.length > 0 && (
              <div style={{marginTop:24}}>
                <div style={{fontSize:13,fontWeight:600,color:'var(--tx)',marginBottom:12}}>Audit History</div>
                <div style={{borderRadius:12,border:'1px solid var(--b)',overflow:'hidden',background:'var(--sf)'}}>
                  {secHistory.map((audit: any) => {
                    const st = SEC_STATUS[audit.overall_status as keyof typeof SEC_STATUS]
                    return (
                      <div key={audit.run_id} style={{padding:'12px 16px',borderBottom:'1px solid var(--b)',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
                        <div style={{display:'flex',alignItems:'center',gap:10}}>
                          <span style={{fontSize:11,fontWeight:600,color:st?.color,background:st?.bg,border:`1px solid ${st?.border}`,padding:'2px 10px',borderRadius:9999}}>{st?.icon} {st?.label}</span>
                          <span style={{fontSize:12,color:'var(--tx2)'}}>{audit.passed}/{audit.total_checks} passed</span>
                          {audit.failures > 0 && <span style={{fontSize:11,color:'#dc2626',fontWeight:500}}>{audit.failures} failures</span>}
                          {audit.warnings > 0 && <span style={{fontSize:11,color:'#d97706',fontWeight:500}}>{audit.warnings} warnings</span>}
                        </div>
                        <div style={{display:'flex',alignItems:'center',gap:8}}>
                          <span style={{fontSize:11,color:'var(--tx3)'}}>{new Date(audit.created_at).toLocaleString('en-GB')}</span>
                          <button onClick={()=>{setSecReport(audit.report);window.scrollTo({top:0,behavior:'smooth'})}} style={{padding:'4px 10px',borderRadius:9999,border:'1px solid var(--b)',background:'transparent',color:'var(--tx2)',fontSize:11,cursor:'pointer',fontFamily:'inherit'}}>View</button>
                          <button onClick={()=>exportSecurityCsv(audit.run_id)} style={{padding:'4px 10px',borderRadius:9999,border:'1px solid var(--b)',background:'transparent',color:'var(--tx2)',fontSize:11,cursor:'pointer',fontFamily:'inherit'}}>CSV</button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
