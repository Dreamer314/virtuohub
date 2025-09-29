import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabaseClient';
import { nanoid } from 'nanoid';
import { Upload, X, Check, AlertCircle } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface WelcomeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WelcomeModal({ open, onOpenChange }: WelcomeModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [handle, setHandle] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Handle validation
  const [handleValidation, setHandleValidation] = useState({
    isValid: false,
    isAvailable: null as boolean | null,
    isChecking: false,
    message: ''
  });

  // Validate handle with debouncing
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

    const handleRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!handleRegex.test(handle)) {
      setHandleValidation({
        isValid: false,
        isAvailable: null,
        isChecking: false,
        message: 'Handle must be 3-20 characters (letters, numbers, underscores only)'
      });
      return;
    }

    const timeoutId = setTimeout(async () => {
      setHandleValidation(prev => ({
        ...prev,
        isChecking: true,
        message: 'Checking availability...'
      }));

      try {
        const response = await fetch('/api/profile/handle/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ handle })
        });

        const data = await response.json();

        if (response.ok) {
          setHandleValidation({
            isValid: data.available,
            isAvailable: data.available,
            isChecking: false,
            message: data.available ? 'Handle is available!' : 'Handle already taken'
          });
        } else {
          setHandleValidation({
            isValid: false,
            isAvailable: false,
            isChecking: false,
            message: 'Error checking handle'
          });
        }
      } catch (error) {
        setHandleValidation({
          isValid: false,
          isAvailable: null,
          isChecking: false,
          message: 'Error checking handle'
        });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [handle]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file',
        variant: 'destructive'
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image under 5MB',
        variant: 'destructive'
      });
      return;
    }

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!handleValidation.isValid || !user) {
      return;
    }

    setSubmitting(true);

    try {
      let avatarUrl: string | null = null;

      // Upload avatar if provided (non-blocking)
      if (avatarFile) {
        try {
          const fileExt = avatarFile.name.split('.').pop();
          const fileName = `${user.id}/${nanoid()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, avatarFile);

          if (uploadError) {
            toast({
              title: 'Avatar upload failed',
              description: 'Continuing with handle only',
              variant: 'default'
            });
          } else {
            const { data } = supabase.storage
              .from('avatars')
              .getPublicUrl(fileName);
            avatarUrl = data.publicUrl;
          }
        } catch (error) {
          // Non-blocking: continue without avatar
          console.error('Avatar upload error:', error);
        }
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
          avatarUrl,
          onboardingComplete: true
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }

      // Mark as welcomed
      localStorage.setItem(`welcomed_${user.id}`, 'true');

      // Invalidate profile query to refresh header immediately
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });

      toast({
        title: 'Profile completed!',
        description: 'Welcome to VirtuoHub!'
      });

      onOpenChange(false);

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

  const handleClose = () => {
    setShowConfirm(true);
  };

  const handleDoItLater = () => {
    if (user) {
      localStorage.setItem(`welcomed_${user.id}`, 'true');
    }
    setShowConfirm(false);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(newOpen) => {
        if (!newOpen) {
          handleClose();
        }
      }}>
        <DialogContent className="sm:max-w-md" data-testid="welcome-modal">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Welcome to VirtuoHub
            </DialogTitle>
            <DialogDescription>
              Pick a username and photo so people know it's you.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            {/* Handle Input */}
            <div className="space-y-2">
              <Label htmlFor="handle">
                Username <span className="text-destructive">*</span>
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
                  data-testid="welcome-handle-input"
                />
                {handleValidation.isChecking && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                  </div>
                )}
                {!handleValidation.isChecking && handleValidation.isAvailable === true && (
                  <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                )}
                {!handleValidation.isChecking && handleValidation.isAvailable === false && (
                  <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
                )}
              </div>
              {handleValidation.message && (
                <p className={`text-sm ${
                  handleValidation.isValid ? 'text-green-500' : 'text-muted-foreground'
                }`}>
                  {handleValidation.message}
                </p>
              )}
            </div>

            {/* Avatar Upload */}
            <div className="space-y-2">
              <Label>Profile Photo (optional)</Label>
              <div className="flex items-center gap-4">
                {avatarPreview ? (
                  <div className="relative w-20 h-20">
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarFile(null);
                        setAvatarPreview(null);
                      }}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                    data-testid="welcome-avatar-upload"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Photo
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
              className="w-full"
              disabled={!handleValidation.isValid || submitting}
              data-testid="welcome-submit"
            >
              {submitting ? 'Completing...' : 'Complete profile'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent data-testid="welcome-confirm-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Leave setup for now?</AlertDialogTitle>
            <AlertDialogDescription>
              You can keep browsing and posting with a temporary identity. You can finish your profile anytime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDoItLater} data-testid="welcome-do-later">
              Do it later
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => setShowConfirm(false)} data-testid="welcome-finish-now">
              Finish now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
