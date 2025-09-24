import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPostSchema, insertSavedPostSchema, insertArticleSchema, insertCommentSchema, insertProfileSchema, CATEGORIES, PLATFORMS } from "@shared/schema";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { validateSession } from "./middleware/auth";
import Stripe from "stripe";
import { supabase } from "./supabaseClient";

// Initialize Stripe with restricted key
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all posts with optional filtering
  app.get("/api/posts", async (req, res) => {
    try {
      const { category, platforms, authorId } = req.query;
      
      const filters: any = {};
      if (category && category !== 'All') {
        filters.category = category as string;
      }
      if (platforms) {
        const platformArray = Array.isArray(platforms) ? platforms : [platforms];
        filters.platforms = platformArray as string[];
      }
      if (authorId) {
        filters.authorId = authorId as string;
      }
      
      const posts = await storage.getPosts(filters);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  // Get a single post
  app.get("/api/posts/:id", async (req, res) => {
    try {
      const post = await storage.getPost(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  // Create a new post
  app.post("/api/posts", validateSession, async (req, res) => {
    try {
      const validatedData = insertPostSchema.parse(req.body);
      // Use authenticated user ID from session
      const authorId = req.user!.id;
      
      const post = await storage.createPost({ ...validatedData, authorId });
      const postWithAuthor = await storage.getPost(post.id);
      
      res.status(201).json(postWithAuthor);
    } catch (error) {
      res.status(400).json({ message: "Invalid post data", error: error });
    }
  });

  // Get saved posts for a user
  app.get("/api/users/:userId/saved-posts", async (req, res) => {
    try {
      const { userId } = req.params;
      const savedPosts = await storage.getSavedPosts(userId);
      res.json(savedPosts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch saved posts" });
    }
  });

  // Save a post
  app.post("/api/users/:userId/saved-posts", async (req, res) => {
    try {
      const { userId } = req.params;
      const { postId } = req.body;
      
      const savedPost = await storage.savePost(userId, postId);
      res.status(201).json(savedPost);
    } catch (error) {
      res.status(400).json({ message: "Failed to save post" });
    }
  });

  // Unsave a post
  app.delete("/api/users/:userId/saved-posts/:postId", async (req, res) => {
    try {
      const { userId, postId } = req.params;
      
      const success = await storage.unsavePost(userId, postId);
      if (success) {
        res.status(200).json({ message: "Post unsaved successfully" });
      } else {
        res.status(404).json({ message: "Saved post not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to unsave post" });
    }
  });

  // Check if post is saved
  app.get("/api/users/:userId/saved-posts/:postId/check", async (req, res) => {
    try {
      const { userId, postId } = req.params;
      const isSaved = await storage.isPostSaved(userId, postId);
      res.json({ isSaved });
    } catch (error) {
      res.status(500).json({ message: "Failed to check saved status" });
    }
  });

  // Like a post
  app.post("/api/posts/:postId/like", async (req, res) => {
    try {
      await storage.likePost(req.params.postId);
      res.status(200).json({ message: "Post liked successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to like post" });
    }
  });

  // Add comment to post
  app.post("/api/posts/:postId/comment", async (req, res) => {
    try {
      await storage.addComment(req.params.postId);
      res.status(200).json({ message: "Comment added successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to add comment" });
    }
  });

  // Share a post
  app.post("/api/posts/:postId/share", async (req, res) => {
    try {
      await storage.sharePost(req.params.postId);
      res.status(200).json({ message: "Post shared successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to share post" });
    }
  });

  // Get categories
  app.get("/api/categories", (req, res) => {
    res.json(CATEGORIES);
  });

  // Get platforms
  app.get("/api/platforms", (req, res) => {
    res.json(PLATFORMS);
  });

  // Vote on a poll
  app.post("/api/posts/:postId/vote", async (req, res) => {
    try {
      const { postId } = req.params;
      const { optionIndex } = req.body;
      
      if (typeof optionIndex !== 'number' || optionIndex < 0) {
        return res.status(400).json({ message: "Invalid option index" });
      }
      
      const updatedPost = await storage.voteOnPoll(postId, optionIndex);
      
      if (!updatedPost) {
        return res.status(404).json({ message: "Poll not found or invalid" });
      }
      
      res.json(updatedPost);
    } catch (error) {
      res.status(500).json({ message: "Failed to vote on poll" });
    }
  });

  // Article routes
  
  // Get article by slug
  app.get("/api/articles/:slug", async (req, res) => {
    try {
      const article = await storage.getArticleBySlug(req.params.slug);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  // Get comments for an article
  app.get("/api/articles/:articleId/comments", async (req, res) => {
    try {
      const comments = await storage.getComments(req.params.articleId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  // Get comments for a post
  app.get("/api/posts/:postId/comments", async (req, res) => {
    try {
      const comments = await storage.getPostComments(req.params.postId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch post comments" });
    }
  });

  // Create a comment on an article
  app.post("/api/articles/:articleId/comments", validateSession, async (req, res) => {
    try {
      const { articleId } = req.params;
      const { content, parentId } = req.body;
      // Use authenticated user ID from session
      const authorId = req.user!.id;
      
      const commentData = {
        articleId,
        authorId,
        content,
        parentId: parentId || null,
      };
      
      const comment = await storage.createComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      res.status(400).json({ message: "Failed to create comment", error });
    }
  });

  // Create a comment on a post
  app.post("/api/posts/:postId/comments", validateSession, async (req, res) => {
    try {
      const { postId } = req.params;
      const { content, parentId } = req.body;
      // Use authenticated user ID from session
      const authorId = req.user!.id;
      
      const commentData = {
        postId,
        authorId,
        content,
        parentId: parentId || null,
      };
      
      const comment = await storage.createComment(commentData);
      
      // Increment comment count on the post
      await storage.addComment(postId);
      
      res.status(201).json(comment);
    } catch (error) {
      console.error("Error creating post comment:", error);
      res.status(400).json({ message: "Failed to create post comment", error });
    }
  });

  // Like a comment
  app.post("/api/comments/:commentId/like", async (req, res) => {
    try {
      await storage.likeComment(req.params.commentId);
      res.status(200).json({ message: "Comment liked successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to like comment" });
    }
  });

  // Object storage routes
  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(
        req.path,
      );
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  app.post("/api/objects/upload", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    res.json({ uploadURL });
  });

  app.put("/api/comment-images", async (req, res) => {
    if (!req.body.imageURL) {
      return res.status(400).json({ error: "imageURL is required" });
    }

    try {
      const objectStorageService = new ObjectStorageService();
      const objectPath = objectStorageService.normalizeObjectEntityPath(
        req.body.imageURL,
      );

      res.status(200).json({
        objectPath: objectPath,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // PULSE API ROUTES - Poll interactions
  app.post("/api/pulse/polls/:pollId/like", async (req, res) => {
    try {
      const { pollId } = req.params;
      const userId = req.body.userId || 'user1'; // Default user for demo
      
      // In a real app, this would update database
      console.log(`User ${userId} liked poll ${pollId}`);
      
      res.json({ 
        success: true, 
        message: 'Poll liked successfully',
        pollId,
        userId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to like poll", error: error });
    }
  });

  app.post("/api/pulse/polls/:pollId/save", async (req, res) => {
    try {
      const { pollId } = req.params;
      const userId = req.body.userId || 'user1';
      
      console.log(`User ${userId} saved poll ${pollId}`);
      
      res.json({ 
        success: true, 
        message: 'Poll saved to your collection',
        pollId,
        userId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to save poll", error: error });
    }
  });

  app.post("/api/pulse/polls/:pollId/share", async (req, res) => {
    try {
      const { pollId } = req.params;
      const userId = req.body.userId || 'user1';
      const { shareMethod } = req.body; // 'copy', 'email', 'social'
      
      console.log(`User ${userId} shared poll ${pollId} via ${shareMethod}`);
      
      const shareUrl = `${req.protocol}://${req.get('host')}/pulse?poll=${pollId}`;
      
      res.json({ 
        success: true, 
        message: 'Poll shared successfully',
        shareUrl,
        pollId,
        userId,
        shareMethod,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to share poll", error: error });
    }
  });

  // PULSE API ROUTES - Published reports
  app.get("/api/pulse/reports", async (req, res) => {
    try {
      // In a real app, this would query the database
      const mockReports = [
        {
          id: 'report_q4_trends',
          title: 'Q4 2024 Platform Usage Trends',
          summary: 'Analysis of user engagement patterns across major virtual world platforms. Based on 15,000+ creator responses.',
          releasedAt: new Date().toISOString(),
          priceType: 'free',
          badges: ['Platform Data', 'Usage Analytics'],
          downloadUrl: '/api/pulse/reports/report_q4_trends/download'
        },
        {
          id: 'report_2025_forecast',
          title: '2025 Immersive Economy Forecast',
          summary: 'Comprehensive market analysis with revenue projections, emerging platform insights, and strategic recommendations for creators.',
          releasedAt: new Date().toISOString(),
          priceType: 'paid',
          priceCents: 2900,
          badges: ['Market Analysis', 'Forecasting']
        },
        {
          id: 'report_enterprise_insights',
          title: 'Enterprise Adoption Patterns',
          summary: 'Confidential analysis of how Fortune 500 companies are integrating virtual world technologies into their operations.',
          releasedAt: new Date().toISOString(),
          priceType: 'private',
          badges: ['Enterprise', 'Confidential']
        }
      ];
      
      res.json(mockReports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reports", error: error });
    }
  });

  app.post("/api/pulse/reports/:reportId/download", async (req, res) => {
    try {
      const { reportId } = req.params;
      const userId = req.body.userId || 'user1';
      
      console.log(`User ${userId} downloading report ${reportId}`);
      
      // In a real app, this would:
      // 1. Check user permissions
      // 2. Log the download
      // 3. Generate/serve the actual file
      
      res.json({
        success: true,
        message: 'Download initiated',
        downloadUrl: `/objects/reports/${reportId}.pdf`,
        reportId,
        userId,
        timestamp: new Date().toISOString(),
        fileSize: '2.4 MB',
        format: 'PDF'
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to initiate download", error: error });
    }
  });

  // Create Stripe payment intent for report purchase
  app.post("/api/pulse/reports/:reportId/purchase", async (req, res) => {
    try {
      const { reportId } = req.params;
      
      // Get authenticated user from session
      const authHeader = req.headers.authorization;
      const token = authHeader?.replace('Bearer ', '');
      let userId = null;
      
      if (token) {
        try {
          const { data: { user } } = await supabase.auth.getUser(token);
          userId = user?.id || null;
        } catch (authError) {
          console.warn('Auth verification failed:', authError);
        }
      }
      
      // For now, use fallback user ID if no auth (in real app, require auth)
      if (!userId) {
        userId = 'user1'; // Fallback for demo purposes
      }
      
      // Fetch report from database to get server-side price
      const { data: report, error: reportError } = await supabase
        .from('pulse_reports')
        .select('id, title, price_cents, access_level')
        .eq('id', reportId)
        .single();
      
      if (reportError || !report) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      if (report.access_level !== 'paid' || !report.price_cents) {
        return res.status(400).json({ message: "Report is not available for purchase" });
      }
      
      // Use server-side price, not client-provided amount
      const amount = report.price_cents;
      
      // Create payment intent with metadata including user ID
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount),
        currency: "usd",
        metadata: {
          reportId,
          userId,
          type: 'pulse_report_purchase'
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });
      
      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ 
        message: "Error creating payment intent: " + error.message 
      });
    }
  });

  // Stripe webhook to handle successful payments
  app.post("/api/stripe/webhook", async (req, res) => {
    try {
      const sig = req.headers['stripe-signature'];
      let event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
      } catch (err: any) {
        console.log(`Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Only process pulse report purchases
        if (paymentIntent.metadata.type === 'pulse_report_purchase') {
          const { reportId } = paymentIntent.metadata;
          
          // Insert purchase record into Supabase
          const { data, error } = await supabase
            .from('pulse_report_purchases')
            .insert({
              report_id: reportId,
              user_id: paymentIntent.metadata.userId || null, // Will be set from frontend
              stripe_session_id: null, // We're using payment intents, not sessions
              stripe_payment_intent: paymentIntent.id,
              amount_cents: paymentIntent.amount,
              currency: paymentIntent.currency,
              status: 'completed'
            });

          if (error) {
            console.error('Error inserting purchase record:', error);
          } else {
            console.log('Purchase recorded successfully:', data);
          }
        }
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error('Webhook error:', error);
      res.status(500).json({ message: "Webhook processing failed" });
    }
  });

  // Check if user has purchased a report
  app.get("/api/pulse/reports/:reportId/purchase-status", async (req, res) => {
    try {
      const { reportId } = req.params;
      
      // Get authenticated user from session
      const authHeader = req.headers.authorization;
      const token = authHeader?.replace('Bearer ', '');
      let userId = null;
      
      if (token) {
        try {
          const { data: { user } } = await supabase.auth.getUser(token);
          userId = user?.id || null;
        } catch (authError) {
          console.warn('Auth verification failed:', authError);
        }
      }
      
      // For now, use fallback user ID if no auth (in real app, require auth)
      if (!userId) {
        userId = 'user1'; // Fallback for demo purposes
      }
      
      const { data, error } = await supabase
        .from('pulse_report_purchases')
        .select('*')
        .eq('report_id', reportId)
        .eq('user_id', userId)
        .eq('status', 'completed')
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking purchase status:', error);
        return res.status(500).json({ message: "Error checking purchase status" });
      }
      
      res.json({ 
        hasPurchased: !!data,
        purchase: data || null
      });
    } catch (error: any) {
      console.error('Error checking purchase status:', error);
      res.status(500).json({ message: "Failed to check purchase status" });
    }
  });

  app.post("/api/pulse/reports/:reportId/request-access", async (req, res) => {
    try {
      const { reportId } = req.params;
      const userId = req.body.userId || 'user1';
      const { organization, reason } = req.body;
      
      console.log(`User ${userId} requesting access to report ${reportId} from ${organization}`);
      
      // In a real app, this would:
      // 1. Save access request to database
      // 2. Send notification to admin team
      // 3. Send confirmation email to requester
      
      res.json({
        success: true,
        message: 'Access request submitted successfully. Our team will review and contact you within 2-3 business days.',
        requestId: `req_${reportId}_${Date.now()}`,
        reportId,
        userId,
        organization,
        reason,
        status: 'pending',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to submit access request", error: error });
    }
  });

  // Profile upsert endpoint for Supabase Auth integration
  app.post("/api/profile-upsert", async (req, res) => {
    try {
      // TODO: Task 8 - Add proper Supabase session validation here
      // Currently trusting client-provided id - this is a security risk that needs to be fixed
      const { id, display_name, avatar_url } = req.body;
      
      // Validate using Zod schema
      const profileData = insertProfileSchema.parse({
        id,
        displayName: display_name,
        avatarUrl: avatar_url || null,
      });
      
      const profile = await storage.upsertProfile(profileData);
      res.json({ success: true, profile });
    } catch (error) {
      console.error("Profile upsert error:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid profile data", error: (error as any).errors });
      }
      res.status(500).json({ message: "Failed to upsert profile", error: error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
