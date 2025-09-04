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
  if (!localStorage.getItem(POSTS_KEY)) {
    const seedPosts: Post[] = [
      {
        id: 'post1',
        type: 'post',
        title: 'New VRC World - Cyberpunk Coffee Shop',
        body: 'Just finished my latest VRChat world! It\'s a cozy cyberpunk-themed coffee shop perfect for hanging out with friends. Features include interactive furniture, ambient lighting, and a custom soundtrack.',
        links: ['https://vrchat.com/home/world/wrld_example'],
        images: [],
        files: [],
        category: 'General',
        platforms: ['vrchat'],
        createdAt: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
        author: currentUser,
        stats: { likes: 0, saves: 0, comments: 0 }
      },
      {
        id: 'post2',
        type: 'post',
        title: 'Commission: Custom Avatar Textures',
        body: 'Offering custom avatar texture work for Second Life and VRChat. Specializing in realistic skin tones, fantasy designs, and clothing textures. Quick turnaround, affordable prices.',
        links: [],
        images: [],
        files: [],
        price: '$25-75',
        category: 'Jobs & Gigs',
        platforms: ['secondlife', 'vrchat'],
        createdAt: Date.now() - 4 * 60 * 60 * 1000, // 4 hours ago
        author: { id: 'user2', name: 'Maya Rodriguez' },
        stats: { likes: 0, saves: 0, comments: 0 }
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
          { id: 'opt1', label: 'Avatar accessories & clothing', votes: 12 },
          { id: 'opt2', label: 'World environments & buildings', votes: 8 },
          { id: 'opt3', label: 'Interactive objects & scripts', votes: 5 },
          { id: 'opt4', label: 'Art galleries & exhibitions', votes: 3 }
        ],
        allowMultiple: false,
        showResults: 'after-vote',
        closesAt: now + 3 * 24 * 60 * 60 * 1000, // 3 days from now
        category: 'General',
        platforms: ['vrchat', 'secondlife', 'roblox'],
        createdAt: now - 1 * 60 * 60 * 1000, // 1 hour ago
        author: { id: 'user3', name: 'Jordan Kim' },
        status: 'active'
      },
      {
        id: 'poll2',
        type: 'poll',
        question: 'Which platform has the best creation tools in 2024?',
        options: [
          { id: 'opt1', label: 'Unity (for VRChat/Horizon)', votes: 45 },
          { id: 'opt2', label: 'Roblox Studio', votes: 38 },
          { id: 'opt3', label: 'Second Life Builder', votes: 22 },
          { id: 'opt4', label: 'Unreal Engine', votes: 15 }
        ],
        allowMultiple: false,
        showResults: 'after-vote',
        closesAt: now - 1 * 24 * 60 * 60 * 1000, // 1 day ago (completed)
        category: 'General',
        platforms: ['unity', 'roblox', 'secondlife', 'unreal'],
        createdAt: now - 8 * 24 * 60 * 60 * 1000, // 8 days ago
        author: { id: 'user4', name: 'Sam Rivera' },
        status: 'completed'
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