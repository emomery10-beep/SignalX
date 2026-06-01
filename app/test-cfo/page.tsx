'use client'
import CfoDashboard from '@/components/cfo/CfoDashboard'

export default function TestCfoPage() {
  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <CfoDashboard onAsk={(prompt) => console.log('Ask AI:', prompt)} />
    </div>
  )
}
