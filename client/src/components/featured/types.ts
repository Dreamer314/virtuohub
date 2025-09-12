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
    title: 'Breaking Creative Blocks with AI Tools',
    blurb: 'Alex Chen shares how he uses generative AI to speed up concept art workflows — without losing the human touch. Practical tips for creators balancing efficiency with originality.',
    ctaLabel: 'Read Interview',
    ctaHref: '/thread/post4',
    imageSrc: vrChatImage,
    imageAlt: 'VRChat cyberpunk world showcase'
  },
  {
    id: '2',
    dateISO: '2024-12-30',
    tag: 'Interview',
    type: 'Article',
    title: 'From Sims Modding to Virtual World Design',
    blurb: 'How community modders are transforming hobbies into careers — and what game studios can learn from them.',
    ctaLabel: 'Read Article',
    ctaHref: '/thread/post5',
    imageSrc: unityImage,
    imageAlt: 'Unity metaverse development'
  },
  {
    id: '3',
    dateISO: '2024-12-29',
    tag: 'Interview',
    type: 'Article',
    title: 'The Future of Virtual Fashion',
    blurb: 'Digital clothing is no longer just for avatars. Creator Maria Lopez explains how her designs are crossing into AR, social media, and even real-world production.',
    ctaLabel: 'Read Article',
    ctaHref: '/thread/post6',
    imageSrc: robloxImage,
    imageAlt: 'Roblox game development showcase'
  }
]