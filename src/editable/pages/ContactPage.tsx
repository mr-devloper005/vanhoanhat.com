'use client'

import { Building2, FileText, Mail, MapPin, MessageSquare, Sparkles } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { SITE_CONFIG } from '@/lib/site-config'

const lanes = [
  {
    icon: Building2,
    title: 'Suggest a directory listing',
    body: 'Tell us about a place worth adding. Editors will visit or verify before it lands on the directory.',
  },
  {
    icon: FileText,
    title: 'Contribute a reference',
    body: 'Share a report, guide, or reference file for the library. Attach a link or send it after we reply.',
  },
  {
    icon: MessageSquare,
    title: 'Editorial questions',
    body: 'Fixes, corrections, or a note about how we curate — we read everything and reply personally.',
  },
  {
    icon: Sparkles,
    title: 'Partnerships',
    body: 'Local guides, community projects, or long-form collaborations. Tell us what you’re building.',
  },
]

export default function ContactPage() {
  const content = pagesContent.contact
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="border-b border-[var(--editable-border)] bg-[var(--slot4-warm)]">
          <div className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-16 sm:px-6 sm:py-24 lg:px-8">
            <EditableReveal index={0}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent)]">
                {content.eyebrow}
              </p>
            </EditableReveal>
            <EditableReveal index={1}>
              <h1 className="editable-display mt-6 max-w-3xl text-balance text-[40px] font-bold leading-[1.05] tracking-[-0.02em] sm:text-[56px] lg:text-[64px]">
                {content.title}
              </h1>
            </EditableReveal>
            <EditableReveal index={2}>
              <p className="editable-emphasis mt-8 max-w-2xl text-[20px] leading-[1.6] italic text-[var(--slot4-muted-text)]">
                {content.description}
              </p>
            </EditableReveal>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_460px]">
            <div className="min-w-0">
              <EditableReveal index={0}>
                <h2 className="editable-display text-[28px] font-bold leading-[1.15] tracking-[-0.02em] sm:text-[32px]">
                  Which lane fits?
                </h2>
              </EditableReveal>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {lanes.map((lane, i) => (
                  <EditableReveal key={lane.title} index={i}>
                    <div className="border border-[var(--editable-border)] bg-white p-6">
                      <span className="flex h-10 w-10 items-center justify-center bg-[var(--slot4-warm)] text-[var(--slot4-accent)]">
                        <lane.icon className="h-5 w-5" />
                      </span>
                      <h3 className="editable-display mt-4 text-[19px] font-bold leading-tight tracking-[-0.01em]">
                        {lane.title}
                      </h3>
                      <p className="mt-3 text-[14px] leading-[1.7] text-[var(--slot4-muted-text)]">{lane.body}</p>
                    </div>
                  </EditableReveal>
                ))}
              </div>
              <EditableReveal index={4} className="mt-10 border-t border-[var(--editable-border)] pt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent)]">
                  Other ways to reach us
                </p>
                <div className="mt-4 grid gap-3 text-[14px] font-medium text-[var(--slot4-page-text)]">
                  <a href={`mailto:hello@${SITE_CONFIG.domain}`} className="inline-flex items-center gap-2 hover:text-[var(--slot4-accent)]">
                    <Mail className="h-4 w-4 text-[var(--slot4-accent)]" /> hello@{SITE_CONFIG.domain}
                  </a>
                  <span className="inline-flex items-center gap-2 text-[var(--slot4-muted-text)]">
                    <MapPin className="h-4 w-4 text-[var(--slot4-accent)]" /> Independently published, editorially reviewed
                  </span>
                </div>
              </EditableReveal>
            </div>

            <EditableReveal index={0} className="lg:sticky lg:top-24 lg:self-start">
              <div className="border border-[var(--editable-border)] bg-white p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent)]">
                  {content.formTitle}
                </p>
                <h2 className="editable-display mt-3 text-[26px] font-bold leading-tight tracking-[-0.02em]">
                  Write to the editors
                </h2>
                <div className="mt-6">
                  <EditableContactLeadForm />
                </div>
              </div>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
