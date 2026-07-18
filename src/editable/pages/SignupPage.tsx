import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableReveal } from '@/editable/shell/EditableReveal'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/signup',
    title: 'Get started',
    description: pagesContent.auth.signup.metadataDescription,
  })
}

export default function SignupPage() {
  const content = pagesContent.auth.signup
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-warm)] text-[var(--slot4-page-text)]">
        <section className="mx-auto grid min-h-[calc(100vh-8rem)] w-full max-w-[var(--editable-container)] items-center gap-14 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-[0.9fr_1fr] lg:px-8">
          <EditableReveal index={0}>
            <div className="border border-[var(--editable-border)] bg-white p-7 sm:p-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent)]">
                Contributor access
              </p>
              <h1 className="editable-display mt-3 text-[28px] font-bold leading-tight tracking-[-0.02em]">
                {content.formTitle}
              </h1>
              <div className="mt-6">
                <EditableLocalSignupForm />
              </div>
              <p className="mt-8 border-t border-[var(--editable-border)] pt-6 text-[14px] text-[var(--slot4-muted-text)]">
                Already a contributor?{' '}
                <Link
                  href="/login"
                  className="editable-underline-ochre font-semibold text-[var(--slot4-page-text)]"
                >
                  {content.loginCta}
                </Link>
              </p>
            </div>
          </EditableReveal>

          <EditableReveal index={1}>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent)]">
                {content.badge}
              </p>
              <h2 className="editable-display mt-6 max-w-xl text-balance text-[40px] font-bold leading-[1.05] tracking-[-0.02em] sm:text-[56px] lg:text-[64px]">
                {content.title}
              </h2>
              <p className="editable-emphasis mt-8 max-w-xl text-[19px] leading-[1.6] italic text-[var(--slot4-muted-text)]">
                {content.description}
              </p>
              <ul className="mt-10 space-y-3 border-t border-[var(--editable-border)] pt-6">
                {[
                  'Submit places for the directory — editors review each one.',
                  'Upload references to the library — files stay downloadable.',
                  'Add tags and short notes so entries land in the right shelf.',
                ].map((line, i) => (
                  <li
                    key={line}
                    className="flex items-start gap-4 text-[15px] leading-[1.7] text-[var(--slot4-page-text)]"
                  >
                    <span className="editable-display mt-0.5 text-[13px] font-black text-[var(--slot4-accent)]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
