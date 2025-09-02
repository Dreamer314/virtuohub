import React from 'react';
import { useParams, Link } from 'wouter';
import { ArrowLeft, MessageSquare, Users } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { Footer } from '@/components/layout/footer';
import { EngagementSection } from '@/components/engagement-section';

const InterviewDetailPage: React.FC = () => {
  const { id } = useParams();

  // For demo purposes, we'll have predefined interview data
  const interviews = {
    'alex-chen-vrchat-worlds': {
      title: 'Building Community Through Virtual Worlds',
      subtitle: 'A conversation with VRChat world creator Alex Chen about fostering meaningful connections in virtual spaces',
      author: 'Alex Chen',
      role: 'VRChat World Creator',
      date: 'Dec 28, 2024',
      readTime: '8 min read',
      heroImage: 'from-purple-600 via-blue-600 to-indigo-700',
      heroIcon: '🌍',
      stats: '2.5M world visits • 15K followers',
      tags: ['VRChat', 'World Building', 'Community'],
      questions: [
        {
          question: "How did you get started in VRChat world creation?",
          answer: "I started about three years ago when I was looking for a creative outlet during the pandemic. I had some background in 3D modeling from college, but VRChat was my first real dive into interactive world building. What drew me in was the immediate feedback from users - you can see people enjoying your space in real-time, which is incredibly rewarding."
        },
        {
          question: "What makes a VRChat world successful in building community?",
          answer: "The key is creating spaces that encourage interaction without forcing it. I design areas where people naturally gather - cozy seating arrangements, interesting visual focal points, activities that require collaboration. But you also need quiet spaces for intimate conversations. The most successful worlds feel like they have a soul, not just impressive visuals."
        },
        {
          question: "Can you walk us through your creative process?",
          answer: "I always start with the emotional experience I want to create. Do I want people to feel wonder, comfort, excitement? Once I have that, I sketch out the flow - how people will move through the space, where they'll stop, what will catch their attention. Then comes the technical work in Unity, but the emotion and flow come first. I also test extensively with friends before public release."
        },
        {
          question: "What's been your biggest challenge as a creator?",
          answer: "Balancing performance optimization with visual ambition. VRChat has strict performance limits, and when you're trying to create something breathtaking, those constraints can feel limiting. But they've also made me a better designer - you learn to achieve maximum impact with minimal resources. Every polygon has to earn its place."
        },
        {
          question: "Where do you see the future of social VR heading?",
          answer: "I think we're moving toward more persistent, evolving worlds. Instead of static environments, we'll see worlds that change based on community activity, seasons, events. AI will play a role too - imagine worlds that adapt to the social dynamics of who's currently present. The line between creator and user will blur as everyone becomes a contributor to the space."
        }
      ],
      keyTakeaways: [
        "Emotional experience should drive technical decisions",
        "Community spaces need both gathering areas and intimate corners", 
        "Performance constraints can spark creative solutions",
        "Real-time user feedback is invaluable for iteration"
      ],
      likes: 287,
      comments: [
        {
          id: '1',
          author: 'WorldBuilder_Sarah',
          content: 'This is so insightful! The part about designing emotional experiences first really resonates with me. I\'ve been focusing too much on technical specs.',
          timestamp: '2 hours ago',
          likes: 34
        },
        {
          id: '2', 
          author: 'VR_Mike_Dev',
          content: 'Alex\'s Neon District world is one of my favorites. The way people naturally gather around the fountain area is brilliant design.',
          timestamp: '4 hours ago',
          likes: 28
        },
        {
          id: '3',
          author: 'CreativePixie',
          content: 'Love the emphasis on performance optimization. So many creators ignore this and wonder why their worlds feel empty.',
          timestamp: '6 hours ago', 
          likes: 19
        }
      ]
    }
  };

  const interview = interviews[id as keyof typeof interviews];

  if (!interview) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Interview not found</h1>
          <Link href="/interviews" className="text-cyan-500 hover:underline">
            ← Back to Interviews
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header onCreatePost={() => {}} />
      
      <div className="community-grid">
        <div className="grid-left hidden xl:block bg-background/95 backdrop-blur-sm border-r border-border sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] z-10 overflow-y-auto">
          <div className="p-4">
            <LeftSidebar currentTab="all" onTabChange={() => {}} />
          </div>
        </div>
        
        <div className="grid-right hidden lg:block bg-background/95 backdrop-blur-sm border-l border-border sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] z-10 overflow-y-auto">
          <div className="p-4">
            <RightSidebar />
          </div>
        </div>

        <div className="grid-main relative z-0">
          <div className="py-8 relative z-10 px-4 lg:px-8">
            <div className="w-full">
              <div className="max-w-4xl mx-auto">
                
                {/* Back Navigation */}
                <Link href="/interviews" className="inline-flex items-center text-cyan-500 hover:text-cyan-400 transition-colors mb-8 group">
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Back to Interviews
                </Link>

                {/* Hero Section */}
                <article className="glass-card rounded-xl overflow-hidden border border-cyan-500/30 mb-8">
                  <div className={`w-full h-80 bg-gradient-to-br ${interview.heroImage} relative flex items-center justify-center`}>
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="relative z-10 text-center px-8">
                      <span className="text-6xl mb-4 block">{interview.heroIcon}</span>
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-cyan-500/30 text-cyan-200 border border-cyan-400/30 rounded-full mb-4">Interview</span>
                      <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                        {interview.title}
                      </h1>
                      <p className="text-cyan-200 text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto">
                        {interview.subtitle}
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    {/* Author Info */}
                    <div className="flex items-center justify-between flex-wrap gap-4 mb-8 pb-6 border-b border-border">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {interview.author.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{interview.author}</div>
                          <div className="text-sm text-muted-foreground">{interview.role}</div>
                          <div className="text-sm text-muted-foreground">{interview.stats}</div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div>{interview.date}</div>
                        <div>{interview.readTime}</div>
                      </div>
                    </div>

                    {/* Interview Content */}
                    <div className="prose prose-invert max-w-none">
                      {interview.questions.map((qa, index) => (
                        <div key={index} className="mb-8">
                          <h3 className="text-xl font-semibold text-foreground mb-4 flex items-start gap-3">
                            <MessageSquare className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
                            {qa.question}
                          </h3>
                          <div className="ml-8 text-muted-foreground leading-relaxed text-lg">
                            {qa.answer}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Key Takeaways */}
                    <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-6 border border-cyan-500/20 mb-8">
                      <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-cyan-500" />
                        Key Takeaways
                      </h3>
                      <ul className="space-y-3">
                        {interview.keyTakeaways.map((takeaway, index) => (
                          <li key={index} className="flex items-start gap-3 text-muted-foreground">
                            <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2.5 flex-shrink-0"></div>
                            {takeaway}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tags */}
                    <div className="flex gap-2 mb-8">
                      {interview.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Engagement Section */}
                    <EngagementSection 
                      contentId={`interview-${id}`}
                      contentType="interview"
                      initialLikes={interview.likes}
                      initialComments={interview.comments}
                    />
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default InterviewDetailPage;