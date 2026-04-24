'use client'
import { useState, useEffect, useRef } from 'react'

const PROMPTS = {
  noData: [
    "Show me how a 10% price rise would look.",
    "What's a 'good' profit for a shop like mine?",
    "Which of my products would sell best in Dubai?",
    "Show me how to save £500 a month on shipping.",
    "What should my profit margin actually be?",
    "How do I know if my prices are too low?",
    "What does a healthy cash flow look like?",
    "How much stock should I be holding?",
  ],
  dataConnected: [
    "What should I restock today?",
    "Which products are just sitting on the shelf?",
    "How much did I actually make after fees?",
    "Who are my top 10 customers this month?",
    "Which product is making me the most money?",
    "Where am I losing money without knowing it?",
    "What's my busiest day of the week?",
    "Which items should I stop selling?",
  ],
  marketActive: [
    "Are people buying more of this lately?",
    "What are the new tax rules for selling to the EU?",
    "Is my pricing cheaper or more expensive than competitors?",
    "What's the hot product in my niche right now?",
    "What are my competitors charging for this?",
    "Is there a trend I should be jumping on?",
    "What's happening with shipping costs right now?",
    "Which market should I expand into next?",
  ],
}

export const SIDEBAR_CHIPS: Record<string, { label: string; query: string }[]> = {
  noData: [
    { label: "Show me how a 10% price rise would look.", query: "Show me how a 10% price rise would look on my profit." },
    { label: "What's a 'good' profit for a shop like mine?", query: "What's a good profit margin for a shop like mine?" },
    { label: "Show me how to save £500 a month on shipping.", query: "Show me how to save £500 a month on shipping costs." },
  ],
  dataConnected: [
    { label: "What should I restock today?", query: "What should I restock today based on my sales?" },
    { label: "How much did I actually make after fees?", query: "How much did I actually make after all fees this month?" },
    { label: "Which products are just sitting on the shelf?", query: "Which products are just sitting on the shelf?" },
  ],
  marketActive: [
    { label: "What's the hot product in my niche right now?", query: "What's the hot product in my niche right now?" },
    { label: "Is my pricing cheaper than my competitors?", query: "Is my pricing cheaper or more expensive than my competitors?" },
    { label: "What are the new tax rules for the EU?", query: "What are the new tax rules for selling to the EU in 2026?" },
  ],
}

export const CHIP_OPENERS: Record<string, string> = {
  noData: "Since your data isn't connected yet, here's a sample of how I can help — with your real numbers, this gets even sharper. ",
  dataConnected: "Great question! Let's look at your numbers — ",
  marketActive: "I'm pulling live market data on this right now — ",
}

interface Props {
  userState: 'noData' | 'dataConnected' | 'marketActive'
  onSend: (text: string) => void
  inputValue: string
  onInputChange: (val: string) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  inputRef: React.RefObject<HTMLTextAreaElement>
  isLoading?: boolean
  simulateMode?: boolean
  cfoMode?: boolean
}

const SIMULATE_PROMPTS = [
  "What if I raised all my prices by 10%?",
  "What if my supplier cost went up 20%?",
  "What if I entered the German market?",
  "What if I stopped selling my 3 worst products?",
  "What if I offered free shipping on orders over £50?",
  "What if I doubled my marketing spend?",
]

const CFO_PROMPTS = [
  "Provide a gross margin analysis by product line.",
  "What is our current cash conversion cycle?",
  "Analyse EBITDA trend over the last 6 months.",
  "Which customer segments have the highest LTV?",
  "What is our current working capital position?",
]

export default function HumanFirstSearch({
  userState, onSend, inputValue, onInputChange, onKeyDown, inputRef, isLoading, simulateMode, cfoMode,
}: Props) {
  const [placeholderIdx, setPlaceholderIdx] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const typeInterval = useRef<NodeJS.Timeout | null>(null)

  const prompts = simulateMode ? SIMULATE_PROMPTS : cfoMode ? CFO_PROMPTS : PROMPTS[userState]

  useEffect(() => {
    if (inputValue) return
    const full = prompts[placeholderIdx]
    let charIdx = displayedText.length

    const tick = () => {
      if (!isDeleting) {
        if (charIdx < full.length) {
          setDisplayedText(full.slice(0, charIdx + 1))
          charIdx++
          typeInterval.current = setTimeout(tick, 38)
        } else {
          typeInterval.current = setTimeout(() => setIsDeleting(true), 2800)
        }
      } else {
        if (charIdx > 0) {
          setDisplayedText(full.slice(0, charIdx - 1))
          charIdx--
          typeInterval.current = setTimeout(tick, 16)
        } else {
          setIsDeleting(false)
          setPlaceholderIdx(i => (i + 1) % prompts.length)
        }
      }
    }

    typeInterval.current = setTimeout(tick, isDeleting ? 16 : 100)
    return () => { if (typeInterval.current) clearTimeout(typeInterval.current) }
  }, [placeholderIdx, isDeleting, inputValue, prompts])

  useEffect(() => {
    setPlaceholderIdx(0)
    setDisplayedText('')
    setIsDeleting(false)
  }, [userState])

  return (
    <div style={{ width: '100%' }}>
      {/* ── COMMAND BAR ── */}
      <div style={{
        position: 'relative',
        borderRadius: 12,
        border: '1px solid var(--b2)',
        background: 'var(--sf)',
        transition: 'border-color 180ms, box-shadow 180ms',
      }}
        onFocusCapture={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = '#6366F1'
          el.style.boxShadow = '0 0 0 3px rgba(99,102,241,.1)'
        }}
        onBlurCapture={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = 'var(--b2)'
          el.style.boxShadow = 'none'
        }}
      >
        <textarea
          ref={inputRef}
          value={inputValue}
          onChange={e => {
            onInputChange(e.target.value)
            const ta = e.target
            ta.style.height = 'auto'
            ta.style.height = Math.min(ta.scrollHeight, 120) + 'px'
          }}
          onKeyDown={onKeyDown}
          placeholder={inputValue ? '' : displayedText + (displayedText ? '|' : 'Ask anything about your business…')}
          rows={1}
          disabled={isLoading}
          style={{
            width: '100%',
            resize: 'none',
            border: 'none',
            background: 'transparent',
            outline: 'none',
            fontFamily: 'var(--font-dm, DM Sans, sans-serif)',
            fontSize: 14,
            color: 'var(--tx)',
            lineHeight: 1.6,
            padding: '16px 52px 16px 18px',
            boxSizing: 'border-box',
            minHeight: 56,
          }}
        />

        {/* Send button */}
        <button
          onClick={() => onSend(inputValue)}
          disabled={!inputValue.trim() || !!isLoading}
          style={{
            position: 'absolute',
            right: 10,
            bottom: 10,
            width: 32,
            height: 32,
            borderRadius: 9,
            border: 'none',
            background: inputValue.trim() && !isLoading ? '#6366F1' : 'var(--b)',
            color: inputValue.trim() && !isLoading ? '#fff' : 'var(--tx3)',
            cursor: inputValue.trim() && !isLoading ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 150ms',
            flexShrink: 0,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
