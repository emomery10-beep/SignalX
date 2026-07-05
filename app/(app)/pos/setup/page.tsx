'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLang } from '@/components/LanguageProvider'
import { COUNTRY_DIAL, toE164, posSeatPrice } from '@/lib/geo'
import { speak } from '@/lib/speak'
import SpeakButton from '@/components/SpeakButton'

// ── AskBiz tokens (match onboarding) ──────────────────────────
const ACC = '#d08a59'
const TX  = '#1a1916'
const TX2 = '#6b6760'
const TX3 = '#a39e97'
const B   = 'rgba(0,0,0,.08)'
const B2  = 'rgba(0,0,0,.14)'
const SF  = '#ffffff'
const EV  = '#f3f2ef'
const BG  = '#f9f8f6'
const OK  = '#2e7d54'

type Item = { id: string; name: string; sale_price: number; stock_qty: number; image_url?: string | null }
type Draft = { id: string; name: string; role: string; phone?: string | null; email?: string | null }
type Screen = 'list' | 'capture' | 'import' | 'team' | 'team-add' | 'ready'

// An item on its way into the catalogue. Camera extraction fills name+price;
// a CSV import fills the richer fields too — all carried through to commit.
type ImportItem = {
  name: string
  sale_price: number
  cost_price?: number
  stock_qty?: number
  unit?: string
  category?: string
  sku?: string
}

// Minimal CSV reader — handles quoted fields, escaped "" quotes, and \r\n, so
// a product name or price containing a comma doesn't split into two columns.
function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = [], cur = '', inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++ } else inQuotes = false }
      else cur += c
    } else if (c === '"') { inQuotes = true }
    else if (c === ',') { row.push(cur); cur = '' }
    else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = '' }
    else if (c !== '\r') { cur += c }
  }
  if (cur !== '' || row.length) { row.push(cur); rows.push(row) }
  return rows.filter(r => r.some(c => c.trim() !== ''))
}

// Map a Loyverse "Export items" CSV onto ImportItems. Loyverse is the dominant
// free POS in these markets, so its export is the one worth supporting by name.
// Column matching is by header text (order-independent); the stock column is
// named after the store ("In stock (Mama's Shop)") so it's matched by prefix.
function mapLoyverseCsv(rows: string[][]): ImportItem[] {
  if (rows.length < 2) return []
  const header = rows[0].map(h => h.trim().toLowerCase())
  const find = (pred: (h: string) => boolean) => header.findIndex(pred)
  const iName   = find(h => h === 'name')
  if (iName < 0) return []   // not a recognisable item export
  const iPrice  = find(h => h === 'price')
  const iCost   = find(h => h === 'cost')
  const iCat    = find(h => h === 'category')
  const iSku    = find(h => h === 'sku')
  const iStock  = find(h => h.startsWith('in stock'))
  const iWeight = find(h => h.includes('sold by weight'))
  const num = (s: string) => { const n = parseFloat(String(s || '').replace(/[^\d.-]/g, '')); return isFinite(n) ? n : 0 }
  const out: ImportItem[] = []
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r]
    const name = (row[iName] || '').trim()
    if (!name) continue
    const weightVal = iWeight >= 0 ? String(row[iWeight] || '').trim().toLowerCase() : ''
    const byWeight = ['y', 'yes', '1', 'true', 'weight'].includes(weightVal)
    out.push({
      name,
      sale_price: iPrice  >= 0 ? num(row[iPrice]) : 0,
      cost_price: iCost   >= 0 ? num(row[iCost])  : 0,
      stock_qty:  iStock  >= 0 ? Math.max(0, num(row[iStock])) : 0,  // numeric(10,3): keep weight decimals
      unit:       byWeight ? 'kg' : 'item',
      category:   iCat >= 0 ? (row[iCat] || '').trim() : '',
      sku:        iSku >= 0 ? (row[iSku] || '').trim() : '',
    })
  }
  return out
}

// Business types that get the "add your team" step. market_stall (solo
// street vendor) is deliberately excluded — it stays items → pay.
const TEAM_STEP_TYPES = new Set(['retail', 'food_bev', 'salon'])

// Sound + haptic feedback — a channel beyond sight and text for users who
// can't lean on reading. Best-effort everywhere: silently no-ops when the
// device/browser doesn't support it.
const feedback = (kind: 'ok' | 'err') => {
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(kind === 'ok' ? 30 : [60, 40, 60])
    }
    const Ctx = window.AudioContext || (window as any).webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    gain.gain.value = 0.04
    if (kind === 'ok') {
      osc.frequency.value = 880
      osc.start()
      osc.frequency.setValueAtTime(1320, ctx.currentTime + 0.09)
      osc.stop(ctx.currentTime + 0.18)
    } else {
      osc.frequency.value = 220
      osc.start()
      osc.stop(ctx.currentTime + 0.25)
    }
    osc.onended = () => { ctx.close().catch(() => {}) }
  } catch { /* no-op */ }
}

export default function PosSetupPage() {
  const router = useRouter()
  const supabase = createClient()
  const { tc, lang } = useLang()

  const [screen, setScreen]     = useState<Screen>('list')
  const [items, setItems]       = useState<Item[]>([])
  const [loading, setLoading]   = useState(true)
  const [firstName, setFirstName] = useState('')
  const [currencySymbol, setCurrencySymbol] = useState('£')
  const [currency, setCurrency] = useState('GBP')
  const [bizType, setBizType]   = useState('')
  const [alreadyEnabled, setAlreadyEnabled] = useState(false)

  // Team (ghost staff) — built during setup, provisioned into real accounts
  // on payment. seats = 1 (owner/operator) + one per team member.
  const [drafts, setDrafts]     = useState<Draft[]>([])
  const [memberName, setMemberName]   = useState('')
  const [memberRole, setMemberRole]   = useState<'cashier' | 'inventory'>('cashier')
  const [memberMethod, setMemberMethod] = useState<'phone' | 'email'>('phone')
  const [memberCountry, setMemberCountry] = useState('KE')
  const [memberPhone, setMemberPhone] = useState('')
  const [memberEmail, setMemberEmail] = useState('')
  const [memberPin, setMemberPin]     = useState('')
  const [teamSaving, setTeamSaving]   = useState(false)
  const [teamError, setTeamError]     = useState('')
  const [paidSeats, setPaidSeats]     = useState(0)   // seats already paid for (0 = not paid yet)
  const [payingSeats, setPayingSeats] = useState(false)

  // Item being captured
  const [photo, setPhoto]       = useState<string | null>(null)
  const [name, setName]         = useState('')
  const [price, setPrice]       = useState('')
  const [qty, setQty]           = useState('')
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')
  const [aiNaming, setAiNaming] = useState(false)

  // Bulk import — bring a whole existing list in from ONE photo (wall/notebook
  // price list, another POS's item screen, an IG/TikTok shop grid) or a gallery
  // screenshot. Extraction is best-effort, so 'review' is always shown: the
  // vendor confirms/edits every line before it's saved.
  const [importPhase, setImportPhase] = useState<'camera' | 'review'>('camera')
  const [importItems, setImportItems] = useState<ImportItem[]>([])
  const [importBusy, setImportBusy]   = useState(false)
  const [importError, setImportError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const csvInputRef  = useRef<HTMLInputElement>(null)

  // Delete-with-undo: removal is a deactivation (PATCH active:false), so
  // "Undo" is a reactivation — never a destructive loss from a mis-tap.
  const [undoItem, setUndoItem] = useState<Item | null>(null)
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const videoRef  = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // ── Load profile + ensure a "Main" branch exists (idempotent) ──
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/signin'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, currency_symbol, currency, business_type, pos_enabled, pos_seat_count')
        .eq('id', user.id)
        .maybeSingle()

      if (cancelled) return
      if (profile?.full_name) setFirstName(profile.full_name.trim().split(/\s+/)[0] || '')
      if (profile?.currency_symbol) setCurrencySymbol(profile.currency_symbol)
      if (profile?.currency) setCurrency(profile.currency)
      if (profile?.business_type) setBizType(profile.business_type)
      if (profile?.pos_seat_count) setPaidSeats(Number(profile.pos_seat_count) || 0)
      const enabled = !!profile?.pos_enabled
      if (enabled) setAlreadyEnabled(true)

      // If already paid, run provisioning first (safety net — converts any
      // drafts covered by paid seats even if the webhook/activate-page missed
      // them). Then load whatever drafts remain (these are the pending ones).
      if (enabled) {
        try { await fetch('/api/pos/staff-draft/provision', { method: 'POST' }) } catch { /* idempotent, retried on next visit */ }
      }

      // Load existing team drafts (resume-safe).
      try {
        const res = await fetch('/api/pos/staff-draft')
        if (res.ok) { const d = await res.json(); if (!cancelled) setDrafts(d.drafts || []) }
      } catch { /* no drafts yet is the expected first-run state */ }

      // Ensure a default branch. The locations POST is idempotent on
      // (owner_id, name) — a 409 just means it already exists, which is fine.
      try {
        await fetch('/api/pos/locations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'Main' }),
        })
      } catch { /* non-fatal — the sell flow re-checks branches later */ }

      // Load whatever items already exist (so a resumed setup shows progress).
      try {
        const res = await fetch('/api/pos/inventory?limit=200')
        if (res.ok) {
          const d = await res.json()
          if (!cancelled) setItems((d.inventory || []).map((p: any) => ({ id: p.id, name: p.name, sale_price: p.sale_price, stock_qty: p.stock_qty, image_url: p.image_url || null })))
        }
      } catch { /* empty catalogue is the expected first-run state */ }

      if (!cancelled) setLoading(false)
    })()
    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Camera ────────────────────────────────────────────────────
  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
  }, [])

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play() }
    } catch {
      // No camera / denied — the flow still works without a photo.
    }
  }, [])

  const openCapture = async () => {
    setPhoto(null); setName(''); setPrice(''); setQty(''); setError('')
    setScreen('capture')
    await startCamera()
  }

  // Camera-first naming: after the photo, ask the vision endpoint what the
  // item is and pre-fill name/price — the vendor confirms instead of typing.
  // Only fills fields still empty (never overwrites what they typed), and
  // fails silently: manual entry always works.
  const recognizeItem = async (dataUrl: string) => {
    setAiNaming(true)
    try {
      const res = await fetch('/api/pos/scan-product-full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ front: dataUrl.replace(/^data:image\/\w+;base64,/, '') }),
      })
      if (res.ok) {
        const d = await res.json()
        const p = d?.product
        if (p?.name) setName(prev => prev.trim() ? prev : p.name)
        if (p?.sale_price != null && Number(p.sale_price) > 0) {
          setPrice(prev => prev.trim() ? prev : String(p.sale_price))
        }
      }
    } catch { /* silent — the manual fields are the flow */ }
    finally { setAiNaming(false) }
  }

  const takePhoto = () => {
    const video = videoRef.current, canvas = canvasRef.current
    if (!video || !canvas) return
    const w = video.videoWidth || 640, h = video.videoHeight || 480
    canvas.width = w; canvas.height = h
    canvas.getContext('2d')?.drawImage(video, 0, 0, w, h)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.7)
    setPhoto(dataUrl)
    stopCamera()
    recognizeItem(dataUrl)
  }

  const retakePhoto = async () => { setPhoto(null); await startCamera() }

  // Clean up the camera and any pending undo timer on unmount.
  useEffect(() => () => {
    stopCamera()
    if (undoTimer.current) clearTimeout(undoTimer.current)
  }, [stopCamera])

  const resolvedName = () => name.trim() || tc('pos_setup.item_default_name')

  const saveItem = async () => {
    const priceNum = parseFloat(price)
    if (!(priceNum >= 0)) { setError(tc('pos_setup.err_price')); return }
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/pos/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: resolvedName(),
          sale_price: priceNum,
          stock_qty: qty.trim() ? Math.max(0, parseFloat(qty)) : 0,
          unit: 'item',
          image: photo || undefined,
        }),
      })
      const d = await res.json()
      if (!res.ok) { feedback('err'); setError(d.error || tc('pos_setup.err_save')); setSaving(false); return }
      feedback('ok')
      // Read the saved item + price back aloud — confirmation for a vendor who
      // can't read the row they just created (research: always confirm amounts).
      speak(`${resolvedName()}. ${currencySymbol}${priceNum}`, lang)
      setItems(prev => [...prev, { id: d.product.id, name: d.product.name, sale_price: d.product.sale_price, stock_qty: d.product.stock_qty, image_url: d.product.image_url || null }])
      stopCamera()
      setScreen('list')
    } catch {
      feedback('err')
      setError(tc('pos_setup.err_save'))
    } finally {
      setSaving(false)
    }
  }

  // ── Bulk import ───────────────────────────────────────────────
  const openImport = async () => {
    setImportItems([]); setImportPhase('camera'); setImportError('')
    setScreen('import')
    await startCamera()
  }

  // One photo of a list → many items for review. Shared by the live camera and
  // the "choose from gallery" path (a social-shop screenshot lives in the
  // gallery, not behind the lens).
  const runImportExtract = async (dataUrl: string) => {
    stopCamera()
    setImportBusy(true); setImportError('')
    try {
      const res = await fetch('/api/pos/import-catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'extract', image: dataUrl }),
      })
      const d = await res.json()
      const list = Array.isArray(d.items) ? d.items : []
      if (list.length === 0) { feedback('err'); setImportError(tc('pos_setup.import_none')); await startCamera(); return }
      feedback('ok')
      setImportItems(list)
      setImportPhase('review')
    } catch {
      feedback('err'); setImportError(tc('pos_setup.import_failed')); await startCamera()
    } finally {
      setImportBusy(false)
    }
  }

  const captureListPhoto = () => {
    const video = videoRef.current, canvas = canvasRef.current
    if (!video || !canvas) return
    const w = video.videoWidth || 640, h = video.videoHeight || 480
    canvas.width = w; canvas.height = h
    canvas.getContext('2d')?.drawImage(video, 0, 0, w, h)
    runImportExtract(canvas.toDataURL('image/jpeg', 0.7))
  }

  const onPickListImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-picking the same file
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => { if (typeof reader.result === 'string') runImportExtract(reader.result) }
    reader.readAsDataURL(file)
  }

  // Spreadsheet path — a Loyverse (or similar) item export. No camera/AI: parse
  // the CSV, map its columns, and drop straight into the same review screen.
  const onPickCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setImportError('')
    const reader = new FileReader()
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : ''
      const mapped = mapLoyverseCsv(parseCsv(text))
      if (mapped.length === 0) { feedback('err'); setImportError(tc('pos_setup.import_csv_none')); return }
      feedback('ok')
      stopCamera()
      setImportItems(mapped)
      setImportPhase('review')
    }
    reader.readAsText(file)
  }

  const editImportItem = (i: number, patch: Partial<ImportItem>) =>
    setImportItems(prev => prev.map((it, idx) => idx === i ? { ...it, ...patch } : it))

  const removeImportItem = (i: number) =>
    setImportItems(prev => prev.filter((_, idx) => idx !== i))

  const commitImport = async () => {
    const clean = importItems.filter(it => it.name.trim())
    if (clean.length === 0) { setScreen('list'); return }
    setImportBusy(true); setImportError('')
    try {
      const res = await fetch('/api/pos/import-catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'commit', items: clean }),
      })
      const d = await res.json()
      if (!res.ok) { feedback('err'); setImportError(d.error || tc('pos_setup.err_save')); setImportBusy(false); return }
      feedback('ok')
      // Reload from the server — commit dedups, so the authoritative catalogue
      // may differ from what was on screen (some rows skipped as duplicates).
      try {
        const inv = await fetch('/api/pos/inventory?limit=200')
        if (inv.ok) {
          const id = await inv.json()
          setItems((id.inventory || []).map((p: any) => ({ id: p.id, name: p.name, sale_price: p.sale_price, stock_qty: p.stock_qty, image_url: p.image_url || null })))
        }
      } catch { /* the list already reflects the adds optimistically enough */ }
      speak(tc('pos_setup.import_added', { count: d.added || 0 }), lang)
      setScreen('list')
    } catch {
      feedback('err'); setImportError(tc('pos_setup.err_save'))
    } finally {
      setImportBusy(false)
    }
  }

  // Remove = deactivate with a 6s undo window; the list updates instantly.
  const removeItem = (it: Item) => {
    setItems(prev => prev.filter(x => x.id !== it.id))
    setUndoItem(it)
    if (undoTimer.current) clearTimeout(undoTimer.current)
    undoTimer.current = setTimeout(() => setUndoItem(null), 6000)
    fetch('/api/pos/inventory', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: it.id, active: false }),
    }).catch(() => { /* worst case: item reappears on next load */ })
  }

  const undoRemove = (it: Item) => {
    if (undoTimer.current) clearTimeout(undoTimer.current)
    setUndoItem(null)
    setItems(prev => [...prev, it])
    fetch('/api/pos/inventory', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: it.id, active: true }),
    }).catch(() => { /* worst case: item disappears on next load */ })
  }

  // ── Team (ghost staff) ────────────────────────────────────────
  const seatCount = drafts.length + 1 // +1 for the owner/operator's own seat

  const openAddMember = () => {
    setMemberName(''); setMemberRole('cashier'); setMemberMethod('phone')
    setMemberPhone(''); setMemberEmail(''); setMemberPin(''); setTeamError('')
    setScreen('team-add')
  }

  const saveMember = async () => {
    if (!memberName.trim()) { setTeamError(tc('pos_setup.team_err_name')); return }
    if (!/^\d{4}$/.test(memberPin)) { setTeamError(tc('pos_setup.team_err_pin')); return }
    let credential: { phone: string } | { email: string }
    if (memberMethod === 'phone') {
      const dial = COUNTRY_DIAL.find(c => c.code === memberCountry)?.dial || '+254'
      const e164 = toE164(dial, memberPhone)
      if (!e164) { setTeamError(tc('pos_setup.team_err_phone')); return }
      credential = { phone: e164 }
    } else {
      if (!memberEmail.trim()) { setTeamError(tc('pos_setup.team_err_email')); return }
      credential = { email: memberEmail.trim() }
    }
    setTeamSaving(true); setTeamError('')
    try {
      const res = await fetch('/api/pos/staff-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: memberName.trim(), role: memberRole, pin: memberPin, ...credential }),
      })
      const d = await res.json()
      if (!res.ok) { feedback('err'); setTeamError(d.error || tc('pos_setup.team_err_save')); setTeamSaving(false); return }
      feedback('ok')
      setDrafts(prev => [...prev, d.draft])
      setScreen('team')
    } catch {
      feedback('err'); setTeamError(tc('pos_setup.team_err_save'))
    } finally {
      setTeamSaving(false)
    }
  }

  const removeDraft = (id: string) => {
    setDrafts(prev => prev.filter(d => d.id !== id))
    fetch(`/api/pos/staff-draft?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
      .catch(() => { /* worst case: reappears on next load */ })
  }

  // For an already-paid owner whose drafts exceed their paid seats: buy the
  // extra seats so the pending members get provisioned. New total seats =
  // seats already paid + the pending drafts. Returns to /pos/activate, which
  // provisions once payment confirms.
  const isKenyan = currency === 'KES'
  const pendingSeats = alreadyEnabled ? drafts.length : 0
  const payForPendingSeats = async () => {
    if (pendingSeats <= 0) return
    setPayingSeats(true); setTeamError('')
    const totalSeats = paidSeats + pendingSeats
    try {
      if (isKenyan) {
        const res = await fetch('/api/pesapal', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'submit_order', plan: 'pos', seats: totalSeats, return_path: '/pos/activate' }),
        })
        const d = await res.json()
        if (d.redirectUrl) { window.location.href = d.redirectUrl; return }
        setTeamError(d.error || tc('pos_setup.team_err_save'))
      } else {
        const res = await fetch('/api/billing', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'checkout_pos_seat', seats: totalSeats, return_path: '/pos/activate' }),
        })
        const d = await res.json()
        if (d.url) { window.location.href = d.url; return }
        setTeamError(d.error || tc('pos_setup.team_err_save'))
      }
    } catch { setTeamError(tc('pos_setup.team_err_save')) }
    finally { setPayingSeats(false) }
  }

  const bigBtn: React.CSSProperties = {
    width: '100%', padding: '16px', borderRadius: 14, border: 'none',
    background: ACC, color: '#fff', fontSize: 17, fontWeight: 700,
    cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 12px rgba(208,138,89,.3)',
  }
  const ghostBtn: React.CSSProperties = {
    width: '100%', padding: '15px', borderRadius: 14, border: `1.5px solid ${B2}`,
    background: 'transparent', color: TX2, fontSize: 16, fontWeight: 600,
    cursor: 'pointer', fontFamily: 'inherit',
  }

  if (loading) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: TX3, fontFamily: 'DM Sans, sans-serif' }}>
        {tc('pos_setup.loading')}
      </div>
    )
  }

  // What the read-aloud button speaks for the current screen.
  const screenSpokenText = (() => {
    switch (screen) {
      case 'list':     return `${items.length === 0 ? (firstName ? tc('pos_setup.title_empty_named', { name: firstName }) : tc('pos_setup.title_empty')) : (items.length === 1 ? tc('pos_setup.title_count_one') : tc('pos_setup.title_count', { count: items.length }))}. ${tc('pos_setup.subtitle')}`
      case 'capture':  return `${tc('pos_setup.name_label')}. ${tc('pos_setup.price_label')}`
      case 'team':     return `${tc('pos_setup.team_title')}. ${tc('pos_setup.team_subtitle')}`
      case 'team-add': return tc('pos_setup.team_add_title')
      case 'ready':    return `${firstName ? tc('pos_setup.ready_title_named', { name: firstName }) : tc('pos_setup.ready_title')}`
      default:         return ''
    }
  })()

  return (
    <div style={{ minHeight: '100%', background: BG, fontFamily: 'DM Sans, sans-serif', display: 'flex', flexDirection: 'column' }}>
      {/* On mobile the app shell floats a menu button top-left; clear it so
          the page heading isn't overlapped. No effect on desktop. */}
      <style>{`@media (max-width: 768px) { .pos-setup-shell { padding-top: 56px !important; } }`}</style>
      {screenSpokenText && (
        <div style={{ position: 'fixed', right: 16, bottom: 80, zIndex: 90 }}>
          <SpeakButton text={screenSpokenText} size={52} />
        </div>
      )}
      <div className="pos-setup-shell" style={{ width: '100%', maxWidth: 480, margin: '0 auto', padding: '20px 16px 40px', flex: 1 }}>

        {/* Already enabled — nudge to the real POS instead of the pre-pay flow */}
        {alreadyEnabled && screen === 'list' && (
          <div role="status" style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(46,125,84,.08)', border: '1px solid rgba(46,125,84,.25)', color: OK, fontSize: 13, marginBottom: 16 }}>
            {tc('pos_setup.already_active')}{' '}
            <button onClick={() => router.push('/pos')} style={{ background: 'none', border: 'none', color: OK, fontWeight: 700, textDecoration: 'underline', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, padding: 0 }}>
              {tc('pos_setup.go_to_pos')}
            </button>
          </div>
        )}

        {/* ── LIST: your items so far ── */}
        {screen === 'list' && (
          <>
            {/* Undo bar — kept above both states so removing the last item
                still offers Undo (a mis-tap is never a loss). */}
            {undoItem && (
              <div role="status" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 15px', borderRadius: 12, background: TX, color: '#fff', marginBottom: 16 }}>
                <span style={{ fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {tc('pos_setup.removed_toast', { name: undoItem.name })}
                </span>
                <button onClick={() => undoRemove(undoItem)}
                  style={{ flexShrink: 0, padding: '8px 16px', borderRadius: 9999, border: 'none', background: ACC, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {tc('pos_setup.undo')}
                </button>
              </div>
            )}

            {items.length === 0 ? (
              /* ── First run: how do you keep track today? Migration and start-
                 fresh are equal first choices — both are camera-first. ── */
              <>
                <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(22px,5vw,28px)', fontWeight: 700, color: TX, letterSpacing: '-.02em', marginBottom: 8 }}>
                  {firstName ? tc('pos_setup.fork_title_named', { name: firstName }) : tc('pos_setup.fork_title')}
                </h1>
                <p style={{ fontSize: 15, color: TX2, lineHeight: 1.6, marginBottom: 24 }}>
                  {tc('pos_setup.fork_subtitle')}
                </p>

                {/* Already selling somewhere → bring the whole list in at once */}
                <button onClick={openImport}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left', padding: '16px', marginBottom: 12, borderRadius: 16, border: `1.5px solid ${ACC}`, background: 'rgba(208,138,89,.06)', cursor: 'pointer', fontFamily: 'inherit' }}>
                  <span style={{ flexShrink: 0, width: 48, height: 48, borderRadius: 13, background: ACC, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 3v18"/></svg>
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: 16, fontWeight: 700, color: TX }}>{tc('pos_setup.fork_have_title')}</span>
                    <span style={{ display: 'block', fontSize: 13, color: TX2, marginTop: 2, lineHeight: 1.45 }}>{tc('pos_setup.fork_have_desc')}</span>
                  </span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={TX3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="m9 18 6-6-6-6"/></svg>
                </button>

                {/* Nothing digital yet → add each item with the camera */}
                <button onClick={openCapture}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left', padding: '16px', borderRadius: 16, border: `1.5px solid ${B2}`, background: SF, cursor: 'pointer', fontFamily: 'inherit' }}>
                  <span style={{ flexShrink: 0, width: 48, height: 48, borderRadius: 13, background: EV, color: TX, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: 16, fontWeight: 700, color: TX }}>{tc('pos_setup.fork_fresh_title')}</span>
                    <span style={{ display: 'block', fontSize: 13, color: TX2, marginTop: 2, lineHeight: 1.45 }}>{tc('pos_setup.fork_fresh_desc')}</span>
                  </span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={TX3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </>
            ) : (
              /* ── Have items: the working list ── */
              <>
                <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(22px,5vw,28px)', fontWeight: 700, color: TX, letterSpacing: '-.02em', marginBottom: 6 }}>
                  {items.length === 1 ? tc('pos_setup.title_count_one') : tc('pos_setup.title_count', { count: items.length })}
                </h1>
                <p style={{ fontSize: 15, color: TX2, lineHeight: 1.6, marginBottom: 24 }}>
                  {tc('pos_setup.subtitle')}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                  {items.map(it => (
                    <div key={it.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 12, background: SF, border: `1px solid ${B}` }}>
                      {it.image_url ? (
                        <img src={it.image_url} alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', flexShrink: 0, background: EV }} />
                      ) : (
                        <div aria-hidden style={{ width: 44, height: 44, borderRadius: 10, background: EV, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={TX3} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                          </svg>
                        </div>
                      )}
                      <span style={{ fontSize: 15, fontWeight: 600, color: TX, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.name}</span>
                      <span style={{ fontSize: 15, fontWeight: 700, color: ACC, flexShrink: 0 }}>{currencySymbol}{it.sale_price}</span>
                      <button onClick={() => removeItem(it)} aria-label={tc('pos_setup.removed_toast', { name: it.name })}
                        style={{ width: 44, height: 44, flexShrink: 0, borderRadius: 10, border: 'none', background: 'transparent', color: TX3, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      </button>
                    </div>
                  ))}
                </div>

                <button style={{ ...bigBtn, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }} onClick={openCapture}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                    <circle cx="12" cy="13" r="3"/>
                  </svg>
                  {tc('pos_setup.add_another_item')}
                </button>

                {/* Still got more elsewhere? Bring another list in. */}
                <button style={{ ...ghostBtn, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }} onClick={openImport}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 3v18"/>
                  </svg>
                  {tc('pos_setup.import_cta')}
                </button>

                <button style={ghostBtn} onClick={() => setScreen(TEAM_STEP_TYPES.has(bizType) ? 'team' : 'ready')}>
                  {tc('pos_setup.im_ready')}
                </button>
              </>
            )}
          </>
        )}

        {/* ── CAPTURE: photo + name + price ── */}
        {screen === 'capture' && (
          <>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '4 / 3', borderRadius: 16, overflow: 'hidden', background: '#000', marginBottom: 16 }}>
              {photo ? (
                <img src={photo} alt={tc('pos_setup.photo_alt')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <video ref={videoRef} playsInline muted autoPlay style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {!photo ? (
              <button style={{ ...bigBtn, marginBottom: 20 }} onClick={takePhoto}>
                {tc('pos_setup.take_photo')}
              </button>
            ) : (
              <button style={{ ...ghostBtn, marginBottom: 20 }} onClick={retakePhoto}>
                {tc('pos_setup.retake')}
              </button>
            )}

            <label style={{ fontSize: 13, fontWeight: 600, color: TX2, display: 'block', marginBottom: 6 }}>
              {tc('pos_setup.name_label')}
              {aiNaming && <span style={{ marginLeft: 8, color: ACC, fontWeight: 500 }}>{tc('pos_setup.ai_naming')}</span>}
            </label>
            <input
              value={name} onChange={e => setName(e.target.value)}
              placeholder={tc('pos_setup.name_placeholder')}
              style={{ width: '100%', padding: '13px 15px', fontSize: 16, background: EV, border: `1.5px solid ${B2}`, borderRadius: 12, color: TX, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 16 }}
            />

            <label style={{ fontSize: 13, fontWeight: 600, color: TX2, display: 'block', marginBottom: 6 }}>{tc('pos_setup.price_label')}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 26, fontWeight: 700, color: TX }}>{currencySymbol}</span>
              <input
                value={price} onChange={e => setPrice(e.target.value.replace(/[^\d.]/g, ''))}
                inputMode="decimal" placeholder="0"
                style={{ flex: 1, padding: '14px 16px', fontSize: 26, fontWeight: 700, background: EV, border: `1.5px solid ${B2}`, borderRadius: 12, color: TX, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>

            <label style={{ fontSize: 13, fontWeight: 600, color: TX2, display: 'block', marginBottom: 6 }}>{tc('pos_setup.qty_label')}</label>
            <input
              value={qty} onChange={e => setQty(e.target.value.replace(/[^\d.]/g, ''))}
              inputMode="decimal" placeholder={tc('pos_setup.qty_placeholder')}
              style={{ width: '100%', padding: '13px 15px', fontSize: 16, background: EV, border: `1.5px solid ${B2}`, borderRadius: 12, color: TX, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 20 }}
            />

            {error && <div role="alert" style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(220,38,38,.08)', border: '1px solid rgba(220,38,38,.25)', color: '#b91c1c', fontSize: 13, marginBottom: 16 }}>{error}</div>}

            <button style={{ ...bigBtn, marginBottom: 10, opacity: saving ? .7 : 1 }} onClick={saveItem} disabled={saving}>
              {saving ? tc('pos_setup.saving') : tc('pos_setup.save_item')}
            </button>
            <button style={ghostBtn} onClick={() => { stopCamera(); setScreen('list') }} disabled={saving}>
              {tc('pos_setup.cancel')}
            </button>
          </>
        )}

        {/* ── IMPORT: bring a whole existing list in from one photo ── */}
        {screen === 'import' && (
          <>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={onPickListImage} style={{ display: 'none' }} />
            <input ref={csvInputRef} type="file" accept=".csv,text/csv,text/plain" onChange={onPickCsv} style={{ display: 'none' }} />

            {importPhase === 'camera' && (
              <>
                <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(20px,5vw,26px)', fontWeight: 700, color: TX, letterSpacing: '-.02em', marginBottom: 6 }}>
                  {tc('pos_setup.import_title')}
                </h1>
                <p style={{ fontSize: 15, color: TX2, lineHeight: 1.6, marginBottom: 16 }}>
                  {tc('pos_setup.import_subtitle')}
                </p>

                <div style={{ position: 'relative', width: '100%', aspectRatio: '4 / 3', borderRadius: 16, overflow: 'hidden', background: '#000', marginBottom: 16 }}>
                  <video ref={videoRef} playsInline muted autoPlay style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {importBusy && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 15, fontWeight: 600 }}>
                      {tc('pos_setup.import_reading')}
                    </div>
                  )}
                </div>
                <canvas ref={canvasRef} style={{ display: 'none' }} />

                {importError && <div role="alert" style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(220,38,38,.08)', border: '1px solid rgba(220,38,38,.25)', color: '#b91c1c', fontSize: 13, marginBottom: 16 }}>{importError}</div>}

                <button style={{ ...bigBtn, marginBottom: 10, opacity: importBusy ? .7 : 1 }} onClick={captureListPhoto} disabled={importBusy}>
                  {importBusy ? tc('pos_setup.import_reading') : tc('pos_setup.import_snap')}
                </button>
                <button style={{ ...ghostBtn, marginBottom: 10 }} onClick={() => fileInputRef.current?.click()} disabled={importBusy}>
                  {tc('pos_setup.import_gallery')}
                </button>
                {/* Came from another POS (e.g. Loyverse)? Upload its export. */}
                <button style={{ ...ghostBtn, marginBottom: 10 }} onClick={() => csvInputRef.current?.click()} disabled={importBusy}>
                  {tc('pos_setup.import_csv')}
                </button>
                <button style={ghostBtn} onClick={() => { stopCamera(); setScreen('list') }} disabled={importBusy}>
                  {tc('pos_setup.cancel')}
                </button>
              </>
            )}

            {importPhase === 'review' && (
              <>
                <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(20px,5vw,26px)', fontWeight: 700, color: TX, letterSpacing: '-.02em', marginBottom: 6 }}>
                  {importItems.length === 1 ? tc('pos_setup.import_review_one') : tc('pos_setup.import_review', { count: importItems.length })}
                </h1>
                <p style={{ fontSize: 14, color: TX2, lineHeight: 1.6, marginBottom: 20 }}>
                  {tc('pos_setup.import_review_hint')}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                  {importItems.map((it, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 12, background: SF, border: `1px solid ${B}` }}>
                      <input
                        value={it.name} onChange={e => editImportItem(i, { name: e.target.value })}
                        placeholder={tc('pos_setup.name_placeholder')}
                        style={{ flex: 1, minWidth: 0, padding: '10px 12px', fontSize: 15, background: EV, border: `1.5px solid ${B2}`, borderRadius: 10, color: TX, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: TX2 }}>{currencySymbol}</span>
                        <input
                          value={it.sale_price ? String(it.sale_price) : ''} onChange={e => editImportItem(i, { sale_price: parseFloat(e.target.value.replace(/[^\d.]/g, '')) || 0 })}
                          inputMode="decimal" placeholder="0"
                          style={{ width: 72, padding: '10px 8px', fontSize: 15, fontWeight: 700, textAlign: 'right', background: EV, border: `1.5px solid ${B2}`, borderRadius: 10, color: TX, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                        />
                      </div>
                      <button onClick={() => removeImportItem(i)} aria-label={tc('pos_setup.team_remove')}
                        style={{ width: 40, height: 40, flexShrink: 0, borderRadius: 10, border: 'none', background: 'transparent', color: TX3, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      </button>
                    </div>
                  ))}
                </div>

                {importError && <div role="alert" style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(220,38,38,.08)', border: '1px solid rgba(220,38,38,.25)', color: '#b91c1c', fontSize: 13, marginBottom: 16 }}>{importError}</div>}

                <button style={{ ...bigBtn, marginBottom: 10, opacity: importBusy ? .7 : 1 }} onClick={commitImport} disabled={importBusy}>
                  {importBusy ? tc('pos_setup.saving') : (importItems.length === 1 ? tc('pos_setup.import_save_one') : tc('pos_setup.import_save', { count: importItems.filter(it => it.name.trim()).length }))}
                </button>
                <button style={ghostBtn} onClick={openImport} disabled={importBusy}>
                  {tc('pos_setup.import_retake')}
                </button>
              </>
            )}
          </>
        )}

        {/* ── TEAM: add ghost staff (retail / salon / restaurant) ── */}
        {screen === 'team' && (
          <>
            <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(22px,5vw,28px)', fontWeight: 700, color: TX, letterSpacing: '-.02em', marginBottom: 6 }}>
              {tc('pos_setup.team_title')}
            </h1>
            <p style={{ fontSize: 15, color: TX2, lineHeight: 1.6, marginBottom: 20 }}>
              {tc('pos_setup.team_subtitle')}
            </p>

            {/* First-time: live seat count + running total.
                Already paid + pending drafts: the extra cost to activate them. */}
            {!alreadyEnabled ? (
              <div style={{ padding: '14px 16px', borderRadius: 14, background: SF, border: `1px solid ${B}`, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, color: TX2 }}>{seatCount === 1 ? tc('pos_setup.team_seats_one') : tc('pos_setup.team_seats', { seats: seatCount })}</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: ACC }}>{posSeatPrice(currency, seatCount)}<span style={{ fontSize: 12, color: TX3, fontWeight: 500 }}>{tc('pos_setup.team_per_month')}</span></span>
              </div>
            ) : pendingSeats > 0 ? (
              <div style={{ padding: '14px 16px', borderRadius: 14, background: 'rgba(208,138,89,.08)', border: `1px solid ${ACC}`, marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: TX }}>{tc('pos_setup.team_pending_count', { count: pendingSeats })}</div>
                <div style={{ fontSize: 13, color: TX2, marginTop: 2 }}>{tc('pos_setup.team_pending_note', { price: posSeatPrice(currency, pendingSeats) })}</div>
              </div>
            ) : null}

            {drafts.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {drafts.map(d => (
                  <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, background: SF, border: `1px solid ${B}` }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: TX, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</div>
                      <div style={{ fontSize: 12, color: TX3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tc(`pos_setup.role_${d.role}`)} · {d.phone || d.email}</div>
                    </div>
                    {alreadyEnabled && (
                      <span style={{ flexShrink: 0, fontSize: 11, fontWeight: 700, color: ACC, background: 'rgba(208,138,89,.12)', borderRadius: 9999, padding: '3px 9px' }}>{tc('pos_setup.team_pending_badge')}</span>
                    )}
                    <button onClick={() => removeDraft(d.id)} aria-label={`${tc('pos_setup.team_remove')} ${d.name}`}
                      style={{ width: 44, height: 44, flexShrink: 0, borderRadius: 10, border: 'none', background: 'transparent', color: TX3, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Pay-to-activate: already paid, drafts exceed paid seats */}
            {alreadyEnabled && pendingSeats > 0 && (
              <button style={{ ...bigBtn, marginBottom: 12, opacity: payingSeats ? .7 : 1 }} onClick={payForPendingSeats} disabled={payingSeats}>
                {payingSeats ? tc('pos_setup.saving') : tc('pos_setup.team_pay_pending', { count: pendingSeats, price: posSeatPrice(currency, pendingSeats) })}
              </button>
            )}

            <button
              style={{ ...(alreadyEnabled && pendingSeats > 0 ? ghostBtn : bigBtn), marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
              onClick={openAddMember}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/></svg>
              {drafts.length === 0 ? tc('pos_setup.team_add_first') : tc('pos_setup.team_add_another')}
            </button>

            {alreadyEnabled ? (
              <button style={ghostBtn} onClick={() => router.push('/pos')}>
                {tc('pos_setup.team_done')}
              </button>
            ) : (
              <button style={ghostBtn} onClick={() => setScreen('ready')}>
                {drafts.length === 0 ? tc('pos_setup.team_no_staff') : tc('pos_setup.team_continue')}
              </button>
            )}
          </>
        )}

        {/* ── TEAM ADD: create one ghost staff member ── */}
        {screen === 'team-add' && (
          <>
            <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(20px,5vw,26px)', fontWeight: 700, color: TX, letterSpacing: '-.02em', marginBottom: 20 }}>
              {tc('pos_setup.team_add_title')}
            </h1>

            <label style={{ fontSize: 13, fontWeight: 600, color: TX2, display: 'block', marginBottom: 6 }}>{tc('pos_setup.team_name_label')}</label>
            <input value={memberName} onChange={e => setMemberName(e.target.value)} placeholder={tc('pos_setup.team_name_placeholder')}
              style={{ width: '100%', padding: '13px 15px', fontSize: 16, background: EV, border: `1.5px solid ${B2}`, borderRadius: 12, color: TX, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 16 }} />

            <label style={{ fontSize: 13, fontWeight: 600, color: TX2, display: 'block', marginBottom: 6 }}>{tc('pos_setup.team_role_label')}</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {(['cashier', 'inventory'] as const).map(r => (
                <button key={r} onClick={() => setMemberRole(r)}
                  style={{ flex: 1, padding: '12px', borderRadius: 12, border: `1.5px solid ${memberRole === r ? ACC : B2}`, background: memberRole === r ? 'rgba(208,138,89,.08)' : 'transparent', color: memberRole === r ? ACC : TX2, fontFamily: 'inherit', fontSize: 14, fontWeight: memberRole === r ? 700 : 500, cursor: 'pointer' }}>
                  {tc(`pos_setup.role_${r}`)}
                </button>
              ))}
            </div>

            {/* login credential — phone (default) or email */}
            <label style={{ fontSize: 13, fontWeight: 600, color: TX2, display: 'block', marginBottom: 6 }}>{tc('pos_setup.team_login_label')}</label>
            <div style={{ position: 'relative', display: 'flex', background: EV, borderRadius: 10, padding: 3, marginBottom: 10 }}>
              <div aria-hidden style={{ position: 'absolute', top: 3, bottom: 3, left: 3, width: 'calc(50% - 3px)', borderRadius: 8, background: SF, boxShadow: '0 1px 4px rgba(0,0,0,.08)', transform: memberMethod === 'email' ? 'translateX(100%)' : 'translateX(0)', transition: 'transform .25s ease' }}/>
              {(['phone', 'email'] as const).map(m => (
                <button key={m} onClick={() => { setMemberMethod(m); setTeamError('') }}
                  style={{ position: 'relative', zIndex: 1, flex: 1, padding: '8px', borderRadius: 8, border: 'none', background: 'transparent', color: memberMethod === m ? TX : TX2, fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                  {m === 'phone' ? tc('pos_setup.team_method_phone') : tc('pos_setup.team_method_email')}
                </button>
              ))}
            </div>
            {memberMethod === 'phone' ? (
              <div style={{ display: 'flex', gap: 6, marginBottom: 16 }} dir="ltr">
                <select value={memberCountry} onChange={e => setMemberCountry(e.target.value)} aria-label={tc('pos_setup.team_method_phone')}
                  style={{ width: 92, flexShrink: 0, padding: '13px 8px', borderRadius: 12, border: `1.5px solid ${B2}`, fontSize: 15, fontFamily: 'inherit', background: EV, color: TX, cursor: 'pointer', appearance: 'none' }}>
                  {COUNTRY_DIAL.map(c => <option key={c.code} value={c.code}>{c.flag} {c.dial}</option>)}
                </select>
                <input value={memberPhone} onChange={e => setMemberPhone(e.target.value)} type="tel" inputMode="tel" dir="ltr" placeholder="712 345678"
                  style={{ flex: 1, minWidth: 0, padding: '13px 15px', fontSize: 16, background: EV, border: `1.5px solid ${B2}`, borderRadius: 12, color: TX, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              </div>
            ) : (
              <input value={memberEmail} onChange={e => setMemberEmail(e.target.value)} type="email" placeholder={tc('pos_setup.team_email_placeholder')}
                style={{ width: '100%', padding: '13px 15px', fontSize: 16, background: EV, border: `1.5px solid ${B2}`, borderRadius: 12, color: TX, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 16 }} />
            )}

            <label style={{ fontSize: 13, fontWeight: 600, color: TX2, display: 'block', marginBottom: 6 }}>{tc('pos_setup.team_pin_label')}</label>
            <input value={memberPin} onChange={e => setMemberPin(e.target.value.replace(/\D/g, '').slice(0, 4))} type="tel" inputMode="numeric"
              placeholder="••••" style={{ width: '100%', padding: '13px 15px', fontSize: 22, letterSpacing: memberPin ? '.4em' : 'normal', textAlign: 'center', background: EV, border: `1.5px solid ${B2}`, borderRadius: 12, color: TX, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 8 }} />
            <p style={{ fontSize: 12, color: TX3, marginBottom: 16, lineHeight: 1.5 }}>{tc('pos_setup.team_pin_hint')}</p>

            {teamError && <div role="alert" style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(220,38,38,.08)', border: '1px solid rgba(220,38,38,.25)', color: '#b91c1c', fontSize: 13, marginBottom: 16 }}>{teamError}</div>}

            <button style={{ ...bigBtn, marginBottom: 10, opacity: teamSaving ? .7 : 1 }} onClick={saveMember} disabled={teamSaving}>
              {teamSaving ? tc('pos_setup.saving') : tc('pos_setup.team_save_member')}
            </button>
            <button style={ghostBtn} onClick={() => setScreen('team')} disabled={teamSaving}>{tc('pos_setup.cancel')}</button>
          </>
        )}

        {/* ── READY: hand off to checkout ── */}
        {screen === 'ready' && (
          <div style={{ textAlign: 'center', paddingTop: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(46,125,84,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={OK} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(22px,5vw,28px)', fontWeight: 700, color: TX, letterSpacing: '-.02em', marginBottom: 10 }}>
              {firstName ? tc('pos_setup.ready_title_named', { name: firstName }) : tc('pos_setup.ready_title')}
            </h1>
            <p style={{ fontSize: 15, color: TX2, lineHeight: 1.6, marginBottom: 28 }}>
              {items.length === 1 ? tc('pos_setup.ready_subtitle_one') : tc('pos_setup.ready_subtitle', { count: items.length })}
            </p>
            <button style={{ ...bigBtn, marginBottom: 10 }} onClick={() => router.push('/pos/activate')}>
              {tc('pos_setup.ready_cta')}
            </button>
            <button style={ghostBtn} onClick={() => setScreen('list')}>
              {tc('pos_setup.ready_back')}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
