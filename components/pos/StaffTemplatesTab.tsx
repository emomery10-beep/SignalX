'use client'

import { useState } from 'react'
import {
  FACTORY_TEMPLATES,
  RESTAURANT_TEMPLATES,
  StaffTemplate,
  getTemplatesByType,
} from '@/lib/staff-templates'

interface StaffTemplatesTabProps {
  onSelectTemplate?: (template: StaffTemplate) => void
  businessType?: 'factory' | 'restaurant'
}

export default function StaffTemplatesTab({
  onSelectTemplate,
  businessType = 'restaurant',
}: StaffTemplatesTabProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const templates = getTemplatesByType(businessType)

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
          {businessType === 'factory' ? '🏭 Factory' : '🍽️ Restaurant'} Staff
          Role Templates
        </h2>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 24 }}>
          Pre-configured role templates with standard permissions. Use these as
          a starting point when creating staff members.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          {templates.map((template) => (
            <div
              key={template.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: 12,
                padding: 16,
                background: '#fafafa',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.borderColor = '#d08a59'
                ;(e.currentTarget as HTMLElement).style.boxShadow =
                  '0 4px 12px rgba(0,0,0,0.08)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.borderColor = '#ddd'
                ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 24 }}>{template.icon}</span>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>
                    {template.name}
                  </h3>
                  <p
                    style={{
                      fontSize: 12,
                      color: '#666',
                      margin: '4px 0 0 0',
                      lineHeight: 1.4,
                    }}
                  >
                    {template.description}
                  </p>
                </div>
              </div>

              {/* Quick Info */}
              <div
                style={{
                  marginTop: 12,
                  paddingTop: 12,
                  borderTop: '1px solid #e0e0e0',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 12,
                  fontSize: 12,
                }}
              >
                <div>
                  <span style={{ color: '#999', display: 'block' }}>
                    Team Size
                  </span>
                  <span
                    style={{
                      fontWeight: 600,
                      color: '#333',
                      display: 'block',
                      marginTop: 2,
                    }}
                  >
                    {template.suggestedTeamSize}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#999', display: 'block' }}>
                    Permissions
                  </span>
                  <span
                    style={{
                      fontWeight: 600,
                      color: '#333',
                      display: 'block',
                      marginTop: 2,
                    }}
                  >
                    {template.defaultPermissions.length}
                  </span>
                </div>
              </div>

              {/* Permissions List */}
              <div
                style={{
                  marginTop: 12,
                  paddingTop: 12,
                  borderTop: '1px solid #e0e0e0',
                }}
              >
                <span style={{ fontSize: 11, color: '#999', fontWeight: 600 }}>
                  PERMISSIONS
                </span>
                <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {template.defaultPermissions.map((perm) => (
                    <span
                      key={perm}
                      style={{
                        fontSize: 11,
                        background: '#e8e8e8',
                        color: '#555',
                        padding: '2px 8px',
                        borderRadius: 4,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>

              {/* Responsibilities Toggle */}
              <button
                onClick={() =>
                  setExpandedId(expandedId === template.id ? null : template.id)
                }
                style={{
                  marginTop: 12,
                  paddingTop: 12,
                  borderTop: '1px solid #e0e0e0',
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#d08a59',
                  padding: '8px 0',
                  textAlign: 'left',
                }}
              >
                {expandedId === template.id ? '▼' : '▶'} View responsibilities
              </button>

              {/* Expanded Responsibilities */}
              {expandedId === template.id && (
                <div
                  style={{
                    marginTop: 12,
                    paddingTop: 12,
                    borderTop: '1px solid #e0e0e0',
                  }}
                >
                  <span style={{ fontSize: 11, color: '#999', fontWeight: 600 }}>
                    RESPONSIBILITIES
                  </span>
                  <ul
                    style={{
                      fontSize: 12,
                      margin: '6px 0 0 0',
                      paddingLeft: 16,
                      color: '#555',
                    }}
                  >
                    {template.responsibilities.slice(0, 5).map((resp) => (
                      <li key={resp} style={{ marginBottom: 4 }}>
                        {resp}
                      </li>
                    ))}
                    {template.responsibilities.length > 5 && (
                      <li style={{ color: '#999', fontStyle: 'italic' }}>
                        +{template.responsibilities.length - 5} more
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Action Button */}
              {onSelectTemplate && (
                <button
                  onClick={() => onSelectTemplate(template)}
                  style={{
                    marginTop: 12,
                    width: '100%',
                    padding: '8px 12px',
                    background: '#d08a59',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLElement).style.background =
                      '#c07948'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLElement).style.background =
                      '#d08a59'
                  }}
                >
                  Use This Template
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div
        style={{
          marginTop: 32,
          padding: 16,
          background: '#f0f8ff',
          border: '1px solid #b3d9ff',
          borderRadius: 12,
        }}
      >
        <p style={{ fontSize: 13, margin: 0, color: '#0066cc' }}>
          <strong>💡 Tip:</strong> These templates are starting points. You can
          customize permissions for any staff member after creation. New
          permissions or modifications won't affect existing staff.
        </p>
      </div>
    </div>
  )
}
