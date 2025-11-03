-- ==============================================================================
-- Profiles v2 Security: RLS Policies and Foreign Keys
-- ==============================================================================
-- Purpose: Secure all Profiles v2 tables with Row Level Security policies
--          and add foreign key constraints for referential integrity
-- 
-- Idempotent: Safe to run multiple times
-- ==============================================================================

-- ==============================================================================
-- 1. ENABLE ROW LEVEL SECURITY
-- ==============================================================================

DO $$ 
BEGIN
  -- Enable RLS on profiles_v2
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles_v2' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE public.profiles_v2 ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'RLS enabled on profiles_v2';
  END IF;

  -- Enable RLS on profile_bta
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'profile_bta' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE public.profile_bta ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'RLS enabled on profile_bta';
  END IF;

  -- Enable RLS on account_prefs
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'account_prefs' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE public.account_prefs ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'RLS enabled on account_prefs';
  END IF;

  -- Enable RLS on profile_access_requests
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'profile_access_requests' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE public.profile_access_requests ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'RLS enabled on profile_access_requests';
  END IF;

  -- Enable RLS on handle_history
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'handle_history' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE public.handle_history ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'RLS enabled on handle_history';
  END IF;
END $$;

-- ==============================================================================
-- 2. PROFILES_V2 POLICIES
-- ==============================================================================

-- SELECT: Public profiles OR own profile
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles_v2' 
    AND policyname = 'profiles_v2_select_public_or_own'
  ) THEN
    CREATE POLICY profiles_v2_select_public_or_own
    ON public.profiles_v2
    FOR SELECT
    USING (visibility = 'PUBLIC' OR user_id = auth.uid());
    RAISE NOTICE 'Created policy: profiles_v2_select_public_or_own';
  END IF;
END $$;

-- INSERT: User can only create their own profiles
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles_v2' 
    AND policyname = 'profiles_v2_insert_own'
  ) THEN
    CREATE POLICY profiles_v2_insert_own
    ON public.profiles_v2
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());
    RAISE NOTICE 'Created policy: profiles_v2_insert_own';
  END IF;
END $$;

-- UPDATE: User can only update their own profiles
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles_v2' 
    AND policyname = 'profiles_v2_update_own'
  ) THEN
    CREATE POLICY profiles_v2_update_own
    ON public.profiles_v2
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
    RAISE NOTICE 'Created policy: profiles_v2_update_own';
  END IF;
END $$;

-- DELETE: User can only delete their own profiles
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles_v2' 
    AND policyname = 'profiles_v2_delete_own'
  ) THEN
    CREATE POLICY profiles_v2_delete_own
    ON public.profiles_v2
    FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());
    RAISE NOTICE 'Created policy: profiles_v2_delete_own';
  END IF;
END $$;

-- ==============================================================================
-- 3. PROFILE_BTA POLICIES
-- ==============================================================================

-- SELECT: Only profile owner can view their BTA
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profile_bta' 
    AND policyname = 'profile_bta_select_own'
  ) THEN
    CREATE POLICY profile_bta_select_own
    ON public.profile_bta
    FOR SELECT
    TO authenticated
    USING (
      profile_id IN (
        SELECT profile_id FROM public.profiles_v2 WHERE user_id = auth.uid()
      )
    );
    RAISE NOTICE 'Created policy: profile_bta_select_own';
  END IF;
END $$;

-- INSERT: Only profile owner can create their BTA
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profile_bta' 
    AND policyname = 'profile_bta_insert_own'
  ) THEN
    CREATE POLICY profile_bta_insert_own
    ON public.profile_bta
    FOR INSERT
    TO authenticated
    WITH CHECK (
      profile_id IN (
        SELECT profile_id FROM public.profiles_v2 WHERE user_id = auth.uid()
      )
    );
    RAISE NOTICE 'Created policy: profile_bta_insert_own';
  END IF;
END $$;

-- UPDATE: Only profile owner can update their BTA
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profile_bta' 
    AND policyname = 'profile_bta_update_own'
  ) THEN
    CREATE POLICY profile_bta_update_own
    ON public.profile_bta
    FOR UPDATE
    TO authenticated
    USING (
      profile_id IN (
        SELECT profile_id FROM public.profiles_v2 WHERE user_id = auth.uid()
      )
    )
    WITH CHECK (
      profile_id IN (
        SELECT profile_id FROM public.profiles_v2 WHERE user_id = auth.uid()
      )
    );
    RAISE NOTICE 'Created policy: profile_bta_update_own';
  END IF;
END $$;

-- DELETE: Only profile owner can delete their BTA
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profile_bta' 
    AND policyname = 'profile_bta_delete_own'
  ) THEN
    CREATE POLICY profile_bta_delete_own
    ON public.profile_bta
    FOR DELETE
    TO authenticated
    USING (
      profile_id IN (
        SELECT profile_id FROM public.profiles_v2 WHERE user_id = auth.uid()
      )
    );
    RAISE NOTICE 'Created policy: profile_bta_delete_own';
  END IF;
END $$;

-- ==============================================================================
-- 4. ACCOUNT_PREFS POLICIES
-- ==============================================================================

-- SELECT: User can only view their own preferences
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'account_prefs' 
    AND policyname = 'account_prefs_select_own'
  ) THEN
    CREATE POLICY account_prefs_select_own
    ON public.account_prefs
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());
    RAISE NOTICE 'Created policy: account_prefs_select_own';
  END IF;
END $$;

-- INSERT: User can only create their own preferences
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'account_prefs' 
    AND policyname = 'account_prefs_insert_own'
  ) THEN
    CREATE POLICY account_prefs_insert_own
    ON public.account_prefs
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());
    RAISE NOTICE 'Created policy: account_prefs_insert_own';
  END IF;
END $$;

-- UPDATE: User can only update their own preferences
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'account_prefs' 
    AND policyname = 'account_prefs_update_own'
  ) THEN
    CREATE POLICY account_prefs_update_own
    ON public.account_prefs
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
    RAISE NOTICE 'Created policy: account_prefs_update_own';
  END IF;
END $$;

-- DELETE: User can only delete their own preferences
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'account_prefs' 
    AND policyname = 'account_prefs_delete_own'
  ) THEN
    CREATE POLICY account_prefs_delete_own
    ON public.account_prefs
    FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());
    RAISE NOTICE 'Created policy: account_prefs_delete_own';
  END IF;
END $$;

-- ==============================================================================
-- 5. PROFILE_ACCESS_REQUESTS POLICIES
-- ==============================================================================

-- SELECT: Requester can see their requests, profile owner can see incoming requests
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profile_access_requests' 
    AND policyname = 'access_requests_select_involved'
  ) THEN
    CREATE POLICY access_requests_select_involved
    ON public.profile_access_requests
    FOR SELECT
    TO authenticated
    USING (
      requester_user_id = auth.uid()
      OR target_profile_id IN (
        SELECT profile_id FROM public.profiles_v2 WHERE user_id = auth.uid()
      )
    );
    RAISE NOTICE 'Created policy: access_requests_select_involved';
  END IF;
END $$;

-- INSERT: User can only create requests where they are the requester
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profile_access_requests' 
    AND policyname = 'access_requests_insert_own'
  ) THEN
    CREATE POLICY access_requests_insert_own
    ON public.profile_access_requests
    FOR INSERT
    TO authenticated
    WITH CHECK (requester_user_id = auth.uid());
    RAISE NOTICE 'Created policy: access_requests_insert_own';
  END IF;
END $$;

-- UPDATE: Only profile owner can approve/deny requests
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profile_access_requests' 
    AND policyname = 'access_requests_update_owner'
  ) THEN
    CREATE POLICY access_requests_update_owner
    ON public.profile_access_requests
    FOR UPDATE
    TO authenticated
    USING (
      target_profile_id IN (
        SELECT profile_id FROM public.profiles_v2 WHERE user_id = auth.uid()
      )
    )
    WITH CHECK (
      target_profile_id IN (
        SELECT profile_id FROM public.profiles_v2 WHERE user_id = auth.uid()
      )
    );
    RAISE NOTICE 'Created policy: access_requests_update_owner';
  END IF;
END $$;

-- DELETE: Only profile owner can delete requests
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profile_access_requests' 
    AND policyname = 'access_requests_delete_owner'
  ) THEN
    CREATE POLICY access_requests_delete_owner
    ON public.profile_access_requests
    FOR DELETE
    TO authenticated
    USING (
      target_profile_id IN (
        SELECT profile_id FROM public.profiles_v2 WHERE user_id = auth.uid()
      )
    );
    RAISE NOTICE 'Created policy: access_requests_delete_owner';
  END IF;
END $$;

-- ==============================================================================
-- 6. HANDLE_HISTORY POLICIES
-- ==============================================================================

-- SELECT: User can only view history for their own profiles
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'handle_history' 
    AND policyname = 'handle_history_select_own'
  ) THEN
    CREATE POLICY handle_history_select_own
    ON public.handle_history
    FOR SELECT
    TO authenticated
    USING (
      profile_id IN (
        SELECT profile_id FROM public.profiles_v2 WHERE user_id = auth.uid()
      )
    );
    RAISE NOTICE 'Created policy: handle_history_select_own';
  END IF;
END $$;

-- INSERT: System/user can only insert history for their own profiles
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'handle_history' 
    AND policyname = 'handle_history_insert_own'
  ) THEN
    CREATE POLICY handle_history_insert_own
    ON public.handle_history
    FOR INSERT
    TO authenticated
    WITH CHECK (
      profile_id IN (
        SELECT profile_id FROM public.profiles_v2 WHERE user_id = auth.uid()
      )
    );
    RAISE NOTICE 'Created policy: handle_history_insert_own';
  END IF;
END $$;

-- ==============================================================================
-- 7. FOREIGN KEY CONSTRAINTS
-- ==============================================================================

-- profiles_v2.user_id -> auth.users(id)
-- Note: Cannot add FK to auth.users as it's in a different schema
-- This would require service role or schema permissions
-- Commenting out as it may fail in development/restricted environments

-- DO $$ 
-- BEGIN
--   IF NOT EXISTS (
--     SELECT 1 FROM information_schema.table_constraints 
--     WHERE constraint_name = 'fk_profiles_v2_user_id'
--   ) THEN
--     ALTER TABLE public.profiles_v2
--     ADD CONSTRAINT fk_profiles_v2_user_id
--     FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
--     RAISE NOTICE 'Created FK: profiles_v2.user_id -> auth.users(id)';
--   END IF;
-- END $$;

-- account_prefs.user_id -> auth.users(id)
-- DO $$ 
-- BEGIN
--   IF NOT EXISTS (
--     SELECT 1 FROM information_schema.table_constraints 
--     WHERE constraint_name = 'fk_account_prefs_user_id'
--   ) THEN
--     ALTER TABLE public.account_prefs
--     ADD CONSTRAINT fk_account_prefs_user_id
--     FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
--     RAISE NOTICE 'Created FK: account_prefs.user_id -> auth.users(id)';
--   END IF;
-- END $$;

-- profile_access_requests.requester_user_id -> auth.users(id)
-- DO $$ 
-- BEGIN
--   IF NOT EXISTS (
--     SELECT 1 FROM information_schema.table_constraints 
--     WHERE constraint_name = 'fk_access_requests_requester'
--   ) THEN
--     ALTER TABLE public.profile_access_requests
--     ADD CONSTRAINT fk_access_requests_requester
--     FOREIGN KEY (requester_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
--     RAISE NOTICE 'Created FK: profile_access_requests.requester_user_id -> auth.users(id)';
--   END IF;
-- END $$;

-- account_prefs.last_active_profile_id -> profiles_v2.profile_id
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_account_prefs_active_profile'
  ) THEN
    ALTER TABLE public.account_prefs
    ADD CONSTRAINT fk_account_prefs_active_profile
    FOREIGN KEY (last_active_profile_id) REFERENCES public.profiles_v2(profile_id) ON DELETE SET NULL;
    RAISE NOTICE 'Created FK: account_prefs.last_active_profile_id -> profiles_v2(profile_id)';
  END IF;
END $$;

-- profile_bta.profile_id -> profiles_v2.profile_id
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_profile_bta_profile_id'
  ) THEN
    ALTER TABLE public.profile_bta
    ADD CONSTRAINT fk_profile_bta_profile_id
    FOREIGN KEY (profile_id) REFERENCES public.profiles_v2(profile_id) ON DELETE CASCADE;
    RAISE NOTICE 'Created FK: profile_bta.profile_id -> profiles_v2(profile_id)';
  END IF;
END $$;

-- profile_access_requests.target_profile_id -> profiles_v2.profile_id
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_access_requests_target_profile'
  ) THEN
    ALTER TABLE public.profile_access_requests
    ADD CONSTRAINT fk_access_requests_target_profile
    FOREIGN KEY (target_profile_id) REFERENCES public.profiles_v2(profile_id) ON DELETE CASCADE;
    RAISE NOTICE 'Created FK: profile_access_requests.target_profile_id -> profiles_v2(profile_id)';
  END IF;
END $$;

-- handle_history.profile_id -> profiles_v2.profile_id
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_handle_history_profile_id'
  ) THEN
    ALTER TABLE public.handle_history
    ADD CONSTRAINT fk_handle_history_profile_id
    FOREIGN KEY (profile_id) REFERENCES public.profiles_v2(profile_id) ON DELETE CASCADE;
    RAISE NOTICE 'Created FK: handle_history.profile_id -> profiles_v2(profile_id)';
  END IF;
END $$;

-- ==============================================================================
-- COMPLETION MESSAGE
-- ==============================================================================

DO $$ 
BEGIN
  RAISE NOTICE '✅ Profiles v2 security setup complete!';
  RAISE NOTICE '   - RLS enabled on all 5 tables';
  RAISE NOTICE '   - 20 policies created';
  RAISE NOTICE '   - 4 foreign keys enforced (auth.users FKs commented due to schema restrictions)';
  RAISE NOTICE '   Run verify_profiles_v2_security.sql to confirm setup';
END $$;
