'use client'
import DiscoveryAgentCard from '@/components/admin/DiscoveryAgentCard'

const OTHER_JOBS = [
  { id:'source-sync',        icon:'🔄', name:'Source Data Sync',      desc:'Refreshes all connected Shopify, Stripe, Xero, Amazon data.',                                               schedule:'Daily at 5am'       },
  { id:'daily-brief',        icon:'📋', name:'Daily Brief Generator',  desc:'Pre-generates AI morning briefs for all users + emails them.',                                             schedule:'Daily at 7am'       },
  { id:'token-refresh',      icon:'🔑', name:'OAuth Token Refresh',    desc:'Pre-emptively refreshes tokens for all integrations before expiry.',                                       schedule:'Daily at 1am'       },
  { id:'stale-content',      icon:'🧹', name:'Stale Content Cleanup',  desc:'Deletes rejected + stale pending content older than 30 days.',                                             schedule:'Weekly Sunday 5am'  },
  { id:'seo-monitor',        icon:'📊', name:'SEO Monitor',            desc:'Checks Google Search Console for traffic drops + broken pages.',                                           schedule:'Weekly Monday 9am'  },
  { id:'stock-replenishment',icon:'📦', name:'Stock Replenishment',    desc:'Analyses POS sales velocity, predicts stockouts, generates reorder suggestions for all users.',           schedule:'Daily at 6am'       },
]

export default function PreviewDiscoveryAgent() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      fontFamily: 'var(--font-dm), DM Sans, system-ui, sans-serif',
      padding: '32px 24px',
    }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        {/* Breadcrumb */}
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:28 }}>
          <span style={{ fontSize:10, color:'var(--tx3)', fontWeight:500 }}>Admin</span>
          <span style={{ fontSize:10, color:'var(--b2)' }}>›</span>
          <span style={{ fontSize:10, color:'var(--tx3)', fontWeight:500 }}>Agents</span>
          <span style={{ fontSize:10, color:'var(--b2)' }}>›</span>
          <span style={{ fontSize:10, color:'var(--tx2)', fontWeight:600 }}>Automation</span>
        </div>

        {/* Tab strip */}
        <div style={{ borderBottom:'1px solid var(--b)', marginBottom:28, display:'flex', gap:0, overflowX:'auto' }}>
          {['Alice Watson — Blog Scout', 'Automation', 'Security & GDPR'].map((t, i) => (
            <div key={t} style={{
              padding: '10px 20px',
              fontSize: 11,
              fontWeight: i===1 ? 600 : 400,
              color: i===1 ? '#6366F1' : 'var(--tx3)',
              borderBottom: i===1 ? '2px solid #6366F1' : '2px solid transparent',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}>
              {t}
            </div>
          ))}
        </div>

        {/* Section header */}
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:12, fontWeight:600, color:'var(--tx)' }}>Automated Jobs</div>
          <div style={{ fontSize:10, color:'var(--tx3)', marginTop:2 }}>
            Cron jobs that run automatically on schedule. You can also trigger them manually.
          </div>
        </div>

        {/* Existing jobs */}
        {OTHER_JOBS.map(job => (
          <div key={job.id} style={{
            padding: 18,
            borderRadius: 'var(--r-lg)',
            border: '1px solid var(--b)',
            background: 'var(--sf)',
            marginBottom: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}>
            <div style={{
              width:40, height:40, borderRadius:'var(--r-md)',
              background:'rgba(99,102,241,.08)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:16, flexShrink:0,
            }}>{job.icon}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:2 }}>
                <span style={{ fontSize:11, fontWeight:600, color:'var(--tx)' }}>{job.name}</span>
                <span style={{ fontSize:9, padding:'2px 8px', borderRadius:9999, background:'rgba(99,102,241,.08)', color:'#6366F1', fontWeight:600 }}>{job.schedule}</span>
              </div>
              <div style={{ fontSize:10, color:'var(--tx3)', lineHeight:1.5 }}>{job.desc}</div>
            </div>
            <button style={{
              padding:'9px 18px', borderRadius:9999, border:'none',
              background:'#6366F1', color:'#fff',
              fontSize:10, fontWeight:600, cursor:'pointer', fontFamily:'inherit', flexShrink:0,
            }}>
              Run Now
            </button>
          </div>
        ))}

        {/* ── Real DiscoveryAgentCard component ── */}
        <DiscoveryAgentCard />

        {/* Blog auto-publish card */}
        <div style={{
          padding:18, borderRadius:'var(--r-lg)',
          border:'1px solid var(--b)', background:'var(--sf)', marginTop:10,
          display:'flex', alignItems:'center', gap:14,
        }}>
          <div style={{
            width:40, height:40, borderRadius:'var(--r-md)',
            background:'rgba(16,185,129,.08)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:16, flexShrink:0,
          }}>✨</div>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:2 }}>
              <span style={{ fontSize:11, fontWeight:600, color:'var(--tx)' }}>Blog Auto-Publish</span>
              <span style={{ fontSize:9, padding:'2px 8px', borderRadius:9999, background:'rgba(16,185,129,.1)', color:'#10b981', fontWeight:600 }}>Active</span>
            </div>
            <div style={{ fontSize:10, color:'var(--tx3)', lineHeight:1.5 }}>
              High-quality blog posts (score 80+) are auto-published by Alice Watson. Lower-scoring posts go to Pending Review. Google & Bing are pinged on every publish.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
