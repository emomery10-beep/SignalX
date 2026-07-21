'use client'
import { useEffect, useState } from 'react'

const focusRing = 'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-500'
const inputCls = `w-full px-3 py-3 rounded-lg border border-ink-600 bg-ink-950 text-ink-50 text-sm transition-colors ${focusRing}`
const labelCls = 'block mb-1.5 text-xs font-medium text-ink-200'
const primaryBtnCls = `py-3 px-5 rounded-lg bg-signal-500 text-ink-950 text-sm font-semibold hover:bg-signal-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${focusRing}`
const ghostBtnCls = `py-2 px-3 rounded-md border border-ink-600 text-ink-300 text-xs font-medium hover:bg-ink-800 transition-colors disabled:opacity-50 ${focusRing}`
const cardCls = 'border border-ink-700 rounded-xl p-5 bg-ink-900'

type Verification = {
  id: string
  status: 'pending' | 'approved' | 'rejected'
  legal_name: string | null
  registration_number: string | null
  tax_id: string | null
  address: string | null
  submitted_at: string | null
  reviewed_at: string | null
  rejection_reason: string | null
} | null

type Document = { id: string; kind: string; uploaded_at: string }

const DOCUMENT_KINDS: { kind: string; label: string; hint: string }[] = [
  { kind: 'registration_certificate', label: 'Business registration certificate', hint: 'Certificate of incorporation, trading licence, or equivalent.' },
  { kind: 'proof_of_address', label: 'Proof of business address', hint: 'A utility bill, lease, or bank statement showing the business address.' },
  { kind: 'owner_id', label: "Owner's government ID", hint: 'National ID, passport, or driving licence for the account owner.' },
  { kind: 'ownership_disclosure', label: 'Ownership disclosure', hint: 'A short note or document naming who owns 25% or more of the business.' },
]

const UNLOCKS = [
  { title: '"Verified business" badge', body: 'Shown to merchants on the Connections consent screen — the same trust signal a checkmark gives on other platforms.' },
  { title: '3× API rate limits', body: 'Your monthly and per-minute request limits are multiplied by 3 on every key, applied immediately on approval and kept on any future plan change.' },
  { title: 'A step toward bringing other apps onto AskBiz', body: 'As the platform opens up to third-party integrations, verified status is the baseline trust signal those integrations will rely on.' },
]

export default function VerificationPage() {
  const [verification, setVerification] = useState<Verification>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const load = () => {
    fetch('/api/dashboard-verification').then(r => r.json()).then(d => {
      if (d.error) { setLoadError(d.error); return }
      setVerification(d.verification)
      setDocuments(d.documents || [])
    }).catch(() => setLoadError('Could not load verification status')).finally(() => setLoading(false))
  }
  useEffect(load, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold mb-1">Business verification</h1>
        <p className="text-ink-300 text-sm max-w-lg">
          Verify your business to earn a badge merchants see on the Connections consent screen, and a rate-limit bump on every API key.
          Reviewed manually by AskBiz — no third-party ID-check provider yet.
        </p>
      </div>

      {loading && <p className="text-ink-300 text-sm">Loading…</p>}
      {loadError && <p className="text-red-400 text-sm">{loadError}</p>}

      {!loading && !loadError && (
        <div className="space-y-6">
          <StatusBanner verification={verification} />

          {verification?.status !== 'approved' && (
            <>
              <DetailsForm verification={verification} onSaved={load} />
              <DocumentsCard verificationId={verification?.id || null} documents={documents} onUploaded={load} />
            </>
          )}

          <UnlocksPanel />
        </div>
      )}
    </div>
  )
}

function StatusBanner({ verification }: { verification: Verification }) {
  if (!verification) {
    return (
      <div className={cardCls}>
        <p className="text-ink-100 text-sm font-medium mb-1">Not started</p>
        <p className="text-ink-400 text-xs">Submit your business details and documents below to begin review.</p>
      </div>
    )
  }
  if (verification.status === 'pending') {
    return (
      <div className="border border-amber-800 bg-amber-950/30 rounded-xl p-5">
        <p className="text-amber-300 text-sm font-medium mb-1">Pending review</p>
        <p className="text-amber-200/80 text-xs">
          Submitted {verification.submitted_at ? new Date(verification.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''} — an AskBiz admin will review it. You can update your details and documents any time before a decision is made.
        </p>
      </div>
    )
  }
  if (verification.status === 'approved') {
    return (
      <div className="border border-signal-600 bg-signal-500/10 rounded-xl p-5 flex items-center gap-3">
        <CheckBadge className="w-8 h-8 flex-shrink-0 text-signal-400" />
        <div>
          <p className="text-signal-300 text-sm font-medium mb-1">Verified business</p>
          <p className="text-ink-300 text-xs">
            Your badge is live on the Connections consent screen, and your API keys now have 3× their plan&rsquo;s rate limits.
          </p>
        </div>
      </div>
    )
  }
  return (
    <div className="border border-red-900 bg-red-950/30 rounded-xl p-5">
      <p className="text-red-300 text-sm font-medium mb-1">Not approved</p>
      {verification.rejection_reason && <p className="text-red-200/80 text-xs mb-1">{verification.rejection_reason}</p>}
      <p className="text-ink-400 text-xs">Update your details and documents below and resubmit.</p>
    </div>
  )
}

function DetailsForm({ verification, onSaved }: { verification: Verification; onSaved: () => void }) {
  const [legalName, setLegalName] = useState(verification?.legal_name || '')
  const [registrationNumber, setRegistrationNumber] = useState(verification?.registration_number || '')
  const [taxId, setTaxId] = useState(verification?.tax_id || '')
  const [address, setAddress] = useState(verification?.address || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    setError(''); setSuccess(false)
    if (!legalName.trim() || !registrationNumber.trim() || !address.trim()) {
      setError('Legal name, registration number, and address are required'); return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/dashboard-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ legal_name: legalName, registration_number: registrationNumber, tax_id: taxId, address }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not save business details')
      setSuccess(true)
      onSaved()
    } catch (e: any) {
      setError(e.message || 'Could not save business details')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={cardCls}>
      <h2 className="font-display text-base font-bold mb-1">Business details</h2>
      <p className="text-ink-400 text-xs mb-5">Used only for verification review — not shown publicly.</p>
      <div className="space-y-3 max-w-md">
        <div>
          <label htmlFor="legal-name" className={labelCls}>Legal business name</label>
          <input id="legal-name" value={legalName} onChange={e => setLegalName(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label htmlFor="registration-number" className={labelCls}>Registration number</label>
          <input id="registration-number" value={registrationNumber} onChange={e => setRegistrationNumber(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label htmlFor="tax-id" className={labelCls}>Tax ID <span className="text-ink-500">(optional)</span></label>
          <input id="tax-id" value={taxId} onChange={e => setTaxId(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label htmlFor="address" className={labelCls}>Business address</label>
          <textarea id="address" value={address} onChange={e => setAddress(e.target.value)} rows={2} className={inputCls} />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-signal-300 text-sm">Saved.</p>}
        <button onClick={handleSubmit} disabled={saving} className={primaryBtnCls}>
          {saving ? 'Saving…' : verification ? 'Update details' : 'Submit for review'}
        </button>
      </div>
    </div>
  )
}

function DocumentsCard({ verificationId, documents, onUploaded }: { verificationId: string | null; documents: Document[]; onUploaded: () => void }) {
  const [uploading, setUploading] = useState<string | null>(null)
  const [error, setError] = useState('')

  const handleFile = (kind: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setError('')
    const reader = new FileReader()
    reader.onload = async ev => {
      const dataUrl = ev.target?.result as string
      setUploading(kind)
      try {
        const res = await fetch('/api/dashboard-verification/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: dataUrl, kind }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Could not upload document')
        onUploaded()
      } catch (err: any) {
        setError(err.message || 'Could not upload document')
      } finally {
        setUploading(null)
      }
    }
    reader.readAsDataURL(file)
  }

  const uploadedKinds = new Set(documents.map(d => d.kind))

  return (
    <div className={cardCls}>
      <h2 className="font-display text-base font-bold mb-1">Supporting documents</h2>
      <p className="text-ink-400 text-xs mb-5">
        {verificationId
          ? 'Photos are fine — a clear, readable shot of each document is all that’s needed.'
          : 'Save your business details above first, then upload documents here.'}
      </p>
      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
      <div className="space-y-3">
        {DOCUMENT_KINDS.map(d => {
          const done = uploadedKinds.has(d.kind)
          return (
            <div key={d.kind} className="flex items-center justify-between gap-3 border-b border-ink-800 pb-3 last:border-0 last:pb-0">
              <div className="min-w-0">
                <p className="text-sm text-ink-100 font-medium">{d.label}</p>
                <p className="text-ink-500 text-xs">{d.hint}</p>
              </div>
              <label className={`flex-shrink-0 cursor-pointer ${ghostBtnCls} ${!verificationId ? 'pointer-events-none opacity-50' : ''}`}>
                {uploading === d.kind ? 'Uploading…' : done ? 'Replace' : 'Upload'}
                <input type="file" accept="image/*" className="sr-only" disabled={!verificationId || uploading !== null} onChange={handleFile(d.kind)} />
              </label>
              {done && <CheckBadge className="w-4 h-4 flex-shrink-0 text-signal-400" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function UnlocksPanel() {
  return (
    <div className={cardCls}>
      <h2 className="font-display text-base font-bold mb-3">What verification unlocks</h2>
      <div className="space-y-3">
        {UNLOCKS.map(u => (
          <div key={u.title} className="flex items-start gap-2.5">
            <CheckBadge className="w-4 h-4 flex-shrink-0 text-ink-500 mt-0.5" />
            <div>
              <p className="text-sm text-ink-100 font-medium">{u.title}</p>
              <p className="text-ink-400 text-xs">{u.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CheckBadge({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 1.4 2.8-.3 1.2 2.5 2.5 1.2-.3 2.8L22 12l-1.4 2.4.3 2.8-2.5 1.2-1.2 2.5-2.8-.3L12 22l-2.4-1.4-2.8.3-1.2-2.5-2.5-1.2.3-2.8L2 12l1.4-2.4-.3-2.8 2.5-1.2 1.2-2.5 2.8.3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  )
}
