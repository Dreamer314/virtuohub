import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Calendar, Clock, User, Heart, MessageCircle, Share2, BookOpen } from 'lucide-react';
import { Link } from 'wouter';
import { formatDistanceToNow } from 'date-fns';
import type { PostWithAuthor } from '@shared/schema';

export default function InsightsPage() {
  const { data: posts = [], isLoading } = useQuery<PostWithAuthor[]>({
    queryKey: ['/api/posts'],
  });

  const insightPosts = posts.filter(post => post.type === 'insight');

  const getArticleSlug = (postId: string) => {
    switch (postId) {
      case 'post4': return 'breaking-creative-blocks-with-ai-tools';
      case 'post5': return 'from-sims-modding-to-virtual-world-design';
      case 'post6': return 'the-future-of-virtual-fashion';
      default: return '';
    }
  };

  // Interview and article data for Creator Insights
  const interviewData = [
    {
      id: 'interview1',
      name: 'Emma Thompson',
      title: 'Environment Artist',
      subtitle: 'Crafting Immersive Realms in VRChat',
      image: '/images/emma-thompson.png',
      type: 'Interview',
      postId: 'post4'
    },
    {
      id: 'interview2', 
      name: 'Alex Martinez',
      title: '3D Artist',
      subtitle: 'Building Engaging Games on Roblox',
      image: '/images/alex-martinez.png',
      type: 'Interview',
      postId: 'post5'
    },
    {
      id: 'interview3',
      name: 'Sarah Chen',
      title: 'Avatar Creator', 
      subtitle: 'Cyberpunk Aesthetic in VRChat',
      image: '/images/sarah-chen.png',
      type: 'Interview',
      postId: 'post6'
    },
    {
      id: 'interview4',
      name: 'Doux',
      title: 'Designer',
      subtitle: 'Building a Brand in Second Life',
      image: '/images/3d-artist.png',
      type: 'Interview',
      postId: 'post4'
    },
    {
      id: 'interview5',
      name: 'Tom Wheeler',
      title: 'World Builder',
      subtitle: 'Creating Interactive Environments',
      image: '/images/tom-wheeler.png',
      type: 'Interview',
      postId: 'post5'
    },
    {
      id: 'interview6',
      name: 'Mike Rodriguez',
      title: 'Game Developer', 
      subtitle: 'Developing Adventures for Roblox',
      image: '/images/mike-rodriguez.png',
      type: 'Interview',
      postId: 'post6'
    }
  ];

  const articleData = [
    {
      id: 'article1',
      title: 'Breaking Creative Blocks with AI Tools',
      excerpt: 'Alex Chen shares how he uses generative AI to speed up concept art workflows — without losing the human touch.',
      image: '/images/unity-metaverse.png',
      author: 'Alex Chen',
      readTime: 8,
      type: 'Article',
      postId: 'post4'
    },
    {
      id: 'article2',
      title: 'The Future of Virtual Fashion',
      excerpt: 'Digital clothing designer Maria Lopez explains how her designs are crossing into AR and real-world production.',
      image: '/images/vrchat-world.png', 
      author: 'Maria Lopez',
      readTime: 12,
      type: 'Article',
      postId: 'post6'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <Link href="/">
              <Button variant="ghost" className="mb-6 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Community
              </Button>
            </Link>
            
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-6 gradient-text">Creator Insights</h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Interviews with creators from across virtual worlds
              </p>
              <p className="text-base text-muted-foreground max-w-4xl mx-auto mt-4 leading-relaxed">
                In-depth conversations with innovative creators sharing their stories, experiences, and advice. Explore how they are shaping the future of virtual world content creation.
              </p>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="glass-card animate-pulse">
                  <div className="h-64 bg-muted rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-muted rounded w-full mb-2"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Interviews Grid */}
          {!isLoading && (
            <div className="space-y-16">
              {/* Interview Cards */}
              <div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {interviewData.map((interview) => (
                    <Card key={interview.id} className="glass-card hover-lift overflow-hidden group border-2 border-border/20 hover:border-accent/40 transition-all duration-300 bg-gradient-to-br from-card/95 to-card/85">
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={interview.image}
                          alt={interview.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        
                        {/* Name and title overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h3 className="text-2xl font-bold mb-1">{interview.name}</h3>
                          <p className="text-lg font-medium text-gray-200 mb-2">{interview.title}</p>
                          <p className="text-sm text-gray-300 leading-relaxed">{interview.subtitle}</p>
                        </div>

                        {/* Type badge */}
                        <div className="absolute top-4 left-4">
                          <span className="bg-accent/90 text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                            {interview.type}
                          </span>
                        </div>
                      </div>
                      
                      <CardContent className="p-6">
                        <Link href={`/article/${getArticleSlug(interview.postId)}`}>
                          <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium">
                            Read Full Interview →
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Articles Section */}
              <div>
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold mb-4">Featured Articles</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Deep dives into industry trends, technical guides, and analytical pieces from our editorial team.
                  </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                  {articleData.map((article) => (
                    <Card key={article.id} className="glass-card hover-lift overflow-hidden group border-2 border-border/20 hover:border-primary/40 transition-all duration-300 bg-gradient-to-br from-card/95 to-card/85">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        
                        {/* Type badge */}
                        <div className="absolute top-4 left-4">
                          <span className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                            {article.type}
                          </span>
                        </div>
                      </div>
                      
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                          {article.title}
                        </h3>
                        
                        <p className="text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                          {article.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-6">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{article.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{article.readTime} min read</span>
                            </div>
                          </div>
                        </div>

                        <Link href={`/article/${getArticleSlug(article.postId)}`}>
                          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Read Full Article →
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && insightPosts.length === 0 && interviewData.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold mb-4">No insights available yet</h3>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                Check back soon for more creator insights and interviews.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}