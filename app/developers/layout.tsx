export default function DevelopersLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f9f8f6',
      // Override the body::before grid texture for this page
      position: 'relative',
      isolation: 'isolate',
    }}>
      {children}
    </div>
  )
}
