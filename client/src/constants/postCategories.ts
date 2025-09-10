// POST CATEGORIES MVP - Canonical source of truth for post categories

export const POST_CATEGORIES = [
  { label: "Work in Progress (WIP)", slug: "wip" },
  { label: "Get Feedback", slug: "feedback" },
  { label: "Tutorials & Guides", slug: "tutorials" },
  { label: "Hire & Collaborate", slug: "hire-collab" },
  { label: "Sell Your Creations", slug: "sell" },
  { label: "Collabs & Teams", slug: "teams" },
  { label: "Events & Workshops", slug: "events" },
  { label: "Platform Q&A", slug: "platform-qa" },
  { label: "General", slug: "general" }
];

// POST CATEGORIES MVP - TypeScript type for category slugs
export type PostCategorySlug =
  | "wip" 
  | "feedback" 
  | "tutorials" 
  | "hire-collab" 
  | "sell" 
  | "teams" 
  | "events" 
  | "platform-qa" 
  | "general";

// POST CATEGORIES MVP - Legacy category mapping for backwards compatibility
export const LEGACY_CATEGORY_MAP: Record<string, PostCategorySlug> = {
  "WIP (Work in Progress)": "wip",
  "Help & Feedback": "feedback", 
  "Tutorials & Guides": "tutorials",
  "Jobs & Gigs": "hire-collab",
  "Assets for Sale": "sell",
  "Collabs & Teams": "teams",
  "Events & Workshops": "events",
  "Platform Q&A": "platform-qa",
  "General": "general"
};

// POST CATEGORIES MVP - Helper function to get category label from slug
export const getCategoryLabel = (slug: string): string => {
  const category = POST_CATEGORIES.find(cat => cat.slug === slug);
  if (category) {
    return category.label;
  }
  
  // Check legacy mapping
  const legacySlug = LEGACY_CATEGORY_MAP[slug];
  if (legacySlug) {
    const legacyCategory = POST_CATEGORIES.find(cat => cat.slug === legacySlug);
    return legacyCategory?.label || slug;
  }
  
  return slug;
};

// POST CATEGORIES MVP - Helper function to normalize category to slug
export const normalizeCategoryToSlug = (category: string): PostCategorySlug => {
  // Check if it's already a valid slug
  const validSlug = POST_CATEGORIES.find(cat => cat.slug === category);
  if (validSlug) {
    return validSlug.slug as PostCategorySlug;
  }
  
  // Check legacy mapping
  const legacySlug = LEGACY_CATEGORY_MAP[category];
  if (legacySlug) {
    return legacySlug;
  }
  
  // Default to general if no match found
  return "general";
};