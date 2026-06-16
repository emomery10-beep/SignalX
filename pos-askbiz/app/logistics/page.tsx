'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { isLogisticsHandlerLevel, isLogisticsDispatchLevel, isLogisticsBranchLevel, getRoleHomeRoute } from '@/lib/pos-role-client'

const ACC = '#0891b2'
const ACC_LIGHT = 'rgba(8,145,178,.1)'
const ACC_BORDER = 'rgba(8,145,178,.25)'
const GREEN = '#16a34a'
const RED = '#dc2626'
const AMBER = '#ca8a04'
const API = process.env.NEXT_PUBLIC_API_URL || ''

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
  assigned_truck_id?: string | null
  assigned_driver_id?: string | null
  truck?: { id: string; plate_number: string } | null
}

interface Truck {
  id: string; plate_number: string; make_model: string | null; status: string
}

type Screen = 'camera' | 'confirm' | 'parcels' | 'release' | 'success'
  | 'driver_home' | 'driver_parcels' | 'driver_deliver' | 'driver_fail' | 'driver_checkpoint'
  | 'inspection' | 'inspection_done'
type Mode = 'in' | 'out'

const INSPECTION_STEPS = [
  { key: 'photo_front', label: 'Front of truck', icon: '🚛' },
  { key: 'photo_rear', label: 'Rear of truck', icon: '🔙' },
  { key: 'photo_left', label: 'Left side', icon: '◀️' },
  { key: 'photo_right', label: 'Right side', icon: '▶️' },
  { key: 'photo_tyres', label: 'Tyres (close-up)', icon: '🛞' },
  { key: 'photo_cargo', label: 'Cargo area', icon: '📦' },
] as const

const FAIL_REASONS = [
  'Not home', 'Refused delivery', 'Wrong address', 'Phone unreachable',
  'Area inaccessible', 'Customer rescheduled', 'Other',
]

const STATUS_LABEL: Record<string, string> = {
  received: 'Received', at_branch: 'At Branch', assigned: 'Assigned',
  loaded: 'Loaded', in_transit: 'In Transit', at_destination: 'At Destination',
  out_for_delivery: 'Out for Delivery', delivered: 'Delivered',
  collected: 'Collected', failed_delivery: 'Failed', returned: 'Returned',
}
const STATUS_COLOR: Record<string, string> = {
  received: AMBER, at_branch: ACC, assigned: ACC, loaded: ACC,
  in_transit: '#6366f1', at_destination: GREEN, out_for_delivery: '#6366f1',
  delivered: GREEN, collected: GREEN, failed_delivery: RED, returned: RED,
}

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return new Date(iso).toLocaleDateString()
}

export default function LogisticsPage() {
  const router = useRouter()
  const [staff, setStaff] = useState<StaffSession | null>(null)
  const [screen, setScreen] = useState<Screen>('camera')
  const [mode, setMode] = useState<Mode>('in')

  // Camera
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [scanError, setScanError] = useState('')
  const [capturedImage, setCapturedImage] = useState('')

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

  // Success
  const [successMsg, setSuccessMsg] = useState('')
  const [successTracking, setSuccessTracking] = useState('')

  // Driver-specific
  const [myParcels, setMyParcels] = useState<Parcel[]>([])
  const [driverLoading, setDriverLoading] = useState(false)
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
    } else {
      startCamera()
    }

    if (navigator.geolocation) {
      const doGeo = () => navigator.geolocation.getCurrentPosition(
        pos => setGeoCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      )
      doGeo()
      const geoTimer = setInterval(doGeo, 60_000)
      return () => clearInterval(geoTimer)
    }
  }, [])

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
    setScanError(''); setScanResult(null); setCapturedImage('')
    // Stop any existing stream before opening a new one to avoid leaked tracks
    const existing = videoRef.current?.srcObject as MediaStream | null
    if (existing) { existing.getTracks().forEach(t => t.stop()); if (videoRef.current) videoRef.current.srcObject = null }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      })
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play() }
      setCameraActive(true)
    } catch {
      setScanError('Camera not available')
      setCameraActive(false)
    }
  }

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream
    stream?.getTracks().forEach(t => t.stop())
    if (videoRef.current) videoRef.current.srcObject = null
    setCameraActive(false)
  }

  const captureAndScan = async () => {
    if (!canvasRef.current || !videoRef.current || scanning) return
    const canvas = canvasRef.current
    const video = videoRef.current
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
        setScanError(result.message || 'Could not identify document. Try again.')
        setScanning(false)
        return
      }
      setScanResult(result)
      setEditFields({ ...result.data })
      setScreen('confirm')
    } catch {
      setScanError('Scan failed. Check your connection.')
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
        setSuccessMsg('Parcel received')
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
        setSuccessMsg('Invoice saved')
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
        setSuccessMsg('Receipt saved')
        setSuccessTracking('')
      }

      setScreen('success')
    } catch {
      setScanError('Failed to save. Try again.')
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
      setSuccessMsg('Parcel released')
      setSuccessTracking(selectedParcel.tracking_number)
      setTodayOut(prev => prev + 1)
      setScreen('success')
    } catch {
      setScanError('Failed to release parcel')
    }
    setSaving(false)
  }

  // ── Reset to camera ──────────────────────────────────────
  const resetToCamera = () => {
    setScanResult(null); setEditFields({}); setCapturedImage('')
    setScanError(''); setSuccessMsg(''); setSuccessTracking('')
    setSelectedParcel(null); setCollectName(''); setSearchQuery('')
    setParcels([]); setDeliveryNotes(''); setFailReason('')
    if (staff?.role === 'driver') {
      setScreen('driver_home')
      loadDriverParcels(staff)
    } else {
      setScreen('camera')
      startCamera()
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
      setMyParcels((data.parcels || []).filter((p: Parcel) =>
        ['assigned', 'loaded', 'in_transit', 'out_for_delivery'].includes(p.status)
      ))
    } catch {}
    setDriverLoading(false)
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

  // ── Driver: pickup from branch ──────────────────────────
  const handlePickup = async (parcel: Parcel) => {
    setSaving(true)
    try {
      // Capture photo for pickup proof
      if (canvasRef.current && videoRef.current) {
        const canvas = canvasRef.current
        const video = videoRef.current
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        canvas.getContext('2d')?.drawImage(video, 0, 0)
        const photoUrl = canvas.toDataURL('image/jpeg', 0.85)
        stopCamera()

        await fetch(`${API}/api/pos/parcels/handover`, {
          method: 'POST', headers: headers(),
          body: JSON.stringify({
            parcel_id: parcel.id, action: 'pickup',
            photo_url: photoUrl, storage: 'fallback',
            lat: geoCoords?.lat, lng: geoCoords?.lng,
          }),
        })
      } else {
        await fetch(`${API}/api/pos/parcels/handover`, {
          method: 'POST', headers: headers(),
          body: JSON.stringify({
            parcel_id: parcel.id, action: 'pickup',
            lat: geoCoords?.lat, lng: geoCoords?.lng,
          }),
        })
      }
      setSuccessMsg('Parcel picked up')
      setSuccessTracking(parcel.tracking_number)
      setScreen('success')
      if (staff) loadDriverParcels(staff)
    } catch { setScanError('Pickup failed') }
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
      setScanError('Video recording not supported on this device')
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
      setScanError('Video recording not supported on this device')
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
    if (captureMode === 'video' && !capturedVideo) { setScanError('Record a video first'); return }
    setSaving(true)
    try {
      // Capture still photo from current frame
      let photoUrl = ''
      if (canvasRef.current && videoRef.current) {
        const canvas = canvasRef.current; const video = videoRef.current
        canvas.width = video.videoWidth; canvas.height = video.videoHeight
        canvas.getContext('2d')?.drawImage(video, 0, 0)
        photoUrl = canvas.toDataURL('image/jpeg', 0.85)
        stopCamera()
      }

      // Post delivery handover (photo proof + status update)
      await fetch(`${API}/api/pos/parcels/handover`, {
        method: 'POST', headers: headers(),
        body: JSON.stringify({
          parcel_id: selectedParcel.id, action: 'deliver',
          photo_url: photoUrl || undefined, storage: photoUrl ? 'fallback' : undefined,
          lat: geoCoords?.lat, lng: geoCoords?.lng,
          notes: deliveryNotes || undefined,
        }),
      })

      // Also attach video clip as a separate evidence record
      if (capturedVideo) {
        const videoToPost = capturedVideo
        setCapturedVideo(null) // clear before POST so a retry cannot double-submit
        await fetch(`${API}/api/pos/parcels/photos`, {
          method: 'POST', headers: headers(),
          body: JSON.stringify({
            parcel_id: selectedParcel.id,
            photo_type: 'delivery_video',
            photo_url: videoToPost,
            storage: 'fallback',
            lat: geoCoords?.lat, lng: geoCoords?.lng,
            notes: deliveryNotes || 'Delivery video',
          }),
        })
      }

      setSuccessMsg('Delivered')
      setSuccessTracking(selectedParcel.tracking_number)
      setTodayOut(prev => prev + 1)
      setScreen('success')
      loadDriverParcels(staff)
    } catch { setScanError('Delivery failed') }
    setSaving(false)
  }

  // ── Driver: failed delivery ─────────────────────────────
  const handleFailDelivery = async () => {
    if (!selectedParcel || !staff || !failReason) return
    setSaving(true)
    try {
      let photoUrl = ''
      if (canvasRef.current && videoRef.current) {
        const canvas = canvasRef.current; const video = videoRef.current
        canvas.width = video.videoWidth; canvas.height = video.videoHeight
        canvas.getContext('2d')?.drawImage(video, 0, 0)
        photoUrl = canvas.toDataURL('image/jpeg', 0.85)
        stopCamera()
      }

      await fetch(`${API}/api/pos/parcels/handover`, {
        method: 'POST', headers: headers(),
        body: JSON.stringify({
          parcel_id: selectedParcel.id, action: 'fail',
          photo_url: photoUrl || undefined, storage: photoUrl ? 'fallback' : undefined,
          lat: geoCoords?.lat, lng: geoCoords?.lng,
          fail_reason: failReason, notes: deliveryNotes || undefined,
        }),
      })
      setSuccessMsg('Marked as failed')
      setSuccessTracking(selectedParcel.tracking_number)
      setScreen('success')
      loadDriverParcels(staff)
    } catch { setScanError('Failed to update') }
    setSaving(false)
  }

  // ── Driver: checkpoint ──────────────────────────────────
  const handleCheckpoint = async () => {
    if (!selectedParcel || !staff) return
    setSaving(true)
    try {
      let photoUrl = ''
      if (canvasRef.current && videoRef.current) {
        const canvas = canvasRef.current; const video = videoRef.current
        canvas.width = video.videoWidth; canvas.height = video.videoHeight
        canvas.getContext('2d')?.drawImage(video, 0, 0)
        photoUrl = canvas.toDataURL('image/jpeg', 0.85)
        stopCamera()
      }

      await fetch(`${API}/api/pos/parcels/handover`, {
        method: 'POST', headers: headers(),
        body: JSON.stringify({
          parcel_id: selectedParcel.id, action: 'checkpoint',
          photo_url: photoUrl || undefined, storage: photoUrl ? 'fallback' : undefined,
          lat: geoCoords?.lat, lng: geoCoords?.lng,
          notes: deliveryNotes || 'Checkpoint',
        }),
      })
      setSuccessMsg('Checkpoint logged')
      setSuccessTracking(selectedParcel.tracking_number)
      setScreen('success')
    } catch { setScanError('Failed to log checkpoint') }
    setSaving(false)
  }

  // ── Vehicle inspection: capture one step ────────────────
  const captureInspectionPhoto = () => {
    if (!canvasRef.current || !videoRef.current) return
    const canvas = canvasRef.current; const video = videoRef.current
    canvas.width = video.videoWidth; canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
    const key = INSPECTION_STEPS[inspectionStep].key
    setInspectionPhotos(prev => ({ ...prev, [key]: dataUrl }))

    if (inspectionStep < INSPECTION_STEPS.length - 1) {
      setInspectionStep(prev => prev + 1)
    } else {
      stopCamera()
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
      setSuccessMsg(`${inspectionType === 'pre_trip' ? 'Pre-trip' : 'Post-trip'} inspection saved`)
      setSuccessTracking(selectedTruck.plate_number)
      setScreen('success')
    } catch { setScanError('Failed to save inspection') }
    setSaving(false)
  }

  // ── Styles ───────────────────────────────────────────────
  const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid var(--pos-border)', fontSize: 15, fontFamily: 'inherit', background: 'var(--pos-surface)', color: 'var(--pos-ink)', boxSizing: 'border-box', outline: 'none' }
  const btnPrimary: React.CSSProperties = { flex: 1, padding: '14px', borderRadius: 12, background: ACC, color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }
  const btnSecondary: React.CSSProperties = { flex: 1, padding: '14px', borderRadius: 12, background: 'transparent', color: 'var(--pos-muted)', fontSize: 14, fontWeight: 600, border: '1.5px solid var(--pos-border)', cursor: 'pointer', fontFamily: 'inherit' }

  if (!staff) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--pos-bg)' }}>Loading…</div>

  // ═══════════════════════════════════════════════════════════
  // CAMERA HOME SCREEN
  // ═══════════════════════════════════════════════════════════
  if (screen === 'camera') return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Top bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(10px)', borderRadius: 20, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, background: geoCoords ? GREEN : AMBER }} />
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{staff.name}</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(10px)', borderRadius: 20, padding: '6px 12px' }}>
            <span style={{ color: '#fff', fontSize: 12 }}>📦 {todayIn} in · {todayOut} out</span>
          </div>
        </div>
        <button onClick={() => { stopCamera(); localStorage.removeItem('pos_staff'); router.push('/') }} style={{ background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(10px)', border: 'none', borderRadius: 20, padding: '6px 14px', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
          Sign out
        </button>
      </div>

      {/* Camera viewfinder */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <video ref={videoRef} playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Scanning overlay */}
        {scanning && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, border: '3px solid #fff', borderTopColor: ACC, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>Reading document…</span>
          </div>
        )}

        {/* Scan error */}
        {scanError && (
          <div className="pos-banner" style={{ position: 'absolute', bottom: 120, left: 16, right: 16, background: 'rgba(220,38,38,.9)', borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 13, textAlign: 'center' }}>
            {scanError}
            <button onClick={resetToCamera} style={{ display: 'block', margin: '8px auto 0', background: 'rgba(255,255,255,.2)', border: 'none', borderRadius: 8, padding: '6px 16px', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
              Try again
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
                else if (screen !== 'camera') resetToCamera()
              }}
                style={{ padding: '8px 28px', borderRadius: 8, border: 'none', background: mode === m ? ACC : 'transparent', color: mode === m ? '#fff' : 'rgba(255,255,255,.6)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s' }}>
                {m === 'in' ? '📦 Receive' : '📤 Release'}
              </button>
            ))}
          </div>
        )}

        {/* Shutter button */}
        <button onClick={captureAndScan} disabled={scanning || !cameraActive}
          style={{ width: 72, height: 72, borderRadius: 36, border: '4px solid #fff', background: scanning ? '#666' : ACC, cursor: scanning ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform .15s', transform: scanning ? 'scale(0.9)' : 'scale(1)' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </button>
        <span style={{ color: 'rgba(255,255,255,.5)', fontSize: 12 }}>Point at waybill, invoice, or receipt</span>
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
              {dt === 'waybill' ? '📦 Waybill detected' : dt === 'invoice' ? '🧾 Invoice detected' : '🧾 Receipt detected'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--pos-muted)' }}>{conf}% confidence</div>
          </div>
        </div>

        {/* Captured image thumbnail */}
        {capturedImage && (
          <div className="pos-reveal" style={{ padding: '12px 20px 0' }}>
            <img src={capturedImage} alt="scan" style={{ width: '100%', borderRadius: 12, maxHeight: 160, objectFit: 'cover', border: '1px solid var(--pos-border)' }} />
          </div>
        )}

        {/* Editable fields */}
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {dt === 'waybill' && <>
            <Field label="Sender name" value={editFields.sender_name} onChange={v => setEditFields(p => ({ ...p, sender_name: v }))} />
            <Field label="Sender phone" value={editFields.sender_phone} onChange={v => setEditFields(p => ({ ...p, sender_phone: v }))} inputMode="tel" />
            <Field label="Receiver name" value={editFields.receiver_name} onChange={v => setEditFields(p => ({ ...p, receiver_name: v }))} />
            <Field label="Receiver phone" value={editFields.receiver_phone} onChange={v => setEditFields(p => ({ ...p, receiver_phone: v }))} inputMode="tel" />
            <Field label="Destination city" value={editFields.destination_city} onChange={v => setEditFields(p => ({ ...p, destination_city: v }))} />
            <Field label="Description" value={editFields.description} onChange={v => setEditFields(p => ({ ...p, description: v }))} />
            <Field label="Weight (kg)" value={editFields.weight_kg} onChange={v => setEditFields(p => ({ ...p, weight_kg: v }))} inputMode="decimal" />
            {editFields.tracking_number && <Field label="Tracking #" value={editFields.tracking_number} onChange={v => setEditFields(p => ({ ...p, tracking_number: v }))} />}
          </>}

          {dt === 'invoice' && <>
            <Field label="Vendor" value={editFields.vendor_name} onChange={v => setEditFields(p => ({ ...p, vendor_name: v }))} />
            <Field label="Invoice #" value={editFields.invoice_number} onChange={v => setEditFields(p => ({ ...p, invoice_number: v }))} />
            <Field label="Total amount" value={editFields.total_amount} onChange={v => setEditFields(p => ({ ...p, total_amount: v }))} inputMode="decimal" />
            <Field label="Currency" value={editFields.currency || 'KES'} onChange={v => setEditFields(p => ({ ...p, currency: v }))} />
            <Field label="Date" value={editFields.date} onChange={v => setEditFields(p => ({ ...p, date: v }))} />
            <div style={{ fontSize: 12, color: 'var(--pos-muted)' }}>
              Category:
              <select value={editFields.category || ''} onChange={e => setEditFields(p => ({ ...p, category: e.target.value || null }))} style={{ ...inputStyle, marginTop: 4 }}>
                <option value="">— Select —</option>
                <option value="fuel">Fuel</option>
                <option value="maintenance">Maintenance</option>
                <option value="toll">Toll</option>
                <option value="loading">Loading</option>
                <option value="other">Other</option>
              </select>
            </div>
          </>}

          {dt === 'receipt' && <>
            <Field label="Amount" value={editFields.amount} onChange={v => setEditFields(p => ({ ...p, amount: v }))} inputMode="decimal" />
            <Field label="Currency" value={editFields.currency || 'KES'} onChange={v => setEditFields(p => ({ ...p, currency: v }))} />
            <Field label="Payment method" value={editFields.payment_method} onChange={v => setEditFields(p => ({ ...p, payment_method: v }))} />
            <Field label="Receipt #" value={editFields.receipt_number} onChange={v => setEditFields(p => ({ ...p, receipt_number: v }))} />
            <Field label="Payer" value={editFields.payer_name} onChange={v => setEditFields(p => ({ ...p, payer_name: v }))} />
            <Field label="Payee" value={editFields.payee_name} onChange={v => setEditFields(p => ({ ...p, payee_name: v }))} />
            <Field label="Date" value={editFields.date} onChange={v => setEditFields(p => ({ ...p, date: v }))} />
          </>}

          {scanError && <div style={{ color: RED, fontSize: 13, textAlign: 'center' }}>{scanError}</div>}

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="pos-btn-primary" onClick={handleConfirm} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.6 : 1 }}>
              {saving ? 'Saving…' : '✓ Confirm'}
            </button>
            <button onClick={resetToCamera} style={btnSecondary}>Re-scan</button>
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
          <div style={{ fontSize: 15, fontWeight: 700 }}>📤 Release Parcel</div>
          <div style={{ fontSize: 12, color: 'var(--pos-muted)' }}>Search by name, phone, or tracking #</div>
        </div>
      </div>

      <div style={{ padding: '12px 20px' }}>
        <input
          placeholder="Search parcels…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={inputStyle}
          autoFocus
        />
      </div>

      <div style={{ padding: '0 20px' }}>
        {searchLoading && <div style={{ color: 'var(--pos-muted)', fontSize: 13, padding: '12px 0' }}>Searching…</div>}
        {!searchLoading && searchQuery && parcels.length === 0 && (
          <div style={{ color: 'var(--pos-muted)', fontSize: 13, padding: '12px 0', textAlign: 'center' }}>No parcels found at this branch</div>
        )}
        {parcels.map((p, idx) => (
          <button key={p.id} className="pos-item" onClick={() => { setSelectedParcel(p); setCollectName(p.receiver_name || ''); setScreen('release') }}
            style={{ width: '100%', background: 'var(--pos-surface)', border: '1px solid var(--pos-border)', borderRadius: 12, padding: '14px 16px', marginBottom: 8, textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', justifyContent: 'space-between', alignItems: 'center', animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--pos-ink)' }}>{p.tracking_number}</div>
              <div style={{ fontSize: 13, color: 'var(--pos-muted)', marginTop: 2 }}>To: {p.receiver_name || '—'} {p.receiver_phone ? `· ${p.receiver_phone}` : ''}</div>
              <div style={{ fontSize: 12, color: 'var(--pos-hint)', marginTop: 2 }}>{p.description || '—'} · {timeAgo(p.created_at)}</div>
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
        <div style={{ fontSize: 15, fontWeight: 700 }}>Release {selectedParcel.tracking_number}</div>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ background: 'var(--pos-surface)', border: '1px solid var(--pos-border)', borderRadius: 14, padding: '16px 18px' }}>
          <div style={{ fontSize: 12, color: 'var(--pos-muted)', marginBottom: 8 }}>Parcel details</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{selectedParcel.receiver_name || '—'}</div>
          <div style={{ fontSize: 13, color: 'var(--pos-muted)' }}>{selectedParcel.receiver_phone || ''}</div>
          <div style={{ fontSize: 13, color: 'var(--pos-muted)', marginTop: 4 }}>{selectedParcel.description || '—'}</div>
          {selectedParcel.fee_charged ? (
            <div style={{ fontSize: 14, fontWeight: 700, color: ACC, marginTop: 8 }}>Fee: KES {selectedParcel.fee_charged.toLocaleString()}</div>
          ) : null}
        </div>

        <Field label="Collected by (name)" value={collectName} onChange={setCollectName} />

        {scanError && <div style={{ color: RED, fontSize: 13, textAlign: 'center' }}>{scanError}</div>}

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button className="pos-btn-primary" onClick={handleRelease} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Releasing…' : '✓ Release Parcel'}
          </button>
          <button onClick={() => setScreen('parcels')} style={btnSecondary}>Back</button>
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
      <div style={{ fontSize: 13, color: 'var(--pos-muted)', marginBottom: 32 }}>📦 {todayIn} received · {todayOut} released today</div>
      <button className="pos-btn-primary" onClick={resetToCamera} style={{ ...btnPrimary, width: '100%', maxWidth: 320 }}>
        {staff?.role === 'driver' ? '← Back to my parcels' : '📷 Scan next'}
      </button>
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
              Driver · {myParcels.length} parcels
            </div>
          </div>
        </div>
        <button onClick={() => { localStorage.removeItem('pos_staff'); router.push('/') }} style={{ background: '#f4f3f1', border: 'none', borderRadius: 8, padding: '6px 12px', color: 'var(--pos-muted)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Sign out</button>
      </div>

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Quick actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => {
            setInspectionStep(0); setInspectionPhotos({}); setInspectionType('pre_trip')
            setFlaggedIssues([]); setInspectionNotes('')
            if (selectedTruck || trucks.length === 1) { setScreen('inspection'); startCamera() }
            else { setScreen('inspection') }
          }} style={{ flex: 1, padding: '14px', borderRadius: 12, background: ACC_LIGHT, border: `1px solid ${ACC_BORDER}`, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center' }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>🔍</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: ACC }}>Vehicle Check</div>
          </button>
          <button onClick={() => { setScreen('camera'); startCamera() }} style={{ flex: 1, padding: '14px', borderRadius: 12, background: ACC_LIGHT, border: `1px solid ${ACC_BORDER}`, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center' }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>📷</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: ACC }}>Scan Document</div>
          </button>
        </div>

        {/* My parcels */}
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--pos-ink)', marginTop: 4 }}>My Parcels</div>
        {driverLoading && <div style={{ color: 'var(--pos-muted)', fontSize: 13 }}>Loading…</div>}
        {!driverLoading && myParcels.length === 0 && (
          <div style={{ background: 'var(--pos-surface)', border: '1px solid var(--pos-border)', borderRadius: 12, padding: '24px 16px', textAlign: 'center', color: 'var(--pos-muted)', fontSize: 13 }}>
            No parcels assigned to you yet
          </div>
        )}
        {myParcels.map((p, idx) => (
          <div key={p.id} className="pos-item" style={{ background: 'var(--pos-surface)', border: '1px solid var(--pos-border)', borderRadius: 12, padding: '14px 16px', animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{p.tracking_number}</div>
                <div style={{ fontSize: 13, color: 'var(--pos-muted)', marginTop: 2 }}>To: {p.receiver_name || '—'} · {p.destination_city || ''}</div>
                {p.description && <div style={{ fontSize: 12, color: 'var(--pos-hint)', marginTop: 2 }}>{p.description}</div>}
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: (STATUS_COLOR[p.status] || '#6b7280') + '18', color: STATUS_COLOR[p.status] || '#6b7280', whiteSpace: 'nowrap' }}>
                {STATUS_LABEL[p.status] || p.status}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['assigned', 'loaded'].includes(p.status) && (
                <button onClick={() => handlePickup(p)} disabled={saving} style={{ padding: '7px 14px', borderRadius: 8, border: 'none', background: ACC, color: '#fff', fontSize: 12, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: saving ? 0.5 : 1 }}>
                  📷 Pick up
                </button>
              )}
              {['in_transit', 'out_for_delivery'].includes(p.status) && <>
                <button onClick={() => { setSelectedParcel(p); setDeliveryNotes(''); setScreen('driver_deliver'); startCamera() }} style={{ padding: '7px 14px', borderRadius: 8, border: 'none', background: GREEN, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  ✓ Deliver
                </button>
                <button onClick={() => { setSelectedParcel(p); setDeliveryNotes(''); setScreen('driver_checkpoint'); startCamera() }} style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${ACC_BORDER}`, background: 'transparent', color: ACC, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  📍 Checkpoint
                </button>
                <button onClick={() => { setSelectedParcel(p); setFailReason(''); setDeliveryNotes(''); setScreen('driver_fail') }} style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(220,38,38,.25)', background: 'transparent', color: RED, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  ✗ Failed
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
        <button onClick={() => { stopVideoRecording(); stopCamera(); setCapturedVideo(null); setCaptureMode('photo'); setScreen('driver_home') }}
          style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,.15)', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <div style={{ background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(10px)', borderRadius: 20, padding: '6px 14px', flex: 1 }}>
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>Proof of Delivery · {selectedParcel.tracking_number}</span>
        </div>
        {/* Photo / Video toggle */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,.15)', borderRadius: 20, padding: 2, gap: 2 }}>
          {(['photo', 'video'] as const).map(m => (
            <button key={m} onClick={() => { if (isRecording) stopVideoRecording(); setCaptureMode(m); setCapturedVideo(null) }}
              style={{ padding: '5px 12px', borderRadius: 18, border: 'none', background: captureMode === m ? '#fff' : 'transparent', color: captureMode === m ? '#000' : '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
              {m === 'photo' ? '📷' : '🎥'} {m}
            </button>
          ))}
        </div>
      </div>

      {/* Viewfinder */}
      <div style={{ flex: 1, position: 'relative' }}>
        <video ref={videoRef} playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Recording indicator */}
        {isRecording && (
          <div style={{ position: 'absolute', top: 70, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,.6)', borderRadius: 20, padding: '6px 14px' }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, background: RED, animation: 'pulse 1s infinite' }} />
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>REC {recordingSeconds}s / 8s</span>
          </div>
        )}

        {/* Video captured badge */}
        {capturedVideo && !isRecording && (
          <div style={{ position: 'absolute', top: 70, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(22,163,74,.85)', borderRadius: 20, padding: '6px 14px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>Video ready · {recordingSeconds}s</span>
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div style={{ background: 'rgba(0,0,0,.88)', padding: '14px 20px 36px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ color: 'rgba(255,255,255,.7)', fontSize: 13, textAlign: 'center' }}>
          To: <strong style={{ color: '#fff' }}>{selectedParcel.receiver_name || '—'}</strong>{selectedParcel.destination_city ? ` · ${selectedParcel.destination_city}` : ''}
        </div>
        <input placeholder="Notes (optional)" value={deliveryNotes} onChange={e => setDeliveryNotes(e.target.value)}
          style={{ width: '100%', maxWidth: 360, padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,.2)', background: 'rgba(255,255,255,.1)', color: '#fff', fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none' }} />

        {scanError && <div style={{ color: '#fca5a5', fontSize: 13 }}>{scanError}</div>}

        {captureMode === 'photo' ? (
          <>
            <button onClick={handleDeliver} disabled={saving}
              style={{ width: 72, height: 72, borderRadius: 36, border: '4px solid #fff', background: GREEN, cursor: saving ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: saving ? 0.6 : 1 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
            </button>
            <span style={{ color: 'rgba(255,255,255,.45)', fontSize: 11 }}>Snap photo · confirm delivery</span>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            {/* Record / Stop button */}
            {!capturedVideo ? (
              <>
                <button
                  onClick={isRecording ? stopVideoRecording : startVideoRecording}
                  style={{ width: 72, height: 72, borderRadius: 36, border: `4px solid ${isRecording ? RED : '#fff'}`, background: isRecording ? RED : 'rgba(255,255,255,.15)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 200ms' }}>
                  {isRecording
                    ? <div style={{ width: 22, height: 22, borderRadius: 3, background: '#fff' }} />
                    : <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="8"/></svg>
                  }
                </button>
                <span style={{ color: 'rgba(255,255,255,.45)', fontSize: 11 }}>{isRecording ? 'Tap to stop recording' : 'Tap to start recording (8s max)'}</span>
              </>
            ) : (
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <button onClick={() => { setCapturedVideo(null); setRecordingSeconds(0) }}
                  style={{ padding: '10px 18px', borderRadius: 10, border: '1px solid rgba(255,255,255,.3)', background: 'transparent', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  Re-record
                </button>
                <button onClick={handleDeliver} disabled={saving}
                  style={{ padding: '12px 28px', borderRadius: 10, border: 'none', background: GREEN, color: '#fff', fontSize: 14, fontWeight: 700, cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.6 : 1 }}>
                  {saving ? 'Uploading…' : 'Confirm Delivery'}
                </button>
              </div>
            )}
          </div>
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
        <button onClick={() => { stopCamera(); setScreen('driver_home') }} style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,.15)', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <div style={{ background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(10px)', borderRadius: 20, padding: '6px 14px' }}>
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>📍 Checkpoint — {selectedParcel.tracking_number}</span>
        </div>
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        <video ref={videoRef} playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
      <div style={{ background: 'rgba(0,0,0,.85)', padding: '16px 20px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        {geoCoords && <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 11 }}>📍 {geoCoords.lat.toFixed(4)}, {geoCoords.lng.toFixed(4)}</div>}
        <input placeholder="Location name (optional)" value={deliveryNotes} onChange={e => setDeliveryNotes(e.target.value)}
          style={{ width: '100%', maxWidth: 360, padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,.2)', background: 'rgba(255,255,255,.1)', color: '#fff', fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none' }} />
        <button onClick={handleCheckpoint} disabled={saving}
          style={{ width: 72, height: 72, borderRadius: 36, border: '4px solid #fff', background: '#6366f1', cursor: saving ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
          </svg>
        </button>
        <span style={{ color: 'rgba(255,255,255,.5)', fontSize: 12 }}>Snap & log checkpoint</span>
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
          <div style={{ fontSize: 15, fontWeight: 700, color: RED }}>Failed Delivery</div>
          <div style={{ fontSize: 12, color: 'var(--pos-muted)' }}>{selectedParcel.tracking_number} · {selectedParcel.receiver_name}</div>
        </div>
      </div>
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--pos-ink)' }}>Reason</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {FAIL_REASONS.map(r => (
            <button key={r} onClick={() => setFailReason(r)}
              style={{ padding: '8px 14px', borderRadius: 20, border: failReason === r ? `2px solid ${RED}` : '1.5px solid var(--pos-border)', background: failReason === r ? 'var(--pos-danger-pale)' : 'var(--pos-surface)', color: failReason === r ? RED : 'var(--pos-ink)', fontSize: 13, fontWeight: failReason === r ? 700 : 500, cursor: 'pointer', fontFamily: 'inherit' }}>
              {r}
            </button>
          ))}
        </div>
        <input placeholder="Additional notes (optional)" value={deliveryNotes} onChange={e => setDeliveryNotes(e.target.value)} style={inputStyle} />

        {scanError && <div style={{ color: RED, fontSize: 13, textAlign: 'center' }}>{scanError}</div>}

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button onClick={handleFailDelivery} disabled={saving || !failReason} style={{ ...btnPrimary, background: RED, opacity: !failReason || saving ? 0.5 : 1 }}>
            {saving ? 'Saving…' : 'Confirm Failed Delivery'}
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
          <div style={{ fontSize: 15, fontWeight: 700 }}>🔍 Vehicle Inspection</div>
        </div>
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            {(['pre_trip', 'post_trip'] as const).map(t => (
              <button key={t} onClick={() => setInspectionType(t)}
                style={{ flex: 1, padding: '10px', borderRadius: 10, border: inspectionType === t ? `2px solid ${ACC}` : '1.5px solid var(--pos-border)', background: inspectionType === t ? ACC_LIGHT : 'var(--pos-surface)', color: inspectionType === t ? ACC : 'var(--pos-ink)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
  {t === 'pre_trip' ? '🌅 Pre-trip' : '🌆 Post-trip'}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Select truck</div>
          {trucks.length === 0 && <div style={{ color: 'var(--pos-muted)', fontSize: 13 }}>No trucks available</div>}
          {trucks.map(t => (
            <button key={t.id} onClick={() => { setSelectedTruck(t); startCamera() }}
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
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{selectedTruck.plate_number} · {inspectionStep + 1}/{INSPECTION_STEPS.length}</span>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ marginTop: 10, height: 4, background: 'rgba(255,255,255,.2)', borderRadius: 2 }}>
            <div style={{ height: 4, background: ACC, borderRadius: 2, width: `${((inspectionStep + 1) / INSPECTION_STEPS.length) * 100}%`, transition: 'width .3s' }} />
          </div>
        </div>

        <div style={{ flex: 1, position: 'relative' }}>
          <video ref={videoRef} playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

        <div style={{ background: 'rgba(0,0,0,.85)', padding: '16px 20px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ color: '#fff', fontSize: 15, fontWeight: 700 }}>{step.icon} {step.label}</div>
          <button onClick={captureInspectionPhoto}
            style={{ width: 72, height: 72, borderRadius: 36, border: '4px solid #fff', background: ACC, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" />
            </svg>
          </button>
          <span style={{ color: 'rgba(255,255,255,.5)', fontSize: 12 }}>Step {inspectionStep + 1} of {INSPECTION_STEPS.length}</span>
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
          <div style={{ fontSize: 15, fontWeight: 700 }}>Review Inspection</div>
          <div style={{ fontSize: 12, color: 'var(--pos-muted)' }}>{selectedTruck?.plate_number} · {inspectionType === 'pre_trip' ? 'Pre-trip' : 'Post-trip'}</div>
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
                <div style={{ width: '100%', aspectRatio: '4/3', borderRadius: 10, background: '#f4f3f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'var(--pos-muted)' }}>Missing</div>
              )}
              <div style={{ fontSize: 10, color: 'var(--pos-muted)', textAlign: 'center', marginTop: 4 }}>{s.icon} {s.label}</div>
            </div>
          ))}
        </div>

        {/* Flag issues */}
        <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>Flag any issues</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['Tyre wear', 'Body damage', 'Light broken', 'Mirror damaged', 'Cargo area dirty', 'Fluid leak', 'Brake issue'].map(issue => (
            <button key={issue} onClick={() => setFlaggedIssues(prev => prev.includes(issue) ? prev.filter(i => i !== issue) : [...prev, issue])}
              style={{ padding: '6px 12px', borderRadius: 20, border: flaggedIssues.includes(issue) ? `2px solid ${RED}` : '1.5px solid var(--pos-border)', background: flaggedIssues.includes(issue) ? 'var(--pos-danger-pale)' : 'var(--pos-surface)', color: flaggedIssues.includes(issue) ? RED : 'var(--pos-ink)', fontSize: 12, fontWeight: flaggedIssues.includes(issue) ? 700 : 500, cursor: 'pointer', fontFamily: 'inherit' }}>
              {issue}
            </button>
          ))}
        </div>

        <input placeholder="Additional notes (optional)" value={inspectionNotes} onChange={e => setInspectionNotes(e.target.value)} style={inputStyle} />

        {scanError && <div style={{ color: RED, fontSize: 13, textAlign: 'center' }}>{scanError}</div>}

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button className="pos-btn-primary" onClick={submitInspection} disabled={saving}
            style={{ ...btnPrimary, background: flaggedIssues.length > 0 ? AMBER : GREEN, opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Saving…' : flaggedIssues.length > 0 ? `⚠ Submit with ${flaggedIssues.length} issue${flaggedIssues.length !== 1 ? 's' : ''}` : '✓ Submit — all clear'}
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
