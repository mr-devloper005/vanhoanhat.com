import Link from 'next/link'
import { ArrowRight, ArrowUpRight, MapPin, Search, Sparkles } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditablePostImage, getEditableExcerpt, getEditableCategory, postHref } from '@/editable/cards/PostCards'
import { getTaskTheme } from '@/editable/theme/task-themes'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-6 lg:px-8'
const containerWide = 'mx-auto w-full max-w-[var(--editable-container-wide)] px-5 sm:px-6 lg:px-8'

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

/* ============================================================
   1. Category banner — a colored ribbon with the huge serif h1
   ============================================================ */
export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  const featured = pool[0]
  const heroTitle = pagesContent.home.hero.title?.join(' ') || `An editorial home for ${SITE_CONFIG.name}`
  return (
    <>
      <section className="relative overflow-hidden bg-[var(--slot4-warm)]">
        <div className={`${container} py-16 sm:py-24 lg:py-[100px]`}>
          <EditableReveal index={0}>
            <p className={dc.type.eyebrow}>{pagesContent.home.hero.badge || 'A curated welcome'}</p>
          </EditableReveal>
          <EditableReveal index={1} as="header">
            <h1 className={`${dc.type.heroTitle} mt-6 max-w-4xl text-balance`}>
              {heroTitle}
            </h1>
          </EditableReveal>
          <EditableReveal index={2}>
            <p className="editable-emphasis mt-8 max-w-2xl text-[20px] leading-[1.6] italic text-[var(--slot4-muted-text)]">
              {pagesContent.home.hero.description}
            </p>
          </EditableReveal>
          <EditableReveal index={3}>
            <form
              action="/search"
              className="mt-10 flex w-full max-w-2xl overflow-hidden rounded-[2px] border border-[var(--editable-border-strong)] bg-white"
            >
              <label className="flex flex-1 items-center gap-3 px-5">
                <Search className="h-5 w-5 shrink-0 text-[var(--slot4-muted-text)]" />
                <input
                  name="q"
                  placeholder="Search directory listings and references…"
                  className="w-full bg-transparent py-4 text-[15px] text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
                />
              </label>
              <button className={`${dc.button.primary} h-auto rounded-none px-6 sm:px-8`}>
                Search
              </button>
            </form>
          </EditableReveal>
        </div>
      </section>

      {/* Wide 21:9 editorial hero card — mirrors the reference's featured card */}
      {featured ? (
        <section className={`${containerWide} pt-12 sm:pt-16`}>
          <EditableReveal index={0}>
            <Link
              href={postHref(primaryTask, featured, primaryRoute)}
              className="group block overflow-hidden"
            >
              <div className={`${dc.media.frameFull} ${dc.media.ratioWide}`}>
                <img
                  src={getEditablePostImage(featured)}
                  alt={featured.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-[600ms] group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(31,29,27,0.02)_0%,rgba(31,29,27,0.55)_60%,rgba(31,29,27,0.85)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-14">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/85">Featured today</span>
                  <h2 className="editable-display mt-4 max-w-3xl text-[28px] font-bold leading-[1.08] tracking-[-0.02em] text-white sm:text-[42px] lg:text-[56px]">
                    {featured.title}
                  </h2>
                  <p className="mt-4 max-w-2xl text-[15px] leading-[1.7] text-white/85">
                    {getEditableExcerpt(featured, 200)}
                  </p>
                  <span className="editable-label mt-6 inline-flex items-center gap-2 text-white">
                    Continue reading <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          </EditableReveal>
        </section>
      ) : null}
    </>
  )
}

/* ============================================================
   2. Three-column recent post grid
   ============================================================ */
export function EditableStoryRail({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)]).slice(1, 10)
  if (!pool.length) return null
  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className={`${containerWide} py-[80px] sm:py-[100px]`}>
        <EditableReveal index={0}>
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[var(--editable-border)] pb-6">
            <div>
              <p className={dc.type.eyebrow}>Recent posts</p>
              <h2 className={`${dc.type.sectionTitle} mt-3`}>The latest on {SITE_CONFIG.name}</h2>
            </div>
            <Link href={primaryRoute} className={`${dc.button.ghost}`}>
              See everything <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </EditableReveal>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {pool.slice(0, 9).map((post, i) => (
            <EditableReveal key={post.id || post.slug} index={i}>
              <RecentCard post={post} href={postHref(primaryTask, post, primaryRoute)} />
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function RecentCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group block">
      <div className={`${dc.media.frame} ${dc.media.ratio}`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-[500ms] group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>
      <p className={`${dc.type.eyebrow} mt-5`}>{getEditableCategory(post)}</p>
      <h3 className="editable-display mt-3 line-clamp-3 text-[24px] font-bold leading-[1.2] tracking-[-0.01em] text-[var(--slot4-page-text)]">
        <span className="editable-underline-ochre">{post.title}</span>
      </h3>
      <p className="mt-3 line-clamp-2 text-[15px] leading-[1.7] text-[var(--slot4-muted-text)]">
        {getEditableExcerpt(post, 140)}
      </p>
    </Link>
  )
}

/* ============================================================
   3. Blue full-width inline CTA banner
   ============================================================ */
export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  void primaryTask
  void posts
  void timeSections
  return (
    <section className="bg-[var(--slot4-accent-fill)] text-white">
      <div className={`${container} py-[80px] sm:py-[100px]`}>
        <EditableReveal index={0} className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">Discover what's near you</p>
            <h2 className="editable-display mt-4 text-[32px] font-bold leading-[1.1] tracking-[-0.02em] sm:text-[44px] lg:text-[52px]">
              A quiet directory for places that matter, and references worth keeping.
            </h2>
            <p className="mt-6 max-w-2xl text-[16px] leading-[1.7] text-white/85">
              {SITE_CONFIG.name} pairs a curated local directory with a downloadable reference library — no autoplay,
              no infinite scroll, just work worth returning to.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={primaryRoute}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[2px] bg-white px-6 text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--slot4-accent-dark)] transition hover:bg-[var(--slot4-warm)]"
            >
              Start exploring <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/create"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[2px] border border-white/60 px-6 text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-white/10"
            >
              Submit yours
            </Link>
          </div>
        </EditableReveal>
      </div>
    </section>
  )
}

/* ============================================================
   4. Time collections — two-column featured grid + tail rails
   ============================================================ */
const sectionCopy: Record<string, { eyebrow: string; title: string }> = {
  spotlight: { eyebrow: 'Fresh this week', title: 'New in the last seven days' },
  browse: { eyebrow: 'Trending', title: 'Reading the room this month' },
  index: { eyebrow: 'Evergreen', title: 'From the archive' },
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 8), href: primaryRoute },
          { key: 'browse', posts: posts.slice(8, 16), href: primaryRoute },
          { key: 'index', posts: posts.slice(16, 24), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])
  const visible = sections.filter((s) => s.posts.length)
  if (!visible.length) return null

  const [first, ...rest] = visible

  return (
    <>
      {first ? (
        <section className="bg-[var(--slot4-warm)]">
          <div className={`${containerWide} py-[80px] sm:py-[100px]`}>
            <EditableReveal index={0}>
              <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[var(--editable-border)] pb-6">
                <div>
                  <p className={dc.type.eyebrow}>{(sectionCopy[first.key] || { eyebrow: 'Discover' }).eyebrow}</p>
                  <h2 className={`${dc.type.sectionTitle} mt-3`}>
                    {(sectionCopy[first.key] || { title: 'More to explore' }).title}
                  </h2>
                </div>
                <Link href={first.href || primaryRoute} className={dc.button.ghost}>
                  See all <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </EditableReveal>
            <div className="mt-12 grid gap-12 lg:grid-cols-2">
              {first.posts.slice(0, 4).map((post, i) => (
                <EditableReveal key={post.id || post.slug} index={i}>
                  <FeatureTwoColCard post={post} href={postHref(primaryTask, post, primaryRoute)} />
                </EditableReveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {rest.map((section, index) => {
        const copy = sectionCopy[section.key] || { eyebrow: 'Discover', title: 'More to explore' }
        return (
          <section key={section.key} className={index % 2 === 0 ? 'bg-[var(--slot4-page-bg)]' : 'bg-[var(--slot4-warm)]'}>
            <div className={`${containerWide} py-[80px] sm:py-[100px]`}>
              <EditableReveal index={0}>
                <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[var(--editable-border)] pb-6">
                  <div>
                    <p className={dc.type.eyebrow}>{copy.eyebrow}</p>
                    <h2 className={`${dc.type.sectionTitle} mt-3`}>{copy.title}</h2>
                  </div>
                  <Link href={section.href || primaryRoute} className={dc.button.ghost}>
                    See all <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </EditableReveal>
              <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {section.posts.slice(0, 8).map((post, i) => (
                  <EditableReveal key={post.id || post.slug} index={i}>
                    <RecentCard post={post} href={postHref(primaryTask, post, primaryRoute)} />
                  </EditableReveal>
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}

function FeatureTwoColCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group block">
      <div className={`${dc.media.frame} ${dc.media.ratio}`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-[500ms] group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>
      <p className={`${dc.type.eyebrow} mt-6`}>{getEditableCategory(post)}</p>
      <h3 className="editable-display mt-4 line-clamp-3 text-[28px] font-bold leading-[1.15] tracking-[-0.01em] text-[var(--slot4-page-text)] sm:text-[32px]">
        <span className="editable-underline-ochre">{post.title}</span>
      </h3>
      <p className="mt-4 line-clamp-3 text-[16px] leading-[1.7] text-[var(--slot4-muted-text)]">
        {getEditableExcerpt(post, 200)}
      </p>
    </Link>
  )
}

/* ============================================================
   5. Category chip cluster — "Browse the shelves"
   ============================================================ */
function _BrowseChips({ primaryRoute }: { primaryRoute: string }) {
  void primaryRoute
  const enabled = SITE_CONFIG.tasks.filter((t) => t.enabled)
  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className={`${container} py-16 sm:py-20`}>
        <EditableReveal index={0}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className={dc.type.eyebrow}>Browse the shelves</p>
              <h2 className={`${dc.type.sectionTitle} mt-3`}>Two ways in</h2>
            </div>
          </div>
        </EditableReveal>
        <div className="mt-8 flex flex-wrap gap-3">
          {enabled.map((task, i) => {
            const theme = getTaskTheme(task.key)
            return (
              <EditableReveal key={task.key} index={i}>
                <Link
                  href={task.route}
                  className="group inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] bg-white px-5 py-2.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]"
                >
                  {theme.kicker}
                  <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </EditableReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
export const EditableBrowseChips = _BrowseChips

/* ============================================================
   6. Trust strip — subdued benefits row (data-derived-ish)
   ============================================================ */
export function EditableHomeCta() {
  const trust: Array<{ label: string; body: string; icon: typeof Sparkles }> = [
    { label: 'Curated locally', body: 'Every listing and reference is reviewed before publishing.', icon: MapPin },
    { label: 'Downloadable references', body: 'Guides, reports and reference material kept as PDFs.', icon: Sparkles },
    { label: 'Community submitted', body: 'Contributors add places and references we all benefit from.', icon: ArrowUpRight },
  ]
  return (
    <section id="get-app" className="scroll-mt-24 bg-[var(--slot4-page-bg)]">
      <div className={`${container} py-[80px] sm:py-[100px]`}>
        <EditableReveal index={0}>
          <div className="border-b border-[var(--editable-border)] pb-6">
            <p className={dc.type.eyebrow}>Why {SITE_CONFIG.name}</p>
            <h2 className={`${dc.type.sectionTitle} mt-3`}>Slow, curated, useful.</h2>
          </div>
        </EditableReveal>
        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          {trust.map((item, i) => {
            const Icon = item.icon
            return (
              <EditableReveal key={item.label} index={i}>
                <div>
                  <span className="flex h-11 w-11 items-center justify-center border border-[var(--editable-border-strong)] bg-white text-[var(--slot4-accent)]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="editable-display mt-6 text-[22px] font-bold leading-tight tracking-[-0.01em]">
                    {item.label}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.7] text-[var(--slot4-muted-text)]">{item.body}</p>
                </div>
              </EditableReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
