'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
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

export default function ChatPage() {
  const router = useRouter()
  const supabase = createClient()
  const { user, geo, settings, session, setActiveFile, setLoading, setLastResult, setSimulateMode, toggleCfoMode } = useStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<{ name: string; summary: string; sample: unknown[] } | null>(null)
  const [uploading, setUploading] = useState(false)
  const [isLoading, setIsLoadingLocal] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [winW, setWinW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  const [topbarH, setTopbarH] = useState(50)
  const chatRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const dragRef = useRef<{startY:number;startH:number}|null>(null)

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
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'File upload failed')
    } finally { setUploading(false) }
  }

  const sendMessage = useCallback(async (text?: string) => {
    const q = (text || input).trim()
    if (!q || isLoading) return
    setInput('')
    setIsLoadingLocal(true)

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: q, timestamp: new Date() }
    setMessages(m => [...m, userMsg])

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

      if (voiceEnabled && result.answer_text) {
        setIsSpeaking(true)
        const voiced = buildVoiceResponse(result.insight_header || result.answer_text)
        speakResponse(voiced).then(() => setIsSpeaking(false))
      }

      if (messages.length === 0 && convId) {
        await supabase.from('conversations').update({ title: q.slice(0, 60) }).eq('id', convId)
        router.refresh()
      }
    } catch (e) {
      const errMsg: Message = {
        id: (Date.now() + 1).toString(), role: 'assistant',
        content: '__CONNECTION_ERROR__',
        timestamp: new Date()
      }
      setMessages(m => [...m, errMsg])
    } finally { setIsLoadingLocal(false) }
  }, [input, messages, isLoading, conversationId, geo, settings, uploadedFile, user.name, router, supabase, setLastResult])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  useEffect(() => {
    const handler = (e: Event) => {
      const q = (e as CustomEvent).detail as string
      if (q) sendMessage(q)
    }
    window.addEventListener('askbiz:send', handler)
    return () => window.removeEventListener('askbiz:send', handler)
  }, [sendMessage])

  const onDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    dragRef.current = { startY: e.clientY, startH: topbarH }
    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return
      const delta = ev.clientY - dragRef.current.startY
      setTopbarH(Math.max(44, Math.min(120, dragRef.current.startH + delta)))
    }
    const onUp = () => {
      dragRef.current = null
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [topbarH])

  const voice = useVoice({
    onTranscript: (text) => { setInput(text) },
    onFinalTranscript: (text) => {
      setInput(text)
      setTimeout(() => {
        if (text.trim()) sendMessage(text)
        voice.stopRecording()
        setVoiceEnabled(false)
      }, 200)
    },
    silenceTimeoutMs: 2000,
  })

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
        <div style={{ height: topbarH, padding: isMobile ? '0 12px' : '0 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: 'var(--sf)', gap: 10, overflow: 'hidden', transition: 'height 0ms' }}>
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
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 9999, border: `1px solid ${session.simulateMode ? '#6366F1' : 'var(--b2)'}`, background: session.simulateMode ? 'rgba(99,102,241,.1)' : 'transparent', color: session.simulateMode ? '#6366F1' : 'var(--tx3)', fontSize: 12, fontWeight: session.simulateMode ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 150ms', whiteSpace: 'nowrap' }}>
              ⚡ {session.simulateMode ? 'What if... ON' : 'What if...?'}
            </button>
            <button onClick={toggleCfoMode}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 9999, border: `1px solid ${settings.cfoMode ? '#6366F1' : 'var(--b2)'}`, background: settings.cfoMode ? 'rgba(99,102,241,.1)' : 'transparent', color: settings.cfoMode ? '#6366F1' : 'var(--tx3)', fontSize: 12, fontWeight: settings.cfoMode ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 150ms', whiteSpace: 'nowrap' }}>
              📊 {settings.cfoMode ? 'Accountant ON' : 'For my accountant'}
            </button>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 13px', borderRadius: 9999, border: '1px solid var(--b2)', background: 'transparent', color: 'var(--tx)', fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              {uploading ? 'Uploading…' : 'Upload'}
              <input type="file" accept=".csv,.xlsx,.xls" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])}/>
            </label>
            {!!session.lastResult && (
              <button onClick={() => saveToDashboard()} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 13px', borderRadius: 9999, border: '1px solid var(--b2)', background: 'transparent', color: 'var(--tx)', fontFamily: 'inherit', fontSize: 12, cursor: 'pointer' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                Save
              </button>
            )}
          </div>
        </div>

        {/* Drag handle */}
        <div onMouseDown={onDragStart} style={{ height: 6, background: 'var(--bg)', borderBottom: '1px solid var(--b)', cursor: 'ns-resize', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', userSelect: 'none' }} title="Drag to resize">
          <div style={{ width: 32, height: 2, borderRadius: 1, background: 'var(--b2)' }}></div>
        </div>

        {/* Chat area */}
        <div ref={chatRef} style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ maxWidth: 680, margin: '0 auto', padding: `16px ${isMobile ? '12px' : '18px'} 8px`, display: 'flex', flexDirection: 'column', gap: 2 }}>

            {isEmpty && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0 24px', textAlign: 'center' }} className="animate-scale-up">
                <div style={{ width: 50, height: 50, borderRadius: 14, background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }} className="animate-float">
                  <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                    <rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.45"/>
                    <rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.7"/>
                    <rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/>
                    <path d="M21 7 L24 3 L27 7" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div style={{ fontFamily: 'var(--font-sora)', fontSize: 19, fontWeight: 600, marginBottom: 7, letterSpacing: '-.02em' }} className="animate-fade-up stagger-1">
                  {uploadedFile ? `What do you want to know, ${user.initials || 'there'}?` : 'Ask anything about your business'}
                </div>
                <div style={{ fontSize: 13, color: 'var(--tx2)', lineHeight: 1.65, maxWidth: 360, marginBottom: 10 }} className="animate-fade-up stagger-2">
                  {geo ? `Prices in ${geo.currencySymbol} · ${geo.country}` : 'Plain English only — no jargon, no spreadsheets needed.'}
                </div>
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
        <div style={{ flexShrink: 0, padding: `6px ${isMobile ? '12px' : '18px'} 0`, borderTop: '1px solid var(--b)', background: 'var(--sf)' }}>
          <PulseBar
            lastResult={lastResultForPulse}
            onAsk={sendMessage}
            hasData={!!uploadedFile}
          />
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <div style={{ position: 'relative' }}>
              {voice.isRecording && (
                <VoiceVisualizer
                  isActive={voice.isRecording}
                  transcript={voice.transcript}
                  analyserNode={voice.analyserNode}
                  onStop={() => { voice.stopRecording(); setVoiceEnabled(false) }}
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
              />
            </div>
            {voice.error && (
              <div style={{ marginTop: 6, fontSize: 12, color: '#f48080', textAlign: 'center' }}>
                {voice.error}
              </div>
            )}
          </div>
          <div style={{ textAlign: 'center', padding: '8px 0 12px', fontSize: 11, color: 'var(--tx3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            {uploadedFile ? (
              <>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }}/>
                Connected: {uploadedFile.name}
              </>
            ) : (
              <>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--b2)', display: 'inline-block' }}/>
                No data connected · Upload a file or connect your shop for personalised answers
              </>
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

async function saveToDashboard(_result?: Record<string, unknown>) {
  alert('Saved to dashboard!')
}
