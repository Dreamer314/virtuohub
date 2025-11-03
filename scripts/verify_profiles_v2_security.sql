-- ==============================================================================
-- Profiles v2 Security Verification Script
-- ==============================================================================
-- Purpose: Verify RLS policies, foreign keys, and data state for all v2 tables
-- ==============================================================================

\echo '================================================================================'
\echo 'PROFILES V2 SECURITY VERIFICATION'
\echo '================================================================================'
\echo ''

-- ==============================================================================
-- 1. VERIFY RLS IS ENABLED
-- ==============================================================================

\echo '1. RLS STATUS FOR V2 TABLES:'
\echo '----------------------------'

SELECT 
  tablename,
  CASE WHEN rowsecurity THEN '✅ ENABLED' ELSE '❌ DISABLED' END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profiles_v2', 'profile_bta', 'account_prefs', 'profile_access_requests', 'handle_history')
ORDER BY tablename;

\echo ''

-- ==============================================================================
-- 2. LIST ALL POLICIES
-- ==============================================================================

\echo '2. RLS POLICIES BY TABLE:'
\echo '-------------------------'

\echo ''
\echo 'profiles_v2 policies:'
SELECT 
  policyname,
  cmd as operation,
  CASE WHEN permissive = 'PERMISSIVE' THEN '✅' ELSE '⚠️' END as type
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'profiles_v2'
ORDER BY cmd, policyname;

\echo ''
\echo 'profile_bta policies:'
SELECT 
  policyname,
  cmd as operation,
  CASE WHEN permissive = 'PERMISSIVE' THEN '✅' ELSE '⚠️' END as type
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'profile_bta'
ORDER BY cmd, policyname;

\echo ''
\echo 'account_prefs policies:'
SELECT 
  policyname,
  cmd as operation,
  CASE WHEN permissive = 'PERMISSIVE' THEN '✅' ELSE '⚠️' END as type
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'account_prefs'
ORDER BY cmd, policyname;

\echo ''
\echo 'profile_access_requests policies:'
SELECT 
  policyname,
  cmd as operation,
  CASE WHEN permissive = 'PERMISSIVE' THEN '✅' ELSE '⚠️' END as type
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'profile_access_requests'
ORDER BY cmd, policyname;

\echo ''
\echo 'handle_history policies:'
SELECT 
  policyname,
  cmd as operation,
  CASE WHEN permissive = 'PERMISSIVE' THEN '✅' ELSE '⚠️' END as type
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'handle_history'
ORDER BY cmd, policyname;

\echo ''

-- ==============================================================================
-- 3. VERIFY FOREIGN KEYS
-- ==============================================================================

\echo '3. FOREIGN KEY CONSTRAINTS:'
\echo '---------------------------'

SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table,
  ccu.column_name AS foreign_column,
  rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints AS rc
  ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name IN ('profiles_v2', 'profile_bta', 'account_prefs', 'profile_access_requests', 'handle_history')
ORDER BY tc.table_name, kcu.column_name;

\echo ''

-- ==============================================================================
-- 4. ROW COUNTS
-- ==============================================================================

\echo '4. DATA STATE (Row Counts):'
\echo '----------------------------'

SELECT 'profiles_v2' as table_name, COUNT(*) as row_count FROM public.profiles_v2
UNION ALL
SELECT 'profile_bta', COUNT(*) FROM public.profile_bta
UNION ALL
SELECT 'account_prefs', COUNT(*) FROM public.account_prefs
UNION ALL
SELECT 'profile_access_requests', COUNT(*) FROM public.profile_access_requests
UNION ALL
SELECT 'handle_history', COUNT(*) FROM public.handle_history
ORDER BY table_name;

\echo ''

-- ==============================================================================
-- 5. POLICY COUNT SUMMARY
-- ==============================================================================

\echo '5. POLICY COUNT SUMMARY:'
\echo '------------------------'

SELECT 
  tablename,
  COUNT(*) as policy_count,
  CASE 
    WHEN COUNT(*) >= 4 THEN '✅ Complete'
    WHEN COUNT(*) > 0 THEN '⚠️ Partial'
    ELSE '❌ None'
  END as status
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('profiles_v2', 'profile_bta', 'account_prefs', 'profile_access_requests', 'handle_history')
GROUP BY tablename
ORDER BY tablename;

\echo ''

-- ==============================================================================
-- 6. SAMPLE POLICY DETAILS (FOR DEBUGGING)
-- ==============================================================================

\echo '6. SAMPLE POLICY DETAILS (profiles_v2):'
\echo '----------------------------------------'

SELECT 
  policyname,
  cmd,
  CASE 
    WHEN qual IS NOT NULL THEN 'Has USING clause' 
    ELSE 'No USING clause' 
  END as using_check,
  CASE 
    WHEN with_check IS NOT NULL THEN 'Has WITH CHECK clause' 
    ELSE 'No WITH CHECK clause' 
  END as with_check_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'profiles_v2'
ORDER BY policyname;

\echo ''
\echo '================================================================================'
\echo 'VERIFICATION COMPLETE'
\echo '================================================================================'
\echo ''
\echo 'Expected Results:'
\echo '  - RLS Status: All 5 tables should show ✅ ENABLED'
\echo '  - Policies: Total 20 policies (4 per table)'
\echo '  - Foreign Keys: 4 constraints enforced'
\echo '  - Row Counts: As per current data state'
\echo ''
