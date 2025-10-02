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

    const { data, error } = await supabaseAdmin
      .from('posts')
      .insert({
        author_id: post.authorId,
        title: post.title,
        content: post.body,
        category: post.tags?.[0] || 'general',
        platform_tags: post.platforms || [],
        links: Array.isArray((post as any).links) ? (post as any).links : [],
        price: (post as any).price ?? null,
        subtype: post.subtype || 'thread',
        poll_options: post.subtype === 'poll'
          ? Array.isArray((post as any).poll_options) ? (post as any).poll_options : null
          : null,
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
      subtypeData: data.poll_options ? {
        question: data.title ?? data.content ?? '',
        choices: data.poll_options.map((text: string) => ({ text, votes: 0, id: text }))
      } : null,
      likes: data.likes || 0,
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
      subtypeData: data.poll_options ? {
        question: data.title ?? data.content ?? '',
        choices: data.poll_options.map((text: string) => ({ text, votes: 0, id: text }))
      } : null,
      likes: data.likes || 0,
      comments: data.comments || 0,
      shares: data.shares || 0,
      views: 0,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at || data.created_at),
      author,
    };
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
      likes: data.likes || 0,
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

  async likePost(postId: string): Promise<void> {
    return this.memStorage.likePost(postId);
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

  async createComment(comment: InsertComment): Promise<Comment> {
    return this.memStorage.createComment(comment);
  }

  async getComments(articleId: string): Promise<CommentWithAuthor[]> {
    return this.memStorage.getComments(articleId);
  }

  async getPostComments(postId: string): Promise<CommentWithAuthor[]> {
    return this.memStorage.getPostComments(postId);
  }

  async likeComment(commentId: string): Promise<void> {
    return this.memStorage.likeComment(commentId);
  }

  async voteOnPoll(postId: string, optionIndex: number): Promise<PostWithAuthor | null> {
    return this.memStorage.voteOnPoll(postId, optionIndex);
  }
}
