import { nanoid } from 'nanoid';
import type { Post, Poll, PollOption, FeedItem } from '@/types/content';

const STORAGE_KEYS = {
  POLLS: 'vhub.polls',
  POSTS: 'vhub.posts',
  POLL_VOTES: 'vhub.pollVotes'
};

// Current user stub
const currentUser = {
  id: 'user1',
  name: 'Alex Chen',
  avatar: ''
};

class MockAPI {
  // Poll functions
  listPolls(): Poll[] {
    const polls = this.getStoredData<Poll[]>(STORAGE_KEYS.POLLS, []);
    return polls.map(this.derivePollStatus);
  }

  listActivePolls(): Poll[] {
    return this.listPolls().filter(poll => poll.status === 'active');
  }

  listCompletedPolls(): Poll[] {
    return this.listPolls().filter(poll => poll.status === 'completed');
  }

  createPoll(input: Omit<Poll, 'id' | 'createdAt' | 'status'>): Poll {
    const poll: Poll = {
      ...input,
      id: nanoid(),
      createdAt: Date.now(),
      status: Date.now() < input.closesAt ? 'active' : 'completed'
    };

    const polls = this.getStoredData<Poll[]>(STORAGE_KEYS.POLLS, []);
    polls.unshift(poll);
    this.setStoredData(STORAGE_KEYS.POLLS, polls);

    return poll;
  }

  votePoll(pollId: string, optionIds: string[]): Poll {
    const polls = this.getStoredData<Poll[]>(STORAGE_KEYS.POLLS, []);
    const pollIndex = polls.findIndex(p => p.id === pollId);
    
    if (pollIndex === -1) {
      throw new Error('Poll not found');
    }

    const poll = polls[pollIndex];
    
    // Check if already voted
    const votes = this.getStoredData<Record<string, string[]>>(STORAGE_KEYS.POLL_VOTES, {});
    const userKey = `${pollId}_${currentUser.id}`;
    
    if (votes[userKey]) {
      throw new Error('You have already voted on this poll');
    }

    // Update vote counts
    optionIds.forEach(optionId => {
      const option = poll.options.find(o => o.id === optionId);
      if (option) {
        option.votes += 1;
      }
    });

    // Record the vote
    votes[userKey] = optionIds;
    this.setStoredData(STORAGE_KEYS.POLL_VOTES, votes);
    this.setStoredData(STORAGE_KEYS.POLLS, polls);

    return this.derivePollStatus(poll);
  }

  hasVoted(pollId: string): boolean {
    const votes = this.getStoredData<Record<string, string[]>>(STORAGE_KEYS.POLL_VOTES, {});
    const userKey = `${pollId}_${currentUser.id}`;
    return !!votes[userKey];
  }

  getUserVote(pollId: string): string[] | null {
    const votes = this.getStoredData<Record<string, string[]>>(STORAGE_KEYS.POLL_VOTES, {});
    const userKey = `${pollId}_${currentUser.id}`;
    return votes[userKey] || null;
  }

  closePoll(pollId: string): Poll {
    const polls = this.getStoredData<Poll[]>(STORAGE_KEYS.POLLS, []);
    const pollIndex = polls.findIndex(p => p.id === pollId);
    
    if (pollIndex === -1) {
      throw new Error('Poll not found');
    }

    polls[pollIndex].status = 'completed';
    this.setStoredData(STORAGE_KEYS.POLLS, polls);

    return polls[pollIndex];
  }

  // Post functions
  listPosts(): Post[] {
    return this.getStoredData<Post[]>(STORAGE_KEYS.POSTS, []);
  }

  createFeedPost(input: Omit<Post, 'id' | 'createdAt' | 'stats'>): Post {
    const post: Post = {
      ...input,
      id: nanoid(),
      createdAt: Date.now(),
      stats: { likes: 0, saves: 0, comments: 0 }
    };

    const posts = this.getStoredData<Post[]>(STORAGE_KEYS.POSTS, []);
    posts.unshift(post);
    this.setStoredData(STORAGE_KEYS.POSTS, posts);

    return post;
  }

  // Unified feed
  listFeed(): FeedItem[] {
    const posts = this.listPosts();
    const polls = this.listPolls();
    
    const allItems: FeedItem[] = [...posts, ...polls];
    return allItems.sort((a, b) => b.createdAt - a.createdAt);
  }

  // Initialize with seed data
  initializeSeedData(): void {
    // Only seed if no data exists
    if (this.listPolls().length === 0 && this.listPosts().length === 0) {
      this.seedPolls();
      this.seedPosts();
    }
  }

  private seedPolls(): void {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;

    // Active polls
    this.createPoll({
      type: 'poll',
      question: 'What is your primary development platform for virtual worlds?',
      options: [
        { id: nanoid(), label: 'Unity 3D', votes: 42 },
        { id: nanoid(), label: 'Unreal Engine', votes: 28 },
        { id: nanoid(), label: 'Roblox Studio', votes: 35 },
        { id: nanoid(), label: 'VRChat SDK', votes: 18 }
      ],
      allowMultiple: false,
      showResults: 'after-vote',
      closesAt: now + (3 * day),
      category: 'General',
      platforms: ['unity', 'unreal', 'roblox', 'vrchat'],
      author: currentUser
    });

    this.createPoll({
      type: 'poll',
      question: 'Which monetization strategy works best for your virtual content?',
      options: [
        { id: nanoid(), label: 'Direct asset sales', votes: 67 },
        { id: nanoid(), label: 'Subscription model', votes: 23 },
        { id: nanoid(), label: 'Commission work', votes: 45 },
        { id: nanoid(), label: 'Event hosting', votes: 12 }
      ],
      allowMultiple: true,
      showResults: 'after-vote',
      closesAt: now + (5 * day),
      category: 'Jobs & Gigs',
      platforms: ['other'],
      author: currentUser
    });

    // Completed polls
    this.createPoll({
      type: 'poll',
      question: 'How many hours per week do you spend on virtual world development?',
      options: [
        { id: nanoid(), label: 'Less than 5 hours', votes: 156 },
        { id: nanoid(), label: '5-15 hours', votes: 234 },
        { id: nanoid(), label: '15-30 hours', votes: 189 },
        { id: nanoid(), label: 'More than 30 hours', votes: 98 }
      ],
      allowMultiple: false,
      showResults: 'after-vote',
      closesAt: now - (2 * day),
      category: 'General',
      platforms: ['other'],
      author: currentUser
    });
  }

  private seedPosts(): void {
    this.createFeedPost({
      type: 'post',
      title: 'New VRChat world template available',
      body: 'Just released a comprehensive world template for VRChat creators. Includes advanced lighting setup, interactive elements, and optimization tips.',
      links: ['https://github.com/example/vrchat-template'],
      images: [],
      files: [],
      price: 'Free',
      category: 'Assets for Sale',
      platforms: ['vrchat'],
      author: currentUser
    });

    this.createFeedPost({
      type: 'post',
      title: 'Looking for Unity developers for metaverse project',
      body: 'We are building an educational metaverse platform and need experienced Unity developers. Remote work available.',
      links: [],
      images: [],
      files: [],
      category: 'Jobs & Gigs',
      platforms: ['unity'],
      author: currentUser
    });
  }

  // Helper methods
  private derivePollStatus(poll: Poll): Poll {
    return {
      ...poll,
      status: Date.now() < poll.closesAt ? 'active' : 'completed'
    };
  }

  private getStoredData<T>(key: string, defaultValue: T): T {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setStoredData(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }
}

export const mockApi = new MockAPI();

// Initialize seed data on first import
mockApi.initializeSeedData();