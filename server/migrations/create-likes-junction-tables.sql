-- ============================================
-- Production-Grade Likes System
-- Junction Tables for Post & Comment Likes
-- ============================================
--
-- IMPORTANT: This SQL must be run in your Supabase project dashboard
-- (not the local development database).
-- 
-- Go to: Supabase Dashboard → SQL Editor → New Query → Paste this SQL → Run
--
-- These tables enable proper toggle-based likes with one-like-per-user enforcement.

-- Create post_likes junction table
CREATE TABLE IF NOT EXISTS public.post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id VARCHAR NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id VARCHAR NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id)
);

-- Create comment_likes junction table
CREATE TABLE IF NOT EXISTS public.comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id VARCHAR NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  user_id VARCHAR NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (comment_id, user_id)
);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================
-- 
-- NOTE: These policies use service role bypass for now (using true)
-- because the backend uses supabaseAdmin (service role key) to perform
-- like operations on behalf of users. The userId is sent in the API
-- request body and validated by the backend.
--
-- For stricter security in production, consider:
-- 1. Using auth.uid() checks if frontend calls Supabase directly
-- 2. Adding user_id = auth.uid() constraints
-- 3. Implementing server-side validation of userId claims
-- ============================================

-- Enable RLS on post_likes table
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

-- Allow service role (backend) to read all post likes
CREATE POLICY "Allow service role read access to post_likes"
  ON public.post_likes
  FOR SELECT
  USING (true);

-- Allow service role (backend) to insert post likes
-- Backend validates userId from request before inserting
CREATE POLICY "Allow service role to insert post_likes"
  ON public.post_likes
  FOR INSERT
  WITH CHECK (true);

-- Allow service role (backend) to delete post likes
-- Backend validates userId ownership before deleting
CREATE POLICY "Allow service role to delete post_likes"
  ON public.post_likes
  FOR DELETE
  USING (true);

-- Enable RLS on comment_likes table
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

-- Allow service role (backend) to read all comment likes
CREATE POLICY "Allow service role read access to comment_likes"
  ON public.comment_likes
  FOR SELECT
  USING (true);

-- Allow service role (backend) to insert comment likes
-- Backend validates userId from request before inserting
CREATE POLICY "Allow service role to insert comment_likes"
  ON public.comment_likes
  FOR INSERT
  WITH CHECK (true);

-- Allow service role (backend) to delete comment likes
-- Backend validates userId ownership before deleting
CREATE POLICY "Allow service role to delete comment_likes"
  ON public.comment_likes
  FOR DELETE
  USING (true);

-- ============================================
-- Indexes for Performance (Optional but Recommended)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON public.post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON public.post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON public.comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON public.comment_likes(user_id);
