'use client'

import { useState } from 'react'
import {
  FACTORY_TEMPLATES,
  RESTAURANT_TEMPLATES,
  StaffTemplate,
  StaffTemplateType,
  QUICK_START_RECOMMENDATIONS,
  getTemplatesByType,
} from '@/lib/staff-templates'

interface StaffTemplateSelectorProps {
  type: StaffTemplateType
  onSelect: (templateIds: string[]) => void
  onQuickStart?: (templateIds: string[]) => void
  businessSize?: 'small' | 'medium' | 'large'
  maxSelectable?: number
}

export function StaffTemplateSelector({
  type,
  onSelect,
  onQuickStart,
  businessSize = 'medium',
  maxSelectable,
}: StaffTemplateSelectorProps) {
  const [selectedTemplates, setSelectedTemplates] = useState<Set<string>>(
    new Set()
  )
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const templates = getTemplatesByType(type)
  const recommendedIds = QUICK_START_RECOMMENDATIONS[
    `${type}_${businessSize}` as keyof typeof QUICK_START_RECOMMENDATIONS
  ] as string[]

  const handleToggleTemplate = (templateId: string) => {
    if (maxSelectable && selectedTemplates.size >= maxSelectable) {
      if (!selectedTemplates.has(templateId)) {
        return
      }
    }

    const newSelected = new Set(selectedTemplates)
    if (newSelected.has(templateId)) {
      newSelected.delete(templateId)
    } else {
      newSelected.add(templateId)
    }
    setSelectedTemplates(newSelected)
  }

  const handleQuickStart = () => {
    const newSelected = new Set(recommendedIds)
    setSelectedTemplates(newSelected)
    if (onQuickStart) {
      onQuickStart(recommendedIds)
    } else {
      onSelect(recommendedIds)
    }
  }

  const handleConfirm = () => {
    const selectedArray = Array.from(selectedTemplates)
    onSelect(selectedArray)
  }

  const isFullySelected = (template: StaffTemplate) => {
    return selectedTemplates.has(template.id)
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">
          Set Up Your {type === 'factory' ? 'Factory' : 'Restaurant'} Team
        </h2>
        <p className="text-gray-400">
          Select or customize staff roles for your team. Each role includes
          pre-configured permissions and responsibilities.
        </p>
      </div>

      {/* Quick Start Recommendation */}
      {recommendedIds.length > 0 && (
        <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
          <div className="mb-3 flex items-start gap-3">
            <span className="text-lg">💡</span>
            <div>
              <h3 className="font-semibold text-white">
                Recommended for {businessSize} teams
              </h3>
              <p className="mt-1 text-sm text-gray-300">
                We recommend these {recommendedIds.length} roles to get started:
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {recommendedIds.map((id) => {
                  const template = templates.find((t) => t.id === id)
                  return (
                    <span
                      key={id}
                      className="rounded bg-blue-500/20 px-2 py-1 text-xs text-blue-200"
                    >
                      {template?.name}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
          <button
            onClick={handleQuickStart}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Use Recommended Roles
          </button>
        </div>
      )}

      {/* Templates Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
          All Available Roles
        </h3>

        <div className="grid gap-3 sm:grid-cols-2">
          {templates.map((template) => {
            const isSelected = isFullySelected(template)
            const isRecommended = recommendedIds.includes(template.id)

            return (
              <div
                key={template.id}
                onClick={() => handleToggleTemplate(template.id)}
                className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                }`}
              >
                {/* Recommended Badge */}
                {isRecommended && (
                  <div className="absolute right-3 top-3 rounded bg-green-500/20 px-2 py-1 text-xs font-semibold text-green-300">
                    ⭐ Recommended
                  </div>
                )}

                {/* Selection Checkbox */}
                <div className="absolute left-3 top-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleTemplate(template.id)}
                    className="h-5 w-5 cursor-pointer rounded"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                {/* Content */}
                <div className="mt-8 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-2xl">{template.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">
                        {template.name}
                      </h4>
                      <p className="text-xs text-gray-400">
                        {template.description}
                      </p>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="space-y-1 border-t border-gray-700 pt-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Team Size:</span>
                      <span className="text-gray-300">
                        {template.suggestedTeamSize}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Permissions:</span>
                      <span className="text-gray-300">
                        {template.defaultPermissions.length}
                      </span>
                    </div>
                  </div>

                  {/* Expand/Collapse Responsibilities */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setExpandedId(
                        expandedId === template.id ? null : template.id
                      )
                    }}
                    className="mt-2 flex w-full items-center justify-between rounded px-2 py-1 text-xs font-medium text-blue-400 hover:bg-blue-500/10"
                  >
                    <span>View Responsibilities</span>
                    <span>{expandedId === template.id ? '▼' : '▶'}</span>
                  </button>

                  {/* Expanded Details */}
                  {expandedId === template.id && (
                    <div className="space-y-2 border-t border-gray-700 pt-3">
                      <div>
                        <p className="mb-1 text-xs font-semibold uppercase text-gray-400">
                          Responsibilities
                        </p>
                        <ul className="space-y-1">
                          {template.responsibilities.slice(0, 5).map((resp) => (
                            <li
                              key={resp}
                              className="text-xs text-gray-300 leading-snug"
                            >
                              • {resp}
                            </li>
                          ))}
                          {template.responsibilities.length > 5 && (
                            <li className="text-xs text-gray-400">
                              + {template.responsibilities.length - 5} more
                            </li>
                          )}
                        </ul>
                      </div>

                      <div>
                        <p className="mb-1 text-xs font-semibold uppercase text-gray-400">
                          Permissions
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {template.defaultPermissions.map((perm) => (
                            <span
                              key={perm}
                              className="rounded bg-gray-700/50 px-2 py-0.5 text-xs text-gray-300"
                            >
                              {perm}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Summary & Confirm */}
      <div className="space-y-3 rounded-lg border border-gray-700 bg-gray-900/50 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-300">
            Selected Roles:{' '}
            <span className="text-blue-400">{selectedTemplates.size}</span>
            {maxSelectable && (
              <span className="text-gray-500">
                {' '}
                / {maxSelectable}
              </span>
            )}
          </span>

          {selectedTemplates.size > 0 && (
            <button
              onClick={() => setSelectedTemplates(new Set())}
              className="text-xs text-gray-400 hover:text-gray-200"
            >
              Clear
            </button>
          )}
        </div>

        {selectedTemplates.size > 0 && (
          <div className="flex flex-wrap gap-2">
            {Array.from(selectedTemplates).map((id) => {
              const template = templates.find((t) => t.id === id)
              return (
                <div
                  key={id}
                  className="flex items-center gap-1 rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-300"
                >
                  {template?.icon} {template?.name}
                  <button
                    onClick={() => handleToggleTemplate(id)}
                    className="ml-1 hover:text-blue-200"
                  >
                    ✕
                  </button>
                </div>
              )
            })}
          </div>
        )}

        <button
          onClick={handleConfirm}
          disabled={selectedTemplates.size === 0}
          className={`w-full rounded-lg px-4 py-2 font-semibold transition-colors ${
            selectedTemplates.size > 0
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          {selectedTemplates.size === 0
            ? 'Select at least one role'
            : `Confirm ${selectedTemplates.size} Role${selectedTemplates.size !== 1 ? 's' : ''}`}
        </button>
      </div>

      {/* Help Text */}
      <div className="text-xs text-gray-500">
        <p>
          💡 <strong>Tip:</strong> You can customize permissions for each role
          after setup. Team members can be assigned one or more roles.
        </p>
      </div>
    </div>
  )
}
