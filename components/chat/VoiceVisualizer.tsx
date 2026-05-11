'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

interface Props {
  isActive: boolean
  transcript: string
  analyserNode: AnalyserNode | null
  onStop: () => void
}

export default function VoiceVisualizer({ isActive, transcript, analyserNode, onStop }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !isActive) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 5 wave lines — blues and purples like Gemini
    const waves = [
      { color: 'rgba(99,102,241,0.9)',  speed: 0.02, amp: 0.7, phase: 0 },   // indigo
      { color: 'rgba(139,92,246,0.8)',  speed: 0.025, amp: 0.5, phase: 1 },  // violet
      { color: 'rgba(59,130,246,0.7)',  speed: 0.015, amp: 0.6, phase: 2 },  // blue
      { color: 'rgba(168,85,247,0.6)',  speed: 0.03, amp: 0.4, phase: 3 },   // purple
      { color: 'rgba(14,165,233,0.5)',  speed: 0.018, amp: 0.3, phase: 4 },  // sky
    ]

    let t = 0
    const data = new Uint8Array(analyserNode ? analyserNode.frequencyBinCount : 128)

    const draw = () => {
      animRef.current = requestAnimationFrame(draw)
      const W = canvas.width
      const H = canvas.height
      ctx.clearRect(0, 0, W, H)

      // Get audio data
      let audioLevel = 0.3
      if (analyserNode) {
        analyserNode.getByteFrequencyData(data)
        audioLevel = Array.from(data.slice(0, 32)).reduce((a, b) => a + b, 0) / (32 * 255)
        audioLevel = Math.max(0.15, audioLevel)
      }

      waves.forEach((wave, i) => {
        ctx.beginPath()
        ctx.strokeStyle = wave.color
        ctx.lineWidth = 2.5

        for (let x = 0; x <= W; x += 2) {
          const progress = x / W
          // Multi-frequency sine composition for organic feel
          const y = H / 2 +
            Math.sin(progress * 8 + t * wave.speed * 200 + wave.phase) * H * 0.12 * wave.amp * audioLevel * 2.5 +
            Math.sin(progress * 13 + t * wave.speed * 150 + wave.phase * 1.3) * H * 0.06 * wave.amp * audioLevel * 1.8 +
            Math.sin(progress * 5 + t * wave.speed * 180 + wave.phase * 0.7) * H * 0.08 * wave.amp * audioLevel * 2

          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      })

      t++
    }

    draw()
    return () => cancelAnimationFrame(animRef.current)
  }, [isActive, analyserNode])

  if (!isActive) return null

  return (
    <div style={{
      position: 'absolute', inset: 0, borderRadius: 16,
      background: 'linear-gradient(135deg, rgba(15,15,35,0.97), rgba(25,15,50,0.97))',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      zIndex: 10, overflow: 'hidden',
    }}>
      {/* Waveform canvas */}
      <canvas
        ref={canvasRef}
        width={600}
        height={80}
        style={{ width: '100%', height: 80, display: 'block' }}
      />

      {/* Live transcript */}
      <div style={{
        position: 'absolute', bottom: 12, left: 16, right: 52,
        fontSize: 13, color: 'rgba(148,163,184,0.8)',
        fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        fontFamily: 'var(--font-dm)',
      }}>
        {transcript || 'Listening…'}
      </div>

      {/* Stop button */}
      <button
        onClick={onStop}
        style={{
          position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
          width: 32, height: 32, borderRadius: '50%',
          background: 'rgba(244,128,128,0.2)', border: '1px solid rgba(244,128,128,0.4)',
          color: '#f48080', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        title="Stop recording"
      >
        <svg width="10" height="10" viewBox="0 0 10 10"><rect x="1" y="1" width="8" height="8" rx="1" fill="currentColor"/></svg>
      </button>
    </div>
  )
}
