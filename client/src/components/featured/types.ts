export type FeaturedItem = {
  id: string
  dateISO: string
  tag: 'Creator Insights' | 'Spotlight' | 'Tips & Guides' | 'Industry News' | 'Tech'
  type?: 'Interview' | 'Article' | 'Video'
  title: string
  blurb: string
  ctaLabel: string
  ctaHref: string
  imageSrc: string
  imageAlt: string
}