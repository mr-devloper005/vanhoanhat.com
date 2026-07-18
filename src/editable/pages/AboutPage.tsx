import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'

export default function AboutPage() {
  const content = pagesContent.about
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        {/* Editorial banner */}
        <section className="border-b border-[var(--editable-border)] bg-[var(--slot4-warm)]">
          <div className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-16 sm:px-6 sm:py-24 lg:px-8">
            <EditableReveal index={0}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent)]">
                {content.badge}
              </p>
            </EditableReveal>
            <EditableReveal index={1}>
              <h1 className="editable-display mt-6 max-w-4xl text-balance text-[40px] font-bold leading-[1.05] tracking-[-0.02em] sm:text-[56px] lg:text-[68px]">
                {content.title}
              </h1>
            </EditableReveal>
            <EditableReveal index={2}>
              <p className="editable-emphasis mt-8 max-w-3xl text-[20px] leading-[1.6] italic text-[var(--slot4-muted-text)]">
                {content.description}
              </p>
            </EditableReveal>
          </div>
        </section>

        {/* Body + values sidebar */}
        <section className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
            <article className="min-w-0">
              <EditableReveal index={0}>
                <h2 className="editable-display text-[30px] font-bold leading-[1.15] tracking-[-0.02em] sm:text-[36px]">
                  Why {SITE_CONFIG.name} exists
                </h2>
              </EditableReveal>
              <div className="mt-8 space-y-6 text-[17px] leading-[1.8] text-[var(--slot4-page-text)]">
                {content.paragraphs.map((paragraph, i) => (
                  <EditableReveal key={paragraph} index={i}>
                    <p className="editable-underline-ochre">{paragraph}</p>
                  </EditableReveal>
                ))}
              </div>
            </article>

            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              {content.values.map((value, i) => (
                <EditableReveal key={value.title} index={i}>
                  <div className="border border-[var(--editable-border)] bg-white p-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent)]">
                      Value 0{i + 1}
                    </p>
                    <h3 className="editable-display mt-3 text-[22px] font-bold leading-tight tracking-[-0.01em]">
                      {value.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-[1.7] text-[var(--slot4-muted-text)]">
                      {value.description}
                    </p>
                  </div>
                </EditableReveal>
              ))}
            </aside>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
