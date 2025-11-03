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

## External Dependencies

**Frontend**
-   **React Ecosystem**: React 18, React DOM, Wouter.
-   **UI Framework**: Radix UI primitives, shadcn/ui.
-   **Styling**: Tailwind CSS, PostCSS.
-   **Forms**: React Hook Form, Zod.
-   **State Management**: TanStack Query.
-   **Utilities**: `clsx`, `class-variance-authority`, `date-fns`, `lucide-react`.

**Backend**
-   **Server**: Express.js, `tsx`.
-   **Database ORM**: Drizzle ORM (configured for PostgreSQL).
-   **Validation**: Zod.

**Database & Cloud Services**
-   **Database**: Neon serverless PostgreSQL.
-   **Authentication**: Supabase Auth.
-   **Session Management**: `connect-pg-simple` for PostgreSQL session store.

**Development Tools**
-   **Build System**: Vite, ESBuild.
-   **Language**: TypeScript.
-   **Linting**: ESLint.
-   **ORM Utilities**: `drizzle-kit` for migrations.