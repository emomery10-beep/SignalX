'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const ADMIN_EMAILS = ['emomery10@gmail.com', 'emomery10@googlemail.com']

interface AgentItem {
  id: string
  run_id: string
  type: 'blog' | 'thread' | 'smart_reply'
  status: 'pending' | 'published' | 'rejected'
  content: Record<string, unknown>
  source_title: string
  source_url: string
  source_query: string
  verdict: string
  verdict_sentence: string
  scenario: string
  pulse_signal: string
  key_insight: string
  created_at: string
}

const VERDICT_STYLE = {
  act:     { bg: 'rgba(34,197,94,.1)',  border: 'rgba(34,197,94,.3)',  color: '#16a34a', label: '🟢 ACT NOW'       },
  watch:   { bg: 'rgba(245,158,11,.1)', border: 'rgba(245,158,11,.3)', color: '#d97706', label: '🟡 WATCH'          },
  problem: { bg: 'rgba(239,68,68,.1)',  border: 'rgba(239,68,68,.3)',  color: '#dc2626', label: '🔴 ACTION NEEDED'  },
}

export default function AgentAdminPage() {
  const router = useRouter()
  const supabase = createClient()

  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<AgentItem[]>([])
  const [filter, setFilter] = useState<'pending' | 'published' | 'rejected' | 'all'>('pending')
  const [running, setRunning] = useState(false)
  const [runLog, setRunLog] = useState<string[]>([])
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  // ── Auth check ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
        router.push('/')
        return
      }
      setAuthorized(true)
      setLoading(false)
    }
    check()
  }, [])

  // ── Load content ────────────────────────────────────────────────────────────
  const loadItems = useCallback(async () => {
    const q = supabase.from('agent_content').select('*').order('created_at', { ascending: false })
    if (filter !== 'all') q.eq('status', filter)
    const { data } = await q.limit(50)
    setItems((data || []) as AgentItem[])
  }, [filter])

  useEffect(() => {
    if (authorized) loadItems()
  }, [authorized, loadItems])

  // ── Run agent manually ──────────────────────────────────────────────────────
  const runAgent = async () => {
    setRunning(true)
    setRunLog(['Starting agent...'])
    try {
      const res = await fetch('/api/agent?secret=dev-test')
      const data = await res.json()
      setRunLog(data.log || [String(data.error || 'Unknown error')])
      if (data.success) {
        showToast(`Agent complete — ${data.itemsSaved} items saved`)
        loadItems()
      } else {
        showToast('Agent failed — check log', false)
      }
    } catch (e) {
      setRunLog([`Error: ${String(e)}`])
      showToast('Agent failed', false)
    } finally {
      setRunning(false)
    }
  }

  // ── Approve / Reject ────────────────────────────────────────────────────────
  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setActionLoading(id)
    try {
      const res = await fetch('/api/agent/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      })
      const data = await res.json()
      if (data.success) {
        showToast(action === 'approve' ? '✅ Approved & published' : '🗑 Rejected')
        loadItems()
      } else {
        showToast(data.error || 'Failed', false)
      }
    } catch (e) {
      showToast(String(e), false)
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--tx3)', fontSize: 14 }}>
        Checking access…
      </div>
    )
  }

  if (!authorized) return null

  // Group items by run_id
  const runs = items.reduce<Record<string, AgentItem[]>>((acc, item) => {
    if (!acc[item.run_id]) acc[item.run_id] = []
    acc[item.run_id].push(item)
    return acc
  }, {})

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '24px', fontFamily: 'var(--font-dm, DM Sans, sans-serif)' }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 999, padding: '10px 16px', borderRadius: 10, background: toast.ok ? 'rgba(34,197,94,.15)' : 'rgba(239,68,68,.15)', border: `1px solid ${toast.ok ? 'rgba(34,197,94,.3)' : 'rgba(239,68,68,.3)'}`, color: toast.ok ? '#16a34a' : '#dc2626', fontSize: 13, fontWeight: 500 }}>
          {toast.msg}
        </div>
      )}

      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
                  <rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.45"/>
                  <rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.7"/>
                  <rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/>
                  <path d="M21 7 L24 3 L27 7" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h1 style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-sora)', margin: 0 }}>
                Growth Agent
              </h1>
              <button onClick={() => router.push('/admin/x')}
                style={{ padding: '7px 14px', borderRadius: 9, border: '1px solid #1d9bf0', background: 'rgba(29,155,240,.06)', color: '#1d9bf0', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
                𝕏 X Agent →
              </button>
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 9999, background: 'rgba(99,102,241,.1)', color: '#6366F1', fontWeight: 600 }}>
                Admin Only
              </span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--tx3)', margin: 0 }}>
              Runs daily at 6am UTC · Scout → Analyse → Write → Review
            </p>
          </div>

          <button
            onClick={runAgent}
            disabled={running}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', borderRadius: 9999, border: 'none', background: running ? 'var(--b)' : '#6366F1', color: running ? 'var(--tx3)' : '#fff', fontSize: 13, fontWeight: 600, cursor: running ? 'wait' : 'pointer', fontFamily: 'inherit', transition: 'all 150ms' }}>
            {running ? (
              <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}><path d="M21 12a9 9 0 11-6.219-8.56"/></svg> Running…</>
            ) : (
              <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg> Run Agent Now</>
            )}
          </button>
        </div>

        {/* Run log */}
        {runLog.length > 0 && (
          <div style={{ marginBottom: 20, padding: '14px 16px', borderRadius: 12, background: 'var(--ev)', border: '1px solid var(--b)', fontSize: 12, fontFamily: 'var(--font-mono, monospace)', color: 'var(--tx2)', maxHeight: 200, overflowY: 'auto' }}>
            {runLog.map((line, i) => <div key={i}>{line}</div>)}
          </div>
        )}

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {(['pending', 'published', 'rejected', 'all'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '6px 14px', borderRadius: 9999, border: `1px solid ${filter === f ? '#6366F1' : 'var(--b2)'}`, background: filter === f ? 'rgba(99,102,241,.1)' : 'transparent', color: filter === f ? '#6366F1' : 'var(--tx3)', fontSize: 12, fontWeight: filter === f ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize' }}>
              {f}
            </button>
          ))}
        </div>

        {/* Content runs */}
        {Object.keys(runs).length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--tx3)', fontSize: 14 }}>
            No content yet — run the agent to generate your first batch.
          </div>
        )}

        {Object.entries(runs).map(([runId, runItems]) => {
          const firstItem = runItems[0]
          const vs = firstItem.verdict ? VERDICT_STYLE[firstItem.verdict as keyof typeof VERDICT_STYLE] : null

          return (
            <div key={runId} style={{ marginBottom: 24, borderRadius: 16, border: '1px solid var(--b)', overflow: 'hidden', background: 'var(--sf)' }}>

              {/* Run header */}
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--b)', background: 'var(--ev)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {firstItem.source_title || 'Agent Run'}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--tx3)' }}>
                      {new Date(firstItem.created_at).toLocaleString('en-GB')} · Query: "{firstItem.source_query}"
                    </div>
                  </div>
                  {vs && (
                    <span style={{ fontSize: 11, fontWeight: 600, color: vs.color, background: vs.bg, border: `1px solid ${vs.border}`, padding: '3px 10px', borderRadius: 9999, flexShrink: 0 }}>
                      {vs.label}
                    </span>
                  )}
                </div>

                {firstItem.verdict_sentence && (
                  <div style={{ marginTop: 8, fontSize: 12, color: 'var(--tx2)', fontStyle: 'italic' }}>
                    "{firstItem.verdict_sentence}"
                  </div>
                )}

                {firstItem.scenario && (
                  <div style={{ marginTop: 6, fontSize: 12, color: '#6366F1' }}>
                    ⚡ Scenario: "{firstItem.scenario}"
                  </div>
                )}

                {firstItem.pulse_signal && (
                  <div style={{ marginTop: 4, fontSize: 11, color: 'var(--tx3)' }}>
                    Pulse: "{firstItem.pulse_signal}"
                  </div>
                )}
              </div>

              {/* Content items */}
              {runItems.map(item => (
                <div key={item.id} style={{ borderBottom: '1px solid var(--b)' }}>
                  <div
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--ev)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Type badge */}
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 6, background: item.type === 'blog' ? 'rgba(99,102,241,.1)' : item.type === 'thread' ? 'rgba(34,197,94,.1)' : 'rgba(245,158,11,.1)', color: item.type === 'blog' ? '#6366F1' : item.type === 'thread' ? '#16a34a' : '#d97706', flexShrink: 0, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                      {item.type === 'blog' ? '📝 Blog' : item.type === 'thread' ? '🧵 Thread' : '💬 Replies'}
                    </span>

                    {/* Status */}
                    <span style={{ fontSize: 11, color: item.status === 'pending' ? '#d97706' : item.status === 'published' ? '#16a34a' : '#94a3b8', fontWeight: 500, flexShrink: 0 }}>
                      {item.status === 'pending' ? '⏳ Pending' : item.status === 'published' ? '✅ Published' : '🗑 Rejected'}
                    </span>

                    <span style={{ fontSize: 12, color: 'var(--tx3)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.type === 'blog' ? (item.content as { title?: string }).title || 'Blog post'
                        : item.type === 'thread' ? `${(item.content as { tweets?: { text: string }[] }).tweets?.[0]?.text?.slice(0, 60) || 'Thread'}…`
                        : `${(item.content as { replies?: { reply: string }[] }).replies?.length || 0} smart replies`}
                    </span>

                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2" strokeLinecap="round" style={{ transform: expandedId === item.id ? 'rotate(180deg)' : 'none', transition: 'transform 150ms', flexShrink: 0 }}>
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </div>

                  {/* Expanded content */}
                  {expandedId === item.id && (
                    <div style={{ padding: '0 16px 16px' }}>
                      <div style={{ padding: '12px', borderRadius: 10, background: 'var(--bg)', border: '1px solid var(--b)', fontSize: 12, color: 'var(--tx2)', lineHeight: 1.6, maxHeight: 320, overflowY: 'auto', fontFamily: 'var(--font-mono, monospace)', marginBottom: 12, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {JSON.stringify(item.content, null, 2)}
                      </div>

                      {item.status === 'pending' && (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            onClick={() => handleAction(item.id, 'approve')}
                            disabled={actionLoading === item.id}
                            style={{ flex: 1, padding: '9px', borderRadius: 9, border: 'none', background: '#6366F1', color: '#fff', fontSize: 13, fontWeight: 600, cursor: actionLoading === item.id ? 'wait' : 'pointer', fontFamily: 'inherit' }}>
                            {actionLoading === item.id ? 'Processing…' : item.type === 'blog' ? '✅ Approve & Add to Blog' : '✅ Approve'}
                          </button>
                          <button
                            onClick={() => handleAction(item.id, 'reject')}
                            disabled={actionLoading === item.id}
                            style={{ padding: '9px 16px', borderRadius: 9, border: '1px solid var(--b2)', background: 'transparent', color: 'var(--tx3)', fontSize: 13, cursor: actionLoading === item.id ? 'wait' : 'pointer', fontFamily: 'inherit' }}>
                            Reject
                          </button>
                          {item.source_url && (
                            <a href={item.source_url} target="_blank" rel="noopener noreferrer"
                              style={{ padding: '9px 14px', borderRadius: 9, border: '1px solid var(--b2)', background: 'transparent', color: 'var(--tx3)', fontSize: 12, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                              Source ↗
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
