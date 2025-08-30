import { type User, type InsertUser, type Post, type InsertPost, type SavedPost, type InsertSavedPost, type PostWithAuthor, type Category, type Platform, type Article, type InsertArticle, type ArticleWithPost, type Comment, type InsertComment, type CommentWithAuthor } from "@shared/schema";
import { randomUUID } from "crypto";
import { IStorage } from "./storage-interface";
import { getSampleUsers, getSamplePosts, getSampleArticles, getSampleComments } from "./storage-seed-data";

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private posts: Map<string, Post>;
  private savedPosts: Map<string, SavedPost>;
  private articles: Map<string, Article>;
  private comments: Map<string, Comment>;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.savedPosts = new Map();
    this.articles = new Map();
    this.comments = new Map();
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
        avatar: '/images/3d-artist.png',
        bio: '3D Artist specializing in VRChat avatars',
        role: '3D Artist',
        createdAt: new Date(),
      },
      {
        id: 'user2', 
        username: 'mike_rodriguez',
        password: 'password',
        displayName: 'Mike Rodriguez',
        avatar: '/images/game-dev.png',
        bio: 'Game Developer building worlds in Roblox',
        role: 'Game Developer',
        createdAt: new Date(),
      },
      {
        id: 'user3',
        username: 'emma_thompson',
        password: 'password',
        displayName: 'Emma Thompson',
        avatar: '/images/vr-creator.png',
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
        images: [],
        files: [],
        links: [],
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
        imageUrl: '/images/roblox-dev.png',
        images: [],
        files: [],
        links: [],
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
        images: [],
        files: [],
        links: [],
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
        title: 'Breaking Creative Blocks with AI Tools',
        content: 'Alex Chen shares how he uses generative AI to speed up concept art workflows — without losing the human touch. Practical tips for creators balancing efficiency with originality.',
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop',
        images: [],
        files: [],
        links: [],
        category: 'General',
        platforms: ['VRChat', 'Roblox'],
        price: '',
        type: 'insight',
        pollData: null,
        likes: 156,
        comments: 42,
        shares: 28,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      },
      {
        id: 'post5',
        authorId: 'user2',
        title: 'From Sims Modding to Virtual World Design',
        content: 'How community modders are transforming hobbies into careers — and what game studios can learn from them.',
        imageUrl: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=1200&h=600&fit=crop',
        category: 'General',
        platforms: ['The Sims', 'Roblox'],
        price: '',
        type: 'insight',
        pollData: null,
        likes: 203,
        comments: 67,
        shares: 45,
        createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
      },
      {
        id: 'post6',
        authorId: 'user1',
        title: 'The Future of Virtual Fashion',
        content: 'Digital clothing is no longer just for avatars. Creator Maria Lopez explains how her designs are crossing into AR, social media, and even real-world production.',
        imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76c7e6c1?w=1200&h=600&fit=crop',
        category: 'General',
        platforms: ['VRChat', 'IMVU'],
        price: '',
        type: 'insight',
        pollData: null,
        likes: 178,
        comments: 34,
        shares: 29,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      }
    ];

    samplePosts.forEach(post => {
      this.posts.set(post.id, post);
    });

    // Create sample articles
    const sampleArticles = [
      {
        id: 'article1',
        postId: 'post4',
        slug: 'breaking-creative-blocks-with-ai-tools',
        fullContent: `# Breaking Creative Blocks with AI Tools

As a digital artist working primarily in virtual worlds, I've always prided myself on the human touch in my work. But when creative blocks started hitting harder and deadlines grew tighter, I realized I needed to evolve my approach without compromising my artistic integrity.

## The Challenge of Modern Digital Art

Working in platforms like VRChat and Roblox means constantly pushing boundaries. The demand for fresh, innovative content is relentless. Traditional methods, while effective, sometimes feel too slow in today's fast-paced virtual economy.

## My AI-Assisted Workflow

Here's how I've integrated AI tools into my creative process:

### 1. Concept Generation
I use AI to generate initial concepts and mood boards. Instead of staring at a blank canvas, I can quickly iterate through dozens of ideas.

### 2. Base Modeling Assistance
AI helps me create basic geometric forms and structures that I then sculpt and refine by hand. This saves hours on initial blocking.

### 3. Texture Inspiration
While I still hand-paint most textures, AI generates interesting patterns and color combinations I might not have considered.

## Maintaining the Human Touch

The key is using AI as a tool, not a replacement:

- **Always iterate manually**: Every AI-generated element gets significant human refinement
- **Trust your artistic instincts**: If something feels off, change it
- **Learn from the process**: Each AI suggestion teaches you something new about composition or color

## Practical Tips for Creators

1. **Start small**: Begin with simple tasks like color palette generation
2. **Set boundaries**: Decide which parts of your process should remain purely human
3. **Document your workflow**: Keep track of what works and what doesn't
4. **Share knowledge**: The community benefits when we're open about our processes

## The Future of AI in Creative Work

We're just scratching the surface. The tools will get better, but our role as creative directors and artistic visionaries becomes more important, not less.

The goal isn't to replace human creativity—it's to amplify it.`,
        excerpt: 'Alex Chen shares how he uses generative AI to speed up concept art workflows — without losing the human touch. Practical tips for creators balancing efficiency with originality.',
        readTime: 8,
        publishDate: new Date(Date.now() - 12 * 60 * 60 * 1000),
        seoTitle: 'Breaking Creative Blocks with AI Tools | Creator Insights',
        seoDescription: 'Learn how digital artist Alex Chen uses AI to enhance his creative workflow while maintaining artistic integrity. Practical tips for virtual world creators.',
        tags: ['AI', 'Digital Art', 'Workflow', 'VRChat', 'Creative Process'],
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      },
      {
        id: 'article2',
        postId: 'post5',
        slug: 'from-sims-modding-to-virtual-world-design',
        fullContent: `# From Sims Modding to Virtual World Design

The path from bedroom modder to professional game developer isn't always straightforward, but for many in our community, it's becoming increasingly common. Today, we explore how hobbyist creators are transforming their passion projects into sustainable careers.

## The Modding Renaissance

Modding has always been the training ground for future developers. But something has changed in recent years—the barrier between "hobbyist" and "professional" has never been lower.

### Why Modding Matters More Than Ever

- **Real-world experience**: Modders work with actual game engines and player feedback
- **Portfolio development**: Every mod is a potential portfolio piece
- **Community building**: Successful modders already have audiences
- **Technical skills**: Modern modding requires genuine programming and design skills

## Case Studies: From Mod to Career

### Sarah's Journey: Sims 4 to Indie Developer

Sarah started creating custom content for The Sims 4 in 2019. Her furniture packs gained a following of over 50,000 creators. Last year, she launched her own indie studio focusing on cozy simulation games.

"The skills transfer directly," Sarah explains. "3D modeling, texture work, understanding player psychology—it's all there in modding."

### Marcus: Roblox Scripts to AAA Studios

Marcus began scripting experiences in Roblox at age 14. His zombie survival game reached over 1 million plays. Today, at 22, he's a gameplay programmer at a major studio.

## What Game Studios Are Learning

Forward-thinking studios are paying attention to modding communities:

1. **Talent scouting**: Many studios now actively recruit from modding communities
2. **Innovation insights**: Mods often predict future gaming trends
3. **Community engagement**: Understanding what players want to create
4. **Rapid prototyping**: Mod tools teach efficient development practices

## Making the Transition

### For Modders Ready to Go Pro:

- **Document everything**: Keep detailed records of your work
- **Learn industry tools**: Transition from mod tools to professional software
- **Network actively**: Attend game jams, join developer communities
- **Study the business**: Understand project management and team dynamics

### For Studios Looking to Tap This Talent:

- **Recognize transferable skills**: Modding experience is real development experience
- **Offer mentorship**: Help bridge the gap between hobbyist and professional workflows
- **Support mod communities**: Sponsor events, provide resources
- **Create intern programs**: Structured pathways for promising modders

## The Future of Creator-to-Professional Pipelines

We're seeing the emergence of new career paths that didn't exist five years ago. The line between user-generated content and professional game development continues to blur.

This isn't just about individual success stories—it's about the evolution of how we think about creative careers in digital spaces.

The message is clear: if you're creating, you're already on a professional path. The question isn't whether you're "good enough"—it's whether you're ready to take the next step.`,
        excerpt: 'How community modders are transforming hobbies into careers — and what game studios can learn from them.',
        readTime: 12,
        publishDate: new Date(Date.now() - 18 * 60 * 60 * 1000),
        seoTitle: 'From Sims Modding to Virtual World Design | Career Transition Guide',
        seoDescription: 'Discover how hobbyist modders are building successful careers in game development and what studios can learn from creator communities.',
        tags: ['Career', 'Modding', 'Game Development', 'The Sims', 'Roblox'],
        createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
      },
      {
        id: 'article3',
        postId: 'post6',
        slug: 'the-future-of-virtual-fashion',
        fullContent: `# The Future of Virtual Fashion

Digital clothing was once confined to avatar dress-up games. Today, it's a multi-billion dollar industry crossing into augmented reality, social media, and even physical production. Maria Lopez, one of the pioneers in virtual fashion, shares her insights on where the industry is heading.

## Beyond Avatar Dress-Up

"When I started designing for virtual worlds, people thought it was just playing dress-up," Maria recalls. "Now fashion weeks feature digital-only collections, and luxury brands are hiring virtual fashion designers."

The transformation has been remarkable:

### Current Market Reality

- **NFT fashion**: Digital wearables selling for thousands of dollars
- **AR try-ons**: Virtual clothing for social media and video calls
- **Gaming integration**: Fashion brands collaborating with games like Fortnite and Roblox
- **Physical crossover**: Virtual designs being produced as real garments

## The Technology Behind the Revolution

### 3D Design Evolution

Modern virtual fashion requires sophisticated technical skills:

- **Physics simulation**: Realistic fabric behavior in virtual environments
- **Cross-platform compatibility**: Designs that work across different virtual worlds
- **AR optimization**: Lightweight models for mobile AR applications
- **Material accuracy**: Digital fabrics that represent real-world textiles

### New Tools, New Possibilities

"The tools available today would have seemed like magic five years ago," Maria notes. "We can simulate how a fabric drapes, how it moves in wind, even how it ages over time."

## Breaking Down Barriers

### Accessibility Revolution

Virtual fashion is democratizing design:

- **No material costs**: Experiment freely without fabric expenses
- **Global reach**: Sell designs worldwide instantly
- **Size inclusivity**: Every design can fit every body type
- **Sustainability**: Zero waste in the design process

### The Creator Economy

Independent designers are building substantial businesses:

1. **Direct sales**: Selling designs directly to consumers
2. **Brand partnerships**: Collaborating with established fashion houses
3. **Custom work**: Bespoke designs for influencers and celebrities
4. **Educational content**: Teaching virtual fashion design skills

## Real-World Impact

### Fashion Week Goes Digital

Major fashion weeks now feature digital-only shows. Designers are creating impossible garments—clothes that defy physics, change color dynamically, or exist only in augmented reality.

### Sustainability Focus

"Virtual fashion addresses one of the industry's biggest problems," Maria explains. "Fast fashion creates enormous waste. Virtual fashion creates zero waste."

### Cultural Significance

Digital clothing is becoming a form of self-expression as valid as physical fashion:

- **Identity exploration**: Try different styles without commitment
- **Cultural preservation**: Traditional designs preserved in digital form
- **Artistic expression**: Pushing boundaries impossible in physical fashion

## The Business Model Evolution

### New Revenue Streams

Virtual fashion creators are pioneering novel business models:

- **Subscription services**: Monthly digital wardrobe updates
- **Licensing deals**: Virtual versions of physical designs
- **Educational platforms**: Teaching virtual fashion design
- **Consultation services**: Helping brands enter virtual spaces

### Platform Partnerships

Successful virtual fashion businesses often depend on platform relationships:

- **VRChat**: Custom avatar accessories and clothing
- **IMVU**: Virtual goods marketplace
- **Roblox**: UGC catalog participation
- **Instagram/Snapchat**: AR filter development

## Looking Ahead

### Emerging Trends

- **AI-assisted design**: Machine learning helping with pattern generation
- **Haptic feedback**: Feeling virtual textures through advanced controllers
- **Cross-reality fashion**: Designs that exist simultaneously in multiple realities
- **Blockchain authentication**: Verified ownership of digital designs

### Challenges to Address

The industry still faces hurdles:

- **Platform fragmentation**: Designs often don't work across different platforms
- **Technical barriers**: High skill requirements for quality work
- **Market education**: Helping consumers understand virtual goods value
- **Intellectual property**: Protecting digital designs from copying

## Advice for Aspiring Virtual Fashion Designers

Maria's recommendations for newcomers:

1. **Start with what you know**: Use existing design skills as a foundation
2. **Learn the technical side**: Understanding 3D modeling is essential
3. **Study the platforms**: Each virtual world has its own requirements
4. **Build a community**: Success in virtual fashion is largely about relationships
5. **Experiment boldly**: Virtual fashion allows for impossible designs—use that freedom

## The Broader Implications

Virtual fashion represents more than just a new market—it's a fundamental shift in how we think about clothing, identity, and self-expression in an increasingly digital world.

"We're not just designing clothes," Maria concludes. "We're designing the future of human expression."

As the lines between physical and digital continue to blur, virtual fashion stands at the forefront of a cultural revolution that extends far beyond pixels and polygons.`,
        excerpt: 'Digital clothing is no longer just for avatars. Creator Maria Lopez explains how her designs are crossing into AR, social media, and even real-world production.',
        readTime: 15,
        publishDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
        seoTitle: 'The Future of Virtual Fashion | Digital Clothing Revolution',
        seoDescription: 'Explore how virtual fashion is transforming from avatar dress-up to a multi-billion dollar industry spanning AR, social media, and physical production.',
        tags: ['Virtual Fashion', 'Digital Clothing', 'AR', 'VRChat', 'IMVU', 'Fashion Technology'],
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      }
    ];

    sampleArticles.forEach(article => {
      this.articles.set(article.id, article);
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
      images: postData.images || [],
      files: postData.files || [],
      links: postData.links || [],
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

  // Article methods
  async createArticle(articleData: InsertArticle): Promise<Article> {
    const id = randomUUID();
    const article: Article = {
      ...articleData,
      id,
      publishDate: new Date(),
      createdAt: new Date(),
    };
    this.articles.set(id, article);
    return article;
  }

  async getArticle(id: string): Promise<ArticleWithPost | undefined> {
    const article = this.articles.get(id);
    if (!article) return undefined;
    
    const post = await this.getPost(article.postId);
    if (!post) return undefined;
    
    return {
      ...article,
      post,
    };
  }

  async getArticleBySlug(slug: string): Promise<ArticleWithPost | undefined> {
    const article = Array.from(this.articles.values()).find(a => a.slug === slug);
    if (!article) return undefined;
    
    const post = await this.getPost(article.postId);
    if (!post) return undefined;
    
    return {
      ...article,
      post,
    };
  }

  async updateArticle(id: string, updates: Partial<Article>): Promise<Article | undefined> {
    const existingArticle = this.articles.get(id);
    if (!existingArticle) return undefined;
    
    const updatedArticle = { ...existingArticle, ...updates };
    this.articles.set(id, updatedArticle);
    return updatedArticle;
  }

  // Comment methods
  async createComment(commentData: InsertComment): Promise<Comment> {
    const id = randomUUID();
    const comment: Comment = {
      ...commentData,
      id,
      likes: 0,
      createdAt: new Date(),
    };
    this.comments.set(id, comment);
    return comment;
  }

  async getComments(articleId: string): Promise<CommentWithAuthor[]> {
    const comments = Array.from(this.comments.values())
      .filter(comment => comment.articleId === articleId && !comment.parentId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    
    const commentsWithAuthor = await Promise.all(
      comments.map(async (comment) => {
        const author = await this.getUser(comment.authorId);
        if (!author) return null;
        
        // Get replies
        const replies = Array.from(this.comments.values())
          .filter(reply => reply.parentId === comment.id)
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        
        const repliesWithAuthor = await Promise.all(
          replies.map(async (reply) => {
            const replyAuthor = await this.getUser(reply.authorId);
            if (!replyAuthor) return null;
            return {
              ...reply,
              author: replyAuthor,
            };
          })
        );
        
        return {
          ...comment,
          author,
          replies: repliesWithAuthor.filter(Boolean) as CommentWithAuthor[],
        };
      })
    );
    
    return commentsWithAuthor.filter(Boolean) as CommentWithAuthor[];
  }

  async likeComment(commentId: string): Promise<void> {
    const comment = this.comments.get(commentId);
    if (comment) {
      comment.likes = (comment.likes || 0) + 1;
      this.comments.set(commentId, comment);
    }
  }
}

export const storage = new MemStorage();
