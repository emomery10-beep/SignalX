'use client'
import { usePlan } from '@/lib/hooks/usePlan'
import FeatureGate from '@/components/gates/FeatureGate'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Alert { id:string; name:string; alert_type:string; column_name:string; threshold:number; is_active:boolean; last_fired_at:string|null; fire_count:number }
interface Upload { id:string; filename:string; column_names:string[] }

const ALERT_TYPES = [
  { value:'stock_low',     label:'Stock low',      desc:'Trigger when stock falls below threshold' },
  { value:'margin_drop',   label:'Margin drop',    desc:'Trigger when margin falls below threshold' },
  { value:'revenue_spike', label:'Revenue spike',  desc:'Trigger when revenue exceeds threshold' },
  { value:'price_change',  label:'Price change',   desc:'Trigger when price changes by threshold %' },
  { value:'custom',        label:'Custom',         desc:'Define your own column and condition' },
]

export default function AlertsPage() {
  const { planId, loading: planLoading } = usePlan()
  const supabase = createClient()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [uploads, setUploads] = useState<Upload[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name:'', alertType:'stock_low', uploadId:'', column:'', threshold:10, notifyEmail:true })
  const [saving, setSaving] = useState(false)
  const [selectedUpload, setSelectedUpload] = useState<Upload|null>(null)
  const [evaluating, setEvaluating] = useState(false)
  const [firedAlerts, setFiredAlerts] = useState<{alertName:string;message:string;severity:string}[]>([])

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const [{ data: al }, { data: up }] = await Promise.all([
      supabase.from('alerts').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('uploads').select('id, filename, column_names').eq('user_id', user.id).eq('status', 'parsed'),
    ])
    setAlerts(al || [])
    setUploads(up || [])
  }

  const saveAlert = async () => {
    setSaving(true)
    const res = await fetch('/api/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form }),
    })
    if (res.ok) { setShowForm(false); loadData() }
    setSaving(false)
  }

  const autoDetect = async () => {
    if (!selectedUpload) return
    const res = await fetch('/api/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ autoDetect: true, uploadId: selectedUpload.id }),
    })
    const { suggestions } = await res.json()
    if (suggestions?.length) {
      for (const s of suggestions) {
        await fetch('/api/alerts', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name:s.name, alertType:s.alertType, uploadId:selectedUpload.id, column:s.column, threshold:s.threshold, notifyEmail:s.notifyEmail }) })
      }
      loadData()
    }
  }

  const evaluate = async () => {
    if (!selectedUpload) return
    setEvaluating(true)
    const res = await fetch('/api/alerts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uploadId: selectedUpload.id }),
    })
    const { fired } = await res.json()
    setFiredAlerts(fired || [])
    setEvaluating(false)
    loadData()
  }

  const toggleAlert = async (id:string, current:boolean) => {
    await supabase.from('alerts').update({ is_active: !current }).eq('id', id)
    loadData()
  }

  const deleteAlert = async (id:string) => {
    await supabase.from('alerts').delete().eq('id', id)
    loadData()
  }

  const severityColor = (s:string) => s==='critical'?'#f48080':s==='warning'?'#f5c55a':'#47e2da'

  return (
    <div className="page-shell">
      <div className="page-shell-header" style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 600 }}>Alerts</div>
          <div style={{ fontSize: 13, color: 'var(--tx2)', marginTop: 3 }}>Get notified when your data crosses key thresholds</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {uploads.length > 0 && (
            <select style={{ fontFamily:'inherit', fontSize:12, color:'var(--tx)', background:'var(--ev)', border:'1px solid var(--b2)', borderRadius:10, padding:'7px 11px', outline:'none' }}
              onChange={e => setSelectedUpload(uploads.find(u=>u.id===e.target.value)||null)}>
              <option value="">Select dataset to evaluate</option>
              {uploads.map(u => <option key={u.id} value={u.id}>{u.filename}</option>)}
            </select>
          )}
          {selectedUpload && <button onClick={autoDetect} style={outlineBtn}>Auto-detect alerts</button>}
          {selectedUpload && <button onClick={evaluate} disabled={evaluating} style={outlineBtn}>{evaluating?'Checking…':'Run checks'}</button>}
          <button onClick={() => setShowForm(true)} style={primaryBtn}>+ New alert</button>
        </div>
      </div>

      <div className="page-shell-body">

        {/* Fired alerts banner */}
        {firedAlerts.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 10 }}>⚡ Alerts fired</div>
            {firedAlerts.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', borderRadius: 12, border: `1px solid ${severityColor(f.severity)}33`, background: `${severityColor(f.severity)}11`, marginBottom: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: severityColor(f.severity), flexShrink: 0, marginTop: 4 }}></div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 3 }}>{f.alertName}</div>
                  <div style={{ fontSize: 12, color: 'var(--tx2)' }}>{f.message}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Alert list */}
        {alerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--tx3)' }}>
            <div style={{ fontSize: 15, marginBottom: 8 }}>No alerts set up yet</div>
            <div style={{ fontSize: 13 }}>Click "Auto-detect alerts" after selecting a dataset, or create one manually.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {alerts.map(a => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, borderRadius: 14, border: `1px solid ${a.is_active ? 'var(--b2)' : 'var(--b)'}`, background: 'var(--sf)' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: a.is_active ? '#22c55e' : 'var(--tx3)', flexShrink: 0 }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 3 }}>{a.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--tx3)' }}>
                    {a.alert_type.replace('_',' ')} · {a.column_name} {a.threshold ? `< ${a.threshold}` : ''} · Fired {a.fire_count||0} time{a.fire_count!==1?'s':''}
                    {a.last_fired_at ? ` · Last: ${new Date(a.last_fired_at).toLocaleDateString()}` : ''}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 7 }}>
                  <button onClick={() => toggleAlert(a.id, a.is_active)} style={{ ...outlineBtn, fontSize: 11, padding: '4px 10px' }}>{a.is_active ? 'Pause' : 'Resume'}</button>
                  <button onClick={() => deleteAlert(a.id)} style={{ padding: '4px 10px', borderRadius: 9999, border: '1px solid rgba(232,64,64,.28)', background: 'rgba(232,64,64,.08)', color: '#f48080', fontFamily: 'inherit', fontSize: 11, cursor: 'pointer' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* New alert form */}
        {showForm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(4,8,15,.75)', backdropFilter: 'blur(6px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div style={{ background: 'var(--sf)', border: '1px solid var(--b2)', borderRadius: 20, width: '100%', maxWidth: 460, padding: 28 }}>
              <div style={{ fontFamily: 'var(--font-sora)', fontSize: 17, fontWeight: 600, marginBottom: 20 }}>New alert</div>
              <div style={{ marginBottom: 12 }}><label style={labelSt}>Alert name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Critical stock warning" style={inputSt}/></div>
              <div style={{ marginBottom: 12 }}><label style={labelSt}>Dataset</label>
                <select style={inputSt} value={form.uploadId} onChange={e=>setForm({...form,uploadId:e.target.value})}>
                  <option value="">Select file…</option>
                  {uploads.map(u=><option key={u.id} value={u.id}>{u.filename}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 12 }}><label style={labelSt}>Alert type</label>
                <select style={inputSt} value={form.alertType} onChange={e=>setForm({...form,alertType:e.target.value})}>
                  {ALERT_TYPES.map(t=><option key={t.value} value={t.value}>{t.label} — {t.desc}</option>)}
                </select>
              </div>
              <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:10,marginBottom:12 }}>
                <div><label style={labelSt}>Column</label><input value={form.column} onChange={e=>setForm({...form,column:e.target.value})} placeholder="e.g. stock" style={inputSt}/></div>
                <div><label style={labelSt}>Threshold</label><input type="number" value={form.threshold} onChange={e=>setForm({...form,threshold:Number(e.target.value)})} style={inputSt}/></div>
              </div>
              <div style={{ display:'flex',gap:10,marginTop:20 }}>
                <button onClick={()=>setShowForm(false)} style={{...outlineBtn,flex:1,padding:10}}>Cancel</button>
                <button onClick={saveAlert} disabled={saving||!form.name||!form.column} style={{flex:1,padding:10,borderRadius:9999,border:'none',background:'#1ed4ca',color:'#04080f',fontFamily:'inherit',fontSize:13,fontWeight:600,cursor:'pointer'}}>
                  {saving?'Saving…':'Create alert'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const primaryBtn: React.CSSProperties = { padding:'7px 16px', borderRadius:9999, border:'none', background:'#1ed4ca', color:'#04080f', fontFamily:'inherit', fontSize:12, fontWeight:600, cursor:'pointer' }
const outlineBtn: React.CSSProperties = { padding:'7px 14px', borderRadius:9999, border:'1px solid var(--b2)', background:'transparent', color:'var(--tx)', fontFamily:'inherit', fontSize:12, cursor:'pointer' }
const labelSt: React.CSSProperties = { display:'block', fontSize:12, fontWeight:500, color:'var(--tx2)', marginBottom:5 }
const inputSt: React.CSSProperties = { fontFamily:'inherit', fontSize:13, color:'var(--tx)', background:'var(--ev)', border:'1px solid var(--b2)', borderRadius:10, padding:'9px 12px', outline:'none', width:'100%' }
