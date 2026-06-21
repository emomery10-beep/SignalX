'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { StaffTemplateSelector } from '@/components/staff-template-selector'
import { StaffTemplateType } from '@/lib/staff-templates'
import { useLang } from '@/components/LanguageProvider'

type SetupStep = 'type' | 'size' | 'templates' | 'confirm'

const buildFactoryRoles = (tc: (key: string) => string): string[] => [
  tc('staff_setup.type_factory_role_line_operator'),
  tc('staff_setup.type_factory_role_quality_inspector'),
  tc('staff_setup.type_factory_role_shift_supervisor'),
]

const buildRestaurantRoles = (tc: (key: string) => string): string[] => [
  tc('staff_setup.type_restaurant_role_server'),
  tc('staff_setup.type_restaurant_role_head_chef'),
  tc('staff_setup.type_restaurant_role_operations_manager'),
]

const buildSizeOptions = (tc: (key: string) => string) => ([
  {
    size: 'small' as const,
    icon: '👥',
    label: tc('staff_setup.size_small_label'),
    desc: tc('staff_setup.size_small_desc'),
    roles: tc('staff_setup.size_small_roles'),
  },
  {
    size: 'medium' as const,
    icon: '🏢',
    label: tc('staff_setup.size_medium_label'),
    desc: tc('staff_setup.size_medium_desc'),
    roles: tc('staff_setup.size_medium_roles'),
  },
  {
    size: 'large' as const,
    icon: '🏭',
    label: tc('staff_setup.size_large_label'),
    desc: tc('staff_setup.size_large_desc'),
    roles: tc('staff_setup.size_large_roles'),
  },
])

interface SetupState {
  businessType?: StaffTemplateType
  businessSize?: 'small' | 'medium' | 'large'
  selectedTemplates?: string[]
}

export default function StaffSetupPage() {
  const router = useRouter()
  const { tc } = useLang()
  const [step, setStep] = useState<SetupStep>('type')
  const [state, setState] = useState<SetupState>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSelectType = (type: StaffTemplateType) => {
    setState({ businessType: type })
    setStep('size')
  }

  const handleSelectSize = (size: 'small' | 'medium' | 'large') => {
    setState({ ...state, businessSize: size })
    setStep('templates')
  }

  const handleSelectTemplates = (templateIds: string[]) => {
    setState({ ...state, selectedTemplates: templateIds })
    setStep('confirm')
  }

  const handleQuickStart = (templateIds: string[]) => {
    setState({ ...state, selectedTemplates: templateIds })
    setStep('confirm')
  }

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      // TODO: Call API to save staff role templates
      // const response = await fetch('/api/onboarding/staff-setup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     businessType: state.businessType,
      //     businessSize: state.businessSize,
      //     templateIds: state.selectedTemplates,
      //   }),
      // })

      // For now, just redirect to the relevant section
      if (state.businessType === 'factory') {
        router.push('/factory/staff')
      } else {
        router.push('/restaurant/staff')
      }
    } catch (error) {
      console.error('Failed to save staff setup:', error)
      // TODO: Show error toast
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    if (step === 'size') {
      setStep('type')
      setState({ businessType: undefined })
    } else if (step === 'templates') {
      setStep('size')
      setState({ businessSize: undefined })
    } else if (step === 'confirm') {
      setStep('templates')
      setState({ selectedTemplates: undefined })
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-900">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-900 px-6 py-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-white">
            {tc('staff_setup.header_title')}
          </h1>
          <p className="mt-2 text-gray-400">
            {tc('staff_setup.header_subtitle')}
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="border-b border-gray-700 bg-gray-900/50 px-6 py-4">
        <div className="mx-auto max-w-3xl">
          <div className="flex gap-2 text-xs font-medium uppercase">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded ${
                step === 'type' || step === 'size' || step === 'templates' || step === 'confirm'
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'text-gray-500'
              }`}
            >
              <span className="font-bold">1</span> {tc('staff_setup.step_business_type')}
            </div>
            <div className="text-gray-500">→</div>
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded ${
                step === 'size' || step === 'templates' || step === 'confirm'
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'text-gray-500'
              }`}
            >
              <span className="font-bold">2</span> {tc('staff_setup.step_team_size')}
            </div>
            <div className="text-gray-500">→</div>
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded ${
                step === 'templates' || step === 'confirm'
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'text-gray-500'
              }`}
            >
              <span className="font-bold">3</span> {tc('staff_setup.step_select_roles')}
            </div>
            <div className="text-gray-500">→</div>
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded ${
                step === 'confirm'
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'text-gray-500'
              }`}
            >
              <span className="font-bold">4</span> {tc('staff_setup.step_confirm')}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-3xl">
          {/* Step 1: Business Type */}
          {step === 'type' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {tc('staff_setup.type_heading')}
                </h2>
                <p className="mt-2 text-gray-400">
                  {tc('staff_setup.type_subtitle')}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Factory Option */}
                <button
                  onClick={() => handleSelectType('factory')}
                  className="rounded-lg border-2 border-gray-700 bg-gray-900 p-6 transition-all hover:border-blue-500 hover:bg-gray-800"
                >
                  <div className="text-4xl">🏭</div>
                  <h3 className="mt-4 text-lg font-bold text-white">
                    {tc('staff_setup.type_factory_title')}
                  </h3>
                  <p className="mt-2 text-sm text-gray-400">
                    {tc('staff_setup.type_factory_desc')}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1">
                    {buildFactoryRoles(tc).map((role) => (
                      <span
                        key={role}
                        className="rounded text-xs bg-gray-800 px-2 py-1 text-gray-300"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </button>

                {/* Restaurant Option */}
                <button
                  onClick={() => handleSelectType('restaurant')}
                  className="rounded-lg border-2 border-gray-700 bg-gray-900 p-6 transition-all hover:border-blue-500 hover:bg-gray-800"
                >
                  <div className="text-4xl">🍽️</div>
                  <h3 className="mt-4 text-lg font-bold text-white">
                    {tc('staff_setup.type_restaurant_title')}
                  </h3>
                  <p className="mt-2 text-sm text-gray-400">
                    {tc('staff_setup.type_restaurant_desc')}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1">
                    {buildRestaurantRoles(tc).map(
                      (role) => (
                        <span
                          key={role}
                          className="rounded text-xs bg-gray-800 px-2 py-1 text-gray-300"
                        >
                          {role}
                        </span>
                      )
                    )}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Business Size */}
          {step === 'size' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {tc('staff_setup.size_heading')}
                </h2>
                <p className="mt-2 text-gray-400">
                  {tc('staff_setup.size_subtitle')}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {buildSizeOptions(tc).map(({ size, icon, label, desc, roles }) => (
                  <button
                    key={size}
                    onClick={() => handleSelectSize(size)}
                    className="rounded-lg border-2 border-gray-700 bg-gray-900 p-6 transition-all hover:border-blue-500 hover:bg-gray-800"
                  >
                    <div className="text-3xl">{icon}</div>
                    <h3 className="mt-3 text-lg font-bold text-white">
                      {label}
                    </h3>
                    <p className="mt-1 text-xs text-gray-400">{desc}</p>
                    <p className="mt-3 text-xs font-semibold text-gray-300">
                      {tc('staff_setup.size_roles_suffix', { roles })}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Select Templates */}
          {step === 'templates' && state.businessType && (
            <StaffTemplateSelector
              type={state.businessType}
              businessSize={state.businessSize || 'medium'}
              onSelect={handleSelectTemplates}
              onQuickStart={handleQuickStart}
            />
          )}

          {/* Step 4: Confirm */}
          {step === 'confirm' && state.selectedTemplates && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {tc('staff_setup.confirm_heading')}
                </h2>
                <p className="mt-2 text-gray-400">
                  {tc('staff_setup.confirm_subtitle')}
                </p>
              </div>

              <div className="space-y-4 rounded-lg border border-gray-700 bg-gray-900/50 p-6">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-400">
                    {tc('staff_setup.confirm_business_type_label')}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {state.businessType === 'factory'
                      ? tc('staff_setup.confirm_business_type_factory')
                      : tc('staff_setup.confirm_business_type_restaurant')}
                  </p>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <p className="text-xs font-semibold uppercase text-gray-400">
                    {tc('staff_setup.confirm_team_size_label')}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-white capitalize">
                    {tc('staff_setup.confirm_team_size_value', { size: state.businessSize || '' })}
                  </p>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <p className="text-xs font-semibold uppercase text-gray-400">
                    {tc('staff_setup.confirm_staff_roles_label', { count: state.selectedTemplates.length })}
                  </p>
                  <div className="mt-3 space-y-2">
                    {state.selectedTemplates.map((templateId) => (
                      <div
                        key={templateId}
                        className="rounded bg-gray-800 px-3 py-2 text-sm font-medium text-gray-100"
                      >
                        {templateId}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <p className="text-xs font-semibold uppercase text-gray-400">
                    {tc('staff_setup.confirm_next_steps_label')}
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-gray-300">
                    <li>{tc('staff_setup.confirm_next_step_1')}</li>
                    <li>{tc('staff_setup.confirm_next_step_2')}</li>
                    <li>
                      {tc('staff_setup.confirm_next_step_3')}
                    </li>
                    <li>{tc('staff_setup.confirm_next_step_4')}</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
                <p className="text-xs text-blue-200">
                  {tc('staff_setup.confirm_tip')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-700 bg-gray-900 px-6 py-6">
        <div className="mx-auto max-w-3xl flex gap-4">
          {step !== 'type' && (
            <button
              onClick={handleBack}
              className="rounded-lg border border-gray-600 px-6 py-2 font-semibold text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
            >
              {tc('staff_setup.back')}
            </button>
          )}

          {step !== 'confirm' && (
            <button
              disabled={
                (step === 'type' && !state.businessType) ||
                (step === 'size' && !state.businessSize) ||
                (step === 'templates' && !state.selectedTemplates?.length)
              }
              className="ml-auto rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition-colors disabled:opacity-50 hover:enabled:bg-blue-700"
            >
              {tc('staff_setup.continue')}
            </button>
          )}

          {step === 'confirm' && (
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="ml-auto rounded-lg bg-green-600 px-6 py-2 font-semibold text-white transition-colors disabled:opacity-50 hover:enabled:bg-green-700"
            >
              {isLoading ? tc('staff_setup.create_roles_loading') : tc('staff_setup.create_roles')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
