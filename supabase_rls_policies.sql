-- Row Level Security Policies for profiles_v2
-- Run these commands in your Supabase SQL Editor

-- Enable Row Level Security on profiles_v2
ALTER TABLE profiles_v2 ENABLE ROW LEVEL SECURITY;

-- 1. Allow anyone (anon or authenticated) to SELECT public talent profiles
-- This enables the /talent directory to work for everyone
CREATE POLICY "Public talent profiles are viewable by anyone"
ON profiles_v2
FOR SELECT
USING (
  visibility = 'PUBLIC'
  AND (is_open_to_work = true OR is_hiring = true)
);

-- 2. Allow authenticated users to SELECT their own profile (regardless of visibility)
-- This lets users see their own profile even if it's PRIVATE
CREATE POLICY "Users can view their own profile"
ON profiles_v2
FOR SELECT
USING (auth.uid() = user_id);

-- 3. Allow authenticated users to INSERT their own profile
CREATE POLICY "Users can insert their own profile"
ON profiles_v2
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 4. Allow authenticated users to UPDATE their own profile
CREATE POLICY "Users can update their own profile"
ON profiles_v2
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 5. Allow authenticated users to DELETE their own profile
CREATE POLICY "Users can delete their own profile"
ON profiles_v2
FOR DELETE
USING (auth.uid() = user_id);

-- Verify policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'profiles_v2'
ORDER BY policyname;
