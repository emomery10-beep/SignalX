'use client'
import { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react'
import { tokens, radius } from './tokens'

const fieldStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  borderRadius: radius.sm,
  border: `1px solid ${tokens.border}`,
  background: tokens.surface,
  color: tokens.ink,
  fontSize: 14,
  fontFamily: 'inherit',
  // border-color transition + focus ring come from globals.css
  // (input:focus, *:focus-visible) — no local transition needed.
}

function Wrapper({ label, hint, required, children }: { label?: string; hint?: string; required?: boolean; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: tokens.muted, marginBottom: 6 }}>
          {label}{required && <span style={{ color: tokens.danger }}> *</span>}
        </label>
      )}
      {children}
      {hint && <p style={{ margin: '6px 0 0', fontSize: 12.5, color: tokens.hint }}>{hint}</p>}
    </div>
  )
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string; hint?: string; required?: boolean
}
export function Input({ label, hint, required, style, ...rest }: InputProps) {
  return <Wrapper label={label} hint={hint} required={required}><input style={{ ...fieldStyle, ...style }} {...rest} /></Wrapper>
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string; hint?: string; required?: boolean
}
export function Textarea({ label, hint, required, style, ...rest }: TextareaProps) {
  return <Wrapper label={label} hint={hint} required={required}><textarea style={{ ...fieldStyle, resize: 'vertical', minHeight: 72, ...style }} {...rest} /></Wrapper>
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string; hint?: string; required?: boolean
}
export function Select({ label, hint, required, style, children, ...rest }: SelectProps) {
  return <Wrapper label={label} hint={hint} required={required}><select style={{ ...fieldStyle, ...style }} {...rest}>{children}</select></Wrapper>
}
