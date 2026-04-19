import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GeoResult } from '@/lib/geo'

interface UserState {
  id: string | null
  name: string
  email: string
  initials: string
  plan: 'starter' | 'growth' | 'business'
  avatarUrl?: string
}

interface SettingsState {
  bizType: 'retail' | 'ecommerce' | 'distributor' | 'exporter'
  showCharts: boolean
  showMetrics: boolean
  showFollowUps: boolean
  biScopeEnforcement: boolean
}

interface SessionState {
  activeConversationId: string | null
  activeFile: string | null
  activeDatasetSummary: string | null
  chatHistory: Array<{ role: 'user' | 'assistant'; content: string }>
  isLoading: boolean
  lastResult: Record<string, unknown> | null
}

interface SignalXStore {
  user: UserState
  geo: GeoResult | null
  settings: SettingsState
  session: SessionState
  setUser: (u: Partial<UserState>) => void
  setGeo: (g: GeoResult) => void
  updateSettings: (s: Partial<SettingsState>) => void
  setActiveConversation: (id: string | null) => void
  setActiveFile: (name: string | null, summary?: string) => void
  pushMessage: (role: 'user' | 'assistant', content: string) => void
  clearChat: () => void
  setLoading: (v: boolean) => void
  setLastResult: (r: Record<string, unknown>) => void
  reset: () => void
}

const defaultSettings: SettingsState = {
  bizType: 'retail',
  showCharts: true,
  showMetrics: true,
  showFollowUps: true,
  biScopeEnforcement: true,
}

const defaultSession: SessionState = {
  activeConversationId: null,
  activeFile: null,
  activeDatasetSummary: null,
  chatHistory: [],
  isLoading: false,
  lastResult: null,
}

export const useStore = create<SignalXStore>()(
  persist(
    (set) => ({
      user: { id: null, name: '', email: '', initials: '', plan: 'starter' },
      geo: null,
      settings: defaultSettings,
      session: defaultSession,
      setUser: (u) => set(s => ({ user: { ...s.user, ...u } })),
      setGeo: (g) => set({ geo: g }),
      updateSettings: (s) => set(st => ({ settings: { ...st.settings, ...s } })),
      setActiveConversation: (id) => set(s => ({ session: { ...s.session, activeConversationId: id } })),
      setActiveFile: (name, summary) => set(s => ({
        session: { ...s.session, activeFile: name, activeDatasetSummary: summary || null }
      })),
      pushMessage: (role, content) => set(s => ({
        session: { ...s.session, chatHistory: [...s.session.chatHistory.slice(-24), { role, content }] }
      })),
      clearChat: () => set(s => ({
        session: { ...s.session, chatHistory: [], lastResult: null, activeConversationId: null }
      })),
      setLoading: (v) => set(s => ({ session: { ...s.session, isLoading: v } })),
      setLastResult: (r: Record<string, unknown>) => set(s => ({ session: { ...s.session, lastResult: r } })),
      reset: () => set({ user: { id: null, name: '', email: '', initials: '', plan: 'starter' }, session: defaultSession }),
    }),
    {
      name: 'signalx-store',
      partialize: (state) => ({ settings: state.settings, geo: state.geo }),
    }
  )
)
