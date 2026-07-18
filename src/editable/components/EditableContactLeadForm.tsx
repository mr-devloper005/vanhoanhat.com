'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export function EditableContactLeadForm() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setMessage('')
    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data?.message || 'Unable to send your message.')
      setStatus('success')
      setMessage(data?.message || 'Thanks. Your message has been received.')
      form.reset()
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Unable to send your message.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Field name="name" label="Full name" placeholder="Your name" required />
        <Field name="email" type="email" label="Email address" placeholder="you@example.com" required />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field name="phone" label="Phone number" placeholder="Optional" />
        <Field name="subject" label="Subject" placeholder="How can we help?" />
      </div>
      <label className="grid gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]">
          Message
        </span>
        <textarea
          name="message"
          required
          rows={6}
          placeholder="Tell us what you need help with…"
          className="w-full resize-y rounded-[2px] border border-[var(--editable-border)] bg-white px-4 py-3 text-[15px] leading-[1.7] text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--slot4-accent)]"
        />
      </label>
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {message ? (
        <div
          className={`flex items-start gap-3 border px-4 py-3 text-[13px] font-medium ${
            status === 'success'
              ? 'border-[var(--slot4-accent)] bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent-dark)]'
              : 'border-[#c44] bg-[#fbeaea] text-[#8a1f1f]'
          }`}
        >
          {status === 'success' ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <span>{message}</span>
        </div>
      ) : null}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-[2px] bg-[var(--slot4-accent-fill)] px-6 text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition duration-300 hover:bg-[var(--slot4-accent-hover)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === 'submitting' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Send message
      </button>
    </form>
  )
}

function Field({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
}: {
  name: string
  label: string
  type?: string
  placeholder?: string
  required?: boolean
}) {
  return (
    <label className="grid gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="h-12 rounded-[2px] border border-[var(--editable-border)] bg-white px-4 text-[15px] text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--slot4-accent)]"
      />
    </label>
  )
}
