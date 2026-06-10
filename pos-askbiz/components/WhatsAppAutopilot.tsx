'use client'
import { useState, useEffect } from 'react'

const ACC = '#d08a59'

interface Rule {
  id: string
  trigger: string
  message_template: string
  enabled: boolean
  conditions: Record<string, any>
  fire_count: number
  last_fired_at?: string
}

const TRIGGER_META: Record<string, { label: string; icon: string; description: string }> = {
  low_stock:             { label: 'Low Stock Alert',      icon: '📦', description: 'When inventory drops below threshold' },
  customer_winback:      { label: 'Customer Win-Back',    icon: '👤', description: 'Re-engage inactive high-value customers' },
  post_purchase:         { label: 'Post-Purchase Thanks', icon: '🙏', description: 'Thank customers after purchase' },
  reservation_reminder:  { label: 'Reservation Reminder', icon: '📅', description: 'Remind customers before their booking' },
  shift_summary:         { label: 'Shift Summary',        icon: '📊', description: 'Send shift stats when shift closes' },
  daily_digest:          { label: 'Daily Digest',         icon: '📈', description: 'End-of-day business summary' },
}

export default function WhatsAppAutopilot({ ownerId, staffId }: { ownerId?: string; staffId?: string }) {
  const [rules, setRules] = useState<Rule[]>([])
  const [loading, setLoading] = useState(true)
  const [waConfigured, setWaConfigured] = useState(false)
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    const headers: Record<string, string> = {}
    if (ownerId) headers['x-owner-id'] = ownerId
    if (staffId) headers['x-staff-id'] = staffId
    fetch('/api/pos/whatsapp-autopilot', { headers })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        setRules(data.rules || [])
        setWaConfigured(data.whatsapp_configured || false)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [ownerId, staffId])

  const toggleRule = async (rule: Rule) => {
    if (rule.id.startsWith('default_')) {
      // First save: create all rules then toggle
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (ownerId) headers['x-owner-id'] = ownerId
      if (staffId) headers['x-staff-id'] = staffId
      setSaving(rule.id)
      const toSave = rules.map(r => ({
        ...r,
        enabled: r.id === rule.id ? !r.enabled : r.enabled,
      }))
      const res = await fetch('/api/pos/whatsapp-autopilot', {
        method: 'POST', headers,
        body: JSON.stringify({ rules: toSave }),
      })
      if (res.ok) {
        const data = await res.json()
        setRules(data.rules || [])
      }
      setSaving(null)
      return
    }

    setSaving(rule.id)
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (ownerId) headers['x-owner-id'] = ownerId
    if (staffId) headers['x-staff-id'] = staffId
    const res = await fetch('/api/pos/whatsapp-autopilot', {
      method: 'PATCH', headers,
      body: JSON.stringify({ id: rule.id, enabled: !rule.enabled }),
    })
    if (res.ok) {
      setRules(prev => prev.map(r => r.id === rule.id ? { ...r, enabled: !r.enabled } : r))
    }
    setSaving(null)
  }

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <div style={{ height: 200, borderRadius: 16, background: '#2a2a2a', animation: 'pulse 1.5s infinite' }} />
      </div>
    )
  }

  const enabledCount = rules.filter(r => r.enabled).length

  return (
    <div className="pos-screen" style={{ padding: '16px 20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>WhatsApp Autopilot</div>
          <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
            {enabledCount} active rule{enabledCount !== 1 ? 's' : ''}
            {!waConfigured && <span style={{ color: '#F59E0B', marginLeft: 8 }}>⚠ WhatsApp not configured</span>}
          </div>
        </div>
        <div style={{
          width: 10, height: 10, borderRadius: '50%',
          background: waConfigured ? '#25D366' : '#666',
          boxShadow: waConfigured ? '0 0 8px rgba(37,211,102,.4)' : 'none',
        }} />
      </div>

      {!waConfigured && (
        <div className="pos-banner" style={{
          padding: '10px 14px', borderRadius: 10, marginBottom: 14,
          background: 'rgba(245,158,11,.08)', border: '1px solid rgba(245,158,11,.2)',
          fontSize: 12, color: '#F59E0B',
        }}>
          Configure WhatsApp in Settings → Notifications to enable autopilot messages.
        </div>
      )}

      {/* Rules */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {rules.map((rule, idx) => {
          const meta = TRIGGER_META[rule.trigger] || { label: rule.trigger, icon: '📱', description: '' }
          const isSaving = saving === rule.id
          return (
            <div key={rule.id} className="pos-item" style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 14px', borderRadius: 12,
              background: rule.enabled ? 'rgba(37,211,102,.06)' : '#1e1e1e',
              border: `1px solid ${rule.enabled ? 'rgba(37,211,102,.2)' : '#2a2a2a'}`,
              opacity: isSaving ? 0.6 : 1,
              transition: 'all 200ms',
              animationDelay: `${Math.min(idx, 8) * 40}ms`,
            }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{meta.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 2 }}>{meta.label}</div>
                <div style={{ fontSize: 11, color: '#999', lineHeight: 1.4 }}>{meta.description}</div>
                {rule.fire_count > 0 && (
                  <div style={{ fontSize: 10, color: '#777', marginTop: 2 }}>
                    Sent {rule.fire_count} time{rule.fire_count !== 1 ? 's' : ''}
                    {rule.last_fired_at && ` • Last: ${new Date(rule.last_fired_at).toLocaleDateString('en-GB')}`}
                  </div>
                )}
              </div>
              <button
                onClick={() => toggleRule(rule)}
                disabled={isSaving}
                style={{
                  width: 44, height: 24, borderRadius: 12, border: 'none',
                  background: rule.enabled ? '#25D366' : '#444',
                  cursor: isSaving ? 'not-allowed' : 'pointer', position: 'relative',
                  transition: 'background 200ms',
                  flexShrink: 0,
                  opacity: isSaving ? 0.5 : 1,
                }}
              >
                <div style={{
                  width: 18, height: 18, borderRadius: '50%', background: '#fff',
                  position: 'absolute', top: 3,
                  left: rule.enabled ? 23 : 3,
                  transition: 'left 200ms',
                }} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
