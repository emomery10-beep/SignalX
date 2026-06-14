'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { StaffTemplateSelector } from '@/components/staff-template-selector'
import { StaffTemplateType } from '@/lib/staff-templates'

type SetupStep = 'type' | 'size' | 'templates' | 'confirm'

interface SetupState {
  businessType?: StaffTemplateType
  businessSize?: 'small' | 'medium' | 'large'
  selectedTemplates?: string[]
}

export default function StaffSetupPage() {
  const router = useRouter()
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
            Set Up Your Business
          </h1>
          <p className="mt-2 text-gray-400">
            Let's configure your team roles and permissions
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
              <span className="font-bold">1</span> Business Type
            </div>
            <div className="text-gray-500">→</div>
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded ${
                step === 'size' || step === 'templates' || step === 'confirm'
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'text-gray-500'
              }`}
            >
              <span className="font-bold">2</span> Team Size
            </div>
            <div className="text-gray-500">→</div>
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded ${
                step === 'templates' || step === 'confirm'
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'text-gray-500'
              }`}
            >
              <span className="font-bold">3</span> Select Roles
            </div>
            <div className="text-gray-500">→</div>
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded ${
                step === 'confirm'
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'text-gray-500'
              }`}
            >
              <span className="font-bold">4</span> Confirm
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
                  What type of business do you operate?
                </h2>
                <p className="mt-2 text-gray-400">
                  We'll customize the team roles and permissions for your
                  business type
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
                    Manufacturing / Factory
                  </h3>
                  <p className="mt-2 text-sm text-gray-400">
                    Production floor, quality control, batch tracking, and
                    shift management
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1">
                    {[
                      'Line Operator',
                      'Quality Inspector',
                      'Shift Supervisor',
                    ].map((role) => (
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
                    Restaurant / Food Service
                  </h3>
                  <p className="mt-2 text-sm text-gray-400">
                    Servers, kitchen staff, managers, and customer orders
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1">
                    {['Server', 'Head Chef', 'Operations Manager'].map(
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
                  How large is your team?
                </h2>
                <p className="mt-2 text-gray-400">
                  We'll recommend appropriate roles based on your team size
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {(
                  [
                    {
                      size: 'small',
                      icon: '👥',
                      label: 'Small Team',
                      desc: '1-15 people',
                      roles: '3-4',
                    },
                    {
                      size: 'medium' as const,
                      icon: '🏢',
                      label: 'Medium Team',
                      desc: '15-50 people',
                      roles: '4-6',
                    },
                    {
                      size: 'large',
                      icon: '🏭',
                      label: 'Large Team',
                      desc: '50+ people',
                      roles: '6+',
                    },
                  ] as const
                ).map(({ size, icon, label, desc, roles }) => (
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
                      ~{roles} roles
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
                  Review Your Setup
                </h2>
                <p className="mt-2 text-gray-400">
                  Here's what we'll create for you
                </p>
              </div>

              <div className="space-y-4 rounded-lg border border-gray-700 bg-gray-900/50 p-6">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-400">
                    Business Type
                  </p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {state.businessType === 'factory'
                      ? '🏭 Manufacturing'
                      : '🍽️ Restaurant'}
                  </p>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <p className="text-xs font-semibold uppercase text-gray-400">
                    Team Size
                  </p>
                  <p className="mt-1 text-lg font-semibold text-white capitalize">
                    {state.businessSize} Team
                  </p>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <p className="text-xs font-semibold uppercase text-gray-400">
                    Staff Roles ({state.selectedTemplates.length})
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
                    Next Steps
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-gray-300">
                    <li>✅ Create staff role templates</li>
                    <li>✅ Set up permissions for each role</li>
                    <li>
                      📝 You can customize permissions and add more roles anytime
                    </li>
                    <li>👥 Invite team members to assign them to roles</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
                <p className="text-xs text-blue-200">
                  💡 You can customize these roles after setup and add team
                  members whenever you're ready.
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
              Back
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
              Continue
            </button>
          )}

          {step === 'confirm' && (
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="ml-auto rounded-lg bg-green-600 px-6 py-2 font-semibold text-white transition-colors disabled:opacity-50 hover:enabled:bg-green-700"
            >
              {isLoading ? 'Setting up...' : 'Create Staff Roles'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
