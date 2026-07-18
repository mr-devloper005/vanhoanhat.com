import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function toPlainText(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value
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
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    (typeof post?.summary === 'string' && post.summary) ||
    (typeof content.body === 'string' && content.body) ||
    (typeof content.excerpt === 'string' && content.excerpt) ||
    ''
  const clean = toPlainText(raw)
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

/*
  Editorial cards — reference-tuned:
  - Borderless & shadow-free (visual weight from whitespace + serif hierarchy)
  - 16:9 image top, subtle 400ms scale-1.03 hover
  - Uppercase blue eyebrow (12/0.22em)
  - Merriweather 700 headline with warm-ochre underline slide-in on hover
  - Inter body meta with 1.7 leading
*/

export function EditorialFeatureCard({ post, href, label = 'Featured read' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className="group block min-w-0 overflow-hidden">
      <div className={`relative aspect-[21/9] w-full ${pal.mediaBg} overflow-hidden`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-[600ms] group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(31,29,27,0.05)_0%,rgba(31,29,27,0.55)_60%,rgba(31,29,27,0.82)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-14">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/85">{label}</span>
          <h3 className="editable-display mt-4 max-w-3xl text-3xl font-bold leading-[1.08] tracking-[-0.02em] text-white sm:text-4xl lg:text-[52px]">
            {post.title}
          </h3>
          <p className="mt-4 max-w-2xl text-[15px] leading-[1.7] text-white/85">{getEditableExcerpt(post, 180)}</p>
          <span className="editable-label mt-6 inline-flex items-center gap-2 text-white">
            Read the story <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group ${dc.layout.minRailCard} block ${pal.surfaceBg}`}>
      <div className={`${dc.media.frame} ${dc.media.ratio}`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-[500ms] group-hover:scale-[1.03]"
        />
        <span className="absolute left-4 top-4 rounded-full bg-[var(--slot4-page-text)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
          No. {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="pt-5">
        <p className={dc.type.eyebrow}>{getEditableCategory(post)}</p>
        <h3 className="editable-display mt-3 line-clamp-3 text-[22px] font-bold leading-[1.2] tracking-[-0.01em] text-[var(--slot4-page-text)]">
          <span className="editable-underline-ochre">{post.title}</span>
        </h3>
        <p className={`mt-3 line-clamp-2 ${dc.type.body} text-[var(--slot4-muted-text)]`}>{getEditableExcerpt(post, 130)}</p>
      </div>
    </Link>
  )
}

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group flex min-w-0 items-start gap-5 border-b border-[var(--editable-border)] py-6">
      <span className="editable-display flex h-14 w-14 shrink-0 items-center justify-center bg-[var(--slot4-warm)] text-[20px] font-bold text-[var(--slot4-accent)]">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="min-w-0">
        <p className={dc.type.eyebrow}>{getEditableCategory(post)}</p>
        <h3 className="editable-display mt-2 line-clamp-2 text-[20px] font-bold leading-[1.25] tracking-[-0.01em] text-[var(--slot4-page-text)]">
          <span className="editable-underline-ochre">{post.title}</span>
        </h3>
        <p className={`mt-2 line-clamp-2 ${dc.type.body} text-[var(--slot4-muted-text)]`}>{getEditableExcerpt(post, 110)}</p>
      </div>
    </Link>
  )
}

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group grid min-w-0 gap-6 border-b border-[var(--editable-border)] py-10 sm:grid-cols-[260px_minmax(0,1fr)]">
      <div className={`${dc.media.frame} aspect-[4/3] sm:aspect-[16/12]`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-[500ms] group-hover:scale-[1.03]"
        />
      </div>
      <div className="min-w-0">
        <p className={dc.type.eyebrow}>Read no. {String(index + 1).padStart(2, '0')}</p>
        <h2 className="editable-display mt-3 line-clamp-3 text-[28px] font-bold leading-[1.15] tracking-[-0.01em] text-[var(--slot4-page-text)] sm:text-[32px]">
          <span className="editable-underline-ochre">{post.title}</span>
        </h2>
        <p className={`mt-4 line-clamp-3 ${dc.type.body} text-[var(--slot4-muted-text)]`}>{getEditableExcerpt(post, 190)}</p>
        <span className="editable-label mt-5 inline-flex items-center gap-2 text-[var(--slot4-page-text)]">
          Read on <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}
