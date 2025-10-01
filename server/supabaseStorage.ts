import { supabaseAdmin } from './supabaseClient';
import { MemStorage } from './storage';
import { IStorage } from './storage-interface';
import type {
  User, InsertUser, Post, InsertPost, SavedPost, InsertSavedPost,
  PostWithAuthor, Category, Platform, Article, InsertArticle,
  ArticleWithPost, Comment, InsertComment, CommentWithAuthor,
  Profile, InsertProfile
} from '@shared/schema';

export class SupabaseStorage implements IStorage {
  private memStorage: MemStorage;
  constructor() {
    this.memStorage = new MemStorage();
  }

  // ============ Profiles ============
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
      }, { onConflict: 'id' })
      .select()
      .single();
    if (error) throw new Error(`Failed to upsert profile: ${error.message}`);
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
      .maybeSingle();
    return !data;
  }

  // ============ Posts ============
  async createPost(post: any): Promise<Post> {
    // This is the new "translator" logic
    const payload = {
      author_id: post.authorId,
      title: post.title,
      // It now correctly accepts 'body' from the frontend and saves it to the 'content' column
      content: post.body ?? post.content ?? null,
      category: post.category ?? (post.tags?.[0] || 'general'),
      // It maps 'platforms' to 'platform_tags'
      platform_tags: Array.isArray(post.platforms) ? post.platforms : [],
      // The key fix: It maps 'images' to 'image_urls'
      image_urls: Array.isArray(post.images) ? post.images : (Array.isArray(post.image_urls) ? post.image_urls : []),
      file_urls: Array.isArray(post.files) ? post.files : [],
      links: Array.isArray(post.links) ? post.links : [],
      price: post.price ?? null,
      subtype: post.subtype ?? 'thread',
      // It intelligently handles poll data
      poll_options: post.subtype === 'poll'
        ? (Array.isArray(post.subtypeData?.options) ? post.subtypeData.options.filter(Boolean) : (Array.isArray(post.poll_options) ? post.poll_options : null))
        : null,
    };

    const { data, error } = await supabaseAdmin
      .from('posts')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("Supabase createPost error:", error);
      throw new Error(`Failed to create post: ${error.message}`);
    }

    // This part remains the same, mapping DB data back to the app's format
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
        options: (data.poll_options as string[]).map((text: string) => ({ text, votes: 0, percentage: 0 }))
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
      .select(`
        id, created_at, updated_at, author_id, title, content, category,
        platform_tags, links, image_urls, file_urls, price, subtype, poll_options,
        likes, comments, shares,
        profiles!author_id(id, handle, display_name, avatar_url, onboarding_complete)
      `)
      .order('created_at', { ascending: false });

    if (filters?.authorId) query = query.eq('author_id', filters.authorId);
    if (filters?.category && filters.category !== 'All') query = query.eq('category', filters.category);

    const { data, error } = await query;
    if (error) throw new Error(`Failed to fetch posts: ${error.message}`);

    return (data || []).map((row: any) => this.mapToPostWithAuthor(row));
  }

  async getPost(id: string): Promise<PostWithAuthor | undefined> {
    const { data, error } = await supabaseAdmin
      .from('posts')
      .select(`
        id, created_at, updated_at, author_id, title, content, category,
        platform_tags, links, image_urls, file_urls, price, subtype, poll_options,
        likes, comments, shares,
        profiles!author_id(id, handle, display_name, avatar_url, onboarding_complete)
      `)
      .eq('id', id)
      .single();
    if (error || !data) return undefined;
    return this.mapToPostWithAuthor(data);
  }

  private mapToPostWithAuthor(data: any): PostWithAuthor {
    const author = data.profiles || {
      id: data.author_id, handle: null, display_name: null, avatar_url: null, onboarding_complete: false
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
        options: (data.poll_options as string[]).map((text: string) => ({ text, votes: 0, percentage: 0 }))
      } : null,
      likes: data.likes || 0,
      comments: data.comments || 0,
      shares: data.shares || 0,
      views: 0,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at || data.created_at),
      author: {
        id: author.id,
        handle: author.handle,
        displayName: author.display_name,
        avatarUrl: author.avatar_url,
        role: null,
        onboardingComplete: author.onboarding_complete,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };
  }

  // ===== delegate (unchanged) =====
  async getUser(id: string): Promise<User | undefined> { return this.memStorage.getUser(id); }
  async getUserByUsername(username: string): Promise<User | undefined> { return this.memStorage.getUserByUsername(username); }
  async createUser(user: InsertUser): Promise<User> { return this.memStorage.createUser(user); }
  async savePost(userId: string, postId: string): Promise<SavedPost> { return this.memStorage.savePost(userId, postId); }
  async unsavePost(userId: string, postId: string): Promise<boolean> { return this.memStorage.unsavePost(userId, postId); }
  async getSavedPosts(userId: string): Promise<PostWithAuthor[]> { return this.memStorage.getSavedPosts(userId); }
  async isPostSaved(userId: string, postId: string): Promise<boolean> { return this.memStorage.isPostSaved(userId, postId); }
  async likePost(postId: string): Promise<void> { return this.memStorage.likePost(postId); }
  async addComment(postId: string): Promise<void> { return this.memStorage.addComment(postId); }
  async sharePost(postId: string): Promise<void> { return this.memStorage.sharePost(postId); }
  async createArticle(article: InsertArticle): Promise<Article> { return this.memStorage.createArticle(article); }
  async getArticle(id: string): Promise<ArticleWithPost | undefined> { return this.memStorage.getArticle(id); }
  async getArticleBySlug(slug: string): Promise<ArticleWithPost | undefined> { return this.memStorage.getArticleBySlug(slug); }
  async updateArticle(id: string, updates: Partial<Article>): Promise<Article | undefined> { return this.memStorage.updateArticle(id, updates); }
  async createComment(comment: InsertComment): Promise<Comment> { return this.memStorage.createComment(comment); }
  async getComments(articleId: string): Promise<CommentWithAuthor[]> { return this.memStorage.getComments(articleId); }
  async getPostComments(postId: string): Promise<CommentWithAuthor[]> { return this.memStorage.getPostComments(postId); }
  async likeComment(commentId: string): Promise<void> { return this.memStorage.likeComment(commentId); }
}