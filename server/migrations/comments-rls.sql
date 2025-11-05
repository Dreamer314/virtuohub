-- Setup RLS policies for comments table in Supabase
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- Enable RLS on comments table
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (to allow re-running this script)
DROP POLICY IF EXISTS "Anyone can read comments" ON comments;
DROP POLICY IF EXISTS "Authenticated users can insert comments" ON comments;
DROP POLICY IF EXISTS "Users can update own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON comments;

-- Policy 1: Anyone (including unauthenticated) can read all comments
CREATE POLICY "Anyone can read comments"
ON comments FOR SELECT
TO anon, authenticated
USING (true);

-- Policy 2: Authenticated users can insert their own comments
CREATE POLICY "Authenticated users can insert comments"
ON comments FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = author_id);

-- Policy 3: Users can update their own comments
CREATE POLICY "Users can update own comments"
ON comments FOR UPDATE
TO authenticated
USING (auth.uid()::text = author_id)
WITH CHECK (auth.uid()::text = author_id);

-- Policy 4: Users can delete their own comments  
CREATE POLICY "Users can delete own comments"
ON comments FOR DELETE
TO authenticated
USING (auth.uid()::text = author_id);

-- Verify policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'comments';
