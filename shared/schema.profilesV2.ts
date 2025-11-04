import { pgTable, varchar, text, timestamp, jsonb, pgEnum, boolean, smallint } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums for profile system
export const profileKindEnum = pgEnum("profile_kind_v2", ["CREATOR", "STUDIO"]);
export const visibilityLevelEnum = pgEnum("visibility_level_v2", ["PUBLIC", "MEMBERS", "PRIVATE"]);
export const accessStatusEnum = pgEnum("access_status_v2", ["PENDING", "APPROVED", "DENIED", "EXPIRED"]);

// Main profiles v2 table - supports multiple profiles per user
export const profilesV2 = pgTable("profiles_v2", {
  profileId: varchar("profile_id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),                  // FK to auth.users.id (logical)
  kind: profileKindEnum("kind").notNull(),              // CREATOR | STUDIO
  handle: text("handle").notNull().unique(),            // lowercase unique
  displayName: text("display_name").notNull(),          // avatar name or real name
  headline: text("headline"),                           // tagline/one-liner
  about: text("about"),
  platforms: text("platforms").array().default(sql`'{}'`),
  skills: text("skills").array().default(sql`'{}'`),
  links: jsonb("links").default(sql`'[]'::jsonb`),      // [{label,url}]
  profilePhotoUrl: text("profile_photo_url"),
  headerImageUrl: text("header_image_url"),
  gallery: jsonb("gallery").default(sql`'[]'::jsonb`),  // [{url,caption,alt,order}] cap=5 in app
  visibility: visibilityLevelEnum("visibility").notNull().default("PUBLIC"),
  isOpenToWork: boolean("is_open_to_work").notNull().default(false),
  isHiring: boolean("is_hiring").notNull().default(false),
  availabilityNote: text("availability_note"),
  quickFacts: jsonb("quick_facts"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Behind the Avi section - optional private section for Creator profiles
export const profileBTA = pgTable("profile_bta", {
  profileId: varchar("profile_id").primaryKey(),        // FK → profiles_v2.profile_id (logical)
  realName: text("real_name"),
  city: text("city"),
  timezone: text("timezone"),
  headshotUrl: text("headshot_url"),
  highlights: jsonb("highlights").default(sql`'[]'::jsonb`), // [{title,url}]
  sectionVisibility: visibilityLevelEnum("section_visibility").notNull().default("PRIVATE"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User account preferences - tracks active profile
export const accountPrefs = pgTable("account_prefs", {
  userId: varchar("user_id").primaryKey(),              // FK → auth.users.id (logical)
  lastActiveProfileId: varchar("last_active_profile_id"), // → profiles_v2.profile_id
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Access request system for private profiles/BTA sections
export const profileAccessRequests = pgTable("profile_access_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  targetProfileId: varchar("target_profile_id").notNull(), // → profiles_v2.profile_id
  requesterUserId: varchar("requester_user_id").notNull(), // → auth.users.id
  status: accessStatusEnum("status").notNull().default("PENDING"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Audit trail for handle changes
export const handleHistory = pgTable("handle_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  profileId: varchar("profile_id").notNull(),
  userId: varchar("user_id").notNull(),
  newHandle: text("new_handle").notNull(),
  changedAt: timestamp("changed_at").defaultNow(),
});

// Insert schemas for validation
export const insertProfileV2Schema = createInsertSchema(profilesV2).pick({
  userId: true,
  kind: true,
  handle: true,
  displayName: true,
  headline: true,
  about: true,
  platforms: true,
  skills: true,
  links: true,
  profilePhotoUrl: true,
  headerImageUrl: true,
  gallery: true,
  visibility: true,
  isOpenToWork: true,
  isHiring: true,
  availabilityNote: true,
}).extend({
  handle: z.string().min(3).max(20).regex(/^[a-z0-9_]+$/, "Handle must contain only lowercase letters, numbers, and underscores"),
  displayName: z.string().min(1).max(100),
  gallery: z.array(z.object({
    url: z.string(),
    caption: z.string().optional(),
    alt: z.string().optional(),
    order: z.number(),
  })).max(5, "Gallery can contain maximum 5 images"),
});

export const insertProfileBTASchema = createInsertSchema(profileBTA).pick({
  profileId: true,
  realName: true,
  city: true,
  timezone: true,
  headshotUrl: true,
  highlights: true,
  sectionVisibility: true,
});

export const insertAccountPrefsSchema = createInsertSchema(accountPrefs).pick({
  userId: true,
  lastActiveProfileId: true,
});

export const insertAccessRequestSchema = createInsertSchema(profileAccessRequests).pick({
  targetProfileId: true,
  requesterUserId: true,
  expiresAt: true,
});

// Type exports
export type ProfileV2 = typeof profilesV2.$inferSelect;
export type InsertProfileV2 = z.infer<typeof insertProfileV2Schema>;
export type ProfileBTA = typeof profileBTA.$inferSelect;
export type InsertProfileBTA = z.infer<typeof insertProfileBTASchema>;
export type AccountPrefs = typeof accountPrefs.$inferSelect;
export type InsertAccountPrefs = z.infer<typeof insertAccountPrefsSchema>;
export type ProfileAccessRequest = typeof profileAccessRequests.$inferSelect;
export type InsertAccessRequest = z.infer<typeof insertAccessRequestSchema>;
export type HandleHistory = typeof handleHistory.$inferSelect;

// Helper types
export type ProfileKind = "CREATOR" | "STUDIO";
export type VisibilityLevel = "PUBLIC" | "MEMBERS" | "PRIVATE";
export type AccessStatus = "PENDING" | "APPROVED" | "DENIED" | "EXPIRED";

export interface GalleryItem {
  url: string;
  caption?: string;
  alt?: string;
  order: number;
}

export interface LinkItem {
  label: string;
  url: string;
}

export interface HighlightItem {
  title: string;
  url: string;
}

// Public profile response (with BTA if allowed)
export interface PublicProfileV2 extends ProfileV2 {
  bta?: ProfileBTA | null;
  hasRequestedAccess?: boolean;
  accessRequestStatus?: AccessStatus | null;
}
