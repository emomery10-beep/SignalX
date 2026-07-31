// Single source of truth for POS component styling — mirrors the CSS
// variables in app/globals.css so every vertical draws from the same
// palette instead of hand-copying hex values per page.
export const tokens = {
  bg:        'var(--pos-bg)',
  surface:   'var(--pos-surface)',
  border:    'var(--pos-border)',
  ink:       'var(--pos-ink)',
  muted:     'var(--pos-muted)',
  hint:      'var(--pos-hint)',
  accent:       'var(--pos-accent)',
  accentPale:   'var(--pos-accent-pale)',
  accentRing:   'var(--pos-accent-ring)',
  danger:       'var(--pos-danger)',
  dangerPale:   'var(--pos-danger-pale)',
  dangerRing:   'var(--pos-danger-ring)',
  success:      'var(--pos-success)',
  successPale:  'var(--pos-success-pale)',
  successRing:  'var(--pos-success-ring)',
  warning:   'var(--pos-warning)',
} as const

export const radius = { sm: 8, md: 10, lg: 14, pill: 9999 } as const
export const space  = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 } as const
