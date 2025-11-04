-- ========================================
-- STEP 1: Check current RLS policies
-- ========================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'profiles_v2'
ORDER BY policyname;

-- ========================================
-- STEP 2: Drop ALL existing SELECT policies (if any)
-- ========================================
-- Run this to clean up conflicting policies
DO $$ 
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE tablename = 'profiles_v2' 
    AND cmd = 'SELECT'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON profiles_v2', pol.policyname);
  END LOOP;
END $$;

-- ========================================
-- STEP 3: Create the correct RLS policies
-- ========================================

-- Enable RLS on profiles_v2 (if not already enabled)
ALTER TABLE profiles_v2 ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow ANYONE (anon + authenticated) to SELECT public talent profiles
CREATE POLICY "Anyone can view public talent profiles"
ON profiles_v2
FOR SELECT
TO public
USING (
  visibility = 'PUBLIC'
  AND (is_open_to_work = true OR is_hiring = true)
);

-- Policy 2: Allow authenticated users to SELECT their own profile (regardless of visibility)
CREATE POLICY "Users can view their own profile"
ON profiles_v2
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy 3: Allow authenticated users to INSERT their own profile
CREATE POLICY "Users can insert their own profile"
ON profiles_v2
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy 4: Allow authenticated users to UPDATE their own profile
CREATE POLICY "Users can update their own profile"
ON profiles_v2
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy 5: Allow authenticated users to DELETE their own profile
CREATE POLICY "Users can delete their own profile"
ON profiles_v2
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ========================================
-- STEP 4: Verify the policies were created
-- ========================================
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'profiles_v2'
ORDER BY cmd, policyname;

-- ========================================
-- STEP 5: Test the query (as if from frontend)
-- ========================================
-- This should return all public talent profiles
SELECT handle, display_name, is_open_to_work, is_hiring, visibility
FROM profiles_v2
WHERE visibility = 'PUBLIC'
  AND handle IS NOT NULL
  AND display_name IS NOT NULL
  AND (is_open_to_work = true OR is_hiring = true)
ORDER BY display_name
LIMIT 20;
