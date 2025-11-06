-- ============================================
-- SQL Cleanup for Legacy posts.likes Column
-- ============================================
--
-- IMPORTANT: Run this in your Supabase Dashboard → SQL Editor
--
-- This script zeros out the legacy `posts.likes` column since we now
-- use the `post_likes` junction table as the single source of truth.
--
-- Background:
-- - Post likes are now computed from COUNT(*) on post_likes table
-- - The `posts.likes` column is no longer read or written by the app
-- - This cleanup ensures no confusion from stale data
--
-- Future Step:
-- - Once fully confident, you can DROP COLUMN likes from posts table
-- - For now, we just zero it out to keep the migration safe
--
-- ============================================

-- Zero out legacy likes column
UPDATE public.posts SET likes = 0;

-- Optional: Add a comment to the column to mark it as deprecated
COMMENT ON COLUMN public.posts.likes IS 'DEPRECATED: Use post_likes junction table instead';

-- Future cleanup (uncomment when ready to fully remove):
-- ALTER TABLE public.posts DROP COLUMN likes;
