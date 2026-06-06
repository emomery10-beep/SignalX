'use client'
import { useState, useEffect } from 'react'

export interface TrialInfo {
  active: boolean
  daysLeft: number
  endsAt: string
  expired: boolean
  used: boolean
}

export interface PlanState {
  planId: string
  loading: boolean
  isUnlimited: boolean
  questionsUsed: number
  questionLimit: number
  usagePct: number
  trials: Record<string, TrialInfo>
}

export function usePlan(): PlanState {
  const [state, setState] = useState<PlanState>({
    planId: 'free', loading: true, isUnlimited: false,
    questionsUsed: 0, questionLimit: 10, usagePct: 0,
    trials: {},
  })

  useEffect(() => {
    fetch('/api/billing')
      .then(r => r.json())
      .then(data => {
        const planId = data?.subscription?.plan_id || 'free'
        const qUsed = data?.usage?.questions || 0
        const qLimit = data?.limits?.questions || 10
        const isUnlimited = qLimit === -1
        const usagePct = isUnlimited ? 0 : Math.round((qUsed / qLimit) * 100)
        setState({ planId, loading: false, isUnlimited, questionsUsed: qUsed, questionLimit: qLimit, usagePct, trials: data?.trials || {} })
      })
      .catch(() => setState(s => ({ ...s, loading: false })))
  }, [])

  return state
}
