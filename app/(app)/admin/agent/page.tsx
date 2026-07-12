'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import DiscoveryAgentCard from '@/components/admin/DiscoveryAgentCard'
import { useLang } from '@/components/LanguageProvider'

const ADMIN_EMAILS = ['emomery10@gmail.com', 'emomery10@googlemail.com']

function buildPresets(tc: (k: string) => string) {
  return [
    { id: 'sme_pain',         label: tc('page_admin_agent.presetSmePain'),        query: 'small business struggling cash flow margins' },
    { id: 'shopify_problems', label: tc('page_admin_agent.presetShopifyProblems'), query: 'shopify margins profit not making money' },
    { id: 'amazon_sellers',   label: tc('page_admin_agent.presetAmazonSellers'),   query: 'amazon fba fees margins profit' },
    { id: 'ecommerce_data',   label: tc('page_admin_agent.presetEcommerceData'),   query: 'ecommerce analytics best selling product track sales' },
    { id: 'ai_business',      label: tc('page_admin_agent.presetAiBusiness'),      query: 'AI small business analytics data insights founder' },
    { id: 'uk_retail',        label: tc('page_admin_agent.presetUkRetail'),        query: 'UK retail shop inflation costs margins' },
  ]
}

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

// Scout routes run maxDuration=800s server-side; give the fetch a little
// headroom past that so a real (slow but successful) run isn't aborted out
// from under itself, while still guaranteeing the button can't hang forever
// if the platform drops the connection instead of returning an error.
const SCOUT_FETCH_TIMEOUT_MS = 820_000

async function fetchScoutRun(url: string) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), SCOUT_FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(url, { signal: controller.signal })
    return await res.json()
  } catch (e: any) {
    if (e?.name === 'AbortError') {
      throw new Error('Timed out waiting for a response — the run may still be finishing server-side, check back shortly')
    }
    throw e
  } finally {
    clearTimeout(timer)
  }
}

export default function AgentAdminPage() {
  const { tc } = useLang()
  const PRESETS = buildPresets(tc)
  const router = useRouter()
  const supabase = createClient()
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading]       = useState(true)
  const [mainTab, setMainTab]       = useState<'marketing-specialist'|'agent'|'x'|'security'|'automation'>('marketing-specialist')
  const [agentTab, setAgentTab]     = useState<'alice'|'victor'|'carolyne'|'ben'|'maya'|'jane'>('alice')

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

  // Victor Ojeakhena — African Marketing Intelligence state
  const [victorItems, setVictorItems]           = useState<any[]>([])
  const [victorCounts, setVictorCounts]         = useState<{pending:number;published:number;rejected:number;total:number}>({pending:0,published:0,rejected:0,total:0})
  const [victorFilter, setVictorFilter]         = useState<'pending'|'published'|'rejected'|'all'>('pending')
  const [victorRunning, setVictorRunning]       = useState(false)
  const [victorRunLog, setVictorRunLog]         = useState<string[]>([])
  const [victorPreview, setVictorPreview]       = useState<any>(null)
  const [victorActing, setVictorActing]         = useState<string|null>(null)
  const [victorEditTitle, setVictorEditTitle]   = useState('')
  const [victorEditSections, setVictorEditSections] = useState<{heading:string;level:2|3;body:string}[]>([])

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

  // Maya Chen — Marketing Intelligence state
  const [mayaItems, setMayaItems]           = useState<any[]>([])
  const [mayaCounts, setMayaCounts]         = useState<{pending:number;published:number;rejected:number;total:number}>({pending:0,published:0,rejected:0,total:0})
  const [mayaFilter, setMayaFilter]         = useState<'pending'|'published'|'rejected'|'all'>('pending')
  const [mayaRunning, setMayaRunning]       = useState(false)
  const [mayaRunLog, setMayaRunLog]         = useState<string[]>([])
  const [mayaPreview, setMayaPreview]       = useState<any>(null)
  const [mayaActing, setMayaActing]         = useState<string|null>(null)
  const [mayaEditTitle, setMayaEditTitle]   = useState('')
  const [mayaEditSections, setMayaEditSections] = useState<{heading:string;level:2|3;body:string}[]>([])

  // Jane Wanjiru — Community Growth (WhatsApp/Facebook community posts) state
  const [janeItems, setJaneItems]           = useState<any[]>([])
  const [janeCounts, setJaneCounts]         = useState<{pending:number;published:number;rejected:number;total:number}>({pending:0,published:0,rejected:0,total:0})
  const [janeFilter, setJaneFilter]         = useState<'pending'|'published'|'rejected'|'all'>('pending')
  const [janeRunning, setJaneRunning]       = useState(false)
  const [janeRunLog, setJaneRunLog]         = useState<string[]>([])
  const [janePreview, setJanePreview]       = useState<any>(null)
  const [janeActing, setJaneActing]         = useState<string|null>(null)
  const [janeEditWhatsapp, setJaneEditWhatsapp] = useState('')
  const [janeEditFacebook, setJaneEditFacebook] = useState('')

  // Loading states — prevent misleading 0s on initial render
  const [aliceLoading, setAliceLoading]       = useState(true)
  const [victorLoading, setVictorLoading]     = useState(true)
  const [carolyneLoading, setCarolyneLoading] = useState(true)
  const [benLoading, setBenLoading]           = useState(true)
  const [mayaLoading, setMayaLoading]         = useState(true)
  const [janeLoading, setJaneLoading]         = useState(true)

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
      showToast(data.success ? tc('page_admin_agent.jobCompleted', { jobId }) : (data.error || 'Failed'), !!data.success)
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
    if (authorized && mainTab === 'marketing-specialist' && agentTab === 'alice') {
      loadAliceItems()
      loadAliceCounts()
    }
  }, [authorized, mainTab, agentTab, loadAliceItems, loadAliceCounts])

  // ── Victor load functions ──
  const loadVictorCounts = useCallback(async () => {
    try {
      const res = await fetch(`/api/agent/victor-scout/list?counts=1&t=${Date.now()}`, { cache: 'no-store' })
      const d   = await res.json()
      setVictorCounts({ pending: d.pending || 0, published: d.published || 0, rejected: d.rejected || 0, total: d.total || 0 })
    } catch {}
  }, [])

  const loadVictorItems = useCallback(async () => {
    try {
      const res = await fetch(`/api/agent/victor-scout/list?status=${victorFilter}&t=${Date.now()}`, { cache: 'no-store' })
      const d   = await res.json()
      setVictorItems(d.items || [])
    } catch { setVictorItems([]) }
    finally { setVictorLoading(false) }
  }, [victorFilter])

  useEffect(() => {
    if (authorized && mainTab === 'marketing-specialist' && agentTab === 'victor') {
      loadVictorItems()
      loadVictorCounts()
    }
  }, [authorized, mainTab, agentTab, loadVictorItems, loadVictorCounts])

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
    if (authorized && mainTab === 'marketing-specialist' && agentTab === 'carolyne') {
      loadCarolyneItems()
      loadCarolyneCounts()
    }
  }, [authorized, mainTab, agentTab, loadCarolyneItems, loadCarolyneCounts])

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
    if (authorized && mainTab === 'marketing-specialist' && agentTab === 'ben') {
      loadBenItems()
      loadBenCounts()
    }
  }, [authorized, mainTab, agentTab, loadBenItems, loadBenCounts])

  // ── Maya Chen load functions ──
  const loadMayaCounts = useCallback(async () => {
    try {
      const res = await fetch(`/api/agent/marketing-scout/list?counts=1&t=${Date.now()}`, { cache: 'no-store' })
      const d   = await res.json()
      setMayaCounts({ pending: d.pending || 0, published: d.published || 0, rejected: d.rejected || 0, total: d.total || 0 })
    } catch {}
  }, [])

  const loadMayaItems = useCallback(async () => {
    try {
      const res = await fetch(`/api/agent/marketing-scout/list?status=${mayaFilter}&t=${Date.now()}`, { cache: 'no-store' })
      const d   = await res.json()
      setMayaItems(d.items || [])
    } catch { setMayaItems([]) }
    finally { setMayaLoading(false) }
  }, [mayaFilter])

  useEffect(() => {
    if (authorized && mainTab === 'marketing-specialist' && agentTab === 'maya') {
      loadMayaItems()
      loadMayaCounts()
    }
  }, [authorized, mainTab, agentTab, loadMayaItems, loadMayaCounts])

  // ── Jane Wanjiru load functions ──
  const loadJaneCounts = useCallback(async () => {
    try {
      const res = await fetch(`/api/agent/community-scout/list?counts=1&t=${Date.now()}`, { cache: 'no-store' })
      const d   = await res.json()
      setJaneCounts({ pending: d.pending || 0, published: d.published || 0, rejected: d.rejected || 0, total: d.total || 0 })
    } catch {}
  }, [])

  const loadJaneItems = useCallback(async () => {
    try {
      const res = await fetch(`/api/agent/community-scout/list?status=${janeFilter}&t=${Date.now()}`, { cache: 'no-store' })
      const d   = await res.json()
      setJaneItems(d.items || [])
    } catch { setJaneItems([]) }
    finally { setJaneLoading(false) }
  }, [janeFilter])

  useEffect(() => {
    if (authorized && mainTab === 'marketing-specialist' && agentTab === 'jane') {
      loadJaneItems()
      loadJaneCounts()
    }
  }, [authorized, mainTab, agentTab, loadJaneItems, loadJaneCounts])

  const runAliceScout = async () => {
    setAliceRunning(true); setAliceRunLog(['Alice is scanning for today\'s stories...'])
    try {
      const data = await fetchScoutRun('/api/agent/blog-scout?secret=dev-test')
      setAliceRunLog(data.log || [String(data.error || 'Unknown error')])
      if (data.skipped) { showToast('Already ran today — no duplicates', true) }
      else if (data.success) { showToast(tc('page_admin_agent.aliceDrafted', { n: data.blogsGenerated })); setAliceLoading(true); setAliceFilter('published'); loadAliceCounts() }
      else showToast(tc('page_admin_agent.scoutFailedLog'), false)
    } catch (e) { setAliceRunLog([`Error: ${String(e)}`]); showToast(tc('page_admin_agent.scoutFailed'), false) }
    finally { setAliceRunning(false) }
  }

  const runVictorScout = async () => {
    setVictorRunning(true); setVictorRunLog(['Victor is scanning Nigeria, West & South Africa marketing signals...'])
    try {
      const data = await fetchScoutRun('/api/agent/victor-scout?secret=dev-test')
      setVictorRunLog(data.log || [String(data.error || 'Unknown error')])
      if (data.skipped) { showToast('Already ran today — no duplicates', true) }
      else if (data.success) { showToast(tc('page_admin_agent.victorDrafted', { n: data.blogsGenerated })); setVictorLoading(true); setVictorFilter('published'); loadVictorCounts() }
      else showToast(tc('page_admin_agent.scoutFailedLog'), false)
    } catch (e) { setVictorRunLog([`Error: ${String(e)}`]); showToast(tc('page_admin_agent.scoutFailed'), false) }
    finally { setVictorRunning(false) }
  }

  const openVictorPreview = (item: any) => {
    setVictorPreview(item)
    setVictorEditTitle(item.content?.title || '')
    setVictorEditSections(item.content?.sections ? JSON.parse(JSON.stringify(item.content.sections)) : [])
  }

  const handleVictorAction = async (id: string, action: 'approve'|'reject') => {
    setVictorActing(id)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const body: any = { id, action }
      if (action === 'approve' && victorPreview) {
        body.content = { ...victorPreview.content, title: victorEditTitle, sections: victorEditSections }
      }
      const res = await fetch('/api/agent/approve', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}) },
        body:    JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok || !data.success) { showToast(data.error || `Failed (${res.status})`, false); return }
      if (action === 'approve' && data.slug) {
        showToast(tc('page_admin_agent.publishedToBlog', { slug: data.slug }))
      } else {
        showToast(action === 'approve' ? tc('page_admin_agent.authorisedAndPublished') : tc('page_admin_agent.toastRejected'))
      }
      setVictorPreview(null)
      setVictorItems(prev => prev.filter(item => item.id !== id))
      setVictorCounts(prev => ({
        ...prev,
        pending:   prev.pending - 1,
        published: action === 'approve' ? prev.published + 1 : prev.published,
        rejected:  action === 'reject'  ? prev.rejected  + 1 : prev.rejected,
      }))
    } catch (e) { showToast(String(e), false) }
    finally { setVictorActing(null) }
  }

  const runBenScout = async () => {
    setBenRunning(true); setBenRunLog(['Ben is scanning US markets for today\'s stories...'])
    try {
      const data = await fetchScoutRun('/api/agent/ben-scout?secret=dev-test')
      setBenRunLog(data.log || [String(data.error || 'Unknown error')])
      if (data.skipped) { showToast('Already ran today — no duplicates', true) }
      else if (data.success) { showToast(tc('page_admin_agent.benDrafted', { n: data.blogsGenerated })); setBenLoading(true); setBenFilter('published'); loadBenCounts() }
      else showToast(tc('page_admin_agent.scoutFailedLog'), false)
    } catch (e) { setBenRunLog([`Error: ${String(e)}`]); showToast(tc('page_admin_agent.scoutFailed'), false) }
    finally { setBenRunning(false) }
  }

  const openBenPreview = (item: any) => {
    setBenPreview(item)
    setBenEditTitle(item.content?.title || '')
    setBenEditSections(item.content?.sections ? JSON.parse(JSON.stringify(item.content.sections)) : [])
  }

  const handleBenAction = async (id: string, action: 'approve'|'reject') => {
    setBenActing(id)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const body: any = { id, action }
      if (action === 'approve' && benPreview) {
        body.content = { ...benPreview.content, title: benEditTitle, sections: benEditSections }
      }
      const res = await fetch('/api/agent/approve', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}) },
        body:    JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok || !data.success) { showToast(data.error || `Failed (${res.status})`, false); return }
      if (action === 'approve' && data.slug) {
        showToast(tc('page_admin_agent.publishedToBlog', { slug: data.slug }))
      } else {
        showToast(action === 'approve' ? tc('page_admin_agent.authorisedAndPublished') : tc('page_admin_agent.toastRejected'))
      }
      setBenPreview(null)
      setBenItems(prev => prev.filter(item => item.id !== id))
      setBenCounts(prev => ({
        ...prev,
        pending:   prev.pending - 1,
        published: action === 'approve' ? prev.published + 1 : prev.published,
        rejected:  action === 'reject'  ? prev.rejected  + 1 : prev.rejected,
      }))
    } catch (e) { showToast(String(e), false) }
    finally { setBenActing(null) }
  }

  const runCarolyneScout = async () => {
    setCarolyneRunning(true); setCarolyneRunLog(['Carolyne is scanning East African markets...'])
    try {
      const data = await fetchScoutRun('/api/agent/carolyne-scout?secret=dev-test')
      setCarolyneRunLog(data.log || [String(data.error || 'Unknown error')])
      if (data.skipped) { showToast('Already ran today — no duplicates', true) }
      else if (data.success) { showToast(tc('page_admin_agent.carolyneDrafted', { n: data.blogsGenerated })); setCarolyneLoading(true); setCarolyneFilter('published'); loadCarolyneCounts() }
      else showToast(tc('page_admin_agent.scoutFailedLog'), false)
    } catch (e) { setCarolyneRunLog([`Error: ${String(e)}`]); showToast(tc('page_admin_agent.scoutFailed'), false) }
    finally { setCarolyneRunning(false) }
  }

  const runMayaScout = async () => {
    setMayaRunning(true); setMayaRunLog(['Maya is scanning global marketing signals...'])
    try {
      const data = await fetchScoutRun('/api/agent/marketing-scout?secret=dev-test')
      setMayaRunLog(data.log || [String(data.error || 'Unknown error')])
      if (data.skipped) { showToast('Already ran today — no duplicates', true) }
      else if (data.success) { showToast(tc('page_admin_agent.mayaDrafted', { n: data.blogsGenerated })); setMayaLoading(true); setMayaFilter('published'); loadMayaCounts() }
      else showToast(tc('page_admin_agent.scoutFailedLog'), false)
    } catch (e) { setMayaRunLog([`Error: ${String(e)}`]); showToast(tc('page_admin_agent.scoutFailed'), false) }
    finally { setMayaRunning(false) }
  }

  const openMayaPreview = (item: any) => {
    setMayaPreview(item)
    setMayaEditTitle(item.content?.title || '')
    setMayaEditSections(item.content?.sections ? JSON.parse(JSON.stringify(item.content.sections)) : [])
  }

  const handleMayaAction = async (id: string, action: 'approve'|'reject') => {
    setMayaActing(id)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const body: any = { id, action }
      if (action === 'approve' && mayaPreview) {
        body.content = { ...mayaPreview.content, title: mayaEditTitle, sections: mayaEditSections }
      }
      const res = await fetch('/api/agent/approve', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}) },
        body:    JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok || !data.success) { showToast(data.error || `Failed (${res.status})`, false); return }
      if (action === 'approve' && data.slug) {
        showToast(tc('page_admin_agent.publishedToBlog', { slug: data.slug }))
      } else {
        showToast(action === 'approve' ? tc('page_admin_agent.authorisedAndPublished') : tc('page_admin_agent.toastRejected'))
      }
      setMayaPreview(null)
      setMayaItems(prev => prev.filter(item => item.id !== id))
      setMayaCounts(prev => ({
        ...prev,
        pending:   prev.pending - 1,
        published: action === 'approve' ? prev.published + 1 : prev.published,
        rejected:  action === 'reject'  ? prev.rejected  + 1 : prev.rejected,
      }))
    } catch (e) { showToast(String(e), false) }
    finally { setMayaActing(null) }
  }

  const runJaneScout = async () => {
    setJaneRunning(true); setJaneRunLog(['Jane is drafting today\'s community posts...'])
    try {
      const data = await fetchScoutRun('/api/agent/community-scout?secret=dev-test')
      setJaneRunLog(data.log || [String(data.error || 'Unknown error')])
      if (data.skipped) { showToast('Already ran today — no duplicates', true) }
      else if (data.success) { showToast(`Jane drafted ${data.blogsGenerated} community post(s)`); setJaneLoading(true); setJaneFilter('pending'); loadJaneItems(); loadJaneCounts() }
      else showToast(tc('page_admin_agent.scoutFailedLog'), false)
    } catch (e) { setJaneRunLog([`Error: ${String(e)}`]); showToast(tc('page_admin_agent.scoutFailed'), false) }
    finally { setJaneRunning(false) }
  }

  const openJanePreview = (item: any) => {
    setJanePreview(item)
    setJaneEditWhatsapp(item.content?.whatsappText || '')
    setJaneEditFacebook(item.content?.facebookText || '')
  }

  const handleJaneAction = async (id: string, action: 'approve'|'reject') => {
    setJaneActing(id)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const body: any = { id, action }
      if (action === 'approve' && janePreview) {
        body.content = { ...janePreview.content, whatsappText: janeEditWhatsapp, facebookText: janeEditFacebook }
      }
      const res = await fetch('/api/agent/approve', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}) },
        body:    JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok || !data.success) { showToast(data.error || `Failed (${res.status})`, false); return }
      showToast(action === 'approve' ? 'Approved — ready to copy-paste' : tc('page_admin_agent.toastRejected'))
      setJanePreview(null)
      setJaneItems(prev => prev.filter(item => item.id !== id))
      setJaneCounts(prev => ({
        ...prev,
        pending:   prev.pending - 1,
        published: action === 'approve' ? prev.published + 1 : prev.published,
        rejected:  action === 'reject'  ? prev.rejected  + 1 : prev.rejected,
      }))
    } catch (e) { showToast(String(e), false) }
    finally { setJaneActing(null) }
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
        showToast(tc('page_admin_agent.publishedToBlog', { slug: data.slug }))
      } else {
        showToast(action === 'approve' ? tc('page_admin_agent.publishedToBlogToast') : tc('page_admin_agent.toastRejected'))
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
      showToast(action === 'approve' ? tc('page_admin_agent.authorisedAndPublished') : tc('page_admin_agent.toastRejected'))
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
        showToast(tc('page_admin_agent.auditComplete', { passed: d.report.passed, total: d.report.total_checks }))
        loadSecHistory()
      } else showToast(d.error || tc('page_admin_agent.auditFailed'), false)
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
      showToast(tc('page_admin_agent.csvExported'))
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
      if (data.success) { showToast(tc('page_admin_agent.agentComplete', { n: data.itemsSaved })); loadItems() }
      else showToast(tc('page_admin_agent.agentFailed'), false)
    } catch (e) { setRunLog([`Error: ${String(e)}`]); showToast(tc('page_admin_agent.agentFailed'), false) }
    finally { setRunning(false) }
  }

  const handleAction = async (id: string, action: 'approve'|'reject') => {
    setActionLoading(id)
    try {
      const res = await fetch('/api/agent/approve', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({id, action}) })
      const data = await res.json()
      if (data.success) { showToast(action === 'approve' ? tc('page_admin_agent.approved') : tc('page_admin_agent.rejectedIcon')); loadItems() }
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
      showToast(tc('page_admin_agent.generatedPosts', { n: d.tweets?.length || 0 }))
      loadXQueue()
    } catch (e: any) { showToast(e.message, false) }
    finally { setSearching(false) }
  }

  const handleXPost = async (item: any, isResult = false) => {
    // Get the reply text — for results use item.reply, for queue use item.generated_reply
    const replyText = isResult ? item.reply : item.generated_reply
    if (!replyText || replyText.trim().length === 0) {
      showToast(tc('page_admin_agent.noReplyText'), false)
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
      showToast(tc('page_admin_agent.postedToX'))
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
    showToast(tc('page_admin_agent.toastRejected')); loadXQueue()
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

  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',color:'var(--tx3)',fontSize:18}}>{tc('page_admin_agent.checkingAccess')}</div>
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
      {toast && <div style={{position:'fixed',top:16,right:16,zIndex:999,padding:'10px 16px',borderRadius:10,background:toast.ok?'rgba(34,197,94,.15)':'rgba(239,68,68,.15)',border:`1px solid ${toast.ok?'rgba(34,197,94,.3)':'rgba(239,68,68,.3)'}`,color:toast.ok?'#16a34a':'#dc2626',fontSize:17,fontWeight:500}}>{toast.msg}</div>}

      <div style={{maxWidth:900,margin:'0 auto'}}>
        {/* Header */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24,flexWrap:'wrap',gap:12}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:4}}>
              <button onClick={()=>router.push('/admin')} style={{padding:'4px 10px',borderRadius:9999,border:'1px solid var(--b)',background:'transparent',color:'var(--tx3)',fontSize:16,cursor:'pointer',fontFamily:'inherit'}}>{tc('page_admin_agent.back')}</button>
              <h1 style={{fontSize:24,fontWeight:700,fontFamily:'var(--font-sora)',margin:0}}>{tc('page_admin_agent.heading')}</h1>
              <span style={{fontSize:15,padding:'2px 8px',borderRadius:9999,background:'rgba(99,102,241,.1)',color:'#6366F1',fontWeight:600}}>{tc('page_admin_agent.adminOnly')}</span>
            </div>
            <p style={{fontSize:17,color:'var(--tx3)',margin:0}}>
              {mainTab === 'marketing-specialist' ? (
                agentTab === 'alice'    ? tc('page_admin_agent.subtitleAlice') :
                agentTab === 'victor'   ? tc('page_admin_agent.subtitleVictor') :
                agentTab === 'carolyne' ? tc('page_admin_agent.subtitleCarolyne') :
                agentTab === 'ben'      ? tc('page_admin_agent.subtitleBen') :
                agentTab === 'jane'     ? 'Short WhatsApp and Facebook posts for Kenya community groups — copy-paste ready after approval.' :
                                          tc('page_admin_agent.subtitleMaya')
              ) : mainTab === 'automation' ? tc('page_admin_agent.subtitleAutomation') :
                  mainTab === 'security'  ? tc('page_admin_agent.subtitleSecurity') :
                  tc('page_admin_agent.subtitleAgent')}
            </p>
          </div>
        </div>

        {/* Main tabs */}
        <div className="tab-strip" style={{borderBottom:'1px solid var(--b)',marginBottom:0,display:'flex',gap:0,overflowX:'auto'}}>
          {([['marketing-specialist',tc('page_admin_agent.tabMarketingSpecialist')],['automation',tc('page_admin_agent.tabAutomation')],['security',tc('page_admin_agent.tabSecurity')]] as [string,string][]).map(([t,label]) => {
            const tabColor = t === 'marketing-specialist' ? '#6366F1' : t === 'automation' ? '#ea580c' : '#16a34a'
            const active = mainTab === t
            return (
              <button key={t} onClick={()=>setMainTab(t as any)} style={{padding:'10px 20px',border:'none',background:'transparent',fontSize:17,fontWeight:active?600:400,color:active?tabColor:'var(--tx3)',borderBottom:active?`2px solid ${tabColor}`:'2px solid transparent',cursor:'pointer',fontFamily:'inherit',flexShrink:0,whiteSpace:'nowrap',transition:'color 150ms'}}>
                {label}
              </button>
            )
          })}
        </div>

        {/* Agent sub-tabs (shown only inside Marketing Specialist) */}
        {mainTab === 'marketing-specialist' && (
          <div style={{borderBottom:'1px solid var(--b)',marginBottom:24,display:'flex',gap:0,overflowX:'auto',background:'var(--sf)',paddingLeft:8}}>
            {([['alice',tc('page_admin_agent.tabAlice'),'#6366F1'],['victor',tc('page_admin_agent.tabVictor'),'#ea580c'],['carolyne',tc('page_admin_agent.tabCarolyne'),'#16a34a'],['ben',tc('page_admin_agent.tabBen'),'#1d4ed8'],['maya',tc('page_admin_agent.tabMaya'),'#e11d48'],['jane','Jane Wanjiru','#7c3aed']] as [string,string,string][]).map(([t,label,color]) => {
              const active = agentTab === t
              return (
                <button key={t} onClick={()=>setAgentTab(t as any)} style={{padding:'8px 16px',border:'none',background:'transparent',fontSize:16,fontWeight:active?600:400,color:active?color:'var(--tx3)',borderBottom:active?`2px solid ${color}`:'2px solid transparent',cursor:'pointer',fontFamily:'inherit',flexShrink:0,whiteSpace:'nowrap',transition:'color 150ms'}}>
                  {label}
                </button>
              )
            })}
          </div>
        )}

        {/* ── ALICE WATSON — BLOG SCOUT ── */}
        {mainTab === 'marketing-specialist' && agentTab === 'alice' && (
          <>
            {/* Alice profile card */}
            <div style={{display:'flex',alignItems:'center',gap:16,padding:20,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)',marginBottom:20}}>
              <div style={{width:56,height:56,borderRadius:'50%',background:'linear-gradient(135deg, #6366F1 0%, #818cf8 100%)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:24,fontWeight:700,color:'#fff',fontFamily:'var(--font-sora)'}}>AW</div>
              <div style={{flex:1}}>
                <div style={{fontSize:20,fontWeight:700,fontFamily:'var(--font-sora)',color:'var(--tx)'}}>{tc('page_admin_agent.tabAlice')}</div>
                <div style={{fontSize:16,color:'#6366F1',fontWeight:600,marginBottom:4}}>{tc('page_admin_agent.aliceRole')}</div>
                <div style={{fontSize:16,color:'var(--tx3)',lineHeight:1.5}}>{tc('page_admin_agent.aliceDesc')}</div>
              </div>
              <button onClick={runAliceScout} disabled={aliceRunning} style={{padding:'10px 20px',borderRadius:9999,border:'none',background:aliceRunning?'var(--b)':'#6366F1',color:aliceRunning?'var(--tx3)':'#fff',fontSize:17,fontWeight:600,cursor:aliceRunning?'wait':'pointer',fontFamily:'inherit',flexShrink:0,transition:'background 200ms, color 200ms, opacity 200ms'}}>
                {aliceRunning ? tc('page_admin_agent.writing') : tc('page_admin_agent.runAliceNow')}
              </button>
            </div>

            {/* Run log */}
            {aliceRunLog.length > 0 && (
              <div style={{marginBottom:20,padding:'14px 16px',borderRadius:12,background:'var(--ev)',border:'1px solid var(--b)',fontSize:16,fontFamily:'monospace',color:'var(--tx2)',maxHeight:200,overflowY:'auto'}}>
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
                {label:tc('page_admin_agent.statPendingReview'),value:aliceCounts.pending,color:'#f59e0b'},
                {label:tc('page_admin_agent.statPublished'),value:aliceCounts.published,color:'#10b981'},
                {label:tc('page_admin_agent.statRejected'),value:aliceCounts.rejected,color:'#94a3b8'},
                {label:tc('page_admin_agent.statTotalDrafts'),value:aliceCounts.total,color:'var(--tx)'},
              ].map(({label,value,color}) => (
                <div key={label} style={{padding:14,borderRadius:12,border:'1px solid var(--b)',background:'var(--sf)'}}>
                  <div style={{fontSize:14,fontWeight:600,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:6}}>{label}</div>
                  <div style={{fontSize:26,fontWeight:700,fontFamily:'var(--font-sora)',color}}>{value}</div>
                </div>
              ))}
            </div>

            {/* Filter */}
            <div style={{display:'flex',gap:8,marginBottom:16}}>
              {(['pending','published','rejected','all'] as const).map(f => (
                <button key={f} onClick={() => { setAliceLoading(true); setAliceFilter(f) }} style={{padding:'6px 14px',borderRadius:9999,border:`1px solid ${aliceFilter===f?'#6366F1':'var(--b)'}`,background:aliceFilter===f?'rgba(99,102,241,.08)':'transparent',color:aliceFilter===f?'#6366F1':'var(--tx3)',fontSize:16,fontWeight:aliceFilter===f?600:400,cursor:'pointer',fontFamily:'inherit',textTransform:'capitalize',transition:'background 150ms, color 150ms, border-color 150ms'}}>{f}</button>
              ))}
            </div>

            {/* Blog list */}
            {aliceItems.length === 0 ? (
              <div style={{textAlign:'center',padding:'60px 0',color:'var(--tx3)'}}>
                <div style={{width:56,height:56,borderRadius:'50%',background:'linear-gradient(135deg,#6366F1,#818cf8)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:700,color:'#fff',fontFamily:'var(--font-sora)',margin:'0 auto 16px',opacity:.7}}>AW</div>
                <div style={{fontSize:18,fontWeight:500,marginBottom:6,color:'var(--tx)'}}>{tc('page_admin_agent.noDraftsYet')}</div>
                <div style={{fontSize:16,maxWidth:280,margin:'0 auto',lineHeight:1.6}}>{tc('page_admin_agent.aliceEmptyDesc')}</div>
              </div>
            ) : (
              <div style={{borderRadius:14,border:'1px solid var(--b)',overflow:'hidden',background:'var(--sf)'}}>
                {aliceItems.map(item => {
                  const blog = item.content || {}
                  return (
                    <div key={item.id} style={{padding:'14px 16px',borderBottom:'1px solid var(--b)',display:'flex',alignItems:'center',gap:10,flexWrap:'wrap',cursor:'pointer',transition:'background 120ms'}} onClick={() => openAlicePreview(item)} onMouseEnter={e=>e.currentTarget.style.background='var(--ev)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <span style={{fontSize:15,fontWeight:600,padding:'2px 8px',borderRadius:6,background:item.status==='pending'?'rgba(245,158,11,.1)':item.status==='published'?'rgba(16,185,129,.1)':'rgba(148,163,184,.1)',color:item.status==='pending'?'#f59e0b':item.status==='published'?'#10b981':'#94a3b8'}}>{item.status}</span>
                      <span style={{fontSize:15,padding:'2px 8px',borderRadius:6,background:'rgba(99,102,241,.08)',color:'#6366F1',fontWeight:500}}>{blog.cluster || '—'}</span>
                      <span style={{fontSize:17,color:'var(--tx)',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontWeight:500}}>{blog.title || 'Untitled'}</span>
                      {blog.qualityScore != null && <span style={{fontSize:14,fontWeight:600,padding:'2px 6px',borderRadius:4,background:blog.qualityScore>=80?'rgba(16,185,129,.1)':'rgba(245,158,11,.1)',color:blog.qualityScore>=80?'#10b981':'#f59e0b'}}>{blog.qualityScore}</span>}
                      <span style={{fontSize:15,color:'var(--tx3)'}}>{blog.readTime ? `${blog.readTime} min` : ''}</span>
                      <span style={{fontSize:15,color:'var(--tx3)'}}>{new Date(item.created_at).toLocaleDateString('en-GB')}</span>
                      {item.status === 'pending' && (
                        <div style={{display:'flex',gap:6}} onClick={e => e.stopPropagation()}>
                          <button onClick={() => handleAliceAction(item.id, 'approve')} disabled={aliceActing===item.id} style={{padding:'4px 12px',borderRadius:6,border:'none',background:'#10b981',color:'#fff',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{tc('page_admin_agent.authorise')}</button>
                          <button onClick={() => handleAliceAction(item.id, 'reject')} disabled={aliceActing===item.id} style={{padding:'4px 12px',borderRadius:6,border:'1px solid var(--b)',background:'transparent',color:'#f87171',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{tc('page_admin_agent.reject')}</button>
                        </div>
                      )}
                      {item.status === 'published' && blog.slug && (
                        <a href={`/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{padding:'4px 12px',borderRadius:6,border:'1px solid rgba(16,185,129,.3)',background:'rgba(16,185,129,.08)',color:'#10b981',fontSize:15,fontWeight:600,textDecoration:'none',fontFamily:'inherit'}}>{tc('page_admin_agent.viewOnBlog')}</a>
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
                      <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg, #6366F1, #818cf8)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:700,color:'#fff'}}>AW</div>
                      <div>
                        <div style={{fontSize:17,fontWeight:600,color:'var(--tx)'}}>{tc('page_admin_agent.tabAlice')}</div>
                        <div style={{fontSize:15,color:'var(--tx3)'}}>{alicePreview.content?.cluster} · {new Date(alicePreview.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}</div>
                      </div>
                    </div>
                    <div style={{display:'flex',gap:8}}>
                      {alicePreview.status === 'pending' && <>
                        <button onClick={() => handleAliceAction(alicePreview.id, 'approve')} disabled={aliceActing===alicePreview.id} style={{padding:'6px 16px',borderRadius:8,border:'none',background:'#10b981',color:'#fff',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{tc('page_admin_agent.authoriseAndPublish')}</button>
                        <button onClick={() => handleAliceAction(alicePreview.id, 'reject')} disabled={aliceActing===alicePreview.id} style={{padding:'6px 16px',borderRadius:8,border:'1px solid var(--b)',background:'transparent',color:'#f87171',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{tc('page_admin_agent.reject')}</button>
                      </>}
                      <button onClick={() => setAlicePreview(null)} aria-label="Close preview" style={{padding:'6px 10px',borderRadius:8,border:'1px solid var(--b)',background:'transparent',color:'var(--tx3)',fontSize:18,cursor:'pointer',fontFamily:'inherit',lineHeight:1}}>×</button>
                    </div>
                  </div>

                  {/* Modal body */}
                  <div style={{padding:24}}>
                    {/* Byline */}
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16,fontSize:16,color:'var(--tx3)'}}>
                      <span style={{fontWeight:600,color:'var(--tx)'}}>{tc('page_admin_agent.writtenByAlice')}</span>
                      <span>·</span>
                      <span>{alicePreview.content?.publishDate}</span>
                      <span>·</span>
                      <span>{tc('page_admin_agent.minRead', { n: alicePreview.content?.readTime })}</span>
                      {alicePreview.source_url && <>
                        <span>·</span>
                        <a href={alicePreview.source_url} target="_blank" rel="noopener noreferrer" style={{color:'#6366F1',textDecoration:'none'}}>{tc('page_admin_agent.source')}</a>
                      </>}
                    </div>

                    {/* Title */}
                    {alicePreview.status === 'pending' ? (
                      <input value={aliceEditTitle} onChange={e => setAliceEditTitle(e.target.value)} placeholder={tc('page_admin_agent.articleTitlePlaceholder')} style={{fontSize:26,fontWeight:700,fontFamily:'var(--font-sora)',color:'var(--tx)',border:'1px solid var(--b)',borderRadius:8,padding:'8px 12px',width:'100%',marginBottom:16,background:'transparent',boxSizing:'border-box'}} />
                    ) : (
                      <h1 style={{fontSize:26,fontWeight:700,fontFamily:'var(--font-sora)',color:'var(--tx)',marginBottom:16,marginTop:0}}>{alicePreview.content?.title}</h1>
                    )}

                    {/* TLDR */}
                    {alicePreview.content?.tldr && (
                      <div style={{padding:'12px 16px',borderRadius:10,background:'rgba(99,102,241,.05)',border:'1px solid rgba(99,102,241,.15)',marginBottom:24,fontSize:17,color:'var(--tx2)',lineHeight:1.6}}>
                        <strong style={{color:'#6366F1',fontSize:15,textTransform:'uppercase',letterSpacing:'.06em'}}>{tc('page_admin_agent.tldr')}</strong><br/>{alicePreview.content.tldr}
                      </div>
                    )}

                    {/* Sections */}
                    {(alicePreview.status === 'pending' ? aliceEditSections : alicePreview.content?.sections || []).map((sec: any, i: number) => (
                      <div key={i} style={{marginBottom:24}}>
                        {alicePreview.status === 'pending' ? (
                          <>
                            <input value={sec.heading} onChange={e => { const s = [...aliceEditSections]; s[i] = {...s[i], heading: e.target.value}; setAliceEditSections(s) }} placeholder={tc('page_admin_agent.sectionHeadingPlaceholder')} style={{fontSize:20,fontWeight:600,fontFamily:'var(--font-sora)',color:'var(--tx)',border:'1px solid var(--b)',borderRadius:6,padding:'6px 10px',width:'100%',marginBottom:8,background:'transparent',boxSizing:'border-box'}} />
                            <textarea value={sec.body} onChange={e => { const s = [...aliceEditSections]; s[i] = {...s[i], body: e.target.value}; setAliceEditSections(s) }} rows={5} placeholder={tc('page_admin_agent.writeSectionPlaceholder')} style={{fontSize:17,lineHeight:1.7,color:'var(--tx2)',border:'1px solid var(--b)',borderRadius:6,padding:'8px 10px',width:'100%',resize:'vertical',fontFamily:'inherit',background:'transparent',boxSizing:'border-box'}} />
                          </>
                        ) : (
                          <>
                            <h2 style={{fontSize:20,fontWeight:600,fontFamily:'var(--font-sora)',color:'var(--tx)',marginBottom:8,marginTop:0}}>{sec.heading}</h2>
                            <p style={{fontSize:17,lineHeight:1.7,color:'var(--tx2)',margin:0}}>{sec.body}</p>
                          </>
                        )}
                      </div>
                    ))}

                    {/* PAA */}
                    {alicePreview.content?.paa?.length > 0 && (
                      <div style={{marginTop:24,padding:16,borderRadius:10,border:'1px solid var(--b)',background:'rgba(0,0,0,.02)'}}>
                        <h3 style={{fontSize:17,fontWeight:600,color:'var(--tx)',marginBottom:12,marginTop:0}}>{tc('page_admin_agent.peopleAlsoAsk')}</h3>
                        {alicePreview.content.paa.map((qa: any, i: number) => (
                          <div key={i} style={{marginBottom:12}}>
                            <div style={{fontSize:17,fontWeight:600,color:'var(--tx)',marginBottom:4}}>{qa.q}</div>
                            <div style={{fontSize:16,color:'var(--tx2)',lineHeight:1.6}}>{qa.a}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* CTA */}
                    {alicePreview.content?.cta && (
                      <div style={{marginTop:24,padding:16,borderRadius:10,background:'rgba(99,102,241,.06)',border:'1px solid rgba(99,102,241,.15)'}}>
                        <div style={{fontSize:18,fontWeight:600,color:'#6366F1',marginBottom:4}}>{alicePreview.content.cta.heading}</div>
                        <div style={{fontSize:16,color:'var(--tx2)'}}>{alicePreview.content.cta.body}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── VICTOR OJEAKHENA — NIGERIA, WEST & SOUTH AFRICA ── */}
        {mainTab === 'marketing-specialist' && agentTab === 'victor' && (
          <>
            {/* Victor profile card */}
            <div style={{display:'flex',alignItems:'center',gap:16,padding:20,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)',marginBottom:20}}>
              <div style={{width:56,height:56,borderRadius:'50%',background:'linear-gradient(135deg, #ea580c 0%, #fb923c 100%)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:22,fontWeight:700,color:'#fff',fontFamily:'var(--font-sora)'}}>VO</div>
              <div style={{flex:1}}>
                <div style={{fontSize:20,fontWeight:700,fontFamily:'var(--font-sora)',color:'var(--tx)'}}>{tc('page_admin_agent.tabVictor')}</div>
                <div style={{fontSize:16,color:'#ea580c',fontWeight:600,marginBottom:4}}>{tc('page_admin_agent.victorRole')}</div>
                <div style={{fontSize:16,color:'var(--tx3)',lineHeight:1.5}}>{tc('page_admin_agent.victorDesc')}</div>
              </div>
              <button onClick={runVictorScout} disabled={victorRunning} style={{padding:'10px 20px',borderRadius:9999,border:'none',background:victorRunning?'var(--b)':'#ea580c',color:victorRunning?'var(--tx3)':'#fff',fontSize:17,fontWeight:600,cursor:victorRunning?'wait':'pointer',fontFamily:'inherit',flexShrink:0,transition:'background 200ms, color 200ms'}}>
                {victorRunning ? tc('page_admin_agent.writing') : tc('page_admin_agent.runVictorNow')}
              </button>
            </div>

            {/* Run log */}
            {victorRunLog.length > 0 && (
              <div style={{marginBottom:20,padding:'14px 16px',borderRadius:12,background:'var(--ev)',border:'1px solid var(--b)',fontSize:16,fontFamily:'monospace',color:'var(--tx2)',maxHeight:200,overflowY:'auto'}}>
                {victorRunLog.map((l,i) => <div key={i}>{l}</div>)}
              </div>
            )}

            {/* Stats */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:10,marginBottom:20}}>
              {victorLoading ? [0,1,2,3].map(i => (
                <div key={i} style={{padding:14,borderRadius:12,border:'1px solid var(--b)',background:'var(--sf)',minHeight:66}}>
                  <div style={{height:9,borderRadius:5,background:'var(--ev)',marginBottom:10,width:'65%'}}/>
                  <div style={{height:22,borderRadius:6,background:'var(--ev)',width:'35%'}}/>
                </div>
              )) : [
                {label:tc('page_admin_agent.statPendingReview'), value:victorCounts.pending,   color:'#f59e0b'},
                {label:tc('page_admin_agent.statPublished'),     value:victorCounts.published,  color:'#10b981'},
                {label:tc('page_admin_agent.statRejected'),      value:victorCounts.rejected,   color:'#94a3b8'},
                {label:tc('page_admin_agent.statTotalDrafts'),   value:victorCounts.total,      color:'var(--tx)'},
              ].map(({label,value,color}) => (
                <div key={label} style={{padding:14,borderRadius:12,border:'1px solid var(--b)',background:'var(--sf)'}}>
                  <div style={{fontSize:14,fontWeight:600,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:6}}>{label}</div>
                  <div style={{fontSize:26,fontWeight:700,fontFamily:'var(--font-sora)',color}}>{value}</div>
                </div>
              ))}
            </div>

            {/* Filter */}
            <div style={{display:'flex',gap:8,marginBottom:16}}>
              {(['pending','published','rejected','all'] as const).map(f => (
                <button key={f} onClick={() => { setVictorLoading(true); setVictorFilter(f) }} style={{padding:'6px 14px',borderRadius:9999,border:`1px solid ${victorFilter===f?'#ea580c':'var(--b)'}`,background:victorFilter===f?'rgba(234,88,12,.08)':'transparent',color:victorFilter===f?'#ea580c':'var(--tx3)',fontSize:16,fontWeight:victorFilter===f?600:400,cursor:'pointer',fontFamily:'inherit',textTransform:'capitalize',transition:'background 150ms, color 150ms, border-color 150ms'}}>{f}</button>
              ))}
            </div>

            {/* Posts list */}
            {victorItems.length === 0 ? (
              <div style={{textAlign:'center',padding:'60px 0',color:'var(--tx3)'}}>
                <div style={{width:56,height:56,borderRadius:'50%',background:'linear-gradient(135deg,#ea580c,#fb923c)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:700,color:'#fff',fontFamily:'var(--font-sora)',margin:'0 auto 16px',opacity:.7}}>VO</div>
                <div style={{fontSize:18,fontWeight:500,marginBottom:6,color:'var(--tx)'}}>{tc('page_admin_agent.noDraftsYet')}</div>
                <div style={{fontSize:16,maxWidth:300,margin:'0 auto',lineHeight:1.6}}>{tc('page_admin_agent.victorEmptyDesc')}</div>
              </div>
            ) : (
              <div style={{borderRadius:14,border:'1px solid var(--b)',overflow:'hidden',background:'var(--sf)'}}>
                {victorItems.map(item => {
                  const blog = item.content || {}
                  return (
                    <div key={item.id} style={{padding:'14px 16px',borderBottom:'1px solid var(--b)',display:'flex',alignItems:'center',gap:10,flexWrap:'wrap',cursor:'pointer',transition:'background 120ms'}} onClick={() => openVictorPreview(item)} onMouseEnter={e=>e.currentTarget.style.background='var(--ev)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <span style={{fontSize:15,fontWeight:600,padding:'2px 8px',borderRadius:6,background:item.status==='pending'?'rgba(245,158,11,.1)':item.status==='published'?'rgba(16,185,129,.1)':'rgba(148,163,184,.1)',color:item.status==='pending'?'#f59e0b':item.status==='published'?'#10b981':'#94a3b8'}}>{item.status}</span>
                      <span style={{fontSize:15,padding:'2px 8px',borderRadius:6,background:'rgba(234,88,12,.08)',color:'#ea580c',fontWeight:500}}>{blog.cluster || '—'}</span>
                      <span style={{fontSize:17,color:'var(--tx)',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontWeight:500}}>{blog.title || 'Untitled'}</span>
                      {blog.qualityScore != null && <span style={{fontSize:14,fontWeight:600,padding:'2px 6px',borderRadius:4,background:blog.qualityScore>=80?'rgba(16,185,129,.1)':'rgba(245,158,11,.1)',color:blog.qualityScore>=80?'#10b981':'#f59e0b'}}>{blog.qualityScore}</span>}
                      <span style={{fontSize:15,color:'var(--tx3)'}}>{blog.readTime ? `${blog.readTime} min` : ''}</span>
                      <span style={{fontSize:15,color:'var(--tx3)'}}>{new Date(item.created_at).toLocaleDateString('en-GB')}</span>
                      {item.status === 'pending' && (
                        <div style={{display:'flex',gap:6}} onClick={e => e.stopPropagation()}>
                          <button onClick={() => handleVictorAction(item.id, 'approve')} disabled={victorActing===item.id} style={{padding:'4px 12px',borderRadius:6,border:'none',background:'#ea580c',color:'#fff',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{tc('page_admin_agent.authorise')}</button>
                          <button onClick={() => handleVictorAction(item.id, 'reject')} disabled={victorActing===item.id} style={{padding:'4px 12px',borderRadius:6,border:'1px solid var(--b)',background:'transparent',color:'#f87171',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{tc('page_admin_agent.reject')}</button>
                        </div>
                      )}
                      {item.status === 'published' && blog.slug && (
                        <a href={`/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{padding:'4px 12px',borderRadius:6,border:'1px solid rgba(234,88,12,.3)',background:'rgba(234,88,12,.08)',color:'#ea580c',fontSize:15,fontWeight:600,textDecoration:'none',fontFamily:'inherit'}}>{tc('page_admin_agent.viewOnBlog')}</a>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Preview modal */}
            {victorPreview && (
              <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',padding:20}} onClick={() => setVictorPreview(null)}>
                <div style={{background:'var(--sf)',borderRadius:16,maxWidth:800,width:'100%',maxHeight:'90vh',overflow:'auto',padding:0}} onClick={e => e.stopPropagation()}>
                  <div style={{padding:'16px 24px',borderBottom:'1px solid var(--b)',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,background:'var(--sf)',zIndex:1,borderRadius:'16px 16px 0 0'}}>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#ea580c,#fb923c)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:700,color:'#fff'}}>VO</div>
                      <div>
                        <div style={{fontSize:17,fontWeight:600,color:'var(--tx)'}}>{tc('page_admin_agent.tabVictor')}</div>
                        <div style={{fontSize:15,color:'var(--tx3)'}}>{victorPreview.content?.cluster} · {new Date(victorPreview.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}</div>
                      </div>
                    </div>
                    <div style={{display:'flex',gap:8}}>
                      {victorPreview.status === 'pending' && <>
                        <button onClick={() => handleVictorAction(victorPreview.id, 'approve')} disabled={victorActing===victorPreview.id} style={{padding:'6px 16px',borderRadius:8,border:'none',background:'#ea580c',color:'#fff',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{tc('page_admin_agent.authoriseAndPublish')}</button>
                        <button onClick={() => handleVictorAction(victorPreview.id, 'reject')} disabled={victorActing===victorPreview.id} style={{padding:'6px 16px',borderRadius:8,border:'1px solid var(--b)',background:'transparent',color:'#f87171',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{tc('page_admin_agent.reject')}</button>
                      </>}
                      <button onClick={() => setVictorPreview(null)} aria-label="Close preview" style={{padding:'6px 10px',borderRadius:8,border:'1px solid var(--b)',background:'transparent',color:'var(--tx3)',fontSize:18,cursor:'pointer',fontFamily:'inherit',lineHeight:1}}>×</button>
                    </div>
                  </div>

                  <div style={{padding:24}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16,fontSize:16,color:'var(--tx3)'}}>
                      <span style={{fontWeight:600,color:'var(--tx)'}}>{tc('page_admin_agent.writtenByVictor')}</span>
                      <span>·</span><span>{victorPreview.content?.publishDate}</span>
                      <span>·</span><span>{tc('page_admin_agent.minRead', { n: victorPreview.content?.readTime })}</span>
                      {victorPreview.source_url && <><span>·</span><a href={victorPreview.source_url} target="_blank" rel="noopener noreferrer" style={{color:'#ea580c',textDecoration:'none'}}>{tc('page_admin_agent.source')}</a></>}
                    </div>

                    {victorPreview.status === 'pending' ? (
                      <input value={victorEditTitle} onChange={e => setVictorEditTitle(e.target.value)} placeholder={tc('page_admin_agent.articleTitlePlaceholder')} style={{fontSize:26,fontWeight:700,fontFamily:'var(--font-sora)',color:'var(--tx)',border:'1px solid var(--b)',borderRadius:8,padding:'8px 12px',width:'100%',marginBottom:16,background:'transparent',boxSizing:'border-box'}} />
                    ) : (
                      <h1 style={{fontSize:26,fontWeight:700,fontFamily:'var(--font-sora)',color:'var(--tx)',marginBottom:16,marginTop:0}}>{victorPreview.content?.title}</h1>
                    )}

                    {victorPreview.content?.tldr && (
                      <div style={{padding:'12px 16px',borderRadius:10,background:'rgba(234,88,12,.05)',border:'1px solid rgba(234,88,12,.15)',marginBottom:24,fontSize:17,color:'var(--tx2)',lineHeight:1.6}}>
                        <strong style={{color:'#ea580c',fontSize:15,textTransform:'uppercase',letterSpacing:'.06em'}}>{tc('page_admin_agent.tldr')}</strong><br/>{victorPreview.content.tldr}
                      </div>
                    )}

                    {(victorPreview.status === 'pending' ? victorEditSections : victorPreview.content?.sections || []).map((sec: any, i: number) => (
                      <div key={i} style={{marginBottom:24}}>
                        {victorPreview.status === 'pending' ? (
                          <>
                            <input value={sec.heading} onChange={e => { const s = [...victorEditSections]; s[i] = {...s[i], heading: e.target.value}; setVictorEditSections(s) }} placeholder={tc('page_admin_agent.sectionHeadingPlaceholder')} style={{fontSize:20,fontWeight:600,fontFamily:'var(--font-sora)',color:'var(--tx)',border:'1px solid var(--b)',borderRadius:6,padding:'6px 10px',width:'100%',marginBottom:8,background:'transparent',boxSizing:'border-box'}} />
                            <textarea value={sec.body} onChange={e => { const s = [...victorEditSections]; s[i] = {...s[i], body: e.target.value}; setVictorEditSections(s) }} rows={5} placeholder={tc('page_admin_agent.writeSectionPlaceholder')} style={{fontSize:17,lineHeight:1.7,color:'var(--tx2)',border:'1px solid var(--b)',borderRadius:6,padding:'8px 10px',width:'100%',resize:'vertical',fontFamily:'inherit',background:'transparent',boxSizing:'border-box'}} />
                          </>
                        ) : (
                          <>
                            <h2 style={{fontSize:20,fontWeight:600,fontFamily:'var(--font-sora)',color:'var(--tx)',marginBottom:8,marginTop:0}}>{sec.heading}</h2>
                            <p style={{fontSize:17,lineHeight:1.7,color:'var(--tx2)',margin:0}}>{sec.body}</p>
                          </>
                        )}
                      </div>
                    ))}

                    {victorPreview.content?.paa?.length > 0 && (
                      <div style={{marginTop:24,padding:16,borderRadius:10,border:'1px solid var(--b)',background:'rgba(0,0,0,.02)'}}>
                        <h3 style={{fontSize:17,fontWeight:600,color:'var(--tx)',marginBottom:12,marginTop:0}}>{tc('page_admin_agent.peopleAlsoAsk')}</h3>
                        {victorPreview.content.paa.map((qa: any, i: number) => (
                          <div key={i} style={{marginBottom:12}}>
                            <div style={{fontSize:17,fontWeight:600,color:'var(--tx)',marginBottom:4}}>{qa.q}</div>
                            <div style={{fontSize:16,color:'var(--tx2)',lineHeight:1.6}}>{qa.a}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {victorPreview.content?.cta && (
                      <div style={{marginTop:24,padding:16,borderRadius:10,background:'rgba(234,88,12,.06)',border:'1px solid rgba(234,88,12,.15)'}}>
                        <div style={{fontSize:18,fontWeight:600,color:'#ea580c',marginBottom:4}}>{victorPreview.content.cta.heading}</div>
                        <div style={{fontSize:16,color:'var(--tx2)'}}>{victorPreview.content.cta.body}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── CAROLYNE KIGATHI — EAST AFRICA ── */}
        {mainTab === 'marketing-specialist' && agentTab === 'carolyne' && (
          <>
            {/* Carolyne profile card */}
            <div style={{display:'flex',alignItems:'center',gap:16,padding:20,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)',marginBottom:20}}>
              <div style={{width:56,height:56,borderRadius:'50%',background:'linear-gradient(135deg, #16a34a 0%, #4ade80 100%)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:22,fontWeight:700,color:'#fff',fontFamily:'var(--font-sora)'}}>CK</div>
              <div style={{flex:1}}>
                <div style={{fontSize:20,fontWeight:700,fontFamily:'var(--font-sora)',color:'var(--tx)'}}>{tc('page_admin_agent.tabCarolyne')}</div>
                <div style={{fontSize:16,color:'#16a34a',fontWeight:600,marginBottom:4}}>{tc('page_admin_agent.carolyneRole')}</div>
                <div style={{fontSize:16,color:'var(--tx3)',lineHeight:1.5}}>{tc('page_admin_agent.carolyneDesc')}</div>
              </div>
              <button onClick={runCarolyneScout} disabled={carolyneRunning} style={{padding:'10px 20px',borderRadius:9999,border:'none',background:carolyneRunning?'var(--b)':'#16a34a',color:carolyneRunning?'var(--tx3)':'#fff',fontSize:17,fontWeight:600,cursor:carolyneRunning?'wait':'pointer',fontFamily:'inherit',flexShrink:0,transition:'background 200ms, color 200ms, opacity 200ms'}}>
                {carolyneRunning ? tc('page_admin_agent.writing') : tc('page_admin_agent.runCarolyneNow')}
              </button>
            </div>

            {/* Run log */}
            {carolyneRunLog.length > 0 && (
              <div style={{marginBottom:20,padding:'14px 16px',borderRadius:12,background:'var(--ev)',border:'1px solid var(--b)',fontSize:16,fontFamily:'monospace',color:'var(--tx2)',maxHeight:200,overflowY:'auto'}}>
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
                {label:tc('page_admin_agent.statPendingReview'), value:carolyneCounts.pending,   color:'#f59e0b'},
                {label:tc('page_admin_agent.statPublished'),     value:carolyneCounts.published,  color:'#10b981'},
                {label:tc('page_admin_agent.statRejected'),      value:carolyneCounts.rejected,   color:'#94a3b8'},
                {label:tc('page_admin_agent.statTotalDrafts'),   value:carolyneCounts.total,      color:'var(--tx)'},
              ].map(({label,value,color}) => (
                <div key={label} style={{padding:14,borderRadius:12,border:'1px solid var(--b)',background:'var(--sf)'}}>
                  <div style={{fontSize:14,fontWeight:600,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:6}}>{label}</div>
                  <div style={{fontSize:26,fontWeight:700,fontFamily:'var(--font-sora)',color}}>{value}</div>
                </div>
              ))}
            </div>

            {/* Filter */}
            <div style={{display:'flex',gap:8,marginBottom:16}}>
              {(['pending','published','rejected','all'] as const).map(f => (
                <button key={f} onClick={() => { setCarolyneLoading(true); setCarolyneFilter(f) }} style={{padding:'6px 14px',borderRadius:9999,border:`1px solid ${carolyneFilter===f?'#16a34a':'var(--b)'}`,background:carolyneFilter===f?'rgba(22,163,74,.08)':'transparent',color:carolyneFilter===f?'#16a34a':'var(--tx3)',fontSize:16,fontWeight:carolyneFilter===f?600:400,cursor:'pointer',fontFamily:'inherit',textTransform:'capitalize',transition:'background 150ms, color 150ms, border-color 150ms'}}>{f}</button>
              ))}
            </div>

            {/* Posts list */}
            {carolyneItems.length === 0 ? (
              <div style={{textAlign:'center',padding:'60px 0',color:'var(--tx3)'}}>
                <div style={{fontSize:36,marginBottom:12}}>🌍</div>
                <div style={{fontSize:18,fontWeight:500,marginBottom:4}}>{tc('page_admin_agent.noDraftsYet')}</div>
                <div style={{fontSize:16}}>{tc('page_admin_agent.carolyneEmptyDesc')}</div>
              </div>
            ) : (
              <div style={{borderRadius:14,border:'1px solid var(--b)',overflow:'hidden',background:'var(--sf)'}}>
                {carolyneItems.map(item => {
                  const blog = item.content || {}
                  return (
                    <div key={item.id} style={{padding:'14px 16px',borderBottom:'1px solid var(--b)',display:'flex',alignItems:'center',gap:10,flexWrap:'wrap',cursor:'pointer',transition:'background 120ms'}} onClick={() => openCarolynePreview(item)} onMouseEnter={e=>e.currentTarget.style.background='var(--ev)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <span style={{fontSize:15,fontWeight:600,padding:'2px 8px',borderRadius:6,background:item.status==='pending'?'rgba(245,158,11,.1)':item.status==='published'?'rgba(16,185,129,.1)':'rgba(148,163,184,.1)',color:item.status==='pending'?'#f59e0b':item.status==='published'?'#10b981':'#94a3b8'}}>{item.status}</span>
                      <span style={{fontSize:15,padding:'2px 8px',borderRadius:6,background:'rgba(22,163,74,.08)',color:'#16a34a',fontWeight:500}}>{blog.cluster || '—'}</span>
                      <span style={{fontSize:17,color:'var(--tx)',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontWeight:500}}>{blog.title || 'Untitled'}</span>
                      {blog.qualityScore != null && <span style={{fontSize:14,fontWeight:600,padding:'2px 6px',borderRadius:4,background:blog.qualityScore>=80?'rgba(16,185,129,.1)':'rgba(245,158,11,.1)',color:blog.qualityScore>=80?'#10b981':'#f59e0b'}}>{blog.qualityScore}</span>}
                      <span style={{fontSize:15,color:'var(--tx3)'}}>{blog.readTime ? `${blog.readTime} min` : ''}</span>
                      <span style={{fontSize:15,color:'var(--tx3)'}}>{new Date(item.created_at).toLocaleDateString('en-GB')}</span>
                      {item.status === 'pending' && (
                        <div style={{display:'flex',gap:6}} onClick={e => e.stopPropagation()}>
                          <button onClick={() => handleCarolyneAction(item.id, 'approve')} disabled={carolyneActing===item.id} style={{padding:'4px 12px',borderRadius:6,border:'none',background:'#16a34a',color:'#fff',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{tc('page_admin_agent.authorise')}</button>
                          <button onClick={() => handleCarolyneAction(item.id, 'reject')} disabled={carolyneActing===item.id} style={{padding:'4px 12px',borderRadius:6,border:'1px solid var(--b)',background:'transparent',color:'#f87171',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{tc('page_admin_agent.reject')}</button>
                        </div>
                      )}
                      {item.status === 'published' && blog.slug && (
                        <a href={`/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{padding:'4px 12px',borderRadius:6,border:'1px solid rgba(22,163,74,.3)',background:'rgba(22,163,74,.08)',color:'#16a34a',fontSize:15,fontWeight:600,textDecoration:'none',fontFamily:'inherit'}}>{tc('page_admin_agent.viewOnBlog')}</a>
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
                      <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg, #16a34a, #4ade80)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:700,color:'#fff'}}>CK</div>
                      <div>
                        <div style={{fontSize:17,fontWeight:600,color:'var(--tx)'}}>{tc('page_admin_agent.tabCarolyne')}</div>
                        <div style={{fontSize:15,color:'var(--tx3)'}}>{carolynePreview.content?.cluster} · {new Date(carolynePreview.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}</div>
                      </div>
                    </div>
                    <div style={{display:'flex',gap:8}}>
                      {carolynePreview.status === 'pending' && <>
                        <button onClick={() => handleCarolyneAction(carolynePreview.id, 'approve')} disabled={carolyneActing===carolynePreview.id} style={{padding:'6px 16px',borderRadius:8,border:'none',background:'#16a34a',color:'#fff',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{tc('page_admin_agent.authoriseAndPublish')}</button>
                        <button onClick={() => handleCarolyneAction(carolynePreview.id, 'reject')} disabled={carolyneActing===carolynePreview.id} style={{padding:'6px 16px',borderRadius:8,border:'1px solid var(--b)',background:'transparent',color:'#f87171',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{tc('page_admin_agent.reject')}</button>
                      </>}
                      <button onClick={() => setCarolynePreview(null)} aria-label="Close preview" style={{padding:'6px 10px',borderRadius:8,border:'1px solid var(--b)',background:'transparent',color:'var(--tx3)',fontSize:18,cursor:'pointer',fontFamily:'inherit',lineHeight:1}}>×</button>
                    </div>
                  </div>

                  {/* Modal body */}
                  <div style={{padding:24}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16,fontSize:16,color:'var(--tx3)'}}>
                      <span style={{fontWeight:600,color:'var(--tx)'}}>{tc('page_admin_agent.writtenByCarolyne')}</span>
                      <span>·</span><span>{carolynePreview.content?.publishDate}</span>
                      <span>·</span><span>{tc('page_admin_agent.minRead', { n: carolynePreview.content?.readTime })}</span>
                      {carolynePreview.source_url && <><span>·</span><a href={carolynePreview.source_url} target="_blank" rel="noopener noreferrer" style={{color:'#16a34a',textDecoration:'none'}}>{tc('page_admin_agent.source')}</a></>}
                    </div>

                    {carolynePreview.status === 'pending' ? (
                      <input value={carolyneEditTitle} onChange={e => setCarolyneEditTitle(e.target.value)} placeholder={tc('page_admin_agent.articleTitlePlaceholder')} style={{fontSize:26,fontWeight:700,fontFamily:'var(--font-sora)',color:'var(--tx)',border:'1px solid var(--b)',borderRadius:8,padding:'8px 12px',width:'100%',marginBottom:16,background:'transparent',boxSizing:'border-box'}} />
                    ) : (
                      <h1 style={{fontSize:26,fontWeight:700,fontFamily:'var(--font-sora)',color:'var(--tx)',marginBottom:16,marginTop:0}}>{carolynePreview.content?.title}</h1>
                    )}

                    {carolynePreview.content?.tldr && (
                      <div style={{padding:'12px 16px',borderRadius:10,background:'rgba(22,163,74,.05)',border:'1px solid rgba(22,163,74,.15)',marginBottom:24,fontSize:17,color:'var(--tx2)',lineHeight:1.6}}>
                        <strong style={{color:'#16a34a',fontSize:15,textTransform:'uppercase',letterSpacing:'.06em'}}>{tc('page_admin_agent.tldr')}</strong><br/>{carolynePreview.content.tldr}
                      </div>
                    )}

                    {(carolynePreview.status === 'pending' ? carolyneEditSections : carolynePreview.content?.sections || []).map((sec: any, i: number) => (
                      <div key={i} style={{marginBottom:24}}>
                        {carolynePreview.status === 'pending' ? (
                          <>
                            <input value={sec.heading} onChange={e => { const s = [...carolyneEditSections]; s[i] = {...s[i], heading: e.target.value}; setCarolyneEditSections(s) }} placeholder={tc('page_admin_agent.sectionHeadingPlaceholder')} style={{fontSize:20,fontWeight:600,fontFamily:'var(--font-sora)',color:'var(--tx)',border:'1px solid var(--b)',borderRadius:6,padding:'6px 10px',width:'100%',marginBottom:8,background:'transparent',boxSizing:'border-box'}} />
                            <textarea value={sec.body} onChange={e => { const s = [...carolyneEditSections]; s[i] = {...s[i], body: e.target.value}; setCarolyneEditSections(s) }} rows={5} placeholder={tc('page_admin_agent.writeSectionPlaceholder')} style={{fontSize:17,lineHeight:1.7,color:'var(--tx2)',border:'1px solid var(--b)',borderRadius:6,padding:'8px 10px',width:'100%',resize:'vertical',fontFamily:'inherit',background:'transparent',boxSizing:'border-box'}} />
                          </>
                        ) : (
                          <>
                            <h2 style={{fontSize:20,fontWeight:600,fontFamily:'var(--font-sora)',color:'var(--tx)',marginBottom:8,marginTop:0}}>{sec.heading}</h2>
                            <p style={{fontSize:17,lineHeight:1.7,color:'var(--tx2)',margin:0}}>{sec.body}</p>
                          </>
                        )}
                      </div>
                    ))}

                    {carolynePreview.content?.paa?.length > 0 && (
                      <div style={{marginTop:24,padding:16,borderRadius:10,border:'1px solid var(--b)',background:'rgba(0,0,0,.02)'}}>
                        <h3 style={{fontSize:17,fontWeight:600,color:'var(--tx)',marginBottom:12,marginTop:0}}>{tc('page_admin_agent.peopleAlsoAsk')}</h3>
                        {carolynePreview.content.paa.map((qa: any, i: number) => (
                          <div key={i} style={{marginBottom:12}}>
                            <div style={{fontSize:17,fontWeight:600,color:'var(--tx)',marginBottom:4}}>{qa.q}</div>
                            <div style={{fontSize:16,color:'var(--tx2)',lineHeight:1.6}}>{qa.a}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {carolynePreview.content?.cta && (
                      <div style={{marginTop:24,padding:16,borderRadius:10,background:'rgba(22,163,74,.06)',border:'1px solid rgba(22,163,74,.15)'}}>
                        <div style={{fontSize:18,fontWeight:600,color:'#16a34a',marginBottom:4}}>{carolynePreview.content.cta.heading}</div>
                        <div style={{fontSize:16,color:'var(--tx2)'}}>{carolynePreview.content.cta.body}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── BEN CARLSON — UNITED STATES ── */}
        {mainTab === 'marketing-specialist' && agentTab === 'ben' && (
          <>
            {/* Ben profile card */}
            <div style={{display:'flex',alignItems:'center',gap:16,padding:20,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)',marginBottom:20}}>
              <div style={{width:56,height:56,borderRadius:'50%',background:'linear-gradient(135deg, #1d4ed8 0%, #60a5fa 100%)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:22,fontWeight:700,color:'#fff',fontFamily:'var(--font-sora)'}}>BC</div>
              <div style={{flex:1}}>
                <div style={{fontSize:20,fontWeight:700,fontFamily:'var(--font-sora)',color:'var(--tx)'}}>{tc('page_admin_agent.tabBen')}</div>
                <div style={{fontSize:16,color:'#1d4ed8',fontWeight:600,marginBottom:4}}>{tc('page_admin_agent.benRole')}</div>
                <div style={{fontSize:16,color:'var(--tx3)',lineHeight:1.5}}>{tc('page_admin_agent.benDesc')}</div>
              </div>
              <button onClick={runBenScout} disabled={benRunning} style={{padding:'10px 20px',borderRadius:9999,border:'none',background:benRunning?'var(--b)':'#1d4ed8',color:benRunning?'var(--tx3)':'#fff',fontSize:17,fontWeight:600,cursor:benRunning?'wait':'pointer',fontFamily:'inherit',flexShrink:0,transition:'background 200ms, color 200ms'}}>
                {benRunning ? tc('page_admin_agent.writing') : tc('page_admin_agent.runBenNow')}
              </button>
            </div>

            {/* Run log */}
            {benRunLog.length > 0 && (
              <div style={{marginBottom:20,padding:'14px 16px',borderRadius:12,background:'var(--ev)',border:'1px solid var(--b)',fontSize:16,fontFamily:'monospace',color:'var(--tx2)',maxHeight:200,overflowY:'auto'}}>
                {benRunLog.map((l,i) => <div key={i}>{l}</div>)}
              </div>
            )}

            {/* Stats */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:10,marginBottom:20}}>
              {benLoading ? [0,1,2,3].map(i => (
                <div key={i} style={{padding:14,borderRadius:12,border:'1px solid var(--b)',background:'var(--sf)',minHeight:66}}>
                  <div style={{height:9,borderRadius:5,background:'var(--ev)',marginBottom:10,width:'65%'}}/>
                  <div style={{height:22,borderRadius:6,background:'var(--ev)',width:'35%'}}/>
                </div>
              )) : [
                {label:tc('page_admin_agent.statPendingReview'), value:benCounts.pending,   color:'#f59e0b'},
                {label:tc('page_admin_agent.statPublished'),     value:benCounts.published,  color:'#10b981'},
                {label:tc('page_admin_agent.statRejected'),      value:benCounts.rejected,   color:'#94a3b8'},
                {label:tc('page_admin_agent.statTotalDrafts'),   value:benCounts.total,      color:'var(--tx)'},
              ].map(({label,value,color}) => (
                <div key={label} style={{padding:14,borderRadius:12,border:'1px solid var(--b)',background:'var(--sf)'}}>
                  <div style={{fontSize:14,fontWeight:600,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:6}}>{label}</div>
                  <div style={{fontSize:26,fontWeight:700,fontFamily:'var(--font-sora)',color}}>{value}</div>
                </div>
              ))}
            </div>

            {/* Filter */}
            <div style={{display:'flex',gap:8,marginBottom:16}}>
              {(['pending','published','rejected','all'] as const).map(f => (
                <button key={f} onClick={() => { setBenLoading(true); setBenFilter(f) }} style={{padding:'6px 14px',borderRadius:9999,border:`1px solid ${benFilter===f?'#1d4ed8':'var(--b)'}`,background:benFilter===f?'rgba(29,78,216,.08)':'transparent',color:benFilter===f?'#1d4ed8':'var(--tx3)',fontSize:16,fontWeight:benFilter===f?600:400,cursor:'pointer',fontFamily:'inherit',textTransform:'capitalize',transition:'background 150ms, color 150ms, border-color 150ms'}}>{f}</button>
              ))}
            </div>

            {/* Posts list */}
            {benItems.length === 0 ? (
              <div style={{textAlign:'center',padding:'60px 0',color:'var(--tx3)'}}>
                <div style={{width:56,height:56,borderRadius:'50%',background:'linear-gradient(135deg,#1d4ed8,#60a5fa)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:700,color:'#fff',fontFamily:'var(--font-sora)',margin:'0 auto 16px',opacity:.7}}>BC</div>
                <div style={{fontSize:18,fontWeight:500,marginBottom:6,color:'var(--tx)'}}>{tc('page_admin_agent.noDraftsYet')}</div>
                <div style={{fontSize:16,maxWidth:280,margin:'0 auto',lineHeight:1.6}}>{tc('page_admin_agent.benEmptyDesc')}</div>
              </div>
            ) : (
              <div style={{borderRadius:14,border:'1px solid var(--b)',overflow:'hidden',background:'var(--sf)'}}>
                {benItems.map(item => {
                  const blog = item.content || {}
                  return (
                    <div key={item.id} style={{padding:'14px 16px',borderBottom:'1px solid var(--b)',display:'flex',alignItems:'center',gap:10,flexWrap:'wrap',cursor:'pointer',transition:'background 120ms'}} onClick={() => openBenPreview(item)} onMouseEnter={e=>e.currentTarget.style.background='var(--ev)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <span style={{fontSize:15,fontWeight:600,padding:'2px 8px',borderRadius:6,background:item.status==='pending'?'rgba(245,158,11,.1)':item.status==='published'?'rgba(16,185,129,.1)':'rgba(148,163,184,.1)',color:item.status==='pending'?'#f59e0b':item.status==='published'?'#10b981':'#94a3b8'}}>{item.status}</span>
                      <span style={{fontSize:15,padding:'2px 8px',borderRadius:6,background:'rgba(29,78,216,.08)',color:'#1d4ed8',fontWeight:500}}>{blog.cluster || '—'}</span>
                      <span style={{fontSize:17,color:'var(--tx)',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontWeight:500}}>{blog.title || 'Untitled'}</span>
                      {blog.qualityScore != null && <span style={{fontSize:14,fontWeight:600,padding:'2px 6px',borderRadius:4,background:blog.qualityScore>=80?'rgba(16,185,129,.1)':'rgba(245,158,11,.1)',color:blog.qualityScore>=80?'#10b981':'#f59e0b'}}>{blog.qualityScore}</span>}
                      <span style={{fontSize:15,color:'var(--tx3)'}}>{blog.readTime ? `${blog.readTime} min` : ''}</span>
                      <span style={{fontSize:15,color:'var(--tx3)'}}>{new Date(item.created_at).toLocaleDateString('en-GB')}</span>
                      {item.status === 'pending' && (
                        <div style={{display:'flex',gap:6}} onClick={e => e.stopPropagation()}>
                          <button onClick={() => handleBenAction(item.id, 'approve')} disabled={benActing===item.id} style={{padding:'4px 12px',borderRadius:6,border:'none',background:'#1d4ed8',color:'#fff',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{tc('page_admin_agent.authorise')}</button>
                          <button onClick={() => handleBenAction(item.id, 'reject')} disabled={benActing===item.id} style={{padding:'4px 12px',borderRadius:6,border:'1px solid var(--b)',background:'transparent',color:'#f87171',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{tc('page_admin_agent.reject')}</button>
                        </div>
                      )}
                      {item.status === 'published' && blog.slug && (
                        <a href={`/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{padding:'4px 12px',borderRadius:6,border:'1px solid rgba(29,78,216,.3)',background:'rgba(29,78,216,.08)',color:'#1d4ed8',fontSize:15,fontWeight:600,textDecoration:'none',fontFamily:'inherit'}}>{tc('page_admin_agent.viewOnBlog')}</a>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Preview modal */}
            {benPreview && (
              <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',padding:20}} onClick={() => setBenPreview(null)}>
                <div style={{background:'var(--sf)',borderRadius:16,maxWidth:800,width:'100%',maxHeight:'90vh',overflow:'auto',padding:0}} onClick={e => e.stopPropagation()}>
                  {/* Modal header */}
                  <div style={{padding:'16px 24px',borderBottom:'1px solid var(--b)',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,background:'var(--sf)',zIndex:1,borderRadius:'16px 16px 0 0'}}>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#1d4ed8,#60a5fa)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:700,color:'#fff'}}>BC</div>
                      <div>
                        <div style={{fontSize:17,fontWeight:600,color:'var(--tx)'}}>{tc('page_admin_agent.tabBen')}</div>
                        <div style={{fontSize:15,color:'var(--tx3)'}}>{benPreview.content?.cluster} · {new Date(benPreview.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}</div>
                      </div>
                    </div>
                    <div style={{display:'flex',gap:8}}>
                      {benPreview.status === 'pending' && <>
                        <button onClick={() => handleBenAction(benPreview.id, 'approve')} disabled={benActing===benPreview.id} style={{padding:'6px 16px',borderRadius:8,border:'none',background:'#1d4ed8',color:'#fff',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{tc('page_admin_agent.authoriseAndPublish')}</button>
                        <button onClick={() => handleBenAction(benPreview.id, 'reject')} disabled={benActing===benPreview.id} style={{padding:'6px 16px',borderRadius:8,border:'1px solid var(--b)',background:'transparent',color:'#f87171',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{tc('page_admin_agent.reject')}</button>
                      </>}
                      <button onClick={() => setBenPreview(null)} aria-label="Close preview" style={{padding:'6px 10px',borderRadius:8,border:'1px solid var(--b)',background:'transparent',color:'var(--tx3)',fontSize:18,cursor:'pointer',fontFamily:'inherit',lineHeight:1}}>×</button>
                    </div>
                  </div>

                  {/* Modal body */}
                  <div style={{padding:24}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16,fontSize:16,color:'var(--tx3)'}}>
                      <span style={{fontWeight:600,color:'var(--tx)'}}>{tc('page_admin_agent.writtenByBen')}</span>
                      <span>·</span><span>{benPreview.content?.publishDate}</span>
                      <span>·</span><span>{tc('page_admin_agent.minRead', { n: benPreview.content?.readTime })}</span>
                      {benPreview.source_url && <><span>·</span><a href={benPreview.source_url} target="_blank" rel="noopener noreferrer" style={{color:'#1d4ed8',textDecoration:'none'}}>{tc('page_admin_agent.source')}</a></>}
                    </div>

                    {benPreview.status === 'pending' ? (
                      <input value={benEditTitle} onChange={e => setBenEditTitle(e.target.value)} placeholder={tc('page_admin_agent.articleTitlePlaceholder')} style={{fontSize:26,fontWeight:700,fontFamily:'var(--font-sora)',color:'var(--tx)',border:'1px solid var(--b)',borderRadius:8,padding:'8px 12px',width:'100%',marginBottom:16,background:'transparent',boxSizing:'border-box'}} />
                    ) : (
                      <h1 style={{fontSize:26,fontWeight:700,fontFamily:'var(--font-sora)',color:'var(--tx)',marginBottom:16,marginTop:0}}>{benPreview.content?.title}</h1>
                    )}

                    {benPreview.content?.tldr && (
                      <div style={{padding:'12px 16px',borderRadius:10,background:'rgba(29,78,216,.05)',border:'1px solid rgba(29,78,216,.15)',marginBottom:24,fontSize:17,color:'var(--tx2)',lineHeight:1.6}}>
                        <strong style={{color:'#1d4ed8',fontSize:15,textTransform:'uppercase',letterSpacing:'.06em'}}>{tc('page_admin_agent.tldr')}</strong><br/>{benPreview.content.tldr}
                      </div>
                    )}

                    {(benPreview.status === 'pending' ? benEditSections : benPreview.content?.sections || []).map((sec: any, i: number) => (
                      <div key={i} style={{marginBottom:24}}>
                        {benPreview.status === 'pending' ? (
                          <>
                            <input value={sec.heading} onChange={e => { const s = [...benEditSections]; s[i] = {...s[i], heading: e.target.value}; setBenEditSections(s) }} placeholder={tc('page_admin_agent.sectionHeadingPlaceholder')} style={{fontSize:20,fontWeight:600,fontFamily:'var(--font-sora)',color:'var(--tx)',border:'1px solid var(--b)',borderRadius:6,padding:'6px 10px',width:'100%',marginBottom:8,background:'transparent',boxSizing:'border-box'}} />
                            <textarea value={sec.body} onChange={e => { const s = [...benEditSections]; s[i] = {...s[i], body: e.target.value}; setBenEditSections(s) }} rows={5} placeholder={tc('page_admin_agent.writeSectionPlaceholder')} style={{fontSize:17,lineHeight:1.7,color:'var(--tx2)',border:'1px solid var(--b)',borderRadius:6,padding:'8px 10px',width:'100%',resize:'vertical',fontFamily:'inherit',background:'transparent',boxSizing:'border-box'}} />
                          </>
                        ) : (
                          <>
                            <h2 style={{fontSize:20,fontWeight:600,fontFamily:'var(--font-sora)',color:'var(--tx)',marginBottom:8,marginTop:0}}>{sec.heading}</h2>
                            <p style={{fontSize:17,lineHeight:1.7,color:'var(--tx2)',margin:0}}>{sec.body}</p>
                          </>
                        )}
                      </div>
                    ))}

                    {benPreview.content?.paa?.length > 0 && (
                      <div style={{marginTop:24,padding:16,borderRadius:10,border:'1px solid var(--b)',background:'rgba(0,0,0,.02)'}}>
                        <h3 style={{fontSize:17,fontWeight:600,color:'var(--tx)',marginBottom:12,marginTop:0}}>{tc('page_admin_agent.peopleAlsoAsk')}</h3>
                        {benPreview.content.paa.map((qa: any, i: number) => (
                          <div key={i} style={{marginBottom:12}}>
                            <div style={{fontSize:17,fontWeight:600,color:'var(--tx)',marginBottom:4}}>{qa.q}</div>
                            <div style={{fontSize:16,color:'var(--tx2)',lineHeight:1.6}}>{qa.a}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {benPreview.content?.cta && (
                      <div style={{marginTop:24,padding:16,borderRadius:10,background:'rgba(29,78,216,.06)',border:'1px solid rgba(29,78,216,.15)'}}>
                        <div style={{fontSize:18,fontWeight:600,color:'#1d4ed8',marginBottom:4}}>{benPreview.content.cta.heading}</div>
                        <div style={{fontSize:16,color:'var(--tx2)'}}>{benPreview.content.cta.body}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── MAYA CHEN — MARKETING INTELLIGENCE ── */}
        {mainTab === 'marketing-specialist' && agentTab === 'maya' && (
          <>
            {/* Maya profile card */}
            <div style={{display:'flex',alignItems:'center',gap:16,padding:20,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)',marginBottom:20}}>
              <div style={{width:56,height:56,borderRadius:'50%',background:'linear-gradient(135deg, #e11d48 0%, #fb7185 100%)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:22,fontWeight:700,color:'#fff',fontFamily:'var(--font-sora)'}}>MC</div>
              <div style={{flex:1}}>
                <div style={{fontSize:20,fontWeight:700,fontFamily:'var(--font-sora)',color:'var(--tx)'}}>{tc('page_admin_agent.tabMaya')}</div>
                <div style={{fontSize:16,color:'#e11d48',fontWeight:600,marginBottom:4}}>{tc('page_admin_agent.mayaRole')}</div>
                <div style={{fontSize:16,color:'var(--tx3)',lineHeight:1.5}}>{tc('page_admin_agent.mayaDesc')}</div>
              </div>
              <button onClick={runMayaScout} disabled={mayaRunning} style={{padding:'10px 20px',borderRadius:9999,border:'none',background:mayaRunning?'var(--b)':'#e11d48',color:mayaRunning?'var(--tx3)':'#fff',fontSize:17,fontWeight:600,cursor:mayaRunning?'wait':'pointer',fontFamily:'inherit',flexShrink:0,transition:'background 200ms, color 200ms'}}>
                {mayaRunning ? tc('page_admin_agent.writing') : tc('page_admin_agent.runMayaNow')}
              </button>
            </div>

            {/* Run log */}
            {mayaRunLog.length > 0 && (
              <div style={{marginBottom:20,padding:'14px 16px',borderRadius:12,background:'var(--ev)',border:'1px solid var(--b)',fontSize:16,fontFamily:'monospace',color:'var(--tx2)',maxHeight:200,overflowY:'auto'}}>
                {mayaRunLog.map((l,i) => <div key={i}>{l}</div>)}
              </div>
            )}

            {/* Stats */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:10,marginBottom:20}}>
              {mayaLoading ? [0,1,2,3].map(i => (
                <div key={i} style={{padding:14,borderRadius:12,border:'1px solid var(--b)',background:'var(--sf)',minHeight:66}}>
                  <div style={{height:9,borderRadius:5,background:'var(--ev)',marginBottom:10,width:'65%'}}/>
                  <div style={{height:22,borderRadius:6,background:'var(--ev)',width:'35%'}}/>
                </div>
              )) : [
                {label:tc('page_admin_agent.statPendingReview'), value:mayaCounts.pending,   color:'#f59e0b'},
                {label:tc('page_admin_agent.statPublished'),     value:mayaCounts.published,  color:'#10b981'},
                {label:tc('page_admin_agent.statRejected'),      value:mayaCounts.rejected,   color:'#94a3b8'},
                {label:tc('page_admin_agent.statTotalDrafts'),   value:mayaCounts.total,      color:'var(--tx)'},
              ].map(({label,value,color}) => (
                <div key={label} style={{padding:14,borderRadius:12,border:'1px solid var(--b)',background:'var(--sf)'}}>
                  <div style={{fontSize:14,fontWeight:600,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:6}}>{label}</div>
                  <div style={{fontSize:26,fontWeight:700,fontFamily:'var(--font-sora)',color}}>{value}</div>
                </div>
              ))}
            </div>

            {/* Filter */}
            <div style={{display:'flex',gap:8,marginBottom:16}}>
              {(['pending','published','rejected','all'] as const).map(f => (
                <button key={f} onClick={() => { setMayaLoading(true); setMayaFilter(f) }} style={{padding:'6px 14px',borderRadius:9999,border:`1px solid ${mayaFilter===f?'#e11d48':'var(--b)'}`,background:mayaFilter===f?'rgba(225,29,72,.08)':'transparent',color:mayaFilter===f?'#e11d48':'var(--tx3)',fontSize:16,fontWeight:mayaFilter===f?600:400,cursor:'pointer',fontFamily:'inherit',textTransform:'capitalize',transition:'background 150ms, color 150ms, border-color 150ms'}}>{f}</button>
              ))}
            </div>

            {/* Posts list */}
            {mayaItems.length === 0 ? (
              <div style={{textAlign:'center',padding:'60px 0',color:'var(--tx3)'}}>
                <div style={{width:56,height:56,borderRadius:'50%',background:'linear-gradient(135deg,#e11d48,#fb7185)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:700,color:'#fff',fontFamily:'var(--font-sora)',margin:'0 auto 16px',opacity:.7}}>MC</div>
                <div style={{fontSize:18,fontWeight:500,marginBottom:6,color:'var(--tx)'}}>{tc('page_admin_agent.noDraftsYet')}</div>
                <div style={{fontSize:16,maxWidth:280,margin:'0 auto',lineHeight:1.6}}>{tc('page_admin_agent.mayaEmptyDesc')}</div>
              </div>
            ) : (
              <div style={{borderRadius:14,border:'1px solid var(--b)',overflow:'hidden',background:'var(--sf)'}}>
                {mayaItems.map(item => {
                  const blog = item.content || {}
                  return (
                    <div key={item.id} style={{padding:'14px 16px',borderBottom:'1px solid var(--b)',display:'flex',alignItems:'center',gap:10,flexWrap:'wrap',cursor:'pointer',transition:'background 120ms'}} onClick={() => openMayaPreview(item)} onMouseEnter={e=>e.currentTarget.style.background='var(--ev)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <span style={{fontSize:15,fontWeight:600,padding:'2px 8px',borderRadius:6,background:item.status==='pending'?'rgba(245,158,11,.1)':item.status==='published'?'rgba(16,185,129,.1)':'rgba(148,163,184,.1)',color:item.status==='pending'?'#f59e0b':item.status==='published'?'#10b981':'#94a3b8'}}>{item.status}</span>
                      <span style={{fontSize:15,padding:'2px 8px',borderRadius:6,background:'rgba(225,29,72,.08)',color:'#e11d48',fontWeight:500}}>{blog.cluster || '—'}</span>
                      <span style={{fontSize:17,color:'var(--tx)',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontWeight:500}}>{blog.title || 'Untitled'}</span>
                      {blog.qualityScore != null && <span style={{fontSize:14,fontWeight:600,padding:'2px 6px',borderRadius:4,background:blog.qualityScore>=80?'rgba(16,185,129,.1)':'rgba(245,158,11,.1)',color:blog.qualityScore>=80?'#10b981':'#f59e0b'}}>{blog.qualityScore}</span>}
                      <span style={{fontSize:15,color:'var(--tx3)'}}>{blog.readTime ? `${blog.readTime} min` : ''}</span>
                      <span style={{fontSize:15,color:'var(--tx3)'}}>{new Date(item.created_at).toLocaleDateString('en-GB')}</span>
                      {item.status === 'pending' && (
                        <div style={{display:'flex',gap:6}} onClick={e => e.stopPropagation()}>
                          <button onClick={() => handleMayaAction(item.id, 'approve')} disabled={mayaActing===item.id} style={{padding:'4px 12px',borderRadius:6,border:'none',background:'#e11d48',color:'#fff',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{tc('page_admin_agent.authorise')}</button>
                          <button onClick={() => handleMayaAction(item.id, 'reject')} disabled={mayaActing===item.id} style={{padding:'4px 12px',borderRadius:6,border:'1px solid var(--b)',background:'transparent',color:'#f87171',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{tc('page_admin_agent.reject')}</button>
                        </div>
                      )}
                      {item.status === 'published' && blog.slug && (
                        <a href={`/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{padding:'4px 12px',borderRadius:6,border:'1px solid rgba(225,29,72,.3)',background:'rgba(225,29,72,.08)',color:'#e11d48',fontSize:15,fontWeight:600,textDecoration:'none',fontFamily:'inherit'}}>{tc('page_admin_agent.viewOnBlog')}</a>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Preview modal */}
            {mayaPreview && (
              <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',padding:20}} onClick={() => setMayaPreview(null)}>
                <div style={{background:'var(--sf)',borderRadius:16,maxWidth:800,width:'100%',maxHeight:'90vh',overflow:'auto',padding:0}} onClick={e => e.stopPropagation()}>
                  <div style={{padding:'16px 24px',borderBottom:'1px solid var(--b)',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,background:'var(--sf)',zIndex:1,borderRadius:'16px 16px 0 0'}}>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#e11d48,#fb7185)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:700,color:'#fff'}}>MC</div>
                      <div>
                        <div style={{fontSize:17,fontWeight:600,color:'var(--tx)'}}>{tc('page_admin_agent.tabMaya')}</div>
                        <div style={{fontSize:15,color:'var(--tx3)'}}>{mayaPreview.content?.cluster} · {new Date(mayaPreview.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}</div>
                      </div>
                    </div>
                    <div style={{display:'flex',gap:8}}>
                      {mayaPreview.status === 'pending' && <>
                        <button onClick={() => handleMayaAction(mayaPreview.id, 'approve')} disabled={mayaActing===mayaPreview.id} style={{padding:'6px 16px',borderRadius:8,border:'none',background:'#e11d48',color:'#fff',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{tc('page_admin_agent.authoriseAndPublish')}</button>
                        <button onClick={() => handleMayaAction(mayaPreview.id, 'reject')} disabled={mayaActing===mayaPreview.id} style={{padding:'6px 16px',borderRadius:8,border:'1px solid var(--b)',background:'transparent',color:'#f87171',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{tc('page_admin_agent.reject')}</button>
                      </>}
                      <button onClick={() => setMayaPreview(null)} aria-label="Close preview" style={{padding:'6px 10px',borderRadius:8,border:'1px solid var(--b)',background:'transparent',color:'var(--tx3)',fontSize:18,cursor:'pointer',fontFamily:'inherit',lineHeight:1}}>×</button>
                    </div>
                  </div>
                  <div style={{padding:24}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16,fontSize:16,color:'var(--tx3)'}}>
                      <span style={{fontWeight:600,color:'var(--tx)'}}>{tc('page_admin_agent.writtenByMaya')}</span>
                      <span>·</span><span>{mayaPreview.content?.publishDate}</span>
                      <span>·</span><span>{tc('page_admin_agent.minRead', { n: mayaPreview.content?.readTime })}</span>
                      {mayaPreview.source_url && <><span>·</span><a href={mayaPreview.source_url} target="_blank" rel="noopener noreferrer" style={{color:'#e11d48',textDecoration:'none'}}>{tc('page_admin_agent.source')}</a></>}
                    </div>
                    {mayaPreview.status === 'pending' ? (
                      <input value={mayaEditTitle} onChange={e => setMayaEditTitle(e.target.value)} placeholder={tc('page_admin_agent.articleTitlePlaceholder')} style={{fontSize:26,fontWeight:700,fontFamily:'var(--font-sora)',color:'var(--tx)',border:'1px solid var(--b)',borderRadius:8,padding:'8px 12px',width:'100%',marginBottom:16,background:'transparent',boxSizing:'border-box'}} />
                    ) : (
                      <h1 style={{fontSize:26,fontWeight:700,fontFamily:'var(--font-sora)',color:'var(--tx)',marginBottom:16,marginTop:0}}>{mayaPreview.content?.title}</h1>
                    )}
                    {mayaPreview.content?.tldr && (
                      <div style={{padding:'12px 16px',borderRadius:10,background:'rgba(225,29,72,.05)',border:'1px solid rgba(225,29,72,.15)',marginBottom:24,fontSize:17,color:'var(--tx2)',lineHeight:1.6}}>
                        <strong style={{color:'#e11d48',fontSize:15,textTransform:'uppercase',letterSpacing:'.06em'}}>{tc('page_admin_agent.tldr')}</strong><br/>{mayaPreview.content.tldr}
                      </div>
                    )}
                    {(mayaPreview.status === 'pending' ? mayaEditSections : mayaPreview.content?.sections || []).map((sec: any, i: number) => (
                      <div key={i} style={{marginBottom:24}}>
                        {mayaPreview.status === 'pending' ? (
                          <>
                            <input value={sec.heading} onChange={e => { const s = [...mayaEditSections]; s[i] = {...s[i], heading: e.target.value}; setMayaEditSections(s) }} placeholder={tc('page_admin_agent.sectionHeadingPlaceholder')} style={{fontSize:20,fontWeight:600,fontFamily:'var(--font-sora)',color:'var(--tx)',border:'1px solid var(--b)',borderRadius:6,padding:'6px 10px',width:'100%',marginBottom:8,background:'transparent',boxSizing:'border-box'}} />
                            <textarea value={sec.body} onChange={e => { const s = [...mayaEditSections]; s[i] = {...s[i], body: e.target.value}; setMayaEditSections(s) }} rows={5} placeholder={tc('page_admin_agent.writeSectionPlaceholder')} style={{fontSize:17,lineHeight:1.7,color:'var(--tx2)',border:'1px solid var(--b)',borderRadius:6,padding:'8px 10px',width:'100%',resize:'vertical',fontFamily:'inherit',background:'transparent',boxSizing:'border-box'}} />
                          </>
                        ) : (
                          <>
                            <h2 style={{fontSize:20,fontWeight:600,fontFamily:'var(--font-sora)',color:'var(--tx)',marginBottom:8,marginTop:0}}>{sec.heading}</h2>
                            <p style={{fontSize:17,lineHeight:1.7,color:'var(--tx2)',margin:0}}>{sec.body}</p>
                          </>
                        )}
                      </div>
                    ))}
                    {mayaPreview.content?.paa?.length > 0 && (
                      <div style={{marginTop:24,padding:16,borderRadius:10,border:'1px solid var(--b)',background:'rgba(0,0,0,.02)'}}>
                        <h3 style={{fontSize:17,fontWeight:600,color:'var(--tx)',marginBottom:12,marginTop:0}}>{tc('page_admin_agent.peopleAlsoAsk')}</h3>
                        {mayaPreview.content.paa.map((qa: any, i: number) => (
                          <div key={i} style={{marginBottom:12}}>
                            <div style={{fontSize:17,fontWeight:600,color:'var(--tx)',marginBottom:4}}>{qa.q}</div>
                            <div style={{fontSize:16,color:'var(--tx2)',lineHeight:1.6}}>{qa.a}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    {mayaPreview.content?.cta && (
                      <div style={{marginTop:24,padding:16,borderRadius:10,background:'rgba(225,29,72,.06)',border:'1px solid rgba(225,29,72,.15)'}}>
                        <div style={{fontSize:18,fontWeight:600,color:'#e11d48',marginBottom:4}}>{mayaPreview.content.cta.heading}</div>
                        <div style={{fontSize:16,color:'var(--tx2)'}}>{mayaPreview.content.cta.body}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── JANE WANJIRU — COMMUNITY SCOUT ── */}
        {mainTab === 'marketing-specialist' && agentTab === 'jane' && (
          <>
            {/* Jane profile card */}
            <div style={{display:'flex',alignItems:'center',gap:16,padding:20,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)',marginBottom:20}}>
              <div style={{width:56,height:56,borderRadius:'50%',background:'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:22,fontWeight:700,color:'#fff',fontFamily:'var(--font-sora)'}}>JW</div>
              <div style={{flex:1}}>
                <div style={{fontSize:20,fontWeight:700,fontFamily:'var(--font-sora)',color:'var(--tx)'}}>Jane Wanjiru</div>
                <div style={{fontSize:16,color:'#7c3aed',fontWeight:600,marginBottom:4}}>Head of Community Growth, Kenya</div>
                <div style={{fontSize:16,color:'var(--tx3)',lineHeight:1.5}}>Drafts short WhatsApp and Facebook community-group posts for Kenya micro-business owners. Nothing auto-posts — approved drafts are copy-pasted manually into groups.</div>
              </div>
              <button onClick={runJaneScout} disabled={janeRunning} style={{padding:'10px 20px',borderRadius:9999,border:'none',background:janeRunning?'var(--b)':'#7c3aed',color:janeRunning?'var(--tx3)':'#fff',fontSize:17,fontWeight:600,cursor:janeRunning?'wait':'pointer',fontFamily:'inherit',flexShrink:0,transition:'background 200ms, color 200ms'}}>
                {janeRunning ? 'Drafting…' : 'Run Jane Now'}
              </button>
            </div>

            {/* Run log */}
            {janeRunLog.length > 0 && (
              <div style={{marginBottom:20,padding:'14px 16px',borderRadius:12,background:'var(--ev)',border:'1px solid var(--b)',fontSize:16,fontFamily:'monospace',color:'var(--tx2)',maxHeight:200,overflowY:'auto'}}>
                {janeRunLog.map((l,i) => <div key={i}>{l}</div>)}
              </div>
            )}

            {/* Stats */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:10,marginBottom:20}}>
              {janeLoading ? [0,1,2,3].map(i => (
                <div key={i} style={{padding:14,borderRadius:12,border:'1px solid var(--b)',background:'var(--sf)',minHeight:66}}>
                  <div style={{height:9,borderRadius:5,background:'var(--ev)',marginBottom:10,width:'65%'}}/>
                  <div style={{height:22,borderRadius:6,background:'var(--ev)',width:'35%'}}/>
                </div>
              )) : [
                {label:tc('page_admin_agent.statPendingReview'), value:janeCounts.pending,   color:'#f59e0b'},
                {label:tc('page_admin_agent.statPublished'),     value:janeCounts.published,  color:'#10b981'},
                {label:tc('page_admin_agent.statRejected'),      value:janeCounts.rejected,   color:'#94a3b8'},
                {label:tc('page_admin_agent.statTotalDrafts'),   value:janeCounts.total,      color:'var(--tx)'},
              ].map(({label,value,color}) => (
                <div key={label} style={{padding:14,borderRadius:12,border:'1px solid var(--b)',background:'var(--sf)'}}>
                  <div style={{fontSize:14,fontWeight:600,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:6}}>{label}</div>
                  <div style={{fontSize:26,fontWeight:700,fontFamily:'var(--font-sora)',color}}>{value}</div>
                </div>
              ))}
            </div>

            {/* Filter */}
            <div style={{display:'flex',gap:8,marginBottom:16}}>
              {(['pending','published','rejected','all'] as const).map(f => (
                <button key={f} onClick={() => { setJaneLoading(true); setJaneFilter(f) }} style={{padding:'6px 14px',borderRadius:9999,border:`1px solid ${janeFilter===f?'#7c3aed':'var(--b)'}`,background:janeFilter===f?'rgba(124,58,237,.08)':'transparent',color:janeFilter===f?'#7c3aed':'var(--tx3)',fontSize:16,fontWeight:janeFilter===f?600:400,cursor:'pointer',fontFamily:'inherit',textTransform:'capitalize',transition:'background 150ms, color 150ms, border-color 150ms'}}>{f}</button>
              ))}
            </div>

            {/* Posts list */}
            {janeItems.length === 0 ? (
              <div style={{textAlign:'center',padding:'60px 0',color:'var(--tx3)'}}>
                <div style={{width:56,height:56,borderRadius:'50%',background:'linear-gradient(135deg,#7c3aed,#a78bfa)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:700,color:'#fff',fontFamily:'var(--font-sora)',margin:'0 auto 16px',opacity:.7}}>JW</div>
                <div style={{fontSize:18,fontWeight:500,marginBottom:6,color:'var(--tx)'}}>{tc('page_admin_agent.noDraftsYet')}</div>
                <div style={{fontSize:16,maxWidth:280,margin:'0 auto',lineHeight:1.6}}>Run Jane to draft short community posts ready to copy-paste into WhatsApp and Facebook groups.</div>
              </div>
            ) : (
              <div style={{borderRadius:14,border:'1px solid var(--b)',overflow:'hidden',background:'var(--sf)'}}>
                {janeItems.map(item => {
                  const post = item.content || {}
                  const expanded = expandedId === item.id
                  return (
                    <div key={item.id} style={{borderBottom:'1px solid var(--b)'}}>
                      <div style={{padding:'14px 16px',display:'flex',alignItems:'center',gap:10,flexWrap:'wrap',cursor:'pointer',transition:'background 120ms'}} onClick={() => setExpandedId(expanded ? null : item.id)} onMouseEnter={e=>e.currentTarget.style.background='var(--ev)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                        <span style={{fontSize:15,fontWeight:600,padding:'2px 8px',borderRadius:6,background:item.status==='pending'?'rgba(245,158,11,.1)':item.status==='published'?'rgba(16,185,129,.1)':'rgba(148,163,184,.1)',color:item.status==='pending'?'#f59e0b':item.status==='published'?'#10b981':'#94a3b8'}}>{item.status}</span>
                        <span style={{fontSize:15,padding:'2px 8px',borderRadius:6,background:'rgba(124,58,237,.08)',color:'#7c3aed',fontWeight:500}}>{post.pillar || '—'}</span>
                        <span style={{fontSize:17,color:'var(--tx)',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontWeight:500}}>{post.topic || 'Untitled'}</span>
                        <span style={{fontSize:15,color:'var(--tx3)'}}>{new Date(item.created_at).toLocaleDateString('en-GB')}</span>
                        {item.status === 'pending' && (
                          <div style={{display:'flex',gap:6}} onClick={e => e.stopPropagation()}>
                            <button onClick={() => openJanePreview(item)} style={{padding:'4px 12px',borderRadius:6,border:'1px solid var(--b)',background:'transparent',color:'var(--tx2)',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>Edit</button>
                            <button onClick={() => handleJaneAction(item.id, 'approve')} disabled={janeActing===item.id} style={{padding:'4px 12px',borderRadius:6,border:'none',background:'#7c3aed',color:'#fff',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{tc('page_admin_agent.authorise')}</button>
                            <button onClick={() => handleJaneAction(item.id, 'reject')} disabled={janeActing===item.id} style={{padding:'4px 12px',borderRadius:6,border:'1px solid var(--b)',background:'transparent',color:'#f87171',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{tc('page_admin_agent.reject')}</button>
                          </div>
                        )}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2" strokeLinecap="round" style={{transform:expanded?'rotate(180deg)':'none',transition:'transform 150ms'}}><path d="M6 9l6 6 6-6"/></svg>
                      </div>
                      {expanded && (
                        <div style={{padding:'0 16px 16px',display:'flex',flexDirection:'column',gap:12}}>
                          <div style={{padding:14,borderRadius:10,border:'1px solid var(--b)',background:'var(--ev)'}}>
                            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
                              <span style={{fontSize:14,fontWeight:600,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.06em'}}>WhatsApp</span>
                              <button onClick={() => navigator.clipboard.writeText(`${post.whatsappText || ''}\n${post.whatsappLink || ''}`)} style={{padding:'2px 10px',borderRadius:6,border:'1px solid var(--b)',background:'transparent',color:'var(--tx2)',fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>Copy</button>
                            </div>
                            <div style={{fontSize:16,color:'var(--tx2)',lineHeight:1.6,whiteSpace:'pre-wrap'}}>{post.whatsappText}</div>
                            {post.whatsappLink && <div style={{fontSize:14,color:'#7c3aed',marginTop:6,wordBreak:'break-all'}}>{post.whatsappLink}</div>}
                          </div>
                          <div style={{padding:14,borderRadius:10,border:'1px solid var(--b)',background:'var(--ev)'}}>
                            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
                              <span style={{fontSize:14,fontWeight:600,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.06em'}}>Facebook</span>
                              <button onClick={() => navigator.clipboard.writeText(`${post.facebookText || ''}\n${post.facebookLink || ''}`)} style={{padding:'2px 10px',borderRadius:6,border:'1px solid var(--b)',background:'transparent',color:'var(--tx2)',fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>Copy</button>
                            </div>
                            <div style={{fontSize:16,color:'var(--tx2)',lineHeight:1.6,whiteSpace:'pre-wrap'}}>{post.facebookText}</div>
                            {post.facebookLink && <div style={{fontSize:14,color:'#7c3aed',marginTop:6,wordBreak:'break-all'}}>{post.facebookLink}</div>}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Edit / preview modal */}
            {janePreview && (
              <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',padding:20}} onClick={() => setJanePreview(null)}>
                <div style={{background:'var(--sf)',borderRadius:16,maxWidth:600,width:'100%',maxHeight:'90vh',overflow:'auto',padding:0}} onClick={e => e.stopPropagation()}>
                  <div style={{padding:'16px 24px',borderBottom:'1px solid var(--b)',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,background:'var(--sf)',zIndex:1,borderRadius:'16px 16px 0 0'}}>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#7c3aed,#a78bfa)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:700,color:'#fff'}}>JW</div>
                      <div>
                        <div style={{fontSize:17,fontWeight:600,color:'var(--tx)'}}>Jane Wanjiru</div>
                        <div style={{fontSize:15,color:'var(--tx3)'}}>{janePreview.content?.pillar} · {new Date(janePreview.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}</div>
                      </div>
                    </div>
                    <div style={{display:'flex',gap:8}}>
                      {janePreview.status === 'pending' && <>
                        <button onClick={() => handleJaneAction(janePreview.id, 'approve')} disabled={janeActing===janePreview.id} style={{padding:'6px 16px',borderRadius:8,border:'none',background:'#7c3aed',color:'#fff',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{tc('page_admin_agent.authorise')}</button>
                        <button onClick={() => handleJaneAction(janePreview.id, 'reject')} disabled={janeActing===janePreview.id} style={{padding:'6px 16px',borderRadius:8,border:'1px solid var(--b)',background:'transparent',color:'#f87171',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{tc('page_admin_agent.reject')}</button>
                      </>}
                      <button onClick={() => setJanePreview(null)} aria-label="Close preview" style={{padding:'6px 10px',borderRadius:8,border:'1px solid var(--b)',background:'transparent',color:'var(--tx3)',fontSize:18,cursor:'pointer',fontFamily:'inherit',lineHeight:1}}>×</button>
                    </div>
                  </div>
                  <div style={{padding:24}}>
                    <div style={{fontSize:20,fontWeight:700,fontFamily:'var(--font-sora)',color:'var(--tx)',marginBottom:20}}>{janePreview.content?.topic}</div>
                    <div style={{marginBottom:16}}>
                      <label style={{fontSize:14,fontWeight:600,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.06em',display:'block',marginBottom:6}}>WhatsApp text</label>
                      <textarea value={janeEditWhatsapp} onChange={e => setJaneEditWhatsapp(e.target.value)} rows={5} style={{fontSize:16,lineHeight:1.6,color:'var(--tx2)',border:'1px solid var(--b)',borderRadius:8,padding:'10px 12px',width:'100%',resize:'vertical',fontFamily:'inherit',background:'transparent',boxSizing:'border-box'}} />
                      <div style={{fontSize:14,color:'var(--tx3)',marginTop:4}}>{janeEditWhatsapp.length} characters</div>
                    </div>
                    <div style={{marginBottom:8}}>
                      <label style={{fontSize:14,fontWeight:600,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.06em',display:'block',marginBottom:6}}>Facebook text</label>
                      <textarea value={janeEditFacebook} onChange={e => setJaneEditFacebook(e.target.value)} rows={6} style={{fontSize:16,lineHeight:1.6,color:'var(--tx2)',border:'1px solid var(--b)',borderRadius:8,padding:'10px 12px',width:'100%',resize:'vertical',fontFamily:'inherit',background:'transparent',boxSizing:'border-box'}} />
                      <div style={{fontSize:14,color:'var(--tx3)',marginTop:4}}>{janeEditFacebook.length} characters</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── AGENT TAB ── */}
        {mainTab === 'agent' && (
          <>
            {runLog.length > 0 && <div style={{marginBottom:20,padding:'14px 16px',borderRadius:12,background:'var(--ev)',border:'1px solid var(--b)',fontSize:16,fontFamily:'monospace',color:'var(--tx2)',maxHeight:200,overflowY:'auto'}}>{runLog.map((l,i)=><div key={i}>{l}</div>)}</div>}
            <div style={{display:'flex',gap:8,marginBottom:20}}>
              {(['pending','published','rejected','all'] as const).map(f => (
                <button key={f} onClick={()=>setFilter(f)} style={{padding:'6px 14px',borderRadius:9999,border:`1px solid ${filter===f?'#6366F1':'var(--b2)'}`,background:filter===f?'rgba(99,102,241,.1)':'transparent',color:filter===f?'#6366F1':'var(--tx3)',fontSize:16,fontWeight:filter===f?600:400,cursor:'pointer',fontFamily:'inherit',textTransform:'capitalize'}}>{f}</button>
              ))}
            </div>
            {Object.keys(runs).length === 0 && <div style={{textAlign:'center',padding:'60px 0',color:'var(--tx3)',fontSize:18}}>{tc('page_admin_agent.agentNoContent')}</div>}
            {Object.entries(runs).map(([runId, runItems]) => {
              const fi = runItems[0]
              const vs = fi.verdict ? VERDICT_STYLE[fi.verdict as keyof typeof VERDICT_STYLE] : null
              return (
                <div key={runId} style={{marginBottom:24,borderRadius:16,border:'1px solid var(--b)',overflow:'hidden',background:'var(--sf)'}}>
                  <div style={{padding:'14px 16px',borderBottom:'1px solid var(--b)',background:'var(--ev)'}}>
                    <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:17,fontWeight:600,color:'var(--tx)',marginBottom:4,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{fi.source_title||tc('page_admin_agent.agentRun')}</div>
                        <div style={{fontSize:15,color:'var(--tx3)'}}>{new Date(fi.created_at).toLocaleString('en-GB')} · {tc('page_admin_agent.queryColon', { query: fi.source_query })}</div>
                      </div>
                      {vs && <span style={{fontSize:15,fontWeight:600,color:vs.color,background:vs.bg,border:`1px solid ${vs.border}`,padding:'3px 10px',borderRadius:9999,flexShrink:0}}>{vs.label}</span>}
                    </div>
                    {fi.verdict_sentence && <div style={{marginTop:8,fontSize:16,color:'var(--tx2)',fontStyle:'italic'}}>"{fi.verdict_sentence}"</div>}
                  </div>
                  {runItems.map(item => (
                    <div key={item.id} style={{borderBottom:'1px solid var(--b)'}}>
                      <div onClick={()=>setExpandedId(expandedId===item.id?null:item.id)} style={{padding:'12px 16px',display:'flex',alignItems:'center',gap:10,cursor:'pointer',userSelect:'none'}} onMouseEnter={e=>e.currentTarget.style.background='var(--ev)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                        <span style={{fontSize:15,fontWeight:600,padding:'2px 8px',borderRadius:6,background:item.type==='blog'?'rgba(99,102,241,.1)':item.type==='thread'?'rgba(34,197,94,.1)':'rgba(245,158,11,.1)',color:item.type==='blog'?'#6366F1':item.type==='thread'?'#16a34a':'#d97706',textTransform:'uppercase',letterSpacing:'.06em'}}>
                          {item.type==='blog'?tc('page_admin_agent.typeBlog'):item.type==='thread'?tc('page_admin_agent.typeThread'):tc('page_admin_agent.typeReplies')}
                        </span>
                        <span style={{fontSize:15,color:item.status==='pending'?'#d97706':item.status==='published'?'#16a34a':'#94a3b8',fontWeight:500}}>
                          {item.status==='pending'?tc('page_admin_agent.statusPending'):item.status==='published'?tc('page_admin_agent.statusPublished'):tc('page_admin_agent.statusRejected')}
                        </span>
                        <span style={{fontSize:16,color:'var(--tx3)',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                          {item.type==='blog'?(item.content as any).title||'Blog post':item.type==='thread'?`${(item.content as any).tweets?.[0]?.text?.slice(0,60)||'Thread'}…`:`${(item.content as any).replies?.length||0} smart replies`}
                        </span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2" strokeLinecap="round" style={{transform:expandedId===item.id?'rotate(180deg)':'none',transition:'transform 150ms'}}><path d="M6 9l6 6 6-6"/></svg>
                      </div>
                      {expandedId === item.id && (
                        <div style={{padding:'0 16px 16px'}}>
                          <div style={{padding:12,borderRadius:10,background:'var(--bg)',border:'1px solid var(--b)',fontSize:16,color:'var(--tx2)',lineHeight:1.6,maxHeight:320,overflowY:'auto',fontFamily:'monospace',marginBottom:12,whiteSpace:'pre-wrap',wordBreak:'break-word'}}>{JSON.stringify(item.content,null,2)}</div>
                          {item.status==='pending' && (
                            <div style={{display:'flex',gap:8}}>
                              <button onClick={()=>handleAction(item.id,'approve')} disabled={actionLoading===item.id} style={{flex:1,padding:'9px',borderRadius:9,border:'none',background:'#6366F1',color:'#fff',fontSize:17,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{actionLoading===item.id?tc('page_admin_agent.processing'):item.type==='blog'?tc('page_admin_agent.approveAndAddToBlog'):tc('page_admin_agent.approve')}</button>
                              <button onClick={()=>handleAction(item.id,'reject')} disabled={actionLoading===item.id} style={{padding:'9px 16px',borderRadius:9,border:'1px solid var(--b2)',background:'transparent',color:'var(--tx3)',fontSize:17,cursor:'pointer',fontFamily:'inherit'}}>{tc('page_admin_agent.reject')}</button>
                              {item.source_url && <a href={item.source_url} target="_blank" rel="noopener noreferrer" style={{padding:'9px 14px',borderRadius:9,border:'1px solid var(--b2)',background:'transparent',color:'var(--tx3)',fontSize:16,textDecoration:'none',display:'flex',alignItems:'center'}}>{tc('page_admin_agent.sourceLink')}</a>}
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
              {xConnected===null && <span style={{fontSize:16,color:'var(--tx3)'}}>{tc('page_admin_agent.xChecking')}</span>}
              {xConnected===true && <div style={{padding:'5px 12px',borderRadius:9999,background:'rgba(34,197,94,.1)',border:'1px solid rgba(34,197,94,.3)',fontSize:16,fontWeight:600,color:'#16a34a'}}>{tc('page_admin_agent.xConnected')} {xUsername}</div>}
              {xConnected===false && <div style={{padding:'5px 12px',borderRadius:9999,background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.3)',fontSize:16,fontWeight:600,color:'#dc2626'}}>{tc('page_admin_agent.xNotConnected')}</div>}
            </div>

            <div className="tab-strip" style={{borderBottom:'1px solid var(--b)',marginBottom:20}}>
              {(['search','results','queue','history'] as const).map(t => (
                <button key={t} onClick={()=>setXTab(t)} style={{padding:'8px 16px',border:'none',background:'transparent',fontSize:16,fontWeight:xTab===t?600:400,color:xTab===t?'#6366F1':'var(--tx3)',borderBottom:xTab===t?'2px solid #6366F1':'2px solid transparent',cursor:'pointer',fontFamily:'inherit',textTransform:'capitalize',flexShrink:0,whiteSpace:'nowrap'}}>
                  {t}{t==='queue'&&xQueue.length>0?` (${xQueue.length})`:''}
                </button>
              ))}
            </div>

            {xTab === 'search' && (
              <>
                <div style={{...card,marginBottom:16}}>
                  <div style={{fontSize:16,fontWeight:700,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:12}}>{tc('page_admin_agent.xKeywordStrategy')}</div>
                  <div style={{display:'flex',gap:8,marginBottom:14}}>
                    {['preset','custom'].map(m => (
                      <button key={m} onClick={()=>setUseCustom(m==='custom')} style={{padding:'5px 12px',borderRadius:9999,border:`1px solid ${useCustom===(m==='custom')?'#6366F1':'var(--b)'}`,background:useCustom===(m==='custom')?'rgba(99,102,241,.08)':'transparent',color:useCustom===(m==='custom')?'#6366F1':'var(--tx3)',fontSize:16,cursor:'pointer',fontFamily:'inherit'}}>
                        {m==='preset'?tc('page_admin_agent.xUsePreset'):tc('page_admin_agent.xCustomQuery')}
                      </button>
                    ))}
                  </div>
                  {!useCustom ? (
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:8,marginBottom:14}}>
                      {PRESETS.map(p => (
                        <button key={p.id} onClick={()=>setPreset(p.id)} style={{padding:'8px 10px',borderRadius:9,border:`1px solid ${preset===p.id?'#6366F1':'var(--b)'}`,background:preset===p.id?'rgba(99,102,241,.06)':'var(--bg)',textAlign:'left',cursor:'pointer',fontFamily:'inherit',fontSize:16,fontWeight:preset===p.id?600:400,color:preset===p.id?'#6366F1':'var(--tx)'}}>
                          {p.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <textarea value={customQuery} onChange={e=>setCustomQuery(e.target.value)} rows={2} placeholder="small business struggling margins" style={{width:'100%',padding:'8px 10px',borderRadius:9,border:'1px solid var(--b)',background:'var(--bg)',fontSize:17,fontFamily:'inherit',color:'var(--tx)',resize:'vertical',outline:'none',boxSizing:'border-box',marginBottom:14}}/>
                  )}
                  <div style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap'}}>
                    <label style={{fontSize:16,color:'var(--tx2)',display:'flex',alignItems:'center',gap:6}}>
                      {tc('page_admin_agent.xResultsLabel')} <select value={maxResults} onChange={e=>setMaxResults(Number(e.target.value))} style={{padding:'3px 6px',borderRadius:6,border:'1px solid var(--b)',background:'var(--bg)',fontSize:16,fontFamily:'inherit'}}>{[5,10,20].map(n=><option key={n}>{n}</option>)}</select>
                    </label>
                    <button onClick={handleXSearch} disabled={searching} style={{padding:'8px 18px',borderRadius:9999,border:'none',background:searching?'var(--b)':'#6366F1',color:searching?'var(--tx3)':'#fff',fontSize:17,fontWeight:600,cursor:searching?'not-allowed':'pointer',fontFamily:'inherit'}}>
                      {searching?tc('page_admin_agent.xSearching'):tc('page_admin_agent.xSearchAndGenerate')}
                    </button>
                  </div>
                </div>
                {xResults.filter((item: any) => item.reply && item.reply.trim().length > 0).map((item: any, i: number) => (
                  <div key={i} style={card}>
                    <div style={{marginBottom:10}}>
                      <span style={{fontSize:16,fontWeight:600,color:'var(--tx2)'}}>@{item.tweet?.author}</span>
                      <p style={{fontSize:17,color:'var(--tx)',margin:'6px 0 0',lineHeight:1.6}}>{item.tweet?.text}</p>
                    </div>
                    <div style={cs}>
                      <div style={{fontSize:14,fontWeight:700,color:'#6366F1',marginBottom:4}}>{tc('page_admin_agent.aiReply')}</div>
                      {editId===item.tweet?.id ? <textarea value={editText} onChange={e=>setEditText(e.target.value)} rows={2} style={{width:'100%',padding:8,borderRadius:8,border:'1px solid var(--b)',background:'var(--bg)',fontSize:17,fontFamily:'inherit',outline:'none',boxSizing:'border-box'}}/> : <p style={{fontSize:17,margin:0,lineHeight:1.6,color:'var(--tx)'}}>{item.reply}</p>}
                      <div style={{fontSize:14,color:'var(--tx3)',marginTop:4}}>{tc('page_admin_agent.charLimit', { n: (editId===item.tweet?.id?editText:item.reply)?.length||0 })}</div>
                    </div>
                    <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                      <button onClick={()=>handleXPost(item,true)} disabled={posting===item.tweet?.id} style={{padding:'6px 14px',borderRadius:9999,border:'none',background:'#1d9bf0',color:'#fff',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{posting===item.tweet?.id?tc('page_admin_agent.posting'):tc('page_admin_agent.postReply')}</button>
                      <button onClick={()=>{setEditId(item.tweet?.id);setEditText(item.reply)}} style={{padding:'6px 12px',borderRadius:9999,border:'1px solid var(--b)',background:'transparent',color:'var(--tx2)',fontSize:16,cursor:'pointer',fontFamily:'inherit'}}>{tc('page_admin_agent.edit')}</button>
                      <button onClick={()=>handleXRegen(item,true)} style={{padding:'6px 12px',borderRadius:9999,border:'1px solid var(--b)',background:'transparent',color:'var(--tx2)',fontSize:16,cursor:'pointer',fontFamily:'inherit'}}>{tc('page_admin_agent.regenerate')}</button>
                      {item.tweet?.id && item.tweet.id !== 'null' && <a href={'https://x.com/i/web/status/'+item.tweet.id} target="_blank" rel="noopener noreferrer" style={{padding:'6px 12px',borderRadius:9999,border:'1px solid var(--b)',background:'transparent',color:'var(--tx3)',fontSize:16,textDecoration:'none'}}>{tc('page_admin_agent.view')}</a>}
                    </div>
                  </div>
                ))}
              </>
            )}

            {xTab === 'results' && (
              xResults.length === 0
                ? <div style={{textAlign:'center',padding:'40px 0',color:'var(--tx3)'}}>{tc('page_admin_agent.xNoResults')}</div>
                : xResults.map((item, i) => (
                  <div key={i} style={{padding:16,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)',marginBottom:12}}>
                    <div style={{marginBottom:8}}>
                      <span style={{fontSize:15,fontWeight:600,color:'#6366F1',background:'rgba(99,102,241,.08)',padding:'2px 8px',borderRadius:9999}}>{tc('page_admin_agent.originalPost')}</span>
                      <p style={{fontSize:17,color:'var(--tx)',margin:'8px 0 0',lineHeight:1.6}}>{item.reply}</p>
                    </div>
                    <div style={{fontSize:14,color:'var(--tx3)',marginBottom:10}}>{tc('page_admin_agent.charCount', { n: item.reply?.length||0 })}</div>
                    <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                      <button onClick={()=>handleXPost(item,true)} disabled={posting===item.tweet?.id} style={{padding:'6px 14px',borderRadius:9999,border:'none',background:'#1d9bf0',color:'#fff',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>
                        {posting===item.tweet?.id?tc('page_admin_agent.posting'):tc('page_admin_agent.postToX')}
                      </button>
                      <button onClick={()=>{setEditId(item.tweet?.id);setEditText(item.reply)}} style={{padding:'6px 12px',borderRadius:9999,border:'1px solid var(--b)',background:'transparent',color:'var(--tx2)',fontSize:16,cursor:'pointer',fontFamily:'inherit'}}>{tc('page_admin_agent.edit')}</button>
                      <button onClick={()=>handleXRegen(item,true)} style={{padding:'6px 12px',borderRadius:9999,border:'1px solid var(--b)',background:'transparent',color:'var(--tx2)',fontSize:16,cursor:'pointer',fontFamily:'inherit'}}>{tc('page_admin_agent.regenerate')}</button>
                      {item.postedId && <a href={'https://x.com/i/web/status/'+item.postedId} target="_blank" rel="noopener noreferrer" style={{padding:'6px 12px',borderRadius:9999,border:'1px solid var(--b)',background:'transparent',color:'#1d9bf0',fontSize:16,fontWeight:600,textDecoration:'none'}}>{tc('page_admin_agent.viewOnX')}</a>}
                    </div>
                  </div>
                ))
            )}

            {xTab === 'queue' && (
              xQueue.length===0 ? <div style={{textAlign:'center',padding:'40px 0',color:'var(--tx3)'}}>{tc('page_admin_agent.xNoPending')}</div> :
              <>
              <div style={{display:'flex',justifyContent:'flex-end',marginBottom:10}}>
                <button onClick={async()=>{
                  if(!confirm(tc('page_admin_agent.xClearQueueConfirm'))) return
                  await fetch('/api/xagent',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'clear_queue'})})
                  setXQueue([])
                  showToast(tc('page_admin_agent.xQueueCleared'))
                }} style={{padding:'6px 14px',borderRadius:9999,border:'1px solid rgba(239,68,68,.3)',background:'transparent',color:'#dc2626',fontSize:16,cursor:'pointer',fontFamily:'inherit'}}>
                  {tc('page_admin_agent.xClearQueue')}
                </button>
              </div>
              {xQueue.map(item => (
                <div key={item.id} style={card}>
                  <div style={{marginBottom:10}}>
                    <span style={{fontSize:16,fontWeight:600,color:'var(--tx2)'}}>@{item.tweet_author}</span>
                    <p style={{fontSize:17,color:'var(--tx)',margin:'6px 0 0',lineHeight:1.6}}>{item.tweet_text}</p>
                  </div>
                  <div style={cs}>
                    <div style={{fontSize:14,fontWeight:700,color:'#6366F1',marginBottom:4}}>{tc('page_admin_agent.aiReply')}</div>
                    {editId===item.id ? <textarea value={editText} onChange={e=>setEditText(e.target.value)} rows={2} style={{width:'100%',padding:8,borderRadius:8,border:'1px solid var(--b)',background:'var(--bg)',fontSize:17,fontFamily:'inherit',outline:'none',boxSizing:'border-box'}}/> : <p style={{fontSize:17,margin:0,lineHeight:1.6,color:'var(--tx)'}}>{item.generated_reply}</p>}
                    <div style={{fontSize:14,color:'var(--tx3)',marginTop:4}}>{tc('page_admin_agent.charLimit', { n: (editId===item.id?editText:item.generated_reply)?.length||0 })}</div>
                  </div>
                  <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                    <button onClick={()=>handleXPost(item)} disabled={posting===item.id} style={{padding:'6px 14px',borderRadius:9999,border:'none',background:'#1d9bf0',color:'#fff',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{posting===item.id?tc('page_admin_agent.posting'):tc('page_admin_agent.postReply')}</button>
                    <button onClick={()=>{setEditId(item.id);setEditText(item.generated_reply)}} style={{padding:'6px 12px',borderRadius:9999,border:'1px solid var(--b)',background:'transparent',color:'var(--tx2)',fontSize:16,cursor:'pointer',fontFamily:'inherit'}}>{tc('page_admin_agent.edit')}</button>
                    <button onClick={()=>handleXRegen(item)} style={{padding:'6px 12px',borderRadius:9999,border:'1px solid var(--b)',background:'transparent',color:'var(--tx2)',fontSize:16,cursor:'pointer',fontFamily:'inherit'}}>{tc('page_admin_agent.regenerate')}</button>
                    <button onClick={()=>handleXReject(item.id)} style={{padding:'6px 12px',borderRadius:9999,border:'1px solid rgba(239,68,68,.3)',background:'transparent',color:'#dc2626',fontSize:16,cursor:'pointer',fontFamily:'inherit'}}>{tc('page_admin_agent.reject')}</button>
                    {item.tweet_id && item.tweet_id !== 'null' && <a href={'https://x.com/i/web/status/'+item.tweet_id} target="_blank" rel="noopener noreferrer" style={{padding:'6px 12px',borderRadius:9999,border:'1px solid var(--b)',background:'transparent',color:'var(--tx3)',fontSize:16,textDecoration:'none'}}>{tc('page_admin_agent.viewOnXPlain')}</a>}
                  </div>
                </div>
              ))}
              </>
            )}

            {xTab === 'history' && (
              xHistory.length===0 ? <div style={{textAlign:'center',padding:'40px 0',color:'var(--tx3)'}}>{tc('page_admin_agent.xNoHistory')}</div> :
              xHistory.map(item => (
                <div key={item.id} style={{...card,opacity:0.8}}>
                  <div style={{display:'flex',gap:8,marginBottom:8}}>
                    <span style={{fontSize:15,fontWeight:600,padding:'2px 8px',borderRadius:9999,background:item.status==='posted'?'rgba(34,197,94,.1)':'rgba(239,68,68,.1)',color:item.status==='posted'?'#16a34a':'#dc2626'}}>{item.status==='posted'?tc('page_admin_agent.historyStatusPosted'):tc('page_admin_agent.historyStatusRejected')}</span>
                    <span style={{fontSize:15,color:'var(--tx3)'}}>@{item.tweet_author} · {new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                  <p style={{fontSize:16,color:'var(--tx2)',margin:'0 0 6px',lineHeight:1.5}}>{item.tweet_text}</p>
                  <p style={{fontSize:16,color:'#6366F1',margin:0,lineHeight:1.5,borderLeft:'2px solid #6366F1',paddingLeft:8}}>{item.generated_reply}</p>
                </div>
              ))
            )}
          </>
        )}

        {/* ── AUTOMATION TAB ── */}
        {mainTab === 'automation' && (
          <>
            <div style={{marginBottom:20}}>
              <div style={{fontSize:18,fontWeight:600,color:'var(--tx)'}}>{tc('page_admin_agent.automationHeading')}</div>
              <div style={{fontSize:16,color:'var(--tx3)',marginTop:2}}>{tc('page_admin_agent.automationDesc')}</div>
            </div>

            {([
              {id:'source-sync',        icon:'🔄', name:tc('page_admin_agent.jobSourceSyncName'),        desc:tc('page_admin_agent.jobSourceSyncDesc'),        schedule:tc('page_admin_agent.jobSourceSyncSchedule')},
              {id:'daily-brief',        icon:'📋', name:tc('page_admin_agent.jobDailyBriefName'),        desc:tc('page_admin_agent.jobDailyBriefDesc'),        schedule:tc('page_admin_agent.jobDailyBriefSchedule')},
              {id:'token-refresh',      icon:'🔑', name:tc('page_admin_agent.jobTokenRefreshName'),      desc:tc('page_admin_agent.jobTokenRefreshDesc'),      schedule:tc('page_admin_agent.jobTokenRefreshSchedule')},
              {id:'stale-content',      icon:'🧹', name:tc('page_admin_agent.jobStaleContentName'),      desc:tc('page_admin_agent.jobStaleContentDesc'),      schedule:tc('page_admin_agent.jobStaleContentSchedule')},
              {id:'seo-monitor',        icon:'📊', name:tc('page_admin_agent.jobSeoMonitorName'),        desc:tc('page_admin_agent.jobSeoMonitorDesc'),        schedule:tc('page_admin_agent.jobSeoMonitorSchedule')},
              {id:'stock-replenishment',icon:'📦', name:tc('page_admin_agent.jobStockReplenishmentName'),desc:tc('page_admin_agent.jobStockReplenishmentDesc'),schedule:tc('page_admin_agent.jobStockReplenishmentSchedule')},
            ] as {id:string;icon:string;name:string;desc:string;schedule:string}[]).map(job => {
              const state = autoJobs[job.id]
              return (
                <div key={job.id} style={{padding:20,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)',marginBottom:12}}>
                  <div style={{display:'flex',alignItems:'center',gap:14}}>
                    <div style={{width:44,height:44,borderRadius:12,background:'rgba(99,102,241,.08)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,flexShrink:0}}>{job.icon}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:2}}>
                        <span style={{fontSize:18,fontWeight:600,color:'var(--tx)'}}>{job.name}</span>
                        <span style={{fontSize:14,padding:'2px 8px',borderRadius:9999,background:'rgba(99,102,241,.08)',color:'#6366F1',fontWeight:600}}>{job.schedule}</span>
                      </div>
                      <div style={{fontSize:16,color:'var(--tx3)',lineHeight:1.5}}>{job.desc}</div>
                    </div>
                    <button onClick={() => runAutoJob(job.id)} disabled={state?.running} style={{padding:'10px 20px',borderRadius:9999,border:'none',background:state?.running?'var(--b)':'#6366F1',color:state?.running?'var(--tx3)':'#fff',fontSize:17,fontWeight:600,cursor:state?.running?'wait':'pointer',fontFamily:'inherit',flexShrink:0}}>
                      {state?.running ? tc('page_admin_agent.running') : tc('page_admin_agent.runNow')}
                    </button>
                  </div>

                  {state?.lastRun && (
                    <div style={{marginTop:12,fontSize:15,color:'var(--tx3)'}}>
                      {tc('page_admin_agent.lastRun')} {new Date(state.lastRun).toLocaleString('en-GB')}
                    </div>
                  )}

                  {state?.result && (
                    <div style={{marginTop:12,padding:'12px 14px',borderRadius:10,background:'var(--ev)',border:'1px solid var(--b)',fontSize:16,fontFamily:'monospace',color:'var(--tx2)',maxHeight:180,overflowY:'auto',whiteSpace:'pre-wrap',wordBreak:'break-word'}}>
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
                <div style={{width:44,height:44,borderRadius:12,background:'rgba(16,185,129,.08)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,flexShrink:0}}>✨</div>
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:2}}>
                    <span style={{fontSize:18,fontWeight:600,color:'var(--tx)'}}>{tc('page_admin_agent.blogAutoPublishName')}</span>
                    <span style={{fontSize:14,padding:'2px 8px',borderRadius:9999,background:'rgba(16,185,129,.1)',color:'#10b981',fontWeight:600}}>{tc('page_admin_agent.active')}</span>
                  </div>
                  <div style={{fontSize:16,color:'var(--tx3)',lineHeight:1.5}}>{tc('page_admin_agent.blogAutoPublishDesc')}</div>
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
                <div style={{fontSize:18,fontWeight:600,color:'var(--tx)'}}>{tc('page_admin_agent.securityHeading')}</div>
                <div style={{fontSize:16,color:'var(--tx3)',marginTop:2}}>{tc('page_admin_agent.securityDesc')}</div>
              </div>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                <button onClick={()=>exportSecurityCsv()} disabled={secExporting || secHistory.length===0} style={{padding:'8px 14px',borderRadius:9999,border:'1px solid var(--b)',background:'transparent',color:'var(--tx2)',fontSize:16,fontWeight:500,cursor:secHistory.length===0?'not-allowed':'pointer',fontFamily:'inherit',opacity:secHistory.length===0?0.5:1}}>
                  {secExporting?tc('page_admin_agent.exporting'):tc('page_admin_agent.exportAllCsv')}
                </button>
                <button onClick={runSecurityAudit} disabled={secRunning} style={{padding:'8px 16px',borderRadius:9999,border:'none',background:secRunning?'var(--b)':'#6366F1',color:secRunning?'var(--tx3)':'#fff',fontSize:16,fontWeight:600,cursor:secRunning?'wait':'pointer',fontFamily:'inherit'}}>
                  {secRunning?tc('page_admin_agent.runningAudit'):tc('page_admin_agent.runAuditNow')}
                </button>
              </div>
            </div>

            {/* Current report */}
            {secReport && (
              <>
                {/* Summary cards */}
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:10,marginBottom:20}}>
                  {[
                    {label:tc('page_admin_agent.secStatOverall'),value:SEC_STATUS[secReport.overall_status as keyof typeof SEC_STATUS]?.label||'—',color:SEC_STATUS[secReport.overall_status as keyof typeof SEC_STATUS]?.color||'var(--tx)'},
                    {label:tc('page_admin_agent.secStatTotalChecks'),value:secReport.total_checks,color:'var(--tx)'},
                    {label:tc('page_admin_agent.secStatPassed'),value:secReport.passed,color:'#16a34a'},
                    {label:tc('page_admin_agent.secStatWarnings'),value:secReport.warnings,color:'#d97706'},
                    {label:tc('page_admin_agent.secStatFailures'),value:secReport.failures,color:'#dc2626'},
                    {label:tc('page_admin_agent.secStatDuration'),value:tc('page_admin_agent.durationMs', { n: secReport.duration_ms }),color:'var(--tx3)'},
                  ].map(({label,value,color})=>(
                    <div key={label} style={{padding:14,borderRadius:12,border:'1px solid var(--b)',background:'var(--sf)'}}>
                      <div style={{fontSize:14,fontWeight:600,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:6}}>{label}</div>
                      <div style={{fontSize:24,fontWeight:700,fontFamily:'var(--font-sora)',color}}>{value}</div>
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
                          <span style={{fontSize:18,fontWeight:700,color:st?.color}}>{st?.icon}</span>
                          <span style={{fontSize:17,fontWeight:600,color:'var(--tx)'}}>{cat.category}</span>
                          <span style={{fontSize:15,color:'var(--tx3)'}}>{tc('page_admin_agent.checks', { n: cat.checks.length })}</span>
                        </div>
                        <div style={{display:'flex',alignItems:'center',gap:8}}>
                          <span style={{fontSize:15,fontWeight:600,color:st?.color,background:st?.bg,border:`1px solid ${st?.border}`,padding:'2px 10px',borderRadius:9999}}>{st?.label}</span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2" strokeLinecap="round" style={{transform:isExpanded?'rotate(180deg)':'none',transition:'transform 150ms'}}><path d="M6 9l6 6 6-6"/></svg>
                        </div>
                      </div>
                      {isExpanded && (
                        <div style={{borderTop:`1px solid ${st?.border||'var(--b)'}`}}>
                          {cat.checks.map((check: any, i: number) => {
                            const cst = SEC_STATUS[check.status as keyof typeof SEC_STATUS]
                            return (
                              <div key={i} style={{padding:'10px 16px',borderBottom:i<cat.checks.length-1?'1px solid var(--b)':'none',display:'flex',alignItems:'flex-start',gap:10}}>
                                <span style={{fontSize:16,fontWeight:700,color:cst?.color,flexShrink:0,marginTop:1}}>{cst?.icon}</span>
                                <div style={{flex:1,minWidth:0}}>
                                  <div style={{fontSize:16,fontWeight:500,color:'var(--tx)',marginBottom:2}}>{check.name}</div>
                                  <div style={{fontSize:15,color:'var(--tx3)',lineHeight:1.5}}>{check.detail}</div>
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
                    <div style={{fontSize:16,fontWeight:700,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:10}}>{tc('page_admin_agent.gdprSubProcessors')}</div>
                    <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                      {secReport.sub_processors.map((sp: string) => (
                        <span key={sp} style={{padding:'4px 10px',borderRadius:9999,background:'rgba(99,102,241,.06)',border:'1px solid rgba(99,102,241,.15)',fontSize:15,color:'#6366F1',fontWeight:500}}>{sp}</span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {!secReport && !secRunning && (
              <div style={{textAlign:'center',padding:'60px 0',color:'var(--tx3)'}}>
                <div style={{fontSize:36,marginBottom:12}}>🛡</div>
                <div style={{fontSize:18,fontWeight:500,marginBottom:4}}>{tc('page_admin_agent.secNoReports')}</div>
                <div style={{fontSize:16}}>{tc('page_admin_agent.secNoReportsDesc')}</div>
              </div>
            )}

            {/* Audit history */}
            {secHistory.length > 0 && (
              <div style={{marginTop:24}}>
                <div style={{fontSize:17,fontWeight:600,color:'var(--tx)',marginBottom:12}}>{tc('page_admin_agent.auditHistory')}</div>
                <div style={{borderRadius:12,border:'1px solid var(--b)',overflow:'hidden',background:'var(--sf)'}}>
                  {secHistory.map((audit: any) => {
                    const st = SEC_STATUS[audit.overall_status as keyof typeof SEC_STATUS]
                    return (
                      <div key={audit.run_id} style={{padding:'12px 16px',borderBottom:'1px solid var(--b)',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
                        <div style={{display:'flex',alignItems:'center',gap:10}}>
                          <span style={{fontSize:15,fontWeight:600,color:st?.color,background:st?.bg,border:`1px solid ${st?.border}`,padding:'2px 10px',borderRadius:9999}}>{st?.icon} {st?.label}</span>
                          <span style={{fontSize:16,color:'var(--tx2)'}}>{tc('page_admin_agent.auditPassed', { passed: audit.passed, total: audit.total_checks })}</span>
                          {audit.failures > 0 && <span style={{fontSize:15,color:'#dc2626',fontWeight:500}}>{tc('page_admin_agent.auditFailures', { n: audit.failures })}</span>}
                          {audit.warnings > 0 && <span style={{fontSize:15,color:'#d97706',fontWeight:500}}>{tc('page_admin_agent.auditWarnings', { n: audit.warnings })}</span>}
                        </div>
                        <div style={{display:'flex',alignItems:'center',gap:8}}>
                          <span style={{fontSize:15,color:'var(--tx3)'}}>{new Date(audit.created_at).toLocaleString('en-GB')}</span>
                          <button onClick={()=>{setSecReport(audit.report);window.scrollTo({top:0,behavior:'smooth'})}} style={{padding:'4px 10px',borderRadius:9999,border:'1px solid var(--b)',background:'transparent',color:'var(--tx2)',fontSize:15,cursor:'pointer',fontFamily:'inherit'}}>{tc('page_admin_agent.view')}</button>
                          <button onClick={()=>exportSecurityCsv(audit.run_id)} style={{padding:'4px 10px',borderRadius:9999,border:'1px solid var(--b)',background:'transparent',color:'var(--tx2)',fontSize:15,cursor:'pointer',fontFamily:'inherit'}}>{tc('page_admin_agent.csv')}</button>
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
