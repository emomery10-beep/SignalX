// Fixed, pointer-events-none radial mesh — the "Ethereal Glass" backdrop.
// Pinned to the viewport (not the scrolling container) so it never repaints
// on scroll. Two soft orbs in the brand's signal/pulse hues at low opacity.
export default function GlowField() {
  return (
    <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute -top-40 -left-32 w-[36rem] h-[36rem] rounded-full bg-signal-500/[0.10] blur-[120px]" />
      <div className="absolute top-1/3 -right-40 w-[32rem] h-[32rem] rounded-full bg-pulse-500/[0.08] blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 w-[28rem] h-[28rem] rounded-full bg-signal-400/[0.06] blur-[130px]" />
    </div>
  )
}
