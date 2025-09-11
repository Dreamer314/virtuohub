import { type User, type Post, type Article, type Comment } from "@shared/schema";

export function getSampleUsers(): User[] {
  return [
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
      username: 'alex_kim',
      password: 'password',
      displayName: 'Alex Kim',
      avatar: '/images/vr-dev.png',
      bio: 'VR Developer creating immersive experiences',
      role: 'VR Developer',
      createdAt: new Date(),
    },
    {
      id: 'user4',
      username: 'emma_wilson',
      password: 'password',
      displayName: 'Emma Wilson',
      avatar: '/images/ui-designer.png',
      bio: 'UI/UX Designer for virtual worlds',
      role: 'UI/UX Designer',
      createdAt: new Date(),
    },
    {
      id: 'user5',
      username: 'jordan_lee',
      password: 'password',
      displayName: 'Jordan Lee',
      avatar: '/images/animator.png',
      bio: 'Animator bringing virtual characters to life',
      role: 'Animator',
      createdAt: new Date(),
    }
  ];
}

export function getSamplePosts(): Post[] {
  return [
    {
      id: 'post1',
      authorId: 'user1',
      subtype: 'thread',
      title: 'New VRChat Avatar Collection - Fantasy Series',
      summary: 'Latest avatar collection featuring fantasy creatures with custom animations',
      body: 'Just released my latest avatar collection featuring fantasy creatures! Each avatar comes with custom animations and gesture support. Perfect for D&D roleplay sessions in VRChat.',
      tags: ['avatars', 'fantasy', 'vrchat'],
      platforms: ['VRChat'],
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop&crop=center',
      images: [],
      files: [],
      links: ['https://gumroad.com/sarah-avatars'],
      price: '$25 - $45 per avatar',
      status: 'published',
      subtypeData: null,
      likes: 156,
      comments: 23,
      shares: 12,
      views: 450,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    // VHub Pulse Poll Posts
    {
      id: 'pulse1',
      authorId: 'user2',
      subtype: 'poll',
      title: 'Which platform offers the best creator monetization?',
      summary: 'Community poll on creator monetization across platforms',
      body: 'With recent changes to creator programs across platforms, curious to see where the community thinks we can best monetize our work. This will help inform our 2024 strategy.',
      tags: ['monetization', 'platforms', 'creators'],
      platforms: ['Other'],
      imageUrl: '',
      images: [],
      files: [],
      links: [],
      price: '',
      status: 'published',
      subtypeData: {
        question: 'Which platform offers the best creator monetization?',
        choices: [
          { text: 'Roblox DevEx Program', votes: 234, id: 'choice1' },
          { text: 'VRChat Creator Economy', votes: 156, id: 'choice2' },
          { text: 'Second Life Marketplace', votes: 89, id: 'choice3' },
          { text: 'Unity Asset Store', votes: 78, id: 'choice4' }
        ],
        closesAt: new Date('2024-02-01').getTime(),
        oneVotePerUser: true
      },
      likes: 89,
      comments: 45,
      shares: 67,
      views: 1200,
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-18'),
    },
    // Creator Insights Interview Posts
    {
      id: 'insight1',
      authorId: 'user3',
      subtype: 'interview',
      title: 'From Hobby to Full-Time: Building VR Experiences',
      summary: 'Journey from weekend VR hobbyist to running a 12-person studio',
      body: 'Started as a weekend hobby, now running a VR studio with 12 employees. Here\'s what I learned about scaling creative work in virtual spaces.',
      tags: ['vr', 'entrepreneurship', 'scaling', 'studio'],
      platforms: ['VRChat', 'Other'],
      imageUrl: 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=800&h=600&fit=crop&crop=center',
      images: [],
      files: [],
      links: ['https://alexvr.studio'],
      price: '',
      status: 'published',
      subtypeData: {
        intervieweeId: 'user3',
        interviewerRole: 'VHub Editorial',
        duration: '45 mins',
        topics: ['scaling', 'team building', 'vr development']
      },
      likes: 445,
      comments: 78,
      shares: 156,
      views: 2100,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10'),
    }
  ];
}

export function getSampleArticles(): Article[] {
  return [
    {
      id: 'article1',
      postId: 'insight1',
      slug: 'from-hobby-to-fulltime-building-vr-experiences',
      excerpt: 'Alex Kim shares the journey from weekend VR hobbyist to running a 12-person studio, including key lessons about scaling creative work in virtual spaces.',
      seoTitle: 'From Hobby to Full-Time: Building VR Experiences | VirtuoHub',
      seoDescription: 'Learn how Alex Kim transformed weekend VR experiments into a 12-person studio, with practical insights on scaling creative work in virtual spaces.',
      fullContent: `# From Hobby to Full-Time: Building VR Experiences

## The Beginning

What started as weekend experiments with Unity turned into something I never expected. Like many creators in this space, I was just passionate about building things that didn't exist yet.

## Finding My Niche

The breakthrough came when I realized that most VR experiences were missing something crucial: genuine human connection. That's when I started focusing on social VR spaces that felt lived-in rather than just visited.

## Scaling the Team

Growing from solo creator to team leader meant learning entirely new skills:

- **Delegation without losing creative vision**
- **Building systems that maintain quality at scale** 
- **Creating a culture where creativity thrives under deadlines**

The hardest part wasn't the technical challenges—it was learning to trust others with the vision that started in my head.

## Key Lessons

### 1. Start with Community
Your first users become your best advocates. We spent months in VRChat just talking to people, understanding what they actually wanted from virtual spaces.

### 2. Embrace Constraints
Limited budgets force creative solutions. Some of our best innovations came from working around technical limitations rather than trying to build the "perfect" experience.

### 3. Balance Vision with Feedback
Stay true to your core vision while being flexible about execution. The community will guide you toward solutions you never would have considered.

## Looking Forward

We're now working on experiences that blur the line between virtual and physical spaces. The goal isn't just to create another virtual world—it's to build spaces where real relationships and meaningful experiences can flourish.

*The virtual world creation landscape is evolving rapidly. What started as individual passion projects are becoming the foundation for entirely new forms of human connection and creative expression.*`,
      tags: ['VR', 'Entrepreneurship', 'Team Building', 'Community'],
      publishDate: new Date('2024-01-10'),
      readTime: 8,
      createdAt: new Date('2024-01-10'),
    }
  ];
}

export function getSampleComments(): Comment[] {
  return [
    {
      id: 'comment1',
      postId: null,
      articleId: 'article1',
      authorId: 'user1',
      content: 'This really resonates with my experience! The community-first approach is so important. Started with VRChat avatars and the feedback loop with users was everything.',
      parentId: null,
      likes: 12,
      createdAt: new Date('2024-01-11'),
    },
    {
      id: 'comment2',
      postId: null,
      articleId: 'article1',
      authorId: 'user2',
      content: 'Great insights on team scaling. Curious about your revenue model - how do you balance creative freedom with commercial viability?',
      parentId: null,
      likes: 8,
      createdAt: new Date('2024-01-12'),
    },
    {
      id: 'comment3',
      postId: null,
      articleId: 'article1',
      authorId: 'user3',
      content: 'Thanks for the question! We use a mixed model - some client work to fund experimental projects. Key is setting clear boundaries about which projects are pure R&D.',
      parentId: 'comment2',
      likes: 15,
      createdAt: new Date('2024-01-12'),
    }
  ];
}