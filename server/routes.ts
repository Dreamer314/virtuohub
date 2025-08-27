import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPostSchema, insertSavedPostSchema, CATEGORIES, PLATFORMS } from "@shared/schema";

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
  app.post("/api/posts", async (req, res) => {
    try {
      const validatedData = insertPostSchema.parse(req.body);
      const authorId = req.body.authorId || 'user1'; // Default to user1 for demo
      
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

  const httpServer = createServer(app);
  return httpServer;
}
