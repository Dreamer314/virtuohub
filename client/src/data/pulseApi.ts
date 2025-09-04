export type PollOption = { label: string; votes: number };

export type Poll = {
  id: string;               // e.g. "poll_abc123"
  slug: string;             // for routes if needed
  question: string;
  options: PollOption[];    // length 2..6
  createdAt: number;        // ms
  endsAt: number;           // ms in the future
  tags?: string[];          // optional labels
};

export type Report = {
  id: string;
  title: string;
  summary: string;
  releasedAt: number;
  priceType: 'free' | 'paid' | 'private';
  priceCents?: number;      // required if paid
  badges?: string[];        // e.g. ["Platform Data", "Usage"]
  downloadUrl?: string;     // only for free or purchased
};

type Store = {
  polls: Poll[];
  reports: Report[];
  featuredPollIds: string[]; // controls which polls appear in Community widget
  userVotes: Record<string, number>; // pollId -> optionIndex for this browser
};

const STORAGE_KEY = 'vhub.pulse';

// Initialize BroadcastChannel for cross-tab sync
const ch = new BroadcastChannel('vhub-pulse');

function notify(topic: string, payload?: any) {
  ch.postMessage({ topic, payload });
}

// Helper to get initial store data
function getInitialStore(): Store {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  
  return {
    polls: [
      // Active polls (2)
      {
        id: 'poll_platform_creation',
        slug: 'platform-creation',
        question: "What's your preferred platform for virtual world creation?",
        options: [
          { label: 'Unity', votes: 0 },
          { label: 'Unreal Engine', votes: 0 },
          { label: 'Blender', votes: 0 }
        ],
        createdAt: now - (8 * 60 * 60 * 1000), // 8 hours ago
        endsAt: now + (2 * dayMs), // 2 days from now
        tags: ['development', 'tools']
      },
      {
        id: 'poll_revenue_stream',
        slug: 'revenue-stream',
        question: "What's your primary revenue stream in virtual worlds?",
        options: [
          { label: 'Asset sales', votes: 127 },
          { label: 'Virtual events', votes: 85 },
          { label: 'Commissions', votes: 71 },
          { label: 'Consulting', votes: 23 }
        ],
        createdAt: now - (2 * dayMs),
        endsAt: now + (5 * dayMs), // 5 days from now
        tags: ['monetization', 'business']
      },
      
      // Completed polls (4)
      {
        id: 'poll_creation_tools',
        slug: 'creation-tools',
        question: "Which creation tool do you use most?",
        options: [
          { label: 'Unity', votes: 2371 },
          { label: 'Blender', votes: 1274 },
          { label: 'Unreal Engine', votes: 917 }
        ],
        createdAt: now - (30 * dayMs),
        endsAt: now - (10 * dayMs), // ended 10 days ago
        tags: ['tools', 'development']
      },
      {
        id: 'poll_time_spent',
        slug: 'time-spent',
        question: "How many hours per week do you spend creating?",
        options: [
          { label: '5-10 hours', votes: 1361 },
          { label: '20+ hours (Full-time)', votes: 1324 },
          { label: '10-20 hours', votes: 1206 }
        ],
        createdAt: now - (25 * dayMs),
        endsAt: now - (5 * dayMs), // ended 5 days ago
        tags: ['time', 'dedication']
      },
      {
        id: 'poll_biggest_challenge',
        slug: 'biggest-challenge',
        question: "What's your biggest creation challenge?",
        options: [
          { label: 'Learning new tools', votes: 2198 },
          { label: 'Finding time', votes: 1727 },
          { label: 'Technical limitations', votes: 1309 }
        ],
        createdAt: now - (20 * dayMs),
        endsAt: now - (1 * dayMs), // ended 1 day ago
        tags: ['challenges', 'development']
      },
      {
        id: 'poll_monetization_model',
        slug: 'monetization-model',
        question: "Which monetization model works best?",
        options: [
          { label: 'One-time purchases', votes: 1044 },
          { label: 'Subscriptions', votes: 857 },
          { label: 'Commission-based', votes: 777 }
        ],
        createdAt: now - (15 * dayMs),
        endsAt: now - (3 * dayMs), // ended 3 days ago
        tags: ['monetization', 'business']
      }
    ],
    reports: [
      // Free report
      {
        id: 'report_q4_trends',
        title: 'Q4 2024 Platform Usage Trends',
        summary: 'Analysis of user engagement patterns across major virtual world platforms. Based on 15,000+ creator responses.',
        releasedAt: now - (3 * dayMs),
        priceType: 'free',
        badges: ['Platform Data', 'Usage Analytics'],
        downloadUrl: '/reports/q4-2024-platform-trends.pdf'
      },
      
      // Paid report
      {
        id: 'report_2025_forecast',
        title: '2025 Immersive Economy Forecast',
        summary: 'Comprehensive market analysis with revenue projections, emerging platform insights, and strategic recommendations for creators.',
        releasedAt: now + (12 * dayMs), // Available in 12 days
        priceType: 'paid',
        priceCents: 2900, // $29.00
        badges: ['Market Analysis', 'Forecasting']
      },
      
      // Private report
      {
        id: 'report_enterprise_insights',
        title: 'Enterprise Adoption Patterns',
        summary: 'Confidential analysis of how Fortune 500 companies are integrating virtual world technologies into their operations.',
        releasedAt: now - (7 * dayMs),
        priceType: 'private',
        badges: ['Enterprise', 'Confidential']
      }
    ],
    featuredPollIds: ['poll_platform_creation'], // Featured in community widget
    userVotes: {}
  };
}

export const pulseApi = {
  // Load and save
  getStore(): Store {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const initial = getInitialStore();
      this.saveStore(initial);
      return initial;
    }
    return JSON.parse(stored);
  },

  saveStore(next: Store): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    notify('pulse:changed');
  },

  // Polls
  listActivePolls(now = Date.now()): Poll[] {
    const store = this.getStore();
    return store.polls
      .filter(poll => poll.endsAt > now)
      .sort((a, b) => a.endsAt - b.endsAt); // soonest first
  },

  listCompletedPolls(now = Date.now()): Poll[] {
    const store = this.getStore();
    return store.polls
      .filter(poll => poll.endsAt <= now)
      .sort((a, b) => b.endsAt - a.endsAt); // newest ended first
  },

  getPoll(id: string): Poll | undefined {
    const store = this.getStore();
    return store.polls.find(poll => poll.id === id);
  },

  upsertPoll(p: Poll): Poll {
    const store = this.getStore();
    const index = store.polls.findIndex(poll => poll.id === p.id);
    if (index >= 0) {
      store.polls[index] = p;
    } else {
      store.polls.push(p);
    }
    this.saveStore(store);
    return p;
  },

  vote(pollId: string, optionIndex: number): Poll {
    const store = this.getStore();
    
    // Check if already voted
    if (store.userVotes[pollId] !== undefined) {
      throw new Error('You have already voted on this poll');
    }
    
    const poll = store.polls.find(p => p.id === pollId);
    if (!poll) {
      throw new Error('Poll not found');
    }
    
    // Check if poll is expired
    if (poll.endsAt <= Date.now()) {
      throw new Error('This poll has ended');
    }
    
    // Check if option index is valid
    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      throw new Error('Invalid option');
    }
    
    // Record vote
    poll.options[optionIndex].votes += 1;
    store.userVotes[pollId] = optionIndex;
    
    this.saveStore(store);
    return poll;
  },

  hasVoted(pollId: string): boolean {
    const store = this.getStore();
    return store.userVotes[pollId] !== undefined;
  },

  // Featured controls Community widget
  listFeaturedPolls(): Poll[] {
    const store = this.getStore();
    return store.featuredPollIds
      .map(id => store.polls.find(poll => poll.id === id))
      .filter((poll): poll is Poll => poll !== undefined);
  },

  setFeaturedPollIds(ids: string[]): void {
    const store = this.getStore();
    store.featuredPollIds = ids;
    this.saveStore(store);
  },

  // Reports
  listReports(): Report[] {
    const store = this.getStore();
    return [...store.reports].sort((a, b) => b.releasedAt - a.releasedAt);
  },

  getReport(id: string): Report | undefined {
    const store = this.getStore();
    return store.reports.find(report => report.id === id);
  },

  upsertReport(r: Report): Report {
    const store = this.getStore();
    const index = store.reports.findIndex(report => report.id === r.id);
    if (index >= 0) {
      store.reports[index] = r;
    } else {
      store.reports.push(r);
    }
    this.saveStore(store);
    return r;
  }
};

// Subscribe helper for UI updates
export function subscribe(callback: () => void): () => void {
  const handleMessage = () => callback();
  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback();
  };
  
  ch.addEventListener('message', handleMessage);
  window.addEventListener('storage', handleStorage);
  
  return () => {
    ch.removeEventListener('message', handleMessage);
    window.removeEventListener('storage', handleStorage);
  };
}