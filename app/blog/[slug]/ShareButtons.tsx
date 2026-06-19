'use client'
import { useState } from 'react'
import { withUtm } from '@/lib/utm'

const ACC = '#d08a59'
const TX3 = '#a39e97'
const SF  = '#ffffff'
const BD  = '#e8e6e1'

interface ShareButtonsProps {
  url: string
  title: string
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  // UTM-tag the shared URL per channel so return visits aren't "(unlabeled)" in GA4
  const twitterShare  = withUtm(url, 'twitter', 'social', 'blog_share')
  const linkedinShare = withUtm(url, 'linkedin', 'social', 'blog_share')
  const copyShare     = withUtm(url, 'share', 'referral', 'blog_share') // pasted into WhatsApp/DMs/email

  const twitterUrl  = `https://twitter.com/intent/tweet?url=${encodeURIComponent(twitterShare)}&text=${encodeURIComponent(title)}`
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(linkedinShare)}`

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(copyShare)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback for older browsers
      const el = document.createElement('textarea')
      el.value = copyShare
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const btnBase: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '6px 12px', borderRadius: 8,
    fontSize: 12, fontWeight: 600,
    textDecoration: 'none', cursor: 'pointer',
    border: `1px solid ${BD}`, background: SF,
    transition: 'background 120ms, border-color 120ms',
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <span style={{ fontSize: 12, color: TX3, fontWeight: 600, marginRight: 2 }}>Share:</span>

      {/* X / Twitter */}
      <a href={twitterUrl} target="_blank" rel="noopener noreferrer" style={{ ...btnBase, color: '#0f1419' }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        Post
      </a>

      {/* LinkedIn */}
      <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ ...btnBase, color: '#0a66c2' }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
          <circle cx="4" cy="4" r="2"/>
        </svg>
        Share
      </a>

      {/* Copy link */}
      <button
        onClick={copyLink}
        style={{ ...btnBase, color: copied ? '#16a34a' : TX3, borderColor: copied ? 'rgba(34,197,94,.3)' : BD }}
      >
        {copied ? (
          <>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Copied!
          </>
        ) : (
          <>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
            Copy link
          </>
        )}
      </button>
    </div>
  )
}
