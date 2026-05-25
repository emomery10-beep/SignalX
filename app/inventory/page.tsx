'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const inputStyle: React.CSSProperties = { padding: '9px 12px', borderRadius: 8, border: '1px solid #e5e2dc', fontSize: 13, fontFamily: 'inherit', background: '#f9f8f6', color: '#1a1916' }
const btnPrimary: React.CSSProperties = { padding: '9px 16px', borderRadius: 8, background: '#d08a59', color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }
const btnSecondary: React.CSSProperties = { padding: '9px 16px', borderRadius: 8, border: '1px solid #e5e2dc', background: 'transparent', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: '#6b6760' }

const ACC = '#d08a59'
const API = process.env.NEXT_PUBLIC_API_URL || ''

interface StaffSession { id: string; name: string; role: string; owner_id: string }
interface InventoryItem {
  id: string; name: string; sale_price: number; stock_qty: number
  low_stock_threshold: number; last_sold_at: string | null
}

// Resize image to max dimension and compress, return base64 (no prefix)
function fileToBase64(file: File, maxDim = 1200, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      let w = img.width, h = img.height
      if (w > maxDim || h > maxDim) {
        if (w > h) { h = Math.round(h * maxDim / w); w = maxDim }
        else       { w = Math.round(w * maxDim / h); h = maxDim }
      }
      const canvas = document.createElement('canvas')
      canvas.width = w; canvas.height = h
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, w, h)
      const dataUrl = canvas.toDataURL('image/jpeg', quality)
      resolve(dataUrl.split(',')[1])
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

// Create a small thumbnail data URL for preview
function fileToThumb(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const maxT = 200
      let w = img.width, h = img.height
      if (w > maxT || h > maxT) {
        if (w > h) { h = Math.round(h * maxT / w); w = maxT }
        else       { w = Math.round(w * maxT / h); h = maxT }
      }
      const canvas = document.createElement('canvas')
      canvas.width = w; canvas.height = h
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h)
      resolve(canvas.toDataURL('image/jpeg', 0.6))
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

export default function InventoryPage() {
  const router = useRouter()
  const [staff, setStaff]         = useState<StaffSession | null>(null)
  const [items, setItems]         = useState<InventoryItem[]>([])
  const [loading, setLoading]     = useState(true)
  const [restocking, setRestocking] = useState<string | null>(null)
  const [restockQty, setRestockQty] = useState('')
  const [filter, setFilter]       = useState<'all' | 'low' | 'out'>('all')

  // Dual-photo scan
  const [showScanModal, setShowScanModal] = useState(false)
  const [scanFront, setScanFront]         = useState<string | null>(null)   // base64
  const [scanBack, setScanBack]           = useState<string | null>(null)   // base64
  const [scanFrontThumb, setScanFrontThumb] = useState<string | null>(null)
  const [scanBackThumb, setScanBackThumb]   = useState<string | null>(null)
  const [scanning, setScanning]   = useState(false)
  const [scanStep, setScanStep]   = useState<'front' | 'back' | null>(null)
  const scanFrontRef = useRef<HTMLInputElement>(null)
  const scanBackRef  = useRef<HTMLInputElement>(null)
  const scanVideoRef  = useRef<HTMLVideoElement>(null)
  const scanCanvasRef = useRef<HTMLCanvasElement>(null)
  const scanStreamRef = useRef<MediaStream | null>(null)
  const [scanCameraOpen, setScanCameraOpen] = useState(false)

  // Scanned product edit
  const [editingScanned, setEditingScanned] = useState<any>(null)
  const [addingProduct, setAddingProduct] = useState(false)
  const [scanError, setScanError] = useState<string | null>(null)

  useEffect(() => {
    const session = localStorage.getItem('pos_staff')
    if (!session) { router.push('/sell'); return }
    const s = JSON.parse(session) as StaffSession
    if (s.role !== 'inventory') { router.push('/sell'); return }
    setStaff(s)
    loadInventory()
  }, [])

  const loadInventory = async () => {
    setLoading(true)
    try {
      const session = localStorage.getItem('pos_staff')
      const s = session ? JSON.parse(session) : null
      const res = await fetch(`${API}/api/pos/inventory`, { headers: { 'x-staff-id': s?.id || '', 'x-owner-id': s?.owner_id || '' } })
      const data = await res.json()
      setItems(data.inventory || [])
    } catch { /* silent — will show empty state */ }
    setLoading(false)
  }

  // ── Dual-photo scan helpers ──
  const handleScanFileSelected = async (file: File, slot: 'front' | 'back') => {
    const [b64, thumb] = await Promise.all([fileToBase64(file), fileToThumb(file)])
    if (slot === 'front') { setScanFront(b64); setScanFrontThumb(thumb) }
    else                  { setScanBack(b64);  setScanBackThumb(thumb)  }
  }

  const openScanCamera = async (slot: 'front' | 'back') => {
    setScanStep(slot)
    setScanCameraOpen(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      scanStreamRef.current = stream
      if (scanVideoRef.current) scanVideoRef.current.srcObject = stream
    } catch { alert('Could not access camera'); setScanCameraOpen(false) }
  }

  const closeScanCamera = () => {
    if (scanStreamRef.current) { scanStreamRef.current.getTracks().forEach(t => t.stop()); scanStreamRef.current = null }
    setScanCameraOpen(false)
  }

  const captureScanPhoto = () => {
    if (!scanVideoRef.current || !scanCanvasRef.current || !scanStep) return
    // Resize on capture to max 1200px to keep images small
    const vw = scanVideoRef.current.videoWidth
    const vh = scanVideoRef.current.videoHeight
    console.log('[Inventory Scan] Video dimensions:', vw, 'x', vh, 'for slot:', scanStep)
    if (vw === 0 || vh === 0) {
      alert('Camera not ready — wait a moment and try again.')
      return
    }
    const maxDim = 1200
    let cw = vw, ch = vh
    if (vw > maxDim || vh > maxDim) {
      if (vw > vh) { ch = Math.round(vh * maxDim / vw); cw = maxDim }
      else         { cw = Math.round(vw * maxDim / vh); ch = maxDim }
    }
    scanCanvasRef.current.width = cw
    scanCanvasRef.current.height = ch
    const ctx = scanCanvasRef.current.getContext('2d')!
    ctx.drawImage(scanVideoRef.current, 0, 0, cw, ch)
    scanCanvasRef.current.toBlob(async blob => {
      if (!blob) return
      console.log('[Inventory Scan] Captured blob size:', Math.round(blob.size / 1024), 'KB for slot:', scanStep)
      const file = new File([blob], 'scan.jpg', { type: 'image/jpeg' })
      await handleScanFileSelected(file, scanStep)
      closeScanCamera()
    }, 'image/jpeg', 0.75)
  }

  const runFullScan = async () => {
    if (!scanFront || !staff) return
    setScanning(true)
    setScanError(null)
    try {
      const body: any = { front: scanFront }
      if (scanBack) body.back = scanBack

      console.log('[Scan] Sending image, front size:', Math.round(scanFront.length / 1024), 'KB', scanBack ? ', back size: ' + Math.round(scanBack.length / 1024) + ' KB' : '')

      const res = await fetch(`${API}/api/pos/scan-product-full`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-staff-id': staff.id, 'x-owner-id': staff.owner_id },
        body: JSON.stringify(body),
      })

      console.log('[Scan] Response status:', res.status)

      if (!res.ok) {
        const errText = await res.text()
        console.error('[Scan] Error response:', errText)
        setScanError(`Scan failed (${res.status}): ${errText.slice(0, 100)}`)
        setScanning(false)
        return
      }

      const data = await res.json()
      console.log('[Scan] Result:', data)

      if (!data.product) {
        setScanError(data.error || 'Could not identify the product — try a clearer photo with the label visible')
        setScanning(false)
        return
      }

      const p = data.product
      setEditingScanned({
        name: p.name || '',
        brand: p.brand || '',
        category: p.category || '',
        sku: p.sku || '',
        supplier: p.supplier || '',
        expiry_date: p.expiry_date || '',
        batch_number: p.batch_number || '',
        sale_price: p.sale_price != null ? String(p.sale_price) : '',
        cost_price: p.cost_price != null ? String(p.cost_price) : '',
        stock_qty: '1',
        description: p.description || '',
      })
      setShowScanModal(false)
      setScanError(null)
      setScanFront(null); setScanBack(null)
      setScanFrontThumb(null); setScanBackThumb(null)
    } catch (err: any) {
      console.error('[Scan] Exception:', err)
      setScanError('Network error — check your connection and try again')
    }
    setScanning(false)
  }

  // ── Restock ──
  const handleRestock = async (item: InventoryItem) => {
    if (!restockQty || !staff) return
    const qty = parseInt(restockQty)
    if (isNaN(qty) || qty <= 0) return
    await fetch(`${API}/api/pos/inventory`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-staff-id': staff.id, 'x-owner-id': staff.owner_id },
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
          {/* Hidden file inputs for front/back */}
          <input ref={scanFrontRef} type="file" accept="image/*" capture="environment" onChange={e => { if (e.target.files?.[0]) handleScanFileSelected(e.target.files[0], 'front'); e.target.value = '' }} style={{ display: 'none' }} />
          <input ref={scanBackRef}  type="file" accept="image/*" capture="environment" onChange={e => { if (e.target.files?.[0]) handleScanFileSelected(e.target.files[0], 'back');  e.target.value = '' }} style={{ display: 'none' }} />

          <button onClick={() => setShowScanModal(true)} disabled={scanning} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #e5e2dc', background: 'transparent', fontSize: 12, cursor: 'pointer', color: '#6b6760', opacity: scanning ? 0.5 : 1 }}>
            {scanning ? 'Scanning...' : '📷 Scan'}
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

      {/* ── Dual-photo scan modal ── */}
      {showScanModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={() => !scanning && setShowScanModal(false)}>
          <div style={{ background: '#fff', borderRadius: '16px 16px 0 0', padding: '20px 20px 24px', maxWidth: 420, width: '100%', maxHeight: '80vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>

            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1916' }}>Scan product</div>
              <button onClick={() => setShowScanModal(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#999', padding: 2, lineHeight: 1 }}>×</button>
            </div>

            {/* Compact photo slots — side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              {/* Front */}
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#6b6760', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.05em' }}>Front <span style={{ color: '#ef4444' }}>*</span></div>
                {scanFrontThumb ? (
                  <div style={{ position: 'relative' }}>
                    <img src={scanFrontThumb} alt="front" style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8, display: 'block', border: '2px solid ' + ACC }} />
                    <button onClick={() => { setScanFront(null); setScanFrontThumb(null) }} style={{ position: 'absolute', top: 4, right: 4, width: 18, height: 18, borderRadius: 999, background: 'rgba(0,0,0,.6)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>×</button>
                    <div style={{ position: 'absolute', bottom: 4, left: 4, fontSize: 8, fontWeight: 700, color: '#fff', background: ACC, padding: '1px 6px', borderRadius: 999 }}>✓ FRONT</div>
                  </div>
                ) : (
                  <div style={{ height: 100, borderRadius: 8, border: '1.5px dashed #ddd', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#faf9f7' }}>
                    <div style={{ fontSize: 11, color: '#999' }}>📦 Brand, name</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openScanCamera('front')} style={{ padding: '4px 10px', borderRadius: 6, background: ACC, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 600, fontFamily: 'inherit' }}>📷 Photo</button>
                      <button onClick={() => scanFrontRef.current?.click()} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #ddd', background: '#fff', color: '#6b6760', cursor: 'pointer', fontSize: 10, fontFamily: 'inherit' }}>Upload</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Back */}
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#6b6760', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.05em' }}>Back <span style={{ fontWeight: 400, fontSize: 9 }}>(optional)</span></div>
                {scanBackThumb ? (
                  <div style={{ position: 'relative' }}>
                    <img src={scanBackThumb} alt="back" style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8, display: 'block', border: '2px solid #0891b2' }} />
                    <button onClick={() => { setScanBack(null); setScanBackThumb(null) }} style={{ position: 'absolute', top: 4, right: 4, width: 18, height: 18, borderRadius: 999, background: 'rgba(0,0,0,.6)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>×</button>
                    <div style={{ position: 'absolute', bottom: 4, left: 4, fontSize: 8, fontWeight: 700, color: '#fff', background: '#0891b2', padding: '1px 6px', borderRadius: 999 }}>✓ BACK</div>
                  </div>
                ) : (
                  <div style={{ height: 100, borderRadius: 8, border: '1.5px dashed #ddd', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#faf9f7' }}>
                    <div style={{ fontSize: 11, color: '#999' }}>🏷️ Expiry, batch</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openScanCamera('back')} style={{ padding: '4px 10px', borderRadius: 6, background: '#0891b2', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 600, fontFamily: 'inherit' }}>📷 Photo</button>
                      <button onClick={() => scanBackRef.current?.click()} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #ddd', background: '#fff', color: '#6b6760', cursor: 'pointer', fontSize: 10, fontFamily: 'inherit' }}>Upload</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Auto-fill tags — compact */}
            {!scanFront && (
              <div style={{ background: '#faf9f7', borderRadius: 8, padding: '8px 12px', marginBottom: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#999', marginBottom: 4 }}>AI auto-fills:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {['Name', 'Brand', 'Category', 'SKU', 'Price'].map(f => (
                    <span key={f} style={{ fontSize: 9, color: ACC, background: 'rgba(208,138,89,.08)', padding: '1px 6px', borderRadius: 999 }}>{f}</span>
                  ))}
                  {['Expiry', 'Batch', 'Supplier'].map(f => (
                    <span key={f} style={{ fontSize: 9, color: '#0891b2', background: 'rgba(8,145,178,.08)', padding: '1px 6px', borderRadius: 999 }}>{f}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Hint for back photo */}
            {scanFront && !scanBack && (
              <div style={{ fontSize: 10, color: '#999', textAlign: 'center', marginBottom: 10 }}>
                Add back photo for expiry, batch &amp; supplier
              </div>
            )}

            {/* Error display */}
            {scanError && (
              <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(220,38,38,.08)', border: '1px solid rgba(220,38,38,.2)', marginBottom: 10, fontSize: 12, color: '#dc2626', lineHeight: 1.4 }}>
                {scanError}
              </div>
            )}

            {/* Scan button */}
            <button
              onClick={runFullScan}
              disabled={!scanFront || scanning}
              style={{ width: '100%', padding: '12px', borderRadius: 10, background: scanFront ? ACC : '#e5e2dc', color: scanFront ? '#fff' : '#999', border: 'none', fontSize: 13, fontWeight: 700, cursor: scanFront ? 'pointer' : 'not-allowed', fontFamily: 'inherit', transition: 'all .2s' }}
            >
              {scanning ? '⏳ Reading...' : scanFront ? `Scan & fill${scanBack ? ' (front + back)' : ''}` : 'Take front photo first'}
            </button>
          </div>
        </div>
      )}

      {/* ── In-app camera for scan modal ── */}
      {scanCameraOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.95)', zIndex: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ color: '#fff', fontSize: 12, fontWeight: 600, marginBottom: 8, opacity: 0.7 }}>
            {scanStep === 'front' ? 'Point at the FRONT' : 'Point at the BACK'}
          </div>
          <video ref={scanVideoRef} autoPlay playsInline muted style={{ width: '100%', maxWidth: 400, borderRadius: 12, marginBottom: 12, border: `2px solid ${scanStep === 'front' ? ACC : '#0891b2'}` }} />
          <canvas ref={scanCanvasRef} style={{ display: 'none' }} />
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={captureScanPhoto} style={{ padding: '10px 24px', borderRadius: 10, background: scanStep === 'front' ? ACC : '#0891b2', color: '#fff', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              Capture
            </button>
            <button onClick={closeScanCamera} style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid rgba(255,255,255,.25)', background: 'transparent', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Edit scanned product modal ── */}
      {editingScanned && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 99, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => !addingProduct && setEditingScanned(null)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, maxWidth: 500, width: '100%', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a1916', marginBottom: 4, marginTop: 0 }}>Review scanned product</h3>
            {editingScanned.description && (
              <div style={{ fontSize: 12, color: '#999', marginBottom: 16, lineHeight: 1.4 }}>{editingScanned.description}</div>
            )}

            {/* Product name */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b6760', marginBottom: 6 }}>Product name</label>
              <input type="text" value={editingScanned.name || ''} onChange={(e) => setEditingScanned({ ...editingScanned, name: e.target.value })} style={{ ...inputStyle, width: '100%' }} />
            </div>

            {/* Brand + Category row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b6760', marginBottom: 6 }}>Brand</label>
                <input type="text" value={editingScanned.brand || ''} onChange={(e) => setEditingScanned({ ...editingScanned, brand: e.target.value })} style={{ ...inputStyle, width: '100%' }} placeholder="e.g. Dove" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b6760', marginBottom: 6 }}>Category</label>
                <input type="text" value={editingScanned.category || ''} onChange={(e) => setEditingScanned({ ...editingScanned, category: e.target.value })} style={{ ...inputStyle, width: '100%' }} placeholder="e.g. Personal Care" />
              </div>
            </div>

            {/* SKU / Barcode */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b6760', marginBottom: 6 }}>SKU / Barcode {editingScanned.sku ? '(auto-detected)' : ''}</label>
              <input type="text" placeholder="e.g. 8718924509127" value={editingScanned.sku || ''} onChange={(e) => setEditingScanned({ ...editingScanned, sku: e.target.value })} style={{ ...inputStyle, width: '100%' }} />
              {editingScanned.sku && <div style={{ fontSize: 11, color: ACC, marginTop: 4 }}>✓ Barcode detected in image</div>}
            </div>

            {/* Supplier + Expiry row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#0891b2', marginBottom: 6 }}>Supplier</label>
                <input type="text" value={editingScanned.supplier || ''} onChange={(e) => setEditingScanned({ ...editingScanned, supplier: e.target.value })} style={{ ...inputStyle, width: '100%' }} placeholder="From back label" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#0891b2', marginBottom: 6 }}>Expiry date</label>
                <input type="date" value={editingScanned.expiry_date || ''} onChange={(e) => setEditingScanned({ ...editingScanned, expiry_date: e.target.value })} style={{ ...inputStyle, width: '100%' }} />
              </div>
            </div>

            {/* Batch number */}
            {editingScanned.batch_number && (
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#0891b2', marginBottom: 6 }}>Batch number</label>
                <input type="text" value={editingScanned.batch_number || ''} onChange={(e) => setEditingScanned({ ...editingScanned, batch_number: e.target.value })} style={{ ...inputStyle, width: '100%' }} />
              </div>
            )}

            {/* Cost + Sale price row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b6760', marginBottom: 6 }}>Cost price</label>
                <input type="number" placeholder="0.00" value={editingScanned.cost_price || ''} onChange={(e) => setEditingScanned({ ...editingScanned, cost_price: e.target.value })} style={{ ...inputStyle, width: '100%' }} step="0.01" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b6760', marginBottom: 6 }}>Sale price</label>
                <input type="number" placeholder="0.00" value={editingScanned.sale_price || ''} onChange={(e) => setEditingScanned({ ...editingScanned, sale_price: e.target.value })} style={{ ...inputStyle, width: '100%' }} step="0.01" />
              </div>
            </div>

            {/* Quantity */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b6760', marginBottom: 6 }}>Starting stock quantity</label>
              <input type="number" value={editingScanned.stock_qty || 1} onChange={(e) => setEditingScanned({ ...editingScanned, stock_qty: e.target.value })} style={{ ...inputStyle, width: '100%' }} min="1" />
            </div>

            {/* Margin preview */}
            {editingScanned.cost_price && editingScanned.sale_price && (
              <div style={{ background: '#f0f0f0', padding: 12, borderRadius: 8, marginBottom: 20, fontSize: 12 }}>
                <div style={{ color: '#6b6760', marginBottom: 4 }}>Margin: <strong style={{ color: ACC }}>{((parseFloat(editingScanned.sale_price) - parseFloat(editingScanned.cost_price || 0)) / parseFloat(editingScanned.sale_price || 1) * 100).toFixed(1)}%</strong></div>
                <div style={{ color: '#999', fontSize: 11 }}>Profit per unit: {(parseFloat(editingScanned.sale_price) - parseFloat(editingScanned.cost_price || 0)).toFixed(2)}</div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={async () => {
                if (!editingScanned.sale_price || !staff) return
                setAddingProduct(true)
                try {
                  const res = await fetch(`${API}/api/pos/inventory`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'x-staff-id': staff.id, 'x-owner-id': staff.owner_id },
                    body: JSON.stringify({
                      name: editingScanned.name,
                      brand: editingScanned.brand || undefined,
                      category: editingScanned.category || undefined,
                      sku: editingScanned.sku || undefined,
                      supplier: editingScanned.supplier || undefined,
                      expiry_date: editingScanned.expiry_date || undefined,
                      batch_number: editingScanned.batch_number || undefined,
                      sale_price: parseFloat(editingScanned.sale_price),
                      cost_price: parseFloat(editingScanned.cost_price || '0'),
                      stock_qty: parseInt(editingScanned.stock_qty || '1'),
                      low_stock_threshold: 5,
                    })
                  })
                  const data = await res.json()
                  if (data.product) {
                    setItems(prev => [...prev, data.product])
                    setEditingScanned(null)
                  }
                } catch (err) {
                  console.error('Error:', err)
                }
                setAddingProduct(false)
              }} disabled={!editingScanned.sale_price || addingProduct} style={{ ...btnPrimary, flex: 1, opacity: !editingScanned.sale_price || addingProduct ? 0.5 : 1 }}>{addingProduct ? 'Adding...' : 'Add to inventory'}</button>
              <button onClick={() => setEditingScanned(null)} style={btnSecondary}>Cancel</button>
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
