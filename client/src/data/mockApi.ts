import { Post, Poll, FeedItem, PollOption } from '@/types/content';

// Storage keys
const POSTS_KEY = 'vhub.posts';
const POLLS_KEY = 'vhub.polls';
const POLL_VOTES_KEY = 'vhub.pollVotes';

// Current user stub
const currentUser = {
  id: 'user1',
  name: 'Alex Chen',
  avatar: undefined
};

// Generate unique ID
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Initialize with seed data if empty  
function initializeData() {
  // Force reset to load new data with images
  if (!localStorage.getItem(POSTS_KEY) || localStorage.getItem('vhub.version') !== '1.3') {
    localStorage.setItem('vhub.version', '1.3');
    const seedPosts: Post[] = [
      {
        id: 'post1',
        type: 'post',
        title: 'New VRC World - Cyberpunk Coffee Shop',
        body: 'Just finished my latest VRChat world! It\'s a cozy cyberpunk-themed coffee shop perfect for hanging out with friends. Features include interactive furniture, ambient lighting, and a custom soundtrack.',
        links: ['https://vrchat.com/home/world/wrld_example'],
        images: [],
        files: [],
        imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop&crop=center',
        category: 'General',
        platforms: ['vrchat'],
        createdAt: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
        author: currentUser,
        stats: { likes: 12, saves: 8, comments: 3 }
      },
      {
        id: 'post2',
        type: 'post',
        title: 'Commission: Custom Avatar Textures',
        body: 'Offering custom avatar texture work for Second Life and VRChat. Specializing in realistic skin tones, fantasy designs, and clothing textures. Quick turnaround, affordable prices.',
        links: [],
        images: [],
        files: [],
        imageUrl: 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=800&h=600&fit=crop&crop=center',
        price: '$25-75',
        category: 'Jobs & Gigs',
        platforms: ['secondlife', 'vrchat'],
        createdAt: Date.now() - 4 * 60 * 60 * 1000, // 4 hours ago
        author: { id: 'user2', name: 'Maya Rodriguez', displayName: 'Maya Rodriguez' },
        stats: { likes: 25, saves: 18, comments: 7 }
      },
      {
        id: 'post3',
        type: 'post',
        title: 'Free Unity Assets Pack - Medieval Fantasy Collection',
        body: 'Released my complete medieval fantasy asset pack for Unity creators! Includes 50+ prefabs: weapons, armor, buildings, props, and materials. All optimized for VR and mobile. Download link in comments.',
        links: ['https://unity.com/asset-store/example'],
        images: [],
        files: [],
        imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop&crop=center',
        price: 'Free',
        category: 'Assets for Sale',
        platforms: ['unity', 'vrchat'],
        createdAt: Date.now() - 6 * 60 * 60 * 1000, // 6 hours ago
        author: { id: 'user5', name: 'Chris Wilson', displayName: 'Chris Wilson' },
        stats: { likes: 89, saves: 156, comments: 23 }
      }
    ];
    localStorage.setItem(POSTS_KEY, JSON.stringify(seedPosts));
  }

  if (!localStorage.getItem(POLLS_KEY)) {
    const now = Date.now();
    const seedPolls: Poll[] = [
      {
        id: 'poll1',
        type: 'poll',
        question: 'What type of virtual world content do you create most often?',
        options: [
          { id: 'opt1', label: 'Avatar accessories & clothing', votes: 42 },
          { id: 'opt2', label: 'World environments & buildings', votes: 38 },
          { id: 'opt3', label: 'Interactive objects & scripts', votes: 25 },
          { id: 'opt4', label: 'Art galleries & exhibitions', votes: 18 }
        ],
        allowMultiple: false,
        showResults: 'after-vote',
        closesAt: now + 3 * 24 * 60 * 60 * 1000, // 3 days from now
        category: 'General',
        platforms: ['vrchat', 'secondlife', 'roblox'],
        createdAt: now - 1 * 60 * 60 * 1000, // 1 hour ago
        author: { id: 'user3', name: 'Jordan Kim', displayName: 'Jordan Kim' },
        status: 'active'
      },
      {
        id: 'poll2',
        type: 'poll',
        question: 'Which platform offers the best monetization for creators?',
        options: [
          { id: 'opt1', label: 'Roblox (Robux system)', votes: 67 },
          { id: 'opt2', label: 'Second Life (Linden Dollars)', votes: 45 },
          { id: 'opt3', label: 'VRChat (Creator Economy)', votes: 28 },
          { id: 'opt4', label: 'Horizon Worlds (Meta)', votes: 12 }
        ],
        allowMultiple: false,
        showResults: 'after-vote',
        closesAt: now + 5 * 24 * 60 * 60 * 1000, // 5 days from now
        category: 'General',
        platforms: ['roblox', 'secondlife', 'vrchat', 'horizon'],
        createdAt: now - 3 * 60 * 60 * 1000, // 3 hours ago
        author: { id: 'user4', name: 'Sam Rivera', displayName: 'Sam Rivera' },
        status: 'active'
      }
    ];
    localStorage.setItem(POLLS_KEY, JSON.stringify(seedPolls));
  }

  if (!localStorage.getItem(POLL_VOTES_KEY)) {
    localStorage.setItem(POLL_VOTES_KEY, JSON.stringify({}));
  }
}

// Initialize data on module load
initializeData();

// Post API functions
export function listPosts(): Post[] {
  const posts = JSON.parse(localStorage.getItem(POSTS_KEY) || '[]') as Post[];
  return posts.sort((a, b) => b.createdAt - a.createdAt);
}

export function createFeedPost(input: Omit<Post, 'id' | 'createdAt' | 'stats'>): Post {
  const post: Post = {
    ...input,
    id: generateId(),
    createdAt: Date.now(),
    stats: { likes: 0, saves: 0, comments: 0 }
  };
  
  const posts = listPosts();
  posts.unshift(post);
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  
  return post;
}

// Poll API functions
export function listPolls(): Poll[] {
  const polls = JSON.parse(localStorage.getItem(POLLS_KEY) || '[]') as Poll[];
  const now = Date.now();
  
  // Auto-update status based on closesAt
  const updatedPolls = polls.map(poll => ({
    ...poll,
    status: (now < poll.closesAt ? 'active' : 'completed') as 'active' | 'completed'
  }));
  
  localStorage.setItem(POLLS_KEY, JSON.stringify(updatedPolls));
  return updatedPolls.sort((a, b) => b.createdAt - a.createdAt);
}

export function listActivePolls(): Poll[] {
  return listPolls().filter(poll => poll.status === 'active');
}

export function listCompletedPolls(): Poll[] {
  return listPolls().filter(poll => poll.status === 'completed');
}

export function createPoll(input: Omit<Poll, 'id' | 'createdAt' | 'status'>): Poll {
  const poll: Poll = {
    ...input,
    id: generateId(),
    createdAt: Date.now(),
    status: Date.now() < input.closesAt ? 'active' : 'completed'
  };
  
  const polls = listPolls();
  polls.unshift(poll);
  localStorage.setItem(POLLS_KEY, JSON.stringify(polls));
  
  return poll;
}

export function votePoll(pollId: string, optionIds: string[]): Poll {
  const polls = listPolls();
  const pollIndex = polls.findIndex(p => p.id === pollId);
  
  if (pollIndex === -1) {
    throw new Error('Poll not found');
  }
  
  const poll = polls[pollIndex];
  
  if (poll.status === 'completed') {
    throw new Error('Poll is closed');
  }
  
  // Check if user already voted
  const votes = JSON.parse(localStorage.getItem(POLL_VOTES_KEY) || '{}');
  const userVoteKey = `${pollId}_${currentUser.id}`;
  
  if (votes[userVoteKey]) {
    throw new Error('You have already voted on this poll');
  }
  
  // Record the vote
  votes[userVoteKey] = optionIds;
  localStorage.setItem(POLL_VOTES_KEY, JSON.stringify(votes));
  
  // Update vote counts
  optionIds.forEach(optionId => {
    const option = poll.options.find(opt => opt.id === optionId);
    if (option) {
      option.votes += 1;
    }
  });
  
  polls[pollIndex] = poll;
  localStorage.setItem(POLLS_KEY, JSON.stringify(polls));
  
  return poll;
}

export function hasVoted(pollId: string): boolean {
  const votes = JSON.parse(localStorage.getItem(POLL_VOTES_KEY) || '{}');
  const userVoteKey = `${pollId}_${currentUser.id}`;
  return !!votes[userVoteKey];
}

export function getUserVote(pollId: string): string[] | null {
  const votes = JSON.parse(localStorage.getItem(POLL_VOTES_KEY) || '{}');
  const userVoteKey = `${pollId}_${currentUser.id}`;
  return votes[userVoteKey] || null;
}

export function closePoll(pollId: string): Poll {
  const polls = listPolls();
  const pollIndex = polls.findIndex(p => p.id === pollId);
  
  if (pollIndex === -1) {
    throw new Error('Poll not found');
  }
  
  polls[pollIndex].status = 'completed';
  localStorage.setItem(POLLS_KEY, JSON.stringify(polls));
  
  return polls[pollIndex];
}

// Unified feed
export function listFeed(): FeedItem[] {
  const posts = listPosts();
  const polls = listPolls();
  
  const allItems: FeedItem[] = [...posts, ...polls];
  return allItems.sort((a, b) => b.createdAt - a.createdAt);
}

// Get current user
export function getCurrentUser() {
  return currentUser;
}