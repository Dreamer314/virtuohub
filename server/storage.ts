import { type User, type InsertUser, type Post, type InsertPost, type SavedPost, type InsertSavedPost, type PostWithAuthor, type Category, type Platform } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private posts: Map<string, Post>;
  private savedPosts: Map<string, SavedPost>;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.savedPosts = new Map();
    this.seedData();
  }

  private seedData() {
    // Create sample users
    const sampleUsers = [
      {
        id: 'user1',
        username: 'sarah_chen',
        password: 'password',
        displayName: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b047?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
        bio: '3D Artist specializing in VRChat avatars',
        role: '3D Artist',
        createdAt: new Date(),
      },
      {
        id: 'user2', 
        username: 'mike_rodriguez',
        password: 'password',
        displayName: 'Mike Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        bio: 'Game Developer building worlds in Roblox',
        role: 'Game Developer',
        createdAt: new Date(),
      },
      {
        id: 'user3',
        username: 'emma_thompson',
        password: 'password',
        displayName: 'Emma Thompson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        bio: 'VR Environment Artist',
        role: 'VR Environment Artist',
        createdAt: new Date(),
      }
    ];

    sampleUsers.forEach(user => {
      this.users.set(user.id, user);
    });

    // Create sample posts
    const samplePosts = [
      {
        id: 'post1',
        authorId: 'user1',
        title: 'New VRChat Avatar Pack - Cyberpunk Collection',
        content: 'Created a stunning cyberpunk-themed avatar collection for VRChat! Each avatar features neon accents, holographic details, and custom particle effects. Perfect for futuristic roleplay worlds!',
        imageUrl: '',
        category: 'Assets for Sale',
        platforms: ['VRChat'],
        price: '$180',
        type: 'regular',
        pollData: null,
        likes: 156,
        comments: 23,
        shares: 9,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      },
      {
        id: 'post2',
        authorId: 'user2',
        title: 'Looking for 3D modelers for Roblox adventure game',
        content: "We're building an epic adventure game in Roblox and need talented 3D artists to join our team. Competitive rates and profit sharing available!",
        imageUrl: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=800',
        category: 'Jobs & Gigs',
        platforms: ['Roblox'],
        price: '$30-50/hr',
        type: 'regular',
        pollData: null,
        likes: 89,
        comments: 31,
        shares: 12,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      },
      {
        id: 'post3',
        authorId: 'user1',
        title: "What's your preferred platform for virtual world creation?",
        content: 'Curious to see what platforms our community prefers for creating virtual experiences!',
        imageUrl: '',
        category: 'General',
        platforms: ['VRChat', 'Roblox', 'Second Life'],
        price: '',
        type: 'pulse',
        pollData: {
          question: "What's your preferred platform for virtual world creation?",
          options: [
            { text: 'Unity', votes: 45, percentage: 45 },
            { text: 'Unreal Engine', votes: 30, percentage: 30 },
            { text: 'Blender', votes: 25, percentage: 25 }
          ],
          totalVotes: 100,
          endsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
        },
        likes: 67,
        comments: 23,
        shares: 8,
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      },
      {
        id: 'post4',
        authorId: 'user3',
        title: 'From Hobby to $100K: My VRChat Avatar Business Journey',
        content: 'Exclusive interview with top VRChat creator Alex Morgan on building a six-figure avatar business, managing clients, and scaling creative work in virtual worlds.',
        imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
        category: 'General',
        platforms: ['VRChat'],
        price: '',
        type: 'insight',
        pollData: null,
        likes: 156,
        comments: 42,
        shares: 28,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      }
    ];

    samplePosts.forEach(post => {
      this.posts.set(post.id, post);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      avatar: insertUser.avatar || null,
      bio: insertUser.bio || null,
      role: 'User',
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async createPost(postData: InsertPost & { authorId: string }): Promise<Post> {
    const id = randomUUID();
    const post: Post = {
      ...postData,
      id,
      imageUrl: postData.imageUrl || null,
      price: postData.price || null,
      type: postData.type || 'regular',
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: new Date(),
    };
    this.posts.set(id, post);
    return post;
  }

  async getPosts(filters?: { category?: Category; platforms?: Platform[]; authorId?: string }): Promise<PostWithAuthor[]> {
    let posts = Array.from(this.posts.values());
    
    if (filters?.category && filters.category !== 'All') {
      posts = posts.filter(post => post.category === filters.category);
    }
    
    if (filters?.platforms && filters.platforms.length > 0) {
      posts = posts.filter(post => 
        post.platforms.some(platform => filters.platforms!.includes(platform as Platform))
      );
    }

    if (filters?.authorId) {
      posts = posts.filter(post => post.authorId === filters.authorId);
    }
    
    // Sort by creation date (newest first)
    posts.sort((a, b) => (b.createdAt || new Date()).getTime() - (a.createdAt || new Date()).getTime());
    
    // Add author information
    const postsWithAuthors = await Promise.all(
      posts.map(async (post) => {
        const author = await this.getUser(post.authorId);
        return {
          ...post,
          author: author!,
        };
      })
    );
    
    return postsWithAuthors;
  }

  async getPost(id: string): Promise<PostWithAuthor | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;
    
    const author = await this.getUser(post.authorId);
    if (!author) return undefined;
    
    return {
      ...post,
      author,
    };
  }

  async updatePost(id: string, updates: Partial<Post>): Promise<Post | undefined> {
    const existingPost = this.posts.get(id);
    if (!existingPost) return undefined;
    
    const updatedPost = { ...existingPost, ...updates };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async deletePost(id: string): Promise<boolean> {
    return this.posts.delete(id);
  }

  async savePost(userId: string, postId: string): Promise<SavedPost> {
    const id = randomUUID();
    const savedPost: SavedPost = {
      id,
      userId,
      postId,
      createdAt: new Date(),
    };
    this.savedPosts.set(id, savedPost);
    return savedPost;
  }

  async unsavePost(userId: string, postId: string): Promise<boolean> {
    const saved = Array.from(this.savedPosts.values()).find(
      saved => saved.userId === userId && saved.postId === postId
    );
    
    if (saved) {
      return this.savedPosts.delete(saved.id);
    }
    
    return false;
  }

  async getSavedPosts(userId: string): Promise<PostWithAuthor[]> {
    const savedPostEntries = Array.from(this.savedPosts.values())
      .filter(saved => saved.userId === userId);
    
    const posts = await Promise.all(
      savedPostEntries.map(async (saved) => {
        return await this.getPost(saved.postId);
      })
    );
    
    return posts.filter(Boolean) as PostWithAuthor[];
  }

  async isPostSaved(userId: string, postId: string): Promise<boolean> {
    return Array.from(this.savedPosts.values()).some(
      saved => saved.userId === userId && saved.postId === postId
    );
  }

  async likePost(postId: string): Promise<void> {
    const post = this.posts.get(postId);
    if (post) {
      post.likes = (post.likes || 0) + 1;
      this.posts.set(postId, post);
    }
  }

  async addComment(postId: string): Promise<void> {
    const post = this.posts.get(postId);
    if (post) {
      post.comments = (post.comments || 0) + 1;
      this.posts.set(postId, post);
    }
  }

  async sharePost(postId: string): Promise<void> {
    const post = this.posts.get(postId);
    if (post) {
      post.shares = (post.shares || 0) + 1;
      this.posts.set(postId, post);
    }
  }

  async voteOnPoll(postId: string, optionIndex: number): Promise<PostWithAuthor | null> {
    const post = this.posts.get(postId);
    if (!post || post.type !== 'pulse' || !post.pollData) {
      return null;
    }

    // Update the vote count for the selected option
    if (post.pollData.options && post.pollData.options[optionIndex]) {
      post.pollData.options[optionIndex].votes += 1;
      post.pollData.totalVotes += 1;

      // Recalculate percentages for all options
      post.pollData.options.forEach(option => {
        option.percentage = Math.round((option.votes / post.pollData!.totalVotes) * 100);
      });

      this.posts.set(postId, post);
      return await this.getPost(postId);
    }

    return null;
  }
}

export const storage = new MemStorage();
