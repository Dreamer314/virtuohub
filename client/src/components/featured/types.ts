export type FeaturedItem = {
  id: string
  dateISO: string
  tag: 'Interview' | 'Spotlight' | 'Tips & Guides' | 'Industry News' | 'Pulse Report' | 'Event'
  type?: 'Interview' | 'Article' | 'Video'
  title: string
  blurb: string
  ctaLabel: string
  ctaHref: string
  imageSrc: string
  imageAlt: string
}

import vrChatImage from '@assets/generated_images/VRChat_cyberpunk_world_80607687.png';
import unityImage from '@assets/generated_images/Unity_metaverse_development_54c43114.png';
import robloxImage from '@assets/generated_images/Roblox_game_development_597c5fdd.png';

export const featuredItems: FeaturedItem[] = [
  {
    id: '1',
    dateISO: '2024-12-31',
    tag: 'Interview',
    type: 'Interview',
    title: 'Building Immersive Worlds with Next-Gen Tech',
    blurb: 'Learn how top creators are leveraging new tools and technologies to build more immersive virtual experiences.',
    ctaLabel: 'Read Interview',
    ctaHref: '/interview/alex-chen-vrchat-worlds',
    imageSrc: vrChatImage,
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
    imageSrc: unityImage,
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
    imageSrc: robloxImage,
    imageAlt: 'Roblox game development showcase'
  }
]