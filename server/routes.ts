import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.config";
import { insertPostSchema, insertSavedPostSchema, insertArticleSchema, insertCommentSchema, insertProfileSchema, CATEGORIES, PLATFORMS } from "@shared/schema";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { validateSession } from "./middleware/auth";
import Stripe from "stripe";
import { supabase, supabaseAdmin } from "./supabaseClient";

// Initialize Stripe with test key
if (!process.env.TESTING_STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: TESTING_STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.TESTING_STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
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
      
      let posts = await storage.getPosts(filters);
      
      // Augment poll posts with vote data
      const userId = (req as any).user?.id;
      posts = await Promise.all(posts.map(async (post) => {
        if (post.subtype === 'poll') {
          const results = await storage.getPostPollResults(post.id);
          const myVote = userId ? await storage.getPostPollVote(post.id, userId) : null;
          return {
            ...post,
            my_vote: myVote,
            results,
          };
        }
        return post;
      }));
      
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  // Get a single post
  app.get("/api/posts/:id", async (req, res) => {
    try {
      let post = await storage.getPost(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      // Augment poll post with vote data
      const userId = (req as any).user?.id;
      if (post.subtype === 'poll') {
        const results = await storage.getPostPollResults(post.id);
        const myVote = userId ? await storage.getPostPollVote(post.id, userId) : null;
        post = {
          ...post,
          my_vote: myVote,
          results,
        } as any;
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  // Create a new post
  app.post("/api/posts", validateSession, async (req, res) => {
    // --- begin normalization shim ---
    const raw = req.body ?? {};
    const title = (raw.title ?? '').trim();

    // accept either `content` or `body`
    const content = (raw.content ?? raw.body ?? '').trim();

    // accept either `platforms` or `platform_tags`
    const platforms = Array.isArray(raw.platforms) ? raw.platforms
                      : Array.isArray(raw.platform_tags) ? raw.platform_tags
                      : [];

    // other optional fields with safe defaults
    const category = (raw.category ?? 'general').trim();
    const links = Array.isArray(raw.links) ? raw.links : [];
    const files = Array.isArray(raw.files) ? raw.files : [];
    const images = Array.isArray(raw.images) ? raw.images : [];
    const imageUrls = Array.isArray(raw.image_urls) ? raw.image_urls : [];
    const price = raw.price ?? null;
    const subtype = (raw.subtype ?? 'thread').trim();
    const subtypeData = raw.subtypeData ?? null;
    const pollOptions = Array.isArray(raw.poll_options) ? raw.poll_options : null;
    // --- end normalization shim ---

    if (!title || !content) {
      return res.status(400).json({ error: 'TITLE_AND_CONTENT_REQUIRED' });
    }

    console.log('createPost payload (server):', {
      subtype,
      imageCount: imageUrls.length
    });

    try {
      const post = await storage.createPost({
        authorId: req.user!.id,
        title,
        body: content,
        tags: [category],
        platforms,
        links,
        files,
        images,
        price,
        subtype,
        subtypeData,
        image_urls: imageUrls,
        poll_options: pollOptions,
      } as any);

      return res.status(201).json(post);
    } catch (e: any) {
      console.error('POST /api/posts failed:', e?.message || e);
      return res.status(500).json({
        error: 'CREATE_POST_FAILED',
        detail: e?.message || String(e)
      });
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

  // Vote on a community post poll (with user tracking)
  app.post("/api/posts/:postId/polls/vote", validateSession, async (req, res) => {
    try {
      const { postId } = req.params;
      const { optionIndex } = req.body;
      const voterId = req.user!.id;
      
      if (typeof optionIndex !== 'number' || optionIndex < 0) {
        return res.status(400).json({ message: "Invalid option index" });
      }
      
      // Verify the post exists and is a poll
      const post = await storage.getPost(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      if (post.subtype !== 'poll') {
        return res.status(400).json({ message: "Post is not a poll" });
      }
      
      // Verify optionIndex is within bounds
      const pollOptions = (post as any).poll_options || (post.subtypeData as any)?.choices || [];
      if (optionIndex >= pollOptions.length) {
        return res.status(400).json({ message: "Option index out of bounds" });
      }
      
      // Save the vote
      const result = await storage.voteOnPostPoll(postId, voterId, optionIndex);
      
      if (!result.ok) {
        return res.status(500).json({ message: "Failed to save vote" });
      }
      
      res.json({ ok: true });
    } catch (error) {
      console.error("Failed to vote on poll:", error);
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

  // PULSE API ROUTES - Published reports (removed - using admin system endpoint below)

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
      
      // Require authentication for purchases
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
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

  // Manual purchase recording endpoint (for development when webhooks don't work)
  app.post("/api/pulse/reports/:reportId/record-purchase", async (req, res) => {
    try {
      const { reportId } = req.params;
      const { paymentIntentId } = req.body;
      
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
      
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      if (!paymentIntentId) {
        return res.status(400).json({ message: "Payment intent ID required" });
      }

      // Verify the payment intent exists and is successful
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({ message: "Payment not successful" });
      }

      // Verify the payment is for this report and user
      if (paymentIntent.metadata.reportId !== reportId || paymentIntent.metadata.userId !== userId) {
        return res.status(400).json({ message: "Payment verification failed" });
      }

      // Use upsert to handle duplicate payment intents gracefully
      const { data, error } = await supabaseAdmin
        .from('pulse_report_purchases')
        .upsert({
          report_id: reportId,
          user_id: userId,
          stripe_payment_intent: paymentIntentId,
          amount_cents: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: 'completed'
        }, {
          onConflict: 'stripe_payment_intent'
        });

      if (error) {
        console.error('Error recording purchase:', error);
        return res.status(500).json({ message: "Error recording purchase" });
      }

      console.log('Purchase recorded successfully via manual endpoint:', data);
      res.json({ success: true, message: "Purchase recorded successfully" });

    } catch (error: any) {
      console.error("Error in record-purchase endpoint:", error);
      res.status(500).json({ 
        message: "Error recording purchase: " + error.message 
      });
    }
  });

  // New access endpoint with Cache-Control: no-store
  app.get("/api/pulse/reports/:reportId/access", async (req, res) => {
    try {
      const { reportId } = req.params;
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ message: "userId parameter required" });
      }

      // Set Cache-Control: no-store
      res.set('Cache-Control', 'no-store');

      // Check if user has purchased the report using admin client to bypass RLS
      const { data, error } = await supabaseAdmin
        .from('pulse_report_purchases')
        .select('*')
        .eq('report_id', reportId)
        .eq('user_id', userId)
        .in('status', ['succeeded', 'completed'])
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking access:', error);
        return res.status(500).json({ message: "Error checking access" });
      }

      const canDownload = !!data;
      res.json({ canDownload });

    } catch (error) {
      console.error('Error in access endpoint:', error);
      res.status(500).json({ message: "Internal server error" });
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
      
      // Require authentication for purchases
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
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

  // Sign upload URLs for post images
  app.post("/api/storage/sign-uploads", validateSession, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { files } = req.body;
      
      // Validate request
      if (!Array.isArray(files)) {
        return res.status(400).json({ message: "Invalid request: files array required" });
      }
      
      if (files.length > 5) {
        return res.status(400).json({ message: "Maximum 5 files allowed" });
      }
      
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      // Validate each file
      for (const file of files) {
        if (!allowedTypes.includes(file.type)) {
          return res.status(400).json({ 
            message: `Invalid file type: ${file.type}. Allowed: jpeg, png, webp, gif` 
          });
        }
        if (file.size && file.size > maxSize) {
          return res.status(400).json({ 
            message: `File too large: ${file.name}. Max 10MB` 
          });
        }
      }
      
      // Generate signed upload URLs
      const targets = [];
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      
      for (const file of files) {
        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const randomId = Math.random().toString(36).substring(2, 15);
        const path = `posts/${userId}/${dateStr}/${randomId}.${ext}`;
        
        // Create signed upload URL
        const { data: signedData, error: signError } = await supabaseAdmin.storage
          .from('post-images')
          .createSignedUploadUrl(path);
        
        if (signError) {
          throw new Error(`Failed to create signed URL: ${signError.message}`);
        }

        if (!signedData?.token) {
          throw new Error('No upload token returned from storage');
        }
        
        // Get public URL for this path
        const { data: { publicUrl } } = supabaseAdmin.storage
          .from('post-images')
          .getPublicUrl(path);
        
        targets.push({
          path,
          token: signedData.token,
          publicUrl
        });
      }
      
      res.json({ targets });
    } catch (error: any) {
      console.error('Sign uploads error:', error);
      res.status(500).json({ 
        message: "Failed to create signed upload URLs",
        error: error.message 
      });
    }
  });

  // Profile upsert endpoint for Supabase Auth integration
  // CRITICAL: Only creates profile if it doesn't exist. Never overwrites existing data.
  app.post("/api/profile-upsert", async (req, res) => {
    try {
      // TODO: Task 8 - Add proper Supabase session validation here
      // Currently trusting client-provided id - this is a security risk that needs to be fixed
      const { id, display_name, avatar_url } = req.body;
      
      // Check if profile already exists
      const existing = await storage.getProfile(id);
      if (existing) {
        console.log('[POST /api/profile-upsert] Profile already exists, skipping upsert to preserve data');
        return res.json({ success: true, profile: existing });
      }
      
      // Only create new profile if it doesn't exist
      console.log('[POST /api/profile-upsert] Creating new profile for id:', id);
      
      // Validate using Zod schema
      const profileData = insertProfileSchema.parse({
        id,
        displayName: display_name || null,
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

  // Get current user profile (protected)
  app.get("/api/profile", validateSession, async (req, res) => {
    try {
      const profile = await storage.getProfile(req.user!.id);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Profile fetch error:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  // Check handle availability
  app.post("/api/profile/handle/check", async (req, res) => {
    try {
      const { handle } = req.body;
      
      if (!handle || typeof handle !== 'string') {
        return res.status(400).json({ message: "Handle is required" });
      }
      
      // Validate handle format: letters, numbers, underscore, 3-20 chars
      const handleRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!handleRegex.test(handle)) {
        return res.status(400).json({ 
          message: "Handle must be 3-20 characters and contain only letters, numbers, and underscores" 
        });
      }
      
      const available = await storage.isHandleAvailable(handle);
      res.json({ available });
    } catch (error) {
      console.error("Handle check error:", error);
      res.status(500).json({ message: "Failed to check handle availability" });
    }
  });

  // Update current user profile (protected)
  app.patch("/api/profile/update", validateSession, async (req, res) => {
    try {
      const { handle, displayName, avatarUrl, role, onboardingComplete } = req.body;
      
      // Validate handle if provided
      if (handle) {
        const handleRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!handleRegex.test(handle)) {
          return res.status(400).json({ 
            message: "Handle must be 3-20 characters and contain only letters, numbers, and underscores" 
          });
        }
        
        const available = await storage.isHandleAvailable(handle);
        if (!available) {
          return res.status(400).json({ message: "Handle is already taken" });
        }
      }

      // Get current profile to preserve existing data
      const currentProfile = await storage.getProfile(req.user!.id);
      
      const updateData = {
        id: req.user!.id,
        handle: handle ?? currentProfile?.handle,
        // Auto-set displayName to handle if displayName not provided but handle is
        displayName: displayName ?? (handle || currentProfile?.displayName),
        avatarUrl: avatarUrl ?? currentProfile?.avatarUrl,
        role: role ?? currentProfile?.role,
        onboardingComplete: onboardingComplete ?? currentProfile?.onboardingComplete ?? false,
      };

      const profile = await storage.upsertProfile(updateData);
      res.json({ success: true, profile });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Database setup endpoint (run once to create tables)
  app.post("/api/setup-database", async (req, res) => {
    try {
      // Create pulse_reports table
      const { error: reportsError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS pulse_reports (
            id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
            title VARCHAR NOT NULL,
            description TEXT,
            price INTEGER NOT NULL DEFAULT 0,
            file_url VARCHAR,
            file_name VARCHAR,
            published_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          );
        `
      });

      if (reportsError) {
        console.error('Error creating pulse_reports table:', reportsError);
      }

      // Create pulse_report_purchases table
      const { error: purchasesError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS pulse_report_purchases (
            id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
            report_id VARCHAR NOT NULL REFERENCES pulse_reports(id) ON DELETE CASCADE,
            user_id VARCHAR,
            stripe_session_id VARCHAR,
            stripe_payment_intent VARCHAR,
            amount_cents INTEGER NOT NULL,
            currency VARCHAR NOT NULL DEFAULT 'usd',
            status VARCHAR NOT NULL DEFAULT 'completed',
            created_at TIMESTAMP DEFAULT NOW()
          );
        `
      });

      if (purchasesError) {
        console.error('Error creating pulse_report_purchases table:', purchasesError);
      }

      // Insert test data
      const { error: insertError } = await supabase
        .from('pulse_reports')
        .upsert([
          {
            id: '80cf4ec5-ea6c-400a-a5f0-bfa15fdaab06',
            title: 'Q3 VHub Market Analysis',
            description: 'Comprehensive analysis of virtual world creator economy trends',
            price: 2999,
            file_url: '/reports/q3-market-analysis.pdf',
            file_name: 'Q3_VHub_Market_Analysis.pdf'
          },
          {
            id: 'report-2',
            title: 'Virtual Asset Pricing Guide',
            description: 'Complete guide to pricing virtual assets across different platforms',
            price: 1999,
            file_url: '/reports/pricing-guide.pdf',
            file_name: 'Virtual_Asset_Pricing_Guide.pdf'
          }
        ]);

      if (insertError) {
        console.error('Error inserting test data:', insertError);
      }

      res.json({ 
        success: true, 
        message: 'Database setup completed',
        errors: {
          reportsError: reportsError?.message || null,
          purchasesError: purchasesError?.message || null,
          insertError: insertError?.message || null
        }
      });
    } catch (error) {
      console.error('Database setup error:', error);
      res.status(500).json({ message: 'Database setup failed', error: error });
    }
  });

  // List all pulse reports (for the pulse page) - uses admin system data
  app.get("/api/pulse/reports", async (req, res) => {
    try {
      const { data: reports, error } = await supabase
        .from('pulse_reports')
        .select('*')
        .eq('show_on_reports', true)  // Only show reports marked for display
        .in('status', ['published', 'scheduled'])  // Only published/scheduled reports
        .order('release_at', { ascending: false });

      if (error) {
        console.error('Error fetching reports:', error);
        return res.status(500).json({ message: "Error fetching reports" });
      }

      res.json(reports || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get pulse report details
  app.get("/api/pulse/reports/:reportId", async (req, res) => {
    try {
      const { reportId } = req.params;

      const { data: report, error } = await supabase
        .from('pulse_reports')
        .select('*')
        .eq('id', reportId)
        .single();

      if (error || !report) {
        return res.status(404).json({ message: "Report not found" });
      }

      res.json(report);
    } catch (error) {
      console.error('Error fetching report:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Download report file (requires purchase)
  app.get("/api/pulse/reports/:reportId/download", async (req, res) => {
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
      
      // Require authentication for purchases
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Check if user has purchased the report
      const { data: purchases, error: purchaseError } = await supabase
        .from('pulse_report_purchases')
        .select('*')
        .eq('report_id', reportId)
        .eq('user_id', userId)
        .eq('status', 'completed')
        .limit(1);

      if (purchaseError) {
        console.error('Error checking purchase status:', purchaseError);
        return res.status(500).json({ message: "Error verifying purchase" });
      }

      const hasPurchased = purchases && purchases.length > 0;
      if (!hasPurchased) {
        return res.status(403).json({ message: "Purchase required to download this report" });
      }

      // Get report details
      const { data: report, error: reportError } = await supabase
        .from('pulse_reports')
        .select('*')
        .eq('id', reportId)
        .single();

      if (reportError || !report) {
        return res.status(404).json({ message: "Report not found" });
      }

      // For now, return download info (in real app, this would serve the actual file)
      res.json({
        success: true,
        downloadUrl: report.file_url,
        fileName: report.file_name,
        message: `Download access granted for: ${report.title}`
      });

    } catch (error) {
      console.error('Error in download endpoint:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
