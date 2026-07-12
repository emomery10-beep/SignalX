'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import VoiceVisualizer from '@/components/chat/VoiceVisualizer'
// BusinessPulse merged into NotificationBell
import HumanFirstSearch from '@/components/chat/HumanFirstSearch'
import PulseBar from '@/components/chat/PulseBar'
import { useVoice } from '@/hooks/useVoice'
import { speakResponse, buildVoiceResponse } from '@/lib/tts'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useStore } from '@/store'
import { useLang } from '@/components/LanguageProvider'
import type { AIResult } from '@/lib/ai'
import { parseFile } from '@/lib/file/parser'
import ResultBlock from '@/components/chat/ResultBlock'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  result?: AIResult
  timestamp: Date
}

type CardTC = (key: string) => string
type Card = { icon: string; title: string; desc: string; query: string }

// Default cards when no sources are connected
const buildDefaultCards = (tc: CardTC): Card[] =>
  ['💱', '🏭', '🧮', '🌍'].map((icon, i) => ({
    icon,
    title: tc('ask.default_card_' + i + '_title'),
    desc: tc('ask.default_card_' + i + '_desc'),
    query: tc('ask.default_card_' + i + '_query'),
  }))

// Source-specific prompt cards — shown when we know what's connected
const SOURCE_CARD_ICONS: Record<string, string[]> = {
  pos: ['📊', '⭐', '👥', '📦'],
  stripe: ['💳', '📈', '🔄', '💰'],
  shopify: ['🛒', '📦', '🔁', '🏆'],
  xero: ['📋', '💵', '📑', '📊'],
  quickbooks: ['📋', '💵', '📑', '📊'],
  amazon_fba: ['📦', '🏷️', '⭐', '📉'],
}

const buildSourceCards = (tc: CardTC): Record<string, Card[]> => {
  const out: Record<string, Card[]> = {}
  for (const src of Object.keys(SOURCE_CARD_ICONS)) {
    out[src] = SOURCE_CARD_ICONS[src].map((icon, i) => ({
      icon,
      title: tc('ask.' + src + '_card_' + i + '_title'),
      desc: tc('ask.' + src + '_card_' + i + '_desc'),
      query: tc('ask.' + src + '_card_' + i + '_query'),
    }))
  }
  return out
}

const buildCfoCards = (tc: CardTC): Card[] =>
  ['📋', '💰', '💵', '📈'].map((icon, i) => ({
    icon,
    title: tc('ask.cfo_card_' + i + '_title'),
    desc: tc('ask.cfo_card_' + i + '_desc'),
    query: tc('ask.cfo_card_' + i + '_query'),
  }))

// Pick the best 4 cards based on what sources are connected
function getSmartCards(tc: CardTC, types: string[], cfo?: boolean): Card[] {
  const defaults = buildDefaultCards(tc)
  if (cfo) return buildCfoCards(tc)
  if (types.length === 0) return defaults

  const sourceCards = buildSourceCards(tc)

  // If only one source, show all 4 cards for that source
  if (types.length === 1 && sourceCards[types[0]]) return sourceCards[types[0]]

  // Multiple sources: pick 2 from the primary (first connected), 1 each from next two
  const cards: Card[] = []
  for (const t of types) {
    const pool = sourceCards[t]
    if (!pool) continue
    const take = cards.length === 0 ? 2 : 1
    cards.push(...pool.slice(0, take))
    if (cards.length >= 4) break
  }

  // Pad with defaults if we don't have 4
  while (cards.length < 4) {
    cards.push(defaults[cards.length % defaults.length])
  }
  return cards.slice(0, 4)
}

export default function AskPage() {
  const router = useRouter()
  const supabase = createClient()
  const { user, geo, settings, session, setActiveFile, setLoading, setLastResult, setSimulateMode, toggleCfoMode } = useStore()
  const { lang, tc } = useLang()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<{ name: string; summary: string; sample: unknown[] } | null>(null)
  const [connectedSources, setConnectedSources] = useState<{ source_type: string; status: string; last_synced_at?: string }[]>([])
  const [uploading, setUploading] = useState(false)
  const [isLoading, setIsLoadingLocal] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [winW, setWinW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  const [savedPrompts, setSavedPrompts] = useState<{ label: string; query: string }[]>([])
  const [showSavePrompt, setShowSavePrompt] = useState(false)
  const [promptLabel, setPromptLabel] = useState('')
  const chatRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => { chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' }) }
  useEffect(() => { scrollToBottom() }, [messages])

  useEffect(() => {
    const h = () => setWinW(window.innerWidth)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  const isMobile = winW < 600

  // Fetch connected data sources on mount so the status bar is accurate
  useEffect(() => {
    fetch('/api/sources', { credentials: 'include' })
      .then(r => r.ok ? r.json() : [])
      .then(sources => { if (Array.isArray(sources) && sources.length > 0) setConnectedSources(sources) })
      .catch(() => {})
  }, [])

  // Load saved prompts from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('askbiz_saved_prompts')
      if (stored) setSavedPrompts(JSON.parse(stored))
    } catch {}
  }, [])

  const savePrompt = (label: string, query: string) => {
    const next = [...savedPrompts, { label, query }]
    setSavedPrompts(next)
    try { localStorage.setItem('askbiz_saved_prompts', JSON.stringify(next)) } catch {}
  }

  const deletePrompt = (idx: number) => {
    const next = savedPrompts.filter((_, i) => i !== idx)
    setSavedPrompts(next)
    try { localStorage.setItem('askbiz_saved_prompts', JSON.stringify(next)) } catch {}
  }

  const hasConnectedData = connectedSources.length > 0 || !!uploadedFile
  const sourceTypes = [...new Set(connectedSources.map(s => s.source_type))]
  const SOURCE_LABELS: Record<string, string> = { stripe: 'Stripe', shopify: 'Shopify', amazon_fba: 'Amazon', xero: 'Xero', quickbooks: 'QuickBooks', pos: 'POS', csv: 'CSV' }
  const sourceLabel = sourceTypes.map(t => SOURCE_LABELS[t] || t).join(' · ')
  const oldestSync = connectedSources.reduce((oldest, s) => {
    if (!s.last_synced_at) return oldest
    const d = new Date(s.last_synced_at).getTime()
    return d < oldest ? d : oldest
  }, Date.now())
  const syncStale = connectedSources.length > 0 && (Date.now() - oldestSync) > 24 * 60 * 60 * 1000
  const syncAgo = connectedSources.length > 0 && oldestSync < Date.now()
    ? (() => { const h = Math.floor((Date.now() - oldestSync) / 3600000); return h < 1 ? tc('ask.sync_just_now') : h < 24 ? tc('ask.sync_hours_ago', { hours: h }) : tc('ask.sync_days_ago', { days: Math.floor(h / 24) }) })()
    : null

  const getOrCreateConversation = async (firstMessage: string) => {
    if (conversationId) return conversationId
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) return null
    const title = firstMessage.length > 50 ? firstMessage.slice(0, 50) + '…' : firstMessage
    const { data } = await supabase.from('conversations').insert({ user_id: authUser.id, title }).select().single()
    setConversationId(data?.id || null)
    return data?.id || null
  }

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    try {
      const parsed = await parseFile(file)
      setUploadedFile({ name: file.name, summary: parsed.summary, sample: parsed.sample })
      setActiveFile(file.name, parsed.summary)
      const sysMsg: Message = {
        id: Date.now().toString(), role: 'assistant',
        content: tc('ask.file_loaded', { name: file.name, rows: parsed.rowCount.toLocaleString(), cols: parsed.headers.length, headers: parsed.headers.join(', ') }),
        timestamp: new Date()
      }
      setMessages(m => [...m, sysMsg])

      fetch('/api/health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: parsed.rows, headers: parsed.headers }),
      }).then(r => r.json()).then(data => {
        if (data.health) {
          window.dispatchEvent(new CustomEvent('askbiz:health_updated', { detail: data.health }))
        }
      }).catch(() => {})

    } catch (e) {
      alert(e instanceof Error ? e.message : tc('ask.file_upload_failed'))
    } finally { setUploading(false) }
  }

  const isTrackingNumber = (q: string) => {
    const clean = q.trim().toUpperCase()
    return /^[A-Z]{2}\d{9}[A-Z]{2}$/.test(clean) ||
      /^\d{12,22}$/.test(clean) ||
      /^1Z[A-Z0-9]{16}$/.test(clean) ||
      /^[A-Z]{3}\d{10}$/.test(clean) ||
      /^JD\d{18}$/.test(clean) ||
      /^[A-Z]{2}\d{8,9}[A-Z]{2}$/.test(clean)
  }

  const handleTrackingLookup = async (trackingNumber: string): Promise<string> => {
    try {
      const res = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'lookup', tracking_number: trackingNumber.trim().toUpperCase() }),
      })
      const d = await res.json()

      if (d.shipment) {
        const s = d.shipment
        const lines = [
          `📦 **${s.tracking_number}**`,
          `${tc('ask.track_status_label')}: **${s.track_status}**${s.customs_hold ? ' 🛃 ' + tc('ask.track_customs_hold') : ''}`,
          s.last_event ? `${tc('ask.track_last_event')}: ${s.last_event}` : '',
          s.last_location ? `${tc('ask.track_location')}: ${s.last_location}` : '',
          s.supplier_name ? `${tc('ask.track_supplier')}: ${s.supplier_name}` : '',
          s.sku ? `${tc('ask.track_product')}: ${s.sku}${s.quantity ? ' ×' + s.quantity : ''}` : '',
          s.expected_arrival ? `${tc('ask.track_expected_arrival')}: ${new Date(s.expected_arrival).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}` : '',
          s.delay_days > 0 ? `⚠️ ${tc('ask.track_delayed', { days: s.delay_days })}` : '',
          s.total_value ? `${tc('ask.track_shipment_value')}: £${s.total_value.toLocaleString()}` : '',
          s.financial_impact > 0 ? `💰 ${tc('ask.track_financial_impact')}: £${s.financial_impact.toFixed(0)}` : '',
          '',
          `[${tc('ask.track_view_on_17track')}](https://www.17track.net/en/track?nums=${s.tracking_number})`,
        ].filter(Boolean).join('\n')
        return lines
      }

      if (d.tracking) {
        const t = d.tracking
        const status = t.latest_status?.status || tc('ask.track_status_pending')
        const lastEvent = t.latest_event?.description || ''
        const location = t.latest_event?.location || ''
        return [
          `📦 **${trackingNumber.toUpperCase()}**`,
          `${tc('ask.track_status_label')}: **${status}**`,
          lastEvent ? `${tc('ask.track_last_event')}: ${lastEvent}` : '',
          location ? `${tc('ask.track_location')}: ${location}` : '',
          '',
          `${tc('ask.track_not_saved')} [${tc('ask.track_view_on_17track')}](https://www.17track.net/en/track?nums=${trackingNumber})`,
          '',
          tc('ask.track_add_prompt'),
        ].filter(Boolean).join('\n')
      }

      return tc('ask.track_no_data', { number: trackingNumber.toUpperCase(), link: tc('ask.track_check_on_17track') })
    } catch {
      return tc('ask.track_error', { number: trackingNumber, link: tc('ask.track_check_directly') })
    }
  }

  const sendMessage = useCallback(async (text?: string) => {
    const q = (text || input).trim()
    if (!q || isLoading) return
    setInput('')
    setIsLoadingLocal(true)

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: q, timestamp: new Date() }
    setMessages(m => [...m, userMsg])

    if (isTrackingNumber(q)) {
      try {
        const trackingResult = await handleTrackingLookup(q)
        const trackMsg: Message = {
          id: (Date.now() + 1).toString(), role: 'assistant',
          content: trackingResult,
          timestamp: new Date(),
        }
        setMessages(m => [...m, trackMsg])
      } finally { setIsLoadingLocal(false) }
      return
    }

    const convId = await getOrCreateConversation(q)
    const history = [...messages, userMsg].slice(-14).map(m => ({
      role: m.role, content: m.result ? JSON.stringify(m.result) : m.content
    }))

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          conversationId: convId,
          streaming: false,
          currency: geo?.currency || 'USD',
          symbol: geo?.currencySymbol || '$',
          locale: lang,
          bizType: settings.bizType,
          region: geo?.country || '',
          sectorHints: geo?.sectorHints || '',
          trendTopics: geo?.trendTopics || [],
          activeFile: uploadedFile?.name || null,
          datasetSummary: uploadedFile?.summary || null,
          userName: user.name,
          simulateMode: session.simulateMode,
          cfoMode: settings.cfoMode,
        }),
      })

      if (res.status === 402) {
        const limitData = await res.json()
        const limitMsg: Message = {
          id: (Date.now() + 1).toString(), role: 'assistant',
          content: `__LIMIT_REACHED__:${limitData.plan || 'free'}`,
          timestamp: new Date()
        }
        setMessages(m => [...m, limitMsg])
        setLoading(false)
        return
      }
      if (!res.ok) throw new Error(`API error ${res.status}`)
      const result: AIResult = await res.json()
      setLastResult(result as unknown as Record<string, unknown>)

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(), role: 'assistant',
        content: result.answer_text, result,
        timestamp: new Date()
      }
      setMessages(m => [...m, aiMsg])

      if (voice.isRecording && result.answer_text) {
        setIsSpeaking(true)
        const voiced = buildVoiceResponse(result.insight_header || result.answer_text)
        speakResponse(voiced).then(() => setIsSpeaking(false))
      }

      if (messages.length === 0 && convId) {
        await supabase.from('conversations').update({ title: q.slice(0, 60) }).eq('id', convId)
        router.refresh()
      }
    } catch {
      const errMsg: Message = {
        id: (Date.now() + 1).toString(), role: 'assistant',
        content: '__CONNECTION_ERROR__',
        timestamp: new Date()
      }
      setMessages(m => [...m, errMsg])
    } finally { setIsLoadingLocal(false) }
  }, [input, messages, isLoading, conversationId, geo, settings, uploadedFile, user.name, router, supabase, setLastResult])

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  useEffect(() => {
    const handler = (e: any) => {
      const q = (e as CustomEvent).detail as string
      if (q) sendMessage(q)
    }
    window.addEventListener('askbiz:send', handler)
    return () => window.removeEventListener('askbiz:send', handler)
  }, [sendMessage])

  const voice = useVoice({
    onTranscript: (text) => { setInput(text) },
    onFinalTranscript: (text) => {
      setInput(text)
      setTimeout(() => {
        if (text.trim()) sendMessage(text)
        voice.stopRecording()
      }, 200)
    },
    silenceTimeoutMs: 2000,
  })

  const saveToDashboard = async () => {
    const result = session.lastResult as AIResult | null
    if (!result) return
    setSaveStatus('saving')
    try {
      const listRes = await fetch('/api/dashboards')
      const dashboards = await listRes.json()
      let dashboardId: string
      if (Array.isArray(dashboards) && dashboards.length > 0) {
        dashboardId = dashboards[0].id
      } else {
        const createRes = await fetch('/api/dashboards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: tc('ask.my_dashboard') }),
        })
        const created = await createRes.json()
        dashboardId = created.id
      }
      await fetch('/api/dashboards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dashboard_id: dashboardId,
          tile_type: 'insight',
          title: result.insight_header || result.answer_text?.slice(0, 60) || tc('ask.saved_insight'),
          config: { result },
        }),
      })
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2500)
    } catch {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 2500)
    }
  }

  const isEmpty = messages.length === 0
  const tavilyActive = /news|latest|recent|trend|competitor|market|regulation|eu ai act|gdpr|vat|tariff|customs|inflation|hot product|what.s selling/i.test(input)
  const userState: 'noData' | 'dataConnected' | 'marketActive' =
    tavilyActive ? 'marketActive' : hasConnectedData ? 'dataConnected' : 'noData'
  const lastResultForPulse = session.lastResult as AIResult | null

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: isMobile ? 'calc(100vh - 72px)' : '100vh', overflow: 'hidden' }}>

      {/* ── MAIN CHAT COLUMN ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Topbar */}
        <div style={{ height: 50, padding: isMobile ? '0 12px' : '0 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: 'var(--sf)', gap: 10, overflow: 'hidden' }}>
          <div style={{ fontSize: 15, fontWeight: 500, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {isEmpty ? tc('ask.new_conversation') : messages[0]?.content.slice(0, 48) + (messages[0]?.content.length > 48 ? '…' : '')}
          </div>
          {voice.isRecording && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 9999, background: 'linear-gradient(135deg,rgba(99,102,241,.15),rgba(139,92,246,.15))', border: '1px solid rgba(99,102,241,.3)', fontSize: 13, fontWeight: 600, color: '#818cf8', flexShrink: 0 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#818cf8', animation: 'pulse 1s infinite' }}/>
              {tc('ask.badge_live')}
            </div>
          )}
          {isSpeaking && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 9999, background: 'rgba(208,138,89,.1)', border: '1px solid rgba(208,138,89,.25)', fontSize: 13, fontWeight: 600, color: 'var(--acc)', flexShrink: 0 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
              {tc('ask.badge_speaking')}
            </div>
          )}
          {uploadedFile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 9999, background: 'rgba(30,212,202,.08)', border: '1px solid rgba(30,212,202,.18)', fontSize: 13, color: '#47e2da', flexShrink: 0, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              {uploadedFile.name}
            </div>
          )}
          <div style={{ display: 'flex', gap: 7, flexShrink: 0 }}>
            <button onClick={() => setSimulateMode(!session.simulateMode)}
              title={tc('ask.scenario_tooltip')}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 9999, border: `1px solid ${session.simulateMode ? '#6366F1' : 'var(--b2)'}`, background: session.simulateMode ? 'rgba(99,102,241,.1)' : 'transparent', color: session.simulateMode ? '#6366F1' : 'var(--tx3)', fontSize: 14, fontWeight: session.simulateMode ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 150ms', whiteSpace: 'nowrap' }}>
              ⚡ {session.simulateMode ? tc('ask.scenario_on') : tc('ask.scenario_run')}
            </button>
            <button onClick={toggleCfoMode}
              title={tc('ask.cfo_tooltip')}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 9999, border: `1px solid ${settings.cfoMode ? '#6366F1' : 'var(--b2)'}`, background: settings.cfoMode ? 'rgba(99,102,241,.1)' : 'transparent', color: settings.cfoMode ? '#6366F1' : 'var(--tx3)', fontSize: 14, fontWeight: settings.cfoMode ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 150ms', whiteSpace: 'nowrap' }}>
              📊 {settings.cfoMode ? tc('ask.cfo_view_on') : tc('ask.cfo_view')}
            </button>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 13px', borderRadius: 9999, border: '1px solid var(--b2)', background: 'transparent', color: 'var(--tx)', fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              {uploading ? tc('ask.uploading') : tc('ask.upload')}
              <input type="file" accept=".csv,.xlsx,.xls" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])}/>
            </label>
            {!!session.lastResult && (
              <button
                onClick={saveToDashboard}
                disabled={saveStatus === 'saving'}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 13px', borderRadius: 9999, border: '1px solid var(--b2)', background: saveStatus === 'saved' ? 'rgba(34,197,94,.08)' : 'transparent', color: saveStatus === 'saved' ? '#16a34a' : saveStatus === 'error' ? '#ef4444' : 'var(--tx)', fontFamily: 'inherit', fontSize: 14, cursor: saveStatus === 'saving' ? 'default' : 'pointer', transition: 'all 150ms' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                {saveStatus === 'saving' ? tc('ask.saving') : saveStatus === 'saved' ? tc('ask.saved') : saveStatus === 'error' ? tc('ask.save_error') : tc('ask.save')}
              </button>
            )}
          </div>
        </div>

        {/* Chat area */}
        <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)' }}>
          <div style={{ maxWidth: 680, margin: '0 auto', padding: `16px ${isMobile ? '12px' : '18px'} 8px`, display: 'flex', flexDirection: 'column', gap: 2 }}>

            {isEmpty && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 0 16px', textAlign: 'center' }} className="animate-scale-up">
                <div style={{ width: 50, height: 50, borderRadius: 14, background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }} className="animate-float">
                  <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                    <rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.45"/>
                    <rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.7"/>
                    <rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/>
                    <path d="M21 7 L24 3 L27 7" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div style={{ fontFamily: 'var(--font-sora)', fontSize: 21, fontWeight: 600, marginBottom: 7, letterSpacing: '-.02em' }} className="animate-fade-up stagger-1">
                  {uploadedFile ? tc('ask.empty_greeting_named', { name: user.initials || tc('ask.empty_default_name') }) : tc('ask.empty_greeting')}
                </div>
                <div style={{ fontSize: 15, color: 'var(--tx2)', lineHeight: 1.65, maxWidth: 360, marginBottom: 20 }} className="animate-fade-up stagger-2">
                  {geo ? tc('ask.empty_geo_subtitle', { symbol: geo.currencySymbol, country: geo.country }) : tc('ask.empty_subtitle')}
                </div>

                {!uploadedFile && (
                  <>
                    {/* Specialist tool cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, width: '100%', maxWidth: 460, marginBottom: 14 }} className="animate-fade-up stagger-3">
                      {getSmartCards(tc, sourceTypes, settings.cfoMode).map(card => (
                        <button
                          key={card.title}
                          onClick={() => sendMessage(card.query)}
                          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 5, padding: '12px 14px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', transition: 'all 140ms' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.background = 'rgba(99,102,241,.04)' }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--b)'; e.currentTarget.style.background = 'var(--sf)' }}
                        >
                          <span style={{ fontSize: 20 }}>{card.icon}</span>
                          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx)' }}>{card.title}</div>
                          <div style={{ fontSize: 13, color: 'var(--tx3)', lineHeight: 1.4 }}>{card.desc}</div>
                        </button>
                      ))}
                    </div>

                    {/* Saved prompts */}
                    {savedPrompts.length > 0 && (
                      <div style={{ width: '100%', maxWidth: 460, marginBottom: 14 }} className="animate-fade-up stagger-4">
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>{tc('ask.saved_prompts_heading')}</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {savedPrompts.map((sp, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <button onClick={() => sendMessage(sp.query)}
                                style={{ padding: '5px 12px', borderRadius: 9999, border: '1px solid var(--b)', background: 'var(--sf)', color: 'var(--tx2)', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 140ms' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#d08a59'; e.currentTarget.style.color = '#d08a59' }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--b)'; e.currentTarget.style.color = 'var(--tx2)' }}
                              >
                                🔖 {sp.label}
                              </button>
                              <button onClick={() => deletePrompt(i)}
                                style={{ width: 18, height: 18, borderRadius: '50%', border: 'none', background: 'transparent', color: 'var(--tx3)', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}
                                title={tc('ask.remove_saved_prompt')}
                              >×</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Connect data CTA — only when no sources connected */}
                    {!hasConnectedData && <div style={{ width: '100%', maxWidth: 460, padding: '12px 16px', borderRadius: 12, border: '1px dashed var(--b2)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }} className="animate-fade-up stagger-4">
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx)', marginBottom: 2 }}>{tc('ask.connect_cta_title')}</div>
                        <div style={{ fontSize: 13, color: 'var(--tx3)' }}>{tc('ask.connect_cta_desc')}</div>
                      </div>
                      <Link
                        href="/sources"
                        style={{ flexShrink: 0, padding: '7px 14px', borderRadius: 9999, background: '#6366F1', color: '#fff', fontSize: 14, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}
                      >
                        {tc('ask.connect_cta_button')}
                      </Link>
                    </div>}
                  </>
                )}
              </div>
            )}

            {messages.map(msg => (
              <div key={msg.id} className="msg-in" style={{ display: 'flex', gap: 9, padding: '2px 0' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, background: msg.role === 'assistant' ? '#6366F1' : 'var(--ev)', color: msg.role === 'assistant' ? '#fff' : 'var(--tx3)', marginTop: 2 }}>
                  {msg.role === 'assistant'
                    ? <svg width="12" height="12" viewBox="0 0 32 32" fill="none"><rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.45"/><rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.7"/><rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/><path d="M21 7 L24 3 L27 7" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    : (user.initials || 'U')}
                </div>
                <div style={{ flex: 1, maxWidth: '88%', display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  {msg.role === 'user' ? (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4, justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => {
                          if (savedPrompts.some(sp => sp.query === msg.content)) return
                          setShowSavePrompt(true)
                          setPromptLabel('')
                          ;(window as any).__askbiz_save_query = msg.content
                        }}
                        title={savedPrompts.some(sp => sp.query === msg.content) ? tc('ask.already_saved') : tc('ask.save_this_prompt')}
                        style={{ marginTop: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: savedPrompts.some(sp => sp.query === msg.content) ? 'var(--acc)' : 'var(--tx3)', fontSize: 15, opacity: savedPrompts.some(sp => sp.query === msg.content) ? 1 : 0.5, transition: 'opacity 150ms' }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={e => e.currentTarget.style.opacity = savedPrompts.some(sp => sp.query === msg.content) ? '1' : '0.5'}
                      >🔖</button>
                      <div style={{ padding: '10px 14px', borderRadius: 13, borderBottomRightRadius: 3, background: 'var(--acc)', color: '#fff', fontSize: 15, lineHeight: 1.5 }}>
                        {msg.content}
                      </div>
                    </div>
                  ) : (
                    msg.content.startsWith('__LIMIT_REACHED__') ? (
                      <div style={{ padding: '18px 20px', borderRadius: 16, background: 'var(--sf)', border: '1px solid var(--b)' }}>
                        <div style={{ fontSize: 22, marginBottom: 8 }}>🚀</div>
                        <div style={{ fontFamily: 'var(--font-sora)', fontSize: 17, fontWeight: 600, marginBottom: 6 }}>{tc('ask.limit_emoji_heading')}</div>
                        <p style={{ fontSize: 15, color: 'var(--tx2)', lineHeight: 1.6, marginBottom: 14 }}>
                          {tc('ask.limit_body')}
                        </p>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          <button onClick={() => router.push('/billing')} style={{ padding: '10px 18px', borderRadius: 9999, border: 'none', background: 'var(--acc)', color: '#fff', fontFamily: 'inherit', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>{tc('ask.limit_upgrade')}</button>
                          <button onClick={() => router.push('/billing')} style={{ padding: '10px 14px', borderRadius: 9999, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx2)', fontFamily: 'inherit', fontSize: 15, cursor: 'pointer' }}>{tc('ask.limit_see_plans')}</button>
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--tx3)', marginTop: 10 }}>{tc('ask.limit_reset_note')}</p>
                      </div>
                    ) : msg.content === '__CONNECTION_ERROR__' ? (
                      <div style={{ padding: '10px 14px', borderRadius: 13, borderBottomLeftRadius: 3, background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', fontSize: 15, color: '#ef4444' }}>
                        {tc('ask.connection_error')}
                      </div>
                    ) : msg.result ? (
                      <ResultBlock
                        result={msg.result}
                        question={msg.content}
                        onFollowUp={q => sendMessage(q)}
                        cfoMode={settings.cfoMode}
                      />
                    ) : (
                      <div style={{ padding: '10px 14px', borderRadius: 13, borderBottomLeftRadius: 3, background: 'var(--ev)', border: '1px solid var(--b)', fontSize: 15, lineHeight: 1.6, color: 'var(--tx)' }}>
                        {msg.content}
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div style={{ display: 'flex', gap: 9, padding: '2px 0' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="12" height="12" viewBox="0 0 32 32" fill="none"><rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.45"/><rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.7"/><rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/><path d="M21 7 L24 3 L27 7" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{ padding: '10px 14px', borderRadius: 13, borderBottomLeftRadius: 3, background: 'var(--ev)', border: '1px solid var(--b)', display: 'flex', gap: 4, alignItems: 'center' }}>
                  <span className="tdot"/><span className="tdot"/><span className="tdot"/>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Input zone */}
        <div style={{ flexShrink: 0, padding: `6px ${isMobile ? '12px' : '18px'} 0`, background: 'var(--bg)' }}>
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <div style={{ position: 'relative' }}>
              {voice.isRecording && (
                <VoiceVisualizer
                  isActive={voice.isRecording}
                  transcript={voice.transcript}
                  analyserNode={voice.analyserNode}
                  onStop={() => { voice.stopRecording() }}
                />
              )}
              <HumanFirstSearch
                userState={userState}
                onSend={sendMessage}
                inputValue={input}
                onInputChange={setInput}
                onKeyDown={handleKeyDown}
                inputRef={inputRef}
                isLoading={isLoading}
                simulateMode={session.simulateMode}
                cfoMode={settings.cfoMode}
                onVoiceToggle={() => voice.isRecording ? voice.stopRecording() : voice.startRecording()}
                isRecording={voice.isRecording}
                bizType={settings.bizType}
              />
            </div>
            {voice.error && (
              <div style={{ marginTop: 6, fontSize: 14, color: '#f48080', textAlign: 'center' }}>
                {voice.error}
              </div>
            )}
          </div>
          <div style={{ textAlign: 'center', padding: '8px 0 12px', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            {uploadedFile ? (
              <span style={{ color: '#22C55E', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', display: 'inline-block', boxShadow: '0 0 6px #22C55E' }}/>
                {tc('ask.status_connected_file', { name: uploadedFile.name })}
              </span>
            ) : connectedSources.length > 0 ? (
              <span style={{ color: syncStale ? '#F59E0B' : '#22C55E', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: syncStale ? '#F59E0B' : '#22C55E', display: 'inline-block', boxShadow: syncStale ? '0 0 6px #F59E0B' : '0 0 6px #22C55E' }}/>
                {tc('ask.status_sources_connected', { sources: sourceLabel })}{syncAgo ? tc('ask.status_synced_ago', { ago: syncAgo }) : ''}{syncStale ? ' ⚠️' : ''} ·{' '}
                <Link href="/sources" style={{ color: '#6366F1', textDecoration: 'none', fontWeight: 500 }}>
                  {syncStale ? tc('ask.status_resync') : tc('ask.status_manage')}
                </Link>
              </span>
            ) : (
              <span style={{ color: 'var(--tx3)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--b2)', display: 'inline-block' }}/>
                {tc('ask.status_no_data')}
                <Link href="/sources" style={{ color: '#6366F1', textDecoration: 'none', fontWeight: 500 }}>
                  {tc('ask.status_connect_link')}
                </Link>
                {tc('ask.status_personalised_suffix')}
              </span>
            )}
          </div>
        </div>

      </div>

      {/* Business Pulse moved to NotificationBell dropdown */}

      {/* Save prompt dialog */}
      {showSavePrompt && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.35)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setShowSavePrompt(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--sf)', borderRadius: 16, padding: '24px 28px', width: 340, boxShadow: '0 12px 40px rgba(0,0,0,.18)', border: '1px solid var(--b)' }}>
            <div style={{ fontSize: 17, fontWeight: 700, fontFamily: 'var(--font-sora)', marginBottom: 4 }}>{tc('ask.save_prompt_title')}</div>
            <p style={{ fontSize: 14, color: 'var(--tx3)', margin: '0 0 14px' }}>{tc('ask.save_prompt_subtitle')}</p>
            <input
              autoFocus
              value={promptLabel}
              onChange={e => setPromptLabel(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && promptLabel.trim()) { savePrompt(promptLabel.trim(), (window as any).__askbiz_save_query || ''); setShowSavePrompt(false) } }}
              placeholder={tc('ask.save_prompt_placeholder')}
              style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--b)', fontSize: 15, fontFamily: 'inherit', outline: 'none', background: 'var(--bg)' }}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 14, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowSavePrompt(false)}
                style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx2)', fontSize: 14, fontFamily: 'inherit', cursor: 'pointer' }}>
                {tc('ask.cancel')}
              </button>
              <button
                disabled={!promptLabel.trim()}
                onClick={() => { savePrompt(promptLabel.trim(), (window as any).__askbiz_save_query || ''); setShowSavePrompt(false) }}
                style={{ padding: '7px 14px', borderRadius: 8, border: 'none', background: promptLabel.trim() ? 'var(--acc)' : 'var(--b)', color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', cursor: promptLabel.trim() ? 'pointer' : 'default' }}>
                {tc('ask.save')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
