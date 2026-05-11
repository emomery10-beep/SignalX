'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import VoiceVisualizer from '@/components/chat/VoiceVisualizer'
import BusinessPulse from '@/components/BusinessPulse'
import HumanFirstSearch from '@/components/chat/HumanFirstSearch'
import PulseBar from '@/components/chat/PulseBar'
import { useVoice } from '@/hooks/useVoice'
import { speakResponse, buildVoiceResponse } from '@/lib/tts'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useStore } from '@/store'
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

const TOOL_CARDS = [
  { icon: '💱', title: 'Currency Risk', desc: 'What happens if the pound drops?', query: 'Model what happens to my margin if GBP falls 10% against my import currency' },
  { icon: '🏭', title: 'My Suppliers', desc: 'Who is the most reliable?', query: 'Score my suppliers by on-time delivery rate and financial impact' },
  { icon: '🧮', title: 'True Cost', desc: 'What does shipping actually cost me?', query: 'Calculate my true landed cost including freight, duty, VAT and FX buffer' },
  { icon: '🌍', title: 'New Markets', desc: 'Where should I sell next?', query: 'Which export market should I expand into next based on my product?' },
]

export default function AskPage() {
  const router = useRouter()
  const supabase = createClient()
  const { user, geo, settings, session, setActiveFile, setLoading, setLastResult, setSimulateMode, toggleCfoMode } = useStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<{ name: string; summary: string; sample: unknown[] } | null>(null)
  const [uploading, setUploading] = useState(false)
  const [isLoading, setIsLoadingLocal] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [winW, setWinW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
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
        content: `I've loaded **${file.name}** — ${parsed.rowCount.toLocaleString()} rows, ${parsed.headers.length} columns (${parsed.headers.join(', ')}). What would you like to know?`,
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
      alert(e instanceof Error ? e.message : 'File upload failed')
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
          `Status: **${s.track_status}**${s.customs_hold ? ' 🛃 CUSTOMS HOLD' : ''}`,
          s.last_event ? `Last event: ${s.last_event}` : '',
          s.last_location ? `Location: ${s.last_location}` : '',
          s.supplier_name ? `Supplier: ${s.supplier_name}` : '',
          s.sku ? `Product: ${s.sku}${s.quantity ? ' ×' + s.quantity : ''}` : '',
          s.expected_arrival ? `Expected arrival: ${new Date(s.expected_arrival).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}` : '',
          s.delay_days > 0 ? `⚠️ Delayed by ${s.delay_days} days` : '',
          s.total_value ? `Shipment value: £${s.total_value.toLocaleString()}` : '',
          s.financial_impact > 0 ? `💰 Financial impact: £${s.financial_impact.toFixed(0)}` : '',
          '',
          `[View on 17Track →](https://www.17track.net/en/track?nums=${s.tracking_number})`,
        ].filter(Boolean).join('\n')
        return lines
      }

      if (d.tracking) {
        const t = d.tracking
        const status = t.latest_status?.status || 'Pending'
        const lastEvent = t.latest_event?.description || ''
        const location = t.latest_event?.location || ''
        return [
          `📦 **${trackingNumber.toUpperCase()}**`,
          `Status: **${status}**`,
          lastEvent ? `Last event: ${lastEvent}` : '',
          location ? `Location: ${location}` : '',
          '',
          `This shipment is not yet saved to your account. [View on 17Track →](https://www.17track.net/en/track?nums=${trackingNumber})`,
          '',
          'Want me to add it to your shipment tracker for ongoing monitoring?',
        ].filter(Boolean).join('\n')
      }

      return `📦 Tracking number **${trackingNumber.toUpperCase()}** — no tracking data available yet. The shipment may not have been scanned by the carrier. [Check on 17Track →](https://www.17track.net/en/track?nums=${trackingNumber})`
    } catch {
      return `📦 Could not retrieve tracking data for **${trackingNumber}**. Please try again or [check on 17Track directly →](https://www.17track.net/en/track?nums=${trackingNumber})`
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
      setLastResult(result)

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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  useEffect(() => {
    const handler = (e) => {
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
          body: JSON.stringify({ title: 'My Dashboard' }),
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
          title: result.insight_header || result.answer_text?.slice(0, 60) || 'Saved insight',
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
    tavilyActive ? 'marketActive' : uploadedFile ? 'dataConnected' : 'noData'
  const lastResultForPulse = session.lastResult as AIResult | null

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100vh', overflow: 'hidden' }}>

      {/* ── MAIN CHAT COLUMN ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Topbar */}
        <div style={{ height: 50, padding: isMobile ? '0 12px' : '0 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: 'var(--sf)', gap: 10, overflow: 'hidden' }}>
          <div style={{ fontSize: 13, fontWeight: 500, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {isEmpty ? 'New conversation' : messages[0]?.content.slice(0, 48) + (messages[0]?.content.length > 48 ? '…' : '')}
          </div>
          {voice.isRecording && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 9999, background: 'linear-gradient(135deg,rgba(99,102,241,.15),rgba(139,92,246,.15))', border: '1px solid rgba(99,102,241,.3)', fontSize: 11, fontWeight: 600, color: '#818cf8', flexShrink: 0 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#818cf8', animation: 'pulse 1s infinite' }}/>
              AskBiz Live
            </div>
          )}
          {isSpeaking && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 9999, background: 'rgba(208,138,89,.1)', border: '1px solid rgba(208,138,89,.25)', fontSize: 11, fontWeight: 600, color: 'var(--acc)', flexShrink: 0 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
              Speaking
            </div>
          )}
          {uploadedFile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 9999, background: 'rgba(30,212,202,.08)', border: '1px solid rgba(30,212,202,.18)', fontSize: 11, color: '#47e2da', flexShrink: 0, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              {uploadedFile.name}
            </div>
          )}
          <div style={{ display: 'flex', gap: 7, flexShrink: 0 }}>
            <button onClick={() => setSimulateMode(!session.simulateMode)}
              title="Run a 'what if' scenario on your business"
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 9999, border: `1px solid ${session.simulateMode ? '#6366F1' : 'var(--b2)'}`, background: session.simulateMode ? 'rgba(99,102,241,.1)' : 'transparent', color: session.simulateMode ? '#6366F1' : 'var(--tx3)', fontSize: 12, fontWeight: session.simulateMode ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 150ms', whiteSpace: 'nowrap' }}>
              ⚡ {session.simulateMode ? 'Scenario ON' : 'Run scenario'}
            </button>
            <button onClick={toggleCfoMode}
              title="Switch to accountant-style reports with metrics and tables"
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 9999, border: `1px solid ${settings.cfoMode ? '#6366F1' : 'var(--b2)'}`, background: settings.cfoMode ? 'rgba(99,102,241,.1)' : 'transparent', color: settings.cfoMode ? '#6366F1' : 'var(--tx3)', fontSize: 12, fontWeight: settings.cfoMode ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 150ms', whiteSpace: 'nowrap' }}>
              📊 {settings.cfoMode ? 'CFO view ON' : 'CFO view'}
            </button>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 13px', borderRadius: 9999, border: '1px solid var(--b2)', background: 'transparent', color: 'var(--tx)', fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              {uploading ? 'Uploading…' : 'Upload'}
              <input type="file" accept=".csv,.xlsx,.xls" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])}/>
            </label>
            {!!session.lastResult && (
              <button
                onClick={saveToDashboard}
                disabled={saveStatus === 'saving'}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 13px', borderRadius: 9999, border: '1px solid var(--b2)', background: saveStatus === 'saved' ? 'rgba(34,197,94,.08)' : 'transparent', color: saveStatus === 'saved' ? '#16a34a' : saveStatus === 'error' ? '#ef4444' : 'var(--tx)', fontFamily: 'inherit', fontSize: 12, cursor: saveStatus === 'saving' ? 'default' : 'pointer', transition: 'all 150ms' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? 'Saved ✓' : saveStatus === 'error' ? 'Error' : 'Save'}
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
                <div style={{ fontFamily: 'var(--font-sora)', fontSize: 19, fontWeight: 600, marginBottom: 7, letterSpacing: '-.02em' }} className="animate-fade-up stagger-1">
                  {uploadedFile ? `What do you want to know, ${user.initials || 'there'}?` : 'What do you want to know?'}
                </div>
                <div style={{ fontSize: 13, color: 'var(--tx2)', lineHeight: 1.65, maxWidth: 360, marginBottom: 20 }} className="animate-fade-up stagger-2">
                  {geo ? `Prices in ${geo.currencySymbol} · ${geo.country}` : 'Just ask in plain English — no jargon, no spreadsheets needed.'}
                </div>

                {!uploadedFile && (
                  <>
                    {/* Specialist tool cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, width: '100%', maxWidth: 460, marginBottom: 14 }} className="animate-fade-up stagger-3">
                      {TOOL_CARDS.map(card => (
                        <button
                          key={card.title}
                          onClick={() => sendMessage(card.query)}
                          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 5, padding: '12px 14px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', transition: 'all 140ms' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.background = 'rgba(99,102,241,.04)' }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--b)'; e.currentTarget.style.background = 'var(--sf)' }}
                        >
                          <span style={{ fontSize: 18 }}>{card.icon}</span>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)' }}>{card.title}</div>
                          <div style={{ fontSize: 11, color: 'var(--tx3)', lineHeight: 1.4 }}>{card.desc}</div>
                        </button>
                      ))}
                    </div>

                    {/* Connect data CTA */}
                    <div style={{ width: '100%', maxWidth: 460, padding: '12px 16px', borderRadius: 12, border: '1px dashed var(--b2)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }} className="animate-fade-up stagger-4">
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)', marginBottom: 2 }}>Get answers with your actual numbers</div>
                        <div style={{ fontSize: 11, color: 'var(--tx3)' }}>Connect Shopify, Amazon, QuickBooks or upload a CSV</div>
                      </div>
                      <Link
                        href="/sources"
                        style={{ flexShrink: 0, padding: '7px 14px', borderRadius: 9999, background: '#6366F1', color: '#fff', fontSize: 12, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}
                      >
                        Connect →
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}

            {messages.map(msg => (
              <div key={msg.id} className="msg-in" style={{ display: 'flex', gap: 9, padding: '2px 0' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, background: msg.role === 'assistant' ? '#6366F1' : 'var(--ev)', color: msg.role === 'assistant' ? '#fff' : 'var(--tx3)', marginTop: 2 }}>
                  {msg.role === 'assistant'
                    ? <svg width="12" height="12" viewBox="0 0 32 32" fill="none"><rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.45"/><rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.7"/><rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/><path d="M21 7 L24 3 L27 7" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    : (user.initials || 'U')}
                </div>
                <div style={{ flex: 1, maxWidth: '88%', display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  {msg.role === 'user' ? (
                    <div style={{ padding: '10px 14px', borderRadius: 13, borderBottomRightRadius: 3, background: 'var(--acc)', color: '#fff', fontSize: 13, lineHeight: 1.5 }}>
                      {msg.content}
                    </div>
                  ) : (
                    msg.content.startsWith('__LIMIT_REACHED__') ? (
                      <div style={{ padding: '18px 20px', borderRadius: 16, background: 'var(--sf)', border: '1px solid var(--b)' }}>
                        <div style={{ fontSize: 20, marginBottom: 8 }}>🚀</div>
                        <div style={{ fontFamily: 'var(--font-sora)', fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Free questions used up</div>
                        <p style={{ fontSize: 13, color: 'var(--tx2)', lineHeight: 1.6, marginBottom: 14 }}>
                          You&apos;ve used all your free questions this month. Upgrade to keep going.
                        </p>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          <button onClick={() => router.push('/billing')} style={{ padding: '10px 18px', borderRadius: 9999, border: 'none', background: 'var(--acc)', color: '#fff', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Upgrade →</button>
                          <button onClick={() => router.push('/billing')} style={{ padding: '10px 14px', borderRadius: 9999, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx2)', fontFamily: 'inherit', fontSize: 13, cursor: 'pointer' }}>See all plans</button>
                        </div>
                        <p style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 10 }}>Free plan resets next month.</p>
                      </div>
                    ) : msg.content === '__CONNECTION_ERROR__' ? (
                      <div style={{ padding: '10px 14px', borderRadius: 13, borderBottomLeftRadius: 3, background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', fontSize: 13, color: '#ef4444' }}>
                        Connection issue — please check your internet and try again.
                      </div>
                    ) : msg.result ? (
                      <ResultBlock
                        result={msg.result}
                        question={msg.content}
                        onFollowUp={q => sendMessage(q)}
                        cfoMode={settings.cfoMode}
                      />
                    ) : (
                      <div style={{ padding: '10px 14px', borderRadius: 13, borderBottomLeftRadius: 3, background: 'var(--ev)', border: '1px solid var(--b)', fontSize: 13, lineHeight: 1.6, color: 'var(--tx)' }}>
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
              <div style={{ marginTop: 6, fontSize: 12, color: '#f48080', textAlign: 'center' }}>
                {voice.error}
              </div>
            )}
          </div>
          <div style={{ textAlign: 'center', padding: '8px 0 12px', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            {uploadedFile ? (
              <span style={{ color: '#22C55E', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', display: 'inline-block', boxShadow: '0 0 6px #22C55E' }}/>
                Connected: {uploadedFile.name}
              </span>
            ) : (
              <span style={{ color: 'var(--tx3)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--b2)', display: 'inline-block' }}/>
                No data connected ·{' '}
                <Link href="/sources" style={{ color: '#6366F1', textDecoration: 'none', fontWeight: 500 }}>
                  Connect your shop or upload a file
                </Link>
                {' '}for personalised answers
              </span>
            )}
          </div>
        </div>

      </div>

      {/* ── BUSINESS PULSE SIDEBAR ── */}
      {!isMobile && (
        <BusinessPulse
          onActionClick={(prompt) => {
            setInput(prompt)
            setTimeout(() => sendMessage(prompt), 400)
          }}
        />
      )}

    </div>
  )
}
