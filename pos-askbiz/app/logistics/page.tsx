'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { isLogisticsHandlerLevel, isLogisticsDispatchLevel, isLogisticsBranchLevel, getRoleHomeRoute } from '@/lib/pos-role-client'
import { useLang } from '@/components/LanguageProvider'

const ACC = '#0891b2'
const ACC_LIGHT = 'rgba(8,145,178,.1)'
const ACC_BORDER = 'rgba(8,145,178,.25)'
const GREEN = '#16a34a'
const RED = '#dc2626'
const AMBER = '#ca8a04'
const API = process.env.NEXT_PUBLIC_API_URL || ''

// Compress a camera/gallery photo to a small JPEG data URL. Uses
// createImageBitmap (robust on iOS) so large phone photos don't blank the
// canvas, and keeps the upload well under the serverless body limit.
async function compressPhoto(file: File, maxEdge = 1600, quality = 0.82): Promise<string> {
  const draw = (src: CanvasImageSource, w: number, h: number): string | null => {
    const c = document.createElement('canvas')
    c.width = Math.max(1, w); c.height = Math.max(1, h)
    const ctx = c.getContext('2d')
    if (!ctx) return null
    ctx.drawImage(src, 0, 0, c.width, c.height)
    return c.toDataURL('image/jpeg', quality)
  }
  if (typeof createImageBitmap === 'function') {
    try {
      const bmp = await createImageBitmap(file)
      const scale = Math.min(1, maxEdge / Math.max(bmp.width, bmp.height))
      const out = draw(bmp, Math.round(bmp.width * scale), Math.round(bmp.height * scale))
      bmp.close?.()
      if (out && out.length > 120) return out
    } catch { /* fall through */ }
  }
  const dataUrl: string = await new Promise((res, rej) => {
    const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = () => rej(r.error); r.readAsDataURL(file)
  })
  try {
    const img: HTMLImageElement = await new Promise((res, rej) => {
      const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('decode')); i.src = dataUrl
    })
    const scale = Math.min(1, maxEdge / Math.max(img.width, img.height))
    const out = draw(img, Math.round(img.width * scale), Math.round(img.height * scale))
    if (out && out.length > 120) return out
  } catch { /* fall through */ }
  return dataUrl
}

interface StaffSession {
  id: string; name: string; role: string
  owner_id: string; location_id: string | null; currency_symbol: string; business_type: string
}

interface ScanResult {
  document_type: 'waybill' | 'invoice' | 'receipt' | 'unknown'
  confidence: number
  data: Record<string, any>
  message?: string
}

interface Parcel {
  id: string; tracking_number: string; status: string
  sender_name: string | null; sender_phone: string | null
  receiver_name: string | null; receiver_phone: string | null
  destination_city: string | null; description: string | null
  weight_kg: number | null; fee_charged: number | null
  created_at: string
  delivery_type?: string | null
  destination_branch_id?: string | null
  assigned_truck_id?: string | null
  assigned_driver_id?: string | null
  truck?: { id: string; plate_number: string } | null
  destination_branch?: { id: string; name: string } | null
}

interface Truck {
  id: string; plate_number: string; make_model: string | null; status: string
}

type Screen = 'camera' | 'confirm' | 'parcels' | 'release' | 'success' | 'handler_incoming'
  | 'driver_home' | 'driver_parcels' | 'driver_deliver' | 'driver_fail' | 'driver_checkpoint'
  | 'inspection' | 'inspection_done'
type Mode = 'in' | 'out'

const buildInspectionSteps = (tc: (key: string) => string) => [
  { key: 'photo_front', label: tc('logistics.inspection_step_photo_front'), icon: '🚛' },
  { key: 'photo_rear', label: tc('logistics.inspection_step_photo_rear'), icon: '🔙' },
  { key: 'photo_left', label: tc('logistics.inspection_step_photo_left'), icon: '◀️' },
  { key: 'photo_right', label: tc('logistics.inspection_step_photo_right'), icon: '▶️' },
  { key: 'photo_tyres', label: tc('logistics.inspection_step_photo_tyres'), icon: '🛞' },
  { key: 'photo_cargo', label: tc('logistics.inspection_step_photo_cargo'), icon: '📦' },
]

const FAIL_REASON_KEYS = [
  'not_home', 'refused_delivery', 'wrong_address', 'phone_unreachable',
  'area_inaccessible', 'customer_rescheduled', 'other',
]

const ISSUE_KEYS = [
  'tyre_wear', 'body_damage', 'light_broken', 'mirror_damaged',
  'cargo_area_dirty', 'fluid_leak', 'brake_issue',
]
const STATUS_COLOR: Record<string, string> = {
  received: AMBER, at_branch: ACC, assigned: ACC, loaded: ACC,
  in_transit: '#6366f1', at_destination: GREEN, out_for_delivery: '#6366f1',
  delivered: GREEN, collected: GREEN, failed_delivery: RED, returned: RED,
}

function timeAgo(iso: string, tc: (key: string, vars?: Record<string, string | number>) => string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return tc('logistics.time_just_now')
  if (s < 3600) return tc('logistics.time_minutes_ago', { count: Math.floor(s / 60) })
  if (s < 86400) return tc('logistics.time_hours_ago', { count: Math.floor(s / 3600) })
  return new Date(iso).toLocaleDateString()
}

export default function LogisticsPage() {
  const router = useRouter()
  const { tc } = useLang()
  const INSPECTION_STEPS = buildInspectionSteps(tc)
  const STATUS_LABEL: Record<string, string> = {
    received: tc('logistics.status_received'), at_branch: tc('logistics.status_at_branch'), assigned: tc('logistics.status_assigned'),
    loaded: tc('logistics.status_loaded'), in_transit: tc('logistics.status_in_transit'), at_destination: tc('logistics.status_at_destination'),
    out_for_delivery: tc('logistics.status_out_for_delivery'), delivered: tc('logistics.status_delivered'),
    collected: tc('logistics.status_collected'), failed_delivery: tc('logistics.status_failed_delivery'), returned: tc('logistics.status_returned'),
  }
  const [staff, setStaff] = useState<StaffSession | null>(null)
  const [screen, setScreen] = useState<Screen>('camera')
  const [mode, setMode] = useState<Mode>('in')

  // Camera
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const docInputRef = useRef<HTMLInputElement>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [scanError, setScanError] = useState('')
  const [capturedImage, setCapturedImage] = useState('')
  const [capturedPhoto, setCapturedPhoto] = useState('') // native-capture photo for deliver/checkpoint
  const camFileRef = useRef<HTMLInputElement>(null)

  // Scan result + editing
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [editFields, setEditFields] = useState<Record<string, any>>({})
  const [saving, setSaving] = useState(false)

  // Parcels list (for release mode)
  const [parcels, setParcels] = useState<Parcel[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null)
  const [collectName, setCollectName] = useState('')

  // Stats
  const [todayIn, setTodayIn] = useState(0)
  const [todayOut, setTodayOut] = useState(0)

  // Geo
  const [geoCoords, setGeoCoords] = useState<{ lat: number; lng: number } | null>(null)
  const geoCoordsRef = useRef<{ lat: number; lng: number } | null>(null)
  const selectedTruckRef = useRef<Truck | null>(null)
  const lastPingRef = useRef<number>(0)

  // Success
  const [successMsg, setSuccessMsg] = useState('')
  const [successTracking, setSuccessTracking] = useState('')

  // Driver-specific
  const [myParcels, setMyParcels] = useState<Parcel[]>([])
  const [driverLoading, setDriverLoading] = useState(false)
  const [incoming, setIncoming] = useState<Parcel[]>([])
  const [incomingLoading, setIncomingLoading] = useState(false)
  const [failReason, setFailReason] = useState('')
  const [deliveryNotes, setDeliveryNotes] = useState('')
  const [trucks, setTrucks] = useState<Truck[]>([])
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null)

  // Vehicle inspection
  const [inspectionStep, setInspectionStep] = useState(0)
  const [inspectionPhotos, setInspectionPhotos] = useState<Record<string, string>>({})
  const [inspectionType, setInspectionType] = useState<'pre_trip' | 'post_trip'>('pre_trip')
  const [flaggedIssues, setFlaggedIssues] = useState<string[]>([])
  const [inspectionNotes, setInspectionNotes] = useState('')

  // Video proof
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [captureMode, setCaptureMode] = useState<'photo' | 'video'>('photo')
  const [isRecording, setIsRecording] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const [capturedVideo, setCapturedVideo] = useState<string | null>(null)

  // ── Init ─────────────────────────────────────────────────
  useEffect(() => {
    const raw = localStorage.getItem('pos_staff')
    if (!raw) { router.push('/'); return }
    const s = JSON.parse(raw) as StaffSession
    if (!isLogisticsHandlerLevel(s.role)) {
      router.push(getRoleHomeRoute(s.role))
      return
    }
    setStaff(s)
    loadTodayStats(s)
    if (s.role === 'driver' || s.role === 'logistics-driver') {
      setScreen('driver_home')
      loadDriverParcels(s)
      loadTrucks(s)
    }
    // Handlers land on the camera screen (default) which now uses native
    // capture — no live getUserMedia needed.

    const isDriver = s.role === 'driver' || s.role === 'logistics-driver'

    if (navigator.geolocation) {
      // Drivers post a live GPS ping every ~60s while they have a truck; the
      // branch dashboard map reads the latest ping. (Retention purges after 90d.)
      const PING_INTERVAL = 60_000
      const doGeo = () => navigator.geolocation.getCurrentPosition(
        pos => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          setGeoCoords(coords)
          geoCoordsRef.current = coords
          if (isDriver) {
            const truck = selectedTruckRef.current
            const now = Date.now()
            if (truck && now - lastPingRef.current >= PING_INTERVAL - 5_000) {
              lastPingRef.current = now
              postTruckLocation(s, truck.id, coords.lat, coords.lng)
            }
          }
        },
        () => {},
        { enableHighAccuracy: true, maximumAge: 30_000, timeout: 20_000 }
      )
      doGeo()
      const geoTimer = setInterval(doGeo, PING_INTERVAL)
      return () => clearInterval(geoTimer)
    }
  }, [])

  // Keep refs in sync so the geo interval closure reads the latest values
  useEffect(() => { selectedTruckRef.current = selectedTruck }, [selectedTruck])

  // POST a GPS ping to the server (records a truck location)
  const postTruckLocation = async (s: StaffSession, truckId: string, lat: number, lng: number) => {
    try {
      await fetch(`${API}/api/pos/truck-locations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-staff-id': s.id, 'x-owner-id': s.owner_id },
        body: JSON.stringify({ truck_id: truckId, lat, lng }),
      })
    } catch {}
  }

  const headers = useCallback(() => ({
    'Content-Type': 'application/json',
    'x-staff-id': staff?.id || '',
    'x-owner-id': staff?.owner_id || '',
  }), [staff])

  const loadTodayStats = async (s: StaffSession) => {
    const from = new Date(); from.setHours(0, 0, 0, 0)
    try {
      const res = await fetch(`${API}/api/pos/parcels?from=${from.toISOString()}&limit=200`, {
        headers: { 'x-staff-id': s.id, 'x-owner-id': s.owner_id },
      })
      const data = await res.json()
      const p = data.parcels || []
      setTodayIn(p.filter((x: any) => x.received_by === s.id).length)
      setTodayOut(p.filter((x: any) => ['delivered', 'collected'].includes(x.status) && (x.delivered_by === s.id || x.released_by === s.id)).length)
    } catch {}
  }

  // ── Camera ───────────────────────────────────────────────
  const startCamera = async () => {
    setScanError(''); setScanResult(null); setCapturedImage(''); setCameraActive(false)
    // Stop any existing stream before opening a new one to avoid leaked tracks
    const existing = videoRef.current?.srcObject as MediaStream | null
    if (existing) { existing.getTracks().forEach(t => t.stop()); if (videoRef.current) videoRef.current.srcObject = null }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      })
      // The target screen's <video> may not be mounted yet (setScreen is async),
      // so wait for the ref before attaching — otherwise the stream is orphaned
      // and the viewfinder stays black while capture grabs an empty frame.
      let tries = 0
      while (!videoRef.current && tries < 60) { await new Promise(r => requestAnimationFrame(() => r(null))); tries++ }
      const v = videoRef.current
      if (!v) { stream.getTracks().forEach(t => t.stop()); setScanError(tc('logistics.camera_not_available')); return }
      v.srcObject = stream
      await v.play().catch(() => {})
      // Wait until the camera is actually producing frames (videoWidth > 0)
      if (v.readyState < 2 || !v.videoWidth) {
        await new Promise<void>(res => {
          const done = () => { v.removeEventListener('loadeddata', done); res() }
          v.addEventListener('loadeddata', done)
          setTimeout(res, 3000)
        })
      }
      setCameraActive(true)
    } catch {
      setScanError(tc('logistics.camera_not_available'))
      setCameraActive(false)
    }
  }

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream
    stream?.getTracks().forEach(t => t.stop())
    if (videoRef.current) videoRef.current.srcObject = null
    setCameraActive(false)
  }

  // Native-camera scan (reliable on iOS / private mode) — opens the OS camera,
  // compresses the photo, and runs the same document-reading flow.
  const scanFile = async (file: File) => {
    if (scanning) return
    setScanError(''); setScanResult(null); setScanning(true)
    try {
      const dataUrl = await compressPhoto(file)
      setCapturedImage(dataUrl)
      const res = await fetch(`${API}/api/pos/parcels/scan`, {
        method: 'POST', headers: headers(), body: JSON.stringify({ image: dataUrl }),
      })
      const result: ScanResult = await res.json()
      if (result.document_type === 'unknown' || !result.document_type) {
        setScanError(result.message || tc('logistics.scan_could_not_identify'))
        setScanning(false); return
      }
      setScanResult(result)
      setEditFields({ ...result.data })
      setScreen('confirm')
    } catch {
      setScanError(tc('logistics.scan_failed'))
    }
    setScanning(false)
  }

  const captureAndScan = async () => {
    if (!canvasRef.current || !videoRef.current || scanning) return
    const canvas = canvasRef.current
    const video = videoRef.current
    // Don't capture before the camera is producing frames — avoids the black
    // 0×0 frame that the model reads as "Could not identify document".
    if (!video.videoWidth || !video.videoHeight) {
      setScanError(tc('logistics.camera_still_starting'))
      return
    }
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
    setCapturedImage(dataUrl)
    stopCamera()
    setScanning(true)

    try {
      const res = await fetch(`${API}/api/pos/parcels/scan`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ image: dataUrl }),
      })
      const result: ScanResult = await res.json()
      if (result.document_type === 'unknown' || !result.document_type) {
        setScanError(result.message || tc('logistics.scan_could_not_identify'))
        setScanning(false)
        return
      }
      setScanResult(result)
      setEditFields({ ...result.data })
      setScreen('confirm')
    } catch {
      setScanError(tc('logistics.scan_failed'))
    }
    setScanning(false)
  }

  // ── Save confirmed document ──────────────────────────────
  const handleConfirm = async () => {
    if (!staff || !scanResult) return
    setSaving(true)

    try {
      // First save the photo
      const photoRes = await fetch(`${API}/api/pos/parcels/photos`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          photo_type: scanResult.document_type === 'waybill' ? 'waybill' : 'other',
          photo_url: capturedImage,
          storage: 'fallback',
          document_type: scanResult.document_type,
          extracted_data: editFields,
          confidence: scanResult.confidence,
          lat: geoCoords?.lat,
          lng: geoCoords?.lng,
          branch_id: staff.location_id,
        }),
      })
      const photoData = await photoRes.json()

      if (scanResult.document_type === 'waybill') {
        const parcelRes = await fetch(`${API}/api/pos/parcels`, {
          method: 'POST',
          headers: headers(),
          body: JSON.stringify({
            sender_name: editFields.sender_name || null,
            sender_phone: editFields.sender_phone || null,
            receiver_name: editFields.receiver_name || null,
            receiver_phone: editFields.receiver_phone || null,
            destination_city: editFields.destination_city || null,
            description: editFields.description || null,
            weight_kg: editFields.weight_kg || null,
            tracking_number: editFields.tracking_number || null,
            lat: geoCoords?.lat,
            lng: geoCoords?.lng,
          }),
        })
        const parcelData = await parcelRes.json()

        // Link photo to parcel
        if (parcelData.parcel?.id && photoData.photo?.id) {
          await fetch(`${API}/api/pos/parcels/photos`, {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify({
              parcel_id: parcelData.parcel.id,
              photo_type: 'waybill',
              photo_url: capturedImage,
              storage: 'fallback',
              document_type: 'waybill',
              extracted_data: editFields,
              lat: geoCoords?.lat,
              lng: geoCoords?.lng,
            }),
          })
        }

        setSuccessTracking(parcelData.parcel?.tracking_number || '')
        setSuccessMsg(tc('logistics.toast_parcel_received'))
        setTodayIn(prev => prev + 1)
      } else if (scanResult.document_type === 'invoice') {
        await fetch(`${API}/api/pos/logistics-invoices`, {
          method: 'POST',
          headers: headers(),
          body: JSON.stringify({
            photo_id: photoData.photo?.id,
            vendor_name: editFields.vendor_name || null,
            invoice_number: editFields.invoice_number || null,
            items: editFields.items || [],
            total_amount: editFields.total_amount || 0,
            currency: editFields.currency || 'KES',
            invoice_date: editFields.date || null,
            category: editFields.category || null,
          }),
        })
        setSuccessMsg(tc('logistics.toast_invoice_saved'))
        setSuccessTracking('')
      } else if (scanResult.document_type === 'receipt') {
        // Save as logistics payment
        const body: Record<string, any> = {
          amount: editFields.amount || 0,
          currency: editFields.currency || 'KES',
          payment_method: editFields.payment_method || null,
          receipt_number: editFields.receipt_number || null,
          payer_name: editFields.payer_name || null,
          payee_name: editFields.payee_name || null,
          payment_date: editFields.date || null,
          photo_id: photoData.photo?.id,
        }
        await fetch(`${API}/api/pos/parcels`, {
          method: 'POST',
          headers: headers(),
          body: JSON.stringify(body),
        }).catch(() => {})
        setSuccessMsg(tc('logistics.toast_receipt_saved'))
        setSuccessTracking('')
      }

      setScreen('success')
    } catch {
      setScanError(tc('logistics.save_failed'))
    }
    setSaving(false)
  }

  // ── Release parcel (Out mode) ────────────────────────────
  const searchParcels = useCallback(async (q: string) => {
    if (!staff || !q.trim()) { setParcels([]); return }
    setSearchLoading(true)
    try {
      const res = await fetch(`${API}/api/pos/parcels?search=${encodeURIComponent(q)}&limit=20`, {
        headers: { 'x-staff-id': staff.id, 'x-owner-id': staff.owner_id },
      })
      const data = await res.json()
      setParcels((data.parcels || []).filter((p: Parcel) =>
        ['received', 'at_branch', 'at_destination'].includes(p.status)
      ))
    } catch {}
    setSearchLoading(false)
  }, [staff])

  useEffect(() => {
    if (mode !== 'out' || screen !== 'parcels') return
    const t = setTimeout(() => searchParcels(searchQuery), 300)
    return () => clearTimeout(t)
  }, [searchQuery, mode, screen, searchParcels])

  const handleRelease = async () => {
    if (!staff || !selectedParcel) return
    setSaving(true)
    try {
      await fetch(`${API}/api/pos/parcels/handover`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          parcel_id: selectedParcel.id,
          action: 'collect',
          collected_by_name: collectName || selectedParcel.receiver_name,
          lat: geoCoords?.lat,
          lng: geoCoords?.lng,
        }),
      })
      setSuccessMsg(tc('logistics.toast_parcel_released'))
      setSuccessTracking(selectedParcel.tracking_number)
      setTodayOut(prev => prev + 1)
      setScreen('success')
    } catch {
      setScanError(tc('logistics.release_failed'))
    }
    setSaving(false)
  }

  // ── Reset to camera ──────────────────────────────────────
  const resetToCamera = () => {
    setScanResult(null); setEditFields({}); setCapturedImage('')
    setScanError(''); setSuccessMsg(''); setSuccessTracking('')
    setSelectedParcel(null); setCollectName(''); setSearchQuery('')
    setParcels([]); setDeliveryNotes(''); setFailReason('')
    setCapturedImage(''); setScanError(''); setScanResult(null)
    if (staff?.role === 'driver' || staff?.role === 'logistics-driver') {
      setScreen('driver_home')
      loadDriverParcels(staff)
    } else {
      setScreen('camera')
    }
  }

  // ── Driver: load my parcels ─────────────────────────────
  const loadDriverParcels = async (s: StaffSession) => {
    setDriverLoading(true)
    try {
      const res = await fetch(`${API}/api/pos/parcels?driver_id=${s.id}&limit=100`, {
        headers: { 'x-staff-id': s.id, 'x-owner-id': s.owner_id },
      })
      const data = await res.json()
      const mine = (data.parcels || []).filter((p: Parcel) =>
        ['assigned', 'loaded', 'in_transit', 'out_for_delivery'].includes(p.status)
      )
      setMyParcels(mine)
      // Wire assignment → GPS: adopt the truck the dispatcher assigned to these
      // parcels so location pings tag the right truck without a manual pick.
      const assigned = mine.find((p: Parcel) => p.assigned_truck_id && p.truck)
      if (assigned?.truck) {
        setSelectedTruck(prev => prev || ({ ...assigned.truck, make_model: null, status: 'in_transit' } as Truck))
      }
    } catch {}
    setDriverLoading(false)
  }

  // ── Handler: incoming parcels arrived at this branch, awaiting receipt ──
  const loadIncoming = async (s: StaffSession) => {
    setIncomingLoading(true)
    try {
      const res = await fetch(`${API}/api/pos/parcels?status=at_destination&limit=200`, {
        headers: { 'x-staff-id': s.id, 'x-owner-id': s.owner_id },
      })
      const data = await res.json()
      // Parcels whose destination is this handler's branch (or all, if unassigned)
      setIncoming((data.parcels || []).filter((p: Parcel) =>
        !s.location_id || p.destination_branch_id === s.location_id))
    } catch {}
    setIncomingLoading(false)
  }

  const receiveIntoBranch = async (ids: string[]) => {
    if (!staff || ids.length === 0) return
    setSaving(true)
    try {
      await Promise.all(ids.map(id =>
        fetch(`${API}/api/pos/parcels`, {
          method: 'PATCH', headers: headers(),
          body: JSON.stringify({ id, status: 'awaiting_collection' }),
        })
      ))
      await loadIncoming(staff)
    } catch {} finally { setSaving(false) }
  }

  // ── Driver: mark a branch-to-branch parcel arrived at its destination ──
  const markArrived = async (p: Parcel) => {
    if (!staff) return
    setSaving(true)
    try {
      await fetch(`${API}/api/pos/parcels`, {
        method: 'PATCH', headers: headers(),
        body: JSON.stringify({ id: p.id, status: 'at_destination', current_branch_id: p.destination_branch_id || null }),
      })
      await loadDriverParcels(staff)
    } catch {} finally { setSaving(false) }
  }

  // ── Driver: "Drop all here" — every in-transit branch parcel for a destination ──
  const dropAllAtBranch = async (branchId: string, parcels: Parcel[]) => {
    if (!staff) return
    setSaving(true)
    try {
      await Promise.all(parcels.map(p =>
        fetch(`${API}/api/pos/parcels`, {
          method: 'PATCH', headers: headers(),
          body: JSON.stringify({ id: p.id, status: 'at_destination', current_branch_id: branchId || null }),
        })
      ))
      await loadDriverParcels(staff)
    } catch {} finally { setSaving(false) }
  }

  // ── Driver: load trucks ─────────────────────────────────
  const loadTrucks = async (s: StaffSession) => {
    try {
      const res = await fetch(`${API}/api/pos/trucks?status=available`, {
        headers: { 'x-staff-id': s.id, 'x-owner-id': s.owner_id },
      })
      const data = await res.json()
      setTrucks(data.trucks || [])
      if (data.trucks?.length === 1) setSelectedTruck(data.trucks[0])
    } catch {}
  }

  // ── Native photo capture for driver proof screens ───────
  const capturePhotoFromFile = async (file: File) => {
    setScanError('')
    try { setCapturedPhoto(await compressPhoto(file)) }
    catch { setScanError(tc('logistics.could_not_process_photo')) }
  }

  // ── Driver: pickup from branch ──────────────────────────
  const handlePickup = async (parcel: Parcel) => {
    setSaving(true)
    try {
      await fetch(`${API}/api/pos/parcels/handover`, {
        method: 'POST', headers: headers(),
        body: JSON.stringify({
          parcel_id: parcel.id, action: 'pickup',
          ...(capturedPhoto ? { photo_url: capturedPhoto, storage: 'fallback' } : {}),
          lat: geoCoords?.lat, lng: geoCoords?.lng,
        }),
      })
      setCapturedPhoto('')
      setSuccessMsg(tc('logistics.toast_parcel_picked_up'))
      setSuccessTracking(parcel.tracking_number)
      setScreen('success')
      if (staff) loadDriverParcels(staff)
    } catch { setScanError(tc('logistics.pickup_failed')) }
    setSaving(false)
  }

  // ── Video recording helpers ─────────────────────────────
  const startVideoRecording = () => {
    const stream = videoRef.current?.srcObject as MediaStream | null
    if (!stream) return
    // Guard: clear any previous interval before starting a new one
    if (recordingTimerRef.current) { clearInterval(recordingTimerRef.current); recordingTimerRef.current = null }
    recordedChunksRef.current = []

    // MediaRecorder is not supported on all platforms (e.g. iOS Safari)
    if (typeof MediaRecorder === 'undefined') {
      setScanError(tc('logistics.video_not_supported'))
      return
    }

    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : MediaRecorder.isTypeSupported('video/webm')
      ? 'video/webm'
      : 'video/mp4'

    let recorder: MediaRecorder
    try {
      recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 300_000 })
    } catch {
      setScanError(tc('logistics.video_not_supported'))
      return
    }

    recorder.ondataavailable = e => { if (e.data.size > 0) recordedChunksRef.current.push(e.data) }
    recorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: mimeType.split(';')[0] })
      const reader = new FileReader()
      reader.onload = () => setCapturedVideo(reader.result as string)
      reader.readAsDataURL(blob)
    }

    mediaRecorderRef.current = recorder
    recorder.start(100)
    setIsRecording(true)
    setRecordingSeconds(0)

    let secs = 0
    recordingTimerRef.current = setInterval(() => {
      secs++
      setRecordingSeconds(secs)
      if (secs >= 8) stopVideoRecording()
    }, 1000)
  }

  const stopVideoRecording = () => {
    if (recordingTimerRef.current) { clearInterval(recordingTimerRef.current); recordingTimerRef.current = null }
    if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop()
    setIsRecording(false)
  }

  // ── Driver: deliver ─────────────────────────────────────
  const handleDeliver = async () => {
    if (!selectedParcel || !staff) return
    if (!capturedPhoto) { setScanError(tc('logistics.deliver_need_photo')); return }
    setSaving(true)
    try {
      await fetch(`${API}/api/pos/parcels/handover`, {
        method: 'POST', headers: headers(),
        body: JSON.stringify({
          parcel_id: selectedParcel.id, action: 'deliver',
          photo_url: capturedPhoto, storage: 'fallback',
          lat: geoCoords?.lat, lng: geoCoords?.lng,
          notes: deliveryNotes || undefined,
        }),
      })
      setCapturedPhoto('')
      setSuccessMsg(tc('logistics.toast_delivered'))
      setSuccessTracking(selectedParcel.tracking_number)
      setTodayOut(prev => prev + 1)
      setScreen('success')
      loadDriverParcels(staff)
    } catch { setScanError(tc('logistics.delivery_failed')) }
    setSaving(false)
  }

  // ── Driver: failed delivery ─────────────────────────────
  const handleFailDelivery = async () => {
    if (!selectedParcel || !staff || !failReason) return
    setSaving(true)
    try {
      await fetch(`${API}/api/pos/parcels/handover`, {
        method: 'POST', headers: headers(),
        body: JSON.stringify({
          parcel_id: selectedParcel.id, action: 'fail',
          photo_url: capturedPhoto || undefined, storage: capturedPhoto ? 'fallback' : undefined,
          lat: geoCoords?.lat, lng: geoCoords?.lng,
          fail_reason: failReason, notes: deliveryNotes || undefined,
        }),
      })
      setCapturedPhoto('')
      setSuccessMsg(tc('logistics.toast_marked_failed'))
      setSuccessTracking(selectedParcel.tracking_number)
      setScreen('success')
      loadDriverParcels(staff)
    } catch { setScanError(tc('logistics.fail_update_failed')) }
    setSaving(false)
  }

  // ── Driver: checkpoint ──────────────────────────────────
  const handleCheckpoint = async () => {
    if (!selectedParcel || !staff) return
    if (!capturedPhoto) { setScanError(tc('logistics.checkpoint_need_photo')); return }
    setSaving(true)
    try {
      await fetch(`${API}/api/pos/parcels/handover`, {
        method: 'POST', headers: headers(),
        body: JSON.stringify({
          parcel_id: selectedParcel.id, action: 'checkpoint',
          photo_url: capturedPhoto, storage: 'fallback',
          lat: geoCoords?.lat, lng: geoCoords?.lng,
          notes: deliveryNotes || tc('logistics.checkpoint_default_note'),
        }),
      })
      setCapturedPhoto('')
      setSuccessMsg(tc('logistics.toast_checkpoint_logged'))
      setSuccessTracking(selectedParcel.tracking_number)
      setScreen('success')
    } catch { setScanError(tc('logistics.checkpoint_log_failed')) }
    setSaving(false)
  }

  // ── Vehicle inspection: capture one step (native camera) ──
  const captureInspectionFile = async (file: File) => {
    const dataUrl = await compressPhoto(file)
    const key = INSPECTION_STEPS[inspectionStep].key
    setInspectionPhotos(prev => ({ ...prev, [key]: dataUrl }))
    if (inspectionStep < INSPECTION_STEPS.length - 1) {
      setInspectionStep(prev => prev + 1)
    } else {
      setScreen('inspection_done')
    }
  }

  // ── Vehicle inspection: submit ──────────────────────────
  const submitInspection = async () => {
    if (!staff || !selectedTruck) return
    setSaving(true)
    try {
      await fetch(`${API}/api/pos/vehicle-inspection`, {
        method: 'POST', headers: headers(),
        body: JSON.stringify({
          truck_id: selectedTruck.id,
          type: inspectionType,
          ...inspectionPhotos,
          flagged_issues: flaggedIssues,
          notes: inspectionNotes || null,
          lat: geoCoords?.lat, lng: geoCoords?.lng,
        }),
      })
      setSuccessMsg(inspectionType === 'pre_trip' ? tc('logistics.inspection_saved_pre_trip') : tc('logistics.inspection_saved_post_trip'))
      setSuccessTracking(selectedTruck.plate_number)
      setScreen('success')
    } catch { setScanError(tc('logistics.inspection_save_failed')) }
    setSaving(false)
  }

  // ── Styles ───────────────────────────────────────────────
  const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid var(--pos-border)', fontSize: 15, fontFamily: 'inherit', background: 'var(--pos-surface)', color: 'var(--pos-ink)', boxSizing: 'border-box', outline: 'none' }
  const btnPrimary: React.CSSProperties = { flex: 1, padding: '14px', borderRadius: 12, background: ACC, color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }
  const btnSecondary: React.CSSProperties = { flex: 1, padding: '14px', borderRadius: 12, background: 'transparent', color: 'var(--pos-muted)', fontSize: 14, fontWeight: 600, border: '1.5px solid var(--pos-border)', cursor: 'pointer', fontFamily: 'inherit' }

  if (!staff) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--pos-bg)' }}>{tc('logistics.loading')}</div>

  const isDriverRole = staff.role === 'driver' || staff.role === 'logistics-driver'

  // ═══════════════════════════════════════════════════════════
  // CAMERA HOME SCREEN
  // ═══════════════════════════════════════════════════════════
  if (screen === 'camera') return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Top bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isDriverRole && (
            <button onClick={() => { stopCamera(); setCapturedImage(''); setScanError(''); setScreen('driver_home') }} aria-label={tc('logistics.back')}
              style={{ background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(10px)', border: 'none', borderRadius: 20, width: 36, height: 36, color: '#fff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
          )}
          <div style={{ background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(10px)', borderRadius: 20, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, background: geoCoords ? GREEN : AMBER }} />
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{staff.name}</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(10px)', borderRadius: 20, padding: '6px 12px' }}>
            <span style={{ color: '#fff', fontSize: 12 }}>{tc('logistics.stat_in_out', { in: todayIn, out: todayOut })}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {staff.role === 'handler' && (
            <button onClick={() => { stopCamera(); setScreen('handler_incoming'); loadIncoming(staff) }} style={{ background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(10px)', border: 'none', borderRadius: 20, padding: '6px 14px', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              {tc('logistics.incoming_button')}
            </button>
          )}
          <button onClick={() => { stopCamera(); localStorage.removeItem('pos_staff'); router.push('/') }} style={{ background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(10px)', border: 'none', borderRadius: 20, padding: '6px 14px', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
            {tc('logistics.sign_out')}
          </button>
        </div>
      </div>

      {/* Viewfinder — native camera capture (reliable on iOS / private mode) */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <input ref={docInputRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }}
          aria-label={tc('logistics.aria_photograph_document')} onChange={e => { const f = e.target.files?.[0]; if (f) scanFile(f); e.target.value = '' }} />

        {capturedImage && !scanError ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={capturedImage} alt={tc('logistics.alt_captured_document')} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        ) : (
          <button onClick={() => docInputRef.current?.click()} disabled={scanning}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, background: 'none', border: 'none', cursor: scanning ? 'wait' : 'pointer', padding: 24 }}>
            <div style={{ width: 88, height: 88, borderRadius: 24, border: '2px dashed rgba(255,255,255,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>📷</div>
            <div style={{ color: '#fff', fontSize: 15, fontWeight: 700 }}>{tc('logistics.viewfinder_tap_waybill')}</div>
            <div style={{ color: 'rgba(255,255,255,.55)', fontSize: 12 }}>{tc('logistics.viewfinder_waybill_hint')}</div>
          </button>
        )}

        {/* Scanning overlay */}
        {scanning && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, border: '3px solid #fff', borderTopColor: ACC, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{tc('logistics.reading_document')}</span>
          </div>
        )}

        {/* Scan error */}
        {scanError && (
          <div className="pos-banner" style={{ position: 'absolute', bottom: 24, left: 16, right: 16, background: 'rgba(220,38,38,.9)', borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 13, textAlign: 'center' }}>
            {scanError}
            <button onClick={() => { setScanError(''); setCapturedImage(''); docInputRef.current?.click() }} style={{ display: 'block', margin: '8px auto 0', background: 'rgba(255,255,255,.2)', border: 'none', borderRadius: 8, padding: '6px 16px', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
              {tc('logistics.retake_photo')}
            </button>
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div style={{ background: 'rgba(0,0,0,.85)', backdropFilter: 'blur(10px)', padding: '16px 20px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        {/* In / Out toggle */}
        {staff.role === 'handler' && (
          <div style={{ display: 'flex', background: 'rgba(255,255,255,.1)', borderRadius: 10, padding: 3, gap: 2 }}>
            {(['in', 'out'] as Mode[]).map(m => (
              <button key={m} onClick={() => {
                setMode(m)
                if (m === 'out') { stopCamera(); setScreen('parcels') }
              }}
                style={{ padding: '8px 28px', borderRadius: 8, border: 'none', background: mode === m ? ACC : 'transparent', color: mode === m ? '#fff' : 'rgba(255,255,255,.6)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s' }}>
                {m === 'in' ? tc('logistics.mode_receive') : tc('logistics.mode_release')}
              </button>
            ))}
          </div>
        )}

        {/* Shutter button — opens the native camera */}
        <button onClick={() => docInputRef.current?.click()} disabled={scanning}
          style={{ width: 72, height: 72, borderRadius: 36, border: '4px solid #fff', background: scanning ? '#666' : ACC, cursor: scanning ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform .15s', transform: scanning ? 'scale(0.9)' : 'scale(1)' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </button>
        <span style={{ color: 'rgba(255,255,255,.5)', fontSize: 12 }}>{tc('logistics.shutter_hint')}</span>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  // ═══════════════════════════════════════════════════════════
  // CONFIRM SCREEN (after scan)
  // ═══════════════════════════════════════════════════════════
  if (screen === 'confirm' && scanResult) {
    const dt = scanResult.document_type
    const conf = Math.round((scanResult.confidence || 0) * 100)

    return (
      <div className="pos-screen" style={{ minHeight: '100vh', background: 'var(--pos-bg)', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {/* Header */}
        <div style={{ background: 'var(--pos-surface)', borderBottom: '1px solid var(--pos-border)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={resetToCamera} style={{ width: 36, height: 36, borderRadius: 10, background: '#f4f3f1', border: 'none', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--pos-ink)' }}>
              {dt === 'waybill' ? tc('logistics.confirm_waybill_detected') : dt === 'invoice' ? tc('logistics.confirm_invoice_detected') : tc('logistics.confirm_receipt_detected')}
            </div>
            <div style={{ fontSize: 12, color: 'var(--pos-muted)' }}>{tc('logistics.confirm_confidence', { percent: conf })}</div>
          </div>
        </div>

        {/* Captured image thumbnail */}
        {capturedImage && (
          <div className="pos-reveal" style={{ padding: '12px 20px 0' }}>
            <img src={capturedImage} alt={tc('logistics.alt_scan')} style={{ width: '100%', borderRadius: 12, maxHeight: 160, objectFit: 'cover', border: '1px solid var(--pos-border)' }} />
          </div>
        )}

        {/* Editable fields */}
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {dt === 'waybill' && <>
            <Field label={tc('logistics.field_sender_name')} value={editFields.sender_name} onChange={v => setEditFields(p => ({ ...p, sender_name: v }))} />
            <Field label={tc('logistics.field_sender_phone')} value={editFields.sender_phone} onChange={v => setEditFields(p => ({ ...p, sender_phone: v }))} inputMode="tel" />
            <Field label={tc('logistics.field_receiver_name')} value={editFields.receiver_name} onChange={v => setEditFields(p => ({ ...p, receiver_name: v }))} />
            <Field label={tc('logistics.field_receiver_phone')} value={editFields.receiver_phone} onChange={v => setEditFields(p => ({ ...p, receiver_phone: v }))} inputMode="tel" />
            <Field label={tc('logistics.field_destination_city')} value={editFields.destination_city} onChange={v => setEditFields(p => ({ ...p, destination_city: v }))} />
            <Field label={tc('logistics.field_description')} value={editFields.description} onChange={v => setEditFields(p => ({ ...p, description: v }))} />
            <Field label={tc('logistics.field_weight_kg')} value={editFields.weight_kg} onChange={v => setEditFields(p => ({ ...p, weight_kg: v }))} inputMode="decimal" />
            {editFields.tracking_number && <Field label={tc('logistics.field_tracking_number')} value={editFields.tracking_number} onChange={v => setEditFields(p => ({ ...p, tracking_number: v }))} />}
          </>}

          {dt === 'invoice' && <>
            <Field label={tc('logistics.field_vendor')} value={editFields.vendor_name} onChange={v => setEditFields(p => ({ ...p, vendor_name: v }))} />
            <Field label={tc('logistics.field_invoice_number')} value={editFields.invoice_number} onChange={v => setEditFields(p => ({ ...p, invoice_number: v }))} />
            <Field label={tc('logistics.field_total_amount')} value={editFields.total_amount} onChange={v => setEditFields(p => ({ ...p, total_amount: v }))} inputMode="decimal" />
            <Field label={tc('logistics.field_currency')} value={editFields.currency || 'KES'} onChange={v => setEditFields(p => ({ ...p, currency: v }))} />
            <Field label={tc('logistics.field_date')} value={editFields.date} onChange={v => setEditFields(p => ({ ...p, date: v }))} />
            <div style={{ fontSize: 12, color: 'var(--pos-muted)' }}>
              {tc('logistics.field_category')}
              <select value={editFields.category || ''} onChange={e => setEditFields(p => ({ ...p, category: e.target.value || null }))} style={{ ...inputStyle, marginTop: 4 }}>
                <option value="">{tc('logistics.category_select')}</option>
                <option value="fuel">{tc('logistics.category_fuel')}</option>
                <option value="maintenance">{tc('logistics.category_maintenance')}</option>
                <option value="toll">{tc('logistics.category_toll')}</option>
                <option value="loading">{tc('logistics.category_loading')}</option>
                <option value="other">{tc('logistics.category_other')}</option>
              </select>
            </div>
          </>}

          {dt === 'receipt' && <>
            <Field label={tc('logistics.field_amount')} value={editFields.amount} onChange={v => setEditFields(p => ({ ...p, amount: v }))} inputMode="decimal" />
            <Field label={tc('logistics.field_currency')} value={editFields.currency || 'KES'} onChange={v => setEditFields(p => ({ ...p, currency: v }))} />
            <Field label={tc('logistics.field_payment_method')} value={editFields.payment_method} onChange={v => setEditFields(p => ({ ...p, payment_method: v }))} />
            <Field label={tc('logistics.field_receipt_number')} value={editFields.receipt_number} onChange={v => setEditFields(p => ({ ...p, receipt_number: v }))} />
            <Field label={tc('logistics.field_payer')} value={editFields.payer_name} onChange={v => setEditFields(p => ({ ...p, payer_name: v }))} />
            <Field label={tc('logistics.field_payee')} value={editFields.payee_name} onChange={v => setEditFields(p => ({ ...p, payee_name: v }))} />
            <Field label={tc('logistics.field_date')} value={editFields.date} onChange={v => setEditFields(p => ({ ...p, date: v }))} />
          </>}

          {scanError && <div style={{ color: RED, fontSize: 13, textAlign: 'center' }}>{scanError}</div>}

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="pos-btn-primary" onClick={handleConfirm} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.6 : 1 }}>
              {saving ? tc('logistics.saving') : tc('logistics.confirm_button')}
            </button>
            <button onClick={resetToCamera} style={btnSecondary}>{tc('logistics.rescan_button')}</button>
          </div>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // PARCELS LIST (Release mode — Out)
  // ═══════════════════════════════════════════════════════════
  if (screen === 'parcels') return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: 'var(--pos-bg)', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ background: 'var(--pos-surface)', borderBottom: '1px solid var(--pos-border)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={resetToCamera} style={{ width: 36, height: 36, borderRadius: 10, background: '#f4f3f1', border: 'none', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{tc('logistics.release_title')}</div>
          <div style={{ fontSize: 12, color: 'var(--pos-muted)' }}>{tc('logistics.release_subtitle')}</div>
        </div>
      </div>

      <div style={{ padding: '12px 20px' }}>
        <input
          placeholder={tc('logistics.search_placeholder')}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={inputStyle}
          autoFocus
        />
      </div>

      <div style={{ padding: '0 20px' }}>
        {searchLoading && <div style={{ color: 'var(--pos-muted)', fontSize: 13, padding: '12px 0' }}>{tc('logistics.searching')}</div>}
        {!searchLoading && searchQuery && parcels.length === 0 && (
          <div style={{ color: 'var(--pos-muted)', fontSize: 13, padding: '12px 0', textAlign: 'center' }}>{tc('logistics.no_parcels_at_branch')}</div>
        )}
        {parcels.map((p, idx) => (
          <button key={p.id} className="pos-item" onClick={() => { setSelectedParcel(p); setCollectName(p.receiver_name || ''); setScreen('release') }}
            style={{ width: '100%', background: 'var(--pos-surface)', border: '1px solid var(--pos-border)', borderRadius: 12, padding: '14px 16px', marginBottom: 8, textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', justifyContent: 'space-between', alignItems: 'center', animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--pos-ink)' }}>{p.tracking_number}</div>
              <div style={{ fontSize: 13, color: 'var(--pos-muted)', marginTop: 2 }}>{p.receiver_phone ? tc('logistics.parcel_to_with_phone', { name: p.receiver_name || '—', phone: p.receiver_phone }) : tc('logistics.parcel_to', { name: p.receiver_name || '—' })}</div>
              <div style={{ fontSize: 12, color: 'var(--pos-hint)', marginTop: 2 }}>{p.description || '—'} · {timeAgo(p.created_at, tc)}</div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: (STATUS_COLOR[p.status] || '#6b7280') + '18', color: STATUS_COLOR[p.status] || '#6b7280' }}>
              {STATUS_LABEL[p.status] || p.status}
            </span>
          </button>
        ))}
      </div>
    </div>
  )

  // ═══════════════════════════════════════════════════════════
  // RELEASE CONFIRM
  // ═══════════════════════════════════════════════════════════
  if (screen === 'release' && selectedParcel) return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: 'var(--pos-bg)', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ background: 'var(--pos-surface)', borderBottom: '1px solid var(--pos-border)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => setScreen('parcels')} style={{ width: 36, height: 36, borderRadius: 10, background: '#f4f3f1', border: 'none', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <div style={{ fontSize: 15, fontWeight: 700 }}>{tc('logistics.release_heading', { tracking: selectedParcel.tracking_number })}</div>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ background: 'var(--pos-surface)', border: '1px solid var(--pos-border)', borderRadius: 14, padding: '16px 18px' }}>
          <div style={{ fontSize: 12, color: 'var(--pos-muted)', marginBottom: 8 }}>{tc('logistics.parcel_details')}</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{selectedParcel.receiver_name || '—'}</div>
          <div style={{ fontSize: 13, color: 'var(--pos-muted)' }}>{selectedParcel.receiver_phone || ''}</div>
          <div style={{ fontSize: 13, color: 'var(--pos-muted)', marginTop: 4 }}>{selectedParcel.description || '—'}</div>
          {selectedParcel.fee_charged ? (
            <div style={{ fontSize: 14, fontWeight: 700, color: ACC, marginTop: 8 }}>{tc('logistics.fee_label', { amount: selectedParcel.fee_charged.toLocaleString() })}</div>
          ) : null}
        </div>

        <Field label={tc('logistics.field_collected_by')} value={collectName} onChange={setCollectName} />

        {scanError && <div style={{ color: RED, fontSize: 13, textAlign: 'center' }}>{scanError}</div>}

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button className="pos-btn-primary" onClick={handleRelease} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.6 : 1 }}>
            {saving ? tc('logistics.releasing') : tc('logistics.release_parcel_button')}
          </button>
          <button onClick={() => setScreen('parcels')} style={btnSecondary}>{tc('logistics.back')}</button>
        </div>
      </div>
    </div>
  )

  // ═══════════════════════════════════════════════════════════
  // SUCCESS SCREEN
  // ═══════════════════════════════════════════════════════════
  if (screen === 'success') return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: 'var(--pos-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ width: 72, height: 72, borderRadius: 36, background: 'var(--pos-success-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <svg className="pos-success-icon" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
      </div>
      <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--pos-ink)', marginBottom: 4 }}>{successMsg}</div>
      {successTracking && <div style={{ fontSize: 16, color: ACC, fontWeight: 700, marginBottom: 8 }}>{successTracking}</div>}
      <div style={{ fontSize: 13, color: 'var(--pos-muted)', marginBottom: 32 }}>{tc('logistics.success_received_released_today', { in: todayIn, out: todayOut })}</div>
      <button className="pos-btn-primary" onClick={resetToCamera} style={{ ...btnPrimary, width: '100%', maxWidth: 320 }}>
        {staff?.role === 'driver' ? tc('logistics.back_to_my_parcels') : tc('logistics.scan_next')}
      </button>
    </div>
  )

  // ═══════════════════════════════════════════════════════════
  // HANDLER — INCOMING (receive arrived parcels into the branch)
  // ═══════════════════════════════════════════════════════════
  if (screen === 'handler_incoming') return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: 'var(--pos-bg)', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ background: 'var(--pos-surface)', borderBottom: '1px solid var(--pos-border)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => { setScreen('camera'); setCapturedImage(''); setScanError('') }} aria-label={tc('logistics.back')} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', padding: 0, color: 'var(--pos-ink)' }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--pos-ink)' }}>{tc('logistics.incoming_title')}</div>
          <div style={{ fontSize: 11, color: 'var(--pos-muted)' }}>{tc('logistics.incoming_subtitle', { name: staff.name })}</div>
        </div>
        <button onClick={() => loadIncoming(staff)} style={{ background: ACC_LIGHT, color: ACC, border: `1px solid ${ACC_BORDER}`, borderRadius: 8, padding: '6px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>↻</button>
      </div>

      <div style={{ maxWidth: 520, margin: '0 auto', padding: 16 }}>
        {incoming.length > 1 && (
          <button onClick={() => receiveIntoBranch(incoming.map(p => p.id))} disabled={saving}
            style={{ width: '100%', background: GREEN, color: '#fff', border: 'none', borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 800, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1, marginBottom: 12 }}>
            {tc('logistics.receive_all_into_branch', { count: incoming.length })}
          </button>
        )}
        {incomingLoading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--pos-muted)' }}>{tc('logistics.loading')}</div>
        ) : incoming.length === 0 ? (
          <div style={{ background: 'var(--pos-surface)', border: '1px solid var(--pos-border)', borderRadius: 12, padding: '32px 16px', textAlign: 'center', color: 'var(--pos-muted)', fontSize: 13 }}>
            {tc('logistics.no_incoming_parcels')}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {incoming.map(p => (
              <div key={p.id} style={{ background: 'var(--pos-surface)', border: '1px solid var(--pos-border)', borderRadius: 12, padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 14, fontWeight: 800, color: 'var(--pos-ink)' }}>{p.tracking_number}</div>
                  <div style={{ fontSize: 12, color: 'var(--pos-muted)', marginTop: 2 }}>{p.receiver_phone ? tc('logistics.parcel_to_with_phone', { name: p.receiver_name || '—', phone: p.receiver_phone }) : tc('logistics.parcel_to', { name: p.receiver_name || '—' })}</div>
                  <div style={{ fontSize: 12, color: 'var(--pos-hint)', marginTop: 2 }}>{p.description || tc('logistics.parcel_default_label')}{p.weight_kg ? tc('logistics.parcel_weight_suffix', { weight: p.weight_kg }) : ''}</div>
                </div>
                <button onClick={() => receiveIntoBranch([p.id])} disabled={saving} style={{ background: ACC, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1, whiteSpace: 'nowrap' }}>
                  {tc('logistics.receive_button')}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  // ═══════════════════════════════════════════════════════════
  // DRIVER HOME
  // ═══════════════════════════════════════════════════════════
  if (screen === 'driver_home') return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: 'var(--pos-bg)', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'var(--pos-surface)', borderBottom: '1px solid var(--pos-border)', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: ACC, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 16 }}>🚛</span>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{staff?.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--pos-muted)' }}>
              <div style={{ width: 6, height: 6, borderRadius: 3, background: geoCoords ? GREEN : AMBER }} />
              {tc('logistics.driver_role_parcels', { count: myParcels.length })}
            </div>
          </div>
        </div>
        <button onClick={() => { localStorage.removeItem('pos_staff'); router.push('/') }} style={{ background: '#f4f3f1', border: 'none', borderRadius: 8, padding: '6px 12px', color: 'var(--pos-muted)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>{tc('logistics.sign_out')}</button>
      </div>

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Quick actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => {
            setInspectionStep(0); setInspectionPhotos({}); setInspectionType('pre_trip')
            setFlaggedIssues([]); setInspectionNotes('')
            if (selectedTruck || trucks.length === 1) { setScreen('inspection') }
            else { setScreen('inspection') }
          }} style={{ flex: 1, padding: '14px', borderRadius: 12, background: ACC_LIGHT, border: `1px solid ${ACC_BORDER}`, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center' }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>🔍</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: ACC }}>{tc('logistics.vehicle_check')}</div>
          </button>
          <button onClick={() => { setCapturedImage(''); setScanError(''); setScreen('camera') }} style={{ flex: 1, padding: '14px', borderRadius: 12, background: ACC_LIGHT, border: `1px solid ${ACC_BORDER}`, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center' }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>📷</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: ACC }}>{tc('logistics.scan_document')}</div>
          </button>
        </div>

        {/* Drop-all groups — branch-to-branch parcels in transit, grouped by destination */}
        {(() => {
          const groups = new Map<string, { name: string; items: Parcel[] }>()
          for (const p of myParcels) {
            if (p.status !== 'in_transit' || p.delivery_type !== 'branch_to_branch' || !p.destination_branch_id) continue
            const g = groups.get(p.destination_branch_id) || { name: p.destination_branch?.name || p.destination_city || tc('logistics.destination_fallback'), items: [] }
            g.items.push(p); groups.set(p.destination_branch_id, g)
          }
          return Array.from(groups.entries()).map(([bid, g]) => (
            <button key={bid} onClick={() => dropAllAtBranch(bid, g.items)} disabled={saving}
              style={{ width: '100%', background: GREEN, color: '#fff', border: 'none', borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 800, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1, marginTop: 4 }}>
              {tc('logistics.drop_all_at', { name: g.name, count: g.items.length })}
            </button>
          ))
        })()}

        {/* My parcels */}
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--pos-ink)', marginTop: 4 }}>{tc('logistics.my_parcels')}</div>
        {driverLoading && <div style={{ color: 'var(--pos-muted)', fontSize: 13 }}>{tc('logistics.loading')}</div>}
        {!driverLoading && myParcels.length === 0 && (
          <div style={{ background: 'var(--pos-surface)', border: '1px solid var(--pos-border)', borderRadius: 12, padding: '24px 16px', textAlign: 'center', color: 'var(--pos-muted)', fontSize: 13 }}>
            {tc('logistics.no_parcels_assigned')}
          </div>
        )}
        {myParcels.map((p, idx) => (
          <div key={p.id} className="pos-item" style={{ background: 'var(--pos-surface)', border: '1px solid var(--pos-border)', borderRadius: 12, padding: '14px 16px', animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{p.tracking_number}</div>
                <div style={{ fontSize: 13, color: 'var(--pos-muted)', marginTop: 2 }}>{tc('logistics.parcel_to', { name: p.receiver_name || '—' })} · {p.destination_city || ''}</div>
                {p.description && <div style={{ fontSize: 12, color: 'var(--pos-hint)', marginTop: 2 }}>{p.description}</div>}
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: (STATUS_COLOR[p.status] || '#6b7280') + '18', color: STATUS_COLOR[p.status] || '#6b7280', whiteSpace: 'nowrap' }}>
                {STATUS_LABEL[p.status] || p.status}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['assigned', 'loaded'].includes(p.status) && (
                <button onClick={() => handlePickup(p)} disabled={saving} style={{ padding: '7px 14px', borderRadius: 8, border: 'none', background: ACC, color: '#fff', fontSize: 12, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: saving ? 0.5 : 1 }}>
                  {tc('logistics.btn_pick_up')}
                </button>
              )}
              {['in_transit', 'out_for_delivery'].includes(p.status) && <>
                {p.delivery_type === 'branch_to_branch' ? (
                  <button onClick={() => markArrived(p)} disabled={saving} style={{ padding: '7px 14px', borderRadius: 8, border: 'none', background: GREEN, color: '#fff', fontSize: 12, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: saving ? 0.5 : 1 }}>
                    {tc('logistics.btn_arrived_at_branch')}
                  </button>
                ) : (
                  <button onClick={() => { setSelectedParcel(p); setDeliveryNotes(''); setCapturedPhoto(''); setScanError(''); setScreen('driver_deliver') }} style={{ padding: '7px 14px', borderRadius: 8, border: 'none', background: GREEN, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                    {tc('logistics.btn_deliver')}
                  </button>
                )}
                <button onClick={() => { setSelectedParcel(p); setDeliveryNotes(''); setCapturedPhoto(''); setScanError(''); setScreen('driver_checkpoint') }} style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${ACC_BORDER}`, background: 'transparent', color: ACC, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {tc('logistics.btn_checkpoint')}
                </button>
                <button onClick={() => { setSelectedParcel(p); setFailReason(''); setDeliveryNotes(''); setScreen('driver_fail') }} style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(220,38,38,.25)', background: 'transparent', color: RED, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {tc('logistics.btn_failed')}
                </button>
              </>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // ═══════════════════════════════════════════════════════════
  // DRIVER DELIVER — camera + confirm
  // ═══════════════════════════════════════════════════════════
  if (screen === 'driver_deliver' && selectedParcel) return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => { setCapturedPhoto(''); setScanError(''); setScreen('driver_home') }}
          style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,.15)', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <div style={{ background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(10px)', borderRadius: 20, padding: '6px 14px', flex: 1 }}>
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>{tc('logistics.proof_of_delivery', { tracking: selectedParcel.tracking_number })}</span>
        </div>
      </div>

      <input ref={camFileRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} aria-label={tc('logistics.aria_take_delivery_photo')} onChange={e => { const f = e.target.files?.[0]; if (f) capturePhotoFromFile(f); e.target.value = '' }} />

      {/* Viewfinder — native capture */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {capturedPhoto ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={capturedPhoto} alt={tc('logistics.alt_delivery_proof')} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        ) : (
          <button onClick={() => camFileRef.current?.click()} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, background: 'none', border: 'none', cursor: 'pointer', padding: 24 }}>
            <div style={{ width: 88, height: 88, borderRadius: 24, border: '2px dashed rgba(255,255,255,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>📷</div>
            <div style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>{tc('logistics.tap_photograph_delivery')}</div>
          </button>
        )}
      </div>

      {/* Bottom controls */}
      <div style={{ background: 'rgba(0,0,0,.88)', padding: '14px 20px 36px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ color: 'rgba(255,255,255,.7)', fontSize: 13, textAlign: 'center' }}>
          {selectedParcel.destination_city ? tc('logistics.deliver_to_destination', { name: selectedParcel.receiver_name || '—', city: selectedParcel.destination_city }) : tc('logistics.deliver_to', { name: selectedParcel.receiver_name || '—' })}
        </div>
        <input placeholder={tc('logistics.notes_optional')} value={deliveryNotes} onChange={e => setDeliveryNotes(e.target.value)}
          style={{ width: '100%', maxWidth: 360, padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,.2)', background: 'rgba(255,255,255,.1)', color: '#fff', fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none' }} />
        {scanError && <div style={{ color: '#fca5a5', fontSize: 13 }}>{scanError}</div>}
        {capturedPhoto ? (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button onClick={() => camFileRef.current?.click()} style={{ padding: '12px 18px', borderRadius: 10, border: '1px solid rgba(255,255,255,.3)', background: 'transparent', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{tc('logistics.retake')}</button>
            <button onClick={handleDeliver} disabled={saving} style={{ padding: '13px 28px', borderRadius: 10, border: 'none', background: GREEN, color: '#fff', fontSize: 15, fontWeight: 800, cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.6 : 1 }}>{saving ? tc('logistics.saving') : tc('logistics.confirm_delivery_button')}</button>
          </div>
        ) : (
          <button onClick={() => camFileRef.current?.click()} style={{ width: 72, height: 72, borderRadius: 36, border: '4px solid #fff', background: GREEN, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
          </button>
        )}
      </div>
    </div>
  )

  // ═══════════════════════════════════════════════════════════
  // DRIVER CHECKPOINT — quick snap + GPS
  // ═══════════════════════════════════════════════════════════
  if (screen === 'driver_checkpoint' && selectedParcel) return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => { setCapturedPhoto(''); setScanError(''); setScreen('driver_home') }} style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,.15)', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <div style={{ background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(10px)', borderRadius: 20, padding: '6px 14px' }}>
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{tc('logistics.checkpoint_heading', { tracking: selectedParcel.tracking_number })}</span>
        </div>
      </div>
      <input ref={camFileRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} aria-label={tc('logistics.aria_take_checkpoint_photo')} onChange={e => { const f = e.target.files?.[0]; if (f) capturePhotoFromFile(f); e.target.value = '' }} />
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {capturedPhoto ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={capturedPhoto} alt={tc('logistics.alt_checkpoint')} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        ) : (
          <button onClick={() => camFileRef.current?.click()} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, background: 'none', border: 'none', cursor: 'pointer', padding: 24 }}>
            <div style={{ width: 88, height: 88, borderRadius: 24, border: '2px dashed rgba(255,255,255,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>📍</div>
            <div style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>{tc('logistics.tap_photograph_checkpoint')}</div>
          </button>
        )}
      </div>
      <div style={{ background: 'rgba(0,0,0,.85)', padding: '16px 20px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        {geoCoords && <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 11 }}>📍 {geoCoords.lat.toFixed(4)}, {geoCoords.lng.toFixed(4)}</div>}
        <input placeholder={tc('logistics.location_name_optional')} value={deliveryNotes} onChange={e => setDeliveryNotes(e.target.value)}
          style={{ width: '100%', maxWidth: 360, padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,.2)', background: 'rgba(255,255,255,.1)', color: '#fff', fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none' }} />
        {scanError && <div style={{ color: '#fca5a5', fontSize: 13 }}>{scanError}</div>}
        {capturedPhoto ? (
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => camFileRef.current?.click()} style={{ padding: '12px 18px', borderRadius: 10, border: '1px solid rgba(255,255,255,.3)', background: 'transparent', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{tc('logistics.retake')}</button>
            <button onClick={handleCheckpoint} disabled={saving} style={{ padding: '13px 28px', borderRadius: 10, border: 'none', background: '#6366f1', color: '#fff', fontSize: 15, fontWeight: 800, cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.6 : 1 }}>{saving ? tc('logistics.saving') : tc('logistics.log_checkpoint_button')}</button>
          </div>
        ) : (
          <button onClick={() => camFileRef.current?.click()} style={{ width: 72, height: 72, borderRadius: 36, border: '4px solid #fff', background: '#6366f1', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
          </button>
        )}
      </div>
    </div>
  )

  // ═══════════════════════════════════════════════════════════
  // DRIVER FAILED DELIVERY
  // ═══════════════════════════════════════════════════════════
  if (screen === 'driver_fail' && selectedParcel) return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: 'var(--pos-bg)', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ background: 'var(--pos-surface)', borderBottom: '1px solid var(--pos-border)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => setScreen('driver_home')} style={{ width: 36, height: 36, borderRadius: 10, background: '#f4f3f1', border: 'none', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: RED }}>{tc('logistics.failed_delivery_title')}</div>
          <div style={{ fontSize: 12, color: 'var(--pos-muted)' }}>{tc('logistics.failed_delivery_subtitle', { tracking: selectedParcel.tracking_number, name: selectedParcel.receiver_name || '' })}</div>
        </div>
      </div>
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--pos-ink)' }}>{tc('logistics.reason_label')}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {FAIL_REASON_KEYS.map(r => {
            const label = tc('logistics.fail_reason_' + r)
            return (
            <button key={r} onClick={() => setFailReason(label)}
              style={{ padding: '8px 14px', borderRadius: 20, border: failReason === label ? `2px solid ${RED}` : '1.5px solid var(--pos-border)', background: failReason === label ? 'var(--pos-danger-pale)' : 'var(--pos-surface)', color: failReason === label ? RED : 'var(--pos-ink)', fontSize: 13, fontWeight: failReason === label ? 700 : 500, cursor: 'pointer', fontFamily: 'inherit' }}>
              {label}
            </button>
          )})}
        </div>
        <input placeholder={tc('logistics.additional_notes_optional')} value={deliveryNotes} onChange={e => setDeliveryNotes(e.target.value)} style={inputStyle} />

        {scanError && <div style={{ color: RED, fontSize: 13, textAlign: 'center' }}>{scanError}</div>}

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button onClick={handleFailDelivery} disabled={saving || !failReason} style={{ ...btnPrimary, background: RED, opacity: !failReason || saving ? 0.5 : 1 }}>
            {saving ? tc('logistics.saving') : tc('logistics.confirm_failed_delivery')}
          </button>
        </div>
      </div>
    </div>
  )

  // ═══════════════════════════════════════════════════════════
  // VEHICLE INSPECTION — guided 6-photo flow
  // ═══════════════════════════════════════════════════════════
  if (screen === 'inspection') {
    // If no truck selected yet, show truck picker
    if (!selectedTruck) return (
      <div className="pos-screen" style={{ minHeight: '100vh', background: 'var(--pos-bg)', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{ background: 'var(--pos-surface)', borderBottom: '1px solid var(--pos-border)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setScreen('driver_home')} style={{ width: 36, height: 36, borderRadius: 10, background: '#f4f3f1', border: 'none', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{tc('logistics.vehicle_inspection_title')}</div>
        </div>
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            {(['pre_trip', 'post_trip'] as const).map(t => (
              <button key={t} onClick={() => setInspectionType(t)}
                style={{ flex: 1, padding: '10px', borderRadius: 10, border: inspectionType === t ? `2px solid ${ACC}` : '1.5px solid var(--pos-border)', background: inspectionType === t ? ACC_LIGHT : 'var(--pos-surface)', color: inspectionType === t ? ACC : 'var(--pos-ink)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
  {t === 'pre_trip' ? tc('logistics.inspection_pre_trip') : tc('logistics.inspection_post_trip')}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{tc('logistics.select_truck')}</div>
          {trucks.length === 0 && <div style={{ color: 'var(--pos-muted)', fontSize: 13 }}>{tc('logistics.no_trucks_available')}</div>}
          {trucks.map(t => (
            <button key={t.id} onClick={() => { setSelectedTruck(t); setScreen('inspection') }}
              style={{ width: '100%', background: 'var(--pos-surface)', border: '1px solid var(--pos-border)', borderRadius: 12, padding: '14px 16px', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{t.plate_number}</div>
              {t.make_model && <div style={{ fontSize: 12, color: 'var(--pos-muted)' }}>{t.make_model}</div>}
            </button>
          ))}
        </div>
      </div>
    )

    // Guided photo capture
    const step = INSPECTION_STEPS[inspectionStep]
    return (
      <div className="pos-screen" style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, padding: '12px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button onClick={() => { stopCamera(); setSelectedTruck(null); setScreen('driver_home') }} style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,.15)', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
            <div style={{ background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(10px)', borderRadius: 20, padding: '6px 14px' }}>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{tc('logistics.inspection_step_counter', { plate: selectedTruck.plate_number, step: inspectionStep + 1, total: INSPECTION_STEPS.length })}</span>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ marginTop: 10, height: 4, background: 'rgba(255,255,255,.2)', borderRadius: 2 }}>
            <div style={{ height: 4, background: ACC, borderRadius: 2, width: `${((inspectionStep + 1) / INSPECTION_STEPS.length) * 100}%`, transition: 'width .3s' }} />
          </div>
        </div>

        <input ref={camFileRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} aria-label={tc('logistics.aria_photograph_step', { label: step.label })} onChange={e => { const f = e.target.files?.[0]; if (f) captureInspectionFile(f); e.target.value = '' }} />
        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button onClick={() => camFileRef.current?.click()} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, background: 'none', border: 'none', cursor: 'pointer', padding: 24 }}>
            <div style={{ width: 96, height: 96, borderRadius: 24, border: '2px dashed rgba(255,255,255,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44 }}>{step.icon}</div>
            <div style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>{tc('logistics.tap_photograph_step', { label: step.label })}</div>
          </button>
        </div>

        <div style={{ background: 'rgba(0,0,0,.85)', padding: '16px 20px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <button onClick={() => camFileRef.current?.click()}
            style={{ width: 72, height: 72, borderRadius: 36, border: '4px solid #fff', background: ACC, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" />
            </svg>
          </button>
          <span style={{ color: 'rgba(255,255,255,.5)', fontSize: 12 }}>{tc('logistics.step_of_total', { step: inspectionStep + 1, total: INSPECTION_STEPS.length })}</span>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // INSPECTION REVIEW — after all 6 photos
  // ═══════════════════════════════════════════════════════════
  if (screen === 'inspection_done') return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: 'var(--pos-bg)', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ background: 'var(--pos-surface)', borderBottom: '1px solid var(--pos-border)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => { setScreen('driver_home'); setSelectedTruck(null) }} style={{ width: 36, height: 36, borderRadius: 10, background: '#f4f3f1', border: 'none', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{tc('logistics.review_inspection')}</div>
          <div style={{ fontSize: 12, color: 'var(--pos-muted)' }}>{selectedTruck?.plate_number} · {inspectionType === 'pre_trip' ? tc('logistics.review_pre_trip') : tc('logistics.review_post_trip')}</div>
        </div>
      </div>

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Photo grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {INSPECTION_STEPS.map(s => (
            <div key={s.key} style={{ position: 'relative' }}>
              {inspectionPhotos[s.key] ? (
                <img src={inspectionPhotos[s.key]} alt={s.label} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 10, border: '1px solid var(--pos-border)' }} />
              ) : (
                <div style={{ width: '100%', aspectRatio: '4/3', borderRadius: 10, background: '#f4f3f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'var(--pos-muted)' }}>{tc('logistics.photo_missing')}</div>
              )}
              <div style={{ fontSize: 10, color: 'var(--pos-muted)', textAlign: 'center', marginTop: 4 }}>{s.icon} {s.label}</div>
            </div>
          ))}
        </div>

        {/* Flag issues */}
        <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{tc('logistics.flag_any_issues')}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {ISSUE_KEYS.map(issueKey => {
            const issue = tc('logistics.issue_' + issueKey)
            return (
            <button key={issueKey} onClick={() => setFlaggedIssues(prev => prev.includes(issue) ? prev.filter(i => i !== issue) : [...prev, issue])}
              style={{ padding: '6px 12px', borderRadius: 20, border: flaggedIssues.includes(issue) ? `2px solid ${RED}` : '1.5px solid var(--pos-border)', background: flaggedIssues.includes(issue) ? 'var(--pos-danger-pale)' : 'var(--pos-surface)', color: flaggedIssues.includes(issue) ? RED : 'var(--pos-ink)', fontSize: 12, fontWeight: flaggedIssues.includes(issue) ? 700 : 500, cursor: 'pointer', fontFamily: 'inherit' }}>
              {issue}
            </button>
          )})}
        </div>

        <input placeholder={tc('logistics.additional_notes_optional')} value={inspectionNotes} onChange={e => setInspectionNotes(e.target.value)} style={inputStyle} />

        {scanError && <div style={{ color: RED, fontSize: 13, textAlign: 'center' }}>{scanError}</div>}

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button className="pos-btn-primary" onClick={submitInspection} disabled={saving}
            style={{ ...btnPrimary, background: flaggedIssues.length > 0 ? AMBER : GREEN, opacity: saving ? 0.6 : 1 }}>
            {saving ? tc('logistics.saving') : flaggedIssues.length > 0 ? (flaggedIssues.length !== 1 ? tc('logistics.submit_with_issues', { count: flaggedIssues.length }) : tc('logistics.submit_with_issue', { count: flaggedIssues.length })) : tc('logistics.submit_all_clear')}
          </button>
        </div>
      </div>
    </div>
  )

  return null
}

// ── Editable field component ─────────────────────────────
function Field({ label, value, onChange, inputMode }: {
  label: string; value: any; onChange: (v: string) => void; inputMode?: string
}) {
  return (
    <div>
      <div style={{ fontSize: 12, color: 'var(--pos-muted)', marginBottom: 4, fontWeight: 500 }}>{label}</div>
      <input
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        inputMode={inputMode as any}
        style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid var(--pos-border)', fontSize: 15, fontFamily: 'inherit', background: 'var(--pos-surface)', color: 'var(--pos-ink)', boxSizing: 'border-box', outline: 'none' }}
      />
    </div>
  )
}
