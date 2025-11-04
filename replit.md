# VirtuoHub Community Platform

## Overview
VirtuoHub is a community platform for virtual world creators, designed with a three-column layout to facilitate content sharing, engagement, and connection across virtual ecosystems like Second Life, Roblox, and VRChat. The platform supports specialized content types such as polls ("VHub Data Pulse") and Q&A ("Interview"), along with extensive filtering. It features a complete authentication system via Supabase, a two-step onboarding process including handle validation and avatar upload, robust route protection, and comprehensive profile management with secure API endpoints and Row Level Security (RLS). The overarching vision is to establish a central hub that fosters creation and collaboration within virtual world communities.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

**Frontend**
-   Built with React 18, TypeScript, and Vite, utilizing a component-based architecture with shadcn/ui.
-   Features a three-column responsive layout, client-side routing with Wouter, and state management via TanStack Query for server state and React hooks for local state.
-   Supports theme switching with light/dark modes.

**Backend**
-   An Express.js REST API server developed with TypeScript, using in-memory storage for development.
-   Provides RESTful endpoints for posts, users, and saved content, incorporating middleware for logging, JSON parsing, and error handling.

**UI/UX Design**
-   Employs a modern glass-morphism design with subtle shadows, transparency, and a consistent aesthetic.
-   Utilizes Inter/Poppins fonts, a purple accent color (`#7C3AED`), and a card-based layout with hover effects and smooth animations.
-   Fully mobile-responsive.

**Data Models**
-   Key entities include `Users`, `Posts` (with specialized types like polls and Q&A), `Saved Posts`, `Categories`, and `Platforms`.
-   `Profiles v2` schema includes `display_name`, `headline`, `handle`, `about`, `profile_photo_url`, `visibility`, `is_open_to_work`, `is_hiring`, `availability_note`, and a `quick_facts` JSONB for Creator Profile data.
-   `Jobs` schema includes `id`, `user_id`, `title`, `company_name`, `primary_skill`, `platform`, `job_type`, `budget`, `is_remote`, `location`, `description`, `visibility`, and `created_at` for job postings.

**Technical Implementations & Features**
-   **Authentication & Onboarding**: Implemented with Supabase Auth, including a two-step onboarding process with handle validation and avatar upload, secured by an `OnboardingGuard`.
-   **Profile Management**: Secure API endpoints with RLS on `profiles_v2` and related tables; supports real image uploads to Supabase Storage with client-side validation and preview-before-save functionality.
-   **Poll System**: Features a normalized API response, optimistic UI updates for voting, and streamlined creation, with data stored in a JSONB column.
-   **Creator Profile System**: Stores professional details (roles, platforms, tools, experience, portfolio, social links) in the `quick_facts` JSONB column, enabling creators to showcase their skills. Features a "Find Talent" directory for searching public creator profiles with comprehensive filtering.
-   **Job Board**: Integrated tab-based interface on `/talent` with "Find Talent" and "Find Work" tabs. Job listings include comprehensive filtering (skill required, platform, job type, search), formatted budget display, and remote-friendly indicators. Job posting form at `/jobs/new` with validation for title, skill, platform, type, budget, location, and description. Job detail pages at `/jobs/:id` display full job information with back navigation support via query parameters. Jobs are stored in a Supabase `jobs` table with RLS policies for public read and user-owned write access.
-   **State Management**: Leverages TanStack Query for server state, React hooks for local UI state, and Context providers for global concerns like themes and notifications, with query invalidation for real-time updates.

## External Dependencies

**Frontend Libraries**
-   **React Ecosystem**: React 18, React DOM, Wouter.
-   **UI**: Radix UI, shadcn/ui, Tailwind CSS, PostCSS.
-   **Forms**: React Hook Form, Zod.
-   **State Management**: TanStack Query.
-   **Utilities**: `clsx`, `class-variance-authority`, `date-fns`, `lucide-react`, `nanoid`.

**Backend Libraries**
-   **Server**: Express.js, `tsx`.
-   **Database ORM**: Drizzle ORM.
-   **Validation**: Zod.

**Cloud Services**
-   **Database**: Neon (PostgreSQL).
-   **Authentication**: Supabase Auth.
-   **Storage**: Supabase Storage.
-   **Session Management**: `connect-pg-simple`.

**Development Tools**
-   **Build**: Vite, ESBuild.
-   **Language**: TypeScript.
-   **Linting**: ESLint.
-   **ORM Utilities**: `drizzle-kit`.