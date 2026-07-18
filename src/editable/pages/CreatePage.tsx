'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowUpRight,
  Bookmark,
  Building2,
  CheckCircle2,
  FileText,
  ImageIcon,
  Lock,
  PlusCircle,
  Send,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { getTaskTheme } from '@/editable/theme/task-themes'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const taskIcon: Record<TaskKey, typeof FileText> = {
  article: FileText,
  listing: Building2,
  classified: PlusCircle,
  image: ImageIcon,
  profile: UserRound,
  pdf: FileText,
  sbm: Bookmark,
}

const fieldClass =
  'w-full rounded-[2px] border border-[var(--editable-border)] bg-white px-4 py-3 text-[15px] text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--slot4-accent)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((t) => t.enabled), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTheme = getTaskTheme(task)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    const locked = pagesContent.create.locked
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-[var(--slot4-warm)]">
          <section className="mx-auto grid min-h-[calc(100vh-8rem)] w-full max-w-[var(--editable-container)] items-center gap-14 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-[0.9fr_1fr] lg:px-8">
            <EditableReveal index={0}>
              <div className="flex aspect-[4/5] w-full items-center justify-center bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]">
                <Lock className="h-16 w-16 opacity-70" />
              </div>
            </EditableReveal>
            <EditableReveal index={1}>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent)]">
                  {locked.badge}
                </p>
                <h1 className="editable-display mt-6 max-w-xl text-balance text-[40px] font-bold leading-[1.05] tracking-[-0.02em] sm:text-[56px] lg:text-[64px]">
                  {locked.title}
                </h1>
                <p className="editable-emphasis mt-8 max-w-xl text-[19px] leading-[1.6] italic text-[var(--slot4-muted-text)]">
                  {locked.description}
                </p>
                <div className="mt-10 flex flex-wrap gap-3">
                  <Link href="/login" className={dc.button.primary}>
                    Sign in <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link href="/signup" className={dc.button.secondary}>
                    Get started
                  </Link>
                </div>
              </div>
            </EditableReveal>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  const hero = pagesContent.create.hero
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="border-b border-[var(--editable-border)] bg-[var(--slot4-warm)]">
          <div className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
            <EditableReveal index={0}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent)]">
                {hero.badge} · {session.name}
              </p>
            </EditableReveal>
            <EditableReveal index={1}>
              <h1 className="editable-display mt-6 max-w-3xl text-balance text-[36px] font-bold leading-[1.05] tracking-[-0.02em] sm:text-[52px] lg:text-[60px]">
                {hero.title}
              </h1>
            </EditableReveal>
            <EditableReveal index={2}>
              <p className="editable-emphasis mt-6 max-w-2xl text-[19px] leading-[1.6] italic text-[var(--slot4-muted-text)]">
                {hero.description}
              </p>
            </EditableReveal>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent)]">
                Choose an entry type
              </p>
              <div className="mt-5 grid gap-3">
                {enabledTasks.map((item) => {
                  const Icon = taskIcon[item.key] || FileText
                  const theme = getTaskTheme(item.key)
                  const active = item.key === task
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setTask(item.key)}
                      className={`flex items-start gap-3 border p-4 text-left transition ${
                        active
                          ? 'border-[var(--slot4-accent)] bg-white text-[var(--slot4-page-text)]'
                          : 'border-[var(--editable-border)] bg-white hover:border-[var(--slot4-accent)]'
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center ${
                          active
                            ? 'bg-[var(--slot4-accent-fill)] text-white'
                            : 'bg-[var(--slot4-warm)] text-[var(--slot4-accent)]'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="editable-display block text-[16px] font-bold leading-tight tracking-[-0.01em]">
                          {theme.kicker}
                        </span>
                        <span className="mt-1 block text-[12px] leading-[1.5] text-[var(--slot4-muted-text)]">
                          {theme.note}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </aside>

            <form onSubmit={submit} className="min-w-0 border border-[var(--editable-border)] bg-white p-6 sm:p-10">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--editable-border)] pb-6">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent)]">
                    {pagesContent.create.formTitle}
                  </p>
                  <h2 className="editable-display mt-3 text-[28px] font-bold leading-tight tracking-[-0.02em]">
                    New {activeTheme.kicker.toLowerCase()} entry
                  </h2>
                </div>
                <span className="rounded-full border border-[var(--editable-border)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">
                  <Sparkles className="mr-1.5 inline h-3.5 w-3.5 text-[var(--slot4-accent)]" />
                  Draft saved locally
                </span>
              </div>

              <div className="mt-8 grid gap-5">
                <Field label="Title">
                  <input
                    className={fieldClass}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Give the entry a headline"
                    required
                  />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Category">
                    <input
                      className={fieldClass}
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. Cafés, Reports"
                    />
                  </Field>
                  <Field label="Source URL">
                    <input
                      className={fieldClass}
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="Website or file URL"
                    />
                  </Field>
                </div>
                <Field label="Featured image URL">
                  <input
                    className={fieldClass}
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Optional — links only, no uploads"
                  />
                </Field>
                <Field label="Short summary">
                  <textarea
                    className={`${fieldClass} min-h-[110px] resize-y`}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="One or two lines an editor would see first"
                    required
                  />
                </Field>
                <Field label="Body">
                  <textarea
                    className={`${fieldClass} min-h-[220px] resize-y`}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Details, notes, references. Markdown-safe."
                    required
                  />
                </Field>
              </div>

              {created ? (
                <div className="mt-6 flex items-start gap-3 border border-[var(--slot4-accent)] bg-[var(--slot4-accent-soft)] p-4 text-[var(--slot4-accent-dark)]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <p className="editable-display text-[16px] font-bold">{pagesContent.create.successTitle}</p>
                    <p className="mt-1 text-[13px] font-medium">{created.title}</p>
                  </div>
                </div>
              ) : null}

              <button type="submit" className={`${dc.button.accent} mt-8 w-full sm:w-auto`}>
                <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
              </button>
            </form>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]">
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  )
}
