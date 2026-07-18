import type { CSSProperties } from 'react'

/*
  Editorial newspaper design contract.
  All downstream components consume these tokens via CSS vars — do not hardcode
  colors or fonts in JSX. Tuned to the newstoday.webflow.io reference:
  Merriweather display, Inter UI, Libre Baskerville emphasis, warm off-white
  surfaces, restrained blue accent, near-sharp 2px radii, no shadows.
*/

export const editableRootStyle = {
  '--slot4-page-bg': '#f7f6f5',
  '--slot4-page-text': '#3f3c38',
  '--slot4-panel-bg': '#f4f0ed',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#726e67',
  '--slot4-soft-muted-text': '#a09a97',
  '--slot4-accent': '#0787ca',
  '--slot4-accent-fill': '#0787ca',
  '--slot4-accent-hover': '#006aa2',
  '--slot4-accent-dark': '#004e77',
  '--slot4-accent-soft': '#d4e9ff',
  '--slot4-on-accent': '#ffffff',
  '--slot4-dark-bg': '#1f1d1b',
  '--slot4-dark-text': '#f7f6f5',
  '--slot4-media-bg': '#ece7e0',
  '--slot4-cream': '#f7f6f5',
  '--slot4-warm': '#f4f0ed',
  '--slot4-highlight-ochre': '#ecdea6',
  '--slot4-body-gradient': 'none',
  '--editable-page-bg': '#f7f6f5',
  '--editable-page-text': '#3f3c38',
  '--editable-container': '1140px',
  '--editable-container-wide': '1230px',
  '--editable-border': '#d6d3cb',
  '--editable-border-strong': '#b7b2ab',
  '--editable-nav-bg': '#f7f6f5',
  '--editable-nav-text': '#3f3c38',
  '--editable-nav-active': '#0787ca',
  '--editable-nav-active-text': '#ffffff',
  '--editable-cta-bg': '#3f3c38',
  '--editable-cta-text': '#ffffff',
  '--editable-search-bg': '#ffffff',
  '--editable-footer-bg': '#1f1d1b',
  '--editable-footer-text': '#e8e4de',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-warm)]',
  grayBg: 'bg-[var(--slot4-panel-bg)]',
  border: 'border-[var(--editable-border)]',
  darkBorder: 'border-white/12',
  shadow: '',
  shadowStrong: '',
  overlay: 'bg-[linear-gradient(180deg,rgba(31,29,27,0.05),rgba(31,29,27,0.78))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-6 lg:px-8',
    sectionWide: 'mx-auto w-full max-w-[var(--editable-container-wide)] px-5 sm:px-6 lg:px-8',
    sectionY: 'py-14 sm:py-20 lg:py-[80px]',
    sectionYLg: 'py-16 sm:py-24 lg:py-[120px]',
    sectionYSm: 'py-10 sm:py-14 lg:py-[60px]',
  },
  layout: {
    safeGrid: 'grid gap-8 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    rail: 'flex snap-x gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[280px] shrink-0 snap-start sm:w-[320px]',
    articleGrid: 'grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]',
  },
  type: {
    eyebrow: "text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent)] font-[var(--editable-font-body)]",
    heroTitle: "editable-display text-[40px] font-black leading-[1.05] tracking-[-0.02em] sm:text-[52px] lg:text-[64px]",
    sectionTitle: "editable-display text-[30px] font-bold leading-[1.15] tracking-[-0.02em] sm:text-[38px]",
    cardTitle: "editable-display text-[22px] font-bold leading-[1.2] tracking-[-0.01em] sm:text-[24px]",
    subTitle: "editable-display text-[18px] font-bold leading-[1.35]",
    body: "text-[16px] leading-[1.72] font-[var(--editable-font-body)]",
    emphasis: "editable-emphasis text-[20px] leading-[1.6] italic text-[var(--slot4-muted-text)]",
    meta: "text-[12px] font-medium text-[var(--slot4-muted-text)] font-[var(--editable-font-body)]",
  },
  surface: {
    card: `bg-[var(--slot4-surface-bg)] rounded-[2px]`,
    soft: `bg-[var(--slot4-warm)] rounded-[2px]`,
    dark: `rounded-[2px] bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]`,
    bordered: `bg-[var(--slot4-surface-bg)] rounded-[2px] border border-[var(--editable-border)]`,
  },
  button: {
    primary:
      "inline-flex h-12 items-center justify-center gap-2 rounded-[2px] bg-[var(--editable-cta-bg)] px-6 text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--editable-cta-text)] transition duration-300 hover:bg-[color-mix(in_oklab,var(--editable-cta-bg)_86%,#000)] active:scale-[0.99]",
    secondary:
      "inline-flex h-12 items-center justify-center gap-2 rounded-[2px] border border-[var(--slot4-page-text)] bg-transparent px-6 text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--slot4-page-text)] transition duration-300 hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-cream)] active:scale-[0.99]",
    accent:
      "inline-flex h-12 items-center justify-center gap-2 rounded-[2px] bg-[var(--slot4-accent-fill)] px-6 text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--slot4-on-accent)] transition duration-300 hover:bg-[var(--slot4-accent-hover)] active:scale-[0.99]",
    ghost:
      "inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--slot4-page-text)] editable-underline-ochre",
  },
  badge: {
    pill:
      "inline-flex items-center rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--slot4-page-text)]",
    accentPill:
      "inline-flex items-center rounded-full bg-[var(--slot4-accent-fill)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--slot4-on-accent)]",
    softPill:
      "inline-flex items-center rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--slot4-accent-dark)]",
  },
  media: {
    frame: `relative overflow-hidden rounded-[2px] ${editablePalette.mediaBg}`,
    frameFull: `relative overflow-hidden ${editablePalette.mediaBg}`,
    ratio: 'aspect-[16/9]',
    ratioWide: 'aspect-[21/9]',
    ratioPortrait: 'aspect-[4/5]',
  },
  motion: {
    lift: 'transition duration-500 hover:opacity-95',
    fade: 'transition duration-300',
    zoom: 'transition duration-500 group-hover:scale-[1.03]',
  },
} as const

export const aiLayoutRules = [
  'Change the palette in editableRootStyle first — every downstream component consumes those CSS variables.',
  'Keep page structure in src/editable/sections/HomeSections.tsx so the whole home experience is redesignable in one file.',
  'Use borderless cards with 16:9 image tops, uppercase eyebrows, Merriweather headlines.',
  'Do not add shadows — the reference uses whitespace and serif hierarchy for weight.',
  'Warm-ochre highlight (#ecdea6) is only a text-underline effect on hover, never a background.',
  'Every transition uses var(--ease-premium).',
  'Keep dynamic post fetching intact; never replace posts with mock arrays.',
] as const
