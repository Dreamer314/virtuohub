import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { nanoid } from 'nanoid';

interface UploadResult {
  url: string | null;
  error: string | null;
}

export function useAvatarUpload() {
  const [uploading, setUploading] = useState(false);

  const uploadAvatar = async (file: File, userId: string): Promise<UploadResult> => {
    setUploading(true);
    
    try {
      // Validate file type
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        throw new Error('Please upload a PNG, JPEG, GIF, or WEBP image');
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${nanoid(8)}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return { url: publicUrl, error: null };
    } catch (error) {
      console.error('Avatar upload error:', error);
      return {
        url: null,
        error: error instanceof Error ? error.message : 'Failed to upload avatar'
      };
    } finally {
      setUploading(false);
    }
  };

  return { uploadAvatar, uploading };
}
