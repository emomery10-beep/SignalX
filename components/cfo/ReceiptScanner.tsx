'use client'
import { useState, useRef } from 'react'
import { useLang } from '@/components/LanguageProvider'

const INDIGO = '#6366F1'
const GREEN = '#22C55E'
const RED = '#EF4444'
const YELLOW = '#F59E0B'

export const EXPENSE_CATEGORIES = [
  'Supplier / Stock Purchase',
  'Rent / Lease', 'Payroll', 'Utilities', 'Software / SaaS', 'Marketing & Ads',
  'Supplies', 'Travel', 'Meals & Entertainment', 'Shipping', 'Professional Services',
  'Equipment', 'Insurance', 'Taxes & Fees', 'Other',
]

// Expense categories that represent cost of goods — routed to COGS, not fixed costs
export const COGS_EXPENSE_CATEGORIES = new Set(['Supplier / Stock Purchase'])

export interface ScannedExpense {
  vendor: string
  date: string
  amount: number
  category: string
  notes: string
  confidence: number
}

// Maps the canonical English category value to its i18n key suffix
const CAT_KEY: Record<string, string> = {
  'Supplier / Stock Purchase': 'catSupplierStock',
  'Rent / Lease':              'catRentLease',
  'Payroll':                   'catPayroll',
  'Utilities':                 'catUtilities',
  'Software / SaaS':           'catSoftwareSaas',
  'Marketing & Ads':           'catMarketingAds',
  'Supplies':                  'catSupplies',
  'Travel':                    'catTravel',
  'Meals & Entertainment':     'catMealsEntertainment',
  'Shipping':                  'catShipping',
  'Professional Services':     'catProfessionalServices',
  'Equipment':                 'catEquipment',
  'Insurance':                 'catInsurance',
  'Taxes & Fees':              'catTaxesFees',
  'Other':                     'catOther',
}

interface Props {
  currencySymbol: string
  onConfirm: (expense: ScannedExpense) => void
  onCancel: () => void
}

export default function ReceiptScanner({ currencySymbol: sym, onConfirm, onCancel }: Props) {
  const { tc } = useLang()
  const [stage, setStage] = useState<'capture' | 'scanning' | 'review' | 'error'>('capture')
  const [preview, setPreview] = useState<string | null>(null)
  const [scanned, setScanned] = useState<ScannedExpense | null>(null)
  const [editedExpense, setEditedExpense] = useState<ScannedExpense | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  // Compress image to max 1280px / JPEG 0.85 before sending.
  // Mobile camera photos are 3-8MB — base64 pushes them past Vercel's 4.5MB body limit.
  // After compression they're typically 150-300KB, well within limits and fine for OCR.
  const compressImage = (file: File): Promise<{ base64: string; previewUrl: string }> =>
    new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file)
      const img = new Image()
      img.onload = () => {
        URL.revokeObjectURL(url)
        const MAX = 1280
        let { width, height } = img
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round(height * MAX / width); width = MAX }
          else { width = Math.round(width * MAX / height); height = MAX }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width; canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) { reject(new Error('Canvas not supported')); return }
        ctx.drawImage(img, 0, 0, width, height)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
        resolve({ base64: dataUrl.split(',')[1], previewUrl: dataUrl })
      }
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not load image')) }
      img.src = url
    })

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) { setErrorMsg(tc('cfo_receipts.errNotImage')); setStage('error'); return }
    if (file.size > 20 * 1024 * 1024) { setErrorMsg(tc('cfo_receipts.errTooLarge')); setStage('error'); return }

    setStage('scanning')
    try {
      const { base64, previewUrl } = await compressImage(file)
      setPreview(previewUrl)
      const res = await fetch('/api/cfo/scan-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mediaType: 'image/jpeg' }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      const expense: ScannedExpense = {
        vendor: data.vendor || '',
        date: data.date || new Date().toISOString().split('T')[0],
        amount: data.amount || 0,
        category: data.category || 'Other',
        notes: data.notes || '',
        confidence: data.confidence || 0,
      }
      setScanned(expense)
      setEditedExpense({ ...expense })
      setStage('review')
    } catch (err: any) {
      setErrorMsg(err.message || tc('cfo_receipts.errScanFailed'))
      setStage('error')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', fontSize: 11, color: 'var(--tx)', background: 'var(--ev)',
    border: '1px solid var(--b)', borderRadius: 8, padding: '8px 10px',
    fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
  }

  return (
    <div style={{ background: 'var(--bg)', borderRadius: 14, border: '1px solid var(--b)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>📷</span>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_receipts.headerTitle')}</div>
            <div style={{ fontSize: 9, color: 'var(--tx3)' }}>{tc('cfo_receipts.headerSubtitle')}</div>
          </div>
        </div>
        <button onClick={onCancel} style={{ width: 28, height: 28, borderRadius: 7, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx3)', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
      </div>

      <div style={{ padding: '18px' }}>
        {/* CAPTURE STAGE */}
        {stage === 'capture' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              {/* Camera button */}
              <button
                onClick={() => cameraInputRef.current?.click()}
                style={{ padding: '20px', borderRadius: 12, border: `2px dashed ${INDIGO}50`, background: `${INDIGO}06`, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, fontFamily: 'inherit' }}
              >
                <span style={{ fontSize: 26 }}>📸</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: INDIGO }}>{tc('cfo_receipts.takePhoto')}</span>
                <span style={{ fontSize: 9, color: 'var(--tx3)' }}>{tc('cfo_receipts.takePhotoHint')}</span>
              </button>
              {/* Upload button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{ padding: '20px', borderRadius: 12, border: `2px dashed var(--b)`, background: 'var(--ev)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, fontFamily: 'inherit' }}
              >
                <span style={{ fontSize: 26 }}>🗂</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx)' }}>{tc('cfo_receipts.uploadFile')}</span>
                <span style={{ fontSize: 9, color: 'var(--tx3)' }}>{tc('cfo_receipts.uploadFileHint')}</span>
              </button>
            </div>
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
            <div style={{ fontSize: 9, color: 'var(--tx3)', textAlign: 'center', lineHeight: 1.5 }}>
              {tc('cfo_receipts.captureFooter')}
            </div>
          </div>
        )}

        {/* SCANNING STAGE */}
        {stage === 'scanning' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            {preview && (
              <div style={{ marginBottom: 14, borderRadius: 10, overflow: 'hidden', maxHeight: 200, display: 'flex', justifyContent: 'center' }}>
                <img src={preview} alt={tc('cfo_receipts.receiptImgAlt')} style={{ maxHeight: 200, maxWidth: '100%', objectFit: 'contain', borderRadius: 10 }} />
              </div>
            )}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 10, background: `${INDIGO}10`, border: `1px solid ${INDIGO}30` }}>
              <span style={{ fontSize: 16, animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>
              <span style={{ fontSize: 10, color: INDIGO, fontWeight: 600 }}>{tc('cfo_receipts.scanningLabel')}</span>
            </div>
            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
          </div>
        )}

        {/* REVIEW STAGE */}
        {stage === 'review' && editedExpense && scanned && (
          <div>
            {preview && (
              <div style={{ marginBottom: 14, borderRadius: 10, overflow: 'hidden', maxHeight: 160, display: 'flex', justifyContent: 'center', background: 'var(--ev)' }}>
                <img src={preview} alt={tc('cfo_receipts.receiptImgAlt')} style={{ maxHeight: 160, maxWidth: '100%', objectFit: 'contain' }} />
              </div>
            )}

            {/* Confidence badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
              <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 9, fontWeight: 700, background: scanned.confidence >= 80 ? `${GREEN}20` : scanned.confidence >= 60 ? `${YELLOW}20` : `${RED}20`, color: scanned.confidence >= 80 ? GREEN : scanned.confidence >= 60 ? YELLOW : RED }}>
                {tc('cfo_receipts.confidenceBadge', { n: scanned.confidence })}
              </span>
              <span style={{ fontSize: 9, color: 'var(--tx3)' }}>
                {scanned.confidence >= 80 ? tc('cfo_receipts.confidenceGood') : scanned.confidence >= 60 ? tc('cfo_receipts.confidencePartial') : tc('cfo_receipts.confidenceLow')}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Vendor */}
              <div>
                <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 5 }}>{tc('cfo_receipts.labelVendor')}</label>
                <input value={editedExpense.vendor} onChange={e => setEditedExpense(p => p ? { ...p, vendor: e.target.value } : p)} placeholder={tc('cfo_receipts.placeholderVendor')} style={inputStyle} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
                {/* Date */}
                <div>
                  <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 5 }}>{tc('cfo_receipts.labelDate')}</label>
                  <input type="date" value={editedExpense.date} onChange={e => setEditedExpense(p => p ? { ...p, date: e.target.value } : p)} style={inputStyle} />
                </div>
                {/* Amount */}
                <div>
                  <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 5 }}>{tc('cfo_receipts.labelAmount', { sym })}</label>
                  <input type="number" min="0" step="0.01" value={editedExpense.amount || ''} onChange={e => setEditedExpense(p => p ? { ...p, amount: Number(e.target.value) } : p)} placeholder="0.00" style={inputStyle} />
                </div>
              </div>

              {/* Category */}
              <div>
                <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 5 }}>{tc('cfo_receipts.labelCategory')}</label>
                <select value={editedExpense.category} onChange={e => setEditedExpense(p => p ? { ...p, category: e.target.value } : p)} style={{ ...inputStyle, cursor: 'pointer' }}>
                  {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{tc('cfo_receipts.' + CAT_KEY[c])}</option>)}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label style={{ display: 'block', fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 5 }}>{tc('cfo_receipts.labelNotes')}</label>
                <input value={editedExpense.notes} onChange={e => setEditedExpense(p => p ? { ...p, notes: e.target.value } : p)} placeholder={tc('cfo_receipts.placeholderNotes')} style={inputStyle} />
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={() => { setStage('capture'); setPreview(null); setScanned(null) }} style={{ flex: 1, padding: '9px', borderRadius: 8, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx3)', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit' }}>
                {tc('cfo_receipts.btnScanAgain')}
              </button>
              <button
                onClick={() => editedExpense && onConfirm(editedExpense)}
                disabled={!editedExpense?.vendor || !editedExpense?.amount}
                style={{ flex: 2, padding: '9px', borderRadius: 8, border: 'none', background: INDIGO, color: '#fff', fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: (!editedExpense?.vendor || !editedExpense?.amount) ? 0.5 : 1 }}
              >
                {tc('cfo_receipts.btnSaveExpense')}
              </button>
            </div>
          </div>
        )}

        {/* ERROR STAGE */}
        {stage === 'error' && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{ fontSize: 30, marginBottom: 10 }}>⚠️</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx)', marginBottom: 6 }}>{tc('cfo_receipts.errorTitle')}</div>
            <div style={{ fontSize: 10, color: 'var(--tx3)', marginBottom: 16 }}>{errorMsg}</div>
            <button onClick={() => setStage('capture')} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: INDIGO, color: '#fff', fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              {tc('cfo_receipts.btnTryAgain')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
