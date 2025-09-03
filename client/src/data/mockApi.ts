interface Comment {
  id: string;
  postId: string;
  parentId?: string;
  body: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  likes: number;
  likedByUser?: boolean;
}

// Helper function for console logging events
export function logEvent(eventName: string, payload: any) {
  console.log(`[VirtuoHub Event] ${eventName}:`, payload);
}

// Mock current user
const currentUser = {
  id: 'user1',
  name: 'Alex Developer',
  avatar: '👤'
};

// Safe localStorage wrapper
function safeGetFromStorage(key: string, defaultValue: any) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.warn(`Failed to parse localStorage key "${key}":`, error);
    return defaultValue;
  }
}

function safeSetToStorage(key: string, value: any) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to store to localStorage key "${key}":`, error);
  }
}

// Initialize seed data if not exists
function initializeSeedData() {
  const existingComments = safeGetFromStorage('vhub.comments', null);
  
  if (!existingComments) {
    const seedComments: Comment[] = [
      // Interview comments
      {
        id: 'comment-1',
        postId: 'alex-chen-vrchat-worlds',
        body: 'This is so insightful! The part about designing emotional experiences first really resonates with me. I\'ve been focusing too much on technical specs.',
        author: { id: 'user2', name: 'WorldBuilder_Sarah', avatar: '🌍' },
        createdAt: '2024-12-31T10:00:00Z',
        likes: 34,
        likedByUser: false
      },
      {
        id: 'comment-2',
        postId: 'alex-chen-vrchat-worlds',
        body: 'Alex\'s Neon District world is one of my favorites. The way people naturally gather around the fountain area is brilliant design.',
        author: { id: 'user3', name: 'VR_Mike_Dev', avatar: '🎮' },
        createdAt: '2024-12-31T08:00:00Z',
        likes: 28,
        likedByUser: false
      },
      {
        id: 'reply-1',
        postId: 'alex-chen-vrchat-worlds',
        parentId: 'comment-1',
        body: 'I had the same realization after reading this! Now I start every project by asking "how do I want people to feel here?"',
        author: { id: 'user4', name: 'EmotionalDesigner', avatar: '❤️' },
        createdAt: '2024-12-31T11:00:00Z',
        likes: 12,
        likedByUser: false
      },
      {
        id: 'reply-2',
        postId: 'alex-chen-vrchat-worlds',
        parentId: 'comment-2',
        body: 'The fountain area is genius! I tried to replicate something similar in my world.',
        author: { id: 'user5', name: 'CopyCreator', avatar: '✨' },
        createdAt: '2024-12-31T09:00:00Z',
        likes: 8,
        likedByUser: false
      },
      
      // Performance guide comments
      {
        id: 'comment-3',
        postId: 'guide-performance-optimization',
        body: 'This saved my project! The texture atlasing tip alone improved my performance by 40%.',
        author: { id: 'user6', name: 'OptimizedDev', avatar: '⚡' },
        createdAt: '2024-12-30T15:00:00Z',
        likes: 23,
        likedByUser: false
      },
      {
        id: 'comment-4',
        postId: 'guide-performance-optimization',
        body: 'Great breakdown of platform differences. The VRChat performance ranking info is spot on.',
        author: { id: 'user7', name: 'VRCreator_Max', avatar: '🥽' },
        createdAt: '2024-12-30T12:00:00Z',
        likes: 18,
        likedByUser: false
      },
      
      // Virtual commerce news comments
      {
        id: 'comment-5',
        postId: 'news-virtual-commerce-future',
        body: 'This aligns perfectly with what I\'m seeing in my Roblox store. Cross-platform is definitely the future.',
        author: { id: 'user8', name: 'VirtualBusiness_Pro', avatar: '💼' },
        createdAt: '2024-12-29T16:00:00Z',
        likes: 15,
        likedByUser: false
      },
      {
        id: 'comment-6',
        postId: 'news-virtual-commerce-future',
        body: 'The subscription model prediction is interesting. I\'ve been considering this for my VRChat world series.',
        author: { id: 'user9', name: 'CreatorEconomy_Sarah', avatar: '📊' },
        createdAt: '2024-12-29T13:00:00Z',
        likes: 12,
        likedByUser: false
      }
    ];

    safeSetToStorage('vhub.comments', seedComments);
    safeSetToStorage('vhub.commentLikes', {});
  }
}

// Initialize on load
initializeSeedData();

export function listComments(postId: string): Comment[] {
  const comments = safeGetFromStorage('vhub.comments', []);
  const commentLikes = safeGetFromStorage('vhub.commentLikes', {});
  
  return comments
    .filter((comment: Comment) => comment.postId === postId)
    .map((comment: Comment) => ({
      ...comment,
      likedByUser: commentLikes[comment.id]?.includes(currentUser.id) || false
    }))
    .sort((a: Comment, b: Comment) => {
      // Sort top-level comments by creation date (newest first)
      if (!a.parentId && !b.parentId) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      // Sort replies by creation date (oldest first)
      if (a.parentId && b.parentId) {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      // Top-level comments come before replies
      if (!a.parentId && b.parentId) return -1;
      if (a.parentId && !b.parentId) return 1;
      return 0;
    });
}

let submitDebounceTimer: NodeJS.Timeout | null = null;

export function addComment(postId: string, body: string, parentId?: string): Promise<Comment> {
  return new Promise((resolve, reject) => {
    // Debounce to prevent double submissions
    if (submitDebounceTimer) {
      clearTimeout(submitDebounceTimer);
    }
    
    submitDebounceTimer = setTimeout(() => {
      try {
        // Validate input
        if (!body.trim() || body.length > 1000) {
          reject(new Error('Comment must be between 1 and 1000 characters'));
          return;
        }

        const comments = safeGetFromStorage('vhub.comments', []);
        
        const newComment: Comment = {
          id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          postId,
          parentId,
          body: body.trim(),
          author: currentUser,
          createdAt: new Date().toISOString(),
          likes: 0,
          likedByUser: false
        };

        const updatedComments = [...comments, newComment];
        safeSetToStorage('vhub.comments', updatedComments);

        // Log the event
        logEvent(parentId ? 'Reply' : 'AddComment', {
          postId,
          parentId,
          commentId: newComment.id
        });

        resolve(newComment);
      } catch (error) {
        reject(error);
      }
    }, 500);
  });
}

export function toggleLikeComment(commentId: string): Comment | null {
  try {
    const comments = safeGetFromStorage('vhub.comments', []);
    const commentLikes = safeGetFromStorage('vhub.commentLikes', {});

    const commentIndex = comments.findIndex((c: Comment) => c.id === commentId);
    if (commentIndex === -1) return null;

    const comment = comments[commentIndex];
    const userLikes = commentLikes[commentId] || [];
    const hasLiked = userLikes.includes(currentUser.id);

    if (hasLiked) {
      // Remove like
      commentLikes[commentId] = userLikes.filter((userId: string) => userId !== currentUser.id);
      comment.likes = Math.max(0, comment.likes - 1);
    } else {
      // Add like
      commentLikes[commentId] = [...userLikes, currentUser.id];
      comment.likes += 1;
    }

    comment.likedByUser = !hasLiked;
    comments[commentIndex] = comment;

    safeSetToStorage('vhub.comments', comments);
    safeSetToStorage('vhub.commentLikes', commentLikes);

    // Log the event
    logEvent('LikeComment', {
      commentId,
      liked: !hasLiked,
      newLikeCount: comment.likes
    });

    return comment;
  } catch (error) {
    console.warn('Failed to toggle comment like:', error);
    return null;
  }
}

export type { Comment };