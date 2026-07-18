import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { toPlainText } from '@/editable/cards/PostCards'
import { pagesContent } from '@/editable/content/pages.content'
import { getTaskTheme } from '@/editable/theme/task-themes'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => (typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : '')
const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const compactRaw = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? (content.images.find((item) => typeof item === 'string') as string | undefined) : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const summaryOf = (post: SitePost) => {
  const content = getContent(post)
  return toPlainText(
    (typeof post.summary === 'string' && post.summary) ||
      compactRaw(content.description) ||
      compactRaw(content.excerpt) ||
      compactRaw(content.body) ||
      ''
  )
}

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post }: { post: SitePost }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task || 'article'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const taskLabel = task ? getTaskTheme(task).kicker : 'Feature'

  return (
    <Link href={href} className="group block">
      {image ? (
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--slot4-warm)]">
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover transition duration-[500ms] group-hover:scale-[1.03]"
          />
        </div>
      ) : (
        <div className="flex aspect-[16/10] items-center justify-center bg-[var(--slot4-warm)]">
          <Search className="h-6 w-6 text-[var(--slot4-muted-text)]" />
        </div>
      )}
      <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent)]">{taskLabel}</p>
      <h2 className="editable-display mt-3 line-clamp-3 text-[22px] font-bold leading-[1.2] tracking-[-0.01em]">
        <span className="editable-underline-ochre">{post.title}</span>
      </h2>
      {summary ? (
        <p className="mt-3 line-clamp-3 text-[15px] leading-[1.7] text-[var(--slot4-muted-text)]">{summary}</p>
      ) : null}
      <span className="editable-label mt-4 inline-flex items-center gap-2 text-[var(--slot4-page-text)]">
        Open result <ArrowUpRight className="h-4 w-4" />
      </span>
    </Link>
  )
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }>
}) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(
    useMaster ? 1000 : 300,
    useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined
  )
  const posts = feed?.posts?.length
    ? feed.posts
    : useMaster
      ? []
      : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="border-b border-[var(--editable-border)] bg-[var(--slot4-warm)]">
          <div className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-16 sm:px-6 sm:py-24 lg:px-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent)]">
              {pagesContent.search.hero.badge}
            </p>
            <h1 className="editable-display mt-6 max-w-3xl text-balance text-[40px] font-bold leading-[1.05] tracking-[-0.02em] sm:text-[56px] lg:text-[68px]">
              {pagesContent.search.hero.title}
            </h1>
            <p className="editable-emphasis mt-8 max-w-2xl text-[20px] leading-[1.6] italic text-[var(--slot4-muted-text)]">
              {pagesContent.search.hero.description}
            </p>

            <form action="/search" className="mt-10 grid gap-3 border border-[var(--editable-border-strong)] bg-white p-4 sm:grid-cols-[minmax(0,1fr)_180px_180px_120px]">
              <input type="hidden" name="master" value="1" />
              <label className="flex items-center gap-3 border border-[var(--editable-border)] bg-white px-4">
                <Search className="h-4 w-4 text-[var(--slot4-muted-text)]" />
                <input
                  name="q"
                  defaultValue={query}
                  placeholder={pagesContent.search.hero.placeholder}
                  className="min-w-0 flex-1 bg-transparent py-3 text-[15px] outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
                />
              </label>
              <label className="flex items-center gap-2 border border-[var(--editable-border)] bg-white px-4">
                <Filter className="h-4 w-4 text-[var(--slot4-muted-text)]" />
                <input
                  name="category"
                  defaultValue={category}
                  placeholder="Category"
                  className="min-w-0 flex-1 bg-transparent py-3 text-[13px] font-semibold uppercase tracking-[0.08em] outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
                />
              </label>
              <select
                name="task"
                defaultValue={task}
                className="border border-[var(--editable-border)] bg-white px-4 text-[13px] font-semibold uppercase tracking-[0.08em] outline-none"
              >
                <option value="">All types</option>
                {enabledTasks.map((item) => {
                  const theme = getTaskTheme(item.key)
                  return (
                    <option key={item.key} value={item.key}>
                      {theme.kicker}
                    </option>
                  )
                })}
              </select>
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-[2px] bg-[var(--slot4-accent-fill)] px-5 text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[var(--slot4-accent-hover)]"
              >
                Search
              </button>
            </form>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--editable-border)] pb-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent)]">
                {results.length} results
              </p>
              <h2 className="editable-display mt-3 text-[30px] font-bold tracking-[-0.02em] sm:text-[36px]">
                {query ? `Results for "${query}"` : pagesContent.search.resultsTitle}
              </h2>
            </div>
          </div>

          {results.length ? (
            <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {results.map((post) => (
                <SearchResultCard key={post.id || post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="mt-12 border border-dashed border-[var(--editable-border)] bg-white p-10 text-center">
              <p className="editable-display text-[26px] font-bold tracking-[-0.02em]">No matching entries.</p>
              <p className="mt-3 text-[15px] leading-[1.7] text-[var(--slot4-muted-text)]">
                Try a different keyword, category or type.
              </p>
            </div>
          )}
        </section>

        <section className="mx-auto w-full max-w-[var(--editable-container)] px-5 pb-16 sm:px-6 lg:px-8">
          <Ads slot="footer" size={pickRandom(getSlotSizes('footer'))} showLabel className="mx-auto w-full" />
        </section>
      </main>
    </EditableSiteShell>
  )
}
