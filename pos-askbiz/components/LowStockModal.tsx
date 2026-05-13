'use client'

import { useState, useEffect } from 'react'

interface LowStockItem {
  id: string
  name: string
  qty: number
  reorder_qty?: number
  cost_price?: number
  supplier?: string
}

interface LowStockModalProps {
  isOpen: boolean
  onClose: () => void
  ownerId: string
  ownerEmail: string
}

export function LowStockModal({ isOpen, onClose, ownerId, ownerEmail }: LowStockModalProps) {
  const [items, setItems] = useState<LowStockItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [askingClaude, setAskingClaude] = useState(false)
  const [claudeResponse, setClaudeResponse] = useState<string>('')

  useEffect(() => {
    if (isOpen) {
      loadLowStockItems()
    }
  }, [isOpen])

  const loadLowStockItems = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/pos/inventory/low-stock?owner_id=${ownerId}`)
      if (response.ok) {
        const data = await response.json()
        setItems(data.items || [])
      }
    } catch (error) {
      console.error('Failed to load low stock items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAskClaude = async () => {
    const itemsToOrder = items.filter((item) => selectedItems.has(item.id) || selectedItems.size === 0)

    if (itemsToOrder.length === 0) {
      alert('Please select items to ask Claude about')
      return
    }

    setAskingClaude(true)

    try {
      const response = await fetch('/api/pos/ai/supplier-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owner_id: ownerId,
          owner_email: ownerEmail,
          low_stock_items: itemsToOrder,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setClaudeResponse(data.response)
      }
    } catch (error) {
      console.error('Failed to get Claude recommendations:', error)
    } finally {
      setAskingClaude(false)
    }
  }

  const toggleItem = (itemId: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId)
    } else {
      newSelected.add(itemId)
    }
    setSelectedItems(newSelected)
  }

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          maxWidth: '800px',
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto',
          padding: '24px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1f2937' }}>
            ⚠️ Low Stock Items ({items.length})
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280',
            }}
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading items...</div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            ✅ No low stock items! Your inventory is healthy.
          </div>
        ) : (
          <>
            {/* Items List */}
            <div style={{ marginBottom: '24px' }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '16px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    border: '1px solid #e5e7eb',
                    cursor: 'pointer',
                  }}
                  onClick={() => toggleItem(item.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.id)}
                    onChange={() => toggleItem(item.id)}
                    style={{ marginRight: '12px', cursor: 'pointer' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#1f2937' }}>{item.name}</div>
                    <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                      Current: {item.qty} units
                      {item.reorder_qty && ` | Reorder at: ${item.reorder_qty}`}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#dc2626',
                      backgroundColor: '#fee2e2',
                      padding: '6px 12px',
                      borderRadius: '6px',
                    }}
                  >
                    {Math.max(0, (item.reorder_qty || 10) - item.qty)} more needed
                  </div>
                </div>
              ))}
            </div>

            {/* Claude Response Section */}
            {claudeResponse && (
              <div
                style={{
                  backgroundColor: '#f0f9ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '24px',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: '#1e40af',
                }}
              >
                <div style={{ fontWeight: '600', marginBottom: '12px' }}>🤖 Claude's Recommendations:</div>
                <div style={{ whiteSpace: 'pre-wrap' }}>{claudeResponse}</div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleAskClaude}
                disabled={askingClaude}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#6366f1',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: askingClaude ? 'not-allowed' : 'pointer',
                  opacity: askingClaude ? 0.7 : 1,
                }}
              >
                {askingClaude ? 'Asking Claude...' : `🤖 Ask Claude for Suppliers (${selectedItems.size === 0 ? 'All' : selectedItems.size})`}
              </button>
              <button
                onClick={onClose}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
