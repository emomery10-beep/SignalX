// Fire-and-forget funnel event logging for the POS trial path (onboarding
// done -> pos/setup -> pos/activate). Never blocks or throws — a tracking
// failure must never interrupt the flow it's observing.
export const POS_FUNNEL_EVENTS = [
  'onboarding_done_pos_shown',
  'onboarding_finish_clicked',
  'onboarding_trial_clicked',
  'onboarding_trial_started',
  'onboarding_trial_failed',
  'onboarding_trial_skipped',
  'setup_fork_shown',
  'setup_capture_opened',
  'setup_import_opened',
  'setup_item_added',
  'setup_ready_clicked',
  'setup_ready_screen_shown',
  'setup_activate_clicked',
  'activate_screen_shown',
  'activate_trial_button_shown',
  'activate_trial_clicked',
  'activate_trial_started',
  'activate_trial_failed',
  'activate_payment_clicked',
  'coach_mark_shown',
  // UI interaction, not funnel progress — same treatment as coach_mark_shown.
  // Lets us later measure whether the help chip/card actually reduces drop-off.
  'pos_help_clicked',
] as const

export type PosFunnelEvent = typeof POS_FUNNEL_EVENTS[number]

export function trackFunnelEvent(event: PosFunnelEvent, opts?: { businessType?: string; metadata?: Record<string, unknown> }) {
  try {
    fetch('/api/pos/funnel-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, business_type: opts?.businessType, metadata: opts?.metadata }),
      keepalive: true,
    }).catch(() => { /* best-effort */ })
  } catch { /* best-effort */ }
}
