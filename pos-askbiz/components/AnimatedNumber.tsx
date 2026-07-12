'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'

/**
 * AnimatedNumber — subtle "count-up" for metric numbers.
 *
 * Takes a display string like "KSh 536,000", "34.2%", "143", "1.8K" and rolls
 * the numeric part up from 0 (or from its previous value) to the target, while
 * preserving the prefix/suffix and formatting. Motion carries meaning here —
 * money climbing — for low-literacy users who read the movement, not the label.
 *
 * - Auto-plays when it scrolls into view (IntersectionObserver).
 * - Tap/click to replay (nice on touch phones where there's no hover).
 * - Respects prefers-reduced-motion: snaps straight to the final value.
 * - Dependency-free, GPU-cheap (no layout animation), tabular figures so the
 *   width never jitters while digits change.
 */

type Props = {
  value: string | number
  /** count-up duration in ms (data-reveal, so longer than a micro-interaction is fine) */
  duration?: number
  /** ms to wait after entering view before counting — used to stagger a spotlight tour */
  delay?: number
  /** allow tap/click to replay the count-up */
  tapToReplay?: boolean
  className?: string
  style?: React.CSSProperties
}

type Parsed = {
  prefix: string
  suffix: string
  target: number
  decimals: number
  hasGroup: boolean
}

// Isomorphic layout effect — avoids the SSR warning while still running before paint on the client.
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

function parseValue(raw: string): Parsed | null {
  const str = String(raw)
  // First run that looks like a number, optionally with grouping commas and a decimal part.
  const m = str.match(/-?\d[\d,]*(\.\d+)?/)
  if (!m || m.index == null) return null
  const numeric = m[0]
  const prefix = str.slice(0, m.index)
  const suffix = str.slice(m.index + numeric.length)
  const hasGroup = numeric.includes(',')
  const cleaned = numeric.replace(/,/g, '')
  const dot = cleaned.indexOf('.')
  const decimals = dot >= 0 ? cleaned.length - dot - 1 : 0
  const target = parseFloat(cleaned)
  if (!isFinite(target)) return null
  return { prefix, suffix, target, decimals, hasGroup }
}

function format(n: number, p: Parsed): string {
  const body = n.toLocaleString('en-US', {
    minimumFractionDigits: p.decimals,
    maximumFractionDigits: p.decimals,
    useGrouping: p.hasGroup,
  })
  return p.prefix + body + p.suffix
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function AnimatedNumber({
  value,
  duration = 1100,
  delay = 0,
  tapToReplay = true,
  className,
  style,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const parsed = parseValue(String(value))
  const finalText = String(value)

  // Server render + first client paint show the real value (no hydration mismatch).
  const [display, setDisplay] = useState<string>(finalText)

  const rafRef = useRef<number | null>(null)
  const fromRef = useRef<number>(0) // where the next count-up starts (0 on entrance, prev value on update)

  const stop = () => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }

  const run = (from: number) => {
    if (!parsed) {
      setDisplay(finalText)
      return
    }
    stop()
    if (prefersReducedMotion()) {
      setDisplay(finalText)
      fromRef.current = parsed.target
      return
    }
    const start = performance.now()
    const delta = parsed.target - from
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3) // ease-out cubic — fast then settles
      const current = from + delta * eased
      setDisplay(format(current, parsed))
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setDisplay(finalText)
        rafRef.current = null
        fromRef.current = parsed.target
      }
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  // Before first paint on the client: prime to the zero-state and arm the observer so
  // the number counts up when it enters the viewport (or immediately if already visible).
  useIsoLayoutEffect(() => {
    const el = ref.current
    if (!parsed || !el) return
    if (prefersReducedMotion()) {
      setDisplay(finalText)
      return
    }

    setDisplay(format(0, parsed))
    fromRef.current = 0

    if (typeof IntersectionObserver === 'undefined') {
      window.setTimeout(() => run(0), delay)
      return
    }

    let played = false
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !played) {
            played = true
            window.setTimeout(() => run(0), delay)
            observer.disconnect()
          }
        }
      },
      { threshold: 0.35 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      stop()
    }
    // Re-arm whenever the target changes (e.g. live data update).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsed?.target, parsed?.decimals, parsed?.prefix, parsed?.suffix])

  const replay = () => {
    if (!tapToReplay || !parsed) return
    run(0)
  }

  return (
    <span
      ref={ref}
      className={className}
      onClick={replay}
      style={{
        fontVariantNumeric: 'tabular-nums',
        touchAction: 'manipulation',
        cursor: tapToReplay ? 'pointer' : undefined,
        ...style,
      }}
      aria-label={finalText}
    >
      {display}
    </span>
  )
}
