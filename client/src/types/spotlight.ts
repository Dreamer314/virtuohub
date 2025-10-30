export type Spotlight = {
  id: string
  slug: string
  type: 'creator' | 'studio' | 'tool'
  name: string
  role: string
  about?: string
  stats?: { visits?: number; followers?: number; years?: number; location?: string }
  hero_image?: string | null
  tags?: string[] | null
  portfolio?: Array<{ title: string; category?: string; description?: string; statLabel?: string }>
  achievements?: string[]
  social?: { vrchat?: string; twitter?: string; discord?: string; website?: string }
  gallery?: string[]
  quick_facts?: Array<{ label: string; value: string }>
  published?: boolean
}
