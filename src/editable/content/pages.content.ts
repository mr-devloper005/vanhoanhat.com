import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'A local directory and a reference library, quietly curated',
      description: `${slot4BrandConfig.siteName} pairs a curated local directory with a downloadable reference library — trusted places to visit and useful references to keep.`,
      openGraphTitle: 'A local directory and a reference library',
      openGraphDescription: `${slot4BrandConfig.siteName} pairs a curated local directory with a downloadable reference library.`,
      keywords: ['local directory', 'reference library', 'community directory', 'downloadable references'],
    },
    hero: {
      badge: 'Curated locally · updated weekly',
      title: ['A quieter home for', 'places that matter and references worth keeping.'],
      description:
        `${slot4BrandConfig.siteName} is a hand-picked directory of local places and a small library of downloadable references — no infinite feed, no autoplay, just work worth returning to.`,
      primaryCta: { label: 'Browse the directory', href: '/listings' },
      secondaryCta: { label: 'Open the library', href: '/pdf' },
      searchPlaceholder: 'Search directory listings and references…',
      focusLabel: 'This week',
      featureCardBadge: 'Editors’ pick',
      featureCardTitle: 'A closer look at what’s worth your time this week.',
      featureCardDescription:
        'Featured entries are chosen by our editors — a place, a report, or a reference we think holds up beyond the news cycle.',
    },
    intro: {
      badge: 'About this platform',
      title: 'Two ways in: a directory of places, and a shelf of references.',
      paragraphs: [
        'Every entry in the directory is reviewed by our editors before it appears. Every reference in the library is a downloadable file you can keep locally.',
        'Together they read like a small independent guide — one you can trust because it isn’t trying to be endless.',
        'Contributors can submit places to review and references to publish, and we curate what lands here.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Editor-reviewed local directory with location, hours, and contact rows on every entry.',
        'Downloadable reference library — previewable inline, downloadable in one click.',
        'Editorial pacing over infinite feeds; whitespace over algorithmic pressure.',
        'Community submissions, curated locally.',
      ],
      primaryLink: { label: 'Browse the directory', href: '/listings' },
      secondaryLink: { label: 'Open the library', href: '/pdf' },
    },
    cta: {
      badge: 'Contribute',
      title: 'Add a place, upload a reference, or start a conversation.',
      description:
        `Contributors keep ${slot4BrandConfig.siteName} useful. Submit a listing to review, share a reference for the library, or reach out with a question.`,
      primaryCta: { label: 'Submit yours', href: '/create' },
      secondaryCta: { label: 'Get in touch', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest in {label}',
      descriptionSuffix: 'Recently added, still worth a look.',
    },
  },
  about: {
    badge: 'About',
    title: 'A quieter directory. A small, useful library.',
    description: `${slot4BrandConfig.siteName} is an independent editorial platform pairing a curated local directory with a downloadable reference library.`,
    paragraphs: [
      'We built this because most directories are junk drawers and most reference libraries are paywalled. We wanted something in between — small, edited, trusted.',
      'Every listing is reviewed by an editor before it appears. Every reference is stored as a downloadable file that you can keep. Nothing here disappears behind a login.',
      'Contributors add places and references we all benefit from. Editors keep the shelves tidy.',
    ],
    values: [
      {
        title: 'Editor-reviewed entries',
        description: 'Nothing is auto-published. Every listing and reference is looked at before it lands here.',
      },
      {
        title: 'Downloadable, not gated',
        description: 'Reference files download in a click. No paywall, no drip funnel, no popup.',
      },
      {
        title: 'Slow, not endless',
        description: 'Editorial pacing over feed pressure — whitespace, serifs, and work worth revisiting.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Talk to an editor.',
    description:
      'Suggest a place for the directory, share a reference for the library, or ask about how curation works. We reply personally — no ticketing system, no autoresponders.',
    formTitle: 'Send a message',
  },
  search: {
    metadata: {
      title: 'Search',
      description: 'Search directory listings and downloadable references across the site.',
    },
    hero: {
      badge: 'Search',
      title: 'Find a place or a reference.',
      description: 'Search by keyword, filter by category or type, and land on what you were actually looking for.',
      placeholder: 'Search by keyword, category, or title…',
    },
    resultsTitle: 'Latest entries',
  },
  create: {
    metadata: {
      title: 'Submit',
      description: 'Submit a directory listing or upload a reference to the library.',
    },
    locked: {
      badge: 'Contributor access',
      title: 'Sign in to submit an entry.',
      description:
        'Contributors sign in to add listings to the directory or upload references to the library. Editors review every submission before it lands here.',
    },
    hero: {
      badge: 'Contributor workspace',
      title: 'Submit a listing or a reference.',
      description:
        'Choose what you’re contributing, fill in the details, and hit submit. An editor will take it from there.',
    },
    formTitle: 'Entry details',
    submitLabel: 'Submit entry',
    successTitle: 'Entry received. Thanks for contributing.',
  },
  auth: {
    login: {
      metadataDescription: `Sign in to ${slot4BrandConfig.siteName}.`,
      badge: 'Contributor access',
      title: 'Sign back in.',
      description:
        'Contributors sign in to submit directory listings and reference files. Readers don’t need an account — nothing here is gated.',
      formTitle: 'Sign in',
      submitLabel: 'Sign in',
      noAccount: 'No account matched those details. Create one first, then sign in.',
      success: 'Signed in. Redirecting…',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: `Create a contributor account on ${slot4BrandConfig.siteName}.`,
      badge: 'Contributor access',
      title: 'Get started as a contributor.',
      description:
        'Create an account to submit listings and reference files. Editors will review each entry before it appears.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created. Redirecting…',
      loginCta: 'Sign in instead',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'More editorial',
      fallbackTitle: 'Editorial entry',
    },
    listing: {
      relatedTitle: 'More on the directory',
      fallbackTitle: 'Directory entry',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Visual entry',
    },
    profile: {
      relatedTitle: 'More contributors',
      fallbackDescription: 'Contributor details will appear here once available.',
      visitButton: 'Visit their site',
    },
  },
} as const
