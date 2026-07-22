'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { isInventoryLevel, isManagerOrAboveLevel } from '@/lib/pos-role-client'
import { useLang } from '@/components/LanguageProvider'
import { fetchInventory } from '@/lib/pos-inventory-fetch'
import { enqueueOfflineWrite, replayOfflineQueue, generateClientTxId, OfflineQueueQuotaError } from '@/lib/pos-offline-queue'

const inputStyle: React.CSSProperties = { padding: '9px 12px', borderRadius: 8, border: '1px solid var(--pos-border)', fontSize: 13, fontFamily: 'inherit', background: 'var(--pos-bg)', color: 'var(--pos-ink)' }
const btnPrimary: React.CSSProperties = { padding: '9px 16px', borderRadius: 8, background: 'var(--pos-accent)', color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }
const btnSecondary: React.CSSProperties = { padding: '9px 16px', borderRadius: 8, border: '1px solid var(--pos-border)', background: 'transparent', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--pos-muted)' }

const ACC = 'var(--pos-accent)'
const API = process.env.NEXT_PUBLIC_API_URL || ''
// Force redeploy

interface StaffSession { id: string; name: string; role: string; owner_id: string; currency_symbol?: string; location_id?: string }
interface InventoryItem {
  id: string; name: string; sale_price: number; stock_qty: number
  low_stock_threshold: number; last_sold_at: string | null; unit?: string
  expiry_date?: string | null; batch_number?: string | null; supplier?: string | null; brand?: string | null; category?: string | null
}

export default function InventoryPage() {
  const router = useRouter()
  const { tc } = useLang()
  const [staff, setStaff]         = useState<StaffSession | null>(null)
  const [sym, setSym]             = useState('£')
  const [items, setItems]         = useState<InventoryItem[]>([])
  const [loading, setLoading]     = useState(true)
  const [restocking, setRestocking] = useState<string | null>(null)
  const [restockQty, setRestockQty] = useState('')
  const [restockError, setRestockError] = useState('')
  const [updateMode, setUpdateMode] = useState<'add' | 'set'>('add')
  const [filter, setFilter]       = useState<'all' | 'low' | 'out' | 'expiring'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Daily AI business brief — manager+ only
  const [brief, setBrief] = useState<{ improved: string; worsened: string; action: string } | null>(null)
  const [briefDismissed, setBriefDismissed] = useState(false)

  // Camera (old single-photo)
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

  // Dual-photo scan
  const [showScanModal, setShowScanModal]     = useState(false)
  const [scanFront, setScanFront]             = useState<string | null>(null)
  const [scanBack, setScanBack]               = useState<string | null>(null)
  const [scanFrontThumb, setScanFrontThumb]   = useState<string | null>(null)
  const [scanBackThumb, setScanBackThumb]     = useState<string | null>(null)
  const [scanning, setScanning]               = useState(false)
  const [scanStep, setScanStep]               = useState<'front' | 'back' | null>(null)
  const [scanCameraOpen, setScanCameraOpen]   = useState(false)
  const [scannedProduct, setScannedProduct]   = useState<any | null>(null)  // pre-filled form data
  const [addForm, setAddForm]                 = useState({ name: '', sale_price: '', cost_price: '', stock_qty: '', low_stock_threshold: '5', category: '', sku: '', expiry_date: '', batch_number: '', supplier: '', brand: '', unit: 'item' })
  const [showAddForm, setShowAddForm]         = useState(false)
  const [savingNew, setSavingNew]             = useState(false)
  const scanFrontRef  = useRef<HTMLInputElement>(null)
  const scanBackRef   = useRef<HTMLInputElement>(null)
  const scanVideoRef  = useRef<HTMLVideoElement>(null)
  const scanCanvasRef = useRef<HTMLCanvasElement>(null)
  const scanStreamRef = useRef<MediaStream | null>(null)

  // Inline error states — replaces alert() calls
  const [cameraError, setCameraError] = useState('')
  const [scanError,   setScanError]   = useState('')
  const [saveError,   setSaveError]   = useState('')

  useEffect(() => {
    if (scanCameraOpen && scanVideoRef.current && scanStreamRef.current) {
      scanVideoRef.current.srcObject = scanStreamRef.current
      scanVideoRef.current.play().catch(() => {})
    }
  }, [scanCameraOpen])

  useEffect(() => {
    const session = localStorage.getItem('pos_staff')
    if (!session) { router.push('/'); return }
    const s = JSON.parse(session) as StaffSession
    if (!isInventoryLevel(s.role) && !isManagerOrAboveLevel(s.role)) { router.push('/sell'); return }
    setStaff(s)
    setSym(s.currency_symbol || '£')
    loadInventory(s)
    // Fetch fresh currency from owner profile
    fetch(`${API}/api/pos/config`, {
      headers: { 'x-owner-id': s.owner_id, 'x-staff-id': s.id },
    }).then(r => r.json()).then(cfg => {
      if (cfg.currency_symbol) setSym(cfg.currency_symbol)
    }).catch(() => {})
  }, [])

  // Replay any offline-queued restocks/edits on mount and when connectivity
  // returns — mirrors the pattern already proven on /sell and /logistics/intake.
  useEffect(() => {
    if (!staff) return
    const replay = () => replayOfflineQueue(staff.owner_id, staff.id).then(() => loadInventory(staff)).catch(() => {})
    replay()
    window.addEventListener('online', replay)
    return () => window.removeEventListener('online', replay)
  }, [staff])

  const posHeaders = (s: StaffSession) => ({
    'x-staff-id': s.id,
    'x-owner-id': s.owner_id,
  })

  // Daily brief is manager+ business content — fetch once staff is known and gated.
  useEffect(() => {
    if (!staff || !isManagerOrAboveLevel(staff.role)) return
    fetch(`${API}/api/daily-brief`, { headers: posHeaders(staff) })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.brief) setBrief(data.brief) })
      .catch(() => {})
  }, [staff])

  const loadInventory = async (s?: StaffSession) => {
    const session = s || staff
    if (!session) return
    setLoading(true)
    try {
      const data = await fetchInventory({ ownerId: session.owner_id, staffId: session.id, locationId: session.location_id })
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
    } catch { setCameraError(tc('inventory.err_camera_access')) }
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
    if (!staff) return
    setRecognizing(true)
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve((reader.result as string).split(',')[1])
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      const res = await fetch(`${API}/api/pos/recognize-inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...posHeaders(staff) },
        body: JSON.stringify({ image: base64 }),
      })
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

  // ── Dual-photo scan helpers ──────────────────────────────────
  // Resize image to max dimension and compress, return base64 (no prefix)
  const fileToBase64 = (file: File, maxDim = 1200, quality = 0.75): Promise<string> =>
    new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        let w = img.width, h = img.height
        if (w > maxDim || h > maxDim) {
          if (w > h) { h = Math.round(h * maxDim / w); w = maxDim }
          else       { w = Math.round(w * maxDim / h); h = maxDim }
        }
        const canvas = document.createElement('canvas')
        canvas.width = w; canvas.height = h
        canvas.getContext('2d')!.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', quality).split(',')[1])
      }
      img.onerror = reject
      img.src = URL.createObjectURL(file)
    })
  // Small thumbnail for preview
  const fileToThumb = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
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

  const handleScanFile = async (file: File, slot: 'front' | 'back') => {
    const [b64, thumb] = await Promise.all([fileToBase64(file), fileToThumb(file)])
    if (slot === 'front') { setScanFront(b64); setScanFrontThumb(thumb) }
    else                  { setScanBack(b64);  setScanBackThumb(thumb)  }
  }

  const openScanCamera = async (slot: 'front' | 'back') => {
    setScanStep(slot); setScanCameraOpen(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      scanStreamRef.current = stream
      if (scanVideoRef.current) scanVideoRef.current.srcObject = stream
    } catch { setCameraError(tc('inventory.err_camera_denied')); setScanCameraOpen(false) }
  }

  const closeScanCamera = () => {
    if (scanStreamRef.current) { scanStreamRef.current.getTracks().forEach(t => t.stop()); scanStreamRef.current = null }
    setScanCameraOpen(false)
  }

  const captureScanPhoto = () => {
    if (!scanVideoRef.current || !scanCanvasRef.current || !scanStep) return
    // Resize to max 1200px to stay within Vercel's 4.5MB body limit
    const vw = scanVideoRef.current.videoWidth
    const vh = scanVideoRef.current.videoHeight
    if (vw === 0 || vh === 0) { setCameraError(tc('inventory.err_camera_not_ready')); return }
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
      // scan captured
      await handleScanFile(new File([blob], 'scan.jpg', { type: 'image/jpeg' }), scanStep)
      closeScanCamera()
    }, 'image/jpeg', 0.75)
  }

  const runFullScan = async () => {
    if (!scanFront || !staff) return
    setScanning(true)
    try {
      const body: any = { front: scanFront }
      if (scanBack) body.back = scanBack
      const res = await fetch(`${API}/api/pos/scan-product-full`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-staff-id': staff.id, 'x-owner-id': staff.owner_id },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!data.product) { setScanError(data.error || tc('inventory.err_scan_read')); setScanning(false); return }
      const p = data.product
      setAddForm({
        name:                p.name         || '',
        sale_price:          p.sale_price != null ? String(p.sale_price) : '',
        cost_price:          '',
        stock_qty:           '',
        low_stock_threshold: '5',
        category:            p.category     || '',
        sku:                 p.sku          || '',
        expiry_date:         p.expiry_date  || '',
        batch_number:        p.batch_number || '',
        supplier:            p.supplier     || '',
        brand:               p.brand        || '',
        unit:                p.unit         || 'item',
      })
      setShowScanModal(false)
      setShowAddForm(true)
      setScanFront(null); setScanBack(null); setScanFrontThumb(null); setScanBackThumb(null)
    } catch { setScanError(tc('inventory.err_scan_failed')) }
    setScanning(false)
  }

  const saveNewProduct = async () => {
    if (!staff || !addForm.name || !addForm.sale_price) return
    setSavingNew(true)
    try {
      const res = await fetch(`${API}/api/pos/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-staff-id': staff.id, 'x-owner-id': staff.owner_id },
        body: JSON.stringify({
          name: addForm.name,
          sale_price: parseFloat(addForm.sale_price),
          cost_price: parseFloat(addForm.cost_price || '0'),
          stock_qty: parseInt(addForm.stock_qty || '0'),
          low_stock_threshold: parseInt(addForm.low_stock_threshold || '5'),
          category: addForm.category || null,
          sku: addForm.sku || null,
          expiry_date: addForm.expiry_date || null,
          batch_number: addForm.batch_number || null,
          supplier: addForm.supplier || null,
          brand: addForm.brand || null,
          unit: addForm.unit || 'item',
          // Tag NEW products as 'retail' so they stay isolated from other sectors.
          // NOTE: the GET above is intentionally NOT filtered by ?sector=retail —
          // existing untagged items must remain visible so the owner isn't surprised
          // by items disappearing. Only newly-created items get tagged going forward.
          sector: 'retail',
        }),
      })
      const data = await res.json()
      if (data.product) {
        setItems(prev => [...prev, data.product])
        setShowAddForm(false)
        setAddForm({ name: '', sale_price: '', cost_price: '', stock_qty: '', low_stock_threshold: '5', category: '', sku: '', expiry_date: '', batch_number: '', supplier: '', brand: '', unit: 'item' })
      } else { setSaveError(data.error || tc('inventory.err_save_failed_inputs')) }
    } catch { setSaveError(tc('inventory.err_save_failed_connection')) }
    setSavingNew(false)
  }
  // ────────────────────────────────────────────────────────────

  const handleRestock = async (item: InventoryItem) => {
    if (!restockQty || !staff) return
    const qty = parseFloat(restockQty)
    if (isNaN(qty) || qty < 0) return
    setRestockError('')

    // 'add' is a cumulative increment — send restock_qty so the server
    // applies it atomically (increment_inventory_stock RPC) instead of a
    // client-computed absolute value, which would race against any other
    // device's concurrent restock of the same item. 'set' is a direct
    // override to a specific value, which is correctly a plain field-set.
    const clientTxId = generateClientTxId(updateMode === 'add' ? 'restock' : 'stockset')
    const body = updateMode === 'add'
      ? { id: item.id, restock_qty: qty, client_tx_id: clientTxId }
      : { id: item.id, stock_qty: qty, client_tx_id: clientTxId }
    const newQty = updateMode === 'add' ? item.stock_qty + qty : qty

    try {
      const res = await fetch(`${API}/api/pos/inventory`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...posHeaders(staff) },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setRestockError(data.error || tc('inventory.err_save_failed_inputs'))
        return
      }
    } catch {
      // Network failure — queue for replay when back online. The optimistic
      // local update below already reflects the intended end state.
      try {
        await enqueueOfflineWrite({
          client_tx_id: clientTxId, owner_id: staff.owner_id, staff_id: staff.id,
          endpoint: '/api/pos/inventory', method: 'PATCH', body, created_at: new Date().toISOString(),
        })
      } catch (queueErr) {
        setRestockError(queueErr instanceof OfflineQueueQuotaError ? queueErr.message : tc('inventory.err_save_failed_connection'))
        return
      }
    }
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, stock_qty: newQty } : i))
    setRestocking(null); setRestockQty('')
  }

  const todayMs = new Date().setHours(0,0,0,0)
  const filtered = items.filter(i => {
    if (filter === 'out') return i.stock_qty === 0
    if (filter === 'low') return i.stock_qty > 0 && i.stock_qty <= i.low_stock_threshold
    if (filter === 'expiring') {
      if (!i.expiry_date) return false
      const days = Math.floor((new Date(i.expiry_date).getTime() - todayMs) / 86400000)
      return days <= 30
    }
    return true
  }).filter(i =>
    !searchQuery.trim() || i.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  )

  const outCount      = items.filter(i => i.stock_qty === 0).length
  const lowCount      = items.filter(i => i.stock_qty > 0 && i.stock_qty <= i.low_stock_threshold).length
  const expiredCount  = items.filter(i => i.expiry_date && new Date(i.expiry_date).getTime() < todayMs).length
  const expiringCount = items.filter(i => {
    if (!i.expiry_date) return false
    const d = Math.floor((new Date(i.expiry_date).getTime() - todayMs) / 86400000)
    return d >= 0 && d <= 30
  }).length

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pos-muted)', fontSize: 14 }}>
      {tc('inventory.loading')}
    </div>
  )

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: 'var(--pos-bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--pos-ink)' }}>{tc('inventory.title')}</div>
          <div style={{ fontSize: 12, color: 'var(--pos-muted)' }}>{staff?.name}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {/* Hidden file inputs for dual-photo scan */}
          <input ref={scanFrontRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) handleScanFile(e.target.files[0], 'front') }} />
          <input ref={scanBackRef}  type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) handleScanFile(e.target.files[0], 'back')  }} />

          <button onClick={() => { setShowScanModal(true); setScanFront(null); setScanBack(null); setScanFrontThumb(null); setScanBackThumb(null) }}
            style={{ padding: '6px 14px', borderRadius: 8, background: '#7c3aed', color: '#fff', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            {tc('inventory.add_product_button')}
          </button>

          <button onClick={() => { localStorage.removeItem('pos_staff'); router.push('/') }}
            style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid var(--pos-border)', background: 'transparent', fontSize: 12, cursor: 'pointer', color: 'var(--pos-muted)' }}>
            {tc('inventory.sign_out')}
          </button>
        </div>
      </div>

      {/* Daily AI business brief — manager+ only */}
      {brief && !briefDismissed && (
        <div style={{ margin: '8px 20px', padding: '14px 16px', borderRadius: 12, background: 'var(--pos-surface)', border: '1px solid var(--pos-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--pos-muted)', textTransform: 'uppercase', letterSpacing: 0.4 }}>
              {tc('inventory.daily_brief_title')}
            </div>
            <button onClick={() => setBriefDismissed(true)}
              style={{ background: 'none', border: 'none', color: 'var(--pos-muted)', fontSize: 14, cursor: 'pointer', lineHeight: 1 }}>
              ×
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, color: 'var(--pos-ink)' }}>
            {brief.improved && <div>✅ {brief.improved}</div>}
            {brief.worsened && <div>⚠️ {brief.worsened}</div>}
            {brief.action && <div style={{ fontWeight: 600 }}>→ {brief.action}</div>}
          </div>
        </div>
      )}

      {/* Alert summary */}
      {(outCount > 0 || lowCount > 0 || expiredCount > 0 || expiringCount > 0) && (
        <div className="pos-banner" role="alert" style={{ margin: '8px 20px', padding: '12px 16px', borderRadius: 12, background: 'rgba(220,38,38,.06)', border: '1px solid rgba(220,38,38,.2)' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--pos-danger)', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {outCount > 0 && <span>{tc('inventory.alert_out_of_stock', { count: outCount })}</span>}
            {lowCount > 0 && <span style={{ color: '#ca8a04' }}>{tc('inventory.alert_running_low', { count: lowCount })}</span>}
            {expiredCount > 0 && <span style={{ color: 'var(--pos-danger)' }}>{tc('inventory.alert_expired', { count: expiredCount })}</span>}
            {expiringCount > 0 && <span style={{ color: 'var(--pos-warning)' }}>{tc('inventory.alert_expiring', { count: expiringCount })}</span>}
          </div>
        </div>
      )}

      {/* ── Dual-photo scan modal ── */}
      {showScanModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '0 0 0' }} onClick={() => !scanning && setShowScanModal(false)}>
          <div className="pos-sheet" style={{ background: 'var(--pos-surface)', borderRadius: '20px 20px 0 0', padding: 24, width: '100%', maxWidth: 500, maxHeight: '92vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 36, height: 4, borderRadius: 9999, background: 'var(--pos-border)', margin: '0 auto 20px' }} />

            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--pos-ink)', marginBottom: 4 }}>{tc('inventory.scan_title')}</div>
            <div style={{ fontSize: 13, color: 'var(--pos-muted)', marginBottom: 20 }}>
              {tc('inventory.scan_subtitle_front')}<br/>
              {tc('inventory.scan_subtitle_back')}
            </div>

            {/* Photo slots */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              {/* Front */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--pos-muted)', marginBottom: 8, textTransform: 'uppercase' }}>{tc('inventory.scan_front_label')} <span style={{ color: '#ef4444' }}>*</span></div>
                {scanFrontThumb ? (
                  <div style={{ position: 'relative' }}>
                    <img src={scanFrontThumb} alt="" style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', borderRadius: 12, border: '2.5px solid #7c3aed' }} />
                    <button onClick={() => { setScanFront(null); setScanFrontThumb(null) }} style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: 999, background: 'rgba(0,0,0,.55)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14 }}>×</button>
                    <div style={{ position: 'absolute', bottom: 6, left: 6, fontSize: 10, fontWeight: 700, background: '#7c3aed', color: '#fff', padding: '2px 7px', borderRadius: 999 }}>✓ FRONT</div>
                  </div>
                ) : (
                  <div style={{ aspectRatio: '3/4', borderRadius: 12, border: '2px dashed #e5e2dc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'var(--pos-bg)' }}>
                    <div style={{ fontSize: 26 }}>📦</div>
                    <div style={{ fontSize: 11, color: 'var(--pos-hint)', textAlign: 'center', padding: '0 8px' }}>{tc('inventory.scan_front_hint')}</div>
                    <button onClick={() => openScanCamera('front')} style={{ padding: '6px 14px', borderRadius: 8, background: '#7c3aed', color: '#fff', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>{tc('inventory.camera_button')}</button>
                    <button onClick={() => scanFrontRef.current?.click()} style={{ padding: '5px 14px', borderRadius: 8, border: '1px solid var(--pos-border)', background: 'transparent', fontSize: 12, cursor: 'pointer', color: 'var(--pos-muted)' }}>{tc('inventory.upload_button')}</button>
                  </div>
                )}
              </div>
              {/* Back */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--pos-muted)', marginBottom: 8, textTransform: 'uppercase' }}>{tc('inventory.scan_back_label')} <span style={{ color: 'var(--pos-hint)', fontWeight: 400 }}>{tc('inventory.scan_optional')}</span></div>
                {scanBackThumb ? (
                  <div style={{ position: 'relative' }}>
                    <img src={scanBackThumb} alt="" style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', borderRadius: 12, border: '2.5px solid #0891b2' }} />
                    <button onClick={() => { setScanBack(null); setScanBackThumb(null) }} style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: 999, background: 'rgba(0,0,0,.55)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14 }}>×</button>
                    <div style={{ position: 'absolute', bottom: 6, left: 6, fontSize: 10, fontWeight: 700, background: '#0891b2', color: '#fff', padding: '2px 7px', borderRadius: 999 }}>✓ BACK</div>
                  </div>
                ) : (
                  <div style={{ aspectRatio: '3/4', borderRadius: 12, border: '2px dashed #e5e2dc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'var(--pos-bg)' }}>
                    <div style={{ fontSize: 26 }}>🏷️</div>
                    <div style={{ fontSize: 11, color: 'var(--pos-hint)', textAlign: 'center', padding: '0 8px' }}>{tc('inventory.scan_back_hint')}</div>
                    <button onClick={() => openScanCamera('back')} style={{ padding: '6px 14px', borderRadius: 8, background: '#0891b2', color: '#fff', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>{tc('inventory.camera_button')}</button>
                    <button onClick={() => scanBackRef.current?.click()} style={{ padding: '5px 14px', borderRadius: 8, border: '1px solid var(--pos-border)', background: 'transparent', fontSize: 12, cursor: 'pointer', color: 'var(--pos-muted)' }}>{tc('inventory.upload_button')}</button>
                  </div>
                )}
              </div>
            </div>

            <button onClick={runFullScan} disabled={!scanFront || scanning} className="pos-btn-primary"
              style={{ width: '100%', padding: '15px', borderRadius: 14, background: scanFront ? '#7c3aed' : 'var(--pos-border)', color: scanFront ? '#fff' : 'var(--pos-hint)', border: 'none', fontSize: 15, fontWeight: 800, cursor: scanFront ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>
              {scanning ? tc('inventory.scan_reading') : scanFront ? (scanBack ? tc('inventory.scan_fill_both') : tc('inventory.scan_fill_front')) : tc('inventory.scan_take_front_first')}
            </button>
            {scanFront && !scanBack && (
              <div style={{ fontSize: 11, color: 'var(--pos-hint)', textAlign: 'center', marginTop: 8 }}>{tc('inventory.scan_add_back_hint')}</div>
            )}
            {(scanError || cameraError) && (
              <div className="pos-banner" role="alert" style={{ marginTop: 12, padding: '10px 14px', borderRadius: 8, background: 'rgba(220,38,38,.06)', border: '1px solid rgba(220,38,38,.2)', fontSize: 13, color: 'var(--pos-danger)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <span>{scanError || cameraError}</span>
                <button onClick={() => { setScanError(''); setCameraError('') }} aria-label={tc('inventory.dismiss')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pos-danger)', fontSize: 16, lineHeight: 1, padding: '0 2px' }}>×</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── In-app camera for scan ── */}
      {scanCameraOpen && (
        <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: '#fff', fontSize: 13, fontWeight: 600, marginBottom: 10, opacity: 0.8 }}>
            {scanStep === 'front' ? tc('inventory.scan_camera_front') : tc('inventory.scan_camera_back')}
          </div>
          <video ref={scanVideoRef} autoPlay playsInline style={{ width: '100%', maxWidth: 500, border: `3px solid ${scanStep === 'front' ? '#7c3aed' : '#0891b2'}` }} />
          <canvas ref={scanCanvasRef} style={{ display: 'none' }} />
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <button onClick={captureScanPhoto} style={{ padding: '13px 28px', borderRadius: 12, background: scanStep === 'front' ? '#7c3aed' : '#0891b2', color: '#fff', border: 'none', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>{tc('inventory.capture_button')}</button>
            <button onClick={closeScanCamera} style={{ padding: '13px 20px', borderRadius: 12, border: '1px solid rgba(255,255,255,.3)', background: 'transparent', color: '#fff', fontSize: 14, cursor: 'pointer' }}>{tc('inventory.cancel')}</button>
          </div>
        </div>
      )}

      {/* ── Add product form (pre-filled by scan or manual) ── */}
      {showAddForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={() => !savingNew && setShowAddForm(false)}>
          <div className="pos-sheet" style={{ background: 'var(--pos-surface)', borderRadius: '20px 20px 0 0', padding: 24, width: '100%', maxWidth: 500, maxHeight: '92vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 36, height: 4, borderRadius: 9999, background: 'var(--pos-border)', margin: '0 auto 16px' }} />
            <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--pos-ink)', marginBottom: 16 }}>{tc('inventory.add_product_title')}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input placeholder={tc('inventory.ph_product_name_required')} value={addForm.name} onChange={e => setAddForm(p => ({ ...p, name: e.target.value }))} style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <input placeholder={tc('inventory.ph_sale_price_required')} type="number" value={addForm.sale_price} onChange={e => setAddForm(p => ({ ...p, sale_price: e.target.value }))} style={inputStyle} />
                <input placeholder={tc('inventory.ph_cost_price')} type="number" value={addForm.cost_price} onChange={e => setAddForm(p => ({ ...p, cost_price: e.target.value }))} style={inputStyle} />
                <input placeholder={tc('inventory.ph_starting_qty')} type="number" value={addForm.stock_qty} onChange={e => setAddForm(p => ({ ...p, stock_qty: e.target.value }))} style={inputStyle} />
                <input placeholder={tc('inventory.ph_low_stock_at')} type="number" value={addForm.low_stock_threshold} onChange={e => setAddForm(p => ({ ...p, low_stock_threshold: e.target.value }))} style={inputStyle} />
                <input placeholder={tc('inventory.ph_brand')} value={addForm.brand} onChange={e => setAddForm(p => ({ ...p, brand: e.target.value }))} style={inputStyle} />
                <input placeholder={tc('inventory.ph_supplier')} value={addForm.supplier} onChange={e => setAddForm(p => ({ ...p, supplier: e.target.value }))} style={inputStyle} />
                <input placeholder={tc('inventory.ph_category')} value={addForm.category} onChange={e => setAddForm(p => ({ ...p, category: e.target.value }))} style={inputStyle} />
                <input placeholder={tc('inventory.ph_sku_barcode')} value={addForm.sku} onChange={e => setAddForm(p => ({ ...p, sku: e.target.value }))} style={inputStyle} />
                <input placeholder={tc('inventory.ph_batch_lot')} value={addForm.batch_number} onChange={e => setAddForm(p => ({ ...p, batch_number: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'var(--pos-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>{tc('inventory.expiry_date_label')}</label>
                <input type="date" value={addForm.expiry_date} onChange={e => setAddForm(p => ({ ...p, expiry_date: e.target.value }))} style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }} />
              </div>
              <select value={addForm.unit} onChange={e => setAddForm(p => ({ ...p, unit: e.target.value }))} style={{ ...inputStyle, width: '100%' }}>
                <option value="item">{tc('inventory.unit_item')}</option>
                <option value="kg">{tc('inventory.unit_kg')}</option>
                <option value="litre">{tc('inventory.unit_litre')}</option>
                <option value="pack">{tc('inventory.unit_pack')}</option>
                <option value="box">{tc('inventory.unit_box')}</option>
              </select>
            </div>
            {saveError && (
              <div className="pos-banner" role="alert" style={{ marginTop: 12, padding: '10px 14px', borderRadius: 8, background: 'rgba(220,38,38,.06)', border: '1px solid rgba(220,38,38,.2)', fontSize: 13, color: 'var(--pos-danger)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <span>{saveError}</span>
                <button onClick={() => setSaveError('')} aria-label={tc('inventory.dismiss')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pos-danger)', fontSize: 16, lineHeight: 1, padding: '0 2px' }}>×</button>
              </div>
            )}
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button onClick={saveNewProduct} disabled={!addForm.name || !addForm.sale_price || savingNew} className="pos-btn-primary"
                style={{ ...btnPrimary, flex: 1, opacity: !addForm.name || !addForm.sale_price || savingNew ? 0.5 : 1 }}>
                {savingNew ? tc('inventory.saving') : tc('inventory.add_to_inventory')}
              </button>
              <button onClick={() => setShowAddForm(false)} style={btnSecondary}>{tc('inventory.cancel')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Camera preview modal */}
      {showCameraPreview && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.9)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxWidth: 600, borderRadius: 12, marginBottom: 16 }} />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={handleCapturePhoto} disabled={recognizing} style={{ ...btnPrimary, padding: '12px 28px', fontSize: 14, fontWeight: 700 }}>{recognizing ? tc('inventory.processing') : tc('inventory.capture_photo')}</button>
            <button onClick={handleCloseCamera} disabled={recognizing} style={{ padding: '12px 28px', borderRadius: 10, border: '1px solid rgba(255,255,255,.3)', background: 'transparent', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>{tc('inventory.cancel')}</button>
          </div>
        </div>
      )}

      {/* Edit modal for recognized products */}
      {editingRecognizedIndex !== null && recognizedProducts.length > 0 && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 99, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setEditingRecognizedIndex(null)}>
          <div className="pos-sheet" style={{ background: 'var(--pos-surface)', borderRadius: 16, padding: 24, maxWidth: 500, width: '100%', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--pos-ink)', marginBottom: 20, marginTop: 0 }}>{tc('inventory.edit_product_title')}</h3>

            {/* Product name (editable) */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--pos-muted)', marginBottom: 6 }}>{tc('inventory.product_name_label')}</label>
              <input type="text" value={editingRecognizedData.name || ''} onChange={(e) => setEditingRecognizedData({ ...editingRecognizedData, name: e.target.value })} style={{ ...inputStyle, width: '100%' }} placeholder={tc('inventory.ph_enter_product_name')} />
            </div>

            {/* SKU / Barcode */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--pos-muted)', marginBottom: 6 }}>{tc('inventory.sku_barcode_label')} {editingRecognizedData.barcode_number ? tc('inventory.auto_detected') : ''}</label>
              <input type="text" placeholder={tc('inventory.ph_barcode_example')} value={editingRecognizedData.sku || editingRecognizedData.barcode_number || ''} onChange={(e) => setEditingRecognizedData({ ...editingRecognizedData, sku: e.target.value })} style={{ ...inputStyle, width: '100%' }} />
              {editingRecognizedData.barcode_detected && <div style={{ fontSize: 11, color: 'var(--pos-accent)', marginTop: 4 }}>{tc('inventory.barcode_detected')}</div>}
            </div>

            {/* Cost price */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--pos-muted)', marginBottom: 6 }}>{tc('inventory.cost_price_label')}</label>
              <input type="number" placeholder={tc('inventory.ph_price_zero')} value={editingRecognizedData.cost_price || ''} onChange={(e) => setEditingRecognizedData({ ...editingRecognizedData, cost_price: e.target.value })} style={{ ...inputStyle, width: '100%' }} step="0.01" />
            </div>

            {/* Sale price */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--pos-muted)', marginBottom: 6 }}>{tc('inventory.sale_price_label')}</label>
              <input type="number" placeholder={tc('inventory.ph_price_zero')} value={editingRecognizedData.sale_price || ''} onChange={(e) => setEditingRecognizedData({ ...editingRecognizedData, sale_price: e.target.value })} style={{ ...inputStyle, width: '100%' }} step="0.01" />
            </div>

            {/* Quantity */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--pos-muted)', marginBottom: 6 }}>
                {editingRecognizedData.unit === 'kg' ? tc('inventory.starting_stock_label_kg') : tc('inventory.starting_stock_label')}
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="number" value={editingRecognizedData.stock_qty || 1} onChange={(e) => setEditingRecognizedData({ ...editingRecognizedData, stock_qty: e.target.value })} style={{ ...inputStyle, flex: 1 }} min="0" step={editingRecognizedData.unit === 'kg' ? '0.1' : '1'} />
                {editingRecognizedData.unit === 'kg' && (
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--pos-accent)', background: 'rgba(208,138,89,.1)', padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(208,138,89,.2)', whiteSpace: 'nowrap' }}>{tc('inventory.unit_kg')}</span>
                )}
              </div>
            </div>

            {/* Margin preview */}
            {editingRecognizedData.cost_price && editingRecognizedData.sale_price && (
              <div style={{ background: '#f0f0f0', padding: 12, borderRadius: 8, marginBottom: 20, fontSize: 12 }}>
                <div style={{ color: 'var(--pos-muted)', marginBottom: 4 }}>{tc('inventory.margin_label')} <strong style={{ color: 'var(--pos-accent)' }}>{((parseFloat(editingRecognizedData.sale_price) - parseFloat(editingRecognizedData.cost_price || 0)) / parseFloat(editingRecognizedData.sale_price || 1) * 100).toFixed(1)}%</strong></div>
                <div style={{ color: '#999', fontSize: 11 }}>{tc('inventory.profit_per_unit', { amount: (parseFloat(editingRecognizedData.sale_price) - parseFloat(editingRecognizedData.cost_price || 0)).toFixed(2) })}</div>
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
                    headers: { 'Content-Type': 'application/json', ...(staff ? posHeaders(staff) : {}) },
                    body: JSON.stringify({
                      name: editingRecognizedData.name,
                      sale_price: parseFloat(editingRecognizedData.sale_price),
                      cost_price: parseFloat(editingRecognizedData.cost_price || '0'),
                      stock_qty: parseFloat(editingRecognizedData.stock_qty || '1'),
                      unit: editingRecognizedData.unit || 'item',
                      low_stock_threshold: 5,
                      // Tag NEW products as 'retail' (see saveNewProduct note). GET stays unfiltered.
                      sector: 'retail'
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
              }} disabled={!editingRecognizedData.sale_price || addingProduct} className="pos-btn-primary" style={{ ...btnPrimary, flex: 1, opacity: !editingRecognizedData.sale_price || addingProduct ? 0.5 : 1 }}>{addingProduct ? tc('inventory.adding') : tc('inventory.add_to_inventory')}</button>
              <button onClick={() => { setEditingRecognizedIndex(null); setRecognizedProducts([]) }} style={btnSecondary}>{tc('inventory.done')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Search bar */}
      <div style={{ padding: '8px 20px 4px' }}>
        <div style={{ position: 'relative' }}>
          <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke='var(--pos-ink)' strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={tc('inventory.ph_search_products')}
            style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: 10, border: '1.5px solid var(--pos-border)', fontSize: 14, fontFamily: 'inherit', background: 'var(--pos-surface)', color: 'var(--pos-ink)', boxSizing: 'border-box' }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--pos-hint)', padding: 2 }}>×</button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, padding: '12px 20px', flexWrap: 'wrap' }}>
        {([
          ['all', tc('inventory.filter_all', { count: items.length }), ACC],
          ['low', tc('inventory.filter_low', { count: lowCount }), '#ca8a04'],
          ['out', tc('inventory.filter_out', { count: outCount }), 'var(--pos-danger)'],
          ['expiring', tc('inventory.filter_expiring', { count: expiredCount + expiringCount }), 'var(--pos-warning)'],
        ] as [typeof filter, string, string][]).map(([f, label, color]) => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 14px', borderRadius: 9999, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: filter === f ? color : '#fff', color: filter === f ? '#fff' : 'var(--pos-muted)', border: filter === f ? 'none' : '1px solid #e5e2dc' } as React.CSSProperties}>
            {label}
          </button>
        ))}
      </div>

      {/* Inventory list */}
      <div style={{ flex: 1, padding: '4px 20px 32px', overflowY: 'auto' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--pos-muted)', fontSize: 14 }}>
            {tc('inventory.empty_filter')}
          </div>
        ) : (
          filtered.map((item, idx) => {
            const isOut = item.stock_qty === 0
            const isLow = !isOut && item.stock_qty <= item.low_stock_threshold
            const status = isOut ? { label: tc('inventory.status_Out'), color: 'var(--pos-danger)', bg: 'rgba(220,38,38,.08)' }
                         : isLow ? { label: tc('inventory.status_Low'), color: '#ca8a04', bg: 'rgba(234,179,8,.08)' }
                         :          { label: tc('inventory.status_OK'),  color: 'var(--pos-success)', bg: 'rgba(22,163,74,.08)' }
            const daysToExpiry = item.expiry_date ? Math.floor((new Date(item.expiry_date).getTime() - todayMs) / 86400000) : null
            const isExpired = daysToExpiry !== null && daysToExpiry < 0
            const isExpiringSoon = daysToExpiry !== null && daysToExpiry >= 0 && daysToExpiry <= 30

            return (
              <div key={item.id} className="pos-item" style={{ background: isExpired ? 'rgba(220,38,38,.04)' : '#fff', borderRadius: 14, border: `1px solid ${isExpired ? '#fca5a5' : 'var(--pos-border)'}`, marginBottom: 10, overflow: 'hidden', animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--pos-ink)', marginBottom: 2 }}>
                      {item.name}
                      {isExpired && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, color: 'var(--pos-danger)', background: 'rgba(220,38,38,.1)', padding: '2px 7px', borderRadius: 9999 }}>{tc('inventory.badge_expired')}</span>}
                      {isExpiringSoon && !isExpired && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, color: 'var(--pos-warning)', background: 'rgba(249,115,22,.1)', padding: '2px 7px', borderRadius: 9999 }}>{daysToExpiry === 0 ? tc('inventory.badge_exp_today') : tc('inventory.badge_exp_days', { days: daysToExpiry as number })}</span>}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--pos-muted)' }}>
                      {sym}{item.sale_price.toFixed(2)} · {item.stock_qty}{item.unit === 'kg' ? ' kg' : ''} {tc('inventory.in_stock_suffix')}
                      {item.expiry_date && <span style={{ marginLeft: 6, color: isExpired ? 'var(--pos-danger)' : isExpiringSoon ? 'var(--pos-warning)' : 'var(--pos-hint)' }}>{tc('inventory.exp_prefix', { date: new Date(item.expiry_date).toLocaleDateString('en-GB') })}</span>}
                    </div>
                    {(item.brand || item.supplier) && <div style={{ fontSize: 11, color: 'var(--pos-hint)', marginTop: 1 }}>{[item.brand, item.supplier].filter(Boolean).join(' · ')}</div>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: status.color, background: status.bg, padding: '3px 9px', borderRadius: 9999 }}>{status.label}</span>
                    <button onClick={() => { setRestocking(restocking === item.id ? null : item.id); setRestockQty(''); setUpdateMode('add'); setRestockError('') }}
                      style={{ padding: '7px 12px', borderRadius: 9, background: `rgba(208,138,89,.1)`, border: `1px solid rgba(208,138,89,.2)`, color: ACC, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                      {tc('inventory.update_stock_button')}
                    </button>
                  </div>
                </div>

                {restocking === item.id && (
                  <div style={{ padding: '0 16px 14px' }}>
                    {/* Add / Set toggle */}
                    <div style={{ display: 'flex', borderRadius: 9, overflow: 'hidden', border: '1.5px solid var(--pos-border)', marginBottom: 10, background: 'var(--pos-bg)' }}>
                      {(['add', 'set'] as const).map(mode => (
                        <button key={mode} onClick={() => { setUpdateMode(mode); setRestockQty('') }}
                          style={{ flex: 1, padding: '8px', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', background: updateMode === mode ? ACC : 'transparent', color: updateMode === mode ? '#fff' : 'var(--pos-muted)', transition: 'all 0.15s' }}>
                          {mode === 'add' ? tc('inventory.mode_add') : tc('inventory.mode_set')}
                        </button>
                      ))}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--pos-hint)', marginBottom: 8 }}>
                      {updateMode === 'add'
                        ? (item.unit === 'kg'
                            ? tc('inventory.add_preview_kg', { current: item.stock_qty, result: (item.stock_qty + (parseFloat(restockQty) || 0)).toFixed(2) })
                            : tc('inventory.add_preview', { current: item.stock_qty, result: (item.stock_qty + (parseFloat(restockQty) || 0)).toFixed(0) }))
                        : (item.unit === 'kg'
                            ? tc('inventory.set_preview_kg', { current: item.stock_qty })
                            : tc('inventory.set_preview', { current: item.stock_qty }))}
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <div style={{ flex: 1, position: 'relative' }}>
                        <input
                          type="number"
                          placeholder={updateMode === 'add' ? (item.unit === 'kg' ? tc('inventory.ph_qty_to_add_kg') : tc('inventory.ph_qty_to_add')) : (item.unit === 'kg' ? tc('inventory.ph_set_stock_to_kg') : tc('inventory.ph_set_stock_to'))}
                          value={restockQty}
                          onChange={e => setRestockQty(e.target.value)}
                          step={item.unit === 'kg' ? '0.1' : '1'}
                          min="0"
                          style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid var(--pos-border)', fontSize: 15, fontFamily: 'inherit', background: 'var(--pos-bg)', color: 'var(--pos-ink)', boxSizing: 'border-box' }}
                          autoFocus
                        />
                        {item.unit === 'kg' && (
                          <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 12, fontWeight: 700, color: 'var(--pos-accent)' }}>{tc('inventory.unit_kg')}</span>
                        )}
                      </div>
                      <button onClick={() => handleRestock(item)} style={{ padding: '10px 20px', borderRadius: 10, background: ACC, color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        {updateMode === 'add' ? tc('inventory.btn_add') : tc('inventory.btn_set')}
                      </button>
                    </div>
                    {restockError && (
                      <div style={{ marginTop: 8, fontSize: 12, color: 'var(--pos-danger)' }}>{restockError}</div>
                    )}
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
