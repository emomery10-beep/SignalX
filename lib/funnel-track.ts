// Fire-and-forget funnel event logging for the POS trial path (onboarding
// done -> /pos paywall/trial-claim -> first-run tour). Never blocks or
// throws — a tracking failure must never interrupt the flow it's observing.
//
// The setup_*/activate_* events below predate 2026-08-09's retirement of the
// pre-payment /pos/setup wizard (commit 66bc1cda) — that page now redirects
// to /pos on mount before it can ever fire them, and /pos/activate is no
// longer linked from anywhere live. They're kept here (not removed) only
// because app/(app)/pos/setup/page.tsx's unreachable-but-preserved wizard
// code still references them; app/api/admin/route.ts's FUNNEL_STEPS no
// longer displays them. Do not add new instrumentation against these names.
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
  // Live since 2026-08-09's architecture change — the /pos paywall (anyone
  // who didn't claim the trial during onboarding) and the first-run tour
  // that replaces the old wizard.
  'paywall_shown',
  'paywall_trial_clicked',
  'paywall_trial_started',
  'paywall_trial_failed',
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
