'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

// Static (non-task) links only. Task archive pages are NOT surfaced from the
// navbar — the footer is where discovery lives.
const staticLinks: { label: string; href: string }[] = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--editable-border)] bg-[var(--editable-nav-bg)]/95 text-[var(--editable-nav-text)] backdrop-blur-md">
      {/* Thin promo strip — reference has a dark tagline strip above the nav. */}
      <div className="hidden bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)] md:block">
        <div className="mx-auto flex w-full max-w-[var(--editable-container)] items-center justify-between px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.22em]">
          <span>{globalContent.nav?.tagline || SITE_CONFIG.tagline}</span>
          <span className="opacity-70">{SITE_CONFIG.name}</span>
        </div>
      </div>

      <nav className="mx-auto flex min-h-[76px] w-full max-w-[var(--editable-container)] items-center gap-6 px-5 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition group-hover:border-[var(--slot4-accent)]">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-8 w-8 object-contain" />
          </span>
          <span className="min-w-0">
            <span className="editable-display block max-w-[220px] truncate text-[22px] font-bold leading-none tracking-[-0.01em]">
              {SITE_CONFIG.name}
            </span>
            <span className="mt-1 hidden max-w-[220px] truncate text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-muted-text)] md:block">
              {globalContent.nav?.tagline || SITE_CONFIG.tagline}
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {staticLinks.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.22em] transition ${
                  active
                    ? 'text-[var(--slot4-accent)]'
                    : 'text-[var(--slot4-page-text)] hover:text-[var(--slot4-accent)]'
                }`}
              >
                {item.label}
                {active ? <span className="absolute inset-x-4 -bottom-1 h-[2px] bg-[var(--slot4-accent)]" /> : null}
              </Link>
            )
          })}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            href="/search"
            aria-label="Search"
            className="hidden h-11 w-11 items-center justify-center border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] sm:inline-flex"
          >
            <Search className="h-4 w-4" />
          </Link>

          {session ? (
            <>
              <Link
                href="/create"
                className="hidden h-11 items-center gap-2 border border-[var(--editable-border)] bg-transparent px-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] sm:inline-flex"
              >
                Submit
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden h-11 items-center gap-2 bg-[var(--editable-cta-bg)] px-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--editable-cta-text)] transition hover:opacity-90 sm:inline-flex"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden h-11 items-center gap-2 border border-[var(--editable-border)] px-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="hidden h-11 items-center gap-2 bg-[var(--editable-cta-bg)] px-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--editable-cta-text)] transition hover:opacity-90 sm:inline-flex"
              >
                Get started
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-11 w-11 items-center justify-center border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-[var(--editable-nav-bg)] px-5 py-5 lg:hidden">
          <Link
            href="/search"
            onClick={() => setOpen(false)}
            className="mb-5 flex items-center gap-2 border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 py-3 text-sm font-semibold text-[var(--slot4-muted-text)]"
          >
            <Search className="h-4 w-4" /> Search
          </Link>
          <div className="grid gap-1">
            {[
              { label: 'Home', href: '/' },
              ...staticLinks,
              ...(session
                ? [
                    { label: 'Submit', href: '/create' },
                    { label: 'Logout', href: '#logout' },
                  ]
                : [
                    { label: 'Sign in', href: '/login' },
                    { label: 'Get started', href: '/signup' },
                  ]),
            ].map((item) => {
              const isLogout = item.href === '#logout'
              const active = !isLogout && (pathname === item.href || pathname.startsWith(`${item.href}/`))
              if (isLogout) {
                return (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => {
                      setOpen(false)
                      logout()
                    }}
                    className="border-l-2 border-transparent px-4 py-3 text-left text-sm font-semibold uppercase tracking-[0.16em] text-[var(--slot4-muted-text)] hover:border-[var(--slot4-accent)]/50 hover:bg-[var(--slot4-surface-bg)]"
                  >
                    {item.label}
                  </button>
                )
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`border-l-2 px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] ${
                    active
                      ? 'border-[var(--slot4-accent)] bg-[var(--slot4-surface-bg)] text-[var(--slot4-accent)]'
                      : 'border-transparent text-[var(--slot4-page-text)] hover:border-[var(--slot4-accent)]/50 hover:bg-[var(--slot4-surface-bg)]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      ) : null}
    </header>
  )
}
