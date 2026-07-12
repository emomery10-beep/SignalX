'use client'
import { useState, useEffect, useCallback } from 'react'
import { useLang } from '@/components/LanguageProvider'

// ── Color constants ──────────────────────────────────────────────────────────
const ACC    = '#d08a59'
const RED    = '#dc2626'
const GREEN  = '#16a34a'
const AMBER  = '#ca8a04'
const BLUE   = '#3b82f6'
const PURPLE = '#7c3aed'
const TEAL   = '#0d9488'

// ── Types ────────────────────────────────────────────────────────────────────
type Severity = 'high' | 'medium' | 'low' | 'info'
type EventGroup = 'all' | 'transactions' | 'jobs' | 'captures' | 'inventory' | 'staff' | 'deliveries'

type UnifiedAuditEvent = {
  id:          string
  source:      'audit_log' | 'job_history' | 'parcel_history'
  sector:      string
  event:       string
  title:       string
  detail:      string
  actor:       string | null
  actor_role:  string | null
  from_value:  string | null
  to_value:    string | null
  entity_id:   string | null
  entity_ref:  string | null
  metadata:    Record<string, unknown>
  severity:    Severity
  created_at:  string
}

interface AuditTabProps {
  selectedSector: string
  currencySymbol: string
  onBack: () => void
}

// ── Severity config ──────────────────────────────────────────────────────────
const SEV: Record<Severity, { bg: string; border: string; text: string }> = {
  high:   { bg: 'rgba(220,38,38,.06)',  border: '#ef4444', text: '#dc2626' },
  medium: { bg: 'rgba(245,158,11,.06)', border: '#f59e0b', text: '#ca8a04' },
  low:    { bg: 'transparent',          border: 'var(--b)', text: 'var(--tx3)' },
  info:   { bg: 'rgba(99,102,241,.06)', border: '#6366f1', text: '#6366f1' },
}

// ── Sector icons ─────────────────────────────────────────────────────────────
const SECTOR_ICON: Record<string, string> = {
  retail:     '🛍️',
  repair:     '🔧',
  factory:    '🏭',
  logistics:  '📦',
  salon:      '✂️',
  restaurant: '🍽️',
  all:        '🏪',
}

function sectorIcon(sector: string): string {
  return SECTOR_ICON[sector] ?? SECTOR_ICON.all
}

// ── Sector badge colors ──────────────────────────────────────────────────────
const SECTOR_COLOR: Record<string, string> = {
  retail:     GREEN,
  repair:     PURPLE,
  factory:    TEAL,
  logistics:  BLUE,
  salon:      '#ec4899',
  restaurant: ACC,
  all:        'var(--tx3)',
}

function sectorColor(sector: string): string {
  return SECTOR_COLOR[sector] ?? SECTOR_COLOR.all
}

// ── Event groups visible per sector ─────────────────────────────────────────
const SECTOR_EVENT_GROUPS: Record<string, EventGroup[]> = {
  retail:     ['all', 'transactions', 'inventory', 'staff'],
  repair:     ['all', 'transactions', 'jobs', 'inventory', 'staff'],
  factory:    ['all', 'captures', 'inventory', 'staff'],
  logistics:  ['all', 'deliveries', 'staff'],
  salon:      ['all', 'transactions', 'staff'],
  restaurant: ['all', 'transactions', 'staff'],
  all:        ['all', 'transactions', 'jobs', 'captures', 'inventory', 'staff', 'deliveries'],
}

function buildEventGroupLabels(tc: (k: string) => string): Record<EventGroup, string> {
  return {
    all:          tc('pos_audit.groupAll'),
    transactions: tc('pos_audit.groupTransactions'),
    jobs:         tc('pos_audit.groupJobs'),
    captures:     tc('pos_audit.groupCaptures'),
    inventory:    tc('pos_audit.groupInventory'),
    staff:        tc('pos_audit.groupStaff'),
    deliveries:   tc('pos_audit.groupDeliveries'),
  }
}

function buildEmptyStates(tc: (k: string) => string): Record<string, string> {
  return {
    retail:     tc('pos_audit.emptyRetail'),
    repair:     tc('pos_audit.emptyRepair'),
    factory:    tc('pos_audit.emptyFactory'),
    logistics:  tc('pos_audit.emptyLogistics'),
    salon:      tc('pos_audit.emptySalon'),
    restaurant: tc('pos_audit.emptyRestaurant'),
    all:        tc('pos_audit.emptyAll'),
  }
}

// ── Relative time ─────────────────────────────────────────────────────────────
function relativeTime(isoString: string, tc: (k: string, vars?: Record<string, string | number>) => string): string {
  const date = new Date(isoString)
  const now  = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return tc('pos_audit.timeJustNow')
  if (diffMins < 60) return tc('pos_audit.timeMinAgo', { mins: diffMins })

  const diffHrs = Math.floor(diffMins / 60)
  if (diffHrs < 24) return tc('pos_audit.timeHrAgo', { hrs: diffHrs })

  const isYesterday =
    now.getDate() - date.getDate() === 1 &&
    now.getMonth() === date.getMonth() &&
    now.getFullYear() === date.getFullYear()

  const hhmm = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  if (isYesterday) return tc('pos_audit.timeYesterday', { time: hhmm })

  const ddMon = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
  return `${ddMon} ${hhmm}`
}

// ── Today's date string YYYY-MM-DD ───────────────────────────────────────────
function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

// ── Loading skeleton cells ────────────────────────────────────────────────────
function SkeletonCell() {
  return (
    <div style={{
      padding: '8px 10px',
      borderRadius: 8,
      border: '1px solid var(--b)',
      background: 'var(--sf)',
      borderLeft: '2.5px solid var(--b)',
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      minHeight: 48,
    }}>
      <div style={{ width: 16, height: 16, borderRadius: 4, background: 'var(--b)', animation: 'pulse 1.5s infinite ease-in-out', flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div style={{ width: '45%', height: 8, borderRadius: 6, background: 'var(--b)', animation: 'pulse 1.5s infinite ease-in-out' }} />
        <div style={{ width: '70%', height: 10, borderRadius: 6, background: 'var(--b)', animation: 'pulse 1.5s infinite ease-in-out', opacity: 0.7 }} />
        <div style={{ width: '55%', height: 8, borderRadius: 6, background: 'var(--b)', animation: 'pulse 1.5s infinite ease-in-out', opacity: 0.4 }} />
      </div>
    </div>
  )
}

// ── Pill button ───────────────────────────────────────────────────────────────
function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 13px',
        borderRadius: 9999,
        border: active ? `1.5px solid ${ACC}` : '1px solid var(--b)',
        background: active ? `rgba(208,138,89,.1)` : 'var(--sf)',
        color: active ? ACC : 'var(--tx2)',
        fontSize: 10,
        fontWeight: active ? 700 : 400,
        cursor: 'pointer',
        fontFamily: 'var(--font-sora)',
        whiteSpace: 'nowrap',
        transition: 'all .15s',
      }}
    >
      {label}
    </button>
  )
}

// ── Main component ───────────────────────────────────────────────────────────
export default function AuditTab({ selectedSector, currencySymbol: _currencySymbol, onBack }: AuditTabProps) {
  const { tc } = useLang()
  const [events,     setEvents]     = useState<UnifiedAuditEvent[]>([])
  const [loading,    setLoading]    = useState(true)
  const [page,       setPage]       = useState(0)
  const [total,      setTotal]      = useState(0)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [search,     setSearch]     = useState('')
  const [eventGroup, setEventGroup] = useState<EventGroup>('all')
  const [date,       setDate]       = useState('')  // empty = all-time, no date filter
  const [loadingMore, setLoadingMore] = useState(false)

  const EVENT_GROUP_LABELS = buildEventGroupLabels(tc)
  const EMPTY_STATES = buildEmptyStates(tc)

  const LIMIT = 50

  // Fetch first page / re-fetch when filters change
  const fetchEvents = useCallback(async (resetPage = true) => {
    const targetPage = resetPage ? 0 : page
    if (resetPage) setLoading(true)
    else setLoadingMore(true)

    try {
      const params = new URLSearchParams({
        sector:      selectedSector,
        event_group: eventGroup,
        page:        String(targetPage),
        limit:       String(LIMIT),
      })
      if (date) params.set('date', date)  // omit entirely when empty = all-time
      const res  = await fetch(`/api/pos/audit-unified?${params}`)
      const data = await res.json()

      if (data.events) {
        if (resetPage) {
          setEvents(data.events)
          setPage(0)
        } else {
          setEvents(prev => [...prev, ...data.events])
        }
        setTotal(data.total ?? 0)
      }
    } catch (err) {
      console.error('Failed to fetch audit events:', err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [selectedSector, eventGroup, date, page])

  // Re-fetch on filter changes (reset to page 0)
  useEffect(() => {
    setEventGroup('all')
  }, [selectedSector])

  useEffect(() => {
    fetchEvents(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSector, eventGroup, date])

  // Load more
  const handleLoadMore = async () => {
    const nextPage = page + 1
    setPage(nextPage)

    setLoadingMore(true)
    try {
      const params = new URLSearchParams({
        sector:      selectedSector,
        event_group: eventGroup,
        page:        String(nextPage),
        limit:       String(LIMIT),
      })
      if (date) params.set('date', date)
      const res  = await fetch(`/api/pos/audit-unified?${params}`)
      const data = await res.json()
      if (data.events) {
        setEvents(prev => [...prev, ...data.events])
        setTotal(data.total ?? 0)
      }
    } catch (err) {
      console.error('Failed to load more audit events:', err)
    } finally {
      setLoadingMore(false)
    }
  }

  // Client-side search filter
  const visibleEvents = search.trim()
    ? events.filter(e => {
        const q = search.toLowerCase()
        return (
          e.title.toLowerCase().includes(q) ||
          e.detail.toLowerCase().includes(q) ||
          (e.actor ?? '').toLowerCase().includes(q)
        )
      })
    : events

  const highCount = visibleEvents.filter(e => e.severity === 'high').length

  // Visible event groups for the current sector
  const availableGroups: EventGroup[] = SECTOR_EVENT_GROUPS[selectedSector] ?? SECTOR_EVENT_GROUPS.all

  const emptyMessage = EMPTY_STATES[selectedSector] ?? EMPTY_STATES.all

  // ── Styles ──────────────────────────────────────────────────────────────────
  const cardStyle: React.CSSProperties = {
    borderRadius: 10,
    border: '1px solid var(--b)',
    background: 'var(--sf)',
    overflow: 'hidden',
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <button
          onClick={onBack}
          style={{
            padding: '6px 14px',
            borderRadius: 10,
            border: '1px solid rgba(208,138,89,.2)',
            background: 'transparent',
            color: 'var(--tx)',
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          {tc('pos_audit.backBtn')}
        </button>

        <div style={{ fontFamily: 'var(--font-sora)', fontSize: 16, fontWeight: 700, flex: 1 }}>
          {tc('pos_audit.title')}
        </div>

        {/* Summary chips */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{
            padding: '4px 11px',
            borderRadius: 9999,
            background: 'var(--ev)',
            color: 'var(--tx2)',
            fontSize: 10,
            fontWeight: 600,
            fontFamily: 'var(--font-sora)',
          }}>
            {tc(total !== 1 ? 'pos_audit.eventsCountPlural' : 'pos_audit.eventsCount', { count: total.toLocaleString() })}
          </span>
          {highCount > 0 && (
            <span style={{
              padding: '4px 11px',
              borderRadius: 9999,
              background: 'rgba(220,38,38,.1)',
              color: RED,
              fontSize: 10,
              fontWeight: 700,
              fontFamily: 'var(--font-sora)',
            }}>
              {tc('pos_audit.highSeverityChip', { count: highCount })}
            </span>
          )}
          {/* Re-fetch button */}
          <button
            onClick={() => fetchEvents(true)}
            disabled={loading}
            title={tc('pos_audit.refreshTitle')}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: '1px solid var(--b)',
              background: 'var(--sf)',
              color: 'var(--tx2)',
              fontSize: 13,
              cursor: loading ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: loading ? 0.5 : 1,
              transition: 'opacity .15s',
            }}
          >
            ↻
          </button>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>

        {/* Event group pills */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {availableGroups.map(g => (
            <Pill
              key={g}
              label={EVENT_GROUP_LABELS[g]}
              active={eventGroup === g}
              onClick={() => setEventGroup(g)}
            />
          ))}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Date picker */}
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          {/* All time shortcut */}
          <button
            onClick={() => setDate('')}
            style={{
              padding: '5px 11px',
              borderRadius: 9999,
              border: date === '' ? `1.5px solid ${ACC}` : '1px solid var(--b)',
              background: date === '' ? `rgba(208,138,89,.1)` : 'var(--sf)',
              color: date === '' ? ACC : 'var(--tx2)',
              fontSize: 10,
              fontWeight: date === '' ? 700 : 400,
              cursor: 'pointer',
              fontFamily: 'var(--font-sora)',
            }}
          >
            {tc('pos_audit.dateAllTime')}
          </button>
          {/* Today shortcut */}
          <button
            onClick={() => setDate(todayStr())}
            style={{
              padding: '5px 11px',
              borderRadius: 9999,
              border: date === todayStr() ? `1.5px solid ${ACC}` : '1px solid var(--b)',
              background: date === todayStr() ? `rgba(208,138,89,.1)` : 'var(--sf)',
              color: date === todayStr() ? ACC : 'var(--tx2)',
              fontSize: 10,
              fontWeight: date === todayStr() ? 700 : 400,
              cursor: 'pointer',
              fontFamily: 'var(--font-sora)',
            }}
          >
            {tc('pos_audit.dateToday')}
          </button>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{
              padding: '5px 11px',
              borderRadius: 9999,
              border: date && date !== todayStr() ? `1.5px solid ${ACC}` : '1px solid var(--b)',
              background: 'var(--sf)',
              color: 'var(--tx)',
              fontSize: 10,
              fontFamily: 'inherit',
              cursor: 'pointer',
              outline: 'none',
            }}
          />
        </div>

        {/* Search box */}
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={tc('pos_audit.searchPlaceholder')}
          style={{
            padding: '6px 14px',
            borderRadius: 9999,
            border: '1px solid var(--b)',
            background: 'var(--sf)',
            color: 'var(--tx)',
            fontSize: 10,
            fontFamily: 'inherit',
            outline: 'none',
            width: 200,
          }}
        />
      </div>

      {/* ── Event timeline ── */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 8 }}>
          {Array.from({ length: 9 }).map((_, i) => <SkeletonCell key={i} />)}
        </div>
      ) : visibleEvents.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '52px 24px',
          color: 'var(--tx3)',
          ...cardStyle,
        }}>
          <div style={{ fontSize: 38, marginBottom: 12 }}>
            {sectorIcon(selectedSector)}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)', marginBottom: 8, fontFamily: 'var(--font-sora)' }}>
            {tc('pos_audit.emptyTitle')}
          </div>
          <div style={{ fontSize: 11, maxWidth: 340, margin: '0 auto', lineHeight: 1.6 }}>
            {search.trim() ? tc('pos_audit.emptySearchMessage', { search }) : emptyMessage}
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 8 }}>
          {visibleEvents.map(event => {
            const sev  = SEV[event.severity]
            const expanded = expandedId === event.id
            const metaEntries = Object.entries(event.metadata ?? {}).filter(([, v]) => v !== null && v !== undefined && v !== '')
            const sc = sectorColor(event.sector)
            const dotColor = event.severity === 'high' ? RED : event.severity === 'medium' ? AMBER : 'var(--tx3)'
            const border = sev.border !== 'var(--b)' ? sev.border : 'var(--b)'
            const bg = sev.bg !== 'transparent' ? sev.bg : 'var(--sf)'
            const hasExtra = !!(event.actor || event.entity_ref || event.from_value || event.to_value || metaEntries.length > 0)

            return (
              <div
                key={event.id}
                onClick={() => setExpandedId(expanded ? null : event.id)}
                style={{
                  gridColumn: expanded ? '1 / -1' : undefined,
                  borderRadius: 8,
                  border: `1px solid ${border}`,
                  borderLeft: `2.5px solid ${border}`,
                  background: bg,
                  cursor: 'pointer',
                  transition: 'background .12s, border-color .12s',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.background = 'var(--ev)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.background = bg
                }}
              >
                {/* Compact row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', minHeight: 48 }}>

                  {/* Sector icon */}
                  <span style={{ fontSize: 12, lineHeight: 1, flexShrink: 0 }}>
                    {sectorIcon(event.sector)}
                  </span>

                  {/* Main content */}
                  <div style={{ flex: 1, minWidth: 0 }}>

                    {/* Event type + severity dot */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 1 }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
                      <span style={{
                        fontSize: 9,
                        fontWeight: 700,
                        color: sc,
                        textTransform: 'uppercase',
                        letterSpacing: '.3px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontFamily: 'var(--font-sora)',
                      }}>
                        {event.event.replace(/_/g, ' ')}
                      </span>
                    </div>

                    {/* Title */}
                    <div style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: 'var(--tx)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {event.title}
                    </div>

                    {/* Detail (truncated to one line) */}
                    {event.detail && (
                      <div style={{
                        fontSize: 9.5,
                        color: 'var(--tx3)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {event.detail}
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <span style={{
                    fontSize: 9,
                    color: 'var(--tx3)',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                  }}>
                    {relativeTime(event.created_at, tc)}
                  </span>
                </div>

                {/* ── Expanded detail ── */}
                {expanded && hasExtra && (
                  <div style={{
                    borderTop: '1px solid var(--b)',
                    padding: '10px 14px 12px',
                    background: 'rgba(0,0,0,.015)',
                  }}>
                    {/* Chips row */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginBottom: metaEntries.length > 0 ? 10 : 0 }}>
                      {event.actor && (
                        <span style={{ fontSize: 9, color: 'var(--tx2)', background: 'var(--ev)', padding: '2px 8px', borderRadius: 9999 }}>
                          {event.actor_role
                            ? tc('pos_audit.actorWithRole', { actor: event.actor, role: event.actor_role })
                            : tc('pos_audit.actorPrefix', { actor: event.actor })}
                        </span>
                      )}
                      {event.entity_ref && (
                        <span style={{ fontSize: 9, color: sc, background: `${sc}12`, padding: '2px 8px', borderRadius: 9999, fontWeight: 600, fontFamily: 'var(--font-sora)' }}>
                          #{event.entity_ref}
                        </span>
                      )}
                      {(event.from_value || event.to_value) && (
                        <span style={{ fontSize: 9, color: 'var(--tx3)', background: 'var(--ev)', padding: '2px 8px', borderRadius: 9999 }}>
                          {event.from_value && <span style={{ textDecoration: 'line-through', marginRight: 4 }}>{event.from_value}</span>}
                          {event.to_value && <span style={{ color: 'var(--tx2)' }}>{event.to_value}</span>}
                        </span>
                      )}
                    </div>

                    {/* Metadata grid */}
                    {metaEntries.length > 0 && (
                      <>
                        <div style={{
                          fontSize: 9,
                          fontWeight: 700,
                          color: 'var(--tx3)',
                          marginBottom: 8,
                          fontFamily: 'var(--font-sora)',
                          textTransform: 'uppercase',
                          letterSpacing: '.4px',
                        }}>
                          {tc('pos_audit.metadataHeading')}
                        </div>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                          gap: '6px 16px',
                        }}>
                          {metaEntries.map(([key, value]) => (
                            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'capitalize' }}>
                                {key.replace(/_/g, ' ')}
                              </span>
                              <span style={{ fontSize: 10, color: 'var(--tx)', wordBreak: 'break-word' }}>
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── Pagination ── */}
      {!loading && visibleEvents.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between', paddingTop: 4 }}>
          <span style={{ fontSize: 10, color: 'var(--tx3)' }}>
            {tc('pos_audit.showingCount', { shown: visibleEvents.length.toLocaleString(), total: total.toLocaleString() })}
          </span>
          {visibleEvents.length < total && (
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              style={{
                padding: '8px 20px',
                borderRadius: 10,
                border: '1px solid var(--b)',
                background: 'var(--sf)',
                color: 'var(--tx)',
                fontSize: 11,
                fontWeight: 600,
                cursor: loadingMore ? 'default' : 'pointer',
                fontFamily: 'inherit',
                opacity: loadingMore ? 0.6 : 1,
                transition: 'opacity .15s',
              }}
            >
              {loadingMore ? tc('pos_audit.loadingMore') : tc('pos_audit.loadMore')}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
