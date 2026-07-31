'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLang } from '@/components/LanguageProvider'
import { Button, Banner, Input } from '@/components/ui'

// ── Design tokens (from CSS variables in globals.css) ──────────────────────
const tokens = {
  bg:        'var(--pos-bg)',
  surface:   'var(--pos-surface)',
  border:    'var(--pos-border)',
  ink:       'var(--pos-ink)',
  muted:     'var(--pos-muted)',
  hint:      'var(--pos-hint)',
  accent:    'var(--pos-accent)',
  danger:    'var(--pos-danger)',
  success:   'var(--pos-success)',
  warning:   'var(--pos-warning)',
}

const ACC = tokens.accent
const API = process.env.NEXT_PUBLIC_API_URL || ''

interface Customer { id: string; name: string | null; phone: string | null; balance_owed: number }
interface LedgerEntry { id: string; kind: 'debt' | 'opening' | 'payment'; amount: number; note: string | null; created_at: string }
interface ImportItem { name: string; phone: string; amount: number }

type Screen = 'list' | 'detail' | 'import-camera' | 'import-review' | 'add-manual'

export default function CreditPage() {
  const router = useRouter()
  const { tc } = useLang()
  const supabase = createClient()

  const [ready, setReady] = useState(false)
  const [sym, setSym] = useState('£')
  const [staffHeaders, setStaffHeaders] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [screen, setScreen] = useState<Screen>('list')
  const [error, setError] = useState('')

  // Detail / repayment
  const [selected, setSelected] = useState<Customer | null>(null)
  const [ledger, setLedger] = useState<LedgerEntry[]>([])
  const [payAmount, setPayAmount] = useState('')
  const [paying, setPaying] = useState(false)

  // Manual add-one (a straggler not on the photographed debt book)
  const [manualName, setManualName] = useState('')
  const [manualPhone, setManualPhone] = useState('')
  const [manualAmount, setManualAmount] = useState('')
  const [manualSaving, setManualSaving] = useState(false)

  // Bulk import — snap the debt book
  const [importBusy, setImportBusy] = useState(false)
  const [importItems, setImportItems] = useState<ImportItem[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('pos_staff')
      if (raw) {
        const s = JSON.parse(raw)
        if (s?.id && s?.owner_id) {
          setStaffHeaders({ 'x-staff-id': s.id, 'x-owner-id': s.owner_id })
          if (s.currency_symbol) setSym(s.currency_symbol)
          setReady(true)
          return
        }
      }
    } catch { /* fall through to owner-session check */ }
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/'); return }
      setReady(true)
      fetch(`${API}/api/pos/config`).then(r => r.json()).then(c => { if (c.currency_symbol) setSym(c.currency_symbol) }).catch(() => {})
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadList = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API}/api/pos/customer-credit?owing=1`, { headers: staffHeaders })
      const d = await res.json()
      // A failed fetch must never render as an empty list — on a screen
      // showing money owed, "no debts" and "couldn't check" must look different.
      if (!res.ok) { setError(d.error || tc('retail_credit.err_load')); setCustomers([]); return }
      setCustomers(d.customers || [])
    } catch { setError(tc('retail_credit.err_load')); setCustomers([]) }
    finally { setLoading(false) }
  }, [staffHeaders]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (ready) loadList() }, [ready, loadList])

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
  }, [])
  useEffect(() => () => stopCamera(), [stopCamera])

  async function openDetail(c: Customer) {
    setSelected(c); setScreen('detail'); setPayAmount(''); setError('')
    try {
      const res = await fetch(`${API}/api/pos/customer-credit?customer_id=${c.id}`, { headers: staffHeaders })
      const d = await res.json()
      if (res.ok) setLedger(d.ledger || [])
    } catch { /* history stays empty — the balance figure still shows */ }
  }

  async function recordPayment() {
    if (!selected) return
    const amt = parseFloat(payAmount)
    if (!(amt > 0)) { setError(tc('retail_credit.err_amount')); return }
    setPaying(true); setError('')
    try {
      const clientTxId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `credit_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
      const res = await fetch(`${API}/api/pos/customer-credit`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...staffHeaders },
        body: JSON.stringify({ action: 'payment', customer_id: selected.id, amount: amt, client_tx_id: clientTxId }),
      })
      const d = await res.json()
      if (!res.ok) { setError(d.error || tc('retail_credit.err_save')); setPaying(false); return }
      setSelected(prev => prev ? { ...prev, balance_owed: d.balance_owed } : prev)
      setPayAmount('')
      await openDetail({ ...selected, balance_owed: d.balance_owed })
      await loadList()
    } catch { setError(tc('retail_credit.err_save')) }
    finally { setPaying(false) }
  }

  async function saveManual() {
    const amt = parseFloat(manualAmount)
    if (!manualName.trim() && !manualPhone.trim()) { setError(tc('retail_credit.err_who')); return }
    if (!(amt > 0)) { setError(tc('retail_credit.err_amount')); return }
    setManualSaving(true); setError('')
    try {
      const clientTxId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `credit_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
      const res = await fetch(`${API}/api/pos/customer-credit`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...staffHeaders },
        body: JSON.stringify({ action: 'opening', name: manualName.trim(), phone: manualPhone.trim(), amount: amt, client_tx_id: clientTxId }),
      })
      const d = await res.json()
      if (!res.ok) { setError(d.error || tc('retail_credit.err_save')); setManualSaving(false); return }
      setManualName(''); setManualPhone(''); setManualAmount('')
      setScreen('list')
      await loadList()
    } catch { setError(tc('retail_credit.err_save')) }
    finally { setManualSaving(false) }
  }

  // ── Bring in the debt book (camera) ──────────────────────────
  const openImportCamera = async () => {
    setImportItems([]); setError(''); setScreen('import-camera')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play() }
    } catch { /* no camera — the manual-add path still works */ }
  }

  const captureDebtBook = () => {
    const video = videoRef.current, canvas = canvasRef.current
    if (!video || !canvas) return
    const w = video.videoWidth || 640, h = video.videoHeight || 480
    canvas.width = w; canvas.height = h
    canvas.getContext('2d')?.drawImage(video, 0, 0, w, h)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.7)
    stopCamera()
    runExtract(dataUrl)
  }

  async function runExtract(dataUrl: string) {
    setImportBusy(true); setError('')
    try {
      const res = await fetch(`${API}/api/pos/customer-credit`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...staffHeaders },
        body: JSON.stringify({ action: 'extract', image: dataUrl }),
      })
      const d = await res.json()
      const items: ImportItem[] = Array.isArray(d.items) ? d.items : []
      if (items.length === 0) { setError(tc('retail_credit.import_none')); setScreen('import-camera'); await openImportCamera(); return }
      setImportItems(items)
      setScreen('import-review')
    } catch { setError(tc('retail_credit.import_failed')) }
    finally { setImportBusy(false) }
  }

  const editImportItem = (i: number, patch: Partial<ImportItem>) =>
    setImportItems(prev => prev.map((it, idx) => idx === i ? { ...it, ...patch } : it))
  const removeImportItem = (i: number) => setImportItems(prev => prev.filter((_, idx) => idx !== i))

  async function commitImport() {
    const clean = importItems.filter(it => it.name.trim() || it.phone.trim())
    if (clean.length === 0) { setScreen('list'); return }
    setImportBusy(true); setError('')
    try {
      const res = await fetch(`${API}/api/pos/customer-credit`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...staffHeaders },
        body: JSON.stringify({ action: 'commit_import', items: clean }),
      })
      const d = await res.json()
      if (!res.ok) { setError(d.error || tc('retail_credit.err_save')); setImportBusy(false); return }
      setScreen('list')
      await loadList()
    } catch { setError(tc('retail_credit.err_save')) }
    finally { setImportBusy(false) }
  }

  const inp: React.CSSProperties = { background: tokens.bg, border: `1px solid ${tokens.border}`, borderRadius: 8, color: tokens.ink, padding: '10px 12px', fontSize: 14, boxSizing: 'border-box' }

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: tokens.bg, color: tokens.ink, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: tokens.surface, borderBottom: `1px solid ${tokens.border}`, padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Button variant="secondary" onClick={() => (screen === 'list' ? router.push('/retail') : setScreen('list'))}>←</Button>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: ACC }}>🧾 {tc('retail_credit.header_title')}</div>
          <div style={{ fontSize: 12, color: tokens.muted }}>{tc('retail_credit.header_subtitle')}</div>
        </div>
      </div>

      <div style={{ padding: '24px', maxWidth: 640, margin: '0 auto' }}>
        {error && <Banner tone="danger">{error}</Banner>}

        {/* ── LIST: who owes me ── */}
        {screen === 'list' && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              <Button variant="primary" size="lg" onClick={openImportCamera} style={{ width: '100%' }}>{tc('retail_credit.import_cta')}</Button>
              <Button variant="secondary" size="lg" onClick={() => { setManualName(''); setManualPhone(''); setManualAmount(''); setError(''); setScreen('add-manual') }} style={{ width: '100%' }}>
                {tc('retail_credit.add_manual_cta')}
              </Button>
            </div>

            {loading && <div style={{ color: tokens.hint, fontSize: 13 }}>{tc('retail_credit.loading')}</div>}
            {!loading && !error && customers.length === 0 && (
              <div style={{ color: tokens.hint, fontSize: 13, textAlign: 'center', padding: '30px 0' }}>{tc('retail_credit.no_one_owes')}</div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {customers.map((c, idx) => (
                <button key={c.id} className="pos-item" onClick={() => openDetail(c)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left', background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 12, padding: '14px 16px', cursor: 'pointer', animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{c.name || c.phone || tc('retail_customers.unknown_customer')}</div>
                    {c.name && c.phone && <div style={{ fontSize: 12, color: tokens.hint }}>{c.phone}</div>}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: tokens.warning }}>{sym}{c.balance_owed.toFixed(2)}</div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* ── DETAIL: history + record a repayment ── */}
        {screen === 'detail' && selected && (
          <>
            <div className="pos-reveal" style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 12, padding: 18, marginBottom: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{selected.name || selected.phone}</div>
              <div style={{ fontSize: 12, color: tokens.hint, marginTop: 2 }}>{tc('retail_credit.owes_you')}</div>
              <div style={{ fontSize: 30, fontWeight: 700, color: tokens.warning, marginTop: 4 }}>{sym}{selected.balance_owed.toFixed(2)}</div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              <input value={payAmount} onChange={e => setPayAmount(e.target.value.replace(/[^\d.]/g, ''))} inputMode="decimal" placeholder={tc('retail_credit.payment_placeholder')} style={{ ...inp, flex: 1 }} />
              <Button variant="primary" onClick={recordPayment} loading={paying} loadingLabel={tc('retail_credit.saving')}>
                {tc('retail_credit.record_payment')}
              </Button>
            </div>

            <div style={{ fontWeight: 700, fontSize: 13, color: tokens.muted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>{tc('retail_credit.history')}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ledger.length === 0 && <div style={{ color: tokens.hint, fontSize: 13 }}>{tc('retail_credit.no_history')}</div>}
              {ledger.map((e, idx) => (
                <div key={e.id} className="pos-item" style={{ display: 'flex', justifyContent: 'space-between', background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 10, padding: '10px 14px', fontSize: 13, animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                  <span style={{ color: tokens.muted }}>
                    {e.kind === 'payment' ? tc('retail_credit.entry_payment') : e.kind === 'opening' ? tc('retail_credit.entry_opening') : tc('retail_credit.entry_debt')}
                    {' · '}{new Date(e.created_at).toLocaleDateString([], { day: '2-digit', month: 'short' })}
                  </span>
                  <span style={{ fontWeight: 700, color: e.kind === 'payment' ? ACC : tokens.warning }}>
                    {e.kind === 'payment' ? '−' : '+'}{sym}{e.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── ADD MANUAL: one straggler not in the photographed book ── */}
        {screen === 'add-manual' && (
          <div className="pos-reveal">
            <Input label={tc('retail_credit.who_label')} value={manualName} onChange={e => setManualName(e.target.value)} placeholder={tc('retail_credit.name_placeholder')} />
            <Input value={manualPhone} onChange={e => setManualPhone(e.target.value)} placeholder={tc('retail_credit.phone_placeholder')} />
            <Input label={tc('retail_credit.amount_owed_label')} value={manualAmount} onChange={e => setManualAmount(e.target.value.replace(/[^\d.]/g, ''))} inputMode="decimal" placeholder="0" />
            <Button variant="primary" size="lg" onClick={saveManual} loading={manualSaving} loadingLabel={tc('retail_credit.saving')} style={{ width: '100%', marginBottom: 10 }}>
              {tc('retail_credit.save')}
            </Button>
            <Button variant="secondary" size="lg" onClick={() => setScreen('list')} style={{ width: '100%' }}>{tc('retail_credit.cancel')}</Button>
          </div>
        )}

        {/* ── IMPORT CAMERA: snap the debt book ── */}
        {screen === 'import-camera' && (
          <div className="pos-reveal">
            <p style={{ fontSize: 14, color: tokens.muted, lineHeight: 1.6, marginBottom: 16 }}>{tc('retail_credit.import_subtitle')}</p>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '4 / 3', borderRadius: 16, overflow: 'hidden', background: '#000', marginBottom: 16 }}>
              <video ref={videoRef} playsInline muted autoPlay style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {importBusy && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600 }}>
                  {tc('retail_credit.import_reading')}
                </div>
              )}
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <Button variant="primary" size="lg" onClick={captureDebtBook} loading={importBusy} loadingLabel={tc('retail_credit.import_reading')} style={{ width: '100%', marginBottom: 10 }}>
              {tc('retail_credit.import_snap')}
            </Button>
            <Button variant="secondary" size="lg" onClick={() => { stopCamera(); setScreen('list') }} disabled={importBusy} style={{ width: '100%' }}>{tc('retail_credit.cancel')}</Button>
          </div>
        )}

        {/* ── IMPORT REVIEW: confirm every line before saving ── */}
        {screen === 'import-review' && (
          <div className="pos-reveal">
            <p style={{ fontSize: 14, color: tokens.muted, lineHeight: 1.6, marginBottom: 16 }}>
              {tc('retail_credit.import_review', { count: importItems.length })}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {importItems.map((it, i) => (
                <div key={i} className="pos-item" style={{ display: 'flex', alignItems: 'center', gap: 8, background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 10, padding: 8, animationDelay: `${Math.min(i, 8) * 40}ms` }}>
                  <input value={it.name} onChange={e => editImportItem(i, { name: e.target.value })} placeholder={tc('retail_credit.name_placeholder')} style={{ ...inp, flex: 1, minWidth: 0 }} />
                  <span style={{ color: tokens.hint, fontWeight: 700 }}>{sym}</span>
                  <input value={it.amount ? String(it.amount) : ''} onChange={e => editImportItem(i, { amount: parseFloat(e.target.value.replace(/[^\d.]/g, '')) || 0 })} inputMode="decimal" placeholder="0" style={{ ...inp, width: 80, textAlign: 'right' }} />
                  <Button variant="ghost" onClick={() => removeImportItem(i)} aria-label={tc('retail_credit.remove')} style={{ fontSize: 18, padding: '0 4px' }}>✕</Button>
                </div>
              ))}
            </div>
            <Button variant="primary" size="lg" onClick={commitImport} loading={importBusy} loadingLabel={tc('retail_credit.saving')} style={{ width: '100%', marginBottom: 10 }}>
              {tc('retail_credit.import_save', { count: importItems.filter(it => it.name.trim() || it.phone.trim()).length })}
            </Button>
            <Button variant="secondary" size="lg" onClick={openImportCamera} disabled={importBusy} style={{ width: '100%' }}>{tc('retail_credit.import_retake')}</Button>
          </div>
        )}
      </div>
    </div>
  )
}
