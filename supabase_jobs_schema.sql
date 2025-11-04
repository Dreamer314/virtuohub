-- ========================================
-- VirtuoHub Job Board Schema
-- ========================================
-- Run this in your Supabase SQL Editor to create the jobs table and RLS policies
-- This enables the "Find Work" tab on /talent

-- ========================================
-- 1. Create the jobs table
-- ========================================
CREATE TABLE IF NOT EXISTS public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,  -- References auth.users(id) - the job poster
  title text NOT NULL,
  company_name text,
  primary_skill text NOT NULL,  -- Same vocabulary as profile primary skills
  platform text NOT NULL,        -- Single platform: Roblox, VRChat, Second Life, etc.
  job_type text NOT NULL,        -- Full-time, Part-time, Contract, One-off project, Internship
  budget text,                   -- Free-text range like "$1,000–$1,500"
  is_remote boolean NOT NULL DEFAULT true,
  location text,                 -- Optional city/region
  description text NOT NULL,     -- Full job description
  visibility text NOT NULL DEFAULT 'PUBLIC',  -- PUBLIC or DRAFT
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ========================================
-- 2. Create indexes for performance
-- ========================================
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON public.jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_visibility ON public.jobs(visibility);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_primary_skill ON public.jobs(primary_skill);
CREATE INDEX IF NOT EXISTS idx_jobs_platform ON public.jobs(platform);

-- ========================================
-- 3. Enable Row Level Security
-- ========================================
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 4. RLS Policies
-- ========================================

-- Policy 1: Anyone (anon or authenticated) can SELECT public jobs
CREATE POLICY "Anyone can view public jobs"
ON public.jobs
FOR SELECT
TO public
USING (visibility = 'PUBLIC');

-- Policy 2: Authenticated users can INSERT jobs (must set user_id to their own ID)
CREATE POLICY "Users can insert their own jobs"
ON public.jobs
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can UPDATE only their own jobs
CREATE POLICY "Users can update their own jobs"
ON public.jobs
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy 4: Users can DELETE only their own jobs
CREATE POLICY "Users can delete their own jobs"
ON public.jobs
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ========================================
-- 5. Verify policies were created
-- ========================================
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'jobs'
ORDER BY cmd, policyname;

-- ========================================
-- 6. Test query (same as frontend will use)
-- ========================================
-- This should return all public jobs, ordered by newest first
SELECT 
  id,
  title,
  company_name,
  primary_skill,
  platform,
  job_type,
  budget,
  is_remote,
  location,
  visibility,
  created_at
FROM public.jobs
WHERE visibility = 'PUBLIC'
ORDER BY created_at DESC
LIMIT 20;

-- ========================================
-- 7. Optional: Insert sample jobs for testing
-- ========================================
-- Uncomment and modify the user_id to match your test user if you want sample data

/*
INSERT INTO public.jobs (user_id, title, company_name, primary_skill, platform, job_type, budget, is_remote, description, visibility) VALUES
  ('your-user-id-here', '3D Modeler Needed for Fantasy Store', 'FantasyStore Co.', '3D Modeler', 'Second Life', 'Contract', '$1,000–$1,500', true, 'We need an experienced 3D modeler to create fantasy-themed items for our Second Life store. Must have experience with Blender and SL mesh upload.', 'PUBLIC'),
  ('your-user-id-here', 'Animator for VRChat Avatar Project', 'VirtuoHub Studios', 'Animator', 'VRChat', 'One-off project', '$500–$800', true, 'Looking for a skilled animator to create custom animations for VRChat avatars. Experience with Unity and humanoid rigs required.', 'PUBLIC'),
  ('your-user-id-here', 'Full-time World Builder', 'MetaWorld Inc', 'World Builder', 'Roblox', 'Full-time', '$60k–$80k/year', false, 'Join our team as a full-time world builder creating immersive experiences in Roblox. Must be comfortable with Lua scripting. Based in San Francisco.', 'PUBLIC');
*/
