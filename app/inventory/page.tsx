'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const inputStyle: React.CSSProperties = { padding: '9px 12px', borderRadius: 8, border: '1px solid #e5e2dc', fontSize: 13, fontFamily: 'inherit', background: '#f9f8f6', color: '#1a1916' }
const btnPrimary: React.CSSProperties = { padding: '9px 16px', borderRadius: 8, background: '#d08a59', color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }
const btnSecondary: React.CSSProperties = { padding: '9px 16px', borderRadius: 8, border: '1px solid #e5e2dc', background: 'transparent', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: '#6b6760' }

const ACC = '#d08a59'
const API = process.env.NEXT_PUBLIC_API_URL || ''
// Force redeploy

interface StaffSession { id: string; name: string; role: string; owner_id: string }
interface InventoryItem {
  id: string; name: string; sale_price: number; stock_qty: number
  low_stock_threshold: number; last_sold_at: string | null
}

export default function InventoryPage() {
  const router = useRouter()
  const [staff, setStaff]         = useState<StaffSession | null>(null)
  const [items, setItems]         = useState<InventoryItem[]>([])
  const [loading, setLoading]     = useState(true)
  const [restocking, setRestocking] = useState<string | null>(null)
  const [restockQty, setRestockQty] = useState('')
  const [filter, setFilter]       = useState<'all' | 'low' | 'out'>('all')

  // Camera
  const [recognizedProducts, setRecognizedProducts] = useState<any[]>([])
  const [editingRecognizedIndex, setEditingRecognizedIndex] = useState<number | null>(null)
  const [editingRecognizedData, setEditingRecognizedData] = useState<any>({})
  const [recognizing, setRecognizing] = useState(false)
  const [showCameraPreview, setShowCameraPreview] = useState(false)
  const [addingProduct, setAddingProduct] = useState(false)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    const session = localStorage.getItem('pos_staff')
    if (!session) { router.push('/'); return }
    const s = JSON.parse(session) as StaffSession
    if (s.role !== 'inventory') { router.push('/sell'); return }
    setStaff(s)
    loadInventory()
  }, [])

  const loadInventory = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/pos/inventory`)
      const data = await res.json()
      setItems(data.inventory || [])
    } catch { /* silent — will show empty state */ }
    setLoading(false)
  }

  const handleOpenCamera = async () => {
    setShowCameraPreview(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
    } catch { alert('Could not access camera') }
  }

  const handleCloseCamera = () => {
    if (streamRef.current) { streamRef.current.getTracks().forEach(track => track.stop()); streamRef.current = null }
    setShowCameraPreview(false)
  }

  const handleCapturePhoto = () => {
    if (!canvasRef.current || !videoRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return
    canvasRef.current.width = videoRef.current.videoWidth
    canvasRef.current.height = videoRef.current.videoHeight
    ctx.drawImage(videoRef.current, 0, 0)
    canvasRef.current.toBlob(async (blob) => {
      if (blob) { handleImageCapture(new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' })); handleCloseCamera() }
    }, 'image/jpeg', 0.9)
  }

  const handleImageCapture = async (file: File) => {
    setRecognizing(true)
    try {
      const formData = new FormData(); formData.append('image', file)
      const res = await fetch(`${API}/api/pos/recognize-inventory`, { method: 'POST', body: formData })
      const data = await res.json()
      if (data.products?.length > 0) {
        setRecognizedProducts(data.products)
        // Auto-open modal for first product
        const firstProduct = data.products[0]
        setEditingRecognizedIndex(0)
        setEditingRecognizedData({
          ...firstProduct,
          sale_price: firstProduct.sale_price || '',
          cost_price: firstProduct.cost_price || '',
          stock_qty: (firstProduct.quantity || 1).toString()
        })
      }
    } catch (err) { console.error('Error:', err) }
    setRecognizing(false)
  }

  const handleRestock = async (item: InventoryItem) => {
    if (!restockQty || !staff) return
    const qty = parseInt(restockQty)
    if (isNaN(qty) || qty <= 0) return
    await fetch(`${API}/api/pos/inventory`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, restock_qty: qty, staff_id: staff.id }),
    })
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, stock_qty: i.stock_qty + qty } : i))
    setRestocking(null); setRestockQty('')
  }

  const filtered = items.filter(i => {
    if (filter === 'out') return i.stock_qty === 0
    if (filter === 'low') return i.stock_qty > 0 && i.stock_qty <= i.low_stock_threshold
    return true
  })

  const outCount  = items.filter(i => i.stock_qty === 0).length
  const lowCount  = items.filter(i => i.stock_qty > 0 && i.stock_qty <= i.low_stock_threshold).length

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b6760', fontSize: 14 }}>
      Loading inventory...
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f9f8f6', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: '#1a1916' }}>Inventory</div>
          <div style={{ fontSize: 12, color: '#6b6760' }}>{staff?.name}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input ref={cameraInputRef} type="file" accept="image/*" onChange={e => { if (e.target.files?.[0]) handleImageCapture(e.target.files[0]) }} style={{ display: 'none' }} capture="environment" />
          <input ref={fileInputRef} type="file" accept="image/*" onChange={e => { if (e.target.files?.[0]) handleImageCapture(e.target.files[0]) }} style={{ display: 'none' }} />
          <button onClick={handleOpenCamera} disabled={recognizing} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #e5e2dc', background: 'transparent', fontSize: 12, cursor: 'pointer', color: '#6b6760', opacity: recognizing ? 0.5 : 1 }}>
            {recognizing ? 'Scanning...' : '📷 Scan'}
          </button>
          <button onClick={() => { localStorage.removeItem('pos_staff'); router.push('/') }}
            style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #e5e2dc', background: 'transparent', fontSize: 12, cursor: 'pointer', color: '#6b6760' }}>
            Sign out
          </button>
        </div>
      </div>

      {/* Alert summary */}
      {(outCount > 0 || lowCount > 0) && (
        <div style={{ margin: '8px 20px', padding: '12px 16px', borderRadius: 12, background: 'rgba(220,38,38,.06)', border: '1px solid rgba(220,38,38,.2)' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#dc2626' }}>
            {outCount > 0 && `${outCount} out of stock`}
            {outCount > 0 && lowCount > 0 && ' · '}
            {lowCount > 0 && `${lowCount} running low`}
          </div>
        </div>
      )}

      {/* Camera preview modal */}
      {showCameraPreview && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.9)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxWidth: 600, borderRadius: 12, marginBottom: 16 }} />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={handleCapturePhoto} disabled={recognizing} style={{ ...btnPrimary, padding: '12px 28px', fontSize: 14, fontWeight: 700 }}>{recognizing ? 'Processing...' : 'Capture photo'}</button>
            <button onClick={handleCloseCamera} disabled={recognizing} style={{ padding: '12px 28px', borderRadius: 10, border: '1px solid rgba(255,255,255,.3)', background: 'transparent', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Edit modal for recognized products */}
      {editingRecognizedIndex !== null && recognizedProducts.length > 0 && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 99, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setEditingRecognizedIndex(null)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, maxWidth: 500, width: '100%', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a1916', marginBottom: 20, marginTop: 0 }}>Edit product details</h3>

            {/* Product name (read-only) */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b6760', marginBottom: 6 }}>Product name</label>
              <input type="text" value={editingRecognizedData.name || ''} disabled style={{ ...inputStyle, background: '#f0f0f0', opacity: 0.6, width: '100%' }} />
            </div>

            {/* SKU / Barcode */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b6760', marginBottom: 6 }}>SKU / Barcode {editingRecognizedData.barcode_number ? '(auto-detected)' : ''}</label>
              <input type="text" placeholder="e.g. 8718924509127" value={editingRecognizedData.sku || editingRecognizedData.barcode_number || ''} onChange={(e) => setEditingRecognizedData({ ...editingRecognizedData, sku: e.target.value })} style={{ ...inputStyle, width: '100%' }} />
              {editingRecognizedData.barcode_detected && <div style={{ fontSize: 11, color: '#d08a59', marginTop: 4 }}>✓ Barcode detected in image</div>}
            </div>

            {/* Cost price */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b6760', marginBottom: 6 }}>Cost price (purchase price)</label>
              <input type="number" placeholder="0.00" value={editingRecognizedData.cost_price || ''} onChange={(e) => setEditingRecognizedData({ ...editingRecognizedData, cost_price: e.target.value })} style={{ ...inputStyle, width: '100%' }} step="0.01" />
            </div>

            {/* Sale price */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b6760', marginBottom: 6 }}>Sale price (selling price)</label>
              <input type="number" placeholder="0.00" value={editingRecognizedData.sale_price || ''} onChange={(e) => setEditingRecognizedData({ ...editingRecognizedData, sale_price: e.target.value })} style={{ ...inputStyle, width: '100%' }} step="0.01" />
            </div>

            {/* Quantity */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b6760', marginBottom: 6 }}>Starting stock quantity</label>
              <input type="number" value={editingRecognizedData.stock_qty || 1} onChange={(e) => setEditingRecognizedData({ ...editingRecognizedData, stock_qty: e.target.value })} style={{ ...inputStyle, width: '100%' }} min="1" />
            </div>

            {/* Margin preview */}
            {editingRecognizedData.cost_price && editingRecognizedData.sale_price && (
              <div style={{ background: '#f0f0f0', padding: 12, borderRadius: 8, marginBottom: 20, fontSize: 12 }}>
                <div style={{ color: '#6b6760', marginBottom: 4 }}>Margin: <strong style={{ color: '#d08a59' }}>{((parseFloat(editingRecognizedData.sale_price) - parseFloat(editingRecognizedData.cost_price || 0)) / parseFloat(editingRecognizedData.sale_price || 1) * 100).toFixed(1)}%</strong></div>
                <div style={{ color: '#999', fontSize: 11 }}>Profit per unit: {(parseFloat(editingRecognizedData.sale_price) - parseFloat(editingRecognizedData.cost_price || 0)).toFixed(2)}</div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={async () => {
                if (!editingRecognizedData.sale_price) return
                setAddingProduct(true)
                try {
                  const res = await fetch(`${API}/api/pos/inventory`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      name: editingRecognizedData.name,
                      sale_price: parseFloat(editingRecognizedData.sale_price),
                      cost_price: parseFloat(editingRecognizedData.cost_price || '0'),
                      stock_qty: parseInt(editingRecognizedData.stock_qty || '1'),
                      low_stock_threshold: 5
                    })
                  })
                  const data = await res.json()
                  if (data.product) {
                    setItems(prev => [...prev, data.product])
                    const newRecognized = recognizedProducts.filter((_, idx) => idx !== editingRecognizedIndex)
                    setRecognizedProducts(newRecognized)
                    if (newRecognized.length > 0) {
                      const nextProduct = newRecognized[0]
                      setEditingRecognizedIndex(0)
                      setEditingRecognizedData({
                        ...nextProduct,
                        sale_price: nextProduct.sale_price || '',
                        cost_price: nextProduct.cost_price || '',
                        stock_qty: (nextProduct.quantity || 1).toString()
                      })
                    } else {
                      setEditingRecognizedIndex(null)
                    }
                  }
                } catch (err) {
                  console.error('Error:', err)
                }
                setAddingProduct(false)
              }} disabled={!editingRecognizedData.sale_price || addingProduct} style={{ ...btnPrimary, flex: 1, opacity: !editingRecognizedData.sale_price || addingProduct ? 0.5 : 1 }}>{addingProduct ? 'Adding...' : 'Add to inventory'}</button>
              <button onClick={() => { setEditingRecognizedIndex(null); setRecognizedProducts([]) }} style={btnSecondary}>Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, padding: '12px 20px' }}>
        {([['all', `All (${items.length})`], ['low', `Low (${lowCount})`], ['out', `Out (${outCount})`]] as [typeof filter, string][]).map(([f, label]) => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 14px', borderRadius: 9999, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: filter === f ? ACC : '#fff', color: filter === f ? '#fff' : '#6b6760', border: filter === f ? 'none' : '1px solid #e5e2dc' } as React.CSSProperties}>
            {label}
          </button>
        ))}
      </div>

      {/* Inventory list */}
      <div style={{ flex: 1, padding: '4px 20px 32px', overflowY: 'auto' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b6760', fontSize: 14 }}>
            No items in this filter
          </div>
        ) : (
          filtered.map(item => {
            const isOut = item.stock_qty === 0
            const isLow = !isOut && item.stock_qty <= item.low_stock_threshold
            const status = isOut ? { label: 'Out', color: '#dc2626', bg: 'rgba(220,38,38,.08)' }
                         : isLow ? { label: 'Low', color: '#ca8a04', bg: 'rgba(234,179,8,.08)' }
                         :          { label: 'OK',  color: '#16a34a', bg: 'rgba(22,163,74,.08)' }

            return (
              <div key={item.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid #e5e2dc', marginBottom: 10, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1916', marginBottom: 2 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: '#6b6760' }}>£{item.sale_price.toFixed(2)} · {item.stock_qty} in stock</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: status.color, background: status.bg, padding: '3px 9px', borderRadius: 9999 }}>{status.label}</span>
                    <button onClick={() => { setRestocking(restocking === item.id ? null : item.id); setRestockQty('') }}
                      style={{ padding: '7px 12px', borderRadius: 9, background: `rgba(208,138,89,.1)`, border: `1px solid rgba(208,138,89,.2)`, color: ACC, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                      Restock
                    </button>
                  </div>
                </div>

                {restocking === item.id && (
                  <div style={{ padding: '0 16px 14px', display: 'flex', gap: 10 }}>
                    <input
                      type="number"
                      placeholder="Qty to add"
                      value={restockQty}
                      onChange={e => setRestockQty(e.target.value)}
                      style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '1.5px solid #e5e2dc', fontSize: 15, fontFamily: 'inherit', background: '#f9f8f6', color: '#1a1916' }}
                      autoFocus
                    />
                    <button onClick={() => handleRestock(item)} style={{ padding: '10px 20px', borderRadius: 10, background: ACC, color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                      Add
                    </button>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
