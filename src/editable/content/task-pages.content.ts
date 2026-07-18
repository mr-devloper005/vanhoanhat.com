import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

// Underlying task keys (listing, pdf) are unchanged; only display labels vary.
export const taskPageVoices = {
  article: {
    eyebrow: 'Editorial desk',
    headline: 'Long-form reads with a calmer editorial rhythm.',
    description: 'Essays, guides and story-led posts. Read at a magazine pace, not a feed pace.',
    filterLabel: 'Choose a topic',
    secondaryNote: 'Reading surfaces reward hierarchy, whitespace and quiet typography.',
    chips: ['Editorial pacing', 'Topic filters', 'Long-read friendly'],
  },
  classified: {
    eyebrow: 'Notice board',
    headline: 'Fast-moving classifieds, offers and time-sensitive posts.',
    description: 'Quick to scan, practical and action-oriented. No editorial decoration.',
    filterLabel: 'Filter classified category',
    secondaryNote: 'Prioritise urgency, short summaries and direct browsing.',
    chips: ['Fast scan', 'Offers', 'Action cues'],
  },
  sbm: {
    eyebrow: 'Saved shelves',
    headline: 'Bookmarked collections arranged like curated shelves.',
    description: 'Group useful resources, tools and references worth returning to.',
    filterLabel: 'Filter collection',
    secondaryNote: 'Curated resources need grouping and calm metadata.',
    chips: ['Collections', 'Resources', 'Reference flow'],
  },
  profile: {
    eyebrow: 'Contributors',
    headline: 'The people and organisations behind the work.',
    description: 'Identity, trust and reputation cues come first — the feed comes after.',
    filterLabel: 'Filter profile category',
    secondaryNote: 'Make identity and credibility visible before the grid begins.',
    chips: ['Identity first', 'Trust cues', 'Contributor cards'],
  },
  pdf: {
    eyebrow: 'Reference Library',
    headline: 'A quiet library of guides, reports and reference material.',
    description: 'Every entry is a downloadable reference — preview inline, keep locally, cite as you need.',
    filterLabel: 'Filter reference type',
    secondaryNote: 'Archive cues, file context and clear browsing over hero photography.',
    chips: ['Guides', 'Reports', 'Reference-ready'],
  },
  listing: {
    eyebrow: 'Local Directory',
    headline: 'Local places built for discovery, comparison and trust.',
    description: 'Directory-style browsing with location, hours and trust cues on every card.',
    filterLabel: 'Filter category',
    secondaryNote: 'Prioritise comparison, location and direct action paths.',
    chips: ['Directory', 'Compare', 'Local discovery'],
  },
  image: {
    eyebrow: 'Visual desk',
    headline: 'A gallery-first browsing experience.',
    description: 'Image posts should lead with visual impact and a portfolio-like rhythm.',
    filterLabel: 'Filter visual category',
    secondaryNote: 'Let images carry the page before long text does.',
    chips: ['Gallery', 'Visual-first', 'Portfolio mood'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
