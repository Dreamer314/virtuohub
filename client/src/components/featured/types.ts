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

export const featuredItems: FeaturedItem[] = [
  {
    id: '1',
    dateISO: '2024-12-31',
    tag: 'Creator Insights',
    type: 'Interview',
    title: 'Building Immersive Worlds with Next-Gen Tech',
    blurb: 'Learn how top creators are leveraging new tools and technologies to build more immersive virtual experiences.',
    ctaLabel: 'Read Interview',
    ctaHref: '/insights/building-immersive-worlds',
    imageSrc: '/attached_assets/generated_images/VRChat_cyberpunk_world_80607687.png',
    imageAlt: 'VRChat cyberpunk world showcase'
  },
  {
    id: '2',
    dateISO: '2024-12-30',
    tag: 'Tips & Guides',
    type: 'Article',
    title: 'Optimizing Performance in Virtual Worlds',
    blurb: 'Essential tips for creating lag-free experiences that work across all devices and platforms.',
    ctaLabel: 'View Guide',
    ctaHref: '/guides/performance-optimization',
    imageSrc: '/attached_assets/generated_images/Unity_metaverse_development_54c43114.png',
    imageAlt: 'Unity metaverse development'
  },
  {
    id: '3',
    dateISO: '2024-12-29',
    tag: 'Industry News',
    type: 'Article',
    title: 'The Future of Virtual Commerce',
    blurb: 'Exploring how virtual economies are evolving and creating new opportunities for creators.',
    ctaLabel: 'Learn More',
    ctaHref: '/news/virtual-commerce-future',
    imageSrc: '/attached_assets/generated_images/Roblox_game_development_597c5fdd.png',
    imageAlt: 'Roblox game development showcase'
  }
]