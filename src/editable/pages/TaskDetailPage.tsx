import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ArrowUpRight,
  Bookmark,
  Building2,
  Camera,
  CheckCircle2,
  Clock3,
  Download,
  ExternalLink,
  FileText,
  Globe2,
  Layers,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Tag,
  UserRound,
} from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media)
    ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar']
    .map((key) => asText(content[key]))
    .filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

const safeUrl = (value: string) => (/^https?:\/\//i.test(value) ? value : '#')

const linkifyMarkdown = (value: string) =>
  value.replace(
    /\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi,
    (_m, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`
  )

const linkifyText = (value: string) =>
  linkifyMarkdown(value).replace(
    /(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi,
    (_m, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`
  )

const hardenLinks = (html: string) =>
  html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_m, attrs) => {
    let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    if (!/\starget=/i.test(next)) next += ' target="_blank"'
    if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
    return `<a ${next}>`
  })

const sanitizeHtml = (html: string) =>
  hardenLinks(
    html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
      .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"')
  )

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  return lead && lead !== stripHtml(getBody(post)) ? lead : ''
}
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const tagsOf = (post: SitePost): string[] => {
  const tags = post.tags && Array.isArray(post.tags) ? post.tags.filter((t): t is string => typeof t === 'string') : []
  return tags.slice(0, 6)
}

const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({
  task,
  post,
  related,
  comments = [],
}: {
  task: TaskKey
  post: SitePost
  related: SitePost[]
  comments?: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function Kicker({ task, children }: { task: TaskKey; children: React.ReactNode }) {
  const theme = getTaskTheme(task)
  return (
    <div className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-accent)]">
      <span>{theme.kicker}</span>
      <span className="h-1 w-1 rounded-full bg-[var(--tk-accent)] opacity-60" />
      <span className="text-[var(--tk-muted)]">{children}</span>
    </div>
  )
}

function BackLink({ task, label }: { task: TaskKey; label?: string }) {
  const taskConfig = getTaskConfig(task)
  const theme = getTaskTheme(task)
  return (
    <Link
      href={taskConfig?.route || '/'}
      className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--tk-muted)] transition hover:text-[var(--tk-text)]"
    >
      <ArrowLeft className="h-4 w-4" /> Back to {label || theme.kicker}
    </Link>
  )
}

/* ============================================================
   Article detail — quiet centred reading column (unchanged style,
   updated to editorial tokens; no date shown).
   ============================================================ */
function ArticleDetail({
  post,
  related,
  comments,
}: {
  post: SitePost
  related: SitePost[]
  comments: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  const images = getImages(post)
  return (
    <>
      <article className="mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-24">
        <BackLink task="article" />
        <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-accent)]">
          {categoryOf(post, 'Feature')}
        </p>
        <h1 className="editable-display mt-6 text-balance text-[38px] font-bold leading-[1.08] tracking-[-0.02em] sm:text-[52px] lg:text-[60px]">
          {post.title}
        </h1>
        <p className="mt-6 text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--tk-muted)]">
          Published on {SITE_CONFIG.name}
        </p>
        {images[0] ? (
          <img
            src={images[0]}
            alt=""
            className="mt-10 aspect-[16/9] w-full object-cover"
          />
        ) : null}
        <BodyContent post={post} />
        <EditableArticleComments slug={post.slug} comments={comments} />
      </article>
      <RelatedStrip task="article" related={related} />
    </>
  )
}

/* ============================================================
   Local Directory detail — premium record
   ============================================================ */
function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const hero = images[0]
  const gallery = images.slice(1)
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const hours = getField(post, ['hours', 'openHours', 'schedule']) || 'Hours on request'
  const category = getField(post, ['category']) || tagsOf(post)[0] || 'Local entry'
  const mapSrc = mapSrcFor(post)

  const quickFacts: Array<{ label: string; value: string; icon: typeof MapPin }> = [
    { label: 'Location', value: address || 'Contact for address', icon: MapPin },
    { label: 'Phone', value: phone || 'On request', icon: Phone },
    { label: 'Hours', value: hours, icon: Clock3 },
    { label: 'Category', value: category, icon: Building2 },
  ]

  return (
    <>
      {/* Editorial serif h1 hero with 21:9 image beneath */}
      <section className="border-b border-[var(--tk-line)] bg-[var(--slot4-warm)]">
        <div className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
          <EditableReveal index={0}>
            <BackLink task="listing" label="Local Directory" />
          </EditableReveal>
          <EditableReveal index={1}>
            <div className="mt-8">
              <Kicker task="listing">Local entry</Kicker>
            </div>
          </EditableReveal>
          <EditableReveal index={2}>
            <h1 className="editable-display mt-6 max-w-4xl text-balance text-[40px] font-bold leading-[1.05] tracking-[-0.02em] sm:text-[56px] lg:text-[68px]">
              {post.title}
            </h1>
          </EditableReveal>
          {leadText(post) ? (
            <EditableReveal index={3}>
              <p className="editable-emphasis mt-8 max-w-3xl text-[20px] leading-[1.6] italic text-[var(--tk-muted)]">
                {leadText(post)}
              </p>
            </EditableReveal>
          ) : null}
        </div>
      </section>

      {hero ? (
        <div className="mx-auto w-full max-w-[var(--editable-container-wide)] px-5 pt-14 sm:px-6 lg:px-8">
          <EditableReveal index={0}>
            <div className="relative aspect-[21/9] w-full overflow-hidden bg-[var(--slot4-warm)]">
              <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          </EditableReveal>
        </div>
      ) : null}

      {/* Quick-facts strip */}
      <section className="border-b border-t border-[var(--tk-line)] bg-white">
        <div className="mx-auto grid w-full max-w-[var(--editable-container)] gap-6 px-5 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {quickFacts.map((fact) => {
            const Icon = fact.icon
            return (
              <div key={fact.label} className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-[var(--slot4-warm)] text-[var(--tk-accent)]">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--tk-muted)]">{fact.label}</p>
                  <p className="mt-1 truncate text-[15px] font-semibold text-[var(--tk-text)]">{fact.value}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Body + sidebar */}
      <section className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article className="min-w-0">
            <EditableReveal index={0}>
              <h2 className="editable-display text-[30px] font-bold leading-[1.15] tracking-[-0.02em]">About this listing</h2>
            </EditableReveal>
            <BodyContent post={post} />

            {tagsOf(post).length ? (
              <div className="mt-10 flex flex-wrap gap-2">
                {tagsOf(post).map((tag) => (
                  <span
                    key={tag}
                    className="editable-emphasis rounded-full border border-[var(--tk-line)] bg-white px-4 py-1.5 text-[13px] italic text-[var(--tk-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            {gallery.length ? (
              <div className="mt-14">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-accent)]">Gallery</p>
                <h3 className="editable-display mt-3 text-[24px] font-bold leading-tight tracking-[-0.01em]">A closer look</h3>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {gallery.slice(0, 6).map((image, i) => (
                    <img key={`${image}-${i}`} src={image} alt="" className="aspect-[4/3] w-full object-cover" />
                  ))}
                </div>
              </div>
            ) : null}

            {mapSrc ? (
              <div className="mt-14">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-accent)]">Find it</p>
                <h3 className="editable-display mt-3 text-[24px] font-bold leading-tight tracking-[-0.01em]">On the map</h3>
                <div className="mt-6 border border-[var(--tk-line)] bg-white">
                  <iframe src={mapSrc} title="Map" loading="lazy" className="h-[380px] w-full border-0" />
                </div>
              </div>
            ) : null}
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* Contact card with clickable rows */}
            <div className="border border-[var(--tk-line)] bg-white p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-accent)]">Get in touch</p>
              <h3 className="editable-display mt-3 text-[22px] font-bold leading-tight tracking-[-0.01em]">Contact</h3>
              <div className="mt-6 divide-y divide-[var(--tk-line)]">
                {address ? <ContactRow icon={MapPin} label="Address" value={address} /> : null}
                {phone ? <ContactRow icon={Phone} label="Phone" value={phone} href={`tel:${phone}`} /> : null}
                {email ? <ContactRow icon={Mail} label="Email" value={email} href={`mailto:${email}`} /> : null}
                {website ? <ContactRow icon={Globe2} label="Website" value={website.replace(/^https?:\/\//, '')} href={website} external /> : null}
                <ContactRow icon={Clock3} label="Hours" value={hours} />
              </div>
              <a
                href={website || (phone ? `tel:${phone}` : email ? `mailto:${email}` : '#')}
                target={website ? '_blank' : undefined}
                rel={website ? 'noopener noreferrer' : undefined}
                className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[2px] bg-[var(--slot4-accent-fill)] px-5 text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[var(--slot4-accent-hover)]"
              >
                Reach out <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>

            {/* Trust panel */}
            <div className="border border-[var(--tk-line)] bg-white p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-accent)]">Why {SITE_CONFIG.name}</p>
              <ul className="mt-4 space-y-3">
                {[
                  { icon: ShieldCheck, label: 'Verified by our editors' },
                  { icon: CheckCircle2, label: 'Independently reviewed' },
                  { icon: MapPin, label: 'Locally sourced entries' },
                ].map((row) => {
                  const Icon = row.icon
                  return (
                    <li key={row.label} className="flex items-center gap-3 text-[14px] font-medium text-[var(--tk-text)]">
                      <span className="flex h-8 w-8 items-center justify-center bg-[var(--slot4-warm)] text-[var(--tk-accent)]">
                        <Icon className="h-4 w-4" />
                      </span>
                      {row.label}
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Sidebar ad — required by placement rules */}
            <Ads slot="sidebar" size={pickRandom(getSlotSizes('sidebar'))} showLabel className="w-full" />
          </aside>
        </div>
      </section>

      <RelatedStrip task="listing" related={related} label="More on the local directory" />
    </>
  )
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
  external,
}: {
  icon: typeof MapPin
  label: string
  value: string
  href?: string
  external?: boolean
}) {
  const inner = (
    <>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-[var(--slot4-warm)] text-[var(--tk-accent)]">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--tk-muted)]">{label}</span>
        <span className="block truncate text-[14px] font-semibold text-[var(--tk-text)]">{value}</span>
      </span>
      {href ? <ArrowUpRight className="h-4 w-4 text-[var(--tk-muted)]" /> : null}
    </>
  )
  if (href) {
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className="flex items-center gap-3 py-3 transition hover:text-[var(--tk-accent)]"
      >
        {inner}
      </a>
    )
  }
  return <div className="flex items-center gap-3 py-3">{inner}</div>
}

/* ============================================================
   Reference Library detail — document-workspace layout
   No hero photography. Document preview is the visual centrepiece.
   ============================================================ */
// Byte formatter: 1234567 → "1.2 MB".
function formatBytes(bytes: number): string {
  if (!bytes || !Number.isFinite(bytes) || bytes <= 0) return '—'
  const units = ['B', 'KB', 'MB', 'GB']
  let value = bytes
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit += 1
  }
  return `${value >= 10 ? value.toFixed(0) : value.toFixed(1)} ${units[unit]}`
}

// Best-effort PDF metadata: HEAD for size, GET for page count. Cheap fallback
// when the CMS doesn't ship pages/size fields. Errors are swallowed so a bad
// upstream never breaks the render.
async function resolvePdfMeta(fileUrl: string): Promise<{ size: string; pages: string; rawBytes: number }> {
  if (!fileUrl || !/^https?:\/\//i.test(fileUrl)) return { size: '—', pages: '—', rawBytes: 0 }
  let rawBytes = 0
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 3500)
    const head = await fetch(fileUrl, { method: 'HEAD', signal: controller.signal, next: { revalidate: 3600 } })
    clearTimeout(timer)
    const len = head.headers.get('content-length')
    if (len) rawBytes = Number(len) || 0
  } catch {
    // ignore
  }

  let pages = '—'
  // Skip page-count fetch on very large files to avoid downloading e-books.
  if (rawBytes > 0 && rawBytes < 15 * 1024 * 1024) {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 4500)
      const res = await fetch(fileUrl, { signal: controller.signal, next: { revalidate: 3600 } })
      clearTimeout(timer)
      if (res.ok) {
        const buffer = await res.arrayBuffer()
        // Read the raw bytes as latin1 so the PDF's object markers survive intact.
        const text = new TextDecoder('latin1').decode(new Uint8Array(buffer))
        // Every real page carries a `/Type /Page` marker (with optional whitespace);
        // `/Type /Pages` is the container and must be excluded via a negative lookahead.
        const matches = text.match(/\/Type\s*\/Page(?![s\w])/g)
        if (matches && matches.length > 0) pages = String(matches.length)
      }
    } catch {
      // ignore
    }
  }

  return { size: formatBytes(rawBytes), pages, rawBytes }
}

async function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  const declaredPages = getField(post, ['pages', 'pageCount'])
  const declaredSize = getField(post, ['size', 'fileSize', 'filesize'])
  // Only hit the network when we don't already have both values from the CMS.
  const needsResolve = fileUrl && (!declaredPages || !declaredSize)
  const resolved = needsResolve ? await resolvePdfMeta(fileUrl) : { size: '—', pages: '—', rawBytes: 0 }
  const pages = declaredPages || resolved.pages
  const size = declaredSize || resolved.size
  const uploaded = getField(post, ['uploadedBy', 'contributor', 'author']) || SITE_CONFIG.name
  const updatedLabel = 'Recently'
  const category = categoryOf(post, 'Reference')
  const format = (getField(post, ['format', 'fileType']) || 'PDF').toUpperCase()
  const lead = leadText(post)
  const outline = tagsOf(post).slice(0, 5)

  return (
    <>
      {/* Header — mono/label chip row + very large h1 */}
      <section className="border-b border-[var(--tk-line)] bg-[var(--slot4-warm)]">
        <div className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
          <EditableReveal index={0}>
            <BackLink task="pdf" label="Reference Library" />
          </EditableReveal>

          <EditableReveal index={1}>
            <div className="mt-10 flex flex-wrap items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em]">
              <span className="rounded-full bg-[var(--slot4-accent-fill)] px-3 py-1 text-white">Reference file</span>
              <span className="rounded-full border border-[var(--tk-line)] bg-white px-3 py-1 text-[var(--tk-text)]">
                {format}
              </span>
              <span className="rounded-full border border-[var(--tk-line)] bg-white px-3 py-1 text-[var(--tk-muted)]">{category}</span>
            </div>
          </EditableReveal>

          <EditableReveal index={2}>
            <h1 className="editable-display mt-8 max-w-5xl text-balance text-[44px] font-black leading-[1.02] tracking-[-0.02em] sm:text-[68px] lg:text-[84px]">
              {post.title}
            </h1>
          </EditableReveal>

          {lead ? (
            <EditableReveal index={3}>
              <blockquote className="editable-emphasis mt-10 max-w-3xl border-l-[3px] border-[var(--slot4-accent-fill)] pl-6 text-[22px] leading-[1.55] italic text-[var(--tk-text)]">
                {lead}
              </blockquote>
            </EditableReveal>
          ) : null}

          <EditableReveal index={4}>
            <div className="mt-10 flex flex-wrap gap-3">
              {fileUrl ? (
                <a
                  href={fileUrl}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-[2px] bg-[var(--slot4-accent-fill)] px-6 text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[var(--slot4-accent-hover)]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="h-4 w-4" /> Download PDF
                </a>
              ) : null}
              {fileUrl ? (
                <a
                  href={fileUrl}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-[2px] border border-[var(--tk-text)] px-6 text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--tk-text)] transition hover:bg-[var(--tk-text)] hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in new tab <ExternalLink className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          </EditableReveal>
        </div>
      </section>

      {/* Quick-facts strip */}
      <section className="border-b border-[var(--tk-line)] bg-white">
        <div className="mx-auto grid w-full max-w-[var(--editable-container)] gap-6 px-5 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            { label: 'Pages', value: String(pages) },
            { label: 'File size', value: size },
            { label: 'Format', value: format },
            { label: 'Updated', value: updatedLabel },
          ].map((row) => (
            <div key={row.label}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--tk-muted)]">{row.label}</p>
              <p className="editable-display mt-2 text-[22px] font-bold tracking-[-0.01em]">{row.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Body + document preview + sidebar */}
      <section className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="min-w-0">
            {/* Large embedded PDF preview — the visual centrepiece */}
            {fileUrl ? (
              <EditableReveal index={0}>
                <div className="border border-[var(--tk-line)] bg-white">
                  <div className="flex items-center justify-between gap-3 border-b border-[var(--tk-line)] p-4">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--tk-muted)]">
                      Reference preview
                    </span>
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--tk-accent)]"
                    >
                      Open <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                  <iframe
                    src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                    title={post.title}
                    className="h-[80vh] w-full bg-[var(--slot4-warm)]"
                  />
                </div>
              </EditableReveal>
            ) : null}

            {/* Two-column body */}
            <EditableReveal index={1}>
              <h2 className="editable-display mt-14 text-[32px] font-bold leading-[1.1] tracking-[-0.02em] sm:text-[38px]">
                About this reference
              </h2>
            </EditableReveal>
            <div className="mt-8 sm:columns-2 sm:gap-10">
              <BodyContent post={post} pdf />
            </div>

            {tagsOf(post).length ? (
              <div className="mt-10 flex flex-wrap gap-2">
                {tagsOf(post).map((tag) => (
                  <span
                    key={tag}
                    className="editable-emphasis rounded-full border border-[var(--tk-line)] bg-white px-4 py-1.5 text-[13px] italic text-[var(--tk-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            {/* Repeated CTA at the bottom of the article (references pattern) */}
            {fileUrl ? (
              <div className="mt-14 border-y border-[var(--tk-line)] py-10 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-accent)]">Ready when you are</p>
                <h3 className="editable-display mx-auto mt-3 max-w-2xl text-[28px] font-bold leading-tight tracking-[-0.02em] sm:text-[32px]">
                  Keep a copy of this reference for later.
                </h3>
                <div className="mt-6 flex justify-center gap-3">
                  <a
                    href={fileUrl}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-[2px] bg-[var(--slot4-accent-fill)] px-6 text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[var(--slot4-accent-hover)]"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="h-4 w-4" /> Download PDF
                  </a>
                </div>
              </div>
            ) : null}

            {/* Article-bottom ad required by placement rules */}
            <div className="mt-12">
              <Ads slot="article-bottom" size={pickRandom(getSlotSizes('article-bottom'))} showLabel className="mx-auto w-full" />
            </div>
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* Document identity block — display-face glyph, filename, metadata */}
            <div className="border border-[var(--tk-line)] bg-white p-6">
              <div className="flex h-24 w-full items-center justify-center bg-[var(--slot4-warm)]">
                <span className="editable-display text-[52px] font-black text-[var(--tk-accent)]">{format}</span>
              </div>
              <p className="editable-display mt-5 line-clamp-2 text-[18px] font-bold leading-tight tracking-[-0.01em]">
                {post.title}
              </p>
              <div className="mt-5 divide-y divide-[var(--tk-line)] text-[13px]">
                {[
                  ['Category', category],
                  ['Pages', String(pages)],
                  ['File size', size],
                  ['Uploaded by', uploaded],
                  ['Updated', updatedLabel],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-3 py-2.5">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--tk-muted)]">{label}</span>
                    <span className="max-w-[60%] truncate text-right font-semibold text-[var(--tk-text)]">{value}</span>
                  </div>
                ))}
              </div>
              {fileUrl ? (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[2px] bg-[var(--slot4-accent-fill)] px-5 text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[var(--slot4-accent-hover)]"
                >
                  <Download className="h-4 w-4" /> Download
                </a>
              ) : null}
            </div>

            {/* What's inside */}
            <div className="border border-[var(--tk-line)] bg-white p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-accent)]">What&apos;s inside</p>
              <h3 className="editable-display mt-3 text-[18px] font-bold leading-tight tracking-[-0.01em]">Sections you&apos;ll find</h3>
              <ul className="mt-4 space-y-2.5 text-[14px]">
                {(outline.length ? outline : ['Overview', 'Background', 'Findings', 'References']).map((row, i) => (
                  <li key={`${row}-${i}`} className="flex items-start gap-3 text-[var(--tk-text)]">
                    <span className="editable-display mt-0.5 text-[13px] font-black text-[var(--tk-accent)]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{row}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* Related documents strip — glyph tiles, no photography */}
      <PdfRelatedStrip related={related} />
    </>
  )
}

/* Related strip specifically for Reference Library — no hero photography. */
function PdfRelatedStrip({ related }: { related: SitePost[] }) {
  if (!related.length) return null
  const taskConfig = getTaskConfig('pdf')
  return (
    <section className="border-t border-[var(--tk-line)] bg-[var(--slot4-warm)]">
      <div className="mx-auto w-full max-w-[var(--editable-container-wide)] px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex items-end justify-between gap-4 border-b border-[var(--tk-line)] pb-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-accent)]">Related references</p>
            <h2 className="editable-display mt-3 text-[30px] font-bold tracking-[-0.02em] sm:text-[36px]">More from the library</h2>
          </div>
          <Link
            href={taskConfig?.route || '/pdf'}
            className="editable-label inline-flex items-center gap-2 text-[var(--tk-text)]"
          >
            See all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => {
            const size = getField(item, ['size', 'fileSize', 'filesize']) || '—'
            const format = (getField(item, ['format', 'fileType']) || 'PDF').toUpperCase()
            return (
              <Link
                key={item.id || item.slug}
                href={`${taskConfig?.route || '/pdf'}/${item.slug}`}
                className="group block border border-[var(--tk-line)] bg-white p-6 transition hover:border-[var(--tk-accent)]"
              >
                <div className="flex h-24 w-full items-center justify-center bg-[var(--slot4-warm)]">
                  <span className="editable-display text-[36px] font-black text-[var(--tk-accent)]">{format}</span>
                </div>
                <h3 className="editable-display mt-5 line-clamp-3 text-[18px] font-bold leading-tight tracking-[-0.01em]">
                  <span className="editable-underline-ochre">{item.title}</span>
                </h3>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--tk-muted)]">{size}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   Classified detail — value-forward listing
   ============================================================ */
function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])

  return (
    <>
      <section className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
        <BackLink task="classified" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="border border-[var(--tk-line)] bg-white p-7">
              <Kicker task="classified">Notice</Kicker>
              <h1 className="editable-display mt-4 text-[26px] font-bold leading-tight tracking-[-0.02em]">{post.title}</h1>
              <p className="editable-display mt-6 text-[36px] font-black tracking-[-0.02em] text-[var(--tk-accent)]">
                {price || 'Open offer'}
              </p>
              <div className="mt-5 space-y-2.5">
                {condition ? <BadgeLine label="Condition" value={condition} /> : null}
                {location ? <BadgeLine label="Location" value={location} /> : null}
              </div>
              <div className="mt-7 flex flex-wrap gap-2">
                {phone ? (
                  <a href={`tel:${phone}`} className="inline-flex h-11 items-center gap-2 rounded-[2px] bg-[var(--tk-accent)] px-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-white">
                    <Phone className="h-4 w-4" /> Call
                  </a>
                ) : null}
                {email ? (
                  <a href={`mailto:${email}`} className="inline-flex h-11 items-center gap-2 rounded-[2px] border border-[var(--tk-line)] px-4 text-[12px] font-semibold uppercase tracking-[0.14em]">
                    <Mail className="h-4 w-4" /> Email
                  </a>
                ) : null}
              </div>
            </div>
          </aside>
          <article className="min-w-0">
            <ImageStrip images={images} label="Offer images" large />
            <BodyContent post={post} />
          </article>
        </div>
      </section>
      <RelatedStrip task="classified" related={related} />
    </>
  )
}

/* ============================================================
   Image detail — gallery-led
   ============================================================ */
function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const gallery = images.length ? images : ['/placeholder.svg?height=900&width=1200']
  return (
    <>
      <section className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
        <BackLink task="image" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="columns-1 gap-5 [column-fill:_balance] sm:columns-2">
            {gallery.map((image, index) => (
              <figure key={`${image}-${index}`} className="mb-5 break-inside-avoid overflow-hidden bg-white">
                <img src={image} alt="" className="w-full object-cover" />
              </figure>
            ))}
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="inline-flex items-center gap-2 border border-[var(--tk-line)] bg-white px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--tk-muted)]">
              <Camera className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> Image story
            </div>
            <h1 className="editable-display mt-8 text-[38px] font-bold leading-[1.05] tracking-[-0.02em] sm:text-[52px]">
              {post.title}
            </h1>
            {leadText(post) ? (
              <p className="editable-emphasis mt-6 text-[19px] leading-[1.6] italic text-[var(--tk-muted)]">{leadText(post)}</p>
            ) : null}
            <BodyContent post={post} compact />
          </aside>
        </div>
      </section>
      <RelatedStrip task="image" related={related} />
    </>
  )
}

/* ============================================================
   Bookmark detail — single curated resource
   ============================================================ */
function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <>
      <article className="mx-auto max-w-3xl px-5 py-14 sm:px-6 sm:py-20">
        <BackLink task="sbm" />
        <div className="mt-10 flex h-16 w-16 items-center justify-center bg-[var(--slot4-warm)] text-[var(--tk-accent)]">
          <Bookmark className="h-7 w-7" />
        </div>
        <div className="mt-6"><Kicker task="sbm">Saved shelf</Kicker></div>
        <h1 className="editable-display mt-4 text-[40px] font-bold leading-[1.05] tracking-[-0.02em] sm:text-[52px]">
          {post.title}
        </h1>
        {leadText(post) ? (
          <p className="editable-emphasis mt-8 text-[20px] leading-[1.6] italic text-[var(--tk-muted)]">{leadText(post)}</p>
        ) : null}
        {website ? (
          <Link
            href={website}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-[2px] bg-[var(--tk-accent)] px-6 text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[var(--slot4-accent-hover)]"
          >
            Open resource <ExternalLink className="h-4 w-4" />
          </Link>
        ) : null}
        <BodyContent post={post} />
      </article>
      <RelatedStrip task="sbm" related={related} />
    </>
  )
}

/* ============================================================
   Profile detail — identity-first, sticky portrait
   ============================================================ */
function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <>
      <section className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
        <BackLink task="profile" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="border border-[var(--tk-line)] bg-white p-8 text-center">
              <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-[var(--tk-line)] bg-[var(--slot4-warm)]">
                {images[0] ? (
                  <img src={images[0]} alt="" className="h-full w-full object-cover" />
                ) : (
                  <UserRound className="h-14 w-14 text-[var(--tk-muted)]" />
                )}
              </div>
              <h1 className="editable-display mt-6 text-[24px] font-bold tracking-[-0.02em]">{post.title}</h1>
              {role ? (
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--tk-accent)]">{role}</p>
              ) : null}
              <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                {website ? (
                  <Link
                    href={website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-[2px] bg-[var(--tk-accent)] px-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-white"
                  >
                    Website <ExternalLink className="h-4 w-4" />
                  </Link>
                ) : null}
                {email ? (
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex h-11 items-center gap-2 rounded-[2px] border border-[var(--tk-line)] px-4 text-[12px] font-semibold uppercase tracking-[0.14em]"
                  >
                    <Mail className="h-4 w-4" /> Email
                  </a>
                ) : null}
              </div>
            </div>
          </aside>
          <article className="min-w-0">
            <Kicker task="profile">Contributor</Kicker>
            <BodyContent post={post} />
            <ImageStrip images={images.slice(1)} label="Gallery" />
          </article>
        </div>
      </section>
      <RelatedStrip task="profile" related={related} />
    </>
  )
}

/* ============================================================
   Shared building blocks
   ============================================================ */
function BodyContent({ post, compact = false, pdf = false }: { post: SitePost; compact?: boolean; pdf?: boolean }) {
  return (
    <div
      className={`article-content mt-8 max-w-none text-[var(--tk-text)] ${
        compact ? 'text-[15px] leading-[1.7]' : 'text-[17px] leading-[1.8]'
      } ${pdf ? 'break-inside-avoid' : ''}`}
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-12">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-accent)]">{label}</p>
      <div className={`mt-4 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => (
          <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] object-cover" />
        ))}
      </div>
    </section>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border border-[var(--tk-line)] bg-[var(--slot4-warm)] px-4 py-3 text-sm">
      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--tk-muted)]">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}

function RelatedStrip({ task, related, label }: { task: TaskKey; related: SitePost[]; label?: string }) {
  if (!related.length) return null
  const taskConfig = getTaskConfig(task)
  const theme = getTaskTheme(task)
  return (
    <section className="border-t border-[var(--tk-line)] bg-[var(--slot4-warm)]">
      <div className="mx-auto w-full max-w-[var(--editable-container-wide)] px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex items-end justify-between gap-4 border-b border-[var(--tk-line)] pb-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-accent)]">More like this</p>
            <h2 className="editable-display mt-3 text-[30px] font-bold tracking-[-0.02em] sm:text-[36px]">
              {label || `More on ${theme.kicker}`}
            </h2>
          </div>
          <Link href={taskConfig?.route || '/'} className="editable-label inline-flex items-center gap-2 text-[var(--tk-text)]">
            See all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => (
            <RelatedCard key={item.id || item.slug} task={task} post={item} />
          ))}
        </div>
      </div>
    </section>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const image = getImages(post)[0]
  const href = `${getTaskConfig(task)?.route || `/${task}`}/${post.slug}`
  return (
    <Link href={href} className="group block bg-white">
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--slot4-warm)]">
        {image ? (
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-[500ms] group-hover:scale-[1.03]" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <FileText className="h-7 w-7 text-[var(--tk-muted)]" />
          </div>
        )}
      </div>
      <div className="p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-accent)]">
          {categoryOf(post, 'Feature')}
        </p>
        <h3 className="editable-display mt-3 line-clamp-3 text-[18px] font-bold leading-[1.25] tracking-[-0.01em]">
          <span className="editable-underline-ochre">{post.title}</span>
        </h3>
        <p className="mt-3 line-clamp-2 text-[14px] leading-[1.7] text-[var(--tk-muted)]">
          {stripHtml(summaryText(post))}
        </p>
      </div>
    </Link>
  )
}

// Kept references so tree-shaking never removes them if consumed externally.
export const _pdfOutlineIcon = Layers
export const _pdfTagIcon = Tag
