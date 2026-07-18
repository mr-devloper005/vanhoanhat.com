'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { getTaskTheme } from '@/editable/theme/task-themes'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      {/* CTA strip — mirrors the reference's blue full-width bar. */}
      <section className="bg-[var(--slot4-accent-fill)]">
        <div className="mx-auto flex w-full max-w-[var(--editable-container)] flex-col items-start justify-between gap-6 px-5 py-14 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">
              Join the community
            </p>
            <h2 className="editable-display mt-3 max-w-2xl text-[28px] font-bold leading-tight tracking-[-0.02em] text-white sm:text-[36px]">
              Contribute a listing, upload a reference, or open a conversation with us.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/create"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[2px] bg-white px-6 text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--slot4-accent-dark)] transition hover:bg-[var(--slot4-warm)]"
            >
              Submit yours <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[2px] border border-white/60 px-6 text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-white/10"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-[var(--editable-container)] gap-12 px-5 py-16 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center border border-white/25 bg-white/5">
              <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-8 w-8 object-contain" />
            </span>
            <span className="editable-display text-[22px] font-bold tracking-[-0.01em] text-white">
              {SITE_CONFIG.name}
            </span>
          </Link>
          <p className="mt-5 max-w-md text-[15px] leading-[1.7] text-white/70">
            {globalContent.footer?.description || SITE_CONFIG.description}
          </p>
         
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
            Discover
          </h3>
          <div className="mt-5 grid gap-3">
            {taskLinks.map((task) => {
              const theme = getTaskTheme(task.key)
              return (
                <Link
                  key={task.key}
                  href={task.route}
                  className="inline-flex items-center gap-2 text-[15px] font-medium text-white/85 transition hover:text-white"
                >
                  {theme.kicker} <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
                </Link>
              )
            })}
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
            Resources
          </h3>
          <div className="mt-5 grid gap-3">
            <Link href="/about" className="text-[15px] font-medium text-white/85 hover:text-white">About</Link>
            <Link href="/contact" className="text-[15px] font-medium text-white/85 hover:text-white">Contact</Link>
            <Link href="/search" className="text-[15px] font-medium text-white/85 hover:text-white">Search</Link>
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
            Account
          </h3>
          <div className="mt-5 grid gap-3">
            {session ? (
              <>
                <Link href="/create" className="text-[15px] font-medium text-white/85 hover:text-white">Submit a post</Link>
                <button
                  type="button"
                  onClick={logout}
                  className="text-left text-[15px] font-medium text-white/85 hover:text-white"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-[15px] font-medium text-white/85 hover:text-white">Sign in</Link>
                <Link href="/signup" className="text-[15px] font-medium text-white/85 hover:text-white">Get started</Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[var(--editable-container)] flex-col items-start justify-between gap-3 px-5 py-6 text-[12px] font-medium tracking-[0.12em] text-white/55 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <span>© {year} {SITE_CONFIG.name}. All rights reserved.</span>
          <span className="uppercase">{globalContent.footer?.bottomNote || 'Independent editorial platform'}</span>
        </div>
      </div>
    </footer>
  )
}
