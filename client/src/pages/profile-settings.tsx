import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { supabase } from "@/lib/supabaseClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Save, Loader2, Upload, Camera, ArrowLeft } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { MultiSelectChips } from "@/components/multi-select-chips";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface QuickFacts {
  primary_role?: string;
  secondary_roles?: string[];
  platforms?: string[];
  tools?: string[];
  experience_level?: string;
  portfolio_url?: string;
  social_links?: {
    website?: string;
    twitter?: string;
    instagram?: string;
    artstation?: string;
    discord?: string;
  };
}

interface ProfileV2 {
  profile_id: string;
  user_id: string;
  handle: string;
  display_name: string;
  headline: string | null;
  profile_photo_url: string | null;
  about: string | null;
  kind: string;
  visibility: string;
  is_open_to_work: boolean;
  is_hiring: boolean;
  availability_note: string | null;
  quick_facts: QuickFacts | null;
}

interface AccountPrefs {
  user_id: string;
  last_active_profile_id: string | null;
}

// Predefined options for Creator Profile
const PRIMARY_ROLE_OPTIONS = [
  "3D Modeler",
  "World Builder",
  "Environment Artist",
  "Character Artist",
  "Rigger",
  "Animator",
  "Scripter / Programmer",
  "Technical Artist",
  "UI / UX Designer",
  "Sound Designer",
  "Video Editor",
  "Community Manager",
];

const PLATFORM_OPTIONS = [
  "Roblox",
  "VRChat",
  "Second Life",
  "IMVU",
  "Meta Horizon Worlds",
  "GTA / FiveM",
  "The Sims (CC)",
  "Unity",
  "Unreal Engine",
];

const TOOL_OPTIONS = [
  "Blender",
  "Maya",
  "ZBrush",
  "Substance Painter",
  "Photoshop",
  "Marvelous Designer",
  "Unity",
  "Unreal Engine",
  "Notepad++",
  "VS Code",
  "Udon / UdonSharp",
];

const EXPERIENCE_LEVELS = [
  "New / < 1 year",
  "1–3 years",
  "3–5 years",
  "5+ years",
];

export default function ProfileSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { uploadAvatar, uploading } = useAvatarUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  console.log('[PROFILE SETTINGS] Component render - user:', user?.id, 'email:', user?.email);
  
  const [displayName, setDisplayName] = useState("");
  const [headline, setHeadline] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");
  const [isOpenToWork, setIsOpenToWork] = useState(false);
  const [isHiring, setIsHiring] = useState(false);
  const [availabilityNote, setAvailabilityNote] = useState("");
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
  const [pendingAvatarPreview, setPendingAvatarPreview] = useState<string | null>(null);

  // Creator Profile fields
  const [primaryRole, setPrimaryRole] = useState("");
  const [showCustomPrimaryRole, setShowCustomPrimaryRole] = useState(false);
  const [customPrimaryRole, setCustomPrimaryRole] = useState("");
  const [secondaryRoles, setSecondaryRoles] = useState<string[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [tools, setTools] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [socialWebsite, setSocialWebsite] = useState("");
  const [socialTwitter, setSocialTwitter] = useState("");
  const [socialInstagram, setSocialInstagram] = useState("");
  const [socialArtStation, setSocialArtStation] = useState("");
  const [socialDiscord, setSocialDiscord] = useState("");

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
          about: ''
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
      setHeadline(profile.headline || '');
      setAvatarUrl(profile.profile_photo_url || '');
      setBio(profile.about || '');
      setIsOpenToWork(profile.is_open_to_work ?? false);
      setIsHiring(profile.is_hiring ?? false);
      setAvailabilityNote(profile.availability_note || '');
      
      // Load quick_facts (creator profile data)
      const qf = profile.quick_facts;
      if (qf) {
        setPrimaryRole(qf.primary_role || '');
        setSecondaryRoles(qf.secondary_roles || []);
        setPlatforms(qf.platforms || []);
        setTools(qf.tools || []);
        setExperienceLevel(qf.experience_level || '');
        setPortfolioUrl(qf.portfolio_url || '');
        setSocialWebsite(qf.social_links?.website || '');
        setSocialTwitter(qf.social_links?.twitter || '');
        setSocialInstagram(qf.social_links?.instagram || '');
        setSocialArtStation(qf.social_links?.artstation || '');
        setSocialDiscord(qf.social_links?.discord || '');
      } else {
        // Reset creator profile fields if no quick_facts
        setPrimaryRole('');
        setSecondaryRoles([]);
        setPlatforms([]);
        setTools([]);
        setExperienceLevel('');
        setPortfolioUrl('');
        setSocialWebsite('');
        setSocialTwitter('');
        setSocialInstagram('');
        setSocialArtStation('');
        setSocialDiscord('');
      }
      
      // Clear pending states when loading fresh profile
      setPendingAvatarFile(null);
      setPendingAvatarPreview(null);
    }
  }, [profile]);

  // Handle avatar file selection (preview only, no upload yet)
  const handleAvatarSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PNG, JPEG, GIF, or WEBP image",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size must be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setPendingAvatarFile(file);
    setPendingAvatarPreview(previewUrl);
  };

  // Save mutation (upload avatar if pending, then save all fields)
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!profile || !user?.id) throw new Error('No profile to update');

      let finalAvatarUrl = avatarUrl;

      // If there's a pending avatar file, upload it first
      if (pendingAvatarFile) {
        const { url, error } = await uploadAvatar(pendingAvatarFile, user.id);
        
        if (error) {
          throw new Error(`Avatar upload failed: ${error}`);
        }
        
        if (url) {
          finalAvatarUrl = url;
        }
      }

      // Build updated quick_facts by merging with existing data
      const existingQuickFacts = profile.quick_facts || {};
      const updatedQuickFacts = {
        ...existingQuickFacts,
        primary_role: primaryRole.trim() || undefined,
        secondary_roles: secondaryRoles.length > 0 ? secondaryRoles : undefined,
        platforms: platforms.length > 0 ? platforms : undefined,
        tools: tools.length > 0 ? tools : undefined,
        experience_level: experienceLevel || undefined,
        portfolio_url: portfolioUrl.trim() || undefined,
        social_links: {
          ...(existingQuickFacts.social_links || {}),
          website: socialWebsite.trim() || undefined,
          twitter: socialTwitter.trim() || undefined,
          instagram: socialInstagram.trim() || undefined,
          artstation: socialArtStation.trim() || undefined,
          discord: socialDiscord.trim() || undefined,
        },
      };

      // Update all profile fields
      const { error } = await supabase
        .from('profiles_v2')
        .update({
          display_name: displayName.trim(),
          headline: headline.trim() || null,
          about: bio.trim(),
          profile_photo_url: finalAvatarUrl,
          is_open_to_work: isOpenToWork,
          is_hiring: isHiring,
          availability_note: availabilityNote.trim() || null,
          quick_facts: updatedQuickFacts
        })
        .eq('profile_id', profile.profile_id)
        .eq('user_id', user.id); // RLS safety

      if (error) throw error;

      return finalAvatarUrl;
    },
    onSuccess: (finalAvatarUrl) => {
      // Update local avatar state
      setAvatarUrl(finalAvatarUrl || '');
      
      // Clear pending avatar states
      setPendingAvatarFile(null);
      if (pendingAvatarPreview) {
        URL.revokeObjectURL(pendingAvatarPreview);
      }
      setPendingAvatarPreview(null);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Refresh profile data and header avatar
      queryClient.invalidateQueries({ queryKey: ['my-profile-v2'] });
      queryClient.invalidateQueries({ queryKey: ['profile-v2', profile?.handle] });
      queryClient.invalidateQueries({ queryKey: ['v2-avatar', user?.id ?? 'none'] });
      
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
        description: error instanceof Error ? error.message : "Failed to save your profile. Please try again.",
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

  // Helper to check if arrays are different
  const arraysEqual = (a: string[], b: string[]) => {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((val, idx) => val === sortedB[idx]);
  };

  const qf = profile.quick_facts;
  const hasChanges = 
    displayName !== (profile.display_name || '') ||
    headline !== (profile.headline || '') ||
    bio !== (profile?.about || '') ||
    isOpenToWork !== (profile.is_open_to_work ?? false) ||
    isHiring !== (profile.is_hiring ?? false) ||
    availabilityNote !== (profile.availability_note || '') ||
    pendingAvatarFile !== null ||
    // Creator profile changes
    primaryRole !== (qf?.primary_role || '') ||
    !arraysEqual(secondaryRoles, qf?.secondary_roles || []) ||
    !arraysEqual(platforms, qf?.platforms || []) ||
    !arraysEqual(tools, qf?.tools || []) ||
    experienceLevel !== (qf?.experience_level || '') ||
    portfolioUrl !== (qf?.portfolio_url || '') ||
    socialWebsite !== (qf?.social_links?.website || '') ||
    socialTwitter !== (qf?.social_links?.twitter || '') ||
    socialInstagram !== (qf?.social_links?.instagram || '') ||
    socialArtStation !== (qf?.social_links?.artstation || '') ||
    socialDiscord !== (qf?.social_links?.discord || '');

  const currentAvatarPreview = pendingAvatarPreview || avatarUrl;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <a className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to VirtuoHub
            </a>
          </Link>
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your public creator profile on VirtuoHub
          </p>
        </div>

        <Card className="p-6">
          <div className="space-y-6">
            {/* Avatar Preview */}
            <div className="flex items-center gap-4">
              {currentAvatarPreview ? (
                <img 
                  src={currentAvatarPreview} 
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

            {/* Headline */}
            <div className="space-y-2">
              <Label htmlFor="headline">Headline</Label>
              <Input
                id="headline"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Creator on VirtuoHub"
                maxLength={120}
                data-testid="input-headline"
              />
              <p className="text-xs text-muted-foreground">
                A short tagline that appears under your name
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

            {/* Avatar Upload */}
            <div className="space-y-2">
              <Label htmlFor="avatar-upload">Profile Picture</Label>
              <div className="flex items-center gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  id="avatar-upload"
                  accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                  onChange={handleAvatarSelect}
                  className="hidden"
                  data-testid="input-avatar-file"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                  data-testid="button-select-avatar"
                >
                  <Camera className="w-4 h-4" /> Choose Photo
                </Button>
                {pendingAvatarFile && (
                  <span className="text-sm text-amber-600 dark:text-amber-500">
                    Photo selected (not saved yet)
                  </span>
                )}
                {!pendingAvatarFile && avatarUrl && (
                  <span className="text-sm text-muted-foreground">
                    Current photo saved
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                PNG, JPEG, GIF, or WEBP. Max 5MB. Click "Save Changes" to upload.
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

            {/* Availability Section */}
            <div className="space-y-4 pt-4 border-t">
              <div>
                <h3 className="text-lg font-semibold mb-2">Availability</h3>
                <p className="text-sm text-muted-foreground">
                  Let others know if you're open to opportunities or looking to hire
                </p>
              </div>

              {/* Open to Work Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="open-to-work"
                  checked={isOpenToWork}
                  onCheckedChange={(checked) => setIsOpenToWork(checked === true)}
                  data-testid="checkbox-open-to-work"
                />
                <Label 
                  htmlFor="open-to-work"
                  className="text-sm font-normal cursor-pointer"
                >
                  I'm open to paid opportunities
                </Label>
              </div>

              {/* Hiring Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hiring"
                  checked={isHiring}
                  onCheckedChange={(checked) => setIsHiring(checked === true)}
                  data-testid="checkbox-hiring"
                />
                <Label 
                  htmlFor="hiring"
                  className="text-sm font-normal cursor-pointer"
                >
                  I'm looking to hire creators
                </Label>
              </div>

              {/* Availability Note */}
              <div className="space-y-2">
                <Label htmlFor="availability-note">Availability details</Label>
                <Textarea
                  id="availability-note"
                  value={availabilityNote}
                  onChange={(e) => setAvailabilityNote(e.target.value)}
                  placeholder="What kinds of work, collaboration, or roles are you open to?"
                  className="min-h-[100px] resize-y"
                  data-testid="input-availability-note"
                />
                <p className="text-xs text-muted-foreground">
                  This will be visible on your public profile when filled in
                </p>
              </div>
            </div>

            {/* Creator Profile Section */}
            <div className="space-y-6 pt-6 border-t">
              <div>
                <h3 className="text-lg font-semibold mb-2">Creator Profile</h3>
                <p className="text-sm text-muted-foreground">
                  Showcase your skills, tools, and experience to potential collaborators
                </p>
              </div>

              {/* Primary Skill / Role */}
              <div className="space-y-2">
                <Label htmlFor="primary-role">Primary Skill<span className="text-red-500 ml-1">*</span></Label>
                <Select
                  value={primaryRole}
                  onValueChange={(value) => {
                    if (value === "Other") {
                      setShowCustomPrimaryRole(true);
                      setPrimaryRole("");
                    } else {
                      setShowCustomPrimaryRole(false);
                      setPrimaryRole(value);
                    }
                  }}
                >
                  <SelectTrigger data-testid="select-primary-role">
                    <SelectValue placeholder="Select your primary skill..." />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIMARY_ROLE_OPTIONS.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                    <SelectItem value="Other">Other...</SelectItem>
                  </SelectContent>
                </Select>
                
                {showCustomPrimaryRole && (
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={customPrimaryRole}
                      onChange={(e) => setCustomPrimaryRole(e.target.value)}
                      onInput={(e) => setCustomPrimaryRole((e.target as HTMLInputElement).value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && customPrimaryRole.trim()) {
                          e.preventDefault();
                          setPrimaryRole(customPrimaryRole.trim());
                          setShowCustomPrimaryRole(false);
                          setCustomPrimaryRole("");
                        }
                      }}
                      placeholder="Enter your custom role..."
                      autoFocus
                      data-testid="input-custom-primary-role"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        if (customPrimaryRole.trim()) {
                          setPrimaryRole(customPrimaryRole.trim());
                          setShowCustomPrimaryRole(false);
                          setCustomPrimaryRole("");
                        }
                      }}
                      disabled={!customPrimaryRole.trim()}
                      data-testid="button-set-custom-primary-role"
                    >
                      Set
                    </Button>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  What you're best known for
                </p>
              </div>

              {/* Other Skills */}
              <div className="space-y-2">
                <Label>Other Skills</Label>
                <MultiSelectChips
                  options={PRIMARY_ROLE_OPTIONS.filter(r => r !== primaryRole)}
                  selected={secondaryRoles}
                  onChange={setSecondaryRoles}
                  allowCustom
                  placeholder="Add a custom skill..."
                  testIdPrefix="secondary-role"
                />
                <p className="text-xs text-muted-foreground">
                  Additional skills you can offer
                </p>
              </div>

              {/* Platforms */}
              <div className="space-y-2">
                <Label>Platforms you work on</Label>
                <MultiSelectChips
                  options={PLATFORM_OPTIONS}
                  selected={platforms}
                  onChange={setPlatforms}
                  allowCustom
                  placeholder="Add a custom platform..."
                  testIdPrefix="platform"
                />
                <p className="text-xs text-muted-foreground">
                  Virtual worlds and engines you create for
                </p>
              </div>

              {/* Tools */}
              <div className="space-y-2">
                <Label>Tools you use</Label>
                <MultiSelectChips
                  options={TOOL_OPTIONS}
                  selected={tools}
                  onChange={setTools}
                  allowCustom
                  placeholder="Add a custom tool..."
                  testIdPrefix="tool"
                />
                <p className="text-xs text-muted-foreground">
                  Software and tools in your workflow
                </p>
              </div>

              {/* Experience Level */}
              <div className="space-y-2">
                <Label htmlFor="experience-level">Experience level</Label>
                <Select
                  value={experienceLevel}
                  onValueChange={setExperienceLevel}
                >
                  <SelectTrigger data-testid="select-experience-level">
                    <SelectValue placeholder="Select your experience level..." />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Portfolio & Socials */}
              <div className="space-y-4 pt-2">
                <h4 className="font-medium text-sm">Portfolio & Socials</h4>

                {/* Portfolio URL */}
                <div className="space-y-2">
                  <Label htmlFor="portfolio-url">Portfolio / Website</Label>
                  <Input
                    id="portfolio-url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://..."
                    data-testid="input-portfolio-url"
                  />
                </div>

                {/* Social Links Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="social-website">Website</Label>
                    <Input
                      id="social-website"
                      value={socialWebsite}
                      onChange={(e) => setSocialWebsite(e.target.value)}
                      placeholder="https://..."
                      data-testid="input-social-website"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="social-twitter">Twitter / X</Label>
                    <Input
                      id="social-twitter"
                      value={socialTwitter}
                      onChange={(e) => setSocialTwitter(e.target.value)}
                      placeholder="https://twitter.com/..."
                      data-testid="input-social-twitter"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="social-instagram">Instagram</Label>
                    <Input
                      id="social-instagram"
                      value={socialInstagram}
                      onChange={(e) => setSocialInstagram(e.target.value)}
                      placeholder="https://instagram.com/..."
                      data-testid="input-social-instagram"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="social-artstation">ArtStation</Label>
                    <Input
                      id="social-artstation"
                      value={socialArtStation}
                      onChange={(e) => setSocialArtStation(e.target.value)}
                      placeholder="https://artstation.com/..."
                      data-testid="input-social-artstation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="social-discord">Discord</Label>
                    <Input
                      id="social-discord"
                      value={socialDiscord}
                      onChange={(e) => setSocialDiscord(e.target.value)}
                      placeholder="username#0001 or link"
                      data-testid="input-social-discord"
                    />
                  </div>
                </div>
              </div>
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

        {/* Public Profile Link */}
        {profile.handle && (
          <div className="mt-4 text-center">
            <Link href={`/u/${profile.handle}`}>
              <Button 
                variant="outline" 
                className="gap-2"
                data-testid="button-view-public-profile"
              >
                <User className="w-4 h-4" />
                View Public Profile
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
