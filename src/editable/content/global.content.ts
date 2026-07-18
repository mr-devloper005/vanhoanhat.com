import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'Local directory & reference library',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Local directory & reference library',
    primaryLinks: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Get started', href: '/signup' },
      secondary: { label: 'Submit', href: '/create' },
    },
  },
  footer: {
    tagline: 'A quiet directory for the places and references that matter.',
    description:
      'An editorial home for a local directory and a reference library — carefully curated places to discover and downloadable references to keep. Independent, ad-supported and community-submitted.',
    columns: [
      {
        title: 'Discover',
        links: [
          { label: 'Local Directory', href: '/listings' },
          { label: 'Reference Library', href: '/pdf' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ],
      },
    ],
    bottomNote: 'Curated locally · updated weekly',
  },
  commonLabels: {
    readMore: 'Continue reading',
    viewAll: 'See everything',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
