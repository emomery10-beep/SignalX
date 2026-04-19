'use client'
import { useState, useRef } from 'react'

interface Props {
  question: string
  answer: string
  kpiCards?: { label: string; value: string }[]
  bizType?: string
}

export default function ShareableInsight({ question, answer, kpiCards, bizType }: Props) {
  const [generating, setGenerating] = useState(false)
  const [done, setDone] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generate = async () => {
    setGenerating(true)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 1080x1080 square for Instagram/LinkedIn
    canvas.width = 1080
    canvas.height = 1080

    // Background
    const bg = ctx.createLinearGradient(0, 0, 1080, 1080)
    bg.addColorStop(0, '#f9f8f6')
    bg.addColorStop(1, '#f3f0eb')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, 1080, 1080)

    // Top accent bar
    const accent = ctx.createLinearGradient(0, 0, 1080, 0)
    accent.addColorStop(0, '#d08a59')
    accent.addColorStop(1, '#8c6fe0')
    ctx.fillStyle = accent
    ctx.fillRect(0, 0, 1080, 8)

    // AskBiz logo area
    ctx.fillStyle = '#1a1916'
    ctx.font = 'bold 32px system-ui, sans-serif'
    ctx.fillText('AskBiz', 64, 80)
    ctx.fillStyle = '#a39e97'
    ctx.font = '22px system-ui, sans-serif'
    ctx.fillText('Business Intelligence', 64, 112)

    // Divider
    ctx.strokeStyle = '#e8e6e1'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(64, 136)
    ctx.lineTo(1016, 136)
    ctx.stroke()

    // Question label
    ctx.fillStyle = '#d08a59'
    ctx.font = 'bold 20px system-ui, sans-serif'
    ctx.fillText('QUESTION', 64, 188)

    // Question text
    ctx.fillStyle = '#6b6760'
    ctx.font = '28px system-ui, sans-serif'
    const qWords = question.split(' ')
    let qLine = '', qY = 226
    for (const word of qWords) {
      const test = qLine + word + ' '
      if (ctx.measureText(test).width > 952 && qLine) {
        ctx.fillText(qLine.trim(), 64, qY)
        qLine = word + ' '
        qY += 40
      } else { qLine = test }
    }
    if (qLine) { ctx.fillText(qLine.trim(), 64, qY); qY += 40 }

    // Answer section
    qY += 24
    ctx.fillStyle = '#d08a59'
    ctx.font = 'bold 20px system-ui, sans-serif'
    ctx.fillText('ANSWER', 64, qY)
    qY += 38

    // Answer box
    ctx.fillStyle = '#ffffff'
    roundRect(ctx, 64, qY - 10, 952, Math.min(280, 50 + Math.ceil(answer.length / 60) * 36), 16)
    ctx.fill()

    ctx.fillStyle = '#1a1916'
    ctx.font = '26px system-ui, sans-serif'
    const aWords = answer.split(' ')
    let aLine = '', aY = qY + 30
    for (const word of aWords) {
      const test = aLine + word + ' '
      if (ctx.measureText(test).width > 900 && aLine) {
        ctx.fillText(aLine.trim(), 88, aY)
        aLine = word + ' '
        aY += 38
        if (aY > qY + 280) break
      } else { aLine = test }
    }
    if (aLine && aY <= qY + 280) ctx.fillText(aLine.trim(), 88, aY)

    // KPI cards if present
    if (kpiCards && kpiCards.length > 0) {
      const cardY = 820
      const cardW = Math.min(220, (952 - (kpiCards.length - 1) * 16) / kpiCards.length)
      kpiCards.slice(0, 4).forEach((card, i) => {
        const cardX = 64 + i * (cardW + 16)
        ctx.fillStyle = 'rgba(208,138,89,0.08)'
        roundRect(ctx, cardX, cardY, cardW, 120, 12)
        ctx.fill()
        ctx.fillStyle = '#a39e97'
        ctx.font = 'bold 16px system-ui, sans-serif'
        ctx.fillText(card.label.toUpperCase(), cardX + 16, cardY + 36)
        ctx.fillStyle = '#1a1916'
        ctx.font = 'bold 28px system-ui, sans-serif'
        ctx.fillText(card.value, cardX + 16, cardY + 78)
      })
    }

    // Footer
    ctx.fillStyle = '#a39e97'
    ctx.font = '20px system-ui, sans-serif'
    ctx.fillText('askbiz.co — Ask your business data anything', 64, 1036)

    // Download
    const link = document.createElement('a')
    link.download = 'askbiz-insight.png'
    link.href = canvas.toDataURL('image/png')
    link.click()

    setGenerating(false)
    setDone(true)
    setTimeout(() => setDone(false), 3000)
  }

  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
  }

  return (
    <>
      <canvas ref={canvasRef} style={{ display: 'none' }}/>
      <button
        onClick={generate}
        disabled={generating}
        title="Download this insight as a shareable image"
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '5px 12px', borderRadius: 9999,
          border: '1px solid var(--b2)', background: 'transparent',
          color: 'var(--tx3)', fontSize: 12, fontWeight: 500,
          cursor: generating ? 'wait' : 'pointer', fontFamily: 'inherit',
          transition: 'all 150ms',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--ev)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--tx)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--tx3)' }}
      >
        {done ? (
          <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg> Downloaded</>
        ) : generating ? (
          <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{animation:'spin 1s linear infinite'}}><path d="M21 12a9 9 0 11-6.219-8.56"/></svg> Generating…</>
        ) : (
          <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg> Share insight</>
        )}
      </button>
    </>
  )
}
