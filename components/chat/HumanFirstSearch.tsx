'use client'
import { useState, useEffect, useRef } from 'react'
import { useLang } from '@/components/LanguageProvider'

function buildPrompts(tc: (key: string) => string) {
  return {
    noData: [
      tc('chat_humanfirst.noData0'),
      tc('chat_humanfirst.noData1'),
      tc('chat_humanfirst.noData2'),
      tc('chat_humanfirst.noData3'),
      tc('chat_humanfirst.noData4'),
      tc('chat_humanfirst.noData5'),
      tc('chat_humanfirst.noData6'),
      tc('chat_humanfirst.noData7'),
    ],
    dataConnected: [
      tc('chat_humanfirst.dataConnected0'),
      tc('chat_humanfirst.dataConnected1'),
      tc('chat_humanfirst.dataConnected2'),
      tc('chat_humanfirst.dataConnected3'),
      tc('chat_humanfirst.dataConnected4'),
      tc('chat_humanfirst.dataConnected5'),
      tc('chat_humanfirst.dataConnected6'),
      tc('chat_humanfirst.dataConnected7'),
    ],
    marketActive: [
      tc('chat_humanfirst.marketActive0'),
      tc('chat_humanfirst.marketActive1'),
      tc('chat_humanfirst.marketActive2'),
      tc('chat_humanfirst.marketActive3'),
      tc('chat_humanfirst.marketActive4'),
      tc('chat_humanfirst.marketActive5'),
      tc('chat_humanfirst.marketActive6'),
      tc('chat_humanfirst.marketActive7'),
    ],
  }
}

function buildBizPrompts(tc: (key: string) => string): Record<string, string[]> {
  return {
    ecommerce: [
      tc('chat_humanfirst.bizEcommerce0'),
      tc('chat_humanfirst.bizEcommerce1'),
      tc('chat_humanfirst.bizEcommerce2'),
      tc('chat_humanfirst.bizEcommerce3'),
      tc('chat_humanfirst.bizEcommerce4'),
      tc('chat_humanfirst.bizEcommerce5'),
      tc('chat_humanfirst.bizEcommerce6'),
      tc('chat_humanfirst.bizEcommerce7'),
    ],
    retail: [
      tc('chat_humanfirst.bizRetail0'),
      tc('chat_humanfirst.bizRetail1'),
      tc('chat_humanfirst.bizRetail2'),
      tc('chat_humanfirst.bizRetail3'),
      tc('chat_humanfirst.bizRetail4'),
      tc('chat_humanfirst.bizRetail5'),
      tc('chat_humanfirst.bizRetail6'),
      tc('chat_humanfirst.bizRetail7'),
    ],
    distributor: [
      tc('chat_humanfirst.bizDistributor0'),
      tc('chat_humanfirst.bizDistributor1'),
      tc('chat_humanfirst.bizDistributor2'),
      tc('chat_humanfirst.bizDistributor3'),
      tc('chat_humanfirst.bizDistributor4'),
      tc('chat_humanfirst.bizDistributor5'),
      tc('chat_humanfirst.bizDistributor6'),
      tc('chat_humanfirst.bizDistributor7'),
    ],
    manufacturer: [
      tc('chat_humanfirst.bizManufacturer0'),
      tc('chat_humanfirst.bizManufacturer1'),
      tc('chat_humanfirst.bizManufacturer2'),
      tc('chat_humanfirst.bizManufacturer3'),
      tc('chat_humanfirst.bizManufacturer4'),
      tc('chat_humanfirst.bizManufacturer5'),
      tc('chat_humanfirst.bizManufacturer6'),
      tc('chat_humanfirst.bizManufacturer7'),
    ],
    importer: [
      tc('chat_humanfirst.bizImporter0'),
      tc('chat_humanfirst.bizImporter1'),
      tc('chat_humanfirst.bizImporter2'),
      tc('chat_humanfirst.bizImporter3'),
      tc('chat_humanfirst.bizImporter4'),
      tc('chat_humanfirst.bizImporter5'),
      tc('chat_humanfirst.bizImporter6'),
      tc('chat_humanfirst.bizImporter7'),
    ],
    exporter: [
      tc('chat_humanfirst.bizExporter0'),
      tc('chat_humanfirst.bizExporter1'),
      tc('chat_humanfirst.bizExporter2'),
      tc('chat_humanfirst.bizExporter3'),
      tc('chat_humanfirst.bizExporter4'),
      tc('chat_humanfirst.bizExporter5'),
      tc('chat_humanfirst.bizExporter6'),
      tc('chat_humanfirst.bizExporter7'),
    ],
    services: [
      tc('chat_humanfirst.bizServices0'),
      tc('chat_humanfirst.bizServices1'),
      tc('chat_humanfirst.bizServices2'),
      tc('chat_humanfirst.bizServices3'),
      tc('chat_humanfirst.bizServices4'),
      tc('chat_humanfirst.bizServices5'),
      tc('chat_humanfirst.bizServices6'),
      tc('chat_humanfirst.bizServices7'),
    ],
    food_bev: [
      tc('chat_humanfirst.bizFoodBev0'),
      tc('chat_humanfirst.bizFoodBev1'),
      tc('chat_humanfirst.bizFoodBev2'),
      tc('chat_humanfirst.bizFoodBev3'),
      tc('chat_humanfirst.bizFoodBev4'),
      tc('chat_humanfirst.bizFoodBev5'),
      tc('chat_humanfirst.bizFoodBev6'),
      tc('chat_humanfirst.bizFoodBev7'),
    ],
  }
}

export function buildSidebarChips(tc: (key: string) => string): Record<string, { label: string; query: string }[]> {
  return {
    noData: [
      { label: tc('chat_humanfirst.sidebarNoData0Label'), query: tc('chat_humanfirst.sidebarNoData0Query') },
      { label: tc('chat_humanfirst.sidebarNoData1Label'), query: tc('chat_humanfirst.sidebarNoData1Query') },
      { label: tc('chat_humanfirst.sidebarNoData2Label'), query: tc('chat_humanfirst.sidebarNoData2Query') },
    ],
    dataConnected: [
      { label: tc('chat_humanfirst.sidebarDataConnected0Label'), query: tc('chat_humanfirst.sidebarDataConnected0Query') },
      { label: tc('chat_humanfirst.sidebarDataConnected1Label'), query: tc('chat_humanfirst.sidebarDataConnected1Query') },
      { label: tc('chat_humanfirst.sidebarDataConnected2Label'), query: tc('chat_humanfirst.sidebarDataConnected2Query') },
    ],
    marketActive: [
      { label: tc('chat_humanfirst.sidebarMarketActive0Label'), query: tc('chat_humanfirst.sidebarMarketActive0Query') },
      { label: tc('chat_humanfirst.sidebarMarketActive1Label'), query: tc('chat_humanfirst.sidebarMarketActive1Query') },
      { label: tc('chat_humanfirst.sidebarMarketActive2Label'), query: tc('chat_humanfirst.sidebarMarketActive2Query') },
    ],
  }
}

export function buildChipOpeners(tc: (key: string) => string): Record<string, string> {
  return {
    noData: tc('chat_humanfirst.chipOpenerNoData'),
    dataConnected: tc('chat_humanfirst.chipOpenerDataConnected'),
    marketActive: tc('chat_humanfirst.chipOpenerMarketActive'),
  }
}

interface Props {
  userState: 'noData' | 'dataConnected' | 'marketActive'
  onSend: (s: string) => void
  inputValue: string
  onInputChange: (s: string) => void
  onKeyDown: (e: any) => void
  inputRef: React.RefObject<HTMLTextAreaElement>
  isLoading?: boolean
  simulateMode?: boolean
  cfoMode?: boolean
  onVoiceToggle?: () => void
  isRecording?: boolean
  bizType?: string
}

function buildSimulatePrompts(tc: (key: string) => string): string[] {
  return [
    tc('chat_humanfirst.simulate0'),
    tc('chat_humanfirst.simulate1'),
    tc('chat_humanfirst.simulate2'),
    tc('chat_humanfirst.simulate3'),
    tc('chat_humanfirst.simulate4'),
    tc('chat_humanfirst.simulate5'),
  ]
}

function buildCfoPrompts(tc: (key: string) => string): string[] {
  return [
    tc('chat_humanfirst.cfo0'),
    tc('chat_humanfirst.cfo1'),
    tc('chat_humanfirst.cfo2'),
    tc('chat_humanfirst.cfo3'),
    tc('chat_humanfirst.cfo4'),
  ]
}

export default function HumanFirstSearch({
  userState, onSend, inputValue, onInputChange, onKeyDown, inputRef, isLoading, simulateMode, cfoMode, onVoiceToggle, isRecording, bizType,
}: Props) {
  const { tc } = useLang()
  const PROMPTS = buildPrompts(tc)
  const BIZ_PROMPTS = buildBizPrompts(tc)
  const SIMULATE_PROMPTS = buildSimulatePrompts(tc)
  const CFO_PROMPTS = buildCfoPrompts(tc)
  const [placeholderIdx, setPlaceholderIdx] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const typeInterval = useRef<NodeJS.Timeout | null>(null)

  const prompts = simulateMode ? SIMULATE_PROMPTS
    : cfoMode ? CFO_PROMPTS
    : (bizType && BIZ_PROMPTS[bizType]) ? BIZ_PROMPTS[bizType]
    : PROMPTS[userState]

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

  const hasVoice = !!onVoiceToggle

  return (
    <div style={{ width: '100%' }}>
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
          placeholder={inputValue ? '' : displayedText + (displayedText ? '|' : tc('chat_humanfirst.placeholderFallback'))}
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
            padding: hasVoice ? '16px 90px 16px 18px' : '16px 52px 16px 18px',
            boxSizing: 'border-box',
            minHeight: 56,
          }}
        />

        {/* Voice button */}
        {hasVoice && (
          <button
            onClick={onVoiceToggle}
            title={isRecording ? tc('chat_humanfirst.voiceStopTitle') : tc('chat_humanfirst.voiceSpeakTitle')}
            style={{
              position: 'absolute',
              right: 48,
              bottom: 10,
              width: 32,
              height: 32,
              borderRadius: 9,
              border: isRecording ? '1px solid rgba(99,102,241,.4)' : 'none',
              background: isRecording ? 'rgba(99,102,241,.12)' : 'transparent',
              color: isRecording ? '#6366F1' : 'var(--tx3)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 150ms',
              flexShrink: 0,
            }}
          >
            {isRecording ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#6366F1" stroke="none">
                <rect x="6" y="6" width="12" height="12" rx="2"/>
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            )}
          </button>
        )}

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
