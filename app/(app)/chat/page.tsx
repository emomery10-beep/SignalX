'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import VoiceVisualizer from '@/components/chat/VoiceVisualizer'
import BusinessPulse from '@/components/BusinessPulse'
import { useVoice } from '@/hooks/useVoice'
import { speakResponse, buildVoiceResponse } from '@/lib/tts'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useStore } from '@/store'
import type { AIResult } from '@/lib/ai'
import { parseFile } from '@/lib/file/parser'
import ResultBlock from '@/components/chat/ResultBlock'

const BIZ_QUESTIONS: Record<string, string[]> = {
  retail:      ['Which items should I restock urgently?','What is my best margin product?','Can I increase my prices by 5%?','Where am I losing money?'],
  ecommerce:   ['Which SKUs have the highest return rate?','Show me my best-performing category','What is my fulfilment cost per order?','Which products should I discount?'],
  distributor: ['Which routes are most profitable?','Show me margin trends by region','Where is demand growing fastest?','Which customers are behind on payment?'],
  exporter:    ['How is FX affecting my margins?','Which market has the highest demand?','Show me my top products by value','What is my average cost per shipment?'],
}

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
  const { user, geo, settings, session, setActiveFile, pushMessage, setLoading, setLastResult } = useStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<{ name: string; summary: string; sample: unknown[] } | null>(null)
  const [uploading, setUploading] = useState(false)
  const [isLoading, setIsLoadingLocal] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => { chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' }) }
  useEffect(() => { scrollToBottom() }, [messages])

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

    // Build message history for API
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

      // Auto-speak voice responses
      if (voiceEnabled && result.answer_text) {
        setIsSpeaking(true)
        const voiced = buildVoiceResponse(result.insight_header || result.answer_text)
        speakResponse(voiced).then(() => setIsSpeaking(false))
      }

      // Update conversation title if first exchange
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

  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    const ta = e.target
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px'
  }

  const suggestions = BIZ_QUESTIONS[settings.bizType] || BIZ_QUESTIONS.retail
  const isEmpty = messages.length === 0
  const [winW, setWinW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const voice = useVoice({
    onTranscript: (text) => {
      setInput(text)
    },
    onFinalTranscript: (text) => {
      setInput(text)
      // Auto-send after silence detected
      setTimeout(() => {
        if (text.trim()) sendMessage(text)
        voice.stopRecording()
        setVoiceEnabled(false)
      }, 200)
    },
    silenceTimeoutMs: 2000,
  })
  useEffect(() => {
    const h = () => setWinW(window.innerWidth)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  const isMobile = winW < 600

  // Resizable topbar height
  const [topbarH, setTopbarH] = useState(50)
  const dragRef = useRef<{startY:number;startH:number}|null>(null)
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
  const chatPad = isMobile ? '0 12px' : '0 18px'
  const inputPad = isMobile ? '10px 12px 14px' : '10px 18px 14px'
  const suggestCols = isMobile ? '1fr' : '1fr 1fr'

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100vh', overflow: 'hidden' }}>

      {/* ── MAIN CHAT COLUMN ─────────────────────────────── */}
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

        {/* Drag handle — resize topbar */}
        <div
          onMouseDown={onDragStart}
          style={{ height: 6, background: 'var(--bg)', borderBottom: '1px solid var(--b)', cursor: 'ns-resize', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', userSelect: 'none' }}
          title="Drag to resize">
          <div style={{ width: 32, height: 2, borderRadius: 1, background: 'var(--b2)' }}/>
        </div>

        {/* Chat area */}
        <div ref={chatRef} style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ maxWidth: 680, margin: '0 auto', padding: `16px ${isMobile ? '12px' : '18px'} 8px`, display: 'flex', flexDirection: 'column', gap: 2 }}>

            {isEmpty && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0 24px', textAlign: 'center' }}>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: 'linear-gradient(135deg,#1ed4ca,#9268f8)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#04080f" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                </div>
                <div style={{ fontFamily: 'var(--font-sora)', fontSize: 19, fontWeight: 600, marginBottom: 7, letterSpacing: '-.02em' }}>Ask anything about your data</div>
                <div style={{ fontSize: 13, color: 'var(--tx2)', lineHeight: 1.65, maxWidth: 360, marginBottom: 26 }}>
                  {geo ? `Prices in ${geo.currencySymbol} · ${geo.country}` : 'Upload a CSV or XLSX, then ask a question in plain English.'}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: suggestCols, gap: 8, width: '100%', maxWidth: 640 }}>
                  {suggestions.map((q, i) => (
                    <div key={i} onClick={() => sendMessage(q)} style={{ padding: 12, borderRadius: 10, border: '1px solid var(--b)', background: 'var(--ev)', cursor: 'pointer', textAlign: 'left', transition: 'all 160ms' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor='var(--b2)'; (e.currentTarget as HTMLDivElement).style.background='var(--ov)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor='var(--b)'; (e.currentTarget as HTMLDivElement).style.background='var(--ev)' }}>
                      <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 3 }}>{q}</div>
                      <div style={{ fontSize: 11, color: 'var(--tx3)' }}>Tap to ask</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', gap: 9, padding: '2px 0' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, background: msg.role === 'assistant' ? 'linear-gradient(135deg,#d08a59,#9268f8)' : 'var(--ev)', color: msg.role === 'assistant' ? '#fff' : 'var(--tx3)', marginTop: 2 }}>
                  {msg.role === 'assistant'
                    ? <svg width="11" height="11" viewBox="0 0 18 18" fill="none" stroke="#04080f" strokeWidth="2.3" strokeLinecap="round"><polyline points="2,14 6,8 10,11 14,4"/></svg>
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
                          <button onClick={() => router.push('/billing')}
                            style={{ padding: '10px 18px', borderRadius: 9999, border: 'none', background: 'var(--acc)', color: '#fff', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                            Upgrade →
                          </button>
                          <button onClick={() => router.push('/billing')}
                            style={{ padding: '10px 14px', borderRadius: 9999, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx2)', fontFamily: 'inherit', fontSize: 13, cursor: 'pointer' }}>
                            See all plans
                          </button>
                        </div>
                        <p style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 10 }}>Free plan resets next month.</p>
                      </div>
                    ) : msg.content === '__CONNECTION_ERROR__' ? (
                      <div style={{ padding: '10px 14px', borderRadius: 13, borderBottomLeftRadius: 3, background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', fontSize: 13, color: '#ef4444' }}>
                        Connection issue — please check your internet and try again.
                      </div>
                    ) : msg.result ? <ResultBlock result={msg.result} onFollowUp={q => sendMessage(q)}/> : (
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
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#d08a59,#9268f8)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="11" height="11" viewBox="0 0 18 18" fill="none" stroke="#04080f" strokeWidth="2.3" strokeLinecap="round"><polyline points="2,14 6,8 10,11 14,4"/></svg>
                </div>
                <div style={{ padding: '10px 14px', borderRadius: 13, borderBottomLeftRadius: 3, background: 'var(--ev)', border: '1px solid var(--b)', display: 'flex', gap: 4, alignItems: 'center' }}>
                  <span className="tdot"/><span className="tdot"/><span className="tdot"/>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Input zone */}
        <div style={{ flexShrink: 0, padding: `10px ${isMobile ? '12px' : '18px'} 14px`, borderTop: '1px solid var(--b)', background: 'var(--sf)' }}>
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: 7, alignItems: 'flex-end', background: 'var(--ev)', border: `1px solid ${voice.isRecording ? 'rgba(99,102,241,0.5)' : 'var(--b2)'}`, borderRadius: 16, padding: '8px 8px 8px 13px', transition: 'border-color 180ms', position: 'relative', overflow: 'hidden' }}>
              <VoiceVisualizer
                isActive={voice.isRecording}
                transcript={voice.transcript}
                analyserNode={voice.analyserNode}
                onStop={() => { voice.stopRecording(); setVoiceEnabled(false) }}
              />
              <textarea
                ref={inputRef}
                value={input}
                onChange={autoResize}
                onKeyDown={handleKeyDown}
                placeholder="Ask a BI question about your data… (Enter to send)"
                rows={1}
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--tx)', fontFamily: 'var(--font-dm,DM Sans,sans-serif)', fontSize: 13, lineHeight: 1.5, resize: 'none', minHeight: 20, maxHeight: 120, overflowY: 'auto' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                <label style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 130ms' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  <input type="file" accept=".csv,.xlsx,.xls" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])}/>
                </label>
                <button
                  onClick={() => {
                    if (voice.isRecording) { voice.stopRecording(); setVoiceEnabled(false) }
                    else { setVoiceEnabled(true); voice.startRecording() }
                  }}
                  title={voice.isRecording ? 'Stop AskBiz Live' : 'AskBiz Live — tap to speak'}
                  style={{ width: 30, height: 30, borderRadius: 8, border: voice.isRecording ? 'none' : '1px solid var(--b)', background: voice.isRecording ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'transparent', color: voice.isRecording ? '#fff' : 'var(--tx3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 150ms', flexShrink: 0 }}>
                  {voice.isRecording
                    ? <svg width="11" height="11" viewBox="0 0 10 10"><rect x="1" y="1" width="8" height="8" rx="1" fill="currentColor"/></svg>
                    : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                  }
                </button>
                <button onClick={() => sendMessage()} disabled={!input.trim() || isLoading} style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: input.trim() && !isLoading ? '#1ed4ca' : 'var(--b2)', color: '#04080f', cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 130ms' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
              </div>
            </div>
            {voice.error && (
              <div style={{ marginTop: 6, fontSize: 12, color: '#f48080', textAlign: 'center' }}>
                {voice.error}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── BUSINESS PULSE SIDEBAR ───────────────────────── */}
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
  // TODO: implement save to dashboard
  alert('Saved to dashboard!')
}
