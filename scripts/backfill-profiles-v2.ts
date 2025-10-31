/**
 * Backfill script: Migrate existing profiles to profiles_v2
 * 
 * This script:
 * 1. Reads all existing profiles from public.profiles
 * 2. Creates one Creator profile in profiles_v2 per user
 * 3. Creates account_prefs with lastActiveProfileId
 * 4. Logs handle collisions and fixes
 */

import { supabaseAdmin } from '../server/supabaseClient';

interface LegacyProfile {
  id: string;
  handle: string | null;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface BackfillResult {
  totalProfiles: number;
  migratedProfiles: number;
  skippedProfiles: number;
  handleCollisions: Array<{
    userId: string;
    originalHandle: string;
    fixedHandle: string;
  }>;
  errors: Array<{
    userId: string;
    error: string;
  }>;
}

async function backfillProfilesV2(): Promise<BackfillResult> {
  console.log('🚀 Starting profiles v2 backfill...\n');

  const result: BackfillResult = {
    totalProfiles: 0,
    migratedProfiles: 0,
    skippedProfiles: 0,
    handleCollisions: [],
    errors: [],
  };

  try {
    // 1. Fetch all existing profiles
    console.log('📥 Fetching existing profiles from public.profiles...');
    const { data: legacyProfiles, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: true });

    if (fetchError) {
      throw new Error(`Failed to fetch profiles: ${fetchError.message}`);
    }

    result.totalProfiles = legacyProfiles?.length || 0;
    console.log(`✓ Found ${result.totalProfiles} existing profiles\n`);

    if (!legacyProfiles || legacyProfiles.length === 0) {
      console.log('⚠️  No profiles to migrate');
      return result;
    }

    // Track used handles to detect collisions
    const usedHandles = new Set<string>();

    // 2. Process each profile
    for (const profile of legacyProfiles as LegacyProfile[]) {
      try {
        // Generate handle: lowercase existing handle or generate fallback
        let handle = profile.handle
          ? profile.handle.toLowerCase()
          : `user_${profile.id.slice(-5)}`;

        // Check for handle collisions and fix
        let originalHandle = handle;
        let suffix = 1;
        while (usedHandles.has(handle)) {
          handle = `${originalHandle}${suffix}`;
          suffix++;
          if (suffix === 2) {
            // Log first collision
            result.handleCollisions.push({
              userId: profile.id,
              originalHandle,
              fixedHandle: handle,
            });
          }
        }
        usedHandles.add(handle);

        // Generate display name: use existing or fallback to handle
        const displayName = profile.display_name?.trim() || handle;

        // 3. Insert into profiles_v2
        const { data: newProfile, error: insertProfileError } = await supabaseAdmin
          .from('profiles_v2')
          .insert({
            user_id: profile.id,
            kind: 'CREATOR',
            handle,
            display_name: displayName,
            profile_photo_url: profile.avatar_url || null,
            visibility: 'PUBLIC',
          })
          .select()
          .single();

        if (insertProfileError) {
          result.errors.push({
            userId: profile.id,
            error: `Profile insert failed: ${insertProfileError.message}`,
          });
          result.skippedProfiles++;
          continue;
        }

        // 4. Insert into account_prefs
        const { error: prefsError } = await supabaseAdmin
          .from('account_prefs')
          .insert({
            user_id: profile.id,
            last_active_profile_id: newProfile.profile_id,
          });

        if (prefsError) {
          // Log error but don't fail the migration
          console.warn(`⚠️  Failed to create account_prefs for user ${profile.id}: ${prefsError.message}`);
        }

        result.migratedProfiles++;

        // Log progress every 10 profiles
        if (result.migratedProfiles % 10 === 0) {
          console.log(`  ⏳ Progress: ${result.migratedProfiles}/${result.totalProfiles} profiles migrated`);
        }

      } catch (error: any) {
        result.errors.push({
          userId: profile.id,
          error: error.message || String(error),
        });
        result.skippedProfiles++;
      }
    }

    console.log('\n✅ Backfill complete!\n');
    return result;

  } catch (error: any) {
    console.error('❌ Backfill failed:', error);
    throw error;
  }
}

// Main execution
async function main() {
  try {
    const result = await backfillProfilesV2();

    // Print summary
    console.log('═══════════════════════════════════════════════════════');
    console.log('BACKFILL SUMMARY');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`Total profiles found:       ${result.totalProfiles}`);
    console.log(`Successfully migrated:      ${result.migratedProfiles}`);
    console.log(`Skipped (errors):           ${result.skippedProfiles}`);
    console.log(`Handle collisions fixed:    ${result.handleCollisions.length}`);
    console.log('═══════════════════════════════════════════════════════\n');

    // Print handle collisions CSV
    if (result.handleCollisions.length > 0) {
      console.log('📋 HANDLE COLLISIONS (CSV Format):');
      console.log('user_id,original_handle,fixed_handle');
      result.handleCollisions.forEach(({ userId, originalHandle, fixedHandle }) => {
        console.log(`${userId},${originalHandle},${fixedHandle}`);
      });
      console.log('');
    }

    // Print errors
    if (result.errors.length > 0) {
      console.log('⚠️  ERRORS:');
      result.errors.forEach(({ userId, error }) => {
        console.log(`  User ${userId}: ${error}`);
      });
      console.log('');
    }

    // Save migration log to file
    const { writeFileSync } = await import('fs');
    const logPath = 'scripts/migration-log-profiles-v2.json';
    writeFileSync(logPath, JSON.stringify(result, null, 2));
    console.log(`📝 Migration log saved to: ${logPath}\n`);

    process.exit(0);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main();
