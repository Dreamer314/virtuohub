import { supabaseAdmin } from './supabaseClient';

export async function ensureAvatarsBucket() {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return false;
    }

    const avatarsBucket = buckets?.find(bucket => bucket.name === 'avatars');
    
    if (avatarsBucket) {
      console.log('Avatars bucket already exists');
      return true;
    }

    // Create the bucket
    const { data: bucket, error: createError } = await supabaseAdmin.storage.createBucket('avatars', {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
      fileSizeLimit: 5242880 // 5MB
    });

    if (createError) {
      console.error('Error creating avatars bucket:', createError);
      return false;
    }

    console.log('Successfully created avatars bucket:', bucket);
    return true;
  } catch (error) {
    console.error('Unexpected error in ensureAvatarsBucket:', error);
    return false;
  }
}