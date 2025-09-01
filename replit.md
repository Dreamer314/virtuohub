# VirtuoHub Community Platform

## Overview

VirtuoHub is a modern community platform designed for virtual world creators, featuring a three-column layout similar to Reddit/Twitter. The platform enables users to share content, engage with posts, and connect within various virtual world ecosystems including Second Life, Roblox, VRChat, and others. The application includes specialized content types like "VHub Data Pulse" polls and "Interview" Q&As, along with comprehensive filtering and categorization systems.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

**Frontend Architecture**
- React 18 with TypeScript using Vite as the build tool
- Component-based architecture with shadcn/ui design system
- Three-column responsive layout (left sidebar, main feed, right sidebar)
- Client-side routing with Wouter
- State management via TanStack Query for server state and React hooks for local state
- Theme support with light/dark mode toggle

**Backend Architecture**
- Express.js REST API server with TypeScript
- In-memory storage implementation (MemStorage class) for development
- RESTful endpoints for posts, users, and saved content
- Middleware for logging, JSON parsing, and error handling
- Development-only Vite integration for HMR

**Data Models**
- Users: ID, username, password, display name, avatar, bio, role, timestamps
- Posts: ID, author, title, content, images, category, platforms, pricing, type (regular/pulse/insight), poll data, engagement metrics
- Saved Posts: User-post relationships with timestamps
- Categories: All, General, Assets for Sale, Jobs & Gigs, Collaboration & WIP
- Platforms: Second Life, Roblox, IMVU, VRChat, GTA RP, The Sims, Other

**UI/UX Design Philosophy**
- Modern glass-morphism design with subtle shadows and transparency
- Consistent spacing and typography using Inter/Poppins fonts
- Purple accent color (#7C3AED) for primary actions and highlights
- Card-based layout with hover effects and smooth animations
- Mobile-responsive design with collapsible sidebars

**Component Architecture**
- Shared UI components in `/components/ui/` following shadcn/ui patterns
- Layout components for header, sidebars, and main content areas
- Specialized post components for different content types
- Form components with react-hook-form and Zod validation
- Modal dialogs for post creation and interactions

**State Management Strategy**
- TanStack Query for API data fetching, caching, and synchronization
- React hooks for local UI state (theme, modal visibility, form state)
- Context providers for theme and toast notifications
- Query invalidation patterns for real-time data updates

## External Dependencies

**Frontend Dependencies**
- React ecosystem: React 18, React DOM, React Router (Wouter)
- UI Framework: Radix UI primitives with shadcn/ui component library
- Styling: Tailwind CSS with custom design tokens and PostCSS
- Forms: React Hook Form with Zod validation and resolvers
- State Management: TanStack Query for server state management
- Utilities: clsx, class-variance-authority, date-fns, lucide-react icons

**Backend Dependencies**
- Server: Express.js with TypeScript support via tsx
- Database ORM: Drizzle ORM configured for PostgreSQL (currently using in-memory storage)
- Session Management: connect-pg-simple for PostgreSQL session store
- Validation: Zod schemas shared between frontend and backend
- Development: ESBuild for production builds, Vite for development

**Database Configuration**
- Drizzle ORM with PostgreSQL dialect configured
- Neon Database serverless driver for cloud PostgreSQL
- Schema definitions in shared module for type safety
- Migration system with drizzle-kit for schema changes

**Development Tools**
- Build System: Vite with React plugin and custom Replit integrations
- TypeScript: Strict configuration with path mapping for clean imports
- Linting: ESLint configuration (implied by project structure)
- Development Server: Hot module replacement with error overlay

**Third-Party Integrations**
- Font Loading: Google Fonts for Inter, Poppins, and other typefaces
- Cloud Database: Neon serverless PostgreSQL for production data storage
- Replit Platform: Custom Vite plugins for Replit development environment
- Session Storage: PostgreSQL-based session management for user authentication