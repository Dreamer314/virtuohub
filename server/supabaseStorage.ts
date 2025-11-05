import { supabaseAdmin } from "./supabaseClient";
import { MemStorage } from "./storage";
import { IStorage } from "./storage-interface";
import type { 
  User, InsertUser, Post, InsertPost, SavedPost, InsertSavedPost, 
  PostWithAuthor, Category, Platform, Article, InsertArticle, 
  ArticleWithPost, Comment, InsertComment, CommentWithAuthor, 
  Profile, InsertProfile 
} from "@shared/schema";

export class SupabaseStorage implements IStorage {
  private memStorage: MemStorage;

  constructor() {
    // Use MemStorage for methods not yet migrated (comments, savedPosts, etc.)
    this.memStorage = new MemStorage();
  }

  // ============================================
  // Profile Methods (Supabase)
  // ============================================

  async getProfile(id: string): Promise<Profile | undefined> {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;

    return {
      id: data.id,
      handle: data.handle,
      displayName: data.display_name,
      avatarUrl: data.avatar_url,
      role: data.role,
      onboardingComplete: data.onboarding_complete,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  async upsertProfile(profile: InsertProfile): Promise<Profile> {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: profile.id,
        handle: profile.handle ?? null,
        display_name: profile.displayName ?? null,
        avatar_url: profile.avatarUrl ?? null,
        role: profile.role ?? 'user',
        onboarding_complete: profile.onboardingComplete ?? false,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id'
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase upsert error:', error);
      throw new Error(`Failed to upsert profile: ${error.message}`);
    }

    return {
      id: data.id,
      handle: data.handle,
      displayName: data.display_name,
      avatarUrl: data.avatar_url,
      role: data.role,
      onboardingComplete: data.onboarding_complete,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  async isHandleAvailable(handle: string): Promise<boolean> {
    const { data } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .ilike('handle', handle)
      .single();

    return !data; // Available if no matching profile found
  }

  // ============================================
  // Post Methods (Supabase with 2-step author hydration)
  // ============================================

  async createPost(post: InsertPost & { authorId: string }): Promise<Post> {
    console.log(
      'createPost(storage) image_urls length:',
      Array.isArray((post as any).image_urls) ? (post as any).image_urls.length : 'not-array'
    );

    // Prepare subtype_data for polls
    let subtypeData = null;
    let finalTitle = post.title;
    
    if (post.subtype === 'poll') {
      const pollOptions = Array.isArray((post as any).poll_options) ? (post as any).poll_options : [];
      const pollQuestion = (post as any).pollQuestion || post.title || post.body || 'Poll';
      
      subtypeData = {
        poll: {
          question: pollQuestion,
          options: pollOptions
        }
      };
      
      // Use poll question as title if title is missing
      if (!finalTitle) {
        finalTitle = pollQuestion;
      }
    }

    const { data, error } = await supabaseAdmin
      .from('posts')
      .insert({
        author_id: post.authorId,
        title: finalTitle,
        content: post.body,
        category: post.tags?.[0] || 'general',
        platform_tags: post.platforms || [],
        links: Array.isArray((post as any).links) ? (post as any).links : [],
        price: (post as any).price ?? null,
        subtype: post.subtype || 'thread',
        subtype_data: subtypeData,
        image_urls: Array.isArray((post as any).image_urls) ? (post as any).image_urls : [],
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create post: ${error.message}`);
    }

    return {
      id: data.id,
      authorId: data.author_id,
      title: data.title,
      summary: null,
      body: data.content,
      tags: [data.category],
      platforms: data.platform_tags || [],
      imageUrl: '',
      images: data.image_urls || [],
      files: data.file_urls || [],
      links: data.links || [],
      price: data.price || '',
      status: 'published',
      subtype: data.subtype || 'thread',
      subtypeData: data.subtype_data || null,
      likes: data.like_count || 0,
      comments: data.comments || 0,
      shares: data.shares || 0,
      views: 0,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at || data.created_at),
    };
  }

  async getPosts(filters?: { category?: Category; platforms?: Platform[]; authorId?: string }): Promise<PostWithAuthor[]> {
    let query = supabaseAdmin
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.authorId) {
      query = query.eq('author_id', filters.authorId);
    }

    if (filters?.category && filters.category !== 'All') {
      query = query.eq('category', filters.category);
    }

    const { data: posts, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch posts: ${error.message}`);
    }

    if (!posts || posts.length === 0) {
      return [];
    }

    // Step 2: Collect unique valid UUID author_ids
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    const uniqueIds = new Set(
      posts
        .map(p => p.author_id)
        .filter(id => id && uuidRegex.test(id))
    );
    const authorIds = Array.from(uniqueIds);

    // Step 3: Fetch profiles for valid UUIDs
    const profilesMap = new Map<string, any>();
    
    if (authorIds.length > 0) {
      const { data: profiles } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .in('id', authorIds);

      if (profiles) {
        profiles.forEach(p => profilesMap.set(p.id, p));
      }
    }

    // Step 4: Stitch posts with authors
    return posts.map(post => this.mapToPostWithAuthor(post, profilesMap));
  }

  async getPost(id: string): Promise<PostWithAuthor | undefined> {
    const { data: post, error } = await supabaseAdmin
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !post) return undefined;

    // Fetch author profile if author_id is valid UUID
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    const profilesMap = new Map<string, any>();

    if (post.author_id && uuidRegex.test(post.author_id)) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', post.author_id)
        .single();

      if (profile) {
        profilesMap.set(profile.id, profile);
      }
    }

    return this.mapToPostWithAuthor(post, profilesMap);
  }

  private extractPollMeta(row: any, myVote: number | null, tallies: number[]) {
    const pollNode = row?.subtype_data?.poll ?? null;
    const question =
      typeof pollNode?.question === 'string' ? pollNode.question : null;
    const options = Array.isArray(pollNode?.options)
      ? pollNode.options.filter((o: any) => typeof o === 'string')
      : [];

    const safeTallies = Array.isArray(tallies) ? tallies : new Array(options.length).fill(0);
    const total = safeTallies.reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0);

    return {
      poll: { question, options, tallies: safeTallies, total, my_vote: myVote },
      poll_question: question,
      poll_options: options,
      results: safeTallies,
      my_vote: myVote
    };
  }

  private mapToPostWithAuthor(data: any, profilesMap: Map<string, any>): PostWithAuthor {
    const profileData = profilesMap.get(data.author_id);
    
    const author: Profile = profileData ? {
      id: profileData.id,
      handle: profileData.handle,
      displayName: profileData.display_name,
      avatarUrl: profileData.avatar_url,
      role: profileData.role,
      onboardingComplete: profileData.onboarding_complete,
      createdAt: new Date(profileData.created_at),
      updatedAt: new Date(profileData.updated_at),
    } : {
      id: data.author_id,
      handle: null,
      displayName: null,
      avatarUrl: null,
      role: null,
      onboardingComplete: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    let post: any = {
      id: data.id,
      authorId: data.author_id,
      title: data.title,
      summary: null,
      body: data.content,
      tags: [data.category],
      platforms: data.platform_tags || [],
      imageUrl: '',
      images: data.image_urls || [],
      files: data.file_urls || [],
      links: data.links || [],
      price: data.price || '',
      status: 'published',
      subtype: data.subtype || 'thread',
      subtypeData: data.subtype_data || null,
      likes: data.like_count || 0,
      comments: data.comments || 0,
      shares: data.shares || 0,
      views: 0,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at || data.created_at),
      author,
    };

    if (data.subtype === 'poll') {
      const meta = this.extractPollMeta(data, null, []);
      post = { ...post, ...meta };
    }

    return post;
  }

  async updatePost(id: string, updates: Partial<Post>): Promise<Post | undefined> {
    const { data, error } = await supabaseAdmin
      .from('posts')
      .update({
        title: updates.title,
        content: updates.body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return undefined;

    return {
      id: data.id,
      authorId: data.author_id,
      title: data.title,
      summary: null,
      body: data.content,
      tags: [data.category],
      platforms: data.platform_tags || [],
      imageUrl: '',
      images: data.image_urls || [],
      files: data.file_urls || [],
      links: data.links || [],
      price: data.price || '',
      status: 'published',
      subtype: data.subtype || 'thread',
      subtypeData: null,
      likes: data.like_count || 0,
      comments: data.comments || 0,
      shares: data.shares || 0,
      views: 0,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at || data.created_at),
    };
  }

  async deletePost(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('posts')
      .delete()
      .eq('id', id);

    return !error;
  }

  // ============================================
  // Delegate to MemStorage (Not Yet Migrated)
  // ============================================

  async getUser(id: string): Promise<User | undefined> {
    return this.memStorage.getUser(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.memStorage.getUserByUsername(username);
  }

  async createUser(user: InsertUser): Promise<User> {
    return this.memStorage.createUser(user);
  }

  async savePost(userId: string, postId: string): Promise<SavedPost> {
    return this.memStorage.savePost(userId, postId);
  }

  async unsavePost(userId: string, postId: string): Promise<boolean> {
    return this.memStorage.unsavePost(userId, postId);
  }

  async getSavedPosts(userId: string): Promise<PostWithAuthor[]> {
    return this.memStorage.getSavedPosts(userId);
  }

  async isPostSaved(userId: string, postId: string): Promise<boolean> {
    return this.memStorage.isPostSaved(userId, postId);
  }

  async likePost(postId: string, userId: string): Promise<{ likes: number, hasLiked: boolean }> {
    console.log('[likePost] Toggle like for post:', postId, 'user:', userId);
    
    // Check if user has already liked this post
    const { data: existingLike } = await supabaseAdmin
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      // Unlike: delete the row and decrement like_count
      console.log('[likePost] Unliking post');
      
      const { error: deleteError } = await supabaseAdmin
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);

      if (deleteError) {
        console.error('[likePost] Delete error:', deleteError);
        throw new Error(`Failed to unlike post: ${deleteError.message}`);
      }

      // Decrement like_count (never below 0)
      const { data: post, error: updateError } = await supabaseAdmin
        .from('posts')
        .select('like_count')
        .eq('id', postId)
        .single();

      if (updateError) {
        console.error('[likePost] Error fetching post:', updateError);
        throw new Error(`Failed to fetch post: ${updateError.message}`);
      }

      const newCount = Math.max(0, (post?.like_count || 0) - 1);
      
      const { error: decrementError } = await supabaseAdmin
        .from('posts')
        .update({ like_count: newCount })
        .eq('id', postId);

      if (decrementError) {
        console.error('[likePost] Decrement error:', decrementError);
        throw new Error(`Failed to decrement like count: ${decrementError.message}`);
      }

      console.log('[likePost] Post unliked successfully, new count:', newCount);
      return { likes: newCount, hasLiked: false };
    } else {
      // Like: insert row and increment like_count
      console.log('[likePost] Liking post');
      
      const { error: insertError } = await supabaseAdmin
        .from('post_likes')
        .insert({
          post_id: postId,
          user_id: userId,
        });

      if (insertError) {
        console.error('[likePost] Insert error:', insertError);
        throw new Error(`Failed to like post: ${insertError.message}`);
      }

      // Increment like_count
      const { data: post, error: fetchError } = await supabaseAdmin
        .from('posts')
        .select('like_count')
        .eq('id', postId)
        .single();

      if (fetchError) {
        console.error('[likePost] Error fetching post:', fetchError);
        throw new Error(`Failed to fetch post: ${fetchError.message}`);
      }

      const newCount = (post?.like_count || 0) + 1;
      
      const { error: incrementError } = await supabaseAdmin
        .from('posts')
        .update({ like_count: newCount })
        .eq('id', postId);

      if (incrementError) {
        console.error('[likePost] Increment error:', incrementError);
        throw new Error(`Failed to increment like count: ${incrementError.message}`);
      }

      console.log('[likePost] Post liked successfully, new count:', newCount);
      return { likes: newCount, hasLiked: true };
    }
  }

  async addComment(postId: string): Promise<void> {
    return this.memStorage.addComment(postId);
  }

  async sharePost(postId: string): Promise<void> {
    return this.memStorage.sharePost(postId);
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    return this.memStorage.createArticle(article);
  }

  async getArticle(id: string): Promise<ArticleWithPost | undefined> {
    return this.memStorage.getArticle(id);
  }

  async getArticleBySlug(slug: string): Promise<ArticleWithPost | undefined> {
    return this.memStorage.getArticleBySlug(slug);
  }

  async updateArticle(id: string, updates: Partial<Article>): Promise<Article | undefined> {
    return this.memStorage.updateArticle(id, updates);
  }

  async createComment(commentData: InsertComment & { postId?: string }): Promise<Comment> {
    console.log('[createComment] Creating comment:', commentData);
    
    // Insert into Supabase - use like_count column
    const { data, error} = await supabaseAdmin
      .from('comments')
      .insert({
        post_id: (commentData as any).postId || null,
        author_id: commentData.authorId,
        content: commentData.content,
        parent_comment_id: commentData.parentId || null,
        like_count: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('[createComment] Error:', error);
      throw new Error(`Failed to create comment: ${error.message}`);
    }

    console.log('[createComment] Comment created:', data);
    
    // Map snake_case DB (like_count) to camelCase API (likes)
    return {
      id: data.id,
      postId: data.post_id,
      articleId: null,
      authorId: data.author_id,
      authoredByProfileId: null,
      content: data.content,
      parentId: data.parent_comment_id,
      likes: data.like_count || 0,
      createdAt: data.created_at ? new Date(data.created_at) : new Date(),
    };
  }

  async getComments(articleId: string): Promise<CommentWithAuthor[]> {
    console.log('[getComments] Fetching comments for article:', articleId);
    
    // Note: Articles are not stored in the comments table yet, return empty for now
    return [];
  }

  async getPostComments(postId: string): Promise<CommentWithAuthor[]> {
    console.log('[getPostComments] Fetching comments for post:', postId);
    
    const { data, error } = await supabaseAdmin
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .is('parent_comment_id', null)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[getPostComments] Error:', error);
      return [];
    }

    const comments = await Promise.all(
      (data || []).map(async (comment) => {
        const author = await this.getProfile(comment.author_id);
        
        // Get replies
        const { data: repliesData } = await supabaseAdmin
          .from('comments')
          .select('*')
          .eq('parent_comment_id', comment.id)
          .order('created_at', { ascending: true });

        const replies = await Promise.all(
          (repliesData || []).map(async (reply) => {
            const replyAuthor = await this.getProfile(reply.author_id);
            return {
              id: reply.id,
              postId: reply.post_id,
              articleId: null,
              authorId: reply.author_id,
              authoredByProfileId: null,
              content: reply.content,
              parentId: reply.parent_comment_id,
              likes: reply.like_count || 0,
              createdAt: reply.created_at ? new Date(reply.created_at) : new Date(),
              author: replyAuthor || {
                id: reply.author_id,
                handle: 'Unknown',
                displayName: 'Unknown User',
                avatarUrl: null,
                role: null,
                onboardingComplete: false,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            };
          })
        );

        return {
          id: comment.id,
          postId: comment.post_id,
          articleId: null,
          authorId: comment.author_id,
          authoredByProfileId: null,
          content: comment.content,
          parentId: comment.parent_comment_id,
          likes: comment.like_count || 0,
          createdAt: comment.created_at ? new Date(comment.created_at) : new Date(),
          author: author || {
            id: comment.author_id,
            handle: 'Unknown',
            displayName: 'Unknown User',
            avatarUrl: null,
            role: null,
            onboardingComplete: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          replies,
        };
      })
    );

    return comments;
  }

  async likeComment(commentId: string, userId: string): Promise<{ likes: number, hasLiked: boolean }> {
    console.log('[likeComment] Toggle like for comment:', commentId, 'user:', userId);
    
    // Check if user has already liked this comment
    const { data: existingLike } = await supabaseAdmin
      .from('comment_likes')
      .select('id')
      .eq('comment_id', commentId)
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      // Unlike: delete the row and decrement like_count
      console.log('[likeComment] Unliking comment');
      
      const { error: deleteError } = await supabaseAdmin
        .from('comment_likes')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', userId);

      if (deleteError) {
        console.error('[likeComment] Delete error:', deleteError);
        throw new Error(`Failed to unlike comment: ${deleteError.message}`);
      }

      // Decrement like_count (never below 0)
      const { data: comment, error: updateError } = await supabaseAdmin
        .from('comments')
        .select('like_count')
        .eq('id', commentId)
        .single();

      if (updateError) {
        console.error('[likeComment] Error fetching comment:', updateError);
        throw new Error(`Failed to fetch comment: ${updateError.message}`);
      }

      const newCount = Math.max(0, (comment?.like_count || 0) - 1);
      
      const { error: decrementError } = await supabaseAdmin
        .from('comments')
        .update({ like_count: newCount })
        .eq('id', commentId);

      if (decrementError) {
        console.error('[likeComment] Decrement error:', decrementError);
        throw new Error(`Failed to decrement like count: ${decrementError.message}`);
      }

      console.log('[likeComment] Comment unliked successfully, new count:', newCount);
      return { likes: newCount, hasLiked: false };
    } else {
      // Like: insert row and increment like_count
      console.log('[likeComment] Liking comment');
      
      const { error: insertError } = await supabaseAdmin
        .from('comment_likes')
        .insert({
          comment_id: commentId,
          user_id: userId,
        });

      if (insertError) {
        console.error('[likeComment] Insert error:', insertError);
        throw new Error(`Failed to like comment: ${insertError.message}`);
      }

      // Increment like_count
      const { data: comment, error: fetchError } = await supabaseAdmin
        .from('comments')
        .select('like_count')
        .eq('id', commentId)
        .single();

      if (fetchError) {
        console.error('[likeComment] Error fetching comment:', fetchError);
        throw new Error(`Failed to fetch comment: ${fetchError.message}`);
      }

      const newCount = (comment?.like_count || 0) + 1;
      
      const { error: incrementError } = await supabaseAdmin
        .from('comments')
        .update({ like_count: newCount })
        .eq('id', commentId);

      if (incrementError) {
        console.error('[likeComment] Increment error:', incrementError);
        throw new Error(`Failed to increment like count: ${incrementError.message}`);
      }

      console.log('[likeComment] Comment liked successfully, new count:', newCount);
      return { likes: newCount, hasLiked: true };
    }
  }

  async hasUserLikedPost(postId: string, userId: string): Promise<boolean> {
    const { data } = await supabaseAdmin
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    return !!data;
  }

  async hasUserLikedComment(commentId: string, userId: string): Promise<boolean> {
    const { data } = await supabaseAdmin
      .from('comment_likes')
      .select('id')
      .eq('comment_id', commentId)
      .eq('user_id', userId)
      .single();

    return !!data;
  }

  async voteOnPoll(postId: string, optionIndex: number): Promise<PostWithAuthor | null> {
    return this.memStorage.voteOnPoll(postId, optionIndex);
  }

  // ============================================
  // Poll Vote Methods (Supabase)
  // ============================================

  async voteOnPostPoll(postId: string, voterId: string, optionIndex: number): Promise<{ ok: boolean; error?: string }> {
    console.log('[voteOnPostPoll] Starting vote save:', { postId, voterId, optionIndex });
    
    const { data, error } = await supabaseAdmin
      .from('post_poll_votes')
      .upsert({
        post_id: postId,
        voter_id: voterId,
        option_index: optionIndex,
      }, {
        onConflict: 'post_id,voter_id',
        ignoreDuplicates: false
      })
      .select();

    console.log('[voteOnPostPoll] Upsert result:', { data, error });

    if (error) {
      const errorMsg = error.message || 'Database error while saving vote';
      console.error('[voteOnPostPoll] vote error', { postId, voterId, optionIndex, err: errorMsg, details: error });
      return { ok: false, error: errorMsg };
    }

    // Check if data was actually written
    if (!data || data.length === 0) {
      console.error('[voteOnPostPoll] No rows returned from upsert - vote not saved');
      return { ok: false, error: 'Vote not saved - no rows returned' };
    }

    console.log('[voteOnPostPoll] Vote saved successfully:', data);
    return { ok: true };
  }

  async getPostPollVote(postId: string, voterId: string): Promise<number | null> {
    const { data, error } = await supabaseAdmin
      .from('post_poll_votes')
      .select('option_index')
      .eq('post_id', postId)
      .eq('voter_id', voterId)
      .maybeSingle();

    if (error || !data) return null;
    return data.option_index;
  }

  async getPostPollResults(postId: string): Promise<number[]> {
    const { data, error } = await supabaseAdmin
      .from('post_poll_votes')
      .select('option_index')
      .eq('post_id', postId);

    if (error || !data) return [];

    const results: number[] = [];
    for (const vote of data) {
      const idx = vote.option_index;
      results[idx] = (results[idx] || 0) + 1;
    }

    return results;
  }

  async getMyVote(postId: string, voterId: string): Promise<number | null> {
    const { data, error } = await supabaseAdmin
      .from('post_poll_votes')
      .select('option_index')
      .eq('post_id', postId)
      .eq('voter_id', voterId)
      .single();
    
    if (error || !data) return null;
    return data.option_index;
  }

  async getPostPollTallies(postIds: string[]): Promise<Record<string, number[]>> {
    if (postIds.length === 0) {
      return {};
    }

    const { data: counts, error: cErr } = await supabaseAdmin
      .from('post_poll_votes')
      .select('post_id, option_index')
      .in('post_id', postIds);
    
    if (cErr || !counts) {
      return {};
    }

    const talliesByPost: Record<string, Record<number, number>> = {};
    counts.forEach(vote => {
      if (!talliesByPost[vote.post_id]) {
        talliesByPost[vote.post_id] = {};
      }
      const optIdx = vote.option_index;
      talliesByPost[vote.post_id][optIdx] = (talliesByPost[vote.post_id][optIdx] || 0) + 1;
    });

    const result: Record<string, number[]> = {};
    Object.keys(talliesByPost).forEach(postId => {
      const maxIdx = Math.max(...Object.keys(talliesByPost[postId]).map(Number));
      const arr = new Array(maxIdx + 1).fill(0);
      Object.entries(talliesByPost[postId]).forEach(([idx, count]) => {
        arr[Number(idx)] = count;
      });
      result[postId] = arr;
    });

    return result;
  }

  async getPostPollTalliesOld(postIds: string[], voterId?: string): Promise<{ 
    ok: boolean; 
    error?: string; 
    counts?: { post_id: string; option_index: number; count: number }[]; 
    mine?: { post_id: string; option_index: number }[] 
  }> {
    if (postIds.length === 0) {
      return { ok: true, counts: [], mine: [] };
    }

    // Get vote counts for all posts
    const { data: counts, error: cErr } = await supabaseAdmin
      .from('post_poll_votes')
      .select('post_id, option_index')
      .in('post_id', postIds);
    
    if (cErr) {
      return { ok: false, error: cErr.message };
    }

    // Aggregate counts manually since Supabase doesn't support count(*) with group by in the same way
    const countMap = new Map<string, number>();
    (counts || []).forEach(vote => {
      const key = `${vote.post_id}:${vote.option_index}`;
      countMap.set(key, (countMap.get(key) || 0) + 1);
    });

    const aggregatedCounts = Array.from(countMap.entries()).map(([key, count]) => {
      const [post_id, option_index] = key.split(':');
      return { post_id, option_index: parseInt(option_index), count };
    });

    // Get user's votes if voterId is provided
    let mine: { post_id: string; option_index: number }[] = [];
    if (voterId) {
      console.log('[getPostPollTallies] Fetching votes for voterId:', voterId, 'postIds:', postIds);
      const { data: mv, error: mErr } = await supabaseAdmin
        .from('post_poll_votes')
        .select('post_id, option_index')
        .eq('voter_id', voterId)
        .in('post_id', postIds);
      
      if (mErr) {
        console.error('[getPostPollTallies] Error fetching user votes:', mErr);
        return { ok: false, error: mErr.message };
      }
      mine = mv || [];
      console.log('[getPostPollTallies] Found user votes:', mine.length, mine);
    }

    return { ok: true, counts: aggregatedCounts, mine };
  }
}
