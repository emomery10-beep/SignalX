export default function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-signal-300 bg-signal-500/10 ring-1 ring-signal-400/20">
      <span className="w-1 h-1 rounded-full bg-signal-400" />
      {children}
    </span>
  )
}
