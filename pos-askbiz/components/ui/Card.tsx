'use client'
import { ReactNode, CSSProperties } from 'react'
import { tokens, radius } from './tokens'

// Static container — no entrance animation, since cards usually mount with
// the page (.pos-screen on the page root already handles that fade-in).
export function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{
      background: tokens.surface,
      border: `1px solid ${tokens.border}`,
      borderRadius: radius.lg,
      padding: 20,
      ...style,
    }}>
      {children}
    </div>
  )
}

// For list rows that appear one at a time (search results, newly-added
// items) — staggers via animationDelay the same way repair/intake already
// does for its photo thumbnails, just promoted into a shared component.
export function ListItem({ children, index = 0, style }: { children: ReactNode; index?: number; style?: CSSProperties }) {
  return (
    <div
      className="pos-item"
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms`, ...style }}
    >
      {children}
    </div>
  )
}
