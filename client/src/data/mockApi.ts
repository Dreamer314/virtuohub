import type { Post, Poll, FeedItem, PollOption, PlatformKey } from '@/types/content';

// Helper to generate unique IDs
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Current user stub
const CURRENT_USER = {
  id: 'user1',
  name: 'VirtualCreator',
  avatar: undefined
};

// Storage keys
const STORAGE_KEYS = {
  posts: 'vhub.posts',
  polls: 'vhub.polls',
  pollVotes: 'vhub.pollVotes'
};

// Get data from localStorage with fallback
function getStorageData<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

// Save data to localStorage
function setStorageData(key: string, data: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

// Initialize with seed data
function initializeSeedData(): void {
  const existingPosts = getStorageData(STORAGE_KEYS.posts, []);
  const existingPolls = getStorageData(STORAGE_KEYS.polls, []);
  
  if (existingPosts.length === 0) {
    const seedPosts: Post[] = [
      {
        id: 'post1',
        type: 'post',
        title: 'New VRChat Avatar Commission Service',
        body: 'Offering custom avatar creation services for VRChat! Specializing in anime-style characters with full body tracking support. Check out my portfolio and get in touch!',
        links: ['https://portfolio.example.com'],
        images: [],
        files: [],
        price: '$50-150',
        category: 'Assets for Sale',
        platforms: ['vrchat'],
        createdAt: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
        author: CURRENT_USER,
        stats: { likes: 12, saves: 8, comments: 3 }
      },
      {
        id: 'post2', 
        type: 'post',
        title: 'Looking for Unity Developer - Game Project',
        body: 'Seeking an experienced Unity developer for a virtual world project. Must have experience with networking and multiplayer systems. Remote work, competitive pay.',
        links: [],
        images: [],
        files: [],
        category: 'Jobs & Gigs',
        platforms: ['unity'],
        createdAt: Date.now() - 6 * 60 * 60 * 1000, // 6 hours ago
        author: { id: 'user2', name: 'MetaStudio', avatar: undefined },
        stats: { likes: 23, saves: 15, comments: 7 }
      }
    ];
    setStorageData(STORAGE_KEYS.posts, seedPosts);
  }
  
  if (existingPolls.length === 0) {
    const now = Date.now();
    const seedPolls: Poll[] = [
      {
        id: 'poll1',
        type: 'poll', 
        question: 'Which platform do you spend most of your creative time on?',
        options: [
          { id: 'opt1', label: 'VRChat', votes: 45 },
          { id: 'opt2', label: 'Roblox', votes: 32 },
          { id: 'opt3', label: 'Unity', votes: 28 },
          { id: 'opt4', label: 'Unreal Engine', votes: 15 }
        ],
        allowMultiple: false,
        showResults: 'after-vote',
        closesAt: now + 3 * 24 * 60 * 60 * 1000, // 3 days from now
        category: 'General',
        platforms: ['vrchat', 'roblox', 'unity', 'unreal'],
        createdAt: now - 5 * 60 * 60 * 1000, // 5 hours ago
        author: { id: 'vhub', name: 'VHub Data Pulse', avatar: undefined },
        status: 'active'
      },
      {
        id: 'poll2',
        type: 'poll',
        question: 'What\'s your biggest challenge in virtual world creation?',
        options: [
          { id: 'opt5', label: 'Technical limitations', votes: 67 },
          { id: 'opt6', label: 'Finding collaborators', votes: 43 },
          { id: 'opt7', label: 'Monetization', votes: 38 },
          { id: 'opt8', label: 'Time management', votes: 52 }
        ],
        allowMultiple: false,
        showResults: 'after-vote',
        closesAt: now + 5 * 24 * 60 * 60 * 1000, // 5 days from now
        category: 'General',
        createdAt: now - 12 * 60 * 60 * 1000, // 12 hours ago
        author: { id: 'vhub', name: 'VHub Data Pulse', avatar: undefined },
        status: 'active'
      },
      {
        id: 'poll3',
        type: 'poll',
        question: 'Which creation tool do you use most often?',
        options: [
          { id: 'opt9', label: 'Blender', votes: 89 },
          { id: 'opt10', label: 'Maya', votes: 34 },
          { id: 'opt11', label: 'Unity', votes: 76 },
          { id: 'opt12', label: 'Unreal Engine', votes: 45 }
        ],
        allowMultiple: false,
        showResults: 'after-vote',
        closesAt: now - 2 * 24 * 60 * 60 * 1000, // 2 days ago (completed)
        category: 'Technical Help',
        createdAt: now - 7 * 24 * 60 * 60 * 1000, // 7 days ago
        author: { id: 'vhub', name: 'VHub Data Pulse', avatar: undefined },
        status: 'completed'
      }
    ];
    setStorageData(STORAGE_KEYS.polls, seedPolls);
  }
}

// Auto-update poll status based on closesAt time
function updatePollStatuses(): void {
  const polls: Poll[] = getStorageData(STORAGE_KEYS.polls, []);
  const now = Date.now();
  let updated = false;
  
  polls.forEach(poll => {
    const shouldBeCompleted = now >= poll.closesAt;
    if (shouldBeCompleted && poll.status === 'active') {
      poll.status = 'completed';
      updated = true;
    } else if (!shouldBeCompleted && poll.status === 'completed') {
      poll.status = 'active';
      updated = true;
    }
  });
  
  if (updated) {
    setStorageData(STORAGE_KEYS.polls, polls);
  }
}

// Check if user has voted on a poll
function hasVoted(pollId: string): boolean {
  const votes: Record<string, string[]> = getStorageData(STORAGE_KEYS.pollVotes, {});
  const userKey = CURRENT_USER.id;
  const voteKey = `${pollId}_${userKey}`;
  return voteKey in votes;
}

// Get user's vote for a poll
function getUserVote(pollId: string): string[] {
  const votes: Record<string, string[]> = getStorageData(STORAGE_KEYS.pollVotes, {});
  const userKey = CURRENT_USER.id;
  const voteKey = `${pollId}_${userKey}`;
  return votes[voteKey] || [];
}

// Mock API implementation
export const mockApi = {
  // Posts
  listPosts(): Post[] {
    return getStorageData(STORAGE_KEYS.posts, []);
  },
  
  createFeedPost(input: Omit<Post, 'id' | 'createdAt' | 'stats'>): Post {
    const post: Post = {
      ...input,
      id: generateId(),
      createdAt: Date.now(),
      stats: { likes: 0, saves: 0, comments: 0 }
    };
    
    const posts = this.listPosts();
    posts.unshift(post); // Add to beginning
    setStorageData(STORAGE_KEYS.posts, posts);
    return post;
  },
  
  // Polls
  listPolls(): Poll[] {
    updatePollStatuses();
    return getStorageData(STORAGE_KEYS.polls, []);
  },
  
  listActivePolls(): Poll[] {
    return this.listPolls().filter(poll => poll.status === 'active');
  },
  
  listCompletedPolls(): Poll[] {
    return this.listPolls().filter(poll => poll.status === 'completed');
  },
  
  createPoll(input: Omit<Poll, 'id' | 'createdAt' | 'status'>): Poll {
    const poll: Poll = {
      ...input,
      id: generateId(),
      createdAt: Date.now(),
      status: Date.now() < input.closesAt ? 'active' : 'completed'
    };
    
    const polls = this.listPolls();
    polls.unshift(poll); // Add to beginning
    setStorageData(STORAGE_KEYS.polls, polls);
    return poll;
  },
  
  votePoll(pollId: string, optionIds: string[]): Poll {
    if (hasVoted(pollId)) {
      throw new Error('You have already voted on this poll');
    }
    
    const polls = this.listPolls();
    const poll = polls.find(p => p.id === pollId);
    
    if (!poll) {
      throw new Error('Poll not found');
    }
    
    if (poll.status === 'completed') {
      throw new Error('This poll has already closed');
    }
    
    // Update vote counts
    optionIds.forEach(optionId => {
      const option = poll.options.find(opt => opt.id === optionId);
      if (option) {
        option.votes++;
      }
    });
    
    // Record user's vote
    const votes: Record<string, string[]> = getStorageData(STORAGE_KEYS.pollVotes, {});
    const userKey = CURRENT_USER.id;
    const voteKey = `${pollId}_${userKey}`;
    votes[voteKey] = optionIds;
    setStorageData(STORAGE_KEYS.pollVotes, votes);
    
    // Save updated polls
    setStorageData(STORAGE_KEYS.polls, polls);
    return poll;
  },
  
  closePoll(pollId: string): Poll {
    const polls = this.listPolls();
    const poll = polls.find(p => p.id === pollId);
    
    if (!poll) {
      throw new Error('Poll not found');
    }
    
    poll.status = 'completed';
    setStorageData(STORAGE_KEYS.polls, polls);
    return poll;
  },
  
  hasVoted,
  getUserVote,
  
  // Unified feed
  listFeed(): FeedItem[] {
    const posts = this.listPosts();
    const polls = this.listPolls();
    const allItems: FeedItem[] = [...posts, ...polls];
    
    // Sort by creation time, newest first
    return allItems.sort((a, b) => b.createdAt - a.createdAt);
  }
};

// Initialize seed data on load
initializeSeedData();

export default mockApi;