import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { User, Save, Loader2 } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

interface ProfileV2 {
  profile_id: string;
  user_id: string;
  handle: string;
  display_name: string;
  profile_photo_url: string | null;
  quick_facts: {
    bio?: string;
    [key: string]: any;
  } | null;
  kind: string;
  visibility: string;
}

interface AccountPrefs {
  user_id: string;
  last_active_profile_id: string | null;
}

export default function ProfileSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  console.log('[PROFILE SETTINGS] Component render - user:', user?.id, 'email:', user?.email);
  
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");

  // Fetch or create profile
  const { data: profile, isLoading: profileLoading, error: profileError, refetch: refetchProfile } = useQuery<ProfileV2 | null>({
    queryKey: ['my-profile-v2', user?.id],
    queryFn: async () => {
      console.log('[PROFILE SETTINGS] Starting profile load for user:', user?.id);
      
      if (!user?.id) {
        console.log('[PROFILE SETTINGS] No user ID, returning null');
        return null;
      }

      // Step 1: Check account_prefs for active profile
      console.log('[PROFILE SETTINGS] Step 1: Checking account_prefs');
      const { data: prefs, error: prefsError } = await supabase
        .from('account_prefs')
        .select('last_active_profile_id')
        .eq('user_id', user.id)
        .maybeSingle(); // Use maybeSingle() to return null if not found instead of throwing error
      
      console.log('[PROFILE SETTINGS] account_prefs result:', { data: prefs, error: prefsError });

      let profileId = prefs?.last_active_profile_id;
      console.log('[PROFILE SETTINGS] Active profile ID from prefs:', profileId);

      // Step 2: If we have an active profile ID, fetch it
      if (profileId) {
        console.log('[PROFILE SETTINGS] Step 2: Fetching active profile:', profileId);
        const { data: existingProfile, error } = await supabase
          .from('profiles_v2')
          .select('*')
          .eq('profile_id', profileId)
          .maybeSingle(); // Use maybeSingle() to handle missing profile gracefully

        console.log('[PROFILE SETTINGS] profiles_v2 fetch result:', { data: existingProfile, error });

        if (!error && existingProfile) {
          console.log('[PROFILE SETTINGS] SUCCESS: Returning existing profile');
          return existingProfile;
        }
      }

      // Step 3: Check if user has any profiles
      console.log('[PROFILE SETTINGS] Step 3: Searching for any user profiles');
      const { data: userProfiles, error: userProfilesError } = await supabase
        .from('profiles_v2')
        .select('*')
        .eq('user_id', user.id)
        .limit(1);

      console.log('[PROFILE SETTINGS] User profiles search result:', { data: userProfiles, error: userProfilesError });

      if (userProfiles && userProfiles.length > 0) {
        console.log('[PROFILE SETTINGS] Found existing profile, updating account_prefs');
        // Update account_prefs to point to this profile
        const { error: upsertError } = await supabase
          .from('account_prefs')
          .upsert({
            user_id: user.id,
            last_active_profile_id: userProfiles[0].profile_id
          });
        
        console.log('[PROFILE SETTINGS] account_prefs upsert result:', { error: upsertError });
        console.log('[PROFILE SETTINGS] SUCCESS: Returning found profile');
        return userProfiles[0];
      }

      // Step 4: Create a new default profile with collision-safe handle
      console.log('[PROFILE SETTINGS] Step 4: Creating new profile');
      
      // Get v1 profile for defaults
      const { data: v1Profile, error: v1Error } = await supabase
        .from('profiles')
        .select('handle, display_name')
        .eq('id', user.id)
        .maybeSingle(); // Use maybeSingle() - v1 profile might not exist

      console.log('[PROFILE SETTINGS] v1 profile fetch result:', { data: v1Profile, error: v1Error });

      const baseHandle = (v1Profile?.handle || user.email?.split('@')[0] || 'user')
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '_')
        .substring(0, 15); // Leave room for suffix

      const defaultDisplayName = v1Profile?.display_name || baseHandle;
      console.log('[PROFILE SETTINGS] Base handle:', baseHandle, 'Display name:', defaultDisplayName);

      // Find an available handle by appending suffix if needed
      let attemptHandle = baseHandle;
      let suffix = 0;
      let handleAvailable = false;
      
      console.log('[PROFILE SETTINGS] Starting handle collision check');
      while (!handleAvailable && suffix < 100) {
        const { data: existingProfile, error: checkError } = await supabase
          .from('profiles_v2')
          .select('handle')
          .eq('handle', attemptHandle)
          .maybeSingle(); // Use maybeSingle() - null means handle is available

        console.log('[PROFILE SETTINGS] Handle check for', attemptHandle, ':', { exists: !!existingProfile, error: checkError });

        if (!existingProfile) {
          handleAvailable = true;
        } else {
          suffix++;
          // Use user ID suffix for uniqueness
          const uniqueSuffix = user.id.substring(0, 6).replace(/-/g, '');
          attemptHandle = `${baseHandle}_${uniqueSuffix}${suffix > 1 ? suffix : ''}`;
        }
      }

      if (!handleAvailable) {
        console.error('[PROFILE SETTINGS] ERROR: Could not find available handle after 100 attempts');
        throw new Error('Could not find available handle');
      }

      console.log('[PROFILE SETTINGS] Final handle:', attemptHandle);

      // Create new profile with collision-free handle
      console.log('[PROFILE SETTINGS] Inserting new profile');
      const { data: newProfile, error: createError } = await supabase
        .from('profiles_v2')
        .insert({
          user_id: user.id,
          kind: 'CREATOR',
          handle: attemptHandle,
          display_name: defaultDisplayName,
          visibility: 'PUBLIC',
          quick_facts: { bio: '' }
        })
        .select()
        .single();

      console.log('[PROFILE SETTINGS] Profile insert result:', { data: newProfile, error: createError });

      if (createError) {
        console.error('[PROFILE SETTINGS] ERROR creating profile:', createError);
        throw createError;
      }

      // Create account_prefs
      console.log('[PROFILE SETTINGS] Creating account_prefs');
      const { error: prefsCreateError } = await supabase
        .from('account_prefs')
        .upsert({
          user_id: user.id,
          last_active_profile_id: newProfile.profile_id
        });

      console.log('[PROFILE SETTINGS] account_prefs upsert result:', { error: prefsCreateError });
      console.log('[PROFILE SETTINGS] SUCCESS: Returning newly created profile');
      return newProfile;
    },
    enabled: !!user?.id
  });

  // Log query error
  useEffect(() => {
    if (profileError) {
      console.error('[PROFILE SETTINGS] QUERY ERROR:', profileError);
    }
  }, [profileError]);

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '');
      setAvatarUrl(profile.profile_photo_url || '');
      setBio(profile.quick_facts?.bio || '');
    }
  }, [profile]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!profile || !user?.id) throw new Error('No profile to update');

      // Merge new bio into existing quick_facts
      const updatedQuickFacts = {
        ...(profile.quick_facts || {}),
        bio: bio.trim()
      };

      const { error } = await supabase
        .from('profiles_v2')
        .update({
          display_name: displayName.trim(),
          profile_photo_url: avatarUrl.trim() || null,
          quick_facts: updatedQuickFacts
        })
        .eq('profile_id', profile.profile_id)
        .eq('user_id', user.id); // RLS safety

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-profile-v2'] });
      queryClient.invalidateQueries({ queryKey: ['profile-v2', profile?.handle] });
      toast({
        title: "Profile updated",
        description: "Your changes have been saved successfully."
      });
      refetchProfile();
    },
    onError: (error) => {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save your profile. Please try again.",
        variant: "destructive"
      });
    }
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold mb-2">Sign in required</h1>
          <p className="text-muted-foreground">
            Please sign in to manage your profile.
          </p>
        </Card>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold mb-2">Error loading profile</h1>
          <p className="text-muted-foreground mb-4">
            Unable to load or create your profile. Please try again.
          </p>
          {profileError && (
            <div className="mt-4 p-4 bg-destructive/10 rounded text-sm text-left">
              <p className="font-semibold mb-2">Debug Info:</p>
              <p className="text-xs break-all">
                {JSON.stringify(profileError, null, 2)}
              </p>
            </div>
          )}
          <div className="mt-4 p-4 bg-muted rounded text-sm text-left">
            <p className="font-semibold mb-2">User Info:</p>
            <p className="text-xs">ID: {user?.id || 'null'}</p>
            <p className="text-xs">Email: {user?.email || 'null'}</p>
          </div>
        </Card>
      </div>
    );
  }

  const hasChanges = 
    displayName !== (profile.display_name || '') ||
    avatarUrl !== (profile.profile_photo_url || '') ||
    bio !== (profile.quick_facts?.bio || '');

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your public creator profile on VirtuoHub
          </p>
        </div>

        <Card className="p-6">
          <div className="space-y-6">
            {/* Avatar Preview */}
            <div className="flex items-center gap-4">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Profile preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center border-2 border-border">
                  <User className="w-10 h-10 text-white" />
                </div>
              )}
              <div>
                <p className="font-medium">{displayName || profile.handle}</p>
                <p className="text-sm text-muted-foreground">@{profile.handle}</p>
              </div>
            </div>

            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="display-name">Display Name</Label>
              <Input
                id="display-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your display name"
                data-testid="input-display-name"
              />
              <p className="text-xs text-muted-foreground">
                This is how your name will appear to others
              </p>
            </div>

            {/* Handle (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="handle">Handle</Label>
              <Input
                id="handle"
                value={profile.handle}
                readOnly
                disabled
                className="bg-muted"
                data-testid="input-handle"
              />
              <p className="text-xs text-muted-foreground">
                Your unique handle cannot be changed at this time
              </p>
            </div>

            {/* Avatar URL */}
            <div className="space-y-2">
              <Label htmlFor="avatar-url">Avatar URL</Label>
              <Input
                id="avatar-url"
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                data-testid="input-avatar-url"
              />
              <p className="text-xs text-muted-foreground">
                Enter a URL to your profile picture
              </p>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell others about yourself and what you create..."
                className="min-h-[120px] resize-y"
                data-testid="input-bio"
              />
              <p className="text-xs text-muted-foreground">
                {bio.length} characters
              </p>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t">
              <Button
                onClick={() => saveMutation.mutate()}
                disabled={!hasChanges || saveMutation.isPending}
                className="min-w-[120px]"
                data-testid="button-save-profile"
              >
                {saveMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Preview Link */}
        {profile.handle && (
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              View your public profile at{' '}
              <a 
                href={`/u/${profile.handle}`}
                className="text-primary hover:underline"
                data-testid="link-view-public-profile"
              >
                /u/{profile.handle}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
