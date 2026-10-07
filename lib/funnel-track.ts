// Fire-and-forget funnel event logging for the POS activation path (onboarding
// done -> /pos setup mode -> first-run tour -> activate/pay). Never blocks or
// throws — a tracking failure must never interrupt the flow it's observing.
//
// The free trial is closed, and the old pre-payment /pos/setup wizard is gone,
// so the setup_*, *_trial_* and activate_trial_* events have no emitters left
// and were removed. Historical rows keep their labels in the admin funnel
// (app/(app)/admin/page.tsx) until they age out of its 14-day window.
export const POS_FUNNEL_EVENTS = [
  'onboarding_done_pos_shown',
  'onboarding_finish_clicked',
  'setup_fork_shown',
  'activate_screen_shown',
  'activate_payment_clicked',
  'coach_mark_shown',
  // Live since 2026-08-09's architecture change — the /pos paywall (anyone
  // who didn't claim the trial during onboarding) and the first-run tour
  // that replaces the old wizard.
  'paywall_shown',
  // Trial closed: setup is free, paying unlocks selling. The banner button on
  // /pos and the till's "locked" screen are the two activation prompts.
  'paywall_activate_clicked',
  'sell_blocked_not_active',
  'sell_activate_clicked',
  'tour_started',
  'tour_completed',
  'tour_skipped',
  // The "Getting started" checklist (components/onboarding/GettingStartedChecklist.tsx)
  // — separate from the tour above, shown on every /pos load until its steps
  // are done or it's dismissed.
  'checklist_shown',
  'checklist_step_clicked',
  'checklist_dismissed',
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
