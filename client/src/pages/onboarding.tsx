import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Upload, User } from 'lucide-react';
import { nanoid } from 'nanoid';

interface HandleValidation {
  isValid: boolean;
  isAvailable: boolean | null;
  isChecking: boolean;
  message: string;
}

const OnboardingPage = () => {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Form state
  const [handle, setHandle] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Handle validation state
  const [handleValidation, setHandleValidation] = useState<HandleValidation>({
    isValid: false,
    isAvailable: null,
    isChecking: false,
    message: ''
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      setLocation('/');
    }
  }, [user, loading, setLocation]);

  // OnboardingGuard now handles all redirect logic for completed users

  // Handle validation with debouncing
  useEffect(() => {
    if (!handle) {
      setHandleValidation({
        isValid: false,
        isAvailable: null,
        isChecking: false,
        message: ''
      });
      return;
    }

    // Validate format first
    const handleRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!handleRegex.test(handle)) {
      setHandleValidation({
        isValid: false,
        isAvailable: null,
        isChecking: false,
        message: 'Handle must be 3-20 characters and contain only letters, numbers, and underscores'
      });
      return;
    }

    // Check availability with debouncing
    const timeoutId = setTimeout(async () => {
      setHandleValidation(prev => ({
        ...prev,
        isChecking: true,
        message: 'Checking availability...'
      }));

      try {
        const response = await fetch('/api/profile/handle/check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ handle })
        });

        const data = await response.json();
        
        setHandleValidation({
          isValid: data.available,
          isAvailable: data.available,
          isChecking: false,
          message: data.available ? 'Handle is available!' : 'Handle is already taken'
        });
      } catch (error) {
        setHandleValidation({
          isValid: false,
          isAvailable: null,
          isChecking: false,
          message: 'Error checking availability'
        });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [handle]);

  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file',
        variant: 'destructive'
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image under 5MB',
        variant: 'destructive'
      });
      return;
    }

    setAvatarFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!handleValidation.isValid || !handle) {
      toast({
        title: 'Invalid handle',
        description: 'Please choose a valid, available handle',
        variant: 'destructive'
      });
      return;
    }

    if (!user) return;

    setSubmitting(true);

    try {
      let avatarUrl = null;

      // Upload avatar if provided
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}/${nanoid()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatarFile);

        if (uploadError) {
          throw new Error(`Avatar upload failed: ${uploadError.message}`);
        }

        // Get public URL
        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);
        
        avatarUrl = data.publicUrl;
      }

      // Update profile
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      
      const response = await fetch('/api/profile/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          handle,
          displayName: displayName || null,
          avatarUrl,
          role: null // Can be set later
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }

      toast({
        title: 'Profile completed!',
        description: 'Welcome to VirtuoHub!'
      });

      // Redirect to community
      setLocation('/community');
      
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        title: 'Error updating profile',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md" data-testid="card-onboarding">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold" data-testid="text-welcome-title">
            Welcome to VirtuoHub
          </CardTitle>
          <CardDescription data-testid="text-welcome-subtitle">
            Choose your handle and set your profile
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Handle Input */}
            <div className="space-y-2">
              <Label htmlFor="handle">
                Handle <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="handle"
                  type="text"
                  placeholder="your_handle"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className={`pr-10 ${
                    handle ? (handleValidation.isValid ? 'border-green-500' : 'border-destructive') : ''
                  }`}
                  data-testid="input-handle"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {handleValidation.isChecking ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                  ) : handleValidation.isAvailable === true ? (
                    <Check className="h-4 w-4 text-green-500" data-testid="icon-handle-available" />
                  ) : handleValidation.isAvailable === false ? (
                    <X className="h-4 w-4 text-destructive" data-testid="icon-handle-taken" />
                  ) : null}
                </div>
              </div>
              {handleValidation.message && (
                <p 
                  className={`text-sm ${
                    handleValidation.isValid ? 'text-green-600' : 'text-destructive'
                  }`}
                  data-testid="text-handle-message"
                >
                  {handleValidation.message}
                </p>
              )}
            </div>

            {/* Display Name Input (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name (optional)</Label>
              <Input
                id="displayName"
                type="text"
                placeholder="Your Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                data-testid="input-display-name"
              />
            </div>

            {/* Avatar Upload (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar (optional)</Label>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-16 h-16 rounded-full object-cover"
                      data-testid="img-avatar-preview"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    data-testid="input-avatar-file"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('avatar')?.click()}
                    className="w-full"
                    data-testid="button-upload-avatar"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {avatarFile ? 'Change Avatar' : 'Upload Avatar'}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG, GIF up to 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!handleValidation.isValid || submitting}
              className="w-full"
              data-testid="button-complete-profile"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Completing Profile...
                </>
              ) : (
                'Complete Profile'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingPage;