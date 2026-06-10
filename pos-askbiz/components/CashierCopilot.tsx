'use client'
import { useState, useCallback } from 'react'

const ACC = '#d08a59'

interface CartItem {
  inventory_id?: string
  name: string
  qty: number
  unit_price: number
  cost_price: number
}

interface Props {
  screen: string
  cart: CartItem[]
  customerPhone?: string
  ownerId?: string
  staffId?: string
}

export default function CashierCopilot({ screen, cart, customerPhone, ownerId, staffId }: Props) {
  const [open, setOpen] = useState(false)
  const [tip, setTip] = useState('')
  const [loading, setLoading] = useState(false)
  const [question, setQuestion] = useState('')

  const fetchTip = useCallback(async (q?: string) => {
    if (!ownerId || !staffId) return
    setLoading(true)
    setTip('')
    try {
      const res = await fetch('/api/pos/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-owner-id': ownerId, 'x-staff-id': staffId },
        body: JSON.stringify({ screen, cart, customer_phone: customerPhone, question: q }),
      })
      if (res.ok) {
        const data = await res.json()
        setTip(data.tip || 'No tips right now.')
      }
    } catch {
      setTip('Could not load tip.')
    } finally {
      setLoading(false)
    }
  }, [screen, cart, customerPhone, ownerId, staffId])

  const handleOpen = () => {
    setOpen(true)
    if (!tip && !loading) fetchTip()
  }

  const handleAsk = () => {
    if (!question.trim()) return
    fetchTip(question.trim())
    setQuestion('')
  }

  if (!ownerId || !staffId) return null

  // Floating bubble
  if (!open) {
    return (
      <button
        onClick={handleOpen}
        style={{
          position: 'fixed', bottom: 20, right: 20, zIndex: 9999,
          width: 52, height: 52, borderRadius: '50%',
          background: `linear-gradient(135deg, ${ACC}, #c47a4d)`,
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(208,138,89,.4)',
          transition: 'transform 150ms',
        }}
        title="AI Copilot"
      >
        <span style={{ fontSize: 22 }}>🤖</span>
      </button>
    )
  }

  return (
    <div className="pos-sheet" style={{
      position: 'fixed', bottom: 20, right: 20, zIndex: 9999,
      width: 300, maxHeight: 360,
      borderRadius: 16, overflow: 'hidden',
      background: '#1a1a1a', border: '1px solid #333',
      boxShadow: '0 8px 32px rgba(0,0,0,.5)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px',
        background: `linear-gradient(135deg, ${ACC}, #c47a4d)`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>🤖</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Copilot</span>
        </div>
        <button
          onClick={() => setOpen(false)}
          style={{ background: 'none', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer', padding: '0 4px' }}
        >✕</button>
      </div>

      {/* Tip area */}
      <div style={{ flex: 1, padding: '12px 14px', overflowY: 'auto', minHeight: 80 }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: ACC, animation: 'pulse 1s infinite' }} />
            <span style={{ fontSize: 12, color: '#999' }}>Thinking...</span>
          </div>
        ) : tip ? (
          <div className="pos-reveal" style={{ fontSize: 13, color: '#e0e0e0', lineHeight: 1.5 }}>{tip}</div>
        ) : (
          <div style={{ fontSize: 12, color: '#777' }}>Ask me anything about your sale, stock, or customers.</div>
        )}
      </div>

      {/* Quick actions */}
      <div style={{ padding: '0 10px 8px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {screen === 'home' && (
          <QuickBtn label="What's selling?" onClick={() => fetchTip("What are today's top sellers and what should I push?")} />
        )}
        {screen === 'cart' && cart.length > 0 && (
          <>
            <QuickBtn label="Cart margin?" onClick={() => fetchTip("What's the margin on this cart and how can I improve it?")} />
            <QuickBtn label="Suggest add-on" onClick={() => fetchTip("Suggest a high-margin add-on for this cart based on what customers usually buy together.")} />
          </>
        )}
        {screen === 'checkout' && (
          <QuickBtn label="Upsell tip" onClick={() => fetchTip("Any last-minute upsell I should suggest before checkout?")} />
        )}
        <QuickBtn label="Low stock?" onClick={() => fetchTip("Which items are running low that I should mention to the manager?")} />
      </div>

      {/* Input */}
      <div style={{ display: 'flex', padding: '0 10px 10px', gap: 6 }}>
        <input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAsk()}
          placeholder="Ask anything..."
          style={{
            flex: 1, padding: '8px 10px', borderRadius: 8,
            background: '#2a2a2a', border: '1px solid #444',
            color: '#e0e0e0', fontSize: 12, outline: 'none',
            fontFamily: 'inherit',
          }}
        />
        <button
          className="pos-btn-primary"
          onClick={handleAsk}
          disabled={loading || !question.trim()}
          style={{
            padding: '8px 12px', borderRadius: 8,
            background: ACC, border: 'none', color: '#fff',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
            opacity: loading || !question.trim() ? 0.5 : 1,
            fontFamily: 'inherit',
          }}
        >→</button>
      </div>
    </div>
  )
}

function QuickBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: 10, color: '#ccc', background: '#2a2a2a',
        border: '1px solid #444', borderRadius: 6,
        padding: '4px 8px', cursor: 'pointer', fontFamily: 'inherit',
      }}
    >{label}</button>
  )
}
