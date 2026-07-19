// Real AskBiz mark (viewfinder + lens — see lib/brand.ts) recolored onto the
// developer portal's own signal-500 teal tile instead of the marketing
// site's coral, so it reads as this product's own header rather than
// clashing with the dark/teal palette used everywhere else in this app.
// The favicon (app/icon.svg) stays the standard coral tile on purpose —
// that's compared against askbiz.co's favicon in browser tabs/search
// results, where matching the main brand exactly matters more than local
// palette fit.
export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="AskBiz" className="flex-shrink-0">
      <rect width="64" height="64" rx="14" fill="#12b8af" />
      <g fill="none" stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10,22 V10 H22" />
        <path d="M42,10 H54 V22" />
        <path d="M10,42 V54 H22" />
        <path d="M54,42 V54 H42" />
      </g>
      <circle cx="32" cy="32" r="5" fill="#FFFFFF" />
    </svg>
  )
}
