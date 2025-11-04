import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { User, MapPin, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ProfileV2 {
  profile_id: string;
  user_id: string;
  handle: string;
  display_name: string;
  profile_photo_url: string | null;
  about: string | null;
  visibility: string;
  created_at: string;
}

export default function PublicProfile() {
  const { handle } = useParams<{ handle: string }>();

  const { data: profile, isLoading, error } = useQuery<ProfileV2 | null>({
    queryKey: ['profile-v2', handle],
    queryFn: async () => {
      if (!handle) return null;

      const { data, error } = await supabase
        .from('profiles_v2')
        .select('profile_id, user_id, handle, display_name, profile_photo_url, about, visibility, created_at')
        .eq('handle', handle.toLowerCase())
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    },
    enabled: !!handle
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Profile not found</h1>
          <p className="text-muted-foreground">
            The profile @{handle} does not exist or you don't have permission to view it.
          </p>
        </Card>
      </div>
    );
  }

  const displayName = profile.display_name || profile.handle;
  const bio = profile.about || "This creator has not added a bio yet.";
  const avatarUrl = profile.profile_photo_url;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="p-8 mb-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt={displayName}
                  className="w-32 h-32 rounded-full object-cover border-4 border-border"
                />
              ) : (
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center border-4 border-border">
                  <span className="text-4xl font-bold text-white">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-1" data-testid="profile-display-name">
                {displayName}
              </h1>
              <p className="text-xl text-muted-foreground mb-4" data-testid="profile-handle">
                @{profile.handle}
              </p>

              {/* Bio */}
              <p className="text-base text-foreground whitespace-pre-wrap mb-4" data-testid="profile-bio">
                {bio}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Joined {new Date(profile.created_at).toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Additional Info Card */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-3">About</h2>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              This is a creator profile on VirtuoHub. More features coming soon!
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
