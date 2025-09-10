// POST CATEGORIES MVP - Re-export canonical categories from shared schema
// All core category logic has been moved to shared/schema.ts for backend/frontend consistency

export {
  POST_CATEGORIES,
  type PostCategorySlug,
  LEGACY_CATEGORY_MAP,
  getCategoryLabel,
  normalizeCategoryToSlug
} from "@shared/schema";