import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  avatar: text("avatar").default(''),
  bio: text("bio").default(''),
  role: text("role").default('User'),
  createdAt: timestamp("created_at").defaultNow(),
});

export const posts = pgTable("posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  authorId: varchar("author_id").notNull(),
  subtype: text("subtype").notNull().default('thread'), // thread, poll, spotlight, interview, tip, news, trending, event, report, list
  title: text("title").notNull(),
  summary: text("summary"), // brief description/excerpt
  body: text("body").notNull(), // renamed from content for clarity
  tags: text("tags").array().default([]),
  platforms: text("platforms").array().notNull(),
  imageUrl: text("image_url").default(''),
  images: text("images").array().default([]),
  files: text("files").array().default([]),
  links: text("links").array().default([]),
  price: text("price").default(''),
  status: text("status").notNull().default('published'), // draft, published, archived
  
  // Subtype Extensions (using jsonb for flexibility)
  // event: { startTime, endTime, location, rsvpLink }
  // poll: { question, choices[], closesAt, oneVotePerUser }
  // spotlight: { subjectType, subjectProfileRef }
  // report: { dataPackRef, priceTier, methodologyRef }
  // list: { rankingPeriod, scoringVersion, entries[] }
  subtypeData: jsonb("subtype_data"),
  
  // Engagement metrics
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  shares: integer("shares").default(0),
  views: integer("views").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const savedPosts = pgTable("saved_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  postId: varchar("post_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const articles = pgTable("articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").notNull(),
  slug: text("slug").notNull().unique(),
  fullContent: text("full_content").notNull(),
  excerpt: text("excerpt").notNull(),
  readTime: integer("read_time").notNull(), // in minutes
  publishDate: timestamp("publish_date").defaultNow(),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  tags: text("tags").array().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const profiles = pgTable("profiles", {
  id: varchar("id").primaryKey(), // Matches Supabase Auth user ID
  handle: text("handle").unique(), // unique username for onboarding
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  role: text("role"),
  onboardingComplete: boolean("onboarding_complete").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const pulseReports = pgTable("pulse_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  price: integer("price").notNull(), // in cents
  fileUrl: varchar("file_url"),
  fileName: varchar("file_name"),
  publishedAt: timestamp("published_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const pulseReportPurchases = pgTable("pulse_report_purchases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reportId: varchar("report_id").notNull().references(() => pulseReports.id, { onDelete: "cascade" }),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }),
  stripeSessionId: varchar("stripe_session_id"),
  stripePaymentIntent: varchar("stripe_payment_intent"),
  amountCents: integer("amount_cents").notNull(),
  currency: varchar("currency").notNull().default("usd"),
  status: varchar("status").notNull().default("completed"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const pulseReportAccess = pgTable("pulse_report_access", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reportId: varchar("report_id").notNull().references(() => pulseReports.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  grantedAt: timestamp("granted_at").defaultNow(),
  grantedBy: varchar("granted_by"), // for manual admin grants
});

export const comments = pgTable("comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id"), // for post comments
  articleId: varchar("article_id"), // for article comments
  authorId: varchar("author_id").notNull(),
  content: text("content").notNull(),
  parentId: varchar("parent_id"), // for nested comments
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  avatar: true,
  bio: true,
});

// Unified Post Schema - Updated to support all content subtypes
export const insertPostSchema = createInsertSchema(posts).pick({
  title: true,
  summary: true,
  body: true,
  tags: true,
  platforms: true,
  imageUrl: true,
  images: true,
  files: true,
  links: true,
  price: true,
  status: true,
  subtypeData: true,
}).extend({
  subtype: z.enum(["thread", "poll", "spotlight", "interview", "tip", "news", "trending", "event", "report", "list"])
});

export const insertSavedPostSchema = createInsertSchema(savedPosts).pick({
  userId: true,
  postId: true,
});

export const insertArticleSchema = createInsertSchema(articles).pick({
  postId: true,
  slug: true,
  fullContent: true,
  excerpt: true,
  readTime: true,
  seoTitle: true,
  seoDescription: true,
  tags: true,
});

export const insertCommentSchema = createInsertSchema(comments).pick({
  articleId: true,
  authorId: true,
  content: true,
  parentId: true,
});

export const insertProfileSchema = createInsertSchema(profiles).pick({
  id: true,
  handle: true,
  displayName: true,
  avatarUrl: true,
  role: true,
  onboardingComplete: true,
});

export const insertPulseReportSchema = createInsertSchema(pulseReports).pick({
  title: true,
  description: true,
  price: true,
  fileUrl: true,
  fileName: true,
});

export const insertPulseReportPurchaseSchema = createInsertSchema(pulseReportPurchases).pick({
  reportId: true,
  userId: true,
  stripeSessionId: true,
  stripePaymentIntent: true,
  amountCents: true,
  currency: true,
  status: true,
});

export const insertPulseReportAccessSchema = createInsertSchema(pulseReportAccess).pick({
  reportId: true,
  userId: true,
  grantedBy: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;

export type InsertSavedPost = z.infer<typeof insertSavedPostSchema>;
export type SavedPost = typeof savedPosts.$inferSelect;

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;

export type InsertPulseReport = z.infer<typeof insertPulseReportSchema>;
export type PulseReport = typeof pulseReports.$inferSelect;

export type InsertPulseReportPurchase = z.infer<typeof insertPulseReportPurchaseSchema>;
export type PulseReportPurchase = typeof pulseReportPurchases.$inferSelect;

export type InsertPulseReportAccess = z.infer<typeof insertPulseReportAccessSchema>;
export type PulseReportAccess = typeof pulseReportAccess.$inferSelect;

export interface PostWithAuthor extends Post {
  author: User;
  isSaved?: boolean;
}

export interface ArticleWithPost extends Article {
  post: PostWithAuthor;
}

export interface CommentWithAuthor extends Comment {
  author: Profile;
  replies?: CommentWithAuthor[];
}

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

// POST CATEGORIES MVP - Legacy categories array for backwards compatibility
export const CATEGORIES = [
  'All',
  'general',
  'wip',
  'feedback',
  'tutorials',
  'hire-collab',
  'sell',
  'teams',
  'events',
  'platform-qa'
] as const;

export const PLATFORMS = [
  'Second Life',
  'Roblox',
  'IMVU',
  'VRChat',
  'Minecraft',
  'Unity',
  'Unreal Engine',
  'GTA RP',
  'The Sims',
  'Fortnite Creative',
  'Core Games',
  'Horizon Worlds',
  'NeosVR',
  'ChilloutVR',
  'Resonite',
  'Mozilla Hubs',
  'AltspaceVR',
  'RecRoom',
  'Sansar',
  'High Fidelity',
  'OpenSimulator',
  'Decentraland',
  'The Sandbox',
  'Cryptovoxels',
  'Somnium Space',
  'VR Chat',
  'Blender',
  'Maya',
  '3ds Max',
  'Substance',
  'Houdini',
  'ZBrush',
  'Other'
] as const;

export const POST_TYPES = [
  'regular',
  'pulse',
  'insight'
] as const;

export type Category = typeof CATEGORIES[number];
export type Platform = typeof PLATFORMS[number];
export type PostType = typeof POST_TYPES[number];
