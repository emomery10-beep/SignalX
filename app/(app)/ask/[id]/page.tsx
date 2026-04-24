'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
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

export default function ChatConversationPage() {
  const params = useParams()
  const conversationId = params.id as string
  const router = useRouter()
  const supabase = createClient()
  const { user, geo, settings, session, setActiveFile, setLastResult } = useStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [uploadedFile, setUploadedFile] = useState<{ name: string; summary: string; sample: unknown[] } | null>(null)
  const [uploading, setUploading] = useState(false)
  const [isLoading, setIsLoadingLocal] = useState(false)
  const [convTitle, setConvTitle] = useState('Conversation')
  const chatRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => { chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' }) }
  useEffect(() => { scrollToBottom() }, [messages])

  // Load existing messages when conversation opens
  useEffect(() => {
    const loadConversation = async () => {
      const { data: conv } = await supabase
        .from('conversations')
        .select('title')
        .eq('id', conversationId)
        .single()
      if (conv) setConvTitle(conv.title)

      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (msgs?.length) {
        setMessages(msgs.map(m => ({
          id: m.id,
          role: m.role as 'user' | 'assistant',
          content: m.content,
          result: m.result_json as AIResult | undefined,
          timestamp: new Date(m.created_at),
        })))
      }
    }
    if (conversationId) loadConversation()
  }, [conversationId, supabase])

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    try {
      const parsed = await parseFile(file)
      setUploadedFile({ name: file.name, summary: parsed.summary, sample: parsed.sample })
      setActiveFile(file.name, parsed.summary)
      setMessages(m => [...m, {
        id: Date.now().toString(), role: 'assistant',
        content: `I've loaded **${file.name}** — ${parsed.rowCount.toLocaleString()} rows, ${parsed.headers.length} columns. What would you like to know?`,
        timestamp: new Date()
      }])
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

    const history = [...messages, userMsg].slice(-14).map(m => ({
      role: m.role, content: m.result ? JSON.stringify(m.result) : m.content
    }))

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          conversationId,
          streaming: false,
          currency: geo?.currency || 'USD',
          symbol: geo?.currencySymbol || '$',
          bizType: settings.bizType,
          region: geo?.country || '',
          sectorHints: geo?.sectorHints || '',
          trendTopics: geo?.trendTopics || [],
          activeFile: uploadedFile?.name || session.activeFile || null,
          datasetSummary: uploadedFile?.summary || session.activeDatasetSummary || null,
          userName: user.name,
        }),
      })

      if (!res.ok) throw new Error(`API error ${res.status}`)
      const result: AIResult = await res.json()
      setLastResult(result as unknown as Record<string, unknown>)

      setMessages(m => [...m, {
        id: (Date.now() + 1).toString(), role: 'assistant',
        content: result.answer_text, result,
        timestamp: new Date()
      }])

      // Update conversation title on first message
      if (messages.length === 0) {
        const title = q.slice(0, 60)
        await supabase.from('conversations').update({ title }).eq('id', conversationId)
        setConvTitle(title)
        router.refresh()
      }
    } catch {
      setMessages(m => [...m, {
        id: (Date.now() + 1).toString(), role: 'assistant',
        content: 'Could not reach the AI. Check your connection and try again.',
        timestamp: new Date()
      }])
    } finally { setIsLoadingLocal(false) }
  }, [input, messages, isLoading, conversationId, geo, settings, uploadedFile, session, user.name, router, supabase, setLastResult])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    const ta = e.target; ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px'
  }

  const suggestions = BIZ_QUESTIONS[settings.bizType] || BIZ_QUESTIONS.retail
  const isEmpty = messages.length === 0
  const [winW, setWinW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  useEffect(() => {
    const h = () => setWinW(window.innerWidth)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  const isMobile = winW < 600

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden' }}>
      <div style={{ height:topbarH, padding:'0 18px', borderBottom:'1px solid var(--b)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0, background:'var(--sf)', gap:10 }}>
        <div style={{ fontSize:13, fontWeight:500, flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {isEmpty ? 'New conversation' : convTitle}
        </div>
        {uploadedFile && (
          <div style={{ display:'flex', alignItems:'center', gap:5, padding:'3px 9px', borderRadius:9999, background:'rgba(30,212,202,.08)', border:'1px solid rgba(30,212,202,.18)', fontSize:11, color:'#47e2da', flexShrink:0, maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            {uploadedFile.name}
          </div>
        )}
        <div style={{ display:'flex', gap:7, flexShrink:0 }}>
          <label style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 13px', borderRadius:9999, border:'1px solid var(--b2)', background:'transparent', color:'var(--tx)', fontSize:12, cursor:'pointer', whiteSpace:'nowrap' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            {uploading ? 'Uploading…' : 'Upload'}
            <input type="file" accept=".csv,.xlsx,.xls" style={{ display:'none' }} onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])}/>
          </label>
        </div>
      </div>

      <div ref={chatRef} style={{ flex:1, overflowY:'auto', padding:'16px 0' }}>
        <div style={{ maxWidth: 'min(680px, 100%)', margin:'0 auto', padding:'0 18px', display:'flex', flexDirection:'column', gap:2 }}>
          {isEmpty && (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:400, textAlign:'center', padding:28 }}>
              <div style={{ width:50, height:50, borderRadius:14, background:'#6366F1', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#04080f" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </div>
              <div style={{ fontFamily:'var(--font-sora)', fontSize:19, fontWeight:600, marginBottom:7 }}>Ask anything about your data</div>
              <div style={{ fontSize:13, color:'var(--tx2)', lineHeight:1.65, maxWidth:360, marginBottom:26 }}>
                {geo ? `Showing prices in ${geo.currencySymbol} · ${geo.country}` : 'Upload a file then ask a business question in plain English.'}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:7, maxWidth:460, width:'100%' }}>
                {suggestions.map((q, i) => (
                  <div key={i} onClick={() => sendMessage(q)} style={{ padding:12, borderRadius:10, border:'1px solid var(--b)', background:'var(--ev)', cursor:'pointer', textAlign:'left', transition:'all 160ms' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor='var(--b2)'; (e.currentTarget as HTMLDivElement).style.background='var(--ov)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor='var(--b)'; (e.currentTarget as HTMLDivElement).style.background='var(--ev)' }}>
                    <div style={{ fontSize:12, fontWeight:500, marginBottom:3 }}>{q}</div>
                    <div style={{ fontSize:11, color:'var(--tx3)' }}>Tap to ask</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {messages.map(msg => (
            <div key={msg.id} style={{ display:'flex', gap:9, padding:'2px 0', flexDirection:msg.role==='user'?'row-reverse':'row', animation:'msgIn .26s cubic-bezier(.16,1,.3,1) both' }}>
              <div style={{ width:26, height:26, borderRadius:'50%', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:600, marginTop:3, background:msg.role==='assistant'?'linear-gradient(135deg,#d08a59,#8c6fe0)':'var(--ov)', color:msg.role==='assistant'?'#04080f':'var(--tx2)' }}>
                {msg.role==='assistant' ? <svg width="12" height="12" viewBox="0 0 32 32" fill="none"><rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.45"/><rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.7"/><rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/><path d="M21 7 L24 3 L27 7" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> : (user.initials||'U')}
              </div>
              <div style={{ flex:1, maxWidth:'88%', display:'flex', flexDirection:'column', alignItems:msg.role==='user'?'flex-end':'flex-start' }}>
                {msg.role==='user' ? (
                  <div style={{ padding:'10px 14px', borderRadius:13, borderBottomRightRadius:3, background:'var(--ov)', border:'1px solid var(--b)', fontSize:13, lineHeight:1.6, maxWidth:440 }}>{msg.content}</div>
                ) : (
                  msg.result ? <ResultBlock result={msg.result} onFollowUp={sendMessage} geo={geo}/> : (
                    <div style={{ padding:'10px 14px', borderRadius:13, borderBottomLeftRadius:3, background:'var(--ev)', border:'1px solid var(--b)', fontSize:13, lineHeight:1.6 }} dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g,'<strong style="color:#47e2da;font-weight:500">$1</strong>').replace(/\n/g,'<br/>') }}/>
                  )
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div style={{ display:'flex', gap:9, padding:'2px 0' }}>
              <div style={{ width:26, height:26, borderRadius:'50%', background:'#6366F1', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><svg width="12" height="12" viewBox="0 0 32 32" fill="none"><rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.45"/><rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.7"/><rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/><path d="M21 7 L24 3 L27 7" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div style={{ padding:'10px 14px', borderRadius:13, borderBottomLeftRadius:3, background:'var(--ev)', border:'1px solid var(--b)', display:'flex', gap:4, alignItems:'center' }}>
                <span className="tdot"></span><span className="tdot"></span><span className="tdot"></span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ flexShrink:0, padding: isMobile ? '10px 12px 14px' : '10px 18px 14px', borderTop:'1px solid var(--b)', background:'var(--sf)' }}>
        <div style={{ maxWidth: 'min(680px, 100%)', margin:'0 auto' }}>
          <div style={{ display:'flex', gap:7, alignItems:'flex-end', background:'var(--ev)', border:'1px solid var(--b2)', borderRadius:16, padding:'8px 8px 8px 13px', transition:'border-color 180ms' }}>
            <textarea ref={inputRef} value={input} onChange={autoResize} onKeyDown={handleKeyDown}
              placeholder="Ask a BI question about your data… (Enter to send)" rows={1}
              style={{ flex:1, background:'transparent', border:'none', outline:'none', color:'var(--tx)', fontFamily:'var(--font-dm,DM Sans,sans-serif)', fontSize:13, lineHeight:1.5, resize:'none', minHeight:20, maxHeight:120, overflowY:'auto' }}/>
            <div style={{ display:'flex', alignItems:'center', gap:5, flexShrink:0 }}>
              <label style={{ width:28, height:28, borderRadius:6, border:'1px solid var(--b)', background:'transparent', color:'var(--tx3)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <input type="file" accept=".csv,.xlsx,.xls" style={{ display:'none' }} onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])}/>
              </label>
              <button onClick={() => sendMessage()} disabled={!input.trim()||isLoading}
                style={{ width:30, height:30, borderRadius:8, border:'none', background:input.trim()&&!isLoading?'var(--acc)':'var(--b2)', color:'#04080f', cursor:input.trim()&&!isLoading?'pointer':'not-allowed', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 130ms' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
