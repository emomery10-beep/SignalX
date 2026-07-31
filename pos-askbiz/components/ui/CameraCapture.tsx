'use client'
import { useRef, useState, useCallback, useEffect } from 'react'
import { tokens, radius } from './tokens'

interface Props {
  onCapture: (dataUrl: string) => void
  onUpload?: (file: File) => void
  label: string
  openLabel: string
  uploadLabel?: string
  facingMode?: 'environment' | 'user'
  /** Optional framing guide drawn over the live feed (e.g. a defect/ID reticle). */
  overlay?: React.ReactNode
}

// The one camera-capture UI every vertical should use. Standardises what
// used to drift per-page: a 76px shutter (was 60px in some screens, 76px in
// others — same action, same size everywhere now), the same open/close
// lifecycle, the same upload fallback, and the same pos-reveal entrance for
// the captured-frame preview.
export function CameraCapture({ onCapture, onUpload, label, openLabel, uploadLabel, facingMode = 'environment', overlay }: Props) {
  const videoRef  = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [cameraOn, setCameraOn] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setCameraOn(false)
  }, [])

  useEffect(() => stop, [stop])

  const start = useCallback(async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 1280 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play().catch(() => {})
      }
      setCameraOn(true)
    } catch {
      setError('camera_unavailable')
    }
  }, [facingMode])

  const capture = useCallback(() => {
    const v = videoRef.current, c = canvasRef.current
    if (!v || !c) return
    c.width = v.videoWidth
    c.height = v.videoHeight
    c.getContext('2d')?.drawImage(v, 0, 0)
    onCapture(c.toDataURL('image/jpeg', 0.85))
    stop()
  }, [onCapture, stop])

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onUpload) onUpload(file)
  }, [onUpload])

  if (!cameraOn) {
    return (
      <div
        className="pos-reveal"
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          padding: '32px 20px', borderRadius: radius.lg,
          border: `1px dashed ${tokens.border}`, background: tokens.bg,
        }}
      >
        <button
          onClick={start}
          className="pos-btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 22px', borderRadius: radius.pill, border: 'none', background: tokens.accent, color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
        >
          📷 {openLabel}
        </button>
        {onUpload && (
          <label style={{ fontSize: 13, color: tokens.muted, cursor: 'pointer', textDecoration: 'underline' }}>
            {uploadLabel}
            <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
          </label>
        )}
        {error && <p style={{ margin: 0, fontSize: 12.5, color: tokens.danger }}>{error === 'camera_unavailable' ? 'Camera unavailable — check permissions.' : error}</p>}
      </div>
    )
  }

  return (
    <div className="pos-screen" style={{ position: 'relative', borderRadius: radius.lg, overflow: 'hidden', background: '#000', aspectRatio: '1' }}>
      <video ref={videoRef} autoPlay playsInline muted style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {overlay}
      <button
        onClick={stop}
        aria-label="Close camera"
        style={{ position: 'absolute', top: 12, left: 12, width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,.5)', color: '#fff', border: 'none', fontSize: 16, cursor: 'pointer' }}
      >
        ×
      </button>
      <button
        onClick={capture}
        aria-label={label}
        style={{
          position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
          width: 76, height: 76, borderRadius: '50%',
          border: '4px solid #fff', background: tokens.accent, cursor: 'pointer',
        }}
      />
    </div>
  )
}
