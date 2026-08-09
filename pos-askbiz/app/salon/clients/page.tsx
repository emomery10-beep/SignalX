'use client'
import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePosAuth } from '@/lib/hooks/usePosAuth'
import { usePosConfig } from '@/lib/hooks/usePosConfig'
import { useLang } from '@/components/LanguageProvider'
import LanguageToggle from '@/components/LanguageToggle'
import { tokens, Button, Banner, Input, Textarea, Card, ListItem } from '@/components/ui'

// Local warning pale — tokens.ts only ships a solid `warning`, same
// convention Banner.tsx uses for its own warning tone.
const warningPale = 'rgba(249,115,22,.08)'

interface TxItem { name: string; qty: number; unit_price: number }
interface Tx {
  id: string
  total: number
  created_at: string
  status: string
  pos_items?: TxItem[]
  pos_customers?: { id?: string; name?: string; phone?: string } | null
  cashier?: { id?: string; name?: string } | null
}

interface SalonClient {
  id: string
  name: string
  phone: string | null
  email: string | null
  birthday: string | null
  notes: string | null
  last_visit_at: string | null
  created_at: string
}

interface Client {
  key: string
  salonId: string | null   // salon_clients.id when a persisted record exists
  name: string
  phone: string
  notes: string
  visits: number
  totalSpend: number
  lastVisit: string
  firstVisit: string
  txs: Tx[]
}

interface Photo {
  id: string
  dataUrl: string
  tag: 'Before' | 'After'
  service: string
  at: number
}

interface ApiPhoto {
  id: string
  photo_url: string
  kind: 'before' | 'after'
  service_type: string | null
  created_at: string
}

interface ApiFormula {
  id: string
  formula: string
  created_at: string
}

function fmtDate(iso: string) { return new Date(iso).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }) }
function daysSince(iso: string) { return Math.floor((Date.now() - +new Date(iso)) / 86400000) }

// Client segmentation: VIP (5+ visits), Regular (2-4), New (1), Lapsed (>90 days since last visit)
function segment(c: Client, tc: (key: string) => string): { label: string; color: string; bg: string } {
  if (daysSince(c.lastVisit) > 90) return { label: tc('salon_clients.seg_lapsed'), color: tokens.danger, bg: tokens.dangerPale }
  if (c.visits >= 5) return { label: tc('salon_clients.seg_vip'), color: tokens.accent, bg: tokens.accentPale }
  if (c.visits >= 2) return { label: tc('salon_clients.seg_regular'), color: tokens.success, bg: tokens.successPale }
  return { label: tc('salon_clients.seg_new'), color: tokens.warning, bg: warningPale }
}

export default function SalonClients() {
  const router = useRouter()
  const { tc } = useLang()
  const { session, ready: authReady } = usePosAuth()
  const { sym } = usePosConfig(session, authReady)
  const [loading, setLoading] = useState(true)
  const [txs, setTxs] = useState<Tx[]>([])
  const [salonClients, setSalonClients] = useState<SalonClient[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    if (!authReady || !session) return
    load()
  }, [authReady, session])

  async function load() {
    setLoading(true)
    try {
      // Merge persisted salon clients with profiles derived from POS transaction customers.
      const [txRes, clientRes] = await Promise.all([
        fetch('/api/pos/transactions?limit=500', { headers: { ...session!.headers } }),
        fetch('/api/pos/salon/clients', { headers: { ...session!.headers } }),
      ])
      const txData = await txRes.json()
      const clientData = await clientRes.json()
      setTxs(txData.transactions || [])
      setSalonClients(clientData.clients || [])
    } catch (e) {
      console.error('Clients load error:', e)
    } finally {
      setLoading(false)
    }
  }

  const clients = useMemo<Client[]>(() => {
    const map: Record<string, Client> = {}
    txs.forEach(t => {
      const cust = t.pos_customers
      if (!cust || (!cust.phone && !cust.name)) return // skip true anonymous walk-ins
      const key = cust.phone || cust.name || t.id
      if (!map[key]) {
        map[key] = { key, salonId: null, name: cust.name || tc('salon_clients.unnamed'), phone: cust.phone || '', notes: '', visits: 0, totalSpend: 0, lastVisit: t.created_at, firstVisit: t.created_at, txs: [] }
      }
      const c = map[key]
      c.visits += 1
      c.totalSpend += t.total || 0
      c.txs.push(t)
      if (+new Date(t.created_at) > +new Date(c.lastVisit)) c.lastVisit = t.created_at
      if (+new Date(t.created_at) < +new Date(c.firstVisit)) c.firstVisit = t.created_at
    })

    // Merge persisted salon clients: attach to a matching tx-derived profile (by phone or name),
    // otherwise add as a standalone client record.
    salonClients.forEach(sc => {
      const match = Object.values(map).find(c =>
        (sc.phone && c.phone && c.phone === sc.phone) ||
        (!sc.phone && c.name.toLowerCase() === sc.name.toLowerCase())
      )
      if (match) {
        match.salonId = sc.id
        if (sc.notes) match.notes = sc.notes
        if (sc.phone && !match.phone) match.phone = sc.phone
      } else {
        const when = sc.last_visit_at || sc.created_at
        map[`salon:${sc.id}`] = {
          key: `salon:${sc.id}`, salonId: sc.id, name: sc.name, phone: sc.phone || '', notes: sc.notes || '',
          visits: 0, totalSpend: 0, lastVisit: when, firstVisit: sc.created_at, txs: [],
        }
      }
    })

    return Object.values(map).sort((a, b) => +new Date(b.lastVisit) - +new Date(a.lastVisit))
  }, [txs, salonClients, tc])

  async function reloadClients() {
    try {
      const res = await fetch('/api/pos/salon/clients', { headers: { ...session?.headers } })
      const data = await res.json()
      setSalonClients(data.clients || [])
    } catch (e) {
      console.error('Reload clients error:', e)
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return clients
    return clients.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q))
  }, [clients, search])

  const current = useMemo(() => clients.find(c => c.key === selected) || null, [clients, selected])

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: tokens.bg, color: tokens.ink, fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: tokens.surface, borderBottom: `1px solid ${tokens.border}`, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Button variant="secondary" onClick={() => (current ? setSelected(null) : router.push('/salon'))}>
            ← {current ? tc('salon_clients.back_clients') : tc('salon_clients.back_salon')}
          </Button>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: tokens.accent }}>{tc('salon_clients.header_title')}</div>
            <div style={{ fontSize: 12, color: tokens.muted }}>{current ? current.name : tc('salon_clients.header_subtitle')}</div>
          </div>
        </div>
      </div>

      {/* Account bar — language + sign out, same slim row on every salon screen */}
      <div style={{ background: tokens.surface, borderBottom: `1px solid ${tokens.border}`, padding: '6px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
        <LanguageToggle inline />
        <button onClick={() => { localStorage.removeItem('pos_staff'); router.push('/') }}
          style={{ background: tokens.bg, border: `1px solid ${tokens.border}`, color: tokens.muted, padding: '5px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
          {tc('common.sign_out')}
        </button>
      </div>

      <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
        {!current && (
          <>
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={tc('salon_clients.search_placeholder')}
              style={{ fontSize: 14, padding: '12px 16px', marginBottom: 4 }}
            />
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.3fr 0.8fr 1fr 1.2fr 90px', gap: 8, padding: '12px 16px', borderBottom: `1px solid ${tokens.border}`, fontSize: 11, color: tokens.hint, textTransform: 'uppercase', letterSpacing: 1 }}>
                <div>{tc('salon_clients.col_name')}</div><div>{tc('salon_clients.col_phone')}</div><div>{tc('salon_clients.col_visits')}</div><div>{tc('salon_clients.col_spend')}</div><div>{tc('salon_clients.col_last_visit')}</div><div>{tc('salon_clients.col_tier')}</div>
              </div>
              {loading && <div style={{ padding: 20, color: tokens.hint, fontSize: 13 }}>{tc('salon_clients.loading')}</div>}
              {!loading && filtered.length === 0 && <div style={{ padding: 20, color: tokens.hint, fontSize: 13, textAlign: 'center' }}>{tc('salon_clients.empty_clients')}</div>}
              {filtered.map((c, idx) => {
                const seg = segment(c, tc)
                return (
                  <button key={c.key} type="button" className="pos-item" onClick={() => setSelected(c.key)}
                    style={{ display: 'grid', gridTemplateColumns: '2fr 1.3fr 0.8fr 1fr 1.2fr 90px', gap: 8, padding: '12px 16px', borderBottom: `1px solid ${tokens.border}`, fontSize: 13, alignItems: 'center', cursor: 'pointer', animationDelay: `${Math.min(idx, 8) * 40}ms`, width: '100%', background: 'transparent', border: 'none', color: 'inherit', textAlign: 'left', fontFamily: 'inherit' }}
                    onMouseEnter={e => (e.currentTarget.style.background = tokens.accentPale)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ fontWeight: 600 }}>{c.name}</div>
                    <div style={{ color: tokens.muted }}>{c.phone || tc('salon_clients.no_phone_dash')}</div>
                    <div>{c.visits}</div>
                    <div style={{ fontWeight: 700 }}>{sym}{c.totalSpend.toFixed(2)}</div>
                    <div style={{ color: tokens.muted }}>{fmtDate(c.lastVisit)}</div>
                    <div><span style={{ background: seg.bg, color: seg.color, borderRadius: 12, padding: '3px 9px', fontSize: 11, fontWeight: 700 }}>{seg.label}</span></div>
                  </button>
                )
              })}
            </Card>
          </>
        )}

        {current && <ClientProfile client={current} sym={sym} session={session} onClientPersisted={reloadClients} />}
      </div>
    </div>
  )
}

// ─── Client profile + camera-first before/after capture ──────────────────────
function ClientProfile({ client, sym, session, onClientPersisted }: { client: Client; sym: string; session: any; onClientPersisted: () => void }) {
  const { tc } = useLang()
  const seg = segment(client, tc)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [notes, setNotes] = useState('')
  const [formula, setFormula] = useState('')
  const [savedFlash, setSavedFlash] = useState(false)
  // The persisted salon_clients.id — created lazily on first save if the client is tx-only.
  const salonIdRef = useRef<string | null>(client.salonId)

  // Camera state
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [camActive, setCamActive] = useState(false)
  const [camError, setCamError] = useState<string | null>(null)
  const [pendingTag, setPendingTag] = useState<'Before' | 'After'>('Before')
  const [pendingService, setPendingService] = useState('')

  const authHeaders = session?.headers || {}

  // Favourite service (most frequent item)
  const favourite = useMemo(() => {
    const count: Record<string, number> = {}
    client.txs.forEach(t => (t.pos_items || []).forEach(i => { count[i.name] = (count[i.name] || 0) + (i.qty || 1) }))
    const top = Object.entries(count).sort((a, b) => b[1] - a[1])[0]
    return top ? top[0] : tc('salon_clients.favourite_none')
  }, [client, tc])

  // Load persisted data from the salon endpoints
  useEffect(() => {
    salonIdRef.current = client.salonId
    setNotes(client.notes || '')
    setPhotos([])
    setFormula('')
    setPendingService(favourite !== tc('salon_clients.favourite_none') ? favourite : '')
    if (client.salonId) loadProfileData(client.salonId)
    return () => stopCamera()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client.key])

  async function loadProfileData(salonId: string) {
    try {
      const [photoRes, formulaRes] = await Promise.all([
        fetch(`/api/pos/salon/client-photos?client_id=${salonId}`, { headers: { ...authHeaders } }),
        fetch(`/api/pos/salon/color-formulas?client_id=${salonId}`, { headers: { ...authHeaders } }),
      ])
      const photoData = await photoRes.json()
      const formulaData = await formulaRes.json()
      setPhotos((photoData.photos || []).map((p: ApiPhoto): Photo => ({
        id: p.id,
        dataUrl: p.photo_url,
        tag: p.kind === 'after' ? 'After' : 'Before',
        service: p.service_type || tc('salon_clients.service_general'),
        at: +new Date(p.created_at),
      })))
      // Most recent formula populates the editor.
      const latest = (formulaData.formulas || [])[0] as ApiFormula | undefined
      if (latest) setFormula(latest.formula)
    } catch (e) {
      console.error('Load profile data error:', e)
    }
  }

  // Ensure a persisted salon_clients record exists, returning its id.
  async function ensureSalonId(): Promise<string | null> {
    if (salonIdRef.current) return salonIdRef.current
    try {
      const res = await fetch('/api/pos/salon/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({ name: client.name, phone: client.phone || null }),
      })
      const data = await res.json()
      if (data.client?.id) {
        salonIdRef.current = data.client.id
        onClientPersisted()
        return data.client.id
      }
    } catch (e) {
      console.error('Ensure salon client error:', e)
    }
    return null
  }

  async function saveNotes() {
    const salonId = await ensureSalonId()
    if (!salonId) return
    try {
      await fetch('/api/pos/salon/clients', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({ id: salonId, notes }),
      })
      if (formula.trim()) {
        await fetch('/api/pos/salon/color-formulas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...authHeaders },
          body: JSON.stringify({ client_id: salonId, formula }),
        })
      }
      onClientPersisted()
      setSavedFlash(true)
      setTimeout(() => setSavedFlash(false), 1500)
    } catch (e) {
      console.error('Save notes error:', e)
    }
  }

  async function startCamera() {
    setCamError(null)
    if (!navigator.mediaDevices?.getUserMedia) {
      setCamError(tc('salon_clients.cam_err_unavailable'))
      fileRef.current?.click()
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      setCamActive(true)
    } catch (err: any) {
      const name = err?.name || ''
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setCamError(tc('salon_clients.cam_err_denied'))
      } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
        setCamError(tc('salon_clients.cam_err_notfound'))
      } else if (name === 'NotReadableError') {
        setCamError(tc('salon_clients.cam_err_inuse'))
      } else {
        setCamError(tc('salon_clients.cam_err_generic'))
      }
    }
  }

  function stopCamera() {
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null }
    setCamActive(false)
  }

  const attachVideo = useCallback((el: HTMLVideoElement | null) => {
    videoRef.current = el
    if (el && streamRef.current) { el.srcObject = streamRef.current; el.play().catch(() => {}) }
  }, [])

  function capture() {
    const video = videoRef.current, canvas = canvasRef.current
    if (!video || !canvas) return
    const w = video.videoWidth || 720, h = video.videoHeight || 960
    canvas.width = w; canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0, w, h)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
    addPhoto(dataUrl)
  }

  function onFilePicked(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => { if (typeof reader.result === 'string') addPhoto(reader.result) }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function addPhoto(dataUrl: string) {
    const tag = pendingTag
    const service = pendingService || tc('salon_clients.service_general')
    // Optimistic local entry; replaced by the persisted record on upload success.
    const tempId = `tmp-${Date.now()}`
    const temp: Photo = { id: tempId, dataUrl, tag, service, at: Date.now() }
    setPhotos(prev => [temp, ...prev])
    uploadPhoto(dataUrl, tag, service, tempId)
    // Flip tag for convenient before→after flow
    setPendingTag(t => (t === 'Before' ? 'After' : 'Before'))
  }

  async function uploadPhoto(dataUrl: string, tag: 'Before' | 'After', service: string, tempId: string) {
    const salonId = await ensureSalonId()
    if (!salonId) return
    try {
      const res = await fetch('/api/pos/salon/client-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({
          client_id: salonId,
          image: dataUrl,
          kind: tag === 'Before' ? 'before' : 'after',
          service_type: service,
        }),
      })
      const data = await res.json()
      if (data.photo) {
        const saved: Photo = {
          id: data.photo.id,
          dataUrl: data.photo.photo_url,
          tag: data.photo.kind === 'after' ? 'After' : 'Before',
          service: data.photo.service_type || tc('salon_clients.service_general'),
          at: +new Date(data.photo.created_at),
        }
        setPhotos(prev => prev.map(p => (p.id === tempId ? saved : p)))
      }
    } catch (e) {
      console.error('Upload photo error:', e)
    }
  }

  const befores = photos.filter(p => p.tag === 'Before')
  const afters = photos.filter(p => p.tag === 'After')

  return (
    <div className="pos-screen">
      {/* Summary */}
      <Card style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: tokens.accentPale, color: tokens.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700 }}>
          {client.name.charAt(0).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{client.name}</div>
          <div style={{ fontSize: 13, color: tokens.muted }}>{client.phone || tc('salon_clients.summary_no_phone')}</div>
        </div>
        <span style={{ background: seg.bg, color: seg.color, borderRadius: 12, padding: '5px 14px', fontSize: 13, fontWeight: 700 }}>{seg.label}</span>
        {[
          { label: tc('salon_clients.stat_visits'), value: `${client.visits}` },
          { label: tc('salon_clients.stat_total_spend'), value: `${sym}${client.totalSpend.toFixed(2)}` },
          { label: tc('salon_clients.stat_favourite'), value: favourite },
          { label: tc('salon_clients.stat_last_visit'), value: fmtDate(client.lastVisit) },
        ].map(s => (
          <div key={s.label} style={{ minWidth: 90 }}>
            <div style={{ fontSize: 10, color: tokens.hint, textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: tokens.ink }}>{s.value}</div>
          </div>
        ))}
      </Card>

      {/* Before/After capture — the camera-first feature */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{tc('salon_clients.capture_title')}</div>
        <div style={{ fontSize: 12, color: tokens.hint, marginBottom: 14 }}>{tc('salon_clients.capture_subtitle')}</div>

        {/* Tag + service selectors */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['Before', 'After'] as const).map(t => (
              <Button key={t} variant={pendingTag === t ? 'primary' : 'secondary'} onClick={() => setPendingTag(t)} style={{ padding: '8px 18px' }}>
                {t === 'Before' ? tc('salon_clients.tag_before') : tc('salon_clients.tag_after')}
              </Button>
            ))}
          </div>
          {/* Kept as a hand-styled input — sits inline with the Before/After button
              group and the shared Input's 16px bottom-margin wrapper would break
              this row's vertical centering. */}
          <input value={pendingService} onChange={e => setPendingService(e.target.value)} placeholder={tc('salon_clients.service_placeholder')}
            style={{ flex: 1, minWidth: 160, background: tokens.bg, border: `1px solid ${tokens.border}`, color: tokens.ink, borderRadius: 8, padding: '8px 12px', fontSize: 13, fontFamily: 'inherit' }} />
        </div>

        {/* Camera viewport */}
        {camError && <Banner tone="warning">{camError}</Banner>}

        {camActive ? (
          <div className="pos-reveal" style={{ marginBottom: 12 }}>
            <video ref={attachVideo} autoPlay playsInline muted style={{ width: '100%', maxWidth: 420, borderRadius: 10, background: '#000', display: 'block' }} />
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              <Button variant="primary" onClick={capture}>{tc('salon_clients.cam_capture', { tag: pendingTag === 'Before' ? tc('salon_clients.tag_before') : tc('salon_clients.tag_after') })}</Button>
              <Button variant="secondary" onClick={stopCamera}>{tc('salon_clients.cam_stop')}</Button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
            <Button variant="primary" onClick={startCamera}>{tc('salon_clients.cam_open')}</Button>
            <Button variant="secondary" onClick={() => fileRef.current?.click()}>{tc('salon_clients.cam_upload')}</Button>
          </div>
        )}

        {/* Fallback file input (also used on devices without getUserMedia) */}
        <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={onFilePicked} style={{ display: 'none' }} />
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Gallery — paired before/after columns */}
        {photos.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 8 }}>
            {[{ title: tc('salon_clients.tag_before'), list: befores }, { title: tc('salon_clients.tag_after'), list: afters }].map(col => (
              <div key={col.title}>
                <div style={{ fontSize: 12, color: tokens.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{tc('salon_clients.gallery_count', { title: col.title, count: col.list.length })}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {col.list.length === 0 && <div style={{ fontSize: 12, color: tokens.hint }}>{tc('salon_clients.gallery_no_photos', { label: col.title.toLowerCase() })}</div>}
                  {col.list.map((p, idx) => (
                    <ListItem key={p.id} index={idx} style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: `1px solid ${tokens.border}` }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.dataUrl} alt={`${p.tag} ${p.service}`} style={{ width: '100%', display: 'block' }} />
                      <div style={{ position: 'absolute', top: 6, left: 6, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 11, padding: '2px 8px', borderRadius: 6 }}>{p.service}</div>
                      <div style={{ fontSize: 10, color: tokens.hint, padding: '4px 6px' }}>{new Date(p.at).toLocaleString()}</div>
                    </ListItem>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Color formula + notes */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>{tc('salon_clients.formula_title')}</div>
        <div style={{ fontSize: 11, color: tokens.hint, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{tc('salon_clients.formula_label')}</div>
        <Textarea value={formula} onChange={e => setFormula(e.target.value)} placeholder={tc('salon_clients.formula_placeholder')} />
        <div style={{ fontSize: 11, color: tokens.hint, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{tc('salon_clients.notes_label')}</div>
        <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder={tc('salon_clients.notes_placeholder')} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: -4 }}>
          <Button variant="primary" onClick={saveNotes}>{tc('salon_clients.save')}</Button>
          {savedFlash && <span className="pos-success-icon" style={{ color: tokens.success, fontSize: 13 }}>{tc('salon_clients.saved')}</span>}
        </div>
      </Card>

      {/* Visit history */}
      <Card>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>{tc('salon_clients.visit_history_title')}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {client.txs.slice().sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)).map((t, idx) => (
            <div key={t.id} className="pos-item" style={{ display: 'flex', alignItems: 'center', gap: 12, background: tokens.bg, borderRadius: 8, padding: '10px 14px', animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
              <div style={{ fontSize: 13, color: tokens.accent, fontWeight: 600, width: 110 }}>{fmtDate(t.created_at)}</div>
              <div style={{ flex: 1, fontSize: 13, color: tokens.ink }}>{(t.pos_items || []).map(i => i.name).join(', ') || tc('salon_clients.visit_service_fallback')}</div>
              <div style={{ fontSize: 12, color: tokens.muted }}>{t.cashier?.name || tc('salon_clients.no_phone_dash')}</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{sym}{(t.total || 0).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
