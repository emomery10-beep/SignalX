'use client'
import { useState, useEffect } from 'react'
import { useLang } from '@/components/LanguageProvider'

// ─── Edit this to control the banner ──────────────────────────────────────────
// type: 'none' hides it. Change id when you update the message so it re-shows.
const STATUS = {
  type:    'none' as 'none' | 'investigating' | 'incident' | 'resolved',
  message: 'We are investigating reports of slow dashboard loads. Your data is safe and unaffected.',
  id:      '2026-05-09-a',
}

const C = {
  investigating: { bg: '#fff8e1', bd: '#f9a825', tx: '#5d3f00', dot: '#f9a825' },
  incident:      { bg: '#ffebee', bd: '#d32f2f', tx: '#7f0000', dot: '#d32f2f' },
  resolved:      { bg: '#e8f5e9', bd: '#388e3c', tx: '#1b5e20', dot: '#388e3c' },
  none:          { bg: '', bd: '', tx: '', dot: '' },
}

export default function StatusBanner() {
  const { tc } = useLang()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (STATUS.type === 'none') return
    if (localStorage.getItem(`sb-${STATUS.id}`) !== '1') setShow(true)
  }, [])

  if (!show) return null
  const s = C[STATUS.type]

  return (
    <div role="alert" style={{
      background: s.bg, borderBottom: `1px solid ${s.bd}`,
      padding: '9px clamp(16px,3vw,24px)', display: 'flex',
      alignItems: 'center', gap: 12, flexWrap: 'wrap',
    }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.dot, flexShrink: 0 }}/>
      <p style={{ flex: 1, margin: 0, fontSize: 11, color: s.tx, fontWeight: 500, lineHeight: 1.4, minWidth: 0 }}>
        {STATUS.message}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
        <a href="/help/topic/troubleshooting"
          style={{ fontSize: 10, color: s.dot, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
          {tc('help_statusbanner.viewUpdates')}
        </a>
        <button
          onClick={() => { localStorage.setItem(`sb-${STATUS.id}`, '1'); setShow(false) }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.tx, fontSize: 18, lineHeight: 1, padding: 0, opacity: 0.5 }}
          aria-label={tc('help_statusbanner.dismiss')}>
          ×
        </button>
      </div>
    </div>
  )
}
