'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Upload {
  id: string; filename: string; row_count: number
  column_names: string[]; file_size: number
  status: string; created_at: string
}

export default function FilesPage() {
  const router = useRouter()
  const supabase = createClient()
  const [uploads, setUploads] = useState<Upload[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState('')

  useEffect(() => { loadFiles() }, [])

  const loadFiles = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('uploads')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setUploads(data || [])
  }

  const handleUpload = async (file: File) => {
    if (!file) return
    setUploading(true)
    setUploadMsg(`Uploading ${file.name}…`)

    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/parse-file', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setUploadMsg(`✓ ${file.name} uploaded — ${data.rowCount} rows ready`)
      await loadFiles()
    } catch (e: unknown) {
      setUploadMsg(`✗ ${e instanceof Error ? e.message : 'Upload failed'}`)
    } finally {
      setUploading(false)
      setTimeout(() => setUploadMsg(''), 4000)
    }
  }

  const deleteFile = async (id: string) => {
    await supabase.from('uploads').delete().eq('id', id)
    setUploads(u => u.filter(f => f.id !== id))
  }

  const useInChat = (filename: string) => {
    sessionStorage.setItem('signalx-active-file', filename)
    router.push('/chat')
  }

  return (
    <div className="page-shell">
      {/* Header */}
      <div style={{ padding:'clamp(14px,4vw,22px) clamp(14px,3vw,24px) 18px', borderBottom:'1px solid var(--b)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <div>
          <div style={{ fontFamily:'var(--font-sora)', fontSize:18, fontWeight:600 }}>Files</div>
          <div style={{ fontSize:13, color:'var(--tx2)', marginTop:3 }}>Upload and manage your CSV and XLSX datasets</div>
        </div>
        <label style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 18px', borderRadius:9999, border:'none', background: uploading ? 'var(--b2)' : '#1ed4ca', color:'#04080f', fontSize:13, fontWeight:600, cursor: uploading ? 'not-allowed' : 'pointer' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          {uploading ? 'Uploading…' : 'Upload file'}
          <input type="file" accept=".csv,.xlsx,.xls" style={{ display:'none' }} disabled={uploading} onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])}/>
        </label>
      </div>

      <div className="page-shell-body">

        {/* Status message */}
        {uploadMsg && (
          <div style={{ padding:'12px 16px', borderRadius:12, marginBottom:16, background: uploadMsg.startsWith('✓') ? 'rgba(34,197,94,.1)' : uploadMsg.startsWith('✗') ? 'rgba(232,64,64,.1)' : 'rgba(30,212,202,.1)', border: `1px solid ${uploadMsg.startsWith('✓') ? 'rgba(34,197,94,.25)' : uploadMsg.startsWith('✗') ? 'rgba(232,64,64,.25)' : 'rgba(30,212,202,.25)'}`, fontSize:13, color: uploadMsg.startsWith('✓') ? '#22c55e' : uploadMsg.startsWith('✗') ? '#f48080' : '#47e2da' }}>
            {uploadMsg}
          </div>
        )}

        {/* Drop zone */}
        <label style={{ display:'block', border:'2px dashed var(--b2)', borderRadius:18, padding:48, textAlign:'center', cursor:'pointer', marginBottom:24, transition:'all 200ms' }}
          onMouseEnter={e => (e.currentTarget as HTMLLabelElement).style.borderColor='#1ed4ca'}
          onMouseLeave={e => (e.currentTarget as HTMLLabelElement).style.borderColor='var(--b2)'}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="1.5" strokeLinecap="round" style={{ display:'block', margin:'0 auto 12px' }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <div style={{ fontSize:15, fontWeight:500, marginBottom:5 }}>{uploading ? 'Uploading your file…' : 'Drop your file here or tap to browse'}</div>
          <div style={{ fontSize:12, color:'var(--tx3)' }}>CSV or XLSX · Up to 50 MB · Your data stays private</div>
          <input type="file" accept=".csv,.xlsx,.xls" style={{ display:'none' }} disabled={uploading} onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])}/>
        </label>

        {/* File list */}
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {uploads.length === 0 && !uploading && (
            <div style={{ textAlign:'center', padding:40, color:'var(--tx3)', fontSize:13 }}>
              No files uploaded yet. Drop a CSV or Excel file above to get started.
            </div>
          )}
          {uploads.map(f => (
            <div key={f.id} style={{ display:'flex', alignItems:'center', gap:12, padding:16, borderRadius:14, border:'1px solid var(--b)', background:'var(--sf)', transition:'border-color 180ms' }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor='var(--b2)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor='var(--b)'}>
              <div style={{ width:40, height:40, borderRadius:10, background:'rgba(30,212,202,.09)', border:'1px solid rgba(30,212,202,.18)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1ed4ca" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:500, marginBottom:3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.filename}</div>
                <div style={{ fontSize:11, color:'var(--tx3)' }}>
                  {f.row_count?.toLocaleString()} rows
                  {f.column_names?.length ? ` · ${f.column_names.length} columns` : ''}
                  {f.file_size ? ` · ${Math.round(f.file_size/1024)} KB` : ''}
                  {' · '}{new Date(f.created_at).toLocaleDateString()}
                </div>
              </div>
              <div style={{ display:'flex', gap:8, flexShrink:0, alignItems:'center' }}>
                <span style={{ padding:'3px 10px', borderRadius:9999, background:'rgba(30,212,202,.1)', border:'1px solid rgba(30,212,202,.22)', fontSize:11, color:'#47e2da', fontWeight:500 }}>
                  {f.status === 'parsed' ? '✓ Ready' : f.status}
                </span>
                <button onClick={() => useInChat(f.filename)} style={{ padding:'6px 14px', borderRadius:9999, border:'1px solid var(--b2)', background:'transparent', color:'var(--tx)', fontSize:12, cursor:'pointer', fontFamily:'inherit', fontWeight:500 }}>
                  Ask about this →
                </button>
                <button onClick={() => deleteFile(f.id)} style={{ padding:'6px 12px', borderRadius:9999, border:'1px solid rgba(232,64,64,.28)', background:'rgba(232,64,64,.08)', color:'#f48080', fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
