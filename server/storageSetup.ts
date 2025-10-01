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

export async function ensurePostImagesBucket() {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return false;
    }

    const postImagesBucket = buckets?.find(bucket => bucket.name === 'post-images');
    
    if (postImagesBucket) {
      console.log('Post-images bucket already exists');
      
      // Ensure it's public
      if (!postImagesBucket.public) {
        const { error: updateError } = await supabaseAdmin.storage.updateBucket('post-images', {
          public: true
        });
        if (updateError) {
          console.error('Error updating post-images bucket to public:', updateError);
        } else {
          console.log('Updated post-images bucket to public');
        }
      }
      return true;
    }

    // Create the bucket
    const { data: bucket, error: createError } = await supabaseAdmin.storage.createBucket('post-images', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      fileSizeLimit: 10485760 // 10MB
    });

    if (createError) {
      console.error('Error creating post-images bucket:', createError);
      return false;
    }

    console.log('Successfully created post-images bucket:', bucket);
    console.log('⚠️  IMPORTANT: Set up Storage RLS policies in Supabase SQL editor:');
    console.log('   1. Public read: create policy "Public read post-images" on storage.objects for select to public using (bucket_id = \'post-images\');');
    console.log('   2. Authenticated upload: create policy "Authenticated upload post-images" on storage.objects for insert to authenticated with check (bucket_id = \'post-images\');');
    return true;
  } catch (error) {
    console.error('Unexpected error in ensurePostImagesBucket:', error);
    return false;
  }
}