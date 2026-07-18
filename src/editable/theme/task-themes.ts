import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  Shared editorial-newspaper task surfaces.

  Every task shares one cohesive visual language: warm off-white surfaces,
  restrained blue accent, Merriweather display, Inter body. Only kicker/note
  copy varies per task. Tokens are delivered via CSS variables (`--tk-*`).
  Renamed user-visible labels: listing → "Local Directory", pdf → "Reference
  Library". The underlying task keys stay unchanged.
*/

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const DISPLAY = "'Merriweather', Georgia, 'Times New Roman', serif"
const BODY = "'Inter', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

const base = {
  dark: false,
  fontDisplay: DISPLAY,
  fontBody: BODY,
  bg: '#f7f6f5',
  surface: '#ffffff',
  raised: '#f4f0ed',
  text: '#3f3c38',
  muted: '#726e67',
  line: '#d6d3cb',
  accent: '#0787ca',
  accentSoft: '#d4e9ff',
  onAccent: '#ffffff',
  glow: 'rgba(7,135,202,0.08)',
  radius: '2px',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: {
    ...base,
    kicker: 'Editorial desk',
    note: 'Long-reads, guides and stories worth your time.',
  },
  listing: {
    ...base,
    kicker: 'Local Directory',
    note: 'Discover, compare and connect with places near you.',
  },
  classified: {
    ...base,
    kicker: 'Notice board',
    note: 'Fresh offers and time-sensitive posts ready to act on.',
  },
  image: {
    ...base,
    kicker: 'Visual desk',
    note: 'A visual feed of standout images and galleries.',
  },
  sbm: {
    ...base,
    kicker: 'Saved shelves',
    note: 'Curated collections of resources and links worth returning to.',
  },
  pdf: {
    ...base,
    kicker: 'Reference Library',
    note: 'Downloadable guides, reports and reference material.',
  },
  profile: {
    ...base,
    kicker: 'Contributors',
    note: 'Discover the creators and organisations behind the work.',
  },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
