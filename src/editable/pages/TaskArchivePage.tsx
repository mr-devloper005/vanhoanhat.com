import Link from 'next/link'
import { ArrowUpRight, Bookmark, Building2, ChevronDown, Download, FileText, Globe, MapPin, Phone, Search, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media)
    ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback

const stripHtml = (value: string) =>
  value
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const getSummary = (post: SitePost) =>
  stripHtml(post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body))

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}
const cleanDomain = (value: string) => value.replace(/^https?:\/\//, '').replace(/\/$/, '')

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskGrid: Record<TaskKey, string> = {
  article: 'grid gap-10 md:grid-cols-2 xl:grid-cols-3',
  listing: 'grid gap-8 lg:grid-cols-2',
  classified: 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3',
  image: 'columns-1 gap-5 [column-fill:_balance] sm:columns-2 xl:columns-3',
  sbm: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
  pdf: 'grid gap-8 md:grid-cols-2 xl:grid-cols-3',
  profile: 'grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return (
    <TaskArchiveView
      task={task}
      posts={posts}
      pagination={pagination}
      category={category}
      basePath={basePath || taskConfig?.route || `/${task}`}
    />
  )
}

export function TaskArchiveView({
  task,
  posts,
  pagination,
  category,
  basePath,
}: {
  task: TaskKey
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  basePath: string
}) {
  const voice = taskPageVoices[task]
  const theme = getTaskTheme(task)
  const page = pagination.page || 1
  const categoryLabel =
    category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category

  return (
    <EditableSiteShell>
      <main
        style={taskThemeStyle(task)}
        className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]"
      >
        {/* Editorial category banner ribbon */}
        <header className="border-b border-[var(--tk-line)] bg-[var(--slot4-warm)]">
          <div className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-16 sm:px-6 sm:py-24 lg:px-8">
            <EditableReveal index={0}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-accent)]">
                {theme.kicker}
              </p>
            </EditableReveal>
            <EditableReveal index={1}>
              <h1 className="editable-display mt-6 max-w-3xl text-balance text-[36px] font-bold leading-[1.08] tracking-[-0.02em] sm:text-[52px] lg:text-[64px]">
                {voice?.headline}
              </h1>
            </EditableReveal>
            <EditableReveal index={2}>
              <p className="editable-emphasis mt-8 max-w-2xl text-[20px] leading-[1.6] italic text-[var(--tk-muted)]">
                {voice?.description || theme.note}
              </p>
            </EditableReveal>
            <EditableReveal index={3}>
              <div className="mt-10 flex flex-col gap-4 border-t border-[var(--tk-line)] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-[var(--tk-muted)]">
                  <span className="text-[var(--tk-text)]">{posts.length}</span>{' '}
                  {posts.length === 1 ? 'entry' : 'entries'} · {categoryLabel}
                </p>
                <form action={basePath} className="flex items-center gap-2">
                  <div className="relative">
                    <select
                      name="category"
                      defaultValue={category}
                      className="h-11 appearance-none rounded-[2px] border border-[var(--tk-line)] bg-white pl-4 pr-10 text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--tk-text)] outline-none transition focus:border-[var(--tk-accent)]"
                      aria-label={voice?.filterLabel || 'Filter category'}
                    >
                      <option value="all">All categories</option>
                      {CATEGORY_OPTIONS.map((item) => (
                        <option key={item.slug} value={item.slug}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tk-muted)]" />
                  </div>
                  <button className={dc.button.accent}>Apply</button>
                </form>
              </div>
            </EditableReveal>
          </div>
        </header>

        {/* Reference Library gets a top-of-page ad; other tasks get their placement per rule. */}
        {task === 'pdf' ? (
          <div className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-10 sm:px-6 lg:px-8">
            <Ads slot="header" size={pickRandom(getSlotSizes('header'))} showLabel eager className="mx-auto w-full" />
          </div>
        ) : null}

        <section className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-16 sm:px-6 sm:py-24 lg:px-8">
          {posts.length ? (
            <div className={taskGrid[task]}>
              {posts.map((post, index) => {
                const card = (
                  <ArchivePostCard
                    key={post.id || post.slug}
                    post={post}
                    task={task}
                    basePath={basePath}
                    index={index}
                  />
                )
                // Local Directory gets an in-feed ad after the 6th card.
                if (task === 'listing' && index === 5) {
                  return (
                    <div key={`${post.id || post.slug}-inline-ad`} className="contents">
                      {card}
                      <div className="lg:col-span-2">
                        <Ads
                          slot="in-feed"
                          size={pickRandom(getSlotSizes('in-feed'))}
                          showLabel
                          className="mx-auto w-full"
                        />
                      </div>
                    </div>
                  )
                }
                return card
              })}
            </div>
          ) : (
            <div className="mx-auto max-w-xl border border-dashed border-[var(--tk-line)] bg-white px-8 py-16 text-center">
              <Search className="mx-auto h-7 w-7 text-[var(--tk-muted)]" />
              <h2 className="editable-display mt-5 text-2xl font-bold tracking-[-0.02em]">Nothing here yet</h2>
              <p className="mt-3 text-sm leading-[1.7] text-[var(--tk-muted)]">
                Try another category — new entries land here every week.
              </p>
            </div>
          )}

          {posts.length ? (
            <nav className="mt-16 flex items-center justify-center gap-3 text-[12px] font-semibold uppercase tracking-[0.14em]">
              {pagination.hasPrevPage ? (
                <Link
                  href={pageHref(basePath, category, page - 1)}
                  className="rounded-[2px] border border-[var(--tk-line)] bg-white px-5 py-3 text-[var(--tk-text)] transition hover:border-[var(--tk-accent)] hover:text-[var(--tk-accent)]"
                >
                  Previous
                </Link>
              ) : null}
              <span className="rounded-[2px] border border-[var(--tk-line)] bg-[var(--slot4-warm)] px-5 py-3 text-[var(--tk-muted)]">
                Page {page} of {pagination.totalPages || 1}
              </span>
              {pagination.hasNextPage ? (
                <Link
                  href={pageHref(basePath, category, page + 1)}
                  className="rounded-[2px] border border-[var(--tk-line)] bg-white px-5 py-3 text-[var(--tk-text)] transition hover:border-[var(--tk-accent)] hover:text-[var(--tk-accent)]"
                >
                  Next
                </Link>
              ) : null}
            </nav>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

/* ------------- Article card ------------- */
function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  const category = getCategory(post, 'Feature')
  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--tk-raised)]">
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover transition duration-[500ms] group-hover:scale-[1.03]"
        />
      </div>
      <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-accent)]">
        {category} · No. {String(index + 1).padStart(2, '0')}
      </p>
      <h2 className="editable-display mt-3 line-clamp-3 text-[24px] font-bold leading-[1.2] tracking-[-0.01em]">
        <span className="editable-underline-ochre">{post.title}</span>
      </h2>
      <p className="mt-3 line-clamp-2 text-[15px] leading-[1.7] text-[var(--tk-muted)]">{getSummary(post)}</p>
      <span className="editable-label mt-4 inline-flex items-center gap-2 text-[var(--tk-text)]">
        Continue reading <ArrowUpRight className="h-4 w-4" />
      </span>
    </Link>
  )
}

/* ------------- Local Directory (listing) card ------------- */
function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  const category = getCategory(post, 'Local')
  return (
    <Link
      href={href}
      className="group grid grid-cols-[110px_minmax(0,1fr)] gap-6 border-t border-[var(--tk-line)] py-8"
    >
      <div className="flex h-[110px] w-[110px] items-center justify-center overflow-hidden rounded-[2px] bg-[var(--slot4-warm)]">
        {logo ? (
          <img src={logo} alt="" className="h-full w-full object-cover" />
        ) : (
          <Building2 className="h-10 w-10 text-[var(--tk-muted)]" />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-accent)]">{category}</p>
        <h2 className="editable-display mt-2 text-[24px] font-bold leading-[1.2] tracking-[-0.01em]">
          <span className="editable-underline-ochre">{post.title}</span>
        </h2>
        <p className="mt-3 line-clamp-2 text-[15px] leading-[1.7] text-[var(--tk-muted)]">{getSummary(post)}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-[12px] font-medium uppercase tracking-[0.1em] text-[var(--tk-muted)]">
          {location ? (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {location}
            </span>
          ) : null}
          {phone ? (
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {phone}
            </span>
          ) : null}
          {website ? (
            <span className="inline-flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> Website
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  )
}

/* ------------- Classified card ------------- */
function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className="group flex flex-col border border-[var(--tk-line)] bg-white p-6 transition hover:border-[var(--tk-accent)]">
      <div className="flex items-start justify-between gap-4">
        <span className="editable-display text-[28px] font-bold tracking-[-0.02em] text-[var(--tk-accent)]">
          {price || 'Open offer'}
        </span>
        {condition ? (
          <span className="rounded-full bg-[var(--tk-accent-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--tk-accent)]">
            {condition}
          </span>
        ) : null}
      </div>
      <h2 className="editable-display mt-5 text-[20px] font-bold leading-[1.25] tracking-[-0.01em]">
        <span className="editable-underline-ochre">{post.title}</span>
      </h2>
      <p className="mt-3 line-clamp-3 flex-1 text-[15px] leading-[1.7] text-[var(--tk-muted)]">{getSummary(post)}</p>
      <div className="mt-6 flex items-center justify-between border-t border-[var(--tk-line)] pt-4 text-[12px] font-medium text-[var(--tk-muted)]">
        <span className="inline-flex items-center gap-1.5">
          {location ? (
            <>
              <MapPin className="h-3.5 w-3.5" /> {location}
            </>
          ) : (
            'Details inside'
          )}
        </span>
        <ArrowUpRight className="h-4 w-4 text-[var(--tk-accent)] transition group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}

/* ------------- Image card ------------- */
function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  return (
    <Link href={href} className="group mb-5 block break-inside-avoid overflow-hidden bg-white">
      <div className={`relative overflow-hidden ${index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
        <img src={image} alt="" className="h-full w-full object-cover transition duration-[600ms] group-hover:scale-[1.04]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(31,29,27,0.75))] opacity-90 transition group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h2 className="editable-display line-clamp-2 text-[18px] font-bold leading-[1.25] tracking-[-0.01em] text-white">
            {post.title}
          </h2>
          <span className="editable-label mt-2 inline-flex items-center gap-1.5 text-white/85">
            View image <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

/* ------------- Saved shelves (bookmark) card ------------- */
function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className="group flex gap-4 border-t border-[var(--tk-line)] py-6">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-[var(--slot4-warm)] text-[var(--tk-accent)]">
        <Bookmark className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-muted)]">
          Saved · {String(index + 1).padStart(2, '0')}
        </span>
        <h2 className="editable-display mt-1.5 text-[18px] font-bold leading-[1.25] tracking-[-0.01em]">
          <span className="editable-underline-ochre">{post.title}</span>
        </h2>
        <p className="mt-2 line-clamp-2 text-[15px] leading-[1.7] text-[var(--tk-muted)]">{getSummary(post)}</p>
        {website ? <p className="mt-3 truncate text-xs font-semibold uppercase tracking-[0.14em] text-[var(--tk-accent)]">{cleanDomain(website)}</p> : null}
      </div>
    </Link>
  )
}

/* ------------- Reference Library (pdf) card ------------- */
function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const category = getCategory(post, 'Reference')
  return (
    <Link href={href} className="group flex flex-col border border-[var(--tk-line)] bg-white p-6 transition hover:border-[var(--tk-accent)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center bg-[var(--slot4-warm)] text-[var(--tk-accent)]">
          <FileText className="h-6 w-6" />
        </div>
        <span className="rounded-full border border-[var(--tk-line)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--tk-muted)]">
          {category}
        </span>
      </div>
      <h2 className="editable-display mt-6 text-[22px] font-bold leading-[1.2] tracking-[-0.01em]">
        <span className="editable-underline-ochre">{post.title}</span>
      </h2>
      <p className="mt-3 line-clamp-3 flex-1 text-[15px] leading-[1.7] text-[var(--tk-muted)]">{getSummary(post)}</p>
      <span className="editable-label mt-6 inline-flex items-center gap-2 text-[var(--tk-accent)]">
        Open reference <Download className="h-4 w-4" />
      </span>
    </Link>
  )
}

/* ------------- Profile card ------------- */
function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className="group flex flex-col items-center p-7 text-center border border-[var(--tk-line)] bg-white transition hover:border-[var(--tk-accent)]">
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-[var(--tk-line)] bg-[var(--slot4-warm)]">
        {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 text-[var(--tk-muted)]" />}
      </div>
      <h2 className="editable-display mt-5 text-[18px] font-bold tracking-[-0.01em]">{post.title}</h2>
      {role ? (
        <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--tk-accent)]">{role}</p>
      ) : null}
      <p className="mt-3 line-clamp-2 text-[15px] leading-[1.7] text-[var(--tk-muted)]">{getSummary(post)}</p>
    </Link>
  )
}
