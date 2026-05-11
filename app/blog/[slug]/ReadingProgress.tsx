'use client'
import { useEffect, useState } from 'react'

const ACC = '#d08a59'

export default function ReadingProgress() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    function calc() {
      const el = document.getElementById('article-body')
      if (!el) return
      const top    = el.getBoundingClientRect().top
      const height = el.offsetHeight
      const scrolled = -top
      setPct(Math.min(100, Math.max(0, (scrolled / (height - window.innerHeight + 120)) * 100)))
    }
    window.addEventListener('scroll', calc, { passive: true })
    calc()
    return () => window.removeEventListener('scroll', calc)
  }, [])

  return (
    <div style={{
      position: 'fixed', top: 54, left: 0, right: 0,
      height: 3, zIndex: 49,
      background: 'rgba(0,0,0,0.06)',
      pointerEvents: 'none',
    }}>
      <div style={{
        height: '100%',
        width: `${pct}%`,
        background: ACC,
        transition: 'width 80ms linear',
        borderRadius: '0 2px 2px 0',
      }}/>
    </div>
  )
}
