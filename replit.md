# VirtuoHub Community Platform

## Overview
VirtuoHub is a modern community platform for virtual world creators, featuring a three-column layout. It allows users to share content, engage with posts, and connect across virtual ecosystems like Second Life, Roblox, and VRChat. The platform includes specialized content types such as polls ("VHub Data Pulse") and Q&A ("Interview"), alongside extensive filtering and categorization. Key capabilities include a complete authentication system with Supabase, a two-step onboarding process with handle validation and avatar upload, route protection, and comprehensive profile management with secure API endpoints and Row Level Security (RLS). The business vision is to create a central hub for virtual world communities, fostering creation and collaboration.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

**Frontend Architecture**
-   React 18 with TypeScript and Vite.
-   Component-based architecture using shadcn/ui.
-   Three-column responsive layout.
-   Client-side routing with Wouter.
-   State management: TanStack Query for server state, React hooks for local state.
-   Theme support with light/dark mode.

**Backend Architecture**
-   Express.js REST API server with TypeScript.
-   In-memory storage for development.
-   RESTful endpoints for posts, users, and saved content.
-   Middleware for logging, JSON parsing, and error handling.

**UI/UX Design Philosophy**
-   Modern glass-morphism design with subtle shadows and transparency.
-   Consistent spacing and typography (Inter/Poppins fonts).
-   Purple accent color (`#7C3AED`).
-   Card-based layout with hover effects and smooth animations.
-   Mobile-responsive design.

**Data Models**
-   **Users**: ID, username, password, display name, avatar, bio, role, timestamps.
-   **Posts**: ID, author, title, content, images, category, platforms, pricing, type (regular/pulse/insight), poll data, engagement metrics.
-   **Saved Posts**: User-post relationships.
-   **Categories**: General, Assets for Sale, Jobs & Gigs, Collaboration & WIP, Industry News, Events & Meetups, Tips & Tutorials.
-   **Platforms**: Core Virtual Worlds (Roblox, VRChat, Second Life, IMVU, Meta Horizon Worlds), Game Development (Unity, Unreal Engine, Core, Dreams), Gaming Platforms (Fortnite Creative, Minecraft, GTA FiveM, The Sims, inZOI), Game Communities (Elder Scrolls Online, Fallout, Counter-Strike, Team Fortress 2), and Other.

**Technical Implementations & Features**
-   **Authentication & Onboarding**: Supabase Auth, two-step onboarding with handle validation and avatar upload, `OnboardingGuard` for route protection.
-   **Profile Management**: Secure API endpoints, RLS for `profiles_v2`, `profile_bta`, `account_prefs`, `profile_access_requests`, `handle_history` tables. Foreign key enforcement for referential integrity.
-   **Poll System**: Normalized API response structure for poll data, client-side defensive reading for backward compatibility, optimistic UI updates for voting, and streamlined poll creation UI. Poll data stored in `subtype_data` JSONB column.
-   **Image Display**: Reddit-style image display with shrink-to-fit for feed images (`object-contain`), and optimized for lightboxes.
-   **State Management Strategy**: TanStack Query for API data, React hooks for local UI state, Context providers for theme/notifications, query invalidation for real-time updates.
-   **Profiles v2 Avatar Upload**: Real image uploads to Supabase Storage with file validation, auto-save on upload, and avatar display in header and public profiles.

## Profiles v2 Avatar Upload

**Storage Bucket**: `avatars` bucket in Supabase Storage
-   **Configuration**: Public read access, 5MB file size limit
-   **Allowed formats**: PNG, JPEG, GIF, WEBP
-   **Created by**: `server/storageSetup.ts` on server startup

**Upload Flow**:
1. User clicks "Upload Photo" in `/settings/profile`
2. File is validated (type, size) client-side
3. Uploaded to `avatars/{user_id}/{timestamp-random}.{ext}` path
4. Public URL is retrieved and saved to `profiles_v2.profile_photo_url`
5. Profile cache is invalidated for immediate UI update

**URL Generation**: Supabase Storage public URLs via `getPublicUrl()` API

**Updated Components**:
-   `client/src/pages/profile-settings.tsx`: File upload UI replacing text input, uses `about` field for bio
-   `client/src/pages/public-profile.tsx`: Displays avatar from `profile_photo_url`, uses `about` field
-   `client/src/components/layout/header.tsx`: Shows v2 avatar in desktop and mobile headers
-   `client/src/hooks/useAvatarUpload.ts`: Upload logic with validation
-   `client/src/hooks/useV2Avatar.ts`: Fetches active profile avatar with stable query key

**Implementation Details**:
-   **Schema Field**: Uses `profiles_v2.about` (text column) for bio content
-   **Query Key Stability**: Uses `['v2-avatar', user?.id ?? 'none']` to prevent undefined cache keys
-   **Cache Invalidation**: After avatar upload, invalidates ['my-profile-v2'], ['profile-v2', handle], and ['v2-avatar', userId]
-   **Auto-save**: Avatar updates immediately on upload without requiring separate save action

**Known Issues**:
-   **PostgREST Schema Cache**: After schema changes, PostgREST may report "Could not find the 'about' column" (PGRST204) despite column existing in database. Resolution: Send `NOTIFY pgrst, 'reload schema';` or restart PostgREST service. Cache typically auto-refreshes within a few minutes.

## External Dependencies

**Frontend**
-   **React Ecosystem**: React 18, React DOM, Wouter.
-   **UI Framework**: Radix UI primitives, shadcn/ui.
-   **Styling**: Tailwind CSS, PostCSS.
-   **Forms**: React Hook Form, Zod.
-   **State Management**: TanStack Query.
-   **Utilities**: `clsx`, `class-variance-authority`, `date-fns`, `lucide-react`, `nanoid`.

**Backend**
-   **Server**: Express.js, `tsx`.
-   **Database ORM**: Drizzle ORM (configured for PostgreSQL).
-   **Validation**: Zod.

**Database & Cloud Services**
-   **Database**: Neon serverless PostgreSQL.
-   **Authentication**: Supabase Auth.
-   **Storage**: Supabase Storage for avatar uploads.
-   **Session Management**: `connect-pg-simple` for PostgreSQL session store.

**Development Tools**
-   **Build System**: Vite, ESBuild.
-   **Language**: TypeScript.
-   **Linting**: ESLint.
-   **ORM Utilities**: `drizzle-kit` for migrations.