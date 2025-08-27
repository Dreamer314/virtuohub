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

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;

export type InsertSavedPost = z.infer<typeof insertSavedPostSchema>;
export type SavedPost = typeof savedPosts.$inferSelect;

export interface PostWithAuthor extends Post {
  author: User;
  isSaved?: boolean;
}

export const CATEGORIES = [
  'All',
  'General',
  'Assets for Sale',
  'Jobs & Gigs',
  'Collaboration & WIP'
] as const;

export const PLATFORMS = [
  'Second Life',
  'Roblox',
  'IMVU',
  'VRChat',
  'GTA RP',
  'The Sims',
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
