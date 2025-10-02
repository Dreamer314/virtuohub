import { type User, type InsertUser, type Post, type InsertPost, type SavedPost, type InsertSavedPost, type PostWithAuthor, type Category, type Platform, type Article, type InsertArticle, type ArticleWithPost, type Comment, type InsertComment, type CommentWithAuthor, type Profile, type InsertProfile } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Profile methods  
  getProfile(id: string): Promise<Profile | undefined>;
  upsertProfile(profile: InsertProfile): Promise<Profile>;
  isHandleAvailable(handle: string): Promise<boolean>;

  // Post methods
  createPost(post: InsertPost & { authorId: string }): Promise<Post>;
  getPosts(filters?: { category?: Category; platforms?: Platform[]; authorId?: string }): Promise<PostWithAuthor[]>;
  getPost(id: string): Promise<PostWithAuthor | undefined>;
  updatePost(id: string, updates: Partial<Post>): Promise<Post | undefined>;
  deletePost(id: string): Promise<boolean>;

  // Saved posts methods
  savePost(userId: string, postId: string): Promise<SavedPost>;
  unsavePost(userId: string, postId: string): Promise<boolean>;
  getSavedPosts(userId: string): Promise<PostWithAuthor[]>;
  isPostSaved(userId: string, postId: string): Promise<boolean>;

  // Engagement methods
  likePost(postId: string): Promise<void>;
  addComment(postId: string): Promise<void>;
  sharePost(postId: string): Promise<void>;

  // Article methods
  createArticle(article: InsertArticle): Promise<Article>;
  getArticle(id: string): Promise<ArticleWithPost | undefined>;
  getArticleBySlug(slug: string): Promise<ArticleWithPost | undefined>;
  updateArticle(id: string, updates: Partial<Article>): Promise<Article | undefined>;

  // Comment methods
  createComment(comment: InsertComment): Promise<Comment>;
  getComments(articleId: string): Promise<CommentWithAuthor[]>;
  getPostComments(postId: string): Promise<CommentWithAuthor[]>;
  likeComment(commentId: string): Promise<void>;

  // Poll vote methods
  voteOnPostPoll(postId: string, voterId: string, optionIndex: number): Promise<{ ok: boolean; error?: string }>;
  getPostPollVote(postId: string, voterId: string): Promise<number | null>;
  getPostPollResults(postId: string): Promise<number[]>;
}