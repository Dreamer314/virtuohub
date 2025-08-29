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
  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url").default(''),
  images: text("images").array().default([]),
  files: text("files").array().default([]),
  links: text("links").array().default([]),
  category: text("category").notNull(),
  platforms: text("platforms").array().notNull(),
  price: text("price").default(''),
  type: text("type").notNull().default('regular'), // regular, pulse, insight
  pollData: jsonb("poll_data"),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  shares: integer("shares").default(0),
  createdAt: timestamp("created_at").defaultNow(),
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

export const comments = pgTable("comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  articleId: varchar("article_id").notNull(),
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

export const insertPostSchema = createInsertSchema(posts).pick({
  title: true,
  content: true,
  imageUrl: true,
  images: true,
  files: true,
  links: true,
  category: true,
  platforms: true,
  price: true,
  type: true,
  pollData: true,
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

export interface PostWithAuthor extends Post {
  author: User;
  isSaved?: boolean;
}

export interface ArticleWithPost extends Article {
  post: PostWithAuthor;
}

export interface CommentWithAuthor extends Comment {
  author: User;
  replies?: CommentWithAuthor[];
}

export const CATEGORIES = [
  'All',
  'General',
  'Assets for Sale',
  'Jobs & Gigs',
  'Freelance/Hiring',
  'Collaborations',
  'WIP'
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
